# G1-N · "The Lost Pages" — the revision bible (the book-world duology, part 1)

_Written 2026-07-10 by Claude Fable 5 (Fable-reserved item, BLUEPRINT_V2 Part IV.2). Status: **gate pack for Koki** — this document + the revised ch06 in `content/corpus/stories/g1.st.lost-pages/story.json` (the voice test) ride one PR. Koki's approval of that PR = the G1-N gate; chapter waves follow. Decisions in here were delegated to Fable ("make all the decisions yourself") — Koki can overrule any of them at the gate; names and beats are cheap to change before volume, expensive after._

---

## 1 · What this revision is

The shipped G1 campaign works mechanically (15 zones, restore-the-pages, cameo per zone) but has **no cause, no mystery, and no heart**: pages are simply "empty," the player simply fills them, every chapter ends "Next room!" The revision keeps every zone, every cameo, every task slot, and the entire frozen engine — and threads ONE story through the 15 chapters:

> **The book is not fading. Someone inside it is rubbing it out.** A boy named **Jona** — a student from years ago who was so lost in English class that he hid inside the book, and the book kept him — has been erasing the pages out of loneliness and anger. The player investigates, finds him, and — instead of defeating him — **teaches him back out**. The last page's own grammar ("What are you going to do?") is his release question.

This is Koki's premise (2026-07-10, verbatim intent: "someone flipped the whole book upside down… a former student… so disheartened he starts erasing things… your task is to restore the damage… the student doesn't even realize he's solving tasks, just solving the story"). The revision also sets up G2: the redeemed Jona becomes the deuteragonist of the G2 campaign (the book leaks into the school; he can "read the ink").

**What does NOT change:** the 15×11 grid, zones, saves, encounters, task slots and their item IDs, XP, the retry ladder, the hub board. This is a data-only narrative retrofit (BLUEPRINT_V2 B-1: `story.json` + `comprehension.json` + later `cast.json`/`names.json` additions; zero Phaser/save changes).

## 2 · Canon and cast decisions

| Decision | Choice | Why |
|---|---|---|
| Antagonist name | **Jona** | A1-pronounceable, Austrian-school-plausible, gender-clear, soft/sad sound; collides with no name in any of the four casts (checked: G1/G2/G3/G4 cast + names files). German-friendly spelling — kids will say it aloud. |
| Antagonist nature | A hurt child, never a villain | Koki doctrine (adults err kindly; no cartoon villains). Jona's notes escalate from anger → loneliness → hope. **Rule: Jona never damages a page the player has restored.** From the day someone starts fixing his damage, he only watches. That's the hope-logic the finale cashes in. |
| The trope question | **No companion-girl, no wise mentor.** Finn is implicated instead | Koki flagged the forced-trope trio. We add no one. Finn — already canon as the book-guide — gains the arc: **he saw Jona come into the book years ago, was afraid, and told no one.** The cheerful guide has been managing his guilt the whole game. His confession (z11) is the emotional midpoint. |
| Pixel's role | The witness | The book-cat senses Jona before anyone (hisses at shadows, finds smudges, later is the first to LIKE him). Cats don't explain; perfect for a mystery at A1. |
| Zone cameos | All preserved | Each zone's existing character carries that zone's anomaly (see the beat map). No cameo is cut; several get one extra line of purpose. |
| Jona's first appearance | Notes only until z11 (named), body from z12 | The mystery must be *investigated*, not shown. His handwritten notes are the connective tissue — always short, always present tense, always sad-not-scary. |
| Register | Sad-not-scary, A1 | See §5. The word "villain" and horror vocabulary never appear. The threat is emptiness and loneliness, rendered gently. |

## 3 · The 15-beat map (zone = unit = chapter; existing cameo in parentheses)

**ACT 1 — Wonder, and something wrong (z01–z05).** The player learns the game's joy (restore pages) while anomalies accumulate. The book isn't just fading — it's being *tampered with*.

