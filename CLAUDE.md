# Mission Control — wo die Aufgaben stehen

Dieses Repo wird vom Sitz **S-Go-Code** geschrieben (ein Schreiber je Repo). Aufgaben, Berichte und
Nachprüfungen liegen nicht hier, sondern im Board:

    cd ~/Code/mission-control && export BOARD_SESSION="S-Go-Code" && node bin/board.mjs list --mine

Boot-Zeile für eine neue Sitzung: `node bin/board.mjs boot "S-Go-Code"`.
Nach **jeder** erledigten Aufgabe sofort melden (`state <kennung> done --report "…"`). Sind die
Prüfungen eines PR grün, mergt der Sitz selbst (`gh pr merge <n> --merge`) und trägt
`merged <kennung> --pr <n> --commit <sha>` ein. Protokoll: `board/README.md` im Board-Repo.
Fehlt der Zugang: `gh auth login` als VEHO-DOMI (Koki tippt selbst).

## Codex-Trial (R295)

Codex (Board-Name CODEX-TRIAL) arbeitet im eigenen Klon, pusht `codex/*`-Branches und mergt seine
PRs selbst, sobald CI grün ist. S-Go-Code prüft Diff und Tore **nach** dem Merge, binnen eines Tages;
jeder Blocker oder Major wird eine Karte an CODEX-TRIAL. Die Regeln für Codex stehen in dessen
eigener AGENTS.md, nicht hier.

## Prüfen, ohne den Hauptklon anzufassen

    export PATH=/opt/homebrew/opt/node@24/bin:$PATH
    git fetch -q origin && git worktree add --detach ~/Code/domigo-v2-review-<n> <sha>
    cd ~/Code/domigo-v2-review-<n> && pnpm install --frozen-lockfile

Die Tor-Batterie ist genau die Liste der `- run:`-Zeilen in `.github/workflows/ci.yml`
(dazu `pnpm build && pnpm check:bundle`). Ausgabe je Tor in eine Datei, gelesen werden Exit-Code und
Schluss. Danach `git worktree remove ~/Code/domigo-v2-review-<n>`. Nie `git reset --hard`, nie `git`
in iCloud-Ordnern, keine Schülernamen und keine Geheimnisse auf Karten.
