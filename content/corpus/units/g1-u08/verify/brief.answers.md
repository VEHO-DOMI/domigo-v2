# Verify lens — answers — g1-u08 (round 1)

<!-- domigo:verify answers g1-u08 items=b0e8cce66c97 prompt=70fa2d8cdf22 round=1 -->

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

## Vocab items (30)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g1u08.w.anything | anything | It can be one thing, or no thing at all. | Is there ___ in the box? | anything (full) | anything (full) | somebody ; tonight ; backwards |
| g1u08.w.backwards | backwards | to do it from the end back to A, not from A to the end | Some children can read the alphabet ___, from the end back to A. | backwards (full) | backwards (full) | tonight ; exciting ; anything |
| g1u08.w.belt | belt | It is long, and you wear it on your trousers so they do not come down. | Look at her purple ___ and her grey skirt. | belt (full) | belt (full) | cap ; mask ; shoes |
| g1u08.w.blouse | blouse | It is like a shirt, and girls or women wear it. | She wears a ___ and a grey skirt to school. | blouse (full) | blouse (full) | cap ; belt ; boots |
| g1u08.w.boots | boots | These are big and strong, and you wear them on your feet over your socks. | When it is cold, I wear my big ___ on my feet. | boots (full) | boots (full) | cap ; mask ; belt |
| g1u08.w.building | building | It is a very big thing in the street, and your school is one. | The children go into the big ___. | building (full) | building (full) | horse ; poem ; belt |
| g1u08.w.cap | cap | You wear it on your hair. | Does he wear a grey ___? | cap (full) | cap (full) | belt ; blouse ; jacket |
| g1u08.w.cape | cape | It is long and you wear it on your back. | The clown has a long red ___ on his back. | cape (full) | cape (full) | cap ; belt ; shoes |
| g1u08.w.exciting | exciting | It is so good that it makes you happy and you want to jump up. | The big show was very ___! We all jumped and danced. | exciting (full) | exciting (full) | tonight ; backwards ; anything |
| g1u08.w.hole | hole | It is a small open thing in your sweater or shoe, and your finger can go in it. | There is a big ___ in my shoe. | hole (full) | hole (full) | belt ; cap ; mask |
| g1u08.w.hoodie | hoodie | It is like a sweater and you can pull it up over your hair. | He wears a grey ___ when it is cold. | hoodie (full) | hoodie (full) | cap ; belt ; boots |
| g1u08.w.horse | horse | It is big, it can run, and you can go on its back. | Her ___ is big and strong and it can run. | horse (full) | horse (full) | building ; poem ; belt |
| g1u08.w.jacket | jacket | You wear it when it is cold, and it is not long. | Put on your ___ because it is cold. | jacket (full) | jacket (full) | cap ; belt ; shoes |
| g1u08.w.let-s-get-out-of-here | Let's get out of here. | It is what you call when you want to go now, with a friend. | It is not nice here. I want to go now. ___ | Let's get out of here. (full) | Let's get out of here. (full) | Come on! ; Let me see. ; Well done. |
| g1u08.w.mask | mask | You wear it on your eyes and nose. | The clown wears a ___ over his eyes and nose. | mask (full) | mask (full) | belt ; cap ; hoodie |
| g1u08.w.poem | poem | a short text you read or write, like a story but very short | He likes to write ___ and read them to the class. | poems (full) ; poem (partial) | poem (full) | horse ; building ; belt |
| g1u08.w.pyjamas | pyjamas | You wear it in bed. | I put on my ___ before I go to sleep. | pyjamas (full) | pyjamas (full) ; pajamas (partial) | cap ; belt ; boots |
| g1u08.w.shoes | shoes | You put these on your feet when you go out. | I wear ___ on my feet. | shoes (full) | shoes (full) | cap ; mask ; belt |
| g1u08.w.somebody | somebody | It is a child or an adult, but who? You cannot find out. | There is ___ behind the door. | somebody (full) | somebody (full) ; someone (partial) | anything ; tonight ; backwards |
| g1u08.w.sweater | sweater | You wear it when it is cold. It is like a hoodie, but you cannot pull it over your hair. | Can I borrow your red ___? | sweater (full) | sweater (full) | cap ; belt ; boots |
| g1u08.w.tights | tights | You wear it on your legs and feet, often under a skirt. | She wears grey ___ under her skirt. | tights (full) | tights (full) | cap ; mask ; belt |
| g1u08.w.to-borrow | to borrow | to have it for a short time and then give it back to a friend | Can I ___ your red sweater? | borrow (full) | borrow (full) ; to borrow (full) | to wear ; to fit ; to hurt |
| g1u08.w.to-fit | to fit | when clothes are good for you and not too big or small | These shoes do not ___ me. | fit (full) | fit (full) ; to fit (full) | to borrow ; to wear ; to tickle |
| g1u08.w.to-hurt | to hurt | When your shoes do this, your feet are not happy and not OK. | These shoes ___ my feet. | hurt (full) | hurt (full) ; to hurt (full) | to borrow ; to fit ; to wear |
| g1u08.w.to-tickle | to tickle | to touch a child so they laugh | Please do not ___ me! | tickle (full) | tickle (full) ; to tickle (full) | to borrow ; to fit ; to wear |
| g1u08.w.to-try-on | to try on | to put clothes on and look in the mirror to find out if they fit | Can I ___ these trousers on? | try (full) | try on (full) ; to try on (full) | to borrow ; to fit ; to hurt |
| g1u08.w.to-wear | to wear | to have clothes on you | What clothes do you like to ___? | wear (full) | wear (full) ; to wear (full) | to borrow ; to fit ; to tickle |
| g1u08.w.tonight | tonight | It is this evening, after dinner and before you go to sleep. | We have got fun ___ after dinner. | tonight (full) | tonight (full) | backwards ; exciting ; anything |
| g1u08.w.trainers | trainers | You wear these shoes when you run. | You wear ___ on your feet when you run. | trainers (full) | trainers (full) ; sneakers (partial) | cap ; mask ; belt |
| g1u08.w.trousers | trousers | You wear it on your legs. | His ___ are too big, so he wears a belt. | trousers (full) | trousers (full) ; pants (partial) | cap ; mask ; belt |

