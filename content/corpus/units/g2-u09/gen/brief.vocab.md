# Vocab generation brief — g2-u09 (MORE! 2, Unit 9)

<!-- domigo:gen vocab g2-u09 bank=fd299da73d1b prompt=346902f9f0f1 -->

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
| g2u09.w.grapes | grapes | Trauben | wordfile | Food and Drink / Restaurant | — | — | grapes |
| g2u09.w.plums | plums | Pflaumen | wordfile | Food and Drink / Restaurant | — | — | plums |
| g2u09.w.pumpkin-pie | pumpkin pie | Kürbiskuchen | wordfile | Food and Drink / Restaurant | — | — | pumpkin pie |
| g2u09.w.rice-pudding | rice pudding | Milchreis | wordfile | Food and Drink / Restaurant | — | — | rice pudding |
| g2u09.w.chocolate-ice-cream | chocolate ice cream | Schokoladeneis | wordfile | Food and Drink / Restaurant | — | — | chocolate ice cream |
| g2u09.w.turkey | turkey | Truthahn | wordfile | Food and Drink / Restaurant | — | — | turkey |
| g2u09.w.ham | ham | Schinken | wordfile | Food and Drink / Restaurant | — | — | ham |
| g2u09.w.beef | beef | Rindfleisch | wordfile | Food and Drink / Restaurant | — | — | beef |
| g2u09.w.chicken | chicken | Huhn ; Hühnerfleisch | wordfile | Food and Drink / Restaurant | — | — | chicken |
| g2u09.w.apple-juice | apple juice | Apfelsaft | wordfile | Food and Drink / Restaurant | — | — | apple juice |
| g2u09.w.cheesecake | cheesecake | Käsekuchen | wordfile | Food and Drink / Restaurant | — | — | cheesecake |
| g2u09.w.pancakes | pancakes | Pfannkuchen | wordfile | Food and Drink / Restaurant | — | — | pancakes |
| g2u09.w.mineral-water | mineral water | Mineralwasser | wordfile | Food and Drink / Restaurant | — | — | mineral water |
| g2u09.w.tomato | tomato (pl tomatoes) | Tomate | wordfile | Food and Drink / Restaurant | — | — | tomato ; tomatoes |
| g2u09.w.cabbage | cabbage | Kohl | wordfile | Food and Drink / Restaurant | — | — | cabbage |
| g2u09.w.sausages | sausages | Würstchen | wordfile | Food and Drink / Restaurant | — | — | sausages |
| g2u09.w.lamb | lamb | Lamm ; Lammfleisch | wordfile | Food and Drink / Restaurant | — | — | lamb |
| g2u09.w.pears | pears | Birnen | wordfile | Food and Drink / Restaurant | — | — | pears |
| g2u09.w.peppers | peppers | Paprika | wordfile | Food and Drink / Restaurant | — | — | peppers |
| g2u09.w.onions | onions | Zwiebeln | wordfile | Food and Drink / Restaurant | — | — | onions |
| g2u09.w.olives | olives | Oliven | wordfile | Food and Drink / Restaurant | — | — | olives |
| g2u09.w.mushrooms | mushrooms | Pilze | wordfile | Food and Drink / Restaurant | — | — | mushrooms |
| g2u09.w.potato | potato (pl potatoes) | Kartoffel | wordfile | Food and Drink / Restaurant | — | — | potato ; potatoes |
| g2u09.w.peaches | peaches | Pfirsiche | wordfile | Food and Drink / Restaurant | — | — | peaches |
| g2u09.w.strawberries | strawberries | Erdbeeren | wordfile | Food and Drink / Restaurant | — | — | strawberries |
| g2u09.w.chef | chef | Koch/Köchin | wordfile | Food and Drink / Restaurant | — | — | chef |
| g2u09.w.recipe | recipe | Rezept | wordfile | Food and Drink / Restaurant | — | — | recipe |
| g2u09.w.waiter | waiter | Kellner | wordfile | Food and Drink / Restaurant | — | — | waiter |
| g2u09.w.cloche | cloche | Speiseglocke | wordfile | Food and Drink / Restaurant | — | — | cloche |
| g2u09.w.menu | menu | Speisekarte | wordfile | Food and Drink / Restaurant | — | — | menu |
| g2u09.w.slice | slice | Stück ; Scheibe | phrase | — | Can I have a slice of your pizza? | — | slice |
| g2u09.w.actor-actress | actor, actress | Schauspieler ; Schauspielerin | phrase | — | I want to be an actor, but I need the money. | — | actor, actress |
| g2u09.w.main-course | main course | Hauptgang ; Hauptspeise | phrase | — | Here comes the main course. | — | main course |
| g2u09.w.to-pour | to pour | einschenken ; schütten | phrase | — | Let me pour it for you. | pour | to pour ; pour |
| g2u09.w.soup | soup | Suppe | phrase | — | One tomato soup for you and the onion soup for your husband. | — | soup |
| g2u09.w.starter | starter | Vorspeise | phrase | — | The restaurant serves a delicious soup as a starter. | — | starter |
| g2u09.w.straightaway | straightaway | sofort | phrase | — | I'll bring the soup straightaway. | — | straightaway |
| g2u09.w.completely | completely | vollständig | phrase | — | The restaurant is completely dark. | — | completely |
| g2u09.w.crane | crane | Kran | phrase | — | A crane holds a large platform more than 50 m above the ground. | — | crane |
| g2u09.w.to-drop | to drop | fallen (lassen) | phrase | — | You shouldn't drop your phone on the ground. | drop | to drop ; drop |
| g2u09.w.to-entertain | to entertain | unterhalten | phrase | — | The robots dance to entertain the guests. | entertain | to entertain ; entertain |
| g2u09.w.glasses | glasses (pl) | Brille | phrase | — | The waiter wears special glasses so that he can see in the dark. | — | glasses |
| g2u09.w.platform | platform | Plattform | phrase | — | There's a restaurant on a platform in the sky. | — | platform |
| g2u09.w.to-serve | to serve | servieren | phrase | — | The waiters serve the food. | serve | to serve ; serve |
| g2u09.w.several | several | einige ; mehrere | phrase | — | There are several restaurants in my town. | — | several |
| g2u09.w.stew | stew | Eintopf | phrase | — | Can I have the cabbage stew, please? | — | stew |
| g2u09.w.fridge | fridge | Kühlschrank | phrase | — | There's nothing in the fridge. Let's go to the supermarket. | — | fridge |
| g2u09.w.to-complain | to complain | sich beschweren | phrase | — | They complain about their food. | complain | to complain ; complain |
| g2u09.w.consumer | consumer | Konsument/Konsumentin | phrase | — | A consumer is someone who buys something. | — | consumer |
| g2u09.w.delivery | delivery | Lieferung | phrase | — | I'm waiting for my pizza delivery. | — | delivery |
| g2u09.w.to-download | to download | herunterladen | phrase | — | I downloaded the new Dua Lipa album. | download | to download ; download |
| g2u09.w.refund | refund | Rückerstattung | phrase | — | My phone stopped working. I want a refund. | — | refund |
| g2u09.w.certain | certain | sicher ; gewiss | phrase | — | Are you certain? | — | certain |
| g2u09.w.to-change-one-s-mind | to change one's mind | seine Meinung ändern | phrase | — | I changed my mind. I want pizza after all. | change one's mind | to change one's mind ; change one's mind |
| g2u09.w.gym | gym | Turnhalle ; Fitnesscenter | phrase | — | Leo goes to the gym. | — | gym |
| g2u09.w.to-miss | to miss | verpassen | phrase | — | Hurry up, I don't want to miss the bus. | miss | to miss ; miss |

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
- **g2-u04**: mosquito, pigeon, parrot, ostrich, chimpanzee, antelope, bat, giraffe, rhino, cheetah, anaconda, crocodile, dolphin, whale, shark, (two days) ago, farmer, human, incredible, dangerous, hairy, heavy, strong, climate change, fast, female, male, nobody, scientist, to die out, less, to carry, centimetre, desert, to die, mammal, ton, venomous, to weigh, length, speed, intelligent, reason, to share, luck, powerful, smart, truck, forever, to protect
- **g2-u05**: cinema, church, bank, restaurant, railway station, chemist's, tourist office, music shop, post office, supermarket, hospital, police station, to go past, to go straight ahead, to cross the street, to turn left, to take the second right, round the corner, as far as, opposite, next to, to cross, map, second, to go straight on, airport, to change trains, most of the time, pocket, slow, somewhere, underground, market square, simply, comment, to comment, feedback, guest, to offer, opening, positive, review, the worst, to bother, bus stop, fountain, to interrupt, politely, traffic lights
- **g2-u06**: sun, sea, beach, town, motorway, road, river, village, field, hill, valley, lake, forest, mountains, stars, moon, to build a tree house, camp, life jacket, guide, campfire, picnic, canoe, canoeing, waterfall, rock climbing, bottom, left-hand, middle, right-hand, anorak, hard hat, absolutely, actually, adventure camp, to be afraid (of), although, to care, drive, gate, to be good at sth., once upon a time, sheep (pl sheep), shepherd, to trust, while, to wash up, alive, cry, I'm off now., Poor you!
- **g2-u07**: to do nothing, to play basketball, to stay at a friend's house, to tidy your room, to have a party, to do the shopping, to do your homework, to watch a film, honestly, instead, to take it easy, to be ashamed, to come over, communication, excuse, group chat, social media, to tell a lie, truth, to be worried, to crash, to get into trouble, fancy dress party, disappointment, German, row, sold out, That's a pity., ticket, What a shame!
- **g2-u08**: spaceship, commander, spacesuit, alien, UFO, space centre, planet, boss, cable, capital, to connect, hero, heroine, machine, to repair, space, statue, to take over, traveller, visitor, key, crew, aeroplane, expert, hoax, investigation, photograph, to destroy, to kidnap, nonsense, comfortable, Calm down!, in that case
- **g2-u09**: grapes, plums, pumpkin pie, rice pudding, chocolate ice cream, turkey, ham, beef, chicken, apple juice, cheesecake, pancakes, mineral water, tomato (pl tomatoes), cabbage, sausages, lamb, pears, peppers, onions, olives, mushrooms, potato (pl potatoes), peaches, strawberries, chef, recipe, waiter, cloche, menu, slice, actor, actress, main course, to pour, soup, starter, straightaway, completely, crane, to drop, to entertain, glasses (pl), platform, to serve, several, stew, fridge, to complain, consumer, delivery, to download, refund, certain, to change one's mind, gym, to miss

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alan, Alison, Alphabet, Alps, America, Amherst, Anderson, Andrew, Andy, Anger, Annie, Arbeit, Archie, Arconia, Arconians, Arousing, Articles, Australia, Austria, Bacon, Baker, Befehlsformen, Beitrag, Belea, Ben, Benson, Bert, Betty, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Bob, Bolt, Bond, Box, Bridge, Brown, Buckingham, Buddy, Burgers, Cairn, California, Cambridge, Came, Canongate, Caribbean, Carina, Carl, Carla, Carlton, Castle, Centre, Chamber, Changing, Chester, Chichen, China, Chito, Chloe, Christie, Christine, Clare, Clark, Classroom, Clothes, Clown, Coldeye, Come, Complimenting, Control, Croatia, Dad, Dan, Dana, Daniel, Danielle, Darkman, Darren, Dave, David, Davis, Debbie, Despereaux, Dialog, Dialoge, Diana, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Dragon, Dua, Earthlings, Edinburgh, Edwina, Elisabeth, Ellie, Emergency, Emily, Emma, Encouraging, England, English, European, Every, Excuse, Expressing, False, Faye, Fido, Food, France, Frank, Fred, Freddy, George, Georgia, German, Gillian, Gina, Good, Gordon, Grace, Great, Green, Grey, Greybeard, Groans, Guess, Halloween, Hammond, Harris, Harry, Help, Henry, High, Hill, Hmm, Holmes, Homework, Hook, Hotel, Hungary, Hunt, Hutton, Imagine, Imperatives, Inc, Infinitiv, Interviewer, Ireland, Irish, Irregular, Italian, Itza, Jack, Jacob, James, Jamie, Jane, Janet, Jay, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jill, Jimmy, Joe, John, Jolly, Jones, Julia, Jun, Jupiter, Just, Justyna, Kate, Katy, Ken, Kinds, Kitty, Kukulkan, Lane, Lara, Laura, Lauriston, Leah, Lena, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Lily, Linking, Lipa, Lisa, London, Lord, Lucas, Lucy, Luigi, Luna, Mail, Manchester, Mandy, Manju, Manson, Maple, Mario, Mark, Marple, Mars, Mary, Matt, Mayan, Mei, Mexico, Mia, Michael, Mickey, Mike, Mill, Miriam, Miss, Moira, Mr, Mrs, Mum, Natasha, Nathan, Nelson, New, Newtown, Nibbs, Nice, Nick, Nicolson, Nina, Nomen, North, Number, Numbers, Oak, Object, Objekte, Odeon, Oliver, Olivia, Omar, Order, Ordering, Ordinal, Palace, Pardon, Paris, Parsons, Past, Paul, Paula, Paws, People, Pete, Peter, Pets, Philosopher, Phoenix, Pirates, Plans, Plural, Plurals, Pluto, Polly, Possessives, Potter, Prepositions, Present, Priestly, Project, Put, Radu, Rajit, Ranjit, Rashmi, Really, Red, Reihenfolge, Richard, Ricky, Robert, Rome, Ron, Ronald, Rose, Rosey, Rosie, Sally, Sam, Samuel, Sandra, Sara, Sarah, Saying, School, Scotland, Scott, Sean, Sherlock, Sicily, Silben, Smith, Sophia, Sophie, South, Square, States, Station, Steve, Sue, Sunborn, Suzy, Tale, Tamar, Tamara, Tammy, Targon, Tell, Telling, Text, Think, Tick, Tim, Toby, Tock, Tom, Tony, Trafalgar, Trent, Trents, Tricia, Trick, Troin, True, Turan, Uhr, Um, United, Vasile, Vicky, Vienna, Walker, Wall, Waterloo, Watson, Welcome, Well, White, William, Wise, Work, Wortes, Would, Wow, Wu, Yeah, York, Zahlen, Ziel, Zimmer, Zoe

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## v1 seeds (UNTRUSTED — mine for ideas, never copy unverified)

