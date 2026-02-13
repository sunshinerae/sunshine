# Event Check-In Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a QR-scannable event check-in page at `/checkin` that collects attendee info and shows Venmo + Zelle tip links.

**Architecture:** Single client-component page with two states (form / confirmation). API route saves to PostgreSQL via Drizzle ORM and syncs to Flodesk. Payment links open external apps directly.

**Tech Stack:** Next.js 15 App Router, React 19, Drizzle ORM, Zod, Framer Motion, Tailwind CSS v4

---

### Task 1: Add event config and payment links to constants

**Files:**
- Modify: `lib/constants.ts`

**Step 1: Add EVENT_CONFIG and PAYMENT_LINKS exports**

Add to the bottom of `lib/constants.ts`:

```ts
export const EVENT_CONFIG = {
  name: 'Love Body Ritual',
};

export const PAYMENT_LINKS = {
  venmo: 'https://venmo.com/u/SunshineB',
  zelle: 'tel:19095189378',
};
```

**Step 2: Commit**

```bash
git add lib/constants.ts
git commit -m "feat: add event check-in config and payment links"
```

---

### Task 2: Add event_checkins table to database schema

**Files:**
- Modify: `db/schema.ts`

**Step 1: Add eventCheckins table**

Add to the bottom of `db/schema.ts`:

```ts
// Event check-ins (QR code sign-in at events)
export const eventCheckins = pgTable('event_checkins', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  checkedInAt: timestamp('checked_in_at').defaultNow().notNull(),
});
```

**Step 2: Generate migration**

```bash
npx drizzle-kit generate
```

Expected: New migration file created in `drizzle/` with `CREATE TABLE "event_checkins"`.

**Step 3: Commit**

```bash
git add db/schema.ts drizzle/
git commit -m "feat: add event_checkins database table and migration"
```

---

### Task 3: Create the check-in API route

**Files:**
- Create: `app/api/checkin/route.ts`

**Step 1: Create the POST endpoint**

Create `app/api/checkin/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { eventCheckins } from '@/db/schema';

const checkinSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(7, 'Valid phone number is required'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = checkinSchema.parse(body);

    // Save to database
    await db.insert(eventCheckins).values({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
    });

    // Sync to Flodesk (same pattern as subscribe route)
    if (process.env.FLODESK_API_KEY) {
      try {
        const flodeskPayload: Record<string, unknown> = {
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
        };

        if (process.env.FLODESK_SEGMENT_ID) {
          flodeskPayload.segment_ids = [process.env.FLODESK_SEGMENT_ID];
        }

        await fetch('https://api.flodesk.com/v1/subscribers', {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${Buffer.from(process.env.FLODESK_API_KEY + ':').toString('base64')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(flodeskPayload),
        });
      } catch (flodeskError) {
        console.error('Flodesk API error:', flodeskError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid data' },
        { status: 400 }
      );
    }

    console.error('Check-in error:', error);
    return NextResponse.json(
      { success: false, error: 'Unable to check in' },
      { status: 500 }
    );
  }
}
```

**Step 2: Commit**

```bash
git add app/api/checkin/route.ts
git commit -m "feat: add event check-in API route with Flodesk sync"
```

---

### Task 4: Build the check-in page

**Files:**
- Create: `app/checkin/page.tsx`

**Step 1: Create the full check-in page**

Create `app/checkin/page.tsx`. This is a `'use client'` component with two states: form and confirmation.

**Form state** (mobile-first, matches landing page aesthetic):
- Background: `bg-sun-cream min-h-screen`
- Header: The Sunshine Effect logo (`/logo.png` via next/image) + event name in `font-headline`
- Four inputs: firstName, lastName, email, phone — styled with rounded-full borders matching `newsletter-signup.tsx` input styles:
  - `w-full h-11 px-4 rounded-full font-body text-sm border-2 outline-none transition-all duration-200 bg-sun-paper border-sun-sand text-sun-cocoa placeholder:text-sun-cocoa/50 focus:border-sun-plum focus:ring-2 focus:ring-sun-plum/30 focus:ring-offset-0`
- First name + last name on same row (`grid grid-cols-2 gap-3`)
- CTAButton "Check In" variant="white" (sun-plum bg)
- Wrapped in FadeInView for entrance animation
- Form uses `useState` for fields and status (`idle | loading | success | error`)
- On submit: POST to `/api/checkin`, on success set status to `'success'`

**Confirmation state** (matches thank-you page vibe):

Section 1 — Hero (sun-plum bg):
- `section className="bg-sun-plum text-white px-6 py-16 md:py-20 overflow-hidden"`
- ScaleIn emoji: `<span className="text-6xl block mb-4">🔥</span>`
- FadeInView headline: `<h1 className="font-headline text-[clamp(2.5rem,6vw,4.5rem)] uppercase leading-[0.9] tracking-tight">You're in the room.</h1>`
- FadeInView subtext: `<p className="font-subhead text-lg text-sun-gold">Love Body Ritual</p>` (use `EVENT_CONFIG.name`)

Section 2 — Tips (sun-cream bg):
- `section className="bg-sun-cream px-6 py-12 md:py-16 overflow-hidden"`
- Subhead: `<p className="font-subhead uppercase tracking-[0.15em] font-bold text-xs text-sun-plum mb-3">Show some love</p>`
- Heading: `<h2 className="font-headline text-[clamp(1.5rem,4vw,2.5rem)] uppercase leading-[0.9] tracking-tight text-sun-plum mb-6">Leave a tip</h2>`
- StaggerChildren with two StaggerItem cards — same style as social link cards on thank-you page:
  - Each card: `<a href={PAYMENT_LINKS.venmo} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 px-6 py-4 rounded-2xl bg-sun-plum hover:bg-sun-plum/90 transition-colors duration-300 w-full">`
  - Inside: icon circle (`inline-flex h-12 w-12 items-center justify-center rounded-full bg-sun-paper text-sun-plum font-headline text-lg group-hover:scale-110 transition-transform duration-300`) with `$` symbol
  - Label: `font-headline text-base uppercase text-white` — "Venmo" / "Zelle"
  - Sublabel: `font-body text-xs text-white/80` — "Tap to open Venmo" / "Tap to open Zelle"
- Closing: `<p className="font-body text-sm text-sun-cocoa/60 mt-8 text-center">Thank you for being here.</p>`

**Step 2: Verify build**

```bash
npm run build
```

Expected: Build passes with no errors.

**Step 3: Commit**

```bash
git add app/checkin/page.tsx
git commit -m "feat: add event check-in page with branded confirmation and tip links"
```

---

### Task 5: Verify the full flow

**Step 1: Start dev server**

```bash
npm run dev
```

**Step 2: Test manually**

1. Open `http://localhost:3000/checkin` on mobile viewport
2. Verify form renders with logo, event name, four fields, check-in button
3. Fill out form and submit
4. Verify confirmation screen shows with fire emoji, headline, Venmo + Zelle buttons
5. Verify Venmo link opens `https://venmo.com/u/SunshineB`
6. Verify Zelle link opens phone dialer for `19095189378`

**Step 3: Final commit if any tweaks needed**

```bash
git add -A
git commit -m "fix: check-in page polish"
```
