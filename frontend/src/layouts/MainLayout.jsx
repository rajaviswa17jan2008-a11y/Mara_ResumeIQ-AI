import React, { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Upload, Brain, Lightbulb, Briefcase,
  FileText, BarChart3, User, Settings, MessageSquare,
  Mic, Shield, ChevronLeft, ChevronRight, Bell, Search,
  LogOut, Menu, X, Sparkles
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useChat } from '../context/ChatContext'
import ThemeToggle from '../components/ui/ThemeToggle'
import NotificationBell from '../components/ui/NotificationBell'
import ChatWidget from '../components/chat/ChatWidget'
import Logo from '../components/ui/Logo'

const NAV_ITEMS = [
  { path: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard',     group: 'main' },
  { path: '/upload',     icon: Upload,          label: 'Upload Resume',  group: 'main' },
  { path: '/analysis',   icon: Brain,           label: 'AI Analysis',   group: 'ai' },
  { path: '/skills',     icon: Lightbulb,       label: 'Skills AI',     group: 'ai' },
  { path: '/jobs',       icon: Briefcase,       label: 'Job Matches',   group: 'ai' },
  { path: '/builder',    icon: FileText,        label: 'Resume Builder', group: 'tools' },
  { path: '/interview',  icon: Mic,             label: 'Interview AI',  group: 'tools' },
  { path: '/chat',       icon: MessageSquare,   label: 'Career Chat',   group: 'tools' },
  { path: '/reports',    icon: BarChart3,       label: 'Reports',       group: 'account' },
  { path: '/profile',    icon: User,            label: 'Profile',       group: 'account' },
  { path: '/settings',   icon: Settings,        label: 'Settings',      group: 'account' },
]

const ADMIN_ITEMS = [
  { path: '/admin', icon: Shield, label: 'Admin Panel', group: 'admin' },
]

const GROUP_LABELS = { main: 'MAIN', ai: 'AI TOOLS', tools: 'TOOLS', account: 'ACCOUNT', admin: 'ADMIN' }

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout, isAdmin } = useAuth()
  const { openChat } = useChat()
  const location = useLocation()

  const allItems = isAdmin ? [...NAV_ITEMS, ...ADMIN_ITEMS] : NAV_ITEMS
  const groups = [...new Set(allItems.map(i => i.group))]

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center ${collapsed ? 'justify-center px-3' : 'px-5'} py-5 border-b border-white/[0.06]`}>
        <Logo collapsed={collapsed} />
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="ml-auto p-1.5 rounded-lg hover:bg-white/5 transition-colors text-white/40 hover:text-white/80"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {groups.map((group, gi) => {
          const items = allItems.filter(i => i.group === group)
          return (
            <div key={group} className={gi > 0 ? 'mt-4' : ''}>
              {!collapsed && (
                <p className="text-[10px] font-bold tracking-widest text-white/20 px-3 py-2 font-cyber">
                  {GROUP_LABELS[group]}
                </p>
              )}
              {items.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative
                    ${isActive
                      ? 'bg-brand-600/20 text-brand-400 border border-brand-500/20'
                      : 'text-white/50 hover:text-white/90 hover:bg-white/[0.04]'
                    }
                    ${collapsed ? 'justify-center' : ''}
                    `
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4/5 bg-brand-400 rounded-r-full" />
                      )}
                      <item.icon size={18} className={`flex-shrink-0 ${isActive ? 'text-brand-400' : ''}`} />
                      {!collapsed && <span>{item.label}</span>}
                      {collapsed && (
                        <span className="absolute left-full ml-2 px-2 py-1 bg-dark-100 text-white text-xs rounded-lg
                          whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50
                          border border-white/10 shadow-xl">
                          {item.label}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          )
        })}
      </nav>

      {/* User Section */}
      <div className={`border-t border-white/[0.06] p-3 ${collapsed ? 'flex justify-center' : ''}`}>
        {!collapsed ? (
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-purple flex items-center justify-center text-sm font-bold flex-shrink-0">
              {user?.firstName?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white/90 truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-white/40 truncate">{user?.email}</p>
            </div>
            <button onClick={logout} className="p-1 hover:text-red-400 text-white/30 transition-colors">
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button
            onClick={logout}
            className="p-2 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-dark-400 overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 68 : 240 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="hidden md:flex flex-col glass-panel flex-shrink-0 relative z-20"
      >
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="absolute -right-3 top-6 w-6 h-6 bg-dark-100 border border-white/10 rounded-full flex items-center justify-center text-white/50 hover:text-white z-30 shadow-lg"
          >
            <ChevronRight size={12} />
          </button>
        )}
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-64 glass-panel z-50 md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center gap-4 px-4 md:px-6 py-3 glass-nav border-b border-white/[0.06] flex-shrink-0">
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/5 text-white/60"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl glass-input text-sm">
            <Search size={15} className="text-white/30 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search resumes, skills, jobs..."
              className="bg-transparent border-none outline-none text-white/70 placeholder:text-white/30 w-full text-sm"
            />
            <kbd className="text-[10px] text-white/20 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">⌘K</kbd>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <NotificationBell />
            <button
              onClick={openChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600/20 hover:bg-brand-600/30 text-brand-400 border border-brand-500/20 text-xs font-medium transition-all hover:border-brand-400/40"
            >
              <Sparkles size={13} />
              <span className="hidden sm:inline">AI Chat</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-mesh bg-grid">
          <Outlet />
        </main>
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  )
}