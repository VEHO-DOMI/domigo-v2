# Verify lens — answers — g1-u07 (round 1)

<!-- domigo:verify answers g1-u07 items=ca45f99fa37b prompt=70fa2d8cdf22 round=1 -->

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

## Vocab items (67)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g1u07.w.always | always | at all times | We ___ drink tea. | always (full) | always (full) | never ; sometimes ; often |
| g1u07.w.an-apple | an apple | a red food you eat for a snack | I sometimes have ___ for breakfast. | an apple (full) | an apple (full) ; apple (partial) | an orange ; cheese ; egg |
| g1u07.w.an-orange | an orange | a round fruit you make juice from | Tom likes an apple, but he doesn't like ___. | an orange (full) | an orange (full) ; orange (partial) | an apple ; kiwi ; strawberry |
| g1u07.w.any | any | you put this word in a question, like 'Have you got …?' | Have you got ___ tomatoes? | any (full) | any (full) | some ; always ; never |
| g1u07.w.beans | beans | small vegetables you can eat hot in soup | My mum likes carrots, but she doesn't like ___. | beans (full) | beans (full) | peas ; grapes ; chillies |
| g1u07.w.bread | bread | food you put butter and cheese on | For breakfast we have ___ and eggs and tomatoes. | bread (full) | bread (full) | rice ; milk ; tea |
| g1u07.w.breakfast | breakfast | the food you eat in the morning | I always have tea for ___. | breakfast (full) | breakfast (full) | lunch ; dinner ; restaurant |
| g1u07.w.broccoli | broccoli | a green vegetable like a small tree | My mum likes carrots, but she doesn't like ___. | broccoli (full) | broccoli (full) | spinach ; onion ; carrot |
| g1u07.w.butter | butter | a yellow food from milk that you put on bread | He has milk, bread and ___. | butter (full) | butter (full) | sugar ; tea ; rice |
| g1u07.w.cake | cake | a sweet food you make for a birthday | Mum makes a big birthday ___ with strawberries on it. | cake (full) | cake (full) | soup ; salad ; sandwich |
| g1u07.w.carrot | carrot | a long orange vegetable, rabbits love it | My mum likes ___, but she doesn't like beans. | carrots (full) ; carrot (full) | carrot (full) ; carrots (full) | onion ; cucumber ; broccoli |
| g1u07.w.cheese | cheese | a yellow food from milk that you put on pizza | My favourite food is bread with ___ in it. | cheese (full) | cheese (full) | butter ; sugar ; ham |
| g1u07.w.chicken | chicken | a bird that gives us eggs and meat | For dinner we have ___ with rice. | chicken (full) | chicken (full) | fish ; ham ; cheese |
| g1u07.w.chillies | chillies | small red food that makes your soup very hot | My mum and I always put ___ into the soup, but I don't like them. | chillies (full) | chillies (full) | grapes ; peas ; beans |
| g1u07.w.chips | chips | food you eat hot with fish | My favourite food is fish and ___. | chips (full) | chips (full) | grapes ; beans ; peas |
| g1u07.w.chocolate | chocolate | a sweet brown food you love | She has a big box of ___ for her birthday. | chocolate (full) | chocolate (full) | bread ; cheese ; butter |
| g1u07.w.cucumber | cucumber | a long vegetable you put in a salad | I like red peppers, but I don't like ___. | cucumber (full) ; cucumbers (full) | cucumber (full) ; cucumbers (full) | onion ; broccoli ; carrot |
| g1u07.w.dinner | dinner | the food you eat in the evening | We sometimes have pizza for ___. | dinner (full) | dinner (full) | breakfast ; lunch ; restaurant |
| g1u07.w.egg | egg | a small white ball that comes from a chicken | I sometimes have an ___ for breakfast. | egg (full) | egg (full) ; eggs (full) ; an egg (full) | cheese ; ham ; fish |
| g1u07.w.fish | fish | an animal that lives in water | We have ___ and chips for dinner on Friday. | fish (full) | fish (full) | chicken ; ham ; meat |
| g1u07.w.fries | fries | long hot potato that you eat with a hamburger | I always have ___ with my hamburger. | fries (full) | fries (full) | soup ; salad ; cake |
| g1u07.w.glass | glass | you drink water or juice from it | Would you like a ___ of orange juice? | glass (full) | glass (full) | plate ; menu ; waiter |
| g1u07.w.grapes | grapes | small sweet fruits, you eat many of them | I love small green ___ from the market. | grapes (full) | grapes (full) | peas ; beans ; chillies |
| g1u07.w.ham | ham | pink meat from a pig that you put in a sandwich | On Sunday, I sometimes have ___ and eggs for breakfast. | ham (full) | ham (full) | fish ; egg ; cheese |
| g1u07.w.hamburger | hamburger | meat in bread that you eat with fries | We often go to the ___ restaurant for lunch. | hamburger (full) | hamburger (full) ; hamburgers (full) | sandwich ; soup ; salad |
| g1u07.w.have-you-got | Have you got …? | you say this to ask if a person has a thing | ___ any chips? | Have you got (full) | Have you got …? (full) ; Have you got (full) | I've got … ; That's nice. ; to like |
| g1u07.w.healthy | healthy | good for your body | A lot of junk food isn't ___. | healthy (full) | healthy (full) | junk food ; sugar ; chocolate |
| g1u07.w.i-ve-got | I've got … | you say this when you have a thing | Yes, ___ four bags of chips. | I've got (full) | I've got … (full) ; I've got (full) | Have you got …? ; That's nice. ; to like |
| g1u07.w.ice-cream | ice cream | a cold food you love on a hot day | On a hot day I love a cold ___. | ice cream (full) | ice cream (full) | soup ; bread ; rice |
| g1u07.w.junk-food | junk food | what you eat that is bad for your body, like chips | A lot of ___ isn't healthy. | junk food (full) | junk food (full) | breakfast ; vegetable ; salad |
| g1u07.w.kiwi | kiwi | a small brown fruit, green inside | Jenny doesn't like an apple, but she likes ___. | kiwis (full) ; kiwi (full) ; a kiwi (full) | kiwi (full) ; kiwis (full) | an apple ; an orange ; strawberry |
| g1u07.w.lunch | lunch | the food you eat at lunchtime | For ___ we often have pizza. | lunch (full) | lunch (full) | breakfast ; dinner ; restaurant |
| g1u07.w.meat | meat | food from a cow or a pig | I am vegetarian. I never eat ___. | meat (full) | meat (full) | bread ; rice ; cheese |
| g1u07.w.menu | menu | it shows you the food in a restaurant | Can I have the ___, please? | menu (full) | menu (full) | plate ; glass ; waiter |
| g1u07.w.milk | milk | a white drink from a cow | I never drink ___ for breakfast. | milk (full) | milk (full) | tea ; bread ; cheese |
| g1u07.w.mineral-water | mineral water | a clean drink from a bottle, with no sugar in it | I like ___, but I don't like tea. | mineral water (full) | mineral water (full) | orange juice ; tea ; milk |
| g1u07.w.money | money | you give this for food in a restaurant | How much ___ have you got? | money (full) | money (full) | bread ; menu ; plate |
| g1u07.w.mum | Mum | the word for your mother | My ___ makes breakfast. | Mum (full) ; mum (full) | Mum (full) ; mum (full) ; Mom (partial) | waiter ; menu ; plate |
| g1u07.w.never | never | not at any time | She is vegetarian. She ___ eats meat. | never (full) | never (full) | always ; usually ; often |
| g1u07.w.often | often | many times, but not always | In my family we ___ eat rice. | often (full) | often (full) | never ; always ; usually |
| g1u07.w.onion | onion | a round vegetable, it makes you cry when you cut it | I put ___ in the soup, and it makes me cry. | an onion (full) ; onions (full) ; onion (partial) | onion (full) ; onions (full) | carrot ; broccoli ; cucumber |
| g1u07.w.orange-juice | orange juice | a drink you make from a round fruit | I like ___ , but I don't like milk. | orange juice (full) | orange juice (full) | mineral water ; tea ; milk |
| g1u07.w.pasta | pasta | food you eat hot, often with tomatoes | For lunch we often have ___. | pasta (full) | pasta (full) | rice ; bread ; cheese |
| g1u07.w.peas | peas | small green vegetables you eat in your soup | There are small green ___ in my soup. | peas (full) | peas (full) | beans ; grapes ; chillies |
| g1u07.w.pizza | pizza | a hot food with cheese and tomatoes on it | We sometimes have ___ for lunch or dinner. | pizza (full) ; a pizza (full) | pizza (full) | soup ; salad ; sandwich |
| g1u07.w.plate | plate | you put your food on it and then you eat | Can I have a clean ___? | plate (full) | plate (full) | glass ; menu ; waiter |
| g1u07.w.red-pepper | red pepper | a big vegetable you eat in a salad | He likes ___, but he doesn't like carrots. | red peppers (full) ; red pepper (full) ; a red pepper (full) | red pepper (full) ; red peppers (full) | cucumber ; onion ; broccoli |
| g1u07.w.restaurant | restaurant | you go there to eat, and a waiter brings the food | We sometimes go to a ___ on Sunday. | restaurant (full) | restaurant (full) | breakfast ; menu ; waiter |
| g1u07.w.rice | rice | small white food you eat with meat and vegetables | For lunch or dinner we have a lot of ___. | rice (full) | rice (full) | bread ; cheese ; milk |
| g1u07.w.salad | salad | a cold food with tomatoes and cucumber | I want to make a ___. | salad (full) | salad (full) | soup ; cake ; sandwich |
| g1u07.w.sandwich | sandwich | bread with cheese or ham in it | I have a cheese ___ for lunch. | sandwich (full) | sandwich (full) | soup ; salad ; cake |
| g1u07.w.sausages | sausages | long meat that you eat hot | My sister is vegetarian. She never eats meat or ___. | sausages (full) | sausages (full) | beans ; grapes ; peas |
| g1u07.w.some | some | a little, not a lot | I need ___ cheese. | some (full) | some (full) | any ; always ; never |
| g1u07.w.sometimes | sometimes | not always, but now and then | I ___ have an egg for breakfast. | sometimes (full) | sometimes (full) | always ; never ; usually |
| g1u07.w.soup | soup | a hot food you eat when it is cold | Can I have a ___, please? | soup (full) | soup (full) | salad ; cake ; sandwich |
| g1u07.w.spinach | spinach | a green vegetable with big leaves | I like fish with rice or vegetables — tomatoes or ___. | spinach (full) | spinach (full) | broccoli ; carrot ; onion |
| g1u07.w.strawberry | strawberry | a small red fruit you put on a cake | Mum makes a big birthday cake with one red ___ on it. | strawberry (full) | strawberry (full) ; strawberries (full) | an apple ; an orange ; kiwi |
| g1u07.w.sugar | sugar | a sweet white thing you put in your tea | Do you want one or two spoons of ___ in your tea? | sugar (full) | sugar (full) | butter ; milk ; tea |
| g1u07.w.tea | tea | a hot drink, grandma drinks it with sugar | I always drink ___ for breakfast. | tea (full) | tea (full) | milk ; bread ; rice |
| g1u07.w.that-s-nice | That's nice. | you say this when you hear good news | I love chicken, eggs and cheese. — ___ | That's nice. (full) ; That's nice (full) | That's nice. (full) ; That's nice (full) | Have you got …? ; I've got … ; to like |
| g1u07.w.to-drink | to drink | to have water, tea or milk in your mouth | Would you like something to ___? | drink (full) | drink (full) ; to drink (full) | to make ; to like ; Have you got …? |
| g1u07.w.to-like | to like | to think a food is good or nice | I ___ orange juice, but I don't like milk. | like (full) | like (full) ; to like (full) | to make ; to drink ; Have you got …? |
| g1u07.w.to-make | to make | you do this with food when you cook it | I want to ___ a salad. | make (full) | make (full) ; to make (full) | to drink ; to like ; Have you got …? |
| g1u07.w.tomato | tomato (pl tomatoes) | a red vegetable you eat in a salad | For breakfast we often have bread and eggs and ___. | tomatoes (full) ; a tomato (partial) ; tomato (partial) | tomato (full) ; tomatoes (full) | onion ; cucumber ; broccoli |
| g1u07.w.usually | usually | almost always, but not at all times | In the morning, we ___ have a soup with meat. | usually (full) | usually (full) | never ; sometimes ; always |
| g1u07.w.vegetable | vegetable | broccoli, a carrot or an onion is this | Broccoli is a green ___. | vegetable (full) | vegetable (full) ; vegetables (full) | cake ; soup ; sandwich |
| g1u07.w.waiter | waiter | the man who brings the food in a restaurant | The ___ brings the food to your table. | waiter (full) ; waitress (partial) | waiter (full) ; waitress (partial) | menu ; plate ; restaurant |

