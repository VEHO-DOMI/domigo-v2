# 07 — Task / Item Format Catalog (the content-engine spec)

The formats the v2 content engine must support. **Carry forward** the v1 set (with the `04` fixes) and
**add** the new ones. For each format, document: data shape · render · grading (incl. **partial-credit
policy**) · which textbook/skill source it roots in.

## Carry forward (from v1; apply the `04` rules)
| Format | Data (key fields) | Grading |
|---|---|---|
| **gap-fill** | `p` with blank, `c`, `a[]` | exact + alternates + Levenshtein-close; answer must be grammatical in `p` |
| **multiple-choice** | `c`, `ds[]` distractors | exact (button) |
| **context-picker** | 4 sentences, `c` | exact (button) |
| **translation** (DE↔EN) | `p` source, `c`+`a[]` target | text match in the required **direction**; both languages verified correct |
| **error-correction** | sentence with a mistake, `c` | text + partial-match |
| **transformation** | source → `c` | text + partial-match |
| **question-formation** | statement → `c` question | text + partial-match |
| **free-form** | open prompt, `c`+`a[]` | text + partial-match |
| **sentence-building** | chips → `c` sentence | join + exact + close (no partial) |
| **matching** | `c` = `{"1":"b",…}` | order-independent map; **add per-pair partial credit** |
| **anagram** | `c` = target word | letter-tiles; exact/close |
| **group-sort** | `c` = `{group:["display|key",…]}` | per-item bucket correctness |
| **matching-pairs** | `c` = `[["a","b"],…]` | memory-match pairing |

**Cross-cutting fixes (from `04`/`08`):** add a **near-synonym / partial-credit** tier to all text
formats; ensure accepted-answer sets are complete and sentence-correct; glosses `(= …)` in any
student-facing sentence with an above-level word; du-not-Sie.

## Add for v2
### Listening (A1–A2; root in MORE! Test-Builder LC + `srdp-listening-comprehension` method)
- multiple-choice · true/false (± justification at A2) · gap / sentence-completion · matching
  speakers→statements · short-answer. Each item ties to an audio clip + (hidden) transcript.

### Reading comprehension (for Mock Tests; root in MORE! RC + `srdp-reading-comprehension`)
- multiple-choice · true/false · matching headings/sentences · short-answer / note-completion.

### Writing (for Mock Tests)
- prompt + word-count + rubric; teacher-graded; optional model-assisted feedback (no auto-score by
  default).

### Study-Path teaching cards (not graded)
- **vocab intro** card (word bank with audio/example) and **grammar intro** card (the unit structure
  taught with examples), preceding the graded practice for that node.

## Engine requirements
- One content schema that expresses all formats + per-unit word bank + level tags + gloss data.
- Grading returns a **status tier** (`correct` / `partial` / `close` / `wrong`) with XP weight per tier
  (full / half / half / none) and the accepted-answer rationale (for feedback, teacher-side only).
- Every machine-checkable format has a deterministic validator (`04`).
