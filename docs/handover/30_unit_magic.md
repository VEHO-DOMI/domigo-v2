# 30 · THE UNIT-MAGIC LAW — every level is its unit, bewitched

> **2026-07-19 — doc 31 (THE PAINTED BOOK pivot):** §1 CARRIES load-bearing; §2.1
> (STYLE_PIXEL_V3) SUPERSEDED by doc 31 §2 (STYLE_PAINT_V1); §3's modality kit carries
> re-keyed; §6's process evolves into doc 31 §7.

**Status: GOVERNING for all game design (2026-07-17 evening). Amends 27/28/29 (which stay
canon for mechanics, pipeline, and story/register). Born from Koki's full-art playthrough:
"nothing in this build may ever be generic — we think through every single step case by case."**

## §1 · THE LAW

1. **The antagonist bewitches every unit THROUGH ITS OWN CONTENT.** The Tintengeist doesn't
   cast generic curses: in the colors unit the world drains colorless; in the numbers unit the
   numbers are swapped and scrambled; in the school-things unit the objects come alive hostile
   and jumbled. The magic IS the curriculum, inverted.
2. **The goal is always RESTORING THE UNIT, in the unit's own terms.** Never "collect the
   tokens / free the seals" as an abstract formula. The goal card says what is actually broken
   in THIS unit's world and what restoring it means — kid-concrete, told by Finn, zero generic
   RPG vocabulary in student-facing copy (no abstract Wesen/Artefakte; established proper nouns
   like the Tintengeist stay).
3. **No collectible without a unit reason.** Ch01's letters ARE unit content — "you know: the
   alphabet" is the unit's first learning goal — so ch01 collects the SCATTERED ALPHABET.
   Every other unit invents its own collectible from its own content (numbers, animal tracks,
   food items…). A collectible that could be pasted into another unit unchanged is a defect.
4. **Every level is individually curated.** The sheet-driven PROCESS is the template; the
   content never is. Per unit, the sheet decides: the enemy cast (from unit vocabulary), the
   collectible fiction, the encounter modalities that fit the unit's language, the set-pieces,
   the boss composition, and the finale (always the unit's communicative function).
5. **Passive absorption counts.** The student should soak up unit content just by moving
   through the level: backdrops, decor, labels, ambient objects all come from the unit's
   vocabulary and visual world.
6. **Restoration is VISIBLE.** Chapter buildings on the world map exist in two states — sad,
   drained, still — and burst alive (color, light, sparkle, motion) when their level is
   restored. The same drained→alive read governs in-level set-pieces.

## §2 · UNIT VISUAL IDENTITY (from the real book pages, not just transcripts)

Each MORE! unit carries a color identity and its own illustrated world. These are studied from
the SB page screenshots (`Domi Gym 2025:26/1ABC (2025:26)/MORE1 SB Screenshots/`) per unit
before its sheet is written. **Unit 1 = GREEN** (unit banner, headers, vocabulary panels; the
UNIT-1 number bubble is yellow-on-green): the level's secondary accent (HUD tint, door glow,
goal card edge) is green.

**The book already plays our game** — Unit 1, SB p.12, "Midnight in the classroom": the school
things are drawn AS LIVING CHARACTERS with googly faces and limbs, DRAINED WHITE/colorless at
night, and the exercise is literally "Listen and colour" (with a color-cloud picker: red,
yellow, blue, orange, green, brown, pink, white, black, grey — the pencil case protests
"I hate pink!"). Ch01's colorless-classroom set-piece is the book's own fiction, animated.
Every unit sheet hunts for this: the unit's own illustrations are the level's art brief.

### §2.1 · THE ART BAR — STYLE_PIXEL_V3 (Koki's #199 verdict, 2026-07-17 late) — SUPERSEDED 2026-07-19 by doc 31 §2 (STYLE_PAINT_V1)

Koki's full-art replay: *"we're past the Keen-4 starting point — too pixelated, too ugly,
especially the brown ground. HD pixel art: sharper, variety, beautiful — but still pixel art."*
He chose the **Modern-Indie HD-Pixel bar (Owlboy / Eastward)**. This RETIRES the EGA-16 /
Keen-4 gameplay contract (STYLE_PIXEL_V2) for all NEW art:
- **Freed palette** — an extended, curated, harmonious palette (5–7 tones/material), not EGA-16,
  not photographic. Warm storybook key + one accent per unit (ch01 = green).
- **★ THE ANTI-NOISE LAW** — the load-bearing inversion of V2. NO speckle, NO random 1-pixel
  scatter, NO checkerboard noise fill (that grain is exactly what made the ground read ugly).
  Shade with clean smooth tonal bands; soft dithering ONLY to ease a two-tone boundary;
  material reads through a few hand-placed, intentional accents with generous clean space.
