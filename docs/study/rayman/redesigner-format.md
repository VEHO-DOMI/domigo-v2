# S4 — The ReDesigner level format and its editor design ontology

## Status header

**Document class:** STUDY (clean-room, read-only). Draft 1, 2026-07-26.

**What this is.** A decode of the plain-JSON level format used by *Rayman ReDesigner*
1.4.4 — a fan-made standalone level editor for the fan-game *Rayman Redemption* — plus
the design ontology that its own manual reveals. We are reading it for one reason: it is
a **machine-readable record of how a proven fan level designer structures 2D platformer
levels**, at a level of detail no video study can give.

**CP-15 (binding).** Every proper name in this document — object names such as
`oBlockVine`, room names such as `Jungle1_1`, world abbreviations such as `jun` — appears
**only as a citation**, i.e. as the literal identifier found inside the decompiled
third-party build, used as evidence that a numeric ID means what we claim. None of these
names, none of the characters, and none of the specific level content may enter the
Painted Book's own fiction, assets, code identifiers, or documentation. What we take
forward is *structure* (how a level file is shaped, what a level editor must store, what
an object row needs), never *content*.

**Text only.** No image, sprite, texture, or audio was extracted at any point. The
supporting dumps are name/number/position tables produced by
`/Users/veho/Code/rayman-study/decode/extract-catalog.csx`, which writes only object
names, sprite metadata (frame counts and pixel dimensions as numbers), room instance
coordinates, and string tables.

**Honesty constraint.** Both games are YYC-compiled (GameMaker's "YoYo Compiler" — the
game's script code is compiled to native machine code, so the readable GML source is
gone). The loader function that names the thirteen columns of an object row **does not
exist in any readable form**. Everything below is therefore either (a) arithmetic, (b) a
statistical invariant over the whole 1221-row corpus, or (c) a positional match against
the main game's own room data. Where none of those reach, the entry says **UNKNOWN**. An
unknown column is an acceptable result; a guessed one is not.

**Confidence tags used in this document**
- **HIGH** — an exact arithmetic identity, an invariant with no counter-example in the
  corpus, or ≥2 independent instance-level position matches.
- **MED** — a single position match plus a corroborating count or structural argument.
- **LOW** — a single weak signal; recorded so it is not re-derived, not to be relied on.

