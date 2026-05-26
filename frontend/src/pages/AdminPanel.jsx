import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, FileText, TrendingUp, Activity, Shield, Trash2, Ban, Search, RefreshCw, Download, Eye } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import DashboardLayout from "../layouts/DashboardLayout";
import { authAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

const mockUsers = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", plan: "pro", status: "active", joined: "2025-01-15", resumes: 4, score: 85 },
  { id: 2, name: "Bob Smith", email: "bob@example.com", plan: "free", status: "active", joined: "2025-02-20", resumes: 1, score: 62 },
  { id: 3, name: "Carol Davis", email: "carol@example.com", plan: "enterprise", status: "active", joined: "2025-01-05", resumes: 8, score: 91 },
  { id: 4, name: "Dan Wilson", email: "dan@example.com", plan: "pro", status: "banned", joined: "2025-03-10", resumes: 2, score: 70 },
  { id: 5, name: "Eve Martinez", email: "eve@example.com", plan: "free", status: "inactive", joined: "2025-04-01", resumes: 0, score: 0 },
];

const signupData = [
  { month: "Jan", users: 120 }, { month: "Feb", users: 185 }, { month: "Mar", users: 220 },
  { month: "Apr", users: 310 }, { month: "May", users: 280 }, { month: "Jun", users: 420 },
];

const planDist = [
  { plan: "Free", count: 3420 }, { plan: "Pro", count: 1280 }, { plan: "Enterprise", count: 340 },
];

export default function AdminPanel() {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  const stats = [
    { label: "Total Users", value: "5,040", change: "+12%", icon: Users, color: "indigo" },
    { label: "Resumes Analyzed", value: "28,441", change: "+8%", icon: FileText, color: "cyan" },
    { label: "Avg ATS Score", value: "74.2", change: "+3.1", icon: TrendingUp, color: "violet" },
    { label: "Active Today", value: "342", change: "+21%", icon: Activity, color: "pink" },
  ];

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const banUser = (id) => setUsers(us => us.map(u => u.id === id ? { ...u, status: u.status === "banned" ? "active" : "banned" } : u));
  const deleteUser = (id) => setUsers(us => us.filter(u => u.id !== id));

  const statusBadge = { active: "bg-emerald-400/10 text-emerald-400", banned: "bg-red-400/10 text-red-400", inactive: "bg-white/10 text-white/40" };
  const planBadge = { free: "bg-white/5 text-white/50", pro: "bg-indigo-400/10 text-indigo-400", enterprise: "bg-violet-400/10 text-violet-400" };

  return (
    <div className="bg-black min-h-screen text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
              <p className="text-white/50 text-sm">System overview and user management</p>
            </div>
          </div>
          <button className="flex items-center gap-2 text-sm text-white/50 hover:text-white border border-white/10 px-4 py-2 rounded-xl transition-all">
            <Download size={14} />Export Data
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/[0.03] border border-white/10 rounded-xl p-1 w-fit">
          {["overview", "users", "analytics"].map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${activeTab === t ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"}`}>
              {t}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-3">
  <s.icon size={18} className="text-indigo-400" />
</div>
                  <p className="text-white font-bold text-2xl">{s.value}</p>
                  <p className="text-white/40 text-xs">{s.label}</p>
                  <p className="text-emerald-400 text-xs mt-0.5">{s.change} this month</p>
                </motion.div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-5">User Signups</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={signupData}>
                    <defs>
                      <linearGradient id="uGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#ffffff15" tick={{ fill: "#ffffff40", fontSize: 11 }} />
                    <YAxis stroke="#ffffff15" tick={{ fill: "#ffffff40", fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: "#0f0f1a", border: "1px solid #ffffff15", borderRadius: 12 }} />
                    <Area type="monotone" dataKey="users" stroke="#6366f1" fill="url(#uGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-5">Plan Distribution</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={planDist}>
                    <XAxis dataKey="plan" stroke="#ffffff15" tick={{ fill: "#ffffff40", fontSize: 11 }} />
                    <YAxis stroke="#ffffff15" tick={{ fill: "#ffffff40", fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: "#0f0f1a", border: "1px solid #ffffff15", borderRadius: 12 }} />
                    <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 text-sm" />
              </div>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    {["User", "Plan", "Status", "Joined", "Resumes", "ATS", "Actions"].map(h => (
                      <th key={h} className="text-left text-white/40 text-xs font-medium px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u, i) => (
                    <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                      className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/30 to-cyan-500/30 flex items-center justify-center text-white/70 text-sm font-semibold">
                            {u.name[0]}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{u.name}</p>
                            <p className="text-white/40 text-xs">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-lg capitalize ${planBadge[u.plan]}`}>{u.plan}</span></td>
                      <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-lg capitalize ${statusBadge[u.status]}`}>{u.status}</span></td>
                      <td className="px-4 py-3 text-white/50 text-xs">{u.joined}</td>
                      <td className="px-4 py-3 text-white/70 text-sm">{u.resumes}</td>
                      <td className="px-4 py-3 text-white/70 text-sm">{u.score || "—"}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"><Eye size={13} /></button>
                          <button onClick={() => banUser(u.id)} className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${u.status === "banned" ? "bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20" : "bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20"}`}><Ban size={13} /></button>
                          <button onClick={() => deleteUser(u.id)} className="w-7 h-7 rounded-lg bg-red-400/10 flex items-center justify-center text-red-400 hover:bg-red-400/20 transition-all"><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === "analytics" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 h-60 flex items-center justify-center">
                <p className="text-white/20 text-sm">Analytics Widget {i}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
   </div>
  );
}