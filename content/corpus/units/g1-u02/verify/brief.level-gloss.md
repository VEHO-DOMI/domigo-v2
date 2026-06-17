# Verify lens — level-gloss — g1-u02 (round 1)

<!-- domigo:verify level-gloss g1-u02 items=70212a6b7573 prompt=aefb997bf664 round=1 -->

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Ahmed, Arbeit, Befehlsformen, Betty, Bild, Box, Buddy, California, Cambridge, Carina, Carl, Chloe, Classroom, Dave, Dialog, Don, England, English, False, Freddy, Gordon, Homework, Imperatives, Irregular, Jenny, Julia, Leah, London, Mail, Manchester, Mike, Nice, Nomen, Number, Numbers, Omar, Plural, Prepositions, Rajit, Reihenfolge, Saying, School, Sue, Text, True, Welcome, Well, Work, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Vocab items (52)

| id | d | s | mc | pool | gloss |
|---|---|---|---|---|---|
| g1u02.w.adult | A man or woman who is not a child. | ___ are €14.40. | child ; family ; group | child ; family ; group ; guide ; ticket | man (= Mann) ; woman (= Frau) |
| g1u02.w.at | It says where you are. The children are here, ___ school. | The children are ___ the zoo. | from ; for ; but | from ; for ; but ; in ; on | says (= sagt) |
| g1u02.w.at-last | You speak this when you wait a long time and then it is here. | ___ The train is here now! | How strange! ; Let me see. ; Where | How strange! ; Let me see. ; Where ; happy ; free | wait (= warten) |
| g1u02.w.beautiful | Very nice to look at. | The parrot is blue and yellow. It's ___. | big ; small ; long | big ; small ; long ; happy ; free | blue (= blau) ; yellow (= gelb) |
| g1u02.w.behind | It is at the back. You cannot look at it from the front. | The chair is ___ the desk. | in front of ; on ; next to | in front of ; on ; next to ; under ; in | back (= Rückseite) ; front (= Vorderseite) |
| g1u02.w.behind-2 | It is at the back of a thing. It is not in front. | There are three monkeys. They're ___ the tree. | in front of ; on ; in | in front of ; on ; in ; under ; next to | back (= Rückseite) ; front (= Vorderseite) |
| g1u02.w.big | Not small. A giraffe is this. | There's a ___ giraffe. | small ; long ; free | small ; long ; free ; happy ; beautiful | — |
| g1u02.w.but | It joins two ideas. I love cats, ___ not dogs. | Dogs are welcome. ___ they can't run around. | from ; for ; at | from ; for ; at ; in ; on | joins (= verbindet) ; ideas (= Ideen) ; cats (= Katzen) ; run (= rennen) ; around (= herum) |
| g1u02.w.car | A thing with four wheels that you go in on the road. | The parrot is in the ___. | train ; tree ; stone | train ; tree ; stone ; zoo ; ticket | wheels (= Räder) ; road (= Straße) |
| g1u02.w.child | A young one, not an adult. You go to school when you are this. | There are four ___ in the wildlife park. | adult ; guide ; family | adult ; guide ; family ; group ; dog | young (= jung) ; wildlife park (= Tierpark) |
| g1u02.w.dog | An animal you love. Buddy is one. | Can I bring my ___, Buddy? | lion ; parrot ; giraffe | lion ; parrot ; giraffe ; monkey ; penguin | animal (= Tier) |
| g1u02.w.family | It is your mum and dad and you. | Buddy's ___ is at the zoo. | group ; guide ; adult | group ; guide ; adult ; child ; zoo | mum (= Mama) ; dad (= Papa) |
| g1u02.w.for | It says who gets a thing. This is ___ you. | Here's a chant ___ you. | from ; at ; but | from ; at ; but ; in ; on | says (= sagt) ; gets (= bekommt) ; chant (= Sprechgesang) |
| g1u02.w.free | You do not give money for it. | Parking is ___. | big ; small ; happy | big ; small ; happy ; long ; beautiful | money (= Geld) ; parking (= Parken) |
| g1u02.w.from | It says where your home is. They are here, ___ California. | They are ___ California. | for ; at ; but | for ; at ; but ; in ; on | says (= sagt) ; home (= Zuhause) |
| g1u02.w.giraffe | A big animal at the zoo. It has a very long neck. | There's a big ___. | monkey ; penguin ; parrot | monkey ; penguin ; parrot ; lion ; dog | animal (= Tier) ; neck (= Hals) |
| g1u02.w.grandma | She is your mum's mum. | Say hi to ___! | family ; guide ; adult | family ; guide ; adult ; child ; group | mum's (= von der Mama) ; mum (= Mama) ; Say (= Sag) |
| g1u02.w.group | Many children, not one child. | A ___ ticket is €8.90. | family ; adult ; guide | family ; adult ; guide ; child ; ticket | — |
| g1u02.w.guide | A man or woman who walks with you and tells you about the zoo. | Listen to the ___. | family ; group ; child | family ; group ; child ; adult ; dog | man (= Mann) ; woman (= Frau) ; walks (= geht) ; tells (= erzählt) |
| g1u02.w.happy | You feel good. You are not sad. | Buddy is ___. | big ; small ; long | big ; small ; long ; free ; beautiful | feel (= fühlen) ; good (= gut) ; sad (= traurig) |
| g1u02.w.he | It is for a boy or a man. | Mike is at the zoo. ___ is happy. | she ; they ; we | she ; they ; we ; it ; us | boy (= Junge) ; man (= Mann) |
| g1u02.w.how-strange | You speak this for a very, very odd thing. | A dog in the tree? ___ | At last. ; Let me see. ; Where | At last. ; Let me see. ; Where ; beautiful ; happy | odd (= seltsam, komisch) |
| g1u02.w.in | It is not on the desk and not under it. The pen is here, ___ the box. | The parrot is ___ the car. | on ; behind ; next to | on ; behind ; next to ; under ; in front of | — |
| g1u02.w.in-front-of | It is here, you look at it. It is not behind you. | The tree is ___ you. | behind ; under ; in | behind ; under ; in ; on ; next to | front (= Vorderseite) |
| g1u02.w.in-front-of-2 | Here, where you look. It is not behind you. | Yes, the tree ___ you! | behind ; under ; in | behind ; under ; in ; on ; next to | front (= Vorderseite) |
| g1u02.w.let-me-see | You speak this when you want to look at a thing. | You have a stone? ___ | At last. ; How strange! ; Where | At last. ; How strange! ; Where ; happy ; free | — |
| g1u02.w.lion | A big animal at the zoo. It is the king of the animals. | I want a ___. | parrot ; penguin ; train | parrot ; penguin ; train ; monkey ; giraffe | animal (= Tier) ; king (= König) |
| g1u02.w.long | Not short. A giraffe neck is this. | The giraffe has a ___ neck. | big ; small ; free | big ; small ; free ; happy ; beautiful | short (= kurz) ; neck (= Hals) |
| g1u02.w.monkey | A small animal that climbs in trees at the zoo. | The ___ is next to the parrot. | lion ; penguin ; giraffe | lion ; penguin ; giraffe ; parrot ; dog | animal (= Tier) ; climbs (= klettert) |
| g1u02.w.next-to | It is here, very close. It is not behind and not under. | The parrot is ___ the monkeys. | under ; behind ; in | under ; behind ; in ; on ; in front of | — |
| g1u02.w.next-to-2 | Very close, at the side. The parrot is here, close to the monkey. | It's ___ the brown monkey. | under ; behind ; on | under ; behind ; on ; in ; in front of | side (= Seite) ; brown (= braun) |
| g1u02.w.on | It is at the top of a thing. The book is here, at the top of the desk. | There's a book ___ my desk. | under ; in ; behind | under ; in ; behind ; next to ; in front of | top (= oben) |
| g1u02.w.parrot | A bird that can talk to you. | The ___ is on Buddy now. | lion ; giraffe ; penguin | lion ; giraffe ; penguin ; monkey ; dog | bird (= Vogel) |
| g1u02.w.penguin | A black and white bird. It cannot fly, but it can swim. | Let's go and feed the ___. | giraffe ; monkey ; lion | giraffe ; monkey ; lion ; parrot ; tree | black (= schwarz) ; white (= weiß) ; bird (= Vogel) ; fly (= fliegen) ; swim (= schwimmen) ; feed (= füttern) |
| g1u02.w.she | It is for a girl or a woman. | ___ is from England. | he ; they ; we | he ; they ; we ; it ; us | girl (= Mädchen) ; woman (= Frau) |
| g1u02.w.small | Not big. A baby monkey is this. | The monkey isn't big. It's ___. | big ; long ; happy | big ; long ; happy ; free ; beautiful | baby (= Baby-) |
| g1u02.w.stone | It is grey and hard. You find it on the ground. | Colour your ___. | car ; train ; ticket | car ; train ; ticket ; tree ; zoo | grey (= grau) ; hard (= hart) ; ground (= Boden) ; Colour (= Male ... an) |
| g1u02.w.they | It is for more than one. Sue and Mike are two. | Don and Sue are 11. ___ are from Manchester. | he ; she ; we | he ; she ; we ; it ; us | — |
| g1u02.w.ticket | You give money for this. Then you can go in. | Adult ___ are €14.40. | car ; tree ; stone | car ; tree ; stone ; zoo ; train | money (= Geld) |
| g1u02.w.to-bring | To take a thing with you to a place. | Can I ___ my dog, Buddy? | want ; talk ; find | want ; talk ; find ; give ; love | take (= nehmen) ; place (= Ort) |
| g1u02.w.to-let-somebody-out | To open the door so a child can go out. | We're not happy. ___ us out! | want ; bring ; talk | want ; bring ; talk ; find ; love | let (= lassen) |
| g1u02.w.to-talk | To speak with a friend. | ___ about the boys and girls. | want ; bring ; find | want ; bring ; find ; give ; love | friend (= Freund) ; boys (= Jungen) ; girls (= Mädchen) |
| g1u02.w.to-want | To wish to have a thing. | I ___ a lion. | bring ; talk ; find | bring ; talk ; find ; give ; love | wish (= wünschen) |
| g1u02.w.train | You go on this at the zoo. It is a long thing on tracks. | Go on a ___ at the zoo. | car ; tree ; stone | car ; tree ; stone ; zoo ; ticket | tracks (= Schienen) |
| g1u02.w.tree | It is a big green plant. A monkey can climb in it. | The monkeys are behind the ___. | car ; ticket ; stone | car ; ticket ; stone ; train ; zoo | green (= grün) ; plant (= Pflanze) ; climb (= klettern) |
| g1u02.w.under | It is here, at the bottom. The book is here, ___ the desk. | There's a book ___ my desk. | on ; in front of ; behind | on ; in front of ; behind ; next to ; in | bottom (= unten) |
| g1u02.w.under-2 | At the bottom of a thing. The parrot is here, and the giraffe is on top. | There's a parrot ___ the giraffe! | on ; in front of ; behind | on ; in front of ; behind ; next to ; in | bottom (= unten) ; top (= oben) |
| g1u02.w.us | It is for you and me. The guide can look at ___. | Let ___ out! | he ; she ; they | he ; she ; they ; we ; it | let (= lassen) |
| g1u02.w.we | It is for you and me. | Sue and I are at the zoo. ___ are happy. | he ; she ; they | he ; she ; they ; it ; us | — |
| g1u02.w.where | You ask this when you want to find a thing. | ___ is the parrot? | who ; when ; what | who ; when ; what ; how ; which | — |
| g1u02.w.year | You are ten of these now. | I'm in ___ 7. | family ; group ; ticket | family ; group ; ticket ; zoo ; car | — |
| g1u02.w.zoo | A place where you can see a lion, a monkey and a giraffe. | The children are at the ___. | car ; tree ; ticket | car ; tree ; ticket ; train ; stone | place (= Ort) ; see (= sehen) |

