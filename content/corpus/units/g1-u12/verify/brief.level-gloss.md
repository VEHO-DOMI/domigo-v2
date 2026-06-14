# Verify lens — level-gloss — g1-u12 (round 1)

<!-- domigo:verify level-gloss g1-u12 items=08c10551a0cb prompt=aefb997bf664 round=1 -->

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
- **g1-u10**: 20 twenty, 30 thirty, 40 forty, 50 fifty, 60 sixty, 70 seventy, 80 eighty, 90 ninety, 100 one hundred, 1000 one thousand, how much is/are ..., price, these, those, Anything else?, Can I help you?, computer game, headphones, key ring, magazine, mobile phone, scooter, sweets (pl), tin, Congratulations!, rule, customer, everything, expensive, to fall asleep, Goodbye., I'd like ..., No wonder., suddenly, town, to walk away, changing room, No problem., over there, drawer, That's better., What can I do for you?, Be careful., Just a minute.
- **g1-u11**: 9 a.m., midday, 9 p.m., midnight, 9 o'clock, (a) quarter past nine, half past nine, (a) quarter to ten, to ride a bike, to watch TV, to play football, to play computer games, to play the piano, to ride a horse, to skateboard, to cook, to ride a scooter, to ski, to snowboard, to skate, daily, free time, What's the time?, Excuse me., to hurry, clock, It's 10 a.m., It's 8 p.m., What time is it?, bedtime, break, exercise, to go to bed, to go to school, outside, to study, to wake somebody up, amazing, to answer the door, bush, Have fun!, to hide, knock, living room, surprise, to push, to cook, text message, to look after, road, place, programme, clue, See you soon., to snow, weather, half an hour, Hurry up.
- **g1-u12**: January, February, March, April, May, June, July, August, September, October, November, December, bedroom, library, living room, dining room, bathroom, hall, kitchen, garden, garage, 1st first, 2nd second, 3rd third, 4th fourth, 5th fifth, 6th sixth, 7th seventh, 8th eighth, 9th ninth, 10th tenth, 11th eleventh, 12th twelfth, 13th thirteenth, 14th fourteenth, 15th fifteenth, 16th sixteenth, 17th seventeenth, 18th eighteenth, 19th nineteenth, 20th twentieth, 21st twenty-first, 22nd twenty-second, 23rd twenty-third, 24th twenty-fourth, 25th twenty-fifth, 30th thirtieth, 31st thirty-first, birthday cake, eater, ill, messy, piece, cinema, excellent, finally, match, It's my birthday., date, month, How old are you?, candle, delicious, last, robber, robbery, yesterday, alarm clock, probably, Good for you!, inspector, How dare you!, That was close., You're welcome.

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alphabet, Alps, Anderson, Anger, Annie, Arbeit, Archie, Articles, Austria, Bacon, Baker, Befehlsformen, Bert, Betty, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Bob, Box, Brown, Buckingham, Buddy, Burgers, Cairn, California, Cambridge, Caribbean, Carina, Carl, Castle, Chester, China, Chloe, Christie, Christine, Clare, Clark, Classroom, Clothes, Clown, Come, Complimenting, Dad, Dan, Dana, Daniel, Darkman, Dave, David, Davis, Debbie, Dialog, Dialoge, Doctor, Doctors, Don, Dragon, Ellie, Emma, England, English, False, Fido, Food, Frank, Fred, Freddy, George, Georgia, German, Gina, Good, Gordon, Great, Grey, Greybeard, Groans, Guess, Harry, Henry, Hmm, Holmes, Homework, Hook, Hunt, Imperatives, Irregular, Italian, Jack, Jacob, James, Jamie, Jane, Janet, Jenny, Jeremy, Jessica, Jessie, Jill, Joe, John, Jolly, Julia, Jun, Just, Kate, Ken, Kitty, Leah, Leo, Lethabo, Leute, Lewis, Li, Lisa, London, Lucy, Mail, Manchester, Mandy, Manson, Mario, Mark, Marple, Mary, Matt, Mike, Miss, Mr, Mrs, Mum, New, Nibbs, Nice, Nick, Nomen, Number, Numbers, Object, Objekte, Olivia, Omar, Ordinal, Palace, Pardon, Past, Paws, Pete, Peter, Pets, Pirates, Plural, Plurals, Polly, Possessives, Prepositions, Present, Priestly, Project, Put, Rajit, Rashmi, Red, Reihenfolge, Richard, Robert, Ronald, Rosie, Sally, Sam, Sandra, Saying, School, Sherlock, Smith, Sophia, Sophie, Steve, Sue, Suzy, Tamar, Tamara, Tammy, Telling, Text, Think, Tick, Tim, Toby, Tock, Tom, Tony, True, Uhr, Um, Vienna, Walker, Wall, Watson, Welcome, Well, White, Wise, Work, Wortes, Would, Wow, Yeah, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Vocab items (74)

