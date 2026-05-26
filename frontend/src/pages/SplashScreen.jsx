import React from "react";

export default function SplashScreen() {

  

  return (

    <div className="
      fixed
      inset-0
      z-[9999]

      bg-gradient-to-br
from-[#020617]
via-[#031525]
to-[#090014]

      flex
      flex-col
      items-center
      justify-center
gap-2

      overflow-hidden
    ">

      {/* Glow Effects */}
      <div className="
absolute
top-0
right-0

w-[500px]
h-[500px]

bg-cyan-500/10

blur-[180px]
rounded-full

animate-[pulse_6s_ease-in-out_infinite]
" />

<div className="
absolute
bottom-0
left-0

w-[500px]
h-[500px]

bg-purple-500/10

blur-[180px]
rounded-full
" />
      <div className="
absolute
top-0
left-0

w-full
h-full

bg-[radial-gradient(circle_at_top_left,rgba(0,255,255,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.15),transparent_35%)]

animate-pulse
" />

      <div className="
        absolute
        w-[400px]
        h-[400px]

        bg-cyan-500/20

        blur-[140px]
        rounded-full

        animate-pulse
      " />
      <div className="
  absolute
  inset-0

  opacity-[0.08]

  bg-[linear-gradient(to_right,#00ffff22_1px,transparent_1px),linear-gradient(to_bottom,#00ffff22_1px,transparent_1px)]

  bg-[size:80px_80px]
" />
<div className="
absolute
top-[18%]
left-[18%]

w-2
h-2

rounded-full

bg-cyan-400

shadow-[0_0_20px_#22d3ee]

animate-pulse
" />

<div className="
absolute
bottom-[22%]
right-[20%]

w-2
h-2

rounded-full

bg-purple-400

shadow-[0_0_20px_#a855f7]

animate-pulse
" />

      <div className="
        absolute
        bottom-0
        right-0

        w-[300px]
        h-[300px]

        bg-purple-500/20

        blur-[120px]
        rounded-full

        animate-pulse
      " />
     
<div className="
absolute

w-[700px]
h-[430px]

rounded-[45px]

bg-gradient-to-br
from-white/[0.08]
to-white/[0.02]

backdrop-blur-[25px]

border


shadow-[0_0_100px_rgba(0,255,255,0.08)]

before:absolute
before:inset-0
before:rounded-[45px]

before:bg-gradient-to-br
before:from-cyan-400/5
before:to-purple-500/5

before:pointer-events-none
" />

      {/* Logo */}
      <div className="
absolute

w-[520px]
h-[520px]

rounded-full

border
border-cyan-400/10

animate-spin

[animation-duration:18s]

opacity-20
" />
      <div className="border-cyan-400/20
absolute

w-[750px]
h-[2px]

bg-gradient-to-r
from-transparent
via-cyan-400/70
to-transparent

blur-sm

animate-pulse

z-10
" />
<div className="
absolute

w-[350px]
h-[350px]

bg-gradient-to-r
from-cyan-400/20
to-purple-500/20

blur-[100px]

animate-pulse

z-0
" />
 
      <div className="
absolute

w-[420px]
h-[420px]

bg-cyan-400/10

rounded-full

blur-[120px]

z-0
" />
      
 <img
  src="/logo.png"
  alt="Mara ResumeIQ"
  className="
  w-[340px]
  md:w-[520px]

  object-contain

  relative
  z-10

  brightness-125
contrast-125

  drop-shadow-[0_0_60px_rgba(34,211,238,0.9)]

  hover:scale-[1.02]

transition-all
duration-700
  "
/>
<p className="
mt-3
text-center
max-w-xl

text-sm
md:text-base

font-semibold

tracking-[0.45em]

uppercase

bg-gradient-to-r
from-pink-400
via-fuchsia-400
to-purple-400

bg-clip-text
text-transparent

drop-shadow-[0_0_18px_rgba(217,70,239,0.9)]

animate-pulse
">

Secure • Intelligent • Futuristic

</p>

<p className="
mt-3
text-center
max-w-xl

text-white

drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]

text-sm

tracking-wide

font-light
">

Transforming Resumes Into Intelligent 
      Career Opportunities.!!

</p>
      <div className="
mt-10

w-72
h-[6px]

bg-white/[0.04]

rounded-full

overflow-hidden

border
border-white/5

backdrop-blur-xl
">

<div className="
h-full
w-1/2

bg-gradient-to-r
from-cyan-400
via-blue-500
to-purple-500

shadow-[0_0_25px_rgba(34,211,238,0.8)]

animate-[loading_2s_linear_infinite]
" />

</div>

    </div>

  );

}