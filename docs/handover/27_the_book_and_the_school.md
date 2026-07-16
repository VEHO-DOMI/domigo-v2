# 27 · THE BOOK AND THE SCHOOL — the game bible (story × gameplay as one)

*Fable 5, 2026-07-16. Status: **gate pack for Koki** — reading this document IS the gate; the
vertical slice (§9) is the gate after that. Commissioned by Koki's pivot directive (2026-07-16,
post-#174, transcripts preserved): the game's form is the Commander Keen 4 shape — a world map
with chapter buildings, platformer levels where the story fights back, a boss at the end of
every level, the chapter restored on victory — and story and game design designed as ONE thing.*

*This document GOVERNS the game lane's design. It supersedes: doc 22's top-down room-world as a
play surface (its school geography, palette arc and beat mapping survive re-mediated, §4), the
in-zone FireRed play modality everywhere, and the ✦ Word-Battle surface (retired, §8). It builds
ON: doc 25 (the arcade bible — movement, creatures, task economy, difficulty and engine doctrine
remain binding for the level layer), doc 18 (the G1 story — untouched and now load-bearing),
doc 20 (the G2 story — untouched and now load-bearing), and `docs/study/keen/keen-metagame.md`
(the world-map grammar, studied from source). Master plan v3 (doc 26) sequences the build.*

---

## §1 · The one idea

**The antagonist's resistance is the game's structure.** In year 1 a hurt boy inside the book
fights your progress with everything the corrupted book can throw — so the game is a fight
through 15 corrupted chapters. In year 2 the consequence of his years of erasing haunts the
school — so the game is 15 school places losing their words until you fill them back. Every
mechanic exists because the story needs it:

| mechanic | because the story says |
|---|---|
| platformer levels full of hostile ink | the book is being destroyed from within, and it fights its reader |
| enemies that can't be killed, only answered | nothing in this book dies; ignorance is the only enemy (doc 25 §5 carried) |
| a boss guarding each chapter's end | Jona seals each chapter he's erased — something of his stands guard |
| the flag over a beaten building | a restored page, planted where everyone can see it (Keen §1.6) |
| color flooding back on victory | restoration is literal (the S1-proven drain veil, run in reverse) |
| collectibles that become free hints | every word you rescue lights the way later (§5) |
| the finale duel you cannot win by force | you were fought all year — and you rescue him anyway (§3, ch15) |

The player never "does exercises." The player fights through a book, and the fighting is made
of English.

## §2 · The shape — Keen's grammar, re-keyed

One loop, both years, every chapter:

**WORLD MAP → walk to the chapter's building → story beat (dialogue) → enter → PLATFORMER LEVEL
(traverse · avoid or answer enemies · collect · find the seals) → BOSS DUEL at the level's end
(the unit's grammar + vocabulary, full task variety) → RESTORATION (color floods the chapter,
the flag flies its parabola onto the building, the blocked path onward crumbles) → story beat →
back on the map, one building richer.**

The Keen mechanics adopted verbatim (all studied, `keen-metagame.md` cited per item):
- **The hub is level 0** (§1.1): same engine as the levels conceptually; for us the hub runs on
  the proven walkable top-down engine (W-1) in a new "map mode" — the FireRed study wasn't
  wasted; it built Keen's world map. (Why not build ON Keen's available source, which Koki
  offered as "maybe an easy build": it's GPL C for DOS — license-incompatible and
  platform-wrong for our web/tablet target — and our two engines already implement the studied
  behavior natively; we take Keen's NUMBERS and GRAMMAR, never its code — the doc 25 §0
  provenance law.)
- **Walk-onto-door + confirm enters a level** (§1.5); the door names its destination (the
  contextual-prompt pattern from the S1 Codex verdict, kept).
- **Completion plants a flag — the just-beaten level gets the celebratory thrown-flag parabola**
  (§1.6, "the single most stealable juice moment").
- **Topological unlock** (§1.8): no prerequisite lists — beating a chapter physically clears the
  blocking terrain on the map (ink-brambles crumble, a torn bridge re-writes itself). The map IS
  the progress bar. Act boundaries are natural chokepoints.
- **Optional + secret spots** (§1.8): 1–2 per act off the critical path (bonus letter-caches,
  a secret challenge level for fast finishers; year 1's secret ride is **Pixel** — found snoozing
  in a hidden spot, she carries the player across the map, the Foot re-keyed as a cat).
