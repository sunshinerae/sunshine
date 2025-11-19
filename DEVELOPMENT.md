# Development Documentation - Clear Light Creative

**Last Updated:** 2025-01-19
**Production URL:** https://sunshine-snowy.vercel.app
**Status:** ✅ Build Passing

This document consolidates all technical, design, and content documentation for the Clear Light Creative website.

---

# Table of Contents

1. [Project Overview & Positioning](#project-overview--positioning)
2. [Architecture & Tech Stack](#architecture--tech-stack)
3. [Design System & UI](#design-system--ui)
4. [Content & Copywriting](#content--copywriting)
5. [AI Assistant Context](#ai-assistant-context)
6. [Development Workflow](#development-workflow)
7. [Implementation Roadmap](#implementation-roadmap)

---

# Project Overview & Positioning

## Category
**Fractional Launch & Ops Producer for Creatives and Lean Teams**

## One-Liner
*We plan, build, and run the machine — logistics, websites, and growth — so you can focus on the work.*

## Value Pillars

1. **Ops & Logistics** – Planning, advancing, vendor wrangling, budgets, cross-border execution
2. **Web & Growth** – Next.js sites, SEO foundations, PPC funnels, analytics
3. **Systems & Coaching** – SOPs, templates, cadences, accountability

## Target Audiences

- **Musicians/Producers** → "From rehearsal to release — itineraries, stage plots, and a site that sells."
- **Indie Studios/Agencies** → "A fixer PM who ships sites and funnels — and keeps ops tight."
- **SMB Founders** → "A hands-on producer for launches: plan, site, ads, results."

## Services Architecture

### Operations & Logistics
- Project/Tour/Event logistics (advancing, itineraries, vendors, budgets)
- International execution (visas, carnets, partners)
- Production support

### Web & Growth
- Website build/refresh (Next.js on Vercel) with SEO foundations
- SEO sprints (IA, on-page, schema, internal links, content briefs)
- PPC setup/management (Google Ads, landing variants, conversion tracking)
- Analytics + reporting dashboard (GA4 + ads + CRM)

### Systems & Coaching
- Artist/Founder Systems Sprint (2–4 wks): CRM, SOPs, templates, automations
- Mentorship/coaching packages with accountability check-ins

### Add-ons
Notion workspace, Airtable trackers, press kit/EPK refresh, grant/application review, simple finances template.

---

# Architecture & Tech Stack

## Tech Stack

- **Framework:** Next.js 15.5.4 (App Router, Turbopack, React Server Components)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 (with @tailwindcss/postcss)
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Fonts:** DM Sans (body), DM Serif Display (display/headings)
- **Forms:** React Hook Form + Zod validation
- **Deployment:** Vercel

## Project Structure

```
/app
  /api
    /contact          # Form submission API route
      route.ts
  /about             # About page
  /contact           # Contact form with Select dropdown
  /plan              # Project plan viewer
  /services          # Services overview & detail pages
    /logistics
    /ppc-campaigns
    /systems-sprint
    /web-seo-sprint
  /work              # Case studies
    /seo-sprint
    /systems-overhaul
    /tour-production
  layout.tsx         # Root layout with Navigation & Footer
  page.tsx           # Homepage
  globals.css        # Global styles with Tailwind v4 @theme
  robots.ts          # SEO robots.txt
  sitemap.ts         # Dynamic sitemap generation

/components
  /sections          # Page sections
    hero.tsx         # Hero component with CTA variants
    pillars.tsx      # Services pillars section
    proof-bar.tsx    # Social proof scroller
  /ui                # shadcn/ui components
    button.tsx
    card.tsx
    dialog.tsx
    form.tsx
    input.tsx
    select.tsx
    textarea.tsx
    ... (20+ components)
  navigation.tsx     # Main navigation with mobile sheet
  theme-provider.tsx # Dark mode support
  theme-toggle.tsx   # Theme switcher
  fade-in.tsx        # Animation wrapper

/lib
  constants.ts       # Site config, nav links, URLs
  /hooks
    use-active-section.ts
    use-intersection-observer.ts

/public              # Static assets (images, icons, manifest)
```

## Key Files Explained

### 1. app/layout.tsx
- Root layout for entire app
- Imports DM Sans & DM Serif Display fonts
- Wraps app in ThemeProvider for dark mode
- Includes Navigation component and Footer
- SEO metadata configuration

### 2. app/page.tsx (Homepage)
- Uses Hero, Pillars, ProofBar components
- Work Highlights section with case study cards
- Final CTA section
- All wrapped in FadeIn animations

### 3. app/globals.css
- Uses Tailwind v4 @theme directive
- Defines color palette using oklch()
- Custom properties: --color-background, --color-accent, etc.
- Custom scrollbar styles
- Focus states

### 4. components/navigation.tsx
- Sticky header with scroll shadow effect
- Desktop: Logo, Nav Links, Theme Toggle, "Let's Chat" CTA
- Mobile: Hamburger menu with Sheet drawer
- Active section tracking on homepage

### 5. app/contact/page.tsx
- React Hook Form with Zod validation
- Select dropdown for Project Type (Logistics, Web/SEO, PPC, Systems, Other)
- Posts to /api/contact route
- Success screen with CTAs

### 6. app/api/contact/route.ts
- Validates form data with Zod
- Currently logs to console (TODO: implement email service)
- Returns JSON response
- Error handling for validation failures

## Build Configuration

### ESLint
- **Config:** `.eslintrc.json`
- **Rules disabled:** `react/no-unescaped-entities` (allows natural apostrophes in JSX)
- **Build behavior:** Linting skipped during production builds (`ignoreDuringBuilds: true`)

### Tailwind Config
- **Version:** v4
- **Config file:** `tailwind.config.ts` (backup/reference)
- **Primary config:** `globals.css` with @theme
- **Plugin:** tailwindcss-animate (for accordion, etc.)
- **Dark mode:** Class-based (`.dark`)

### PostCSS
- Uses `@tailwindcss/postcss` plugin
- Config in `postcss.config.mjs`

### TypeScript
- Strict mode enabled
- Path aliases: `@/` → project root

## SEO Setup

### Metadata
- Site name: "Clear Light Creative"
- Description: "Your Creative Vision, Brought to Light"
- URL: https://sunshine-snowy.vercel.app
- Icons: `/icon-192.png`, `/apple-touch-icon.png`
- Manifest: `/manifest.json`

### robots.txt (`app/robots.ts`)
- Allows all crawlers: `userAgent: '*', allow: '/'`
- Sitemap reference: `${SITE_CONFIG.url}/sitemap.xml`

### Sitemap (`app/sitemap.ts`)
- Dynamic generation
- All static routes included
- Homepage priority: 1.0
- Other pages: 0.8
- Change frequency: weekly (home), monthly (others)

---

# Design System & UI

## Design Philosophy

**Calm confidence with a "we've got this" energy.**

Typography leads, not graphics. Lots of air between elements. When we want punch (for ads/landings), we dial up big type and a few bold accents — but never clutter. It should feel like a competent producer's desk: neat piles, labeled tabs, everything reachable.

## Color System

Using oklch() color space for perceptual uniformity:

### Light Mode
- Background: `oklch(100% 0 0)` - Pure white
- Foreground: `oklch(20% 0 0)` - Near black
- Accent: `oklch(65% 0.15 310)` - Purple/lavender
- Muted: `oklch(96% 0 0)` - Light gray

### Dark Mode
- Background: `oklch(15% 0 0)` - Very dark
- Foreground: `oklch(98% 0 0)` - Near white
- Accent: `oklch(65% 0.15 310)` - Same purple (consistent)
- Muted: `oklch(25% 0 0)` - Dark gray

## Typography

- **Body:** DM Sans (--font-sans)
- **Display/Headings:** DM Serif Display (--font-display)
- **Usage:** Apply `font-display` class for headlines
- Generous line height for readability
- Consistent size scale

## Component System

### Section Components
- **Hero:** Headline, subheadline, primary + secondary CTAs
- **Pillars:** 3-column service cards with hover effects
- **ProofBar:** Horizontal scroller (cities/clients/outcomes)
- **FadeIn:** Animation wrapper for scroll reveals

### UI Components (shadcn/ui)
All in `/components/ui`:
- Accordion, Badge, Button, Card, Carousel
- Dialog, Form, Input, Label, Select, Sheet
- Textarea, Tooltip, and more

### Navigation Features
- Sticky header with scroll shadow
- Active link highlighting
- Section tracking on homepage
- Mobile drawer menu
- Theme toggle

## Motion & Interaction

- Soft, subtle: cards lift a hair, links underline from center, section headings fade upward
- Dialogs slide smoothly; no bouncing, no flashy spins
- Loading states show a tidy progress bar or skeletons — never blank
- Touch targets are large; focus rings are visible and tasteful

## Design Direction Options

### A. Minimal (Literary Modernism)
- Palette: bone, carbon, paper; ample whitespace
- Type: Display Serif + Grotesk
- Motion: quiet fades, typographic reveals

### B. Maximal (Tour Poster Collage)
- Palette: saturated primaries, riso/halftone
- Type: bold condensed + mono
- Motion: parallax strips, marquees

### C. Modern Ops (Neo-swiss) **[CURRENT]**
- Palette: grayscale + a single accent
- Type: Inter/Neue Haas Grotesk
- Motion: snappy micro-interactions, progress bars

### D. Editorial Poster (Big Type)
- Palette: black/ivory with seasonal accent sets
- Type: oversize display + readable serif body
- Motion: section "page turns", footnote-style meta

### E. Warm Studio (Textured Minimal)
- Palette: warm neutrals, film-grain images
- Type: humanist sans + serif pull quotes
- Motion: soft scroll-linked animations

---

# Content & Copywriting

## Brand Voice

### Current Voice Characteristics
- **We-focused** (team-oriented, collaborative)
- **Direct & human** (no buzzwords or jargon)
- **Warm but professional** (approachable expert)
- **Action-oriented** (verbs over adjectives)

### Copywriting Principles
- Typography leads, not graphics
- Lots of air between elements
- Direct, human, zero buzzword salad
- Verbs over adjectives: plan, build, ship, measure
- Small moments of warmth (e.g., "we'll handle the messy bits")

## Homepage Copy

### Hero Section
**Headline:** "From idea to encore."
**Subheadline:** "We handle logistics, build modern websites, and streamline your operations—so you can focus on the creative work that matters."
**Primary CTA:** Book a Call → /contact
**Secondary CTA:** View Our Work → /work

### Hero A/B/C Variants for Testing

**A (Ops-first):**
- H1: *From idea to encore.*
- Sub: *I handle logistics, vendors, and timelines so your work ships on time.*

**B (Web/Growth-first):**
- H1: *Ship the site. Grow the pipeline.*
- Sub: *Next.js builds, SEO foundations, and PPC funnels wired to measure.*

**C (Unified):**
- H1: *Plan, build, and run the machine.*
- Sub: *Logistics, websites, and growth — one producer, accountable for outcomes.*

**Currently using:** Variant A with "we" voice

## Services Section (Pillars)

### Section Header
**H2:** "What We Do"
**Description:** "Three core services to handle the logistics, growth, and systems that keep creative work moving."

### Service 1: Flawless Project & Event Production
**Promise:** "For when you have a million moving parts."
**Link:** /services/logistics

**Highlights:**
- Mapping out your entire project, from start to finish
- Coordinating with venues, agents, and other partners
- Managing budgets to keep you on track
- Handling the nitty-gritty of touring and events

### Service 2: A Beautiful Website That Wins You Clients
**Promise:** "Your digital home base, built to perform."
**Link:** /services/web-seo-sprint

**Highlights:**
- A gorgeous, fast website that reflects your unique brand
- Guidance on what to write so people find you on Google
- A clear way for visitors to hire you or buy from you
- Simple analytics so you can see what's working

### Service 3: Smart Growth & Automation
**Promise:** "Ready to grow, but hate the admin work?"
**Link:** /services/ppc-campaigns

**Highlights:**
- Targeted ad campaigns that reach the right people
- Automating repetitive tasks to free up your schedule
- Clear, easy-to-read reports on your growth
- Creating simple templates and guides for your team

## Work Highlights (Homepage)

### Section Header
**H2:** "Recent Work"
**Description:** "Real results for creative professionals and lean teams."

### Case Studies
1. **Cross-Border Tour Production** – "12 cities, zero delays" → /work/tour-production
2. **Next.js Site + SEO Sprint** – "+300% organic traffic in 60 days" → /work/seo-sprint
3. **Systems Overhaul** – "40% reduction in admin time" → /work/systems-overhaul

## Final CTA (Homepage)

**H2:** "Ready to bring your project to light?"
**Description:** "Whether it's tour logistics, a website rebuild, or streamlining your systems—let's have a conversation about how we can help."
**CTA Button:** "Book a Free Call" → /contact

## Navigation

**Logo:** Clear Light Creative (with logo image)
**Nav Links:**
- How We Help → /services
- Our Work → /work
- About → /about

**CTA Button:** "Let's Chat" → /contact
**Theme Toggle:** Dark/Light mode switcher

## Contact Form Copy

### Header
**H1:** "Let's work together."
**Description:** "Fill out the form below and we'll get back to you within 24 hours. We're excited to learn about your project and discuss how we can help bring your vision to life."

### Form Fields
1. **Name** – Placeholder: "Your full name" (Min 2 characters)
2. **Email** – Placeholder: "you@example.com" (Valid email format)
3. **Project Type** (Select dropdown):
   - Logistics & Production
   - Website + SEO Sprint
   - PPC Campaigns
   - Systems Sprint
   - Other
4. **Message** – Placeholder: "Tell us about your project, timeline, and what you're hoping to accomplish..." (Min 10 characters)

**Submit Button:** "Send Message" (disabled state: "Sending...")

### Success Screen
**H1:** "Thank you for reaching out!"
**Message:** "We've received your message and will get back to you within 24 hours. In the meantime, feel free to explore our work or learn more about how we can help."

## Brand Consistency Guidelines

### DO:
✓ Use "we/our" throughout (team voice)
✓ Lead with benefits, not features
✓ Focus on outcomes and results
✓ Use specific, concrete language
✓ Include proof (metrics, testimonials)

### DON'T:
✗ Mix "I" and "we" voices
✗ Use buzzwords or jargon
✗ Make vague promises
✗ Hide CTAs or make them complicated
✗ Overwhelm with too many choices

---

# AI Assistant Context

## Project Overview
UPS Shipment Monitoring System for Alliance Chemical - Proactive tracking and alerts for logistics operations.

**Note:** The CLAUDE.md content was originally written for a different project (UPS shipment tracking). The context below is preserved for reference but may not apply to this current website project.

## System Architecture (Reference - Different Project)

### Purpose
Monitor UPS shipments in real-time, automatically flag problematic shipments, and streamline claims management workflow.

### Core Features
1. **Real-time Shipment Tracking** - ShipStation sync + UPS webhook integration
2. **Intelligent Flagging System** - Rule-based alerts for aging, no movement, exceptions, damage
3. **Microsoft Teams Integration** - Automated notifications for critical issues
4. **Claims Management** - One-click claim packet generation
5. **Bulk Operations** - Resolve/copy multiple flags with keyboard shortcuts

### Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Database:** PostgreSQL + Drizzle ORM
- **UI:** Tailwind CSS + shadcn/ui components
- **APIs:** ShipStation REST API, UPS Tracking API
- **Notifications:** Microsoft Graph API (Teams), email

---

# Development Workflow

## Local Development

### Setup
```bash
npm install
npm run dev
```
Runs on http://localhost:3000

### Type Checking
```bash
npm run build
```
TypeScript errors will fail the build

### Adding New Pages
1. Create file in `/app/your-page/page.tsx`
2. Export default React component
3. Add to sitemap in `app/sitemap.ts`
4. Link from navigation if needed

### Adding New Components
```bash
npx shadcn@latest add [component-name]
```

## Deployment

### Vercel Setup
1. Connected to GitHub repo
2. Auto-deploys on push to main
3. Preview deployments for PRs
4. Environment variables: (none currently needed)

### Build Command
```bash
npm run build
```

### Build Output
- All routes pre-rendered as static (○)
- API route as dynamic (ƒ)
- Total bundle: ~147-233 KB per page

### Environment Variables Needed
When adding email service:
```
RESEND_API_KEY=          # If using Resend
SENDGRID_API_KEY=        # If using SendGrid
AWS_ACCESS_KEY_ID=       # If using AWS SES
AWS_SECRET_ACCESS_KEY=   # If using AWS SES
AWS_REGION=              # If using AWS SES
```

## Testing Checklist

### Before Production Deploy
- [ ] Restore original copy (if backup exists)
- [ ] Configure email service in API route
- [ ] Update production URL in constants
- [ ] Add real social media links
- [ ] Test contact form end-to-end
- [ ] Test all navigation links
- [ ] Test mobile responsiveness
- [ ] Test dark mode toggle
- [ ] Verify SEO metadata
- [ ] Check sitemap.xml generation
- [ ] Test on actual devices
- [ ] Run Lighthouse audit
- [ ] Verify accessibility (WCAG AA)

---

# Implementation Roadmap

## Site Strategy & Site Map

**Chosen:** **Funnel-first** for PPC performance + create SEO-ready supporting pages.

### Structure
- **Landing (PPC):** Tightly messaged pages per service/audience
- **Core Site:** Home / Services / Work / About / Mentorship / Resources / Contact
- **Deep Modals/Overlays** on Home for quick skim; dedicated URLs for SEO depth

## Key CTAs (Future Integration)

- **Book a Call** → Cal.com/Calendly embed + Google Calendar invite
- **Request a Quote** → Server Action → store in Postgres (Drizzle) → email via AWS SES
- **Apply for Mentorship** → Typeform or native form → Postgres + SES
- **Join the List** → ConvertKit or SES-powered list
- **File Uploads** → AWS S3 (pre-signed URLs)
- **Spam/Trust** → Google reCAPTCHA Enterprise, DMARC/SPF/DKIM

## Content Model

### Database Tables (Future)
- `leads` – Contact form submissions
- `inquiries` – Quote requests
- `services` – Service offerings
- `case_studies` – Portfolio work
- `testimonials` – Client feedback
- `articles` – Blog/resources content
- `uploads` – File attachments
- `events` – Calendar bookings
- `newsletter_subs` – Email list

## Feature Checklist (Future)

- [ ] Cal.com/Calendly booking (with time-zone + buffer)
- [ ] Forms → Server Actions → Postgres (Drizzle) + SES email
- [ ] File uploads to S3, download links with signed URLs
- [ ] Newsletter: ConvertKit or Pinpoint list
- [ ] PPC: Google Ads conversion + Enhanced Conversions, Consent Mode v2
- [ ] SEO: schema.org (Organization, Service, Article, Review)
- [ ] Analytics: GA4 + Plausible (dual-run)
- [ ] Accessibility: WCAG AA compliance audit
- [ ] Performance: Optimize images, add loading states

## Offer Ladder (Packages)

### Starter: 'Ship the Essentials' (2–3 weeks)
- IA + landing, contact/lead form to Postgres, GA4/Ads wiring
- Basic SEO (titles/meta/schema), 1 ad group + 3 variants
- Quick ops audit + a simple weekly cadence template

### Standard: 'Run the Machine' (4–6 weeks)
- Site (3–5 pages) + 2 PPC landings, conversion tracking + dashboards
- Logistics/production plan or project plan (quarterly)
- SOP pack (briefs, checklists), vendor roster
- Bi-weekly coaching/check-ins

### Pro: 'Scale & Expand' (Custom)
- Multi-locale pages, content briefs, expanded SEO, full PPC structure
- International execution support (visas/carnets if relevant)
- Retainer for ops + growth + coaching

## PPC Ad Group Seeds

- Creative Ops Producer (keywords: creative operations, project logistics, producer for hire)
- Website + SEO Sprint (nextjs agency, seo sprint, ship website fast)
- PPC Funnels (landing page builder, google ads management for creatives)
- Systems & Coaching (creative coach, ops coaching, creator systems)

## Known Issues & TODOs

### Critical (Must Fix Before Production)
1. **Email Integration:** Implement actual email sending in `/api/contact/route.ts`
   - Options: Resend, SendGrid, Nodemailer, AWS SES, Formspark
2. **Copy Recovery:** Original custom copy was overwritten
   - Need to restore original messaging if backup exists

### Important
3. **Production URL:** Update when final domain is ready
   - Change `SITE_CONFIG.url` in `/lib/constants.ts`
4. **Social Links:** Currently placeholder `#` links
   - Update in `/lib/constants.ts`
5. **Privacy & Terms:** Footer links are placeholders
   - Create actual privacy policy and terms pages

### Nice to Have
6. **ProofBar Content:** Populate with actual cities/clients/metrics
7. **Analytics:** Add GA4 or Plausible tracking
8. **Performance:** Optimize images, add loading states
9. **A/B Testing:** Implement hero variants
10. **CMS:** Consider Contentlayer or Sanity for content management

---

## Resources

### Documentation
- Next.js: https://nextjs.org/docs
- Tailwind v4: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com
- React Hook Form: https://react-hook-form.com
- Zod: https://zod.dev

### Email Services
- Resend: https://resend.com/docs/send-with-nextjs
- SendGrid: https://www.npmjs.com/package/@sendgrid/mail
- AWS SES: https://aws.amazon.com/ses
- Formspark: https://formspark.io

---

**End of Development Documentation**
