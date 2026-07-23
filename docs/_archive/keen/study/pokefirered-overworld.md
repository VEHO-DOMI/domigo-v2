I have gathered comprehensive material. Given this is a strict read-only exploration task (no Write/Edit tools available, and file creation is prohibited), I am delivering the full report inline as my final message — the parent agent reads this text output directly. The intended path is noted below.

---

## 10-line summary

1. Studied pokefirered's overworld: `data/maps/*/map.json` (426 maps), `data/layouts/layouts.json`, per-map `scripts.inc`, `src/overworld.c`, `src/fieldmap.c`, `src/field_control_avatar.c`, and `include/constants/*`.
2. Maps split cleanly into a **header** (`map.json`: metadata + 4 event arrays) and a **layout** (`layouts.json` + `map.bin`/`border.bin`: dimensions, tilesets, blockdata, border) — a two-file model worth mirroring.
3. **Connections** stitch adjacent maps seamlessly with a `{map, direction, offset}` triple; `FillSouth/North/West/EastConnection` copy neighbor tiles into a live virtual map so the camera scrolls across borders with no load screen.
4. **Warps** are the discrete-transition counterpart: `{x,y,dest_map,dest_warp_id}`; `dest_warp_id` indexes the *destination* map's warp array and the player spawns at that warp's coords — the reciprocal of your `?from=` model.
5. Doors are warps gated on `MetatileBehavior_IsWarpDoor` + facing north, playing an open/close animation (`TryDoorWarp`, `field_door.c`).
6. Four event arrays per map — `object_events` (NPCs), `warp_events`, `coord_events` (step triggers keyed on a var), `bg_events` (signs/hidden items) — a clean legend vocabulary.
7. Map scripts hook into 7 lifecycle points (`ON_LOAD`, `ON_TRANSITION`, `ON_FRAME_TABLE`, `ON_RESUME`, `ON_WARP_INTO_MAP_TABLE`, `ON_RETURN_TO_FIELD`); story-gated world changes run in `ON_TRANSITION`/`ON_LOAD` and rewrite tiles via `setmetatile` (the exact analog of your sealed-doors/rain variant).
8. Story state = **flags** (1-bit) + **vars** (16-bit), with dedicated temp ranges (`VAR_TEMP_*`, `FLAG_TEMP_*`) reset per-map — a two-tier persistence scheme.
9. Wild encounters live in one central `src/data/wild_encounters.json`, keyed by map, with per-field slot tables (`land`/`water`/`rock_smash`/`fishing`) and a global rate curve — directly comparable to your nodeStyle/due-queue.
10. Report below ranks the 10 structures your W-2 school-world should adopt, each mapped to your `map.json` layout/legend model. Intended path: `.../scratchpad/study/pokefirered-overworld.md`.

---

# pokefirered Overworld Architecture — Source Study for the W-2 School-World

**Header note on provenance.** This report studies `pret/pokefirered`, a community *decompilation* of a Nintendo/Game Freak game. It is a copyrighted Nintendo work reconstructed for research. **ZERO code, data, text, or assets will be copied** into our EFL game. Everything below is architecture-and-design study only: we extract *patterns and data-model shapes*, expressed in our own terms, and re-implement from scratch in TypeScript/Phaser. Every concrete identifier quoted here (e.g. `MAP_SCRIPT_ON_TRANSITION`) is cited to locate the idea in the source, not to transplant it. Paths are relative to `.../scratchpad/pokefirered`.

---

## 1. The Map Data Model

### 1.1 Two-file split: header vs. layout

pokefirered separates every map into two orthogonal artifacts, and this separation is the single most important structural lesson.

- **The map *header*** lives in `data/maps/<MapName>/map.json`. It carries metadata and the four *event* arrays but contains **no tile data**. Example: `data/maps/PalletTown/map.json`.
- **The map *layout*** is registered in `data/layouts/layouts.json` and points at two binary blobs — `data/layouts/<Name>/map.bin` (the block grid) and `border.bin` (the repeating out-of-bounds border). The layout entry declares `width`, `height`, `border_width`, `border_height`, `primary_tileset`, and `secondary_tileset`.

