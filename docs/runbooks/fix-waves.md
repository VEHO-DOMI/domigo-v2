# DomiGo v2 — curation fix-wave runbook (A-5)

Turns the E-2 variant-audit findings (`content/build/audit/`) into merged, verified
content fixes — one bounded wave per PR. Pairs with the curation standard
(`docs/handover/17_curation_standard.md`) and the audit (`pnpm content audit-variants`).

> **⚠ CORRECTED 2026-07-12 (walked the flow to the end — an earlier draft of this doc
> understated the cost).** Landing an answer-pool fix is **far heavier** than a surgical
> overlay. Changing *any* item in an approved unit re-stales all **four LLM verification
> lenses** (`level-gloss`, `answers`, `translation`, `register` — keyed to the items'
> content hash), so `content verify --ingest` fails `lens … STALE — re-run the lens`.
> Landing the fix therefore requires **re-verifying the whole unit** (re-run the 4 lenses
> over all ~94 items) → validate → re-review → re-approve — *not* a ≤25-item surgical patch.
> **There is no lightweight surgical-fix path today.** Koki chose policy **(B)** (auto-approve
> mechanical fixes), but the real blocker isn't the approval verdict — it's the lens
> re-verification. **See §"The real blocker" for the recommendation.** (Also corrects
> BLUEPRINT_V2 IV.1's "overlay entries only", which fails V-22 — see §"Why it isn't
> overlay-only".)

## The wave loop (per PR)

1. **Worklist.** Take a bounded slice from `content/build/audit/worklist-g<n>.md`
   (≤25 items; one rule-class or one unit). State the count up front.
2. **Draft the fix as an item-fixes overlay** — `content/overlays/item-fixes.json`:
   `{ "<unit-slug>": { "patch": { "<itemId>": { "<field>": <full-value> } } } }`.
   **Whole-field, full-array semantics** (never deltas — the loader does `{...item, ...patch}`).
   Author with model intelligence per handover/17; never machine-generated prose.
3. **Materialize + re-lock** (per touched unit): `pnpm content gen --unit <slug> --ingest`.
   Applies the overlay into `grammar.json` / `vocab.json`, bumps each touched item's `rev`,
   records a `generated` state transition + fresh content hash. **Confirm the diff is surgical.**
4. **Re-verify the whole unit (the heavy step).** The item change re-stales all 4 LLM lenses:
   `pnpm content verify --unit <slug> --prepare` → run the 4 lenses (level-gloss / answers /
   translation / register) over the unit via fresh-context subagents (the blind-solve pattern;
   no API key) → `pnpm content verify --unit <slug> --ingest` (→ `verified`) → the validate
   stage (→ `review_ready`). **This re-verifies ALL ~94 items, not just the fixed ones** — the
   disproportion §"The real blocker" is about.
5. **Re-approve** — **Koki's content gate (see §Decision):** `pnpm content review-doc --items
   --unit <slug>` (prior verdicts sticky-resolve; answer only new flags + the unit verdict) →
   verdict `ok` → `pnpm content ingest-review --items --unit <slug>` → `approved`. Until this,
   the unit sits pre-approved, is dropped from `listApprovedUnits`, and the loader test fails.
6. **Verify + PR.** `pnpm content validate` green · `audit-variants` criticals drop · keys
   touched ⇒ `blind-solve --only <ids>` → 0 class-(a) · full standing gate · PR with before/after
   counts + a Verification-honesty note.

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

## The real blocker + recommendation (the decision that matters)

Koki chose **(B)** — auto-approve mechanical fixes — and that's the right policy; the
`approved` state is his content sign-off, and for a mechanical bug-removal the blind-solve +
audit re-run + his PR merge already gate quality. **But walking the flow to the end
(2026-07-12) showed the approval verdict was never the bottleneck:** any item change re-stales
the 4 LLM verification lenses, forcing a full-unit re-verification. So "fix 7 unreachable
answers" actually means "re-verify + re-review + re-approve 3 whole units (~280 items through 4
lenses)." That is disproportionate, and it makes A-5's ≤25-item "surgical fix waves" impossible
as specced.

**The real unblock is engineering, not policy: a lightweight "trusted patch" path** — a
`content patch` mode that materializes a mechanically-verified item-fixes patch + re-locks +
re-approves **without re-running the LLM lenses**, gated instead by the deterministic validators
(`content validate` all green) + a targeted `blind-solve --only` on the touched keys. A
mechanical fix introduces no new prose for the lenses to judge, so skipping them is safe *for
that class* — but **whether to trust that gate is a policy + corpus-integrity decision that's
Koki's.**

**Options for Koki:**
- **(1) Build the trusted-patch path** *(recommended)* — a bounded engineering task on the
  content-pipeline; then mechanical A-5 waves (R4, then R1's 791) become genuinely surgical +
  solo. Needs your OK: it changes the corpus-integrity contract (a patch that skips the LLM lenses).
- **(2) Accept the full re-verification cost** — a session drives the whole pipeline (lenses via
  subagents) per touched unit; heavy, but no new machinery.
- **(3) Defer** — the 7 R4 bugs are dead *partial-credit* answers, not wrong primary answers, so
  they are low-harm; leave them until (1) exists.

The 7 R4 fixes are captured below, ready for whichever path you pick.

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
