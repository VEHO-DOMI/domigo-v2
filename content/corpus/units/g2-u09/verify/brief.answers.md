# Verify lens — answers — g2-u09 (round 2)

<!-- domigo:verify answers g2-u09 items=701ca1d81149 prompt=70fa2d8cdf22 round=2 -->

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

## Vocab items (56)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g2u09.w.actor-actress | actor, actress | a man or woman who is in a play or a show | My favourite ___ is in a new show this summer. | actor (full) ; actress (full) ; actors (partial) ; actresses (partial) | actor (full) ; actress (full) ; actors (partial) ; actresses (partial) | singer ; guide ; teacher |
| g2u09.w.apple-juice | apple juice | a drink that you make with green or red food from a tree | Can I have a glass of ___, please? | apple juice (full) | apple juice (full) | mineral water ; soup ; cheese |
| g2u09.w.beef | beef | a kind of meat that you eat with chips and carrots | We had ___ with chips and carrots for our main course. | beef (full) | beef (full) | chicken ; lamb ; turkey |
| g2u09.w.cabbage | cabbage | a big green vegetable with many leaves | We had turkey with potatoes and ___ for our main course. | cabbage (full) ; cabbages (partial) | cabbage (full) ; cabbages (partial) | onions ; peppers ; mushrooms |
| g2u09.w.certain | certain | You really, really think it is true. | Are you ___ that today is a holiday? | certain (full) | certain (full) | happy ; tired ; hungry |
| g2u09.w.cheesecake | cheesecake | You eat this white food at the end of dinner, and it is really delicious. | I had a slice of ___ with strawberries after dinner. | cheesecake (full) ; cheesecakes (partial) | cheesecake (full) ; cheesecakes (partial) | pancakes ; pumpkin pie ; rice pudding |
| g2u09.w.chef | chef | the man or woman who cooks the food in a restaurant | The ___ cooked a delicious pizza in the kitchen. | chef (full) ; chefs (partial) | chef (full) ; chefs (partial) | waiter ; guide ; teacher |
| g2u09.w.chicken | chicken | the white meat that you put in a soup or eat with rice | Mum is making ___ soup with carrots and rice for lunch. | chicken (full) ; chickens (partial) | chicken (full) | beef ; lamb ; turkey |
| g2u09.w.chocolate-ice-cream | chocolate ice cream | a cold brown food that you eat after dinner | I always have ___ at the restaurant. It is cold and brown. | chocolate ice cream (full) | chocolate ice cream (full) | cheesecake ; pancakes ; rice pudding |
| g2u09.w.cloche | cloche | a cover for a plate that keeps the food hot in a restaurant | The waiter put the ___ over my food at the restaurant. | cloche (full) ; cloches (partial) | cloche (full) ; cloches (partial) | plate ; menu ; recipe |
| g2u09.w.completely | completely | all of it, with nothing more | The room was ___ dark. | completely (full) | completely (full) | really ; usually ; always |
| g2u09.w.consumer | consumer | a man or woman who pays money for food at the supermarket | When you pay money for your food at the supermarket, you are a ___. | consumer (full) ; consumers (partial) | consumer (full) ; consumers (partial) | waiter ; guest ; chef |
| g2u09.w.crane | crane | a very tall machine that can hold a heavy thing up high | A big ___ holds the restaurant platform high in the sky. | crane (full) ; cranes (partial) | crane (full) ; cranes (partial) | building ; ship ; train |
| g2u09.w.delivery | delivery | when food or a new thing comes to your door | I am waiting for my pizza ___. | delivery (full) ; deliveries (partial) | delivery (full) ; deliveries (partial) | menu ; recipe ; ticket |
| g2u09.w.fridge | fridge | the cold machine in the kitchen where you keep food | There's nothing in the ___. Let's go to the supermarket. | fridge (full) ; fridges (partial) | fridge (full) ; fridges (partial) | kitchen ; table ; drawer |
| g2u09.w.glasses | glasses (pl) | you wear these on your eyes when you want to read a book or look at the board | I need my ___ to read the board at school. | glasses (full) | glasses (full) | sunglasses ; hat ; shoes |
| g2u09.w.grapes | grapes | small green or purple food; you eat a lot of them at once | I had some green ___ with my lunch. They were small and very nice. | grapes (full) | grapes (full) ; grape (partial) | plums ; olives ; peppers |
| g2u09.w.gym | gym | a big room or building where people do exercise | We play basketball in the school ___ on Fridays. | gym (full) ; gyms (partial) | gym (full) ; gyms (partial) | library ; kitchen ; garden |
| g2u09.w.ham | ham | meat from a pig that you eat in a sandwich | I'd like a ___ and cheese sandwich, please. | ham (full) | ham (full) | cheese ; beef ; chicken |
| g2u09.w.lamb | lamb | the meat from a young sheep | The woman had the ___ for her main course. | lamb (full) | lamb (full) | beef ; chicken ; turkey |
| g2u09.w.main-course | main course | the food you eat after the starter, like meat or fish with vegetables | After the soup, we had chicken with rice for the ___. | main course (full) ; main courses (partial) | main course (full) ; main courses (partial) | starter ; soup ; menu |
| g2u09.w.menu | menu | you read this and then you order your food in a restaurant | Can I have the ___, please? I want to order some food. | menu (full) ; menus (partial) | menu (full) ; menus (partial) | recipe ; ticket ; letter |
| g2u09.w.mineral-water | mineral water | a drink in a bottle that has no sugar | I'd like a bottle of ___, please. | mineral water (full) | mineral water (full) | apple juice ; soup ; tea |
| g2u09.w.mushrooms | mushrooms | a small food that you can put on a pizza or eat with meat | I'd like a pizza with ham, ___ and green peppers. | mushrooms (full) ; mushroom (partial) | mushrooms (full) ; mushroom (partial) | onions ; peppers ; olives |
| g2u09.w.olives | olives | a small green or black food that you put on a pizza or in a salad | Would you like ___ on your pizza? They are small, green or black. | olives (full) ; olive (partial) | olives (full) ; olive (partial) | mushrooms ; peppers ; onions |
| g2u09.w.onions | onions | a white vegetable that makes you cry when you cook it | I don't want any ___ on my pizza, please. | onions (full) ; onion (partial) | onions (full) ; onion (partial) | peppers ; mushrooms ; olives |
| g2u09.w.pancakes | pancakes | food that you eat for breakfast, cooked from eggs | We had ___ for breakfast this morning. | pancakes (full) ; pancake (partial) | pancakes (full) ; pancake (partial) | cheesecake ; pumpkin pie ; rice pudding |
| g2u09.w.peaches | peaches | food from a tree with a stone in the middle, that you eat in summer | Are there any plums and ___ in the fridge? | peaches (full) ; peach (partial) | peaches (full) ; peach (partial) | plums ; pears ; grapes |
| g2u09.w.pears | pears | green food from a tree that you eat after lunch | Dad, are there any ___ in the fridge? They are green and you eat them. | pears (full) ; pear (partial) | pears (full) ; pear (partial) | plums ; peaches ; grapes |
| g2u09.w.peppers | peppers | a red or green vegetable that you put on a pizza | I'd like a pizza with ham, mushrooms and green ___. | peppers (full) ; pepper (partial) | peppers (full) ; pepper (partial) | onions ; mushrooms ; olives |
| g2u09.w.platform | platform | a high place where people can stand on it | There's a restaurant on a ___ in the sky. | platform (full) ; platforms (partial) | platform (full) ; platforms (partial) | building ; machine ; river |
| g2u09.w.plums | plums | small purple food with a stone in the middle | Dad, are there any ___ and peaches in the fridge? | plums (full) | plums (full) ; plum (partial) | pears ; peaches ; grapes |
| g2u09.w.potato | potato (pl potatoes) | a brown vegetable that you eat hot with butter | They had turkey with ___ and cabbage. | potatoes (full) ; potato (partial) | potato (full) ; potatoes (full) | cabbage ; onions ; peppers |
| g2u09.w.pumpkin-pie | pumpkin pie | an orange cake that people eat in October | My grandma makes the best ___ every October. | pumpkin pie (full) ; pumpkin pies (partial) | pumpkin pie (full) ; pumpkin pies (partial) | cheesecake ; pancakes ; rice pudding |
| g2u09.w.recipe | recipe | you read this and then you can make a cake or a soup | Grandma writes her ___ for chocolate cake so I can make it too. | recipe (full) ; recipes (partial) | recipe (full) ; recipes (partial) | menu ; ticket ; letter |
| g2u09.w.refund | refund | the money you get back when a new thing does not work | The shoes were too small, so I asked for a ___. | refund (full) ; refunds (partial) | refund (full) ; refunds (partial) | menu ; ticket ; delivery |
| g2u09.w.rice-pudding | rice pudding | a white food cooked in milk that you eat hot after dinner | We had hot ___ after dinner. It was white. | rice pudding (full) | rice pudding (full) | cheesecake ; pancakes ; pumpkin pie |
| g2u09.w.sausages | sausages | long meat that you cook and eat, often for breakfast or dinner | For me a pizza with ham, ___ and cheese. | sausages (full) ; sausage (partial) | sausages (full) ; sausage (partial) | ham ; cheese ; beef |
| g2u09.w.several | several | more than two, but not very many | There are ___ restaurants in my town. | several (full) | several (full) | many ; any ; some |
| g2u09.w.slice | slice | a piece of bread or cake that is not very big | Can I have a ___ of your pizza? | slice (full) ; slices (partial) | slice (full) ; slices (partial) | plate ; bottle ; glass |
| g2u09.w.soup | soup | a hot food of vegetables or meat that you eat from a plate | I'd like the onion ___ for starters, please. | soup (full) ; soups (partial) | soup (full) ; soups (partial) | stew ; salad ; bread |
| g2u09.w.starter | starter | you eat this small food first, before the chicken or fish | We had onion soup for ___. | starter (full) ; starters (full) | starter (full) ; starters (full) | main course ; soup ; menu |
| g2u09.w.stew | stew | a hot food of meat and vegetables cooked for a long time | Can I have the cabbage ___, please? | stew (full) ; stews (partial) | stew (full) ; stews (partial) | soup ; salad ; bread |
| g2u09.w.straightaway | straightaway | at once, very fast | Don't wait — bring the soup ___. | straightaway (full) ; straight away (partial) | straightaway (full) ; straight away (partial) | always ; never ; sometimes |
| g2u09.w.strawberries | strawberries | small red food that you eat in summer | Here, have some red ___. | strawberries (full) ; strawberry (partial) | strawberries (full) ; strawberry (partial) | grapes ; plums ; peaches |
| g2u09.w.to-change-one-s-mind | to change one's mind | to want a new thing now, not the thing from before | I wanted pizza, but I ___ and asked for pasta after all. | changed my mind (full) ; change my mind (partial) ; changed her mind (partial) ; changed his mind (partial) | change one's mind (full) ; change my mind (full) ; changed my mind (full) | take it easy ; tidy your room ; go for a walk |
| g2u09.w.to-complain | to complain | to tell people that you are not happy about your food | The food was cold, so the man wants to ___ to the waiter. | complain (full) ; complains (partial) ; complained (partial) | complain (full) ; to complain (full) | enjoy ; love ; thank |
| g2u09.w.to-download | to download | to put new music on your tablet | Yesterday I ___ the new Dua Lipa music to my tablet. | downloaded (full) ; download (partial) ; downloads (partial) | download (full) ; to download (full) | play ; read ; watch |
| g2u09.w.to-drop | to drop | to not hold a thing well, so it falls down | Hold the plate well — don't ___ it! | drop (full) ; drops (partial) ; dropped (partial) | drop (full) ; to drop (full) | hold ; wash ; eat |
| g2u09.w.to-entertain | to entertain | to do a fun show so that people enjoy it and laugh | The clown dances to ___ the children. | entertain (full) ; entertains (partial) ; entertained (partial) | entertain (full) ; to entertain (full) | dance ; watch ; enjoy |
| g2u09.w.to-miss | to miss | to be too slow and not catch the train | Hurry up — I don't want to ___ the train! | miss (full) ; misses (partial) ; missed (partial) | miss (full) ; to miss (full) | catch ; find ; watch |
| g2u09.w.to-pour | to pour | to make a drink go from a bottle into a glass | Can you ___ some apple juice into my glass? | pour (full) ; pours (partial) ; poured (partial) | pour (full) ; to pour (full) | drink ; eat ; open |
| g2u09.w.to-serve | to serve | to bring food or drinks to people at a table | The waiters ___ the food to the guests. | serve (full) ; serves (partial) ; served (partial) | serve (full) ; to serve (full) | pour ; cook ; drop |
| g2u09.w.tomato | tomato (pl tomatoes) | a red food that you put in a salad or on a pizza | I'd like a pizza with ham, cheese and red ___. | tomatoes (full) ; tomato (partial) | tomato (full) ; tomatoes (full) | onions ; mushrooms ; peppers |
| g2u09.w.turkey | turkey | a big farm food that families eat for a holiday dinner | In America, families eat ___ for a big holiday dinner. | turkey (full) ; turkeys (partial) | turkey (full) ; turkeys (partial) | chicken ; beef ; lamb |
| g2u09.w.waiter | waiter | the man or woman who brings your food to your table in a restaurant | The ___ brings us the menu and some food. | waiter (full) ; waiters (partial) ; waitress (partial) | waiter (full) ; waiters (partial) ; waitress (partial) | chef ; guide ; teacher |

