# Verify lens — answers — g2-u15 (round 1)

<!-- domigo:verify answers g2-u15 items=cd275e120ce2 prompt=70fa2d8cdf22 round=1 -->

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

## Vocab items (24)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g2u15.w.antarctic-ocean | Antarctic Ocean | the cold sea in the south where penguins live and eat | Penguins eat fish that live in the cold ___ Ocean. | Antarctic (full) | Antarctic Ocean (full) ; the Antarctic Ocean (full) | emperor penguin ; sand ; cage |
| g2u15.w.cage | cage | a metal home where you keep a small animal | The mouse runs about in its ___ all night. | cage (full) ; cages (partial) | cage (full) ; a cage (full) | litter tray ; sand ; space |
| g2u15.w.emperor-penguin | emperor penguin | a big black and white animal in the cold Antarctic Ocean | The ___ is the biggest penguin of all and it lives where it is very cold. | emperor penguin (full) ; emperor penguins (partial) | emperor penguin (full) ; an emperor penguin (full) | Antarctic Ocean ; sand ; vet |
| g2u15.w.litter-tray | litter tray | the box of sand where a cat does its toilet | Every day I clean out the dirty ___ so my cat has a clean toilet. | litter tray (full) ; litter trays (partial) | litter tray (full) ; a litter tray (full) | cage ; sand ; space |
| g2u15.w.neither-do-i | Neither do I. | this is what you tell a friend when you also do not like a thing they do not like | I do not like getting up early at all. — ___ I also hate it. | Neither do I. (full) ; Neither do I (full) | Neither do I. (full) ; Neither do I (full) | So do I. ; to stroke ; to release |
| g2u15.w.pyjamas | pyjamas | the clothes you put on in bed at night | He wears striped ___ in bed. | pyjamas (full) ; pajamas (partial) | pyjamas (full) ; pajamas (partial) | cage ; sand ; litter tray |
| g2u15.w.sand | sand | tiny pieces of rock you find at the beach or in the desert | We can play in the ___ on the beach all day. | sand (full) | sand (full) | cage ; space ; litter tray |
| g2u15.w.so-do-i | So do I. | this is what you tell a friend when you also like a thing they like | I love pizza! — ___ It is my favourite food too. | So do I. (full) ; So do I (full) | So do I. (full) ; So do I (full) | Neither do I. ; to stroke ; to release |
| g2u15.w.space | space | free room where a big dog can be and run | We do not have a big home, so there is no ___ for a dog. | space (full) | space (full) | cage ; sand ; vet |
| g2u15.w.to-brush | to brush | you do this to the fur so it looks nice and tidy | I ___ my dog every morning so its fur looks nice and tidy. | brush (full) ; brushes (partial) ; brushed (partial) | brush (full) ; to brush (full) | to stroke ; to feed your pet ; to walk your pet |
| g2u15.w.to-clean-out-the-litter-tray | to clean out the litter tray | to put the dirty sand out of the box where a cat does its toilet | I have to ___ every day so it does not smell bad. | clean out the litter tray (full) ; clean out the litter tray (full) ; clean the litter tray (partial) ; cleaned out the litter tray (partial) | clean out the litter tray (full) ; to clean out the litter tray (full) ; clean out the litter tray (full) | to clean out your pet's cage ; to tidy ; to dry your pet |
| g2u15.w.to-clean-out-your-pet-s-cage | to clean out your pet's cage | to make the home of a small animal nice and tidy | Every week I have to ___ so it does not look dirty. | clean out your pet's cage (full) ; clean out my pet's cage (full) ; clean out the cage (partial) ; cleaned out the cage (partial) | clean out your pet's cage (full) ; to clean out your pet's cage (full) ; clean out my pet's cage (full) | to clean out the litter tray ; to tidy ; to give your pet a bath |
| g2u15.w.to-dry-your-pet | to dry your pet | to make a wet animal not wet any more | After the bath I ___ so it is not wet any more. | dry your pet (full) ; dry my pet (full) ; dry my dog (full) ; dry the dog (partial) | dry your pet (full) ; to dry your pet (full) ; dry my pet (full) | to give your pet a bath ; to brush ; to feed your pet |
| g2u15.w.to-feed-your-pet | to feed your pet | to give food to the animal you keep at home | Every morning I ___ before I go to school. | feed your pet (full) ; feed my pet (full) ; feed my dog (full) ; feed the dog (partial) ; feed her (partial) | feed your pet (full) ; to feed your pet (full) ; feed my pet (full) ; feed (partial) | to walk your pet ; to give your pet a bath ; to brush |
| g2u15.w.to-give-your-pet-a-bath | to give your pet a bath | to wash your dirty animal so it is clean again | The dog is dirty so it is time to ___. | give your pet a bath (full) ; give my pet a bath (full) ; give my dog a bath (full) ; give the dog a bath (partial) | give your pet a bath (full) ; to give your pet a bath (full) ; give my pet a bath (full) | to dry your pet ; to brush ; to feed your pet |
| g2u15.w.to-have-got-a-fear-of | to have got a fear of | to be very scared of a thing so you do not want to go near it | My sister has got a big ___ of dogs, she is very scared of them. | fear (full) | have got a fear of (full) ; has got a fear of (full) ; to have got a fear of (full) ; have a fear of (partial) | to keep sb. company ; to release ; to stroke |
| g2u15.w.to-keep-sb-company | to keep sb. company | to stay with somebody so they are not alone | My dog stays next to me and ___ me so I am not alone. | keeps me company (full) ; keep me company (partial) ; kept me company (partial) | keep sb. company (full) ; keep somebody company (full) ; to keep sb. company (full) ; keep me company (full) | to have got a fear of ; to release ; to tidy |
| g2u15.w.to-play-with-your-pet | to play with your pet | to have fun with your animal | After school I always ___ in the garden. | play with your pet (full) ; play with my pet (full) ; play with my dog (full) ; play with the dog (partial) | play with your pet (full) ; to play with your pet (full) ; play with my pet (full) | to walk your pet ; to stroke ; to feed your pet |
| g2u15.w.to-release | to release | to make an animal free so it can go back to the wild | After some months they ___ it back into the wild. | released (full) ; release (partial) | release (full) ; to release (full) ; released (full) | to stroke ; to brush ; to tidy |
| g2u15.w.to-stroke | to stroke | to touch an animal's fur in a loving way again and again | My dog loves it when I ___ its fur. | stroke (full) ; strokes (partial) ; stroked (partial) | stroke (full) ; to stroke (full) | to brush ; to feed your pet ; to walk your pet |
| g2u15.w.to-take-your-pet-to-the-vet | to take your pet to the vet | to bring your sick animal to the animal doctor for help | Our dog is sick so we have to ___ today. | take your pet to the vet (full) ; take my pet to the vet (full) ; take my dog to the vet (full) ; take him to the vet (partial) | take your pet to the vet (full) ; to take your pet to the vet (full) ; take my pet to the vet (full) | to give your pet a bath ; to feed your pet ; to walk your pet |
| g2u15.w.to-tidy | to tidy (up) | to put everything in its place so a room looks clean and nice | Please ___ up your messy room before your friends come over. | tidy (full) ; tidies (partial) ; tidied (partial) | tidy (full) ; tidy up (full) ; to tidy (full) ; to tidy up (full) | to release ; to brush ; to stroke |
| g2u15.w.to-walk-your-pet | to walk your pet | to go outside with your animal so it can run and play | Every day I ___ in the park before school. | walk your pet (full) ; walk my pet (full) ; walk my dog (full) ; walk the dog (partial) | walk your pet (full) ; to walk your pet (full) ; walk my dog (full) | to feed your pet ; to play with your pet ; to brush |
| g2u15.w.vet | vet (veterinarian) | the doctor you go to when your animal is sick | When a dog is ill you go to the animal doctor we call a ___. | vet (full) ; veterinarian (full) ; vets (partial) | vet (full) ; veterinarian (full) ; a vet (full) | cage ; litter tray ; space |

