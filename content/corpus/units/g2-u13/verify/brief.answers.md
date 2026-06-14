# Verify lens — answers — g2-u13 (round 1)

<!-- domigo:verify answers g2-u13 items=376ee6dc23ce prompt=70fa2d8cdf22 round=1 -->

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

## Vocab items (53)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g2u13.w.average | average | In the middle: not the most and not the smallest. | The ___ rainfall here is 120 inches of rain every year. | average (full) | average (full) | western ; mild ; thick |
| g2u13.w.axe | axe | A heavy metal tool for breaking a tree into small pieces. | The man put down his heavy metal ___ next to the tree. | axe (full) ; axes (partial) | axe (full) | binoculars ; scale ; formula |
| g2u13.w.below | below | Under a thing, not over it. | The temperature will be ___ 0 degrees tomorrow. | below (full) | below (full) | towards ; generally ; average |
| g2u13.w.binoculars | binoculars | A tool with two glasses for looking at a thing far away. | I look at the stars at night with my ___ . | binoculars (full) | binoculars (full) | axe ; scale ; tan |
| g2u13.w.bright | bright | Giving a lot of light. | The stars were very ___ in the sky last night. | bright (full) ; brighter (partial) ; brightest (partial) | bright (full) | dark ; cold ; wet |
| g2u13.w.career | career | The work that a man or woman does for many years. | She wants to be a doctor for many years. It will be a long ___ for her. | career (full) ; careers (partial) | career (full) | forecast ; outlook ; small talk |
| g2u13.w.cloudy | cloudy | A day when grey clouds are over you and you cannot look at the sun. | It is very ___ today. The sky is grey and I think it will rain. | cloudy (full) ; cloudier (partial) ; cloudiest (partial) | cloudy (full) | sunny ; hot ; dry |
| g2u13.w.coast | coast | The land next to the sea. | We had a day at the ___ , next to the sea. | coast (full) ; coasts (partial) | coast (full) | forecast ; scale ; hope |
| g2u13.w.cold | cold | A temperature that makes you want a thick jacket and a hat. | Wear a thick jacket and a hat because it is very ___ outside. | cold (full) ; colder (partial) ; coldest (partial) | cold (full) | hot ; sunny ; dry |
| g2u13.w.cool | cool | Not hot, but not really cold. | In the day it is hot, but at night it is quite ___ . | cool (full) ; cooler (partial) ; coolest (partial) | cool (full) | hot ; dry ; sunny |
| g2u13.w.degree | degree | How we show how hot or cold it is, with a number like 20. | Tomorrow it will be 25 ___ -- nice and hot! | degrees (full) ; degree (partial) | degree (full) ; degrees (full) | scale ; temperature ; forecast |
| g2u13.w.dry | dry | Having no rain and no wet weather. | We had very ___ weather for our holidays last year. It did not rain at all. | dry (full) ; drier (partial) ; driest (partial) | dry (full) | wet ; cold ; foggy |
| g2u13.w.flash-of-light | flash of light | A very bright, fast thing in the sky in a storm. | There was a ___ in the sky, bright like the sun for one second. | flash of light (full) ; flashes of light (partial) | flash of light (full) | thunderstorm ; sunshine ; forecast |
| g2u13.w.fog | fog | A thick grey cloud near the ground, so you cannot look very well. | Heavy ___ in the South will clear up in the afternoon. | fog (full) ; fogs (partial) | fog (full) | sunshine ; rainfall ; outlook |
| g2u13.w.foggy | foggy | When grey clouds come down near the ground and you cannot look very well. | Drive carefully. It is very ___ this morning and you cannot look very well. | foggy (full) ; foggier (partial) ; foggiest (partial) | foggy (full) | sunny ; hot ; dry |
| g2u13.w.forecast | forecast | What the weather will be like, that you can read or watch before it happens. | The ___ is very good for tomorrow -- hot and sunny. | forecast (full) ; forecasts (partial) | forecast (full) | coast ; scale ; temperature |
| g2u13.w.formula | formula | Numbers and letters that show you how to work it out. | We used a ___ with numbers and letters to work it out. | formula (full) ; formulas (partial) ; formulae (partial) | formula (full) | scale ; forecast ; outlook |
| g2u13.w.generally | generally | Most of the time, usually. | Death Valley is ___ hot, dry and sunny all year. | generally (full) | generally (full) | below ; towards ; average |
| g2u13.w.have-a-nice-day | Have a nice day! | A good thing you tell a friend before they go. | Goodbye! ___ Enjoy the sunshine! | Have a nice day! (full) ; Have a nice day (full) | Have a nice day! (full) ; Have a nice day (full) | small talk ; forecast ; outlook |
| g2u13.w.heavy-rain | heavy rain | A storm with very strong water from the sky. | After the storm, the ___ came down and my clothes were wet. | heavy rain (full) | heavy rain (full) | sunshine ; fog ; small talk |
| g2u13.w.hope | hope | The feeling that good weather will come. | Do not give up. There is still ___ . | hope (full) ; hopes (partial) | hope (full) | forecast ; scale ; coast |
| g2u13.w.hot | hot | A very high temperature, when you want a cold drink and go to the beach. | It is so ___ today! Let's go to the beach and have a swim in the sea. | hot (full) ; hotter (partial) ; hottest (partial) | hot (full) | cold ; cloudy ; rainy |
| g2u13.w.inch | inch (pl inches) | A small length, like 2.54 centimetres. | My tablet screen is about six ___ wide. | inches (full) ; inch (partial) | inch (full) ; inches (full) | mile ; degree ; scale |
| g2u13.w.mild | mild | Not too hot and not too cold. | The cold months here are quite ___ . It is not too hot and not too cold. | mild (full) ; milder (partial) ; mildest (partial) | mild (full) | dry ; wet ; bright |
| g2u13.w.mile | mile | A long length, about 1.6 kilometres. | Seathwaite is one ___ away from Seatoller. | mile (full) ; miles (partial) | mile (full) ; miles (full) | inch ; degree ; scale |
| g2u13.w.outlook | outlook | What the weather will probably be like in the days to come. | The ___ for the weekend is hot and sunny. | outlook (full) ; outlooks (partial) | outlook (full) | forecast ; scale ; coast |
| g2u13.w.rainfall | rainfall | All the rain from the sky in a place over a year. | The average ___ here is 120 inches of rain every year. | rainfall (full) | rainfall (full) | sunshine ; fog ; forecast |
| g2u13.w.rainy | rainy | A day with grey clouds and a lot of rain. | Wear a jacket. It is going to be a ___ day with a lot of rain. | rainy (full) ; rainier (partial) ; rainiest (partial) | rainy (full) | sunny ; hot ; dry |
| g2u13.w.scale | scale | A row of numbers from one to ten for giving a mark. | On a ___ from 1 to 10, how good was your day? | scale (full) ; scales (partial) | scale (full) | formula ; forecast ; degree |
| g2u13.w.sea-level | sea level | How high the land is over the big water below. | Death Valley is 282 feet below ___ . | sea level (full) | sea level (full) | coast ; sunshine ; rainfall |
| g2u13.w.small-talk | small talk | Short chat about the weather or the weekend. | There is lots of ___ about the weather. People have these short, nice talks every day. | small talk (full) | small talk (full) | forecast ; outlook ; hope |
| g2u13.w.snowy | snowy | A day when everything outside is cold and white. | It was a cold, ___ day and the children played in the white snow outside. | snowy (full) ; snowier (partial) ; snowiest (partial) | snowy (full) | rainy ; sunny ; hot |
| g2u13.w.sunny | sunny | A day with lots of light, when you can look up at the sun. | It is a ___ day with lots of light -- perfect for a picnic in the park. | sunny (full) ; sunnier (partial) ; sunniest (partial) | sunny (full) | cloudy ; rainy ; cold |
| g2u13.w.sunshine | sunshine | The bright light from the sun on a nice day. | There will be lots of ___ tomorrow. Perfect weather for a picnic. | sunshine (full) | sunshine (full) | rainfall ; fog ; forecast |
| g2u13.w.tan | tan | When your skin becomes darker because of the sun. | You have a great ___ ! Were you on holiday in the sun? | tan (full) ; tans (partial) | tan (full) | coast ; scale ; career |
| g2u13.w.temperature | temperature | How hot or cold it is. | The ___ dropped to 0 degrees last night. | temperature (full) ; temperatures (partial) | temperature (full) | forecast ; outlook ; sunshine |
| g2u13.w.thick | thick | So close and heavy, like grey fog in the morning. | There is ___ fog here, so drive carefully. | thick (full) ; thicker (partial) ; thickest (partial) | thick (full) | dry ; cold ; bright |
| g2u13.w.throughout-the-year | throughout the year | All the time, from January to December. | It is usually sunny ___ , from January to December. | throughout the year (full) | throughout the year (full) | below ; towards ; generally |
| g2u13.w.thunderstorm | thunderstorm | Bad weather with dark clouds, a big noise and a bright flash of light in the sky. | We stayed inside because of the big ___ last night, with its big noise and bright flashes of light. | thunderstorm (full) ; thunderstorms (partial) | thunderstorm (full) ; thunderstorms (full) | fog ; sunshine ; outlook |
| g2u13.w.to-be-mad-about-sth | to be mad about sth. | To like a thing very, very much. | My sister is ___ horses. She loves them very much. | mad about (full) ; be mad about (partial) | be mad about (full) ; to be mad about (full) ; mad about (full) | be afraid of ; be interested in ; be proud of |
| g2u13.w.to-clear-up | to clear up | When bad weather ends and the sky becomes nice again. | The bad weather will ___ in the afternoon and the sun will come out. | clear up (full) ; clears up (partial) ; cleared up (partial) | clear up (full) ; to clear up (full) | continue ; give way ; rise |
| g2u13.w.to-continue | to continue | To keep going and not go away. | The bad weather will ___ all day and will not go away. | continue (full) ; continues (partial) ; continued (partial) | continue (full) ; to continue (full) | clear up ; rise ; give way |
| g2u13.w.to-earn | to earn | To make money for the work you do. | Most people do not ___ money with their job. | earn (full) ; earns (partial) ; earned (partial) | earn (full) ; to earn (full) | rise ; continue ; record |
| g2u13.w.to-give-way | to give way | To slowly go away so that a new thing can come. | The clouds in the morning will ___ to sun in the afternoon. | give way (full) ; gives way (partial) ; gave way (partial) | give way (full) ; to give way (full) | continue ; rise ; clear up |
| g2u13.w.to-make-sure | to make sure | To look again so a thing is done well. | ___ you close the windows before you go! | Make sure (full) ; make sure (full) ; Makes sure (partial) ; Made sure (partial) | make sure (full) ; to make sure (full) | give way ; clear up ; rise |
| g2u13.w.to-record | to record | To write it down so you can keep it. | Scientists write down and ___ the temperatures every day. | record (full) ; records (partial) ; recorded (partial) | record (full) ; to record (full) | rise ; shine ; continue |
| g2u13.w.to-rise | to rise | To go up and not come down. | The temperatures will ___ to 20 degrees. | rise (full) ; rises (partial) ; rose (partial) ; risen (partial) | rise (full) ; to rise (full) | continue ; clear up ; give way |
| g2u13.w.to-shine | to shine | To give out light. | The sun will come out and ___ on us all day. | shine (full) ; shines (partial) ; shone (partial) ; shined (partial) | shine (full) ; to shine (full) | rise ; continue ; clear up |
| g2u13.w.towards | towards | Going nearer and nearer to a place or a time. | It will be sunny ___ the end of the week. | towards (full) ; toward (partial) | towards (full) | below ; generally ; average |
| g2u13.w.weather-presenter-meteorologist | weather presenter / meteorologist | The man or woman who shows you the sun and rain on the news. | The ___ on the news showed the weather map for tomorrow. | weather presenter (full) ; meteorologist (full) ; weather presenters (partial) ; meteorologists (partial) | weather presenter (full) ; meteorologist (full) | cook ; driver ; gardener |
| g2u13.w.western | western | In or from the west, where the sun is in the evening. | In Austria, the high mountains are in the west. The ___ mountains are very high. | western (full) | western (full) | mild ; average ; generally |
| g2u13.w.wet | wet | Covered with rain, not dry. | All my clothes are ___ because of the rain. | wet (full) ; wetter (partial) ; wettest (partial) | wet (full) | dry ; hot ; bright |
| g2u13.w.windy | windy | When you must hold on to your hat because the trees are not still. | Hold your hat! It is very ___ outside and the trees are not still. | windy (full) ; windier (partial) ; windiest (partial) | windy (full) | sunny ; hot ; dry |

