# Verify lens — translation — g4-u08 (round 1)

<!-- domigo:verify translation g4-u08 items=5f8f7f160504 prompt=c6328b13b073 round=1 -->

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

## Vocab items (31)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g4u08.w.addict | addict | Süchtige/r | addict (full) | Süchtiger (full) ; Süchtige (full) ; Abhängiger (full) ; Abhängige (full) |
| g4u08.w.addiction | addiction | Sucht | addiction (full) | Sucht (full) ; die Sucht (full) |
| g4u08.w.auction | auction | Auktion | auction (full) | Auktion (full) ; die Auktion (full) ; Versteigerung (full) ; die Versteigerung (full) |
| g4u08.w.black-market | black market | Schwarzmarkt | black market (full) | Schwarzmarkt (full) ; der Schwarzmarkt (full) |
| g4u08.w.burn-to-the-ground | burn to the ground | niederbrennen | burn to the ground (full) ; burned to the ground (full) ; burnt to the ground (full) | niederbrennen (full) ; abbrennen (full) ; bis auf die Grundmauern niederbrennen (full) |
| g4u08.w.collect | collect | sammeln | collect (full) ; to collect (full) | sammeln (full) |
| g4u08.w.collection | collection | Sammlung | collection (full) | Sammlung (full) ; die Sammlung (full) |
| g4u08.w.command | command | Befehl | command (full) | Befehl (full) ; der Befehl (full) |
| g4u08.w.confuse-sb | confuse sb | verwirren | confuse sb (full) ; confuse somebody (full) | verwirren (full) ; jemanden verwirren (full) ; durcheinanderbringen (partial) |
| g4u08.w.copy | copy | Exemplar | copy (full) ; copies (full) | Exemplar (full) ; das Exemplar (full) ; Kopie (full) ; die Kopie (full) |
| g4u08.w.execute | execute | hinrichten | execute (full) ; to execute (full) | hinrichten (full) |
| g4u08.w.fascination | fascination | Faszination | fascination (full) | Faszination (full) ; die Faszination (full) |
| g4u08.w.furious | furious | wütend | furious (full) | wütend (full) ; aufgebracht (full) ; sehr wütend (partial) |
| g4u08.w.go-crazy | go crazy | durchdrehen | go crazy (full) | durchdrehen (full) ; verrückt werden (full) ; ausrasten (partial) |
| g4u08.w.judge | judge | Richter/in | judge (full) | Richter (full) ; Richterin (full) ; der Richter (full) ; die Richterin (full) |
| g4u08.w.kitschy | kitschy | kitschig | kitschy (full) | kitschig (full) |
| g4u08.w.librarian | librarian | Bibliothekar/in | librarian (full) | Bibliothekar (full) ; Bibliothekarin (full) ; der Bibliothekar (full) ; die Bibliothekarin (full) |
| g4u08.w.library | library | Bibliothek | library (full) | Bibliothek (full) ; die Bibliothek (full) ; Bücherei (full) ; die Bücherei (full) |
| g4u08.w.miss-out-on-sth | miss out on sth | etw. verpassen | miss out on sth (full) ; miss out on something (full) | etwas verpassen (full) ; etw. verpassen (full) |
| g4u08.w.monastery | monastery | Kloster | monastery (full) | Kloster (full) ; das Kloster (full) |
| g4u08.w.monk | monk | Mönch | monk (full) | Mönch (full) ; der Mönch (full) |
| g4u08.w.pale | pale | blass | pale (full) | blass (full) ; bleich (full) |
| g4u08.w.precious | precious | kostbar | precious (full) | kostbar (full) ; wertvoll (full) |
| g4u08.w.preserve | preserve | erhalten | preserve (full) ; to preserve (full) | erhalten (full) ; schützen (full) ; bewahren (full) |
| g4u08.w.rare | rare | selten | rare (full) | selten (full) |
| g4u08.w.rob | rob | ausrauben | rob (full) ; to rob (full) | ausrauben (full) ; berauben (full) |
| g4u08.w.sentence-to-death | sentence to death | zu Tode verurteilen | sentence to death (full) ; sentenced to death (full) | zu Tode verurteilen (full) ; zum Tode verurteilen (full) |
| g4u08.w.sheet | sheet | Blatt | sheet (full) | Blatt (full) ; das Blatt (full) ; Blatt Papier (full) |
| g4u08.w.shorten | shorten | kürzen | shorten (full) ; to shorten (full) | kürzen (full) ; verkürzen (full) |
| g4u08.w.turn-up | turn up | auftauchen | turn up (full) | auftauchen (full) ; erscheinen (full) |
| g4u08.w.whisper | whisper | flüstern | whisper (full) ; to whisper (full) | flüstern (full) ; wispern (partial) |

## Grammar items (6 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g4u08.gi.tense-time-expression-review.tr.001 | translation | Ich wohne seit drei Jahren in Vienna. [de] | I have lived in Vienna for three years. (full) ; I've lived in Vienna for three years. (full) | deToEn |
| g4u08.gi.tense-time-expression-review.tr.002 | translation | Ich sammle Bücher, seit ich zehn war. [de] | I have collected books since I was ten. (full) ; I've collected books since I was ten. (full) ; I have collected books since I was ten (partial) | deToEn |
| g4u08.gi.tense-time-expression-review.tr.003 | translation | Letztes Jahr besuchte ich das Kloster in Spain. [de] | Last year I visited the monastery in Spain. (full) ; I visited the monastery in Spain last year. (full) | deToEn |
| g4u08.gi.tense-time-expression-review.tr.005 | translation | Ich habe diesen Bibliothekar seit Montag nicht gesehen / besucht. [de] | I haven't visited this librarian since Monday. (full) ; I have not visited this librarian since Monday. (full) | deToEn |
| g4u08.gi.tense-time-expression-review.tr.007 | translation | Mia zog vor zwei Jahren nach London und wohnt seitdem dort. [de] | Mia moved to London two years ago and has lived there since then. (full) ; Mia moved to London two years ago and she has lived there since then. (full) | deToEn |
| g4u08.gi.tense-time-expression-review.tr.009 | translation | Übersetze ins Englische: 'Ich sammle seit vielen Jahren Sand.' [de] | I have collected sand for many years. (full) ; I've collected sand for many years. (full) | deToEn |

## Output contract

Write `content/corpus/units/g4-u08/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g4-u08",
  "lens": "translation",
  "itemsHash": "5f8f7f160504",
  "promptHash": "c6328b13b073",
  "round": 1,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 37, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
