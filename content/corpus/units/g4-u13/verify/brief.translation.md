# Verify lens — translation — g4-u13 (round 1)

<!-- domigo:verify translation g4-u13 items=725c2f02834b prompt=c6328b13b073 round=1 -->

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

## Vocab items (29)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g4u13.w.apply | apply (for) | sich bewerben (für) | apply (full) ; apply for (full) | sich bewerben (full) ; sich bewerben für (full) ; bewerben (partial) |
| g4u13.w.artist | artist | Künstler/in | artist (full) | Künstler (full) ; Künstlerin (full) ; der Künstler (full) ; die Künstlerin (full) |
| g4u13.w.attend | attend | an etw. teilnehmen | attend (full) | teilnehmen (full) ; an etwas teilnehmen (full) ; besuchen (full) |
| g4u13.w.autograph | autograph | Autogramm | autograph (full) | Autogramm (full) ; das Autogramm (full) ; Unterschrift (partial) |
| g4u13.w.beggar | beggar | Bettler/in | beggar (full) | Bettler (full) ; Bettlerin (full) ; der Bettler (full) ; die Bettlerin (full) |
| g4u13.w.best-wishes | best wishes | mit den besten Wünschen | best wishes (full) | mit den besten Wünschen (full) ; beste Wünsche (full) ; alles Gute (partial) |
| g4u13.w.catch-up-on | catch up on | nachholen | catch up on (full) | nachholen (full) ; aufholen (full) ; Versäumtes nachholen (full) |
| g4u13.w.chill-out | chill out | sich entspannen | chill out (full) ; chill (partial) | sich entspannen (full) ; relaxen (full) ; entspannen (full) ; chillen (full) |
| g4u13.w.coal | coal | Kohle | coal (full) | Kohle (full) ; die Kohle (full) |
| g4u13.w.discipline | discipline | Disziplin | discipline (full) | Disziplin (full) ; die Disziplin (full) |
| g4u13.w.edition | edition | Ausgabe | edition (full) | Ausgabe (full) ; die Ausgabe (full) ; Auflage (partial) |
| g4u13.w.elder | elder | älter | elder (full) ; older (partial) | älter (full) ; ältere (full) ; älterer (full) |
| g4u13.w.get-involved-with | get involved with | sich auf etw. einlassen | get involved with (full) ; get involved (partial) | sich auf etwas einlassen (full) ; mitmischen (full) ; sich einlassen (full) |
| g4u13.w.help-out | help out | (aus-)helfen | help out (full) | aushelfen (full) ; helfen (full) ; mithelfen (full) |
| g4u13.w.highlight | highlight | Höhepunkt | highlight (full) | Höhepunkt (full) ; der Höhepunkt (full) |
| g4u13.w.honestly | honestly | ehrlich | honestly (full) | ehrlich (full) ; ganz ehrlich (full) ; wirklich (partial) |
| g4u13.w.kill-time | kill time | sich die Zeit vertreiben | kill time (full) | sich die Zeit vertreiben (full) ; die Zeit totschlagen (full) ; Zeit vertreiben (full) |
| g4u13.w.last-but-not-least | last but not least | nicht zuletzt | last but not least (full) | nicht zuletzt (full) ; zu guter Letzt (full) |
| g4u13.w.legend | legend | Legende | legend (full) | Legende (full) ; die Legende (full) ; Sage (partial) |
| g4u13.w.leisure-centre | leisure centre | Freizeitzentrum | leisure centre (full) ; leisure center (partial) | Freizeitzentrum (full) ; das Freizeitzentrum (full) |
| g4u13.w.make-money | make money | Geld machen/verdienen | make money (full) | Geld verdienen (full) ; Geld machen (full) |
| g4u13.w.occasionally | occasionally | ab und zu | occasionally (full) | ab und zu (full) ; hin und wieder (full) ; gelegentlich (full) ; manchmal (partial) |
| g4u13.w.ripe | ripe | reif | ripe (full) | reif (full) ; reife (full) |
| g4u13.w.scuba-diving | scuba-diving | (Sport-)Tauchen | scuba-diving (full) ; scuba diving (full) | (Sport-)Tauchen (full) ; Sporttauchen (full) ; Tauchen (full) |
| g4u13.w.take-care-of | take care of | sorgen für | take care of (full) | sorgen für (full) ; sich kümmern um (full) ; Acht geben auf (full) |
| g4u13.w.take-up | take up | anfangen | take up (full) | anfangen (full) ; anfangen mit (full) ; beginnen (partial) |
| g4u13.w.tough | tough | schwierig | tough (full) ; hard (partial) | schwierig (full) ; hart (full) ; schwer (full) |
| g4u13.w.tournament | tournament | Turnier | tournament (full) | Turnier (full) ; das Turnier (full) |
| g4u13.w.water-proof | water-proof | wasserdicht | water-proof (full) ; waterproof (partial) | wasserdicht (full) ; wasserfest (partial) |

## Grammar items (4 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g4u13.gi.word-formation.tr.001 | translation | Es ist unmöglich, das heute fertig zu machen. [de] | It's impossible to finish this today. (full) ; It is impossible to finish this today. (full) ; It's impossible to finish that today. (full) | deToEn |
| g4u13.gi.word-formation.tr.002 | translation | Ich bin völlig anderer Meinung als du. [de] | I completely disagree with you. (full) ; I totally disagree with you. (full) ; I disagree with you completely. (full) | deToEn |
| g4u13.gi.word-formation.tr.003 | translation | Sein Verhalten war völlig verantwortungslos. [de] | His behaviour was completely irresponsible. (full) ; His behavior was completely irresponsible. (full) ; His behaviour was totally irresponsible. (full) | deToEn |
| g4u13.gi.word-formation.tr.004 | translation | Ihre Freundlichkeit überraschte alle. [de] | Her kindness surprised everyone. (full) ; Her kindness surprised everybody. (full) ; Her friendliness surprised everyone. (partial) | deToEn |

## Output contract

Write `content/corpus/units/g4-u13/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g4-u13",
  "lens": "translation",
  "itemsHash": "725c2f02834b",
  "promptHash": "c6328b13b073",
  "round": 1,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 33, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
