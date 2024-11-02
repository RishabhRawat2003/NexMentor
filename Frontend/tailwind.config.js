/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
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

