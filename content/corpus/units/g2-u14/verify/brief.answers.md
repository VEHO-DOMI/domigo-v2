# Verify lens — answers — g2-u14 (round 1)

<!-- domigo:verify answers g2-u14 items=3b3f1280995c prompt=70fa2d8cdf22 round=1 -->

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

## Vocab items (37)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g2u14.w.challenge | challenge | Something new and difficult that you have to work for. | The competition was a big ___ for me, but I did it. | challenge (full) ; challenges (partial) | challenge (full) ; challenges (full) | competition ; race ; distance |
| g2u14.w.competition | competition | A day when many people play or run and all try to be the best. | Have you ever won a ___ at your school? | competition (full) ; competitions (partial) | competition (full) ; competitions (full) | race ; challenge ; distance |
| g2u14.w.cycling | cycling | Riding a bike from place to place on the road. | I go ___ to school every day and it is not far. | cycling (full) | cycling (full) | mountain biking ; skateboarding ; swimming |
| g2u14.w.distance | distance | How much space there is from place to place. | You have to throw the egg over a big ___ in this sport. | distance (full) ; distances (partial) | distance (full) ; distances (full) | challenge ; competition ; race |
| g2u14.w.equipment | equipment | All the things you need to have so you can do a sport or a job. | You do not need a lot of ___ to go running. | equipment (full) | equipment (full) | challenge ; success ; distance |
| g2u14.w.extreme | extreme | So strong, so fast or so dangerous that it is much more than usual. | I have never done any ___ sports because they scare me. | extreme (full) | extreme (full) | serious ; official ; professional |
| g2u14.w.flood | flood | A lot of rain that covers dry land where there is usually no river. | After days of rain, there is a big ___ in the village. | flood (full) ; floods (partial) | flood (full) ; floods (full) | distance ; challenge ; race |
| g2u14.w.ice-skating | ice skating | Going fast over a cold, frozen lake on special shoes in winter. | In winter we love ___ on the frozen lake in the park. | ice skating (full) ; ice-skating (full) | ice skating (full) ; ice-skating (full) | roller-skating ; swimming ; cycling |
| g2u14.w.member | member | One of the people who are in a group or a club. | She is a ___ of the school running club. | member (full) ; members (partial) | member (full) ; members (full) | professional ; challenge ; race |
| g2u14.w.mountain-biking | mountain biking | Going fast down hills and along bumpy roads outside on two wheels. | We go ___ in the hills and it is so much fun. | mountain biking (full) ; mountain-biking (full) | mountain biking (full) ; mountain-biking (full) | cycling ; skateboarding ; swimming |
| g2u14.w.mountain-climbing | mountain climbing | Going up high rocks on a very tall hill with your feet and your strong arms. | ___ is exciting, but you have to be strong to go so high. | mountain climbing (full) ; mountain-climbing (full) | mountain climbing (full) ; mountain-climbing (full) | skiing ; swimming ; cycling |
| g2u14.w.nil | nil | The number nothing when people tell the score in a match. | The score in the running match was twenty to ___. | nil (full) | nil (full) | distance ; success ; race |
| g2u14.w.official | official | The people who are in charge say yes to it, so everybody can trust it. | Is there an ___ world record in this sport? | official (full) | official (full) | serious ; extreme ; professional |
| g2u14.w.on-one-s-own | on one's own | When you are alone and nobody is with you. | So there I was, all on my ___, with no friends at all. | own (full) ; on my own (partial) ; on his own (partial) ; on her own (partial) ; on your own (partial) | on one's own (full) ; on my own (full) ; on your own (full) | without ; rather ; serious |
| g2u14.w.professional | professional | Doing a sport or a job for money, not just for fun. | I want to play ___ basketball when I am big. | professional (full) | professional (full) | serious ; official ; extreme |
| g2u14.w.race | race | A run or a ride where all the people try to be the fastest and come first. | I came first in the running ___ on our school day! | race (full) ; races (partial) | race (full) ; races (full) | competition ; challenge ; member |
| g2u14.w.rather | rather | Quite, more than a bit but not very much. | The match was ___ long, so we were all tired at the end. | rather (full) | rather (full) | serious ; extreme ; official |
| g2u14.w.roller-skating | roller-skating | Going fast along the ground on shoes with small wheels. | We love ___ in the park and we do it all day. | roller-skating (full) ; roller skating (full) | roller-skating (full) ; roller skating (full) | ice skating ; skateboarding ; cycling |
| g2u14.w.serious | serious | Very bad, or so big that nobody is laughing about it. | Have you had any ___ accidents while doing sport? | serious (full) | serious (full) | official ; extreme ; professional |
| g2u14.w.skateboarding | skateboarding | Going along the ground on a small board while you do clever tricks. | I do a lot of ___ and now I can do many tricks on my board. | skateboarding (full) | skateboarding (full) | roller-skating ; snowboarding ; cycling |
| g2u14.w.skiing | skiing | Going fast down a snowy mountain with two long boards on your feet. | We go ___ in the Alps every winter holiday. | skiing (full) | skiing (full) | snowboarding ; ice skating ; cycling |
| g2u14.w.snowboarding | snowboarding | Going fast down a snowy mountain while you stand on one wide board. | I do a lot of ___ and I can now go very fast down the snow. | snowboarding (full) | snowboarding (full) | skiing ; skateboarding ; surfing |
| g2u14.w.sportsman-and-sportswoman | sportsman and sportswoman | A man or a woman who plays or runs very well, often for money. | Who is your favourite ___ to watch on a big match day? | sportsman (full) ; sportswoman (full) ; sportsman and sportswoman (full) | sportsman (full) ; sportswoman (full) ; sportsman and sportswoman (full) | member ; professional ; challenge |
| g2u14.w.success | success | When something is very good and people are happy with it. | Was the fun day a ___? Did everybody have a good time? | success (full) ; successes (partial) | success (full) ; successes (full) | challenge ; competition ; race |
| g2u14.w.surfing | surfing | Standing on a board and going along the big sea when it moves. | ___ looks amazing, but it is not easy to stay on the board. | surfing (full) | surfing (full) | windsurfing ; swimming ; cycling |
| g2u14.w.swimming | swimming | Going along in a lake or in the sea using your arms and legs. | When it is hot, we go ___ in the lake every day. | swimming (full) | swimming (full) | surfing ; skiing ; cycling |
| g2u14.w.to-appear | to appear | To show up so that all the people can suddenly watch you, often on a screen. | Would you like to ___ on television one day? | appear (full) ; appears (partial) ; appeared (partial) | appear (full) ; to appear (full) | manage ; score ; grow up |
| g2u14.w.to-grow-up | to grow up | To become bigger every year and slowly become an adult. | When I ___, I want to be an Olympic skier. | grow up (full) ; grow (partial) | grow up (full) ; to grow up (full) ; grows up (partial) ; grew up (partial) | appear ; manage ; score |
| g2u14.w.to-manage | to manage | To do something well in the end, even when it is difficult. | A team from New Zealand ___ to make a new world record. | managed (full) ; manage (partial) ; manages (partial) | manage (full) ; to manage (full) | appear ; score ; grow up |
| g2u14.w.to-score | to score | To make a point for your team in a match. | She wants to ___ a goal for her team in the match. | score (full) ; scores (partial) ; scored (partial) | score (full) ; to score (full) | tackle ; appear ; manage |
| g2u14.w.to-snorkel | to snorkel | To go just under the sea with a short tube so you can breathe and look at fish. | I love to ___ in the sea and watch all the fish. | snorkel (full) ; snorkels (partial) ; snorkelled (partial) ; snorkeled (partial) | snorkel (full) ; to snorkel (full) | appear ; manage ; tackle |
| g2u14.w.to-tackle | to tackle | To run at another player in a match and push them away from the ball. | In the match, Helen ___ Eddie. | tackled (full) ; tackle (partial) ; tackles (partial) | tackle (full) ; to tackle (full) | score ; appear ; manage |
| g2u14.w.to-take-part | to take part (in) | To join in and do something with a group of people. | Do you want to ___ part in the running competition? | take (full) ; take part (full) ; take part in (partial) | take part (full) ; to take part (full) ; take part in (full) ; takes part (partial) ; took part (partial) | appear ; manage ; grow up |
| g2u14.w.waste-of-time | waste of time | Something boring that gives you nothing good back. | This match is so boring. It is a ___. | waste of time (full) | waste of time (full) | world record ; challenge ; success |
| g2u14.w.windsurfing | windsurfing | Standing on a board with a sail and going over a windy lake. | My uncle loves ___ on the lake on windy summer days. | windsurfing (full) | windsurfing (full) | surfing ; swimming ; cycling |
| g2u14.w.without | without | When you do not have a thing or a friend with you. | You have to throw the egg ___ breaking it. | without (full) | without (full) | rather ; serious ; official |
| g2u14.w.world-record | world record | The very best that anyone has ever done in a sport. | There is an official ___ for throwing an egg the furthest. | world record (full) ; world records (partial) | world record (full) ; world records (full) | competition ; challenge ; success |

