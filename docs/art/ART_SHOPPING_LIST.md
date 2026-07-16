# THE ART SHOPPING LIST — every stem the game lane needs, in generation order

*Fable 5, 2026-07-16 (S1 deliverable → S2's direct input). Status: DOCUMENT.
Ground truth: `apps/web/public/art/` today contains ONLY `g2/` with 8 detective `*_ref` portraits;
every engine surface renders procedural placeholders. Pipeline: generate into the iCloud drop
folder → `docs/art/prep-art.mjs` (48px downsample · palette-quantize · dimension/transparency
verify) → `docs/art/sync-art.mjs --lib/--dest` → `apps/web/public/art/<ns>/` (only-present
discipline; missing stems keep their procedural fallback). Sheets slice via `slice-art.mjs`.
**Law: `_style_key.png` is generated FIRST and referenced by every subsequent prompt. One image
is proven end-to-end (drop → prep → sync → in-game render) in S2 before ANY volume batch.**
Owners: Codex generates (from its lab, Fable-written briefs) · Opus integrates · Koki taste-gates
each batch against the style key.*

Manifest truth: `g1-art-files.json` EXISTS (23 stems — note: BLUEPRINT IV.3b's "35 school stems"
line is stale; 23 is the manifest ground truth) · `g2-art-files.json` EXISTS (126 stems — that is
the DETECTIVE/DOM manifest, LOOK-4's lane, not the Spill) · **`g2-the-spill-art-files.json` does
NOT exist yet** — it is created at GM-B1 from §2 below · an arcade manifest is created at GM-D2
from §3 below.

---

## §1 · G1 school (manifest: `g1-art-files.json`, 23 stems — LIVE list, verbatim)

Drop: iCloud `DomiGo v2 Art Prompts/generated-images/g1-school/` · dest `public/art/g1/school/`
· prompt library `G1_SCHOOL_IMAGE_PROMPTS.html` (LOOK-0 must re-key its CHAR_SPECS to canon
before any character generates).

| class | stems |
|---|---|
| reference (first!) | `_style_key` |
| tiles (16) | `blackboard` `bookshelf` `clock` `desk` `door` `floor` `floor_accent` `plant` `rug` `sparkle` `sparkle_1` `sparkle_2` `teacher_desk` `wall` `wall_top` `window` |
| characters (2) | `finn_down` (kills the Finn-as-desk defect the moment it syncs) · `pixel_down` |
| **ON HOLD** | `player_sheet` (LOOK-0 standing decision: per-student procedural avatars stay until Koki deliberately decides otherwise) |
| ui-optional (3) | `ui_dpad` `ui_questchip` `ui_taskcard` (DOM-layer candidates, not engine tiles — generate last or skip) |

Per-zone G1 growth (the other 14 zones' prop libraries) waits for the GM-E1/E2 retrofit — do not
generate ahead of re-authored rooms.

## §2 · G2 "The Spill" overworld (manifest to create: `g2-the-spill-art-files.json`)

Dest pattern `public/art/g2/<generator>/` (bare generator names — doc 22 §3 naming rule; no
collision with G1's `*-room`). Every zone needs the 5 zone-tinted base stems — the palette arc
(doc 22 §2.5: Act 1 saturates, z07–z11 drain stepwise, z12 grey+one-warm, z13 re-colors, z14–z15
full warmth + Klecks black) means base tiles are PER-ZONE, not shared — plus its F-character
`npc_down` (5 characters cover 15 zones; generate each character ONCE, sync into its zones) and
its props. **Pale/taken props get the Blank's signature treatment: outline + ~20% fill —
consistent everywhere.**

Base stems, every zone (×15): `floor` `wall` `wall_top` `door` `sparkle`.

| zone · generator | npc_down | prop stems |
|---|---|---|
| z01 `classroom` | `berger_down` | `window` `blackboard` `desk` `ink_desk` (leak) |
| z02 `aula` | `emma_down` | `loudspeaker` (leak) `podium` `announcement_sheet` `curtain_rope` |
| z03 `corridor-halloween` | `tarik_down` | `locker` `paper_bat` (leak) `plastic_spider` (leak) `pumpkin_row` `drained_wall` (PALE) |
| z04 `bio-room` | `jona_down` | `hamster_cage` (leak) `aquarium` `bird_poster` `storeroom_shelf` |
| z05 `town-square` | `emma_down` | `shop_sign` (leak) `street_map` `bus_stop` `cinema_marquee` |
| z06 `library` | `finn_down` (cameo) | `adventure_shelf` (leak) `reading_table` `card_catalogue` `window_nook` |
| z07 `schoolyard` | `jona_down` | `tree` `calendar_board` (PALE) `kiosk` `bench` `rain_drain` |
| z08 `gym-spaceport` | `tarik_down` | `vault_rocket` (leak) `rope_antenna` (leak) `scoreboard_console` `airlock_door` |
| z09 `canteen` | `berger_down` | `menu_board` (PALE) `soup_pot` (leak) `tray_rail` `specials_sheet` |
| z10 `home-street` | `jona_down` | `photo_wall` (PALE) `kitchen_table` `post_box` `room_door` |
| z11 `storeroom` | `emma_down` | `nest` `book_crate` `label_shelf` `door_home` |
| z12 `quiet-room` | `jona_down` | `rain_window` `lamp` (the one warm slot) `feelings_cards` `blank_corner` (PALE) |
| z13 `yard-rain` | `tarik_down` | `weather_board` `puddle` (re-coloring leak) `cloud_mural` `sun_patch` |
| z14 `sports-field` | `emma_down` | `warmup_circle` `track` `pale_gym_door` (PALE, the last taking) `pixel_spot` |
| z15 `book-nook` | `berger_down` | `bookshelf` `word_wall` `reading_rug` `cushion` `klecks_cushion` (propDark + white — the NEW color) `plant` |

Totals: 75 per-zone base tiles + 69 props + 5 characters (`berger_down` `emma_down` `tarik_down`
`jona_down` — `finn_down` shared with §1) + 1 Spill style key (may reuse `_style_key` if the
FireRed 48px language carries — GM-B1 decides) ≈ **150 generations**. Generate PER ZONE as each
stage-2 zone lands (GM-D1) — never ahead of an authored room. Zone prompt-library sections come
from doc 22 §3's palette/prop table (B-2 step 7 clone via `sync-art.mjs --lib`).

## §3 · The arcade (bible §9 slots; manifest to create at GM-D2)

Dest `public/art/arcade/` (namespace decided at GM-D2). All at the 48px grid, ink-world language.

| slot | stems | frames |
|---|---|---|
| player sheet | `arcade_player_sheet` | 9 states × 2 facings — stand · walk×4 · jump · fall · pogo×2 · hang · pull-up · look-up · look-down · hurt · victory (bible §9 list verbatim; slice via `slice-art.mjs`) |
| wave-1 creatures (6) | `tintenlaeufer` `huepfer` `flatterklecks` `wortdieb` `sprungkissen` `schattenwolke` | 3–6 frames each + a `_burst` freeze/dissolve sheet per creature |
| wave-2/3 creatures (5) | `lauerer` `klecklein` `panzerklecks` `spiegelklecks` `deckenzunge` | as above — generate only after GM-C3 lands them |
| K-4 boss | `schluckwort_boss_sheet` | after GM-C1 — the duel prototype defines the telegraph frames |
| tile families | `ink_solid` `ink_oneway` `ink_spike` `ink_pedestal` `ink_seal` `ink_gate` `ink_door` (+ `ink_conveyor` later) | per-family; school-world zone reskins reuse the families with zone palettes |
| page fragments | `fragment_lesesaal` („Seite 12 · Die Bibliothekarin") · `fragment_tintenschacht` · one per future level | single illustrations, torn-edge masked, assemble on the map story panel |
| HUD/skins | — none — | rides the existing WorldCopy pack system |

## §4 · The DOM games (manifest: `g2-art-files.json`, 126 stems — LOOK-4 lane)

Already manifest-complete: 44 characters (8 `*_ref` synced ✓) · 14 settings · 34 story beats ·
17 props/evidence · 17 cover/cards. Ligne-claire storybook language (NOT the FireRed key). Rides
WS-C chapter waves (GM-D4); first action is wiring the 8 existing refs as in-game portraits.

## §5 · Batch order (the law S2 executes)

1. `_style_key` — alone, first, gated by Koki before anything else generates.
2. One-image pipeline proof (any §1 tile) — drop → prep → sync → rendered screenshot vs key.
3. §1 g1-school tiles (16) + `finn_down`/`pixel_down` — LOOK-3 wave 1. (`player_sheet` HOLD ·
   `ui_*` last/skip.)
4. §2 Spill zones in GM-B order: z02+z03 (the calibration pair) → wave-1 zones → wave 2 → wave 3;
   the 4 Spill F-characters ride the first batch that needs them (after LOOK-0).
5. §3 arcade: tile families + wave-1 creatures + `fragment_lesesaal`/`_tintenschacht`; player
   sheet + boss sheet after GM-C1; wave-2/3 creatures after GM-C3.
6. §4 LOOK-4 portrait wiring (no generation needed for the first 8) + DOM waves per WS-C.

Per-batch ritual (every batch, no exceptions): style key referenced in every prompt → prep-art
QA → sync → in-game screenshot compared against the key → Koki's 1-minute glance → manifest
updated in the same PR (the manifest IS the sync allowlist — stems not listed don't ship).
