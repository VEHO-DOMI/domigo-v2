# Verify lens — level-gloss — g1-u06 (round 1)

<!-- domigo:verify level-gloss g1-u06 items=ca33d0b51fc1 prompt=aefb997bf664 round=1 -->

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Ahmed, Annie, Arbeit, Bacon, Baker, Befehlsformen, Betty, Bild, Bilder, Blackbeard, Blackie, Bob, Box, Buckingham, Buddy, California, Cambridge, Caribbean, Carina, Carl, Chloe, Christie, Classroom, Clown, Dan, Dana, Daniel, Dave, David, Davis, Dialog, Dialoge, Doctor, Doctors, Don, Ellie, England, English, False, Fido, Frank, Fred, Freddy, George, Gina, Good, Gordon, Great, Grey, Greybeard, Groans, Guess, Harry, Holmes, Homework, Hook, Imperatives, Irregular, Jack, James, Jamie, Jenny, Jessica, Jill, Julia, Jun, Kitty, Leah, Leo, Lewis, London, Lucy, Mail, Manchester, Marple, Mary, Mike, Miss, Mr, Mum, Nibbs, Nice, Nomen, Number, Numbers, Omar, Palace, Pardon, Paws, Pete, Peter, Pirates, Plural, Polly, Possessives, Prepositions, Present, Project, Put, Rajit, Red, Reihenfolge, Richard, Ronald, Saying, School, Sherlock, Steve, Sue, Tamara, Text, Tick, Toby, Tock, Tom, True, Watson, Welcome, Well, Work, Wortes, Wow, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Vocab items (49)

