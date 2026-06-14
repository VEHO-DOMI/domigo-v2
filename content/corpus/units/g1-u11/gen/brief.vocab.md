# Vocab generation brief — g1-u11 (MORE! 1, Unit 11)

<!-- domigo:gen vocab g1-u11 bank=5c3fc203cee7 prompt=346902f9f0f1 -->

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
| g1u11.w.9-a-m | 9 a.m. | 9 Uhr morgens | wordfile | — | — | — | 9 a.m. ; 9 ; a.m. |
| g1u11.w.midday | midday | Mittag | wordfile | — | — | — | midday |
| g1u11.w.9-p-m | 9 p.m. | 9 Uhr abends | wordfile | — | — | — | 9 p.m. ; 9 ; p.m. |
| g1u11.w.midnight | midnight | Mitternacht | wordfile | — | — | — | midnight |
| g1u11.w.9-o-clock | 9 o'clock | 9 Uhr | wordfile | — | — | — | 9 o'clock ; 9 ; o'clock |
| g1u11.w.quarter-past-nine | (a) quarter past nine | Viertel nach neun | wordfile | — | — | — | quarter past nine ; quarter past nine a |
| g1u11.w.half-past-nine | half past nine | halb zehn | wordfile | — | — | — | half past nine |
| g1u11.w.quarter-to-ten | (a) quarter to ten | Viertel vor zehn | wordfile | — | — | — | quarter to ten ; quarter to ten a |
| g1u11.w.to-ride-a-bike | to ride a bike | Fahrrad fahren | wordfile | — | — | ride a bike | to ride a bike ; ride a bike |
| g1u11.w.to-watch-tv | to watch TV | fernsehen | wordfile | — | — | watch TV | to watch TV ; watch TV |
| g1u11.w.to-play-football | to play football | Fußball spielen | wordfile | — | — | play football | to play football ; play football |
| g1u11.w.to-play-computer-games | to play computer games | Computerspiele spielen | wordfile | — | — | play computer games | to play computer games ; play computer games |
| g1u11.w.to-play-the-piano | to play the piano | Klavier spielen | wordfile | — | — | play the piano | to play the piano ; play the piano |
| g1u11.w.to-ride-a-horse | to ride a horse | reiten | wordfile | — | — | ride a horse | to ride a horse ; ride a horse |
| g1u11.w.to-skateboard | to skateboard | Skateboard fahren | wordfile | — | — | skateboard | to skateboard ; skateboard |
| g1u11.w.to-cook | to cook | kochen | wordfile | — | — | cook | to cook ; cook |
| g1u11.w.to-ride-a-scooter | to ride a scooter | Roller fahren | wordfile | — | — | ride a scooter | to ride a scooter ; ride a scooter |
| g1u11.w.to-ski | to ski | Ski fahren | wordfile | — | — | ski | to ski ; ski |
| g1u11.w.to-snowboard | to snowboard | snowboarden | wordfile | — | — | snowboard | to snowboard ; snowboard |
| g1u11.w.to-skate | to skate | Schlittschuh laufen | wordfile | — | — | skate | to skate ; skate |
| g1u11.w.daily | daily | täglich | phrase | — | At 7 a.m., I do my daily exercise. | — | daily |
| g1u11.w.free-time | free time | Freizeit | phrase | — | I like to read comics in my free time. | — | free time |
| g1u11.w.what-s-the-time | What's the time? | Wie spät ist es? | phrase | — | — | — | What's the time? |
| g1u11.w.excuse-me | Excuse me. | Entschuldigen Sie bitte. ; Entschuldigung. | phrase | — | — | — | Excuse me. |
| g1u11.w.to-hurry | to hurry | sich beeilen | phrase | — | We're late. Let's hurry. | hurry | to hurry ; hurry |
| g1u11.w.clock | clock | Uhr | phrase | — | My clock shows the wrong time. | — | clock |
| g1u11.w.it-s-10-a-m | It's 10 a.m. | Es ist 10 Uhr morgens/vormittags. | phrase | — | — | — | It's 10 a.m. |
| g1u11.w.it-s-8-p-m | It's 8 p.m. | Es ist 8 Uhr abends. | phrase | — | — | — | It's 8 p.m. |
| g1u11.w.what-time-is-it | What time is it? | Wie spät ist es? | phrase | — | — | — | What time is it? |
| g1u11.w.bedtime | bedtime | Schlafenszeit | phrase | — | Bedtime is at ten o'clock. | — | bedtime |
| g1u11.w.break | break | Pause | phrase | — | At a quarter to nine, I have a break. | — | break |
| g1u11.w.exercise | exercise | Übung ; (körperliche) Bewegung | phrase | — | At a quarter to ten, we do our daily exercise. | — | exercise |
| g1u11.w.to-go-to-bed | to go to bed | schlafen gehen | phrase | — | I go to bed at nine o'clock. | go to bed | to go to bed ; go to bed |
| g1u11.w.to-go-to-school | to go to school | in die Schule gehen | phrase | — | Sarah goes to school at a quarter to eight. | go to school | to go to school ; go to school |
| g1u11.w.outside | outside | draußen ; außerhalb | phrase | — | We always do our exercise outside. | — | outside |
| g1u11.w.to-study | to study | lernen ; studieren | phrase | — | I study art and drawing. | study | to study ; study |
| g1u11.w.to-wake-somebody-up | to wake somebody up | jemanden aufwecken | phrase | — | My dad plays a loud song to wake me up. | wake somebody up | to wake somebody up ; wake somebody up |
| g1u11.w.amazing | amazing | erstaunlich ; großartig | phrase | — | I want to show you something amazing! | — | amazing |
| g1u11.w.to-answer-the-door | to answer the door | die Tür aufmachen | phrase | — | There's a knock at the door. Suzy answers the door. | answer the door | to answer the door ; answer the door |
| g1u11.w.bush | bush | Busch | phrase | — | Let's hide behind the bush. | — | bush |
| g1u11.w.have-fun | Have fun! | Viel Spaß! | phrase | — | — | — | Have fun! |
| g1u11.w.to-hide | to hide | (sich) verstecken | phrase | — | Tim is hiding in the bushes. | hide | to hide ; hide |
| g1u11.w.knock | knock | Klopfen | phrase | — | There's a knock at the door. | — | knock |
| g1u11.w.living-room | living room | Wohnzimmer | phrase | — | She is watching TV in the living room. | — | living room |
| g1u11.w.surprise | surprise | Überraschung | phrase | — | Tim has got a surprise for Suzy. | — | surprise |
| g1u11.w.to-push | to push | schieben ; drücken | phrase | — | The cat pushes the skateboard down the park. | push | to push ; push |
| g1u11.w.to-cook-2 | to cook | kochen | phrase | — | My mum cooks great spaghetti. | cook | to cook ; cook |
| g1u11.w.text-message | text message | Textnachricht ; SMS | phrase | — | He's sending a text message. | — | text message |
| g1u11.w.to-look-after | to look after | sich kümmern | phrase | — | She's looking after her cat. | look after | to look after ; look after |
| g1u11.w.road | road | Straße ; Weg | phrase | — | I'm walking down the road. | — | road |
| g1u11.w.place | place | Ort ; Platz ; Wohnung ; Zuhause | phrase | — | Can you come to my place? | — | place |
| g1u11.w.programme | programme | Programm ; Sendung | phrase | — | I'm watching a great TV programme. | — | programme |
| g1u11.w.clue | clue | Hinweis ; Tipp | phrase | — | I don't know. Give me a clue. | — | clue |
| g1u11.w.see-you-soon | See you soon. | Bis bald. | phrase | — | — | — | See you soon. |
| g1u11.w.to-snow | to snow | schneien | phrase | — | It's snowing outside. | snow | to snow ; snow |
| g1u11.w.weather | weather | Wetter | phrase | — | I hope the weather is nice tomorrow. | — | weather |
| g1u11.w.half-an-hour | half an hour | eine halbe Stunde | phrase | — | I read for half an hour every evening. | — | half an hour |
| g1u11.w.hurry-up | Hurry up. | Beeil dich. / Beeilt euch. | phrase | — | — | — | Hurry up. |

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

