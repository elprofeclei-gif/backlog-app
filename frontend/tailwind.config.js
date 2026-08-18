/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // <-- Esto es crucial
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
