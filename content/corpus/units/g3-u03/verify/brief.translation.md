# Verify lens — translation — g3-u03 (round 1)

<!-- domigo:verify translation g3-u03 items=5593126519b1 prompt=c6328b13b073 round=1 -->

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

## Vocab items (54)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g3u03.w.all-in-all | all in all | alles in allem | all in all (full) | alles in allem (full) |
| g3u03.w.awake | awake | wach | awake (full) | wach (full) |
| g3u03.w.curious | curious | neugierig | curious (full) | neugierig (full) |
| g3u03.w.decision | decision | Entscheidung | decision (full) | Entscheidung (full) |
| g3u03.w.departure | departure | Abflug | departure (full) | Abflug (full) ; Abfahrt (full) |
| g3u03.w.even-though | even though | obwohl | even though (full) | obwohl (full) |
| g3u03.w.experience | experience | Erfahrung | experience (full) | Erfahrung (full) ; Erlebnis (partial) |
| g3u03.w.explorer | explorer | Entdecker/Entdeckerin | explorer (full) | Entdecker (full) ; Entdeckerin (full) |
| g3u03.w.flight | flight | Flug | flight (full) | Flug (full) |
| g3u03.w.hut | hut | Hütte | hut (full) | Hütte (full) |
| g3u03.w.impossible | impossible | unmöglich | impossible (full) | unmöglich (full) |
| g3u03.w.it-takes | it takes (an hour) | es dauert (eine Stunde) | it takes (full) ; it takes an hour (full) | es dauert (full) ; es dauert eine Stunde (full) |
| g3u03.w.journey | journey | Reise | journey (full) ; trip (partial) | Reise (full) |
| g3u03.w.lonely | lonely | einsam | lonely (full) | einsam (full) |
| g3u03.w.on-foot | on foot | zu Fuß | on foot (full) | zu Fuß (full) |
| g3u03.w.painful | painful | schmerzhaft | painful (full) | schmerzhaft (full) |
| g3u03.w.pretty | pretty | ziemlich | pretty (full) | ziemlich (full) |
| g3u03.w.recently | recently | vor Kurzem | recently (full) | vor Kurzem (full) ; letztens (full) ; kürzlich (partial) |
| g3u03.w.thirsty | thirsty | durstig | thirsty (full) | durstig (full) |
| g3u03.w.to-become | to become | werden | become (full) ; to become (full) | werden (full) |
| g3u03.w.to-behave | to behave | verhalten | behave (full) ; to behave (full) | sich verhalten (full) ; sich benehmen (partial) |
| g3u03.w.to-criticise | to criticise | kritisieren | criticise (full) ; to criticise (full) | kritisieren (full) |
| g3u03.w.to-cross | to cross (a river) | (einen Fluss) überqueren | cross (full) ; to cross (full) ; cross a river (full) | überqueren (full) ; einen Fluss überqueren (full) |
| g3u03.w.to-drive | to drive (home) | (nach Hause) fahren | drive (full) ; to drive (full) ; drive home (full) | fahren (full) ; nach Hause fahren (full) |
| g3u03.w.to-escape | to escape (the midday heat) | (der Mittagshitze) entkommen | escape (full) ; to escape (full) ; escape the midday heat (full) | entkommen (full) ; der Mittagshitze entkommen (full) |
| g3u03.w.to-explore | to explore | erkunden | explore (full) ; to explore (full) | erkunden (full) ; erforschen (full) |
| g3u03.w.to-fix-sth | to fix sth. | etw. beheben | fix sth. (full) ; to fix sth. (full) ; fix (partial) | beheben (full) ; reparieren (full) |
| g3u03.w.to-fly | to fly (back) | (zurück-)fliegen | fly (full) ; to fly (full) ; fly back (full) | fliegen (full) ; zurückfliegen (full) |
| g3u03.w.to-get-close-to | to get close to (nature) | (der Natur) nahe kommen | get close to (full) ; to get close to (full) ; get close to nature (full) | nahe kommen (full) ; der Natur nahe kommen (full) |
| g3u03.w.to-get-into | to get into (a car) | in (ein Auto) einsteigen | get into (full) ; to get into (full) ; get into a car (full) | einsteigen (full) ; in ein Auto einsteigen (full) |
| g3u03.w.to-get-lost | to get lost | sich verirren | get lost (full) ; to get lost (full) | sich verirren (full) ; sich verlaufen (partial) |
| g3u03.w.to-get-off | to get off (the plane) | aus (dem Flugzeug) aussteigen | get off (full) ; to get off (full) ; get off the plane (full) | aussteigen (full) ; aus dem Flugzeug aussteigen (full) |
| g3u03.w.to-get-on | to get on (a plane) | in (ein Flugzeug) einsteigen | get on (full) ; to get on (full) ; get on a plane (full) | einsteigen (full) ; in ein Flugzeug einsteigen (full) |
| g3u03.w.to-get-out-of | to get out of (the car) | aus (dem Auto) aussteigen | get out of (full) ; to get out of (full) ; get out of the car (full) | aussteigen (full) ; aus dem Auto aussteigen (full) |
| g3u03.w.to-get-to | to get to (the airport) | zum (Flughafen) kommen | get to (full) ; to get to (full) ; get to the airport (full) | kommen (full) ; zum Flughafen kommen (full) ; ankommen (partial) |
| g3u03.w.to-get-to-know-sb-sth | to get to know sb./sth. | jdn./etw. näher kennenlernen | get to know sb./sth. (full) ; to get to know sb./sth. (full) ; get to know (partial) | näher kennenlernen (full) ; kennenlernen (full) |
| g3u03.w.to-land | to land | landen | land (full) ; to land (full) | landen (full) |
| g3u03.w.to-make-a-reservation | to make a reservation | eine Reservierung vornehmen | make a reservation (full) ; to make a reservation (full) | eine Reservierung vornehmen (full) ; reservieren (partial) |
| g3u03.w.to-meet-up-with | to meet up with (people) | sich mit (Leuten) treffen | meet up with (full) ; to meet up with (full) ; meet up with people (full) | sich treffen mit (full) ; sich mit Leuten treffen (full) |
| g3u03.w.to-note | to note | beachten | note (full) ; to note (full) | beachten (full) ; feststellen (partial) |
| g3u03.w.to-promise | to promise | versprechen | promise (full) ; to promise (full) | versprechen (full) |
| g3u03.w.to-reach | to reach | (er-)reichen | reach (full) ; to reach (full) | erreichen (full) ; reichen (partial) |
| g3u03.w.to-recommend | to recommend | empfehlen | recommend (full) ; to recommend (full) | empfehlen (full) |
| g3u03.w.to-rent | to rent (a car) | (ein Auto) mieten | rent (full) ; to rent (full) ; rent a car (full) | mieten (full) ; ein Auto mieten (full) |
| g3u03.w.to-sail | to sail | segeln | sail (full) ; to sail (full) | segeln (full) |
| g3u03.w.to-set-off | to set off (for work) | (zur Arbeit) aufbrechen | set off (full) ; to set off (full) ; set off for work (full) | aufbrechen (full) ; zur Arbeit aufbrechen (full) ; losfahren (partial) |
| g3u03.w.to-sleep-in-a-tent | to sleep in a tent | in einem Zelt schlafen | sleep in a tent (full) ; to sleep in a tent (full) | in einem Zelt schlafen (full) |
| g3u03.w.to-suffer-from-altitude-sickness | to suffer from altitude sickness | an Höhenkrankheit leiden | suffer from altitude sickness (full) ; to suffer from altitude sickness (full) | an Höhenkrankheit leiden (full) |
| g3u03.w.to-take-off | to take off | abheben | take off (full) ; to take off (full) | abheben (full) ; starten (full) |
| g3u03.w.to-turn-out | to turn out | sich herausstellen | turn out (full) ; to turn out (full) | sich herausstellen (full) |
| g3u03.w.to-work-on | to work on (a blog) | an (einem Blog) arbeiten | work on (full) ; to work on (full) ; work on a blog (full) | an etwas arbeiten (full) ; daran arbeiten (full) |
| g3u03.w.traveller | traveller | Reisender/Reisende | traveller (full) ; traveler (partial) | Reisender (full) ; Reisende (full) |
| g3u03.w.unfortunately | unfortunately | leider | unfortunately (full) | leider (full) |
| g3u03.w.wilderness | wilderness | Wildnis | wilderness (full) | Wildnis (full) |

