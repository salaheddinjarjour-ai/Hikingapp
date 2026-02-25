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
        primary: {
          DEFAULT: '#13ec25',
          dim: '#0ea61a',
          light: '#22e062',
          dark: '#0ea520',
        },
        neon: {
          DEFAULT: '#39ff14',
          accent: '#39ff14',
        },
        background: {
          dark: '#050505',
          DEFAULT: '#102210',
          light: '#f6f8f6',
        },
        surface: {
          dark: '#1a1d1a',
          darker: '#0a0c0a',
          light: '#233b23',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 10px rgba(0, 255, 65, 0.3), 0 0 20px rgba(0, 255, 65, 0.1)',
        'deep': '0 10px 30px -5px rgba(0, 0, 0, 0.8)',
        'glow': '0 0 15px rgba(0,255,65,0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { opacity: '0', transform: 'translate(-50%, 40px)' },
          '100%': { opacity: '1', transform: 'translate(-50%, 0)' },
        },
      },
    },
  },
  plugins: [],
}
