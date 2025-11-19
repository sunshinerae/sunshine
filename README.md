# Clear Light Creative

> **Your creative vision, brought to light.**

A modern, performance-focused business website built for creative professionals and operational consultants. From logistics and event production to website development and growth automation—all wrapped in a clean, elegant interface.

**Live Demo:** [sunshine-snowy.vercel.app](https://sunshine-snowy.vercel.app)

---

## Overview

Clear Light Creative is a full-service consultancy offering:
- **Flawless Project & Event Production** – Logistics, touring, vendor coordination, and budget management
- **Beautiful Websites That Convert** – Fast, SEO-optimized sites built with modern frameworks
- **Smart Growth & Automation** – PPC campaigns, systems optimization, and analytics

This repository contains the company's Next.js-based marketing site, featuring dynamic case studies, service pages, contact forms, and responsive design.

---

## Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8?logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)

### Core Technologies
- **Framework:** Next.js 15 with App Router, React Server Components, and Turbopack
- **Language:** TypeScript with strict mode
- **Styling:** Tailwind CSS v4 (with `@tailwindcss/postcss`)
- **UI Components:** shadcn/ui component library
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod validation
- **Fonts:** DM Sans (body), DM Serif Display (headings)
- **Deployment:** Vercel with automatic deployments

### Key Features
- ⚡ **Lightning-fast performance** – Optimized with Next.js 15 and Turbopack
- 🎨 **Modern design system** – Built with Tailwind v4 and oklch color space
- 🌓 **Dark mode support** – Theme toggle with system preference detection
- 📱 **Fully responsive** – Mobile-first design with elegant desktop layouts
- ♿ **Accessible** – WCAG AA compliant with keyboard navigation
- 🔍 **SEO-optimized** – Dynamic sitemaps, robots.txt, and semantic markup
- 📊 **Form handling** – Server-side validation with React Hook Form + Zod
- 🎭 **Smooth animations** – Scroll-triggered reveals and micro-interactions

---

## Project Structure

```
/app
  /api/contact        # Form submission API route
  /about             # About page
  /contact           # Contact form with validation
  /services          # Services overview & detail pages
  /work              # Case study portfolio
  layout.tsx         # Root layout with navigation
  page.tsx           # Homepage
  globals.css        # Tailwind v4 theme configuration

/components
  /sections          # Reusable page sections (Hero, Pillars, ProofBar)
  /ui                # shadcn/ui components (20+ components)
  navigation.tsx     # Header with mobile drawer
  theme-provider.tsx # Dark mode context

/lib
  constants.ts       # Site config, navigation links
  /hooks             # Custom React hooks
```

---

## Getting Started

### Prerequisites
- Node.js 20+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/andretaki/sunshine.git
cd sunshine

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build for Production

```bash
npm run build
npm start
```

---

## Development

### Adding New Pages
1. Create a file in `/app/your-page/page.tsx`
2. Export a default React component
3. Add to sitemap in `app/sitemap.ts`

### Adding UI Components

```bash
npx shadcn@latest add [component-name]
```

Available components: Button, Card, Dialog, Form, Input, Select, Accordion, Badge, Carousel, Sheet, Textarea, and more.

### Theme System

Colors are defined using the oklch color space in `app/globals.css` with the `@theme` directive:

```css
@theme {
  --color-background: oklch(100% 0 0);      /* Pure white */
  --color-foreground: oklch(20% 0 0);       /* Near black */
  --color-accent: oklch(65% 0.15 310);      /* Purple/lavender */
}
```

Dark mode variants are automatically applied via the `.dark` class.

---

## Deployment

This project is optimized for Vercel:

1. **Connect to GitHub** – Import the repository in Vercel
2. **Configure build settings** – Auto-detected for Next.js
3. **Deploy** – Automatic deployments on every push to `main`

### Environment Variables
Currently, no environment variables are required. When adding email services, configure:
```
RESEND_API_KEY=       # For contact form email delivery
```

---

## Case Studies

The site showcases real client results:
- **Cross-Border Tour Production** – 12 cities, zero delays
- **Next.js Site + SEO Sprint** – +300% organic traffic in 60 days
- **Systems Overhaul** – 40% reduction in admin time

View all case studies at `/work`.

---

## Design Philosophy

**Calm confidence with a "we've got this" energy.**

- Typography leads, not graphics
- Generous whitespace and clean layouts
- Subtle animations and smooth interactions
- Professional yet approachable voice
- Mobile-first, accessible, performant

See `DEVELOPMENT.md` for detailed design system documentation.

---

## Roadmap

- [ ] Email integration for contact form (Resend/SendGrid)
- [ ] Analytics integration (GA4 or Plausible)
- [ ] CMS integration (Contentlayer or Sanity)
- [ ] Advanced case study filtering
- [ ] Newsletter subscription feature
- [ ] Client portal for project tracking

---

## Contributing

This is a private business website, but feedback and suggestions are welcome. Please open an issue to discuss proposed changes.

---

## License

© 2025 Clear Light Creative. All rights reserved.

---

## Contact

**Clear Light Creative**
Website: [sunshine-snowy.vercel.app](https://sunshine-snowy.vercel.app)
Email: Via contact form
Repository: [github.com/andretaki/sunshine](https://github.com/andretaki/sunshine)

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
