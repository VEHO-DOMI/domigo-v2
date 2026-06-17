# Verify lens — level-gloss — g1-u11 (round 2)

<!-- domigo:verify level-gloss g1-u11 items=e2b0f58f9867 prompt=aefb997bf664 round=2 -->

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alphabet, Alps, Anderson, Anger, Annie, Arbeit, Archie, Articles, Austria, Bacon, Baker, Befehlsformen, Bert, Betty, Bild, Bilder, Blackbeard, Blackie, Bob, Box, Buckingham, Buddy, Burgers, California, Cambridge, Caribbean, Carina, Carl, Chester, China, Chloe, Christie, Christine, Clare, Classroom, Clothes, Clown, Come, Complimenting, Dad, Dan, Dana, Daniel, Dave, David, Davis, Debbie, Dialog, Dialoge, Doctor, Doctors, Don, Dragon, Ellie, Emma, England, English, False, Fido, Food, Frank, Fred, Freddy, George, Georgia, German, Gina, Good, Gordon, Great, Grey, Greybeard, Groans, Guess, Harry, Henry, Hmm, Holmes, Homework, Hook, Hunt, Imperatives, Irregular, Italian, Jack, Jacob, James, Jamie, Jane, Jenny, Jessica, Jill, John, Jolly, Julia, Jun, Just, Kitty, Leah, Leo, Lethabo, Leute, Lewis, Li, Lisa, London, Lucy, Mail, Manchester, Mandy, Manson, Mark, Marple, Mary, Matt, Mike, Miss, Mr, Mrs, Mum, New, Nibbs, Nice, Nick, Nomen, Number, Numbers, Object, Objekte, Olivia, Omar, Palace, Pardon, Paws, Pete, Peter, Pets, Pirates, Plural, Plurals, Polly, Possessives, Prepositions, Present, Priestly, Project, Put, Rajit, Rashmi, Red, Reihenfolge, Richard, Robert, Ronald, Rosie, Sally, Sam, Sandra, Saying, School, Sherlock, Smith, Sophia, Steve, Sue, Suzy, Tamar, Tamara, Tammy, Telling, Text, Think, Tick, Tim, Toby, Tock, Tom, Tony, True, Uhr, Um, Vienna, Walker, Wall, Watson, Welcome, Well, White, Wise, Work, Wortes, Would, Wow, Yeah, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Vocab items (58)

