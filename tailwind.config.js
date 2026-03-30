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
      }
    }
  },
  plugins: [],
}
