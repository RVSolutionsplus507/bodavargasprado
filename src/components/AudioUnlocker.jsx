import { useEffect, useRef } from "react"
import { useMusicPlayer } from "@/contexts/MusicPlayerContext"

export function AudioUnlocker() {
  const { isPlaying, togglePlay, isReady, autoplayBlocked } = useMusicPlayer()
  const unlockAttempted = useRef(false)

  useEffect(() => {
    // Función para desbloquear audio en iOS
    const unlockAudio = () => {
      if (unlockAttempted.current) return
      unlockAttempted.current = true

      // Crear un AudioContext temporal
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()

      // Crear un oscilador silencioso
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      gainNode.gain.value = 0 // Silenciar
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Reproducir brevemente y detener
      oscillator.start(0)
      oscillator.stop(0.001)

      // Intentar reproducir la música si está lista
      if (isReady && !isPlaying) {
        setTimeout(() => togglePlay(), 500)
      }

      // Limpiar event listeners
      document.removeEventListener("touchstart", unlockAudio)
      document.removeEventListener("touchend", unlockAudio)
      document.removeEventListener("click", unlockAudio)
    }

    // Agregar event listeners para desbloquear audio
    document.addEventListener("touchstart", unlockAudio)
    document.addEventListener("touchend", unlockAudio)
    document.addEventListener("click", unlockAudio)

    return () => {
      document.removeEventListener("touchstart", unlockAudio)
      document.removeEventListener("touchend", unlockAudio)
      document.removeEventListener("click", unlockAudio)
    }
  }, [isReady, isPlaying, togglePlay])

  // Componente invisible
  return null
}

