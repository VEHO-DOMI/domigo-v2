# Verify lens — answers — g2-u02 (round 2)

<!-- domigo:verify answers g2-u02 items=0316b35dcf62 prompt=70fa2d8cdf22 round=2 -->

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

## Vocab items (36)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g2u02.w.admission-fee | admission fee | The money you pay to go into a place. | The ___ to the museum is five pounds for adults. | admission fee (full) ; admission fees (partial) | admission fee (full) | museum ; sculpture ; exhibition |
| g2u02.w.anyone | anyone | Any man, woman, or child at all. | Don't tell your password to ___. | anyone (full) ; anybody (partial) | anyone (full) ; anybody (partial) | password ; secret ; behaviour |
| g2u02.w.artist | artist | Somebody who makes beautiful pictures or music. | He made this beautiful painting. He's a great ___. | artist (full) ; artists (partial) | artist (full) ; an artist (full) | museum ; exhibition ; sculpture |
| g2u02.w.awesome | awesome | Really great and amazing. | The new computer game is ___! I really like it. | awesome (full) | awesome (full) | boring ; confusing ; difficult |
| g2u02.w.behaviour | behaviour | How good or bad somebody is to people. | There is a lot of bad ___ on the web. | behaviour (full) ; behavior (partial) | behaviour (full) ; behavior (partial) | secret ; password ; mess |
| g2u02.w.boring | boring | Not fun at all. It makes you tired and you want to do something else. | This show is very ___. I don't want to watch it any more. | boring (full) | boring (full) | exciting ; awesome ; funny |
| g2u02.w.confusing | confusing | Hard to understand, so you do not know what is what. | I don't understand this exercise. It's very ___. | confusing (full) | confusing (full) | exciting ; funny ; awesome |
| g2u02.w.difficult | difficult | Not easy to do or to understand. | This homework is very ___. I can't do it. | difficult (full) | difficult (full) | modern ; dirty ; possible |
| g2u02.w.dirty | dirty | Not clean at all. | My shoes are very ___ because I played in the garden. | dirty (full) | dirty (full) | modern ; possible ; funny |
| g2u02.w.embarrassed | embarrassed | When you are not happy because you did a funny thing and people looked at you. | I was so ___ when I made a big mess in front of the class. | embarrassed (full) | embarrassed (full) | upset ; boring ; dirty |
| g2u02.w.exciting | exciting | Making you very happy, so you can't wait for it. | Going to the zoo for the first time was really ___! | exciting (full) | exciting (full) | boring ; confusing ; dirty |
| g2u02.w.exhibition | exhibition | A place where people show their art for you to look at. | There is a new art ___ at the museum. | exhibition (full) ; exhibitions (partial) | exhibition (full) ; an exhibition (full) | museum ; artist ; sculpture |
| g2u02.w.funny | funny | Making you want to laugh. | The clown was very ___. We all laughed. | funny (full) ; funnier (partial) ; funniest (partial) | funny (full) | boring ; confusing ; dirty |
| g2u02.w.i-promise | I promise. | You tell somebody this so they know you are going to do a thing for them. | I'll help you with your homework tomorrow. ___ | I promise. (full) ; I promise (full) | I promise. (full) ; I promise (full) | What's the matter? ; secret ; tip |
| g2u02.w.mess | mess | When a room is not clean and nothing is where it should be. | My room is a big ___. I need to clean it. | mess (full) | mess (full) ; a mess (full) | secret ; tip ; password |
| g2u02.w.modern | modern | New and from the time we live in now. | Their new school is very ___, with big windows and a garden. | modern (full) | modern (full) | dirty ; funny ; boring |
| g2u02.w.museum | museum | A big building where you go to look at art and beautiful pictures. | We can look at art and beautiful pictures at the ___. | museum (full) ; museums (partial) | museum (full) ; a museum (full) | exhibition ; artist ; sculpture |
| g2u02.w.password | password | A secret that you need so people cannot go into your account. | Never tell your ___ to anyone. | password (full) ; passwords (partial) | password (full) ; a password (full) | secret ; behaviour ; mess |
| g2u02.w.plate | plate | A thing that you put your food on when you eat. | Put the pasta on the ___ and eat it. | plate (full) ; plates (partial) | plate (full) ; a plate (full) | secret ; mess ; tip |
| g2u02.w.possible | possible | A thing that can happen or that you can do. | I can't do all this homework. It's not ___. | possible (full) | possible (full) | difficult ; modern ; dirty |
| g2u02.w.posting | posting | A picture or a story that you put on the web for people to look at. | Many people can look at your ___, so be careful what you put online. | posting (full) ; postings (partial) | posting (full) ; a posting (full) | password ; secret ; tip |
| g2u02.w.sculpture | sculpture | Art that an artist makes from stone for people to look at. | There is a big stone ___ of a horse in the park. | sculpture (full) ; sculptures (partial) | sculpture (full) ; a sculpture (full) | museum ; exhibition ; artist |
| g2u02.w.secret | secret | A thing that you do not tell other people. | Don't tell anyone. It's a ___. | secret (full) ; secrets (partial) | secret (full) ; a secret (full) | mess ; tip ; password |
| g2u02.w.such | such | You put this before 'a' to make 'a good day' into 'a very good day'. | It was ___ a good day. We were all very happy. | such (full) | such (full) | possible ; difficult ; modern |
| g2u02.w.surprise-party | surprise party | A big fun day that friends make for you when you do not know about it before. | My friends made a ___ for me, and I did not know about it. | surprise party (full) ; surprise parties (partial) | surprise party (full) | exhibition ; admission fee ; sculpture |
| g2u02.w.tip | tip | A good thing somebody shows you to help you do well. | Here is a good ___ to help you do well at school. | tip (full) ; tips (partial) | tip (full) ; a tip (full) | secret ; mess ; password |
| g2u02.w.to-add | to add | To put more to a thing that you have. | You can ___ more sugar to your tea. | add (full) | add (full) ; to add (full) | to contact ; to organise ; to pass on |
| g2u02.w.to-be-part-of | to be part of | To be inside a bigger thing and not alone. | The jacket was ___ a big sculpture. | part of (full) | part of (full) ; be part of (full) ; to be part of (full) | to be worth ; to add ; to contact |
| g2u02.w.to-be-worth | to be worth | To have a price, like a lot of money. | This painting is ___ a lot of money. | worth (full) | worth (full) ; be worth (full) ; to be worth (full) | to be part of ; to add ; to post |
| g2u02.w.to-contact | to contact | To call or write to somebody. | Please ___ me if you need help. | contact (full) | contact (full) ; to contact (full) | to pass on ; to add ; to organise |
| g2u02.w.to-fail | to fail | To not do well at school. | I studied very much because I didn't want to ___ at school. | fail (full) | fail (full) ; to fail (full) | to add ; to contact ; to organise |
| g2u02.w.to-organise | to organise | To make a fun day happen and do all the work for it. | We want to ___ a surprise party for our teacher. | organise (full) ; organize (partial) | organise (full) ; to organise (full) ; organize (partial) | to add ; to contact ; to post |
| g2u02.w.to-pass-on | to pass on | To give a thing or a letter to a friend. | Can you ___ this letter to your mum for me? | pass on (full) | pass on (full) ; to pass on (full) | to contact ; to add ; to organise |
| g2u02.w.to-post | to post | To put a picture or a story on the web for people to look at. | Think before you ___ a picture for everybody to look at. | post (full) | post (full) ; to post (full) | to add ; to contact ; to organise |
| g2u02.w.upset | upset | When you are sad and angry because a bad thing happened. | The little girl was ___ because she had a bad day. | upset (full) | upset (full) | embarrassed ; funny ; modern |
| g2u02.w.what-s-the-matter | What's the matter? | You ask this when somebody looks sad or upset. | You look sad. ___ You look upset. | What's the matter? (full) ; What's the matter (full) ; What is the matter? (full) ; Whats the matter? (partial) | What's the matter? (full) ; What is the matter? (full) | I promise. ; secret ; behaviour |

