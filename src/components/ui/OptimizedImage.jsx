import { useState } from "react"
import { motion } from "framer-motion"

export function OptimizedImage({ 
  src, 
  alt, 
  className = "", 
  fallback = "/placeholder.svg",
  priority = false,
  ...props 
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-wedding-primary/10 to-wedding-secondary/10 animate-pulse" />
      )}
      
      <motion.img
        src={hasError ? fallback : src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true)
          setIsLoaded(true)
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={className}
        {...props}
      />
    </div>
  )
}
