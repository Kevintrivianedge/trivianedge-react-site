/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./index.tsx",
    "./App.tsx",
    "./constants.tsx",
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
        // Override built-in cyan with brand teal-green (#00C49A)
        cyan: {
          400: '#00C49A',
          500: '#00A882',
          600: '#008C6B',
          700: '#007158',
        },
      }
    }
  },
  plugins: [],
}
