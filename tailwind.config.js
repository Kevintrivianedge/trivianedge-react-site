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
        // Status colours from the colour system, kept outside the brand's
        // 129-180° hue band so "success" never reads as a brand accent.
        // 400 = spec value (on dark); 600/700 are AA text shades on white.
        emerald: { 300: '#BDE69B', 400: '#9BD86A', 500: '#86C653', 600: '#5C8F36', 700: '#4A7A2A' },
        green:   { 300: '#BDE69B', 400: '#9BD86A', 500: '#86C653', 600: '#5C8F36', 700: '#4A7A2A' },
        red:     { 300: '#F8A59D', 400: '#F47C70', 500: '#E8604F', 600: '#C0392E', 700: '#A13027' },
        amber:   { 300: '#F6CC7A', 400: '#F2B544', 500: '#E09E24', 600: '#A8720C', 700: '#8A5E0A' },
        yellow:  { 300: '#F6CC7A', 400: '#F2B544', 500: '#E09E24', 600: '#A8720C', 700: '#8A5E0A' },
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
