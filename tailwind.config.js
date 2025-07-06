/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Original MACS Brand Colors - Deep Blue, Amber/Gold, Orange
        macs: {
          blue: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#1e40af', // Primary deep blue (navigation)
            700: '#1d4ed8',
            800: '#1e3a8a',
            900: '#1e293b',
            950: '#0f172a'
          },
          amber: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b', // Primary amber/gold (Join as Creator)
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
            950: '#451a03'
          },
          orange: {
            50: '#fff7ed',
            100: '#ffedd5',
            200: '#fed7aa',
            300: '#fdba74',
            400: '#fb923c',
            500: '#f97316', // Primary orange (Connect Wallet, Buy Now)
            600: '#ea580c',
            700: '#c2410c',
            800: '#9a3412',
            900: '#7c2d12',
            950: '#431407'
          },
          gray: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
            950: '#030712'
          }
        },
        // Shadcn UI Colors with MACS theme integration
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        card: "hsl(var(--card) / <alpha-value>)",
        'card-foreground': "hsl(var(--card-foreground) / <alpha-value>)",
        popover: "hsl(var(--popover) / <alpha-value>)",
        'popover-foreground': "hsl(var(--popover-foreground) / <alpha-value>)",
        primary: "hsl(var(--primary) / <alpha-value>)",
        'primary-foreground': "hsl(var(--primary-foreground) / <alpha-value>)",
        secondary: "hsl(var(--secondary) / <alpha-value>)",
        'secondary-foreground': "hsl(var(--secondary-foreground) / <alpha-value>)",
        muted: "hsl(var(--muted) / <alpha-value>)",
        'muted-foreground': "hsl(var(--muted-foreground) / <alpha-value>)",
        accent: "hsl(var(--accent) / <alpha-value>)",
        'accent-foreground': "hsl(var(--accent-foreground) / <alpha-value>)",
        destructive: "hsl(var(--destructive) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        sidebar: "hsl(var(--sidebar) / <alpha-value>)",
        'sidebar-foreground': "hsl(var(--sidebar-foreground) / <alpha-value>)",
        'sidebar-primary': "hsl(var(--sidebar-primary) / <alpha-value>)",
        'sidebar-primary-foreground': "hsl(var(--sidebar-primary-foreground) / <alpha-value>)",
        'sidebar-accent': "hsl(var(--sidebar-accent) / <alpha-value>)",
        'sidebar-accent-foreground': "hsl(var(--sidebar-accent-foreground) / <alpha-value>)",
        'sidebar-border': "hsl(var(--sidebar-border) / <alpha-value>)",
        'sidebar-ring': "hsl(var(--sidebar-ring) / <alpha-value>)",
        // Charts with MACS colors
        'chart-1': "hsl(var(--chart-1) / <alpha-value>)",
        'chart-2': "hsl(var(--chart-2) / <alpha-value>)",
        'chart-3': "hsl(var(--chart-3) / <alpha-value>)",
        'chart-4': "hsl(var(--chart-4) / <alpha-value>)",
        'chart-5': "hsl(var(--chart-5) / <alpha-value>)"
      },
      borderColor: {
        DEFAULT: "hsl(var(--border) / <alpha-value>)"
      },
      borderRadius: {
        sm: "calc(var(--radius) - 4px)",
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 4px)"
      },
      fontFamily: {
        'gliker': ['Gliker', 'system-ui', 'sans-serif'],
        'heading': ['Gliker', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'artistic': ['Inter', 'system-ui', 'sans-serif']
      },
      fontSize: {
        'display': ['4rem', { lineHeight: '1.1', fontWeight: '800' }],
        'h1': ['3rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['2.25rem', { lineHeight: '1.3', fontWeight: '600' }],
        'h3': ['1.875rem', { lineHeight: '1.4', fontWeight: '600' }],
        'h4': ['1.5rem', { lineHeight: '1.5', fontWeight: '500' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }]
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      },
      boxShadow: {
        'macs-sm': '0 1px 2px 0 rgba(30, 64, 175, 0.05)',
        'macs-md': '0 4px 6px -1px rgba(30, 64, 175, 0.1), 0 2px 4px -1px rgba(30, 64, 175, 0.06)',
        'macs-lg': '0 10px 15px -3px rgba(30, 64, 175, 0.1), 0 4px 6px -2px rgba(30, 64, 175, 0.05)',
        'macs-xl': '0 20px 25px -5px rgba(30, 64, 175, 0.1), 0 10px 10px -5px rgba(30, 64, 175, 0.04)',
        'macs-glow': '0 0 20px rgba(30, 64, 175, 0.3)'
      },
      backgroundImage: {
        'gradient-macs': 'linear-gradient(135deg, #1e40af 0%, #f59e0b 50%, #f97316 100%)',
        'gradient-macs-subtle': 'linear-gradient(135deg, #f9fafb 0%, #eff6ff 50%, #fffbeb 100%)',
        'gradient-blue-amber': 'linear-gradient(135deg, #1e40af 0%, #f59e0b 100%)',
        'gradient-amber-orange': 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)'
      }
    }
  },
  plugins: [
    require('tailwindcss-animate')
  ]
}

