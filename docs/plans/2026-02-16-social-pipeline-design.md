# Social Pipeline Design — The Sunshine Effect

**Date:** 2026-02-16
**Status:** Approved

## Goals

1. **Community growth** — find and engage women in LA interested in wellness, drive signups/event attendance
2. **Sponsor visibility** — showcase sponsors in organic content
3. **Mixed content strategy** — growth-focused + sponsor showcase posts together

## Architecture

Three layers:

### Layer 1: Services (API Wrappers)

- `lib/social/twitter.service.ts` — Twitter API v2, OAuth 1.0a, rate limiting, tweet/reply/search/media upload
- `lib/social/instagram.service.ts` — Meta Graph API, container→publish flow for feed/carousel/reel, hashtag search, commenting
- `lib/social/rate-limiter.ts` — Token bucket rate limiter (port from Alliance)
- `lib/social/published-log.ts` — Append to JSON logs, de-dupe tracking

### Layer 2: Content Engine

- `lib/social/voice.ts` — Sunshine voice system prompt + forbidden phrases
- `lib/social/content-types.ts` — Weighted content types + generation prompts
- `lib/social/hashtags.ts` — Outreach vertical bank (8 verticals)
- `lib/social/scoring.ts` — Engagement scoring for Twitter + IG targets

### Layer 3: Orchestration Scripts

- `scripts/social/post-content.ts` — Generate + post content to Twitter/IG/both
- `scripts/social/search-engage-twitter.ts` — Twitter search → score → reply
- `scripts/social/ig-outreach.ts` — IG hashtag search → score → comment
- `scripts/social/event-promo.ts` — Multi-post event campaign from natural language
- `scripts/social/check-credentials.ts` — Verify API keys

## Voice Definition

```
You are the voice of The Sunshine Effect — a wellness community
for women in LA run by a real woman who's funny, warm, and direct.

Rules:
- Write like a text from a friend, not a brand
- Use lowercase when it feels natural
- Humor > polish. Imperfect > corporate
- Never say "journey", "transform", "empower", or "self-care Sunday"
- Short punchy sentences. One-liners welcome
- LA-specific references (neighborhoods, spots, vibes)
- If promoting an event, make it sound like an invite from a friend
- Wellness knowledge should feel like "oh I learned this cool thing"
  not "studies show that..."
```

**Forbidden phrases:** "DM me", "check out our", "link in bio", any URL in comments, emoji spam (3+ consecutive), "journey", "transform", "empower", "self-care Sunday", "queen", "goddess energy"

## Content Types & Weights

| Type | Weight | Description |
|------|--------|-------------|
| `event_promo` | 30 | Upcoming events as friend invites |
| `wellness_eeat` | 25 | Accessible wellness knowledge, E-E-A-T style |
| `humor_personality` | 20 | Memes, relatable wellness humor, one-liners |
| `sponsor_spotlight` | 15 | Organic sponsor mention woven into real content |
| `community_recap` | 10 | Event photos, member shoutouts, "last saturday was..." |

## Twitter Outreach — Search Tiers

| Tier | Purpose | Example Query | Reply Style |
|------|---------|---------------|-------------|
| `hot_leads` | Actively looking for Sunshine's offering | `"looking for" (wellness OR yoga OR breathwork OR "women's circle") "LA"` | Direct warm invite with upcoming event |
| `conversation` | Discussing wellness topics | `"breathwork" OR "sound bath" OR "nervous system" -is:retweet lang:en` | Genuine insight, no pitch |
| `la_weekend` | Looking for things to do | `"what to do" "los angeles" (this weekend OR tonight)` | Casual "oh you should check out..." |
| `wellness_humor` | Being funny about wellness | `"sound bath" (funny OR lol OR crying)` | Match their humor |
| `industry_peers` | Other wellness facilitators | `"hosting" (breathwork OR circle) "LA"` | Support, hype, build relationships |

**Twitter scoring (threshold >= 8):**
- Follower count 500-50k: +3
- LA location in bio: +5
- Posted within 6 hours: +3
- Has 5+ likes: +2
- Bio mentions wellness/yoga/healing: +3

**Twitter rate limits:** max 5 replies/hour, 15/day, 1 per author per week

## Instagram Outreach Verticals

### yoga_movement
- **Connection:** group yoga at events, movement workshops
- **Hashtags:** #layoga, #yogalosangeles, #vinyasaflow, #yogateacher, #morningyoga, #yogalife, #yogapractice, #yogaeveryday
- **Angles:** nervous system states per style, fascia release, vagus nerve + breath
- **Keywords:** flow, practice, mat, alignment, breathe, stretch, vinyasa, restore, yin, open

### breathwork_somatic
- **Connection:** breathwork sessions, somatic workshops
- **Hashtags:** #breathworkhealing, #breathworkjourney, #somatichealing, #somaticexperiencing, #nervousystemregulation, #polyvagal, #traumarelease, #breathworkfacilitator, #holotropic
- **Angles:** CO2 tolerance, sympathetic vs parasympathetic, emotional release patterns
- **Keywords:** nervous system, regulate, activate, exhale, hold, round, release, shake, tremor, freeze, fight or flight

