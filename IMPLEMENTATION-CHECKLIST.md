# The Sunshine Effect - Implementation Checklist

## Brand Essence & Voice

### Core Brand Validation
- [ ] Brand mission is clear: "Helps women move from burnout to alignment through simple rituals"
- [ ] Energy feels: warm, energizing, woman-forward, soulful, confident
- [ ] Site creates "pockets of peace and calm" throughout experience
- [ ] Visitors should feel: seen, safe, uplifted, capable of leading aligned life

### Tone & Language Audit
- [ ] Voice is empowering, grounded, and kind
- [ ] BFF-level intimacy without being overly casual
- [ ] Spiritual depth blended with practical structure

**Approved vocabulary present:**
- [ ] alignment
- [ ] flow state
- [ ] radiant
- [ ] resourced
- [ ] embodied
- [ ] grounded
- [ ] devotion
- [ ] ritual
- [ ] clarity
- [ ] momentum

**Banned language check (must be ZERO instances):**
- [ ] No "hustle"
- [ ] No "grind"
- [ ] No shame-based language
- [ ] No copy suggesting user is "broken" or "behind"

**Key phrases integrated:**
- [ ] "Glow from the heart"
- [ ] "Discipline is self love in motion"
- [ ] "Move like it's already yours"
- [ ] "You are allowed to want more ease"
- [ ] "Radiance is yours"
- [ ] "Real power does not have to push or prove"

---

## Audience Awareness

### Target Persona Validation
- [ ] Copy speaks to women in their 20s-30s
- [ ] Addresses those working unfulfilling jobs
- [ ] Resonates with wellness/spirituality curiosity
- [ ] Speaks to smart, capable women low in confidence
- [ ] Acknowledges transition seasons (job, identity, relationship)
- [ ] Addresses desires: clarity, confidence, balance, stability, community

### Stages of Awareness Flow
- [ ] Stage 1 (Problem unaware): "Life feels busy and dull" moments present
- [ ] Stage 2 (Head nod): "Maybe there's another way" validation
- [ ] Stage 3 (Problem aware): "This path is draining me" acknowledgment
- [ ] Stage 4 (Tension point): "Cannot keep betraying myself" pivot language
- [ ] Stage 5 (Solution aware): "I'm capable of alignment" empowerment
- [ ] Stage 6 (Product aware): "Ready to believe/trust Sunshine" invitation

---

## Visual Design System

### Color Palette Compliance
**Brand colors configured correctly:**
- [ ] Power Purple: #6E054D
- [ ] Molten Orange: #D4510B
- [ ] Yellow Sun: #FFC619
- [ ] Blue Sky: #95D7E6
- [ ] White Cloud: #FCF6F2
- [ ] Deep Brown: #240D01

**No unauthorized colors added:**
- [ ] Zero colors outside the brand palette
- [ ] No shades or tints beyond specified hex codes

**Background usage:**
- [ ] Power Purple used for primary hero/section backgrounds
- [ ] Molten Orange used for primary background/accent sections
- [ ] Yellow Sun used for secondary backgrounds/highlight bands
- [ ] White Cloud used for clean sections/body backgrounds

### Contrast Rules (STRICT)
**On Power Purple backgrounds:**
- [ ] Text uses White Cloud
- [ ] Accents use Blue Sky or Yellow Sun
- [ ] Buttons use Blue Sky or Yellow Sun

**On Molten Orange backgrounds:**
- [ ] Text uses White Cloud OR Power Purple
- [ ] Accents use Blue Sky or Yellow Sun

**On Yellow Sun backgrounds:**
- [ ] Text uses Deep Brown OR Power Purple
- [ ] NEVER white text on yellow (critical accessibility rule)

**General accent rules:**
- [ ] Blue Sky only as accent/UI element, not primary text on light backgrounds
- [ ] Yellow Sun only as accent/UI element, not primary text on light backgrounds

### Typography Implementation
**Font configuration:**
- [ ] Belvare loaded and set as headline font
- [ ] Laro Soft Bold loaded and set as subhead font
- [ ] Poppins loaded and set as body font

**Tailwind classes:**
- [ ] `font-headline` available and working
- [ ] `font-subhead` available and working
- [ ] `font-body` available and working

