# Sanity Studio for Ouren

## Setup

1. Create a free project at https://www.sanity.io/manage
2. Copy your Project ID into `sanity.cli.ts` and `.env`:

```bash
# sanity/.env
SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=production
```

3. Install & run:

```bash
cd sanity
npm install
npm run dev
```

Studio opens at http://localhost:3333

## Content models

| Type | Purpose |
|------|---------|
| **Project** | Developments shown on the marketing site |
| **Unit** | Individual apartments/units inside a project |
| **Customer** | Leads & clients for the internal portal |
| **Inquiry** | Sell-with-us / contact form submissions |
| **Blog post** | Journal content |

## Deploy

```bash
npm run deploy
```
