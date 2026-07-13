# 22 · The Spill — G2 school-overworld world design (F-2, B-2's creative contract)

*Fable 5, 2026-07-14. Status: **DRAFT pending the Koki design gate** (§8). Once gated, B-2 builds
against this verbatim: the map data, theme families, art manifests and validator rule below are the
spec; the engine work (BLUEPRINT_V2 §B-2 steps 1–7) is pure implementation. Sources: the G2-N bible
(`20_g2n_the_spill.md`, esp. §3 beat map + §6 manifest), the authored 15-chapter bundle
(`g2.st.the-spill`), and the 2026-07-14 contract audit (map@1 schema, ZoneTheme glyph skeleton,
`resolveTileArt`, THEMES registry).*

## 0 · The one idea

G1's world is the book; G2's world is **the school the book leaks into** — so the world design's job
is to make a REAL school feel storybook-infected, zone by zone, and to let the player literally watch
the campaign's emotional arc happen to the building: **Act 1 the school gets more colorful (the leaks
are wonderful), Act 2 the color drains (the Blank takes what people look forward to), Act 3 the color
comes back wrong-then-right (the filling).** Palette is plot. Everything else serves that.

## 1 · The map screen: a floor plan, not a list

The zone board (`dgh-ink` skin per bible §6) renders as **the school's floor plan** — three bands:

```
┌─ DRAUSSEN ────────────────────────────────────────────┐
│  z05 die Stadt*   z07 Schulhof   z13 Schulhof (Regen) │
│  z10 Jonas Straße*             z14 Sportplatz         │
├─ ERDGESCHOSS ─────────────────────────────────────────┤
│  z01 Klassenzimmer  z02 Aula  z03 Gang  z04 Biosaal   │
│  z06 Bibliothek     z09 Kantine       z08 Turnhalle   │
├─ OBEN / HINTEN ───────────────────────────────────────┤
│  z11 Abstellkammer  z12 stilles Zimmer  z15 Buchecke  │
└───────────────────────────────────────────────────────┘        * excursion zones, drawn "outside the fence"
```

Unlock stays the **linear spine** (bible §6) — the floor plan is presentation, not navigation freedom.
Locked zones render **half-erased** (bible §6): outline + a pale smudge where the room art will be —
the Blank has them. As chapters complete, rooms "fill in." The board itself tells the story.

## 2 · The design language (rules every zone follows)

1. **Skeleton is law:** 11×15, full `#` border, exactly one `P`, exactly four `E` (row-major = task
   order), exactly one `F` (the zone's dialogue anchor). Saves depend on it; the theme test enforces it.
2. **`E` nodes are diegetic** — never four sparkles on a rug. Each zone's E-nodes sit ON the objects
   the beat says are leaking (the loudspeaker, the menu board, the family photos). The task IS the fix.
3. **`F` placement = emotional blocking.** Early acts: F near the door (someone meets you). z10–z12:
   F deep in the room (you go TO them). z15: F at the center (everyone came).
4. **Props carry the infection.** Every zone has 1–2 "leak props" (story-logic intruders) and, from
   z07 on, 1 "pale prop" (a taken thing: outline-only tile). Pale props disappear from Act-3 zones.
5. **Palette arc (the plot mechanic):** Act 1 zones saturate ABOVE G1's school family (the leaks make
   school more vivid). z07–z11 drain stepwise toward grey-blue (each zone loses one palette slot's
   warmth — literally: `floorSpeckle`/`accentLight` step toward `#9aa3b2`). z12 grey with ONE warm slot
   (`propWarm` stays). z13 re-colors mid-zone (weather words). z14–z15 the full warm palette returns,
   plus one new color no G1 zone has: **Klecks-ink black with the white patch (`propDark` + white).**
6. **German-first chrome** everywhere (L-1 g2 rules: prominent DE/EN toggle; labels bilingual).

## 3 · The 15 zones (generator · palette · props · F · E-nodes)

Generator names are **bare** (no `-room` suffix): the resolver's `tileArtDir` passes them through
unchanged, and per-grade art dirs (`public/art/g2/<generator>/`) can never collide with G1's. *(This
resolves the bible-vs-registry naming caveat from the audit: G1 keeps `*-room`, G2 goes bare.)*