**Typography usage:**
- [ ] H1, H3 use Belvare (serif)
- [ ] H2, H4 use Laro Soft Bold (rounded sans)
- [ ] Body text uses Poppins (sans)
- [ ] Headlines use all caps or uppercase styling where appropriate
- [ ] Body text is centered or left-aligned (NEVER fully justified)
- [ ] Relaxed line-height throughout
- [ ] Generous spacing for "pockets of peace"
- [ ] Paragraph lengths are mobile-readable

### Layout & Imagery
- [ ] Layouts feel like bold posters: solid color blocks, large type, strong hierarchy
- [ ] Collage elements present: poppies, abstract florals, reaching hands, candid faces
- [ ] Women of diverse backgrounds featured
- [ ] Blurry floral or warm gradient backdrops with crisp text overlays
- [ ] Visual ratio: ~60% warm/playful, ~30% ethereal/soft focus, ~10% bold/edgy
- [ ] Photography is woman-forward, diverse, candid, luminous

### Buttons & CTAs
- [ ] Pill-shaped or rounded corners (`rounded-pill` or equivalent)
- [ ] High contrast following color rules
- [ ] Common labels used: "Glow," "Sign Up," "Join The List," "Work With Sunshine"
- [ ] Clear microcopy present near CTAs
- [ ] Microcopy reduces decision anxiety
- [ ] Microcopy highlights ease, safety, or community

---

## Technical Stack & Implementation

### Stack Verification
- [ ] Next.js installed and configured
- [ ] React with TypeScript
- [ ] Tailwind CSS configured with custom theme
- [ ] Semantic HTML tags used throughout
- [ ] ARIA attributes implemented where needed
- [ ] Lighthouse performance score 90+
- [ ] Lighthouse accessibility score 90+

### Tailwind Configuration
**Theme extensions present:**
```js
colors: {
  'sunshine-purple': '#6E054D',
  'sunshine-orange': '#D4510B',
  'sunshine-yellow': '#FFC619',
  'sunshine-blue': '#95D7E6',
  'sunshine-white': '#FCF6F2',
  'sunshine-brown': '#240D01',
}
```
- [ ] All 6 brand colors configured
- [ ] Color names use `sunshine-*` prefix

**Font families configured:**
```js
fontFamily: {
  headline: ['Belvare', 'serif'],
  subhead: ['Laro Soft Bold', 'sans-serif'],
  body: ['Poppins', 'sans-serif'],
}
```
- [ ] All 3 font families configured
- [ ] Font names match exactly

**Border radius:**
- [ ] `pill: '9999px'` configured
- [ ] Used consistently for CTAs

### Mobile-First Implementation
- [ ] Layouts designed for small screens first
- [ ] Stacked sections on mobile
- [ ] Full-width CTAs on mobile
- [ ] Site feels like "link in bio" experience on mobile
- [ ] Big tap targets (minimum 44x44px)
- [ ] Clear labels on all interactive elements
- [ ] Short scroll section blocks

---

## Navigation & Global Elements

### Global Navigation
**Nav items present in order:**
1. [ ] Home
2. [ ] About
3. [ ] Offerings
4. [ ] Events
5. [ ] Community
6. [ ] Contact

**Navigation behavior:**
- [ ] Right-aligned CTA button: "Work With Sunshine" or "Join The List"
- [ ] Mobile: slide or overlay menu
- [ ] Mobile: prominent CTA at top of menu
- [ ] Navigation is sticky or easily accessible
- [ ] Active page indicator present

### Footer
- [ ] Instagram as primary social link
- [ ] Other social links if applicable
- [ ] Newsletter signup for "Consistent Bulletin"
- [ ] Simple navigation repeat
- [ ] Copyright: "© [current year] The Sunshine Effect"
- [ ] Background: Power Purple or Molten Orange
- [ ] Text: white with soft accent
- [ ] Footer is visually balanced

---

## Page-by-Page Implementation

## HOME PAGE

### Goal Check
- [ ] Page welcomes visitors emotionally
- [ ] Clear path to "Work With Sunshine"
- [ ] Clear path to "Events"
- [ ] Clear path to "Join The List"

### Hero Section
- [ ] Headline: "Radiance is yours" OR "The Sunshine Effect"
- [ ] Subhead: hook about burnout to alignment through simple rituals
- [ ] Main CTA: "Glow from the heart" OR "Work With Sunshine"
- [ ] Secondary link: "Explore events" OR "Join the list"
- [ ] Background: Power Purple OR Molten Orange
- [ ] Collage imagery present
- [ ] Mobile-optimized layout

