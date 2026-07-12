# DomiGo v2 — curation fix-wave runbook (A-5)

Turns the E-2 variant-audit findings (`content/build/audit/`) into merged, verified
content fixes — one bounded wave per PR. Pairs with the curation standard
(`docs/handover/17_curation_standard.md`) and the audit (`pnpm content audit-variants`).

> **Verified 2026-07-12 (R4 pilot).** The flow below was validated end-to-end on the 7 R4
> findings (audit R4 7→0, `content validate` green, loader correct), then reverted pending
> the §Decision. **It corrects BLUEPRINT_V2 IV.1 (A-5), which says "overlay entries only":**
> answer-pool fixes (R1/R2/R4 — the bulk of the 1,007 findings) touch `answers` /
> `translation` / `dAnswers`, which are **not** review-editable overlay cells, so an
> item-fixes overlay *alone* fails `content validate` with `V-22 — item-fixes patch …
> did not land`. The patch must be **materialized into the corpus and the unit
> re-approved.** See §"Why it isn't overlay-only."

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
