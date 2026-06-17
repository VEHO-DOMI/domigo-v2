# Verify lens — level-gloss — g1-u05 (round 2)

<!-- domigo:verify level-gloss g1-u05 items=564df2a033b6 prompt=aefb997bf664 round=2 -->

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank, song, band

Harvested proper nouns (≤ this unit): Ahmed, Arbeit, Bacon, Baker, Befehlsformen, Betty, Bild, Bilder, Blackbeard, Blackie, Bob, Box, Buckingham, Buddy, California, Cambridge, Caribbean, Carina, Carl, Chloe, Classroom, Clown, Dan, Dana, Dave, David, Davis, Dialog, Dialoge, Doctors, Don, Ellie, England, English, False, Fido, Frank, Fred, Freddy, Gina, Good, Gordon, Great, Greybeard, Guess, Harry, Homework, Hook, Imperatives, Irregular, Jack, James, Jamie, Jenny, Jessica, Jill, Julia, Kitty, Leah, Leo, London, Lucy, Mail, Manchester, Mary, Mike, Miss, Mr, Mum, Nibbs, Nice, Nomen, Number, Numbers, Omar, Palace, Pardon, Pete, Peter, Pirates, Plural, Polly, Possessives, Prepositions, Project, Put, Rajit, Reihenfolge, Richard, Ronald, Saying, School, Steve, Sue, Tamara, Text, Tick, Toby, Tock, Tom, True, Welcome, Well, Work, Wortes, Wow, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Vocab items (44)

