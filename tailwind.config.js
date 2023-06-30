/** @type {import('tailwindcss').Config} */
// Color	Hex
// Navy	#0a192f #0a192f
// Light Navy	#112240 #112240
// Lightest Navy	#233554 #233554
// Slate	#8892b0 #8892b0
// Light Slate	#a8b2d1 #a8b2d1
// Lightest Slate	#ccd6f6 #ccd6f6
// White	#e6f1ff #e6f1ff
// Green	#64ffda #64ffda
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
    },
    extend: {},
  },
  plugins: [],
}