## Grammar items (35)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g2u15.gi.so-do-i.cp.003 | context-picker | Alice sagt: "I don't like dogs." Bob sieht das genauso. Was sagt Bob? [de] | Neither do I. (full) | — | So do I. ; Neither I do. ; Neither have I. | — | — | true |
| g2u15.gi.so-do-i.cp.004 | context-picker | Alice sagt: "I have got a fear of rats." Bob sieht das genauso. Was sagt Bob? [de] | So have I. (full) | — | So do I. ; So I have. ; Neither have I. | — | — | true |
| g2u15.gi.so-do-i.ec.001 | error-correction | "I love rats." — "So I do." [en] | So do I. (full) ; do I (partial) | — | — | — | — | true |
| g2u15.gi.so-do-i.ec.002 | error-correction | "I can't dance." — "So can I." [en] | Neither can I. (full) ; Neither can I (partial) | — | — | — | — | true |
| g2u15.gi.so-do-i.ec.003 | error-correction | "She has got a fear of dogs." — "So do I." [en] | So have I. (full) ; So have I (partial) | — | — | — | — | true |
| g2u15.gi.so-do-i.ec.004 | error-correction | "I don't want to go to bed." — "So do I." [en] | Neither do I. (full) ; Neither do I (partial) | — | — | — | — | true |
| g2u15.gi.so-do-i.ff.003 | free-form | Dein Freund sagt: "I love my pets." Du siehst das genauso. Antworte zustimmend. [de] | So do I. (full) ; So do I (partial) | — | — | — | — | false |
| g2u15.gi.so-do-i.ff.004 | free-form | Dein Freund sagt: "I don't like rats." Du siehst das genauso. Antworte zustimmend. [de] | Neither do I. (full) ; Neither do I (partial) | — | — | — | — | false |
| g2u15.gi.so-do-i.gf.001 | gap-fill | "I like pizza." — "So ___ I." [en, 1 blank(s)] | do (full) | — | — | — | — | false |
| g2u15.gi.so-do-i.gf.002 | gap-fill | "I love music." — "So do ___." [en, 1 blank(s)] | I (full) | — | — | — | — | false |
| g2u15.gi.so-do-i.gf.003 | gap-fill | "I have got a fear of rats." — "So ___ I." [en, 1 blank(s)] | have (full) | — | — | — | — | false |
| g2u15.gi.so-do-i.gf.004 | gap-fill | "I can cook." — "So ___ I." [en, 1 blank(s)] | can (full) | — | — | — | — | false |
| g2u15.gi.so-do-i.gf.005 | gap-fill | "I don't like spiders." — "Neither ___ I." [en, 1 blank(s)] | do (full) | — | — | — | — | false |
| g2u15.gi.so-do-i.gf.006 | gap-fill | "I can't cook." — "Neither ___ I." [en, 1 blank(s)] | can (full) | — | — | — | — | false |
| g2u15.gi.so-do-i.gf.007 | gap-fill | "Bob doesn't like rats." — "Neither ___ I." [en, 1 blank(s)] | do (full) | — | — | — | — | false |
| g2u15.gi.so-do-i.gf.008 | gap-fill | "She likes music." — "So ___ he." [en, 1 blank(s)] | does (full) | — | — | — | — | false |
| g2u15.gi.so-do-i.gf.009 | gap-fill | "I am tired." — "So ___ I." [en, 1 blank(s)] | am (full) | — | — | — | — | false |
| g2u15.gi.so-do-i.gf.010 | gap-fill | "She has got a fear of dogs." — "So ___ I." [en, 1 blank(s)] | have (full) | — | — | — | — | false |
| g2u15.gi.so-do-i.gs.001 | group-sort | So oder Neither? [de] | — | — | — | — | So ... I.: I love music., I can cook., I have got a fear of rats., I play basketball. \| Neither ... I.: I don't like spiders., I can't cook., I don't want to go to bed., I don't want to go to school. | false |
| g2u15.gi.so-do-i.gs.003 | group-sort | Welche Antwort passt zu jeder Aussage? [de] | — | — | — | — | So do I.: I love dogs., I read a lot of magazines., I like art. \| So have I.: I have got a fear of rats., I have got a fear of spiders. \| So can I.: I can cook., I can dance., I can ride a bike. | false |
| g2u15.gi.so-do-i.mc.001 | multiple-choice | "I love chocolate." — Welche Antwort bedeutet 'Ich auch.'? [de] | So do I. (full) | — | So I do. ; Neither do I. ; So am I. | — | — | true |
| g2u15.gi.so-do-i.mc.002 | multiple-choice | "I have got a fear of dogs." — Welche Antwort stimmt richtig zu? [de] | So have I. (full) | — | So do I. ; So I have. ; Neither have I. | — | — | true |
| g2u15.gi.so-do-i.mc.003 | multiple-choice | "I can't ride a bike." — Welche Antwort stimmt richtig zu? [de] | Neither can I. (full) | — | So can I. ; Neither do I. ; Neither I can. | — | — | true |
| g2u15.gi.so-do-i.mc.004 | multiple-choice | "I don't like dogs." — Welche Antwort stimmt richtig zu? [de] | Neither do I. (full) | — | So do I. ; Neither I do. ; Neither am I. | — | — | true |
| g2u15.gi.so-do-i.mc.005 | multiple-choice | "I don't like spiders." — Welche Antwort stimmt richtig zu? [de] | Neither do I. (full) | — | So do I. ; So I do. ; Neither am I. | — | — | true |
| g2u15.gi.so-do-i.mp.001 | matching-pairs | Aussage und passende Zustimmung [de] | — | — | — | I love dogs. ↔ So do I. ; I can cook. ↔ So can I. ; I have got a fear of rats. ↔ So have I. ; I don't like spiders. ↔ Neither do I. ; I can't cook. ↔ Neither can I. | — | false |
| g2u15.gi.so-do-i.mp.002 | matching-pairs | Aussage und passende Zustimmung [de] | — | — | — | I don't like rats. ↔ Neither do I. ; I can't dance. ↔ Neither can I. ; I love pizza. ↔ So do I. ; I have got a fear of spiders. ↔ So have I. ; She likes music. ↔ So does he. | — | false |
| g2u15.gi.so-do-i.sb.001 | sentence-building | have / I / So [en] | So have I. (full) | — | — | — | — | false |
| g2u15.gi.so-do-i.sb.002 | sentence-building | do / Neither / I [en] | Neither do I. (full) | — | — | — | — | false |
| g2u15.gi.so-do-i.sb.003 | sentence-building | can / So / I [en] | So can I. (full) | — | — | — | — | false |
| g2u15.gi.so-do-i.tf.001 | transformation | "I read a lot of magazines." (du auch — stimme zu mit So ... I) [de] | So do I. (full) ; So do I (partial) | — | — | — | — | false |
| g2u15.gi.so-do-i.tf.002 | transformation | "I can play the guitar." (du auch — stimme zu mit So ... I) [de] | So can I. (full) ; So can I (partial) | — | — | — | — | false |
| g2u15.gi.so-do-i.tf.003 | transformation | "I don't want to tidy my room." (du auch nicht — stimme zu mit Neither ... I) [de] | Neither do I. (full) ; Neither do I (partial) | — | — | — | — | false |
| g2u15.gi.so-do-i.tr.001 | translation | "Ich mag Musik." — "Ich auch." [de] | "I like music." — "So do I." (full) ; I like music. So do I. (full) ; I love music. So do I. (partial) | deToEn | — | — | — | false |
| g2u15.gi.so-do-i.tr.002 | translation | "Ich kann nicht kochen." — "Ich auch nicht." [de] | "I can't cook." — "Neither can I." (full) ; I can't cook. Neither can I. (full) ; I cannot cook. Neither can I. (partial) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g2-u15/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u15",
  "lens": "answers",
  "itemsHash": "cd275e120ce2",
  "promptHash": "70fa2d8cdf22",
  "round": 1,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 59, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
