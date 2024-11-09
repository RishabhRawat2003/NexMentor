/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'custom': '0px 4px 50px 10px #0000001A',
      },
      fontFamily: {
        'cg-times': ['CG Times', 'serif'], // Add a fallback like 'serif'
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(180deg, rgba(0, 146, 219, 0.8), rgba(0, 23, 35, 0.8))',
      },
    },
  },
  plugins: [],
}

