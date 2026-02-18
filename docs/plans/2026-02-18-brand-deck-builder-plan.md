# Brand Deck Builder Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a guided AI-powered brand deck wizard in the admin panel that creates professional 30+ page brand decks with PDF export, shareable web links, and editable source.

**Architecture:** Wizard-style admin page at `/admin/brand-decks` backed by a `brand_decks` table with JSON columns per wizard step. AI generation via Gemini (`@google/genai` SDK). Images from Unsplash API. PDF export via Puppeteer. Public shareable view at `/brand/[slug]`.

**Tech Stack:** Next.js 15, Drizzle ORM + PostgreSQL, Gemini 3 Flash, Unsplash API, Google Fonts API, Puppeteer, Tailwind CSS (zinc dark theme), lucide-react icons, framer-motion.

**Design doc:** `docs/plans/2026-02-18-brand-deck-builder-design.md`

---

## Phase 1: Foundation

### Task 1: Add `brand_decks` table to schema

**Files:**
- Modify: `db/schema.ts` (add table at bottom)

**Step 1: Add the table definition**

Add to end of `db/schema.ts`:

```ts
// ─── Admin Tool: Brand Deck Builder ─────────────────────────────

export const brandDecks = pgTable('brand_decks', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 100 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  status: varchar('status', { length: 50 }).default('draft').notNull(),
  currentStep: integer('current_step').default(0).notNull(),
  intake: text('intake'),       // JSON: { businessName, industry, keywords, vibe, existingCopy, logoUrl }
  identity: text('identity'),   // JSON: { brandStory, mission, vision, values, personality }
  audience: text('audience'),   // JSON: { personas: [{ name, age, location, occupation, painPoints, goals, channels }] }
  voice: text('voice'),         // JSON: { toneAttributes, elevatorPitch, taglines, messagingPillars, voiceGuide, dosAndDonts }
  visuals: text('visuals'),     // JSON: { colors: { primary, secondary, accent, darkMode }, typography: { primary, secondary }, photographyStyle, patterns }
  applications: text('applications'), // JSON: { socialTemplates, businessCard, letterhead, emailSignature, websitePreview }
  motion: text('motion'),       // JSON: { style, transitions, scrollBehavior, animationNotes }
  images: text('images'),       // JSON: { moodBoard: [{ unsplashId, url, alt }], uploads: [{ url, alt }] }
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  slugIdx: uniqueIndex('brand_decks_slug_idx').on(table.slug),
}));
```

Note: Uses `text` columns for JSON (matching existing codebase pattern with `sponsorPackages.benefits`). Parse with `JSON.parse()`, store with `JSON.stringify()`.

**Step 2: Generate and push the migration**

Run: `pnpm db:generate`
Run: `pnpm db:push`

Expected: New migration file in `drizzle/` and table created in DB.

**Step 3: Commit**

```bash
git add db/schema.ts drizzle/
git commit -m "feat(brand-decks): add brand_decks table to schema"
```

---

### Task 2: Create CRUD API routes

**Files:**
- Create: `app/api/admin/brand-decks/route.ts` (list + create)
- Create: `app/api/admin/brand-decks/[id]/route.ts` (get + update + delete)

**Step 1: Build the list + create route**

Create `app/api/admin/brand-decks/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { brandDecks } from '@/db/schema';
import { desc } from 'drizzle-orm';

// GET /api/admin/brand-decks — list all decks
export async function GET() {
  try {
    const decks = await db.select().from(brandDecks).orderBy(desc(brandDecks.createdAt));
    return NextResponse.json({ decks });
  } catch (error) {
    console.error('Failed to list brand decks:', error);
    return NextResponse.json({ error: 'Failed to list brand decks' }, { status: 500 });
  }
}

// POST /api/admin/brand-decks — create new deck
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title } = body;
    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Generate slug from title
    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    const [deck] = await db.insert(brandDecks).values({
      title,
      slug,
      status: 'draft',
      currentStep: 0,
    }).returning();

    return NextResponse.json({ deck }, { status: 201 });
  } catch (error) {
    console.error('Failed to create brand deck:', error);
    return NextResponse.json({ error: 'Failed to create brand deck' }, { status: 500 });
  }
}
```

