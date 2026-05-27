/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a', // Deep charcoal/black
        surface: 'rgba(255, 255, 255, 0.05)', // For glass panels
      }
    },
  },
  plugins: [],
}