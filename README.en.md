# BookMemo

Personal catalog of book summaries: key ideas, what to remember, tips, and how to apply them. Organized by theme, comfortable to read on phone, tablet, and desktop.

[Lire en français](./README.md)

## Features

- Catalog of books organized by theme, with search and filters (theme, reading status)
- Reading sheet per book with collapsible sections: key ideas, what to remember, tips, how to apply it
- Add a book with automatic draft summary generation (via the Claude API), to review and adjust
- Automatic book cover lookup (Open Library)
- Reading status (to read / reading / read) and personal rating
- Export a sheet as PDF (browser print)
- Suggested books relevant to your interests, ready to add
- Bilingual French / English interface
- Data stored locally (browser localStorage); nothing is sent to a server except for draft generation and cover lookup

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- next-intl for French / English support
- Anthropic SDK (Claude) for draft summary generation
- Open Library for cover lookup
- localStorage storage (no database in v1)

## Local development

```bash
npm install
npm run dev
```

The app runs at [http://localhost:3450](http://localhost:3450).

## Environment variables

Copy `.env.local.example` to `.env.local` and set an Anthropic API key to enable automatic draft summary generation:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Without this key, the app works normally but the "Generate a draft" button will show an error; manual entry remains available.

## Tests and quality

```bash
npm run lint
npx tsc --noEmit
```

## Deployment

Deployed on Vercel. Remember to set `ANTHROPIC_API_KEY` in the Vercel project's environment variables so draft generation works in production.

## License

© 2026 Riadh MNASRI
