# 44 · THE PAINTED BOOK — FULL-GAME MASTER PLAN (R4, "the Variety Round")

**Status: GOVERNING for the R4 round once merged (Fable 5, 2026-07-29; Koki's brain-dump session).**
Amends doc 31 (pivot canon), doc 41 (design pass), doc 27 (economy + guardian pointers) exactly
where §1/§2 say so — everything not amended here stands. Doc 43's G2 divergence is settled for
G1's purposes by Decision 1 (§1.9). Source of truth for curriculum stays the corpus
(`content/corpus/units/g1-uNN` + `structures/g1`); a table cell here is a pointer, corpus wins.

**What this round is.** Koki reviewed docs 31–43, replayed both parked builds (the Keen-style
"Die verknotete Stunde" and the v0 top-down build), delivered a full-game brain dump
(2026-07-29; 32 screenshots + a screen recording in
`docs/Rayman X DomiGo Screenshots/July 29th Screenshots/`), and answered four decision
questions. Two headline findings drive everything:

1. **The repetition problem.** ch01–05's designs and art run one formula; ten more would be
   bland. → **THE VARIETY LAW** (§2.1): every chapter gets its own gameplay modality, palette,
   and bespoke boss — the way the studied 1995 source varies its levels.
2. **The immersion problem.** A task must never be a bare text box. The Keen build proved the
   immersive battle overlay; the v0 build proved the transition into it. → **BATTLE OVERLAY
   2.0** (§3.1) — the synthesis, re-skinned to STYLE_PAINT_V1.

---

## §0 · THE IDEA LEDGER — the completeness contract

Every item from Koki's 2026-07-29 brain dump, numbered, with its disposition. Nothing here may
be trimmed in execution; the blind coverage check verifies this doc against this ledger.
(A = story canon · B = laws · C = ch01 rebuild · D = per-unit seeds · E = infrastructure ·
F = process. Disposition: **canon** = §1, **law** = §2, **spec** = §3, **dossier** = §4,
**prod** = §5, **deferred** = named + parked.)

| # | Item (faithful to Koki's words) | Disposition |
|---|---|---|
| A1 | Bewitcher backstory: a student so bad at English — never understood vocabulary or grammar — that in frustration he ripped pages out of his own book, scribbled, crossed out, cursed, threw it. Not evil; wounded. | canon §1.1 |
| A2 | The book swallowed him; the spell spread to other copies of the same book from the same publisher (fantasy suspension of disbelief is fine). | canon §1.1 |
| A3 | The player owns the EXACT book he had — restored by him to mint condition as deliberate bait ("his plan all along"). | canon §1.1 |
| A4 | Secretly he desperately wants out too — and doesn't consciously know it. | canon §1.1 |
| A5 | The whole class falls in: player (boy/girl) + **15 classmates** (one per unit; was 12) + the teacher. | canon §1.2 |
| A6 | The teacher is trapped too, hidden; **freeing the teacher is the finale reveal**. No mentor figure during play — each level states its own objective. | canon §1.2/§1.8 |
| A7 | 15 classmates, each a unique recognizable design + name (naming law); freed ones may appear accompanying/in background. | canon §1.3 + prod §5.4 |
| A8 | Freed beings join "your team" — the camp re-fleshed as the growing **alliance**. | canon §1.4 |
| A9 | Boss-as-henchman: every chapter boss is the unit-being OSWIN bewitched and used as his pawn to bewitch the rest; beating = freeing it; it joins. | canon §1.5 |
| A10 | Year-1 finale: everyone gets out, OSWIN too — **no instant on-screen redemption** ("frees and forgives" is not the direction now). | canon §1.9 (Decision 1) |
| A11 | The escape key: in U14's fiction the class finds a story about kids trapped in a book — with the way out; U15 applies it: **the book lets you go only if you tell it what you'll do outside** (going-to). | canon §1.7 + dossiers ch14/ch15 |
| A12 | The prologue is redone from scratch at the END of the build. | prod §5.6 |
| A13 | Per-unit prologues/epilogues — the story gets TOLD, visually supported ("essential"). | spec §3.6 + prod |
| A14 | Abilities lore: the bewitchment that traps also empowers — the book's magic gives the mascot form and the ability arc. | canon §1.6 |
| A15 | Ambient ink-spirit creatures may haunt levels as child-friendly ambience. | canon §1.6 + doc 40 WATCHER class |
| A16 | G2 vision (context): OSWIN surface-villain in the real school, whodunit, un-aged, magic intact. Conflicts doc 20. | settled for G1 by §1.9; G2 decision deferred to the G2 design gate |
| B1 | **Variety Law** — no one-size-fits-all formula; modalities vary per chapter (Rayman-style + originals). | law §2.1 |
| B2 | Freeing supersedes naming — naming is one task form; punching only shoos. | law §2.2 |
| B3 | No death; contact opens a task; miss costs momentum + scattered collectibles. | law (doc 31 §1.3 confirmed, unchanged) |
| B4 | Signature beat flexibilized: the defeated guardian's reaction fits the unit (not always crying); player consoles; it joins. | law §2.2 |
| B5 | Cage law corrected: cages are for CLASSMATES (one per chapter); other beings freed per the unit's fiction. | law §2.3 |
| B6 | Style register stands; **palettes and light vary per level** (current ch01–05 art uniformity is a defect). | law §2.4 |
| B7 | Fresh-eyes nuance: legacy MECHANICS/UX adoptable when they re-earn their place; ART always re-commissioned painted. | law §2.5 (sharpens doc 31 §1.6 + doc 42's mining law) |
| B8 | Every chapter opens with a visual **objective screen**. | law §2.6 + spec §3.4 |
| B9 | Platform-wide XP → levels with clever funny names → perks (first: selectable avatars, own art batch; more perks later). | spec §3.5 (shaped by Decision 3) |
| B10 | Collectible-skin law: collectibles themed per unit, with a reason. | law §2.7 |
| B11 | **Battle Overlay 2.0** — full anatomy (transition, dim, timer, action line, fiction line, portrait, input, animated resolution). | spec §3.1 |
| B12 | Enemy-behavior variety incl. jumping enemies; deployed meaningfully; dynamics unlock over the year. | law §2.1 + doc 40 rig (unchanged) |
| B13 | Bespoke bosses, mechanics designed against our ability arc + source studies; boss tasks = the level's task culmination. | law §2.8 + dossiers |
| B14 | Full-code animation is legitimate (v0 ink creature had zero assets). | spec §3.1 |
| B15 | Magnet collect (walk-under attract + jump-in). | already live in `sim.ts` (R3b); skins per §2.7 |
| B16 | Two-step object restore: name it → colour floods → name the colour → restored persistently. | already live (R3b `restore`); staged per ch01 dossier |
| B17 | Classmate reawakening: ghost-blue classmate does wrong actions round by round; correct command restores motion. | spec §3.3 + ch01 dossier |
| B18 | Source mining from Rayman study + Keen/omnispeak; reference only. | law §2.5 + F-correction §5.8 |
| B19 | The card FONT Koki liked in the legacy modals (screenshot 13.25.34) carries: the three-face typography (Fredoka display · Inter body · Quicksand labels, doc 42 §5) is the binding face set for every Overlay 2.0 card. | spec §3.1.9 |
| B20 | The contraction-picking task he liked ("It's a chair / Is a chair / Its a chair / It a chair" — his "abbreviations") returns, properly contextualized — u01's `contractions` structure is its home. | ch01 dossier task battery |
| B21 | Collectibles are scattered GENEROUSLY — the trail's density itself paces story mode (independent of XP, which Decision ③ keeps English-only). | law §2.7 |
| C1–C4 | ch01 rebuild: field spread of drained classroom objects · simplicity ruling (no fist) · classmate cage + reawakening · **flying chalkboard boss with colored chalk** | dossier ch01 |
| C5 | The rebuild supersedes "world polish" for ch01; PK-R4 (set-piece masses) survives as engine work. | prod §5.1 (Decision 2) |
| D2–D15 | Per-unit seeds U2–U15 (zoo lion · pirate · faceless-face-restore · sax notes · detective-pending · mellow chef + frequency wheel + WB p62 scale · clothes-layer boss · garden catch + habitat sort · jumbled shop · wrong-speed time + clock widget + living clock · birthday house + was/were search · jumbled rescue story + jetpack ascent · cinema/genres + escape key · book-exit finale). | dossiers §4, one each |
| E1–E9 | XP service · objective screens · Overlay 2.0 · boss engines · modality engines · 15-classmate + avatar asset program · collectible skins · interludes · art-regeneration policy (rerun freely; distinct palettes). | specs §3 + prod §5 |
| F1 | Master-architect mode: Fable designs/briefs/reviews/plays; **Opus 5 executes all packets**; RALF loops. | prod §5.2 |
| F2 | Source of truth = live code + this dump + generated assets; docs 33/34/35 are point-in-time records. | §5.8 |
| F3 | Full-richness capture; independent blind coverage check before the PR opens. | §5.7 |
| F4 | Docs 37/38/39: today supersedes on conflict; anything they hold that today missed is surfaced, not dropped. | §5.8 |
| F5 | Curriculum grounding: wordbanks authoritative; MORE! 1 SB/WB PDFs + in-repo transcripts as task reference (WB p.62 for U7). | §5.8 (p.62 verified in-repo) |
| F6 | Rayman-study claims re-verified when a chapter leans on them; dossiers cite frames/dossiers directly. | §4 (citations inline) + §5.8 |

**Decisions (Koki, 2026-07-29):** ① G1 ending = AMBIGUOUS (§1.9) · ② queue = this doc first,
then PK-R4 · ③ **XP = English only** (doc 27 §5 law upheld; collectibles never grant XP) ·
④ timers only where the fiction demands speed (§2.9).

---

## §1 · CANON AMENDMENTS (the story bible, amended in place)

Doc 31 §1/§5/§6 remain the base text. The following clauses amend them. (No consolidated
story-canon file existed before this doc; §1 is now the anchor for G1 fiction. Doc 20's
"Jona"→OSWIN name sweep is queued as hygiene, §5.6.)

### 1.1 OSWIN's origin (amends doc 31 §6 "the concept")
OSWIN was a student with THIS book — and English never opened itself to him. He never
understood the words, the rules mocked him, and his frustration became physical: he **ripped
pages out, scribbled over exercises, crossed out what he couldn't say, cursed at the book,
threw it across the room**. He is not evil; he is wounded — the curse is frustration given
form. The book swallowed him, and the bewitchment **spread to the other copies of the same
book** (storybook logic; no mechanism needed). Years inside taught him magic and loneliness.
He **restored his own battered copy to mint condition as bait** — the plan was always to pull
the next class in. And the layer under the plan, which he does not consciously know: **he
wants someone to open the way out.** (The finale answers exactly this — §1.7.)
*Production note: the year's breadcrumbs — his handwritten notes (doc 31 §6) — now carry this
arc: mischief → loneliness → the almost-said wish. The ch14 keepsake cage (doc 31 §5) holds
his OLD copy of the book: torn pages, scribbles — the origin made visible one chapter before
the finale.*

### 1.2 Who falls in (amends doc 31 §1.1 + §5 "cage math")
The teacher opens das besondere Buch — the very copy OSWIN restored, brought by the player —
and the spell takes EVERYONE: the player (boy or girl, chosen at start), **fifteen
classmates**, and **the teacher**. The classmates are scattered one per chapter (§1.3). The
teacher is NOT seen all year — the class assumes she got away — and the finale reveals her:
**freeing the teacher is the last act before the book lets anyone go** (§1.7). She is never a
mentor during play; every chapter states its own objective (§2.6). Doc 31's filler
person-cages (the companion book-being, the mid-year teacher cage) retire; the keepsake cage
stays (§1.1).
*Provenance flag (veto window): in the dump Koki settled this mid-sentence — "let's have it
this way: 15 get trapped, and then the teacher gets trapped as well, and freeing the teacher
is like the final finale" — then called it "maybe like an idea." This doc promotes it to
canon on the strength of the "let's have it this way"; it is NOT one of the four recorded
decisions, so his PR read is the gate.*

### 1.3 The fifteen (amends doc 31 §5)
One classmate per chapter, each with a unique, recognizable painted design and a name under
the naming law. Slate (12 approved 2026-07-19) + 3 promoted spares, **pending Koki's
class-list check** for the three promotions (naming law requires it):

| ch | classmate | ch | classmate | ch | classmate |
|---|---|---|---|---|---|
| 01 | Merle | 06 | Tammo | 11 | Lenz |
| 02 | Fenn | 07 | Enna | 12 | Edda |
| 03 | Ilvy | 08 | Juno | 13 | Falk* |
| 04 | Piet | 09 | Quirin | 14 | Fritzi* |
| 05 | Veit | 10 | Smilla | 15 | Cleo* |

*\* = promoted from the banked spares; ch01–05 assignments are the already-frozen W2 cast.*
Freed classmates may reappear in later chapters' backgrounds and interludes; ch12 stages ALL
previously freed ones (dossier). Design bar: silhouette-distinct at 2.2-tile hero scale.

### 1.4 The alliance (re-fleshes "the camp", doc 31 §5)
There is no abstract camp. Freed classmates and consoled guardians gather **in the restored
grounds of the chapters they were freed in** — the world map shows them; interludes visit
them; late-year beats (doc 31's "appears once more late in the year") draw on them. "Alliance"
is the fiction word for: the game visibly remembers everyone you freed, where you freed them.

> **★ Amendment 2026-08-15 (ruling R49) — "gather" means PRESENT, never MOTIONLESS.**
> Koki, on Merle after her rescue: she „soll sich durchs Level bewegen". This does not
> overturn the law, it **restores** it: doc 40 §3 already says *"redemption changes STATE,
> never removes presence — the coded side plays the joy loop as a home-orbit, then settles
> the friend near its home cell"*, and doc 39 R3-5 asks that the freed being „visibly fly
> its Freudenrunde **and remain**". The narrowing happened downstream, in
> `STORY_SPINE_CH01.md` ("Niemand geht irgendwohin"), and it is corrected there.
> **The binding shape: a freed being owns a ROAM ZONE inside the room it was freed in.**
> It walks, hops, waves and idles within that zone; it never leaves the phase, never
> follows the player, and never despawns. What is bounded is the ROOM, not the feet.

### 1.5 The henchman law (sharpens doc 31 §6 "guardians are OSWIN's creations")
Each chapter's guardian is **a being of that unit that OSWIN bewitched FIRST and used as his
pawn** — the guardian did the unit's bewitching for him. The surface story: you defeat a boss.
The truth underneath: you free his unwitting henchman — which is why every guardian, consoled,
joins the alliance, and why the finale can assemble all fifteen on your side. The consolation
reaction is unit-true, not uniform (§2.2).

### 1.6 The magic in the air (new; grounds doc 31 §2/§3 in fiction)
The book's bewitchment cuts both ways: the same loose magic that lets OSWIN twist beings lets
the class **take the book's own shape** — limbless storybook mascots with floating hands —
and grants the year's verbs (fist, hover, swing … the ability arc). Powers are the book
answering kindness (the favor powers stay earned, doc 31 §4). **Tinten-Geister** — small,
harmless ink-spirit wisps — drift through levels as ambience (doc 40 AMBIENT/WATCHER class,
child-friendly, never hazards).

### 1.7 The escape key and the finale ritual (new; binds U14→U15; confirms doc 27 §3 ch15)
In ch14's restored fiction shelf the class finds **a story about children trapped in a book —
and how they were let out**: the book releases those who can tell it, truly, what they are
going to do outside. Ch15 stages exactly this (and doc 27's ch15 inversion duel already IS
this shape — convergence, not coincidence): the going-to windows are the telling, the last
window frees the teacher, and the book opens. The finale duel cannot be lost (doc 31 §3).

### 1.8 The teacher (new)
Frau Wunderlich (name still proposed, doc 31 §5) is the finale's hidden cage. Reveal beat:
the class realizes no one ever checked on her. Freeing her is the emotional summit placed
JUST before the exit — the class leaves complete, no one left behind (including OSWIN, §1.9).

### 1.9 The ending — AMBIGUOUS (Decision 1, Koki 2026-07-29; amends doc 31 §1.5/§6 finale)
OSWIN walks out WITH the class, un-aged, blinking in real light. **The game does not declare
him redeemed and does not declare him unredeemed.** The unmask keeps doc 31's smallness ("will
anyone stay for me?" — answered by the class having freed everyone), but the epilogue's last
shot holds on his face a beat too long, unreadable. Doc 31's "frees AND forgives" softens to
"frees — and leaves the forgiving unfinished." Both G2 stories (doc 20's redeemed
deuteragonist + the Blank · Koki's surface-villain whodunit) remain fully constructible; the
choice moves to the G2 design gate. Doc 20 is NOT rewritten this round.

### 1.10 What the child may call him — »der Tinten-Schatten« (new; sharpens doc 31 §6 "the cloak"; ratifies Koki's Session-C1 gate answer, 2026-08-11)
A threat with no designation cannot be written about, and doc 45's C4 caught the copy solving
that the forbidden way — the mission card said „OSWINs Tinte". So every chapter before the
unmask uses exactly one designation, and it is **»der Tinten-Schatten«: a description of his
ink, never a proper name.** He is only what the pages show of him — the colour taken out of the
schoolhouse, the pages torn from the book, the ink that stayed behind — and no line claims more:
no face, no motive, no history, and above all no name. Do not confuse him with the
**Tinten-Geister** of §1.6: those are harmless ambient wisps the child walks past, and they are
not his agents. Nor is he embodied in ch01 — the year's cloaked ink silhouette (doc 45 §C4) is a
later beat; **ch01 carries only the first anonymous note (§4), and that absence is the
characterization.** This is a machine law, not an intention: `cloakErrorsDe`
(`packages/content-schema/src/game-tasks.ts`) is enforced twice over, by the engine's
`chapter-copy` law and again by `scripts/check-paint-copy.mjs`, so a slipped name fails a gate
rather than reaching a child.
*Production note: the designation is load-bearing in exactly two places today — the mission card
(`ch01.level.json` `goalDe`: the title names the loss, the line names the cause) and the balance
screen's rule-page legend — and it is the ONE name every chapter up to ch15 may use for him.
§1.1's origin becomes readable only at the unmask, when the two words are finally allowed to meet.*

### 1.11 Checkpoints are SILENT ANCHORS (new, 2026-08-15; rulings R44 · R83 — supersedes the checkpoint-as-character casting in `docs/design/g1/paint/README.md` and in every chapter sheet)
A checkpoint banks your progress and says nothing about it. **As built (ch01, wave 4):** the
chapter declares `checkpointStyle: "silent"` in its level file, and that one word removes the
whole ceremony — no Krakel appearing, no easel, no sketch pinned up, no toast. What stays is
everything the mechanic actually needs: the **`C` glyph** in the grid, the **warp target** the
child returns to, and the four machine laws that police placement (`checkpoint-count`,
`checkpoint-placement`, `checkpoint-footing`, `checkpoint-walk` in `packages/game-paint/src/level.ts`),
including the ANTI-3/6-v2 rule that an anchor stands AFTER the difficulty it pays for, not
before it. The painted sheets `krakel_a` and `krakel_active` are **not** dead art — they are the
`C` glyph's own artwork (`artManifest.ts`), and they keep drawing; only the unused third sheet
goes with the art round.

Why the ceremony went: it interrupted the run to congratulate the child for surviving a jump,
and it made a named character out of a save point — so the character owed the chapter a story
it never had. The anchor is stronger mute.

**Two things this does NOT decide.** (1) **Placement.** Where the anchors sit is explicitly
open: moving them is a conversation with Koki, not a follow-up commit. (2) **The other
fourteen chapters.** The law above is chapter-wide by design — every chapter sheet that still
casts KRAKEL as the checkpoint artist is describing a chapter nobody has built yet, and it is
being corrected to say so; but any chapter may re-open the ceremony deliberately by declaring
`checkpointStyle: "krakel"`, which is why the option survives in the schema instead of being
deleted. A chapter that wants the ceremony back must say so in its level file, out loud.

---

## §2 · LAW AMENDMENTS

### 2.1 THE VARIETY LAW (new, headline; extends doc 30 §1 unit-magic + doc 41 §1)
No chapter repeats the previous chapter's formula. Each chapter commits to **one field
modality** (its way of moving/playing), **one palette/light identity** (§2.4), and **one
bespoke boss mechanic** (§2.8). The modality inventory this round designs from — each entry
citing its evidence:

| Modality | Source of truth |
|---|---|
| Classic momentum platforming | doc 31 §3 feel contract (live) |
| Vertical enclosure/rigging climbs (hang, ring-swing) | doc 31 §4 arc · study `level-anatomy.md` |
| Slippery/momentum surfaces | physics capture `15-slippy-slope-momentum` · audit M3/M5 · level-anatomy L364 (the slippery staves) |
| Hover gauntlets (updrafts, descent shafts) | capture `08/09` · level-anatomy L259, L302 |
| Rising-hazard ascent / escape run | level-anatomy L288 (`EauMonte` — climb beats the flood), L184–186 |
| Ride / autoscroll set-piece | capture `20-fly-mosquito-mount` · Mr-Sax dossier §6 (saucer scroller) |
| Shrink/grow passages | capture `19-tiny-rayman` · audit G14 |
| Catch-chase (the collectibles run away) | Keen `thief`/`hopper` brains (`arcade.ts`) — inverted |
| Wrong-speed world (slow/fast zones) | NEW engine (ch11) |
| Room-search house (door-linked rooms) | NEW assembly of existing door/plate plumbing (ch12) |
| Sorting/assignment finales (categories, habitats, prices) | `group-sort`/`match` machines (corpus formats) + NEW sort UI |
| Mellow conversational boss (zero action) | NEW pacing class (ch07) — the Variety Law's proof |
| Channel-/set-hopping arena | NEW (ch14) |
| Page-terrain escape (the book itself) | NEW (ch15) |

Enemy dynamics (walkers → hoppers → flyers → chasers → swarms, doc 40 rig) unlock
progressively across the year; a chapter introduces at most 1–2 new dynamics (doc 41 §1's
debut discipline extends from task kinds to movement).

### 2.2 Freeing supersedes naming (amends doc 31 §1.3 wording)
The universal mechanic is **FREEING a bewitched being by solving the task it asks** — naming
is one task form among many (colour-giving, command-choosing, sorting, time-setting…). The
fist still never redeems; it shoos, and the being visibly reacts. The signature beat
flexibilizes: **the defeated guardian's reaction is unit-true** — the Tafel slumps exhausted,
the Panik simply goes quiet, the mask-spinner finds its face — crying is one option, not the
rule. The console beat and the joining stay mandatory (doc 40's `joy` family unchanged).

### 2.3 The cage law (amends doc 31 §1.4/§5; rewrites `level.ts` "six-cages")
**Exactly ONE cage per chapter is a person-cage — the classmate's — on-path and findable by
everyone.** The unit's other bewitched beings are freed in whatever form the unit's fiction
asks (bound, drained, tangled, frozen — cages allowed but not required). The engine law
changes from "exactly 6 cages" to: **≥1 cage; exactly one `captive:"classmate"`; every
declared freeable reachable; every HUD denominator counted from the world** (the R3b
letter-honesty pattern, already live for the HUD). This resolves the /6-vs-7 drift: the law
counted phases only while the world held an arena cage — under the new law the world's count
IS the truth wherever it includes the arena. Ch01's 7 cages restage per its dossier.

### 2.4 Palette variation inside STYLE_PAINT_V1 (amends doc 31 §2 register note)
The register (gouache storybook, limbless mascots, three-value depth, RS-2 sizes) is
untouched. What changes: **the book-world key varies per chapter** — worn-paper cream is the
BINDING, not the weather. Chapters commit to distinct light identities (§4 table): dusk
harbor, rain-grey week, candle-warm house, aurora void… Two adjacent chapters may not share a
dominant hue family (machine-checkable from palette cards; §5.5). The uniform look of the
current ch01–05 sheets is a defect this round fixes; per-unit palette cards stay CP-14
(book-verified before art generation).

### 2.5 The fresh-eyes nuance (sharpens doc 31 §1.6 + doc 42's mining law)
Mechanics, timings, and UX structures from the parked builds ARE adoptable **when they
re-earn their place in the new direction** (doc 42 already governs how: dated ledger lines).
ART never transfers — every visual is re-commissioned in STYLE_PAINT_V1. The July-29 replay
adds to doc 42's mine: the in-card portrait, the v0 spark→zoom→ink-iris entry, the
letter-fly resolution, the two-step colorroom staging, the reawakening duel — all mined as
STRUCTURE in §3, re-skinned painted.
*Named reconciliation (veto window): the dump contains both "we can also copy the assets
here from the Keen level build" (the classroom objects) AND, earlier, "we may consult the
reference material, but we don't copy the templates, **especially graphically**." This doc
resolves the tension toward the second statement — the Keen `cr_*`/`gs_*` assets are pixel
art and would break STYLE_PAINT_V1, so their DESIGNS (which object, which pose, which
two-step) transfer and their pixels are re-commissioned painted. If Koki meant literal
reuse as placeholders until fresh art lands, that is workable and he should say so at the
gate.*

### 2.6 The objective-screen law (promotes doc 42 §3's GOAL CARD to law)
Every chapter opens with the objective screen over the frozen fading-in world: **Dein Auftrag**
→ the chapter's painted title plate → what is bewitched and what freeing looks like (one
sentence, unit-true) → the collectible legend (this unit's skin, §2.7) → „Los geht's!". Always
skippable-fast, never skippable-silently. Per-chapter content is authored in the chapter
packet; the frame is one engine component (§3.4).

### 2.7 The collectible-skin law (extends doc 30 "no collectible without a reason")
The counting laws (letter-honesty, magnet, HUD chip `{collectNounDe}`) are engine-level and
unchanged; **the SKIN and noun are per-unit and must be motivated by the unit**. Assignments
in §4 (ch01 Buchstaben · ch03 Goldmünzen · ch04 Gefühls-Gesichter · ch05 Noten · ch07
Zutaten · ch12 Kerzen · ch14 Tickets …). Regel-Seiten and ~~Bonus-Bücher~~ stay global (they are
the book's own objects, present in every chapter).

> **★ Amendment 2026-08-15 (Koki, ruling R53) — ch01 gains a SECOND collectible class, and
> the Bonus-Bücher leave it.** ch01 now carries, **in addition to the Buchstaben**, the
> **nine uniform collectibles of Unit 1** (WB p. 12 „Cool clothes"): hairband · sunglasses ·
> hat · school tie · shirt · sweater · skirt · socks · shoe. They take the place the
> Bonus-Bücher held, which are **out of ch01** (doc 45 D8 is thereby decided). So
> „Bonus-Bücher stay global" no longer holds for ch01; Regel-Seiten still do.
>
> **The demarcation against ch08 „Das Kleiderzimmer", and the collision it has to survive.**
> The rule is *no word is INTRODUCED twice*, and the corpus itself already breaks a naive
> reading of it: **`sweater` and `shoe`/`shoes` sit in BOTH wordbanks** (`g1u01.w.sweater`
> and `g1u08.w.sweater`; `g1u01.w.shoe` and `g1u08.w.shoes`) — measured against
> `content/corpus/units/g1-u01/wordbank.json` and `…/g1-u08/wordbank.json` on 2026-08-15,
> not asserted. **Therefore the law reads: u01 INTRODUCES, u08 REUSES and EXTENDS.** ch01
> teaches the nine as new vocabulary; ch08 keeps its own U8 mechanic (clothes as world
> objects, Knöpfe as collectible, do/does woven through) and introduces only what u08 adds
> — `jacket`, `trousers` — treating the overlap as revision, never as first contact. G3
> delivers the full wording in `UNIFORM_SAMMELN_DESIGN.md` §0; until it lands, this
> paragraph is the binding text.

**The density clause (B21):** collectibles are scattered GENEROUSLY along the intended line
of play — the trail's density is a deliberate pacing signal for story mode (Koki: "quite
generously across the level… to indicate the pace"). This is a level-authoring law,
independent of XP (Decision ③): a dense trail rewards momentum with pickups and score,
never with grind.

### 2.8 The boss law (extends doc 41 §4 boss-evidence)
Every guardian is bespoke: its movement/attack grammar is designed against the ability arc
and cited sources (§4 dossiers), its tasks are **the culmination of the chapter's task
battery** re-staged under pressure, and its evidence renders ON the guardian before any card
opens (boss-evidence law unchanged). Guardians are OSWIN's henchmen (§1.5); their defeat
reaction is unit-true (§2.2). Shared engine primitives in §3.2 — a boss is data + primitives,
never a bespoke scene class.

### 2.9 The timer policy (Decision 4; settles the quickfire question)
The chalk clock survives **only where urgency is the fiction**: quickfire/swarm cards, boss
attack windows, chase beats. Calm classes (restore, rescue, door, ceremony, story) are
untimed. Timeout costs a collectible (the being escapes with it — Keen economy, already the
paint law), never a heart, never progress. Reduced-motion continues to suppress the clock;
under it, timed cards fall back to untimed (existing behavior, now law).

### 2.10 The XP law (Decision 3; upholds doc 27 §5 layer 3, builds layer 4)
**"XP measures English, never play" stands.** Only graded task attempts grant XP (server-side
derivation from `practice_attempts` unchanged). Collectibles never grant XP — they keep their
own loops: letters → the chapter score; Glühwörter → Hinweis-Funken; Bonus-Bücher → score
page. What gets BUILT this round is doc 27's layer 4 (§3.5): the visible level ladder with
funny names, the next-reward HUD line, and unlockables — **first perk class: avatars**
(Koki's ruling; delta vs the v1 doctrine "avatars are free-choice" is intentional and his).

---

## §3 · SYSTEM SPECS (engine work this round)

### 3.1 BATTLE OVERLAY 2.0 (packet PK-R5)
The R3a card system (`cards/machines.ts`, `CardHost`, `CardShell`, speaker law, painted
overlay CSS) is the base — this closes the gaps against the Keen/v0 evidence:

1. **Entry choreography** (per encounter, ~1.1 s total, all timings verbatim from the mined
   builds): contact spark burst at the touch point (22 particles, v0 `tryEncounter`) → scene
   freeze + camera zoom toward the encounter (1.18×/160 ms, Keen `contact()`) → **ink-iris
   blob wipe** (two `border-radius` blobs, 700 ms, pure CSS — v0 `dg-bs-swirl`) → card lands
   260 ms delayed. **Per-unit transition themes** are palette/particle re-skins of the SAME
   choreography (ink default; Noten-swirl ch05, Glitzer ch03, Zeit-ripple ch11…), 100 %
   coded, zero image assets (B14).
   **The coded creature clause (B14 sharpened — Koki's v0 ask, verbatim honored):** where a
   card class has no painted portrait, or where the fiction wants a living presence, the
   overlay may carry a **fully code-drawn animated creature** in the v0 Schluckwort manner
   (seeded SVG/canvas blobs with eyes — zero image assets), **themed per chapter and related
   to that chapter's boss** (ink wisps ch01, a stray note-sprite ch05, a gear-mite ch11…);
   it reacts to wrong answers (absorb wobble) and VANISHES on solve (pop + dot-flight).
   Portrait and coded creature are the two legitimate card presences; a bare text card is
   neither.
2. **The dim:** radial veil to near-black, world faintly visible (exists as `.dg-qf-veil`
   descendant in `PAINT_OVERLAY_CSS` — keep).
3. **The countdown** where §2.9 allows: the chalk-circle clock (exists) unified with the
   collapsing-bar telegraphy; duration by tier (E6/M5/S4 platform law, locked by test).
4. **The action line + fiction line:** already the authored `storyDe` grammar (giveaway +
   grounding linted). New: the dramatic present-tense headline slot ("Er verknotet sich —
   jetzt!" register) for boss/chase cards.
5. **THE PORTRAIT (the big gap):** `CardShell` renders the asker's art INSIDE the card
   (88–130 px, painted frame) with graceful fallback to the current text placeholder when no
   stem exists. Stimulus schema gains `art` stem binding; `check-game-tasks` gains a layer:
   a card whose asker has a commissioned portrait must declare it (no silent text fallbacks
   where art exists).
6. **Input:** typed + verb-button (Konter!/Befreien!/Benennen! — authored per card), MC
   pills, wheel (with **auto-lock on release** — doc 42 §2, still un-mined), the hint ladder
   (Tipp n/m), "Später" defer where the speaker law allows.
7. **Resolution:** correct → the answer **letter-flies in** ("Zurückgeholt!" grammar: per-char
   55 ms stagger, v0 `dg-bs-letter-fly`) → the being's freeing plays IN THE WORLD (colour
   flood / texture swap / joy loop — restore-hold: celebration waits until the world visibly
   finishes changing, doc 42 §3) → XP chip. Wrong → scaffold-down (typed→chips, Keen law) or
   re-init per machine; timeout → the being escapes with a collectible.
8. **The reduced-motion end-states law** (v0): every animation's base style is the finished
   state — a motionless battle is complete, never stuck. Binding for all overlay CSS.
9. **Typography (B19):** every card renders in the three-face system Koki liked in the
   legacy modals — Fredoka (display) · Inter (body) · Quicksand (labels), doc 42 §5; faces
   are already app-loaded. Overlay headlines 20–44 px weight 800; Phaser text at
   `setResolution(2)`.

### 3.2 Boss engine primitives (PK-R5/R6, consumed by every dossier)
A guardian = **script data + shared primitives**, per doc 27 §6.1's two-file shape
(`level.json` + `boss.json`): the lane/telegraph FSM (Keen `boss.ts`: telegraph ≥500 ms →
attack → dodge opens counter-window; wrong scaffolds down, same task returns) · **projectile
brains** (the Keen `cloud` pattern: drift → telegraph 650 ms → bolt; generalized to thrown
chalk, blown notes, gusts) · **returnable-vs-dodge-only projectile classes** (Mr-Sax dossier
§2 — teaching discrimination under pressure) · phase scripts (arena → set-piece shift, e.g.
scroller) · the inversion mode (hearts can't drop; windows erase defenses — ch15, exists in
Keen `boss.ts`). Guardians ride the doc 40 GUARDIAN rig grammar (≥8 states incl. `joy`+`rest`).

### 3.3 The reawakening sequence (PK-R6 pattern-setter, then per chapter)
The freed classmate stands ghost-pale (desaturation grammar, no new tech) and **acts out the
unit's wrong-actions round by round — the pose IS the prompt** (Keen duel structure, 6
rounds, ~~`Runde n/6`~~ **„Frage n von 6"** — amended 2026-08-15, ruling R56): the player
picks the command/phrase that stops or guides THAT action.
Ch01 authors the rounds fresh from u01 imperatives (mix of stop-thats and positive commands —
the Keen rounds were all negative; ours follow the corpus). Correct → the classmate regains
one degree of motion/colour; final round → full colour, joy loop, the cage opens. Per-chapter
variants re-skin the same machine (ch12 uses was/were questions instead of imperatives).
**Amendment 2026-08-15 (R49):** and then she STAYS — present and in motion. The freed
classmate roams her zone inside that room (walk, hop, wave, idle); she does not stand still
at the cage, does not follow the player, and never leaves the phase. See §1.4.
**Amendment 2026-08-15 (R56) — the round counter says „Frage n von 6".** As built:
`ROUND_LABEL_DE` / `ROUND_OF_DE` in `packages/game-paint/src/cards/CardShell.tsx`. Koki's
reason, and it is a content reason, not a wording preference: a *Runde* is something you
survive, a *Frage* is something you answer — and the sequence asks six questions. Every
chapter that re-skins this machine inherits the German label; the English design term
"round" stays in this document, where no child reads it.

### 3.4 Objective screens (PK-R5)
One engine component (the GOAL CARD frame over `startFrozen` + 240 ms fade-in, doc 42 §3) +
per-chapter painted title plate and objective copy (authored in chapter packets, grounding-
linted). Re-used as the score-page presenter's opening bookend (M-B beats unchanged).

### 3.5 XP layer 4 (PK-R7; Decision 3 shape)
- **Levels service:** thresholds seeded from the v1 curve (`design-study-og-trainers.md` §3a),
  re-scaled to v2's per-attempt XP reality (measure a week of live `practice_attempts` first —
  the curve is calibrated, not copied). `levelFor(xp)`, `nextThreshold(xp)` in
  `packages/engine`; server-derived; no schema change for XP itself.
- **The ladder:** German, funny, school-book-flavored level names (the v1 1st-grade ladder
  Wordling→Grandmaster is the shape precedent; ours are authored fresh under the register
  law, Koki gates the list in the PR).
- **The next-reward doctrine** (doc 27 layer 4, Keen-mined): the HUD/home always shows the
  next unlock threshold.
- **Unlockables registry + avatars:** a data registry (`unlockables.json`: id, kind, threshold,
  art stem) · **avatar batch commissioned in painted style** (50-piece precedent from v1;
  batch size set in the packet) · avatar picker on the profile/home surface · `avatarKey` on
  `user_progress` (one migration). Avatars unlock by level (Koki's ruling); the free-choice
  starter set stays small so day-one students aren't locked out of identity.
- Explicitly NOT in scope: badges, purchasable anything, XP from play (§2.10).

### 3.6 Interludes (PK-R8 + per chapter)
The plate player (doc 42 §3, `cutscene.tsx` pattern) + `story.json` scenes stage each
chapter's prologue/epilogue: opening beat at the chapter door (why this ground, who's
missing), closing beat after the score page (the freed classmate's line, OSWIN's note —
§1.1's breadcrumb arc). Authored per chapter from the EXISTING `g1.st.lost-pages/story.json`
scenes wherever they hold up (F2: reconcile, don't duplicate); the full prologue (ch00)
redo happens LAST (A12), when everything it must foreshadow exists.

### 3.7 Modality engines (built with their first consumer chapter, never speculatively)
Wrong-speed zones (ch11) · draggable analog clock instrument, mouse+touch (ch11) · room-graph
house navigation (ch12) · story-reorder card skin (ch13; `order` machine exists — this is a
skin + length class) · category/habitat sort surface (ch07/ch09/ch10; `group-sort` format
exists in corpus — game skin new) · catch-chase brains (ch09; invert Keen `thief`) ·
rising-hazard ascent + escape-run scroller (ch13/ch15) · channel-zap arena (ch14).

---

## §4 · THE FIFTEEN DOSSIERS

Format per chapter: **Setting & light · Field modality · Freeables & collectible skin · Task
battery** (corpus-cited) **· The guardian** — existing pointers (design sheet + doc 27 table)
vs Koki's seed vs options, with **REC** and why **· Ability/debut · Classmate · Interlude
beat · Engine/asset needs**. Boss names are working names under the naming law (book-words for
book-beings); final names fix at each chapter's packet gate. Doc 27's table cells and the
ch01–06 sheets are honored as pointers; where a dossier overrides them, it says so.

---

### ch01 · Vor dem Schulhaus — U1 "Time for school" *(THE REBUILD — packet PK-R6)*
- **Setting & light:** the painted schoolhouse and its yard, warm green + paper-cream (the
  one chapter that keeps the classic key — it's the baseline the others vary FROM).
- **Field modality:** classic tutorial platforming, deliberately bare (C2): walk, jump,
  nothing else. Jumping and avoiding IS the chapter.
- **Field restage (C1):** the drained classroom objects (desk, school bag, door, board,
  window, chair — the Keen `restoreRoom` six, re-cast painted) are **scattered across all
  three phases**, not one room: each stands grey in the world with an ↑ cue; the two-step
  `restore` (name → colour) frees it and the world keeps the colour (shipped R3b machine —
  restaged, not rebuilt). Letter collectibles with magnet (live) + **number quickfires on the
  wheel** (swirling numbers, auto-lock — the Keen swarm re-staged as u01's numbers 1–25).
- **Freeables & skin:** collectible = **Buchstaben** (canon) **+ die neun Uniform-Objekte der
  Unit 1** (R53, §2.7 amendment). Regel-Seiten ~~3~~ **5** (u01 topics — R51: Kurzformen ·
  Befehle · Fragen/Begrüßen · Zahlen · Plural). **Bonusbücher: 0** (R53 — sie sind aus ch01
  heraus; die Uniform-Objekte nehmen ihren Platz ein).
- **Task battery:** restore ×objects (u01 things + colours) · wheel numbers · choice/oddone
  school things · door-series imperatives (M-E coverage) · reawakening rounds (below) ·
  **the contraction-picker Koki liked (B20)** — "It's a chair / Is a chair / Its a chair /
  It a chair"-class cards, now properly contextualized (a bewitched being points at a real
  restored object and asks; u01's `contractions` structure is the grammar authority).
- **The guardian — DIE FLIEGENDE TAFEL (C4, rebuild).** Doc 41's grounded "erwachte
  Schultafel" and the Keen serpent both retire as mechanics; the board now **flies**. Attack
  grammar: she hovers above the arena tracing **readable paths — spirals, figure-eights,
  zigzags** (lane FSM generalized to path lanes; telegraph: she dips and rears, ≥500 ms) and
  **throws colored chalk** that arcs down and shatters (cloud-bolt brain with arced velocity;
  chalk shards linger 1 s as floor hazards). A chalk hit = knockback + a boss-window task
  (never damage-death); dodging N throws opens the counter-window where she **writes her lie
  ON the board** (boss-evidence law: the four scribbled words render on her face) — the card
  asks about what she wrote (name/colour/number/imperative culmination). ~~Three knots of 5
  windows E/M/S-tiered.~~ **Three SCRIBBLE LAYERS of 5 windows E/M/S-tiered — the child
  WIPES each one off ("Clean the board!").** Consolation: she sinks to the ground,
  exhausted — the class **writes the first lesson back on her** (typed HELLO — the existing
  finale beat lands here).

  > **★ Amendment 2026-08-15 (Koki's replay of 15.08. — ruling R50).** The board is not
  > *tangled*, she is **scribbled all over**, and what the child does is **clean her**.
  > Koki, verbatim: „vollgekritzelt, nicht gewaschen; man muss sie sauber machen — Clean
  > the blackboard!" **Nothing about the mechanic changes** — paths, chalk throws, the
  > E/M/S window tiers, the sinking, the typed HELLO all stand exactly as written above;
  > only the fiction of the three stages moves from *untying knots* to *wiping off scribble
  > layers*. Internal symbols (`params.knots`, `KNOT_*`) keep their names — they are code,
  > not player-facing lines. This also closes doc 45 **F1** („Why do we have knots? What is
  > the idea again?"): wiping a board needs no explanation. ⚠ Note for anyone citing the
  > source: doc 45 F1 points at „doc 44 §3.2/§4", but **§3.2 contains no knot at all** —
  > the mechanic was specified in this one sentence and nowhere else.

  > **★ Amendment 2026-08-15 (rulings R88 · R99 · R100 — as built by H2, wave 4).** Three
  > details of the wipe are now decided and shipped, and they are written here so the next
  > chapter's guardian inherits them rather than re-litigating them.
  > * **The wipe fires on CONTACT, not on ↑.** The child walks into the scribble layer and
  >   it comes off. Reason: the wipe is a physical act in the fiction, and a key-press for
  >   it would make the one moment of the fight that is not a question feel like a question.
  > * **A child who stands still loses the CARD, not the game** (R99, Koki's gate answer).
  >   If it never goes to the board, the boss-window closes and that card is gone; the
  >   fight continues. The chapter takes something away, it never ends the run — the same
  >   rule the rest of ch01 follows.
  > * **The beat-1 plate stays** (R100) — the small picture of the board over the very
  >   first card. H2 measured the alternative (removing it changed no critic's verdict), so
  >   it stays on the cheaper side of the trade: it tells the child WHO is asking before the
  >   first question lands.

- **Reawakening (C3):** *(after the six rounds she STAYS — present and roaming inside p2, never
  motionless at the cage and never leaving the phase; §1.4/§3.3 amendments of 2026-08-15, R49)*
  Merle's cage is the on-path person-cage; freed → ghost-pale Merle
  plays out 6 wrong-actions (fresh-authored from u01: sings mid-lesson, won't sit down,
  scribbles on the desk, tears the window open, books on the floor, walks out mid-class);
  correct commands (mix: "Don't sing!" / "Sit down!" / "Close the window!" / "Take out your
  books!") restore her motion round by round (§3.3).
- **Ability:** none granted (arc amendment: the fist moves to ch02 — §4 ch02; doc 31 §4's
  ch01-mid fist grant is superseded).
- **Interlude:** opening — the fall into the book, alone; closing — Merle freed, the first
  OSWIN note (mischievous register).
- **Engine/assets:** flying-guardian path lanes + arced projectiles (§3.2) · chalk shard
  hazard · fresh Tafel sheet (GUARDIAN rig, ≥8 states incl. flight cells) · chalk projectile
  cells (colors) · Merle reawakening poses (WALKER-class cells) · restaged `ch01.level.json`
  + tasks + proof tape re-record. Cage-law rewrite in `level.ts` (§2.3) ships here.

### ch02 · Der Zoo im Buch — U2 "At the zoo"
- **Setting & light:** lush zoo daylight — saturated greens/golds, first big sky.
- **Field modality:** enclosure verticality — climbing in and out of habitats (ledge-hang
  stress-test per doc 31 arc) + **placement play**: there-is/are + prepositions staged as
  putting escaped beings back ("The parrot is ON the tree — where does it GO?" match/choice
  against the visible enclosure).
- **Freeables & skin:** drained animals (restore two-step reused as animal-ID, doc 41 map) ·
  collectible = **bunte Federn** (feathers shed by the panicked birds — countable, magnet-
  friendly, unit-true).
- **Task battery:** restore animal-ID · match (debut, doc 41) preposition placement ·
  there-is/are choice · quickfire swarm counts (plurals).
- **The guardian.** Pointers: sheet "das erwachte Drehkreuz" (turnstile) · doc 27 "Käfig-
  Klecks" (cage of wrong animals) · **Koki's seed: a bewitched animal — the lion, king of
  the zoo.** Options: (a) turnstile (mechanical, weak fiction tie to animals), (b) cage-
  creature, (c) **REC — DER KÄFIG-KÖNIG: the lion, first-bewitched (henchman law), armored
  in the zoo's stolen cage-bars**; each answered there-is/are window ("WHERE does this animal
  live?") unclamps one bar-plate and sends one animal home; bare, he is just a proud lonely
  lion — console, join. Why: merges Koki's seed with doc 27's cage fiction AND makes the
  unit's grammar (there-is/are + prepositions) the weapon. The turnstile demotes to a
  mid-level gate creature.
- **Ability:** **thrown fist granted here** (arc amendment — needed for shooing + the deflect
  stress-test moves to this guardian); ledge-hang at the chapter door (doc 31 unchanged).
- **Classmate:** Fenn. **Interlude:** the class realizes the chapters are units — the book's
  shape becomes visible.
- **Engine/assets:** batch-AG art is GENERATED (34+82 in the lab, unpulled) — **pull for
  reference, wire only what survives this dossier** (§5.5); lion guardian sheet is new.

### ch03 · Das Piratenschiff — U3 "Pirates"
- **Setting & light:** harbor dusk — lantern gold on deep sea-blue; the first dark-ish level.
- **Field modality:** rigging runs — **ring-swing chains** (arc: rings ch03) + mast
  verticality; deck momentum below.
- **Freeables & skin:** the crew's taken things; collectible = **Goldmünzen** (Koki's seed).
- **Task battery:** have-got/has-got (the crew inventory: "The captain has got a hook — and
  YOU?") · irregular plurals 2 (feet/teeth — pirates oblige) · body-part naming via restore ·
  order (debut, doc 41: pirate sequences).
- **The guardian.** Pointers: sheet "die Galionsfigur" · doc 27 "Sturm ohne X" kraken ·
  Koki's seed: "a pirate." **REC — DIE GALIONSFIGUR** (the ship's figurehead — she IS the
  ship's pirate-being, satisfying Koki's seed inside the sheet's canon): she swings across
  the bow on her own rigging (ring-arcs telegraph her path — the player's new verb mirrored),
  slams the deck (dodge), counter-windows ask have-got against her VISIBLE inventory
  (boss-evidence: what she's got hangs on her). Consoled, she returns the figures she took.
  Why: keeps the authored sheet + AH packet viable, embodies the unit grammar, and her arc
  mirrors the chapter's new movement verb — the Variety Law's "boss = the level's culmination".
- **Ability:** ring-swing (door grant, unchanged). **Classmate:** Ilvy.
- **Interlude:** first OSWIN note with a lonely undertone (arc §1.1).
- **Engine/assets:** AH packet exists (prompt-ready, ungenerated) — regenerate only after
  this dossier's palette card verifies (CP-14).

### ch04 · Die graue Woche — U4 "Emotions"
- **Setting & light:** the rain-grey week — near-monochrome world where restored feelings
  bloom LOCAL color (the colour mechanic's showcase chapter; palette contrast is the point).
- **Field modality:** weather verticality — updrafts + **quill-rotor hover debut** (arc
  unchanged); wind-drift platforming.
- **Freeables & skin:** collectible = **Gefühls-Gesichter** — small painted feeling-faces
  (Koki's "emojis," translated into the book-world so the style register holds; the emoji
  reading stays legible to kids).
- **Task battery:** slider (debut: feeling intensity) · to-be negative/questions ("Is he
  sad? — No, he isn't") · days-of-week wheel · memory (the grey week remembers, doc 41).
- **The guardian.** Pointers: sheet "der zerrissene Kalender" · doc 27 "Gefühls-Wirbler"
  (mask-spinner) · **Koki's seed: a faceless, emotionless entity whose face restores as you
  solve.** **REC — DER GESICHTSLOSE (the mask-spinner merged with Koki's seed):** a tall
  blank-faced being juggling masks of wrong feelings (mask color telegraphs the attack —
  doc 27's tell); each solved window ("How is he? He ISN'T angry — he's…") knocks a wrong
  mask away and **paints one true feature back onto the blank face** — eyes, brows, mouth —
  until a whole face smiles (Koki's progressive restore, verbatim). The torn calendar
  becomes the arena's evidence surface (the week's days rendered on it, boss-evidence law).
  Why: Koki's image is the strongest single boss beat in the dump, and it needs no new
  engine — it's staged desaturation + evidence rendering.
  *Reassignment note (veto window): in the dump this seed was spoken as "unit five" — in the
  same breath that made Mr. Sax the u05 boss. Unit 4 IS "Emotions" (and his emoji-collectible
  idea targets it too), so the faceless entity is staged HERE. If he truly meant u05, say so
  at the gate and ch04/ch05 swap seeds.*
- **Ability:** hover (door). **Classmate:** Piet.
- **Interlude:** the class notices OSWIN's notes are getting sadder.
- **Engine/assets:** AI packet regenerates post-dossier; face-restore = guardian rig states,
  no new engine.

### ch05 · Das Konzert der Seiten — U5 "This is our band"
- **Setting & light:** stage glow — velvet dark + spotlight warmth (Band Land homage).
- **Field modality:** **slippery staves** — momentum surfaces (capture 15, audit M3/M5:
  slippery modifies ground accel only); rhythm-timed platforms.
- **Freeables & skin:** silenced instruments; collectible = **Noten** (Koki's seed).
- **Task battery:** can/can't ("The drummer can't play — what CAN he do?") · possessives
  (whose instrument?) · mistake (fix the song sheet, doc 41) · movement verbs.
- **The guardian.** Pointers: sheet "das wilde Schlagzeug" (favor power I) · doc 27
  "Ton-Schlucker" (bass-blob that ate the song) · **Koki's seed: a Mr-Sax-style boss that
  spits notes to dodge.** **REC — DER TON-SCHLUCKER, staged on the Mr-Sax pattern** (dossier
  06-mr-sax, cited): he blows **note-projectiles — some returnable, some false notes
  (dodge-only)** — the fist punches true notes back (discrimination under pressure, §3.2;
  the card asks can/can't: "Can you send THIS one back?"); rhythm telegraphs (thump before
  lunge, doc 27). Phase 2, short: the runaway Schlagzeug drums a **chase beat** across the
  staves (Rayman law: chase drains before the arena — order inverted here to arena→chase-out
  so favor power I lands as the sheet wrote it). Ends, per the studied world's precedent, **in
  a shared dance** — the consolation beat the redemption law was made for. Why: Koki's seed
  and the study agree this is the template fight; the sheet's Schlagzeug survives as phase 2.
- **Ability:** favor power I „der Taktsprung" (consoled guardian — unchanged).
- **Classmate:** Veit. **Interlude:** the freed band plays ONE true bar — the book's first
  music.
- **Engine/assets:** returnable/dodge-only projectile classes (§3.2) debut here; AJ packet
  regenerates post-dossier.

### ch06 · Die falschen Hinweise — U6 "The world's best detective"
- **Setting & light:** paper-city at evening — window-lit blues (title per sheet; doc 41's
  "Die Stadt" drift is corrected to the sheet's name).
- **Field modality:** city verticality + **clue-following**: painted clue-marks chain across
  the level (a-lot-of counts, present-simple observations: "He walks. He watches.") — light
  investigation structure; full field palette minus typed (doc 41).
- **Freeables & skin:** collectible = **Lupen-Funken** (magnifier sparks — clue glints).
- **Task battery:** present-simple third-person (the s-rule under observation) · a-lot-of ·
  oddone (which clue does NOT belong) · wheel returns load-bearing (house numbers, doc 41).
- **The guardian.** Pointers: sheet "das verdrehte Notizbuch" · doc 27 "Spuren-Verwischer"
  (shell-game shuffle). **REC — keep DAS VERDREHTE NOTIZBUCH, give it the shell-game:** Mo's
  stolen notebook shuffles three false clues (cups-and-ball telegraph, doc 27's tell); each
  window is an evidence card — the notebook SHOWS a page (boss-evidence) and the present-
  simple question catches its lie. Koki left ch06 open pending art; this honors the sheet.
  ⚠ **ch06 remains CP-14-GATED**: unit-6 textbook pages must be scanned before ANY art
  generation (the lab's DO-NOT-GENERATE banner stands).
- **Ability:** favor power II window (doc 31 arc ~ch06). **Classmate:** Tammo.
- **Interlude:** the class starts KEEPING the notes — the breadcrumb file that pays off in
  ch14/finale.

### ch07 · Die Nudel-Küche — U7 "I love noodles" *(the MELLOW chapter — Variety Law proof)*
- **Setting & light:** kitchen + dining room warmth — steam, copper, checkered cloth.
- **Field modality:** calm interior traversal; **conveyor/serving-belt platforms** as the
  one gentle twist; zero hazards-that-chase. The chapter breathes on purpose.
- **Freeables & skin:** food beings (u07's ~40-word bank — Koki's "17" is the SB checklist
  count; the corpus is the authority); collectible = **Zutaten** (ingredients).
- **Task battery:** **category sorting** (drinks/vegetables/fruit/meat/other — sort surface
  §3.7, group-sort format exists in corpus) · like/don't-like (present-simple negative:
  "She doesn't like…") · articles a/an (an apple, an orange…) · **the frequency WHEEL**
  (adverbs locked on the scroll dial) · **the WB p.62 scale, re-fictionalized**: the chef's
  week-plan chalkboard shows ✓✓✗✗✗ rows — lock the right adverb, then order the sentence
  (both verbatim from the transcript, `wb/WB Unit 7…` L145 ff.).
- **The guardian.** Pointers: doc 27 "Rezept-Reißer" (soup-tornado of torn recipes) ·
  **Koki's seed: the mad chef, restore everyone's eating schedule — deliberately mellow, no
  jumping.** **REC — DER VERWIRBELTE KOCH: both at once.** The chef is the henchman; his
  torn recipes spin as a soup-tornado around him (the Rezept-Reißer IS his bewitchment).
  **No action fight at all**: a service-counter duel across the kitchen pass — card by card
  the class rebuilds the week's eating schedule (meal times × frequency adverbs × healthy
  sorting: "He never eats breakfast — fix it"), and with each fixed line one recipe page
  settles out of the tornado. Fully calm; the timer stays off (§2.9). Consoled, he cooks —
  the restored dining room fills. Why: Koki asked for exactly this pacing break, and the
  unit's grammar (frequency + negation) IS scheduling.
- **Ability:** none (breather chapter). **Classmate:** Enna.
- **Interlude:** the first meal together inside the book — the alliance visibly a class now.
- **Engine/assets:** sort surface debut (shared with ch09/ch10) · conveyor mover class
  (MOVER rig) · no boss engine at all (the point).

### ch08 · Das Kleiderzimmer — U8 "Clothes"
- **Setting & light:** your bedroom in the book — morning light, wardrobe chaos.
- **Field modality:** furniture platforming; **the bouncy bed** (bouncer debut as terrain);
  clothes scattered as world objects.
- **Freeables & skin:** the scattered clothes themselves (collect + name — Koki's seed);
  collectible = **Knöpfe** (buttons popped off the tangled clothes). **Amendment 2026-08-15
  (R53):** unchanged — ch08 keeps this mechanic and its own U8 words. Since ch01 now also
  collects clothing (the nine u01 uniform items, §2.7), ch08's naming beats treat
  `sweater` and `shoes` as **revision** and introduce only u08's additions (`jacket`,
  `trousers`); the two chapters share two words by the book's own design, not by accident.
- **Task battery:** clothes naming (restore/choice) · **do/does questions woven through**
  ("Does it fit? Do you wear it?") · this/that stays OUT (it is u10's grammar — doc 27's
  ch08 cell is corrected by the corpus, as its own caveat requires).
- **The guardian.** Pointers: doc 27 "Knoten-Kobold" (tangle of taken clothes, color-flash
  telegraph) = **Koki's seed nearly verbatim** (a being trapped in 5–6 layers; punch a layer
  off → name it + one question per layer; a normal being underneath). **REC — DER
  KNOTEN-KOBOLD, exactly that:** color-flash telegraphs which layer is loose; the fist knocks
  it free; the window names the garment + one do/does card; **five layers** (u08's core
  set), and under the last one: a small shivering book-being who was cold — it took the
  clothes to get warm. Console (a scarf stays with it), join. Why: the convergence needs no
  arbitration — doc 27 and Koki describe the same boss.
- **Ability:** none new; hover/rings retro-open the wardrobe tops (backtrack beat 2 window).
- **Classmate:** Juno. **Interlude:** OSWIN's note admits the cold (the wish layer, §1.1).

### ch09 · Der wilde Garten — U9 "Unusual pets"
- **Setting & light:** an overgrown garden gone wild — big greens, low golden sun.
- **Field modality:** **catch-chase** — the unit's animals are loose, FAST, and skittish
  (inverted Keen `thief`/`hopper` brains: they flee, hop walls, teleport-burrow); catching
  one face-to-face opens its card. The collectibles run away — the modality is the joke.
- **Freeables & skin:** the pets; collectible = **Leckerli** (pet treats — you need them to
  calm the caught animal; magnet-friendly).
- **Task battery:** counting quickfires with **irregular plurals 3** (two mice, three
  ponies — corpus-flagged forms) · jumbled-letter names (anagram machine, exists) · question
  words (what/where/how often does it eat?) · **object pronouns via care**: feed HIM, brush
  HER, give THEM water (Koki's feeding/complimenting seed, grammar-true) · possessive 's.
- **The guardian.** Pointers: doc 27 "Futterneid" (hoards all the bowls, bowl-slam rhythm) ·
  **Koki's ruling: NOT another animal boss (the zoo had that) — the finale is the
  habitat-sort.** **REC — both, in sequence:** mid-arena, DER FUTTERNEID (a small jealous
  creature guarding a bowl mountain — bowl-slam telegraph, object-pronoun windows: "Give
  IT the bowl!") is consoled quickly (it was hungry, not evil); then **the true finale is
  the SORTING CEREMONY**: every animal you caught must go home — box, tank, cage, or
  terrarium (u09's housing vocabulary; sort surface §3.7) — "we freed them; now we sort out
  the mess we made" (Koki verbatim). No combat climax; the ceremony is the boss slot.
- **Ability:** favor power II lands here if not ch06 (hidden-cage hunting, arc unchanged).
- **Classmate:** Quirin. **Interlude:** the letter-writing frame (u09's dear/best-wishes
  vocabulary): the class writes its first note BACK to OSWIN.

### ch10 · Das Geschäft — U10 "In a shop"
- **Setting & light:** a jumbled shop interior — shelf canyons, price-tag confetti, lamplight.
- **Field modality:** shelf verticality + **price restoration**: every item wears the WRONG
  tag (Koki's "everything is jumbled"); engaging an item opens how-much/number cards; the
  restored shelf visibly re-sorts (restoration transforms the world).
- **Freeables & skin:** the shop's goods; collectible = **Preisschilder** (price tags to
  return).
- **Task battery:** numbers 25–1000 on the **auto-lock wheel** (its load-bearing chapter) ·
  How much is/are (jeans are! — corpus note) · this/that–these/those (its true unit) · shop
  dialogue lines (Can I help you? / I'd like…).
- **The guardian.** Koki left it open and asked for options: (a) **REC — DER KASSEN-KRAKE**
  (doc 27: the till with too many arms; price tags telegraph the lane): arms slam lanes
  Punch-Out style; each counter-window rings up ONE honest price ("How much IS it?" — wheel
  input under pressure); every honest price stills one arm. Why: the till is the shop's
  heart, the unit's grammar is literally money questions, and the lane FSM exists. (b) der
  Einkaufswagen — a runaway cart chase (fun, but ch09 just did chase). (c) das Regal — a
  crusher-shelf with this/that lanes (near/far IS this/that — clever but thin for a whole
  fight; it becomes a mid-level gate instead).
- **Ability:** none new. **Classmate:** Smilla. **Interlude:** the class "buys" supplies for
  the road — the book plays along; first hint it WANTS to be kind (§1.7 seed).

### ch11 · Die stehende Stunde — U11 "What's the time?"
- **Setting & light:** a town square under a frozen clock tower — long shadows, held breath;
  everything mid-motion.
- **Field modality:** **THE WRONG-SPEED WORLD** (new engine, §3.7): zones where beings act
  absurdly slowly or absurdly fast (Koki's seed verbatim — skating, cooking, riding at wrong
  speeds; present-continuous made visible: "He IS skateboarding — like THIS?!"); crossing a
  zone edge shifts the player's own tick-rate slightly (readable, forgiving).
- **Freeables & skin:** the townsfolk mid-activity; collectible = **Zeiger-Rädchen** (little
  clock-hand gears).
- **Task battery:** **the draggable analog clock** (new instrument, §3.7 — set quarter past
  nine by dragging hands; mouse + touch) · present-continuous cards against the VISIBLE
  wrong action · time phrases (o'clock, half past, quarter to) · daily-routine sequencing.
- **The guardian.** Doc 27 "DIE STEH-UHR" IS Koki's "massive clock that has come to life" —
  convergence again. **REC — DIE STEH-UHR:** the clock-tower face descends as the arena;
  **her hands sweep as attacks** (hand-sweep = attack sweep, doc 27; duck/lie flat under the
  minute hand — the Mr-Sax lie-flat verb, capture-cited); counter-windows hand you the drag-
  clock: set her RIGHT, time by time, and each true time restores one tick of the world's
  speed until the square moves humanly again. Consoled: she chimes — softly.
- **Ability:** none new (the world-speed play is the novelty). **Classmate:** Lenz.
- **Interlude:** time inside vs outside the book — the class wonders how long they've been
  gone (seeds A16's un-aged rule without deciding it).

### ch12 · Das Geburtstagshaus — U12 "The birthday cake"
- **Setting & light:** your house dressed for a party — candle-warm rooms against evening
  windows; the campaign's coziest palette.
- **Field modality:** **ROOM-SEARCH** (new assembly, §3.7): the house is a graph of
  door-linked painted rooms (kitchen, living room, bathroom, hall… — u12's 9–10 rooms),
  explored non-linearly. **All previously freed classmates are IN the house** (the 15-design
  payoff) — but scattered and fog-headed.
- **Freeables & skin:** the rooms themselves (label/restore) + the classmates' memories;
  collectible = **Kerzen** (candles for the cake).
- **Task battery:** rooms naming · **the search dialogue in past simple was/were** ("Where
  WERE you?" — "I was in the kitchen!" — Koki's seed, the unit's exact grammar debut) ·
  months + the full ordinal set (dates) · prepositions of time (on May 4th, in July).
- **The guardian.** Doc 27 "Kerzen-Dieb" (blows out what others light; inhale telegraph) +
  **Koki's seed: everyone has forgotten the birthdays; the finale restores them together.**
  **REC — DER KERZEN-DIEB, then the ceremony:** a small gust-being darts room to room
  blowing out every candle you place (inhale telegraphs which room — chase him through the
  graph); cornered, his windows are date cards ("When is Edda's birthday? — It's on the
  THIRD of June"); each true date relights a candle he can't blow out. Beaten-by-brightness,
  he's consoled (he hated that no one remembered HIS day — henchman pathos). **Finale = the
  party**: everyone in the last room, every birthday restored, the cake lit — the ceremony
  is the climax (second ceremony-boss, distinct from ch09's sorting).
- **Ability:** none new. **Classmate:** Edda (freed FIRST here; the party is partly hers).
- **Interlude:** OSWIN's note names his own birthday. Nobody inside the book ever sang for
  him. (The A4 wish, nearly conscious now.)

### ch13 · Der Notruf — U13 "Help!"
- **Setting & light:** storm-dark cliffside town — rain, siren-red accents; the tense level.
- **Field modality:** **RISING-HAZARD ASCENT** (level-anatomy L288, `EauMonte`: climb beats
  the flood): water rises through the lower town, then the rescue run. **Sprint debuts**
  (doc 31 arc, ch13 door — unchanged).
- **Freeables & skin:** townsfolk in danger; collectible = **Signal-Funken** (flare sparks).
- **Task battery:** **the jumbled story** (Koki's seed): the accident's report is scattered —
  `order` cards rebuild it with linking words (and/but/because) and past-simple regular
  ("He slipped and fell, because the rocks were wet") · emergency-services calls (who do you
  call? — fire brigade / ambulance / coastguard / mountain rescue) · quickfires ARE timed
  here (urgency is the fiction, §2.9).
- **The guardian.** Doc 27 "DIE PANIK" (the emergency embodied — fast, loud, **beatable by
  calm**) + **Koki's seed: the rescue finale — put out the fire, save someone, fly the
  jetpack against rising danger.** **REC — both as two phases:** (1) DIE PANIK arena — she
  screeches lane-sweeps (siren pitch telegraphs); every CALM correct call-card ("Who do you
  call? — the fire brigade") lowers her volume a step; she is never struck, only steadied.
  (2) **THE JETPACK RESCUE** (the wordbank literally contains `jetpack` — curriculum-
  grounded): an ascent set-piece with fire/water rising below, carrying the stranded being
  up through collapsing platforms — the campaign's rising-hazard showcase. Consoled, die
  Panik becomes **die Umsicht** — she waits at the map's edge, warning the class ever after.
- **Ability:** sprint (door). **Classmate:** Falk*.
- **Interlude:** the class writes the report of its own rescue — u13's civics thread
  (class speaker, democracy) gets its beat.

### ch14 · Das Lieblingskino — U14 "It's my favourite"
- **Setting & light:** a home-cinema-of-the-book — projector beam in velvet dark; each
  "channel" its own mini-palette (the variety showcase).
- **Field modality:** **CHANNEL-HOPPING SETS** (new, §3.7): short themed set-pieces the
  level flips between (nature film / quiz show / space film / cartoon…) — 12 TV genres +
  8 book genres as literal terrain flavors.
- **Freeables & skin:** the shelved stories, drained grey; collectible = **Tickets**.
- **Task battery:** genres (which programme is this?) · likes/dislikes restoration ·
  **past simple irregular + negation** ("She didn't SEE it — she READ it"; froze/paid/sold —
  corpus-flagged forms) · story openers (once upon a time…).
- **The guardian.** Pointers: doc 27 "Der Graumacher" (drains color from favourites) ·
  **Koki's seed: a rogue book OR a rogue TV remote — with license to break formula.**
  Options: (a) **REC — DIE WILDE FERNBEDIENUNG (the rogue remote):** it ZAPS the arena
  between channels mid-fight — each channel one telegraphed hazard grammar (nature: stampede
  lane · quiz: spotlight drop · space: gravity flip-lite · cartoon: bouncing anvils) — and
  the counter-windows are past-simple negation cards about what JUST happened ("You didn't
  watch the quiz — what DID you watch?"). Why: it makes genre vocabulary physical, it's the
  variety law's flagship fight, and **books stay allies** — which matters, because THIS
  chapter's true climax is (b) below. (b) der Graumacher — strong alternative, ties the
  colour spine, but repeats ch04's restore-the-grey arc. (c) a rogue book — advised against:
  the fiction key (§1.7) needs books trustworthy.
- **The story key (A11):** after the fight, in the restored shelf, the class finds THE story
  — children in a book, and the way out. The keepsake cage (doc 31 §5, kept) sits beside it:
  OSWIN's own torn copy (§1.1). The two together tell the class everything.
- **Ability:** the "cage call" sweep (backtrack beat 3, doc 31 arc). **Classmate:** Fritzi*.
- **Interlude:** the class reads the ending aloud. Someone asks who the book was FOR.

### ch15 · Der Weg hinaus — U15 "What are you going to do?" *(the finale)*
- **Setting & light:** **the book itself** — page-terrain, ink-margins, binding-thread
  bridges; light = paper-cream turning to real daylight ahead.
- **Field modality:** **THE PAGE-TURN ESCAPE** — the campaign's one autoscroll escape run
  (sprint + everything learned; Mr-Sax phase-2 shape cited): the book turns its own pages
  behind you as the world closes.
- **Freeables & skin:** collectible = **Seiten** (loose pages flying home to the spine).
- **Task battery:** going-to, and only going-to (the corpus is emphatic: NO will in G1) —
  plans as the key: "I'm going to swim in the sea. I'm going to visit my grandma."
- **The finale.** Doc 27's inversion duel, kept whole and now story-complete (§1.7): OSWIN's
  sad notes fly as projectiles (every one a line the player has read this year); nothing can
  be lost, no one can be hurt; each going-to window — **the telling the book demands** —
  erases one of his defenses; the LAST window frees **the teacher** (§1.8, the reveal), and
  the final question is his: *"What are you going to do, OSWIN?"* The class answers WITH him,
  line by line. The book opens.
- **The epilogue (Decision 1):** everyone walks out. OSWIN too — un-aged, blinking. The last
  shot holds on his unreadable face one beat too long. (Both G2 forks live; §1.9.)
- **Classmate:** Cleo* (the fifteenth, freed on the way out — no one left behind).
- **Engine/assets:** escape-run scroller · inversion duel exists (Keen `boss.ts`) → port to
  paint primitives · the exit ceremony.

---

## §5 · PRODUCTION PLAN (the round's packet queue)

### 5.1 Packet sequence (one PR at a time; Koki merges; numbering canonical here)
1. **PR: this doc** (`pb-r4-master-plan`) + doc 31 banner + STATUS_AND_ROADMAP entry.
2. **PK-R4 · set-piece masses** — unchanged doc 36 v1.2 scope (Decision 2: it survives as
   the round's engine opener; every chapter's set-pieces consume it).
   **∥ CAST BATCH (parallel, art lane):** the 15-classmate + teacher design commission runs
   **IN ADVANCE** of the chapter waves (Koki's explicit timing: "in advance do a full asset
   build for all of our 15 student colleagues") — briefed from §1.3's roster once he confirms
   the three promoted names; Koki gates the sheet before any chapter consumes a design.
3. **PK-R5 · Overlay 2.0 + objective screens** (§3.1, §3.4) + timer policy (§2.9) + boss
   primitives ground layer (§3.2).
4. **PK-R6 · ch01 rebuild** (dossier ch01; includes the cage-law rewrite §2.3 + proof tape +
   deploy-truth playtest — **Koki's replay is the gate**).
5. **PK-R7 · XP layer 4** (§3.5; ladder names + avatar batch are Koki-gated in-PR).
6. **PK-R8 · interludes** (§3.6; ch01 content as pattern-setter).
7. **ART-OWES v2** (the doc-38-style audit Koki asked to repeat "based on the feedback I
   just gave you"): after the ch02–06 dossiers gate and before their art regenerates, one
   audit doc lists exactly what the existing generated art still owes the new dossiers —
   what survives, what re-briefs, what retires. It is the chapter waves' art contract.
8. **Chapter waves:** ch02–06 (each: dossier-gated sheet v5 → palette card CP-14 → art
   regen per ART-OWES v2 → level/tasks/lexicon → blind verify → tape → playtest), then
   ch07–15 in act waves. Modality engines built with their first consumer (§3.7).

### 5.2 Execution mode (F1)
Fable authors briefs (full-spec, access included), reviews every packet's diff AND plays the
build (sim + preview + deployed); **Opus 5 executes all packets** under fable-method with
the Opus-5 dial sheet; drafter≠verifier separation per brief; three-strikes escalation.

### 5.3 Standing gates per packet
`pnpm test` (machines/sim/pickups/pose) · `check:game-tasks` · `check:paint-art` ·
`check:bundle` · `check-composition` · `record:paint-tape` + proof expects ·
`verify-deploy` before every human playtest (P-44) · 2 blind-solve verifiers on every
authored-content packet (a verifier finding becomes a guard rail, never just a patch) ·
every NEW check tamper-proven (break one thing, watch it fail).

### 5.4 The character/asset program (E6)
15 classmate designs (silhouette-distinct, named per §1.3) + the teacher + per-chapter
guardians (GUARDIAN rig, ≥8 states incl. `joy`/`rest`) + Tinten-Geister ambience + avatar
batch (§3.5) + per-unit collectible skins + the two allowlisted sheets (`regelseite_a`,
`bonusbuch_a` — **allowlist expires 2026-09-30**; commission inside PK-R5/R6 window).

### 5.5 Art-pipeline rulings (E9)
- **HOLD** batch-ah/ai/aj/ak generation until each chapter's dossier + palette card gate
  (regenerating superseded designs is the waste this round exists to stop). **ch06 stays
  hard-gated on the u06 textbook scans (CP-14).**
- **Pull** the already-generated batch-af3 (ch01 cages ×3) and batch-ag (ch02) into the lab
  inventory as REFERENCE; wire only what survives the dossiers.
- Regeneration is unlimited in principle (Koki: no expense spared for suitability) — but
  always dossier-first.
- Sweep the stale text-in-image blanket ban out of the G1/G2/G4 prompt builders' NEG strings
  (the PR #245 ruling, recorded in doc 43 §6, applies to all grades; G1 keeps the L1/L2
  soft-signage clause).
- Per-unit grounding lexicons u02–u15 authored as wave items (only u01 exists).

### 5.6 Docs hygiene queued (not this PR)
Doc 20 "Jona"→OSWIN name sweep · doc 41 §1 title drift (ch01/ch05/ch06 → sheet names) ·
doc 27 ch08 grammar cell (this/that is u10) — all recorded here so they can't silently rot.

### 5.7 Verification of THIS doc
Fresh-context blind coverage check before the PR opens: an independent reader maps §0's
ledger against §1–§5 and flags any item trimmed, weakened, or silently reinterpreted;
disagreements are fixed in the doc, not argued. (Result recorded in the PR description.)

### 5.8 Source-of-truth corrections banked this round (F2/F5/F6/B18)
- **Rayman Redemption's SOURCE does not exist on disk** — only the compiled `data.win` +
  UndertaleModTool metadata dumps (objects/sprites/rooms/strings), the Rayverse C port of
  Rayman 1 PC, our 16 dossiers + 138 curated frames + 20-modality physics capture, and 11
  study docs. Design claims cite THESE; "copy the Redemption repo" is off the table.
- WB p.62 (U7 frequency scale) is already transcribed in-repo
  (`content/build/transcripts/g1/wb/WB Unit 7 I love noodles.txt` L145 ff.) — no PDF work
  needed; the MORE 1 SB/WB PDFs remain in iCloud for visual reference.
- Docs 33/34/35 are point-in-time build records; where they disagree with the live code, the
  code wins and the disagreement is surfaced in the touching packet.
- Docs 37/38/39's still-open items (art debts, replay findings) are carried into the chapter
  packets' checklists — superseded only where a dossier explicitly says so.

---

*Truth pointers: doc 31 (base canon) · doc 41 (design pass) · doc 42 (legacy mine ledger) ·
doc 27 §3/§5 (guardian pointers + economy) · doc 40 (rig) · doc 36 (composition/masses) ·
`docs/design/g1/paint/chNN.md` (per-chapter authority, v5 per packet) · corpus
(`content/corpus/…`) above all.*
