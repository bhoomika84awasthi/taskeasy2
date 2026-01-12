/** @type {import('tailwindcss').Config} */
export default {
  darkMode: false, // ⬅ DISABLE DARK MODE COMPLETELY
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#136dec",
        "background-light": "#f6f7f8",
        "foreground-light": "#ffffff",
        "text-light": "#111418",
        "text-secondary-light": "#617289",
        "border-light": "#e2e8f0",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
