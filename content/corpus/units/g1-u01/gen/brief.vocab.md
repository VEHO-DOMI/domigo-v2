# Vocab generation brief — g1-u01 (MORE! 1, Unit 1)

<!-- domigo:gen vocab g1-u01 bank=6b8c1ede4887 prompt=346902f9f0f1 -->

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
| g1u01.w.sound-system | sound system | Soundsystem ; Musikanlage | wordfile | — | — | — | sound system |
| g1u01.w.projector | projector | Projektor ; Beamer | wordfile | — | — | — | projector |
| g1u01.w.board | board | Tafel | wordfile | — | — | — | board |
| g1u01.w.window | window | Fenster | wordfile | — | — | — | window |
| g1u01.w.door | door | Tür | wordfile | — | — | — | door |
| g1u01.w.desk | desk | Schreibtisch ; Pult | wordfile | — | — | — | desk |
| g1u01.w.scissors | scissors | Schere | wordfile | — | — | — | scissors |
| g1u01.w.ruler | ruler | Lineal | wordfile | — | — | — | ruler |
| g1u01.w.tablet | tablet | Tablet | wordfile | — | — | — | tablet |
| g1u01.w.chair | chair | Stuhl ; Sessel | wordfile | — | — | — | chair |
| g1u01.w.school-bag | school bag | Schultasche | wordfile | — | — | — | school bag |
| g1u01.w.pen | pen | Kugelschreiber | wordfile | — | — | — | pen |
| g1u01.w.exercise-book | exercise book | Heft | wordfile | — | — | — | exercise book |
| g1u01.w.pencil-case | pencil case | Federmäppchen | wordfile | — | — | — | pencil case |
| g1u01.w.pencil | pencil | Bleistift | wordfile | — | — | — | pencil |
| g1u01.w.rubber | rubber | Radiergummi | wordfile | — | — | — | rubber |
| g1u01.w.book | book | Buch | wordfile | — | — | — | book |
| g1u01.w.hairband | hairband | Haarreif ; Stirnband | wordfile | — | — | — | hairband |
| g1u01.w.sunglasses | sunglasses | Sonnenbrille | wordfile | — | — | — | sunglasses |
| g1u01.w.hat | hat | Hut | wordfile | — | — | — | hat |
| g1u01.w.school-tie | school tie | Schulkrawatte | wordfile | — | — | — | school tie |
| g1u01.w.shirt | shirt | Hemd | wordfile | — | — | — | shirt |
| g1u01.w.sweater | sweater | Pullover | wordfile | — | — | — | sweater |
| g1u01.w.skirt | skirt | Rock | wordfile | — | — | — | skirt |
| g1u01.w.socks | socks | Socken | wordfile | — | — | — | socks |
| g1u01.w.shoe | shoe | Schuh | wordfile | — | — | — | shoe |
| g1u01.w.to-give | to give | geben | phrase | — | Give me your school bag. | give | to give ; give |
| g1u01.w.time | time | Zeit | phrase | — | It's time for school. | — | time |
| g1u01.w.to-understand | to understand | verstehen | phrase | — | I understand the question. | understand | to understand ; understand |
| g1u01.w.to-write | to write | schreiben | phrase | — | Write the numbers. | write | to write ; write |
| g1u01.w.to-enjoy | to enjoy | genießen | phrase | — | Enjoy the music. | enjoy | to enjoy ; enjoy |
| g1u01.w.to-listen | to listen | zuhören | phrase | — | Listen to the song. | listen | to listen ; listen |
| g1u01.w.to-love | to love | lieben | phrase | — | I love blue. It's my favourite colour. | love | to love ; love |
| g1u01.w.more | more | mehr | phrase | — | I want more! | — | more |
| g1u01.w.to-read | to read | lesen | phrase | — | Read the text. | read | to read ; read |
| g1u01.w.their | their | ihr/e | phrase | — | What's their address? | — | their |
| g1u01.w.to-ask | to ask | fragen | phrase | — | Can I ask you a question? | ask | to ask ; ask |
| g1u01.w.address | (email) address | (E-Mail-)Adresse | phrase | — | My email address is sara@linkways.com. | — | address ; address email |
| g1u01.w.how-are-you | How are you? | Wie geht es dir/Ihnen/euch? | phrase | — | — | — | How are you? |
| g1u01.w.i-am-fine | I am (= I'm) fine. | Es geht mir gut. | phrase | — | — | — | I am fine. |
| g1u01.w.to-meet | to meet | kennenlernen ; sich treffen | phrase | — | Nice to meet you! | meet | to meet ; meet |
| g1u01.w.then | then | dann ; danach | phrase | — | Listen to the dialogue. Then read it. | — | then |
| g1u01.w.your | your | dein/e ; Ihr/e ; euer/eure | phrase | — | What's your email address? | — | your |
| g1u01.w.to-look | to look | sehen ; schauen ; Schau mal. | phrase | — | Look at the animals. | look | to look ; look |
| g1u01.w.or | or | oder | phrase | — | Tick or correct the numbers. | — | or |
| g1u01.w.to-eat | to eat | essen ; fressen | phrase | — | I eat insects. | eat | to eat ; eat |
| g1u01.w.to-go | to go | gehen | phrase | — | I must go. Bye. | go | to go ; go |
| g1u01.w.must | must | müssen | phrase | — | I must go. | — | must |
| g1u01.w.how-many | how many | wie viele | phrase | — | How many frogs can you see? | — | how many |
| g1u01.w.to-hate | to hate | hassen ; nicht ausstehen können | phrase | — | I hate pink. | hate | to hate ; hate |
| g1u01.w.here | here | hier | phrase | — | Here's your pencil case. | — | here |
| g1u01.w.it | it | es | phrase | — | It's yellow. | — | it |
| g1u01.w.let-s | Let's … | Lass(t) … | phrase | — | Let's sing a song! | — | Let's … |
| g1u01.w.midnight | midnight | Mitternacht | phrase | — | It's twelve o'clock – midnight. | — | midnight |
| g1u01.w.our | our | unser/e | phrase | — | This is our school. | — | our |
| g1u01.w.favourite | favourite | Lieblings- | phrase | — | Green is my favourite colour. | — | favourite |
| g1u01.w.to-find | to find | finden | phrase | — | Can you find my school tie? | find | to find ; find |
| g1u01.w.light | light | hell | phrase | — | My favourite colour is light blue. | — | light |
| g1u01.w.child | child | Kind | phrase | — | The child is in class 1A. | — | child |
| g1u01.w.to-clean | to clean | sauber machen ; putzen | phrase | — | Clean the board. | clean | to clean ; clean |
| g1u01.w.to-close | to close | schließen ; zumachen | phrase | — | Close the door. | close | to close ; close |
| g1u01.w.to-open | to open | öffnen ; aufmachen | phrase | — | Open the window. | open | to open ; open |
| g1u01.w.picture | picture | Bild | phrase | — | Look at the pictures. | — | picture |
| g1u01.w.to-sit-down | to sit down | sich (hin-)setzen | phrase | — | Sit down, children. | sit down | to sit down ; sit down |
| g1u01.w.to-speak | to speak | sprechen | phrase | — | Don't speak. Listen. | speak | to speak ; speak |
| g1u01.w.to-stand-up | to stand up | aufstehen | phrase | — | Don't stand up. Sit down. | stand up | to stand up ; stand up |
| g1u01.w.to-take-out | to take out | herausnehmen | phrase | — | Take out your books. | take out | to take out ; take out |
| g1u01.w.class | class | (Schul-)Klasse | phrase | — | I'm in class 1A. | — | class |

### Allowed vocabulary (the deterministic level gate enforces exactly this)

Cumulative bank — every headword below (plus its inflections and listed forms) is taught:

- **g1-u01**: sound system, projector, board, window, door, desk, scissors, ruler, tablet, chair, school bag, pen, exercise book, pencil case, pencil, rubber, book, hairband, sunglasses, hat, school tie, shirt, sweater, skirt, socks, shoe, to give, time, to understand, to write, to enjoy, to listen, to love, more, to read, their, to ask, (email) address, How are you?, I am (= I'm) fine., to meet, then, your, to look, or, to eat, to go, must, how many, to hate, here, it, Let's …, midnight, our, favourite, to find, light, child, to clean, to close, to open, picture, to sit down, to speak, to stand up, to take out, class

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Ahmed, Arbeit, Befehlsformen, Betty, Box, Carina, Carl, Chloe, Classroom, Dave, Dialog, Don, English, Freddy, Gordon, Homework, Imperatives, Irregular, Jenny, Julia, Leah, Mail, Mike, Nice, Nomen, Number, Numbers, Plural, Reihenfolge, School, Sue, Well, Zahlen

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## v1 seeds (UNTRUSTED — mine for ideas, never copy unverified)

Known v1 defect classes: invented above-level carrier words, out-of-bank MC distractors, over-strict answers.

- `g1u01.w.sound-system` ← v1 `sound system`: d="a machine that plays music loudly" · s="We turned on the loud _____ for the party so everyone could hear the music." · a=[] · mc=["projector","keyboard","microphone"]
- `g1u01.w.projector` ← v1 `projector`: d="a machine that shows pictures on a wall" · s="The teacher used the _____ to show a film on the white wall screen." · a=["beamer"] · mc=["printer","camera","microphone"]
- `g1u01.w.board` ← v1 `board`: d="a flat surface for writing in class" · s="The teacher wrote the date on the _____ with a piece of white chalk." · a=["whiteboard","blackboard"] · mc=["desk","floor","window"]
- `g1u01.w.window` ← v1 `window`: d="glass in the wall to look outside" · s="I can see the garden through the open _____. Birds are flying outside." · a=[] · mc=["cupboard","mirror","bookshelf"]
- `g1u01.w.door` ← v1 `door`: d="you open it to go into a room" · s="Please knock on the _____ before you come in and enter the room." · a=[] · mc=["ceiling","floor","carpet"]
- `g1u01.w.desk` ← v1 `desk`: d="a table for reading and writing" · s="My books and pens are on my _____ where I do my homework." · a=[] · mc=["bed","bag","shelf"]
- `g1u01.w.scissors` ← v1 `scissors`: d="a tool for cutting paper" · s="I need my _____ to cut out this picture." · a=[] · mc=["ruler","knife","pen"]
- `g1u01.w.ruler` ← v1 `ruler`: d="a tool for drawing straight lines" · s="Use a _____ to draw a straight line." · a=[] · mc=["pencil","scissors","tape"]
- `g1u01.w.tablet` ← v1 `tablet`: d="a small flat computer with a screen" · s="She plays games on her touchscreen _____ after school. She taps the glass screen." · a=[] · mc=["book","television","calculator"]
- `g1u01.w.chair` ← v1 `chair`: d="you sit on it" · s="Please sit down on your _____ at your desk during the lesson." · a=[] · mc=["floor","table","door"]
- `g1u01.w.school-bag` ← v1 `school bag`: d="a bag for your school things" · s="I put all my books, pens and lunch into my _____ every morning before leaving." · a=["schoolbag"] · mc=["lunch box","wallet","diary"]
- `g1u01.w.pen` ← v1 `pen`: d="you write with it, it uses ink" · s="Can I borrow your blue _____ to write my name in ink on the form?" · a=[] · mc=["pencil","rubber","ruler"]
- `g1u01.w.exercise-book` ← v1 `exercise book`: d="a small book for writing in class" · s="Write the answers to the homework in your _____ with your name on the front." · a=["notebook"] · mc=["textbook","story book","dictionary"]
- `g1u01.w.pencil-case` ← v1 `pencil case`: d="a small bag for pens and pencils" · s="My pens, pencils and ruler are in my small _____ inside my school bag." · a=[] · mc=["backpack","drawer","cupboard"]
- `g1u01.w.pencil` ← v1 `pencil`: d="you write with it, you can rub it out" · s="I drew a picture of a cat with my _____ and then rubbed out a mistake." · a=[] · mc=["pen","marker","chalk"]
- `g1u01.w.rubber` ← v1 `rubber`: d="you use it to rub out pencil marks" · s="I wrote a wrong word with my pencil, so I used my _____ to erase it." · a=["eraser"] · mc=["ruler","sharpener","marker"]
- `g1u01.w.book` ← v1 `book`: d="you read it, it has many pages" · s="I am reading a very funny story _____ with 200 pages and a picture on the cover." · a=[] · mc=["poster","map","letter"]
- `g1u01.w.hairband` ← v1 `hairband`: d="you wear it in your hair" · s="She put a pink _____ around her long hair to keep it out of her face." · a=["hair band"] · mc=["bracelet","necklace","ring"]
- `g1u01.w.sunglasses` ← v1 `sunglasses`: d="dark glasses for sunny days" · s="It is very sunny outside, so I need my dark _____ to protect my eyes." · a=[] · mc=["gloves","umbrella","scarf"]
- `g1u01.w.hat` ← v1 `hat`: d="you wear it on your head" · s="He wears a warm woolly _____ on his head in winter to keep his ears warm." · a=[] · mc=["scarf","coat","jacket"]
- `g1u01.w.school-tie` ← v1 `school tie`: d="a tie you wear with a school uniform" · s="Tom wears a blue _____ around his neck with his white school shirt." · a=[] · mc=["belt","hat","badge"]
- `g1u01.w.shirt` ← v1 `shirt`: d="clothes you wear on the top of your body" · s="He put on a clean white _____ with buttons and a collar for school." · a=[] · mc=["T-shirt","jumper","hoodie"]
- `g1u01.w.sweater` ← v1 `sweater`: d="a warm top with long sleeves" · s="It is cold today, so wear a thick woolly _____ over your shirt." · a=["pullover","jumper"] · mc=["T-shirt","raincoat","swimsuit"]
- `g1u01.w.skirt` ← v1 `skirt`: d="girls and women wear it, it is not trousers" · s="She is wearing a red knee-length _____ today with tights underneath." · a=[] · mc=["coat","shirt","hat"]
- `g1u01.w.socks` ← v1 `socks`: d="you wear them on your feet inside shoes" · s="I put on my clean _____ on my feet and then my shoes every morning." · a=[] · mc=["gloves","hats","scarves"]
- `g1u01.w.shoe` ← v1 `shoe`: d="you wear it on your foot" · s="I lost one _____ and I am hopping on one foot to find the other." · a=[] · mc=["hat","glove","sock"]
- `g1u01.w.to-give` ← v1 `to give`: d="to put something in someone's hand" · s="Please _____ me your pen for a moment and I will hand it back soon." · a=[] · mc=["to take","to keep","to hide"]
- `g1u01.w.time` ← v1 `time`: d="what a clock shows" · s="What _____ is it? It's three o'clock in the afternoon." · a=[] · mc=["date","day","year"]
- `g1u01.w.to-understand` ← v1 `to understand`: d="to know what something means" · s="I don't _____ this word. What does it mean in German?" · a=[] · mc=["to know","to remember","to forget"]
- `g1u01.w.to-write` ← v1 `to write`: d="to put words on paper" · s="Please _____ your full name at the top of the paper with a pen." · a=[] · mc=["to read","to draw","to speak"]
- `g1u01.w.to-enjoy` ← v1 `to enjoy`: d="to like something very much" · s="I really _____ playing football with my friends and always laugh a lot." · a=[] · mc=["to hate","to fear","to try"]
- `g1u01.w.to-listen` ← v1 `to listen`: d="to use your ears to hear something" · s="Please _____ carefully to the teacher now and don't talk." · a=[] · mc=["to speak","to shout","to sing"]
- `g1u01.w.to-love` ← v1 `to love`: d="to like very, very much" · s="I _____ my dog very much. He is my best friend in the whole world." · a=[] · mc=["to dislike","to miss","to need"]
- `g1u01.w.more` ← v1 `more`: d="a bigger number or amount of something" · s="Can I have _____ water in my glass, please? Mine is empty." · a=[] · mc=["less","no","any"]
- `g1u01.w.to-read` ← v1 `to read`: d="to look at words and understand them" · s="I like to _____ story books with interesting words before I go to sleep." · a=[] · mc=["to write","to draw","to speak"]
- `g1u01.w.their` ← v1 `their`: d="belonging to them" · s="The children put _____ bags on the floor next to their own chairs." · a=[] · mc=["my","your","his"]
- `g1u01.w.to-ask` ← v1 `to ask`: d="to say a question to someone" · s="I want to _____ the teacher a question about my homework." · a=[] · mc=["to answer","to tell","to show"]
- `g1u01.w.address` ← v1 `address`: d="where someone lives or an email name" · s="What is your email _____? I want to send you a message online." · a=["email address"] · mc=["name","age","birthday"]
- `g1u01.w.how-are-you` ← v1 `How are you?`: d="a question about how someone feels" · s="Hello, Tom! _____ 'I'm fine, thanks' is my usual reply." · a=[] · mc=["What's your name?","How old are you?","Where are you from?"]
- `g1u01.w.to-meet` ← v1 `to meet`: d="to see someone for the first time" · s="Nice to _____ you for the first time! My name is Anna." · a=[] · mc=["to see","to know","to call"]
- `g1u01.w.then` ← v1 `then`: d="after that, next" · s="First, read the text. _____ answer the questions at the bottom." · a=[] · mc=["yesterday","last","before"]
- `g1u01.w.your` ← v1 `your`: d="belonging to you" · s="Is this _____ pencil or is it mine? It was on your desk." · a=[] · mc=["his","her","their"]
- `g1u01.w.to-look` ← v1 `to look`: d="to use your eyes to see something" · s="_____ at this beautiful picture on the wall! Can you see the colours?" · a=[] · mc=["to hear","to touch","to taste"]
- `g1u01.w.or` ← v1 `or`: d="a word to give a choice between two things" · s="Do you want tea _____ milk with your cake? You choose one." · a=[] · mc=["and","but","so"]
- `g1u01.w.to-eat` ← v1 `to eat`: d="to put food in your mouth" · s="I am very hungry. I want to _____ a sandwich with ham and cheese." · a=[] · mc=["to drink","to sleep","to play"]
- `g1u01.w.to-go` ← v1 `to go`: d="to move from one place to another" · s="I _____ to school every morning at eight o'clock on foot." · a=[] · mc=["to stay","to come","to sleep"]
- `g1u01.w.must` ← v1 `must`: d="to have to do something" · s="It is late. I _____ go home now." · a=[] · mc=["can","should","may"]
- `g1u01.w.how-many` ← v1 `how many`: d="asking about the number of something" · s="_____ cats do you have at home? I have three." · a=[] · mc=["how long","how old","how often"]
- `g1u01.w.to-hate` ← v1 `to hate`: d="to not like at all" · s="I really _____ getting up early in the morning. It is the worst part of my day." · a=[] · mc=["to love","to enjoy","to miss"]
- `g1u01.w.here` ← v1 `here`: d="in this place" · s="Come _____ to me! I want to show you something on my phone." · a=[] · mc=["there","away","up"]
- `g1u01.w.it` ← v1 `it`: d="a word for a thing or animal" · s="I have a pet cat. _____ is black and white and has long whiskers." · a=[] · mc=["he","she","they"]
- `g1u01.w.let-s` ← v1 `Let's`: d="a word to suggest doing something together" · s="_____ go to the park together after lunch and play football!" · a=["Let us"] · mc=["I","He","They"]
- `g1u01.w.midnight` ← v1 `midnight`: d="twelve o'clock at night" · s="It is _____, exactly 12 o'clock at night, and everyone is fast asleep." · a=[] · mc=["morning","noon","afternoon"]
- `g1u01.w.our` ← v1 `our`: d="belonging to us" · s="This is _____ classroom where all of us in class 1A learn together." · a=[] · mc=["their","his","her"]
- `g1u01.w.favourite` ← v1 `favourite`: d="the one you like the most" · s="Blue is my _____ colour — I love it more than any other colour in the world." · a=["favorite"] · mc=["last","worst","second"]
- `g1u01.w.to-find` ← v1 `to find`: d="to see something you were looking for" · s="I can't _____ my red pen anywhere. Have you seen it?" · a=[] · mc=["to lose","to drop","to throw"]
- `g1u01.w.light` ← v1 `light`: d="not dark, a pale colour" · s="Her eyes are _____ blue, almost the colour of the sky on a sunny day." · a=[] · mc=["dark","bright","deep"]
- `g1u01.w.child` ← v1 `child`: d="a young person, a boy or a girl" · s="Every _____ in the class — Tom, Anna, Max — got a new book from the teacher." · a=[] · mc=["grown-up","parent","teacher"]
- `g1u01.w.to-clean` ← v1 `to clean`: d="to make something not dirty" · s="Please _____ the dirty board with the cloth after the lesson." · a=[] · mc=["to draw on","to write on","to decorate"]
- `g1u01.w.to-close` ← v1 `to close`: d="to shut something" · s="It is cold in here. Please _____ the open window to keep the warm air in." · a=["shut"] · mc=["to open","to break","to paint"]
- `g1u01.w.to-open` ← v1 `to open`: d="to make something not closed" · s="Please _____ your closed books now and turn to page ten." · a=[] · mc=["to close","to break","to hide"]
- `g1u01.w.picture` ← v1 `picture`: d="a drawing, painting, or photo" · s="She drew a beautiful _____ of her family with coloured pencils on paper." · a=[] · mc=["story","song","video"]
- `g1u01.w.to-sit-down` ← v1 `to sit down`: d="to move your body onto a chair" · s="Please _____ on your chair and be quiet for the lesson." · a=[] · mc=["to stand up","to jump up","to run"]
- `g1u01.w.to-speak` ← v1 `to speak`: d="to say words, to talk" · s="Please don't _____ during the test. Keep quiet and write your answers." · a=["talk"] · mc=["to sleep","to eat","to stand"]
- `g1u01.w.to-stand-up` ← v1 `to stand up`: d="to get up from a chair" · s="Please _____ from your chair when the teacher comes into the room." · a=[] · mc=["to sit down","to lie down","to kneel"]
- `g1u01.w.to-take-out` ← v1 `to take out`: d="to get something from inside a bag" · s="Please _____ your exercise books from your school bags and put them on your desks." · a=[] · mc=["to put away","to throw away","to give back"]
- `g1u01.w.class` ← v1 `class`: d="a group of students who learn together" · s="There are twenty children in our _____ 1A. Our teacher is Mrs. Smith." · a=[] · mc=["school","town","club"]

## Unit transcripts (textbook sentences live here — use them first)

```
----- SB: SB Unit 1- Time for school.txt -----
Page 8
Unit 1: Time for school
At the end of unit 1 ...
you know ☐ the alphabet ☐ the numbers 1–25 ☐ plural nouns / irregular plurals ☐ 10 words for colours, 11 school things and 11 classroom objects ☐ how to use imperatives (Befehlsformen)
you can ☐ meet and greet people ☐ understand and spell names / email addresses ☐ read and understand a short story about animals ☐ understand a short video about school uniforms ☐ understand, ask and answer simple questions ☐ understand and give instructions (Anweisungen) ☐ write about you and your classroom
A SONG 4 U
1/1+2 🔊 1 Listen and sing.
I want MORE!
[Image description: A photograph showing five diverse children standing against a blackboard, raising their arms in celebration]
Don't be shy, it's fun to speak. Say it in English, speak all week. Come on, listen, read and write. English only – day and night.
Hey, give me more, more, more. Really more, more, more? Give me more every day. Give me MORE! – that's the way!
English words are really cool. Grammar isn't just for school. Hello, world – here we come. We speak English, play the drum.
Hey, give me more, more, more. Really more, more, more? Give me more every day. Give me MORE! – that's the way!
From north to south, from east to west. We love our English, we're the best.
Hey, give me more, more, more. Really more, more, more? Give me more every day. Give me MORE! – that's the way!
Meet young people everywhere. Talk to them – here and there. Enjoy it and communicate. Every day and that is great.
Hey, give me more, more, more. Really more, more, more? Give me more every day. Give me MORE! – that's the way!
Pages 9
LISTENING & SPEAKING Asking someone to spell their name / email address
1/3 🔊 2 Listen and repeat the alphabet.
[Image description: Colorful alphabet letters A through Z displayed in a decorative style across multiple rows]
1/4 🔊 3 Listen and circle the correct letters in 2.
4 C H O I C E S
1/5 🔊 Listen to the dialogues. Then read them out in pairs.
A DIALOGUE 1
[Image description: Illustration of a boy and girl in school uniforms having a conversation]
Boy Hi, I'm Ahmed. What's your name? Girl I'm Chloe. Boy Nice to meet you, Clara. Girl Erm ... my name's Chloe. C – h – l – o – e. Boy Oh, I'm sorry. Girl That's OK, Ahmed.
B DIALOGUE 2
[Image description: Illustration of a girl and boy having a conversation, with the girl holding a phone]
Girl Hi, Noah. What's your email address? Boy It's noah11@zpin.com. Girl Can you spell it, please? Boy Yes, sure. N – o – a – h – one – one – at – z – p – i – n – dot – c – o – m. Girl Thank you.
👥 5 Work with a partner. Create a dialogue and act it out.
🔵 WB p. 8, 10
Page 10
VOCABULARY Numbers
1/6 🔊 6 Listen. Then write the numbers.
six twenty-two seventeen eight twelve fifteen ~~two~~
[Image description: Circular badges with numbers 1-25 displayed in a creative, colorful design:
one, two (crossed out), three, four, five, six (space for answer), seven
eight (space for answer), nine, ten, eleven, twelve (space for answer), thirteen
fourteen, fifteen (space for answer), sixteen, seventeen (space for answer), eighteen, nineteen
twenty, twenty-one, twenty-two (space for answer), twenty-three, twenty-four, twenty-five]
1/7 🔊 7 Look and count. Tick or correct the numbers. Then listen and check.
☑ 8 babies ☐ 12 frogs ☐ 25 balls ☐ 1 cat ☐7☒ bears ☐ 17 apples ☐ 7 dogs ☐ 12 fish
[Image description: A detailed illustration showing multiple brown teddy bears arranged together with various small animals including babies, frogs, ducks, and cats interspersed among them]
🔵 WB p. 4, 6
Page 11
READING
📖 8 a Look. What's the frog's name? ..........................................
b Read the story.
Note I'm = I am What's = What is
The wide-mouthed frog
[Image description: Illustration of a frog character with speech bubble saying "Hi. I'm a wide-mouthed frog!"]
Frog Hi. How are you? Gorilla I'm fine, thanks. What's your name? Frog I'm Freddy. I'm a wide-mouthed frog and I eat insects. And you? Gorilla I'm Gordon. I'm a gorilla and I eat bananas. Frog Well, nice to meet you! Bye, gorilla! Gorilla Bye, frog!
[Image description: Illustration showing a frog talking to a bear]
Frog Hi. How are you? Bear I'm fine, thanks. What's your name? Frog I'm Freddy. I'm a wide-mouthed frog and I eat insects. And you? Bear I'm Betty. I'm a bear and I eat honey. Frog Well, nice to meet you! Bye, bear! Bear Bye, frog!
[Image description: Illustration showing a frog talking to a crocodile with speech bubble saying "Oh, oh, oh! Well. I must go. Bye!"]
Frog Hi. How are you? Crocodile I'm fine, thanks. What's your name? Frog I'm Freddy. I'm a wide-mouthed frog and I eat insects. And you? Crocodile I'm Carl. I'm a crocodile and I eat ... wide-mouthed frogs! Frog Oh, oh, oh! Well. I must go. Bye!
9 How many of these tasks can you do?
Choose the correct answer. 1 Freddy is a ☐ frog. ☐ bear. ☐ crocodile. 2 Frogs eat ☐ honey. ☐ insects. ☐ bananas.
Answer the questions. 3 What animal is Betty? ............................................................. 4 What animal is Carl? .............................................................
Circle T (True) or F (False). 5 Carl eats honey. T / F 6 The wide-mouthed frog is not happy. T / F
1/8+9 🔊 10 Check your answers with a partner. Then listen to the story.
🔵 WB p. 9 🌐 CYBER Homework 1
Page 12
VOCABULARY School things
1/10 🔊 11 Listen and point. Then number the words.
☐ glue stick ☐ rubber ☐ pencil sharpener ☐ pen ☐ exercise book ☐ watercolours ☐ ruler ☐ scissors ☐ pencil case ☐ paintbrush ☐ pencil
[Image description: Illustration of a desk with various school supplies numbered 1-11, including a pencil case, ruler, watercolors, scissors, rubber, pencil, paintbrush, and other items]
LISTENING
1/11 🔊 12 a Look. What's the problem? b Listen and colour.
Midnight in the classroom
[Image description: Illustration of a nighttime classroom scene with animated school supplies. A speech bubble says "I hate pink!"]
red yellow blue orange green brown pink white black grey
🔵 WB p. 4 🌐 CYBER Homework 2
Page 13
OUR YOUNG WORLD 1
▶️ Luna's school uniform
[Image description: Photo of a young girl in school uniform standing in a classroom]
▶️ 1 Watch the video. What colour is Luna's tie? What's on it? .................................................................................................................................................................
▶️ 2 Watch again. Read the words and number the pictures.
1 hairband [Letters A-L labeling various clothing items in images] 2 hat 3 jeans 4 shirt 5 skirt 6 socks 7 sunglasses 8 T-shirt 9 tie 10 sweater 11 blazer 12 shoes
VOCABULARY: *introduce – (sich/jdn.) vorstellen; dark – dunkel; light – hell
School ties
1/12 🔊 3 Listen. Then read the texts and number them 1–4. Then say.
[Image description: Photo of a smiling young girl with speech bubble saying "Leah's tie is number ..."]
Note it's = it is
Hello, I'm Leah. I go to West Moors Middle School. My school tie is green and white. Can you find it?
Hi, I'm Leo. My school is Chester Comprehensive. My school tie is orange and black. Can you find it?
Hi, I'm Ellen. I go to St. Peter's School in York. My school tie is red, white and blue. Can you find it?
I'm Freddie. My school is the City of London School. Can you find my school tie? It's yellow and grey.
[Image description: Four different school ties numbered 1-4 showing different color patterns]
CYBER PROJECT: Our school uniform
4 Create a school uniform for your school: ● Make a school tie. ● Make a video.
🌐 CYBER Project 1
Page 14
VOCABULARY Classroom objects
Note isn't = is not
1/13 🔊 13 Listen. Are the sentences correct? Write ☑ or ☒.
[Image description: Classroom scene with numbered items 1-11 and two student photos with speech bubbles saying "Number 10 is correct." and "Number 8 isn't correct."]
1 window ☐ 2 projector ☐ 3 door ☐ 4 board ☐ 5 sound system ☐ 6 desk ☐ 7 tablet ☐ 8 chair ☒ 9 English book ☐ 10 floor ☑ 11 school bag ☐
👥 14 Work in pairs. Cover up 13. Can you remember?
What colour is the chair? It's brown and red.
LISTENING Understanding and giving instructions
Note don't = do not
1/14 🔊 15 Listen and number the pictures.
[Image description: Ten small illustrations showing various classroom actions like using a tablet, standing, writing on board, sitting, opening window, etc.]
16 Match the speech bubbles with the pictures in 15. Write the numbers.
Switch on your tablets. ☐ Clean the board. ☐ Don't open your books. ☐
Open the window. ☐ Sit down, children. ☐ Don't speak. ☐ Don't stand up. ☐
Close the door. ☐ Take out your books. ☐ Switch off your tablets. ☐
🔵 WB p. 5, 7, 8
Page 15
SOUNDS RIGHT /z/
1/15 🔊 17 Listen and repeat.
[Image description: Illustrations showing children playing with balls and frogs]
A baby, a ball, a bear and a dog.
2 babies, 3 balls, 4 bears and 5 frogs.
WRITING
18 Read Mike's text. Then write your own text and draw a picture.
[Image description: Photo of a young boy with glasses]
I'm Mike. I'm ten. I'm in class 1A. My email address is mike@linkways.com. In my classroom, the floor is green. The desks and the chairs are brown and black. The door is light green and the board is white. My pencil case is blue and red. Red is my favourite colour.
GRAMMAR
▶️ Plural nouns (Mehrzahlformen) + irregular plurals (1)
Du bildest den Plural von Nomen üblicherweise, indem du ein -s an das Nomen hängst.
a dog – 4 dogs a bear – 7 bears
🔍 Kannst du im Text auf S. 11 (The wide-mouthed frog) drei unterschiedliche Nomen im Plural finden? Wie heißen sie?
Wenn ein Nomen auf einen Konsonanten + y endet (z. B. -by), schreibt man die Pluralendung so:
a baby – 8 babies (y → ies) Aber: a boy – 3 boys
Achtung: Es gibt auch Ausnahmen!
a child – five children a fish – three fish
▶️ Questions (Fragen)
So fragst du nach dem Namen, der E-Mail-Adresse und wie es jemandem geht:
What's your name? – I'm Sue. (I am ...) What's your email address? / Can you spell it, please? How are you? – I'm fine, thanks. And you?
▶️ Imperatives (Befehlsformen)
So sagst du, dass jemand etwas tun soll:
Stand up! Close the window! Open your books! Take out your books!
So sagst du, dass jemand etwas nicht tun soll:
Don't stand up! (Do not ...!) Don't open your books! Don't close the window! Don't take out your books!
🔍 Suche in Übung 16 einen weiteren Satz, in dem ausgedrückt wird, dass jemand etwas nicht tun soll.
Schreibe den Satz hier auf: ............................................................................ .......................................................................................
⏪ Now go back to page 8. Check ☑ with a partner what you know / can do.
🔵 WB p. 6, 7, 8 🌐 CYBER Homework 3


----- WB: WB Unit 1 Time for school.txt -----
Unit 1: Time for school
Page 4
UNDERSTANDING VOCABULARY Numbers / Colours / School things
1 Verbinde die Wörter mit den Zahlen.
two seventeen
twenty-five twenty twelve
eight twenty-four eleven
five fifteen three
2 Schreib die Zahlwörter.
A 21
B 23
C 2
D 17
E 5
F 25
G 9
H 18
I 13
J 7
K 4
L 14
A ........................................................
B ........................................................
C ........................................................
D ........................................................
E ........................................................
F ........................................................
G ........................................................
H ........................................................
I ........................................................
J ........................................................
K ........................................................
L ........................................................
3 Lies die Sätze und mal die Gegenstände an.
Colour the pencil sharpener blue.
Colour the paintbrush red and brown.
Colour the rubber green and yellow.
Colour the pencil grey and blue.
Colour the glue stick yellow.
Colour the exercise book orange and blue.
Colour the scissors pink and brown.
Colour the watercolours green and orange.
Colour the pen blue and yellow.
Colour the ruler grey.
Colour the pencil case green, red and yellow.
Page 5
USING VOCABULARY Classroom objects
4 Schreib die richtigen Wörter.
[Image description: A classroom scene with desks, chairs, bags and classroom equipment. Numbered labels (1–11) point to objects in the picture for naming.]
1 ........................................................
2 ........................................................
3 ........................................................
4 ........................................................
5 ........................................................
6 ........................................................
7 ........................................................
8 ........................................................
9 ........................................................
10 ........................................................
11 ........................................................
5 Erkenne die Wörter aus 4 und schreib sie in die Liste.
board tablet chair door
floor window desk
sound system school bag projector English book
........................................................
........................................................
........................................................
........................................................
........................................................
........................................................
Page 6
UNDERSTANDING GRAMMAR Plural nouns / Irregular plurals
6 Hake an, was richtig ist. Kreuze an und bessere aus, was falsch ist.
[Image description: A large illustration showing many animals: gorillas, bears, frogs, cats, dogs, insects, crocodiles and fish in different quantities.]
☑ 8 gorillas
☒ 6 bears
☐ 11 frogs
☐ 19 insects
☐ 9 cats
☐ 7 dogs
☐ 1 fish
☐ 6 crocodiles
USING GRAMMAR Plural nouns / Irregular plurals
7 Schreib die Wörter aus der Box im Plural unter das richtige Bild.
fish
gorilla
crocodile
bear
insect
cat
frog
dog
1 ................. frogs
2 ....................................................
3 ....................................................
4 ....................................................
5 ....................................................
6 ....................................................
7 ....................................................
8 ....................................................
8 Schreib die Pluralformen und die Zahlwörter.
book (4) four books
desk (7) ....................................................
baby (2) ....................................................
boy (21) ....................................................
ball (25) ....................................................
banana (13) ....................................................
fish (12) ....................................................
child (19) ....................................................
tablet (11) ....................................................
pencil case (5) ....................................................
Page 7
UNDERSTANDING GRAMMAR Imperatives (Befehlsformen)
9 Ordne die Sätze den Bildern zu. Setze die Zahlen 1–6 ein.
[Image description: Six small pictures showing classroom actions such as taking scissors out, standing up, opening a window, and speaking.]
☐ Don’t speak.
☐ Take out your scissors.
☐ Open the window.
☐ Don’t sit down.
☐ Stand up.
☐ Don’t take out your books.
10 Kreuze die Bilder an, in denen die Anweisungen der Lehrerin nicht richtig befolgt werden.
1 Don’t write on the desk.
2 Close the window.
3 Don’t sing.
4 Take out your pencil case.
5 Don’t stand up.
6 Open the pencil case.
USING GRAMMAR Imperatives (Befehlsformen)
11 Vervollständige die Sätze.
1 ................................................ down.
2 ................................................ up.
3 ................................................ your books.
4 ................................................ your books.
Page 8
12 Bring die Wörter in die richtige Reihenfolge und schreib die Sätze.
1 green. / blue / colour / numbers / the / and
........................................................
2 the / close / don’t / door.
........................................................
3 pencil case / open / out / and / take / a / green pencil. / your
........................................................
4 your / don’t / school bags. / open
........................................................
13 Schreib die Anweisungen.
[Image description: Six pictures showing actions such as keeping quiet, sitting down, standing up, opening a door, closing a door, and not writing on the board.]
1 Don’t speak.
2 ....................................................
3 ....................................................
4 ....................................................
5 ....................................................
6 ....................................................
USING GRAMMAR Questions (Fragen)
14 Schreib die Fragen. Beantworte sie dann.
1 your / What’s / name / ?
........................................................
........................................................
2 email / your / address / What’s / ?
........................................................
........................................................
3 spell / please? / Can / it, / you
........................................................
........................................................
4 How / you / are / ?
........................................................
........................................................
Page 9
READING & WRITING Meeting and greeting people
15 Ergänze die Sätze in den Sprechblasen.
I’m fine
crocodile
I’m a wide-mouthed frog
I’m Gordon
I eat honey
are you
bear
eat bananas
name
eat
eat insects
Bye
[Image description: A cartoon scene with animals (frog, gorilla, bear, crocodile) talking to each other using speech bubbles.]
1 ....................................................
What’s your 2 .................................................... ?
Hi, 3 .................................................... .
I’m a gorilla.
I 4 .................................................... .
And you?
Hi, how 6 .................................................... ?
7 .................................................... thanks. What’s your name?
I’m Freddy. And you?
I’m Betty,
the 8 .................................................... , and
9 .................................................... .
I’m a 10 .................................................... ,
and I 11 .................................................... wide-mouthed frogs.
I must go. 12 .................................................... .
16 Höre dir die Dialoge an und überprüfe deine Arbeit.
Page 10
LISTENING & DIALOGUE WORK Asking/Answering simple questions
17 Höre dir den Dialog an und ergänze ihn.
Sebastian Hi, I’m Sebastian. And what’s your name?
Carina I’m Carina.
Sebastian Hi, Carina. What’s your 1 .................................................... ?
Carina It’s 2 .................................................... .
Sebastian Can you spell it, please?
Carina 3 ... – ... – ... – ... – ... – ... – 9 – @ – ... – ... – ... – ... – ... – ... – ... – ...
... – c – o – ... – ... – ...
Sebastian Thank you.
18 Bring den Dialog in die richtige Reihenfolge. Setze die Zahlen 1–5 ein. Höre dir ihn dann an und überprüfe deine Arbeit.
☐ Dave Hello, Jenny. I’m fine, thanks. And you?
☐ Dave Oh, I must go, Jenny. Bye!
☐ Jenny Bye, Dave.
☑ Jenny Hi, Dave. How are you?
☐ Jenny Great, thanks.
19 CHOICES
A Ergänze den Dialog mit den Wörtern aus der Box. Höre dir ihn dann an und überprüfe deine Arbeit.
is
How
meet
you
Andy Hi, Julia. 1 .................................................... are you?
Julia I’m fine, thanks, Andy. And 2 .................................................... ?
Andy I’m OK, thanks. Julia, this 3 .................................................... Tim.
Tim Hello, Julia.
Julia Hi, Tim. Nice to 4 .................................................... you.
Tim Nice to meet you too.
B Ergänze den Dialog.
Hi, I’m Tony. What’s your name?
1 ....................................................
Nice to meet you, Sue. How are you?
2 ....................................................
I’m great, thanks. Sue, this is Rick.
3 ....................................................
Hi, Sue.
Sorry. I must go. Bye-bye.
4 ....................................................
Bye-bye, Sue!
Page 11
20 Höre dir die Wörter an. Welche dieser Wörter kennst du bereits? Hake sie an.
a
the
and
yes
not
I
you
please
thank you
to say
to sing
boy
girl
school
apple
ball
cat
dog
bear
fish
frog
crocodile
gorilla
insect
honey
T-shirt
Hello!
Bye!
What’s your name?
My name is John.
I’m Joanna.
I’m sorry.
Numbers
1 one
2 two
3 three
4 four
5 five
6 six
7 seven
8 eight
9 nine
10 ten
11 eleven
12 twelve
13 thirteen
14 fourteen
15 fifteen
16 sixteen
17 seventeen
18 eighteen
19 nineteen
20 twenty
21 twenty-one
22 twenty-two
23 twenty-three
24 twenty-four
25 twenty-five
Colours
red
yellow
blue
green
orange
brown
pink
white
black
grey
Page 12
WORD FILE
In the classroom
[Image description: A labelled classroom illustration with yellow tags naming objects such as sound system, projector, board, window, door, desk, scissors, ruler, tablet, chair, school bag, pen, exercise book, pencil case, watercolours, paintbrush, glue stick, pencil sharpener, rubber, pencil, floor.]
Cool clothes
[Image description: Two students in school uniforms walking outside a school building, with labels for hairband, sunglasses, hat, school tie, shirt, sweater, skirt, socks, shoe.]
Page 13
MORE Words and Phrases
to give Give me your school bag. geben
time It’s time for school. Zeit
to understand I understand the question. verstehen
to write Write the numbers. schreiben
1 to enjoy Enjoy the music. genießen
to listen Listen to the song. zuhören
to love I love blue. It’s my favourite colour. lieben
more I want more! mehr
to read Read the text. lesen
2 their What’s their address? ihr/e
4 to ask Can I ask you a question? fragen
(email) address My email address is sara@linkways.com. (E-Mail-)Adresse
How are you? Wie geht es dir/Ihnen/euch?
I am (= I’m) fine. Es geht mir gut.
to meet Nice to meet you! kennenlernen; sich treffen
then Listen to the dialogue. Then read it. dann, danach
your What’s your email address? dein/e; Ihr/e; euer/eure
7 to look Look at the animals. sehen, schauen; Schau mal.
or Tick or correct the numbers. oder
8 to eat I eat insects. essen; fressen
to go I must go. Bye. gehen
must I must go. müssen
9 how many How many frogs can you see? wie viele
12 to hate I hate pink. hassen, nicht ausstehen können
here Here’s your pencil case. hier
it It’s yellow. es
Let’s … Let’s sing a song! Lass(t) …
midnight It’s twelve o’clock – midnight. Mitternacht
our This is our school. unser/e
OWN
favourite Green is my favourite colour. Lieblings-
to find Can you find my school tie? finden
light My favourite colour is light blue. hell
15 child The child is in class 1A. Kind
to clean Clean the board. sauber machen, putzen
to close Close the door. schließen, zumachen
to open Open the window. öffnen, aufmachen
picture Look at the pictures. Bild
to sit down Sit down, children. sich (hin-)setzen
to speak Don’t speak. Listen. sprechen
to stand up Don’t stand up. Sit down. aufstehen
to take out Take out your books. herausnehmen
18 class I’m in class 1A. (Schul-)Klasse

```

## Output contract

Write `content/corpus/units/g1-u01/gen/vocab.draft.json`:

```jsonc
{
  "schema": "vocab-draft@1",
  "slug": "g1-u01",
  "briefBank": "6b8c1ede4887",
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
