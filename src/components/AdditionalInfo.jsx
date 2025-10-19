
import { motion } from "framer-motion"
import { Shirt, Gift, Church, UtensilsCrossed, Music, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { OptimizedImage } from "@/components/ui/OptimizedImage"

export function AdditionalInfo() {
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

  const items = [
    {
      icon: <Shirt className="w-6 h-6" />,
      title: "Código de Vestimenta",
      description: "Traje Formal de Verano",
      details: "Para celebrar este día tan especial, les solicitamos vestir con elegancia. Caballeros: traje formal (excepto crema). Damas: vestido largo o midi elegante, evitando el color blanco.",
      image: "/information/vestimenta.webp",
      bgColor: "bg-wedding-primary",
      textColor: "text-wedding-primary",
      hoverTextColor: "group-hover:text-wedding-primary",
      overlayColor: "bg-wedding-primary/20 group-hover:bg-wedding-primary/30"
    },
    {
      icon: <Church className="w-6 h-6" />,
      title: "Ceremonia",
      description: "Momento Especial",
      details: "Acompáñanos en este momento único donde uniremos nuestras vidas ante nuestros seres queridos. Tu puntualidad es muy importante para nosotros.",
      image: "/information/ceremonia.webp",
      bgColor: "bg-wedding-secondary",
      textColor: "text-wedding-secondary",
      hoverTextColor: "group-hover:text-wedding-secondary",
      overlayColor: "bg-wedding-secondary/20 group-hover:bg-wedding-secondary/30"
    },
    {
      icon: <UtensilsCrossed className="w-6 h-6" />,
      title: "Comida Buffet",
      description: "Deliciosa Variedad",
      details: "Disfruta de un exquisito buffet con una selección de platos especialmente preparados para ti.",
      image: "/information/menu.webp",
      bgColor: "bg-wedding-accent",
      textColor: "text-wedding-accent",
      hoverTextColor: "group-hover:text-wedding-accent",
      overlayColor: "bg-wedding-accent/20 group-hover:bg-wedding-accent/30"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Brindis y Celebración",
      description: "Bar Abierto",
      details: "Disfruta de una noche mágica con bebidas seleccionadas y un ambiente inolvidable.",
      image: "/information/drinks.webp",
      bgColor: "bg-wedding-primary-dark",
      textColor: "text-wedding-primary-dark",
      hoverTextColor: "group-hover:text-wedding-primary-dark",
      overlayColor: "bg-wedding-primary-dark/20 group-hover:bg-wedding-primary-dark/30"
    },
    {
      icon: <Music className="w-6 h-6" />,
      title: "Baile y Diversión",
      description: "¡A Celebrar!",
      details: "Prepara tus mejores pasos de baile. ¡Ojo! Los capitanes de mesa estarán regalando shots 🥃",
      image: "/information/brindis.webp",
      bgColor: "bg-wedding-secondary-dark",
      textColor: "text-wedding-secondary-dark",
      hoverTextColor: "group-hover:text-wedding-secondary-dark",
      overlayColor: "bg-wedding-secondary-dark/20 group-hover:bg-wedding-secondary-dark/30"
    },
    {
      icon: <Gift className="w-6 h-6" />,
      title: "Lluvia de Sobres",
      description: "Un Detalle Especial",
      details: "Si deseas hacernos un regalo, un sobre con amor nos ayudará en esta nueva etapa de vida 💝",
      image: "/information/sobres.webp",
      bgColor: "bg-wedding-accent-dark",
      textColor: "text-wedding-accent-dark",
      hoverTextColor: "group-hover:text-wedding-accent-dark",
      overlayColor: "bg-wedding-accent-dark/20 group-hover:bg-wedding-accent-dark/30"
    },
  ]

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
            Información Importante
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Todo lo que necesitas saber para disfrutar al máximo de nuestro día especial
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-4">
          {items.map((item, index) => (
            <motion.div
              key={item.title}
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
                      {item.icon}
                    </div>
                  </div>
                </div>

                <CardContent className="p-3 sm:p-4 md:p-5">
                  <h3 className={`text-base sm:text-lg font-serif mb-1.5 sm:mb-2 text-gray-900 dark:text-white ${item.hoverTextColor} transition-colors duration-300`}>
                    {item.title}
                  </h3>

                  <p className={`font-semibold ${item.textColor} mb-1.5 sm:mb-2 text-xs sm:text-sm`}>
                    {item.description}
                  </p>

                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {item.details}
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

