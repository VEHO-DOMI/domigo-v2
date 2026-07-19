# 31 · THE PAINTED BOOK — the class, the cages, the kindness

**Status: GOVERNING for all game design (2026-07-19). Supersedes the Keen SHAPE (docs 25 §Keen-grammar,
26 entirely, 27 §1–§3 as amended below); carries doc 29 (story/register/task laws) and doc 30 §1
(the UNIT-MAGIC LAW) in full force. Born from Koki's pivot directive (2026-07-19, in-session,
decisions recorded): the HD push on the Keen skeleton was "still not nearly there" — the game's
basis is now the 1995 painted-platformer shape: painterly hand-drawn worlds, richer child-friendly
verbs, and a completion loop where freeing caged friends IS the pacing spine. Evidence base:
`docs/study/rayman/rayman-grammar.md` (the clean-room mechanics + design-space study) and
`docs/study/rayman/level-cookbook-v2.md`. The approved execution plan (engine architecture, PR
sequence) lives in the plan file; §8 sequences it here.**

*Clean-room rule, binding (CP-15): the 1995 game's MECHANICS, structure, and feel are free to
study and reimplement; its code, assets, names, and character designs are Ubisoft's and never
enter this repo, any prompt, any reference folder, or any student surface. Our study sources
(the reconstruction repos, the map viewer) are STUDY-ONLY.*

*Amended same day, pre-merge (Koki): **THE FRESH-EYES LAW** (§1.6) — nothing from the Keen
build is inherited by default; the provisional carry-over calls (keeper role, pogo favor,
task reuse) are STRUCK; the **NAMING LAW** (§5/§6) replaces the first name shortlist.*

---

## §1 · THE PIVOT LAW — what the game now is

1. **The whole class falls in.** The teacher opens das besondere Buch — and this time the spell
   takes EVERYONE. The player (boy or girl avatar, chosen at the start) lands alone; the other
   twelve classmates are torn away mid-fall and scattered through the fifteen chapters, held in
   cages. Restoring the book and getting the class home is one and the same journey.
2. **The unit-magic law carries unchanged** (doc 30 §1): each chapter is its MORE! 1 unit,
   bewitched through its OWN content; restoring the unit in its own terms IS the game; no
   collectible without a unit reason; passive absorption everywhere; restoration visibly
   transforms the world; every level individually curated.
3. **Nothing dies — kindness is the mechanic.** Naming frees (the only way); punching only shoos
   (doc 30 §3 both laws carry). Hazards and enemies never kill: contact opens a task encounter;
   a miss costs momentum and scattered collectibles, never a life. And the signature beat, new
   with this shape: **a defeated chapter guardian cries — and the player consoles it.** Every
   guardian ends the chapter as a friend. The redemption loop is also the power economy (§4).
4. **The form:** side-scrolling painted platformer. A chapter = **three short phases + a
   one-screen guardian arena**, chained by exit signs. Per chapter, **six cages** hide in the
   world: ONE holds a person (a classmate — §5), five hold the unit's own bewitched beings.
   **Freeing every cage across the year is the gate to the finale.** The world map, the camp,
   the chapter beats, the in-game hint fiction, and the duel surface are all DESIGNED FRESH
   through this shape (§1.6); the platform's proven plumbing underneath (grading, task overlay,
   hint sparks, saves, gating) is infrastructure and simply serves whatever the fresh design
   asks of it.
5. **The bewitcher** is a child, not a monster (§6). The year's last door is not a defeat but
   an invitation — the class frees AND forgives him. Year 2 ("The Spill") re-keys to the residue
   of his magic.
6. **THE FRESH-EYES LAW (Koki, 2026-07-19, pre-merge — binding):** nothing from the Keen build
   is inherited by default — no fiction element, cast member, name, task, level layout,
   modality, or surface design. The Keen game, its sheets, and its task packs are IDEA-MINES:
   reference material we may consult, never templates we copy — forcing past pieces into a new
   shape is how Frankenstein builds happen. Every element of the painted book is derived from
   the new direction and re-earns its place. What DOES carry: process laws (register, grounding,
   no-generic, calibration gates, deploy-truth) and engine-agnostic infrastructure — method and
   plumbing, never content.