### "From Burnout to Alignment" Section
- [ ] 2-3 short paragraphs
- [ ] Ties to mission
- [ ] Emotionally resonant copy
- [ ] Clear visual hierarchy

### Three-Step Pathway
- [ ] Simple 3-step framework (e.g., Notice – Nurture – Move)
- [ ] Each step clearly labeled
- [ ] Visual flow is intuitive
- [ ] Mobile stacked layout

### Offerings Overview Cards
**1:1 Coaching card:**
- [ ] Title/headline present
- [ ] Short description
- [ ] Visual differentiation
- [ ] CTA to learn more

**Retreats card:**
- [ ] Title/headline present
- [ ] Short description
- [ ] Visual differentiation
- [ ] CTA to learn more

**Events card:**
- [ ] References both Golden Hour and Lunar Room
- [ ] Short description
- [ ] Visual differentiation
- [ ] CTA to see events

### Social Proof / Testimonials Strip
**Testimonials focus on:**
- [ ] Feeling seen
- [ ] Finding clarity
- [ ] Overcoming burnout
- [ ] Format: first name, last initial, descriptor
- [ ] At least 2-3 testimonials visible

### "Glow Notes" Signup Band
- [ ] Clear headline
- [ ] Intro to newsletter and text list
- [ ] Email signup field
- [ ] SMS signup option (if applicable)
- [ ] Submit CTA
- [ ] Microcopy about frequency/value
- [ ] Visually distinct section

---

## ABOUT PAGE (Who Is Sunshine)

### Goal Check
- [ ] Positions Sunshine as loving catalyst and guide
- [ ] Builds trust and connection
- [ ] Shows authentic journey

### Hero Section
- [ ] Sunshine's name clearly displayed
- [ ] Portrait/headshot present
- [ ] Tagline: "Catalyst for women who are ready to create a life centered on purpose" (or similar)
- [ ] Visually striking layout
- [ ] Brand color background

### Body Copy Summary
- [ ] Explains blend of wellness, mindset, and business strategy
- [ ] Describes guiding women to clear trauma noise
- [ ] Emphasizes hearing their own desires
- [ ] Highlights inner peace as foundation
- [ ] Encourages first imperfect steps
- [ ] Mentions being rooted and resourced

### Timeline / Chapters
- [ ] Shows Sunshine's journey from burnout to alignment
- [ ] Chronological or thematic structure
- [ ] Authentic and relatable stories
- [ ] Visual timeline or chapter cards
- [ ] Mobile-optimized

### Values Grid
**6 core values present:**
1. [ ] Community
2. [ ] Devotion
3. [ ] Courage
4. [ ] Alignment
5. [ ] Compassion
6. [ ] Leadership

- [ ] Grid layout (2x3 or 3x2)
- [ ] Each value has icon or visual element
- [ ] Short description for each
- [ ] Mobile responsive grid

---

## OFFERINGS PAGE

### Goal Check
- [ ] Services clearly presented
- [ ] Easy to choose next steps
- [ ] Multiple entry points based on readiness

### A. 1:1 Coaching Section
**Formats clearly stated:**
- [ ] Single session option
- [ ] 3-month journey option

**Focus areas listed:**
- [ ] Clear blocks
- [ ] Rebuild confidence
- [ ] Clarify goals
- [ ] Plan aligned action

**What it helps with:**
- [ ] Getting unstuck
- [ ] Beginner business structure
- [ ] Releasing self-doubt and perfectionism
- [ ] Creating new daily rhythms
- [ ] Accountability and support

**CTA:**
- [ ] "Apply for coaching" OR "Book a clarity call"
- [ ] Button is prominent
- [ ] Microcopy reduces friction

### B. Retreats Section
**Description includes:**
- [ ] Weekend or longer immersive experiences
- [ ] Release old identities
- [ ] Remember who they are
- [ ] Connect with others
- [ ] Gather tools

**Bullet list of elements:**
- [ ] Intention setting circles
- [ ] Somatic movement and breathwork
- [ ] Journaling and creative visioning
- [ ] Guest coaches and trauma-informed facilitators
- [ ] Skill building workshops
- [ ] Brand collaborations, sponsored goodies

