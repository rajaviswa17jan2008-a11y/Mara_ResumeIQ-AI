import {
  useState,
  useEffect
} from "react";
import { useAuth } from "../context/AuthContext";
import { Bell, Moon, Sun, Shield, Key, Trash2, Globe, Eye, EyeOff, Save, LogOut } from "lucide-react";
import { authAPI } from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Toggle = ({ checked, onChange }) => (
  <button onClick={() => onChange(!checked)}
    className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${checked
? "bg-gradient-to-r from-cyan-500 to-purple-600 shadow-[0_0_20px_rgba(34,211,238,0.4)]"
: "bg-white/10"}`}>
    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`} />
  </button>
);

export default function SettingsPage() {
 const navigate = useNavigate();

const [theme, setTheme] = useState(
  localStorage.getItem("theme") || "dark"
);

useEffect(() => {

  document.documentElement.classList.remove(
    "light",
    "dark"
  );

  document.documentElement.classList.add(theme);

  localStorage.setItem(
    "theme",
    theme
  );

}, [theme]);

const toggleTheme = (newTheme) => {
  setTheme(newTheme);
};
  const { user, logout } = useAuth();
  const [saving, setSaving] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [settings, setSettings] = useState({
    notifications: { email: true, jobAlerts: true, weeklyReport: false, marketing: false },
    privacy: { profileVisible: true, showEmail: false, analyticsOptIn: true },
    preferences: { language: "en", timezone: "UTC", resumeAutoSave: true },
  });
  const [passwords, setPasswords] = useState({ current: "", newPw: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState("");
  const [activeTab, setActiveTab] = useState("notifications");
  useEffect(() => {

  const saved =
    localStorage.getItem(
      "resumeiq_settings"
    );

  if (saved) {

    setSettings(
      JSON.parse(saved)
    );

  }

}, []);

  const toggle = (group, key) => setSettings(s => ({ ...s, [group]: { ...s[group], [key]: !s[group][key] } }));

 const handlePasswordChange = async () => {

  if (passwords.newPw !== passwords.confirm)
    return setPwMsg("Passwords do not match.");

  if (passwords.newPw.length < 8)
    return setPwMsg("Minimum 8 characters.");

  setSaving(true);

  try {

    await authAPI.changePassword({
      currentPassword: passwords.current,
      newPassword: passwords.newPw
    });

    setPwMsg("Password updated successfully!");

    setPasswords({
      current: "",
      newPw: "",
      confirm: ""
    });

  } catch (e) {

    setPwMsg(
      e.response?.data?.message ||
      "Failed to update password."
    );

  } finally {

    setSaving(false);
  }
};

  const inputCls = `

w-full
bg-white/[0.04]
backdrop-blur-xl

border
border-white/10

rounded-2xl

py-3
px-5

text-white
placeholder-white/30

focus:outline-none
focus:border-cyan-400/50
focus:bg-white/[0.06]

transition-all
duration-300

shadow-[0_0_20px_rgba(0,0,0,0.15)]

`;
const saveSettings = async () => {

  try {

    await authAPI.updateSettings(
      settings
    );

    localStorage.setItem(
      "resumeiq_settings",
      JSON.stringify(settings)
    );

    alert(
      "Settings saved successfully 🚀"
    );

  } catch (err) {

    console.log(err);

    alert(
      "Failed to save settings"
    );

  }

};
  const tabs = ["notifications", "privacy", "security", "preferences", "account"];

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
    <div className="
relative
overflow-hidden
min-h-screen
bg-[#030712]
text-white
p-6
">
  {/* Cyberpunk Grid */}

<div className="
absolute
inset-0
bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
bg-[size:45px_45px]
pointer-events-none
" />
  {/* Neon Glow */}

<div className="
absolute
top-[-120px]
left-[-120px]
w-[420px]
h-[420px]
bg-cyan-500/20
rounded-full
blur-[140px]
animate-pulse
" />

<div className="
absolute
bottom-[-140px]
right-[-120px]
w-[420px]
h-[420px]
bg-purple-500/20
rounded-full
blur-[140px]
animate-pulse
" />

<div className="
absolute
top-[40%]
left-[45%]
w-[280px]
h-[280px]
bg-indigo-500/10
rounded-full
blur-[120px]
" />
      <div className="
relative
z-10
max-w-3xl
mx-auto
space-y-6
">
        <div>
          <h1 className="
text-5xl
font-black
tracking-tight
bg-gradient-to-r
from-cyan-300
via-white
to-purple-400
bg-clip-text
text-transparent
drop-shadow-[0_0_35px_rgba(34,211,238,0.35)]
">Settings</h1>
          <p className="text-white/50 text-sm mt-1">Manage your account and preferences</p>
          <button
  onClick={saveSettings}

  className="
  mt-4

  px-5
  py-3

  rounded-2xl

  bg-gradient-to-r
  from-cyan-500
  to-purple-600

  text-white
  font-semibold

  shadow-[0_0_35px_rgba(34,211,238,0.35)]

  hover:scale-105

  transition-all
"
>
  Save Settings
</button>
        </div>

        {/* Tabs */}
        <div className="
relative
overflow-hidden
flex
gap-1
bg-white/[0.04]
backdrop-blur-2xl
border
border-cyan-400/10
rounded-2xl
p-1.5

shadow-[0_0_40px_rgba(34,211,238,0.08)]
">
         {tabs.map(t => (
  <button
    key={t}
    onClick={() => setActiveTab(t)}
    className={`
      flex-1
      py-2.5
      rounded-xl
      text-xs
      font-semibold
      capitalize
      transition-all
      duration-300

      ${
        activeTab === t
          ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-[0_0_25px_rgba(34,211,238,0.25)]"
          : "text-white/40 hover:text-white hover:bg-white/[0.05]"
      }
    `}
  >
    {t}
  </button>
))}
        </div>

        <div className="
relative
overflow-hidden

bg-white/[0.04]
backdrop-blur-3xl

border
border-cyan-400/10

rounded-[32px]
p-6
space-y-5

shadow-[0_0_80px_rgba(34,211,238,0.08)]
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
          {activeTab === "notifications" && (
            <>
              <h3 className="text-white font-semibold flex items-center gap-2"><Bell size={18} className="text-indigo-400" />Notifications</h3>
              {[
                ["email", "Email Notifications", "Receive important updates via email"],
                ["jobAlerts", "Job Alerts", "Get notified about new matching jobs"],
                ["weeklyReport", "Weekly Report", "Weekly career progress summary"],
                ["marketing", "Marketing Emails", "Tips, news, and feature updates"],
              ].map(([k, l, d]) => (
                <div key={k} className="flex items-center justify-between py-3 border-b border-white/[0.06] last:border-0">
                  <div>
                    <p className="text-white text-sm font-medium">{l}</p>
                    <p className="text-white/40 text-xs">{d}</p>
                  </div>
                  <Toggle checked={settings.notifications[k]} onChange={() => toggle("notifications", k)} />
                </div>
              ))}
            </>
          )}

          {activeTab === "privacy" && (
            <>
              <h3 className="text-white font-semibold flex items-center gap-2"><Shield size={18} className="text-cyan-400" />Privacy</h3>
              {[
                ["profileVisible", "Public Profile", "Allow recruiters to find your profile"],
                ["showEmail", "Show Email", "Display email on public profile"],
                ["analyticsOptIn", "Analytics", "Help improve ResumeIQ with usage data"],
              ].map(([k, l, d]) => (
                <div key={k} className="flex items-center justify-between py-3 border-b border-white/[0.06] last:border-0">
                  <div>
                    <p className="text-white text-sm font-medium">{l}</p>
                    <p className="text-white/40 text-xs">{d}</p>
                  </div>
                  <Toggle checked={settings.privacy[k]} onChange={() => toggle("privacy", k)} />
                </div>
              ))}
            </>
          )}

          {activeTab === "security" && (
            <>
              <h3 className="text-white font-semibold flex items-center gap-2"><Key size={18} className="text-yellow-400" />Change Password</h3>
              <div className="space-y-3">
                <div className="relative">
                  <input type={showCurrentPw ? "text" : "password"} placeholder="Current Password" value={passwords.current} onChange={e => setPasswords({ ...passwords, current: e.target.value })} className={inputCls + " pr-10"} />
                  <button onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                    {showCurrentPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <div className="relative">
                  <input type={showNewPw ? "text" : "password"} placeholder="New Password" value={passwords.newPw} onChange={e => setPasswords({ ...passwords, newPw: e.target.value })} className={inputCls + " pr-10"} />
                  <button onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                    {showNewPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <input type="password" placeholder="Confirm New Password" value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} className={inputCls} />
                {pwMsg && <p className={`text-sm ${pwMsg.includes("success") ? "text-emerald-400" : "text-red-400"}`}>{pwMsg}</p>}
                <button onClick={handlePasswordChange} disabled={saving}
                  className="
relative
overflow-hidden

flex
items-center
gap-2

px-6
py-3

rounded-2xl

bg-gradient-to-r
from-cyan-500
via-blue-500
to-purple-600

text-white
font-semibold

shadow-[0_0_45px_rgba(59,130,246,0.35)]

hover:scale-105
hover:shadow-cyan-400/40

transition-all
duration-300

disabled:opacity-60
">
                  <Save size={14} />{saving ? "Updating..." : "Update Password"}
                </button>
              </div>
            </>
          )}

          {activeTab === "preferences" && (
            <>
              <h3 className="text-white font-semibold flex items-center gap-2"><Globe size={18} className="text-violet-400" />Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-white/50 text-xs mb-1.5 block">Theme</label>
                  <div className="flex gap-3">
                    {[["dark", Moon, "Dark"], ["light", Sun, "Light"]].map(([t, Icon, l]) => (
                      <button key={t} onClick={() => toggleTheme(t)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm border transition-all ${theme === t ? "border-indigo-500 bg-indigo-500/10 text-indigo-400" : "border-white/10 text-white/40 hover:border-white/20"}`}>
                        <Icon size={15} />{l}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-white/50 text-xs mb-1.5 block">Language</label>
                  <select value={settings.preferences.language} onChange={e => setSettings(s => ({ ...s, preferences: { ...s.preferences, language: e.target.value } }))}
                    className={inputCls}>
                    {[["en","English"],["es","Spanish"],["fr","French"],["de","German"]].map(([v,l]) => (
                      <option key={v} value={v} className="bg-[#0a0a1a]">{l}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm">Auto-save Resume</p>
                    <p className="text-white/40 text-xs">Automatically save changes in builder</p>
                  </div>
                  <Toggle checked={settings.preferences.resumeAutoSave} onChange={() => toggle("preferences", "resumeAutoSave")} />
                </div>
              </div>
            </>
          )}

          {activeTab === "account" && (
            <>
              <h3 className="text-white font-semibold">Account</h3>
              <div className="space-y-3">
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-white/60 text-xs mb-0.5">Account Email</p>
                  <p className="text-white text-sm">{user?.email}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-white/60 text-xs mb-0.5">Current Plan</p>
                  <p className="text-white text-sm capitalize">{user?.plan || "Free"} Plan</p>
                </div>
                <div className="pt-4 space-y-3 border-t border-white/10">
                  <button onClick={logout}
                     className="
flex
items-center
gap-2

px-4
py-3
w-full

bg-white/[0.04]
backdrop-blur-xl

border
border-cyan-400/10

text-white/70
hover:text-white

rounded-2xl

hover:bg-white/[0.06]
hover:border-cyan-400/20

transition-all
duration-300
" >
                    <LogOut size={15} />Sign Out
                  </button>
                  <button className="
flex
items-center
gap-2

px-4
py-3
w-full

bg-red-500/10
border
border-red-500/20

text-red-400

rounded-2xl

hover:bg-red-500/15
hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]

transition-all
duration-300
">
                    <Trash2 size={15} />Delete Account
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      </div>
          </>
  );
}