## Grammar items (186)

| id | fmt | prompt | answers | distractors | pairs | groups | gloss |
|---|---|---|---|---|---|---|---|
| g1u02.gi.prepositions-place.ag.005 | anagram | Englisch für „unter" (Englisch) [de] | under (full) | — | — | — | — |
| g1u02.gi.prepositions-place.ag.006 | anagram | Englisch für „hinter" (Englisch) [de] | behind (full) | — | — | — | — |
| g1u02.gi.prepositions-place.cp.001 | context-picker | Du findest deinen Stift nicht. Dein Freund sagt, er liegt unter deinem Buch. Welcher Satz ist richtig? [de] | The pen is under the book. (full) | The pen is on the book. ; The pen is in the book. ; The pen is behind the book. | — | — | — |
| g1u02.gi.prepositions-place.cp.002 | context-picker | Im Zoo sitzt der Papagei oben auf dem Löwen. Welcher Satz ist richtig? [de] | The parrot is on the lion. (full) | The parrot is in the lion. ; The parrot is under the lion. ; The parrot is next to the lion. | — | — | — |
| g1u02.gi.prepositions-place.cp.003 | context-picker | Die Giraffe ist vorne, der Zug dahinter. Welcher Satz ist richtig? [de] | The giraffe is in front of the train. (full) | The giraffe is behind the train. ; The giraffe is under the train. ; The giraffe is in the train. | — | — | — |
| g1u02.gi.prepositions-place.ec.001 | error-correction | Verbessere den Fehler: The tree is in front the giraffe. [de] | The tree is in front of the giraffe. (full) ; of (partial) | — | — | — | — |
| g1u02.gi.prepositions-place.ec.002 | error-correction | Verbessere den Fehler: The dog is next the car. [de] | The dog is next to the car. (full) ; to (partial) | — | — | — | — |
| g1u02.gi.prepositions-place.ec.003 | error-correction | Der Hund sitzt oben auf dem Pult. Verbessere den Fehler: The dog is in the desk. [de] | The dog is on the desk. (full) ; on (partial) | — | — | — | — |
| g1u02.gi.prepositions-place.ec.004 | error-correction | Du siehst den Stift nicht — er steckt innen. Verbessere den Fehler: It's on my pencil case. [de] | It's in my pencil case. (full) ; It is in my pencil case. (full) ; in (partial) | — | — | — | — |
| g1u02.gi.prepositions-place.gf.001 | gap-fill | Oben drauf: The book is ___ the desk. [de, 1 blank(s)] | on (full) | in ; under ; behind | — | — | — |
| g1u02.gi.prepositions-place.gf.002 | gap-fill | Drinnen: The pen is ___ the pencil case. [de, 1 blank(s)] | in (full) | on ; under ; next to | — | — | — |
| g1u02.gi.prepositions-place.gf.003 | gap-fill | Darunter: The shoe is ___ the chair. [de, 1 blank(s)] | under (full) | on ; in ; behind | — | — | — |
| g1u02.gi.prepositions-place.gf.004 | gap-fill | Oben drauf: The picture is ___ the door. [de, 1 blank(s)] | on (full) | in ; under ; behind | — | — | — |
| g1u02.gi.prepositions-place.gf.005 | gap-fill | Drinnen: The hat is ___ the box. [de, 1 blank(s)] | in (full) | on ; under ; behind | — | — | — |
| g1u02.gi.prepositions-place.gf.006 | gap-fill | Hinter dem Baum: There is a parrot ___ the tree. [de, 1 blank(s)] | behind (full) | on ; in ; next to | — | — | — |
| g1u02.gi.prepositions-place.gf.007 | gap-fill | Daneben: The guide is ___ the lion. [de, 1 blank(s)] | next to (full) | under ; behind ; in front of | — | — | — |
| g1u02.gi.prepositions-place.gf.008 | gap-fill | Davor: The tree is ___ the giraffe. [de, 1 blank(s)] | in front of (full) | behind ; under ; next to | — | — | — |
| g1u02.gi.prepositions-place.gf.009 | gap-fill | Du kannst ihn nicht sehen, er ist drinnen: The dog is ___ the box. [de, 1 blank(s)] | in (full) | on ; under ; next to | — | — | — |
| g1u02.gi.prepositions-place.gf.010 | gap-fill | Versteckt auf der Rückseite: The dog is ___ the desk. [de, 1 blank(s)] | behind (full) | on ; in ; next to | — | — | — |
| g1u02.gi.prepositions-place.gf.011 | gap-fill | Oben drauf: The tablet is ___ the desk. [de, 1 blank(s)] | on (full) | in ; under ; behind | — | — | — |
| g1u02.gi.prepositions-place.gf.012 | gap-fill | Wo ist der Papagei? Er sitzt davor: It's ___ the car. [de, 1 blank(s)] | in front of (full) | behind ; under ; in | — | — | — |
| g1u02.gi.prepositions-place.gf.013 | gap-fill | Daneben: The penguin is ___ the giraffe. [de, 1 blank(s)] | next to (full) | under ; in ; behind | — | — | — |
| g1u02.gi.prepositions-place.gf.014 | gap-fill | Wo sind die Affen? Sie sind hinter dem Baum: They're ___ the tree. [de, 1 blank(s)] | behind (full) | on ; next to ; in front of | — | — | — |
| g1u02.gi.prepositions-place.gf.015 | gap-fill | Drinnen: The ruler is ___ the school bag. [de, 1 blank(s)] | in (full) | on ; under ; behind | — | — | — |
| g1u02.gi.prepositions-place.gf.016 | gap-fill | Daneben: The scissors are ___ the book. [de, 1 blank(s)] | next to (full) | in ; under ; behind | — | — | — |
| g1u02.gi.prepositions-place.gf.017 | gap-fill | Drinnen im Zoo und hinter dem Zug: There is a giraffe ___ the zoo, and a lion ___ the train. [de, 2 blank(s)] | in \| behind (full) | — | — | — | — |
| g1u02.gi.prepositions-place.gf.018 | gap-fill | Oben drauf: The sweater is ___ the bed. [de, 1 blank(s)] | on (full) | in ; under ; behind | — | — | — |
| g1u02.gi.prepositions-place.gf.019 | gap-fill | Davor: Where are the penguins? They're ___ the train. [de, 1 blank(s)] | in front of (full) | behind ; under ; next to | — | — | — |
| g1u02.gi.prepositions-place.gs.001 | group-sort | Wo ist der Papagei? Ordne die Orte zu. [de] | — | — | — | in: the box, the car, the school bag \| on: the desk, the chair, the train \| under: the bed, the tree, the door | — |
| g1u02.gi.prepositions-place.gs.002 | group-sort | Wo ist der Hund? Ordne die Orte zu. [de] | — | — | — | behind: the tree, the door \| next to: the chair, the lion \| in front of: the train, the car | — |
| g1u02.gi.prepositions-place.mc.001 | multiple-choice | Unterhalb des Stuhls: The dog is ___ the chair. [de, 1 blank(s)] | under (full) | on ; in ; behind | — | — | — |
| g1u02.gi.prepositions-place.mc.002 | multiple-choice | Oben auf dem Zug: The parrot is ___ the train. [de, 1 blank(s)] | on (full) | in ; under ; behind | — | — | — |
| g1u02.gi.prepositions-place.mc.003 | multiple-choice | Der Löwe ist vorne, der Baum hinten: The lion is ___ the tree. [de, 1 blank(s)] | in front of (full) | behind ; under ; next to | — | — | — |
| g1u02.gi.prepositions-place.mc.004 | multiple-choice | Direkt daneben: The monkey is ___ the parrot. [de, 1 blank(s)] | next to (full) | in ; under ; in front of | — | — | — |
| g1u02.gi.prepositions-place.mc.005 | multiple-choice | Drinnen, du kannst ihn nicht sehen: The parrot is ___ the box. [de, 1 blank(s)] | in (full) | on ; behind ; next to | — | — | — |
| g1u02.gi.prepositions-place.mt.001 | matching | Verbinde die Frage mit der Antwort. [de] | — | — | Where is the parrot? ↔ It's in the tree. ; Where is the dog? ↔ It's under the desk. ; Where is the hat? ↔ It's on the chair. ; Where are the monkeys? ↔ They're behind the tree. | — | — |
| g1u02.gi.prepositions-place.mt.002 | matching | Verbinde den Satzanfang mit dem Ende. [de] | — | — | The book is in ↔ the school bag. ; The picture is on ↔ the door. ; The dog is under ↔ the chair. ; The tree is in front of ↔ the car. | — | — |
| g1u02.gi.prepositions-place.sb.001 | sentence-building | the / is / behind / monkey / tree / the [en] | The monkey is behind the tree. (full) | — | — | — | — |
| g1u02.gi.prepositions-place.sb.002 | sentence-building | is / next to / the / the / parrot / lion [en] | The parrot is next to the lion. (full) | — | — | — | — |
| g1u02.gi.prepositions-place.sb.003 | sentence-building | is / in front of / the / the / giraffe / train [en] | The giraffe is in front of the train. (full) | — | — | — | — |
| g1u02.gi.prepositions-place.sb.004 | sentence-building | is / under / the / the / shoe / chair [en] | The shoe is under the chair. (full) | — | — | — | — |
| g1u02.gi.prepositions-place.tf.001 | transformation | Setze das Gegenteil ein: The dog is under the desk. → The dog is ___ the desk. [de, 1 blank(s)] | on (full) ; The dog is on the desk. (full) | — | — | — | — |
| g1u02.gi.prepositions-place.tf.002 | transformation | Setze das Gegenteil ein: The lion is behind the tree. → The lion is ___ the tree. [de, 1 blank(s)] | in front of (full) ; The lion is in front of the tree. (full) | — | — | — | — |
| g1u02.gi.prepositions-place.tf.003 | transformation | Setze das Gegenteil ein: The parrot is on the box. → The parrot is ___ the box. [de, 1 blank(s)] | under (full) ; The parrot is under the box. (full) | — | — | — | — |
| g1u02.gi.prepositions-place.tf.004 | transformation | Setze das Gegenteil ein: The guide is in front of the train. → The guide is ___ the train. [de, 1 blank(s)] | behind (full) ; The guide is behind the train. (full) | — | — | — | — |
| g1u02.gi.prepositions-place.tf.005 | transformation | Setze das Gegenteil ein: The book is in front of the tablet. → The book is ___ the tablet. [de, 1 blank(s)] | behind (full) ; The book is behind the tablet. (full) | — | — | — | — |
| g1u02.gi.prepositions-place.tr.001 | translation | Das Buch ist auf dem Pult. [de] | The book is on the desk. (full) ; The book is on the desk (partial) | — | — | — | — |
| g1u02.gi.prepositions-place.tr.002 | translation | Der Hund ist unter dem Stuhl. [de] | The dog is under the chair. (full) ; The dog is under the chair (partial) | — | — | — | — |
| g1u02.gi.prepositions-place.tr.003 | translation | Der Baum ist vor dem Zug. [de] | The tree is in front of the train. (full) ; The tree is in front of the train (partial) | — | — | — | — |
| g1u02.gi.prepositions-place.tr.004 | translation | Wo ist der Papagei? Er ist im Baum. [de] | Where is the parrot? It's in the tree. (full) ; Where is the parrot? It is in the tree. (full) ; Where's the parrot? It's in the tree. (full) | — | — | — | — |
| g1u02.gi.prepositions-place.tr.005 | translation | The lion is behind the car. [en] | Der Löwe ist hinter dem Auto. (full) | — | — | — | — |
| g1u02.gi.prepositions-place.tr.006 | translation | The guide is next to the giraffe. [en] | Der Reiseführer ist neben der Giraffe. (full) ; Die Reiseführerin ist neben der Giraffe. (partial) | — | — | — | — |
| g1u02.gi.subject-pronouns.ag.003 | anagram | Das englische Wort für ein Mädchen: ___ (e h s) [de, 1 blank(s)] | she (full) | — | — | — | — |
| g1u02.gi.subject-pronouns.ag.004 | anagram | Das englische Wort für mehrere (sie): ___ (h t e y) [de, 1 blank(s)] | they (full) | — | — | — | — |
| g1u02.gi.subject-pronouns.cp.002 | context-picker | You and Sue are at the zoo. [en] | We are at the zoo. (full) | They are at the zoo. ; You are at the zoo. ; He is at the zoo. | — | — | — |
| g1u02.gi.subject-pronouns.cp.003 | context-picker | Look at the train. [en] | It is long. (full) | He is long. ; She is long. ; They are long. | — | — | — |
| g1u02.gi.subject-pronouns.ec.001 | error-correction | The car is big. He is free. [en] | The car is big. It is free. (full) ; The car is big. It's free. (full) ; It (partial) | — | — | — | — |
| g1u02.gi.subject-pronouns.ec.002 | error-correction | This is Carl. It is from London. [en] | This is Carl. He is from London. (full) ; This is Carl. He's from London. (full) ; He (partial) | — | — | — | — |
| g1u02.gi.subject-pronouns.ec.003 | error-correction | Look at the penguins. It are small. [en] | Look at the penguins. They are small. (full) ; Look at the penguins. They're small. (full) ; They (partial) | — | — | — | — |
| g1u02.gi.subject-pronouns.gf.001 | gap-fill | Carl is at the zoo. ___ is happy. [en, 1 blank(s)] | He (full) | She ; It ; They | — | — | — |
| g1u02.gi.subject-pronouns.gf.002 | gap-fill | Betty is from England. ___ is happy. [en, 1 blank(s)] | She (full) | He ; It ; They | — | — | — |
| g1u02.gi.subject-pronouns.gf.003 | gap-fill | Look at the parrot. ___ is beautiful. [en, 1 blank(s)] | It (full) | He ; She ; They | — | — | — |
| g1u02.gi.subject-pronouns.gf.004 | gap-fill | The car is small. ___ is in front of the zoo. [en, 1 blank(s)] | It (full) | He ; She ; They | — | — | — |
| g1u02.gi.subject-pronouns.gf.005 | gap-fill | Sue and Dave are at the zoo. ___ are happy. [en, 1 blank(s)] | They (full) | He ; She ; We | — | — | — |
| g1u02.gi.subject-pronouns.gf.006 | gap-fill | Sue and I are at the zoo. ___ are happy. [en, 1 blank(s)] | We (full) | They ; You ; She | — | — | — |
| g1u02.gi.subject-pronouns.gf.007 | gap-fill | Where are the monkeys? ___ are in the tree. [en, 1 blank(s)] | They (full) | It ; He ; We | — | — | — |
| g1u02.gi.subject-pronouns.gs.001 | group-sort | one, or more than one? [en] | — | — | — | one: he, she, it \| more than one: we, they | — |
| g1u02.gi.subject-pronouns.mc.001 | multiple-choice | Dave is from York. ___ is happy. [en, 1 blank(s)] | He (full) | She ; It ; They | — | — | — |
| g1u02.gi.subject-pronouns.mc.002 | multiple-choice | Look at the giraffe. ___ is big. [en, 1 blank(s)] | It (full) | He ; She ; They | — | — | — |
| g1u02.gi.subject-pronouns.mc.003 | multiple-choice | Sue and Carl are at the zoo. ___ are happy. [en, 1 blank(s)] | They (full) | We ; He ; It | — | — | — |
| g1u02.gi.subject-pronouns.mt.001 | matching | he, she, it, they or we? [en] | — | — | Carl ↔ he ; Betty ↔ she ; the dog ↔ it ; Sue and Carl ↔ they ; Betty and I ↔ we | — | — |
| g1u02.gi.subject-pronouns.sb.001 | sentence-building | She / is / from / England [en] | She is from England. (full) ; She's from England. (full) | — | — | — | — |
| g1u02.gi.subject-pronouns.sb.002 | sentence-building | They / are / in / the / tree [en] | They are in the tree. (full) ; They're in the tree. (full) | — | — | — | — |
| g1u02.gi.subject-pronouns.tf.001 | transformation | Betty is happy. → ___ is happy. [en, 1 blank(s)] | She (full) ; She is happy. (full) ; She's happy. (full) | — | — | — | — |
| g1u02.gi.subject-pronouns.tf.002 | transformation | The children are at the zoo. → ___ are at the zoo. [en, 1 blank(s)] | They (full) ; They are at the zoo. (full) ; They're at the zoo. (full) | — | — | — | — |
| g1u02.gi.subject-pronouns.tf.003 | transformation | The lion is big. → ___ is big. [en, 1 blank(s)] | It (full) ; It is big. (full) ; It's big. (full) | — | — | — | — |
| g1u02.gi.subject-pronouns.tr.001 | translation | Er ist aus London. (ein Junge) [de] | He is from London. (full) ; He's from London. (full) | — | — | — | — |
| g1u02.gi.subject-pronouns.tr.002 | translation | Das Auto ist klein. Es ist vor dem Zoo. (Auto ist kein Mensch!) [de] | The car is small. It is in front of the zoo. (full) ; The car is small. It's in front of the zoo. (full) | — | — | — | — |
| g1u02.gi.there-is-are.ag.001 | anagram | Das kleine Wort, das vor 'is' und 'are' steht, wenn du sagst, dass es etwas gibt. [de] | there (full) | — | — | — | — |
| g1u02.gi.there-is-are.ag.003 | anagram | Mehr als ein 'penguin' — das Wort nach 'There are'. [de] | penguins (full) | — | — | — | — |
| g1u02.gi.there-is-are.cp.001 | context-picker | Du schaust auf den Baum im Zoo: drei Affen! Was sagst du? [de] | There are three monkeys in the tree. (full) | There is three monkeys in the tree. ; It has three monkeys in the tree. ; They is three monkeys in the tree. | — | — | — |
| g1u02.gi.there-is-are.cp.002 | context-picker | Du öffnest dein Federmäppchen: ein Lineal! Was sagst du? [de] | There is a ruler in my pencil case. (full) | There are a ruler in my pencil case. ; It has a ruler in my pencil case. ; There be a ruler in my pencil case. | — | — | — |
| g1u02.gi.there-is-are.cp.003 | context-picker | Heute sind keine Pinguine im Zoo. Was sagst du? [de] | There aren't any penguins at the zoo. (full) | There isn't any penguins at the zoo. ; There aren't a penguins at the zoo. ; It hasn't any penguins at the zoo. | — | — | — |
| g1u02.gi.there-is-are.ec.001 | error-correction | There are a giraffe at the zoo. [en] | There is a giraffe at the zoo. (full) ; There's a giraffe at the zoo. (full) ; There is a giraffe at the zoo (partial) ; is (partial) | — | — | — | — |
| g1u02.gi.there-is-are.ec.002 | error-correction | There is three monkeys in the tree. [en] | There are three monkeys in the tree. (full) ; There are three monkeys in the tree (partial) ; are (partial) | — | — | — | — |
| g1u02.gi.there-is-are.ec.003 | error-correction | It has a guide at the zoo. [en] | There is a guide at the zoo. (full) ; There's a guide at the zoo. (full) ; There is a guide at the zoo (partial) ; There is (partial) ; there (partial) | — | — | — | — |
| g1u02.gi.there-is-are.ec.004 | error-correction | There are penguins next to the train? Yes, nine of them. [en] | Are there penguins next to the train? Yes, nine of them. (full) ; Are there penguins next to the train? (partial) ; Are there (partial) | — | — | — | — |
| g1u02.gi.there-is-are.ec.005 | error-correction | There aren't a lion in front of the train. [en] | There isn't a lion in front of the train. (full) ; There's no lion in front of the train. (full) ; There isn't a lion in front of the train (partial) ; isn't (partial) | — | — | — | — |
| g1u02.gi.there-is-are.gf.001 | gap-fill | ___ a giraffe at the zoo. (there is / there are) [en, 1 blank(s)] | There is (full) ; There's (full) | There are ; It is ; It has | — | — | — |
| g1u02.gi.there-is-are.gf.002 | gap-fill | ___ three monkeys behind the tree. (there is / there are) [en, 1 blank(s)] | There are (full) | There is ; It has ; There has | — | — | — |
| g1u02.gi.there-is-are.gf.003 | gap-fill | ___ a parrot in the tree. (there is / there are) [en, 1 blank(s)] | There is (full) ; There's (full) | There are ; They are ; It has | — | — | — |
| g1u02.gi.there-is-are.gf.004 | gap-fill | ___ two giraffes at the zoo. (there is / there are) [en, 1 blank(s)] | There are (full) | There is ; It is ; There has | — | — | — |
| g1u02.gi.there-is-are.gf.005 | gap-fill | ___ a lion in front of the train. (there is / there are) [en, 1 blank(s)] | There is (full) ; There's (full) | There are ; It has ; They are | — | — | — |
| g1u02.gi.there-is-are.gf.006 | gap-fill | ___ five penguins next to the train. (there is / there are) [en, 1 blank(s)] | There are (full) | There is ; It has ; There has | — | — | — |
| g1u02.gi.there-is-are.gf.007 | gap-fill | ___ a book and a ruler on the desk. (there is / there are) [en, 1 blank(s)] | There is (full) ; There's (full) | There are ; They are ; It has | — | — | — |
| g1u02.gi.there-is-are.gf.008 | gap-fill | ___ ten pencils in the pencil case. (there is / there are) [en, 1 blank(s)] | There are (full) | There is ; It is ; There has | — | — | — |
| g1u02.gi.there-is-are.gf.009 | gap-fill | ___ a guide at the zoo? (Is there / Are there) [en, 1 blank(s)] | Is there (full) | Are there ; There is ; Does there | — | — | — |
| g1u02.gi.there-is-are.gf.010 | gap-fill | ___ any monkeys behind the tree? (Is there / Are there) [en, 1 blank(s)] | Are there (full) | Is there ; There are ; Have there | — | — | — |
| g1u02.gi.there-is-are.gf.011 | gap-fill | ___ any books in your school bag? (Is there / Are there) [en, 1 blank(s)] | Are there (full) | Is there ; There are ; Does there | — | — | — |
| g1u02.gi.there-is-are.gf.012 | gap-fill | There ___ a parrot in the tree. (isn't / aren't) [en, 1 blank(s)] | isn't (full) ; is not (full) | aren't ; doesn't ; don't | — | — | — |
| g1u02.gi.there-is-are.gf.013 | gap-fill | There ___ any lions in front of the train. (isn't / aren't) [en, 1 blank(s)] | aren't (full) ; are not (full) | isn't ; doesn't ; don't | — | — | — |
| g1u02.gi.there-is-are.gf.014 | gap-fill | There ___ a big giraffe, but there ___ any penguins. (is / aren't) [en, 2 blank(s)] | is \| aren't (full) ; is \| are not (full) | — | — | — | — |
| g1u02.gi.there-is-are.gf.015 | gap-fill | There ___ a train and there ___ giraffes at the zoo. (is / are) [en, 2 blank(s)] | is \| are (full) | — | — | — | — |
| g1u02.gi.there-is-are.gs.002 | group-sort | Sortiere die Satzanfänge: ist da etwas (+) oder ist da nichts (–)? [de] | — | — | — | There is / There are: There is a giraffe., There are two lions., There's a guide., There are monkeys. \| There isn't / There aren't: There isn't a train., There aren't any dogs., There isn't a parrot. | — |
| g1u02.gi.there-is-are.gs.003 | group-sort | Sortiere: 'There is ...' (eines) oder 'There are ...' (mehrere)? [de] | — | — | — | There is: a giraffe, a parrot, a lion, a guide \| There are: two dogs, three monkeys, ten pencils, some books | — |
| g1u02.gi.there-is-are.mc.001 | multiple-choice | Ein Buch ist auf dem Tisch. Welcher Satz ist richtig? [de] | There is a book on the desk. (full) | There are a book on the desk. ; It is a book on the desk. ; There be a book on the desk. | — | — | — |
| g1u02.gi.there-is-are.mc.002 | multiple-choice | Fünf Hunde sind im Zoo. Welcher Satz ist richtig? [de] | There are five dogs at the zoo. (full) | There is five dogs at the zoo. ; It has five dogs at the zoo. ; There has five dogs at the zoo. | — | — | — |
| g1u02.gi.there-is-are.mc.003 | multiple-choice | Im Zoo gibt es keinen Zug. Welcher Satz ist richtig? [de] | There isn't a train at the zoo. (full) | There aren't a train at the zoo. ; There doesn't a train at the zoo. ; There don't a train at the zoo. | — | — | — |
| g1u02.gi.there-is-are.mc.004 | multiple-choice | Du möchtest nach Papageien im Zoo fragen. Welche Frage ist richtig? [de] | Are there any parrots at the zoo? (full) | Is there any parrots at the zoo? ; Does there any parrots at the zoo? ; There are any parrots at the zoo? | — | — | — |
| g1u02.gi.there-is-are.mc.005 | multiple-choice | Welcher Satz ist FALSCH? [de] | It has a guide at the zoo. (full) | There is a guide at the zoo. ; There's a guide at the zoo. ; There are guides at the zoo. | — | — | — |
| g1u02.gi.there-is-are.mp.001 | matching-pairs | Finde die Paare: Anzahl und richtiger Satz. [de] | — | — | one giraffe ↔ There is a giraffe. ; two lions ↔ There are two lions. ; three monkeys ↔ There are three monkeys. ; one parrot ↔ There is a parrot. ; five penguins ↔ There are five penguins. ; one guide ↔ There is a guide. | — | — |
| g1u02.gi.there-is-are.mt.001 | matching | Welcher Anfang passt zu welchem Ende? [de] | — | — | There is ↔ a parrot in the tree. ; There are ↔ three monkeys behind the tree. ; Is there ↔ a guide at the zoo? ; Are there ↔ any penguins at the zoo? | — | — |
| g1u02.gi.there-is-are.mt.002 | matching | Welcher Anfang passt zu welchem Bild-Hinweis? [de] | — | — | There is ↔ a giraffe (1) ; There are ↔ two lions (2) ; There isn't ↔ a train (0) ; There aren't ↔ any dogs (0) | — | — |
| g1u02.gi.there-is-are.qf.001 | question-formation | a guide / at the zoo (frag, ob es das gibt — Einzahl) [de] | Is there a guide at the zoo? (full) | — | — | — | — |
| g1u02.gi.there-is-are.qf.002 | question-formation | any books / in your school bag (frag, ob es die gibt — Mehrzahl) [de] | Are there any books in your school bag? (full) | — | — | — | — |
| g1u02.gi.there-is-are.sb.001 | sentence-building | there / is / a / parrot / in / the / tree [en] | There is a parrot in the tree. (full) ; There's a parrot in the tree. (full) | — | — | — | — |
| g1u02.gi.there-is-are.sb.002 | sentence-building | there / are / three / monkeys / behind / the / tree [en] | There are three monkeys behind the tree. (full) | — | — | — | — |
| g1u02.gi.there-is-are.sb.003 | sentence-building | are / there / any / penguins / at / the / zoo [en] | Are there any penguins at the zoo? (full) | — | — | — | — |
| g1u02.gi.there-is-are.sb.004 | sentence-building | there / isn't / a / lion / at / the / zoo [en] | There isn't a lion at the zoo. (full) | — | — | — | — |
| g1u02.gi.there-is-are.tf.001 | transformation | There is a parrot in the tree. (mach einen verneinten Satz) [de] | There isn't a parrot in the tree. (full) ; There is not a parrot in the tree. (full) ; There's no parrot in the tree. (full) ; isn't (partial) ; is not (partial) | — | — | — | — |
| g1u02.gi.there-is-are.tf.002 | transformation | There are monkeys behind the tree. (mach eine Frage) [de] | Are there monkeys behind the tree? (full) ; Are there any monkeys behind the tree? (full) ; Are there (partial) ; Are (partial) | — | — | — | — |
| g1u02.gi.there-is-are.tf.003 | transformation | There is a giraffe at the zoo. (mach eine Frage) [de] | Is there a giraffe at the zoo? (full) ; Is there (partial) ; Is (partial) | — | — | — | — |
| g1u02.gi.there-is-are.tf.006 | transformation | There is a lion at the zoo. (mach den Satz für mehrere: two) [de] | There are two lions at the zoo. (full) ; There are two lions at the zoo (partial) | — | — | — | — |
| g1u02.gi.there-is-are.tf.007 | transformation | There are pencils in the pencil case. (mach den Satz für eines: a) [de] | There is a pencil in the pencil case. (full) ; There's a pencil in the pencil case. (full) ; There is a pencil in the pencil case (partial) | — | — | — | — |
| g1u02.gi.there-is-are.tr.001 | translation | Es gibt einen Papagei im Baum. [de] | There is a parrot in the tree. (full) ; There's a parrot in the tree. (full) | — | — | — | — |
| g1u02.gi.there-is-are.tr.002 | translation | Es gibt drei Affen hinter dem Baum. [de] | There are three monkeys behind the tree. (full) | — | — | — | — |
| g1u02.gi.there-is-are.tr.003 | translation | Gibt es einen Löwen im Zoo? [de] | Is there a lion at the zoo? (full) ; Is there a lion in the zoo? (full) | — | — | — | — |
| g1u02.gi.there-is-are.tr.004 | translation | Gibt es Pinguine im Zoo? [de] | Are there penguins at the zoo? (full) ; Are there any penguins at the zoo? (full) ; Are there penguins in the zoo? (full) | — | — | — | — |
| g1u02.gi.there-is-are.tr.005 | translation | Es gibt kein Lineal auf dem Tisch. [de] | There isn't a ruler on the desk. (full) ; There is no ruler on the desk. (full) ; There's no ruler on the desk. (full) | — | — | — | — |
| g1u02.gi.to-be.ag.002 | anagram | Die Form von sein, die nach „we", „you" und „they" steht. [de] | are (full) | — | — | — | — |
| g1u02.gi.to-be.cp.001 | context-picker | Eine Reiseführerin erzählt am Zoo von sich. Welcher Satz ist richtig? [de] | I am a guide. (full) | I is a guide. ; I are a guide. ; I be a guide. | — | — | — |
| g1u02.gi.to-be.cp.002 | context-picker | Du zeigst auf einen Papagei im Baum. Welcher Satz ist richtig? [de] | It is beautiful. (full) | It are beautiful. ; It am beautiful. ; It be beautiful. | — | — | — |
| g1u02.gi.to-be.cp.003 | context-picker | Du sprichst über zwei Leute in deiner Gruppe. Welcher Satz ist richtig? [de] | They are happy. (full) | They is happy. ; They am happy. ; They be happy. | — | — | — |
| g1u02.gi.to-be.ec.001 | error-correction | He are a guide. [en] | He is a guide. (full) ; He's a guide. (full) ; is (partial) | — | — | — | — |
| g1u02.gi.to-be.ec.002 | error-correction | I is from England. [en] | I am from England. (full) ; I'm from England. (full) ; am (partial) | — | — | — | — |
| g1u02.gi.to-be.ec.003 | error-correction | She are nice. [en] | She is nice. (full) ; She's nice. (full) ; is (partial) | — | — | — | — |
| g1u02.gi.to-be.ec.004 | error-correction | We is from California. [en] | We are from California. (full) ; We're from California. (full) ; are (partial) | — | — | — | — |
| g1u02.gi.to-be.ec.005 | error-correction | The dogs is free. [en] | The dogs are free. (full) ; are (partial) | — | — | — | — |
| g1u02.gi.to-be.ec.006 | error-correction | Are you happy? — Yes, I'm. [de] | Are you happy? — Yes, I am. (full) ; Yes, I am. (full) ; I am (partial) | — | — | — | — |
| g1u02.gi.to-be.ec.007 | error-correction | You is from London. [en] | You are from London. (full) ; You're from London. (full) ; are (partial) | — | — | — | — |
| g1u02.gi.to-be.ec.008 | error-correction | The monkeys is in the tree. [en] | The monkeys are in the tree. (full) ; are (partial) | — | — | — | — |
| g1u02.gi.to-be.ff.001 | free-form | Stell dich vor: Schreibe einen Satz mit „I am" über dich (woher du kommst oder wie du dich fühlst). [de] | I am from England. (full) ; I am happy. (full) ; I'm from London. (full) ; I'm happy. (partial) | — | — | — | — |
| g1u02.gi.to-be.gf.001 | gap-fill | I ___ from London. [en, 1 blank(s)] | am (full) | — | — | — | — |
| g1u02.gi.to-be.gf.002 | gap-fill | She ___ from Manchester. [en, 1 blank(s)] | is (full) | — | — | — | — |
| g1u02.gi.to-be.gf.003 | gap-fill | Jenny and Omar ___ in Year 8. [en, 1 blank(s)] | are (full) | — | — | — | — |
| g1u02.gi.to-be.gf.004 | gap-fill | We ___ from California. [en, 1 blank(s)] | are (full) | — | — | — | — |
| g1u02.gi.to-be.gf.005 | gap-fill | The giraffe ___ big. [en, 1 blank(s)] | is (full) | — | — | — | — |
| g1u02.gi.to-be.gf.006 | gap-fill | The penguins ___ small. [en, 1 blank(s)] | are (full) | — | — | — | — |
| g1u02.gi.to-be.gf.007 | gap-fill | You ___ nice and I ___ happy. [en, 2 blank(s)] | are \| am (full) | — | — | — | — |
| g1u02.gi.to-be.gf.008 | gap-fill | He ___ from York and she ___ from London. [en, 2 blank(s)] | is \| is (full) | — | — | — | — |
| g1u02.gi.to-be.gf.009 | gap-fill | The parrot ___ beautiful. [en, 1 blank(s)] | is (full) | — | — | — | — |
| g1u02.gi.to-be.gf.010 | gap-fill | Sue and Dave ___ from London. They ___ in Year 7. [en, 2 blank(s)] | are \| are (full) | — | — | — | — |
| g1u02.gi.to-be.gf.011 | gap-fill | You ___ happy. [en, 1 blank(s)] | are (full) | — | — | — | — |
| g1u02.gi.to-be.gf.012 | gap-fill | The guide ___ nice and the train ___ long. [en, 2 blank(s)] | is \| is (full) | — | — | — | — |
| g1u02.gi.to-be.gf.013 | gap-fill | It ___ small. [en, 1 blank(s)] | is (full) | — | — | — | — |
| g1u02.gi.to-be.gf.014 | gap-fill | He ___ a guide. [en, 1 blank(s)] | is (full) | — | — | — | — |
| g1u02.gi.to-be.gf.015 | gap-fill | I ___ happy and we ___ free. [en, 2 blank(s)] | am \| are (full) | — | — | — | — |
| g1u02.gi.to-be.gf.016 | gap-fill | We ___ a group. [en, 1 blank(s)] | are (full) | — | — | — | — |
| g1u02.gi.to-be.gs.003 | group-sort | Welches Wort nimmt „is", welches „are"? [de] | — | — | — | is: he, she, it \| are: you, we, they | — |
| g1u02.gi.to-be.gs.004 | group-sort | Sortiere die Wörter: „is" oder „are"? [de] | — | — | — | is: the giraffe, the parrot, she, the lion \| are: the monkeys, the penguins, they, Sue and Dave | — |
| g1u02.gi.to-be.mc.001 | multiple-choice | They ___ my group. [en, 1 blank(s)] | are (full) | is ; am ; be | — | — | — |
| g1u02.gi.to-be.mc.002 | multiple-choice | I ___ a guide. [en, 1 blank(s)] | am (full) | is ; are ; be | — | — | — |
| g1u02.gi.to-be.mc.003 | multiple-choice | The lion ___ big and free. [en, 1 blank(s)] | is (full) | are ; am ; be | — | — | — |
| g1u02.gi.to-be.mc.004 | multiple-choice | Welcher Satz ist richtig? [de] | We are from York. (full) | We is from York. ; We am from York. ; We be from York. | — | — | — |
| g1u02.gi.to-be.mc.005 | multiple-choice | Welcher Satz ist richtig? (die Affen) [de] | The monkeys are in the tree. (full) | The monkeys is in the tree. ; The monkeys am in the tree. ; The monkeys be in the tree. | — | — | — |
| g1u02.gi.to-be.mc.006 | multiple-choice | Welcher Satz ist richtig? (die Familie) [de] | The family is at the zoo. (full) | The family are at the zoo. ; The family am at the zoo. ; The family be at the zoo. | — | — | — |
| g1u02.gi.to-be.mc.007 | multiple-choice | She ___ from Cambridge. [en, 1 blank(s)] | is (full) | am ; are ; be | — | — | — |
| g1u02.gi.to-be.mt.002 | matching | Welcher Satzanfang passt zu welchem Ende? [de] | — | — | I am ↔ from London. ; She is ↔ a guide. ; The lions are ↔ big and free. ; We are ↔ in Year 7. | — | — |
| g1u02.gi.to-be.mt.003 | matching | Welche Kurzform passt zu welcher Langform? [de] | — | — | I am ↔ I'm ; she is ↔ she's ; it is ↔ it's ; we are ↔ we're ; they are ↔ they're | — | — |
| g1u02.gi.to-be.sb.001 | sentence-building | from / are / they / York [en] | They are from York. (full) ; They're from York. (partial) | — | — | — | — |
| g1u02.gi.to-be.sb.002 | sentence-building | is / she / from / London [en] | She is from London. (full) ; She's from London. (partial) | — | — | — | — |
| g1u02.gi.to-be.sb.003 | sentence-building | the / big / is / giraffe [en] | The giraffe is big. (full) | — | — | — | — |
| g1u02.gi.to-be.sb.004 | sentence-building | we / in / Year / are / 7 [en] | We are in Year 7. (full) ; We're in Year 7. (partial) | — | — | — | — |
| g1u02.gi.to-be.sb.005 | sentence-building | are / the / free / lions [en] | The lions are free. (full) | — | — | — | — |
| g1u02.gi.to-be.tf.002 | transformation | Schreibe die Kurzform: She is from London. → ___ from London. [de, 1 blank(s)] | She's (full) ; She's from London. (full) | — | — | — | — |
| g1u02.gi.to-be.tf.003 | transformation | Schreibe die Kurzform: They are in Year 7. → ___ in Year 7. [de, 1 blank(s)] | They're (full) ; They're in Year 7. (full) | — | — | — | — |
| g1u02.gi.to-be.tf.005 | transformation | Schreibe die Kurzform: He is happy. → ___ happy. [de, 1 blank(s)] | He's (full) ; He's happy. (full) | — | — | — | — |
| g1u02.gi.to-be.tf.006 | transformation | Setze ein kurzes Wort ein: The giraffe is big. → ___ is big. [de, 1 blank(s)] | It (full) ; It is big. (full) ; It's big. (full) | — | — | — | — |
| g1u02.gi.to-be.tf.007 | transformation | Setze ein kurzes Wort ein: Sue and Dave are happy. → ___ are happy. [de, 1 blank(s)] | They (full) ; They are happy. (full) ; They're happy. (full) | — | — | — | — |
| g1u02.gi.to-be.tr.002 | translation | Wir sind im Zoo. [de] | We are at the zoo. (full) ; We're at the zoo. (full) | — | — | — | — |
| g1u02.gi.to-be.tr.003 | translation | Sie ist aus Manchester. (ein Mädchen) [de] | She is from Manchester. (full) ; She's from Manchester. (full) | — | — | — | — |
| g1u02.gi.to-be.tr.004 | translation | He is from York. [en] | Er ist aus York. (full) ; Er kommt aus York. (partial) | — | — | — | — |
| g1u02.gi.to-be.tr.005 | translation | I am happy. [en] | Ich bin glücklich. (full) ; Ich bin froh. (partial) | — | — | — | — |
| g1u02.gi.to-be.tr.006 | translation | Sie sind aus York. (mehrere Personen) [de] | They are from York. (full) ; They're from York. (full) | — | — | — | — |
| g1u02.gi.to-be.tr.008 | translation | Wir sind in der Klasse 7. [de] | We are in class 7. (full) ; We're in class 7. (full) | — | — | — | — |
| g1u02.gi.to-be.tr.009 | translation | Der Pinguin ist klein. [de] | The penguin is small. (full) ; It is small. (partial) | — | — | — | — |

## Output contract

Write `content/corpus/units/g1-u02/verify/level-gloss.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u02",
  "lens": "level-gloss",
  "itemsHash": "70212a6b7573",
  "promptHash": "aefb997bf664",
  "round": 1,
  "by": "fable-lens-level-gloss",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 238, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
