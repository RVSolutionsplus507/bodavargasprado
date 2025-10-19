// src/services/galleryService.js
import { api } from "../lib/api"
import { supabase } from "../lib/supabase"

const BUCKET_NAME = 'wedding-gallery' // Nombre del bucket en Supabase

export const galleryService = {
  // Obtener secciones activas (para público)
  getSections: async () => {
    try {
      const response = await api.get("/api/gallery/sections")
      
      if (!response.data) {
        throw new Error("No se recibieron datos de las secciones")
      }
      
      return { data: response.data }
    } catch (error) {
      console.error("Error detallado al obtener las secciones:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      throw error
    }
  },

  // Obtener todas las secciones (para admin)
  getAllSections: async () => {
    try {
      const response = await api.get("/api/gallery/sections/all")
      
      if (!response.data) {
        throw new Error("No se recibieron datos de las secciones")
      }
      
      return { data: response.data }
    } catch (error) {
      console.error("Error detallado al obtener todas las secciones:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      throw error
    }
  },

  getMediaBySection: async (sectionId) => {
    try {
      if (!sectionId) {
        throw new Error("Se requiere un ID de sección")
      }
      const response = await api.get(`/api/gallery/sections/${sectionId}/media`)
      return { data: response.data }
    } catch (error) {
      console.error(`Error fetching media for section ${sectionId}:`, error)
      throw error
    }
  },

  uploadMedia: async (file, sectionId) => {
    let filePath = null;
    try {
      if (!file || !sectionId) {
        throw new Error("Se requiere archivo y ID de sección")
      }

      // Primero subimos el archivo a Supabase
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`
      filePath = `${sectionId}/${fileName}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error("Error detallado al subir a Supabase:", uploadError)
        throw uploadError
      }

      // Obtenemos la URL pública
      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath)

      // Creamos el registro en la base de datos
      const mediaData = {
        file_path: filePath,
        public_url: publicUrl,
        type: "IMAGE",
        name: file.name,
        size: file.size
      }

      const response = await api.post(
        `/api/gallery/sections/${sectionId}/media`,
        mediaData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      return { data: response.data }
    } catch (error) {
      console.error("Error detallado en el proceso de subida:", {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        details: error.details
      })
      
      // Si falló la creación del registro, intentamos limpiar el archivo de Supabase
      if (filePath) {
        try {
          await supabase.storage.from(BUCKET_NAME).remove([filePath])
        } catch (cleanupError) {
          console.error("Error al limpiar archivo de Supabase:", cleanupError)
        }
      }
      throw error
    }
  },

  deleteMedia: async (mediaId) => {
    try {
      const response = await api.delete(`/api/gallery/media/${mediaId}`)
      return { data: response.data }
    } catch (error) {
      console.error("Error deleting media:", error)
      throw error
    }
  },

  createSection: async (data) => {
    try {
      const response = await api.post("/api/gallery/sections", data)
      return { data: response.data }
    } catch (error) {
      console.error("Error creating section:", error)
      throw error
    }
  },

  updateSection: async (id, data) => {
    try {
      const response = await api.put(`/api/gallery/sections/${id}`, data)
      return { data: response.data }
    } catch (error) {
      console.error("Error updating section:", error)
      throw error
    }
  },

  deleteSection: async (id) => {
    try {
      const response = await api.delete(`/api/gallery/sections/${id}`)
      return { data: response.data }
    } catch (error) {
      console.error("Error deleting section:", error)
      throw error
    }
  },

  seedSections: async () => {
    try {
      const response = await api.post("/api/gallery/seed-sections")
      
      if (!response.data) {
        throw new Error("No se recibió respuesta del servidor")
      }
      
      return { data: response.data }
    } catch (error) {
      console.error("Error detallado al hacer seed de secciones:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      throw error
    }
  },

  // New function to check and debug the gallery state
  debugGallery: async () => {
    try {
      const response = await api.get("/api/debug/gallery")
      return { data: response.data }
    } catch (error) {
      console.error("Error debugging gallery:", error)
      throw error
    }
  },

  // New function to create the CeremoniasAttachment section if it doesn't exist
  ensureCeremoniasAttachmentSection: async () => {
    try {
      // First get all sections
      const { data: sections } = await galleryService.getSections()

      // Check if CeremoniasAttachment exists
      const ceremoniasSection = sections.find(
        (s) =>
          s.name.toLowerCase() === "ceremoniasattachment" ||
          s.name.toLowerCase() === "ceremonias attachment" ||
          s.name.toLowerCase() === "ceremonias",
      )

      if (ceremoniasSection) {
        return { data: ceremoniasSection }
      }

      // If not, create it
      return await galleryService.createSection({
        name: "CeremoniasAttachment",
        order: sections.length + 1,
      })
    } catch (error) {
      console.error("Error ensuring CeremoniasAttachment section:", error)
      throw error
    }
  },
}

