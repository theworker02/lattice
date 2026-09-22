# Buyer evaluation â€” lattice

## Goal

In 15â€“45 minutes, verify the Product builds or runs as documented and that proprietary notices are present.

## Steps

1. Confirm root `LICENSE` is proprietary and `ACQUISITION.md` exists.
2. Skim `README.md` install/run claims.
3. Execute:

```
```text
Environment Ã¢â€ â€™ sensor Ã¢â€ â€™ local logic Ã¢â€ â€™ typed signal Ã¢â€ â€™ chosen destination
                  Ã¢â€ â€˜                         Ã¢â€ â€œ
          functional mirror skin      Twin / Observatory
```
```powershell
python -m http.server 4173 --bind 127.0.0.1
```
```powershell
node --test tests/*.test.mjs
node --check src/mirrorfield-app.mjs
node --check src/twin.mjs
python tools/generate-cad.py
python tools/verify-artifacts.py
```
```

4. Run tests if present (`npm test`, `pytest`, `cargo test`, `go test ./...`, etc.).
5. Record README vs observed behavior gaps in workpapers.

## Pass criteria

- [ ] Clone succeeds
- [ ] Documented happy path works **or** failure is explained
- [ ] Minimal path needs no surprise secrets
- [ ] License notices intact

*Updated: 2026-09-22*
