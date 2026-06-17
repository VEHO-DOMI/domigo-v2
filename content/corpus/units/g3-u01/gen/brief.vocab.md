# Vocab generation brief — g3-u01 (MORE! 3, Unit 1)

<!-- domigo:gen vocab g3-u01 bank=97dbe14fb08d prompt=346902f9f0f1 -->

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
| g3u01.w.to-give-sth-a-try | to give sth. a try | etw. versuchen | wordfile | Audition | — | give sth. a try | to give sth. a try ; give sth. a try |
| g3u01.w.to-give-up | to give up | aufgeben | wordfile | Audition | — | give up | to give up ; give up |
| g3u01.w.audition | audition | Vorsprechen ; Vorsingen | wordfile | Audition | — | — | audition |
| g3u01.w.to-have-got-what-it-takes | to have got what it takes | das Zeug dazu haben | wordfile | Audition | — | have got what it takes | to have got what it takes ; have got what it takes |
| g3u01.w.to-make-it | to make it | es schaffen | wordfile | Audition | — | make it | to make it ; make it |
| g3u01.w.to-be-on-the-way-up | to be on the way up | auf dem Weg nach oben sein | wordfile | Audition | — | be on the way up | to be on the way up ; be on the way up |
| g3u01.w.to-get-back-to-sb | to get back to sb. | sich bei jdm. melden | wordfile | Audition | — | get back to sb. | to get back to sb. ; get back to sb. |
| g3u01.w.to-agree | to agree | zustimmen | phrase | — | I couldn't agree more. | agree | to agree ; agree |
| g3u01.w.to-belong-to | to belong to | gehören | phrase | — | It probably belonged to my great-grandparents. | belong to | to belong to ; belong to |
| g3u01.w.to-celebrate | to celebrate | feiern | phrase | — | To celebrate music, I thought I'd share with you my favourite musical facts. | celebrate | to celebrate ; celebrate |
| g3u01.w.extremely | extremely | extrem | phrase | — | He was also extremely talented. | — | extremely |
| g3u01.w.flute | flute | Flöte | phrase | — | The oldest musical instrument is the flute. | — | flute |
| g3u01.w.singer | singer | Sänger/Sängerin | phrase | — | You can choose from 17 million singers and bands on Spotify. | — | singer |
| g3u01.w.successful | successful | erfolgreich | phrase | — | The song was so successful that they even built a statue. | — | successful |
| g3u01.w.talented | talented | talentiert ; begabt | phrase | — | She was very talented. | — | talented |
| g3u01.w.to-spill | to spill | verschütten | phrase | — | I hope she didn't spill any coffee on it! | spill | to spill ; spill |
| g3u01.w.whole | whole | ganze/r/s | phrase | — | Your driver will drive you behind your favourite star for the whole day. | — | whole |
| g3u01.w.critic | critic | Kritiker/Kritikerin | phrase | — | Paul Sacks and Sally Green are critics on Superstar. | — | critic |
| g3u01.w.brave | brave | mutig | phrase | — | You're a brave man. | — | brave |
| g3u01.w.not-even | not even | noch nicht einmal | phrase | — | In fact, you're not even going to be a background singer. | — | not even |
| g3u01.w.suit | suit | Anzug | phrase | — | Sing at home when you're not wearing that suit. | — | suit |
| g3u01.w.unhappy | unhappy | unglücklich | phrase | — | Don't be too unhappy. | — | unhappy |
| g3u01.w.to-waste | to waste | verschwenden | phrase | — | Don't waste our time. | waste | to waste ; waste |
| g3u01.w.to-feel | to feel | sich fühlen | phrase | — | I feel bad about it. | feel | to feel ; feel |
| g3u01.w.to-get-tired-of-sth | to get tired of sth. | etw. satt haben | phrase | — | I never get tired of listening to music. | get tired of sth. | to get tired of sth. ; get tired of sth. |
| g3u01.w.lyrics | lyrics | Liedtext | phrase | — | The lyrics in a song should be meaningful. | — | lyrics |
| g3u01.w.to-make-up | to make up | erfinden ; sich ausdenken | phrase | — | I make up special dance moves for my fans. | make up | to make up ; make up |
| g3u01.w.record | record | (Schall-)Platte | phrase | — | I buy a record every week. | — | record |
| g3u01.w.to-seem | to seem | wirken ; scheinen | phrase | — | She doesn't seem to get on well. | seem | to seem ; seem |
| g3u01.w.to-sing-along | to sing along | mitsingen | phrase | — | I always sing along to the songs I like. | sing along | to sing along ; sing along |
| g3u01.w.tune | tune | Melodie | phrase | — | I like songs with a good tune. | — | tune |
| g3u01.w.i-can-t-stand-it | I can't stand it. | Ich kann es nicht ausstehen. | phrase | — | I can't stand it. | — | I can't stand it. |
| g3u01.w.i-don-t-mind | I don't mind (it). | Ich habe nichts dagegen. | phrase | — | I don't mind it. | — | I don't mind . ; I don't mind . it |
| g3u01.w.to-come-along | to come along | mitkommen | phrase | — | James wanted to come along. | come along | to come along ; come along |
| g3u01.w.to-take-place | to take place | stattfinden | phrase | — | Where did the concert take place? | take place | to take place ; take place |
| g3u01.w.afterwards | afterwards | danach ; anschließend | phrase | — | We'll go to the cinema and afterwards to the restaurant. | — | afterwards |
| g3u01.w.apart-from | apart from | abgesehen von | phrase | — | Apart from his bad taste in music, my dad's cool. | — | apart from |
| g3u01.w.in-my-opinion | in my opinion | meiner Meinung nach | phrase | — | In my opinion, it's the best they've done. | — | in my opinion |
| g3u01.w.to-be-interested-in | to be interested in | an etw. interessiert sein | phrase | — | He seems to be interested in her music. | be interested in | to be interested in ; be interested in |
| g3u01.w.me-neither | Me neither. | Ich auch nicht. | phrase | — | Me neither. | — | Me neither. |

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
- **g2-u10**: auntie, calm, girlfriend, to be proud of, sense of humour, ugly, virus, to breathe, to burn, foreign language, to panic, tractor, tool, divorced, to be related to, to delete, file, to print out, public, ice skating, fault, hopefully
- **g2-u11**: wardrobe, bed, bedside table, carpet, fridge, cooker, curtain, sink, cupboard, table, chair, sofa, armchair, lamp, radiator, rug, roof, wall, window, staircase, cellar, trailer (American English), tree house, stilts, reed, island, ground, ours, theirs, mine, hers, his, yours, furniture, whose, American, cellar, Central Asia, electricity, to float, moveable, underneath, to transport, hammock, cotton, leather, material, metal, pattern, plain, plastic, pond, seat, spotted, strap, striped
- **g2-u12**: headache, toothache, earache, stomach ache, pain in ankle, knee, backache, throat, bath, medicine, memory, patient, spoon, blood, lamp post, cure, to cure, dentist, to mash, to mix, taste, toothpaste, worm, smell, first aid, helpful, horrible, pupil, since, Believe me!, to injure, It doesn't matter., writer
- **g2-u13**: snowy, thunderstorm, cloudy, windy, rainy, sunny, foggy, hot, cold, weather presenter / meteorologist, coast, to continue, cool, degree, dry, formula, to give way, scale, sunshine, temperature, to clear up, fog, forecast, hope, outlook, small talk, thick, towards, Have a nice day!, to make sure, to rise, axe, bright, flash of light, to shine, average, below, generally, inch (pl inches), mild, mile, rainfall, to record, sea level, throughout the year, western, wet, heavy rain, tan, binoculars, career, to earn, to be mad about sth.
- **g2-u14**: roller-skating, sportsman and sportswoman, ice skating, snowboarding, skiing, surfing, mountain climbing, windsurfing, swimming, mountain biking, cycling, skateboarding, to grow up, member, professional, race, serious, to appear, competition, challenge, distance, extreme, flood, to manage, official, rather, to snorkel, to take part (in), without, world record, nil, on one's own, to score, to tackle, waste of time, equipment, success
- **g2-u15**: to feed your pet, to clean out the litter tray, to clean out your pet's cage, to play with your pet, to dry your pet, to stroke, to brush, to walk your pet, to take your pet to the vet, to give your pet a bath, cage, litter tray, vet (veterinarian), to have got a fear of, to keep sb. company, Neither do I., So do I., space, Antarctic Ocean, emperor penguin, to release, sand, pyjamas, to tidy (up)
- **g3-u01**: to give sth. a try, to give up, audition, to have got what it takes, to make it, to be on the way up, to get back to sb., to agree, to belong to, to celebrate, extremely, flute, singer, successful, talented, to spill, whole, critic, brave, not even, suit, unhappy, to waste, to feel, to get tired of sth., lyrics, to make up, record, to seem, to sing along, tune, I can't stand it., I don't mind (it)., to come along, to take place, afterwards, apart from, in my opinion, to be interested in, Me neither.

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adrian, Adverbs, Ahmed, Alan, Albu, Alice, Alison, Alphabet, Alps, Amazon, America, Americans, Amherst, Ancient, Anderson, Andrew, Andy, Anger, Animal, Annette, Annie, Antarctic, Anthony, Anti, Arbeit, Archie, Arconia, Arconians, Arousing, Articles, Aryan, Asia, Aussage, Australia, Austria, Austrians, Bacon, Baker, Balcony, Beatles, Befehlsformen, Beitrag, Belea, Bella, Ben, Benson, Bert, Betty, Beyonc, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Blues, Bob, Bolt, Bond, Bottlemen, Box, Bradley, Bridge, Brown, Buckingham, Buddy, Burgers, Butterfly, Cairn, California, Cambridge, Came, Canongate, Caribbean, Carina, Carl, Carla, Carlton, Carol, Carolyn, Carter, Castle, Catfish, Celsius, Central, Centre, Chamber, Changing, Chester, Chichen, China, Chito, Chloe, Chris, Christie, Christine, Chuck, Claire, Clare, Clark, Classroom, Clothes, Clown, Coach, Coldeye, Coldplay, Column, Come, Complimenting, Control, Costa, Croatia, Dad, Dan, Dana, Daniel, Danielle, Danny, Darkman, Darren, Dave, David, Davis, Death, Debbie, Denver, Despereaux, Dialog, Dialoge, Diana, Diego, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Dragon, Dragons, Dua, Earthlings, East, Eddie, Edinburgh, Edwina, Egypt, Elisabeth, Ellie, Emergency, Emily, Emma, Encouraging, Ende, England, English, Eric, Europe, European, Every, Excuse, Expressing, Fab, Fahrenheit, False, Faye, Feeling, Fido, Fluff, Food, France, Frank, Fred, Freddy, Gangnam, Gegenwart, George, Georgia, German, Gillian, Gina, Good, Gordon, Grace, Grape, Great, Green, Grey, Greybeard, Groans, Groats, Guess, Hadfield, Halloween, Hamilton, Hammond, Hanna, Hannah, Harris, Harrison, Harry, Hayes, Helen, Help, Henry, High, Hill, Hmm, Hollywood, Holmes, Home, Homes, Homework, Hook, Hoople, Hotel, Hull, Humor, Hungary, Hunt, Hutton, Imagine, Imperatives, Inc, Infinitiv, Interviewer, Ireland, Irish, Irregular, Italian, Itza, Jack, Jacob, James, Jamie, Jane, Janet, Jasmine, Jay, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jill, Jimmy, Jo, Joanna, Joe, John, Johnny, Jolly, Jonathan, Jones, Josh, Julia, Jun, Jupiter, Just, Justyna, Kate, Katie, Katy, Ken, Kerr, Kinds, Kitty, Korea, Kukulkan, Lane, Lara, Laura, Laurie, Lauriston, Leah, Leicester, Leila, Lemons, Lena, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Lily, Linking, Lipa, Lisa, Liszt, London, Lord, Lucas, Lucy, Luigi, Lulu, Luna, Madonna, Mail, Malverns, Manchester, Mandy, Manju, Manson, Maple, Mario, Mark, Marple, Mars, Mary, Matt, Mayan, Megan, Mei, Mexico, Mia, Michael, Mickey, Mike, Mill, Miriam, Miss, Moira, Mongolian, Monica, Mott, Mountain, Mr, Mrs, Ms, Mum, Musical, Natasha, Nathan, Neither, Nelson, New, Newtown, Nibbs, Nice, Nick, Nico, Nicolson, Nina, Nomen, Norman, North, Number, Numbers, Oak, Object, Objekte, Ocean, Odeon, Ola, Oliver, Olivia, Olympic, Omar, Order, Ordering, Ordinal, Palace, Pardon, Paris, Parsons, Past, Patti, Paul, Paula, Paws, People, Pete, Peter, Pets, Philosopher, Phoenix, Pirates, Plans, Plural, Plurals, Pluto, Polly, Pop, Possessives, Potter, Prepositions, Present, Priestly, Professor, Project, Put, Radu, Rain, Rajit, Ranjit, Rashmi, Really, Red, Reihenfolge, Rica, Richard, Richmond, Rick, Ricky, Ride, Ringo, Robert, Rome, Ron, Ronald, Rose, Rosey, Rosie, Sacks, Sally, Salma, Salzburg, Sam, Samuel, San, Sanderson, Sandra, Sara, Sarah, Saying, School, Scotland, Scott, Sean, Seathwaite, Seatoller, Seoul, Sessions, Shannon, Shelter, Sherlock, Sicily, Silben, Smith, Sophia, Sophie, Sound, South, Spallanzani, Spotify, Spotless, Square, States, Station, Steve, Stoke, Stradivarius, Style, Sue, Sunborn, Superstar, Susan, Suzy, Swaton, Sweet, Tag, Tale, Tamar, Tamara, Tammy, Targon, Tell, Telling, Text, Think, Tick, Tim, Toby, Tock, Tom, Tony, Trafalgar, Trapp, Trapps, Trent, Trents, Tricia, Trick, Troin, True, Turan, Uhr, Um, United, Uros, Vasile, Vicky, Vienna, Volleyball, Walker, Wall, Waterloo, Watson, Way, Welcome, Well, White, William, Willow, Wise, Work, Wortes, Would, Wow, Wu, Yeah, York, Zahlen, Zealand, Ziel, Zimmer, Zoe

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## v1 seeds (UNTRUSTED — mine for ideas, never copy unverified)