| z | unit | generator | palette mood | leak/pale props | F (npc stem) | the four E-nodes sit on |
|---|------|-----------|--------------|-----------------|--------------|--------------------------|
| z01 | u01 | `classroom` | warm chalk-yellow | ink-crawl desk (leak) | Frau Berger, by door | blackboard · Jona's bag · timetable poster · the smudged desk |
| z02 | u02 | `aula` | stage red + brass | rhyming loudspeaker | Emma, by mixing desk | loudspeaker · podium · announcement sheet · curtain rope |
| z03 | u03 | `corridor-halloween` | orange/black (one wall PALE — first taking) | living bat + spider (leaks), drained wall (pale) | Tarik, mid-corridor | paper bat · plastic spider · pumpkin row · the drained wall |
| z04 | u04 | `bio-room` | leaf green + terrarium glow | talking hamster cage (leak) | Jona, by terrarium | hamster cage · aquarium · bird poster · storeroom-side shelf (animals avoid it) |
| z05 | u05 | `town-square` | postcard pastels | wandering shop signs (leak) | Emma, at the map board | supermarket sign · street map · bus stop · cinema marquee |
| z06 | u06 | `library` | amber wood + dust light | quest-glow shelf (leak) | Finn (cameo!), atop shelf | adventure shelf · reading table · card catalogue · window nook |
| z07 | u07 | `schoolyard` | first drain: sky one step grey | emptied calendar board (pale) | Jona, by the board | calendar board · kiosk plan · bench diary · goal wall |
| z08 | u08 | `gym-spaceport` | neon on grey (fun OVER drain) | rocket horse, satellite ropes (leaks) | Tarik, at "mission control" | vault-rocket · rope-antenna · scoreboard console · airlock door |
| z09 | u09 | `canteen` | food warmth, walls draining | weather-soup pot (leak), eaten menu (pale) | Frau Berger, at counter | menu board · soup pot · tray rail · specials sheet |
| z10 | u10 | `home-street` | dusk blue, windows warm | the gapped family photos (pale) | Jona, inside doorway | photo wall · kitchen table · post box · Jona's old room door |
| z11 | u11 | `storeroom` | near-grey, careful lamplight | the NEST (arranged taken things) | Emma, at the threshold | nest of words · old book crate · label shelf · the door home |
| z12 | u12 | `quiet-room` | grey + ONE warm lamp | the Blank itself (F is not it — see below) | Jona, beside the Blank's corner | feelings cards · the lamp · window rain · the Blank's corner |
| z13 | u13 | `yard-rain` | grey→color DURING zone | re-coloring puddles (leak, reversed) | Tarik, under umbrella | weather board · puddle row · cloud mural · the sun patch |
| z14 | u14 | `sports-field` | full color back, storm edge | swallowed-gym doorway (pale, LAST one) | Emma, at track start | warm-up circle · track · the pale gym door · Pixel's spot |
| z15 | u15 | `book-nook` | every warm slot + ink black/white | Klecks (leak become friend) | Frau Berger, center | the book's shelf · the writing table · the class's word-wall · Klecks's cushion |

*(z12: the Blank is a PROP with presence, not the `F` NPC — its "dialogue" runs through the scenes'
task slots; the F anchor is Jona sitting beside it. This keeps one-`F` law intact and the blocking honest.)*

## 4 · Exemplar layouts (calibration set — the other 11 replicate against these)

Per the house method (calibrate → gate → replicate): four full glyph layouts, one per act-shape.
Legend: `#` wall · `.` floor · `E` encounter · `F` NPC · `P` start · props per zone table below each.

**z01 `classroom` (Act-1 opener — canonical room, leak in one corner)**
```
###############
#W.W.......B..#
#.............#
#.DDD.DDD.DDD.#
#.............#
#.DDD.DDD.EDD.#
#.....E.......#
#.DDD.DDD.DDD.#
#..E......L...#
#F....P....E..#
###############
```
`W` window · `B` blackboard(board) · `D` desk(accent2) · `L` leak-ink desk(note, solid:false)
E-nodes: blackboard-row seat, mid-room, Jona's bag row, the smudged desk. F=Frau Berger near door/P.

**z07 `schoolyard` (Act-2 midpoint — open air, the first big taking)**
```
###############
#..T......C.C.#
#.....E.......#
#.............#
#...K....E....#
#P............#
#....F........#
#..E......B...#
#.....R.R.....#
#.........E...#
###############
```
`T` tree(plant) · `C` calendar board(board, PALE palette) · `K` kiosk(barrel) · `B` bench(accent2) · `R` rain drain(rug)
The pale calendar board = two E-nodes' host; sky palette one grey step down.

