import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#1e30f3',
        },
        accent: {
          pink: '#e21e80',
        },
        text: {
          gray: '#6c757d',
        },
        dark: {
          gray: '#343a40',
        },
        light: {
          gray: '#f8f9fa',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #1e30f3 0%, #e21e80 100%)',
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config




