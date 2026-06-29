# WordSmith

Learn vocabulary by typing it. Every review is a typing drill, and the SRS
scheduler grades you from *measured* recall — latency, typing fluency vs. your
own baseline, and correctness — instead of asking you to self-rate.

## Structure (monorepo, npm workspaces)

- `packages/core/`    pure logic: scoring, SRS, difficulty. No deps. Built first.
- `packages/api/`     HTTP boundary. Depends on core. Mobile reuses this later.
- `packages/web/`     browser client (currently the login/landing page).
- `packages/scripts/` one-time seeding (WordNet). Never ships.

**Rule:** dependencies point *inward* toward core. core imports nothing.

## Run the web client
    npm run dev:web      # serves packages/web/public on :5173