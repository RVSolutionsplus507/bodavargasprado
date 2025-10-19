
import { useEffect, useRef } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { MapPin, Clock, Heart, TreeDeciduous, Utensils } from "lucide-react"
import { LocationMap } from "@/components/LocationMap"
import { OptimizedImage } from "@/components/ui/OptimizedImage"
import { useTranslation } from "react-i18next"

export function LocationSection() {
  const { t } = useTranslation()
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
      className="py-20 px-4 bg-gradient-to-br from-rose-50/30 via-amber-50/20 to-rose-50/30 dark:from-rose-950/20 dark:via-amber-950/10 dark:to-rose-950/20"
      initial={{ opacity: 0 }}
      animate={controls}
      variants={{
        visible: { opacity: 1, transition: { duration: 0.8 } },
      }}
    >
      <div className="max-w-6xl mx-auto">
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
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif mb-4 md:mb-6 bg-gradient-to-r from-wedding-primary-dark to-wedding-primary bg-clip-text text-transparent">
            {t('home.location.title')}
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            {t('home.location.description')}
          </p>
        </motion.div>

        {/* Información del lugar */}
        <motion.div
          variants={itemVariants}
          className="mb-8 md:mb-12"
        >
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-wedding-primary/10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 mb-6">
              <MapPin className="w-7 h-7 sm:w-8 sm:h-8 text-wedding-primary flex-shrink-0" />
              <div className="text-center sm:text-left">
                <h3 className="text-lg sm:text-xl md:text-2xl font-serif text-wedding-primary-dark dark:text-wedding-primary">
                  {t('home.location.venue')}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{t('home.location.city')}</p>
              </div>
            </div>

            {/* Grid de ceremonia y recepción */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6 md:mt-8">
              {/* Ceremonia */}
              <div className="bg-wedding-primary/5 dark:bg-wedding-primary-dark/5 rounded-xl p-4 sm:p-5 md:p-6 border border-wedding-primary/20">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="p-2 sm:p-2.5 md:p-3 rounded-full bg-wedding-primary text-white flex-shrink-0">
                    <TreeDeciduous className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base sm:text-lg md:text-xl text-wedding-primary-dark dark:text-wedding-primary">{t('home.location.ceremony.title')}</h4>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{t('home.location.ceremony.time')}</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t('home.location.ceremony.description')}
                </p>
                {/* Placeholder para imagen del árbol */}
                <div className="mt-4 rounded-lg overflow-hidden aspect-video bg-gradient-to-br from-wedding-primary/10 to-wedding-secondary/10">
                  <OptimizedImage
                    src="/locations/arbol2.webp"
                    alt="Árbol Corotú - Ceremonia"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Recepción */}
              <div className="bg-wedding-secondary/5 dark:bg-wedding-secondary-dark/5 rounded-xl p-4 sm:p-5 md:p-6 border border-wedding-secondary/20">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="p-2 sm:p-2.5 md:p-3 rounded-full bg-wedding-secondary text-white flex-shrink-0">
                    <Utensils className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base sm:text-lg md:text-xl text-wedding-secondary-dark dark:text-wedding-secondary">{t('home.location.reception.title')}</h4>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{t('home.location.reception.time')}</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t('home.location.reception.description')}
                </p>
                {/* Placeholder para imagen del restaurante */}
                <div className="mt-4 rounded-lg overflow-hidden aspect-video bg-gradient-to-br from-wedding-secondary/10 to-wedding-accent/10">
                  <OptimizedImage
                    src="/locations/horokorestaurant.webp"
                    alt="Restaurante Horoko - Recepción"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mapa */}
        <motion.div variants={itemVariants}>
          <LocationMap
            name="Tucán Country Club & Resort"
            address="Cocolí, Panamá"
            mapUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.2!2d-79.5911632!3d8.9649002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8faca7f05d5093f1%3A0x2a67000e0cea8c72!2sTuc%C3%A1n%20Golf%20Club!5e0!3m2!1ses!2spa!4v1710000000000!5m2!1ses!2spa"
          />
        </motion.div>
      </div>
    </motion.section>
  )
}

