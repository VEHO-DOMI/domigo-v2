# Verify lens — answers — g3-u07 (round 1)

<!-- domigo:verify answers g3-u07 items=4ce24136baf3 prompt=70fa2d8cdf22 round=1 -->

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

## Vocab items (34)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g3u07.w.a-pile-of | a pile of | a high group of books or clothes, one over the one under it | There is ___ dirty clothes in his very messy bedroom. | a pile of (full) ; pile of (partial) | a pile of (full) ; pile of (full) ; a pile (partial) | nowhere ; beloved ; unwell |
| g3u07.w.beloved | beloved | loved very much | My grandma loves her ___ dog more than anything in the world. | beloved (full) | beloved (full) | honest ; jealous ; clumsy |
| g3u07.w.childhood | childhood (no pl) | the time of your life when you are a child | My happiest ___ memory is of summer days at the lake when I was seven. | childhood (full) | childhood (full) | relationship ; questionnaire ; earring |
| g3u07.w.clumsy | clumsy | often dropping a glass and knocking into the door | He is so ___ that he often drops his pen and books. | clumsy (full) | clumsy (full) | honest ; jealous ; unwell |
| g3u07.w.earring | earring | a small thing you wear on your ear to look nice | She dropped one of her favourite ___ in the sea while swimming. | earrings (full) ; earring (partial) | earring (full) ; earrings (full) | soft toy ; questionnaire ; script |
| g3u07.w.honest | honest | always telling the truth | She lies all the time and is never ___ with people. | honest (full) | honest (full) | jealous ; clumsy ; unwell |
| g3u07.w.it-s-none-of-my-business | It's none of my business. | a way to tell somebody that a thing is not for you to ask about | Who she talks to at the break is ___, so I will not ask her about it. | none of my business (full) ; my business (partial) | It's none of my business. (full) ; none of my business (full) | to mind your own business ; to get on well with sb. ; to make up with sb. |
| g3u07.w.jealous | jealous | feeling sad because a friend has a thing you want | My best friend has a new friend now, and I feel a little ___. | jealous (full) | jealous (full) | honest ; clumsy ; unwell |
| g3u07.w.nowhere | nowhere | in no place at all | Stallone had no money and ___ to go for the night. | nowhere (full) | nowhere (full) | honest ; clumsy ; unwell |
| g3u07.w.questionnaire | questionnaire | boxes you tick to find out a thing about you | Tick the boxes in this ___ to find out if you are a good friend. | questionnaire (full) | questionnaire (full) ; questionnaires (full) | relationship ; childhood ; script |
| g3u07.w.rash | rash | red spots on your skin that feel hot | She has a red ___ all over her skin. | rash (full) ; rashes (partial) | rash (full) ; rashes (full) | earring ; script ; questionnaire |
| g3u07.w.relationship | relationship | the way you feel about a friend and behave to a friend | A good ___ with a friend is all about trust and good times. | relationship (full) | relationship (full) ; relationships (full) | childhood ; questionnaire ; script |
| g3u07.w.script | script | the writing that people read before they go on stage | Before she was famous, the woman worked on a ___ for a new story. | script (full) | script (full) ; scripts (full) | questionnaire ; earring ; relationship |
| g3u07.w.soft-toy | soft toy | a cuddly animal that you hug in bed | I have had these ___ since I was very little, and I still love them. | soft toys (full) ; soft toy (partial) | soft toy (full) ; soft toys (full) | earring ; questionnaire ; script |
| g3u07.w.to-admit | to admit | to tell people that a thing is true, often a bad thing you did | He does not want to ___ that he is the one who did it. | admit (full) ; admitted (partial) | admit (full) ; to admit (full) ; admitted (full) | to lie to sb. ; to keep (a) secret ; to blackmail |
| g3u07.w.to-blackmail | to blackmail | to make somebody give you money so you keep their secret | He wants to ___ Tom so Tom gives him money for his secret. | blackmail (full) ; blackmailed (partial) | blackmail (full) ; to blackmail (full) ; blackmailed (full) | to admit ; to lie to sb. ; to keep (a) secret |
| g3u07.w.to-break-up-with-sb | to break up with sb. | to no longer be a boyfriend or girlfriend with somebody | She had a big fight with her boyfriend, so she will ___ him. | break up with (full) ; break up with him (full) | break up with sb. (full) ; break up with (full) ; broke up with (partial) | to fall out with sb. ; to make up with sb. ; to get on well with sb. |
| g3u07.w.to-fall-out-with-sb | to fall out with sb. | to have a big fight and stop talking to a friend | I ___ with my best friend last week, and now we do not talk. | fell out (full) ; fall out (partial) ; fell out with (partial) | fall out with sb. (full) ; fall out with (full) ; fall out (full) | to make up with sb. ; to get on well with sb. ; to step in |
| g3u07.w.to-get-on-well-with-sb | to get on well with sb. | to have a good and happy time with a friend | I ___ on really well with my big sister, and we always laugh and play. | get (full) ; got (partial) | get on well with sb. (full) ; get on well with (full) ; get on with (partial) | to fall out with sb. ; to break up with sb. ; to storm out of |
| g3u07.w.to-keep-secret | to keep (a) secret | to not tell people a thing that nobody must find out | Can you ___ a secret? I want to tell you a thing, but please tell nobody. | keep (full) ; keep a secret (full) ; kept a secret (partial) | keep a secret (full) ; keep secret (full) ; to keep a secret (full) | to lie to sb. ; to admit ; to blackmail |
| g3u07.w.to-laugh-at-sb | to laugh at sb. | to show somebody you think they are funny in a not nice way | Some children at school ___ me when I dropped my books. | laughed at (full) ; laugh at (partial) | laugh at sb. (full) ; laugh at (full) ; to laugh at sb. (full) | to make up with sb. ; to step in ; to get on well with sb. |
| g3u07.w.to-lie-to-sb | to lie to sb. | to tell somebody a thing that is not true when you want to | A good friend never ___ to you; they always tell you the truth. | lies (full) ; lie (partial) ; lied (partial) | lie to sb. (full) ; lie to (full) ; to lie to sb. (full) | to admit ; to keep (a) secret ; to blackmail |
| g3u07.w.to-make-fun-of-sb | to make fun of sb. | to do or tell jokes about somebody to laugh at them | Do not ___ him just because he is new and has no friends. | make fun of (full) ; making fun of (partial) | make fun of sb. (full) ; make fun of (full) ; to make fun of sb. (full) | to make up with sb. ; to step in ; to get on well with sb. |
| g3u07.w.to-make-up-one-s-mind | to make up one's mind | to think well about a thing and then go for it | Once she has ___ about what she wants, she does not let go of it. | made up her mind (full) ; make up her mind (partial) | make up one's mind (full) ; make up your mind (full) ; make up my mind (full) ; made up her mind (partial) | to mind your own business ; to make fun of sb. ; to get on well with sb. |
| g3u07.w.to-make-up-with-sb | to make up with sb. | to become good friends again after a fight | They had a fight in the morning, but now they ___ and are friends again. | make up (full) ; make up with each other (full) ; made up (partial) | make up with sb. (full) ; make up with (full) ; make up (full) | to fall out with sb. ; to break up with sb. ; to storm out of |
| g3u07.w.to-mind-your-own-business | to mind your own business | to not ask about a thing that is not for you | Stop asking me about my family! It is not for you, so ___! | mind your own business (full) | mind your own business (full) ; to mind your own business (full) ; mind my own business (partial) | to make up with sb. ; to get on well with sb. ; to laugh at sb. |
| g3u07.w.to-move | to move | to leave your home and go to live in a new place | My parents want to ___ to a bigger home in a new city. | move (full) ; moved (partial) | move (full) ; to move (full) ; moved (full) | to own ; to solve ; to admit |
| g3u07.w.to-own | to own | to have a thing that is yours | Does your family ___ a dog at home, or do you have no pets? | own (full) ; owns (partial) ; owned (partial) | own (full) ; to own (full) ; owns (full) | to move ; to solve ; to struggle |
| g3u07.w.to-solve | to solve | to find the way out of a difficult thing | A clever detective can ___ this crime and find the robber. | solve (full) ; solves (partial) ; solved (partial) | solve (full) ; to solve (full) ; solved (full) | to own ; to move ; to admit |
| g3u07.w.to-step-in | to step in | to help when two people have a fight | When a child makes fun of your friend, you must ___ and help. | step in (full) ; stepped in (partial) | step in (full) ; to step in (full) ; stepped in (full) | to storm out of ; to laugh at sb. ; to make fun of sb. |
| g3u07.w.to-storm-out-of | to storm out of | to leave a room in an angry way | He was so angry that he ___ the room and did not look back. | stormed out of (full) ; storm out of (partial) | storm out of (full) ; to storm out of (full) ; stormed out of (full) | to step in ; to make up with sb. ; to get on well with sb. |
| g3u07.w.to-struggle | to struggle | to work very long and find a thing difficult | He ___ at school because the work was very difficult for him. | struggled (full) ; struggles (partial) ; struggle (partial) | struggle (full) ; to struggle (full) ; struggled (full) | to solve ; to own ; to move |
| g3u07.w.to-tell-sb-off | to tell sb. off | to talk to somebody in an angry way because they did a bad thing | My teacher always ___ the children for not doing their homework. | tells off (full) ; told off (partial) | tell sb. off (full) ; tell off (full) ; to tell sb. off (full) | to make up with sb. ; to get on well with sb. ; to step in |
| g3u07.w.unwell | unwell | not feeling well, a little ill | He looks ill and ___, so he stayed in bed all day. | unwell (full) | unwell (full) | honest ; jealous ; clumsy |

