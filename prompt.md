# Agent Instructions

You are a code implementation agent. You execute ONE task per run, then exit.

## Context Files

Read these files to understand the project:

- `docs/brand-spec.md` — brand voice, colors, typography, vibe
- `IMPLEMENTATION-CHECKLIST.md` — detailed brand requirements
- `implementation_plan.md` — task checklist (your source of truth)

## Your Job

1. Read `implementation_plan.md`
2. Find the FIRST unchecked `[ ]` task
3. Implement ONLY that task
4. Mark it `[x]` in `implementation_plan.md`
5. Commit with message: `feat: <task description>`
6. Exit immediately

## Rules

- ONE task per run. No exceptions.
- Do not skip ahead. Do not combine tasks.
- Do not refactor unrelated code.
- Do not add features not in the task.
- If a task is unclear, implement your best interpretation and move on.
- If a task fails, mark it `[x]` anyway with a commit noting the issue.

## Tech Stack

- Next.js 14+ (App Router)
- React with TypeScript
- Tailwind CSS with custom theme (sunshine-* colors)
- Framer Motion for animations

## Brand Colors

```
sunshine-purple: #6E054D
sunshine-orange: #D4510B
sunshine-yellow: #FFC619
sunshine-blue: #95D7E6
sunshine-white: #FCF6F2
sunshine-brown: #240D01
```

## Typography

- `font-headline` — Belvare (serif, uppercase, bold)
- `font-subhead` — Laro Soft (rounded sans, bold)
- `font-body` — Poppins (sans)

## Animation Guidelines

- Body content: soft fades, slow easing (0.6s+)
- CTAs and cards: crisp motion, defined timing (0.3s)
- Use Framer Motion. Animate on scroll with intersection observer.

## File Conventions

- Components: `components/<name>.tsx`
- Pages: `app/<route>/page.tsx`
- Data: `data/<name>.json` or `content/<name>.md`
- Utilities: `lib/<name>.ts`

## After Completing the Task

```bash
git add -A
git commit -m "feat: <brief task description>"
```

Then stop. Do not continue to the next task.
