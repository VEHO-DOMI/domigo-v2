# Verify lens — translation — g4-u04 (round 1)

<!-- domigo:verify translation g4-u04 items=bd4bc1a2ccf2 prompt=c6328b13b073 round=1 -->

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

## Vocab items (45)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g4u04.w.accountant | accountant | Buchhalter/in | accountant (full) ; an accountant (full) | Buchhalter (full) ; Buchhalterin (full) ; Buchhalter/in (full) |
| g4u04.w.advice | advice | Ratschlag | advice (full) | Ratschlag (full) ; Rat (full) ; Tipp (partial) |
| g4u04.w.ambition | ambition | Ehrgeiz | ambition (full) | Ehrgeiz (full) ; großes Ziel (partial) |
| g4u04.w.be-keen-on | be keen on | von etw. begeistert sein | be keen on (full) ; keen on (full) | von etwas begeistert sein (full) ; scharf auf etwas sein (partial) ; auf etwas stehen (partial) |
| g4u04.w.be-responsible-for | be responsible for | für etw. verantwortlich sein | be responsible for (full) ; responsible for (full) | für etwas verantwortlich sein (full) ; verantwortlich sein für (full) ; zuständig sein für (partial) |
| g4u04.w.bonus | bonus | Prämie | bonus (full) | Prämie (full) ; Bonus (full) ; Zulage (full) |
| g4u04.w.career | career | Karriere | career (full) | Karriere (full) ; Berufslaufbahn (full) ; Laufbahn (partial) |
| g4u04.w.casual | casual | lässig | casual (full) | lässig (full) ; locker (full) ; leger (partial) |
| g4u04.w.company | company | Firma | company (full) | Firma (full) ; Unternehmen (full) ; Betrieb (partial) |
| g4u04.w.computing | computing | Computerwesen | computing (full) | Computerwesen (full) ; Datenverarbeitung (full) ; Informatik (partial) |
| g4u04.w.computing-2 | computing | Datenverarbeitung | computing (full) | Datenverarbeitung (full) ; Computerwesen (full) ; Informatik (partial) |
| g4u04.w.confidently | confidently | selbstbewusst | confidently (full) | selbstbewusst (full) ; selbstsicher (full) |
| g4u04.w.deadline | deadline | Abgabetermin | deadline (full) | Abgabetermin (full) ; Frist (full) ; Termin (partial) |
| g4u04.w.deserve | deserve | verdienen | deserve (full) ; to deserve (full) ; deserved (partial) | verdienen (full) ; es verdienen (full) |
| g4u04.w.develop | develop | entwickeln | develop (full) ; to develop (full) | entwickeln (full) |
| g4u04.w.earn | earn | verdienen | earn (full) ; to earn (full) | verdienen (full) ; Geld verdienen (full) |
| g4u04.w.electrician | electrician | Elektriker/in | electrician (full) ; an electrician (full) | Elektriker (full) ; Elektrikerin (full) ; Elektriker/in (full) |
| g4u04.w.employer | employer | Arbeitgeber/in | employer (full) | Arbeitgeber (full) ; Arbeitgeberin (full) ; Arbeitgeber/in (full) |
| g4u04.w.enthusiastic | enthusiastic | begeistert | enthusiastic (full) | begeistert (full) ; enthusiastisch (full) |
| g4u04.w.eye-contact | eye contact | Augenkontakt | eye contact (full) | Augenkontakt (full) ; Blickkontakt (full) |
| g4u04.w.female | female | weiblich | female (full) | weiblich (full) |
| g4u04.w.finance | finance | Finanzwesen | finance (full) | Finanzwesen (full) ; Finanzen (full) |
| g4u04.w.finance-2 | finance | Finanzwesen | finance (full) | Finanzwesen (full) ; Finanzen (full) |
| g4u04.w.flight-attendant | flight attendant | Flugbegleiter/in | flight attendant (full) ; a flight attendant (full) | Flugbegleiter (full) ; Flugbegleiterin (full) ; Flugbegleiter/in (full) ; Steward (partial) ; Stewardess (partial) |
| g4u04.w.health-care | health care | Gesundheitswesen | health care (full) ; healthcare (full) | Gesundheitswesen (full) ; Gesundheitsbereich (partial) |
| g4u04.w.health-care-2 | health care | Gesundheitswesen | health care (full) ; healthcare (full) | Gesundheitswesen (full) ; Gesundheitsbereich (partial) |
| g4u04.w.interview | (job) interview | Vorstellungsgespräch | job interview (full) ; interview (full) | Vorstellungsgespräch (full) ; Bewerbungsgespräch (full) |
| g4u04.w.journalism | journalism | Journalismus | journalism (full) | Journalismus (full) |
| g4u04.w.launch | launch | auf den Markt bringen | launch (full) ; to launch (full) | auf den Markt bringen (full) ; einführen (full) ; herausbringen (partial) |
| g4u04.w.male | male | männlich | male (full) | männlich (full) |
| g4u04.w.marketing | marketing | Marketing | marketing (full) | Marketing (full) ; Vermarktung (partial) |
| g4u04.w.mechanic | mechanic | Mechaniker/in | mechanic (full) ; a mechanic (full) | Mechaniker (full) ; Mechanikerin (full) ; Mechaniker/in (full) ; Automechaniker (partial) |
| g4u04.w.memorise | memorise | sich einprägen | memorise (full) ; memorize (full) | sich einprägen (full) ; auswendig lernen (full) |
| g4u04.w.naturally | naturally | natürlich | naturally (full) | natürlich (full) ; ganz natürlich (full) |
| g4u04.w.nurse | nurse | Krankenpfleger/in | nurse (full) ; a nurse (full) | Krankenpfleger (full) ; Krankenpflegerin (full) ; Krankenschwester (full) ; Krankenpfleger/in (full) |
| g4u04.w.pros-and-cons | pros and cons | Vor- und Nachteile | pros and cons (full) | Vor- und Nachteile (full) |
| g4u04.w.receptionist | receptionist | Rezeptionist/in | receptionist (full) ; a receptionist (full) | Rezeptionist (full) ; Rezeptionistin (full) ; Rezeptionist/in (full) ; Empfangsdame (partial) |
| g4u04.w.salary | salary | Gehalt | salary (full) | Gehalt (full) ; Lohn (partial) |
| g4u04.w.sales-and-marketing | sales and marketing | Verkauf und Marketing | sales and marketing (full) | Verkauf und Marketing (full) |
| g4u04.w.satisfaction | satisfaction | Zufriedenheit | satisfaction (full) | Zufriedenheit (full) ; Genugtuung (full) |
| g4u04.w.secretary | secretary | Sekretär/in | secretary (full) ; a secretary (full) | Sekretär (full) ; Sekretärin (full) ; Sekretär/in (full) |
| g4u04.w.skills | skills | Fähigkeiten | skills (full) | Fähigkeiten (full) ; Können (partial) |
| g4u04.w.think-up | think up | ausdenken | think up (full) ; to think up (full) | ausdenken (full) ; sich ausdenken (full) ; erfinden (full) |
| g4u04.w.unemployed | unemployed | arbeitslos | unemployed (full) | arbeitslos (full) |
| g4u04.w.working-hours | working hours | Arbeitszeit | working hours (full) | Arbeitszeit (full) ; Arbeitszeiten (full) |

