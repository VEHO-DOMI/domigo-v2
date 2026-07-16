# Keen 4 Level-Design Corpus (KeenWiki study, 2026-07-16)

Source base: https://keenwiki.shikadi.net/wiki/Keen_4_Levels (index) + individual level pages
`https://keenwiki.shikadi.net/wiki/<Level_Name>` + https://keenwiki.shikadi.net/wiki/Council_Member.
Purpose: calibration corpus for authoring 15 Keen-shaped platformer levels (48px tiles, ~40–64 tiles wide so far).

**Unit conversion for calibration.** Keen tiles are 16px; the viewport is 320×200 ≈ **20×12.5 tiles per screen**.
So a "screen" is the portable unit: Keen levels run ~3–8 screens wide and ~2.5–10 screens tall.
At 48px tiles with a ~20-tile-wide viewport, a 40–64-tile-wide level is only 2–3 screens wide —
that equals Keen's *smallest* level (Perilous Pit, 60w) and is well under its median.

---

## 1. Full level table

Required = contains one of the 8 Council Members (per the Council_Member page); everything else is optional unless noted. Sizes in tiles W×H from each level page's infobox (the index has none).

| # | Level | Size (tiles) | Status | One-line character |
|---|-------|--------------|--------|--------------------|
| — | Shadowlands | overhead map | world map | Hub connecting all levels |
| 1 | Border Village | 112×63 | Optional (tutorial) | Horizontal village, 4 stone houses + cave shrine w/ acid pools; 7 hidden 1UPs; 8,600 pts |
| 2 | Slug Village | 146×44 | Optional | "Pretty straight-forward" horizontal tunnel run; slugs only; 33,800 pts |
| 3 | The Perilous Pit | 60×84 | **Required (CM)** | Vertical pit; red-gem → switch platform → blue-gem chain; sparse enemies; 18,100 pts |
| 4 | Cave of the Descendents | 165×80 | **Required (CM)** | Sprawling winding-tunnel maze, red+yellow gems, spikes & shovels; 81,900 pts |
| 5 | Chasm of Chills | 120×102 | Optional | Huge vertical chasm; exit reachable directly, "most areas optional"; Lindsey hint #2; 57,100 pts |
| 6 | Crystalus | 80×124 | **Required (CM)** | Vertical crystal tower; 4 sequential gem doors (green→yellow→red→blue); 89,100 pts |
| 7 | Hillville | 150×44 | Optional | Horizontal grassland; fire + switch platform; Lindsey hint #1 (wetsuit); flashing invisible-brick secrets; 33,100 pts |
| 8 | Sand Yego | not stated ("Unknown" in infobox) | Optional | Two-tower desert fortress + tunnels; green gem; flashing-brick 1UP secret; 56,900 pts |
| 9 | Miragia | 84×75 | Optional but **de facto required — holds the Wetsuit** | City that fades in/out on the map AND fading crystal platforms inside; up-down-up path; 54,500 pts |
| 10 | Lifewater Oasis | 58×93 | **Required (CM)** | Vertical branching oasis; green gem; famously 128 unreachable items / 5 unreachable flasks; 21,100 pts, 0 ammo |
| 11 | Pyramid of the Moons | 100×100 | Optional — **gateway to secret level** | Three vertical zones linked by 6 poles + doors; yellow gem; 12-Inchworm secret unlocks Forbidden; 63,500 pts, 0 ammo |
| 12 | Pyramid of Shadows | 100×99 | **Required (CM)** | Pyramid maze → spike cave → tar pit; switch-bridge maze objective; 8 extra lives; hard; 33,000 pts |
| 13 | Pyramid of the Gnosticene Ancients | 100×112 | **Required (CM)** | Three descending areas; Treasure Eaters steal items; moving-platform finale over tar; 21,800 pts |
| 14 | Pyramid of the Forbidden | 100×90 | **SECRET** | Symmetric 3-down/3-up descent-ascent; hardest level in the game; "CM" is the janitor (joke); 77,300 pts |
| 15 | Isle of Tar | 112×92 | Optional | Houses + tar caves; 3 gems; 11 tar pits total; 95 drops; 28,800 pts |
| 16 | Isle of Fire | 114×46 | **Required (CM)** | Horizontal fire gauntlet; unstunnable Berkeloids; safe low path vs risky platform path; 38,000 pts |
| 17 | Well of Wishes | 100×100 | **Required (CM)** | The only underwater level; dead-end maze; Dopefish guards the CM; 20,600 pts, 0 ammo |
| 18 | Bean-with-Bacon Megarocket | 24×17 | Utility | Keen's ship; re-enterable; hands out a Neural Stunner if you're low on ammo; 0 pts |
| 19 | High Scores | — | Inaccessible | Playable high-score screen, can't be warped to normally |

