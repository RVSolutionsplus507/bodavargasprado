import { useState, useEffect } from "react"
import Countdown from "react-countdown"
import { Heart } from "lucide-react"
import { motion } from "framer-motion"
import { RoughUnderline } from "@/components/ui/RoughUnderline"
import { useTranslation } from "react-i18next"

export function CountdownTimer({ weddingDate }) {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const date = new Date(weddingDate)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  return (
    <motion.div className="flex flex-col items-center" variants={containerVariants} initial="hidden" animate="visible">
      <motion.h3 variants={itemVariants} className="text-lg sm:text-xl md:text-2xl font-bold mb-3 md:mb-4 text-wedding-accent dark:text-wedding-accent-dark text-center px-2">
        {t('home.countdown.title')}
      </motion.h3>
      <Countdown
        date={date}
        renderer={({ days, hours, minutes, seconds, completed }) => {
          if (completed) {
            return (
              <motion.p variants={itemVariants} className="text-lg sm:text-xl">
                ¡Hoy es el gran día!
              </motion.p>
            )
          } else {
            return (
              <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 text-center w-full max-w-lg">
                <motion.div
                  className="bg-wedding-primary/20 dark:bg-wedding-primary-dark/20 p-2 sm:p-3 rounded-lg min-h-[70px] sm:min-h-[80px] flex flex-col justify-center"
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold">{days}</div>
                  <div className="text-xs sm:text-sm mt-1">{t('home.countdown.days')}</div>
                </motion.div>
                <motion.div
                  className="bg-wedding-secondary/20 dark:bg-wedding-secondary-dark/20 p-2 sm:p-3 rounded-lg min-h-[70px] sm:min-h-[80px] flex flex-col justify-center"
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold">{hours}</div>
                  <div className="text-xs sm:text-sm mt-1">{t('home.countdown.hours')}</div>
                </motion.div>
                <motion.div
                  className="bg-wedding-accent/20 dark:bg-wedding-accent-dark/20 p-2 sm:p-3 rounded-lg min-h-[70px] sm:min-h-[80px] flex flex-col justify-center"
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold">{minutes}</div>
                  <div className="text-xs sm:text-sm mt-1">{t('home.countdown.minutes')}</div>
                </motion.div>
                <motion.div
                  className="bg-wedding-primary/20 dark:bg-wedding-primary-dark/20 p-2 sm:p-3 rounded-lg min-h-[70px] sm:min-h-[80px] flex flex-col justify-center"
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold">{seconds}</div>
                  <div className="text-xs sm:text-sm mt-1">{t('home.countdown.seconds')}</div>
                </motion.div>
              </motion.div>
            )
          }
        }}
      />
      <motion.div
        variants={itemVariants}
        className="flex items-center mt-3 md:mt-4 [filter:drop-shadow(0_0_8px_rgba(255,255,255,0.9))_drop-shadow(0_0_12px_rgba(255,255,255,0.7))_drop-shadow(0_2px_4px_rgba(255,255,255,0.5))] dark:[filter:drop-shadow(0_0_8px_rgba(0,0,0,0.9))_drop-shadow(0_0_12px_rgba(0,0,0,0.7))_drop-shadow(0_2px_4px_rgba(0,0,0,0.5))]"
      >
        <Heart className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mr-2 text-wedding-accent dark:text-wedding-accent-dark animate-pulse fill-current" />
        <div className="relative inline-block font-cursive text-xl sm:text-2xl md:text-3xl text-wedding-accent dark:text-wedding-accent-dark">
          <RoughUnderline
            show={true}
            strokeWidth={3}
            iterations={2}
            animationDuration={5000}
            color="currentColor"
          >
            {t('home.date')}
          </RoughUnderline>
        </div>
      </motion.div>
    </motion.div>
  )
}

