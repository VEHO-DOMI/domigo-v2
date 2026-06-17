# Verify lens — translation — g3-u02 (round 1)

<!-- domigo:verify translation g3-u02 items=64ae9f12e91f prompt=c6328b13b073 round=1 -->

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

## Vocab items (42)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g3u02.w.author | author | Autor/Autorin | author (full) ; writer (partial) | Autor (full) ; Autorin (full) ; Schriftsteller (partial) |
| g3u02.w.awful | awful | furchtbar | awful (full) | furchtbar (full) ; schrecklich (full) ; scheußlich (full) |
| g3u02.w.careless | careless | unvorsichtig | careless (full) | unvorsichtig (full) ; leichtsinnig (full) |
| g3u02.w.coincidence | coincidence | Zufall | coincidence (full) | Zufall (full) ; ein Zufall (full) |
| g3u02.w.date-of-birth | date of birth | Geburtsdatum | date of birth (full) | Geburtsdatum (full) |
| g3u02.w.entrance | entrance | Eingang | entrance (full) ; way in (partial) | Eingang (full) |
| g3u02.w.handbag | handbag | Handtasche | handbag (full) | Handtasche (full) |
| g3u02.w.hang-on-a-minute | Hang on a minute. | Ein Augenblick (mal). | Hang on a minute. (full) ; Hang on a minute (full) | Ein Augenblick. (full) ; Einen Augenblick. (full) ; Moment mal. (partial) |
| g3u02.w.hold-on | Hold on! | Warte(t)! | Hold on! (full) ; Hold on (full) | Warte! (full) ; Wartet! (full) ; Moment! (partial) |
| g3u02.w.i-beg-your-pardon | I beg your pardon. | Entschuldigung | I beg your pardon. (full) ; I beg your pardon (full) | Entschuldigung (full) ; Verzeihung (full) ; Wie bitte? (partial) |
| g3u02.w.laugh | laugh | Lacher | laugh (full) | Lacher (full) ; Lachen (partial) |
| g3u02.w.married | married | verheiratet | married (full) | verheiratet (full) |
| g3u02.w.member | member | Mitglied | member (full) | Mitglied (full) ; ein Mitglied (full) |
| g3u02.w.north-pole | North Pole | Nordpol | North Pole (full) | Nordpol (full) |
| g3u02.w.note | note | Geldschein | note (full) | Geldschein (full) ; Schein (partial) |
| g3u02.w.passenger | passenger | Passagier/Passagierin | passenger (full) | Passagier (full) ; Passagierin (full) ; Fahrgast (partial) |
| g3u02.w.per-cent | per cent | Prozent | per cent (full) ; percent (partial) | Prozent (full) |
| g3u02.w.queue | queue | Warteschlange | queue (full) ; line (partial) | Warteschlange (full) ; Schlange (full) |
| g3u02.w.similar | similar | ähnlich | similar (full) | ähnlich (full) |
| g3u02.w.south-pole | South Pole | Südpol | South Pole (full) | Südpol (full) |
| g3u02.w.speech | speech | Rede | speech (full) | Rede (full) ; Ansprache (full) |
| g3u02.w.stage | stage | Bühne | stage (full) | Bühne (full) |
| g3u02.w.thief | thief (pl thieves) | Dieb/Diebin | thief (full) | Dieb (full) ; Diebin (full) |
| g3u02.w.to-achieve | to achieve (a goal) | (ein Ziel) erreichen | achieve (full) ; to achieve (full) | erreichen (full) ; ein Ziel erreichen (full) ; schaffen (partial) |
| g3u02.w.to-buy-sth | to buy sth. | etw. kaufen | buy (full) ; buy sth. (full) ; to buy sth. (full) | kaufen (full) ; etw. kaufen (full) ; etwas kaufen (full) |
| g3u02.w.to-drink-eat-sth | to drink/eat sth. | etw. trinken/essen | drink (full) ; eat (full) ; drink/eat sth. (full) | etw. trinken/essen (full) ; trinken (full) ; essen (full) |
| g3u02.w.to-hand-sth-in | to hand sth. in | abgeben | hand in (full) ; hand sth. in (full) ; to hand sth. in (full) | abgeben (full) ; einreichen (full) |
| g3u02.w.to-leave-sb-alone | to leave sb. alone | jdn. in Ruhe lassen | leave sb. alone (full) ; to leave sb. alone (full) | jemanden in Ruhe und Frieden lassen (full) ; jemanden in Ruhe lassen (full) ; jdn. in Ruhe lassen (partial) |
| g3u02.w.to-listen-to-music | to listen to music | Musik hören | listen to music (full) ; to listen to music (full) | Musik hören (full) ; Musik anhören (partial) |
| g3u02.w.to-look-at-sth | to look at sth. | etw. ansehen | look at (full) ; look at sth. (full) ; to look at sth. (full) | etw. ansehen (full) ; etwas anschauen (full) ; ansehen (full) |
| g3u02.w.to-look-forward-to-sth | to look forward to sth. | sich auf etw. freuen | look forward to (full) ; look forward to sth. (full) ; to look forward to sth. (full) | sich auf etw. freuen (full) ; sich auf etwas freuen (full) |
| g3u02.w.to-pay-the-bill | to pay the bill | die Rechnung bezahlen | pay the bill (full) ; to pay the bill (full) | die Rechnung bezahlen (full) ; die Rechnung zahlen (full) |
| g3u02.w.to-queue | to queue (up) | sich anstellen | queue (full) ; queue up (full) ; to queue up (full) | sich anstellen (full) ; anstellen (full) ; Schlange stehen (partial) |
| g3u02.w.to-return | to return | zurückgeben | return (full) ; to return (full) ; give back (partial) | zurückgeben (full) ; zurückkehren (full) ; zurückbringen (partial) |
| g3u02.w.to-sink | to sink | sinken | sink (full) ; to sink (full) | sinken (full) ; untergehen (partial) |
| g3u02.w.to-steal | to steal | stehlen | steal (full) ; to steal (full) | stehlen (full) ; klauen (partial) |
| g3u02.w.to-survive | to survive | überleben | survive (full) ; to survive (full) | überleben (full) |
| g3u02.w.to-talk-on-the-mobile | to talk on the mobile | am Handy telefonieren | talk on the mobile (full) ; to talk on the mobile (full) | am Handy telefonieren (full) ; mit dem Handy telefonieren (full) |
| g3u02.w.to-try-on-sunglasses | to try on sunglasses | Sonnenbrillen anprobieren | try on sunglasses (full) ; to try on sunglasses (full) | Sonnenbrillen anprobieren (full) ; eine Sonnenbrille anprobieren (partial) |
| g3u02.w.to-try-out | to try out | ausprobieren | try out (full) ; to try out (full) | ausprobieren (full) ; austesten (partial) |
| g3u02.w.to-wave | to wave | winken | wave (full) ; to wave (full) | winken (full) |
| g3u02.w.what-a | What a ...! | Was für ein/e ...! | What a (full) ; What a ...! (full) | Was für ein (full) ; Was für eine (full) ; Was für ein/e ...! (full) |