| id | d | s | mc | pool | gloss |
|---|---|---|---|---|---|
| g1u05.w.boyfriend | a boy who is more than a friend to a girl | Jack is her ___. | sister ; uncle ; teacher | sister ; uncle ; teacher ; drummer | — |
| g1u05.w.can | you drink from this small thing | Look, he carries fifteen ___. | bottle ; box ; table | bottle ; box ; table ; chair | fifteen (= fünfzehn) |
| g1u05.w.can-cannot-can-t | to be able to do a thing | Pete ___ play the guitar, but he can carry it. | must ; to play ; to drink | must ; to play ; to drink ; to carry | able (= fähig, etwas zu tun) |
| g1u05.w.concert | a big show where people play music | Let's go to the ___ tomorrow. | job ; hospital ; table | job ; hospital ; table ; school canteen | people (= Menschen, Leute) ; music (= Musik) |
| g1u05.w.don-t-worry | all is OK; a friend is not scared. | Don't be scared. ___ It is all OK. | Sorry? ; Is that so? ; This is me. | Sorry? ; Is that so? ; This is me. ; Don't be late. | — |
| g1u05.w.drummer | the player of the drums | Jessica plays the drums. She is the ___. | singer ; keyboard player ; guitarist | singer ; keyboard player ; guitarist ; saxophone player | — |
| g1u05.w.drums | You play this and hit it with two sticks. | Jessica plays the ___ with two sticks. | guitar ; keyboard ; saxophone | guitar ; keyboard ; saxophone ; table | hit (= schlagen) ; sticks (= Stöcke) |
| g1u05.w.economy | the world of money and work | The ___ is the world of money. | hospital ; concert ; table | hospital ; concert ; table ; school canteen | world (= Welt) |
| g1u05.w.guitar | a long thing you play with your fingers | Dan and Steve play the ___. | drums ; keyboard ; saxophone | drums ; keyboard ; saxophone ; table | — |
| g1u05.w.guitarist | the player of the guitar | Dan plays the guitar. He is a ___. | drummer ; singer ; keyboard player | drummer ; singer ; keyboard player ; saxophone player | — |
| g1u05.w.hospital | you go here when you are very ill | Grandma is very ill, so she is in the ___. | concert ; table ; economy | concert ; table ; economy ; school canteen | ill (= krank) |
| g1u05.w.hundred | the number 100 | There are one ___ children in our school. | ten ; two ; five | ten ; two ; five ; nine | — |
| g1u05.w.in-one-go | all at one time, you do not stop | Can you drink five cans ___? | tomorrow ; today ; here | tomorrow ; today ; here ; then | stop (= aufhören, anhalten) |
| g1u05.w.is-that-so | you ask this when you do not believe a thing | I can drink ten bottles! — ___ | Sorry? ; This is me. ; Don't worry. | Sorry? ; This is me. ; Don't worry. ; Are you OK? | believe (= glauben) |
| g1u05.w.its | for a thing or an animal, not a boy or girl | The dog can wiggle ___ ears. | his ; her ; their | his ; her ; their ; your | animal (= Tier) |
| g1u05.w.job | work that you do for money | She has a good ___ at the hospital. | concert ; table ; hospital | concert ; table ; hospital ; school canteen | — |
| g1u05.w.keyboard | You sit down and play this big thing with your fingers. | Ellie plays the ___ with her fingers. | guitar ; drums ; saxophone | guitar ; drums ; saxophone ; table | — |
| g1u05.w.keyboard-player | the one in the band who plays the keys | Ellie is the ___. She plays the keyboard. | drummer ; singer ; guitarist | drummer ; singer ; guitarist ; saxophone player | keys (= Tasten) |
| g1u05.w.money | the euros your mum and uncle give you | My mum gives me ___ every week. | profit ; pound ; job | profit ; pound ; job ; table | euros (= Euro (Plural)) ; every (= jede/jeder/jedes) |
| g1u05.w.nothing | not one thing, zero | There's ___ in the garden. | more ; here ; again | more ; here ; again ; then | zero (= null) ; garden (= Garten) |
| g1u05.w.perfect | very very good, the best it can be | The job is ___ for you! | happy ; tired ; scared | happy ; tired ; scared ; angry | — |
| g1u05.w.pound | the money in England | In England, a book is ten ___. | profit ; money ; concert | profit ; money ; concert ; table | — |
| g1u05.w.profit | the money you have after you sell a thing | It's 120 pounds. That's my ___. | money ; pound ; job | money ; pound ; job ; table | sell (= verkaufen) |
| g1u05.w.saxophone | You play this long thing with your mouth. | Jack plays the ___ with his mouth. | guitar ; drums ; keyboard | guitar ; drums ; keyboard ; table | — |
| g1u05.w.saxophone-player | the one in the band who plays a long gold thing | Jack plays the saxophone. He is the ___. | drummer ; singer ; guitarist | drummer ; singer ; guitarist ; keyboard player | gold (= golden) |
| g1u05.w.school-canteen | the room where you eat at lunchtime | We eat our lunch in the ___ at school. | hospital ; concert ; table | hospital ; concert ; table ; economy | lunch (= Mittagessen) |
| g1u05.w.singer | This is the one who uses a mouth, not the guitar or drums. | James is the ___. He uses his mouth, not a guitar. | drummer ; guitarist ; keyboard player | drummer ; guitarist ; keyboard player ; saxophone player | — |
| g1u05.w.sister | a girl in your family who is not your mum | Jessica is my ___. | uncle ; teacher ; boyfriend | uncle ; teacher ; boyfriend ; singer | — |
| g1u05.w.sorry | you ask this when you do not understand and want it again | ___ I don't understand. Can you do it again? | Is that so? ; This is me. ; Don't worry. | Is that so? ; This is me. ; Don't worry. ; Are you OK? | — |
| g1u05.w.table | a thing with four legs, you put plates on it to eat | I put a ___ in our playground. | chair ; bottle ; box | chair ; bottle ; box ; desk | plates (= Teller) ; playground (= Schulhof, Spielplatz) |
| g1u05.w.teacher | this man or woman gives you homework at school | Mr Davis is my ___ at school. | uncle ; sister ; boyfriend | uncle ; sister ; boyfriend ; singer | — |
| g1u05.w.this-is-me | you show who you are in a picture | Look at my photo from school. ___ | Is that so? ; Sorry? ; Don't worry. | Is that so? ; Sorry? ; Don't worry. ; How are you? | photo (= Foto) |
| g1u05.w.to-carry | to hold a thing and go with it | Can you ___ my guitar? It is very big. | touch ; wash ; drink | touch ; wash ; drink ; play | hold (= halten) |
| g1u05.w.to-dance | You do this to music with your feet. | Let's ___ to the music! | eat ; wash ; carry | eat ; wash ; carry ; drink | music (= Musik) |
| g1u05.w.to-drink | you do this with a cup of water in your mouth | I can't ___ fifteen cans. | eat ; wash ; carry | eat ; wash ; carry ; touch | cup (= Tasse, Becher) ; water (= Wasser) ; fifteen (= fünfzehn) |
| g1u05.w.to-laugh | you do this when a thing is very funny: ha ha ha | The clown is funny and we all ___. | eat ; wash ; drink | eat ; wash ; drink ; carry | funny (= lustig) ; ha (= ha (Lachlaut)) |
| g1u05.w.to-play | to do this with a guitar, or to have fun with a toy | Can you ___ the guitar? | eat ; wash ; carry | eat ; wash ; carry ; touch | toy (= Spielzeug) |
| g1u05.w.to-stand-on | to be up on a thing with your feet | Look! Pete can ___ his head. | walk on ; touch ; carry | walk on ; touch ; carry ; wiggle | head (= Kopf) |
| g1u05.w.to-touch | to put your fingers on a thing | Please don't ___ my guitar. | carry ; wash ; drink | carry ; wash ; drink ; play | — |
| g1u05.w.to-walk-on | to go on your feet over a thing | Can you ___ your hands? | stand on ; touch ; carry | stand on ; touch ; carry ; wiggle | hands (= Hände) |
| g1u05.w.to-wash | to make a thing clean with water | I ___ my mum's car with water. | clean ; carry ; touch | clean ; carry ; touch ; drink | make (= machen) ; water (= Wasser) |
| g1u05.w.to-wiggle | to move a thing fast, here and there, again and again | He can ___ his ears up and down. | touch ; carry ; walk on | touch ; carry ; walk on ; stand on | move (= bewegen) ; fast (= schnell) |
| g1u05.w.tongue | the thing in your mouth; you speak with it. | He can touch his nose with his ___. | nose ; ear ; eye | nose ; ear ; eye ; foot | — |
| g1u05.w.uncle | the brother of your mum or your dad | My ___ is my mum's brother. | sister ; teacher ; boyfriend | sister ; teacher ; boyfriend ; drummer | brother (= Bruder) ; dad (= Papa) |

