# Grammar generation brief — g2-u03 (MORE! 2, Unit 3)

<!-- domigo:gen grammar g2-u03 bank=6dc22386a63c prompt=4b9164076103 -->

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

<!-- domigo:prompt gen-grammar v=1 -->
# Grammar item generation

Produce grammar items for the unit's structures (listed in the brief with their SB
grammar-box evidence and v1 seed items). Obligations per structure:

- **Volume:** at least the v1 floor stated in the brief; aim for the floor + ~20%.
- **Formats:** ≥3 distinct formats per structure; prefer ≥5 when the structure supports
  them. Match format to what the structure naturally exercises (the v1 format mix is a
  hint, not a law).
- **Difficulty spread:** items at difficulty 1, 2 AND 3 (recognition → guided → free).
- **Unit theme:** carriers should live in the unit's world (the transcript's topics,
  characters, situations) — items feel like the textbook, not like a worksheet from
  nowhere.

Per-format data contract (fields not listed stay empty/null):

- `gap-fill` (gf): prompt with 1–2 `___` blanks; answers = full fills (+ partial).
- `multiple-choice` (mc): prompt usually with one `___`; answers = the correct
  option(s); `distractors` = exactly 3 wrong in-bank options; `gameMeta` REQUIRED
  (pool ≥4).
- `context-picker` (cp): prompt = a short context; answers = the one correct SENTENCE;
  `distractors` = 3 wrong sentences (each flawed in exactly the structure under test);
  `gameMeta` REQUIRED.
- `translation` (tr): `direction` REQUIRED. deToEn: prompt German (du-form), answers
  English. enToDe: prompt English, answers German. Tiered both ways.
- `error-correction` (ec): prompt = one sentence containing exactly ONE error in the
  target structure; answers = the corrected sentence (full; also accept the corrected
  fragment alone as partial).
- `transformation` (tf): prompt = source sentence + trigger in parentheses; answers =
  transformed sentence.
- `question-formation` (qf): prompt = chips/statement; answers = the question.
- `free-form` (ff): prompt = a situation; answers = model answers (full) + looser
  acceptable ones (partial). Use sparingly — hardest to grade.
- `sentence-building` (sb): prompt = shuffled chips joined with " / "; answers = the
  sentence(s). Chip count (answer tokens + distractor chips) ≤ 12; `gameMeta` REQUIRED
  with `chipBudget`.
- `matching` (mt): 3–6 pairs (sentence halves, question↔answer) — English↔English;
  prompt = a one-line framing (no instructions).
- `anagram` (ag): answers = exactly one single word; prompt = a du-form German cue or
  English context line.
- `group-sort` (gs): ≥2 groups with ≥2 members each, label = category, members =
  English words/sentences; prompt = one-line framing.
- `matching-pairs` (mp): 4–8 pairs, English↔English.

Every item: `structureId` from the brief, honest `difficulty`, `hintDe` (du-form nudge,
light German grammar terms allowed), `explainDe` (1–2 sentence du-form explanation of
WHY, shown after a wrong answer), `seedV1` = the v1 item id you mined (or null),
`sbRef` = transcript evidence if the carrier comes from the book.

## Structures of this unit

### `g2u03.s.should` — should / shouldn't (should / shouldn't (Ratschläge))

Giving advice and asking for advice with should/shouldn't + base form.

v1 floor for this structure: **20 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [should-advice]: Use should to say what someone should do and shouldn't to say what someone should not do.
  - DE: Wenn du sagen willst, was jemand tun sollte, verwendest du should. Wenn du sagen willst, was jemand nicht tun sollte, verwendest du shouldn't.
  - "We should go home - it's late." — "Wir sollten nach Hause gehen - es ist spät."
  - "We shouldn't go in there - it's dangerous." — "Wir sollten da nicht hineingehen - es ist gefährlich."
- rule [should-form]: Form: should/shouldn't + base form - the same for all persons, with no to and no third-person -s.
  - DE: Bildung: should / shouldn't + Grundform des Verbs. Die Form ist für alle Personen gleich - ohne to und ohne -s in der 3. Person.
  - "You should wear a helmet." — "Du solltest einen Helm tragen."
  - "He should study more." — "Er sollte mehr lernen."
- rule [should-questions]: Ask for advice with Should + subject + base form, or put a question word first.
  - DE: Wenn du um Rat fragst, verwendest du ebenfalls should: Should + Subjekt + Grundform - oder ein Fragewort davor.
  - "What should I do?" — "Was soll ich tun?"
  - "Should I phone my parents?" — "Soll ich meine Eltern anrufen?"

common errors:
- Adding to after should: ✗ "You should to wear a costume." → ✓ "You should wear a costume."
- Adding third-person -s to should: ✗ "She shoulds go home." → ✓ "She should go home."
- Negating should with don't: ✗ "You don't should go." → ✓ "You shouldn't go."

SB box `g2/sb/More 2 SB Unit 3.txt#grammar-1` — should / shouldn’t:
```
▶️ Lies die Beispielsätze.
We should go home – it’s late.
 We shouldn’t go in there – it’s dangerous.
 What should I do?
💡 Complete the sentences with should or shouldn’t.
Wenn du sagen willst, was jemand tun sollte, dann verwendest du “...................”
 Wenn du sagen willst, was jemand nicht tun sollte, dann verwendest du “...................”
 Wenn du um Rat fragst, dann verwendest du ebenfalls “...................”
Bildung: should / shouldn’t + Grundform des Verbs
```

