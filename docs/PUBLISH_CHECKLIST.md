# Public deployment checklist

Use this checklist immediately before a Cloudflare Workers publish. It is intentionally small: this deployment is a public static portal, not a cloud control system.

## Review the public message

- [ ] README, Start Here, partnership note and M1 plan still say clearly that hardware is CONCEPT and partner-led.
- [ ] No document claims physical validation, certification, measured performance, customer sale or a real manufacturer agreement without evidence.
- [ ] External links and manufacturer contact details are deliberate and current.

## Build and inspect

- [ ] Run `node --test tests/*.test.mjs`.
- [ ] Run `python tools/verify-artifacts.py`.
- [ ] Run `node tools/build-cloudflare.mjs`.
- [ ] Inspect `dist/`: it contains only public portal assets and documents.
- [ ] Confirm `dist/` does not contain `.env`, local storage, Node dependencies, tests, tooling, worker source, vendor-private material or secrets.

## Cloudflare account and domain

- [ ] Confirm the account and person authorized to publish.
- [ ] Confirm the Worker name in `wrangler.jsonc` and final Workers.dev/custom domain routing.
- [ ] Run `npx wrangler deploy --dry-run` and resolve configuration errors before a publish.
- [ ] Do not add secrets, databases, analytics or bindings merely to deploy the static portal.

## Publish and smoke check

- [ ] Run `npx wrangler deploy` only after the review above.
- [ ] Open `/`, `/mirrorfield.html`, `/index.html`, `/START_HERE.md` and one diagram URL.
- [ ] Verify the browser console has no blocked essential asset and local simulator controls still work.
- [ ] Confirm a missing URL returns the public 404 page.
- [ ] Confirm exported browser-local data stays on the browser and is not sent to a service.

## If something is wrong

Use the Cloudflare dashboard or `wrangler versions` / rollback workflow with the account owner. Record what was changed, return the public site to the previous known-good version, then correct the source and repeat the checklist. Do not patch production by adding secrets or bypassing the Worker headers.