Known v1 defect classes: invented above-level carrier words, out-of-bank MC distractors, over-strict answers.

- `g2u09.w.grapes` ← v1 `grapes`: d="Small round fruit that grows in groups, purple or green" · s="I had some _____ with my lunch. They were very sweet." · a=[] · mc=["cherries","olives","plums"]
- `g2u09.w.plums` ← v1 `plums`: d="Soft round fruit that is purple on the outside" · s="We picked small purple _____ with a stone inside from the tree in our garden." · a=["plum"] · mc=["lemons","bananas","strawberries"]
- `g2u09.w.pumpkin-pie` ← v1 `pumpkin pie`: d="A sweet dish made from an orange vegetable, often eaten in autumn" · s="My grandma makes the best _____ every October." · a=["pumpkin pie","pumpkin pies"] · mc=["apple pie","cheesecake","chocolate cake"]
- `g2u09.w.rice-pudding` ← v1 `rice pudding`: d="A soft sweet dish made from white grains cooked in milk" · s="We had _____ for dessert and it was warm and creamy." · a=["rice pudding"] · mc=["porridge","pancakes","custard"]
- `g2u09.w.chocolate-ice-cream` ← v1 `chocolate ice cream`: d="A cold sweet treat with a brown, sweet flavour" · s="I always choose _____ when we go to the ice cream shop." · a=["chocolate ice cream"] · mc=["vanilla ice cream","strawberry ice cream","lemon sorbet"]
- `g2u09.w.turkey` ← v1 `turkey`: d="A big bird that people eat at special dinners" · s="In America, many families eat _____ at Thanksgiving." · a=["turkeys"] · mc=["chicken","duck","goose"]
- `g2u09.w.ham` ← v1 `ham`: d="Meat from a pig, often eaten in sandwiches" · s="I want a _____ and cheese sandwich, please." · a=[] · mc=["bacon","beef","sausage"]
- `g2u09.w.beef` ← v1 `beef`: d="Meat from a cow" · s="We had _____ steak with vegetables for dinner yesterday. It came from a cow." · a=[] · mc=["fish","cheese","rice"]
- `g2u09.w.chicken` ← v1 `chicken`: d="A bird that gives eggs, or the meat from that bird" · s="Mum is making _____ soup with carrots and noodles for lunch. It's my favourite when I'm sick." · a=["chickens"] · mc=["bread","salad","ice cream"]
- `g2u09.w.apple-juice` ← v1 `apple juice`: d="A drink made from the sweet fruit that grows on trees" · s="Can I have a glass of _____ please? I love the taste of apples." · a=["apple juice"] · mc=["orange juice","lemonade","mineral water"]
- `g2u09.w.cheesecake` ← v1 `cheesecake`: d="A sweet cake made with a soft white cream on top" · s="The _____ at this cafe is really delicious. It is a sweet cake made with soft white cream." · a=["cheesecakes"] · mc=["pancakes","chocolate cake","pumpkin pie"]
- `g2u09.w.pancakes` ← v1 `pancakes`: d="Flat round food made from eggs and flour, cooked in a pan" · s="We had _____ with jam for breakfast this morning." · a=["pancake"] · mc=["waffles","toast","cereal"]
- `g2u09.w.mineral-water` ← v1 `mineral water`: d="Water with tiny bubbles that you can buy in a bottle" · s="I would like a bottle of _____ please. Just water with bubbles, nothing sweet." · a=["mineral water"] · mc=["lemonade","apple juice","orange juice"]
- `g2u09.w.tomato` ← v1 `tomato (pl tomatoes)`: d="A red fruit you put in salads and on pizza" · s="Can you cut the red, round _____ into slices for the salad?" · a=["tomato","tomatoes"] · mc=["pepper","onion","cucumber"]
- `g2u09.w.cabbage` ← v1 `cabbage`: d="A big round green vegetable with many leaves" · s="We grew big green _____ with thick round leaves in our garden last year." · a=["cabbages"] · mc=["lettuce","spinach","broccoli"]
- `g2u09.w.sausages` ← v1 `sausages`: d="Meat shaped like a long tube, often grilled or fried" · s="We had _____ and mashed potatoes for dinner." · a=["sausage"] · mc=["ham","bacon","meatballs"]
- `g2u09.w.lamb` ← v1 `lamb`: d="A young woolly farm animal, or the meat from it" · s="We had roasted _____ from a baby sheep with potatoes and vegetables for Sunday dinner." · a=["lambs"] · mc=["fish","cheese","rice"]
- `g2u09.w.pears` ← v1 `pears`: d="Green or yellow fruit shaped like a bell" · s="These _____ are really juicy and sweet, with a narrow top and wide bottom." · a=["pear"] · mc=["apples","peaches","plums"]
- `g2u09.w.peppers` ← v1 `peppers`: d="Vegetables that can be red, green, or yellow" · s="I like red and green _____ on my pizza — they are crunchy and a little sweet." · a=["pepper"] · mc=["bananas","apples","grapes"]
- `g2u09.w.onions` ← v1 `onions`: d="Round white or brown vegetables that make your eyes water" · s="Mum is cutting _____ and her eyes are full of tears." · a=["onion"] · mc=["garlic","peppers","mushrooms"]
- `g2u09.w.olives` ← v1 `olives`: d="Small green or black fruit often used in salads or on pizza" · s="Do you want black _____ on your pizza? They are small, round and salty." · a=["olive"] · mc=["cookies","bananas","cakes"]
- `g2u09.w.mushrooms` ← v1 `mushrooms`: d="Small things that grow in forests and some you can eat" · s="I found some _____ in the garden but we did not eat them." · a=["mushroom"] · mc=["onions","peppers","beans"]
- `g2u09.w.potato` ← v1 `potato (pl potatoes)`: d="A round brown vegetable that grows under the ground" · s="We had baked _____ with butter for dinner." · a=["potato","potatoes"] · mc=["carrot","onion","turnip"]
- `g2u09.w.peaches` ← v1 `peaches`: d="Soft round fruit with a fuzzy skin, orange inside" · s="The orange-coloured _____ from the market were sweet, juicy, and had a big stone inside." · a=["peach"] · mc=["lemons","bananas","strawberries"]
- `g2u09.w.strawberries` ← v1 `strawberries`: d="Small red fruit that grows close to the ground" · s="We picked _____ at the farm and made jam from them." · a=["strawberry"] · mc=["raspberries","blueberries","cherries"]
- `g2u09.w.chef` ← v1 `chef`: d="A person who cooks food in a place where you eat out" · s="The head _____ at the Italian restaurant made a wonderful pasta dish in the kitchen." · a=["chefs"] · mc=["customer","owner","cleaner"]
- `g2u09.w.recipe` ← v1 `recipe`: d="A list of steps that tells you how to cook something" · s="I found a great _____ for chocolate cake online with a list of ingredients and step-by-step instructions." · a=["recipes"] · mc=["song","film","book"]
- `g2u09.w.waiter` ← v1 `waiter`: d="A person who brings food and drinks to your table" · s="The _____ in the black uniform brought us the menu and some water at our table." · a=["waiters","waitress","waitresses"] · mc=["chef","customer","manager"]
- `g2u09.w.cloche` ← v1 `cloche`: d="A metal cover over a plate that keeps the food warm" · s="The _____ covered the plate until the guest was ready to eat." · a=["cloches"] · mc=["lid","plate","tray"]
- `g2u09.w.menu` ← v1 `menu`: d="A list of food and drinks you can order in a place to eat" · s="Let me look at the restaurant _____ and choose something to eat from the list of dishes." · a=["menus"] · mc=["clock","window","door"]
- `g2u09.w.slice` ← v1 `slice`: d="A thin piece cut from something bigger" · s="Can I have another thin _____ of bread, please? Just cut one more piece." · a=["slices"] · mc=["bag","loaf","crumb"]
- `g2u09.w.actor-actress` ← v1 `actor, actress`: d="A person who acts in films or on stage" · s="My favourite _____ is in a new film this summer." · a=["actor","actress","actors","actresses"] · mc=["singer","dancer","director"]
- `g2u09.w.main-course` ← v1 `main course`: d="The biggest and most important dish of a meal" · s="For the _____ I had fish with vegetables." · a=["main course","main courses"] · mc=["starter","dessert","side dish"]
- `g2u09.w.to-pour` ← v1 `to pour`: d="To make a liquid flow out of a bottle or jug" · s="Can you _____ some water carefully into my glass? Don't spill it." · a=["pour","pours","poured"] · mc=["to drink","to boil","to freeze"]
- `g2u09.w.soup` ← v1 `soup`: d="A warm liquid food made from vegetables or meat" · s="On cold winter days I love to eat a bowl of hot tomato _____ with a spoon." · a=["soups"] · mc=["bread","cheese","salad"]
- `g2u09.w.starter` ← v1 `starter`: d="A small dish you eat before the big dish" · s="We had garlic bread as a _____ before the pasta." · a=["starters"] · mc=["main course","dessert","snack"]
- `g2u09.w.straightaway` ← v1 `straightaway`: d="Right now, without waiting" · s="I will bring your drinks _____. I am going to the kitchen right now." · a=["straight away"] · mc=["tomorrow","next week","never"]
- `g2u09.w.completely` ← v1 `completely`: d="Totally, with nothing missing" · s="The glass was _____ empty. There was not a single drop of water left." · a=[] · mc=["half","loudly","quickly"]
- `g2u09.w.crane` ← v1 `crane`: d="A very tall machine that lifts heavy things at a building site" · s="We watched the big _____ lift steel beams onto the new building." · a=["cranes"] · mc=["forklift","truck","bulldozer"]
- `g2u09.w.to-drop` ← v1 `to drop`: d="To let something fall from your hand" · s="Be careful! Hold it tight — don't _____ the plate on the floor." · a=["drop","drops","dropped"] · mc=["to wash","to eat","to buy"]
- `g2u09.w.to-entertain` ← v1 `to entertain`: d="To do something fun so people enjoy themselves" · s="The clown _____ the children at the birthday party by doing tricks and telling jokes." · a=["entertain","entertains","entertained"] · mc=["to scare","to bore","to upset"]
- `g2u09.w.glasses` ← v1 `glasses (pl)`: d="Two small pieces of glass you wear in front of your eyes to see better" · s="I need my _____ to read the board at school." · a=[] · mc=["sunglasses","contact lenses","goggles"]
- `g2u09.w.platform` ← v1 `platform`: d="A flat raised area where you can stand or build on" · s="The band played on a small _____ in the park." · a=["platforms"] · mc=["stage","balcony","terrace"]
- `g2u09.w.to-serve` ← v1 `to serve`: d="To bring food or drinks to someone at a table" · s="The waiter _____ us our food with a big smile." · a=["serve","serves","served"] · mc=["to pour","to cook","to order"]
- `g2u09.w.several` ← v1 `several`: d="More than two but not very many" · s="I don't have one or two but _____ friends in my new class." · a=[] · mc=["many","few","no"]
- `g2u09.w.stew` ← v1 `stew`: d="A hot dish made by cooking meat and vegetables together slowly" · s="Grandma's _____ is the best thing to eat on a cold winter day." · a=["stews"] · mc=["soup","roast","casserole"]
- `g2u09.w.to-complain` ← v1 `to complain`: d="To say you are not happy about something" · s="The man _____ to the waiter because his food was cold and wanted a new meal." · a=["complain","complains","complained"] · mc=["to thank","to praise","to smile"]
- `g2u09.w.consumer` ← v1 `consumer`: d="A person who buys things in a shop or online" · s="When you buy something from a shop and pay money for it, you are a _____." · a=["consumers"] · mc=["seller","owner","worker"]
- `g2u09.w.delivery` ← v1 `delivery`: d="When someone brings something you ordered to your door" · s="The pizza _____ from the takeaway came to my house in only twenty minutes." · a=["deliveries"] · mc=["menu","recipe","bill"]
- `g2u09.w.to-download` ← v1 `to download`: d="To get a file, song, or app from the internet onto your device" · s="I _____ a new game on my tablet yesterday." · a=["download","downloads","downloaded"] · mc=["to upload","to install","to save"]
- `g2u09.w.refund` ← v1 `refund`: d="Money you get back when you return something you bought" · s="The shop gave me a _____ because the shoes were too small." · a=["refunds"] · mc=["receipt","discount","payment"]
- `g2u09.w.certain` ← v1 `certain`: d="Very sure about something" · s="I am _____ that tomorrow is a holiday — I checked the calendar twice." · a=[] · mc=["not sure","confused","wondering"]
- `g2u09.w.to-change-one-s-mind` ← v1 `to change one's mind`: d="To think something different from before" · s="I wanted pizza but I _____ and chose pasta." · a=["change my mind","changed my mind","changes his mind","change your mind"] · mc=["to make up one's mind","to agree","to decide"]
- `g2u09.w.gym` ← v1 `gym`: d="A room or building where people do sport or exercise" · s="We play volleyball in the school _____ on Fridays. It has a wooden floor and a high ceiling." · a=["gyms"] · mc=["library","cafeteria","office"]
- `g2u09.w.to-miss` ← v1 `to miss`: d="To be too late and not catch a bus, train, or event" · s="Run faster or you will _____ the school bus!" · a=["miss","misses","missed"] · mc=["to catch","to be late","to forget"]

