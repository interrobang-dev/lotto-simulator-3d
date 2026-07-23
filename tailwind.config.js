/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lotto: {
          yellow: '#fbc400',
          blue: '#69acec',
          red: '#ff7272',
          gray: '#aaa',
          green: '#b0d840',
        }
      }
    },
  },
  plugins: [],
}
