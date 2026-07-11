# taible

**Taible** — an AI voice ordering PWA. React 19 + Next.js 15 (App Router) + Tailwind CSS v4 + TypeScript.

Originally scaffolded in Figma Make (Vite); migrated to Next.js 15. The design/UI code came from Figma and is ported as-is.

## Development Server

Run locally with Docker (Colima provides the engine on macOS):

```bash
docker compose up --build    # http://localhost:3000
docker compose down          # stop
```

Or, with a local Node 22 / pnpm 10 toolchain (see `.mise.toml`):

```bash
pnpm install
pnpm dev                     # http://localhost:3000
```

Hot reload is enabled in the Docker dev container via a bind mount.

## Key Files

- `src/app/layout.tsx` - Root layout (html/body, metadata, globals.css)
- `src/app/page.tsx` - Home route, renders the app
- `src/App.tsx` - Client-side app state machine (guest/staff views) — `'use client'`
- `src/app/globals.css` - Tailwind import + brand tokens (`@theme inline`) + keyframes
- `src/components/{guest,staff,shared}/` - Screen and UI components (from Figma)
- `src/data/mockData.ts` - Mock menu/orders (backend wiring is a later phase)
- `src/types.ts` - Shared types
- `next.config.ts` - Next.js configuration
- `postcss.config.mjs` - Tailwind v4 via `@tailwindcss/postcss`
- `Dockerfile` / `docker-compose.yml` - Local dev container
- `.mise.toml` - Toolchain versions (Node.js 22, pnpm 10)

## Styling

**Tailwind CSS v4**, loaded via the PostCSS plugin (`@tailwindcss/postcss`). Brand
tokens (colors, fonts, radii) are defined in `@theme inline` in `src/app/globals.css`.
Use Tailwind utility classes directly in JSX.
