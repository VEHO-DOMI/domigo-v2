# G2-N · "The Spill" / "Der Klecks" — the campaign bible (the book-world duology, part 2)

_Written 2026-07-11 by Claude Fable 5 (Fable-reserved, BLUEPRINT_V2 Part IV.2). Status: **gate pack for Koki** — this document + chapter 1 authored in the new bundle `content/corpus/stories/g2.st.the-spill/` (NO release.json, NO map.json yet — invisible to students and to the loader; B-2 builds the overworld it runs on). Koki's approval of this PR = the G2-N gate. The old "The Wrong Name" stays live and untouched until B-2 swaps it to bonus-story status (it keeps its case-file hub skin there — the HUB_THEME doctrine)._

---

## 1 · Premise

> **In grade 1 you went into the book. Now the book comes to school.** Jona — freed at the end of "The Lost Pages" — starts his first real school year in your class. But something came out with him: the book's ink is *leaking* into the school, and story-logic infects it unit by unit — Halloween decorations wake up, the bio-room animals start talking, the town map rearranges itself. That part is chaos, but it's *alive*. The real problem is quieter: **the Blank** — the emptiness left where Jona erased all those pages — followed him out too. And the Blank is hungry. It doesn't make noise. It *takes*: a word from the blackboard, the menu from the cafeteria, the weekend from every calendar.
>
> You and Jona — the only two who know what's happening — fix the leaks and follow the taking, until you learn what the Blank really is: **it's made of Jona's erased words.** It isn't a monster. It's everything he rubbed out, still wanting to be written. The finale doesn't defeat it — the class **writes it a story of its own and cares for it**, and the Blank, filled with words at last, becomes **Klecks**: a small ink-creature, the class's strangest pet, the book's new keeper.