## Grammar items (47)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g2u13.gi.adverbs-manner.ag.003 | anagram | Englisch für 'vorsichtig' (er fährt sehr ...): [de] | carefully (full) | — | — | — | — | false |
| g2u13.gi.adverbs-manner.ag.004 | anagram | Englisch für 'fröhlich' als Art und Weise (die Kinder spielen ...): [de] | happily (full) | — | — | — | — | false |
| g2u13.gi.adverbs-manner.ec.001 | error-correction | They played football very bad. [en] | They played football very badly. (full) ; badly (partial) | — | — | — | — | true |
| g2u13.gi.adverbs-manner.ec.002 | error-correction | She speaks English very good. [en] | She speaks English very well. (full) ; well (partial) | — | — | — | — | true |
| g2u13.gi.adverbs-manner.ec.003 | error-correction | He read the forecast very slow. [en] | He read the forecast very slowly. (full) ; slowly (partial) | — | — | — | — | true |
| g2u13.gi.adverbs-manner.ff.001 | free-form | You are a good reader. Your friend asks how you read. What do you tell her? [en] | I read well. (full) ; I can read well. (full) ; I read very well. (full) | — | — | — | — | false |
| g2u13.gi.adverbs-manner.gf.001 | gap-fill | She plays the piano very ___. I love it. [en, 1 blank(s)] | beautifully (full) | — | beautiful ; nice ; happy | — | — | false |
| g2u13.gi.adverbs-manner.gf.002 | gap-fill | Please close the door ___. The child is in bed. [en, 1 blank(s)] | quietly (full) | — | slowly ; sadly ; nicely | — | — | false |
| g2u13.gi.adverbs-manner.gf.003 | gap-fill | He plays the guitar really ___. [en, 1 blank(s)] | well (full) | — | good ; nice ; happy | — | — | false |
| g2u13.gi.adverbs-manner.gf.004 | gap-fill | The children played ___ in the garden all afternoon. [en, 1 blank(s)] | happily (full) | — | happy ; sadly ; badly | — | — | false |
| g2u13.gi.adverbs-manner.gf.005 | gap-fill | It will be hot, so the sun will shine ___ all day. [en, 1 blank(s)] | brightly (full) | — | bright ; strong ; nice | — | — | false |
| g2u13.gi.adverbs-manner.gf.006 | gap-fill | She did her homework ___ because she wanted to watch TV. [en, 1 blank(s)] | quickly (full) | — | slowly ; badly ; sadly | — | — | false |
| g2u13.gi.adverbs-manner.gf.007 | gap-fill | The dog can run very ___. [en, 1 blank(s)] | fast (full) | — | slowly ; well ; badly | — | — | false |
| g2u13.gi.adverbs-manner.gs.001 | group-sort | slowly / slow / happily / happy / brightly / bright / nervous / nervously [en] | — | — | — | — | He runs slowly: slowly, happily, brightly, nervously \| a slow dog: slow, happy, bright, nervous | false |
| g2u13.gi.adverbs-manner.mc.001 | multiple-choice | She is a slow driver. So she ___. [en, 1 blank(s)] | drives slowly (full) | — | drives slow ; drives more slow ; drive slowly | — | — | false |
| g2u13.gi.adverbs-manner.mc.002 | multiple-choice | He is a ___ singer. [en, 1 blank(s)] | good (full) | — | well ; happily ; badly | — | — | false |
| g2u13.gi.adverbs-manner.mc.003 | multiple-choice | One is good English. Which one? [en] | They played football badly. (full) | — | They played football bad. ; They played football more bad. ; They badly played football badly. | — | — | false |
| g2u13.gi.adverbs-manner.mp.001 | matching-pairs | She plays … / He drives … / The sun shines … [en] | — | — | — | She plays the piano ↔ beautifully. ; He drives the car ↔ carefully. ; The sun shines ↔ brightly. ; The children laugh ↔ loudly. ; He plays the guitar ↔ well. | — | false |
| g2u13.gi.adverbs-manner.mt.001 | matching | happy, good, fast, slow, angry [en] | — | — | — | happy ↔ happily ; good ↔ well ; fast ↔ fast ; slow ↔ slowly ; angry ↔ angrily | — | false |
| g2u13.gi.adverbs-manner.sb.001 | sentence-building | the / slowly / boy / very / reads [en] | The boy reads very slowly. (full) | — | — | — | — | false |
| g2u13.gi.adverbs-manner.tf.001 | transformation | She is a slow reader. How does she read? 'She reads ___.' [en, 1 blank(s)] | slowly (full) | — | — | — | — | true |
| g2u13.gi.adverbs-manner.tf.002 | transformation | He is an angry man. How does he look at you? 'He looks at you ___.' [en, 1 blank(s)] | angrily (full) | — | — | — | — | true |
| g2u13.gi.adverbs-manner.tr.001 | translation | Er spricht sehr leise. [de] | He speaks very quietly. (full) ; He talks very quietly. (partial) | deToEn | — | — | — | false |
| g2u13.gi.adverbs-manner.tr.002 | translation | Er liest sehr gut. [de] | He reads very well. (full) ; He can read very well. (partial) | deToEn | — | — | — | false |
| g2u13.gi.will-future.ag.001 | anagram | Kurzform von 'will not' (die Sonne ... morgen nicht scheinen): [de] | won't (full) | — | — | — | — | false |
| g2u13.gi.will-future.cp.001 | context-picker | Your friend drops her heavy box and needs help now. What do you tell her? [en] | I'll carry that box for you. (full) | — | I carry that box for you. ; I will carries that box for you. ; I will to carry that box for you. | — | — | false |
| g2u13.gi.will-future.cp.002 | context-picker | You look at the dark clouds. What do you tell your friend about the weather? [en] | It will rain tonight. (full) | — | It will to rain tonight. ; It is will rain tonight. ; It is going to will rain tonight. | — | — | false |
| g2u13.gi.will-future.ec.001 | error-correction | I will to help you carry the box. [en] | I will help you carry the box. (full) ; I'll help you carry the box. (full) ; help (partial) | — | — | — | — | true |
| g2u13.gi.will-future.ec.002 | error-correction | It is will rain in the north tomorrow. [en] | It will rain in the north tomorrow. (full) ; It'll rain in the north tomorrow. (full) | — | — | — | — | true |
| g2u13.gi.will-future.ff.001 | free-form | Your friend's box is very heavy. You want to help now. What do you tell her? [en] | I'll carry it for you. (full) ; I will carry it for you. (full) ; I'll help you. (full) ; I will help you. (full) | — | — | — | — | false |
| g2u13.gi.will-future.gf.001 | gap-fill | It's cold! I ___ close the window. [en, 1 blank(s)] | will (full) ; 'll (partial) | — | am ; do ; can | — | — | false |
| g2u13.gi.will-future.gf.002 | gap-fill | Don't worry, I ___ help you with your homework. [en, 1 blank(s)] | will (full) ; 'll (partial) | — | am ; do ; can | — | — | false |
| g2u13.gi.will-future.gf.003 | gap-fill | I think it ___ rain tomorrow. [en, 1 blank(s)] | will (full) ; 'll (partial) | — | is ; does ; can | — | — | false |
| g2u13.gi.will-future.gf.004 | gap-fill | I don't want to go out today. I ___ go out. [en, 1 blank(s)] | won't (full) ; will not (full) | — | don't ; am not ; can't | — | — | false |
| g2u13.gi.will-future.gf.005 | gap-fill | The sun ___ come out today. It will rain all day. [en, 1 blank(s)] | won't (full) ; will not (full) | — | doesn't ; isn't ; can't | — | — | false |
| g2u13.gi.will-future.gf.006 | gap-fill | It's a big job. We ___ be at school before nine. [en, 1 blank(s)] | won't (full) ; will not (full) | — | don't ; aren't ; can't | — | — | false |
| g2u13.gi.will-future.gs.002 | group-sort | It will rain. / The sun won't come out. / It will be cold. / It won't be sunny. [en] | — | — | — | — | will (yes): It will rain., It will be cold. \| won't (no): The sun won't come out., It won't be sunny. | false |
| g2u13.gi.will-future.mc.001 | multiple-choice | One is good English. Which one? [en] | I think it will rain tomorrow. (full) | — | I think it will to rain tomorrow. ; I think it is will rain tomorrow. ; I think it will be rain tomorrow. | — | — | false |
| g2u13.gi.will-future.mc.002 | multiple-choice | I'm tired. I think I ___ go to bed. [en, 1 blank(s)] | will (full) ; 'll (partial) | — | am ; do ; can | — | — | false |
| g2u13.gi.will-future.mp.001 | matching-pairs | It's cold in here. … / It's a secret. … / I'm hungry. … [en] | — | — | — | It's cold in here. ↔ I'll close the window. ; The car is dirty. ↔ I'll clean it for you. ; It's a secret. ↔ I won't tell you. ; I'm hungry. ↔ I'll make you a sandwich. ; It's a long job. ↔ We won't be at school before nine. | — | false |
| g2u13.gi.will-future.qf.001 | question-formation | You want to ask about tomorrow's weather. Ask if it will be sunny. [en] | Will it be sunny tomorrow? (full) ; Will it be sunny? (full) | — | — | — | — | false |
| g2u13.gi.will-future.sb.001 | sentence-building | will / you / I / call [en] | I will call you. (full) | — | — | — | — | false |
| g2u13.gi.will-future.sb.002 | sentence-building | be / it / sunny / will / tomorrow [en] | It will be sunny tomorrow. (full) | — | — | — | — | false |
| g2u13.gi.will-future.tf.002 | transformation | You don't think the sun will come out today. Tell your friend: 'The sun ___ (not come out) today.' [en, 1 blank(s)] | won't come out (full) ; will not come out (full) | — | — | — | — | true |
| g2u13.gi.will-future.tf.003 | transformation | You will call your friend tonight. Tell her: 'I ___ (call) you tonight.' [en, 1 blank(s)] | will call (full) ; 'll call (full) | — | — | — | — | true |
| g2u13.gi.will-future.tr.001 | translation | Ich werde dir helfen. [de] | I will help you. (full) ; I'll help you. (full) | deToEn | — | — | — | false |
| g2u13.gi.will-future.tr.002 | translation | Er wird morgen nicht kommen. [de] | He won't come tomorrow. (full) ; He will not come tomorrow. (full) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g2-u13/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u13",
  "lens": "answers",
  "itemsHash": "376ee6dc23ce",
  "promptHash": "70fa2d8cdf22",
  "round": 1,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 100, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
