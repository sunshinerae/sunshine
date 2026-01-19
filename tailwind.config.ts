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
        // New sun-* brand palette (warm, cozy, calm)
        sun: {
          plum: '#6E054D',    // buttons, accents, highlights
          cocoa: '#240D01',   // headlines, body text
          cream: '#FFF7F1',   // main background
          paper: '#FFFFFF',   // cards
          sand: '#F0E4DA',    // borders, subtle sections
          gold: '#F6C453',    // highlights, warmth
          coral: '#F28C7D',   // gentle emphasis
          leaf: '#2F7A5B',    // success states
        },
        // Legacy palette (being phased out)
        'sunshine-purple': '#6E054D',
        'sunshine-orange': '#D4510B',
        'sunshine-yellow': '#FFC019',
        'sunshine-blue': '#95D7E6',
        'sunshine-white': '#FCF6F2',
        'sunshine-brown': '#240D01',
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
