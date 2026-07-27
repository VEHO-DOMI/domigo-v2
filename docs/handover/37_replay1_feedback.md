# 37 · REPLAY 1 — Koki's playthrough verdict (2026-07-27), decomposed

**Source: Koki's verbal feedback + screenshots in `docs/Rayman X DomiGo Screenshots/
July 27th Gameplay DomiGo/` (git-ignored, on disk). Status: F-items routed; the
screenshot review + full spec = the next FABLE session's first job (each F-item below
must be re-verified against its screenshot before speccing). Overall verdict in his
words: "a huge improvement above what we had before … but still carrying some of the
old issues … not fully thought through from start to finish, but much, much better."**

## THE TOP CLASS — tasks don't match the world

- **F2-1 · TASK↔ENTITY MISMATCH (the #1 finding).** A pencil attacks → the card says
  "ein Radiergummi hüpft…" (answer: rubber); next encounter, same pencil → "ein Stuhl
  mit vier Beinen…" (answer: chair). Root cause hypothesis (verify in code): the
  `use`-pool router serves round-robin and IGNORES the triggering entity's skin — the
  43 cards carry entity stimuli as text only. FIX CLASS: cards declare their entity
  skin; the router filters the encounter pool by the attacker's skin (fallback pool
  for skinless); audit all 43 bindings; **Koki's standing ask: every vocabulary item
  has its unique enemy/representation genuinely tied into the level.**
- **F2-2 · Card language too long / not "kurzweilig".** Boss cards especially: walls
  of German prose before the interaction. Law: dopamine-short card copy — one look,
  one act. Curation pass over all 43 (brevity + first-grader read-aloud reality).
- **F2-15 · Boss tasks lackluster + malfunction** ("crack pen for something else —
  you never see that"; "Fieberstärke 85" appears with no purpose or plan). Re-spec the
  boss card set + the arena HUD meaning; verify every boss mechanic on screen.
- **F2-18 · His direct question: was task authoring part of this build?** Answer for
  the record: the 43-card set was authored+blind-solved in Build-D1 (#232), but the
  SERVE layer (F2-1) and the copy length (F2-2) break the experience — the curation
  was real, the delivery wasn't. Both fixes above restore it.

## FEEL & PHYSICS

- **F2-3 · Jump carries too much forward glide.** Precise near-ledge jumps overshoot;
  landing animation walks extra steps forward; "you tend to fall off right away
  because you still have this forward momentum." Investigate: launch-momentum carry
  (AIR_SNAP up to 7 px/t), landing recover, ledge-edge behavior. His instruction:
  "maybe we're a bit too harsh with it — review the code, playtest thoroughly."
  Candidate: air-drag when no direction held / softer momentum cap — feel-tuned in
  browser with red→green traces, per-change.
- **F2-4 · Small-ledge glitch** (12.57.28): standing on the short ledge from the left
  glitches the character; the ledge's design purpose is unclear anyway.
- **F2-5 · Invisible wall** at p3's right approach — blocks walking, nothing drawn.
- **F2-13/14 · Rings don't function** (13.04.13) and **fist hits don't latch**
  (13.05.55–57): the swing/ring mechanic is either unwired or unreadable. Verify
  swing attach path end-to-end; if rings are decor-only in ch01, remove them
  (purpose law) or wire them.

## WORLD & READABILITY

- **F2-6 · Checkpoint identity + placement.** The easel floats (known → PK-C2b
  anchor fix); beyond that: "not really clear what it is, who is there" (Krakel needs
  his readable-station art/beat) and p1's checkpoint position deserves a re-think.
- **F2-8 · Satchel cages don't read as collectible** (12.59.58): no affordance for
  punch-to-open; kids walk past them.
- **F2-16 · Merle's pencil-case cage: no visible interaction path** (13.13.59) — the
  person-cage MUST telegraph its ceremony.
- **F2-9 · Letter count off** ("missing one letter, I feel I collected all").
  Audit per phase: counter vs letters actually placed/reachable.
- **F2-10 · p3 left ledge zone reads unreachable/no-return** (13.01.45, 13.02.14).
- **F2-12 · The fall-below area is illegible** ("where do you fall down there, what
  is that" — 13.02.53, 13.03.12): the ink/fade region needs the painted rim + depth
  grammar (AF2 partially; re-judge after wiring).
- **F2-11 · Slide looks awful** — expected: the AF2 45° slide art was NOT yet wired
  when he played (raw-AF stairs + thin line). Re-judge after PK-C2b. (Mechanics:
  "wow, really great — it's really pushing me down" — the FEEL passed.)
- **F2-17 · Night phases fog** — known, AF2 repaints wired in PK-C2b.
- **F2-7 · Walk animation: the back hand hangs wrong** (12.59.30–31). Rig hand
  placement pass (the hands program has canon in PB-B; re-check swing/lag params).

## WHAT KOKI PRAISED (keep, don't regress)

Platform walk-under/walk-on behavior ("quite a success") · the slide PUSH mechanic ·
the door word-task ("fine as it is") · overall look ("much more beautiful now").

## ROUTING

1. **PK-C2b first, unchanged** (PR #236: AF2 art + v1.1 audit + anchors) — several
   F-items (F2-11/12/17, easel half of F2-6) are expected to resolve or re-frame there.
2. **Then THE F2 ROUND (new campaign):** a FABLE session boots, reviews every
   screenshot in the July-27 folder against this list, re-verifies each F-item in
   code/browser, and writes the packet specs (expect: F2-1 binding fix as the flagship
   content+engine packet · F2-2/15 card curation · F2-3 feel-tuning with browser
   proofs · the world/readability batch). Opus 5 executes per packet; PR discipline
   as always (one at a time on the open queue).