So dimensions and tile geometry belong to the *layout*, while behavior, connections, and events belong to the *header*. Multiple headers can in principle reuse one layout. Compared to our `map.json`, which fuses layout grid and legend/events into one file, this split cleanly isolates "what the room looks like" from "what happens in it."

A representative layout record from `data/layouts/layouts.json`:

```
"id": "LAYOUT_PALLET_TOWN_PLAYERS_HOUSE_1F",
"width": 13, "height": 10,
"border_width": 2, "border_height": 2,
"primary_tileset": "gTileset_Building",
"secondary_tileset": "gTileset_GenericBuilding1",
"border_filepath": ".../border.bin",
"blockdata_filepath": ".../map.bin"
```

The `border_width`/`border_height` fields (2×2) define a small tile block that tiles infinitely beyond the map edge — this is why standing at a map's edge shows an appropriate "void" (water, trees, black) instead of garbage. Our legend model has no border concept; on connected routes we would want one.

### 1.2 Header metadata fields

`PalletTown/map.json` header fields worth cataloguing (each is a design switch we can mirror as map-level flags):

- `id`, `name`, `layout` — identity and the layout link.
- `music` — background track (`MUS_PALLET`).
- `region_map_section` — which named region the map belongs to (for the world map / "you are here").
- `requires_flash` — dark-cave rendering flag.
- `weather` — `WEATHER_SUNNY`, `WEATHER_NONE`, etc. (relevant to our rain variant — weather is a *header* property, overridable by script).
- `map_type` — enumerated in `include/constants/map_types.h`: `MAP_TYPE_TOWN`, `MAP_TYPE_ROUTE`, `MAP_TYPE_INDOOR`, `MAP_TYPE_UNDERGROUND`, plus unused city/ocean/underwater types. This single field drives escape-rope legality, running/cycling, the "map name popup," and battle backdrop.
- `allow_cycling`, `allow_escaping`, `allow_running`, `show_map_name`, `floor_number`, `battle_scene`.

The interior (`PalletTown_PlayersHouse_1F/map.json`) shows the contrast: `map_type: MAP_TYPE_INDOOR`, `weather: WEATHER_NONE`, `allow_running: false`, `show_map_name: false`, and crucially `connections: null`. **Interiors never connect; they only warp.** This is the clean invariant we should adopt: outdoor maps stitch, indoor maps warp.

### 1.3 The four event arrays

Every header carries exactly four event collections. This is the "legend vocabulary" that our map.json legend should converge on:

**(a) `object_events`** — NPCs, items-as-objects, interactable actors. Each entry (from PalletTown):
```
local_id, type, graphics_id, x, y, elevation,
movement_type, movement_range_x, movement_range_y,
trainer_type, trainer_sight_or_berry_tree_id, script, flag
```
Key fields: `graphics_id` (sprite), `movement_type` (see §5), `movement_range_x/y` (the wander bounding box), `script` (interaction handler, `0x0` = none), and `flag` — **if the flag is set, the object is hidden.** Prof. Oak in Pallet Town has `flag: FLAG_HIDE_OAK_IN_PALLET_TOWN`; setting that flag despawns him. This "hide-flag per object" is exactly how story progress adds/removes NPCs without editing the map — a pattern we want.

**(b) `warp_events`** — discrete teleports (doors, stairs, cave mouths). Fields: `x, y, elevation, dest_map, dest_warp_id`. Covered in depth in §2.

**(c) `coord_events`** — step-on triggers ("coordinate scripts"). Fields: `type: trigger, x, y, elevation, var, var_value, script`. The trigger fires **only when the named var currently equals `var_value`.** PalletTown's Oak-blocks-you trigger:
```
"x": 12, "y": 1, "var": "VAR_MAP_SCENE_PALLET_TOWN_OAK",
"var_value": "0", "script": "PalletTown_EventScript_OakTriggerLeft"
```
Because the script's last act is to bump that var past 0, the trigger self-disables — a one-shot cutscene tile. This var-gated trigger is the cleanest primitive for our "walk into the classroom doorway → intro plays once" moments.

