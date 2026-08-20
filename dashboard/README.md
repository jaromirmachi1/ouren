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
