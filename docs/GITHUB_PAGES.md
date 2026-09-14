# GitHub Pages deployment

LATTICE is a static site. The simulator, Signal Cube router and digital Twin run in the visitor's browser; the published site has no API, account service, database, telemetry stream or hardware-control endpoint.

The repository uses the included GitHub Actions workflow to build `dist/` and publish it to GitHub Pages after every push to `main`.

## One-time repository setup

1. Open **Settings → Pages** in `theworker02/lattice`.
2. Under **Build and deployment**, choose **GitHub Actions** as the source.
3. Push the workflow to `main` (or run **Deploy GitHub Pages** from the Actions tab).
4. After the workflow succeeds, open `https://theworker02.github.io/lattice/`.

GitHub Pages must be enabled by a repository administrator. The workflow supplies the deployment artifact but does not change repository settings or configure a custom domain.

## What gets published

`node tools/build-github-pages.mjs` recreates `dist/` from public source material. It places the Mirrorfield portal at `/`, preserves it at `/mirrorfield.html`, and publishes the original Patchboard at `/patchboard.html`.

The build writes `.nojekyll`, so filenames and static assets are served without Jekyll processing. It excludes repository metadata, tests, tools, local storage, Node dependencies and development settings.

## Verify before publishing

```powershell
node --test tests/*.test.mjs
python tools/verify-artifacts.py
node tools/build-github-pages.mjs
```

Inspect `dist/` before deploying. Do not add secrets, analytics, databases or hardware-control features merely to host this static portal. GitHub Pages is appropriate only while all essential behavior stays browser-local.

## Publishing and rollback

The workflow deploys automatically after a push to `main`. A repository administrator can also re-run a successful workflow from **Actions**. To roll back, revert the relevant commit, push the revert to `main`, and let the workflow publish that revision.
