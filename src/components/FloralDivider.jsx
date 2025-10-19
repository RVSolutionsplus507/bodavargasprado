
import { memo } from "react"
import { motion } from "framer-motion"

export const FloralDivider = memo(function FloralDivider() {
  return (
    <motion.div
      className="flex items-center justify-center my-8 md:my-12"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7 }}
    >
      <div className="h-px w-1/4 bg-gradient-to-r from-transparent to-wedding-primary/50 dark:to-wedding-primary-dark/50"></div>
      <div className="mx-4">
        <svg
          className="w-8 h-8 text-wedding-primary dark:text-wedding-primary-dark"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 6C12 6 15 9 15 12C15 15 12 18 12 18C12 18 9 15 9 12C9 9 12 6 12 6Z"
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M6 12H18" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="h-px w-1/4 bg-gradient-to-l from-transparent to-wedding-primary/50 dark:to-wedding-primary-dark/50"></div>
    </motion.div>
  )
})

