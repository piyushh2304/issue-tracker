import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      colors: {
        brand: 'hsl(var(--brand))'
      }
    }
  },
  plugins: []
} satisfies Config