## Grammar items (47)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g3u07.gi.present-perfect-for-since.ag.001 | anagram | Buchstabensalat: Das Wort steht vor einer Zeitspanne (zehn Jahre ___). -> R F O [de, 1 blank(s)] | for (full) | — | — | — | — | false |
| g3u07.gi.present-perfect-for-since.ag.002 | anagram | Buchstabensalat: Das Wort steht vor einem Anfangspunkt (___ 2019). -> C N E I S [de, 1 blank(s)] | since (full) | — | — | — | — | false |
| g3u07.gi.present-perfect-for-since.cp.001 | context-picker | Tom ist 2020 nach Wien gezogen. Er wohnt immer noch dort. Welcher Satz ist richtig? [de] | Tom has lived in Vienna since 2020. (full) | — | Tom has lived in Vienna for 2020. ; Tom has lived in Vienna since six years. ; Tom lived in Vienna since 2020. | — | — | false |
| g3u07.gi.present-perfect-for-since.cp.002 | context-picker | Deine Freundin hat im September angefangen, Englisch zu lernen. Jetzt ist März. Welcher Satz ist richtig? [de] | She has studied English since September. (full) | — | She has studied English for September. ; She studies English since September. ; She has studied English since six months. | — | — | false |
| g3u07.gi.present-perfect-for-since.cp.003 | context-picker | Deine Familie hat den Hund vor sechs Jahren bekommen und hat ihn immer noch. Welcher Satz ist richtig? [de] | We have had our dog for six years. (full) | — | We have had our dog since six years. ; We have our dog for six years. ; We had our dog for six years. | — | — | false |
| g3u07.gi.present-perfect-for-since.ec.001 | error-correction | Finde und verbessere den Fehler: I have known her since three years. [de] | I have known her for three years. (full) ; I have known her for three years (full) ; I've known her for three years. (full) ; for three years (full) | — | — | — | — | false |
| g3u07.gi.present-perfect-for-since.ec.002 | error-correction | Finde und verbessere den Fehler: He lives in Salzburg since 2019. [de] | He has lived in Salzburg since 2019. (full) ; He has lived in Salzburg since 2019 (full) ; He's lived in Salzburg since 2019. (full) | — | — | — | — | false |
| g3u07.gi.present-perfect-for-since.ec.003 | error-correction | Finde und verbessere den Fehler: We are friends for ten years. [de] | We have been friends for ten years. (full) ; We have been friends for ten years (full) ; We've been friends for ten years. (full) | — | — | — | — | false |
| g3u07.gi.present-perfect-for-since.ec.004 | error-correction | Finde und verbessere den Fehler: She has been in hospital for Monday. [de] | She has been in hospital since Monday. (full) ; She has been in hospital since Monday (full) ; since Monday (full) ; She's been in hospital since Monday. (partial) | — | — | — | — | false |
| g3u07.gi.present-perfect-for-since.ec.005 | error-correction | Finde und verbessere den Fehler: I have had this bike since three months. [de] | I have had this bike for three months. (full) ; I have had this bike for three months (full) ; for three months (full) ; I've had this bike for three months. (partial) | — | — | — | — | false |
| g3u07.gi.present-perfect-for-since.ec.006 | error-correction | Finde und verbessere den Fehler: My mother work in that office since 2015. [de] | My mother has worked in that office since 2015. (full) ; My mother has worked in that office since 2015 (full) ; My mother's worked in that office since 2015. (partial) | — | — | — | — | false |
| g3u07.gi.present-perfect-for-since.ff.001 | free-form | Schreib einen wahren Satz über dich mit have/has + for. Beispiel: I have had my dog for three years. [de] | I have lived here for ten years. (full) ; I have had my phone for two years. (full) ; We have been friends for five years. (full) ; I have played football for three years. (partial) ; I have known her for a long time. (partial) | — | — | — | — | false |
| g3u07.gi.present-perfect-for-since.gf.001 | gap-fill | I have lived in this town ___ ten years. [en, 1 blank(s)] | for (full) | — | — | — | — | false |
| g3u07.gi.present-perfect-for-since.gf.002 | gap-fill | She has been my best friend ___ 2019. [en, 1 blank(s)] | since (full) | — | — | — | — | false |
| g3u07.gi.present-perfect-for-since.gf.003 | gap-fill | They have known each other ___ 2018. [en, 1 blank(s)] | since (full) | — | — | — | — | false |
| g3u07.gi.present-perfect-for-since.gf.004 | gap-fill | We haven't seen our friends ___ a long time. [en, 1 blank(s)] | for (full) | — | — | — | — | false |
| g3u07.gi.present-perfect-for-since.gf.005 | gap-fill | He has had that phone ___ last Christmas. [en, 1 blank(s)] | since (full) | — | — | — | — | false |
| g3u07.gi.present-perfect-for-since.gf.006 | gap-fill | My sister has played the piano ___ she was six. [en, 1 blank(s)] | since (full) | — | — | — | — | false |
| g3u07.gi.present-perfect-for-since.gf.007 | gap-fill | Tom has played the guitar ___ three months. [en, 1 blank(s)] | for (full) | — | — | — | — | false |
| g3u07.gi.present-perfect-for-since.gf.008 | gap-fill | My grandma has had that car ___ I was born. [en, 1 blank(s)] | since (full) | — | — | — | — | false |
| g3u07.gi.present-perfect-for-since.gf.009 | gap-fill | We have been at this school ___ a very long time. [en, 1 blank(s)] | for (full) | — | — | — | — | false |
| g3u07.gi.present-perfect-for-since.gf.010 | gap-fill | Schreib die richtige Form ein: Molly ___ (have) her cat since December. [de, 1 blank(s)] | has had (full) | — | — | — | — | false |
| g3u07.gi.present-perfect-for-since.gf.011 | gap-fill | Schreib die richtige Form ein: Dave ___ (play) tennis since he was ten. [de, 1 blank(s)] | has played (full) | — | — | — | — | false |
| g3u07.gi.present-perfect-for-since.gf.012 | gap-fill | Schreib zwei Wörter ein: They ___ (live) next door to us ___ six months. [de, 2 blank(s)] | have lived \| for (full) | — | — | — | — | false |
| g3u07.gi.present-perfect-for-since.gs.001 | group-sort | Sortiere: Gehört das Wort zu for oder zu since? [de] | — | — | — | — | for (✓): two hours, a long time, three weeks, many years \| since (✓): last summer, 2020, Monday, I was a child | false |
| g3u07.gi.present-perfect-for-since.gs.002 | group-sort | Sortiere: Gehört das Wort zu for oder zu since? [de] | — | — | — | — | for (✓): many years, ten minutes, three days, two weeks \| since (✓): this morning, the weekend, 1999, last Friday | false |
| g3u07.gi.present-perfect-for-since.mc.001 | multiple-choice | Welcher Satz ist richtig? [de] | I have lived here for five years. (full) | — | I have lived here since five years. ; I live here for five years. ; I lived here for five years. | — | — | false |
| g3u07.gi.present-perfect-for-since.mc.002 | multiple-choice | Welcher Satz ist richtig? [de] | She has worked there since September. (full) | — | She has worked there for September. ; She works there since September. ; She worked there since September. | — | — | false |
| g3u07.gi.present-perfect-for-since.mc.003 | multiple-choice | Welcher Satz ist richtig? [de] | They haven't eaten anything since breakfast. (full) | — | They haven't eaten anything for breakfast. ; They don't eat anything since breakfast. ; They didn't eat anything since breakfast. | — | — | false |
| g3u07.gi.present-perfect-for-since.mc.004 | multiple-choice | Welcher Satz ist richtig? [de] | I have known her since 2019. (full) | — | I have known her for 2019. ; I have known her since five years. ; I know her since 2019. | — | — | false |
| g3u07.gi.present-perfect-for-since.mc.005 | multiple-choice | Welcher Satz ist richtig? [de] | He has been ill since last Friday. (full) | — | He has been ill for last Friday. ; He is ill since last Friday. ; He has been ill since a week. | — | — | false |
| g3u07.gi.present-perfect-for-since.mp.002 | matching-pairs | Welcher Satz gehört zu welcher Info? [de] | — | — | — | Start: 2019. Still true. ↔ I have known her since 2019. ; Length: ten years. Still true. ↔ I have known her for ten years. ; Start: Monday. Still true. ↔ She has been ill since Monday. ; Length: a week. Still true. ↔ She has been ill for a week. | — | false |
| g3u07.gi.present-perfect-for-since.mt.001 | matching | Welches Ende passt zu welchem Anfang? [de] | — | — | — | I have lived here ↔ for ten years. ; She has been my friend ↔ since primary school. ; They have known each other ↔ since they were born. ; We haven't seen them ↔ for a long time. | — | false |
| g3u07.gi.present-perfect-for-since.mt.002 | matching | Welche Antwort passt zu welcher Frage? [de] | — | — | — | How long have you had your dog? ↔ I have had him for six years. ; How long have you known Tom? ↔ I have known him since 2018. ; How long have you played the guitar? ↔ I have played it since I was eight. ; How long have you lived in Vienna? ↔ I have lived here for three months. | — | false |
| g3u07.gi.present-perfect-for-since.qf.001 | question-formation | Bilde die Frage: how long / you / have / known / your best friend [de] | How long have you known your best friend? (full) | — | — | — | — | false |
| g3u07.gi.present-perfect-for-since.qf.002 | question-formation | Bilde die Frage: how long / you / have / had / your bike [de] | How long have you had your bike? (full) | — | — | — | — | false |
| g3u07.gi.present-perfect-for-since.sb.001 | sentence-building | for / lived / three / they / here / years / have [en] | They have lived here for three years. (full) ; They have lived here for three years (full) | — | — | — | — | false |
| g3u07.gi.present-perfect-for-since.sb.002 | sentence-building | haven't / since / they / each other / seen / July [en] | They haven't seen each other since July. (full) ; They haven't seen each other since July (full) | — | — | — | — | false |
| g3u07.gi.present-perfect-for-since.sb.003 | sentence-building | since / has / she / had / December / cat / her [en] | She has had her cat since December. (full) ; She has had her cat since December (full) | — | — | — | — | false |
| g3u07.gi.present-perfect-for-since.tf.001 | transformation | I started learning Spanish in 2020. I still learn it. (jetzt ein Satz mit since) [de] | I have studied Spanish since 2020. (full) ; I've studied Spanish since 2020. (full) | — | — | — | — | false |
| g3u07.gi.present-perfect-for-since.tf.002 | transformation | We moved here in 2018. We still live here. (ein Satz mit since) [de] | We have lived here since 2018. (full) ; We've lived here since 2018. (full) | — | — | — | — | false |
| g3u07.gi.present-perfect-for-since.tf.003 | transformation | She got that phone two years ago. She still has it. (ein Satz mit for) [de] | She has had that phone for two years. (full) ; She's had that phone for two years. (full) | — | — | — | — | false |
| g3u07.gi.present-perfect-for-since.tf.004 | transformation | He started this job last summer. He still works there. (ein Satz mit since) [de] | He has worked there since last summer. (full) ; He's worked there since last summer. (full) | — | — | — | — | false |
| g3u07.gi.present-perfect-for-since.tr.001 | translation | Ich wohne seit fünf Jahren in Wien. [de] | I have lived in Vienna for five years. (full) ; I've lived in Vienna for five years. (full) ; I have lived in Vienna for five years (full) | deToEn | — | — | — | false |
| g3u07.gi.present-perfect-for-since.tr.002 | translation | Er spielt seit Montag kein Fußball. [de] | He hasn't played football since Monday. (full) ; He has not played football since Monday. (full) ; He hasn't played football since Monday (full) | deToEn | — | — | — | false |
| g3u07.gi.present-perfect-for-since.tr.003 | translation | Wir sind seit zwei Jahren befreundet. [de] | We have been friends for two years. (full) ; We've been friends for two years. (full) ; We have been friends for two years (full) | deToEn | — | — | — | false |
| g3u07.gi.present-perfect-for-since.tr.004 | translation | She has had those soft toys since she was little. [en] | Sie hat diese Stofftiere, seit sie klein war. (full) ; Sie hat die Stofftiere, seit sie klein war. (full) | enToDe | — | — | — | false |

## Output contract

Write `content/corpus/units/g3-u07/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g3-u07",
  "lens": "answers",
  "itemsHash": "4ce24136baf3",
  "promptHash": "70fa2d8cdf22",
  "round": 1,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 81, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
