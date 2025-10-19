import { Outlet } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { useEffect, useRef } from "react"
import { useStore } from "@/store/store"
import { MusicPlayer } from "@/components/ui/MusicPlayer"
import { MusicPlayerProvider } from "@/contexts/MusicPlayerContext"
import { AudioUnlocker } from "@/components/AudioUnlocker"
import { useMusicPlayer } from "@/contexts/MusicPlayerContext"

// Componente para manejar interacciones globales
function InteractionHandler() {
  const { isPlaying, togglePlay, isReady, autoplayBlocked } = useMusicPlayer()
  const interactionAttempted = useRef(false)

  useEffect(() => {
    // Función para intentar reproducir música después de interacción del usuario
    const handleUserInteraction = () => {
      if (!interactionAttempted.current && (!isPlaying || autoplayBlocked) && isReady) {
        interactionAttempted.current = true
        togglePlay()

        // Eliminar los event listeners después de la primera interacción exitosa
        removeEventListeners()
      }
    }

    const removeEventListeners = () => {
      document.removeEventListener("click", handleUserInteraction)
      document.removeEventListener("touchstart", handleUserInteraction)
      document.removeEventListener("keydown", handleUserInteraction)
      document.removeEventListener("scroll", handleUserInteraction)
    }

    // Solo agregar event listeners si el autoplay está bloqueado o no está reproduciendo
    if ((autoplayBlocked || !isPlaying) && isReady) {
      // Agregar event listeners para detectar interacción del usuario
      document.addEventListener("click", handleUserInteraction)
      document.addEventListener("touchstart", handleUserInteraction)
      document.addEventListener("keydown", handleUserInteraction)
      document.addEventListener("scroll", handleUserInteraction)

      // Intentar reproducir automáticamente después de un breve retraso
      const timer = setTimeout(() => {
        if (!isPlaying && isReady) {
          togglePlay()
        }
      }, 1000)

      return () => {
        removeEventListeners()
        clearTimeout(timer)
      }
    }
  }, [isReady, isPlaying, autoplayBlocked, togglePlay])

  // Componente invisible
  return null
}

export function MainLayout() {
  const { theme } = useStore()

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  return (
    <MusicPlayerProvider>
      {/* AudioUnlocker se monta primero para desbloquear el audio lo antes posible */}
      <AudioUnlocker />
      <InteractionHandler />

      <div className="min-h-screen flex flex-col bg-wedding-background dark:bg-wedding-background-dark text-wedding-text dark:text-wedding-text-dark">
        <Navbar />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
        <MusicPlayer />
      </div>
    </MusicPlayerProvider>
  )
}

