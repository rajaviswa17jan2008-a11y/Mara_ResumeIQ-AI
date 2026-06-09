import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import { authAPI } from "../services/api";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();


  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOTP, setShowOTP] = useState(false);

const [otp, setOtp] = useState("");

const [userId, setUserId] = useState("");
  const [form, setForm] = useState({
  name: "", email: "", password: "", confirmPassword: "",
    jobTitle: "", experience: "", plan: "free"
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

          const handleSubmit = async () => {
             console.log("CREATE ACCOUNT CLICKED");
            console.log(form);

  setLoading(true);

  setError("");

  try {

    const result =
      await signup(form);

    if (result.success) {

  setUserId(
    result.data.userId
  );

  setShowOTP(true);

}

  } catch (e) {

    setError(
      e.response?.data?.message ||
      "Registration failed."
    );

  } finally {

    setLoading(false);

  }

};  
const handleVerifyOTP =
  async () => {

    try {

      await authAPI.verifyOTP({
        userId,
        otp
      });

      alert(
        "Email Verified Successfully"
      );

      navigate("/login");

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Invalid OTP"
      );

    }

};                                                      
  const plans = [
    { id: "free", name: "Free", price: "$0", features: ["3 Resume Scans/mo", "Basic ATS Score", "Job Board Access"] },
    { id: "pro", name: "Pro", price: "$19", features: ["Unlimited Scans", "AI Skill Coach", "Interview Prep", "Career Chatbot"] },
    { id: "enterprise", name: "Enterprise", price: "$49", features: ["Everything in Pro", "Team Analytics", "API Access", "Priority Support"] },
  ];

  return (
    <div className="
min-h-screen

flex
items-center
justify-center

px-4

relative
overflow-hidden

bg-[#030712]

before:absolute
before:inset-0

before:bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.16),transparent_30%)]

after:absolute
after:inset-0

after:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]

after:bg-[size:45px_45px]
">
      {/* bg grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="
absolute
top-[-120px]
left-[-120px]

w-[450px]
h-[450px]

bg-cyan-500/20
rounded-full
blur-[140px]

animate-pulse
" />

<div className="
absolute
bottom-[-120px]
right-[-120px]

w-[500px]
h-[500px]

bg-purple-600/20
rounded-full
blur-[160px]

animate-pulse
" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="
w-11
h-11

rounded-2xl

bg-gradient-to-br
from-cyan-400
via-blue-500
to-purple-600

shadow-[0_0_40px_rgba(59,130,246,0.45)]

flex
items-center
justify-center
">
              <img
  src="/logo2.png"
  alt="Mara ResumeIQ"
  className="w-10 h-10 object-contain"
/>
            </div>
            <span className="
text-transparent
bg-clip-text

bg-gradient-to-r
from-cyan-300
via-blue-400
to-purple-400

font-black
text-3xl
tracking-tight
">
<span className="text-cyan-300">
  Mara
</span>

<span className="text-white ml-1">
  Resume
</span>

<span className="text-purple-400">
  IQ
</span>
</span>
          </Link>
        </div>

        {/* Step indicator */}
      

        <div className="
relative
overflow-hidden

bg-white/[0.04]

backdrop-blur-2xl

border
border-cyan-400/10

rounded-[32px]

p-8

shadow-[0_0_60px_rgba(6,182,212,0.08)]

before:absolute
before:top-0
before:left-0
before:w-full
before:h-[2px]

before:bg-gradient-to-r
before:from-cyan-400
before:via-blue-500
before:to-purple-500

before:opacity-80
">
          <motion.div
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  className="space-y-4"
></motion.div>
              <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h2 className="
text-4xl
font-black

text-transparent
bg-clip-text

bg-gradient-to-r
from-white
via-cyan-200
to-purple-300

mb-2
">Create your account</h2>
                <p className="
text-white/50
text-base
leading-relaxed
mb-8
">Join 50,000+ professionals advancing their careers</p>
                {[
                  { icon: User, name: "name", placeholder: "Full Name", type: "text" },
                  { icon: Mail, name: "email", placeholder: "Email Address", type: "email" },
                ].map(({ icon: Icon, name, placeholder, type }) => (
                  <div key={name} className="relative">
                    <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type={type} name={name} placeholder={placeholder} value={form[name]} onChange={handleChange}
                      className="

w-full

bg-white/[0.04]
backdrop-blur-xl

border
border-white/10

rounded-2xl

py-3.5
pl-12
pr-4

text-white
placeholder-white/30

focus:outline-none
focus:border-cyan-400/50
focus:bg-white/[0.06]

transition-all
duration-300

shadow-[0_0_20px_rgba(0,0,0,0.15)]

"
                    />
                  </div>
                ))}
                {[
                  { name: "password", placeholder: "Password" },
                  { name: "confirmPassword", placeholder: "Confirm Password" },
                ].map(({ name, placeholder }) => (
                  <div key={name} className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type={showPassword ? "text" : "password"} name={name} placeholder={placeholder} value={form[name]} onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-11 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all text-sm"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                ))}
                {error && <p className="text-red-400 text-sm">{error}</p>}
                {showOTP && (

  <div className="space-y-4 mt-6">

    <input
      type="text"
      placeholder="Enter OTP"
      value={otp}
      onChange={(e) =>
        setOtp(e.target.value)
      }
      className="
      w-full
      bg-white/5
      border
      border-cyan-400/20
      rounded-xl
      py-3
      px-4
      text-white
      "
    />

    <button
      onClick={handleVerifyOTP}
      className="
      w-full
      py-4
      rounded-2xl

      bg-gradient-to-r
      from-green-500
      to-cyan-500

      text-white
      font-bold
      "
    >
      Verify OTP
    </button>

  </div>

)}
               {!showOTP && (
                <>

<button
  onClick={handleSubmit} 
  disabled={loading}
  className="
  w-full
  py-4
  rounded-2xl

  bg-gradient-to-r
  from-cyan-500
  via-blue-500
  to-purple-600

  text-white
  font-bold

  shadow-[0_0_30px_rgba(59,130,246,0.4)]

  hover:scale-[1.02]
  hover:shadow-[0_0_50px_rgba(59,130,246,0.6)]

  transition-all
  duration-300
  "
>
  {loading
    ? "Creating Account..."
    : "Create Account →"}
</button>
                <p className="text-center text-white/40 text-sm">Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300">Sign in</Link></p>
      </>
  )}
              </motion.div>
        </div>
      </motion.div>
    </div>
  );
}