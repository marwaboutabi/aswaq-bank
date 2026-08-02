/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aswaq: {
          green: '#0b1f4b',
          'green-light': '#1d4fd8',
          gold: '#38bdf8',
          beige: '#eef3fc',
        }
      },
    },
  },
  plugins: [],
}