import axios from "axios"

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000" // Fallback to localhost if not defined

export const api = axios.create({
  baseURL: baseURL,
  timeout: 10000, // Optional: Set a timeout for requests
  headers: {
    "Content-Type": "application/json",
  },
})

// Optional: Add request interceptors for logging or authentication
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    console.error("Request Error:", error)
    return Promise.reject(error)
  },
)

// Response interceptor con manejo mejorado de errores
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const errorMessage = {
      message: "Error desconocido",
      status: null,
      data: null,
    }

    if (error.response) {
      errorMessage.status = error.response.status
      errorMessage.data = error.response.data
      
      switch (error.response.status) {
        case 400:
          errorMessage.message = error.response.data?.message || "Solicitud inválida"
          break
        case 401:
          errorMessage.message = "No autorizado"
          break
        case 403:
          errorMessage.message = "Acceso denegado"
          break
        case 404:
          errorMessage.message = error.response.data?.message || "Recurso no encontrado"
          break
        case 409:
          errorMessage.message = error.response.data?.message || "Conflicto en la solicitud"
          break
        case 500:
          errorMessage.message = "Error del servidor"
          break
        default:
          errorMessage.message = error.response.data?.message || "Error en la solicitud"
      }
    } else if (error.request) {
      errorMessage.message = "No se pudo conectar con el servidor"
    } else {
      errorMessage.message = error.message
    }

    console.error("API Error:", errorMessage)
    return Promise.reject(errorMessage)
  },
)

