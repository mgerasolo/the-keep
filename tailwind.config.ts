import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // The Keep dark theme (VS Code inspired)
        background: {
          DEFAULT: '#1a1a1a',
          secondary: '#252525',
          tertiary: '#2d2d2d',
        },
        foreground: {
          DEFAULT: '#ffffff',
          secondary: '#888888',
          muted: '#666666',
        },
        accent: {
          DEFAULT: '#569cd6',
          hover: '#6bb3e8',
        },
        border: {
          DEFAULT: '#3d3d3d',
          focus: '#569cd6',
        },
        // Activity bar colors
        activity: {
          background: '#1e1e1e',
          icon: '#858585',
          'icon-active': '#ffffff',
        },
        // Status colors
        success: '#4ade80',
        warning: '#fbbf24',
        error: '#ef4444',
        info: '#60a5fa',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.8125rem', { lineHeight: '1.25rem' }],
        base: ['0.875rem', { lineHeight: '1.5rem' }],
      },
      spacing: {
        'activity-bar': '48px',
        'sidebar-min': '180px',
        'sidebar-max': '400px',
        'tab-height': '36px',
        'status-bar': '24px',
      },
    },
  },
  plugins: [],
};

export default config;
