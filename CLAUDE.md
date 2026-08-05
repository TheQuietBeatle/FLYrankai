# CLAUDE.md

Guidance for Claude Code (and other AI assistants) working in this repository.

## Project

**AI Visibility Dashboard** — Next.js app that tracks how brands surface in AI-generated answers across ChatGPT, Claude, Perplexity, and Gemini.

## Stack

- Next.js 15 (App Router, React Server Components by default)
- TypeScript, `strict: true`
- Tailwind CSS (utility-first, no CSS-in-JS)
- ESLint (`next/core-web-vitals`) + Prettier
- Node.js LTS (>= 20), npm
- Planned tests: Vitest + React Testing Library

## Code conventions

- **Components:** functional, `PascalCase`, one component per file, named export (default export only where Next requires it — `app/**/page.tsx`, `layout.tsx`, `route.ts`).
- **Functions & variables:** `camelCase`. Constants that are truly constant: `SCREAMING_SNAKE_CASE`.
- **Types:** colocate with usage; shared types in `lib/types.ts`. Prefer `type` for unions, `interface` for object shapes that may be extended.
- **Server vs client:** default to server components. Add `"use client"` only when the file needs state, effects, or browser APIs.
- **Imports:** absolute imports via `@/` alias. Group: node/react → third-party → `@/` → relative.
- **Errors:** throw in server code, surface via `error.tsx` boundaries; never `catch` and silently swallow.

## Styling

- Tailwind utilities first. No inline `style={{}}` except for dynamic values that can't be expressed in classes.
- Extract to a component once the same class string repeats 3× — do not build a `@apply` layer.
- Dark mode via Tailwind `dark:` variants.

## Commits

Follow **Conventional Commits 1.0.0**. Allowed types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `style`, `perf`, `build`, `ci`. Subject in imperative mood, lowercase, no trailing period, ≤ 72 chars.

Examples:
- `feat(dashboard): add citation share chart`
- `fix(api): handle empty prompt-set response`
- `docs: sharpen README based on AI review feedback`

## Do

- Stage files explicitly (`git add <path>`), never `git add .`.
- Ask before adding a new runtime dependency.
- Read the existing file before editing it.
- Match the surrounding style — this repo's conventions win over your defaults.

## Don't

- Don't invent API routes, env vars, or package names — grep first.
- Don't add comments that restate the code. Comments explain *why*, not *what*.
- Don't introduce a new state manager, ORM, or CSS framework without discussion.
- Don't commit `.env*` files or anything under `node_modules/` or `.next/`.
