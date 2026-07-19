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
