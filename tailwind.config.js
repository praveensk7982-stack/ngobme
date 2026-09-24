/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0f1e3d',
          800: '#16284e',
          700: '#1e3461',
        },
        brand: {
          blue: '#1e5fbf',
          hover: '#164aa0',
          light: '#eef4ff',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        handwriting: ['Caveat', 'cursive', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
