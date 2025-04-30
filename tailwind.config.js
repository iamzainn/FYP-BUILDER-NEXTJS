/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'blob': 'blob 7s infinite',
        'blob-slow': 'blob-slow 15s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        pulse: {
          '0%': { boxShadow: '0 0 0 0 rgba(79, 70, 229, 0.4)' },
          '70%': { boxShadow: '0 0 0 10px rgba(79, 70, 229, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(79, 70, 229, 0)' },
        },
      },
    },
  },
  plugins: [],
} 