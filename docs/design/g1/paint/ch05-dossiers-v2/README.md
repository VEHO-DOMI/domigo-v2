# ch05 · Dossiers v2 — Kapitel-Bilanz

_»Das Konzert der Seiten — Die Band ohne Takt« · Unit 5. Stand **2026-09-03: p1 gebaut · Rest Gerüst** (Bahn L5-G1)._

## Räume, wie sie im Level stehen

| Raum | Name | Maß | Oberfläche | Wesen | Noten | Ausgang | Blatt |
|---|---|---|---|---|---|---|---|
| `p1` | Die Trommel-Hügel | 64×26 | `normal` | 8 | 12 | → `p2` | `p1.md` |
| `p2` | Die Notenlinien-Rutschen | 80×26 | `slippery` | 6 | 12 | → `p3` | `p2.md` |
| `p3` | Die Orgel-Empore | 56×30 | `normal` | 3 | 0 | → `boss` | `p3.md` |
| `p4` | Die große Bühne | 40×20 | `normal` | 2 | 0 | → `done` | `arena.md` |
| `p9` | Die Bassdrum | 44×20 | `normal` | 1 | 12 | → `p2` | `p9.md` |

**Noten im ganzen Kapitel: 36** · Regel-Seiten: `tipsTotal: 2` (beide in p1) · Bonus-Eintritt: 10 Noten · Bonus-Uhr: 25 s (plus zwei Sekunden Gnade aus dem Motor).

## Kanon-Zahlen (an eigenen Läufen gemessen, 2026-09-03)

| Größe | Wert |
|---|---|
| Sichtfeld | 22 Spalten |
| Höchsttempo | 2,25 px/Tick |
| Tap-Sprung | Scheitel 50 px = 3,13 Zeilen · Spannweite 4,92 Spalten |
| Halte-Sprung | Scheitel 101 px = 6,31 Zeilen · Spannweite 8,02 Spalten |
| **Feder (`s`)** | **Hub 4,94 Zeilen** — nicht durch Halten verlängerbar |
| **Ausrollen ohne Eingabe** | `#` 0,77 Spalten · **`~` 1,62 Spalten** (halbe Bremsrate) |
| Noten-Magnet | 25,6 px ab Fuß−10 |
| Erreichbarkeits-Hülle | 4 Zeilen hoch · 4 Spalten weit · 7 mit Schweben |
| Feld-Räume | 26 Zeilen (Kapitel-Standard); p3 ist TALL mit 30 |

## Was hier NICHT steht

- **Die Aufgabenkarten** — sie gehören der Bahn L5-T1/T2 (`ch05.tasks.v2.json`, `u05-lexicon.json`).
- **Die Motor-Neuheiten** — Takt-Uhr, Parade, Projektil-Klassen, Taktsprung, Boss-Duo, Layered Music.
  Sie liegen als Daten in `pending.md` und werden von L5-M1/M2 gebaut.
- **Die Kunst.** Jedes Wesen ist heute eine graue Box mit Namen; es wurde kein Blatt angelegt.

## Blätter

- `p1.md` — **das Kalibrier-Exemplar.** Volle Form, alle Anker maschinell aus dem Gitter gezogen.
- `p2.md` · `p3.md` · `arena.md` · `p9.md` — **Gerüste.** Sie tragen den Bindungs-Vertrag mit den Karten
  (Ids, Insassen, Preise) und werden von L5-G2 vollständig ersetzt.
- `pending.md` — die Daten-Entwürfe der Neuheiten.
- `claims.json` — welche Vokabel welcher Platzhalter-Skin bedient.
