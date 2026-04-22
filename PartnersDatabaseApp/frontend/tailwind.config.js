/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clay: {
          brand: '#800020', // ARTTU Dark Red
          bg: '#f0f2f5',
          light: '#ffffff',
        }
      },
      boxShadow: {
        'clay-sm': '8px 8px 16px rgba(0,0,0,0.1), inset -6px -6px 12px rgba(255,255,255,0.8), inset 6px 6px 12px rgba(0,0,0,0.05)',
        'clay-md': '12px 12px 24px rgba(0,0,0,0.1), inset -8px -8px 16px rgba(255,255,255,0.8), inset 8px 8px 16px rgba(0,0,0,0.05)',
        'clay-lg': '20px 20px 40px rgba(0,0,0,0.12), inset -12px -12px 24px rgba(255,255,255,0.8), inset 12px 12px 24px rgba(0,0,0,0.05)',
        'clay-inset': 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.8)',
      },
      borderRadius: {
        'clay': '25px',
      }
    },
  },
  plugins: [],
}
