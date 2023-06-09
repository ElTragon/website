/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/*.{js,jsx,ts,tsx}",
    +"./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      text: "#020d03",
      background: "#ffffff",
      "primary-button": "#6258e4",
      "secondary-button": "#edfcee",
      accent: "#b8281e",
    },
    extend: {},
  },
  plugins: [],
}