## §2 · THE LOOK — STYLE_PAINT_V1 (supersedes STYLE_PIXEL_V3 for this game)

Koki's verdict 2026-07-19: **painterly storybook, locked.** The world looks painted because it
IS a painting — the class is drawn into a book.

- **Register:** hand-painted storybook gouache, saturated and joyful; visible soft brushwork;
  NOT pixel art, NOT vector-flat, NOT 3D. Book-world key in every image: warm paper-cream light,
  ink-blue linework, faint ruled lines + paper grain in grounds, golden glow reserved for
  collectibles and hint objects.
- **Characters are limbless mascots:** floating mitten-hands and shoes, no arms or legs, round
  bodies, big expressive eyes, thick soft dark-ink outlines (~2.5% of sprite height). Everyday
  objects are mascotized. Bewitched = melancholy-comic, never scary; freed = joyful. (The
  limbless TECHNIQUE is free and is also our animation weapon — a character is a rig of parts
  the engine poses, so consistency across 1,000+ images is structural, not hoped-for.)
- **Three-value depth law:** foreground (play plane) full saturation + outlines; mid planes
  desaturated two-tone silhouettes, NO outlines; far plane hazy, near-monochrome. The squint
  test is binding: hero / enemies / ground / background must separate instantly.
- **Per-unit palette cards:** one dominant hue pair + two supports + the invariant book
  constants, authored from the unit's real SB pages BEFORE its sheet freezes (only u01 GREEN is
  book-verified today). The card is embedded in EVERY commission card of that unit (CP-14).
- **Size contract RS-2:** the 16 px logic grid and 48 px display tile are unchanged — but art
  sources must be ≥2× their largest displayed CSS size (crisp on DPR-2 school iPads), LINEAR
  sampling everywhere, display only ever downscales. Sprites stay on the proven 256 px sheet
  cells (512 for guardians). The 48-px-multiple law and the LINEAR/NEAREST filter split are
  RETIRED with pixel art. **Terrain is strips-over-tiles:** the visible ground edge is a painted
  modular STRIP (bank segments + end caps) laid over the collision grid; 48 px tiles remain for
  interior fill and one-ways — painterly tiling seams die by construction.
- **Viewport:** the new game plays at the 1995 proportion — **22×14 logical tiles**, hero ≈ 2.2
  tiles (~16% of view height): big, readable, expressive. (The Keen 15×11 frame retires with
  the Keen module.)
