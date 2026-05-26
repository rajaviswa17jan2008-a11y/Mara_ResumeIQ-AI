import React, { useEffect, useRef } from 'react'

export default function ParticleField({ count = 40 }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const particles = []

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div')
      p.style.cssText = `
        position: absolute;
        width: ${Math.random() * 3 + 1}px;
        height: ${Math.random() * 3 + 1}px;
        background: ${['#00FFFF', '#7B2FFF', '#FF2FFF', '#00FF88'][Math.floor(Math.random() * 4)]};
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: ${Math.random() * 0.5 + 0.1};
        animation: float-particle ${Math.random() * 15 + 10}s linear ${Math.random() * 10}s infinite;
        box-shadow: 0 0 ${Math.random() * 4 + 2}px currentColor;
        pointer-events: none;
      `
      container.appendChild(p)
      particles.push(p)
    }

    return () => particles.forEach(p => p.remove())
  }, [count])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    />
  )
}