/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#13151f',
          card: '#1a1f2d',
          hover: '#2d3343',
        }
      },
    },
  },
  plugins: [],
} 