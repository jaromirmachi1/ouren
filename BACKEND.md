# Ouren monorepo

| App | Path | Port | Role |
|-----|------|------|------|
| Marketing site | `/` (root) | 5173 | Public Vite + React site |
| Portal | `dashboard/` | 3000 | Internal shadcn dashboard |
| CMS | `sanity/` | 3333 | Sanity Studio content |

## Quick start

```bash
# Marketing
npm install && npm run dev

# Dashboard (works with mock data out of the box)
cd dashboard && npm install && npm run dev

# Sanity Studio (needs free Sanity project ID)
cd sanity && npm install
# set SANITY_STUDIO_PROJECT_ID in sanity/.env
npm run dev
```

## Architecture

```
Marketing site  ←──(later)──  Sanity content API
Internal portal ←───────────  Sanity (or mock until configured)
Sanity Studio   ───────────→  edit projects / units / customers / inquiries
```

Content models live in `sanity/schemaTypes/`.
Dashboard data layer: `dashboard/src/lib/sanity.ts`.
