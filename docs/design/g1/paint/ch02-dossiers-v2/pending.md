# ch02 · PENDING — Kapitel-Neuheiten als DATEN + Pflichten späterer Bahnen (L2-P1, 2026-09-03)

_Was hier steht, ist im Level NOCH NICHT verdrahtet: zod strippt unbekannte Felder still, und eine Rolle,
die der Motor nicht kennt, wäre ein 500 im gelieferten Kapitel. Die M-Bahnen (L2-M-a, L2-M-b) bauen die
Rollen/Felder, die G2-/A-Bahn trägt die Daten dann ins Level. Rahmen: `RAHMEN_LEVELWELLE_2026-09-02.md` §5;
Motor-Schnitt: `SESSION-PROMPTS/LEVELWELLE/M_ENTWURF_L2_2026-09-02.md`._

## 1 · Mini-Szenen-Bühne (Rolle `scene.stage`, L2-M-b) — Kokis Riff, die Signatur des Kapitels

Heute stehen an beiden Bühnen `drained`-Stand-ins (`p1-hund`, `p1-pinguin`): Name → Farbe (`restore`).
Nach L2-M-b werden sie zu Bühnen-Darstellern; die Props sind heute Gitter-Geometrie.

| Bühne | Entity (heute) | Darsteller-Skin | Prop (Gitter) | Stationen (dc,dr relativ zum Prop-Anker) | Ticks/Station | hebt | Karte |
|---|---|---|---|---|---|---|---|
| 1 | `p1-hund` (21,17) | `hund` | Baum: Stamm (24,16–17), Krone r14 c22–26 · Anker (24,17) | behind (−2,0) → on (0,−4 = Krone) → under (0,−1 unter der Krone, c23) → in front of (+2,0) | 90 | `quickfire` am Skin `hund` | Ortswort-Schnellschirm („Where is the dog?") |
| 2 | `p1-pinguin` (51,17) | `pinguin` | Bus: Block r16–17 c52–54 · Anker (53,17) | next to (−2,0) → on (0,−2) → in front of (+2,0) → behind (+2,−1 hinter dem Block, Tiefe z) | 90 | `quickfire` am Skin `pinguin` | Ortswort-Schnellschirm („Where is the penguin?") |

Gesetz (M-b): „Bühne braucht Karte" — jede `scene.stage` hat ≥1 gebundene quickfire-Karte (T2 liefert sie).
p2 (Affe × Auto) und p3 (Giraffe × Baum) trägt L2-G2 hier nach.

## 2 · Hangeln — heute optional, Pflicht erst nach L2-M-a

Das Erreichbarkeits-Modell (`level.ts` `reachFrom`, `JUMP_UP 4`) kennt `hang` nicht. Jede Mauer >4 Zeilen
wäre für die Gesetze unerreichbar. Deshalb ist die Kassenmauer (c8–10, r14–17) genau 4 hoch: Halte-Sprung
reicht, der Griff an der Kante wird gezeigt, nicht verlangt. **Pflicht-Hang-Stellen** (nach der hang-Kante im
Modell): Kassenmauer auf 5–6 Zeilen heben · p2 Hang-Traversen zwischen den Gehegen (L2-G2 plant sie als
Komfort und hebt sie nach M-a).

## 3 · Faust (`punch`) — vergeben in p1, verlangt erst in der Arena

`p1-faust` (57,14): `powerup` `grants punch` `essential true` `gabeDe "die Faust"`. Der Gabe-Text der Hülle
ist heute hart (`PaintGame.tsx` „Das Buch schenkt dir die FAUST!"); L2-M-a lässt ihn `gabeDe` lesen. Vorschlag
Gabe-Text: „Fibel legt dir die Faust in die Hand: wirf sie — sie kommt zurück." Freiwilliger Erst-Einsatz:
Käfig-Zweischlag (`cageHit`); Pflicht-Einsatz: Deflect der Stab-Platten in der Arena (doc 44 §4 ch02).

## 4 · Neck-Käfig #5 „das rote Auto" (Voliere p1) — Geometrie, kein Entity

Nische c37–39 r6–8 im `#`-Rahmen c36–40 r5–9, unerreichbar sichtbar. Kunst-Zeit: Käfig + rotes Auto als
Dekor-Blatt. **ch03 (Ring-Schwung) macht die Nische erreichbar und setzt das `cage`-Entity** (Antrag L2 R-a,
angenommen 02.09.; Querverweis in `FRAGE_L2_2026-09-02.md`). Neck-Käfig #4 (Baum-Setzling, p3) analog — L2-G2.

## 5 · Sammel-Skin `feather` (R246) — im Level (L0 N1)

`collectSkin: "feather"` steht im Level; Platzhalter-Glyph „FEA" bis Kunst-Zeit (`pb-collect_feather`).
Tierspuren sind Boden-Dekor (Kunst-Zeit), keine Sammelobjekte; `clothNounDe` „Tierspuren" bleibt L0s Vorgabe
(ch02 hat keine `cloth`-Fundstücke — falls ch02 später welche bekommt, ist das Nomen schon da).

## 6 · Pflichten für L2-G2 (Räume p2/p3/p4/p9)

- `tipsTotal` 2 → 4 (Regelseiten p2 „to be: Kurzformen", p3 „he / she / it / they"), je VOR ihrer Aufgabe (D-785).
- p2: Klecks-Tür `price 10` ⇒ ≥10 erreichbare `*` VOR der Tür (Gesetz `door-price`); `bonus.budgetSec 30`
  (steht schon im Gerüst; Grund: 12 Blasen, keine Fundstücke — 30 s + 2 s Gnade hält die Eile-Fiktion, R251).
- p9: 12 erreichbare `*`.
- Je Feldraum genau EINE Tinten-Querung an Kokis Anker-Stelle, `C` auf der `near`-Bank (`checkpoint-count`/
  `-placement` laufen auch im Entwurf): p2 Flamingo-Teich (vor Fenn) · p3 Tinten-Tal (vor dem Giraffen-Turm).
- Fenn: Käfig + `classmate`-Entity mit Roam-Zone stehen im Gerüst (`p2-cage-fenn`, `p2-fenn`) — nur versetzen.
- Löwe: Gerüst-Wächter `waechter` Tier M → Skin `loewe`; `locomotion:"prowl"`, `projectileSkin`,
  `GUARDIAN_BOARDS.loewe` sind L2-M-b — bis dahin fliegt der Platzhalter (Tafel-Choreografie).
- Wasserlinie (p2): statisches `w`-Band; Ventil-Tür (`door.trigger kind:"valve"`) + `phase.water` sind L2-M-b.
- Dossiers p2/p3/p9/arena: die Gerüst-Stubs in diesem Ordner durch volle Dossiers ersetzen.

## 7 · Beobachtet, nicht meins (Programm-Befunde, R253: niedrigste Nummer führt)

D-867 `links.action` ungelesen · D-891 Glyph `U` tot · D-892 kein Wächter-„redeemed" · D-893 Blasen ankern am Kind.
