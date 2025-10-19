# 🌟 Boda Vargas Prado 🌟

![Wedding Banner](https://img.shields.io/badge/Ambar%20%26%20Roberto-17%20Enero%202026-rosybrown?style=for-the-badge)

<div align="center">
  <img src="/public/vite.svg" alt="Wedding Logo" width="120">
  <h3>Una elegante plataforma web para nuestra boda</h3>
</div>

<p align="center">
  <a href="#-características">Características</a> •
  <a href="#-tecnologías">Tecnologías</a> •
  <a href="#-instalación">Instalación</a> •
  <a href="#-estructura">Estructura</a> •
  <a href="#-desarrollo">Desarrollo</a> •
  <a href="#-despliegue">Despliegue</a>
</p>

<div align="center">
  <img src="https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat-square&logo=react" alt="React v19.0.0">
  <img src="https://img.shields.io/badge/Vite-6.2.0-646CFF?style=flat-square&logo=vite" alt="Vite v6.2.0">
  <img src="https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC?style=flat-square&logo=tailwindcss" alt="TailwindCSS v3.4.1">
  <img src="https://img.shields.io/badge/Express-4.21.2-000000?style=flat-square&logo=express" alt="Express v4.21.2">
  <img src="https://img.shields.io/badge/Prisma-6.4.1-2D3748?style=flat-square&logo=prisma" alt="Prisma v6.4.1">
  <img src="https://img.shields.io/badge/Supabase-2.49.1-3ECF8E?style=flat-square&logo=supabase" alt="Supabase v2.49.1">
</div>

## 📝 Descripción

Una elegante aplicación web full-stack para nuestra boda, diseñada para proporcionar a los invitados información clave sobre el evento, permitirles confirmar su asistencia y visualizar galerías de fotos. La aplicación incluye un panel de administración para gestionar invitaciones, confirmaciones y contenido multimedia.

## ✨ Características

### 📱 Para los Invitados
- **Página de Inicio**: Presentación elegante con decoraciones florales y cuenta regresiva
- **Sistema de RSVP**: Confirmación de asistencia mediante código único de invitación
- **Galería de Imágenes**: Visualización de momentos especiales de la pareja
- **Información del Evento**: Detalles sobre ubicación, código de vestimenta y más
- **Modo Oscuro/Claro**: Interfaz adaptable a las preferencias del usuario

### 👑 Para los Administradores
- **Panel de Control**: Gestión completa de invitados y confirmaciones
- **Estadísticas**: Datos en tiempo real sobre asistencia y confirmaciones
- **Gestión de Galerías**: Organización y carga de imágenes por secciones
- **Creación de Invitaciones**: Generación de códigos únicos para invitados

### 🎨 Características Técnicas
- **Diseño Responsivo**: Experiencia óptima en dispositivos móviles y escritorio
- **Animaciones Elegantes**: Transiciones suaves con Framer Motion
- **Carga de Imágenes**: Integración con Supabase Storage para galería de fotos
- **Base de Datos Relacional**: Gestión eficiente de invitaciones y confirmaciones

## 🛠 Tecnologías

### Frontend
- **React 19** - Framework UI moderno y reactivo
- **Vite 6** - Bundler y entorno de desarrollo ultrarrápido
- **React Router v7** - Sistema de navegación y rutas
- **Tailwind CSS** - Framework de utilidades CSS para estilos personalizados
- **Framer Motion** - Biblioteca de animaciones avanzadas
- **Shadcn UI** - Componentes de interfaz reutilizables y accesibles
- **React Query** - Gestión de estados y peticiones asíncronas
- **Zustand** - Gestión de estado global minimalista

### Backend
- **Express** - Servidor API REST ligero y flexible
- **Prisma** - ORM moderno para PostgreSQL
- **Supabase** - Plataforma para almacenamiento de archivos en la nube
- **PostgreSQL** - Base de datos relacional robusta

## 🚀 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tuusuario/bodavargasprado.git
   cd bodavargasprado
   ```

2. **Instalar dependencias del frontend**
   ```bash
   npm install
   ```

3. **Instalar dependencias del backend**
   ```bash
   cd api
   npm install
   cd ..
   ```

4. **Configurar variables de entorno**
   
   Crea un archivo `.env` en la raíz del proyecto:
   ```
   VITE_API_URL=http://localhost:3001
   VITE_WEDDING_DATE=2026-01-17T16:00:00
   VITE_RSVP_DEADLINE=2025-11-17T23:59:59
   ```

   Y otro archivo `.env` en la carpeta `/api`:
   ```
   DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/boda_db"
   SUPABASE_URL="tu-url-de-supabase"
   SUPABASE_KEY="tu-key-de-supabase"
   SUPABASE_BUCKET="wedding-gallery"
   ```

5. **Ejecutar las migraciones de Prisma**
   ```bash
   cd api
   npx prisma migrate dev
   cd ..
   ```

6. **Iniciar el proyecto en modo desarrollo**
   ```bash
   npm run start:all
   ```

## 📂 Estructura

La aplicación está organizada en una arquitectura de monorepo con frontend y backend claramente separados:

```
bodavargasprado/
├── public/              # Archivos estáticos y recursos públicos
├── src/                 # Código fuente del frontend
│   ├── assets/          # Imágenes, fuentes y recursos estáticos
│   ├── components/      # Componentes React reutilizables
│   ├── context/         # Proveedores de contexto de React
│   ├── hooks/           # Custom hooks de React
│   ├── layouts/         # Componentes de diseño y estructura
│   ├── lib/             # Utilidades y funciones auxiliares
│   ├── pages/           # Componentes de página principales
│   ├── services/        # Servicios para comunicación con APIs
│   ├── store/           # Estado global con Zustand
│   └── styles/          # Estilos globales y configuración de Tailwind
├── api/                 # Backend con Express y Prisma
│   ├── prisma/          # Esquema de la base de datos y migraciones
│   ├── src/             # Código fuente del backend
│   │   ├── controllers/ # Controladores de la API
│   │   ├── middleware/  # Middleware de Express
│   │   ├── routes/      # Definición de rutas de la API
│   │   ├── services/    # Servicios y lógica de negocio
│   │   └── utils/       # Utilidades generales
│   └── uploads/         # Archivos temporales de carga
└── scripts/             # Scripts de utilidad para el desarrollo
```

## 🧪 Desarrollo

### Comandos disponibles

```bash
# Iniciar frontend y backend simultáneamente
npm run start:all

# Iniciar sólo el frontend (con hot reload)
npm run dev

# Iniciar sólo el backend (con nodemon)
npm run dev:api

# Ejecutar pruebas
npm run test

# Compilar para producción
npm run build

# Verificar formato de código
npm run lint
```

### Flujo de trabajo recomendado

1. **Desarrollo de nuevas características**
    - Crear una nueva rama desde `main`: `git checkout -b feature/nueva-funcionalidad`
    - Implementar los cambios siguiendo las guías de estilo
    - Crear un Pull Request para revisión

2. **Convenciones de código**
    - Utilizar nombres descriptivos para componentes y variables
    - Seguir el patrón de composición para componentes React
    - Documentar funciones y componentes con JSDoc

3. **Optimización y rendimiento**
    - Implementar lazy loading para componentes grandes
    - Memorizar componentes y funciones cuando sea necesario
    - Utilizar imágenes optimizadas y comprimidas

## 🚢 Despliegue

Esta aplicación está configurada para desplegarse en:
- **Frontend:** Vercel
- **Backend:** Railway
- **Base de datos:** PostgreSQL en Railway
- **Storage:** Supabase

### 📚 Guías de Despliegue

Para instrucciones detalladas de despliegue, consulta:

- **[DEPLOY.md](./DEPLOY.md)** - Guía completa paso a paso
- **[ENV_SETUP.md](./ENV_SETUP.md)** - Configuración de variables de entorno
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Documentación técnica completa
- **[RESUMEN_DEPLOY.md](./RESUMEN_DEPLOY.md)** - Resumen rápido de la configuración

### ⚡ Despliegue Rápido

#### Frontend en Vercel
```bash
# 1. Conectar repo en vercel.com
# 2. Configurar variables de entorno (ver ENV_SETUP.md)
# 3. Deploy automático
```

#### Backend en Railway
```bash
# 1. Crear proyecto en railway.app
# 2. Root Directory: api
# 3. Configurar variables de entorno (ver ENV_SETUP.md)
# 4. Deploy automático
```

### 🔐 Variables de Entorno Requeridas

**Vercel (Frontend):**
- `VITE_API_URL` - URL del backend en Railway
- `VITE_WEDDING_DATE`, `VITE_RSVP_DEADLINE`
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_KEY`

**Railway (Backend):**
- `DATABASE_URL` - PostgreSQL connection string
- `SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_BUCKET`
- `FRONTEND_URL` - URL del frontend en Vercel
- `NODE_ENV=production`

Ver **[ENV_SETUP.md](./ENV_SETUP.md)** para valores completos.

---

# Música para la Boda

Coloca aquí el archivo de música principal para la boda con el nombre `wedding-song.mp3`.

Recomendaciones:
- Usa un formato MP3 de buena calidad pero optimizado para web (128-192kbps)
- Asegúrate de tener los derechos para usar la música
- Considera usar una versión recortada si la canción es muy larga

Si deseas cambiar el nombre del archivo o usar múltiples canciones, actualiza la referencia en `MusicPlayerContext.jsx`.
===

<div align="center">
  <p>
     Desarrollado con ❤️ por Roberto Vargas y Ambar Prado
  </p>
  <p>
     <small>© 2025-2026 | Todos los derechos reservados</small>
  </p>
</div>
