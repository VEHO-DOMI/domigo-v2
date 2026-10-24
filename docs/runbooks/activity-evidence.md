# Activity vocabulary source evidence

**CODEX DRAFT — NOT CANON · IN REVIEW (cgo-151 / cgo-174).** This local content-pipeline command preserves the evidence behind historical Activity categories. It does not publish classifications, change games or tasks, infer meanings, record learning events, or infer a teacher decision. Explicit decisions from the reviewed repository file are now retained separately. The existing [vocabulary programme](vocabulary-program.md) and its GG release gates remain in force.

## Explicit local input

Supply a private JSON manifest containing exactly one data source for each year. Use neutral aliases, never a private filename or a person's name. Paths resolve relative to the manifest. Original data companions must be `.js`; audit and override inputs must be `.csv`; optional notes are `.md`, `.txt` or `.html`. Notes contribute fingerprints and byte sizes only: their prose is not copied or interpreted as decisions.

```json
{
  "schema": "activity-evidence-input@1",
  "sources": [
    {
      "grade": 1,
      "data": { "alias": "activity-year-1", "path": "year-1.js" },
      "audit": { "alias": "audit-year-1", "path": "year-1-audit.csv" },
      "overrides": { "alias": "overrides-year-1", "path": "year-1-overrides.csv" },
      "notes": [{ "alias": "notes-year-1", "path": "year-1-notes.md" }]
    },
    { "grade": 2, "data": { "alias": "activity-year-2", "path": "year-2.js" } },
    { "grade": 3, "data": { "alias": "activity-year-3", "path": "year-3.js" } },
    { "grade": 4, "data": { "alias": "activity-year-4", "path": "year-4.js" } }
  ]
}
```

Audit, overrides and notes are optional for every year; add them wherever actually supplied. The example's omissions do not claim that those years have no such material. The command never searches personal directories or downloads missing files.

```sh
pnpm content activity-evidence --manifest /local/activity-input.json --out /tmp/activity-evidence.json
pnpm content activity-evidence --manifest /local/activity-input.json --out /tmp/activity-evidence.json --verify
```

The first invocation refuses an existing output. Reports must be outside the repository, including when a directory shortcut points into it. `--verify` rebuilds from the supplied sources and current committed corpus, then requires exact report bytes; it never repairs or overwrites a changed report. Source and corpus files are checked again after capture, so a change during the import rejects the mixed snapshot. Every requested private input path is resolved again; a changed shortcut target is rejected even when the replacement has identical bytes. The original inputs are never written.

Private input paths, containing directories (except the filesystem root) and basenames are excluded from output metadata and error messages. If source text itself contains one of those locations, the import fails instead of silently redacting the evidence. Use a consciously prepared neutral source bundle for that case; this command does not prepare or approve one. The existing classification map's source paths are not serialized.

## What is preserved

The report schema is `activity-source-evidence@1`. It contains source fingerprints, original data rows, separately retained audit/override rows, current task observations and repository fingerprints. It is an offline review artifact, not `vocabulary-index@1` or a deployed word library.

- **Data rows:** exact logical `unit`, `w`, `g`, `cat` values, a one-based record number and physical start line. Duplicate rows remain distinct. Each source occurrence ID binds year, exact file fingerprint and record number; it is not a meaning ID. Original file bytes remain identified by their SHA-256 fingerprint; formatting and comments are not copied wholesale.
- **Audit rows:** exact header `unit,w,g,cat,confidence,justification`; decoded logical cells retain commas, escaped quotation marks and embedded line endings. Record numbers include the header; physical start/end lines are explicit. Confidence is preserved as high/medium/low or an empty source field. Ordered chapter/word/mode equality binds the table to the data rows; German differences remain visible in both originals. A differing pool is retained with null row bindings, not silently reordered or partially assigned.
- **Override inputs:** exact header `unit,w,cat`. An absent file is null; a supplied header-only file is `present-empty`; populated rows remain individually locatable and marked `unverified-source-input`. Conflicting or repeated rows survive. Exact chapter/word candidates do not establish that a teacher approved them or that they supersede the original category.
- **Notes:** neutral alias, fingerprint and byte count only. They remain separate source references. Proposed prose categories, including conflicting suggestions, never become executable rules through this import.
- **Current tasks:** all committed-overlay-effective task IDs, year/chapter, word, German gloss and a fingerprint of the parsed effective task. Saved classifications are separate observations with `present`, `missing` or `saved-word-differs` status. Exact English spelling proposes source candidates within the same year, including other chapters; unit and German equality are separate flags. There is no case folding, punctuation repair, synonym substitution or spelling-based deduplication. A stale saved word lends no mode-agreement claim to the current task.

All task meaning IDs and first-teaching fields remain null; verified meaning is false. Approved-mapping counts remain zero. The separate `approvedTeacherDecisions` count includes only explicit records whose task ID, word and German gloss still match. A stale record remains visible with `task-word-or-gloss-differs` status and is not counted as active approval. The input contract rejects extra authority fields. A high-confidence audit row, matching file fingerprint or matching translation does not change those limits.

