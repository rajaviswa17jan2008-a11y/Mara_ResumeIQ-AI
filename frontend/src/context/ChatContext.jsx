import React, { createContext, useContext, useState, useCallback, useRef } from 'react'
import { aiAPI } from '../services/aiApi'

const ChatContext = createContext(null)

export const useChat = () => {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChat must be used within ChatProvider')
  return ctx
}

export const ChatProvider = ({ children }) => {
  const [messages, setMessages]     = useState([])
  const [chatLoading, setChatLoading] = useState(false)
  const [chatOpen, setChatOpen]     = useState(false)
  const [sessionId] = useState(() => `session_${Date.now()}`)
  const abortRef = useRef(null)

  const sendMessage = useCallback(async (text, resumeContext = null) => {
    if (!text.trim()) return

    const userMsg = { id: Date.now(), role: 'user', content: text, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setChatLoading(true)

    // placeholder AI message
    const aiMsgId = Date.now() + 1
    setMessages(prev => [...prev, {
      id: aiMsgId, role: 'assistant', content: '', timestamp: new Date(), loading: true
    }])

    try {
      const { data } = await aiAPI.chat({
        message: text,
        sessionId,
        history: messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
        resumeContext,
      })

      setMessages(prev => prev.map(m =>
        m.id === aiMsgId
          ? { ...m, content: data.response, loading: false }
          : m
      ))
    } catch {
      setMessages(prev => prev.map(m =>
        m.id === aiMsgId
          ? { ...m, content: 'Sorry, I encountered an error. Please try again.', loading: false, error: true }
          : m
      ))
    } finally {
      setChatLoading(false)
    }
  }, [messages, sessionId])

  const clearChat = useCallback(() => {
    setMessages([])
  }, [])

  const openChat  = () => setChatOpen(true)
  const closeChat = () => setChatOpen(false)

  return (
    <ChatContext.Provider value={{
      messages, chatLoading, chatOpen,
      sendMessage, clearChat, openChat, closeChat, setChatOpen
    }}>
      {children}
    </ChatContext.Provider>
  )
}