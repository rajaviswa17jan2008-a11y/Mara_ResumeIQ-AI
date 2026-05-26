import React from 'react'
import { motion } from 'framer-motion'
import { Brain } from 'lucide-react'

export default function LoadingScreen({ message = 'Initializing AI Systems...' }) {
  return (
    <div className="fixed inset-0 bg-dark-400 flex flex-col items-center justify-center z-[999]">
      <div className="absolute inset-0 bg-mesh bg-grid opacity-50" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        {/* Animated Logo */}
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 rounded-full border-2 border-transparent 
              border-t-neon-cyan border-r-neon-purple absolute inset-0"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 rounded-full border-2 border-transparent 
              border-t-neon-pink absolute inset-2"
          />
          <div className="w-20 h-20 flex items-center justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-purple flex items-center justify-center">
              <Brain size={20} className="text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className="font-cyber text-xl font-bold gradient-text">ResumeIQ AI</h2>
          <p className="text-white/40 text-sm mt-1">{message}</p>
        </div>

        {/* Progress bar */}
        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="h-full w-1/2 bg-gradient-to-r from-transparent via-neon-cyan to-transparent"
          />
        </div>

        {/* Dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map(i => (
            <motion.span
              key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              className="w-1.5 h-1.5 bg-neon-cyan rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}