## v1 seeds (UNTRUSTED — mine for ideas, never copy unverified)

Known v1 defect classes: invented above-level carrier words, out-of-bank MC distractors, over-strict answers.

- `g1u11.w.9-a-m` ← v1 `9 a.m.`: d="nine o'clock in the morning" · s="School starts at _____ sharp in the morning, so we must be in the classroom by then." · a=[] · mc=["9 p.m.","midnight","midday"]
- `g1u11.w.midday` ← v1 `midday`: d="twelve o'clock in the middle of the day" · s="We eat lunch at _____ when the clock shows exactly twelve o'clock in the middle of the day." · a=[] · mc=["midnight","breakfast time","bedtime"]
- `g1u11.w.9-p-m` ← v1 `9 p.m.`: d="nine o'clock in the evening" · s="My favourite late TV show is on at _____ in the evening after dinner when it is dark outside." · a=[] · mc=["9 a.m.","midday","breakfast time"]
- `g1u11.w.midnight` ← v1 `midnight`: d="twelve o'clock at night" · s="On New Year's Eve, we stay awake until _____ — 12 o'clock at night — and then shout 'Happy New Year!'" · a=[] · mc=["midday","early morning","afternoon"]
- `g1u11.w.9-o-clock` ← v1 `9 o'clock`: d="the time when it is exactly nine" · s="The evening film starts at _____ exactly, so we must take our seats by then in the cinema." · a=[] · mc=["midnight","early morning","breakfast time"]
- `g1u11.w.quarter-past-nine` ← v1 `quarter past nine`: d="fifteen minutes after nine" · s="It is _____ — 15 minutes after 9 — so we are late for school which started at 9." · a=[] · mc=["quarter to nine","half past nine","nine o'clock"]
- `g1u11.w.half-past-nine` ← v1 `half past nine`: d="thirty minutes after nine" · s="I finish my breakfast at _____ — that is 30 minutes after 9." · a=[] · mc=["quarter past nine","quarter to ten","nine o'clock"]
- `g1u11.w.quarter-to-ten` ← v1 `quarter to ten`: d="fifteen minutes before ten" · s="It is _____ — 15 minutes before 10 — and the shop closes at ten, so we must hurry." · a=[] · mc=["quarter past ten","half past ten","ten o'clock"]
- `g1u11.w.to-ride-a-bike` ← v1 `to ride a bike`: d="to travel on a bicycle" · s="I like to _____ with two wheels and pedals in the park on Sundays." · a=[] · mc=["to drive a car","to ride the bus","to take a taxi"]
- `g1u11.w.to-watch-tv` ← v1 `to watch TV`: d="to look at programmes on television" · s="After dinner, we _____ together as a family on the sofa in the living room." · a=[] · mc=["to go to sleep","to do homework","to eat dinner"]
- `g1u11.w.to-play-football` ← v1 `to play football`: d="to play a game where you kick a ball" · s="The boys _____ with a round black-and-white ball on the green field every day after school." · a=[] · mc=["to sing songs","to read books","to paint pictures"]
- `g1u11.w.to-play-computer-games` ← v1 `to play computer games`: d="to play games on a computer" · s="My older brother likes to _____ on his console with a handheld controller in his free time." · a=[] · mc=["to play outside","to play music","to play tag"]
- `g1u11.w.to-play-the-piano` ← v1 `to play the piano`: d="to make music on a piano" · s="She can _____ beautifully because she practises on her black and white keys an hour every day." · a=[] · mc=["to sing opera","to paint pictures","to speak French"]
- `g1u11.w.to-ride-a-horse` ← v1 `to ride a horse`: d="to sit on a horse and move" · s="My older sister goes to a countryside farm every Sunday to _____ in the riding school." · a=[] · mc=["to ride a bike","to ride a scooter","to drive a car"]
- `g1u11.w.to-skateboard` ← v1 `to skateboard`: d="to ride on a small wooden board with four wheels" · s="He likes to _____ on his wooden board with four wheels in the park with his friends." · a=[] · mc=["to swim","to read","to sing"]
- `g1u11.w.to-cook` ← v1 `to cook`: d="to make food in the kitchen" · s="My dad likes to _____ spaghetti pasta with tomato sauce for dinner on Wednesdays." · a=[] · mc=["to eat","to clean","to serve"]
- `g1u11.w.to-ride-a-scooter` ← v1 `to ride a scooter`: d="to travel on a scooter" · s="She likes to _____ with two small wheels and one foot pushing off the ground, to the shops." · a=[] · mc=["to fly","to swim","to drive"]
- `g1u11.w.to-ski` ← v1 `to ski`: d="to go down snow on skis" · s="In winter we go up to the snowy mountains to _____ down the slopes on two long thin boards." · a=[] · mc=["to swim","to sail","to surf"]
- `g1u11.w.to-snowboard` ← v1 `to snowboard`: d="to ride a board on snow" · s="He learns to _____ down the mountain on one wide board with both feet strapped on during the winter holidays." · a=[] · mc=["to walk","to cycle","to run"]
- `g1u11.w.to-skate` ← v1 `to skate`: d="to move on ice with special shoes" · s="We go to the ice rink with blades under our feet to _____ smoothly across the frozen surface every Saturday." · a=[] · mc=["to swim","to run","to jump"]
- `g1u11.w.daily` ← v1 `daily`: d="happening every day" · s="Walking our pet dog is my _____ job — I do it every single day before school without fail." · a=[] · mc=["weekly","monthly","yearly"]
- `g1u11.w.free-time` ← v1 `free time`: d="time when you can do what you want" · s="In my _____, when I don't have school or homework, I like to read books and draw pictures." · a=[] · mc=["school time","lesson time","test time"]
- `g1u11.w.what-s-the-time` ← v1 `What's the time?`: d="asking what the clock shows" · s="_____ — It's half past three in the afternoon now." · a=[] · mc=["What day is it?","How are you?","Where are you?"]
- `g1u11.w.excuse-me` ← v1 `Excuse me.`: d="a polite way to get someone's attention" · s="_____ Where is the train station from here? I am a tourist." · a=[] · mc=["Goodbye.","Thank you.","Sorry."]
- `g1u11.w.to-hurry` ← v1 `to hurry`: d="to move or do something fast" · s="We are very late for school and it starts in two minutes. We must _____ and run fast!" · a=[] · mc=["to stop","to sit down","to rest"]
- `g1u11.w.clock` ← v1 `clock`: d="a thing on the wall that shows the time" · s="I looked at the wall _____ with hands pointing to numbers and saw it was already noon." · a=[] · mc=["calendar","map","book"]
- `g1u11.w.it-s-10-a-m` ← v1 `It's 10 a.m.`: d="telling someone the morning time" · s="_____ in the morning and the maths lesson is starting right now at school." · a=[] · mc=["It's 10 p.m.","It's midnight.","It's bedtime."]
- `g1u11.w.it-s-8-p-m` ← v1 `It's 8 p.m.`: d="telling someone the evening time" · s="_____ in the evening and the young children are getting into their pyjamas ready for bed." · a=[] · mc=["It's 8 a.m.","It's early morning.","It's breakfast time."]
- `g1u11.w.what-time-is-it` ← v1 `What time is it?`: d="asking what the clock shows now" · s="_____ I don't want to be late for the doctor's appointment at 4 o'clock!" · a=[] · mc=["What day is it?","What's your name?","How old are you?"]
- `g1u11.w.bedtime` ← v1 `bedtime`: d="the time when you go to sleep" · s="It is nine o'clock at night, so it is _____ for the young children. They must brush teeth and sleep." · a=[] · mc=["playtime","breakfast time","school time"]
- `g1u11.w.break` ← v1 `break`: d="a time to stop and rest" · s="Let's have a short _____ from studying and eat our sandwiches in the yard for fifteen minutes." · a=[] · mc=["lesson","exam","test"]
- `g1u11.w.exercise` ← v1 `exercise`: d="moving your body to stay healthy" · s="Running around the park and swimming in the pool are good kinds of _____ for your body." · a=[] · mc=["sleep","rest","sitting"]
- `g1u11.w.to-go-to-bed` ← v1 `to go to bed`: d="to get into bed to sleep" · s="I always _____ at exactly nine o'clock on school nights so I get enough sleep for the next day." · a=[] · mc=["to get up","to wake up","to get dressed"]
- `g1u11.w.to-go-to-school` ← v1 `to go to school`: d="to travel to school each day" · s="My little brother _____ by yellow bus every weekday morning to learn maths and English." · a=[] · mc=["to go home","to go shopping","to go swimming"]
- `g1u11.w.outside` ← v1 `outside`: d="not inside a building" · s="The warm sun is shining and the birds are singing. Let's play ball games _____ in the garden!" · a=[] · mc=["inside the house","in bed","in the cellar"]
- `g1u11.w.to-study` ← v1 `to study`: d="to learn about something" · s="I need to _____ my English vocabulary and grammar for the big test tomorrow morning." · a=[] · mc=["to play","to rest","to ignore"]
- `g1u11.w.to-wake-somebody-up` ← v1 `to wake somebody up`: d="to make someone stop sleeping" · s="My mum has to _____ my little brother every morning at seven because he sleeps deeply." · a=[] · mc=["to put to bed","to leave alone","to sing a lullaby to"]
- `g1u11.w.amazing` ← v1 `amazing`: d="very good and surprising" · s="The fireworks in the sky last night were _____! The best show I have ever seen." · a=[] · mc=["boring","ordinary","terrible"]
- `g1u11.w.to-answer-the-door` ← v1 `to answer the door`: d="to open the door when someone knocks" · s="Someone is knocking on the front door right now. Can you please _____?" · a=[] · mc=["to lock the door","to break the door","to paint the door"]
- `g1u11.w.bush` ← v1 `bush`: d="a small tree with many branches" · s="The small cat is hiding behind the big green leafy _____ in the garden. I can only see its tail." · a=[] · mc=["lamp post","fence","gate"]
- `g1u11.w.have-fun` ← v1 `Have fun!`: d="wishing someone a good time" · s="You are going to the zoo with your class? _____ I hope you see the lions and elephants!" · a=[] · mc=["Bad luck!","Too bad!","What a shame!"]
- `g1u11.w.to-hide` ← v1 `to hide`: d="to go where nobody can see you" · s="Let's play a game. Close your eyes for thirty seconds and I will _____ behind the big tree where you cannot see me." · a=[] · mc=["to show myself","to stand in front","to run in a circle"]
- `g1u11.w.knock` ← v1 `knock`: d="the sound when someone hits a door" · s="I heard a loud _____ — tap tap tap — at the front door. Someone was banging their fist." · a=[] · mc=["whisper","song","silence"]
- `g1u11.w.surprise` ← v1 `surprise`: d="something you did not expect" · s="Close your eyes and don't peek — I have a wonderful _____ present hidden behind my back for you!" · a=[] · mc=["punishment","problem","lesson"]
- `g1u11.w.to-push` ← v1 `to push`: d="to move something away from you" · s="Please _____ the heavy door with both hands to open it — it won't move the other way." · a=[] · mc=["to pull","to close","to lock"]
- `g1u11.w.to-cook-2` ← v1 `to cook`: d="to make food in the kitchen" · s="My dad likes to _____ spaghetti pasta with tomato sauce for dinner on Wednesdays." · a=[] · mc=["to eat","to clean","to serve"]
- `g1u11.w.text-message` ← v1 `text message`: d="a short message you send from a phone" · s="I got a short _____ on my phone from my friend about the birthday party this Saturday." · a=[] · mc=["video call","photo album","phone ring"]
- `g1u11.w.to-look-after` ← v1 `to look after`: d="to take care of someone or something" · s="Can you _____ my pet dog — feed him and walk him — while I am on holiday for one week?" · a=[] · mc=["to ignore","to lose","to forget about"]
- `g1u11.w.road` ← v1 `road`: d="a way for cars and people to travel on" · s="Look carefully to the left and then the right before you cross the busy _____ with cars." · a=[] · mc=["garden","field","forest"]
- `g1u11.w.place` ← v1 `place`: d="a home or a location" · s="Come to my _____ — my house — after school today. We can play video games in my bedroom." · a=[] · mc=["school","office","hospital"]
- `g1u11.w.programme` ← v1 `programme`: d="a show on TV or radio" · s="There is a funny nature _____ on TV tonight at 7 o'clock about African animals." · a=[] · mc=["book","magazine","advert"]
- `g1u11.w.clue` ← v1 `clue`: d="a hint that helps you find an answer" · s="I cannot guess the answer to the riddle. Please give me a _____ — a small hint — to help me." · a=[] · mc=["full answer","long explanation","complete solution"]
- `g1u11.w.see-you-soon` ← v1 `See you soon.`: d="saying you will meet again quickly" · s="I have to go now to catch my bus home. _____! I will call you tomorrow!" · a=[] · mc=["Hello!","Welcome!","Nice to meet you!"]
- `g1u11.w.to-snow` ← v1 `to snow`: d="when white ice falls from the sky" · s="Look outside the window! It is _____ and the garden is slowly turning white with soft flakes." · a=[] · mc=["to rain","to shine","to blow"]
- `g1u11.w.weather` ← v1 `weather`: d="if it is sunny, rainy, cold, or warm" · s="The _____ is very nice and sunny today, so let's go to the park for a picnic." · a=[] · mc=["news","music","food"]
- `g1u11.w.half-an-hour` ← v1 `half an hour`: d="thirty minutes" · s="The next bus comes in exactly _____ — thirty minutes from now — so we must wait." · a=[] · mc=["five minutes","three hours","a whole day"]
- `g1u11.w.hurry-up` ← v1 `Hurry up.`: d="telling someone to be faster" · s="_____! The train leaves the station in five minutes and we are still walking!" · a=[] · mc=["Slow down.","Stop.","Sit down."]