**(d) `bg_events`** — background/sign events. Two families, per `include/constants/event_bg.h`:
- **Signs** (`type: sign`): `x, y, elevation, player_facing_dir, script`. `player_facing_dir` = `BG_EVENT_PLAYER_FACING_ANY/NORTH/SOUTH/EAST/WEST` restricts which approach direction triggers it.
- **Hidden items** (`BG_EVENT_HIDDEN_ITEM = 7`) and `BG_EVENT_SECRET_BASE = 8` — invisible interactables keyed to a flag so they can't be re-collected.

Signs differ from object_events in that they occupy a *tile you face into*, not a sprite you bump. In our legend, signs map to "readable props" and hidden items to "one-time collectibles."

---

## 2. Seamless Connections vs. Warp Transitions

This is the crux distinction for a FireRed-style connected overworld, and pokefirered draws the line sharply.

### 2.1 Connections — seamless N/S/E/W stitching

A header's `connections` array declares neighbors with three fields (from `PalletTown/map.json` and `Route1/map.json`):
```
{ "map": "MAP_ROUTE1", "direction": "up",   "offset": 0 }
{ "map": "MAP_PALLET_TOWN", "direction": "down", "offset": 0 }
{ "map": "MAP_VIRIDIAN_CITY", "direction": "up", "offset": -12 }
```
- `direction` — which edge (`up`=north, `down`=south, `left`=west, `right`=east). Constants live in `include/constants/global.h` as `CONNECTION_NORTH/SOUTH/EAST/WEST` (values 2/1/3/4).
- `offset` — the **perpendicular alignment shift** in tiles. A north neighbor wider or narrower than us slides left/right by `offset`. Route 1 connecting up to Viridian City with `offset: -12` means Viridian is shifted 12 tiles so its road lines up with Route 1's.

**How stitching actually works** (`src/fieldmap.c`): on map load, `InitBackupMapLayoutConnections` walks the connection list and calls `FillSouthConnection`/`FillNorthConnection`/`FillWestConnection`/`FillEastConnection` (lines 192–339). Each computes where the neighbor's tiles land in a shared "virtual map" (`VMap`) and `FillConnection` (line 173) `CpuCopy16`s a strip of the neighbor's blockdata directly into the current map's grid buffer beyond its own edge. Concretely, `FillSouthConnection` places the neighbor at `y = mapHeader->height + MAP_OFFSET` and copies `MAP_OFFSET` rows of it. The engine also clamps to the visible virtual-map width and handles negative offsets by trimming the source.

The upshot: **adjacent maps are physically composited into one scrolling tile buffer.** The camera (`src/field_camera.c`) just scrolls; there is no load screen, no fade, no discontinuity. `gMapConnectionFlags` (`overworld.c` line 21) records which edges are open so the border-fill logic (`overworld.c` ~line 581, `if (!gMapConnectionFlags.east)…`) knows to draw the repeating border only on *closed* edges.

When the player physically crosses the seam, `overworld.c` `GetMapConnection(dir)` (line 706) finds the matching connection and `SetWarpDestination(connection->mapGroup, connection->mapNum, -1, x, y)` re-roots the "current map" to the neighbor **at the same world coordinates** — an invisible hand-off, not a teleport. `Overworld_TryMapConnectionMusicTransition` (line 1058) cross-fades the music if the neighbor's track differs.

### 2.2 Warps — discrete transitions

Warps are the opposite: a hard cut with a fade (or a door animation). A `warp_event` names `dest_map` + `dest_warp_id`. The resolution logic (`src/overworld.c`):
- `SetWarpDestinationToMapWarp(group, num, warpId)` → `SetWarpData` stores the target (line 516).
- On the next map load, `SetPlayerCoordsFromWarp` (line 564) does: `pos.x = gMapHeader.events->warps[warpId].x; pos.y = ...warps[warpId].y`. **The player is placed at the destination map's own warp #`warpId`.**

So `dest_warp_id` is an *index into the destination map's `warp_events` array*, and you spawn standing on that warp tile. This is why warps come in reciprocal pairs: Pallet Town's warp to the player's house has `dest_warp_id: 1`, and the house's warp #1 (or #0) points back to Pallet Town. `SetupWarp` in `src/field_control_avatar.c` even auto-registers the return path (`SetDynamicWarp`) for "escape rope" style exits.

