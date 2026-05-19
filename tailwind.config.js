/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./frontend/index.html", "./frontend/src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        royalBlue: {
          DEFAULT: "#1b75bb",
          50: "#e8f1f9",
          100: "#c5dcf0",
          200: "#9ec5e5",
          300: "#6eaadb",
          400: "#4793d0",
          500: "#1b75bb",
          600: "#1766a5",
          700: "#12538a",
          800: "#0d3f6b",
          900: "#082c4d",
          950: "#041a2f",
        },
        royalYellow: {
          DEFAULT: "#fdb913",
          50: "#fff8e1",
          100: "#ffedb3",
          200: "#ffe082",
          300: "#ffd34f",
          400: "#fdc82a",
          500: "#fdb913",
          600: "#e5a60f",
          700: "#c48e0b",
          800: "#a37608",
          900: "#7a5804",
          950: "#523b02",
        },
      },
    },
  },
  plugins: [],
};
