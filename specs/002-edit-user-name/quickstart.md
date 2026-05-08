# Quickstart: Edit user name in popup

## Prerequisites

- Node.js 20+
- Configured `.env` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Seeded database (`npm run db:seed`)

## Run locally

```bash
npm install
npm run dev
```

## Manual verification flow

1. Open roster page and expand/open the user details popup.
2. Click user name to enter edit mode.
3. Enter a valid new value and save.
4. Confirm updated name appears in popup and user card without reload.
5. Re-enter edit mode, clear input to whitespace, verify save is blocked.
6. Trigger an API failure (or disable network), verify error state keeps previous saved name.
7. Validate conflict path by changing same user name from another session and saving stale popup value; verify conflict message requires reopen/reload.

## Test and quality checks

```bash
npm run test
npm run lint
npm run build
```

## Latest validation snapshot

- Date: 2026-04-30
- `npm run test`: pass (7 files, 9 tests)
- `npm run lint`: pass
- `npm run build`: pass

## Related docs

- Spec: [spec.md](./spec.md)
- Plan: [plan.md](./plan.md)
- Research: [research.md](./research.md)
- Data model: [data-model.md](./data-model.md)
- Contract: [contracts/user-name-update.md](./contracts/user-name-update.md)
