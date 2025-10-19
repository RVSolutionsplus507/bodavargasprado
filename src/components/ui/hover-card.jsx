
import React, { createContext, useState, useContext } from "react"
import { cn } from "@/lib/utils"

const HoverContext = createContext({
  hoveredIndex: null,
  setHoveredIndex: () => {},
})

export const HoverCards = ({ children, className }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  
  return (
    <HoverContext.Provider value={{ hoveredIndex, setHoveredIndex }}>
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
        {children}
      </div>
    </HoverContext.Provider>
  )
}

export const HoverCard = ({ 
  children, 
  className, 
  index, 
  backgroundImage,
  backgroundClassName
}) => {
  const { hoveredIndex, setHoveredIndex } = useContext(HoverContext)
  const isHovered = hoveredIndex === index

  return (
    <div
      className={cn(
        "relative h-full rounded-lg transition-all duration-300 transform overflow-hidden",
        isHovered ? "scale-[1.02] z-10" : "scale-100 z-0",
        className
      )}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {/* Background image that shows on hover */}
      {backgroundImage && (
        <div
          className={cn(
            "absolute inset-0 w-full h-full transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0",
            backgroundClassName
          )}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
        </div>
      )}
      
      {/* Card content that becomes semi-transparent on hover */}
      <div className={cn(
        "relative z-10 h-full transition-opacity duration-300",
        isHovered ? "opacity-90" : "opacity-100"
      )}>
        {children}
      </div>
    </div>
  )
}