**Comparison to our door/`?from=` model.** Our doors carry a `?from=` query naming the origin so the destination knows where to place the player. pokefirered inverts the reference: the origin warp names a *slot number* in the destination, and the destination's warp table holds the actual spawn coordinates. Two consequences:
- Their model keeps spawn coordinates with the map that owns them (single source of truth for "where you appear in this room"), so moving a door inside a room updates all inbound warps automatically.
- Our `?from=` keeps the mapping on the traveling side. If we adopt the pokefirered indexing, each of our interior maps would own a small numbered list of "entry points," and outdoor doors would reference `dest_map + entryPointId` rather than encoding origin. This is more robust when many doors lead to the same interior at different spots.

### 2.3 Doors specifically

Doors are warps with two extra conditions (`TryDoorWarp`, `src/field_control_avatar.c`): the player must be facing **north** (`DIR_NORTH`) and the tile's metatile behavior must be `MetatileBehavior_IsWarpDoor`. When both hold, it runs the standard `SetupWarp` then `DoDoorWarp()`, which triggers the open/close sprite animation in `src/field_door.c` before the fade. Non-door warps (stairs, cave mouths, escalators, ledges) use `TryStartWarpEventScript` and are keyed on other metatile behaviors (`IsWarpMetatileBehavior`, escalators via `DoEscalatorWarp`). So "door" is a *presentation* variant of warp, distinguished by tile behavior + facing.

### 2.4 When to use which — the design rule

- **Connection** = same "world layer," continuous space, want the player to feel the map is one big place (town ↔ its routes ↔ the next town). Used almost exclusively for outdoor `MAP_TYPE_TOWN`/`MAP_TYPE_ROUTE`.
- **Warp** = crossing into a bounded interior or a disjoint area (buildings, caves, floors of a tower). Always used for `MAP_TYPE_INDOOR`, and for outdoor→outdoor where a visual cut is desired (cave entrances).

For our W-2 school world: the **schoolyard/corridors are connected** (seamless), and **each classroom/room is a warp target**. That mirrors town-and-routes vs. buildings exactly.

---

## 3. The Script System & Story-Gated World Changes

### 3.1 Map scripts vs. event scripts

Two script layers, both compiled from per-map `scripts.inc` (e.g. `data/maps/PalletTown/scripts.inc`):

- **Map scripts** — lifecycle hooks bound to the map itself, declared in a `<Map>_MapScripts::` table with `map_script <TYPE>, <label>`.
- **Event scripts** — handlers invoked by an object/coord/bg event's `script` field (e.g. `PalletTown_EventScript_SignLady`).

The seven map-script hook types (`include/constants/map_scripts.h`):
```
ON_LOAD = 1              // before fade-in; safe to rewrite tiles
ON_FRAME_TABLE = 2       // per-frame var-watch table (auto-cutscenes)
ON_TRANSITION = 3        // on entering the map; set up NPC positions/state
ON_WARP_INTO_MAP_TABLE = 4
ON_RESUME = 5
ON_DIVE_WARP = 6         // unused in FRLG
ON_RETURN_TO_FIELD = 7   // returning from menu/battle
```

### 3.2 The `ON_TRANSITION` pattern — reconcile world to story state

`ON_TRANSITION` runs every time you enter the map, *before* it's visible, and its job is to make the map reflect current flags/vars. PalletTown's:
```
PalletTown_OnTransition::
    setworldmapflag FLAG_WORLD_MAP_PALLET_TOWN
    call_if_set FLAG_PALLET_LADY_NOT_BLOCKING_SIGN, ...TryReadySignLady
    call_if_eq VAR_MAP_SCENE_PALLET_TOWN_SIGN_LADY, 0, ...SetSignLadyPos
    call_if_eq VAR_MAP_SCENE_PALLET_TOWN_SIGN_LADY, 1, ...SetSignLadyDone
    end
```
It repositions NPCs (`setobjectxyperm`), rewrites their movement type (`setobjectmovementtype`), and sets vars — all invisibly, so the player never sees the map "snap." This is the canonical way pokefirered avoids baking story state into map files: the map file holds the *default*, and `ON_TRANSITION` mutates it to match progress.

