# Vocabulary learning history

**CODEX DRAFT — NOT CANON. Implementation evidence, not a deployment certificate.**

Review implementation: completed-card observations (cgo-143) and independent
ordinary-card checks (cgo-144). Neither label implies deployment. This supports
stage 2 of [the vocabulary programme](vocabulary-program.md).

**24 October 2026 status:** GG released the repaired cgo-145 transport at stack head
`7b6bb52e30fd19c58374431c8b5359ec1938adbe` (fix `64ce6480f946d4e02551b621a84702c997a17565`)
for the bounded cgo-147 implementation. The earlier IndexedDB/localStorage immutable
replay finding was corrected in that base; this slice changes neither store.
The completion/accounting finding remains a publication blocker assigned to
cgo-154. The stack is unmerged; no production migration or later vocabulary
feature is released here. Full battery: **UNVERIFIED, runs in the GG chain.**

Standalone `/tests/[slug]` now records exact `test:vocab` checks and completion
observations using those same adapters. Its actual UI stays carrier-only with
three checks and hidden hints; gloss can still be opened and recorded. Fresh
sections, tests and accounts do not reuse old card state. Duplicate terminal
callbacks for one visit are ignored. Other test sections and local Finish keep
their existing paths. See the eleven-group [acceptance contract](vocabulary-learning-surfaces.md#smallest-next-complete-slice-standalone-test-vocabulary).

## Two records, two purposes

Ordinary practice, daily rounds, review, study/journey and standalone test vocabulary cards still
conclude once: a non-wrong result, or the third wrong result. The existing
completion write carries the ordered browser observations. A separate
`vocabulary-check` request now records **each actual Check action**, including a
first wrong followed by leaving. It does not call `recordAttempt`, change points,
update streaks or schedule review. A check record is not a completion receipt.

| Record | Evidence | Authority and limits |
|---|---|---|
| `practice_attempts.context.vocabularyHistory` | `vocabulary-learning-history@1`, `completed-card-only`; asked direction, final server grade, displayed/current content identities and ordered browser-reported checks/help. | One existing completion, including optional `clientObservation.visitId`. Earlier grades in this summary remain browser claims. Existing completion-write limitations still apply. |
| `vocabulary_checks` | One separately server-graded check; owner/class, event/visit identifiers, check number/maximum, item/unit/year, source mode, direction, request fingerprint and structured evidence. | Server recalculates the submitted input using the current effective item and explicit direction. Browser grade/help/display identity remain labelled claims. No raw answer or task text in this table. |
| `vocabulary_visits` | First immutable item/direction/mode/max-check/display-revision header per owner/visit. | Conditional upsert rejects incompatible visit identities. A header without a check is provisional and never evidence of learning. |

The four directions are contextual sentence (`carrier`), definition, German to
English and English to German. One completed card can have several check rows;
analytics must not add those to completed-exercise or reward totals.

## Identity, help and content

The card creates a visit UUID on its first check and a distinct event UUID per
check. Check numbers preserve order even when delivery is 3, 1, 2. A visit with
only check 2 does not imply checks 1 or 3 were received. Completing an exercise
adds the visit ID to its existing observation, allowing a future scoped reader
to relate the two records; this slice does not add that reader or a history UI.

Help distinguishes manual hint, automatic retry hint, opened gloss, visible word
bank and first-letter mask. Only help already shown when checking is recorded.
“Shown” does not prove it was read or understood. Browser-reported completion
means the reported tier was non-wrong or the maximum check count was reached;
it is not a server-certified completion, abandonment or mastery decision.

Both records identify displayed and server-graded content with revision and
SHA-256 fingerprint. The fingerprint includes effective wording, answer pools,
hints and revision, so same-revision prose overrides remain distinguishable.
`contentMatch` is true, false or unknown; it compares a browser claim with the
server item, not an attestation of what appeared on screen. A fingerprint does
not preserve recoverable wording, prove meaning/source/first teaching, or resolve
mismatched historical grading. Old rows are never backfilled with invented data.

For individual checks the browser prepares the fingerprint while the card is
visible. A click before completion or a digest failure sends an explicit null;
saving the check never waits for hashing. A first unknown visit-header hash stays
unknown. Later check-level hashes remain separate claims; an unknown header does
not certify identical wording throughout the visit. Effective content, direction
or presentation changes reset the card. Identical new objects do not.

## Time, replay and failures

- `client_checked_at` is the device's reported check time, nullable and untrusted.
- `received_at` is the server arrival time of the first successfully saved request.
- `recorded_at` is its database insertion time. Arrival order is not learner order;
  visit/check number is the within-visit sequence. No global activity chronology
  is inferred from untrusted device clocks.
- First saved payload wins. Unique owner/event and owner/visit/check keys prevent
  duplication. Identical logical checks under a new transport ID return the
  original receipt; conflicting content returns 409. Request identity excludes
  the transport ID and server's later content/time, so replay can acknowledge a
  saved check even after an item is changed, reserved or removed. Owner and class
  checks still precede that acknowledgement.
- The header and check are separate autocommit writes. An event-write failure may
  leave a provisional header; it never yields a successful check receipt. Retrying
  the same payload can recover. Tests exercise this failure and a lost acknowledgement.
- An invalid/unconfirmed response leaves the pending bytes for retry. Other-mode
  payloads cannot redirect into the new branch. Reserved or wrong-year new checks
  are refused. No automatic policy exception is introduced for old offline work.

## Pending device storage

Only history-check requests are staged synchronously in localStorage before the
click handler yields. This closes the immediate-document-reload window that an
asynchronous digest and IndexedDB-only write left open. The existing IndexedDB
outbox also stores the owned payload. GG repaired the earlier conflicting-copy
case in the released base. Drain combines the two pending stores,
deduplicates by owner/event key and removes both only after explicit server
confirmation. Staging does not imply server persistence or award points.

A pending request contains the raw input needed for later server grading, its
metadata and original account ID, but no full task snapshot or answer keys.
The server ledger retains a request digest rather than that raw input; the
digest is account-linked and is not anonymous. Privacy inventory/page and account
deletion cover the new records. A blocked/full device store is handled honestly:
IndexedDB remains a fallback, and if neither store works an offline save is not
claimed. Closing before that fallback commits can still lose an unconfirmed
check. Browser storage being cleared or unavailable cannot be made durable by
this client code.

Page changes do not transfer callbacks to a new page, even for the same owner.
The original owner's separate drain can replay their pending records later;
another account cannot adopt them. Teacher preview invokes no sender preparation
or writes. Existing completion requests keep their previous transport behaviour.

## Coverage and remaining work

Implemented hosts: `PracticeSession` (including daily, directions and choice
bank), `ReviewSession`, `PathPracticeNode` (study/journey/checkpoint), and standalone
`TestSession` (exact `test:vocab`, carrier only). This is not
coverage of every vocabulary surface. Current source inventory also finds:

- game cards: 2D dialogue and battle, detective, trip and novel;
- trainer modes: flashcards, speed, spelling, memory and word hunt;
- formal tasks: AssignmentRunner, CheckupRunner and separate assignment
  endpoint; their assessment/reservation and completion semantics must be retained;
- multiplayer/live/quiz routes with their own authoritative rounds;
- Studio previews, which deliberately write nothing.

Inventory and adapt remaining history semantics before claiming full stage 2.
Self-reported recall, selected options, timed rounds and formally submitted answers
must not be labelled as equivalent independent typed checks. No new source/meaning
join is inferred: the remaining 7,373 source cases, three unresolved interpretations
and disputed “again” citation are still open.

Migration 0026 is an additive PR artifact for two tables only, tested in local
synthetic PostgreSQL. No production migration was applied. Account deletion removes
both new tables; missing pre-migration tables remain compatible, other errors
propagate. Deployment order and multi-connection production concurrency remain
GG verification tasks. Full build, CI battery and visible performance are unverified
here: **Vollbatterie: UNVERIFIZIERT, läuft in der GG-Kette.**

The existing completion partial-write/receipt defect and optimistic review/path
points were dispositioned by GG under cgo-132 and assigned to cgo-154. This
independent history path neither repairs nor waives those release blockers. Word help follows missing history
slices; the personal collection follows word help. Rich multi-sentence contexts,
actual vocabulary/grammar prerequisites, Year 1 German support, reviewed images
and non-repeating student Activity remain in the parent programme.
