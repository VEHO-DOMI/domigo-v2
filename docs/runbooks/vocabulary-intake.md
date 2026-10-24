# Vocabulary appendix intake (P0)

**CODEX DRAFT — NOT CANON.** This tool produces review evidence before the July vocabulary-index contract is frozen. It neither publishes words nor changes grading, learner records, task content or the runtime.

Provide a local JSON manifest with exactly four `{ "grade": 1, "path": "/local/book-1.docx" }` entries, one for each year. Paths may be relative to the manifest. Keep that manifest out of Git: personal source directories are not report metadata. Use only the four textbook appendix word lists, never learner documents.

```
pnpm content vocabulary-intake --manifest /local/appendices.json --out /tmp/vocabulary-intake.json
pnpm content vocabulary-intake --manifest /local/appendices.json --out /tmp/vocabulary-intake.json --verify
```

The initial command refuses an existing output and any output within this repository. Verification recomputes the complete report from the explicit sources and current committed-file inputs, then requires byte equality. It does not rewrite a changed report. Source fingerprints, block/row locators, raw logical cells, corpus file fingerprints, reconciliation decisions and unresolved cases are retained. The existing DOCX reader trims text and omits empty paragraphs; “accounted for” refers to its logical blocks, not byte-for-byte XML round-tripping. Original-file SHA-256 fingerprints retain that distinction.

The current year-1 document has flattened paragraphs containing many word entries. These are preserved whole and quarantined: no guessed boundary is promoted to an entry. Years 2–4 have explicit Headword/Reference/German columns, with an optional Phonetics column. Known headings/notes/page markers are labelled metadata; unrecognised shapes, references and empty fields remain quarantined. Every input block/table row has exactly one disposition. A complete accounting is **not** a complete parsed index.

Matching only normalises case, Unicode and whitespace. It never strips `to`, optional words or inflections, merges senses, or treats two same-spelling entries as one word. Reference scope and an exact German-text match can establish an exact **textual join**; meaning remains unverified. Multiple same-scope candidates and duplicate source rows remain ambiguous. A prior-book code such as `MORE 1` retains an unknown unit. Standalone episode/section codes such as `OYW3` retain the exact code but require reference review; no unit is guessed. Unit codes outside the current course remain quarantined (including the excluded year-4 extra unit). An observed appendix code is not proof of first instruction or learner knowledge.

Bank/task coverage uses all 57 unit banks and the existing content pipeline's Git-overlay application. Missing/dropped, renamed and orphaned task IDs are visible. It does not inspect published Studio/database layers; live coverage is explicitly unverified. The existing temporary cross-unit lookup remains unchanged. No production `vocabulary-index@1` is introduced.

Review the quarantine and unmatched/reference-conflict/meaning-review/ambiguous groups before proposing a stable word record. Source reference corrections, curriculum introduction, semantic identities and sentence quality require their own evidence. A word occurring incidentally in a sentence must not automatically become taught vocabulary. The next slice resolves those source cases and prepares the representative calibration contract; personal saved words and adaptive mastery follow later.

Verification is included in the content-pipeline test suite. Tests cover prior-grade references, flattened paragraphs, duplicates/senses, source-row loss/alteration, unit linkage, deterministic regeneration, and an actual DOCX→CLI→artifact round trip with deliberate row removal. No database or network is needed.
