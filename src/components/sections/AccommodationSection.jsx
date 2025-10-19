import { useEffect, useRef } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { Hotel, Phone, Mail, Heart, Percent, Bed, Clock, DollarSign } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { OptimizedImage } from "@/components/ui/OptimizedImage"

export function AccommodationSection() {
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
        visible: { opacity: 1, transition: { duration: 0.8 } },
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-wedding-primary"></div>
            <Heart className="w-6 h-6 text-wedding-primary fill-current" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-wedding-primary"></div>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif mb-4 md:mb-6 bg-gradient-to-r from-wedding-primary-dark to-wedding-primary bg-clip-text text-transparent">
            Hospedaje
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            Para tu comodidad, tenemos apartamentos disponibles en el Tucán Country Club & Resort
          </p>
        </motion.div>

        {/* Card principal */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-2 border-wedding-primary/20 shadow-2xl bg-white dark:bg-gray-900 p-0">
            <div className="bg-gradient-to-r from-wedding-primary to-wedding-primary-dark p-4 sm:p-5 md:p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 text-white text-center sm:text-left">
                <div className="p-3 sm:p-4 bg-white/20 rounded-full backdrop-blur-sm flex-shrink-0">
                  <Hotel className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-serif">Tucán Country Club & Resort</h3>
                  <p className="text-white/90 text-xs sm:text-sm">Apartamentos Disponibles</p>
                </div>
              </div>
            </div>

            <CardContent className="p-4 sm:p-5 md:p-6">
              {/* Imagen del lugar */}
              <div className="mb-6 rounded-xl overflow-hidden shadow-lg">
                <OptimizedImage
                  src="/locations/habitaciones.webp"
                  alt="Habitaciones Tucán Golf Club"
                  className="w-full h-48 object-cover"
                />
              </div>

              {/* Tipos de Apartamentos */}
              <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
                <h4 className="text-base sm:text-lg font-serif text-wedding-primary-dark dark:text-wedding-primary flex items-center gap-2">
                  <Bed className="w-4 h-4 sm:w-5 sm:h-5" />
                  Apartamentos Disponibles
                </h4>

                {/* Apartamento 1 recámara */}
                <div className="bg-gradient-to-br from-wedding-primary/5 to-wedding-secondary/5 rounded-xl p-3 sm:p-4 border border-wedding-primary/20">
                  <h5 className="font-semibold text-sm sm:text-base mb-2 text-gray-900 dark:text-white">
                    Apartamento de 1 Recámara
                  </h5>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-wedding-primary mt-0.5 flex-shrink-0">•</span>
                      <span>Cama Queen size (para 2 personas)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-wedding-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Primera noche:</strong> $95.00 USD</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-wedding-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Noches adicionales:</strong> $70.00 USD/noche</span>
                    </li>
                  </ul>
                </div>

                {/* Apartamento 2 recámaras */}
                <div className="bg-gradient-to-br from-wedding-primary/5 to-wedding-secondary/5 rounded-xl p-3 sm:p-4 border border-wedding-primary/20">
                  <h5 className="font-semibold text-sm sm:text-base mb-2 text-gray-900 dark:text-white">
                    Apartamento de 2 Recámaras
                  </h5>
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-wedding-primary-dark dark:text-wedding-primary mb-1">Opción 1:</p>
                      <ul className="space-y-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300 ml-3 sm:ml-4">
                        <li className="flex items-start gap-2">
                          <span className="text-wedding-primary flex-shrink-0">•</span>
                          <span>Cama Queen en cada habitación</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-wedding-primary-dark dark:text-wedding-primary mb-1">Opción 2:</p>
                      <ul className="space-y-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300 ml-3 sm:ml-4">
                        <li className="flex items-start gap-2">
                          <span className="text-wedding-primary flex-shrink-0">•</span>
                          <span>Cama Queen en habitación principal</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-wedding-primary flex-shrink-0">•</span>
                          <span>2 camas twins en habitación secundaria</span>
                        </li>
                      </ul>
                    </div>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-300 pt-2 border-t border-wedding-primary/10">
                      <li className="flex items-start gap-2">
                        <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-wedding-primary mt-0.5 flex-shrink-0" />
                        <span><strong>Primera noche:</strong> $125.00 USD</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-wedding-primary mt-0.5 flex-shrink-0" />
                        <span><strong>Noches adicionales:</strong> $90.00 USD/noche</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Horarios */}
                <div className="bg-wedding-secondary/10 rounded-xl p-3 sm:p-4 border border-wedding-secondary/20">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-wedding-secondary-dark flex-shrink-0" />
                    <h5 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">Horarios</h5>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                    <div>
                      <p className="font-medium text-wedding-secondary-dark dark:text-wedding-secondary">Check-in</p>
                      <p className="text-gray-600 dark:text-gray-300">3:00 PM</p>
                    </div>
                    <div>
                      <p className="font-medium text-wedding-secondary-dark dark:text-wedding-secondary">Check-out</p>
                      <p className="text-gray-600 dark:text-gray-300">12:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información de contacto */}
              <div className="bg-wedding-primary/5 dark:bg-wedding-primary-dark/5 rounded-xl p-3 sm:p-4 md:p-5 border border-wedding-primary/20">
                <h4 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4 text-wedding-primary-dark dark:text-wedding-primary">
                  Para Reservaciones
                </h4>

                <div className="space-y-2.5 sm:space-y-3">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-wedding-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Contacto</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">Raul Venedetti</p>
                      <a href="tel:+50767047773" className="text-xs sm:text-sm text-wedding-primary font-medium hover:underline min-h-[44px] inline-flex items-center">
                        +507 6704-7773
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 sm:gap-3">
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-wedding-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Correo Electrónico</p>
                      <a href="mailto:rbenedetti@tucancountryclub.com" className="text-xs sm:text-sm text-wedding-primary font-medium hover:underline break-all min-h-[44px] inline-flex items-center">
                        rbenedetti@tucancountryclub.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-wedding-secondary/10 rounded-lg border border-wedding-secondary/20">
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                    <strong className="text-wedding-secondary-dark dark:text-wedding-secondary">Importante:</strong>
                    {" "}Menciona que eres invitado de la boda de Ambar & Roberto para acceder al descuento especial.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Nota adicional */}
        <motion.div
          variants={itemVariants}
          className="mt-6 sm:mt-8 text-center px-4"
        >
          <p className="text-xs sm:text-sm text-muted-foreground italic">
            Las habitaciones están sujetas a disponibilidad. Te recomendamos reservar con anticipación.
          </p>
        </motion.div>
      </div>
    </motion.section>
  )
}