## Grammar items (5 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g3u02.gi.past-continuous.tr.001 | translation | Ich ging gerade zur Schule, als es zu regnen begann. [de] | I was walking to school when it began to rain. (full) ; I was walking to school when it began raining. (full) | deToEn |
| g3u02.gi.past-continuous.tr.002 | translation | Während wir zu Abend aßen, klingelte plötzlich das Telefon. [de] | While we were having dinner, the phone suddenly rang. (full) ; While we were eating dinner, the phone suddenly rang. (full) ; While we were having dinner, the phone rang suddenly. (full) | deToEn |
| g3u02.gi.past-continuous.tr.003 | translation | Was hast du gestern um 9 Uhr gemacht? [de] | What were you doing at 9 o'clock yesterday? (full) ; What were you doing yesterday at 9 o'clock? (full) | deToEn |
| g3u02.gi.past-continuous.tr.004 | translation | Die Sonne schien und alle stellten sich am Eingang an. [de] | The sun was shining and everybody was queuing at the entrance. (full) ; The sun was shining and everybody was queueing at the entrance. (full) | deToEn |
| g3u02.gi.past-continuous.tr.005 | translation | Ich habe gerade ein Buch gelesen, als du mich angerufen hast. [de] | I was reading a book when you called me. (full) ; I was reading a book when you phoned me. (full) ; I was reading a book when you rang me. (full) | deToEn |

## Output contract

Write `content/corpus/units/g3-u02/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g3-u02",
  "lens": "translation",
  "itemsHash": "64ae9f12e91f",
  "promptHash": "c6328b13b073",
  "round": 1,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 47, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