ViridianCity (`data/maps/ViridianCity/scripts.inc`) shows the same for a **gated door** — the exact analog of our sealed doors:
```
ViridianCity_OnTransition::
    ...
    call_if_eq VAR_MAP_SCENE_VIRIDIAN_CITY_GYM_DOOR, 0, ViridianCity_EventScript_TryUnlockGym

ViridianCity_EventScript_TryUnlockGym::
    goto_if_unset FLAG_BADGE02_GET, EventScript_Return
    goto_if_unset FLAG_BADGE03_GET, EventScript_Return
    ... (badges 4,5,6,7) ...
    setvar VAR_MAP_SCENE_VIRIDIAN_CITY_GYM_DOOR, 1
    return
```
Until seven badges are held, a `coord_event` in front of the gym runs `ViridianCity_EventScript_GymDoorLocked` (prints "the doors are locked" and bounces the player back down a ledge). The door isn't physically sealed — a **step-trigger + var gate** simulates sealing. That is precisely the mechanism our sealed-doors design should use: a coord_event guarding the door tile, gated on a progress var, that either lets the warp fire or plays a "not yet" bounce.

### 3.3 The `ON_LOAD` pattern — rewrite the tile grid

`ON_LOAD` runs before render and is where the map's *geometry* is altered via `setmetatile x, y, METATILE_ID, impassable` (macro in `asm/macros/event.inc:1291`). RocketHideout B1F (`data/maps/RocketHideout_B1F/scripts.inc`):
```
RocketHideout_B1F_OnLoad::
    call_if_not_defeated TRAINER_TEAM_ROCKET_GRUNT_12 RocketHideout_B1F_EventScript_SetBarrier

RocketHideout_B1F_EventScript_SetBarrier::
    setmetatile 20, 19, METATILE_SilphCo_HideoutBarrier_TopLeft_Floor, 1
    ... (six tiles) ...
```
If the guarding trainer is undefeated, `ON_LOAD` paints an impassable barrier over six floor tiles; defeating the trainer calls `RemoveBarrier`, which repaints plain floor (`impassable = 0`). **This is our "world changes with story" primitive at the tile level** — the same tool we'd use for the rain variant redressing puddle tiles, or for a corridor that opens after a quest. The map file stores one canonical grid; `ON_LOAD` overlays story deltas.

### 3.4 The `ON_FRAME_TABLE` pattern — auto-firing cutscenes

`ON_FRAME_TABLE` is a per-frame watch list. PalletTown:
```
PalletTown_OnFrame::
    map_script_2 VAR_MAP_SCENE_PALLET_TOWN_OAK, 2, PalletTown_EventScript_OakRatingScene
    .2byte 0
```
`map_script_2 <var>, <value>, <script>` means "each frame, if `var == value`, run `script`." This fires cutscenes automatically on map entry without the player stepping on a specific tile — used for the post-Elite-Four Oak scene. For us, this is "when the player re-enters the schoolyard after finishing Level 3, the teacher walks up automatically."

### 3.5 Story state storage — flags and vars, two tiers each

Story state is two primitive types:
- **Flags** (1-bit booleans) — `include/constants/flags.h`. Used for "has this happened / is this hidden." Includes a **temp tier** `FLAG_TEMP_1…` (`TEMP_FLAGS_START = 0x0`) that is cleared on every map change — scratch space for a single scene.
- **Vars** (16-bit) — `include/constants/vars.h`, range `VARS_START 0x4000 … VARS_END 0x40FF`. Named scene vars like `VAR_MAP_SCENE_PALLET_TOWN_OAK` (`0x4050`) hold multi-state progress (0=not started, 1=in progress, 2=ready, 3=done). A **temp tier** `VAR_TEMP_0…VAR_TEMP_F` (`0x4000–0x400F`) resets per map. There is also a reserved special-var range (`0x8000+`, `SPECIAL_VARS_END 0x8014`) used as function arguments/return (`VAR_RESULT`, `VAR_0x8004`).

The scripting DSL then reads/writes these with `setflag`/`clearflag`/`goto_if_set`/`goto_if_unset` and `setvar`/`copyvar`/`goto_if_eq`/`goto_if_ge`/`call_if_eq`. Our story engine should adopt the same **flags (boolean, permanent + temp) vs. vars (small-int state machines, permanent + temp)** split; it is remarkably economical and covers every gate the game needs.

### 3.6 Locking, movement, and warping inside scripts

