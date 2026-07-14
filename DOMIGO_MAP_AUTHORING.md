# DomiGo `world@1` Map Authoring

## Contract

`world@1` is a schema — the exact permitted shape of connected room data. It lives beside frozen `map@1`; stories without a world file continue through the legacy single-room renderer.

The Grade 1 example is `content/corpus/stories/g1.st.lost-pages/worlds/z01.json`. Its stable world name is `g1.world.lost-pages-school`.

## Fixed measurements

Every tile is 32 × 32 pixels. The camera shows roughly 15 × 11 tiles and follows the student through larger areas.

| Area | Tiles |
|---|---:|
| Book Atrium | 21 × 17 |
| Courtyard | 25 × 17 |
| Main Corridor | 31 × 11 |
| Classroom | 17 × 13 |
| Library | 23 × 19 |
| Hidden Room | 13 × 11 |

## Layer rules

Each area contains four typed token grids:

- `ground`: one visible base tile per cell.
- `objects`: furniture and decoration; use `.` for empty cells.
- `collision`: `#` marks blocked cells.
- `foreground`: art drawn above the player, such as a high shelf edge.

Every row must equal the area width and every layer must equal the area height. A legend maps each one-character token to a stable asset ID. The validator rejects malformed grids, unknown assets, bad spawns, unreachable areas, and broken task/connection references.

## Movement and interaction

A spawn is a named arrival cell plus facing direction. A connection points from one area/cell to a target area/spawn.

- Use `trigger: "action"` for visible doors. The player presses E, Space, or the touch Action button.
- Use `trigger: "edge"` only for an intentional invisible map-edge exit.
- `requiredFlag` keeps a route closed until the server projection contains the flag.
- `lockedText` explains the fiction of a closed route.

People, objects, pages, doors, barriers, and collectibles all use the same contextual interaction system. Keep their IDs stable: persistence and browser tests refer to them.

## Persistent variants

An encounter may apply only declared effects:

- set a story flag;
- open a connection;
- set an area variant;
- reveal an interactable.

Visual movement and replacement are data too: `moveWhenFlag` relocates Frau Berger after the pencil task; `assetWhenFlag` replaces damaged art without changing the map.

## Authoring checklist

1. Draw the walkable route in the collision grid first.
2. Put every spawn on an unblocked in-bounds cell.
3. Add reciprocal door connections where return travel is intended.
4. Add interactions and reference existing corpus task IDs.
5. Add effects and verify every flag/route/asset target exists.
6. Run the schema and connectivity tests before visual polish.
7. Play one calibrated area in a real browser before repeating its visual system.
