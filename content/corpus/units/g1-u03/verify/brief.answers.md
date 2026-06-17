# Verify lens — answers — g1-u03 (round 1)

<!-- domigo:verify answers g1-u03 items=ba126dc65b37 prompt=70fa2d8cdf22 round=1 -->

<!-- domigo:prompt verify-answers v=1 -->
# Lens 2 — answer-set completeness + in-sentence grammaticality (adversarial)

You are an independent, adversarial verifier. You did NOT write these items. For every
item, attack the answer machinery:

1. **Completeness:** put yourself in the student's seat and enumerate every answer a
   competent student could legitimately give. Is each one in the answer set at the
   right tier? A CORRECT answer marked wrong is the single worst failure this app can
   ship (it is exactly how v1 died). Check especially: contractions (we should not /
   we shouldn't), British/American variants, optional subjects, word-order variants,
   plural/singular both fitting, synonyms within the bank.
2. **Grammaticality:** substitute EVERY full-tier answer into the blank/carrier and
   read the whole sentence aloud. Wrong a/an, broken agreement, double words,
   capitalization mismatches at sentence start — all `fix`.
3. **Distractor safety:** for choice formats, could any distractor be defended as
   correct in this exact context? A defensible distractor = `fix`
   (kind `distractor-plausible-correct`). Distractors must be unambiguously wrong.
4. **Blank arity:** the declared blanks, the `___` markers, and the per-blank pipe
   segments in answers must agree (the machine checks counts; you check SENSE — does
   each segment actually fit its blank?).
5. **strict flag:** items where fuzzy matching would wrongly accept near-misses
   (minimal pairs like "should/shouldn't"!) need `strict: true` — flag if missing
   (kind `answer-incomplete`, say so in the note).

Flag kind menu: `answer-incomplete`, `answer-ungrammatical`,
`distractor-plausible-correct`. Severity `fix` for anything that would mis-grade a
real student; `warn` for defensible-but-improvable.

## Vocab items (42)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g1u03.w.again | again | one more time. | I want to do it one more time. Let's do it ___. | again (full) | again (full) | also ; back ; here |
| g1u03.w.also | also | it means too. | Tamara is a captain. Greybeard is ___ a captain. | also (full) ; too (partial) | also (full) ; too (partial) | again ; back ; here |
| g1u03.w.back | back | to where you were before. | The pirates are at the zoo. When are they ___? | back (full) | back (full) | again ; also ; here |
| g1u03.w.beard | beard | it is the long hair on a man, under his mouth. | The man has got a long brown ___ on his face. | beard (full) | beard (full) | hair ; ear ; shoulder |
| g1u03.w.big | big | not small. | Greybeard has got a ___ ship, not a small one. | big (full) | big (full) | small ; short ; long |
| g1u03.w.boy | boy | he is not a girl, and he is not an adult man. | That ___ over there is my friend; he is not a girl. | boy (full) | boy (full) | girl ; woman ; sister |
| g1u03.w.captain | captain | the man on a ship who is the boss. | The ___ has got a big blue ship. | captain (full) | captain (full) | sister ; boy ; man |
| g1u03.w.ear | ear | you have got two of these, and you hear music with them. | You have got two ___, and you hear music with them. | ears (full) | ear (full) ; ears (full) | eye ; mouth ; foot |
| g1u03.w.eye | eye | you have got two of these; one is green and one is blue. | You have got two ___; one is green and one is blue. | eyes (full) | eye (full) ; eyes (full) | ear ; nose ; finger |
| g1u03.w.famous | famous | many people know this man or woman. | This is Greybeard. He is a ___ captain and many people know him. | famous (full) | famous (full) | pretty ; strong ; tall |
| g1u03.w.feet | feet | one foot, but two of these; your two shoes go on them. | I have got a shoe on each of my two ___. | feet (full) | feet (full) | ears ; teeth ; legs |
| g1u03.w.finger | finger | you have got ten of these — five and five. | You have got ten ___ — five and five. | fingers (full) | finger (full) ; fingers (full) | ear ; leg ; nose |
| g1u03.w.foot | foot | it is on the end of your leg, and your shoe is on it. | I have got one shoe on one ___. | foot (full) | foot (full) | ear ; nose ; eye |
| g1u03.w.girl | girl | she is not a boy, and she is not an adult woman. | That ___ over there is my friend; she is not a boy. | girl (full) | girl (full) | boy ; man ; captain |
| g1u03.w.hair | hair | it can be long or short, and it is on your head. | Greybeard has got very long ___. | hair (full) | hair (full) | beard ; ear ; eye |
| g1u03.w.have-got-has-got | have got / has got | you speak this for a thing that is yours. | I ___ two sisters and one ship. | have got (full) | have got (full) ; has got (full) | also ; again ; back |
| g1u03.w.her-name-is | Her name is … | you say this for a girl or a woman, and it says who she is. | This is my sister. ___ Betty. | Her name is (full) | Her name is (full) | His name is ; have got ; has got |
| g1u03.w.him | him | it is for a boy or a man; you do not say it for a girl. | Peter is nice. We love ___. | him (full) | him (full) | his ; us ; back |
| g1u03.w.his | his | a boy or a man has got this thing. | This is Blackbeard. ___ ship is big. | His (full) | his (full) | him ; her ; their |
| g1u03.w.his-name-is | His name is … | you say this for a boy or a man, and it says who he is. | This is my friend. ___ Mike. | His name is (full) | His name is (full) | Her name is ; have got ; has got |
| g1u03.w.left-arm | left arm | It is under your shoulder. It is not the one you write with. | Frank has got a parrot on his ___ and a parrot on his right arm. | left arm (full) | left arm (full) | right arm ; shoulder ; leg |
| g1u03.w.leg | leg | you have got two of these, and your foot is on the end of one. | Greybeard has got a strong ___ and he can stand up. | leg (full) | leg (full) ; legs (full) | ear ; nose ; finger |
| g1u03.w.long | long | your hair can be this if it is not short. | Greybeard has got very ___ hair, not short hair. | long (full) | long (full) | short ; small ; tall |
| g1u03.w.man | man (pl men) | an adult; he is not a woman and not a boy. | The ___ has got a beard; he is not a woman. | man (full) | man (full) ; men (full) | woman ; boy ; girl |
| g1u03.w.mouth | mouth | you eat and talk with this. | You eat and talk with your ___. | mouth (full) | mouth (full) | eye ; ear ; finger |
| g1u03.w.nose | nose | you have got one big or small one, and you smell with it. | You have got one big ___, and you smell with it. | nose (full) | nose (full) | ear ; leg ; shoulder |
| g1u03.w.pretty | pretty | nice to look at. | Polly is a ___ captain and she is nice to look at. | pretty (full) | pretty (full) | famous ; strong ; tall |
| g1u03.w.purple | purple | the colour of red and blue together. | Polly has got ___ hair — the colour of red and blue. | purple (full) ; violet (partial) | purple (full) | famous ; pretty ; strong |
| g1u03.w.right-arm | right arm | It is under your shoulder. It is the one you write with. | Fred has got a parrot on his ___ and a parrot on his left arm. | right arm (full) | right arm (full) | left arm ; shoulder ; leg |
| g1u03.w.ship | ship | it is a very big boat; a captain is on it. | Greybeard has got a big ___ and he can go on the sea. | ship (full) ; boat (partial) | ship (full) | captain ; beard ; week |
| g1u03.w.short | short | not long and not tall. | Greybeard is ___, not tall. | short (full) | short (full) | tall ; long ; big |
| g1u03.w.shoulder | shoulder | it is under your ear and over your arm; a parrot can be on it. | The parrot is on his ___, next to his ear. | shoulder (full) | shoulder (full) | leg ; finger ; nose |
| g1u03.w.sister | sister | a girl in your family. | My ___ is a girl and she has got long hair. | sister (full) | sister (full) | captain ; boy ; man |
| g1u03.w.small | small | not big. | Frank has got a ___ nose, not a big one. | small (full) | small (full) | big ; tall ; long |
| g1u03.w.strong | strong | not weak; a man with big arms is this. | Greybeard has got a ___ left arm; he is not weak. | strong (full) | strong (full) | pretty ; famous ; tall |
| g1u03.w.tall | tall | big from your feet to your hair; a giraffe is this. | Tamara is ___, not short. | tall (full) | tall (full) | short ; small ; long |
| g1u03.w.teeth | teeth | one tooth, but more of these white ones in your mouth. | You have got more than one tooth; you have got ___ in your mouth. | teeth (full) | teeth (full) | hair ; ears ; fingers |
| g1u03.w.to-be-scared | to be scared (of) | Tamara has got this when she is not happy and a big ship is there. | Greybeard is big and strong. Tamara is ___ of him. | scared (full) ; scared of (full) | scared (full) ; be scared (full) ; to be scared (full) ; scared of (full) | famous ; pretty ; strong |
| g1u03.w.to-paint | to paint | you do this to a picture with red, blue and other colours. | Let's ___ a picture of a captain with our colours. | paint (full) | paint (full) ; to paint (full) | read ; open ; give |
| g1u03.w.tooth | tooth | it is small and white, and it is in your mouth. | I have got one small white ___ in my mouth. | tooth (full) | tooth (full) | hair ; finger ; ear |
| g1u03.w.week | week | seven days are one of these. | Seven days is one ___. | week (full) | week (full) | ship ; captain ; beard |
| g1u03.w.woman | woman (pl women) | an adult; she is not a man and not a girl. | The ___ has got long hair; she is not a man. | woman (full) | woman (full) ; women (full) | man ; boy ; girl |

## Grammar items (42)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g1u03.gi.have-got.ag.001 | anagram | Pollys Haare sind nicht braun, sondern … [de] | purple (full) | — | — | — | — | false |
| g1u03.gi.have-got.cp.001 | context-picker | Du sprichst über Polly. Welcher Satz ist richtig? [de] | She has got purple hair. (full) | — | She have got purple hair. ; She has purple hair got. ; She is got purple hair. | — | — | false |
| g1u03.gi.have-got.cp.002 | context-picker | Du willst von deinem Freund wissen, ob er einen Hund hat. Was ist richtig? [de] | Have you got a dog? (full) | — | Do you have got a dog? ; Has you got a dog? ; You have got a dog? | — | — | false |
| g1u03.gi.have-got.ec.001 | error-correction | Finde und verbessere den Fehler: He have got a beard. [de] | He has got a beard. (full) ; has (partial) | — | — | — | — | true |
| g1u03.gi.have-got.ec.002 | error-correction | Finde und verbessere den Fehler: Does he has got a dog? [de] | Has he got a dog? (full) ; Has he (partial) | — | — | — | — | false |
| g1u03.gi.have-got.ec.003 | error-correction | Finde und verbessere den Fehler: They hasn't got a ship. [de] | They haven't got a ship. (full) ; haven't (partial) | — | — | — | — | true |
| g1u03.gi.have-got.gf.001 | gap-fill | I ___ got a pen. (have / has) [en, 1 blank(s)] | have (full) ; 've (partial) | — | — | — | — | true |
| g1u03.gi.have-got.gf.002 | gap-fill | Polly ___ got purple hair. (have / has) [en, 1 blank(s)] | has (full) ; 's (partial) | — | — | — | — | true |
| g1u03.gi.have-got.gf.003 | gap-fill | He ___ got a dog. He's got a parrot. [en, 1 blank(s)] | hasn't (full) ; has not (full) | — | — | — | — | true |
| g1u03.gi.have-got.gf.004 | gap-fill | ___ you got a hat? [en, 1 blank(s)] | Have (full) | — | — | — | — | true |
| g1u03.gi.have-got.gf.006 | gap-fill | We ___ got a car. We have got a big ship. [en, 1 blank(s)] | haven't (full) ; have not (full) | — | — | — | — | true |
| g1u03.gi.have-got.gf.007 | gap-fill | ___ she got a parrot? — No, she ___. [en, 2 blank(s)] | Has \| hasn't (full) ; Has \| has not (full) | — | — | — | — | true |
| g1u03.gi.have-got.gs.001 | group-sort | have got oder has got? [de] | — | — | — | — | have got: I, you, we, they \| has got: he, she, it | false |
| g1u03.gi.have-got.mc.001 | multiple-choice | Blackbeard ___ a big ship. [en, 1 blank(s)] | has got (full) | — | have got ; has ; have | — | — | true |
| g1u03.gi.have-got.mc.002 | multiple-choice | Was ist richtig? [de] | Has he got a dog? (full) | — | Does he has got a dog? ; Have he got a dog? ; Is he got a dog? | — | — | false |
| g1u03.gi.have-got.mc.003 | multiple-choice | She ___ got long hair. [en, 1 blank(s)] | has (full) | — | have ; is ; can | — | — | true |
| g1u03.gi.have-got.mc.004 | multiple-choice | Welcher Satz ist richtig? [de] | They haven't got a ship. (full) | — | They hasn't got a ship. ; They don't have got a ship. ; They haven't a ship got. | — | — | false |
| g1u03.gi.have-got.mp.001 | matching-pairs | Welche Sätze passen zusammen? [de] | — | — | — | I have got a hat. ↔ I haven't got a hat. ; She has got a parrot. ↔ She hasn't got a parrot. ; We have got a ship. ↔ We haven't got a ship. ; He has got a dog. ↔ He hasn't got a dog. | — | false |
| g1u03.gi.have-got.mt.001 | matching | Was passt zusammen? [de] | — | — | — | Has she got a parrot? ↔ No, she hasn't. ; Have you got a hat? ↔ Yes, I have. ; Has he got a beard? ↔ Yes, he has. ; Have they got a ship? ↔ No, they haven't. | — | false |
| g1u03.gi.have-got.qf.001 | question-formation | you / a / parrot → ___ [en, 1 blank(s)] | Have you got a parrot? (full) | — | — | — | — | false |
| g1u03.gi.have-got.sb.001 | sentence-building | Has / he / got / a / ship / ? [en] | Has he got a ship? (full) | — | — | — | — | false |
| g1u03.gi.have-got.sb.002 | sentence-building | She / hasn't / got / a / beard / . [en] | She hasn't got a beard. (full) | — | — | — | — | false |
| g1u03.gi.have-got.tf.001 | transformation | She has got a parrot. → She ___ got a parrot. (–) [en, 1 blank(s)] | hasn't (full) ; has not (full) ; She hasn't got a parrot. (partial) | — | — | — | — | true |
| g1u03.gi.have-got.tf.002 | transformation | They have got a ship. → ___ they got a ship? (?) [en, 1 blank(s)] | Have (full) ; Have they got a ship? (partial) | — | — | — | — | true |
| g1u03.gi.have-got.tf.003 | transformation | I have got a hat. (he) → He ___ got a hat. [en, 1 blank(s)] | has (full) ; 's (partial) | — | — | — | — | true |
| g1u03.gi.have-got.tr.001 | translation | Ich habe einen Hut. [de] | I have got a hat. (full) ; I've got a hat. (full) ; I have a hat. (partial) | deToEn | — | — | — | false |
| g1u03.gi.have-got.tr.003 | translation | She has got purple hair. [en] | Sie hat lila Haare. (full) ; Sie hat violette Haare. (full) ; Sie hat purpurne Haare. (partial) | enToDe | — | — | — | false |
| g1u03.gi.have-got.tr.004 | translation | Hat er einen Hund? — Nein, er hat keinen. [de] | Has he got a dog? — No, he hasn't. (full) ; Has he got a dog? — No, he has not. (full) | deToEn | — | — | — | false |
| g1u03.gi.irregular-plurals-2.ag.003 | anagram | Mehr als ein foot: [de] | feet (full) | — | — | — | — | false |
| g1u03.gi.irregular-plurals-2.ag.004 | anagram | Mehr als ein tooth: [de] | teeth (full) | — | — | — | — | false |
| g1u03.gi.irregular-plurals-2.cp.001 | context-picker | Polly hat zwei große Füße. Welcher Satz ist richtig? [de] | I have got two big feet. (full) | — | I have got two big foots. ; I have got two big feets. ; I have got two big foot. | — | — | true |
| g1u03.gi.irregular-plurals-2.ec.001 | error-correction | Finde den Fehler und schreib den Satz richtig: My foots are big. [de] | My feet are big. (full) ; feet (partial) | — | — | — | — | true |
| g1u03.gi.irregular-plurals-2.ec.002 | error-correction | Finde den Fehler und schreib den Satz richtig: I clean my tooths. [de] | I clean my teeth. (full) ; teeth (partial) | — | — | — | — | true |
| g1u03.gi.irregular-plurals-2.gf.001 | gap-fill | My foot is big. My two ___ are big. [en, 1 blank(s)] | feet (full) | — | — | — | — | true |
| g1u03.gi.irregular-plurals-2.gf.002 | gap-fill | I have got one tooth. Now I have got five ___. [en, 1 blank(s)] | teeth (full) | — | — | — | — | true |
| g1u03.gi.irregular-plurals-2.gs.002 | group-sort | Eines oder mehrere? Sortiere die Wörter. [de] | — | — | — | — | one: foot, tooth \| two: feet, teeth | false |
| g1u03.gi.irregular-plurals-2.mc.001 | multiple-choice | Blackbeard has got two big ___. [en, 1 blank(s)] | feet (full) | — | foots ; feets ; foot | — | — | true |
| g1u03.gi.irregular-plurals-2.mc.002 | multiple-choice | The captain has got five ___. [en, 1 blank(s)] | teeth (full) | — | tooths ; teeths ; tooth | — | — | true |
| g1u03.gi.irregular-plurals-2.tf.001 | transformation | I have got one foot. (→ two) [en] | I have got two feet. (full) | — | — | — | — | true |
| g1u03.gi.irregular-plurals-2.tf.002 | transformation | The captain has got one tooth. (→ five) [en] | The captain has got five teeth. (full) | — | — | — | — | true |
| g1u03.gi.irregular-plurals-2.tr.001 | translation | Ich habe zwei Füße. [de] | I have got two feet. (full) ; I have two feet. (partial) | deToEn | — | — | — | true |
| g1u03.gi.irregular-plurals-2.tr.002 | translation | Der Kapitän hat fünf Zähne. [de] | The captain has got five teeth. (full) ; The captain has five teeth. (partial) | deToEn | — | — | — | true |

## Output contract

Write `content/corpus/units/g1-u03/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u03",
  "lens": "answers",
  "itemsHash": "ba126dc65b37",
  "promptHash": "70fa2d8cdf22",
  "round": 1,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 84, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
