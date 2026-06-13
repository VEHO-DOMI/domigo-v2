# Verify lens — answers — g2-u03 (round 4)

<!-- domigo:verify answers g2-u03 items=8a00bfa24670 prompt=70fa2d8cdf22 round=4 -->

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

## Vocab items (34)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g2u03.w.apple-bobbing | apple bobbing | You play this at Halloween: there is food in water, and you must catch it with your mouth — no fingers! | We also play ___ at Halloween. It's difficult, but fun — you must catch an apple with your mouth! | apple bobbing (full) | apple bobbing (full) | trick or treat ; picnic ; tradition |
| g2u03.w.century | century | One hundred years - a very long time. | She was dressed like a girl from the 19th ___. | century (full) | century (full) ; a century (full) | week ; month ; year |
| g2u03.w.costume | costume | You wear it at Halloween to look like a vampire, a witch or a ghost. | Her ___ is scary! She looks like a vampire. | costume (full) ; mask (partial) ; dress (partial) | costume (full) ; a costume (full) ; mask (partial) | sweater ; jacket ; cap |
| g2u03.w.couldn-t | couldn't | You wanted to do it yesterday, but it was not possible. | Lara wanted to eat more sweets, but she ___ - she was too sick. | couldn't (full) ; could not (full) ; didn't (partial) | couldn't (full) ; could not (full) | can't ; must ; shall |
| g2u03.w.cute | cute | Small, pretty and nice to look at - like a young rabbit. | Look at my rabbit. Isn't it ___? I love its small nose and big eyes. | cute (full) ; sweet (partial) ; pretty (partial) ; beautiful (partial) | cute (full) ; sweet (partial) | scary ; angry ; tired |
| g2u03.w.cycle-helmet | cycle helmet | A strong hat that you wear when you ride a bike. | Always wear a ___ when you ride a bike. | cycle helmet (full) ; helmet (partial) ; bike helmet (partial) | cycle helmet (full) ; bike helmet (partial) ; helmet (partial) | mask ; costume ; dress |
| g2u03.w.dress | dress | Girls often wear it to a surprise party - it is long, like a skirt and a shirt in one. | Edwina wears a long ___, like a girl from the 19th century. | dress (full) ; skirt (partial) ; costume (partial) | dress (full) ; a dress (full) ; dresses (partial) | hat ; cap ; belt |
| g2u03.w.front-window | front window | The glass in a building that you look out of, into the street | We put some vampire stickers on his ___. | front window (full) ; front windows (full) ; window (partial) ; windows (partial) | front window (full) ; a front window (full) | stairs ; graveyard ; knife |
| g2u03.w.ghost | ghost | A dead man or woman who can come back at night in scary stories. | Edwina looked white. Then she disappeared. Was she a ___? | ghost (full) | ghost (full) ; a ghost (full) ; ghosts (partial) | king ; vampire ; superheroine |
| g2u03.w.graveyard | graveyard | A dark place with stones where the dead lie. | There were some trees next to the ___, a dark place with stones for the dead. | graveyard (full) | graveyard (full) ; a graveyard (full) ; cemetery (partial) | castle ; park ; supermarket |
| g2u03.w.guys | guys | You can call a group of friends or children this. | Come on, ___. Don't look. OK? | guys (full) ; everybody (partial) | guys (full) ; kids (partial) | teachers ; parents ; customers |
| g2u03.w.knife | knife (pl knives) | With this, you can cut off a piece of bread or cheese | I need a ___ to cut vegetables. | knife (full) | knife (full) ; a knife (full) | plate ; glass ; bottle |
| g2u03.w.mask | mask | You wear it over your eyes and nose, so you look like a ghost or a vampire. | Everybody wears a ___ over their eyes. We're vampires, witches and ghosts! | mask (full) | mask (full) ; a mask (full) ; masks (partial) | costume ; hat ; dress |
| g2u03.w.myself | myself | Me, and no one else - like in: "I looked at ... in the mirror." | When I am alone, I often talk to ___. | myself (full) | myself (full) ; me (partial) | him ; her ; them |
| g2u03.w.picnic | picnic | Lunch outside. You sit down in the park and eat sandwiches from a basket. | Let's have a ___ in the park. I can bring sandwiches and orange juice. | picnic (full) ; party (partial) | picnic (full) ; a picnic (full) | costume ; graveyard ; tradition |
| g2u03.w.pumpkin-bucket | pumpkin bucket | Children carry it when they go trick-or-treating and put their sweets in it. | The child is trick-or-treating with a ___ for the sweets. | pumpkin bucket (full) | pumpkin bucket (full) ; a pumpkin bucket (full) ; pumpkin buckets (partial) | mask ; sticker ; costume |
| g2u03.w.shall | shall | You ask a friend about what to do: "Where ... we go? What ... we do?" | "Where ___ we go?" asked Edwina. "Well, down the road!" | shall (full) ; should (partial) ; can (partial) | shall (full) ; should (partial) | must ; couldn't ; can't |
| g2u03.w.sick | sick | Ill and not well. You can be like this after too many sweets. | I feel a bit ___. Too many sweets! | sick (full) ; ill (partial) | sick (full) | cute ; wild ; proud |
| g2u03.w.stairs | stairs | In a building, you go up these to the rooms over you | We go up the ___ in the dark. | stairs (full) | stairs (full) ; the stairs (full) | door ; front window ; garage |
| g2u03.w.sticker | sticker | A small picture that you can put on a window, a book or a door | I put a vampire ___ on his window. | sticker (full) | sticker (full) ; a sticker (full) ; stickers (partial) | mask ; magazine ; key ring |
| g2u03.w.superheroine | superheroine | A very strong woman from a story or a fantasy film. She fights bad people. | She was dressed up as her favourite ___. | superheroine (full) ; superhero (partial) | superheroine (full) ; superhero (partial) | century ; tradition ; graveyard |
| g2u03.w.sweets | sweets | Food with a lot of sugar in it, like chocolate | People sometimes give us ___ at Halloween. | sweets (full) ; candy (partial) | sweets (full) ; candy (partial) | cheese ; sausages ; bread |
| g2u03.w.to-be-proud | to be proud (of) | When you are very happy about a good thing that you did | This year my pumpkin was the best. I was very ___ of it. | proud (full) | to be proud of (full) ; to be proud (full) ; be proud of (full) ; be proud (full) ; proud (full) | to be scared of ; to fear ; to scare |
| g2u03.w.to-cut-off | to cut off | To make a piece go away with a knife | Please give me the knife. I want to ___ the top of the pumpkin. | cut off (full) | to cut off (full) ; cut off (full) | to keep ; to lose ; to scare |
| g2u03.w.to-fear | to fear | To be scared of a ghost, a big dog or a scary story. | We do not ___ the zombies, because we aren't scared of them! | fear (full) | to fear (full) ; fear (full) | to scare ; to love ; to enjoy |
| g2u03.w.to-keep | to keep | To have a thing and not give it away | Let's ___ the pumpkin for Halloween. | keep (full) | to keep (full) ; keep (full) | to lose ; to cut off ; to fear |
| g2u03.w.to-lose | to lose | To not have it any more because you cannot find it. | I don't want to ___ my mobile phone. | lose (full) ; break (partial) ; forget (partial) | lose (full) ; to lose (full) ; lost (partial) | find ; eat ; wash |
| g2u03.w.to-scare | to scare | When a ghost or a scary story makes you jump. | At Halloween, some costumes ___ me. | scare (full) ; scared (full) ; frighten (partial) | scare (full) ; to scare (full) ; frighten (partial) ; to frighten (partial) | fear ; keep ; lose |
| g2u03.w.tradition | tradition | What a family always does, year after year — at Halloween or on a birthday. | What's your favourite Halloween ___ — apple bobbing or trick or treat? | tradition (full) | tradition (full) ; a tradition (full) ; traditions (partial) | surprise ; opinion ; joke |
| g2u03.w.trick-or-treat | trick or treat | At Halloween, children knock on doors and ask for sweets. | When my friends meet for ___, we go from door to door. | trick or treat (full) ; trick-or-treat (full) | trick or treat (full) ; trick-or-treat (full) ; Trick or treat! (partial) | apple bobbing ; picnic ; tradition |
| g2u03.w.trick-or-treat-2 | Trick or treat! | Children ask this at the door at Halloween when they want sweets | We knocked on the door. A woman opened it. "___?" Darren asked. | Trick or treat (full) ; trick or treat (full) ; Trick or treat! (full) ; Trick-or-treat (full) ; trick-or-treat (full) ; Trick-or-treat! (full) | Trick or treat! (full) ; Trick or treat (full) ; trick or treat (full) ; Trick-or-treat! (full) ; Trick-or-treat (full) ; trick-or-treat (full) | Go away! ; Come on! ; Congratulations! |
| g2u03.w.vampire | vampire | In scary stories, a man with long teeth and a black cape. | I've got my ___ costume, but I can't find my teeth. | vampire (full) | vampire (full) ; a vampire (full) ; vampires (partial) | ghost ; witch ; superheroine |
| g2u03.w.wild | wild | Very noisy, with a lot of running and jumping. | You shouldn't play many ___ games. | wild (full) ; dangerous (partial) | wild (full) | cute ; sick ; proud |
| g2u03.w.witch | witch | A woman in scary stories who can do magic. | Do all ___ wear funny hats? — Yes, and they can do magic, too! | witches (full) | witch (full) ; a witch (full) ; witches (partial) | ghost ; vampire ; superheroine |