| id | d | s | mc | pool | gloss |
|---|---|---|---|---|---|
| g1u11.w.9-a-m | The time early in the morning when many children go to school. | School begins at ___ in the morning, so we go in. | 9 p.m. ; midday ; midnight | 9 p.m. ; midday ; midnight ; 9 o'clock | — |
| g1u11.w.9-o-clock | The time when the clock shows the small number and no minutes. | The clock shows ___, with no minutes more. | half past nine ; (a) quarter to ten ; midday | half past nine ; (a) quarter to ten ; midday ; (a) quarter past nine | — |
| g1u11.w.9-p-m | The time late in the evening when many children go to bed. | My favourite programme is on at ___ in the evening. | 9 a.m. ; midday ; midnight | 9 a.m. ; midday ; midnight ; 9 o'clock | late (= spät) |
| g1u11.w.amazing | Very, very good — so good that you go wow! | Tim has got something ___ for Suzy in the park. | daily ; outside ; free time | daily ; outside ; free time ; weather | something (= etwas) |
| g1u11.w.bedtime | The time at night when you go to sleep. | It's 9 o'clock at night, so it is ___ for the children. | break ; free time ; midday | break ; free time ; midday ; 9 a.m. | — |
| g1u11.w.break | A short time in school when you eat and play. | At a quarter to nine we have a ___ and eat something. | bedtime ; clock ; exercise | bedtime ; clock ; exercise ; free time | something (= etwas) |
| g1u11.w.bush | A small plant with many leaves, smaller than a tree. | The dog is hiding behind the big ___ in the park. | road ; clock ; surprise | road ; clock ; surprise ; knock | plant (= Pflanze) |
| g1u11.w.clock | A thing on the wall that shows you the time. | I look at the ___ on the wall to get the time. | road ; bush ; knock | road ; bush ; knock ; weather | get (= ablesen) |
| g1u11.w.clue | A little help so you can find the answer. | I can't find the answer. Please give me a ___! | clock ; knock ; surprise | clock ; knock ; surprise ; weather | little (= kleine) ; answer (= Antwort) ; help (= Hilfe) |
| g1u11.w.daily | Happening every day. | At a quarter to ten we do our ___ exercise outside. | amazing ; outside ; free time | amazing ; outside ; free time ; weather | every (= jede/r) |
| g1u11.w.excuse-me | Nice words for somebody before you ask them something. | ___ What time is it, please? | Have fun! ; See you soon. ; Hurry up. | Have fun! ; See you soon. ; Hurry up. ; What's the time? | words (= Worte) ; something (= etwas) |
| g1u11.w.exercise | When you run and jump to make your body healthy. | Running and jumping outside are good ___ for you. | break ; clock ; weather | break ; clock ; weather ; bedtime | body (= Körper) |
| g1u11.w.free-time | When you have no school and can do what you like. | In my ___ I like to read a book or ride my bike. | bedtime ; break ; exercise | bedtime ; break ; exercise ; weather | — |
| g1u11.w.half-an-hour | 30 minutes. | The train comes in ___, so we wait 30 minutes. | midday ; bedtime ; free time | midday ; bedtime ; free time ; break | comes (= kommt) |
| g1u11.w.half-past-nine | 30 minutes after the clock shows 9. | I have my breakfast at ___, 30 minutes after 9. | (a) quarter past nine ; (a) quarter to ten ; 9 o'clock | (a) quarter past nine ; (a) quarter to ten ; 9 o'clock ; midday | — |
| g1u11.w.have-fun | Nice words for somebody who is going to do something good. | You're going to the park? ___ See you soon! | See you soon. ; Excuse me. ; Hurry up. | See you soon. ; Excuse me. ; Hurry up. ; What's the time? | words (= Worte) ; something (= etwas) |
| g1u11.w.hurry-up | Words for somebody who must be fast. | ___ The train leaves in five minutes! | See you soon. ; Have fun! ; Excuse me. | See you soon. ; Have fun! ; Excuse me. ; What's the time? | words (= Worte) ; fast (= schnell) |
| g1u11.w.it-s-10-a-m | Words for the time when the clock shows ten in the morning. | ___ in the morning, and our English class begins now. | It's 8 p.m. ; What time is it? ; See you soon. | It's 8 p.m. ; What time is it? ; See you soon. ; Have fun! | words (= Worte) |
| g1u11.w.it-s-8-p-m | Words for the time when the clock shows eight in the evening. | ___ in the evening, and it is night outside now. | It's 10 a.m. ; What's the time? ; Excuse me. | It's 10 a.m. ; What's the time? ; Excuse me. ; Hurry up. | words (= Worte) |
| g1u11.w.knock | The noise when somebody puts a hand on a door again and again. | There's a ___ at the door. Somebody is here. | surprise ; clock ; road | surprise ; clock ; road ; bush | hand (= Hand) ; puts (= legt) |
| g1u11.w.living-room | The place where you sit and watch TV with the family. | Mum is watching TV in the ___. | road ; place ; bush | road ; place ; bush ; weather | sit (= sitzen) |
| g1u11.w.midday | The time in the day when the clock shows 12 and we often have lunch. | We have lunch at ___, when the clock shows 12. | midnight ; bedtime ; 9 p.m. | midnight ; bedtime ; 9 p.m. ; 9 a.m. | — |
| g1u11.w.midnight | The time when the clock shows 12 late at night. | It is very late at night. The clock shows ___. | midday ; 9 a.m. ; bedtime | midday ; 9 a.m. ; bedtime ; 9 p.m. | late (= spät) |
| g1u11.w.outside | Not in a room, but in the open air. | It is a nice day. Let's play ___ in the park! | daily ; amazing ; free time | daily ; amazing ; free time ; weather | air (= Luft) |
| g1u11.w.place | The home where somebody lives. | Can you come to my ___ after school today? | road ; clock ; weather | road ; clock ; weather ; bush | home (= Zuhause) |
| g1u11.w.programme | A show that you watch on TV. | There is a great ___ on TV at 7 o'clock. | text message ; clock ; road | text message ; clock ; road ; weather | — |
| g1u11.w.quarter-past-nine | 15 minutes after the clock shows 9. | It is ___, so it is 15 minutes after 9. | half past nine ; (a) quarter to ten ; 9 o'clock | half past nine ; (a) quarter to ten ; 9 o'clock ; midday | — |
| g1u11.w.quarter-to-ten | 15 minutes before the clock shows 10. | It is ___, 15 minutes before 10. Let's hurry! | (a) quarter past nine ; half past nine ; 9 o'clock | (a) quarter past nine ; half past nine ; 9 o'clock ; midnight | — |
| g1u11.w.road | A long way where cars go from place to place. | I'm walking down the ___ to the park. | clock ; bush ; place | clock ; bush ; place ; weather | way (= Weg) ; walking (= gehen) |
| g1u11.w.see-you-soon | Nice words for a friend at the end, before going away. | I have to go now. ___ Call me tomorrow! | Have fun! ; Excuse me. ; Hurry up. | Have fun! ; Excuse me. ; Hurry up. ; What's the time? | words (= Worte) |
| g1u11.w.surprise | Something nice that you did not get before. | Tim has got a ___ for Suzy. She is happy! | knock ; clock ; weather | knock ; clock ; weather ; bush | get (= bekommen) ; something (= etwas) |
| g1u11.w.text-message | A short note that you get on your phone. | I got a ___ from my friend on my phone. | programme ; clock ; weather | programme ; clock ; weather ; surprise | note (= Nachricht) ; get (= bekommen) ; got (= bekommen) |
| g1u11.w.to-answer-the-door | To go and open up when somebody knocks. | Somebody is at the door. Can you ___, please? | to hide ; to push ; to look after | to hide ; to push ; to look after ; to study | — |
| g1u11.w.to-cook | To make food on the hot stove. | My dad likes to ___ pizza for dinner. | to watch TV ; to skate ; to play football | to watch TV ; to skate ; to play football ; to study | stove (= Herd) |
| g1u11.w.to-cook-2 | To make a hot dinner for the family to eat. | My mum likes to ___ a big dinner for the family. | to study ; to push ; to hide | to study ; to push ; to hide ; to hurry | — |
| g1u11.w.to-go-to-bed | To get in and sleep at night. | I always ___ at nine o'clock at night. | to go to school ; to wake somebody up ; to study | to go to school ; to wake somebody up ; to study ; to hurry | get (= gehen) |
| g1u11.w.to-go-to-school | To walk in the morning to your class and study. | Mary likes to ___ at a quarter to eight every day. | to go to bed ; to study ; to hurry | to go to bed ; to study ; to hurry ; to wake somebody up | every (= jede/r) ; walk (= gehen) |
| g1u11.w.to-hide | To go behind a tree or a bush so your friends can't find you. | Let's ___ behind the big tree in the park. | to push ; to study ; to cook | to push ; to study ; to cook ; to hurry | — |
| g1u11.w.to-hurry | To do something very fast. | We are late! Let's ___ to school. | to study ; to hide ; to cook | to study ; to hide ; to cook ; to push | fast (= schnell) ; late (= spät) ; something (= etwas) |
| g1u11.w.to-look-after | To give food and help to a pet or a child. | Can you ___ my dog for a week? I am away. | to push ; to hide ; to hurry | to push ; to hide ; to hurry ; to study | pet (= Haustier) ; help (= Hilfe) |
| g1u11.w.to-play-computer-games | To have fun on a screen in your free time. | My friend likes to ___ on his computer in the evening. | to play football ; to watch TV ; to skate | to play football ; to watch TV ; to skate ; to play the piano | screen (= Bildschirm) |
| g1u11.w.to-play-football | To kick a ball with your feet in a team game. | The boys like to ___ in the park after school. | to play the piano ; to watch TV ; to cook | to play the piano ; to watch TV ; to cook ; to play computer games | kick (= treten, schießen) ; ball (= Ball) ; team (= Mannschaft) |
| g1u11.w.to-play-the-piano | To make music on a big thing with white and black keys. | She can ___ very well. The music is great! | to play football ; to ride a bike ; to cook | to play football ; to ride a bike ; to cook ; to skate | black (= schwarz) ; keys (= Tasten) |
| g1u11.w.to-push | To move something away from you with your hands. | ___ the big door with both hands to open it. | to hide ; to cook ; to study | to hide ; to cook ; to study ; to hurry | move (= bewegen) ; hands (= Hände) ; something (= etwas) |
| g1u11.w.to-ride-a-bike | To go on a thing with two wheels that you push with your feet. | In my free time I like to ___ in the park. | to ride a horse ; to ride a scooter ; to skate | to ride a horse ; to ride a scooter ; to skate ; to skateboard | wheels (= Räder) |
| g1u11.w.to-ride-a-horse | To sit on a big farm animal and go on it. | My sister goes to the farm to ___ every Sunday. | to ride a bike ; to ride a scooter ; to ski | to ride a bike ; to ride a scooter ; to ski ; to skate | animal (= Tier) ; every (= jede/r) ; goes (= geht) ; sit (= sitzen) |
| g1u11.w.to-ride-a-scooter | To go on a thing with two small wheels, with one foot down. | She likes to ___ to the park on two small wheels. | to ride a bike ; to ride a horse ; to skateboard | to ride a bike ; to ride a horse ; to skateboard ; to skate | wheels (= Räder) |
| g1u11.w.to-skate | To go on the ice with special shoes on your feet. | When it is cold we go on the ice to ___ with our friends. | to ski ; to snowboard ; to skateboard | to ski ; to snowboard ; to skateboard ; to ride a bike | special (= besondere) ; ice (= Eis) |
| g1u11.w.to-skateboard | To go on a small board with four wheels under it. | Tim likes to ___ in the park with his friends. | to skate ; to ski ; to snowboard | to skate ; to ski ; to snowboard ; to ride a scooter | wheels (= Räder) |
| g1u11.w.to-ski | To go down the snow on two long boards on your feet. | When it snows, Mum and Dad like to ___ down the snow. | to snowboard ; to skate ; to skateboard | to snowboard ; to skate ; to skateboard ; to ride a bike | — |
| g1u11.w.to-snow | When soft white ice comes down from the sky. | Look! It is cold and it is ___. | to ski ; to skate ; to hide | to ski ; to skate ; to hide ; to push | soft (= weich) ; sky (= Himmel) ; comes (= kommt) ; ice (= Eis) |
| g1u11.w.to-snowboard | To go down the snow on one wide board, with both feet on it. | Jack likes to ___ down the snow on one big board. | to ski ; to skate ; to skateboard | to ski ; to skate ; to skateboard ; to ride a scooter | wide (= breit) |
| g1u11.w.to-study | To read a lot for a test at school. | I need to ___ for my big English test tomorrow. | to hurry ; to cook ; to hide | to hurry ; to cook ; to hide ; to push | test (= Test) ; lot (= viel) |
| g1u11.w.to-wake-somebody-up | To make a sleeping child or adult open their eyes. | Mum has to ___ in the morning because I sleep a lot. | to go to bed ; to go to school ; to study | to go to bed ; to go to school ; to study ; to hurry | lot (= viel) |
| g1u11.w.to-watch-tv | To look at programmes on the big screen at your place. | After dinner we like to ___ in the living room. | to play football ; to cook ; to study | to play football ; to cook ; to study ; to play computer games | screen (= Bildschirm) |
| g1u11.w.weather | If it is cold, nice, or it snows outside. | The ___ is nice today, so let's go to the park. | clock ; road ; programme | clock ; road ; programme ; surprise | — |
| g1u11.w.what-s-the-time | You ask this to find out how late it is. | ___ — It's half past nine now. | What time is it? ; Excuse me. ; Have fun! | What time is it? ; Excuse me. ; Have fun! ; See you soon. | late (= spät) |
| g1u11.w.what-time-is-it | You ask this to get the hour from a clock right now. | ___ I don't want to be late! | What's the time? ; Excuse me. ; Have fun! | What's the time? ; Excuse me. ; Have fun! ; See you soon. | get (= erfahren) ; late (= spät) |