The original JavaScript is parsed as syntax, never executed. Accepted files contain one literal `window.ACTIVITY_WORDS` array and optionally one literal `window.ACTIVITY_UNIT_TITLES` object. Executable row values, duplicate/unknown fields, later array mutations, unsupported assignments and malformed syntax are rejected. This parser does not attempt to evaluate an arbitrary HTML game or JavaScript application. The CSV parser rejects malformed quoting, unknown headers and inconsistent column counts instead of dropping records.

## Current mechanical import (confirmed 786-row Year-1 source)

The thirteen-file source packet has four data companions, three audit tables, three empty override inputs and three notes. The confirmed Year-1 source is commit `73a45b8c`, `activity/data/activity-words.js` in `VEHO-DOMI/1st-grade-vocab-trainer`, SHA-256 `1acc8dab7d81b319967fffa897e429dd2eaeade85ccfbc966f014fb9760241a2` (48,947 bytes). It replaces only the import's data input; the older 759-row file and its audit survive as historical evidence.

| Year | Original data rows | Audit rows | Effective tasks | Original classifications | Missing original classifications |
|---|---:|---:|---:|---:|---:|
| 1 | 786 | 759, different pool | 786 | 786 | 0 |
| 2 | 605 | absent | 611 | 604 | 7 |
| 3 | 599 | 599 | 599 | 599 | 0 |
| 4 | 443 | 443 | 450 | 446 | 4 |
| Total | 2,433 | 1,801 | 2,446 | 2,435 | 11 |

All four declared source hashes now match. Year 1's audit remains `different-pool`, with null row bindings; Years 3/4 retain ordered bindings and 15/10 German differences. The old Year-1 99-gloss comparison is not a comparison against the new source. Ten current tasks lack an exact word candidate anywhere in their year; thirteen lack one in the same chapter. No count certifies a unique meaning, first teaching or deployed availability.

The cgo-174 import also preserves fifteen current teacher decisions in their own columns, with zero stale decisions. It pins 60 committed files: 57 vocabulary files, the shared item overlay, the original Activity map and `teacher-decisions.json`. It reads no live Studio changes, reserve settings, accounts or production database. No meaning identity, illustration approval, overlapping mode assessment or meaning-based no-repeat rule is inferred.

Historical cgo-151 measurements (2,406 source rows, one hash mismatch, 84 tasks without an exact spelling candidate) remain in that archived report. They describe the older 759-row input and are not the current source status. A0 of cgo-164 restores the prior builder/checker scripts and masked manifests in the external cgo-153 evidence package; its original 34-record checker again rejects all 17 intentional mutations. Those historical checks do not approve current learner content.

## Verification and next authority boundary

Tests cover the synthetic calibration, duplicate spellings and source rows, differing glosses, multiline rationale, empty versus absent overrides, source-hash conflicts, missing categories, stale saved words and false approval fields. End-to-end command tests check exact regeneration, edited/omitted/duplicated evidence, input changes and redirected source/manifest/companion shortcuts during capture, private filename/directory suppression, existing-output refusal and a directory shortcut into the repository. Deliberately damaged inputs must fail.

The real thirteen-file import and byte-for-byte verification are mechanical evidence, not an extra semantic approval wave. The 7,373 outstanding appendix occurrences remain outstanding. GG owns source/edition dispositions and the separate outstanding booking repairs; cgo-172's explicit teacher decisions do not approve meaning mappings or learning-history persistence. Reviewed meaning identity must precede word help, personal collection links, per-meaning imagery and expanded no-repeat rules. Illustration suitability and quick drawing-game suitability remain separate future judgments, and explaining/acting/drawing may overlap after review.


## Explicit teacher decisions (cgo-174)

Koki approved all fifteen recommendations on cgo-172, Nachtrag 1, on 2026-10-24. The application reads fifteen category records from `apps/web/lib/activity/teacher-decisions.json`; the private source manifest cannot supply them. Each record requires task ID, exact word and German gloss snapshots, mode, author, date, ruling source and a note. Duplicate task IDs, unknown tasks, missing attribution or extra authority fields reject the import. This structural validation does not authenticate a human: the git-reviewed ruling is the authority boundary.

Each task has separate `teacherDecision` and `teacherDecisionStatus` columns. Original categories, source rows, audit rationales and unverified CSV overrides remain unchanged. The reviewed set yields fifteen active decisions, zero stale decisions and eleven still-missing **original** classifications; those eleven are filled by teacher decisions in the game catalog. The approval count does not mean fifteen new word meanings or source mappings were verified.

The catalog applies teacher decision > supplied saved classification > original map. There is currently no independent saved-override store in the server; its default is the existing original `categories.json`. A stale teacher snapshot excludes that task pending review instead of silently falling back. Catalog entries use task ID, preserving 2,446 tasks (786 / 611 / 599 / 450 by year), including the fourteen occurrences previously suppressed by spelling. Repeated copies of the same task ID still appear once. No teacher metadata is returned to the student view.

The fifteen ruling cases produce fifteen mode rows because midnight covers two task IDs, while **answer the door** is a source-locator correction only. Its U1/19 → U11/9 disposition is documented in the [decision dossier](../review/activity-decisions-2026-10.md#beschlussstand-2026-10-24); the transcription and its existing show category stay unchanged. Reference (Nachschlagewerk) and reference (Hinweis) remain distinct, and neither spelling equivalence nor Southern Ocean is automatically promoted into meaning identity or an answer pool. Game-wide meaning deduplication belongs to Activity v2, not this catalog repair.