- **QA gates evolve, machinery carries:** commission cards → codex-art-lab batches → import
  (chroma-key, defringe, despill, deborder) → `prep-art` hard-fail QA → `sync-art` → manifests
  as allowlists → the only-present resolver (missing stems keep procedural fallbacks — painterly
  art lands stem by stem). New hard checks: exact plate dimensions post-normalize; a machine
  SEAM CHECK on loopable strips; the register checks vs `_style_key_paint` (CP-10). New
  pitfalls CP-9…CP-15 appended to `docs/art/CODEX_METHOD.md`. References for every generation
  are OUR OWN art only (the style key, the hero parts sheet, the unit's approved far plate);
  the Keen-era third-party reference crops retire.
- Canonical spec constant = `docs/art/commission-z.mjs` (`STYLE_PAINT_V1`, forked from Batch T's
  proven `STYLE_CUTSCENE` painterly contract), authored with Batch Z (§8 M1).

## §3 · THE PLAY GRAMMAR — verbs, roles, and the feel contract

**The feel contract** (per 60 Hz tick, 16 px tiles; D = adopted verbatim from the studied 1995
source, T = ours to tune; full table with test obligations in the engine package):

| Verb / rule | Spec | |
|---|---|---|
| Walk / run | momentum accumulator, sub-pixel (1/256 px) carry; friction 6 (3 on slippery phases) D; top speeds + accel T | run engages above a momentum threshold |
| Jump | vy −5, gravity +1, hold suppresses gravity ≤12 ticks (variable height), fall caps +4/−10 — all D | tap = hop, hold = full arc |
| **Hover (quill-rotor)** | hold jump in air → 50-tick glide, slow fall D | a spinning quill-propeller — a hover device native to a book world (fiction finalized in the cast/story pass) |
| **Thrown fist (punch)** | charge +1/tick to 63 (air throw 32); damage (charge>>4)+1; speed 5/8/11 + run boost; flies out, U-turns, returns — all D | the shoo + trigger verb; the fist never redeems — solving the encounter task does |
| Ledge hang / pull-up | grab cliff edges; jump from hang vy −3 D; magnet 4 px T | |
| Ring swing | true pendulum, rope ~95–100 px, dwell at extremes, release converts swing to jump — D | rings are glowing letter-Os |
| Vine climb | snap-to-column climb D | |
| Forgiveness (ours) | coyote 6 ticks, input buffer 8, generous i-frames 120 — T/D | built for ten-year-olds; the original had none |
| Knockback | ±2/−3 (fast ±5/−6), 120-tick i-frames, scattered collectibles are re-collectable — D | a setback you watch, never a death |
| Camera | eased look-ahead follow (direction-dependent thirds), vertical band ~57%, platform carry — D | |

**Difficulty tiers (E/M/S) never touch physics** — populations, helper platforms (easy gets
MORE), and timer generosity only (the proven Keen doctrine carries).

**The role vocabulary** — a small set of mechanical roles, re-costumed per unit from its own
content (this re-skinning grammar is doc 30 §1 made mechanical): enemies = **chaser · gunner ·
flyer · bouncer · crusher · swarm**; platforms = **static · falling · bouncy · moving ·
swinging**; hazards = **spikes · ink pools (water) · slippery**; interactables = **swing-rings ·
cages · currency collectibles · power-ups · triggers · springs · vines · exit signs**. Triggers
(internal name only; each unit skins its own) fire by proximity, by punch, or by
collect-all-N — the spawn/reveal primitive behind hidden cages and set-pieces.

**Currency, two-layer rule:** the MECHANIC is universal (one counter, breadcrumb trails that
lead to secrets, a reward beat at 100); the SKIN is per-unit and unit-grounded (ch01 = the
scattered alphabet; ch02 = animal tracks; …). The platform's free-hint spark system stays
available as plumbing; its in-game fiction is designed fresh. Stamina, mishap rendering, and
the calm consolidation beat after repeated misses are designed fresh in the play pass — the
pedagogy goal (failure recycles into meaning-focused practice, never punishment) is the
requirement, not any past implementation.

**Checkpoints: the sketch.** Mid-phase, at most once per phase, a book-being sits at an easel
and dashes off a quick ink sketch of you — the sketch pins to the page and is where you resume.
Sparse on purpose (the stretch between sketches is the risk unit). WHO sketches is decided in
the fresh cast pass (§6).

**Guardians (bosses):** one screen, one telegraphed pattern, one exploitable weak point — the
guardian throws its own unit-object; a punched DEFLECT staggers it; the stagger opens the
counter-window; the window is a production task (implementation may reuse proven engine
plumbing where the fresh design happens to coincide — plumbing, never design). Knots ≤5.
Victory = the cry → the console beat (choice-less, warm) → a friend for the camp. The finale
duel CANNOT be failed — a design law of this game (§6).

## §4 · THE ABILITY ARC — a new verb right before the chapter that needs it

| Verb / power | Granted | By | Stress-tested | Retro-opens |
|---|---|---|---|---|
| walk + jump | ch01 start | — | ch01 | — |
| thrown fist | ch01 mid | the guide (cast pass, §6) | ch01 guardian deflect | — |
| ledge hang | ch02 door | the guide | zoo enclosure walls | ch01 high alcove |
| ring swing | ch03 door | the guide | pirate rigging runs | ch01–02 ring gaps |
| quill-rotor hover | ch04 door | the guide | weather updrafts | wide gaps everywhere — **backtrack beat 1** (map prompt after ch04) |
| favor power I | ch05–06 | a consoled guardian | vertical play ch06 | tall secrets — **beat 2** |
| favor power II | ~ch06 | a helped book-being | hidden cages ch08–11 | full-map cage hunting |
| sprint | ch13 door | the guide | escape runs | timed doors ch07/ch11 — **beat 3: the ch14 "cage call" sweep** |

Two powers are FAVORS — earned by kindness, not granted (the redemption loop as economy).
WHAT they are is derived fresh from the units they serve in the sheet pass — never imported
from the Keen verb set (§1.6). Later verbs retro-open earlier cages: backtracking is designed
joy, and the finale gate (ALL cages) makes it count.

## §5 · THE CLASS — twelve kids, one camp

- **The cast:** 12 fictional classmates + their teacher (the player is the 13th kid; the boy
  and girl avatars come from this cast — girl rig lands before any student release). Diversity
  as texture, never as checklist copy: a natural Viennese classroom — range of skin tones and
  hair, glasses, a hearing aid, one silhouette-defining prop each (cap, braid, headphones,
  scarf…). All rig-compatible with the hero (same limbless grammar), so freeing animations
  reuse rig motion.
- **THE NAMING LAW (Koki, 2026-07-19):** human kids bear UNCOMMON first names blending German
  and English flavors — natural to say in both languages, deliberately absent from current
  Austrian top-name lists, so no real student shares a name; every name is checked against
  Koki's actual class lists before it becomes canon. Book-beings never bear kid names at all —
  they are named after book- and print-words (§6), zero collision by construction. **Proposed
  default class (Koki confirms):** boys **Fenn · Veit · Piet · Tammo · Quirin · Lenz** · girls
  **Merle · Ilvy · Enna · Juno · Smilla · Edda** (spares: Falk, Wim, Janto · Fritzi, Cleo,
  Tove). Default names ship with the game; a later teacher setting can rename them with the
  class's real FIRST names (names only, never likenesses — Koki's decision 2026-07-19).