## Unit transcripts (textbook sentences live here — use them first)

```
----- SB: SB Unit 11- What's the time?.txt -----
Page 82
Unit 11: What's the time?
At the end of unit 11 ...
you know ☐ how to tell the time ☐ 11 words for free time activities ☐ how to use the present continuous
you can ☐ ask and answer what time it is ☐ ask and talk about what someone is doing right now ☐ understand and talk about daily routines ☐ write a postcard ☐ write a text message
VOCABULARY Time
3/23 🔊 1 Match the times with the pictures. Then listen and check.
1 It's twenty-five past three. 5 It's five to four. 9 It's twenty to four. 2 It's three o'clock. 6 It's twenty-five to four. 10 It's ten to four. 3 It's a quarter to four. 7 It's five past three. 11 It's half past three. 4 It's ten past three. 8 It's twenty past three. 12 It's a quarter past three.
[Image description: 12 watches and clocks labeled A through L showing different times. A and F are pink analog watches, B is a yellow digital watch showing 15:05, C is a green analog watch, D is a phone showing 15:15, E is a digital alarm clock showing 15:20, G is a yellow digital watch showing 15:30, H is a tan analog watch, I is an orange smartwatch showing 15:40, J is a red analog watch, K is a blue digital watch showing 15:50, L is a white analog watch]
👥 2 Work in pairs. Cover the times in 1. Ask and answer.
[Image description: Photo of students studying together with speech bubbles showing "What's the time?" and "It's twenty to four."]
🔵 WB p. 93, 94 🌐 CYBER Homework 31 (Revision)
Page 83
SPEAKING Asking and telling the time
3/24 🔊 3 Listen and write the numbers.
[Image description: Illustration showing 8 clocks labeled A-H on two shelves, displaying various times in both analog and digital formats]
4 C H O I C E S
Note a.m. – p.m. a.m. – from midnight to 12 midday p.m. – from 12 midday to midnight
👥 A Say what the clocks show.
In Vienna it's three o'clock in the afternoon. In New York it's nine o'clock in the morning. In ...
[Image description: Airport departure scene showing clocks for different cities - Sydney, Tokyo, Vienna, London, and New York, with travelers waiting at Gate 8]
👥 B Ask and answer questions about the places in A.
It's 1 p.m. in Vienna. What's the time in New York?
It's 7 a.m.
Asking for the time
So kannst du im Englischen nach der Zeit fragen:
Excuse me, what time is it? oder Excuse me, what's the time?
🔵 WB p. 94
Page 84
READING & SPEAKING
5 Read the texts about Mary and Li.
A day in the life of Mary and Li
Hi! I'm Mary, I live in Australia.
I live on a farm with my family. I get up at half past five. My father and I feed the animals at six o'clock. At a quarter to seven, I have breakfast with my mother and brothers. I don't go to school – I have school at home because there aren't any schools near us. My mother is the teacher. She teaches me and my two brothers. I start home schooling at half past seven. At a quarter to nine, I have a break. I like to go and watch the horses or read a book. At half past ten, I study art or drawing. Lunchtime is at twelve o'clock. Homeschool finishes at half past two or three o'clock. Once a week
[Image description: Photo of girl with horse]
I go shopping in town with my brothers and see my friends. Our family has dinner at half past seven. In the evening, I go online and play games with friends or watch shows on the internet. I go to bed at nine o'clock.
Hello! My name is Li, I live in China.
My mother and father work a long way away, so I live at my school. I get up at a quarter to seven. The school plays a very loud song to wake us up! I sleep in a room with six people. At half past seven, I have breakfast in the canteen. At eight o'clock, I go to my classroom for self-study*. Classes start at ten to nine. At a quarter to ten, we do our daily exercise* outside. Sometimes it's very cold! I have lunch at one o'clock.
[Image description: Photo of boy jogging outdoors]
At five to two, we do eye exercises! It helps us study. Afternoon classes start at two o'clock. At a quarter to five, I have extra class – my extra class is for English reading. After extra class, I help to clean the classroom and dorm room*. At ten past six, I have free time and then dinner. At twenty past seven, I go to my classroom for self-study and homework. Bedtime is at ten o'clock.
Fact box Children in China do eye exercises in school. They massage their eyes to help them in class!
[Image description: Photos showing children doing eye exercises]
VOCABULARY: *self-study – Eigenstudium; daily exercise – tägliche Bewegung/Betätigung; dorm room – Schlafsaal
6 How many of these tasks can you do?
1 Mary lives in Austria. T / F 2 In the morning, Mary feeds the animals. T / F 3 Mary's brother is her teacher. T / F
4 Mary has lunch at ................................................................................... o'clock. 5 Li gets up at ................................................................................... seven. 6 At ................................................................................... o'clock, Li goes to his classroom.
7 At a quarter to ten, Li studies English / goes outside for exercise / has a snack. 8 To help Li study, he sleeps in the afternoon / plays games outside / does eye exercises. 9 After dinner, Li does his homework / talks with his friends / goes to bed.
💬 7 Check your answers with a partner. Say six sentences about your day.
I get up at ... At ... I have breakfast. I go to school at ... I come home from school at ... Dinner is at ... I go to bed at ...
🔵 WB p. 97, 98
Page 85
READING & LISTENING
3/25 🔊 8 Read the first part of the story. Then listen to it.
A surprise for Suzy
It's half past ten on Saturday morning. Suzy is sitting in the living room with her mum. Suzy is playing with her phone. Her mum is watching TV. There's a knock at the door.
[Image description: Illustration showing Suzy at door with her friend Tim who has a skateboard]
"Answer the door, Suzy!" says her mum, "I'm watching TV!"
Suzy goes to the door and opens it. It's her friend, Tim, with a skateboard.
"Hi, Suzy! Can you come to the park? I want to show you something!"
"What?"
"Something amazing!"
"OK ... Mum? Can I go out with Tim, please?"
"OK, but come back at one o'clock!" says her mum.
Suzy and Tim walk down the street. It's a nice day and Suzy is happy. She sees her friend John walking his dog*.
"Hi, Suzy! What are you doing?" asks John. "Hi, John! We're going to the park," says Suzy.
"Have fun!" says John.
Suzy walks to the park with Tim. Tim stands next to a big tree.
"What are you doing, Tim?" "Sshhh! Watch ..."
Tim puts the skateboard next to the tree. "OK! Let's go over here ..." "And?"
"And hide behind the bush ... look ... it's coming ...!"
[Image description: Illustration showing Tim and Suzy hiding behind a tree watching a skateboard, with playground equipment in background]
VOCABULARY: *walk a dog – mit einem Hund Gassi gehen
9 How many of these tasks can you do?
1 It's half past ten in the morning. T / F 2 Suzy is watching TV. T / F 3 Tim wants to go to town. T / F
4 Suzy walks to the park with her mum / Tim / John. 5 The skateboard is in the tree / next to the tree / in a bush. 6 Suzy and Tim hide in the tree / behind a bush / under a slide*. VOCABULARY: *slide – Rutsche
3/26 🔊 10 What do you think happens next? Now listen to the end of the story.
3/26 🔊 11 Listen to the end of the story again and answer the questions.
1 How does Tim feel? ........................................................................................................................... 2 What do Tim and Suzy see? ............................................................................................................... 3 What is Suzy doing? ...........................................................................................................................
12 Check your answers with a partner.
🔵 WB p. 98 🌐 CYBER Homework 32
Page 86
VOCABULARY Free time activities
3/27 🔊 13 Listen and number the pictures.
[Image description: Illustration showing 11 labeled activities A-K including rollerblading, watching TV, reading, riding a horse, playing video games, cycling, playing piano, playing football, cooking, and skateboarding]
14 Complete and match.
riding watching sending making cooking playing looking after
[Image description: 7 silhouettes numbered 1-7 showing different activities]
⑤ She's .........looking after........... her cat. ☐ She's ........................................... her bike. ☐ They're ........................................... football. ☐ She's ........................................... a video. ☐ He's ........................................... spaghetti. ☐ He's ........................................... a text ☐ They're ........................................... TV. message.
🔵 WB p. 93, 94
Page 87
3/28 🔊 15 Listen and number the sentences.
☐ She's playing a computer game. ☐ He's skating. ☐ She's sending a text message. ☐ He's riding his bike. ☐ They're playing football. ☐ They're playing the piano. ☐ She's riding a horse. ☐ He's looking after his cat. ① He's cooking an egg. ☐ She's skateboarding.
3/29 🔊 16 Listen and check.
A SONG 4 U
3/30+31 🔊 17 Listen and sing.
Waiting ...
[Image description: Two illustrations - one showing person waiting outside with phone, another showing person in bedroom with laptop]
I'm walking down the road. I'm looking at the trees. I'm waiting for your call. I'm thinking, call me please.
But you don't, don't, don't. You don't call me. Tell me why, why, why. I am waiting. Can't you see? Tell me why, why, why. I am waiting. Can't you see?
I'm sitting in my room. I'm watching some TV. I'm waiting for your call. I'm thinking, call me please.
But you don't, don't, don't ...
We're waiting. Yes, we're waiting. That's all there is to say. We're waiting. Yes, we're waiting. But no one calls today.
SPEAKING Asking/Talking about what someone is doing
👥 18 In groups, mime and guess activities.
[Image description: Photo of three students in classroom with speech bubbles saying "Are you cooking an egg?", "No, I'm not.", and "Are you cooking spaghetti?" with response "Yes, I am."]
🔵 WB p. 95
Page 88
19 C H O I C E S
3/32 🔊 A Listen to the phone conversation. Act it out in pairs.
👥
Jenny Hi, Jenny here. Billy Hi, Jenny. Jenny What are you doing? Billy I'm playing Dragon Hunt II. Can you come over? Jenny Sorry, I can't. Billy Why not? What are you doing? Jenny I'm playing Dragon Hunt III. Billy Oh! Can I come to your place? Jenny Sure.
[Image description: Photo of two young people on phone calls]
👥 B Practise phone conversations. Use your own ideas.
• TV programmes • Music • Computer games • ...
I'm watching ... . It's great / fantastic!
I'm listening to ... . It's great / fantastic!
I'm playing ... . It's great / fantastic!
👥 20 Work in pairs. Look at the pictures for a minute. Close your book and remember.
[Image description: Illustrations of various children doing activities, labeled as Jacob (on scooter), Vivian (playing sports), Ken (skateboarding), Lisa (watching TV), Jim and Barry (at table), Simon (studying), Emma (playing guitar), Sandra and Shannon (swimming)]
[Image description: Photo of two students with speech bubbles "What is Jacob doing?" / "I can't remember. Give me a clue." / "He's riding ..." / "He's riding a scooter."]
🔵 WB p. 99
Page 89
WRITING
21 Read Robert's postcard.
[Image description: Postcard showing snowy Alps mountains with chalet, titled "Greetings from the Alps"]
Dear Grandma, It's three o'clock in the afternoon. I'm sitting in a café and I'm drinking hot chocolate. It's nice and warm in here. It's very cold outside and it's snowing. Jack's snowboarding and Mum and Dad are skiing. We're having fun. See you soon, Robert
[Image description: Photo of hand writing on postcard]
Write your own holiday postcard.
Think about: • who you are writing to • the weather • where you are • the food you get there • what you are doing there • how to end your postcard
GRAMMAR
▶️ Present continuous
[THIS IS TABLE: Two-column table showing positive and negative forms of present continuous] + | – I'm (I am) helping my dad. | I'm (I am) not helping my mum. You're (You are) writing an email. | You aren't (You are not) writing a letter. Dana's (Dana is) watching TV. | Dana isn't (Dana is not) reading a book. He's (He is) looking at his mobile phone. | He isn't (He is not) playing football. We're (We are) cooking dinner. | We aren't (We are not) eating pizza. They're (They are) listening to music. | They aren't (They are not) watching TV.
[THIS IS TABLE: Question forms with positive and negative short answers] ? | + | – Are you playing a computer game?| Yes, I am. | No, I'm not. Is Peter doing his homework? | Yes, he is. | No, he isn't. Are Jennifer and Christine reading? | Yes, they are. | No, they aren't.
🔍 Was ist richtig? Mach ein Häkchen.
What are they doing now? They're having breakfast.
[Image description: Illustration showing people skiing with speech bubble "Mum and Dad are skiing."]
☐ Die Leute tun gerade etwas. ☐ Die Leute machen diese Handlungen jeden Tag.
⏪ Now go back to page 82. Check ☑ with a partner what you know / can do.
🔵 WB p. 95, 96, 97 🌐 CYBER Homework 33
Page 90
THE TWINS 5
▶️ The train ride
Developing speaking competencies
Language function | Speaking strategy ☐ I can tell someone to be quick (jemanden | ☐ I can ask someone to wait (jemanden auffordern, sich zu beeilen) | bitten zu warten)
VOCABULARY Means of transport
3/33 🔊 1 Look at the photos. Match the means of transport with the photos. Then listen and check.
1 bus 2 train 3 plane 4 taxi
[Image description: Four photos labeled A-D showing: A-taxi (black London cab), B-bus (red city bus), C-plane (commercial aircraft), D-train (high-speed train at platform)]
3/34 🔊 2 Watch or listen to the dialogue. Then read it. What means of transport do Lucy and Leo mention?
▶️
Leo Come on, Lucy. It's time to go. Lucy Just a minute. I can't find my sweater. Leo Your sweater? It's here it is. Lucy Thanks, Leo. Leo The bus leaves in ten minutes. Lucy What time is it now? Leo Quarter to three. Come on. Lucy Wait a moment. I can't find my trainers. Leo Your trainers? They're over there. Hurry up. Lucy OK, OK. What time is the train then?
[Image description: Photo of Lucy and Leo in their room with belongings]
Leo It leaves in 35 minutes. Get a move on. Lucy OK, OK. I'm ready. Let's go! Leo Phew!
3 Read the dialogue in 2 again. Then write the answers to the questions.
1 What time does the bus leave? ..................................................................................................... 2 What time does the train leave? .....................................................................................................
Page 91
USEFUL PHRASES Telling someone to be quick
4 Complete the phrases with the words from the box. Then check with the dialogue in 2.
up on on
1 Come ........................................, Lucy. It's time to go. 2 Hurry ......................................... . 3 Get a move ........................................ .
? What do you think? Answer the questions.
• Do they catch the bus? • Do they catch the train?
MOBILE HOMEWORK
▶️ Watch part 2 of the video. Complete the sentences with Lucy or Leo. Then check your answers to the questions above.
1 Lucy and Leo get to the bus stop. ............................................... is tired. 2 Then ............................................... has got a problem. The money is on the kitchen table. 3 ............................................... feels sorry.
SPEAKING STRATEGY Asking someone to wait
5 Look at 2 again. Complete with the correct words.
1 Leo Come on, Lucy. It's time to go. 2 Leo Come on. Lucy ......................................... minute. Lucy Wait ......................................... .
6 C H O I C E S
👥 A Work in pairs. Student A tells student B to hurry up. B asks him/her to wait. Use the words from the box.
train / leaves in half an hour bus / leaves in five minutes plane / leaves at two o'clock
A Hurry up, Tom. The train leaves in half an hour. B Just a minute. I can't find my shoes.
👥 B ROLE PLAY: Work in pairs. Look at the situation and the roles. Think of a play with a partner. Take two or three minutes to practise it. Don't write it down. Act it out in class.
Roles: You and your friend Situation: You and your friend want to get the bus and then the train. You tell your friend to hurry up, but your friend has got a lot of problems (he/she can't find things, is hungry, etc.) Your friend asks you to wait. You get more and more nervous.
🔵 WB p. 99


----- WB: WB Unit 11 What_s the time.txt -----
Unit 11 What's the time?
Pages 93-94
UNDERSTANDING VOCABULARY Time / Free time activities
1 Look at the clocks and number the sentences.
☐ It's twenty to eleven. ☐ It's a quarter past three. ☐ It's twenty-five past eleven. ☐ It's ten to nine. ☐ It's a quarter to nine. ☐ It's five past twelve. ☐ It's twenty-five to ten. ☐ It's ten past nine.
[8 images of different clocks and watches numbered 1-8, showing analog and digital displays]
2 Write the verbs from the box under the pictures.
[Word bank:] send ride play skateboard watch play skate ride cook play make
[Large illustration showing various activities with numbered spaces 1-11:]
............................ a horse [Image: person riding horse]
............................ computer games [Image: person at computer]
............................ a bike [Image: person riding bicycle]
............................ the piano [Image: person playing piano]
............................ TV [Image: person watching TV]
............................ [Image: person cooking]
............................ a video [Image: person with video device]
............................ [Image: person skateboarding]
............................ [Image: person skating]
............................ a text message [Image: person with phone]
............................ football [Image: people playing football]
Pages 94-95
USING VOCABULARY Time / Free time activities
3 Write the times under the clocks.
[12 different clocks showing various times - alarm clocks, pocket watches, wristwatches, and digital displays]
1 It's five o'clock. 2 ..................................... 3 ..................................... 4 ..................................... ..................................... ..................................... ..................................... .....................................
5 ..................................... 6 ..................................... 7 ..................................... 8 ..................................... ..................................... ..................................... ..................................... .....................................
9 ..................................... 10 ..................................... 11 ..................................... 12 ..................................... ..................................... ..................................... ..................................... .....................................
4 Choose five things from the box and write sentences that are true for you.
[Word bank:] text messages horse computer games skate skateboard bike piano video cook football
I send ten text messages a day. I can't cook.
1 ............................................................................................... 2 ............................................................................................... 3 ............................................................................................... 4 ............................................................................................... 5 ...............................................................................................
Pages 95-96
UNDERSTANDING GRAMMAR Present continuous
5 Match the sentence halves.
1 The children are playing ☐ the newspaper. 2 Mum's reading ☐ his homework. 3 The cat's eating ☐ TV. 4 Ian isn't doing ☐ doing? 5 What's Jacob ☐ their bikes. 6 We aren't watching ☐ computer games. 7 Mum and Dad are riding ☐ water. 8 James is drinking ☐ a fish.
6 Write the sentences from the box under the pictures.
Jim and Gerald are sending text messages. The cat is climbing the tree. Hamid is watching TV. Jeff is skateboarding. Emma and Megan are playing football.
Brandon is riding his bike. Mihir and Christine are playing the piano. Julia and Sandra are climbing a tree. Indira is talking to her friend.
[9 images showing different activities:]
[Cat climbing tree]
[Two people at piano]
[Two people climbing tree]
[Person skateboarding]
[Two people with phones]
[Person on bike]
[Person talking to someone]
[Two people playing football]
[Person watching TV]
Pages 96-97
USING GRAMMAR Present continuous
7 Complete the sentences with the correct form of the verbs in brackets.
1 Come to my place – we are listening to music. (listen) 2 Look, the dog ............................................................................................... in the river*. (swim) 3 Be quiet! I ............................................................................................... my homework. (do) 4 She ............................................................................................... fun. (have) 5 We ............................................................................................... a really good film. (watch) 6 Be quiet! My dad ............................................................................................... ! (sleep) 7 Look! Those people ............................................................................................... to our house. (come) 8 Listen! Emma ............................................................................................... her guitar. (play)
*VOCABULARY: river – Fluss
8 Complete the sentences with the correct form of the verbs in brackets.
What a terrible day! I'm ¹................................................... (not have) fun. I'm ²................................................... (not listen) to my favourite music. I'm ³................................................... (not read) my book. I'm ⁴................................................... (not watch) TV. I'm ⁵................................................... (not talk) to Nadine. Why not? Nadine isn't here. What a terrible day!
[Illustration of a sad person at desk]
9 Write the questions and short answers.
1 he / watch TV (✓) Is he watching TV? – Yes, he is.
2 they / cook dinner (✗) ....................................................................................................... – ................................................
3 they / do their homework (✓) ....................................................................................................... – ................................................
4 he / have breakfast (✗) ....................................................................................................... – ................................................
5 you / play computer games (✓) ....................................................................................................... – ................................................
10 Complete the dialogue with the present continuous form of the verbs in brackets. Then put the sentences in the correct order.
☐ Julia Why? What ............. are .............. you ........... doing ............ ? (do) ☐ Julia I'm sorry, I can't. I'm busy*. ☐ Julia Hi, Julia speaking. ☐ Julia I ................................................................ Jurassic World. It's fantastic. (watch) ☐ Henry I ................................................................ Minecraft. It's great. (play) ☐ Henry What ................................ you ................................ ? (do) ☐ Henry Oh! Can I come to your place? ☐ Henry Hi, Julia. It's me, Henry. Can you come to my place?
*VOCABULARY: busy – beschäftigt
1/36
11 Listen and check.
Pages 97-98
READING & WRITING Understanding daily routines / Writing a text message
12 Look at the pictures. Who is writing these text messages? Write the names.
[Three text messages with corresponding images:]
"Where are you? It's ten to ten and the game starts at ten. We've only got ten players. We need you. Get here soon!"
"Do you want to go skateboarding with me at ten? I'm going to the park. See you there."
"Can you help me? My bike is broken* and I want to go for a ride this afternoon at three. You can come with me if you want."
1 .............................................. 2 .............................................. 3 ..............................................
[Three images showing: Sharon with rollerblades, Brian with football, Steve with bicycle]
*VOCABULARY: broken – kaputt
13 Choose one of the text messages and write a reply.
14 CHOICES
A Read the interview with Nick. Then tick T (True) or F (False).
Interviewer Nick, can I ask you some questions? Nick Yes, of course. Interviewer What time do you get up in the morning? Nick At half past seven. I pack my things and have breakfast at a quarter to eight. Interviewer When do you leave for school? Nick At eight o'clock. I go by bus. Interviewer What time does school begin? Nick At a quarter to nine. Interviewer And when do you get home?
[Illustration of Nick in his room]
Nick At about a quarter to four. Interviewer When do you do your homework then? Nick Well, I usually meet my friends and then at half past five I do my homework. Interviewer And when's dinner? Nick Dad comes home at seven and that's when we have dinner. Interviewer When do you go to bed? Nick At about ten p.m. Interviewer Thank you, Nick.
Pages 98-99
1 Nick gets up at [clock showing time]. T ☐ F ☐
2 He has breakfast at [clock showing time]. T ☐ F ☐
3 He takes the bus to school at [clock showing time]. T ☐ F ☐
4 School starts at [clock showing time]. T ☐ F ☐
5 Nick has dinner at [clock showing time]. T ☐ F ☐
6 He goes to bed at [clock showing time]. T ☐ F ☐
B Look at the pictures and put the sentences in the correct order.
[9 numbered illustrations showing different scenes from a story]
☐ Rashmi arrives with a big umbrella. ☐ He calls Rashmi. "I can't come, there's a big dog in our garden. I'm scared!" ☐ Suddenly, his phone rings. It's his friend Rashmi. ☐ The dog runs away and Rashmi and Bill go to Rashmi's house. ☐ Bill goes back into the house. He's scared. ☐ "Can you come to my place?" says Rashmi. "I've got a new computer game." ☐ Bill is alone* in the house. He's watching TV. ☐ Bill opens the door. There's a big dog in the garden. ☐ "OK," says Rashmi. "Give me ten minutes."
*VOCABULARY: alone – allein
Pages 99-100
LISTENING & DIALOGUE WORK Talking about what so. is doing right now / Telling so. to be quick / Asking so. to wait
1/37
15 Listen and put the pictures in the correct order.
[8 pictures labeled A-H showing various scenes]
1/38
16 Listen and complete the dialogue.
*VOCABULARY: towards – in Richtung, hin zu
James Hello. Lisa James! It's Lisa. James What's the ¹........................................ ? Lisa I'm ²........................................ . James What are you ³..................................... ? Lisa I'm ⁴........................................ TV. James Are you ⁵........................................ ? Lisa Yes, I am. There are ⁶........................................ in the garden. Can you come, please?
James Sorry, I can't. Lisa You ⁷........................................ ? James No, I can't, Lisa. I'm ⁸........................................ dinner with Dad. (Ten minutes later.) Lisa Hello. James Lisa, I'm sorry. I'm ⁹........................................ over to your place. Lisa It's OK, James. Don't ¹⁰........................................ . Fred is here.
17 CHOICES
A Complete the sentences. Use the words in the box.
[Word bank:] Hurry Get Come Wait Just
1 Mum ........................................ on, John. It's time to go. John ........................................ a minute, Mum. I can't find my shoes. 2 Dad ........................................ up, Liam. The film starts in five minutes. Liam ........................................ a minute. I don't know where my cap is. 3 Donna ........................................ a move on, Oliver. Mum's here. Oliver OK, OK. I'm ready.
B Write the missing words.
1 Paula ........................................ up, Mum. The bus is here. Mum ........................................ a minute. I don't know where my money is. 2 Betty ........................................ a move on, Trevor. Dad's here. Trevor OK, OK. I'm nearly ready. 3 Dad ........................................ on, David. Let's go. David ........................................ a minute, Dad. I can't find my bag.
Pages 100-101
WORD FILE
Time
[Illustrations showing:]
Person walking to school (9 a.m.)
People eating at table (midday)
Person walking in evening (9 p.m.)
Person sleeping in bed (midnight)
[4 digital clock displays showing:]
9 o'clock
(a) quarter past nine
half past nine
(a) quarter to ten
Free time activities
[Illustrations showing various activities with labels:]
to ride a bike
to watch TV
to play football
to play computer games
to play the piano
to ride a horse
to skateboard
to cook
to ride a scooter
to ski
to snowboard
to skate
Page 101
MORE Words and Phrases
	English	Example	German
	daily	At 7 a.m., I do my daily exercise.	täglich
	free time	I like to read comics in my free time.	Freizeit
	What's the time?		Wie spät ist es?
3	Excuse me.		Entschuldigen Sie bitte., Entschuldigung.
	to hurry	We're late. Let's hurry.	sich beeilen
4	clock	My clock shows the wrong time.	Uhr
	It's 10 a.m.		Es ist 10 Uhr morgens/vormittags.
	It's 8 p.m.		Es ist 8 Uhr abends.
	What time is it?		Wie spät ist es?
5	bedtime	Bedtime is at ten o'clock.	Schlafenszeit
	break	At a quarter to nine, I have a break.	Pause
	exercise	At a quarter to ten, we do our daily exercise.	Übung; hier: (körperliche) Bewegung
	to go to bed	I go to bed at nine o'clock.	schlafen gehen
	to go to school	Sarah goes to school at a quarter to eight.	in die Schule gehen
	outside	We always do our exercise outside.	draußen, außerhalb
	to study	I study art and drawing.	lernen, studieren
	to wake somebody up	My dad plays a loud song to wake me up.	jemanden aufwecken
8	amazing	I want to show you something amazing!	erstaunlich, großartig
	to answer the door	There's a knock at the door. Suzy answers the door.	die Tür aufmachen
	bush	Let's hide behind the bush.	Busch
	Have fun!		Viel Spaß!
	to hide	Tim is hiding in the bushes.	(sich) verstecken
	knock	There's a knock at the door.	Klopfen
	living room	She is watching TV in the living room.	Wohnzimmer
	surprise	Tim has got a surprise for Suzy.	Überraschung
10	to push	The cat pushes the skateboard down the park.	schieben; drücken
13	to cook	My mum cooks great spaghetti.	kochen
	text message	He's sending a text message.	Textnachricht, SMS
14	to look after	She's looking after her cat.	sich kümmern
17	road	I'm walking down the road.	Straße, Weg
19	place	Can you come to my place?	Ort, Platz; hier: Wohnung, Zuhause
	programme	I'm watching a great TV programme.	Programm, Sendung
20	clue	I don't know. Give me a clue.	Hinweis, Tipp
21	See you soon.		Bis bald.
	to snow	It's snowing outside.	schneien
	weather	I hope the weather is nice tomorrow.	Wetter
T5	half an hour	I read for half an hour every evening.	eine halbe Stunde
	Hurry up.		Beeil dich. / Beeilt euch.

```

## Output contract

Write `content/corpus/units/g1-u11/gen/vocab.draft.json`:

```jsonc
{
  "schema": "vocab-draft@1",
  "slug": "g1-u11",
  "briefBank": "5c3fc203cee7",
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
