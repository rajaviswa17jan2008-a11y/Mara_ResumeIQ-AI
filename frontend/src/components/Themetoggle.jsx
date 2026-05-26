import React from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="relative w-9 h-9 rounded-xl glass-btn flex items-center justify-center transition-all"
      aria-label="Toggle theme"
    >
      <AnimateIcon show={isDark} icon={<Moon size={16} className="text-neon-cyan" />} />
      <AnimateIcon show={!isDark} icon={<Sun size={16} className="text-yellow-400" />} />
    </button>
  )
}

function AnimateIcon({ show, icon }) {
  return (
    <motion.span
      initial={false}
      animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.5, rotate: show ? 0 : 90 }}
      transition={{ duration: 0.2 }}
      className="absolute"
    >
      {icon}
    </motion.span>
  )
}