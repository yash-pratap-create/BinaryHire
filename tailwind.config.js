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
        brand: {
          50:  '#f0f4ff',
          100: '#e0eaff',
          200: '#c7d8ff',
          300: '#a5bfff',
          400: '#8099fb',
          500: '#6272f5',
          600: '#4f55e8',
          700: '#4343cc',
          800: '#3737a4',
          900: '#323382',
        },
        surface: {
          DEFAULT: '#ffffff',
          dark: '#0f1117',
        },
        panel: {
          DEFAULT: '#f8fafc',
          dark: '#1a1d27',
        },
        card: {
          DEFAULT: '#ffffff',
          dark: '#212433',
        },
        border: {
          DEFAULT: '#e2e8f0',
          dark: '#2e3147',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-16px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px 0 rgba(0,0,0,0.1)',
        'glow': '0 0 24px -4px rgba(98, 114, 245, 0.4)',
      },
    },
  },
  plugins: [],
}