The 8 Council-Member levels (Council_Member page): Perilous Pit, Cave of the Descendents, Crystalus, Lifewater Oasis, Pyramid of Shadows, Pyramid of the Gnosticene Ancients, Isle of Fire, Well of Wishes. In all but Isle of Fire the Member sits "behind a stone gateway with a green gem on its top"; one is "banished underwater."

---

## 2. Per-level mini-briefs (the 8 deep dives)

### Border Village (L1, 112×63) — the tutorial [wiki/Border_Village]
- **Archetype:** horizontal run with vertical dips (village surface → cave shrine → back up via pole).
- **Enemies:** Poison Slugs (2+), Bounders; **Licks on Hard only** — difficulty adds species, not just counts.
- **Items:** 8,600 pts clustered *inside the four houses* (4 sodas in house 1, stunners + points in house 2, etc.) — interiors are the reward pockets; entrance collectibles need pogo jumps (teaches pogo).
- **Secrets:** pogo up from a precise spot beside the acid pool into a wall passage → chamber with **7 Lifewater Flasks** on a sinking platform ("get out quickly"). Biggest prize in the level is hidden lives.
- **Goal/exit:** no Council Member; EXIT door labeled in Standard Galactic Alphabet at far side.
- **Tricks:** poles down/up, acid-pool jumps, house-interior exploration.
- **Difficulty:** "very straightforward"; acid "a little tricky, but not too tough"; the secret needs advanced pogo — skill-scaled reward inside the easiest level.

### The Perilous Pit (L3, 60×84) — the vertical one [wiki/The_Perilous_Pit]
- **Archetype:** vertical shaft with two lower wings + one upper wing; the level IS a gem loop: descend → red gem (lower right) → red door (lower left) → switch → moving platform → upper-left hill → blue gem → blue-door CM cave.
- **Enemies:** "sparsely populated": 1 Mad Mushroom, 1 Lick, 1 Poison Slug, 1 Bounder, some Sleeping Slugs — ~5 actors in a 60×84 level.
- **Items:** 22 candy items + **53 raindrops** scattered along the walls of the shaft; 2 Lifewater Flasks.
- **Secrets:** pocket above the Mad Mushroom next to the switch — **the Mushroom's own bounce arc points into it**; contains 2 flasks (net +1 life).
- **Goal:** Council Member in a small cave at the top-left, behind the blue gem door — the *last* lock in the chain.
- **Tricks:** gem-lock progression, switch-activated moving platform.

### Miragia (L9, 84×75) — the gimmick level [wiki/Miragia]
- **Archetype:** vertical zig-zag ("up, down, and then up again") through a series of domes; optional branches hold the points.
- **Gimmick, fully committed:** the city "constantly disappears and reappears" on the world map (you must wait to enter), and inside, **crystal platforms fade in and out** — the map gimmick and the level gimmick are the same idea.
- **Enemies:** Poison Slugs, Mad Mushrooms, Skypests, Wormouths (no counts) — pressure is light; the timing puzzle is the challenge.
- **Items:** 54,500 pts (64 sodas, etc.); optional areas hold "many point items"; flask hidden in the lower-right corner, reached from the *top*-right.
- **Goal:** no Council Member — the prize is the **Wetsuit**, the key item for Three-Tooth Lake / Well of Wishes. A plot item lives in an "optional" level, and Princess Lindsey in Hillville tells you exactly where.

### Lifewater Oasis (L10, 58×93) — mid-game standard [wiki/Lifewater_Oasis]
- **Archetype:** vertical with branching: tunnels of raindrops → floating platforms up a mound → stone door down into the CM chamber; a hidden lower tunnel forms a secret loop back to the main path.
- **Enemies:** Poison Slugs (bulk), couple of Wormouths, couple of Mimrocks (+1 hidden), 1 Thundercloud. **0 ammo in the level** — avoidance play forced.
- **Items:** 21,100 pts, concentrated in the final chamber area (8 Jawbreakers there); **5 flasks + 49 drops permanently unreachable** — a shipped design flaw the wiki documents.
- **Secrets:** hidden passage on the first ledge → lower tunnel; a switch-platform returns you through *another* hidden passage — secrets loop, they don't dead-end.
- **Goal:** CM in a cave behind a **green gem** stone door atop the mound; exit run uses moving + falling platforms (one-way descent).
- **Difficulty:** "quite simple" on the main path; complexity is opt-in via the hidden areas.