| id | d | s | mc | pool | gloss |
|---|---|---|---|---|---|
| g1u06.w.a-lot-of-lots-of | This is many, a big number. | There are ___ trees in the park. | big ; long ; small | big ; long ; small ; nice ; best | — |
| g1u06.w.away | Not here, at a far place. | Go ___! I do not want you here. | back ; here ; best | back ; here ; best ; nice ; clever | far (= weit weg) ; place (= Ort) |
| g1u06.w.best | The very good one, more good than all. | Sherlock is the world's ___ detective. | clever ; nice ; big | clever ; nice ; big ; small ; long | — |
| g1u06.w.but-it-s-true | You call this out when a thing is real, not a joke. | You do not believe me? ___ I saw it! | Well done. ; Go on. ; Come on! | Well done. ; Go on. ; Come on! ; Help me! ; Go away! | real (= echt, wirklich) ; joke (= Witz, Scherz) ; believe (= glauben) ; saw (= sah, habe gesehen) |
| g1u06.w.city | A very big place with lots of houses, cars, and shops. | London is a very big ___. | park ; street ; river | park ; street ; river ; market ; woods | place (= Ort) ; houses (= Häuser) ; shops (= Geschäfte) |
| g1u06.w.clever | Very good at school; you learn well and find the answer. | Sherlock is very ___; he always finds the answer. | nice ; best ; happy | nice ; best ; happy ; big ; strong | learn (= lernen) ; answer (= Antwort) ; always (= immer) |
| g1u06.w.come-on | You call this out so a friend is here now. | ___ Hurry up, we are late! | Go away! ; Well done. ; Help me! | Go away! ; Well done. ; Help me! ; Go on. ; But it's true! | hurry (= sich beeilen) ; late (= spät, zu spät) |
| g1u06.w.detective | A man or woman who finds bad men and women. | Sherlock Groans is a very good ___. | office ; mirror ; market | office ; mirror ; market ; city ; tree | — |
| g1u06.w.go-on | You want a friend to go on with the story. | That is a good story. ___ What happens next? | Well done. ; Come on! ; Help me! | Well done. ; Come on! ; Help me! ; Go away! ; But it's true! | next (= als Nächstes) |
| g1u06.w.help-me | You call this out when you want a friend now. | ___ I can not carry this big box. | Go away! ; Come on! ; Well done. | Go away! ; Come on! ; Well done. ; Go on. ; But it's true! | — |
| g1u06.w.market | You go here in the city to buy food. | We buy fresh food at the ___ every Saturday. | supermarket ; park ; office | supermarket ; park ; office ; city ; street | buy (= kaufen) ; food (= Essen) ; fresh (= frisch) ; every (= jede/r/s) |
| g1u06.w.mirror | A thing on the wall. You look at you in it. | There is a ___ on the wall. | office ; detective ; tree | office ; detective ; tree ; city ; street | wall (= Wand) |
| g1u06.w.nice | Good and happy; a friend to all. | The park is very ___ and beautiful. | clever ; best ; big | clever ; best ; big ; small ; happy | — |
| g1u06.w.office | A room where a man or woman does their work. | Sherlock looks in the mirror in his ___. | mirror ; detective ; market | mirror ; detective ; market ; park ; city | — |
| g1u06.w.park | A big and beautiful place in the city. You can play and run here, and it has trees. | There are lots of beautiful trees in the ___. | city ; street ; market | city ; street ; market ; river ; supermarket | place (= Ort) |
| g1u06.w.river | This is long and cold and runs in the woods. You can swim in it. | We go swimming in the cold ___ in summer. | woods ; tree ; street | woods ; tree ; street ; park ; market | swim (= schwimmen) ; swimming (= schwimmen) ; summer (= Sommer) |
| g1u06.w.street | Cars go on this in the city, and houses are next to it. | Cars and buses go down our busy ___. | river ; woods ; park | river ; woods ; park ; city ; tree | houses (= Häuser) ; buses (= Busse) ; busy (= voll, viel los) |
| g1u06.w.street-2 | Cars go on this, and houses are next to it. | He lives in York ___. | river ; park ; woods | river ; park ; woods ; city ; office | houses (= Häuser) |
| g1u06.w.supermarket | A very big shop in the city where you buy food. | Mum can buy a lot of food at the big ___. | market ; office ; park | market ; office ; park ; city ; river | shop (= Geschäft) ; buy (= kaufen) ; food (= Essen) |
| g1u06.w.to-become | To stop being one thing and be a new one. | She rubs the stone and ___ a tiger. | to find ; to call ; to watch | to find ; to call ; to watch ; to live ; to come to | stop (= aufhören) ; being (= zu sein) ; new (= neu) ; rubs (= reibt) ; tiger (= Tiger) |
| g1u06.w.to-bump-into-a-tree | To run into something big and hard because you do not look. | He is not looking, so he will ___. | to climb up a tree ; to sit in a tree ; to go to the park | to climb up a tree ; to sit in a tree ; to go to the park ; to fall out of the tree ; to look out the window | something (= etwas) ; hard (= hart) ; will (= wird) |
| g1u06.w.to-call | To talk to a friend who is not here, on the phone. | Sherlock ___ Doctor Grey on the phone. | to wait ; to watch ; to find | to wait ; to watch ; to find ; to solve ; to leave | phone (= Telefon) |
| g1u06.w.to-catch | The dog runs and gets the ball in its mouth. | Detectives always ___ the bad people. | to leave ; to live ; to wait | to leave ; to live ; to wait ; to find ; to pull | gets (= schnappt sich) ; ball (= Ball) ; always (= immer) ; people (= Leute) |
| g1u06.w.to-climb | To go up a tree or a wall. | Sherlock ___ up a tree to get his hat. | to jump ; to run ; to pull | to jump ; to run ; to pull ; to catch ; to wait | wall (= Wand, Mauer) ; get (= holen) |
| g1u06.w.to-climb-up-a-tree | To go up high, with your hands and feet, into the woods. | My dog wants to ___ and look at the birds. | to sit in a tree ; to fall out of the tree ; to go to the park | to sit in a tree ; to fall out of the tree ; to go to the park ; to bump into a tree ; to jump into the river | high (= hoch) ; hands (= Hände) ; birds (= Vögel) |
| g1u06.w.to-come-to | To go up to a place and be there. | Go down the street and you ___ a big park. | to leave ; to live ; to watch | to leave ; to live ; to watch ; to find ; to wait | place (= Ort) |
| g1u06.w.to-fall-out-of-the-tree | You are up high, then you go down to the floor. | Be careful! You can ___ and hurt your head. | to climb up a tree ; to sit in a tree ; to go to the park | to climb up a tree ; to sit in a tree ; to go to the park ; to bump into a tree ; to jump into the river | high (= hoch) ; floor (= Boden) ; careful (= vorsichtig) ; hurt (= wehtun, verletzen) ; head (= Kopf) |
| g1u06.w.to-find | To look for a thing and come to it. | The dog ___ Sherlock Groans in the woods. | to leave ; to wait ; to live | to leave ; to wait ; to live ; to catch ; to solve | — |
| g1u06.w.to-get-up | To stand up out of bed in the morning. | Sherlock ___ at seven o'clock in the morning. | to leave ; to come to ; to watch | to leave ; to come to ; to watch ; to call ; to find | o'clock (= Uhr (Uhrzeit)) |
| g1u06.w.to-go-to-the-park | To walk to the green place with trees and play there. | Let's ___ and play on the swings. | to leave the office ; to climb up a tree ; to look in the mirror | to leave the office ; to climb up a tree ; to look in the mirror ; to jump into the river ; to sit in a tree | walk (= gehen, laufen) ; green (= grün) ; place (= Ort) ; swings (= Schaukeln) |
| g1u06.w.to-jump | To go up into the air with your feet. | A bird ___ on Sherlock's head. | to climb ; to run ; to pull | to climb ; to run ; to pull ; to catch ; to wait | air (= Luft) ; bird (= Vogel) ; head (= Kopf) |
| g1u06.w.to-jump-into-the-river | You are hot, so you hop down into the cold water. | It is very hot. Let's ___ now! | to climb up a tree ; to sit in a tree ; to go to the park | to climb up a tree ; to sit in a tree ; to go to the park ; to look out the window ; to leave the office | hop (= hüpfen) ; water (= Wasser) |
| g1u06.w.to-leave | To go away from a place. | Doctor Grey ___ the office and closes the door. | to find ; to wait ; to live | to find ; to wait ; to live ; to come to ; to run | place (= Ort) |
| g1u06.w.to-leave-the-office | To go out of your work room. | Doctor Grey will ___ at five o'clock. | to come to ; to go to the park ; to look in the mirror | to come to ; to go to the park ; to look in the mirror ; to climb up a tree ; to look out the window | will (= wird) ; o'clock (= Uhr (Uhrzeit)) |
| g1u06.w.to-live | To have your room and bed in a city. | Peter's Grandma ___ in York. | to leave ; to find ; to come to | to leave ; to find ; to come to ; to wait ; to watch | — |
| g1u06.w.to-look-in-the-mirror | To watch your own face in the glass on the wall. | She wants to ___ in the morning. | to look out the window ; to pick something up ; to go to the park | to look out the window ; to pick something up ; to go to the park ; to sit in a tree ; to leave the office | own (= eigene/r/s) ; face (= Gesicht) ; glass (= Glas) ; wall (= Wand) |
| g1u06.w.to-look-out-the-window | From your room, you watch what is outside. | I ___ and watch the rain. | to look in the mirror ; to pick something up ; to go to the park | to look in the mirror ; to pick something up ; to go to the park ; to sit in a tree ; to leave the office | outside (= draußen) ; rain (= Regen) |
| g1u06.w.to-pick-something-up | He bends down and takes his hat up from the floor. | There is a coin on the floor. Can you ___? | to look out the window ; to climb up a tree ; to sit in a tree | to look out the window ; to climb up a tree ; to sit in a tree ; to go to the park ; to look in the mirror | bends (= bückt sich) ; takes (= nimmt) ; floor (= Boden) ; coin (= Münze) |
| g1u06.w.to-pull | To bring a thing to you, not away from you. | The dog can ___ Sherlock out of the river. | to run ; to climb ; to wait | to run ; to climb ; to wait ; to catch ; to jump | — |
| g1u06.w.to-pull-2 | To bring a thing to you. | The dog ___ Sherlock out of the river. | to run ; to catch ; to wait | to run ; to catch ; to wait ; to climb ; to find | — |
| g1u06.w.to-put-on | You do this with a hat or a coat to your body. | Sherlock ___ his hat on his head. | to find ; to pull ; to wait | to find ; to pull ; to wait ; to catch ; to call | coat (= Mantel, Jacke) ; body (= Körper) ; head (= Kopf) |
| g1u06.w.to-run | To go very fast on your feet. | We ___ to school very fast. | to climb ; to wait ; to find | to climb ; to wait ; to find ; to jump ; to catch | fast (= schnell) |
| g1u06.w.to-sit-in-a-tree | To be up high in the woods, not on the floor. | The small bird wants to ___ and sing. | to climb up a tree ; to fall out of the tree ; to bump into a tree | to climb up a tree ; to fall out of the tree ; to bump into a tree ; to go to the park ; to jump into the river | high (= hoch) ; floor (= Boden) ; bird (= Vogel) ; sing (= singen) |
| g1u06.w.to-solve | To find out the answer to a problem. | Sherlock can ___ this hard problem. | to watch ; to wait ; to call | to watch ; to wait ; to call ; to find ; to catch | answer (= Antwort) ; problem (= Problem) ; hard (= schwierig) |
| g1u06.w.to-wait | You do this and you do not go now. | Please ___ here for me at the bus stop. | to run ; to leave ; to find | to run ; to leave ; to find ; to watch ; to call | bus (= Bus) ; stop (= Haltestelle) |
| g1u06.w.to-watch | To look at a thing for a long time. | Sherlock ___ the people in the streets. | to call ; to wait ; to solve | to call ; to wait ; to solve ; to find ; to live | people (= Leute) |
| g1u06.w.tree | This is big and tall and has lots of leaves. You can climb it. | A small bird sits in the ___. | river ; park ; woods | river ; park ; woods ; city ; street | bird (= Vogel) ; sits (= sitzt) |
| g1u06.w.well-done | This is what you call out when a friend does good work. | You did very good work. ___! | Go on. ; Come on! ; Help me! | Go on. ; Come on! ; Help me! ; Go away! ; But it's true! | — |
| g1u06.w.woods | A big place with a lot of trees. | We go for a long walk in the ___. | river ; city ; market | river ; city ; market ; park ; street | place (= Ort) ; walk (= Spaziergang) |