## Grammar items (78)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g1u07.gi.adverbs-frequency.ag.001 | anagram | manchmal (etwa 50%) [de] | sometimes (full) | — | — | — | — | false |
| g1u07.gi.adverbs-frequency.ag.002 | anagram | nie (0%) [de] | never (full) | — | — | — | — | false |
| g1u07.gi.adverbs-frequency.cp.001 | context-picker | Your friend asks about breakfast. You eat breakfast 100% of the time. [en] | I always eat breakfast. (full) | — | I eat always breakfast. ; Always I eat breakfast. ; I eat breakfast always. | — | — | false |
| g1u07.gi.adverbs-frequency.cp.002 | context-picker | Your friend asks about your sister. She is hungry all the time. [en] | She is always hungry. (full) | — | She always is hungry. ; She is hungry always. ; Always she is hungry. | — | — | false |
| g1u07.gi.adverbs-frequency.ec.001 | error-correction | I eat always breakfast. [en] | I always eat breakfast. (full) ; always eat (partial) | — | — | — | — | true |
| g1u07.gi.adverbs-frequency.ec.002 | error-correction | She always is happy. [en] | She is always happy. (full) ; is always (partial) | — | — | — | — | true |
| g1u07.gi.adverbs-frequency.ec.003 | error-correction | He drinks never milk. [en] | He never drinks milk. (full) ; never drinks (partial) | — | — | — | — | true |
| g1u07.gi.adverbs-frequency.gf.001 | gap-fill | I ___ eat breakfast before school. [en, 1 blank(s)] | always (full) | — | — | — | — | false |
| g1u07.gi.adverbs-frequency.gf.002 | gap-fill | I ___ drink milk. I don't like it. (0%) [en, 1 blank(s)] | never (full) | — | — | — | — | false |
| g1u07.gi.adverbs-frequency.gf.003 | gap-fill | She ___ eats cheese for lunch. (80%) [en, 1 blank(s)] | usually (full) | — | — | — | — | false |
| g1u07.gi.adverbs-frequency.gf.004 | gap-fill | We ___ have pizza for dinner. (50%) [en, 1 blank(s)] | sometimes (full) | — | — | — | — | false |
| g1u07.gi.adverbs-frequency.gf.005 | gap-fill | I'm ___ hungry in the morning. (100%) [en, 1 blank(s)] | always (full) | — | — | — | — | false |
| g1u07.gi.adverbs-frequency.gf.006 | gap-fill | He ___ eats rice, and his sister is ___ hungry. (often / always) [en, 2 blank(s)] | often \| always (full) | — | — | — | — | true |
| g1u07.gi.adverbs-frequency.gs.002 | group-sort | Wie oft? Sortiere von 0% bis 100%. [de] | — | — | — | — | 0%: I never eat fish., She never drinks milk. \| 50%: We sometimes have pizza., He sometimes eats cake. \| 100%: I always eat breakfast., They always drink tea. | false |
| g1u07.gi.adverbs-frequency.mc.004 | multiple-choice | Welcher Satz ist richtig? [de] | She always eats cheese. (full) | — | She eats always cheese. ; Always she eats cheese. ; She eats cheese always. | — | — | true |
| g1u07.gi.adverbs-frequency.mc.005 | multiple-choice | Welcher Satz ist richtig? [de] | He is always hungry. (full) | — | He always is hungry. ; Always he is hungry. ; He is hungry always. | — | — | true |
| g1u07.gi.adverbs-frequency.mc.006 | multiple-choice | Welcher Satz ist richtig? [de] | I never eat fish. (full) | — | I eat never fish. ; I don't never eat fish. ; Never I eat fish. | — | — | true |
| g1u07.gi.adverbs-frequency.mp.002 | matching-pairs | Was passt zusammen? [de] | — | — | — | I always eat breakfast ↔ in the morning. ; We sometimes have pizza ↔ for lunch. ; She never drinks milk ↔ at school. ; He often has soup ↔ for dinner. | — | false |
| g1u07.gi.adverbs-frequency.mt.002 | matching | Wie oft? Bilde die Sätze. [de] | — | — | — | I never ↔ eat fish. ; She usually ↔ drinks tea. ; We often ↔ have rice. ; He sometimes ↔ eats cake. | — | false |
| g1u07.gi.adverbs-frequency.sb.001 | sentence-building | always / I / eat / breakfast [en] | I always eat breakfast. (full) | — | — | — | — | false |
| g1u07.gi.adverbs-frequency.sb.002 | sentence-building | is / She / always / hungry [en] | She is always hungry. (full) | — | — | — | — | false |
| g1u07.gi.adverbs-frequency.sb.003 | sentence-building | never / We / drink / milk [en] | We never drink milk. (full) | — | — | — | — | false |
| g1u07.gi.adverbs-frequency.tf.001 | transformation | I drink tea. (usually) [en] | I usually drink tea. (full) | — | — | — | — | true |
| g1u07.gi.adverbs-frequency.tf.002 | transformation | They are happy. (often) [en] | They are often happy. (full) | — | — | — | — | true |
| g1u07.gi.adverbs-frequency.tf.003 | transformation | She eats meat. (never) [en] | She never eats meat. (full) | — | — | — | — | true |
| g1u07.gi.adverbs-frequency.tr.001 | translation | Ich esse immer Frühstück. [de] | I always eat breakfast. (full) ; I always have breakfast. (full) | deToEn | — | — | — | false |
| g1u07.gi.adverbs-frequency.tr.002 | translation | Sie ist manchmal hungrig. [de] | She is sometimes hungry. (full) ; Sometimes she is hungry. (full) ; She's sometimes hungry. (full) | deToEn | — | — | — | false |
| g1u07.gi.articles-a-an.cp.001 | context-picker | Du zeigst auf den Nachtisch und sagst, was du willst. Welcher Satz ist richtig? [de] | I want an ice cream. (full) | — | I want a ice cream. ; I want the ice cream. ; I want ice cream. | — | — | false |
| g1u07.gi.articles-a-an.cp.002 | context-picker | Du sagst dem Kellner, was du möchtest. Welcher Satz ist richtig? [de] | I want a hamburger. (full) | — | I want an hamburger. ; I want the hamburger. ; I want hamburger. | — | — | false |
| g1u07.gi.articles-a-an.ec.001 | error-correction | Finde den Fehler und verbessere ihn: It is a onion. [de] | It is an onion. (full) ; an onion (partial) | — | — | — | — | true |
| g1u07.gi.articles-a-an.ec.002 | error-correction | Finde den Fehler und verbessere ihn: She has an pizza. [de] | She has a pizza. (full) ; a pizza (partial) | — | — | — | — | true |
| g1u07.gi.articles-a-an.ec.003 | error-correction | Finde den Fehler und verbessere ihn: I want a egg for breakfast. [de] | I want an egg for breakfast. (full) ; an egg (partial) | — | — | — | — | true |
| g1u07.gi.articles-a-an.gf.001 | gap-fill | He wants ___ egg for breakfast. [en, 1 blank(s)] | an (full) | — | — | — | — | true |
| g1u07.gi.articles-a-an.gf.002 | gap-fill | I eat ___ hot dog. [en, 1 blank(s)] | a (full) | — | — | — | — | true |
| g1u07.gi.articles-a-an.gf.003 | gap-fill | She has ___ pizza for lunch. [en, 1 blank(s)] | a (full) | — | — | — | — | true |
| g1u07.gi.articles-a-an.gf.004 | gap-fill | It is ___ onion. [en, 1 blank(s)] | an (full) | — | — | — | — | true |
| g1u07.gi.articles-a-an.gf.005 | gap-fill | Do you want ___ ice cream? [en, 1 blank(s)] | an (full) | — | — | — | — | true |
| g1u07.gi.articles-a-an.gf.006 | gap-fill | I want ___ egg and ___ hot dog. [en, 2 blank(s)] | an \| a (full) | — | — | — | — | true |
| g1u07.gi.articles-a-an.gf.007 | gap-fill | She has ___ tomato and ___ onion. [en, 2 blank(s)] | a \| an (full) | — | — | — | — | true |
| g1u07.gi.articles-a-an.gs.001 | group-sort | a oder an? Sortiere die Wörter. [de] | — | — | — | — | a: a hot dog, a pizza, a tomato, a carrot, a sandwich \| an: an egg, an apple, an orange, an onion, an ice cream | false |
| g1u07.gi.articles-a-an.mc.001 | multiple-choice | Welches Wort passt vor egg? [de] | an (full) | — | a ; the ; some | — | — | false |
| g1u07.gi.articles-a-an.mc.002 | multiple-choice | Welches Wort passt vor pizza? [de] | a (full) | — | an ; the ; some | — | — | false |
| g1u07.gi.articles-a-an.mc.003 | multiple-choice | Welcher Satz ist richtig? [de] | He wants an egg. (full) | — | He wants a egg. ; He wants the egg. ; He wants egg. | — | — | false |
| g1u07.gi.articles-a-an.mc.004 | multiple-choice | Welcher Satz ist richtig? [de] | It is an onion. (full) | — | It is a onion. ; It is the onion. ; It is onion. | — | — | false |
| g1u07.gi.articles-a-an.mp.001 | matching-pairs | Finde die Paare: Wort und richtige Form. [de] | — | — | — | onion ↔ an onion ; tomato ↔ a tomato ; egg ↔ an egg ; sandwich ↔ a sandwich ; ice cream ↔ an ice cream ; carrot ↔ a carrot | — | false |
| g1u07.gi.articles-a-an.mt.001 | matching | Verbinde das Wort mit der richtigen Form. [de] | — | — | — | egg ↔ an egg ; hot dog ↔ a hot dog ; onion ↔ an onion ; pizza ↔ a pizza | — | false |
| g1u07.gi.articles-a-an.sb.001 | sentence-building | an / egg / want / I [en] | I want an egg. (full) | — | — | — | — | false |
| g1u07.gi.articles-a-an.sb.002 | sentence-building | a / hot / dog / wants / He [en] | He wants a hot dog. (full) | — | — | — | — | false |
| g1u07.gi.articles-a-an.sb.003 | sentence-building | an / and / a / want / hot / dog / I / egg [en] | I want an egg and a hot dog. (full) | — | — | — | — | false |
| g1u07.gi.articles-a-an.tf.001 | transformation | Setze a oder an ein: I eat ___ ice cream. [de, 1 blank(s)] | I eat an ice cream. (full) ; an (partial) | — | — | — | — | true |
| g1u07.gi.articles-a-an.tf.002 | transformation | Setze a oder an ein: She wants ___ carrot. [de, 1 blank(s)] | She wants a carrot. (full) ; a (partial) | — | — | — | — | true |
| g1u07.gi.articles-a-an.tr.001 | translation | Ich möchte einen Apfel. [de] | I want an apple. (full) ; I would like an apple. (partial) | deToEn | — | — | — | false |
| g1u07.gi.articles-a-an.tr.002 | translation | Sie isst eine Pizza. [de] | She eats a pizza. (full) ; She has a pizza. (partial) | deToEn | — | — | — | false |
| g1u07.gi.present-simple-negative.ag.002 | anagram | das Wort für nicht (mit do) bei he/she/it (kurze Form von does not): [de] | doesn't (full) | — | — | — | — | true |
| g1u07.gi.present-simple-negative.cp.001 | context-picker | Ein Mädchen isst kein Fleisch. Welcher Satz stimmt? [de] | She doesn't eat meat. (full) | — | She don't eat meat. ; She doesn't eats meat. ; She not eat meat. | — | — | true |
| g1u07.gi.present-simple-negative.cp.002 | context-picker | Du und deine Freunde mögt keinen Reis. Welcher Satz stimmt? [de] | We don't like rice. (full) | — | We doesn't like rice. ; We don't likes rice. ; We not like rice. | — | — | true |
| g1u07.gi.present-simple-negative.ec.001 | error-correction | He don't like vegetables. [en] | He doesn't like vegetables. (full) ; He does not like vegetables. (full) ; doesn't (partial) ; does not (partial) | — | — | — | — | true |
| g1u07.gi.present-simple-negative.ec.002 | error-correction | She doesn't eats broccoli. [en] | She doesn't eat broccoli. (full) ; She does not eat broccoli. (full) ; eat (partial) | — | — | — | — | true |
| g1u07.gi.present-simple-negative.ec.003 | error-correction | The dog don't like grapes. [en] | The dog doesn't like grapes. (full) ; The dog does not like grapes. (full) ; doesn't (partial) | — | — | — | — | true |
| g1u07.gi.present-simple-negative.gf.001 | gap-fill | I ___ like rice. [en, 1 blank(s)] | don't (full) ; do not (full) | — | — | — | — | true |
| g1u07.gi.present-simple-negative.gf.002 | gap-fill | He ___ like carrots. [en, 1 blank(s)] | doesn't (full) ; does not (full) | — | — | — | — | true |
| g1u07.gi.present-simple-negative.gf.003 | gap-fill | She ___ (not / eat) meat. [en, 1 blank(s)] | doesn't eat (full) ; does not eat (full) | — | — | — | — | true |
| g1u07.gi.present-simple-negative.gf.004 | gap-fill | They ___ (not / like) fish. [en, 1 blank(s)] | don't like (full) ; do not like (full) | — | — | — | — | true |
| g1u07.gi.present-simple-negative.gf.005 | gap-fill | Tom ___ (not / eat) broccoli and his friends ___ (not / eat) it. [en, 2 blank(s)] | doesn't eat \| don't eat (full) ; does not eat \| do not eat (full) | — | — | — | — | true |
| g1u07.gi.present-simple-negative.gf.006 | gap-fill | My sister ___ (not / drink) milk. [en, 1 blank(s)] | doesn't drink (full) ; does not drink (full) | — | — | — | — | true |
| g1u07.gi.present-simple-negative.gs.001 | group-sort | Sortiere: braucht der Satz don't oder doesn't? [de] | — | — | — | — | don't: I, you, we, they \| doesn't: he, she, it | true |
| g1u07.gi.present-simple-negative.gs.002 | group-sort | Welche Sätze sind richtig (yes), welche falsch (no)? [de] | — | — | — | — | yes: He doesn't like rice., We don't eat meat., She doesn't drink milk. \| no: He don't like rice., We doesn't eat meat., She doesn't drinks milk. | true |
| g1u07.gi.present-simple-negative.mc.001 | multiple-choice | Tom ___ tea in the morning. [en, 1 blank(s)] | doesn't drink (full) | — | don't drink ; doesn't drinks ; drinks not | — | — | true |
| g1u07.gi.present-simple-negative.mc.002 | multiple-choice | We ___ vegetables for breakfast. [en, 1 blank(s)] | don't eat (full) | — | doesn't eat ; don't eats ; eat not | — | — | true |
| g1u07.gi.present-simple-negative.mc.003 | multiple-choice | My friend ___ tomatoes. [en, 1 blank(s)] | doesn't like (full) | — | don't like ; doesn't likes ; like not | — | — | true |
| g1u07.gi.present-simple-negative.mt.002 | matching | Was passt zusammen? [de] | — | — | — | I ↔ don't eat meat ; He ↔ doesn't like rice ; She ↔ doesn't drink milk ; They ↔ don't eat fish | — | true |
| g1u07.gi.present-simple-negative.sb.001 | sentence-building | eat / doesn't / She / meat [en] | She doesn't eat meat. (full) ; She does not eat meat. (full) | — | — | — | — | true |
| g1u07.gi.present-simple-negative.sb.002 | sentence-building | like / don't / We / carrots [en] | We don't like carrots. (full) ; We do not like carrots. (full) | — | — | — | — | true |
| g1u07.gi.present-simple-negative.tf.001 | transformation | I like spinach. → I ___ spinach. [en, 1 blank(s)] | don't like (full) ; do not like (full) ; I don't like spinach. (full) ; I do not like spinach. (full) | — | — | — | — | true |
| g1u07.gi.present-simple-negative.tf.002 | transformation | He likes peas. → He ___ peas. [en, 1 blank(s)] | doesn't like (full) ; does not like (full) ; He doesn't like peas. (full) ; He does not like peas. (full) | — | — | — | — | true |
| g1u07.gi.present-simple-negative.tr.001 | translation | Ich mag keinen Fisch. [de] | I don't like fish. (full) ; I do not like fish. (full) | deToEn | — | — | — | false |
| g1u07.gi.present-simple-negative.tr.002 | translation | Meine Schwester mag keinen Reis. [de] | My sister doesn't like rice. (full) ; My sister does not like rice. (full) | deToEn | — | — | — | false |
| g1u07.gi.present-simple-negative.tr.003 | translation | I don't like soup. [en] | Ich mag keine Suppe. (full) ; Ich mag Suppe nicht. (full) | enToDe | — | — | — | false |

## Output contract

Write `content/corpus/units/g1-u07/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u07",
  "lens": "answers",
  "itemsHash": "ca45f99fa37b",
  "promptHash": "70fa2d8cdf22",
  "round": 1,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 145, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