## Grammar items (48)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g2u09.gi.one-ones.ag.003 | anagram | Dieses kurze Wort steht für ein einzelnes Ding, damit du das Wort nicht wiederholst: "the red ___". [de, 1 blank(s)] | one (full) | — | — | — | — | false |
| g2u09.gi.one-ones.ag.004 | anagram | Dieses Wort steht für mehrere Dinge, damit du das Wort nicht wiederholst: "the green ___". [de, 1 blank(s)] | ones (full) | — | — | — | — | false |
| g2u09.gi.one-ones.cp.001 | context-picker | The waiter asks which grapes you want. You like the green grapes. [en] | I'd like the green ones, please. (full) | — | I'd like the green one, please. ; I'd like the green, please. ; I'd like the green grapes ones, please. | — | — | false |
| g2u09.gi.one-ones.cp.002 | context-picker | The waiter asks which glass is for the apple juice. You tell him. [en] | That's the one for the apple juice. (full) | — | That's the ones for the apple juice. ; That's the for the apple juice. ; That's the glass one for the apple juice. | — | — | false |
| g2u09.gi.one-ones.ec.001 | error-correction | Which hat do you want? — I like the red ones. [en] | Which hat do you want? — I like the red one. (full) ; the red one (partial) ; one (partial) | — | — | — | — | true |
| g2u09.gi.one-ones.ec.002 | error-correction | These plums are good, but the one on that plate are nicer. [en] | These plums are good, but the ones on that plate are nicer. (full) ; the ones on that plate (partial) ; ones (partial) | — | — | — | — | true |
| g2u09.gi.one-ones.ff.001 | free-form | There are two pizzas on the menu: a ham one and a cheese one. Tell the waiter which one you want and why. [en] | I'd like the ham one, please. I really like ham. (full) ; Can I have the cheese one? I don't like ham. (full) ; I'd like the cheese one. (partial) | — | — | — | — | false |
| g2u09.gi.one-ones.gf.001 | gap-fill | I don't want this menu. Can I have the new ___? [en, 1 blank(s)] | one (full) | — | — | — | — | false |
| g2u09.gi.one-ones.gf.002 | gap-fill | These glasses are too small. I need bigger ___. [en, 1 blank(s)] | ones (full) | — | — | — | — | false |
| g2u09.gi.one-ones.gf.003 | gap-fill | Which cake do you want? — The chocolate ___. [en, 1 blank(s)] | one (full) | — | — | — | — | false |
| g2u09.gi.one-ones.gf.004 | gap-fill | Those are the glasses for the apple juice. These are the ___ for the soup. [en, 1 blank(s)] | ones (full) | — | — | — | — | false |
| g2u09.gi.one-ones.gf.005 | gap-fill | There are two soups. Do you want the tomato ___ or the onion ___? [en, 2 blank(s)] | one \| one (full) | — | — | — | — | false |
| g2u09.gi.one-ones.gf.006 | gap-fill | I like these peaches, but the ___ on that plate look nicer. [en, 1 blank(s)] | ones (full) | — | — | — | — | false |
| g2u09.gi.one-ones.gs.001 | group-sort | Put them into the one group or the ones group. [en] | — | — | — | — | one: the chocolate cake, the tomato soup, the cheese pizza \| ones: the green grapes, the red peppers, the small plums | false |
| g2u09.gi.one-ones.mc.001 | multiple-choice | Which pizza is yours? — The small ___, please. [en, 1 blank(s)] | one (full) | — | ones ; it ; that | — | — | false |
| g2u09.gi.one-ones.mc.002 | multiple-choice | I'd like two of those pears, please. — The green ___? [en, 1 blank(s)] | ones (full) | — | one ; them ; those | — | — | false |
| g2u09.gi.one-ones.mt.001 | matching | Match the cake and pizza replies. [en] | — | — | — | Which cake do you want? ↔ The chocolate one, please. ; Which pears do you want? ↔ The green ones, please. ; Which pizza is yours? ↔ The big one. ; Which glasses are for the soup? ↔ The small ones. | — | false |
| g2u09.gi.one-ones.qf.001 | question-formation | Ask your friend which cake they want. [en] | Which one do you want? (full) ; Which one would you like? (full) | — | — | — | — | false |
| g2u09.gi.one-ones.sb.001 | sentence-building | like / the / I / small / one [en] | I like the small one. (full) ; I like the small one (full) | — | — | — | — | false |
| g2u09.gi.one-ones.sb.002 | sentence-building | want / the / red / I / ones [en] | I want the red ones. (full) ; I want the red ones (full) | — | — | — | — | false |
| g2u09.gi.one-ones.tf.001 | transformation | I don't want the red tomato. I want the green tomato. (one) [en] | I don't want the red one. I want the green one. (full) | — | — | — | — | true |
| g2u09.gi.one-ones.tf.002 | transformation | Which glasses do you want? (the new …) [en] | I'd like the new ones. (full) ; The new ones. (full) | — | — | — | — | true |
| g2u09.gi.one-ones.tr.001 | translation | Welche Suppe möchtest du? — Die Tomatensuppe. [de] | Which soup do you want? — The tomato one. (full) ; Which soup would you like? — The tomato one. (full) ; Which soup do you want? The tomato one. (full) | deToEn | — | — | — | false |
| g2u09.gi.one-ones.tr.002 | translation | Ich mag die grünen nicht. Ich mag die roten. (Trauben) [de] | I don't like the green ones. I like the red ones. (full) ; I do not like the green ones. I like the red ones. (full) | deToEn | — | — | — | false |
| g2u09.gi.some-any.ag.003 | anagram | Dieses Wort sagt, dass ein bisschen von etwas da ist (auch bei Angeboten): "There are ___ plums." [de, 1 blank(s)] | some (full) | — | — | — | — | false |
| g2u09.gi.some-any.ag.004 | anagram | Dieses Wort verwendest du, wenn du fragst oder wenn etwas nicht da ist: "Are there ___ peaches?" [de, 1 blank(s)] | any (full) | — | — | — | — | false |
| g2u09.gi.some-any.cp.001 | context-picker | You look in the fridge for your dad. Tell him there are no pears. [en] | There aren't any pears in the fridge. (full) | — | There aren't some pears in the fridge. ; There are any pears in the fridge. ; There aren't no pears in the fridge. | — | — | false |
| g2u09.gi.some-any.ec.001 | error-correction | I don't have some money. [en] | I don't have any money. (full) ; any (partial) | — | — | — | — | true |
| g2u09.gi.some-any.ec.002 | error-correction | Would you like any tea? [en] | Would you like some tea? (full) ; some (partial) | — | — | — | — | true |
| g2u09.gi.some-any.ec.003 | error-correction | There's any cheese in the fridge. [en] | There's some cheese in the fridge. (full) ; There is some cheese in the fridge. (full) ; some (partial) | — | — | — | — | true |
| g2u09.gi.some-any.ff.001 | free-form | Your dad is making a salad. Look in the fridge and tell him what there is and what there isn't. [en] | There are some grapes, but there aren't any peaches. (full) ; There are some plums and some pears, but there aren't any strawberries. (full) ; There are some grapes. (partial) | — | — | — | — | false |
| g2u09.gi.some-any.gf.001 | gap-fill | There are ___ grapes in the fridge. [en, 1 blank(s)] | some (full) | — | — | — | — | false |
| g2u09.gi.some-any.gf.002 | gap-fill | We don't have ___ peaches. [en, 1 blank(s)] | any (full) | — | — | — | — | false |
| g2u09.gi.some-any.gf.003 | gap-fill | Are there ___ strawberries in the fridge? [en, 1 blank(s)] | any (full) | — | — | — | — | false |
| g2u09.gi.some-any.gf.004 | gap-fill | Would you like ___ cheesecake? [en, 1 blank(s)] | some (full) | — | — | — | — | false |
| g2u09.gi.some-any.gf.005 | gap-fill | There isn't ___ soup, but there is ___ stew. [en, 2 blank(s)] | any \| some (full) | — | — | — | — | false |
| g2u09.gi.some-any.gf.006 | gap-fill | Can I have ___ mineral water, please? — Sorry, there isn't ___ mineral water. [en, 2 blank(s)] | some \| any (full) | — | — | — | — | false |
| g2u09.gi.some-any.gs.001 | group-sort | Put them into the some group or the any group. [en] | — | — | — | — | some: There are ___ grapes., Would you like ___ cake?, Can I have ___ soup, please? \| any: Are there ___ pears?, We don't have ___ beef., There isn't ___ stew. | false |
| g2u09.gi.some-any.mc.001 | multiple-choice | There ___ some olives, but there aren't any mushrooms. [en, 1 blank(s)] | are (full) | — | is ; have ; has | — | — | false |
| g2u09.gi.some-any.mc.002 | multiple-choice | Offer your guest some soup. [en] | Would you like some soup? (full) | — | Would you like any soup? ; Do you like any soup? ; Would you like the some soup? | — | — | false |
| g2u09.gi.some-any.mt.002 | matching | Match the food and drink replies. [en] | — | — | — | Would you like some apple juice? ↔ Yes, please. I love it. ; Have you got any olives? ↔ No, sorry. There aren't any. ; Is there any cheesecake? ↔ Yes, there's some in the fridge. ; Can I have some mineral water? ↔ OK. Here you are. | — | false |
| g2u09.gi.some-any.qf.001 | question-formation | Ask if there is beef in the fridge. [en] | Is there any beef in the fridge? (full) | — | — | — | — | false |
| g2u09.gi.some-any.sb.001 | sentence-building | any / have / don't / I / pears [en] | I don't have any pears. (full) ; I don't have any pears (full) | — | — | — | — | false |
| g2u09.gi.some-any.sb.002 | sentence-building | some / there / strawberries / are [en] | There are some strawberries. (full) ; There are some strawberries (full) | — | — | — | — | false |
| g2u09.gi.some-any.tf.001 | transformation | Ask if there are any pancakes: 'There are some pancakes.' [en] | Are there any pancakes? (full) | — | — | — | — | true |
| g2u09.gi.some-any.tf.002 | transformation | Now there are no peppers: 'There are some peppers.' [en] | There aren't any peppers. (full) ; There are not any peppers. (full) | — | — | — | — | true |
| g2u09.gi.some-any.tr.002 | translation | Gibt es noch Trauben? — Nein, es gibt keine Trauben mehr. [de] | Are there any grapes? — No, there aren't any grapes. (full) ; Are there any grapes? No, there aren't any grapes. (full) ; Are there any grapes? — No, there aren't any. (full) | deToEn | — | — | — | false |
| g2u09.gi.some-any.tr.003 | translation | Möchtest du etwas Kuchen? [de] | Would you like some cake? (full) ; Do you want some cake? (full) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g2-u09/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u09",
  "lens": "answers",
  "itemsHash": "701ca1d81149",
  "promptHash": "70fa2d8cdf22",
  "round": 2,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 104, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
