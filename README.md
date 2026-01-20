<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/The_Sunshine_Effect-FFF6E9?style=for-the-badge&logoColor=6E054D">
  <img alt="The Sunshine Effect" src="https://img.shields.io/badge/The_Sunshine_Effect-6E054D?style=for-the-badge&logoColor=white">
</picture>

# The Sunshine Effect

> *Glow from the heart, together.*

A modern wellness platform helping women move from burnout to alignment through simple rituals that build confidence, clarity, and momentum.

[![Next.js](https://img.shields.io/badge/Next.js_15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Drizzle](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=flat-square&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)

---

## Brand Palette

| Color | Hex | Usage |
|-------|-----|-------|
| ![#6E054D](https://via.placeholder.com/12/6E054D/6E054D.png) **Plum** | `#6E054D` | Primary, CTAs, headers |
| ![#240D01](https://via.placeholder.com/12/240D01/240D01.png) **Cocoa** | `#240D01` | Body text, ink |
| ![#FFF6E9](https://via.placeholder.com/12/FFF6E9/FFF6E9.png) **Cream** | `#FFF6E9` | Backgrounds |
| ![#F6C453](https://via.placeholder.com/12/F6C453/F6C453.png) **Gold** | `#F6C453` | Accents, highlights |
| ![#D4856A](https://via.placeholder.com/12/D4856A/D4856A.png) **Coral** | `#D4856A` | Golden Hour events |
| ![#9B7B9B](https://via.placeholder.com/12/9B7B9B/9B7B9B.png) **Leaf** | `#9B7B9B` | Lunar Room events |
| ![#E9D7C7](https://via.placeholder.com/12/E9D7C7/E9D7C7.png) **Sand** | `#E9D7C7` | Borders, secondary |

---

## Tech Stack

```
Framework       Next.js 15 (App Router + Turbopack)
UI              React 19 + Tailwind CSS v4
Animations      Framer Motion
Components      Radix UI + shadcn/ui patterns
Forms           React Hook Form + Zod validation
Database        PostgreSQL + Drizzle ORM
Styling         CSS-in-JS with Tailwind utilities
```

---

## Project Structure

```
sunshine/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── blog/              # Blog listing + [slug] posts
│   ├── community/         # Community hub
│   ├── contact/           # Contact form
│   ├── events/            # Golden Hour & Lunar Room
│   ├── offerings/         # Services & coaching
│   ├── privacy/           # Privacy policy
│   └── page.tsx           # Landing page
├── components/
│   ├── cards/             # Blog, event, offering cards
│   ├── forms/             # Contact, newsletter, SMS signup
│   ├── motion/            # Framer Motion wrappers
│   ├── sections/          # Page sections (hero, pillars, etc.)
│   └── ui/                # Base UI components (button, input, etc.)
├── lib/
│   ├── db/                # Drizzle schema & queries
│   ├── constants.ts       # Site-wide constants
│   └── features.ts        # Feature flags
└── public/                # Static assets
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (or use a hosted provider)

### Installation

```bash
# Clone the repository
git clone https://github.com/andretaki/sunshine.git
cd sunshine

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database URL

# Run database migrations
npm run db:push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run migrations |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Drizzle Studio |

---

## Features

- **Responsive Design** - Mobile-first, works beautifully on all devices
- **Accessible** - WCAG compliant with skip links and proper ARIA
- **SEO Optimized** - Meta tags, Open Graph, structured data
- **PWA Ready** - Web app manifest for installability
- **Animations** - Smooth scroll-triggered animations with Framer Motion
- **Blog System** - Markdown-powered blog with categories
- **Event Calendar** - Golden Hour & Lunar Room event pages
- **Newsletter Signup** - Email capture with validation
- **Contact Forms** - Multi-step contact flow with Zod validation

---

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/sunshine

# Optional: Analytics, etc.
NEXT_PUBLIC_SITE_URL=https://thesunshineeffect.com
```

---

## Deployment

Optimized for deployment on [Vercel](https://vercel.com):

```bash
npm run build
```

Or use the Vercel CLI:

```bash
vercel --prod
```

---

## License

Private repository. All rights reserved.

---

<p align="center">
  <strong>Built with warmth</strong><br>
  <sub>The Sunshine Effect</sub>
</p>
