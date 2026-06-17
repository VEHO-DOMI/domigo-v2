# Verify lens — answers — g4-u13 (round 1)

<!-- domigo:verify answers g4-u13 items=725c2f02834b prompt=70fa2d8cdf22 round=1 -->

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

## Vocab items (29)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g4u13.w.apply | apply (for) | To ask in an official way for a job you want. | If you want the job, you have to ___ for it right away. | apply (full) | apply (full) ; apply for (full) | attend ; help out ; take up |
| g4u13.w.artist | artist | Somebody who makes music or pictures, or who plays in a band. | After the concert, people waited to ask the singer for an ___. | artist (full) ; autograph (full) | artist (full) ; artists (full) | beggar ; highlight ; legend |
| g4u13.w.attend | attend | To go to a show, a meeting or a school. | More than 500 people ___ the concert last Friday. | attended (full) ; attend (partial) | attend (full) ; attended (full) | apply ; help out ; take up |
| g4u13.w.autograph | autograph | When a famous star signs a card for you to keep. | At the concert, I asked the artist for her ___. | autograph (full) | autograph (full) ; autographs (full) | highlight ; edition ; tournament |
| g4u13.w.beggar | beggar | Somebody on the street with no money who asks people to help them. | There was a ___ on the street who asked me for money. | beggar (full) | beggar (full) ; beggars (full) | artist ; legend ; highlight |
| g4u13.w.best-wishes | best wishes | A nice ending you write at the foot of a card or letter to a friend. | With ___ from me and the whole family, enjoy your holidays! | best wishes (full) | best wishes (full) | highlight ; edition ; autograph |
| g4u13.w.catch-up-on | catch up on | To do work or jobs that you did not have time to do before. | She reads the newspaper on Sunday to ___ the news. | catch up on (full) | catch up on (full) ; catch up (partial) | help out ; take up ; kill time |
| g4u13.w.chill-out | chill out | To take it easy and stop work, often at home, when you feel tired. | I feel really tired after the race. I need to ___ at home and do nothing. | chill out (full) | chill out (full) ; chill (partial) | help out ; take up ; catch up on |
| g4u13.w.coal | coal | A black rock from the ground that you burn to make a fire. | We burn oil or ___ to make a fire at home. | coal (full) | coal (full) | legend ; highlight ; edition |
| g4u13.w.discipline | discipline | When you control what you do and keep at your work in a good way. | To be good at any sports, you need a lot of ___. | discipline (full) | discipline (full) | highlight ; tournament ; edition |
| g4u13.w.edition | edition | One copy of a magazine, newspaper or book that is new at one time. | Welcome to the new ___ of FLY HIGH, the school magazine. | edition (full) | edition (full) ; editions (full) | highlight ; tournament ; legend |
| g4u13.w.elder | elder | More years old than you; used about a sister in a family. | My ___ sister is 19. I am 15. | elder (full) | elder (full) | ripe ; tough ; water-proof |
| g4u13.w.get-involved-with | get involved with | To start to take part in a group, often a group of bad people. | This is too dangerous. I am not ___ it. | getting involved with (full) ; get involved with (partial) | get involved with (full) ; get involved (partial) | help out ; catch up on ; take up |
| g4u13.w.help-out | help out | To do work for somebody for a short time when they need it. | I sometimes ___ in the kitchen. | help out (full) | help out (full) | take up ; catch up on ; kill time |
| g4u13.w.highlight | highlight | The best and most exciting time of a day or a show. | Going to the Guilfest was the ___ of my July. | highlight (full) | highlight (full) ; highlights (full) | tournament ; edition ; discipline |
| g4u13.w.honestly | honestly | In a true way; you really do not tell a lie. | I didn't know. ___, I didn't. | honestly (full) | honestly (full) | occasionally ; tough ; ripe |
| g4u13.w.kill-time | kill time | To do a fun thing while you wait, to make the wait feel shorter. | Our train did not come, so we ___ reading magazines. | killed time (full) ; kill time (partial) | kill time (full) ; killed time (full) | help out ; take up ; catch up on |
| g4u13.w.last-but-not-least | last but not least | You use this just before the end, to show it is good too. | And now, ___, here is the weather. | last but not least (full) | last but not least (full) | best wishes ; occasionally ; honestly |
| g4u13.w.legend | legend | A very old story that may be true or not true. | The old ___ of King Arthur is a story everyone in Britain loves. | legend (full) | legend (full) ; legends (full) | highlight ; tournament ; edition |
| g4u13.w.leisure-centre | leisure centre | A public building in a town where you can do sports, go swimming and have fun. | There's a big ___ nearby with a gym and a sports hall. | leisure centre (full) | leisure centre (full) ; leisure centres (full) ; leisure center (partial) | tournament ; highlight ; edition |
| g4u13.w.make-money | make money | To earn good pay from a job or from selling food and books. | She's ___ with her job and saving up for a car. | making money (full) | make money (full) ; making money (full) | help out ; take up ; kill time |
| g4u13.w.occasionally | occasionally | Not every day, but sometimes; now and then. | We don't go there every day, but we go ___ in the summer. | occasionally (full) | occasionally (full) | honestly ; tough ; ripe |
| g4u13.w.ripe | ripe | Ready to eat because it is not green any more; used about food on a tree. | I love strawberries, but they must be ___. | ripe (full) | ripe (full) | tough ; elder ; water-proof |
| g4u13.w.scuba-diving | scuba-diving | The sports of swimming under the sea, with bottles to help you breathe. | California is a great place for ___ in the sea. | scuba-diving (full) ; scuba diving (full) | scuba-diving (full) ; scuba diving (full) | scuba diver ; tournament ; leisure centre |
| g4u13.w.take-care-of | take care of | To look after somebody and keep them well. | Don't worry about your leg. I'm going to ___ you. | take care of (full) | take care of (full) | help out ; take up ; catch up on |
| g4u13.w.take-up | take up | To start a new thing you like doing in your free time. | He did not want to ___ skating. He was too busy. | take up (full) | take up (full) | help out ; catch up on ; kill time |
| g4u13.w.tough | tough | Very difficult; it needs a lot of work and strong will. | Life can be ___ when you have a lot of homework and no free time. | tough (full) | tough (full) | ripe ; elder ; water-proof |
| g4u13.w.tournament | tournament | A big sports competition where many people play to be the best. | Our school will play in a big sports ___ next month. | tournament (full) | tournament (full) ; tournaments (full) | highlight ; edition ; discipline |
| g4u13.w.water-proof | water-proof | This keeps the rain out, so what is under it stays dry. | Make sure your jacket is ___ before you go out in this rain. | water-proof (full) ; waterproof (partial) | water-proof (full) ; waterproof (partial) | ripe ; tough ; elder |

