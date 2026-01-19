# Agent Instructions

One task per run. Read plan, implement, mark done, commit, exit.

## Files

- `brand_spec.md` — colors, typography, component patterns
- `implementation_plan.md` — task checklist

## Process

1. Read `implementation_plan.md`
2. Find FIRST unchecked `[ ]` task
3. Implement that ONE task
4. Run `npm run build` — if it fails, fix errors before continuing
5. Mark task `[x]` in `implementation_plan.md`
6. Commit: `git add -A && git commit -m "feat: <task>"`
7. Exit

## Rules

- ONE task only. No skipping, no combining.
- Reference `brand_spec.md` for all color/typography decisions.
- Replace `sunshine-*` colors with `sun-*` colors.
- No refactoring beyond the task scope.
- If unclear, make best judgment and proceed.

## New Brand Colors

```
sun-plum: #6E054D     (buttons, accents)
sun-cocoa: #240D01    (text)
sun-cream: #FFF7F1    (main background)
sun-paper: #FFFFFF    (cards)
sun-sand: #F0E4DA     (borders, subtle sections)
sun-gold: #F6C453     (highlights)
sun-coral: #F28C7D    (gentle emphasis)
sun-leaf: #2F7A5B     (success)
```

## New Typography

- Headlines: Fraunces (Google Fonts)
- Body: Inter (Google Fonts)

## Component Patterns

- Buttons: `bg-sun-plum text-white hover:bg-sun-plum/90 rounded-[14px]`
- Cards: `bg-sun-paper border border-sun-sand rounded-xl shadow-soft`
- Links: `text-sun-plum hover:text-sun-plum/80`
- Inputs: `border-sun-sand focus:ring-sun-plum focus:border-sun-plum`
- Main bg: `bg-sun-cream`
- Text: `text-sun-cocoa`
