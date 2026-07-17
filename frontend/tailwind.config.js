/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1B2A4A",
          light: "#2C3E63",
          soft: "#EEF1F7",
        },
        gold: {
          DEFAULT: "#E8A33D",
          dark: "#C9862A",
        },
        paper: "#F7F5F0",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        bounce1: {
          "0%, 60%, 100%": { transform: "translateY(0)", opacity: "0.5" },
          "30%": { transform: "translateY(-4px)", opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        bounce1: "bounce1 1.2s infinite ease-in-out",
        fadeUp: "fadeUp 0.25s ease-out",
      },
    },
  },
  plugins: [],
};