## Grammar items (60)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g2u02.gi.irregular-verbs.ag.001 | anagram | buy (gestern) [de] | bought (full) | — | — | — | — | false |
| g2u02.gi.irregular-verbs.ag.002 | anagram | know (gestern) [de] | knew (full) | — | — | — | — | false |
| g2u02.gi.irregular-verbs.cp.001 | context-picker | Last week your class made a big poster. You tell a friend. [en] | We made a big poster for the project. (full) | — | We make a big poster for the project. ; We makes a big poster for the project. ; We bought a big poster for the project. | — | — | false |
| g2u02.gi.irregular-verbs.ec.001 | error-correction | She buy new trainers for PE last week. [en] | She bought new trainers for PE last week. (full) ; She bought new trainers for PE last week (full) ; bought (partial) | — | — | — | — | false |
| g2u02.gi.irregular-verbs.ec.002 | error-correction | I didn't knew the password. [en] | I didn't know the password. (full) ; I didn't know the password (full) ; know (partial) | — | — | — | — | false |
| g2u02.gi.irregular-verbs.ec.003 | error-correction | Tom writed a really funny story in English class. [en] | Tom wrote a really funny story in English class. (full) ; Tom wrote a really funny story in English class (full) ; wrote (partial) | — | — | — | — | false |
| g2u02.gi.irregular-verbs.gf.001 | gap-fill | We ___ (buy) a big box of chocolates for Mr Harris. [en, 1 blank(s)] | bought (full) | — | — | — | — | false |
| g2u02.gi.irregular-verbs.gf.002 | gap-fill | Alan ___ (write) to all his friends in the class. [en, 1 blank(s)] | wrote (full) | — | — | — | — | false |
| g2u02.gi.irregular-verbs.gf.003 | gap-fill | He ___ (know) it was a secret. [en, 1 blank(s)] | knew (full) | — | — | — | — | false |
| g2u02.gi.irregular-verbs.gf.004 | gap-fill | Mrs Wu and Mei ___ (make) a big cake on Sunday. [en, 1 blank(s)] | made (full) | — | — | — | — | false |
| g2u02.gi.irregular-verbs.gf.005 | gap-fill | My friends ___ (buy) sweets and we ___ (make) a cake. [en, 2 blank(s)] | bought \| made (full) | — | — | — | — | false |
| g2u02.gi.irregular-verbs.gf.006 | gap-fill | He didn't ___ (know) where the museum was. [en, 1 blank(s)] | know (full) | — | — | — | — | false |
| g2u02.gi.irregular-verbs.gf.007 | gap-fill | We didn't ___ (buy) anything at the exhibition. [en, 1 blank(s)] | buy (full) | — | — | — | — | false |
| g2u02.gi.irregular-verbs.gs.001 | group-sort | play → played [en] | — | — | — | — | clean → cleaned: visit, open, cook, want \| buy → bought: make, write, know, buy | false |
| g2u02.gi.irregular-verbs.mc.001 | multiple-choice | Yesterday my mum ___ a new jacket. [en, 1 blank(s)] | bought (full) | — | buy ; knew ; wrote | — | — | false |
| g2u02.gi.irregular-verbs.mc.002 | multiple-choice | She ___ a long letter to her grandmother last week. [en, 1 blank(s)] | wrote (full) | — | write ; writes ; made | — | — | false |
| g2u02.gi.irregular-verbs.mc.003 | multiple-choice | Mrs Wu ___ a big cake for the children yesterday. [en, 1 blank(s)] | made (full) | — | make ; makes ; wrote | — | — | false |
| g2u02.gi.irregular-verbs.mc.004 | multiple-choice | I didn't ___ any chocolates for him. [en, 1 blank(s)] | buy (full) | — | bought ; made ; wrote | — | — | false |
| g2u02.gi.irregular-verbs.mt.001 | matching | buy, know, make, write [en] | — | — | — | buy ↔ bought ; know ↔ knew ; make ↔ made ; write ↔ wrote | — | false |
| g2u02.gi.irregular-verbs.sb.001 | sentence-building | wrote / she / a / long / letter / yesterday [en] | She wrote a long letter yesterday. (full) ; She wrote a long letter yesterday (full) ; Yesterday she wrote a long letter. (full) ; Yesterday she wrote a long letter (full) | — | — | — | — | false |
| g2u02.gi.irregular-verbs.tf.001 | transformation | I buy a present for the teacher. (yesterday) [en] | I bought a present for the teacher yesterday. (full) ; I bought a present for the teacher yesterday (full) ; Yesterday I bought a present for the teacher. (full) ; Yesterday I bought a present for the teacher (full) | — | — | — | — | false |
| g2u02.gi.irregular-verbs.tf.002 | transformation | Alan writes to his friends. (last night) [en] | Alan wrote to his friends last night. (full) ; Alan wrote to his friends last night (full) ; Last night Alan wrote to his friends. (full) ; Last night Alan wrote to his friends (full) | — | — | — | — | false |
| g2u02.gi.irregular-verbs.tr.001 | translation | Ich habe gestern ein Buch gekauft. [de] | I bought a book yesterday. (full) ; I bought a book yesterday (full) ; Yesterday I bought a book. (full) ; Yesterday I bought a book (full) ; I bought a new book yesterday. (partial) ; I bought a new book yesterday (partial) | deToEn | — | — | — | false |
| g2u02.gi.irregular-verbs.tr.002 | translation | Er hat keinen Kuchen gemacht. [de] | He didn't make a cake. (full) ; He didn't make a cake (full) ; He did not make a cake. (full) ; He did not make a cake (full) | deToEn | — | — | — | false |
| g2u02.gi.past-simple-negation.ec.001 | error-correction | I didn't listened to a thing. [en] | I didn't listen to a thing. (full) ; I didn't listen to a thing (full) ; listen (partial) | — | — | — | — | false |
| g2u02.gi.past-simple-negation.ec.002 | error-correction | The jacket didn't was on the screen. [en] | The jacket wasn't on the screen. (full) ; The jacket wasn't on the screen (full) ; wasn't (partial) | — | — | — | — | false |
| g2u02.gi.past-simple-negation.gf.001 | gap-fill | I ___ listen to the lesson. I was bored. [en, 1 blank(s)] | didn't (full) | — | — | — | — | true |
| g2u02.gi.past-simple-negation.gf.002 | gap-fill | The sculpture ___ dirty. [en, 1 blank(s)] | wasn't (full) | — | — | — | — | true |
| g2u02.gi.past-simple-negation.gs.001 | group-sort | didn't or wasn't / weren't? [en] | — | — | — | — | didn't: I ___ buy a present., We ___ make a cake., She ___ read the story. \| wasn't / weren't: The museum ___ open., The children ___ happy. | false |
| g2u02.gi.past-simple-negation.mc.001 | multiple-choice | We ___ make a cake — we had no time. [en, 1 blank(s)] | didn't (full) | — | wasn't ; weren't ; don't | — | — | false |
| g2u02.gi.past-simple-negation.tf.001 | transformation | Paul cleaned his room today. (not) [en] | Paul didn't clean his room today. (full) ; Paul didn't clean his room today (full) ; Paul did not clean his room today. (full) ; Paul did not clean his room today (full) | — | — | — | — | false |
| g2u02.gi.past-simple-negation.tr.001 | translation | Sie hat den Brief nicht gelesen. [de] | She didn't read the letter. (full) ; She didn't read the letter (full) ; She did not read the letter. (full) ; She did not read the letter (full) | deToEn | — | — | — | false |
| g2u02.gi.past-simple-questions.cp.001 | context-picker | Your friend talks about Saturday. You ask about Tom. [en] | Did Tom play football on Saturday? (full) | — | Did Tom played football on Saturday? ; Was Tom play football on Saturday? ; Tom did play football on Saturday? | — | — | false |
| g2u02.gi.past-simple-questions.ec.001 | error-correction | Did you bought a present last Friday? [en] | Did you buy a present last Friday? (full) ; Did you buy a present last Friday (full) ; buy (partial) | — | — | — | — | false |
| g2u02.gi.past-simple-questions.ec.002 | error-correction | Did he was tired after the match? [en] | Was he tired after the match? (full) ; Was he tired after the match (full) ; Was he (partial) | — | — | — | — | false |
| g2u02.gi.past-simple-questions.ec.003 | error-correction | You liked the new teacher? [en] | Did you like the new teacher? (full) ; Did you like the new teacher (full) ; Did you like (partial) | — | — | — | — | false |
| g2u02.gi.past-simple-questions.ff.001 | free-form | You want to ask a friend about yesterday. [en] | Did you have a good day yesterday? (full) ; Did you watch TV yesterday? (full) ; Did you do your homework yesterday? (partial) | — | — | — | — | false |
| g2u02.gi.past-simple-questions.gf.001 | gap-fill | ___ you enjoy the school project? — Yes, I did. [en, 1 blank(s)] | Did (full) | — | — | — | — | false |
| g2u02.gi.past-simple-questions.gf.002 | gap-fill | ___ Chloe embarrassed at the table? [en, 1 blank(s)] | Was (full) | — | — | — | — | false |
| g2u02.gi.past-simple-questions.gf.003 | gap-fill | Did Mei ___ (eat) the cake last night? [en, 1 blank(s)] | eat (full) | — | — | — | — | false |
| g2u02.gi.past-simple-questions.gf.004 | gap-fill | ___ the children happy at the museum? [en, 1 blank(s)] | Were (full) | — | — | — | — | false |
| g2u02.gi.past-simple-questions.gf.005 | gap-fill | Where ___ you on Sunday? — I was at my grandmother's. [en, 1 blank(s)] | were (full) | — | — | — | — | false |
| g2u02.gi.past-simple-questions.mc.001 | multiple-choice | About yesterday: [en] | Did she visit her friend yesterday? (full) | — | Did she visited her friend yesterday? ; Was she visit her friend yesterday? ; She did visit her friend yesterday? | — | — | false |
| g2u02.gi.past-simple-questions.mc.002 | multiple-choice | You ask about the story. [en] | Was the story good? (full) | — | Did the story was good? ; Did the story good? ; Were the story good? | — | — | false |
| g2u02.gi.past-simple-questions.mc.003 | multiple-choice | Were you and Emma at the park? — No, ___. [en, 1 blank(s)] | we weren't (full) | — | we didn't ; we wasn't ; we aren't | — | — | false |
| g2u02.gi.past-simple-questions.mt.001 | matching | About the weekend [en] | — | — | — | Did you play in the garden? ↔ Yes, I did. ; Did Chloe eat her cake? ↔ No, she didn't. ; Was Jacob upset? ↔ Yes, he was. ; Were the children happy? ↔ No, they weren't. | — | false |
| g2u02.gi.past-simple-questions.qf.001 | question-formation | you / have / a good day / at school [en] | Did you have a good day at school? (full) ; Did you have a good day at school (full) | — | — | — | — | false |
| g2u02.gi.past-simple-questions.qf.002 | question-formation | where / you / go / on Saturday [en] | Where did you go on Saturday? (full) ; Where did you go on Saturday (full) | — | — | — | — | false |
| g2u02.gi.past-simple-questions.sb.001 | sentence-building | what / did / you / have / for lunch / ? [en] | What did you have for lunch? (full) ; What did you have for lunch (full) | — | — | — | — | false |
| g2u02.gi.past-simple-questions.tf.001 | transformation | You visited the exhibition. (?) [en] | Did you visit the exhibition? (full) ; Did you visit the exhibition (full) | — | — | — | — | false |
| g2u02.gi.past-simple-questions.tf.002 | transformation | The museum was open. (?) [en] | Was the museum open? (full) ; Was the museum open (full) | — | — | — | — | false |
| g2u02.gi.past-simple-questions.tr.001 | translation | Hast du die Geschichte gelesen? [de] | Did you read the story? (full) ; Did you read the story (full) | deToEn | — | — | — | false |
| g2u02.gi.past-simple-questions.tr.002 | translation | War Tom gestern krank? [de] | Was Tom ill yesterday? (full) ; Was Tom ill yesterday (full) | deToEn | — | — | — | false |
| g2u02.gi.why-because.ec.001 | error-correction | Because art great is. [en] | Because art is great. (full) ; Because art is great (full) ; art is great (partial) | — | — | — | — | false |
| g2u02.gi.why-because.gf.001 | gap-fill | ___ are you upset? — Because the museum was closed. [en, 1 blank(s)] | Why (full) | — | — | — | — | false |
| g2u02.gi.why-because.gf.002 | gap-fill | Why do you like art? — ___ it is great. [en, 1 blank(s)] | Because (full) | — | — | — | — | false |
| g2u02.gi.why-because.mc.001 | multiple-choice | ___ is the garden a mess? — Because there were lots of people there. [en, 1 blank(s)] | Why (full) | — | Because ; What ; Where | — | — | false |
| g2u02.gi.why-because.mt.001 | matching | Why and because [en] | — | — | — | Why are you upset? ↔ Because the museum was closed. ; Why was Jacob happy? ↔ Because a neighbour called the police. ; Why is the garden a mess? ↔ Because there were lots of people there. ; Why do you like art? ↔ Because it is great. | — | false |
| g2u02.gi.why-because.sb.001 | sentence-building | because / I / this one / don't / like [en] | Because I don't like this one. (full) ; Because I don't like this one (full) | — | — | — | — | false |
| g2u02.gi.why-because.tr.001 | translation | Warum bist du so glücklich? — Weil ich einen Hund habe. [de] | Why are you so happy? — Because I have a dog. (full) ; Why are you so happy? Because I have a dog. (full) ; Why are you so happy? — Because I have got a dog. (partial) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g2-u02/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u02",
  "lens": "answers",
  "itemsHash": "0316b35dcf62",
  "promptHash": "70fa2d8cdf22",
  "round": 2,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 96, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
