
import { Heart, Calendar, MapPin, Camera } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"

export function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-6 sm:py-8 px-4 text-center bg-wedding-primary/10 dark:bg-wedding-primary-dark/10">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}>
          <h2 className="font-cursive text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4 text-wedding-primary-dark dark:text-wedding-primary">
            Ambar & Roberto
          </h2>

          <p className="mb-3 sm:mb-4 text-sm sm:text-base">{t('home.date')}</p>

          <div className="flex justify-center space-x-4 sm:space-x-6 mb-4 sm:mb-6">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-wedding-primary dark:text-wedding-primary-dark" />
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-wedding-primary dark:text-wedding-primary-dark" />
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-wedding-primary dark:text-wedding-primary-dark" />
            <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-wedding-primary dark:text-wedding-primary-dark" />
          </div>

          <p className="text-xs sm:text-sm text-wedding-text/70 dark:text-wedding-text-dark/70 px-2">
            © {currentYear} Ambar & Roberto - {t('footer.rights')}
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

