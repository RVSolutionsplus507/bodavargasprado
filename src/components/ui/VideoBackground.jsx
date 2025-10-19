import { useEffect, useRef, useState } from "react"

export function VideoBackground({ src, blurAmount = 1, opacity = 0.3, className = "" }) {
  const videoRef = useRef(null)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [videoKey, setVideoKey] = useState(Date.now()) // Clave única para forzar recreación

  // Función para añadir un parámetro de cache-busting a la URL
  const getVideoUrl = (baseUrl) => {
    if (!baseUrl) return "";
    // Añadir un parámetro de timestamp para evitar caché
    const hasQuery = baseUrl.includes('?');
    return `${baseUrl}${hasQuery ? '&' : '?'}v=${videoKey}`;
  };

  useEffect(() => {
    // Reiniciar el estado cuando cambia la fuente
    setVideoLoaded(false);
    setVideoError(false);
    setErrorMessage("");
    
    // Generar una nueva clave para forzar la recreación del elemento de video
    setVideoKey(Date.now());
  }, [src]);

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Verificar si la URL del video es válida
    if (!src) {
      console.error("Error: No se proporcionó una URL de video válida")
      setVideoError(true)
      setErrorMessage("No se proporcionó una URL de video válida")
      return
    }


    // Limpiar cualquier configuración previa
    video.pause();
    video.removeAttribute('src');
    video.load();

    // Configurar el video para reproducción automática y silenciosa
    video.muted = true
    video.playsInline = true
    video.autoplay = true
    video.loop = true
    video.crossOrigin = "anonymous" // Añadir para evitar problemas CORS
    
    // Manejadores de eventos
    const handleCanPlay = () => {
      setVideoLoaded(true)
      // Intentar reproducir el video solo cuando esté listo
      playVideo()
    }

    const handleError = (error) => {
      const errorDetails = error.target
        ? `Código: ${error.target.error ? error.target.error.code : "desconocido"}`
        : "Error desconocido"

      console.error(`Error al cargar el video: ${errorDetails}. URL: ${src}`)
      setVideoError(true)
      setErrorMessage(`Error al cargar el video: ${errorDetails}`)
      
      // Intentar recuperarse del error
      setTimeout(() => {
        // Generar una nueva clave para forzar la recreación del elemento de video
        setVideoKey(Date.now());
      }, 1000);
    }

    // Intentar reproducir el video
    const playVideo = async () => {
      try {
        // Solo intentar reproducir si el video está cargado
        if (video.readyState >= 2) {
          await video.play()
        }
      } catch (error) {
        // No mostrar error para interrupciones de reproducción (normal durante la navegación)
        if (error.name !== "AbortError") {
          console.error("Error al reproducir el video de fondo:", error)
        }
      }
    }

    // Agregar event listeners
    video.addEventListener("canplay", handleCanPlay)
    video.addEventListener("error", handleError)

    // Limpiar cuando el componente se desmonte
    return () => {
      video.removeEventListener("canplay", handleCanPlay)
      video.removeEventListener("error", handleError)
      if (video) {
        video.pause()
        video.removeAttribute('src')
        video.load()
      }
    }
  }, [src, videoKey])

  // Fallback para cuando el video no se puede cargar
  if (videoError) {
    return (
      <div
        className={`absolute inset-0 bg-wedding-primary/20 dark:bg-wedding-primary-dark/20 z-0 ${className}`}
        style={{ backdropFilter: `blur(${blurAmount}px)` }}
      >
        {/* Solo mostrar mensaje de error en desarrollo */}
        {process.env.NODE_ENV === "development" && (
          <div className="absolute bottom-2 right-2 bg-red-100 text-red-800 text-xs p-1 rounded">{errorMessage}</div>
        )}
      </div>
    )
  }

  return (
    <div className={`absolute inset-0 overflow-hidden z-0 ${className}`}>
      {/* Mostrar un fondo de color mientras el video se carga */}
      {!videoLoaded && <div className="absolute inset-0 bg-wedding-primary/20 dark:bg-wedding-primary-dark/20" />}

      <video
        key={videoKey} // Forzar recreación del elemento cuando cambia la clave
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover ${videoLoaded ? "opacity-50" : "opacity-0"}`}
        style={{
          filter: `blur(${blurAmount}px)`,
          opacity: opacity,
          transform: "scale(1.1)", // Evita bordes blancos causados por el blur
          transition: "opacity 0.2s ease-in-out",
        }}
        muted
        playsInline
        autoPlay
        loop
        preload="auto"
        crossOrigin="anonymous"
      >
        {/* Usar la URL con cache-busting */}
        <source src={getVideoUrl(src)} type="video/mp4" />
        <source src={getVideoUrl(src.replace('.mp4', '.webm'))} type="video/webm" />
        <source src={getVideoUrl(src.replace('.mp4', '.ogg'))} type="video/ogg" />
        Tu navegador no soporta videos HTML5.
      </video>
    </div>
  )
}