## Grammar items (34)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g2u14.gi.present-perfect-already-yet.ag.001 | anagram | Das Wort für 'schon' im positiven Perfektsatz (zwischen have/has und der dritten Form): [de] | already (full) | — | — | — | — | false |
| g2u14.gi.present-perfect-already-yet.cp.002 | context-picker | Your friend wants to watch the cycling race with you, but you watched it last week. What do you tell her? [en] | No thanks, I have already seen it. (full) | — | No thanks, I have seen it yet. ; No thanks, I have already seen it yet. ; No thanks, I has already seen it. | — | — | false |
| g2u14.gi.present-perfect-already-yet.ec.002 | error-correction | She hasn't yet finished the swimming race. [en] | She hasn't finished the swimming race yet. (full) ; She has not finished the swimming race yet. (full) ; finished the swimming race yet (partial) | — | — | — | — | false |
| g2u14.gi.present-perfect-already-yet.ec.003 | error-correction | We haven't already taken part in a competition. [en] | We haven't taken part in a competition yet. (full) ; We have not taken part in a competition yet. (full) | — | — | — | — | false |
| g2u14.gi.present-perfect-already-yet.ec.004 | error-correction | I already have won my first race. [en] | I have already won my first race. (full) ; I've already won my first race. (full) ; have already won (partial) | — | — | — | — | false |
| g2u14.gi.present-perfect-already-yet.gf.001 | gap-fill | I have ___ done my homework, so I can train now. [en, 1 blank(s)] | already (full) | — | — | — | — | false |
| g2u14.gi.present-perfect-already-yet.gf.002 | gap-fill | Hurry up! Have you done your training ___? [en, 1 blank(s)] | yet (full) | — | — | — | — | false |
| g2u14.gi.present-perfect-already-yet.gf.003 | gap-fill | She hasn't won a race ___, but she keeps training. [en, 1 blank(s)] | yet (full) | — | — | — | — | false |
| g2u14.gi.present-perfect-already-yet.gf.004 | gap-fill | We have ___ won two races today. Let's go for a third! [en, 1 blank(s)] | already (full) | — | — | — | — | false |
| g2u14.gi.present-perfect-already-yet.gf.005 | gap-fill | Has your sister finished the race ___? — No, she's still swimming. [en, 1 blank(s)] | yet (full) | — | — | — | — | false |
| g2u14.gi.present-perfect-already-yet.gf.006 | gap-fill | I can't go cycling with you. I have ___ given my skateboard to my sister. [en, 1 blank(s)] | already (full) | — | — | — | — | false |
| g2u14.gi.present-perfect-already-yet.gs.001 | group-sort | already / yet [en] | — | — | — | — | She has already …: She has already won a race., We have already done our homework., They have already won two races. \| They haven't … yet: They haven't won a race yet., Have you done your training yet?, I haven't done my homework yet. | false |
| g2u14.gi.present-perfect-already-yet.mc.001 | multiple-choice | She ___ won a competition. [en, 1 blank(s)] | has already (full) | — | already has ; has won already ; won already | — | — | true |
| g2u14.gi.present-perfect-already-yet.mc.002 | multiple-choice | He ___ started training for the competition. [en, 1 blank(s)] | hasn't (full) | — | isn't ; doesn't ; wasn't | — | — | true |
| g2u14.gi.present-perfect-already-yet.mp.001 | matching-pairs | She has already … / They haven't … / Have you … [en] | — | — | — | She has already ↔ won her first race. ; I haven't ↔ done my homework yet. ; Have you done ↔ your training yet? ; They have already ↔ won two races. | — | false |
| g2u14.gi.present-perfect-already-yet.qf.001 | question-formation | You want to ask Tom about his training. Ask if he is finished, using a word that goes at the end and means 'bis jetzt'. [de] | Have you finished your training yet? (full) ; Have you finished training yet? (full) | — | — | — | — | false |
| g2u14.gi.present-perfect-already-yet.sb.001 | sentence-building | already / has / won / she / a race [en] | She has already won a race. (full) | — | — | — | — | false |
| g2u14.gi.present-perfect-already-yet.sb.002 | sentence-building | the / cycling / race / they / haven't / yet / finished [en] | They haven't finished the cycling race yet. (full) | — | — | — | — | false |
| g2u14.gi.present-perfect-already-yet.tf.001 | transformation | Your friend has won a race today. It happened a short time ago. 'She has ___ won a race.' [en, 1 blank(s)] | already (full) | — | — | — | — | false |
| g2u14.gi.present-perfect-already-yet.tf.003 | transformation | Your coach asks about your training. You have not done it. 'I ___ my training ___.' [en, 2 blank(s)] | haven't done \| yet (full) ; have not done \| yet (full) | — | — | — | — | false |
| g2u14.gi.present-perfect-already-yet.tr.001 | translation | Sie hat schon drei Wettkämpfe gewonnen. [de] | She has already won three competitions. (full) ; She's already won three competitions. (full) | deToEn | — | — | — | false |
| g2u14.gi.present-perfect-already-yet.tr.002 | translation | Er war noch nicht bei einem Wettkampf. [de] | He hasn't been to a competition yet. (full) ; He has not been to a competition yet. (full) | deToEn | — | — | — | false |
| g2u14.gi.present-perfect-ever-never.ag.001 | anagram | Das Wort für 'noch nie' im Perfekt (der Satz bleibt positiv, kein extra not): [de] | never (full) | — | — | — | — | false |
| g2u14.gi.present-perfect-ever-never.ec.001 | error-correction | I haven't never been snorkelling. [en] | I have never been snorkelling. (full) ; I've never been snorkelling. (full) ; have never been snorkelling (partial) | — | — | — | — | false |
| g2u14.gi.present-perfect-ever-never.ec.002 | error-correction | I have ever been to a windsurfing competition. [en] | I have been to a windsurfing competition. (full) ; I've been to a windsurfing competition. (full) | — | — | — | — | false |
| g2u14.gi.present-perfect-ever-never.gf.001 | gap-fill | Have you ___ been mountain climbing? [en, 1 blank(s)] | ever (full) | — | — | — | — | false |
| g2u14.gi.present-perfect-ever-never.gf.002 | gap-fill | I have ___ tried surfing. I don't think I would like it. [en, 1 blank(s)] | never (full) | — | — | — | — | false |
| g2u14.gi.present-perfect-ever-never.gf.003 | gap-fill | Have you ___ won a race? — No, I ___ have. [en, 2 blank(s)] | ever \| never (full) | — | — | — | — | false |
| g2u14.gi.present-perfect-ever-never.mc.001 | multiple-choice | I ___ won a competition, but I love taking part. [en, 1 blank(s)] | have never (full) | — | haven't never ; have ever ; never have | — | — | true |
| g2u14.gi.present-perfect-ever-never.mc.003 | multiple-choice | I have ___ won a race. I always come last! [en, 1 blank(s)] | never (full) | — | ever ; already ; yet | — | — | true |
| g2u14.gi.present-perfect-ever-never.mt.001 | matching | Have you ever …? [en] | — | — | — | Have you ever won a competition? ↔ Yes, I have. I won a race last year. ; Have you ever met famous people? ↔ No, I never have. One day, I would love to! ; Have you ever been mountain climbing? ↔ Yes, I have. It was an amazing challenge. | — | false |
| g2u14.gi.present-perfect-ever-never.sb.001 | sentence-building | never / I've / a race / won [en] | I've never won a race. (full) ; I have never won a race. (full) | — | — | — | — | false |
| g2u14.gi.present-perfect-ever-never.tf.001 | transformation | You want to ask your friend about her life. Ask if she has won a race at any time. 'Have you ___ won a race?' [en, 1 blank(s)] | ever (full) | — | — | — | — | false |
| g2u14.gi.present-perfect-ever-never.tr.001 | translation | Ich habe noch nie berühmte Leute getroffen. [de] | I have never met famous people. (full) ; I've never met famous people. (full) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g2-u14/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u14",
  "lens": "answers",
  "itemsHash": "3b3f1280995c",
  "promptHash": "70fa2d8cdf22",
  "round": 1,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 71, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
