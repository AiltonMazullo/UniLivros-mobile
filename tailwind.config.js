/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Paleta do projeto
        background: '#FFFFFF',
        brand: {
          DEFAULT: '#5A211A', // títulos, texto principal
        },
        primary: {
          DEFAULT: '#F29F05', // botão principal
          dark: '#F27405', // estado pressionado/destaque
        },
        surface: '#FFF2F9', // superfícies claras
        cream: '#FBECD5', // cartão/fundo destacado
      },
    },
  },
  plugins: [],
};
