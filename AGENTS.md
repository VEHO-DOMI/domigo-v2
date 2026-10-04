# AGENTS.md — Regeln für Codex-Sitzungen in diesem Repo (VEHO-DOMI/domigo-v2)

Gilt seit 04.10.2026 (Charta F4, Masterplan cgo-072, Kokis Freigabe cgo-073). Ersetzt den Codex-Trial (R295).

## Rechte
- Du arbeitest nur im eigenen Klon `~/Code/_codex/<karte>` und nur, wenn eine Board-Karte (Mission Control, Lane cgo) dich dafür gebootet hat. Die Karte ist der Auftrag und die Freigabe.
- Du darfst: Zweig `codex/<karte>-<kurz>` von `origin/main` anlegen, committen, pushen, einen Pull Request gegen `main` öffnen (`gh pr create --base main`).
- Du darfst nie: mergen (`gh pr merge`), auf `main` pushen, force-pushen, `git reset --hard`/`clean`, Migrationen gegen Neon ausführen, Secrets oder Variablenwerte ausgeben, Schüler- oder Klassennamen lesen oder nennen, in `~/Code/domigo-v2`, `~/Code/_exec`, `~/Code/_gg`, fremden Klonen oder iCloud-Ordnern schreiben.
- Gemergt wird vom Claude-Sitz GG-DomiGo nach grüner Batterie und blindem Leser.

## Tore
- Vor `review` die Tore deiner Dateien (`scripts/check-*.mjs` mit und ohne `--selftest`, `pnpm test` der berührten Pakete, `pnpm typecheck`, `pnpm lint`); Ausgaben in Dateien außerhalb des Repos; Exit-Codes als Tabelle in den PR-Text. Die vollständige `ci.yml`-Batterie plus `pnpm build` und `pnpm check:bundle` fährt der GG in seiner Merge-Kette (du reservierst kein Schloss und schreibst nicht in `~/Code/_gg`); im Bericht steht dann »Vollbatterie: UNVERIFIZIERT, läuft in der GG-Kette« (F4 §3, Lehre cgo-075).
- Jede neue Prüfung bekommt einen Tamper (absichtlicher Fehler, der rot werden muss); nur eigene Bytes zurücknehmen (`git checkout -- <datei>`).
- Berührt der PR Rendering, Assets, Entities oder Karten-DOM: PERF-WÄCHTER-Tabelle nach `docs/PERF_WAECHTER.md` (CI-Job `perf-contract` prüft sie).
- Rohlogs, Bilder und Berichte nie ins Repo committen.

## Schülertext
`PLATFORM MASTER/SESSION-PROMPTS/GG_DOMIGO/SCHUELERSPRACHE_UND_DIDAKTIK_2026-09-30.md` (iCloud) gilt: Originalseiten vor dem Entwurf, sichtbare Gliederung »Chapter«, deutsche Führung in Jahrgang 1, kein Meta, keine Werbesprache. Kein neuer Wortlaut für Kinder, wo die Karte Kokis Satz verlangt.

## Rückweg
`node bin/board.mjs state <karte> review --report "PR <n> · Kopf <sha> · Basis <sha> · Tore … · Tamper … · UNVERIFIZIERT: … · FREIGABE für GG-Review: ja/nein — Beleg: …"` (ohne Terminal: Karten-Formular »Dem GG mitteilen«). Fragen: `hold <karte> --reason "FRAGE AN DEN GG: …" --holdby "GG-DomiGo"`. Koki wird nie direkt gefragt.
