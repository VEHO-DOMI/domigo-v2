# DomiGo v2 — curation fix-wave runbook (A-5)

Turns the E-2 variant-audit findings (`content/build/audit/`) into merged, verified
content fixes — one bounded wave per PR. Pairs with the curation standard
(`docs/handover/17_curation_standard.md`) and the audit (`pnpm content audit-variants`).

> **✅ 2026-07-12 — SOLVED: mechanical fixes use `content patch --unit <slug>`.** Landing an
> answer-pool fix through the manual flow below (gen → verify → review → approve) re-runs the
> four LLM verification lenses over the WHOLE unit (~94 items), because any item change
> re-stales them — disproportionate for a mechanical fix. The new **`content patch`** command
> (`packages/content-pipeline/src/trusted-patch.ts`) is the sanctioned shortcut for the
> mechanical class Koki authorized (decision **B**): it materializes the overlay + re-approves
> the unit **without re-running the lenses**, and a machine guard **REFUSES any prose change**
> (answer-pool fields only — `answers`/`sAnswers`/`dAnswers`/`translation`), so prose rewrites
> still go through the full flow. The **mechanical wave loop** is now:
>   1. draft the answer-pool fix as an `item-fixes.json` overlay entry (whole-field arrays);
>   2. `pnpm content patch --unit <slug>` per touched unit (`--dry-run` previews + shows the guard);
>   3. gate: `pnpm content validate` green + `blind-solve --only <ids>` → 0 class-(a);
>   4. PR with before/after audit counts.
>
> The **R4 unreachable-answer pilot (7 bugs across g1-u05 / g3-u04 / g4-u12) landed this way**
> (audit R4 7→0, validate green, all units still `approved`). The manual flow below still
> governs content-**authored** fixes (rewrites, ambiguous carriers) that genuinely need lens
> review — those go through gen → verify → review-doc → `ok` verdict → ingest-review.

## The wave loop (per PR)

1. **Worklist.** Take a bounded slice from `content/build/audit/worklist-g<n>.md`
   (≤25 items; one rule-class or one unit). State the count up front.
2. **Draft the fix as an item-fixes overlay** — `content/overlays/item-fixes.json`:
   `{ "<unit-slug>": { "patch": { "<itemId>": { "<field>": <full-value> } } } }`.
   **Whole-field, full-array semantics** (never deltas — the loader does `{...item, ...patch}`).
   Author with model intelligence per handover/17; never machine-generated prose.
3. **Materialize + re-lock** (per touched unit): `pnpm content gen --unit <slug> --ingest`.
   Applies the overlay into `grammar.json` / `vocab.json`, bumps each touched item's `rev`,
   and records a `generated` state transition with a fresh content hash. **Confirm the diff
   is surgical** (`git diff` — only the intended items change; nothing else).
4. **Re-approve** (per touched unit) — **Koki's content-authority gate (see §Decision):**
   `pnpm content review-doc --items --unit <slug>` → verdict `ok` →
   `pnpm content ingest-review --items --unit <slug>` → state `approved`.
   Until this runs, the unit sits in `generated`, is dropped from `listApprovedUnits`
   (not served), and the `@domigo/content-loader` test fails.
5. **Verify.** `pnpm content validate` (V-22 green: overlay == materialized corpus; unit
   approved) · `pnpm content audit-variants` (the touched rule's criticals drop) · keys
   touched ⇒ `node scripts/audit/blind-solve.ts --only <ids>` → 0 class-(a) · the full
   standing gate.
6. **PR** ≤25 items with the before/after audit counts (the drift alarm) + a
   Verification-honesty note.

**Arc exit:** `critical: 0` per grade AND blind-solve class-(a) < 1% per grade.

## Why it isn't overlay-only (the V-22 constraint)

`content validate`'s V-22 compares each item-fixes patch field against the **raw corpus**
and requires equality (`validate-items.ts:858`); an overlay that isn't materialized into
`grammar.json` fails as "did not land." The approved corpus is also **hash-locked**
(`items.lock.json` + `state.json` contentHash), so a bare hand-edit of `grammar.json` trips
the V-22 drift guard (`validate-items.ts:809`). The only self-consistent state is: overlay
entry **and** materialized corpus **and** a recorded `approved` transition — exactly what
`gen --ingest` + `ingest-review` produce together. Review-editable cells
(`review-items.ts:326`) are prose only (vocab `d/s/mc/gloss/hintDe`; grammar
`prompt/distractors/gloss/hintDe`) — answer pools are never overlay-only, they go through
this loop.

## Decision for Koki — the re-approval verdict

Step 4's `ok` verdict is your content sign-off (the `approved` state means *you* approved).
Two policies:

- **(A) You verdict every wave** — safest; each fix waits for you.
- **(B) Delegate auto-approval for MECHANICAL fixes** — e.g. R4 unreachable-answer removals
  (a provably-broken partial dropped; zero pedagogical judgment) and R1 article-form adds
  under the K-4 rule (a correct article added; German genders are facts) — while you keep
  the verdict for content-*authored* fixes (rewrites, ambiguous-carrier repairs). A session
  then auto-approves the mechanical class; you review at PR merge.

**Recommendation: (B).** The blind-solve pass + audit re-run + your PR merge already gate
quality; a separate per-wave verdict for a mechanical bug-removal is redundant. This is your
call — flag it and I'll follow it.

## Pilot worklist — R4 unreachable answers (7 items, ready)

All are transformation (`.tf.`) items carrying a redundant whole-sentence **partial** answer
whose pipe-segment count ≠ the prompt's blank count → **unreachable** (the student fills N
blanks, never types the sentence). Fix = drop the dead partial, keep the exact authored full
answer. Verified end-to-end 2026-07-12 (audit R4 7→0, validate green, loader correct);
pending §Decision.

| item | blanks | drop this partial | keep (full) |
|---|---|---|---|
| `g1u05.gi.can.tf.002` | 2 | "Can Steve play the guitar?" | `Can \| play` |
| `g3u04.gi.comparative-intensifiers.tf.005` | 2 | "Croatia is much cheaper than Switzerland, but Switzerland is a bit more beautiful." | `much cheaper \| a bit more beautiful` |
| `g3u04.gi.comparative-intensifiers.tf.006` | 2 | "Game A is only slightly easier than Game B, but Game B is far more exciting." | `slightly easier \| far more exciting` |
| `g4u12.gi.phrasal-verbs.tf.001` | 2 | "Put it on!" | `it \| on` |
| `g4u12.gi.phrasal-verbs.tf.003` | 2 | "Put it on." | `it \| on` |
| `g4u12.gi.phrasal-verbs.tf.005` | 2 | "Give it up." | `it \| up` |
| `g4u12.gi.phrasal-verbs.tf.007` | 3 | "She came up with a great story." | `came \| up \| with` |

Transformation partial credit is computed from word-overlap in `@domigo/engine`
(`grade.ts` ratio fallback), so dropping the authored partial removes no partial-credit path.

## Remaining audit backlog (from `pnpm content audit-variants`, 2026-07-12)

`critical: 1007` — **R1** 791 (article variants, K-4-decided, add-only) · **R2** 209
(contraction symmetry) · **R4** 7 (unreachable answers, above). Advisories: R2 127 · R3 159
(single-accepted-answer — advisory, not auto-fail). Sequence R4 (pilot) → R1 (largest,
mechanical) → R2, one bounded wave per PR.
