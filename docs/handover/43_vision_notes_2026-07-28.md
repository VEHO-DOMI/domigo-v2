# 43 · VISION NOTES — the grade-2 sequel's shape, and grade 3→4 continuity

**Captured verbatim in intent from Koki, 2026-07-28, during the art-pipeline session.
Status: NOT canon yet.** Everything here is Koki speaking about where the game lane is
going. Two items *confirm* existing canon, one *diverges* from it. The divergence is
flagged, not resolved — an authored story bible is not overwritten by a note. A story
session takes the §2 decision.

---

## §1 · Grade 2 is a sequel, and it changes genre (CONFIRMS doc 22)

Koki, in his own framing: grade 1 ends with the class escaping the book — and by
escaping, freeing the one who trapped them. Grade 2 follows him **out into the real
school**. Not a second platformer:

- **A top-down role-playing game**, closer to a classic handheld RPG than to an action
  game — the reference he reached for is the early-2000s Pokémon look.
- **Slower and more social by design:** collecting, talking to people, following
  breadcrumbs — deliberately *not* the quick reflexive loop of grade 1.
- **A detective / scavenger-hunt structure**: you work out who is behind what is
  happening to the school, and the insight is earned from evidence, not handed over.
- **A deliberately different visual language from grade 1**, so the two games do not
  read as the same product twice.
- Everything stays embedded in the unit's own content, taught the communicative way —
  that is unchanged and not up for discussion.

**This mostly confirms what is already designed.** `22_g2_overworld_design.md` already
specifies a **walkable top-down school overworld** (Phaser, zone-themed, palette-as-plot),
and `20_g2n_the_spill.md` already has the book leaking into a real school with the class
following what is being taken. The genre pivot Koki describes is the direction the G2
docs were already pointing.

**What is genuinely new** and should be carried into the G2 design gate:
1. The **visual reference** (top-down handheld RPG) is now explicit and stated as a
   distinguishing requirement, not an implementation detail.
2. **Detective/scavenger-hunt as the spine**, not just a beat map — the older
   "scavenger hunt" idea from early exploration is deliberately revived here.
3. The pace contrast with grade 1 is a *design goal*, not a side effect.

## §2 · ⚠ THE ANTAGONIST DIVERGES — a story decision, not an editing decision

| | Authored canon (doc 20, doc 31) | Koki's framing, 2026-07-28 |
|---|---|---|
| Who caused grade 1 | OSWIN — a former student trapped in the book for years, who re-bewitched it so the next class would be pulled in, because he did not want to be alone | Same |
| His state after grade 1 | **Freed and redeemed.** He walks out *with* the class, enrols as a real student, and is grade 2's **deuteragonist** — the ally who can read the ink | **Freed but not satisfied.** He carries the magic he collected inside the book out into the real world and causes havoc in the school |
| The grade-2 antagonist | **the Blank** — the emptiness left where he erased pages; not a monster, made of his own erased words; the class *fills* it with a story rather than defeating it, and it becomes Klecks | **Him.** You trace him through the physical school and work out who is behind it |

These are not reconcilable by tweaking a line. They are two different stories about the
same character, and one of them is authored down to chapter level with a bundle already
in the corpus (`content/corpus/stories/g2.st.the-spill/`).

