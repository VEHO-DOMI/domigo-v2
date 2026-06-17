# Vocab generation brief — g1-u06 (MORE! 1, Unit 6)

<!-- domigo:gen vocab g1-u06 bank=dfbe7bb08bcd prompt=346902f9f0f1 -->

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
| g1u06.w.city | city | Stadt ; Großstadt | wordfile | — | — | — | city |
| g1u06.w.park | park | Park | wordfile | — | — | — | park |
| g1u06.w.street | street | Straße | wordfile | — | — | — | street |
| g1u06.w.market | market | Markt | wordfile | — | — | — | market |
| g1u06.w.supermarket | supermarket | Supermarkt | wordfile | — | — | — | supermarket |
| g1u06.w.river | river | Fluss | wordfile | — | — | — | river |
| g1u06.w.woods | woods | Wald | wordfile | — | — | — | woods |
| g1u06.w.tree | tree | Baum | wordfile | — | — | — | tree |
| g1u06.w.to-jump-into-the-river | to jump into the river | in den Fluss springen | wordfile | — | — | jump into the river | to jump into the river ; jump into the river |
| g1u06.w.to-look-out-the-window | to look out the window | aus dem Fenster schauen | wordfile | — | — | look out the window | to look out the window ; look out the window |
| g1u06.w.to-pick-something-up | to pick something up | etwas aufheben | wordfile | — | — | pick something up | to pick something up ; pick something up |
| g1u06.w.to-sit-in-a-tree | to sit in a tree | auf einem Baum sitzen | wordfile | — | — | sit in a tree | to sit in a tree ; sit in a tree |
| g1u06.w.to-fall-out-of-the-tree | to fall out of the tree | vom Baum fallen | wordfile | — | — | fall out of the tree | to fall out of the tree ; fall out of the tree |
| g1u06.w.to-bump-into-a-tree | to bump into a tree | gegen einen Baum stoßen | wordfile | — | — | bump into a tree | to bump into a tree ; bump into a tree |
| g1u06.w.to-go-to-the-park | to go to the park | in den Park gehen | wordfile | — | — | go to the park | to go to the park ; go to the park |
| g1u06.w.to-pull | to pull | ziehen | wordfile | — | — | pull | to pull ; pull |
| g1u06.w.to-climb-up-a-tree | to climb up a tree | auf einen Baum klettern | wordfile | — | — | climb up a tree | to climb up a tree ; climb up a tree |
| g1u06.w.to-leave-the-office | to leave the office | das Büro verlassen | wordfile | — | — | leave the office | to leave the office ; leave the office |
| g1u06.w.to-look-in-the-mirror | to look in the mirror | in den Spiegel schauen | wordfile | — | — | look in the mirror | to look in the mirror ; look in the mirror |
| g1u06.w.to-climb | to climb | klettern | phrase | — | Sherlock Groans climbs up a tree. | climb | to climb ; climb |
| g1u06.w.to-jump | to jump | hüpfen | phrase | — | A bird jumps on Sherlock Groans' head. | jump | to jump ; jump |
| g1u06.w.to-leave | to leave | verlassen ; weggehen | phrase | — | Doctor Grey leaves the office. | leave | to leave ; leave |
| g1u06.w.mirror | mirror | Spiegel | phrase | — | There is a mirror on a wall. | — | mirror |
| g1u06.w.to-put-on | to put on | aufsetzen ; anziehen | phrase | — | Sherlock puts his hat on. | put on | to put on ; put on |
| g1u06.w.away | away | weg | phrase | — | Go away! | — | away |
| g1u06.w.best | (world's) best | (welt-)bester/beste/bestes | phrase | — | Sherlock Groans is the world's best detective! | — | best ; world's |
| g1u06.w.detective | detective | Detektiv/Detektivin | phrase | — | He's the world's best detective. | — | detective |
| g1u06.w.help-me | Help me! | Hilf mir! | phrase | — | — | — | Help me! |
| g1u06.w.office | office | Büro | phrase | — | He leaves the office. | — | office |
| g1u06.w.to-run | to run | laufen ; rennen | phrase | — | The bird runs away. | run | to run ; run |
| g1u06.w.to-find | to find | finden | phrase | — | The dog finds Sherlock Groans. | find | to find ; find |
| g1u06.w.to-pull-2 | to pull | ziehen | phrase | — | The dog pulls Sherlock Groans out of the river. | pull | to pull ; pull |
| g1u06.w.to-catch | to catch | fangen ; erwischen ; festnehmen | phrase | — | He always catches the bad people. | catch | to catch ; catch |
| g1u06.w.clever | clever | klug ; schlau | phrase | — | Sherlock is really clever. | — | clever |
| g1u06.w.to-come-to | to come to | (zu etwas) hinkommen | phrase | — | He comes to a park. | come to | to come to ; come to |
| g1u06.w.to-live | to live | wohnen ; leben | phrase | — | Peter's grandma lives in York. | live | to live ; live |
| g1u06.w.nice | nice | nett ; schön | phrase | — | The park is nice. | — | nice |
| g1u06.w.a-lot-of-lots-of | a lot of / lots of | viel/e ; jede Menge | phrase | — | There are lots of beautiful trees in the park. | — | a lot of / lots of ; a lot of ; lots of |
| g1u06.w.to-call | to call | (an-)rufen | phrase | — | Sherlock Groans calls Doctor Grey. | call | to call ; call |
| g1u06.w.come-on | Come on! | Komm(t) jetzt! ; Mach(t) schon! | phrase | — | — | — | Come on! |
| g1u06.w.to-solve | to solve | lösen | phrase | — | Detectives solve problems. | solve | to solve ; solve |
| g1u06.w.to-wait | to wait | warten | phrase | — | But … wait … what's that? | wait | to wait ; wait |
| g1u06.w.to-watch | to watch | beobachten ; zuschauen | phrase | — | He watches the people in the streets. | watch | to watch ; watch |
| g1u06.w.street-2 | street | Straße | phrase | — | Anna lives in York Street. | — | street |
| g1u06.w.to-get-up | to get up | aufstehen | phrase | — | He gets up at 7 o'clock in the morning. | get up | to get up ; get up |
| g1u06.w.to-become | to become | werden | phrase | — | Emma becomes a tiger. | become | to become ; become |
| g1u06.w.but-it-s-true | But it's true! | Aber es stimmt! | phrase | — | — | — | But it's true! |
| g1u06.w.go-on | Go on. | weitermachen ; Erzähl weiter! | phrase | — | — | — | Go on. |
| g1u06.w.well-done | Well done. | Gut gemacht. | phrase | — | — | — | Well done. |

### Allowed vocabulary (the deterministic level gate enforces exactly this)

Cumulative bank — every headword below (plus its inflections and listed forms) is taught:

- **g1-u01**: sound system, projector, board, window, door, desk, scissors, ruler, tablet, chair, school bag, pen, exercise book, pencil case, pencil, rubber, book, hairband, sunglasses, hat, school tie, shirt, sweater, skirt, socks, shoe, to give, time, to understand, to write, to enjoy, to listen, to love, more, to read, their, to ask, (email) address, How are you?, I am (= I'm) fine., to meet, then, your, to look, or, to eat, to go, must, how many, to hate, here, it, Let's …, midnight, our, favourite, to find, light, child, to clean, to close, to open, picture, to sit down, to speak, to stand up, to take out, class
- **g1-u02**: tree, monkey, parrot, giraffe, train, penguin, guide, lion, next to, in, behind, under, on, in front of, zoo, beautiful, behind, big, in front of, next to, under, where, small, adult, at, to bring, but, child (pl children), dog, family, free, Grandma, group, long, ticket, to want, from, year, he, she, to talk, they, we, for, happy, to let somebody out, us, car, At last., How strange!, Let me see., stone
- **g1-u03**: finger, ear, nose, hair, eye, mouth, beard, right arm, left arm, shoulder, leg, foot, feet, tooth, teeth, tall, short, big, small, long, also, famous, him, his, ship, to be scared (of), strong, captain, have got / has got, pretty, purple, week, again, back, to paint, sister, boy, girl, man (pl men), woman (pl women), Her name is …, His name is …
- **g1-u04**: cold, angry, happy, scared, excited, hot, bored, sad, hungry, nervous, tired, proud, morning, lunchtime, afternoon, evening, night, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, after, day, end, fun, Go away!, to happen, show, a day in the life of, to be asleep, early, life, still, story, today, Are you OK?, homework (no pl), into, Oh dear!, room, bad, Don't be late., tomorrow, birthday, friend, Be yourself., no one else, bottle, to get back, mad, magic, to break, to go to sleep, because, It's me., Try it!, Let go!, What's happening?
- **g1-u05**: keyboard player, keyboard, singer, drummer, drums, saxophone player, saxophone, guitarist, guitar, boyfriend, its, to play, sister, can, cannot / can't, concert, to dance, Don't worry., job, perfect, to carry, to stand on, tongue, to touch, to walk on, to wiggle, can, to drink, hundred, in one go, Is that so?, This is me., economy, hospital, to laugh, (pocket) money, pound, profit, school canteen, table, teacher, uncle, to wash, nothing, Sorry?
- **g1-u06**: city, park, street, market, supermarket, river, woods, tree, to jump into the river, to look out the window, to pick something up, to sit in a tree, to fall out of the tree, to bump into a tree, to go to the park, to pull, to climb up a tree, to leave the office, to look in the mirror, to climb, to jump, to leave, mirror, to put on, away, (world's) best, detective, Help me!, office, to run, to find, to pull, to catch, clever, to come to, to live, nice, a lot of / lots of, to call, Come on!, to solve, to wait, to watch, street, to get up, to become, But it's true!, Go on., Well done.

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Ahmed, Annie, Arbeit, Bacon, Baker, Befehlsformen, Betty, Bild, Bilder, Blackbeard, Blackie, Bob, Box, Buckingham, Buddy, California, Cambridge, Caribbean, Carina, Carl, Chloe, Christie, Classroom, Clown, Dan, Dana, Daniel, Dave, David, Davis, Dialog, Dialoge, Doctor, Doctors, Don, Ellie, England, English, False, Fido, Frank, Fred, Freddy, George, Gina, Good, Gordon, Great, Grey, Greybeard, Groans, Guess, Harry, Holmes, Homework, Hook, Imperatives, Irregular, Jack, James, Jamie, Jenny, Jessica, Jill, Julia, Jun, Kitty, Leah, Leo, Lewis, London, Lucy, Mail, Manchester, Marple, Mary, Mike, Miss, Mr, Mum, Nibbs, Nice, Nomen, Number, Numbers, Omar, Palace, Pardon, Paws, Pete, Peter, Pirates, Plural, Polly, Possessives, Prepositions, Present, Project, Put, Rajit, Red, Reihenfolge, Richard, Ronald, Saying, School, Sherlock, Steve, Sue, Tamara, Text, Tick, Toby, Tock, Tom, True, Watson, Welcome, Well, Work, Wortes, Wow, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## v1 seeds (UNTRUSTED — mine for ideas, never copy unverified)

Known v1 defect classes: invented above-level carrier words, out-of-bank MC distractors, over-strict answers.

- `g1u06.w.city` ← v1 `city`: d="a very big town" · s="London is a very big _____ with millions of people, tall skyscrapers, and many underground trains." · a=["town"] · mc=["cottage","cabin","hut"]
- `g1u06.w.park` ← v1 `park`: d="a green place in a town with trees" · s="Let's play football on the grass in the _____ after school, near the slides and swings." · a=[] · mc=["office","hospital","classroom"]
- `g1u06.w.street` ← v1 `street`: d="a road in a town with houses" · s="There are many shops selling clothes and food in our busy _____ in the town centre." · a=["road"] · mc=["river","forest","mountain"]
- `g1u06.w.market` ← v1 `market`: d="a place where people buy and sell things" · s="We buy fresh fruit and vegetables from the farmer at the open-air _____ every Saturday morning." · a=[] · mc=["library","gym","pharmacy"]
- `g1u06.w.supermarket` ← v1 `supermarket`: d="a big shop where you buy food" · s="Mum drives to the big _____ to push a trolley and buy food for the whole week." · a=[] · mc=["post office","bus stop","park"]
- `g1u06.w.river` ← v1 `river`: d="water that moves through the land" · s="We go swimming in the clear _____ in summer. The water flows between the two green banks." · a=[] · mc=["bathtub","bucket","swimming pool"]
- `g1u06.w.woods` ← v1 `woods`: d="a place with many trees" · s="We go for a quiet walk in the _____ on Sunday afternoons, among the tall trees and singing birds." · a=["forest"] · mc=["shopping centre","car park","street"]
- `g1u06.w.to-jump-into-the-river` ← v1 `to jump into the river`: d="to leap into the water" · s="It is boiling hot outside! Let's take off our shoes and _____ and swim in the cold water." · a=[] · mc=["to jump on the bed","to jump over the fence","to jump up and down"]
- `g1u06.w.to-look-out-the-window` ← v1 `to look out the window`: d="to see outside through the glass" · s="I _____ from my bedroom and see that it is raining cats and dogs outside." · a=[] · mc=["to look at my feet","to look at my phone","to look under the bed"]
- `g1u06.w.to-pick-something-up` ← v1 `to pick something up`: d="to take something from the ground" · s="There is a shiny coin on the floor next to your shoe. Can you bend down and _____?" · a=[] · mc=["to kick it","to step on it","to ignore it"]
- `g1u06.w.to-sit-in-a-tree` ← v1 `to sit in a tree`: d="to be up in a tree, not moving" · s="The songbird likes to _____ on a high branch and sing to its friends." · a=[] · mc=["to dig a hole","to swim in the pond","to run on the grass"]
- `g1u06.w.to-fall-out-of-the-tree` ← v1 `to fall out of the tree`: d="to drop down from a tree" · s="Be careful on the thin branch up there! You might slip and _____ onto the hard ground!" · a=[] · mc=["to climb into the nest","to grab another branch","to stay safe"]
- `g1u06.w.to-bump-into-a-tree` ← v1 `to bump into a tree`: d="to walk into a tree by mistake" · s="He was looking at his phone and not watching the path, so he _____ in the park and hurt his nose." · a=[] · mc=["to walk around a tree","to sit under a tree","to hide behind a tree"]
- `g1u06.w.to-go-to-the-park` ← v1 `to go to the park`: d="to walk to the green place in town" · s="Let's _____ in the sunshine and play on the swings and slides this afternoon." · a=[] · mc=["to go to bed","to go to the doctor","to go to the dentist"]
- `g1u06.w.to-pull` ← v1 `to pull`: d="to move something towards you" · s="The heavy wooden door is stuck shut. You must _____ the handle very hard towards you to open it." · a=[] · mc=["to push","to close","to lock"]
- `g1u06.w.to-climb-up-a-tree` ← v1 `to climb up a tree`: d="to go up a tree using hands and feet" · s="My pet cat likes to _____ and look down at the birds sitting on the branches." · a=[] · mc=["to dig under a tree","to sleep under a tree","to chop down a tree"]
- `g1u06.w.to-leave-the-office` ← v1 `to leave the office`: d="to go out of the work room" · s="Dad _____ at exactly five o'clock every day when his work is finished, and comes home for dinner." · a=[] · mc=["to arrive at the office","to start work","to sit at the desk"]
- `g1u06.w.to-look-in-the-mirror` ← v1 `to look in the mirror`: d="to see yourself in the glass" · s="She _____ every morning to check her hair and brush her teeth before going to school." · a=[] · mc=["to look at the ceiling","to look under the bed","to look in the fridge"]
- `g1u06.w.to-climb` ← v1 `to climb`: d="to go up using your hands and feet" · s="The monkey children love to _____ up the big rocks in the playground like little mountain goats." · a=[] · mc=["to swim","to fly","to crawl"]
- `g1u06.w.to-jump` ← v1 `to jump`: d="to push yourself up into the air" · s="The small green frog can _____ very high into the air with its long strong back legs." · a=["leap"] · mc=["to swim","to crawl","to sit"]
- `g1u06.w.to-leave` ← v1 `to leave`: d="to go away from a place" · s="We _____ the house at eight o'clock every morning to catch the school bus." · a=[] · mc=["to enter","to stay in","to clean"]
- `g1u06.w.mirror` ← v1 `mirror`: d="a glass where you can see yourself" · s="There is a big round _____ on the bathroom wall. I can see my face in it when I brush my teeth." · a=[] · mc=["window","door","picture"]
- `g1u06.w.to-put-on` ← v1 `to put on`: d="to place clothes on your body" · s="It is cold and windy outside. _____ your warm winter jacket before you go out!" · a=[] · mc=["to take off","to throw away","to fold up"]
- `g1u06.w.away` ← v1 `away`: d="to or at another place, not here" · s="The scared bird flew _____ from the garden when my pet cat came running towards it." · a=[] · mc=["closer","back","to me"]
- `g1u06.w.best` ← v1 `best`: d="better than all others" · s="She is the _____ student in our whole class. She always gets the top mark and helps others." · a=[] · mc=["worst","slowest","laziest"]
- `g1u06.w.detective` ← v1 `detective`: d="a person who finds out about crimes" · s="The police _____ wears a long coat and looks for clues at the crime scene to solve the case." · a=[] · mc=["farmer","baker","clown"]
- `g1u06.w.help-me` ← v1 `Help me!`: d="what you call out when you need someone right now" · s="I can't carry these heavy boxes alone. _____ Please come and take some!" · a=["Help me"] · mc=["Leave me!","Go away!","Wait there!"]
- `g1u06.w.office` ← v1 `office`: d="a room where people work" · s="My mum works from 9 to 5 in an _____ in the city centre. She has a desk and a computer." · a=[] · mc=["garden","forest","beach"]
- `g1u06.w.to-run` ← v1 `to run`: d="to move very fast on your feet" · s="We _____ very fast to school because we are ten minutes late and the teacher is waiting." · a=[] · mc=["to crawl","to sit","to sleep"]
- `g1u06.w.to-pull-2` ← v1 `to pull`: d="to move something towards you" · s="The heavy wooden door is stuck shut. You must _____ the handle very hard towards you to open it." · a=[] · mc=["to push","to close","to lock"]
- `g1u06.w.to-catch` ← v1 `to catch`: d="to get hold of something moving" · s="Throw the ball to me and I will _____ it in my hands without letting it fall!" · a=[] · mc=["to drop","to miss","to kick"]
- `g1u06.w.clever` ← v1 `clever`: d="good at thinking and learning" · s="She always knows the answer to the hardest questions. She is very _____ — even cleverer than the teacher sometimes." · a=["smart"] · mc=["silly","slow","lazy"]
- `g1u06.w.to-come-to` ← v1 `to come to`: d="to arrive at a place" · s="Walk down the long main street for five minutes and you _____ a big green park on your right." · a=[] · mc=["to leave behind","to go past","to drive away from"]
- `g1u06.w.to-live` ← v1 `to live`: d="to have your home in a place" · s="I _____ in a small house near the school with my mum, dad, and little brother." · a=[] · mc=["to visit","to sleep at","to move from"]
- `g1u06.w.nice` ← v1 `nice`: d="good, pleasant, friendly" · s="Your new summer dress is very _____ — I love the flower pattern and the soft material." · a=["lovely","pretty"] · mc=["horrible","dirty","smelly"]
- `g1u06.w.a-lot-of-lots-of` ← v1 `a lot of`: d="many, a big number of" · s="There are _____ children — about 300 — at our big school." · a=["lots of"] · mc=["just one","no","a couple of"]
- `g1u06.w.to-call` ← v1 `to call`: d="to phone someone or say their name" · s="I will _____ you on the phone right after school and we can talk about the party." · a=["phone"] · mc=["to ignore","to forget","to avoid"]
- `g1u06.w.come-on` ← v1 `Come on!`: d="telling someone to hurry" · s="_____ Hurry up! We are five minutes late for the school bus and it is leaving now!" · a=["Come on"] · mc=["Slow down!","Stop!","Wait here!"]
- `g1u06.w.to-solve` ← v1 `to solve`: d="to find the answer to a problem" · s="Can you _____ this tricky maths question? The answer is hidden and I cannot work it out." · a=[] · mc=["to write","to read","to copy"]
- `g1u06.w.to-wait` ← v1 `to wait`: d="to stay and not go yet" · s="Please _____ here at the bus stop for two minutes. I will be back very soon with the tickets." · a=[] · mc=["to run","to leave","to hide"]
- `g1u06.w.to-watch` ← v1 `to watch`: d="to look at something for a time" · s="We like to _____ the colourful birds flying around the feeder in the garden through the window." · a=[] · mc=["to hear","to smell","to count"]
- `g1u06.w.street-2` ← v1 `street`: d="a road in a town with houses" · s="There are many shops selling clothes and food in our busy _____ in the town centre." · a=["road"] · mc=["river","forest","mountain"]
- `g1u06.w.to-get-up` ← v1 `to get up`: d="to stand up or wake up from bed" · s="I _____ out of bed at seven o'clock every morning when my alarm clock rings." · a=[] · mc=["to go to sleep","to lie down","to stay in bed"]
- `g1u06.w.to-become` ← v1 `to become`: d="to change into something new" · s="When I finish university, I want to _____ a doctor who helps sick children in the hospital." · a=[] · mc=["to stop being","to forget","to leave"]
- `g1u06.w.but-it-s-true` ← v1 `But it's true!`: d="saying something is really real" · s="You don't believe my crazy story about the flying elephant? _____ I saw it with my own eyes!" · a=["But it's true"] · mc=["I'm joking!","I made it up!","Sorry!"]
- `g1u06.w.go-on` ← v1 `Go on.`: d="telling someone to continue" · s="That's a very interesting story about your adventure. _____ Tell me what happened next!" · a=["Go on"] · mc=["Stop talking.","Be quiet.","Don't tell me."]
- `g1u06.w.well-done` ← v1 `Well done.`: d="saying someone did a good job" · s="You got all ten questions right on the test! _____ I am very proud of you." · a=["Well done"] · mc=["Try harder.","Do better.","Bad luck."]

## Unit transcripts (textbook sentences live here — use them first)

```
----- SB: SB Unit 6- The world's best detective.txt -----
Page 46
Unit 6: The world's best detective
At the end of unit 6 ...
you know ☐ 14 action verbs ☐ how to use the present simple ☐ how to use a lot of / lots of
you can ☐ understand and tell a detective story ☐ understand a comic ☐ write a detective story
VOCABULARY
2/12 🔊 1 Listen and look at the pictures. Then number the words.
[Image description: 10 numbered illustrations showing various actions]
☐ fall out of the window ☐ mirror ☐ climb up a tree ☐ close a door ☐ smile ☐ put on a hat ☐ take off a hat ☐ open a window ☐ jump ☐ leave
READING
📖 2 Read the story.
The lost bird
Sherlock Groans is in his office. He looks in the mirror. He smiles. He puts his hat on. He's the world's best detective! He opens the window. It's a nice day.
"Sherlock!" says a woman. It's his friend, Doctor Grey.
"Good morning, Doctor!" says Sherlock. "How are you?"
"I'm fine, thank you, Sherlock," says Doctor Grey. "There is a man here. He has a problem. Can you help him?"
"Yes! I can help him," says Sherlock. "Bring him in!"
Doctor Grey leaves the office and closes the door. Sherlock looks out the window. Oh no! His hat! His hat falls out of the window.
Sherlock runs out of the office and into the reception room*.
"Sherlock, this is ...", says Doctor Grey. There is an old man next to her.
"Sorry!" says Sherlock.
Sherlock goes out the door and runs down the street. He looks for his hat. There! It's in a tree. He climbs up the tree. He picks up his hat. There's a blue bird in his hat!
"Go away!" says Sherlock. The bird jumps on his head.
"OK. Fine!" says Sherlock. He puts the hat on his head. Sherlock climbs down the tree. He walks back to the office. Doctor Grey and the old man are in his office.
"Good morning. Sherlock Groans," says the man. "Please help me. I can't find my bird!"
Sherlock looks at the man. He takes his hat off.
"Umm ... is this your bird?" asks Sherlock. The old man looks at the blue bird.
"Yes! WOW! Sherlock Groans, you are the world's best detective!"
[Image description: Illustration of Sherlock with the old man and the bird]
VOCABULARY: *reception room – Wartezimmer
🔵 WB p. 49, 53 🌐 CYBER Homework 16 (Revision)
Page 47
3 How many of these tasks can you do?
1 Sherlock Groans is in the park. T / F 2 Sherlock Groans closes the window. T / F 3 Doctor Grey is Sherlock's friend. T / F 4 Sherlock Groans looks for his hat / his bird / his friend. 5 The hat is in the street / on the window / in the tree. 6 Sherlock Groans puts the bird in the tree / in his jacket / under his hat. 7 Doctor Grey and the old man are .................................................................................................... . 8 The old man can't find ..................................................................................................................... . 9 The old man thinks Sherlock Groans is ........................................................................................... .
2/13+14 🔊 4 Check your answers with a partner. Then listen to the story.
SPEAKING Telling a detective story
👤 5 Look at the pictures. Tell the story "Sherlock Groans finds the dog". Use the words below.
[Image description: Photo of a smiling person and a speech bubble]
Sherlock Groans leaves his office. First, he goes to the park. He ... the dog. Then he ... a tree. He ... his head. Then he ... the tree. The dog ... Sherlock Groans. Now, the dog ... Sherlock Groans to a hospital.
[Image description: 8 numbered illustrations showing a sequence of actions with labels:] 1 leave 2 go to 3 look for 4 climb (up) 5 bump 6 fall out of 7 find 8 pull
🔵 WB p. 50, 53, 55 🌐 CYBER Homework 17
Page 48
6 Read the text.
A FAMOUS DETECTIVE
[Image description: Silhouette of Sherlock Holmes]
It's the year 1887. Sir Conan Doyle writes a book about a detective. His name is Sherlock Holmes. He lives at 221B Baker Street in London. Holmes wears a funny hat and smokes a pipe. He is very tall and has got brown hair. Holmes plays the violin. It helps him to think.
Sherlock has got a friend. His name is Dr Watson. Dr Watson helps Sherlock Holmes. People come to Holmes and ask for help. Holmes and Watson are very clever. They catch all the bad people.
There are four books and 56 short stories about Sherlock Holmes. He is also in lots of films.
7 Cover up the text and complete the sentences.
1 Sherlock Holmes l__ __ __ __ in London. 2 He s__ __ __ __ __ a pipe. 3 Sherlock Holmes p__ __ __ __ __ the violin. 4 Holmes h__ __ g__ __ a very good friend. 5 People c__ __ __ to Holmes and ask for help. 6 Holmes and Watson a__ __ very clever. 7 Holmes c__ __ __ __ __ __ all the bad people. 8 There a__ __ __ __ __ a lot of films about Sherlock Holmes.
SOUNDS RIGHT /w/
2/15 🔊 8 Listen and repeat.
There's a wolf, a wolf, a wild wolf in the wood. He's looking for Little Red Riding Hood.
[Image description: Illustration of a wolf in the woods]
A SONG 4 U
2/16+17 🔊 9 Listen and sing.
Call Groans
The cat is lost! The dog is gone! Call Sherlock Groans. Come on, come on!
Groans – he solves the problem, Groans – he finds your stuff. Groans – he knows the answer, Groans – that is enough.
A watch is lost! A keyboard's gone! Call Sherlock Groans. Come on, come on!
[Image description: Illustration showing people calling for help and detective Groans]
Groans – he solves the problem ...
A drum is lost! My goldfish's gone! Call Sherlock Groans. Come on, come on!
Groans – he solves the problem ...
🔵 WB p. 54
Page 49
LISTENING
2/18 🔊 10 Listen and put the pictures in order. Then read the comic.
PAWS AND CLAWS ANIMAL DETECTIVES
[Image description: Comic strip panels showing a manga-style story with characters looking for a hat and a necklace. The panels include dialogue:]
"My hat! Where is my hat?!"
"He's here! It's Kapu... Let's go!"
"My doll*! I want my doll!"
"Claws! Can you see him?"
"I see him! He is on the bridge."
"Oh, now we get him!"
"Detective Paws! What can you see?"
"I see a lot of happy people, Detective Claws. But ... wait ... what's that?"
"My necklace*! My necklace! Oh, no!"
VOCABULARY: *doll – Puppe; necklace – Halskette
Fact box This picture story is a Manga. Manga is the name for Japanese comic books.
11 Who says what? Match the sentences with the people. There is one extra name.
1 "My doll! I want my doll!" ☐ woman ☐ man 2 "OK, now we get him!" ☐ Detective Paws ☐ little girl 3 "My hat!"
2/19 🔊 12 Choose a picture for the ending. Listen and check your answer.
[Image description: Three numbered ending options showing different scenes]
🔵 WB p. 55
Page 50
WRITING
13 C H O I C E S
A You are a detective. Write four sentences.
I'm a detective. My name is ... I live ... My friend is ... We look for ...
B Write the story "Sherlock Groans finds the dog!"
How to start: Groans leaves his office. "Find the dog, find the dog," he thinks. He goes ...
How to go on (start with a new paragraph):* First he looks for ... Then he ... And then he ... Oh no! He ...
How to end (start with a new paragraph): Now Mr Groans is ... And the dog is ...
VOCABULARY: *paragraph – Absatz
GRAMMAR
▶️ Present simple
Wenn du sagst I like ice cream, dann bedeutet das, dass du im Allgemeinen gern Eis magst. Diese Zeitform nennt man das Present simple.
Singular	Plural
I love dogs.	We love our cat.
You live in Vienna.	They live in Oxford.

Wenn du über eine Person, ein Tier oder ein Ding sprichst, dann musst du beim Verb ein -s anhängen.
He lives in London. My dog loves ice cream. She plays football.
Achtung:
go – goes carry – carries watch – watches catch – catches wash – washes
[Image description: Illustration of a dog playing football with text "Our dog plays football."]
Du verwendest das Present simple auch, um eine Geschichte oder einen Witz im Präsens zu erzählen.
I'm in bed. I hear something. I get up. I ... Sherlock Groans leaves his house. He goes to the park. He sees ...
a lot of / lots of
Für "viel/viele" kannst du im Englischen sowohl a lot of als auch lots of verwenden.
a lot of homework / lots of homework a lot of books / lots of books a lot of different colours / lots of different colours
⏪ Now go back to page 46. Check ☑ with a partner what you know / can do.
🔵 WB p. 51, 52, 55 🌐 CYBER Homework 18
Page 51
THE STORY OF THE STONES 3
▶️ Don't be scared!
1 Remember and say the sentences.
Sarah has got the ... stone. She rubs it. She becomes ... Emma has got the ... stone. She rubs it. She becomes ... Daniel has got the ... stone.
[Image description: Character illustration]
2 Imagine that Daniel rubs his stone. Say what you think he becomes. Ask your teacher for more words for animals.
I think he becomes a ...
[Image description: Various animals including a fish, gorilla, and lion]
What's 'Schwan' in English? Swan.
[Image description: Classroom scene]
EVERYDAY ENGLISH
▶️ 3 Watch episode 3. Complete the dialogues with the phrases from the box.
Go on But it's true Well done Promise
Daniel Don't make fun of me! Sarah ¹................................................ ! Daniel ³................................................ ! Sarah Great, Daniel! Emma ²................................................ , Daniel. ⁴................................................ ! Rub your stone! Daniel No, I don't want to.
4 Can you do the puzzle and find out what Sunborn says to the children?
[Image description: Crossword puzzle grid and character illustrations]
Wait for my __ __ __ __ __ __ !
1 His name is ... 2 Emma rubs her stone. She becomes a ... 3 Emma, Sarah and Daniel find three ... 4 Her name is ...
5 His name is ... 6 Sarah rubs her stone. She becomes an ... 7 Sarah's stone is ...


----- WB: WB Unit 6 The world’s best detective.txt -----
Unit 6 The world’s best detective
Page 49–50
UNDERSTANDING VOCABULARY
Action verbs
1 Look at the pictures and number the words.
□ mirror
□ close a door
□ smile
□ open a window
□ put a hat on
□ take a hat off
□ jump
□ fall out of a window
□ climb up a tree
□ leave
Image descriptions (numbered pictures 1–10):
1 A smiling girl’s face, looking straight ahead.
2 A boy climbing up a tree trunk.
3 A hand opening a window with a plant on the windowsill.
4 A girl jumping in the air.
5 A boy putting a hat on his head.
6 A person leaving through a door.
7 A girl closing a door.
8 A boy taking a hat off his head.
9 A hand mirror.
10 An open window with flowers outside.
2 Remember the story The lost bird. Read and circle the correct options.
Sherlock Groans is in his office. He looks in the ¹ mirror / window. He ² puts his hat on / takes his hat off. He ³ smiles / runs. He’s the world’s best detective! He ⁴ closes / opens the window and ⁵ looks in / looks out. His hat ⁶ falls out of / takes off the window. Sherlock’s friend, Doctor Grey, comes to the office. An old man is next to her.
“Sorry!” says Sherlock. He runs down the street. He climbs up a tree. There’s his hat.
He ⁷ picks it up / takes it off. There’s a bird in it! The bird ⁸ jumps / goes on his head.
Now Sherlock’s back at the office. The old man says, “Please help me. I can’t find my bird!”
Sherlock ⁹ puts his hat on / takes his hat off. “Here you are!” he says. The man ¹⁰ runs / smiles.
3 Match the words with the pictures. There are four extra words.
climb fall out of leave find go to look for pull bump
Image descriptions (1–4):
1 A detective bumping his head on a desk, stars around his head.
2 A detective looking closely at a computer screen with a magnifying glass.
3 A person falling out of a bed in surprise.
4 A detective climbing up a pole to reach a light.
1 ………………………………………
2 ………………………………………
3 ………………………………………
4 ………………………………………
Page 50–51
USING VOCABULARY
Action verbs
4 Find and circle the verbs and prepositions from the box in the wordsearch. (← → ↑ ↓)
Then write a sentence for each one.
fall out of
go to
jump into
look for
bump into
put on
take off
Wordsearch grid shown.
1 ………………………………………
2 ………………………………………
3 ………………………………………
4 ………………………………………
5 ………………………………………
6 ………………………………………
7 ………………………………………
5 Complete the text with the words from the box.
goes
bumps into
looks for
leaves
looks for
Sherlock Groans ¹ ……………………………… the house at eight o’clock. He ² ……………………………… his umbrella*. Sherlock Groans thinks: “Where is my umbrella? Is it in the woods? Is it in the park? Or is it at the café?”
He ³ ……………………………… to the café. No umbrella. Then he goes to the park. No umbrella. Then he goes to the woods. He ⁴ ……………………………… his umbrella under the bushes. No umbrella. Later he ⁵ ……………………………… a tree. And from the tree – falls his umbrella. Sherlock Groans is very happy.
Image description: Sherlock Groans bumps into a tree; his umbrella is stuck in the branches above his head.
VOCABULARY: *umbrella – Regenschirm
6 Write a short story called Sherlock Groans and the lost drum. Use the verbs in the box and the picture to help you.
go to
climb
fall out of
leave
find
bump
look for
jump into
Image description: Sherlock Groans stands by a river, looking at something floating away in the water.
Page 51–52
UNDERSTANDING GRAMMAR
Present simple
7 Circle the correct words. Then number the pictures.
1 My sister Sheila play / plays football every day.
2 In the afternoon, I play / plays computer games.
3 Dad wash / washes his car on Saturdays.
4 We clean / cleans our bikes* at the weekend.
5 My mum leave / leaves the office at five.
6 We all love / loves our dog.
7 On Sunday, Mike go / goes to the park with his dog.
8 On Sunday, Dawn and I go / goes to the cinema.
VOCABULARY: *bike – Fahrrad
Pictures A–H:
A A boy playing computer games at a desk.
B Two children playing with a dog in a park.
C Two girls going into a cinema.
D A man walking a dog in a park.
E A man washing a car.
F A woman leaving an office with bags.
G A girl playing football.
H Two children cleaning bicycles.
8 Complete with the correct form of the verbs in brackets.
1 Our cat ……………………………… football. (play)
2 I ……………………………… computer games in the evening. (play)
3 I ……………………………… my sister with her homework. (help)
4 And my sister ……………………………… me to clean my bike. (help)
5 My father ……………………………… to work at seven every morning. (go)
6 We ……………………………… to the cinema on Friday. (go)
7 We ……………………………… the car at the weekend. (wash)
8 And on Sunday, my sister ……………………………… the dog! (wash)
Page 52–53
9 Read Alyssa’s story. Complete the text with the correct form of the verbs in brackets.
My parrot Coco really ¹ ……………………………… (like) bananas. Every day we ² ……………………………… (go) and ³ ……………………………… (buy*) a big banana. First, I ⁴ ……………………………… (eat) half of* the banana and then my parrot ⁵ ……………………………… (eat) the other half of the banana. My parrot also ⁶ ……………………………… (like) melons and strawberries.
Image description: A girl kneeling and feeding a parrot a banana.
VOCABULARY: *buy – kaufen; half of – die Hälfte von
10 What do they do every day? Write the sentences under the pictures.
Tony / eat
Li Jun / play
Mara and Lewis / watch
Anna / go
Fred / climb
Kathy / play
Pictures show:
Tony eating an apple.
Li Jun playing football.
Mara and Lewis watching TV.
Anna going to the cinema.
Fred climbing a tree.
Kathy playing the drums.
1 Every day Tony eats an apple.
2 ………………………………………
3 ………………………………………
4 ………………………………………
5 ………………………………………
6 ………………………………………
Page 53–54
11 Complete the text with the missing letters.
Fiona is in bed. Suddenly* she ¹ he____ something. She ² ge__ up and ³ go__ to the window. Nothing. She ⁴ r____ to the door and ⁵ wai___ . Nothing. She ⁶ lis_____ for a minute. Nothing. Then she ⁷ lo____ at her desk. There is a big teddy bear with a big red card* on it. The card ⁸ sa___ : “For Fiona. Love you, Mum and Dad.”
VOCABULARY: *suddenly – plötzlich; card – Karte
12 Complete the text with the verbs from the box.
likes
go to
calls*
say
Susan ¹ ……………………………… basketball and volleyball, too.
Everyone ² ……………………………… her Volleyball Sue.
And what about football? She’s good at that, too.
“OK,” ³ ……………………………… her friends. “You’re Ballchampion Sue.”
Her friends all love her and ⁴ ……………………………… every game*.
VOCABULARY: *call – hier: nennen; game – Spiel
Page 54–55
READING & WRITING
Understanding and writing a detective story
13 CHOICES
A Look at the pictures and number the sentences.
Sherlock Groans and the garden gnome *
Sentences:
□ The garden gnome hits* Groans with a little hammer.
□ Today Groans wants to find a garden gnome.
□ He looks for it in the park.
□ Then the garden gnome runs away.
□ He falls into the grass. There he sees the garden gnome.
□ He bumps into a tree.
Pictures 1–6 show the story in sequence, including Sherlock Groans searching, bumping into a tree, falling, being hit by a gnome, the gnome running away, and Groans holding his head.
VOCABULARY: *garden gnome – Gartenzwerg; hit – schlagen
B Sherlock Groans is on the phone with Doctor Grey. Put the dialogue in the correct order.
□ Doctor Grey Where are you?
□ Doctor Grey OK, Groans. Give me twenty minutes.
□ Doctor Grey A tree?
□ Doctor Grey Yes? Who is it?
□ Doctor Grey OK, come home, Groans.
□ Doctor Grey Is my lost cat with you?
□ Groans In a tree.
□ Groans I can’t, Doctor Grey. There’s a wolf under the tree. Help me, please.
□ Groans Yes, it is.
□ Groans Yes, a tree in the woods.
□ Groans Groans here, Doctor Grey.
Image description: Sherlock Groans sitting in a tree on the phone; a cat is with him, and a wolf is below.
Page 55–56
14 Read the text A famous detective on page 48 of the Student’s Book again. Write the answers.
Name:
1 ………………………………………
Job:
2 ………………………………………
Address:
3 ………………………………………
Clothes:
4 ………………………………………
Hobby:
5 ………………………………………
Best friend:
6 ………………………………………
15 Read about two famous detectives. How many of the tasks below can you do?
Text 1:
She is Georgina from The Famous Five, but she prefers* the name George. Every summer holidays George and her friends Dick, Julian, Anne and her dog Timmy have lots of adventures* and solve cases* in the countryside*.
Text 2:
Miss Marple is a detective in a lot of books by the famous crime author* Agatha Christie. Miss Marple is a little old lady. She lives in a small town* in the English countryside. She watches people all the time. She is very clever and she always* finds the killer.
VOCABULARY: *prefer – lieber haben; adventure – Abenteuer; case – (Kriminal-)Fall; countryside – ländliche Gegend; author – Autor/Autorin; town – Stadt; always – immer
Choose the correct answers.
1 Georgina has a dog. Its name is
□ Dick. □ Anne. □ Timmy.
2 Agatha Christie is the author of books about
□ Miss Marple. □ Georgina. □ The Famous Five.
Circle T (True) or F (False).
3 There are four children in The Famous Five. T / F
4 Miss Marple lives in London. T / F
Complete the sentences.
5 Georgina likes the name ……………………………………… best.
6 Agatha Christie is ……………………………………… .
Page 56–57
17 Look at the pictures. Tell the story “The lost dog”. Use the words from the box. Then write the story in your exercise book.
Sherlock Groans goes to the park. He … Doctor Grey’s dog. Then he … a tree.
He … his head. Then he … the tree. The dog … Sherlock Groans.
Now, the dog … Sherlock Groans to a hospital.
Pictures 1–6 show: Groans going to the park, climbing a tree, bumping his head, falling out of the tree, being found by the dog, and being taken to hospital.
LISTENING
Understanding a detective story
18 Listen and complete the sentences.
1 Nate is a young ……………………………………… .
2 His friend Annie can’t find her ……………………………………… .
3 There’s a ……………………………………… dog in it.
VOCABULARY: *Red and yellow make orange. – Rot und gelb ergeben orange.; It’s still wet. – Es ist noch nass.
19 Listen again and tick T (True) or F (False).
1 Nate looks in the garden and the woods. T □ F □
2 He looks in Annie’s room. T □ F □
3 He looks in her brother’s room. T □ F □
4 There are lots of pictures and they’re all orange. T □ F □
5 Annie’s brother only paints red pictures. T □ F □
6 Nate says, “Red and yellow make orange. The orange picture is your picture!” T □ F □
WORD FILE
Around town
Image description: A town scene with labeled places: city, park, street, market, supermarket, river, woods, tree.
Action verbs
to jump into the river
to look out the window
to pick something up
to sit in a tree
to fall out of the tree
to bump into a tree
to go to the park
to pull
to climb up a tree
to leave the office
to look in the mirror
to look for something
MORE Words and Phrases
1 to climb – Sherlock Groans climbs up a tree. – klettern
to jump – A bird jumps on Sherlock Groans’ head. – hüpfen
to leave – Doctor Grey leaves the office. – verlassen, weggehen
mirror – There is a mirror on a wall. – Spiegel
to put on – Sherlock puts his hat on. – aufsetzen, anziehen
to smile – He smiles in the mirror. – lächeln
to take off – He takes off his hat. – abnehmen, ausziehen
2 away – Go away! – weg
(world’s) best – Sherlock Groans is the world’s best detective! – (welt-)bester/beste/bestes
detective – He’s the world’s best detective. – Detektiv/Detektivin
Help me! – Hilf mir!
to look for – He looks for his hat in the park. – suchen
old – His skateboard isn’t new. It’s very old. – alt
to pick up – He picks up the hat. – aufheben
to run out (of) – Sherlock runs out of the office. – hinausrennen (aus)
to run down (the street) – Sherlock runs down the street. – (die Straße) hinunterlaufen
5 to find – The dog finds Sherlock Groans. – finden
to pull – The dog pulls Sherlock Groans out of the river. – ziehen
6 to catch – He always catches the bad people. – fangen; erwischen; festnehmen
clever – Sherlock is really clever. – klug, schlau
to come to – He comes to a park. – (zu etwas) hinkommen
to live – Peter lives in London. – leben, wohnen
pipe – Sherlock often has a pipe in his mouth. – Pfeife
to smoke – Groans smokes a pipe. – rauchen
violin – He can play the violin. – Geige
to wear – Trevor wears a black hat. – tragen
7 a lot of / lots of – There are lots of beautiful trees in the park. – viel/e, jede Menge
9 to call – Sherlock Groans calls Doctor Grey. – (an-)rufen
Come on! – Komm(t) jetzt!, Mach(t) schon!
10 to solve – Detectives solve problems. – lösen
to wait – But … wait … what’s that? – warten
to watch – He watches the people in the streets. – beobachten, zuschauen
street – Anna lives in York Street. – Straße
G to get up – He gets up at 7 o’clock in the morning. – aufstehen
S3 to become – Emma becomes a tiger. – werden
But it’s true! – Aber es stimmt!
Go on. – weitermachen; Erzähl weiter!
Well done. – Gut gemacht.

```

## Output contract

Write `content/corpus/units/g1-u06/gen/vocab.draft.json`:

```jsonc
{
  "schema": "vocab-draft@1",
  "slug": "g1-u06",
  "briefBank": "dfbe7bb08bcd",
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
