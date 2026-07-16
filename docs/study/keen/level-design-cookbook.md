# The Level-Design Cookbook — authoring rules for the 15 chapters

*Fable 5, 2026-07-16 (study round 2, commissioned by Koki: keendreams/keen source + KeenWiki
Keen 4 Levels/game pages + the Lohner modding tutorial). Status: DOCUMENT — this file is the
LEVEL-DESIGN HALF of every W3 wave brief (master plan 26): waves author levels FROM these rules,
and the rules cite their corpus evidence. Sources: `keen4-level-corpus.md` ·
`keen4-systems-modding.md` · `keendreams-source.md` (all in this directory; provenance law
holds — behavior and numbers only, zero code copied). Spot-verified: Boobus 12 HP
(kd_act2.c:1344), the 12-bomb gate (kd_keen.c:976–989), charge/align-jump brain (BoobusThink) —
read first-hand.*

**Unit key:** Keen tiles are 16px with a ~20×12.5-tile screen; ours are 48px with a 15×11-tile
viewport. The transferable metric is SCREENS, not tiles. Where Keen tics appear (70/s), our
60fps ms-equivalents are given.

---

## §1 · Size and shape (the corpus rule my ch01 broke)

Keen 4 levels run **3–8 screens wide and 2.5–10 screens tall** (median area ≈ 9,400 tiles ≈
38 screens; smallest real level = Perilous Pit at 60×84 ≈ 3×6.7 screens). **Our ch01 (48×16 =
3.2×1.5 screens) sits at the corpus MINIMUM in width and BELOW it in height** — acceptable for
the slice's proof, too small as the wave template.

