import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Music, Pause, Play, Volume2, VolumeX } from "lucide-react"
import { useMusicPlayer } from "@/contexts/MusicPlayerContext"

export function MusicPlayer() {
  const { isPlaying, volume, isMuted, autoplayBlocked, userInteracted, togglePlay, toggleMute, changeVolume } =
    useMusicPlayer()
  const [isExpanded, setIsExpanded] = useState(false)
  const [showAutoplayNotice, setShowAutoplayNotice] = useState(false)

  // Mostrar notificación si el autoplay está bloqueado
  useEffect(() => {
    if (autoplayBlocked && !userInteracted) {
      setShowAutoplayNotice(true)
      // Ocultar después de 8 segundos
      const timer = setTimeout(() => {
        setShowAutoplayNotice(false)
      }, 8000)

      return () => clearTimeout(timer)
    } else if (userInteracted) {
      // Ocultar la notificación si el usuario ha interactuado
      setShowAutoplayNotice(false)
    }
  }, [autoplayBlocked, userInteracted])

  // Efecto de pulso para llamar la atención cuando el autoplay está bloqueado
  const pulseEffect = autoplayBlocked && !userInteracted

  return (
    <>
      {/* Notificación de autoplay bloqueado */}
      <AnimatePresence>
        {showAutoplayNotice && (
          <motion.div
            className="fixed bottom-[72px] sm:bottom-20 right-3 sm:right-6 z-50 bg-white dark:bg-wedding-background-dark p-3 sm:p-4 rounded-lg shadow-lg border border-wedding-primary/20 dark:border-wedding-primary-dark/20 max-w-[calc(100vw-1.5rem)] sm:max-w-xs"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 pr-6">¡Música de nuestra boda!</p>
            <p className="text-xs sm:text-sm mb-2 sm:mb-3">
              Haz clic en el botón de música para comenzar a reproducir la banda sonora de nuestra boda.
            </p>
            <button
              onClick={() => togglePlay()}
              className="w-full py-2 px-4 bg-wedding-primary text-white rounded-md hover:bg-wedding-primary-dark transition-colors text-sm min-h-[44px]"
            >
              Reproducir Música
            </button>
            <button
              onClick={() => setShowAutoplayNotice(false)}
              className="absolute top-2 right-2 text-wedding-primary-dark dark:text-wedding-primary text-base min-h-[24px] min-w-[24px] flex items-center justify-center"
              aria-label="Cerrar notificación"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 flex items-center bg-white dark:bg-wedding-background-dark rounded-full shadow-lg border border-wedding-primary/20 dark:border-wedding-primary-dark/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isExpanded && (
          <motion.div
            className="flex items-center mr-2 pl-4"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
          >
            <button
              onClick={toggleMute}
              className="p-2 text-wedding-primary-dark dark:text-wedding-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              aria-label={isMuted ? "Activar sonido" : "Silenciar"}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => changeVolume(Number.parseFloat(e.target.value))}
              className="w-20 mx-2 accent-wedding-primary-dark dark:accent-wedding-primary"
              aria-label="Control de volumen"
            />
          </motion.div>
        )}

        <button
          onClick={togglePlay}
          className="p-2.5 sm:p-3 text-wedding-primary-dark dark:text-wedding-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
        >
          {isPlaying ? <Pause size={18} className="sm:w-5 sm:h-5" /> : <Play size={18} className="sm:w-5 sm:h-5" />}
        </button>

        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-2.5 sm:p-3 bg-wedding-primary text-white dark:bg-wedding-primary-dark dark:text-white rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center ${pulseEffect ? "relative" : ""}`}
          animate={pulseEffect ? { scale: [1, 1.1, 1] } : {}}
          transition={pulseEffect ? { repeat: Number.POSITIVE_INFINITY, duration: 2 } : {}}
          aria-label="Mostrar controles de música"
        >
          <Music size={18} className="sm:w-5 sm:h-5" />
          {pulseEffect && (
            <span className="absolute inset-0 rounded-full bg-wedding-primary animate-ping opacity-75"></span>
          )}
        </motion.button>
      </motion.div>
    </>
  )
}

