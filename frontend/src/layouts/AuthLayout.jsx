import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Logo from '../components/ui/Logo'
import ParticleField from '../components/effects/ParticleField'
import FloatingOrbs from '../components/effects/FloatingOrbs'

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-dark-400 flex relative overflow-hidden">
      {/* Background Effects */}
      <ParticleField />
      <FloatingOrbs />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />

      {/* Left Panel - Branding */}
      <div className="hidden lg:flex flex-col w-1/2 relative p-12 overflow-hidden">
        {/* Gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/40 via-dark-400 to-accent-purple/10" />
        <div className="absolute inset-0 bg-mesh" />

        {/* Animated border right */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-neon-cyan/30 to-transparent" />

        <div className="relative z-10">
          <Link to="/" className="inline-block">
            <Logo size="lg" />
          </Link>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-hero font-display font-black mb-6">
              <span className="gradient-text">AI-Powered</span>
              <br />
              Career Intelligence
            </h1>
            <p className="text-lg text-white/50 leading-relaxed max-w-md">
              Analyze your resume with cutting-edge AI, get personalized skill recommendations, 
              and land your dream job with smart matching.
            </p>
          </motion.div>

          {/* Feature bullets */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 space-y-4"
          >
            {[
              { icon: '🤖', label: 'AI Resume Analysis', desc: 'Deep NLP-powered insights' },
              { icon: '🎯', label: 'ATS Score Optimizer', desc: 'Beat applicant tracking systems' },
              { icon: '📈', label: 'Skill Gap Analysis', desc: 'Know exactly what to learn next' },
              { icon: '💼', label: 'Smart Job Matching', desc: 'Personalized opportunities' },
            ].map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-white/80">{f.label}</p>
                  <p className="text-xs text-white/40">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="relative z-10 flex gap-8"
        >
          {[['50K+', 'Resumes Analyzed'], ['92%', 'Success Rate'], ['10K+', 'Jobs Matched']].map(([num, label]) => (
            <div key={label}>
              <p className="text-2xl font-bold font-display neon-text-cyan">{num}</p>
              <p className="text-xs text-white/40">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Link to="/"><Logo size="md" /></Link>
          </div>
          {children}
        </motion.div>
      </div>
    </div>
  )
}