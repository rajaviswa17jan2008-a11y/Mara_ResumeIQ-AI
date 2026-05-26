import {
  useState,
  useEffect
} from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Mail, Phone, MapPin, Briefcase, Camera, Save, Edit3, Globe, Link, GitBranch } from "lucide-react";
import { userAPI } from "../services/api";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
const [form, setForm] = useState({
  name: "",
  email: "",
  phone: "",
  location: "",
  jobTitle: "",
  bio: "",
  linkedin: "",
  github: "",
  website: "",
  skills: "",
});
   useEffect(() => {

  if (user) {

    setForm({
      name: user.name || "User",
      email: user.email || "",
      phone: user.phone || "",
      location: user.location || "",
      jobTitle: user.jobTitle || "",
      bio: user.bio || "",
      linkedin: user.linkedin || "",
      github: user.github || "",
      website: user.website || "",
      skills: Array.isArray(user.skills)
        ? user.skills.join(", ")
        : "",
    });

  }

}, [user]);
 
  
  const [success, setSuccess] = useState("");
const [avatar, setAvatar] = useState(

  localStorage.getItem("avatar") || null

);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAvatarChange = (e) => {

  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onloadend = () => {

    setAvatar(reader.result);

    localStorage.setItem(
      "avatar",
      reader.result
    );

  };

  reader.readAsDataURL(file);

};

 const handleSave = async () => {
  setSaving(true);

  try {
   const updatedForm = {
  ...form,
  name: form.name?.trim() || "User",
};

const res = await userAPI.updateProfile({
  name: updatedForm.name,
  email: updatedForm.email,
  phone: updatedForm.phone,
  location: updatedForm.location,
  jobTitle: updatedForm.jobTitle,
  bio: updatedForm.bio,
  linkedin: updatedForm.linkedin,
  github: updatedForm.github,
  website: updatedForm.website,

  skills: updatedForm.skills
    .split(",")
    .map((s) => s.trim()),
});

    console.log(res.data);
    console.log(
  "UPDATED USER:",
  res.data.user
);

    
    setUser(res.data.user);

    
    localStorage.setItem(
  "user",
  JSON.stringify(res.data.user)
);

setForm({
  name: res.data.user.name || "",
  email: res.data.user.email || "",
  phone: res.data.user.phone || "",
  location: res.data.user.location || "",
  jobTitle: res.data.user.jobTitle || "",
  bio: res.data.user.bio || "",
  linkedin: res.data.user.linkedin || "",
  github: res.data.user.github || "",
  website: res.data.user.website || "",
  skills: Array.isArray(res.data.user.skills)
    ? res.data.user.skills.join(", ")
    : "",
});

    setEditing(false);
    setSuccess("Profile updated successfully!");

    setTimeout(() => {
      setSuccess("");
    }, 3000);

  } catch (err) {

  console.log(err);

  alert(
    err.response?.data?.message ||
    "Profile update failed"
  );

} finally {
    setSaving(false);
  }
};
  const inputCls = (dis) => `
w-full
relative
overflow-hidden
bg-white/[0.04]
backdrop-blur-3xl
border
border-cyan-400/10
rounded-[28px]

hover:border-cyan-400/20
hover:shadow-[0_0_60px_rgba(34,211,238,0.08)]

transition-all
duration-500

${dis
  ? "opacity-50 cursor-not-allowed"
  : ""
}
`;

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
  p-6
">
  {/* Futuristic Grid Background */}

<div className="
absolute
inset-0
bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
bg-[size:45px_45px]
pointer-events-none
" />
{/* Neon Glow Effects */}

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
w-[300px]
h-[300px]
bg-indigo-500/10
rounded-full
blur-[120px]
" />
      <motion.div
  initial={{
    opacity: 0,
    y: 20
  }}
  animate={{
    opacity: 1,
    y: 0
  }}
  transition={{
    duration: 0.5
  }}
  className="
relative
z-10
max-w-6xl
mx-auto
space-y-10
px-4
"
>

  {/* Background Glow */}

  <div className="
    absolute
    top-0
    left-0
    w-72
    h-72
    bg-cyan-500/20
    blur-[120px]
    rounded-full
    -z-10
  " />

  <div className="
    absolute
    bottom-0
    right-0
    w-72
    h-72
    bg-indigo-500/20
    blur-[120px]
    rounded-full
    -z-10
  " />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="
       text-6xl
font-black
tracking-tight
bg-gradient-to-r
from-cyan-300
via-white
to-purple-400
bg-clip-text
text-transparent
drop-shadow-[0_0_35px_rgba(34,211,238,0.35)]
">Profile</h1>
            <p className="text-white/50 text-sm mt-1">Manage your personal information</p>
          </div>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white/70 hover:text-white rounded-xl text-sm transition-all">
              <Edit3 size={15} />Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setEditing(false)} className="px-4 py-2 text-white/50 hover:text-white text-sm transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                 className="
relative
overflow-hidden
flex
items-center
gap-2
px-7
py-3.5
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

