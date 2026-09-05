# ch02 Design-Dossiers v2 — Kapitel-Bilanz (L2-P1, 2026-09-03; Entwurf)

_Kapitel „Der Zoo im Buch" (U2 „At the zoo"). Gesetz: `docs/design/g1/paint/README.md` §L0; Blaupause:
`PLATFORM MASTER/SESSION-PROMPTS/LEVELWELLE/BLAUPAUSE_L2_v5_2026-09-02.md`. p1 ist gebaut (Kalibrier-Exemplar);
p2/p3/p9/arena sind L0-Gerüst mit Stub-Dossiers, bis L2-G2 sie vollendet. Neuheiten: `pending.md`._

## §Käfig-Zensus (doc 44 §2.3: ≥1 Käfig, genau EIN Klassenkind-Käfig, jede erklärte Befreiung erreichbar)

| # | Phase | Hülle (Skin) | Insasse (Koki 02.09.) | Status |
|---|---|---|---|---|
| 2 | p1 | `zookaefig` | **das Ticket** (`captive ticket`) | gebaut (41,13) ✓ |
| 3 | p2 | `zookaefig` | **der Zoo-Zug** (`train`) | L2-G2 |
| 1 | p3 | `zookaefig` | **der bunte Stein** (`stone`) | L2-G2 |
| Fenn | p2 | `loewenkaefig` (PERSON) | **FENN** | Gerüst ✓ (`p2-cage-fenn`, `p2-fenn`) |
| Neck #5 | p1 | Geometrie (Voliere-Nische) | das rote Auto | ch03 setzt das Entity (`pending.md` §4) |
| Neck #4 | p3 | Geometrie (Reifen-Lücke) | der Baum-Setzling | ch03 |

Summe ch02 = 3 Wesens-Käfige + 1 Klassenkind-Käfig (kein Arena-Käfig: die Tiere SIND die Freigaben des Löwen).

## §Abdeckung — die Vokabel-Vergabe (Maschinen-Check: `check-level-design` Block 2, sobald Karten liegen)

Dedup-Prädikat wie ch01 (kein Asset-Stem zweimal unter chaser|gunner|flyer|bouncer|crusher|guardian ∪ drained).
Vergabe p1 (Unit g1-u02, Wortbank `content/corpus/units/g1-u02/wordbank.json`):

| Vokabel (wordfile) | Erscheint als | Phase | Kunst |
|---|---|---|---|
| dog | Entfärbtes Tier `hund` (Bühnen-Stand-in) | p1 | Platzhalter |
| penguin | Entfärbtes Tier `pinguin` (Bühnen-Stand-in) · Rutscher `pinguin_rutscher` (bouncer) | p1 | Platzhalter |
| ticket | Käfig-Insasse (`captive ticket`) | p1 | Platzhalter |
| tree | Prop Bühne 1 (Gitter) | p1 | Kunst-Zeit |
| guide | Zoowärter-Schubkarre `schubkarre` (chaser) — Fiktion des Wärters | p1 | Platzhalter |
| in · on · under · behind · next to · in front of | Regelseite „Ortswörter" + Bühnen-Karten | p1 | — |
| there is · there are | Regelseite „there is / there are" | p1 | — |
| monkey · parrot · giraffe · lion · train · stone · car | p2/p3/Arena (L2-G2) | — | — |

Rest (adult, at, beautiful, big, but, child, family, free, from, Grandma, group, long, small, to bring, to want,
year, he, she, they, we, for, happy, to let somebody out, us, to talk, where, zoo, At last., How strange!, Let me
see.): Karten-Abdeckung (T1/T2) — `claims.json` führt sie als `cards` mit Ausnahme „Welle L2-T2" bis 2026-12-31.

## §Regel-Seiten-Budget (4 = die Grammatik der Unit; D-785: jede Seite VOR ihrer Aufgabe)

| # | Phase | topicDe | lehrtEn | Status |
|---|---|---|---|---|
| 1 | p1 (14,17) | Ortswörter: wo etwas ist | in · under · behind · next to | gebaut ✓ |
| 2 | p1 (44,17) | there is / there are | there is · there are | gebaut ✓ |
| 3 | p2 | to be: Kurzformen (I'm, you're, he's, we're, they're) | — | L2-G2 |
| 4 | p3 | he / she / it / they | — | L2-G2 |

`tipsTotal` = 2 (platziert), G2 zieht auf 4.

## §Anker (Kokis Entscheid 02.09.: je Raum EINE Tinten-Querung, `C` auf der `near`-Bank)

p1 Tinten-Graben c59–60, `C` (58,17) ✓ · p2 Flamingo-Teich, vor Fenn (G2) · p3 Tinten-Tal, vor dem Giraffen-Turm (G2).

## Status (2026-09-03)

p1 gebaut + Tape · p2/p3/p9/arena Gerüst · Karten: L2-T1 (Draft-PR, Rebase nach diesem Merge) · Neuheiten: `pending.md`.