**Step 2: Build the get + update + delete route**

Create `app/api/admin/brand-decks/[id]/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { brandDecks } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/admin/brand-decks/[id]
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const deckId = parseInt(id, 10);
    if (isNaN(deckId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const [deck] = await db.select().from(brandDecks).where(eq(brandDecks.id, deckId));
    if (!deck) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ deck });
  } catch (error) {
    console.error('Failed to get brand deck:', error);
    return NextResponse.json({ error: 'Failed to get brand deck' }, { status: 500 });
  }
}

// PATCH /api/admin/brand-decks/[id] — update any fields
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const deckId = parseInt(id, 10);
    if (isNaN(deckId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const body = await request.json();

    // Only allow updating known fields
    const allowed = ['title', 'status', 'currentStep', 'intake', 'identity', 'audience', 'voice', 'visuals', 'applications', 'motion', 'images'];
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    for (const key of allowed) {
      if (body[key] !== undefined) {
        // JSON fields get stringified, others pass through
        if (['intake', 'identity', 'audience', 'voice', 'visuals', 'applications', 'motion', 'images'].includes(key)) {
          updates[key] = typeof body[key] === 'string' ? body[key] : JSON.stringify(body[key]);
        } else {
          updates[key] = body[key];
        }
      }
    }

    const [deck] = await db.update(brandDecks).set(updates).where(eq(brandDecks.id, deckId)).returning();
    if (!deck) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ deck });
  } catch (error) {
    console.error('Failed to update brand deck:', error);
    return NextResponse.json({ error: 'Failed to update brand deck' }, { status: 500 });
  }
}

// DELETE /api/admin/brand-decks/[id]
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const deckId = parseInt(id, 10);
    if (isNaN(deckId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const [deck] = await db.delete(brandDecks).where(eq(brandDecks.id, deckId)).returning();
    if (!deck) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete brand deck:', error);
    return NextResponse.json({ error: 'Failed to delete brand deck' }, { status: 500 });
  }
}
```

**Step 3: Test manually**

Run: `pnpm dev`
Test with curl (or browser): `POST /api/admin/brand-decks` with `{ "title": "Test Brand" }`, then `GET /api/admin/brand-decks` to verify.

**Step 4: Commit**

```bash
git add app/api/admin/brand-decks/
git commit -m "feat(brand-decks): add CRUD API routes"
```

---

### Task 3: Add Brand Decks to admin nav

**Files:**
- Modify: `app/admin/layout.tsx` (add nav item)
- Modify: `middleware.ts` (ensure `/admin/brand-decks` and `/api/admin/brand-decks` are covered — they should be by existing matcher patterns, but verify)

**Step 1: Add nav item**

In `app/admin/layout.tsx`, add to NAV_ITEMS array:

```ts
import { Users, Handshake, Rocket, Send, LogOut, Palette } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'People', icon: Users },
  { href: '/admin/sponsors', label: 'Sponsors', icon: Handshake },
  { href: '/admin/outreach', label: 'Outreach', icon: Send },
  { href: '/admin/growth', label: 'Growth', icon: Rocket },
  { href: '/admin/brand-decks', label: 'Brand Decks', icon: Palette },
];
```

**Step 2: Verify middleware covers the new paths**

Check `middleware.ts` matcher — the existing pattern `/admin/((?!login).*)` covers `/admin/brand-decks` and `/api/admin/((?!auth).*)` covers `/api/admin/brand-decks`. No changes needed.

**Step 3: Commit**

```bash
git add app/admin/layout.tsx
git commit -m "feat(brand-decks): add Brand Decks to admin nav"
```

---

### Task 4: Build wizard shell UI + deck list page

**Files:**
- Create: `app/admin/brand-decks/page.tsx` (list page)
- Create: `app/admin/brand-decks/[id]/page.tsx` (wizard page)

**Step 1: Build the deck list page**

