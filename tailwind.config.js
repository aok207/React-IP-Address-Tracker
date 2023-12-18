/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "desktop-pattern": "url('/images/pattern-bg-desktop.png')",
        "mobile-pattern": "url('/images/pattern-bg-mobile.png')"
      },
      fontFamily: {
        rubik: ['"Rubik"', ...defaultTheme.fontFamily.sans]
      },
      fontSize: {
        "18px": "1.125rem"
      },
      colors: {
        "very-dark-gray": "#2B2B2B",
        "dark-gray": "#969696",
      }
    },
  },
  plugins: [],
}

