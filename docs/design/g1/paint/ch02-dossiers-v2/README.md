# ch02 Design-Dossiers v2 — Kapitel-Bilanz (L2-P1 2026-09-03 · L2-P1v2 2026-09-05; Entwurf)

_Kapitel „Der Zoo im Buch" (U2 „At the zoo"). Gesetz: `docs/design/g1/paint/README.md` §L0; Blaupause:
`PLATFORM MASTER/SESSION-PROMPTS/LEVELWELLE/BLAUPAUSE_L2_v5_2026-09-02.md`. p1 ist als **v2 MIT Signatur** gebaut (Kalibrier-Exemplar, R255: zwei Bühnen, drei Griffe, Poster);
p2/p3/p9/arena sind L0-Gerüst mit Stub-Dossiers, bis L2-G2 sie vollendet. Neuheiten: `pending.md`._

## §Käfig-Zensus (doc 44 §2.3: ≥1 Käfig, genau EIN Klassenkind-Käfig, jede erklärte Befreiung erreichbar)

| # | Phase | Hülle (Skin) | Insasse (Koki 02.09.) | Status |
|---|---|---|---|---|
| 2 | p1 | `zookaefig` | **das Ticket** (`captive ticket`) | gebaut (11,10), auf dem Dach des Kassenhäuschens ✓ |
| 3 | p2 | `zookaefig` | **der Zoo-Zug** (`train`) | L2-G2 |
| 1 | p3 | `zookaefig` | **der bunte Stein** (`stone`) | L2-G2 |
| Fenn | p2 | `loewenkaefig` (PERSON) | **FENN** | Gerüst ✓ (`p2-cage-fenn`, `p2-fenn`) |
| Neck #5 | p1 | Geometrie (Voliere-Nische c29–32 r6–8) | **OFFEN** — das rote Auto ist seit p1 v2 der Bühnen-Prop (SB 19); Vorschlag: die Katze (SB 19/WB 20) | ch03 setzt das Entity (`pending.md` §4) |
| Neck #4 | p3 | Geometrie (Reifen-Lücke) | der Baum-Setzling | ch03 |

Summe ch02 = 3 Wesens-Käfige + 1 Klassenkind-Käfig (kein Arena-Käfig: die Tiere SIND die Freigaben des Löwen).

## §Abdeckung — die Vokabel-Vergabe (Maschinen-Check: `check-level-design` Block 2, sobald Karten liegen)

Dedup-Prädikat wie ch01 (kein Asset-Stem zweimal unter chaser|gunner|flyer|bouncer|crusher|guardian ∪ drained).
Vergabe p1 (Unit g1-u02, Wortbank `content/corpus/units/g1-u02/wordbank.json`):

| Vokabel (wordfile) | Erscheint als | Phase | Kunst |
|---|---|---|---|
| dog | **Buddy = Darsteller der Bühne `buddy` (Buddy × Baum)** · der graue Hund `hund` (restore) seit p1 v2 in p2 | p1 · p2 | Platzhalter |
| parrot | **Darsteller der Bühne `papagei` (Papagei × Auto, SB 19)** | p1 | Platzhalter |
| car | Prop der Papagei-Bühne (Bild `auto`) | p1 | Kunst-Zeit |
| penguin | Entfärbtes Tier `pinguin` (restore) · Rutscher `pinguin_rutscher` (bouncer) | p1 | Platzhalter |
| ticket | Käfig-Insasse (`captive ticket`) | p1 | Platzhalter |
| tree | Prop der Buddy-Bühne (Bild `baum`, keine Geometrie) | p1 | Kunst-Zeit |
| guide | Zoowärter-Schubkarre `schubkarre` (chaser) — Fiktion des Wärters | p1 | Platzhalter |
| in · on · under · behind · next to · in front of | die zwei Bühnen (gesehen, dann gefragt: `qf.papagei.b1`, `qf.buddy.b1`) · Regelseite „Ortswörter" jetzt in p2 · Fenn r1–r6 | p1 · p2 | — |
| there is · there are | das Park-Poster am Tor (`tip` `p1-poster`, SB 17) + Schubkarre k1/k2 | p1 | — |
| monkey · giraffe · lion · train · stone | p2/p3/Arena (L2-G2) | — | — |

Rest (adult, at, beautiful, big, but, child, family, free, from, Grandma, group, long, small, to bring, to want,
year, he, she, they, we, for, happy, to let somebody out, us, to talk, where, zoo, At last., How strange!, Let me
see.): Karten-Abdeckung (T1/T2) — `claims.json` führt sie als `cards` mit Ausnahme „Welle L2-T2" bis 2026-12-31.

## §Regel-Seiten-Budget (4 = die Grammatik der Unit; D-785: jede Seite VOR ihrer Aufgabe)

| # | Phase | topicDe | lehrtEn | Status |
|---|---|---|---|---|
| 1 | **p2 (10,21)** — aus p1 v2 gezogen: in p1 lehrt die Bühne die Ortswörter (Signatur §3); G2 stellt sie VOR die Bus-Bühne | Ortswörter: wo etwas ist | in · under · behind · next to | gebaut ✓ (versetzt) |
| 2 | p1 (5,17) | Das Park-Plakat: there is / there are (SB 17 als Welt-Objekt) | there is · there are | gebaut ✓ (v2) |
| 3 | p2 | to be: Kurzformen (I'm, you're, he's, we're, they're) | — | L2-G2 |
| 4 | p3 | he / she / it / they | — | L2-G2 |

`tipsTotal` = 2 (platziert), G2 zieht auf 4.

## §Anker (Kokis Entscheid 02.09.: je Raum EINE Tinten-Querung, `C` auf der `near`-Bank)

p1 Tinten-Graben c59–60, `C` (58,17) ✓ · p2 Flamingo-Teich, vor Fenn (G2) · p3 Tinten-Tal, vor dem Giraffen-Turm (G2).

## Status (2026-09-05, L2-P1v2)

p1 **v2** gebaut + Tape (21/21 Federn, zwei Bühnen fragen, drei Griffe) · p2/p3/p9/arena Gerüst (+ zwei Zuzüge in p2) ·
Karten: T1 gemergt (#398) + zwei Bühnen-Karten (Walk-Minimum) · Welle: L2-G2 (Räume) → L2-T2 ∥ L2-S · Motor-Rest: L2-M-b · Neuheiten/Pflichten: `pending.md`.
