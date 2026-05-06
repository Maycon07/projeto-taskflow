/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#e0eaff',
          200: '#c7d7fe',
          300: '#a5b9fd',
          400: '#8194fb',
          500: '#6172f8',
          600: '#4a53ef',
          700: '#3d42d5',
          800: '#3337ac',
          900: '#2e3388',
          950: '#1c1f54',
        },
        surface: {
          50:  '#f8f9fc',
          100: '#f1f3f9',
          200: '#e4e8f2',
          300: '#d2d8e8',
          400: '#b0bbd4',
          500: '#8896b8',
          600: '#5e6f94',
          700: '#435178',
          800: '#2d3a5c',
          900: '#1a2340',
          950: '#0f1528',
        }
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.08)',
        'card-hover': '0 4px 8px rgba(0,0,0,.08), 0 12px 32px rgba(0,0,0,.12)',
        'glow': '0 0 0 3px rgba(97,114,248,.25)',
      },
      animation: {
        'slide-in': 'slideIn .2s ease-out',
        'fade-in': 'fadeIn .15s ease-out',
      },
      keyframes: {
        slideIn: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
