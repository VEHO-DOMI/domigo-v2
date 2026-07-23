# Keen 4 game-systems study (KeenWiki + Lohner modding tutorial)

Sources actually fetched (all load-bearing claims cite one of these):
- MAIN: https://keenwiki.shikadi.net/wiki/Keen_4:_Secret_of_the_Oracle
- STORY: https://keenwiki.shikadi.net/wiki/Keen_4_Story
- LEVELS: https://keenwiki.shikadi.net/wiki/Keen_4_Levels
- COUNCIL: https://keenwiki.shikadi.net/wiki/Council_Member
- WETSUIT: https://keenwiki.shikadi.net/wiki/Wetsuit
- SHADOW: https://keenwiki.shikadi.net/wiki/Shadowlands
- PFORB: https://keenwiki.shikadi.net/wiki/Pyramid_of_the_Forbidden
- LINDSEY: https://keenwiki.shikadi.net/wiki/Princess_Lindsey
- EGGS: https://keenwiki.shikadi.net/wiki/Keen_4_Easter_eggs
- MIRAGIA: https://keenwiki.shikadi.net/wiki/Miragia
- MUSIC: https://keenwiki.shikadi.net/wiki/Keen_4_Music
- Creature pages: Arachnut, Berkeloid, Skypest, Wormouth, Lick (same wiki)
- TED5: https://keenwiki.shikadi.net/wiki/TED5
- TUT: https://stefan.lohner-net.de/keen_modding/tutorial/ (single page, 12 sections; site index /keen_modding/ returned 403, tutorial page itself loads)
- 404s: keenwiki /wiki/Janitor, /wiki/Foot_(Keen_4), /wiki/Sprite_(Keen_4) — covered via PFORB/EGGS/MAIN instead.

## 1. Item / value table (MAIN)

Point items (ascending — a clean 6-step candy ladder):
| Item | Points |
|---|---|
| Shikadi Soda | 100 |
| Three-Tooth Gum | 200 |
| Shikkers Candy Bar | 500 |
| Jawbreaker | 1,000 |
| Doughnut | 2,000 |
| Ice Cream Cone | 5,000 |

Non-point items:
| Item | Effect |
|---|---|
| Raindrop (lifewater drop) | collect 100 → extra life |
| Lifewater Flask | instant extra life |
| Neural Stunner pickup | +5 shots (+8 on Easy) |
| Gem (4 colors) | key; unlocks matching gem-socket door |
| Wetsuit | one-time story item; required to enter the island/water levels |

## 2. Enemy table (MAIN + creature pages)

| Enemy | Behavior | Danger / stun |
|---|---|---|
| Poison Slug | slow crawler, leaves deadly green puddles | contact kills; stunnable |
| Wormouth | golf-ball head hiding in grass, tracks Keen, lunges 4x size with sharp teeth (Wormouth page) | only shootable WHILE lunging — one shot stuns it then |
| Lick | hackey-sack hopper; harmless to touch, kills only when breathing fire at close range (Lick page) | "easily stunned" |
| Arachnut | six-legged crab-walker | contact kills; 1 shot stuns for a few seconds, then it REVIVES — never permanent (Arachnut page) |
| Mimrock | disguised rock; moves/jumps only when Keen looks away (MAIN) | contact kills; stunnable |
| Skypest | fast, stupid blood-sucking flyer | IMMUNE to shots; killable only by pogo-squash while it rests on the ground (Skypest page) |
| Berkeloid | floating fire being near fire patches; hurls fireballs that burn on the ground | contact + fireballs kill; fully IMMUNE to stunner (Berkeloid page) |
| Thundercloud | drifting cloud, aims lightning strikes down at Keen | lightning kills; (cloud itself passive between strikes) |
| Bounder | happy red bouncing ball | HARMLESS — a ride: bounces Keen to high places (MAIN) |
| Blue Bird | eagle-like pursuer (hatches from egg) | invincible/immortal (MAIN) |
| Mad Mushroom | huge bouncing mushroom | invincible (MAIN) |
| Dopefish | giant green fish, swallows anything that swims near | lethal, effectively unkillable; distracted by Schoolfish |
| Schoolfish | small fish that follow Keen underwater | harmless — "handy diversion for the Dopefish" (MAIN) |
| Sprite | white underwater guardian (Well of Wishes) | listed harmless on MAIN's summary; dedicated page 404 |
| Treasure Eater | teleporting thief — eats your point items and vanishes (MAIN) | harmless to Keen, punishes dawdling |
| Inchworm / Foot | harmless critters; 12 Inchworms gathered = giant Foot (12 inches = 1 foot pun) (EGGS) | secret-level transport |
| Princess Lindsey / Council Member | friendly NPCs | cannot be shot (LINDSEY) |

