/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./index.tsx",
    "./App.tsx",
    "./constants.tsx",
    "./constants/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./contexts/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        surface: 'var(--surface)',
        text: 'var(--text)',
        muted: 'var(--text-muted)',
        border: 'var(--border)',
        'btn-bg': 'var(--btn-bg)',
        'btn-text': 'var(--btn-text)',
        // Brand scale derived from the logo mark (jade #4DBC9F = 400).
        // Every step is overridden so no default Tailwind cyan leaks through.
        // Text on white: 600+ (600 = 5.19:1). Text on black: 500 and lighter.
        cyan: {
          50: '#EEFAF6',
          100: '#D5F3EA',
          200: '#AEE7D6',
          300: '#8FE3CB',
          400: '#4DBC9F',
          500: '#3FA88D',
          600: '#247A65',
          700: '#1F6655',
          800: '#1D574A',
          900: '#16433A',
          950: '#0B2620',
        },
        // Logo leaf green, the gradient's start stop.
        emerald: {
          300: '#8FCB98',
          400: '#60B46D',
          500: '#4E9A5A',
          600: '#3F7F4A',
        },
        // Violet is retired (not in the logo); existing usages render as jade.
        violet: {
          100: '#D5F3EA',
          400: '#4DBC9F',
          500: '#3FA88D',
          600: '#247A65',
        },
      }
    }
  },
  plugins: [],
}
