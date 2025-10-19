
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { motion, useAnimation, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { RoughUnderline } from "@/components/ui/RoughUnderline"
import { useStore } from "@/store/store"
import { useTranslation } from "react-i18next"

export function RSVPSection() {
  const { t, i18n } = useTranslation()
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, threshold: 0.2 })
  const [showAnnotation, setShowAnnotation] = useState(false)
  const { invitation } = useStore()
  const isConfirmed = invitation?.confirmed || false

  useEffect(() => {
    if (inView) {
      controls.start("visible")
      // Pequeño retraso para asegurar que la anotación se muestre después de que el componente sea visible
      const timer = setTimeout(() => {
        setShowAnnotation(true)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [controls, inView])

  return (
    <motion.section
      ref={ref}
      className="py-20 px-4 bg-gradient-to-br from-rose-50/30 via-amber-50/20 to-rose-50/30 dark:from-rose-950/20 dark:via-amber-950/10 dark:to-rose-950/20"
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      variants={{
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
      }}
    >
      <div className="max-w-3xl mx-auto text-center px-4">
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-serif mb-3 sm:mb-4 text-wedding-primary-dark dark:text-wedding-primary"
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
          }}
        >
          <strong>{t('home.rsvp.title')}</strong>
        </motion.h2>

        <motion.p
          className="mb-6 sm:mb-8 text-sm sm:text-base"
          initial={{ opacity: 0 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, transition: { delay: 0.2, duration: 0.6 } },
          }}
        >
          {t('home.rsvp.description')}{" "}
          <RoughUnderline
            show={showAnnotation}
            strokeWidth={3}
            iterations={2}
            animationDuration={1500}
            color="var(--wedding-primary, #5a8f7b)"
          >
            <strong>{new Date(import.meta.env.VITE_RSVP_DEADLINE).toLocaleDateString(i18n.language === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
          </RoughUnderline>
        </motion.p>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={controls}
          variants={{
            visible: { scale: 1, opacity: 1, transition: { delay: 0.3, duration: 0.5 } },
          }}
        >
          {isConfirmed ? (
            <Button disabled className="bg-wedding-primary/50 text-white cursor-not-allowed min-h-[44px] text-sm sm:text-base px-6 sm:px-8">
              {t('confirm.alreadyConfirmed.title')}
            </Button>
          ) : (
            <Button asChild className="bg-wedding-primary hover:bg-wedding-primary-dark text-white min-h-[44px] text-sm sm:text-base px-6 sm:px-8">
              <Link to="/confirm">{t('home.rsvp.button')}</Link>
            </Button>
          )}
        </motion.div>
      </div>
    </motion.section>
  )
}

