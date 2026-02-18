# Brand Deck Builder — Design Document

**Date:** 2026-02-18
**Status:** Approved

## Overview

A guided wizard inside the admin panel for creating professional 20-40 page brand decks with community members. AI (Gemini) generates brand stories, color palettes, voice guides, audience personas, and messaging — the person picks what resonates and refines. Output: PDF download, shareable web link, and editable source.

This is a paid service offering for women in the Sunshine community who have their own businesses or personal brands.

## Market Position

Agencies charge $2,500-$25,000+ for brand identity packages over weeks of back-and-forth. Existing tools fall short:

- **Logo generators** (Looka, Tailor Brands, Zoviz) — shallow, just a logo on templates
- **Brand guideline platforms** (Brandpad, Frontify) — presentation only, no creation
- **Pitch deck generators** (Pitches.ai, Beautiful.AI) — fundraising narrative, not brand identity
- **Canva Brand Kit** — manual toolkit, no AI guidance or guided process

Nobody does guided AI brand identity creation into a full 30+ page deck with triple output.

## Differentiators

1. **Consultation-first** — built for sitting down with someone, not solo self-service
2. **Heavy AI generation** — story, taglines, palettes, voice guide, personas, messaging
3. **Full 30+ page deck** — a real brand bible, not 5 slides
4. **Smart color psychology** — AI explains what each palette communicates
5. **AI brand voice analysis** — paste existing copy, AI codifies their voice
6. **AI audience persona builder** — generates detailed personas from 5 questions
7. **Mood board from keywords** — type vibes, get curated Unsplash imagery
8. **Live mockup previews** — see colors/fonts on Instagram, business cards, website in real-time
9. **Dark mode palette** — auto-generated
10. **Triple output** — PDF + shareable web link + editable source
11. **Brand-in-a-box export** — PDF + assets zip (swatches, fonts, images, templates)

## User Flow

### Guided Wizard Steps

1. **Intake** — Business name, industry, a few keywords about their vibe/values, existing logo upload (optional), existing copy paste (for voice analysis)
2. **AI Foundation** — AI generates: brand story draft, 3 color palette options with psychology explanations, font pairings, tagline candidates, voice direction, 2-3 audience personas
3. **Core Identity** — Pick/refine brand story, mission, vision, values, personality attributes
4. **Audience** — Review/edit AI-generated personas
5. **Voice & Messaging** — Pick voice direction, refine elevator pitch, taglines, messaging pillars
6. **Visual System** — Choose color palette, typography, pull Unsplash images for mood board, define photography style
7. **Dark Mode** — Review auto-generated dark palette, adjust if needed
8. **Applications** — See live mockups: social templates, business card, letterhead, email signature, website preview
9. **Motion Direction** — Pick animation/transition style for the brand
10. **Preview** — Full deck preview with all 30+ pages rendered
11. **Export** — PDF download, generate shareable web URL, save for future editing

### Deck Pages (30+)

1. Cover page (name, logo, date)
2. Table of contents
3. Brand story / origin
4. Mission & vision
5. Core values (3-5)
6. Target audience persona 1
7. Target audience persona 2
8. Brand personality / attributes
9. Elevator pitch & taglines
10. Brand voice guide (tone, dos/don'ts, examples)
11. Messaging pillars (3-4 key themes)
12. Color palette — primary
13. Color palette — secondary + accents + dark mode
14. Color psychology & meaning
15. Typography — primary + secondary
16. Typography hierarchy & usage
17. Photography style & mood board
18. Imagery dos and don'ts
19. Patterns & textures
20. Logo usage rules (if they have a logo)
21. Social media — Instagram templates
22. Social media — Facebook/LinkedIn templates
23. Business card mockup
24. Letterhead & email signature
25. Website mockup preview
26. Packaging/merch mockup (if applicable)
27. Motion & animation direction
28. Brand dos and don'ts summary
29. Quick reference / cheat sheet
30. Credits & contact

## Data Model

### `brand_decks` table

| Column | Type | Notes |
|--------|------|-------|
| id | serial | PK |
| slug | varchar | Unique, for public URL |
| title | varchar | Brand/business name |
| status | varchar | draft, completed |
| intake | jsonb | Initial intake answers |
| identity | jsonb | Brand story, mission, vision, values, personality |
| audience | jsonb | Personas array |
| voice | jsonb | Voice guide, taglines, elevator pitch, messaging pillars |
| visuals | jsonb | Colors (light + dark), typography, photography style, patterns |
| applications | jsonb | Mockup config (social, business card, letterhead, etc.) |
| motion | jsonb | Animation/transition direction |
| images | jsonb | Unsplash refs + uploaded image paths |
| created_at | timestamp | defaultNow() |
| updated_at | timestamp | defaultNow() |

Structured JSON columns for flexibility — each wizard step maps to one column. Easy to evolve without migrations.

## Tech Stack

- **AI:** Gemini (already in use) for all text generation — stories, personas, voice guides, taglines, color psychology
- **Images:** Unsplash API for stock photography, file uploads for custom images
- **PDF generation:** Puppeteer or `@react-pdf/renderer` for server-side PDF rendering
- **Public web view:** Next.js dynamic route `/brand/[slug]` — renders the deck as a styled web page
- **Asset export:** Zip generation with PDF + color swatches + font references + downloaded images
- **Fonts:** Google Fonts API for font pairing suggestions and rendering
- **Live previews:** Client-side rendering of mockups (social templates, business cards, etc.) using the selected colors/fonts

## API Routes

- `POST /api/admin/brand-decks` — Create new deck
- `GET /api/admin/brand-decks` — List all decks
- `GET /api/admin/brand-decks/[id]` — Get deck
- `PATCH /api/admin/brand-decks/[id]` — Update deck (per-step saves)
- `DELETE /api/admin/brand-decks/[id]` — Delete deck
- `POST /api/admin/brand-decks/[id]/generate` — AI generation for a specific step
- `POST /api/admin/brand-decks/[id]/export-pdf` — Generate and return PDF
- `POST /api/admin/brand-decks/[id]/export-assets` — Generate assets zip
- `GET /api/admin/brand-decks/unsplash` — Proxy Unsplash search

## Public Routes

- `GET /brand/[slug]` — Public shareable brand deck view (no auth)

## Admin UI

- `/admin/brand-decks` — List all brand decks with status
- `/admin/brand-decks/new` — Start new deck (wizard)
- `/admin/brand-decks/[id]` — Edit existing deck (wizard with saved state)
- `/admin/brand-decks/[id]/preview` — Full deck preview

## Environment Variables

- `UNSPLASH_ACCESS_KEY` — Unsplash API key
- `GOOGLE_API_KEY` — Already exists for Gemini

## Implementation Phases

### Phase 1: Foundation
- Database table + migration
- CRUD API routes
- Wizard shell UI with step navigation
- Intake step

### Phase 2: AI Generation
- Gemini integration for each step (story, palettes, personas, voice, taglines)
- Unsplash API integration for mood boards
- Color psychology engine

### Phase 3: Visual System
- Color picker with palette generation
- Google Fonts integration
- Photography style / mood board builder
- Dark mode auto-generation

### Phase 4: Applications & Mockups
- Live mockup components (social, business card, letterhead, website)
- Real-time preview with selected brand elements

### Phase 5: Deck Rendering
- Full deck preview (all 30+ pages)
- PDF export via Puppeteer
- Public web view route

### Phase 6: Polish
- Assets zip export
- Motion/animation direction page
- Brand voice analysis from pasted copy
- Refinement and edge cases
