import express from "express"
import { PrismaClient } from "@prisma/client"
import cors from "cors"
import { v4 as uuidv4 } from "uuid"
import path from "path"
import { fileURLToPath } from "url"
import dotenv from "dotenv"
import multer from "multer"
import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import process from "process"

// Configuración para ES Modules (equivalente a __dirname y __filename)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Cargar variables de entorno
dotenv.config()

// Inicializar Prisma con configuración optimizada
const prisma = new PrismaClient({
  log: ['error'],
  errorFormat: 'minimal',
})

// Inicializar Supabase
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const bucketName = process.env.SUPABASE_BUCKET || "wedding-gallery"

const supabase = createClient(supabaseUrl, supabaseKey)

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/tmp") // Guardar temporalmente en /tmp
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Límite de 10MB
})

// Inicializar Express
const app = express()
const PORT = process.env.PORT || 3001

// Configuración de CORS para producción
const allowedOrigins = [
  'http://localhost:5173',           // Vite dev
  'http://localhost:3000',           // React dev alternativo
  'https://bodavargasprado.com',     // Dominio principal
  'https://www.bodavargasprado.com', // Dominio con www
  process.env.FRONTEND_URL,          // URL de producción de Vercel (configurar en Railway)
]

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (como mobile apps o curl)
    if (!origin) return callback(null, true)
    
    // Verificar si el origin está en la lista o si coincide con algún patrón
    const isAllowed = allowedOrigins.some(allowed => {
      if (!allowed) return false
      // Coincidencia exacta
      if (origin === allowed) return true
      // Permitir subdominios de Vercel
      if (origin.includes('.vercel.app')) return true
      // Permitir el dominio principal y www
      if (origin.includes('bodavargasprado.com')) return true
      return false
    })
    
    if (isAllowed) {
      callback(null, true)
    } else {
      console.warn(`CORS blocked origin: ${origin}`)
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

// Middleware
app.use(cors(corsOptions))
app.use(express.json())

// Backend API - El frontend se sirve desde Vercel

// API Routes

// IMPORTANTE: Endpoint para obtener estadísticas de invitaciones - DEBE IR ANTES DE LAS RUTAS CON PARÁMETROS
app.get("/api/invitations/stats", async (req, res) => {
  try {
    console.log("Fetching invitation stats")
    // Obtener el número total de invitaciones
    const totalInvitations = await prisma.invitation.count()

    // Obtener el número de invitaciones confirmadas
    const confirmedInvitations = await prisma.invitation.count({
      where: { confirmed: true },
    })

    // Obtener el número total de invitados potenciales (suma de maxGuests)
    const invitationsWithMaxGuests = await prisma.invitation.findMany({
      select: { maxGuests: true },
    })

    const totalGuests = invitationsWithMaxGuests.reduce((sum, invitation) => sum + invitation.maxGuests, 0)

    // Obtener el número de invitados confirmados
    const confirmedGuestsCount = await prisma.guest.count()

    // Calcular el porcentaje de confirmación
    const confirmedPercentage = totalGuests > 0 ? Math.round((confirmedGuestsCount / totalGuests) * 100) : 0

    // Enviar las estadísticas
    const stats = {
      totalInvitations,
      confirmedInvitations,
      totalGuests,
      confirmedGuests: confirmedGuestsCount,
      confirmedPercentage,
    }

    console.log("Stats:", stats)
    return res.status(200).json(stats)
  } catch (error) {
    console.error("Error getting invitation stats:", error)
    return res.status(500).json({ error: "Error getting invitation stats" })
  }
})

// Validar código de invitación
app.get("/api/invitations/validate/:code", async (req, res) => {
  try {
    const { code } = req.params
    const invitation = await prisma.invitation.findUnique({
      where: { code },
    })

    res.json({ valid: !!invitation })
  } catch (error) {
    console.error("Error validating invitation code:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Obtener invitación por código
app.get("/api/invitations/:code", async (req, res) => {
  try {
    const { code } = req.params
    const invitation = await prisma.invitation.findUnique({
      where: { code },
      include: { guests: true },
    })

    if (!invitation) {
      return res.status(404).json({ error: "Invitation not found" })
    }

    res.json(invitation)
  } catch (error) {
    console.error("Error fetching invitation:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Confirmar asistencia
app.post("/api/invitations/:code/confirm", async (req, res) => {
  try {
    const { code } = req.params
    const { guests } = req.body

    console.log("Confirmando asistencia para código:", code)
    console.log("Datos recibidos:", { guests })

    // Buscar la invitación
    const invitation = await prisma.invitation.findUnique({
      where: { code },
      include: { guests: true }
    })

    if (!invitation) {
      return res.status(404).json({ error: "Invitación no encontrada" })
    }

    // Verificar si ya está confirmada
    if (invitation.confirmed) {
      return res.status(400).json({ error: "La invitación ya está confirmada" })
    }

    // Iniciar transacción
    const result = await prisma.$transaction(async (prisma) => {
      // Eliminar invitados existentes si los hay
      if (invitation.guests.length > 0) {
        await prisma.guest.deleteMany({
          where: { invitationId: invitation.id }
        })
      }

      // Crear nuevos invitados
      const guestPromises = guests.map(guest => 
        prisma.guest.create({
          data: {
            fullName: guest.fullName || guest.name + " " + guest.lastName,
            invitationId: invitation.id
          }
        })
      )

      const createdGuests = await Promise.all(guestPromises)

      // Actualizar la invitación como confirmada
      const updatedInvitation = await prisma.invitation.update({
        where: { id: invitation.id },
        data: {
          confirmed: true,
          confirmedAt: new Date()
        },
        include: { guests: true }
      })

      return updatedInvitation
    })

    console.log("Confirmación exitosa:", result)

    res.json({
      success: true,
      message: "Asistencia confirmada exitosamente",
      data: result
    })

  } catch (error) {
    console.error("Error al confirmar asistencia:", error)
    res.status(500).json({ 
      error: "Error al confirmar asistencia",
      details: error.message
    })
  }
})

// Obtener todas las invitaciones
app.get("/api/invitations", async (req, res) => {
  try {
    const invitations = await prisma.invitation.findMany({
      include: { guests: true },
      orderBy: { createdAt: "desc" },
    })

    res.json(invitations)
  } catch (error) {
    console.error("Error fetching invitations:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Crear una nueva invitación
app.post("/api/invitations", async (req, res) => {
  try {
    const { primaryGuest, maxGuests } = req.body

    // Generar un código único basado en el primer nombre + número aleatorio de 4 dígitos
    const firstName = primaryGuest.split(' ')[0].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    const randomNumber = Math.floor(1000 + Math.random() * 9000) // Número entre 1000 y 9999
    const code = `${firstName}${randomNumber}`

    const invitation = await prisma.invitation.create({
      data: {
        code,
        primaryGuest,
        maxGuests: parseInt(maxGuests) || 1,
      },
    })

    res.status(201).json(invitation)
  } catch (error) {
    console.error("Error creating invitation:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Actualizar una invitación
app.put("/api/invitations/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { primaryGuest, maxGuests } = req.body

    const invitation = await prisma.invitation.update({
      where: { id },
      data: {
        primaryGuest,
        maxGuests: parseInt(maxGuests),
      },
    })

    res.json(invitation)
  } catch (error) {
    console.error("Error updating invitation:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Eliminar una invitación
app.delete("/api/invitations/:id", async (req, res) => {
  try {
    const { id } = req.params

    await prisma.invitation.delete({
      where: { id },
    })

    res.json({ success: true })
  } catch (error) {
    console.error("Error deleting invitation:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// ===== GALLERY ENDPOINTS =====

// Obtener todas las secciones de la galería con sus medios
app.get("/api/gallery/sections", async (req, res) => {
  try {
    console.log("Fetching gallery sections")
    
    const sections = await prisma.gallery_sections.findMany({
      include: {
        media: {
          orderBy: { created_at: 'desc' }
        }
      },
      orderBy: { order: 'asc' }
    })

    console.log(`Found ${sections.length} sections`)
    
    // Función auxiliar para convertir BigInt a String
    const serializeSection = (section) => {
      return {
        ...section,
        id: section.id.toString(),
        media: section.media.map(m => ({
          ...m,
          id: m.id.toString(),
          section_id: m.section_id.toString()
        })),
        created_at: section.created_at.toISOString(),
        updated_at: section.updated_at.toISOString()
      }
    }

    // Transformar las secciones
    const sectionsJSON = sections.map(serializeSection)
    
    console.log("Secciones procesadas:", JSON.stringify(sectionsJSON, null, 2))
    
    res.json(sectionsJSON)
  } catch (error) {
    console.error("Error detallado al obtener las secciones:", {
      message: error.message,
      stack: error.stack,
      code: error.code
    })
    res.status(500).json({ 
      error: "Error al obtener las secciones de la galería",
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
})

// Crear una nueva sección
app.post("/api/gallery/sections", async (req, res) => {
  try {
    const { name, description, allow_upload, is_active } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "El nombre es requerido" })
    }

    // Obtener el último order para asignar el siguiente
    const lastSection = await prisma.gallery_sections.findFirst({
      orderBy: { order: 'desc' }
    })
    const nextOrder = lastSection ? lastSection.order + 1 : 1

    const section = await prisma.gallery_sections.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        order: nextOrder,
        allow_upload: allow_upload !== undefined ? allow_upload : true,
        is_active: is_active !== undefined ? is_active : false,
      },
    })

    // Transformar la sección para la respuesta
    const sectionJSON = {
      ...section,
      id: section.id.toString(),
      created_at: section.created_at.toISOString(),
      updated_at: section.updated_at.toISOString()
    }

    return res.status(201).json(sectionJSON)
  } catch (error) {
    console.error("Error detallado al crear la sección:", {
      message: error.message,
      stack: error.stack,
      code: error.code
    })
    return res.status(500).json({ 
      error: "Error al crear la sección",
      details: error.message
    })
  }
})

// Actualizar una sección
app.put("/api/gallery/sections/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, allow_upload, is_active, order } = req.body

    const updateData = {}
    if (name !== undefined) updateData.name = name.trim()
    if (description !== undefined) updateData.description = description?.trim() || null
    if (allow_upload !== undefined) updateData.allow_upload = allow_upload
    if (is_active !== undefined) updateData.is_active = is_active
    if (order !== undefined) updateData.order = order
    updateData.updated_at = new Date()

    const section = await prisma.gallery_sections.update({
      where: { id: BigInt(id) },
      data: updateData,
    })

    // Transformar BigInt a String para JSON
    const sectionJSON = {
      ...section,
      id: section.id.toString(),
      created_at: section.created_at.toISOString(),
      updated_at: section.updated_at.toISOString()
    }

    return res.status(200).json(sectionJSON)
  } catch (error) {
    console.error("Error updating gallery section:", error)
    return res.status(500).json({ error: "Error updating gallery section", details: error.message })
  }
})

// Eliminar una sección
app.delete("/api/gallery/sections/:id", async (req, res) => {
  try {
    const { id } = req.params

    // Primero eliminar todos los medios asociados
    await prisma.gallery_media.deleteMany({
      where: { section_id: BigInt(id) }
    })

    // Luego eliminar la sección
    await prisma.gallery_sections.delete({
      where: { id: BigInt(id) }
    })

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error("Error deleting gallery section:", error)
    return res.status(500).json({ error: "Error deleting gallery section" })
  }
})

// Obtener medios por sección
app.get("/api/gallery/sections/:sectionId/media", async (req, res) => {
  try {
    const { sectionId } = req.params
    console.log("Fetching media for section:", sectionId) // Debug

    const media = await prisma.gallery_media.findMany({
      where: { section_id: BigInt(sectionId) },
      orderBy: { created_at: "desc" },
    })

    // Transformar BigInt a String para JSON
    const mediaJSON = media.map(m => ({
      ...m,
      id: m.id.toString(),
      section_id: m.section_id.toString()
    }))

    console.log("Found media:", mediaJSON) // Debug
    return res.status(200).json(mediaJSON)
  } catch (error) {
    console.error("Error getting media for section:", error)
    return res.status(500).json({ 
      error: "Error getting media for section",
      details: error.message 
    })
  }
})

// Subir un medio a una sección
app.post("/api/gallery/sections/:sectionId/media", async (req, res) => {
  try {
    const { sectionId } = req.params
    const { file_path, public_url, type, name, size } = req.body

    console.log("Recibiendo datos para crear medio:", {
      sectionId,
      file_path,
      public_url,
      type,
      name,
      size
    })

    // Verificar que la sección existe
    const section = await prisma.gallery_sections.findUnique({
      where: { id: BigInt(sectionId) }
    })

    if (!section) {
      return res.status(404).json({ error: "Section not found" })
    }

    // Crear el registro de media
    const media = await prisma.gallery_media.create({
      data: {
        section_id: BigInt(sectionId),
        file_path,
        public_url,
        type,
        name,
        size: parseInt(size)
      }
    })

    // Transformar BigInt a String para JSON
    const mediaJSON = {
      ...media,
      id: media.id.toString(),
      section_id: media.section_id.toString()
    }

    console.log("Medio creado exitosamente:", mediaJSON)

    return res.status(201).json(mediaJSON)
  } catch (error) {
    console.error("Error detallado al crear medio:", {
      message: error.message,
      stack: error.stack,
      code: error.code
    })
    return res.status(500).json({ 
      error: "Error creating media",
      details: error.message
    })
  }
})

// Eliminar un medio
app.delete("/api/gallery/media/:mediaId", async (req, res) => {
  try {
    const { mediaId } = req.params

    // Obtener la información del medio
    const media = await prisma.gallery_media.findUnique({
      where: { id: BigInt(mediaId) },
    })

    if (!media) {
      return res.status(404).json({ error: "Media not found" })
    }

    // Extraer el path del archivo de la URL
    const urlParts = media.public_url.split("/")
    const filePath = urlParts.slice(urlParts.indexOf(bucketName) + 1).join("/")

    // Eliminar el archivo de Supabase Storage si es posible
    try {
      await supabase.storage.from(bucketName).remove([filePath])
    } catch (storageError) {
      console.error("Error removing file from storage:", storageError)
      // Continuamos con la eliminación del registro aunque falle la eliminación del archivo
    }

    // Eliminar el registro de la base de datos
    await prisma.gallery_media.delete({
      where: { id: BigInt(mediaId) },
    })

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error("Error deleting media:", error)
    return res.status(500).json({ error: "Error deleting media" })
  }
})

// Crear secciones iniciales (para desarrollo/pruebas)
app.post("/api/gallery/seed-sections", async (req, res) => {
  try {
    console.log("Iniciando creación de sección de prueba...")
    
    // Verificar la conexión a la base de datos
    await prisma.$connect()
    console.log("Conexión a la base de datos establecida")
    
    // Crear la sección de Ceremonia si no existe
    const existingSection = await prisma.gallery_sections.findFirst({
      where: {
        name: "Ceremonia"
      }
    })
    
    console.log("Búsqueda de sección existente completada:", existingSection)

    if (!existingSection) {
      console.log("Creando nueva sección...")
      const newSection = await prisma.gallery_sections.create({
        data: {
          name: "Ceremonia",
          description: "Fotos de la ceremonia religiosa",
          order: 1
        }
      })
      console.log("Nueva sección creada exitosamente:", newSection)
      
      // Transformar BigInt a String para JSON
      const sectionJSON = {
        ...newSection,
        id: newSection.id.toString()
      }
      
      res.json({ 
        message: "Sección de prueba creada exitosamente", 
        section: sectionJSON 
      })
    } else {
      console.log("La sección Ceremonia ya existe:", existingSection)
      
      // Transformar BigInt a String para JSON
      const sectionJSON = {
        ...existingSection,
        id: existingSection.id.toString()
      }
      
      res.json({ 
        message: "La sección ya existe", 
        section: sectionJSON 
      })
    }
  } catch (error) {
    console.error("Error detallado al crear la sección de prueba:", {
      message: error.message,
      stack: error.stack,
      code: error.code
    })
    res.status(500).json({ 
      error: "Error al crear la sección de prueba",
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
})

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() })
})

// Manejar el cierre graceful de Prisma
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