**Recommendation for the story session (Fable's, not decided here):** keep OSWIN
redeemed and keep the Blank, and give Koki the *detective experience he is asking for*
without the antagonist rewrite — the Blank already **takes** things and leaves no noise,
which is a mystery structure by construction. Who-is-doing-this becomes what-is-doing-this
and why, the breadcrumb trail stays, and the finale keeps the answer that makes the whole
duology land: you fill the empty thing rather than beat the bad thing. If Koki wants the
harder, colder version — the freed student re-offending — that is his call, and it costs
a rewrite of doc 20 plus the authored chapter bundle.

## §3 · Grade 3 → grade 4 continuity (CONFIRMS doc 19)

The FOURTEEN cast — Leah, Leo, Ben, Sara and YOU — carries into grade 4. The grade-4
story is **branching**: it takes the player's decisions as input, the group investigates
something (Koki's words: a crime or the like), and they document it on the channel they
built in grade 3. This confirms `19_g4n_fourteen_live.md`, which already describes a
grade-4 "Fourteen: Live" continuation with the same cast; the new element is the explicit
**branching-by-decision** requirement, which the story schema already supports (`Choice[]`
on `scene.next`, present and unused in G3 because FOURTEEN is deliberately linear).

## §4 · Grade 3's picture library (as-built, this session)

For completeness, since it is the thing that prompted the conversation: the FOURTEEN
story has been live since PR #61–#71 with **no art at all** — the manifest declared 14
chapter cards and left `portraits`, `beats` and `clues` empty. A 235-prompt library now
exists (PR #244) covering a backdrop per chapter, a beat per scene, 22 emotional
portraits and 42 task panels, with the art-manifest wiring and the CI gate that keeps
the manifest and the library in agreement.

## §5 · Pointers

- `20_g2n_the_spill.md` — the G2 campaign bible (the divergence in §2 is against this)
- `22_g2_overworld_design.md` — the top-down school overworld design §1 confirms
- `19_g4n_fourteen_live.md` — the G4 continuation §3 confirms
- `31_the_painted_book.md` §1 — OSWIN's canon, the grade-1 end state
- `docs/art/g3-fourteen-data.mjs` — the G3 picture library referenced in §4

## §6 · ⚠ RULING: readable text in artwork is welcome (Koki, 2026-07-28)

Overturns a standing convention, not a one-off. Every art-prompt builder in this repo
carried a blanket ban — `build-g1-prompts.mjs`, `build-g2-prompts.mjs`,
`build-g4-prompts.mjs` all say *"No readable text, letters, numbers, logos or watermarks
anywhere in the image"*, and the new G3 library inherited it.

Koki's ruling: **"we can and should totally have written text in the images if it adds to
the story, and that shouldn't be avoided at all."** He is right, and in G3 it is not a
close call: the story is *about* a channel. A phone reading *"No cameras. No scripts.
Just us."* is the beat. A counter reading *47 views* is the joke of episode one. Six of
the strongest images in the existing Grade-3 library are nothing but a screen with words
on it, and the ban had them queued for deletion.

**The rule as it now stands** (implemented in `docs/art/g3-fourteen-data.mjs`; the other
grades still carry the old ban and are listed below as a to-do):

> Readable text is welcome wherever it serves the story or the teaching. Two exceptions
> survive, and neither is about language — both are mechanical:
> 1. **Never bake in text the app itself renders live and variably.** The comment section
>    changes with how well the player protected Ben; task cards get their sentences from
>    the corpus; a subscriber count must not contradict `SUBSCRIBERS` in `novel-copy.ts`.
>    A picture that argues with the running app is a defect.
> 2. **Real brand marks, platform logos and real people stay out** — an image generator
>    refuses them, and CP-15's clean-room rule stands. Generic app chrome is fine.
>
> For Grade 1 the same shape applies with one addition from the composition law: the far
> shell and furniture band (L1/L2) keep their signage soft and unreadable, because crisp
> lettering back there competes with the play plane. Props, plates and play-plane objects
> may carry real words — and in a town unit they *should*, since environmental print is
> free vocabulary.

**Two machine gates now enforce the narrow part** (`build-g3-prompts.mjs`): a beat that
states a view or subscriber count is checked against the app's own `SUBSCRIBERS` map, and
a beat whose line arrives *as a message* must actually say what the message reads.

**Open, not done:** `build-g1-prompts.mjs`, `build-g2-prompts.mjs` and
`build-g4-prompts.mjs` still carry the blanket ban in their own `NEG` strings. Those are
separate libraries with their own art already generated against the old rule, so sweeping
them is its own small piece of work — flagged here rather than done in passing.
