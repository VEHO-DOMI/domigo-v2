# Verify lens — translation — g4-u11 (round 1)

<!-- domigo:verify translation g4-u11 items=d9ef7a770bad prompt=c6328b13b073 round=1 -->

<!-- domigo:prompt verify-translation v=1 -->
# Lens 3 — translation, both directions (adversarial)

You are an independent, adversarial verifier and a bilingual DE/EN speaker (Austrian
German). You did NOT write these items. For every translation surface (vocab items'
`translation.deToEn` AND `translation.enToDe`; grammar items with format
`translation`):

1. **Meaning:** does each full-tier answer actually translate the prompt — register,
   number, tense, particles included? ("(sich) fürchten (vor)" ↔ "to fear", not
   "to frighten".)
2. **Direction:** is the language of prompt and answers consistent with the declared
   direction? (kind `translation-direction`)
3. **Completeness in BOTH directions:** German has synonyms too — would a student's
   natural "Ich habe Angst vor…" be accepted where defensible (partial), or wrongly
   marked wrong? English side likewise.
4. **Naturalness:** stilted or word-by-word renderings that no Austrian teenager would
   say = `translation-unnatural` (usually warn; fix when actively misteaching).
5. **du-form:** German prompts/answers address the student informally.

Flag kind menu: `translation-meaning`, `translation-direction`,
`translation-unnatural`. Severity `fix` when a correct student answer would be
rejected or a wrong meaning taught; `warn` otherwise. Cite the exact text in every
note.

## Vocab items (33)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g4u11.w.answer-the-door | answer the door | an die Tür gehen | answer the door (full) | an die Tür gehen (full) ; die Tür aufmachen (full) ; jemanden hereinbitten (partial) |
| g4u11.w.anthology | anthology | Anthologie | anthology (full) ; collection (partial) | Anthologie (full) ; Sammlung (full) |
| g4u11.w.biography | biography | Biografie | biography (full) ; life story (partial) | Biografie (full) ; die Biografie (full) |
| g4u11.w.blurb | blurb | Klappentext | blurb (full) | Klappentext (full) ; der Klappentext (full) |
| g4u11.w.book-review | book review | Buchrezension | book review (full) | Buchrezension (full) ; die Buchrezension (full) ; Buchkritik (partial) |
| g4u11.w.classics | Classics | Klassiker | Classics (full) ; classics (full) | Klassiker (full) ; die Klassiker (full) |
| g4u11.w.clear-up | clear up | aufräumen | clear up (full) ; tidy up (partial) | aufräumen (full) |
| g4u11.w.comic | comic | Comic | comic (full) ; comic book (partial) | Comic (full) ; der Comic (full) |
| g4u11.w.dictionary | dictionary | Wörterbuch | dictionary (full) | Wörterbuch (full) ; das Wörterbuch (full) |
| g4u11.w.disappointment | disappointment | Enttäuschung | disappointment (full) | Enttäuschung (full) ; die Enttäuschung (full) |
| g4u11.w.fairy | fairy | Fee | fairy (full) | Fee (full) ; die Fee (full) |
| g4u11.w.fence | fence | Zaun | fence (full) | Zaun (full) ; der Zaun (full) |
| g4u11.w.fiction | Fiction | Belletristik | Fiction (full) ; fiction (full) | Belletristik (full) ; Fiktion (full) |
| g4u11.w.goggles | goggles | Schwimmbrille | goggles (full) | Schwimmbrille (full) ; Schutzbrille (full) ; die Schwimmbrille (full) |
| g4u11.w.historical-novel | historical novel | historischer Roman | historical novel (full) | historischer Roman (full) ; der historische Roman (full) |
| g4u11.w.innocent | innocent | unschuldig | innocent (full) | unschuldig (full) |
| g4u11.w.kilt | kilt | Kilt | kilt (full) | Kilt (full) ; Schottenrock (full) ; der Kilt (full) |
| g4u11.w.millionaire | millionaire | Millionär/in | millionaire (full) | Millionär/in (full) ; Millionär (full) ; Millionärin (full) |
| g4u11.w.non-fiction | Non-fiction | Sachbücher | Non-fiction (full) ; non-fiction (full) | Sachbücher (full) ; Sachbuch (partial) |
| g4u11.w.novel | novel | Roman | novel (full) | Roman (full) ; der Roman (full) |
| g4u11.w.obey | obey | befolgen | obey (full) | befolgen (full) ; gehorchen (full) |
| g4u11.w.play | play | Theaterstück | play (full) ; stage play (partial) | Theaterstück (full) ; das Theaterstück (full) ; Stück (partial) |
| g4u11.w.poetry | Poetry | Lyrik | Poetry (full) ; poetry (full) ; Lyrik (partial) | Lyrik (full) |
| g4u11.w.prefer | prefer | bevorzugen | prefer (full) ; like better (partial) | bevorzugen (full) ; lieber mögen (full) |
| g4u11.w.reference | Reference | Nachschlagewerk | Reference (full) ; reference (full) | Nachschlagewerk (full) ; das Nachschlagewerk (full) |
| g4u11.w.reference-2 | reference | Hinweis | reference (full) ; references (full) | Hinweis (full) ; Bezug (full) ; Anspielung (partial) |
| g4u11.w.scratch | scratch | kratzen | scratch (full) | kratzen (full) |
| g4u11.w.screenplay | screenplay | Drehbuch | screenplay (full) | Drehbuch (full) ; das Drehbuch (full) |
| g4u11.w.short-story | short story | Kurzgeschichte | short story (full) | Kurzgeschichte (full) ; die Kurzgeschichte (full) |
| g4u11.w.sort-oneself-out | sort oneself out | sich ordnen | sort oneself out (full) | sich ordnen (full) ; zu sich selbst finden (full) ; sich sortieren (partial) |
| g4u11.w.spot-of-bother | spot of bother | Ärger | spot of bother (full) | Ärger (full) ; Problem (full) ; Schwierigkeiten (partial) |
| g4u11.w.trilogy | trilogy | Trilogie | trilogy (full) | Trilogie (full) ; die Trilogie (full) |
| g4u11.w.wee | wee | klein | wee (full) ; tiny (partial) | klein (full) ; winzig (full) |

## Grammar items (5 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g4u11.gi.reflexive-pronouns.tr.001 | translation | Er hat sich beim Fußballspielen verletzt. [de] | He hurt himself while playing football. (full) ; He hurt himself playing football. (full) | deToEn |
| g4u11.gi.reflexive-pronouns.tr.002 | translation | Pass auf mit dem Messer! Schneide dich nicht! [de] | Be careful with the knife! Don't cut yourself! (full) ; Be careful with the knife! Don't cut yourself. (full) | deToEn |
| g4u11.gi.reflexive-pronouns.tr.003 | translation | Wir haben die Bücher selbst gekauft. [de] | We bought the books ourselves. (full) ; We bought the books by ourselves. (partial) | deToEn |
| g4u11.gi.reflexive-pronouns.tr.004 | translation | Ich kann mich nicht an seinen Namen erinnern. [de] | I can't remember his name. (full) ; I cannot remember his name. (full) | deToEn |
| g4u11.gi.reflexive-pronouns.tr.005 | translation | Du musst das Buch selbst lesen. [de] | You have to read the book yourself. (full) ; You will have to read the book yourself. (full) ; You must read the book yourself. (partial) | deToEn |

## Output contract

Write `content/corpus/units/g4-u11/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g4-u11",
  "lens": "translation",
  "itemsHash": "d9ef7a770bad",
  "promptHash": "c6328b13b073",
  "round": 1,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 38, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
