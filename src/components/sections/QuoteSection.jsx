
import { useEffect, useRef } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { Heart } from "lucide-react"
import { WeddingQuotes } from "@/components/WeddingQuotes"
import { OptimizedImage } from "@/components/ui/OptimizedImage"
import { FloralDecoration } from "@/components/FloralDecoration"
import { FloralDivider } from "@/components/FloralDivider"

export function QuoteSection() {
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, threshold: 0.2 })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <motion.section
      ref={ref}
      className="py-20 px-4 bg-wedding-primary/10 dark:bg-wedding-primary-dark/10"
      initial={{ opacity: 0 }}
      animate={controls}
      variants={{
        visible: { opacity: 1, transition: { duration: 1 } },
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-wedding-primary"></div>
            <Heart className="w-6 h-6 text-wedding-primary fill-current" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-wedding-primary"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-serif mb-6 bg-gradient-to-r from-wedding-primary-dark to-wedding-primary bg-clip-text text-transparent">
            Reflexiones
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Palabras que inspiran nuestro amor y celebración
          </p>
        </motion.div>

        {/* Layout: Reflexiones arriba, Imagen abajo (igual que mobile) */}
        <div className="flex flex-col items-center gap-8">
          {/* Reflexiones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            variants={{
              visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.3 } },
            }}
            className="w-full"
          >
            <WeddingQuotes />
          </motion.div>

          {/* Imagen con mask (sombra interna) y decoraciones florales */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            variants={{
              visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.5 } },
            }}
            className="w-full relative flex items-center justify-center gap-6"
          >
            {/* Floral Divider Izquierdo - Solo desktop */}
            <div className="hidden lg:block flex-shrink-0">
              <div className="transform rotate-90">
                <FloralDivider />
              </div>
            </div>

            {/* Imagen con decoraciones */}
            <div className="relative max-w-[320px]">
              {/* Decoraciones florales sutiles */}
              <div className="hidden lg:block">
                <FloralDecoration position="top-left" className="absolute -left-16 -top-8 opacity-40 scale-75" />
                <FloralDecoration position="bottom-right" className="absolute -right-16 -bottom-8 opacity-40 scale-75" />
              </div>

              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <OptimizedImage
                  src="/gallery/Pre Boda - Ambar & Roberto-3.webp"
                  alt="Ambar y Roberto"
                  className="w-full h-auto object-cover aspect-[3/4]"
                />
                {/* Mask - Sombra interna */}
                <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.3)] pointer-events-none rounded-2xl"></div>
              </div>
            </div>

            {/* Floral Divider Derecho - Solo desktop */}
            <div className="hidden lg:block flex-shrink-0">
              <div className="transform rotate-90">
                <FloralDivider />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

