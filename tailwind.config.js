/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f8',
          100: '#dce4ed',
          200: '#b8c8db',
          300: '#8ba6c0',
          400: '#5e7da0',
          500: '#3d5d80',
          600: '#2d4a66',
          700: '#213a52',
          800: '#15273a',
          900: '#0f1e2e',
          950: '#0a1521',
        },
        gold: {
          50: '#fbf7f0',
          100: '#f5ebd9',
          200: '#ebd5b3',
          300: '#dfbd87',
          400: '#cfa660',
          500: '#c5a572',
          600: '#b08d57',
          700: '#8f7045',
          800: '#6f5636',
          900: '#503e28',
        },
        cream: {
          50: '#fefdfb',
          100: '#faf9f6',
          200: '#f5f3ef',
          300: '#eeebd8',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      maxWidth: {
        '8xl': '88rem',
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