- **Cage math:** one person-cage per chapter (on-path, findable by everyone — the chapter's
  emotional beat), five hidden cages holding the unit's own bewitched beings (their freeing IS
  visible restoration, doc 30 §1.6). Twelve kids across fifteen chapters: the teacher and a
  beloved book-being companion fill two of the remaining person-cages (which and where = the
  fresh cast pass), and ch14's big cage holds the bewitcher's old keepsake — the empathy beat
  before the finale.
- **The camp:** every freed kid walks to a visible camp on the world map — a growing picnic of
  the class-in-exile, the year's progress meter you can SEE (restoration made visible). Freed
  cage micro-beat, in-level and compact: the cage bursts, the kid hops out, says ONE grounded
  unit-true English line (German scaffold beneath), and runs off toward the camp. These lines
  are hand-authored per chapter and pass the grounding checker like every task.
- **Avatar select:** one painted page before the map — "Wer bist du?" — two cards (boy first
  build, girl immediately after template freeze). Access-map row added the same PR it ships.

## §6 · THE BEWITCHER — a lonely child, renamed

**The concept (Koki-locked):** a former student, trapped in the book for years, re-bewitched it
so the next class to open it would be pulled in — he didn't want to be alone anymore. Freeing
AND forgiving him is the finale. The name **"Jona" retires from the fiction** (Koki, same
session). **Name shortlist for Koki at this gate — under the naming law (§5): uncommon,
German-English blend, checked against his real class lists: lead OSWIN; alternates CORVIN,
ALWIN.** (Doc uses OSWIN below; find-replace on the verdict.)

- **The cloak rule (production law):** all year, the bewitcher appears only as a cloaked ink
  silhouette — a readable child outline inside a drifting ink mantle: a figure at the map's
  edge, a chapter-intro cameo, the seal mark on cages. Every one of those assets is
  name-independent; only the finale unmask art (one portrait + four shots + epilogue) waits on
  the name. Nothing else blocks.
- **His notes:** handwritten signpost notes in a child's hand — mischievous at first, then
  increasingly lonely — are the year's quiet breadcrumb trail to the truth.
