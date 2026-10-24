# Vocabulary learning history — completed exercises

Implementation slice cgo-143, submitted for review rather than live approval.
This supports stage 2 of [the vocabulary programme](vocabulary-program.md).

## What the record means

The ordinary practice, daily round, review and study/journey vocabulary cards
still conclude once: a non-wrong result, or the third wrong result. One existing
attempt write now carries the ordered observations leading to that conclusion.
For example, wrong → wrong → correct remains one completed exercise with three
checks, rather than appearing to have been correct on the first check.

Earlier grades are explicitly **client-reported observations**. Only the final
answer is graded by the server. Observations do not change points, spaced review,
streaks or mastery calculations. A later consumer must not silently interpret an
aided final success as first-attempt mastery.

The existing `practice_attempts.context.vocabularyHistory` JSON field contains:

| Field | Meaning |
|---|---|
| `schema` / `coverage` | `vocabulary-learning-history@1` / `completed-card-only`. |
| `pool` | Actual grading direction: contextual sentence (`carrier`), definition, German→English or English→German. |
| `gradedContent` | Revision and SHA-256 fingerprint of the effective item loaded by the server when it graded this submission. |
| `displayedContent` | Browser-reported revision and fingerprint of the effective displayed item, or unknown for legacy clients. |
| `contentMatch` | Fingerprints match, differ, or cannot be compared. This is a comparison of a client claim, not server attestation of what appeared on screen. |
| `clientObservation` | Maximum checks and ordered grades with assistance already revealed at each check. No earlier raw answer text. |
| `checkTierEvidence` | Explicitly `client-reported`, or unknown. |
| `finalServerTier` | Server grade for the final answer. |
| `helpShown` | Union of observed assistance, or unknown for old clients. |

Assistance names distinguish a manually opened hint, the automatic retry hint,
an opened gloss, a visible word bank and a first-letter mask. “Shown” does not
claim that the learner read or understood the assistance. Assistance revealed
after the final answer does not retroactively change that answer's record.

The fingerprint includes effective wording, answer pools, hints and revision.
This matters because prose overrides can currently change an item without
incrementing its revision number. A fingerprint identifies content; it does not
store recoverable wording or prove source, intended meaning or first teaching
chapter. The original item identifier remains on the existing attempt row.

## Boundaries and compatibility

- The browser hashes its local snapshot before sending; item text, keys and
  earlier raw answers are not added to the request, durable outbox or ledger.
  Digest failure leaves the displayed fingerprint unknown and still sends.
- The answer and observations are copied before asynchronous hashing. The
  existing owner-bound outbox retains the first submitted payload and identifier
  across retries; later replays must not rewrite the original history. The sender
  captures its page lifetime before hashing: a remount, even for the same owner,
  cannot revive that direct callback. The owner's separate queue drain can still
  replay the durable pending record.
- The nested history namespace is reserved in every mode. Other context fields
  remain intact, while only the server can supply the canonical history object.
- Old requests still work. Their displayed version, checks and assistance remain
  unknown in this contract, even if the legacy `hintUsed` column defaults false.
  Old rows are not backfilled with invented evidence.
- The ordinary hosts reset when effective vocabulary content changes, even if
  the item ID and revision stay unchanged. Identical new objects retain state.
- Preview uses the existing no-write sender. Games, listening, tests, assignments
  and other hosts have not been adapted to this observation contract.
- The database layout and existing save transaction are unchanged. No migration
  or production-data inspection is part of this slice.

## Open work, required before full stage-2 completion

1. **Unfinished exercises:** leaving after a wrong answer produces no terminal
   record. Capture each check through a separately designed history-only path;
   calling the existing points/review writer for each retry would alter learning
   and award semantics. Define session/check identity, ordering, offline replay,
   abandonment and ownership before wiring it.
2. **Other task modes:** inventory and adapt their distinct completion and hint
   semantics. Do not infer missing events or reuse a completed-card label for
   timers, self-report or formal assessment.
3. **Time and version policy:** current `createdAt` is persistence time, not
   answer time; outbox delivery order is not learner order. Display/current
   content mismatches are exposed, while grading behavior remains unchanged.
   A historical-content archive and mismatch handling need a separate contract.
4. **Confirmed persistence:** the existing partial-write/receipt defect and the
   review/path optimistic points display remain with GG under cgo-132. This
   metadata change neither fixes nor overrides that blocked decision. Full
   learning-history and production readiness cannot be declared from this slice.
5. **Meaning/source links:** source review must approve intended meanings and
   teaching references before history is joined to them. The remaining 7,373
   source cases, three unresolved source interpretations and the disputed
   “again” citation are still open; a matching spelling is insufficient.

Word help follows the missing history slices; the deliberate personal vocabulary
collection follows word help. The richer contexts, prerequisite checks, German
Year 1 support, reviewed illustration library and non-repeating student Activity
requirements remain in the parent programme.
