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
        // Backgrounds (parch scale)
        background: '#F7F3EE',
        'parch-2': '#EDE7DF',
        'parch-3': '#E2D9CE',
        surface: '#FFFFFF',
        // Text (ink scale)
        primary: '#16120E',
        'ink-2': '#4A4238',
        'ink-3': '#8C7E72',
        'ink-4': '#B8AFA7',
        // Accent (ember — warm orange-red)
        accent: '#C0460A',
        'accent-mid': '#E07050',
        'accent-light': '#F5E4DA',
        // Borders
        'border-subtle': '#D8CEC3',
        'border-strong': '#C0B3A4',
        // Warmth indicators
        hot: '#EF4444',
        warm: '#F59E0B',
        cooling: '#3B82F6',
        cold: '#6B7280',
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
        mono: ['DM Mono', 'monospace'],
      },
      borderRadius: {
        card: '10px',
      },
      boxShadow: {
        card: '0 1px 4px rgba(22,18,14,0.08)',
        'card-md': '0 4px 20px rgba(22,18,14,0.10)',
        'card-lg': '0 12px 40px rgba(22,18,14,0.14)',
      },
      minHeight: {
        touch: '44px',
      },
      minWidth: {
        touch: '44px',
      },
    },
  },
  plugins: [],
}
export default config
