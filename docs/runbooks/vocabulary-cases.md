# Vocabulary source and meaning cases

**CODEX DRAFT — NOT CANON · review tooling, no runtime word index.** This is stage 1 of the [vocabulary programme](./vocabulary-program.md). It prepares evidence for the independent GG review; it does not change exercises, learner history, accepted answers, images, or the live database.

## Why a separate casebook

A spelling is not a meaning, an appendix occurrence is not an exercise, and an exercise chapter is not proof of first teaching. The same English `bank` can mean a financial institution or a river edge. Repeated `midnight` and `sweater` entries are genuine occurrences in different master-list units. The casebook retains those distinctions instead of overwriting a chapter or joining every identical spelling.

The original appendix and master-list source fingerprints identify exact files. They do not authenticate publisher edition identity. Source references such as `MORE 1` and `T6` do not supply a unit; a literal `U1/19` must not be silently repaired to `U11/19`. A Year 4 Unit 14 occurrence remains outside the configured thirteen-unit course.

## Reproduce and verify

Use the same explicit four-source manifest as `vocabulary-intake`. Source locations stay in the local manifest and never enter the report. Reports must be outside the repository and are never overwritten.

```sh
pnpm content vocabulary-cases --manifest /absolute/private-inputs.json --out /absolute/review/cases.json
pnpm content vocabulary-cases --manifest /absolute/private-inputs.json --out /absolute/review/cases.json --verify
pnpm content vocabulary-cases --manifest /absolute/private-inputs.json --out /absolute/review/proposals.json --decisions /absolute/review/decisions.json
```

The output contains original quotations and current effective tasks, including committed review patches. Keep raw reports and reader evidence outside tracked files. A case fingerprint binds the source occurrence, original source hash, exact bank candidates and their source hashes, and full effective task contents. Adding/removing a candidate or changing relevant content invalidates the associated proposal. Byte verification also detects changes anywhere in the full regenerated artifact.

## Candidate rules and proposal boundary

Exact normalised text remains the first candidate. Additional suggestions have explicitly recorded transformations: citation `to`, a leading `a/an/the`, a final formal/informal label, an explicit `=alias` parenthesis, or optional `(s)/(es)`. These are bounded suggestions, not synonym expansion, arbitrary parenthesis removal, or semantic approval. They do not change the original spelling or the scoring answers. Operations are deliberately not recursively combined; residual unmatched forms need their own source review.

A decision file has schema `vocabulary-case-decisions@1` and a `decisions` array. Each proposal supplies:

- `caseId`, current `caseFingerprint`, and a candidate `bankId` (or `null` for a whole-case uncertainty/disposition).
- `relation`: `same-meaning`, `different-meaning`, `unresolved`, `no-candidate`, or `outside-course`. This describes the selected source meaning versus the bank meaning, not the correctness of every task direction. Broad multi-sense source entries stay unresolved when a bank covers only one reading.
- A rationale, attributed author and explicit limitations. Attribution is an offline claim, not an authenticated reviewer identity.
- Exact field quotations (`side`, `field`, `text`). Meaning proposals must quote both German source and bank fields. Every quotation is checked against the pinned field; the program cannot establish whether the rationale is linguistically sound.
- `taskAlignment`: `consistent-with-bank-meaning`, `conflicting`, `unreviewed`, or `not-available`. A positive/conflicting task judgment must cite a definition or context. This is separate from the source-bank relationship and is never a global pedagogical approval.

The parser rejects duplicate pair decisions, nonexistent candidates, stale case fingerprints, invented/incorrect-field quotations and unsupported dispositions. It accepts no `approved`, `verifiedMeaning`, or `firstTaught` authority from the input. Every output remains `proposal-needs-independent-review`, `verifiedMeaning: false`, and `firstTaught: null`; the report has no approval command. The two independent source/meaning readings and GG acceptance remain separate evidence, even when they agree.

## Bounded calibration and remaining coverage

The initial full inventory contains 7,398 parsed/excluded source occurrences, not unique meanings. It proposes candidates for 3,422 occurrences (3,215 have an exact spelling candidate); 3,976 have none. Across 2,446 bank occurrences, 457 have no candidate under these rules. There are 3,963 candidate pairs. The 207 additional source occurrences and 16 additional bank occurrences reached by citation suggestions have **not** been automatically resolved.

Twenty-five deliberately selected cases cover homonyms, broad translation inventories, repeated units, citation prefixes/articles/register/aliases/plurals, differing translations, an episode reference and an excluded unit. Two readers independently derived the selected source rows and master-list placements from all eight original documents. They and the author agree on all 31 local proposals: 20 same-meaning, three different-meaning, two unresolved, five no-candidate and one outside-course. These are review evidence, not a deployed identity map. The unresolved meanings are the broad `light` inventory and the surprising-versus-excellent use of `amazing`.

Remaining source occurrences after this sample are partitioned below by the first matching rule. Counts are routing evidence, not priority-free approval queues; even exact translations need a semantic review.

| Review wave | Remaining occurrences | Required evidence |
|---|---:|---|
| Outside the current course | 17 | Original edition/course boundary; retain rather than renumber |
| No citation candidate | 3,953 | Original unit text, intentional scope/function-word policy, bounded additional citation rules |
| Reference supplies no unit | 1,636 | Original episode/prior-book evidence; no guessed first chapter |
| No candidate in the referenced unit | 353 | Correct edition, original page/exercise, separate practice placement |
| Multiple bank candidates | 195 | Meaning distinction versus repeated occurrence; retain every source |
| Single candidate, differing translation | 316 | Selected meaning, lexical variants, contextual evidence |
| Single candidate, exact translation | 903 | Independent meaning confirmation; no automatic acceptance |
| **Total** | **7,373** | All remain traceable; 25-case calibration is not whole-corpus verification |

## Filed, not acted on

The calibration also found task-quality concerns, separately retained in the external reader evidence and Mission Control. These include midnight without a night cue, a misleading sweater definition, the praise-only amazing use, an unclear aunt relation, an unreliable anything definition, and unnecessarily narrow match/angry definitions. The matching lexical relationship does not excuse those tasks. The complete content audit must check definition/context independently, actual chapter vocabulary and grammar prerequisites, accepted forms, sufficient German support and cold solving. No generated student wording changes in this slice.

Before broad source adjudication, locate and bind the original textbook edition and relevant pages for the conflicting references. The four exact master files are supported by all 57 bank source fingerprints; the appendix-to-current-edition relationship remains unproved. Missing evidence is a named unresolved case, not a reason to fabricate a join.

## Boundary for the subsequent learning-history contract

The history work must identify the **exercise occurrence and revision actually shown**, direction and mode, each answer/retry, help/hint exposure, outcome and confirmed persistence. Keep source references and a future reviewed meaning identity separate: an unresolved source meaning must never be replaced by a spelling-based identity. Do not relabel historical events silently when meaning assignments change. A later reviewed association can carry its own version and preserve the original task link.

The history design must also resolve the existing partial-write/award finding: storage acknowledgment and a single authoritative award must agree under retries, offline replay and duplicate submission. These are requirements for the next stage, not claims that event capture or personal collections have been built here. No new learner data is collected in this source-review slice.