**z12 `quiet-room` (Act-3 pivot — smallest furniture count in the game; negative space IS the design)**
```
###############
#.............#
#....R.R......#
#..E.......E..#
#.............#
#.....LL......#
#P....LL...F..#
#.............#
#..E.......E..#
#......N......#
###############
```
`R` rain window(rug) · `L` the warm lamp(stage — glow kind) · `N` the Blank's corner(note, PALE)
F=Jona sits beside the corner; all four E-nodes at the room's edges — you approach the middle slowly.

**z15 `book-nook` (finale — the fullest, warmest room; everyone's here)**
```
###############
#.B.B.....W.W.#
#..E....E.....#
#.....RRR.....#
#..S..RRR..S..#
#.....RFR.....#
#..S..RRR..S..#
#....E....E...#
#.L..........K#
#......P......#
###############
```
`B` bookshelf(board) · `W` word-wall(note) · `R` big reading rug(rug) · `S` sitting cushion(accent2) · `L` plant · `K` Klecks's cushion(propDark+white — the NEW color)
F=Frau Berger on the rug's center; P enters from the bottom — the player walks INTO the warmth.

## 5 · Art: drop folders + prompt-library clone

Per zone: `public/art/g2/<generator>/` with the G1 stem language (`floor, wall, wall_top, door,
sparkle, npc_down` + per-zone props named as their glyph concept: `blackboard`, `calendar_board`,
`soup_pot`, `photo_wall`, `nest`, `lamp`, `word_wall`, `klecks`…). `npc_down` per zone = that zone's F
character (Berger/Emma/Tarik/Jona/Finn sprites — 5 characters cover all 15 zones). The image-prompt
library (`G2_SPILL_IMAGE_PROMPTS.html`, cloned from G1's per B-2 step 7 with `docs/art/sync-art.mjs
--lib/--dest`) gets one section per zone from this doc's tables; the FireRed 48px style key carries
over; **the pale/taken props get their own prompt treatment** (outline + 20% fill — the Blank's
signature look must be consistent everywhere). Manifest: `g2-the-spill-art-files.json`.

## 6 · Engine deltas this design assumes (B-2 scope, confirmed by the audit)

1. `map.json` for `g2.st.the-spill`: id `g2.map.the-spill`, 15 zones `z01–z15`, `unit` 1–15 in order,
   `tileSize: 16`, seeds `200+unit`, generators per §3 (bare names).
2. **15 new ZoneThemes** (append-only in `THEMES`) with the palettes/props of §3–§4; the four §4
   layouts verbatim; the other 11 authored in B-2's content step against the §2 rules + §4 exemplars
   (each passes the existing theme test automatically: 11×15, 1P/4E/1F, declared glyphs).
3. **VS-18 (net-new validator, closes the audit's gap):** when a story bundle has `map.json`, every
   zone's `unit` must match exactly one chapter's `unit` and vice versa; every `render.generator`
   must exist in `THEMES`; zone count == chapter count. Hard-fail.
4. Naming rule recorded: G1 generators keep `*-room`; G2 uses bare names (no dir collisions — art
   dirs are per-grade). `resolveTileArt` signature is `(grade, generator)` — the blueprint's
   `(storyId, …)` wording is superseded.
5. Bible §6 unchanged elsewhere: `dgh-ink` hub skin, half-erased locked cards, save slot `game:g2`,
   detective → `game:g2:bonus`, `releasedChapters: []` until dispatch is proven.

## 7 · What this deliberately does NOT do

No free roaming between zones (the floor plan is a board, unlock stays linear — save-compat + A1+
cognitive load) · no new grid geometry (11×15 frozen) · no per-zone music (AU wave later) · no Blank
boss mechanics (the campaign's whole point is that it's never fought).

## 8 · The Koki gate (~20 min)

1. **The floor-plan board** (§1) — does the three-band school read right to someone who teaches in one?
2. **The palette arc** (§2.5) — color drains through Act 2, returns in Act 3: sign off the mechanic.
3. **The four exemplar layouts** (§4) — the calibration bar for the other 11.
4. **The F/NPC casting per zone** (§3) — esp. Finn's z06 cameo and z12's "the Blank is not the NPC."
5. Naming rule (§3 intro) + VS-18 (§6.3) — ack.
Verdict recorded here; then B-2 goes to the executor with this doc + the audit as its brief.
