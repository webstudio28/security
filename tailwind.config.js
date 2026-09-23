/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{njk,html,md,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Sofia Sans"', "system-ui", "sans-serif"],
        display: ['"Sofia Sans Condensed"', '"Sofia Sans"', "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#C9A227",
          dark: "#A8861F",
          deeper: "#1A1D21",
          soft: "#2A2E33",
          mist: "#23272C",
        },
        ink: {
          DEFAULT: "#E8EAED",
          muted: "#A8ADB5",
          faint: "#7A8088",
        },
      },
      maxWidth: {
        site: "80rem",
      },
      boxShadow: {
        card: "0 3px 15px rgba(0, 0, 0, 0.28)",
        lift: "0 18px 42px rgba(0, 0, 0, 0.4)",
      },
    },
  },
  plugins: [],
};
