# Verify lens — translation — g1-u10 (round 1)

<!-- domigo:verify translation g1-u10 items=5c0bbc31ed04 prompt=c6328b13b073 round=1 -->

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

## Vocab items (44)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g1u10.w.100-one-hundred | 100 one hundred | 100 einhundert | one hundred (full) ; a hundred (partial) ; hundred (partial) ; 100 (full) | einhundert (full) ; hundert (full) ; 100 einhundert (partial) |
| g1u10.w.1000-one-thousand | 1000 one thousand | 1000 eintausend | one thousand (full) ; a thousand (partial) ; thousand (partial) ; 1000 (full) | eintausend (full) ; tausend (full) ; 1000 eintausend (partial) |
| g1u10.w.20-twenty | 20 twenty | 20 zwanzig | twenty (full) ; 20 (full) | zwanzig (full) ; 20 zwanzig (partial) |
| g1u10.w.30-thirty | 30 thirty | 30 dreißig | thirty (full) ; 30 (full) | dreißig (full) ; 30 dreißig (partial) |
| g1u10.w.40-forty | 40 forty | 40 vierzig | forty (full) ; 40 (full) | vierzig (full) ; 40 vierzig (partial) |
| g1u10.w.50-fifty | 50 fifty | 50 fünfzig | fifty (full) ; 50 (full) | fünfzig (full) ; 50 fünfzig (partial) |
| g1u10.w.60-sixty | 60 sixty | 60 sechzig | sixty (full) ; 60 (full) | sechzig (full) ; 60 sechzig (partial) |
| g1u10.w.70-seventy | 70 seventy | 70 siebzig | seventy (full) ; 70 (full) | siebzig (full) ; 70 siebzig (partial) |
| g1u10.w.80-eighty | 80 eighty | 80 achtzig | eighty (full) ; 80 (full) | achtzig (full) ; 80 achtzig (partial) |
| g1u10.w.90-ninety | 90 ninety | 90 neunzig | ninety (full) ; 90 (full) | neunzig (full) ; 90 neunzig (partial) |
| g1u10.w.anything-else | Anything else? | Darf es noch etwas sein? | Anything else? (full) | Darf es noch etwas sein? (full) ; Sonst noch etwas? (partial) |
| g1u10.w.be-careful | Be careful. | Sei(d) vorsichtig. | Be careful. (full) | Sei vorsichtig. (full) ; Seid vorsichtig. (full) ; Pass auf. (full) |
| g1u10.w.can-i-help-you | Can I help you? | Kann ich dir/Ihnen behilflich sein? | Can I help you? (full) | Kann ich dir behilflich sein? (full) ; Kann ich dir helfen? (full) |
| g1u10.w.changing-room | changing room | Umkleidekabine | changing room (full) | Umkleidekabine (full) ; Umkleide (partial) |
| g1u10.w.computer-game | computer game | Computerspiel | computer game (full) | Computerspiel (full) |
| g1u10.w.congratulations | Congratulations! | Herzlichen Glückwunsch! | Congratulations! (full) | Herzlichen Glückwunsch! (full) ; Gratuliere! (full) |
| g1u10.w.customer | customer | Kunde/Kundin | customer (full) | Kunde (full) ; Kundin (full) ; Kunde/Kundin (partial) |
| g1u10.w.drawer | drawer | Schublade | drawer (full) | Schublade (full) |
| g1u10.w.everything | everything | alles | everything (full) | alles (full) |
| g1u10.w.expensive | expensive | teuer | expensive (full) | teuer (full) |
| g1u10.w.goodbye | Goodbye. | Auf Wiedersehen. | Goodbye. (full) ; Bye. (partial) | Auf Wiedersehen. (full) ; Tschüss. (full) |
| g1u10.w.headphones | headphones | Kopfhörer | headphones (full) | Kopfhörer (full) |
| g1u10.w.how-much-is-are | how much is/are ... | wie viel kostet/kosten ... | how much is (full) ; how much are (full) | wie viel kostet (full) ; wie viel kosten (full) ; was kostet (partial) |
| g1u10.w.i-d-like | I'd like ... | Ich hätte gerne ... | I'd like (full) ; I would like (full) | Ich hätte gerne (full) ; Ich möchte (full) |
| g1u10.w.just-a-minute | Just a minute. | Einen Augenblick bitte. | Just a minute. (full) ; One minute. (partial) | Einen Augenblick bitte. (full) ; Moment mal. (full) |
| g1u10.w.key-ring | key ring | Schlüsselanhänger | key ring (full) | Schlüsselanhänger (full) ; Schlüsselring (partial) |
| g1u10.w.magazine | magazine | Zeitschrift | magazine (full) | Zeitschrift (full) ; Magazin (full) |
| g1u10.w.mobile-phone | mobile phone | Handy | mobile phone (full) ; mobile (partial) | Handy (full) ; Mobiltelefon (full) |
| g1u10.w.no-problem | No problem. | Kein Problem. | No problem. (full) | Kein Problem. (full) |
| g1u10.w.no-wonder | No wonder. | Kein Wunder. | No wonder. (full) | Kein Wunder. (full) |
| g1u10.w.over-there | over there | da/dort drüben | over there (full) | da drüben (full) ; dort drüben (full) |
| g1u10.w.price | price | Preis | price (full) | Preis (full) |
| g1u10.w.rule | rule | Regel | rule (full) | Regel (full) |
| g1u10.w.scooter | scooter | Roller | scooter (full) | Roller (full) ; Tretroller (partial) |
| g1u10.w.suddenly | suddenly | plötzlich | suddenly (full) ; all at once (partial) | plötzlich (full) ; auf einmal (full) |
| g1u10.w.sweets | sweets (pl) | Süßigkeiten | sweets (full) | Süßigkeiten (full) ; Bonbons (partial) |
| g1u10.w.that-s-better | That's better. | So ist es besser. | That's better. (full) | So ist es besser. (full) |
| g1u10.w.these | these | diese | these (full) | diese (full) |
| g1u10.w.those | those | jene | those (full) | jene (full) ; die da (partial) |
| g1u10.w.tin | tin | Dose | tin (full) ; can (partial) | Dose (full) |
| g1u10.w.to-fall-asleep | to fall asleep | einschlafen | to fall asleep (full) ; fall asleep (full) | einschlafen (full) |
| g1u10.w.to-walk-away | to walk away | weggehen | to walk away (full) ; walk away (full) | weggehen (full) ; fortgehen (full) ; davongehen (partial) |
| g1u10.w.town | town | Stadt | town (full) | Stadt (full) ; Ortschaft (partial) |
| g1u10.w.what-can-i-do-for-you | What can I do for you? | Was kann ich für dich/Sie tun? | What can I do for you? (full) | Was kann ich für dich tun? (full) |

## Grammar items (2 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g1u10.gi.this-that-these-those.tr.001 | translation | Sag auf Englisch: Diese Süßigkeiten hier sind toll. (toll = nice) [de] | These sweets here are nice. (full) ; These sweets are nice. (full) | deToEn |
| g1u10.gi.this-that-these-those.tr.002 | translation | Sag auf Englisch: Jene Kopfhörer dort drüben sind teuer. [de] | Those headphones over there are expensive. (full) ; Those headphones are expensive. (full) | deToEn |

## Output contract

Write `content/corpus/units/g1-u10/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u10",
  "lens": "translation",
  "itemsHash": "5c0bbc31ed04",
  "promptHash": "c6328b13b073",
  "round": 1,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 46, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
