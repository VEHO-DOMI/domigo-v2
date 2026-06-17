# Verify lens — level-gloss — g1-u03 (round 1)

<!-- domigo:verify level-gloss g1-u03 items=ba126dc65b37 prompt=aefb997bf664 round=1 -->

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Ahmed, Arbeit, Befehlsformen, Betty, Bild, Bilder, Blackbeard, Blackie, Box, Buddy, California, Cambridge, Caribbean, Carina, Carl, Chloe, Classroom, Dana, Dave, Dialog, Dialoge, Don, England, English, False, Fido, Frank, Fred, Freddy, Good, Gordon, Greybeard, Guess, Homework, Hook, Imperatives, Irregular, Jenny, Julia, Leah, Leo, London, Lucy, Mail, Manchester, Mary, Mike, Nice, Nomen, Number, Numbers, Omar, Peter, Pirates, Plural, Polly, Prepositions, Rajit, Reihenfolge, Ronald, Saying, School, Sue, Tamara, Text, Tick, Tock, True, Welcome, Well, Work, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Vocab items (42)

| id | d | s | mc | pool | gloss |
|---|---|---|---|---|---|
| g1u03.w.again | one more time. | I want to do it one more time. Let's do it ___. | also ; back ; here | also ; back ; here ; very ; more | — |
| g1u03.w.also | it means too. | Tamara is a captain. Greybeard is ___ a captain. | again ; back ; here | again ; back ; here ; very ; more | means (= bedeutet) |
| g1u03.w.back | to where you were before. | The pirates are at the zoo. When are they ___? | again ; also ; here | again ; also ; here ; very ; more | — |
| g1u03.w.beard | it is the long hair on a man, under his mouth. | The man has got a long brown ___ on his face. | hair ; ear ; shoulder | hair ; ear ; shoulder ; nose ; mouth | brown (= braun) ; face (= Gesicht) |
| g1u03.w.big | not small. | Greybeard has got a ___ ship, not a small one. | small ; short ; long | small ; short ; long ; tall ; strong | — |
| g1u03.w.boy | he is not a girl, and he is not an adult man. | That ___ over there is my friend; he is not a girl. | girl ; woman ; sister | girl ; woman ; sister ; man ; captain | friend (= Freund/Freundin) |
| g1u03.w.captain | the man on a ship who is the boss. | The ___ has got a big blue ship. | sister ; boy ; man | sister ; boy ; man ; girl ; woman | boss (= Chef/Chefin) ; blue (= blau) |
| g1u03.w.ear | you have got two of these, and you hear music with them. | You have got two ___, and you hear music with them. | eye ; mouth ; foot | eye ; mouth ; foot ; nose ; finger | hear (= hören) ; music (= Musik) |
| g1u03.w.eye | you have got two of these; one is green and one is blue. | You have got two ___; one is green and one is blue. | ear ; nose ; finger | ear ; nose ; finger ; mouth ; leg | green (= grün) ; blue (= blau) |
| g1u03.w.famous | many people know this man or woman. | This is Greybeard. He is a ___ captain and many people know him. | pretty ; strong ; tall | pretty ; strong ; tall ; big ; short | people (= Leute) ; know (= kennen) |
| g1u03.w.feet | one foot, but two of these; your two shoes go on them. | I have got a shoe on each of my two ___. | ears ; teeth ; legs | ears ; teeth ; legs ; eyes ; fingers | each (= jeder/jede/jedes) |
| g1u03.w.finger | you have got ten of these — five and five. | You have got ten ___ — five and five. | ear ; leg ; nose | ear ; leg ; nose ; mouth ; shoulder | — |
| g1u03.w.foot | it is on the end of your leg, and your shoe is on it. | I have got one shoe on one ___. | ear ; nose ; eye | ear ; nose ; eye ; finger ; mouth | end (= Ende) |
| g1u03.w.girl | she is not a boy, and she is not an adult woman. | That ___ over there is my friend; she is not a boy. | boy ; man ; captain | boy ; man ; captain ; woman ; sister | friend (= Freund/Freundin) |
| g1u03.w.hair | it can be long or short, and it is on your head. | Greybeard has got very long ___. | beard ; ear ; eye | beard ; ear ; eye ; nose ; mouth | head (= Kopf) |
| g1u03.w.have-got-has-got | you speak this for a thing that is yours. | I ___ two sisters and one ship. | also ; again ; back | also ; again ; back ; here ; more | — |
| g1u03.w.her-name-is | you say this for a girl or a woman, and it says who she is. | This is my sister. ___ Betty. | His name is ; have got ; has got | His name is ; have got ; has got ; again ; back | say (= sagen) |
| g1u03.w.him | it is for a boy or a man; you do not say it for a girl. | Peter is nice. We love ___. | his ; us ; back | his ; us ; back ; again ; here | say (= sagen) |
| g1u03.w.his | a boy or a man has got this thing. | This is Blackbeard. ___ ship is big. | him ; her ; their | him ; her ; their ; your ; our | — |
| g1u03.w.his-name-is | you say this for a boy or a man, and it says who he is. | This is my friend. ___ Mike. | Her name is ; have got ; has got | Her name is ; have got ; has got ; again ; back | say (= sagen) ; friend (= Freund/Freundin) |
| g1u03.w.left-arm | It is under your shoulder. It is not the one you write with. | Frank has got a parrot on his ___ and a parrot on his right arm. | right arm ; shoulder ; leg | right arm ; shoulder ; leg ; foot ; ear | — |
| g1u03.w.leg | you have got two of these, and your foot is on the end of one. | Greybeard has got a strong ___ and he can stand up. | ear ; nose ; finger | ear ; nose ; finger ; mouth ; eye | end (= Ende) |
| g1u03.w.long | your hair can be this if it is not short. | Greybeard has got very ___ hair, not short hair. | short ; small ; tall | short ; small ; tall ; big ; strong | — |
| g1u03.w.man | an adult; he is not a woman and not a boy. | The ___ has got a beard; he is not a woman. | woman ; boy ; girl | woman ; boy ; girl ; sister ; captain | — |
| g1u03.w.mouth | you eat and talk with this. | You eat and talk with your ___. | eye ; ear ; finger | eye ; ear ; finger ; nose ; leg | — |
| g1u03.w.nose | you have got one big or small one, and you smell with it. | You have got one big ___, and you smell with it. | ear ; leg ; shoulder | ear ; leg ; shoulder ; foot ; eye | smell (= riechen) |
| g1u03.w.pretty | nice to look at. | Polly is a ___ captain and she is nice to look at. | famous ; strong ; tall | famous ; strong ; tall ; big ; small | — |
| g1u03.w.purple | the colour of red and blue together. | Polly has got ___ hair — the colour of red and blue. | famous ; pretty ; strong | famous ; pretty ; strong ; big ; small | colour (= Farbe) ; red (= rot) ; blue (= blau) ; together (= zusammen) |
| g1u03.w.right-arm | It is under your shoulder. It is the one you write with. | Fred has got a parrot on his ___ and a parrot on his left arm. | left arm ; shoulder ; leg | left arm ; shoulder ; leg ; foot ; ear | — |
| g1u03.w.ship | it is a very big boat; a captain is on it. | Greybeard has got a big ___ and he can go on the sea. | captain ; beard ; week | captain ; beard ; week ; leg ; shoulder | boat (= Boot) ; sea (= Meer) |
| g1u03.w.short | not long and not tall. | Greybeard is ___, not tall. | tall ; long ; big | tall ; long ; big ; small ; strong | — |
| g1u03.w.shoulder | it is under your ear and over your arm; a parrot can be on it. | The parrot is on his ___, next to his ear. | leg ; finger ; nose | leg ; finger ; nose ; mouth ; eye | arm (= Arm) |
| g1u03.w.sister | a girl in your family. | My ___ is a girl and she has got long hair. | captain ; boy ; man | captain ; boy ; man ; girl ; woman | — |
| g1u03.w.small | not big. | Frank has got a ___ nose, not a big one. | big ; tall ; long | big ; tall ; long ; short ; strong | — |
| g1u03.w.strong | not weak; a man with big arms is this. | Greybeard has got a ___ left arm; he is not weak. | pretty ; famous ; tall | pretty ; famous ; tall ; big ; short | weak (= schwach) ; arms (= Arme) |
| g1u03.w.tall | big from your feet to your hair; a giraffe is this. | Tamara is ___, not short. | short ; small ; long | short ; small ; long ; big ; strong | — |
| g1u03.w.teeth | one tooth, but more of these white ones in your mouth. | You have got more than one tooth; you have got ___ in your mouth. | hair ; ears ; fingers | hair ; ears ; fingers ; eyes ; legs | white (= weiß) |
| g1u03.w.to-be-scared | Tamara has got this when she is not happy and a big ship is there. | Greybeard is big and strong. Tamara is ___ of him. | famous ; pretty ; strong | famous ; pretty ; strong ; tall ; big | — |
| g1u03.w.to-paint | you do this to a picture with red, blue and other colours. | Let's ___ a picture of a captain with our colours. | read ; open ; give | read ; open ; give ; find ; ask | red (= rot) ; blue (= blau) ; other (= andere) ; colours (= Farben) |
| g1u03.w.tooth | it is small and white, and it is in your mouth. | I have got one small white ___ in my mouth. | hair ; finger ; ear | hair ; finger ; ear ; nose ; eye | white (= weiß) |
| g1u03.w.week | seven days are one of these. | Seven days is one ___. | ship ; captain ; beard | ship ; captain ; beard ; sister ; boy | days (= Tage) |
| g1u03.w.woman | an adult; she is not a man and not a girl. | The ___ has got long hair; she is not a man. | man ; boy ; girl | man ; boy ; girl ; sister ; captain | — |