## Grammar items (27)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g1u08.gi.present-simple-questions.ag.001 | anagram | Dieses kleine Wort brauchst du am Satzanfang bei he, she und it. [de] | Does (full) | — | — | — | — | true |
| g1u08.gi.present-simple-questions.ag.002 | anagram | So sagst du kurz Nein bei he: No, he ___. [de, 1 blank(s)] | doesn't (full) | — | — | — | — | true |
| g1u08.gi.present-simple-questions.cp.001 | context-picker | Du willst wissen, ob dein Freund einen Hoodie trägt. Frag ihn. [de] | Do you wear a hoodie? (full) | — | Does you wear a hoodie? ; Do you wears a hoodie? ; You wear a hoodie? | — | — | true |
| g1u08.gi.present-simple-questions.cp.002 | context-picker | Du möchtest herausfinden, ob Sophia gerne Pizza isst. Frag danach. [de] | Does Sophia like pizza? (full) | — | Does Sophia likes pizza? ; Do Sophia like pizza? ; Is Sophia like pizza? | — | — | true |
| g1u08.gi.present-simple-questions.ec.001 | error-correction | Does she likes chocolate? [en] | Does she like chocolate? (full) ; like (partial) | — | — | — | — | true |
| g1u08.gi.present-simple-questions.ec.002 | error-correction | Do he wear a belt? [en] | Does he wear a belt? (full) ; Does (partial) | — | — | — | — | true |
| g1u08.gi.present-simple-questions.ec.003 | error-correction | You like dogs? Yes, I like. [en] | Do you like dogs? Yes, I do. (full) | — | — | — | — | true |
| g1u08.gi.present-simple-questions.gf.001 | gap-fill | ___ you wear a cap? — Yes, I ___. [en, 2 blank(s)] | Do \| do (full) | — | — | — | — | true |
| g1u08.gi.present-simple-questions.gf.002 | gap-fill | ___ she wear boots? — Yes, she ___. [en, 2 blank(s)] | Does \| does (full) | — | — | — | — | true |
| g1u08.gi.present-simple-questions.gf.003 | gap-fill | ___ he ___ (like) pizza? — No, he ___. [en, 3 blank(s)] | Does \| like \| doesn't (full) ; Does \| like \| does not (full) | — | — | — | — | true |
| g1u08.gi.present-simple-questions.gf.004 | gap-fill | ___ they ___ (wear) shoes? — Yes, they ___. [en, 3 blank(s)] | Do \| wear \| do (full) | — | — | — | — | true |
| g1u08.gi.present-simple-questions.gf.005 | gap-fill | ___ your sister ___ (wear) a skirt? — No, she ___. She ___ (wear) trousers. [en, 4 blank(s)] | Does \| wear \| doesn't \| wears (full) ; Does \| wear \| does not \| wears (full) | — | — | — | — | true |
| g1u08.gi.present-simple-questions.gf.006 | gap-fill | What ___ is your sweater? — ___ red. [en, 2 blank(s)] | colour \| It's (full) ; colour \| It is (full) | — | — | — | — | false |
| g1u08.gi.present-simple-questions.gf.007 | gap-fill | What colour ___ your boots? — ___ grey. [en, 2 blank(s)] | are \| They're (full) ; are \| They are (full) | — | — | — | — | true |
| g1u08.gi.present-simple-questions.gs.001 | group-sort | Sortiere: gehört Do oder Does an den Anfang? [de] | — | — | — | — | Do: ___ you wear a cap?\|Do you wear a cap?, ___ they like dogs?\|Do they like dogs?, ___ we wear shoes?\|Do we wear shoes?, ___ I wear a hat?\|Do I wear a hat? \| Does: ___ she wear a skirt?\|Does she wear a skirt?, ___ he like pizza?\|Does he like pizza?, ___ it fit?\|Does it fit? | true |
| g1u08.gi.present-simple-questions.mc.001 | multiple-choice | Welcher Satz ist richtig? [de] | Does she wear a skirt? (full) | — | Does she wears a skirt? ; Do she wear a skirt? ; Is she wear a skirt? | — | — | true |
| g1u08.gi.present-simple-questions.mc.002 | multiple-choice | Welche Antwort passt? — Do they like dogs? [de] | Yes, they do. (full) | — | Yes, they does. ; Yes, they like. ; Yes, they are. | — | — | true |
| g1u08.gi.present-simple-questions.mc.003 | multiple-choice | Welche Antwort passt? — Does he like chocolate? [de] | No, he doesn't. (full) | — | No, he don't. ; No, he doesn't like. ; No, he isn't. | — | — | true |
| g1u08.gi.present-simple-questions.mp.001 | matching-pairs | Ordne zu: Do oder Does? [de] | — | — | — | he ↔ Does he … ? ; you ↔ Do you … ? ; she ↔ Does she … ? ; they ↔ Do they … ? ; it ↔ Does it … ? ; we ↔ Do we … ? | — | true |
| g1u08.gi.present-simple-questions.mt.001 | matching | Ordne zu, was zusammenpasst. [de] | — | — | — | Do you like dogs? ↔ Yes, I do. ; Does he wear a cap? ↔ No, he doesn't. ; Do they wear boots? ↔ Yes, they do. ; Does she like pizza? ↔ No, she doesn't. | — | false |
| g1u08.gi.present-simple-questions.qf.001 | question-formation | Debbie likes the trainers. Ask if this is true. [en] | Does Debbie like the trainers? (full) ; Does she like the trainers? (full) | — | — | — | — | true |
| g1u08.gi.present-simple-questions.sb.001 | sentence-building | she / wear / Does / boots / ? [en] | Does she wear boots? (full) | — | — | — | — | true |
| g1u08.gi.present-simple-questions.sb.002 | sentence-building | you / a / Do / hoodie / wear / ? [en] | Do you wear a hoodie? (full) | — | — | — | — | true |
| g1u08.gi.present-simple-questions.tf.001 | transformation | She wears trainers. (?) [en] | Does she wear trainers? (full) | — | — | — | — | true |
| g1u08.gi.present-simple-questions.tf.002 | transformation | You like pizza. (?) [en] | Do you like pizza? (full) | — | — | — | — | true |
| g1u08.gi.present-simple-questions.tr.001 | translation | Magst du Pizza? [de] | Do you like pizza? (full) | deToEn | — | — | — | false |
| g1u08.gi.present-simple-questions.tr.002 | translation | Trägt sie eine Jacke? [de] | Does she wear a jacket? (full) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g1-u08/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u08",
  "lens": "answers",
  "itemsHash": "b0e8cce66c97",
  "promptHash": "70fa2d8cdf22",
  "round": 1,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 57, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
