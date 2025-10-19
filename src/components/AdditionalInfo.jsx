
import { useMemo } from "react"
import { motion } from "framer-motion"
import { Shirt, Gift, Church, UtensilsCrossed, Music, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { OptimizedImage } from "@/components/ui/OptimizedImage"
import { useTranslation } from "react-i18next"

// Definir iconos fuera del componente para que no se recreen
const icons = {
  dressCode: Shirt,
  ceremony: Church,
  buffet: UtensilsCrossed,
  toast: Heart,
  dance: Music,
  gifts: Gift,
}

export function AdditionalInfo() {
  const { t, i18n } = useTranslation()
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12,
      },
    },
  }

  // Usar useMemo para recalcular items cuando cambie el idioma
  const items = useMemo(() => [
    {
      id: 'dressCode', // ID único que no cambia
      iconComponent: icons.dressCode,
      title: t('home.importantInfo.dressCode.title'),
      description: t('home.importantInfo.dressCode.description'),
      image: "/information/vestimenta.webp",
      bgColor: "bg-wedding-primary",
      textColor: "text-wedding-primary",
      hoverTextColor: "group-hover:text-wedding-primary",
      overlayColor: "bg-wedding-primary/20 group-hover:bg-wedding-primary/30"
    },
    {
      id: 'ceremony',
      iconComponent: icons.ceremony,
      title: t('home.importantInfo.ceremony.title'),
      description: t('home.importantInfo.ceremony.description'),
      image: "/information/ceremonia.webp",
      bgColor: "bg-wedding-secondary",
      textColor: "text-wedding-secondary",
      hoverTextColor: "group-hover:text-wedding-secondary",
      overlayColor: "bg-wedding-secondary/20 group-hover:bg-wedding-secondary/30"
    },
    {
      id: 'buffet',
      iconComponent: icons.buffet,
      title: t('home.importantInfo.buffet.title'),
      description: t('home.importantInfo.buffet.description'),
      image: "/information/menu.webp",
      bgColor: "bg-wedding-accent",
      textColor: "text-wedding-accent",
      hoverTextColor: "group-hover:text-wedding-accent",
      overlayColor: "bg-wedding-accent/20 group-hover:bg-wedding-accent/30"
    },
    {
      id: 'toast',
      iconComponent: icons.toast,
      title: t('home.importantInfo.toast.title'),
      description: t('home.importantInfo.toast.description'),
      image: "/information/drinks.webp",
      bgColor: "bg-wedding-primary-dark",
      textColor: "text-wedding-primary-dark",
      hoverTextColor: "group-hover:text-wedding-primary-dark",
      overlayColor: "bg-wedding-primary-dark/20 group-hover:bg-wedding-primary-dark/30"
    },
    {
      id: 'dance',
      iconComponent: icons.dance,
      title: t('home.importantInfo.dance.title'),
      description: t('home.importantInfo.dance.description'),
      image: "/information/brindis.webp",
      bgColor: "bg-wedding-secondary-dark",
      textColor: "text-wedding-secondary-dark",
      hoverTextColor: "group-hover:text-wedding-secondary-dark",
      overlayColor: "bg-wedding-secondary-dark/20 group-hover:bg-wedding-secondary-dark/30"
    },
    {
      id: 'gifts',
      iconComponent: icons.gifts,
      title: t('home.importantInfo.gifts.title'),
      description: t('home.importantInfo.gifts.description'),
      image: "/information/sobres.webp",
      bgColor: "bg-wedding-accent-dark",
      textColor: "text-wedding-accent-dark",
      hoverTextColor: "group-hover:text-wedding-accent-dark",
      overlayColor: "bg-wedding-accent-dark/20 group-hover:bg-wedding-accent-dark/30"
    },
  ], [t, i18n.language]) // Recalcular cuando cambie el idioma

  return (
    <motion.section
      className="py-20 px-4 bg-wedding-primary/10 dark:bg-wedding-primary-dark/10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, threshold: 0.1 }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          variants={itemVariants}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-wedding-primary"></div>
            <Heart className="w-6 h-6 text-wedding-primary fill-current" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-wedding-primary"></div>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif mb-4 md:mb-6 bg-gradient-to-r from-wedding-primary-dark to-wedding-primary bg-clip-text text-transparent">
            {t('home.importantInfo.title')}
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            {t('home.aboutUs.description')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-4">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="group"
            >
              <Card className="h-full overflow-hidden border border-wedding-primary/10 dark:border-wedding-primary-dark/10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white dark:bg-gray-900 p-0">
                <div className="relative">
                  <div className="aspect-[16/9] overflow-hidden">
                    <OptimizedImage
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      fallback={`/placeholder.svg?height=200&width=320&text=${encodeURIComponent(item.title)}`}
                    />
                    <div className={`absolute inset-0 ${item.overlayColor} transition-all duration-500`}></div>
                  </div>

                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                    <div className={`p-2 sm:p-2.5 rounded-full ${item.bgColor} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {item.iconComponent && <item.iconComponent className="w-6 h-6" />}
                    </div>
                  </div>
                </div>

                <CardContent className="p-3 sm:p-4 md:p-5">
                  <h3 className={`text-base sm:text-lg font-serif mb-2 sm:mb-3 text-gray-900 dark:text-white ${item.hoverTextColor} transition-colors duration-300`}>
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

