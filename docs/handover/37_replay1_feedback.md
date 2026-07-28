# 37 · REPLAY 1 — Koki's playthrough verdict (2026-07-27), decomposed

**Source: Koki's verbal feedback + screenshots in `docs/Rayman X DomiGo Screenshots/
July 27 Gameplay DomiGo/` (git-ignored, on disk; the folder is `July 27 …`, not
`July 27th …` as this doc first said). Status: F-items routed; the screenshot review
is DONE — a reviewer mapped all 46 shots to their F-items and found 17 more
(F2-19…F2-35): `scratchpad/study/f2-screenshot-evidence.md`, quoted in the F2
passover's EVIDENCE ADDENDUM. Overall verdict in his words: "a huge improvement above
what we had before … but still carrying some of the old issues … not fully thought
through from start to finish, but much, much better."**

**Round state (PK-F1, 2026-07-27):** the binding flagship is built — see the CLOSED
block at the end of this file for what is verified done, and doc 35's PK-F1 entry for
how. PK-F2 (feel & function) and PK-F3 (readability & world) still stand.

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

---

# ★ CLOSED by PK-F1 (2026-07-27) — verified, not assumed

Every line below was checked this session on the merged main (`9d04376`) plus the
PK-F1 branch, in the browser at `/play/1/buch`. Where the check was live, the
observation is quoted; where it was mechanical, the gate is named. Taste verdicts
(is it beautiful?) are NOT claimed here — they stay with Fable and Koki.

## The five LIKELY-CLOSED art items — re-verified on main, no re-work

| F-item | Verdict | What is on screen now (this session, dev build) |
|---|---|---|
| **F2-11 slide look** | **CLOSED** | p3's slide is ONE continuous 45° chute: book-mass modules under an unbroken rail edge, corner to corner. The raw-AF stair segments and the teal "spine" strip are gone. |
| **F2-17 night fog** | **CLOSED** | p2 is a painted night, not a wash: deep blue-violet room, real chalkboard with ghost chalk-writing, a moonlit map with a light shaft, warm lantern pools, purple globe. No daylight art shining through, no bright ivy band. |
| **F2-6 easel float** | **CLOSED** | The p3 checkpoint easel stands ON the bridge deck, feet on the paving (it hung ≈140 px above its floor before). The identity half of F2-6 (it must read as KRAKEL) stays OPEN → PK-F3. |
| **floor seams** | **CLOSED** | p1/p3 floors are a carved book-stack mass with per-tile variation; the hard 64-px repeat is gone. |
| **F2-12 ink field** | **IMPROVED, verdict up** | The p3 ink now sits in a framed basin: the walkway ends in stone caps left and right, a rim of ink smears runs along the top, navy bands below. It reads as a sunken pool, not a wall on the same plane. Whether the painted rim + depth grammar is *enough* is Fable's call, not mine. |

## The binding round — closed on film

| F-item | Verdict | Evidence |
|---|---|---|
| **F2-1 task↔entity mismatch** | **CLOSED** | The same pencil creature in p1 was touched repeatedly: it served `enc.pencil.c1` → `enc.pencil.m1` → `enc.pencil.c1` (its pool cycling in file order), every card about a pencil. Never a rubber, never a chair. |
| **F2-21 arena pool leak** | **CLOSED** | A chalk hit inside the Tafel arena served `enc.tafel.c1` („Die Tafel wirft mit Kreide nach dir" → a board), then `enc.tafel.s1`. Root cause found in code: an undeflected projectile raises an ordinary encounter (`entities.ts:440`) carrying the thrower's skin — the router now scopes by phase and binds by skin. |
| **F2-20 card covers the boss** | **CLOSED** | The card docks to the side away from the being it addresses. Screenshot: the Tafel fully visible left, card right. |
| **F2-24 narrated climax** | **CLOSED** | The last knot now opens a FINALE card the child writes on (`fin.t1`, typed „hello"); only then does the Tafel bloom and the console beat read „Jetzt steht dein Wort da". Walked end to end in the browser. |
| **F2-23 Klecks named in the arena** | **CLOSED** | The memory card now names the Tafel; every boss card refers only to the Tafel or to things drawn in the arena. |
| **F2-19 stale noun across boss steps** | **CLOSED** | Root cause was pool sequencing, not a within-card bug: knot 1 served the PULT card, knot 2 served an unrelated "This is a pencil." Every boss card is now self-contained, so no order can produce a stale noun. |
| **F2-33 meaningless arena HUD** | **CLOSED** | The counter is labelled („🪢 Knoten: 3") and a counter with nothing to count is not drawn — „Buchstaben: 0/0" is gone from the arena. |
| **F2-2 card copy too long** | **CLOSED (machine-held)** | Every card body is ≤56 characters for the on-screen line and ≤56 for the ask; the gate fails the build otherwise. Longest in the shipped set: 52 / 48. |
| **F2-18 was task authoring part of the build?** | **ANSWERED** | Yes — and this round rebuilt the set: 49 cards, each bound to the being it is about. |
| **F2-22 number card vs dial** | **CLOSED, different cause** | "thirteen" WAS on the wheel, so the item was solvable — but the datum ("13") was never drawn anywhere: the moth carries no number and `WheelCard` never rendered `shown`. The card now displays the datum on a slate. (Dead art found on the way: `moths_slate.png` is never rendered by any state — a finding for PK-F3.) |
| **F2-35 counter drops during modals** | **NOT A DEFECT** | The number is the knot counter, and each solved boss card removes one knot. It looked unexplained because it was unlabelled; the label closes it. |

## Findings raised while working — routed, not silently fixed

- **The rings can never be grabbed in ch01.** Swinging is gated on the `swing` ability; `ch01.level.json` grants only `jump`, `run`, `punch`. That is F2-13/14's root cause, and it means the PK-F2 choice is binary: grant `swing` or remove the rings.
- **p1's two satchel cages can never be opened.** They need the fist; the fist is granted by Fibel in p2; the exit chain runs forward only. So 2 of the 6 cages are unreachable on a normal run — and the level-law reachability sweep cannot see it, because it sweeps with `level.abilities` (all of them) rather than the abilities granted at that phase. This is the other half of F2-34 and belongs with it in PK-F2.
- **The boss fight is reachable** (`p4` proof tape: exits `done`, 3 tasks solved) but I could not land a chalk deflect through the dev harness in 136 throws; the finale was reached by calling the scene's own `resolveTask` for each knot. A live-hands deflect is still unproven by me.
- **`?phase=` does not track the phase you are in** (F2-21's second half): it is the teacher's START door, so the header is authoritative and the URL keeps the value you entered with. Cosmetic — but it misread as a bug on film. **Question for Fable:** drop the param from the URL after boot, or leave it? Not a silent call.

---

# ★ CLOSED by PK-F2 (2026-07-27) — feel, function, and the rulings

| F-item | Verdict | Evidence |
|---|---|---|
| **F2-4 small-ledge glitch** | **CLOSED** | One `/` ramp tile at p1 (44,17) between two floors of the SAME height — an 8-px bump leading nowhere that stood the feet on a diagonal. Removed, and the class is now the `slope-purpose` level law (tamper-checked by writing the tile back). |
| **F2-13/14 rings + fist latch** | **CLOSED by removal** (Fable ruling 2) | Swinging is gated on the `swing` ability; ch01 grants only jump/run/punch, so no ring in the chapter could ever be grabbed. The three p3 ring glyphs are gone — the rings debut in the chapter that teaches the verb. |
| **F2-26 rings read as jewellery** | **MOOT** | The rings are no longer in ch01. |
| **F2-9 letter counter** | **CLOSED — the counter was honest** | Machine sweep over the real sim: placed = HUD total = reachable in every phase (8/8 · 8/8 · 7/7 · 0/0 · 12/12), using the abilities actually granted at each phase. "I felt I collected all" points at **F2-31** (a letter that reads as backdrop) → PK-F3. |
| **F2-34 the fist arrives late** | **HALF-CLOSED** (Fable ruling 3) | The two p1 cages no longer contradict the grant: cage2 is drawn GHOSTED (transparent = not yet) so „it only rattles" reads as designed, and cage5 moved to p3 where the fist is in hand. The control hint bar still lists the fist before it is granted — a smaller readability item, left for PK-F3. |
| **F2-21 `?phase=` drift** | **CLOSED** (Fable ruling 1) | The teacher's start door keeps its entrance; the param is stripped after boot, so the address can never contradict the header again. |
| **F2-3 jump forward-glide** | **MEASURED, NOT DECIDED** | Cause found: with no direction held there is no air decay at all, and the air-snap floor (2 px/t) sits above walk speed (1.25), so a walking hop travels nearly as far as a running leap. Three candidates are implemented and traced (`airbrake`, `landdamp`, `softsnap`); ~~the shipped default is unchanged because the feel verdict is Fable's and Koki's~~. **CORRECTED 2026-07-28 (PK-R1): the verdict landed — the shipped default is now `airbrake`** (`paint.ts:151 DEFAULT_AIR_MODEL`, Fable ruling 2026-07-27; provisionally passed in Koki's Replay 2, doc 39). Numbers in doc 35's PK-F2 entry. |
| **F2-5 p3 invisible wall** | **NOT REPRODUCIBLE — needs his spot** | Ground-walk sweeps in both directions over every standable column of all five phases show no wall but the intended world-edge box. The screen-box clamp was tested and refuted (it stays 186–204 px away at run speed AND at slide speed). No frame in the evidence set shows it either. |

**Also this packet:** proof tapes gained WORLD ASSERTIONS (`expect`: letters, exit,
cages freed, and `guardianDown` for the arena), closing the "tapes see buttons, not the
world" hole — tamper-checked by flipping the arena's assertion.

---

# ★ CLOSED by PK-F3 (2026-07-27) — readability & world

| F-item | Verdict | Evidence |
|---|---|---|
| **F2-6 checkpoint identity** | **CLOSED** | `krakel_a` / `krakel_b` / `krakel_active` were on disk and wired NOWHERE — the `C` glyph drew a nameless easel while the game already said „Krakel skizziert dich!". Krakel is now at his easel, and the checkpoint you have reached lights up (`krakel_active`, his sketch warm gold) and breathes. The float half of F2-6 closed in PK-F1. |
| **F2-31 letters read as backdrop** | **CLOSED** | Letters were drawn once and never touched: static gold on a warm wall. They now bob and glint per-letter. Engine-drawn, no new art. |
| **F2-9 letter counter** | **fully answered** | PK-F2 proved the counter honest; PK-F3 fixed the reason it *felt* wrong. |
| **F2-8 satchel cages don't read as collectible** | **CLOSED in behaviour, OPEN in art** | A cage the fist can open rocks on approach, and the first one raises a one-time hint naming the verb. The silhouette still says "bag" at 22 px — that part is in doc 38 for the art batch. |
| **F2-16 Merle's cage has no interaction path** | **CLOSED in behaviour, OPEN in art** | Same telegraph + hint. **Correction to the evidence addendum:** it asks for a collision fix because the cage is "standable" — entities are never grid-solid; what the film shows is the platform at p2 r16 cols 58–62 beneath her. Recorded so no sheet is commissioned against a wrong premise. |
| **F2-34 the fist arrives late** | **CLOSED** | With PK-F2's ghosted cage, the control bar now also stops offering „X Faust" before Fibel grants it. |
| **F2-7 walk-cycle back hand** | **CLOSED** | Measured first: the hands sat 4.4–11.6 px apart vertically and the open back hand cleared the 12-px body by up to 7 px, in lockstep with the feet. Now on a lagged phase, closer and higher: 3.6–9.4 px spread, ≤4.3 px clearance. |
| **F2-25 · F2-28 · F2-30 · F2-32 · l2_p4 waiver** | **OPEN — evidence filed** | `docs/handover/38_f3_art_evidence.md` measures each one for the Codex mini-batch, whose prompt the brief reserves for Fable at review time. It also lists **seven sheets painted and never shown** (`tafel_chalk`, `tafel_hand`, `tafel_sad`, `moths_slate`, `moths_rest`, `door_open`, `fibel_gift`). |
| **F2-10 p3 left ledge reads no-return** | **OPEN** | Not a trap: the level's own trap-pocket law proves the exit stays reachable from every reachable node. It is a legibility problem, and with the rings gone (PK-F2) that half of p3 is emptier — filed with F2-30 in doc 38 as a level-design decision before an art one. |
