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

## Deploy on Vercel (separate project)

The marketing site and portal are **two apps**. Vercel only builds the Vite site from the repo root today — `/admin` exists only in local dev via proxy.

1. Create a **second Vercel project** from the same GitHub repo.
2. Set **Root Directory** to `dashboard`.
3. Add env vars from `dashboard/.env.example` (including `AUTH_URL` pointing to your portal URL, e.g. `https://your-portal.vercel.app/admin`).
4. Deploy — the portal will be at `https://your-portal.vercel.app/admin`.
5. On the **marketing** Vercel project, add:
   ```
   VITE_PORTAL_URL=https://your-portal.vercel.app/admin
   ```
6. Redeploy the marketing site. The footer “Ouren Portal” link will point to the live portal.
