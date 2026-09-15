# ch01 · welle-041 · Merles Posen, die nur Kopien waren

Nach-Prüfung ch01 (welle-033, §6, Major): sieben Merle-Dateien waren EIN Bild (`merle_a = b = c = d = caged0 = caged1 = settle0`),
dazu `wave0 = wave1`, `walk2 = walk3`, `run = walk1`. Gefangen sah aus wie frei, Winken und die dritte Geh-Zelle standen still.
Das Quellblatt `merle/merle-motion-v2-original.png` hat nur sechs Posen, alle schon verbraucht — neu ausschneiden ging nicht.

## Was entstand
| Datei | Pose | aus | Zone (Anteil der Zelle) |
|---|---|---|---|
| `merle_caged0` | verhext: Kopf gesenkt, Augen zu, Mund traurig, Arme schlaff (`entities.ts` verspricht genau das) | `merle_a` | oben bis 80 % Höhe |
| `merle_caged1` | zweite Zelle derselben Seufzer-Schleife: Kopf etwas tiefer und seitlich | `merle_caged0`-Bearbeitung | oben bis 80 % |
| `merle_settle0` | erste Zelle derselben Erleichterung wie `settle1`: Augen offen, kleineres Lächeln, Fäuste etwas tiefer (die Schleife settle0↔settle1 wechselt alle 12 Takte) | `merle_settle1` | oben bis 62 % |
| `merle_wave1` | andere Hälfte des Winkens: Unterarm weiter außen, Hand anders geneigt | `merle_wave0` | rechts oben (x ≥ 50 %, y ≤ 55 %), Zelle beidseitig verbreitert |
| `merle_walk3` | Gegen-Schritt: Beine und Armschwung vertauscht (vorderer Arm schwingt vor die Brust) | `merle_walk1` | ab 36 % Höhe (Kopf bleibt), Zelle beidseitig verbreitert |
| `merle_run` | **entfernt** — nie gezeichnet: `entPoseCell` gibt für `classmate` vor der Lauf-Regel zurück | — | — |

**Zweiter Durchgang (blinder Kunst-Leser + Widerleger, welle-041):** Der erste `settle0` (überrascht, Hände offen, aus `merle_a`)
flackerte im Wechsel mit `settle1` (lachend, Fäuste) und war 5 % kleiner — ersetzt durch eine Zelle aus `settle1` selbst. Der erste
`walk3` las sich als Kopie von `walk1` (Arme gleich) — ersetzt durch einen Auftrag mit ausdrücklich vertauschtem Armschwung. Die ersten
Versuche liegen nicht im Repo. Die Geh-Schleife läuft seit dieser Runde 1→2→3→2 (`anim.ts` `ROAM_CYCLE`): im alten Kreis 1→2→3→1 folgten zwei Kontaktposen aufeinander, und nahes und fernes Bein sind unter dem Kleid nicht zu unterscheiden — das las sich als Hinken. `walk3` steht 3 px tiefer auf der Bodenlinie von `walk1`.

Bleibt bytegleich und steht NICHT auf der Karte: `merle_joy = merle_joy1` (Hüpfer ohne zweite Zelle) und `merle_a–d` (Leerlauf still).

## Wie
1. Referenz: die Grundzelle 2,5× auf 1024 × 1536 Magenta, unten verankert (`make_ref.py`, Lage in `references/*.json`).
2. Codex-CLI `codex exec … < /dev/null`, eingebautes Bildwerkzeug im Bearbeiten-Modus, Aufträge `prompts/*.txt`. Originale `originals/`, Prüfsummen `sources.sha256.txt`.
3. `composite_merle.py`: Magenta auskeyen, gegen den UNVERÄNDERTEN Körperteil ausrichten (Maßstab 0,95–1,05, Versatz ±15 Zellpunkte, Maskenabweichung
   0,15–0,47 %), Farbe linear angleichen, NUR die Zone übernehmen (8 px weich). Außerhalb bleibt die Grundzelle Bildpunkt für Bildpunkt.
   Zellen mit Arm über den Rand werden links und rechts gleich verbreitert (Anker 0,5 / 1 — der Körper bleibt stehen).
4. `scripts/strip-key-fringe.mjs --specks --only merle_` (4968 Randpixel), `oxipng -o 4 --strip none`, `paint-art-manifest.json` neu.
`run.sh` baut die fünf Zellen aus den Originalen bytegleich nach (gemessen an wave1 und caged1 vor dem Randpixel-Schritt).

CODEX-BILDWERKZEUG · Übernahme EXEC welle-041 (Opus 5) · Stilurteil bleibt bei Koki.
