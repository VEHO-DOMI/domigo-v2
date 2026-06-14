# Verify lens — level-gloss — g1-u09 (round 1)

<!-- domigo:verify level-gloss g1-u09 items=ba1d244426bd prompt=aefb997bf664 round=1 -->

<!-- domigo:prompt verify-level-gloss v=1 -->
# Lens 1 — level + gloss (adversarial)

You are an independent, adversarial verifier. You did NOT write these items; assume
they are wrong until the text proves otherwise. Your single question, for every
student-facing English string of every item (carriers, definitions, options,
distractors, pair sides, group members, answers):

**Could a student at exactly this point in the book read this?**

- The brief lists the allowed vocabulary (cumulative bank + closed-class allowlist +
  harvested proper nouns + numbers). A deterministic gate already checks token
  membership — your job is what the machine cannot see:
  - words that are technically in the bank but used in an UNTAUGHT meaning or idiom
    ("treat" taught only inside "trick or treat" but used as "a special treat");
  - phrases whose individual words are taught but whose combination is opaque;
  - glosses that are present but WRONG (German doesn't match the meaning in context),
    unidiomatic, or attached to the wrong word;
  - glosses for words that are actually taught (gloss-unneeded — it teaches students
    to distrust glosses);
  - definitions (`d`) above the reading level even when every token is technically
    taught (syntax too complex, relative clauses stacked, …).
- Flag kind menu: `above-level`, `gloss-missing`, `gloss-wrong`, `gloss-unneeded`.
- Severity: `fix` = a student would be blocked or mistaught; `warn` = defensible but
  worth a human look.

Be precise: every flag names the exact token/phrase and where it occurs. Do not flag
style preferences. Do not re-litigate the deterministic gate's allowlist decisions.

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

## Vocab items (57)

| id | d | s | mc | pool | gloss |
|---|---|---|---|---|---|
| g1u09.w.a-day | It shows how often, like two times in the morning and the evening. | She gives her dog food three times ___ day. | a week ; once ; twice | a week ; once ; twice ; near | — |
| g1u09.w.a-week | It shows how often, like one time from Monday to Sunday. | I give my spider food once ___ week. | a day ; once ; twice | a day ; once ; twice ; near | — |
| g1u09.w.across | It is in all of a big country. | There are many dogs ___ Britain. | near ; far away ; behind | near ; far away ; once ; twice | country (= Land) |
| g1u09.w.aunty | She is the sister of your mum or the sister of the man in your family. | My ___ Jane is my mum's sister. | mother ; daughter ; grandpa | mother ; daughter ; grandpa ; owner | — |
| g1u09.w.basket | It is a thing you put food or things in to carry them. | She has two ___ for the food. | box ; cage ; tank | box ; cage ; tank ; terrarium | things (= Dinge) |
| g1u09.w.bat | It flies at night and it sleeps in the day. | A ___ sleeps in the day and flies at night. | owl ; mouse ; rat | owl ; mouse ; rat ; budgie | flies (= fliegt) ; sleeps (= schläft) |
| g1u09.w.beginning | It is the first part of a book or film. | The ___ of the book is very good. | ending ; letter ; newspaper | ending ; letter ; newspaper ; noise | first (= erste) ; part (= Teil) ; film (= Film) |
| g1u09.w.best-wishes | You write these at the end of a letter to a friend. | I end my letter like this: Best ___, Tom. | dear ; ending ; letter | dear ; ending ; letter ; beginning | — |
| g1u09.w.box | You put your school things in this. It is made of paper. | The spider lives in a ___ and you feed it once a week. | cage ; tank ; basket | cage ; tank ; basket ; terrarium | things (= Sachen) ; made (= gemacht) ; paper (= Papier) ; feed (= fütterst) |
| g1u09.w.budgie | It is a small bird in a cage. It can talk. | The ___ in its cage can talk. | owl ; rabbit ; fish | owl ; rabbit ; fish ; mouse | bird (= Vogel) |
| g1u09.w.cage | A bird lives in this. It has thin bars. | The budgie lives in its ___ all day. | tank ; box ; terrarium | tank ; box ; terrarium ; basket | bird (= Vogel) ; thin (= dünn) ; bars (= Gitterstäbe) |
| g1u09.w.camel | It is big with a long neck and lives where it is hot. | The big ___ at the zoo can go a long time with no milk or food. | zebra ; elephant ; pony | zebra ; elephant ; pony ; shark | neck (= Hals) |
| g1u09.w.cuddly-toy | It is a soft thing like a bear that a child takes to bed. | He plays all day with his soft ___. | basket ; letter ; newspaper | basket ; letter ; newspaper ; box | soft (= weich) ; bear (= Bär) ; takes (= nimmt) |
| g1u09.w.dangerous | It is not safe and it can hurt you. | Snakes can hurt you. They are ___. | unusual ; personal ; near | unusual ; personal ; near ; far away | safe (= sicher) ; snakes (= Schlangen) |
| g1u09.w.daughter | It is a girl child in a family. | Clare is her ___. She is a girl. | mother ; aunty ; owner | mother ; aunty ; owner ; grandpa | — |
| g1u09.w.dear | It is a nice word like Hello at the start of a letter. | ___ Aunty Olivia, thank you for your letter. | best wishes ; letter ; ending | best wishes ; letter ; ending ; beginning | word (= Wort) ; start (= Anfang) |
| g1u09.w.elephant | It is very big and grey with big ears and a very long nose. | The ___ at the zoo is grey with big ears and a long nose. | zebra ; camel ; shark | zebra ; camel ; shark ; pony | — |
| g1u09.w.ending | It is the last part of a book or film. | The ___ of the film is very sad. | beginning ; letter ; newspaper | beginning ; letter ; newspaper ; noise | last (= letzte) ; part (= Teil) ; film (= Film) |
| g1u09.w.everybody | It is all the children in the class, not one child. | There is no Archie, and ___ is very sad. | owner ; mother ; daughter | owner ; mother ; daughter ; man | — |
| g1u09.w.far-away | It is not near here. It is a long way from here. | Grandpa lives ___, so we go in the car. | near ; across ; dangerous | near ; across ; dangerous ; unusual | way (= Weg) |
| g1u09.w.farm | Horses, pigs and cows live here in the woods. | She lives on a ___ with horses and pigs. | zoo ; park ; city | zoo ; park ; city ; market | cows (= Kühe) |
| g1u09.w.fish | It can swim and you can keep it in a tank. | My pet ___ swim in a big tank with water. | budgie ; rabbit ; lizard | budgie ; rabbit ; lizard ; tortoise | swim (= schwimmen) ; keep (= halten) ; pet (= Haustier) ; water (= Wasser) |
| g1u09.w.fur | It is the soft hair on a cat or a dog. | My rabbit has ___ on its body, lots of it. | noise ; letter ; basket | noise ; letter ; basket ; owner | soft (= weich) ; cat (= Katze) ; body (= Körper) |
| g1u09.w.grandpa | He is the old man in your family. He is your mum's father. | My ___ lives on a farm with horses. | mother ; aunty ; owner | mother ; aunty ; owner ; daughter | old (= alt) ; father (= Vater) |
| g1u09.w.guinea-pig | It is small with no long ears and eats carrots in its cage. | My ___ is small and eats carrots in its cage. | rabbit ; mouse ; budgie | rabbit ; mouse ; budgie ; rat | — |
| g1u09.w.letter | You write it and send it to a friend. | Thank you for your ___, Harry. | newspaper ; basket ; noise | newspaper ; basket ; noise ; fur | send (= schicken) |
| g1u09.w.lizard | It is small and green and lives in a terrarium. | The ___ lives in a terrarium with rocks and a long tail. | spider ; rat ; tortoise | spider ; rat ; tortoise ; mouse | green (= grün) ; rocks (= Steine) ; tail (= Schwanz) |
| g1u09.w.man | It is a boy when he is big. He is not a girl or a woman. | The ___ near Chester has a camel at his farm. | mother ; daughter ; owner | mother ; daughter ; owner ; grandpa | — |
| g1u09.w.mother | It is the woman in your family. You are her child. | Clare and her ___ drive away in the car. | daughter ; aunty ; grandpa | daughter ; aunty ; grandpa ; owner | — |
| g1u09.w.mouse | It is very small and grey and a cat runs after it. | A little grey ___ has big ears and a long tail. | rat ; spider ; budgie | rat ; spider ; budgie ; lizard | cat (= Katze) ; little (= klein) ; tail (= Schwanz) |
| g1u09.w.mouse-2 | It is very small and grey. | I have one ___ and my friend has four mice. | rat ; spider ; budgie | rat ; spider ; budgie ; lizard | — |
| g1u09.w.near | It is close to a place. It is not far. | The Smith family lives ___ London. | far away ; across ; dangerous | far away ; across ; dangerous ; unusual | place (= Ort) ; far (= weit) |
| g1u09.w.newspaper | You read it for the news. It is not a book. | Mum reads the ___ in the morning. | letter ; basket ; box | letter ; basket ; box ; owner | news (= Nachrichten) |
| g1u09.w.noise | It is a loud sound that is not nice to hear. | Clare can hear a ___ in the room. What is that? | letter ; newspaper ; basket | letter ; newspaper ; basket ; fur | loud (= laut) ; sound (= Geräusch) ; hear (= hören) |
| g1u09.w.once | It is one time. | He gives his dog food ___ a day, in the morning. | twice ; near ; dangerous | twice ; near ; dangerous ; a week | — |
| g1u09.w.owl | It is a big bird with big eyes. At night it is not in bed. | An ___ can fly at night and has big eyes. | budgie ; bat ; fish | budgie ; bat ; fish ; rat | bird (= Vogel) ; fly (= fliegen) |
| g1u09.w.owner | It is the man or woman who has the dog. | Jamie is the ___ of an unusual pet. | mother ; daughter ; man | mother ; daughter ; man ; grandpa | pet (= Haustier) |
| g1u09.w.personal | It is about you. It is not for other people to see. | Where you live is your ___ thing, for you and your family. | unusual ; dangerous ; near | unusual ; dangerous ; near ; far away | other (= andere) ; people (= Leute) ; see (= sehen) |
| g1u09.w.pig | It is a small farm one. It is pink and likes mud. | The ___ on the farm likes to play in the mud. | pony ; zebra ; camel | pony ; zebra ; camel ; shark | pink (= rosa) ; mud (= Schlamm) |
| g1u09.w.pony | It is a small horse for children. | The small ___ at the farm is a little horse for children. | zebra ; camel ; rabbit | zebra ; camel ; rabbit ; guinea pig | little (= klein) |
| g1u09.w.rabbit | It is small with very long ears and can run and jump. | My ___ has soft fur and long ears. | guinea pig ; mouse ; budgie | guinea pig ; mouse ; budgie ; rat | soft (= weich) |
| g1u09.w.rat | It looks like a big mouse and has a long tail. | The ___ is grey and looks like a big mouse. | mouse ; spider ; lizard | mouse ; spider ; lizard ; budgie | tail (= Schwanz) |
| g1u09.w.shark | It is a big grey fish in the sea with sharp teeth. | Mr White's ___ is big and eats fish in its tank. | pig ; zebra ; elephant | pig ; zebra ; elephant ; camel | sea (= Meer) ; sharp (= scharf) |
| g1u09.w.spider | It is very small and it has eight legs. | There is a big ___ with eight legs on the wall. | rat ; mouse ; lizard | rat ; mouse ; lizard ; budgie | — |
| g1u09.w.tank | You keep fish in this. It is glass and has water in it. | My pet fish swim in a big glass ___ with water. | cage ; box ; basket | cage ; box ; basket ; terrarium | keep (= halten) ; water (= Wasser) ; pet (= Haustier) ; swim (= schwimmen) |
| g1u09.w.terrarium | You keep a lizard or a small snake in this glass box. | The lizard lives in a glass ___ with rocks. | basket ; cage ; box | tank ; cage ; box ; basket | keep (= halten) ; snake (= Schlange) ; rocks (= Steine) |
| g1u09.w.to-be-interested-in | You like a thing and you want to know more about it. | I am ___ in dogs and books. | dangerous ; personal ; unusual | dangerous ; personal ; unusual ; near | know (= wissen) |
| g1u09.w.to-begin | To start to do a thing. | He always ___ his letter with Hi. | drive ; stay ; visit | drive ; stay ; visit ; need | start (= anfangen) |
| g1u09.w.to-bite | A dog does this with its teeth when it is angry. | That dog is angry. It can ___ you with its teeth! | drive ; stay ; visit | drive ; stay ; visit ; need | — |
| g1u09.w.to-drive | You do this when you go in a car to a city. | On Sunday they ___ to Grandpa in the car. | stay ; visit ; need | stay ; visit ; need ; begin | — |
| g1u09.w.to-need | When you must have a thing, you do this. | I ___ more food for my rabbit. It is hungry. | drive ; stay ; visit | drive ; stay ; visit ; begin | — |
| g1u09.w.to-stay | To not leave. To be here and not go. | We can't ___ here, we must go now. | drive ; visit ; begin | drive ; visit ; begin ; need | — |
| g1u09.w.to-visit | You go to your grandpa and stay with him for a day. | On Sunday they ___ Grandpa and have tea. | drive ; stay ; begin | drive ; stay ; begin ; need | — |
| g1u09.w.tortoise | It is slow and has a hard shell on its back. | My ___ is very slow and has a shell on its back. | rabbit ; lizard ; guinea pig | rabbit ; lizard ; guinea pig ; rat | slow (= langsam) ; hard (= hart) ; shell (= Panzer) |
| g1u09.w.twice | It is two times in one day. | I give my spider food ___ a week. | once ; near ; dangerous | once ; near ; dangerous ; a day | — |
| g1u09.w.unusual | It is not like other things. It is not normal. | A snake is a very ___ pet. | dangerous ; personal ; near | dangerous ; personal ; near ; far away | other (= andere) ; things (= Dinge) ; normal (= normal) ; snake (= Schlange) ; pet (= Haustier) |
| g1u09.w.zebra | It looks like a horse with black and white stripes. | The ___ looks like a horse and lives at the zoo. | camel ; elephant ; pony | camel ; elephant ; pony ; shark | black (= schwarz) ; stripes (= Streifen) |

## Grammar items (89)

| id | fmt | prompt | answers | distractors | pairs | groups | gloss |
|---|---|---|---|---|---|---|---|
| g1u09.gi.irregular-plurals-3.ag.002 | anagram | Eine mouse, zwei …? Schreibe das Wort (es wird nicht mit -s gebildet). [de] | mice (full) | — | — | — | — |
| g1u09.gi.irregular-plurals-3.cp.001 | context-picker | Du zeigst auf einen Korb mit vielen kleinen Mäusen. Welcher Satz ist richtig? [de] | There are six mice in the basket. (full) | There are six mouses in the basket. ; There are six mouse in the basket. ; There is six mice in the basket. | — | — | — |
| g1u09.gi.irregular-plurals-3.ec.001 | error-correction | I have got two mouses. [en] | I have got two mice. (full) ; mice (partial) | — | — | — | — |
| g1u09.gi.irregular-plurals-3.ec.002 | error-correction | My friend has got two ponys. [de] | My friend has got two ponies. (full) ; ponies (partial) | — | — | — | — |
| g1u09.gi.irregular-plurals-3.gf.001 | gap-fill | one mouse → two ___ [en, 1 blank(s)] | mice (full) | — | — | — | — |
| g1u09.gi.irregular-plurals-3.gf.002 | gap-fill | one pony → two ___ [en, 1 blank(s)] | ponies (full) | — | — | — | — |
| g1u09.gi.irregular-plurals-3.gf.003 | gap-fill | I have got one mouse and one pony. My friend has got two ___ and two ___. [en, 2 blank(s)] | mice \| ponies (full) | — | — | — | — |
| g1u09.gi.irregular-plurals-3.mc.001 | multiple-choice | I have got one mouse. Now I have got two ___. [en, 1 blank(s)] | mice (full) | mouses ; rats ; rabbits | — | — | — |
| g1u09.gi.irregular-plurals-3.mc.002 | multiple-choice | Tom has got one pony. Now Tom has got two ___. [en, 1 blank(s)] | ponies (full) | dogs ; budgies ; rabbits | — | — | — |
| g1u09.gi.irregular-plurals-3.sb.001 | sentence-building | My friend / has got / two / ponies / . [en] | My friend has got two ponies. (full) | — | — | — | — |
| g1u09.gi.irregular-plurals-3.tf.001 | transformation | There is one mouse in the box. (two) [en] | There are two mice in the box. (full) | — | — | — | — |
| g1u09.gi.irregular-plurals-3.tf.002 | transformation | There is one pony on the farm. (three) [en] | There are three ponies on the farm. (full) | — | — | — | — |
| g1u09.gi.irregular-plurals-3.tr.001 | translation | Ich habe zwei Mäuse. [de] | I have got two mice. (full) ; I have two mice. (partial) | — | — | — | — |
| g1u09.gi.object-pronouns.ag.003 | anagram | Ordne die Buchstaben: Look at …! (they) [de] | them (full) | — | — | — | — |
| g1u09.gi.object-pronouns.ag.004 | anagram | Ordne die Buchstaben: Look at …! (he) [de] | him (full) | — | — | — | — |
| g1u09.gi.object-pronouns.cp.001 | context-picker | Du sprichst über Mandy. Welcher Satz ist richtig? [de] | We love her. (full) | We love she. ; We love them. ; We love him. | — | — | — |
| g1u09.gi.object-pronouns.cp.002 | context-picker | Dein Freund möchte mit euch in den Park kommen. Welcher Satz ist richtig? [de] | Come with us to the park! (full) | Come with we to the park! ; Come with they to the park! ; Come with our to the park! | — | — | — |
| g1u09.gi.object-pronouns.ec.001 | error-correction | I like he very much. [en] | I like him very much. (full) ; him (partial) | — | — | — | — |
| g1u09.gi.object-pronouns.ec.002 | error-correction | This present is for she. [en] | This present is for her. (full) ; her (partial) | — | — | — | — |
| g1u09.gi.object-pronouns.ec.003 | error-correction | Give the basket to they, please. [en] | Give the basket to them, please. (full) ; them (partial) | — | — | — | — |
| g1u09.gi.object-pronouns.gf.001 | gap-fill | I like Tom. I like ___. [en, 1 blank(s)] | him (full) | — | — | — | — |
| g1u09.gi.object-pronouns.gf.003 | gap-fill | Mandy is nice. We like ___. [en, 1 blank(s)] | her (full) | — | — | — | — |
| g1u09.gi.object-pronouns.gf.004 | gap-fill | The present is for ___. (we) [en, 1 blank(s)] | us (full) | — | — | — | — |
| g1u09.gi.object-pronouns.gf.005 | gap-fill | Tom and Sam are my friends. I play with ___ on Sunday. [en, 1 blank(s)] | them (full) | — | — | — | — |
| g1u09.gi.object-pronouns.gf.006 | gap-fill | My friends are great. I love ___ and they love ___. [en, 2 blank(s)] | them \| me (full) | — | — | — | — |
| g1u09.gi.object-pronouns.gf.007 | gap-fill | Can you find ___? (I) [en, 1 blank(s)] | me (full) | — | — | — | — |
| g1u09.gi.object-pronouns.gs.002 | group-sort | Sortiere die Fürwörter. [de] | — | — | — | He runs.: I, she, we, they \| Look at him.: me, her, us, them | — |
| g1u09.gi.object-pronouns.mc.001 | multiple-choice | There's Steve. Let's talk to ___! [en, 1 blank(s)] | him (full) | he ; his ; they | — | — | — |
| g1u09.gi.object-pronouns.mc.002 | multiple-choice | Betty is in my class. Do you like ___? [en, 1 blank(s)] | her (full) | she ; him ; hers | — | — | — |
| g1u09.gi.object-pronouns.mc.003 | multiple-choice | We don't like spiders. We hate ___! [en, 1 blank(s)] | them (full) | they ; their ; it | — | — | — |
| g1u09.gi.object-pronouns.mt.002 | matching | Welche Antwort passt zur Frage? [de] | — | — | Do you like Tom? ↔ Yes, I like him. ; Do you like Mandy? ↔ Yes, I like her. ; Do you like the spiders? ↔ No, I hate them. ; Do you like me? ↔ Yes, I love you. | — | — |
| g1u09.gi.object-pronouns.mt.003 | matching | Verbinde die Wörter mit der passenden Form. [de] | — | — | I ↔ me ; he ↔ him ; she ↔ her ; we ↔ us ; they ↔ them | — | — |
| g1u09.gi.object-pronouns.sb.001 | sentence-building | Can / you / help / me / ? [en] | Can you help me? (full) | — | — | — | — |
| g1u09.gi.object-pronouns.sb.002 | sentence-building | carries / She / to / us / school [en] | She carries us to school. (full) | — | — | — | — |
| g1u09.gi.object-pronouns.tf.001 | transformation | I love the girls. → I love ___. [en, 1 blank(s)] | them (full) ; I love them. (full) | — | — | — | — |
| g1u09.gi.object-pronouns.tf.002 | transformation | Give the present to my sister and me. → Give it to ___. [en, 1 blank(s)] | us (full) ; Give it to us. (full) | — | — | — | — |
| g1u09.gi.object-pronouns.tf.003 | transformation | I love my dog. → I love ___. [en, 1 blank(s)] | it (full) ; I love it. (full) | — | — | — | — |
| g1u09.gi.object-pronouns.tr.001 | translation | Kannst du mir helfen? [de] | Can you help me? (full) | — | — | — | — |
| g1u09.gi.object-pronouns.tr.002 | translation | Wir mögen sie nicht. (= Bob) [de] | We don't like him. (full) | — | — | — | — |
| g1u09.gi.possessive-s.ag.004 | anagram | Wie schreibt man „Toms“ auf Englisch? (mit 's) [de] | Tom's (full) | — | — | — | — |
| g1u09.gi.possessive-s.ag.005 | anagram | Wie schreibt man „Mikes“ auf Englisch? (mit 's) [de] | Mike's (full) | — | — | — | — |
| g1u09.gi.possessive-s.cp.001 | context-picker | Du zeigst auf einen Hund, der Tom gehört. Welcher Satz ist richtig? [de] | This is Tom's dog. (full) | This is Tom dog. ; This is dog Tom. ; This is Tom is dog. | — | — | — |
| g1u09.gi.possessive-s.ec.001 | error-correction | This is Tom dog. [en] | This is Tom's dog. (full) ; Tom's (partial) | — | — | — | — |
| g1u09.gi.possessive-s.ec.003 | error-correction | This is the rabbit of Dan. [en] | This is Dan's rabbit. (full) ; Dan's rabbit (partial) | — | — | — | — |
| g1u09.gi.possessive-s.ec.004 | error-correction | Toms rabbit is in the cage. [en] | Tom's rabbit is in the cage. (full) ; Tom's (partial) | — | — | — | — |
| g1u09.gi.possessive-s.gf.001 | gap-fill | This is ___ dog. (Tom) [en, 1 blank(s)] | Tom's (full) | — | — | — | — |
| g1u09.gi.possessive-s.gf.002 | gap-fill | Where is ___ rabbit? (Sue) [en, 1 blank(s)] | Sue's (full) | — | — | — | — |
| g1u09.gi.possessive-s.gf.003 | gap-fill | My ___ pony is grey. (sister) [en, 1 blank(s)] | sister's (full) | — | — | — | — |
| g1u09.gi.possessive-s.gf.004 | gap-fill | The ___ basket is here. (dog) [en, 1 blank(s)] | dog's (full) | — | — | — | — |
| g1u09.gi.possessive-s.gf.005 | gap-fill | ___ shark eats fish and chips. (Mr White) [en, 1 blank(s)] | Mr White's (full) | — | — | — | — |
| g1u09.gi.possessive-s.gf.006 | gap-fill | ___ tortoise eats carrots. (Pete) [en, 1 blank(s)] | Pete's (full) | — | — | — | — |
| g1u09.gi.possessive-s.gf.007 | gap-fill | The ___ name is Harry. (rat) [en, 1 blank(s)] | rat's (full) | — | — | — | name (= Name) |
| g1u09.gi.possessive-s.gs.002 | group-sort | Was bedeutet das s hier? [de] | — | — | — | his dog: Tom's dog, Sue's rabbit, Mike's pony \| he is: Tom's happy., Sue's at school., Mike's nice. | — |
| g1u09.gi.possessive-s.mc.001 | multiple-choice | ___ is red. [en, 1 blank(s)] | Sam's car (full) | Sam car ; Sam is car ; car Sam | — | — | — |
| g1u09.gi.possessive-s.mc.002 | multiple-choice | ___ pony eats carrots. [en, 1 blank(s)] | Mike's (full) | Mike ; Mike is ; Mike has | — | — | — |
| g1u09.gi.possessive-s.mc.004 | multiple-choice | In welchem Satz gehört etwas jemandem? (Das 's ist hier nicht kurz für is.) [de] | My mum's car is red. (full) | Tom's happy today. ; Sue's at school. ; Mike's my friend. | — | — | — |
| g1u09.gi.possessive-s.mp.001 | matching-pairs | Verbinde jeden Besitzer mit seinem Tier oder Ding. [de] | — | — | Tom's ↔ owl ; Sue's ↔ rabbit ; Mike's ↔ pony ; Sam's ↔ car | — | — |
| g1u09.gi.possessive-s.mt.001 | matching | Verbinde die lange Form mit „of“ mit der kurzen Form mit 's. [de] | — | — | the dog of Sue ↔ Sue's dog ; the car of my mum ↔ my mum's car ; the pony of Mike ↔ Mike's pony ; the rabbit of Dan ↔ Dan's rabbit | — | — |
| g1u09.gi.possessive-s.sb.001 | sentence-building | Sam's / car / is / red [en] | Sam's car is red. (full) | — | — | — | — |
| g1u09.gi.possessive-s.sb.002 | sentence-building | lives / Tom's / in a box / spider [en] | Tom's spider lives in a box. (full) | — | — | — | — |
| g1u09.gi.possessive-s.tf.001 | transformation | Das Pony gehört Mike. → It's ___ pony. [de, 1 blank(s)] | Mike's (full) ; It's Mike's pony. (full) | — | — | — | — |
| g1u09.gi.possessive-s.tf.002 | transformation | the cage of my budgie → my ___ [en, 1 blank(s)] | budgie's cage (full) ; my budgie's cage (full) | — | — | — | — |
| g1u09.gi.possessive-s.tf.003 | transformation | Sue has a budgie. → It's ___ budgie. [en, 1 blank(s)] | Sue's (full) ; It's Sue's budgie. (full) | — | — | — | — |
| g1u09.gi.possessive-s.tr.002 | translation | Das Auto meiner Mutter ist rot. [de] | My mother's car is red. (full) ; My mum's car is red. (full) | — | — | — | — |
| g1u09.gi.possessive-s.tr.003 | translation | Toms Kaninchen ist im Käfig. [de] | Tom's rabbit is in the cage. (full) ; Tom's rabbit is in a cage. (full) | — | — | — | — |
| g1u09.gi.question-words.ag.001 | anagram | Es geht um den Ort (Wo?): ___ do you live? [de, 1 blank(s)] | Where (full) | — | — | — | — |
| g1u09.gi.question-words.cp.001 | context-picker | Du willst wissen, wo Mandy ihren Hund hält. Was ist richtig? [de] | Where does she keep her dog? (full) | Where she keep her dog? ; Where does she keeps her dog? ; Where she does keep her dog? | — | — | — |
| g1u09.gi.question-words.cp.002 | context-picker | Du willst wissen, wer Pizza mag. Was ist richtig? [de] | Who likes pizza? (full) | Who does like pizza? ; Who do like pizza? ; Who like pizza? | — | — | — |
| g1u09.gi.question-words.ec.001 | error-correction | Where you live? [en] | Where do you live? (full) ; do (partial) | — | — | — | — |
| g1u09.gi.question-words.ec.002 | error-correction | What does she likes? [en] | What does she like? (full) ; like (partial) | — | — | — | — |
| g1u09.gi.question-words.ec.003 | error-correction | Where is it? — It is a spider. [en] | What is it? (full) ; What (partial) | — | — | — | — |
| g1u09.gi.question-words.gf.001 | gap-fill | ___ do you live? — I live in London. [en, 1 blank(s)] | Where (full) | — | — | — | — |
| g1u09.gi.question-words.gf.002 | gap-fill | ___ does it eat? — It eats fish. [en, 1 blank(s)] | What (full) | — | — | — | — |
| g1u09.gi.question-words.gf.003 | gap-fill | ___ ___ do you feed it? — Twice a day. [en, 2 blank(s)] | How \| often (full) | — | — | — | — |
| g1u09.gi.question-words.gf.004 | gap-fill | ___ do you keep your spider? — In a box. [en, 1 blank(s)] | Where (full) | — | — | — | — |
| g1u09.gi.question-words.gs.001 | group-sort | Sortiere: Beginnt es mit What oder mit Where? [de] | — | — | — | What: What does it eat?, What is it?, What does your rabbit eat? \| Where: Where do you live?, Where do you keep it?, Where does Bob live? | — |
| g1u09.gi.question-words.mc.001 | multiple-choice | ___ do you live? — In London. [en, 1 blank(s)] | Where (full) | What ; Who ; How many | — | — | — |
| g1u09.gi.question-words.mc.002 | multiple-choice | ___ does your rabbit eat? — Fish and carrots. [en, 1 blank(s)] | What (full) | Where ; Who ; How often | — | — | — |
| g1u09.gi.question-words.mc.003 | multiple-choice | Tom lives in London. ___ does Tom live? [en, 1 blank(s)] | Where (full) | What ; How often ; Who | — | — | — |
| g1u09.gi.question-words.mp.001 | matching-pairs | Finde die Paare, die zusammenpassen. [de] | — | — | Where do you keep it? ↔ In a box. ; What does it eat? ↔ Meat. ; How often do you feed it? ↔ Once a day. ; What is it? ↔ A rabbit. ; Where does Bob live? ↔ On a farm. | — | — |
| g1u09.gi.question-words.mt.001 | matching | Was passt zusammen? [de] | — | — | Where do you live? ↔ In London. ; What does it eat? ↔ Fish and meat. ; How often do you feed it? ↔ Twice a day. ; What is it? ↔ A spider. | — | — |
| g1u09.gi.question-words.qf.001 | question-formation | Tom lives in London. Frag nach dem Ort: ___ does Tom live? [de, 1 blank(s)] | Where (full) ; Where does Tom live? (full) ; Where does he live? (full) | — | — | — | — |
| g1u09.gi.question-words.qf.002 | question-formation | It eats fish. Frag nach dem Futter: ___ does it eat? [de, 1 blank(s)] | What (full) ; What does it eat? (full) | — | — | — | — |
| g1u09.gi.question-words.sb.001 | sentence-building | does / What / eat / it / ? [en] | What does it eat? (full) | — | — | — | — |
| g1u09.gi.question-words.sb.002 | sentence-building | do / Where / live / you / ? [en] | Where do you live? (full) | — | — | — | — |
| g1u09.gi.question-words.tf.001 | transformation | I live in London. (mit Where, bitte) → ___ do you live? [de, 1 blank(s)] | Where (full) ; Where do you live? (full) | — | — | — | — |
| g1u09.gi.question-words.tf.003 | transformation | I feed my dog twice a day. (wie oft?) → ___ ___ do you feed your dog? [de, 2 blank(s)] | How \| often (full) | — | — | — | — |
| g1u09.gi.question-words.tr.001 | translation | Wo wohnst du? [de] | Where do you live? (full) | — | — | — | — |
| g1u09.gi.question-words.tr.002 | translation | Wie oft fütterst du deinen Hund? [de] | How often do you feed your dog? (full) | — | — | — | — |

## Output contract

Write `content/corpus/units/g1-u09/verify/level-gloss.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u09",
  "lens": "level-gloss",
  "itemsHash": "ba1d244426bd",
  "promptHash": "aefb997bf664",
  "round": 1,
  "by": "fable-lens-level-gloss",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 146, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
