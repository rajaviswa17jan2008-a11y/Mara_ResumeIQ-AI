import React, { useState } from "react";
import {
  Link,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function Login() {

  const {
  login,
  isAuthenticated
} = useAuth();
const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [show, setShow] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [errors, setErrors] =
    useState({});

  const validate = () => {

    const e = {};

    if (!form.email)
      e.email = "Email is required";

    else if (
      !/\S+@\S+\.\S+/.test(form.email)
    )
      e.email = "Invalid email";

    if (!form.password)
      e.password =
        "Password is required";

    setErrors(e);

    return (
      Object.keys(e).length === 0
    );

  };

  const handleSubmit = async (e) => {

  e.preventDefault();

  if (!validate()) return;

  try {

    setLoading(true);

    const success = await login(
      form.email,
      form.password
    );

    if (!success) {

      setErrors({
        auth: "Invalid email or password"
      });

    }

  } catch (err) {

    console.log(err);

    setErrors({
      auth: "Login failed"
    });

  } finally {

    setLoading(false);

  }

};
if (isAuthenticated) {
  return (
    <Navigate
      to="/dashboard"
      replace
    />
  );
}

  const set = (field) => (e) =>
    setForm((f) => ({
      ...f,
      [field]: e.target.value,
    }));

  return (

    <div
      className="
min-h-screen
flex
items-center
justify-center

bg-[#030712]

px-4
relative
overflow-hidden

before:absolute
before:inset-0
before:bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.15),transparent_35%)]

after:absolute
after:inset-0
after:bg-[radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.18),transparent_35%)]
"
    >
      <div
  className="
  absolute
  inset-0

  bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]

  bg-[size:40px_40px]

  pointer-events-none
  "
/>

      {/* BACKGROUND GLOW */}

      <div
        className="
        absolute
        top-0
        left-0
        w-72
        h-72
        bg-cyan-500/20
        blur-[120px]
        rounded-full
      "
      />

      <div
        className="
        absolute
        bottom-0
        right-0
        w-72
        h-72
        bg-indigo-500/20
        blur-[120px]
        rounded-full
      "
      />

      {/* LOGIN CARD */}

      <motion.div

        initial={{
          opacity: 0,
          y: 30,
        }}

 animate={{
  opacity: 1,
  y: 0,
}}

transition={{
  duration: 0.8,
  ease: "easeOut",
}}

        className="
        transform-gpu
will-change-transform
relative
z-10
w-full
max-w-md

bg-white/[0.04]
backdrop-blur-3xl

border
border-cyan-400/10

rounded-[32px]

p-8

shadow-[0_0_80px_rgba(6,182,212,0.12)]

overflow-hidden
"
      >
      
         
    <motion.button
  type="button"
  onClick={() => navigate("/")}

  animate={{
    boxShadow: [
      "0 0 0px rgba(34,211,238,0)",
      "0 0 25px rgba(34,211,238,0.5)",
      "0 0 0px rgba(34,211,238,0)"
    ]
  }}

  transition={{
    duration: 2,
    repeat: Infinity
  }}

  whileHover={{
    scale: 1.08,
    y: -3
  }}

  whileTap={{
    scale: 0.92
  }}

  className="
  absolute
  top-2
left-2
  z-50

  flex
  items-center
  gap-2

  px-4
  py-2

  rounded-2xl

  bg-gradient-to-r
  from-cyan-500/20
  via-blue-500/20
  to-indigo-500/20

  backdrop-blur-xl

  border
  border-cyan-400/30

  text-cyan-300

  shadow-[0_0_25px_rgba(34,211,238,0.25)]

  hover:text-white
  hover:border-cyan-400/60
  hover:shadow-[0_0_40px_rgba(34,211,238,0.45)]

  transition-all
  duration-300
  "
>

  <motion.div
    animate={{
      x: [0, -4, 0]
    }}
    transition={{
      duration: 1,
      repeat: Infinity
    }}
  >
    <LogOut size={14} />
  </motion.div>

  <span className="
text-xs
font-medium
">
  Exit
</span>

</motion.button>
        <div
  className="
  absolute
  -top-20
  -right-20
  w-52
  h-52
  bg-cyan-500/10
  blur-[100px]
  rounded-full
  "
/>

<div
  className="
  absolute
  -bottom-20
  -left-20
  w-52
  h-52
  bg-purple-500/10
  blur-[100px]
  rounded-full
  "
/>

        {/* LOGO */}

        <div className="mt-8 mb-8 flex items-center gap-3">
     <img
  src="/logo2.png"
  alt="Mara ResumeIQ"
  className="
  w-14
  h-14
  object-contain
  drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]
  "
/>

          <div>

           <h2
  className="
  text-white
  font-extrabold
  text-xl
  tracking-tight
  "
>
  <span className="text-cyan-400">
    Mara
  </span>

  <span className="text-white ml-1">
    Resume
  </span>

  <span className="text-purple-400">
    IQ
  </span>
</h2>

<p
  className="
  text-white/40
  text-xs
"
>
  AI-Powered Resume Intelligence
</p>

          </div>

        </div>

        {/* TITLE */}

        <div className="mb-8">

          <h1
            className="
text-5xl
font-black
tracking-tight

bg-gradient-to-r
from-cyan-300
via-white
to-purple-400

bg-clip-text
text-transparent

drop-shadow-[0_0_30px_rgba(34,211,238,0.35)]
"
          >
            Welcome back 👋
          </h1>

          <p
            className="
            text-white/50
            text-sm
          "
          >
            Sign in to continue your
            career journey
          </p>
          <div
  className="
  inline-flex
  items-center
  px-2