## Grammar items (38)

| id | fmt | prompt | answers | distractors | pairs | groups | gloss |
|---|---|---|---|---|---|---|---|
| g1u11.gi.present-continuous.ag.001 | anagram | Die -ing-Form von 'cook': [de] | cooking (full) | — | — | — | — |
| g1u11.gi.present-continuous.ag.002 | anagram | Die -ing-Form von 'ride': [de] | riding (full) | — | — | — | — |
| g1u11.gi.present-continuous.ag.003 | anagram | Die kurze Form von 'is not': [de] | isn't (full) | — | — | — | — |
| g1u11.gi.present-continuous.cp.001 | context-picker | Deine Freunde sind gerade im Park. Welcher Satz ist richtig? [de] | They are playing football right now. (full) | They play football right now. ; They playing football right now. ; They are play football right now. | — | — | — |
| g1u11.gi.present-continuous.cp.002 | context-picker | Suzy sitzt im Wohnzimmer und spielt mit ihrem Handy. Welcher Satz passt? [de] | Suzy is playing with her phone. (full) | Suzy plays with her phone. ; Suzy playing with her phone. ; Suzy is play with her phone. | — | — | — |
| g1u11.gi.present-continuous.cp.003 | context-picker | Du riechst etwas Gutes aus der Küche. Du fragst nach deinem Papa. Welche Frage ist richtig? [de] | Is he cooking dinner? (full) | Does he cooking dinner? ; Is he cook dinner? ; He is cooking dinner? | — | — | — |
| g1u11.gi.present-continuous.ec.001 | error-correction | She playing football right now. [en] | She is playing football right now. (full) ; She's playing football right now. (partial) | — | — | — | — |
| g1u11.gi.present-continuous.ec.002 | error-correction | Do you playing computer games? [en] | Are you playing computer games? (full) | — | — | — | — |
| g1u11.gi.present-continuous.ec.003 | error-correction | She doesn't reading a book. [en] | She isn't reading a book. (full) ; She is not reading a book. (full) ; She's not reading a book. (partial) | — | — | — | — |
| g1u11.gi.present-continuous.ec.004 | error-correction | He are watching TV. [en] | He is watching TV. (full) ; He's watching TV. (partial) | — | — | — | — |
| g1u11.gi.present-continuous.gf.001 | gap-fill | Look! Dana ___ TV right now. [en, 1 blank(s)] | is watching (full) ; 's watching (partial) | — | — | — | — |
| g1u11.gi.present-continuous.gf.003 | gap-fill | They ___ football right now. [en, 1 blank(s)] | are playing (full) ; 're playing (partial) | — | — | — | — |
| g1u11.gi.present-continuous.gf.004 | gap-fill | He ___ his bike to school today. [en, 1 blank(s)] | is riding (full) ; 's riding (partial) | — | — | — | — |
| g1u11.gi.present-continuous.gf.005 | gap-fill | We ___ dinner now. We aren't eating pizza. [en, 1 blank(s)] | are cooking (full) ; 're cooking (partial) | — | — | — | — |
| g1u11.gi.present-continuous.gf.006 | gap-fill | She ___ to music right now. (not) [en, 1 blank(s)] | isn't listening (full) ; is not listening (full) ; 's not listening (partial) | — | — | — | — |
| g1u11.gi.present-continuous.gf.008 | gap-fill | It's very cold outside and it ___. (snow) [en, 1 blank(s)] | is snowing (full) ; 's snowing (partial) | — | — | — | — |
| g1u11.gi.present-continuous.gf.009 | gap-fill | What ___ you ___ right now? [en, 2 blank(s)] | are \| doing (full) | — | — | — | — |
| g1u11.gi.present-continuous.gf.010 | gap-fill | Jack ___ and Mum and Dad ___. (snowboard / ski) [en, 2 blank(s)] | is snowboarding \| are skiing (full) ; 's snowboarding \| are skiing (partial) | — | — | — | — |
| g1u11.gi.present-continuous.gf.011 | gap-fill | I ___ a book right now. [en, 1 blank(s)] | am reading (full) ; 'm reading (partial) | — | — | — | — |
| g1u11.gi.present-continuous.gf.013 | gap-fill | Peter ___ the piano right now. [en, 1 blank(s)] | is playing (full) ; 's playing (partial) | — | — | — | — |
| g1u11.gi.present-continuous.gs.001 | group-sort | Welche kurze Form von be passt? Sortiere die Sätze. [de] | — | — | — | is: She ___ cooking dinner., He ___ riding his bike., Dana ___ watching TV., Peter ___ playing football. \| are: They ___ playing the piano., We ___ cooking dinner., You ___ watching TV., Mum and Dad ___ skiing. | — |
| g1u11.gi.present-continuous.gs.002 | group-sort | Sortiere: sagt der Satz ja oder nein? [de] | — | — | — | Yes (+): She is watching TV., They are playing football., He is cooking dinner. \| No (–): She isn't watching TV., They aren't playing football., He isn't cooking dinner. | — |
| g1u11.gi.present-continuous.mc.001 | multiple-choice | Welcher Satz ist richtig? [de] | She is cooking an egg. (full) | She cooking an egg. ; She do cooking an egg. ; She cook an egg. | — | — | — |
| g1u11.gi.present-continuous.mc.002 | multiple-choice | Welche Frage ist richtig? [de] | Are you playing computer games? (full) | Do you playing computer games? ; You are playing computer games? ; Is you playing computer games? | — | — | — |
| g1u11.gi.present-continuous.mc.003 | multiple-choice | Welcher Satz ist richtig? [de] | They are riding their bikes. (full) | They riding their bikes. ; They is riding their bikes. ; They are rideing their bikes. | — | — | — |
| g1u11.gi.present-continuous.mc.004 | multiple-choice | Look! Dana ___ a book. [en, 1 blank(s)] | is reading (full) | reading ; are reading ; read | — | — | — |
| g1u11.gi.present-continuous.mp.002 | matching-pairs | Was passt zusammen? [de] | — | — | play ↔ playing ; ride ↔ riding ; cook ↔ cooking ; watch ↔ watching ; study ↔ studying ; skate ↔ skating | — | — |
| g1u11.gi.present-continuous.mt.001 | matching | Frage und passende Kurzantwort [de] | — | — | Are you playing a computer game? ↔ Yes, I am. ; Is Peter doing his homework? ↔ No, he isn't. ; Are Jennifer and Christine reading? ↔ Yes, they are. ; Is Dana watching TV? ↔ No, she isn't. | — | — |
| g1u11.gi.present-continuous.qf.001 | question-formation | She is reading a book. → Stell eine Ja/Nein-Frage. [de] | Is she reading a book? (full) ; Is she reading? (partial) | — | — | — | — |
| g1u11.gi.present-continuous.qf.002 | question-formation | Peter is doing his homework. → Stell eine Ja/Nein-Frage. [de] | Is Peter doing his homework? (full) ; Is Peter doing homework? (partial) | — | — | — | — |
| g1u11.gi.present-continuous.sb.001 | sentence-building | she / is / her / doing / homework [en] | She is doing her homework. (full) ; She's doing her homework. (partial) | — | — | — | — |
| g1u11.gi.present-continuous.sb.002 | sentence-building | they / are / football / playing [en] | They are playing football. (full) ; They're playing football. (partial) | — | — | — | — |
| g1u11.gi.present-continuous.sb.003 | sentence-building | you / are / a / playing / game / computer [en] | Are you playing a computer game? (full) | — | — | — | — |
| g1u11.gi.present-continuous.tf.001 | transformation | They are playing football. → Mach den Satz verneint: They ___ football. [de, 1 blank(s)] | aren't playing (full) ; are not playing (full) ; 're not playing (partial) | — | — | — | — |
| g1u11.gi.present-continuous.tf.002 | transformation | He is cooking dinner. → Mach eine Frage daraus: ___ he ___ dinner? [de, 2 blank(s)] | Is \| cooking (full) | — | — | — | — |
| g1u11.gi.present-continuous.tf.003 | transformation | She is watching TV. → Mach den Satz verneint: She ___ TV. [de, 1 blank(s)] | isn't watching (full) ; is not watching (full) ; 's not watching (partial) | — | — | — | — |
| g1u11.gi.present-continuous.tr.001 | translation | Sie spielt gerade Klavier. [de] | She is playing the piano. (full) ; She's playing the piano. (partial) | — | — | — | — |
| g1u11.gi.present-continuous.tr.002 | translation | Schläfst du gerade? – Nein. [de] | Are you sleeping? – No, I'm not. (full) ; Are you sleeping? No, I am not. (full) ; Are you sleeping? No, I'm not. (partial) | — | — | — | — |

## Output contract

Write `content/corpus/units/g1-u11/verify/level-gloss.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u11",
  "lens": "level-gloss",
  "itemsHash": "e2b0f58f9867",
  "promptHash": "aefb997bf664",
  "round": 2,
  "by": "fable-lens-level-gloss",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 96, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
