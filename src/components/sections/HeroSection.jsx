import { useEffect, useRef, useState } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { CountdownTimer } from "@/components/CountdownTimer"
import { VideoBackground } from "@/components/ui/VideoBackground"
import { ArrowDown } from "lucide-react"
import anillos from "@/assets/anillos.png"

export function HeroSection() {
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [videoExists, setVideoExists] = useState(true)

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  useEffect(() => {
    const checkVideo = async () => {
      try {
        const response = await fetch("/ambaryroberto.mp4", { method: "HEAD" })
        setVideoExists(response.ok)
      } catch {
        setVideoExists(false)
      }
    }
    checkVideo()
  }, [])

  return (
    <motion.section
      ref={ref}
      className="min-h-[90vh] flex items-center justify-center py-12 px-4 relative overflow-hidden"
      initial="hidden"
      animate={controls}
      variants={containerVariants}
    >
      {videoExists ? (
        <VideoBackground src="/ambaryroberto.mp4" blurAmount={0.5} opacity={100} />
      ) : (
        <div className="absolute inset-0 bg-wedding-primary/20 dark:bg-wedding-primary-dark/20 z-0"></div>
      )}

      {/* Capa de gradiente para mejorar el contraste */}
      <div className="absolute inset-0 bg-gradient-to-b from-wedding-background/70 to-wedding-primary/30 dark:from-wedding-background-dark/70 dark:to-wedding-primary-dark/30 z-10"></div>

      {/* Contenido principal con Card semi-transparente */}
      <motion.div className="relative z-20 w-full max-w-4xl mx-auto" variants={itemVariants}>
        <div className="backdrop-blur-lg bg-white/40 dark:bg-black/40 rounded-xl shadow-lg p-4 sm:p-6 md:p-8 border border-white/20 dark:border-gray-800/30">
          <div className="text-center">
            <motion.div variants={itemVariants} className="mb-2">
              <img
                src={anillos || "/placeholder.svg"}
                alt="Anillos de boda"
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto object-contain"
              />
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-cursive text-3xl sm:text-4xl md:text-5xl lg:text-7xl mb-6 md:mb-8 text-wedding-primary-dark dark:text-wedding-primary drop-shadow-lg"
            >
              Ambar & Roberto
            </motion.h1>

            <motion.div variants={itemVariants} className="mb-8">
              <CountdownTimer weddingDate="2026-01-17T16:00:00" />
            </motion.div>

            <motion.div variants={itemVariants} className="flex justify-center">
              <div className="bg-white/30 dark:bg-black/30 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-wedding-primary/20 dark:border-wedding-primary-dark/20 max-w-md mx-auto">
                <h3 className="text-base sm:text-lg font-medium mb-2 text-wedding-primary-dark dark:text-wedding-primary">
                  Confirma tu asistencia
                </h3>
                <p className="text-xs sm:text-sm mb-2 leading-relaxed">
                  Para confirmar tu asistencia, por favor dirígete al menu "Confirma Asistencia" y utiliza el código proporcionado.
                </p>
                <div className="flex justify-center mt-3">
                  <ArrowDown className="animate-bounce text-wedding-primary dark:text-wedding-primary-dark w-5 h-5" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  )
}

