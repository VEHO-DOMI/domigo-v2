# 28 · THE PRODUCTION BIBLE — from design canon to shipped chapters

> **2026-07-19 — doc 31 (THE PAINTED BOOK pivot):** §1 CLT law, §5 protocol skeleton, and §8b
> access-map CARRY; the §2 visual-spec chain extends EGA-16 → PIXEL_V3 → **PAINT_V1** (doc 31
> §2 governs); §6's sheet format is AMENDED → v4 (`docs/design/g1/SHEET_TEMPLATE_V4.md`).

*Fable 5, 2026-07-16. Status: GOVERNING for all year-1 production. Sits ON TOP of the design
canon — doc 27 (the game bible) says WHAT the game is; this doc + `docs/design/g1/chNN.md`
(the 15 production sheets) say exactly HOW each chapter gets built, by whom, with which tasks,
which story beats, which images. Doc 18 (narrative), the cookbook (level authoring), and the
register law remain binding underneath. Koki's directive of record: "lay the groundwork for the
entire thing — every level, the tasks, the bosses, the story — all meaningful, CLT-oriented,
purpose-driven; build the prologue + chapter 1 fully with all images; I pass your commission to
Codex manually."*

## §1 · The CLT law (binding for every task placement)

CLT — Communicative Language Teaching: language is learned by USING it for real purposes, not
by drilling forms. In our game that becomes three hard rules:

1. **Every task has a story reason.** A task slot exists because the STORY needs the language
   at that moment (a page is broken in a way only this structure fixes; a character needs an
   answer only this vocabulary gives). The production sheet's task table states the reason in
   one line. No reason = the task moves or dies.
2. **The player is told the why, in German, before the doing.** Three surfaces carry it:
   the goal card's *Warum-Zeile* (`header.whyDe` — why this level matters to the story NOW),
   the beat lines around each inline task (the speaker frames the need), and the boss intro
   (what the guardian holds hostage and why answering frees it).
3. **The unit's content IS the chapter's magic system.** Quickfires draw the unit's vocabulary;
   the duel's counter-windows draw the unit's REAL structures (the sheets list them from the
   corpus — the bible §3 pointer cells are superseded where they disagree). Nothing off-unit,
   nothing untaught.

## §2 · THE VISUAL STYLE SPEC — Commander Keen 4's language, our book-world subjects

Machine-extracted from the six real Keen 4 level maps (palette census, all six: EXACTLY 16
colors) + close-region study. This spec governs the Codex commission AND future procedural art.

