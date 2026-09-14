# Cloudflare Workers deployment

LATTICE is prepared as a **static-first Cloudflare Worker**. The public deployment serves the portal, documents, diagrams and local simulators. It does not create an account system, cloud database, telemetry stream or hardware-control endpoint.

## What is deployed

The build copies only public portal assets and repository documents into `dist/`. Tests, build tooling, Worker source and local development state are not included in the asset bundle. `/` opens `/mirrorfield.html`; the original patchboard remains at `/index.html`.

Browser local storage remains browser-local after deployment. A visitor’s simulated projects, routes and exports do not become shared cloud data.

## Before the first deploy

1. Install a current Node.js release.
2. Sign in to the Cloudflare account that will own the Worker: `npx wrangler login`.
3. Choose the final Worker name/domain, then update `name` in `wrangler.jsonc` if `lattice-mirrorfield` is unavailable.
4. Build and validate the public bundle:

```powershell
node tools/build-cloudflare.mjs
npx wrangler deploy --dry-run
```

The dry run validates the Worker configuration without publishing a production version. Inspect `dist/` before deploy; it is the exact static payload.

## Deploy

```powershell
node tools/build-cloudflare.mjs
npx wrangler deploy
```

Deployment is intentionally manual. Do not deploy until the project owner has reviewed the final public files, name and Cloudflare account.

Use the [public deployment checklist](PUBLISH_CHECKLIST.md) immediately before a real publish. It includes the post-deploy smoke routes and the check that local simulator state remains local.

## Security and caching

The Worker permits GET and HEAD only, sets a restrictive content security policy, blocks framing, disables unused browser permissions and applies `nosniff`. HTML and Markdown use `no-cache` so documentation updates appear promptly. Script, style, SVG, PNG and JSON assets receive a short 24-hour cache because current filenames are not content-hashed.

No secrets or bindings are required. If a future feature needs a secret, add it with `wrangler secret put`; never add it to `wrangler.jsonc`, browser code or the repository.

## Future Cloudflare additions

Do not add storage merely because it is available. A future physical-pilot portal might use a separately designed API for opt-in shared evidence, with explicit data ownership, authentication and retention decisions. That is not part of this static deployment.
