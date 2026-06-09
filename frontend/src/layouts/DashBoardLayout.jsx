import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Upload, Cpu, Lightbulb, Briefcase, FileEdit,
  BarChart2, User, Settings, MessageSquare, Mic, Shield,
  ChevronLeft, ChevronRight, Menu, X, LogOut, Bell
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },

  { label: "Upload Resume", icon: Upload, to: "/upload" },

  { label: "AI Analysis", icon: Cpu, to: "/analysis" },

  { label: "Skills", icon: Lightbulb, to: "/skills" },

  { label: "Job Recommendations", icon: Briefcase, to: "/jobs" },

  { label: "Resume Builder", icon: FileEdit, to: "/builder" },

  // NEW
  { label: "Resume Improvements", icon: BarChart2, to: "/resume-improvement" },
    // NEW
  { label: "Portfolio Templates", icon: LayoutDashboard, to: "/portfolio-templates" },
  // NEW
  { label: "Portfolio AI", icon: Briefcase, to: "/portfolio-generator" },

  // NEW
  { label: "Portfolio Preview", icon: Cpu, to: "/portfolio-preview" },

  

  { label: "Interview AI", icon: Mic, to: "/interview" },

  { label: "AI Chatbot", icon: MessageSquare, to: "/chatbot" },

  { label: "Profile", icon: User, to: "/profile" },
];

export default function DashboardLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const avatar =
  user?.avatar?.url;
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (to) => location.pathname === to;

  const SidebarContent = () => {
  return (
    
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/[0.06] ${collapsed ? "justify-center" : ""}`}>
        <div className="
flex
items-center
justify-center
flex-shrink-0
">
          <img
  src="/logo3.png"
  alt="Mara ResumeIQ"
  className="
  w-10
  h-10
  object-contain
  "
/>
        </div>
        {!collapsed && <span className="
text-transparent
bg-clip-text
bg-gradient-to-r
from-cyan-300
via-blue-400
to-purple-400
font-black
text-xl
tracking-tight
">
Mara ResumeIQ
</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, icon: Icon, to }) => (
          <Link key={to} to={to} onClick={() => setMobileOpen(false)}
          className={`

relative
overflow-hidden

flex
items-center
gap-3

px-4
py-3

rounded-2xl

text-sm
font-medium

transition-all
duration-300

group

${
isActive(to)

? "bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 text-cyan-300 border border-cyan-400/20 shadow-[0_0_30px_rgba(6,182,212,0.15)]"

: "text-white/60 hover:text-white hover:bg-white/[0.04] hover:border hover:border-cyan-400/10"
}

${collapsed ? "justify-center" : ""}
`} >
            <Icon size={18} className={`flex-shrink-0 ${isActive(to) ? "text-indigo-400" : "group-hover:text-white/80"}`} />
            {!collapsed && <span>{label}</span>}
            {!collapsed && isActive(to) && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />}
          </Link>
        ))}
        {user?.role === "admin" && (
          <Link to="/admin" onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mt-1 ${isActive("/admin") ? "bg-red-500/15 text-red-400 border border-red-500/20":"text-white/50 hover:text-white hover:bg-cyan-500/10 hover:border hover:border-cyan-400/20 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]" } ${collapsed ? "justify-center" : ""}`}>
            <Shield size={18} className="flex-shrink-0" />
            {!collapsed && "Admin Panel"}
          </Link>
        )}
      </nav>

     {/* User */}
<div className="p-3 border-t border-white/[0.06]">

  <div
    onClick={() => navigate("/profile")}
    className={`
    relative
    z-50

    flex
    items-center
    gap-3

    px-2
    py-2

    rounded-xl

    hover:bg-white/5

    transition-colors
    cursor-pointer

    ${collapsed ? "justify-center" : ""}
    `}
  >

    <div
  className="
  w-10
  h-10

  rounded-2xl
  overflow-hidden

  bg-gradient-to-br
  from-cyan-400
  to-purple-600

  flex
  items-center
  justify-center

  text-white
  font-bold
  text-sm

  border
  border-cyan-400/20

  shadow-[0_0_25px_rgba(34,211,238,0.15)]

  flex-shrink-0
  "
>

  {avatar ? (

    <img
      src={avatar}
      alt="profile"
      className="
      w-full
      h-full
      object-cover
      "
    />

  ) : (

    user?.name?.[0] || "U"

  )}

</div>
  
  
  
    {!collapsed && (
      <div className="flex-1 min-w-0">
        <p className="text-white text-xs font-semibold truncate">
          {user?.name || "User"}
        </p>

        <p className="text-white/40 text-xs truncate">
          {user?.email}
        </p>
      </div>
    )}
 
    {!collapsed && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          logout();
          navigate("/login");
        }}
        className="
        text-white/30
        hover:text-red-400
        transition-colors
        "
      >
        <LogOut size={14} />
      </button>
    )}

  </div>

</div>

</div>

  );
};

return (
    <div className="
min-h-screen
flex
relative
overflow-hidden

bg-[#030712]

before:absolute
before:inset-0
before:bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_30%)]

after:absolute
after:inset-0
after:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]
after:bg-[size:40px_40px]

">
      {/* Sidebar Desktop */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="
hidden
lg:flex
flex-col

fixed
left-0
top-0
bottom-0
z-30
overflow-hidden

bg-white/[0.03]
backdrop-blur-2xl

border-r
border-cyan-400/10

shadow-[0_0_60px_rgba(6,182,212,0.08)]

before:absolute
before:inset-0
before:bg-gradient-to-b
before:from-cyan-500/5
before:via-transparent
before:to-purple-500/5
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

        <SidebarContent />
        <button onClick={() => setCollapsed(!collapsed)}
          className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 transition-all z-10">
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </motion.aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)} className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", damping: 30 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-[#0a0a1a] border-r border-white/10 z-50">
              <div className="absolute top-4 right-4">
                <button onClick={() => setMobileOpen(false)} className="text-white/40 hover:text-white"><X size={20} /></button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-200 ${collapsed ? "lg:ml-[72px]" : "lg:ml-60"}`}>
        {/* Top bar mobile */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-[#030712] sticky top-0 z-20">
          <button onClick={() => setMobileOpen(true)} className="text-white/50 hover:text-white">
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <div className="
flex
items-center
justify-center
">
              <img
  src="/logo2.png"
  alt="Mara ResumeIQ"
  className="
  w-8
  h-8
  object-contain
  "
/>
            </div>
            <span className="
font-bold
bg-gradient-to-r
from-cyan-300
to-purple-400
bg-clip-text
text-transparent
">
Mara ResumeIQ
</span>
          </div>
          <button className="relative text-white/50 hover:text-white">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-indigo-400 rounded-full" />
          </button>
        </div>

        <main className="
flex-1
p-4
lg:p-8
overflow-auto
relative
z-10
">
          <motion.div
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4 }}
>
  {children}
</motion.div>
        </main>
      </div>
    </div>
  );
}
