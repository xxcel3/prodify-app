import React, { useEffect, useRef } from "react"
import "../styles/RainOverlay.css"

const RainOverlay = () => {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Clear previous drops if any
    container.innerHTML = ""

    const numDrops = 100
    for (let i = 0; i < numDrops; i++) {
      const drop = document.createElement("div")
      drop.className = "drop"

      // Randomize position and animation
      drop.style.left = `${Math.random() * 100}%`
      drop.style.animationDuration = `${1 + Math.random() * 1.5}s`
      drop.style.animationDelay = `${Math.random() * 2}s`

      container.appendChild(drop)
    }
  }, [])

  return <div ref={containerRef} className="rain-overlay" />
}

export default RainOverlay