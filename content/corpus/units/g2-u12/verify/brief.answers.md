# Verify lens — answers — g2-u12 (round 2)

<!-- domigo:verify answers g2-u12 items=126cf838c1fb prompt=70fa2d8cdf22 round=2 -->

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

## Vocab items (33)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g2u12.w.backache | backache | you have this when your back hurts | My back hurts when I stand up. I have got ___. | backache (full) ; a backache (partial) | backache (full) | headache ; stomach ache ; toothache |
| g2u12.w.bath | bath | you wash in this when you are dirty | I have to give my dog a ___. She is very dirty. | bath (full) ; baths (partial) | bath (full) ; a bath (full) ; baths (full) | spoon ; medicine ; memory |
| g2u12.w.believe-me | Believe me! | you said this when you want people to think a thing is true | It is true! ___ I am not telling a lie. | Believe me! (full) ; Believe me (full) | Believe me! (full) ; Believe me (full) | It doesn't matter. ; Calm down! ; Poor you! |
| g2u12.w.blood | blood | this red wet thing is inside you | There is ___ on your shirt. It is all red. | blood (full) | blood (full) | taste ; smell ; medicine |
| g2u12.w.cure | cure | a thing that makes you well again when you are ill | In Ancient Egypt, a dead mouse was a ___ for toothache. | cure (full) ; cures (partial) | cure (full) ; a cure (full) ; cures (full) | smell ; taste ; memory |
| g2u12.w.dentist | dentist | the doctor who looks after your teeth | I want to become a ___. | dentist (full) ; dentists (partial) | dentist (full) ; a dentist (full) ; dentists (full) | patient ; writer ; pupil |
| g2u12.w.earache | earache | you have this when your ear hurts | My ear hurts, so I have got ___. | earache (full) ; an earache (partial) | earache (full) | headache ; toothache ; backache |
| g2u12.w.first-aid | first aid | the help you give somebody who is hurt, before the doctor is there | We have ___ classes at school. | first aid (full) | first aid (full) | medicine ; toothpaste ; bath |
| g2u12.w.headache | headache | you have this when your head hurts | My head hurts. I have got a bad ___. | headache (full) ; headaches (partial) | headache (full) ; a headache (full) ; headaches (partial) | toothache ; earache ; backache |
| g2u12.w.helpful | helpful | always happy to help people | She has always been a great and ___ friend. | helpful (full) | helpful (full) | horrible ; dead ; alive |
| g2u12.w.horrible | horrible | very bad and not nice at all | The accident was ___! | horrible (full) | horrible (full) | helpful ; dead ; alive |
| g2u12.w.it-doesn-t-matter | It doesn't matter. | you said this to tell somebody a thing is not bad | I have lost your pen. - ___ I have one more for you. | It doesn't matter. (full) ; It doesn't matter (full) ; It does not matter. (full) | It doesn't matter. (full) ; It doesn't matter (full) ; It does not matter. (full) | Believe me! ; Calm down! ; Poor you! |
| g2u12.w.knee | knee | the middle of your leg that you go down on | Jacob has hurt his ___ in the middle of his leg, so he cannot play football. | knee (full) ; knees (partial) | knee (full) ; knees (full) | throat ; shoulder ; ear |
| g2u12.w.lamp-post | lamp post | a tall thing in the street with a light on it | He has just run into a ___ in the street. | lamp post (full) ; lamppost (partial) ; lamp posts (partial) | lamp post (full) ; a lamp post (full) ; lamppost (partial) | spoon ; toothpaste ; bath |
| g2u12.w.medicine | medicine | you have this when you are ill and it makes you well again | The doctor gives me ___ when I am ill. | medicine (full) ; some medicine (partial) ; medicines (partial) | medicine (full) | bath ; spoon ; toothpaste |
| g2u12.w.memory | memory | what you keep in your head, so you can bring days and people back | Grandma has a very good ___. She can keep lots of birthdays in her head. | memory (full) ; memories (partial) | memory (full) | medicine ; taste ; smell |
| g2u12.w.pain-in-ankle | pain in ankle | you have this when the bottom of your leg, just over your foot, hurts | Emily cannot stand on her foot. She has got ___. | pain in ankle (full) ; a pain in the ankle (full) ; a pain in her ankle (full) ; pain in the ankle (partial) | pain in ankle (full) ; pain in the ankle (full) ; ankle pain (partial) | backache ; headache ; toothache |
| g2u12.w.patient | patient | somebody who is ill and that a doctor looks after | The doctor looks after every ___ at the hospital. | patient (full) ; patients (partial) | patient (full) ; a patient (full) ; patients (full) | dentist ; writer ; pupil |
| g2u12.w.pupil | pupil | a child at school | Every ___ in our class does a text in front of the teacher. | pupil (full) ; pupils (partial) | pupil (full) ; a pupil (full) ; pupils (full) | writer ; dentist ; patient |
| g2u12.w.since | since | from a time in the past up to now | I have been in hospital ___ last week. | since (full) | since (full) | helpful ; horrible ; writer |
| g2u12.w.smell | smell | what your nose finds; bad fish has a really bad one | The ___ of fish was really bad. | smell (full) ; smells (partial) | smell (full) | taste ; memory ; cure |
| g2u12.w.spoon | spoon | you eat your soup with this, not with a knife | I need a ___ to eat my soup. | spoon (full) ; spoons (partial) | spoon (full) ; a spoon (full) ; spoons (full) | bath ; lamp post ; toothpaste |
| g2u12.w.stomach-ache | stomach ache | you have this when you eat too much and the middle of you hurts | Jacob has eaten too much cake, so now he has ___. | stomach ache (full) ; stomachache (partial) | stomach ache (full) ; stomachache (partial) | headache ; backache ; toothache |
| g2u12.w.taste | taste | what a food or drink is like in your mouth, good or bad | The ___ was very good. | taste (full) ; tastes (partial) | taste (full) | smell ; memory ; cure |
| g2u12.w.throat | throat | the inside place that food and drink go down after your mouth | My ___ hurts when I drink cold milk. | throat (full) ; throats (partial) | throat (full) | knee ; shoulder ; nose |
| g2u12.w.to-cure | to cure | to make somebody well again when they are ill | Long ago, people said worms could ___ stomach ache. | cure (full) ; cured (partial) ; cures (partial) | cure (full) ; to cure (full) | mash ; mix ; injure |
| g2u12.w.to-injure | to injure | to hurt your arm, leg or knee in an accident | I do not want to ___ my knee again. | injure (full) ; hurt (partial) | injure (full) ; to injure (full) ; injured (full) | mix ; mash ; cure |
| g2u12.w.to-mash | to mash | to push food down so it is not in pieces | They ___ a dead mouse and mixed it with food. | mashed (full) ; mash (partial) | mash (full) ; to mash (full) ; mashed (full) | mix ; cure ; injure |
| g2u12.w.to-mix | to mix | to put a food and a drink into one so they become one thing | I ___ the medicine into the food, so the dog eats it. | mix (full) ; mixed (partial) ; mixes (partial) | mix (full) ; to mix (full) ; mixed (full) | mash ; cure ; injure |
| g2u12.w.toothache | toothache | you have this when one of your teeth hurts | One of my teeth hurts, so I have got ___. | toothache (full) ; a toothache (partial) | toothache (full) | headache ; earache ; stomach ache |
| g2u12.w.toothpaste | toothpaste | you clean your teeth with this every morning and night | In Ancient Rome, people did not have ___. | toothpaste (full) | toothpaste (full) | medicine ; spoon ; bath |
| g2u12.w.worm | worm | a long thing with no legs that lives in the ground | A ___ lives under the ground. | worm (full) ; worms (partial) | worm (full) ; a worm (full) ; worms (full) | spoon ; dentist ; patient |
| g2u12.w.writer | writer | somebody who makes books and stories for people to read | My favourite ___ has a new book out this week. | writer (full) ; writers (partial) | writer (full) ; a writer (full) ; writers (full) | pupil ; dentist ; patient |