## Grammar items (58)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g4u13.gi.word-formation.cp.001 | context-picker | Dein Freund fährt schnell und schaut nicht auf die Straße. Welcher Satz beschreibt das richtig? [de] | He is very careless. (full) | — | He is very careful. ; He is very careness. ; He is very carely. | — | — | false |
| g4u13.gi.word-formation.cp.002 | context-picker | Du sollst sagen, dass die Band sehr erfolgreich war. Welcher Satz ist richtig gebaut? [de] | The band was very successful. (full) | — | The band was very successless. ; The band was very successness. ; The band was very unsuccess. | — | — | false |
| g4u13.gi.word-formation.ec.001 | error-correction | Finde und verbessere den Fehler: The homework was unpossible to finish in one hour. [de] | The homework was impossible to finish in one hour. (full) ; impossible (partial) | — | — | — | — | true |
| g4u13.gi.word-formation.ec.002 | error-correction | Finde und verbessere den Fehler: She was beautifull in her new dress. [de] | She was beautiful in her new dress. (full) ; beautiful (partial) | — | — | — | — | true |
| g4u13.gi.word-formation.ec.003 | error-correction | Finde und verbessere den Fehler: Her kindful nature makes everyone feel welcome. [de] | Her kind nature makes everyone feel welcome. (full) ; kind (partial) | — | — | — | — | true |
| g4u13.gi.word-formation.ec.004 | error-correction | Finde und verbessere den Fehler: I think it's very inresponsible to drive without a seatbelt. [de] | I think it's very irresponsible to drive without a seatbelt. (full) ; irresponsible (partial) | — | — | — | — | true |
| g4u13.gi.word-formation.ec.005 | error-correction | Finde und verbessere den Fehler: I completely agree with you – you are totally wrong! [de] | I completely disagree with you – you are totally wrong! (full) ; disagree (partial) | — | — | — | — | true |
| g4u13.gi.word-formation.ec.006 | error-correction | Finde und verbessere den Fehler: The man was very inpolite to the beggar and gave him nothing. [de] | The man was very impolite to the beggar and gave him nothing. (full) ; impolite (partial) | — | — | — | — | true |
| g4u13.gi.word-formation.ec.007 | error-correction | Finde und verbessere den Fehler: She drove very careless and had an accident. [de] | She drove very carelessly and had an accident. (full) ; carelessly (partial) | — | — | — | — | true |
| g4u13.gi.word-formation.gf.001 | gap-fill | Setz das Gegenteil von happy ein: She wasn't ___ about losing the match. [de, 1 blank(s)] | unhappy (full) | — | — | — | — | false |
| g4u13.gi.word-formation.gf.002 | gap-fill | Setz die richtige Form von possible ein: This exercise is ___. I can't do it! [de, 1 blank(s)] | impossible (full) | — | — | — | — | false |
| g4u13.gi.word-formation.gf.003 | gap-fill | Bau aus care ein Wort, das beschreibt, wie man eine Straße überquert: Be ___ when you cross the road! [de, 1 blank(s)] | careful (full) | — | — | — | — | false |
| g4u13.gi.word-formation.gf.004 | gap-fill | Setz die richtige Form von care ein: He drove very fast and didn't look. That was so ___! [de, 1 blank(s)] | careless (full) | — | — | — | — | false |
| g4u13.gi.word-formation.gf.005 | gap-fill | Mach aus happy ein Hauptwort: Her ___ surprised everyone after she won the tournament. [de, 1 blank(s)] | happiness (full) | — | — | — | — | false |
| g4u13.gi.word-formation.gf.006 | gap-fill | Bau aus kind ein Hauptwort: Her ___ really surprised the new students. [de, 1 blank(s)] | kindness (full) | — | — | — | — | false |
| g4u13.gi.word-formation.gf.007 | gap-fill | Setz die richtige Form von hope ein: The situation looks ___. I don't think we can win. [de, 1 blank(s)] | hopeless (full) | — | — | — | — | false |
| g4u13.gi.word-formation.gf.008 | gap-fill | Setz beide Formen von hope ein: Your ending is a bit ___, but the rest is full of hope and very ___. [de, 2 blank(s)] | hopeless \| hopeful (full) | — | — | — | — | false |
| g4u13.gi.word-formation.gf.009 | gap-fill | Bau aus success ein Eigenschaftswort: The band was very ___ and won many fans. [de, 1 blank(s)] | successful (full) | — | — | — | — | false |
| g4u13.gi.word-formation.gf.010 | gap-fill | Setz die richtige Form von understand ein: I'm sorry, I completely ___ you. Let me read it again. [de, 1 blank(s)] | misunderstood (full) | — | — | — | — | false |
| g4u13.gi.word-formation.gf.011 | gap-fill | Setz die richtige Form von agree ein: I completely ___ with you. I think you are wrong. [de, 1 blank(s)] | disagree (full) | — | — | — | — | false |
| g4u13.gi.word-formation.gf.012 | gap-fill | Setz die richtige Form von meaning ein: The text was completely ___. The teacher couldn't understand a word. [de, 1 blank(s)] | meaningless (full) | — | — | — | — | false |
| g4u13.gi.word-formation.gf.013 | gap-fill | Bau aus beauty ein Eigenschaftswort: Stoke Park, where the festival is held, is really ___. [de, 1 blank(s)] | beautiful (full) | — | — | — | — | false |
| g4u13.gi.word-formation.gf.014 | gap-fill | Setz die richtige Form von paint ein: He paints every day. He is a wonderful ___. [de, 1 blank(s)] | painter (full) | — | — | — | — | false |
| g4u13.gi.word-formation.gf.015 | gap-fill | Bau aus visit ein Wort für die Person: Every July a lot of people come to the festival. Each ___ loves the music. [de, 1 blank(s)] | visitor (full) | — | — | — | — | false |
| g4u13.gi.word-formation.gf.016 | gap-fill | Setz die richtige Form von care ein, um zu sagen, WIE er fuhr: He drove ___ and had an accident. [de, 1 blank(s)] | carelessly (full) | — | — | — | — | false |
| g4u13.gi.word-formation.gf.017 | gap-fill | Bau aus help ein Eigenschaftswort: The guide was very ___ and showed us the way. [de, 1 blank(s)] | helpful (full) | — | — | — | — | false |
| g4u13.gi.word-formation.gf.018 | gap-fill | Setz die richtige Form von regular ein: The bus times here are ___. You never know when it comes. [de, 1 blank(s)] | irregular (full) | — | — | — | — | false |
| g4u13.gi.word-formation.gs.005 | group-sort | Sortier die Wörter danach, welches kleine Stück am Ende angehängt wurde. [de] | — | — | — | — | -ful: careful, successful, beautiful, powerful \| -less: hopeless, careless, helpless, spotless | false |
| g4u13.gi.word-formation.gs.006 | group-sort | Sortier die Wörter danach, ob es eine Sache/Eigenschaft oder eine Person beschreibt. [de] | — | — | — | — | -er: painter, singer, writer, driver \| -ness: happiness, kindness, darkness, illness | false |
| g4u13.gi.word-formation.gs.007 | group-sort | Sortier die Gegenteile danach, welches kleine Stück vorne angehängt wurde. [de] | — | — | — | — | im-: impossible, impolite, impatient \| ir-: irregular, irresponsible | false |
| g4u13.gi.word-formation.gs.008 | group-sort | Sortier die Wörter danach, ob sie ein Wort für eine Person oder ein Eigenschaftswort sind. [de] | — | — | — | — | -or: visitor, inventor, actor \| -ous: dangerous, famous, nervous | false |
| g4u13.gi.word-formation.mc.001 | multiple-choice | Welche Form ist richtig gebaut? The opposite of happy is ___. [de, 1 blank(s)] | unhappy (full) | — | dishappy ; inhappy ; mishappy | — | — | false |
| g4u13.gi.word-formation.mc.003 | multiple-choice | Welche Form von possible ist richtig? It's ___ to finish all this homework in one hour. [de, 1 blank(s)] | impossible (full) | — | unpossible ; inpossible ; dispossible | — | — | false |
| g4u13.gi.word-formation.mc.004 | multiple-choice | Welche Form passt? She always thinks about other people. She is very ___. [de, 1 blank(s)] | careful (full) | — | careless ; careness ; carely | — | — | false |
| g4u13.gi.word-formation.mc.006 | multiple-choice | Welche Form passt in den Satz? He paints beautiful pictures. He is a famous ___. [de, 1 blank(s)] | painter (full) | — | paintness ; paintful ; paintless | — | — | false |
| g4u13.gi.word-formation.mc.007 | multiple-choice | Welche Form passt? My ___ Daniel is 19 and I'm 15. [de, 1 blank(s)] | elder (full) | — | eldness ; eldful ; eldless | — | — | false |
| g4u13.gi.word-formation.mc.008 | multiple-choice | Welche Form von meaning passt? No idea what she wanted to say – it was completely ___. [de, 1 blank(s)] | meaningless (full) | — | meaningful ; meaningness ; unmeaning | — | — | false |
| g4u13.gi.word-formation.mc.010 | multiple-choice | Welches Wort ist richtig gebaut? What he was doing was ___, so the police arrested him. [de, 1 blank(s)] | illegal (full) | — | inlegal ; unlegal ; dislegal | — | — | false |
| g4u13.gi.word-formation.mc.011 | multiple-choice | Welche Form von hope passt? I can't do it — it all looks ___. [de, 1 blank(s)] | hopeless (full) | — | hopeful ; hopeness ; unhope | — | — | false |
| g4u13.gi.word-formation.mc.012 | multiple-choice | Welche Form von happy passt? All my friends were there. It filled me with ___. [de, 1 blank(s)] | happiness (full) | — | happyness ; happyful ; happyless | — | — | false |
| g4u13.gi.word-formation.mt.001 | matching | Welches Gegenteil gehört zu welchem Wort? [de] | — | — | — | happy ↔ unhappy ; possible ↔ impossible ; legal ↔ illegal ; polite ↔ impolite ; agree ↔ disagree | — | false |
| g4u13.gi.word-formation.mt.002 | matching | Welche Person gehört zu welcher Tätigkeit? [de] | — | — | — | paint ↔ painter ; sing ↔ singer ; dance ↔ dancer ; write ↔ writer ; explore ↔ explorer | — | false |
| g4u13.gi.word-formation.mt.003 | matching | Welche neue Form gehört zu welchem Wort? [de] | — | — | — | happy ↔ happiness ; care ↔ careful ; hope ↔ hopeless ; success ↔ successful ; beauty ↔ beautiful | — | false |
| g4u13.gi.word-formation.qf.001 | question-formation | Dein Freund sagt, ohne Führerschein zu fahren sei in Ordnung. Du bist anderer Meinung. Frag mit dem Gegenteil von legal: Is it really ___ to drive without a licence? [de, 1 blank(s)] | illegal (full) ; Is it really illegal to drive without a licence? (full) | — | — | — | — | false |
| g4u13.gi.word-formation.qf.002 | question-formation | Tom ist sich nicht sicher, was du gesagt hast. Frag mit dem Wort understand: Did you ___ me? [de, 1 blank(s)] | misunderstand (full) ; Did you misunderstand me? (full) | — | — | — | — | false |
| g4u13.gi.word-formation.sb.001 | sentence-building | Bring die Wörter in die richtige Reihenfolge: is / this / impossible / exercise [de] | This exercise is impossible. (full) | — | — | — | — | false |
| g4u13.gi.word-formation.sb.002 | sentence-building | Bring die Wörter in die richtige Reihenfolge: was / the / very / festival / successful [de] | The festival was very successful. (full) | — | — | — | — | false |
| g4u13.gi.word-formation.sb.003 | sentence-building | Bring die Wörter in die richtige Reihenfolge: was / he / impolite / the / very / beggar / to [de] | He was very impolite to the beggar. (full) | — | — | — | — | false |
| g4u13.gi.word-formation.tf.001 | transformation | Mach aus dem Wort in Klammern die passende Form: That word doesn't make any sense. (meaning) → That word is ___. [de, 1 blank(s)] | meaningless (full) ; That word is meaningless. (full) | — | — | — | — | false |
| g4u13.gi.word-formation.tf.002 | transformation | Mach aus dem Wort in Klammern die passende Form: I don't agree with what you said. (agree) → I ___ with what you said. [de, 1 blank(s)] | disagree (full) ; I disagree with what you said. (full) | — | — | — | — | false |
| g4u13.gi.word-formation.tf.003 | transformation | Mach aus dem Wort in Klammern ein Hauptwort: She is very happy. (happy) → Everyone could see her ___. [de, 1 blank(s)] | happiness (full) ; Everyone could see her happiness. (full) | — | — | — | — | false |
| g4u13.gi.word-formation.tf.004 | transformation | Mach aus dem Wort in Klammern die passende Form: He drives the school bus every day. (drive) → He is the school ___. [de, 1 blank(s)] | driver (full) ; He is the school driver. (full) | — | — | — | — | false |
| g4u13.gi.word-formation.tf.005 | transformation | Bau beide Formen aus den Wörtern in Klammern: Driving on this road is very (danger) ___. It's really not (safe) ___! [de, 2 blank(s)] | dangerous \| safe (full) | — | — | — | — | false |
| g4u13.gi.word-formation.tf.006 | transformation | Mach aus dem Wort in Klammern ein Eigenschaftswort: His new book was a big success. (success) → His new book was very ___. [de, 1 blank(s)] | successful (full) ; His new book was very successful. (full) | — | — | — | — | false |
| g4u13.gi.word-formation.tr.001 | translation | Es ist unmöglich, das heute fertig zu machen. [de] | It's impossible to finish this today. (full) ; It is impossible to finish this today. (full) ; It's impossible to finish that today. (full) | deToEn | — | — | — | false |
| g4u13.gi.word-formation.tr.002 | translation | Ich bin völlig anderer Meinung als du. [de] | I completely disagree with you. (full) ; I totally disagree with you. (full) ; I disagree with you completely. (full) | deToEn | — | — | — | false |
| g4u13.gi.word-formation.tr.003 | translation | Sein Verhalten war völlig verantwortungslos. [de] | His behaviour was completely irresponsible. (full) ; His behavior was completely irresponsible. (full) ; His behaviour was totally irresponsible. (full) | deToEn | — | — | — | false |
| g4u13.gi.word-formation.tr.004 | translation | Ihre Freundlichkeit überraschte alle. [de] | Her kindness surprised everyone. (full) ; Her kindness surprised everybody. (full) ; Her friendliness surprised everyone. (partial) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g4-u13/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g4-u13",
  "lens": "answers",
  "itemsHash": "725c2f02834b",
  "promptHash": "70fa2d8cdf22",
  "round": 1,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 87, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