v1 seed items (UNTRUSTED):
- `m2-u3-should-gf-001` [gap-fill, d1]: p="You ___ eat more fruit. It's healthy!" c="should" a=["should"] ds=["should to","shoulds","must to"]
- `m2-u3-should-gf-002` [gap-fill, d1]: p="It's raining. You ___ take an umbrella." c="should" a=["should"] ds=["should to","shoulds","are should"]
- `m2-u3-should-gf-003` [gap-fill, d2]: p="She ___ (should / not) stay up so late on school nights." c="shouldn't" a=["shouldn't","should not"] ds=["don't should","should doesn't","not should"]
- `m2-u3-should-gf-004` [gap-fill, d3]: p="He ___ (should) drink more water when he plays football." c="should" a=["should"] ds=["shoulds","should to","is should"]
- `m2-u3-should-gf-005` [gap-fill, d3]: p="You look tired. You ___ go to bed early tonight." c="should" a=["should"] ds=["should to","ought","have should"]
- `m2-u3-should-gf-006` [gap-fill, d4]: p="Your little sister is scared of dogs. You ___ (should / not) take her to the dog park." c="shouldn't" a=["shouldn't","should not"] ds=["don't should","shouldn't to","doesn't should"]
- `m2-u3-should-mc-001` [multiple-choice, d2]: p="Which sentence is correct?" c="You should wear a helmet when you ride your bike." a=["You should wear a helmet when you ride your bike."] ds=["You should to wear a helmet when you ride your bike.","You shoulds wear a helmet when you ride your bike.","You don't should wear a helmet when you ride your bike."]
- `m2-u3-should-mc-002` [multiple-choice, d3]: p="Your friend is always late for school. Which advice is correct?" c="He should get up earlier." a=["He should get up earlier."] ds=["He shoulds get up earlier.","He should to get up earlier.","He don't should get up earlier."]
- `m2-u3-should-mc-003` [multiple-choice, d4]: p="Which question is correct?" c="Should I bring my laptop to school?" a=["Should I bring my laptop to school?"] ds=["Do I should bring my laptop to school?","Should I to bring my laptop to school?","Am I should bring my laptop to school?"]
- `m2-u3-should-ec-001` [error-correction, d3]: p="Find and fix the mistake: You should to study for the test tomorrow." c="You should study for the test tomorrow." a=["You should study for the test tomorrow.","You should study for the test tomorrow","should study"] ds=[]
- `m2-u3-should-ec-002` [error-correction, d4]: p="Find and fix the mistake: She don't should eat so much chocolate." c="She shouldn't eat so much chocolate." a=["She shouldn't eat so much chocolate.","She shouldn't eat so much chocolate","She should not eat so much chocolate.","She should not eat so much chocolate","shouldn't eat"] ds=[]
- `m2-u3-should-ec-003` [error-correction, d5]: p="Find and fix the mistake: He shoulds help his mum with the dishes." c="He should help his mum with the dishes." a=["He should help his mum with the dishes.","He should help his mum with the dishes","should help","should"] ds=[]
- `m2-u3-should-tf-001` [gap-fill, d3]: p="Your friend has a bad headache and doesn't know what to do. Give advice: 'You ___ take some medicine and rest.'" c="should" a=["should"] ds=["shouldn't","must","could"]
- `m2-u3-should-tf-002` [gap-fill, d4]: p="Your little brother is playing on his phone during dinner. Tell him: 'You ___ play on your phone at the table!'" c="shouldn't" a=["shouldn't","should not"] ds=["should","mustn't","couldn't"]
- `m2-u3-should-tf-003` [gap-fill, d5]: p="You have a problem at school and want advice. Ask your mum: '___ I ___ my teacher about it?'" c="Should I tell" a=["Should I tell","Should I tell my teacher about it?","Should I tell my teacher about it"] ds=["must","could","would"]
- `m2-u3-should-tr-001` [translation, d2]: p="🇩🇪 Du solltest mehr Wasser trinken." c="You should drink more water." a=["You should drink more water.","You should drink more water","You ought to drink more water.","You ought to drink more water"] ds=[]
- `m2-u3-should-tr-002` [translation, d2]: p="🇩🇪 Er sollte nicht so spät aufbleiben." c="He shouldn't stay up so late." a=["He shouldn't stay up so late.","He shouldn't stay up so late","He should not stay up so late.","He should not stay up so late"] ds=[]
- `m2-u3-should-sb-001` [sentence-building, d2]: p="Put the words in the correct order: should / we / to / walk / school" c="We should walk to school." a=["We should walk to school.","We should walk to school"] ds=[]
- `m2-u3-should-mt-001` [matching, d3]: p="Match the situation with the correct advice:\n1. I have a toothache.\n2. She is always tired.\n3. We have a test tomorrow.\n4. He eats too many sweets.\n5. It's very cold outside.\n\na. He should eat less sugar.\nb. You should go to the dentist.\nc. You should wear a warm jacket.\nd. She should go to bed earlier.\ne. We should study tonight." c="{\"1\":\"b\",\"2\":\"d\",\"3\":\"e\",\"4\":\"a\",\"5\":\"c\"}" a=["{\"1\":\"b\",\"2\":\"d\",\"3\":\"e\",\"4\":\"a\",\"5\":\"c\"}"] ds=[]
- `m2-u3-should-qf-001` [question-formation, d1]: p="You should ask your teacher. → Ask about: what to do. Start with 'What'." c="What should I do?" a=["What should I do?","What should I do"] ds=[]

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

## Unit transcripts (carrier material — the unit's world)

