// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        accent: "var(--color-accent)",
        secondary: "var(--color-secondary)",
        royalBlue: "#1B75BB",
        navyBlue: "#071B34",
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
