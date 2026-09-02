# ch04-dossiers-v2 — Kapitel-Bilanz »Die graue Woche«

**Stand: p1 gebaut · p2/p3/Arena/Bonus Geruest** (L4-G1, 2026-09-03, Entwurf `draft: true`).
Blaupause: `SESSION-PROMPTS/LEVELWELLE/BLAUPAUSE_L4_v5_2026-09-02.md`. Rulings, die dieses
Kapitel binden: **R238** (Der Gesichtslose bleibt in ch04, der Kalender ist die Beweisflaeche) ·
R243 (Feld-Raeume 26 Zeilen) · R244 (Bestands-Rollen zaehlen nicht als neue Dynamik) ·
R246 (`collectSkin`) · R250 · R251 (Bonus-Eintritt und Timer setzt der Architekt) · R252.

## Raeume (am Level gemessen)

| Raum | Name | Gitter | Wesen | Farbtropfen | Ausgang |
|---|---|---|---|---|---|
| p1 | Der graue Marktplatz | 64×26 | 16 | 12 | p2 |
| p2 | Das Haus der Tage | 72×26 | 8 | 12 | p3 |
| p3 | Der Wetterturm | 56×30 | 1 | 0 | boss |
| p4 | Die Kalender-Halle | 40×20 | 2 | 0 | done |
| p9 | Der Pfützen-Spiegelmarkt | 44×20 | 0 | 12 | p2 |

Sammel-Nomen **Farbtropfen** (`collectSkin: "farbtropfen"`) · Faehigkeiten
`jump` · `run` · `punch` · `hover` · `checkpointStyle: "silent"` ·
`tipsTotal: 2` (beide Regel-Seiten liegen in p1) · Bonus-Eintritt **10 Tropfen**,
Timer **35 s** + 2 s Gnade, EIN Lauf (R235/R251).

## Kanon-Zahlen (kapitelweit, wie ch01)

Viewport 22 Spalten · Bodentempo 2,25 px/t · Tap-Apex 45–50 px / Halte-Apex 101 px ·
JUMP_UP 4 · Sprungweite unter freiem Himmel 4 Spalten (`DX_BY_SKY`) · **Schwebe-Querung 7
Spalten (`HOVER_DX`)** · Magnet 25,6 px ab Fuss−10.

## Abdeckung

Siehe `claims.json` — 24 wordfile-Vokabeln der Unit u04, alle klassifiziert: drei Gefuehle als
`being` (happy/sad/tired haben ihr Wesen im Level), sieben Wochentage als `architecture`
(die sieben Waggons), die uebrigen als `cards` mit datierter Ausnahme, bis L4-T2 ihre Karten
schreibt.

## Was noch nicht hier steht

`pending.md` fuehrt die drei Motor-Neuheiten des Kapitels (Hue-Return, Wind, der Gesichtslose)
als DATEN — sie duerfen erst nach L4-M ins Level, weil zod unbekannte Felder still verwirft.
Die Karten (`ch04.tasks.v2.json`, `ch04.policy.json`, `u04-lexicon.json`) gehoeren L4-T1/T2 und
liegen bewusst NICHT in dieser Bahn.
