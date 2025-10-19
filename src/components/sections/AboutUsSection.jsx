import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { motion, useAnimation, useInView } from "framer-motion"
import { ArrowRight, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OptimizedImage } from "@/components/ui/OptimizedImage"
import { carouselItems } from "@/services/carouselItems"
import { useTranslation } from "react-i18next"

export function AboutUsSectionAttachment() {
  const { t } = useTranslation()
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, threshold: 0.2 })
  
  // Obtener los momentos traducidos
  const moments = t('home.aboutUs.moments', { returnObjects: true })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

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
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={controls}
          variants={{
            visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
          }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-wedding-primary"></div>
            <Heart className="w-6 h-6 text-wedding-primary fill-current" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-wedding-primary"></div>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif mb-4 md:mb-6 bg-gradient-to-r from-wedding-primary-dark to-wedding-primary bg-clip-text text-transparent">
            {t('home.aboutUs.title')}
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            {t('home.aboutUs.description')}
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={controls}
          variants={{
            visible: { y: 0, opacity: 1, transition: { delay: 0.3, duration: 0.8 } },
          }}
          className="max-w-4xl mx-auto relative"
        >
          {/* Línea vertical del timeline */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-wedding-primary/20 via-wedding-primary to-wedding-primary/20 hidden md:block" />
          
          <div className="space-y-12">
            {carouselItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={controls}
                variants={{
                  visible: { 
                    opacity: 1, 
                    x: 0, 
                    transition: { 
                      delay: 0.4 + (index * 0.2), 
                      duration: 0.6 
                    } 
                  },
                }}
                className={`flex flex-col md:flex-row gap-8 items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Contenido de texto */}
                <div className="flex-1 md:text-right md:pr-8 md:pl-0">
                  <div className={`text-center md:text-left ${index % 2 === 0 ? 'md:text-right' : 'md:text-left md:pl-8 md:pr-0'}`}>
                    <div className="inline-block bg-wedding-primary/10 dark:bg-wedding-primary-dark/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-3 md:mb-4">
                      <span className="text-xs sm:text-sm font-semibold text-wedding-primary-dark dark:text-wedding-primary">
                        {t('home.aboutUs.momentLabel')} {index + 1}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-wedding-primary-dark dark:text-wedding-primary mb-2 md:mb-3 px-2">
                      {moments[index]?.title || item.title}
                    </h3>
                    <p className="text-sm sm:text-base md:text-lg font-medium text-gray-800 dark:text-gray-200 leading-relaxed px-2">
                      {moments[index]?.description || item.description}
                    </p>
                  </div>
                </div>

                {/* Punto central del timeline */}
                <div className="relative z-10 hidden md:block">
                  <div className="w-4 h-4 rounded-full bg-wedding-primary border-4 border-white dark:border-gray-900 shadow-lg" />
                </div>

                {/* Imagen o Collage */}
                <div className="flex-1 md:pl-8 md:pr-0 lg:flex-[1.5]">
                  <div className={`${index % 2 === 0 ? '' : 'md:pl-0 md:pr-8'}`}>
                    {item.type === 'single' ? (
                      /* Imagen individual */
                      <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500">
                        <div className="aspect-square overflow-hidden">
                          <OptimizedImage
                            src={item.images[0]}
                            alt={`${item.title} - ${item.description}`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-wedding-primary-dark/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                        <div className="absolute top-4 right-4">
                          <Heart className="w-6 h-6 text-white fill-white opacity-80" />
                        </div>
                      </div>
                    ) : (
                      /* Collage de imágenes */
                      <div className="relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
                        {item.images.length === 3 ? (
                          /* Collage de 3 imágenes: 1 grande arriba, 2 pequeñas abajo */
                          <div className="grid gap-2">
                            <div className="group relative overflow-hidden aspect-[16/9]">
                              <OptimizedImage
                                src={item.images[0]}
                                alt={`${item.title} - Foto 1`}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {item.images.slice(1).map((img, idx) => (
                                <div key={idx} className="group relative overflow-hidden aspect-[3/2]">
                                  <OptimizedImage
                                    src={img}
                                    alt={`${item.title} - Foto ${idx + 2}`}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          /* Collage de 4 imágenes: grid 2x2 */
                          <div className="grid grid-cols-2 gap-2">
                            {item.images.map((img, idx) => (
                              <div key={idx} className="group relative overflow-hidden aspect-square">
                                <OptimizedImage
                                  src={img}
                                  alt={`${item.title} - Foto ${idx + 1}`}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="absolute top-4 right-4 z-10">
                          <Heart className="w-6 h-6 text-white fill-white opacity-80 drop-shadow-lg" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="text-center mt-12 md:mt-16 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { delay: 0.8, duration: 0.6 } },
          }}
        >
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-wedding-primary to-wedding-primary-dark hover:from-wedding-primary-dark hover:to-wedding-primary text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 min-h-[44px]"
          >
            <Link to="/gallery" className="flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 text-sm sm:text-base">
              <span className="font-medium">{t('home.aboutUs.viewGallery')}</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </motion.section>
  )
}

