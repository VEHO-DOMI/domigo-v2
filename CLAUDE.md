# Mission Control — wo die Aufgaben stehen

Dieses Repo wird vom Claude-Sitz **GG-DomiGo** geschrieben und gemergt (ein Schreiber je Repo; Charta F4 vom
04.10.2026 in `PLATFORM MASTER/SESSION-PROMPTS/GG_DOMIGO/GG_DOMIGO_BOOT_2026-10-04_F4.md`). Codex-Sitzungen bauen
je Karte in eigenen Klonen und öffnen PRs gegen `main`; ihre Regeln stehen in `AGENTS.md`. Aufgaben, Berichte und
Nachprüfungen liegen nicht hier, sondern im Board (Lane cgo):

    cd ~/Code/mission-control && export BOARD_SESSION="GG-DomiGo" && node bin/board.mjs list --lane cgo --state offen

Boot-Zeile für eine neue Sitzung: `node bin/board.mjs boot "GG-DomiGo"`.
Nach **jeder** erledigten Aufgabe sofort melden (`state <kennung> done --report "…"`). Ein PR wird gemergt, wenn die
Batterie grün ist und der blinde Leser freigibt (`gh pr merge <n> --merge --match-head-commit <sha>`), danach
`merged <kennung> --pr <n> --commit <sha>`. Protokoll: `board/README.md` im Board-Repo.
Fehlt der Zugang: `gh auth login` als VEHO-DOMI (Koki tippt selbst).

## Prüfen, ohne den Hauptklon anzufassen

    export PATH=/opt/homebrew/opt/node@24/bin:$PATH
    git fetch -q origin && git worktree add --detach ~/Code/_gg/domigo-review-<n> <sha>
    cd ~/Code/_gg/domigo-review-<n> && pnpm install --frozen-lockfile

Die Tor-Batterie ist genau die Liste der `- run:`-Zeilen in `.github/workflows/ci.yml`
(dazu `pnpm build && pnpm check:bundle`). Ausgabe je Tor in eine Datei, gelesen werden Exit-Code und
Schluss. Danach `git worktree remove ~/Code/_gg/domigo-review-<n>`. Nie `git reset --hard`, nie `git`
in iCloud-Ordnern, keine Schülernamen und keine Geheimnisse auf Karten. Nur `main` baut auf Vercel automatisch
(`apps/web/scripts/vercel-ignore-build.sh`); eine Vorschau entsteht nur durch bewusstes Redeploy ohne »Ignore Build Step«.
