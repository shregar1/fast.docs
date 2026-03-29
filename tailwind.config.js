/** @type {import('tailwindcss').Config} */
/** Maps prose to site theme tokens (bold/headings were fixed gray-900 and ignored dark/light). */
const fmProseCss = {
  '--tw-prose-body': 'var(--fm-text-secondary)',
  '--tw-prose-headings': 'var(--fm-text)',
  '--tw-prose-lead': 'var(--fm-text-secondary)',
  '--tw-prose-links': 'var(--fm-text)',
  '--tw-prose-bold': 'var(--fm-text)',
  '--tw-prose-counters': 'var(--fm-text-muted)',
  '--tw-prose-bullets': 'var(--fm-text-muted)',
  '--tw-prose-hr': 'var(--fm-border)',
  '--tw-prose-quotes': 'var(--fm-text-muted)',
  '--tw-prose-quote-borders': 'var(--fm-border-hover)',
  '--tw-prose-captions': 'var(--fm-text-muted)',
  '--tw-prose-kbd': 'var(--fm-text)',
  '--tw-prose-kbd-shadows': 'var(--fm-border)',
  '--tw-prose-code': 'var(--fm-text)',
  '--tw-prose-pre-code': 'var(--fm-text-secondary)',
  '--tw-prose-pre-bg': 'var(--fm-code-bg)',
  '--tw-prose-th-borders': 'var(--fm-border)',
  '--tw-prose-td-borders': 'var(--fm-border)',
};

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Monochrome gray scale for backgrounds/surfaces
        gray: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
        // Semantic color names matching the theme
        fm: {
          bg: 'var(--fm-bg)',
          surface: 'var(--fm-surface)',
          'surface-raised': 'var(--fm-surface-raised)',
          border: 'var(--fm-border)',
          'border-hover': 'var(--fm-border-hover)',
          text: 'var(--fm-text)',
          'text-secondary': 'var(--fm-text-secondary)',
          'text-muted': 'var(--fm-text-muted)',
          accent: 'var(--fm-accent)',
          'accent-hover': 'var(--fm-accent-hover)',
        },
        // Keep primary/accent for method colors
        primary: {
          DEFAULT: '#3b82f6',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        success: '#22c55e',
        warning: '#eab308',
        error: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      typography: {
        DEFAULT: {
          css: fmProseCss,
        },
        lg: {
          css: fmProseCss,
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
