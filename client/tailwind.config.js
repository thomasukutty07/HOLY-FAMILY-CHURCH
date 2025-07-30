/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        border: 'hsl(var(--border))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
      },
      fontFamily: {
        compacta: ['var(--font-compacta)'],
        benzin: ['var(--font-benzin)'],
        europa: ['var(--font-europa)'],
        corporates: ['var(--font-corporates)'],
      },
    },
  },
  plugins: [],
} 