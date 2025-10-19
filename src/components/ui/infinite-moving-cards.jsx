import React, { useRef, useEffect, useState } from "react"

export function InfiniteMovingCards({ children, speed = "slow", visibleItems = 3 }) {
  const containerRef = useRef(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [itemWidth, setItemWidth] = useState(0)

  const getSpeedValue = () => {
    switch (speed) {
      case "slow":
        return 0.2
      case "medium":
        return 1
      case "fast":
        return 2
      default:
        return 0.5
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Calculate container and item widths
    const updateWidths = () => {
      setContainerWidth(container.offsetWidth)
      const totalItems = React.Children.count(children)
      const calculatedItemWidth = container.offsetWidth / visibleItems
      setItemWidth(calculatedItemWidth)
    }

    updateWidths()
    window.addEventListener("resize", updateWidths)

    // Set up scrolling
    let position = 0
    const pixelsPerFrame = getSpeedValue()
    let animationFrameId

    const scroll = () => {
      if (!container) return

      position += pixelsPerFrame

      // Reset when we've scrolled one item width
      if (position >= itemWidth) {
        // Move first item to the end
        const firstItem = container.firstChild
        container.appendChild(firstItem)
        position = 0
        container.style.transform = `translateX(0px)`
      } else {
        container.style.transform = `translateX(-${position}px)`
      }

      animationFrameId = requestAnimationFrame(scroll)
    }

    animationFrameId = requestAnimationFrame(scroll)

    const handleMouseEnter = () => {
      cancelAnimationFrame(animationFrameId)
    }

    const handleMouseLeave = () => {
      animationFrameId = requestAnimationFrame(scroll)
    }

    container.addEventListener("mouseenter", handleMouseEnter)
    container.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", updateWidths)
      if (container) {
        container.removeEventListener("mouseenter", handleMouseEnter)
        container.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [children, speed, visibleItems])

  return (
    <div className="relative overflow-hidden">
      <div className="mask-gradient">
        <div ref={containerRef} className="flex transition-transform duration-0 py-4">
          {React.Children.map(children, (child, index) => (
            <div
              key={index}
              className="flex-shrink-0 px-2"
              style={{
                width: `calc(${100 / visibleItems}% - ${(4 * (visibleItems - 1)) / visibleItems}px)`,
                minWidth: "280px",
              }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
    .mask-gradient {
      mask-image: linear-gradient(to right, transparent, white 5%, white 95%, transparent);
      -webkit-mask-image: linear-gradient(to right, transparent, white 5%, white 95%, transparent);
    }
  `,
        }}
      />
    </div>
  )
}

