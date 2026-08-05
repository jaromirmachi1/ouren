# Ouren Portal (internal dashboard)

Next.js + shadcn/ui workspace for customers, units, projects, and inquiries.
Backed by Sanity CMS (falls back to mock data until project ID is set).

## Run

```bash
cd dashboard
npm install
npm run dev
```

Open http://localhost:3000

## Connect Sanity

1. Create a project at https://www.sanity.io/manage
2. Copy Project ID into `.env.local` (see `.env.example`)
3. Run the studio (`cd ../sanity && npm run dev`) and add content
4. Restart the dashboard — header badge switches from **Mock data** to **Sanity live**

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Overview KPIs + recent activity |
| `/customers` | Leads & clients, portal access |
| `/projects` | Developments |
| `/units` | Unit inventory + assignments |
| `/inquiries` | Website form inbox |
