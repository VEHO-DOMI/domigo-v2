# Verify lens — answers — g4-u12 (round 1)

<!-- domigo:verify answers g4-u12 items=21864bde9cfd prompt=70fa2d8cdf22 round=1 -->

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

## Vocab items (36)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g4u12.w.advert | advert | A short notice or short message that helps to sell a thing. | There was an ___ for flights to London in the newspaper. | advert (full) | advert (full) ; adverts (full) ; advertisement (full) ; ad (partial) | warning ; plaque ; masterpiece |
| g4u12.w.altogether | altogether | When you add up everybody and everything; in all. | ___ there are eight planets that move close to our sun. | Altogether (full) ; altogether (full) | altogether (full) | disgusting ; commercial ; tiring |
| g4u12.w.asteroid | asteroid | A very big rock in space that travels near the sun, between two planets. | Many ___ move between Mars and Jupiter and never come close to a planet. | asteroids (full) | asteroid (full) ; asteroids (full) | spacecraft ; atmosphere ; crew |
| g4u12.w.astronaut | astronaut | Somebody whose job is to fly into space. | She has always wanted to be an ___ and fly into space. | astronaut (full) | astronaut (full) ; astronauts (full) | commander ; crew ; asteroid |
| g4u12.w.atmosphere | atmosphere | The thick cover of gases all over a planet that protects it from the sun. | Mars has a very thin ___, so humans could not breathe there. | atmosphere (full) | atmosphere (full) ; atmospheres (full) | orbit ; surface ; biosphere |
| g4u12.w.biosphere | biosphere | The closed place on a planet where plants and people can live and breathe. | A ___ is a closed place where plants and people can live and breathe, like on a planet. | biosphere (full) | biosphere (full) ; biospheres (full) | atmosphere ; surface ; orbit |
| g4u12.w.celebrate | celebrate | To have a party for a big, happy day, like a birthday. | She wants to ___ her birthday with all her friends next weekend. | celebrate (full) | celebrate (full) | reply ; demand ; disturb |
| g4u12.w.commander | commander | The one who is in charge of a ship, a plane or a spaceship. | The ___ of the spaceship is in charge of the whole crew. | commander (full) | commander (full) ; commanders (full) | astronaut ; crew ; mankind |
| g4u12.w.commercial | commercial | To do with selling and making money. | The company uses its spaceship for ___ flights and earns a lot of money. | commercial (full) | commercial (full) | privately owned ; disgusting ; multibillion |
| g4u12.w.crew | crew | All the people who work on a ship or a spaceship. | All seven members of the ___ died when the spaceship exploded. | crew (full) | crew (full) ; crews (full) | commander ; astronaut ; spacecraft |
| g4u12.w.demand | demand | To ask for a thing in a strong way because you feel it is your right. | Tell me the truth now. I ___ to know what happened. | demand (full) | demand (full) | reply ; disturb ; celebrate |
| g4u12.w.depressed | depressed | Feeling very unhappy and sad for a long time, with no hope. | He was very ___ and unhappy, and he did not want to talk to anyone. | depressed (full) | depressed (full) | disgusting ; tiring ; commercial |
| g4u12.w.disgusting | disgusting | So horrible that you do not want to taste, smell or touch it. | In space your favourite food can taste ___ and horrible. | disgusting (full) | disgusting (full) | depressed ; tiring ; commercial |
| g4u12.w.disturb | disturb | To stop somebody who is busy, when they do not want anyone near them. | Please don't ___ your sister while she is doing her homework. | disturb (full) | disturb (full) | demand ; reply ; celebrate |
| g4u12.w.engineering | engineering | The job of designing and building machines, bridges and roads. | She wants to study ___ because she loves building machines and bridges. | engineering (full) | engineering (full) | surface ; resource ; gravity |
| g4u12.w.explosion | explosion | A big noise when a thing blows up and breaks into pieces. | The big ___ destroyed the whole spaceship at the start of its flight. | explosion (full) | explosion (full) ; explosions (full) | warning ; orbit ; sunset |
| g4u12.w.genetic-engineering | genetic engineering | The science of changing the genes of a living thing to give it new qualities. | Scientists use ___ to make a clone of a living thing. | genetic engineering (full) | genetic engineering (full) | engineering ; gravity ; resource |
| g4u12.w.gravity | gravity | The power that pulls everything down and holds us on the ground. | It is ___ that pulls everything down to the ground and keeps us on the planet. | gravity (full) | gravity (full) | atmosphere ; orbit ; surface |
| g4u12.w.mankind | mankind | All the people on Earth; the whole human race. | Landing on the moon was a great day for all ___. | mankind (full) | mankind (full) ; humankind (partial) | crew ; commander ; biosphere |
| g4u12.w.masterpiece | masterpiece | A piece of art that somebody does so well it is their very best work. | This is the best work the artist has done — a true ___. | masterpiece (full) | masterpiece (full) ; masterpieces (full) | plaque ; advert ; warning |
| g4u12.w.multibillion | multibillion | That uses very, very much money. | Flying people to Mars needs a lot of money; it is a ___ project. | multibillion (full) ; multibillion-dollar (partial) | multibillion (full) | commercial ; privately owned ; tiring |
| g4u12.w.neither-nor | neither ... nor | Used to show that two people both do not do a thing. | ___ you nor I will fly into space for many years. | Neither (full) ; neither (full) | neither nor (full) ; neither ... nor (full) ; neither (partial) | altogether ; commercial ; disgusting |
| g4u12.w.orbit | orbit | The path that an object travels again and again near a planet or star in space. | The space shuttle stayed in ___ for many days, travelling close to the Earth. | orbit (full) | orbit (full) ; orbits (full) | atmosphere ; surface ; gravity |
| g4u12.w.plaque | plaque | A small plate of metal with writing on it that we put up to think of somebody. | The astronauts put a ___ on the moon with a message for all mankind. | plaque (full) | plaque (full) ; plaques (full) | warning ; advert ; masterpiece |
| g4u12.w.privately-owned | privately owned | When one company owns it, not the government. | That spaceship is ___, so a company owns it and the government does not. | privately owned (full) | privately owned (full) | commercial ; multibillion ; uninhabitable |
| g4u12.w.reply | reply | To write or talk back to somebody who writes to you. | It is good to ___ to a message and not just leave it. | reply (full) | reply (full) ; answer (partial) | demand ; disturb ; celebrate |
| g4u12.w.resource | resource | A thing that a country has and can use, like oil, land or money. | Oil is a natural ___ that many countries use to make money. | resource (full) | resource (full) ; resources (full) | engineering ; surface ; atmosphere |
| g4u12.w.space-shuttle | space shuttle | A flying machine that can carry astronauts away from the Earth and back, then fly again. | A ___ can fly into space again and again, like a plane. | space shuttle (full) | space shuttle (full) ; space shuttles (full) | spacecraft ; asteroid ; orbit |
| g4u12.w.space-travel | space travel | Going away from the Earth to visit the planets, stars and moons. | Thanks to ___, people have walked on the moon and lived in space. | space travel (full) | space travel (full) | spacecraft ; engineering ; orbit |
| g4u12.w.spacecraft | spacecraft | A flying machine that you can use to travel in space. | One day there will be many kinds of ___ that can take people into space. | spacecraft (full) ; spacecrafts (partial) | spacecraft (full) ; spacecrafts (partial) | space shuttle ; asteroid ; atmosphere |
| g4u12.w.sunrise | sunrise | The time in the morning when the sun appears in the sky. | We were up very early to watch the ___ at the start of the day. | sunrise (full) | sunrise (full) ; sunrises (full) | sunset ; atmosphere ; orbit |
| g4u12.w.sunset | sunset | The time in the evening when the sun is no longer in the sky. | At the end of the day we watched a beautiful ___ over the sea. | sunset (full) | sunset (full) ; sunsets (full) | sunrise ; warning ; explosion |
| g4u12.w.surface | surface | The outside of a thing, like the moon or the sea. | The astronauts walked on the dry, rocky ___ of the moon. | surface (full) | surface (full) ; surfaces (full) | atmosphere ; orbit ; biosphere |
| g4u12.w.tiring | tiring | Making you feel very tired. | The long flight was very ___, and the whole crew was tired afterwards. | tiring (full) | tiring (full) | disgusting ; depressed ; commercial |
| g4u12.w.uninhabitable | uninhabitable | Not good for anyone to live in. | Mars is too cold and dry for people, so it is ___ today. | uninhabitable (full) | uninhabitable (full) | disgusting ; commercial ; privately owned |
| g4u12.w.warning | warning | A sign that shows you a thing is dangerous, so you can be careful. | There was a ___ that the sea was too dangerous for swimming. | warning (full) | warning (full) ; warnings (full) | advert ; plaque ; explosion |