## Grammar items (9 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g3u03.gi.it-takes.tr.002 | translation | Wie lange hast du gebraucht, um das Buch zu lesen? [de] | How long did it take you to read the book? (full) ; How long did it take to read the book? (partial) | deToEn |
| g3u03.gi.it-takes.tr.003 | translation | Es hat uns zwei Stunden gedauert, um nach Hause zu fahren. [de] | It took us two hours to drive home. (full) ; It took us two hours to get home. (full) | deToEn |
| g3u03.gi.it-takes.tr.004 | translation | It takes me an hour to do my homework. [en] | Ich brauche eine Stunde, um meine Hausaufgaben zu machen. (full) ; Ich brauche eine Stunde für meine Hausaufgaben. (partial) | enToDe |
| g3u03.gi.it-takes.tr.005 | translation | Ich brauche zehn Minuten, um zur Schule zu gehen. [de] | It takes me ten minutes to walk to school. (full) ; It takes me ten minutes to get to school. (full) ; It takes me 10 minutes to walk to school. (full) ; It takes me ten minutes to go to school. (full) | deToEn |
| g3u03.gi.time-connectors.tr.001 | translation | Während des Unterrichts darf man nicht essen. [de] | During the lesson, you mustn't eat. (full) ; You mustn't eat during the lesson. (full) ; During class, you mustn't eat. (partial) | deToEn |
| g3u03.gi.time-connectors.tr.002 | translation | Während wir auf den Bus warteten, begann es zu schneien. [de] | While we were waiting for the bus, it started to snow. (full) ; It started to snow while we were waiting for the bus. (full) ; While we were waiting for the bus, it started snowing. (partial) | deToEn |
| g3u03.gi.time-connectors.tr.003 | translation | Bevor wir ins Kino gingen, haben wir Pizza gegessen. [de] | Before we went to the cinema, we ate pizza. (full) ; We ate pizza before we went to the cinema. (full) ; Before we went to the cinema, we had pizza. (partial) | deToEn |
| g3u03.gi.time-connectors.tr.004 | translation | Während der Pause hat es angefangen zu regnen. [de] | During the break, it started to rain. (full) ; It started to rain during the break. (full) ; During the break, it started raining. (partial) | deToEn |
| g3u03.gi.time-connectors.tr.006 | translation | Die Kinder warteten, bis der Zug kam. [de] | They waited until the train came. (full) ; They waited until the train arrived. (partial) ; The children waited until the train came. (full) | deToEn |

## Output contract

Write `content/corpus/units/g3-u03/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g3-u03",
  "lens": "translation",
  "itemsHash": "5593126519b1",
  "promptHash": "c6328b13b073",
  "round": 1,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 63, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
