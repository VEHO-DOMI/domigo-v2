# Verify lens — answers — g4-u11 (round 1)

<!-- domigo:verify answers g4-u11 items=d9ef7a770bad prompt=70fa2d8cdf22 round=1 -->

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
| g4u11.w.answer-the-door | answer the door | To go and open up when a visitor knocks. | There is a knock at the door, so I go to ___. | answer the door (full) ; answer it (partial) | answer the door (full) | clear up ; sort oneself out ; obey |
| g4u11.w.anthology | anthology | Many short stories collected in one book. | Our teacher read us an ___ with many short stories in one book. | anthology (full) ; anthologies (full) | anthology (full) ; anthologies (full) | dictionary ; biography ; screenplay |
| g4u11.w.biography | biography | The true life story of a famous man or woman. | I am reading a ___ of Nelson, and his life story is amazing. | biography (full) ; biographies (full) | biography (full) ; biographies (full) | novel ; anthology ; screenplay |
| g4u11.w.blurb | blurb | A short text on the back cover about a book. | Before I buy a book, I always read the ___ on the back cover first. | blurb (full) ; blurbs (full) | blurb (full) ; blurbs (full) | book review ; trilogy ; biography |
| g4u11.w.book-review | book review | What you write to show if a story is good or not. | Brenda writes a ___ to show if a book is good or not. | book review (full) ; book reviews (full) | book review (full) ; book reviews (full) | blurb ; biography ; dictionary |
| g4u11.w.classics | Classics | Famous old books that people have loved for many years. | Famous old books that people still love to read are called ___. | Classics (full) ; classics (full) | Classics (full) ; classics (full) | Reference ; comic ; screenplay |
| g4u11.w.clear-up | clear up | To make a place clean and put your mess away. | My room is a mess, so I have to ___ before dinner. | clear up (full) | clear up (full) | answer the door ; sort oneself out ; obey |
| g4u11.w.comic | comic | A funny book with lots of pictures and a short story. | He reads a new ___ every week because he loves the funny pictures. | comic (full) ; comics (full) | comic (full) ; comics (full) | dictionary ; biography ; screenplay |
| g4u11.w.dictionary | dictionary | A book where you look up a word you do not know. | You look up the alphabet in a ___ when you read a book. | dictionary (full) ; dictionaries (full) | dictionary (full) ; dictionaries (full) | anthology ; biography ; comic |
| g4u11.w.disappointment | disappointment | A sad feeling when a good thing does not happen. | Not making the school play was a big ___ for him. | disappointment (full) ; disappointments (full) | disappointment (full) ; disappointments (full) | blurb ; trilogy ; millionaire |
| g4u11.w.fairy | fairy | A tiny magic girl with wings in old stories. | In the story, a good ___ with wings gives the children magic help. | fairy (full) ; fairies (full) | fairy (full) ; fairies (full) | millionaire ; trilogy ; blurb |
| g4u11.w.fence | fence | A long wall between two gardens that keeps a dog in. | They put up a high ___ between the two gardens. | fence (full) ; fences (full) | fence (full) ; fences (full) | blurb ; trilogy ; millionaire |
| g4u11.w.fiction | Fiction | Writing that is not true, about people who never lived. | In our library, the ___ books are stories that never really happened. | Fiction (full) ; fiction (full) | Fiction (full) ; fiction (full) | Non-fiction ; Poetry ; biography |
| g4u11.w.goggles | goggles | Glasses that fit close to your eyes so they do not hurt. | I put on my ___ before I jump in, so my eyes do not hurt. | goggles (full) | goggles (full) | kilt ; fence ; blurb |
| g4u11.w.historical-novel | historical novel | An invented story about times long ago. | She loves the past, so a ___ about times long ago is the perfect present. | historical novel (full) ; historical novels (full) | historical novel (full) ; historical novels (full) | biography ; anthology ; screenplay |
| g4u11.w.innocent | innocent | Not bad at all; you have done nothing bad. | The man is completely ___ and has done nothing bad at all. | innocent (full) | innocent (full) | wee ; obey ; prefer |
| g4u11.w.kilt | kilt | A Scottish skirt that men wear. | When we are in Edinburgh, a man in a ___ plays music for us. | kilt (full) ; kilts (full) | kilt (full) ; kilts (full) | goggles ; fence ; fairy |
| g4u11.w.millionaire | millionaire | A very rich man or woman with more money than they need. | He opens a small shop and becomes a very rich ___. | millionaire (full) ; millionaires (full) | millionaire (full) ; millionaires (full) | fairy ; trilogy ; blurb |
| g4u11.w.non-fiction | Non-fiction | Books that are true and not invented. | Books that are true and not invented are called ___. | Non-fiction (full) ; non-fiction (full) | Non-fiction (full) ; non-fiction (full) | Fiction ; Poetry ; novel |
| g4u11.w.novel | novel | A long invented story you can read in a book. | Her favourite ___ is a long invented story she has read three times. | novel (full) ; novels (full) | novel (full) ; novels (full) | biography ; anthology ; dictionary |
| g4u11.w.obey | obey | To do what you are asked and keep the rules. | His dog can ___ many commands now. | obey (full) | obey (full) | prefer ; scratch ; clear up |
| g4u11.w.play | play | A story you put on for people on a stage. | We are putting on a ___ at school, and I am on the stage. | play (full) ; plays (full) | play (full) ; plays (full) | screenplay ; novel ; dictionary |
| g4u11.w.poetry | Poetry | Writing that shows what you feel, like a poem. | She writes ___ and she loves reading her poems to us. | Poetry (full) ; poetry (full) | Poetry (full) ; poetry (full) | Non-fiction ; biography ; dictionary |
| g4u11.w.prefer | prefer | To like one thing best of all. | Do you ___ reading at home or playing outside? | prefer (full) | prefer (full) | obey ; scratch ; clear up |
| g4u11.w.reference | Reference | A book you read to find help, like a dictionary. | A dictionary is a ___ book, one you read to find help. | Reference (full) ; reference (full) | Reference (full) ; reference (full) | Poetry ; Fiction ; novel |
| g4u11.w.reference-2 | reference | A note that points to a song or a book. | There are a lot of ___ to famous songs in this book. | references (full) ; reference (partial) | reference (full) ; references (full) | trilogy ; blurb ; biography |
| g4u11.w.scratch | scratch | To move your fingers over your skin again and again. | When my skin is dry, I want to ___ it with my fingers. | scratch (full) ; scratched (partial) ; scratching (partial) | scratch (full) | obey ; prefer ; clear up |
| g4u11.w.screenplay | screenplay | The text you use to make a cinema story. | Before they make the cinema story, they write the ___ first. | screenplay (full) ; screenplays (full) | screenplay (full) ; screenplays (full) | dictionary ; comic ; anthology |
| g4u11.w.short-story | short story | A small work of fiction, much smaller than a novel. | We had to write a ___ for homework, and mine was about a boy who finds a magic stone. | short story (full) ; short stories (full) | short story (full) ; short stories (full) | novel ; biography ; screenplay |
| g4u11.w.sort-oneself-out | sort oneself out | To organise your life and your home again. | My aunt spends six months in India to ___. | sort herself out (full) ; sort oneself out (full) ; sort yourself out (partial) ; sort himself out (partial) | sort oneself out (full) ; sort herself out (full) | clear up ; answer the door ; obey |
| g4u11.w.spot-of-bother | spot of bother | A small mess that you are in for a short time. | I am in a ___ because I cannot find my key and nobody is home. | spot of bother (full) | spot of bother (full) | kilt ; goggles ; fence |
| g4u11.w.trilogy | trilogy | Three books that go with one big story. | Three books that tell one big story make a ___. | trilogy (full) ; trilogies (full) | trilogy (full) ; trilogies (full) | anthology ; biography ; novel |
| g4u11.w.wee | wee | Very small; tiny (used in Scotland). | He is Scottish, so he calls a small thing a ___ thing. | wee (full) | wee (full) | innocent ; obey ; prefer |