**CTA:**
- [ ] "Get retreat details" OR "Join the retreat waitlist"
- [ ] Button is prominent

### C. Events Hub Section
- [ ] Summary of recurring event formats
- [ ] Link to Events page
- [ ] Brief description of Golden Hour and Lunar Room
- [ ] CTA to explore events

### D. Future Offerings Preview (Optional)
**Cards for:**
- [ ] Online courses
- [ ] Cohorts and challenges
- [ ] Journals, calendars, merch

**Copy quality:**
- [ ] Plants seeds
- [ ] Doesn't overpromise
- [ ] Maintains excitement without commitment

---

## EVENTS PAGE

### Goal Check
- [ ] Differentiates Golden Hour vs Lunar Room energy
- [ ] Drives RSVPs
- [ ] Creates FOMO and excitement

### Intro Section
- [ ] "Community in motion" concept explained
- [ ] Why being in the room matters
- [ ] Emotionally compelling copy

### The Golden Hour Card
**Energy & description:**
- [ ] High energy, women's circle style
- [ ] Mindset coaching, storytelling, networking
- [ ] Sunshine leads motivational talk
- [ ] Keywords visible: electric, heart-led, connective, playful

**Visual differentiation:**
- [ ] Warmer color palette
- [ ] Sun-drenched imagery
- [ ] Social energy in photos
- [ ] Energetic typography

**Card elements:**
- [ ] Short description
- [ ] Typical session length
- [ ] Next date teaser OR "Join the waitlist"
- [ ] CTA: "See upcoming dates" OR "RSVP"

**Tagline:**
- [ ] "High energy, heart-led networking" (or similar)

### The Lunar Room Card
**Energy & description:**
- [ ] Slow, introspective, restorative
- [ ] Focus on yoga, sound, meditation
- [ ] Co-facilitated with healers and creative leaders
- [ ] Keywords visible: exhale, grounded, gentle, inward

**Visual differentiation:**
- [ ] Softer, darker color palette
- [ ] Moon, night, or candle-lit imagery
- [ ] Calm energy in photos
- [ ] Softer typography

**Card elements:**
- [ ] Short description
- [ ] Typical session length
- [ ] Next date teaser OR "Join the waitlist"
- [ ] CTA: "See upcoming dates" OR "RSVP"

**Tagline:**
- [ ] "Slow, introspective, sound and stillness" (or similar)

### Event Gallery
- [ ] Grid of photos
- [ ] Captures both event energies
- [ ] Mobile responsive
- [ ] High-quality, on-brand images

---

## COMMUNITY PAGE

### Goal Check
- [ ] Explains "why" of community
- [ ] Invites visitors deeper
- [ ] Creates sense of belonging

### Gap & Community Solution
- [ ] Copy about gap between current state and desired state
- [ ] How community closes that gap
- [ ] Emotionally resonant language

### Community Description
**Kind of women present:**
- [ ] Big-hearted
- [ ] Creative
- [ ] In transition
- [ ] Craving alignment

**Themes discussed:**
- [ ] Accountability
- [ ] Courage
- [ ] Belonging

### Content Pillars
**Three pillars outlined:**
1. [ ] Wellness and everyday self-respect
2. [ ] Self-development and trauma awareness
3. [ ] Business strategy, aligned action, authentic marketing

- [ ] Each pillar has description
- [ ] Visual hierarchy clear
- [ ] Examples or details provided

### "How We Stay Connected" (Optional)
**Connection points:**
- [ ] Events
- [ ] SMS list
- [ ] Consistent Bulletin email
- [ ] Social media

- [ ] Each has brief description
- [ ] CTAs to join each
- [ ] Visually organized

---

## CONTACT / NEWSLETTER PAGE

### Goal Check
- [ ] Simple, low-friction connection
- [ ] Multiple ways to engage
- [ ] Reduces anxiety about reaching out

### Contact Form
**Form fields:**
- [ ] Name
- [ ] Email
- [ ] Topic/Subject
- [ ] Short message

**Microcopy:**
- [ ] Response time expectations clear
- [ ] Safe, judgment-free communication emphasized
- [ ] Welcoming tone

**Form UX:**
- [ ] Mobile-friendly
- [ ] Clear submit button
- [ ] Success state/confirmation
- [ ] Error handling

