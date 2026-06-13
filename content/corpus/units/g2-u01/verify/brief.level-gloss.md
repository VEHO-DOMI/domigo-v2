# Verify lens — level-gloss — g2-u01 (round 6)

<!-- domigo:verify level-gloss g2-u01 items=015265583952 prompt=aefb997bf664 round=6 -->

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alan, Alison, Alphabet, Alps, America, Anderson, Andrew, Andy, Anger, Annie, Arbeit, Archie, Arousing, Articles, Australia, Austria, Bacon, Baker, Befehlsformen, Ben, Bert, Betty, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Bob, Bolt, Box, Brown, Buckingham, Buddy, Burgers, Cairn, California, Cambridge, Caribbean, Carina, Carl, Castle, Chester, Chichen, China, Chloe, Christie, Christine, Clare, Clark, Classroom, Clothes, Clown, Coldeye, Come, Complimenting, Croatia, Dad, Dan, Dana, Daniel, Danielle, Darkman, Dave, David, Davis, Debbie, Despereaux, Dialog, Dialoge, Diana, Disneyland, Doctor, Doctors, Don, Dragon, Elisabeth, Ellie, Emergency, Emma, Encouraging, England, English, European, Every, False, Faye, Fido, Food, France, Frank, Fred, Freddy, George, Georgia, German, Gina, Good, Gordon, Grace, Great, Grey, Greybeard, Groans, Guess, Hammond, Harry, Help, Henry, Hmm, Holmes, Homework, Hook, Hungary, Hunt, Imperatives, Infinitiv, Interviewer, Ireland, Irish, Irregular, Italian, Itza, Jack, Jacob, James, Jamie, Jane, Janet, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jill, Joe, John, Jolly, Julia, Jun, Jupiter, Just, Justyna, Kate, Ken, Kinds, Kitty, Kukulkan, Lane, Leah, Leo, Lethabo, Leute, Lewis, Li, Liam, Linking, Lisa, London, Lucy, Luna, Mail, Manchester, Mandy, Manju, Manson, Mario, Mark, Marple, Mary, Matt, Mayan, Mexico, Michael, Mike, Mill, Miriam, Miss, Moira, Mr, Mrs, Mum, Nathan, New, Nibbs, Nice, Nick, Nomen, North, Number, Numbers, Object, Objekte, Olivia, Omar, Ordinal, Palace, Pardon, Paris, Past, Paul, Paula, Paws, People, Pete, Peter, Pets, Pirates, Plural, Plurals, Polly, Possessives, Potter, Prepositions, Present, Priestly, Project, Put, Rajit, Ranjit, Rashmi, Really, Red, Reihenfolge, Richard, Robert, Ronald, Rose, Rosie, Sally, Sam, Samuel, Sandra, Sara, Saying, School, Scotland, Sean, Sherlock, Smith, Sophia, Sophie, States, Steve, Sue, Suzy, Tale, Tamar, Tamara, Tammy, Tell, Telling, Text, Think, Tick, Tim, Toby, Tock, Tom, Tony, Tricia, True, Turan, Uhr, Um, United, Vienna, Walker, Wall, Watson, Welcome, Well, White, William, Wise, Work, Wortes, Would, Wow, Yeah, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Vocab items (48)

