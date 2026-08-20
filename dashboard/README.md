# Ouren Portal (internal dashboard)

## Local dev

From repo root:

```bash
npm run dev
```

- Marketing site: http://localhost:5173  
- Portal: http://localhost:5173/admin  

## Vercel (one project)

Both the marketing site and portal deploy together from the **`dashboard/`** folder.

### Vercel project settings

| Setting | Value |
|---------|--------|
| Root Directory | **`dashboard`** |
| Framework | Next.js (auto) |

Install and build commands come from `dashboard/vercel.json`.

### Environment variables (on this project)

Copy from `dashboard/.env.example` / `.env.local`:

- `AUTH_SECRET`, `AUTH_URL`, `AUTH_TRUST_HOST`, `AUTH_USERS`
- `NEXT_PUBLIC_SANITY_*`, `SANITY_API_TOKEN` (optional)

Set **`AUTH_URL`** to your live portal URL, e.g. `https://ouren.vercel.app/admin`.

Remove `VITE_PORTAL_URL` — not used anymore.

### How it works

1. Vercel builds the Vite marketing site into `dashboard/public/site/`
2. Next.js builds the portal at `/admin`
3. Next.js rewrites all other routes to the marketing SPA

Result: one domain — site at `/`, portal at `/admin/login`.

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Marketing homepage |
| `/blog` | Journal |
| `/admin/login` | Portal sign in |
| `/admin` | Portal overview |
| `/admin/customers` | Clients |
| `/admin/projects` | Developments |
| `/admin/units` | Units |
| `/admin/inquiries` | Form inbox |
| `/admin/settings` | Team access & roles |

## Auth

Users are defined in `AUTH_USERS` as `email:password:role` (`viewer`, `re_agent`, `ceo`).
