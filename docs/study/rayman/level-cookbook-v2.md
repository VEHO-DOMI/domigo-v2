# Level cookbook v2 — authoring painted-platformer chapters (2026-07-19)

**Status: STUDY→METHOD (companion to doc 31 §7; finalized at M4 from the as-built ch01; the
Keen cookbook `docs/study/keen/level-design-cookbook.md` stays as history). Floors AND ceilings
— this shape breathes more than Keen did.**

## 1 · The phase is the authoring unit

A chapter = **3 phases + 1 single-screen guardian arena**, chained by exit signs. A phase is a
short, self-contained map with its own painted parallax set — one readable spatial idea per
phase (a climb, a chase, a hunt), introduced safe, tested risky, paid off. Author small,
review small, chain by the sign. Boss set-pieces are tuned to ONE screen.

## 2 · Density dials (per phase, tier E baseline)

- **Encounters:** ~0.5–0.75 per screen-width. Breathing room is a feature — traversal stretches
  with no encounter at all are legal and good.
- **Checkpoints:** ≤1 sketch checkpoint per phase, placed BEFORE the risk spike, never after it.
- **Currency:** trails are sentences, not confetti — a run of 5–8 leading somewhere (a cage, a
  ring line, an alcove); never scatter without intent (doc 30: no collectible without a reason).
- **Verticality:** at least one optional vertical excursion per phase once hover exists.
- **Helper platforms:** tier E gets MORE (inverse scaffolding carries from the Keen doctrine).

## 3 · Cage conventions (per chapter, 6 cages)

1. **The person cage** — on the critical path, findable by every player; the chapter's
   emotional beat (kid freed → one grounded English line → runs to camp).
2–3. **Trail cages** — at the end of currency breadcrumb trails that visibly bend off-path.
4. **The later-verb cage** — visible now, reachable only with a chapter-future ability
   (the backtracking economy; the map prompts revisits at beats 1/2/3 — doc 31 §4).
5. **The teased cage** — camera-visible in an alcove whose entry is a small puzzle
   (spring, punch-trigger, ring line).
6. **The arena cage** — in or directly after the guardian arena; victory's extra gift.
Secrets are breadcrumbed or teased, never invisible-wall guesswork.

## 4 · The role vocabulary is the palette

Cast each unit's content into the SAME small set of roles (doc 31 §3): chaser · gunner · flyer
· bouncer · crusher · swarm; platforms static/falling/bouncy/moving/swinging; hazards
spikes/ink-pools/slippery; rings, springs, vines, triggers, exit sign. A phase uses 2–3 enemy
roles, not all of them; the arena uses ONE pattern. World-scoping is law: a unit's palette is
its own castings only — nothing generic ever spawns (doc 30).

## 5 · Difficulty across the year

Tier dial = population + placement + timers, never physics. Chapter ramp: each new verb gets a
safe introduction phase (its granting chapter), a stress chapter immediately after, and secret
uses forever. Arena ramp: telegraph windows shrink S<M<E per script, knots cap at 5. Ch15 runs
inversion (cannot fail).

## 6 · Readability laws (with STYLE_PAINT_V1)

Play plane pops (saturation + outlines); backgrounds recede (silhouette planes, no outlines);
hazards read at a squint; glow = collectible/hint ONLY. If a screenshot squinted to 10%
saturation doesn't separate hero/enemy/ground/backdrop, the phase fails art QA regardless of
how it plays.

## 7 · Authoring reference discipline

Level-grammar study happens in Ray Maps (raym.app — the PC/PS1 sets via the Game/Level
dropdowns): pacing, cage hiding, ring-line shapes, arena staging. STUDY-ONLY: layouts are never
traced or copied; we learn the grammar, then author from the unit (doc 30 §1.4: the process is
the template, the content never is).

## 8 · The ten commandments (transcript study, 2026-07-20 — LAW for every sheet)

Mined from the full critical retrospective of the 1995 original; each is stated as OUR law.

1. **Teach by doing in the first screen.** Every new rule gets a "red-orb loop": show the goal
   just out of reach, let a natural path make it reachable. No text tutorials inside phases.
2. **One power per unit, taught in isolation** before it combines with anything else.
3. **Interlock the set-pieces.** The most-praised trait: movement + scenery + creature + task
   locking into one moment. Every chapter sheet names at least one interlock set-piece.
4. **Perfect legibility:** what looks safe IS safe; what looks dangerous IS dangerous.
5. **Never require a failure to reveal a rule.** First sight of any hazard must be survivable
   by a careful kid.
6. **Retry sits next to the challenge.** Checkpoints cost nothing and sit BEFORE risk spikes.
7. **Every collectible on a returnable path**; signpost what remains (our letters HUD).
8. **Exploration is net-positive.** Never reward→trap; a bent path always pays.
9. **Each unit distinct in look AND feel**, with quiet callbacks across units.
10. **Tone matches difficulty; spend charm generously** — micro-animation delight is a budget
    line, not a luxury (anti-stale law).

## 9 · The twenty sins, inverted (the ANTI-LAWS)

Each sin the retrospective documents in the original, flipped into the law our sheets obey:

| # | Their sin | Our anti-law |
|---|---|---|
| 1 | Fuzzy hitboxes | Hitboxes match silhouettes; generous FOR the player only |
| 2 | Learn-by-dying placements | First encounter of anything is survivable at walking pace |
| 3 | Checkpoint cruelty (long dead walks) | ≤1 phase-length between checkpoints, ever |
| 4 | One-way missables | Nothing collectible is lost by progressing |
| 5 | Damage chains (juggled hits) | iframes cover knockback + recovery fully |
| 6 | Camera fights the player | Camera never hides the direction of travel |
| 7 | Slip carrying into the air | Ice modifies GROUND accel only; air control stays standard |
| 8 | Reward traps (bait over pits) | Bait never sits over an unmarked kill zone |
| 9 | Grind gates (collect-alls to progress) | Cages/letters gate BONUSES, never the critical path |
| 10 | Aesthetic-difficulty mismatch (cute world, brutal spike) | Difficulty reads in the art |
| 11 | Invisible required secrets | Required = visible; secret = optional |
| 12 | Trial-and-error timing (blind leaps) | Every leap's landing is visible before takeoff |
| 13 | Instant-death surprise objects | Nothing kills on first contact without telegraph |
| 14 | Endless-pit overuse | Pits are pockets with visible exits (trap-pocket law in code) |
| 15 | Hidden physics rules (their air-slip) | Every physics rule is observable in a safe context |
| 16 | Boss = death-resets-level | Our guardian resets the ARENA only; counter-window grammar |
| 17 | Difficulty spikes without rehearsal | Stress phases only directly after teaching phases |
| 18 | Precision demanded at max speed | Speed sections widen the corridor |
| 19 | Backtracking without change | Revisits unlock NEW paths (beat 1/2/3 map economy) |
| 20 | Punishing curiosity | Poking at the world yields charm or coin, never loss |

## 10 · The bonus-room economy (magician study, exact numbers)

The original: find the magician → pay 10 tings (spent) → a unique TIMED trial (collect every
ting against a per-level seconds budget; ~2s grace) → perfect clear = +1 life + permanent
completion bit; whole loop ≤ short. OURS (kid-friendly inversions per §9): one bonus door per
chapter, entry paid in the unit's own currency, ~12 timed collectibles, REPEATABLE (sin 4/9
inversions), reward = chapter cosmetic/story gift, never progression.
