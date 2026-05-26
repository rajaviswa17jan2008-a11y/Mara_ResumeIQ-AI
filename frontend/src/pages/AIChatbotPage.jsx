import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, RefreshCw, Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import { aiAPI } from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
  import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

const suggestedPrompts = [
  "How can I improve my ATS score?",
  "What skills should I learn for a senior developer role?",
  "How do I negotiate salary for a $200k role?",
  "Review my career path to become a CTO",
  "How do I write a cold email to a recruiter?",
];

const TypingIndicator = () => (
  <div className="flex gap-1.5 items-center px-4 py-3 bg-white/[0.04] border border-white/10 rounded-2xl rounded-tl-sm w-fit">
    {[0, 0.15, 0.3].map(d => (
      <motion.div key={d} className="w-2 h-2 rounded-full bg-cyan-400
shadow-[0_0_15px_rgba(34,211,238,0.8)]"
        animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: d }} />
    ))}
  </div>
);

export default function AIChatbotPage() {
  const [messages, setMessages] = useState([
    { id: 1, role: "assistant", content: "Hi! I'm ResumeIQ's AI Career Coach. Ask me anything about your resume, career path, job search strategy, salary negotiation, or skill development. I'm here to help you reach your career goals! 🚀", timestamp: new Date() }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const sendMessage = async (text = input) => {
    const content = text.trim();
    if (!content || loading) return;
    setInput("");
    const userMsg = { id: Date.now(), role: "user", content, timestamp: new Date() };
    setMessages(m => [...m, userMsg]);
    setLoading(true);
    try {
    const res = await aiAPI.chatbotMessage(content);

setMessages(m => [
  ...m,
  {
    id: Date.now() + 1,
    role: "assistant",
    content:
      res.data.reply ||
      "AI response received 🚀",
    timestamp: new Date()
  }
]);
    } catch (err) {

      console.log(err);

      setMessages(m => [
        ...m,
        {
          id: Date.now() + 1,
          role: "assistant",
          content:
            "AI server error. Please try again.",
          timestamp: new Date()
        }
      ]);

    } finally {

      setLoading(false);
    }
  };
  const copyMessage = (id, text) => {
  navigator.clipboard.writeText(text);
  setCopiedId(id);
  setTimeout(() => setCopiedId(null), 2000);
};

const clearChat = () => {
  setMessages([
    {
      id: Date.now(),
      role: "assistant",
      content: "Chat cleared! How can I help you today?",
      timestamp: new Date()
    }
  ]);
};
  const formatTime = (d) => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <>
    <button
  onClick={() => navigate("/dashboard")}
  className="
  flex
  items-center
  gap-2

  px-4
  py-2

  rounded-xl

  bg-white/5
  border
  border-cyan-500/20

  text-white/70

  hover:text-cyan-400
  hover:border-cyan-400/40
  hover:bg-cyan-500/10

  transition-all
  duration-300
  "
>
  <ArrowLeft size={18} />
  Exit
</button>
   <div
  className="
  relative
  overflow-hidden
  min-h-screen
  text-white
  p-6

  bg-[#030712]

  before:absolute
  before:inset-0
  before:bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.14),transparent_30%)]

  "
>
  {/* AI Grid Background */}
<div className="
absolute
inset-0
pointer-events-none
overflow-hidden
">

  {/* Grid */}
  <div className="
  absolute
  inset-0
  bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]
  bg-[size:40px_40px]
  " />

  {/* Cyan Glow */}
  <div className="
  absolute
  top-[-200px]
  left-[-150px]
  w-[500px]
  h-[500px]
  bg-cyan-500/20
  rounded-full
  blur-[140px]
  animate-pulse
  " />

  {/* Purple Glow */}
  <div className="
  absolute
  bottom-[-250px]
  right-[-150px]
  w-[500px]
  h-[500px]
  bg-purple-500/20
  rounded-full
  blur-[150px]
  animate-pulse
  " />

</div>
    {/* CYAN GLOW */}

    <div
      className="
      absolute
      top-0
      left-0
      w-96
      h-96
      bg-cyan-500/10
      blur-[140px]
      rounded-full
    "
    />

    {/* INDIGO GLOW */}

    <div
      className="
      absolute
      bottom-0
      right-0
      w-96
      h-96
      bg-indigo-500/10
      blur-[140px]
      rounded-full
    "
    />
      <div
  className="
relative
z-10

max-w-5xl
mx-auto

flex
flex-col

h-[calc(100vh-4rem)]

bg-white/[0.04]
backdrop-blur-3xl

border
border-cyan-500/10

rounded-[32px]

shadow-[0_0_60px_rgba(34,211,238,0.08)]

overflow-hidden
">
  <div className="
absolute
top-0
left-0
w-full
h-[2px]

bg-gradient-to-r
from-cyan-400
via-blue-500
to-purple-500

