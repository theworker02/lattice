# Public deployment checklist

Use this checklist immediately before a GitHub Pages publish. It is intentionally small: this deployment is a public static portal, not a cloud control system.

## Review the public message

- [ ] README, Start Here, partnership note and M1 plan still say clearly that hardware is CONCEPT and partner-led.
- [ ] No document claims physical validation, certification, measured performance, customer sale or a real manufacturer agreement without evidence.
- [ ] External links and manufacturer contact details are deliberate and current.

## Build and inspect

- [ ] Run `node --test tests/*.test.mjs`.
- [ ] Run `python tools/verify-artifacts.py`.
- [ ] Run `node tools/build-github-pages.mjs`.
- [ ] Inspect `dist/`: it contains only public portal assets and documents.
- [ ] Confirm `dist/` does not contain `.env`, local storage, Node dependencies, tests, tooling, worker source, vendor-private material or secrets.

## GitHub repository and Pages

- [ ] Confirm the repository administrator has selected **GitHub Actions** in **Settings → Pages**.
- [ ] Confirm the final Pages address is `https://theworker02.github.io/lattice/` or an intentionally configured custom domain.
- [ ] Review the `Deploy GitHub Pages` Actions workflow before the first deployment.
- [ ] Do not add secrets, databases, analytics or backend services merely to publish the static portal.

## Publish and smoke check

- [ ] Push the reviewed commit to `main`, or manually run the `Deploy GitHub Pages` workflow.
- [ ] Open `/`, `/mirrorfield.html`, `/patchboard.html`, `/START_HERE.md` and one diagram URL.
- [ ] Verify the browser console has no blocked essential asset and local simulator controls still work.
- [ ] Confirm a missing URL returns the public 404 page.
- [ ] Confirm exported browser-local data stays on the browser and is not sent to a service.

## If something is wrong

Use the GitHub Actions deployment history with the repository administrator. Record what was changed, revert to the previous known-good Git commit, push it to `main`, then let Pages publish that revision. Do not patch production by adding secrets or a backend to bypass the static-site design.
