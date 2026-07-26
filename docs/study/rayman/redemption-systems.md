# S2 — Rayman Redemption: SYSTEMS MAP (design-mining report)

**Study lane:** S2 of the Painted Book design-research program.
**Object of study:** *Rayman Redemption* (Ryemanni, 2020) — an unofficial fan remake/reimagining of *Rayman* (1995), studied purely as a **redesign document**: what the remake changed in progression, economy and assist systems, and why.
**Purpose:** feed a synthesis in which each change is adopted / adapted / rejected for a 2D platformer that teaches English to 6–7-year-olds and in which enemies are *redeemed through language tasks, never killed*.
**Scope discipline:** design knowledge only; lore appears only where it carries a mechanic. **CP-15 honoured — no image or asset was downloaded, extracted, or inspected; text findings only.**

---

## Source key and citation conventions

Every claim below carries one of these tags. Nothing is stated without one.

| Tag | Meaning |
|---|---|
| `capture §X` | The saved local capture `/Users/veho/Code/rayman-study/Rayman Redemption - Rayfanpedia.html` (saved 2026-07-25) = the Rayfanpedia article <https://fan.raymanpc.com/wiki/Rayman_Redemption>, section `X`. Extracted to plain text (6,992 words, 41 KB) at `study/_article.txt` and `study/_article_bold.txt`. **This is the primary source.** |
| `RF:Page (search)` | A *different* Rayfanpedia page, reached **only through WebSearch summarisation** because every direct fetch of `fan.raymanpc.com` returned HTTP 403 (Cloudflare). URL given inline. Treat as single-sourced and one remove from the page text — see *Coverage & honesty*. |
| `RW:Page (search)` | RayWiki (<https://raymanpc.com/wiki/en>), the **original game's** baseline, same 403 → WebSearch-only channel. Used exclusively for "the original did X" statements. |
| `GJ capture` | Local capture `Rayman Redemption by Ryemanni - Game Jolt.html` (developer's distribution page, incl. FAQ and public comments). Secondary; comments are community voices, not the developer. |

**Reachability summary (detail in the final section):** every direct HTTP fetch of both wikis failed with 403. The saved capture carries the core article in full; WebSearch was the only working channel to the satellite pages and to the original-game baseline.

---

## 1. Ability / progression regating

### 1.1 The original's drip-feed (baseline)

In *Rayman 1*, the player begins with almost nothing and Betilla the fairy hands over one verb at a time, each at a fixed story point:

| # | Ability | Granted where (original) | Source |
|---|---|---|---|
| 1 | Telescopic fist (the attack) | Pink Plant Woods, world 1 | `RW:Telescopic fist (search)` <https://raymanpc.com/wiki/en/Telescopic_fist> |
| 2 | Hanging (grab ledges) | end of Anguish Lagoon, world 1 | `RW:Hanging (search)` <https://raymanpc.com/wiki/en/Hanging> |
| 3 | Grappling fist (swing on flying rings) | end of Moskito's Nest, world 1 — "normally the third power he receives, however, it is possible to get the helicopter before it" | `RW:Grappling fist (search)` <https://raymanpc.com/wiki/en/Grappling_fist> |
| 4 | Helicopter (glide) | end of Allegro Presto, world 2 | `RW:Helicopter (search)` <https://www.raymanpc.com/wiki/en/Helicopter> |
| 5 | Running | end of Mr Stone's Peaks, world 3 — "the fifth and last power" | `RW:Running (search)` <https://raymanpc.com/wiki/en/Running> |

Two properties of that drip matter for us:

- **The glide was rationed.** The original helicopter makes Rayman's hair "spin very briefly", enough to lengthen a jump and descend with precision — not a free-flight tool (`RW:Helicopter (search)`).
- **Two verbs collided on one button.** "Since the button which must be held in order to run is the same button which must be pressed in order to pull a grimace, Rayman essentially loses the latter ability once he is able to run" (`RW:Running (search)`). Gaining power *cost* the player an expressive verb — an input-budget accident, not a design intention.

### 1.2 What Redemption does instead

> "Rayman starts with all of his abilities from the original game, including the grimace and running powers, which are now assigned to separate buttons and are no longer mutually exclusive." (`capture §List of powers and power-ups`)

The full permanent moveset from minute one: grimace, telescopic fist, hanging, grappling fist, helicopter, running (`capture §Permanent abilities`). This is also flagged up top as one of the headline changes — "Rayman starting with all of his abilities unlocked" (`capture §intro`).

Per-ability contrast:

| Ability | Original | Redemption | Source |
|---|---|---|---|
| Grimace (scares tall Livingstones) | shares the run button; effectively lost once running is granted | own button; always available; an achievement is tied to it | `RW:Running (search)`; `capture §Permanent abilities` |
| Telescopic fist | granted in world 1 | owned from the start; temporarily upgradable by golden fists and speed fists | `RW:Telescopic fist (search)`; `capture §Permanent abilities` |
| Hanging | granted end of Anguish Lagoon | owned from the start | `RW:Hanging (search)`; `capture §Permanent abilities` |
| Grappling fist | granted end of Moskito's Nest | owned from the start; **and extended** — "He can also use it to grab lives from afar" | `RW:Grappling fist (search)`; `capture §Permanent abilities` |
| Helicopter | granted end of Allegro Presto; brief spin | owned from the start; "Rayman can glide **indefinitely**, similarly to its sequels"; activation configurable **tap** (Rayman 2 style) or **hold** (Rayman 3 style) in options | `RW:Helicopter (search)`; `capture §Permanent abilities` |
| Running | granted end of Mr Stone's Peaks | owned from the start; "makes his jumps a lot longer and faster" | `RW:Running (search)`; `capture §Permanent abilities` |

### 1.3 The replacement gate: Pink helpers (the world unlocks, not the player)

Because the moveset no longer gates anything, Redemption moves the gate **into the level furniture**. Three "Pink helper" classes are imprisoned in three **Toontotems**, one per act of the story; freeing them makes a *whole class of world object* start working (`capture §Pink helpers`, `capture §The Dream Forest`/`§Blue Mountains`/`§The Caves of Skops`):

| Pink helper | Freed at | Effect once freed |
|---|---|---|
| Pink **rings** | Dream Forest Toontotem (after Moskito) | Rayman can grapple to them |
| Pink **springs** | Blue Mountains Toontotem (after the 2nd Darktoon fight) | Rayman can bounce on them |
| Pink **poles** | Caves of Skops Toontotem (after the 3rd Darktoon fight) | Rayman can climb them, like vines |

Crucially, the gate is **legible before it opens**:

> "Pink helpers that have not yet been freed appear in their would-be locations as transparent versions of themselves, thus serving as indications to the player as to which areas will need to be revisited." (`capture §Replays`; corroborated `RF:Rayman Redemption (search)`)

So: the ability you already own (grapple, bounce, climb) meets an object that is *visibly not yet alive*. Backtracking is signposted by ghosts rather than by a checklist. `capture §Replays` states backtracking is genuinely necessary in some cases, because certain items are out of reach until specific Pink helpers are freed.

### 1.4 Two further progression tracks that replace the ability drip

- **Health capacity via Betilla's Garden** — Betilla "would upgrade his life points every time he breaks a necessary number of cages" (`capture §Friends`). Thresholds: 4th health point at **10** cages, 5th at **50**, 6th at **120**, 7th at all **168** (`RF:Betilla (search)` <https://fan.raymanpc.com/wiki/Betilla>; `RF:Cage (search)` <https://fan.raymanpc.com/wiki/Cage>). Baseline: the original gave 3 health, raisable to 5 only by collecting a Big Power (`RW:Rayman 1 (search)` <https://raymanpc.com/wiki/en/Rayman_1>).
- **Purchasable permanent upgrades** — see §2; "All shop upgrades, once bought, stay until the end of the game" (`capture §Shop power-ups`).
- **Temporary powers still exist and are still story-gifted** (`capture §Temporary power-ups`): magic seed (from Tarayzan — plant platforms, escape floods/rising lava), super helicopter potion (from the Musician — true flight), paint fist (from the Painter — draw temporary platforms on blank walls), four coloured keys, the Master Key, invincibility (post-Mr-Dark, "his touch deadly to any enemies"), and shrinking via Blue elves (touch one to shrink and fit through small gaps, touch another to return).

**Design read (ours, from the above):** Redemption separates *competence* from *permission*. Competence is granted at t=0 so the controls never change under the player; permission is granted by the world waking up. Progression is felt as "the place changed", not "my hands changed".

---

## 2. Shop economy

### 2.1 The currency was re-purposed

| | Original | Redemption |
|---|---|---|
| What Tings do | "Collecting 100 Tings gets Rayman a bonus life and resets his Ting count to zero"; dying loses all held Tings (`RW:Ting (search)` <https://raymanpc.com/wiki/en/Ting>) | "Unlike in Rayman 1, they are not automatically converted into extra lives, and so a large number can be accumulated" (`capture §Recurring collectibles`); "may be accumulated, and used directly as a currency in the Shop, the Casino and Joe's Wares" (`RF:Ting (search)` <https://fan.raymanpc.com/wiki/Ting>) |
| Ceiling | forced reset every 100 | effectively unbounded — Tings reappear on replay, and one achievement requires hoarding a large number (`capture §Recurring collectibles`; `RF:Ting (search)`) |

Income sources named in the sources: ordinary Tings; **Rainbow Tings = 9 Tings each** (`capture §Recurring collectibles`); **golden cages = 8 Tings each**, i.e. an already-broken cage becomes a small repeatable payout that magnetises to Rayman like a rainbow Ting (`capture §Replays`; amount from `RF:Cage (search)`); the Casino; and, in **Casual** mode, life pickups convert into Tings because lives are meaningless there (`capture §Gameplay`).

### 2.2 The three vendors

| Vendor | Where | Sells | Source |
|---|---|---|---|
| **The Shopkeeper** — "appears almost identical to the Photographer" | The Shop, Band Land | lives, upgrades, skins | `capture §Friends` |
| **Joe the Extra-Terrestrial** | Joe's Wares, Caves of Skops beach | the two *locator* upgrades | `capture §Friends`, `§Shop power-ups` |
| **The Gamemaster** — "one of Space Mama's pirates turned good" | The Casino, Playtopia | gambling: Tings in, Tings/skins/Magician tokens out | `capture §Friends` |

### 2.3 The catalogue

Permanent upgrades (`capture §Shop power-ups`):
- **Ting magnet** — attracts nearby Tings (quality-of-life; reduces precision-collection labour).
- **Better power-ups** — a Big Power grants *more* extra health than normal.
- **Cage locator** (Joe's Wares) — "points at cages located in the current section of a level".
- **Item locator** (Joe's Wares) — "points at Magician tokens and gifts located in the current section of a level".

Costs — the article lists **no price table**; only two figures surfaced anywhere:
- Cage locator: **1,500 Tings** at Joe's Wares (`RF:Cage (search)` / `RF:Extra Locations (search)` <https://fan.raymanpc.com/wiki/Extra_Locations_(Rayman_Redemption)>).
- A Mr-Dark-themed **checkpoint skin: 100 Tings**, unlocked for purchase after completing the Dark Medallion (`RF:Skin (search)` <https://fan.raymanpc.com/wiki/Skin>).
- Casino: **10 Tings per pull** of a three-reel slot machine, prizes "usually varying amounts of Tings" (`RF:The Casino (search)` <https://fan.raymanpc.com/wiki/The_Casino>).
Also purchasable: lives — and note the mode interaction, "in this mode [Casual] lives cannot be bought in the Shop", while in **Demise** lives "can only be recovered by buying them in the Shop" (`capture §Gameplay`).

### 2.4 What problem the shop solves

Four problems, each visible in the sources:

1. **It gives the currency a job.** Once 100 Tings no longer auto-buys a life (`capture §Recurring collectibles`), collection would be pointless without a sink; the Shop/Casino/Joe's Wares are that sink (`RF:Ting (search)`).
2. **It converts replay into value.** Replays are unlimited and re-pay in Tings (golden cages, respawning Tings) (`capture §Replays`), so a stuck or curious player always earns something.
3. **It sells assistance rather than imposing it.** The locators are difficulty relief *bought by the player who wants it* (`capture §Shop power-ups`).
4. **It keeps the purist opt-out.** "Shop upgrades can be turned off in the game's settings" (`capture §List of powers and power-ups`) — the assist layer is switchable, so it doesn't dictate the experience.

---

## 3. Pink helpers + assist / accessibility systems *(highest-value section for us)*

### 3.1 Pink helpers as an assist-shaped gate

Mechanics in §1.3. What makes them an *assist* pattern rather than only a gate: the un-freed helper is **rendered as a ghost in its final position**, so the player is never asked to remember or deduce where to return (`capture §Replays`). The same ghosting idiom is applied to consumed collectibles: "Gifts and Magician tokens that have already been obtained reappear as transparent versions of themselves, but won't reward Rayman with anything when collected" (`capture §Replays`). One visual grammar — *solid = live, transparent = not yet / already done* — carries all progress state, with no menu.

### 3.2 The named difficulty modes (a permanent, per-save choice)

"Rayman Redemption features three modes acting as a permanent difficulty setting for a save file: Classic, Casual, and Demise, the latter introduced in version 1.1.0" (`capture §Gameplay`):

- **Classic** — "behaves similarly to the original Rayman, with limited lives. However, unlike Rayman 1, extra lives reappear whenever levels are replayed, making their 'farming' easier."
- **Casual** — "a modern mode giving the player infinite lives. In this mode, lives cannot be bought in the Shop and will give the player some Tings instead when collected."
- **Demise** — the hostile mode: limited lives buyable only in the Shop; Rayman starts with **1** health point instead of 3; Betilla's Garden upgrades still apply so a maximum of **5** is reachable; Big Powers and life pickups are **rigged** (they damage or kill); cheat codes **and mid-level checkpoints are disabled** — "although the latter are still visible in levels and can be customized as usual"; some achievements and skins become unobtainable normally.

*(Internal consistency check, ours: 1 starting health + 4 Betilla upgrades = 5, which matches the normal 3 + 4 = 7 from `RF:Betilla (search)`. The two sources agree.)*

### 3.3 The full assist inventory found in the sources

| Assist | What it does | Source |
|---|---|---|
| Infinite lives (Casual) | removes the fail-state economy entirely | `capture §Gameplay` |
| Infinite continues | "the player has infinite continues" — vs the original's **five** continues represented by alarm clocks, after which Game Over | `capture §Replays`; `RW:Continue (search)` <https://raymanpc.com/wiki/en/Continue> |
| Lives respawn / re-farmable | "lives respawn later in levels"; extra lives reappear on replay | `capture §Replays`, `§Gameplay` |
| Grab lives from afar | the grappling fist can retrieve a life you can't reach | `capture §Permanent abilities` |
| Autosave | "The game automatically saves the player's progress each time a level is completed or exited. Thus, the special save icons present on the map of Rayman 1 have been removed" | `capture §Levels — Notes` |
| Free replay, any order | "All levels can be replayed an unlimited number of times, in any order" | `capture §Replays` |
| Story never locked away | "all boss segments, dialogs and story events are always accessible in replays" (a handful excepted) | `capture §Replays` |
| Cage locator / Item locator | in-level pointers toward cages, tokens, gifts, scoped to the current section | `capture §Shop power-ups` |
| Ting magnet | forgives imprecise collection | `capture §Shop power-ups` |
| Better power-ups | raises the value of each heal pickup | `capture §Shop power-ups` |
| Ghost markers | transparent un-freed helpers / already-collected items; golden cages for already-emptied ones | `capture §Replays` |
| Indefinite helicopter | the hardest platforming verb becomes forgiving and un-timed | `capture §Permanent abilities` |
| Configurable helicopter input | tap-to-toggle or hold — a motor-accessibility choice | `capture §Permanent abilities` |
| Verbs on separate buttons | run and grimace no longer fight over one input | `capture §List of powers and power-ups` |
| Completion decoupled from the ending | "breaking all cages is not mandatory to access Mr Dark's Dare, the Final Showdown or the end credits" | `capture §Gameplay` |
| Assist opt-out | shop upgrades toggleable in settings | `capture §List of powers and power-ups` |
| Checkpoints (Photographer) | mid-level respawn, cosmetically customisable | `capture §Friends`; `RF:Skin (search)` |
| Cheats without penalty | "using any of the game's cheat codes do not disable the achievements" | `RF:Achievement (search)` <https://fan.raymanpc.com/wiki/Achievement_(Rayman_Redemption)> |

### 3.4 The reception evidence that the assist strategy worked

> "most of the game is viewed as considerably easier and fairer than the original, and it is often recommended to new players as the least frustrating introduction to the Rayman 1 experience." (`capture §Reception`)

Criticism concentrated on the *optional* hard tail — "the difficulty of the final worlds and some of the bonus challenges or achievements" (`capture §Reception`) — i.e. difficulty was pushed out of the main path and into opt-in content, and that is where complaints landed.

---

## 4. Checkpoints, lives, death economy

### 4.1 Checkpoints

- **Both games** use the Photographer: he photographs Rayman behind a photoboard, and "should Rayman lose a life, he will return to where he last had his photograph taken" (`capture §Friends`; original behaviour identical per `RW:The Photographer (search)` <https://raymanpc.com/wiki/en/The_Photographer>).
- Redemption **cosmeticises** the checkpoint: photoboards accept purchasable skins (`RF:Skin (search)`). Two revealing edge cases from the same source: in Bzzit's flying levels the Photographer appears *without* his photoboard, so checkpoint skins are moot; in Demise he vanishes and the boards are boarded over with wooden planks.
- Demise **disables** mid-level checkpoints while leaving them visible (`capture §Gameplay`).

### 4.2 Lives and death — original vs remake

| Dimension | Original *Rayman 1* | Redemption |
|---|---|---|
| Starting lives | 4 | mode-dependent: limited (Classic/Demise) or infinite (Casual) |
| Starting health | 3 units, max 5 via Big Power | 3, raisable to **7** via Betilla/cages (Demise: start 1, max 5) |
| Life income | 100 Tings → +1 life, counter resets; bonus-level clears | Tings **never** convert; lives are pickups (respawning, re-farmable, grabbable at range) or **purchases** |
| Death cost | loses all held Tings (most versions) | no Ting-loss stated anywhere in the sources; a life loss drops **Speed Fist by one level** and resets Big-Power bonus health |
| Continues | 5, shown as alarm clocks; Game Over consumes one; up to 99 lives per continue | **infinite** continues |
| Saving | dedicated save icons on the world map | autosave on level completion or exit; save icons deleted from the map, their slots reused for Extra Locations |
| Completion gate | **all 102 cages** required to enter Candy Château / Mr Dark's Dare | **168 cages**, and completion gates only the bonus world Dark Legacy — not the ending |

Sources for that table: original column — `RW:Rayman 1 (search)`, `RW:Ting (search)`, `RW:Life (search)` <https://raymanpc.com/wiki/en/Life>, `RW:Continue (search)`, `RW:Mr Dark's Dare (search)` <https://raymanpc.com/wiki/en/Mr_Dark's_Dare> / `RW:Cage (search)` <https://www.raymanpc.com/wiki/en/Cage> ("There are 102 cages throughout the game, all of which Rayman must break in order to enter the Candy Château"). Redemption column — `capture §Gameplay`, `§Replays`, `§Recurring collectibles`, `§Friends`, `§Levels — Notes`; cage total and thresholds `RF:Cage (search)` ("The total of cages in Rayman Redemption has been increased from 102 to 168 due to expanded content").

*Arithmetic cross-check (ours):* `capture §Gameplay` says the seven main worlds each hold four primary levels with six cages → 7 × 4 × 6 = **168**, exactly the stated total. So the counted cages sit only in the 28 main levels; cages appearing in bonus content (e.g. "the extra cages" in Dark Magician's Challenge, `RF:Achievement (search)`) must be outside that count — *inference, not stated*.

### 4.3 The shape of the change

Death in the original was a **compounding tax**: lost Tings, lost progress toward the next life, a finite continue pool, manual saving. In Redemption death is **local and non-compounding**: respawn at the last photo, lose a Speed-Fist tier, replay costs nothing, and progress is already saved. The one place the old tax returns — Demise — is an explicit opt-in for experts (`capture §Gameplay`).

---

## 5. New content and the design role of each piece

### 5.1 Scale

"The game contains 37 levels, split across 9 worlds. 6 of the worlds are returning… and 3 are new… The total number of levels and content is more than double that of the original game" (`capture §Levels`). Returning levels are all present, each "a reimagination of the corresponding level of Rayman 1, with recognizable design and changes on top of it, usually expanding the level". World length is **normalised**: the original gave the Dream Forest and Band Land 4 levels each and later worlds 3; Redemption gives every world exactly 4 main levels (`capture §Levels`). New levels, per the bold-face key in `capture §Levels`: Mosquitoes' Sonata; Tempest Terror; The Highest Peak; Art Block; Riding the Rainbow; Molten Depths; Between a Rock and a Hard Place; all of Playtopia; Tasty Reception, Choco Chambers, The Sweet Spot, The Candy Armada; all of Final Showdown; Dark Legacy. Candy Château, one level in the original, "has been expanded to a full-fledged world with multiple locations" (`capture §Candy Château`).

### 5.2 Playtopia (new world 6) — *the toy-box world, and the one with a lesson in it*

Levels: Child's Play, The Playhouse, The Lair of the Chessmaster, Brain Games, plus the optional Bzzit level Playful Flight (`capture §Levels — Playtopia`).

Two design-loaded pieces:

- **The Chessmaster** — a boss you never hit. "He is the only boss who is never attacked directly, but reluctantly surrenders after being checkmated by Rayman, pretending Rayman didn't earn his victory as he wasn't playing fair." He then hands over the **Master Key** (`capture §Enemies`, `§Playtopia`). A non-violent boss whose defeat condition is a *thinking* task and whose loss is played as comedy.
- **Brain Games** — "a level filled with math puzzles similar to Rayman Junior" (`capture §Playtopia`); "In the first and second parts, Rayman must frequently solve math-related challenges to progress, similarly to Rayman Junior, also known as Rayman Brain Games which inspired this level's name" (`RF:Brain Games (search)` <https://fan.raymanpc.com/wiki/Brain_Games>). It is gated by the **Master Door**, "a snob sentient door blocking Rayman's path… requesting his Master Key" (`capture §Enemies`). And it carries a **built-in scaffold hidden in the scenery**: "There's a secret trick in the second part involving the decorative green stud pillars, as they are all placed below the correct answer to each problem" (`RF:Brain Games (search)`).
- Boss: **The Menace**, who "after taking a few hits… splits into two, revealing his red-colored angry twin" (`capture §Enemies`).

### 5.3 Final Showdown (new world 8) — *the payoff act*

Built from the original's unused SNES prototype material (`capture §Final Showdown`). Two levels: **The Lonely Cliff**, where "Rayman travels to the Lonely Cliff and is greeted by all the game's friendly characters, and also by Darktoon who has denounced Mr Dark" — a cast-reunion beat that also has a second, event-only variant (`capture §Final Showdown`, `§Levels — Notes`) — and **The End of the World**: an aerial battle on Bzzit against Dark Rayman on Dark Moskito, then a Bzzit-can't-follow on-foot stretch through dark tendrils with regular and Giant Antitoons, then the true Mr Dark fight, ending with the Great Protoon freed (`capture §Final Showdown`). Its role: give the story the confrontation the original withheld, and stage a *final* difficulty ramp after the main game is already completable.

### 5.4 Dark Legacy (new world 9) — *the completionist's terminal reward*

"A bonus ninth world… inspired by the world of the same name from the Game Boy Color version of Rayman. It consists of a single level, filled with spiky vines, fruit and platforms, and inhabited by Stone men and Spiders. Successfully navigating through this hostile environment unlocks the Breakout Minigame" (`capture §Dark Legacy`). It is the **only** thing all 168 cages buy (`capture §Gameplay`) — the 100 % reward is a hard level plus a toy, not the ending.

### 5.5 Magician's Challenges — *the skill annex*

- The original's in-level bonus levels are **gone**: "All of the Magician's bonus levels have been removed from the stages, and replaced with harder and more varied Magician's Challenges" (`capture §Levels`).
- Entry currency is a **new collectible**, the Magician token, found in ordinary levels (`capture §Gameplay`, `§Levels`).
- Structure: **24 challenges**, listed by name in `capture §Levels — Magician's Challenges`. Per `RF:Magician's Challenges (search)` <https://fan.raymanpc.com/wiki/Magician's_Challenges>: "a trio of challenges for each of the 7 main worlds — the first a time trial, the second an electoon rescue and the third a regular level to complete — comprising the first 21", with challenge types signposted by icon (alarm clock = beat the clock to the exit sign; Electoon = rescue all Electoons before time runs out). The remaining three: **Dark Magician's Challenge** (a throwback to Flint Jail from Ryemanni's earlier *Rayman: The Dark Magician's Reign of Terror*, unlocked at **34 tokens**), **Boss Rush**, and **True Boss Rush**, which requires *all* tokens (`capture §Levels`, `§Gameplay`; token figure `RF:Magician's Challenges (search)`).
- Rewards include skins: break the extra cages in Dark Magician's Challenge and speak to the Dark Magician for a skin (`capture §Enemies`; `RF:Achievement (search)`).
- Role: a difficulty and mastery annex that sits **beside** the story, funded by an optional collectible, so the main path can stay gentle.

### 5.6 Replays — *the systemic backbone of the whole redesign*

`capture §Replays` in full substance: unlimited replays in any order; story/boss/dialogue content always available on replay; broken cages return as golden cages paying Tings; consumed gifts/tokens return as transparent no-ops; lives respawn; infinite continues. Role: it makes the economy solvent, makes backtracking pleasant instead of punitive, and turns the campaign into a re-enterable space rather than a one-way corridor.

### 5.7 Bzzit levels — *the optional low-pressure mode*

"Most worlds after the first have new levels, where Rayman is riding Bzzit… These levels are optional and their completion is not required for story mode, but they contain extra Magician tokens… Some of them contain custom skin collectibles for Bzzit" (`capture §Levels`). Named: Mosquitoes' Sonata, The Highest Peak, Riding the Rainbow, Between a Rock and a Hard Place, Playful Flight, The Candy Armada (`capture §Levels`). A change of verb (flying, shooting — note Speed/Golden Fist power-ups "also affect Bzzit's projectiles", `capture §Recurring collectibles`) offered as a break, paying tokens rather than mandatory progress.

### 5.8 Extra Locations — *the map as a hub*

Magician's Challenges, Betilla's Garden, The Shop, The Casino, Joe's Wares, Breakout Minigame, all as map nodes (`capture §Extra`, `§Levels — Extra Locations`), described as "a collection of special areas on the world map, which host bonus levels, upgrades and various power-ups purchasable for the in-game currency of Tings" (`RF:Extra Locations (search)`). They physically occupy the slots the original's save icons used to hold (`capture §Levels — Notes`), and the Breakout Minigame "now has its own icon on the map, instead of requiring a cheat code" (`capture §Levels`) — a hidden thing made visible.

---

## 6. Enemies and characters — behaviour / role changes

### 6.1 The redemption arcs (the most transferable material in the article)

- **Darktoon** — a wholly new recurring boss fought three times (Dream Forest, Blue Mountains, Caves of Skops; `capture §The Dream Forest`, `§Blue Mountains`, `§The Caves of Skops`). His arc: "After being repeatedly defeated, he falls into disfavor with Mr Dark, who takes away all of Darktoon's powers, ultimately becoming one of Rayman's friends as a pair of eyes" (`capture §Enemies`), and he shows up on the good side at the Lonely Cliff, "having denounced Mr Dark" (`capture §Final Showdown`). A villain is *converted* by the plot and rejoins the cast.
- **Bzzit** — was the original's world-1 boss and a single ride sequence; in Redemption he is beaten once, befriended, and then "plays a much more significant role… accompanying Rayman in several optional levels dedicated to the mosquito and at a certain point of the story" (`capture §Friends`). Defeated enemy → permanent companion → a whole alternative play mode.
- **The Gamemaster** — "One of Space Mama's pirates turned good", now runs the Casino (`capture §Friends`). A minion defects into a service NPC.

### 6.2 Non-lethal and puzzle-shaped antagonists

- **The Chessmaster**: never attacked; beaten by checkmate; surrenders with a face-saving excuse (`capture §Enemies`). Attacks by summoning chess-piece minions or hurling his bow tie.
- **Master Door**: an obstacle with a personality and a demand (`capture §Enemies`).
- **Bad Cake**: fought by dropping fruit into a chocolate pool while dodging projectiles and a rising chocolate level (`capture §Enemies`) — a resource-and-timing puzzle rather than a shoot-out.
- **Dark Rayman**: "resembles Rayman with a dark palette and mimics every move he makes throughout the stages. Rayman must stay on the move as Dark Rayman's touch is lethal. Can only be defeated by finishing the stage" (`capture §Enemies`) — an unkillable pursuer defeated by *progress*. Its mimicry is even turned into a joke reward: making Dark Rayman grimace earns the "Right Back at ya" achievement (`RF:Achievement (search)`).
- **Livingstones vs the grimace**: tall Livingstones are "scared of this" and removed by grimacing (`capture §Permanent abilities`) — an enemy neutralised by an expressive, non-violent verb, with an achievement attached.

### 6.3 Bosses restructured

- **New minibosses** thread the worlds: Tentacle flower (Moskito's Nest, "attacking Rayman by spitting Livingstones"), Mad drummer (Bongo Hills, maces plus derived flames and lightning) (`capture §Enemies`).
- **Space Mama** now "fights Rayman three times, wearing different costumes, and sometimes accompanied by helpers such as pirates and hoplites" (`capture §Enemies`) — a boss serialised across a world with escalating support, and staged like a performance.
- **The Dark Chimera**: six sequential forms, each fusing two previously-fought bosses (the second and last fuse three) (`capture §Enemies`) — a **recap boss** that quizzes the player on every mechanic learned.
- **Mr Dark** is escalated from a single fight to a four-stage antagonist: spells that sabotage Rayman's abilities through Candy Château, then the Chimera, then himself, then the Final Showdown — plus "a new secret form" in True Boss Rush (`capture §Enemies`, `§Candy Château`). Note the sabotage idea: "overcome Mr Dark's spells affecting his abilities" (`capture §Candy Château`) — the game temporarily *takes verbs away* as a late-game challenge, which is exactly the inverse of the removed drip-feed.
- **New bosses**: The Menace, Bad Cake, Dark Chimera, Chessmaster, Dark Moskito; the last is also reused as a Bzzit skin and as Moskito's replacement in True Boss Rush (`capture §Enemies`).

### 6.4 Enemy-roster expansion and two contested redesigns

The navigation box enumerates a per-world enemy roster including the new Playtopia set — Toybot, Jester, Chess piece, Toy train — and Candy Château's Water/Hammer/TNT clowns, Fork and Nougat man, plus Final Showdown's Megatoon and the Magic Minion in the extra areas (`capture §navbox`).

Two redesigns drew fire (`capture §Reception`):
- **Hunter's bullets** were redrawn to resemble Rayman Origins' live missiles; players objected that "the missing mallet took away the comedy from the original bullets as well as making them harder to react to due to the smaller shape". *A readability regression caused by a style upgrade — directly relevant to any redraw of ours.*
- **Space pirates → robots** in v1.1.0 got "a mostly negative response", partly because the original had already redesigned the ring pirate into a blue extraterrestrial "to avoid racial stereotyping"; a third-party mod restored the old look.

---

## 7. Visual / animation rework — what the wiki actually claims

The article is explicit that this is **not** a from-scratch redraw:

> "The graphics remain mostly the same, using assets from Rayman 1, its ports and prototype versions, as well as spin-offs, such as Rayman Designer. Additionally, entirely new assets were created in the style of the original game." (`capture §intro`)

Concrete rework items the sources do state:

- **Widescreen and modern resolutions** added; 4:3 still supported, but "the reduced visible range in this mode makes some locations awkward" (`capture §intro`).
- **Aspect-ratio parity handled by set dressing, not by scaling art**: in 16:9, "two dark stone walls will frame Mr Dark's fighting area in Mr Dark's Dare. As most returning bosses, this was done in order to not stretch the original background art and to keep gameplay the same between 4:3 and widescreen formats" (`RF:Rayman Redemption (search)` / `RF:Mr Dark (search)` <https://fan.raymanpc.com/wiki/Mr_Dark>). *A camera problem solved with in-fiction scenery.*
- **New assets for the new content**, and their quality was the weak point: "the new graphic assets such as those used for Playtopia were deemed to be of lower quality than those of the original game" (`capture §Reception`).
- **Skins as a visual system**: costumes for Rayman, alternative appearances for Bzzit, and skins for the checkpoints (`RF:Skin (search)`); Bzzit skins collectible inside his levels (`capture §Levels`); the HD Rayman skin for earning every achievement, and a "SKIN!WIZ" code that unlocks all of them (`RF:Achievement (search)`).
- **Audio rework** (adjacent, same "reskin" family): most of the PS1 soundtrack retained with named exclusions; additions by Ryemanni plus a shortened Atari Jaguar main theme; one tune returns in stereo from the developer's earlier game; new tracks were "mixed" in reception with *Battle for the Great Protoon* and *The Dark Chimera* singled out favourably (`capture §intro`, `§Soundtrack`, `§Reception`). Even the Ting sound effect is user-customisable (`capture §intro`), and a LUMTINGS code swaps Tings for Rayman 2 Yellow Lums with their sound effects (`RF:List of cheats (search)` <https://fan.raymanpc.com/wiki/List_of_cheats_in_Rayman_Redemption>).
- **Sprite-level animation claims**: the article makes **none** in detail — no list of redrawn or reanimated sprites. What exists is the intro's blanket statement plus gallery captions noting *early* sprite states, e.g. Darktoon's demo sprite and a "Blue Rayman with a red scarf" (`capture §Gallery`). Marked thin. *(Per CP-15 no gallery image was opened; captions only.)*

---

## 8. Other design-relevant systems

- **Difficulty as a save-file property**, not a menu toggle, chosen once — Classic / Casual / Demise (`capture §Gameplay`). Demise arrived post-launch in 1.1.0 (`capture §Gameplay`; version history in `GJ capture`, "Version 1.1.0 has been released. Included is a new difficulty mode for those who are looking for a great challenge!").
- **Collectible layers**: cages/Electoons (168, 6 per main level), the new **Magician tokens** (gate the challenge annex) and hidden **Gifts** (`capture §Gameplay`). What Gifts award is never stated — see honesty section.
- **Achievements with real payoffs, not badges**: the whole set grants the HD Rayman skin; individual ones name behaviours (Betilla's Blessing for all HP upgrades, Electoon Hero for all 168 cages, Plums for Days for the Breakout minigame, Right Back at ya for making Dark Rayman grimace) (`RF:Achievement (search)`). Achievements are also tied to *playful* acts, e.g. hoarding Tings (`capture §Recurring collectibles`) and grimacing (`capture §Permanent abilities`).
- **Cheats are first-class, not punished**: FAIRTING sets the Ting counter to 10,000, RAYMANNI grants one, SKIN!WIZ unlocks every skin, LUMTINGS reskins the currency — and using them does not disable achievements; Demise is the one mode where they are switched off (`RF:List of cheats (search)`; `RF:Achievement (search)`; `capture §Gameplay`).
- **A reward for reading the manual**: the Rayman ReDesigner editor code is "hidden in the readme file bundled with the game… as a special reward for actually reading it" (`RF:List of cheats (search)`).
- **Secrets promoted to the surface**: the Breakout minigame, formerly cheat-code-only, becomes a visible map node (`capture §Levels`).
- **Two-player-adjacent / platform facts**: single-player, PC/Windows only, GameMaker, free, XInput and DualShock 4 supported, saves compatible across versions, no translations (`capture §infobox`, `§Development`; `GJ capture` FAQ).
- **A spin-off editor** shipped the following year — Rayman ReDesigner, "a game acting as a stand-alone level editor to Rayman Redemption" (`capture §intro`).
- **Community pressure on the regating decision** — worth recording because it is the one place anyone argues the *other* side: a commenter on the developer's page wrote that "forcing Rayman to unlock powers was a pretty good decision from the gameplay perspective. It made the early levels that otherwise would have been a cakewalk somewhat challenging. It also added a feeling of progression", and asked for an optional mode restoring it (`GJ capture`, comments — community voice, **not** the developer's rationale). No such mode is documented in the article; the progression feeling was instead relocated to Pink helpers, health tiers, shop upgrades, skins and achievements.

---

## Top 10 findings for a grade-1 educational platformer

1. **Give the child the whole moveset on day one and gate the *world* instead** — Redemption's "starts with all abilities… no longer mutually exclusive" (`capture §List of powers and power-ups`) means controls never change mid-game, which for 6-year-olds removes the single biggest source of confusion; **adopt wholesale**, and let chapter progress be carried by objects waking up.
2. **The Pink-helper ghost is the best assist idiom in the article** — an object rendered transparent until it is earned (`capture §Replays`) teaches "come back here later" with no text, no map marker and no reading load; **adopt directly** for our task-gated furniture, since a pre-reader can parse solid-vs-faded but not a quest log.
3. **A non-violent boss already has a proven shape** — the Chessmaster is "never attacked directly" and "reluctantly surrenders after being checkmated" (`capture §Enemies`), which is exactly our redeem-don't-kill contract; **adopt** the pattern of a boss whose defeat condition is a completed *task* and whose loss is played as comedy rather than death.
4. **A villain can be converted by the plot and rejoin the cast** — Darktoon loses his powers, is disowned by the antagonist and becomes a friend (`capture §Enemies`, `§Final Showdown`); **adopt** as the template for our guardians' arc, with the fight count (three escalating meetings) as evidence that repetition builds the relationship.
5. **An enemy can be removed by an expressive verb rather than a weapon** — tall Livingstones flee the grimace (`capture §Permanent abilities`); **adapt**: replace the grimace with the spoken/typed answer, keeping the structure "the enemy is dispelled by a performance, not a hit".
6. **Decouple completion from the ending, and put the hard content in an opt-in annex** — all cages are needed only for the bonus world, not the credits (`capture §Gameplay`), and reception confirms complaints landed on the optional tail while the main path was called "the least frustrating introduction" (`capture §Reception`); **adopt** so a struggling 6-year-old still reaches the finale.
7. **Make the fail state local and non-compounding** — photo checkpoints, autosave on exit, infinite continues, respawning lives (`capture §Replays`, `§Levels — Notes`) versus the original's lost Tings and five alarm-clock continues (`RW:Ting/Continue (search)`); **adopt entirely**, and go further by removing lives, since our failure is a wrong answer and must never cost progress.
8. **Sell the assistance instead of imposing it, and let it be switched off** — cage/item locators bought with soft currency, all shop upgrades toggleable in settings (`capture §Shop power-ups`, `§List of powers and power-ups`); **adapt** as a hint economy (a "helper" a child can spend earned Tings on) so asking for help is a *purchase*, i.e. an act of agency rather than an admission.
9. **The scaffold can hide in the scenery** — in Brain Games "the decorative green stud pillars… are all placed below the correct answer to each problem" (`RF:Brain Games (search)`); **adopt** as our canonical hint layer: a child who needs help finds it in the art, a child who doesn't never notices, and neither is labelled.
10. **A style upgrade can destroy readability** — redrawing the hunter's bullets as slim Origins-style missiles removed the comedy and made them "harder to react to due to the smaller shape" (`capture §Reception`), and the new-world art was judged worse than the old (`capture §Reception`); **heed as a warning** for our painterly pass: every redraw of a hazard or interactive must be re-tested for silhouette legibility at a child's glance, and new-content art must match the bar set by the reference sheets, not merely the style.

---

## Coverage & honesty

### Live pages: what was reachable and what was not

**Nothing on either wiki was directly fetchable.** Every WebFetch attempt returned **HTTP 403 Forbidden** (Cloudflare), specifically:

| URL attempted | Result |
|---|---|
| https://fan.raymanpc.com/wiki/Rayman_Redemption | 403 |
| https://fan.raymanpc.com/wiki/Playtopia | 403 |
| https://fan.raymanpc.com/wiki/Magician%27s_Challenges | 403 |
| https://fan.raymanpc.com/api.php?action=parse&page=Rayman_Redemption (MediaWiki API) | 403 |
| https://raymanpc.com/wiki/en/Betilla | 403 |
| https://www.raymanpc.com/wiki/en/Helicopter (www variant) | 403 |

Because the pattern was total (article, subpage, API, both domains, both www and bare host), further fetch attempts were abandoned rather than burned.

**The channel that did work was WebSearch**, which returns search-engine summaries of those same live pages. Everything tagged `RF:… (search)` or `RW:… (search)` came through that channel. This is a **weaker** evidence class than the saved capture and than a real page read: the wording is a search engine's paraphrase, section names are not recoverable, and I could not verify surrounding context or catch a paraphrase error. Pages reached this way:

- *Rayfanpedia (Redemption side):* Cage, Betilla, Ting, Skin, The Casino, Achievement (Rayman Redemption), Magician's Challenges, Brain Games, Extra Locations (Rayman Redemption), List of cheats in Rayman Redemption, Mr Dark.
- *RayWiki (original-game baseline):* Telescopic fist, Hanging, Grappling fist, Helicopter, Running, Grimace, Ting, Life, Continue, Rayman 1, Mr Dark's Dare, Cage, Electoon, The Photographer.

The **primary capture itself is complete and clean**: 6,992 words, all 41 section headings present (Development → References), extracted twice — once plain, once preserving bold so the "levels in bold are new" key in `capture §Levels` could be decoded. The second extraction was necessary because the first silently destroyed that key; without it, the list of new levels in §5.1 would have been unrecoverable.

### Claims I could not double-source

Single-sourced through the search channel only, i.e. **verify before building on**:

- Cage total 102 → **168**, and Betilla's thresholds **10 / 50 / 120 / 168** for health points 4–7 (`RF:Cage`, `RF:Betilla`). *Partially corroborated by arithmetic* (7 worlds × 4 levels × 6 cages = 168, from `capture §Gameplay`) *and by Demise's stated 5-health maximum implying exactly four upgrades* (`capture §Gameplay`) — the strongest of the search-only claims.
- Golden cage payout **8 Tings** (`RF:Cage`); cage locator **1,500 Tings**; checkpoint skin **100 Tings**; Casino **10 Tings per pull** (`RF:Extra Locations`, `RF:Skin`, `RF:The Casino`).
- Challenge structure **24 = 21 (3 × 7 worlds) + 3**, the icon-based type signposting, and Dark Magician's Challenge at **34 tokens** (`RF:Magician's Challenges`). The capture confirms 24 names and the "all tokens for True Boss Rush" rule but not the triads or the 34.
- The Brain Games **stud-pillar hint** (`RF:Brain Games`) — a load-bearing finding for us (Top-10 #9) resting on one search summary.
- The **16:9 stone-wall framing** rationale (`RF:Mr Dark` / `RF:Rayman Redemption`).
- Demise-mode checkpoint details (Photographer absent, boards planked) and the Bzzit-levels no-photoboard case (`RF:Skin`).
- Achievement names/rewards and the cheats-don't-disable-achievements rule (`RF:Achievement`); all cheat codes (`RF:List of cheats`).
- Original-game numbers: 4 starting lives, 3→5 health, 100 Tings = 1 life, Ting loss on death, 99 lives per continue, **5 continues**, all-102-cages gate (`RW:Rayman 1`, `RW:Ting`, `RW:Life`, `RW:Continue`, `RW:Cage`, `RW:Mr Dark's Dare`). Note one version caveat the source itself flags: these figures are "most versions" — the DSiWare and GBA ports differ (50 Tings per life; no Ting loss on death).
- Betilla's gift order and locations in the original, and the run/grimace button collision (`RW:*`). The collision is the single most useful original-side finding and it is search-only; the capture corroborates it indirectly by boasting that the two are "no longer mutually exclusive" (`capture §List of powers and power-ups`).

### Sections thin in the source

- **Shop prices** — no price table exists in the article; only three figures surfaced anywhere (1,500 / 100 / 10 Tings). Any economy tuning we derive from Redemption is therefore *structural*, not numeric.
- **Gifts** — the new collectible's *reward* is never stated in any source I reached; only that it exists, is hidden, is findable via the item locator, and returns as a transparent no-op once taken (`capture §Gameplay`, `§Shop power-ups`, `§Replays`).
- **Total Magician token count** — unstated (only "all of them" for True Boss Rush, and 34 for one challenge). The denominator is unknown.
- **Development rationale** — `capture §Development` is dates and platforms only (announced 17 May 2018; demo 15 June 2019; v1.0 19 June 2020 after 3 years; final 1.1.4 on 18 Nov 2020). **The article contains no designer's reasoning for any change.** Every "why" in this report is either an explicit contrastive sentence in the wiki ("unlike the original…"), a reception statement, or clearly marked as my own design read. The four-part **Rayman Redemption Postmortem** videos linked in `capture §External links` are almost certainly where the real rationale lives, and they were **not** consulted — they are video, outside this lane's text scope. **Recommended follow-up if rationale matters.**
- **Animation/sprite rework** — no inventory of redrawn or reanimated sprites exists; §7 is as detailed as the source permits.
- **Checkpoint density, per-level layout, exact level geometry** — absent; the wiki lists level names, not layouts. (Per-level Rayfanpedia pages exist and are linked from the article — e.g. `Pink Plant Woods (Rayman Redemption)`, `Molten Depths`, `Choco Chambers` — but all were unreachable directly; they were not pursued through search, as level-by-level geometry is out of this lane's scope.)
- **Playtopia's own page** was 403 and not search-mined beyond Brain Games and the Chessmaster/Menace entries in the capture, so Child's Play and The Playhouse are named but not described.

### One inference explicitly flagged as mine

That the 168 counted cages live *only* in the 28 main levels — and therefore that cages appearing in bonus content (e.g. "the extra cages" in Dark Magician's Challenge, `RF:Achievement`) fall outside the total — is my arithmetic inference from `capture §Gameplay`, not a stated fact.
