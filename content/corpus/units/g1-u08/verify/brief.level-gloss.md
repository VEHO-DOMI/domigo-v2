# Verify lens — level-gloss — g1-u08 (round 1)

<!-- domigo:verify level-gloss g1-u08 items=b0e8cce66c97 prompt=aefb997bf664 round=1 -->

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
- **g1-u07**: ice cream, chillies, fish, chicken, milk, butter, cheese, orange juice, tea, cucumber, sausages, beans, broccoli, carrot, onion, peas, an apple, mineral water, grapes, an orange, tomato (pl tomatoes), red pepper, kiwi, spinach, strawberry, sugar, bread, rice, egg, pasta, pizza, fries, chips, hamburger, chocolate, cake, breakfast, lunch, dinner, restaurant, always, usually, often, sometimes, never, meat, ham, healthy, to like, That's nice., any, to drink, to make, money, sandwich, some, vegetable, waiter, Have you got …?, I've got …, junk food, menu, Mum, plate, salad, soup, glass
- **g1-u08**: cap, mask, jacket, sweater, blouse, trousers, hoodie, cape, pyjamas, tights, shoes, boots, trainers, belt, hole, anything, to borrow, to fit, to try on, to wear, to hurt, poem, to tickle, somebody, backwards, exciting, tonight, horse, building, Let's get out of here.

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alphabet, Anger, Annie, Arbeit, Articles, Austria, Bacon, Baker, Befehlsformen, Bert, Betty, Bild, Bilder, Blackbeard, Blackie, Bob, Box, Buckingham, Buddy, Burgers, California, Cambridge, Caribbean, Carina, Carl, Chloe, Christie, Classroom, Clothes, Clown, Come, Dan, Dana, Daniel, Dave, David, Davis, Debbie, Dialog, Dialoge, Doctor, Doctors, Don, Ellie, Emma, England, English, False, Fido, Food, Frank, Fred, Freddy, George, Georgia, Gina, Good, Gordon, Great, Grey, Greybeard, Groans, Guess, Harry, Hmm, Holmes, Homework, Hook, Imperatives, Irregular, Italian, Jack, Jacob, James, Jamie, Jenny, Jessica, Jill, John, Julia, Jun, Kitty, Leah, Leo, Lethabo, Lewis, London, Lucy, Mail, Manchester, Mark, Marple, Mary, Mike, Miss, Mr, Mum, Nibbs, Nice, Nomen, Number, Numbers, Omar, Palace, Pardon, Paws, Pete, Peter, Pirates, Plural, Polly, Possessives, Prepositions, Present, Project, Put, Rajit, Red, Reihenfolge, Richard, Ronald, Sally, Saying, School, Sherlock, Sophia, Steve, Sue, Tamar, Tamara, Text, Think, Tick, Toby, Tock, Tom, True, Walker, Wall, Watson, Welcome, Well, Work, Wortes, Would, Wow, Yeah, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Vocab items (30)

