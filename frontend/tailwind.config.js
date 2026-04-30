/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
      colors: {
        dark: {
          950: '#050a18',
          900: '#0a1128',
          850: '#0d1730',
          800: '#111d3a',
          750: '#152347',
          700: '#1a2d5a',
          600: '#243a6e',
          500: '#2e4882',
        },
        brand: {
          50: '#e8f0ff',
          100: '#d4e4ff',
          200: '#a8c8ff',
          300: '#7aadff',
          400: '#4d91ff',
          500: '#2176ff',
          600: '#1a5ecc',
          700: '#144799',
          800: '#0d2f66',
          900: '#071833',
        },
        accent: {
          purple: '#8b5cf6',
          teal: '#14b8a6',
          cyan: '#06b6d4',
          pink: '#ec4899',
          amber: '#f59e0b',
        },
        glass: {
          white: 'rgba(255, 255, 255, 0.05)',
          light: 'rgba(255, 255, 255, 0.08)',
          medium: 'rgba(255, 255, 255, 0.12)',
          heavy: 'rgba(255, 255, 255, 0.18)',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-gradient': 'linear-gradient(135deg, #0a1128 0%, #111d3a 25%, #152347 50%, #1a2d5a 75%, #0a1128 100%)',
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.2)',
        'glass-lg': '0 8px 40px rgba(0, 0, 0, 0.3)',
        'glow-brand': '0 0 20px rgba(33, 118, 255, 0.3)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-teal': '0 0 20px rgba(20, 184, 166, 0.3)',
        'card': '0 2px 20px rgba(0, 0, 0, 0.15)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.25)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient-flow': 'gradient-flow 3s ease infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 10px rgba(33, 118, 255, 0.3)' },
          '50%': { opacity: 0.8, boxShadow: '0 0 30px rgba(33, 118, 255, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'gradient-flow': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
