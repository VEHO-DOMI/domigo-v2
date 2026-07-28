# 41 · THE R3 DESIGN PASS — five laws + the distribution map

**Design canon PENDING KOKI'S GATE (Fable 5, 2026-07-28).** Resolves R3-11, R3-12,
R3-13 (+M-E), R3-15 (per Koki's same-day ruling: ch01 core), R3-16 (+M-B chapter-end
sequence, R3-17) and points at doc 36 v1.2 for R3-19. Charter: doc 39. Every law here
names its machine check (§7) — a law without a check is a wish. Koki's three gate
questions are §8; everything else is decided and he overrules at the gate.

---

## §1 · THE TASK-TYPE DISTRIBUTION MAP (R3-13, extends G12)

The principle Koki set: ch01 is the tutorial — don't give everything away at once.
Each chapter gets a small FIELD palette (the cards beings ask in the world), +1–2
kinds debut per chapter, and complex kinds premiere in an ARENA before they reach the
field. The BOSS ritual is exempt: its scripted set (mistake/order/memory/typed at the
Tafel) is intentional G-era design and stays — R3-12's grounding law fixes what was
wrong with it (unanswerable, not too complex).

| ch | identity (unit grammar) | FIELD palette | debuts | notes |
|---|---|---|---|---|
| **ch01** Die Schule | to-be, greetings, names, numbers | **choice · wheel · restore · oddone (light)** | **restore** (the color two-step — THE core mechanic, §2) | spell/order/memory/mistake LEAVE the field (boss keeps its ritual); typed = finale-only |
| **ch02** Der Zoo | there-is/are, prepositions, pronouns | choice · restore · match · spell (light) | **match** (G12) · restore REUSED as the animal-ID two-step (what animal → where) | mistake premieres in the ARENA (wrong-sign fixes, sheet §6) |
| **ch03** Das Piratenschiff | have-got, irregular plurals | choice · order · match · spell | **sort** (G12: sort the loot/crew by have-got/plural) · **order** enters the field (pirate sequences) | |
| **ch04** Die graue Woche | to-be negative + questions | choice · slider · memory · sort | **slider** (G12: feelings intensity) · **memory** enters the field (the grey week remembers) | |
| **ch05** Das Konzert | can, possessives | choice · mistake · order · memory | **mistake** enters the field (fix the song sheet) | |
| **ch06** Die Stadt (F-e sheet) | u06: town, vertical motion | full palette minus typed | wheel RETURNS load-bearing (house numbers, wayfinding) | typed stays ≤ boss/finale everywhere (2 %-law) |

**Standing rules that ride the map:**
- **M-E · door-series coverage** (G-era law, per-chapter): the door/gate series covers
  ALL the unit's imperatives, questions and negations, contextualized in-world.
- **Non-repetition (charter: two pencils = two distinct cards minimum):** for any
  skin that can be on screen ≥2× in a phase, its bound pool carries ≥ that many
  distinct cards. (Today's check demands ≥2 per hostile skin — the check learns the
  simultaneous-spawn count.)
- Every vocabulary item keeps its own level-anchored representation (the F2-1
  standing ask — unchanged).
- A-3 stands: cards are AUTHORED with LLM intelligence against the live scene;
  algorithms assemble/validate/route only.

## §2 · THE COLOR MECHANIC — ch01's core (R3-15 per Koki's ruling, 2026-07-28)

**Fiction:** OSWIN rained the color out of the beings he bewitched. A grey being has
lost its name AND its color; the child gives BOTH back.

