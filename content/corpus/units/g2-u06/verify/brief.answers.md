# Verify lens — answers — g2-u06 (round 2)

<!-- domigo:verify answers g2-u06 items=294d10cc9c5d prompt=70fa2d8cdf22 round=2 -->

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

## Vocab items (51)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g2u06.w.absolutely | absolutely | more than very | The guides were ___ angry when Bob jumped in the lake. | absolutely (full) | absolutely (full) | actually ; although ; while |
| g2u06.w.actually | actually | really, when it is a surprise | The rest of the day was ___ fun. | actually (full) | actually (full) | absolutely ; although ; while |
| g2u06.w.adventure-camp | adventure camp | a holiday place where children climb and have fun outside | We are going to spend three days at the ___ in the mountains. | adventure camp (full) ; adventure camps (partial) | adventure camp (full) | campfire ; picnic ; waterfall |
| g2u06.w.alive | alive | not dead, still living | The boy was hurt, but he was still ___. | alive (full) | alive (full) | actually ; absolutely ; while |
| g2u06.w.although | although | this is like 'but still' | I enjoyed it, ___ I wasn't very good at it. | although (full) | although (full) | actually ; absolutely ; while |
| g2u06.w.anorak | anorak | a jacket you wear on cold and wet days | Wear an ___ near the waterfall. | anorak (full) ; anoraks (partial) | anorak (full) | hard hat ; life jacket ; canoe |
| g2u06.w.beach | beach | the place where the land meets the sea and you can play | We can play on the ___ next to the sea all day. | beach (full) ; beaches (partial) | beach (full) | forest ; mountains ; field |
| g2u06.w.bottom | bottom | the place down at the end of a thing | The lake is at the ___ of the picture. | bottom (full) | bottom (full) | middle ; left-hand ; right-hand |
| g2u06.w.camp | camp | a place where children stay outside on holiday | We played in the sea all day on our summer ___. | camp (full) ; camps (partial) | camp (full) | picnic ; campfire ; guide |
| g2u06.w.campfire | campfire | you make this outside at night and tell scary stories in the dark | In the dark forest there was a ___, and we had fun in the light of the fire. | campfire (full) ; campfires (partial) | campfire (full) | picnic ; canoe ; guide |
| g2u06.w.canoe | canoe | a small light thing you go down the river in | The children can go down the river in a small ___. | canoe (full) ; canoes (partial) | canoe (full) | campfire ; picnic ; anorak |
| g2u06.w.canoeing | canoeing | going down a river in a small canoe | ___ down the river in a canoe is great fun at camp. | canoeing (full) | canoeing (full) | rock climbing ; picnic ; campfire |
| g2u06.w.cry | cry | a call for help when you are hurt or scared | There was a ___ for help from the river. | cry (full) ; cries (partial) | cry (full) | picnic ; gate ; drive |
| g2u06.w.drive | drive | a long time going somewhere in a car | It was a long ___ in the car to the camp. | drive (full) ; drives (partial) | drive (full) | road ; gate ; while |
| g2u06.w.field | field | the big open green land on a farm | Sheep eat in the big green ___ next to the farm. | field (full) ; fields (full) | field (full) ; fields (full) | forest ; village ; road |
| g2u06.w.forest | forest | a big place with lots of trees | There are lots of tall trees in the dark ___ near the camp. | forest (full) ; forests (partial) | forest (full) | valley ; river ; village |
| g2u06.w.gate | gate | A big door you open to go into a field or garden. | There was a huge ___ with a big sign on it. | gate (full) ; gates (partial) | gate (full) | road ; drive ; camp |
| g2u06.w.guide | guide | the man or woman who looks after a group at the camp | The ___ showed the group the canoe. | guide (full) ; guides (full) | guide (full) ; guides (full) | shepherd ; canoe ; picnic |
| g2u06.w.hard-hat | hard hat | a strong thing you put on to build a tree house or climb | When you build a tree house, you have to wear a ___. | hard hat (full) ; hard hats (partial) | hard hat (full) | anorak ; life jacket ; canoe |
| g2u06.w.hill | hill | high green land smaller than the mountains | We can run up the small green ___ and look at the town down there. | hill (full) ; hills (partial) | hill (full) ; hills (full) | valley ; river ; forest |
| g2u06.w.i-m-off-now | I'm off now. | what you tell people when you go | ___ Bye! I need to catch my train. | I'm off now. (full) ; I'm off now (full) ; I am off now. (partial) | I'm off now. (full) ; I'm off now (full) ; I am off now. (partial) | Poor you! ; Once upon a time ; Absolutely |
| g2u06.w.lake | lake | a big area of water, smaller than the sea | We can go canoeing on the ___ in the mountains; it is cold up there! | lake (full) ; lakes (partial) | lake (full) | river ; mountains ; forest |
| g2u06.w.left-hand | left-hand | The side that is not the right one. | On the ___ side there's a lake. | left-hand (full) ; left hand (partial) | left-hand (full) ; left hand (partial) | right-hand ; middle ; bottom |
| g2u06.w.life-jacket | life jacket | you wear this in a canoe so you do not go under | You have to wear a ___ in the canoe all the time. | life jacket (full) ; life jackets (partial) | life jacket (full) | anorak ; hard hat ; canoe |
| g2u06.w.middle | middle | the inside place of a thing, not at the end | In the ___ of the forest there was a campfire. | middle (full) | middle (full) | bottom ; left-hand ; right-hand |
| g2u06.w.moon | moon | the big light in the sky at night | At night the ___ was big and bright in the dark sky. | moon (full) ; moons (partial) | moon (full) | sun ; stars ; sea |
| g2u06.w.motorway | motorway | a very big road where cars and trucks go very fast | The cars go fast on the big ___ to Vienna. | motorway (full) ; motorways (partial) | motorway (full) | road ; river ; valley |
| g2u06.w.mountains | mountains | the very high land you climb up with snow on it | There was white snow high on the ___. | mountains (full) ; mountain (partial) | mountains (full) ; mountain (partial) | hill ; valley ; forest |
| g2u06.w.once-upon-a-time | once upon a time | the first thing you read in a story about long ago | ___, there was a young shepherd boy who lived in the forest. | once upon a time (full) | once upon a time (full) | poor you ; i'm off now ; absolutely |
| g2u06.w.picnic | picnic | food and drink you bring to eat outside | We had a ___ near the river with sandwiches and orange juice. | picnic (full) ; picnics (partial) | picnic (full) | campfire ; canoe ; guide |
| g2u06.w.poor-you | Poor you! | what you tell a friend who is sad or hurt | ___! You look very hungry and sad. | Poor you! (full) ; Poor you (full) | Poor you! (full) ; Poor you (full) | I'm off now. ; Once upon a time ; Actually |
| g2u06.w.right-hand | right-hand | The side that is not the left one. | On the ___ side there's a waterfall. | right-hand (full) ; right hand (partial) | right-hand (full) ; right hand (partial) | left-hand ; middle ; bottom |
| g2u06.w.river | river | the long thing that fish live in and runs to the sea | There are lots of fish in the ___ that runs down to the sea. | river (full) ; rivers (partial) | river (full) | road ; forest ; mountains |
| g2u06.w.road | road | the long thing that cars and trucks drive on | Cars and trucks drive on the new ___ from our village. | road (full) ; roads (partial) | road (full) | motorway ; river ; forest |
| g2u06.w.rock-climbing | rock climbing | Going up very high places for fun. | You can do ___ on the high rocks at the camp, but be careful! | rock climbing (full) | rock climbing (full) | canoeing ; picnic ; campfire |
| g2u06.w.sea | sea | the big place fish live in, next to the beach | We played in the ___ all day on our holiday at the beach. | sea (full) ; seas (partial) | sea (full) | forest ; mountains ; village |
| g2u06.w.sheep | sheep (pl sheep) | the white farm thing a shepherd looks after on the hill | There were lots of ___ in the green fields. | sheep (full) | sheep (full) | shepherd ; guide ; camp |
| g2u06.w.shepherd | shepherd | the boy or girl who looks after sheep on a hill | The ___ boy looked after the sheep on the hill. | shepherd (full) ; shepherds (partial) | shepherd (full) | guide ; sheep ; camp |
| g2u06.w.stars | stars | small lights high in the sky at night | At night we looked at the ___ and the moon in the dark sky. | stars (full) ; star (partial) | stars (full) ; star (partial) | moon ; sun ; lake |
| g2u06.w.sun | sun | the big thing in the sky that gives us light in the day | The ___ was very hot, so we had a lot of orange juice. | sun (full) | sun (full) | moon ; stars ; lake |
| g2u06.w.to-be-afraid | to be afraid (of) | to be scared of a thing that can hurt you | The shepherd boy was not ___ of the dark forest. | afraid (full) ; afraid of (partial) | be afraid (full) ; to be afraid (full) ; afraid (full) ; be afraid of (partial) | good at ; alive ; actually |
| g2u06.w.to-be-good-at-sth | to be good at sth. | to do a thing really well | I wasn't very ___ building a tree house. | good at (full) | be good at (full) ; to be good at (full) ; good at (full) | alive ; actually ; while |
| g2u06.w.to-build-a-tree-house | to build a tree house | to make a small room up high in the leaves | My dad helped me ___ in the big tree. | build a tree house (full) ; to build a tree house (partial) | build a tree house (full) ; to build a tree house (full) ; built a tree house (partial) | rock climbing ; canoeing ; picnic |
| g2u06.w.to-care | to care | to look after a thing or a friend because you love them | The boy didn't ___ about the rules. | care (full) ; to care (partial) | care (full) ; to care (full) ; cares (partial) ; cared (partial) | trust ; build a tree house ; wash up |
| g2u06.w.to-trust | to trust | to think a friend is good and tell them your secrets | You have to ___ me. I am your friend. | trust (full) ; to trust (partial) | trust (full) ; to trust (full) ; trusts (partial) ; trusted (partial) | care ; wash up ; build a tree house |
| g2u06.w.to-wash-up | to wash up | to clean the plates after dinner | We don't have to ___ the dirty plates after dinner. | wash up (full) ; to wash up (partial) | wash up (full) ; to wash up (full) ; washes up (partial) ; washed up (partial) | care ; trust ; build a tree house |
| g2u06.w.town | town | a place where many people live, bigger than a village | Our ___ is bigger than a village, with lots of streets and people. | town (full) ; towns (partial) | town (full) | village ; forest ; valley |
| g2u06.w.valley | valley | the green land down in the middle of the mountains | A river runs down the green ___ in the middle of the mountains. | valley (full) ; valleys (partial) | valley (full) | hill ; mountains ; town |
| g2u06.w.village | village | a very small place in the country, smaller than a town | My grandma lives in a small ___ in the mountains, not a big town. | village (full) ; villages (partial) | village (full) | town ; forest ; valley |
| g2u06.w.waterfall | waterfall | white river going down high rocks | We can visit a ___ in the forest near the camp. | waterfall (full) ; waterfalls (partial) | waterfall (full) | forest ; river ; mountains |
| g2u06.w.while | while | a short time, not long | We waited for a ___ and then the train arrived. | while (full) | while (full) | drive ; gate ; camp |

