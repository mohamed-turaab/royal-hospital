// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        accent: "var(--color-accent)",
        secondary: "var(--color-secondary)",
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
        navyBlue: {
          DEFAULT: "#071B34",
          50: "#f0f4f9",
          100: "#d9e2ee",
          200: "#b3c5dd",
          300: "#8ca8cc",
          400: "#668bbb",
          500: "#406eab",
          600: "#335889",
          700: "#264267",
          800: "#192c45",
          900: "#0d1623",
          950: "#071B34",
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
    }
  },
  plugins: [],
  // Custom utility for gradient mesh background used in AdminHero
  // Add below via @layer utilities in a global CSS file or directly here if using JIT
};
