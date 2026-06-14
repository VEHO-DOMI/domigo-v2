# Verify lens — translation — g2-u15 (round 1)

<!-- domigo:verify translation g2-u15 items=cd275e120ce2 prompt=c6328b13b073 round=1 -->

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

## Vocab items (24)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g2u15.w.antarctic-ocean | Antarctic Ocean | Antarktischer Ozean | Antarctic Ocean (full) | Antarktischer Ozean (full) ; der Antarktische Ozean (full) |
| g2u15.w.cage | cage | Käfig | cage (full) | Käfig (full) ; der Käfig (full) |
| g2u15.w.emperor-penguin | emperor penguin | Kaiserpinguin | emperor penguin (full) | Kaiserpinguin (full) ; der Kaiserpinguin (full) |
| g2u15.w.litter-tray | litter tray | Katzenklo | litter tray (full) | Katzenklo (full) ; das Katzenklo (full) |
| g2u15.w.neither-do-i | Neither do I. | Ich auch nicht. | Neither do I. (full) | Ich auch nicht. (full) |
| g2u15.w.pyjamas | pyjamas | Pyjama | pyjamas (full) | Pyjama (full) ; Schlafanzug (full) ; der Schlafanzug (full) |
| g2u15.w.sand | sand | Sand | sand (full) | Sand (full) ; der Sand (full) |
| g2u15.w.so-do-i | So do I. | Ich auch. | So do I. (full) | Ich auch. (full) |
| g2u15.w.space | space | Platz | space (full) ; room (partial) | Platz (full) ; Raum (full) ; der Platz (full) |
| g2u15.w.to-brush | to brush | bürsten | to brush (full) ; brush (full) | bürsten (full) ; kämmen (partial) |
| g2u15.w.to-clean-out-the-litter-tray | to clean out the litter tray | das Katzenklo sauber machen | to clean out the litter tray (full) ; clean out the litter tray (full) | das Katzenklo sauber machen (full) ; das Katzenklo säubern (full) |
| g2u15.w.to-clean-out-your-pet-s-cage | to clean out your pet's cage | den Käfig deines Haustieres säubern | to clean out your pet's cage (full) ; clean out your pet's cage (full) | den Käfig deines Haustieres säubern (full) ; den Käfig deines Haustiers sauber machen (full) |
| g2u15.w.to-dry-your-pet | to dry your pet | dein Haustier abtrocknen | to dry your pet (full) ; dry your pet (full) | dein Haustier abtrocknen (full) ; das Haustier abtrocknen (full) ; dein Haustier trocknen (partial) |
| g2u15.w.to-feed-your-pet | to feed your pet | dein Haustier füttern | to feed your pet (full) ; feed your pet (full) | dein Haustier füttern (full) ; dein Haustier füttern (full) ; das Haustier füttern (full) |
| g2u15.w.to-give-your-pet-a-bath | to give your pet a bath | dein Haustier baden | to give your pet a bath (full) ; give your pet a bath (full) | dein Haustier baden (full) ; das Haustier baden (full) |
| g2u15.w.to-have-got-a-fear-of | to have got a fear of | Angst haben vor | to have got a fear of (full) ; have got a fear of (full) ; to be scared of (partial) | Angst haben vor (full) ; Angst vor etwas haben (full) |
| g2u15.w.to-keep-sb-company | to keep sb. company | jdm. Gesellschaft leisten | to keep sb. company (full) ; keep somebody company (full) | jemandem Gesellschaft leisten (full) ; jdm. Gesellschaft leisten (full) |
| g2u15.w.to-play-with-your-pet | to play with your pet | mit deinem Haustier spielen | to play with your pet (full) ; play with your pet (full) | mit deinem Haustier spielen (full) ; mit dem Haustier spielen (full) |
| g2u15.w.to-release | to release | frei lassen | to release (full) ; release (full) ; to free (partial) | frei lassen (full) ; freilassen (full) ; befreien (partial) |
| g2u15.w.to-stroke | to stroke | streicheln | to stroke (full) ; stroke (full) | streicheln (full) |
| g2u15.w.to-take-your-pet-to-the-vet | to take your pet to the vet | dein Haustier zum Tierarzt bringen | to take your pet to the vet (full) ; take your pet to the vet (full) | dein Haustier zum Tierarzt bringen (full) ; das Haustier zum Tierarzt bringen (full) |
| g2u15.w.to-tidy | to tidy (up) | aufräumen | to tidy (full) ; to tidy up (full) ; tidy up (full) | aufräumen (full) |
| g2u15.w.to-walk-your-pet | to walk your pet | mit deinem Haustier spazieren gehen | to walk your pet (full) ; walk your pet (full) | mit deinem Haustier spazieren gehen (full) ; mit dem Hund spazieren gehen (full) ; den Hund ausführen (partial) |
| g2u15.w.vet | vet (veterinarian) | Tierarzt/Tierärztin | vet (full) ; veterinarian (full) | Tierarzt (full) ; Tierärztin (full) ; der Tierarzt (full) |

## Grammar items (2 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g2u15.gi.so-do-i.tr.001 | translation | "Ich mag Musik." — "Ich auch." [de] | "I like music." — "So do I." (full) ; I like music. So do I. (full) ; I love music. So do I. (partial) | deToEn |
| g2u15.gi.so-do-i.tr.002 | translation | "Ich kann nicht kochen." — "Ich auch nicht." [de] | "I can't cook." — "Neither can I." (full) ; I can't cook. Neither can I. (full) ; I cannot cook. Neither can I. (partial) | deToEn |

## Output contract

Write `content/corpus/units/g2-u15/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u15",
  "lens": "translation",
  "itemsHash": "cd275e120ce2",
  "promptHash": "c6328b13b073",
  "round": 1,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 26, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
