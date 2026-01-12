export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#136dec",
        "background-light": "#f6f7f8",
        "background-dark": "#101822",
        "foreground-light": "#ffffff",
        "foreground-dark": "#182431",
        "text-light": "#111418",
        "text-dark": "#f0f2f4",
        "text-secondary-light": "#617289",
        "text-secondary-dark": "#94a3b8",
        "border-light": "#e2e8f0",
        "border-dark": "#334155",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
      }
    },
  },
  plugins: [],
};
