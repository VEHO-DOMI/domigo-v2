# Vocab generation brief — g1-u05 (MORE! 1, Unit 5)

<!-- domigo:gen vocab g1-u05 bank=22c58d7186e1 prompt=346902f9f0f1 -->

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
| g1u05.w.keyboard-player | keyboard player | Keyboarder/Keyboarderin | wordfile | — | — | — | keyboard player |
| g1u05.w.keyboard | keyboard | Keyboard | wordfile | — | — | — | keyboard |
| g1u05.w.singer | singer | Sänger/Sängerin | wordfile | — | — | — | singer |
| g1u05.w.drummer | drummer | Schlagzeuger/Schlagzeugerin | wordfile | — | — | — | drummer |
| g1u05.w.drums | drums | Schlagzeug | wordfile | — | — | — | drums |
| g1u05.w.saxophone-player | saxophone player | Saxophonist/Saxophonistin | wordfile | — | — | — | saxophone player |
| g1u05.w.saxophone | saxophone | Saxophon | wordfile | — | — | — | saxophone |
| g1u05.w.guitarist | guitarist | Gitarrist/Gitarristin | wordfile | — | — | — | guitarist |
| g1u05.w.guitar | guitar | Gitarre | wordfile | — | — | — | guitar |
| g1u05.w.boyfriend | boyfriend | fester Freund | phrase | — | Jack is her boyfriend. | — | boyfriend |
| g1u05.w.its | its | sein/e ; ihr/e | phrase | — | This is my band. Its name is Project 11. | — | its |
| g1u05.w.to-play | to play | spielen | phrase | — | They play the guitar. | play | to play ; play |
| g1u05.w.sister | sister | Schwester | phrase | — | Jessica is my sister. | — | sister |
| g1u05.w.can-cannot-can-t | can, cannot / can't | können ; nicht können | phrase | — | She can play the drums. He can't sing. | — | can, cannot / can't ; can, cannot ; can't |
| g1u05.w.concert | concert | Konzert | phrase | — | Let's go to the concert tomorrow. | — | concert |
| g1u05.w.to-dance | to dance | tanzen | phrase | — | Let's dance to the music! | dance | to dance ; dance |
| g1u05.w.don-t-worry | Don't worry. | Keine Sorge. | phrase | — | — | — | Don't worry. |
| g1u05.w.job | job | Arbeit ; Aufgabe | phrase | — | She has a good job. | — | job |
| g1u05.w.perfect | perfect | perfekt | phrase | — | The job is perfect for you. | — | perfect |
| g1u05.w.to-carry | to carry | tragen | phrase | — | Can you carry my guitar? | carry | to carry ; carry |
| g1u05.w.to-stand-on | to stand on | auf etwas stehen | phrase | — | I can stand on my head. | stand on | to stand on ; stand on |
| g1u05.w.tongue | tongue | Zunge | phrase | — | He can touch his nose with his tongue. | — | tongue |
| g1u05.w.to-touch | to touch | berühren | phrase | — | Please don't touch my guitar. | touch | to touch ; touch |
| g1u05.w.to-walk-on | to walk on | auf etwas gehen | phrase | — | Can you walk on your hands? | walk on | to walk on ; walk on |
| g1u05.w.to-wiggle | to wiggle | wackeln | phrase | — | He can wiggle his ears. | wiggle | to wiggle ; wiggle |
| g1u05.w.can | can | Dose | phrase | — | Look, he carries fifteen cans. | — | can |
| g1u05.w.to-drink | to drink | trinken | phrase | — | I can't drink fifteen cans. | drink | to drink ; drink |
| g1u05.w.hundred | hundred | hundert | phrase | — | Can you eat a hundred apples? | — | hundred |
| g1u05.w.in-one-go | in one go | in einem Zug ; auf einmal | phrase | — | Can you drink five cans in one go? | — | in one go |
| g1u05.w.is-that-so | Is that so? | Ach wirklich? | phrase | — | — | — | Is that so? |
| g1u05.w.this-is-me | This is me. | Das bin ich. | phrase | — | — | — | This is me. |
| g1u05.w.economy | economy | Wirtschaft | phrase | — | The economy is the world of money. | — | economy |
| g1u05.w.hospital | hospital | Krankenhaus | phrase | — | The Clown Doctors go to hospitals and help children. | — | hospital |
| g1u05.w.to-laugh | to laugh | lachen | phrase | — | They make children laugh. | laugh | to laugh ; laugh |
| g1u05.w.money | (pocket) money | (Taschen-)Geld | phrase | — | I get my pocket money from my mum and dad. | — | money ; money pocket |
| g1u05.w.pound | pound | Pfund | phrase | — | A cup of apple juice is 2 pounds. | — | pound |
| g1u05.w.profit | profit | Gewinn ; Profit | phrase | — | It's 120 pounds. That's my profit. | — | profit |
| g1u05.w.school-canteen | school canteen | Schulkantine | phrase | — | We have apple juice in our school canteen. | — | school canteen |
| g1u05.w.table | table | Tisch | phrase | — | I put a table in our playground. | — | table |
| g1u05.w.teacher | teacher | Lehrer/Lehrerin | phrase | — | Mr Davis is my teacher at school. | — | teacher |
| g1u05.w.uncle | uncle | Onkel | phrase | — | My uncle is my dad's brother. | — | uncle |
| g1u05.w.to-wash | to wash | waschen | phrase | — | I wash my mum's car. | wash | to wash ; wash |
| g1u05.w.nothing | nothing | nichts | phrase | — | There's nothing in the garden. | — | nothing |
| g1u05.w.sorry | Sorry? | Entschuldigung? ; Wie bitte? | phrase | — | — | — | Sorry? |