## Grammar items (28)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g2u06.gi.have-to.ag.001 | anagram | Welche Form von have brauchst du bei he, she, it? (er/sie/es muss) [de] | has (full) | — | — | — | — | false |
| g2u06.gi.have-to.cp.001 | context-picker | It's a camp rule: every child in a canoe wears a life jacket. [en] | You have to wear a life jacket. (full) | — | You don't have to wear a life jacket. ; You have wear a life jacket. ; You has to wear a life jacket. | — | — | false |
| g2u06.gi.have-to.cp.002 | context-picker | Sam writes to her mum: at this camp the guides do the washing up. [en] | We don't have to wash up. (full) | — | We have to wash up. ; We haven't to wash up. ; We doesn't have to wash up. | — | — | false |
| g2u06.gi.have-to.ec.001 | error-correction | She have to wear a life jacket in the canoe. [en] | She has to wear a life jacket in the canoe. (full) ; has to (partial) | — | — | — | — | true |
| g2u06.gi.have-to.ec.002 | error-correction | You haven't to wash up at the camp. [en] | You don't have to wash up at the camp. (full) ; You do not have to wash up at the camp. (full) ; don't have to (partial) | — | — | — | — | true |
| g2u06.gi.have-to.ec.003 | error-correction | He hasn't to get up early on the free camp day. [en] | He doesn't have to get up early on the free camp day. (full) ; He does not have to get up early on the free camp day. (full) ; doesn't have to (partial) | — | — | — | — | true |
| g2u06.gi.have-to.ec.004 | error-correction | You have wear a hard hat to build a tree house. [en] | You have to wear a hard hat to build a tree house. (full) ; have to (partial) | — | — | — | — | true |
| g2u06.gi.have-to.ec.005 | error-correction | Do you have wash up after dinner? [en] | Do you have to wash up after dinner? (full) ; have to (partial) | — | — | — | — | true |
| g2u06.gi.have-to.gf.001 | gap-fill | You ___ wear a life jacket in the canoe. [en, 1 blank(s)] | have to (full) | — | has to ; have ; must to | — | — | false |
| g2u06.gi.have-to.gf.002 | gap-fill | She ___ get up early. The camp day is at 7. [en, 1 blank(s)] | has to (full) | — | have to ; has ; haves to | — | — | false |
| g2u06.gi.have-to.gf.003 | gap-fill | You ___ wash up. The guides do it at this camp. [en, 1 blank(s)] | don't have to (full) ; do not have to (full) | — | doesn't have to ; haven't to ; hasn't to | — | — | false |
| g2u06.gi.have-to.gf.004 | gap-fill | He ___ wear an anorak today. The sun is out. [en, 1 blank(s)] | doesn't have to (full) ; does not have to (full) | — | don't have to ; hasn't to ; haven't to | — | — | false |
| g2u06.gi.have-to.gf.005 | gap-fill | ___ you have to wear a hard hat to build a tree house? [en, 1 blank(s)] | Do (full) | — | Does ; Have ; Are | — | — | false |
| g2u06.gi.have-to.gf.006 | gap-fill | ___ Dana have to do all the camp jobs every day? [en, 1 blank(s)] | Does (full) | — | Do ; Has ; Is | — | — | false |
| g2u06.gi.have-to.gs.001 | group-sort | camp rules: have to or don't have to? [en] | — | — | — | — | You have to (it is a rule): wear a life jacket in the canoe, wear a hard hat to build a tree house, be at the gate at 8 a.m., read the camp guide \| You don't have to (not a rule): wash up after dinner, do all the camp jobs, bring food, come canoeing with us | false |
| g2u06.gi.have-to.mc.001 | multiple-choice | It is a camp rule: every child wears a life jacket in the canoe. [en] | She has to wear a life jacket. (full) | — | She have to wear a life jacket. ; She has wear a life jacket. ; She haves to wear a life jacket. | — | — | false |
| g2u06.gi.have-to.mc.002 | multiple-choice | At this camp the guides wash up, so it isn't your job. [en] | You don't have to wash up. (full) | — | You haven't to wash up. ; You hasn't to wash up. ; You don't have wash up. | — | — | false |
| g2u06.gi.have-to.mt.001 | matching | camp jobs: which rule fits? [en] | — | — | — | You are going out in a canoe. ↔ You have to wear a life jacket. ; The guides do the washing up. ↔ You don't have to wash up. ; You are building a tree house. ↔ You have to wear a hard hat. ; The camp food is free for you. ↔ You don't have to bring food. | — | false |
| g2u06.gi.have-to.qf.001 | question-formation | She has to wear a life jacket. Ask about the rule. [en] | Does she have to wear a life jacket? (full) | — | — | — | — | true |
| g2u06.gi.have-to.qf.002 | question-formation | You want the camp rules for tonight. Ask your guide: you / get up early tomorrow. [en] | Do we have to get up early tomorrow? (full) ; Do I have to get up early tomorrow? (full) | — | — | — | — | false |
| g2u06.gi.have-to.sb.001 | sentence-building | to / have / you / a life jacket / wear [en] | You have to wear a life jacket. (full) ; You have to wear a life jacket (full) | — | has ; must | — | — | false |
| g2u06.gi.have-to.sb.002 | sentence-building | to / has / she / early / get up [en] | She has to get up early. (full) ; She has to get up early (full) | — | have ; must | — | — | false |
| g2u06.gi.have-to.sb.003 | sentence-building | have / does / to / she / a hard hat / wear [en] | Does she have to wear a hard hat? (full) ; Does she have to wear a hard hat (full) | — | do ; has | — | — | false |
| g2u06.gi.have-to.tf.001 | transformation | Your friend doesn't want to do the camp jobs. Tell her: 'You ___ (not / wash up) — the guides do it.' [en, 1 blank(s)] | don't have to wash up (full) ; do not have to wash up (full) | — | — | — | — | true |
| g2u06.gi.have-to.tf.002 | transformation | A new girl asks about the camp rules. Tell her: 'You ___ (wear) a life jacket in the canoe.' [en, 1 blank(s)] | have to wear (full) | — | — | — | — | false |
| g2u06.gi.have-to.tf.003 | transformation | Tell the new boy about Dana: 'She ___ (get up) early because the canoe group leaves at 7.' [en, 1 blank(s)] | has to get up (full) | — | — | — | — | true |
| g2u06.gi.have-to.tr.001 | translation | Du musst eine Schwimmweste im Kanu tragen. [de] | You have to wear a life jacket in the canoe. (full) ; You have to wear a life jacket in the canoe (full) | deToEn | — | — | — | false |
| g2u06.gi.have-to.tr.002 | translation | Du musst nicht abwaschen. Die Anleiter machen das. [de] | You don't have to wash up. The guides do it. (full) ; You don't have to wash up. The guides do it (full) ; You do not have to wash up. The guides do it. (full) ; You don't have to wash up. (partial) | deToEn | — | — | — | true |

## Output contract

Write `content/corpus/units/g2-u06/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u06",
  "lens": "answers",
  "itemsHash": "294d10cc9c5d",
  "promptHash": "70fa2d8cdf22",
  "round": 2,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 79, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