Known v1 defect classes: invented above-level carrier words, out-of-bank MC distractors, over-strict answers.

- `g3u01.w.to-give-sth-a-try` ← v1 `to give sth. a try`: d="To do something to see if you like it or can do it" · s="I've never played tennis before, but I want to _____ it at the tennis club this Saturday morning." · a=["give it a try","give sth. a try","give something a try"] · mc=["to give sth. up","to put sth. off","to throw sth. away"]
- `g3u01.w.to-give-up` ← v1 `to give up`: d="To stop trying to do something" · s="Learning the guitar is hard, but please don't _____. Keep practising every day and you will improve." · a=["give up","gave up","given up"] · mc=["to keep going","to try again","to succeed"]
- `g3u01.w.audition` ← v1 `audition`: d="A short performance to show you can sing, act or dance" · s="She sang a pop song at her _____ for the school musical." · a=["auditions"] · mc=["rehearsal","performance","concert"]
- `g3u01.w.to-have-got-what-it-takes` ← v1 `to have got what it takes`: d="To have the skills or talent that you need" · s="You are a great dancer and full of talent — you've _____ what it takes to win the competition!" · a=["have got what it takes","have what it takes"] · mc=["to have given up","to have lost hope","to have made mistakes"]
- `g3u01.w.to-make-it` ← v1 `to make it`: d="To succeed or to be able to come" · s="Sorry, I can't _____ it to your birthday party — I have an important dentist appointment at the same time." · a=["make it","made it"] · mc=["to enjoy it","to avoid it","to plan it"]
- `g3u01.w.to-be-on-the-way-up` ← v1 `to be on the way up`: d="To become more and more successful" · s="The young rock band is _____. They play bigger concerts every month and their songs are becoming popular." · a=["be on the way up","on the way up"] · mc=["to be on the way out","to be on the way down","to be at the bottom"]
- `g3u01.w.to-get-back-to-sb` ← v1 `to get back to sb.`: d="To answer or contact someone later" · s="I'm busy right now, but I'll _____ back to you with an answer after lunch at 2 o'clock." · a=["get back to","got back to"] · mc=["to ignore sb.","to forget about sb.","to run away from sb."]
- `g3u01.w.to-agree` ← v1 `to agree`: d="To have the same idea or opinion as someone else" · s="I _____ with you completely — chocolate ice cream really is the best flavour of all ice cream in the world." · a=["agree","agreed"] · mc=["to disagree","to argue","to refuse"]
- `g3u01.w.to-belong-to` ← v1 `to belong to`: d="To be the property of someone" · s="This blue jacket isn't mine — it _____ to my older brother Tom, so I have to give it back to him later." · a=["belong to","belongs to","belonged to"] · mc=["to match","to suit","to compare"]
- `g3u01.w.to-celebrate` ← v1 `to celebrate`: d="To do something special for a happy event" · s="On New Year's Eve, people _____ with colourful fireworks, dancing, and parties at midnight when the new year begins." · a=["celebrate","celebrated"] · mc=["to watch","to plan","to remember"]
- `g3u01.w.extremely` ← v1 `extremely`: d="Very, very much" · s="The water in the swimming pool was _____ cold — much colder than I expected and my lips turned blue!" · a=[] · mc=["slightly","a bit","a little"]
- `g3u01.w.flute` ← v1 `flute`: d="A musical instrument that you blow across" · s="She plays the _____ in the school orchestra — a long thin silver instrument you blow into." · a=["flutes"] · mc=["piano","violin","guitar"]
- `g3u01.w.singer` ← v1 `singer`: d="A person who sings, often as a job" · s="My favourite _____ has a new album out this week with ten new songs that she wrote and recorded." · a=["singers"] · mc=["guitarist","drummer","songwriter"]
- `g3u01.w.successful` ← v1 `successful`: d="Having done well or achieved what you wanted" · s="The school play was very _____ — all 300 tickets were sold and the audience gave a standing ovation." · a=[] · mc=["disappointing","cancelled","expensive"]
- `g3u01.w.talented` ← v1 `talented`: d="Having a natural skill to do something well" · s="My little brother is very _____ at drawing — he never took any lessons but draws portraits like a professional artist." · a=[] · mc=["clumsy","unskilled","new"]
- `g3u01.w.to-spill` ← v1 `to spill`: d="To make a liquid fall out of its container by mistake" · s="Be careful with that glass or you'll _____ your juice all over the clean white table and make a mess." · a=["spill","spilled","spilt"] · mc=["to drink","to hide","to catch"]
- `g3u01.w.whole` ← v1 `whole`: d="All of something, complete" · s="She ate the _____ large pizza by herself in one sitting because she was so hungry after the match." · a=[] · mc=["half of the","a slice of","a quarter of"]
- `g3u01.w.critic` ← v1 `critic`: d="A person who gives their opinion about music, films or books" · s="The film _____ in the newspaper wrote that the new Hollywood film was boring and too long." · a=["critics"] · mc=["actor","director","producer"]
- `g3u01.w.brave` ← v1 `brave`: d="Not afraid, ready to do difficult or dangerous things" · s="The firefighter was very _____ and ran into the burning building to save the little girl on the top floor." · a=[] · mc=["cowardly","scared","nervous"]
- `g3u01.w.not-even` ← v1 `not even`: d="Used to say something surprising — less than you expected" · s="The maths test was so easy but he got _____ one answer right — zero out of ten questions correct." · a=["not even"] · mc=["almost all","nearly all","most of the"]
- `g3u01.w.suit` ← v1 `suit`: d="A set of matching jacket and trousers for formal events" · s="My dad wears a dark grey business _____ with matching trousers, jacket, and tie when he goes to the office." · a=["suits"] · mc=["T-shirt","tracksuit","pyjamas"]
- `g3u01.w.unhappy` ← v1 `unhappy`: d="Not happy, feeling sad" · s="She was very _____ and could not stop crying because her best friend had moved to another country." · a=[] · mc=["delighted","excited","thrilled"]
- `g3u01.w.to-waste` ← v1 `to waste`: d="To use something badly or use more than you need" · s="Don't _____ good food by throwing it in the bin — eat everything on your plate. Think of hungry people." · a=["waste","wasted"] · mc=["to save","to cook","to grow"]
- `g3u01.w.to-feel` ← v1 `to feel`: d="To have a feeling or emotion inside you" · s="After the long day, I _____ very tired and just wanted to sleep." · a=["feel","felt"] · mc=["to seem","to think","to believe"]
- `g3u01.w.to-get-tired-of-sth` ← v1 `to get tired of sth.`: d="To not enjoy something any more because you did it too often" · s="I _____ tired of eating the same cheese sandwich every day and asked mum for something different in my lunchbox." · a=["get tired of","got tired of","getting tired of"] · mc=["to get excited about sth.","to fall in love with sth.","to be amazed by sth."]
- `g3u01.w.lyrics` ← v1 `lyrics`: d="The words of a song" · s="I love this pop song, but I can never remember the _____ — the words that the singer sings in each verse." · a=[] · mc=["music","melody","rhythm"]
- `g3u01.w.to-make-up` ← v1 `to make up`: d="To create something new from your imagination" · s="My little sister likes to _____ funny imaginary stories about dragons and princesses before bedtime." · a=["make up","made up"] · mc=["to memorise","to copy","to write down"]
- `g3u01.w.record` ← v1 `record`: d="A round, flat disc that plays music when you put it on a player" · s="My mum has a dusty box of old black vinyl _____ from the 1980s that she still plays on quiet Sunday afternoons." · a=["record","records"] · mc=["CD","MP3 file","cassette"]
- `g3u01.w.to-seem` ← v1 `to seem`: d="To look like or appear to be" · s="The chocolate cake _____ delicious when I saw it, but when I tasted it, it was actually very salty." · a=["seem","seemed","seems"] · mc=["to taste","to become","to remain"]
- `g3u01.w.to-sing-along` ← v1 `to sing along`: d="To join in when a melody is playing" · s="Everyone in the car started to _____ loudly to their favourite pop song playing on the radio." · a=["sing along","sang along","sung along"] · mc=["to dance to","to listen to","to turn off"]
- `g3u01.w.tune` ← v1 `tune`: d="A piece of music or the main melody of a song" · s="I know this familiar _____ very well but I can't remember the name of the song right now." · a=["tunes"] · mc=["lyrics","beat","band"]
- `g3u01.w.i-can-t-stand-it` ← v1 `I can't stand it.`: d="A way to say you really don't like something" · s="The music coming from next door is so loud and terrible — I _____!" · a=["I can't stand it","can't stand"] · mc=["I love it.","I enjoy it.","I appreciate it."]
- `g3u01.w.i-don-t-mind` ← v1 `I don't mind (it).`: d="A way to say something is OK for you" · s="We can watch that action film if you want to — I _____ at all, it's fine with me." · a=["I don't mind","I don't mind it","don't mind"] · mc=["I refuse.","I hate it.","I won't allow it."]
- `g3u01.w.to-come-along` ← v1 `to come along`: d="To go somewhere with someone" · s="We're all going to the park to play football. Do you want to _____ with us?" · a=["come along","came along"] · mc=["to stay behind","to go somewhere else","to refuse"]
- `g3u01.w.to-take-place` ← v1 `to take place`: d="To happen at a certain time and location" · s="The Olympic Games _____ every four years in a different host country around the world, with thousands of athletes." · a=["take place","took place","takes place"] · mc=["to take part","to take over","to take off"]
- `g3u01.w.afterwards` ← v1 `afterwards`: d="After that, later" · s="We had lunch at noon in the park, and _____ we all went swimming at the pool at two o'clock." · a=[] · mc=["beforehand","earlier","in advance"]
- `g3u01.w.apart-from` ← v1 `apart from`: d="Except for, other than" · s="_____ the heavy rain in the afternoon, the whole trip to the zoo was really fun and we saw all the animals." · a=["apart from"] · mc=["because of","due to","thanks to"]
- `g3u01.w.in-my-opinion` ← v1 `in my opinion`: d="A phrase to introduce what you think" · s="_____, the best film this year was the one about the lost dog who travels 1000 miles to find his family." · a=["in my opinion"] · mc=["in fact","as a result","by the way"]
- `g3u01.w.to-be-interested-in` ← v1 `to be interested in`: d="To want to know more about something" · s="He is very _____ space and astronomy — he reads every book about planets he can find at the library." · a=["be interested in","interested in"] · mc=["to be bored with","to be scared of","to be sick of"]
- `g3u01.w.me-neither` ← v1 `Me neither.`: d="A way to agree when someone says they don't do or like something" · s="'I don't like spiders at all.' — '_____ They scare me too.'" · a=["Me neither"] · mc=["Me too.","So do I.","Same here."]