Create `app/admin/brand-decks/page.tsx` — a `'use client'` page that:
- Fetches `GET /api/admin/brand-decks` on mount
- Shows a grid of deck cards (title, status badge, date, slug)
- Has a "New Brand Deck" button that prompts for title, calls `POST /api/admin/brand-decks`, then navigates to the wizard
- Has delete button per deck with confirmation
- Loading skeleton with `animate-pulse`
- Follow existing patterns: `useState` + `useCallback` + `useEffect`, zinc dark theme, amber accents

UI structure:
```
┌─────────────────────────────────────────────┐
│ Brand Decks                    [+ New Deck]  │
├─────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│ │ Brand A  │ │ Brand B  │ │ Brand C  │     │
│ │ draft    │ │ complete │ │ draft    │     │
│ │ Feb 18   │ │ Feb 17   │ │ Feb 16   │     │
│ │ [Edit]   │ │ [View]   │ │ [Edit]   │     │
│ └──────────┘ └──────────┘ └──────────┘     │
└─────────────────────────────────────────────┘
```

**Step 2: Build the wizard page shell**

Create `app/admin/brand-decks/[id]/page.tsx` — a `'use client'` page that:
- Fetches the deck via `GET /api/admin/brand-decks/[id]` on mount
- Shows a step sidebar/progress bar on the left with all wizard steps:
  1. Intake
  2. AI Foundation
  3. Core Identity
  4. Audience
  5. Voice & Messaging
  6. Visual System
  7. Dark Mode
  8. Applications
  9. Motion
  10. Preview
  11. Export
