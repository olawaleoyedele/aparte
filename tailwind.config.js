/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  extend: {
    textShadow: {
      stroke: '2px 2px 0px rgba(0,0,0,0.2)',
    },
    fontFamily: {
        sans: ['Helvetica', 'Arial', 'sans-serif'],
      },
  },
},
plugins: [
  function ({ addUtilities }) {
    addUtilities({
      '.text-stroke': {
        '-webkit-text-stroke': '1px #f97316',
      },
    });
  },
],
};