| id | d | s | mc | pool | gloss |
|---|---|---|---|---|---|
| g2u01.w.along | From one end of a thing to the end of it. | We go ___ the long street to school. | across ; under ; into | across ; under ; into ; near ; behind | — |
| g2u01.w.area | a place in a town or city | There is a lot of rubbish in this ___ of the town. | country ; garden ; river | country ; garden ; river ; park ; room | — |
| g2u01.w.art | The subject where you paint and make pictures. | I painted a picture of my dog in ___. | music ; science ; maths | music ; science ; maths ; history ; geography | — |
| g2u01.w.as-soon-as | At once, just after one thing happens. | I have breakfast ___ I get up in the morning. | because ; before ; but | because ; before ; but ; and | — |
| g2u01.w.bicycle-lane | It is on the road, but cars do not go on it. | There is a new ___ in my town now. | timetable ; calendar ; shadow | timetable ; calendar ; shadow ; area ; break | — |
| g2u01.w.break | A short time to play and eat after a lesson at school. | In the ___ we go outside and play. | lesson ; subject ; timetable | lesson ; subject ; timetable ; calendar ; area | — |
| g2u01.w.calendar | A thing that shows you all the days and months of a year. | It shows all the days of the year. It is like a big ___. | timetable ; webpage ; ticket | timetable ; webpage ; ticket ; book | — |
| g2u01.w.colourful | A thing with red, purple, white and many more in it. | There are many ___ parrots at the zoo. | scary ; popular ; noisy | scary ; popular ; noisy ; beautiful ; daily | — |
| g2u01.w.daily | Happening every day. | I get up at seven o'clock every day. It is my ___ life. | early ; free ; scary | early ; free ; scary ; noisy | — |
| g2u01.w.design-and-technology | The school subject where you make and paint a box or a car. | In ___ we make and paint a small box. | art ; music ; science | art ; music ; science ; geography ; maths | — |
| g2u01.w.english | The subject where you read and write stories from Britain. | We have ___ and read stories from Britain. | French ; music ; geography | French ; music ; geography ; history ; maths | — |
| g2u01.w.french | The subject you study to talk to people in France. | My sister studies ___ so she can talk to people in France. | English ; music ; science | English ; music ; science ; art ; geography | — |
| g2u01.w.geography | The subject about countries, cities and rivers. | In ___ we read about countries, cities and rivers. | history ; science ; maths | history ; science ; maths ; art ; music | — |
| g2u01.w.glad | Very happy about a good thing. | I was ___ to stay at home with my family. | sad ; angry ; tired | sad ; angry ; tired ; scary ; noisy | — |
| g2u01.w.grandmother | the mother of your mum or dad | My ___ lives in Mexico. | mother ; aunt ; daughter | mother ; aunt ; daughter ; uncle ; sister | — |
| g2u01.w.history | The school subject about kings, queens and famous people from the past. | In ___ we read about famous people from the past. | geography ; science ; maths | geography ; science ; maths ; art ; music | — |
| g2u01.w.information-technology | The school subject where you work on computer games and webpages. | In ___ we play computer games and make a webpage. | science ; geography ; art | science ; geography ; art ; music ; maths | — |
| g2u01.w.joke | a short story you tell to make people laugh | We all laughed at Tom's good ___. | poem ; letter ; picture | poem ; letter ; picture ; calendar | — |
| g2u01.w.kilometre | How long a road is. A road can be one, two or many of them. | My new school is one ___ from the park. | area ; shadow ; calendar | area ; shadow ; calendar ; timetable ; spring | — |
| g2u01.w.king | A man who can make the rules. | A ___ can make the rules. | queen ; guide ; captain | queen ; guide ; captain ; singer ; teacher | — |
| g2u01.w.lesson | A time at school when you study one subject. | Our first ___ begins in the morning, at seven o'clock. | break ; timetable ; subject | break ; timetable ; subject ; homework | — |
| g2u01.w.maths | The subject where you work with numbers. | I like ___ because I am good with numbers. | science ; geography ; history | science ; geography ; history ; music ; art | — |
| g2u01.w.music | The subject where you play the guitar. | We play the guitar in our ___ lesson. | art ; maths ; geography | art ; maths ; geography ; science ; history | — |
| g2u01.w.noisy | Making a lot of noise. | I do not like ___ people. | scary ; colourful ; popular | scary ; colourful ; popular ; daily ; glad | — |
| g2u01.w.online-safety | How to be careful with a tablet or mobile phone. | Our teacher talked about ___ in class today. | opinion ; timetable ; calendar | opinion ; timetable ; calendar ; area ; break | — |
| g2u01.w.opinion | What you think about a thing. | In my ___, this is the best book. | joke ; calendar ; area | joke ; calendar ; area ; shadow ; break | — |
| g2u01.w.physical-education | The subject where you run, jump and play outside. | In ___ we run, jump and play outside. | art ; music ; history | art ; music ; history ; maths ; geography | — |
| g2u01.w.popular | that many people like very much | Maths is a ___ subject at our school. | expensive ; dangerous ; noisy | expensive ; dangerous ; noisy ; tiny | — |
| g2u01.w.queen | A woman who can make the rules. | A ___ can make the rules. | king ; guide ; captain | king ; guide ; captain ; singer ; teacher | — |
| g2u01.w.rubbish | Food, bottles and boxes that you do not want any more. | There is too much ___ in the street. | area ; shadow ; calendar | area ; shadow ; calendar ; joke ; timetable | — |
| g2u01.w.scary | It makes you scared. | The story was very ___ and I was scared. | pretty ; sunny ; colourful | pretty ; sunny ; colourful ; beautiful ; noisy | — |
| g2u01.w.science | The subject where you study light, space and the Earth. | We study light and space in ___. | geography ; maths ; history | geography ; maths ; history ; art ; music | — |
| g2u01.w.shadow | a dark place on the wall behind a thing in the light | Look — there is a dark ___ behind me on the wall. | light ; mirror ; cloud | light ; mirror ; cloud ; window ; stone | — |
| g2u01.w.spring | the time of year after the cold months and before summer | My birthday is in ___, in May. | summer ; evening ; weekend | summer ; evening ; weekend ; morning ; night | — |
| g2u01.w.subject | Maths, art, music and history are all kinds of these. | English is my favourite ___ of all. | lesson ; break ; timetable | lesson ; break ; timetable ; calendar ; shadow | — |
| g2u01.w.supper | The food you eat in the evening. | In the evening we eat ___. | breakfast ; lunch ; lesson | breakfast ; lunch ; lesson ; timetable | — |
| g2u01.w.timetable | It shows you what lessons you have on every day of the week. | She has four English lessons in her ___. | calendar ; lesson ; subject | calendar ; lesson ; subject ; shadow ; area | — |
| g2u01.w.to-book | to pay for a place or ticket before you go | You can ___ your holiday today. | sell ; visit ; clean | sell ; visit ; clean ; wash ; paint | — |
| g2u01.w.to-crawl | To go like a lizard, near the road and under stones. | Lizards ___ across the road and under the stones. | to travel ; to book ; to prepare | to travel ; to book ; to prepare ; to visit ; to put on | — |
| g2u01.w.to-get-dressed | To put your clothes on. | I wash, ___ and have breakfast with my mum and dad. | to put on ; to get up ; to wash | to put on ; to get up ; to wash ; to take a rest | — |
| g2u01.w.to-go-for-a-walk | To spend time outside on your feet, often with your dog. | After school, I ___ with my dog. | to take a rest ; to stay at home ; to travel | to take a rest ; to stay at home ; to travel ; to go to bed | — |
| g2u01.w.to-prepare | To make food before you eat it. | I help my mum to ___ food for our supper. | to clean ; to travel ; to visit | to clean ; to travel ; to visit ; to crawl | — |
| g2u01.w.to-put-on | To wear clothes like a jacket or a hat. | After breakfast, I ___ my school clothes. | to take out ; to clean ; to carry | to take out ; to clean ; to carry ; to wash | — |
| g2u01.w.to-stay-at-home | To not go out, but to be in with your family all day. | It is cold, so we want to ___ today. | to travel ; to go for a walk ; to take a rest | to travel ; to go for a walk ; to take a rest ; to visit ; to put on | — |
| g2u01.w.to-take-a-rest | To sit down and be still for a short time when you are tired. | After a long day at school, I ___ before I do my homework. | to travel ; to book ; to prepare | to travel ; to book ; to prepare ; to put on ; to visit | — |
| g2u01.w.to-travel | To go to new places, often on a plane or a train. | My family and I ___ to many countries every summer. | to stay at home ; to visit ; to book | to stay at home ; to visit ; to book ; to go for a walk ; to take a rest | — |
| g2u01.w.to-visit | To go to a place or to people and be there for a time. | In the holidays we ___ our grandmother in Mexico. | to travel ; to book ; to prepare | to travel ; to book ; to prepare ; to put on ; to crawl | — |
| g2u01.w.webpage | You read it on a tablet or mobile phone. | Open the school ___ and read it on your tablet. | calendar ; timetable ; joke | calendar ; timetable ; joke ; area ; shadow | — |