**§2.1 The palette (EGA-16, Keen's rendered values — quantize every asset to these):**
`#000000` black · `#0000a8` blue · `#00a800` green · `#00a8a8` cyan · `#a80000` red ·
`#a800a8` magenta · `#a85400` brown · `#a8a8a8` light gray · `#545454` dark gray ·
`#5454fc` bright blue · `#54fc54` bright green · `#54fcfc` bright cyan · `#fc5454` bright red ·
`#fc54fc` bright magenta · `#fcfc54` yellow · `#fcfcfc` white.
*Fusion allowance:* our ink-navy UI world (`#141221` family) stays OUTSIDE the play-art; play
assets live in EGA-16. Per-chapter accents pick an EGA pair, never a new hue.

**§2.2 The texture law — checkerboard dithering.** Keen's ONLY gradient/texture tool is a 1px
checker between two palette colors: leaf texture (green×bright-green), the pyramid's shimmer
walls (magenta×bright-cyan), sky blends. Commission prompts demand "1-pixel checkerboard
dithering between exactly two palette colors — no smooth gradients, no anti-aliasing."

**§2.3 Outline law.** FOREGROUND objects (creatures, items, trees, buildings, the hero) carry
bold black contour outlines + black interior detail strokes. BACKGROUND-plane surfaces (cave/
pyramid walls, sky) are outline-free — that contrast IS the depth. Items get a white sparkle
glint. Platform ledges: lit top lip + dark "teeth" on the underside.

**§2.4 Modeling law.** Two tones per material (base + bright of the same family); black serves
as the dark shade. Flat fills — form comes from silhouette + the two tones + dithering, never
from soft shading.

**§2.5 World signatures** (per-map census evidence): skies are FLAT bright cyan (`#54fcfc`)
with black-outlined white clouds; underground is black-dominant with gray/brown; each world
owns a signature accent (village white/gray on night black · forest greens/browns under cyan ·
pyramid magenta×cyan shimmer · fire red/brown on black). Each chapter sheet names its
signature pair.

**§2.6 Scale + rendering.** Assets are authored as chunky pixel art at 16px-tile logic and
rendered 3× nearest-neighbor (our 48px tiles). Creatures ~1–2 tiles, big readable eyes
(the no-kill register needs faces kids can forgive), telegraph poses readable in ~0.5s.
Sprites: transparent PNG (or magenta `#FF00FF` pose-sheets for `slice-art.mjs`).
Full-bleed illustrations (prologue, beats) may use painterly-pixel hybrid but keep the palette.

## §3 · THE PROLOGUE (the cold-open — plays once, before the world map ever renders)

Doc 27 §3's declared-but-unbuilt beat, now scripted. Surface: the beat renderer in full-bleed
illustration mode; `save.beats.prologue` gates it to once. Scenes (schema-ready; `image` =
stem from the commission):

| id | speaker | textEn | scaffoldDe | image | task |
|---|---|---|---|---|---|
| pr01.s001 | berger | "Today we try our new English book! Open it." | „Heute probieren wir unser neues Englisch-Buch! Öffne es." | `prologue_classroom` (full-bleed: warm classroom, the book on a desk glowing at the seams) | — |
| pr01.s002 | finn | "Help! The pages! Hold on tight!" | „Hilfe! Die Seiten! Halt dich gut fest!" | `prologue_pull` (full-bleed: the book bursts open, a vortex of letters pulls the player in — motion, no menace) | — |
| pr01.s003 | finn | "You are IN the book now. I am Finn — this is Pixel." | „Du bist jetzt IM Buch. Ich bin Finn — das ist Pixel." | `prologue_landing` (full-bleed: the book-world map from above, grey chapter-lands, Finn the paper book-guide + Pixel the ink cat greeting) | name-it → a g1-u01 `book` vocab item (the first word you rescue is „book" itself) |
| pr01.s004 | finn | "Someone is rubbing out our pages. Will you help us?" | „Jemand radiert unsere Seiten weg. Hilfst du uns?" | — (the map fades in beneath) | — |

Register check: threat = *leer, weg, still* — never dark/evil; Finn is warm and a little too
quick to laugh things off (his arc). After s004 the overlay closes, the world map is live,
and the ch01 door beat (s001, shipped canon) takes over. Total: ~60 seconds, 3 illustrations,
1 mini task (CLT: the first act in the book is rescuing the word for the thing that trapped you).

## §4 · THE HERO — canon amendment (supersedes doc 27 §5.4's procedural-only clause)

Koki's call (2026-07-16): the hero gets GENERATED art. The design that keeps what mattered:

- **One canonical hero**: a schoolkid adventurer — satchel worn cross-body, scarf, the
  **Federstab** (a giant white quill, nib down — the pogo) on the back; hair mid-brown, mustard
  shirt (EGA yellow family) so accessories in any hue read against it. Silent protagonist
  (the player IS them; they never speak in beats).