before:absolute
before:inset-0
before:bg-white/10
before:opacity-0
hover:before:opacity-100
before:transition-all
">
                <Save size={15} />{saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
         {success && (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="
      bg-emerald-400/10
      border
      border-emerald-400/20
      text-emerald-400
      rounded-xl
      px-4
      py-3
      text-sm
    "
  >
    {success}
  </motion.div>
)} 
        
        <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="
    relative
    overflow-hidden
    rounded-[32px]
    before:absolute
before:inset-0
before:rounded-[32px]
before:p-[1px]

before:bg-gradient-to-r
before:from-cyan-400/20
before:via-purple-400/20
before:to-cyan-400/20

before:content-['']
border
border-cyan-400/10
bg-white/[0.03]
backdrop-blur-3xl
shadow-[0_0_80px_rgba(34,211,238,0.08)]
  "
>

  <div className="
    absolute
    top-0
    right-0
    w-64
    h-64
    bg-cyan-400/20
    blur-[120px]
    rounded-full
  " />

  <div className="relative z-10 flex items-center gap-8">

    {/* Avatar */}

    <div className="relative">

      <div className="
        w-32
        h-32
        rounded-3xl
        hover:-translate-y-1
transition-all
duration-300
        bg-gradient-to-br
        from-cyan-400
        to-indigo-600
        p-[3px]
        shadow-2xl
      ">

        <div className="
          w-full
          h-full
          rounded-3xl
          hover:scale-[1.02]
transition-all
duration-300
          bg-slate-950
          flex
          items-center
          justify-center
          overflow-hidden
          bg-gradient-to-r
from-cyan-300
via-white
to-purple-400

bg-clip-text
text-transparent

drop-shadow-[0_0_25px_rgba(34,211,238,0.35)]
          text-5xl
          font-black
        ">

         {avatar ? (

  <img
    src={avatar}
    alt="avatar"
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

      </div>

      {editing && (
  <label
    className="
    absolute
    bottom-0
    right-0

    w-10
    h-10

    rounded-2xl

    bg-cyan-500

    flex
    items-center
    justify-center

    cursor-pointer

    hover:scale-110
    transition-all

    shadow-lg
  "
  >
    <Camera
      size={18}
      className="text-white"
    />

    <input
      type="file"
      accept="image/*"
      onChange={handleAvatarChange}
      className="hidden"
    />
  </label>
)}

    </div>

    {/* Info */}

    <div className="flex-1">

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
      ">
        {form.name || "User"}
      </h1>

      <p className="
        text-cyan-300
        text-lg
        font-medium
        mb-4
      ">
        {form.jobTitle || "Professional Developer"}
      </p>

      <p className="
        text-white/60
        max-w-2xl
        leading-relaxed
      ">
        {form.bio || "Passionate developer building intelligent applications and modern user experiences."}
      </p>

      <div className="
        flex
        flex-wrap
        gap-3
        mt-6
      ">

        {form.skills
          ?.split(",")
          .slice(0, 5)
          .map((skill, i) => (

            <span
              key={i}
              className="
                px-4
                py-2
                rounded-2xl
                bg-white/10
                border
                border-white/10
                text-cyan-300
                text-sm
                backdrop-blur-xl
              "
            >
              {skill.trim()}
            </span>

          ))}

      </div>

    </div>

  </div>

</motion.div>
           <div className="
  bg-white/[0.04]
  backdrop-blur-2xl
  border
  border-white/10
  rounded-3xl
  hover:scale-[1.02]
hover:shadow-cyan-500/20
hover:border-cyan-400/20
hover:scale-[1.02]
transition-all
duration-300
  p-6
  shadow-[0_10px_40px_rgba(0,0,0,0.35)]
">

          <h3 className="
text-white
font-semibold
mb-4
text-xl
flex
items-center
gap-2
">
  📇 Contact Information
</h3>
          <div className="
grid
grid-cols-1
md:grid-cols-2
gap-6
mt-6
">
            {[
              { icon: Edit3, name: "name", label: "Name" },
              { icon: Mail, name: "email", label: "Email", type: "email" },
              { icon: Phone, name: "phone", label: "Phone" },
              { icon: MapPin, name: "location", label: "Location" },
              { icon: Briefcase, name: "jobTitle", label: "Current Title" },
            ].map(({ icon: Icon, name, label, type = "text" }) => (
              <div key={name}>
                <label className="text-white/40 text-xs mb-1 flex items-center gap-1 block"><Icon size={11} />{label}</label>
                <input type={type} name={name} value={form[name]} onChange={handleChange} disabled={!editing} placeholder={`✨ ${label}`} className={inputCls(!editing) + " mt-2 px-4 py-3"} />
              </div>
            ))}
          </div>
          

        {/* Social Links */}
       {/* Social Links */}
<div className="
mt-8
bg-white/[0.04] backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.35)] border border-white/10 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">🌐 Social Links</h3>
          <div className="space-y-5 mt-5">
            {[
              { icon: Link, name: "linkedin", placeholder: "LinkedIn profile URL" }, 
              { icon: GitBranch, name: "github", placeholder: "GitHub profile URL" },
              { icon: Globe, name: "website", placeholder: "Personal website URL" },
            ].map(({ icon: Icon, name, placeholder }) => (
              <div key={name} className="relative">
                <Icon size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input name={name} value={form[name]} onChange={handleChange} disabled={!editing} placeholder={placeholder} className={inputCls(!editing) + " pl-10"} />
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}

<div className="
mt-8
  bg-white/[0.04]
  backdrop-blur-2xl
  border
  border-white/10
  rounded-3xl
  hover:scale-[1.02]
  hover:-translate-y-1
transition-all
duration-300
  p-6
  shadow-[0_10px_40px_rgba(0,0,0,0.35)]
">

  <h3 className="
    text-white
    font-semibold
    mb-4
  ">
    🚀 Skills
  </h3>

  <textarea
    name="skills"
    value={form.skills}
    onChange={handleChange}
    disabled={!editing}
    placeholder="React, Node.js, Python, AWS, Docker..."
    rows={3}
    className={
      inputCls(!editing) +
      " resize-none px-4 py-4 mt-3"
    }
  />

  <p className="
    text-white/30
    text-xs
    mt-2
  ">
    Separate skills with commas
  </p>
  </div>
  
</div>
  </motion.div>

      </div>
    </>
  );
}