## Unit transcripts (textbook sentences live here — use them first)

```
----- SB: More 2 SB Unit 9.txt -----
Unit 9 – Eating out
Page 68–69
At the end of unit 9 …
you know
19 food words
how to use some and any
how to use one and ones
you can
order food in a restaurant
talk about food
understand a sketch
understand a menu in a restaurant
understand a simple recipe
write a short text message
write a story about a restaurant trip
VOCABULARY – Food
1 Listen and look at the pictures. Then write the numbers next to the words.
[List of food items with checkboxes for each:]
☐ pears
 ☐ beef
 ☐ chicken
 ☐ plums
 ☐ lamb
 ☐ rice pudding
 ☐ pumpkin pie
 ☐ peppers
 ☐ onions
 ☐ tomatoes
 ☐ (chocolate) ice cream
 ☐ cabbage
 ☐ cheesecake
 ☐ strawberries
 ☐ turkey
 ☐ pancakes
 ☐ peaches
 ☐ grapes
 ☐ potatoes
Image description (center image):
 A visual collage of 19 food items, each clearly numbered 1–19. Items include:
 1 – brown bread slices
 2 – cabbage
 3 – grapes (purple)
 4 – tomatoes
 5 – peaches
 6 – green grapes
 7 – cheesecake
 8 – turkey leg
 9 – red pepper
 10 – chocolate cake
 11 – pancakes
 12 – potatoes
 13 – onions
 14 – pears
 15 – strawberries
 16 – rice pudding
 17 – pumpkin pie
 18 – chocolate ice cream
 19 – plums
2 Write the food words from 1 in the table below.
fruit	vegetables	meat	desserts
			

LISTENING – Talking about food
3 Listen and write the names of the people under the shopping baskets.
Options:
 Henry
 Ella
 Jacob
 Laura
Image description:
 Four shopping baskets:
 1 – includes bread, cheese, sausages, grapes
 2 – includes bananas, oranges, chocolate
 3 – includes fish, milk, apples
 4 – includes salad, tomatoes, pineapple, grapes
Write the names under:
 1 _______________
 2 _______________
 3 _______________
 4 _______________
READING & SPEAKING – Ordering food in a restaurant
4 Write the words next to the pictures.
Word bank:
 sausages
 cheese
 ham
 mushrooms
 olives
Image grid of 5 food items:
 1 _______________
 2 _______________
 3 _______________
 4 _______________
 5 _______________
5 Read the dialogue. Then write the names under the pizzas.
Dialogue:
Waiter:
 Are you ready to order?
Mr Hutton:
 Yes, we are.
Mrs Hutton:
 I’d like a pizza with ham, cheese and tomatoes.
Waiter:
 And to drink?
Mrs Hutton:
 Mineral water, please.
Mr Hutton:
 I’d like a pizza too – with ham, mushrooms and green peppers. And an orange juice, please.
Ben:
 For me a pizza with ham, sausage and cheese.
Waiter:
 And to drink?
Ben:
 A cola, please.
Vicky:
 And for me a pizza with mushrooms, tomatoes and sausages.
Waiter:
 And to drink?
Vicky:
 An apple juice, please.
Image description (bottom of dialogue):
 Five pizzas labeled 1 to 5:
 1 – green peppers, mushrooms, ham
 2 – ham, cheese, tomatoes
 3 – ham, sausage, cheese
 4 – mushrooms, tomatoes, sausages
 5 – plain pizza (undecorated, possibly unused)
Write names:
 1 _______________
 2 _______________
 3 _______________
 4 _______________
6 Listen to the dialogue and act it out.
Pages 70–71
TIME FOR A SKETCH – The worst waiter
7 Read and listen to the sketch. Tick the food the man and woman order from the menu.
MENU (image content):
STARTERS
 Onion soup
 Tomato soup
MAIN COURSES
 Lamb chops with potatoes and cabbage
 Chicken with rice and peas
 Beef with chips and carrots
 Turkey with potatoes and cabbage
 Vegetable curry
 Fish of the day
DESSERTS
 Pancakes
 Cheesecake
 Rice pudding
 Pumpkin pie
 Chocolate ice cream
Scene 1
 Waiter: Good evening. My name’s Tom and I’m your waiter for the evening.
 Woman: Hello, Tom. I’m Lara and this is my husband Dan. Tom, could we get the menu soon? We’re very hungry.
 Waiter: Certainly. Can I get you any drinks?
 Man: Could we have some water, please?
 Woman: And have you got any sparkling apple juice?
 Waiter: Yes, we have. Water, apple juice and the menu coming straightaway.
Scene 2
 Waiter: Here you are. A menu.
 Woman: Thank you.
 Waiter: Let me open the apple juice.
He opens the apple juice with a loud ‘bang’, the juice pours out.
Man: Oh dear. The juice is going everywhere.
 Waiter: I’m sorry. Let me pour it for you.
 Woman: Thank you, Tom. But those are the glasses for the water. These are the ones for the apple juice.
 Waiter: My mistake. I’m sorry. I’ll get some new glasses for you.
Scene 3
 Waiter: Are you ready to order?
 Woman: Onion soup for starters, please.
 Man: And tomato soup for me.
 Woman: And the lamb chops for the main course and cheesecake for dessert.
 Man: And for me, the beef and then pancakes.
 Waiter: I’m sorry. We haven’t got any pancakes left.
 Man: OK, how about the pumpkin pie?
 Waiter: Good choice.
He walks away backwards and into a chair behind him.
 Waiter: Ouch!
 Woman: Careful, Tom.
Scene 4
 Waiter: Here you are. The tomato soup for you and the onion soup for your husband.
 Man: Smells delicious.
 Woman: There’s just one problem, Tom.
 Waiter: What is it?
 Woman: My soup is the onion. The tomato is for my husband.
 Waiter: I’m so sorry.
Scene 5
 Waiter: Here come the main courses. Beef for you, sir.
 Man: That’s right.
 Waiter: And the lamb for you.
 Woman: That’s right. Well done, Tom.
As he puts the plate down for the woman, a potato rolls off onto the table.
 Waiter: Whoops.
 Woman: No problem.
The potato rolls onto the woman’s legs.
 Waiter: I’m so sorry.
 Woman: Don’t worry, Tom. I’ve got it.
Scene 6
 Waiter: Here are your desserts.
He puts the plates down.
 Waiter: Don’t say anything. I’ve got it wrong again.
 Woman: You certainly have, Tom.
Scene 7
 Waiter: I hope you enjoyed your meal and sorry again for all the accidents.
 Man: Don’t worry about it. The meal was fine and the accidents were funny.
 Waiter: I’m not really a very good waiter. I want to be an actor*, but I need the money.
 Woman: An actor? Well this might just be your lucky day.
 Waiter: Why?
 Woman: Because I make films and I think you might be perfect for the one we’re going to make soon.
 Waiter: A film? Really?
 Woman: Yes, really. Come and see me tomorrow at 9 a.m. Here’s my card with the address.
 Waiter: I’ll be there.
 Woman: Oh and Tom.
 Tom: What?
 Woman: I hope you’re a better actor than you are a waiter.
VOCABULARY: actor = Schauspieler
8 How many of these tasks can you do?
The waiter’s name is ___________________________.
The man wants some ____________________________.
The waiter pours the apple juice in the ____________________________ glasses.
The man and woman both order soup for starters. T / F
Tom walks into a table when he leaves. T / F
Tom gives the onion soup to the woman. T / F
What goes wrong when the waiter gives the woman her main course?
What goes wrong when the waiter gives them their dessert?
Why is it Tom’s lucky day?
Pages 72–73
READING & WRITING
9 Read and match the restaurants and the pictures.
The world’s most wonderful restaurants
1 Hajime Robot Restaurant in Thailand
 In this restaurant robots do everything. They take you to your table and serve you food. In the kitchen, robot chefs cook the food, and after dinner the robots dance to entertain the guests. There are a few humans too, just to make sure nothing goes wrong.
2 Opaque in Los Angeles
 In the Opaque no one can see what they are eating because the restaurant is completely dark. Many of their customers believe that food tastes better when you can’t see what you are eating. The waiters wear special glasses so they can serve the customers.
3 The restaurant in the sky
 This is an idea that you can find in several cities in Europe and the USA. A crane holds a large platform more than 50 m above the ground. There is room for 22 guests, two waiters and a chef. Just don’t look down.
4 Ithaa Underwater Restaurant in the Maldives
 In this restaurant you can eat your food while fish swim all around you. The restaurant is nearly 5 m underwater in the middle of the Indian Ocean. The glass walls mean you can see wonderful sea creatures while you enjoy some of the best food from the sea.
10 Read these text messages.
 Which restaurants are these people at?
A – “I dropped my phone. I can’t find it.”
 B – “I think I just saw a shark!”
 C – “The waiter doesn’t understand anything I say. It’s crazy.”
 D – “I can see my house from here.”
11 Imagine you are at one of these restaurants. Write a short text message to one of your friends.
A SONG 4 U
12 Listen and sing.
 My dream
Last night I dreamed of chicken,
 of rice and cabbage stew.
 Last night I dreamed of pancakes,
 and then I dreamed of you.
You served me cakes.
 You served me grapes.
 You served me pumpkin pie.
 You said to me,
 you said to me,
 you said to me: Please try.
Last night I dreamed of strawberries,
 of grapes both green and blue.
 Last night I dreamed of ice cream,
 and then I dreamed of you.
You served me cakes …
 I tried and tried. I tried and tried.
 I felt like a balloon.
 Then I woke up. You said to me:
 Come on, it’s breakfast soon! (x2)
WRITING
13 CHOICES
Read these two stories about a visit to a pizza place. Underline the differences in the second text. Which text is more interesting to read, and why is it better?
1
 Last Sunday, my Dad and I went to a restaurant. We had tomato soup and a pizza. Suddenly, Dad stopped eating. There was something under the cheese. It was a coin*. Dad called the waiter. The waiter was very sorry and Dad got another pizza.
2
 Last Sunday, my Dad and I went to a restaurant. We had tomato soup and a pizza. Suddenly, Dad stopped eating.
 “What’s the matter?” I asked. “I don’t know,” Dad said. “There’s something under the cheese.” “Yes,” I said, “your pizza.” “Very funny,” Dad said. Then he lifted the cheese. There was a coin under it! Dad called the waiter. “I’m so sorry,” the waiter said. Dad got another pizza.
VOCABULARY: coin = Münze
A Look at the picture. Write a story about it (50–60 words).
 Use these words and phrases to help you.
On Saturday, Mrs Green went to a ... with her ...
 Mrs Green had ..., Sue had ... and James had ...
 Suddenly, Sue said, “Don’t eat your ..., Mum! There’s a ...”
 Mum called the ... She ...
B Look at the picture. Write a story about it (80–100 words).
 Use dialogue to make it more interesting.
Pages 74–75
14 Complete the sentences with some or any. Then listen and check.
Dad: Sue, are there 1 _______ plums and peaches in the fridge?
 Sue: There are 2 _______ plums, but there aren’t 3 _______ peaches. Are you making fruit salad?
 Dad: Yes. What have we got?
 Sue: There are 4 _______ grapes and 5 _______ pears.
 Dad: OK. Are there 6 _______ strawberries?
 Sue: No, sorry, Dad. There aren’t 7 _______.
GRAMMAR
some – any
💬 I’ll get some new glasses for you.
 → Du verwendest in diesem Satz some, weil nicht angegeben wird, wie viele Gläser gebracht werden.
💬 Could we have some water, please?
 → In diesem Satz sagst du some, weil von etwas gesprochen wird, das man nicht zählen kann (Wasser).
💬 We haven’t got any pancakes left.
 → Hier verwendest du any, weil du ausdrücken willst, dass etwas nicht vorhanden ist.
💬 Have you got any sparkling apple juice?
 → In diesem Satz sagst du any, weil du wissen möchtest, ob noch etwas vorhanden/übrig ist.
Read the questions. Write some or any.
Have we got any beef?
 Can I have some ice cream?
Mit 1 _______ fragst du nach etwas, von dem du weißt, dass es vorhanden ist.
 Mit 2 _______ fragst du, ob etwas vorhanden ist.
one – ones
Wenn du über gleiche Dinge sprichst, aber das Nomen nicht immer wiederholen möchtest, dann kannst du das Nomen durch one oder ones ersetzen.
💬 Those are the glasses for the water. These are the ones for the apple juice.
 💬 I’d like the pizza with mushrooms, and for my friend the one with ham on it.
💬 Which one would you like?
Complete with one or ones.
Du verwendest 1 _______, wenn du ein Nomen im Singular nicht wiederholen willst.
 Du verwendest 2 _______, wenn du ein Nomen im Plural nicht wiederholen willst.
🔄 Now go back to page 68. Check ✅ with a partner what you know / can do.
OUR YOUNG WORLD 3
Jamie’s terrible restaurant trip
🎥 1 Watch the video. What did Jamie order for dessert?
🎥 2 Watch again and answer the questions.
Why did Jamie’s family go to the restaurant? _______________________
What kind of restaurant did they go to? __________________________
What does Jamie’s mum always do in restaurants? _________________
What did Jamie’s mum order for dessert? ________________________
What was wrong with Jamie’s dessert? __________________________
What did the waiter do when Jamie complained? __________________
FIND OUT: Consumer rights*
3 Match the words and the definitions.
consumer
refund
to complain
a. to say when something is wrong
 b. to get your money back when something is not right
 c. someone who buys something
VOCABULARY: consumer rights = Verbraucherrechte
Our consumer world
4 In pairs, read the texts. Can these people complain? What should they do?
💬 “I downloaded the new Dua Lipa album. It’s terrible. I want my money back.”
 💬 “My game console controller just stopped working after a week.”
 💬 “The hotel brochure said ‘five minutes from the Eiffel Tower.’ It took me more than an hour to walk there.”
 💬 “I bought a new T-shirt. I’ve only worn it three times but I don’t think I really like the colour.”
CYBER PROJECT: A sketch on video
5 In pairs, choose one of these situations and write a sketch. Create a short video and present it to the class.
Your new mobile phone doesn’t work any more.
You bought a computer game, but there was no disc inside.
Your pizza delivery is all wrong.
Pages 76–77
THE TWINS 4
The pizza 🎥
Developing speaking competencies
 Language function: ☑ I can order food (Essen bestellen)
 Speaking strategy: ☑ I can change my mind (seine Meinung ändern)
VOCABULARY — Pizza toppings
1 Match the food and the pictures. Listen and check.
pepperoni | mushroom | tomato | cheese | pineapple | ham
1 ____
 2 ____
 3 ____
 4 ____
 5 ____
 6 ____
(Images show slices of ham, mushrooms, pepperoni, tomatoes, pineapple, and cheese in order.)
2 Watch or listen to the dialogue. Then read it. What toppings from 1 do the family choose on their pizzas?
Assistant: Hello, can I take your order?
 Dad: Pizzas for everyone?
 Leo: Yes, I’d like the ham and pineapple pizza.
 Lucy: Can I have a cheese and tomato one?
 Mum: And I’ll have a pepperoni one.
 Dad: So that’s one ham and pineapple, one cheese and tomato … two pepperoni. Hang on. Er … Make that one pepperoni and two cheese and tomato.
 Assistant: What would you like to drink?
 Dad: Four cokes, please. No, wait a second. Make that three cokes and a bottle of water.
 Assistant: Eat in or take away?
 Dad: Eat in.
 Assistant: OK, that’s £24, please. If you’d like to take a seat, your food will be ready in ten minutes. Your order is 21.
 Dad: Thanks.
(Photo: The family of four is standing outside a pizza restaurant called "Napoli." They are holding a large pizza box.)
3 Complete the waiter’s order.
Order number: _______
PIZZAS
 1 × __________
 1 × __________
 2 × __________
DRINKS
 3 × __________
 1 × __________
Total £: _______
USEFUL PHRASES — Ordering food
4 Read the sentences. Write C (Customer) or A (Assistant).
Can I take your order? □
I’d like a ham and pineapple pizza. □
Can I have a cheese and tomato one? □
Eat in or take away? □
❓ What do you think? Answer the questions.
Does everyone get what they ordered?
📱 MOBILE HOMEWORK
Watch part 2 of the video and circle T (True) or F (False).
Mum falls in the pond. T / F
Dad misses the bus. T / F
Leo is scared on the London Eye. T / F
Dad wants his pizza in six slices. T / F
SPEAKING STRATEGY — Changing your mind
5 Complete. Then check with the dialogue in 2.
Dad: So that’s one ham and pineapple, one cheese and tomato … two pepperoni.
 ‘H ________ O ________.
 Er … Make that one pepperoni and two cheese and tomato.’
Assistant: What would you like to drink?
 Dad: Four cokes, please. No,
 ‘W ________ a S ________.
 Make that three cokes and a bottle of water.’
6️⃣ CHOICES
A Work in pairs. Use the prompts.
 🅰️ Order a pizza.
 🅱️ Repeat the order.
 🔁 Change your mind.
Example:
 A: Can I have a pepperoni pizza, please?
 B: A pepperoni pizza.
 A: Hang on. I’d like a ham one.
B
ROLE PLAY:
 Work in fours.
Student A, B, and C: You are customers in a pizza restaurant. Order pizzas and drinks.
Student D:
 ▪ Take the other students’ order.
 ▪ Ask if it’s eat in or take away.


----- WB: More 2 WB Unit 9.txt -----
UNIT 9 – Eating out
Page 70–71
UNDERSTANDING VOCABULARY — Food
1 Look at the pictures and write the correct food words.
(Left column: word bank)
pears
 beef
 chicken
 plums
 lamb
 rice pudding
 pumpkin pie
 peppers
 onions
 tomatoes
 ice cream
 cabbage
 cheesecake
 strawberries
 turkey
 pancakes
 peaches
 grapes
 potatoes
(Images are numbered and connected to blank lines.)
(Images include various food items such as beef steak, cheesecake, tomatoes, pancakes, chicken drumstick, onions, potatoes, lamb, pumpkin pie, rice pudding, pears, strawberries, grapes, turkey, etc.)
USING VOCABULARY — Food
2 Do the crossword.
(Visual: A crossword puzzle with food-related images numbered for “Down” and “Across.”)
Down ↓
(Image: lettuce)
(Image: strawberries)
(Image: onion)
(Image: pancakes)
(Image: cheesecake)
(Image: tomato)
Across →
 3. (Image: grapes)
 4. (Image: plum)
 5. (Image: beef steak)
 7. (Image: turkey)
 11. (Image: potatoes)
 13. (Image: rice pudding)
 14. (Image: chicken drumstick)
3 Read the menu and write the names of the pizzas under the pictures.
(Menu card on the left side lists pizza ingredients by name)
Pisa
 peas, onions, green peppers, cheese
Turin
 egg, broccoli, onions, red peppers, cheese
Rome
 sausage, tomatoes, onions, broccoli, cheese
Naples
 egg, tomatoes, broccoli, peas, green peppers, cheese
Florence
 tomatoes, cheese
Milan
 sausage, peas, tomatoes, cheese
(Four pizza illustrations labeled 1–4)
Page 72–73
UNDERSTANDING GRAMMAR – some – any
4 Circle the correct option.
They haven’t got some / any children.
Can I have some / any ice cream, please?
There are some / any books on my desk.
She hasn’t got some / any friends.
I’ve got some / any money. Here you are.
I don’t want some / any soup, thanks.
5 Match the questions and answers.
Would you like some orange juice?
Do you want some chocolate?
Can you give me some money?
Have you got any children?
Does your head hurt?
Is there any ice cream in the freezer?
a. □ No, but I’m going to buy some at the supermarket.
 b. □ Yes. Have you got any aspirin?
 c. □ Yes. Two sons and a daughter.
 d. □ Yes, please. I’m very thirsty.
 e. □ I’m sorry. I haven’t got any.
 f. □ No, thanks. I don’t like sweets.
USING GRAMMAR – some – any
6 Look at the picture and complete the sentences. Use some or any.
(Image: A fruit bowl with apples, grapes, plums, strawberries, and no visible oranges or peaches)
In the fruit bowl ...
 ________ there are some __________ apples.
 ________________________________ grapes.
 ________________________________ plums.
 ________________________________ strawberries.
 ________________________________ oranges.
 ________________________________ peaches.
7 Complete the dialogue with some or any.
Dad: Have 1 _____________________ fruit for dessert.
 Jenny: I don’t want 2 _____________________ fruit. Haven’t we got 3 _____________________ ice cream?
 Dad: Yes, there’s 4 _____________________ ice cream in the freezer, but ...
 Jenny: Well, can I have 5 _____________________ ?
 Dad: No, you can’t. You can have 6 _____________________ fruit.
 Jenny: But I don’t like fruit.
 Dad: Don’t be silly. Here, have 7 _____________________ strawberries.
 Jenny: Can I have _____________________
 strawberry ice cream?
 Dad: No!
(Image: Jenny and her dad sitting at the table with a bowl of fruit)
8 Look in the fridge for thirty seconds and remember as much as you can. Then cover the picture and write sentences.
(Image: Fridge with pears, cheesecake, chocolate, grapes, turkey, tomatoes, onions. No strawberries.)
pears
 There are some pears.
strawberries
 There aren’t any strawberries.
onions
grapes
peppers
tomatoes
cabbage
lamb
chicken
chocolate
cheesecake
cheese
UNDERSTANDING GRAMMAR – one – ones
9 Circle the correct options.
A Which cake do you want?
  B I’d like that one / ones, please.
A Do you like Italian restaurants?
  B Yes, but only the good one / ones.
A Can you give me three of those apples, please?
  B Which one / ones?
   A The red one / ones.
A I’ve got a chicken sandwich and a cheese sandwich. Which one / ones do you want?
  B I’d like the cheese one / ones, please.
(Images:
A person pointing to cakes in a bakery
A couple talking in a restaurant
A shopper at a fruit stand
A person holding a tray with two sandwiches)
Page 74–75
USING GRAMMAR – one – ones
10 Complete the sentences with one or ones.
A Which pizza is yours?
  B The large ________________________.
A Do you like my new cups?
  B They’re not bad, but I like the old ________________________ better.
A Did you see my food photos?
  B Yes, I saw the ________________________ you posted on Sunday.
A My mixer doesn’t work very well!
  B Why don’t you buy a new ________________________?
A Which are your favourite glasses?
  B The blue ________________________.
A Which ice cream do you like?
  B The ________________________ with chocolate in it.
11 Write mini-dialogues for the pictures using one or ones. Use the example to help you.
1
 A I’d like to buy two chocolate bars.
 B Certainly – which ones? The lemon or the caramel ones?
 A Just the caramel ones, please.
(Image: A customer and a vendor at a candy stand)
2
 A Let’s go to the park.
 B ________________________________
 A ________________________________
(Image: Two children with backpacks and jackets getting ready)
3
 A Should we buy some bananas?
 B ________________________________
 A ________________________________
(Image: Two children shopping at a fruit stand)
4
 A Can I have some water, please?
 B ________________________________
 A ________________________________
(Image: Two students in a school setting, one holding a sandwich and the other a drink)
READING & WRITING – Ordering food in a restaurant / Understanding a recipe
12 Remember the sketch The worst waiter on pages 70–71 of the Student’s Book. Put the summary in the correct order.
Choices (unordered text fragments):
course. But when he serves Lara, a potato
good waiter. First, he pours the apple juice
filmmaker and says she might have a job for him. It’s a lucky
rolls off the plate and onto her leg. He gets the desserts
Lara and her husband Dan are at a restaurant. Their waiter
wrong again and serves Dan the cheesecake. Tom tells them
gets it wrong and serves Lara the soup her
day for the worst waiter
he’s not really a waiter but wants to be an actor. Lara is a
into the wrong glass. When he brings the soup, he
is Tom. He isn’t a very
husband ordered. He gets it right serving the main
CHOICES
13 A Put the dialogue in the correct order.
□ Waiter OK. No onions. Would you like olives maybe?
 □ Waiter Are you ready to order?
 □ Waiter Thank you. I’ll bring the water straightaway.
 □ Waiter OK. The Rome pizza, no onions, and a mineral water.
 □ Waiter OK – no olives and no onions. And what would you like to drink?
 □ Customer No, thanks. I don’t like olives.
 □ Customer That’s right.
 □ Customer Yes. I’d like the Rome pizza, please. But I don’t want any onions.
 □ Customer Water, please. A bottle of mineral water.
13 B Write the waiter’s questions to complete the dialogue.
Waiter 1 __________________________________________
 Customer Yes. I’d like the Milan pizza, please. But I don’t want any peas.
 Waiter 2 __________________________________________
 Customer No, thanks. I don’t like peppers.
 Waiter OK – no peppers. 3 ____________________________
 Customer A cola, please.
 Waiter One cola, coming straightaway. 4 ____________________________
 Customer Not now, but I might order an ice cream later.
 Waiter No problem.
14 Write a dialogue between a waiter and a customer. Use the menu on p. 71 in your Workbook.
The customer wants:
• an orange juice
 • the Turin pizza, but with no egg
 • some chocolate cake
Page 76–77
15 Read the recipe and number the ingredients in the order they are used.
CHICKEN & PEA CURRY
Ingredients
 • peas
 • chicken
 • oil
 • coriander
 • garlic
 • onion
 • chicken broth
 • curry powder
 • coconut milk
 • ginger
Step-by-step
Heat* some oil and then put garlic, onions and ginger into a pan*. Stir*.
Then put the chicken pieces into the pan. Stir for a few minutes.
Next, add the curry powder. Stir again for a minute.
Now add the chicken broth and the coconut milk. Let it cook for 10 minutes.
Finally, add the peas and stir.
Heat for a few more minutes and then the curry is ready. Sprinkle* coriander on it.
Serve it hot with bread or rice.
VOCABULARY: heat = erhitzen; pan = Pfanne; stir = umrühren; sprinkle = darüberstreuen
LISTENING & DIALOGUE WORK
Ordering food in a restaurant / Changing your mind
16 Listen to the dialogue and answer the questions.
How is the woman trying to get the waiter’s attention?
  ......................................................................................................................
Is the waiter very busy?
  ......................................................................................................................
What does the man want first?
  ......................................................................................................................
What does the man want to eat?
  ......................................................................................................................
What does the woman want to eat?
  ......................................................................................................................
Why can’t she have what she wants?
  ......................................................................................................................
What does she order next?
  ......................................................................................................................
17 Work in groups of three. One of you is the waiter, the other two are the guests. Use the menu on p. 70 of your Student’s Book or the pizza menu on p. 71 in your Workbook to make up a dialogue in a restaurant. Then perform the conversation in class.
decide what type of restaurant it is
decide what you want
decide if anything goes wrong and what it is
18 Put the dialogue in the correct order. Then listen and check.
THE TWINS
□ Man And would you like anything to drink?
 □ Man Good evening. Can I take your order?
 □ Man A cheese and tomato pizza?
 □ Man An orange juice. And is that eat in or take away?
 □ Man OK. That’s £12, please.
 □ Benjamin Hang on. No, I think I’ll have a ham and mushroom one.
 □ Benjamin Take away, please.
 □ Benjamin An apple juice, please.
 □ Benjamin Yes, I’d like a cheese and tomato pizza, please.
 □ Benjamin No, wait a second. I’ll have an orange juice.
 □ Benjamin Here you are.
WORD FILE
Food and drink
(Image of a colorful market stand with food items labeled)
Labeled items (clockwise from top left):
grapes
plums
pumpkin pie
rice pudding
chocolate ice cream
turkey
ham
beef
chicken
apple juice
cheesecake
pancakes
mineral water
tomato (pl tomatoes)
cabbage
sausages
lamb
pears
peppers
onions
olives
mushrooms
potato (pl potatoes)
peaches
strawberries
(Also pictured: three cats and two dogs roaming the market scene)
Page 78
In a restaurant
(Top of the page: Illustration of a restaurant.
 A chef is behind a window holding a recipe.
 A waiter is carrying a cloche (covered serving dish).
 At the table:
 A woman is pointing to order. A man is looking at the menu.)
MORE Words and Phrases
	Word / Phrase	Example sentence	German Translation
	slice	Can I have a slice of your pizza?	Stück; Scheibe
	actor, actress	I want to be an actor, but I need the money.	Schauspieler, Schauspielerin
	main course	Here comes the main course.	Hauptgang, Hauptspeise
	to pour	Let me pour it for you.	einschenken, schütten
	soup	One tomato soup for you and the onion soup for your husband.	Suppe
	starter	The restaurant serves a delicious soup as a starter.	Vorspeise
	straightaway	I’ll bring the soup straightaway.	sofort
	completely	The restaurant is completely dark.	vollständig
	crane	A crane holds a large platform more than 50 m above the ground.	Kran
	to drop	You shouldn’t drop your phone on the ground.	fallen (lassen)
	to entertain	The robots dance to entertain the guests.	unterhalten
	glasses (pl)	The waiter wears special glasses so that he can see in the dark.	Brille
	platform	There’s a restaurant on a platform in the sky.	Plattform
	to serve	The waiters serve the food.	servieren
	several	There are several restaurants in my town.	einige, mehrere
	stew	Can I have the cabbage stew, please?	Eintopf
	fridge	There’s nothing in the fridge. Let’s go to the supermarket.	Kühlschrank
	to complain	They complain about their food.	sich beschweren
	consumer	A consumer is someone who buys something.	Konsument/Konsumentin
	delivery	I’m waiting for my pizza delivery.	Lieferung
	to download	I downloaded the new Dua Lipa album.	herunterladen
	refund	My phone stopped working. I want a refund.	Rückerstattung
	certain	Are you certain?	sicher, gewiss
	to change one’s mind	I changed my mind. I want pizza after all.	seine Meinung ändern
	gym	Leo goes to the gym.	Turnhalle; Fitnesscenter
	to miss	Hurry up, I don’t want to miss the bus.	hier: verpassen

```

## Output contract

Write `content/corpus/units/g2-u09/gen/vocab.draft.json`:

```jsonc
{
  "schema": "vocab-draft@1",
  "slug": "g2-u09",
  "briefBank": "fd299da73d1b",
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
