# Verify lens — answers — g4-u05 (round 1)

<!-- domigo:verify answers g4-u05 items=85d993378c1a prompt=70fa2d8cdf22 round=1 -->

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
| g4u05.w.accept | accept | to take a thing and agree it is true | I have to ___ that I cannot have everything I want. | accept (full) | accept (full) | trust ; dislike ; feed |
| g4u05.w.afford | afford | to have the money to pay for what you want | I want those new trainers but I can't ___ them. | afford (full) | afford (full) | waste ; feed ; contain |
| g4u05.w.afterwards | afterwards | at a time after that | First we had dinner, and ___ we watched a film. | afterwards (full) | afterwards (full) | regularly ; even though ; diet |
| g4u05.w.artificial | artificial | not natural; people make it | This drink has nothing ___ in it; it is all natural. | artificial (full) | artificial (full) | fresh ; healthy ; nutritious |
| g4u05.w.ashamed | (be) ashamed | to feel bad and sorry about what you did | You don't have to be ___ if you eat too much. | ashamed (full) | ashamed (full) ; be ashamed (full) | healthy ; thin ; overweight |
| g4u05.w.contain | contain | to have a thing inside it | These sweets ___ a lot of sugar so don't eat too many. | contain (full) | contain (full) | feed ; waste ; afford |
| g4u05.w.cookery | cookery | the art of cooking food | You can cook nice food with a good ___ book. | cookery (full) | cookery (full) | diet ; nutrition ; health |
| g4u05.w.diet | diet | the food you usually eat | To stay fit you need a healthy ___ with lots of vegetables. | diet (full) | diet (full) | nutrition ; intake ; hunger |
| g4u05.w.dislike | dislike | to not like food or people | I like tomatoes, but I ___ spinach. | dislike (full) | dislike (full) | accept ; trust ; afford |
| g4u05.w.eating-disorder | eating disorder | a serious illness where somebody has a very unhealthy relationship with food | An ___ is a very serious illness. | eating disorder (full) | eating disorder (full) | diet ; habits ; nutrition |
| g4u05.w.even-though | even though | used when what happens is surprising | I had to eat the spinach ___ I did not like it. | even though (full) | even though (full) | afterwards ; regularly ; diet |
| g4u05.w.fattening | fattening | makes you become heavier and fatter | Chocolate cake is very tasty but also very ___. | fattening (full) | fattening (full) | filling ; harmful ; nutritious |
| g4u05.w.feed | feed | to give food to people or an animal | They have a big family to ___ every day. | feed (full) | feed (full) | afford ; waste ; contain |
| g4u05.w.filling | filling | makes you feel that you have had a lot of food | Junk food is ___ but it is not very healthy. | filling (full) | filling (full) | fattening ; harmful ; tasty |
| g4u05.w.fresh | fresh | new; not from a tin | The market sells ___ bread every morning. | fresh (full) | fresh (full) | artificial ; revolting ; fattening |
| g4u05.w.gain | gain | to become heavier and put on more fat | People who eat too much fast food often ___ a lot of fat. | gain (full) | gain (full) | feed ; waste ; contain |
| g4u05.w.gym | gym | a room at school where you do exercise | PE usually takes place in the school ___. | gym (full) | gym (full) | diet ; health ; habits |
| g4u05.w.habits | habits | things you do often, again and again | Eating fresh food every day is one of her good ___. | habits (full) | habits (full) ; habit (partial) | diet ; health ; nutrition |
| g4u05.w.harmful | harmful | is bad for you and not good in any way | Too much sugar is very ___ to your health. | harmful (full) | harmful (full) | healthy ; nutritious ; fresh |
| g4u05.w.health | health | how well or ill you are | Good ___ is the best thing in your life. | health (full) | health (full) | hunger ; diet ; intake |
| g4u05.w.healthy | healthy | good for you and keeps you well | Fresh vegetables are very ___ and good for you. | healthy (full) | healthy (full) | harmful ; fattening ; artificial |
| g4u05.w.hunger | hunger | the feeling of needing food | Many people in the world die of ___ every day. | hunger (full) | hunger (full) | health ; diet ; intake |
| g4u05.w.intake | intake | how much food you take in every day | People in America have an ___ of more sugar than people in Africa. | intake (full) | intake (full) | hunger ; diet ; nutrition |
| g4u05.w.nutrition | nutrition | eating the right food to stay well | Good ___ is eating the right food every day. | nutrition (full) | nutrition (full) | health ; hunger ; intake |
| g4u05.w.nutritious | nutritious | has a lot of healthy things your body needs to grow | Fresh vegetables are very ___ and good for you. | nutritious (full) | nutritious (full) | fattening ; harmful ; artificial |
| g4u05.w.overweight | overweight | heavier than is good for your health | If you eat too much too often, you will become ___. | overweight (full) | overweight (full) | thin ; healthy ; fresh |
| g4u05.w.regularly | regularly | again and again, every day or every week | He plays football ___ every week. | regularly (full) | regularly (full) | afterwards ; even though ; health |
| g4u05.w.revolting | revolting | has a very bad taste or smell | This old fish smells ___ and I feel sick. | revolting (full) | revolting (full) | tasty ; fresh ; healthy |
| g4u05.w.tasty | tasty | has a very nice taste | The soup was so ___ that I wanted more. | tasty (full) | tasty (full) | revolting ; harmful ; artificial |
| g4u05.w.thin | thin | not fat; with very little fat on you | You look very ___ and you need to eat more. | thin (full) | thin (full) | overweight ; healthy ; fresh |
| g4u05.w.throw-up | throw up | to bring food back up out of your mouth | After the bad food, she was sick and had to ___. | throw up (full) | throw up (full) | feed ; gain ; trust |
| g4u05.w.trust | trust | to feel sure that people are honest and good | I ___ my best friend with all my secrets. | trust (full) | trust (full) | accept ; dislike ; feed |
| g4u05.w.vegetarian | vegetarian | a person who does not eat meat or fish | My sister never eats meat because she is a ___. | vegetarian (full) | vegetarian (full) | diet ; habits ; nutrition |
| g4u05.w.waste | waste | to use too much of a thing in a bad way | We must stop ___ food and help the hungry. | wasting (full) | waste (full) | feed ; afford ; contain |

