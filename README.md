# AI Visibility Dashboard

A dashboard for tracking how brands appear across AI-generated answers (ChatGPT, Claude, Perplexity, Gemini) — surfacing citation share, sentiment, and competitor comparisons.

## Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS
- **Runtime:** Node.js LTS (>= 20)
- **Package manager:** npm

## Getting started

```bash
git clone https://github.com/<your-username>/ai-visibility-dashboard.git
cd ai-visibility-dashboard
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

| Script          | What it does                       |
| --------------- | ---------------------------------- |
| `npm run dev`   | Start the dev server               |
| `npm run build` | Production build                   |
| `npm start`     | Serve the production build         |
| `npm run lint`  | Run ESLint                         |

## Project structure

```
ai-visibility-dashboard/
├── app/            # Next.js App Router pages and layouts
├── components/     # Reusable UI components
├── lib/            # Data fetching, utilities, types
├── public/         # Static assets
└── styles/         # Global CSS
```

## Roadmap

- [ ] Prompt-set input + per-model query runner
- [ ] Citation extraction and normalization
- [ ] Sentiment + share-of-voice charts
- [ ] Competitor comparison view

## License

MIT — see [LICENSE](./LICENSE).