```
----- SB: More 2 SB Unit 3.txt -----
Unit 3 Halloween
Page 24–25
UNIT 3
 Halloween
At the end of unit 3 …
you know
 ☐ 6 Halloween words
 ☐ how to use should and shouldn’t
you can
 ☐ understand a webpage about Halloween traditions
 ☐ understand a story about Halloween
 ☐ create an ending to a story
 ☐ say why you liked or didn’t like a story
 ☐ make suggestions
 ☐ write an email based on a mind map
 ☐ write a party invitation
VOCABULARY
 Halloween
1 Listen and look at the picture. Then write the numbers next to the words.
1 apple bobbing
 2 a ghost
 3 a pumpkin
 4 a haunted house
 5 a vampire
 6 a witch
(Image description: Illustration of a Halloween scene.
A girl is bobbing for apples (1).
A friendly ghost floats above the group (2).
Three pumpkins with carved faces sit in front of a house (3).
The background shows a spooky purple haunted house (4).
A vampire with a red cape stands near the group (5).
A witch with a broomstick and hat is waving (6).)
A SONG 4 U
2 Listen and sing.
When they come after you
We are brave, we are strong.
 Here’s our Halloween song:
We aren’t scared of witches.
 We smile at every ghost.
 We do not fear the zombies.
 In fact, we like them most.
 But what will you do
 when they come after you?
We are brave, we are strong.
 Here’s our Halloween song:
We say hello to pirates
 and wizards are our friends.
 We do not fear the vampires
 that fly until night ends.
 But what will you do
 when they come after you?
We are brave, we are strong.
 Here’s our Halloween song:
We’re the Halloween monsters.
 We are so dangerous.
 We frighten boys and girls.
 You must be scared of us.
READING
3 Read the webpage about Halloween. Who do you think has the most fun and why?
HALLOWEEN
The question was:
 Do you have any Halloween traditions or fun things to do?
Your answers were:
George, USA, aged 11
 At Halloween, we always watch a scary film. We change the house into a haunted castle and then we invite friends for a Halloween party. My brother and I look for scary noises on the internet, and play them when our friends walk up the stairs in the dark. After the tour of the house, we eat popcorn and watch the film.
Megan, Ireland, aged 14
 We always have a party. Everyone wears a mask. We’re vampires, witches and ghosts. And we also play apple bobbing. There are lots of apples in a bowl of water and you take them out with your mouth. You can’t use your hands. It’s difficult, but fun. I often win the game because I’m a vampire. And with my vampire teeth it’s easy to get the apple.
Steve, UK, aged 12
 Me and my brothers usually go out on Halloween. We knock on people’s doors and say “trick or treat”. People sometimes give us a treat – sweets, etc. But if they don’t, we play a trick on them. Last year, our neighbour Mr Eliot didn’t give us a treat, so we put some vampire stickers on his front window.
Henry, Canada, aged 11
 Every year we take a pumpkin to school. We cut off the top and take out everything inside. Then we cut a scary face in it. Finally, we put a candle in the pumpkin. This year my pumpkin face was the best. It was so scary that the teacher said, “Let’s keep it for our Halloween party at school.” I was very proud. Henry – Master of Horror!
4 Read the sentences below. Which of the four texts on the webpage in 3 do they go with?
 Write the names: George, Megan, Steve or Henry.
1 That’s really scary, well done! All we need now is a candle.
 …………………………………………………………………………
 2 My clothes are really wet. I must get another T-shirt!
 …………………………………………………………………………
 3 Wait for me before you start the film!
 …………………………………………………………………………
 4 Can I borrow your knife, please?
 …………………………………………………………………………
 5 Those pictures look really scary!
 …………………………………………………………………………
 6 This is unfair. Your teeth are so long.
 …………………………………………………………………………
 7 Wow, that’s a lot of sweets.
 …………………………………………………………………………
Page 26–27
READING
5 a Before you read, look at the pictures and answer the questions.
1 What was Lara’s problem?
 ……………………………………………………………………………
 2 In which pictures can you see a graveyard?
 ……………………………………………………………………………
b Read the story.
The mysterious girl
It was Halloween. And I was out trick-or-treating with my sister Lara. I was dressed up* as a pirate and she was dressed up as a superheroine. We were pretty good at trick-or-treating. A lot of people gave us sweets, and Lara couldn’t stop eating them.
She had one sweet after the other, and an hour later she said, “I feel a bit sick. Maybe I should go home.” “Maybe you shouldn’t eat so many sweets,” I said. But Lara was already a bit green in the face and said, “Let’s go home!” “No way,” I said. “I want to do some more trick-or-treating on my own.”
So Lara went home and I walked down another street, a street I didn’t really know.
 There were some trees next to the graveyard, and behind one of the trees I saw a girl. She was dressed like a girl from the 19th century. She only had a small bag, so I said, “Hi, I’m Ron. I see your bag is very small and there isn’t much in it. Would you like to go trick-or-treating with me?”
The girl looked at me and said, “That is so very, very kind of you. I’m Edwina.”
 (What a strange way to talk, I said to myself. And what a strange name.)
 “Where shall we go?” she asked. “Well, down the road,” I said. “Do you live here?” “Yes,” she said, “up the road. And I’m a bit late, I believe.” “Well, then you should phone your parents and tell them!” “Phone?” she said. “Yeah, haven’t you got a phone?” “A phone?” she said and she laughed a little.
Anyway, we went up to some houses and the people there gave us lots of sweets. “Oh!” most of them said when they saw the girl. “Isn’t she cute? And her costume looks so real.”
Then we came to a really old house and the girl said, “I have to go in there.”
 The building looked like a haunted house and I was a bit scared, so I said, “You shouldn’t go in there alone. Do you know the people who live there?” I asked.
 “Yes,” she said. “OK, I’ll wait here,” I said.
 And then she disappeared.
VOCABULARY: dressed up – verkleidet
(Image description:
First image shows Ron and Lara walking on Halloween night.
Second shows Ron talking to the mysterious girl near the graveyard.
Third image shows them trick-or-treating.
Fourth image shows Edwina walking alone into the haunted house.)
6 How many of these tasks can you do?
1 Lara and Ron were / weren’t very good at trick-or-treating.
 ……………………………………………………………………………
 2 Lara liked / didn’t like sweets.
 ……………………………………………………………………………
 3 Lara went home / didn’t go home on her own.
 ……………………………………………………………………………
4 Behind a tree, Ron saw ……………………………………………………..
 5 The girl’s dress looked very …………………………………………………
 6 The girl went ……………………………………………………………….. with Ron.
7 What did Ron think of the girl?
 ……………………………………………………………………………
 8 Why did the girl laugh about the phone?
 ……………………………………………………………………………
 9 Why did the girl stop in front of the old house?
 ……………………………………………………………………………
7 Check your answers with a partner. Then listen to the story.
SPEAKING & LISTENING
 Creating an ending to a story / Saying why you liked or didn’t like a story
8 Work in pairs. Think of an ending to the story in 5.
9 Now listen to the end of the story and circle T (True) or F (False).
1 After ten minutes, the girl came out of the house.  T / F
 2 An old woman looked out of the window of the house across the road.  T / F
 3 “You’re in front of a haunted house,” the old woman told Ron.  T / F
 4 Last year, a girl lived in the old house.  T / F
 5 Ron tried to open the door, but it was locked.  T / F
 6 Ron was confused by his adventure.  T / F
10 Talk to your partner.
 How did you like the story?
I liked it because … / I didn’t like it because …
I think Ron / Edwina is (a bit) interesting / boring / strange / funny … because …
I liked / didn’t like the ending because …
11 Discuss in class.
What do you and your friends do on Halloween?
I usually go trick-or-treating with …
 I don’t go … because …
 It’s good fun to …
What do you (not) like about Halloween? Say why (not).
I (don’t) like … because …
 What I like about Halloween is …
Page 28–29
SPEAKING
 Making suggestions
12 Complete Sarah’s list of suggestions for going trick-or-treating.
 Write should or shouldn’t.
1 You ................................................ wear a Halloween costume.
 2 You ................................................ play really mean tricks on people.
 3 You ................................................ wear black clothes at night.
 4 You ................................................ take a bag with you for the sweets.
 5 You ................................................ always go with friends.
 6 You ................................................ stay out very late.
 7 You ................................................ go on your own.
 8 You ................................................ always tell an adult where you are going.
(Image description: A smiling girl in a witch costume points to the list.)
13 Listen and check. Then say the sentences in 12 yourself.
WRITING
14 Read Sarah’s email to you. Then write an email answer.
📧
 From: sarah_clarkson@mailconnect.com
 Subject: Halloween party!
Hi there,
 Mum says I can have a Halloween party 😊 (and U R the first I’m inviting), but I don’t really know how to plan it. I have some ideas, but you’re much better at that than I am. So can you send me a few ideas? Please.
 C U
Here are some ideas for your email:
(Mind map graphic with the word "PARTY" in the middle.
 SHOULD: costumes, games, good music, something to drink, popcorn, plenty of food
 SHOULDN’T: very loud music, too many sweets, very wild games, …)
15 Listen to the poem. Then read it.
I’m not so keen on Halloween
I’m not so keen on Halloween.
 When my friends meet for trick or treat,
 I’m not the one who thinks it’s fun
 to run around as witch or ghost.
What scares me most is other kids
 who hunt for treats, who look for sweets.
 They don’t play tricks just give quick kicks
 to get their treats, to get your sweets.
(Image description: A cartoon child looking unhappy while others in costumes trick-or-treat. Below, an upset child sits near a knocked-over bowl of candy.)
GRAMMAR
 should / shouldn’t
▶️ Lies die Beispielsätze.
We should go home – it’s late.
 We shouldn’t go in there – it’s dangerous.
 What should I do?
💡 Complete the sentences with should or shouldn’t.
Wenn du sagen willst, was jemand tun sollte, dann verwendest du “...................”
 Wenn du sagen willst, was jemand nicht tun sollte, dann verwendest du “...................”
 Wenn du um Rat fragst, dann verwendest du ebenfalls “...................”
Bildung: should / shouldn’t + Grundform des Verbs
MORE FUN WITH FIDO!
 (Comic strip of three scenes)
Scene 1: A dog dressed as a ghost holds a basket and says, “Trick or treat?”
 Scene 2: A child offers the dog a bone.
 Scene 3: The dog sits sadly in front of an empty house and says, “Why didn’t they like my treat?”
📘 Now go back to page 24. Check ✅ with a partner what you know / can do.
Page 28–29
SPEAKING
 Making suggestions
12 Complete Sarah’s list of suggestions for going trick-or-treating.
 Write should or shouldn’t.
1 You ................................................ wear a Halloween costume.
 2 You ................................................ play really mean tricks on people.
 3 You ................................................ wear black clothes at night.
 4 You ................................................ take a bag with you for the sweets.
 5 You ................................................ always go with friends.
 6 You ................................................ stay out very late.
 7 You ................................................ go on your own.
 8 You ................................................ always tell an adult where you are going.
(Image description: A smiling girl in a witch costume points to the list.)
13 Listen and check. Then say the sentences in 12 yourself.
WRITING
14 Read Sarah’s email to you. Then write an email answer.
📧
 From: sarah_clarkson@mailconnect.com
 Subject: Halloween party!
Hi there,
 Mum says I can have a Halloween party 😊 (and U R the first I’m inviting), but I don’t really know how to plan it. I have some ideas, but you’re much better at that than I am. So can you send me a few ideas? Please.
 C U
Here are some ideas for your email:
(Mind map graphic with the word "PARTY" in the middle.
 SHOULD: costumes, games, good music, something to drink, popcorn, plenty of food
 SHOULDN’T: very loud music, too many sweets, very wild games, …)
15 Listen to the poem. Then read it.
I’m not so keen on Halloween
I’m not so keen on Halloween.
 When my friends meet for trick or treat,
 I’m not the one who thinks it’s fun
 to run around as witch or ghost.
What scares me most is other kids
 who hunt for treats, who look for sweets.
 They don’t play tricks just give quick kicks
 to get their treats, to get your sweets.
(Image description: A cartoon child looking unhappy while others in costumes trick-or-treat. Below, an upset child sits near a knocked-over bowl of candy.)
GRAMMAR
 should / shouldn’t
▶️ Lies die Beispielsätze.
We should go home – it’s late.
 We shouldn’t go in there – it’s dangerous.
 What should I do?
💡 Complete the sentences with should or shouldn’t.
Wenn du sagen willst, was jemand tun sollte, dann verwendest du “...................”
 Wenn du sagen willst, was jemand nicht tun sollte, dann verwendest du “...................”
 Wenn du um Rat fragst, dann verwendest du ebenfalls “...................”
Bildung: should / shouldn’t + Grundform des Verbs
MORE FUN WITH FIDO!
 (Comic strip of three scenes)
Scene 1: A dog dressed as a ghost holds a basket and says, “Trick or treat?”
 Scene 2: A child offers the dog a bone.
 Scene 3: The dog sits sadly in front of an empty house and says, “Why didn’t they like my treat?”
📘 Now go back to page 24. Check ✅ with a partner what you know / can do.
Page 30–31
THE TWINS 1
 ▶️ The bike tour
Developing speaking competencies
Language function
 ☑ I can apologise (sich entschuldigen)
Speaking strategy
 ☑ I can express strong dislike (Missfallen ausdrücken)
VOCABULARY
 Mistakes
1 Look at the photos. Match them with the mistakes. Listen and check.
☐ send a text message to the wrong person
 ☐ break someone’s camera
 ☐ eat someone’s chocolate
 ☐ lose someone’s pen
(Image descriptions:
A boy sits with head in hand, looking at phone – appears regretful.
A boy scratching his head near a broken camera.
A boy worried, holding a broken pen.
A girl caught mid-bite with a surprised look, eating chocolate.)
2 Watch or listen to the dialogue. Then read it. Why does Leo say sorry?
Leo Lucy, I’m really sorry. I made a terrible mistake.
 Lucy What did you do?
 Leo Well, you told me to invite Emily Clarke … for the bike tour.
 Lucy And?
 Leo I wanted to text her, but I sent the message to Emily White.
 Lucy What? You know I don’t really like her. She’s a bit boring.
 Leo I know. I feel really bad about it.
 Lucy You fool. She’s so boring.
 Leo I’m sorry. It was a mistake. I know.
Lucy But how could you do that?
 Leo Hang on a minute. Here’s her answer: Great idea. Thanks.
 See you both near the old castle at two. Say hi to Lucy.
 Lucy Oh, no!
3 Complete the sentences with Lucy, Leo or Emily.
1 .............................................. invited the wrong person for a bike tour.
 2 .............................................. got an invitation to go on a bike tour with Lucy and Leo.
 3 .............................................. knows what .............................................. thinks about Emily White.
 4 .............................................. thinks that Emily White is boring.
 5 .............................................. tells .............................................. that she will join them.
 6 When .............................................. hears that she is not happy at all.
USEFUL PHRASES
 Apologising
4 Write the sentences that Leo uses to apologise to Lucy. Then check with 2.
1 sorry / really / I’m
 ..............................................................................................
 2 about / I / really / bad / it / feel
 ..............................................................................................
❓ What do you think? Answer the questions.
 • Do they meet Emily White?
 • What happens on the bike tour?
▶️ MOBILE HOMEWORK
Watch part 2 of the video. Use a verb from the box and your own ideas to complete the sentences.
meet stop apologise have ride
1 Lucy and Leo .................................................... near ....................................................
 2 The three kids .................................................... their bikes .............................................
 3 They .................................................... next to ....................................................
 4 Emily .................................................... a surprise ....................................................
 5 In the end, Lucy ....................................................
SPEAKING STRATEGY
 Expressing strong dislike
5 Try to complete the phrases. Check with the dialogue in 2.
1 Leo I sent the message to Emily White.
  Lucy W............................ ..............................................?
 2 Leo I know. I feel really bad about it.
  Lucy You f............................ . She’s so boring.
 3 Leo I’m sorry. It was a mistake. I know.
  Lucy But h............................ c............................ y............................ d............................ that?
6 CHOICES
A Work in pairs. A apologises to B for a mistake. B reacts.
send / text message
 break / mobile phone
 lose / pen
 eat / ice cream
A I sent the text message to Pam, not to Paula. I’m so sorry.
 B How could you do that?
B ROLE PLAY: Look at the situations from A. Choose one. Work in pairs and extend it into a longer dialogue. Take 2 or 3 minutes to practise it. Don’t write it down. Act it out in class.


----- WB: More 2 WB Unit 3.txt -----
UNIT 3 Halloween
Page 21
UNDERSTANDING VOCABULARY – Halloween
1 Match the words with the pictures.
Word list (left side):
a haunted house
a candle
knock on a door
a vampire
a witch
cut off the top
a ghost
a scary face
a pumpkin
apple bobbing
Illustrations (right side):
A white ghost floating
A vampire with pale skin and fangs
A witch flying on a broomstick
A scary face screaming in fear
An old haunted house with broken windows
A pumpkin with a carved scary face
A lit candle on a candle holder
A boy playing apple bobbing with his mouth in a tub
A hand knocking on a door
A hand using a knife to cut the top off a pumpkin with an apple nearby
USING VOCABULARY – Halloween
2 Read and complete. Use the words or phrases from 1. Sometimes you need to change the form.
1
 A Look, there are two big orange balls in grandma’s garden.
 B Don’t be silly. They are ......................................................... .
2
 A It’s very dark in here.
 B OK, I can get a ......................................................... .
3
 A Do all ......................................................... wear funny hats?
 B Yes, they do and they can fly.
4
 A Don’t open the door.
 B Why not?
 A Because there’s a man with a .................. ......................................................... outside.
5
 A I don’t want to go in there.
 B Why not?
 A Because it’s a ......................................................... ......................................................... .
6
 A Don’t ......................................................... ......................................................... .
 B Why not?
 A Because I’ve got a key.
7
 A Please give me the knife.
 B What for?
 A I want to ......................................................... ......................................................... of the pumpkin.
8
 A I’ve got my ......................................................... costume, but I can’t find my plastic teeth.
 B They are on the table.
9
 A Who won ......................................................... ?
 B Jill did. She caught three apples.
10
 A Who haunts this old castle next to the graveyard?
 B It’s the ......................................................... of Sir Frederick, I believe.
Page 22–23
3 Do the crossword.
Images for clues (with numbers matching crossword entries):
Down ⬇
A haunted castle
A costume
A door
A bag full of Halloween candy
Across ➡
 2. A graveyard
 5. A spooky gate
 7. A haunted house
 9. A speech bubble saying "Trick or treat!"
 10. A carved pumpkin
 11. A ghost
Clue example provided in a caption:
 9 That’s what you say at Halloween.
4 Complete the text with the correct form of the words and phrases from 3.
Last Halloween, I went ..................................................... with my friends.
 We put on our scary ..................................................... and our Halloween
 ..................................................... . First, we went down our street. We knocked at the ..................................................... of Mrs Jones. An old man opened.
 I didn’t know him. “Where’s Mrs Jones?” I said. The man smiled. Suddenly I heard a noise. There was a ..................................................... .
 We ran away. “Come back,” she shouted. It was Mrs Jones. We went back and she gave us lots of ..................................................... . We put them in our bags that looked like big orange ..................................................... .
 Then we went to the old ..................................................... at the end of the street. We opened the gate* and went up the ..................................................... . We knocked. Nobody opened.
 We knocked again. “There’s nobody there,” I said. “Look at the ..................................................... ,” said my friend. “I can see a light.” There was a word in big red letters in the window. The word was: DANGER! We ran.
VOCABULARY: gate = Tor
UNDERSTANDING GRAMMAR – should / shouldn’t
5 Match the sentences with the pictures.
He should see a doctor.
He shouldn’t drive so fast.
He shouldn’t eat so much.
He should go to bed.
He shouldn’t go in there.
He shouldn’t swim in the sea.
(Pictures show: a boy in bed, a speeding driver, a boy with a large meal, a sleepy boy, a boy about to enter a door with a warning, a beach with a no-swimming sign.)
6 Match the sentences to make dialogues.
I’m scared at Halloween.
I’m tired.
I’m hungry.
My leg hurts.
My mum’s angry with me.
My cat’s ill.
It’s raining outside.
It’s a very scary film.
Answer choices:
 ☐ You shouldn’t go to bed so late.
 ☐ You should take an umbrella.
 ☐ You should say you’re sorry.
 ☐ You should take it to the vet*.
 ☐ You should see a doctor.
 ☐ You shouldn’t leave the house then.
 ☐ You shouldn’t watch it alone.
 ☐ You should eat a banana.
VOCABULARY: vet = Tierarzt/Tierärztin
USING GRAMMAR – should / shouldn’t
7 Here is what parents say to their kids at Halloween. Write should or shouldn’t.
You ..................................................... say thank you when you get a treat.
You ..................................................... scare very small kids.
You ..................................................... go to houses of people you don’t know.
You ..................................................... eat too many sweets.
You ..................................................... take your mobile phone with you.
You ..................................................... stay out too long.
Page 24–25
8 Write should or shouldn't to complete the speech bubbles.
You ..................................................... take the dog for a walk.
 (Image of a person with a dog and a leash at the door.)
You ..................................................... kiss it.
 (Image of a girl about to kiss a frog wearing a crown.)
You ..................................................... run in school.
 (Image of a boy slipping and falling in a school hallway.)
You ..................................................... wash your hands.
 (Image of a girl washing her hands at a sink.)
You ..................................................... practise more.
 (Image of a girl playing the guitar.)
You ..................................................... get too close.
 (Image of a girl standing too close to a lion at the zoo.)
9 Use the verbs in the box to complete the email.
Verb box:
 buy visit go speak bring eat try take
Email:
From: ally@mailconnect.com
 Subject: Your visit
Hi Paulo,
 I’m so happy about your visit next week. It’s your first visit to my country, so here’s some advice for you.
 The weather is quite cold, so you should 1 ..................................................... some warm clothes. You shouldn’t 2 ..................................................... them here because they are very expensive.
 To get to my house you should 3 ..................................................... the train. It’s only 20 minutes from the airport. You shouldn’t 4 ..................................................... by taxi because (again!) it’s very expensive.
 When you are here, you should 5 ..................................................... the museum and the castle. They are very interesting. You should also 6 ..................................................... to see a musical – it’s fantastic! You should definitely 7 ..................................................... some of the local food – it’s delicious. There are lots of great restaurants here and they are quite cheap. You shouldn’t 8 ..................................................... at the fast food restaurants though. They’re just the same as the ones in your country. Finally, you should 9 ..................................................... to some local people. It’s a great way to practise your English.
 I hope you enjoy your stay. I can’t wait to see you.
 Love, Ally
10 What should visitors to your town do or not do? Write some suggestions.
When you come to my town, you should:
 .................................................................................................................................
 .................................................................................................................................
When you come to my town, you shouldn’t:
 .................................................................................................................................
 .................................................................................................................................
READING – Understanding a story about Halloween
11 Read the story. How many of the tasks below can you do?
The house on the hill
Last Halloween, I went trick-or-treating with my friend Darren.
 I didn’t want to go too far but Darren had other plans. “Let’s go to the other side of town, Laura,” he said, “to the house on the hill”. I didn’t want to seem* scared so I agreed, but I was.
The house on the hill was a really big old house with a big gate and a long drive up to the front door. It was the kind of house you see in horror films. It was famous in our town. Every year, kids talked about going trick-or-treating there, but no one ever did.
We walked up to the front door and knocked. An old woman opened the door.
 “Trick or treat?” Darren asked.
 The lady looked at us. She didn’t say anything and closed the door.
 “OK, let’s go home,” I said.
 “No,” said Darren. “We should play a really mean trick on her.”
 He took off his bag and got something from inside.
 “What’s that?” I asked. “Eggs,” he said.
 “I think we should go home,” I said. But it was too late. Darren started to throw eggs at the house.
Suddenly the door opened. Two big dogs started barking*. Darren and I started running. We heard the dogs behind us. We arrived at the gate and jumped over. The dogs stopped behind the gate.
“That was close,” Darren said.
 We saw a man in a blue coat – a police officer.
 “What are you two doing?” he asked.
 “Just some trick-or-treating,” I said.
 “Well, don’t waste your time at that house,” he said. “No one lives there. Mrs Smith, the owner, died last year.”
VOCABULARY:
 seem – erscheinen, wirken
 bark – bellen
Comprehension questions:
Laura didn’t want to go to the other side of town.  T / F
Laura was scared.  T / F
The house on the hill was a popular place for trick-or-treating.  T / F
There was an ..................................................... inside the house.
Laura wanted to go ..................................................... .
Darren had some ..................................................... inside his bag.
Why did they start running?
 .................................................................................................................................
What happened when they jumped over the gate?
 .................................................................................................................................
What did the police officer tell them about the house?
 .................................................................................................................................
12 Listen and check your answers.
Page 26–27
WRITING
Writing a party invitation / a picture story
13 CHOICES
A
 You are going to have a Halloween party. Write an invitation to your friends.
 Write about:
 • when it is  • where it is  • what time it starts/finishes
 • what your friends should wear  • what your friends should bring
Don’t forget to add some Halloween pictures to make your invitation scary!
B
 Look at the pictures. Then write the story. Use the words in the box to help you.
Image Descriptions (from left to right, top to bottom):
Two children knocking on a door.
An old woman and a ghost.
A child receiving candy in a pumpkin bucket.
The old woman holding a finger to her lips saying “Wait!”
A monster behind the woman.
Children running away screaming.
Story prompt:
 On Halloween, two children
 knocked on the door ...
 An old woman ...
 She looked like ...
 The children said: "..."
 The old woman said: "..."
 She went back ...
 After some minutes, she ...
 Behind her were ...
 They laughed and shouted: "..."
 The children ...
LISTENING & DIALOGUE WORK
Talking about Halloween
14
a Listen and write the names under the pictures.
Names: Jenny, Will, Oliver
Picture Descriptions (from left to right):
A person in a ghost costume.
A child dressed as a witch.
A child dressed as a vampire.
b Listen again and choose the correct answers.
What day is Halloween?
 ☐ Thursday ☐ Friday ☐ Saturday
What time does Jenny need to be home?
 ☐ 9 p.m. ☐ 9:30 p.m. ☐ 10 p.m.
How many people are going trick-or-treating?
 ☐ three ☐ four ☐ five
What day is it now?
 ☐ Tuesday ☐ Friday ☐ Wednesday
What number does Mrs Green live at?
 ☐ 12 ☐ 13 ☐ 14
Who is in hospital?
 ☐ Mrs Green ☐ Mrs Green’s mother ☐ Mr Green
15 CHOICES
A
 Put the dialogue in the correct order. Then listen and check.
Lines to order:
 ☐ Tim  OK, see you then. Bye.
 ☐ Tim  Can I go trick-or-treating, Mum?
 ☐ Tim  What time should I be home?
 ☐ Tim  Ian and Zoe.
 ☐ Mum That’s great. But please don’t be back too late.
 ☐ Mum Nine o’clock.
 ☐ Mum Of course you can. Who are you going with?
B
 Complete the dialogue with the sentences in the box. There are three you don’t need.
 Then listen and check.
Boxed sentences:
 And don’t stay out very late.
 Can we go now?
 Have we got another black hat?
 Thanks, Mum.
 That’s a lot of chocolate.
 Trick or treat, Aunt Melinda.
 Yes, I’ve got it, Mum. Can we go now?
Dialogue:
Mum  Let me look at you. Oh, great! You look nice and scary!
 Allie  Thanks. 1 ........................................................................................................................
 Mum  Yes, but be careful. Always stay with Jimmy.
 Allie  I know, Mum.
 Jimmy  Yeah, Mum, we know. Don’t worry.
 Mum  2 ........................................................................................................................
 Jimmy  Until ten. Is that OK?
 Mum  OK. And have you got your phone?
 Allie  3 ........................................................................................................................
 Mum  Yes, of course. Have fun.
 Jimmy  4 ........................................................................................................................
 Allie  Bye, Mum!
 Mum  And Jimmy? Have you got the bag for the sweets?
 Jimmy  Oh, Mum!
DIALOGUE WORK
Apologising / Expressing strong dislike
16
Put the dialogue in the correct order. Then listen and check.
Lines to order (Robin and Jay):
 ☐ Robin It’s your laptop. It’s broken.
 ☐ Robin I dropped my cup of coffee on it.
 ☐ Robin I know. I feel so bad about it.
 ☐ Robin I’m really sorry.
 ☐ Robin Jay. Erm. I’ve got something to tell you.
 ☐ Jay  You dropped your cup of coffee on it? You fool!
 ☐ Jay  What!? It’s broken?
 ☐ Jay  What is it?
 ☐ Jay  But how could you do that?
Page 28
WORD FILE
Halloween
Image Description:
 The image shows a colorful Halloween street scene with many children and adults in costume. Labels point to specific characters and items:
A witch is standing on the left, handing out something.
A child dressed as a ghost is trick-or-treating with a pumpkin bucket.
Another child is dressed as a vampire.
In the middle, children are saying trick or treat.
On the right side, people are playing apple bobbing.
A child wearing a mask is walking on the far right.
MORE Words and Phrases
	English Word or Phrase	Example Sentence	German Translation
	tradition	What’s your favourite Halloween tradition?	Tradition
2	to fear	We do not fear the zombies.	(sich) fürchten (vor)
3	to cut off	We cut off the top of the pumpkin.	abschneiden
	front window	We put some vampire stickers on his front window.	Vorderfenster
	to keep	Let’s keep the pumpkin for our Halloween party.	(be-)halten
	to be proud (of)	I was very proud.	stolz sein (auf)
	stairs	We walk up the stairs in the dark.	Treppe
	sticker	I put a vampire sticker on his window.	Aufkleber, Sticker
	sweets	Children get sweets for Halloween.	Süßigkeiten
	Trick or treat!	We knock on people’s doors and say “Trick or treat!”.	Süßes oder Saures (Frage beim Halloween-Umzug)
4	knife (pl knives)	I need a knife to cut vegetables.	Messer
5	century	She was dressed like a girl from the 19th century.	Jahrhundert
	costume	Her costume looks great. She looks like a real vampire.	Kostüm
	couldn’t	Laura couldn’t stop.	konnte/n nicht
	cute	Look at my cat. Isn’t it cute?	niedlich, süß
	dress	The dress is beautiful. You can wear it to the party.	Kleid
	graveyard	The house is next to the graveyard.	Friedhof
	myself	I often talk to myself.	mich selbst, mir selbst
	shall	Where shall we go?	sollen; wollen
	sick	I feel a bit sick. I ate too many sweets.	übel; krank
	superheroine	She was dressed up as her favourite superheroine.	Superheldin
14	wild	You shouldn’t play many wild games.	wild
15	to scare	At Halloween, some costumes really scare me.	Angst machen, erschrecken
T1	cycle helmet	You should always wear a cycle helmet.	Fahrradhelm
	guys	Come on, guys. Don’t look. Promise.	Leute
	to lose	I don’t want to lose my phone.	verlieren
	picnic	Let’s have a picnic in the park.	Picknick

```