### Pyramid of the Moons (L11, 100×100) — hub-and-secret level [wiki/Pyramid_of_the_Moons]
- **Archetype:** three stacked zones (open upper, starting middle corridor, optional lower) wired together by **six poles**: poles 1/3/4/6 go to small point-corridors, the other two go to doors (one down, one up). A pole-switchboard level.
- **Enemies:** Licks, few Poison Slugs, 1 Arachnut, Knife Shooters "in quite deadly places", plus 12 collectible Inchworms. **0 ammo.**
- **Items:** 63,500 pts (98 candy items) spread through upper + corridor zones; the whole lower area is an optional point bank.
- **Secrets (3):** (a) stand on a moon-symbol tile a few seconds → Keen moons the player (pure easter egg); (b) pogo to a ceiling-hidden pole → 1UP + ice-cream chamber; (c) **collect all 12 Inchworms** (yellow door + bridge switch unites them) → unlocks **Pyramid of the Forbidden**. The secret-level key is a collection quest, hinted by an NPC in a *different* level (Chasm of Chills).
- **Goal:** no CM — yellow gem via moving platform in the upper area, then exit door to the right; a secondary exit exists outside the pyramid.

### Pyramid of the Gnosticene Ancients (L13, 100×112) — large/late [wiki/Pyramid_of_the_Gnosticene_Ancients]
- **Archetype:** branching descent through 3 areas: platform/tunnel upper area (moving platforms + bridge switches) → enclosed tar-pit room with the stone door → underground big tar pit → CM jail.
- **Enemies:** Poison Slugs, Skypests, Licks, Knife Shooters, moving shovels, **4 Treasure Eaters** (3 main, 1 enclosed) — a thief enemy that eats your collectibles unless stunned instantly.
- **Items:** 21,800 pts across 68 drops; 4 Lifewater Flasks — one behind a moving-platform-only side passage in the first tar pit, one **impossible to collect in v1.2/1.4** (version regression).
- **Secrets:** the tar-pit-platform side passage; flask above a dart gun (the version-broken one).
- **Goal:** CM "trapped" in an underground jail past the second tar pit; the finale is jumping "from the moving platform to land platforms back and forth" — a pure execution test placed *after* all the puzzle-solving.
- **Tricks:** red gem (area 1) + green gem (area 3), multiple bridge switches gating area transitions.

### Pyramid of the Forbidden (L14, 100×90) — the secret level [wiki/Pyramid_of_the_Forbidden]
- **Access:** "only through the Pyramid of the Moons" (12 Inchworms).
- **Archetype:** symmetric V: "down through three sections, and then up again through three more sections," with a big tar pit at the bottom.
- **Enemies:** Poison Slugs, Licks, Skypests, 1 Mad Mushroom, Knife Shooters, moving shovels — the pyramid hazard set at max density.
- **Items:** **77,300 pts** (second-highest in the game) + 94 drops — the secret level pays in points; only 2 flasks, both in the open.
- **Oddity:** two red gems and two red doors (levels normally have one of each).
- **Goal/exit:** the caged figure is **the janitor, not a Council Member** — the reward is a joke; and the level "does not end" there: you must leave via a **flying Foot** (exit-taxi).
- **Difficulty:** "the hardest of the Pyramids… possibly the most difficult level in the game" — the secret level is the skill ceiling.

### Well of Wishes (L17, 100×100) — the water level [wiki/Well_of_Wishes]
- **Access:** swim into Three-Tooth Lake with the Wetsuit (from Miragia).
- **Archetype:** fully underwater "huge underwater maze of tunnels, with most of them leading to dead-ends, some containing point items."
- **Mechanics swap:** no jump, no pogo, **Neural Stunner inoperative**; tap jump to gain swim speed — an entire control-scheme replacement for one level.
- **Enemies:** **Dopefish ×1 (×2 on harder difficulty)** guarding the CM cave; Sprites, Schoolfish, exploding Underwater Mines.
- **Items:** 20,600 pts, all candy — "there are no drops to be collected" underwater; 1 flask near the start.
- **Goal:** Council Member in the final cave past a stone door frame, *behind* the Dopefish — the game's most famous guard-the-goal setup; "passing through can be a big challenge" with two.

