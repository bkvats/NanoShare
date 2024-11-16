/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 2s ease-in-out infinite', // Slows down to a 3-second duration
      },
    },
  },
  plugins: [],
}