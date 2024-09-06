/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      flexGrow: {
        2: '2',
        3: '3',
      },
      colors: {
        'gray-navbar': '#f8f9fc',
        'gray-lightest': '#f9fafb',
        'gray-subheader': '#98A2B3',
        'gray-background': '#F2F4F7',
        secondary: '#333F53',
        'yt-card': '#293056',
        'primary-btn': {
          100: '#D8B4FE',
          200: '#C084F5',
          300: '#A855F7',
          400: '#9333EA',
          500: '#7F56D9', // Base Color
          600: '#6B21A8',
        },
      },
      fontFamily: {
        inter: ['inter', 'sans-serif'], // Add Inter font
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-thin': {
          scrollbarWidth: 'thin',
          scrollbarColor: '#D0D5DD #F9FAFB',
        },
        '.scrollbar-webkit': {
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#D0D5DD',
            marginTop: '5px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#F9FAFB',
            borderRadius: '100vw',
            width: '6px',
          },
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};
