# Implementation Plan — The Sunshine Effect

## Phase 1: Foundation & Animation System

- [x] Install Framer Motion: `npm install framer-motion`
- [x] Create `components/motion/fade-in-view.tsx` — scroll-triggered fade animation wrapper (soft, 0.6s ease)
- [x] Create `components/motion/slide-in-view.tsx` — scroll-triggered slide animation wrapper (soft, 0.6s ease)
- [x] Create `components/motion/stagger-children.tsx` — staggered animation for card grids (crisp, 0.3s)
- [x] Create `components/motion/scale-in.tsx` — scale animation for CTAs and buttons (crisp, 0.3s)
- [x] Create `lib/animation-variants.ts` — reusable Framer Motion variants for soft and crisp animations

## Phase 2: Data Structures

- [x] Create `data/events.json` with sample Golden Hour and Lunar Room events (3 each, include: title, date, time, description, type, image placeholder)
- [x] Create `content/blog/` directory structure with sample markdown post template
- [x] Create `data/blog-meta.json` for blog post metadata (title, slug, category, date, excerpt, image)
- [x] Create `lib/blog.ts` utility functions to read and parse blog posts
- [x] Create `lib/events.ts` utility functions to read and filter events by type

## Phase 3: Reusable Components

- [x] Create `components/ui/reading-progress.tsx` — thin golden progress bar at top of page for blog posts
- [x] Create `components/ui/testimonial-card.tsx` — quote card with name, descriptor, styled for brand
- [x] Create `components/ui/section-heading.tsx` — reusable section title with optional subtitle (uses font-headline)
- [x] Create `components/ui/cta-button.tsx` — pill-shaped button with hover scale effect (crisp animation)
- [x] Create `components/forms/newsletter-signup.tsx` — email input + submit, brand styled
- [x] Create `components/forms/sms-signup.tsx` — phone input + submit, brand styled
- [x] Create `components/forms/contact-form.tsx` — name, email, subject, message fields with submit
- [x] Create `components/cards/event-card.tsx` — event display card with date, title, description, CTA
- [x] Create `components/cards/offering-card.tsx` — offering display card with icon placeholder, title, description, CTA
- [x] Create `components/cards/blog-card.tsx` — blog post preview card with image, title, excerpt, category tag

## Phase 4: Navigation & Footer

- [x] Update `components/navigation.tsx` — add all nav items: Home, About, Offerings, Events, Community, Blog, Contact + CTA button
- [x] Create `components/footer.tsx` — logo, tagline, nav links, newsletter signup, social links (Instagram), copyright
- [x] Add footer to root layout so it appears on all pages

## Phase 5: SEO Foundation

- [x] Create `lib/metadata.ts` — utility for generating page metadata (title, description, OG tags)
- [x] Create `app/sitemap.ts` — dynamic sitemap generation for all pages
- [x] Create `app/robots.ts` — robots.txt configuration (update existing if needed)
- [x] Add structured data (JSON-LD) component for Organization schema
- [x] Create `components/seo/og-image.tsx` — template for Open Graph images (or use Next.js OG image generation)

## Phase 6: Core Pages

### About Page
- [x] Create `app/about/page.tsx` — page structure with metadata
- [x] Add About hero section with placeholder headline and subhead
- [x] Add About story section with placeholder paragraphs (2-3 blocks)
- [x] Add About values grid section (6 values with icon placeholders and placeholder text)
- [x] Add scroll animations to all About page sections

### Offerings Page
- [x] Create `app/offerings/page.tsx` — page structure with metadata
- [x] Add Offerings hero section with headline and intro text placeholder
- [x] Add 1:1 Coaching section with placeholder content and CTA
- [x] Add Retreats section with placeholder content and CTA
- [ ] Add Events teaser section linking to Events page
- [ ] Add scroll animations to all Offerings page sections

### Events Page
- [ ] Create `app/events/page.tsx` — page structure with metadata
- [ ] Add Events intro section with "community in motion" placeholder copy
- [ ] Create Golden Hour zone — warm background, sun imagery placeholder, event cards from JSON
- [ ] Create Lunar Room zone — cool/dark background, moon imagery placeholder, event cards from JSON
- [ ] Add visual divider or transition between zones
- [ ] Add scroll animations to event cards (staggered)

### Community Page
- [ ] Create `app/community/page.tsx` — minimal page with metadata
- [ ] Add Community hero with placeholder headline and description
- [ ] Add single CTA section ("Join the List" or similar)
- [ ] Add scroll animations

### Contact Page
- [ ] Create `app/contact/page.tsx` — page structure with metadata
- [ ] Add Contact hero with welcoming headline placeholder
- [ ] Add contact form section
- [ ] Add newsletter signup section ("Consistent Bulletin")
- [ ] Add SMS signup section with "love note" placeholder copy
- [ ] Add social links section (Instagram primary)
- [ ] Add scroll animations to all sections

### Blog Pages
- [ ] Create `app/blog/page.tsx` — blog index with metadata
- [ ] Add Blog hero section with headline
- [ ] Add category filter pills (Wellness, Self-Development, Business Strategy)
- [ ] Add blog post grid with blog-card components
- [ ] Create `app/blog/[slug]/page.tsx` — individual blog post template
- [ ] Add reading progress bar to blog post template
- [ ] Add blog post hero with title, date, category, featured image placeholder
- [ ] Add blog post body content renderer (markdown to JSX)
- [ ] Add related posts section at bottom of blog post
- [ ] Add scroll animations to blog pages

### Thank You Page
- [ ] Create `app/thank-you/page.tsx` — post-signup redirect page
- [ ] Add warm confirmation message with fire emoji
- [ ] Add "what happens next" section (lead magnet tease: "Your first ritual arrives in 24 hours")
- [ ] Add social links and community invitation
- [ ] Add soft entrance animations

### 404 Page
- [ ] Create `app/not-found.tsx` — custom 404 page
- [ ] Add warm, on-brand message ("You wandered off the path")
- [ ] Add helpful navigation links back to main pages
- [ ] Add CTA to return home
- [ ] Style with brand colors and typography

## Phase 7: Launch Page Enhancements

- [ ] Add social proof strip to launch page (placeholder testimonial or "X women have joined")
- [ ] Update signup modal success state to redirect to /thank-you page
- [ ] Add lead magnet tease to signup modal intro copy ("Get your first ritual in 24 hours")

## Phase 8: Micro-interactions & Polish

- [ ] Add hover scale effect to all CTA buttons site-wide
- [ ] Add subtle hover effects to nav links
- [ ] Add smooth focus states for form inputs (ring with brand color)
- [ ] Add hover effects to all card components (slight lift/shadow)
- [ ] Review and ensure all pages have consistent scroll animations
- [ ] Add page transition animations between routes (optional, if not too complex)

## Phase 9: Content Placeholders & Final Touches

- [ ] Create 3 sample blog posts in markdown with placeholder content (one per category)
- [ ] Add placeholder images or gradients where hero images are needed
- [ ] Review all placeholder text for consistent tone (even as placeholders)
- [ ] Run Lighthouse audit and fix any critical accessibility issues
- [ ] Final review: ensure all nav links work, all CTAs function, no broken pages

## Done

All tasks completed. Site ready for content population.
