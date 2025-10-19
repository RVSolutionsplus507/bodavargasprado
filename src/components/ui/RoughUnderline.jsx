import { useState, useEffect, memo } from "react"
import { motion } from "framer-motion"

export const RoughUnderline = memo(function RoughUnderline({ 
  children, 
  show = true, 
  strokeWidth = 3, 
  animationDuration = 1500, 
  color = "currentColor",
  iterations = 2,
  className = ""
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [show])

  return (
    <span className={`relative inline-block ${className}`}>
      {children}
      {isVisible && (
        <motion.svg
          className="absolute left-0 bottom-0 w-full h-2 pointer-events-none"
          viewBox="0 0 100 10"
          preserveAspectRatio="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: 0.8,
            transition: { 
              duration: animationDuration / 1000,
              ease: "easeInOut",
              repeat: iterations - 1,
              repeatType: "loop"
            }
          }}
        >
          <motion.path
            d="M2,7 Q25,3 50,7 T98,7"
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              filter: "url(#roughen)"
            }}
          />
          <defs>
            <filter id="roughen">
              <feTurbulence 
                baseFrequency="0.04" 
                numOctaves="3" 
                result="noise"
              />
              <feDisplacementMap 
                in="SourceGraphic" 
                in2="noise" 
                scale="1"
              />
            </filter>
          </defs>
        </motion.svg>
      )}
    </span>
  )
})