| id | d | s | mc | pool | gloss |
|---|---|---|---|---|---|
| g1u08.w.anything | It can be one thing, or no thing at all. | Is there ___ in the box? | somebody ; tonight ; backwards | somebody ; tonight ; backwards ; exciting | — |
| g1u08.w.backwards | to do it from the end back to A, not from A to the end | Some children can read the alphabet ___, from the end back to A. | tonight ; exciting ; anything | tonight ; exciting ; anything ; somebody | — |
| g1u08.w.belt | It is long, and you wear it on your trousers so they do not come down. | Look at her purple ___ and her grey skirt. | cap ; mask ; shoes | cap ; mask ; shoes ; tights | — |
| g1u08.w.blouse | It is like a shirt, and girls or women wear it. | She wears a ___ and a grey skirt to school. | cap ; belt ; boots | cap ; belt ; boots ; trainers | — |
| g1u08.w.boots | These are big and strong, and you wear them on your feet over your socks. | When it is cold, I wear my big ___ on my feet. | cap ; mask ; belt | cap ; mask ; belt ; blouse | — |
| g1u08.w.building | It is a very big thing in the street, and your school is one. | The children go into the big ___. | horse ; poem ; belt | horse ; poem ; belt ; hole | — |
| g1u08.w.cap | You wear it on your hair. | Does he wear a grey ___? | belt ; blouse ; jacket | belt ; blouse ; jacket ; mask | — |
| g1u08.w.cape | It is long and you wear it on your back. | The clown has a long red ___ on his back. | cap ; belt ; shoes | cap ; belt ; shoes ; tights | — |
| g1u08.w.exciting | It is so good that it makes you happy and you want to jump up. | The big show was very ___! We all jumped and danced. | tonight ; backwards ; anything | tonight ; backwards ; anything ; somebody | — |
| g1u08.w.hole | It is a small open thing in your sweater or shoe, and your finger can go in it. | There is a big ___ in my shoe. | belt ; cap ; mask | belt ; cap ; mask ; boots | — |
| g1u08.w.hoodie | It is like a sweater and you can pull it up over your hair. | He wears a grey ___ when it is cold. | cap ; belt ; boots | cap ; belt ; boots ; mask | — |
| g1u08.w.horse | It is big, it can run, and you can go on its back. | Her ___ is big and strong and it can run. | building ; poem ; belt | building ; poem ; belt ; hole | — |
| g1u08.w.jacket | You wear it when it is cold, and it is not long. | Put on your ___ because it is cold. | cap ; belt ; shoes | cap ; belt ; shoes ; tights | — |
| g1u08.w.let-s-get-out-of-here | It is what you call when you want to go now, with a friend. | It is not nice here. I want to go now. ___ | Come on! ; Let me see. ; Well done. | Come on! ; Let me see. ; Well done. ; Go on. | — |
| g1u08.w.mask | You wear it on your eyes and nose. | The clown wears a ___ over his eyes and nose. | belt ; cap ; hoodie | belt ; cap ; hoodie ; cape | — |
| g1u08.w.poem | a short text you read or write, like a story but very short | He likes to write ___ and read them to the class. | horse ; building ; belt | horse ; building ; belt ; hole | — |
| g1u08.w.pyjamas | You wear it in bed. | I put on my ___ before I go to sleep. | cap ; belt ; boots | cap ; belt ; boots ; trainers | — |
| g1u08.w.shoes | You put these on your feet when you go out. | I wear ___ on my feet. | cap ; mask ; belt | cap ; mask ; belt ; blouse | — |
| g1u08.w.somebody | It is a child or an adult, but who? You cannot find out. | There is ___ behind the door. | anything ; tonight ; backwards | anything ; tonight ; backwards ; exciting | — |
| g1u08.w.sweater | You wear it when it is cold. It is like a hoodie, but you cannot pull it over your hair. | Can I borrow your red ___? | cap ; belt ; boots | cap ; belt ; boots ; mask | — |
| g1u08.w.tights | You wear it on your legs and feet, often under a skirt. | She wears grey ___ under her skirt. | cap ; mask ; belt | cap ; mask ; belt ; jacket | — |
| g1u08.w.to-borrow | to have it for a short time and then give it back to a friend | Can I ___ your red sweater? | to wear ; to fit ; to hurt | to wear ; to fit ; to hurt ; to tickle | — |
| g1u08.w.to-fit | when clothes are good for you and not too big or small | These shoes do not ___ me. | to borrow ; to wear ; to tickle | to borrow ; to wear ; to tickle ; to hurt | — |
| g1u08.w.to-hurt | When your shoes do this, your feet are not happy and not OK. | These shoes ___ my feet. | to borrow ; to fit ; to wear | to borrow ; to fit ; to wear ; to tickle | — |
| g1u08.w.to-tickle | to touch a child so they laugh | Please do not ___ me! | to borrow ; to fit ; to wear | to borrow ; to fit ; to wear ; to hurt | — |
| g1u08.w.to-try-on | to put clothes on and look in the mirror to find out if they fit | Can I ___ these trousers on? | to borrow ; to fit ; to hurt | to borrow ; to fit ; to hurt ; to wear | — |
| g1u08.w.to-wear | to have clothes on you | What clothes do you like to ___? | to borrow ; to fit ; to tickle | to borrow ; to fit ; to tickle ; to hurt | — |
| g1u08.w.tonight | It is this evening, after dinner and before you go to sleep. | We have got fun ___ after dinner. | backwards ; exciting ; anything | backwards ; exciting ; anything ; somebody | — |
| g1u08.w.trainers | You wear these shoes when you run. | You wear ___ on your feet when you run. | cap ; mask ; belt | cap ; mask ; belt ; jacket | — |
| g1u08.w.trousers | You wear it on your legs. | His ___ are too big, so he wears a belt. | cap ; mask ; belt | cap ; mask ; belt ; blouse | — |