## Grammar items (57)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g4u05.gi.past-perfect-connectors.cp.001 | context-picker | Tom machte um 16 Uhr seine Hausaufgaben. Um 17 Uhr ging er in den Garten. Welcher Satz ist richtig? [de] | After he had done his homework, he went into the garden. (full) | — | After he did his homework, he had gone into the garden. ; After he has done his homework, he went into the garden. ; After he was doing his homework, he went into the garden. | — | — | false |
| g4u05.gi.past-perfect-connectors.cp.003 | context-picker | Lisa kam sehr spät zur Schule. Lisa hatte zwei Stunden verpasst und war traurig. Was ist passiert? [de] | She was sad because she had missed two lessons. (full) | — | She was sad although she had missed two lessons. ; She was sad before she had missed two lessons. ; She was sad so that she had missed two lessons. | — | — | false |
| g4u05.gi.past-perfect-connectors.ec.001 | error-correction | Finde und verbessere den Fehler: ⏎  ⏎ After I eat breakfast, I left for school. [de] | After I had eaten breakfast, I left for school. (full) ; had eaten (partial) | — | — | — | — | false |
| g4u05.gi.past-perfect-connectors.ec.002 | error-correction | Finde und verbessere den Fehler: ⏎  ⏎ After she had cooked dinner, she had washed the dishes. [de] | After she had cooked dinner, she washed the dishes. (full) ; washed (partial) | — | — | — | — | false |
| g4u05.gi.past-perfect-connectors.ec.003 | error-correction | Finde und verbessere den Fehler: ⏎  ⏎ Before she had left the house, she checked the windows. [de] | Before she left the house, she had checked the windows. (full) ; Before she left the house, she had checked the windows (full) | — | — | — | — | false |
| g4u05.gi.past-perfect-connectors.ec.004 | error-correction | Finde und verbessere den Fehler: ⏎  ⏎ After we had arrive at the cinema, the film started. [de] | After we had arrived at the cinema, the film started. (full) ; had arrived (partial) | — | — | — | — | true |
| g4u05.gi.past-perfect-connectors.ec.005 | error-correction | Finde und verbessere den Fehler: ⏎  ⏎ She was happy because she had pass the test. [de] | She was happy because she had passed the test. (full) ; had passed (partial) | — | — | — | — | true |
| g4u05.gi.past-perfect-connectors.ec.006 | error-correction | Finde und verbessere den Fehler: ⏎  ⏎ Although she had cooked all day, but nobody was hungry. [de] | Although she had cooked all day, nobody was hungry. (full) ; Although she had cooked all day, nobody was hungry (full) | — | — | — | — | false |
| g4u05.gi.past-perfect-connectors.ec.007 | error-correction | Finde und verbessere den Fehler: ⏎  ⏎ He had finished just his lunch when Tom came home. [de] | He had just finished his lunch when Tom came home. (full) ; had just finished (partial) | — | — | — | — | false |
| g4u05.gi.past-perfect-connectors.ec.008 | error-correction | Finde und verbessere den Fehler: ⏎  ⏎ When I came home, the kitchen was clean because mum has cooked. [de] | When I came home, the kitchen was clean because mum had cooked. (full) ; had cooked (partial) | — | — | — | — | false |
| g4u05.gi.past-perfect-connectors.ec.009 | error-correction | Finde und verbessere den Fehler: ⏎  ⏎ After he washed the car, he had been tired. [de] | After he had washed the car, he was tired. (full) | — | — | — | — | false |
| g4u05.gi.past-perfect-connectors.gf.001 | gap-fill | After James ___ (eat) the two pizzas, he was very ill. [en, 1 blank(s)] | had eaten (full) | — | — | — | — | false |
| g4u05.gi.past-perfect-connectors.gf.002 | gap-fill | After she ___ (cook) dinner, she washed the dishes. [en, 1 blank(s)] | had cooked (full) | — | — | — | — | false |
| g4u05.gi.past-perfect-connectors.gf.003 | gap-fill | After he ___ (clean) his room, he watched a film. [en, 1 blank(s)] | had cleaned (full) | — | — | — | — | false |
| g4u05.gi.past-perfect-connectors.gf.004 | gap-fill | Sally had just ___ (finish) her lunch when Tom came home. [en, 1 blank(s)] | finished (full) | — | — | — | — | false |
| g4u05.gi.past-perfect-connectors.gf.005 | gap-fill | My friends ___ (leave) before I arrived. [en, 1 blank(s)] | had left (full) | — | — | — | — | false |
| g4u05.gi.past-perfect-connectors.gf.006 | gap-fill | Before I went to bed, I ___ (brush) my teeth. [en, 1 blank(s)] | had brushed (full) | — | — | — | — | false |
| g4u05.gi.past-perfect-connectors.gf.007 | gap-fill | When I went home, I knew I ___ (beat) my problem. [en, 1 blank(s)] | had beaten (full) ; had finally beaten (full) | — | — | — | — | false |
| g4u05.gi.past-perfect-connectors.gf.008 | gap-fill | She was happy because she ___ (pass) the test. [en, 1 blank(s)] | had passed (full) | — | — | — | — | false |
| g4u05.gi.past-perfect-connectors.gf.009 | gap-fill | Because she ___ (not / eat) all day, she was very hungry. [en, 1 blank(s)] | had not eaten (full) | — | — | — | — | false |
| g4u05.gi.past-perfect-connectors.gf.010 | gap-fill | Although he ___ (study) all week, he was nervous. [en, 1 blank(s)] | had studied (full) | — | — | — | — | false |
| g4u05.gi.past-perfect-connectors.gf.011 | gap-fill | After they ___ (go) home, the house was clean. [en, 1 blank(s)] | had gone (full) | — | — | — | — | false |
| g4u05.gi.past-perfect-connectors.gf.012 | gap-fill | ___ she had washed the plates, she was happy. [en, 1 blank(s)] | After (full) | — | — | — | — | false |
| g4u05.gi.past-perfect-connectors.gf.013 | gap-fill | He did a cookery show ___ educate people about food. [en, 1 blank(s)] | in order to (full) | — | — | — | — | false |
| g4u05.gi.past-perfect-connectors.gf.014 | gap-fill | Children will live shorter lives ___ the food they eat. [en, 1 blank(s)] | because of (full) | — | — | — | — | false |
| g4u05.gi.past-perfect-connectors.gf.015 | gap-fill | ___ they had cooked dinner, they ___ (eat) it in the garden, ___ the weather was nice. [en, 3 blank(s)] | After \| ate \| because (full) | — | — | — | — | false |
| g4u05.gi.past-perfect-connectors.gf.017 | gap-fill | After they had played in the garden, they ___ (be) very hungry. [en, 1 blank(s)] | were (full) | — | — | — | — | false |
| g4u05.gi.past-perfect-connectors.gf.018 | gap-fill | She did not buy anything because she ___ (spend) all her money. [en, 1 blank(s)] | had spent (full) | — | — | — | — | false |
| g4u05.gi.past-perfect-connectors.gf.019 | gap-fill | ___ they had checked in at the hotel, they went to the beach. [en, 1 blank(s)] | After (full) ; As soon as (full) | — | — | — | — | false |
| g4u05.gi.past-perfect-connectors.gf.020 | gap-fill | She did not recognise him ___ he had changed so much. [en, 1 blank(s)] | because (full) | — | — | — | — | false |
| g4u05.gi.past-perfect-connectors.gf.021 | gap-fill | By the time her mum came home, she ___ already ___ (cook) dinner. [en, 2 blank(s)] | had \| cooked (full) ; 'd \| cooked (partial) | — | — | — | — | false |
| g4u05.gi.past-perfect-connectors.gs.001 | group-sort | Welche Sätze benutzen had + die 3. Form richtig, welche nicht? [de] | — | — | — | — | ✓: She had cooked dinner., They had washed the dishes., He had cleaned his room. \| ✗: She had cook dinner., They had wash the dishes., He had cleans his room. | false |
| g4u05.gi.past-perfect-connectors.gs.003 | group-sort | Sortiere die Konnektoren nach ihrer Bedeutung. [de] | — | — | — | — | why?: because, because of \| but: although, even though \| what for?: in order to, so that | false |
| g4u05.gi.past-perfect-connectors.mc.001 | multiple-choice | Welche Form passt? Es geht um die Handlung, die noch FRÜHER war: ⏎  ⏎ After she ___ dinner, she washed the dishes. [de, 1 blank(s)] | had cooked (full) | — | cooked ; has cooked ; was cooking | — | — | false |
| g4u05.gi.past-perfect-connectors.mc.002 | multiple-choice | Welche Form passt? Es geht um die Handlung, die noch FRÜHER war: ⏎  ⏎ My friends ___ before I arrived. [de, 1 blank(s)] | had left (full) | — | leave ; has left ; was leaving | — | — | false |
| g4u05.gi.past-perfect-connectors.mc.003 | multiple-choice | Welche Form passt? Es geht um die Handlung, die noch FRÜHER war: ⏎  ⏎ Although she ___ all morning, nobody was hungry. [de, 1 blank(s)] | had cooked (full) | — | cooks ; has cooked ; was cooking | — | — | false |
| g4u05.gi.past-perfect-connectors.mc.004 | multiple-choice | Welcher Konnektor passt? Er zeigt: zuerst das Eine, dann das Andere. ⏎  ⏎ ___ he had washed the car, he was tired. [de, 1 blank(s)] | After (full) | — | So that ; In order to ; However | — | — | false |
| g4u05.gi.past-perfect-connectors.mc.005 | multiple-choice | Welcher Konnektor zeigt eine Absicht (wozu)? ⏎  ⏎ He did a cookery show ___ help people eat well. [de, 1 blank(s)] | in order to (full) | — | because ; although ; after | — | — | false |
| g4u05.gi.past-perfect-connectors.mc.006 | multiple-choice | Welcher Konnektor zeigt einen Gegensatz? ⏎  ⏎ ___ she had studied all day, she was nervous. [de, 1 blank(s)] | Although (full) | — | Because ; So that ; In order to | — | — | false |
| g4u05.gi.past-perfect-connectors.mc.007 | multiple-choice | Welcher Konnektor zeigt eine Absicht? ⏎  ⏎ My teacher asked me to come to her room ___ she could talk to me. [de, 1 blank(s)] | so that (full) | — | because of ; although ; after | — | — | false |
| g4u05.gi.past-perfect-connectors.mc.008 | multiple-choice | Welcher Satz beschreibt die Reihenfolge richtig? ⏎  ⏎ (Zuerst aßen sie zu Abend, dann gingen sie spazieren.) [de] | After they had eaten dinner, they went for a walk. (full) | — | After they ate dinner, they had gone for a walk. ; After they had eaten dinner, they had gone for a walk. ; After they have eaten dinner, they went for a walk. | — | — | false |
| g4u05.gi.past-perfect-connectors.mc.009 | multiple-choice | Welcher Satz ist richtig? [de] | Although he had practised every day, he did not win. (full) | — | Although he had practised every day, but he did not win. ; Although he practised every day, he had not won. ; Although he has practised every day, he did not win. | — | — | false |
| g4u05.gi.past-perfect-connectors.mc.010 | multiple-choice | Wo steht just richtig? ⏎  ⏎ (= Er hatte GERADE gegessen, als sie ankam.) [de] | He had just eaten when she arrived. (full) | — | He had eaten just when she arrived. ; He just had eaten when she arrived. ; He had eaten when she just arrived. | — | — | false |
| g4u05.gi.past-perfect-connectors.mc.012 | multiple-choice | Welcher Satz ist richtig? ⏎  ⏎ (Zuerst war die Familie zu Hause angekommen, dann aßen sie. – beides früher.) [de] | After the family had arrived home, they had dinner. (full) | — | After the family arrived home, they had had dinner. ; After the family has arrived home, they had dinner. ; After the family had arrived home, they had had dinner. | — | — | false |
| g4u05.gi.past-perfect-connectors.mt.001 | matching | Verbinde jeden Satzanfang mit dem passenden Ende. [de] | — | — | — | After the teacher had explained the task, ↔ the children started cooking. ; Although they had studied all week, ↔ they were still nervous. ; Because she had not cooked, ↔ the family was hungry. ; After she had washed the plates, ↔ she watched a show. | — | false |
| g4u05.gi.past-perfect-connectors.mt.003 | matching | Verbinde jede einfache Form mit der passenden 3. Form (für had + 3. Form). [de] | — | — | — | cook ↔ cooked ; clean ↔ cleaned ; wash ↔ washed ; study ↔ studied ; play ↔ played | — | false |
| g4u05.gi.past-perfect-connectors.qf.001 | question-formation | Bilde eine Frage mit had + der 3. Form aus den Stichwörtern: ⏎  ⏎ she / cook / dinner / before the guests arrived ? [de] | Had she cooked dinner before the guests arrived? (full) | — | — | — | — | false |
| g4u05.gi.past-perfect-connectors.sb.001 | sentence-building | Bring die Wörter in die richtige Reihenfolge: ⏎  ⏎ had / he / after / cleaned / the kitchen / he / washed / the dishes [de] | After he had cleaned the kitchen, he washed the dishes. (full) | — | — | — | — | false |
| g4u05.gi.past-perfect-connectors.sb.002 | sentence-building | Bring die Wörter in die richtige Reihenfolge: ⏎  ⏎ had / they / although / arrived / early / there / were / no / seats [de] | Although they had arrived early, there were no seats. (full) | — | — | — | — | false |
| g4u05.gi.past-perfect-connectors.tf.001 | transformation | Erzähl von deinem Abend. Setze die Verben ein (had + 3. Form bzw. 2. Form): ⏎  ⏎ 'After I ___ (clean) the kitchen, I ___ (watch) a film.' [de, 2 blank(s)] | had cleaned \| watched (full) | — | — | — | — | false |
| g4u05.gi.past-perfect-connectors.tf.002 | transformation | Du kamst zu spät zum Bahnhof. Setze die Verben ein (had + already + 3. Form bzw. 2. Form): ⏎  ⏎ 'When I ___ (arrive) at the station, the train ___ already ___ (leave).' [de, 3 blank(s)] | arrived \| had \| left (full) | — | — | — | — | false |
| g4u05.gi.past-perfect-connectors.tf.003 | transformation | Zwei Sätze, ein Satz daraus mit although: ⏎  ⏎ Tom had studied all day. He was still nervous. (although) [de] | Although Tom had studied all day, he was still nervous. (full) ; Tom was still nervous although he had studied all day. (full) | — | — | — | — | false |
| g4u05.gi.past-perfect-connectors.tf.004 | transformation | Zwei Sätze, ein Satz daraus mit because of: ⏎  ⏎ The school dinners were bad. Jamie Oliver was not happy. (because of) [de] | Because of the bad school dinners, Jamie Oliver was not happy. (full) ; Jamie Oliver was not happy because of the bad school dinners. (full) | — | — | — | — | false |
| g4u05.gi.past-perfect-connectors.tr.001 | translation | Übersetze ins Englische: ⏎  ⏎ Nachdem er gekocht hatte, wusch er das Geschirr. [de] | After he had cooked, he washed the dishes. (full) ; He washed the dishes after he had cooked. (full) ; After he had cooked, he washed the plates. (full) | deToEn | — | — | — | false |
| g4u05.gi.past-perfect-connectors.tr.002 | translation | Übersetze ins Englische: ⏎  ⏎ Bevor sie ins Bett ging, hatte sie ihre Zähne geputzt. [de] | Before she went to bed, she had brushed her teeth. (full) ; She had brushed her teeth before she went to bed. (full) | deToEn | — | — | — | false |
| g4u05.gi.past-perfect-connectors.tr.003 | translation | Übersetze ins Englische: ⏎  ⏎ Als wir ankamen, hatte das Spiel schon begonnen. [de] | When we arrived, the game had already started. (full) ; The game had already started when we arrived. (full) ; By the time we arrived, the game had already started. (full) ; When we arrived, the game had started. (partial) | deToEn | — | — | — | false |
| g4u05.gi.past-perfect-connectors.tr.004 | translation | Übersetze ins Englische: ⏎  ⏎ Obwohl er das Buch schon gelesen hatte, schaute er sich den Film an. [de] | Although he had already read the book, he watched the film. (full) ; He watched the film although he had already read the book. (full) ; Even though he had already read the book, he watched the film. (full) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g4-u05/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g4-u05",
  "lens": "answers",
  "itemsHash": "85d993378c1a",
  "promptHash": "70fa2d8cdf22",
  "round": 1,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 91, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
