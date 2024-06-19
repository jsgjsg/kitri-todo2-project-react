import flowbitePlugin from 'flowbite/plugin'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modes/folwbite/**/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [flowbitePlugin],
}

