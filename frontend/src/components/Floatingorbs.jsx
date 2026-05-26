import React from 'react'
import { motion } from 'framer-motion'

const ORBS = [
  { size: 500, color: 'rgba(123,47,255,0.12)', x: '-10%', y: '-20%', delay: 0 },
  { size: 400, color: 'rgba(0,255,255,0.08)',  x: '60%',  y: '50%',  delay: 2 },
  { size: 300, color: 'rgba(255,47,255,0.07)', x: '80%',  y: '-10%', delay: 4 },
  { size: 350, color: 'rgba(0,255,136,0.06)',  x: '20%',  y: '70%',  delay: 1 },
]

export default function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          style={{
            width:  orb.size,
            height: orb.size,
            left:   orb.x,
            top:    orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            borderRadius: '50%',
            position: 'absolute',
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 30, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 15 + i * 3,
            repeat: Infinity,
            delay: orb.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}