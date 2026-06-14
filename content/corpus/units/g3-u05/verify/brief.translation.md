# Verify lens — translation — g3-u05 (round 1)

<!-- domigo:verify translation g3-u05 items=e1ddda3c1db0 prompt=c6328b13b073 round=1 -->

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

## Vocab items (41)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g3u05.w.alarm-clock | alarm clock | Wecker | alarm clock (full) ; an alarm clock (full) | Wecker (full) ; der Wecker (full) |
| g3u05.w.any-luck | Any luck? | Hattest du Glück? | Any luck? (full) | Hattest du Glück? (full) ; Und, Glück gehabt? (full) |
| g3u05.w.beside | beside | neben | beside (full) ; next to (full) | neben (full) |
| g3u05.w.crack | crack | Riss | crack (full) ; a crack (full) | Riss (full) ; Spalt (full) ; Fuge (full) |
| g3u05.w.cuckoo | cuckoo | Kuckuck | cuckoo (full) ; a cuckoo (full) | Kuckuck (full) ; der Kuckuck (full) |
| g3u05.w.do-you-mind | Do you mind ...? | Macht es dir etwas aus ...? | Do you mind ...? (full) | Macht es dir etwas aus ...? (full) ; Hast du etwas dagegen ...? (full) |
| g3u05.w.evil | evil | böse | evil (full) ; wicked (partial) | böse (full) |
| g3u05.w.haircut | haircut | Haarschnitt | haircut (full) ; a haircut (full) | Haarschnitt (full) ; der Haarschnitt (full) |
| g3u05.w.i-m-joking | I'm joking. | Ich scherze nur. | I'm joking. (full) ; I am joking. (full) | Ich scherze nur. (full) ; Ich mache nur Spaß. (full) |
| g3u05.w.i-m-sure | I'm sure. | Ich bin mir sicher. | I'm sure. (full) ; I am sure. (full) | Ich bin mir sicher. (full) ; Ganz sicher. (full) |
| g3u05.w.lucky-charm | lucky charm | Glücksbringer | lucky charm (full) ; a lucky charm (full) | Glücksbringer (full) ; der Glücksbringer (full) |
| g3u05.w.obvious | obvious | offensichtlich | obvious (full) ; clear (partial) | offensichtlich (full) ; klar (full) |
| g3u05.w.pavement | pavement | Gehsteig | pavement (full) ; the pavement (full) | Gehsteig (full) ; der Gehsteig (full) ; Gehweg (full) |
| g3u05.w.rich | rich | reich | rich (full) | reich (full) |
| g3u05.w.salt | salt | Salz | salt (full) | Salz (full) ; das Salz (full) |
| g3u05.w.satisfied | satisfied | zufrieden | satisfied (full) ; happy (partial) ; pleased (partial) | zufrieden (full) |
| g3u05.w.seriously | seriously | ernsthaft | seriously (full) ; really (partial) | ernsthaft (full) ; im Ernst (full) ; wirklich (full) |
| g3u05.w.sleeping-bag | sleeping bag | Schlafsack | sleeping bag (full) ; a sleeping bag (full) | Schlafsack (full) ; der Schlafsack (full) |
| g3u05.w.spirit | spirit | Geist | spirit (full) ; ghost (partial) | Geist (full) ; der Geist (full) |
| g3u05.w.spooky | spooky | unheimlich | spooky (full) ; creepy (partial) ; scary (partial) | unheimlich (full) ; gruselig (full) |
| g3u05.w.superstition | superstition | Aberglaube | superstition (full) ; a superstition (full) | Aberglaube (full) ; der Aberglaube (full) |
| g3u05.w.superstitious | superstitious | abergläubisch | superstitious (full) | abergläubisch (full) |
| g3u05.w.to-arrange | to arrange | vereinbaren | to arrange (full) ; arrange (full) | vereinbaren (full) ; arrangieren (full) ; ausmachen (full) |
| g3u05.w.to-attract | to attract | anlocken | to attract (full) ; attract (full) | anlocken (full) ; anziehen (full) |
| g3u05.w.to-be-unlucky | to be unlucky | Pech haben | to be unlucky (full) ; be unlucky (full) ; to have bad luck (partial) | Pech haben (full) ; Pech zu haben (full) |
| g3u05.w.to-believe-in-superstitions | to believe in superstitions | an Aberglauben glauben | to believe in superstitions (full) ; believe in superstitions (full) | an Aberglauben glauben (full) ; abergläubisch sein (full) |
| g3u05.w.to-bring-luck | to bring (good/bad) luck | (Glück/Pech) bringen | to bring good luck (full) ; to bring bad luck (full) ; to bring luck (full) | Glück bringen (full) ; Pech bringen (full) ; (Glück/Pech) bringen (full) |
| g3u05.w.to-catch-a-cold | to catch a cold | sich verkühlen | to catch a cold (full) ; catch a cold (full) | sich verkühlen (full) ; sich erkälten (full) |
| g3u05.w.to-come-true | to come true | wahr werden | to come true (full) ; come true (full) | wahr werden (full) ; in Erfüllung gehen (partial) |
| g3u05.w.to-enter | to enter | betreten | to enter (full) ; enter (full) ; to go into (partial) | betreten (full) ; eintreten (full) ; hineingehen (full) |
| g3u05.w.to-have-luck | to have (good/bad) luck | (Glück/Pech) haben | to have good luck (full) ; to have bad luck (full) ; to have luck (full) | Glück haben (full) ; Pech haben (full) ; (Glück/Pech) haben (full) |
| g3u05.w.to-ignore | to ignore | ignorieren | to ignore (full) ; ignore (full) | ignorieren (full) ; nicht beachten (full) |
| g3u05.w.to-make-a-wish | to make a wish | sich etwas wünschen | to make a wish (full) ; make a wish (full) | sich etwas wünschen (full) ; sich was wünschen (full) ; einen Wunsch äußern (partial) |
| g3u05.w.to-scream | to scream | schreien | to scream (full) ; scream (full) | schreien (full) ; aufschreien (full) |
| g3u05.w.to-shake | to shake | schütteln | to shake (full) ; shake (full) | schütteln (full) |
| g3u05.w.to-trick | to trick | austricksen | to trick (full) ; trick (full) | austricksen (full) ; hereinlegen (full) |
| g3u05.w.to-whistle | to whistle | pfeifen | to whistle (full) ; whistle (full) | pfeifen (full) |
| g3u05.w.to-wish-for-sth | to wish for sth. | sich etw. wünschen | to wish for sth. (full) ; wish for sth. (full) ; to wish for something (full) | sich etwas wünschen (full) ; sich etw. wünschen (full) ; sich was wünschen (full) |
| g3u05.w.toothbrush | toothbrush | Zahnbürste | toothbrush (full) ; a toothbrush (full) | Zahnbürste (full) ; die Zahnbürste (full) |
| g3u05.w.traditional | traditional | traditionell | traditional (full) | traditionell (full) |
| g3u05.w.unlucky | unlucky | unglücklich | unlucky (full) | unglücklich (full) ; glücklos (full) ; Unglücks- (partial) |

