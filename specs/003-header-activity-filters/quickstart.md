# Quickstart: Verify header filters

## Prerequisites

- `.env` with Supabase vars; seed data loaded (`scripts/run-seed.mjs` if applicable).
- `npm install`

## Commands

```bash
npm run lint
npm run test
npm run build
npm run dev
```

## Manual checklist

1. Open the users roster page. Confirm one row: **Year** → **Quarter** → **Category** → search with placeholder `Search employee..`.
2. Defaults: all users visible; podium matches top three by total points (all activities).
3. Select year **2025** only: every visible user’s counted activities dated in 2025; points and podium update.
4. Select **Q2** with **2025**: only activities in 2025 Q2; list and podium consistent.
5. Select category **Education** (and try **Public speaking** / **University partner**): only activities in that category; labels match spec casing.
6. Type in search: results narrow live on each keystroke; clearing restores name filter off (trimmed empty).
7. Combine search + activity filters: only users matching name **and** shown with filtered activities; ordering by filtered points.
8. Narrow until no users: empty list and no podium crash (empty or hidden podium per implementation).
