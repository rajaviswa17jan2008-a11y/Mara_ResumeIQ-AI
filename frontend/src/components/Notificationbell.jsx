import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, CheckCheck } from 'lucide-react'

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'success', title: 'Analysis Complete', message: 'Your resume scored 87/100 ATS score!', time: '2m ago', read: false },
  { id: 2, type: 'info',    title: 'New Job Match',    message: '5 new jobs match your profile today.', time: '1h ago', read: false },
  { id: 3, type: 'tip',     title: 'Skill Tip',        message: 'Add TypeScript to boost your score by 12 points.', time: '3h ago', read: true },
]

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifs, setNotifs] = useState(MOCK_NOTIFICATIONS)

  const unread = notifs.filter(n => !n.read).length

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })))
  const dismiss = (id) => setNotifs(n => n.filter(x => x.id !== id))

  const typeColors = {
    success: 'text-neon-green bg-neon-green/10 border-neon-green/20',
    info:    'text-neon-cyan bg-neon-cyan/10 border-neon-cyan/20',
    tip:     'text-neon-purple bg-neon-purple/10 border-neon-purple/20',
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="relative w-9 h-9 rounded-xl glass-btn flex items-center justify-center"
      >
        <Bell size={16} className="text-white/60" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-neon-cyan text-dark-400 text-[9px] font-bold rounded-full flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-12 w-80 glass-card rounded-2xl shadow-glass-lg z-40 overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
                <h3 className="text-sm font-semibold">Notifications</h3>
                {unread > 0 && (
                  <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-neon-cyan hover:text-white transition-colors">
                    <CheckCheck size={13} /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto">
                {notifs.length === 0 ? (
                  <p className="text-center text-white/40 text-sm py-8">No notifications</p>
                ) : (
                  notifs.map(n => (
                    <div key={n.id} className={`p-4 border-b border-white/[0.04] flex gap-3 ${!n.read ? 'bg-white/[0.02]' : ''}`}>
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? 'bg-neon-cyan' : 'bg-white/20'}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white/90">{n.title}</p>
                        <p className="text-xs text-white/50 mt-0.5">{n.message}</p>
                        <p className="text-[10px] text-white/30 mt-1">{n.time}</p>
                      </div>
                      <button onClick={() => dismiss(n.id)} className="text-white/20 hover:text-white/60 flex-shrink-0">
                        <X size={13} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}