## Grammar items (54)

| id | fmt | prompt | answers | distractors | pairs | groups | gloss |
|---|---|---|---|---|---|---|---|
| g1u06.gi.a-lot-of.ag.001 | anagram | Im Park gibt es viele davon — grün und hoch: ___ (5 Buchstaben). [de, 1 blank(s)] | trees (full) | — | — | — | — |
| g1u06.gi.a-lot-of.cp.001 | context-picker | Doctor Grey schaut in die Straße der Stadt. Welcher Satz ist richtig? [de] | There are lots of cars in the street. (full) | There are a lots of cars in the street. ; There are much of cars in the street. ; There are many of cars in the street. | — | — | — |
| g1u06.gi.a-lot-of.ec.001 | error-correction | There are a lots of stories about Sherlock Groans. [en] | There are a lot of stories about Sherlock Groans. (full) ; There are lots of stories about Sherlock Groans. (full) ; a lot of (partial) ; lots of (partial) | — | — | — | — |
| g1u06.gi.a-lot-of.ec.002 | error-correction | He has got a lots of pens on the desk. [en] | He has got a lot of pens on the desk. (full) ; He has got lots of pens on the desk. (full) ; a lot of (partial) ; lots of (partial) | — | — | — | — |
| g1u06.gi.a-lot-of.ec.003 | error-correction | She has got a lot friends in her class. [en] | She has got a lot of friends in her class. (full) ; She has got lots of friends in her class. (full) ; a lot of (partial) ; of (partial) | — | — | — | — |
| g1u06.gi.a-lot-of.gf.001 | gap-fill | Sherlock Groans has got ___ friends. [en, 1 blank(s)] | a lot of (full) ; lots of (full) | — | — | — | — |
| g1u06.gi.a-lot-of.gf.002 | gap-fill | There are ___ trees in the park. [en, 1 blank(s)] | a lot of (full) ; lots of (full) | — | — | — | — |
| g1u06.gi.a-lot-of.gf.003 | gap-fill | We have got ___ homework today. [en, 1 blank(s)] | a lot of (full) ; lots of (full) | — | — | — | — |
| g1u06.gi.a-lot-of.gf.004 | gap-fill | The detective has got ___ work, but he is happy. [en, 1 blank(s)] | a lot of (full) ; lots of (full) | — | — | — | — |
| g1u06.gi.a-lot-of.gf.005 | gap-fill | She has got ___ books and ___ pens in her school bag. [en, 2 blank(s)] | a lot of \| a lot of (full) ; lots of \| lots of (full) ; a lot of \| lots of (full) ; lots of \| a lot of (full) | — | — | — | — |
| g1u06.gi.a-lot-of.gs.001 | group-sort | Wo findest du das? Sortiere die Sätze. [de] | — | — | — | In the park: There are a lot of trees., There are a lot of dogs. \| At school: There are a lot of books., There is a lot of homework. | — |
| g1u06.gi.a-lot-of.gs.002 | group-sort | Sortiere: viele Dinge oder viel von etwas? [de] | — | — | — | a lot of books: friends, cars, trees, pens \| a lot of homework: money, time, work, fun | — |
| g1u06.gi.a-lot-of.mc.001 | multiple-choice | There are ___ cars in the city. [en, 1 blank(s)] | lots of (full) | a lots of ; many of ; much of | — | — | — |
| g1u06.gi.a-lot-of.mc.002 | multiple-choice | He has got ___ time for the detective story. [en, 1 blank(s)] | lots of (full) | a lots of ; many ; much | — | — | — |
| g1u06.gi.a-lot-of.mc.003 | multiple-choice | Welcher Satz ist richtig? [de] | There are lots of bottles on the table. (full) | There are a lots of bottles on the table. ; There are much of bottles on the table. ; There are many of bottles on the table. | — | — | — |
| g1u06.gi.a-lot-of.mt.001 | matching | Was passt zusammen? [de] | — | — | Sherlock comes to the park. ↔ There are a lot of trees. ; She opens her school bag. ↔ There are a lot of books. ; We look at the city street. ↔ There are a lot of cars. ; It is time for school. ↔ There is a lot of homework. | — | — |
| g1u06.gi.a-lot-of.sb.001 | sentence-building | a lot of / has got / She / friends [en] | She has got a lot of friends. (full) | — | — | — | — |
| g1u06.gi.a-lot-of.sb.002 | sentence-building | lots of / are / There / trees / in the park [en] | There are lots of trees in the park. (full) | — | — | — | — |
| g1u06.gi.a-lot-of.sb.003 | sentence-building | have got / a lot of / homework / We [en] | We have got a lot of homework. (full) | — | — | — | — |
| g1u06.gi.a-lot-of.tf.001 | transformation | She has got many books. → She has got ___ books. [en, 1 blank(s)] | a lot of (full) ; lots of (full) ; She has got a lot of books. (full) ; She has got lots of books. (full) | — | — | — | — |
| g1u06.gi.a-lot-of.tf.002 | transformation | We have got a lot of homework. (lots of) → We have got ___ homework. [en, 1 blank(s)] | lots of (full) ; We have got lots of homework. (full) | — | — | — | — |
| g1u06.gi.a-lot-of.tr.001 | translation | Es gibt viele Bäume im Park. [de] | There are a lot of trees in the park. (full) ; There are lots of trees in the park. (full) | — | — | — | — |
| g1u06.gi.a-lot-of.tr.002 | translation | Der Detektiv hat viel Arbeit. [de] | The detective has got a lot of work. (full) ; The detective has got lots of work. (full) ; The detective has a lot of work. (partial) ; The detective has lots of work. (partial) | — | — | — | — |
| g1u06.gi.a-lot-of.tr.003 | translation | She has got a lot of books. [en] | Sie hat viele Bücher. (full) ; Sie hat jede Menge Bücher. (partial) | — | — | — | — |
| g1u06.gi.present-simple.ag.001 | anagram | he/she/it-Form von 'go' (gehen) [de] | goes (full) | — | — | — | — |
| g1u06.gi.present-simple.ag.002 | anagram | he/she/it-Form von 'watch' (beobachten) [de] | watches (full) | — | — | — | — |
| g1u06.gi.present-simple.cp.001 | context-picker | Deine Freundin macht das jeden Samstag. Welcher Satz stimmt? [de] | She plays the guitar on Saturdays. (full) | She is playing the guitar on Saturdays. ; She play the guitar on Saturdays. ; She playing the guitar on Saturdays. | — | — | — |
| g1u06.gi.present-simple.cp.002 | context-picker | Du erzählst von deinem Morgen. Welcher Satz stimmt? [de] | I run in the park in the morning. (full) | I runs in the park in the morning. ; I am run in the park in the morning. ; I running in the park in the morning. | — | — | — |
| g1u06.gi.present-simple.ec.001 | error-correction | She find her hat in the room. [en] | She finds her hat in the room. (full) ; finds (partial) | — | — | — | — |
| g1u06.gi.present-simple.ec.002 | error-correction | He go to school in the morning. [en] | He goes to school in the morning. (full) ; goes (partial) | — | — | — | — |
| g1u06.gi.present-simple.ec.003 | error-correction | My dog wash the car. [en] | My dog washes the car. (full) ; washes (partial) | — | — | — | — |
| g1u06.gi.present-simple.gf.001 | gap-fill | She ___ (play) the guitar. [en, 1 blank(s)] | plays (full) | — | — | — | — |
| g1u06.gi.present-simple.gf.002 | gap-fill | He ___ (watch) the dogs in the park. [en, 1 blank(s)] | watches (full) | — | — | — | — |
| g1u06.gi.present-simple.gf.003 | gap-fill | My uncle ___ (go) to the market. [en, 1 blank(s)] | goes (full) | — | — | — | — |
| g1u06.gi.present-simple.gf.004 | gap-fill | She ___ (carry) her books to school. [en, 1 blank(s)] | carries (full) | — | — | — | — |
| g1u06.gi.present-simple.gf.005 | gap-fill | We ___ (live) in the city and they ___ (live) in London. [en, 2 blank(s)] | live \| live (full) | — | — | — | — |
| g1u06.gi.present-simple.gf.006 | gap-fill | My uncle ___ (wash) the car. [en, 1 blank(s)] | washes (full) | — | — | — | — |
| g1u06.gi.present-simple.gf.007 | gap-fill | Sherlock ___ (catch) the bad man. [en, 1 blank(s)] | catches (full) | — | — | — | — |
| g1u06.gi.present-simple.gs.001 | group-sort | Sortiere: play oder plays? [de] | — | — | — | play: I, you, we, they \| plays: he, she, it | — |
| g1u06.gi.present-simple.gs.002 | group-sort | Sortiere nach der he/she/it-Form: plays, goes oder carries? [de] | — | — | — | plays: play, read, live, clean \| goes: go, watch, wash, catch \| carries: carry, study | — |
| g1u06.gi.present-simple.mc.001 | multiple-choice | My sister ___ to the park. [en, 1 blank(s)] | runs (full) | run ; is run ; running | — | — | — |
| g1u06.gi.present-simple.mc.002 | multiple-choice | My friend ___ the drums. [en, 1 blank(s)] | plays (full) | play ; is play ; playing | — | — | — |
| g1u06.gi.present-simple.mc.003 | multiple-choice | Welcher Satz stimmt? [de] | She reads a book in the morning. (full) | She read a book in the morning. ; She reading a book in the morning. ; She is read a book in the morning. | — | — | — |
| g1u06.gi.present-simple.mp.001 | matching-pairs | Finde die Paare: I … und he … . [de] | — | — | play ↔ plays ; wash ↔ washes ; catch ↔ catches ; carry ↔ carries ; do ↔ does | — | — |
| g1u06.gi.present-simple.mt.001 | matching | he/she/it: Was passt zusammen? [de] | — | — | go ↔ goes ; watch ↔ watches ; carry ↔ carries ; play ↔ plays | — | — |
| g1u06.gi.present-simple.qf.001 | question-formation | She reads a book. Ask what she does. [en] | What does she read? (full) ; What does she read (partial) | — | — | — | — |
| g1u06.gi.present-simple.sb.001 | sentence-building | the / She / drums / plays [en] | She plays the drums. (full) | — | — | — | — |
| g1u06.gi.present-simple.sb.002 | sentence-building | to / school / He / books / his / carries [en] | He carries his books to school. (full) | — | — | — | — |
| g1u06.gi.present-simple.tf.001 | transformation | I play the guitar. (he) → He ___ the guitar. [en, 1 blank(s)] | plays (full) ; He plays the guitar. (full) ; He plays the guitar (partial) | — | — | — | — |
| g1u06.gi.present-simple.tf.002 | transformation | I carry the bottle. (she) → She ___ the bottle. [en, 1 blank(s)] | carries (full) ; She carries the bottle. (full) ; She carries the bottle (partial) | — | — | — | — |
| g1u06.gi.present-simple.tf.003 | transformation | I clean my room. (he) → He ___ his room. [en, 1 blank(s)] | cleans (full) ; He cleans his room. (full) ; He cleans his room (partial) | — | — | — | — |
| g1u06.gi.present-simple.tr.001 | translation | Er wohnt in London. [de] | He lives in London. (full) | — | — | — | — |
| g1u06.gi.present-simple.tr.002 | translation | Sie spielt die Gitarre. [de] | She plays the guitar. (full) | — | — | — | — |
| g1u06.gi.present-simple.tr.003 | translation | Er geht in den Park. [de] | He goes to the park. (full) | — | — | — | — |

## Output contract

Write `content/corpus/units/g1-u06/verify/level-gloss.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u06",
  "lens": "level-gloss",
  "itemsHash": "ca33d0b51fc1",
  "promptHash": "aefb997bf664",
  "round": 1,
  "by": "fable-lens-level-gloss",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 103, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
