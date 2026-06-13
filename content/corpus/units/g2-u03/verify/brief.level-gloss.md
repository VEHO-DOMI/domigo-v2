# Verify lens — level-gloss — g2-u03 (round 4)

<!-- domigo:verify level-gloss g2-u03 items=8a00bfa24670 prompt=aefb997bf664 round=4 -->

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
- **g1-u13**: storm, jetpack, helicopter, coastguard, fire brigade, ambulance, police, mountain rescue, to shout for help, to be lucky, to break, country, crime, fire, accident, to be in danger, to fly up the mountain, to radio, rescue team, rock, to shout for help, to slip, storm, wet, to arrive, to be safe, to dream, to fall down, to land, medicine, sky, windy, dark, young, alone, backpack, to happen, to chase, sunny, class speaker, democracy, mayor, political, to vote, button, cloud, Earth, to die, forest, introduction, space, to notice, to press, screen, adventure, character, Guess what?, Tell me more.
- **g1-u14**: nature programme, fantasy film, reality show, fantasy story, quiz show, science fiction film, the news, detective story, romantic film, sports programme, horror story, drama series, adventure story, music video, romantic story, cartoon, screen time, headline, latest, comedy, episode, gamer, kind of, quite, to stream, weekend, to freeze (froze), huge, inside, to pay (paid), to point to, power, remote control, to reply (replied), to sell (sold), tiny, voice, wide, to fight (fought), shopkeeper, to disappear, to hold (held), to spend, to bend down (bent down), to hug, lake, leaf (pl leaves), to lie, skin, spot, weak, dead, once upon a time, one day, adventure, cover, friendship, poem, neighbour
- **g1-u15**: to fly to, to go fishing, to stay at a campsite, to swim in the sea, to play badminton, to lie in the sun, to write a postcard, to play board games, to visit a castle, aunt, beach, board game, campsite, cook, to drive, holiday, national park, parents, plane, summer, hippo, to join, to invite
- **g2-u01**: English, French, music, maths, geography, science, physical education (PE), art, history, information technology (IT), design and technology, glad, kilometre, to stay at home, to travel, as soon as, to get dressed, to go for a walk, lesson, to prepare, to put on, supper, daily, calendar, grandmother, joke, scary, spring, area, to book, popular, shadow, to visit, colourful, along, to crawl, to take a rest, (school) subject, break, timetable, bicycle lane, king, noisy, queen, rubbish, online safety, opinion, webpage
- **g2-u02**: to organise, surprise party, admission fee, artist, exhibition, dirty, modern, museum, to be part of, sculpture, to be worth, What's the matter?, anyone, behaviour, to contact, mess, to pass on, password, to post, posting, such, tip, possible, awesome, boring, confusing, difficult, exciting, funny, embarrassed, plate, secret, upset, to add, to fail, I promise.
- **g2-u03**: witch, ghost, pumpkin bucket, vampire, trick or treat, apple bobbing, mask, tradition, to fear, to cut off, front window, to keep, to be proud (of), stairs, sticker, sweets, Trick or treat!, knife (pl knives), century, costume, couldn't, cute, dress, graveyard, myself, shall, sick, superheroine, wild, to scare, cycle helmet, guys, to lose, picnic

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alan, Alison, Alphabet, Alps, America, Anderson, Andrew, Andy, Anger, Annie, Arbeit, Archie, Arousing, Articles, Australia, Austria, Bacon, Baker, Befehlsformen, Beitrag, Ben, Bert, Betty, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Bob, Bolt, Box, Brown, Buckingham, Buddy, Burgers, Cairn, California, Cambridge, Caribbean, Carina, Carl, Carla, Castle, Chester, Chichen, China, Chloe, Christie, Christine, Clare, Clark, Classroom, Clothes, Clown, Coldeye, Come, Complimenting, Croatia, Dad, Dan, Dana, Daniel, Danielle, Darkman, Darren, Dave, David, Davis, Debbie, Despereaux, Dialog, Dialoge, Diana, Disneyland, Doctor, Doctors, Don, Dragon, Edwina, Elisabeth, Ellie, Emergency, Emily, Emma, Encouraging, England, English, European, Every, False, Faye, Fido, Food, France, Frank, Fred, Freddy, George, Georgia, German, Gina, Good, Gordon, Grace, Great, Green, Grey, Greybeard, Groans, Guess, Halloween, Hammond, Harris, Harry, Help, Henry, Hmm, Holmes, Homework, Hook, Hungary, Hunt, Imperatives, Infinitiv, Interviewer, Ireland, Irish, Irregular, Italian, Itza, Jack, Jacob, James, Jamie, Jane, Janet, Jay, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jill, Jimmy, Joe, John, Jolly, Jones, Julia, Jun, Jupiter, Just, Justyna, Kate, Ken, Kinds, Kitty, Kukulkan, Lane, Lara, Laura, Leah, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Linking, Lisa, London, Lucy, Luna, Mail, Manchester, Mandy, Manju, Manson, Mario, Mark, Marple, Mary, Matt, Mayan, Mei, Mexico, Michael, Mike, Mill, Miriam, Miss, Moira, Mr, Mrs, Mum, Nathan, New, Nibbs, Nice, Nick, Nomen, North, Number, Numbers, Object, Objekte, Oliver, Olivia, Omar, Ordinal, Palace, Pardon, Paris, Parsons, Past, Paul, Paula, Paws, People, Pete, Peter, Pets, Pirates, Plural, Plurals, Polly, Possessives, Potter, Prepositions, Present, Priestly, Project, Put, Rajit, Ranjit, Rashmi, Really, Red, Reihenfolge, Richard, Robert, Ron, Ronald, Rose, Rosie, Sally, Sam, Samuel, Sandra, Sara, Sarah, Saying, School, Scotland, Sean, Sherlock, Sicily, Smith, Sophia, Sophie, States, Steve, Sue, Sunborn, Suzy, Tale, Tamar, Tamara, Tammy, Tell, Telling, Text, Think, Tick, Tim, Toby, Tock, Tom, Tony, Tricia, Trick, True, Turan, Uhr, Um, United, Vienna, Walker, Wall, Watson, Welcome, Well, White, William, Wise, Work, Wortes, Would, Wow, Wu, Yeah, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Vocab items (34)

