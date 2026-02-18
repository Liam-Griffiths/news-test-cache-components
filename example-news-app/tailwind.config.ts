import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          50: '#f7f6f4',
          100: '#e8e6e1',
          200: '#d4d0c8',
          300: '#b5aea2',
          400: '#948b7a',
          500: '#787063',
          600: '#625b51',
          700: '#514b43',
          800: '#454039',
          900: '#3c3832',
          950: '#1e1c19',
        },
        accent: {
          DEFAULT: '#c45c26',
          light: '#e07a42',
          dark: '#9d4218',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