**Rules:**
1. Chapter levels are **4–7 screens in their long axis, 2–4 in the short** (our tiles: wide
   levels 60–105 cols × 22–33 rows; tall levels 30–45 cols × 33–55 rows). Area target 12–25
   screens. Early chapters at the small end, mid-campaign at the large end, late chapters
   standardize (~5×4) as mechanics stack (corpus grammar #1).
2. **Aspect ratio = archetype**, and the campaign never repeats a shape twice in a row
   (corpus #2): horizontal runs ≥3:1, vertical shafts ~1:1.5-inverted, dungeon boxes ~square.
3. Keep a **2-tile authored border** inside every edge (the modding tutorial's glitch rule —
   ours renders fine but the border doubles as camera-slack).

## §2 · The seal loop IS the level (Keen's gem loop)

In Keen 4, 1–4 colored gems structure nearly every non-trivial level: the gem is placed so the
DETOUR TOURS THE CONTENT, and its door converts the loop into progress (corpus #3). Our
Tintensiegel already unseal the boss door — the cookbook rule is the placement grammar:

4. Each seal sits at the END of a distinct wing (up a shaft, across a hazard run, inside an
   interior) so collecting 2–3 seals = touring 2–3 designed set-pieces. Never two seals on one
   path. A guarded seal's guard IS that wing's signature encounter.
5. **Goal ≠ exit** (corpus #4): the boss door sits one beat PAST the last wing's challenge,
   and the duel is followed by decompression (our restoration beat already provides it).

## §3 · Population: sparse, signature, themed

Keen's density is startlingly low: **≤1 enemy per screen** is the norm (Perilous Pit: ~5 actors
in 20 screens); levels are remembered by ONE signature monster; terrain kills more than
creatures (corpus #5–7).

6. **Density: 0.75–1.25 creatures per screen** at tier E (M/S add per the tier system —
   Keen's own hard mode adds SPECIES, not just counts; corpus #15).
7. **One signature sending per chapter** (bible §3's rule, now corpus-backed): a themed
   variant with one behavior twist, placed 2–4 times as the level's motif. Everything else is
   shared background fauna.
8. **One themed hazard family per chapter** (acid≈ink pools, spikes, tar≈sticky ink, fire≈red
   marks): the hazard carries the danger; creatures carry the language.
9. The corpus's THREE-BEAT enemies are the pattern for signature sendings — Tater Trooper:
   **12-tic tell (+sound) → 20-tic deadly frame → 8-tic safe recover** (≈170ms → 290ms → safe,
   body harmless outside the lunge; keendreams §3). Broccolash and Squasher repeat the shape.
   Author signature sendings on this grammar: telegraphed, briefly dangerous, generously safe.
10. **Harmless pressure exists** (Carrot Courier shoves, never harms; the Cart is a rideable
    crusher): 1–2 shover/rideable actors per mid+ chapter add pressure with zero damage —
    exactly our no-kill doctrine's texture (keendreams §3, idea #5).

## §4 · Collectibles: the golden path is lean; wealth lives off it

Corpus #9–10: points cluster in enterable interiors, optional wings and secret pockets; bonus
mass varies 10× between levels; the biggest treasures are hidden LIVES, never required items.
"Most areas are optional" — the main path is the minority of a Keen level (corpus surprise #1).

11. **Letters** line the golden path (breadcrumbs) + cluster in 2–3 off-path pockets. A
    letter-rich chapter is an identity choice, not a default.
12. **Glühwörter (2–4) follow the secret conventions** (corpus #11 — hidden AND fairly
    hinted): (a) a flashing/shimmering wall gap, (b) a pogo-height ceiling pocket, (c) a
    just-past-where-the-camera-seems-to-stop passage, (d) **an enemy's motion arc pointing
    into the spot** (the Perilous Pit Mad-Mushroom trick — our Hüpfer arcs can do this).
    Every Glühwort's hint must be nameable in the PR (the fair-hint law); reachability is
    already machine-checked (the corpus's 128 shipped-unreachable items vindicate our
    validator — corpus surprise #2).
13. **One optional wing per mid+ chapter**: a whole skippable area that pays in letters +
    one Glühwort. Exploration is the reward economy, not the requirement.

## §5 · The boss staging (Keen Dreams, verified in source)

14. Our seal→boss-door→duel grammar is corpus-true (gems→doors; the CM one beat past the
    last lock). Keep duels SHORT: Boobus = 12 hits only because bombs are scarce; our 4
    knots ≈ right (each knot is a full production task).
15. **The escrow law** (keendreams §5, verified): resources bank on surviving; duel defeat
    never reduces banked resources below the entry state. Ours already complies (Glühwörter
    bank at run end; rescue keeps loot) — now it's a law, not an accident: **no future
    mechanic may make a duel retry poorer than its first attempt.**
16. **A second duel archetype exists for the waves**: Boobus's whole brain is positional —
    charge on your floor; when column-aligned on different floors, drop-through or jump
    (−60) to yours; ledge-leap at xdir×24 (BoobusThink/GroundReact, verified). A multi-floor
    ARENA-CHASE duel (dodge by changing floors; windows open when he lands) is a legitimate
    guardian variant alongside the lane duel — GM-V2b's script table should allow
    `archetype: "lanes" | "arena"` when generalizing. Not a slice change.
17. **Stun duration as the S-tier dial** (keendreams §1): Keen Dreams' ONLY difficulty knob
    is flower time (10s/5s/2.5s). Option for GM-C3: tier-S un-stuns creatures after a timer
    (resuming their exact behavior); E/M stay permanent. One knob, real pressure.

## §6 · Story integration (Keen 4's devices, re-keyed)

18. **Entry sentences with vivid verbs** — "Keen *slips into* Slug Village", "Keen *blazes
    across* the Isle of Fire" (systems §3): every chapter's map→level transition shows ONE
    English sentence with a chapter-specific motion verb (slip/climb/creep/dash/tiptoe…) —
    a free, systematic verb-teaching surface. Add to the beat copy at wave time (content-only).
19. **Cross-level hints in friendly mouths** (Lindsey's two hints are optional-level rewards
    that state other levels' secrets — corpus #12): Jona's notes and cameo NPCs may hint at
    OTHER chapters' Glühwörter ("Im Zoo glüht etwas hinter dem Wasserfall…") — reading
    comprehension literally becomes the treasure map. Wave-time texture.
20. **One joke is load-bearing** (the Janitor: the hardest level's prize is a gag; Keen moons
    the player behind a moon easter-egg): every ACT gets one authored joke or easter egg.
    Kids replay for humor (corpus surprise #4).

## §7 · The per-chapter archetype table (binding start-points for W3 briefs)

| ch | archetype | shape | signature motif (hazard · set-piece) |
|---|---|---|---|
| 02 Im Zoo | horizontal habitat run | ~90×24 | enclosure interiors as point-rooms · escaped-animal Hüpfer variants |
| 03 Piraten | ship + cove vertical | ~45×40 | rigging climbs (masts = shafts) · water pools · the no-X map room |
| 04 Gefühle | switch-box dungeon | ~60×33 | Robo's mood machines flip platforms (feelings = states) |
| 05 Band | rhythm horizontal | ~95×22 | Sprungkissen bounce-lines on the beat · sound-pipe hazards |
| 06 Detektiv | dark maze box | ~55×35 | clue pockets (optional wings) · Mimrock-style fake props |
| 07 Nudeln | kitchen conveyors | ~85×26 | dough pits (tar grammar) · rolling carts (rideable crusher) |
| 08 Kleidung | washing-line traverse | ~90×24 | rope-lines as one-ways · falling laundry telegraphs |
| 09 Tiere | burrow warren (down) | ~40×48 | soft-drop shafts · budgeted spawner nests (Pea-Pod grammar, max 4) |
| 10 Geschäft | shelf tower (up) | ~35×50 | shelf climbs · Treasure-Eater-style thief motif (steals letters!) |
| 11 Uhrzeit | timed platforms | ~60×33 | Miragia grammar: platforms fade on a readable clock cycle |
| 12 Geburtstag | bonus banquet | ~80×26 | the celebration level: letter-rich, gentle, one big secret (corpus: bonus-mass as identity) |
| 13 Hilfe! | the gauntlet | ~100×22 | Isle-of-Fire grammar: safe slow low path vs risky fast high path · sirens telegraph |
| 14 Lieblings- | showcase traverse | ~90×26 | color-return set-pieces mid-level · every earlier motif cameos once |
| 15 Finale | multi-floor arena approach | ~45×40 | quiet climb (sparse, no letters — the Well-of-Wishes hush) → the rescue duel |

(Ch01 was rebuilt to 72×24 in the calibration round of 2026-07-16 — the §1 deviation is
CLOSED; ch01 is now the shape exemplar the archetypes above replicate from.)

## §7b · The v2.2 verb vocabulary (from Koki's slice verdict + the visual map study)

The calibration round (2026-07-16) added the structural devices the Keen 4 maps use, and
they are now REQUIRED vocabulary — a chapter that is one connected outdoor strip is
under-built. Glyphs/fields: `|` pole · `1`–`4` door pairs (exactly two cells each) ·
`header.movers` (anchor-to-anchor patrol platforms) · `header.goalDe` (the goal card text).

1. **Sub-rooms on one canvas** (Border Village grammar): box off interior rooms in unused
   sky, link them with door pairs. Doors are the SEAL WINGS of §2 — one wing, one door,
   one guard. Walk-in: stand + fresh ↑. Pair gems are color-coded by id so kids can read
   which two doors connect.
2. **Poles** (Perilous Pit switchboard): climb up slow, SLIDE down fast, jump-key hops off.
   Authoring law: a ledge served by a pole sits AT or ≤1 row above the pole's top cell —
   the top-out pop clears ~2 tiles (`poleTopVy`), never more. A pole may thread a `=`
   hatch: top out THROUGH it (one-ways pass from below).
3. **Movers**: 1–2 per chapter, each with a JOB (a lift crossing a fall-recovery shaft; a
   ferry to a seal island). Period ≥ 2.6s so the ride is readable. The laws treat both
   anchor tops as standable and the ride as an edge — collectibles go on anchor LINES,
   never mid-path (BFS can't see a moving floor).
4. **Facade-as-level** (Pyramid of the Moons): the chapter's building exterior is terrain —
   terraced steps up the face, the roof as a deck, interiors behind doors.
5. **Rolling ground**: the verticality law (≥4 elevation changes/screen) is checked
   machine-side; author mounds/dips/steps, never a flat run.
6. **Goal communication (Koki's law: "take the student by the hand")**: every level SAYS
   its goal — `goalDe` names the wings in student German ("eines im Klassenzimmer, eines
   auf dem Dachboden"); the objective chip counts seals then flips to →Zur Tür; once the
   door unseals, an edge arrow points to it whenever it's off-screen. A student who stops
   knowing what to do next is an authoring bug, not a player failure.

## §8 · The wave checklist (append to every W3 brief)

- [ ] Size/shape per §7; shape differs from the previous chapter
- [ ] §7b vocabulary used with intent: ≥1 door-pair wing · ≥1 pole with a job · movers
      only where they have one · `goalDe` names the wings in student German
- [ ] `checkLevelLaws` green (reachability incl. Glühwörter — machine-checked)
- [ ] Seals: one per designed wing; no shared paths (§2)
- [ ] Density 0.75–1.25/screen tier E; ONE signature sending on the three-beat grammar (§3)
- [ ] One themed hazard family; terrain > creatures as the killer (§3)
- [ ] Glühwörter: 2–4, each with a nameable fair hint (§4)
- [ ] One optional wing (mid+ chapters) (§4)
- [ ] Boss door one beat past the last wing; duel ≤5 knots (§5)
- [ ] Entry sentence with the chapter's motion verb (§6)
- [ ] The act's joke budget spent somewhere (§6, once per act)
- [ ] Machine playtest + honest NOT-verified list (standing law)
