# Vocab generation brief — g1-u07 (MORE! 1, Unit 7)

<!-- domigo:gen vocab g1-u07 bank=629dca6525cf prompt=346902f9f0f1 -->

<!-- domigo:prompt shared-rules v=1 -->
# Shared content rules (every generator and fixer reads these)

You are authoring practice items for Austrian AHS students (10–14, EFL, MORE! textbooks,
A1→A2). A broken item in front of a child is the failure that matters most. The v1 app
died on content quality — these rules are the law:

1. **The textbook is the source of truth.** Carrier sentences come from the textbook
   FIRST: the master list's example sentence (`exampleSb`), then a sentence from the
   SB/WB transcript (verbatim or minimally adapted), invention is the LAST resort.
   Record honestly in `sSource`/`sbRef`: `masterlist` | `sb` | `wb` | `invented`.
2. **The cumulative word bank is the level gate.** Every English word a student sees
   (carriers, definitions, distractors, options, pair sides, group members) must be
   taught at or below this unit — the brief lists the allowed vocabulary. Anything
   above level MUST carry an inline gloss recorded in the item's `gloss[]` array and
   appear in the text exactly as written. Glossing is the exception, not the routine:
   prefer rephrasing with taught words. A deterministic validator REJECTS any unglossed
   unknown token — do not gamble.
3. **Answer sets are forgiving and correct.** Accept EVERY variant that is correct in
   the sentence (tier `full`); near-synonyms / reasonable-but-imperfect alternatives go
   in as tier `partial`. Never demand a citation form that makes the sentence
   ungrammatical. Spelling tolerance (`close`) is computed by the grader — never author
   misspellings.
4. **German is informal du-form, always.** Never "Sie/Ihnen/Ihr" as address. Natural,
   age-appropriate German (Austrian standard; ß/ä/ö/ü correct — never ASCII "ue").
5. **Zero meta-talk in student-facing carriers.** No grammar terminology in prompts,
   carriers, answers, distractors, options ("past simple", "modal verb", …) — the task
   shows, it never lectures. Instruction text lives in the renderer, NOT in your prompt
   text. EXCEPTION: `hintDe`/`explainDe` MAY use the light German grammar vocabulary the
   textbook itself uses (Grundform, Vergangenheit, Verneinung …) — English grammar
   jargon is banned even there.
6. **v1 seeds are UNTRUSTED.** The brief includes v1 items as idea material. Known v1
   defect classes: invented above-level carrier words, out-of-bank MC distractors,
   over-strict answer sets, meta-talk. Mine them; never copy unverified.
7. **Distractors are real words from the bank**, plausible but unambiguously wrong in
   context, never lemma-variants of an accepted answer.
8. **Pairs and groups are English↔English** (sentence halves, question↔answer,
   category sorting). German belongs in translation surfaces only.
9. **Difficulty is honest:** 1 = recognition/single-token, 2 = guided production,
   3 = free production / multi-step. Spread items across difficulties.
10. **Blanks** are `___` (3+ underscores). Multi-blank answers join per-blank fills
    with ` | ` in blank order.

<!-- domigo:prompt gen-vocab v=1 -->
# Vocab item generation

Produce EXACTLY ONE vocab item per word-bank entry listed in the brief (no more, no
fewer). Each item exercises one word across all its surfaces:

- `d` — an English definition in taught-only words that does NOT contain the headword
  or any inflection of it. Simple, concrete, age-appropriate.
- `s` — the carrier sentence with exactly one `___` blank where the headword (or one of
  its forms) fits. Textbook sentences first (rule 1). The sentence must make the word
  unambiguous (a sentence where five other bank words also fit is a bad carrier).
- `sAnswers` — every form of the headword that is correct in the blank (tier full);
  defensible alternatives as partial. The blank-substituted sentence must be
  grammatical for every full answer (watch a/an, singular/plural, capitalization).
- `dAnswers` — accepted answers when the student produces the word from the definition
  (headword + natural variants).
- `translation.deToEn` — the German prompt is the bank's German; answers = every correct
  English rendering (full) + near-misses (partial).
- `translation.enToDe` — answers = every natural German rendering (full) + acceptable
  variants (partial). Both directions must be INDEPENDENTLY correct.
- `mc` — exactly 3 distractors, in-bank, same word class where possible, plausible but
  clearly wrong for the definition/sentence.
- `gameMeta.distractorPool` — ≥4 in-bank wrong options for game encounters (may extend
  `mc`); `chipBudget` null unless chip-input makes sense; `minOptions` 4.
- `hintDe` — one short du-form German nudge (meaning hint, not the answer).
- `gloss` — ONLY if the carrier/definition truly needs an above-level word (rule 2).
- `difficulty` — 1–3 honestly (frequency + abstractness + production load).

Quality bar: a teacher reading any single item should find nothing to fix.

## Word bank (one item per row — this is your work list)