---

## 3. Extracted design grammar (synthesis)

1. **Sizes by position — think in screens (20×12.5 tiles).** Early: shallow and small (112×63, 146×44, 60×84 ≈ 3–7 screens wide, 2–5 tall). Mid: the sprawl peak (165×80, 120×102, 80×124). Late: standardized ~100×100 pyramid "boxes" and slimmer islands (114×46). Total area band ≈ 5,000–13,200 tiles, median ≈ 9,400. A 40–64-tile-wide level at 48px is 2–3 screens wide — Keen's minimum; to feel Keen-shaped, either go longer or (cheaper) go *taller*.
2. **Aspect ratio = archetype.** Dedicated horizontals are ≥3:1 (146×44, 150×44, 114×46); verticals invert to ~1:1.5 (60×84, 80×124, 58×93); "dungeon boxes" (pyramids, Well) are square. The required chain never repeats a shape twice in a row — village → pit → cave-maze → tower → oasis → pyramids → fire run → water maze.
3. **The gem loop is the level.** Nearly every non-trivial level is structured as fetch-loops around 1–4 colored gem doors (Perilous Pit red→blue; Crystalus a full green→yellow→red→blue chain; Cave of the Descendents red+yellow; Isle of Tar 3 gems). The gem is always placed so the detour tours the level's content; the door then converts the loop into forward progress.
4. **Goal ≠ exit.** The Council Member sits in a terminal cave behind a stone gateway, one beat *past* the level's hardest challenge (Dopefish, tar-pit platform finale) — and after the rescue you still travel to a separate exit (Forbidden literalizes it: the level "does not end" at the cage; ride the flying Foot out). Climax, then decompression outro.
5. **Enemy density is startlingly low:** ~4–6 species per level, often single-digit total actors (Perilous Pit: ~5 enemies in a 5×7-screen level, labeled "sparsely populated"). Threat comes from *placement* (Knife Shooters "in quite deadly places"), not crowds. Roughly ≤1 enemy per screen is the observed norm.
6. **One signature threat per level:** Berkeloid (Isle of Fire, unstunnable), Dopefish (Well), Treasure Eaters (Gnosticene), Arachnut (Moons), Thundercloud (Lifewater/Hillville area). The rest of the roster is the shared background fauna (slugs, licks, skypests). Levels are remembered by their one monster.
7. **Terrain is the real killer.** Each level owns one environmental hazard: acid pools (villages), spikes+shovels (caves), tar pits (isles/pyramids — Isle of Tar has 11 of them), fire + thrusters (Isle of Fire), mines/drowning (Well). The danger budget is mostly terrain, and hazards are themed to the biome.
8. **Ammo is a difficulty dial.** Levels where the intended play is avoidance ship with **zero ammo** (Lifewater Oasis, Pyramid of the Moons, Well of Wishes); generous levels ship 7–10 stunners. The ship level even hands out a pity stunner only "if you are low on ammo."
9. **Item-cluster logic:** the golden path is lean; points cluster in (a) enterable interiors (Border Village's houses), (b) whole optional wings (Moons' lower zone; Chasm of Chills, where "most areas are optional" and the exit is reachable almost directly), (c) secret pockets. Bonus mass varies 10× between levels (8.6k → 89.1k points) — bonus-richness is itself a level identity, and optional levels carry disproportionate loot (Crystalus 89.1k, Chasm 57.1k).
10. **The drop economy mints lives:** mid/late levels scatter 50–120 tiny drops (100 = 1UP; Chasm's 116 drops = more than one life), while multi-flask jackpots (Border Village: 7 flasks; Pyramid of Shadows: 6) hide exclusively in secrets. The biggest treasure in the game is always a hidden extra life, never a required item.
11. **Secret conventions — hidden AND fairly hinted, three recurring mechanisms:** (a) invisible bricks that *flash intermittently* (Hillville, Sand Yego); (b) pogo-height gaps in walls/ceilings at marked-ish spots (Border Village acid-pool wall, Moons' ceiling pole, Cave of the Descendents' mid-air door); (c) just-offscreen passages a step past where the camera seems to stop (Chasm's below-exit room, Pyramid of Shadows' under-platform tunnel). Plus the best hint of all: **an enemy's motion path points into the secret** (Perilous Pit's Mad Mushroom jumps into it).
12. **Cross-level hint economy:** Princess Lindsey, an NPC found in two *optional* levels, hands out the two biggest secrets (Hillville: "gear to help you swim… hidden in Miragia"; Chasm of Chills: how to reach Pyramid of the Forbidden). Visiting optional content is paid in knowledge about other levels — the map is a web, not a checklist.
13. **The secret level is a quest, not a hole:** unlock = collection task inside another level (12 Inchworms + bridge switch in Moons), reward = the game's hardest level, top-tier points, and a *joke* goal (the janitor). Secret = prestige content.
14. **Optional vs required:** exactly 8 of 17 action levels are required (the CM levels — Council_Member page) plus Miragia de facto (wetsuit) and Moons as the secret gateway. Optional levels skew simple-horizontal (Slug Village, Hillville) or bonus-box (Chasm); required levels are where the mechanical density (gem chains, switch bridges, moving platforms, signature enemies) lives.
15. **Difficulty ramp = mechanic stacking, and difficulty select edits the roster:** L1 is a walkable tutorial whose only hard content is optional (the pogo secret). Then: gems (L3) → mazes (L4) → gem chains + moving platforms (L6) → timing/fading platforms (L9) → thief enemies + platform finales (L13) → unstunnable enemy (L16) → control-scheme swap + guard boss (L17). Harder difficulty settings add *species* (Licks appear in Border Village only on Hard; a second Dopefish appears in the Well), not just numbers.

