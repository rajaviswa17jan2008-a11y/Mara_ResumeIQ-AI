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

  opacity-[0.15]

  bg-[linear-gradient(to_right,#00ffff22_1px,transparent_1px),linear-gradient(to_bottom,#00ffff22_1px,transparent_1px)]

  bg-[size:80px_80px]
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
     

      {/* Logo */}
      

 
  <div className="relative z-10 flex flex-col items-center">
      
 <img
  src="/logo1.png"
  alt="Mara ResumeIQ"
  className="
  w-[260px]
md:w-[400px]

  object-contain

  relative
  z-10

  brightness-125
contrast-125

  drop-shadow-none

  hover:scale-[1.02]

transition-all
duration-700
  "
/>
<p className="
mt-4

text-center

text-white
text-2xl
md:text-4xl

font-['DM_Sans']
font-bold

tracking-tight
">
Resume Intelligence Platform
</p>

  <p className="
mt-4

max-w-xl

text-center
text-slate-400

text-base

leading-7
font-['DM_Sans']
font-medium
">
Transforming resumes into actionable career insights
through AI-powered analysis and intelligent recommendations.
</p>
      <div className="
mt-10

w-[350px]
h-[6px]

bg-[#0b1220]/70

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

    </div>

  );

}