- **The book's own beings are designed fresh (§1.6):** the guide who teaches verbs, the
  sketch-companion, a keeper/weather presence — every role is derived from the painted-book
  fiction in the cast pass, and NONE of the Keen cast (Finn, Pixel, the Tintengeist, the
  guardians) is inherited by default; they are idea-mines. **Book-beings bear book-words as
  names** (naming law, §5) — the pool to draw from: **Fibel** (the primer), **Klecks** (the
  ink blot), **Krakel** (the scrawl), **Eselsohr** (the dog-ear), **Kustode** (the old
  printers' word for the catchword at a page's foot), **Vignette**, **Initiale**. The
  teacher's fictional name is a cast-pass pick too (rare surname; proposal: Frau Wunderlich).
- **The guardians are OSWIN's bewitched creations**, one per unit, each derived fresh from its
  unit's own content in the sheet pass (Keen-era guardian identities are idea-mines only) —
  each one, consoled, becomes an ally and appears once more late in the year; the finale
  assembles all of them on our side.
- **The finale (ch15):** an inversion duel that cannot be lost — you win by ANSWERING. The
  last counter-window is not a blow but the invitation. Unmask: OSWIN, small and tired. His
  question was always "will anyone stay for me?" — and the class answers it by having freed
  everyone. He walks out WITH the class. Epilogue hooks year 2: the Spill is the residue of his
  magic, and the care-arc doctrine of doc 20 fits it perfectly.

## §7 · UNIT → LEVEL, METHOD v2 — the worksheet every chapter runs

The PROCESS is the template; the content never is (doc 30 §1.4). Sheet template:
`docs/design/g1/SHEET_TEMPLATE_V4.md` (DRAFT until frozen from the as-built ch01 at M4).
Per unit, in order:

1. **Unit audit** — real SB/WB page study + structure inventory (the Keen-era ch02–15 sheets
   hold complete FACTUAL audits — page facts and structure inventories are reusable facts;
   every CREATIVE element is authored fresh, §1.6) + **author the unit lexicon**
   (`docs/design/g1/grounding/uNN-lexicon.json`; only u01 exists — u02–15 are named wave line
   items; `scripts/check-story-grounding.mjs` is the ship gate for every task and cage line).
2. **Bewitchment concept** — how THIS unit's content turns hostile; goalDe/whyDe in register.
3. **Role casting table** — which unit items play which mechanical roles. Ch01 worked example:
   pencil/pen/ruler chasers · watercolour-box gunner (paint blobs) · exercise-book flyer ·
   eraser bouncer · scissors swinger (on a thread) · school-bag crusher · book-stack /
   loose-paper / board-sponge / sliding-ruler / hooked-satchel platforms · ink-nib spikes,
   spilled-ink pools, chalk-dust slide · letter-O swing rings · zipped pencil-case person-cage +
   knotted-satchel hidden cages · the scattered alphabet as currency · doors that obey
   imperatives ("Open!").
4. **Phase-chain layout** — 3 phases + arena; encounter density ~0.5–0.75 per screen (this shape
   breathes more than Keen; cookbook v2 has floors AND ceilings); cage conventions per chapter:
   1 on-path person cage · 2 at the end of currency breadcrumb trails · 1 behind a later verb
   (the backtracking economy) · 1 in a camera-teased alcove · 1 in/after the arena; sketch
   checkpoints ≤1 per phase.
5. **Guardian concept** — the deflect-back puzzle built from unit content + the counter-window
   production tasks; the cry + console + ally tag.
6. **Task set** — authored FRESH per chapter, through the new level design and fiction, under
   doc 29's story-task law (hand-authored, story reason on every task, grounding, WS-HINT
   ladder). The Keen-era `chNN.tasks.json` packs are idea-mines only — consulted for
   unit-content ideas, never copied (§1.6). Every set passes grounding + blind-solve.
7. **Curation gates** — grounding checker ✓ sheet checker ✓ machine playtest ✓ independent
   fresh-context blind-solve of every task as rendered ✓ Koki act gate. The two-layer
   intelligence-pass law binds here as everywhere.

## §8 · THE ROADMAP — calibration-first, one PR at a time, Koki merges

