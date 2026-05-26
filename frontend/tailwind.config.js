/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Neon palette
        neon: {
          cyan:    '#00FFFF',
          blue:    '#0066FF',
          purple:  '#7B2FFF',
          pink:    '#FF2FFF',
          green:   '#00FF88',
          yellow:  '#FFE600',
          orange:  '#FF6B00',
        },
        // Dark surfaces
        dark: {
          50:  '#1A1A2E',
          100: '#16213E',
          200: '#0F3460',
          300: '#0D0D1A',
          400: '#080812',
          500: '#050509',
        },
        // Glass surfaces
        glass: {
          white:  'rgba(255,255,255,0.05)',
          border: 'rgba(255,255,255,0.08)',
          hover:  'rgba(255,255,255,0.10)',
        },
        // Brand
        brand: {
          50:  '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        accent: {
          cyan:   '#06B6D4',
          purple: '#8B5CF6',
          pink:   '#EC4899',
          green:  '#10B981',
        }
      },
      fontFamily: {
        display: ['"Exo 2"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
        cyber:   ['"Orbitron"', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial':   'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-mesh':     'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'hero-gradient':     'linear-gradient(135deg, #0F0F23 0%, #1A1A3E 50%, #0D0D1A 100%)',
        'card-gradient':     'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        'neon-gradient':     'linear-gradient(90deg, #00FFFF, #7B2FFF, #FF2FFF)',
        'skill-gradient':    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'scan-gradient':     'linear-gradient(180deg, transparent 0%, rgba(0,255,255,0.15) 50%, transparent 100%)',
      },
      boxShadow: {
        'neon-cyan':   '0 0 20px rgba(0,255,255,0.5), 0 0 40px rgba(0,255,255,0.2)',
        'neon-purple': '0 0 20px rgba(123,47,255,0.5), 0 0 40px rgba(123,47,255,0.2)',
        'neon-pink':   '0 0 20px rgba(255,47,255,0.5), 0 0 40px rgba(255,47,255,0.2)',
        'neon-green':  '0 0 20px rgba(0,255,136,0.5), 0 0 40px rgba(0,255,136,0.2)',
        'neon-blue':   '0 0 20px rgba(0,102,255,0.5), 0 0 40px rgba(0,102,255,0.2)',
        'glass':       '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
        'glass-lg':    '0 16px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
        'card':        '0 4px 24px rgba(0,0,0,0.3)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'spin-slow':      'spin 8s linear infinite',
        'pulse-slow':     'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow':    'bounce 3s infinite',
        'glow':           'glow 2s ease-in-out infinite alternate',
        'scan':           'scan 3s linear infinite',
        'float':          'float 6s ease-in-out infinite',
        'shimmer':        'shimmer 2.5s linear infinite',
        'gradient-x':     'gradient-x 4s ease infinite',
        'gradient-y':     'gradient-y 4s ease infinite',
        'gradient-xy':    'gradient-xy 4s ease infinite',
        'typing':         'typing 3.5s steps(40, end)',
        'blink-caret':    'blink-caret .75s step-end infinite',
        'fade-in':        'fadeIn 0.6s ease forwards',
        'slide-up':       'slideUp 0.5s ease forwards',
        'slide-in-right': 'slideInRight 0.5s ease forwards',
        'matrix':         'matrix 20s linear infinite',
        'ping-slow':      'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        glow: {
          '0%':   { boxShadow: '0 0 5px rgba(0,255,255,0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0,255,255,0.8), 0 0 40px rgba(0,255,255,0.4)' }
        },
        scan: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-20px)' }
        },
        shimmer: {
          '0%':   { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' }
        },
        'gradient-x': {
          '0%, 100%': { backgroundSize: '200% 200%', backgroundPosition: 'left center' },
          '50%':      { backgroundSize: '200% 200%', backgroundPosition: 'right center' }
        },
        fadeIn: {
          '0%':   { opacity: 0 },
          '100%': { opacity: 1 }
        },
        slideUp: {
          '0%':   { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
        slideInRight: {
          '0%':   { opacity: 0, transform: 'translateX(20px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' }
        },
        typing: {
          'from': { width: '0' },
          'to':   { width: '100%' }
        },
        'blink-caret': {
          'from, to': { borderColor: 'transparent' },
          '50%':      { borderColor: '#00FFFF' }
        },
        matrix: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' }
        }
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      screens: {
        'xs': '475px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      }
    },
  },
  plugins: [],
}
 