| id | en | de | kind | theme | exampleSb | cf | forms |
|---|---|---|---|---|---|---|---|
| g1u07.w.ice-cream | ice cream | Eis ; Eiscreme | wordfile | — | — | — | ice cream |
| g1u07.w.chillies | chillies | Chilischoten | wordfile | — | — | — | chillies |
| g1u07.w.fish | fish | Fisch | wordfile | — | — | — | fish |
| g1u07.w.chicken | chicken | Huhn ; Hühnchen | wordfile | — | — | — | chicken |
| g1u07.w.milk | milk | Milch | wordfile | — | — | — | milk |
| g1u07.w.butter | butter | Butter | wordfile | — | — | — | butter |
| g1u07.w.cheese | cheese | Käse | wordfile | — | — | — | cheese |
| g1u07.w.orange-juice | orange juice | Orangensaft | wordfile | — | — | — | orange juice |
| g1u07.w.tea | tea | Tee | wordfile | — | — | — | tea |
| g1u07.w.cucumber | cucumber | Gurke | wordfile | — | — | — | cucumber |
| g1u07.w.sausages | sausages | Würstchen | wordfile | — | — | — | sausages |
| g1u07.w.beans | beans | Bohnen | wordfile | — | — | — | beans |
| g1u07.w.broccoli | broccoli | Brokkoli | wordfile | — | — | — | broccoli |
| g1u07.w.carrot | carrot | Karotte ; Möhre | wordfile | — | — | — | carrot |
| g1u07.w.onion | onion | Zwiebel | wordfile | — | — | — | onion |
| g1u07.w.peas | peas | Erbsen | wordfile | — | — | — | peas |
| g1u07.w.an-apple | an apple | ein Apfel | wordfile | — | — | — | an apple |
| g1u07.w.mineral-water | mineral water | Mineralwasser | wordfile | — | — | — | mineral water |
| g1u07.w.grapes | grapes | Weintrauben | wordfile | — | — | — | grapes |
| g1u07.w.an-orange | an orange | eine Orange | wordfile | — | — | — | an orange |
| g1u07.w.tomato | tomato (pl tomatoes) | Tomate (pl Tomaten) | wordfile | — | — | — | tomato ; tomatoes |
| g1u07.w.red-pepper | red pepper | rote Paprika | wordfile | — | — | — | red pepper |
| g1u07.w.kiwi | kiwi | Kiwi | wordfile | — | — | — | kiwi |
| g1u07.w.spinach | spinach | Spinat | wordfile | — | — | — | spinach |
| g1u07.w.strawberry | strawberry | Erdbeere | wordfile | — | — | — | strawberry |
| g1u07.w.sugar | sugar | Zucker | wordfile | — | — | — | sugar |
| g1u07.w.bread | bread | Brot | wordfile | — | — | — | bread |
| g1u07.w.rice | rice | Reis | wordfile | — | — | — | rice |
| g1u07.w.egg | egg | Ei | wordfile | — | — | — | egg |
| g1u07.w.pasta | pasta | Nudeln ; Pasta | wordfile | — | — | — | pasta |
| g1u07.w.pizza | pizza | Pizza | wordfile | — | — | — | pizza |
| g1u07.w.fries | fries | Pommes frites | wordfile | — | — | — | fries |
| g1u07.w.chips | chips | Chips | wordfile | — | — | — | chips |
| g1u07.w.hamburger | hamburger | Hamburger | wordfile | — | — | — | hamburger |
| g1u07.w.chocolate | chocolate | Schokolade | wordfile | — | — | — | chocolate |
| g1u07.w.cake | cake | Kuchen | wordfile | — | — | — | cake |
| g1u07.w.breakfast | breakfast | Frühstück | wordfile | — | — | — | breakfast |
| g1u07.w.lunch | lunch | Mittagessen | wordfile | — | — | — | lunch |
| g1u07.w.dinner | dinner | Abendessen | wordfile | — | — | — | dinner |
| g1u07.w.restaurant | restaurant | Restaurant | wordfile | — | — | — | restaurant |
| g1u07.w.always | always | immer | wordfile | — | — | — | always |
| g1u07.w.usually | usually | normalerweise ; gewöhnlich | wordfile | — | — | — | usually |
| g1u07.w.often | often | oft | wordfile | — | — | — | often |
| g1u07.w.sometimes | sometimes | manchmal | wordfile | — | — | — | sometimes |
| g1u07.w.never | never | nie ; niemals | wordfile | — | — | — | never |
| g1u07.w.meat | meat | Fleisch | phrase | — | I am vegetarian. I never eat meat. | — | meat |
| g1u07.w.ham | ham | Schinken | phrase | — | On the weekend, I sometimes have ham and eggs for breakfast. | — | ham |
| g1u07.w.healthy | healthy | gesund | phrase | — | A lot of junk food isn't healthy. | — | healthy |
| g1u07.w.to-like | to like | mögen | phrase | — | I like orange juice. | like | to like ; like |
| g1u07.w.that-s-nice | That's nice. | Das ist nett. | phrase | — | — | — | That's nice. |
| g1u07.w.any | any | irgendwelche | phrase | — | Have you got any tomatoes? | — | any |
| g1u07.w.to-drink | to drink | trinken | phrase | — | Would you like something to drink? | drink | to drink ; drink |
| g1u07.w.to-make | to make | machen ; zubereiten | phrase | — | I want to make a salad. | make | to make ; make |
| g1u07.w.money | money | Geld | phrase | — | How much money have you got? | — | money |
| g1u07.w.sandwich | sandwich | Sandwich ; belegtes Brot | phrase | — | I have a cheese sandwich for lunch. | — | sandwich |
| g1u07.w.some | some | etwas ; einige | phrase | — | I need some cheese. | — | some |
| g1u07.w.vegetable | vegetable | Gemüse | phrase | — | Broccoli is a green vegetable. | — | vegetable |
| g1u07.w.waiter | waiter | Kellner/Kellnerin | phrase | — | The waiter brings the food. | — | waiter |
| g1u07.w.have-you-got | Have you got …? | Hast du / Habt ihr / Haben Sie ...? | phrase | — | Have you got any chips? | — | Have you got …? |
| g1u07.w.i-ve-got | I've got … | Ich habe … | phrase | — | Yes, I've got four bags of chips. | — | I've got … |
| g1u07.w.junk-food | junk food | Junk Food | phrase | — | Junk food is not good for you. | — | junk food |
| g1u07.w.menu | menu | Speisekarte | phrase | — | Can I have the menu, please? | — | menu |
| g1u07.w.mum | Mum | Mama | phrase | — | My mum makes breakfast. | — | Mum |
| g1u07.w.plate | plate | Teller | phrase | — | Can I have a clean plate? | — | plate |
| g1u07.w.salad | salad | Salat | phrase | — | I want a salad. | — | salad |
| g1u07.w.soup | soup | Suppe | phrase | — | Can I have a soup, please? | — | soup |
| g1u07.w.glass | glass | Glas | phrase | — | Would you like a glass of juice? | — | glass |

### Allowed vocabulary (the deterministic level gate enforces exactly this)

Cumulative bank — every headword below (plus its inflections and listed forms) is taught:

- **g1-u01**: sound system, projector, board, window, door, desk, scissors, ruler, tablet, chair, school bag, pen, exercise book, pencil case, pencil, rubber, book, hairband, sunglasses, hat, school tie, shirt, sweater, skirt, socks, shoe, to give, time, to understand, to write, to enjoy, to listen, to love, more, to read, their, to ask, (email) address, How are you?, I am (= I'm) fine., to meet, then, your, to look, or, to eat, to go, must, how many, to hate, here, it, Let's …, midnight, our, favourite, to find, light, child, to clean, to close, to open, picture, to sit down, to speak, to stand up, to take out, class
- **g1-u02**: tree, monkey, parrot, giraffe, train, penguin, guide, lion, next to, in, behind, under, on, in front of, zoo, beautiful, behind, big, in front of, next to, under, where, small, adult, at, to bring, but, child (pl children), dog, family, free, Grandma, group, long, ticket, to want, from, year, he, she, to talk, they, we, for, happy, to let somebody out, us, car, At last., How strange!, Let me see., stone
- **g1-u03**: finger, ear, nose, hair, eye, mouth, beard, right arm, left arm, shoulder, leg, foot, feet, tooth, teeth, tall, short, big, small, long, also, famous, him, his, ship, to be scared (of), strong, captain, have got / has got, pretty, purple, week, again, back, to paint, sister, boy, girl, man (pl men), woman (pl women), Her name is …, His name is …
- **g1-u04**: cold, angry, happy, scared, excited, hot, bored, sad, hungry, nervous, tired, proud, morning, lunchtime, afternoon, evening, night, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, after, day, end, fun, Go away!, to happen, show, a day in the life of, to be asleep, early, life, still, story, today, Are you OK?, homework (no pl), into, Oh dear!, room, bad, Don't be late., tomorrow, birthday, friend, Be yourself., no one else, bottle, to get back, mad, magic, to break, to go to sleep, because, It's me., Try it!, Let go!, What's happening?
- **g1-u05**: keyboard player, keyboard, singer, drummer, drums, saxophone player, saxophone, guitarist, guitar, boyfriend, its, to play, sister, can, cannot / can't, concert, to dance, Don't worry., job, perfect, to carry, to stand on, tongue, to touch, to walk on, to wiggle, can, to drink, hundred, in one go, Is that so?, This is me., economy, hospital, to laugh, (pocket) money, pound, profit, school canteen, table, teacher, uncle, to wash, nothing, Sorry?
- **g1-u06**: city, park, street, market, supermarket, river, woods, tree, to jump into the river, to look out the window, to pick something up, to sit in a tree, to fall out of the tree, to bump into a tree, to go to the park, to pull, to climb up a tree, to leave the office, to look in the mirror, to climb, to jump, to leave, mirror, to put on, away, (world's) best, detective, Help me!, office, to run, to find, to pull, to catch, clever, to come to, to live, nice, a lot of / lots of, to call, Come on!, to solve, to wait, to watch, street, to get up, to become, But it's true!, Go on., Well done.
- **g1-u07**: ice cream, chillies, fish, chicken, milk, butter, cheese, orange juice, tea, cucumber, sausages, beans, broccoli, carrot, onion, peas, an apple, mineral water, grapes, an orange, tomato (pl tomatoes), red pepper, kiwi, spinach, strawberry, sugar, bread, rice, egg, pasta, pizza, fries, chips, hamburger, chocolate, cake, breakfast, lunch, dinner, restaurant, always, usually, often, sometimes, never, meat, ham, healthy, to like, That's nice., any, to drink, to make, money, sandwich, some, vegetable, waiter, Have you got …?, I've got …, junk food, menu, Mum, plate, salad, soup, glass

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Annie, Arbeit, Articles, Bacon, Baker, Befehlsformen, Betty, Bild, Bilder, Blackbeard, Blackie, Bob, Box, Buckingham, Buddy, Burgers, California, Cambridge, Caribbean, Carina, Carl, Chloe, Christie, Classroom, Clown, Dan, Dana, Daniel, Dave, David, Davis, Dialog, Dialoge, Doctor, Doctors, Don, Ellie, England, English, False, Fido, Food, Frank, Fred, Freddy, George, Georgia, Gina, Good, Gordon, Great, Grey, Greybeard, Groans, Guess, Harry, Hmm, Holmes, Homework, Hook, Imperatives, Irregular, Jack, Jacob, James, Jamie, Jenny, Jessica, Jill, Julia, Jun, Kitty, Leah, Leo, Lethabo, Lewis, London, Lucy, Mail, Manchester, Mark, Marple, Mary, Mike, Miss, Mr, Mum, Nibbs, Nice, Nomen, Number, Numbers, Omar, Palace, Pardon, Paws, Pete, Peter, Pirates, Plural, Polly, Possessives, Prepositions, Present, Project, Put, Rajit, Red, Reihenfolge, Richard, Ronald, Sally, Saying, School, Sherlock, Steve, Sue, Tamar, Tamara, Text, Tick, Toby, Tock, Tom, True, Watson, Welcome, Well, Work, Wortes, Would, Wow, Yeah, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## v1 seeds (UNTRUSTED — mine for ideas, never copy unverified)

Known v1 defect classes: invented above-level carrier words, out-of-bank MC distractors, over-strict answers.

- `g1u07.w.ice-cream` ← v1 `ice cream`: d="a cold, sweet food made from milk" · s="On hot summer days, I love to eat strawberry _____ that is cold and melts in my mouth." · a=[] · mc=["bread","rice","soup"]
- `g1u07.w.chillies` ← v1 `chillies`: d="small, very hot red or green vegetables" · s="This soup is very spicy and burns my tongue because it has red _____ in it." · a=["chilis","chilies"] · mc=["sugar","salt","honey"]
- `g1u07.w.fish` ← v1 `fish`: d="an animal that lives in water" · s="We bought fresh _____ with silver scales and a tail at the seafood market today for dinner." · a=[] · mc=["apples","bread","cheese"]
- `g1u07.w.chicken` ← v1 `chicken`: d="a bird people keep for eggs and meat" · s="Mum is roasting a whole _____ with its wings and legs in the oven with rice for dinner tonight." · a=[] · mc=["carrot","banana","cabbage"]
- `g1u07.w.milk` ← v1 `milk`: d="a white drink from cows" · s="I pour cold white _____ from the carton over my cereal every morning before school." · a=[] · mc=["juice","cola","tea"]
- `g1u07.w.butter` ← v1 `butter`: d="a yellow food made from milk" · s="Please spread some soft yellow _____ on both sides of my bread slices." · a=[] · mc=["water","salt","sugar"]
- `g1u07.w.cheese` ← v1 `cheese`: d="a yellow food made from milk" · s="I like melted _____ on my pizza. It comes from cow's milk and is yellow." · a=[] · mc=["tomato","mushroom","pineapple"]
- `g1u07.w.orange-juice` ← v1 `orange juice`: d="a drink made from oranges" · s="Can I have a big glass of freshly squeezed _____ from real oranges, please?" · a=[] · mc=["water","milk","tea"]
- `g1u07.w.tea` ← v1 `tea`: d="a hot drink made with leaves and water" · s="My grandma drinks a hot cup of _____ with two spoons of sugar every afternoon at 4 o'clock." · a=[] · mc=["cola","beer","ice cream"]
- `g1u07.w.cucumber` ← v1 `cucumber`: d="a long, green vegetable" · s="I put thin slices of long green _____ in my salad because they are fresh and crunchy." · a=[] · mc=["onion","potato","mushroom"]
- `g1u07.w.sausages` ← v1 `sausages`: d="meat in a long, thin shape" · s="We grill long brown _____ on the barbecue in summer and eat them with mustard." · a=[] · mc=["eggs","apples","cheese"]
- `g1u07.w.beans` ← v1 `beans`: d="small seeds you can cook and eat" · s="For breakfast in England, she has toast and _____ in tomato sauce." · a=[] · mc=["yoghurt","cereal","fruit"]
- `g1u07.w.broccoli` ← v1 `broccoli`: d="a small green vegetable like a tree" · s="Mum says I must eat my _____ — the little green trees on my plate — because they are healthy." · a=[] · mc=["tomatoes","potatoes","corn"]
- `g1u07.w.carrot` ← v1 `carrot`: d="a long, orange vegetable" · s="The grey rabbit is eating a big orange _____ from the garden with its long front teeth." · a=[] · mc=["banana","grape","lettuce"]
- `g1u07.w.onion` ← v1 `onion`: d="a round vegetable that can make you cry" · s="Cutting a brown _____ in the kitchen always makes my eyes water and sting." · a=[] · mc=["apple","pear","strawberry"]
- `g1u07.w.peas` ← v1 `peas`: d="small, round, green vegetables" · s="The small round green _____ in my soup are nice and sweet." · a=[] · mc=["raisins","blueberries","olives"]
- `g1u07.w.an-apple` ← v1 `apple`: d="a round red or green fruit" · s="I always take a shiny red _____ to school in my lunch box for a healthy snack." · a=[] · mc=["carrot","cheese","egg"]
- `g1u07.w.mineral-water` ← v1 `mineral water`: d="water with bubbles from a bottle" · s="Can I have a bottle of cold _____ with no sugar and lots of bubbles, please?" · a=[] · mc=["lemonade","juice","milkshake"]
- `g1u07.w.grapes` ← v1 `grapes`: d="small round fruits that grow together" · s="I bought a bunch of red and green _____ at the shop. They grow on vines." · a=[] · mc=["bananas","watermelons","oranges"]
- `g1u07.w.an-orange` ← v1 `orange`: d="a round juicy fruit with thick peel, eaten in segments" · s="She peels the skin off a juicy _____ and eats the segments for lunch." · a=[] · mc=["potato","onion","mushroom"]
- `g1u07.w.tomato` ← v1 `tomato`: d="a soft, round, red fruit" · s="I need one red round _____ for the green salad. It grows on a plant." · a=[] · mc=["carrot","potato","cabbage"]
- `g1u07.w.red-pepper` ← v1 `red pepper`: d="a red vegetable with seeds inside" · s="I cut a crunchy _____ into thin strips and put them in the salad." · a=[] · mc=["cabbage","bread","cheese"]
- `g1u07.w.kiwi` ← v1 `kiwi`: d="a small brown fruit, green inside" · s="The _____ fruit is brown and fuzzy on the outside, but soft and bright green with black seeds inside." · a=[] · mc=["apple","banana","lemon"]
- `g1u07.w.spinach` ← v1 `spinach`: d="a vegetable with dark green leaves" · s="Mum makes a healthy smoothie with banana, milk and dark green _____ leaves." · a=[] · mc=["chocolate","sugar","flour"]
- `g1u07.w.strawberry` ← v1 `strawberry`: d="a small, red, sweet fruit" · s="I pick one red heart-shaped _____ with small seeds from the garden." · a=[] · mc=["apple","orange","banana"]
- `g1u07.w.sugar` ← v1 `sugar`: d="a sweet white powder for food and drinks" · s="Do you want one or two spoons of white _____ in your bitter tea to make it sweet?" · a=[] · mc=["salt","butter","milk"]
- `g1u07.w.bread` ← v1 `bread`: d="a basic food made from flour and water" · s="We need to buy a loaf of fresh _____ from the bakery for our ham sandwiches." · a=[] · mc=["milk","juice","water"]
- `g1u07.w.rice` ← v1 `rice`: d="small white or brown grains you cook" · s="In Asia, people eat small white _____ grains every day with vegetables and meat." · a=[] · mc=["potatoes","bread","cheese"]
- `g1u07.w.egg` ← v1 `egg`: d="an oval thing that comes from a chicken" · s="I have a soft-boiled _____ in a cup with some soldiers of toast for breakfast." · a=[] · mc=["banana","carrot","tomato"]
- `g1u07.w.pasta` ← v1 `pasta`: d="a food made from flour, like spaghetti" · s="We cook long _____ noodles in boiling water and serve them with tomato sauce." · a=[] · mc=["bread","rice","cheese"]
- `g1u07.w.pizza` ← v1 `pizza`: d="a flat, round food with cheese on top" · s="Let's order a big round Italian _____ with melted mozzarella cheese and tomato sauce." · a=[] · mc=["sandwich","salad","soup"]
- `g1u07.w.fries` ← v1 `fries`: d="long pieces of potato cooked in oil" · s="I always order hot salty _____ with ketchup as a side with my hamburger." · a=["french fries"] · mc=["soup","salad","ice cream"]
- `g1u07.w.chips` ← v1 `chips`: d="thin pieces of potato you eat as a snack" · s="We ate _____ with our fish for dinner." · a=["crisps"] · mc=["eggs","apples","carrots"]
- `g1u07.w.hamburger` ← v1 `hamburger`: d="meat in a round bread roll" · s="I want a juicy _____ — beef patty between two bread buns — with cheese, please." · a=["burger"] · mc=["sandwich","sausage","egg"]
- `g1u07.w.chocolate` ← v1 `chocolate`: d="a sweet brown food made from cocoa" · s="She got a big box of dark and milk _____ for her birthday. It is brown and sweet." · a=[] · mc=["bread","cheese","butter"]
- `g1u07.w.cake` ← v1 `cake`: d="a sweet food you bake for birthdays" · s="Mum makes a big round birthday _____ with strawberries and whipped cream on top." · a=[] · mc=["sandwich","pizza","salad"]
- `g1u07.w.breakfast` ← v1 `breakfast`: d="the first meal of the day" · s="I have scrambled eggs and buttered toast for _____ every morning at 7am before school." · a=[] · mc=["dinner","supper","bedtime snack"]
- `g1u07.w.lunch` ← v1 `lunch`: d="the meal you eat in the middle of the day" · s="At school, we eat our _____ in the canteen at twelve o'clock during the midday break." · a=[] · mc=["breakfast","midnight snack","bedtime snack"]
- `g1u07.w.dinner` ← v1 `dinner`: d="the meal you eat in the evening" · s="The whole family sits down together at the big table and eats _____ at seven in the evening." · a=[] · mc=["breakfast","morning snack","midnight feast"]
- `g1u07.w.restaurant` ← v1 `restaurant`: d="a place where you go to eat food" · s="We go to an Italian _____ called 'La Pasta' on Friday evenings to eat pizza with waiters serving us." · a=[] · mc=["school canteen","kitchen","supermarket"]
- `g1u07.w.always` ← v1 `always`: d="at all times, every time" · s="She _____ brushes her teeth before bed every single night without fail." · a=[] · mc=["never","hardly ever","rarely"]
- `g1u07.w.usually` ← v1 `usually`: d="most of the time, almost always" · s="I _____ walk to school because it's close, but today is raining, so I am taking the bus." · a=[] · mc=["rarely","never","once"]
- `g1u07.w.often` ← v1 `often`: d="many times" · s="We _____ play football after school — about three or four times every week." · a=[] · mc=["rarely","never","once a year"]
- `g1u07.w.sometimes` ← v1 `sometimes`: d="not always, but now and then" · s="I _____ eat pizza — maybe once a month — but not every week." · a=[] · mc=["always","every day","never"]
- `g1u07.w.never` ← v1 `never`: d="not at any time" · s="He _____ eats any vegetables at all; he hates them and pushes them off his plate." · a=[] · mc=["always","usually","often"]
- `g1u07.w.meat` ← v1 `meat`: d="food from animals like cows or pigs" · s="She does not eat any _____ from animals because she is vegetarian — no chicken, beef, or pork." · a=[] · mc=["bread","fruit","rice"]
- `g1u07.w.ham` ← v1 `ham`: d="pink meat from a pig" · s="I want a _____ and cheese sandwich, please — pink pork slices in the middle of the bread." · a=[] · mc=["fish","egg","jam"]
- `g1u07.w.healthy` ← v1 `healthy`: d="good for your body" · s="Fresh fruit and green vegetables are very _____ for your body. They give you vitamins and fibre." · a=[] · mc=["unhealthy","rotten","poisonous"]
- `g1u07.w.to-like` ← v1 `to like`: d="to enjoy something, to think it is good" · s="I _____ bananas very much and eat one every day, but I hate sour apples." · a=[] · mc=["to hate","to refuse","to avoid"]
- `g1u07.w.that-s-nice` ← v1 `That's nice.`: d="a friendly reply to good news" · s="I got a new puppy for my birthday. — _____ I am happy for you!" · a=[] · mc=["That's terrible.","That's sad.","That's boring."]
- `g1u07.w.any` ← v1 `any`: d="some, used in questions and negatives" · s="Have we got _____ eggs in the fridge? I want to make an omelette for breakfast." · a=[] · mc=["no","every","one"]
- `g1u07.w.to-make` ← v1 `to make`: d="to create or prepare something" · s="Can you help me _____ a cheese and ham sandwich by putting the slices between the bread?" · a=[] · mc=["to eat","to buy","to steal"]
- `g1u07.w.money` ← v1 `money`: d="what you use to buy things" · s="I don't have enough _____ — only one euro — to buy the chocolate cake that costs five euros." · a=[] · mc=["time","friends","space"]
- `g1u07.w.sandwich` ← v1 `sandwich`: d="bread with food between two pieces" · s="I packed a ham and cheese _____ — two slices of bread with a filling in the middle — for lunch." · a=[] · mc=["soup","ice cream","salad"]
- `g1u07.w.some` ← v1 `some`: d="a few, a little, not none" · s="Can I have _____ milk in my tea, please? Just a little bit is enough." · a=[] · mc=["none","no","much"]
- `g1u07.w.vegetable` ← v1 `vegetable`: d="a plant you can eat, like a carrot" · s="My favourite red _____ is the tomato. I eat it in my salad." · a=[] · mc=["fruit","meat","dessert"]
- `g1u07.w.waiter` ← v1 `waiter`: d="a person who brings food in a restaurant" · s="The _____ at the restaurant wrote down our order and brought us the menu." · a=["waitress"] · mc=["cook","customer","farmer"]
- `g1u07.w.have-you-got` ← v1 `Have you got ...?`: d="a question to ask if someone has something" · s="_____ any orange juice left in the bottle? I would like a glass." · a=[] · mc=["Do you eat ...?","Can I have ...?","Would you like ...?"]
- `g1u07.w.i-ve-got` ← v1 `I've got ...`: d="I have something" · s="_____ two red apples and one banana in my school bag for a snack later." · a=[] · mc=["I want ...","I need ...","I hate ..."]
- `g1u07.w.junk-food` ← v1 `junk food`: d="food that is not good for your body" · s="Hamburgers, pizza and chips are unhealthy _____. They are tasty but bad for you." · a=[] · mc=["health food","organic food","fresh fruit"]
- `g1u07.w.menu` ← v1 `menu`: d="a list of food in a restaurant" · s="Let's look at the _____ that lists all the dishes and their prices, and choose what to eat." · a=[] · mc=["map","schedule","receipt"]
- `g1u07.w.mum` ← v1 `Mum`: d="a word for your mother" · s="_____ is cooking hot tomato soup for lunch in the kitchen. She is my mother." · a=["mum","Mom","mom"] · mc=["My teacher","The shopkeeper","A stranger"]
- `g1u07.w.plate` ← v1 `plate`: d="a flat, round thing you put food on" · s="He puts the hot pasta with tomato sauce on a big white _____ and eats it with a fork." · a=[] · mc=["glass","bottle","spoon"]
- `g1u07.w.salad` ← v1 `salad`: d="a cold dish of vegetables or fruit" · s="I eat a healthy green _____ bowl with lettuce, tomatoes and cucumber for a light lunch." · a=[] · mc=["pizza","sandwich","cake"]
- `g1u07.w.soup` ← v1 `soup`: d="a hot liquid food you eat with a spoon" · s="When it is very cold outside, I like a bowl of hot tomato _____ with a spoon and some bread." · a=[] · mc=["ice cream","cake","chocolate"]
- `g1u07.w.glass` ← v1 `glass`: d="a clear, hard cup you drink water from" · s="Can I have a clean _____ of cold water, please? Something I can drink from." · a=[] · mc=["plate","bowl","fork"]

## Unit transcripts (textbook sentences live here — use them first)

```
----- SB: SB Unit 7- I love noodles.txt -----
Page 52
Unit 7: I love noodles
At the end of unit 7 ...
you know ☐ 17 words for food ☐ how to use the present simple negative ☐ how to use the articles a and an ☐ how to use adverbs of frequency
you can ☐ say what food you and your family like or don't like ☐ say what food is healthy / not so healthy ☐ talk and write about your eating habits ☐ understand what other children around the world like or don't like ☐ understand a short sketch ☐ write an email
VOCABULARY Food
2/20 🔊 1 Listen. Then number the words.
☐ ham ☐ an apple ☐ an egg ☐ an orange ☐ cheese ☐ grapes ☐ brown bread ☐ nuts ☐ fish ☐ mineral water ☐ cucumbers ☐ ice cream ☐ red peppers ☐ meat ☐ sausages ☐ pumpkin ☐ milk ☐ corn
[Image description: 18 numbered food items including bread, carrots, cheese, egg, orange, glass of water, grapes, ice cream, fish, cucumber, nuts, red pepper, meat, apple, milk, pumpkin, lemon, meat, and corn]
SPEAKING Saying what you (don't) like / Saying what food is (not) healthy
👥 2 Work in groups. Say five things that are true for you.
I like orange juice. I don't like milk. Nuts are healthy. Sausages are not so healthy.
[Image description: Photo of students working together]
I like ... I don't like ... ... is/are healthy. ... is/are not so healthy.
SOUNDS RIGHT /t∫/
2/21 🔊 3 A chant. Listen and repeat.
Chicken, chicken, Lots of chicken, eggs and cheese. lots of cheese, Some more rice? and some rice. Oh, yes, please! Oh, that's nice!
[Image description: Cartoon of characters running with food]
🔵 WB p. 58, 59 🌐 CYBER Homework 19 (Revision)
Page 53
READING
4 Read about the children.
Kids around the world
[Image description: Three sections with photos and text about children from different countries]
⏵ I'm Linh.
I live in Saigon in Vietnam. In my family we often eat rice and noodles.
I really like noodles. In the morning, we usually have a soup with meat and noodles. My mum and my dad always put extra chillies into the soup, but I don't like chillies.
I love spring rolls*. You take rice paper and put meat or fish and vegetables on the rice paper. Then you roll it. I always put fish sauce on it. I love fish sauce.
For dessert I like rice pudding*. We also have a lot of fruit. My favourite fruit is papaya.
We all usually eat with chopsticks* – but not the rice pudding.
[Image description: Photo of spring rolls with sauce]
⏵ I'm Lethabo.
I live in Cape Town in South Africa. In our family meat is very important. My favourite is a sausage. We all like it, only my sister doesn't – she's a vegetarian. She never eats meat or sausages. She loves animals and she says it's bad for the climate to eat meat. She really likes pumpkins. And sometimes she eats a vegetable curry (when we have a fish or meat curry).
In the morning, we usually have tea and corn bread. My grandparents live in the country and they eat a lot of corn.
We sometimes have stew* and rice, and we often have meat. My family often comes together and grills lots of meat and sausages – and vegetables for my sister. There is music and food and we have a lot of fun.
[Image description: Photo of grilled meat and corn]
⏵ I'm Tamar.
I'm from Batumi in Georgia. For breakfast we often have bread and eggs and tomatoes – and bread, of course. My brother and I usually get up and buy the bread. It's still warm when we eat it.
For lunch or dinner we have soups, stews and kebabs and a lot of rice and potatoes. We also have very good salads and we like walnuts on a lot of our food. They're good for you.
We always drink tea.
My favourite food is bread with cheese in it. You can also put an egg on it. It's fantastic!
[Image description: Photo of cheese bread with egg]
VOCABULARY: *spring roll – Frühlingsrolle; rice pudding – Milchreis; chopstick – Essstäbchen; climate – Klima; stew – Eintopf
5 How many of these tasks can you do?
1 Linh likes / doesn't like chillies. 2 Linh always / sometimes puts fish sauce on her spring roll. 3 Linh uses chopsticks for most* / all meals. 4 Lethabo often eats vegetable curry. T / F 5 Lethabo has tea with corn bread. T / F 6 Lethabo's family enjoys music with their food. T / F 7 In the morning, Tamar and her brother often .................................................................................. . 8 Tamar says that salads in Georgia .................................................................................................. . 9 Tamar loves ........................................................................................................... very much.
VOCABULARY: *most – die meisten
6 Check your answers with a partner.
🔵 WB p. 63
Page 54
SPEAKING Talking about food and eating habits
2/22 🔊 7 Listen and complete the sentences with the words from the box.
always usually often sometimes never
[Image description: Four photos of people with speech bubbles containing sentences about eating habits]
I ¹................................. drink tea for breakfast. I ².................................. have soup for lunch.
I ³................................. drink milk. I ⁴.................................. have an egg for breakfast.
I ⁵.................................. eat rice and curry. We ⁶................................. have a pizza for lunch or dinner.
We ⁷................................. have fish on Friday. I ⁸.................................. have cereal* and an apple for breakfast.
VOCABULARY: *cereal – Müsli
👤 8 Say five sentences that are true for you. Write them down.
[Image description: Photo of a smiling person in kitchen]
I never eat rice and curry.
Note You can say: I sometimes drink milk for breakfast. I often eat cheese for lunch. Or: I sometimes have milk for breakfast. I often have cheese for lunch.
LISTENING & SPEAKING Saying what people like / don't like
2/23 🔊 9 Listen and tick. Then say four sentences about Kate and Mark.
👤
[Image description: Two profile cards]
Kate likes doesn't like ☐ apples ☐ apples ☐ oranges ☐ oranges ☐ bananas ☐ bananas ☐ kiwis ☐ kiwis
Mark likes doesn't like ☐ hamburgers ☐ hamburgers ☐ rice ☐ rice ☐ pizza ☐ pizza ☐ noodles ☐ noodles
🔵 WB p. 60, 61, 62 🌐 CYBER Homework 20
Page 55
👤 10 Look at the picture and say three things people in your family like and three things they don't like.
[Image description: Illustration of a vegetable market with labeled sections for SPINACH, ONIONS, TOMATOES, CARROTS, POTATOES, BROCCOLI, PEPPERS, PEAS, and BEANS. Two shoppers are shown with speech bubbles]
My mum/dad/sister/brother ... My best friend ...
My mum likes potatoes, but she doesn't like broccoli.
My mum likes carrots, but she doesn't like beans.
11 Two puzzles. Read and think. Find out why they like the food.
Nella
What they LIKE ☺ and DON'T LIKE ☹
Nella likes apples, but she doesn't like oranges. She likes cheese, but she doesn't like milk. She likes eggs, but she doesn't like chicken. She likes peppers, but she doesn't like cucumbers. She likes carrots, but she doesn't like tomatoes. She likes noodles, but she doesn't like rice. She likes spaghetti, but she doesn't like bread.
[Image description: Photos of orange, cucumber, carrots, and noodles]
Shu-hui
Shu-hui likes fish sauce, but he doesn't like fish. He likes spring rolls, but he doesn't like meat. He likes mineral water, but he doesn't like tea. He likes red peppers, but he doesn't like carrots. He likes brown bread, but he doesn't like cheese. He likes ice cream, but he doesn't like oranges.
[Image description: Photos of spring rolls, red pepper, bread, and ice cream sundae]
12 Work in pairs. Write your own puzzle. Then present your puzzle to another pair.
🔵 WB p. 60
Page 56
TIME FOR A SKETCH Burgers
2/24 🔊 13 Listen and complete the sketch with the words from the box.
funny really hungry week vegetable chips
Scene 1
Oliver Boy, I'm so ¹.............................. . Mary Yes, me too. Miss B (dinner lady) Hello, kids. What ...? Oliver Two burgers, please. Mary And chips*. Lots of chips, please. Oliver And ketchup. Lots of ketchup. Miss B We've also got a nice ²........................................... stew. Mary Uh, uh, no stew. Oliver And no veggies, I mean vegetables. Miss B (sighs) OK, OK.
[Image description: Photo of school lunch service with workers serving students]
Scene 2
Miss B And today? A vegetable stew? Oliver Very ³........................................ , Miss B. Mary Two burgers, please. Oliver And chips, please. Miss B Here you are. Two super burgers. And ⁴.............................. . No ketchup? Mary No, thank you. Not today.
[Image description: Photo of burgers on a platter]
Scene 3
Oliver (chewing) Mmmm, Miss B. This is a great burger. Miss B Is it? Oliver Yes, I really like it. Miss B And you, Mary? Mary (chewing) Fantastic. Miss B Burgers again for the rest of the ⁵........................................... ? Mary Yes, please. Oliver Why are they so good today? Miss B Well, one is a tofu burger and one is a veggie burger. Oliver Awww! No meat? Mary But they are ⁶........................................ good. Miss B I also think they are. So burgers tomorrow? Mary Yes, please. Oliver Yeah, OK. Miss B With some carrot cake*? Mary Errr ... Oliver Not really! No, thank you.
VOCABULARY: *chips – Pommes frites; cake – Kuchen
14 Read and act out the sketch. Who eats healthy food?
👥 15 In groups, plan and create your own role play. Act it out in class.
🔵 WB p. 64
Page 57
WRITING
16 C H O I C E S
Jacob is from Dublin. Read his email to you.
A Write an email to Jacob (30–35 words).
Tell him what you usually have for breakfast, lunch and dinner.
B Write your answer to Jacob (50–60 words). Use the words always, sometimes, often, usually, never.
Tell him: • what your family has for breakfast, lunch and dinner • what your family likes • what your family doesn't like
FROM: jacobl1@mailconnect.com SUBJECT: What I eat ...
Hi, How are you? Here are my answers to your question about my family and food. I always have tea for breakfast. I sometimes have an egg. My little brother doesn't like eggs. He has milk, bread and butter. For lunch we often have noodles. We sometimes have pizza. We sometimes go to a restaurant on Sunday. Then I have beef. My brother doesn't like beef. He has potatoes or rice or noodles. Bye, Jacob
GRAMMAR
▶️ Present simple negative
So bildest du die Verneinung im Present simple:
I don't (do not) like vegetables. He/She/It doesn't (does not) like rice. We don't (do not) like carrots.
▶️ Articles a / an
Du verwendest an dann, wenn das folgende Wort mit einem Vokal (Selbstlaut) am Anfang ausgesprochen wird.
an old skateboard an egg an apple a banana a hot dog
Adverbs of frequency
I'm always hungry. 100% always Simon and I are usually tired. usually She often eats beef. often We sometimes have curry. sometimes I never drink milk. 0% ▼ never
🔍 Kreise die richtigen Wörter ein und bilde die Regel: Die Wörter always, usually, often, sometimes, never kommen ¹vor / nach dem Verb.
I never drink milk. I often read books.
Beim Verb to be (am/is/are) kommen die Wörter always, usually, often, sometimes, never ²vor / nach dem Verb.
I'm always hungry. They're often late.
[Image description: Cartoon of person watching TV with text "He always watches TV."]
⏪ Now go back to page 52. Check ☑ with a partner what you know / can do.
🔵 WB p. 60, 61, 62, 63 🌐 CYBER Homework 21
Page 58
THE TWINS 3
▶️ The birthday present
Developing speaking competencies
Language function | Speaking strategy ☐ I can ask for something in a shop | ☐ I can express uncertainty (Unsicherheit) (beim Einkaufen nach etwas fragen) | ausdrücken)
VOCABULARY Presents for Mum
2/25 🔊 1 Match the words with the pictures. Then listen and check.
a book a purse a scarf a vase a bottle of perfume a necklace
[Image description: 6 numbered items - purse, vase, necklace, perfume bottle, scarf, and book]
2/26 🔊 2 Watch or listen to the dialogue. Then read it. What present do Lucy and Leo buy?
▶️
Assistant Can I help you? Lucy Yes. Can I see that vase, please? Assistant Here you are. Be careful. Lucy Thank you. Look, Leo. This is perfect for Mum. Leo Hmm. I don't know. How much is it? Assistant It's £23. Leo I'm not sure. That's nearly all our money. Lucy But it's perfect. Let's buy it. Assistant Would you like it in a bag? Lucy Yes, please.
[Image description: Photo of people in a shop]
Assistant Here you are ... and here's your change. £7. Lucy Thank you. Bye.
Page 59
3 Read the sentences and circle T (True) or F (False).
1 Lucy thinks the vase is a good present for Mum. T / F 3 Lucy wants the vase in a bag. T / F 2 Leo thinks the vase is cheap. T / F 4 Lucy gives the man £30. T / F
USEFUL PHRASES In a shop
4 Who says what? Write C (Customer) or S (Shop assistant).
1 Can I help you? ☐ 3 Let's buy it. ☐ 5 Can I see that vase, please? ☐ 2 Would you like it in a bag? ☐ 4 How much is it? ☐ 6 Here's your change. ☐
? What do you think? Answer the question.
• Is it the perfect present for Mum?
MOBILE HOMEWORK
▶️ Watch part 2 of the video and complete each sentence with one word.
1 ............................................ drops the bag. 2 They've only got ............................................ to buy a present. 3 Mum's birthday is on ............................................ . 4 They decide to make Mum a ............................................ . 5 The twins get a ............................................ from the library. 6 Dad gets Mum a ............................................ for her birthday.
SPEAKING STRATEGY Expressing uncertainty
5 Complete the dialogue with the words from the box. Then check with the dialogue in 2.
sure Lucy Thank you. Look, Leo. This is perfect for Mum. don't Leo Hmm. I ¹.............................. .............................. . How much is it? not Assistant It's £23. know Leo I'm ².............................. .............................. . That's nearly all our money.
6 C H O I C E S
👥 A Work in pairs.
A Suggest a present from 1 to buy. → B Express uncertainty.
Example: A Let's buy a bottle of perfume. B I don't know. How much is it?
👥 B ROLE PLAY: Work in pairs. You are in a shop. Student A wants to buy a present for his/her mum and dad. Student B is the shop assistant. Think of a role play. Take two or three minutes to practise it. Then act it out in class.
🔵 WB p. 64


----- WB: WB Unit 7 I love noodles.txt -----
Unit 7 I love noodles
Page 58–59
UNDERSTANDING VOCABULARY Food
1 Write the words from the box under the pictures.
brown bread
an orange
an egg
peppers
an apple
cucumber
mineral water
nuts
ham
cheese
fish
grapes
sausages
ice cream
corn
meat
pumpkin
milk
1 ........................................
2 ........................................
3 ........................................
4 ........................................
5 ........................................
6 ........................................
7 ........................................
8 ........................................
9 ........................................
10 ........................................
11 ........................................
12 ........................................
13 ........................................
14 ........................................
15 ........................................
16 ........................................
17 ........................................
18 ........................................
2 Tick the sentences that are true for you.
1 I love milk. ☐
2 I don’t like soup. ☐
3 I hate corn bread. ☐
4 I like fish. ☐
5 I love pizza. ☐
6 I don’t like tea. ☐
7 I like spinach. ☐
8 I hate oranges. ☐
9 I like mineral water. ☐
10 I don’t like ice cream. ☐
11 I like nuts. ☐
12 I don’t like tofu. ☐
3 Find and circle 14 more food words in the wordsearch and write them in the table (→↓).
Drinks | Vegetables | Fruit | Meat | Others
........................................
........................................
........................................
........................................
........................................
USING VOCABULARY Food
4 Complete the text with the correct words.
My favourite food is 1 ................................ with 2 ................................,
3 ................................ and 4 ................................ . I love it. I always
eat it on Fridays. My mum sometimes makes it for us at home. And we
sometimes go to a pizza restaurant. I also like 5 ................................,
6 ................................ and 7 ................................ . But not on pizza!
5 Write about your favourite food. Say:
• what your favourite food is: .................................................................
• how often you eat it: ........................................................................
• what other food you like: ....................................................................
Page 60
6 Follow the lines. Write the sentences and use the verb like.
Janie  monkeys  Oiana and Mark  Susie  Bill  my sister
1 Janie likes yogurt.
2 .........................................................................................
3 .........................................................................................
4 .........................................................................................
5 .........................................................................................
6 .........................................................................................
UNDERSTANDING GRAMMAR Articles a / an
7 Circle the correct word.
1 I’ve got a / an sister and three brothers.
2 I don’t want a / an apple, thanks.
3 We live in a / an big city.
4 Have you got a / an computer?
5 Take a / an umbrella with you.
6 Sue has got a / an orange bike.
7 Bob’s in a / an band.
8 Let’s watch a / an film.
UNDERSTANDING GRAMMAR Present simple negative
8 Complete the sentences with don’t or doesn’t.
1 He ................ like spinach.
2 They ................ live in a big house.
3 I ................ know the answer.
4 She ................ go to our school.
5 We ................ understand!
6 It ................ eat meat.
7 He ................ speak English.
8 You ................ play very well.
Page 61
UNDERSTANDING GRAMMAR Adverbs of frequency
9 Tick the sentences that are true for you.
1 I sometimes have chicken for dinner. ☐
2 I always have eggs for breakfast. ☐
3 I never have chocolate for lunch. ☐
4 I usually have soup for dinner. ☐
5 I sometimes have potatoes for lunch. ☐
6 I often have orange juice for breakfast. ☐
7 I usually have hot dogs for dinner. ☐
8 I never have fish for breakfast. ☐
9 I often have bread for breakfast. ☐
10 I always have pizza for lunch. ☐
USING GRAMMAR Articles a / an
10 Complete the text with a or an. Then colour the pictures.
Spoilt* Sally has got lots of
things. She has got 1 .................
parrot and 2 ................. angry
cat, 3 ................. orange laptop
and 4 ................. blue tablet,
5 ................. pink saxophone
and 6 ................. red keyboard.
Yes, spoilt Sally has got
everything!
VOCABULARY: *spoilt – verwöhnt; everything – alles
USING GRAMMAR Present simple negative
11 Complete the sentences with the negative form of the verb.
1 He likes apples, but he ................................ oranges.
2 She speaks Italian, but she ................................ English.
3 I like yogurt, but I ................................ milk.
4 He eats chicken, but he ................................ eggs.
5 I collect* lots of things, but I ................................ garden gnomes.
6 He plays football, but he ................................ volleyball.
7 You watch films on your laptop, but you ................................ television.
8 We go shopping on Saturdays, but we ................................ on Sundays.
VOCABULARY: *collect – sammeln
12 Write sentences that are true for you.
1 I / not like .................................................................
2 I / like .......................................................................
3 My friend / not speak .......................................................
4 My friends at school / not live .............................................
5 I / not play .................................................................
6 My mum and dad / not like ...................................................
7 I / not watch .................................................................
Page 62
USING GRAMMAR Adverbs of frequency
13 Look at the table. Write sentences. Put the verbs in the correct forms.
XXXXX = never  ✓✓XXX = sometimes  ✓✓✓XX = often  ✓✓✓✓X = usually  ✓✓✓✓✓ = always
1 My cat Jasper / ✓✓✓✓✓ / break / things.
.........................................................................................
2 He / be / ✓✓✓XX / happy.
.........................................................................................
3 He / ✓✓✓XX / watch / TV.
.........................................................................................
4 He / ✓✓✓✓X / go / out all day.
.........................................................................................
5 He / be / ✓✓✓✓✓ / hungry.
.........................................................................................
6 He / XXXXX / sleep / at night.
.........................................................................................
7 He / ✓✓✓✓X / play / with my dog.
.........................................................................................
14 Write the words in the correct order to make sentences.
1 never / Hammond / watches / TV. / Miss
.........................................................................................
2 at / always / football / play / school. / I
.........................................................................................
3 for / to / sometimes / Italy / we / holidays*. / go / our
.........................................................................................
4 friends. / plays / his / he / with / never / football
.........................................................................................
5 school / on / usually / they / bikes. / go / to / their
.........................................................................................
6 eggs / have / breakfast. / we / for / often
.........................................................................................
7 at / always / it / the / rains* / weekend.
.........................................................................................
8 late / school. / arrive* / sometimes / I / at
.........................................................................................
VOCABULARY: *holidays – Ferien; rain – regnen; arrive – (an-)kommen
15 Complete the sentences so they are true for you.
1 I sometimes ................................................................. .
2 I never ................................................................. .
3 I often ................................................................. .
4 My mum usually ................................................................. .
5 My dad always ................................................................. .
6 My best friend never ................................................................. .
Page 63
READING & WRITING Understanding what children (don’t) like / Writing an email
16 Read the texts. How many of the tasks below can you do?
FOOD and the BRITISH TEENAGER
Two teenagers talk about what they usually eat.
Harry (14, Manchester)
My favourite food is fish and chips! It’s delicious*.
My mum often does fish and chips at home on Fridays and I sometimes
go to the fish and chip shop with my friends on Saturday, too!
But I like other things, too. I love spaghetti – spaghetti bolognese is
one of my favourite things, with Parmesan cheese – mmmh! In my town
there’s a really good pizza restaurant and they make great spaghetti, too.
Jenny (15, Dorset)
I love fish, but not fish and chips. I like fish with rice or vegetables – tomatoes,
spinach or potatoes. It’s delicious!
I like fast food, too. I sometimes go to the pizza restaurant with my friends.
There’s a great hamburger restaurant here too and we often go there for lunch
on Saturday or Sunday.
I love oranges and kiwis, too – kiwis and ice cream is great! I eat it in the summer,
it’s wonderful*.
VOCABULARY: *delicious – köstlich; wonderful – wunderbar
Choose the correct answer.
1 Harry says, “My favourite food is
☐ spaghetti bolognese. ☐ fish and chips. ☐ pizza.”
2 Jenny doesn’t like
☐ fish and rice. ☐ fish and chips. ☐ fish and vegetables.
3 Jenny goes to the pizza restaurant with her
☐ best friend. ☐ friends. ☐ family.
Circle T (True) or F (False).
4 Harry sometimes has fish and chips at the weekend. T / F
5 Harry doesn’t like the pizza at the restaurant in his town. T / F
6 Jenny’s favourite vegetables are carrots and beans. T / F
Answer the questions.
7 Where does Harry eat fish and chips? ........................................
8 What does Harry like on his spaghetti? ........................................
9 What fruit does Jenny like? ........................................
17 Listen and check your answers.
18 Look at the texts in 16 again. Write a short email (30–35 words) about what your friend likes / doesn’t like to eat.
Page 64
LISTENING & DIALOGUE WORK Talking about food and eating habits
19 Listen to the children and tick the food words you hear. There are six extra words.
☐ kiwi  ☐ grapes  ☐ water  ☐ toast  ☐ apples  ☐ butter  ☐ pizza
☐ tea  ☐ cheese  ☐ beef  ☐ fish and chips  ☐ onion  ☐ vegetable stew
☐ Scotch egg  ☐ meat  ☐ sandwich  ☐ soup  ☐ sausage meat  ☐ milk  ☐ oranges
20 Listen again and circle the words Jamie says in red and the words Alissa says in blue.
21 CHOICES
A Complete the dialogue with the words from the box. Then listen and check.
chicken
favourite
always
loves
apple
hate
love
Billy  It’s Friday! Great. I 1 ................................ Fridays.
Annabel Really?
Billy  Yeah. We 2 ................................ have vegetable stew for dinner on
    Fridays. I think it’s my 3 ................................ food.
Annabel What – vegetable stew?
Billy  Yes. And then 4 ................................ strudel and ice cream. Mmmh!
Annabel Well, that isn’t my favourite food. My favourite food is curry.
Billy  Curry! Oh no! I 5 ................................ curry. It’s terrible!
Annabel No, it isn’t! I love it and my brother 6 ................................ it, too.
    7 ................................ curry – wonderful!
Billy  I really don’t like it.
Annabel Bye, Billy. Go home and eat your vegetable stew.
B Put the dialogue in the correct order. Then listen and check.
☐ Paul Well, come to my school on Tuesdays. You’ll love it.
☐ Clare You hate pizza? Are you crazy?
1 Paul It’s Tuesday. Oh no! I hate Tuesdays.
☐ Paul No, I’m not. And after the pizza we get ice cream.
☐ Paul We have pizza at school on Tuesdays. I hate pizza.
☐ Clare I’d love to come. We always have fish and chips on Tuesday. I hate it.
☐ Clare Why? What’s the problem with Tuesdays?
☐ Clare Pizza and ice cream. That’s my perfect lunch.
DIALOGUE WORK Asking for something in a shop
22 Put the dialogue in the correct order. Then listen and check.
☐ Assistant Here you are and here’s your change.
☐ Assistant Sure, here you are.
☐ Assistant It’s £30.
☐ Assistant Would you like it in a bag?
1 Assistant Can I help you?
☐ Carla No, thanks. It’s OK.
☐ Carla How much is it?
☐ Carla I’ll take it.
☐ Carla Yes, can I see that scarf, please?
Page 65–66
WORD FILE
Food
ice cream
chillies
fish
chicken
milk
butter
cheese
orange juice
tea
cucumber
sausages
beans
broccoli
carrot
onion
peas
an apple
mineral water
grapes
an orange
tomato (pl tomatoes)
red pepper
kiwi
spinach
pumpkin
potato (pl potatoes)
corn
brown bread
nuts
chips
rice
noodles
soup
Eating
breakfast  lunch  dinner  restaurant
Adverbs of frequency
always
usually
often
sometimes
never
MORE Words and Phrases
1 meat – I am vegetarian. I never eat meat. – Fleisch
2 ham – On the weekend, I sometimes have ham and eggs for breakfast. – Schinken
3 healthy – A lot of junk food isn’t healthy. – gesund
4 to like – I like orange juice. – mögen
5 That’s nice. – Das ist nett.
6 always – They always have pizza for dinner. – immer
7 breakfast – We have eggs for breakfast. – Frühstück
8 country – My grandparents live in the country, but I live in the city. – Land
9 dessert – For dessert, I like rice pudding. – Nachtisch
10 family – My family and I live in Austria. – Familie
11 fruit – He likes lots of fruit for breakfast. – Obst; Frucht
12 grandparents – My grandparents live in the country. – Großeltern
13 lunch – We often have curry for lunch. – Mittagessen
14 never – She never eats meat. She’s a vegetarian. – nie, niemals
15 often – They often have bread for breakfast. – oft, häufig
16 to put – We put fish and vegetables on the rice paper. – setzen, legen, stellen
17 sometimes – We sometimes have fish for lunch. – manchmal
18 stew – When we have vegetables (and meat) at home, my mum cooks a stew. – Eintopf
19 usually – She usually has bread for breakfast. – gewöhnlich, normalerweise
20 vegetables (veggies) – I like veggies, I mean vegetables. – Gemüse
21 best friend – I like John best. He’s my best friend. – bester Freund / beste Freundin
22 tofu – I like meat, but sometimes I also eat tofu. – Tofu
23 beef – I often eat chicken, but I really don’t like beef. – Rindfleisch
24 I don’t know. – Ich weiß es nicht.
25 I’m not sure. – Ich bin mir nicht sicher.
26 present – The vase is a good present for Mum. – Geschenk

```

## Output contract

Write `content/corpus/units/g1-u07/gen/vocab.draft.json`:

```jsonc
{
  "schema": "vocab-draft@1",
  "slug": "g1-u07",
  "briefBank": "629dca6525cf",
  "briefPrompt": "346902f9f0f1",
  "items": [
    {
      "wordId": "g2u03.w.witch",        // the bank id this item teaches (EVERY bank row exactly once)
      "w": "witch",                     // == bank en, verbatim
      "g": "Hexe",                      // one of the bank's de values (the primary sense)
      "d": "…", "s": "… ___ …", "sSource": "masterlist|sb|wb|invented",
      "sAnswers": [{ "text": "…", "tier": "full|partial" }],
      "dAnswers": [{ "text": "…", "tier": "full" }],
      "translation": { "deToEn": [{ "text": "…", "tier": "full" }], "enToDe": [{ "text": "…", "tier": "full" }] },
      "gloss": [],                      // [{ "word": "…", "de": "…", "scope": "s"|"d"|null }]
      "mc": ["…", "…", "…"],
      "hintDe": "…",
      "difficulty": 1,
      "gameMeta": { "distractorPool": ["…", "…", "…", "…"], "chipBudget": null, "minOptions": 4 },
      "seedV1": null, "sbRef": null, "note": null
    }
  ]
}
```
