# THE PAINTED BOOK — design sheets ch01–05 (the W2 gate pack)

**These five sheets are the design foundation for the first five chapters. Koki's
~40-minute gate freezes them before ANY chapter build (doc 31 §8, M3+).** The Keen-era
sheets one folder up are idea-mines only (§1.6); everything creative here is fresh.

## How to read (the ~40 minutes)

1. **ch01.md — read DEEP (~15 min).** The school world; it is the template every
   later chapter follows. Its §5 phase chain and §6 guardian carry the most detail.
2. **ch02–05 — read as sheets (~5 min each).** Your unit riffs are quoted verbatim
   at the top of each and honored in §5: the zoo mini-scene stage (ch02), the rising
   bilge + describe-the-pirate (ch03), the grey world restoring feelings hue by hue
   (ch04), the music world with the parade and the beat-jump favor (ch05).
3. **This page's decision list (~5 min).**

## The decisions this gate freezes (say no to any and only that piece reworks)

- **The cast assignments (fresh, from the approved pools):** FIBEL = the guide who
  grants verbs · ~~KRAKEL = the sketch-checkpoint artist (the audit's
  "checkpoint-as-character" made ours)~~ **KRAKEL is no longer cast — see the amendment
  below** · KLECKS = the bonus-door host (our magician
  analog). Person-cages ch01–05: **Merle · Fenn · Ilvy · Piet · Veit** (Veit in ch05
  because your can/can't beat needs a "he").

  > **★ Amendment 2026-08-15 (rulings R44 · R83; law now in doc 44 §1.11).** Checkpoints
  > are **silent anchors**: the chapter declares `checkpointStyle: "silent"` and nothing is
  > announced — no Krakel appearing, no easel, no sketch, no toast. The `C` glyph, the warp
  > target and the four placement laws are untouched, and the painted sheets `krakel_a` /
  > `krakel_active` still draw the glyph itself (they are its artwork, not dead art). Every
  > chapter sheet below that still lists „Krakels Staffelei" in its cast row is describing a
  > chapter nobody has built; each row now says so. Re-placing the anchors is explicitly
  > NOT decided — that is a conversation with Koki.
- **The five guardians (all redeemed, never beaten-and-left):** the awakened
  blackboard (ch01) · the zoo turnstile (ch02) · the ship's figurehead (ch03) · the
  torn calendar (ch04) · the runaway drum kit (ch05, whose consolation gifts FAVOR
  POWER I = "der Taktsprung", the beat-jump).
- **The bonus-door economy (every chapter):** Klecks paints a door; entry costs 10
  of the chapter's currency (visibly drained); inside ~12 collectibles on a 25–40 s
  timer (+2 s grace); timeout returns you gently WITH your payment back; REPEATABLE;
  perfect run = map sticker + the reward counting itself back in. (The studied
  economy, made kid-fair.)
- **Two engine flags for the build wave:** ch04's hue-return system (the world
  regains one color per restored feeling) and ch05's layered music (each restored
  instrument adds its track).

## Standing law woven throughout

The ten commandments + twenty anti-laws (cookbook §8–9) govern every §5 layout; the
banked source mechanics (audit §3, G1–G14) are cited by id where used; every enemy
row carries its animation material (the anti-stale law); palette cards for ch02–05
are PROVISIONAL until the real SB pages are scanned in each unit-audit wave (CP-14
blocks commissions, not this gate); task sets are authored fresh at build behind the
grounding + blind-solve gates (u02–05 lexicons are wave items).

**Merge-Zug (K4, 2026-08-17 — R104/P-71):** der Eigentümer der Tot-Kunst-Decke misst sie
**nach** dem letzten Merge einer Welle, nie parallel dazu; jede Bahn ändert im eigenen PR nur
ihr eigenes Delta. Und Rebase-Pflichten stehen in der Merge-Tabelle des BOOT-SHEETs, wo Koki
sie liest — eine Pflicht, die nur im Text eines PRs steht, gibt es nicht.

Checker: `node scripts/check-design-sheets.mjs` covers these sheets (corpus-id truth,
v4 skeleton, register law).

---

# L0 · WIE EIN KAPITEL IM REPO AUSSIEHT (Level-Welle, 2026-09-02)

Alles oben ist DESIGN. Dieser Abschnitt ist die BAU-Seite: was auf der Platte
liegen muss, damit ein Kapitel lädt, und in welcher Reihenfolge eine Kapitel-Bahn
das anlegt. Er entstand mit der Bahn, die dem Buch beigebracht hat, mehr als ein
Kapitel zu laden.

## §L0.1 · Das Phasen-Gesetz: p1–p3 Feld · p4 Arena · p9 Bonus