Event scripts follow a consistent envelope: `lock`/`lockall` (freeze player + NPCs) → do work → `release`/`releaseall`. Cutscene motion is data: `applymovement <objId>, <MovementData>` plays a list of step macros (`walk_left`, `walk_up`, `walk_in_place_faster_up`, `set_invisible`, `step_end`) and `waitmovement 0` blocks until done. Doors animate with `opendoor x,y` / `waitdooranim` / `closedoor`. Scripts can even `warp MAP_..., x, y` mid-cutscene (Oak dragging you into the lab). The whole PalletTown Oak intro (`PalletTown_EventScript_OakTrigger`) is one long such script — a good reference for how much scripted choreography rides on this tiny command set.

---

## 4. Wild Encounters

### 4.1 One central table, keyed by map

Unlike events (per-map files), **all** wild data sits in a single file: `src/data/wild_encounters.json` (schema mirrored in `include/wild_encounter.h`, logic in `src/wild_encounter.c`). Structure:
```
wild_encounter_groups[] → { label, for_maps, fields[], encounters[] }
fields[] = the slot-count + rate curve per encounter kind
encounters[] = one record per map
```

### 4.2 Encounter kinds and rate curves

The `fields` block defines four encounter *types*, each with a fixed number of slots and a global probability curve (`encounter_rates`):
- `land_mons` — 12 slots, rates `[20,20,10,10,10,10,5,5,4,4,1,1]` (sums to 100). Slot 0 appears 20% of the time, slot 11 only 1%.
- `water_mons` — 5 slots, `[60,30,5,4,1]`.
- `rock_smash_mons` — 5 slots, same curve.
- `fishing_mons` — 10 slots partitioned into `old_rod: [0,1]`, `good_rod: [2,3,4]`, `super_rod: [5..9]`.

### 4.3 Per-map records

Each `encounters[]` entry names a `map`, a `base_label`, and up to four sub-tables. A land table looks like:
```
"map": "MAP_...",
"land_mons": {
    "encounter_rate": 7,
    "mons": [ { "min_level": 25, "max_level": 25, "species": "SPECIES_UNOWN" }, ... ]
}
```
Two levers: `encounter_rate` is the **per-step probability** that *any* encounter triggers on that map (higher = more encounters per step). The `encounter_rates` curve then picks *which* slot within the table. A map with no wild data simply has no record. The step-check itself is wired into movement (`field_control_avatar.c` sets `input->checkStandardWildEncounter`, consumed by the encounter roll).

### 4.4 Comparison to our nodeStyle / due-queue design

Our design surfaces content by node style and a spaced-repetition due-queue; pokefirered surfaces it by *map + weighted slot roll on each step*. The mapping for our EFL game:
- Their **`encounter_rate` per map** ≈ our per-node encounter density; a "grass" tile in a room = a place where a vocabulary/quiz micro-encounter can trigger.
- Their **weighted slot table** ≈ our due-queue *selection weighting*: instead of a flat level table, our slots would be "cards due," and the rate curve becomes a difficulty/urgency weighting so overdue items surface more often — a natural graft of SRS onto the encounter-slot idea.
- Their **central file keyed by map** is a good pattern: keep encounter/quiz content out of the map JSON (which stays about geometry + events) and in one queryable content table keyed by map id. This keeps level designers and content authors in different files.
- Their **encounter kinds** (land/water/fishing) ≈ our nodeStyles: different tile behaviors trigger different content pools. A "reading corner" tile draws from reading items; a "grammar grass" tile from grammar items.

---

## 5. NPC Movement Types Catalogue

From `include/constants/event_object_movement.h`, an object's `movement_type` selects an idle-behavior state machine. The families:

**Static facing (no motion):** `MOVEMENT_TYPE_FACE_UP/DOWN/LEFT/RIGHT` (0x7–0xA) — NPC stands and faces a fixed direction (Mom faces left; Oak faces up). Used for shopkeepers, story NPCs.

**Look-around (turn in place):** `MOVEMENT_TYPE_LOOK_AROUND` (0x1) rotates through directions without stepping. `FACE_DOWN_AND_UP`, `FACE_LEFT_AND_RIGHT`, and the many `FACE_*_AND_*` combos (0xD–0x16) restrict the turning to a subset of directions — a guard glancing left-and-right.