## Grammar items (70)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g4u12.gi.phrasal-verbs.ag.001 | anagram | Das kleine Wort, das zu "find" passt (herausfinden): find ___ [de, 1 blank(s)] | out (full) | — | — | — | — | false |
| g4u12.gi.phrasal-verbs.ag.002 | anagram | Das kleine Wort, das zu "look" passt (sich kümmern um): look ___ [de, 1 blank(s)] | after (full) | — | — | — | — | false |
| g4u12.gi.phrasal-verbs.cp.001 | context-picker | Die Astronauten heben gleich vom Boden ab. Welcher Satz passt? [de] | The astronauts will take off. (full) | — | The astronauts will take on. ; The astronauts will take up. ; The astronauts will take out. | — | — | false |
| g4u12.gi.phrasal-verbs.cp.002 | context-picker | Du gibst deinem Bruder seinen Raumanzug und sagst ihm, er soll IHN anziehen. Welcher Satz ist richtig? [de] | Put it on. (full) | — | Put on it. ; Put on it on. ; On put it. | — | — | false |
| g4u12.gi.phrasal-verbs.cp.003 | context-picker | Du erzählst, dass die Mannschaft kein Essen mehr hat. Welcher Satz passt? [de] | The crew has run out of food. (full) | — | The crew has run up of food. ; The crew has run out for food. ; The crew has run away of food. | — | — | false |
| g4u12.gi.phrasal-verbs.cp.004 | context-picker | Du fragst deinen Freund, warum er noch wartet. Welcher Satz ist richtig? [de] | What are you waiting for? (full) | — | What are you waiting on? ; What are you waiting at? ; What are you waiting after? | — | — | false |
| g4u12.gi.phrasal-verbs.ec.001 | error-correction | Your spacesuit is on the ground. Please put on it. [de] | Your spacesuit is on the ground. Please put it on. (full) ; Please put it on. (partial) | — | — | — | — | true |
| g4u12.gi.phrasal-verbs.ec.002 | error-correction | Don't give up it! You can do it. [de] | Don't give it up! You can do it. (full) ; Don't give it up! (partial) | — | — | — | — | true |
| g4u12.gi.phrasal-verbs.ec.003 | error-correction | She looks the crew after very well. [de] | She looks after the crew very well. (full) ; looks after the crew (partial) | — | — | — | — | true |
| g4u12.gi.phrasal-verbs.ec.004 | error-correction | She set off a new life on Mars. [de] | She set up a new life on Mars. (full) ; set up a new life (partial) | — | — | — | — | true |
| g4u12.gi.phrasal-verbs.ec.005 | error-correction | He carries on it with his work every day. [de] | He carries on with his work every day. (full) ; carries on with his work (partial) | — | — | — | — | true |
| g4u12.gi.phrasal-verbs.ec.006 | error-correction | We have run of food on the spaceship. [de] | We have run out of food on the spaceship. (full) ; run out of food (partial) | — | — | — | — | true |
| g4u12.gi.phrasal-verbs.ec.007 | error-correction | I'm waiting on the space shuttle. [de] | I'm waiting for the space shuttle. (full) ; waiting for (partial) | — | — | — | — | true |
| g4u12.gi.phrasal-verbs.ec.008 | error-correction | Look it up in the dictionary, then carry on it with your work. [de] | Look it up in the dictionary, then carry on with your work. (full) ; carry on with your work (partial) | — | — | — | — | true |
| g4u12.gi.phrasal-verbs.ff.001 | free-form | Schreib einen Satz über Astronauten mit "take off" (abheben). [de] | The astronauts take off in a space shuttle. (full) ; The space shuttle takes off at sunrise. (full) ; The astronauts will take off soon. (partial) | — | — | — | — | false |
| g4u12.gi.phrasal-verbs.gf.001 | gap-fill | The space shuttle will take ___ at sunrise. [de, 1 blank(s)] | off (full) | — | — | — | — | false |
| g4u12.gi.phrasal-verbs.gf.002 | gap-fill | Don't give ___! You can do it if you keep trying. [de, 1 blank(s)] | up (full) | — | — | — | — | false |
| g4u12.gi.phrasal-verbs.gf.003 | gap-fill | It's cold outside. Please put ___ your jacket. [de, 1 blank(s)] | on (full) | — | — | — | — | false |
| g4u12.gi.phrasal-verbs.gf.004 | gap-fill | We've run ___ ___ food. Can you go to the shop? [de, 2 blank(s)] | out \| of (full) | — | — | — | — | false |
| g4u12.gi.phrasal-verbs.gf.005 | gap-fill | Could you look ___ my dog while I'm away? [de, 1 blank(s)] | after (full) | — | — | — | — | false |
| g4u12.gi.phrasal-verbs.gf.006 | gap-fill | She came ___ ___ a great story for the project. [de, 2 blank(s)] | up \| with (full) | — | — | — | — | false |
| g4u12.gi.phrasal-verbs.gf.007 | gap-fill | The crew set ___ for the moon early in the morning. [de, 1 blank(s)] | off (full) | — | — | — | — | false |
| g4u12.gi.phrasal-verbs.gf.008 | gap-fill | She gets ___ well ___ everyone in the crew. [de, 2 blank(s)] | on \| with (full) | — | — | — | — | false |
| g4u12.gi.phrasal-verbs.gf.009 | gap-fill | Let's find ___ more about space travel. [de, 1 blank(s)] | out (full) | — | — | — | — | false |
| g4u12.gi.phrasal-verbs.gf.010 | gap-fill | Your spacesuit is on the floor. Please put ___ ___ before you go outside. [de, 2 blank(s)] | it \| on (full) | — | — | — | — | false |
| g4u12.gi.phrasal-verbs.gf.011 | gap-fill | He hadn't come ___ ___ anything good for a long time, so he was depressed. [de, 2 blank(s)] | up \| with (full) | — | — | — | — | false |
| g4u12.gi.phrasal-verbs.gf.012 | gap-fill | The commander looks ___ the whole crew on the spaceship. [de, 1 blank(s)] | after (full) | — | — | — | — | false |
| g4u12.gi.phrasal-verbs.gf.013 | gap-fill | Carry ___! You're nearly finished with the project. [de, 1 blank(s)] | on (full) | — | — | — | — | false |
| g4u12.gi.phrasal-verbs.gf.014 | gap-fill | What are you waiting ___? The space shuttle is ready! [de, 1 blank(s)] | for (full) | — | — | — | — | false |
| g4u12.gi.phrasal-verbs.gf.015 | gap-fill | She spent all her pocket money ___ paint and paper. [de, 1 blank(s)] | on (full) | — | — | — | — | false |
| g4u12.gi.phrasal-verbs.gf.016 | gap-fill | On the spaceship the crew never gives ___, even when things go wrong. [de, 1 blank(s)] | up (full) | — | — | — | — | false |
| g4u12.gi.phrasal-verbs.gf.017 | gap-fill | First the crew set ___ for the moon. Then the shuttle took ___. [de, 2 blank(s)] | off \| off (full) | — | — | — | — | false |
| g4u12.gi.phrasal-verbs.gf.018 | gap-fill | The space shuttle broke ___ when it came back into the atmosphere. [de, 1 blank(s)] | up (full) | — | — | — | — | false |
| g4u12.gi.phrasal-verbs.gf.019 | gap-fill | She set ___ a new life on a new planet. [de, 1 blank(s)] | up (full) | — | — | — | — | false |
| g4u12.gi.phrasal-verbs.gf.020 | gap-fill | Let's find ___ how a space shuttle works. [de, 1 blank(s)] | out (full) | — | — | — | — | false |
| g4u12.gi.phrasal-verbs.gs.001 | group-sort | put on / give up / look after / get on with [de] | — | — | — | — | put it on, give it up …: put on, give up \| look after it, get on with it …: look after, get on with | false |
| g4u12.gi.phrasal-verbs.gs.002 | group-sort | give up / take off / run out of / get on with [de] | — | — | — | — | give up, take off …: give up, take off \| run out of, get on with …: run out of, get on with | false |
| g4u12.gi.phrasal-verbs.mc.001 | multiple-choice | The astronaut ___ her spacesuit before the flight. [de, 1 blank(s)] | put on (full) | — | put up ; put out ; put down | — | — | false |
| g4u12.gi.phrasal-verbs.mc.002 | multiple-choice | The astronauts will ___ at sunrise and fly into the sky. [de, 1 blank(s)] | take off (full) | — | take on ; take up ; take out | — | — | false |
| g4u12.gi.phrasal-verbs.mc.003 | multiple-choice | We've ___ food on the spaceship. Tell the commander! [de, 1 blank(s)] | run out of (full) | — | run out for ; run up to ; run away from | — | — | false |
| g4u12.gi.phrasal-verbs.mc.008 | multiple-choice | He's depressed because he can't ___ a good story. [de, 1 blank(s)] | come up with (full) | — | come up for ; come on with ; come out with | — | — | false |
| g4u12.gi.phrasal-verbs.mc.010 | multiple-choice | Dein Raumanzug ist schmutzig. Welcher Satz hat die richtige Wortstellung mit 'it'? [de] | Please put it on. (full) | — | Please put on it. ; Please it put on. ; Please put on it now it. | — | — | false |
| g4u12.gi.phrasal-verbs.mc.011 | multiple-choice | Welcher Satz lässt die zwei Wörter zusammen und ist richtig? [de] | She looks after the crew well. (full) | — | She looks the crew after well. ; She looks well after the crew it. ; She after looks the crew well. | — | — | false |
| g4u12.gi.phrasal-verbs.mc.012 | multiple-choice | Was bedeutet 'take off' hier? 'The space shuttle took a long time to take off.' [de] | leave the ground and go into the sky (full) | — | take care of the crew ; begin a new life ; stop and not go on | — | — | false |
| g4u12.gi.phrasal-verbs.mc.013 | multiple-choice | Welche zwei Wörter bleiben immer zusammen (kein Wort dazwischen)? [de] | look after (full) | — | put on ; give up ; take off | — | — | false |
| g4u12.gi.phrasal-verbs.mc.014 | multiple-choice | Welcher Satz mit einem Ding (nicht 'it') ist richtig? [de] | Put your spacesuit on. (full) | — | Put on on your spacesuit. ; Put your on spacesuit. ; On put your spacesuit. | — | — | false |
| g4u12.gi.phrasal-verbs.mt.005 | matching | Welches kleine Wort passt? (erste Runde) [de] | — | — | — | take ↔ off ; give ↔ up ; look ↔ after ; find ↔ out | — | false |
| g4u12.gi.phrasal-verbs.mt.006 | matching | Welche Bedeutung passt? (erste Runde) [de] | — | — | — | take off ↔ go up into the sky ; set off ↔ begin a journey ; give up ↔ stop and not go on ; look after ↔ take care of a child ; get on with ↔ have a good relationship with people | — | false |
| g4u12.gi.phrasal-verbs.mt.007 | matching | Welche Bedeutung passt? (zweite Runde) [de] | — | — | — | set up ↔ start a new life ; run out of ↔ have nothing of it any more ; come up with ↔ think of a new story ; find out ↔ get to know the truth | — | false |
| g4u12.gi.phrasal-verbs.mt.008 | matching | Welches kleine Wort passt? (zweite Runde) [de] | — | — | — | wait ↔ for ; carry ↔ on ; run out ↔ of ; break ↔ up | — | false |
| g4u12.gi.phrasal-verbs.qf.001 | question-formation | Die Raumfähre ist gestartet. Frag, wann sie abgehoben hat. Beginne mit 'When did...' [de] | When did the space shuttle take off? (full) ; When did the spaceship take off? (partial) | — | — | — | — | false |
| g4u12.gi.phrasal-verbs.qf.002 | question-formation | Dein Freund hat eine tolle Geschichte erfunden. Frag, wie er auf die Idee gekommen ist. Beginne mit 'How did...' [de] | How did you come up with the story? (full) ; How did you come up with that story? (full) | — | — | — | — | false |
| g4u12.gi.phrasal-verbs.qf.003 | question-formation | Die Mannschaft hat kein Essen mehr. Frag, ob sie aufgegeben hat. Beginne mit 'Did the crew...' [de] | Did the crew give up? (full) | — | — | — | — | false |
| g4u12.gi.phrasal-verbs.sb.001 | sentence-building | off / shuttle / the / takes / space / sunrise / at [de] | The space shuttle takes off at sunrise. (full) | — | — | — | — | false |
| g4u12.gi.phrasal-verbs.sb.002 | sentence-building | with / great / came / a / story / up / she [de] | She came up with a great story. (full) | — | — | — | — | false |
| g4u12.gi.phrasal-verbs.sb.003 | sentence-building | the / commander / after / crew / looks / the [de] | The commander looks after the crew. (full) | — | — | — | — | false |
| g4u12.gi.phrasal-verbs.sb.004 | sentence-building | spacesuit / on / put / it / your / ground / the / is / on [de] | Your spacesuit is on the ground. Put it on. (full) | — | — | — | — | false |
| g4u12.gi.phrasal-verbs.sb.005 | sentence-building | up / never / the / crew / gives [de] | The crew never gives up. (full) | — | — | — | — | false |
| g4u12.gi.phrasal-verbs.tf.001 | transformation | Dein Bruder soll seinen Raumanzug anziehen. Sag es ihm mit "it": 'Here is your spacesuit. Put ___ ___!' [de, 2 blank(s)] | it \| on (full) ; Put it on! (partial) | — | — | — | — | false |
| g4u12.gi.phrasal-verbs.tf.003 | transformation | Schreib den Satz mit "it" statt mit dem dicken Wort: Put on your SPACESUIT. → Put ___ ___. [de, 2 blank(s)] | it \| on (full) ; Put it on. (partial) | — | — | — | — | false |
| g4u12.gi.phrasal-verbs.tf.005 | transformation | Schreib den Satz mit "it" statt mit dem dicken Wort: Give up CHOCOLATE. → Give ___ ___. [de, 2 blank(s)] | it \| up (full) ; Give it up. (partial) | — | — | — | — | false |
| g4u12.gi.phrasal-verbs.tf.006 | transformation | Ersetze das unterstrichene Wort durch eins wie give up / take off: She STOPS eating chocolate. → She ___ chocolate. [de, 1 blank(s)] | gives up (full) ; She gives up chocolate. (full) | — | — | — | — | false |
| g4u12.gi.phrasal-verbs.tf.007 | transformation | Ersetze das unterstrichene Wort durch eins wie give up / take off: She INVENTED a great story. → She ___ ___ ___ a great story. [de, 3 blank(s)] | came \| up \| with (full) ; She came up with a great story. (partial) | — | — | — | — | false |
| g4u12.gi.phrasal-verbs.tr.001 | translation | Zieh deinen Raumanzug an! [de] | Put on your spacesuit! (full) ; Put your spacesuit on! (full) | deToEn | — | — | — | false |
| g4u12.gi.phrasal-verbs.tr.002 | translation | Wer passt auf den Hund auf, während ich weg bin? [de] | Who looks after the dog while I'm away? (full) ; Who looks after the dog while I am away? (full) ; Who is looking after the dog while I'm away? (partial) | deToEn | — | — | — | false |
| g4u12.gi.phrasal-verbs.tr.003 | translation | Wir haben kein Essen mehr. Wir müssen zurück zur Erde. [de] | We have run out of food. We must go back to Earth. (full) ; We've run out of food. We must go back to Earth. (full) ; We have run out of food. We have to go back to Earth. (partial) | deToEn | — | — | — | false |
| g4u12.gi.phrasal-verbs.tr.004 | translation | Don't give up, astronaut! [en] | Gib nicht auf, Astronaut! (full) ; Gib nicht auf, Astronautin! (full) | enToDe | — | — | — | false |
| g4u12.gi.phrasal-verbs.tr.005 | translation | The space shuttle took a long time to take off. [en] | Die Raumfähre brauchte lange, um abzuheben. (full) ; Das Space Shuttle brauchte lange, um abzuheben. (partial) | enToDe | — | — | — | false |
| g4u12.gi.phrasal-verbs.tr.006 | translation | Die Mannschaft brach früh zum Mond auf. [de] | The crew set off for the moon early. (full) ; The crew set off early for the moon. (full) | deToEn | — | — | — | false |
| g4u12.gi.phrasal-verbs.tr.007 | translation | Mach weiter! Du kannst es schaffen. [de] | Carry on! You can do it. (full) ; Carry on! You can do this. (partial) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g4-u12/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g4-u12",
  "lens": "answers",
  "itemsHash": "21864bde9cfd",
  "promptHash": "70fa2d8cdf22",
  "round": 1,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 106, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
