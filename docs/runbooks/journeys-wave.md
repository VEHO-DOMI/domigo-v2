# Runbook — the journeys authoring wave (J-2)

_How the per-unit learning **journeys** are drafted, gated, and rolled out to all 57
units. The runtime is J-1 (`docs/BLUEPRINT_V2.md` §IV.5); this is the authoring._

## What a journey is

A `content/corpus/units/<slug>/journey.json` (schema `journey@1`) is the **authored
spine** a student walks for that unit: an ordered list of nodes. The default spine
(from the generator) is:

1. **lesson** — meet the unit's new words + grammar (teaching; no items).
2. **practice** — the unit's `practice` pool (mixed vocab + grammar).
3. **game** — the unit's canonical released campaign stop (an overworld **zone** for
   grade 1, a story **chapter** for grades 2–4). Deep-links to `/play/<grade>/<short>`.
4. **review** — spaced retrieval of due items (the live Smart-Review set, mock excluded).

Progress is **derived** from the `practice_attempts` ledger (`mode='journey:<unit>:<node>'`)
— there is no path-state table and **no DB migration**. The linear unlock gates on the
**item nodes** (practice / side-quest): lesson/game/review are non-gating (a leading
lesson never locks the spine; a game/review is reached when the preceding practice is done).

## The generator

`packages/content-pipeline/src/gen-journeys.ts` drafts a deterministic spine per unit
(same unit → same draft), schema- + corpus-validated (gamePointer resolves to a released
stop, referenced pools non-empty):

```
pnpm content gen-journeys --unit g2-u03      # print one draft (dry)
pnpm content gen-journeys --all              # validate all 57 drafts (dry) — must be "57 valid, 0 failed"
pnpm content gen-journeys --all --write      # THE WAVE: write journey.json for all 57
pnpm content gen-journeys --unit g1-u04 --write
```

## The gate (before the wave)

`content/corpus/units/g2-u03/journey.json` is the **hand-polished pilot** — the exemplar.
**Koki walks it in the real UX** (`/learn/g2-u03` on the preview: lesson → practice →
the game unlocks and deep-links into chapter 3 → review) and gives the verdict. His
verdict IS the quality bar for the shape (node order, titles, whether richer spines —
multiple practice rounds, side-quests via `poolOverrides`, per-unit game titles — are
wanted). **The wave does not run until the pilot is gated.**

## The wave (after the gate)

1. Fold any gate feedback into the generator's default spine.
2. `pnpm content gen-journeys --all --write` (this overwrites the pilot with the generic
   draft — re-apply the pilot's polish, or keep the pilot hand-authored and generate the
   other 56 with `--unit`).
3. `pnpm content validate-journeys` → **0 errors**.
4. Optional per-unit polish: thematic `titleDe` for the game node per campaign beat;
   `poolOverrides` + a `side-quest` node for a bonus round.
5. Commit in reviewable batches (a grade at a time is a natural unit); the standing gate
   + `validate-journeys` green on each.

## Guardrails (enforced, not vigilance)

- **Schema** (`Journey@1`): short node-ids with the `journey:<unit>:<node>` ≤ 40-char
  mode-length invariant; `gamePointer` iff `kind:game`; `itemPool` only on
  practice/side-quest; `mock` is not authorable.
- **`validate-journeys`**: every `gamePointer` resolves to its grade's **canonical
  released** campaign (the unreleased Spill / Lost-for-Words FAIL); referenced pools
  non-empty.
- A unit with no `journey.json` falls back to the legacy Study Path — the wave is safe to
  roll out incrementally.