| M | Deliverable | Gate |
|---|---|---|
| **M0** | THIS DOC + the study docs + sheet-v4 draft + supersession banners + access-map row + tri-surface sync | Koki reads (~25 min); confirms the naming slate (§5 kids · §6 bewitcher OSWIN/CORVIN/ALWIN vs his class lists) |
| **M1** | Batch Z: `_style_key_paint` whole-vignette + hero parts + pose atlas + one ch01 phase vignette + enemy pair — through import + QA | **Koki look verdict** (a wrong key caught at 5 images, not 210) |
| **M2** | Engine PRs ①–④ (pure brains → level format → "first light": one playable test phase with the full verb set, behind the teacher gate) + Batch AA | **Koki plays the movement toy** on the DEPLOYED build |
| **M3** | Slice PRs ⑤–⑩: entities/encounters → phase chain + parallax → guardian arena → cages/save → remaining roles → ch01 fully authored + cutscene + camp + the FRESH ch01 task set + feel-tune. Batches AB/AC | machine playtest + fresh-context blind-solve of the full fresh task set + **Koki Durchlauf** |
| **M4** | **Template freeze** from the as-built ch01 + wave brief + cookbook v2 final + validators + u02–05 lexicons + **girl rig** | Koki confirms freeze + girl glance |
| **M5–7** | Act waves ch02–05 · 06–11 · 12–15 (sheets → content PRs → art batches → wave stats) | one played chapter per act |
| **M8** | Year-1 release: access-map flips, old-surface retirement, classmate-rename feature | Koki full playthrough + device pass |

**Standing rituals, recorded as numbered pitfalls here:**
- **P-44 · the stale-build ghost / deploy-truth ritual:** before every Koki playtest, run
  `scripts/verify-deploy.mjs` green AND quote the deployed build hash in the gate message. A
  merge is not a deploy (P-33), and a deploy is not necessarily THE deploy.
- **P-49 · the scene-queue race:** Phaser's `scene.start()` defers to a queue drained only at
  the top of the next game step — under manual stepping it never drains. Law: no scene handoff
  from inside a step; every transition goes through the one React `handoff()` helper (deferred
  start + watchdog + fatal banner); handoff proofs run in a real browser under the FULL loop,
  never `sys.step()` alone.
(The cross-project registry tops out at P-33; these two are registered there in the same
session — numbering reconciled, gap P-34…43 noted as project-log history.)

## §9 · SUPERSESSION TABLE + truth pointers

| Doc | Status after this doc |
|---|---|
| 25 arcade bible | Movement-physics *doctrine* (study boundary, no-kill, difficulty-by-population) = reference; the Keen verb set, creature tables, and goal grammar **SUPERSEDED** |
| 26 master plan v3 | **SUPERSEDED** entirely by §8 here |
| 27 game bible | §1–§3 (Keen shape, world-map goal grammar, guardian framing) **AMENDED** — everything here is idea-mine only (§1.6, nothing inherited by default); the "Jona" name retires |
| 28 production bible | §1 CLT law, §5 Codex protocol skeleton, §8b access-map **CARRY**; §2 visual spec chain extended (EGA-16 → PIXEL_V3 → **PAINT_V1**); §6 sheet format **AMENDED → v4** |
| 29 story refoundation | **CARRIES in full** (register, cutscene, story-task, grounding laws); §2 prologue = pattern canon, its fiction superseded by §1/§6 here |
| 30 unit-magic law | §1 **CARRIES (load-bearing)**; §2.1 STYLE_PIXEL_V3 **SUPERSEDED** by §2 here; §3 modality kit = **idea-mine** (encounter surfaces designed fresh, §1.6); §6 process → §7 here |
| ART_SHOPPING_LIST v2 | Keen-era; **v3 authored with Batch Z** |
| CODEX_METHOD | **CARRIES + CP-9…CP-15 appended** |

Truth pointers: engine + PR specs = the approved plan file (M0's PR description quotes the
sequence) · study = `docs/study/rayman/` · sheets = `docs/design/g1/` (v4 template DRAFT) ·
art = `docs/art/` (commission-z lands at M1) · dashboards = Mission Control (domigo card) ·
mirror = iCloud `PLATFORM MASTER/00_BLUEPRINTS/DOMIGO_THE_PAINTED_BOOK.md`.