## Grammar items (64)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g4u11.gi.reflexive-pronouns.ag.001 | anagram | Das Wort für "mich selbst" (bei "I"):  [de] | myself (full) | — | — | — | — | false |
| g4u11.gi.reflexive-pronouns.ag.002 | anagram | Das Wort für "sich selbst" bei "they":  [de] | themselves (full) | — | — | — | — | false |
| g4u11.gi.reflexive-pronouns.cp.001 | context-picker | Lena schaut in den Spiegel und betrachtet sich selbst. Welcher Satz passt? [de] | She looked at herself in the mirror. (full) | — | She looked at her in the mirror. ; She looked at each other in the mirror. ; She looked at himself in the mirror. | — | — | false |
| g4u11.gi.reflexive-pronouns.cp.002 | context-picker | Tom und Ben schauen sich gegenseitig an (Tom schaut Ben an und Ben schaut Tom an). Welcher Satz passt? [de] | They looked at each other. (full) | — | They looked at themselves. ; They looked at theirselves. ; They looked at itself. | — | — | false |
| g4u11.gi.reflexive-pronouns.cp.003 | context-picker | Du erzählst auf Englisch, dass dir die Geschichte gefallen hat. Welcher Satz ist richtig? [de] | I enjoyed the story. (full) | — | I enjoyed myself the story. ; I enjoyed me the story. ; I enjoyed ourselves the story. | — | — | false |
| g4u11.gi.reflexive-pronouns.cp.004 | context-picker | Du fragst Lucas auf Englisch, ob er sich als Leser bezeichnen würde. Welcher Satz passt? [de] | Would you call yourself a reader? (full) | — | Would you call you a reader? ; Would you call yourselves a reader? ; Would you call himself a reader? | — | — | false |
| g4u11.gi.reflexive-pronouns.ec.001 | error-correction | He hurt hisself when he fell. [de] | He hurt himself when he fell. (full) ; himself (partial) | — | — | — | — | true |
| g4u11.gi.reflexive-pronouns.ec.002 | error-correction | The children dressed theirselves for school. [de] | The children dressed themselves for school. (full) ; themselves (partial) | — | — | — | — | true |
| g4u11.gi.reflexive-pronouns.ec.003 | error-correction | We really enjoyed us at the beach yesterday. [de] | We really enjoyed ourselves at the beach yesterday. (full) ; ourselves (partial) | — | — | — | — | true |
| g4u11.gi.reflexive-pronouns.ec.004 | error-correction | The children enjoyed themselves the new library. [de] | The children enjoyed the new library. (full) ; The children enjoyed the new library (partial) | — | — | — | — | false |
| g4u11.gi.reflexive-pronouns.ec.005 | error-correction | She hurt himself when she fell. [de] | She hurt herself when she fell. (full) ; herself (partial) | — | — | — | — | true |
| g4u11.gi.reflexive-pronouns.ec.006 | error-correction | I can't remember myself where I put my keys. [de] | I can't remember where I put my keys. (full) ; I cannot remember where I put my keys. (full) | — | — | — | — | false |
| g4u11.gi.reflexive-pronouns.ec.007 | error-correction | I can't concentrate myself when there's loud music. [de] | I can't concentrate when there's loud music. (full) ; I cannot concentrate when there's loud music. (full) | — | — | — | — | false |
| g4u11.gi.reflexive-pronouns.ec.008 | error-correction | Let's make ourself a nice cup of tea. [de] | Let's make ourselves a nice cup of tea. (full) ; ourselves (partial) | — | — | — | — | true |
| g4u11.gi.reflexive-pronouns.gf.001 | gap-fill | Be careful with the knife! Don't cut ___! [de, 1 blank(s)] | yourself (full) | — | — | — | — | false |
| g4u11.gi.reflexive-pronouns.gf.002 | gap-fill | The cat washed ___ after dinner. [de, 1 blank(s)] | itself (full) | — | — | — | — | false |
| g4u11.gi.reflexive-pronouns.gf.003 | gap-fill | I hurt ___ when I fell. [de, 1 blank(s)] | myself (full) | — | — | — | — | false |
| g4u11.gi.reflexive-pronouns.gf.004 | gap-fill | She looked at ___ in the mirror. [de, 1 blank(s)] | herself (full) | — | — | — | — | false |
| g4u11.gi.reflexive-pronouns.gf.005 | gap-fill | He looked at ___ in the mirror. [de, 1 blank(s)] | himself (full) | — | — | — | — | false |
| g4u11.gi.reflexive-pronouns.gf.006 | gap-fill | My little brother is only three, but he can already dress ___. [de, 1 blank(s)] | himself (full) | — | — | — | — | false |
| g4u11.gi.reflexive-pronouns.gf.007 | gap-fill | The children cooked dinner all by ___. [de, 1 blank(s)] | themselves (full) | — | — | — | — | false |
| g4u11.gi.reflexive-pronouns.gf.008 | gap-fill | Would you call ___ a reader, Lucas? [de, 1 blank(s)] | yourself (full) | — | — | — | — | false |
| g4u11.gi.reflexive-pronouns.gf.009 | gap-fill | We suddenly found ___ in front of a nice bookshop. [de, 1 blank(s)] | ourselves (full) | — | — | — | — | false |
| g4u11.gi.reflexive-pronouns.gf.010 | gap-fill | That's a great book review. Did you write it ___? — Of course, I always write the reviews ___. [de, 2 blank(s)] | yourself \| myself (full) | — | — | — | — | false |
| g4u11.gi.reflexive-pronouns.gf.011 | gap-fill | I hope the kids enjoy ___ at camp. [de, 1 blank(s)] | themselves (full) | — | — | — | — | false |
| g4u11.gi.reflexive-pronouns.gf.012 | gap-fill | Let's make ___ a nice cup of tea and read for a bit. [de, 1 blank(s)] | ourselves (full) | — | — | — | — | false |
| g4u11.gi.reflexive-pronouns.gf.013 | gap-fill | I haven't read the novel ___ yet, but Adrian says it's good. [de, 1 blank(s)] | myself (full) | — | — | — | — | false |
| g4u11.gi.reflexive-pronouns.gf.014 | gap-fill | You two read a good book and enjoy ___! [de, 1 blank(s)] | yourselves (full) | — | — | — | — | false |
| g4u11.gi.reflexive-pronouns.gf.015 | gap-fill | She designs all the covers for her books ___. [de, 1 blank(s)] | herself (full) | — | — | — | — | false |
| g4u11.gi.reflexive-pronouns.gf.016 | gap-fill | Don't worry about us — we can look after ___. [de, 1 blank(s)] | ourselves (full) | — | — | — | — | false |
| g4u11.gi.reflexive-pronouns.gf.017 | gap-fill | Late again! You've got ___ into big trouble this time. [de, 1 blank(s)] | yourself (full) | — | — | — | — | false |
| g4u11.gi.reflexive-pronouns.gf.018 | gap-fill | They are free to have fun and enjoy ___. [de, 1 blank(s)] | themselves (full) | — | — | — | — | false |
| g4u11.gi.reflexive-pronouns.gf.019 | gap-fill | My History teacher told me about the book, so I ___ got a copy. [de, 1 blank(s)] | myself (full) | — | — | — | — | false |
| g4u11.gi.reflexive-pronouns.gs.001 | group-sort | myself / himself / herself / ourselves / yourselves / themselves [de] | — | — | — | — | myself, himself, herself …: myself, himself, herself \| ourselves, yourselves, themselves …: ourselves, yourselves, themselves | false |
| g4u11.gi.reflexive-pronouns.gs.003 | group-sort | She hurt herself. / They helped each other. / We enjoyed ourselves. / The friends looked at each other. [de] | — | — | — | — | She hurt herself.: She hurt herself., We enjoyed ourselves. \| They helped each other.: They helped each other., The friends looked at each other. | false |
| g4u11.gi.reflexive-pronouns.mc.001 | multiple-choice | She burnt ___ while cooking dinner. [de, 1 blank(s)] | herself (full) | — | her ; himself ; themselves | — | — | false |
| g4u11.gi.reflexive-pronouns.mc.002 | multiple-choice | I taught ___ to play the guitar. [de, 1 blank(s)] | myself (full) | — | me ; my ; himself | — | — | false |
| g4u11.gi.reflexive-pronouns.mc.003 | multiple-choice | Choose the correct word: 'She painted the picture all by ___.' [de, 1 blank(s)] | herself (full) | — | her ; itself ; themselves | — | — | false |
| g4u11.gi.reflexive-pronouns.mc.004 | multiple-choice | Which English sentence is correct? [de] | The children enjoyed the story. (full) | — | The children enjoyed themselves the story. ; The children enjoyed them the story. ; The children enjoyed itself the story. | — | — | false |
| g4u11.gi.reflexive-pronouns.mc.005 | multiple-choice | Which English sentence uses the word for "sich selbst" correctly? [de] | He hurt himself while playing football. (full) | — | He hurt hisself while playing football. ; She washed himself in the morning. ; We cooked ourself dinner. | — | — | false |
| g4u11.gi.reflexive-pronouns.mc.006 | multiple-choice | Which English sentence does NOT need a word for "sich selbst"? [de] | I feel great today! (full) | — | She hurt herself in the garden. ; We enjoyed ourselves at the beach. ; He cut himself with the knife. | — | — | false |
| g4u11.gi.reflexive-pronouns.mc.007 | multiple-choice | Choose the correct English sentence with "by + sich selbst": [de] | She prefers to travel by herself. (full) | — | She prefers to travel by her. ; She prefers to travel by sheself. ; She prefers to travel by herselves. | — | — | false |
| g4u11.gi.reflexive-pronouns.mc.008 | multiple-choice | Which English sentence is correct? (one artist, talking about her book covers) [de] | She painted every picture herself. (full) | — | She painted every picture themselves. ; She painted every picture by she. ; She painted every picture hisself. | — | — | false |
| g4u11.gi.reflexive-pronouns.mc.009 | multiple-choice | The two friends looked at ___ and smiled. [de, 1 blank(s)] | each other (full) | — | themselves ; theirselves ; itself | — | — | false |
| g4u11.gi.reflexive-pronouns.mc.010 | multiple-choice | Are the twins enjoying ___ at the camp? [de, 1 blank(s)] | themselves (full) | — | theirselves ; himself ; itself | — | — | false |
| g4u11.gi.reflexive-pronouns.mt.001 | matching | Welches Wort für "sich selbst" gehört zu welchem Subjekt? [de] | — | — | — | I ↔ myself ; he ↔ himself ; she ↔ herself ; it ↔ itself ; they ↔ themselves | — | false |
| g4u11.gi.reflexive-pronouns.mt.002 | matching | Welches Wort für "sich selbst" gehört zu welchem Subjekt? [de] | — | — | — | you (one) ↔ yourself ; we ↔ ourselves ; you (two or more) ↔ yourselves ; they ↔ themselves ; he ↔ himself | — | false |
| g4u11.gi.reflexive-pronouns.mt.003 | matching | Verbinde die Satzhälften. [de] | — | — | — | She fell and ↔ hurt herself. ; We read a good book and ↔ enjoyed ourselves. ; He looked in the mirror and ↔ washed himself. ; The children can ↔ look after themselves. ; Be careful or you will ↔ cut yourself. | — | false |
| g4u11.gi.reflexive-pronouns.qf.001 | question-formation | Deine Freundin ist gestern vom Fahrrad gefallen. Frag, ob sie sich verletzt hat. Beginne mit 'Did...' [de] | Did you hurt yourself? (full) ; Did she hurt herself? (partial) | — | — | — | — | false |
| g4u11.gi.reflexive-pronouns.qf.002 | question-formation | Tom taught himself to play the guitar. Frag nach der Person: wer hat es Tom beigebracht? [de] | Who taught Tom to play the guitar? (full) ; Who taught him to play the guitar? (partial) | — | — | — | — | false |
| g4u11.gi.reflexive-pronouns.sb.001 | sentence-building | herself / she / in / the / looked / at / mirror [de] | She looked at herself in the mirror. (full) | — | — | — | — | false |
| g4u11.gi.reflexive-pronouns.sb.002 | sentence-building | themselves / the / enjoyed / children / library / at / the [de] | The children enjoyed themselves at the library. (full) | — | — | — | — | false |
| g4u11.gi.reflexive-pronouns.sb.003 | sentence-building | by / the / review / ourselves / we / wrote / whole [de] | We wrote the whole review by ourselves. (full) | — | — | — | — | false |
| g4u11.gi.reflexive-pronouns.tf.001 | transformation | Dein Freund fragt, ob dir jemand beim Malen geholfen hat. Antworte: 'No, I painted this picture all by ___.' [de, 1 blank(s)] | myself (full) ; No, I painted this picture all by myself. (full) | — | — | — | — | false |
| g4u11.gi.reflexive-pronouns.tf.002 | transformation | Deine Eltern waren gestern Abend nicht da. Erzähl ihnen: 'Don't worry — I cooked dinner ___!' [de, 1 blank(s)] | myself (full) ; Don't worry — I cooked dinner myself! (full) | — | — | — | — | false |
| g4u11.gi.reflexive-pronouns.tf.003 | transformation | Schreib mit 'by + sich selbst' um, sodass es 'allein' bedeutet: 'My little sister cleaned her room without any help.' → 'My little sister cleaned her room ___.' [de, 1 blank(s)] | by herself (full) ; My little sister cleaned her room by herself. (full) ; all by herself (partial) | — | — | — | — | false |
| g4u11.gi.reflexive-pronouns.tf.004 | transformation | Setze das Wort für "sich selbst" ein, falls nötig. Wenn keines nötig ist, schreib einen Bindestrich (—): 'I need to relax ___ after this week.' [de, 1 blank(s)] | — (full) ; I need to relax after this week. (full) | — | — | — | — | false |
| g4u11.gi.reflexive-pronouns.tf.005 | transformation | Dein Freund schrieb 'they taught theyself'. Verbessere das Wort für "sich selbst": 'They taught ___ to read.' [de, 1 blank(s)] | themselves (full) ; They taught themselves to read. (full) | — | — | — | — | false |
| g4u11.gi.reflexive-pronouns.tf.006 | transformation | Schreib so um, dass es 'allein, ohne Hilfe' bedeutet: 'He reads alone.' → 'He reads ___.' [de, 1 blank(s)] | by himself (full) ; He reads by himself. (full) | — | — | — | — | false |
| g4u11.gi.reflexive-pronouns.tr.001 | translation | Er hat sich beim Fußballspielen verletzt. [de] | He hurt himself while playing football. (full) ; He hurt himself playing football. (full) | deToEn | — | — | — | false |
| g4u11.gi.reflexive-pronouns.tr.002 | translation | Pass auf mit dem Messer! Schneide dich nicht! [de] | Be careful with the knife! Don't cut yourself! (full) ; Be careful with the knife! Don't cut yourself. (full) | deToEn | — | — | — | false |
| g4u11.gi.reflexive-pronouns.tr.003 | translation | Wir haben die Bücher selbst gekauft. [de] | We bought the books ourselves. (full) ; We bought the books by ourselves. (partial) | deToEn | — | — | — | false |
| g4u11.gi.reflexive-pronouns.tr.004 | translation | Ich kann mich nicht an seinen Namen erinnern. [de] | I can't remember his name. (full) ; I cannot remember his name. (full) | deToEn | — | — | — | false |
| g4u11.gi.reflexive-pronouns.tr.005 | translation | Du musst das Buch selbst lesen. [de] | You have to read the book yourself. (full) ; You will have to read the book yourself. (full) ; You must read the book yourself. (partial) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g4-u11/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g4-u11",
  "lens": "answers",
  "itemsHash": "d9ef7a770bad",
  "promptHash": "70fa2d8cdf22",
  "round": 1,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 97, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
