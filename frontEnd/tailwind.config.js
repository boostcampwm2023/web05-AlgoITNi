/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        Pretendard: ['Pretendard'],
      },
      keyframes: {
        render: {
          '0%': { transform: 'scale(0.5)' },
          '100%': { transform: 'scale(1)' },
        },
        remove: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0.2) ' },
        },
        toast: {
          '0%': { width: '100%' },
          '100%': { width: '0%' },
        },
      },
      animation: {
        render: 'render 0.2s',
        remove: 'remove 0.2s',
      },
      colors: {
        primary: 'white',
        secondary: '#132A37',
        base: '#F0F2F5',
        black: '#0C151C',
        'light-gray': '#D3D8E1',
        'point-red': '#EA4335',
        'point-blue': '#347DFF',
      },
      screens: {
        mobile: { min: '360px', max: '767px' },
        tablet: { max: '1024px' },
        pc: { min: '1024px' },
      },
    },
  },
  plugins: [],
};