Static hazards (all instant-kill, MAIN): Dart Gun (auto-firing wall trap), Fire, Spear (piston spike), Spikes, Poison Pool, Tar Pit, Underwater Mine, Small/Large Thruster (flame-jet platforms).

Design shape worth copying: only ~7 true combat enemies, each with ONE readable gimmick (hides / feigns / flies / immune-to-X), plus a thick layer of harmless-but-characterful fauna, plus instant-kill terrain. Stun (not kill) is the default verb; two enemies are stun-immune to force a second verb (pogo) or avoidance.

## 3. Story-integration devices

- Premise (STORY): Keen intercepts a garbled message that the Shikadi plan to destroy the galaxy → travels to Gnosticus IV to ask the Oracle → the Shikadi "had taken the Council Members, and... imprisoned them in the Shadowlands far to the west." 8 Council Members, one hidden in each of 8 named levels (Perilous Pit, Cave of the Descendents, Crystalus, Lifewater Oasis, Pyramid of Shadows, Pyramid of the Gnosticene Ancients, Isle of Fire, Well of Wishes) (COUNCIL). The Shikadi scattered them precisely to keep the Oracle dark — so every level completion IS a story beat, not a score event.
- Per-level ENTRY TEXTS (LEVELS): every level entry shows a one-line story sentence with a level-specific VERB, e.g. verbatim: "Keen slips into Slug Village", "Keen blazes across the Isle of Fire" (also "Keen plummets into the Perilous Pit"). Same template, different action verb + preposition per mood. Moddable via CKPatch `%level.entry` (TUT §10).
- Rescue framing: touching a Council Member ends the objective for that level; the rescue dialogue even has its own dedicated music cue, "In a Land of Wonderment and Awe" (MUSIC). Exact rescue dialogue not quoted on the wiki pages fetched.
- The Janitor joke (PFORB): the secret level's "prisoner" is not a Council Member at all — a janitor the Shikadi mistook for one; "he tried to tell the Shikadi that he was not a Council Member, but they did not listen." The hardest level in the game pays out a gag, not progress. (Verbatim in-game dialogue not on the wiki pages fetched.)
- NPC hint system (LINDSEY): Princess Lindsey appears in exactly two levels and speaks one hint each, verbatim: "The way to the Pyramid of the Forbidden lies under the Pyramid of Moons." (Chasm of Chills) and "There's gear to help you swim in Three-Tooth Lake. It is hidden in Miragia." (Hillville). She leaves immediately after speaking.
- Ending (STORY): with all 8 rescued the Oracle activates and reveals the real plot — Shikadi = shadow beings building an Armageddon Machine — sending Keen to Korath III (i.e. the ending is a cliffhanger ad for Keen 5).
- Easter eggs (EGGS): stand on the crescent-moon picture in Pyramid of the Moons → Keen moons the player (once per life); 12 Inchworms → giant Foot → flies Keen to the secret pyramid, hinted by the pun "Watch where you step or they'll be afoot!"

## 4. World map structure + gating

