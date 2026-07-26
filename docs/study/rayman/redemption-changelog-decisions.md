# S1 — Ryemanni changelog study: Rayman Redemption + Rayman ReDesigner

**Purpose.** Mine a fan designer's own version-by-version patch notes as a design-decision record, as input for the Painted Book (educational 2D platformer, 6–7-year-old English learners, enemies redeemed via language tasks, never killed).

**Ordering.** Both changelogs run **oldest → newest** (chronological, so the log reads as a development narrative). Within a version, entries follow the designer's own grouping where he used one (New / Fixed / GENERAL / EDITOR / OBJECT / NEW OBJECTS).

**Classification.** Every entry is tagged with exactly one of: `QoL` · `difficulty` · `mechanics/physics` · `content` · `visual/animation` · `bugfix` · `editor-feature` (ReDesigner only).

**Wording.** Entries are compact **factual restatements** of the designer's bullets, not verbatim quotes. Each version block carries its source post URL so any entry can be checked against the original.

**Sourcing note (read this before citing anything).** The two saved GameJolt HTML captures contain only each release post's **lead summary** (one or two sentences) — the bullet lists sit behind "Read article" and were not saved. The permalinks *were* in the captures, and the bullet lists were recovered from GameJolt's own public post endpoint. Full detail in **Coverage & honesty** at the end. Citation form is kept as instructed: `GameJolt changelog vX.Y.Z`.

---

## Summary — the 10 most design-relevant decisions

