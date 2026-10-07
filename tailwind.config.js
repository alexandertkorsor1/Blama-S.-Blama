/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f4f7fa',
          100: '#e5ecf4',
          200: '#cddae9',
          300: '#a5bed9',
          400: '#759dc4',
          500: '#4e7eac',
          600: '#38638f',
          700: '#2c4e72',
          800: '#1e3854',
          850: '#14273d',
          900: '#0d1c2d',
          950: '#071220',
        },
        gold: {
          50: '#fdfbf5',
          100: '#f9f3e3',
          200: '#f2e5c2',
          300: '#e7d195',
          400: '#d7b764',
          500: '#c59d3d',
          600: '#a77f2b',
          700: '#846020',
          800: '#644819',
          900: '#483413',
          950: '#2b1e09',
        },
        cream: {
          50: '#fdfcf9',
          100: '#faf8f4',
          200: '#f5f1ea',
          300: '#ede6db',
          400: '#e2d8c7',
        },
        parchment: {
          50: '#fbf9f5',
          100: '#f6f2ea',
          200: '#eee7d8',
          300: '#e1d6bf',
          400: '#cfc0a3',
          800: '#2c2518',
          900: '#1d180f',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        editorial: ['"Newsreader"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        '8xl': '88rem',
        prose: '68ch',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease-out forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
