# ch06 · Dossiers v2 — Kapitel-Bilanz

_»Die falschen Hinweise — Die Markt-Gassen« · Unit 6. Stand **2026-09-03: p1 gebaut · Rest Gerüst** (Bahn L6-G1, Ruling R240 · Blaupause L6 v5)._

## Räume, wie sie im Level stehen

| Raum | Name | Maß | Oberfläche | Wesen | Funken | Schnipsel | Ausgang | Blatt |
|---|---|---|---|---|---|---|---|---|
| `p1` | Die Markt-Gassen | 64×26 | `normal` | 10 | 12 | 3 | → `p2` | `p1.md` |
| `p2` | Park und Fluss | 72×26 | `normal` | 10 | 12 | 3 | → `p3` | `p2.md` |
| `p3` | Die Wipfel über der Stadt | 56×30 | `normal` | 6 | 8 | 3 | → `boss` | `p3.md` |
| `p4` | Das Notizbuch | 36×20 | `normal` | 2 | 0 | 0 | → `done` | `arena.md` |
| `p9` | Die Spiegelkammer | 44×20 | `normal` | 0 | 12 | 0 | → `p2` | `p9.md` |

**Lupen-Funken im ganzen Kapitel: 44** · Regel-Seiten: `tipsTotal: 2` (beide in p1) · Bonus-Eintritt: 10 Lupen-Funken · Bonus-Uhr: 30 s (plus zwei Sekunden Gnade aus dem Motor) · Sammel-Skin: `lupenfunke` · Fundstück-Nomen: `Hinweis-Schnipsel`.

**Die drei wahren Sätze** (der Vertrag zwischen G-, T- und M-Bahn):

| Raum | Wahrer Satz | Die drei Schnipsel |
|---|---|---|
| p1 | Mo runs down the street. | `runs` · `down` · `street` |
| p2 | Mo looks for his hat in the park. | `looks for` · `hat` · `park` |
| p3 | A bird sits in the tree. | `bird` · `sits` · `tree` |

## Kanon-Zahlen (an eigenen Läufen gemessen, 2026-09-03)

| Größe | Wert |
|---|---|
| Sichtfeld | 22 Spalten |
| Höchsttempo | 2,25 px/Tick |
| Tap-Sprung (1 Tick) | Scheitel 50 px = 3,13 Zeilen · Weite 4,26 Spalten (aus dem Stand) |
| Halte-Sprung (26 Ticks) | Scheitel 101 px = 6,31 Zeilen · Weite 7,01 Spalten (aus dem Stand) |
| **Sprungfeder `s`** | Hub 5,94 Zeilen aus dem Stand (Füße r18 → r12,06) — nicht durch Halten verlängerbar |
| Ausrollen ohne Eingabe | `#` 0,77 Spalten / 12 Ticks · `~` 1,62 Spalten / 24 Ticks |
| Funken-Magnet | 25,6 px ab Fuß−10 (zwei Zeilen über dem Bodenglyph zählen, drei nicht mehr) |
| Erreichbarkeits-Hülle | 4 Zeilen hoch · bis 4 Spalten weit · 7 mit Schweben |
| Feld-Räume | 26 Zeilen (Kapitel-Standard R243); p3 ist TALL mit 30 |

## Was hier NICHT steht

- **Die Aufgabenkarten** — sie gehören der Bahn L6-T1/T2 (`ch06.tasks.v2.json`, `u06-lexicon.json`, `ch06.policy.json`).
- **Die Motor-Neuheiten** — Taktsprung, Notizbuch-Board, Seiten-Misch-Telegrafie, Bilanz-Präsentator, Projektil-Skin.
  Sie liegen als Daten in `pending.md` und werden von L6-M gebaut.
- **Die Kunst.** Jedes Wesen ist heute eine graue Box mit Namen; es wurde kein Blatt angelegt.

## Blätter

- `p1.md` — **das Kalibrier-Exemplar.** Volle Form, alle Anker maschinell aus dem Gitter gezogen.
- `p2.md` · `p3.md` · `arena.md` · `p9.md` — **Gerüste.** Sie tragen den Bindungs-Vertrag mit den Karten
  (Ids, Insassen, Preise) und werden von L6-G2 vollständig ersetzt.
- `pending.md` — die Daten-Entwürfe der Neuheiten.
- `claims.json` — welche Vokabel der Unit welcher Platzhalter bedient, samt befristeter Ausnahmen für die Karten-Bahn.
