# Todos los goles de Messi

Archive of every Lionel Messi career goal with video clips — searchable by date, club, competition, opponent, and goal number.

**Live site:** [todoslosgolesdemessi.com](https://todoslosgolesdemessi.com)

Spanish is the primary language; the UI also supports English via a language toggle.

## Features

- Browse and filter **919** goals (Barcelona, Argentina, PSG, Inter Miami; 2005–2026)
- Per-goal pages at `/goal/{number}` with match context and video
- Scrollable chronological feed at `/feed`
- Filterable table of every goal at `/table`
- Random goal picker at `/random`
- Installable PWA with offline caching for recently viewed clips
- SEO: sitemap, Open Graph, JSON-LD, and prerendered goal pages

## Stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [MUI](https://mui.com/) + Emotion
- [React Router](https://reactrouter.com/)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)

## Requirements

- Node.js **20.19+** (see `.nvmrc`)

## Getting started

```bash
git clone https://github.com/mporracindie/goatmessi.git
cd goatmessi
npm install
```

Create a `.env` in the project root (or copy the existing one):

```env
VITE_SITE_URL=https://todoslosgolesdemessi.com
```

For local development you can use:

```env
VITE_SITE_URL=http://localhost:9001
```

Then:

```bash
npm run dev
```

The app runs at [http://localhost:9001](http://localhost:9001).

### Production build

```bash
npm run build
npm start
```

`build` regenerates SEO assets (`sitemap.xml`, `llms.txt`), type-checks, bundles with Vite, and prerenders individual goal pages.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Generate SEO assets, type-check, build, and prerender goals |
| `npm start` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run generate-seo` | Regenerate `public/sitemap.xml` and `public/llms.txt` |
| `npm run fetch-messistats` | Refresh `src/data/goalsStats.json` from [messistats.com](https://www.messistats.com/) |

## Project layout

```
src/
  components/   # Shared UI (search, footer, language toggle, meta)
  context/      # Theme and locale providers
  data/         # goalsStats.json — goal metadata
  helpers/      # SEO and shared utilities
  i18n/         # Spanish / English strings
  views/        # Home, Search, Feed, GoalsTable, Goal, Random
scripts/        # SEO generation, prerender, stats fetch
public/         # Static assets, robots.txt, sitemap, PWA icons
```

Goal videos are hosted externally (`messi.aws.porracin.com`) and are not stored in this repository.

## Data

Goal metadata lives in [`src/data/goalsStats.json`](src/data/goalsStats.json). Each entry includes goal number, date, competition, teams, minute, scoreline, and finish type when available.

Stats can be refreshed with:

```bash
npm run fetch-messistats
```

Match and scoring data is sourced from [messistats.com](https://www.messistats.com/). Video clips are maintained separately from this repo.

## Contributing

Issues and pull requests are welcome — especially for data corrections, accessibility, and UX improvements.

1. Fork the repo and create a feature branch
2. Keep changes focused and match existing style
3. Run `npm run lint` and `npm run build` before opening a PR

## Disclaimer

This is an unofficial fan project and is not affiliated with Lionel Messi, his clubs, or rights holders. Match footage and trademarks belong to their respective owners. Metadata is provided for archival and educational browsing; if you own rights to content here and want it removed, contact the maintainer via [porracin.com](https://porracin.com/).

## Author

Built by [Marco Porracin](https://porracin.com/) ([@marcoporracin](https://x.com/marcoporracin)).
