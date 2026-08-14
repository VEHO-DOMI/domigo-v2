# The three type families, and why they live here

`inter-var-latin.woff2` · `fredoka-var-latin.woff2` · `quicksand-var-latin.woff2`

All three are released under the **SIL Open Font License, Version 1.1**, which
expressly permits redistributing the font files, bundled with software, free of
charge. The full licence text ships with each family upstream:

| Family | Upstream | Licence |
|---|---|---|
| Inter | github.com/rsms/inter | SIL OFL 1.1 |
| Fredoka | github.com/hafontia/Fredoka | SIL OFL 1.1 |
| Quicksand | github.com/andrew-paglinawan/QuicksandFamily | SIL OFL 1.1 |

**How they got here (R5-W3 · E5, 2026-08-14).** These are the *latin* slices
Google Fonts itself serves for the weight ranges the type system uses — the very
files `next/font/google` used to download during every build. They were fetched
once from `fonts.gstatic.com` and committed, so the build no longer depends on a
third-party server being reachable (debt D-33: PR #273 ran the same commit three
times, twice red; the same failure took down a build in this session).

Each is a VARIABLE font: one file carries the whole weight axis, which is what
Google was already serving, so nothing about how the pages render changed.

**If a family needs updating**, replace the file and say so here. Do not reach
back to `next/font/google` — `scripts/check-fonts.mjs` fails the build if the
import returns, and `pnpm build` would go back to depending on the network.