## Grammar items (42)

| id | fmt | prompt | answers | distractors | pairs | groups | gloss |
|---|---|---|---|---|---|---|---|
| g1u03.gi.have-got.ag.001 | anagram | Pollys Haare sind nicht braun, sondern … [de] | purple (full) | — | — | — | — |
| g1u03.gi.have-got.cp.001 | context-picker | Du sprichst über Polly. Welcher Satz ist richtig? [de] | She has got purple hair. (full) | She have got purple hair. ; She has purple hair got. ; She is got purple hair. | — | — | — |
| g1u03.gi.have-got.cp.002 | context-picker | Du willst von deinem Freund wissen, ob er einen Hund hat. Was ist richtig? [de] | Have you got a dog? (full) | Do you have got a dog? ; Has you got a dog? ; You have got a dog? | — | — | — |
| g1u03.gi.have-got.ec.001 | error-correction | Finde und verbessere den Fehler: He have got a beard. [de] | He has got a beard. (full) ; has (partial) | — | — | — | — |
| g1u03.gi.have-got.ec.002 | error-correction | Finde und verbessere den Fehler: Does he has got a dog? [de] | Has he got a dog? (full) ; Has he (partial) | — | — | — | — |
| g1u03.gi.have-got.ec.003 | error-correction | Finde und verbessere den Fehler: They hasn't got a ship. [de] | They haven't got a ship. (full) ; haven't (partial) | — | — | — | — |
| g1u03.gi.have-got.gf.001 | gap-fill | I ___ got a pen. (have / has) [en, 1 blank(s)] | have (full) ; 've (partial) | — | — | — | — |
| g1u03.gi.have-got.gf.002 | gap-fill | Polly ___ got purple hair. (have / has) [en, 1 blank(s)] | has (full) ; 's (partial) | — | — | — | — |
| g1u03.gi.have-got.gf.003 | gap-fill | He ___ got a dog. He's got a parrot. [en, 1 blank(s)] | hasn't (full) ; has not (full) | — | — | — | — |
| g1u03.gi.have-got.gf.004 | gap-fill | ___ you got a hat? [en, 1 blank(s)] | Have (full) | — | — | — | — |
| g1u03.gi.have-got.gf.006 | gap-fill | We ___ got a car. We have got a big ship. [en, 1 blank(s)] | haven't (full) ; have not (full) | — | — | — | — |
| g1u03.gi.have-got.gf.007 | gap-fill | ___ she got a parrot? — No, she ___. [en, 2 blank(s)] | Has \| hasn't (full) ; Has \| has not (full) | — | — | — | — |
| g1u03.gi.have-got.gs.001 | group-sort | have got oder has got? [de] | — | — | — | have got: I, you, we, they \| has got: he, she, it | — |
| g1u03.gi.have-got.mc.001 | multiple-choice | Blackbeard ___ a big ship. [en, 1 blank(s)] | has got (full) | have got ; has ; have | — | — | — |
| g1u03.gi.have-got.mc.002 | multiple-choice | Was ist richtig? [de] | Has he got a dog? (full) | Does he has got a dog? ; Have he got a dog? ; Is he got a dog? | — | — | — |
| g1u03.gi.have-got.mc.003 | multiple-choice | She ___ got long hair. [en, 1 blank(s)] | has (full) | have ; is ; can | — | — | — |
| g1u03.gi.have-got.mc.004 | multiple-choice | Welcher Satz ist richtig? [de] | They haven't got a ship. (full) | They hasn't got a ship. ; They don't have got a ship. ; They haven't a ship got. | — | — | — |
| g1u03.gi.have-got.mp.001 | matching-pairs | Welche Sätze passen zusammen? [de] | — | — | I have got a hat. ↔ I haven't got a hat. ; She has got a parrot. ↔ She hasn't got a parrot. ; We have got a ship. ↔ We haven't got a ship. ; He has got a dog. ↔ He hasn't got a dog. | — | — |
| g1u03.gi.have-got.mt.001 | matching | Was passt zusammen? [de] | — | — | Has she got a parrot? ↔ No, she hasn't. ; Have you got a hat? ↔ Yes, I have. ; Has he got a beard? ↔ Yes, he has. ; Have they got a ship? ↔ No, they haven't. | — | — |
| g1u03.gi.have-got.qf.001 | question-formation | you / a / parrot → ___ [en, 1 blank(s)] | Have you got a parrot? (full) | — | — | — | — |
| g1u03.gi.have-got.sb.001 | sentence-building | Has / he / got / a / ship / ? [en] | Has he got a ship? (full) | — | — | — | — |
| g1u03.gi.have-got.sb.002 | sentence-building | She / hasn't / got / a / beard / . [en] | She hasn't got a beard. (full) | — | — | — | — |
| g1u03.gi.have-got.tf.001 | transformation | She has got a parrot. → She ___ got a parrot. (–) [en, 1 blank(s)] | hasn't (full) ; has not (full) ; She hasn't got a parrot. (partial) | — | — | — | — |
| g1u03.gi.have-got.tf.002 | transformation | They have got a ship. → ___ they got a ship? (?) [en, 1 blank(s)] | Have (full) ; Have they got a ship? (partial) | — | — | — | — |
| g1u03.gi.have-got.tf.003 | transformation | I have got a hat. (he) → He ___ got a hat. [en, 1 blank(s)] | has (full) ; 's (partial) | — | — | — | — |
| g1u03.gi.have-got.tr.001 | translation | Ich habe einen Hut. [de] | I have got a hat. (full) ; I've got a hat. (full) ; I have a hat. (partial) | — | — | — | — |
| g1u03.gi.have-got.tr.003 | translation | She has got purple hair. [en] | Sie hat lila Haare. (full) ; Sie hat violette Haare. (full) ; Sie hat purpurne Haare. (partial) | — | — | — | — |
| g1u03.gi.have-got.tr.004 | translation | Hat er einen Hund? — Nein, er hat keinen. [de] | Has he got a dog? — No, he hasn't. (full) ; Has he got a dog? — No, he has not. (full) | — | — | — | — |
| g1u03.gi.irregular-plurals-2.ag.003 | anagram | Mehr als ein foot: [de] | feet (full) | — | — | — | — |
| g1u03.gi.irregular-plurals-2.ag.004 | anagram | Mehr als ein tooth: [de] | teeth (full) | — | — | — | — |
| g1u03.gi.irregular-plurals-2.cp.001 | context-picker | Polly hat zwei große Füße. Welcher Satz ist richtig? [de] | I have got two big feet. (full) | I have got two big foots. ; I have got two big feets. ; I have got two big foot. | — | — | — |
| g1u03.gi.irregular-plurals-2.ec.001 | error-correction | Finde den Fehler und schreib den Satz richtig: My foots are big. [de] | My feet are big. (full) ; feet (partial) | — | — | — | — |
| g1u03.gi.irregular-plurals-2.ec.002 | error-correction | Finde den Fehler und schreib den Satz richtig: I clean my tooths. [de] | I clean my teeth. (full) ; teeth (partial) | — | — | — | — |
| g1u03.gi.irregular-plurals-2.gf.001 | gap-fill | My foot is big. My two ___ are big. [en, 1 blank(s)] | feet (full) | — | — | — | — |
| g1u03.gi.irregular-plurals-2.gf.002 | gap-fill | I have got one tooth. Now I have got five ___. [en, 1 blank(s)] | teeth (full) | — | — | — | — |
| g1u03.gi.irregular-plurals-2.gs.002 | group-sort | Eines oder mehrere? Sortiere die Wörter. [de] | — | — | — | one: foot, tooth \| two: feet, teeth | — |
| g1u03.gi.irregular-plurals-2.mc.001 | multiple-choice | Blackbeard has got two big ___. [en, 1 blank(s)] | feet (full) | foots ; feets ; foot | — | — | — |
| g1u03.gi.irregular-plurals-2.mc.002 | multiple-choice | The captain has got five ___. [en, 1 blank(s)] | teeth (full) | tooths ; teeths ; tooth | — | — | — |
| g1u03.gi.irregular-plurals-2.tf.001 | transformation | I have got one foot. (→ two) [en] | I have got two feet. (full) | — | — | — | — |
| g1u03.gi.irregular-plurals-2.tf.002 | transformation | The captain has got one tooth. (→ five) [en] | The captain has got five teeth. (full) | — | — | — | — |
| g1u03.gi.irregular-plurals-2.tr.001 | translation | Ich habe zwei Füße. [de] | I have got two feet. (full) ; I have two feet. (partial) | — | — | — | — |
| g1u03.gi.irregular-plurals-2.tr.002 | translation | Der Kapitän hat fünf Zähne. [de] | The captain has got five teeth. (full) ; The captain has five teeth. (partial) | — | — | — | — |

## Output contract

Write `content/corpus/units/g1-u03/verify/level-gloss.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u03",
  "lens": "level-gloss",
  "itemsHash": "ba126dc65b37",
  "promptHash": "aefb997bf664",
  "round": 1,
  "by": "fable-lens-level-gloss",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 84, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