Ein Kapitel hat **genau drei Feldräume**, dazu eine Arena und einen Bonusraum.
Die Ids sind Konvention, nicht Zufall, und sie sind die einzige Stelle, an der
das Buch überhaupt Ids vorschreibt:

| Id | Was | Wo im Level | Maß |
|---|---|---|---|
| `p1` `p2` `p3` | die drei Feldräume, in Spielreihenfolge | `phases[]` | **26 Zeilen** hoch (R243); Breite nach Blatt |
| `p4` | die Arena des Wächters | `arena` | ein Schirm, ch01: 36×20 |
| `p9` | die Kleckskammer (Bonusraum) | `bonus` | ch01: 44×20 |

**26 Zeilen ist die Höhe eines Feldraums (R243)**, und sie ist keine Vorliebe:
die Kamera und die Sprung-Hüllkurve sind darauf geeicht. Die TALL-Ausnahme
56×30 bleibt, wo ein Kapitel sie ausdrücklich braucht. Arena und Kleckskammer
sind kleiner — sie sind je ein Schirm, kein Weg.

Die Lücke zwischen 4 und 9 ist Absicht: p5–p8 sind frei für Räume, die ein
späteres Kapitel braucht, und der Bonusraum bleibt trotzdem überall die 9.

**Was der MOTOR wirklich prüft, ist die STELLE, nicht der Name.** Der Regex für
eine Phasen-Id ist `/^p\d$/` — mehr nicht. Wer die Uhr des Bonusraums sucht,
fragt `phase === level.bonus` (`sim.ts`), nie den Text »p9«; wer die Arena
sucht, fragt `level.arena`. Genau diese Trennung war der Fehler, den L0 an einer
Zeile geschlossen hat: ein Kapitel, dessen Kammer anders hiesse, hätte einen
Bonusraum ohne Uhr bekommen — ohne Absturz und ohne rotes Tor.

Die Tabelle oben ist also eine **Konvention für Menschen**: sie hält die fünf
Kapitel lesbar. Sie ist kein Schloss, und niemand soll sie zu einem machen.

## §L0.2 · Die Datei-Karte eines Kapitels

`NN` ist die Kapitelnummer, `uNN` die Unit, die es lehrt (aus `story.json`).

| Datei | Was darin steht | Wer sie anlegt |
|---|---|---|
| `content/corpus/stories/<story>/paint/chNN.level.json` | die fünf Räume: Gitter, Wesen, Käfige, Türen, Trail-Wörter (`words`), Auftakt-Platten | G-Bahn |
| `content/corpus/stories/<story>/paint/chNN.tasks.v2.json` | die ≈70 Karten; nennt ihre `unit` | T-Bahn |
| `content/corpus/stories/<story>/paint/chNN.policy.json` | die Kapitel-Tabellen: `fieldKinds` · `fieldForms` · `lexiconClasses` · `families` · `vocabLedger` · `arenaPromiseClass` | T-Bahn |
| `content/corpus/stories/<story>/paint/chNN.proof.json` | die Beweis-Bänder je Phase | G-Bahn (`record-paint-tape --chapter chNN`) |
| `docs/design/g1/paint/chNN-dossiers-v2/{p1,p2,p3,p9,arena}.md` | §3-Manifest (jede Entity mit Anker + Zweck), §10 Bau-Vertrag | G-Bahn |
| `docs/design/g1/paint/chNN-dossiers-v2/claims.json` | Vokabel → Klasse (die Abdeckungs-Ansprüche) | T-Bahn |
| `docs/design/g1/grounding/uNN-lexicon.json` | der Wortschatz, gegen den geerdet wird | T-Bahn, **ZUERST** |
| `scripts/paint-pilots/chNN.pilots.mjs` | die handgeführten Makros für die Bänder | G-Bahn |
| `docs/design/g1/paint/chNN.md` | das Design-Blatt (acht `## §N`-Marker) | A-Bahn zieht es nach |

**Nichts davon steht mehr im Code.** Bis zur Level-Welle lagen die Kapitel-
Tabellen in `check-game-tasks.mjs`, `cards/variety.ts` und
`scripts/game-tasks-variety-policy.json` — drei Dateien, in die fünf Bahnen
gleichzeitig hätten schreiben müssen. Sie liegen jetzt neben dem Inhalt, den sie
beschreiben, und `scripts/paint-chapters.mjs` ist die EINE Auflösung, die alle
Tore fragen.

## §L0.3 · Was ein Entwurf darf

`"draft": true` heisst: dieses Kapitel wird gerade gebaut.