- **z01 · Time for School (Frau Berger):** as shipped — the empty class page, first restoration, joy baseline. ONE new seed: a restored word appears written backwards for a moment; Finn laughs it off *a little too fast*. ("Pages do funny things. Come!")
- **z02 · At the Zoo (Zoo Guide, Pixel):** animals in the wrong places on the page. Pixel finds a **pencil smudge** that doesn't belong to the book — the first physical trace. Pixel joins the walk.
- **z03 · Pirates (Captain):** a character acting wrong — **the Captain is afraid of the sea** (Koki's own example). His map is missing its X: not faded — *torn out*.
- **z04 · Feelings (Robo):** the feelings unit carries the scrambled-emotions anomaly — Robo laughs when he is sad, cries when he is happy. First note fragment, rubbed hard into the page: **"NOBODY"**. Nothing else survives.
- **z05 · Our Band (Anna):** the song's words erased mid-line; the band can only hum. Act-1 curtain, Finn's admission: *"Pages do not fade like this. Someone rubs them out."*

**ACT 2 — The investigation (z06–z10).** The player and the cast work out WHO. Every clue is also an empathy beat: the "someone" is small, cold, alone, and sorry.

- **z06 · Detective (Mo) — THE TURN (the voice-test chapter, in this PR):** Mo's clues are gone; the office keeps its shape but loses its word. Restoring the page turns up **the first full note — "Nobody helps me. Nobody plays with me."** — pure present simple (the unit's own grammar), unsigned, and sadder for its smallness. Pixel hears something between the pages. Finn, asked who could write this, says *"I do not know."* — **the lie.** (The existing `.ci.` "What does Detective Mo lose? → His clues" stays true.)
- **z07 · I Love Noodles (Chef Luca):** Luca forgets his food words mid-recipe (Koki's example). In the spilled flour: **small footprints. A child's.**
- **z08 · Clothes (Mila):** nothing erased here — a warm jacket is *missing* from the page. Mila: "Somebody needs it more." The empathy pivot: whoever it is, **he is cold.**
- **z09 · Unusual Pets (Professor Tim):** the creatures aren't afraid of the shadow-boy; food bowls are left filled overnight. **Animals like him. He feeds them.** (Pixel stops hissing.)
- **z10 · In a Shop (Mrs Apple):** small things taken — each "paid for" with a scrap of paper. Mrs Apple keeps them all: *"He says sorry. Every time."* The player reads one: "I am sorry. I have no money here."
- **z11 · What's the Time? (Tik the Clockmaker) — THE NAME:** Tik knows, because clocks know: *"Time in the book stands still for him. He came in long ago. He cannot go out."* And Finn confesses: he SAW a boy climb into the book years ago, was afraid, told no one, and has been guiding students through it ever since — partly to make up for it. The boy's name: **Jona.**

**ACT 3 — Finding Jona (z12–z15).** No chase, no fight. The player does for Jona what nobody did: shows up.

- **z12 · The Birthday Cake (Omi Rosa):** the class discovers Jona's birthday page — **the birthday he never got.** They restore it AND throw it, for him, in absence. He shows himself for the first time — stands at the edge of the page — and runs. But he takes the invitation.
- **z13 · Help! (Emergency Sam):** the rescue inversion. Jona's years of erasing have left an empty spot in the book, and it is growing toward HIM. The unit's emergency language is spent saving *the antagonist* — the player calls it, Sam leads it, Jona takes the offered hand. **Trust is formed by rescue, not speech.**
- **z14 · It's My Favourite (DJ Peppi):** the first real conversation. Jona's favourite things restored one by one — the unit's whole lexical field IS the scene ("My favourite colour is… I like…"). The book visibly brightens: **restored hope restores pages.** Jona helps fix a page himself — the redemption mechanic made literal.
- **z15 · What Are You Going to Do? (Frau Berger) — THE RELEASE:** the door to school opens as shipped — but now it's Jona's door. The finale asks him the unit's own question: *"What are you going to do, Jona?"* — and he answers in going-to, line by line, with the player's help (the unit's grammar tasks ARE his answer). Both walk out — Jona released, **Finn released from his guilt** ("Welcome back" now lands on both). Final image, gentle: the book is safe, quiet… and a little thin in places. One small pale smudge stirs where Jona used to sit. *(The G2 hook — "the Blank" — planted in five seconds, zero horror.)*

## 4 · Structural rules for the chapter waves

1. **Task slots are load-bearing and unchanged by default.** Rewrites keep each chapter's existing `taskSlots` (IDs + positions may shift scene but not unit). New slots only where a beat genuinely wants one, always ≤ the chapter's gate unit (VS-4).
2. **`.ci.` comprehension stays true or gets updated in the same PR.** Where a beat changes what happened, the comprehension item is rewritten in `comprehension.json` (same ID if the question survives, new ID if not). Each Act-2/3 chapter SHOULD add one new `.ci.` at its mystery pivot ("Who feeds the animals?") — input checked before output.
3. **Jona's notes are a fixed form:** ≤2 sentences, present tense, no contractions beyond the bank, unsigned until z11. They are diegetic reading material — level-gated like everything else.
4. **Scene budget:** chapters stay 8–10 scenes; ≤2 sentences per line; glosses per scene (re-gloss repeats); the glosses ARRAY is the only escape — never `(= …)` inline in `textEn`.
5. **Finn's lie (z06) must stay subtle:** one beat, no lampshading, paid off only at z11. At A1 the register carries it, not vocabulary.
6. **Rollout:** three revision-wave PRs — Act 1 (ch01–05), Act 2 (ch07–11; ch06 ships with this gate pack), Act 3 (ch12–15) — each leaving the bundle validate-green and playable; revised released chapters go live on merge (self-contained beats, so mixed old/new neighbors read fine mid-rollout).
7. **Cast/names additions:** `jona` enters `cast.json` + `names.json` in the Act-2 wave (his name first appears z11). The z13 "empty spot" is never capitalized as a name in G1 (it becomes "the Blank" in G2).

## 5 · Register sheet (binding for every wave line; extends the platform register)

- **Tone:** sad-not-scary. Banned outright: monster, ghost, dark(ness)-as-threat, scream, blood, die/dead, evil, villain. The threat is *empty*, *quiet*, *alone*, *cold* — words a 10-year-old already owns.
- **Jona's voice:** short flat sentences, present tense, first person. He states facts about himself ("Nobody helps me." "I am cold." "The animals are nice."). He NEVER threatens. His anger is only ever in what he does to pages, and it stops the moment someone fixes one.
- **Finn's voice:** warm as shipped, but from z05 his cheer gets small cracks — one-beat hesitations, a subject change. After z11 he is quieter and more honest. He never self-flagellates ("Ich bin schuld!" — no); he says what he did and what he'll do now.
- **Every heavy beat ends with one warm hand** (Pixel's purr, a cameo's kindness, Finn's "Komm."). No chapter ends on the sad beat itself.
- **A1 discipline:** du-form scaffolds everywhere; ≤2 sentences/line; glossed above-level words ≤4 per scene; grammar named never (VS-8); kid-German glosses `(word → de)` via the array.
- **The redemption is taught, not granted:** Jona is never told "it's okay." He is *shown* the thing he missed (a birthday, a rescue, a conversation) and then ASKED the future-tense question. Agency stays his.
- **`scaffoldDe` is first-class prose (L-1 amendment, 2026-07-10):** grade 1 reads GERMAN-FIRST — the German line is the primary surface, not a translation aid. Write natural kid-German (never translationese) at the same register bar as the English; waves review the German lines with the same care. VS-17 enforces presence on every scene/choice/flagLine at grades ≤2; this sheet enforces quality.

## 6 · What Koki approves at this gate

1. **The name** (Jona) and his nature (hurt child, hope-logic rule).
2. **Finn implicated** (the lie at z06 → confession at z11).
3. **The 15-beat map** (§3) — especially z12 (birthday-in-absence), z13 (rescue inversion), z15 (both walk out + the five-second G2 hook).
4. **The register sheet** (§5).
5. **The revised ch06** in this PR — the voice test. If ch06 reads right to him, the waves are calibrated; if not, we recalibrate here, before any volume.

## 7 · Exit criteria (this PR; the narrative loop, BLUEPRINT_V2 Part III)

- `pnpm content validate-story` green (VS-1…VS-14 + release) with the revised ch06.
- The chapter's four task slots unchanged and resolving (VS-4); the existing `.ci.` `g1u06.ci.mo-loss.mc.001` still true of the rewritten beat (verified by reading, stated in the PR body).
- Register self-check against §5 written into the PR body.
- Full standing gate.
- Koki plays z06 in-app (or reads the script in the PR body) → gate verdict.
