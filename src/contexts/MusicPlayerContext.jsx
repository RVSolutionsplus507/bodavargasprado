import { createContext, useContext, useState, useEffect, useRef } from "react"

const MusicPlayerContext = createContext()

export function MusicPlayerProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false) // Iniciar pausado
  const [volume, setVolume] = useState(0.5)
  const [isMuted, setIsMuted] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [autoplayBlocked, setAutoplayBlocked] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false)
  const audioRef = useRef(null)
  const audioContextRef = useRef(null)
  const hasAttemptedAutoplay = useRef(false)

  // Agregar event listeners para detectar interacción (solo una vez)
  useEffect(() => {
    const events = ["click", "touchstart", "keydown"]

    const handler = () => {
      if (!userInteracted) {
        setUserInteracted(true)

        // Iniciar AudioContext si existe
        if (audioContextRef.current && audioContextRef.current.state === "suspended") {
          audioContextRef.current.resume()
        }
      }
    }

    events.forEach((event) => {
      document.addEventListener(event, handler, { once: true, passive: true })
    })

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handler)
      })
    }
  }, [])

  // Inicializar el audio cuando el componente se monta
  useEffect(() => {
    // Crear AudioContext para desbloquear audio en iOS
    if (typeof window !== "undefined" && window.AudioContext) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }

    // Usar la ruta desde la carpeta public
    const audio = new Audio("/fonseca-todalavida.mp3")
    audioRef.current = audio

    // Configurar el audio
    audio.loop = true
    audio.volume = 0.5
    audio.preload = "auto" // Precargar el audio

    // Eventos para manejar el estado de carga
    const handleCanPlay = () => {
      setIsReady(true)
      
      // Intentar reproducir automáticamente solo una vez
      if (!hasAttemptedAutoplay.current) {
        hasAttemptedAutoplay.current = true
        attemptAutoplay()
      }
    }

    const handleError = (error) => {
      console.error("Error al cargar el audio:", error)
      setIsReady(false)
    }

    audio.addEventListener("canplay", handleCanPlay)
    audio.addEventListener("error", handleError)

    // Precargar el audio
    audio.load()

    // Función para intentar reproducir automáticamente
    const attemptAutoplay = async () => {
      try {
        // Primero intentar reproducir con sonido
        audio.muted = false
        await audio.play()
        setIsPlaying(true)
        setIsMuted(false)
        setAutoplayBlocked(false)
      } catch (error) {
        // Si falla, intentar muted
        try {
          audio.muted = true
          await audio.play()
          setIsPlaying(true)
          setIsMuted(true)
          setAutoplayBlocked(true)
        } catch (mutedError) {
          setIsPlaying(false)
          setAutoplayBlocked(true)
        }
      }
    }

    // Limpiar cuando el componente se desmonte
    return () => {
      audio.removeEventListener("canplay", handleCanPlay)
      audio.removeEventListener("error", handleError)
      if (audio) {
        audio.pause()
        audio.src = ""
      }
      audioRef.current = null

      // Limpiar AudioContext
      if (audioContextRef.current) {
        audioContextRef.current.close().catch((e) => console.error(e))
      }
    }
  }, [])

  // Efecto para manejar cambios en el estado de reproducción (solo cambios manuales)
  useEffect(() => {
    if (!audioRef.current || !isReady) return

    const audio = audioRef.current

    if (isPlaying) {
      // Verificar si el audio realmente está pausado antes de intentar reproducir
      if (audio.paused) {
        const playPromise = audio.play()

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Audio reproduciendo
            })
            .catch((error) => {
              if (error.name !== "NotAllowedError") {
                console.error("Error al reproducir audio:", error)
              }
              setIsPlaying(false)
              setAutoplayBlocked(true)
            })
        }
      }
    } else {
      // Solo pausar si realmente está reproduciendo
      if (!audio.paused) {
        audio.pause()
      }
    }
  }, [isPlaying, isReady])

  // Efecto para manejar cambios en el volumen
  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = isMuted ? 0 : volume
  }, [volume, isMuted])

  // Funciones para controlar el reproductor
  const togglePlay = () => {
    if (!isReady) return

    // Si el audio está muted (autoplay), desmutear al hacer clic
    if (audioRef.current && audioRef.current.muted) {
      audioRef.current.muted = false
      setIsMuted(false)
      setAutoplayBlocked(false)
    }

    setIsPlaying((prev) => !prev)
  }

  const toggleMute = () => {
    if (!isReady) return
    setIsMuted((prev) => !prev)

    if (audioRef.current) {
      audioRef.current.muted = !isMuted
    }
  }

  const changeVolume = (newVolume) => {
    if (!isReady) return
    setVolume(newVolume)
    if (isMuted && newVolume > 0) {
      setIsMuted(false)
      if (audioRef.current) {
        audioRef.current.muted = false
      }
    }
  }

  const value = {
    isPlaying,
    volume,
    isMuted,
    isReady,
    autoplayBlocked,
    userInteracted,
    togglePlay,
    toggleMute,
    changeVolume,
  }

  return <MusicPlayerContext.Provider value={value}>{children}</MusicPlayerContext.Provider>
}

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext)
  if (context === undefined) {
    throw new Error("useMusicPlayer debe usarse dentro de un MusicPlayerProvider")
  }
  return context
}

