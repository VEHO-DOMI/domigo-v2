# Verify lens — translation — g2-u12 (round 2)

<!-- domigo:verify translation g2-u12 items=126cf838c1fb prompt=c6328b13b073 round=2 -->

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
| g2u12.w.backache | backache | Rückenschmerzen | backache (full) ; a backache (partial) | Rückenschmerzen (full) ; Rückenweh (full) ; Rückenschmerz (partial) |
| g2u12.w.bath | bath | Bad | bath (full) ; a bath (full) ; baths (partial) | Bad (full) ; Vollbad (partial) |
| g2u12.w.believe-me | Believe me! | Glaub mir! | Believe me! (full) ; Believe me (full) | Glaub mir! (full) ; Glaub mir (full) ; Glaube mir! (partial) |
| g2u12.w.blood | blood | Blut | blood (full) | Blut (full) ; das Blut (partial) |
| g2u12.w.cure | cure | Heilmittel | cure (full) ; a cure (full) ; cures (partial) | Heilmittel (full) ; Mittel (partial) ; Heilung (partial) |
| g2u12.w.dentist | dentist | Zahnarzt/Zahnärztin | dentist (full) ; a dentist (full) ; dentists (partial) | Zahnarzt (full) ; Zahnärztin (full) ; Zahnarzt/Zahnärztin (full) |
| g2u12.w.earache | earache | Ohrenschmerzen | earache (full) ; an earache (partial) | Ohrenschmerzen (full) ; Ohrenweh (full) ; Ohrenschmerz (partial) |
| g2u12.w.first-aid | first aid | Erste Hilfe | first aid (full) | Erste Hilfe (full) ; erste Hilfe (partial) |
| g2u12.w.headache | headache | Kopfschmerzen | headache (full) ; a headache (full) ; headaches (partial) | Kopfschmerzen (full) ; Kopfweh (full) ; Kopfschmerz (partial) |
| g2u12.w.helpful | helpful | hilfsbereit | helpful (full) | hilfsbereit (full) ; hilfreich (partial) |
| g2u12.w.horrible | horrible | schrecklich | horrible (full) | schrecklich (full) ; furchtbar (full) ; grauenhaft (partial) |
| g2u12.w.it-doesn-t-matter | It doesn't matter. | Das macht nichts | It doesn't matter. (full) ; It doesn't matter (full) ; It does not matter. (full) | Das macht nichts. (full) ; Das macht nichts (full) ; Egal. (full) ; Das ist egal. (partial) |
| g2u12.w.knee | knee | Knie | knee (full) ; knees (partial) | Knie (full) |
| g2u12.w.lamp-post | lamp post | Laternenmast | lamp post (full) ; a lamp post (full) ; lamppost (partial) | Laternenmast (full) ; Laterne (full) ; Straßenlaterne (full) |
| g2u12.w.medicine | medicine | Medizin | medicine (full) | Medizin (full) ; Arznei (full) ; Medikament (partial) |
| g2u12.w.memory | memory | Gedächtnis | memory (full) | Gedächtnis (full) ; Erinnerung (partial) |
| g2u12.w.pain-in-ankle | pain in ankle | Schmerzen im Knöchel | pain in ankle (full) ; pain in the ankle (full) ; a pain in the ankle (full) ; ankle pain (partial) | Schmerzen im Knöchel (full) ; Knöchelschmerzen (full) ; Schmerz im Knöchel (partial) |
| g2u12.w.patient | patient | Patient/Patientin | patient (full) ; a patient (full) ; patients (full) | Patient (full) ; Patientin (full) ; der Patient (partial) |
| g2u12.w.pupil | pupil | Schüler/Schülerin | pupil (full) ; a pupil (full) ; pupils (partial) | Schüler (full) ; Schülerin (full) ; Schüler/Schülerin (full) |
| g2u12.w.since | since | seit | since (full) | seit (full) |
| g2u12.w.smell | smell | Geruch | smell (full) | Geruch (full) ; der Geruch (partial) |
| g2u12.w.spoon | spoon | Löffel | spoon (full) ; a spoon (full) ; spoons (partial) | Löffel (full) ; der Löffel (partial) |
| g2u12.w.stomach-ache | stomach ache | Bauchschmerzen | stomach ache (full) ; stomachache (partial) | Bauchschmerzen (full) ; Bauchweh (full) ; Magenschmerzen (partial) |
| g2u12.w.taste | taste | Geschmack | taste (full) | Geschmack (full) ; der Geschmack (partial) |
| g2u12.w.throat | throat | Hals | throat (full) ; throats (partial) | Hals (full) ; Kehle (full) ; Rachen (partial) |
| g2u12.w.to-cure | to cure | heilen | cure (full) ; to cure (full) ; heal (partial) | heilen (full) ; gesund machen (full) ; kurieren (partial) |
| g2u12.w.to-injure | to injure | verletzen | injure (full) ; to injure (full) ; hurt (partial) | verletzen (full) ; sich verletzen (partial) |
| g2u12.w.to-mash | to mash | zerdrücken | mash (full) ; to mash (full) ; mashed (partial) | zerdrücken (full) ; zerstampfen (full) ; zerquetschen (partial) |
| g2u12.w.to-mix | to mix | vermischen | mix (full) ; to mix (full) ; mixed (partial) | vermischen (full) ; mischen (full) ; verrühren (partial) |
| g2u12.w.toothache | toothache | Zahnschmerzen | toothache (full) ; a toothache (partial) | Zahnschmerzen (full) ; Zahnweh (full) ; Zahnschmerz (partial) |
| g2u12.w.toothpaste | toothpaste | Zahnpasta | toothpaste (full) | Zahnpasta (full) ; Zahncreme (full) ; Zahnpaste (partial) |
| g2u12.w.worm | worm | Wurm | worm (full) ; a worm (full) ; worms (partial) | Wurm (full) ; der Wurm (partial) |
| g2u12.w.writer | writer | Schriftsteller/-in | writer (full) ; a writer (full) ; writers (partial) | Schriftsteller (full) ; Schriftstellerin (full) ; Autor (full) ; Autorin (full) |

## Grammar items (3 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g2u12.gi.present-perfect.tr.001 | translation | Er hat sich gerade das Bein gebrochen. [de] | He has just broken his leg. (full) ; He's just broken his leg. (full) | deToEn |
| g2u12.gi.present-perfect.tr.002 | translation | Ich habe gerade meine Schlüssel verloren. [de] | I have just lost my keys. (full) ; I've just lost my keys. (full) | deToEn |
| g2u12.gi.present-perfect.tr.003 | translation | I have just eaten too much. [en] | Ich habe gerade zu viel gegessen. (full) ; Ich hab gerade zu viel gegessen. (partial) | enToDe |

## Output contract

Write `content/corpus/units/g2-u12/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u12",
  "lens": "translation",
  "itemsHash": "126cf838c1fb",
  "promptHash": "c6328b13b073",
  "round": 2,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 36, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
