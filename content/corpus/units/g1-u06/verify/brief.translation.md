# Verify lens — translation — g1-u06 (round 1)

<!-- domigo:verify translation g1-u06 items=ca33d0b51fc1 prompt=c6328b13b073 round=1 -->

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

## Vocab items (49)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g1u06.w.a-lot-of-lots-of | a lot of / lots of | viel/e | a lot of (full) ; lots of (full) ; many (partial) | viele (full) ; viel (full) ; jede Menge (full) |
| g1u06.w.away | away | weg | away (full) | weg (full) |
| g1u06.w.best | (world's) best | (welt-)bester/beste/bestes | best (full) ; world's best (full) | bester (full) ; beste (full) ; bestes (full) |
| g1u06.w.but-it-s-true | But it's true! | Aber es stimmt! | But it's true! (full) ; But it's true (full) | Aber es stimmt! (full) ; Aber es stimmt (full) |
| g1u06.w.city | city | Stadt | city (full) | Stadt (full) ; Großstadt (full) |
| g1u06.w.clever | clever | klug | clever (full) ; smart (partial) | klug (full) ; schlau (full) |
| g1u06.w.come-on | Come on! | Komm(t) jetzt! | Come on! (full) ; Come on (full) | Komm jetzt! (full) ; Kommt jetzt! (full) ; Mach schon! (full) ; Macht schon! (full) |
| g1u06.w.detective | detective | Detektiv/Detektivin | detective (full) | Detektiv (full) ; Detektivin (full) |
| g1u06.w.go-on | Go on. | weitermachen | Go on. (full) ; Go on (full) | Erzähl weiter! (full) ; Mach weiter! (full) ; weitermachen (full) |
| g1u06.w.help-me | Help me! | Hilf mir! | Help me! (full) ; Help me (full) | Hilf mir! (full) ; Hilf mir (full) |
| g1u06.w.market | market | Markt | market (full) | Markt (full) |
| g1u06.w.mirror | mirror | Spiegel | mirror (full) | Spiegel (full) |
| g1u06.w.nice | nice | nett | nice (full) ; lovely (partial) | nett (full) ; schön (full) |
| g1u06.w.office | office | Büro | office (full) | Büro (full) |
| g1u06.w.park | park | Park | park (full) | Park (full) |
| g1u06.w.river | river | Fluss | river (full) | Fluss (full) |
| g1u06.w.street | street | Straße | street (full) | Straße (full) |
| g1u06.w.street-2 | street | Straße | street (full) | Straße (full) |
| g1u06.w.supermarket | supermarket | Supermarkt | supermarket (full) | Supermarkt (full) |
| g1u06.w.to-become | to become | werden | to become (full) ; become (full) | werden (full) |
| g1u06.w.to-bump-into-a-tree | to bump into a tree | gegen einen Baum stoßen | to bump into a tree (full) ; bump into a tree (full) | gegen einen Baum stoßen (full) |
| g1u06.w.to-call | to call | (an-)rufen | to call (full) ; call (full) ; to phone (partial) | anrufen (full) ; rufen (full) |
| g1u06.w.to-catch | to catch | fangen | to catch (full) ; catch (full) | fangen (full) ; erwischen (full) ; festnehmen (full) |
| g1u06.w.to-climb | to climb | klettern | to climb (full) ; climb (full) | klettern (full) |
| g1u06.w.to-climb-up-a-tree | to climb up a tree | auf einen Baum klettern | to climb up a tree (full) ; climb up a tree (full) | auf einen Baum klettern (full) |
| g1u06.w.to-come-to | to come to | (zu etwas) hinkommen | to come to (full) ; come to (full) ; to arrive at (partial) | hinkommen (full) ; ankommen (partial) |
| g1u06.w.to-fall-out-of-the-tree | to fall out of the tree | vom Baum fallen | to fall out of the tree (full) ; fall out of the tree (full) | vom Baum fallen (full) |
| g1u06.w.to-find | to find | finden | to find (full) ; find (full) | finden (full) |
| g1u06.w.to-get-up | to get up | aufstehen | to get up (full) ; get up (full) | aufstehen (full) |
| g1u06.w.to-go-to-the-park | to go to the park | in den Park gehen | to go to the park (full) ; go to the park (full) | in den Park gehen (full) |
| g1u06.w.to-jump | to jump | hüpfen | to jump (full) ; jump (full) ; to leap (partial) | hüpfen (full) ; springen (full) |
| g1u06.w.to-jump-into-the-river | to jump into the river | in den Fluss springen | to jump into the river (full) ; jump into the river (full) | in den Fluss springen (full) |
| g1u06.w.to-leave | to leave | verlassen | to leave (full) ; leave (full) ; to go away (partial) | verlassen (full) ; weggehen (full) |
| g1u06.w.to-leave-the-office | to leave the office | das Büro verlassen | to leave the office (full) ; leave the office (full) | das Büro verlassen (full) |
| g1u06.w.to-live | to live | wohnen | to live (full) ; live (full) | wohnen (full) ; leben (full) |
| g1u06.w.to-look-in-the-mirror | to look in the mirror | in den Spiegel schauen | to look in the mirror (full) ; look in the mirror (full) | in den Spiegel schauen (full) |
| g1u06.w.to-look-out-the-window | to look out the window | aus dem Fenster schauen | to look out the window (full) ; look out the window (full) | aus dem Fenster schauen (full) |
| g1u06.w.to-pick-something-up | to pick something up | etwas aufheben | to pick something up (full) ; pick something up (full) | etwas aufheben (full) ; aufheben (full) |
| g1u06.w.to-pull | to pull | ziehen | to pull (full) ; pull (full) | ziehen (full) |
| g1u06.w.to-pull-2 | to pull | ziehen | to pull (full) ; pull (full) | ziehen (full) |
| g1u06.w.to-put-on | to put on | aufsetzen | to put on (full) ; put on (full) | aufsetzen (full) ; anziehen (full) |
| g1u06.w.to-run | to run | laufen | to run (full) ; run (full) | laufen (full) ; rennen (full) |
| g1u06.w.to-sit-in-a-tree | to sit in a tree | auf einem Baum sitzen | to sit in a tree (full) ; sit in a tree (full) | auf einem Baum sitzen (full) |
| g1u06.w.to-solve | to solve | lösen | to solve (full) ; solve (full) | lösen (full) |
| g1u06.w.to-wait | to wait | warten | to wait (full) ; wait (full) | warten (full) |
| g1u06.w.to-watch | to watch | beobachten | to watch (full) ; watch (full) | beobachten (full) ; zuschauen (full) |
| g1u06.w.tree | tree | Baum | tree (full) | Baum (full) |
| g1u06.w.well-done | Well done. | Gut gemacht. | Well done. (full) ; Well done (full) | Gut gemacht. (full) ; Gut gemacht (full) ; Bravo! (partial) |
| g1u06.w.woods | woods | Wald | woods (full) | Wald (full) |

## Grammar items (6 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g1u06.gi.a-lot-of.tr.001 | translation | Es gibt viele Bäume im Park. [de] | There are a lot of trees in the park. (full) ; There are lots of trees in the park. (full) | deToEn |
| g1u06.gi.a-lot-of.tr.002 | translation | Der Detektiv hat viel Arbeit. [de] | The detective has got a lot of work. (full) ; The detective has got lots of work. (full) ; The detective has a lot of work. (partial) ; The detective has lots of work. (partial) | deToEn |
| g1u06.gi.a-lot-of.tr.003 | translation | She has got a lot of books. [en] | Sie hat viele Bücher. (full) ; Sie hat jede Menge Bücher. (partial) | enToDe |
| g1u06.gi.present-simple.tr.001 | translation | Er wohnt in London. [de] | He lives in London. (full) | deToEn |
| g1u06.gi.present-simple.tr.002 | translation | Sie spielt die Gitarre. [de] | She plays the guitar. (full) | deToEn |
| g1u06.gi.present-simple.tr.003 | translation | Er geht in den Park. [de] | He goes to the park. (full) | deToEn |

## Output contract

Write `content/corpus/units/g1-u06/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u06",
  "lens": "translation",
  "itemsHash": "ca33d0b51fc1",
  "promptHash": "c6328b13b073",
  "round": 1,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 55, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
