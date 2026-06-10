# 08 — Design Principles & Guardrails

The durable rules. **Non-negotiable. Re-read before every content change and every feature.** These are
the "design posts" — they also appear inline in `PASSOVER_PROMPT.md`.

1. **Source of truth = the MORE! 1–4 textbooks.** Every word, sentence, rule, and test format traces to
   the SB/WB transcripts, master vocab lists, check-ups, or Schularbeiten (`05`). No invented content.

2. **Grades 1–4 only. Drop 5B.** Level A1 → A2. Age-appropriate for ~10–14-year-olds. (Grades 5–8 are a
   separate app — never pull 5B/upper-grade material in.)

3. **Never show above-level vocabulary unglossed.** If a student-facing sentence (example, context,
   definition, hint, story line) uses a word the student hasn't met yet (per the cumulative unit word
   bank), gloss it inline on the same line: **`word (= deutsches Wort)`**.

4. **All student-facing German is informal "du."** Never "Sie/Ihnen/Ihr(e)" as address. ("sie" =
   she/they stays.)

5. **Answer-checking is forgiving and correct.** Accept every variant that is correct **in the
   sentence**; accept multiple valid phrasings; give **partial credit / half-XP** for near-synonyms or
   reasonable alternatives; **never** demand a verbatim citation form that makes the sentence
   ungrammatical.

6. **Translations are correct in both directions** and graded in the required direction with natural
   variants accepted.

7. **Student-facing surfaces carry zero meta/teacher-talk.** Rationale, answer keys, and pedagogy live
   in teacher-only views.

8. **Verify, don't trust.** No blind faith in imports or sub-agents. Generate → independent verify →
   deterministic validator → Koki spot-check. A broken item in front of a real child is the failure that
   matters.

9. **Bulletproof for students.** Never lose progress; fail gracefully; no dead ends; no unanswerable
   items; tested at class scale (~30 concurrent) before each go-live.

10. **Content is regenerable.** Author into a canonical source + validation gate, not hand-edited
    generated files. A re-run reproduces the corrected corpus, never re-introduces old bugs.

11. **Privacy + safety for minors.** Minimal PII (no student emails; nicknames + PIN), realName
    teacher-only, opt-in social/leaderboard, no third-party tracking. Keep it that way.
