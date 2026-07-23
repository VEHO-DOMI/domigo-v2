# MISSION: THE ch01 WORLD KIT — 26 production cards for "DomiGo — Batch AC" (Topic-Material rebuild)

You are a senior children's-book illustrator painting PRODUCTION assets for the approved
painted-book platformer. The look was gated at Batch Z: attach
`~/Code/codex-art-lab/batch-z/_style_key_paint.png` to EVERY card (this is a production
batch — unlike the hero exploration, the style key IS law here). These images are
machine-sliced and machine-audited; format discipline is absolute.

## ★ THE TOPIC-MATERIAL LAW (the design spine of this batch — owner's order)
Chapter 1's world is built FROM school material. **No earth, no grass crusts, no ice, no
generic nature terrain anywhere in this batch.** The ground IS books, cardboard, paper,
classroom floorboards, schoolyard paving with chalk drawings, stage boards. Where older
batches painted grass-and-earth strips, this batch REPLACES that vocabulary. Taste target:
every surface should make a Viennese 10-year-old say "das ist ja meine Schule!" — while
staying painterly storybook, never clip-art.

## FORMAT LAWS (machine contract — violations fail the import)
- Sheets marked MAGENTA: background pure #FF00FF, hard edges (CP-9), content centered per
  cell, NOTHING touching cell borders. Strict grids at the stated pitch.
- Strips marked LOOP: left and right edges continue each other exactly (CP-12 — a machine
  diff-checks the edge columns).
- Plates marked FULL-BLEED: opaque, no magenta, no characters, soft painterly edges.
- No text/watermarks/borders (CP-7) — EXCEPT where a card explicitly asks for chalk
  scribbles as DECOR (hopscotch numbers, the arrow scribble): those are diegetic drawings,
  keep them loose and hand-chalked. No outside game's art or names (CP-15).
- WRITE LOCATION (the only one): `./batch-ac/` in your working root — create subfolders
  as named per card. Print `NOW GENERATING:` before and `SAVED: <path>` after each card,
  self-check (PAINTED vs style key / GRID / HARD EDGES / LOOP where named / TOPIC-MATERIAL:
  no nature surface anywhere), PASS/FAIL per line, one regenerate on FAIL. After the last
  card print `WORLD KIT DONE` + the full folder listing.

## THE UNIT-1 PALETTE CARD (every card)
Warm paper-cream light · ink blue-black lines · fresh leaf-green + sun-honey as ch01
accents · deep pine + meadow-cream supports · golden glow ONLY on collectibles/hints ·
faint ruled exercise-book lines + paper grain allowed in grounds.

