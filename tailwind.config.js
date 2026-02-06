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
        // Warm earthy tones
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
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-lora)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
