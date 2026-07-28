# 39 · REPLAY 2 — Koki's full verdict (2026-07-28) · the R3 charter

**Repo copy of `PLATFORM MASTER/00_BLUEPRINTS/DOMIGO_REPLAY2_VERDICT_2026-07-28.md`,
riding the first PR of the R3 round per its own header. Koki's charter text is
VERBATIM below; this session's audit of his full audio memo produced the dated
AMENDMENTS block at the end — read both.**

---

**Screenshots: old set „July 27th Gameplay DomiGo" (12:xx/13:xx) + NEW set in the
July-28 folder (11:41–11:51). This doc is the binding decomposition; the repo copy
rides the first PR of the R3 round. Overall: the composition/binding work landed
(„did quite some work… implemented successfully"), the game now needs GAME-FEEL,
VISUAL GAMIFICATION, and DESIGN-DEPTH — plus one crash.**

## P0 — broken
- **R3-1 CRASH at the level resolution** (11:45:51, again 11:46:06) *(timestamps —
  see Amendments M-F)*: finale hangs on a stuck frame. Repro + root-cause first,
  before anything else.
- **R3-2 THE LETTER ECONOMY IS UNSATISFIABLE**: Klecks' door demands 10 letters, the
  level carries 8, no backtracking (11:43:22). Economy audit per chapter: door price ≤
  letters reachable BEFORE the door; machine check.
- **R3-3 ESSENTIAL-PICKUP GATE**: the p2 door can be passed WITHOUT Fibel's fist,
  which the boss requires (soft-lock by design gap). Law: a phase exit LOCKS until the
  phase's essential grants are collected (no backtracking exists). Machine check in
  checkLevelLaws (essential entity flag + reachability-before-exit).

## Combat & entity behavior (code the behavior properly — study Rayman source + the
## Keen-build patterns; hybrid approach explicitly sanctioned)
- **R3-4 Guardian throw broken 3 ways** (11:50:09–11:51:16): throws while facing away;
  projectile spawns/appears BEHIND the player; projectile is a white ball — must be
  CHALK (art exists: „the chalk in a hand" sheet is painted-unused per doc 38), with a
  readable pattern (deflectable with the fist — proper duel design).
- **R3-5 Redeemed beings STAY PRESENT in happy state** — the freed moth should visibly
  fly its Freudenrunde and remain (11:41:52); the redeemed book keeps flying around
  (11:45:10); the rubber's redeem animation is clunky (shrink/blow overlap, 11:47:36–39)
  and it exits the level rightward forever. Law: redemption changes STATE, never
  removes presence (doc 31's kindness economy demands the friend stays).
- **R3-6 Fist-through-block**: punch passes through blocks with no impact FX and the
  block's purpose is unclear (11:45:43).
- **R3-7 THE HYBRID RIG FOR ENEMIES (Koki's proposal, adopt):** program/code parts of
  enemies like the hero rig (procedural motion, hitboxes, squash/turn/telegraph coded
  over painted key cells) instead of pure sprite swaps. This IS our rig architecture +
  the animation study's ~150-cell/20-modality plan — extend it from the hero to the
  cast. Feeds the pose program AND how all future entity art is commissioned.

## Task & overlay design (the gamification round)
- **R3-8 OVERLAYS MUST BE GAME UI, not text boxes**: nicer type, battle framing,
  entrance/exit animations, collectible pull-in animations, level-boot ceremony —
  **MINE THE LEGACY BUILDS** (the parked Keen build at #211 + old Lost-Pages battle
  pop-ups): Koki explicitly sanctions taking their best UI/UX (fonts, wheel, battle
  screens, spawn-toward-you collectibles, boot triggers). Study, extract, re-skin to
  STYLE_PAINT_V1 — never regress to their look wholesale.
- **R3-9 WHEEL UX v2**: spin by dragging INSIDE the wheel (mouse now, thumb later),
  auto-lock on release (the legacy wheel was responsive and full-round; only auto-lock
  was missing). Buttons stay as fallback.
- **R3-10 Spelling cards: drop the duplicate line** — the letter row below suffices.
- **R3-11 EVERY TASK HAS A VISIBLE SPEAKER** — „Jemand fragt dich…" with nobody on
  screen is banned (11:42:17). If no being asks, the task doesn't spawn.
- **R3-12 BOSS TASKS MUST BE VISUALLY GROUNDED**: the Tafel must ACTUALLY SHOW what
  its card references — the sentence it writes, the four words, the correction target
  (11:48:59, 11:51:26 were unanswerable by looking) *(second timestamp — see M-F)*.
  Law: a boss card's evidence is rendered ON the guardian before the card opens.
- **R3-13 Task-type DISTRIBUTION across chapters** (ch01 = tutorial: naming-the-
  attacker + number wheel; save spell/order/memory/mistake richness for later chapters
  per a distribution map — extends gate verdict G12). Non-repetitive serving (two
  pencils at spawn = two distinct cards minimum).
- **R3-14 Contextualization polish**: Merle is a KNOWN classmate (no „Kennenlernen"
  framing; still can practice „Nice to meet you" but staged right); „Richtung Lager"
  never established — name the place the class gathers, use it consistently.
- **R3-15 The color mechanic** (Farbkasten card, 11:42:38): merge with the Keen-era
  colorless-world idea — name it + give it its color back as a TWO-STEP task, and make
  it a LATER chapter's core mechanic rather than a ch01 throwaway *(SUPERSEDED — see
  Amendment M-A: Koki's ruling makes it ch01's CORE mechanic)*.

## New feature (design work, Fable)
- **R3-16 GRAMMAR-TIPS COLLECTIBLE**: the antagonist scatters the unit's grammar rules
  through each chapter; collecting all = reward; per-level score surface: classmates
  freed / grammar tips / letters (+ bonus-book pickups feeding a score economy — the
  no-death adaptation of „extra lives"). Spec as part of the chapter formula, wired
  into doc 31's fiction (he bewitched the chapter AND scattered its rules).

## World & readability
- **R3-17 HUD gamification** („Befreit 1/6 · Buchstaben 5/8" as painted game UI).
- **R3-18 Spikes unreadable** (11:42:08) + the knockback reads like „losing a life" —
  clarify the no-death language visually.
- **R3-19 Big masses as ONE drawn piece**: where a formation is special (the slide
  run-out zone, big blocks), commission it as a single full drawing instead of tiled
  cells (kills residue/overlap seams: 11:45:43, 11:43:59 end pieces). Extends doc 36
  §2 with a „set-piece mass" category.
- **R3-20 p3 cleanup**: left zone looks fall-able but isn't; school-bag area
  unreachable; empty pocket (11:43:50); upper platform distorted (11:44:08, 11:44:59);
  early-game gap tuning (platform too small / gap too big for chapter 1).
- **R3-21 Walk personality**: determined-face + clenched fist all the time reads wrong
  — expression/pose variety per the Rayman source material (pose program scope).

## Verified/closed side-notes from his pass
Slide + ledge-down reworks acknowledged better · rings removal noticed and accepted ·
airbrake feel provisionally passed · old 12:57/12:59/13:0x items were pre-fix
screenshots (closed in #237–#239, machine-verified).

---

## AMENDMENTS & CORRECTIONS (2026-07-28, the R3 Fable session — from the audit of
## Koki's full audio memo against this charter; routing in doc 41 + the R3 passover)

- **M-A · R3-15 RE-RULED BY KOKI (same day):** the audio says the colorless-world
  mechanic „can be the main thing in THIS level" — the charter's „later chapter"
  resolution is superseded. **Color-restoration is ch01's CORE mechanic**: the
  two-step `restore` card (name → give the color back), desaturated-until-redeemed
  rendering, ch01's field palette shrinks to choice/wheel/restore/oddone (boss
  ritual untouched). Spec: doc 41 §2; build: PK-R3.
- **M-B · R3-8b ADDED (charter gap):** the audio's „how the level resolves needs
  more deliberate thought" (file 11.50.42) was not decomposed. The chapter-END
  ceremony is now designed with R3-16's score surface as ONE sequence (doc 41 §5);
  ceremonies in R3-8 cover boot AND resolution.
- **M-C · F-d SCOPE WIDENED:** the audio sanctions mining the Keen build's
  task/enemy/boss DESIGN thinking, not only its UI — `docs/_archive/keen/design/`
  ch01–ch15 + study docs are a standing idea-mine with a ledger (doc 42 §6).
- **M-D · R3-21 RIDER:** the „weird standing animation on the platform" (11:44:59)
  joins the pose-program rider list (doc 40 §5).
- **M-E · REAFFIRMED:** „all unit imperatives present + contextualized, rethought
  per unit" = the standing G-era door-series coverage law, now explicit per-chapter
  in the distribution map (doc 41 §1).
- **M-F · TIMESTAMP CORRECTIONS (verified against the actual July-28 folder):**
  the crash's second/late instance is **11.50.51** (the stuck frame at run end) —
  no 11:45:51 file exists; 11.46.06 (the earlier instance) stands. The „four words"
  boss task is **11.50.26** (not 11:51:26); the throw sequence ends **11.50.16**
  (not 11:51:16). The R3 passover cites only files that exist.