| id | d | s | mc | pool | gloss |
|---|---|---|---|---|---|
| g2u03.w.apple-bobbing | You play this at Halloween: there is food in water, and you must catch it with your mouth — no fingers! | We also play ___ at Halloween. It's difficult, but fun — you must catch an apple with your mouth! | trick or treat ; picnic ; tradition | trick or treat ; picnic ; tradition ; costume | water (= Wasser) |
| g2u03.w.century | One hundred years - a very long time. | She was dressed like a girl from the 19th ___. | week ; month ; year | week ; month ; year ; day ; night | — |
| g2u03.w.costume | You wear it at Halloween to look like a vampire, a witch or a ghost. | Her ___ is scary! She looks like a vampire. | sweater ; jacket ; cap | sweater ; jacket ; cap ; belt ; hat | — |
| g2u03.w.couldn-t | You wanted to do it yesterday, but it was not possible. | Lara wanted to eat more sweets, but she ___ - she was too sick. | can't ; must ; shall | can't ; must ; shall ; doesn't ; don't | — |
| g2u03.w.cute | Small, pretty and nice to look at - like a young rabbit. | Look at my rabbit. Isn't it ___? I love its small nose and big eyes. | scary ; angry ; tired | scary ; angry ; tired ; hungry ; sad | — |
| g2u03.w.cycle-helmet | A strong hat that you wear when you ride a bike. | Always wear a ___ when you ride a bike. | mask ; costume ; dress | mask ; costume ; dress ; cape ; school tie | — |
| g2u03.w.dress | Girls often wear it to a surprise party - it is long, like a skirt and a shirt in one. | Edwina wears a long ___, like a girl from the 19th century. | hat ; cap ; belt | hat ; cap ; belt ; hoodie ; sweater | — |
| g2u03.w.front-window | The glass in a building that you look out of, into the street | We put some vampire stickers on his ___. | stairs ; graveyard ; knife | stairs ; graveyard ; knife ; century ; tradition | — |
| g2u03.w.ghost | A dead man or woman who can come back at night in scary stories. | Edwina looked white. Then she disappeared. Was she a ___? | king ; vampire ; superheroine | king ; vampire ; superheroine ; captain | — |
| g2u03.w.graveyard | A dark place with stones where the dead lie. | There were some trees next to the ___, a dark place with stones for the dead. | castle ; park ; supermarket | castle ; park ; supermarket ; library ; campsite | — |
| g2u03.w.guys | You can call a group of friends or children this. | Come on, ___. Don't look. OK? | teachers ; parents ; customers | teachers ; parents ; customers ; women ; neighbours | — |
| g2u03.w.knife | With this, you can cut off a piece of bread or cheese | I need a ___ to cut vegetables. | plate ; glass ; bottle | plate ; glass ; bottle ; tin ; ruler | cut (= schneiden) |
| g2u03.w.mask | You wear it over your eyes and nose, so you look like a ghost or a vampire. | Everybody wears a ___ over their eyes. We're vampires, witches and ghosts! | costume ; hat ; dress | costume ; hat ; dress ; cap | — |
| g2u03.w.myself | Me, and no one else - like in: "I looked at ... in the mirror." | When I am alone, I often talk to ___. | him ; her ; them | him ; her ; them ; us ; you | — |
| g2u03.w.picnic | Lunch outside. You sit down in the park and eat sandwiches from a basket. | Let's have a ___ in the park. I can bring sandwiches and orange juice. | costume ; graveyard ; tradition | costume ; graveyard ; tradition ; mask ; century | — |
| g2u03.w.pumpkin-bucket | Children carry it when they go trick-or-treating and put their sweets in it. | The child is trick-or-treating with a ___ for the sweets. | mask ; sticker ; costume | mask ; sticker ; costume ; cycle helmet | — |
| g2u03.w.shall | You ask a friend about what to do: "Where ... we go? What ... we do?" | "Where ___ we go?" asked Edwina. "Well, down the road!" | must ; couldn't ; can't | must ; couldn't ; can't ; don't | — |
| g2u03.w.sick | Ill and not well. You can be like this after too many sweets. | I feel a bit ___. Too many sweets! | cute ; wild ; proud | cute ; wild ; proud ; scary ; strong | feel (= (sich) fühlen) ; a bit (= ein bisschen) |
| g2u03.w.stairs | In a building, you go up these to the rooms over you | We go up the ___ in the dark. | door ; front window ; garage | door ; front window ; garage ; kitchen ; graveyard | — |
| g2u03.w.sticker | A small picture that you can put on a window, a book or a door | I put a vampire ___ on his window. | mask ; magazine ; key ring | mask ; magazine ; key ring ; letter ; tin | — |
| g2u03.w.superheroine | A very strong woman from a story or a fantasy film. She fights bad people. | She was dressed up as her favourite ___. | century ; tradition ; graveyard | century ; tradition ; graveyard ; costume ; picnic | dressed up as (= verkleidet als) |
| g2u03.w.sweets | Food with a lot of sugar in it, like chocolate | People sometimes give us ___ at Halloween. | cheese ; sausages ; bread | cheese ; sausages ; bread ; soup ; salad | — |
| g2u03.w.to-be-proud | When you are very happy about a good thing that you did | This year my pumpkin was the best. I was very ___ of it. | to be scared of ; to fear ; to scare | to be scared of ; to fear ; to scare ; to be in danger | pumpkin (= Kürbis) |
| g2u03.w.to-cut-off | To make a piece go away with a knife | Please give me the knife. I want to ___ the top of the pumpkin. | to keep ; to lose ; to scare | to keep ; to lose ; to scare ; to fear ; to break | top (= oberer Teil) ; pumpkin (= Kürbis) |
| g2u03.w.to-fear | To be scared of a ghost, a big dog or a scary story. | We do not ___ the zombies, because we aren't scared of them! | to scare ; to love ; to enjoy | to scare ; to love ; to enjoy ; to hate ; to lose | zombies (= Zombies) |
| g2u03.w.to-keep | To have a thing and not give it away | Let's ___ the pumpkin for Halloween. | to lose ; to cut off ; to fear | to lose ; to cut off ; to fear ; to scare ; to borrow | pumpkin (= Kürbis) |
| g2u03.w.to-lose | To not have it any more because you cannot find it. | I don't want to ___ my mobile phone. | find ; eat ; wash | find ; eat ; wash ; paint ; catch | — |
| g2u03.w.to-scare | When a ghost or a scary story makes you jump. | At Halloween, some costumes ___ me. | fear ; keep ; lose | fear ; keep ; lose ; visit ; carry | — |
| g2u03.w.tradition | What a family always does, year after year — at Halloween or on a birthday. | What's your favourite Halloween ___ — apple bobbing or trick or treat? | surprise ; opinion ; joke | surprise ; opinion ; joke ; secret ; tip | — |
| g2u03.w.trick-or-treat | At Halloween, children knock on doors and ask for sweets. | When my friends meet for ___, we go from door to door. | apple bobbing ; picnic ; tradition | apple bobbing ; picnic ; tradition ; costume | — |
| g2u03.w.trick-or-treat-2 | Children ask this at the door at Halloween when they want sweets | We knocked on the door. A woman opened it. "___?" Darren asked. | Go away! ; Come on! ; Congratulations! | Go away! ; Come on! ; Congratulations! ; What's the matter? ; Have fun! | — |
| g2u03.w.vampire | In scary stories, a man with long teeth and a black cape. | I've got my ___ costume, but I can't find my teeth. | ghost ; witch ; superheroine | ghost ; witch ; superheroine ; mask | — |
| g2u03.w.wild | Very noisy, with a lot of running and jumping. | You shouldn't play many ___ games. | cute ; sick ; proud | cute ; sick ; proud ; sad ; tired | shouldn't (= solltest nicht) ; games (= Spiele) |
| g2u03.w.witch | A woman in scary stories who can do magic. | Do all ___ wear funny hats? — Yes, and they can do magic, too! | ghost ; vampire ; superheroine | ghost ; vampire ; superheroine ; costume ; mask | — |