- **The 12-pose sheet** (matches the engine's pose machine exactly): stand · run1–4 · jump ·
  fall · pogo1 (squash) · pogo2 (extended) · climb1–2 · hang. Commissioned as ONE magenta-grid
  sheet, 4×3 cells, 256px/cell, sliced by `slice-art.mjs`.
- **Unlockables become OVERLAY accessories**: transparent PNGs anchored to the player sprite
  (scarves, hats, Federstab skins, satchel patches) — the catalog survives, individuality moves
  from body-palette to gear. Two accessories ship in Batch S as proof.
- **The procedural sprite remains the permanent fallback** (image missing → today's procedural
  hero; also the offline/dev safety). The fallback law makes the amendment reversible.

## §5 · THE CODEX PROTOCOL (the image production loop)

1. Fable authors/updates the commission: `docs/art/commission-data.mjs` →
   `node docs/art/build-commission.mjs` → `docs/art/CODEX_COMMISSION.html` (self-contained;
   style bible + one card per asset with the full prompt + embedded references).
2. **Koki** opens the HTML, works batch by batch (style key FIRST, then the one-image pipeline
   proof, then the batch): pastes each card's prompt block into Codex, saves results with the
   card's exact filename into `docs/art/drop/`.
3. Fable (or Koki) runs: `node docs/art/slice-art.mjs` (only for magenta sheets) →
   `node docs/art/prep-art.mjs` (QA gate: format/size/transparency — exits 1 on failure) →
   `node docs/art/sync-art.mjs` (→ `apps/web/public/art/g1/keen/…`).
4. The engine lights up per-stem (only-present law — every missing image keeps its procedural
   fallback). In-game screenshot vs the style key → Koki's glance → manifest committed in the
   same PR.
   Standing laws kept: `_style_key` first, ONE image proven end-to-end before volume, manifests
   are allowlists, no batch for an unbuilt engine slot.

## §6 · THE PRODUCTION SHEETS — format (frozen by Koki's gate 1)

One file per chapter: `docs/design/g1/chNN.md`, seven sections, each a build input, no prose
padding: **1 Identity** (building/level/guardian/theme + EGA signature pair) · **2 Story spine**
(scene ids, door/mid/restore anchors, task-slot scenes) · **3 CLT block** (Warum-Zeile verbatim
+ the task-reason table) · **4 Level design** (archetype/size/wings/verbs/collectibles/secret —
cookbook §7/§7b terms) · **5 Boss duel** (script fields in register + knots/pattern + the task
mix from the unit's REAL structures) · **6 Assets** (stems for the commission) · **7 Beats
staging** (which scenes illustrate, who speaks). The corpus crib behind every sheet:
scene lists and structure inventories are machine-extracted, never remembered.

### §6a · Rulings for wave authors (from the decodability audit — read before building)

1. **Schema exemplars**: ch01's `keen/ch01.level.json` + `ch01.boss.json` + `world.json`'s
   `beats` entry ARE the file-format exemplars; doc 25 §4 holds the glyph legend, cookbook §7b
   the v2.2/2.3 glyphs. Sheets are design inputs, deliberately schema-free.
2. **"The bible" in sheets = doc 27** (this file is "the production bible" — cited as doc 28).
3. **Timing units**: telegraph values are MILLISECONDS, window values are SECONDS.
4. **Boss pattern**: a repeating lane cycle, independent of knot count (ch01 as built: 4 knots,
   6-entry pattern). Knots are capped at **5** (cookbook law) — the rescue duel (ch15) alone
   runs its own numbers.
5. **Beat task slots in sheets are DESCRIPTIVE** — they document the shipped story.json wiring
   (machine-extracted). A wave never edits scenes except where a sheet explicitly says so.
6. **NEW-mechanic notes** (fading platforms ch11, dough pits ch07, thief stash ch10,
   Flatterbuchstaben scatter ch07…) are ENGINE-lane work: scheduled as a small engine PR
   WITH the act's wave, never smuggled into a content-only brief (doc 27 §7's no-engine-edits
   law stands for the content half).
7. **Jona's in-level notes**: none in act 1 (map-side note only, as built); ONE hidden note
   per level from ch06 onward — text authored at wave time in doc 18's note voice; sheets
   need not repeat this standing rule.
8. **Cookbook floors bind at build time**: where a sheet's population under-shoots the
   0.75/screen floor or omits the E-tier signature placement, the wave FILLS to the cookbook,
   never below (the sheet lists minimums, the cookbook is the law).

### §6b · The asset globals (the inventory the sheets share — closes the coverage audit's G1–G3)

- **Portraits — the complete inventory (machine-extracted from story.json speakers):**
  core 5 in Batch S: `portrait_finn` · `portrait_pixel` · `portrait_berger` ·
  `portrait_jona` (gentle — a tired kid, never a shadow; used ch14/ch15 only) ·
  `portrait_tintengeist` (the rescue overlay's keeper). Per-act NPC portraits ride their act's
  commission section: Act 1 `portrait_captain` (ch03) `portrait_robo` (ch04) `portrait_anna`
  (ch05) · Act 2 `portrait_mo` `portrait_luca` `portrait_mila` `portrait_tim` `portrait_apple`
  `portrait_tik` (ch06–11) · Act 3 `portrait_rosa` `portrait_sam` `portrait_peppi` (ch12–14).
  16 speakers + Tintengeist = **17 portrait stems, all commissioned** — none silently dropped.
- **The world map's background**: the page itself is commissioned (`page_underlay`, tileable
  paper with faint ruling — the map walks ON an open book page); the map's TERRAIN fabric
  (paths, brambles, grounds) stays procedural v1 — a DECISION, not an omission: the fabric is
  gameplay-read (walkable vs blocked) and iterates with the map; a fabric tile batch may follow
  once the underlay proves the look. Buildings are commissioned per chapter (`building_chNN`).
- **Creature economy (explicit, gated at R4)**: the six wave-1 creatures are commissioned ONCE
  and re-themed per chapter via palette + data variants (the sheets' framing does the theming);
  act-2 adds the three canon creatures (`creature_radierer` ch06 · `creature_flatterbuchstaben`
  ch07 · `creature_verdreher` ch08; Der Rotstift joins ch10's shop wave). If Koki wants
  per-chapter creature skins after playing R4, that becomes a follow-up batch — the slots
  already accept per-chapter stems.

## §7 · YEAR 2 — outline only (expands when year-1 Act 2 is in build)

Doc 20 (The Spill) + doc 22 (school geography, palette drain arc) govern. Same sheet format,
15 school chapters, inversion: things are MISSING, not thrown; ally-Jona carries hint duty
(Funken-integrated); care duels in Act 3 (ch12/14/15 Fable-authored). The Blank is rendered as
ABSENCE (unpainted paper, not a creature) — its style spec extends §2 when authored.

## §8 · THE ROADMAP (supersedes plan 26's W3/W5 sequencing detail)

| step | what | owner | gate |
|---|---|---|---|
| R0 | This bible + 15 sheets (PR-1) | Fable | **Koki reads §3 + 2 sheets — freezes the format** |
| R1 | Engine image-slots + prologue surface + portraits + whyDe (PR-2) | Fable | gate green; harness playtest |
| R2 | The commission HTML (PR-3) | Fable | stem↔manifest bijection green |
| R3 | **Batch S**: style key → pipeline proof → ~30 images (prologue+ch01+globals) | **Koki × Codex** | style key glance; prep QA green |
| R4 | Prologue + ch01 at FULL ART (PR-4) | Fable | **Koki plays prologue→ch01→boss (~15 min) — freezes the production template** |
| R5+ | Act waves: ch02–05, 06–11, 12–15 — per act: Opus builds from the frozen sheets → act commission section → Koki×Codex → sync → act gate | Opus builds · Fable reviews · Koki gates | one played chapter per act |
| RY2 | Year-2 sheets + waves (after Act 2 starts) | Fable sheets · Opus waves | as above |

Ch15 (the rescue duel) and every year-2 care climax stay Fable-authored — the campaign's soul.

## §8b · THE ACCESS-MAP LAW (W0, Koki 2026-07-17: "this doesn't happen again")

Every game surface is listed here with WHO can reach it and WHERE its visible entry point
lives. **Standing rule: a PR that adds or moves a surface must add/update its entry point AND
this table row in the same PR.** A surface without a visible entry point for its audience is
a defect (the Story-Modus launch shipped reachable only by typed URL — never again).

| Route | Audience (prod) | Visible entry point |
| --- | --- | --- |
| `/play/1` (hub, old build) | students + teachers | student home; admin "Play the story mode" chain; every "← Alle Räume" |
| `/play/1/z01…` (old zones) | students + teachers | hub page cards |
| `/play/1/world` (Keen world map) | **teachers only** until year-1 release | admin dashboard card + `/play/1` hub card (teacher-only render) |
| `/play/1/run?level=…` (Keen levels) | **teachers only** until year-1 release | world-map buildings (never direct) |
| `/play/1/buch` (The Painted Book, doc 31) | **teachers only** until year-1 release | admin dashboard auto-list (from M2); world-map slot at release |
| `/admin` | teachers | teacher sign-in landing |
| `/signin` | everyone | public root |

Identity contract behind the table: `getPlayerForPage()`/`getActingPlayer()` (student first,
teacher fallback) on EVERY game surface + the game-save route; `/api/attempts` stays
student-only by design (teacher play never lands in class mastery). The pre-release gate on
world/run is `VERCEL_ENV === "production" && teacher === null → redirect`.

## §9 · Truth pointers

Sheets: `docs/design/g1/` · commission: `docs/art/CODEX_COMMISSION.html` (+ its data/builder) ·
crib extraction: re-run any time (scene/structure ids in sheets are machine-checked against the
corpus in CI-less spot-checks — `scripts/` gains a checker if drift ever bites). Supersedes:
`docs/art/ART_SHOPPING_LIST.md` (marked), doc 27 §5.4 procedural-only clause (amended §4 here),
doc 27 §3 guardian task-pointer cells where the corpus disagrees (sheets carry the truth).
