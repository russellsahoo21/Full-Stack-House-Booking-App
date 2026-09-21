/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0F0F14',
          50: '#F5F5F8',
          100: '#E6E6ED',
          200: '#CBCBD8',
          300: '#9F9FB7',
          400: '#6C6C8B',
          500: '#464663',
          600: '#2E2E44',
          700: '#1E1E2D',
          800: '#151520',
          900: '#0F0F14',
          950: '#08080C',
        },
        warm: {
          50: '#FDFBF9',
          100: '#FAF7F2',
          200: '#F4ECE1',
          300: '#E8DCCB',
          400: '#D5C4AB',
          500: '#B8A081',
          600: '#8E775B',
        },
        sunset: {
          coral: '#FF5A5F',
          amber: '#FFB347',
          magenta: '#E83E8C',
        },
        border: 'hsl(var(--border) / <alpha-value>)',
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'lift': '0 20px 40px -15px rgba(0, 0, 0, 0.12)',
        'lift-dark': '0 20px 40px -15px rgba(0, 0, 0, 0.6)',
        'glow-sunset': '0 0 28px -4px rgba(255, 90, 95, 0.35)',
      },
      backgroundImage: {
        'sunset-gradient': 'linear-gradient(135deg, #FF5A5F 0%, #FFB347 50%, #E83E8C 100%)',
        'sunset-gradient-horizontal': 'linear-gradient(90deg, #FF5A5F 0%, #FFB347 50%, #E83E8C 100%)',
        'sunset-gradient-subtle': 'linear-gradient(135deg, rgba(255,90,95,0.12) 0%, rgba(255,179,71,0.12) 50%, rgba(232,62,140,0.12) 100%)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'marquee': 'marquee 35s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
