# ch06 · pending — Daten-Entwürfe, die HEUTE nicht im Level stehen

_Geschrieben von der Bahn **L6-G1**, 2026-09-03. Alles hier ist **Entwurf**, nicht Auslieferung: entweder fehlt der
Motor (dann baut ihn L6-M), oder der Raum (dann schneidet ihn L6-G2). Was das Level-Schema nicht kennt, entfernt es
still — deshalb steht es hier und nicht dort._

## 1 · Was seit dem L0-Merge SCHON im Level steht (nicht mehr pending)

Das Boot-Blatt dieser Bahn wurde geschrieben, als L0 noch nicht gemergt war, und wies vier Felder hierher.
**Gemessen am 2026-09-03: L0 ist gemergt (#391), das Schema kennt sie, und sie stehen im Level** — wer sie hier
noch einmal einträgt, trägt sie doppelt:

| Feld | Wert im Level | Herkunft |
|---|---|---|
| `collectSkin` | `lupenfunke` | L0 · N1 (R246) |
| `clothNounDe` | `Hinweis-Schnipsel` | L0 · N2 (R246, D-921) |
| `clothPlaceDe` | `Stadt` | L0 · N2 |
| `bonus.budgetSec` | `30` | L0 · N7 (R251: Zahl und Uhr setzt der Level-Architekt) |

## 2 · Favor-Linien (Taktsprung) — Ability `beatjump`, aus L5-M2, nicht meins

Der Taktsprung existiert im Motor NICHT (`Ability` kennt ihn nicht, die Reichweiten-Hülle ist blind dafür — D-923).
L5-M2 baut die Gabe, L6-M die Hülle und trägt diese Zellen dann ins Level:

```json
"favorLines": [
  { "phase": "p1", "c0": 18, "c1": 25, "r": 5, "nameDe": "die Laternen-Linie" },
  { "phase": "p3", "nameDe": "die Kronen-Linien", "zellen": "TBD — baut L6-G2" }
]
```

Die p1-Zellen sind am gebauten Gitter gemessen: die Platte liegt in Zeile 6, die Steh-Zeile ist r5, die höchste
heute erreichbare Steh-Zeile ist r10. Fünf Zeilen Abstand, eine mehr als die Sprung-Hülle trägt — der Tamper in
`p1.md` §11 ist der Beweis. Die p3-Zeile ist ein Platzhalter: das p3-Gerüst baut keine Kronen-Linie.

## 3 · Das verdrehte Notizbuch (Arena) — L6-M

- **Rig-Zustände (Platzhalter):** `kritzel` · `mischen` · `klemmt` · `seufzt` · `joy`.
- **Board:** `GUARDIAN_BOARDS` kennt heute nur `tafel` (D-810/D-930) — L6-M trägt `notizbuch` ein, sonst öffnet
  die Karte ohne Beweis. Die offene Seite IST das Board.
- **Muster (Hütchenspiel):** es kritzelt einen falschen Hinweis groß auf die Seite (Beweis, gerendert VOR der Karte),
  dann mischt es drei Seiten (Telegraf = das Mischen, als Skript-Daten).
- **Projektil-Skin:** `kritzelblob` (Feld aus L2-M) — Deflect = zurückfausten, der Blob klatscht in die
  Spiralbindung, das Buch klemmt (Stagger = Konter-Fenster).
- **Bilanz-Präsentator:** `bilanzPresenterSkin: "notizbuch"` (Level-Feld, L6-M).
- **Finale:** `typed` mit dem exakten String **WELL DONE** auf die gelöste Fall-Seite.

**Die fünf Fenster (Blaupause L6 §5 — die Karten schreibt L6-T2):**

| # | Art | Inhalt | Beweis auf dem Board |
|---|---|---|---|
| W1 | `choice` | Hütchenspiel: welche Seite trägt den wahren Hinweis? | ohne `evidence` (legal per R250) |
| W2 | `mistake` | Hinweis 1 | »Mo runs down the river.« → `street` |
| W3 | `choice` | a lot of: »There are ___ hats on the page.« | ohne `evidence` |
| W4 | `order` | Hinweis 2 | Chips »Mo / looks for / his hat / in the park« |
| W5 | `mistake` | Hinweis 3 | »A dog sits in the tree.« → `bird` |

## 4 · Die Sprungstellen-Tasche im Fluss (p2) — DATEN, kein Motor (D-922)

`w` warpt nur zum Anker, es tötet nicht. Eine trockene Tasche IM Fluss ist damit legal, wenn sie einen Ausstieg
hat: ein `.`-Becken zwischen zwei Tinten-Feldern, unten ein Hinweis-Schnipsel, an der Ostwand eine Ausstiegs-Leiste
aus zwei Stufen. Das Gesetz `trap-pocket` verlangt entweder einen echten Ausstieg oder einen deklarierten Eintrag
in `inkReturns`; die Tasche bekommt den echten Ausstieg. **L6-G2 schneidet sie**, wenn p2 gebaut wird — das
Gerüst trägt heute keine Tinte und damit auch keinen Anker.

## 5 · Spiegelkammer (p9) — L6-G2

Layout links↔rechts gespiegelt (**reine Daten**, die Steuerung bleibt normal — Architekten-Entscheid der Blaupause
§2.5), neun Schnipsel-Zwillinge mit `repeatOf` auf die Feld-Stücke, zwölf Funken (stehen bereits), Uhr 30 s,
EIN Lauf (R235).
