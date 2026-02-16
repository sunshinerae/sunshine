# AI Prospector - Design Doc

**Date:** 2026-02-15
**Status:** Approved
**Goal:** Help The Sunshine Effect find new leads, partners, and venues through AI-powered local business discovery.

## Problem

The Sunshine Effect currently gets new people primarily through events. There's no systematic way to find and reach out to potential partners, venues, influencers, or businesses in LA that could grow the community. She's doing personalized emails manually but has no tool to discover WHO to reach out to.

## Solution

An AI-powered prospecting tool in the admin panel at `/admin/growth` that lets her search for local businesses and people, get AI-analyzed results with relevance scores and suggested outreach messages, and save prospects to track outreach.

## Architecture

### Search Pipeline

1. User types natural language query (e.g., "yoga studios in Silver Lake")
2. API route calls **Claude Sonnet** with the `web_search_20250305` tool — Claude searches the web itself (no separate search API needed)
3. Claude searches, analyzes results, and returns structured JSON:
   - Extract contact info (email, phone, website, Instagram)
   - Score relevance to The Sunshine Effect (0-100)
   - Generate fit rationale
   - Write personalized outreach message in brand voice
   - Categorize (yoga, fitness, wellness, venue, influencer, beauty, etc.)
4. Enriched results returned to UI as scored cards

### Data Model

New `prospects` table in `db/schema.ts`:

```
prospects
├── id (serial PK)
├── businessName (text, not null)
├── contactName (text)
├── email (text)
├── phone (text)
├── website (text)
├── instagram (text)
├── category (text) — yoga, fitness, wellness, venue, influencer, beauty, food, lifestyle, other
├── location (text)
├── relevanceScore (integer) — 0-100
├── aiRationale (text)
├── suggestedOutreach (text)
├── status (text) — new, contacted, responded, converted, dismissed
├── source (text) — the search query that found them
├── convertedToSponsorId (integer, FK → sponsors, nullable)
├── createdAt (timestamp, defaultNow)
├── updatedAt (timestamp, defaultNow)
```

### API Routes

| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/admin/growth/search` | Run AI-powered search |
| GET | `/api/admin/growth/prospects` | List saved prospects (with filters) |
| POST | `/api/admin/growth/prospects` | Save a prospect |
| PATCH | `/api/admin/growth/prospects/[id]` | Update prospect (status, notes) |
| DELETE | `/api/admin/growth/prospects/[id]` | Delete a prospect |

### Search API Request/Response

**POST `/api/admin/growth/search`**

Request:
```json
{
  "query": "yoga studios in Silver Lake and Echo Park"
}
```

Response:
```json
{
  "results": [
    {
      "businessName": "Silver Lake Yoga",
      "contactName": "Jane Smith",
      "email": "info@silverlakeyoga.com",
      "phone": null,
      "website": "https://silverlakeyoga.com",
      "instagram": "@silverlakeyoga",
      "category": "yoga",
      "location": "Silver Lake, LA",
      "relevanceScore": 85,
      "aiRationale": "Community-focused yoga studio with similar audience demographics. They host workshops and retreats, making them a natural collaboration partner.",
      "suggestedOutreach": "Hi Jane! I'm Sunshine, founder of The Sunshine Effect — a wellness community for women in LA. I love what you're building at Silver Lake Yoga, especially your workshop series. I'd love to explore a collaboration — maybe a joint Golden Hour event at your space? Would you be open to a quick coffee chat?"
    }
  ],
  "query": "yoga studios in Silver Lake and Echo Park"
}
```

## UI Design

Single page at `/admin/growth`, dark zinc theme, matching existing admin patterns.

### Layout

**Top: Search**
- Large text input with placeholder: "Find yoga studios in Silver Lake..."
- Search button with sparkle icon
- Recent searches as clickable chips below the input
- Loading state: shimmer/skeleton cards

**Middle: Results / Prospects (Tab Toggle)**

Tab 1 - **Search Results:**
- 2-column card grid
- Each card shows:
  - Business name (bold) + category badge
  - Location
  - Relevance score as colored indicator (green 70+, yellow 40-69, red <40)
  - "Why they're a fit" — 1-2 sentence rationale
  - Contact info: website, Instagram, email/phone
  - Expandable "Suggested Outreach" with copy button
  - Actions: Save as Prospect | Add to Sponsors | Dismiss

Tab 2 - **My Prospects:**
- Table/list of saved prospects
- Status column: New → Contacted → Responded → Converted → Dismissed
- Quick filters by status and category
- Inline status update (dropdown or click-to-advance)
- Click row to expand/edit details

### Interactions
- Saving a prospect stores AI-generated data in DB
- "Add to Sponsors" creates a sponsor record and sets `convertedToSponsorId`
- Copy outreach message to clipboard with toast confirmation
- Status updates are optimistic with error fallback

## Dependencies

- `@anthropic-ai/sdk` — Already installed (uses built-in `web_search_20250305` tool)
- No new npm packages needed
- No additional API keys needed (uses existing `ANTHROPIC_API_KEY`)

## Environment Variables

- No new env vars needed — uses existing `ANTHROPIC_API_KEY`
- Web search costs $10/1,000 searches on the Anthropic API (plus standard token costs)

## Files to Create/Modify

| Action | File |
|--------|------|
| Create | `app/admin/growth/page.tsx` |
| Create | `app/api/admin/growth/search/route.ts` |
| Create | `app/api/admin/growth/prospects/route.ts` |
| Create | `app/api/admin/growth/prospects/[id]/route.ts` |
| Modify | `db/schema.ts` (add prospects table) |
| Generate | New Drizzle migration |

## Out of Scope

- Content generation (Instagram captions, email copy)
- Lead magnet landing pages
- Referral tracking
- Changes to public-facing site
- Automated outreach (she does this manually)