## Grammar items (27)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g2u03.gi.should.cp.001 | context-picker | Lara is eating too many sweets. Now she is sick. [en] | She shouldn't eat so many sweets. (full) | — | She should eat so many sweets. ; She don't should eat so many sweets. ; She shouldn't to eat so many sweets. | — | — | true |
| g2u03.gi.should.cp.002 | context-picker | Edwina wants to go into the dark building next to the graveyard. Ron is scared. [en] | You shouldn't go in there alone. (full) | — | You should go in there alone. ; You don't should go in there alone. ; You shoulds go in there alone. | — | — | true |
| g2u03.gi.should.ec.001 | error-correction | You should to wear a costume at Halloween. [en] | You should wear a costume at Halloween. (full) ; You should wear a costume at Halloween (full) ; should wear (partial) | — | — | — | — | true |
| g2u03.gi.should.ec.002 | error-correction | You don't should go out alone at night. [en] | You shouldn't go out alone at night. (full) ; You shouldn't go out alone at night (full) ; You should not go out alone at night. (full) ; You should not go out alone at night (full) ; shouldn't go (partial) ; should not go (partial) ; shouldn't (partial) | — | — | — | — | true |
| g2u03.gi.should.ec.003 | error-correction | Henry shoulds put a candle in the front window. [en] | Henry should put a candle in the front window. (full) ; Henry should put a candle in the front window (full) ; should put (partial) ; should (partial) | — | — | — | — | true |
| g2u03.gi.should.gf.001 | gap-fill | Sarah's tip: You ___ wear a Halloween costume. It's fun! [en, 1 blank(s)] | should (full) | — | — | — | — | true |
| g2u03.gi.should.gf.002 | gap-fill | We ___ go in there – it's dangerous. [en, 1 blank(s)] | shouldn't (full) ; should not (full) | — | — | — | — | true |
| g2u03.gi.should.gf.003 | gap-fill | You ___ always tell an adult where you are going. [en, 1 blank(s)] | should (full) | — | — | — | — | true |
| g2u03.gi.should.gf.004 | gap-fill | Ron is alone at the graveyard and he is scared. He asks: 'What ___ I do?' [en, 1 blank(s)] | should (full) ; shall (full) | — | — | — | — | true |
| g2u03.gi.should.gf.005 | gap-fill | Lara is sick. Ron is angry: 'You ___ (not) eat so many sweets!' [en, 1 blank(s)] | shouldn't (full) ; should not (full) | — | — | — | — | true |
| g2u03.gi.should.gf.006 | gap-fill | It's dark and Edwina is scared. She asks Ron: '___ I call my parents now?' [en, 1 blank(s)] | Should (full) ; Shall (full) | — | — | — | — | true |
| g2u03.gi.should.gf.007 | gap-fill | It's night and very dark. We ___ ___ (go) back now. [en, 2 blank(s)] | should \| go (full) | — | — | — | — | true |
| g2u03.gi.should.gf.008 | gap-fill | Ask your mum about your costume for Halloween: '___ I ___ (wear) my witch dress or my vampire costume?' [en, 2 blank(s)] | Should \| wear (full) ; Shall \| wear (full) | — | — | — | — | true |
| g2u03.gi.should.gf.009 | gap-fill | Sarah's tips for Halloween at school: The children ___ ___ (be) too wild. [en, 2 blank(s)] | shouldn't \| be (full) ; should not \| be (full) ; should \| not be (full) | — | — | — | — | true |
| g2u03.gi.should.gs.001 | group-sort | Tips for trick-or-treating [en] | — | — | — | — | You should …: wear a costume, always go with friends, tell an adult where you are going \| You shouldn't …: scare very small children, stay out too long, eat all the sweets in one go, go out alone | true |
| g2u03.gi.should.mc.001 | multiple-choice | You ___ scare small children. It isn't funny for them. [en, 1 blank(s)] | shouldn't (full) | — | should ; must ; couldn't | — | — | true |
| g2u03.gi.should.mc.002 | multiple-choice | Henry's pumpkin bucket is so scary. The teacher is proud of it: 'We ___ keep it for Halloween at school.' [en, 1 blank(s)] | should (full) | — | shouldn't ; couldn't ; can't | — | — | true |
| g2u03.gi.should.mc.003 | multiple-choice | Sarah wants good music for Halloween, but it ___ be too noisy. [en, 1 blank(s)] | shouldn't (full) | — | should ; must ; couldn't | — | — | true |
| g2u03.gi.should.mt.001 | matching | Tips for Halloween night [en] | — | — | — | I'm so tired. ↔ You should go to bed early. ; It's very dark in here. ↔ You should find a candle. ; I can't find my vampire teeth. ↔ You should look on the table. ; I eat sweets all day. ↔ You shouldn't eat so many sweets. | — | false |
| g2u03.gi.should.mt.002 | matching | What should they do? [en] | — | — | — | It's Halloween tonight. ↔ We should put on our costumes. ; The graveyard is very dark. ↔ We shouldn't go in there now. ; Lara is sick. ↔ She shouldn't eat more sweets. ; The picture of the witch is so scary. ↔ We should keep it for Halloween. | — | false |
| g2u03.gi.should.qf.001 | question-formation | I should tell my parents. [en] | Should I tell my parents? (full) ; Should I tell my parents (full) | — | — | — | — | false |
| g2u03.gi.should.qf.002 | question-formation | wear / should / what / I / tonight [en] | What should I wear tonight? (full) ; What should I wear tonight (full) | — | — | — | — | false |
| g2u03.gi.should.sb.001 | sentence-building | bed / should / you / to / go / don't [en] | You should go to bed. (full) ; You should go to bed (full) | — | don't | — | — | false |
| g2u03.gi.should.sb.002 | sentence-building | go / alone / you / shouldn't / out / don't / to [en] | You shouldn't go out alone. (full) ; You shouldn't go out alone (full) | — | don't ; to | — | — | true |
| g2u03.gi.should.tr.001 | translation | Du solltest immer mit Freunden gehen. [de] | You should always go with friends. (full) ; You should always go with friends (full) ; You should always go with your friends. (partial) ; You should always go with your friends (partial) | deToEn | — | — | — | true |
| g2u03.gi.should.tr.002 | translation | Lara sollte nicht so viele Süßigkeiten essen. [de] | Lara shouldn't eat so many sweets. (full) ; Lara shouldn't eat so many sweets (full) ; Lara should not eat so many sweets. (full) ; Lara should not eat so many sweets (full) ; Lara shouldn't have so many sweets. (partial) ; Lara shouldn't have so many sweets (partial) ; Lara shouldn't eat so much candy. (partial) ; Lara shouldn't eat so much candy (partial) ; Lara shouldn't eat so many candies. (partial) ; Lara should not eat so much candy. (partial) ; Lara should not eat so many candies. (partial) | deToEn | — | — | — | true |
| g2u03.gi.should.tr.003 | translation | What should I do? [en] | Was soll ich tun? (full) ; Was soll ich tun (full) ; Was soll ich machen? (full) ; Was soll ich machen (full) ; Was sollte ich tun? (full) ; Was sollte ich tun (full) ; Was sollte ich machen? (full) ; Was sollte ich machen (full) | enToDe | — | — | — | false |

## Output contract

Write `content/corpus/units/g2-u03/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u03",
  "lens": "answers",
  "itemsHash": "8a00bfa24670",
  "promptHash": "70fa2d8cdf22",
  "round": 4,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 61, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