## Grammar items (22)

| id | fmt | prompt | answers | distractors | pairs | groups | gloss |
|---|---|---|---|---|---|---|---|
| g2u01.gi.past-simple.cp.001 | context-picker | Your friend asks what you did last weekend. [en] | Last weekend, I visited my grandmother and cooked dinner. (full) | Last weekend, I visit my grandmother and cook dinner. ; Last weekend, I visiting my grandmother and cooking dinner. ; Last weekend, I am visiting my grandmother and cooking dinner. | — | — | — |
| g2u01.gi.past-simple.ec.001 | error-correction | Yesterday I watch TV. [en] | Yesterday I watched TV. (full) ; watched (partial) | — | — | — | — |
| g2u01.gi.past-simple.ec.002 | error-correction | Last summer, my holiday is amazing. [en] | Last summer, my holiday was amazing. (full) ; was (partial) | — | — | — | — |
| g2u01.gi.past-simple.ff.001 | free-form | Tell your friend what you did in your last holiday. [en] | Last summer, I stayed at home and watched TV. (full) ; I visited my grandmother and we cooked dinner. (full) ; My family had a holiday in Mexico and we visited a castle. (full) ; I stayed at home. (partial) | — | — | — | — |
| g2u01.gi.past-simple.gf.001 | gap-fill | After dinner, I ___ a book. [en, 1 blank(s)] | read (full) | — | — | — | — |
| g2u01.gi.past-simple.gf.002 | gap-fill | On Sunday, I ___ my homework and ___ my room. [en, 2 blank(s)] | did \| cleaned (full) ; did \| tidied (partial) | — | — | — | — |
| g2u01.gi.past-simple.mc.001 | multiple-choice | Yesterday, I ___ my homework after supper. [en, 1 blank(s)] | did (full) | do ; does ; doing | — | — | — |
| g2u01.gi.past-simple.mc.002 | multiple-choice | Last year, my family ___ a scary holiday. [en, 1 blank(s)] | had (full) | have ; has ; having | — | — | — |
| g2u01.gi.past-simple.sb.001 | sentence-building | summer / I / visited / my / grandmother / last [en] | Last summer, I visited my grandmother. (full) ; I visited my grandmother last summer. (full) | — | — | — | — |
| g2u01.gi.past-simple.tf.001 | transformation | I visit my grandmother. (last spring) [en] | I visited my grandmother last spring. (full) ; Last spring, I visited my grandmother. (full) | — | — | — | — |
| g2u01.gi.past-simple.tr.001 | translation | Gestern habe ich nach dem Abendessen ferngesehen. [de] | Yesterday, I watched TV after dinner. (full) ; I watched TV after dinner yesterday. (full) ; Yesterday I watched TV after supper. (full) ; Yesterday, I watched television after dinner. (partial) | — | — | — | — |
| g2u01.gi.present-simple.cp.001 | context-picker | It is the evening. Your sister watches TV every day, like she always does. [en] | My sister watches TV every evening. (full) | My sister watch TV every evening. ; My sister watching TV every evening. ; My sister doesn't watches TV every evening. | — | — | — |
| g2u01.gi.present-simple.ec.001 | error-correction | My dad cook dinner every evening. [en] | My dad cooks dinner every evening. (full) ; cooks (partial) | — | — | — | — |
| g2u01.gi.present-simple.ec.002 | error-correction | He don't like history. [en] | He doesn't like history. (full) ; He does not like history. (full) ; doesn't (partial) | — | — | — | — |
| g2u01.gi.present-simple.gf.001 | gap-fill | Every day, I ___ my homework after supper. [en, 1 blank(s)] | do (full) | — | — | — | — |
| g2u01.gi.present-simple.gf.002 | gap-fill | On Mondays we ___ art and music. [en, 1 blank(s)] | have (full) | — | — | — | — |
| g2u01.gi.present-simple.gf.003 | gap-fill | Grace gets up early. She ___ her classroom every day. [en, 1 blank(s)] | cleans (full) | — | — | — | — |
| g2u01.gi.present-simple.gf.004 | gap-fill | Sam likes maths, but he ___ history. [en, 1 blank(s)] | doesn't like (full) ; does not like (full) | — | — | — | — |
| g2u01.gi.present-simple.mc.001 | multiple-choice | My sister ___ French at school every day. [en, 1 blank(s)] | studies (full) | study ; watch ; go | — | — | — |
| g2u01.gi.present-simple.qf.001 | question-formation | Sam plays football every day. Ask if this is true. [en] | Does Sam play football every day? (full) | — | — | — | — |
| g2u01.gi.present-simple.sb.001 | sentence-building | we / music / have / on / Mondays / does / art [en] | We have music on Mondays. (full) ; We have art on Mondays. (full) | — | — | — | — |
| g2u01.gi.present-simple.tf.001 | transformation | I study French at school. (my sister) [en] | My sister studies French at school. (full) | — | — | — | — |

## Output contract

Write `content/corpus/units/g2-u01/verify/level-gloss.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u01",
  "lens": "level-gloss",
  "itemsHash": "015265583952",
  "promptHash": "aefb997bf664",
  "round": 6,
  "by": "fable-lens-level-gloss",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 70, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