## Grammar items (30)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g2u12.gi.present-perfect.ag.001 | anagram | Englisch für 'gebrochen' (sie hat sich den Arm ...): [de] | broken (full) | — | — | — | — | false |
| g2u12.gi.present-perfect.ag.002 | anagram | Englisch für 'geschrieben' (er hat einen Brief ...): [de] | written (full) | — | — | — | — | false |
| g2u12.gi.present-perfect.cp.001 | context-picker | Your friend is holding his knee and crying. What do you tell the teacher? [en] | He has hurt his knee. (full) | — | He has hurted his knee. ; He have hurt his knee. ; He hurt his knee yesterday. | — | — | false |
| g2u12.gi.present-perfect.cp.002 | context-picker | There is blood on your friend's shirt. He is holding his finger. [en] | I've just hurt my finger. (full) | — | I've just hurted my finger. ; I just have hurt my finger. ; I has just hurt my finger. | — | — | false |
| g2u12.gi.present-perfect.ec.001 | error-correction | She have just made a cake. [en] | She has just made a cake. (full) ; She's just made a cake. (full) ; has (partial) | — | — | — | — | true |
| g2u12.gi.present-perfect.ec.002 | error-correction | He has writed a letter to his grandma. [en] | He has written a letter to his grandma. (full) ; He's written a letter to his grandma. (full) ; written (partial) | — | — | — | — | true |
| g2u12.gi.present-perfect.ec.003 | error-correction | David has fallen and he broken his arm. [en] | David has fallen and he has broken his arm. (full) ; David has fallen and he's broken his arm. (full) ; he has broken his arm (partial) | — | — | — | — | true |
| g2u12.gi.present-perfect.ff.001 | free-form | Your knee hurts and you want the doctor. What do you tell the teacher? [en] | I've hurt my knee. (full) ; I have hurt my knee. (full) ; I've just hurt my knee. (full) ; I have just hurt my knee. (full) ; I've hurt my leg. (partial) ; I have hurt my leg. (partial) | — | — | — | — | false |
| g2u12.gi.present-perfect.gf.001 | gap-fill | I ___ just hurt my knee. [en, 1 blank(s)] | have (full) | — | — | — | — | false |
| g2u12.gi.present-perfect.gf.002 | gap-fill | She ___ just broken her arm. [en, 1 blank(s)] | has (full) | — | — | — | — | false |
| g2u12.gi.present-perfect.gf.003 | gap-fill | They ___ gone to the dentist. [en, 1 blank(s)] | have (full) | — | — | — | — | false |
| g2u12.gi.present-perfect.gf.004 | gap-fill | The dog has ___ all the cake! (eat) [en, 1 blank(s)] | eaten (full) | — | — | — | — | false |
| g2u12.gi.present-perfect.gf.005 | gap-fill | She has just ___ a letter to her grandma. (write) [en, 1 blank(s)] | written (full) | — | — | — | — | false |
| g2u12.gi.present-perfect.gf.006 | gap-fill | Call a doctor! David ___ ___ his leg. (break) [en, 2 blank(s)] | has \| broken (full) | — | — | — | — | false |
| g2u12.gi.present-perfect.gs.001 | group-sort | broken / break / eaten / eat / written / write / gone / go [en] | — | — | — | — | after have/has: broken, eaten, written, gone \| not after have/has: break, eat, write, go | false |
| g2u12.gi.present-perfect.mc.001 | multiple-choice | Your mum made a cake just now. [en] | She has just made a cake. (full) | — | She has just maked a cake. ; She have just made a cake. ; She just has made a cake. | — | — | false |
| g2u12.gi.present-perfect.mc.002 | multiple-choice | You can't find your keys. [en] | I have lost my keys. (full) | — | I have losed my keys. ; I has lost my keys. ; I have lose my keys. | — | — | false |
| g2u12.gi.present-perfect.mp.001 | matching-pairs | I've hurt … / she has broken … / he has eaten … [en] | — | — | — | I've hurt ↔ my knee. ; She has broken ↔ her arm. ; They have gone ↔ to the dentist. ; He has eaten ↔ all the cake. ; I have lost ↔ my keys. | — | false |
| g2u12.gi.present-perfect.mt.001 | matching | break, eat, lose, write, find [en] | — | — | — | break ↔ broken ; eat ↔ eaten ; lose ↔ lost ; write ↔ written ; find ↔ found | — | false |
| g2u12.gi.present-perfect.mt.002 | matching | go, make, do, hurt, drop [en] | — | — | — | go ↔ gone ; make ↔ made ; do ↔ done ; hurt ↔ hurt ; drop ↔ dropped | — | false |
| g2u12.gi.present-perfect.qf.001 | question-formation | Your friend looks ill. Ask your friend about the dentist. [en] | Have you seen the dentist? (full) ; Have you been to the dentist? (full) | — | — | — | — | false |
| g2u12.gi.present-perfect.qf.002 | question-formation | Her head hurts. Ask about her and her medicine. [en] | Has she taken her medicine? (full) ; Has she had her medicine? (full) | — | — | — | — | false |
| g2u12.gi.present-perfect.sb.001 | sentence-building | just / has / her / she / arm / broken [en] | She has just broken her arm. (full) | — | — | — | — | false |
| g2u12.gi.present-perfect.sb.002 | sentence-building | have / I / eaten / much / just / too [en] | I have just eaten too much. (full) ; I've just eaten too much. (full) | — | — | — | — | false |
| g2u12.gi.present-perfect.sb.003 | sentence-building | you / the / Have / seen / doctor / ? [en] | Have you seen the doctor? (full) | — | — | — | — | false |
| g2u12.gi.present-perfect.tf.001 | transformation | Tom hurt his knee just now. Tell your friend: 'Tom ___ (just / hurt) his knee.' [en, 1 blank(s)] | has just hurt (full) | — | — | — | — | true |
| g2u12.gi.present-perfect.tf.002 | transformation | The children found a spoon just now: 'The children ___ (just / find) a spoon.' [en, 1 blank(s)] | have just found (full) | — | — | — | — | true |
| g2u12.gi.present-perfect.tr.001 | translation | Er hat sich gerade das Bein gebrochen. [de] | He has just broken his leg. (full) ; He's just broken his leg. (full) | deToEn | — | — | — | false |
| g2u12.gi.present-perfect.tr.002 | translation | Ich habe gerade meine Schlüssel verloren. [de] | I have just lost my keys. (full) ; I've just lost my keys. (full) | deToEn | — | — | — | false |
| g2u12.gi.present-perfect.tr.003 | translation | I have just eaten too much. [en] | Ich habe gerade zu viel gegessen. (full) ; Ich hab gerade zu viel gegessen. (partial) | enToDe | — | — | — | false |

## Output contract

Write `content/corpus/units/g2-u12/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u12",
  "lens": "answers",
  "itemsHash": "126cf838c1fb",
  "promptHash": "70fa2d8cdf22",
  "round": 2,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 63, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