## Grammar items (9 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g3u05.gi.first-conditional.tr.001 | translation | Wenn es morgen regnet, werden wir zu Hause bleiben. [de] | If it rains tomorrow, we will stay at home. (full) ; If it rains tomorrow, we'll stay at home. (full) ; We will stay at home if it rains tomorrow. (full) | deToEn |
| g3u05.gi.first-conditional.tr.002 | translation | Wenn du nicht bald kommst, gehe ich ohne dich. [de] | If you don't come soon, I will go without you. (full) ; If you don't come soon, I'll go without you. (full) ; I will go without you if you don't come soon. (full) | deToEn |
| g3u05.gi.first-conditional.tr.005 | translation | Wenn wir den Bus verpassen, werden wir zu spät in die Schule kommen. [de] | If we miss the bus, we will be late for school. (full) ; If we miss the bus, we'll be late for school. (full) ; We will be late for school if we miss the bus. (full) | deToEn |
| g3u05.gi.first-conditional.tr.006 | translation | Wenn du einen Regenbogen siehst, kannst du dir etwas wünschen. [de] | If you see a rainbow, you can make a wish. (full) ; If you see a rainbow, you'll make a wish. (partial) | deToEn |
| g3u05.gi.unless.tr.001 | translation | Übersetze ins Englische: "Ich gehe nicht schwimmen, es sei denn, du kommst mit." [de] | I will not go swimming unless you come with me. (full) ; Unless you come with me, I will not go swimming. (full) ; I won't go swimming unless you come with me. (partial) | deToEn |
| g3u05.gi.unless.tr.002 | translation | Übersetze ins Englische: "Du wirst den Test nicht bestehen, wenn du nicht mehr lernst." [de] | You will not pass the test unless you study more. (full) ; Unless you study more, you will not pass the test. (full) ; You won't pass the test unless you study more. (partial) | deToEn |
| g3u05.gi.unless.tr.003 | translation | Übersetze ins Englische: "Wir werden zu spät kommen, es sei denn, wir laufen schneller." [de] | We will be late unless we run faster. (full) ; Unless we run faster, we will be late. (full) ; We'll be late unless we run faster. (partial) | deToEn |
| g3u05.gi.unless.tr.004 | translation | Übersetze ins Englische: "Du darfst nicht mit deinen Freunden spielen, wenn du deine Hausaufgaben nicht machst." [de] | You can not play with your friends unless you do your homework. (full) ; Unless you do your homework, you can not play with your friends. (full) ; You can't play with your friends unless you do your homework. (partial) | deToEn |
| g3u05.gi.unless.tr.005 | translation | Übersetze ins Englische: "Du wirst dich erkälten, es sei denn, du trägst eine Mütze." [de] | You will catch a cold unless you wear a hat. (full) ; Unless you wear a hat, you will catch a cold. (full) ; You'll catch a cold unless you wear a hat. (partial) | deToEn |

## Output contract

Write `content/corpus/units/g3-u05/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g3-u05",
  "lens": "translation",
  "itemsHash": "e1ddda3c1db0",
  "promptHash": "c6328b13b073",
  "round": 1,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 50, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