## Grammar items (6 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g4u04.gi.reported-questions.tr.002 | translation | Er fragte mich, wo ich wohnte. [de] | He asked me where I lived. (full) | deToEn |
| g4u04.gi.reported-questions.tr.004 | translation | Er fragte mich, was meine Fähigkeiten waren. [de] | He asked me what my skills were. (full) | deToEn |
| g4u04.gi.reported-questions.tr.007 | translation | Mia fragte mich, ob ich einen Hund hatte. [de] | Mia asked me if I had a dog. (full) ; Mia asked me whether I had a dog. (full) | deToEn |
| g4u04.gi.reported-questions.tr.008 | translation | Sue fragte mich, ob ich am Montag anfangen könnte. [de] | Sue asked me if I could start on Monday. (full) ; Sue asked me whether I could start on Monday. (full) | deToEn |
| g4u04.gi.reported-questions.tr.009 | translation | Mia asked me if I liked my job. [en] | Mia fragte mich, ob ich meinen Job mochte. (full) ; Mia fragte mich, ob ich meine Arbeit mochte. (full) ; Mia fragte mich, ob mir mein Job gefiel. (partial) | enToDe |
| g4u04.gi.reported-questions.tr.010 | translation | Sue fragte mich, ob ich Erfahrung hatte. [de] | Sue asked me if I had any experience. (full) ; Sue asked me whether I had any experience. (full) ; Sue asked me if I had experience. (full) | deToEn |

## Output contract

Write `content/corpus/units/g4-u04/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g4-u04",
  "lens": "translation",
  "itemsHash": "bd4bc1a2ccf2",
  "promptHash": "c6328b13b073",
  "round": 1,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 51, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
