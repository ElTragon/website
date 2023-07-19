/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/*.{js,jsx,ts,tsx}",
    +"./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      text: "#040703",
      background: "#0a192f",
      "primary-button": "#65c87c",
      "secondary-button": "#c7ebe1",
      accent: "#359279",
      Navy: "#0a192f",
      lightNavy: "#112240",
      lightestNavy: "#233554",
      slate: "#8892b0",
      lightSlate: "#a8b2d1",
      lightestSlate: "#ccd6f6",
      white: "#e6f1ff",
      green: "#64ffda",
    },
    extend: {},
  },
  plugins: [],
}