- Native res (~40px sprites, 48px tiles), integer scaling only; organic silhouettes, cohesive
  top-left light, selective interior AA on curves, crisp outer edge; 2–3 gentle variants so no
  tiled surface reads as an obvious repeat.
- **The WORLD MAP is PAINTED, not pixel** (class CUTSCENE) — the engine composites pixel
  buildings/hero/NPCs onto the painted clearings.
- Canonical spec = `docs/art/commission-w.mjs` (`STYLE_PIXEL_V3`). Batch W regenerates the
  ch01 cast + terrain + map at this bar; the two-class law survives (painted cutscenes vs
  HD-pixel gameplay). **Calibrate-first: the style key + a small cluster are gated by Koki
  before the ~90-image regen runs.**

## §3 · THE MODALITY KIT (built once in ch01, reused ONLY where a unit's language calls for it)

| modality | what happens | ch01 use |
|---|---|---|
| **object-battle** | a bewitched vocabulary object attacks; its generated character art IS the prompt; name it (typed w/ hint ladder, or chips) → it is freed (happy variant) | the 11 school things |
| **swarm barrier** | a swirl of items blocks a passage; a rapid chain (5–8 items, one at a time, both directions, big buttons; misses recycle to the end) clears it | numbers 1–25 ↔ number words |

**Two laws on these encounters (v5 W0, Koki's #199 verdict — binding):**
1. **NAMING IS THE ONLY WAY TO FREE.** The Federstab swing NEVER frees or removes a creature —
   it only SHOOS (short knockback + daze so the student can slip past). The bewitched object is
   freed exclusively by naming it in the encounter card.
2. **THE TWO-SKIN LAW — freed things STAY.** A correctly-named object turns friendly and
   REMAINS in the level (its `_free` art, a content little hop) — it never vanishes. Both skins
   (`_wild`, `_free`) are drawn for exactly this; a freed creature that disappears is a defect.

**On the swarm:** it reads as a big DRIFTING CLOUD filling the passage (unavoidable, alive),
not a thin static string. Chip options are seed-shuffled (the answer is never fixed at one
position — the authored JSON lists it first; every display surface shuffles).
| **restoration room** | a sub-room rendered drained; each object: name it → it lights up → pick its color ("What colour is …?") → colored variant pops in; room restored → exit opens, color floods | the midnight classroom |
| **command duel** | a misbehaving figure cycles action poses; per action a 3-choice imperative card; right command = it stops; 4–6 rounds → friendly | the ghost-student, Unit-1 imperatives |
| **dialogue finale** | a chat-style Q&A wrap-up (asking + answering, workbook-style) — the unit's communicative function, always LAST | meeting & greeting the freed student |

Boss = a COMPOSITION: the guardian's counter-windows draw one from each modality used in the
level, instead of a repeated cloze formula. Task formats stay varied by design — the sheet
picks per encounter (typed, chips, chain, picker), never one formula throughout.

## §4 · CH01 — "Zeit für die Schule", bewitched (the exemplar; sheet v3 carries the detail)

The fiction: the Tintengeist has bewitched the first school lesson — the school things came
alive angry and scattered, the ALPHABET blew across the schoolyard, the classroom drained
colorless, the numbers swarm the attic stairs, and one student was turned into a grumbling
ghost. Finn's goal line: *"Der Tintengeist hat die Schulstunde verhext! Die Schulsachen sind
wild geworden, das Alphabet ist verstreut, und das Klassenzimmer hat keine Farben mehr.
Bring alles zurück — dann kann die Klasse wieder lernen!"* (checked against register law —
"verzaubert/verhext" are the sanctioned magic words; threat stays leer/still/grau).
Progression: schoolyard platforming + alphabet collecting → object-battles → the number-swarm
barrier → the colorless classroom (restoration room) → the command duel → the Schlinger
composition-boss → the dialogue finale → restoration (map building bursts alive).

## §5 · WHAT DIES WITH THIS LAW

- The universal Glühwörter/letter economy as VISIBLE fiction (mechanics may survive re-skinned
  per unit; the free-hint economy stays but each unit names its own hint object).
- "Siegel / Wächter" as cross-unit vocabulary on student surfaces — each unit names its own
  locks in its own words (ch01: the two VERKNOTETE STUNDENSEITEN the Schlinger guards).
- The one-formula boss (4× typed cloze) and any goal card that could describe another level.

## §6 · PROCESS (per unit, in order)

1. Visual study of the unit's SB/WB pages (color identity, illustrated world, exercises that
   already contain game fictions — §2 hunting).
2. Sheet vN: fiction, enemy cast, collectible, modalities, set-pieces, boss composition,
   finale, asset list — every task hand-authored + grounded (doc 29 laws all apply).
3. Commission section from the sheet → Codex round → wire → playthrough → Koki gate.