opacity-80
" />
        {/* Header */}
        <div
  className="
flex
items-center
justify-between

px-7
py-6

border-b
border-white/10

bg-white/[0.03]
backdrop-blur-2xl
"
>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <h1 className="
text-2xl
font-black

bg-gradient-to-r
from-cyan-400
via-blue-400
to-purple-500

bg-clip-text
text-transparent

drop-shadow-[0_0_20px_rgba(34,211,238,0.3)]
">AI Career Coach</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 text-xs">Online</span>
              </div>
            </div>
          </div>
          <button onClick={clearChat} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/60 transition-colors">
            <RefreshCw size={13} />Clear chat
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {messages.length === 1 && (
            <div className="space-y-2 mt-4">
              <p className="text-white/30 text-xs text-center mb-3">✨ Try asking these career questions</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestedPrompts.map(p => (
                  <button key={p} onClick={() => sendMessage(p)}
                    className="
group

text-xs

bg-white/[0.04]
backdrop-blur-xl

border
border-white/10

text-white/60

hover:text-white
hover:border-cyan-400/30

px-4
py-2.5

rounded-2xl

transition-all
duration-300

hover:bg-cyan-500/10
hover:shadow-[0_0_25px_rgba(34,211,238,0.12)]
" >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center ${msg.role === "assistant" ? "bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/20" : "bg-white/10 border border-white/10"}`}>
                  {msg.role === "assistant" ? <Bot size={15} className="text-indigo-400" /> : <User size={15} className="text-white/60" />}
                </div>
                <div className={`group max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
                  <div
  className={`

  px-4
  py-3
  rounded-2xl
  text-sm
  leading-8

  ${

    msg.role === "assistant"

      ?

      `

     bg-white/[0.05]
backdrop-blur-2xl

border
border-cyan-500/10

shadow-[0_0_30px_rgba(34,211,238,0.06)]

      border
      border-white/10

      shadow-lg
      shadow-black/20

      rounded-tl-sm

      text-white/85 font-medium

      `

      :

      `

      bg-gradient-to-r
from-cyan-500
via-blue-500
to-purple-600

shadow-[0_0_35px_rgba(59,130,246,0.35)]

      shadow-lg
      shadow-cyan-500/20

      rounded-tr-sm

      text-white

      `

  }

`}
>
 <div className="whitespace-pre-line">
  <ReactMarkdown
  components={{
    strong: ({ children }) => (
      <strong
        className="
        bg-gradient-to-r
        from-cyan-400
        via-blue-400
        to-purple-500
        bg-clip-text
        text-transparent
        font-bold
        drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]
        "
      >
        {children}
      </strong>
    ),

    p: ({ children }) => (
      <p className="mb-3 leading-8 text-white/85">
        {children}
      </p>
    ),

    ul: ({ children }) => (
      <ul className="space-y-2 mb-3">
        {children}
      </ul>
    ),

    li: ({ children }) => (
      <li className="ml-4 list-disc text-white/80">
        {children}
      </li>
    ),
  }}
>
  {msg.content}
</ReactMarkdown>
</div>
</div>
                    
                
                  <div className={`flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    <span className="text-white/25 text-xs">{formatTime(msg.timestamp)}</span>
                    {msg.role === "assistant" && (
                      <>
                        <button onClick={() => copyMessage(msg.id, msg.content)} className="text-white/25 hover:text-white/50 transition-colors">
                          <Copy size={11} />
                        </button>
                        <button className="text-white/25 hover:text-emerald-400 transition-colors"><ThumbsUp size={11} /></button>
                        <button className="text-white/25 hover:text-red-400 transition-colors"><ThumbsDown size={11} /></button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/20">
                <Bot size={15} className="text-indigo-400" />
              </div>
              <TypingIndicator />
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex-shrink-0">
          <div
  
             className="
relative

flex
gap-3

bg-white/[0.04]
backdrop-blur-3xl

border
border-cyan-500/10

rounded-[28px]

p-3

shadow-[0_0_40px_rgba(34,211,238,0.08)]

overflow-hidden
"
>
            <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
          
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Ask anything about your career..." rows={1}
              style={{
  height: "auto"
}}
              className="flex-1 bg-transparent text-white placeholder-white/30 focus:outline-none text-sm resize-none py-1 max-h-32" />
            <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
              className="
group

w-12
h-12

rounded-2xl

bg-gradient-to-r
from-cyan-500
via-blue-500
to-purple-600

shadow-[0_0_35px_rgba(59,130,246,0.35)]

flex
items-center
justify-center

text-white

hover:scale-105
active:scale-95

transition-all
duration-300

disabled:opacity-40

flex-shrink-0
">
              <Send size={16} />
            </button>
          </div>
          <p className="text-white/20 text-xs text-center mt-2">AI responses are for guidance only. Always verify with professionals.</p>
        </div>
      </div>
  </div>
  </>
  );
}