py-1
gap-1

  rounded-full

  bg-cyan-500/10
  border
  border-cyan-400/20

  text-cyan-300
  text-xs
  font-medium

  mt-4
"
>
  <Sparkles size={14} />
  AI Powered Resume Intelligence
</div>

        </div>

        {/* OAUTH */}

        <div
          className="
          grid
          grid-cols-2
          gap-3
          mb-6
        "
        >

          <button
          
           className="
group

flex
items-center
justify-center
gap-2

py-3

rounded-2xl

bg-white/[0.03]
backdrop-blur-2xl

border
border-cyan-400/10

shadow-[0_0_20px_rgba(34,211,238,0.08)]

focus:shadow-[0_0_35px_rgba(34,211,238,0.25)]
focus:border-cyan-400/40
backdrop-blur-xl

border
border-white/10

text-white/70

hover:text-white
hover:border-cyan-400/20
hover:bg-white/[0.07]

transition-all
duration-300

hover:-translate-y-1
"
          >
            G Google
          </button>

          <button
            className="
            flex
            items-center
            justify-center
            gap-2
            py-3
            rounded-2xl
            bg-white/5
            border
            border-white/10
            text-white/80
            hover:text-white
            hover:scale-[1.02]
            transition-all
          "
          >
            in LinkedIn
          </button>

        </div>

        {/* DIVIDER */}

        <div
          className="
          flex
          items-center
          gap-3
          mb-6
        "
        >

          <div
            className="
            flex-1
            h-px
            bg-white/10
          "
          />

          <span
            className="
            text-xs
            text-white/30
          "
          >
            or continue with email
          </span>

          <div
            className="
            flex-1
            h-px
            bg-white/10
          "
          />

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* EMAIL */}

          <div>

            <label
              className="
              text-xs
              text-white/60
              mb-2
              block
            "
            >
              Email Address
            </label>

            <div className="relative">

              <Mail
                size={16}
                className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-white/30
              "
              />

              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="you@example.com"

                className={`
w-full

bg-white/[0.04]
backdrop-blur-xl

border
border-white/10

rounded-2xl

py-4
pl-11
pr-4

text-white
placeholder:text-white/30

outline-none

focus:border-cyan-400/50
focus:bg-white/[0.07]

transition-all
duration-300

shadow-[0_0_25px_rgba(0,0,0,0.15)]

${errors.email ? "border-red-500" : ""}
`}
              />

            </div>

            {errors.email && (

              <p
                className="
                text-red-400
                text-xs
                mt-1
              "
              >
                {errors.email}
              </p>

            )}

          </div>

          {/* PASSWORD */}

          <div>

            <div
              className="
              flex
              justify-between
              mb-2
            "
            >

              <label
                className="
                text-xs
                text-white/60
              "
              >
                Password
              </label>

              <Link
                to="/forgot-password"
                className="
                text-xs
                text-cyan-400
                hover:text-white
              "
              >
                Forgot password?
              </Link>

            </div>

            <div className="relative">

              <Lock
                size={16}
                className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-white/30
              "
              />

              <input
                type={
                  show
                    ? "text"
                    : "password"
                }

                value={form.password}

                onChange={set("password")}

                placeholder="••••••••"

                className={`
w-full

bg-white/[0.04]
backdrop-blur-xl

border
border-white/10

rounded-2xl

py-4
pl-11
pr-4

text-white
placeholder:text-white/30

outline-none

focus:border-cyan-400/50
focus:bg-white/[0.07]

transition-all
duration-300

shadow-[0_0_25px_rgba(0,0,0,0.15)]

${errors.email ? "border-red-500" : ""}
`}
              />

              <button
                type="button"

                onClick={() =>
                  setShow(!show)
                }

                className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-white/40
              "
              >

                {show
                  ? <EyeOff size={16} />
                  : <Eye size={16} />
                }

              </button>

            </div>

          </div>

          {/* BUTTON */}

          <button

            type="submit"

            disabled={loading}

           className="
relative
overflow-hidden

w-full
py-4

rounded-2xl

font-semibold
text-white

bg-gradient-to-r
from-cyan-500
via-blue-500
to-purple-600

shadow-[0_0_45px_rgba(59,130,246,0.35)]

hover:scale-[1.03]
hover:shadow-[0_0_60px_rgba(34,211,238,0.45)]
active:scale-[0.98]
hover:shadow-cyan-400/40

transition-all
duration-300

before:absolute
before:inset-0
before:bg-white/10
before:opacity-0
hover:before:opacity-100
before:transition-all
"
          >

            {loading
              ? "Signing in..."
              : (
                <span
                  className="
group

flex
items-center
justify-center
gap-2

py-3

rounded-2xl

bg-white/[0.04]
backdrop-blur-xl

border
border-white/10

text-white/70

hover:text-white
hover:border-cyan-400/20
hover:bg-white/[0.07]

transition-all
duration-300

hover:-translate-y-1
"
                >
                  Sign In
                  <ArrowRight size={18} />
                </span>
              )
            }

          </button>
{errors.auth && (

  <p className="
    text-red-400
    text-sm
    text-center
    mt-2
  ">
    {errors.auth}
  </p>

)}
        </form>

        {/* FOOTER */}

        <p
          className="
          text-center
          text-sm
          text-white/40
          mt-6
        "
        >
          Don’t have an account?{" "}

          <Link
            to="/signup"
            className="
            text-cyan-400
            hover:text-white
            font-medium
          "
          >
            Create one free
          </Link>

        </p>

        

      </motion.div>

    </div>

  );

}