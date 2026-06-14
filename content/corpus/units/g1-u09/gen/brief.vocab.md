# Vocab generation brief — g1-u09 (MORE! 1, Unit 9)

<!-- domigo:gen vocab g1-u09 bank=3757b4788b29 prompt=346902f9f0f1 -->

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
| g1u09.w.owl | owl | Eule | wordfile | — | — | — | owl |
| g1u09.w.budgie | budgie | Wellensittich | wordfile | — | — | — | budgie |
| g1u09.w.elephant | elephant | Elefant | wordfile | — | — | — | elephant |
| g1u09.w.spider | spider | Spinne | wordfile | — | — | — | spider |
| g1u09.w.bat | bat | Fledermaus | wordfile | — | — | — | bat |
| g1u09.w.shark | shark | Hai | wordfile | — | — | — | shark |
| g1u09.w.zebra | zebra | Zebra | wordfile | — | — | — | zebra |
| g1u09.w.camel | camel | Kamel | wordfile | — | — | — | camel |
| g1u09.w.pony | pony | Pony | wordfile | — | — | — | pony |
| g1u09.w.guinea-pig | guinea pig | Meerschweinchen | wordfile | — | — | — | guinea pig |
| g1u09.w.fish | fish | Fisch | wordfile | — | — | — | fish |
| g1u09.w.pig | pig | Schwein | wordfile | — | — | — | pig |
| g1u09.w.rabbit | rabbit | Kaninchen ; Hase | wordfile | — | — | — | rabbit |
| g1u09.w.lizard | lizard | Eidechse | wordfile | — | — | — | lizard |
| g1u09.w.rat | rat | Ratte | wordfile | — | — | — | rat |
| g1u09.w.mouse | mouse | Maus | wordfile | — | — | — | mouse |
| g1u09.w.tortoise | tortoise | Schildkröte | wordfile | — | — | — | tortoise |
| g1u09.w.box | box | Schachtel ; Kiste | wordfile | — | — | — | box |
| g1u09.w.tank | tank | Aquarium ; Terrarium | wordfile | — | — | — | tank |
| g1u09.w.cage | cage | Käfig | wordfile | — | — | — | cage |
| g1u09.w.terrarium | terrarium | Terrarium | wordfile | — | — | — | terrarium |
| g1u09.w.unusual | unusual | ungewöhnlich ; außergewöhnlich | phrase | — | A snake is a very unusual pet. | — | unusual |
| g1u09.w.mouse-2 | mouse (pl mice) | Maus | phrase | — | I have a mouse and a dog and my friend has four mice. | — | mouse ; mice |
| g1u09.w.a-day | (...) a day | (...) am Tag | phrase | — | She walks her dog three times a day. | — | a day ; ... |
| g1u09.w.once | once | einmal | phrase | — | He feeds his hamster once a day. | — | once |
| g1u09.w.twice | twice | zweimal | phrase | — | I only feed my spider twice a week. | — | twice |
| g1u09.w.across | across (Britain) | in ganz (Großbritannien) | phrase | — | There are lots of pets in homes across Britain. | — | across ; Britain |
| g1u09.w.dangerous | dangerous | gefährlich | phrase | — | Crocodiles are dangerous animals. | — | dangerous |
| g1u09.w.farm | farm | Bauernhof | phrase | — | She lives on a farm with horses and pigs. | — | farm |
| g1u09.w.man | man (pl men) | Mann | phrase | — | The man's name is John. | — | man ; men |
| g1u09.w.near | near | in der Nähe von | phrase | — | The Smith family lives near London. | — | near |
| g1u09.w.newspaper | newspaper | Zeitung | phrase | — | My dad always reads the newspaper in the morning. | — | newspaper |
| g1u09.w.a-week | (...) a week | (...) in der Woche | phrase | — | He feeds his spider once a week. | — | a week ; ... |
| g1u09.w.basket | basket | Korb | phrase | — | Grandpa gives her two baskets of apples and plums. | — | basket |
| g1u09.w.daughter | daughter | Tochter | phrase | — | Clare is her daughter. | — | daughter |
| g1u09.w.to-drive | to drive | fahren | phrase | — | On Sunday, they drive to Grandpa's house. | drive | to drive ; drive |
| g1u09.w.everybody | everybody | jede/r | phrase | — | Everybody in class is sad today. | — | everybody |
| g1u09.w.far-away | far away | weit weg | phrase | — | Grandpa's house is far away. | — | far away |
| g1u09.w.grandpa | grandpa | Opa | phrase | — | My grandpa lives on a farm. | — | grandpa |
| g1u09.w.mother | mother | Mutter | phrase | — | She lives at home with her mother. | — | mother |
| g1u09.w.noise | noise | Geräusch | phrase | — | Clare hears a noise in the apartment. | — | noise |
| g1u09.w.to-stay | to stay | bleiben | phrase | — | We can't stay here. | stay | to stay ; stay |
| g1u09.w.cuddly-toy | cuddly toy | Stofftier | phrase | — | All day long he plays with his cuddly toys. | — | cuddly toy |
| g1u09.w.to-visit | to visit | besuchen | phrase | — | On Sunday, they visit Grandpa. | visit | to visit ; visit |
| g1u09.w.to-be-interested-in | to be interested in | an etw. interessiert sein | phrase | — | Tell me about the things you are interested in. | be interested in | to be interested in ; be interested in |
| g1u09.w.fur | fur | Fell | phrase | — | My pet has fur – lots of it. | — | fur |
| g1u09.w.personal | personal | persönlich | phrase | — | Don't put personal information on your blog. | — | personal |
| g1u09.w.owner | owner | Besitzer/Besitzerin | phrase | — | Jamie is the owner of an unusual pet. | — | owner |
| g1u09.w.aunty | aunty | Tante (Koseform) | phrase | — | Aunty Jane is Mum's sister. | — | aunty |
| g1u09.w.dear | dear | liebe/r (Anrede) | phrase | — | Dear Aunty Olivia, ... | — | dear |
| g1u09.w.letter | letter | Brief | phrase | — | Thank you for your letter. | — | letter |
| g1u09.w.to-bite | to bite | beißen | phrase | — | I don't like that dog. It bites! | bite | to bite ; bite |
| g1u09.w.beginning | beginning | Anfang | phrase | — | The beginning of the film is fantastic. | — | beginning |
| g1u09.w.to-begin | to begin | anfangen ; beginnen | phrase | — | He always begins his emails with "Hi!". | begin | to begin ; begin |
| g1u09.w.best-wishes | best wishes | herzliche Grüße | phrase | — | Best wishes to your mum and dad, Peter. | — | best wishes |
| g1u09.w.ending | ending | Ende ; Schluss | phrase | — | The ending of the book is very strange. | — | ending |
| g1u09.w.to-need | to need | brauchen | phrase | — | I really need your help. | need | to need ; need |

### Allowed vocabulary (the deterministic level gate enforces exactly this)

Cumulative bank — every headword below (plus its inflections and listed forms) is taught:

- **g1-u01**: sound system, projector, board, window, door, desk, scissors, ruler, tablet, chair, school bag, pen, exercise book, pencil case, pencil, rubber, book, hairband, sunglasses, hat, school tie, shirt, sweater, skirt, socks, shoe, to give, time, to understand, to write, to enjoy, to listen, to love, more, to read, their, to ask, (email) address, How are you?, I am (= I'm) fine., to meet, then, your, to look, or, to eat, to go, must, how many, to hate, here, it, Let's …, midnight, our, favourite, to find, light, child, to clean, to close, to open, picture, to sit down, to speak, to stand up, to take out, class
- **g1-u02**: tree, monkey, parrot, giraffe, train, penguin, guide, lion, next to, in, behind, under, on, in front of, zoo, beautiful, behind, big, in front of, next to, under, where, small, adult, at, to bring, but, child (pl children), dog, family, free, Grandma, group, long, ticket, to want, from, year, he, she, to talk, they, we, for, happy, to let somebody out, us, car, At last., How strange!, Let me see., stone
- **g1-u03**: finger, ear, nose, hair, eye, mouth, beard, right arm, left arm, shoulder, leg, foot, feet, tooth, teeth, tall, short, big, small, long, also, famous, him, his, ship, to be scared (of), strong, captain, have got / has got, pretty, purple, week, again, back, to paint, sister, boy, girl, man (pl men), woman (pl women), Her name is …, His name is …
- **g1-u04**: cold, angry, happy, scared, excited, hot, bored, sad, hungry, nervous, tired, proud, morning, lunchtime, afternoon, evening, night, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, after, day, end, fun, Go away!, to happen, show, a day in the life of, to be asleep, early, life, still, story, today, Are you OK?, homework (no pl), into, Oh dear!, room, bad, Don't be late., tomorrow, birthday, friend, Be yourself., no one else, bottle, to get back, mad, magic, to break, to go to sleep, because, It's me., Try it!, Let go!, What's happening?
- **g1-u05**: keyboard player, keyboard, singer, drummer, drums, saxophone player, saxophone, guitarist, guitar, boyfriend, its, to play, sister, can, cannot / can't, concert, to dance, Don't worry., job, perfect, to carry, to stand on, tongue, to touch, to walk on, to wiggle, can, to drink, hundred, in one go, Is that so?, This is me., economy, hospital, to laugh, (pocket) money, pound, profit, school canteen, table, teacher, uncle, to wash, nothing, Sorry?
- **g1-u06**: city, park, street, market, supermarket, river, woods, tree, to jump into the river, to look out the window, to pick something up, to sit in a tree, to fall out of the tree, to bump into a tree, to go to the park, to pull, to climb up a tree, to leave the office, to look in the mirror, to climb, to jump, to leave, mirror, to put on, away, (world's) best, detective, Help me!, office, to run, to find, to pull, to catch, clever, to come to, to live, nice, a lot of / lots of, to call, Come on!, to solve, to wait, to watch, street, to get up, to become, But it's true!, Go on., Well done.
- **g1-u07**: ice cream, chillies, fish, chicken, milk, butter, cheese, orange juice, tea, cucumber, sausages, beans, broccoli, carrot, onion, peas, an apple, mineral water, grapes, an orange, tomato (pl tomatoes), red pepper, kiwi, spinach, strawberry, sugar, bread, rice, egg, pasta, pizza, fries, chips, hamburger, chocolate, cake, breakfast, lunch, dinner, restaurant, always, usually, often, sometimes, never, meat, ham, healthy, to like, That's nice., any, to drink, to make, money, sandwich, some, vegetable, waiter, Have you got …?, I've got …, junk food, menu, Mum, plate, salad, soup, glass
- **g1-u08**: cap, mask, jacket, sweater, blouse, trousers, hoodie, cape, pyjamas, tights, shoes, boots, trainers, belt, hole, anything, to borrow, to fit, to try on, to wear, to hurt, poem, to tickle, somebody, backwards, exciting, tonight, horse, building, Let's get out of here.
- **g1-u09**: owl, budgie, elephant, spider, bat, shark, zebra, camel, pony, guinea pig, fish, pig, rabbit, lizard, rat, mouse, tortoise, box, tank, cage, terrarium, unusual, mouse (pl mice), (...) a day, once, twice, across (Britain), dangerous, farm, man (pl men), near, newspaper, (...) a week, basket, daughter, to drive, everybody, far away, grandpa, mother, noise, to stay, cuddly toy, to visit, to be interested in, fur, personal, owner, aunty, dear, letter, to bite, beginning, to begin, best wishes, ending, to need

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alphabet, Anger, Annie, Arbeit, Archie, Articles, Austria, Bacon, Baker, Befehlsformen, Bert, Betty, Bild, Bilder, Blackbeard, Blackie, Bob, Box, Buckingham, Buddy, Burgers, California, Cambridge, Caribbean, Carina, Carl, Chester, Chloe, Christie, Clare, Classroom, Clothes, Clown, Come, Complimenting, Dan, Dana, Daniel, Dave, David, Davis, Debbie, Dialog, Dialoge, Doctor, Doctors, Don, Ellie, Emma, England, English, False, Fido, Food, Frank, Fred, Freddy, George, Georgia, German, Gina, Good, Gordon, Great, Grey, Greybeard, Groans, Guess, Harry, Hmm, Holmes, Homework, Hook, Imperatives, Irregular, Italian, Jack, Jacob, James, Jamie, Jane, Jenny, Jessica, Jill, John, Julia, Jun, Kitty, Leah, Leo, Lethabo, Lewis, London, Lucy, Mail, Manchester, Mandy, Manson, Mark, Marple, Mary, Matt, Mike, Miss, Mr, Mum, Nibbs, Nice, Nick, Nomen, Number, Numbers, Object, Objekte, Olivia, Omar, Palace, Pardon, Paws, Pete, Peter, Pets, Pirates, Plural, Plurals, Polly, Possessives, Prepositions, Present, Priestly, Project, Put, Rajit, Red, Reihenfolge, Richard, Ronald, Rosie, Sally, Sam, Sandra, Saying, School, Sherlock, Smith, Sophia, Steve, Sue, Tamar, Tamara, Tammy, Text, Think, Tick, Toby, Tock, Tom, Tony, True, Um, Walker, Wall, Watson, Welcome, Well, White, Wise, Work, Wortes, Would, Wow, Yeah, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## v1 seeds (UNTRUSTED — mine for ideas, never copy unverified)

Known v1 defect classes: invented above-level carrier words, out-of-bank MC distractors, over-strict answers.

- `g1u09.w.owl` ← v1 `owl`: d="a bird that flies and hunts at night" · s="At night, you can hear the _____ with big round eyes hooting from the tall tree." · a=[] · mc=["butterfly","fish","spider"]
- `g1u09.w.budgie` ← v1 `budgie`: d="a small, colourful bird people keep at home" · s="My small blue pet _____ in its cage can say 'hello' and 'goodbye'." · a=["budgerigar"] · mc=["goldfish","hamster","spider"]
- `g1u09.w.elephant` ← v1 `elephant`: d="a very big grey animal with a long nose" · s="The huge grey _____ at the zoo has very big flappy ears and a long trunk." · a=[] · mc=["fish","snake","rabbit"]
- `g1u09.w.spider` ← v1 `spider`: d="a small animal with eight legs" · s="There is a black _____ with eight legs and its sticky web in the corner of the ceiling." · a=[] · mc=["worm","snail","ant"]
- `g1u09.w.bat` ← v1 `bat`: d="an animal that flies at night" · s="A _____ with leathery wings sleeps hanging upside-down during the day and flies at night." · a=[] · mc=["fish","squirrel","mouse"]
- `g1u09.w.shark` ← v1 `shark`: d="a big, dangerous fish in the sea" · s="The dangerous _____ with sharp teeth swims fast through the ocean looking for fish." · a=[] · mc=["frog","turtle","starfish"]
- `g1u09.w.zebra` ← v1 `zebra`: d="an animal with black and white stripes" · s="A _____ looks like a horse but has black and white stripes all over its body." · a=[] · mc=["cow","sheep","pig"]
- `g1u09.w.camel` ← v1 `camel`: d="a big animal with a hump on its back" · s="In the hot desert, people ride a _____ with one or two humps on its back and long eyelashes." · a=[] · mc=["cow","pig","dog"]
- `g1u09.w.pony` ← v1 `pony`: d="a small horse" · s="The small children ride a little _____ — a small horse — at the farm on Sundays." · a=[] · mc=["lion","tiger","bear"]
- `g1u09.w.guinea-pig` ← v1 `guinea pig`: d="a small, soft pet with no tail" · s="My small furry pet _____ loves to eat carrots and lettuce in its cage and squeaks for food." · a=[] · mc=["goldfish","parrot","spider"]
- `g1u09.w.pig` ← v1 `pig`: d="a pink farm animal with a curly tail" · s="The pink _____ on the muddy farm likes to roll in the wet mud and has a curly tail." · a=[] · mc=["chicken","horse","cow"]
- `g1u09.w.rabbit` ← v1 `rabbit`: d="a small animal with long ears" · s="Our pet _____ has soft white fur, long floppy ears, and hops around the garden." · a=["bunny"] · mc=["cat","dog","parrot"]
- `g1u09.w.lizard` ← v1 `lizard`: d="a small animal with four legs and a long tail" · s="A small green _____ with scales sits on the warm rock in the sun and flicks its tongue." · a=[] · mc=["rabbit","mouse","bird"]
- `g1u09.w.rat` ← v1 `rat`: d="an animal like a big mouse" · s="The big _____ has a long bald pink tail and sharp front teeth. It eats food from the bin." · a=[] · mc=["cat","dog","rabbit"]
- `g1u09.w.mouse` ← v1 `mouse`: d="a very small animal with a long tail" · s="A little grey _____ with a thin tail ran quickly across the kitchen floor and hid behind the fridge." · a=[] · mc=["cat","dog","rabbit"]
- `g1u09.w.tortoise` ← v1 `tortoise`: d="a slow animal with a hard shell" · s="My pet _____ walks very very slowly through the garden with its shell on its back." · a=["turtle"] · mc=["rabbit","hamster","bird"]
- `g1u09.w.box` ← v1 `box`: d="a container with four sides and a top" · s="Put the heavy books in that big cardboard _____ with a lid." · a=[] · mc=["bag","bottle","glass"]
- `g1u09.w.tank` ← v1 `tank`: d="a glass container for fish or reptiles" · s="My pet fish swim around in a big glass _____ filled with water and green plants." · a=[] · mc=["box","basket","envelope"]
- `g1u09.w.cage` ← v1 `cage`: d="a space with bars to keep animals in" · s="The yellow canary bird sings in its metal _____ with thin bars all morning." · a=[] · mc=["tank","box","bottle"]
- `g1u09.w.terrarium` ← v1 `terrarium`: d="a glass box for lizards or snakes" · s="The pet lizard lives in a warm glass _____ with sand, rocks, and a heat lamp." · a=[] · mc=["fridge","oven","bathtub"]
- `g1u09.w.unusual` ← v1 `unusual`: d="not normal, different from most things" · s="A pet snake is a very _____ animal to have at home. Most families have cats or dogs instead." · a=[] · mc=["normal","common","popular"]
- `g1u09.w.mouse-2` ← v1 `mouse`: d="a very small animal with a long tail" · s="A little grey _____ with a thin tail ran quickly across the kitchen floor and hid behind the fridge." · a=[] · mc=["cat","dog","rabbit"]
- `g1u09.w.a-day` ← v1 `a day`: d="once every twenty-four hours" · s="I brush my teeth two times _____ — once in the morning and once before bed." · a=["per day"] · mc=["a year","a month","a week"]
- `g1u09.w.once` ← v1 `once`: d="one time" · s="He feeds his cat _____ a day in the morning at 7am with dry food." · a=[] · mc=["twice","three times","four times"]
- `g1u09.w.twice` ← v1 `twice`: d="two times" · s="She walks her pet dog _____ every day — one time before school and one time after school." · a=[] · mc=["once","three times","five times"]
- `g1u09.w.across` ← v1 `across`: d="from one side to the other, everywhere in" · s="There are many pets in family homes _____ Britain, from Scotland in the north to England in the south." · a=[] · mc=["under","above","below"]
- `g1u09.w.dangerous` ← v1 `dangerous`: d="not safe, can hurt you" · s="Wild lions are _____ animals with big teeth and claws; don't go near them at the zoo!" · a=[] · mc=["safe","friendly","gentle"]
- `g1u09.w.farm` ← v1 `farm`: d="a place where people grow food and keep animals" · s="The cows, chickens, pigs and sheep all live together on the big green countryside _____." · a=[] · mc=["city","factory","airport"]
- `g1u09.w.near` ← v1 `near`: d="not far from, close to" · s="Our house is _____ the school. I can walk there in just five minutes." · a=["close to"] · mc=["far from","across from","under"]
- `g1u09.w.newspaper` ← v1 `newspaper`: d="paper with news you read every day" · s="Dad reads the daily _____ with news stories and photos at breakfast every morning." · a=[] · mc=["comic book","dictionary","diary"]
- `g1u09.w.a-week` ← v1 `a week`: d="once every seven days" · s="We have swimming lessons three times _____ — every Monday, Wednesday, and Friday." · a=["per week"] · mc=["a day","a month","a year"]
- `g1u09.w.basket` ← v1 `basket`: d="a container to carry things in" · s="She puts the picked apples in a big woven _____ with a handle on top." · a=[] · mc=["plate","bottle","glass"]
- `g1u09.w.daughter` ← v1 `daughter`: d="a girl child of a parent" · s="Mr and Mrs Smith have one son called Tom and one _____ called Anna." · a=[] · mc=["uncle","grandfather","nephew"]
- `g1u09.w.to-drive` ← v1 `to drive`: d="to move a car from one place to another" · s="My dad can _____ us in his car to the zoo on Sunday. He has a driving licence." · a=[] · mc=["to swim","to fly","to cycle"]
- `g1u09.w.everybody` ← v1 `everybody`: d="all people, every person" · s="_____ — all 25 pupils — in our class has a pet at home. Not a single child is without one." · a=["everyone"] · mc=["nobody","just one student","only the teacher"]
- `g1u09.w.far-away` ← v1 `far away`: d="not near, a long distance from here" · s="Grandpa lives _____ in another city that is 300 km away, so we always go by car." · a=[] · mc=["next door","upstairs","in this house"]
- `g1u09.w.grandpa` ← v1 `grandpa`: d="your father's or mother's father" · s="My _____ — my dad's father — tells us funny stories from his childhood every Sunday." · a=["grandfather","grandad"] · mc=["uncle","brother","cousin"]
- `g1u09.w.mother` ← v1 `mother`: d="the woman who is your parent" · s="Her _____ takes her to school every morning in the car. She is a woman and a parent." · a=["mum","mom"] · mc=["father","brother","uncle"]
- `g1u09.w.noise` ← v1 `noise`: d="a sound, often loud or strange" · s="What is that loud banging _____? I can hear something strange coming from the cellar." · a=["sound"] · mc=["smell","light","silence"]
- `g1u09.w.to-stay` ← v1 `to stay`: d="to not leave, to be in one place" · s="Can we _____ here a little longer at the playground, please? I don't want to go home yet." · a=[] · mc=["to leave","to run away","to disappear"]
- `g1u09.w.cuddly-toy` ← v1 `cuddly toy`: d="a soft toy animal for children" · s="She sleeps with her favourite soft _____ bear every night. She has had it since she was a baby." · a=["stuffed animal","soft toy"] · mc=["computer game","football","book"]
- `g1u09.w.to-visit` ← v1 `to visit`: d="to go and see a person or place" · s="We _____ our elderly grandma at her house every weekend and have tea with her." · a=[] · mc=["to avoid","to forget","to ignore"]
- `g1u09.w.to-be-interested-in` ← v1 `to be interested in`: d="to want to know more about something" · s="He is _____ wild animals — he reads books about them and watches nature shows on TV." · a=[] · mc=["to be bored by","to be scared of","to hate"]
- `g1u09.w.fur` ← v1 `fur`: d="the soft hair on an animal's body" · s="The cat has soft, fluffy white _____ all over its body. I like to stroke it." · a=[] · mc=["skin","feathers","scales"]
- `g1u09.w.personal` ← v1 `personal`: d="about one person, private" · s="Don't put your _____ information like your address or phone number on the internet." · a=[] · mc=["public","fake","simple"]
- `g1u09.w.owner` ← v1 `owner`: d="the person an animal or thing belongs to" · s="The lost dog runs back to its _____ — the person who bought it and feeds it — in the park." · a=[] · mc=["stranger","teacher","classmate"]
- `g1u09.w.aunty` ← v1 `aunty`: d="your parent's sister" · s="My _____ Jane — my mother's sister — always brings presents for me when she visits our house." · a=["auntie","aunt"] · mc=["uncle","grandpa","brother"]
- `g1u09.w.dear` ← v1 `dear`: d="a word to start a letter" · s="_____ Grandma, thank you for the lovely birthday card you sent me. Love, Anna." · a=[] · mc=["Goodbye","Stop","Bye"]
- `g1u09.w.letter` ← v1 `letter`: d="a message you write on paper and send" · s="I write a long _____ on paper with a pen to my friend in London and put it in an envelope." · a=[] · mc=["email","text message","phone call"]
- `g1u09.w.to-bite` ← v1 `to bite`: d="to use your teeth on something" · s="Be careful around that angry dog! It has sharp teeth and can _____ you!" · a=[] · mc=["to help","to thank","to greet"]
- `g1u09.w.beginning` ← v1 `beginning`: d="the start, the first part" · s="The _____ of the book is very funny — the first chapter makes me laugh out loud." · a=["start"] · mc=["ending","middle","last chapter"]
- `g1u09.w.to-begin` ← v1 `beginning`: d="the start, the first part" · s="The _____ of the book is very funny — the first chapter makes me laugh out loud." · a=["start"] · mc=["ending","middle","last chapter"]
- `g1u09.w.best-wishes` ← v1 `best wishes`: d="a friendly way to end a letter" · s="_____, Tom. [at the end of a letter]" · a=[] · mc=["Dear,","Hello,","Hi,"]
- `g1u09.w.ending` ← v1 `ending`: d="the last part of something" · s="The _____ of the film is very sad. In the last scene the hero dies." · a=["end"] · mc=["beginning","middle","start"]
- `g1u09.w.to-need` ← v1 `to need`: d="to must have something" · s="My pet rabbit is hungry; I _____ to buy more food because we have run out." · a=[] · mc=["to enjoy","to refuse","to hide"]

## Unit transcripts (textbook sentences live here — use them first)

```
----- SB: SB Unit 9- Unusual pets.txt -----
Page 66
Unit 9: Unusual pets
At the end of unit 9 ...
you know ☐ 11 words for pets ☐ how to use question words (what, where, how often) ☐ how to use object pronouns (Pronomen als Objekte) ☐ how to use the possessive 's ☐ more irregular plural forms
you can ☐ talk and ask questions about pets ☐ understand a short newspaper article about pets ☐ understand a letter about a problem ☐ write an email about a problem
VOCABULARY Pets
mouse rabbit pony cat guinea pig tortoise fish dog rat budgie hamster
3/1 🔊 1 Look and write the words and the correct number of animals under the pictures. Then listen and check.
[Image description: 4 rows of animal pictures in colored boxes showing various pets including dogs, mice, birds, fish, rats, guinea pigs, ponies, fish, cats, tortoises, rabbits, and hamsters]
1 .......one dog........ .......six mice........ ................................. .................................
2 ................................. ................................. ................................. .................................
3 ................................. ................................. ................................. .................................
4 .......two ponies..... ................................. ................................. .................................
LISTENING
3/2 🔊 2 Listen to Mr White talking about his unusual pet and tick the correct answers.
[Image description: Photos showing a shark, pig, owl, cage, aquarium, and pool]
1 Mr White's pet is: ☐ a shark ☐ a pig ☐ an owl 2 His pet's name is: ☐ Mr Big Mouth ☐ Mr Bacon ☐ Mr One-Eye 3 His pet lives in: ☐ a cage ☐ a tank ☐ a swimming pool 4 His pet eats: ☐ fish and beef ☐ bananas ☐ fish and chips 5 He feeds his pet: ☐ once a day ☐ twice a day ☐ three times a day
🔵 WB p. 75, 76, 80 🌐 CYBER Homework 25 (Revision)
Page 67
READING
3 Read the newspaper article.
Pets in the UK*
There are more than 66 million people in the UK and between them they own about 51 million pets. In fact, 45% of the population have a pet, so many families have more than one. The UK's favourite pets are dogs. There are 9 million dogs and 8 million cats in the UK. Other pets are fish, rabbits, birds, guinea pigs, hamsters, lizards, mice, spiders and ponies.
Some families in the UK have very unusual or dangerous pets. At the moment, there are about 700 dangerous snakes, 36 camels, 36 scorpions, about 75 crocodiles, nearly 300 big cats and one zebra in homes across Britain. A family in Cambridge has got a snow leopard. A man near Chester has a cheetah at an old farm.
[Image description: Photos of various animals labeled - lizard, zebra, spider, camel, snow leopard, cheetah]
VOCABULARY: *UK (United Kingdom) – Vereinigtes Königreich
4 How many of these tasks can you do?
1 Dogs are the number 1 pets in the UK. T / F 2 There are 7 million cats in the UK. T / F 3 Hamsters are the UK's favourite pets. T / F 4 How many people are there in the UK? ☐ about 51 million ☐ about 60 million ☐ about 66 million 5 What animal is not a pet in the UK? ☐ a camel ☐ a snake ☐ a bear 6 What pet has a man got in Chester? ☐ a cheetah ☐ a tiger ☐ a snow leopard 7 Are there more dogs or cats in the UK? ................................................................................................. 8 Can you name three big cats? ................................................................................................. 9 Can you name two dangerous pets? .................................................................................................
3/3 🔊 5 Check your answers with a partner. Then listen to the text.
6 Read the interview and complete it with the questions from the box.
What does he eat? Where do you keep him? What is it? What's his name? How often do you feed him?
Presenter Mrs Manson, you've got an unusual pet. ¹......................................................................................................... Mrs Manson An elephant. Presenter Wow. ²................................................................................................. Mrs Manson Mr Big Ears. Presenter ³......................................................................................................... Mrs Manson Three or four times a day. Presenter ⁴......................................................................................................... Mrs Manson A lot of grass and fruit. Presenter ⁵......................................................................................................... Mrs Manson In my garden. It's very big.
3/4 🔊 7 Now listen and check.
🔵 WB p. 77, 80
Page 68
SPEAKING Talking/Asking about pets
8 C H O I C E S
👥 A Read the dialogue. Then act it out.
Girl Have you got a pet? Boy Yes, a cat. His name is Roonie. Girl What colour is he? Boy Brown and white.
👥 B Work in pairs. Student A asks questions about his/her partner's pet and completes the information in box 2. Student B looks at box 1 on page 83 in the Workbook. Then swap roles.
[Image description: Photos of two students with speech bubbles showing conversation prompts]
What's your unusual pet? What's its name? What does it eat? Where do you keep it? How often do you feed it?
1 Your pet: • Your pet is a spider. • Its name is Mr Longlegs. • It lives in a box. • You feed it once a week. • It eats insects.
2 Your partner's pet: • .................................... has got an unusual pet. • It's a .................................... . • Its name is .................................... . • It lives in a big .................................... . • .................................... feeds his/her pet .................................... a day. • It eats .................................... .
A SONG 4 U
3/5+6 🔊 9 Listen and sing.
Hamster Blues
Day after day, Day after day, running in a wheel. it's the same old meal. Day after day, Day after day, well – how would you feel? well – how would you feel?
Let me go. Let me go Let me go. Let me go ... where the hamsters are free. Let me be. Let me be, I run and I run, let me just be me. day after day. And so I think I'll just run away.
[Image description: Illustration of a hamster in a cage]
Hooray!
Now listen and see –
I'm free!
🔵 WB p. 83 🌐 CYBER Homework 26
Page 69
READING
📖 10 Read the story.
Archie's toys
[Image description: Illustration of a dog]
"I'm sorry, Clare," Mum says one morning to her daughter*. "We can't keep Archie, he must go and live with Grandpa. The country is good for Archie, the city isn't the right place for him. All day long he plays with his cuddly toys* but he doesn't often go out to play."
"Oh, Mum," Clare answers. "NO! That's too far away."
"I'm really sorry," Mum says. Clare is very sad.
On Sunday they drive to Grandpa's house. Archie likes it there, he can run and run. There is also a cat and Archie likes the cat because he can chase* it.
[Image description: Illustration of dog chasing cat]
But when Clare and her mother leave, Archie also looks very sad, and he doesn't want to run any more and he doesn't want to chase the cat any more.
A week later, Grandpa calls Clare's mother. "I'm very sorry, dear, but I can't find Archie." Clare's mother doesn't tell her daughter. The next day, Grandpa calls again. "Sorry, I still can't find him."
Now Clare's mother tells her about Archie. She wants to go to Grandpa right now, but Mum says, "Let's wait until Sunday."
On Sunday they visit Grandpa, but there's no Archie. Everybody is sad. Grandpa gives Clare two baskets of apples and plums* from his garden. Clare likes that, but she is still sad about Archie and does not eat them.
When they get home again, Mum opens the door to the apartment. Then she goes back to the car and she and Clare carry the fruit baskets into the apartment. Clare hears a noise. "What's that?" she says. She goes into her room – and there is Archie. In his mouth are his two favourite cuddly toys.
"Oh dear, oh dear," Mum says, "he wants his toys." "Yes," Clare says, "and he can find his way home! What a clever dog!"
Archie stays a week with Clare and then they take him back to Grandpa. With his cuddly toys, of course.
[Image description: Illustration of Archie with toys]
VOCABULARY: *daughter – Tochter; cuddly toy – Stofftier; chase – jagen; plum – Zwetschke
11 How many of these tasks can you do?
1 What place is good for Archie? ☐ the country ☐ the apartment ☐ the city 2 At Grandpa's place, Archie can now ☐ play with his toys. ☐ chase the cat. ☐ play with the birds. 3 Archie is sad when ☐ he sees Grandpa. ☐ Clare and her mum leave. ☐ the cat stops playing. 4 Grandpa calls twice to say that he can't find Archie. T / F 5 Clare and Mum wait for two days before they go to Grandpa again. T / F 6 At Grandpa's place, Clare eats oranges and plums. T / F 7 How does Clare feel at Grandpa's place? ................................................................................... 8 Why does Clare call Archie a clever dog? ................................................................................... 9 Where does Archie live at the end of the story? ...................................................................................
3/7+8 🔊 12 Check your answers with a partner. Then listen to the story.
🔵 WB p. 80, 81
Page 70
OUR YOUNG WORLD 3
▶️ Jamie's pet
[Image description: Video frame of Jamie holding papers]
▶️ 1 Which of these do you think is Jamie's pet? Watch and tick.
[Image description: 6 animal photos labeled 1-6 showing frog, cat, dog, turtle, spider, and parakeet]
▶️ 2 Watch again and answer the questions.
1 How many teeth does Tammy have? ................................................................................................. 2 What are her teeth called? ................................................................................................. 3 Where is Tammy in her tank? ................................................................................................. 4 What have both Tammy and Jamie got? ................................................................................................. 5 What does Tammy eat? ................................................................................................. 6 Who doesn't like Tammy very much? .................................................................................................
VOCABULARY: *fur – Fell
FIND OUT
3 In pairs. Write two questions for Tammy.
1 .................................................................................................................................................................................. ? 2 .................................................................................................................................................................................. ?
4 Swap questions with another pair. Find the answers to their questions.
Our digital world
5 In pairs. Read and answer the questions.
Having your own blog can be a cool hobby. You can tell people about the things you are interested in. It's also a good way to meet people who are interested in the same things.
[Image description: Photo of person filming a blog]
1 What would you talk about on your blog?
But be careful. Don't put personal information on your blog.
2 What things should you not put on your blog?
CYBER PROJECT: The digital world
6 Work in groups. What should you (not) put on your blog? • Create a powerpoint presentation. • Show it in class.
🌐 CYBER Project 3
Page 71
READING
13 Read the letter.
[Image description: Cartoon hamster character with note "Have you got a problem? write to Olivia, the clever owl."]
Dear Aunty Olivia,
I've got a problem. I'm a hamster. I live in a small cage with my brother and my sister. Our owners are a boy and a girl. The girl's name is Mandy. We like her a lot. She gives us lots of nice food. She often plays with us. Mandy's school bag is big. She sometimes carries us to school in her school bag. Yes, we love her.
The problem is Mandy's brother Bob. We don't like him very much. He doesn't give us nice food. He only feeds us spiders – we hate them. Bob sometimes pulls my ears. I don't like it. What can I do?
Best wishes, Harry the hamster
Contact: harry@hamster.co.uk
[Image description: Illustration of girl with hamsters]
14 How many of these tasks can you do?
1 Harry is a hamster. T / F 2 Mandy often plays with the hamsters. T / F 3 Harry the hamster has an email address. T / F 4 The hamsters ........................................................................ in a small cage. 5 Bob is Mandy's ........................................................................ . 6 The hamsters do not ........................................................................ Bob. 7 How many hamsters are there? ................................................................................................................. 8 Why does Harry like Mandy? ................................................................................................................. 9 What is the problem with Bob? .................................................................................................................
15 Check your answers with a partner.
16 Read Aunty Olivia's answer. Complete it with the words from the box.
her them he they you him
To: harry@hamster.co.uk Subject: Your problem with Bob
Dear Harry,
Thank you for your letter. It's great that Mandy is so nice. It's great that she loves ¹.................................. and you love ².................................. . Bob isn't bad. He likes you, but ³................................ doesn't understand hamsters. He thinks ⁴................................ eat spiders. He doesn't know that hamsters don't eat ⁵.................................. . The next time Bob pulls your ears, bite ⁶.................................. ! Love, Aunty Olivia
🔵 WB p. 81
Page 72
SOUNDS RIGHT /æ/
3/9 🔊 17 Listen and repeat.
Sam the rat had a chat with Billy the bat and Carl the cat on a mat in front of my flat.
[Image description: Illustration of animals on a mat]
WRITING
18 Look at Harry's letter in 13 and Olivia's email in 16. What do they say at the beginning? And at the end?
............................................................................................................................................................. .............................................................................................................................................................
19 Read the different ways to begin or end a letter or an email. Write B (Beginning) or E (End) next to them.
Hi John, ⭕ Bye for now, Sam ⭕ Dear Peter, ⭕
Best wishes, Anne ⭕ Hello Tony, ⭕ Love, Sheila ⭕
20 Imagine you are a pet and you've got a problem.
Think about: • what pet you are • your name • where you live • what you eat • what problem you have
[Image description: Illustration of two cats on a couch]
21 Now write an email (60–80 words) about your problem to Olivia, the owl. Use Harry's letter in 13 to help you. Use a good beginning and ending.
🔵 WB p. 81
Page 73
GRAMMAR
▶️ Question words
So stellst du Fragen mithilfe der Fragewörter What / Where / How often:
What is your pet? is its name? does it eat?
Where is your dog? does she keep her hamster? do you live?
How often does he feed his pet? do you phone your friends?
[Image description: Cartoon showing two people on a couch with a crocodile, with speech bubble "Where do you keep your crocodile?"]
▶️ Object pronouns
Pronomen als Objekte:
I – me Do you like me? you – you Nice to meet you. he – him We don't like him. she – her We love her. it – it How often do you feed it? we – us She carries us to school. they – them We hate them.
Irregular plurals (3)
one mouse → two mice one pony → two ponies
▶️ Possessive 's
So sagst du, dass ein Ding, ein Tier oder eine Person zu jemandem gehört:
Mandy's brother is the problem. Mr White's pet is a shark. Mandy's school bag is big.
MORE FUN WITH FIDO!
[Image description: Four-panel comic strip showing a dog and people by a fence with speech bubble "Well, I am an unusual pet!"]
⏪ Now go back to page 66. Check ☑ with a partner what you know / can do.
🔵 WB p. 77, 78, 79 🌐 CYBER Homework 27
Page 74
THE TWINS 4
▶️ The blue T-shirt
Developing speaking competencies
Language function | Speaking strategy ☐ I can compliment someone (jemandem | ☐ I can respond to compliments (sich für Komplimente machen) | ein Kompliment bedanken)
VOCABULARY Clothes
1 Look at the photos. What clothes can you see? Guess who they belong to. Lucy or Leo? Discuss with a partner.
[Image description: 6 numbered photos showing clothing items - dress/skirt, red cap, blue t-shirt with heart design, red sneakers, floral skirt, and jeans]
3/10 🔊 2 Watch or listen to the dialogue. Then read it. What clothes do Lucy and Leo talk about?
▶️
Lucy Hey, Leo. I can't find my blue T-shirt. Do you know where it is? Leo Your blue T-shirt? Lucy Yes, my blue T-shirt. My favourite blue T-shirt. Do you know where it is? Leo Um ... No, I don't. Lucy Oh, that's a shame. I want to go out and I really need it. Leo Well, I really like your T-shirt, the T-shirt you've got on now. Lucy Thank you. Leo Yes, your T-shirt really suits you. Lucy Um ... That's kind of you. Leo You look good in red.
[Image description: Photo of two children with bikes outdoors]
Lucy Um ... Thanks. Leo, are you OK? I mean is everything alright? Leo Yes, I'm fine. Why? Lucy No reason.
Page 75
3 Complete the sentences with one word.
1 Lucy can't ................................................................. her blue T-shirt. 2 Leo ................................................................. know where Lucy's T-shirt is. 3 Lucy has got a ................................................................. T-shirt on. 4 Leo ................................................................. likes her T-shirt.
USEFUL PHRASES Complimenting
4 Write the words in the correct order to make sentences.
1 your / I / T-shirt / like / really ........................................................................................................... 2 really / T-shirt / you / your / suits ........................................................................................................... 3 look / red / good / you / in ...........................................................................................................
? What do you think? Answer the questions.
• Why is Leo so nice? • Where is Lucy's T-shirt?
MOBILE HOMEWORK
▶️ Watch part 2 of the video and put the events in the correct order.
☐ Lucy finds her T-shirt. ☐ Lucy gets her bike from the garage. ☐ Lucy asks Leo for some help. ☐ Lucy washes her bike. ☐ Leo turns Lucy's bike over. ☐ Lucy asks for Leo's cloth. ☐ Lucy splashes Leo with water.
SPEAKING STRATEGY Responding to compliments
5 Complete the dialogue with the correct words. Then check with the dialogue in 2.
Leo Well, I really like your T-shirt, the T-shirt you've got on now. Lucy T................................................ y................................................ . Leo Yes, your T-shirt really suits you. Lucy That's k................................................ of y................................................ .
6 C H O I C E S
👥 A Work in pairs.
A Compliment your friend's shoes/shirt/socks. → B Respond.
A I like your shoes.
B Thank you.
👥 B Walk around the classroom.
• Compliment the other students on their clothes. • Respond to their compliments.
🔵 WB p. 82


----- WB: WB Unit 9 Unusual pets.txt -----
Unit 9 Unusual pets
Pages 75-76
UNDERSTANDING VOCABULARY Pets
1 Write the names of the animals under the pictures.
[Word bank on left side:] lizard dog cat fish rabbit hamster pony mouse tortoise guinea pig mice budgie
[Images numbered 1-12 showing various pets:]
[Image of a hamster/mouse]
[Image of a rabbit]
[Image of a pony]
[Image of a cat]
[Image of a guinea pig]
[Image of a tortoise]
[Image of a goldfish]
[Image of a black dog]
[Image of a hamster]
[Image of a budgie]
[Image of two mice]
[Image of a lizard]
2 Look at the pictures and tick T (True) or F (False).
1 There is one cat. T ☐ F ☐ 2 There are two tortoises. T ☐ F ☐ 3 There are eight budgies. T ☐ F ☐ 4 There are five fish. T ☐ F ☐ 5 There are nine mice. T ☐ F ☐ 6 There are five ponies. T ☐ F ☐ 7 There are two dogs. T ☐ F ☐ 8 There are four rabbits. T ☐ F ☐
[Large illustration on right showing various animals including cats, dogs, ponies, fish, birds, rabbits, and tortoises]
Pages 76-77
3 Find and circle eleven pet words in the wordsearch. (← → ↑ ↓)
[Word search grid with 10x10 letters:] N R A B B I T Y N B P L I Z A R D M B R D E G S U B Y J U E O S F C E G T K D T G U I N E A P I G S V O S W D T O Z I M M M H H K A N R E A Y N T A C I Y O P H R U E S I O T R O T
USING VOCABULARY Pets
4 Find the correct words in the box and write them under the pictures.
[Word bank on left:] low khasr plaeetnth gfor mcale ziradl hheecta ezbar alligor capinel girte gip kanse rta raeb
[Images numbered 1-15 showing various animals:]
[Zebra]
[Shark]
[Monkey/Ape]
[Pig]
[Elephant]
[Camel]
[Bear]
[Tiger]
[Owl]
[Cheetah]
[Pelican]
[Giraffe]
[Snake]
[Rat]
[Lizard]
5 Complete the text with the correct words.
My pet ¹............................ a lizard. Its name ²............................ Claws. It ³............................ in a big glass box. I ⁴............................ it three times a week. It ⁵............................ insects.
[Illustration showing a girl with a pet lizard in a glass tank]
Pages 77-78
UNDERSTANDING GRAMMAR Question words
6 Match the questions and answers.
1 Have you got a pet? ☐ One year. 2 What is it? ☐ In a big cage. 3 What's the name of your pet? ☐ Carrots, broccoli and apples. 4 What does it eat? ☐ Every day. 5 Where do you keep it? ☐ Its name is Nutcracker. 6 What colour is it? ☐ Yes, I have. 7 How old is it? ☐ A hamster. 8 How often do you feed it? ☐ Brown.
UNDERSTANDING GRAMMAR Object pronouns
7 Circle the correct sentence.
1 I like Sandra. I like her. / I like him. 2 I don't like Tony. I don't like them. / I don't like him. 3 Give the books to Nick and me. Give them to me. / Give them to us. 4 Where are you, John? I can't see you. / I can't see us. 5 Look at this mountain bike. I like it. / I like her. 6 Give the book to Nick and Sandra. Give it to us. / Give it to them.
8 Look at the pictures and number the sentences.
☐ Give it to me! ☐ I don't like them. ☐ Don't touch it! ☐ He loves her. ☐ Please help us! ☐ Let's ask him.
[Six illustrations showing various scenarios:
Two people in a laboratory/science setting
Two people with hearts around them, appearing romantic
Three people near the Eiffel Tower with a policeman
People in water near a boat
Two people exchanging a gift
Two people at a shoe shop]
Pages 78-79
UNDERSTANDING GRAMMAR (Irregular) Plurals
9 Complete the sentences. Write numbers and plural nouns.
1 My friend Leonie has got six hamsters. (hamster / 6) 2 My friend Elisabeth has got ................................................................ . (pony / 2) 3 My friend Sam has got ................................................................ . (guinea pig / 4) 4 My friend Emily has got ................................................................ . (budgie / 7) 5 My friend Tim has got ................................................................ . (fish / 13) 6 And my friends Jacob and Fred have got ................................................................ . (mouse / 3)
USING GRAMMAR Question words
10 Complete the dialogues with the words from the box.
[Word bank:] Does Can Where How often Is Do What How
1 A ......................... do you feed your hamster? 5 A ......................... you like pets? B Milk and corn. B Yes, I do.
2 A ......................... do you feed your cat? 6 A ......................... your sister like pets? B Once a day. B No, she doesn't.
3 A ......................... do you keep it? 7 A ......................... are you today? B In a basket in my room. B I'm fine, thanks.
4 A ......................... you ride* a pony? 8 A ......................... this your dog? B No, I can't. B No, it isn't.
*VOCABULARY: ride – reiten
11 Write the questions for the answers.
1 What's your pet's name? – Billy. 2 .................................................................................................... – He's a dog. 3 .................................................................................................... – Dog food and carrots. 4 .................................................................................................... – In my bedroom. 5 .................................................................................................... – Twice a day.
USING GRAMMAR Object pronouns
12 Complete the sentences with the words from the box.
[Word bank:] it her it us me them him
1 This is my pet. Do you like .......................... ? 2 There's Steve. Let's talk to .......................... ! 3 We play football on Sundays. Come and play with .......................... ! 4 Jennifer is in my class. Do you like .......................... ? 5 Please phone .......................... on Sunday. I'm home all day. 6 I don't like this game – I can't play .......................... ! 7 We haven't got cats at home – we don't like .......................... .
Pages 79-80
USING GRAMMAR (Irregular) Plurals
13 Look at the picture and write sentences about the pets.
[Large illustration showing a pet shop scene with various animals: rabbits hanging from ceiling, dogs, cats, fish in tanks, tortoises, birds, hamsters in cages, and lizards]
1 There are two dogs. 2 ............................................................................................... 3 ............................................................................................... 4 ............................................................................................... 5 ............................................................................................... 6 ...............................................................................................
USING GRAMMAR Possessive 's
14 Rewrite the sentences.
1 John has got a black and white dog. John's dog is black and white.
2 Lily has got three friends: Isabella, Olivia and Sophie. ...............................................................................................
3 My brother has got a blue mountain bike. ...............................................................................................
4 Bob has got a sister. She's 15 years old. ...............................................................................................
5 Harry the hamster has got this email address: harry@hamster.co.uk. ...............................................................................................
6 My dad has got a car. It's a VW. ...............................................................................................
7 Mr Roger has got an unusual pet: a lizard. ...............................................................................................
Pages 80-81
READING & WRITING Talking about pets / Writing notes / Writing about a problem
15 Write the words in the correct order to make sentences about Mr White's pet.
1 unusual / Mr White / got / pet / has / an ...............................................................................................
2 shark / got / has / He / a ...............................................................................................
3 shark's / The / is / Mr One-Eye / name ...............................................................................................
4 keeps / swimming pool / He / him / the / in ...............................................................................................
5 shark / eats / The / fish / beef / and ...............................................................................................
6 Mr White / four times / feeds / a day / shark / the ...............................................................................................
[Illustration of a shark in a swimming pool]
1/29
16 Complete the sentences with the words from the box. Then listen and check.
[Word bank:] How often What Where What's
Interviewer Ms Priestly, tell me about your unusual pet. Ms Priestly Sure. Ask me a question. Interviewer ¹................................................................ is it? Ms Priestly A crocodile. Interviewer Wow. ²................................................................. its name? Ms Priestly Mr Big Teeth. Interviewer Ha ha ha. ³................................................................. do you feed him? Ms Priestly Once a day. Interviewer ⁴................................................................. do you keep him? Ms Priestly In my swimming pool.
17 Read the notes and match them with the pictures.
[Three note images shown on a refrigerator/board:]
"James, can you feed my hamster tonight? I'm staying at Oliver's house. Thanks, Ian"
"Lucy, can you take the dog for a walk before dinner? Thanks, Mum"
"Mum, can you get some dog food when you go to the shops? Thanks, Jenny"
18 Write notes for these situations in your exercise book.
1 You want your brother to feed your fish. 2 You want your mum to give your dog a bath*. 3 You want your dad to buy you some cat food.
*VOCABULARY: have a bath – ein Bad nehmen
Pages 81-82
19 CHOICES
A Read Emma's text. Then tick T (True) or F (False).
Hi, my name's Emma. I've got an unusual pet. It's an owl. Her name's Wise One. She lives in a big, old tree next to our house. In the evening, I open the window. Then Wise One comes into my room. She can speak and she tells me lots of stories. She is very clever. At midnight, Wise One flies away. Then she flies around and tries to find food. She eats mice. So I don't feed her. In the morning, Wise One flies back to her tree. She sleeps in the tree during* the day.
[Illustration of a girl at a window with an owl]
*VOCABULARY: during – während
1 Emma's pet is an owl. T ☐ F ☐ 2 Her pet's name is Wally. T ☐ F ☐ 3 Emma keeps the owl in a box in her room. T ☐ F ☐ 4 The owl comes to Emma's room in the evening. T ☐ F ☐ 5 The owl can juggle. T ☐ F ☐ 6 The owl is very clever. T ☐ F ☐ 7 Emma's owl eats chocolate. T ☐ F ☐ 8 She flies away again in the morning. T ☐ F ☐
B 1 Read the letter. Then answer the questions.
Dear Aunty Olivia,
I've got a problem. My name's Blackie. I'm a dog and I'm very big. I live in a basket in a house. My owner's are two boys, Dan and Matt. Dan is 12. He's very nice. He plays with me, feeds me twice a day and cleans my basket. Matt is six years old - and that's a big problem. Matt thinks I'm a pony. He wants to ride on me all the time. He feeds me hay*. I don't like hay, and I'm not a pony. Sometimes Matt pulls my ears! What can I do?
Love, Blackie
*VOCABULARY: hay – Heu
[Illustration of a dog with two boys, one on horseback with hay]
1 What animal is Blackie? ............................................................................................... 2 Where does he live? ............................................................................................... 3 Who are his owners? ............................................................................................... 4 How old are they? ............................................................................................... 5 What does Dan do? ............................................................................................... 6 What does Matt do? ...............................................................................................
2 Write an answer to Blackie from Aunty Olivia. Write 80–100 words.
Pages 82-83
LISTENING & DIALOGUE WORK Talking and asking about pets / Complimenting
1/30
20 Listen to Rosie talking about her pet and answer the questions.
1 Why does Rosie like her pet? ...............................................................................................
2 Is Rosie's tarantula dangerous? ...............................................................................................
3 What does it eat? ...............................................................................................
4 What does Rosie do with her pet? ...............................................................................................
5 Where does she keep it? ...............................................................................................
6 What's the name of her pet? ...............................................................................................
[Image of a rose hair tarantula spider]
1/31
21 Complete the speech bubbles. Then listen and check.
[Four comic-style scenes with speech bubbles:]
[Scene in a clothing store] "That dress r........................... s........................... you. You l........................... really g........................... in pink."
[Scene on street] "T........................... k........................... of you."
[Scene with two people] "I r........................... l........................... y........................... cap."
[Scene with two people] "T........................... y........................... ."
22 Look at the picture and write your own dialogue.
A ................................................................................... B ................................................................................... A ................................................................................... B ................................................................................... A ................................................................................... B ...................................................................................
[Illustration showing two people in what appears to be a clothing store or dressing room]
Pages 83-84
23 Work in pairs. Student A asks questions from page 68 in the Student's Book. Student B answers the questions with the information in box 1 in the Workbook. Then swap roles.
1 Your pet: • Your pet is a crocodile. • Its name is Snap. • It lives in a big tank. • You feed it five times a day. • It eats fish and mice.
2 Your partner's pet: • .................................... has got an unusual pet. • It's a .................................... . • Its name is .................................... . • The pet lives in .................................... . • .................................... feeds his/her pet .................................... a week. • It eats .................................... .
WORD FILE
(Unusual) Pets
[Large illustrated scene showing various unusual pets in enclosures and tanks, with labels:]
owl (on perch)
budgie (on wire)
elephant (in enclosure)
spider (hanging)
bat (hanging)
shark (in water tank)
zebra (in enclosure)
camel (in enclosure)
pony (in enclosure)
guinea pig (with person)
fish (in water)
pig (on floor)
rabbit (on floor)
lizard (on floor)
rat (on floor)
mouse (on floor)
tortoise (on floor)
Where you keep pets/animals
[Four illustrations showing different animal enclosures:]
box [shallow tray with bedding]
tank [aquarium-style tank]
cage [wire cage]
terrarium [glass terrarium]
MORE Words and Phrases
Number	English	German Example	German Translation
1	unusual	A snake is a very unusual pet.	ungewöhnlich, außergewöhnlich
2	mouse (pl mice)	I have a mouse and a dog and my friend has four mice.	Maus
	(...) a day	She walks her dog three times a day.	(...) am Tag
	once	He feeds his hamster once a day.	einmal
	twice	I only feed my spider twice a week.	zweimal
3	across (Britain)	There are lots of pets in homes across Britain.	hier: in ganz (Großbritannien)
	dangerous	Crocodiles are dangerous animals.	gefährlich
	farm	She lives on a farm with horses and pigs.	Bauernhof
	man (pl men)	The man's name is John.	Mann
	near	The Smith family lives near London.	in der Nähe von
	newspaper	My dad always reads the newspaper in the morning.	Zeitung
10	(...) a week	He feeds his spider once a week.	(...) in der Woche
	basket	Grandpa gives her two baskets of apples and plums.	Korb
	daughter	Clare is her daughter.	Tochter
	to drive	On Sunday, they drive to Grandpa's house.	fahren
	everybody	Everybody in class is sad today.	jede/r
	far away	Grandpa's house is far away.	weit weg
	grandpa	My grandpa lives on a farm.	Opa
	mother	She lives at home with her mother.	Mutter
	noise	Clare hears a noise in the apartment.	Geräusch
	to stay	We can't stay here.	bleiben
	cuddly toy	All day long he plays with his cuddly toys.	Stofftier
	to visit	On Sunday, they visit Grandpa.	besuchen
OWB	to be interested in	Tell me about the things you are interested in.	an etw. interessiert sein
	fur	My pet has fur – lots of it.	Fell
	personal	Don't put personal information on your blog.	persönlich
	owner	Jamie is the owner of an unusual pet.	Besitzer/Besitzerin
13	aunty	Aunty Jane is Mum's sister.	Tante (Koseform)
	dear	Dear Aunty Olivia, ...	liebe/r (Anrede)
	letter	Thank you for your letter.	Brief
16	to bite	I don't like that dog. It bites!	beißen
18	beginning	The beginning of the film is fantastic.	Anfang
19	to begin	He always begins his emails with "Hi!".	anfangen, beginnen
	best wishes	Best wishes to your mum and dad, Peter.	herzliche Grüße
21	ending	The ending of the book is very strange.	Ende, Schluss
T4	to need	I really need your help.	brauchen

```

## Output contract

Write `content/corpus/units/g1-u09/gen/vocab.draft.json`:

```jsonc
{
  "schema": "vocab-draft@1",
  "slug": "g1-u09",
  "briefBank": "3757b4788b29",
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
