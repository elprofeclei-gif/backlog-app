/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Definimos los colores oficiales de la app
        primary: {
          DEFAULT: '#2563EB', // blue-600
          hover: '#1D4ED8', // blue-700
        },
        danger: {
          DEFAULT: '#EF4444', // red-500
          hover: '#DC2626', // red-600
        },
      },
    },
  },
  plugins: [],
};