### Allowed vocabulary (the deterministic level gate enforces exactly this)

Cumulative bank — every headword below (plus its inflections and listed forms) is taught:

- **g1-u01**: sound system, projector, board, window, door, desk, scissors, ruler, tablet, chair, school bag, pen, exercise book, pencil case, pencil, rubber, book, hairband, sunglasses, hat, school tie, shirt, sweater, skirt, socks, shoe, to give, time, to understand, to write, to enjoy, to listen, to love, more, to read, their, to ask, (email) address, How are you?, I am (= I'm) fine., to meet, then, your, to look, or, to eat, to go, must, how many, to hate, here, it, Let's …, midnight, our, favourite, to find, light, child, to clean, to close, to open, picture, to sit down, to speak, to stand up, to take out, class
- **g1-u02**: tree, monkey, parrot, giraffe, train, penguin, guide, lion, next to, in, behind, under, on, in front of, zoo, beautiful, behind, big, in front of, next to, under, where, small, adult, at, to bring, but, child (pl children), dog, family, free, Grandma, group, long, ticket, to want, from, year, he, she, to talk, they, we, for, happy, to let somebody out, us, car, At last., How strange!, Let me see., stone
- **g1-u03**: finger, ear, nose, hair, eye, mouth, beard, right arm, left arm, shoulder, leg, foot, feet, tooth, teeth, tall, short, big, small, long, also, famous, him, his, ship, to be scared (of), strong, captain, have got / has got, pretty, purple, week, again, back, to paint, sister, boy, girl, man (pl men), woman (pl women), Her name is …, His name is …
- **g1-u04**: cold, angry, happy, scared, excited, hot, bored, sad, hungry, nervous, tired, proud, morning, lunchtime, afternoon, evening, night, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, after, day, end, fun, Go away!, to happen, show, a day in the life of, to be asleep, early, life, still, story, today, Are you OK?, homework (no pl), into, Oh dear!, room, bad, Don't be late., tomorrow, birthday, friend, Be yourself., no one else, bottle, to get back, mad, magic, to break, to go to sleep, because, It's me., Try it!, Let go!, What's happening?
- **g1-u05**: keyboard player, keyboard, singer, drummer, drums, saxophone player, saxophone, guitarist, guitar, boyfriend, its, to play, sister, can, cannot / can't, concert, to dance, Don't worry., job, perfect, to carry, to stand on, tongue, to touch, to walk on, to wiggle, can, to drink, hundred, in one go, Is that so?, This is me., economy, hospital, to laugh, (pocket) money, pound, profit, school canteen, table, teacher, uncle, to wash, nothing, Sorry?

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Ahmed, Arbeit, Bacon, Baker, Befehlsformen, Betty, Bild, Bilder, Blackbeard, Blackie, Bob, Box, Buckingham, Buddy, California, Cambridge, Caribbean, Carina, Carl, Chloe, Classroom, Clown, Dan, Dana, Dave, David, Davis, Dialog, Dialoge, Doctors, Don, Ellie, England, English, False, Fido, Frank, Fred, Freddy, Gina, Good, Gordon, Great, Greybeard, Guess, Harry, Homework, Hook, Imperatives, Irregular, Jack, James, Jamie, Jenny, Jessica, Jill, Julia, Kitty, Leah, Leo, London, Lucy, Mail, Manchester, Mary, Mike, Miss, Mr, Mum, Nibbs, Nice, Nomen, Number, Numbers, Omar, Palace, Pardon, Pete, Peter, Pirates, Plural, Polly, Possessives, Prepositions, Project, Put, Rajit, Reihenfolge, Richard, Ronald, Saying, School, Steve, Sue, Tamara, Text, Tick, Toby, Tock, Tom, True, Welcome, Well, Work, Wortes, Wow, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## v1 seeds (UNTRUSTED — mine for ideas, never copy unverified)

Known v1 defect classes: invented above-level carrier words, out-of-bank MC distractors, over-strict answers.

- `g1u05.w.keyboard-player` ← v1 `keyboard player`: d="a person who plays the keyboard" · s="The _____ in our band sits at an electric piano and plays with both hands during every song." · a=[] · mc=["drummer","singer","guitarist"]
- `g1u05.w.keyboard` ← v1 `keyboard`: d="a musical instrument with keys" · s="She plays the _____ with her fingers on all 88 black and white keys." · a=[] · mc=["trumpet","violin","flute"]
- `g1u05.w.singer` ← v1 `singer`: d="a person who sings songs" · s="The _____ holds the microphone and uses her voice to sing the words of each song." · a=[] · mc=["drummer","guitarist","keyboard player"]
- `g1u05.w.drummer` ← v1 `drummer`: d="a person who plays the drums" · s="The _____ sits behind the drum kit and hits the drums very fast with two wooden sticks." · a=[] · mc=["singer","keyboard player","flutist"]
- `g1u05.w.drums` ← v1 `drums`: d="a musical instrument you hit with sticks" · s="He plays the _____ with two sticks and hits them very hard to make loud beats." · a=[] · mc=["guitar","keyboard","saxophone"]
- `g1u05.w.saxophone-player` ← v1 `saxophone player`: d="a person who plays the saxophone" · s="The _____ holds a shiny brass instrument in her mouth and blows into it to play jazz music." · a=[] · mc=["drummer","singer","guitarist"]
- `g1u05.w.saxophone` ← v1 `saxophone`: d="a metal instrument you blow into" · s="She wants to learn the _____ this year — a big golden wind instrument you blow into." · a=[] · mc=["piano","drums","violin"]
- `g1u05.w.guitarist` ← v1 `guitarist`: d="a person who plays the guitar" · s="The _____ in the band plays the guitar with a small plastic pick in his right hand." · a=["guitar player"] · mc=["drummer","singer","pianist"]
- `g1u05.w.guitar` ← v1 `guitar`: d="a string instrument you play with your hands" · s="He got a new electric _____ with six strings for his birthday and now he practices every day." · a=[] · mc=["drum","trumpet","piano"]
- `g1u05.w.boyfriend` ← v1 `boyfriend`: d="a boy who is your special friend" · s="Anna has a new _____ called Jack. He is a boy and he is her special friend." · a=[] · mc=["little brother","baby cousin","pet dog"]
- `g1u05.w.its` ← v1 `its`: d="belonging to a thing or animal" · s="The dog is wagging _____ tail because it is happy to see me." · a=[] · mc=["his","her","their"]
- `g1u05.w.to-play` ← v1 `to play`: d="to make music or have fun" · s="Can you _____ the guitar and show me how to hold it?" · a=[] · mc=["to eat","to wash","to break"]
- `g1u05.w.concert` ← v1 `concert`: d="a live music show" · s="We are going to a rock _____ on Saturday night to hear my favourite band play live on stage." · a=[] · mc=["lesson","test","meeting"]
- `g1u05.w.to-dance` ← v1 `to dance`: d="to move your body to music" · s="I love to _____ to the music when I hear my favourite song — I move my feet and arms." · a=[] · mc=["to stand still","to sit down","to sleep"]
- `g1u05.w.don-t-worry` ← v1 `Don't worry.`: d="telling someone not to be afraid" · s="_____ Everything will be fine in the morning. I promise you there is no problem." · a=["Don't worry"] · mc=["Don't move.","Don't look.","Don't speak."]
- `g1u05.w.job` ← v1 `job`: d="work that you do" · s="My mum has a good _____ at the hospital. She is a doctor and earns money to pay for our food and house." · a=[] · mc=["toy","game","pet"]
- `g1u05.w.perfect` ← v1 `perfect`: d="the best it can be, no mistakes" · s="Your English test is _____! You got ten correct answers out of ten, with zero mistakes!" · a=[] · mc=["terrible","bad","wrong"]
- `g1u05.w.to-carry` ← v1 `to carry`: d="to hold something and move with it" · s="Can you help me _____ these very heavy bags of shopping from the car into the house?" · a=[] · mc=["to drop","to leave","to throw"]
- `g1u05.w.to-stand-on` ← v1 `to stand on`: d="to put your feet on something" · s="Please don't _____ the flowers in the garden." · a=[] · mc=["to lie on","to sit on","to sleep on"]
- `g1u05.w.tongue` ← v1 `tongue`: d="the soft part inside your mouth" · s="The doctor said: 'Open your mouth and stick out your _____ so I can see your throat.'" · a=[] · mc=["hair","nose","ear"]
- `g1u05.w.to-touch` ← v1 `to touch`: d="to put your hand on something" · s="Please don't _____ the old paintings in the museum with your fingers — they are very delicate." · a=[] · mc=["to look at","to listen to","to smell"]
- `g1u05.w.to-walk-on` ← v1 `to walk on`: d="to move on your feet over something" · s="Be very careful when you _____ the thin ice on the frozen pond — it might crack." · a=[] · mc=["to sit near","to jump into","to fly over"]
- `g1u05.w.to-wiggle` ← v1 `to wiggle`: d="to move something from side to side quickly" · s="Can you _____ your ears up and down? I can't! I can only move my eyebrows." · a=[] · mc=["to close","to hide","to break"]
- `g1u05.w.can` ← v1 `can`: d="a metal container for food or drinks" · s="He drinks a _____ of lemonade every day." · a=["tin"] · mc=["bottle","box","cup"]
- `g1u05.w.to-drink` ← v1 `to drink`: d="to take water or juice into your mouth" · s="You must _____ a lot of water when it is very hot outside and you are running around." · a=[] · mc=["to eat","to pour","to make"]
- `g1u05.w.hundred` ← v1 `hundred`: d="the number 100" · s="There are one _____ children in our whole school — 50 boys and 50 girls." · a=[] · mc=["ten","thousand","million"]
- `g1u05.w.in-one-go` ← v1 `in one go`: d="all at one time, not stopping" · s="He was very hungry so he ate the whole pizza _____ without stopping between slices." · a=[] · mc=["over three days","bit by bit","slowly"]
- `g1u05.w.is-that-so` ← v1 `Is that so?`: d="asking if something is really true" · s="I can eat ten huge apples in one minute! — _____ That's hard to believe!" · a=[] · mc=["Me too!","I agree!","Thank you!"]
- `g1u05.w.this-is-me` ← v1 `This is me.`: d="introducing yourself" · s="Look at the old photo from when I was 5 years old. _____ The little boy in the blue shirt." · a=["This is me"] · mc=["That is him.","That is her.","That is them."]
- `g1u05.w.economy` ← v1 `economy`: d="the system of money and business" · s="We learn about the _____ in our new social studies class — how money, shops, and jobs work." · a=[] · mc=["planets","animals","dinosaurs"]
- `g1u05.w.hospital` ← v1 `hospital`: d="a place where sick people go" · s="My grandma is very sick with a broken leg. She is in the _____ where the doctors and nurses take care of her." · a=[] · mc=["library","park","airport"]
- `g1u05.w.to-laugh` ← v1 `to laugh`: d="to make a happy sound, ha ha ha" · s="The clown at the circus is very funny and we all _____ out loud when he falls over." · a=[] · mc=["to cry","to sleep","to sit"]
- `g1u05.w.money` ← v1 `pocket money`: d="money your parents give you each week" · s="I get five euros _____ from my parents every Saturday for doing my chores." · a=[] · mc=["as a present","as a prize","as a bill"]
- `g1u05.w.pound` ← v1 `pound`: d="money used in Britain" · s="This British book costs five _____ — the official money of the UK. Not euros." · a=[] · mc=["euros","dollars","yen"]
- `g1u05.w.profit` ← v1 `profit`: d="the money you make from selling something" · s="She sells homemade lemonade at her stall. After paying for the lemons and sugar, she makes a _____ of ten euros." · a=[] · mc=["debt","loss","cost"]
- `g1u05.w.school-canteen` ← v1 `school canteen`: d="a place at school where you eat lunch" · s="We eat our hot lunch together in the _____ at 12 o'clock with all the other pupils." · a=[] · mc=["science lab","library","gym"]
- `g1u05.w.table` ← v1 `table`: d="a piece of furniture with legs and a flat top" · s="Please put the dinner plates and glasses on the big wooden _____ with four legs where we eat." · a=[] · mc=["floor","wall","window"]
- `g1u05.w.teacher` ← v1 `teacher`: d="a person who helps you learn at school" · s="Our class _____ Mrs. Smith gives us new homework every day and marks our tests." · a=[] · mc=["student","classmate","parent"]
- `g1u05.w.uncle` ← v1 `uncle`: d="your mum's or dad's brother" · s="My _____ lives in London. He is my dad's brother and visits us every Christmas." · a=[] · mc=["aunt","cousin","niece"]
- `g1u05.w.to-wash` ← v1 `to wash`: d="to clean with water" · s="Please _____ your dirty hands with soap and water before you sit down to eat dinner." · a=[] · mc=["to dry","to shake","to raise"]
- `g1u05.w.nothing` ← v1 `nothing`: d="not anything" · s="There is _____ in the cardboard box. It is completely empty — not even a piece of paper." · a=[] · mc=["something","everything","a lot"]
- `g1u05.w.sorry` ← v1 `Sorry?`: d="asking someone to say it again" · s="_____ I did not hear what you said. Can you repeat it a little louder, please?" · a=[] · mc=["Goodbye!","Thanks!","Hello!"]

## Unit transcripts (textbook sentences live here — use them first)

```
----- SB: SB Unit 5- This is our band.txt -----
Page 38
Unit 5: This is our band
At the end of unit 5 ...
you know ☐ 5 words for musicians and 4 musical instruments ☐ 4 verbs for movement ☐ how to use can / can't ☐ how to use possessives (besitzanzeigende Fürwörter)
you can ☐ say what you can or can't do ☐ ask and understand what others can or can't do ☐ write about what you can or can't do
VOCABULARY Musicians and instruments
2/1 🔊 1 Listen and look at the pictures. Then number the words.
☐ drummer ☐ saxophone player ☐ singer ☐ guitarist ☐ keyboard player
[Image description: Silhouettes of five musicians numbered 1-5 showing a keyboard player, saxophone player, guitarist, bassist, and drummer]
2/2 🔊 2 Listen to James. Complete with the words from the box.
~~James~~ Ellie Bacon Steve Jessica Jack Dan
Hi, I'm ¹.................James............... . I'm the singer of our band. Its name is Project 11. This is ².................................. , our keyboard player. And this is her boyfriend, ³................................... . He's our saxophone player. This is ⁴................................... and his brother ⁵................................... . They play the guitar. And this is their dog. His name is ⁶................................... .
[Image description: Illustration of a band with six members performing with various instruments]
This is my sister, ⁷................................... . She's our drummer.
🔵 WB p. 40, 41 🌐 CYBER Homework 13 (Revision)
Page 39
READING
3 Read the story.
The perfect job
... It's time to move your body and to dance around the clock ...
[Image description: Series of illustrated panels showing a band performance and interactions between band members]
2
Pete Wow! Cool! You're a great band. James Thanks. I'm James. What's your name? Pete Hi, I'm Pete. James Nice to meet you, Pete. Meet my friends. This is Jessica. She plays the drums. Pete Hi, Jessica! Jessica Hi! James And there's Dan, Steve, Ellie and Jack. Pete Hi there. Band Hi!
3
Pete Erm ... Erm ... Can I play in your band? Jessica Can you play the guitar? Pete Yes, I can. Jessica No, he can't.
4
Ellie Can you play the keyboards? Pete I'm not sure. Let me try. Jessica No, you can't.
5
James Can you sing? Pete I'm not sure. Let me try. ... I love you so ... Jack Oooops! Pete No, I can't. James Oh, don't worry.
Ellie We've got the perfect job for you. Pete Really? Wow! Jessica Yes, come back tomorrow at five. We've got a concert at eight.
6
The next day at five o'clock.
Phew! Perfect job? I don't know
🔵 WB p. 46
Page 40
4 How many of these tasks can you do?
1 For Pete, the band is ☐ loud. ☐ OK. ☐ great. 2 They ask Pete: Can you play the ☐ keyboards? ☐ drums? ☐ saxophone? 3 They say to Pete, "Come back ☐ in five hours." ☐ tomorrow at five." ☐ at five in the morning." 4 Pete can play the guitar. T / F 5 Pete can't sing. T / F 6 Jessica says she has the perfect job for Pete. T / F 7 Who is the drummer in the band? ............................................................................................... 8 How many people are in the band? ............................................................................................... 9 Is Pete happy with his new job? ...............................................................................................
2/3+4 🔊 5 Check your answers with a partner. Then listen to the story.
A SONG 4 U
2/5+6 🔊 6 Listen and sing.
Music is our life
When the drummer gets going and the band starts to rock, it's time to move your body and dance around the clock. Yeah, music, music, music – Music is our life.
Hear the beat – it's so cool. There's music here at our school. Shake your arms and shake your feet. Swing in time with the beat!
When the drummer gets going ...
Forget the tests – have some fun. Enjoy the music, everyone! Move your body, left and right. Dance and sing, day and night!
When the drummer gets going ...
[Image description: Illustration of diverse band members playing various instruments]
7 Complete the sentences with can or can't.
1 .......Can........ you play the guitar, Pete? – Yes, I .................... . 2 ..................... you sing, Pete? – No, I ..................... . 3 Dan and Steve ................... play the guitar.
4 Bacon ................... sing. 5 Ellie ..................... play the keyboards. 6 Pete ................... carry their instruments.
2/7 🔊 8 Listen and write the words.
nose ears hands head
[Image description: Four illustrations showing different actions numbered 1-4]
1 wiggle your ............................. 2 stand on your ....................... 3 walk on your .......................... 4 touch your .............................. with your tongue
🔵 WB p. 40, 42, 44 🌐 CYBER Homework 14
Page 41
SOUNDS RIGHT can – can't
Note I can't = I cannot
2/8 🔊 9 Listen and repeat.
Can you carry fifteen cans? I can't carry fifteen cans. Can you drink them in one go? I can't drink them in one go. Can you eat a hundred apples? I can't eat a hundred apples. Can you really? Is that so? I'm not a hippo, no no no!
[Image description: Illustration of a hippo with cans and a girl]
SPEAKING Saying/Asking what you or others can or can't do
👥 10 Find out five things your partner can do and three things he/she can't do.
[Image description: Photo of students studying together]
A I can ... , but I can't ... Can you ... ?
B Yes, I can.
C No, I can't.
GRAMMAR CHANT Possessives
2/9 🔊 11 A chant. Listen and repeat.
[Image description: Comic strip showing various scenes with cats and people discussing ownership, with speech bubbles saying:
"This isn't my cat."
"It isn't your cat."
"It isn't his cat."
"Oh, no!"
"It's her cat."
"Yes, I'm her cat."
"This isn't our dog."
"It isn't your dog."
"Of course not. It's their dog."
"That's right, I'm their dog."]
🔵 WB p. 42, 43, 44
Page 42
WRITING
12 Read the text. Then write a text about yourself.
This is me. I can write with my left hand and my right hand. I can't touch my nose with my tongue, but I can wiggle my ears. I can walk on my hands. I'm Super Girl!
[Image description: Illustration of a girl doing a handstand]
GRAMMAR
▶️ Possessives (besitzanzeigende Fürwörter)
Mithilfe der Wörter my, your, his, her usw. kannst du ausdrücken, zu wem etwas gehört.
I – my This is my sister Jessica. you – your What's your name? – I'm James. he – his His name's Jack. she – her Her name's Ellie. it – its This is a new band. Its name is Project 11. we – our We are Dan and Steve. And this is our dog. you – your Dan and Steve, your guitars are great! they – their Dan and Steve are brothers. Their dog is Bacon.
This elephant can wiggle its ears.
[Image description: Cartoon of an elephant wiggling its ears]
▶️ can – can't 🔍 Lies die Beispielsätze links. Setze dann can oder can't ein:
James can sing. The dog can't sing.
Mithilfe des Wortes ¹........................ sagst du, dass jemand etwas kann. Mithilfe des Wortes ²........................ sagst du, dass jemand etwas nicht kann.
MORE FUN WITH FIDO!
[Image description: Comic strip showing a person with a guitar and a dog, with speech bubbles saying "Take me by the hand ..." and "Mmm. That's a good idea!"]
⏪ Now go back to page 38. Check ☑ with a partner what you know / can do.
🔵 WB p. 42, 43, 44, 45, 47 🌐 CYBER Homework 15
Page 43
OUR YOUNG WORLD 2
▶️ Jamie's money
▶️ 1 Watch the video and complete Jamie's sentence:
I get pocket money from ................................................................................................................. .
▶️ 2 Watch again. Put Jamie's sentences in the correct order.
☐ My profit is £120. ☐ But Mr Davis, my teacher, ☐ A cup of apple juice at the isn't happy! school canteen is £2.
☐ At the supermarket, a ☐ I give my profit to ☐ I get ten litres of apple juice litre of apple juice is £1. the Clown Doctors. from the supermarket.
FIND 🔍 OUT The economy
3 Match the questions with the answers.
1 What's the economy? ☐ When a lot of people have a job and get good money. 2 When is the economy good? ☐ When not a lot of people have a job. 3 When is the economy bad? ☐ It's the world of money.
Our money world
4 What are good ways to get money? What are bad ways? Write g (good) or b (bad).
1 go shopping for someone ☐ 3 help at home ☐ 2 wash the car for someone ☐ 4 ask a friend for money ☐
[Image description: Photos showing a stack of coins, a child shopping, a child helping in kitchen, and children washing a car]
CYBER PROJECT: Jamie's problem
5 Work in groups. ● Create a role play about Jamie's problem. ● Think of a good ending ● Make a video.
🌐 CYBER Project 2
Page 44
THE TWINS 2
▶️ Kitty isn't here
Developing speaking competencies
Language function | Speaking strategy ☐ I can ask for help (jemanden um Hilfe bitten) | ☐ I can ask for repetition (jemanden bitten, etwas zu wiederholen)
VOCABULARY Places
2/10 🔊 1 Look at the photos. Match the places with the photos. Then listen and check.
1 garage 3 downstairs 5 kitchen 2 bathroom 4 garden 6 upstairs
[Image description: Photos labeled A-F showing different areas of a house including cross-sections and rooms]
2/11 🔊 2 Watch or listen to the dialogue. Then read it. What places do Lucy and Leo mention?
▶️
Lucy Can you help me? Leo Sorry? Lucy Can you help me please, Leo? Leo Yes, of course. What's the problem? Lucy Kitty isn't here. Leo Pardon? Lucy Kitty isn't here. Leo Shhh. Kitty! Kitty! Lucy Nothing. Can you help me? Look in the garden, please. Leo OK. And you? Lucy I can look upstairs. Leo OK, let's go.
[Image description: Photo of two people in a room]
3 Read the dialogue in 2 again. Then circle T (True) or F (False).
1 Lucy asks Leo for help. T / F 3 Leo looks in the garden. T / F 2 Leo has got a problem. T / F 4 Lucy looks downstairs. T / F
Page 45
USEFUL PHRASES Asking for help
4 Write the words in the correct order to make sentences. Then check with the dialogue in 2 to find a good answer to the phrases.
1 you / can / me, / please / help / ? ............................................................................................... 2 garden, / in / look / the / please / . ............................................................................................... 3 Answer: Yes, o................................... c................................... .
? What do you think? Answer the questions.
• Where is Kitty? • Who finds her – Lucy or Leo?
MOBILE HOMEWORK
▶️ Watch part 2 of the video. Fill in Lucy or Leo. Then check your answers to the questions above.
1 ...................... looks under the bridge. 3 ...................... goes to the kitchen to get 2 ...................... looks behind the some orange juice. bushes. 4 ...................... sits down on the sofa.
SPEAKING STRATEGY Asking for repetition
5 Complete the dialogues with the correct words. Check with the dialogue in 2.
1 Lucy Can you help me? 2 Lucy Kitty isn't here. Leo S.................................................. ? Leo P.................................................. ? Lucy Can you help me please, Leo? Lucy Kitty isn't here.
6 C H O I C E S
👥 A Work in pairs. Student A asks for help. Student B doesn't understand and asks for repetition. Use the words from the box.
help / homework open / door for me get me / sandwich carry / school bag
A Can you help me with my homework, please? B Pardon?
A Can you help me with my homework, please? B Yes, of course.
👥 B ROLE PLAY: Work in pairs. Look at the situation and the roles. Think of a role play with a partner. Take two or three minutes to practise it. Don't write it down. Act it out in class.
Roles: You and your friend Situation: You are at home. You can't find your pen. Ask your friend for help. Ask your friend to look in different places before you find it. Language: Don't forget to ask for repetition.
🔵 WB p. 47


----- WB: WB Unit 5 This is our band.txt -----
Unit 5 This is our band
Page 40–41
UNDERSTANDING VOCABULARY
Musicians and instruments / Verbs for movement
1 Look at the picture and write the names of the instruments.
guitar
saxophone
drums
keyboard
[Image description: A music room. On the left, a glass cabinet with two shelves: on the top shelf there is a trumpet; on the bottom shelf there is a saxophone. On the right, a man is standing in the room holding a guitar. Behind him there is a drum kit. On the floor to the right there is a keyboard. Numbers 1, 2, 3, and 4 are shown next to the instruments to label them.]
1 ……………………………
2 ……………………………
3 ……………………………
4 ……………………………
2 Who plays the instruments? Write the words.
1 drums – drummer
2 saxophone – ……………………………
3 guitar – ……………………………
4 keyboard – ……………………………
3 Write the phrases from the box under the pictures.
walk on my hands
wiggle my ears
touch my nose with my tongue
stand on my head
write with my left and my right hand
[Image description: A girl saying “I can …”. Five pictures show different actions: walking on hands, standing on head, writing with both hands, wiggling ears, touching nose with tongue.]
1 walk on my hands
2 ……………………………
3 ……………………………
4 ……………………………
5 ……………………………
USING VOCABULARY
Musicians and instruments / Verbs for movement
4 Complete the sentences about Project 11.
Spotlight on PROJECT 11
1 James is the …………………………… of the band.
[Image description: James holding a microphone.]
2 Jessica is the …………………………… .
[Image description: Jessica next to a drum kit.]
3 Ellie is the …………………………… player.
[Image description: Ellie next to a keyboard.]
4 Dan and Steve play the …………………………… .
[Image description: Dan and Steve with guitars.]
5 Jack is the …………………………… player.
[Image description: Jack playing the saxophone.]
5 Complete the text with the missing letters.
Proj _ _ 11 ar_ a gre_ _ ba_ . Th sin_ _ o_ th_ ba_ _ i_ Jam_ . Jess _ _ i_ th_ drum_ _ . Sh i_ ve_ _ goo_ . Ell _ i_ th_ keyb_ _ _ pla_ _ _ an_ Ja_ _ i_ th_ saxop_ _ _ pla_ _ . Da an_ Ste_ _ pl_ _ th_ gui_ _ _.
6 Follow the lines and write about the band FourU.
[Image description: Five people labelled Mark, Tim and Kate, Joe, Sally, Emma. Curved lines connect each person to an instrument: drums, keyboard, saxophone, guitars, microphone.]
1 Mark is the singer.
2 ……………………………
3 ……………………………
4 ……………………………
5 ……………………………
Page 42–43
7 Match A with B and write the phrases under the pictures.
A
1 climb*
2 stand on
3 touch your nose
4 juggle*
5 walk on
6 wiggle
B
balls
with your tongue
a tree
your ears
your head
your hands
VOCABULARY
*climb – klettern
juggle – jonglieren
[Image descriptions:
1 A boy climbing a tree.
2 A boy standing on his head.
3 A boy touching his nose with his tongue.
4 A boy juggling balls.
5 A boy walking on his hands.
6 A boy wiggling his ears.]
1 climb a tree
2 ……………………………
3 ……………………………
4 ……………………………
5 ……………………………
6 ……………………………
UNDERSTANDING GRAMMAR
Possessives
8 Circle the correct word.
1 This is we / our dog.
2 Is Susie you / your sister?
3 Have you got he / his book?
4 He / His is very happy today.
5 Are they / their brothers?
6 That’s she / her saxophone.
7 It / Its is cold today.
8 What’s it / its name?
9 John is I / my brother.
10 We / Our are twins.
11 Mr Smith is they / their favourite teacher.
12 I / My am Paul.
9 Complete the table with the words in the box.
they
you
she
my
your
its
his
our
Subject pronoun | Possessives
I | 1 …………………
2 ………………… | your
he | 3 …………………
4 ………………… | her
it | 5 …………………
we | 6 …………………
you | 7 …………………
8 ………………… | their
[Image description: A band of animals playing instruments. A speech bubble says: “Our singer’s great.”]
Page 44–45
UNDERSTANDING GRAMMAR
can – can’t
10 Look at the pictures and number the sentences.
[Image descriptions:
1 A girl playing tennis.
2 A dog trying to climb a tree.
3 A boy singing into a microphone with people covering their ears.
4 A squirrel climbing a tree.
5 A girl standing on her head.
6 A boy singing with people clapping.
7 A girl playing tennis badly.
8 A girl walking on her hands.]
He can’t sing.
She can walk on her hands.
It can climb trees.
She can’t walk on her hands.
She can’t play tennis.
It can’t climb trees.
She can play tennis.
He can sing.
USING GRAMMAR
Possessives
11 Complete the sentences with the words from the box.
my
your
his
her
our
their
[Image descriptions accompany each sentence.]
1 Is that ………………… cat?
2 This is ………………… new school!
3 This is ………………… bag.
4 We’re Billy and Steve. And these are ………………… dogs!
5 What’s ………………… name?
6 They’re Jane and Melissa. And that’s ………………… mum.
12 Complete the sentences. Use his, her or their. Write short answers.
[Image descriptions show people with cats.]
1 Is it his cat?
Yes, it is.
2 …………………………… ?
No, …………………………… .
3 …………………………… ?
Yes, …………………………… .
4 …………………………… ?
No, …………………………… .
5 …………………………… ?
No, …………………………… .
6 …………………………… ?
Yes, …………………………… .
Page 46–47
USING GRAMMAR
can – can’t
13 Write the words in the correct order to make sentences.
1 you / stand / can / head / your / on / ?
Can you stand on your head?
2 can’t / they / sing / .
……………………………………
3 play / you / tennis / can / ?
……………………………………
4 climb / he / trees / can’t / .
……………………………………
5 count / I / can / from / you / 100 / to / ?
……………………………………
6 can’t / her / hands / she / walk / on / .
……………………………………
7 hands / walk / you / can / on / your / ?
……………………………………
8 brother / my / guitar / play / the / can / .
……………………………………
14 Look at the pictures. Write questions and short answers.
[Image descriptions:
1 A boy playing guitar.
2 A girl playing saxophone.
3 A girl playing drums.
4 Children covering their ears.]
1 Can he play the guitar?
Yes, he can.
2 ……………………………
……………………………
3 ……………………………
……………………………
4 ……………………………
……………………………
15 Write the sentences from the box under the pictures.
It’s their guitar.
It’s her guitar.
It’s our guitar.
It’s his guitar.
[Image descriptions show different people with guitars.]
1 ……………………………
2 ……………………………
3 ……………………………
4 ……………………………
16 Write questions and give answers that are true for you.
1 climb a tree
Can you climb a tree?
Yes, I can. / No, I can’t.
2 name 20 cities in Europe
……………………………………
3 say the names of ten British* singers
……………………………………
4 touch your nose with your tongue
……………………………………
5 play the guitar
……………………………………
6 juggle
……………………………………
7 play volleyball
……………………………………
VOCABULARY: *British – aus Großbritannien
LISTENING
Understanding what others can/can’t do
17 Listen and write the names from the box next to the pictures.
Bill
Sarah
Anne
Paul
Zizzi
[Image descriptions: A cat in a tree; a girl standing on her head; a boy playing guitar; a girl playing saxophone; a boy juggling.]
1 ……………………………
2 ……………………………
3 ……………………………
4 ……………………………
5 ……………………………
Page 48
18 Listen again and tick T (True) or F (False).
1 Bill has short hair. T ☐ F ☐
2 Bill can sing and play the guitar. T ☐ F ☐
3 Sarah can play the saxophone. T ☐ F ☐
4 Sarah can walk on her hands. T ☐ F ☐
5 Bill’s mum can’t stand on her head. T ☐ F ☐
6 Bill’s mum can play the guitar. T ☐ F ☐
7 Bill’s dad can touch his nose with his tongue. T ☐ F ☐
8 Bill’s dad can juggle. T ☐ F ☐
9 Zizzi can sing. T ☐ F ☐
10 Zizzi likes to climb trees. T ☐ F ☐
READING & WRITING
What you and others can or can’t do
19 Read the dialogue and complete it with the words from the box.
sing
I
play
am
can’t
Bye
you
their
Lisa Are you in Project 11?
Pete Yes, I 1 ………………… .
Lisa Wow, they’re great.
Pete Thanks.
Lisa Are 2 ………………… the singer?
Pete No, I’m not. I can’t 3 ………………… .
Lisa Are you the keyboard player?
Pete No. I 4 ………………… play the keyboard.
Lisa Are you the guitarist?
Pete No. 5 ………………… can’t play the guitar.
Lisa Are you the saxophone player?
Pete No. I can’t 6 ………………… the saxophone.
Lisa What are you?
Pete Me? I carry 7 ………………… instruments.
Lisa Oh! Oh, well … I must go. 8 ………………… .
21 Read the dialogue in 19 again and tick the correct sentences.
1 Pete is in Project 11. ☐
2 Lisa is in Project 11. ☐
3 Pete is the keyboard player. ☐
4 Pete can’t play the guitar. ☐
5 Pete can play the saxophone. ☐
6 Pete can carry their instruments. ☐
Page 49
22 CHOICES
A Look at the pictures and write short answers.
1 Can James touch his nose with his tongue?
Yes, he can.
2 Can Jessica juggle?
……………………………
3 Can Ellie wiggle her ears?
……………………………
4 Can Dan climb the tree?
……………………………
5 Can Steve walk on his hands?
……………………………
6 Can Jack stand on his head?
……………………………
B Read the text. Then write a text about yourself.
My talents
I can touch my nose with my tongue. I can juggle and I can stand on my head. But I can’t wiggle my ears, I can’t climb trees and I can’t walk on my hands.
DIALOGUE WORK
Asking for help and repetition
23 CHOICES
A Put the dialogue in the correct order. Then listen and check.
☐ Anna Can you help me?
☐ Anna I can’t find my cap.
☐ Dan It’s on your head.
☐ Dan Yes, of course. What’s the problem?
B Complete the dialogue with the sentences from the box. Then listen and check.
Look under the sofa.
My book. I can’t find it.
Can you help me?
Can you help me, Beth?
It’s missing.
Owen 1 ……………………………
Beth Sorry?
Owen 2 ……………………………
Beth Yes, of course. What’s the problem?
Owen 3 ……………………………
Beth Pardon?
Owen My book. 4 ……………………………
Beth OK. 5 ……………………………
Owen Ah, here it is.
24 Complete the dialogue with your own ideas.
Tim …………………………………………
Ruth Pardon?
Tim …………………………………………
Ruth Sorry?
Tim …………………………………………
Ruth Yes, of course. What’s the problem?
Tim …………………………………………
Ruth OK.
Tim …………………………………………
Ruth OK, but it’s not there.
Page 48
WORD FILE
 Musicians and instruments
[Image description: A cartoon band performing. Labels point to people and instruments: keyboard player, keyboard, singer, drummer, drums, saxophone player, saxophone, guitarist, guitar. A dog is lying on the floor to the left.]
MORE Words and Phrases
2
 boyfriend
 Jack is her boyfriend.
 fester Freund
its
 This is my band. Its name is Project 11.
 sein/e; ihr/e
to play
 They play the guitar.
 spielen
sister
 Jessica is my sister.
 Schwester
3
 can, cannot / can’t
 She can play the drums. He can’t sing.
 können, nicht können
concert
 Let’s go to the concert tomorrow.
 Konzert
to dance
 Let’s dance to the music!
 tanzen
Don’t worry.
 Keine Sorge.
job
 She has a good job.
 Arbeit; Aufgabe
perfect
 The job is perfect for you.
 perfekt
7
 to carry
 Can you carry my guitar?
 tragen
8
 to stand on
 I can stand on my head.
 auf etwas stehen
tongue
 He can touch his nose with his tongue.
 Zunge
to touch
 Please don’t touch my guitar.
 berühren
to walk on
 Can you walk on your hands?
 auf etwas gehen
to wiggle
 He can wiggle his ears.
 wackeln
9
 can
 Look, he carries fifteen cans.
 Dose
to drink
 I can’t drink fifteen cans.
 trinken
hundred
 Can you eat a hundred apples?
 hundert
in one go
 Can you drink five cans in one go?
 in einem Zug, auf einmal
Is that so?
 Ach wirklich?
12
 This is me.
 Das bin ich.
economy
 The economy is the world of money.
 Wirtschaft
hospital
 The Clown Doctors go to hospitals and help children.
 Krankenhaus
to laugh
 They make children laugh.
 lachen
(pocket) money
 I get my pocket money from my mum and dad.
 (Taschen-)Geld
pound
 A cup of apple juice is 2 pounds.
 Pfund
profit
 It’s 120 pounds. That’s my profit.
 Gewinn, Profit
school canteen
 We have apple juice in our school canteen.
 Schulkantine
table
 I put a table in our playground.
 Tisch
teacher
 Mr Davis is my teacher at school.
 Lehrer/Lehrerin
uncle
 My uncle is my dad’s brother.
 Onkel
to wash
 I wash my mum’s car.
 waschen
nothing
 There’s nothing in the garden.
 nichts
Sorry?
 Entschuldigung?, Wie bitte?

```

## Output contract

Write `content/corpus/units/g1-u05/gen/vocab.draft.json`:

```jsonc
{
  "schema": "vocab-draft@1",
  "slug": "g1-u05",
  "briefBank": "22c58d7186e1",
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
