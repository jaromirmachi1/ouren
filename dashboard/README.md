# Ouren Portal (internal dashboard)

Lives at **http://localhost:5173/admin** when you run `npm run dev` from the repo root.

## Connect Sanity

1. Create a project at https://www.sanity.io/manage
2. Copy Project ID into `.env.local` (see `.env.example`)
3. Restart `npm run dev`

## Pages

| Route | Purpose |
|-------|---------|
| `/admin/login` | Sign in |
| `/admin` | Overview |
| `/admin/customers` | Clients |
| `/admin/projects` | Developments |
| `/admin/units` | Units |
| `/admin/inquiries` | Form inbox |
| `/admin/settings` | Team access & roles |

## Auth

Users are defined in `dashboard/.env.local` as `email:password:role` (roles: `viewer`, `re_agent`, `ceo`). Unauthenticated visits to `/admin` redirect to `/admin/login`.

## Deploy on Vercel (two projects)

| Project | Root directory | Build | Env vars |
|---------|----------------|-------|----------|
| **Marketing** (`ouren.vercel.app`) | repo root | `npm run build` | `VITE_PORTAL_URL` only |
| **Portal** (`ouren-portal.vercel.app`) | `dashboard` | auto (Next.js) | `AUTH_*`, Sanity keys |

### Portal project

1. New Vercel project → same repo → **Root Directory: `dashboard`**
2. Add env from `dashboard/.env.example` (copy values from `.env.local`)
3. Set `AUTH_URL=https://YOUR-PORTAL-PROJECT.vercel.app/admin`
4. Deploy

### Marketing project

1. Add **`VITE_PORTAL_URL=https://YOUR-PORTAL-PROJECT.vercel.app/admin`**
2. Remove `AUTH_*` vars from marketing (they belong on portal only)
3. **Redeploy marketing** — Vite reads env only at build time; adding env without redeploy does nothing

The footer link uses `VITE_PORTAL_URL` directly. Do **not** set it to `ouren.vercel.app/admin`.