### SMS List Signup
- [ ] Copy feels like a "love note"
- [ ] Explains texts as gentle check-ins and encouragement
- [ ] Frequency stated: 1-2 times per week
- [ ] Opt-in field clear
- [ ] Privacy/compliance noted
- [ ] Submit CTA

### Email Newsletter Section
**Title:**
- [ ] "Consistent Bulletin" clearly displayed

**Format description:**
- [ ] Personal note from Sunshine
- [ ] Curated recommendations
- [ ] Event updates
- [ ] Ways to stay connected

**CTA:**
- [ ] "Join the Consistent Bulletin"
- [ ] Email field
- [ ] Submit button
- [ ] Success confirmation

---

## Component Library Checklist

### Offerings/Event Cards (Poster Style)
- [ ] Strong color fills from brand palette
- [ ] Bold typography
- [ ] Clear visual hierarchy
- [ ] Pill-shaped CTAs
- [ ] Mobile responsive
- [ ] Hover states defined
- [ ] Accessible focus states

### Golden Hour vs Lunar Room Visual Distinction
**Golden Hour styling:**
- [ ] Warmer palette (orange, yellow tones)
- [ ] Sun-drenched imagery
- [ ] Social, energetic vibe
- [ ] Tagline: "High energy, heart-led networking"

**Lunar Room styling:**
- [ ] Cooler/darker palette (purple, blue tones)
- [ ] Moon/night/candle imagery
- [ ] Calm, introspective vibe
- [ ] Tagline: "Slow, introspective, sound and stillness"

### Testimonial Component
**Content requirements:**
- [ ] Focus on feeling seen and understood
- [ ] Focus on getting clarity and direction
- [ ] Focus on moving out of burnout

**Format:**
- [ ] Quote text prominent
- [ ] First name, last initial
- [ ] Descriptor: "retreat guest," "coaching client," etc.
- [ ] Visual design on-brand
- [ ] Mobile optimized

### CTA Buttons
- [ ] Pill shape (rounded-pill)
- [ ] High contrast text
- [ ] Follows color contrast rules
- [ ] Hover state
- [ ] Focus state (keyboard accessible)
- [ ] Active state
- [ ] Disabled state (if applicable)

### Form Components
- [ ] Labels clearly associated with inputs
- [ ] Placeholder text on-brand (not for critical info)
- [ ] Error states friendly and helpful
- [ ] Success states celebratory
- [ ] Loading states clear
- [ ] Mobile-optimized inputs (correct input types)

---

## Accessibility & UX Deep Check

### Color Contrast Compliance
- [ ] All text meets WCAG AA minimum (4.5:1 for body, 3:1 for large text)
- [ ] Interactive elements meet contrast requirements
- [ ] Focus indicators visible on all interactive elements
- [ ] Color is not the only means of conveying information

### Alt Text & Images
- [ ] All images have meaningful alt text
- [ ] Decorative images have empty alt (`alt=""`)
- [ ] Text overlays described in alt text
- [ ] Complex images have longer descriptions if needed

### Semantic HTML
- [ ] `<section>` used for major sections
- [ ] `<nav>` for navigation
- [ ] `<main>` wraps primary content
- [ ] `<header>` for page/section headers
- [ ] `<footer>` for footer
- [ ] `<article>` for standalone content
- [ ] Heading hierarchy logical (h1 → h2 → h3, no skips)

### Keyboard Navigation
- [ ] All interactive elements keyboard accessible
- [ ] Tab order is logical
- [ ] Focus visible on all interactive elements
- [ ] No keyboard traps
- [ ] Skip to main content link present
- [ ] Modals/overlays can be closed with Escape

### Typography Accessibility
- [ ] No long blocks of all-caps body text
- [ ] Line height relaxed (1.5+ for body text)
- [ ] Text can be resized to 200% without breaking layout
- [ ] Sufficient spacing between interactive elements

---

## Content & Marketing Integration

### Blog/Content (if applicable)
**Three content pillars honored:**
1. [ ] Wellness posts present
2. [ ] Self-development posts present
3. [ ] Business strategy posts present

**Storytelling quality:**
- [ ] Reflects real transitions, not overnight success
- [ ] Authentic voice maintained
- [ ] Audience stages of awareness considered

### SMS Integration
**Message characteristics:**
- [ ] Short (under 160 characters preferred)
- [ ] Comforting and uplifting
- [ ] Soft invitations (not pushy)
- [ ] Links to events or offers when relevant
- [ ] Frequency: 1-2 times per week maximum