**Wander (random walk in a box):** `MOVEMENT_TYPE_WANDER_AROUND` (0x2) plus axis-limited `WANDER_UP_AND_DOWN`, `WANDER_LEFT_AND_RIGHT`, etc. (0x3–0x6). The wander is bounded by the object's `movement_range_x`/`movement_range_y` (PalletTown's sign lady: `range_x:1, range_y:4` = paces a 1×4 corridor; the fat man: `6×2`). This is the everyday "townsfolk milling about" behavior.

**Deterministic patrol (fixed walk pattern):** `MOVEMENT_TYPE_WALK_UP_AND_DOWN`, `WALK_LEFT_AND_RIGHT` (0x19–0x1C) pace a fixed line, and the enormous `WALK_SEQUENCE_*` family (0x1D–0x34) executes a fixed 4-direction cycle (e.g. `WALK_SEQUENCE_UP_RIGHT_LEFT_DOWN`) — deterministic patrol routes for guards.

**Rotating / spinning:** `ROTATE_COUNTERCLOCKWISE`/`ROTATE_CLOCKWISE` (0x17–0x18) — the classic "spinner" trainers that turn on a timer and catch you when they face you.

**Player-mirroring:** `COPY_PLAYER`, `COPY_PLAYER_OPPOSITE`, `COPY_PLAYER_CLOCKWISE/COUNTERCLOCKWISE` (0x35–0x38) and their `_IN_GRASS` variants (0x3B–0x3E) — the object mimics or mirrors the player's steps (ice-puzzle / mirror-maze NPCs).

**Disguise / special:** `TREE_DISGUISE`, `MOUNTAIN_DISGUISE` (0x39–0x3A), `BURIED` (0x3F), `INVISIBLE` (0x4C), `BERRY_TREE_GROWTH` (0xC), and a large `WALK_IN_PLACE_*` / `JOG_IN_PLACE_*` set (0x40–0x4B) for animated-but-stationary NPCs (someone jogging on the spot). `RAISE_HAND_AND_STOP/JUMP/SWIM` (0x4D–0x4F) are scripted-pose types. `MOVEMENT_TYPE_PLAYER` (0xB) is reserved for the avatar itself.