---
## GROUP 1 · FAR PLATES (full-bleed 2048×1260, one each)
1. `plates/plate_p1_titlepage.png` — the sunny "title page" landscape: paper-cut hills,
   the painted SCHOOLHOUSE on the horizon (the chapter's visible goal), honey hue-shift
   with distance, NEVER desaturated.
2. `plates/plate_p2_nightwall.png` — the classroom back wall at night: shelf/poster/
   blackboard silhouettes in saturated blue-violet values (value ramp, full saturation),
   two moonlight shafts from windows.
3. `plates/plate_p3_yardwall.png` — the schoolyard wall with treetops above the rim,
   flagpole + climbing-frame silhouettes; vertical elements prominent (height legibility).
4. `plates/plate_p9_inkdream.png` — Klecks' chamber: flat dreamlike ink-swirl on cream,
   two colors + ink; deliberately NOT a world (a between-space).

## GROUP 2 · MID SILHOUETTE BANDS (2048×384, LOOP, magenta)
5. `bands/band_p1_bookhills.png` — paper/book-hill silhouettes, pine-green accent.
6. `bands/band_p2_furniture.png` — desks/chairs/globe silhouettes, night register.
7. `bands/band_p3_playground.png` — climbing frame, benches, planters (pencil-pot
   planters — topic!).
8. `bands/band_p4_audience.png` — rows of EMPTY classroom chairs in silhouette (the
   missing class — story told by absence).

## GROUP 3 · TERRAIN KITS (strict 512px-cell sheets, magenta; cells listed left→right)
9. `terrain/kit_p1_books.png` 2048×512, 4 cells: [book-mass loop tile: spines as body,
   pale page-edge as the walk-top] [left cap] [right cap] [book-stack plateau tile].
10. `terrain/kit_p1_steps.png` 2048×512, 4 cells: [book-cover stair piece rising right]
    [same falling right] [eraser step block] [paper platform with washi-tape edges].
11. `terrain/kit_p2_floor.png` 2048×512, 4 cells: [classroom floorboard loop] [floorboard
    left cap] [right cap] [windowsill ledge strip].
12. `terrain/kit_p2_furniture.png` 2048×512, 4 cells: [desk-top platform tile] [book-pile
    step small] [book-pile step large] [paper walkway (Steg) loop piece].
13. `terrain/kit_p3_paving.png` 2048×512, 4 cells: [yard paving loop: stone body, chalk-
    dust bright top edge] [left cap] [right cap] [paving terrace corner].
14. `terrain/kit_p3_air.png` 2048×512, 4 cells: [blackboard-plank slide piece with white
    chalk-dust sheen streak (the ONLY slippery read — cool + glossy)] [ruler air-platform]
    [paper air-platform] [roof ledge with a chalk ARROW scribble pointing down].
15. `terrain/kit_p4_stage.png` 2048×512, 4 cells: [stage floorboards loop] [left cap]
    [right cap] [chalk-crate podium (upturned crate, "Kreide" as picture not text)].
16. `terrain/kit_hazards.png` 2048×512, 4 cells: [ink pool surface loop, glossy black —
    the reserved kill-read] [ink pond (Teich) wide loop piece] [nib-spike row on a wooden
    holder rail (hazard furniture!)] [feather-fence piece].

## GROUP 4 · PROPS (2048×512 sheets, magenta, content-trimmed on import)
17. `props/props_p1.png` 4 cells: [pencil fence loop piece] [Fibel signpost (painted arrow
    to the schoolhouse, no letters)] [pencil-case bench] [alcove shelf board].
18. `props/props_p1b.png` 4 cells: [paper plane glide] [paper plane banked] [pencil-
    shaving blossoms scatter (verb-debris flowers!)] [school gate CLOSED].
19. `props/props_gates.png` 4 cells: [school gate OPEN] [arena door (stage door with
    knocker)] [exit window sleepy-eyed (p2)] [Klecks door on blackboard-back].
20. `props/props_p2.png` 4 cells: [hanging lamp + warm light cone] [satchel barricade]
    [ink jar sealed] [ink jar burst-open].
21. `props/props_p3.png` 4 cells: [chalk hopscotch decal (loose chalk numbers as drawing)]
    [drinking fountain (checkpoint spot)] [spring — a chalkbox-mounted coil, clearly
    bouncy] [pencil-pot planter].
22. `props/checkpoint_station.png` 1024×512, 2 cells: [Krakel's sketch station: bigger
    easel (~1.5× old), a friendly sketch-creature figure WAVING beside it] [same station,
    sketch glowing warm = active]. This ADAPTS the old tiny easel into a readable station.

## GROUP 5 · ENTITY STATE CELLS (2048×512, 4×512 cells, magenta; match existing skins'
   painterly look; these EXTEND living sheets — one extra state each, anti-stale law)
23. `entities/ent_states_a.png`: [pencil-runner mid-stride (new state)] [eraser-bouncer
    squashed-wide (new)] [satchel-stomper raised (new)] [heft-flyer banking (new)].
24. `entities/ent_platforms.png`: [satchel-swing: hanging schoolbag on TWO visible straps]
    [satchel-swing leaning mid-swing] [ruler glider: a wooden ruler ferry, cm-ticks as
    picture] [ruler glider with slight tilt]. (These retire the allowlisted placeholders!)
25. `entities/ent_falter.png`: the ZAHLEN-FALTER redesign — a small book-moth creature
    (folded-paper wings, warm, friendly): [flying A] [flying B] [resting] [wing CLOSE-UP
    with a clean BLANK chalk-slate patch on the wing]. The engine writes each moth's
    number onto the blank patch at runtime — paint the patch empty.

## GROUP 6 · TASK-STIMULUS CARDS (1536×512, 3×512 cells, magenta)
26. `tasks/stimulus_objects.png`: [a pen] [a ruler] [a school bag] — painted singles on
    nothing, storybook-warm; these appear INSIDE task cards as match/choice images, so
    they must read at ~120px.
