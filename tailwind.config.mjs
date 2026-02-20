import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          light: '#f7f7f5',
          dark: '#0d1117',
        },
      },
      fontFamily: {
        sans: ['"Manrope"', '"Avenir Next"', '"Segoe UI"', 'sans-serif'],
        serif: ['"Source Serif 4"', '"Iowan Old Style"', 'serif'],
      },
    },
  },
  plugins: [typography],
};
