# Admin Tool — "Know Your People"

> Private, password-protected admin panel for enriching your community with notes, tags, photos, and attendance insights. A personal cheat sheet you pull up before writing emails in Flodesk.

## Scope

- **No messaging.** This tool never sends emails. You use it to look people up, then go to Flodesk to write.
- **Just you.** Single password gate, no user accounts.
- **One page.** List + slide-out detail panel. No routing within admin.

---

## Features

### 1. Password Gate

- Route: `/admin`
- Single password input, stored as `ADMIN_PASSWORD` env var
- Session persists via a cookie (httpOnly, secure) so you don't re-enter every page load
- No username, no registration, no recovery

### 2. Dashboard Summary

Three stats at the top of the page:

- **Total people** — deduplicated count across all tables
- **New this month** — signups in the current calendar month
- **Events attended this month** — total check-ins this month

### 3. Smart Nudges

A banner below the summary, rotating through actionable prompts:

- "X new signups this week with no notes"
- "X people have no tags yet"
- "Name hasn't checked in since [date]" (2+ past check-ins, none in 30 days)
- "X starred people you haven't reached out to in 4+ weeks"

Nudges are computed from real data, not hardcoded.

### 4. People List

Each row shows:

- **Photo** — circular avatar (initials fallback if no upload)
- **Name** — first + last
- **Email** — with a copy button (one click to clipboard)
- **Phone** — if available
- **Source badges** — colored pills: newsletter, sms, event, contact, launch
- **Tags** — colored pills, clickable to filter the list
- **Star indicator** — filled star for VIPs, outline for others, clickable to toggle
- **Last activity date** — most recent signup or check-in
- **Notes preview** — first line of most recent note, truncated

**List controls:**

- Search bar (filters by name or email)
- Tag filter chips with counts — "breathwork (7)", "career-pivot (4)"
- Sort: recent activity (default) | newest signup | starred first
- Starred people always float to the top within the chosen sort

### 5. Person Detail (Slide-out Panel)

Opens when you click a person. No page navigation — the list stays visible behind.

#### Header
- Large circular photo (click to upload/change)
- Name, email (copy button), phone
- Star toggle
- Source badges
- "Last reached out" button — click to stamp today's date, shows "Reached out X days ago"

#### Attendance Insights
- Total check-ins
- Favorite event type (Golden Hour vs Lunar Room, based on count)
- First event attended (date + name)
- Last event attended (date + name)
- Streak indicator: "regular" (3+ events), "occasional" (2), "one-timer" (1), "subscriber only" (0)

#### Tags
- Current tags as removable pills
- "Add tag" input with autocomplete from existing tags, or create new
- Tags are freeform — you define them as you go

#### Notes
- Chronological list of notes with timestamps
- "Add note" text area at the top
- Each note shows when it was written
- Editable and deletable

#### Timeline
- Auto-generated chronological feed pulling from existing DB tables:
  - "Signed up via newsletter — Jan 12"
  - "Checked in to Golden Hour Gathering — Feb 15"
  - "Submitted contact form (topic: Coaching) — Mar 1"
  - "Signed up for SMS — Mar 10"
- Interspersed with your notes and "reached out" stamps
- Most recent at the top

---

## Database Changes

### New Tables

**`people`**
- `id` — serial, PK
- `email` — varchar 255, unique (dedup key)
- `firstName` — varchar 255, nullable
- `lastName` — varchar 255, nullable
- `phone` — varchar 50, nullable
- `photoUrl` — text, nullable (Vercel Blob URL)
- `starred` — boolean, default false
- `lastReachedOut` — timestamp, nullable
- `createdAt` — timestamp, default now
- `updatedAt` — timestamp, default now

**`personNotes`**
- `id` — serial, PK
- `personId` — integer, FK to people.id
- `content` — text
- `createdAt` — timestamp, default now
- `updatedAt` — timestamp, default now

**`tags`**
- `id` — serial, PK
- `name` — varchar 100, unique
- `color` — varchar 7 (hex), nullable
- `createdAt` — timestamp, default now

**`personTags`**
- `id` — serial, PK
- `personId` — integer, FK to people.id
- `tagId` — integer, FK to tags.id
- `createdAt` — timestamp, default now
- Unique index on (personId, tagId)

### No Changes to Existing Tables

The `subscriptions`, `eventCheckins`, and `contacts` tables stay as-is. The timeline queries them by email to stitch together a person's history. The `people` table is the enrichment layer on top.

### Sync Strategy

- When someone signs up or checks in, a background step checks if a `people` record exists for that email
- If not, one is auto-created with whatever name/phone data is available
- If yes, missing fields (like phone) are backfilled if the new data has them
- Existing notes, tags, and photos are never overwritten

---

## Tech Stack

- **Route:** `/admin` — Next.js App Router page
- **Auth:** API route `/api/admin/auth` sets httpOnly cookie, middleware checks it
- **Storage:** Vercel Blob for photo uploads
- **Database:** Same Neon PostgreSQL + Drizzle ORM
- **UI:** Same Tailwind + Radix + Framer Motion stack as the rest of the site
- **API routes:**
  - `POST /api/admin/auth` — password check, set cookie
  - `GET /api/admin/people` — list with search/filter/sort
  - `GET /api/admin/people/[id]` — detail with timeline
  - `PATCH /api/admin/people/[id]` — update star, lastReachedOut, photo
  - `POST /api/admin/people/[id]/notes` — add note
  - `PATCH /api/admin/people/[id]/notes/[noteId]` — edit note
  - `DELETE /api/admin/people/[id]/notes/[noteId]` — delete note
  - `POST /api/admin/people/[id]/tags` — add tag
  - `DELETE /api/admin/people/[id]/tags/[tagId]` — remove tag
  - `GET /api/admin/tags` — list all tags with counts
  - `POST /api/admin/tags` — create new tag
  - `POST /api/admin/upload` — photo upload to Vercel Blob
  - `GET /api/admin/stats` — dashboard summary + nudges

---

## Design Direction

- Dark-ish admin feel — not the cream/plum brand palette, something neutral so it feels like a separate tool
- Clean, dense layout — this is a utility, not a marketing page
- Responsive — works on your phone so you can look someone up at an event

---

## Out of Scope

- Email sending from admin
- Flodesk integration (you handle that manually)
- Multi-user / roles
- Bulk operations
- Export/import
