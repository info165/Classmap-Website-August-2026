# ClassMap Website

React 19 + Vite frontend served by an Express server, with Firebase Storage
integration and a Resend-backed demo request endpoint.

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

The server runs on http://localhost:4000 by default. Set `PORT` to change it.

## Deploying

```
npm ci
npm run build
NODE_ENV=production npm start
```

`npm run build` produces two things:

- `dist/` — the built client, served as static files
- `build/server.cjs` — the bundled Express server

**`NODE_ENV` must be set to `production` on the live server.** Without it the
server boots the Vite dev middleware instead of serving `dist/`. The startup log
line states which mode it booted in — check it after deploying.

### Environment variables

Set these on the host, not in a committed file. See `.env.example` for the full list.

| Variable | Required | Notes |
| --- | --- | --- |
| `RESEND_API_KEY` | Yes | Demo request emails fail with a 500 without it. |
| `RESEND_FROM_EMAIL` | Yes, in production | Must be on a domain verified in Resend. The default (`onboarding@resend.dev`) is Resend's test sender and only delivers to the account owner. |
| `DEMO_NOTIFY_EMAIL` | No | Inbox receiving demo requests. Defaults to `info@classmap.in`. |
| `NODE_ENV` | Yes, in production | Must be `production`. |
| `PORT` | No | Defaults to `4000`. |
| `DIST_PATH` | No | Override the static file directory. Defaults to `dist/` next to the bundle. |

`VITE_*` variables are inlined into the client bundle at **build** time, so they
must be present when `npm run build` runs — setting them only at runtime has no effect.

Note that `src/lib/firebase.ts` contains a Firebase web API key. That is a public
client identifier, not a secret — it ships in the browser bundle by design. Access
is controlled by Firebase Storage security rules.
