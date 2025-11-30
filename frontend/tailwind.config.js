/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#fc4d5c', // Rosa/rojo principal
        secondary: '#00a3e8', // Azul
        accent: '#ffcc00', // Amarillo
        success: '#01cc00', // Verde online
        warning: '#ff6600', // Naranja
        danger: '#ff3b3b', // Rojo peligro
        dark: '#000000', // Negro fondo
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