1. **Difficulty became a mode chosen per save file, not a tuning pass.** Redemption shipped with Classic and Casual and added a third, harsh mode (Demise) a month later — `GameJolt changelog v1.1.0`. *For grade 1: pick the "help level" once per child (or per class) so a single content build serves the fast reader and the struggling one without re-authoring levels.*
2. **Button-mashing was replaced with autofire.** The Bzzit riding sequences stopped asking for rapid presses — `GameJolt changelog v1.0.4`. *For grade 1: never let motor speed gate a language task; a 6-year-old's hand should never be the bottleneck for showing that she knows the word.*
3. **A single progress-blocking bug justified its own emergency release.** 1.1.4 exists to fix one crash that stopped players from advancing, and the designer said so plainly — `GameJolt changelog v1.1.4`. *For grade 1: a child who gets stuck stops learning and does not report the bug — softlocks are the one defect class that must be treated as P0 in the Painted Book.*
4. **Invisible triggers got visible hints.** Sparkles were added to obscure "gendoors" (Rayman-Designer-style objects that appear when a condition is met) — `GameJolt changelog v1.1.0`. *For grade 1: any affordance a child must find has to be signposted; discovery-by-search is an adult pleasure, not a first-grader's.*
5. **A repetitive sound effect got an off switch.** The skid sound became optional — `GameJolt changelog v1.1.0` (and the option's own save bug was then fixed in `GameJolt changelog v1.1.1`). *For grade 1: sensory-comfort toggles are accessibility, not polish — and a preference that does not persist is worse than no preference.*
6. **Mastery was recorded and displayed but never required.** Per-level best times were saved and shown on the world map — `GameJolt changelog v1.1.0`. *For grade 1: an optional visible record (fastest correct run, longest streak) motivates re-play — which is exactly vocabulary repetition — without punishing the slow child.*
7. **"What am I missing?" was answered by the game, not by the player's notebook.** Collectible locators were made available as an option — `GameJolt changelog v1.4.0`; Redemption additionally drew already-collected and not-yet-reachable items as transparent ghosts. *For grade 1: show the remaining cages/words as visible ghosts so progress is legible at a glance and revisiting is guided, not guessed.*
8. **Colour was never allowed to be the only channel.** Coloured collectibles shipped with an optional ColorADD symbol overlay for colour-blind players, and instakill hazards were given a red glow so the lethal one is identifiable independent of hue — GameJolt devlog posts, 2020-09-27 and 2020-10-15 (pre-release, ReDesigner). *For grade 1: task-critical distinctions (which word-token is correct, which hazard hurts) must carry a shape or symbol as well as a colour.*
9. **Widening the viewport was treated as a level-design contract, not a display setting.** 16:9 became default with 4:3 kept as an option, every existing level declared backwards compatible, and boss arenas kept borders so wide-screen players got no fairness advantage — GameJolt devlog post, 2019-09-06. *For grade 1: how much a child can see is a difficulty dial (22×14 cells at RS3 in the Painted Book) — lock it early, and give bosses/guardian scenes a bounded arena so the fight reads the same for everyone.*
10. **Destructive actions were put behind a confirmation, and defaults were chosen to prevent confusion.** A confirm-before-restart prompt was added — `GameJolt changelog v1.4.1`; a save-before-leaving prompt — `GameJolt changelog v1.0.0`; trigger objects defaulted to size 1 instead of 0 specifically "to avoid confusion" — `GameJolt changelog v0.1.2` (all ReDesigner). *For grade 1: children mis-tap constantly — restart/exit needs a gate, and every default value should be the one that makes the thing visibly work.*

---

## Rayman Redemption changelog (per version)

Base game released 19 June 2020 after three years of development; final version 1.1.4 (18 November 2020). Nine worlds, added collectibles (Magician tokens, hidden Gifts), added bonus world.

### v1.0.0 — 19 June 2020 (initial release)
No changelog post exists for 1.0.0. The release-window posts are announcements only ("Rayman Redemption will release tomorrow at 12:00 UTC", 2020-06-18; "After 3 years of development … NEXT FRIDAY! 19.6.2020!", 2020-06-12). Treat 1.0.0 as the baseline; all decisions below are changes *to* it.

### v1.0.1 — 20 June 2020 (one day after launch)
Post: https://gamejolt.com/p/2x4rkxgu
- `[bugfix]` Multiple dialogue typos corrected — GameJolt changelog v1.0.1
- `[bugfix]` 4:3 screen was cut off at the bottom — GameJolt changelog v1.0.1
- `[bugfix]` Some control bindings were not saved — GameJolt changelog v1.0.1
- `[visual/animation]` Skin-related visual glitches — GameJolt changelog v1.0.1
- `[bugfix]` Fullscreen state not saved when toggled with alt+enter — GameJolt changelog v1.0.1
- `[bugfix]` Multiple missing collisions in maps — GameJolt changelog v1.0.1
- `[mechanics/physics]` Chase bosses caused Rayman to start floating in the air — GameJolt changelog v1.0.1
- `[bugfix]` Bongo Hills midboss softlock — GameJolt changelog v1.0.1
- `[bugfix]` Picture City pencil-related softlocks — GameJolt changelog v1.0.1
- `[bugfix]` Mr Dark crash — GameJolt changelog v1.0.1
- `[visual/animation]` Other minor visual glitches — GameJolt changelog v1.0.1

### v1.0.2 — 21 June 2020
Post: https://gamejolt.com/p/dyewmnhz
- `[bugfix]` Collisions in some maps — GameJolt changelog v1.0.2
- `[bugfix]` Falling-pencil softlock — GameJolt changelog v1.0.2
- `[bugfix]` Shop consumables did not activate in one level — GameJolt changelog v1.0.2
- `[bugfix]` A cheat-related crash — GameJolt changelog v1.0.2
- `[mechanics/physics]` Could not jump after landing on a pan while helicoptering — GameJolt changelog v1.0.2

Companion post the same day (https://gamejolt.com/p/6cwzbs8k): save files carry across updates; players must delete the old folder and unzip fresh rather than overwrite, or the shops break — `[QoL]` update hygiene stated as an explicit instruction rather than left to chance.

### v1.0.3 — 23 June 2020
Post: https://gamejolt.com/p/7yhmrs5d
- `[bugfix]` Collision fixes in several maps — GameJolt changelog v1.0.3
- `[bugfix]` Checkpoint saved instantly after respawn — GameJolt changelog v1.0.3
- `[bugfix]` A cheat-related crash — GameJolt changelog v1.0.3
- `[bugfix]` Boss-rush timer did not reset correctly — GameJolt changelog v1.0.3
- `[mechanics/physics]` Infinite arcade spin — GameJolt changelog v1.0.3
- `[QoL]` Custom keyboard bindings no longer interfere when typing cheat codes or save-file names — GameJolt changelog v1.0.3
- `[QoL]` Menu navigation now works with custom directional bindings — GameJolt changelog v1.0.3
- `[bugfix]` Crash when loading certain save-file names — GameJolt changelog v1.0.3
- `[bugfix]` Dark Rayman tracked the player even while frozen during dialogue — GameJolt changelog v1.0.3

Same-day follow-up (https://gamejolt.com/p/mmygdeet): the designer forgot to increment the in-game version number, and said so publicly rather than silently re-releasing.

### v1.0.4 — 24 June 2020
Post: https://gamejolt.com/p/f3j9brfj
- `[content]` Minor level-design fixes throughout — GameJolt changelog v1.0.4
- `[visual/animation]` Ledge-edge animation appeared on slopes — GameJolt changelog v1.0.4
- **`[QoL]` Bzzit sequences: button-mashing replaced with autofire — GameJolt changelog v1.0.4**
- `[bugfix]` Bzzit skin appeared in boss rush — GameJolt changelog v1.0.4
- `[difficulty]` Boss-rush power-ups were placed too low — GameJolt changelog v1.0.4
- `[content]` Changes to some cheat codes — GameJolt changelog v1.0.4
- `[bugfix]` Dark Rayman did not react properly to small Rayman — GameJolt changelog v1.0.4

Delivery decision in the same post: from 1.0.4 on, a patch zip with only new/changed files was published alongside the full download — `[QoL]` cheaper updating for players on slow connections.

### v1.0.5 — 29 June 2020
Post: https://gamejolt.com/p/gb8xxwkk
- `[bugfix]` Optional timer did not appear correctly in some boss stages — GameJolt changelog v1.0.5
- `[visual/animation]` Various animation errors — GameJolt changelog v1.0.5
- `[bugfix]` Rare chance Mr Dark stopped attacking after the game was paused — GameJolt changelog v1.0.5
- `[bugfix]` Level-layout softlock in Playtopia level 2 — GameJolt changelog v1.0.5
- `[bugfix]` Classic camera did not follow the player when jumping off rings — GameJolt changelog v1.0.5
- `[bugfix]` Dark Rayman cheat-related crash — GameJolt changelog v1.0.5
- `[mechanics/physics]` Flood stone-ledge zip (movement exploit) — GameJolt changelog v1.0.5
- `[visual/animation]` Default Windows cursor was visible over the game — GameJolt changelog v1.0.5

### v1.1.0 — 13 July 2020 (the design update)
Post: https://gamejolt.com/p/nqx3twey — lead: "Included is a new difficulty mode for those who are looking for a great challenge!"

New:
- **`[difficulty]` New difficulty mode "Demise" — GameJolt changelog v1.1.0**
- **`[QoL]` Option to turn off the skid sound effect — GameJolt changelog v1.1.0**
- `[content]` Bzzit medallions also turn golden once all collectibles are found — GameJolt changelog v1.1.0
- **`[QoL]` Per-level best time is now saved and displayed on the map — GameJolt changelog v1.1.0**

Fixed:
- `[mechanics/physics]` Delay after heli-punching — GameJolt changelog v1.1.0
- `[visual/animation]` True Boss Rush icons now use the true-boss colours — GameJolt changelog v1.1.0
- `[visual/animation]` Darker Mr. Dark's True Boss Rush colours altered — GameJolt changelog v1.1.0
- `[visual/animation]` Cabin boys' sprites altered — GameJolt changelog v1.1.0 *(this is the space-pirate-to-robot redesign that drew the strongest community pushback; see cross-reference note below)*
- `[bugfix]` More bosses could softlock when the pause button was spammed — GameJolt changelog v1.1.0
- `[QoL]` Volume of loud music tracks decreased — GameJolt changelog v1.1.0
- **`[QoL]` Hint sparkles added to obscure gendoors — GameJolt changelog v1.1.0**
- `[bugfix]` Cheat-related crash — GameJolt changelog v1.1.0
- `[bugfix]` Small-Rayman softlock in Brain Games — GameJolt changelog v1.1.0
- `[mechanics/physics]` Super-helicopter clip — GameJolt changelog v1.1.0
- `[content]` Invisible wall removed from the Lonely Cliffs — GameJolt changelog v1.1.0
- `[mechanics/physics]` Helicoptering into the run curse disabled jumping — GameJolt changelog v1.1.0
- `[QoL]` Timers now display minutes — GameJolt changelog v1.1.0
- `[bugfix]` Pausing during boss rush returned the player to the map — GameJolt changelog v1.1.0

### v1.1.1 — 14 November 2020 (four months later)
Post: https://gamejolt.com/p/stqgmbd7 — lead: "This update mostly focuses on fixing some bugs and glitched reported since the last update."

New:
- `[content]` An important new message added to the start-up disclaimer (fangame/IP notice) — GameJolt changelog v1.1.1
- `[content]` Main-menu link to ReDesigner's GameJolt page — GameJolt changelog v1.1.1
- `[visual/animation]` Bzzit's shot is golden when the player has the goldfist — GameJolt changelog v1.1.1
- `[content]` The binoculars disappear once the game has been beaten — GameJolt changelog v1.1.1

Fixed:
- `[bugfix]` The skid-SFX option was not saved — GameJolt changelog v1.1.1
- `[bugfix]` The Menace spawned a second health bar after splitting in half — GameJolt changelog v1.1.1
- `[difficulty]` A couple of spots were impossible as Dark Rayman — GameJolt changelog v1.1.1
- `[bugfix]` Dark Rayman did not spawn correctly in some cases — GameJolt changelog v1.1.1
- `[bugfix]` Romama fight: the hoplite kept walking during the fireball attack — GameJolt changelog v1.1.1
- `[mechanics/physics]` Mr Stone fight: the returning fist grabbed the rings — GameJolt changelog v1.1.1
- `[mechanics/physics]` Mr Stone fight: the stonepile ignored Rayman's facing when punched — GameJolt changelog v1.1.1
- `[bugfix]` Classic camera did not follow Rayman while hanging on a ring — GameJolt changelog v1.1.1

### v1.1.2 — 15 November 2020
Post: https://gamejolt.com/p/tp8xmeh3 — lead: "This update includes fixes I forgot to implement for 1.1.1."
- `[bugfix]` Two sound effects were pitched too high — GameJolt changelog v1.1.2
- **`[difficulty]` The gap that 1.1.1 made too tight was widened again (regression fix) — GameJolt changelog v1.1.2**
- `[bugfix]` Mr Dark fight: the ball phase sometimes did not rebound correctly — GameJolt changelog v1.1.2
- **`[difficulty]` Breakable boulders returned to 4 HP instead of 5 — GameJolt changelog v1.1.2**
- `[visual/animation]` Dark Chimera glass paintings given distinct colours in True Boss Rush — GameJolt changelog v1.1.2
- *(joke entry: "Removed Globox" — a running gag; Globox is not in Rayman 1 and never was in the game)*

### v1.1.3 — 16 November 2020
Post: https://gamejolt.com/p/efwdempu — lead: "More tiny fixes and additions."
- `[visual/animation]` Collision-type overlays (a debug view) were visible in Eat At Joe's — GameJolt changelog v1.1.3
- `[visual/animation]` Glass paintings did not flash correctly in True Boss Rush — GameJolt changelog v1.1.3
- `[bugfix]` Shop-bought power-ups did not activate in all Bzzit levels — GameJolt changelog v1.1.3
- `[bugfix]` One more sound effect with the wrong pitch — GameJolt changelog v1.1.3
- `[visual/animation]` Dead piranhas now splash when they hit water — GameJolt changelog v1.1.3
- `[visual/animation]` Missing sound effect added for scared Livingstones — GameJolt changelog v1.1.3
- *(joke entry: "Removed Globox")*

### v1.1.4 — 18 November 2020 (final version)
Post: https://gamejolt.com/p/un2pthix — lead: "This update only fixes one bug that was introduced in the previous update. I couldn't leave it hanging, since it was progress preventing."
- **`[bugfix]` Some Bzzit levels restarted the game (progress-preventing) — GameJolt changelog v1.1.4**
- *(joke entry: "Removed Globox")*

### Redemption design decisions from devlog prose (not changelog entries)
Design-relevant prose in the same post feed, useful because it states *reasoning* the changelogs omit. Cited as devlog posts, not changelog entries.
- **Widescreen as a design contract** (2019-09-06, https://gamejolt.com/p/bbxrg2dn): 16:9 default, 4:3 optional; every level built so far declared backwards compatible; only boss levels keep borders, to keep fights fair for 4:3 players and to protect the background art. Preceded by a public poll (2019-08-30).
- **Accessibility considered early, shipped later** (2019-04-20, https://gamejolt.com/p/tzjyy6db): first iteration of the optional "classic camera", plus an explicit statement that infinite lives and longer invincibility frames were being considered "for those who had hard time with the original game" — which is exactly what Casual mode became.
- **Anti-frustration content design** (2019-12-23 end-of-year blog, https://gamejolt.com/p/kbjiepfw): each world gets three bonus level types (timed race, Electoon hunt, obstacle course), and the obstacle course deliberately has **no countdown timer**; achievements were designed to be *interesting* constraints (finish a level without collecting any Tings, or without killing any enemies) rather than "you completed world 3".
- **A skip was deliberately removed** (2019-09-30, https://gamejolt.com/p/fygj7tuv): the Tentacle Flower can no longer be bypassed — "you gotta beat it fair and square to proceed". *Note for the Painted Book: this is the one decision on this list to invert — a 6-year-old needs the skip.*
- **A cosmetic system that never touches ability** (2018-06-21, https://gamejolt.com/p/ntqwarsq): skins are bought with in-game currency and "none affect the gameplay or Rayman's skills".
- **A public issue tracker as a design artifact** (2019-06-16, https://gamejolt.com/p/pnpeg8tk): during the demo the designer kept one post listing every reported issue with a plain-language description each, marking which were already fixed — including physics complaints ("Rayman's jump supposedly feels slower than in the original") and requests for a dedicated crouch button and toggle-instead-of-hold run/helicopter options.
- **Powers not gated** (documented in the Rayfanpedia capture): Rayman starts with all abilities; grimace and running moved to separate buttons and are no longer mutually exclusive. The capture's own comment thread contains a player arguing *for* keeping unlocks ("It made the early levels … somewhat challenging. It also added a feeling of progression"), i.e. the designer knowingly traded progression-feel for a clean control model.

---

## Rayman ReDesigner changelog (per version)

Standalone level editor for Redemption, released 4 February 2021 (public alpha 0.1.0 on 2 January 2021), final version 1.4.4 (23 January 2023). `gendoor` / `killdoor` = trigger objects inherited from Rayman Designer that make objects appear/disappear by shared ID.

### Pre-release devlog "Blerbs" (23 Sep – 20 Dec 2020) — design decisions before v0.1.0
Not changelog entries; cited as GameJolt devlog posts. These are the *authoring-tool* decisions.
- `[editor-feature]` Moving big prickly hazards — chosen as blerb #1 precisely because it was impossible in the original Designer (2020-09-23).
- `[mechanics/physics]` Red variants of pink springs and poles: the poles self-destruct, the springs move downwards with each bounce (2020-09-25).
- **`[editor-feature]` Coloured collectibles return with gendoor/killdoor support, plus an option to enable ColorADD symbols "which should help colour blind people recognize them more easily" (2020-09-27).**
- `[content]` Many new set pieces and tiles per world, with a community tileset creator credited by name (2020-09-30).
- **`[visual/animation]` Any prickly colour can be the lethal one; a red glow marks which hazards actually kill, so lethality is readable independent of hue (2020-10-15).**
- `[editor-feature]` Gendoor/killdoor levers kept as a *separate* object from the levers that drive UFO platforms — one lever type, one meaning (2020-10-20).
- `[content]` Power-up suits, each opening one verb: Heavy Metal Fist (destroys enemies and obstacles), Lockjaw (grab special metallic rings), Vortex (activates screw platforms), Superheli (deliberately time-limited), Shockrocket (remote-controllable rocket), purple combat fatigues (super-jump successor) (2020-10-23 → 10-30).
- `[editor-feature]` Eight sections per level, so authors can build original-style levels, branching paths or bonus areas; portals offered as an alternative way to move between sections (2020-11-03).
- `[mechanics/physics]` Mounts (Bzzit, robot dinosaur) can be dismounted at any time with the grimace button (2020-11-11, 2020-11-23).
- `[editor-feature]` Shrink and Grow fairies that change size **one way only**, alongside the original two-way fairy — the author picks the guaranteed outcome (2020-11-16).
- **`[editor-feature]` Scope decision: no background/foreground hopping, so the R2-prototype "shower" teleporters became plain teleporters (2020-11-17).**
- `[editor-feature]` Custom music and custom backgrounds per level (2020-11-26).

### v0.1.0 — 2 January 2021 (public alpha)
Post: https://gamejolt.com/p/7jvp5gyv — no bullet list; the lead states plainly that the build *will* contain bugs and asks for feedback. Same-day follow-up (https://gamejolt.com/p/smam6crr) designates the GameJolt page as the single bug-report channel: "I see every comment."

### v0.1.1 — 3 January 2021
Post: https://gamejolt.com/p/7umgf8kw
- `[bugfix]` 27 fixes in the first 24 hours, mostly crashes and state bugs. Notable, because each names a general platformer failure mode: power-up timers kept counting down while paused; instakill hazards ignored invincibility frames; checkpoints did not work; collectibles stayed collected in test mode; UI did not scale at some resolutions; snap-to-grid was not carried into test mode; a killdoored ring while hanging glitched — GameJolt changelog v0.1.1

### v0.1.2 — 5 January 2021
Post: https://gamejolt.com/p/9vupeeu5
- `[bugfix]` 11 fixes: crashes around mounts, rings and 1-ups; could not dismount with a gamepad; WASD camera movement was too fast; checkpoint showed the wrong head sprite with a power-up — GameJolt changelog v0.1.2
- `[QoL]` The save dialog now defaults to the working directory — GameJolt changelog v0.1.2
- `[editor-feature]` Customizable hotkeys for "reset camera position" and "enter test mode" — GameJolt changelog v0.1.2
- **`[editor-feature]` Trigger objects now default to width and height 1 instead of 0, "to avoid confusion" — GameJolt changelog v0.1.2**

### v0.1.3 — 6 January 2021
Post: https://gamejolt.com/p/ihztyewx
- `[bugfix]` 10 fixes: all gendoors defaulted to size 0; the skid-SFX option did not save; dino fire sound continued after dismounting; could still climb while using the shockrocket; could not ledge-hang under an instakill tile; rain did not stop when paused — GameJolt changelog v0.1.3
- `[editor-feature]` The test-mode hotkey now works in both directions (enter and exit) — GameJolt changelog v0.1.3

### v0.1.4 — 12 January 2021
Post: https://gamejolt.com/p/h7s25zrm
- `[bugfix]` 22 fixes: crashes on entering test mode from the template and on editing one world; mouse-wheel scrolling broken; foreground elements drew in front of darkness; several objects ignored sticky ground and water types; gendoored objects lost their properties; enemies made sounds while off-screen; Mr Sax got stuck walking after being hit — GameJolt changelog v0.1.4
- **`[mechanics/physics]` Chase bosses now push the player further away, to avoid the player getting stuck inside them — GameJolt changelog v0.1.4**
- `[editor-feature]` Number keys 1–4 switch editor tabs — GameJolt changelog v0.1.4
- `[QoL]` Zoom level, current tab and current object page are remembered when entering test mode — GameJolt changelog v0.1.4

### v1.0.0 — 4 February 2021 (first main release)
Post: https://gamejolt.com/p/3csrdumu — lead: "After all the bug fixes so far … I'm now confident enough to call this update the first main release."

Additions:
- `[content]` Signs with arrows — GameJolt changelog v1.0.0
- `[content]` The cymbal trap — GameJolt changelog v1.0.0
- `[difficulty]` The rigged power-ups from Redemption's Demise mode (power-ups that hurt you) exposed as authorable objects — GameJolt changelog v1.0.0
- `[content]` A reinforced wall breakable only with the heavy metal fist — GameJolt changelog v1.0.0
- `[content]` A downwards water mover — GameJolt changelog v1.0.0
- `[content]` Red and yellow water variants — GameJolt changelog v1.0.0
- `[editor-feature]` Gendoor/killdoor sound effects can be changed — GameJolt changelog v1.0.0
- `[editor-feature]` Grid lines can be shown — GameJolt changelog v1.0.0
- `[editor-feature]` Tile layers can be moved easily — GameJolt changelog v1.0.0
- `[editor-feature]` Size option for floating text — GameJolt changelog v1.0.0
- `[content]` New tiles for every tileset, mainly sticky ground per world — GameJolt changelog v1.0.0
- **`[editor-feature]` A lot of new example pieces added to every tile template (worked examples for authors) — GameJolt changelog v1.0.0**
- `[editor-feature]` Sound-effect preview for objects whose sound can be changed — GameJolt changelog v1.0.0
- `[editor-feature]` Object properties accept a typed value, not just clicking — GameJolt changelog v1.0.0
- **`[QoL]` Confirmation box asks you to save when leaving the editor — GameJolt changelog v1.0.0**
- `[editor-feature]` Keyboard hotkeys for zooming — GameJolt changelog v1.0.0
- `[QoL]` The "wrong editor version" pop-up became plain text instead of a modal — GameJolt changelog v1.0.0
- `[QoL]` The editor remembers the last selected tile layer after test mode — GameJolt changelog v1.0.0

Fixes (28 total; the ones that name a general lesson):
- `[bugfix]` Sticky collision type did not work on the very edge of a tile — GameJolt changelog v1.0.0
- `[visual/animation]` Level borders were not visible enough when zoomed out — GameJolt changelog v1.0.0
- `[bugfix]` UI text overflowed in various places — GameJolt changelog v1.0.0
- `[bugfix]` Liquids behaved oddly when stacked; several objects did not splash into water properly — GameJolt changelog v1.0.0
- `[bugfix]` Custom music ignored the audio settings — GameJolt changelog v1.0.0
- `[bugfix]` Remaining 23 fixes: mirrored/flipped platform labels, killdoor edge cases (bongo monk, toy key, reflectors off-screen), curse cleaner missing the low-gravity curse, master key not working, foreground elements triggering lava fog, background tearing, floating-text spacing — GameJolt changelog v1.0.0

### v1.0.1 — 5 February 2021
Post: https://gamejolt.com/p/yuiigpwn — lead notes the headline symptom in plain language: "Playtopia tiles are no longer invisible."
- `[editor-feature]` Flip option added for breakable walls — GameJolt changelog v1.0.1
- `[bugfix]` 19 fixes: invisible Playtopia tiles; visible colliders on the prickly swing; mis-named and mis-rotating objects ("Arrow Sign Left", "Rotating Candy Ball Left"); crash on invalid property values; a property mislabelled "Flipped" instead of "Sway up and down"; could stand on the ledge of instakilling platforms; sticky state retained on slopes; gendoored text and signs losing size/colour; teleportation glitch with rotating ball platforms; Rayman reacting to springs while swinging on a ring — GameJolt changelog v1.0.1

### v1.0.2 — 5 February 2021
Post: https://gamejolt.com/p/5x4tiqbt — **no changelog by design.** Lead: some of 1.0.1's fixes "just straight up didn't work"; 1.0.2 is a rebuild of the same version, so 1.0.1's changelog stands. `[QoL]` release-hygiene decision: renumber and tell players to report only against the newest build.

### v1.1.0 — 10 February 2021
Post: https://gamejolt.com/p/3uzjemmm
- **`[editor-feature]` Custom skins by editing `Custom_skin.png` / `Custom_skin_fist.png` — modding via plain image files, no tooling — GameJolt changelog v1.1.0**
- `[content]` New ink tiles for the Picture City template — GameJolt changelog v1.1.0
- `[content]` Missing Dark Legacy tiles plus more example pieces in the extra template — GameJolt changelog v1.1.0
- **`[difficulty]` Coloured collectibles now stay collected after death — GameJolt changelog v1.1.0**
- `[visual/animation]` Water-stopper visuals changed — GameJolt changelog v1.1.0
- `[bugfix]` 12 fixes: yellow/red water sway option, crash when reordering layers, typed property values not applying, missing collision in the Band Land template, "stop on block" platforms not respawning, tightly packed toy-key doors, crashes with lava/mounts/rings/custom skins, floating glitch when climbing on a ledge, same-frame gendoor/killdoor activation — GameJolt changelog v1.1.0
- **Breaking-change notice, posted separately (https://gamejolt.com/p/rn4gm7ks): coloured tings changed format, so every existing level must be re-opened and re-saved or all tings behave as already collected. `[QoL]` migration announced loudly and separately from the changelog.**

### v1.1.1 — 11 February 2021
Post: https://gamejolt.com/p/qcqe3das
- `[bugfix]` 5 fixes: crash when reloading a custom skin; custom skin showed SNES hands with the goldfist; checkpoints showed the wrong head with a custom skin; toy-key crash; could drop off a ledge while shooting a rocket — GameJolt changelog v1.1.1

### v1.2.0 — 27 February 2021
Post: https://gamejolt.com/p/n5zp8xa9 — lead announces this as "most likely the final content update" and thanks suggesters, bug reporters and level makers by name-group.
- `[content]` New collectible "Bolls", behaving like the old coloured tings — GameJolt changelog v1.2.0
- `[editor-feature]` Option to make rising water rubberband — GameJolt changelog v1.2.0
- `[QoL]` The extras menu moved into the main menu — GameJolt changelog v1.2.0
- `[editor-feature]` Direction strings on direction blocks renamed for clarity — GameJolt changelog v1.2.0
- `[bugfix]` 16 fixes: corrupted-section bug when dying during a magician exit; pushing joeballs underwater by quick-jumping; killdooring falling platforms after use; sprite errors with custom skins at checkpoints; riding a pan while mounted; grimace freezing movement on a pan; UI error when finishing a level while invincible; repeated trigger SFX on restart; gendoored candy balls rotating the wrong way; objects ignoring bouncy tiles; enemies ignoring water; Rayman able to leave the screen while hanging on a ring; an error in the bundled level "Curse Chaos" — GameJolt changelog v1.2.0

### v1.2.1 — 9 March 2021
Post: https://gamejolt.com/p/cc223mwp
- `[QoL]` A dead option ("Dialogue sound style") removed from the options screen because it no longer did anything — GameJolt changelog v1.2.1
- `[bugfix]` 5 fixes: wrong page count in the Technical tab; Rayman's sprite after going off-screen with the golden ring; toy cars not moving after being gendoored; custom music ignoring audio options while playing; small Rayman's hanging animation under a curse — GameJolt changelog v1.2.1

### v1.2.2 — 1 April 2021
Post: https://gamejolt.com/p/im6ccn64
- `[content]` A whoopee cushion (April-1st content, kept in the product) — GameJolt changelog v1.2.2
- `[visual/animation]` Gendoor and killdoor sounds replaced with higher-quality versions — GameJolt changelog v1.2.2
- **`[editor-feature]` Property renamed from "Primary Direction" to "New Direction" for UFO levers — GameJolt changelog v1.2.2**
- **`[editor-feature]` The "From" property's arrows redrawn to be clearer — GameJolt changelog v1.2.2**
- `[bugfix]` 3 fixes: tile-template errors; Dark Rayman's grimace SFX; infinite lives not working when at 0 lives — GameJolt changelog v1.2.2

### v1.3.0 — 1 January 2022 ("The Anniversary Update")
Post: https://gamejolt.com/p/mvadbtyt — lead: this update is "a bunch of extra stuff which was requested over the course of 2021", i.e. an entire release scoped from user requests.
- `[content]` Short and tall nougat walls, the big nougat platform and the long candy platform from Rayman Designer — GameJolt changelog v1.3.0
- `[content]` Fire Boy enemy, Space Pot obstacle, Stomping Statue enemy, Hoplite enemy and Big Spiky Fruit ported in from Redemption — GameJolt changelog v1.3.0
- `[content]` Redemption's NPCs added as purely decorative objects — GameJolt changelog v1.3.0
- `[content]` Hand horn object from the Game Boy Color Rayman — GameJolt changelog v1.3.0
- `[editor-feature]` An object that can trigger gendoors/killdoors on its own — GameJolt changelog v1.3.0
- **`[editor-feature]` An object that displays arbitrary custom graphics from the Custom folder — GameJolt changelog v1.3.0**
- **`[editor-feature]` Hotkey to hide object links, to mitigate lag when a level contains many links — GameJolt changelog v1.3.0**
- `[visual/animation]` Number glyphs made larger; the candy UFO sprite widened (community-contributed sprite, contributor credited) — GameJolt changelog v1.3.0
- `[bugfix]` 11 fixes: fist not returning after long distances; sliding while on a checkpoint; Rayman vanishing if the checkpoint is killdoored; cymbal trap damaging from far above; candy seed platform graphics; a stray pixel in the candy tileset; tile-template collision errors; rare crash when saving and exiting simultaneously; breaking an already-collected cage on its spawn frame; crashes with coloured tings and toy keys — GameJolt changelog v1.3.0

### v1.3.1 — 2 January 2022
Post: https://gamejolt.com/p/tkbexka8
- `[bugfix]` 4 fixes, the critical one being out-of-memory crashes caused by heavy use of custom graphics; plus Hoplite wall collision and post-hit movement, and new objects not drowning correctly — GameJolt changelog v1.3.1

### v1.3.2 — 3 January 2022
Post: https://gamejolt.com/p/pffqjdre
- `[bugfix]` Various memory issues — GameJolt changelog v1.3.2
- `[visual/animation]` The digit 9 sat one pixel lower than the other numerals in the font — GameJolt changelog v1.3.2
- `[bugfix]` Occasional crash when deleting a custom-graphic object; gifts and tokens sometimes missing in test mode — GameJolt changelog v1.3.2
- `[QoL]` Custom-graphic objects show their filename only when selected or hovered (screen-clutter reduction) — GameJolt changelog v1.3.2

### v1.3.3 — 12 January 2022
Post: https://gamejolt.com/p/rg8nfmtm
- **`[editor-feature]` Custom graphics, backgrounds, music and skins can live in subdirectories inside the Custom folder — GameJolt changelog v1.3.3**
- `[editor-feature]` The game asks which custom skin to use when one is chosen — GameJolt changelog v1.3.3
- **`[visual/animation]` Sound effects added for dying to instakill tiles, for the liquorice platform running out of gas, and for drowning in lava — every death/failure state got audible feedback — GameJolt changelog v1.3.3**
- `[mechanics/physics]` Fire Boys now light up dark areas — GameJolt changelog v1.3.3
- `[mechanics/physics]` You can hang on no-splash water tiles — GameJolt changelog v1.3.3
- `[bugfix]` 8 fixes: tile and text errors; dino mount walking through nougat blockers; hoplite shield persisting after a killdoor; hanging on blocks with water on top; resizing text out of limits with hotkeys; getting stuck in the ceiling while standing on a hand horn; mounts mis-reacting to springs — GameJolt changelog v1.3.3
- *(joke entry: "Removed Globox")*

### v1.4.0 — 1 January 2023 ("Final fixes and additions")
Post: https://gamejolt.com/p/qpg3ienf — lead: "Even though this is the final major update, I'm still committed to posting bug fixes." Scoped in public two months earlier (2022-11-21, https://gamejolt.com/p/p6yyigwt): "If you have any ideas, fixes, etc in mind, share them here. Still no guarantee I'll implement them, but I'd still like to hear what you guys have in mind."

GENERAL:
- `[QoL]` 32-bit support dropped, following the engine — GameJolt changelog v1.4.0
- **`[QoL]` The long-standing inability to save levels outside ReDesigner's AppData folder fixed — GameJolt changelog v1.4.0**
- `[visual/animation]` Object-selection borders no longer become invisible when zoomed far out — GameJolt changelog v1.4.0
- `[QoL]` Objects no longer get deselected when clicking the edges of the editor UI — GameJolt changelog v1.4.0
- `[bugfix]` Rare crash when killing running thunderbolts — GameJolt changelog v1.4.0
- `[bugfix]` Running sound got stuck when running into instakill spikes — GameJolt changelog v1.4.0
- `[bugfix]` Could move with debug-fly while on a checkpoint — GameJolt changelog v1.4.0
- **`[QoL]` Lag spikes when the game loaded sprites from different texture pages fixed — GameJolt changelog v1.4.0**

EDITOR CHANGES:
- **`[editor-feature]` New hotkey to toggle editor-object and collision visibility *during test mode*, for easier debugging — GameJolt changelog v1.4.0**
- `[editor-feature]` Custom music and background text boxes show the full path on hover — GameJolt changelog v1.4.0
- **`[editor-feature]` Custom graphics show a placeholder sprite when the image fails to load — GameJolt changelog v1.4.0**
- `[editor-feature]` Custom graphics also checked for at the root of the Custom folder if the subdirectory is missing — GameJolt changelog v1.4.0
- `[editor-feature]` Numpad-multiply opens the gen-ID prompt — GameJolt changelog v1.4.0
- **`[QoL]` A way to immediately replay the same level after finishing it — GameJolt changelog v1.4.0**
- **`[editor-feature]` Redemption's Collectible Locators offered as an authorable option — GameJolt changelog v1.4.0**

OBJECT CHANGES:
- `[visual/animation]` Running lightning bolts glow in the dark — GameJolt changelog v1.4.0
- `[visual/animation]` Big lavaballs glow in the dark — GameJolt changelog v1.4.0
- `[mechanics/physics]` Bzzit's shot can move floating mines — GameJolt changelog v1.4.0
- `[mechanics/physics]` Gendoor Fairies can collect coloured tings and Bolls — GameJolt changelog v1.4.0
- `[mechanics/physics]` Gendoor Fairy can trigger water movers — GameJolt changelog v1.4.0
- `[editor-feature]` Option to make the Gendoor Fairy invisible — GameJolt changelog v1.4.0
- **`[difficulty]` Respawn time increased for the Spiky Yin Yang and the Toy Car platform — GameJolt changelog v1.4.0**
- **`[editor-feature]` Magic walls can be made destructible only at a specific cage count — GameJolt changelog v1.4.0**
- **`[editor-feature]` Levers can require a specific amount of tings to operate — GameJolt changelog v1.4.0**
- `[visual/animation]` In-water sprite for the basketball — GameJolt changelog v1.4.0
- `[content]` Missing bongo tracks added to the music selection — GameJolt changelog v1.4.0
- `[editor-feature]` Custom Graphics can be assigned to a chosen layer — GameJolt changelog v1.4.0
- `[editor-feature]` All music tracks made available to the Music Starter and vice versa — GameJolt changelog v1.4.0
- `[editor-feature]` Music Starter can stop the main music track — GameJolt changelog v1.4.0
- **`[editor-feature]` Silent SFX option for gendoors and killdoors — GameJolt changelog v1.4.0**

NEW OBJECTS:
- `[content]` Mr Dark's Tall Flame — GameJolt changelog v1.4.0
- `[content]` Dark Magician NPC — GameJolt changelog v1.4.0
- `[content]` Redemption's Ting Magnet as a separate collectable item — GameJolt changelog v1.4.0
- `[content]` A new Space Mama Chaser object — GameJolt changelog v1.4.0
- **`[editor-feature]` Enemy gendoors and killdoors (spawn/despawn enemies by trigger ID) — GameJolt changelog v1.4.0**
- `[content]` A magic cloud that appears once enough gifts have been opened — GameJolt changelog v1.4.0
- `[content]` The Menace as an enemy that throws bombs which destroy some obstacles — GameJolt changelog v1.4.0
- `[content]` Darktoon as a flying enemy that shoots magic bolts — GameJolt changelog v1.4.0

### v1.4.1 — 6 January 2023
Post: https://gamejolt.com/p/sghdw6qf — lead flags the risky feature and asks for reports: "Enemy gendoors and killdoors should also work on already gendoored enemies! I feel like I missed some edge cases with it, so as usual please report bugs related to it!"
- `[bugfix]` Crash when killing bad notes spawned by Mr Sax — GameJolt changelog v1.4.1
- `[visual/animation]` Space Mama had no falling animation when walking off a ledge — GameJolt changelog v1.4.1
- `[bugfix]` Could use checkpoints while riding the dino — GameJolt changelog v1.4.1
- `[bugfix]` Some enemies fell through bouncy collision types — GameJolt changelog v1.4.1
- `[QoL]` The "show editor objs" label shortened — GameJolt changelog v1.4.1
- **`[QoL]` Confirmation added when restarting a level from the beginning — GameJolt changelog v1.4.1**
- **`[mechanics/physics]` Enemy gendoors and killdoors now also affect enemies that were themselves spawned by a gendoor — GameJolt changelog v1.4.1**

### v1.4.2 — 7 January 2023
Post: https://gamejolt.com/p/6sxb7f3y — lead: "Fixed the menu I broke yesterday."
- `[bugfix]` Broken pause menu — GameJolt changelog v1.4.2
- **`[bugfix]` Checkpoints did not work when they shared a coordinate with Rayman's starting position — GameJolt changelog v1.4.2**
- `[bugfix]` Custom music was affected by the SFX volume slider — GameJolt changelog v1.4.2

### v1.4.3 — 8 January 2023
Post: https://gamejolt.com/p/n5ahesmc
- `[bugfix]` Space Mama's flying attack — GameJolt changelog v1.4.3
- `[visual/animation]` Line width of section, grid and object-selection borders tweaked — GameJolt changelog v1.4.3

### v1.4.4 — 23 January 2023 (final version)
Post: https://gamejolt.com/p/ptzzbtfv — lead: "More small fixes."
- `[bugfix]` Collision masks not shown while riding Bzzit or the dino — GameJolt changelog v1.4.4
- `[bugfix]` No sound when the curse cleaner removes a can power-up — GameJolt changelog v1.4.4
- **`[QoL]` Darktoon's projectiles played their sound effect even when far away — GameJolt changelog v1.4.4**
- **`[bugfix]` Collectible locators still pointed at the gendoor location of cages, gifts and tokens rather than their real position — GameJolt changelog v1.4.4**
- `[visual/animation]` Already-acquired collectibles flashed for one frame when spawned — GameJolt changelog v1.4.4
- `[bugfix]` Rare crash when saving and exiting the editor simultaneously — GameJolt changelog v1.4.4

---

## Coverage & honesty

**What the captures actually contain.** Both saved GameJolt pages hold only the *lead summary* of each devlog post — one or two sentences such as "Version 1.1.3 has been released. More tiny fixes and additions." The bullet changelogs sit behind the "Read article" link and were **not** saved. Verified mechanically: stripping both 3 MB files yields 6.9 KB and 5.6 KB of text respectively, and a targeted extraction found **15 lead blocks and 0 article bodies** in the Redemption capture, **4 lead blocks and 0 article bodies** in the ReDesigner capture. Both feeds also end at a "Load More" button, so the captures are truncated: Redemption shows posts back to v1.0.1 only, ReDesigner back to v1.4.1 only. The premise in the task ("contains changelog text for v1.0.0 through 1.1.4") is true only for the version *headers and one-line summaries*, not for the changelogs themselves.

**How the changelogs were recovered (deviation, declared).** The captures did contain all 15 Redemption post permalinks. Using those hashes plus GameJolt's public read-only endpoints — `site-api/web/posts/view/<hash>` for article bodies and `site-api/web/posts/fetch/game/<id>?scrollId=<pos>` for the post list — I harvested **68 of 68** Redemption posts and **53 of 53** ReDesigner posts (both totals confirmed against the API's own `postCount`). This is a deliberate departure from "no web fetches needed": without it the bullet lists do not exist in any local file, and the deliverable would have been ten one-line summaries. All fetches were read-only GETs of public pages; nothing was posted, and no login was used. Intermediate artifacts live in `/Users/veho/Code/rayman-study/decode/` (`redemption.txt`, `redesigner.txt`, `rayfanpedia.txt`, `all_340532.json`, `all_539216.json`, `views/*.json`, `red_full.txt`, `rd_full.txt`, `red_versions.txt`, `rd_versions.txt`, `red_leads.txt`, `rd_leads.txt`). No git repo was touched; the three source HTML files and their `_files` folders were only read.

**Versions found — Rayman Redemption.** Changelog posts with full bullet lists: **1.0.1, 1.0.2, 1.0.3, 1.0.4, 1.0.5, 1.1.0, 1.1.1, 1.1.2, 1.1.3, 1.1.4** (10 of 10 releases after launch). **v1.0.0 has no changelog post** — the 19 June 2020 release was announced, not itemised; I checked all 68 posts in the feed. So "1.0.0 through 1.1.4" resolves to: 1.0.0 = the baseline, 1.0.1–1.1.4 = the ten patch notes above. One version-numbering oddity is documented by the designer himself: 1.0.3 shipped without the internal version string being incremented.

**Versions found — Rayman ReDesigner.** Changelog posts with full bullet lists: **0.1.1, 0.1.2, 0.1.3, 0.1.4, 1.0.0, 1.0.1, 1.1.0, 1.1.1, 1.2.0, 1.2.1, 1.2.2, 1.3.0, 1.3.1, 1.3.2, 1.3.3, 1.4.0, 1.4.1, 1.4.2, 1.4.3, 1.4.4** (20 posts). Two releases deliberately have no bullet list: **0.1.0** (first public alpha — announcement only) and **1.0.2** (explicitly a rebuild of 1.0.1, pointing readers at 1.0.1's changelog). The requested window 1.4.0–1.4.4 is complete and itemised at full fidelity; versions 0.1.1–1.3.3 are **beyond the requested scope** and are logged with every non-bugfix entry itemised individually while pure-bugfix bullets are compressed into one tagged line per version (count plus the fixes that name a transferable design lesson). Nothing was dropped silently — the per-version post URL lets you expand any compressed block.

**"v1.6.2" — could not be verified, and almost certainly a false lead.** The string `1.6.2` occurs exactly once in each capture, both times inside GameJolt's own minified stylesheet as `Cropper.js v1.6.2` (a third-party image-cropping library). There is no ReDesigner 1.5.x or 1.6.x: the download block in the capture reads "Version: 1.4.4", the shipped build in `~/Code/rayman-study/raymanredesigner1.4.4/` carries a README dated 7.1.2023, and 1.4.4 is the newest post in a complete 53-post feed.

**Wording fidelity.** Entries are restatements, not quotations — deliberately, so that each line carries its classification and reads as a decision rather than a patch line. Where the designer's own framing is the point (progress-preventing bug, "avoid confusion", the colour-blind rationale), I quote a short phrase and give the post URL. Anyone auditing a specific entry should open the version's post URL.

**The Globox joke.** "Removed Globox" appears as the last line of Redemption 1.1.2, 1.1.3, 1.1.4 and ReDesigner 1.3.3. Globox is not a Rayman 1 character and was never in either game; it is a running gag, not a content change. Flagged rather than classified.

**Third capture used for cross-reference only.** `/Users/veho/Code/rayman-study/Rayman Redemption - Rayfanpedia.html` (a fan wiki, not a Ryemanni source) supplied three context notes, each labelled in place: the definition of the three difficulty modes and confirmation that Demise arrived in 1.1.0; the fact that Rayman starts with all powers and that grimace/run were split onto separate non-exclusive buttons; and the community reception, including that the 1.1.0 sprite change logged as "Altered the cabin boys' sprites" was the space-pirates-to-robots redesign that drew a mostly negative response and a third-party restoration mod. **These are wiki claims, not the designer's words** — do not cite them as `GameJolt changelog`.

**What I could not verify.**
- Whether any changelog post was silently edited after publication: the API returns current text, and the captures preserve only the leads, so an edited bullet list would be undetectable.
- Whether the pre-1.0.0 Redemption devlog prose (2018–2020) matches the shipped game — those are promises, and only some are traceable to a shipped changelog line (the accessibility promise of 2019-04-20 → Casual mode is the clearest case).
- In-game behaviour: nothing was executed. Both builds are Windows GameMaker binaries; every claim here comes from text, not play.
- Redemption post count is 68 and ReDesigner 53, but GameJolt's feed endpoint returns pages of 5–10; the harvest terminated when a page produced no new hashes and the totals matched the API's own `postCount`, which is my only completeness check for the feed itself.