---

## 4. What surprised me vs. textbook platformer wisdom

1. **The main path is the minority of the level.** Modern design puts most content on the golden path with optional garnish; Keen 4 inverts it — in Chasm of Chills "most areas are optional," Moons' entire lower zone is skippable, and half the *map* (9 of 17 levels) is skippable. Levels are built as explorable places that happen to contain a route.
2. **Shipped-broken collectibles were tolerated.** Lifewater Oasis has 128 unreachable items and 5 unreachable flasks; Cave of the Descendents and Gnosticene (v1.2+) have more. 100% completion wasn't a design value in 1991 — and the wiki's meticulous cataloguing of these is exactly why we should auto-verify reachability in our 15 levels.
3. **Enemies double as signposts and toys.** The Perilous Pit secret is hinted by *the enemy's own bounce arc into it*; Moons' Inchworms are collectibles; Keen "moons" you for standing still on decoration. Textbook says enemies = threat; Keen says enemies = furniture, hints, and jokes too.
4. **The climax isn't at the exit.** Rescue happens behind the last lock, then a separate exit run cools you down — and the secret level's climax is an anticlimax by design (the janitor). Textbook end-of-level fanfare is deliberately decoupled from the door that ends the level.
5. **The game tells you its own secrets — in optional rooms.** The wetsuit (a required plot item!) is hidden in an optional level, and its location is stated outright by an NPC in a different optional level. Secrets are fair because the hint system *is* the reward for exploring — nothing in the required chain ever depends on unhinted knowledge.

---

## 5. Citations

- Index / level list, level numbers, "Keen ___ into the ___" descriptions, secret + inaccessible classification: https://keenwiki.shikadi.net/wiki/Keen_4_Levels
- Council-Member roster (the 8 levels), green-gem gateway staging, Isle of Fire exception, janitor: https://keenwiki.shikadi.net/wiki/Council_Member
- Per-level facts (dimensions, point/ammo/lives totals, structure, enemies, secrets, quotes): the level's own page —
  Border_Village, Slug_Village, The_Perilous_Pit, Cave_of_the_Descendents, Chasm_of_Chills, Crystalus, Hillville, Sand_Yego, Miragia, Lifewater_Oasis, Pyramid_of_the_Moons, Pyramid_of_Shadows, Pyramid_of_the_Gnosticene_Ancients, Pyramid_of_the_Forbidden, Isle_of_Tar, Isle_of_Fire, Well_of_Wishes, Bean-with-Bacon_Megarocket_(Keen_4_Level) — all under https://keenwiki.shikadi.net/wiki/.
- Sand Yego dimensions are genuinely absent from the wiki (infobox says "Unknown").
- Lindsey hint quote ("There's gear to help you swim in Three-Tooth Lake. It is hidden in Miragia."): https://keenwiki.shikadi.net/wiki/Hillville — cross-confirms Miragia as the wetsuit level.