## Grammar items (50)

| id | fmt | prompt | answers | distractors | pairs | groups | gloss |
|---|---|---|---|---|---|---|---|
| g1u05.gi.can.cp.001 | context-picker | Du erzählst, dass Ellie nicht tanzen kann. Welcher Satz ist richtig? [de] | She can't dance. (full) | She doesn't can dance. ; She can't dances. ; She no can dance. | — | — | — |
| g1u05.gi.can.cp.003 | context-picker | Du möchtest wissen, ob Pete singen kann. Was ist richtig? [de] | Can you play the guitar? (full) | Do you can play the guitar? ; Can you plays the guitar? ; You can play the guitar? | — | — | — |
| g1u05.gi.can.ec.001 | error-correction | Finde und verbessere den Fehler: He cans wiggle his ears. [de] | He can wiggle his ears. (full) ; can (partial) | — | — | — | — |
| g1u05.gi.can.ec.002 | error-correction | Finde und verbessere den Fehler: I can to speak English. [de] | I can speak English. (full) ; can speak (partial) | — | — | — | — |
| g1u05.gi.can.ec.003 | error-correction | Finde und verbessere den Fehler: She don't can play the drums. [de] | She can't play the drums. (full) ; She cannot play the drums. (full) ; can't (partial) ; cannot (partial) | — | — | — | — |
| g1u05.gi.can.ff.001 | free-form | Dein Freund fragt: "Can you play the guitar?" Du kannst es. Antworte mit einem ganzen Satz. [de] | Yes, I can. (full) ; Yes, I can play the guitar. (full) ; I can play the guitar. (partial) | — | — | — | — |
| g1u05.gi.can.gf.001 | gap-fill | James ___ play the guitar. [en, 1 blank(s)] | can (full) | — | — | — | — |
| g1u05.gi.can.gf.002 | gap-fill | The dog ___ dance. It can sit down. (–) [en, 1 blank(s)] | can't (full) ; cannot (full) | — | — | — | — |
| g1u05.gi.can.gf.003 | gap-fill | She ___ (can / play) the drums very well. [en, 1 blank(s)] | can play (full) | — | — | — | — |
| g1u05.gi.can.gf.004 | gap-fill | Pete ___ (not / can / carry) the guitar. It's too big! (–) [en, 1 blank(s)] | can't carry (full) ; cannot carry (full) | — | — | — | — |
| g1u05.gi.can.gf.005 | gap-fill | Dan ___ (can / play) the guitar, but he ___ (not / can / dance). (+/–) [en, 2 blank(s)] | can play \| can't dance (full) ; can play \| cannot dance (full) | — | — | — | — |
| g1u05.gi.can.gf.006 | gap-fill | ___ your sister ___ (can / play) the keyboard? (?) [en, 2 blank(s)] | Can \| play (full) | — | — | — | — |
| g1u05.gi.can.gs.002 | group-sort | Was kann ich, was kann ich nicht? Sortiere die Sätze. [de] | — | — | — | I can: play the guitar, wiggle my ears, speak English, walk on my feet \| I can't: carry the drums, touch my nose with my tongue | — |
| g1u05.gi.can.mc.001 | multiple-choice | She ___ play the keyboard. [en, 1 blank(s)] | can (full) | cans ; can to ; is can | — | — | — |
| g1u05.gi.can.mc.002 | multiple-choice | He ___ play the saxophone. [en, 1 blank(s)] | can (full) | cans ; can to ; doesn't can | — | — | — |
| g1u05.gi.can.mc.003 | multiple-choice | ___ they play the drums? (?) [en, 1 blank(s)] | Can (full) | Do ; Are ; Can't | — | — | — |
| g1u05.gi.can.mp.001 | matching-pairs | Welche Sätze bedeuten das Gegenteil? [de] | — | — | I can dance. ↔ I can't dance. ; She can play the guitar. ↔ She can't play the guitar. ; He can wiggle his ears. ↔ He can't wiggle his ears. ; They can carry the drums. ↔ They can't carry the drums. | — | — |
| g1u05.gi.can.mt.002 | matching | Was passt zusammen? [de] | — | — | Can you play the guitar? ↔ Yes, I can. ; Can Bacon dance? ↔ No, he can't. ; Can Dan and Steve play the drums? ↔ Yes, they can. ; Can Ellie carry the saxophone? ↔ No, she can't. | — | — |
| g1u05.gi.can.qf.001 | question-formation | you / play / the saxophone [en] | Can you play the saxophone? (full) | — | — | — | — |
| g1u05.gi.can.sb.001 | sentence-building | play / she / the drums / can [en] | She can play the drums. (full) | — | — | — | — |
| g1u05.gi.can.sb.002 | sentence-building | wiggle / can't / his ears / he [en] | He can't wiggle his ears. (full) | — | — | — | — |
| g1u05.gi.can.tf.001 | transformation | I can dance. → I ___. (–) [en, 1 blank(s)] | can't dance (full) ; cannot dance (full) ; I can't dance. (partial) ; I cannot dance. (partial) | — | — | — | — |
| g1u05.gi.can.tf.002 | transformation | Steve can play the guitar. → ___ Steve ___ the guitar? (?) [en, 2 blank(s)] | Can \| play (full) ; Can Steve play the guitar? (partial) | — | — | — | — |
| g1u05.gi.can.tr.001 | translation | Meine Schwester kann Schlagzeug spielen. [de] | My sister can play the drums. (full) | — | — | — | — |
| g1u05.gi.can.tr.002 | translation | Kannst du Keyboard spielen? [de] | Can you play the keyboard? (full) | — | — | — | — |
| g1u05.gi.possessives.ag.001 | anagram | Wem gehört es? Bilde das Wort für „ihr" (mehrere Personen). Es beginnt mit t und gehört zu they. [de] | their (full) | — | — | — | — |
| g1u05.gi.possessives.cp.001 | context-picker | Ellie plays the keyboard. [en] | Her keyboard is great. (full) | She keyboard is great. ; His keyboard is great. ; Their keyboard is great. | — | — | — |
| g1u05.gi.possessives.ec.002 | error-correction | The dog can wiggle it's ears. [en] | The dog can wiggle its ears. (full) ; its (partial) | — | — | — | — |
| g1u05.gi.possessives.ec.003 | error-correction | We love we teacher very much. [en] | We love our teacher very much. (full) ; our (partial) | — | — | — | — |
| g1u05.gi.possessives.ec.004 | error-correction | Dan and Steve love they dog Bacon. [en] | Dan and Steve love their dog Bacon. (full) ; their (partial) | — | — | — | — |
| g1u05.gi.possessives.ec.005 | error-correction | She loves he dog very much. [en] | She loves his dog very much. (full) ; his (partial) ; She loves her dog very much. (full) | — | — | — | — |
| g1u05.gi.possessives.gf.001 | gap-fill | James loves ___ (he) saxophone. [en, 1 blank(s)] | his (full) | he ; him ; her | — | — | — |
| g1u05.gi.possessives.gf.002 | gap-fill | Ellie loves ___ (she) keyboard. [en, 1 blank(s)] | her (full) | she ; his ; their | — | — | — |
| g1u05.gi.possessives.gf.003 | gap-fill | We love ___ (we) school. [en, 1 blank(s)] | our (full) | we ; us ; their | — | — | — |
| g1u05.gi.possessives.gf.004 | gap-fill | Dan and Steve play ___ (they) guitars at the concert. [en, 1 blank(s)] | their (full) | they ; them ; there | — | — | — |
| g1u05.gi.possessives.gf.005 | gap-fill | Look at Bacon. ___ ears are very big. [en, 1 blank(s)] | Its (full) | It's ; His ; Their | — | — | — |
| g1u05.gi.possessives.gf.006 | gap-fill | This is ___ (I) sister Jessica. [en, 1 blank(s)] | my (full) | I ; me ; your | — | — | — |
| g1u05.gi.possessives.gf.007 | gap-fill | Tom plays the drums and Ellie plays the keyboard. ___ (he) drums are big and ___ (she) keyboard is great. [en, 2 blank(s)] | His \| her (full) | — | — | — | — |
| g1u05.gi.possessives.gs.003 | group-sort | Sortiere die Wörter. [de] | — | — | — | She plays.: I, he, we, they \| Her guitar.: my, his, our, their | — |
| g1u05.gi.possessives.mc.001 | multiple-choice | Jessica is the drummer. ___ drums are big. [en, 1 blank(s)] | Her (full) | She ; His ; Their | — | — | — |
| g1u05.gi.possessives.mc.002 | multiple-choice | Dan and Steve are here. ___ guitars are great. [en, 1 blank(s)] | Their (full) | They ; There ; His | — | — | — |
| g1u05.gi.possessives.mc.003 | multiple-choice | This is James. ___ saxophone is here. [en, 1 blank(s)] | His (full) | He ; Him ; Her | — | — | — |
| g1u05.gi.possessives.mp.002 | matching-pairs | Finde die Paare. [de] | — | — | I ↔ my ; you ↔ your ; he ↔ his ; she ↔ her ; it ↔ its ; we ↔ our | — | — |
| g1u05.gi.possessives.mt.002 | matching | Welche Wörter passen zusammen? [de] | — | — | I ↔ my ; he ↔ his ; she ↔ her ; we ↔ our ; they ↔ their | — | — |
| g1u05.gi.possessives.sb.001 | sentence-building | is / her / This / saxophone [en] | This is her saxophone. (full) | — | — | — | — |
| g1u05.gi.possessives.sb.002 | sentence-building | are / great / Dan / guitars / their / and / Steve [en] | Dan and Steve guitars are great. (partial) ; Dan and Steve, their guitars are great. (full) | — | — | — | — |
| g1u05.gi.possessives.tf.001 | transformation | This guitar is Ellie's. → It is ___ guitar. [en, 1 blank(s)] | her (full) ; It is her guitar. (full) | — | — | — | — |
| g1u05.gi.possessives.tf.002 | transformation | The guitars are for Dan and me. → They are ___ guitars. [en, 1 blank(s)] | our (full) ; They are our guitars. (full) | — | — | — | — |
| g1u05.gi.possessives.tr.001 | translation | Das ist meine Schwester. [de] | This is my sister. (full) ; That is my sister. (partial) | — | — | — | — |
| g1u05.gi.possessives.tr.004 | translation | Ihr Hund ist Bacon. [de] | Their dog is Bacon. (full) | — | — | — | — |

## Output contract

Write `content/corpus/units/g1-u05/verify/level-gloss.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u05",
  "lens": "level-gloss",
  "itemsHash": "564df2a033b6",
  "promptHash": "aefb997bf664",
  "round": 2,
  "by": "fable-lens-level-gloss",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 94, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
