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
          900: '#0B132B',
          800: '#1C2541',
          700: '#233154',
          600: '#3A506B'
        },
        brand: {
          blue: '#1D4ED8',
          royal: '#2563EB',
          purple: '#7C3AED',
          accent: '#4F46E5',
          light: '#F8FAFC'
        }
      }
    },
  },
  plugins: [],
}
