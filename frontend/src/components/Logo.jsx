import React from 'react'
import { Brain } from 'lucide-react'

export default function Logo({ collapsed = false, size = 'md' }) {
  const sizes = { sm: 'text-lg', md: 'text-xl', lg: 'text-2xl' }
  const iconSizes = { sm: 18, md: 22, lg: 28 }

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex-shrink-0">
        <div className={`${collapsed ? 'w-8 h-8' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8'} 
          rounded-xl bg-gradient-to-br from-brand-500 to-accent-purple 
          flex items-center justify-center shadow-neon-purple`}>
          <Brain size={iconSizes[size] - 4} className="text-white" />
        </div>
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-neon-cyan rounded-full animate-pulse-slow" />
      </div>
      {!collapsed && (
        <div>
          <span className={`font-cyber font-bold ${sizes[size]} gradient-text-brand`}>
            Resume<span className="text-neon-cyan">IQ</span>
          </span>
          {size === 'lg' && <p className="text-[10px] text-white/30 tracking-widest uppercase">AI Platform</p>}
        </div>
      )}
    </div>
  )
}