### Email Newsletter ("Consistent Bulletin")
**Standard structure includes:**
- [ ] Personal note from Sunshine (opening)
- [ ] 2-3 curated recommendations (books, tools, practices)
- [ ] Highlight of 1 upcoming event or offer
- [ ] Closing that reinforces connection

**Email tone:**
- [ ] Consistent with brand voice
- [ ] BFF intimacy
- [ ] Spiritual + practical blend
- [ ] Empowering and grounding

---

## Quality Assurance Testing

### Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Device Testing
- [ ] iPhone (various sizes)
- [ ] Android phone
- [ ] iPad
- [ ] Android tablet
- [ ] Desktop (1920x1080)
- [ ] Desktop (1366x768)
- [ ] Large display (2560x1440+)

### Performance Checks
- [ ] Lighthouse Performance: 90+
- [ ] Lighthouse Accessibility: 90+
- [ ] Lighthouse Best Practices: 90+
- [ ] Lighthouse SEO: 90+
- [ ] First Contentful Paint < 2s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Time to Interactive < 3.5s
- [ ] Cumulative Layout Shift < 0.1

### Form Testing
- [ ] All forms submit correctly
- [ ] Validation works (client-side)
- [ ] Error messages clear and helpful
- [ ] Success confirmations display
- [ ] Email integrations working (if applicable)
- [ ] GDPR/Privacy compliance (if applicable)

### Link Testing
- [ ] All internal links work
- [ ] All external links work
- [ ] Links open in correct window/tab
- [ ] No broken images
- [ ] No 404 errors

---

## Pre-Launch Final Review

### Brand Alignment Final Check
- [ ] Overall site feels warm, energizing, woman-forward
- [ ] Pockets of peace and calm present throughout
- [ ] User feels seen, safe, uplifted
- [ ] Copy empowers without overpromising
- [ ] No shame-based language anywhere
- [ ] Site builds confidence and reduces anxiety

### User Journey Validation
- [ ] Path to "Work With Sunshine" is clear from every page
- [ ] Path to "Join The List" is clear from every page
- [ ] Path to "Events" is clear from every page
- [ ] Each page has clear next step
- [ ] No dead ends

### Mobile Experience Final Check
- [ ] Site feels as simple as "link in bio" on mobile
- [ ] Big tap targets throughout
- [ ] Clear labels on all actions
- [ ] Short scroll sections
- [ ] No horizontal scrolling
- [ ] Forms easy to complete on mobile

### Copy Final Audit
- [ ] All placeholder copy is on-brand
- [ ] Copy could go live with minimal editing
- [ ] Stages of awareness addressed across site
- [ ] Key phrases integrated naturally
- [ ] Vocabulary aligns with approved list
- [ ] Tone is consistent across all pages

### Visual Design Final Audit
- [ ] Only brand colors used (no exceptions)
- [ ] Contrast rules followed everywhere
- [ ] Typography hierarchy clear
- [ ] Layouts feel like bold posters
- [ ] Collage elements present
- [ ] Photography is woman-forward, diverse, candid, luminous
- [ ] 60/30/10 ratio: warm playful / ethereal soft / bold edgy

---

## Post-Launch Monitoring

### Analytics Setup
- [ ] Google Analytics or alternative installed
- [ ] Goal tracking configured
- [ ] Event tracking on CTAs
- [ ] Form submission tracking
- [ ] Traffic source tracking

### Conversion Tracking
- [ ] "Work With Sunshine" clicks tracked
- [ ] "Join The List" conversions tracked
- [ ] Event RSVP tracking
- [ ] Newsletter signups tracked
- [ ] SMS list opt-ins tracked

### User Feedback Collection
- [ ] Method for gathering user feedback
- [ ] A/B testing plan (if applicable)
- [ ] Heatmap or session recording (optional)

### Ongoing Maintenance
- [ ] Content update process defined
- [ ] Event calendar update workflow
- [ ] Testimonial addition process
- [ ] Image optimization ongoing
- [ ] Performance monitoring scheduled

---

## Notes & Exceptions

**Document any deviations from this checklist:**

- Deviation 1:
  - Reason:
  - Approval:

- Deviation 2:
  - Reason:
  - Approval:

---

---

## Outreach Strategy Validation

