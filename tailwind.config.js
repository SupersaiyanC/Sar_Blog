/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm earthy tones (kept for backwards compatibility)
        sand: {
          50: '#fdfbf7',
          100: '#f8f3eb',
          200: '#f0e6d6',
          300: '#e6d4bc',
          400: '#d9bc9a',
          500: '#c9a379',
          600: '#b88a5e',
          700: '#9d7047',
          800: '#7d5a39',
          900: '#5f462d',
        },
        terracotta: {
          50: '#fdf6f3',
          100: '#f9e8e0',
          200: '#f3d1c1',
          300: '#e9af94',
          400: '#dd8865',
          500: '#d16943',
          600: '#b95436',
          700: '#9a4330',
          800: '#7d3a2d',
          900: '#643128',
        },
        sage: {
          50: '#f7f8f6',
          100: '#e8ebe6',
          200: '#d4dace',
          300: '#b5c2ad',
          400: '#92a488',
          500: '#738869',
          600: '#5a6d53',
          700: '#485742',
          800: '#3a4636',
          900: '#2f3a2d',
        },
        // Warm cream page base
        cream: '#EEEAE4',
        // Terracotta hover accent — used only on interactive hover states
        'terracotta-warm': {
          DEFAULT: '#C4714A',
          dark: '#a85c38',
        },
        // Nature-inspired palette — mist, sea salt, alpine sage
        mist: {
          50: '#f4f6f7',
          100: '#e8ecee',
          200: '#d3dce0',
          300: '#C2CAD0',
          400: '#a5b3bb',
          500: '#8799a2',
          600: '#6a8089',
          700: '#536670',
          800: '#3e4e54',
          900: '#293539',
        },
        'sea-salt': {
          50: '#eef3f5',
          100: '#d9e5ea',
          200: '#c0d3db',
          300: '#97AFB9',
          400: '#7a98a5',
          500: '#60838f',
          600: '#4d6e7b',
          700: '#3c5764',
          800: '#2d424c',
          900: '#1e2e35',
        },
        'alpine-sage': {
          50: '#f1f4f1',
          100: '#dde4de',
          200: '#c3cec6',
          300: '#8A9A8E',
          400: '#74847a',
          500: '#5e6f63',
          600: '#4b594f',
          700: '#3a463e',
          800: '#2a342d',
          900: '#1b221e',
        },
      },
      fontFamily: {
        sans: ['Georgia', 'Times New Roman', 'serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
