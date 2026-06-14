# Verify lens — translation — g3-u07 (round 1)

<!-- domigo:verify translation g3-u07 items=4ce24136baf3 prompt=c6328b13b073 round=1 -->

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

## Vocab items (34)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g3u07.w.a-pile-of | a pile of | ein Stapel an | a pile of (full) ; pile of (full) | ein Stapel an (full) ; ein Stapel (full) ; ein Haufen (partial) |
| g3u07.w.beloved | beloved | geliebt | beloved (full) | geliebt (full) ; heiß geliebt (full) |
| g3u07.w.childhood | childhood (no pl) | Kindheit | childhood (full) | Kindheit (full) |
| g3u07.w.clumsy | clumsy | ungeschickt | clumsy (full) | ungeschickt (full) ; tollpatschig (full) |
| g3u07.w.earring | earring | Ohrring | earring (full) ; earrings (full) | Ohrring (full) ; Ohrringe (full) |
| g3u07.w.honest | honest | ehrlich | honest (full) | ehrlich (full) |
| g3u07.w.it-s-none-of-my-business | It's none of my business. | Das geht mich nichts an. | It's none of my business. (full) ; none of my business (full) | Das geht mich nichts an. (full) ; Das ist nicht meine Sache. (full) |
| g3u07.w.jealous | jealous | eifersüchtig | jealous (full) | eifersüchtig (full) ; neidisch (partial) |
| g3u07.w.nowhere | nowhere | nirgends | nowhere (full) | nirgends (full) ; nirgendwo (full) ; nirgendwohin (partial) |
| g3u07.w.questionnaire | questionnaire | Fragebogen | questionnaire (full) | Fragebogen (full) |
| g3u07.w.rash | rash | Hautausschlag | rash (full) | Hautausschlag (full) ; Ausschlag (full) |
| g3u07.w.relationship | relationship | Beziehung | relationship (full) | Beziehung (full) |
| g3u07.w.script | script | Drehbuch | script (full) | Drehbuch (full) |
| g3u07.w.soft-toy | soft toy | Stofftier | soft toy (full) ; soft toys (full) | Stofftier (full) ; Kuscheltier (full) |
| g3u07.w.to-admit | to admit | zugeben | admit (full) ; to admit (full) | zugeben (full) ; eingestehen (full) |
| g3u07.w.to-blackmail | to blackmail | erpressen | blackmail (full) ; to blackmail (full) | erpressen (full) |
| g3u07.w.to-break-up-with-sb | to break up with sb. | mit jdm. Schluss machen | break up with (full) ; to break up with sb. (full) | mit jemandem Schluss machen (full) ; Schluss machen (full) |
| g3u07.w.to-fall-out-with-sb | to fall out with sb. | sich mit jdm. zerstreiten | fall out with (full) ; to fall out with sb. (full) ; fall out (partial) | sich mit jemandem zerstreiten (full) ; sich zerstreiten (full) ; sich streiten (partial) |
| g3u07.w.to-get-on-well-with-sb | to get on well with sb. | sich gut mit jdm. verstehen | get on well with (full) ; to get on well with sb. (full) | sich gut mit jemandem verstehen (full) ; sich gut verstehen (full) |
| g3u07.w.to-keep-secret | to keep (a) secret | ein Geheimnis für sich behalten | keep a secret (full) ; keep secret (full) ; to keep a secret (full) | ein Geheimnis für sich behalten (full) ; ein Geheimnis bewahren (full) ; ein Geheimnis behalten (full) |
| g3u07.w.to-laugh-at-sb | to laugh at sb. | jdn. auslachen | laugh at (full) ; to laugh at sb. (full) | jemanden auslachen (full) ; auslachen (full) |
| g3u07.w.to-lie-to-sb | to lie to sb. | jdn. anlügen | lie to (full) ; to lie to sb. (full) | jemanden anlügen (full) ; jemanden belügen (full) ; anlügen (full) |
| g3u07.w.to-make-fun-of-sb | to make fun of sb. | sich über jdn. lustig machen | make fun of (full) ; to make fun of sb. (full) | sich über jemanden lustig machen (full) ; sich lustig machen (full) |
| g3u07.w.to-make-up-one-s-mind | to make up one's mind | einen Entschluss fassen | make up one's mind (full) ; make up your mind (full) ; to make up one's mind (full) | einen Entschluss fassen (full) ; sich entscheiden (full) ; sich entschließen (full) |
| g3u07.w.to-make-up-with-sb | to make up with sb. | sich mit jdm. versöhnen | make up with (full) ; to make up with sb. (full) | sich mit jemandem versöhnen (full) ; sich versöhnen (full) ; sich wieder vertragen (full) |
| g3u07.w.to-mind-your-own-business | to mind your own business | sich um seine eigenen Angelegenheiten kümmern | mind your own business (full) ; to mind your own business (full) | kümmere dich um deine eigenen Angelegenheiten (full) ; kümmere dich um deinen eigenen Kram (full) ; misch dich nicht ein (partial) |
| g3u07.w.to-move | to move | umziehen | move (full) ; to move (full) | umziehen (full) ; übersiedeln (full) |
| g3u07.w.to-own | to own | besitzen | own (full) ; to own (full) | besitzen (full) ; haben (partial) |
| g3u07.w.to-solve | to solve | lösen | solve (full) ; to solve (full) | lösen (full) |
| g3u07.w.to-step-in | to step in | eingreifen | step in (full) ; to step in (full) | eingreifen (full) ; dazwischengehen (full) |
| g3u07.w.to-storm-out-of | to storm out of | wütend hinausstürmen | storm out of (full) ; to storm out of (full) | wütend hinausstürmen (full) ; wütend hinauslaufen (full) ; hinausstürmen (partial) |
| g3u07.w.to-struggle | to struggle | kämpfen | struggle (full) ; to struggle (full) | kämpfen (full) ; sich abmühen (full) ; sich schwertun (full) |
| g3u07.w.to-tell-sb-off | to tell sb. off | mit jdm. schimpfen | tell off (full) ; to tell sb. off (full) | mit jemandem schimpfen (full) ; jemanden ausschimpfen (full) |
| g3u07.w.unwell | unwell | unwohl | unwell (full) | unwohl (full) ; krank (full) ; nicht wohl (full) |

## Grammar items (4 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g3u07.gi.present-perfect-for-since.tr.001 | translation | Ich wohne seit fünf Jahren in Wien. [de] | I have lived in Vienna for five years. (full) ; I've lived in Vienna for five years. (full) ; I have lived in Vienna for five years (full) | deToEn |
| g3u07.gi.present-perfect-for-since.tr.002 | translation | Er spielt seit Montag kein Fußball. [de] | He hasn't played football since Monday. (full) ; He has not played football since Monday. (full) ; He hasn't played football since Monday (full) | deToEn |
| g3u07.gi.present-perfect-for-since.tr.003 | translation | Wir sind seit zwei Jahren befreundet. [de] | We have been friends for two years. (full) ; We've been friends for two years. (full) ; We have been friends for two years (full) | deToEn |
| g3u07.gi.present-perfect-for-since.tr.004 | translation | She has had those soft toys since she was little. [en] | Sie hat diese Stofftiere, seit sie klein war. (full) ; Sie hat die Stofftiere, seit sie klein war. (full) | enToDe |

## Output contract

Write `content/corpus/units/g3-u07/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g3-u07",
  "lens": "translation",
  "itemsHash": "4ce24136baf3",
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