## Unit transcripts (textbook sentences live here — use them first)

```
----- SB: More 3 SB Unit 1.txt -----
Unit 1  Music makes the world go round
Pages 8–9
At the end of unit 1 ...
 you know
 • 8 verb phrases to talk about auditions
 • 12 words for musical styles
 • how to use the present simple (revision)
 • how to use the past simple (revision)
you can
 • understand a magazine article about musical facts
 • understand people at a talent show
 • give and ask for opinions
 • understand an interview about music
 • talk about music you like / don’t like
 • write an email / a short article about a concert
READING Understanding a magazine article
 1 Read the magazine article. Match the pictures with the paragraphs.
Everything you never knew about music
 A famous person once said, “Without music life would be a mistake” and I think most people would agree. Music is big business. So to celebrate music, I thought I’d share with you some of my favourite amazing musical facts.
People and music
 1 Is classical music dead? Certainly not. In 2016, more people bought CDs by Mozart than by Beyoncé. Probably because most Beyoncé fans didn’t buy CDs but downloaded her music instead.
2 In 2015, astronaut Chris Hadfield made his first album. He recorded all eleven songs in space and called the album Space Sessions: Songs from a Tin Can.
3 Many people consider The Beatles the greatest band of all time. In 2018, their lead singer Paul McCartney said that none of The Beatles could read or write musical notes. “The music just came to us,” he said.
4 Most people will hear about 1.3 million songs in their lifetime. To listen to every song in the world would take more than 600 years – that’s more than six lifetimes!
Music in history
 5 The oldest musical instruments in the world are two flutes. They’re 40,000 years old. They probably belonged to my great, great, great, great, great, great, … grandparents.
6 Adelina Patti wore the most expensive opera costume of all time at Covent Garden in 1895. It was covered with diamonds and it was worth £15 million. I hope she didn’t spill any coffee on it!
7 The composer Franz Liszt was famous for his beautiful hair. In fact, many people wrote to him and asked for locks of his hair. So what did he do? He bought a dog and sent them her hair from the dog instead.
8 The composer Gioachino Rossini wrote the famous aria “Di tanti palpiti” (“For so many worries”) for his opera Tancredi while he was sitting in a restaurant in Venice, waiting for some risotto. It probably wasn’t a fast food restaurant.
Instruments
 9 A single violin is made from over 70 individual pieces of wood. You would have to be careful where you put them all. So, if you want to make your own violin, be careful not to lose a piece.
10 In 2011, a Stradivarius violin sold for $15.9 million; this was a world record. However, there is another Stradivarius that is worth even more, $45 million – but no one wants to buy it.
11 Prince was one of the most popular and successful artists of the 20th century. He was also extremely talented. On his first album For You (1978) he sang and played all 27 instruments – but not at the same time, I hope!
Music in the 21st century
 12 There are special taxis in South Korea for fans to follow their favourite K-pop idols. For $600 your driver will drive you behind your favourite star for the whole day.
13 In 2012, Psy introduced K-Pop to the world with “Gangnam Style.” The song was so successful that they built a statue of it in Seoul. Every day, hundreds of tourists stand under it and the song starts playing.
14 People on social media platforms are crazy about lip-syncing. With an app you can create a lip-sync video. It looks like the impression that you’re singing the song. There are even official lip-sync world championships.
15 Most streaming websites use AI to recommend songs to listen to. In 2023, the most popular was Spotify. Its 515 million users had over 100 million songs from around 11 million singers and bands to choose from.
Images:
 Image A: A large orange sculpture of a hand forming the “Gangnam Style” pose stands in an open space. A sign on the sculpture reads “GANGNAM STYLE.”
 Image B: A photo of a violin with a label that reads “$45 million.”
 Image C: A black and white photo of The Beatles performing on stage with guitars.
 Image D: A vintage sepia-toned portrait of Adelina Patti in elaborate opera costume and jewelry.
Pages 10–11
2 How many of these tasks can you do?
Complete the sentences.
1 Chris Hadfield made his record in ...................................................................................... .
 2 The Beatles ..................................................................................................................... write musical notes.
 3 There are two ..................................................................................................................... that are 40,000 years old.
Circle T (True) or F (False).
 4 Franz Liszt had some big fans.   T / F
 5 The most expensive violin in the world is worth $45 million.   T / F
 6 Prince didn’t sing on his first album.   T / F
Answer the questions.
 7 Why do some people hire special taxis in South Korea?
 ......................................................................................................................................................
 8 Why is there a “Gangnam Style” statue in Seoul?
 ......................................................................................................................................................
 9 How many different artists were there on Spotify in 2023?
 ......................................................................................................................................................
3 Check your answers with a partner. Then listen to the text.
LISTENING Understanding people at a talent show
 4 Paul Sacks and Sally Green are critics on the hit TV talent show Superstar.
 What do they think of Dave and Jasmine?
Listen and draw: 😀 🙂 😐 🙁
	Dave	Jasmine
Paul Sacks		
Sally Green		

DID YOU KNOW … ?
 Talent shows like American Idol or The X-Factor have been very popular for years. They have produced singing stars like Kelly Clarkson and Adam Lambert in the US, and Little Mix, One Direction and Leona Lewis in Britain.
Image description:
 A poster image for a fictional show titled “SUPERSTAR TALENT SHOW” features a confident man in a suit holding a microphone, and a young woman enthusiastically singing into a microphone with bright graphics in the background.
VOCABULARY Audition
 5 Complete what they say with the words from the box. Then listen and check.
a try training audition make it takes give up way up get back
🟦 “Dave, you’re a brave man, but don’t 1 .................................................... your real job. Sing at home under the shower, when you’re not wearing that suit. But don’t waste our time, OK? You’re never going to 2 .................................................... as a pop star.”
🟩 “You’re not going to be our next superstar. In fact, you’re not even going to be a background singer in a band. You haven’t got what it 3 .................................................... . But don’t be too unhappy. You gave it 4 .................................................... and that’s what’s important.”
🟧 “Maybe you could move a little more when you’re singing and not just stand there. But that’s not really a problem. I think with the right 5 .................................................... you could be a big star. We’ll certainly 6 .................................................... to you.”
🟨 “There’s quite a lot of work ahead, but if you’re willing to work hard, then I think what Sally says is true. You could be on the 7 .................................................... . We certainly want to talk to you after the 8 .................................................... .”
SPEAKING Giving an opinion
 6 Work in pairs. You are the critics for Superstar. Listen to these three performers and say what you think.
Images of three performers:
 Steve – smiling man with beard
 Tina – young woman smiling
 Jeff – young man with spiked hair
Speech bubbles:
 “… looks fantastic / doesn’t look like a pop star.”
 “… could be the next pop star / is never going to make it as a pop star / is(n’t) on the way up.”
 “… has got a beautiful/terrible voice / needs (doesn’t need) training.”
 “… is an excellent singer / was out of tune / has(n’t) got what it takes.”
VOCABULARY Musical styles
 7 Rank the musical styles (1 = your favourite, 12 = your least favourite).
☐ blues    ☐ classical  ☐ folk
 ☐ heavy metal ☐ hip-hop  ☐ indie
 ☐ jazz    ☐ opera   ☐ pop
 ☐ rock    ☐ reggae  ☐ dance
Image description:
 A cartoon drawing of a girl playing an electric guitar and singing passionately with her mouth wide open, wearing a red dress and long socks.
Pages 12–13
READING Understanding an interview about music
 8 Read the interview and write the number of the question next to the answer.
1 What song do you like best?
 2 Do you like dancing?
 3 Where do you get your music?
 4 What’s your favourite band?
 5 Tell us about a song that is special for you.
 6 Where do you like listening to music?
 7 What’s the most important thing in a song for you?
🟠 The Red Hot Chili Peppers. I know they are a very old band from the 1980s, before I was born, but I’ve got all their albums and never get tired of listening to them. I’ve also seen them live several times.
🟡 I like songs with a good tune. Something you can sing along to. The lyrics should be meaningful, too. I don’t like songs that don’t make sense.
🟣 Taylor Swift’s “Anti-hero” means a lot to me. She’s a brilliant artist and she writes some brilliant songs. I think “Anti-hero” is one of her greatest songs. She sings about her fears and what she hates about herself. Whenever I feel bad about something, I listen to that song.
🟢 “Don’t Tell Me” by Madonna is the best song ever. I love that song and I think Madonna is one of the greatest. She doesn’t seem to get old.
🔵 I love it. I even make up special dances for my fans on my social media platforms.
🟠 I enjoy listening to music everywhere. I’ve always got my headphones on.
🟡 Usually from streaming. But the sound is really good. I might buy the vinyl. I love buying good music on vinyl. I usually buy two or three records a week.
Image description:
 A young woman with long blond hair, wearing a red jacket, sunglasses, and large blue headphones, is smiling with her eyes closed and dancing while listening to music. A graphic text bubble reads:
 On the spot – This week, Suzie X from Fanzone talks about music.
9 Look at some more possible answers to the questions in 8. Match them with the numbers of the questions above.
🄰 Yes, I love it. / I don’t mind it sometimes. / No, I can’t stand it.
 🄱 I download it. / I stream it online. / I listen to the radio.
 🄲 On my laptop. / On the radio. / On my phone.
 🄳 The lyrics. / The rhythm. / A good melody.
SPEAKING Talking about music
 10 a Work in pairs. Ask and answer the questions in 8.
     b In groups of four, talk about music you like / don’t like. Talk as long as you can.
WRITING
 11 CHOICES
 🅐 You saw your favourite singer/band in a concert last weekend. Your English friend James wanted to come along, but fell ill. Write an email (60–80 words) in which you:
 • say how you feel about the fact that he couldn’t come with you
 • tell James what was good / not so good about the concert
 • invite James to come to your place and listen to some of your music
🅑 A website is organising a writing competition about a visit to a concert. In your entry (120–180 words) include:
 • where and when the concert took place
 • who the singer/band was
 • how you liked the concert
 • what other people liked or didn’t like about it
 • which of the songs you remember best and why
 • some thoughts on the concert you want to go to next
GRAMMAR
 Present simple (revision)
 How to use it: You use the present simple to give an opinion (1) or to talk about facts (2) and habits (3).
Write 1–3 to match the sentences with what you read above.
 ⬜ Every day, hundreds of tourists stand under the statue.
 ⬜ I usually buy two or three records a week.
 ⬜ I think Madonna is one of the greatest.
How to form it: person + verb (+ s for the 3rd person singular)
 I like ... He/She/It likes ...
Negation: person + don’t / doesn’t + verb
 I don’t like ... He/She/It doesn’t like ...
Examples:
 I like songs with a good tune.
 I don’t know why you came here.
 She writes some brilliant songs.
 She doesn’t seem to get old.
Past simple (revision)
 Examples:
 He bought a dog and sent them hair from the dog.
 Beyoncé fans didn’t buy CDs.
 He recorded all eleven songs in space and called the album Space Sessions: Songs for a Tin Can.
Complete:
 To make the negative of the present simple, use 1 ______________________ + the base form of the verb.
 To make the negative of the past simple, use 2 ______________________ + the base form of the verb.
 To form questions in the present simple, use 3 ______________________ + person + the base form of the verb.
 To form questions in the past simple, use 4 ______________________ + person + the base form of the verb.
Go now back to page 8. Check ✅ with a partner what you know / can do.
Pages 14–15
1 Watch or listen to the dialogue. Then read it.
Tom Hello!
 Kate Oh, hello. I didn’t see you there. I hope I’m not making too much noise?
 Tom No, not at all. It was really good. Erm ... Sounds sort of like Catfish and the Bottlemen?
 Kate Did you write it?
 Tom Well, I’m just messing about, but thanks. I love Catfish and the Bottlemen. In fact, I just got their latest album.
 Tom Is it any good?
 Kate Well, I’m really enjoying it so far but then I think they’re the best band around.
 Tom Me too. What did you think about their last one?
 Kate The Ride?
 Tom Yeah.
 Kate I loved it. In my opinion, it’s the best they’ve done.
 Tom Do you think so? I mean, don’t get me wrong, I really enjoyed it, but I still think The Balcony is their best.
 Kate Yeah, I know what you mean. There’s something really special about it. Maybe because it’s their first one, but I reckon they just keep getting better and better. How about you?
Tom I couldn’t agree more. I think they’re going to be massive.
 Kate Well, I hope they don’t get too popular. Bands always seem to get worse when they get too popular. Take Coldplay for example. I can’t listen to their music any more.
 Tom Me neither. You know, it’s funny to think that it was only four years ago that they were my favourite band. Sorry, I haven’t introduced myself. I’m Tom.
 Kate And I’m Kate. I guess I’m your new next-door neighbour. We moved in yesterday.
Image description:
 A still from a video shows a teenage boy and girl sitting in a garden, smiling and chatting. The boy is holding a guitar.
2 Answer the questions with Kate, Tom or both.
1 Who has the new album by the band?
 ..............................................................................................................................
 2 Whose favourite band is Catfish and the Bottlemen?
 ..............................................................................................................................
 3 Who thinks The Ride is their best album?
 ..............................................................................................................................
 4 Who thinks The Balcony is their best album?
 ..............................................................................................................................
 5 Who doesn’t like Coldplay?
 ..............................................................................................................................
 6 Who is new to the area?
 ..............................................................................................................................
USEFUL PHRASES Offering and asking for opinions
3 Write A (asking for an opinion) or O (offering an opinion).
 ⬜ Is it any good?
 ⬜ I think ...
 ⬜ What did you think about ... ?
 ⬜ I reckon ...
 ⬜ In my opinion, ...
 ⬜ How about you?
❓What do you think? Answer the questions.
 • Are Tom and Kate going to be friends?
 • What does Kate invite Tom to do next?
MOBILE HOMEWORK
 Watch part 2 of the video and complete Kate’s diary entry.
Met my new neighbour today. His name’s .......................................................... . He seems really nice and I think I’ve found a new friend. He likes the same 1 .......................................................... as me. That’s always a good thing. Anyway, can you believe he’s never listened to an 2 .......................................................... on vinyl! So I invited him over to my house to listen to one. He tried to jump over the fence, but he ripped his 3 .......................................................... . It was funny and we laughed. He’s got a good sense of humour! Anyway, we got to my house and we walked into the living room and guess what we saw? 4 .......................................................... !
 It was really embarrassing.
SPEAKING STRATEGY Responding to an opinion
4 Complete the sentences. Then check with the dialogue in 1.
1 Kate I think they’re the best band around.
  Tom M.......................................... t.......................................... s.......................................... .
2 Kate How about you?
  Tom I c.......................................... a.......................................... m.......................................... .
3 Kate I can’t listen to their music any more.
  Tom M.......................................... n.......................................... .
4 Kate It’s the best they’ve done.
  Tom D.......................................... g.......................................... m.......................................... , t.......................................... S.......................................... ?
5 ROLE PLAY: You went to the cinema together. Afterwards you discuss the film.
 Say what you liked / didn’t like about:
 • the film (overall) • the ending of the film • the story
 • the actors     • the special effects  • the music
Take 4–5 minutes to practise your dialogue. Don’t write it down.
 Act it out for the rest of the class.


----- WB: More 3 WB Unit 1.txt -----
UNIT 1  Music makes the world go round
Pages 4–5
UNDERSTANDING VOCABULARY Audition
1 Match the sentence halves to make the story.
1 □ Sam Small saw an advert for a band looking for a singer
 2 □ Before he went for the audition
 3 □ The band didn’t like his voice
 4 □ Sam was disappointed
 5 □ These days Sam Small has a record contract
 6 □ The band got back to him last week
□ a) and said he didn’t have what it takes to be their singer.
 □ b) and he is on his way up.
 □ c) and asked if he’d like to sing for them. Sam said, “No!”
 □ d) and decided to give it a try.
 □ e) but he didn’t give up on his dream to make it one day.
 □ f) He did some training with his mum.
Image Description: A cartoon of a group of happy kids holding signs with “GREAT” while a boy sings into a microphone. One child gives a thumbs up, another gives a peace sign, and music notes float around them.
USING VOCABULARY Audition
2 Read the dialogue between the critic Paul Sacks and a singer on Superstars. Complete with the words in the box.
Box on left side:
give up
way
try
training
get back
audition
make
takes
Sacks: Simon, Simon. Let me stop you there.
 Simon: What, already? I’ve only just started.
 Sacks: I don’t need to hear any more. That was probably the worst 1 _____________ I’ve ever had to listen to.
 Simon: Oh, come on. I wasn’t that bad.
 Sacks: Simon, yes you were. I don’t know where you got the idea you could sing, but you really have to 2 _____________ that dream now.
 Simon: It was my mum. She says I have a lovely voice and that I have what it 3 _____________ to be a famous singer. She told me I should give this show a 4 _____________.
 Sacks: Well, she doesn’t know anything. Simon, you are not going to 5 _____________ it in this job. I promise you.
 Simon: Maybe when I’ve had a bit more 6 _____________.
 Sacks: No. Not with all the help in the world.
 Simon: Well, I think you’re wrong. I know I’m on the 7 _____________ up and nothing you can say is going to stop that.
 Sacks: Well, good luck and 8 _____________ to me when you have your first number one.
 Simon: I will. You’ll see. You’ll be sorry one day.
Image Description: A photo of a male singer in a black leather jacket singing passionately into a microphone with one hand raised in the air.
UNDERSTANDING VOCABULARY Musical styles
3 Find eleven more musical styles in the grid.
 (↔ ↕ ↖ ↘)
Word already given:
 hip-hop
Grid:
 R I P S I N G E L
 H D A C E O I O E
 E B R E G G A E R
 A I R D C K M N I
 Y F S E U L P D H
 M F S E R U G B O
 X J C E A E J A Z
 E N J A S Z C N M
 A K L O F Z P A N
 L A C I S S A L C
(11 lines for writing answers)
USING VOCABULARY Musical styles
4 Choose six of the musical styles from the grid in 3 and say what you think about them.
Example sentence provided in blue text:
 I really like jazz. I know it’s a bit unusual, because most of my friends hate it. I’m not keen on classical music. It’s the kind of music my parents listen to.
(Lines for six answers)
UNDERSTANDING GRAMMAR Present and past simple
5 Choose the correct words to complete the sentences.
Shannon Green is lead guitar player with The Sweet Lemons. We met her on tour to ask a few questions.
Interviewer: Tell us a bit about the band.
 Shannon: Well, there are four of us. Dan and I play / plays the guitar. Bradley sing / sings and plays bass and Kevin play / plays the drums.
 Interviewer: Do you sing / sings?
 Shannon: I sometimes sing background vocals, but that’s all.
 Interviewer: What kind of music do / does the band play?
 Shannon: Pop and a bit of rock.
 Interviewer: And do / does you write your own music?
 Shannon: Well, Bradley write / writes all the lyrics and the band write / writes the music.
 Interviewer: And do you play other bands’ songs?
 Shannon: No, we don’t / doesn’t. Bradley don’t / doesn’t like playing other people’s music.
Image Description: A cartoon of a girl playing an electric guitar, smiling joyfully. She wears green and pink clothes and stands in a lively pose. Music notes and stars are around her.
Pages 6–7
6 Read the text about how Shannon joined The Sweet Lemons and put the verbs into the past tense to complete it.
Shannon 1. ‘_________________________ (dream)’ of being a pop star, so she was very happy when she 2. ‘_________________________ (get)’ a new guitar for her 13th birthday. There was only one problem. She 3. ‘_________________________ (not know)’ how to play it. She 4. ‘_________________________ (take)’ some lessons and after six months she was very good. But Shannon 5. ‘_________________________ (not want)’ to play on her own. At her school, there was a band, The Sweet Lemons, but they all 6. ‘_________________________ (be)’ in Year 6. They were all 15 and Shannon 7. ‘_________________________ (not think)’ they would want her. At the end of the school year, there was a party. The Sweet Lemons wanted to play at the party. But the day before the show, the guitar player, Dan, 8. ‘_________________________ (get)’ ill. What 9. ‘_________________________ (can)’ they do? The Sweet Lemons 10. ‘_________________________ (cannot play)’ without their guitarist. Shannon 11. ‘_________________________ (go)’ up to the band and 12. ‘_________________________ (talk)’ to them. The band leader Bradley was interested. Shannon played her guitar and the band thought she was very good. Bradley 13. ‘_________________________ (ask)’ her to play for them at the show. The show was a great hit and all the kids 14. ‘_________________________ (love)’ the band. So what happened when Dan got better? Well now, The Sweet Lemons have two guitarists.
USING GRAMMAR Present and past simple
7 Complete the dialogues with the interviewer’s questions.
Question prompts in box:
What’s your favourite band, Nigel?
When did you start dancing?
Do you like dancing, Janice?
Did you ever buy vinyl records?
And where do you get your music from?
What did you like about Imagine Dragons?
And what do you like about Coldplay?
Do you have a favourite band to dance to?
Do you listen to a lot of music, Henry?
1
 Interviewer: 1 __________________________
 Nigel: That’s a difficult question. For many years it was Imagine Dragons, but now it’s Coldplay.
 Interviewer: 2 __________________________
 Nigel: Well, their songs always had good melodies.
 Interviewer: 3 __________________________
 Nigel: Their lyrics are really good, and the music is more pop than rock.
2
 Interviewer: 4 __________________________
 Janice: Yes, I do, I love it.
 Interviewer: 5 __________________________
 Janice: I think I started when I was five.
 Interviewer: 6 __________________________
 Janice: At the moment it’s The Weeknd. They’re great to dance to.
3
 Interviewer: 7 __________________________
 Henry: Yeah, I listen to music as often as I can.
 Interviewer: 8 __________________________
 Henry: I mostly get it online. I have Spotify.
 Interviewer: 9 __________________________
 Henry: No, but I sometimes listen to some with my dad. Now, as I said, I just go online.
READING Understanding a text about music
8 Read the story.
The charity concert
 We are a great band. There is Carolyn, who is our brilliant singer, Mark, who plays the electric guitar, Adrian, who plays the saxophone and me, Larissa, I play the drums.
Image description: Four kids playing in a band called “FAB” – one plays saxophone, one electric guitar, one sings, and one is on drums. All are smiling, mid-performance, and colorful musical notes surround them.
We call ourselves the Fab Four (fab for fabulous, as you can surely guess). Not a great name, I know, but it’s OK for now.
Anyway, I think we’re making good music, covering some famous songs, but also writing some songs ourselves like our “Butterfly Blues”, which is all about butterflies disappearing and how much we need them, and which has got the chorus line “Butterfly, high in the sky, fly oh fly, free like me.” Everybody sang along at the last school concert, even the teachers and the headmistress.
So we were doing pretty well until that day Josh came to see us. Josh is the school’s computer nerd, and if you need anything that’s got to do with computers, he’s your man. He’s also a really nice guy and I have to say I have a bit of a crush on him. But that’s not important right now.
So Josh came to see me to complain about how slow most of the computers are. He said it was crazy that the school didn’t have modern computers and it wasn’t good for the kids’ education. I listened to him and said “yeah” and “yes” and “I see”, but I didn’t really know why he was telling me all this. And then, finally, he said, “I’ve got this idea, you know. What about the Fab Four doing a kind of charity concert for the school. Invite parents, uncles, aunts or just adults we know and raise some money” for new computers.” I wasn’t sure if that was a charity thing but I didn’t want to say no right away, so I said, “I’ll discuss it with the band.”
At the next band practice, I told them about Josh’s idea and Carolyn and Mark were all for it, but Adrian was furious. “That’s not a charity event!” he shouted. “Charity is all about people. It’s OK if we do a charity concert for some poor kids or for the homeless, but I don’t see why we should raise money for school computers.”
Mark said, “It’s about kids who could use their talents far better with good computers. What’s wrong with that?” “I can tell you what’s wrong,” Adrian shouted. “When you ask someone to do something serious, they need to be sure. Why us? The school has the money, so it’s the school’s job to do it. Why do we have to raise the next?” A charity concert for the biology teachers to buy new fish for the aquarium or for the teachers to have a nice trip to the zoo?” In the end, we finally had the Fab Four band chat and agreed on Josh’s idea.
So we had our band concert. No, it wasn’t. Josh and I got together and wrote two songs: one about the Internet and the other about what it means to be online. Carolyn worked hard on the lyrics, and even Adrian admitted the second song was better than anything we’d done before. And Josh and I became good friends. I never told him about the crush. I think he had a better one on Mark anyway.
At the concert, we all had a great time. Adrian had a fantastic solo. Actually, we had two encores, and after our second one the headmistress came up and thanked us. For the first time in the end, we had twelve computers and two new hits – “Computer Crazy” and “Everyone’s Happy Now.”
VOCABULARY: charity concert = Wohltätigkeitskonzert; raise money = Geld sammeln
Pages 8–9
9 How many of these tasks can you do?
Circle T (True) or F (False).
 1 In the band, there are two boys and two girls. T / F
 2 The band didn’t write “Butterfly Blues.” T / F
 3 Josh, the school’s computer nerd, wanted to be part of the band. T / F
Choose the correct answer.
 4 Josh wanted the band to
  □ play songs about computers.
  □ do a charity concert to raise money for computers.
  □ give a school concert at the end of the year.
5 Larissa promised to
  □ discuss it with the band.
  □ help raise money for new computers.
  □ do a charity concert.
6 The other band members
  □ disliked Josh’s idea.
  □ did not all agree with Josh.
  □ never discussed Josh’s idea.
Answer the questions.
 7 What is Adrian’s main argument against Josh’s idea?
 ........................................................................................................................................................
 8 What solution did they come up with?
 ........................................................................................................................................................
 9 Why did the band play another charity concert?
 ........................................................................................................................................................
10 Listen and check your answers.
LISTENING Understanding people talking about music
11 Listen to the interviews. Tick the correct answers.
1 Joanna listens to music
  □ sometimes.
  □ also in some lessons at school.
  □ only before she goes to bed.
2 Joanna mostly listens to
  □ dance music.
  □ pop.
  □ hip-hop.
3 She does a lot of browsing
  □ on Spotify.
  □ through her parents’ CDs.
  □ on Spot the Pop.
4 Joanna plays
  □ no instrument.
  □ one instrument.
  □ two instruments.
5 Lenny plays
  □ no instrument.
  □ the guitar.
  □ the guitar and the violin.
6 Lenny and his band play music by
  □ Bob Dylan and Janis Joplin.
  □ classical music.
  □ dancefloor music.
7 Lenny also likes
  □ playing the violin.
  □ listening to classical music.
  □ going to pop concerts.
8 Lenny likes to listen to music best on
  □ his mobile phone.
  □ vinyl.
  □ the radio.
Image description (bottom left): A smiling girl labelled “Joanna” with red hair and fringe. Next to her, a smiling boy labelled “Lenny” wearing large white headphones and a hoodie.
DIALOGUE WORK Offering and responding to an opinion
12 CHOICES
A
 Match the statements and replies. Then listen and check.
1 I thought the play was brilliant.  □
 2 I didn’t really enjoy the film.  □
 3 I think this is their best song.  □
 4 City are going to win, I’m sure.  □
a □ Me too. I didn’t want it to end.
 b □ In my opinion, it’s OK but not as good as the last film.
 c □ Do you think so? She was good but not brilliant.
 d □ I couldn’t agree more. I thought it was boring.
 e □ Me neither. It was too loud.
 f □ Is it any good?
B
 Complete the mini-dialogues with the sentences in the box. There is one extra sentence. Then listen and check.
a Me too. I didn’t want it to end.
 b In my opinion, it’s OK but not as good as the last film.
 c Do you think so? She was good but not brilliant.
 d I couldn’t agree more. I thought it was boring.
 e Me neither. It was too loud.
 f Is it any good?
 g What did you think of the concert?
1
 Jane: I didn’t really enjoy the last book we read in class. How about you?
 Jack: .....................................................................................................................................................
 Jane: Let’s hope the next one is better.
2
 Liz: I hope Jennifer Lawrence gets the Oscar. She was brilliant in the film.
 Ollie: .....................................................................................................................................................
 Liz: No, she was absolutely fantastic.
3
 Paul: It was brilliant. I loved every minute of it.
 Brian: .....................................................................................................................................................
 Paul: .....................................................................................................................................................
4
 Alan: I saw the new Star Wars film for my birthday.
 Lucy: .....................................................................................................................................................
 Alan: .....................................................................................................................................................
13 Complete the mini-dialogues with your own ideas.
1
 Sue: I thought that maths lesson was really interesting.
 John: Did you really think so? ....................................................................................................................
2
 Jim: I really want to see the new James Bond film.
 Sam: Me too. ..............................................................................................................................................
3
 Will: I don’t really want to go to Nicolas’ party.
 Gary: Me neither. ......................................................................................................................................
4
 Ian: I think our school should start at 10 a.m.
 Ruth: I couldn’t agree more. ......................................................................................................................
Pages 10–11
DEVELOPING WRITING SKILLS Offering an opinion
14 Read the task and what a student wrote. Why didn’t Stevie like the last album by Spotless?
Task
 You’ve just bought the new album by Spotless. Write an email (60–80 words) to your friend telling him/her about it.
 In your email:
 ✔ tell him/her what you think about it
 ✔ tell him/her how it compares to another album by the band
 ✔ recommend listening to it or not
Email layout:
FROM: stevie14@mailconnect.com
 SUBJECT: New album!!!
Hi Carmen,
 I’m just listening to the latest album by Spotless; it’s called Rescue. It’s really awesome. I like all the tracks, but my favourite is “Hugging.” The lyrics are brilliant. I wasn’t so keen on their last one – I didn’t like the way it had so much piano in it, but this one is much more rock ’n’ roll. You have to listen to it. You’ll love it.
 Bye,
 Stevie
Useful Language:
 Offering an opinion
 It’s really awesome/ good/great ...
 It’s a bit disappointing ...
 It’s rather boring ...
 My favourite band/ track is ...
 I’m not so keen on ...
 I like / don’t like the way ...
15 Now write your own answer to the following task.
Task
 You’ve just been to a movie. Write an email (60–80 words) to your friend telling him/her about it.
 In your email:
 ✔ tell him/her the title of the movie
 ✔ tell him/her what type of movie it was
 ✔ tell him/her whether you liked it or not
 ✔ recommend watching it or not
(Lined space provided for writing)
WORD FILE Audition
 to give sth. a try
 to give up
 audition
 to have got what it takes
 to make it
 to be on the way up
 to get back to sb.
MORE Words and Phrases
#	Word / Phrase	Example Sentence	German
1	to agree	I couldn’t agree more.	zustimmen
2	to belong to	It probably belonged to my great-grandparents.	gehören
3	to celebrate	To celebrate music, I thought I’d share with you my favourite musical facts.	feiern
4	extremely	He was also extremely talented.	extrem
5	flute	The oldest musical instrument is the flute.	Flöte
6	singer	You can choose from 17 million singers and bands on Spotify.	Sänger/Sängerin
7	successful	The song was so successful that they even built a statue.	erfolgreich
8	talented	She was very talented.	talentiert, begabt
9	to spill	I hope she didn’t spill any coffee on it!	verschütten
10	whole	Your driver will drive you behind your favourite star for the whole day.	ganze/r/s
11	critic	Paul Sacks and Sally Green are critics on Superstar.	Kritiker/Kritikerin
12	brave	You’re a brave man.	mutig
13	not even	In fact, you’re not even going to be a background singer.	noch nicht einmal
14	suit	Sing at home when you’re not wearing that suit.	Anzug
15	unhappy	Don’t be too unhappy.	unglücklich
16	to waste	Don’t waste our time.	verschwenden
17	to feel	I feel bad about it.	sich fühlen
18	to get tired of sth.	I never get tired of listening to music.	etw. satt haben
19	lyrics	The lyrics in a song should be meaningful.	Liedtext
20	to make up	I make up special dance moves for my fans.	erfinden, sich ausdenken
21	record	I buy a record every week.	(Schall-)Platte
22	to seem	She doesn’t seem to get on well.	wirken, scheinen
23	to sing along	I always sing along to the songs I like.	mitsingen
24	tune	I like songs with a good tune.	Melodie
25	I can’t stand it.	Ich kann es nicht ausstehen.	Ich kann es nicht ausstehen.
26	I don’t mind (it).	Ich habe nichts dagegen.	
27	to come along	James wanted to come along.	mitkommen
28	to take place	Where did the concert take place?	stattfinden
29	afterwards	We’ll go to the cinema and afterwards to the restaurant.	danach, anschließend
30	apart from	Apart from his bad taste in music, my dad’s cool.	abgesehen von
31	in my opinion	In my opinion, it’s the best they’ve done.	meiner Meinung nach
32	to be interested in	He seems to be interested in her music.	an etw. interessiert sein
33	Me neither.	Ich auch nicht.	

Image Description (top right): A cartoon band playing music with happy expressions. One member plays saxophone, another sings, one plays guitar, and another is on drums. They are dressed in colorful outfits with a purple and pink theme. Yellow callout bubbles around them display key phrases: “to give sth. a try,” “to have got what it takes,” “to give up,” “to make it,” “audition,” “to be on the way up,” and “to get back to sb.”

```

## Output contract

Write `content/corpus/units/g3-u01/gen/vocab.draft.json`:

```jsonc
{
  "schema": "vocab-draft@1",
  "slug": "g3-u01",
  "briefBank": "97dbe14fb08d",
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
