# ClassMap Website

React 19 + Vite frontend, deployed to Cloudflare Pages as a static build with a
single Pages Function handling the demo request form.

## Run locally

**Prerequisites:** Node.js 20+

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in the values (at minimum `RESEND_API_KEY`
   if you need the demo request form to work).
3. Start the dev server:
   ```
   npm run dev
   ```

Runs on http://localhost:4000. Set `PORT` to change it.

`npm run dev` uses the Express server in `server.ts`, which serves the Vite dev
middleware and its own copy of the `/api/book-demo` route. **That server is for
local development only — it is not what runs in production.**

### Previewing what actually deploys

To exercise the real Cloudflare Pages Function instead of the Express route:

1. Copy `.dev.vars.example` to `.dev.vars` and fill it in. Wrangler reads
   `.dev.vars` for Functions, not `.env`.
2. ```
   npm run preview
   ```

This builds the site and serves it through wrangler on http://localhost:3007,
routing `/api/book-demo` to `functions/api/book-demo.ts` — the same code path as
production. Do this before deploying any change to the form.

## Deploying to Cloudflare Pages

The repo is wired for Pages' Git integration. `wrangler.toml` pins the build
output directory and compatibility date so a fresh deploy can't get them wrong.

**Pages project settings:**

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | *(leave empty)* |

`functions/` is picked up automatically — no configuration needed.

**Environment variables** (Pages → Settings → Environment variables). Set these
for both Production and Preview, and mark `RESEND_API_KEY` as **encrypted**:

| Variable | Required | Notes |
| --- | --- | --- |
| `RESEND_API_KEY` | Yes | From resend.com/api-keys. Encrypt it. |
| `DEMO_NOTIFY_EMAIL` | Yes | Inbox receiving demo requests, e.g. `info@classmap.in`. |
| `RESEND_FROM_EMAIL` | Yes, in production | Must be on a domain verified in Resend. Without it the sender falls back to `onboarding@resend.dev`, which only delivers to your own Resend account address. |

`VITE_*` variables are inlined into the client bundle at **build** time, so they
must be set in the Pages build environment — setting them only at runtime has no effect.

### Cutting classmap.in over to this site

1. Deploy and confirm the `*.pages.dev` preview URL works, including the demo form.
2. In the Pages project → Custom domains, add `classmap.in` (and `www`).
3. Remove the old site's DNS records for those names first, or the new custom
   domain will not validate.

Note that `NODE_ENV` is irrelevant on Cloudflare — Pages runs V8 isolates, not
Node, so `server.ts` never executes there. It only matters if you ever run the
Express server on a Node host, in which case set `NODE_ENV=production` and use
`npm run build:server` + `npm start`.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Local Express + Vite dev server on port 4000. |
| `npm run build` | Static client build into `dist/`. What Cloudflare Pages runs. |
| `npm run preview` | Build, then serve via wrangler with the real Pages Function. |
| `npm run build:server` | Also bundles the Express server to `build/server.cjs`, for Node hosting. |
| `npm start` | Runs that bundle. Requires `build:server` and `NODE_ENV=production`. |
| `npm run lint` | `tsc --noEmit`. |

## Notes

`src/lib/firebase.ts` contains a Firebase web API key. That is a public client
identifier, not a secret — it ships in the browser bundle by design. Access is
controlled by Firebase Storage security rules.

The demo request endpoint exists twice: `functions/api/book-demo.ts` (production,
Cloudflare) and the route in `server.ts` (local dev only). Keep them in step when
changing the form.