- **The `restore` kind (new, two-phase — the `mistake` machine's two-phase pattern
  generalized):** phase 1 NAME it (tap the right name among 4) → phase 2 GIVE the
  color back (tap the right color word — the unit's color vocabulary). Solve = the
  being floods back to full color (the joy beat, doc 40's `joy` cells).
- **The desaturation grammar (engine, no new art):** redeemable beings render
  DESATURATED (grey-washed tint) until redeemed. Redeem = color floods in + joy loop
  + presence stays (R3-5's law doing double duty). The Farbkasten card of 11.42.31 is
  re-authored as the first `restore` exemplar.
- **ch01 re-curation scope (PK-R3):** field cards move to choice/wheel/restore/
  oddone per §1; the freed slots become restore two-steps (one per redeemable being
  class); boss ritual + finale untouched; every changed card re-passes the two-layer
  gate (machine autoSolve + blind-solve unanimity — the PB-T9 bar).
- ch02 REUSES the same machine for the riff's animal-ID two-step — one kind, two
  chapters, zero extra engine.

## §3 · THE SPEAKER LAW (R3-11)

**A task spawns only from an asker the child can SEE.** Valid askers: a bound entity
(skin on screen), a cage (its captive asks), a door (its face asks), the guardian,
the console (the visible Namens-Konsole). **Environmental hazards never ask** — spike
contact is knockback + the no-death language (R3-18), never a floating „Jemand fragt
dich…".

- Sim: hazard-contact TaskRequests are REMOVED; the finale console's ctx is re-typed
  from `hazard:"console"` to a first-class `console` ctx (it was always a visible
  asker mis-filed).
- Serve-time guard: a card is served only while its asker is on screen
  (`screenFracOf(id) ≠ null`); if the asker left the viewport, the request waits.
- Authoring guard: no card may sit in a pool reachable only via hazard ctx; every
  `use` maps to a seeable asker class.

## §4 · THE BOSS-EVIDENCE LAW (R3-12)

**A boss card's evidence is rendered ON the guardian before the card opens.** The
Tafel WRITES the sentence it lies about; the four words it scribbles are ON the
board; the correction target is readable in the world (files 11.48.59 / 11.50.26
were unanswerable by looking).

- Schema: boss-use cards of evidence kinds (mistake/oddone/order/memory) carry an
  `evidence` field — the exact strings the guardian must display.
- Engine: the guardian's board region renders the evidence (chalk-glyph text on the
  Tafel; each guardian skin declares its writing surface), and the card OPENS only
  after the evidence render beat completes (readability telegraph, 30–45 t).
- The card's prompt may reference ONLY what the evidence field renders — the card
  asks about the world, never about itself.

## §5 · REGEL-SEITEN, THE SCORE, AND THE CHAPTER-END SEQUENCE (R3-16 + M-B + R3-17)

**Fiction:** OSWIN didn't just bewitch the chapter — he TORE THE UNIT'S RULE PAGES
out of the book and scattered them. (Naming law kept: book-beings = book-words —
**die Regel-Seiten**, gate question 1 offers alternatives.)

- **The collectible:** N hidden Regel-Seiten per chapter, N = the unit's grammar
  topics (ch01: 3 — to-be, greetings, numbers). Pickup = a painted mini-card shows
  the rule as a kid-worded Merksatz (LLM-authored, register-checked). Collect all N
  = the chapter's Merkseite completes + reward. Static-state entity role `tip`
  (doc 40's static exemption — no rig).
- **Bonus-Bücher:** small score pickups (the no-death adaptation of extra lives) —
  they feed the running score, tucked in exploration spots.
- **The HUD (R3-17):** painted chips, engine-drawn: `🔓 x/6 · 📜 y/N · ✨ z/M` — the
  gamified replacement of today's text bar (PK-R3, mined presentation per doc 42).
- **The chapter-end sequence (M-B — "how the level resolves" designed):** beat 1 the
  RESTORATION ACT (existing: the typed HELLO, the bloom) → beat 2 **the score page**:
  the book turns a painted page and writes the chapter's Bilanz — classmates freed
  x/6, Regel-Seiten y/N, letters z/M, Bonus-Bücher, one warm line from the freed
  friends → beat 3 the door out / map return. Painted UI per the mined ceremony
  patterns (doc 42); no raw text panel. The crash of R3-1 lives exactly here — PK-R1
  fixes the machine, PK-R3 gives the moment its design.
- ch01 exemplar wired in PK-R3; ch02+ authored in their build waves.

## §6 · SET-PIECE MASSES (R3-19)

Ruled and encoded directly in **doc 36 v1.2** (§2 new bullet + §4 gate 5 + §5
pointer): special formations become ONE drawn piece with grid-anchored import;
collision stays glyph-owned; tiled assembly for them is retired. Wiring: PK-R4 when
its art lands; commissioning shape rides the chapter prompts.

## §7 · ENFORCEMENT TABLE (guardrails by construction)

| Law | Machine check | Lands in |
|---|---|---|
| distribution map (§1) | `check-game-tasks` learns a per-chapter kind allowlist (field kinds per §1's table; boss/arena exemptions explicit) | PK-R3 |
| non-repetition (§1) | coverage layer counts simultaneous same-skin spawns per phase from the level file, demands pool ≥ count | PK-R3 |
| restore kind (§2) | machine + parity tests like every kind (machines.test pattern); changed ch01 cards re-run the two-layer gate | PK-R3 |
| speaker law (§3) | schema: no hazard use; serve guard unit-tested; `check-game-tasks` forbids hazard-only pools | PK-R3 |
| boss evidence (§4) | `taskInvariantErrors`: evidence required on boss evidence-kinds; scene test: card blocked until render beat done | PK-R2 (schema + render + the ch01 boss set re-authored) |
| Regel-Seiten (§5) | level law: N placed = N declared = N reachable (the letter-honesty pattern); register lint on Merksatz copy | PK-R3 |
| chapter-end (§5) | proof-tape expect gains `scorePageShown`; world-assertion replay | PK-R3 |
| set-piece (§6) | doc 36 v1.2 checklist line + no-naked-fill audit unchanged | PK-R4 |

## §8 · KOKI'S GATE — the three questions that are yours

1. **The collectible's name:** „Regel-Seiten" (torn rule pages — my recommendation,
   it rides the existing fiction: OSWIN tears the book) · „Merk-Zettel" (school-y,
   familiar) · „Grammatik-Funken" (magical, but breaks book-words naming law)?
2. **ch01's field palette shrink** to choice/wheel/restore/oddone with the boss
   ritual kept scripted (my recommendation — the tutorial stays simple AND the boss
   stays a set-piece): yes / keep one spell rescue card as a taste / no, keep today's
   mix?
3. **The chapter-end score page** as beat 2 between restoration and exit (my
   recommendation: the book itself writes the Bilanz — diegetic, no HUD panel):
   yes / simpler (chips only, no page turn) / bigger (add a sticker album screen)?
