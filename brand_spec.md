# Sunshine Effect Brand Spec

## Visual Mood

"Soft light through window blinds. Tea on the counter. A friend who tells the truth without making you feel small."

Sun-warmed neutrals, soft gradients, gentle shadows, calm and readable.

## Color Palette

```css
:root {
  /* Primary */
  --sun-plum: #6E054D;      /* buttons, accents, highlights */
  --sun-cocoa: #240D01;     /* headlines, body text */

  /* Backgrounds */
  --sun-cream: #FFF7F1;     /* main background */
  --sun-paper: #FFFFFF;     /* cards */
  --sun-sand: #F0E4DA;      /* borders, subtle sections */

  /* Accents */
  --sun-gold: #F6C453;      /* highlights, warmth */
  --sun-coral: #F28C7D;     /* gentle emphasis */
  --sun-leaf: #2F7A5B;      /* success states */
}
```

## Tailwind Colors

```js
colors: {
  sun: {
    plum: '#6E054D',
    cocoa: '#240D01',
    cream: '#FFF7F1',
    paper: '#FFFFFF',
    sand: '#F0E4DA',
    gold: '#F6C453',
    coral: '#F28C7D',
    leaf: '#2F7A5B',
  }
}
```

## Typography

- Headlines: Fraunces (variable font, Google Fonts)
- Body: Inter (Google Fonts)

## Component Patterns

### Buttons
- Primary: `bg-sun-plum text-white hover:bg-sun-plum/90 rounded-[14px]`
- Secondary: `bg-sun-sand text-sun-cocoa hover:bg-sun-sand/80 rounded-[14px]`

### Cards
- `bg-sun-paper border border-sun-sand rounded-xl shadow-soft`
- Shadow: `0 8px 30px rgba(36, 13, 1, 0.08)`

### Links
- `text-sun-plum hover:text-sun-plum/80 underline-offset-2`

### Inputs
- `border-sun-sand focus:ring-sun-plum focus:border-sun-plum rounded-lg`

## Layout

- Main background: `bg-sun-cream`
- Text color: `text-sun-cocoa`
- Generous padding and whitespace
- `rounded-xl` (16px) for cards
- `rounded-[14px]` for buttons

## Gradients

Hero gradient: `linear-gradient(135deg, #6E054D 0%, #F6C453 100%)`

## What NOT To Do

- No bright yellow (#FFC019)
- No molten orange (#D4510B)
- No blue sky (#95D7E6)
- No "poster" energy
- No toxic positivity
- No hustle-culture vibes
