
import { memo } from "react"
import { motion } from "framer-motion"

export const FloralDecoration = memo(function FloralDecoration({ position = "top-right", className = "" }) {
  const positionClasses = {
    "top-right": "top-0 right-0 rotate-0",
    "top-left": "top-0 left-0 -rotate-90",
    "bottom-right": "bottom-0 right-0 rotate-90",
    "bottom-left": "bottom-0 left-0 rotate-180",
  }

  return (
    <motion.div
      className={`floral-decoration ${positionClasses[position]} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.2 }}
      transition={{ duration: 1.5 }}
    >
      <svg width="150" height="150" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g className="text-wedding-primary dark:text-wedding-primary-dark">
          <path
            d="M50 10C45 25 35 35 20 40C35 45 45 55 50 70C55 55 65 45 80 40C65 35 55 25 50 10Z"
            stroke="currentColor"
            fill="none"
            strokeWidth="1"
          />
          <path
            d="M50 20C47 30 40 37 30 40C40 43 47 50 50 60C53 50 60 43 70 40C60 37 53 30 50 20Z"
            stroke="currentColor"
            fill="none"
            strokeWidth="1"
          />
          <path
            d="M30 10C28 18 23 23 15 25C23 27 28 32 30 40C32 32 37 27 45 25C37 23 32 18 30 10Z"
            stroke="currentColor"
            fill="none"
            strokeWidth="1"
          />
          <path
            d="M70 10C68 18 63 23 55 25C63 27 68 32 70 40C72 32 77 27 85 25C77 23 72 18 70 10Z"
            stroke="currentColor"
            fill="none"
            strokeWidth="1"
          />
          <path
            d="M30 60C28 68 23 73 15 75C23 77 28 82 30 90C32 82 37 77 45 75C37 73 32 68 30 60Z"
            stroke="currentColor"
            fill="none"
            strokeWidth="1"
          />
          <path
            d="M70 60C68 68 63 73 55 75C63 77 68 82 70 90C72 82 77 77 85 75C77 73 72 68 70 60Z"
            stroke="currentColor"
            fill="none"
            strokeWidth="1"
          />
        </g>
      </svg>
    </motion.div>
  )
})