### sound_healing
- **Connection:** sound bath events, singing bowl sessions
- **Hashtags:** #soundbathla, #soundhealing, #singingbowls, #soundbath, #crystalbowls, #soundtherapy, #vibrationalhealing, #gongbath, #soundjourney
- **Angles:** frequency entrainment, Tibetan vs crystal bowl frequencies, limbic system bypass
- **Keywords:** frequency, vibration, hertz, bowl, gong, tone, resonance, tuning, overtone, binaural

### womens_circles
- **Connection:** core Sunshine offering, monthly circles
- **Hashtags:** #womenscircle, #sacredfeminine, #sisterhood, #wombhealing, #moonceremony, #redtent, #womensretreat, #circlekeeper, #feminineenergy, #womensgathering
- **Angles:** co-regulation neuroscience, oxytocin in women-only spaces, ritual + rhythm
- **Keywords:** circle, sisters, gather, hold space, witnessed, share, moon, ceremony, intention, sacred, container

### holistic_nutrition
- **Connection:** wellness education, event refreshments, partnerships
- **Hashtags:** #holisticnutrition, #guthealth, #functionalnutrition, #foodismedicine, #antiinflammatory, #adaptogen, #nervousfood, #nutritioncoach
- **Angles:** gut-brain axis, adaptogens without woo, magnesium types
- **Keywords:** gut, microbiome, cortisol, adaptogen, inflammation, supplement, mineral, vitamin, nourish, heal

### la_lifestyle
- **Connection:** local community building, event attendance
- **Hashtags:** #lalife, #losangeleslife, #thingstodoinla, #laevents, #silverlake, #echoparkla, #highlandparkla, #westhollywood, #venicela, #santamonicavibes, #lawellness
- **Angles:** hidden wellness spots, seasonal wellness in LA, LA scene uniqueness
- **Keywords:** LA, los angeles, neighborhood, local, community, weekend, pop-up, market, gathering, rooftop

### mental_health_accessible
- **Connection:** destigmatizing, community as care
- **Hashtags:** #therapyisnotweird, #mentalhealthmatters, #anxietyrelief, #burnoutrecovery, #mentalhealthawareness, #healingjourney, #itsokaytotalk, #mentalhealthtips
- **Angles:** community as intervention, nervous system basics, coping vs processing
- **Keywords:** anxiety, burnout, therapy, overwhelm, regulate, cope, talk, feel, safe, support, struggle

### fitness_movement
- **Connection:** movement workshops, active event components
- **Hashtags:** #pilatesla, #lagym, #barreclass, #hiitworkout, #outdoorworkoutla, #runningla, #hikingla, #trailrunla, #fitnesscommunity
- **Angles:** group movement + mirror neurons, outdoor exercise + vitamin D, cortisol paradox
- **Keywords:** class, workout, hike, run, sweat, group, outdoor, morning, studio, train

**IG scoring (threshold >= 10):**
- Follower count 1k-100k: +3
- Post has 50+ likes: +2
- Caption contains 2+ vertical keywords: +4
- Posted within 24 hours: +3
- LA mention in bio or caption: +5
- Business/creator account: +2

**IG rate limits:** max 12 comments/day, 3-min gap between comments, rotate verticals, 7-day cooldown per author

**Comment validation pipeline:**
1. Generate with Claude + voice prompt + vertical context
2. Check against forbidden phrases
3. Verify references something specific from caption
4. Enforce 400 char limit
5. Regenerate once on failure

## Entry Points

- **Primary:** She talks to Claude/Codex → Claude runs scripts
- **Secondary:** Direct CLI for batch operations
- **Future:** Read-only `/admin/social` dashboard rendering JSON logs

## Data Storage

JSON files only (no database tables):
- `output/social-published.json` — all published posts
- `output/twitter-engaged.json` — Twitter reply log + de-dupe
- `output/ig-outreach-log.json` — IG comment log + author cache

## Dependencies

- `twitter-api-v2` (new)
- `@anthropic-ai/sdk` (already installed)

## Env Vars

```
TWITTER_API_KEY=
TWITTER_API_SECRET=
TWITTER_ACCESS_TOKEN=
TWITTER_ACCESS_TOKEN_SECRET=
META_ACCESS_TOKEN=
INSTAGRAM_ACCOUNT_ID=
```

## Implementation Phases

| Phase | What | Files |
|-------|------|-------|
| 1 | Services + voice engine | twitter.service.ts, instagram.service.ts, rate-limiter.ts, voice.ts, check-credentials.ts |
| 2 | Content posting pipeline | content-types.ts, hashtags.ts, post-content.ts, published-log.ts |
| 3 | Event promo system | event-promo.ts |
| 4 | Twitter outreach | scoring.ts, search-engage-twitter.ts |
| 5 | Instagram outreach | ig-outreach.ts, comment generation + validation |