| id | d | s | mc | pool | gloss |
|---|---|---|---|---|---|
| g1u12.w.10th-tenth | It is just after the ninth one. Number 10. | The ___ and last piece of cake is for me! | ninth ; eleventh ; eighth | ninth ; eleventh ; eighth ; second | — |
| g1u12.w.11th-eleventh | It is just after the tenth one. Number 11. | Her birthday is on the ___ of May. | tenth ; twelfth ; ninth | tenth ; twelfth ; ninth ; third | — |
| g1u12.w.12th-twelfth | It is just after the eleventh one. Number 12. | My birthday is on the ___ of June. | eleventh ; thirteenth ; tenth | eleventh ; thirteenth ; tenth ; fourth | — |
| g1u12.w.13th-thirteenth | It is just after the twelfth one. Number 13. | His birthday is on the ___ of April. | twelfth ; fourteenth ; eleventh | twelfth ; fourteenth ; eleventh ; fifth | — |
| g1u12.w.14th-fourteenth | It is just after the thirteenth one. Number 14. | The school day is on the ___ of February. | thirteenth ; fifteenth ; twelfth | thirteenth ; fifteenth ; twelfth ; sixth | — |
| g1u12.w.15th-fifteenth | It is just after the fourteenth one. Number 15. | Mario's birthday is on the ___ of May. | fourteenth ; sixteenth ; thirteenth | fourteenth ; sixteenth ; thirteenth ; seventh | — |
| g1u12.w.16th-sixteenth | It is just after the fifteenth one. Number 16. | The match is on the ___ of June. | fifteenth ; seventeenth ; fourteenth | fifteenth ; seventeenth ; fourteenth ; eighth | — |
| g1u12.w.17th-seventeenth | It is just after the sixteenth one. Number 17. | The concert is on the ___ of November. | sixteenth ; eighteenth ; fifteenth | sixteenth ; eighteenth ; fifteenth ; ninth | — |
| g1u12.w.18th-eighteenth | It is just after the seventeenth one. Number 18. | His birthday is on the ___ of October. | seventeenth ; nineteenth ; sixteenth | seventeenth ; nineteenth ; sixteenth ; tenth | — |
| g1u12.w.19th-nineteenth | It is just after the eighteenth one. Number 19. | The party is on the ___ of July. | eighteenth ; twentieth ; seventeenth | eighteenth ; twentieth ; seventeenth ; eleventh | party (= Party) |
| g1u12.w.1st-first | It is the one at the very beginning. It is number 1. | Monday is the ___ day of our school week. | second ; third ; last | second ; third ; last ; fourth | — |
| g1u12.w.20th-twentieth | It is just after the nineteenth one. Number 20. | The school holiday begins on the ___ of December. | nineteenth ; twenty-first ; thirtieth | nineteenth ; twenty-first ; thirtieth ; twelfth | holiday (= Urlaub) |
| g1u12.w.21st-twenty-first | It is number 21. It is the one just after number 20. | The school trip is on the ___ of July. | twentieth ; twenty-second ; thirty-first | twentieth ; twenty-second ; thirty-first ; thirteenth | trip (= Ausflug) |
| g1u12.w.22nd-twenty-second | It is number 22. It is the one just after number 21. | Tom's birthday is on the ___ of March. | twenty-first ; twenty-third ; twentieth | twenty-first ; twenty-third ; twentieth ; fourteenth | — |
| g1u12.w.23rd-twenty-third | It is number 23. It is the one just after number 22. | The match is on the ___ of January. | twenty-second ; twenty-fourth ; twenty-first | twenty-second ; twenty-fourth ; twenty-first ; fifteenth | — |
| g1u12.w.24th-twenty-fourth | It is number 24. It is the one just after number 23. | Sue's birthday is on the ___ of December. | twenty-third ; twenty-fifth ; twenty-second | twenty-third ; twenty-fifth ; twenty-second ; sixteenth | — |
| g1u12.w.25th-twenty-fifth | It is number 25. It is the one just after number 24. | We open our presents on the ___ of December. | twenty-fourth ; twentieth ; thirtieth | twenty-fourth ; twentieth ; thirtieth ; seventeenth | presents (= Geschenke) |
| g1u12.w.2nd-second | It is just after the first one. Number 2. | Tuesday is the ___ day of the school week, after Monday. | first ; third ; fourth | first ; third ; fourth ; fifth | — |
| g1u12.w.30th-thirtieth | It is number 30. It is the last day of many months. | The last day of April is the ___. | twentieth ; thirty-first ; first | twentieth ; thirty-first ; first ; twelfth | — |
| g1u12.w.31st-thirty-first | It is number 31. It is the very last day of some months. | The last day of the year is the ___ of December. | thirtieth ; twenty-first ; first | thirtieth ; twenty-first ; first ; second | — |
| g1u12.w.3rd-third | It is just after the second one. Number 3. | Wednesday is the ___ day of the school week. | second ; fourth ; fifth | second ; fourth ; fifth ; first | — |
| g1u12.w.4th-fourth | It is just after the third one. Number 4. | Thursday is the ___ day of the school week. | third ; fifth ; sixth | third ; fifth ; sixth ; second | — |
| g1u12.w.5th-fifth | It is just after the fourth one. Number 5. | Friday is the ___ day of the school week. | fourth ; sixth ; third | fourth ; sixth ; third ; seventh | — |
| g1u12.w.6th-sixth | It is just after the fifth one. Number 6. | The ___ piece of cake is for Bill. | fifth ; seventh ; fourth | fifth ; seventh ; fourth ; eighth | — |
| g1u12.w.7th-seventh | It is just after the sixth one. Number 7. | The ___ piece of cake is also for Bill. | sixth ; eighth ; fifth | sixth ; eighth ; fifth ; ninth | — |
| g1u12.w.8th-eighth | It is just after the seventh one. Number 8. | The ___ piece of cake is for you. | seventh ; ninth ; sixth | seventh ; ninth ; sixth ; tenth | — |
| g1u12.w.9th-ninth | It is just after the eighth one. Number 9. | The ___ piece of cake is for Jeremy. | eighth ; tenth ; seventh | eighth ; tenth ; seventh ; first | — |
| g1u12.w.alarm-clock | It stands next to your bed and makes a loud noise to wake you up in the morning. | My ___ makes a loud noise at seven in the morning. | candle ; piece ; robber | candle ; piece ; robber ; match | stands (= steht) ; loud (= laut) ; loud (= laut) ; wake (= wecken) |
| g1u12.w.april | It is the month after March, when it often rains and the trees have new leaves. | It often rains and the trees have new leaves in ___. | March ; May ; June | March ; May ; June ; July | rains (= regnet) ; rains (= regnet) |
| g1u12.w.august | It is a hot month of summer, when many families go away on a long holiday. | Many families go away on a long holiday in ___. | July ; September ; June | July ; September ; June ; December | summer (= Sommer) ; holiday (= Urlaub) ; holiday (= Urlaub) |
| g1u12.w.bathroom | It is the room where you wash and clean your teeth. | I wash and clean my teeth in the ___. | bedroom ; kitchen ; living room | bedroom ; kitchen ; living room ; hall | — |
| g1u12.w.bedroom | It is the room with your bed, where you go at night. | At night I go to my ___, where my bed is. | kitchen ; bathroom ; garage | kitchen ; bathroom ; garage ; library | — |
| g1u12.w.birthday-cake | It is the special, sweet thing with candles that you have on your big day in the year. | Mum is making a big ___ with 12 candles for my birthday. | candle ; piece ; robbery | candle ; piece ; robbery ; match | sweet (= süß) ; special (= besonders) |
| g1u12.w.candle | It is a small thing that gives a tiny light on top of a birthday cake. | We put 12 ___ on the birthday cake and light them. | piece ; date ; match | piece ; date ; match ; month | tiny (= winzig) ; top (= Oberseite) |
| g1u12.w.cinema | It is the place where you go to watch a new film on a very big screen. | Let's go to the ___ on Friday and watch the new film. | library ; kitchen ; garage | library ; kitchen ; garage ; match | film (= Film) ; film (= Film) ; screen (= Leinwand) |
| g1u12.w.date | It is the day and the month, like the 5th of March. | What is today's ___? It is the 7th of July. | month ; piece ; match | month ; piece ; match ; candle | — |
| g1u12.w.december | It is the last, cold month of the year, when we put up a tree with lights. | We put up a tree with many lights in ___, the last month of the year. | November ; January ; October | November ; January ; October ; July | — |
| g1u12.w.delicious | When food is very, very good to eat. | This chocolate cake is so ___! I want more. | excellent ; messy ; ill | excellent ; messy ; ill ; last | — |
| g1u12.w.dining-room | It is where the family eats dinner at a big table. | We eat our dinner at the big table in the ___. | garage ; bathroom ; garden | garage ; bathroom ; garden ; kitchen | — |
| g1u12.w.eater | It is what you call somebody, when you talk about their food at the table. | Peter is a messy ___ and has food all over the table. | robber ; inspector ; candle | robber ; inspector ; candle ; piece | — |
| g1u12.w.excellent | When something is very, very good, the best it can be. | Ten out of ten! That is ___ work! | delicious ; messy ; ill | delicious ; messy ; ill ; last | something (= etwas) |
| g1u12.w.february | It is the short, cold month after January, when many children ski in the snow. | We go skiing on the cold, white snow in ___. | January ; March ; November | January ; March ; November ; April | — |
| g1u12.w.finally | When you wait a long time and then at last the thing happens. | We waited a long time, and ___ the bus came! | probably ; yesterday ; excellent | probably ; yesterday ; excellent ; last | bus (= Bus) ; came (= kam) |
| g1u12.w.garage | It is the place where the car stays at night. | Dad parks the car in the ___ at night. | living room ; bedroom ; kitchen | living room ; bedroom ; kitchen ; garden | — |
| g1u12.w.garden | It is the place outside, with grass and flowers, where you can play. | We play outside on the grass in the ___. | living room ; bathroom ; kitchen | living room ; bathroom ; kitchen ; garage | grass (= Gras) ; grass (= Gras) ; flowers (= Blumen) |
| g1u12.w.good-for-you | A happy thing you say when something nice happens to another person. | You won the match? ___ I am so happy for you! | How dare you! ; You're welcome. ; That was close. | How dare you! ; You're welcome. ; That was close. ; It's my birthday. | say (= sagen) ; something (= etwas) ; another (= andere) ; person (= Person) ; won (= gewonnen) |
| g1u12.w.hall | It is the first small room when you come in, where you put your jacket. | Please put your jacket here in the ___ when you come in. | kitchen ; bathroom ; bedroom | kitchen ; bathroom ; bedroom ; library | — |
| g1u12.w.how-dare-you | An angry thing you say when a person does a very bad thing to you. | You had my cake without asking me? ___ | Good for you! ; You're welcome. ; That was close. | Good for you! ; You're welcome. ; That was close. ; It's my birthday. | say (= sagen) ; person (= Person) ; without (= ohne) |
| g1u12.w.how-old-are-you | You ask this to find out somebody's age in years. | ___ I am 11, and my birthday is in June. | It's my birthday. ; Good for you! ; You're welcome. | It's my birthday. ; Good for you! ; You're welcome. ; That was close. | age (= Alter) |
| g1u12.w.ill | When you feel bad and have to stay in bed and cannot go to school. | Bill had too much cake and now he is ___ in bed. | messy ; excellent ; delicious | messy ; excellent ; delicious ; last | feel (= fühlen) |
| g1u12.w.inspector | It is the person who asks everybody many things to find the robber. | The police ___ asked everybody where they were last night. | robber ; eater ; candle | robber ; eater ; candle ; robbery | person (= Person) ; things (= Dinge) ; police (= Polizei) |
| g1u12.w.it-s-my-birthday | Today is your special day with a cake, and you are one year older. | ___ I am 11 today, and we have a big cake! | How old are you? ; Good for you! ; You're welcome. | How old are you? ; Good for you! ; You're welcome. ; That was close. | special (= besonders) ; older (= älter) |
| g1u12.w.january | It is the first cold month of the year, when we can play in the snow. | We can ski in the white snow in ___, the first month of the year. | February ; June ; December | February ; June ; December ; March | — |
| g1u12.w.july | It is a hot month of summer, when many children play at the sea. | It is very hot and we play at the sea in ___. | June ; August ; September | June ; August ; September ; October | summer (= Sommer) ; sea (= Meer) ; sea (= Meer) |
| g1u12.w.june | It is the first warm month of summer, before the long school holiday. | The days are long and the school year ends soon in ___. | July ; May ; August | July ; May ; August ; January | summer (= Sommer) ; warm (= warm) ; holiday (= Urlaub) ; soon (= bald) |
| g1u12.w.kitchen | It is the room where Mum makes the food and we cook. | Mum makes our breakfast and we cook in the ___. | bathroom ; bedroom ; living room | bathroom ; bedroom ; living room ; garden | — |
| g1u12.w.last | It is the one just before this one, the time before now. | There was a robbery here ___ night, before today. | excellent ; delicious ; messy | excellent ; delicious ; messy ; ill | — |
| g1u12.w.library | It is a room with many books to read. | I read my books in the ___. | kitchen ; bathroom ; bedroom | kitchen ; bathroom ; bedroom ; dining room | — |
| g1u12.w.living-room | It is where the family watches TV in the evening. | We watch TV with the family in the ___. | bathroom ; kitchen ; bedroom | bathroom ; kitchen ; bedroom ; hall | — |
| g1u12.w.march | It is the cool month when the cold days end and the first new leaves come. | The first new leaves come on the trees in ___. | April ; February ; May | April ; February ; May ; June | cool (= kühl) |
| g1u12.w.match | It is when two groups of children play, and we watch who is best. | There is a volleyball ___ on Saturday. | piece ; candle ; date | piece ; candle ; date ; month | volleyball (= Volleyball) |
| g1u12.w.may | It is the month before June, when the garden has many pretty flowers. | The garden has many beautiful flowers in ___. | April ; June ; March | April ; June ; March ; August | flowers (= Blumen) ; flowers (= Blumen) |
| g1u12.w.messy | When something is not clean and there is food or things all over the place. | Peter is a ___ eater and has food all over the table. | ill ; delicious ; excellent | ill ; delicious ; excellent ; last | something (= etwas) ; things (= Sachen) |
| g1u12.w.month | It is one of the twelve parts of a year, like May or June. | May is the fifth ___ of the year. | date ; piece ; candle | date ; piece ; candle ; match | twelve (= zwölf) ; parts (= Teile) |
| g1u12.w.november | It is the cold, grey month when the days are short and it often rains. | The days are short and grey in ___, before December. | October ; December ; September | October ; December ; September ; March | rains (= regnet) |
| g1u12.w.october | It is the cool month when the leaves on the trees go brown and red. | The brown and red leaves come down from the trees in ___. | September ; November ; December | September ; November ; December ; April | cool (= kühl) |
| g1u12.w.piece | It is one part of a bigger thing, like one part of a cake. | Can I have a ___ of your birthday cake, please? | candle ; match ; date | candle ; match ; date ; month | part (= Teil) |
| g1u12.w.probably | When you think something is true, but you do not know it for sure. | It is very grey outside, so it is ___ going to rain later. | finally ; yesterday ; last | finally ; yesterday ; last ; excellent | something (= etwas) ; know (= wissen) ; sure (= sicher) ; rain (= regnen) ; later (= später) |
| g1u12.w.robber | It is a bad person who takes things that are not theirs. | Jessie wants to find the ___ who took her cake. | inspector ; eater ; candle | inspector ; eater ; candle ; robbery | person (= Person) ; takes (= nimmt) ; things (= Sachen) ; took (= nahm) |
| g1u12.w.robbery | It is when a bad person takes things from a place like a shop. | There was a ___ at the big shop, and all the money was gone. | robber ; inspector ; date | robber ; inspector ; date ; candle | person (= Person) ; takes (= nimmt) ; things (= Sachen) ; shop (= Geschäft) ; gone (= weg) |
| g1u12.w.september | It is the month when the hot days end and children go back to school. | We go back to school after the long holiday in ___. | October ; August ; November | October ; August ; November ; May | holiday (= Urlaub) |
| g1u12.w.that-was-close | You say this when a bad thing nearly happens but in the end does not happen. | That car was very close to us! ___ | Good for you! ; You're welcome. ; How dare you! | Good for you! ; You're welcome. ; How dare you! ; It's my birthday. | say (= sagen) ; nearly (= fast) |
| g1u12.w.yesterday | It is the day that was just before today. | Where were you ___, the day before today? | finally ; probably ; last | finally ; probably ; last ; excellent | — |
| g1u12.w.you-re-welcome | You say this back to a person after they say thank you to you. | Thank you for your help! — ___ | Good for you! ; How dare you! ; That was close. | Good for you! ; How dare you! ; That was close. ; It's my birthday. | say (= sagen) ; person (= Person) ; help (= Hilfe) |