- The Shadowlands world map (level 0) spans distinct biomes: dense/tropical forest, mountains, vast desert with pyramids, and the Three-Tooth Lake with islands (SHADOW). 17 regular levels + secret level + the map itself; levels are physical doors placed inside their matching biome (LEVELS).
- Gating is ITEM- and KNOWLEDGE-based, not linear: (a) the Wetsuit, hidden in Miragia, is the hard gate for all Three-Tooth Lake levels — two Council Members sit behind it (WETSUIT, MIRAGIA); (b) the secret level is gated by knowledge (Lindsey's hint) + an in-level puzzle (herd 12 Inchworms in Pyramid of the Moons) (EGGS, PFORB); (c) everything else is open-order — the map itself is the difficulty curve, easy village levels near the start, pyramids and lake deeper in.
- The map is itself animated and playful: Miragia the level-door "constantly disappears and reappears" like a mirage, and Keen must wait for it to fully materialize to enter (MIRAGIA).
- Wetsuit note: the engine doesn't technically enforce the gate — it's a design gate, not a physics one (WETSUIT).

## 5. Modding lore — how levels are actually built

Construction model (TED5 + TUT):
- Every level is THREE stacked grids ("planes") over one tile map: **Background** (decor tiles behind Keen), **Foreground** (the tiles Keen collides with — platforms, walls, pole/door tiles, masked tiles that draw over Keen), and the **Info/Icon plane** (invisible codes on top: enemy spawn markers, item markers, Keen's start, door links, difficulty-dependent spawns, and — on the world map — which level each door tile enters). Enemies/items are not objects you drag around: you "plant" a code in the info plane at a grid cell (TED5; TUT §6 defers plane detail to the wiki).
- Toolchain ritual (TUT): TED5 edits maps in DosBox; after EVERY edit run instant-carma (recompress) or the game errors "Map too tall"; graphics live as exported BMPs re-imported with ModKeen; all text (level names, entry texts, deaths, enemy behavior) is patched via plain-text PATCH4.PAT lines inserted before `%end`.

Dos/don'ts as the tutorial (TUT, §§ noted) and TED5 page teach them:
1. DO keep a two-tile border of tiles around every level edge — "to prevent graphic glitches" (§6). Levels are framed, never bleed to the edge.
2. DO study the original levels before building — open them in the editor to learn "door setup and tile placement" conventions rather than inventing your own (§6).
3. DON'T use the editor's built-in "carmakize maps" — slow and it corrupts compatibility with the rest of the toolchain (§6). Moral: one blessed build pipeline, no shortcuts.
4. DO re-run the compression step after every single map edit before testing (§6) — edit→build→playtest as one atomic loop.
5. DO playtest in the actual game (go4) after each change, and know your error signatures ("Map too tall" = forgot the build step; "EGAHEAD not found" = skipped an init step) (§4, §6, §8).
6. DO create maps deliberately: delete the old map, create a new one with explicit width/height/name — dimensions are a design decision made up front (§6).
7. DO keep level names ~15 characters max — "a good rule of thumb is to not exceed the length of the original level name strings" (§10).
8. DO write both a level NAME and a separate multi-line ENTRY message per level; world map is level 0 (§10). Even death messages are per-map flavor text ("Exit to Shadowlands") (§10).
9. DO keep pristine originals separate from working copies and output (the three-folder structure, §2–3) — never mod in place; the sound editor "doesn't alter originals — safe to experiment" (§8).
10. DO reuse and reskin: enemy behaviors are borrowed as known-good patches from the community, added, tested, and reverted if unsatisfying (§11).
11. Music discipline: max 4 simultaneous notes, ~64KB (~3 min) per IMF track — compose within the constraint, and the world map gets its own track (song 0) (§9).
12. Layer-toggling is the core editing skill: work one plane at a time (keys 1–6 toggle layers; separate active tile per plane) (TED5).
13. Sprite planting is grid-cell precise, and spawn markers can differ by difficulty (info-plane codes) (TED5/TUT §6 deferral) — difficulty = same map, different planting density.
14. DON'T fight the engine's limits: height limits exist (the "Map too tall" failure is the canonical one) — wide-or-modest maps, not skyscrapers (§4/§6).
15. Swapping content beats authoring from scratch (sound-swap workflow §8) — the whole tutorial's philosophy is: replace assets inside a proven skeleton.

## 6. Eight directly-usable takeaways for an EFL kids' Keen-shaped game

1. Score ladder = one themed family of 6 collectibles at 100/200/500/1K/2K/5K — for EFL, make the pickups words of one lexical set, value = rarity.
2. 100 small drops = 1 life + a rare instant-life flask: two saving currencies, one for grinding, one for exploring — perfect for "collect 100 vocab items" loops.
3. One readable gimmick per enemy, stun-not-kill as the default verb, and 1–2 stun-immune enemies to teach a second strategy — enemies as grammar: each one drills exactly one rule.
4. Every level entry is one sentence with a vivid level-specific verb ("Keen slips into…", "Keen blazes across…") — a free, systematic verb-teaching surface: same frame, new verb each level.
5. Rescue-one-NPC-per-level beats "reach the exit": each level completion is a story beat with its own jingle and character — for EFL, each rescued NPC can SAY something (comprehensible-input reward).
6. Hide hints in friendly NPC dialogue (Lindsey's two one-liners gate the wetsuit and the secret level) — reading comprehension becomes the actual key item.
7. Gate the map with one mid-game item (wetsuit) + one secret knowledge-gate, keep everything else open-order, and let the map biomes be the difficulty curve; animate the map (Miragia flicker) so the overworld itself feels alive.
8. Spend your best level on a joke (the Janitor) and hide a cheeky animation (mooning) — kids replay for gags; humor is retention. And build like the modders: framed maps (2-tile border), three planes (decor / collision / invisible spawn-codes), one blessed build-test loop, reskin proven skeletons instead of inventing engines.
