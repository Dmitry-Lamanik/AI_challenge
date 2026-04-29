# Quickstart: Users list feature

## Prerequisites

- Node.js 20+ (for `node --env-file` on `db:seed`)
- Supabase project with Postgres and anon key

## Environment

Copy `.env.example` → `.env` and set:

- `VITE_SUPABASE_URL` — Project URL  
- `VITE_SUPABASE_ANON_KEY` — anon public key  
- `DATABASE_URL` — Postgres connection string (for `npm run db:seed`)

## Schema + demo data

Apply DDL and seed data (destructive to the three public tables — see `supabase/seed.sql`):

```bash
npm run db:seed
```

## Run the app

```bash
npm install
npm run dev
```

Open the printed local URL. The roster loads users via Supabase using the nested query defined in `contracts/roster-read.md`.

## Lint / build

```bash
npm run lint
npm run build
```

## Related docs

- Spec: [spec.md](../spec.md)  
- Plan: [plan.md](../plan.md)
