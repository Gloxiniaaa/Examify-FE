/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./styles/**/*.css",
    "./src/**/*.{html,js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',    // blue-600 equivalent
        secondary: '#1e40af',  // darker blue for hover states
        accent: '#dbeafe',     // light blue for backgrounds
        neutral: {
          50: '#f9fafb',      // light gray
          200: '#e5e7eb',     // medium gray
          600: '#2C3930',
          800: '#1f2937'      // dark gray for footer
        }
      },
    },
  },
  plugins: [],
}