# Verify lens — answers — g4-u08 (round 1)

<!-- domigo:verify answers g4-u08 items=5f8f7f160504 prompt=70fa2d8cdf22 round=1 -->

<!-- domigo:prompt verify-answers v=1 -->
# Lens 2 — answer-set completeness + in-sentence grammaticality (adversarial)

You are an independent, adversarial verifier. You did NOT write these items. For every
item, attack the answer machinery:

1. **Completeness:** put yourself in the student's seat and enumerate every answer a
   competent student could legitimately give. Is each one in the answer set at the
   right tier? A CORRECT answer marked wrong is the single worst failure this app can
   ship (it is exactly how v1 died). Check especially: contractions (we should not /
   we shouldn't), British/American variants, optional subjects, word-order variants,
   plural/singular both fitting, synonyms within the bank.
2. **Grammaticality:** substitute EVERY full-tier answer into the blank/carrier and
   read the whole sentence aloud. Wrong a/an, broken agreement, double words,
   capitalization mismatches at sentence start — all `fix`.
3. **Distractor safety:** for choice formats, could any distractor be defended as
   correct in this exact context? A defensible distractor = `fix`
   (kind `distractor-plausible-correct`). Distractors must be unambiguously wrong.
4. **Blank arity:** the declared blanks, the `___` markers, and the per-blank pipe
   segments in answers must agree (the machine checks counts; you check SENSE — does
   each segment actually fit its blank?).
5. **strict flag:** items where fuzzy matching would wrongly accept near-misses
   (minimal pairs like "should/shouldn't"!) need `strict: true` — flag if missing
   (kind `answer-incomplete`, say so in the note).

Flag kind menu: `answer-incomplete`, `answer-ungrammatical`,
`distractor-plausible-correct`. Severity `fix` for anything that would mis-grade a
real student; `warn` for defensible-but-improvable.

## Vocab items (31)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g4u08.w.addict | addict | somebody who cannot stop doing a thing that is very bad for them | He plays on his screen all night and cannot stop. Everybody calls him a screen ___. | addict (full) | addict (full) | judge ; librarian ; monk |
| g4u08.w.addiction | addiction | when somebody cannot stop doing a thing that is very bad for them | She cannot stop looking at her screen; she has a bad ___. | addiction (full) | addiction (full) | collection ; fascination ; command |
| g4u08.w.auction | auction | a place where books, cars and pictures go to the people who pay the most money | At an ___ you can pay a lot of money for a very old painting. | auction (full) | auction (full) | collection ; library ; monastery |
| g4u08.w.black-market | black market | an illegal place where you pay money for what you cannot find in any shop | You cannot find these in any shop. People have to use the ___. | black market (full) | black market (full) | auction ; library ; collection |
| g4u08.w.burn-to-the-ground | burn to the ground | to be destroyed completely in a fire | The old house was on fire all night and ___. | burned to the ground (full) ; burnt to the ground (full) ; burn to the ground (partial) | burn to the ground (full) ; burned to the ground (full) ; burnt to the ground (full) | rob ; execute ; preserve |
| g4u08.w.collect | collect | to look for and keep many books, cars or pictures because you love them | I love to ___ pretty stones and rocks from the beach. | collect (full) | collect (full) | preserve ; rob ; shorten |
| g4u08.w.collection | collection | all the books, cars or pictures that somebody keeps because they love them | She has an amazing ___ of old cars at home. | collection (full) | collection (full) | fascination ; auction ; addiction |
| g4u08.w.command | command | an order from somebody that everybody must do at once | When the officer calls out a ___, all the men must do it at once. | command (full) | command (full) | collection ; auction ; fascination |
| g4u08.w.confuse-sb | confuse sb | to make somebody think and think but still not understand a thing | I do not understand the new lesson at all; it really ___ me. | confuses (full) | confuse sb (full) ; confuse (full) ; confuses (full) | preserve ; collect ; shorten |
| g4u08.w.copy | copy | one of the many books that all look just like it | The library has three ___ of that famous book. | copies (full) | copy (full) ; copies (full) | collection ; auction ; library |
| g4u08.w.execute | execute | to put somebody to death in prison for a very bad crime | After the murder, the man was ___ in prison. | executed (full) | execute (full) ; executed (full) | rob ; preserve ; shorten |
| g4u08.w.fascination | fascination | when you love a thing so much that you want to know all about it | His ___ with sand is so strong that he reads about it all day. | fascination (full) | fascination (full) | collection ; addiction ; command |
| g4u08.w.furious | furious | very, very angry | I am ___ that nobody asked me first. | furious (full) | furious (full) | rare ; precious ; pale |
| g4u08.w.go-crazy | go crazy | to start to feel very angry, or to lose control of how you feel | If I have to wait in this queue much longer, I am going to ___! | go crazy (full) | go crazy (full) | turn up ; miss out on sth ; burn to the ground |
| g4u08.w.judge | judge | a man or woman in court who can put a thief in prison | The ___ gives the murderer ten years in prison. | judge (full) | judge (full) | librarian ; monk ; addict |
| g4u08.w.kitschy | kitschy | too bright and a little funny to look at, and not nice at all | The restaurant is decorated with ___, colourful pictures that I do not really like. | kitschy (full) | kitschy (full) | rare ; furious ; precious |
| g4u08.w.librarian | librarian | a man or woman who looks after all the books in a library | Ask the ___ if you cannot find the book you want in the library. | librarian (full) | librarian (full) | judge ; monk ; addict |
| g4u08.w.library | library | a place where many books are free for everybody to read or borrow | I never have to pay for books here. I borrow them all from the ___. | library (full) | library (full) | auction ; monastery ; collection |
| g4u08.w.miss-out-on-sth | miss out on sth | to not be there for a thing, so you cannot enjoy it | Everybody is talking about the new show, and I do not want to ___ on it. | miss out (full) | miss out on sth (full) ; miss out on something (full) ; miss out (full) | go crazy ; turn up ; confuse sb |
| g4u08.w.monastery | monastery | a big old building where monks live and pray | The monks lived in a big old ___ in the mountains. | monastery (full) | monastery (full) | library ; auction ; collection |
| g4u08.w.monk | monk | a man who lives in a monastery and prays every day | A ___ is a man who lives and prays in a monastery. | monk (full) | monk (full) | judge ; librarian ; addict |
| g4u08.w.pale | pale | with very little red in your skin, often because you feel ill | She was ill in bed for a week, so now she looks very ___. | pale (full) | pale (full) | furious ; rare ; precious |
| g4u08.w.precious | precious | very expensive or very dear to somebody | This old photograph of my grandmother is very ___ to me. | precious (full) | precious (full) | rare ; furious ; pale |
| g4u08.w.preserve | preserve | to keep an old building or thing in good order so it does not go away | We must ___ these old buildings so that our children can enjoy them too. | preserve (full) | preserve (full) | collect ; rob ; shorten |
| g4u08.w.rare | rare | not found very often | You will not find many of these. They are very ___. | rare (full) | rare (full) | furious ; precious ; pale |
| g4u08.w.rob | rob | to take money or jewels from a house or shop that is not yours | Thieves came into the house at night to ___ the family of all their money. | rob (full) | rob (full) | preserve ; collect ; execute |
| g4u08.w.sentence-to-death | sentence to death | to tell somebody in court that they must die for a very bad crime | The judge ___ the murderer, and he was executed a week afterwards. | sentenced to death (full) ; sentence to death (partial) | sentence to death (full) ; sentenced to death (full) | burn to the ground ; go crazy ; miss out on sth |
| g4u08.w.sheet | sheet | a thin, white piece that you write on | Take out a clean ___ and write your homework on it. | sheet (full) | sheet (full) | copy ; command ; collection |
| g4u08.w.shorten | shorten | to make a book, a show or a thing shorter in time | That book was much too long, so they had to ___ it. | shorten (full) | shorten (full) | collect ; preserve ; rob |
| g4u08.w.turn-up | turn up | to come or arrive, often when nobody waits for you | We waited a long time, but our guests did not ___. | turn up (full) | turn up (full) | go crazy ; miss out on sth ; whisper |
| g4u08.w.whisper | whisper | to talk to somebody very, very close to their ear so it is a secret | He ___ in my ear to tell me the secret. | whispered (full) | whisper (full) ; whispered (full) | turn up ; go crazy ; confuse sb |

## Grammar items (58)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g4u08.gi.tense-time-expression-review.ag.001 | anagram | Welches Zeitwort gehört zu have/has + 3. Form und bedeutet "vor Kurzem"? Ordne die Buchstaben: y t l n e e c r [de] | recently (full) | — | — | — | — | false |
| g4u08.gi.tense-time-expression-review.cp.003 | context-picker | Der Bibliothekar arbeitet noch heute hier, und das schon lange. Welcher Satz passt? [de] | He has been a librarian for twenty years. (full) | — | He was a librarian for twenty years. ; He has been a librarian since twenty years. ; He is a librarian since twenty years. | — | — | false |
| g4u08.gi.tense-time-expression-review.cp.004 | context-picker | Du fragst einen Freund nach seiner Erfahrung mit dem Sammeln. Welche Frage passt? [de] | Have you ever collected anything? (full) | — | Did you ever collected anything? ; Have you collected anything yesterday? ; Do you ever collected anything? | — | — | false |
| g4u08.gi.tense-time-expression-review.cp.005 | context-picker | Sieh dir die Lage an: Anna sammelt Sand. Anna hat 2019 angefangen und sammelt heute noch. Welcher Satz passt? [de] | She has collected sand since 2019. (full) | — | She collected sand since 2019. ; She has collected sand in 2019. ; She collected sand recently. | — | — | false |
| g4u08.gi.tense-time-expression-review.cp.006 | context-picker | Deine Freundin erzählt von ihrer Reise. Letzte Woche war sie in London und ist jetzt wieder zu Hause. Welcher Satz passt? [de] | I visited London last week. (full) | — | I have visited London last week. ; I have visited London recently. ; I have lived in London since last week. | — | — | false |
| g4u08.gi.tense-time-expression-review.ec.001 | error-correction | Finde und verbessere den Fehler: I have visited London last summer. [de] | I visited London last summer. (full) ; I visited London last summer (partial) | — | — | — | — | false |
| g4u08.gi.tense-time-expression-review.ec.002 | error-correction | Finde und verbessere den Fehler: I live in this city since five years. [de] | I have lived in this city for five years. (full) ; I've lived in this city for five years. (full) | — | — | — | — | false |
| g4u08.gi.tense-time-expression-review.ec.003 | error-correction | Finde und verbessere den Fehler: The judge has arrived two days ago. [de] | The judge arrived two days ago. (full) ; The judge arrived two days ago (partial) | — | — | — | — | false |
| g4u08.gi.tense-time-expression-review.ec.004 | error-correction | Finde und verbessere den Fehler: I am a collector since 2019. [de] | I have been a collector since 2019. (full) ; I've been a collector since 2019. (full) | — | — | — | — | false |
| g4u08.gi.tense-time-expression-review.ec.005 | error-correction | Finde und verbessere den einen Fehler: She visited London ___ Monday. [de, 1 blank(s)] | since (full) | — | — | — | — | true |
| g4u08.gi.tense-time-expression-review.ec.006 | error-correction | Finde und verbessere den Fehler: She has collected stones last weekend. [de] | She collected stones last weekend. (full) ; She collected stones last weekend (partial) | — | — | — | — | false |
| g4u08.gi.tense-time-expression-review.ec.007 | error-correction | Finde und verbessere den Fehler: I have lived here for I was a child. [de] | I have lived here since I was a child. (full) ; I've lived here since I was a child. (full) | — | — | — | — | false |
| g4u08.gi.tense-time-expression-review.gf.001 | gap-fill | Setze die einfache Form von früher (2. Form) ein: I ___ (visit) my grandma last weekend. [de, 1 blank(s)] | visited (full) | — | — | — | — | false |
| g4u08.gi.tense-time-expression-review.gf.002 | gap-fill | have/has + die 3. Form? Setze ein: I have ___ (collect) sand since 2019. [de, 1 blank(s)] | collected (full) | — | — | — | — | false |
| g4u08.gi.tense-time-expression-review.gf.003 | gap-fill | Das Wort der Vollendung mit "just" oder "recently": She has ___ joined our group. (gerade) [de, 1 blank(s)] | just (full) ; recently (partial) | — | — | — | — | false |
| g4u08.gi.tense-time-expression-review.gf.004 | gap-fill | Setze die richtige Form ein: We ___ (live) in Vienna for ten years. [de, 1 blank(s)] | have lived (full) ; 've lived (full) | — | — | — | — | false |
| g4u08.gi.tense-time-expression-review.gf.006 | gap-fill | Abgeschlossene Zeit: The monk ___ (preserve) the books in 2013. [de, 1 blank(s)] | preserved (full) | — | — | — | — | false |
| g4u08.gi.tense-time-expression-review.gf.007 | gap-fill | for oder since? She has collected pictures ___ she was ten. [de, 1 blank(s)] | since (full) | — | — | — | — | false |
| g4u08.gi.tense-time-expression-review.gf.008 | gap-fill | for oder since? He has played the guitar ___ three years. [de, 1 blank(s)] | for (full) | — | — | — | — | false |
| g4u08.gi.tense-time-expression-review.gf.009 | gap-fill | Zwei Lücken: She ___ (move) to London two years ago, and she ___ (live) there since then. [de, 2 blank(s)] | moved \| has lived (full) ; moved \| 's lived (full) | — | — | — | — | false |
| g4u08.gi.tense-time-expression-review.gf.010 | gap-fill | Zwei Lücken: Last year the library ___ (rob), but the books ___ (not / turn) up since then. [de, 2 blank(s)] | was robbed \| haven't turned (full) ; was robbed \| have not turned (full) | — | — | — | — | false |
| g4u08.gi.tense-time-expression-review.gf.011 | gap-fill | Zwei Lücken (Frage + Antwort): ___ you ever ___ (collect) anything? — Yes, I ___ (collect) stones in 2013. [de, 3 blank(s)] | Have \| collected \| collected (full) | — | — | — | — | false |
| g4u08.gi.tense-time-expression-review.gf.012 | gap-fill | Setze die 2. Form ein: A few moments later I ___ (start) to play again. [de, 1 blank(s)] | started (full) | — | — | — | — | false |
| g4u08.gi.tense-time-expression-review.gf.013 | gap-fill | Wähle die Zeit nach dem Signalwort: The judge ___ (arrive) recently, and the monk ___ (whisper) to him an hour ago. [de, 2 blank(s)] | has arrived \| whispered (full) ; 's arrived \| whispered (full) | — | — | — | — | false |
| g4u08.gi.tense-time-expression-review.gf.014 | gap-fill | Setze die 2. Form ein: They ___ (rob) the bank last year. [de, 1 blank(s)] | robbed (full) | — | — | — | — | false |
| g4u08.gi.tense-time-expression-review.gf.015 | gap-fill | have/has + 3. Form: The monk ___ (live) in the monastery for many years. [de, 1 blank(s)] | has lived (full) ; 's lived (full) | — | — | — | — | false |
| g4u08.gi.tense-time-expression-review.gf.016 | gap-fill | Wähle das Zeitwort: I have ___ looked at the collection. (gerade eben) [de, 1 blank(s)] | just (full) | — | — | — | — | false |
| g4u08.gi.tense-time-expression-review.gf.017 | gap-fill | Setze die 2. Form ein: I ___ (look) at the rare books in the library yesterday. [de, 1 blank(s)] | looked (full) | — | — | — | — | false |
| g4u08.gi.tense-time-expression-review.gf.018 | gap-fill | Zwei Lücken: He ___ (collect) tickets since he was ten, and last year he ___ (join) a club for collectors. [de, 2 blank(s)] | has collected \| joined (full) ; 's collected \| joined (full) | — | — | — | — | false |
| g4u08.gi.tense-time-expression-review.gf.019 | gap-fill | Seit Montag (since) — mit not: I ___ (not / visit) the library since Monday. [de, 1 blank(s)] | haven't visited (full) ; have not visited (full) | — | — | — | — | false |
| g4u08.gi.tense-time-expression-review.gs.001 | group-sort | Sortiere die Zeitwörter: Welche zeigen eine abgeschlossene Zeit, welche reichen bis jetzt? [de] | — | — | — | — | yesterday / ago / last year: yesterday, two years ago, last weekend, in 2013 \| since / for / recently: since 2019, for ten years, recently, since Monday | false |
| g4u08.gi.tense-time-expression-review.gs.005 | group-sort | Sortiere die Wörter: stehen sie vor einer Spanne (for) oder vor einem Anfangspunkt (since)? [de] | — | — | — | — | for: ten years, many years, three years, two weeks \| since: 2019, Monday, I was ten, last year | false |
| g4u08.gi.tense-time-expression-review.gs.006 | group-sort | Sortiere die Wörter: einfache Form von früher (2. Form) oder Form mit have/has (3. Form)? [de] | — | — | — | — | visited / collected: visited, collected, robbed, moved \| have visited / have collected: have visited, have collected, have robbed, have moved | false |
| g4u08.gi.tense-time-expression-review.mc.001 | multiple-choice | Welcher Satz ist richtig? [de] | I have never collected anything. (full) | — | I have never collect anything. ; I am never collecting anything. ; I never collecting anything. | — | — | false |
| g4u08.gi.tense-time-expression-review.mc.002 | multiple-choice | Welches Zeitwort passt NICHT zu have/has + 3. Form? [de] | yesterday (full) | — | just ; recently ; never | — | — | false |
| g4u08.gi.tense-time-expression-review.mc.003 | multiple-choice | Welches Wort passt? She has ___ collected sand for many years. [de, 1 blank(s)] | recently (full) | — | yesterday ; ago ; last year | — | — | false |
| g4u08.gi.tense-time-expression-review.mc.004 | multiple-choice | Welcher Satz ist FALSCH? [de] | I have visited London last year. (full) | — | I visited London last year. ; I have just visited London. ; I have recently visited London. | — | — | false |
| g4u08.gi.tense-time-expression-review.mc.006 | multiple-choice | Welcher Satz ist richtig? [de] | I have lived in Vienna since 2019. (full) | — | I have lived in Vienna in 2019. ; I lived in Vienna since 2019. ; I live in Vienna since 2019. | — | — | false |
| g4u08.gi.tense-time-expression-review.mc.007 | multiple-choice | Wähle das richtige Paar: I ___ here ___ 2019. [de, 2 blank(s)] | have lived \| since (full) | — | have lived ... for ; live ... since ; lived ... since | — | — | false |
| g4u08.gi.tense-time-expression-review.mt.002 | matching | Welche Frage passt zu welcher Antwort? [de] | — | — | — | How long have you collected sand? ↔ For many years. ; When did you start your collection? ↔ Two years ago. ; Where did you visit last summer? ↔ I visited Spain. ; Have you collected anything recently? ↔ Yes, I have. | — | false |
| g4u08.gi.tense-time-expression-review.mt.003 | matching | Welcher Satzanfang gehört zu welchem Satzende? [de] | — | — | — | I have collected shells ↔ ever since I was small. ; She has lived here ↔ for ten years. ; He bought the painting ↔ at the auction last year. ; We robbed the bank ↔ and then we ran away. | — | false |
| g4u08.gi.tense-time-expression-review.qf.001 | question-formation | Bilde die Frage nach der Erfahrung: you / collect / anything (Erfahrung, schon einmal?) [de] | Have you ever collected anything? (full) ; Have you collected anything? (partial) | — | — | — | — | false |
| g4u08.gi.tense-time-expression-review.qf.002 | question-formation | Bilde die Frage nach einem abgeschlossenen Zeitpunkt: when / you / start / your collection [de] | When did you start your collection? (full) | — | — | — | — | false |
| g4u08.gi.tense-time-expression-review.qf.003 | question-formation | Bilde die Frage nach der Dauer bis jetzt: how long / you / collect / sand [de] | How long have you collected sand? (full) | — | — | — | — | false |
| g4u08.gi.tense-time-expression-review.sb.001 | sentence-building | Bring die Wörter in die richtige Reihenfolge: she / has / sand / for / collected / years / many [de] | She has collected sand for many years. (full) ; She has collected sand for many years (partial) | — | — | — | — | false |
| g4u08.gi.tense-time-expression-review.sb.002 | sentence-building | Bring die Wörter in die richtige Reihenfolge: I / the / visited / last / library / weekend [de] | I visited the library last weekend. (full) ; I visited the library last weekend (partial) | — | — | — | — | false |
| g4u08.gi.tense-time-expression-review.sb.003 | sentence-building | Bring die Wörter in die richtige Reihenfolge: the / robbed / monastery / two / ago / thieves / years [de] | The thieves robbed the monastery two years ago. (full) ; The thieves robbed the monastery two years ago (partial) | — | — | — | — | false |
| g4u08.gi.tense-time-expression-review.tf.001 | transformation | Ändere den Zeitausdruck und passe die Zeit an: "I visit the museum every Friday." → mit "last Friday": I ___. [de, 1 blank(s)] | visited the museum last Friday (full) ; I visited the museum last Friday. (full) | — | — | — | — | false |
| g4u08.gi.tense-time-expression-review.tf.002 | transformation | Ändere den Zeitausdruck und passe die Zeit an: "She collected stones last year." → mit "recently": She ___. [de, 1 blank(s)] | has recently collected stones (full) ; She has recently collected stones. (full) ; 's recently collected stones (partial) | — | — | — | — | false |
| g4u08.gi.tense-time-expression-review.tf.005 | transformation | Ändere den Zeitausdruck und passe die Zeit an: "They rob a bank every year." → mit "last year": They ___. [de, 1 blank(s)] | robbed a bank last year (full) ; They robbed a bank last year. (full) | — | — | — | — | false |
| g4u08.gi.tense-time-expression-review.tf.006 | transformation | Antworte deiner Freundin, wie lange du schon hier wohnst: "I ___ (live) here ___ ten years." [de, 2 blank(s)] | have lived \| for (full) ; 've lived \| for (full) | — | — | — | — | false |
| g4u08.gi.tense-time-expression-review.tf.007 | transformation | Erzähle deinem Brieffreund, seit wann du den Mönch nicht gesehen hast: "I ___ (not / visit) the monk ___ last Monday." [de, 2 blank(s)] | haven't visited \| since (full) ; have not visited \| since (full) | — | — | — | — | false |
| g4u08.gi.tense-time-expression-review.tr.001 | translation | Ich wohne seit drei Jahren in Vienna. [de] | I have lived in Vienna for three years. (full) ; I've lived in Vienna for three years. (full) | deToEn | — | — | — | false |
| g4u08.gi.tense-time-expression-review.tr.002 | translation | Ich sammle Bücher, seit ich zehn war. [de] | I have collected books since I was ten. (full) ; I've collected books since I was ten. (full) ; I have collected books since I was ten (partial) | deToEn | — | — | — | false |
| g4u08.gi.tense-time-expression-review.tr.003 | translation | Letztes Jahr besuchte ich das Kloster in Spain. [de] | Last year I visited the monastery in Spain. (full) ; I visited the monastery in Spain last year. (full) | deToEn | — | — | — | false |
| g4u08.gi.tense-time-expression-review.tr.005 | translation | Ich habe diesen Bibliothekar seit Montag nicht gesehen / besucht. [de] | I haven't visited this librarian since Monday. (full) ; I have not visited this librarian since Monday. (full) | deToEn | — | — | — | false |
| g4u08.gi.tense-time-expression-review.tr.007 | translation | Mia zog vor zwei Jahren nach London und wohnt seitdem dort. [de] | Mia moved to London two years ago and has lived there since then. (full) ; Mia moved to London two years ago and she has lived there since then. (full) | deToEn | — | — | — | false |
| g4u08.gi.tense-time-expression-review.tr.009 | translation | Übersetze ins Englische: 'Ich sammle seit vielen Jahren Sand.' [de] | I have collected sand for many years. (full) ; I've collected sand for many years. (full) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g4-u08/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g4-u08",
  "lens": "answers",
  "itemsHash": "5f8f7f160504",
  "promptHash": "70fa2d8cdf22",
  "round": 1,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 89, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