Theme (Koki's, verbatim intent): **you fix what you broke — together.** Jona's redemption, started in G1, completes only when he faces what his sadness created — and the answer the story gives an 11-year-old is not "destroy the bad thing" but "*fill* the empty thing."

**Why it's fresh vs G1 (one line):** G1 was restoring someone else's damage inside the book; G2 is living with the consequences outside it — the damage follows you home, and this time the antagonist is a feeling, not a person.

## 2 · Cast

**Carryover (book-world canon):**
| id | Who |
|---|---|
| `jona` | **The deuteragonist.** Enrolled as a real student (Frau Berger's class — she knows more than she says). His years inside gave him the ability to **read the ink**: he sees what leaked, what's wandering, what's been taken. His voice has grown since G1 — still short sentences, but warmer, drier, occasionally funny. His arc: from "I broke this" to "we fixed this." |
| `berger` | Frau Berger — the class teacher, canon in both grades. Warm, practical, *suspiciously unsurprised* by certain things (she welcomed Finn back in G1's finale; she has read this book). Comic relief that never becomes a fool. |
| `pixel` | The book-cat — now simply lives at the school, uninvited and unbudging (nobody remembers deciding this). Non-speaking; the early-warning system: Pixel stares at what the Blank will take next. |
| Finn | Cameo visits only (u06 library beat, u15 finale) — the book-guide checks in on "his two favourite readers." Deliberately NOT a party member: G2 belongs to the kids. |
| `narrator` | New for G2 (the Phaser G1 campaign had none): present-tense, light, close to `you`. Used sparingly — scene-setting and the closing beat of each chapter. |

**New cast:**
| id | Name | Role |
|---|---|---|
| `emma` | Emma | The class skeptic — sharp, funny, refuses to believe in walking words for exactly two chapters. Once convinced, she's the best planner the team has. Her arc mirrors the player's buy-in. |
| `tarik` | Tarik | The enthusiast — loves everything (PE, aliens, talking hamsters) instantly and loudly. The heart-of-the-group slot; his unguarded kindness toward the Blank (u12) is the pivot the finale stands on. |
| — | **The Blank** | The antagonist-then-ward. A pale smudge that *takes* words, colours, sounds, plans. **Never speaks until u12 — and then ONLY in single words: the words it has eaten.** (Chilling and heartbreaking at once; at A2 level this is also perfectly gateable — it literally speaks in corpus vocabulary.) It is never drawn as a monster: it is an absence — a paler patch, a missing thing, a quiet. |

Proper-noun registry: Jona (G1 canon) · Emma · Tarik · Frau Berger · Pixel · Finn · Klecks (from u15). "The Blank" is a common-noun phrase in-story ("the blank", "die leere Stelle") and never capitalizes into a name in student-facing text until the finale names it Klecks.

## 3 · The 15-beat map (chapter = unit = school zone; the unit's language IS the beat)

**ACT 1 — The leak (z01–z06): story-logic arrives, and it's (mostly) wonderful.**
- **z01 · u01 First Day Back at School — "The First Day (Again)" — Klassenzimmer (in this PR):** Jona's first real school day; timetables and subjects; Pixel installs herself. The first leak: ink crawls out of Jona's bag and writes on a desk. THE HOOK: a word vanishes from the blackboard — not wandering: *taken*, by a pale smudge in the corner. Jona: "Ink writes. This takes. It followed me out." Emma sees nothing; the team is two.
- **z02 · u02 How embarrassing! — "The Wrong Announcements" — Aula:** the leak reaches the loudspeakers: morning announcements come out as rhymes, teachers' words swap mid-sentence — a parade of the unit's embarrassment lexicon. First fix-the-leak quest structure established (find the wandering words, put them back). Emma catches the ink red-handed → the team is three.
- **z03 · u03 Halloween — "The Decorations" — Gang (dekoriert):** the corridor's Halloween decorations wake up (Koki's beat) — friendly-spooky, never horror: the paper bat wants OUT of the draft, the plastic spider is afraid of heights. Meanwhile the Blank takes all the orange from one wall. Tarik joins ("THIS IS THE BEST SCHOOL YEAR EVER").
- **z04 · u04 What an animal! — "The Talking Bio Room" — Biosaal:** the bio-room animals talk (Koki's beat) — and complain, accurately, about everything. The hamster has *opinions*. First real Blank clue: the animals refuse to go near the storeroom corridor. Animals like Jona (G1 canon echo).
- **z05 · u05 Where's the supermarket? — "The Wandering Town" — die Stadt (excursion zone):** the class excursion; the town map rearranges itself (Koki's beat) — the supermarket is never where it was. Directions vocabulary IS the repair: pinning the town back down street by street.
- **z06 · u06 Time for adventure — "The Adventure Shelf" — Bibliothek:** the library's adventure shelf leaks a quest into the building; **Finn's cameo visit** (proud, useless, delightful — "I do not fix leaks. I AM a leak."). Act-1 curtain: Jona measures the leaks and realizes they're not random — the ink is *running from* something.

**ACT 2 — The taking (z07–z11): the Blank steps forward; wonder turns to worry.**
- **z07 · u07 Plans for the weekend — "The Missing Weekend" — Schulhof (calendar board):** THE MIDPOINT. The Blank goes big: weekend plans vanish from every calendar, every diary, the board by the yard — the school literally cannot say what it will do on Saturday. Planning vocabulary rebuilds it. First time the whole class notices *something* is wrong. Emma names the pattern: "It only takes what people *look forward to*."
- **z08 · u08 Out of this world — "The Gym Spaceport" — Turnhalle:** the sci-fi shelf leaks (Koki's beat): the gym is a spaceport for one glorious chapter. Big fun on the surface; underneath, Jona quietly tests a theory — the Blank avoids the leaks. It doesn't want story. It wants *quiet*.
- **z09 · u09 Eating out — "The Eaten Menu" — Schulkantine:** the cafeteria serves storybook food (the soup has weather in it); then the Blank eats the MENU — nobody can order what they can't name. Food vocabulary as literal repair; Ben-free comedy carried by Tarik's reviews.
- **z10 · u10 Who's in your family? — "The Photo With a Gap" — Jonas Straße (home zone):** THE HEART. First chapter at Jona's home: his family's photos have a pale gap where he should be — the years in the book took him out of the pictures. The unit's family vocabulary rebuilds his place, person by person, name by name. The reveal lands here: the gap in the photos and the smudge at school are **the same paleness.** The Blank is made of what Jona erased — including himself.
- **z11 · u11 Homes — "Where the Blank Lives" — die alte Abstellkammer:** tracking the Blank to its "home": the old storeroom where the book was kept for years. Homes vocabulary maps the lair — except it isn't a lair; it's a nest of taken things, arranged carefully, like someone keeping what nobody else wanted. Nobody fights. Everyone goes quiet. Jona: "I know this room. I lived in one like it."

**ACT 3 — The filling (z12–z15): you can't unsay a thing — but you can say the next thing.**
- **z12 · u12 Feeling bad and feeling better — "The First Word Back" — das stille Zimmer:** the empathy pivot. Feelings vocabulary is literally the mechanic: naming feelings calms the Blank (sad, lonely, afraid — each named feeling makes it a shade less pale). **The Blank speaks for the first time — single stolen words only.** Its first word back: "…glad?" — Tarik, unguarded: "You can keep that one." The room decides: we don't chase it anymore.
- **z13 · u13 Rain and sun — "The Grey Day" — Schulhof im Regen:** the Blank's distress greys the school out — colour and weather words bring it back. The chapter teaches the campaign's quiet rule: the Blank takes MORE when it is chased, LESS when it is included. (The class starts leaving it words on purpose — small ones, spare ones.)
- **z14 · u14 Move and keep fit! — "Sports Day" — Sportplatz:** the rescue inversion (the G1 z13 rhyme): during sports day the Blank, panicked by the noise, swallows the gym — WITH Pixel inside. The physical rescue runs on movement vocabulary; Jona goes in first: "I have been inside an empty thing. You can come back out." Trust completed on both sides.
- **z15 · u15 Caring for animals — "Klecks" — die Buchecke (finale):** the resolution IS the unit: **caring**. The class writes the Blank a story of its own — every kid contributes words (the campaign's collected vocabulary literally becomes the creature's body) — and the Blank, filled at last, becomes **Klecks**: a small, round, ink-black creature with one white patch, the class's strangest pet and the book's new keeper. Finn returns for the last page; Frau Berger pretends to be surprised; Pixel and Klecks ignore each other magnificently. Final image: the book on its shelf in the Buchecke, a new last page — *written by everyone* — and Klecks asleep on it. The book-world duology closes warm and COMPLETE.

## 4 · The Blank — design rules (binding)

1. **An absence, never a monster:** always rendered as paleness/missing-ness (a word gone, a colour gone, a gap in a photo). No teeth, no eyes until Klecks.
2. **It takes what people look forward to** — because those are the *fullest* words. This is the emotional logic that makes u07/u10 land.
3. **It never speaks before u12; from u12 it speaks ONLY in words it has taken** (single words, always corpus vocabulary — chilling, heartbreaking, and level-gate-perfect by construction).
4. **Chased ⇒ takes more. Included ⇒ takes less.** The class discovers this as a rule and the player *plays* it (z13).
5. **It is never defeated, punished, or banished.** It is filled, named, and cared for. Klecks keeps one habit: it still collects spare words — now people give them freely.
6. Jona's line owns the campaign (carried from Nan's G4-v1 slot, book-world version): *"You cannot un-erase a thing. But you can write the next thing."*

## 5 · Register sheet (binding for every wave line)

- **A1+/A2, grade-2 register:** bigger comedy than G1 (11–12-year-olds), still ≤2 sentences/line, ≤200 words/scene; du-form scaffolds; zero meta-talk (VS-8); glossed-deliberately against the cumulative bank (inflected surface forms need glosses — the standing lesson).
- **`scaffoldDe` is first-class prose and VS-17-required at g2** (scenes, choices, flagLines) — natural kid-German; the L-1 toggle makes German one tap away for every g2 student even though English leads by default.
- **Sad-not-scary carried from G1, one notch up:** "unheimlich" moments allowed (the quiet after a taking), horror never. Banned words unchanged (monster, ghost-as-threat, blood, die/dead, evil). "Scary" appears ONLY to be answered — the campaign's thesis line lands in ch01: *"It is not scary. It is sad. Sad things can look scary."*
- **Jona's voice:** short, dry, warmer than G1; he jokes now (rarely, and it lands). He never lectures about his past; it surfaces in single lines ("My last first day was a long time ago.").
- **Emma earns her belief** (two chapters of good skeptical questions — her doubts are always REASONABLE); **Tarik's enthusiasm is never mocked** — it's the finale's superpower.
- **Frau Berger knows more than she says** — played for warmth, resolved never (the adults-err-kindly doctrine: her not-quite-surprise is the joke, and she always does the right teacherly thing).
- **Every heavy beat ends with one warm hand** (G1 rule carried): Pixel's stare, Tarik's blurt, Jona's dry aside.

## 6 · What B-2 builds from this bible (the engineering manifest)

- **The overworld:** 15 school zones on the generalized `@domigo/game-2d` engine, one per unit — `map.json` (map@1) with generators from a NEW school theme family (append-only in `art-gen/theme.ts`): `classroom` (u01) · `aula` (u02) · `corridor-halloween` (u03) · `bio-room` (u04) · `town-square` (u05, the excursion zone) · `library` (u06) · `schoolyard` (u07) · `gym-spaceport` (u08) · `canteen` (u09) · `home-street` (u10) · `storeroom` (u11) · `quiet-room` (u12) · `yard-rain` (u13) · `sports-field` (u14) · `book-nook` (u15). The `G1_SCHOOL_IMAGE_PROMPTS.html` pipeline clones per zone (the school tileset was literally built for this).
- **Choice policy: linear spine** (like G1). The Phaser runtime has no flag machinery today; the story is authored linear by design — the Blank's arc needs no forks (its consequence system is thematic, not branching). If B-2 later ports FlagGate, u12's feeling-naming could gain cosmetic flag flavor; nothing depends on it.
- **Hub identity (HUB_THEME doctrine):** new entry `"g2.st.the-spill": "ink"` + a `dgh-ink` skin — pale paper cards with an ink-blot corner and blue-black accents; **locked cards render half-erased** (the Blank took them — the level-select itself tells the story). "The Wrong Name" keeps `case` as the bonus story.
- **The one save slot:** the new campaign takes `game:g2`; the detective game moves to `game:g2:bonus` (already specced in B-2 step 5).
- **`.ci.` namespace:** this bundle's comprehension keys are distinct from the old campaign's (`the-smudge` vs the wrong-name keys) — both grade-2 stories' items must keep grading (the B-0 canonical+bonus resolution).

## 7 · What Koki approves at this gate

1. **Title:** "The Spill" / **"Der Klecks"** — and the finale payoff (the Blank → Klecks, the class pet made of returned words).
2. **The Blank's design** (§4) — an absence that takes what people look forward to, speaks only in stolen words, and is filled rather than defeated.
3. **The 15-beat map** (§3) — especially z07 (the missing weekend), z10 (the photo with a gap — the heart), z12 (the first word back), z15 (the finale).
4. **The new kids** (Emma the skeptic, Tarik the enthusiast) and Finn-as-cameo-only.
5. **The register sheet** (§5) and the ch01 voice test in this PR.

## 8 · Exit criteria (this PR; the narrative loop)

- `pnpm content validate-story` green with the new bundle (VS-1…VS-14 **+ VS-17** — full scaffoldDe coverage at g2); no release.json/map.json → invisible, loader invariants untouched (the #86/#108 precedent).
- Ch01 task slots resolve to real g2-u01 items (VS-4); the new `.ci.` is fully in-bank (VS-12).
- Register self-check against §5 in the PR body; full standing gate.
- Playability arrives with B-2 (the overworld this story runs on) — stated honestly; the gate is a read.