### Content Pillars Coverage
- [ ] Wellness content present (Everyday Self-Respect, Movement as Medicine, Creating Stability)
- [ ] Self-Development content present (Trauma Awareness, Cultivating Courage, Community & Connection)
- [ ] Business Strategy content present (Beginner Foundations, Aligned Action, Authentic Marketing)
- [ ] Content evenly distributed across all 3 pillars

### Local Partnerships & IRL Presence
- [ ] Branded flyers created for events
- [ ] Partnership list: wellness studios, co-ops, boutique fitness/yoga spaces
- [ ] Workshop collaboration opportunities identified

### Events Execution
- [ ] The Golden Hour events scheduled
- [ ] The Lunar Room events scheduled
- [ ] Event signup/RSVP system in place (email + phone collection)
- [ ] Follow-up communication workflow established

### Podcast Strategy
- [ ] Guest appearance target podcast list created
- [ ] Pitch template for guest appearances
- [ ] Recording setup for potential future podcast hosting
- [ ] Voice note style content tested

### SMS List Management
- [ ] SMS platform selected and configured
- [ ] "Love note" style messaging templates created
- [ ] Frequency schedule: 1-2 times per week
- [ ] Soft invitation examples for events prepared
- [ ] Event sign-up integrates SMS opt-in

### Email Newsletter: "Consistent Bulletin"
- [ ] Email platform configured
- [ ] Newsletter template designed
- [ ] Frequency schedule: Monthly or bi-weekly
- [ ] Standard structure in place:
  * Personal note section
  * 2-3 curated recommendations
  * Event/offering updates
  * Connection reminder
- [ ] Special blast templates for events/retreats/programs

### Social Media Content Types
**Instagram primary, cross-posted as relevant:**

**Video Content:**
- [ ] Short lifestyle video templates (tea pouring, journaling, yoga)
- [ ] Pep talk to-camera scripts/prompts
- [ ] Interview clip repurposing workflow

**Carousels:**
- [ ] Knowledge breakdown templates
- [ ] Storytelling carousel structures
- [ ] Design templates matching brand

**Memes:**
- [ ] Aspirational image collection
- [ ] Inspiring + cheeky caption bank

**Stories:**
- [ ] Daily/weekly routine sharing schedule
- [ ] Behind-the-scenes content plan
- [ ] Wellness tidbit collection
- [ ] Quick check-in prompts

### Sales Messaging: Attitude to Ease Investment
- [ ] Investment reframe messaging integrated into sales pages
- [ ] "Signal to your nervous system" language in checkout/application
- [ ] "Money spent on alignment multiplies" copy in email sequences
- [ ] Community value emphasized in all sales communication

---

## Color Usage Validation (Expanded)

### Correct Combinations Checklist
- [ ] Purple background uses White Cloud text ONLY
- [ ] Purple background uses Blue Sky or Yellow Sun for buttons/accents
- [ ] Orange background uses White Cloud OR Deep Brown text
- [ ] Orange background uses Blue Sky or Yellow Sun for buttons
- [ ] Yellow background uses Deep Brown OR Power Purple text (NEVER white)
- [ ] Yellow background uses Molten Orange or Power Purple for buttons
- [ ] Blue Sky used only as accent/UI element
- [ ] Deep Brown used only as text color (functions as black)

### Incorrect Combinations to Avoid
- [ ] No white text on yellow background anywhere
- [ ] No orange text on yellow background anywhere
- [ ] No Blue Sky text on yellow background anywhere
- [ ] No Yellow Sun buttons on Yellow background anywhere
- [ ] No Blue Sky or Orange used as primary backgrounds for large sections

---

## Brand Voice & Catchphrases

### Catchphrase Integration
- [ ] "Glow from the heart" used in at least one CTA
- [ ] "Discipline is self-love in motion" used in content
- [ ] "Move like it's already yours" used in marketing materials
- [ ] "You're allowed to want more ease" used in messaging
- [ ] "Radiance is yours" used in headers/hero sections
- [ ] "Real power doesn't have to push or prove" used in brand communication

---

## Affiliate & Partnership Network

- [ ] Product partnership agreements in place
- [ ] Service referral system established
- [ ] Finders fee structure defined
- [ ] Promotion channels identified (social, events, SMS)
- [ ] Partner directory maintained

---

**Checklist Version:** 2.0
**Last Updated:** November 2025
**Reviewed By:** [Name]