## Grammar items (87)

| id | fmt | prompt | answers | distractors | pairs | groups | gloss |
|---|---|---|---|---|---|---|---|
| g1u12.gi.ordinal-numbers.ag.003 | anagram | 8. als Wort — wie heißt es? [de] | eighth (full) | — | — | — | — |
| g1u12.gi.ordinal-numbers.ag.004 | anagram | 12. als Wort — wie heißt es? [de] | twelfth (full) | — | — | — | — |
| g1u12.gi.ordinal-numbers.ec.001 | error-correction | My birthday is on the nineth of June. [en] | My birthday is on the ninth of June. (full) ; ninth (partial) | — | — | — | — |
| g1u12.gi.ordinal-numbers.ec.002 | error-correction | She was fiveth in the race. [en] | She was fifth in the race. (full) ; fifth (partial) | — | — | — | — |
| g1u12.gi.ordinal-numbers.ec.003 | error-correction | December is the twelveth month. [en] | December is the twelfth month. (full) ; twelfth (partial) | — | — | — | — |
| g1u12.gi.ordinal-numbers.ec.004 | error-correction | The eightth piece of cake is for you. [en] | The eighth piece of cake is for you. (full) ; eighth (partial) | — | — | — | — |
| g1u12.gi.ordinal-numbers.gf.001 | gap-fill | The ___ piece is for Sue. (1) [en, 1 blank(s)] | first (full) | — | — | — | — |
| g1u12.gi.ordinal-numbers.gf.002 | gap-fill | The ___ piece is for Peter. (3) [en, 1 blank(s)] | third (full) | — | — | — | — |
| g1u12.gi.ordinal-numbers.gf.003 | gap-fill | January is the ___ month of the year. (1) [en, 1 blank(s)] | first (full) | — | — | — | — |
| g1u12.gi.ordinal-numbers.gf.004 | gap-fill | February is the ___ month of the year. (2) [en, 1 blank(s)] | second (full) | — | — | — | — |
| g1u12.gi.ordinal-numbers.gf.005 | gap-fill | She came ___ in the race. (5th place) [en, 1 blank(s)] | fifth (full) | — | — | — | — |
| g1u12.gi.ordinal-numbers.gf.006 | gap-fill | Today is the ___ of March. (9) [en, 1 blank(s)] | ninth (full) | — | — | — | — |
| g1u12.gi.ordinal-numbers.gf.007 | gap-fill | December is the ___ month of the year. (12) [en, 1 blank(s)] | twelfth (full) | — | — | — | — |
| g1u12.gi.ordinal-numbers.gf.008 | gap-fill | My birthday is on the ___ of June. (21) [en, 1 blank(s)] | twenty-first (full) ; 21st (partial) | — | — | — | — |
| g1u12.gi.ordinal-numbers.gf.009 | gap-fill | December has 31 days. The last day is the ___. (31) [en, 1 blank(s)] | thirty-first (full) ; 31st (partial) | — | — | — | — |
| g1u12.gi.ordinal-numbers.gf.010 | gap-fill | Jessie's cake had twelve candles. The robbery was on the ___ of May, on her birthday. (23) [en, 1 blank(s)] | twenty-third (full) ; 23rd (partial) | — | — | — | — |
| g1u12.gi.ordinal-numbers.gs.002 | group-sort | Sortiere: einfach -th anhängen oder Schreibweise ändern? [de] | — | — | — | like sixth: fourth, sixth, seventh, tenth \| like fifth: fifth, ninth, twelfth, twentieth | — |
| g1u12.gi.ordinal-numbers.mc.005 | multiple-choice | Wie schreibt man 2. als Wort? [de] | second (full) | twoth ; twond ; secend | — | — | — |
| g1u12.gi.ordinal-numbers.mc.006 | multiple-choice | Wie schreibt man 12. als Wort richtig? [de] | twelfth (full) | twelveth ; twelvth ; twelfeth | — | — | — |
| g1u12.gi.ordinal-numbers.mc.007 | multiple-choice | Wie schreibt man 8. als Wort richtig? [de] | eighth (full) | eightth ; eigthth ; eighteth | — | — | — |
| g1u12.gi.ordinal-numbers.mc.008 | multiple-choice | Wie schreibt man 5. als Wort richtig? [de] | fifth (full) | fiveth ; fith ; fifeth | — | — | — |
| g1u12.gi.ordinal-numbers.mp.003 | matching-pairs | Was passt zusammen? Zahl und Wort. [de] | — | — | one ↔ first ; two ↔ second ; three ↔ third ; five ↔ fifth ; eight ↔ eighth ; twelve ↔ twelfth | — | — |
| g1u12.gi.ordinal-numbers.mp.004 | matching-pairs | Was passt zusammen? Verbinde jede Zahl mit dem passenden Wort. [de] | — | — | four ↔ fourth ; six ↔ sixth ; seven ↔ seventh ; nine ↔ ninth ; ten ↔ tenth ; eleven ↔ eleventh | — | — |
| g1u12.gi.ordinal-numbers.tf.004 | transformation | Schreib als Wort: 20th → ___ [de, 1 blank(s)] | twentieth (full) | — | — | — | — |
| g1u12.gi.ordinal-numbers.tf.005 | transformation | Schreib als Wort: 30th → ___ [de, 1 blank(s)] | thirtieth (full) | — | — | — | — |
| g1u12.gi.ordinal-numbers.tf.006 | transformation | Heute ist der letzte Tag des Monats. Schreib als Wort: 31st → ___ [de, 1 blank(s)] | thirty-first (full) | — | — | — | — |
| g1u12.gi.ordinal-numbers.tr.001 | translation | Mein Geburtstag ist am dritten Mai. [de] | My birthday is on the third of May. (full) ; My birthday is on the 3rd of May. (partial) | — | — | — | — |
| g1u12.gi.ordinal-numbers.tr.002 | translation | Heute ist der fünfzehnte Dezember. [de] | Today is the fifteenth of December. (full) ; Today is the 15th of December. (partial) | — | — | — | — |
| g1u12.gi.past-simple-was-were.ag.001 | anagram | Die Vergangenheits-Form von be zu they: [de] | were (full) | — | — | — | — |
| g1u12.gi.past-simple-was-were.ag.002 | anagram | Die verneinte Form von was: [de] | wasn't (full) | — | — | — | — |
| g1u12.gi.past-simple-was-were.cp.001 | context-picker | Du erzählst von gestern. Welcher Satz ist richtig? [de] | We were at the zoo yesterday. (full) | We was at the zoo yesterday. ; We are at the zoo yesterday. ; We is at the zoo yesterday. | — | — | — |
| g1u12.gi.past-simple-was-were.cp.002 | context-picker | Deine Lehrerin fragt nach dem Schulausflug von gestern. Welche Antwort ist richtig? [de] | It was excellent! (full) | It were excellent! ; It is excellent! ; It are excellent! | — | — | — |
| g1u12.gi.past-simple-was-were.ec.001 | error-correction | They was at the zoo yesterday. [en] | They were at the zoo yesterday. (full) ; were (partial) | — | — | — | — |
| g1u12.gi.past-simple-was-were.ec.002 | error-correction | I were at the cinema last night. [en] | I was at the cinema last night. (full) ; was (partial) | — | — | — | — |
| g1u12.gi.past-simple-was-were.ec.003 | error-correction | I was been tired yesterday. [en] | I was tired yesterday. (full) | — | — | — | been (= zweite Form von be) |
| g1u12.gi.past-simple-was-were.gf.001 | gap-fill | I ___ at school yesterday. [en, 1 blank(s)] | was (full) | — | — | — | — |
| g1u12.gi.past-simple-was-were.gf.002 | gap-fill | Peter and John ___ at school last Monday. [en, 1 blank(s)] | were (full) | — | — | — | — |
| g1u12.gi.past-simple-was-were.gf.003 | gap-fill | She ___ very tired after the birthday party. [en, 1 blank(s)] | was (full) | — | — | — | — |
| g1u12.gi.past-simple-was-were.gf.004 | gap-fill | We ___ in London last night. [en, 1 blank(s)] | were (full) | — | — | — | — |
| g1u12.gi.past-simple-was-were.gf.005 | gap-fill | The birthday cake ___ delicious! [en, 1 blank(s)] | was (full) | — | — | — | — |
| g1u12.gi.past-simple-was-were.gf.006 | gap-fill | ___ you at the cinema yesterday? [en, 1 blank(s)] | Were (full) | — | — | — | — |
| g1u12.gi.past-simple-was-were.gf.007 | gap-fill | She ___ happy because her dog ___ ill. [en, 2 blank(s)] | wasn't \| was (full) ; was not \| was (full) | — | — | — | — |
| g1u12.gi.past-simple-was-were.gf.008 | gap-fill | The children ___ in the garden. They were in the kitchen. [en, 1 blank(s)] | weren't (full) ; were not (full) | — | — | — | — |
| g1u12.gi.past-simple-was-were.gf.009 | gap-fill | Last night there ___ a robbery in the kitchen. [en, 1 blank(s)] | was (full) | — | — | — | — |
| g1u12.gi.past-simple-was-were.gs.001 | group-sort | was oder were? Sortiere die Wörter. [de] | — | — | — | was: I, he, she, it \| were: you, we, they | — |
| g1u12.gi.past-simple-was-were.gs.003 | group-sort | Sortiere: ein Satz ohne nicht oder ein Satz mit nicht (verneint)? [de] | — | — | — | Yes: I was happy., She was in the kitchen., They were at school. \| No: I wasn't tired., Tom wasn't there., They weren't at the zoo. | — |
| g1u12.gi.past-simple-was-were.mc.001 | multiple-choice | Welcher Satz ist richtig? [de] | They were very happy yesterday. (full) | They was very happy yesterday. ; They are very happy yesterday. ; They is very happy yesterday. | — | — | — |
| g1u12.gi.past-simple-was-were.mc.002 | multiple-choice | Welcher Satz ist richtig? [de] | I was at the park last Saturday. (full) | I were at the park last Saturday. ; I am at the park last Saturday. ; I are at the park last Saturday. | — | — | — |
| g1u12.gi.past-simple-was-were.mc.003 | multiple-choice | 'Were you at the party?' – 'No, ___.' Welche Antwort ist richtig? [de, 1 blank(s)] | I wasn't (full) | I weren't ; I wasn't not ; you wasn't | — | — | — |
| g1u12.gi.past-simple-was-were.mt.001 | matching | Frage und passende Kurzantwort [de] | — | — | Was Tom in the garden? ↔ Yes, he was. ; Were you at the cinema? ↔ Yes, I was. ; Were Sandra and Kate there? ↔ No, they weren't. ; Was the cake delicious? ↔ Yes, it was. | — | — |
| g1u12.gi.past-simple-was-were.qf.001 | question-formation | She was in the kitchen. Stell eine Ja/Nein-Frage. [de] | Was she in the kitchen? (full) | — | — | — | — |
| g1u12.gi.past-simple-was-were.qf.002 | question-formation | Sandra and Kate were in the garden. Stell eine Ja/Nein-Frage. [de] | Were Sandra and Kate in the garden? (full) | — | — | — | — |
| g1u12.gi.past-simple-was-were.sb.001 | sentence-building | we / were / yesterday / at / the park [en] | We were at the park yesterday. (full) ; Yesterday we were at the park. (full) | — | — | — | — |
| g1u12.gi.past-simple-was-were.sb.002 | sentence-building | Tom / at / wasn't / the / party [en] | Tom wasn't at the party. (full) ; Tom was not at the party. (full) | — | — | — | — |
| g1u12.gi.past-simple-was-were.tf.001 | transformation | I am happy. → Yesterday I ___ happy. [en, 1 blank(s)] | was (full) ; Yesterday I was happy. (full) | — | — | — | — |
| g1u12.gi.past-simple-was-were.tf.002 | transformation | He was in the living room. → ___ he in the living room? [en, 1 blank(s)] | Was (full) ; Was he in the living room? (full) | — | — | — | — |
| g1u12.gi.past-simple-was-were.tf.003 | transformation | They were at school. → Mach den Satz verneint: They ___ at school. [de, 1 blank(s)] | weren't (full) ; were not (full) ; They weren't at school. (full) | — | — | — | — |
| g1u12.gi.past-simple-was-were.tr.001 | translation | Wir waren gestern im Kino. [de] | We were at the cinema yesterday. (full) ; Yesterday we were at the cinema. (full) | — | — | — | — |
| g1u12.gi.past-simple-was-were.tr.002 | translation | Er war gestern nicht in der Schule. [de] | He wasn't at school yesterday. (full) ; He was not at school yesterday. (full) ; Yesterday he wasn't at school. (full) | — | — | — | — |
| g1u12.gi.prepositions-time.cp.001 | context-picker | Du erzählst, wann dein Geburtstag ist. Welcher Satz ist richtig? [de] | My birthday is in May. (full) | My birthday is on May. ; My birthday is at May. ; My birthday is to May. | — | — | — |
| g1u12.gi.prepositions-time.cp.002 | context-picker | Du sagst, wann du ins Bett gehst. Welcher Satz ist richtig? [de] | I go to bed at night. (full) | I go to bed in night. ; I go to bed on night. ; I go to bed in the night. | — | — | — |
| g1u12.gi.prepositions-time.ec.001 | error-correction | I have English in Monday. [en] | I have English on Monday. (full) ; on (partial) | — | — | — | — |
| g1u12.gi.prepositions-time.ec.002 | error-correction | My birthday is on December. [en] | My birthday is in December. (full) ; in (partial) | — | — | — | — |
| g1u12.gi.prepositions-time.ec.003 | error-correction | The concert is on 7 o'clock. [en] | The concert is at 7 o'clock. (full) ; at (partial) | — | — | — | — |
| g1u12.gi.prepositions-time.ec.004 | error-correction | I wake up in the morning, but my sister gets up on the afternoon. [en] | I wake up in the morning, but my sister gets up in the afternoon. (full) ; in (partial) | — | — | — | — |
| g1u12.gi.prepositions-time.gf.001 | gap-fill | I have English ___ Monday. [en, 1 blank(s)] | on (full) | — | — | — | — |
| g1u12.gi.prepositions-time.gf.002 | gap-fill | My birthday is ___ March. [en, 1 blank(s)] | in (full) | — | — | — | — |
| g1u12.gi.prepositions-time.gf.003 | gap-fill | The concert is ___ 8 o'clock. [en, 1 blank(s)] | at (full) | — | — | — | — |
| g1u12.gi.prepositions-time.gf.006 | gap-fill | I wake up early ___ the morning. [en, 1 blank(s)] | in (full) | — | — | — | — |
| g1u12.gi.prepositions-time.gf.007 | gap-fill | We have a match ___ Saturday. [en, 1 blank(s)] | on (full) | — | — | — | — |
| g1u12.gi.prepositions-time.gf.008 | gap-fill | The cinema opens ___ half past six ___ the evening. [en, 2 blank(s)] | at \| in (full) | — | — | — | — |
| g1u12.gi.prepositions-time.gf.009 | gap-fill | My birthday is ___ December, ___ the 21st. [en, 2 blank(s)] | in \| on (full) | — | — | — | — |
| g1u12.gi.prepositions-time.gf.010 | gap-fill | We go to bed ___ night. [en, 1 blank(s)] | at (full) | — | — | — | — |
| g1u12.gi.prepositions-time.gf.011 | gap-fill | Her birthday is ___ May 25th. [en, 1 blank(s)] | on (full) | — | — | — | — |
| g1u12.gi.prepositions-time.gs.004 | group-sort | Sortiere die Zeitangaben nach dem richtigen kleinen Wort. [de] | — | — | — | in: May, December, the morning, the afternoon \| on: Monday, Saturday, May 25th, my birthday \| at: 7 o'clock, half past eight, night, midnight | — |
| g1u12.gi.prepositions-time.gs.005 | group-sort | Welches kleine Wort passt? Sortiere in zwei Gruppen. [de] | — | — | — | in: January, June, October \| on: Tuesday, Friday, Sunday | — |
| g1u12.gi.prepositions-time.mc.001 | multiple-choice | My sister's birthday is ___ June. [en, 1 blank(s)] | in (full) | on ; at ; to | — | — | — |
| g1u12.gi.prepositions-time.mc.002 | multiple-choice | I have English ___ the afternoon. [en, 1 blank(s)] | in (full) | on ; at ; to | — | — | — |
| g1u12.gi.prepositions-time.mc.003 | multiple-choice | The match is ___ Thursday. [en, 1 blank(s)] | on (full) | in ; at ; to | — | — | — |
| g1u12.gi.prepositions-time.mc.004 | multiple-choice | Welcher Satz ist richtig? [de] | The concert is on Saturday at 7 o'clock. (full) | The concert is in Saturday at 7 o'clock. ; The concert is on Saturday in 7 o'clock. ; The concert is at Saturday on 7 o'clock. | — | — | — |
| g1u12.gi.prepositions-time.mp.001 | matching-pairs | Verbinde jede Zeitangabe mit der richtigen Form. [de] | — | — | Monday ↔ on Monday ; May ↔ in May ; 7 o'clock ↔ at 7 o'clock ; night ↔ at night ; the morning ↔ in the morning ; my birthday ↔ on my birthday | — | — |
| g1u12.gi.prepositions-time.sb.001 | sentence-building | is / on / The match / Saturday / . [en] | The match is on Saturday. (full) | — | — | — | — |
| g1u12.gi.prepositions-time.sb.002 | sentence-building | go to bed / at / We / night / . [en] | We go to bed at night. (full) | — | — | — | — |
| g1u12.gi.prepositions-time.tf.001 | transformation | Setze die richtigen Vorwörter ein: I go skating ___ Thursdays ___ January. [de, 2 blank(s)] | on \| in (full) | — | — | — | — |
| g1u12.gi.prepositions-time.tf.002 | transformation | Setze die richtigen Vorwörter ein: The match is ___ Saturday, ___ the afternoon, ___ 3 o'clock. [de, 3 blank(s)] | on \| in \| at (full) | — | — | — | — |
| g1u12.gi.prepositions-time.tr.001 | translation | Ich habe am Freitag ein Match. [de] | I have a match on Friday. (full) ; I have got a match on Friday. (full) ; I've got a match on Friday. (full) | — | — | — | — |
| g1u12.gi.prepositions-time.tr.002 | translation | Der Geburtstag meiner Schwester ist im Dezember. [de] | My sister's birthday is in December. (full) ; My sister's birthday's in December. (partial) | — | — | — | — |

## Output contract

Write `content/corpus/units/g1-u12/verify/level-gloss.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u12",
  "lens": "level-gloss",
  "itemsHash": "08c10551a0cb",
  "promptHash": "aefb997bf664",
  "round": 1,
  "by": "fable-lens-level-gloss",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 161, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