- **`draft:true` klammert GENAU FÜNF Gesetze aus** — nachgezählt im `!draft`-Block
  von `level.ts`, nicht aus dem Rahmen-Text übernommen (der sagte es zu weit):
  `phase-count` · `checkpoint-silent` · `cage-law` · `classmate-cage` ·
  `classmate-pair`. **Die anderen 23 Gesetze laufen auch im Entwurf**, und
  `content-levels.test.ts` fährt sie über jedes Level auf der Platte — also auch
  über deins, ab dem Tag, an dem du die Datei anlegst. Das ist Absicht: die
  ausgeklammerten fünf sind Aussagen über die VOLLSTÄNDIGKEIT eines Kapitels,
  alle anderen über die Spielbarkeit eines Raums, und die gilt sofort.
- **Kunst darf fehlen** (`check-paint-art` überspringt Entwürfe), und **Bänder
  auch** (`proof-tapes.test.ts` ebenso).
- Die Route zeigt einen Entwurf in **jeder** Umgebung nur hinter der Lehrer-Tür.
- Was ein Tor mangels Eingaben auslässt, druckt es **namentlich** als
  »übersprungen (draft)«. Eine stille Auslassung ist von einem defekten Tor
  nicht zu unterscheiden.

**Vor jedem PR** fährt eine Bahn ihre Form-Gesetze einmal mit temporär
entfernter `draft`-Flagge (im Arbeitsbaum, nicht committet) und nennt das
Ergebnis im PR — der Abschluss-PR eines Kapitels darf kein Überraschungs-Tor sein.

## §L0.4 · Boot-Checkliste einer Kapitel-Bahn

1. **`docs/design/g1/grounding/uNN-lexicon.json` zuerst.** Ohne Lexikon ist die
   Karten-Datei ROT — und das mit Absicht: ohne Lexikon prüft die Erdung nichts
   und bliebe trotzdem grün.
2. `chNN.level.json` mit `"draft": true`, den fünf Räumen und der Unit-Nummer,
   die zu `story.json` passt (`tasks.unit` wird dagegen gelesen; Abweichung = rot).
3. Räume gegen die echten Gesetze fahren, bevor irgendetwas anderes entsteht:
   `node --experimental-strip-types scripts/check-level-candidate.mjs <raum.json> --chapter chNN`
4. Dossiers anlegen — jede Entity mit Anker `(c,r)`, Fiktion UND Mechanik.
   `check-level-design` liest beide Richtungen.
5. `chNN.policy.json` + `chNN-dossiers-v2/claims.json`, dann die Karten.
6. Piloten nach `scripts/paint-pilots/chNN.pilots.mjs`, dann
   `node --experimental-strip-types scripts/record-paint-tape.mjs --chapter chNN`.
7. Der Abschluss-PR nimmt `draft` weg, trägt fehlende Blätter mit Grund und
   Ablaufdatum in `scripts/paint-art-allowlist.json` und nimmt die vollen Bänder auf.

## §L0.5 · Drei Sätze, die man sonst zweimal misst

- **`bonuspay` ist eine SHELL-ZEREMONIE, kein Kartentyp.** Die Klecks-Tür stellt
  `use: "bonuspay"` (`sim.ts:82` führt eine eigene use-Union), und
  `PaintGame.tsx:1152` fängt es ab und zeichnet die Bezahl-Karte selbst —
  `item: null`, Preis aus `door.params.price`. Im Karten-SCHEMA gibt es
  `bonuspay` nicht, und das ist **kein Schema-Loch**: es gibt nichts zu
  autorisieren. Wer eine `bonuspay`-Karte schreiben will, schreibt keine.
- **Der Sammel-Skin bestimmt, was auf den `*`-Zellen liegt** (`collectSkin`,
  Vorgabe `letters`). Die Zelle bleibt `*` — alle Abstands- und
  Erreichbarkeits-Gesetze rechnen unverändert —, und das Gesetz `trail-words`
  gilt nur, wenn wirklich Buchstaben gesammelt werden.
- **Die Fundstück-Wörter sind vier Felder, nicht eines** (`clothNounDe`,
  `clothNounDatDe`, `clothNounSgDe`, `clothPlaceDe`): die Sätze brauchen
  Nominativ, Dativ Plural und Singular. Wer nur den Nominativ deklariert,
  bekommt „von 9 Schnipsel".

**Zwei Fallen, beide bezahlt:** ein neues Level-Feld braucht das Interface UND
das zod in `apps/web/lib/paint-content.ts` — zod strippt still, was es nicht
kennt, und das Feld verschwindet zwischen Platte und Browser. Und `tipsTotal: 0`
besteht jedes Gesetz, fällt aber die Seite (der Lader verlangt eine positive
Zahl): ein Kapitel ohne entschiedene Regel-Seiten lässt das Feld weg (D-790).