## Output contract

Write `content/corpus/units/g2-u03/gen/grammar.draft.json`:

```jsonc
{
  "schema": "grammar-draft@1",
  "slug": "g2-u03",
  "briefBank": "6dc22386a63c",
  "briefPrompt": "4b9164076103",
  "items": [
    {
      "structureId": "g2u03.s.should",
      "format": "gap-fill",             // gap-fill|multiple-choice|context-picker|translation|error-correction|transformation|question-formation|free-form|sentence-building|matching|anagram|group-sort|matching-pairs
      "difficulty": 1,
      "prompt": { "text": "…", "lang": "en", "blanks": 1 },
      "answers": [{ "text": "…", "tier": "full" }],
      "direction": null,                 // REQUIRED ("deToEn"|"enToDe") iff format=translation
      "distractors": [], "pairs": [], "groups": [],
      "hintDe": "…", "hintEn": null,
      "explainDe": "…", "explainEn": null,
      "strict": false,                   // true for minimal pairs (should/shouldn't!)
      "gloss": [],
      "gameMeta": null,                  // REQUIRED for multiple-choice, context-picker, sentence-building
      "seedV1": null, "sbRef": null, "note": null
    }
  ]
}
```

Do NOT include ids — the pipeline mints them. No two items may share the same carrier+answers (duplicates are rejected).
