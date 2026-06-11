# Runbook — word-bank review loop (thorough, Fable-performed)

> **CAMPAIGN COMPLETED 2026-06-11** — 57/57 units `wordbank_approved` across PRs
> [#5](https://github.com/VEHO-DOMI/domigo-v2/pull/5) (pilot g2-u03 + core allowlist),
> [#6](https://github.com/VEHO-DOMI/domigo-v2/pull/6) (wave G2) and
> [#7](https://github.com/VEHO-DOMI/domigo-v2/pull/7) (waves G1+G3+G4). ~25 independent lens agents;
> every verdict + audit trail lives in `content/corpus/units/*/review/` (flags.json, reviewed.json,
> state.json). Headline finds: MORE!-4 master-list u8/9 phrase-table swap (fixed via section-aware
> parse remap), one publisher typo overlay-patched, 28 allowlist tokens rejected on evidence.
> This runbook STAYS LIVE: any approved bank that drifts (V-A red) re-enters the loop as a round-2
> diff review. The same machinery is reused for item review (stage 8) and story-chapter review.

**Delegation (Koki, 2026-06-11):** the thorough word-bank review is performed by Fable itself, in
waves, with every verdict committed as an auditable artifact. Koki receives a per-wave digest of all
judgment calls (veto possible any time; nothing is student-facing for months). This delegation
covers **word banks only** — item review ownership (pipeline stage 8) is decided when we get there.

## The loop, per unit

```
content wordbank                  # stage-2 drafts (already done for all 57)
content review-doc --wordbank --unit g2-u03
   → content/corpus/units/g2-u03/review/wordbank.review.md   (full table + evidence flags)
   → state: wordbank_review

[adversarial review — see protocol below: verdicts + cell edits go INTO the doc]

content ingest-review --wordbank --unit g2-u03 [--dry-run]
   → cell diffs  → content/overlays/parse-fixes.json (regenerable, guardrail 10)
   → drop/add    → overlays + ids.lock (overlay: keys, tombstone-proof)
   → re-runs the grade's wordbank stage, verifies consequences landed
   → review/wordbank.flags.json + wordbank.reviewed.json (audit)
   → state: wordbank_approved (by: fable) | changes_requested

content validate                  # V-A..V-E must stay green (CI enforces on the PR)
```

Round 2+: regenerated docs collapse reviewed-and-unchanged rows; only changed rows and reopened
flags are presented. A stale doc (bank hash moved) is refused by ingest — regenerate it.

## Adversarial review protocol (no agent reviews its own parse)

The deterministic pre-pass supplies evidence (flags); independent lenses author the verdicts:

- **Lens A — source fidelity:** reads the unit's section of the committed master-list TEXT
  (`content/build/transcripts/g<N>/master-vocabulary-list.txt`), not the JSON, and checks every
  table row against it verbatim (en/de/example; splits; nothing missed or invented). The totals
  checksum guards counts; this lens guards content.
- **Lens B — German + forms:** de[] splits sensible, orthography/NFC, multi-sense splits, cf/forms
  right for the level gate (plurals, particles, abbreviations).
- **Lens C — cross-source adjudication:** every flag verdict with evidence cited in `> note:` —
  v1-missing → `add` (recover, textbook-traceable) vs `ok` (v1 invention, leave out); tracing
  misses; duplicates.
- **No-flag sweep:** one full-table read per unit, so heuristic silence is never trusted.
- An agent may NOT approve a unit whose validator is red or whose source hash drifted.

## Verdict grammar (inside the review doc)

- Per flag: `> verdict: ok | drop | fix | add` (menu shown per flag) + `> note: <evidence>`.
  `fix` requires a note and forces `changes_requested`.
- Unit: `> unit: ok | changes` + optional note. `ok` requires every flag answered, none `fix`.
- Wrong cell values are fixed by editing the **de / example / forms** cell directly (` ; ` separates
  multi-values). `ref`/`en` are immutable; row deletion is a hard error (use `drop`).

## CI gates (content-validate)

V-A approved hash == current bank (drift = red → forces re-review) · V-B approved units carry a
complete, fix-free flags record + reviewed rows · V-C v1 parity per grade with explicit waivers
(enforced once the grade is fully approved; informational before) · V-D overlay integrity ·
V-E live review docs regenerate byte-identically (verdict lines aside).

## Waves

pilot **g2-u03** (+ core-allowlist review) → **G2** complete → **G1** → **G3** → **G4**.
Each wave lands as its own PR (review docs, flags, overlays, state transitions all committed) and
ends with a digest to Koki: counts, every judgment call with one-line reasoning, and anything
genuinely ambiguous in the source highlighted for optional veto.
