/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: '#0070f3',
        gray: '#f1f1f1',

      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