**Corpus.** Four bundled levels, 16 sections, 1221 object rows, 124 560 collision cells
(`Curse_Chaos.txt`, `Pink_Plant_Woods.txt`, `Revenge_Of_Mr_Skops.txt`,
`They_Came_From_Outer_Space.txt`; all authored by the same designer, editor version
`1.2.2.0`, per each file's `author` / `editorversion` fields). One of the four —
`Pink_Plant_Woods.txt` — describes itself as a recreation of the original game's first
level, which makes it the **Rosetta stone**: it can be aligned against the main game's own
rooms (`redemption-dump/rooms.txt ROOM Jungle1_1` … `Jungle1_3`) to recover object names.

**Helper scripts written for this pass** (all in `/Users/veho/Code/rayman-study/decode/`):
`s4-analyze.py`, `s4-spatial.py`, `s4-match.py`, `s4-nameinfer.py`, `s4-nearest.py`,
`s4-collision.py`; outputs `s4-analysis-A.txt` … `s4-analysis-F.txt`.

---

## The file format

### Top level

A level file is a **single JSON object** — plain UTF-8 text, no compression, no framing.
Numbers are stored as JSON *strings* in some places and JSON *numbers* in others (see
below), which is a tell that the editor dumps GameMaker `ds_map`s / structs directly.

Top-level keys, from `Pink_Plant_Woods.txt` (identical shape in all four files, per
`level-stats.txt`):

| key | type | observed values |
|---|---|---|
| `name` | string | `"Pink Plant Woods"` |
| `description` | string | one sentence, shown in the level browser |
| `author` | string | `"Ryemanni"` in all four |
| `editorversion` | string | `"1.2.2.0"` in all four |
| `startinghp` | string | `"3"` in all four — the level's starting health |
| `section0` … `section9` | object | **only the sections that exist are present** |

There is no array of sections and no section count. Sections are addressed by **key name**,
and the key set is sparse: the corpus uses `section0,1,2,8` (`Curse_Chaos.txt`),
`0,1,2,8,9` (`Pink_Plant_Woods.txt`), `0,1,2` (`Revenge_Of_Mr_Skops.txt`), `0,1,2,3`
(`They_Came_From_Outer_Space.txt`). Indices 4–7 never appear. Because JSON object keys are
unordered, **the order the sections appear in the file carries no meaning** — the chain of
play order is expressed by transition objects instead (see the 13-column analysis, col5).

Sections 8 and 9 are used as **optional side rooms**: they exist in exactly the two levels
that also contain object type 314, and are exactly the sections that type 314 targets
(`Pink_Plant_Woods.txt section1` → 8, `section2` → 9; `Curse_Chaos.txt section0` and
`section1` → 8). Four out of four consistent. This is a *convention* of the author and
possibly of the editor UI, not a format rule we can prove.

### A section

Every section object carries exactly 26 keys — the same 26 in all 16 sections
(`s4-analysis-A.txt §C`, and the section-field table in `s4-analysis-F.txt`):

| key | type | meaning | evidence |
|---|---|---|---|
| `width`, `height` | number | section size in **pixels** | multiples of 16; drive the collision/tile array length exactly (below) |
| `collision` | array of strings | one value per 16×16 cell, row-major | arithmetic below |
| `tiles_layer0` … `tiles_layer7` | array of strings | one tile index per 16×16 cell, row-major; **`[]` when the layer is unused** | `README.txt §3`: "Each section has 8 tile layers in total" |
| `tileset0` … `tileset7` | number | which tileset each layer draws from, 0–7 | `README.txt §3`: "You can change the tileset of a layer by clicking the grid -button" |
| `background` | number | background index; observed {0,1,8,25,26,28,29,34,35} | bounded by 42 (below) |
| `background_lock` | number | 0 in all 16 sections — a flag we cannot decode |  |
| `background_custom` | string | `""` in all 16 sections | `README.txt §4`: custom background chosen from the Custom folder |
| `music1`, `music2` | number | two music slots; `music1` ∈ {0,1,2,5,34,35,42,43,46,49,50,56,58}, `music2` ∈ {0,5,46} and is 0 in 11 of 16 sections | `README.txt §4` mentions a "Custom Music Track" field; the editor has a music property widget (`redesigner-dump/rooms.txt ROOM Builder`: `oUiObjectMusicPage`, `oUiObjectMusicArrows`) |
| `music_custom` | string | `""` in all 16 sections |  |
| `objects` | array of 13-element arrays | the object list |  |

`background` is bounded independently: `redesigner-dump/sprites.tsv` lists
`sEditor_ui_bgselection_img` with **42 frames** at 64×64 — the background picker's
thumbnail strip. All nine observed background values are < 42. **(HIGH)**

`tileset*` is bounded the same way: `sEditor_ui_tileselection_img` has **8 frames**, and
`redesigner-dump/rooms.txt` contains exactly **8** template rooms — `Builder_temp_jun`,
`_mus`, `_mon`, `_ima`, `_cav`, `_cak`, `_toy`, `_ext`. Eight tileset slots per section,
eight tileset choices, eight template rooms. **(HIGH for the count; the index→template
mapping is UNKNOWN — see the final section.)**

### The cell grid is 16 px — with the arithmetic shown

For every section, `len(collision) == (width / 16) × (height / 16)`, exactly, **16 out of
16 sections** (`s4-analysis-A.txt §A`):

```
Pink_Plant_Woods section0   1280 × 448   → 80 × 28  = 2240   len(collision) = 2240 ✓
Pink_Plant_Woods section1   3200 × 512   → 200 × 32 = 6400   len(collision) = 6400 ✓
Curse_Chaos      section2   2768 × 2704  → 173 × 169 = 29237 len(collision) = 29237 ✓
They_Came…       section2   6896 × 272   → 431 × 17 = 7327   len(collision) = 7327 ✓
Revenge_Of_Mr_Skops sec0    4640 × 544   → 290 × 34 = 9860   len(collision) = 9860 ✓
```

The 32 px hypothesis is killed by the same table: `Curse_Chaos section2` would need
86 × 84 = 7224 cells and `They_Came… section2` would need 215 × 8 = 1720. Both are wrong,
and 173, 169, 431 and 17 are odd, so no 32 px grid can tile those sections at all. **Cell
size = 16 × 16 px. (HIGH)**

Every **used** tile layer has the same length as the collision array in all 16 sections
(`s4-analysis-A.txt §C`), so tiles and collision share one grid. Unused layers are stored
as `[]`, not as a run of zeros — the file is sparse at layer granularity but dense within a
layer.

### Row-major, origin top-left — proof by render

Reading `Pink_Plant_Woods.txt section0`'s collision array row-major into an 80 × 28 grid
produces a legible platformer level; reading it column-major produces noise
(`s4-analysis-F.txt`, first two blocks). Abridged, `.` = 0, `#` = 1, letters = other
values:

```
 r 0 ................................................................................
 r 6 ......................................................................aa###fg...
 r 7 ....................aaaaa..................................................###fg
 r11 ...............................................................aaaaa............
 r21 ............aaaaa...............................................................
 r25 ............de###fg.....de###..........de###fg..................................
 r26 #############################.......################....####....################
 r27 #############################rrrrrrr################rrrr####rrrr################
```

Rows 0–5 are empty sky, rows 26–27 are the ground with gaps, and the small `aaaaa` runs
float in mid-air at plausible platform heights. **Index = y × (width/16) + x, origin
top-left, y increasing downward. (HIGH)**

Independently: `tiles_layer0` row 0 of the same section reads
`0, 567, 568, 569, 570, 571, 572, 573, 574, 575, 576, 577, 606, …` — a consecutive run of
tile indices along a row, which is what a horizontally continuous piece of tileset art
looks like when the grid is row-major. **(HIGH)**

### The collision model: 32 painted cell *types*, not geometry

The corpus uses **22 distinct collision values** across its 124 560 cells: 0, 1, 2, 3, 4, 5,
6, 7, 8, 9, 10, 15, 16, 17, 18, 19, 20, 21, 23, 25, 30, 31 — maximum 31
(`s4-analysis-A.txt §B`). Three
independent facts fix the size of the value space at **32**:

1. `redesigner-dump/rooms.txt ROOM Builder` contains exactly **32** `oUiLayerCollisionButton`
   instances (counted in the flat instance list, before the layer duplication), laid out as
   a palette grid at x ∈ {16, 64, 112, 160, 208}, y ∈ {160, 208, 256, 304, 352, 400}.
2. `redesigner-dump/sprites.tsv` lists `sEditor_ui_collisions` with **32 frames** at
   **16 × 16** px — one icon per collision type, at exactly the cell size.
3. The observed maximum is 31 = 32 − 1.

**Collision is a 32-entry palette of cell types, painted per 16 px cell. (HIGH)** This is
the single most important structural fact in the format: the editor does **not** store
collision as polygons, heights, or slope angles. It stores *which of 32 named behaviours
this cell has*. `README.txt §3` describes the workflow in exactly those terms — "The
'Collision Types' tab allows you to add and edit collisions. Select a type from the list or
the level with LMB and paint with RMB."

Two values are unambiguous from frequency and geometry:

- **0 = empty** (93 435 of 124 560 cells — 75 % of the corpus; the whole sky in the render).
- **1 = solid** (28 490 cells — 23 %; the ground masses in the render). **(HIGH)**

Those two account for 98 % of all cells; the other 20 values share the remaining 2 635.

For the remaining 20 values we can characterise the *shape* each one takes without naming
it. `s4-analysis-F.txt` reports, for every value, how often the cell to its left/right/
above/below holds each other value:

| value | n | shape signature | reading |
|---|---|---|---|
| 2 | 433 | 187 horizontal continuations, **0** vertical; 412/433 empty above, 424/433 empty below | a **thin one-way / jump-through floor** floating in mid-air (the `aaaaa` runs in the render) — **MED-HIGH** |
| 3 | 40 | left empty 39/40, right solid 31/40, above empty 40/40, below solid **40/40** | single-cell **ascending** ramp at the left edge of a solid mass — **MED** |
| 4 | 39 | left solid 29/39, below solid **39/39** | single-cell **descending** ramp at the right edge — **MED** |
| 5 / 6 | 76 / 76 | **5 always has 6 to its right (76/76); 6 always has 5 to its left (76/76)**; 6's right is solid 61/76 | the two halves of a **two-cell ascending ramp** — **HIGH for the pairing, MED for "ascending"** |
| 7 / 8 | 60 / 60 | **7 always has 8 to its right (60/60)**; 7's left is solid 51/60, 8's right is empty 58/60 | the two halves of a **two-cell descending ramp** — same confidence |
| 9 | 183 | 157 horizontal continuations, below solid **182/183**, above empty 148/183 | a **surface modifier painted on top of a solid floor** — MED |
| 15 / 16 | 16 / 16 | 15 always has 9 left and 16 right; 16 always has 15 left and empty right; both sit on 9 | a strict **left/right pair marking the end of a 9-surface** — MED for the pairing, name UNKNOWN |
| 19 | 347 | **285 of 347 sit in the section's very last row**, with nothing below; the remaining 62 are stacked directly above another 19. In `Pink_Plant_Woods.txt` it occurs in *only* the bottom row of each section (rows 27, 31, 27, 99) | the **bottom-of-world kill plane / pit floor**, painted to line the gaps in the ground — **HIGH for "bottom-edge band", MED for "kills"** |
| 20 | 340 | 213 horizontal + 69 vertical continuations, 165 with solid below | a **2-D area type** — UNKNOWN |
| 21 | 551 | 239 horizontal + 274 vertical continuations, mostly empty on all sides, and **44 of its bottom neighbours are value 31** | a **volume/area type resting on a 31-lined floor** — MED for "volume", name UNKNOWN |
| 23 | 42 | 40 horizontal + 21 vertical continuations | a **two-row horizontal band** — UNKNOWN |
| 25, 30, 31 | 165, 56, 120 | pure horizontal runs (164/165, 55/56, 116/120), solid directly below (165/165, 56/56, 102/120), empty above | three more **floor-surface modifiers**, each confined to one level (25 and 31 to `Curse_Chaos.txt`, 30 to `Revenge_Of_Mr_Skops.txt`) — MED for the class, names UNKNOWN |
| 10, 17, 18 | 7, 3, 5 | isolated / tiny clusters | UNKNOWN |

The *vocabulary* the runtime uses for these behaviours does survive, because YYC keeps
script **names** in the string table even though it discards the code. `redesigner-dump/strings.txt`
lines 2552–2597 contain, in one contiguous block:

`onground_tile`, `collision_down_tile`, `collision_up_tile`, `collision_horizontal_tile`,
`collision_horizontal_slope_tile`, `collision_slope_tile`, `collision_ring_tile`,
`collision_all`, `tile_at`, `is_slope`, `is_empty`, `ledgeplayer`, `icejump`, `hurtplayer`,
`drownplayer`, `bounceplayer`, `collision_horizontal_platform`.

So the 32-type palette is known to include concepts of **slope**, **one-way platform**,
**ledge**, **ice**, **hurt**, **drown**, and **bounce**, and the tile-collision query is
directional (down / up / horizontal). That inventory is a genuine finding. **Mapping a
specific number to a specific concept beyond the geometric readings above is not possible
and is left UNKNOWN** — e.g. it is tempting to call 21 "water" because `drownplayer`
exists and 21 is the only 2-D volume type, but nothing in the data ties them.

### Tile layers

Eight layers per section, painted back to front: `README.txt §3` — "Layer 2 will appear on
top of layer 1, layer 3 on top of layer 2, and so on." The corpus is much thinner than the
format allows: **8 of 16 sections use only `tiles_layer0`, 7 use two layers, and exactly one
(`They_Came_From_Outer_Space.txt section0`) uses three. No section uses more than 3 of the 8
layers** (`s4-analysis-F.txt`). That is itself a design datum: a practised designer of this
genre needed at most three tile planes, and half the time one was enough.

Layers are also independently tilesetted, and the corpus does mix: `They_Came… section0`
runs `[tileset0=1, tileset1=3, tileset2=3]` and `section2` runs `[4, 3, 3]` — a foreground
terrain sheet under two decoration passes from a different sheet.

A layer's tile values are indices into that layer's tileset; **0 = empty**. Ranges observed
per tileset value (`s4-analysis-F.txt`):

| tileset | distinct indices used | min…max |
|---|---|---|
| 0 (used only by `Pink_Plant_Woods.txt`) | 776 | 1…1405 |
| 1 (`They_Came…` only) | 522 | 332…1540 |
| 3 (`They_Came…` only) | 66 | 1…1209 |
| 4 (`Revenge_Of_Mr_Skops.txt`, `They_Came…`) | 414 | 1…1611 |
| 6 (`Curse_Chaos.txt` only) | 568 | 1…1304 |

The **row stride of the tileset sheet is recoverable from the level data alone**. Take
every 2 × 2 cell block where the top row is a consecutive pair (`t[x+1,y] == t[x,y]+1`) and
the bottom row is also a consecutive pair (`t[x+1,y+1] == t[x,y+1]+1`) — i.e. the designer
pasted a 2 × 2 chunk of the sheet unmodified — and histogram `t[x,y+1] − t[x,y]`. The mode
is the sheet's width in tiles:

```
GLOBAL  : 40 → 4055 samples ; next best 60 → 307 ; 200 → 188
tileset0: 40 → 1142 ;  tileset3: 40 → 196 ;  tileset4: 40 → 919 ;  tileset6: 40 → 1798
tileset1: 60 →  307  (next 54 → 109, 64 → 58 — a less clean mode)
```

**Tile index = row-major index into a tileset sheet 40 tiles wide for tilesets 0, 3, 4 and
6 (HIGH); apparently 60 tiles wide for tileset 1 (MED).** With a maximum index of 1611 and
a stride of 40, those sheets are ≈ 40 × 41 tiles ≈ 640 × 656 px. The mapping from a tile
index to a specific piece of art is not decodable from the level files and is not needed:
what matters for us is that **the format stores one flat integer per cell per layer**, with
no per-tile flip, rotation, tint, or offset. Tile art has no per-instance parameters at all.

---

## The 13-column object row

Every object is a flat array of 13 values. **All 1221 rows in the corpus have exactly 13
elements** (`level-stats.txt`, `row widths: {13: 1221}`), so the row is a fixed-width
record, not a variable-length property list. Twelve of the thirteen slots are numeric in
almost all rows; **one slot (col5) holds a JSON string in 6 rows** — the only strings in
any object row in the corpus.

The single most important conclusion, which the column-by-column table below establishes,
is this:

> **Columns 3–12 are a generic ten-slot property array whose meaning is defined
> per-object-type, not globally** — except col3, which is universal.

That is proved by col5 and col6, which demonstrably mean *different things* on different
types (target-section index on type 20, own-entry-ID on type 251, a level-wide serial on
type 252, authored text on type 315; width-in-cells on type 38, target-start-ID on type 20).
This matches how the editor's own UI is built: `redesigner-dump/rooms.txt ROOM Builder`
holds a **pool of reusable property widgets** at fixed slots — 10 `oUiObjectPropertyButton`
(rows y = 560/624/688/752 × columns x = 16/80), 5 `oUiObjectPropertyBox`, 3
`oUiObjectBoolBox` (x/y = 16/688, 16/752, 144/688), 13 `oUiObjectPropertyArrows`, 1
`oUiObjectTextButton`, 1 `oUiObjectCustomGraphic`, 1 `oUiObjectMusicPage` + 2
`oUiObjectMusicArrows` — which are shown or hidden depending on the selected object.
`README.txt §3` says exactly this: "What properties you can edit depend on the object
itself."

### Column table

| col | meaning | confidence | evidence |
|---|---|---|---|
| **0** | **object type ID** — an index into the editor's placeable-object palette | **HIGH** for "type ID"; the palette ordering is partly decoded (below) | 128 distinct values in 0…327 over 1221 rows (`level-stats.txt`). Bounded by `redesigner-dump/sprites.tsv`: `sEditor_ui_objects` has **380 frames** at 32 × 32 — one palette icon per placeable object — and 327 < 380. It is **not** an index into `redesigner-dump/objects.tsv` (511 objects): ID 0 there is a UI widget, and the corpus's most common ID (0, 235 instances) is provably a collectible. |
| **1** | **x position in pixels**, section-local, origin left | **HIGH** | Range 0…6946 across the corpus; every value < its own section's `width`. Confirmed instance-by-instance against the main game: `Pink_Plant_Woods.txt section0` type 250 at x = 656, 560, 480, 352 vs `rooms.txt ROOM Jungle1_1` `oBlockVine` at x = 656, 560, 480, 352 — four exact matches. |
| **2** | **y position in pixels**, origin top | **HIGH** | Range 0…4791; every value < its section's `height`. Same four-instance proof; and 8 type-0 instances match `oTing_normal` positions in `ROOM Jungle1_1` to within 2.2 px, one exactly at (998, 329). |
| **3** | **Gen/Kill ID** — the link ID that decides whether this object is present, per the gendoor/killdoor system | **HIGH** | `README.txt §3`: "The most important of these properties is the 'Gen/Kill ID', which almost every object has." Statistically: 13 distinct values, 0…12, and **959 of 1221 rows are 0** — the "always present" default. Per level the non-zero values form a dense run starting at 1 with no gaps: 1–7 (`Pink_Plant_Woods.txt`), 1–9 (`Curse_Chaos.txt`), 1–12 (`Revenge_Of_Mr_Skops.txt`), 1–10 (`They_Came…`) — exactly what a hand-assigned link namespace looks like. Each ID group mixes many object types, e.g. `Revenge_Of_Mr_Skops.txt` ID 9 = {type 0 × 8, type 43 × 6, type 38 × 2, type 95 × 2}: eight collectibles and six of one object appear/vanish together. And type 38 — the door-shaped type — **never** has col3 = 0 (0 of 34 rows), which is exactly the constraint on an object whose whole purpose is to name an ID. |
| **4** | boolean flag, meaning UNKNOWN; best candidate is the editor's flip/mirror flag | **LOW** | Strictly {0, 1} over all 1221 rows; 83 ones. Carried by 20 distinct types; constant 1 on types 140, 141, 160, 273, 307, 308, 310 and varying on 13 others. `README.txt §5` documents "F - Flip the selected object", and the Builder room has 3 `oUiObjectBoolBox` widgets — matching the fact that **exactly three columns in the whole corpus are strictly boolean (col4, col10, col11)**. That coincidence is worth recording but is not proof, and the one geometric test available fails: on type 20 the flag does not track which edge of the section the object sits on. |
| **5** | **a per-type value slot**. Four of its uses are decoded, and it is the slot that can hold **authored text** | **HIGH** (per use, below) | Polymorphic: 1215 numeric rows, **6 string rows**. All six strings sit on type 315 and read `"Bonus rewards!"`, `"Reactor Entrance"`, `"CORE"`, `"OVERHEAT"` × 2 — i.e. **level signage authored in the editor** (`ROOM Builder` has a dedicated `oUiObjectTextButton` widget for exactly one object type). Decoded numeric uses: **on the three transition types 20, 272 and 314 it is the target section index** (see the proof block); **on type 251 it is that spawn point's own entry ID**; **on type 252 it is a level-wide serial 0…n−1**. |
| **6** | **a per-type value slot**; on resizable objects it is **width in 16 px cells**, on transition objects it is the **target spawn-point ID** | **MED-HIGH** | 1163 of 1221 rows are 0 (the "not applicable / use default" value). Width reading: type 38 uses 1…6, type 39 uses 1…31, type 238 uses 20 and 30 — and the main game stores the same objects with `image_xscale`: `rooms.txt ROOM Jungle1_1` `oGendoor 1632 384 9 1` (9 wide), `ROOM Jungle1_3` `oGendoor 2144 160 7,5 1`. Target-spawn reading: see the proof block below — every one of the 22 transitions' col6 resolves to a spawn point that exists with the matching ID. |
| **7** | **a per-type value slot**; on resizable objects it is **height in 16 px cells** | **HIGH** | 1133 of 1221 rows are 0. The proof is type 250 in `Pink_Plant_Woods.txt` against `rooms.txt`: `section0` x = 656/560/480/352 carries col7 = 15/9/5/2 while `ROOM Jungle1_1`'s `oBlockVine` at the *same four x values* carries `image_yscale` = 15/9/4/2; `section2` x = 1216/1296/1376/1440 carries col7 = 19/18/5/1 while `ROOM Jungle1_3`'s `oBlockVine` at the same x carries yscale = 18/17/4/2. **Eight exact x-coordinate matches; the heights agree exactly or off by one** (the recreation was re-entered by hand). Corroborated by type 38 (1…20), type 39 (1…31), and type 269, whose seven instances in `They_Came…` carry col7 = 9, 6, 6, 6, 6, 6, 19 with col6 = 0 — five identical vertical elements of length 6 spaced 160 px apart at the same y. |
| **8** | UNKNOWN | — | Only 5 distinct values, {0, 1, 3, 5, 7}, and only 32 non-zero rows, carried by just five types (42, 53, 57, 99, 100). Every non-zero value is odd, i.e. bit 0 is always set — consistent with a small bitmask, but with 32 samples that is an observation, not a decode. |
| **9** | UNKNOWN — **undecodable in principle from this corpus** | — | **Exactly 1.0 in all 1221 rows** (`level-stats.txt`, `col9: distinct=1 min=1.0 max=1.0`). A column with zero variance carries no information. It could be a scale factor, an alpha, an "enabled" flag, or a format-version byte; nothing in four levels distinguishes them. |
| **10** | boolean flag, meaning UNKNOWN | — | Strictly {0, 1}; only **11** ones in 1221 rows, carried by three types (57 × 8, 42 × 2, 53 × 1). Too sparse to decode. |
| **11** | boolean flag; **on type 20 it marks the level-completing transition** | **HIGH for that one use**; UNKNOWN generally | Strictly {0, 1}; 48 ones, carried by six types (99 × 30, 53 × 6, 20 × 4, 100 × 4, 42 × 2, 57 × 2). In **all four levels**, exactly one type-20 row has col11 = 1, and it is always the one whose col5 = 0 (no onward section) — i.e. the exit that ends the level rather than moving to the next section. Four out of four, no counter-example. |
| **12** | **a per-type value slot**; UNKNOWN in general, but one of its uses is decoded | — | 11 distinct values, 0…12; 964 zeros. Heavily used by types 252 (78 rows = 1, 50 = 2, …) and 99 (30 rows = 1). On type 252 it partitions the level's serial-numbered set into groups (see the type table). On type 315 it takes 1 or 8 — plausibly a text style — UNKNOWN. |

### What the columns are *not*

- There is **no rotation column** (no value in cols 3–12 ever ranges over an angle-like
  space).
- There is **no per-object depth/layer column** with the range 0–7 that a "which of the 8
  tile layers do I draw between" field would need; col12 reaches 12 and col3 reaches 12,
  so neither is a layer index. Object draw order is therefore not authored per object.
- There is **no ID/name string** and **no per-object custom-asset path**, even though
  `README.txt §4` documents a "custom graphic object" that displays external `.png` files
  and `ROOM Builder` contains an `oUiObjectCustomGraphic` widget. Either that object type
  is absent from all four bundled levels, or the path is stored in the col5 string slot and
  no bundled level uses it. `Custom/` in the distribution contains only
  `Place_custom_assets_here.txt` and two skin PNGs — no bundled level references it
  (`background_custom` and `music_custom` are `""` in all 16 sections). **UNKNOWN.**

---

## Partial object-ID table

Two methods produced these. **(A) Positional alignment**: `Pink_Plant_Woods.txt` is a
recreation, so each of its objects can be matched to the nearest instance in the
corresponding main-game room (`ROOM Jungle1_1/1_2/1_3`) with **no offset applied**; a match
within a few pixels inherits that instance's name. **(B) Ordered-family matching**:
contiguous runs of type IDs turn out to correspond to contiguous families of sibling
objects, in the same order, and the per-family instance *counts* form a vector that can be
matched exactly.

Method A is only available for `Pink_Plant_Woods.txt`; the other three levels are original
designs and have no reference to align against. Within it, `section0` and `section2` align
well and `section1` almost not at all — the recreation is truncated there (1280 px vs the
original room's 2208; 3200 vs 4000; 3520 vs 4512), so alignment quality varies by section.
Full per-instance output: `s4-analysis-E.txt`.

| type ID | inferred identity (name = citation from `objects.tsv` / `rooms.txt`) | conf | evidence |
|---|---|---|---|
| **0** | the small ubiquitous collectible (`oTing_normal`) | **HIGH** | 235 instances = the most common type in the corpus, present in all four levels. 8 of the 9 in `Pink_Plant_Woods.txt section0` sit within **2.2 px** of an `oTing_normal` in `ROOM Jungle1_1`, one **exactly** at (998, 329). Placement is off-grid (only 56/235 have x ≡ 0 mod 16) and forms 16–25 px arcs, vertical columns and 4-point diamonds — e.g. `section1` holds a 13-item column at x ≈ 57–84 rising y = 31…221 at ~16 px steps, a 4-item diamond at (2294,313)/(2308,299)/(2309,325)/(2323,312), and a 5-item jump arc at x = 3017…3146. |
| **2** | the standard power-up (`oPowerfist`) | **HIGH** | `section2` (788, 217) sits **exactly** on `ROOM Jungle1_3`'s `oPowerfist` (788, 217); a second is 5.7 px away; corpus count in `Pink_Plant_Woods.txt` = 3, `ROOM Jungle1_3` `oPowerfist` count = 3. |
| **3** | the rarer power-up (`oGoldfist`) | **MED** | Single instance, 12.6 px from `ROOM Jungle1_3` `oGoldfist`. Only 2 instances corpus-wide. |
| **6** | a large power-up (`oBigpower`) | **MED** | `section0` (256, 166) is 13.3 px from `ROOM Jungle1_1` `oBigpower` (253, 153); x within 3 px. |
| **8** | extra life (`oOneup`) | **HIGH** | `section2` (233, 122) sits **exactly** on `ROOM Jungle1_3` `oOneup` (233, 122); `section0` (330, 92) is 8.2 px from `ROOM Jungle1_1` `oOneup` (338, 90). |
| **9** | a small ground enemy (`oLivingStoneSmall`) | **MED** | One instance 9.8 px from `ROOM Jungle1_3` `oLivingStoneSmall`; and the count matches exactly — 6 in `Pink_Plant_Woods.txt`, 6 across `ROOM Jungle1_2` + `Jungle1_3`. |
| **20** | **section transition / level exit** (one of three transition types) | **HIGH** | See the proof block below. 13 instances; it is the type that carries the level-completing exit in all four levels. |
| **38** | **the Gen/Kill door trigger region** | **MED-HIGH** | 34 instances, all four levels. **Never** col3 = 0 (0/34) — the constraint on an object that must name an ID. Carries both size columns (col6 = 1…6, col7 = 1…20), i.e. it is a *region*, matching how the main game stores its own door objects (`ROOM Jungle1_1`: `oGendoor` with yscale 5 and another with xscale 9). It appears in **every** Gen/Kill ID group of `Pink_Plant_Woods.txt` (7 of 7) and `Revenge_Of_Mr_Skops.txt` (12 of 12). Count check: `Pink_Plant_Woods.txt section1` has 6 type-38 and `ROOM Jungle1_2` has 6 `oGendoor`. Held at MED-HIGH rather than HIGH because the corpus cannot distinguish a *gen*door from a *kill*door — both are documented in `README.txt §3` and `strings.txt` lists 8 `sndGendoor*` and 13 `sndKilldoor*` sounds, yet only one type ID shows this signature, so either type 38 covers both (with the direction in an undecoded column) or the killdoor type is absent from all four levels. |
| **82** | a hazard/projectile source (`oPlumGenerator`) | **MED** | One instance 15.6 px from `ROOM Jungle1_3` `oPlumGenerator`; counts 6 vs 7. |
| **121** | the "object will appear here" marker (`oAppear_common`) | **LOW** | One instance 12.2 px from `ROOM Jungle1_2` `oAppear_common`; 4 instances, one section only. Recorded so it is not re-derived. |
| **127** | a projectile emitter (`oPiranhaSender`) | **MED** | One instance 13.4 px from `ROOM Jungle1_3` `oPiranhaSender`; counts 3 (`Pink_Plant_Woods.txt`) vs 4. |
| **166, 167, 168, 169, 170, 171, 172** | the **seven variants of the ambient flying decoration** (`oButterfly1` … `oButterfly7`), **in ID order** | **HIGH** | Method B, and it is decisive. Restrict `ROOM Jungle1_1` to x < 1280 (the extent `section0` recreates): the decoration counts are `oButterfly1..7` = 4, 3, 1, 5, 2, 4, 4 → within x < 1280 they are **2, 2, 1, 5, 2, 4, 4**. `Pink_Plant_Woods.txt section0` types 166…172 have counts **2, 2, 1, 5, 2, 4, 4** — the same seven-number vector in the same order. Instance-level confirmation: type 167 (544, 153) ↔ `oButterfly2` (544, 150) = 3.0 px; type 171 (640, 124) ↔ `oButterfly6` (640, 128) = 4.0 px; type 170 (354, 396) ↔ `oButterfly5` (353, 400) = 4.1 px; type 166 (668, 406) ↔ `oButterfly1` (664, 403) = 5.0 px; type 169 (222, 312) ↔ `oButterfly4` (228, 307) = 7.8 px. And the IDs are contiguous exactly as the catalogue indices are contiguous — `redesigner-dump/objects.tsv` lists `oButterfly1`…`oButterfly7` at indices **357–363**. |
| **173, 174, 175** | the **three variants of the ground decoration** (`oMushroomJun1..3`), **in ID order** | **HIGH** | Same method: counts within x < 1280 are **2, 3, 2** for both the IDs and `oMushroomJun1/2/3`. Instances: type 174 (686, 353) ↔ `oMushroomJun2` (688, 352) = 2.2 px; type 173 (932, 416) ↔ `oMushroomJun1` (928, 416) = 4.0 px; type 175 (1132, 416) ↔ `oMushroomJun3` (1136, 416) = 4.0 px; type 174 (1454, 129) ↔ `oMushroomJun2` (1453, 127) = 2.2 px. Catalogue indices **364–366**, contiguous and immediately after the butterflies. |
| **250** | the **climbable vertical element** (`oBlockVine`) | **HIGH** | Eight exact x-coordinate matches across two sections with a constant y offset of +16, and col7 reproducing the main game's `image_yscale` (see col7 in the column table). All 25 instances are grid-aligned in **both** axes (25/25 have x ≡ y ≡ 0 mod 16), which is what a cell-snapped structural block looks like versus the off-grid decoration and collectibles. |
| **272** | **a second section-transition type** | **HIGH** | 5 instances, and they complete the one forward chain that type 20 leaves open. `They_Came_From_Outer_Space.txt` has only *one* type 20 (its terminal exit); its `section0` → `section1` → `section2` → `section3` chain is carried by type 272 with col5 = 1, 2, 3 respectively, each placed at the far end of its section (`section1` x = 4512 of 4640; `section2` x = 6848 of 6896). `Curse_Chaos.txt section8` holds two type-272 side by side at (176, 192) and (288, 192) with col5 = 1 and 2 — the two return doors from the side room that two different sections enter. All 5 have col6 = 0, and the target sections' spawn-0 points all exist. |
| **251** | the **player start / spawn point** | **HIGH** | Present in **all 16 sections** of all four levels (19 instances). Twelve sections have exactly one; the four that have two always have one with col5 = 0 and one with col5 = 1. `README.txt §5` names the object and its ID field: "R - Moves the Starting Position with the ID of 0 to the mouse." Positional corroboration: `section0`'s single instance at (148, 401) is 23 px from `ROOM Jungle1_1`'s `oPlayer` (128, 413). Every transition's target-spawn value resolves to an existing 251 (below). |
| **252** | **NOT NAMED** — but fully characterised | — | 164 instances, all four levels — the second most common type. Its col5 is a **level-wide serial**: in every level the type-252 rows carry col5 = 0, 1, 2, …, n−1 with no repeats and no gaps (83 values in `Curse_Chaos.txt`, 46 in `They_Came…`, 23 in `Pink_Plant_Woods.txt`, 12 in `Revenge_Of_Mr_Skops.txt`), and the sequence **continues across section boundaries** (`Pink_Plant_Woods.txt section8` holds 0–9, `section9` holds 10–22). col12 partitions the set into groups; within a group, sorting by col5 yields runs of evenly spaced positions (23 px × 3, 24 px × 3, 14–19 px × 25) interleaved with long jumps. So: an object the runtime must track **individually**, placed in short evenly-spaced chains. That is as far as the data goes. Naming it would be a guess. |
| **314** | **bonus/secret-section doorway** | **HIGH** | See the proof block below. |
| **315** | an **authored text label / sign** | **HIGH** | All 6 instances, and only these, carry a string in col5: `"Bonus rewards!"`, `"Reactor Entrance"`, `"CORE"`, `"OVERHEAT"` × 2. The two `"CORE"`/`"OVERHEAT"` pairs in `They_Came_From_Outer_Space.txt section3` sit symmetrically at x = 64/112 and 384/432 — signage flanking a set-piece. Its col12 takes 1 (×4), 8 (×1) and 0 (×1), plausibly a style or size, UNKNOWN. |

Everything else in the 128 observed IDs stays **unnamed**. Three of the larger ones are
worth recording as *characterised but unnamed*, because their placement pattern is the
design datum even without a name:

- **164** (31 instances, `Curse_Chaos.txt` + `They_Came…`, every property column 0). Placed
  as **hand-built chains at an 8 px pitch**: `They_Came… section0` holds ten instances
  alternating x = 1704/1712 with y stepping 64, 72, 80, … 136, and another ten alternating
  x = 1000/1008 with y = 400 … 472. `Curse_Chaos.txt section1` holds two runs of three at a
  32 px pitch along one y. So: a link/segment element with **no length property**, where the
  designer places every link individually — the opposite of the type-250 approach, where one
  object carries a length in col7. Both idioms coexist in this editor.
- **243 / 244** (23 and 8 instances, adjacent IDs). In `They_Came… section3` type 243 forms
  an L of a 13-item vertical column at x = 152, y = 88…472 and a 7-item horizontal row at
  y = 88, x = 152…440 — **a 48 px (3-cell) pitch grid framing the room** — with col12 = 6
  tagging that whole group, while a second group of 5 carries col12 = 2 and col5 = 5.
- **99** (50 instances) is the most parameterised type in the corpus: it is the only type
  that uses cols 3, 5, 8, 11 *and* 12 together. With 42, 53, 57 and 100 it forms the only
  family that touches cols 8 and 10 at all — a class of multi-setting devices.

Other sizeable unnamed types: **312** (25, `Curse_Chaos.txt` only, 0 of 25 y-grid-aligned),
**293** (18, `They_Came… section1` only, all property columns 0, scattered off-grid in two
clusters — decoration or particles), **129** (13), **250**-adjacent **253** (16, shares
252's col5+col12 signature).

### Why col0 is not a catalogue index — and what it *is*

The known dead end (col0 as a direct index into `objects.tsv`) is confirmed and now
explained. The proven IDs land nowhere near their catalogue indices:
`oTing_normal` is catalogue index 206 but type **0**; `oBlockVine` is 190 but type **250**;
`oButterfly1` is 357 but type **166**. So the palette is **not** the catalogue in catalogue
order.

But the butterfly and mushroom blocks reveal the actual rule: catalogue indices 357–366
map to type IDs 166–175 — **ten consecutive catalogue entries to ten consecutive type IDs,
order preserved, a constant shift of 191 within that block**. The shift is local, not
global (0 + 191 = 191 is `oMagicianToken`, not a collectible; 250 + 191 = 441 is not
`oBlockVine`). `README.txt §3` explains why: "All the objects are divided into categories
and subpages." The palette is a **category-grouped re-ordering** of a placeable subset of
the catalogue, and within a family/category the catalogue order survives.

**Consequences, both useful:**
1. **Contiguous ID runs in a level file are families of sibling objects.** That is why
   method B works, and it is the only lever available for the three original levels — e.g.
   `Revenge_Of_Mr_Skops.txt` uses the contiguous run 200–206 (counts 2, 1, 1, 1, 2, 2, 1)
   and 321–327, which are almost certainly two families of cave-themed siblings. We cannot
   name them, because that level is not a recreation and has no reference to align against.
2. **The full ID→name table cannot be recovered from these files.** The category order
   lives only in the compiled palette-construction code. `ROOM Builder`'s 35
   `oUiObjectButton` slots tell us the palette page size is 35, and `sEditor_ui_objects`'s
   380 frames tell us the palette holds ≈ 380 entries in ≈ 11 pages — but the page contents
   are not data.

### Proof block: the transition system (types 20, 272, 314, 251 and columns 5, 6, 11)

This is the cleanest decode in the corpus, because it is self-verifying: the transitions
name sections and spawn points, and those either exist with the named ID or they do not.
There are **22 transition instances across three types** (20 × 13, 272 × 5, 314 × 4) in the
four levels, and **all 22 references resolve** — every col5 names a section that exists in
that level, every col6 names a spawn point that exists in the target section. Zero dangling
references.

**The forward chain (type 20).** Type 20 sits at the far end of a section and its col5 names
the next one:

```
Pink_Plant_Woods.txt   section0 (1280 wide)  type 20 @ x=1235  col5=1  → section1
                       section1 (3200 wide)  type 20 @ x=3177  col5=2  → section2
                       section2 (3520 wide)  type 20 @ x=3498  col5=0  col11=1   → END
Revenge_Of_Mr_Skops.txt section0 (4640 wide) type 20 @ x=4616  col5=1  → section1
                        section1 (480 wide)  type 20 @ x= 448  col5=2  → section2
                        section2             type 20 @ x= 400  col5=0  col11=1   → END
Curse_Chaos.txt        section0              type 20 @ x= 192  col5=1  → section1
                       section1 (6976 wide)  type 20 @ x=6896  col5=2  → section2
                       section2              type 20           col5=0  col11=1   → END
They_Came…             section3              type 20 @ (328,944) col5=0 col11=1  → END
```

Four levels, four terminal transitions, **every one with col5 = 0 and col11 = 1**; every
non-terminal one with col5 = the next section index. `redesigner-dump/rooms.txt` corroborates
that transitions are a first-class concept: there is a dedicated `SectionTransition` room
(480 × 272) and an `oManagerSectionTransition` object.

**The forward chain (type 272), which independently re-proves col5.**
`They_Came_From_Outer_Space.txt` has only one type 20 — its terminal exit — so its 0 → 1 → 2
→ 3 chain must be carried by something else, and it is:

```
They_Came…  section0 (2576×1056)  type 272 @ (  80, 144)  col5=1  → section1
            section1 (4640× 640)  type 272 @ (4512, 208)  col5=2  → section2
            section2 (6896× 272)  type 272 @ (6848, 176)  col5=3  → section3
```

Same column, same semantics, a different object type, in the one level where type 20 was
absent. (In `section0` the exit sits top-left at (80, 144) while the spawn is bottom-left at
(128, 952) — that section is a 2576 × 1056 arena you climb.) `Curse_Chaos.txt section8` also
uses type 272 for its two return doors, at (176, 192) col5 = 1 and (288, 192) col5 = 2.

**The return path, which pins col6.** `Pink_Plant_Woods.txt`'s two side rooms each hold a
type 20 pointing *back*, and each carries col6 = 1:

```
section8 type 20 col5=1 col6=1   → section1, spawn ID 1
section9 type 20 col5=2 col6=1   → section2, spawn ID 1   (twice, two exits)
```

And the targets exist, uniquely: `section1` contains exactly one type 251 with col5 = 1 (at
(293, 90)), and `section2` contains exactly one type 251 with col5 = 1 (at (3320, 400)).
**Those are the only two secondary spawn points in the whole level**, and they are exactly
the two that are addressed.

**The entrances, which pin type 314 and re-prove col5/col6 on a second type.**

```
Pink_Plant_Woods.txt  section1  type 314 @ (372,  95)   col5=8  col6=0  → section8, spawn 0
                      section2  type 314 @ (3376,416)   col5=9  col6=0  → section9, spawn 0
Curse_Chaos.txt       section0  type 314 @ (288, 144)   col5=8  col6=0  → section8, spawn 0
                      section1  type 314 @ (6897,415)   col5=8  col6=1  → section8, spawn 1
```

`Pink_Plant_Woods.txt section8` and `section9` each contain exactly one type 251, with
col5 = 0 — matching col6 = 0. `Curse_Chaos.txt section8` contains **two** type 251, with
col5 = 0 (at x = 48) and col5 = 1 (at x = 432) — matching the two doors that address spawn
0 and spawn 1 respectively. **Seven transitions, seven resolved targets, zero dangling
references.**

And type 314 appears in exactly the two levels that have a `section8` (2 of 4), which is
the consistency check on the whole reading.

**Therefore (all HIGH):** col5 on types 20, 272 and 314 = target section index; col6 on the
same types = target spawn-point ID; col5 on type 251 = that spawn point's own ID; col11 on
type 20 = "this transition finishes the level"; types 20 and 272 = section transitions; type
314 = side-room doorway; type 251 = spawn point.

**The design pattern this exposes** (the reason it is worth the space): the whole level graph
is expressed as *(target section, target spawn ID)* pairs on ordinary placed objects, with
spawn points that own their identifiers. That is what makes a side room re-usable from two
different places — `Curse_Chaos.txt section8` is entered from `section0` (→ spawn 0) and from
`section1` (→ spawn 1), and returns via two separate doors to sections 1 and 2. No section
"knows" its neighbours; the objects do.

---

## The editor's design ontology

What follows is the model of "what a platformer level *is*" that this editor imposes,
read off `README.txt` and cross-checked against the file format and the Builder room's
widget inventory. This is the part of the study with the most direct value for us: it is a
working designer's data model, proven over four shipped levels.

### 1. A level is a set of *sections*, not a map

There is no single level geometry. A level is a **sparse, named set of independently sized
sections**, each with its own dimensions, background, music, tilesets, collision grid and
object list. `README.txt §3` treats moving between them as a first-class editor action: the
Properties tab "contains general information about your level, including tools to change
between sections". Sections are joined only by transition objects carrying (target section,
target spawn point) — a **graph**, not a strip. In the corpus that graph is a mostly linear
main chain (0 → 1 → 2 → end) with side rooms hanging off it (1 → 8 → back to 1 at spawn 1).

Design consequence: **the topology is authored in the object layer, not in the geometry**,
so a section can be reused as the destination of several doors (`Curse_Chaos.txt section8`
is entered from two different sections, which is precisely why it needs two spawn points).

### 2. Sections are aggressively non-uniform in shape

Because each section carries its own width and height, the designer varies the *aspect* of
the challenge per section rather than per level. From the corpus:

- wide horizontal runs: 6976 × 640, 6896 × 272, 4640 × 544, 4640 × 640
- vertical shafts: 480 × 3360, 480 × 4800, 480 × 1600
- single-screen rooms: 480 × 272 (which is the editor's own Builder room size and the
  `SectionTransition` room size; `Menu`, `Intermission` and `Gameover` are 480 × 270 — i.e.
  this is the native screen)
- square-ish arenas: 2768 × 2704, 2576 × 1056

Two of the four levels are built from *alternating* orientations:
`Curse_Chaos.txt` runs 480 × 3360 (vertical shaft) → 6976 × 640 (long horizontal) → 2768 ×
2704 (arena) → 480 × 272 (single screen), and `Revenge_Of_Mr_Skops.txt` runs 4640 × 544
(horizontal) → 480 × 4800 (a ten-screen vertical shaft) → 480 × 640 (small room). The most
extreme aspect in the corpus is `They_Came… section2` at 6896 × 272 — barely more than one
screen high over 6896 px of length, i.e. a pure horizontal corridor.

### 3. Terrain is *painted twice*: once as collision, once as art

The editor keeps collision and tile art in **separate, independently painted grids of the
same 16 px cells** (`README.txt §3` gives them separate tabs, separate select-and-paint
verbs, and separate palettes). Nothing in the format ties a tile index to a collision
value. That is a deliberate separation: art can overhang, decorate, or lie about the
collision, and collision can exist with no art at all.

The collision palette is **32 discrete cell types**, not geometry — one 16 px icon each
(`sEditor_ui_collisions`, 32 frames at 16 × 16; 32 `oUiLayerCollisionButton` slots in `ROOM
Builder`). The designer's terrain vocabulary is therefore **a fixed alphabet of surface
behaviours**, and complex shapes are spelled out of it: a two-cell ramp is literally the
ordered pair (5, 6), never an angle; a jump-through ledge is a run of value 2; the bottom of
every pit is lined with value 19 along the section's last row.

Art is eight stacked layers per section, "Layer 2 … on top of layer 1, layer 3 on top of
layer 2, and so on" (`README.txt §3`), each layer bound to one of 8 tilesets. Notably the
designer used **at most three of the eight** in any section, and **only one layer in 8 of the
16 sections**. Painting terrain twice does not, in this designer's hands, mean painting it
eight times.

### 4. Objects are a *palette* of pre-authored behaviours with a small property sheet

`README.txt §3`: "All the objects are divided into categories and subpages… Select an
object from the list and add it with RMB. Once you have placed your object, clicking it with
LMB will open its properties on the bottom left. What properties you can edit depend on the
object itself."

So: **the designer never writes behaviour, only chooses it and tunes a handful of numbers.**
The file format matches exactly — one type ID plus ten property slots, whose meaning is
defined by the type. The Builder room shows the property sheet's physical budget: 10 numeric
property buttons, 4 value boxes, 3 booleans, 13 stepper-arrow widgets, one text-entry
button, one music picker, one custom-graphic picker — all in a fixed panel that shows or
hides widgets per type. **A designer-facing property sheet of this editor's class is ~10
fields wide, and most objects use one or two of them** (959 of 1221 rows have col3 = 0 and
1163 have col6 = 0).

Two universal-ish properties are worth naming:
- **Position is free, not snapped.** `README.txt §5`: "E - Toggless grid snapping for
  objects" and "Arrow Keys - Move the selected object pixel by pixel". The data shows the
  designer used this deliberately: cell-snapped structural objects are 100 % grid-aligned
  (type 250: 25/25 aligned in both axes) while collectibles and decoration are mostly not
  (type 0: 56/235 x-aligned).
- **Size is a property, in cells.** `README.txt §5`: "Arrow Keys while holding LCTRL -
  Change the width and height of the selected object". Only some types accept it (58 of
  1221 rows use col6, 88 use col7).

### 5. The Gen/Kill ID: one integer that carries all conditional level state

This is the editor's single most interesting idea and the one most worth stealing
structurally.

`README.txt §3`: "The most important of these properties is the 'Gen/Kill ID', which almost
every object has. It is the ID which determines if an object will appear or disappear when
the player interacts with a gendoor or a killdoor."

The whole mechanism is **one small integer per object** (col3, values 0–12 in the corpus,
0 = unconditional). A trigger region names an ID; every object carrying that ID appears (or
vanishes) when the region is crossed. There are no scripts, no conditions, no events — the
entire dynamic-content system is a shared namespace of ~12 integers.

What that buys the designer, from the corpus:
- **Batch spawning.** `Revenge_Of_Mr_Skops.txt` ID 9 gates 8 collectibles + 6 of one object
  + 2 more — a whole reward pocket that materialises at once.
- **Mixed payloads.** `Pink_Plant_Woods.txt` ID 3 gates {type 129 × 2, type 128 × 2, type
  120 × 1} plus the 2 doors — platforms, hazards and pickups in a single group.
- **Dense reuse.** Each level uses a contiguous run from 1 (1–7, 1–9, 1–10, 1–12) with no
  gaps: the namespace is small enough to hold in your head, and the designer filled it.

The editor invests real UI in this one integer: `README.txt §5` gives it four dedicated
hotkeys (numpad +/− to step it, numpad * to type it, `L` to toggle link visibility) and a
**Quick Linking** gesture — "If you have selected an object, hold LCTRL and click another
object to quickly link them together. This can be useful if you need to change the ID of a
large amount of objects." The lesson: when one field does all the conditional logic, the
editor must make *bulk re-assignment* and *visualising the links* cheap.

### 6. Progress is counted, not scored

`README.txt §2`: "Each level has a set amount of Cages, Gifts and Magician Tokens. Can you
get them all?" — three named collectible *classes*, each with a per-level total the game
derives by counting placed objects. There is no score field, no par time, and no
completion-threshold field anywhere in the file format. The level's difficulty budget is
expressed entirely as `startinghp` (3 in all four levels) plus what the designer placed.

### 7. Custom assets are per-level, external, and the designer's responsibility

`README.txt §4`: music must be `.ogg`, graphics `.png`, everything lives under a single
`Custom/` parent folder (subfolders allowed), and "If you share a level which uses custom
assets you need to bundle those with your level." The format reflects this with
`background_custom` / `music_custom` string fields per section and a custom-graphic object
type.

The manual then states the memory rule in plain terms — "CAUTION is required when using
custom graphics. Since there is no limitation on how many or how big assets you can use,
you could run into memory issues. If you want to use custom graphics for custom tiles, it's
adviced to use a single large image for the entire level layout instead of hundreds of small
ones for each tile." That is the same advice we hold internally about atlas-vs-many-images,
arrived at independently by a fan editor author.

### 8. The editor's own affordances tell you what level-building actually costs

`README.txt §3` and `§5`, read as a list of the operations a designer performs often enough
to need a key:

- **Navigation before everything**: pan (MMB or WASD), zoom (Ctrl+wheel, `,` `.`,
  Ctrl+Enter to reset), vertical wheel scroll, horizontal with Shift, `P` to reset position.
  Nine bindings just to *move around*, because sections are up to 6976 px wide.
- **Template ↔ level swapping** (`Q`) — the tile palette is a *room* you fly to and pick
  from, not a sidebar.
- **Grid guides on/off** (`G`), object snapping on/off (`E`), link visibility on/off (`L`),
  debug objects on/off (`T`) — four independent view filters.
- **Test in place** (`O` to enter test mode, `Q` to fly while testing) — the play/edit loop
  is one keystroke and testing includes a *noclip* camera.
- **Copy/paste for tiles and objects, undo, redo, save** (Ctrl+C/V/Z/Y/S).
- **Pixel nudge and cell resize on the arrow keys**, flip on `F`, delete on `DELETE`.

There are four tabs total — Properties, Collision Types, Tiles, Objects (4 `oUiTab`
instances in `ROOM Builder` confirm the count). The entire authoring surface for a
platformer level is **four tabs, one 35-slot object palette with paging, a 32-icon collision
palette, eight layer rows, and a ~10-field property sheet.**

---

## What stays unknown and why

### The hard blocker

Both `Rayman ReDesigner` and `Rayman Redemption` ship as **YYC-compiled** GameMaker
executables. YYC compiles GML to native code; what survives in `data.win` is the *asset*
metadata — object names, parent links, sprite dimensions and frame counts, room instance
lists, and the string table — but **not the code**. Concretely, the extraction script
(`extract-catalog.csx`) can read `Data.GameObjects`, `Data.Sprites`, `Data.Rooms` and
`Data.Strings`, and there is no `Data.Code` worth reading. The function that assigns meaning
to the thirteen columns, and the function that builds the object palette, are machine code.

Everything below is unknown **because of that**, not because it was not attempted.

### Unknown columns

| col | status | why it cannot be closed |
|---|---|---|
| **9** | **Unknowable from this corpus** | Constant 1.0 in all 1221 rows. Zero variance = zero information. Only a level that varies it (or the loader) could name it. |
| **8** | Unknown | 32 non-zero rows total, 5 distinct values on 5 object types. All odd, hinting at a bitmask; unfalsifiable at this sample size. |
| **10** | Unknown | 11 non-zero rows on 3 object types. |
| **4** | Unknown; a named candidate only | Boolean on 20 types. The Builder room's 3 `oUiObjectBoolBox` widgets match the fact that exactly cols 4, 10, 11 are strictly boolean, and `README.txt §5` documents a flip key — but the only geometric test available (does it track which section edge a transition sits on?) **fails**, so "flip" stays a candidate, not a finding. |
| **11** | Decoded for type 20 only | Its meaning on types 99, 53, 100, 42, 57 (44 of its 48 ones) is unknown, and there is no reason to assume it is the same meaning. |
| **12** | Decoded structurally for type 252 only | On types 315, 243, 244, 99, 9, 39 it takes values up to 12 with no positional or count signal. |
| **5, 6, 7** | Decoded for specific types only | Because the slots are per-type, decoding them on types 20/38/250/251/252/314/315 says nothing about their meaning on the other 121 types. |

### Unknown IDs

**26 of the 128 observed type IDs carry an inferred identity (19 HIGH, 1 MED-HIGH, 5 MED,
1 LOW). 102 stay unnamed.** The reason is structural: positional naming needs a reference
build of the same level, and only 1 of the 4 bundled levels is a recreation.
`Curse_Chaos.txt`, `Revenge_Of_Mr_Skops.txt` and `They_Came_From_Outer_Space.txt` are
original designs — their own `description` fields say so — so their objects have no
counterpart to align against, and **92 of the 128 IDs never appear in
`Pink_Plant_Woods.txt` at all**, which puts them permanently out of reach of this method.

Within `Pink_Plant_Woods.txt` itself the ceiling is lower than it looks: the recreation is
compressed (`section1` is 3200 px against the original room's 4000), and alignment quality
collapses in that section — 33 objects in `section0` and 13 in `section2` found a match
within 16 px, but only **1** in `section1` (`s4-analysis-E.txt`). Where the designer
rebuilt from memory rather than from coordinates, the method has nothing to bite on.

The palette-order route is closed for the reason given above: type ID is a
**category-grouped** re-ordering of a placeable subset of the 511-entry catalogue, and the
categories are constructed in compiled code. We can bound the palette (≈ 380 slots, from
`sEditor_ui_objects`'s 380 frames; 35 slots per page, from `ROOM Builder`'s 35
`oUiObjectButton` instances) and we can exploit local order-preservation within a family —
which is what produced the ten butterfly/mushroom names — but we cannot enumerate it.

### Other unknowns, named honestly

- **Tileset index → which of the 8 templates.** There are 8 tileset slots, 8 picker frames,
  and 8 `Builder_temp_*` rooms whose suffixes are readable (`jun`, `mus`, `mon`, `ima`,
  `cav`, `cak`, `toy`, `ext`), and the theme correlation is suggestive — the recreation of
  a forest level uses tileset 0, the cave level uses tileset 4. But `rooms.txt` does not
  emit a resource index, so the ordering of the room list is not evidence, and one
  suggestive correlation is not a mapping. **UNKNOWN.**
- **Tile index → art.** The row stride is decoded (40 for four tilesets, apparently 60 for
  one), but the sheet's origin, its total row count, and which index is which piece of art
  are not in the level files.
- **Background index → which background**, and **music index → which track.** Bounded only
  (42 background frames; music values up to 58 observed).
- **`background_lock`** — 0 in all 16 sections. Unknowable, same reason as col9.
- **Gendoor vs killdoor.** `README.txt §3` and the sound-name evidence in `strings.txt`
  (8 `sndGendoor*`, 13 `sndKilldoor*`, plus catalogue entries `oGendoor`, `oKilldoor`,
  `oGendoorFairy`, `oKilldoorTing`, `oGendoorBoll`, `oKilldoorBoll`, `oJoeBlockLever_gendoor`,
  `oJoeBlockLever_killdoor`) prove both halves of the mechanism exist and that there are
  many *flavours* of each. Only one type ID in the corpus shows the door signature. Whether
  type 38 is one of them or covers both is **UNKNOWN**.
- **Type 252's identity.** Fully characterised (level-wide serial in col5, grouped by col12,
  placed in evenly-spaced chains) and deliberately left unnamed. It is the second most
  common object in the corpus; naming it on a hunch would poison the table.
- **Collision values 10, 15–18, 20, 21, 23, 25, 30, 31.** Geometry described, names not
  assigned. The behaviour vocabulary is known from `strings.txt`
  (slope / platform / ledge / ice / hurt / drown / bounce); the number→behaviour assignment
  is not.

### What would close these gaps

Recorded so the next pass does not re-derive it:
1. **More levels, especially recreations.** The community published many custom levels; any
   level that recreates a known room adds another Rosetta stone, and any level that varies
   col9 or col4 in a testable way collapses those unknowns. This is the highest-yield
   direction by far and needs no reverse engineering.
2. **Round-tripping through the editor itself.** Placing one known object, saving, and
   diffing the JSON would name a column in one step. Requires running the Windows binary;
   out of scope here.
3. **Not** further static analysis of `data.win`. The code is not there.

---

### Appendix: what this study hands to the build

Structure only — no names, no content, per CP-15.

1. **One 16 px cell grid, two independent painted planes** (collision behaviours, and
   stacked art layers). Do not derive one from the other.
2. **Collision as a small closed alphabet of surface *behaviours*, not geometry.** Ramps as
   ordered cell pairs; a pit floor as a painted band along the bottom row; a jump-through
   ledge as its own cell type. 32 types was enough for four shipped levels; the four levels
   between them used only 22.
3. **Sections as a graph of independently shaped rooms**, joined by objects carrying
   (target room, target spawn ID) — with spawn points that own their IDs, so a room can be
   entered from several places. Verify at author time that every transition's target spawn
   exists; the fan editor's data has zero dangling references, which is exactly the
   invariant a level-law checker should enforce.
4. **One integer per object for all conditional presence.** A tiny shared namespace, dense
   from 1, with editor affordances for bulk re-assignment and link visualisation. This is a
   far cheaper conditional-content model than per-object scripting and it carried four full
   levels.
5. **A ~10-field property sheet per object, meaning defined per type**, with size expressed
   in cells and position free in pixels — and the observed discipline that structural blocks
   snap to the grid while collectibles and decoration deliberately do not.
6. **Decoration in numbered sibling families** (seven of one ambient element, three of
   another) placed off-grid in the dozens per section: the density and the variant count are
   both design data worth matching.
