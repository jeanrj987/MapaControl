/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Exo 2"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        exo: ['"Exo 2"', 'sans-serif'],
      },
      colors: {
        controlsoft: {
          bg: '#151B23',
          dark: '#1D242E',
          card: '#202834',
          cardHover: '#283342',
          border: '#2E3A4B',
          borderLight: '#3D4D63',
          green: '#95B955',
          greenHover: '#A7C96B',
          greenMuted: '#95B95533',
        },
        region: {
          norte: '#0091FF',
          leste: '#FF7F27',
          oeste: '#22B14C',
          sorriso: '#FFF200',
        }
      }
    },
  },
  plugins: [],
}