- Clicking a step navigates to it (but steps are gated — can't skip ahead past current progress)
- Right side shows the active step content (initially just placeholder text per step)
- Auto-saves on step change via `PATCH /api/admin/brand-decks/[id]`
- Step state tracked via `currentStep` on the deck record

UI structure:
```
┌────────────┬──────────────────────────────────┐
│ Steps      │ Step Content                      │
│            │                                   │
│ ● Intake   │  [Intake form fields here]        │
│ ○ AI Found │                                   │
│ ○ Identity │                                   │
│ ○ Audience │                                   │
│ ○ Voice    │                                   │
│ ○ Visuals  │                                   │
│ ○ Dark     │                                   │
│ ○ Apps     │                                   │
│ ○ Motion   │                                   │
│ ○ Preview  │                                   │
│ ○ Export   │                                   │
│            │              [Back]  [Next →]      │
└────────────┴──────────────────────────────────┘
```

**Step 3: Verify the wizard loads**

Run: `pnpm dev`
Navigate to `/admin/brand-decks`, create a new deck, verify the wizard page loads with step sidebar.

**Step 4: Commit**

```bash
git add app/admin/brand-decks/
git commit -m "feat(brand-decks): add deck list page and wizard shell UI"
```

---

### Task 5: Build intake step

**Files:**
- Modify: `app/admin/brand-decks/[id]/page.tsx` (replace intake placeholder with real form)

**Step 1: Implement the intake form**

The intake step collects:
- **Business name** (text input, pre-filled from deck title)
- **Industry** (dropdown: wellness, beauty, fashion, food & bev, fitness, lifestyle, tech, creative, retail, services, other)
- **Keywords** (text input — comma-separated vibes like "earthy, feminine, bold, modern")
- **About the business** (textarea — 2-3 sentences about what they do)
- **Target customer** (textarea — who they serve)
- **Existing copy** (textarea, optional — paste Instagram bio, website copy, etc. for voice analysis)
- **Logo upload** (file upload, optional — stores via Vercel Blob since `@vercel/blob` is already in deps)

Form auto-saves to `PATCH /api/admin/brand-decks/[id]` with `{ intake: { ...formData } }` on "Next" click.

Parse existing `deck.intake` JSON on load to pre-fill form if returning to this step.

**Step 2: Test**

Fill out the intake form, click Next, refresh — verify data persists.

**Step 3: Commit**

```bash
git add app/admin/brand-decks/
git commit -m "feat(brand-decks): build intake step with form fields and auto-save"
```

---

## Phase 2: AI Generation

### Task 6: Build AI foundation generation route

**Files:**
- Create: `app/api/admin/brand-decks/[id]/generate/route.ts`

**Step 1: Build the generation endpoint**

This route takes the intake data and generates ALL the AI foundation content in one shot. Uses `@google/genai` SDK (Pattern A from existing codebase) with `gemini-3-flash-preview`.

`POST /api/admin/brand-decks/[id]/generate` with body `{ step: 'foundation' }`

The endpoint:
1. Fetches the deck from DB
2. Parses the intake JSON
3. Sends a structured prompt to Gemini asking it to generate:
   - Brand story (2-3 paragraphs)
   - Mission statement
   - Vision statement
   - 5 core values with descriptions
   - Brand personality attributes (5 adjectives with explanations)
   - 3 tagline options
   - Elevator pitch
   - 3 color palette options (each with primary, secondary, accent as hex codes + psychology explanation)
   - 3 font pairing suggestions (Google Fonts names)
   - 2-3 audience personas (name, age range, occupation, location, pain points, goals, where they hang out)
   - Voice guide (tone attributes, dos and don'ts, example phrases)
   - 4 messaging pillars with descriptions
4. Parses JSON response
5. Saves all generated content into the appropriate JSON columns on the deck
6. Returns the generated content

System prompt should emphasize:
- Write for a real human brand, not a corporation
- Be specific and unique to this business, not generic
- Color palettes should be cohesive and modern
- Personas should feel like real people

**Step 2: Test**

Create a deck, fill intake, call the generate endpoint, verify all fields populated.

**Step 3: Commit**

```bash
git add app/api/admin/brand-decks/[id]/generate/
git commit -m "feat(brand-decks): add AI foundation generation via Gemini"
```

---

### Task 7: Build AI foundation step UI

**Files:**
- Modify: `app/admin/brand-decks/[id]/page.tsx` (add AI Foundation step)

**Step 1: Build the AI Foundation step**

When the user clicks "Next" from Intake:
1. Show a loading state ("Generating your brand foundation..." with animated progress)
2. Call `POST /api/admin/brand-decks/[id]/generate` with `{ step: 'foundation' }`
3. Once complete, show all generated content in organized sections with ability to:
   - **Regenerate** any individual section (call generate again with `{ step: 'foundation', regenerate: 'brandStory' }`)
   - See all 3 color palette options side-by-side with psychology explanations
   - See all 3 tagline options
   - See persona cards
4. User reviews the AI output, then clicks "Next" to start refining

This step is read-only — user sees what AI generated. Editing happens in subsequent steps.

**Step 2: Commit**

```bash
git add app/admin/brand-decks/
git commit -m "feat(brand-decks): add AI foundation step with generation UI"
```

---

### Task 8: Build Unsplash search proxy route

**Files:**
- Create: `app/api/admin/brand-decks/unsplash/route.ts`

**Step 1: Build the Unsplash proxy**

`GET /api/admin/brand-decks/unsplash?query=earthy+feminine&page=1`

Proxies to `https://api.unsplash.com/search/photos` with the `UNSPLASH_ACCESS_KEY` env var. Returns simplified results:

```ts
{ images: [{ id, urls: { small, regular, full }, alt_description, photographer, photographerUrl }] }
```

This keeps the API key server-side and simplifies the response.

**Step 2: Commit**

```bash
git add app/api/admin/brand-decks/unsplash/
git commit -m "feat(brand-decks): add Unsplash search proxy route"
```

---

## Phase 3: Visual System Steps

### Task 9: Build Core Identity step

**Files:**
- Modify: `app/admin/brand-decks/[id]/page.tsx`

**Step 1: Build the step**

Editable form pre-filled with AI-generated content from `deck.identity`:
- **Brand story** (rich textarea, pre-filled with AI draft)
- **Mission** (text input)
- **Vision** (text input)
- **Values** (list of 3-5, each with name + description, add/remove/reorder)
- **Personality attributes** (list of 5 adjectives with descriptions)

Each field is editable. "Regenerate" button next to each field calls the AI to get a new suggestion.

Save on "Next" to `PATCH /api/admin/brand-decks/[id]` with `{ identity: { ... } }`.

**Step 2: Commit**

```bash
git add app/admin/brand-decks/
git commit -m "feat(brand-decks): build core identity wizard step"
```

---

### Task 10: Build Audience step

**Files:**
- Modify: `app/admin/brand-decks/[id]/page.tsx`

**Step 1: Build the step**

Shows AI-generated persona cards from `deck.audience`. Each card has:
- Name, age range, occupation, location
- Pain points (bullet list)
- Goals (bullet list)
- Where they hang out (channels/platforms)
- Optional photo from Unsplash (search by persona keywords)

All fields are editable inline. Can add/remove personas (min 1, max 4).

"Regenerate persona" button per card.

**Step 2: Commit**

```bash
git add app/admin/brand-decks/
git commit -m "feat(brand-decks): build audience personas wizard step"
```

---

### Task 11: Build Voice & Messaging step

**Files:**
- Modify: `app/admin/brand-decks/[id]/page.tsx`

**Step 1: Build the step**

Pre-filled from `deck.voice`:
- **Tone attributes** (e.g., "warm, witty, approachable" — editable tags)
- **Elevator pitch** (textarea)
- **Taglines** (show all 3 AI options, pick one or write custom)
- **Messaging pillars** (4 cards, each with title + description)
- **Voice dos and don'ts** (two columns — "Do say / write like this" vs "Don't say / write like this")
- **Example phrases** (3-5 example sentences in the brand voice)

If user pasted existing copy in intake, show a "Voice Analysis" section at the top that shows what the AI detected from their writing style.

**Step 2: Commit**

```bash
git add app/admin/brand-decks/
git commit -m "feat(brand-decks): build voice and messaging wizard step"
```

---

### Task 12: Build Visual System step (colors + typography)

**Files:**
- Modify: `app/admin/brand-decks/[id]/page.tsx`

**Step 1: Build the color section**

Pre-filled from `deck.visuals`:
- Show all 3 AI-generated palette options as clickable cards
- Each card shows: primary, secondary, accent swatches with hex values + psychology explanation
- Selected palette is highlighted
- Custom color picker (HTML color input) to override any swatch
- Display contrast ratios (AA/AAA) between text colors and backgrounds
- Show hex, RGB values for each color

**Step 2: Build the typography section**

- Show AI-suggested font pairings (3 options)
- Each option shows: heading font + body font rendered with sample text
- Load fonts dynamically from Google Fonts API (use `<link>` tag injection)
- Selected pairing is highlighted
- Typography hierarchy preview: H1, H2, H3, body, caption

**Step 3: Commit**

```bash
git add app/admin/brand-decks/
git commit -m "feat(brand-decks): build visual system step with colors and typography"
```

---

### Task 13: Build Photography & Mood Board step

**Files:**
- Modify: `app/admin/brand-decks/[id]/page.tsx`

**Step 1: Build the step**

- **Keyword mood board**: Auto-populated from intake keywords via Unsplash search. Shows a grid of images.
- **Search**: Unsplash search bar to find more images (calls `/api/admin/brand-decks/unsplash`)
- **Select/deselect** images for the mood board (toggle selection)
- **Upload** custom images via Vercel Blob
- **Photography style guide** (AI-generated, editable): lighting direction, color treatment, subject style, composition notes
- **Imagery dos and don'ts**: AI-generated examples with descriptions
- Selected images stored in `deck.images`

**Step 2: Commit**

```bash
git add app/admin/brand-decks/
git commit -m "feat(brand-decks): build photography and mood board step"
```

---

### Task 14: Build Dark Mode step

**Files:**
- Modify: `app/admin/brand-decks/[id]/page.tsx`

**Step 1: Build the step**

- Auto-generate dark mode palette from the selected light palette:
  - Invert luminance while preserving hue
  - Darken backgrounds, lighten foreground text
  - Keep accent colors recognizable
- Side-by-side preview: light vs dark
- Manual override per swatch with color picker
- Preview a sample UI card in both modes

Algorithm for dark mode generation (client-side):
- Convert hex to HSL
- For backgrounds: set lightness to 10-15%
- For text: set lightness to 85-95%
- For accents: keep hue, adjust saturation +10%, lightness to 50-60%

**Step 2: Commit**

```bash
git add app/admin/brand-decks/
git commit -m "feat(brand-decks): build dark mode palette step"
```

---

## Phase 4: Applications & Mockups

### Task 15: Build Application Mockup components

**Files:**
- Create: `lib/brand-decks/mockups.tsx` (reusable mockup components)

**Step 1: Build mockup components**

Create client-side React components that render live mockups using the deck's brand data:

- **InstagramPostMockup** — phone frame with IG post using brand colors, fonts, mood board image
- **InstagramProfileMockup** — profile header with brand colors
- **FacebookCoverMockup** — cover photo with brand overlay
- **BusinessCardMockup** — front and back with brand name, contact, colors, fonts
- **LetterheadMockup** — A4 page with header using brand elements
- **EmailSignatureMockup** — formatted email signature block
- **WebsiteHeroMockup** — simplified website hero section with brand colors, fonts, mood board image

Each component accepts: `{ colors, typography, brandName, tagline, images }` props and renders a styled preview.

**Step 2: Commit**

```bash
git add lib/brand-decks/
git commit -m "feat(brand-decks): build application mockup components"
```

---

### Task 16: Build Applications wizard step

**Files:**
- Modify: `app/admin/brand-decks/[id]/page.tsx`

**Step 1: Build the step**

Uses the mockup components from Task 15. Shows all mockups in a scrollable grid:
- Instagram post + profile
- Facebook/LinkedIn cover
- Business card (front + back)
- Letterhead
- Email signature
- Website hero

All render live using selected colors, fonts, and mood board images. No editing needed here — this is a preview of how the brand looks applied. User can go back to previous steps to adjust if something doesn't look right.

**Step 2: Commit**

```bash
git add app/admin/brand-decks/
git commit -m "feat(brand-decks): build applications mockup wizard step"
```

---

### Task 17: Build Motion Direction step

**Files:**
- Modify: `app/admin/brand-decks/[id]/page.tsx`

**Step 1: Build the step**

- AI generates motion direction based on brand personality (e.g., "elegant and smooth" vs "energetic and bouncy")
- Show 3-4 animation style options with live CSS animation demos:
  - **Elegant**: Slow fades, gentle slides, ease-in-out
  - **Energetic**: Quick bounces, spring physics, overshoot
  - **Minimal**: Subtle opacity changes, clean cuts
  - **Playful**: Wobbles, scale pops, rotation
- Each option has a name, description, and live demo element
- User picks one
- Transition speed preference: slow, medium, fast
- Save to `deck.motion`

**Step 2: Commit**

```bash
git add app/admin/brand-decks/
git commit -m "feat(brand-decks): build motion direction wizard step"
```

---

## Phase 5: Deck Rendering & Export

### Task 18: Build deck page components for rendering

**Files:**
- Create: `lib/brand-decks/pages.tsx` (all 30 page components)

**Step 1: Build page components**

Create React components for each page of the brand deck. These are used for both the preview and PDF export. Each component is a full-page layout (letter size ratio: 8.5x11).

Build all 30 page components:
1. `CoverPage` — brand name, tagline, date, mood board hero image
2. `TableOfContentsPage` — auto-generated from included sections
3. `BrandStoryPage` — story text with decorative layout
4. `MissionVisionPage` — mission + vision in two columns
5. `CoreValuesPage` — values in a grid layout
6. `PersonaPage` — one per persona (photo, details, pain points, goals)
7. `BrandPersonalityPage` — personality wheel or attribute cards
8. `ElevatorPitchPage` — pitch + taglines displayed prominently
9. `VoiceGuidePage` — tone attributes, dos/don'ts columns
10. `MessagingPillarsPage` — 4 pillar cards
11. `ColorPalettePrimaryPage` — large swatches with hex/RGB
12. `ColorPaletteSecondaryPage` — secondary + accent + dark mode
13. `ColorPsychologyPage` — what each color communicates
14. `TypographyPrimaryPage` — heading font showcase with alphabet, sizes
15. `TypographyHierarchyPage` — H1-H6, body, caption examples
16. `PhotographyStylePage` — mood board grid with style notes
17. `ImageryDosAndDontsPage` — two columns with examples
18. `PatternsTexturesPage` — visual pattern direction
19. `LogoUsagePage` — logo placement rules (if logo provided)
20. `SocialInstagramPage` — IG post + profile mockups
21. `SocialFacebookLinkedInPage` — FB/LI cover mockups
22. `BusinessCardPage` — front + back mockups
23. `LetterheadEmailSigPage` — letterhead + email signature
24. `WebsitePreviewPage` — hero section mockup
25. `PackagingMerchPage` — packaging/merch concepts (if applicable)
26. `MotionDirectionPage` — motion style description with stills
27. `DosAndDontsSummaryPage` — brand-wide dos and don'ts
28. `QuickReferencePage` — one-page cheat sheet with all key elements
29. `CreditsPage` — "Created with Sunshine Brand Studio" + contact info

Each component takes the full deck data as props and renders using the brand's own colors and fonts.

**Step 2: Commit**

```bash
git add lib/brand-decks/pages.tsx
git commit -m "feat(brand-decks): build all 30 deck page components"
```

---

### Task 19: Build deck preview step

**Files:**
- Modify: `app/admin/brand-decks/[id]/page.tsx`

**Step 1: Build the preview step**

- Renders all page components in sequence as a scrollable preview
- Each page in a bordered card at letter-size ratio
- Page numbers displayed
- Zoom controls (50%, 75%, 100%)
- "Back to step X" links if something needs adjustment
- "Continue to Export" button

**Step 2: Commit**

```bash
git add app/admin/brand-decks/
git commit -m "feat(brand-decks): build full deck preview wizard step"
```

---

### Task 20: Build PDF export route

**Files:**
- Create: `app/api/admin/brand-decks/[id]/export-pdf/route.ts`

**Step 1: Install puppeteer**

Run: `pnpm add puppeteer`

**Step 2: Build the export route**

`POST /api/admin/brand-decks/[id]/export-pdf`

1. Fetch deck from DB
2. Render a hidden page at an internal URL (or use `renderToString` approach)
3. Launch Puppeteer, navigate to an internal render URL, print to PDF
4. Return the PDF as a response with `Content-Type: application/pdf`

Alternative approach (simpler for Vercel): Use a render route at `/api/admin/brand-decks/[id]/render` that returns full HTML of the deck, then use Puppeteer to PDF it.

Note: For Vercel deployment, may need `@sparticuz/chromium` for serverless Puppeteer. Handle this in the route with conditional Chromium loading.

**Step 3: Commit**

```bash
git add app/api/admin/brand-decks/[id]/export-pdf/
git commit -m "feat(brand-decks): add PDF export route with Puppeteer"
```

---

### Task 21: Build public shareable web view

**Files:**
- Create: `app/brand/[slug]/page.tsx`

**Step 1: Build the public page**

This is a public (no auth) Next.js page that:
1. Fetches the deck by slug from DB
2. If not found or status is 'draft', shows 404
3. Renders all deck pages as a beautiful scrollable web page
4. Uses the brand's own colors and fonts throughout
5. Responsive — looks good on mobile too
6. Footer: "Created with Sunshine Brand Studio"

This reuses the same page components from Task 18 but in a web-optimized layout (scrollable, not paginated).

**Step 2: Update middleware to NOT protect `/brand/[slug]`**

Verify `/brand/*` is not caught by the admin middleware matcher. It shouldn't be since the matcher only covers `/admin` and `/api/admin` paths.

**Step 3: Commit**

```bash
git add app/brand/
git commit -m "feat(brand-decks): add public shareable brand deck web view"
```

---

### Task 22: Build Export step

**Files:**
- Modify: `app/admin/brand-decks/[id]/page.tsx`

**Step 1: Build the export step**

The final wizard step with three actions:
- **Download PDF** — calls `/api/admin/brand-decks/[id]/export-pdf`, triggers browser download
- **Copy shareable link** — copies `https://thesunshineeffect.com/brand/[slug]` to clipboard with toast confirmation
- **Mark as complete** — sets `status: 'completed'` via PATCH

Also show:
- Deck title and creation date
- Link to public view (opens in new tab)
- "Edit deck" button to go back to any step

**Step 2: Update deck status**

On export, PATCH the deck to `status: 'completed'`.

**Step 3: Commit**

```bash
git add app/admin/brand-decks/
git commit -m "feat(brand-decks): build export wizard step with PDF download and shareable link"
```

---

## Phase 6: Polish

### Task 23: Build assets zip export

**Files:**
- Create: `app/api/admin/brand-decks/[id]/export-assets/route.ts`

**Step 1: Install archiver or jszip**

Run: `pnpm add jszip`

**Step 2: Build the route**

`POST /api/admin/brand-decks/[id]/export-assets`

Generates a zip file containing:
- `brand-deck.pdf` — the full deck PDF
- `colors.json` — all color values (hex, RGB)
- `colors.css` — CSS custom properties for all brand colors
- `fonts.txt` — Google Fonts links and names
- `mood-board/` — downloaded Unsplash images (with attribution)
- `mockups/` — social templates, business card images
- `README.txt` — overview of contents and usage instructions

Return as `application/zip` response.

**Step 3: Commit**

```bash
git add app/api/admin/brand-decks/[id]/export-assets/
git commit -m "feat(brand-decks): add assets zip export route"
```

---

### Task 24: Add regeneration for individual sections

**Files:**
- Modify: `app/api/admin/brand-decks/[id]/generate/route.ts`

**Step 1: Add per-section regeneration**

Extend the generate route to accept `{ step: 'regenerate', section: 'brandStory' | 'taglines' | 'personas' | 'voiceGuide' | 'colorPalettes' | ... }`.

Each regeneration call:
1. Reads the current deck data for context
2. Generates only the requested section
3. Returns just that section's new content (doesn't overwrite other fields)

This lets users regenerate individual pieces without losing their edits elsewhere.

**Step 2: Commit**

```bash
git add app/api/admin/brand-decks/[id]/generate/
git commit -m "feat(brand-decks): add per-section AI regeneration"
```

---

### Task 25: Final polish and testing

**Files:**
- All brand deck files

**Step 1: End-to-end walkthrough**

Walk through the entire wizard flow:
1. Create new deck from list page
2. Fill intake
3. Generate AI foundation
4. Review and edit all steps
5. Preview full deck
6. Export PDF
7. View public link
8. Download assets zip

**Step 2: Edge cases**

- Empty fields handling
- Very long text content
- No logo uploaded (skip logo page)
- No Unsplash images selected (skip imagery page)
- Mobile responsiveness of wizard
- Loading states for all AI calls

**Step 3: Commit**

```bash
git add .
git commit -m "feat(brand-decks): polish and edge case handling"
```

---

## Dependencies to Install

```bash
pnpm add puppeteer jszip
# For Vercel serverless Puppeteer:
pnpm add @sparticuz/chromium
```

## Environment Variables

Add to `.env.local`:
```
UNSPLASH_ACCESS_KEY=your_key_here
```

`GEMINI_API_KEY` already exists.

## Summary

| Phase | Tasks | What's Built |
|-------|-------|-------------|
| 1: Foundation | 1-5 | DB, CRUD API, nav, wizard shell, intake |
| 2: AI Generation | 6-8 | Gemini integration, foundation UI, Unsplash proxy |
| 3: Visual System | 9-14 | Identity, audience, voice, colors, typography, mood board, dark mode |
| 4: Mockups | 15-17 | Mockup components, applications step, motion |
| 5: Rendering | 18-22 | Page components, preview, PDF export, public view, export step |
| 6: Polish | 23-25 | Assets zip, per-section regeneration, final polish |