- **Death is dignified** (§2.4): our Rettungsaufgabe (doc 25 §5.3, S1-proven live) REPLACES
  Keen's restart-from-scratch — losing the last heart means solving two calm tasks with the
  Tintengeist, then returning to the last checkpoint. Keen's "Try Again / Zur Karte" choice is
  offered only when the player declines the rescue.
- **Difficulty = content filter** (§5): tier E/M/S populations, never stats (doc 25 §6, built).

What is deliberately NOT Keen: no ammo economy (the Federstab is fiction around existing verbs,
never a ranged weapon — see the amendments table); no lives-counter Game Over (hearts + rescue
carry failure; a child is never sent back to zero); no level clock (task timers — quickfire
tiers, boss windows — are the game's only clocks).

### §2b · The doc-25 amendments table (settled law — where this bible changes the level layer)

Doc 25 stays binding for the level layer EXCEPT the rows below. Where the two documents differ
and a row exists here, THIS table wins; where no row exists, doc 25 wins.

| topic | doc 25 said | the law is now |
|---|---|---|
| level goal grammar | seals → pedestal → fragment-exit (§4.3), and separately "the boss yields the fragment" (§5.4) | ONE grammar: collect the level's Tintensiegel (2–3) → they UNSEAL the guardian's door at the level's end → the BOSS DUEL → victory yields the fragment + restoration. The pedestal retires. "Find the seals" = the traversal goal; the duel = the climax; no contradiction remains |
| the Federstab | "no shooting — our 'stun' is the quickfire freeze" (§2.8) | UNCHANGED in mechanics — canonized in fiction only. The Federstab is the pen-tool wrapping the existing verbs (contact-quickfire "writes light" onto a creature = the stun; the pogo; planting the flag). No aiming verb, no ammo. (X = the current pogo binding; the slice may re-map keys.) |
| the rescue's surface | "the BattleStage register" (§5.3) | the K-3 rescue overlay AS BUILT (its own calm DOM card — S1-proven) stays; BattleStage is retired everywhere. **Der Tintengeist** (the rescue's keeper — the book's gentle ink-spirit who catches you; a helper, never a threat — the register ban is on ghost-AS-THREAT) enters the cast table as a non-story NPC |
| hearts vs boss stamina | hearts = level; stamina = duel (§5.4, separate) | ONE pool: hearts carry into the duel; guess-mashing/answering outside a window costs a heart (the anti-guessing law, kept); last heart in a duel → the Rettungsaufgabe → respawn AT THE BOSS DOOR with 2 hearts |
| declining the rescue | not covered | "Nochmal von der Fahne" is the RESCUE's reward — declining it ("Zur Karte") exits to the map with letters/Glühwörter banked, seals kept, chapter unrestored. The tasks buy the checkpoint; skipping them costs the run, never the loot |
| the 100-letters exchange | heart refill OR Lernkarte (§5.5) | kept IN FULL: refill in-level, or a Lernkarte if banked at level end (bible §5.1's shorthand corrected) |
| the score ladder | arcade points, "Bonus bei 5.000+", combo economy (§4.3/§5.5) | the separate arcade SCORE retires. **XP is the one number**; the Keen visible-threshold doubling ladder runs on XP (§5.4 here); combos stay as juice (stars + streak display), never a currency |
| difficulty | populations + timers + tier-E gravity easing (§6) | as doc 25 §6 — this bible's earlier "never stats" summary is corrected: populations first, plus task-timer and tier-E gravity easing exactly as specced |
| ch15 / inversion windows | §5.4 stamina punishes wrong-window answers | inversion mode: hearts cannot be lost and the boss takes no damage number; a WRONG answer (or guess-mash) simply CLOSES the window and the pattern repeats — ch15 cannot be failed, only prolonged; guessing wastes windows (anti-guessing preserved by patience, not punishment) |
| boss data shape | — | per chapter TWO files: `level.json` (`modality:"level"`) + `boss.json` (`modality:"boss"`, carries the guardian's script table) — §6.1 and §7 name the same thing |
| level verbs + goal clarity (v2.2, Koki's slice verdict 2026-07-16) | run/jump/pogo/ledge/drop-through (§2.8) | ADDED as level vocabulary: poles (`\|` — climb/SLIDE/hop-off), in-level door pairs (`1`–`4` — sub-room wings), mover platforms (`header.movers`); and the GOAL LAW: every level opens with a goal card (`header.goalDe`, world held until dismissed), the HUD objective chip counts seals then flips to →Zur Tür, and an edge arrow points to the unsealed door whenever it's off-screen. Authoring rules live in the cookbook §7b |

## §3 · Year 1 — DIE VERLORENEN SEITEN, Keen-shaped

**Framing (one new beat, everything else is shipped canon):** the student opens the new
interactive English book — and the book, mid-crisis, pulls them in (Koki's opener; authored as
the campaign's cold-open beat). Inside: the book's world as a walkable map, 15 chapter-lands,
most of them drained grey. Finn (the paper-and-ink book-guide) meets you on page one; Pixel the
book-cat adopts you unasked. Doc 18's whole 15-beat mystery — the anomalies, the notes, Finn's
lie, the name Jona, the birthday, the rescue, the release — plays out EXACTLY as authored, as
the beats between levels. The story is not changed by this pivot; it is finally *staged*.

**The hub — the book's world map.** 15 buildings, each the shipped unit in architectural form,
each standing in its own ground that the chapter's theme colors (Keen's "the ground around this
could all look different" — Koki):

| ch · unit | building | the ground around it |
|---|---|---|
| 01 Time for School | the little schoolhouse | inkwash meadow, first page-path |
| 02 At the Zoo | zoo gate + enclosures | savanna patch, animal tracks |
| 03 Pirates | the beached ship | cove, torn-map sea, no X |
| 04 Feelings | Robo's workshop | gears + weather that mirrors moods |
| 05 Our Band | the bandstand | festival meadow, mute speakers |
| 06 Detective | Mo's office | noir alley corner, long shadows |
| 07 Noodles | Luca's kitchen | flour-dusted yard, herb garden |
| 08 Clothes | Mila's boutique | washing-lines, missing-jacket scarecrow |
| 09 Unusual Pets | Tim's menagerie | burrows + perches, filled bowls |
| 10 In a Shop | Mrs Apple's shop | market square, sorry-note lamppost |
| 11 What's the Time | Tik's clocktower | gear-garden where time stands still |
| 12 Birthday Cake | Omi Rosa's bakery | party meadow, one unlit candle-tree |
| 13 Help! | Sam's station | the growing pale rift at the map's edge |
| 14 It's My Favourite | Peppi's studio | color-splash field (first fully-warm ground) |
| 15 Going to Do? | the door home | the book's spine — a bridge of restored pages |

Beaten chapters hold their color permanently; the map begins mostly grey and ends ablaze — the
campaign's emotional arc IS the map (the drain-veil tech from S1, scaled up). Jona is PRESENT on
the map from early on: his notes pinned near buildings (act 1–2, doc 18's note canon), a small
figure watching from the map's edge who runs when approached (act 2–3, per doc 18 z12).

**The levels — inside each corrupted chapter.** The Tintenlauf engine (doc 25 §2 physics,
verdict-proven) with per-chapter theming (§6 delta 1). The book attacks its reader (Koki,
verbatim: "the book is attacking you… letters flying around"): torn-page platforms, ink-falls,
letter-swarms, thrown things. **Enemies are Jona's sendings** — the corrupted book acting out
his anger, sent "to discourage you from studying English" (Koki, now literal). The creature
vocabulary re-keys doc 25 §3 and adds story-keyed newcomers:

| creature | behavior (doc 25 grammar) | the story it tells |
|---|---|---|
| Tintenläufer · Hüpfer · Flatterklecks · Wortdieb · Sprungkissen · Schattenwolke | as built (K-3, live) | the book's fauna, corrupted |
| **Der Radierer** (NEW) | slow patroller that ERASES the platform tiles ahead of it (they re-write after ~3s — dynamic tiles, doc 25 §4.4) | Jona's erasing, made a creature you must out-run or answer |
| **Der Rotstift** (NEW) | dive-bomber that hurls red marks ("Fünfer!") in a legible arc — Keen-arc projectiles | Koki's "what teachers give — bad grades," flying |
| **Flatterbuchstaben** (NEW) | a letter-swarm that scatters when stunned — each letter briefly collectible | the words trying to escape the erasing |
| **Der Verdreher** (NEW) | a grammar-gremlin that SCRAMBLES as it passes — reverses a stretch of conveyor-tiles, flips a door's label, walks sentences backwards; its quickfires are always word-order/form tasks | grammar itself, corrupted — Koki's enemy list ("letters, vocabulary, grammar") completed |

**Per-chapter enemy identity (not just per-chapter bosses):** every chapter fields its own MIX
of the roster plus **one signature sending** — a themed variant (look + one behavior twist) of a
base creature, keyed to the chapter's world (the zoo's Hüpfer are escaped-animal-shaped; the
pirate chapter's Schattenwolke is a storm-cloud that bolts in wave rhythm; the clock chapter's
Tintenläufer patrol in tick-tock time). Variants are data on the doc 25 §8.1 actor tables —
new look + one parameter, never a new engine — so "different enemies in each chapter" (Koki)
stays authorable at wave speed.

Contact rules unchanged (doc 25 §5, built): you cannot kill anything — an unavoidable enemy
freezes the world into a **quickfire** (one prompt, three chips, tier-timed); right answer =
"Gebannt! ✶" dizzy-stars stun; wrong/timeout = it escapes with a letter. The **Federstab** —
already X in Tintenlauf — is canonized as the tool Koki asked for ("your pen, where you can
solve things"): it writes light — it stuns, it pogo-bounces, it plants the flag at the end.

**The per-chapter boss — die Kapitelwächter.** Every level ends in a duel (doc 25 §5.4's
Punch-Out machine, promoted from "K-4, someday" to the climax of every chapter). Each guardian
is built from what the chapter lost — 15 distinct identities on one engine (name · look ·
telegraph flavor · task focus = the unit's grammar + vocab across the full task-type variety):

*(Both §3 tables' content cells are POINTERS, not law: waves author from the unit's ACTUAL
corpus — `content/corpus/units/g1-uNN` + the chapter's story.json — and the corpus always
overrides a table cell. The grounds table describes each chapter's RESTORED state; every ground
renders drained-grey until its chapter is beaten — "first fully-warm ground" at ch14 means its
restored palette is the campaign's warmest, per the arc.)*

| ch | guardian | telegraph flavor | task focus (pointer — corpus wins) |
|---|---|---|---|
| 01 | Der Stundenplan-Schlinger (a timetable knotted into a serpent) | swings class-name cards | school words · am/is first contact |
| 02 | Der Käfig-Klecks (a cage of wrong animals) | rattles bars in rhythm | animals · plurals |
| 03 | Der Sturm ohne X (the Captain's fear, a torn-map kraken) | wave crests telegraph left/right | there-is/are · sea words |
| 04 | Der Gefühls-Wirbler (a mask-spinner wearing wrong feelings) | mask color = attack | feelings adjectives · How-are/How-is questions |
| 05 | Der Ton-Schlucker (a bass-blob that ate the song) | thumps the beat before lunging | instruments · can/can't |
| 06 | Der Spuren-Verwischer (a smudge that hides Mo's clues) | shell-game shuffle | present simple questions |
| 07 | Der Rezept-Reißer (a soup-tornado of torn recipes) | ingredient cards orbit faster | food · I like/don't like |
| 08 | Der Knoten-Kobold (a tangle of taken clothes) | color-flash before each throw | clothes · this/that |
| 09 | Der Futterneid (a creature hoarding all the bowls) | bowl-slam rhythm | pets · has/have |
| 10 | Der Kassen-Krake (a till with too many arms) | price tags telegraph the lane | shop dialogue · how much |
| 11 | Die Steh-Uhr (a clock that refuses to tick) | hands sweep = attack sweep | time · when-questions |
| 12 | Der Kerzen-Dieb (it blows out what others light) | inhale before each gust | months/dates · ordinals |
| 13 | Die Panik (the emergency, embodied — fast, loud, beatable by calm) | siren pitch = pattern | imperatives · help language |
| 14 | Der Graumacher (drains color from favourites) | greyscale wave telegraphs | favourites · because-clauses |
| 15 | **JONA — the rescue duel** (see below) | — | going-to future |

**Ch15 is the inversion the whole design aims at.** The final "boss" is Jona — and the duel
engine runs inverted: his attacks are his own sad notes flying as projectiles (every one a line
the player has read during the campaign); dodging is witnessing, not defeating; **hearts cannot
be lost and Jona cannot be damaged** — the counter-windows are the unit's going-to questions,
and each answered window ERASES one of his defenses instead of his health, until the last window
is doc 18's release question: *"What are you going to do, Jona?"* — answered together, in
going-to, line by line. You beat the book by rescuing its destroyer. (Doc 18 §3 z15, staged;
"you both release and get back into the real world" — Koki — is the shipped walk-out beat.)

**Story beats between levels:** the beat renderer (§6 delta 4) stages doc 18's existing scenes
as dialogue overlays — speech bubbles, character portraits, per-beat illustration slots (art via
the Codex route, S2) — at fixed points: at the building door (the chapter's opening beat), at
mid-level shrines (optional found-notes: Jona's notes hidden one per level, doc 18's note canon
as collectibles), and after the boss (the restoration beat). Grade-1 German-first discipline
(scaffoldDe primary surface) carries unchanged.

## §4 · Year 2 — THE SPILL, same machine, school setting

**The year-2 antagonist call — decided on richness, as directed (Koki delegated: "what is more
rich, makes more sense, is more believable and fun to play" — NOT what's already authored).**
Two candidate year-2s: (a) Jona escapes unredeemed and bewitches the school himself; (b) Jona is
rescued, and what haunts the school is the CONSEQUENCE of his years of erasing. I chose (b), and
here is the richness argument on its own terms: a villain who stays a villain gives year 2 the
same emotional engine as year 1 — whereas "the thing you fixed left a shadow" gives an
11-year-old a genuinely bigger idea (actions have aftermath even after forgiveness) and a rarer
one in games (the sequel's enemy is the first game's cost, not a respawned bad guy). It is more
believable: a child who spent years alone inside a book doesn't flip to evil-mastermind — he
comes out fragile, and the school's haunting being MADE OF his erased words keeps him at the
story's center without repeating him as its boss. And it is more fun to play: year 2 gets a
mechanical inversion (missing-not-thrown, §below) instead of the same fights in new rooms, plus
a companion character (ally-Jona) the player earned by rescuing him. That the authored Spill
campaign already tells exactly this story is a consequence of the choice being right, not the
reason for it. **Koki gates this call explicitly (§9.1).**

The re-mediation: the premise already fits Koki's frame ("he bewitches the entire school…
classrooms are the levels") — the book's ink leaks into the school AND the Blank — made of
Jona's erased words — takes what people look forward to. Ally-Jona (deuteragonist, "reads the
ink") is the year's diegetic hint system: his map-side comments and in-level whispers ARE hints
(wired to the hint-token economy, §5). His guilt/backslide texture (Koki's "not fully satisfied"
instinct) is authored into act-2 beats — he goes quiet near the storeroom, he almost walks back
into a level alone — character depth carrying the unredeemed-energy Koki heard, inside the
richer arc.

- **The hub = the school**, doc 22 §1's three-band floor plan rendered as a walkable map
  (Draußen / Erdgeschoss / Oben-Hinten), excursion zones drawn outside the fence; doc 22 §2.5's
  palette-as-plot arc governs the map exactly as written (Act 1 saturates, Act 2 drains stepwise,
  Act 3 returns wrong-then-right).
- **The levels** = the 15 school areas (doc 20 §3 beats; doc 22 §3's per-zone props become
  level furniture + collectible dressing). Year-2's mechanical signature INVERTS year 1:
  where the book THREW things at you, the school has things MISSING — pale platforms that only
  bear weight once their word is restored (a quickfire on touch), corridors that grey out and
  re-color behind you, level exits the Blank has taken (found by restoring the room's words).
  Leak-creatures (the woken decorations, the talking animals, the spaceport hardware) are the
  moving enemy cast — chaotic, not malicious; the Blank itself is never an enemy actor: it is
  rendered exactly per doc 20 §4 — an absence, taking more when chased.
- **The per-chapter climaxes respect "the Blank is never fought":** acts 1–2 end in leak
  set-pieces on the duel engine (calming the loudspeaker rhyme-beast, landing the gym-spaceport,
  serving the weather-soup — big, funny, "beaten" by the unit's language); act-3 chapters end in
  **care duels** — the inverted engine again (z12: naming feelings IS the counter-window; z14:
  the Pixel rescue on movement language; z15: the class writes Klecks into being — every counter
  window adds a word to the creature's body until the Blank is full). Doc 20 §4's rules bind.
- Emma/Tarik/Berger/Pixel/Finn-cameos as authored. The old detective game stays the bonus story.

## §5 · The economy — collect, earn, unlock (platform-integrated, not bolted on)

Koki's directive: things to collect IN levels that benefit the student LATER; XP; unlockables;
restoration. Designed as three currencies + one ladder, each with a story reason:

1. **Buchstaben (letters)** — the existing in-level pickup (K-3, live). Minor currency, everywhere.
   **100 letters = one Lernkarte** (doc 25 §5.5's exchange, kept — Keen's 100-drops law re-keyed).
   Letters are what the book is made of; you are literally re-collecting the book.
2. **Glühwörter (glow-words) — THE collectible, new.** 2–4 per level, placed off the beaten
   path (verticality pockets, behind a Radierer's patrol, in the secret alcoves — doc 25 §4.2's
   secret quota now carries them). Story: words Jona never managed to erase, still glowing.
   **Each Glühwort collected = one Hinweis-Funke (hint spark) in the student's platform-wide
   pouch: anywhere on the platform — practice, review, checkups excluded by design — using a
   hint first spends a spark, and a spark-paid hint costs NO XP** (Koki's free-hints idea, made
   diegetic: the words you rescued light your way later). Server-side pouch; visible in the HUD
   and on the task-ui hint button ("💡 3 Funken"). My recommendation over the alternatives
   (cosmetic-only, or XP-boosts: hints are the pedagogically honest reward — they pay the student
   in LEARNING SUPPORT, reward exploration, and never inflate scores; checkups stay spark-free so
   assessment integrity holds).
3. **XP** — unchanged law: only real graded attempts through the one brain grant XP (quickfires,
   boss windows, rescue tasks all post real attempts — already true in K-3). Collectibles and
   traversal grant NO XP (the 0-XP-assignments law generalizes: XP measures English, never play).
4. **The visible ladder + unlockables** — Keen §3.2/§3.5 verbatim doctrine: the next reward
   threshold is ALWAYS on the HUD ("Nächste Belohnung bei 20.000", doubling). Thresholds unlock
   from the **unlockables catalog**: player-sprite palettes + accessories (the per-student
   procedural identity stays — unlocks THEME it, never replace it: scarves, hats, Federstab
   skins), hub cosmetics (flag styles, Pixel's collar), and Lernkarte frames. Cosmetic only —
   nothing gameplay-relevant is ever locked behind grind.

Chapter restoration stays the crown reward: color floods the building + its ground, the flag
flies, the map is permanently more alive — progress you can SEE from the first screen (Koki:
"the chapter is restored, it gets color again — it changes").

**Platform reach (Koki: collectibles "should always be part of the gameplay in any thing"):**
the Funken pouch, the spend-before-XP rule and the unlockables registry are built as PLATFORM
services, not game-2d features — any surface can grant or spend them. This bible wires the new
G1/G2 as sources; G3 (novel) and G4 (trip) adopting collectible sources is a later, cheap
content decision (a plan note, master plan W4+), not an engine change.

## §6 · Engine deltas (finite, named — the whole build list)

1. **Level format v2 → v2.1**: header gains `modality: "level" | "boss"`, `theme: <family>`
   (per-chapter tileset/palette family — S1 confirmed v2 has NO theme field today), `chapter`
   (story pointer), `collectibles` (Glühwort placements), `notes` (hidden beat pickups).
2. **Hub map mode** on the walkable engine (OverworldScene): building-entrance tiles with
   destination-naming prompts, flag actors (static + the thrown parabola for the just-beaten
   chapter), blocking terrain cleared by completion state, per-chapter ground theming, map NPCs
   (Finn/Pixel/cameos/watching-Jona) with VISIBLE sprites + "…" indicators (the S1 Codex-verdict
   patterns land here), Jona's pinned notes, optional/secret spots incl. the Pixel-ride. The ✦
   encounter path is removed in map mode.
3. **The boss engine** — doc 25 §5.4 generalized: a script table per guardian identity
   (telegraph set · pattern script · counter-window task slots keyed to the unit's grammar/vocab
   across task types · mastery-tightened windows on SRS re-serve) + the **inversion mode**
   (no heart loss, defenses-not-health) for ch15/care-duels.
4. **The beat renderer** — dialogue overlay staging existing `story.json` scenes: speech
   bubbles, portrait/illustration slots, German-first surfaces, task slots inline (scene tasks
   already exist in the schema). One renderer, both years, replaces in-room dialogue.
5. **Economy plumbing** — server-side Hinweis-Funken pouch (+ spend-before-XP rule in the
   task-ui hint path, checkups exempt), unlockables registry + XP-threshold service, letters/
   Glühwörter/notes in the save container (v3), HUD (hearts · letters · Funken · next-threshold).
6. **Laws & rails (carry + evolve)**: one Phaser chunk ≤400KB gz · ≥30fps floor · VS-18 evolves
   to map↔level↔chapter↔beat bijection (every chapter has exactly one building, one level file,
   one boss script, its beats; every door target resolves) · level laws (doc 25 §4.2) extend
   with collectible-reachability (every Glühwort BFS-reachable at tier E) · release.json remains
   the only student-visible gate + the physical-device pass before any release (standing law).
7. **Retirements** (§8) + save-shape v3 migration for the new progression (no live-player
   constraint — holiday rebuild, Koki 2026-07-16).

## §7 · The content model (what a chapter IS, for authoring at scale)

One chapter = one folder of data, no engine edits (the A-3 doctrine: algorithms assemble,
LLM-intelligence authors, validators gate):
`building` (hub sprite slot + ground patch) · `level.json` (v2.1 rows+legend, themed, laws-
checked) · `boss.json` (identity + script + task-slot keys) · `beats` (the EXISTING story.json
scenes, staged by anchor: door / notes / restoration) · `collectibles` (Glühwort + note
placements). Fable prototypes chapter 01 end-to-end (the vertical slice, §9); the frozen
template + these tables replicate chapters 02–15 as Opus waves with per-act Koki gates —
same calibrate→replicate law as every content program on the platform.

## §8 · What retires · what is untouched

**Retires with this bible** (code parks in-repo until the new G1 releases, then the surfaces
are removed): the G1 top-down page-rooms + card hub · the ✦ sparkle encounter path · the
**Word-Battle BattleStage surface (Koki: retire)** · doc 22's rooms AS play-spaces (its
geography/palette/props live on in §4) · plan-v2 lanes GM-B/GM-E and the GM-A3 room-NPC fix
(hub NPC visibility replaces it, §6.2).
**Untouched:** G3 (novel) + G4 (trip) engines and campaigns · the detective bonus story ·
practice/review/tests/checkups/Studio/journeys (journey game-pointers re-target the new G1
surface when it releases — a validator note, not a redesign) · the task system + one brain ·
identity/roster · the vocab-intelligence program (S3) · Codex containment plan (S2).

## §9 · The gates

1. **This bible** — Koki reads §1–§5 (the design) and answers three things: the guardian table
   direction (§3), the Glühwörter/free-hints economy (§5), the year-2 inversion (§4). ~20 min.
2. **The vertical slice** (next Fable session, master plan W1): chapter 01 END-TO-END — map
   mode with the 15-building map SKELETON (macro-geography + act chokepoints, buildings as
   silhouettes) and ONE building fully built · themed level 01 · Der Stundenplan-Schlinger duel
   · beats staged · letters/Glühwörter/Funken live to the pouch · restoration beat. All
   procedural placeholder art (doc 25 §9 visuals-last holds — the slice must feel right ugly,
   then S2's art program makes it beautiful). **The slice's explicit design freedoms** (it
   legislates these knowingly, and the template freezes them): map macro-geometry · the duel's
   dodge verbs (lanes vs. full moveset) · beat→anchor mapping for ch01 (incl. whether the
   cold-open beat rides the slice) · restoration presentation · Glühwort placement rhythm.
   Koki plays it ~15 min; his verdict freezes the chapter template for the waves.
3. **Per-act releases** thereafter (master plan W3): act gates + the device pass.

*Coverage note: every element of Koki's two 2026-07-16 directives maps to a section here —
the machine-checkable list rides the PR body. Sources: docs 18 · 20 · 22 · 25 ·
study/keen/keen-metagame.md · S1 verdict. Written to be executable by a fresh session with
only this document, doc 25, and the repo.*
