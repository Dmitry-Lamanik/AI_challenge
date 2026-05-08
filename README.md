# React + TypeScript + Vite + Supabase
All data was randomly generated in the scripts/run-seed.mjs file.

## Deploy to GitHub Pages

1. Push this branch to `main` (deployment workflow runs on push to `main`).
2. In GitHub: `Settings` -> `Pages` -> set `Source` to `GitHub Actions`.
3. In GitHub: `Settings` -> `Secrets and variables` -> `Actions` -> add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Wait for workflow `Deploy to GitHub Pages` to finish.
5. Open the published URL from the workflow output (or from `Settings` -> `Pages`).
