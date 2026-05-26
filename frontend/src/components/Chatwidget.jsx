import React, { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Bot, User, Trash2, Maximize2, Minimize2, Sparkles } from 'lucide-react'
import { useChat } from '../../context/ChatContext'
import ReactMarkdown from 'react-markdown'

export default function ChatWidget() {
  const { messages, chatLoading, chatOpen, setChatOpen, sendMessage, clearChat } = useChat()
  const [input, setInput] = useState('')
  const [expanded, setExpanded] = useState(false)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (chatOpen) setTimeout(() => inputRef.current?.focus(), 300)
  }, [chatOpen])

  const handleSend = () => {
    if (!input.trim() || chatLoading) return
    sendMessage(input.trim())
    setInput('')
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const QUICK_PROMPTS = [
    'Analyze my resume',
    'Best skills for my field',
    'Interview tips for me',
    'How to improve ATS score?',
  ]

  return (
    <>
      {/* Toggle Button */}
      <AnimatePresence>
        {!chatOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setChatOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-brand-500 to-accent-purple 
              flex items-center justify-center shadow-neon-purple z-50 hover:scale-110 transition-transform"
          >
            <Sparkles size={22} className="text-white" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-neon-green rounded-full border-2 border-dark-400 animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed z-50 glass-card rounded-2xl shadow-glass-lg flex flex-col overflow-hidden
              ${expanded
                ? 'inset-4 md:inset-8'
                : 'bottom-6 right-6 w-[380px] h-[560px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-4rem)]'
              }`}
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-white/[0.06] flex-shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-accent-purple flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Career AI Assistant</p>
                <p className="text-[10px] text-neon-green flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-neon-green rounded-full inline-block" />
                  Online · GPT-4 Powered
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={clearChat} className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/70" title="Clear">
                  <Trash2 size={13} />
                </button>
                <button onClick={() => setExpanded(e => !e)} className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/70">
                  {expanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                </button>
                <button onClick={() => setChatOpen(false)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400">
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500/20 to-accent-purple/20 
                    border border-brand-500/20 flex items-center justify-center">
                    <Bot size={28} className="text-brand-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white/80">Career AI Assistant</p>
                    <p className="text-xs text-white/40 mt-1">Ask me anything about your career, resume, skills, or jobs</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 w-full mt-2">
                    {QUICK_PROMPTS.map(prompt => (
                      <button
                        key={prompt}
                        onClick={() => sendMessage(prompt)}
                        className="text-left text-xs p-2.5 rounded-xl glass-btn hover:border-brand-500/30 hover:text-brand-400 transition-all"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs
                    ${msg.role === 'user'
                      ? 'bg-gradient-to-br from-brand-500 to-accent-purple'
                      : 'bg-gradient-to-br from-accent-cyan/20 to-brand-500/20 border border-accent-cyan/20'
                    }`}>
                    {msg.role === 'user' ? <User size={12} /> : <Bot size={12} className="text-accent-cyan" />}
                  </div>
                  <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm
                    ${msg.role === 'user'
                      ? 'bg-brand-600/30 border border-brand-500/20 text-white/90'
                      : 'glass-card text-white/80'
                    }`}>
                    {msg.loading ? (
                      <span className="flex gap-1 py-1">
                        {[0,1,2].map(i => (
                          <motion.span key={i} animate={{ opacity: [0.2,1,0.2] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                            className="w-1.5 h-1.5 bg-white/50 rounded-full inline-block" />
                        ))}
                      </span>
                    ) : (
                      <ReactMarkdown
                        components={{
                          p: ({node, ...props}) => <p className="mb-1 last:mb-0" {...props} />,
                          code: ({node, ...props}) => <code className="bg-white/10 px-1 rounded text-neon-cyan text-xs" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-0.5 mt-1" {...props} />,
                          li: ({node, ...props}) => <li className="text-white/70" {...props} />,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/[0.06] flex-shrink-0">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask about your career, resume, skills..."
                  rows={1}
                  className="flex-1 glass-input rounded-xl px-3 py-2.5 text-sm resize-none 
                    max-h-28 min-h-[40px] leading-5 scrollbar-thin"
                  style={{ height: Math.min(input.split('\n').length * 20 + 20, 112) }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || chatLoading}
                  className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-purple 
                    flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed
                    hover:shadow-neon-purple transition-all hover:scale-105 active:scale-95"
                >
                  <Send size={15} className="text-white" />
                </button>
              </div>
              <p className="text-[10px] text-white/20 text-center mt-2">Press Enter to send · Shift+Enter for new line</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}