## Grammar items (27)

| id | fmt | prompt | answers | distractors | pairs | groups | gloss |
|---|---|---|---|---|---|---|---|
| g1u08.gi.present-simple-questions.ag.001 | anagram | Dieses kleine Wort brauchst du am Satzanfang bei he, she und it. [de] | Does (full) | — | — | — | — |
| g1u08.gi.present-simple-questions.ag.002 | anagram | So sagst du kurz Nein bei he: No, he ___. [de, 1 blank(s)] | doesn't (full) | — | — | — | — |
| g1u08.gi.present-simple-questions.cp.001 | context-picker | Du willst wissen, ob dein Freund einen Hoodie trägt. Frag ihn. [de] | Do you wear a hoodie? (full) | Does you wear a hoodie? ; Do you wears a hoodie? ; You wear a hoodie? | — | — | — |
| g1u08.gi.present-simple-questions.cp.002 | context-picker | Du möchtest herausfinden, ob Sophia gerne Pizza isst. Frag danach. [de] | Does Sophia like pizza? (full) | Does Sophia likes pizza? ; Do Sophia like pizza? ; Is Sophia like pizza? | — | — | — |
| g1u08.gi.present-simple-questions.ec.001 | error-correction | Does she likes chocolate? [en] | Does she like chocolate? (full) ; like (partial) | — | — | — | — |
| g1u08.gi.present-simple-questions.ec.002 | error-correction | Do he wear a belt? [en] | Does he wear a belt? (full) ; Does (partial) | — | — | — | — |
| g1u08.gi.present-simple-questions.ec.003 | error-correction | You like dogs? Yes, I like. [en] | Do you like dogs? Yes, I do. (full) | — | — | — | — |
| g1u08.gi.present-simple-questions.gf.001 | gap-fill | ___ you wear a cap? — Yes, I ___. [en, 2 blank(s)] | Do \| do (full) | — | — | — | — |
| g1u08.gi.present-simple-questions.gf.002 | gap-fill | ___ she wear boots? — Yes, she ___. [en, 2 blank(s)] | Does \| does (full) | — | — | — | — |
| g1u08.gi.present-simple-questions.gf.003 | gap-fill | ___ he ___ (like) pizza? — No, he ___. [en, 3 blank(s)] | Does \| like \| doesn't (full) ; Does \| like \| does not (full) | — | — | — | — |
| g1u08.gi.present-simple-questions.gf.004 | gap-fill | ___ they ___ (wear) shoes? — Yes, they ___. [en, 3 blank(s)] | Do \| wear \| do (full) | — | — | — | — |
| g1u08.gi.present-simple-questions.gf.005 | gap-fill | ___ your sister ___ (wear) a skirt? — No, she ___. She ___ (wear) trousers. [en, 4 blank(s)] | Does \| wear \| doesn't \| wears (full) ; Does \| wear \| does not \| wears (full) | — | — | — | — |
| g1u08.gi.present-simple-questions.gf.006 | gap-fill | What ___ is your sweater? — ___ red. [en, 2 blank(s)] | colour \| It's (full) ; colour \| It is (full) | — | — | — | — |
| g1u08.gi.present-simple-questions.gf.007 | gap-fill | What colour ___ your boots? — ___ grey. [en, 2 blank(s)] | are \| They're (full) ; are \| They are (full) | — | — | — | — |
| g1u08.gi.present-simple-questions.gs.001 | group-sort | Sortiere: gehört Do oder Does an den Anfang? [de] | — | — | — | Do: ___ you wear a cap?\|Do you wear a cap?, ___ they like dogs?\|Do they like dogs?, ___ we wear shoes?\|Do we wear shoes?, ___ I wear a hat?\|Do I wear a hat? \| Does: ___ she wear a skirt?\|Does she wear a skirt?, ___ he like pizza?\|Does he like pizza?, ___ it fit?\|Does it fit? | — |
| g1u08.gi.present-simple-questions.mc.001 | multiple-choice | Welcher Satz ist richtig? [de] | Does she wear a skirt? (full) | Does she wears a skirt? ; Do she wear a skirt? ; Is she wear a skirt? | — | — | — |
| g1u08.gi.present-simple-questions.mc.002 | multiple-choice | Welche Antwort passt? — Do they like dogs? [de] | Yes, they do. (full) | Yes, they does. ; Yes, they like. ; Yes, they are. | — | — | — |
| g1u08.gi.present-simple-questions.mc.003 | multiple-choice | Welche Antwort passt? — Does he like chocolate? [de] | No, he doesn't. (full) | No, he don't. ; No, he doesn't like. ; No, he isn't. | — | — | — |
| g1u08.gi.present-simple-questions.mp.001 | matching-pairs | Ordne zu: Do oder Does? [de] | — | — | he ↔ Does he … ? ; you ↔ Do you … ? ; she ↔ Does she … ? ; they ↔ Do they … ? ; it ↔ Does it … ? ; we ↔ Do we … ? | — | — |
| g1u08.gi.present-simple-questions.mt.001 | matching | Ordne zu, was zusammenpasst. [de] | — | — | Do you like dogs? ↔ Yes, I do. ; Does he wear a cap? ↔ No, he doesn't. ; Do they wear boots? ↔ Yes, they do. ; Does she like pizza? ↔ No, she doesn't. | — | — |
| g1u08.gi.present-simple-questions.qf.001 | question-formation | Debbie likes the trainers. Ask if this is true. [en] | Does Debbie like the trainers? (full) ; Does she like the trainers? (full) | — | — | — | — |
| g1u08.gi.present-simple-questions.sb.001 | sentence-building | she / wear / Does / boots / ? [en] | Does she wear boots? (full) | — | — | — | — |
| g1u08.gi.present-simple-questions.sb.002 | sentence-building | you / a / Do / hoodie / wear / ? [en] | Do you wear a hoodie? (full) | — | — | — | — |
| g1u08.gi.present-simple-questions.tf.001 | transformation | She wears trainers. (?) [en] | Does she wear trainers? (full) | — | — | — | — |
| g1u08.gi.present-simple-questions.tf.002 | transformation | You like pizza. (?) [en] | Do you like pizza? (full) | — | — | — | — |
| g1u08.gi.present-simple-questions.tr.001 | translation | Magst du Pizza? [de] | Do you like pizza? (full) | — | — | — | — |
| g1u08.gi.present-simple-questions.tr.002 | translation | Trägt sie eine Jacke? [de] | Does she wear a jacket? (full) | — | — | — | — |

## Output contract

Write `content/corpus/units/g1-u08/verify/level-gloss.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u08",
  "lens": "level-gloss",
  "itemsHash": "b0e8cce66c97",
  "promptHash": "aefb997bf664",
  "round": 1,
  "by": "fable-lens-level-gloss",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 57, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
