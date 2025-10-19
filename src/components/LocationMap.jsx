
import { motion } from "framer-motion"

export function LocationMap({ name, address, mapUrl, className }) {
  return (
    <motion.div
      className={`w-full rounded-lg overflow-hidden shadow-lg ${className}`}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      transition={{ duration: 0.3 }}
    >
      <iframe
        src={mapUrl}
        width="100%"
        height="250"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full sm:h-[300px] md:h-[350px]"
        title={name}
      />
      <div className="p-3 sm:p-4 bg-white dark:bg-wedding-background-dark">
        <h3 className="text-base sm:text-lg font-semibold">{name}</h3>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{address}</p>
      </div>
    </motion.div>
  )
}

