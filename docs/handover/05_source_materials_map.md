# 05 — Source Materials Map (root everything here)

Everything in DomiGo must trace to the **original MORE! 1–4 textbooks** and Koki's real classroom
materials. They are rich and complete. All paths are under
`…/Library/Mobile Documents/com~apple~CloudDocs/Domi Gym/Domi Gym 2025:26/` unless noted.
**Folder names contain spaces, apostrophes, and trailing spaces — quote them.** Most are `.docx`
(read with the `docx`/`pdf` skills or `textutil`).

## Per-grade (SB = Student's Book, WB = Workbook)
### MORE! 1 (Grade 1 / m1) — `1ABC (2025:26)/MORE 1/`
- `MORE 1 SB FULL.docx` (whole SB), `MORE 1 SB Transcription/` (18 per-unit `.docx` incl. Intro +
  **Grammar Appendix** + `SB More 1 Wordlist Full.docx`), `MORE 1 WB Transcription/` (17 incl. Answer
  Key), `MORE1_Master_Vocabulary_List_Units_1-15.docx`, `MORE1 SB Screenshots/` (147 page images).

### MORE! 2 (Grade 2 / m2) — `2A (2025:26)/`
- `MORE 2 Materials & Resources/MORE 2 TRANSCRIPT/` (30 = SB+WB Units 1-15),
  `Full Vocabulary List MORE 2 Units 1-15.docx`. Per-unit folders + **Check-ups** in
  `Units MORE 2 (2025:26)/`. Past tests in `2A Schularbeiten (2025:26)/` (4 SAs + archive).
  Backup transcript copy: `Claude/HTML Examples/MORE 2 TRANSCRIPT/`. Vocab flashcard HTML in
  `2A Misc/MORE 2 Activity CARDS PRINT/`.

### MORE! 3 (Grade 3 / m3) — `3A (2025:26)/`
- `MORE 3 Materials & Resources/MORE 3 NEW EDITION/MORE Transcript SB & WB Units/` (28 = SB+WB Units
  1-14), `Full Vocabulary List MORE 3 Units 1-14.docx`. Per-unit folders + Check-ups in
  `Units MORE 3 (2025:26)/`. Tests in `3A Schularbeiten (2025:26)/`. `MORE 3 Task Library/` +
  `MORE 3 Test builder materials/` (incl. audio). (`MORE 3 ALT/` = older edition, reference only.)

### MORE! 4 (Grade 4 / m4) — `4B (2025:26)/`
- `MORE 4 Materials & Resources/MORE 4 AKTUELLE EDITION/MORE 4 Transcript SB & WB Units/` (28 = SB+WB
  Units 1-13), `Full Vocabulary List MORE 4 Units 1-13.docx`. Per-unit folders + Check-ups in
  `Units MORE 4 (2025:26)/`. Tests in `4B Schularbeiten (2025:26)/`. `MORE 4 Task Library/` +
  `MORE 4 Test builder materials/` (incl. audio).

## By material type
- **Master vocab lists** (one `.docx` per grade, above) → the canonical word source for the **word
  banks** (`06`/`3.1`) and the level gate (`04`).
- **SB/WB transcripts** → example sentences, grammar, contexts (textbook-faithful).
- **Check-ups** (per unit, per grade) → formative-quiz + Study-Path checkpoint source.
- **Schularbeiten** (4 per grade per year + multi-year archives, each with TestBuilder Vocab / Grammar /
  LC / RC / Writing subsections) → **Mock Test** mode source (`06`/`3.5`); real exam formats.
- **Test-Builder audio** (per grade) → **Listening** source (`06`/`3.6`); check usage rights vs. TTS.
- **Vocabulary framework:** `EFL Allgemein/Vocabulary instructions_traffic light.pdf` — Koki's
  traffic-light vocab-learning method (informs level tagging / study design).

## Code-side references
- **Legacy behavior/parity oracle:** `Claude/Cowork Space/Claude Code/{1,2,3,4}*-grade-vocab-trainer/
  index.html` (the apps DomiGo replaced) + the v1 repo. `DOMIGO.md` sits beside the project.
- **Original roadmap & prior handovers:** `~/.claude/plans/` — `domigo-D14-tasks-and-handover.md`
  (item-type data shapes + the task briefs), `SESSION_HANDOVER_PHASE_D.md`, `phase-d-feature-port.md`,
  `handover-next-zazzy-scott.md` (Phases A–C migration plan).

## Skills to lean on (Anthropic skills already in Koki's environment)
- `srdp-listening-comprehension` (B1/B1+) — the **methodology** for building listening tasks from a
  transcript; level it down to A1–A2 + MORE! formats (`06`/`3.6`).
- `efl-checkup-generator`, `srdp-reading-comprehension`, `srdp-language-in-use` — format references for
  check-ups / RC / language-in-use that map onto MORE! Test-Builder.
- `textbook-transcription`, `docx`, `pdf` — to read/convert the source `.docx`/`.pdf`/screenshots.
