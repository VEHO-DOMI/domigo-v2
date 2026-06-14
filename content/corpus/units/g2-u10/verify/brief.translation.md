# Verify lens — translation — g2-u10 (round 2)

<!-- domigo:verify translation g2-u10 items=4a29b0e5ca4a prompt=c6328b13b073 round=2 -->

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

## Vocab items (22)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g2u10.w.auntie | auntie | Tantchen | auntie (full) ; aunty (full) ; aunt (partial) | Tantchen (full) ; Tante (full) |
| g2u10.w.calm | calm | ruhig | calm (full) | ruhig (full) ; gelassen (full) |
| g2u10.w.divorced | divorced | geschieden | divorced (full) | geschieden (full) |
| g2u10.w.fault | fault | Schuld | fault (full) | Schuld (full) |
| g2u10.w.file | file | Datei | file (full) | Datei (full) ; Ordner (full) |
| g2u10.w.foreign-language | foreign language | Fremdsprache | foreign language (full) | Fremdsprache (full) |
| g2u10.w.girlfriend | girlfriend | feste Freundin | girlfriend (full) | feste Freundin (full) ; Freundin (full) |
| g2u10.w.hopefully | hopefully | hoffentlich | hopefully (full) | hoffentlich (full) |
| g2u10.w.ice-skating | ice skating | Eislaufen | ice skating (full) | Eislaufen (full) ; Schlittschuhlaufen (full) |
| g2u10.w.public | public | öffentlich | public (full) | öffentlich (full) |
| g2u10.w.sense-of-humour | sense of humour | Sinn für Humor | sense of humour (full) ; sense of humor (full) | Sinn für Humor (full) ; Humor (partial) |
| g2u10.w.to-be-proud-of | to be proud of | stolz sein auf | to be proud of (full) ; be proud of (full) ; proud of (full) | stolz sein auf (full) ; stolz auf (full) |
| g2u10.w.to-be-related-to | to be related to | mit jdm. verwandt sein | to be related to (full) ; be related to (full) ; related to (full) | mit jemandem verwandt sein (full) ; verwandt sein (full) ; verwandt (partial) |
| g2u10.w.to-breathe | to breathe | (ein-)atmen | to breathe (full) ; breathe (full) | atmen (full) ; einatmen (full) |
| g2u10.w.to-burn | to burn | (ver-)brennen | to burn (full) ; burn (full) | brennen (full) ; verbrennen (full) |
| g2u10.w.to-delete | to delete | löschen | to delete (full) ; delete (full) | löschen (full) |
| g2u10.w.to-panic | to panic | in Panik geraten | to panic (full) ; panic (full) | in Panik geraten (full) ; Panik bekommen (full) |
| g2u10.w.to-print-out | to print out | ausdrucken | to print out (full) ; print out (full) | ausdrucken (full) ; drucken (full) |
| g2u10.w.tool | tool | Werkzeug | tool (full) | Werkzeug (full) |
| g2u10.w.tractor | tractor | Traktor | tractor (full) | Traktor (full) |
| g2u10.w.ugly | ugly | hässlich | ugly (full) | hässlich (full) |
| g2u10.w.virus | virus | Virus | virus (full) | Virus (full) ; der Virus (full) |

## Grammar items (4 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g2u10.gi.like-ing.tr.001 | translation | Ich spiele gern Gitarre. [de] | I like playing the guitar. (full) ; I like playing guitar. (partial) | deToEn |
| g2u10.gi.like-ing.tr.002 | translation | Meine Schwester kocht nicht gern. [de] | My sister doesn't like cooking. (full) ; My sister does not like cooking. (full) | deToEn |
| g2u10.gi.must.tr.001 | translation | Du musst ruhig bleiben. [de] | You must stay calm. (full) ; You have to stay calm. (partial) | deToEn |
| g2u10.gi.must.tr.002 | translation | Du darfst hier nicht laufen. [de] | You mustn't run here. (full) ; You must not run here. (full) | deToEn |

## Output contract

Write `content/corpus/units/g2-u10/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u10",
  "lens": "translation",
  "itemsHash": "4a29b0e5ca4a",
  "promptHash": "c6328b13b073",
  "round": 2,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 26, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
