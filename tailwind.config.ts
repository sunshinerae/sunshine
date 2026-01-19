import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette — The Sunshine Effect
        // Primary
        'sunshine-gold': '#F6C453',     // Sunshine Gold
        'sunshine-plum': '#6E054D',     // Deep Plum
        // Neutrals
        'sunshine-cocoa': '#240D01',    // Cocoa Ink (text)
        'sunshine-cream': '#FFF6E9',    // Warm Cream (background)
        'sunshine-sand': '#E9D7C7',     // Sand (borders)
        'sunshine-rose': '#F3D0DB',     // Soft Rose (accent)
        // sun-* aliases (used in pages)
        sun: {
          plum: '#6E054D',
          cocoa: '#240D01',
          cream: '#FFF6E9',
          paper: '#FFFFFF',
          sand: '#E9D7C7',
          gold: '#F6C453',
          rose: '#F3D0DB',
          coral: '#D4856A',    // warm accent (golden hour sections)
          leaf: '#9B7B9B',     // cool accent (lunar room - muted plum)
        },
        // sunshine-* aliases (used in components)
        'sunshine-purple': '#6E054D',
        'sunshine-yellow': '#F6C453',
        'sunshine-white': '#FFF6E9',
        'sunshine-brown': '#240D01',
        'sunshine-orange': '#F6C453',
        'sunshine-blue': '#F3D0DB',
        border: "var(--color-border)",
        input: "var(--color-input)",
        ring: "var(--color-ring)",
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          foreground: "var(--color-secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--color-destructive)",
          foreground: "var(--color-destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--color-muted)",
          foreground: "var(--color-muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          foreground: "var(--color-accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--color-popover)",
          foreground: "var(--color-popover-foreground)",
        },
        card: {
          DEFAULT: "var(--color-card)",
          foreground: "var(--color-card-foreground)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        pill: "9999px",
      },
      fontFamily: {
        headline: ["var(--font-headline)", "Belvare", "Times New Roman", "serif"],
        subhead: ["var(--font-subhead)", "Laro Soft", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "Poppins", "system-ui", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