## Grammar items (27)

| id | fmt | prompt | answers | distractors | pairs | groups | gloss |
|---|---|---|---|---|---|---|---|
| g2u03.gi.should.cp.001 | context-picker | Lara is eating too many sweets. Now she is sick. [en] | She shouldn't eat so many sweets. (full) | She should eat so many sweets. ; She don't should eat so many sweets. ; She shouldn't to eat so many sweets. | — | — | — |
| g2u03.gi.should.cp.002 | context-picker | Edwina wants to go into the dark building next to the graveyard. Ron is scared. [en] | You shouldn't go in there alone. (full) | You should go in there alone. ; You don't should go in there alone. ; You shoulds go in there alone. | — | — | — |
| g2u03.gi.should.ec.001 | error-correction | You should to wear a costume at Halloween. [en] | You should wear a costume at Halloween. (full) ; You should wear a costume at Halloween (full) ; should wear (partial) | — | — | — | — |
| g2u03.gi.should.ec.002 | error-correction | You don't should go out alone at night. [en] | You shouldn't go out alone at night. (full) ; You shouldn't go out alone at night (full) ; You should not go out alone at night. (full) ; You should not go out alone at night (full) ; shouldn't go (partial) ; should not go (partial) ; shouldn't (partial) | — | — | — | — |
| g2u03.gi.should.ec.003 | error-correction | Henry shoulds put a candle in the front window. [en] | Henry should put a candle in the front window. (full) ; Henry should put a candle in the front window (full) ; should put (partial) ; should (partial) | — | — | — | — |
| g2u03.gi.should.gf.001 | gap-fill | Sarah's tip: You ___ wear a Halloween costume. It's fun! [en, 1 blank(s)] | should (full) | — | — | — | — |
| g2u03.gi.should.gf.002 | gap-fill | We ___ go in there – it's dangerous. [en, 1 blank(s)] | shouldn't (full) ; should not (full) | — | — | — | — |
| g2u03.gi.should.gf.003 | gap-fill | You ___ always tell an adult where you are going. [en, 1 blank(s)] | should (full) | — | — | — | — |
| g2u03.gi.should.gf.004 | gap-fill | Ron is alone at the graveyard and he is scared. He asks: 'What ___ I do?' [en, 1 blank(s)] | should (full) ; shall (full) | — | — | — | — |
| g2u03.gi.should.gf.005 | gap-fill | Lara is sick. Ron is angry: 'You ___ (not) eat so many sweets!' [en, 1 blank(s)] | shouldn't (full) ; should not (full) | — | — | — | — |
| g2u03.gi.should.gf.006 | gap-fill | It's dark and Edwina is scared. She asks Ron: '___ I call my parents now?' [en, 1 blank(s)] | Should (full) ; Shall (full) | — | — | — | — |
| g2u03.gi.should.gf.007 | gap-fill | It's night and very dark. We ___ ___ (go) back now. [en, 2 blank(s)] | should \| go (full) | — | — | — | — |
| g2u03.gi.should.gf.008 | gap-fill | Ask your mum about your costume for Halloween: '___ I ___ (wear) my witch dress or my vampire costume?' [en, 2 blank(s)] | Should \| wear (full) ; Shall \| wear (full) | — | — | — | — |
| g2u03.gi.should.gf.009 | gap-fill | Sarah's tips for Halloween at school: The children ___ ___ (be) too wild. [en, 2 blank(s)] | shouldn't \| be (full) ; should not \| be (full) ; should \| not be (full) | — | — | — | — |
| g2u03.gi.should.gs.001 | group-sort | Tips for trick-or-treating [en] | — | — | — | You should …: wear a costume, always go with friends, tell an adult where you are going \| You shouldn't …: scare very small children, stay out too long, eat all the sweets in one go, go out alone | — |
| g2u03.gi.should.mc.001 | multiple-choice | You ___ scare small children. It isn't funny for them. [en, 1 blank(s)] | shouldn't (full) | should ; must ; couldn't | — | — | — |
| g2u03.gi.should.mc.002 | multiple-choice | Henry's pumpkin bucket is so scary. The teacher is proud of it: 'We ___ keep it for Halloween at school.' [en, 1 blank(s)] | should (full) | shouldn't ; couldn't ; can't | — | — | — |
| g2u03.gi.should.mc.003 | multiple-choice | Sarah wants good music for Halloween, but it ___ be too noisy. [en, 1 blank(s)] | shouldn't (full) | should ; must ; couldn't | — | — | — |
| g2u03.gi.should.mt.001 | matching | Tips for Halloween night [en] | — | — | I'm so tired. ↔ You should go to bed early. ; It's very dark in here. ↔ You should find a candle. ; I can't find my vampire teeth. ↔ You should look on the table. ; I eat sweets all day. ↔ You shouldn't eat so many sweets. | — | — |
| g2u03.gi.should.mt.002 | matching | What should they do? [en] | — | — | It's Halloween tonight. ↔ We should put on our costumes. ; The graveyard is very dark. ↔ We shouldn't go in there now. ; Lara is sick. ↔ She shouldn't eat more sweets. ; The picture of the witch is so scary. ↔ We should keep it for Halloween. | — | — |
| g2u03.gi.should.qf.001 | question-formation | I should tell my parents. [en] | Should I tell my parents? (full) ; Should I tell my parents (full) | — | — | — | — |
| g2u03.gi.should.qf.002 | question-formation | wear / should / what / I / tonight [en] | What should I wear tonight? (full) ; What should I wear tonight (full) | — | — | — | — |
| g2u03.gi.should.sb.001 | sentence-building | bed / should / you / to / go / don't [en] | You should go to bed. (full) ; You should go to bed (full) | don't | — | — | — |
| g2u03.gi.should.sb.002 | sentence-building | go / alone / you / shouldn't / out / don't / to [en] | You shouldn't go out alone. (full) ; You shouldn't go out alone (full) | don't ; to | — | — | — |
| g2u03.gi.should.tr.001 | translation | Du solltest immer mit Freunden gehen. [de] | You should always go with friends. (full) ; You should always go with friends (full) ; You should always go with your friends. (partial) ; You should always go with your friends (partial) | — | — | — | — |
| g2u03.gi.should.tr.002 | translation | Lara sollte nicht so viele Süßigkeiten essen. [de] | Lara shouldn't eat so many sweets. (full) ; Lara shouldn't eat so many sweets (full) ; Lara should not eat so many sweets. (full) ; Lara should not eat so many sweets (full) ; Lara shouldn't have so many sweets. (partial) ; Lara shouldn't have so many sweets (partial) ; Lara shouldn't eat so much candy. (partial) ; Lara shouldn't eat so much candy (partial) ; Lara shouldn't eat so many candies. (partial) ; Lara should not eat so much candy. (partial) ; Lara should not eat so many candies. (partial) | — | — | — | — |
| g2u03.gi.should.tr.003 | translation | What should I do? [en] | Was soll ich tun? (full) ; Was soll ich tun (full) ; Was soll ich machen? (full) ; Was soll ich machen (full) ; Was sollte ich tun? (full) ; Was sollte ich tun (full) ; Was sollte ich machen? (full) ; Was sollte ich machen (full) | — | — | — | — |

## Output contract

Write `content/corpus/units/g2-u03/verify/level-gloss.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u03",
  "lens": "level-gloss",
  "itemsHash": "8a00bfa24670",
  "promptHash": "aefb997bf664",
  "round": 4,
  "by": "fable-lens-level-gloss",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 61, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
