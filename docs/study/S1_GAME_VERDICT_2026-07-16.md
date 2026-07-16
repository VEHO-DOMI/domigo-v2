# S1 · The Game-Lane Verdict — every surface played, judged against the vision

*Fable 5, 2026-07-16. Status: DOCUMENT (this file). The S1 session's finding of record: all four
game surfaces played personally in real Chrome at 60fps (the app preview pane freezes Phaser's
rAF loop — P-17 — so nothing here was judged through it). The vision being judged against:
Pokémon FireRed/LeafGreen overworld aliveness × Commander Keen 4 arcade kinetics, per
`docs/handover/25_arcade_design_bible.md` and `docs/handover/22_g2_overworld_design.md`, built
from the real source studies in `docs/study/keen/`. Much of what follows judges Fable-authored
work (#161/#163/#165) — hostile review applies to our own work most of all.*

**The one-paragraph verdict:** the ARCADE is the vision and the OVERWORLDS are not yet. Tintenlauf
plays like studied Keen — measured, not vibed: the fuel-jump differential, the impossible-pogo
trick, the seal→pedestal→fragment goal grammar and the death-means-tasks loop all work live, and
the level DESIGN carries it. The G2 Spill exemplars (corridor + schoolyard) are real FireRed-shaped
rooms with doors, camera, story-in-world — the bar exists — but only 2 of 15 zones meet it, and a
door from the flagship corridor drops you into a placeholder clone room. G1, live on production, is
15 re-wallpaperings of ONE template room reached from a card list — a task menu wearing a map
costume; its only alive moments are the ✦ Word-Battle and the color-return. The cross-cutting
defect class is that the world's PEOPLE and THINGS don't exist visually: every NPC in both
overworlds renders as a piece of furniture (the fallback texture), while the Codex sandbox — weaker
than ours everywhere else — shows exactly what a visible guide character does for a room.

---

## 1 · G1 — "Die verlorenen Seiten" (`/play/1`, LIVE on production)

### Matches the vision
- **The ✦ moment works.** Node → BattleStage (book skin: cream paper, drifting page scraps) →
  procedural Schluckwort → task → "ZURÜCKGEHOLT!" with the reclaimed word landing big → XP +
  post-work gloss ("(email) address — (E-Mail-)Adresse"). Played twice, two formats (typed carrier
  gap-fill; anagram letter-tiles). Wrong answers get "Noch nicht — versuch es gleich nochmal" +
  Try again — retry-first, no punishment. The teaching line renders only AFTER the work (P-7
  correct).
- **Color-return is real**: the drain veil stepped 0.44 → 0.33 on the first battle win (state-read
  mid-session); cleared nodes re-render faded. "The zone wins its color back" is not just a PR
  title.

### Misses the vision (specific, reproducible)
- **One room, fifteen wallpapers.** z01 (Zeit für die Schule), z02 (Im Zoo), z03 (Piraten) — all
  visited this session — are the SAME 15×11 box with the SAME four node cells (4,4 / 10,4 / 4,7 /
  10,7), the same top-center desk, the same border columns; only palette + one prop sprite change
  (blackboards → trees → crates). "Im Zoo" contains no animals or enclosures; "Piraten" is a brown
  room with 8 crates. Against FireRed's "every town/route looks different" doctrine this is the
  dead-box era, untouched by W-1 (`doors: 0` in every G1 zone's state).
- **The hub is a list, not a world.** `/play/1` is a card grid ("Seite 1 … Spielen →"). No
  geography, no adjacency, no discovery — zone choice is a menu tap.
- **Finn renders as a desk.** `OverworldScene.ts:335`: with no `finn_down.png` synced, the NPC
  falls back to `tex("accent2")` — the desk texture — distinguishable from the six real desks only
  by a 3px idle bob. The on-screen instruction says "sprich mit Finn". A nine-year-old cannot find
  the guide character. Live on production in all 15 zones.
- Walkability readability: the side shelf-columns are walkable floor though they read as solid
  furniture (walked through them via tap-path this session).

### Missing entirely
- Camera movement (rooms fit the viewport), doors/interconnection, hidden encounters (all four
  nodes are visible sparkles), any real art (zero images synced; `public/art/g1/` does not exist).

---

## 2 · G2 — "The Spill" school overworld (dev-only, `DEV_STORY_G2`)

### Matches the vision
- **z03 Gang is a real place**: 26×11 authored corridor, camera scrolls with the walk, lockers,
  5 open doors + 1 ink-sealed door (a blob filling the frame — bump it and the copy line explains).
  **Doors genuinely travel**: walked z03 → z06 with fade + `?from=z03` spawn. This is the W-1
  engine doing FireRed grammar.
- **Story lives IN the world**: walking the corridor's east end fired the chapter-3 scene —
  Narrator → Tarik ("The paper bat is FLYING. This is the best school year ever. EVER.") → Emma →
  Jona, with THREE embedded tasks solved in-dialogue (costume · mask · spider), each graded by the
  one brain, +10 XP, gloss post-work. The writing has real charm ("The plastic spider is afraid of
  heights and will not talk about it."). EN-first with "Auf Deutsch?" + word help on every beat.
- **z07 Schulhof sets the replication bar**: genuinely different outdoor space — grass fields with
  sway animation hiding AMBUSH battles (one fired and won this session: the ink-skin BattleStage,
  dark with dripping top edge, "DIE LEERE STELLE HAT EIN WORT GENOMMEN" — the per-campaign skin
  system working), trees, path bands, a door back into the school. The palette reads one grey step
  down — the Act-2 drain arc arriving on schedule (doc 22 §2.5).
- The hub is the three-band school board with half-erased locked rooms ("🔒 Bald!") — German-first,
  diegetic locking. Better than G1's flat list.

### Misses the vision (specific, reproducible)
- **A door from the flagship corridor opens into a clone room.** z06 "Bibliothek" (`render:null`)
  renders the generic classroom box — the SAME room as G1 z01, eleven blackboards, zero books.
  10 of 15 zones fall back this way; z01/z12/z15 have generator seeds but no authored layouts
  yet. Correctly invisible to students (no release.json) — but THE gap between "stage 1" and a
  releasable world. This is what B-2 stage 2 exists to close.
- **The implemented z03 is not doc 22's z03.** Doc 22 §3 specifies z03 = `corridor-halloween`
  (orange/black, paper bat + plastic spider props, one drained pale wall). The built corridor is
  the plain W-1 exemplar — so Tarik says "the corridor is full of Halloween decorations" while the
  world shows a clean tan corridor. Story-world dissonance in the exemplar players will see first.
- **Tarik renders as a desk** — the same accent2 fallback as G1 (the player literally converses
  with furniture next to a real desk). The 5-character cast (Berger/Emma/Tarik/Jona/Finn) has zero
  visible bodies anywhere in the world.
- The hub reads as banded CARDS, not a floor plan — the three bands are right, but rooms don't sit
  in spatial relation (doc 22 §1 sketches an actual plan; the board renders a card grid per band).

### Missing entirely
- 13 of 15 zones at the exemplar bar (11 without any layout, plus the z03 theme mismatch above) ·
  all Spill art (only the 8 detective `*_ref` portraits exist under `public/art/g2/`; no
  `g2-the-spill-art-files.json` manifest yet) · release.json (deliberate — gate holds).

---

## 3 · The arcade — Tintenlauf (`/play/2/run`, dev-only)

### Matches the vision — measured, not vibed
- **Movement IS Keen.** Measured live via the game's own pad harness: tap-jump **1.54 tiles** vs
  held **2.96 tiles** (the thrust-fuel model — release kills fuel, not speed); pogo auto-rebounce
  **3.85 tiles** hands-free (taller than any jump, forever); **hold-jump-during-bounce 5.98
  tiles** — the impossible-pogo trick, +55%, skill expressed through sustained input exactly as
  the bible specifies; ground speed **288 px/s = 6.0 tiles/s** the frame right is held, digital,
  no skid. **Ledge grab fired live** in Der Tintenschacht (state `hang` → up → scripted pull-up →
  run continued).
- **The task economy is the design, not an interruption.** Quickfire: contact freezes the world →
  one prompt, three chips; win = "Gebannt! ✶" + dizzy-star stun (the creature stays, nothing
  dies — seen live); timeout counts as a wrong tap and the run just continues (fired naturally
  this session). Variety confirmed: De→En vocab, definition→word, and a grammar
  sentence-choice quickfire in one level.
- **Die Rettungsaufgabe is the workhorse the bible promised.** Last heart → the calm dark room:
  "Der Tintengeist hält dich fest … Löse 2 Aufgaben in Ruhe — dann bringt er dich zur letzten
  Fahne zurück." Typed carrier task + chip task, solved → respawn with 2 hearts, seals and letters
  KEPT. Death #2 served a DIFFERENT word (deterministic death-count rotation — "later deaths meet
  later words" verified live). Failure recycles into practice; the loop exits upward.
- **The goal grammar lands.** Guard creatures release Tintensiegel on quickfire wins (♦ HUD ticks
  immediately); freed seals are walk-by pickups; 2/2 seals lit the pedestal; the pedestal touch
  ended the level with **"FRAGMENT GEFUNDEN — Seite 12 · „Die Bibliothekarin"** · ♦2 Siegel · ✦2
  Buchstaben · 3 Wörter · beste Serie ×3 · 685s · **2× gerettet"** — rescues counted in the stats
  without shame framing. A named page as the prize is the story goal working.
- **Level design carries Keen's doctrine**: the floor route through Der Lesesaal is safe and
  EMPTY — everything (letters, creatures, seals, secrets) lives up on the plank tiers
  (verticality quota); the spike pits punish floor-hugging; a green-tinted helper platform
  (tier-E inverse scaffolding) and a green-outlined secret alcove are both visible in play;
  Der Tintenschacht (tier M) ramps creature density (9 vs 7) and its hazard gauntlet took three
  hearts in one stretch — population-as-difficulty, not stat scaling.

### Misses the vision (specific, reproducible)
- **The look-up/look-down verb pair doesn't work in play.** Look-up is dead code:
  `ArcadeScene.ts:743` defines `jumpDown = space || upDown || pad.jump`, then `:866` gates look-up
  on `upDown && !jumpDown` — a contradiction; the branch can never fire. Look-down also failed
  live (idle, grounded, held 900ms > the 350ms delay → `lookDir` stayed 0). The bible's "scout
  before you commit" §2.6 camera verbs — which the level grammar's no-blind-drops law (§4.2.3)
  leans on — are effectively absent. Fix is an input-intent refactor (a fresh-press edge flag),
  small but load-bearing.
- **A silent pause state.** The overworld's pause-on-blur (A1-2) halts the sim with NO on-screen
  indication (observed repeatedly: a tab that is visible-but-not-active shows a live-looking,
  frozen game). A classroom kid who tab-switches comes back to a game that ignores taps with no
  explanation. One overlay line ("Pausiert — tipp zum Weiterspielen") closes it. (Arcade has no
  blur handling at all — a different, lesser gap.)
- Quickfire timing under real classroom conditions is untested: 6s (tier E) was generous for a
  scripted click and is probably right, but nothing this session validates 4s (tier S) for
  9-year-olds reading on a tablet.

### Missing entirely (all known, none surprising)
- K-4 boss duel (bible §5.4 — design-only) · modality ③ corridor-burst and ④ world-hub
  integration (arcade is reachable only by URL; no zone set-piece entrance) · creature waves 2–3
  (Lauerer, Klecklein, Panzerklecks, Spiegelklecks, Deckenzunge) · all arcade art (procedural
  placeholders; §9 slots empty) · meta-economy surface (points ladder + "Bonus bei X" HUD
  threshold; letters→Lernkarte exchange) · production release (correctly gated).

### Honesty — what this session did NOT verify in the arcade
Der Tintenschacht completion (2/3 seals reached in scripted play; the vertical maze demands
sighted route-reading my blind driver lacks — the mechanics were all proven on Der Lesesaal's full
run) · drop-through live (unit-tested; my one live attempt sampled mid-air) · Wortdieb letter
THEFT (never held letters at a timeout) · Sprungkissen ride · Schattenwolke bolt (K-3's PR
also never eyeballed it) · touch controls on-device · durable persistence (dummy local DB).

---

## 4 · The Codex comparison sandbox (`~/Code/domigo-v2-codex-rpg`, played read-only)

Played its full calibration path: Buchhalle → Schulhof (fountain) → "Die Schule betreten · E /
Leertaste" → Hauptgang → Klassenzimmer → Frau Berger → pencil task (wrong "pen" → "Noch nicht";
right "pencil" → queued).

**What it does better than our build (salvage as written patterns — its code is never merged):**
1. **NPCs are people.** Frau Berger is a real human sprite with a "…" talk indicator over her
   head — findable across the room in one glance. This is the exact inverse of our Finn/Tarik-as-
   desk defect, and the single most valuable thing in the sandbox.
2. **Contextual action prompts.** "Die Schule betreten · E / Leertaste" appears only within reach
   and NAMES the destination. Our doors are silent until bumped.
3. **Honest state chrome.** "Database branch pending · local calibration mode" · "Lokal
   vorgemerkt" · "Antwort vorgemerkt" — the player always knows what their progress means.
   (Also: per-tab preview identities Fresh/Midway/Complete — a good teacher-preview idiom, which
   our WS-AUTH B preview partially covers already.)

**Where it falls short of even our current state:** its rooms are emptier than ours (one shelf
wall in a cream void; a fountain on a bare lawn; a corridor with two doors and nothing else — its
own review doc pre-diagnosed "rooms feel too empty"); the win beat dead-ends in an offline queue
("Der Weg öffnet sich erst nach der Serverbestätigung" — the Neon branch its data gate needed was
never available, so progression, XP and rewards never fire); there are no battles, no arcade, no
story scenes — it is an opening-walk shell; and its own gate ledger honestly reports isolation/
data BLOCKED and the visual pass never performed.

**Recommendation — answering `DOMIGO_FABLE_REVIEW.md`'s Continue / Amend / Recalibrate:**
**Amend-and-close.** Within its own frame the verdict is "Amend" (movement, camera and prompts are
right; the rooms are too empty to calibrate a visual language against). But the operating model
(2026-07-16, prototype-first + full Codex separation) supersedes the question: no further Codex
iterations on this sandbox — the three patterns above enter our engine as specs (they are written
into the master plan §"absorbed patterns"), the branch is archive-tagged and dismantled in S2, and
Codex's lane narrows to images + outside reviews from its own lab. Codex code is not merged; its
ideas are.

---

## 5 · The defect classes this verdict feeds into the plan

1. **The world has no people or things** (every NPC = furniture fallback; zero art anywhere in
   any engine surface) → the ART PROGRAM is not polish, it is the missing half of the vision.
   NPC visibility gets an engine-side interim too: a procedural person-silhouette + "…" indicator
   as the no-art fallback (Codex pattern), so the fix doesn't wait on generation waves.
2. **One room ≠ one world** (G1's template rooms; the Spill's 10 null zones) → replication to the
   z07 bar is the volume lane; G1's world-grammar retrofit is a scheduled decision, not a drift.
3. **Camera/scout verbs broken in the arcade** (look-up dead code, look-down inert) → one focused
   input-intent fix PR before K-4 builds on the same input layer.
4. **Silent pause** → one overlay line; UX-priority because it looks like a crash to a child.
5. **Story-world dissonance in exemplars** (Halloween scene in a plain corridor) → stage-2 zone
   authoring must build doc 22's THEMES, not just more layouts.

*Play evidence: session log (scratchpad play-log; measurements, event traces, and every claim
above traceable to a live observation dated 2026-07-16). Environment: dev server on main
@71b72dd, real Chrome, dummy local DB.*
