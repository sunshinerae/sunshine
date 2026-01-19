# Implementation Plan — Brand Overhaul

Replace old sunshine-* brand with new sun-* brand. Warm, cozy, calm.

---

## Phase 1: Color System

- [x] Update tailwind.config.ts: add sun-* colors (sun-plum, sun-cocoa, sun-cream, sun-paper, sun-sand, sun-gold, sun-coral, sun-leaf)
- [x] Update globals.css: replace CSS variables with new sun-* palette, add shadow-soft utility
- [x] Update layout.tsx: replace fonts with Fraunces (headlines) + Inter (body) from Google Fonts

---

## Phase 2: Pages

- [x] Update app/page.tsx: replace sunshine-* with sun-* colors
- [x] Update app/about/page.tsx: replace sunshine-* with sun-* colors
- [x] Update app/offerings/page.tsx: replace sunshine-* with sun-* colors
- [x] Update app/events/page.tsx: replace sunshine-* with sun-* colors
- [x] Update app/community/page.tsx: replace sunshine-* with sun-* colors
- [x] Update app/contact/page.tsx: replace sunshine-* with sun-* colors
- [x] Update app/blog/page.tsx: replace sunshine-* with sun-* colors
- [x] Update app/blog/[slug]/page.tsx: replace sunshine-* with sun-* colors
- [x] Update app/launch/page.tsx: replace sunshine-* with sun-* colors
- [x] Update app/thank-you/page.tsx: replace sunshine-* with sun-* colors
- [x] Update app/privacy/page.tsx: replace sunshine-* with sun-* colors
- [x] Update app/plan/page.tsx: replace sunshine-* with sun-* colors

---

## Phase 3: Components

### UI Components
- [x] Update components/ui/button.tsx: sun-* colors, rounded-[14px]
- [x] Update components/ui/card.tsx: sun-paper bg, sun-sand border, shadow-soft
- [x] Update components/ui/badge.tsx: sun-* colors
- [x] Update components/ui/input.tsx: sun-sand border, sun-plum focus ring
- [x] Update components/ui/textarea.tsx: sun-sand border, sun-plum focus ring
- [x] Update components/ui/select.tsx: sun-sand border, sun-plum focus ring
- [x] Update components/ui/cta-button.tsx: sun-plum bg, rounded-[14px]
- [x] Update components/ui/section-heading.tsx: sun-cocoa text
- [ ] Update components/ui/reading-progress.tsx: sun-gold progress bar
- [ ] Update components/ui/testimonial-card.tsx: sun-* colors
- [ ] Update components/ui/zone-divider.tsx: sun-* colors

### Card Components
- [ ] Update components/cards/event-card.tsx: sun-paper bg, sun-sand border
- [ ] Update components/cards/offering-card.tsx: sun-paper bg, sun-sand border
- [ ] Update components/cards/blog-card.tsx: sun-paper bg, sun-sand border

### Form Components
- [ ] Update components/forms/newsletter-signup.tsx: sun-* colors
- [ ] Update components/forms/sms-signup.tsx: sun-* colors
- [ ] Update components/forms/contact-form.tsx: sun-* colors
- [ ] Update components/forms/contact-page-form.tsx: sun-* colors

### Layout Components
- [ ] Update components/navigation.tsx: sun-cream bg, sun-cocoa text, sun-plum accents
- [ ] Update components/footer.tsx: sun-* colors

### Brand Components
- [ ] Update components/brand-card.tsx: sun-* colors
- [ ] Update components/brand-headline.tsx: sun-cocoa text
- [ ] Update components/brand-section.tsx: sun-* colors
- [ ] Update components/signup-modal.tsx: sun-* colors
- [ ] Update components/magnetic-button.tsx: sun-plum colors
- [ ] Update components/spots-counter.tsx: sun-* colors
- [ ] Update components/floating-affirmation.tsx: sun-* colors
- [ ] Update components/section-separator.tsx: sun-sand color

### Section Components
- [ ] Update components/sections/hero.tsx: sun-* colors, hero gradient
- [ ] Update components/sections/pillars.tsx: sun-* colors
- [ ] Update components/sections/proof-bar.tsx: sun-* colors

### Blog Components
- [ ] Update components/blog/markdown-content.tsx: sun-cocoa text, sun-plum links
- [ ] Update components/blog/related-posts.tsx: sun-* colors

---

## Phase 4: Polish

- [ ] Add hero gradient utility to globals.css: linear-gradient(135deg, #6E054D 0%, #F6C453 100%)
- [ ] Search and remove any remaining sunshine-* references across codebase
- [ ] Run npm run build and fix any errors
- [ ] Final visual check: warm, cozy, calm — NOT poster-style, NOT all-white

---

## Done

All tasks complete when every `[ ]` is `[x]`.
