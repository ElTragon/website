/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/*.{js,jsx,ts,tsx}",
    +"./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      text: "#040703",
      background: "#e3f3dd",
      "primary-button": "#65c87c",
      "secondary-button": "#c7ebe1",
      accent: "#359279",
    },
    extend: {},
  },
  plugins: [],
}
