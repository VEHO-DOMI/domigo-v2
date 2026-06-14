# Verify lens — translation — g1-u08 (round 1)

<!-- domigo:verify translation g1-u08 items=b0e8cce66c97 prompt=c6328b13b073 round=1 -->

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

## Vocab items (30)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g1u08.w.anything | anything | (irgend)etwas | anything (full) | etwas (full) ; irgendetwas (full) |
| g1u08.w.backwards | backwards | rückwärts | backwards (full) | rückwärts (full) |
| g1u08.w.belt | belt | Gürtel | belt (full) | Gürtel (full) |
| g1u08.w.blouse | blouse | Bluse | blouse (full) | Bluse (full) |
| g1u08.w.boots | boots | Stiefel | boots (full) | Stiefel (full) |
| g1u08.w.building | building | Gebäude | building (full) | Gebäude (full) |
| g1u08.w.cap | cap | Kappe | cap (full) | Kappe (full) ; Mütze (full) |
| g1u08.w.cape | cape | Umhang | cape (full) | Umhang (full) |
| g1u08.w.exciting | exciting | aufregend | exciting (full) | aufregend (full) |
| g1u08.w.hole | hole | Loch | hole (full) | Loch (full) |
| g1u08.w.hoodie | hoodie | Hoodie | hoodie (full) | Hoodie (full) ; Kapuzenpulli (full) ; Kapuzenpullover (full) |
| g1u08.w.horse | horse | Pferd | horse (full) | Pferd (full) |
| g1u08.w.jacket | jacket | Jacke | jacket (full) | Jacke (full) |
| g1u08.w.let-s-get-out-of-here | Let's get out of here. | Lass(t) uns verschwinden. | Let's get out of here. (full) | Lass uns verschwinden. (full) ; Lasst uns verschwinden. (full) ; Nichts wie weg hier. (partial) |
| g1u08.w.mask | mask | Maske | mask (full) | Maske (full) |
| g1u08.w.poem | poem | Gedicht | poem (full) | Gedicht (full) |
| g1u08.w.pyjamas | pyjamas | Pyjama | pyjamas (full) ; pajamas (partial) | Pyjama (full) ; Schlafanzug (full) |
| g1u08.w.shoes | shoes | Schuhe | shoes (full) | Schuhe (full) |
| g1u08.w.somebody | somebody | jemand | somebody (full) ; someone (partial) | jemand (full) |
| g1u08.w.sweater | sweater | Pullover | sweater (full) | Pullover (full) ; Pulli (full) |
| g1u08.w.tights | tights | Strumpfhose | tights (full) | Strumpfhose (full) |
| g1u08.w.to-borrow | to borrow | (sich) ausleihen | borrow (full) ; to borrow (full) | ausleihen (full) ; sich ausleihen (full) ; borgen (full) |
| g1u08.w.to-fit | to fit | passen | fit (full) ; to fit (full) | passen (full) |
| g1u08.w.to-hurt | to hurt | wehtun | hurt (full) ; to hurt (full) | wehtun (full) ; schmerzen (full) |
| g1u08.w.to-tickle | to tickle | kitzeln | tickle (full) ; to tickle (full) | kitzeln (full) |
| g1u08.w.to-try-on | to try on | anprobieren | try on (full) ; to try on (full) | anprobieren (full) |
| g1u08.w.to-wear | to wear | tragen (Kleidung) | wear (full) ; to wear (full) | tragen (full) ; anhaben (full) |
| g1u08.w.tonight | tonight | heute Abend | tonight (full) | heute Abend (full) ; heute Nacht (partial) |
| g1u08.w.trainers | trainers | Turnschuhe | trainers (full) ; sneakers (partial) | Turnschuhe (full) ; Sneakers (full) |
| g1u08.w.trousers | trousers | Hose | trousers (full) ; pants (partial) | Hose (full) |

## Grammar items (2 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g1u08.gi.present-simple-questions.tr.001 | translation | Magst du Pizza? [de] | Do you like pizza? (full) | deToEn |
| g1u08.gi.present-simple-questions.tr.002 | translation | Trägt sie eine Jacke? [de] | Does she wear a jacket? (full) | deToEn |

## Output contract

Write `content/corpus/units/g1-u08/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u08",
  "lens": "translation",
  "itemsHash": "b0e8cce66c97",
  "promptHash": "c6328b13b073",
  "round": 1,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 32, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
