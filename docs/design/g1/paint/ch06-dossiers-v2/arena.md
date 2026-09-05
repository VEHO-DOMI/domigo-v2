# ch06 · p4 — Das Notizbuch (GERÜST)

_Stand: **Gerüst**, gebaut von der Bahn L6-G1 als Kalibrier-Beifang. Der Raum ist 36×20, Oberfläche `normal`, Ausgang → `done`. Es ist das Pflicht-Minimum, das die Gesetze erfüllt — und zugleich der **Bindungs-Vertrag** mit den Karten der T-Bahn: die Ids, die Insassen und die Preise stehen ab hier fest._

## 1 · Auftrag
Die Arena des Kapitels: das verdrehte Notizbuch (Tier S, fünf Fenster) kritzelt falsche Hinweise auf seine eigene Seite. Das Skript, die Seiten-Zustände und das Board baut die Bahn L6-M; hier steht, was die Karten binden.

## 3 · Begründungs-Manifest (Gerüst-Anker — am gebauten Gitter gemessen)

| id | Was | Anker | Fiktion | Mechanik | Gesetz | Kunst |
|---|---|---|---|---|---|---|
| notizbuch | Das verdrehte Notizbuch (Wächter, Tier S) | **(18,17)** | Mos Notizbuch, seit die Seiten leer blieben füllt es sie selbst — egal womit | Rolle `guardian`, `tier:"S"` (fünf Knoten), Bühne c5–c30. Das Rig FLIEGT, ein flatterndes Buch passt nativ; das Seiten-Board und die Misch-Telegrafie baut L6-M (siehe `pending.md`) | — | fb-ent-generic |
| p4-cage-necklace | Beweis-Glas — die Halskette | **(27,17)** | die Halskette steht im Einmachglas am Rand der Bühne | Rolle `cage`, Insasse `necklace` — erreichbar auf dem Arena-Boden | cage-law · cage-captive · entity-reachable | fb-ent-generic + `captive_necklace` |

## 10 · Bau-Vertrag

- Spawn `S` **(3,17)** · `X` **(33,17)** · Ausgang → `done`.
- Keine Funken, keine Fundstücke: die Arena gehört dem Wächter (das Gesetz `cloth-honesty` verbietet Fundstücke hier ausdrücklich).
- **Dieser Raum wird von L6-G2 vollständig ersetzt.** Was hier steht, ist der Bindungs-Vertrag mit den Karten der T-Bahn, nicht der fertige Raum.

## 11 · Fix-Protokoll

- 2026-09-03 · L6-G1: Gerüst angelegt. Alle Anker maschinell aus dem Gitter gezogen.