For our school world the useful subset is small: **FACE_*** (fixed teachers/shopkeepers), **LOOK_AROUND** (glancing kids), **WANDER_*** with a range box (hallway crowd), **WALK_UP_AND_DOWN / WALK_LEFT_AND_RIGHT** (a hall monitor's patrol), and **ROTATE_*** (a "catch-you-if-seen" mini-game NPC). The rest are edge cases we can defer. The critical takeaway is that `movement_type` + `movement_range_x/y` fully specifies idle behavior *declaratively in the map JSON* — no per-NPC code.

---

## 6. Closing — The 10 Overworld Structures Our W-2 School-World Should Adopt

Ranked by leverage for our EFL game, each mapped to our existing `map.json` layout/legend model.

**1. Split header from layout (metadata+events vs. dimensions+grid+tilesets+border).**
Source: `map.json` vs. `layouts.json`. Our `map.json` currently fuses grid, legend, and events. Adopt a two-part shape: a *layout* object owning `width/height/border/tilesets/grid`, and a *header* owning metadata + the four event arrays. Even if kept in one file, keep them as two top-level keys so content and geometry evolve independently.

**2. Seamless N/S/E/W connections with `{map, direction, offset}`.**
Source: `connections` in `PalletTown/map.json`; `FillConnection` in `fieldmap.c`. Add a `connections` array to our outdoor maps (schoolyard ↔ front-gate ↔ sports-field). `offset` aligns mismatched-width neighbors. Our schoolyard-to-corridor transitions become seamless scrolls instead of loads. This is the headline FireRed feel and our legend model has no equivalent yet.

**3. The connection/warp dichotomy as a hard map-type rule.**
Source: `map_type` + `connections: null` on all interiors. Codify: `MAP_TYPE_OUTDOOR` maps may connect; `MAP_TYPE_INDOOR` maps may only warp. This single rule keeps our schoolyard continuous and every classroom a bounded warp target, and prevents accidental "seamless building interiors."

**4. Reciprocal warps indexed by destination slot (`dest_map` + `dest_warp_id`).**
Source: `warp_events` + `SetPlayerCoordsFromWarp` in `overworld.c`. Reconsider our `?from=` model: let each interior own a numbered list of *entry points* (its `warp_events`), and have outbound doors reference `dest_map + entryPointId`. Spawn coordinates live with the room that owns them — more robust when several doors reach one classroom.

**5. Four canonical event arrays as our legend vocabulary.**
Source: `object_events / warp_events / coord_events / bg_events`. Restructure our legend into exactly these four categories. It cleanly separates *actors* (NPCs), *transitions* (doors), *step triggers* (cutscene tiles), and *props/signs/hidden items* — a vocabulary that has survived 400+ maps.

**6. The `ON_TRANSITION` reconcile-to-story hook (for sealed doors & rain variant).**
Source: `PalletTown_OnTransition`, `ViridianCity_EventScript_TryUnlockGym`. Give each map an on-enter hook that runs before render and mutates NPC positions, visibility, and vars to match current progress. Our sealed doors = a progress var checked here; our rain variant = swap weather + repaint puddle tiles here. The map file stores defaults; the hook applies story deltas invisibly.

**7. The `ON_LOAD` + `setmetatile` tile-rewrite primitive.**
Source: `RocketHideout_B1F` barrier. For geometry that changes with story (a corridor that opens, a blocked stairwell, rain puddles), overlay tile edits at load time rather than authoring alternate map files. One canonical grid + scripted deltas = far fewer map variants to maintain.

**8. Two-tier flags + vars story state.**
Source: `include/constants/flags.h`, `vars.h`. Adopt: **flags** (1-bit; permanent for "done/seen/hidden," plus a temp tier cleared per map for single scenes) and **vars** (small ints as scene state machines 0→1→2→3, plus a temp tier). Every gate in FireRed — hidden NPCs, sealed doors, cutscene one-shots — reduces to these two primitives. Wire object-hiding to a `flag` field per NPC exactly as their `flag` does.

**9. Var-gated `coord_events` for one-shot doorway cutscenes and door bounces.**
Source: PalletTown Oak triggers; Viridian locked-gym coord trigger. Our "walk into the classroom → intro plays once" and "try a sealed door → 'not yet' bounce" both become a coord_event at a tile, gated on a var, whose script advances the var to self-disable. This is cleaner than special-casing entrances in code.

**10. Central content table keyed by map (encounters → our SRS due-queue).**
Source: `src/data/wild_encounters.json`. Keep quiz/vocab content out of `map.json` and in one content file keyed by map id, with a per-map trigger density (`encounter_rate` analog) and a weighted slot table repurposed as SRS selection weighting (overdue items = high-rate slots). Different tile behaviors (grass/water/fishing) map to our nodeStyles (grammar/reading/listening pools). Geometry authors and content authors stay in separate files.

**Honorable mention (not top-10 but adopt opportunistically):** the declarative `movement_type` + `movement_range_x/y` NPC-idle system (§5) — specify hallway-crowd and patrol behavior in JSON with zero per-NPC code; and the repeating `border.bin` concept so our connected routes show a clean void at closed edges instead of empty tiles.

---

*End of report. Files studied: `data/maps/PalletTown/map.json`, `data/maps/PalletTown_PlayersHouse_1F/map.json`, `data/maps/Route1/map.json`, `data/maps/PalletTown/scripts.inc`, `data/maps/ViridianCity/scripts.inc`, `data/maps/RocketHideout_B1F/scripts.inc`, `data/layouts/layouts.json`, `src/overworld.c`, `src/fieldmap.c`, `src/field_control_avatar.c`, `src/wild_encounter.c`, `src/data/wild_encounters.json`, and `include/constants/{map_scripts,map_types,event_object_movement,event_bg,global,vars,flags}.h`.*

**Intended report path:** `/private/tmp/claude-501/-Users-veho-Library-Mobile-Documents-com-apple-CloudDocs-Domi-Gym/3f0be190-b9d3-4744-afd2-bdbcad4e829f/scratchpad/study/pokefirered-overworld.md` — I created the `study/` directory but this environment is read-only (no Write/Edit tools; file creation prohibited), so the full report is delivered inline above for the parent agent to persist.