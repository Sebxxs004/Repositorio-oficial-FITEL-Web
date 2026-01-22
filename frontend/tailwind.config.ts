import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          red: '#FF1744',
          'red-dark': '#D50000',
          'red-light': '#FF5252',
        },
        secondary: {
          blue: '#2196F3',
          'blue-dark': '#1976D2',
          'blue-light': '#64B5F6',
        },
        neutral: {
          dark: '#1A1A1A',
          'dark-light': '#2D2D2D',
          gray: '#4A4A4A',
          'gray-light': '#E0E0E0',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(255, 23, 68, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 23, 68, 0.8), 0 0 30px rgba(33, 150, 243, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
