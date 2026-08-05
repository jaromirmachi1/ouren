# Ouren monorepo

| App | Path | Port | Role |
|-----|------|------|------|
| Marketing site | `/` (root) | 5173 | Public Vite + React site |
| Portal | `dashboard/` → **/admin** | 3000 | Internal shadcn dashboard |
| CMS | `sanity/` | 3333 | Sanity Studio content |

## Quick start

```bash
# Marketing
npm install && npm run dev

# Dashboard (works with mock data out of the box)
cd dashboard && npm install && npm run dev
# → http://localhost:3000/admin
# → also http://localhost:5173/admin (proxied when both run)

# Sanity Studio (needs free Sanity project ID)
cd sanity && npm install
# set SANITY_STUDIO_PROJECT_ID in sanity/.env
npm run dev
```

## Architecture

```
Marketing site  ←──(later)──  Sanity content API
/admin portal   ←───────────  Sanity (or mock until configured)
Sanity Studio   ───────────→  edit projects / units / customers / inquiries
```

Content models live in `sanity/schemaTypes/`.
Dashboard data layer: `dashboard/src/lib/sanity.ts`.

## Client database (Panorama Žabiny)

The portal shows **only real data**: 81 Panorama Žabiny clients + the Panorama project. Fake placeholder projects / inquiries were removed. Units and inquiries stay empty until you add them.

Sanity project `xditqcf8` is currently **empty**. Until you import, the admin portal falls back to `dashboard/src/lib/clients-seed.ts`.

| Group | Count | Status |
|-------|------:|--------|
| 2. etapa Panorama Žabiny | 10 | qualified |
| Databáze klientů | 66 | lead |
| Kupující | 5 | contract |

Push into Sanity (requires login once):

```bash
cd sanity
npx sanity login
npx sanity dataset import seed/project-panorama.ndjson production
npx sanity dataset import seed/customers.ndjson production
```

## Portal login (team access)

The admin UI at `/admin` is protected. Users are defined in `dashboard/.env.local`:

```bash
AUTH_SECRET=...          # random secret
AUTH_URL=http://localhost:3000/admin
AUTH_USERS=you@email.com:password,colleague@email.com:password
```

- Login: http://localhost:3000/admin/login  
- Add/remove colleagues by editing `AUTH_USERS`, then restart `npm run dev`  
- Settings page (`/admin/settings`) lists configured emails and sign-out
