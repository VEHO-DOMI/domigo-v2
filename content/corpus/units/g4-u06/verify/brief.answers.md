# Verify lens — answers — g4-u06 (round 1)

<!-- domigo:verify answers g4-u06 items=cc5e46d741cb prompt=70fa2d8cdf22 round=1 -->

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

## Vocab items (18)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g4u06.w.achieve | achieve | to do a thing you want very much after you work for it | After all this work, they finally ___ their goal. | achieved (full) ; achieve (partial) | achieve (full) ; to achieve (full) ; achieved (partial) | donate ; exceed ; inspire |
| g4u06.w.community | community | all the people who live in one place or who share a thing | Everybody in our ___ came to help clean up the park. | community (full) ; communities (partial) | community (full) ; a community (full) ; communities (partial) | income ; goal ; encouragement |
| g4u06.w.donate | donate | to give money or your time for free so you can help | We ___ our old clothes and books to the children in need. | donated (full) ; donate (partial) | donate (full) ; to donate (full) ; donated (partial) | achieve ; exceed ; transmit |
| g4u06.w.drop-out | drop out (of school) | to stop going to your classes before the end | He had a difficult time at school and had to ___ when he was 16. | drop out (full) ; drop out of school (full) ; dropped out (partial) ; dropped out of school (partial) | drop out (full) ; drop out of school (full) ; to drop out (full) ; dropped out (partial) | donate ; inspire ; support |
| g4u06.w.encouragement | encouragement | the help and hope you give somebody so they do not give up | My teacher gives me a lot of ___ when my work is difficult. | encouragement (full) | encouragement (full) | income ; goal ; community |
| g4u06.w.exceed | exceed | to be more than the number that was the most | Now she has ___ her goal of 1,000 books after a lot of support. | exceeded (full) ; exceed (partial) | exceed (full) ; to exceed (full) ; exceeded (partial) | achieve ; donate ; inspire |
| g4u06.w.frustrated | frustrated | feeling angry and upset because you cannot do what you want | He could not do the difficult homework and was really ___. | frustrated (full) | frustrated (full) | grateful ; community ; goal |
| g4u06.w.goal | goal | the thing you want to reach or do | My biggest ___ this year is to read 100 books. | goal (full) ; goals (partial) | goal (full) ; a goal (full) ; goals (partial) | income ; encouragement ; community |
| g4u06.w.grateful | grateful | feeling that you want to thank somebody for their help | I am so ___ that you helped me carry all these heavy books. | grateful (full) | grateful (full) | frustrated ; goal ; income |
| g4u06.w.in-particular | in particular | more than anyone or anything else | I like all the subjects, but I love science ___. | in particular (full) | in particular (full) | Small wonder ; range of ; learn a lesson |
| g4u06.w.income | income | the money you earn from your work | Her career was successful and she had a really good ___. | income (full) | income (full) ; an income (full) | goal ; support ; encouragement |
| g4u06.w.inspire | inspire | to make people want to do good and help | My art teacher really ___ me to paint every day. | inspired (full) ; inspire (partial) | inspire (full) ; to inspire (full) ; inspired (partial) | support ; donate ; achieve |
| g4u06.w.learn-a-lesson | learn a lesson | to understand from a bad time so you do not do it again | I did not read the difficult book in time, so now I ___ and start my homework early. | learn a lesson (full) ; learned a lesson (partial) ; learnt a lesson (partial) ; learned my lesson (partial) | learn a lesson (full) ; to learn a lesson (full) ; learned a lesson (partial) ; learnt a lesson (partial) | relate to ; range of ; in particular |
| g4u06.w.range-of | range of | many kinds of one thing, like books or food | We can read a wide ___ stories from all over the world. | range of (full) | range of (full) ; a range of (full) | in particular ; Small wonder ; relate to |
| g4u06.w.relate-to | relate to | to understand how somebody feels because it happened to you too | I can really ___ this character because she loves reading, just like me. | relate to (full) | relate to (full) ; to relate to (full) | learn a lesson ; range of ; in particular |
| g4u06.w.small-wonder | Small wonder | it is not a surprise at all | Some children do not read books. ___, because the books are not about them. | Small wonder (full) ; small wonder (full) | small wonder (full) ; Small wonder (full) | in particular ; range of ; relate to |
| g4u06.w.support | support | to help somebody when they have a difficult time | My parents always ___ me when I have a difficult day at school. | support (full) ; supported (partial) | support (full) ; to support (full) ; supported (partial) | inspire ; donate ; exceed |
| g4u06.w.transmit | transmit | to move sound or pictures from one place to far away | A radio can ___ sound to people many kilometres away. | transmit (full) ; transmits (partial) ; transmitted (partial) | transmit (full) ; to transmit (full) ; transmitted (partial) | donate ; inspire ; achieve |

## Grammar items (112)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g4u06.gi.adverbs-of-manner.ag.001 | anagram | Bilde das WIE-Wort zu good (Ausnahme – kein -ly!). Sortiere die Buchstaben: l w e l [de] | well (full) | — | — | — | — | false |
| g4u06.gi.adverbs-of-manner.ag.002 | anagram | Bilde das WIE-Wort zu slow. Sortiere die Buchstaben: w o l s l y [de] | slowly (full) | — | — | — | — | false |
| g4u06.gi.adverbs-of-manner.cp.001 | context-picker | Dein Freund kocht super. Welcher Satz ist richtig? [de] | He cooks really well. (full) | — | He cooks really good. ; He cooks good really. ; He cooks real well. | — | — | false |
| g4u06.gi.adverbs-of-manner.cp.002 | context-picker | Du beschreibst, wie schnell dein Freund läuft. Welcher Satz ist richtig? [de] | He runs very fast. (full) | — | He runs very fastly. ; He runs very good. ; He very fast runs. | — | — | false |
| g4u06.gi.adverbs-of-manner.ec.001 | error-correction | She dances very good. [en] | She dances very well. (full) ; well (partial) | — | — | — | — | true |
| g4u06.gi.adverbs-of-manner.ec.002 | error-correction | He speaks French fluent. [en] | He speaks French fluently. (full) ; fluently (partial) | — | — | — | — | true |
| g4u06.gi.adverbs-of-manner.ec.003 | error-correction | He runs very fastly. [en] | He runs very fast. (full) ; fast (partial) | — | — | — | — | true |
| g4u06.gi.adverbs-of-manner.ec.004 | error-correction | He plays football very good. [en] | He plays football very well. (full) ; well (partial) | — | — | — | — | true |
| g4u06.gi.adverbs-of-manner.ec.005 | error-correction | The food tastes badly. [en] | The food tastes bad. (full) ; bad (partial) | — | — | — | — | true |
| g4u06.gi.adverbs-of-manner.ec.006 | error-correction | She closes the door quietly and careful opens the box. [en] | She closes the door quietly and carefully opens the box. (full) ; carefully (partial) | — | — | — | — | false |
| g4u06.gi.adverbs-of-manner.ec.007 | error-correction | She paints beautiful but she dances bad. [en] | She paints beautifully but she dances badly. (full) | — | — | — | — | false |
| g4u06.gi.adverbs-of-manner.ec.008 | error-correction | He plays football hardly every day. [en] | He plays football hard every day. (full) ; hard (partial) | — | — | — | — | true |
| g4u06.gi.adverbs-of-manner.ec.009 | error-correction | She paints very beautiful. [en] | She paints very beautifully. (full) ; beautifully (partial) | — | — | — | — | true |
| g4u06.gi.adverbs-of-manner.gf.001 | gap-fill | She plays the guitar ___. (beautiful) [en, 1 blank(s)] | beautifully (full) | — | beautiful ; well ; fast | — | — | false |
| g4u06.gi.adverbs-of-manner.gf.002 | gap-fill | He runs very ___. (fast) [en, 1 blank(s)] | fast (full) | — | quickly ; well ; slowly | — | — | false |
| g4u06.gi.adverbs-of-manner.gf.003 | gap-fill | She plays the piano very ___. (good) [en, 1 blank(s)] | well (full) | — | good ; fast ; early | — | — | false |
| g4u06.gi.adverbs-of-manner.gf.004 | gap-fill | Please speak up! I can ___ understand you. [en, 1 blank(s)] | hardly (full) | — | hard ; well ; fast | — | — | false |
| g4u06.gi.adverbs-of-manner.gf.005 | gap-fill | The children play ___ in the garden. (happy) [en, 1 blank(s)] | happily (full) | — | happy ; well ; fast | — | — | false |
| g4u06.gi.adverbs-of-manner.gf.006 | gap-fill | Please speak ___ in the library. (quiet) [en, 1 blank(s)] | quietly (full) | — | quiet ; fast ; well | — | — | false |
| g4u06.gi.adverbs-of-manner.gf.007 | gap-fill | The dog runs ___ in the park. (angry) [en, 1 blank(s)] | angrily (full) | — | angry ; well ; fast | — | — | false |
| g4u06.gi.adverbs-of-manner.gf.008 | gap-fill | She works ___ on her project but still has problems. (hard) [en, 1 blank(s)] | hard (full) | — | hardly ; well ; fast | — | — | false |
| g4u06.gi.adverbs-of-manner.gf.009 | gap-fill | He reads all the rules ___. (correct) [en, 1 blank(s)] | correctly (full) | — | correct ; well ; fast | — | — | false |
| g4u06.gi.adverbs-of-manner.gf.010 | gap-fill | She speaks French ___. (fluent) [en, 1 blank(s)] | fluently (full) | — | fluent ; well ; fast | — | — | false |
| g4u06.gi.adverbs-of-manner.gf.011 | gap-fill | He plays really ___ in the first match but ___ in the second. (good / terrible) [en, 2 blank(s)] | well \| terribly (full) | — | — | — | — | false |
| g4u06.gi.adverbs-of-manner.gf.012 | gap-fill | Don't arrive ___ for the job interview! (late) [en, 1 blank(s)] | late (full) | — | lately ; early ; fast | — | — | false |
| g4u06.gi.adverbs-of-manner.gf.013 | gap-fill | He drives ___ through the village. (slow) [en, 1 blank(s)] | slowly (full) | — | slow ; fast ; well | — | — | false |
| g4u06.gi.adverbs-of-manner.gf.014 | gap-fill | I haven't seen Tom ___. Is he OK? (recently) [en, 1 blank(s)] | lately (full) ; recently (full) | — | late ; early ; fast | — | — | false |
| g4u06.gi.adverbs-of-manner.gs.001 | group-sort | Welche Wörter bekommen -ly und welche bleiben gleich? (Beispiel: slow → slowly, aber fast → fast) [de] | — | — | — | — | slow → slowly: careful, quiet, beautiful, correct \| fast → fast: fast, hard, late, early | false |
| g4u06.gi.adverbs-of-manner.gs.002 | group-sort | Sortiere: Was passt nach 'She speaks ___' und was nach 'It tastes ___'? (Tipp: nach taste, look, sound, feel steht das Wort OHNE -ly.) [de, 2 blank(s)] | — | — | — | — | She speaks ___: beautifully, well, quietly \| It tastes ___: good, awful, delicious | false |
| g4u06.gi.adverbs-of-manner.mc.002 | multiple-choice | Welcher Satz ist richtig? [de] | She speaks English fluently. (full) | — | She speaks fluently English. ; She fluently speaks English. ; She speaks English fluent. | — | — | false |
| g4u06.gi.adverbs-of-manner.mc.003 | multiple-choice | Welcher Satz ist richtig? (Achte auf hard und hardly.) [de] | He plays hard but he can hardly move. (full) | — | He plays hardly but he can hard move. ; He plays hard but he can hard move. ; He plays hardly but he can hardly move. | — | — | false |
| g4u06.gi.adverbs-of-manner.mc.005 | multiple-choice | Welcher Satz ist richtig? [de] | She dances really well. (full) | — | She dances really good. ; She dances good really. ; She dances real well. | — | — | false |
| g4u06.gi.adverbs-of-manner.mc.007 | multiple-choice | Setze BEIDE Wörter richtig ein:  He trains ___ every day, but today he can ___ move. [de, 2 blank(s)] | hard \| hardly (full) | — | hardly ... hard ; hardly ... hardly ; hard ... hard | — | — | false |
| g4u06.gi.adverbs-of-manner.mc.010 | multiple-choice | Welches Wort passt in die Lücke?  She reads the letter ___. [de, 1 blank(s)] | carefully (full) | — | careful ; quick ; quiet | — | — | false |
| g4u06.gi.adverbs-of-manner.mc.011 | multiple-choice | Welches Wort passt in die Lücke?  The teacher explains the rules ___. [de, 1 blank(s)] | clearly (full) | — | clear ; quick ; quiet | — | — | false |
| g4u06.gi.adverbs-of-manner.mc.012 | multiple-choice | Welcher Satz ist richtig? Nach taste kommt ein Wort wie good/bad, kein -ly-Wort! [de] | This food tastes awful. (full) | — | This food tastes awfully. ; This food awful tastes. ; This food tastes badly. | — | — | false |
| g4u06.gi.adverbs-of-manner.mc.013 | multiple-choice | Welches Wort passt in die Lücke?  She paints the wall ___. [de, 1 blank(s)] | beautifully (full) | — | beautiful ; quick ; quiet | — | — | false |
| g4u06.gi.adverbs-of-manner.mc.014 | multiple-choice | Welcher Satz ist richtig? Nach feel kommt ein Wort wie good/bad, kein -ly-Wort! [de] | She feels happy. (full) | — | She feels happily. ; She happy feels. ; She feel happy. | — | — | false |
| g4u06.gi.adverbs-of-manner.mt.002 | matching | Ordne jedem Wort sein passendes WIE-Wort zu. [de] | — | — | — | angry ↔ angrily ; slow ↔ slowly ; beautiful ↔ beautifully ; correct ↔ correctly ; late ↔ late | — | false |
| g4u06.gi.adverbs-of-manner.mt.003 | matching | Welches WIE-Wort (-ly) gehört zu welchem Grundwort? [de] | — | — | — | good ↔ well ; fast ↔ fast ; careful ↔ carefully ; happy ↔ happily ; easy ↔ easily | — | false |
| g4u06.gi.adverbs-of-manner.qf.001 | question-formation | She plays the guitar beautifully. Frag danach, WIE sie die Gitarre spielt. [de] | How does she play the guitar? (full) ; How well does she play the guitar? (partial) | — | — | — | — | false |
| g4u06.gi.adverbs-of-manner.qf.002 | question-formation | He speaks French fluently. Frag danach, WIE er Französisch spricht. [de] | How does he speak French? (full) ; How well does he speak French? (partial) | — | — | — | — | false |
| g4u06.gi.adverbs-of-manner.sb.001 | sentence-building | carefully / she / reads / the letter [en] | She reads the letter carefully. (full) ; She carefully reads the letter. (full) | — | — | — | — | false |
| g4u06.gi.adverbs-of-manner.sb.002 | sentence-building | nervously / she / opens / the door [en] | She opens the door nervously. (full) ; She nervously opens the door. (full) | — | — | — | — | false |
| g4u06.gi.adverbs-of-manner.sb.003 | sentence-building | well / she / cooks / really [en] | She cooks really well. (full) | — | — | — | — | false |
| g4u06.gi.adverbs-of-manner.tf.001 | transformation | Mach aus dem Wort, das WIE beschreibt, einen Satz: 'He is a slow runner.' → 'He runs ___.' [de, 1 blank(s)] | He runs slowly. (full) ; slowly (partial) | — | — | — | — | false |
| g4u06.gi.adverbs-of-manner.tf.002 | transformation | Mach aus dem Wort, das WIE beschreibt, einen Satz: 'She is a careful driver.' → 'She drives ___.' [de, 1 blank(s)] | She drives carefully. (full) ; carefully (partial) | — | — | — | — | false |
| g4u06.gi.adverbs-of-manner.tf.003 | transformation | Mach aus dem Wort, das WIE beschreibt, einen Satz: 'He is a beautiful painter.' → 'He paints ___.' [de, 1 blank(s)] | He paints beautifully. (full) ; beautifully (partial) | — | — | — | — | false |
| g4u06.gi.adverbs-of-manner.tf.004 | transformation | Mach aus dem Wort, das WIE beschreibt, einen Satz: 'He is a lazy player.' → 'He plays ___.' [de, 1 blank(s)] | He plays lazily. (full) ; lazily (partial) | — | — | — | — | false |
| g4u06.gi.adverbs-of-manner.tf.005 | transformation | Mach aus dem Wort, das WIE beschreibt, einen Satz: 'He is a quick reader.' → 'He reads ___.' [de, 1 blank(s)] | He reads quickly. (full) ; quickly (partial) | — | — | — | — | false |
| g4u06.gi.adverbs-of-manner.tf.006 | transformation | Mach aus dem Wort, das WIE beschreibt, einen Satz: 'She is a patient teacher.' → 'She waits ___.' [de, 1 blank(s)] | She waits patiently. (full) ; patiently (partial) | — | — | — | — | false |
| g4u06.gi.adverbs-of-manner.tf.007 | transformation | Deine Mutter kocht super. Sag es einem Freund: 'My mum is a great cook — she cooks really ___.' [de, 1 blank(s)] | well (full) | — | — | — | — | false |
| g4u06.gi.adverbs-of-manner.tf.008 | transformation | Es war heute Morgen sehr neblig. Sag einem Freund: 'I could ___ see anything — it was so foggy!' [de, 1 blank(s)] | hardly (full) | — | — | — | — | false |
| g4u06.gi.adverbs-of-manner.tr.001 | translation | Er spricht sehr leise. [de] | He speaks very quietly. (full) ; He talks very quietly. (full) | deToEn | — | — | — | false |
| g4u06.gi.adverbs-of-manner.tr.004 | translation | Das Essen schmeckt schrecklich. [de] | The food tastes awful. (full) ; The food tastes terrible. (partial) | deToEn | — | — | — | false |
| g4u06.gi.adverbs-of-manner.tr.005 | translation | Speak quietly, please. [en] | Sprich bitte leise. (full) ; Bitte sprich leise. (full) ; Sprich leise, bitte. (partial) | enToDe | — | — | — | false |
| g4u06.gi.adverbs-of-manner.tr.006 | translation | Mia spielt die Gitarre sehr gut. [de] | Mia plays the guitar very well. (full) ; Mia plays guitar very well. (partial) | deToEn | — | — | — | false |
| g4u06.gi.adverbs-of-manner.tr.007 | translation | Sue liest die Regeln richtig. [de] | Sue reads the rules correctly. (full) | deToEn | — | — | — | false |
| g4u06.gi.question-tags.cp.001 | context-picker | Du bist dir ziemlich sicher, dass deine Freundin gut kochen kann, und möchtest es mit einer kurzen Frage am Ende bestätigen. Welcher Satz ist richtig? [de] | She can cook really well, can't she? (full) | — | She can cook really well, can she? ; She can cook really well, doesn't she? ; She can cook really well, isn't she? | — | — | false |
| g4u06.gi.question-tags.cp.002 | context-picker | Dein Freund sieht müde aus. Du willst freundlich nachfragen und es mit einer kurzen Frage am Ende bestätigen. Welcher Satz ist richtig? [de] | You are tired, aren't you? (full) | — | You are tired, are you? ; You are tired, don't you? ; You are tired, aren't they? | — | — | false |
| g4u06.gi.question-tags.ec.001 | error-correction | She likes music, isn't she? [en] | She likes music, doesn't she? (full) ; doesn't she (partial) ; doesn't she? (partial) | — | — | — | — | true |
| g4u06.gi.question-tags.ec.002 | error-correction | She likes the book, doesn't it? [en] | She likes the book, doesn't she? (full) ; doesn't she (partial) ; doesn't she? (partial) | — | — | — | — | true |
| g4u06.gi.question-tags.ec.003 | error-correction | The children have donated the books, haven't it? [en] | The children have donated the books, haven't they? (full) ; haven't they (partial) ; haven't they? (partial) | — | — | — | — | true |
| g4u06.gi.question-tags.ec.004 | error-correction | You don't like maths, don't you? [en] | You don't like maths, do you? (full) ; do you (partial) ; do you? (partial) | — | — | — | — | true |
| g4u06.gi.question-tags.ec.005 | error-correction | Nobody likes the book, do he? [en] | Nobody likes the book, do they? (full) ; do they (partial) ; do they? (partial) | — | — | — | — | true |
| g4u06.gi.question-tags.ec.006 | error-correction | They have donated the books, didn't they? [en] | They have donated the books, haven't they? (full) ; haven't they (partial) ; haven't they? (partial) | — | — | — | — | true |
| g4u06.gi.question-tags.gf.001 | gap-fill | She is your sister, ___ ? [en, 1 blank(s)] | isn't she (full) ; isn't she? (full) | — | — | — | — | true |
| g4u06.gi.question-tags.gf.002 | gap-fill | You are from Vienna, ___ ? [en, 1 blank(s)] | aren't you (full) ; aren't you? (full) | — | — | — | — | true |
| g4u06.gi.question-tags.gf.003 | gap-fill | Tom likes music, ___ ? [en, 1 blank(s)] | doesn't he (full) ; doesn't he? (full) | — | — | — | — | true |
| g4u06.gi.question-tags.gf.004 | gap-fill | The children were playing outside, ___ ? [en, 1 blank(s)] | weren't they (full) ; weren't they? (full) | — | — | — | — | true |
| g4u06.gi.question-tags.gf.005 | gap-fill | You haven't cleaned your room, ___ ? [en, 1 blank(s)] | have you (full) ; have you? (full) | — | — | — | — | true |
| g4u06.gi.question-tags.gf.006 | gap-fill | You can drive, ___ ? [en, 1 blank(s)] | can't you (full) ; can't you? (full) | — | — | — | — | true |
| g4u06.gi.question-tags.gf.007 | gap-fill | Your mum has cooked dinner, ___ ? [en, 1 blank(s)] | hasn't she (full) ; hasn't she? (full) | — | — | — | — | true |
| g4u06.gi.question-tags.gf.008 | gap-fill | She doesn't eat meat, ___ ? [en, 1 blank(s)] | does she (full) ; does she? (full) | — | — | — | — | true |
| g4u06.gi.question-tags.gf.009 | gap-fill | Nobody called you about it, ___ ? [en, 1 blank(s)] | did they (full) ; did they? (full) | — | — | — | — | true |
| g4u06.gi.question-tags.gf.010 | gap-fill | I am your friend, ___ ? [en, 1 blank(s)] | aren't I (full) ; aren't I? (full) | — | — | — | — | true |
| g4u06.gi.question-tags.gf.011 | gap-fill | Let's go to the cinema, ___ ? [en, 1 blank(s)] | shall we (full) ; shall we? (full) | — | — | — | — | true |
| g4u06.gi.question-tags.gf.012 | gap-fill | You support the project, ___ ? [en, 1 blank(s)] | don't you (full) ; don't you? (full) | — | — | — | — | true |
| g4u06.gi.question-tags.gf.013 | gap-fill | It will be sunny tomorrow, ___ ? [en, 1 blank(s)] | won't it (full) ; won't it? (full) | — | — | — | — | true |
| g4u06.gi.question-tags.gf.014 | gap-fill | She inspired a lot of children, ___ ? [en, 1 blank(s)] | didn't she (full) ; didn't she? (full) | — | — | — | — | true |
| g4u06.gi.question-tags.gf.015 | gap-fill | He dropped out of school, ___ ? [en, 1 blank(s)] | didn't he (full) ; didn't he? (full) | — | — | — | — | true |
| g4u06.gi.question-tags.gf.016 | gap-fill | You have read the story, ___ ? [en, 1 blank(s)] | haven't you (full) ; haven't you? (full) | — | — | — | — | true |
| g4u06.gi.question-tags.gf.017 | gap-fill | He is your teacher, ___ ? [en, 1 blank(s)] | isn't he (full) ; isn't he? (full) | — | — | — | — | true |
| g4u06.gi.question-tags.gf.018 | gap-fill | They support the campaign, ___ ? [en, 1 blank(s)] | don't they (full) ; don't they? (full) | — | — | — | — | true |
| g4u06.gi.question-tags.gf.019 | gap-fill | She can't come today, ___ ? [en, 1 blank(s)] | can she (full) ; can she? (full) | — | — | — | — | true |
| g4u06.gi.question-tags.gf.020 | gap-fill | You weren't at home, ___ ? [en, 1 blank(s)] | were you (full) ; were you? (full) | — | — | — | — | true |
| g4u06.gi.question-tags.gs.003 | group-sort | Welche kurze Frage gehört zu welcher Satzart? [de] | — | — | — | — | isn't it?: She is here, isn't she?, You can help, can't you?, They donated money, didn't they?, He has cleaned his room, hasn't he? \| is it?: She isn't here, is she?, You can't help, can you?, They didn't help, did they?, He hasn't cleaned his room, has he? | false |
| g4u06.gi.question-tags.gs.004 | group-sort | Welche kurze Frage passt zu welchem kleinen Wort im Satz? [de] | — | — | — | — | do / does / did: You like music, don't you?, She plays the guitar, doesn't she?, They came home, didn't they? \| is / are / can / has: She is your sister, isn't she?, You have read it, haven't you?, He can drive, can't he? | false |
| g4u06.gi.question-tags.mc.001 | multiple-choice | He donated money, ___ ? Wähle die richtige kurze Frage für das Ende. [de, 1 blank(s)] | didn't he (full) | — | doesn't he ; did he ; didn't they | — | — | false |
| g4u06.gi.question-tags.mc.002 | multiple-choice | She has donated more than 100 books, ___ ? Wähle die richtige kurze Frage. [de, 1 blank(s)] | hasn't she (full) | — | has she ; didn't she ; doesn't she | — | — | false |
| g4u06.gi.question-tags.mc.003 | multiple-choice | They didn't enjoy it, ___ ? Wähle die richtige kurze Frage. [de, 1 blank(s)] | did they (full) | — | didn't they ; do they ; were they | — | — | false |
| g4u06.gi.question-tags.mc.004 | multiple-choice | Everybody knows your name, ___ ? Wähle die richtige kurze Frage. [de, 1 blank(s)] | don't they (full) | — | doesn't they ; doesn't he ; don't he | — | — | false |
| g4u06.gi.question-tags.mc.005 | multiple-choice | Nobody was there, ___ ? Wähle die richtige kurze Frage. [de, 1 blank(s)] | were they (full) | — | weren't they ; was she ; did they | — | — | false |
| g4u06.gi.question-tags.mc.006 | multiple-choice | She is your sister, ___ ? Wähle die richtige kurze Frage. [de, 1 blank(s)] | isn't she (full) | — | is she ; doesn't she ; wasn't she | — | — | false |
| g4u06.gi.question-tags.mc.007 | multiple-choice | They can't come to the party, ___ ? Wähle die richtige kurze Frage. [de, 1 blank(s)] | can they (full) | — | can't they ; do they ; are they | — | — | false |
| g4u06.gi.question-tags.mt.001 | matching | Welche kurze Frage passt zu welchem Satz? [de] | — | — | — | She is tired, ↔ isn't she? ; They came home, ↔ didn't they? ; He can drive, ↔ can't he? ; You like music, ↔ don't you? ; We have cleaned the room, ↔ haven't we? | — | false |
| g4u06.gi.question-tags.mt.002 | matching | Welche kurze Frage passt zu welchem Satz? [de] | — | — | — | You aren't tired, ↔ are you? ; They won't come, ↔ will they? ; She doesn't eat meat, ↔ does she? ; You haven't read it, ↔ have you? ; Nobody called, ↔ did they? | — | false |
| g4u06.gi.question-tags.mt.003 | matching | Welche kurze Frage passt zu welchem Satz? [de] | — | — | — | He donated money, ↔ didn't he? ; She has read it, ↔ hasn't she? ; We should help, ↔ shouldn't we? ; You are grateful, ↔ aren't you? | — | false |
| g4u06.gi.question-tags.qf.001 | question-formation | Bau aus den Bausteinen einen ganzen Satz mit kurzer Frage am Ende: He / has cleaned / his room [de] | He has cleaned his room, hasn't he? (full) | — | — | — | — | true |
| g4u06.gi.question-tags.qf.002 | question-formation | Du glaubst, deine Freundin hat das Buch schon gelesen. Frag mit kurzer Frage am Ende nach: You / have read / the book [de] | You have read the book, haven't you? (full) ; You've read the book, haven't you? (full) | — | — | — | — | true |
| g4u06.gi.question-tags.sb.001 | sentence-building | Bring die Bausteine in die richtige Reihenfolge: she / can / drive / , / can't / she / ? [de] | She can drive, can't she? (full) | — | — | — | — | false |
| g4u06.gi.question-tags.sb.002 | sentence-building | Bring die Bausteine in die richtige Reihenfolge: it / is / a / good / story / , / isn't / it / ? [de] | It is a good story, isn't it? (full) ; It's a good story, isn't it? (full) | — | — | — | — | false |
| g4u06.gi.question-tags.sb.003 | sentence-building | Bring die Bausteine in die richtige Reihenfolge: let's / go / swimming / , / shall / we / ? [de] | Let's go swimming, shall we? (full) | — | — | — | — | false |
| g4u06.gi.question-tags.tf.001 | transformation | Häng die passende kurze Frage an: He can cook well. [de] | He can cook well, can't he? (full) ; can't he (partial) ; can't he? (partial) | — | — | — | — | true |
| g4u06.gi.question-tags.tf.002 | transformation | Häng die passende kurze Frage an: They live in Vienna. [de] | They live in Vienna, don't they? (full) ; don't they (partial) ; don't they? (partial) | — | — | — | — | true |
| g4u06.gi.question-tags.tf.003 | transformation | Häng die passende kurze Frage an: Marley started her campaign. [de] | Marley started her campaign, didn't she? (full) ; didn't she (partial) ; didn't she? (partial) | — | — | — | — | true |
| g4u06.gi.question-tags.tf.004 | transformation | Häng die passende kurze Frage an: Tom should eat more vegetables. [de] | Tom should eat more vegetables, shouldn't he? (full) ; shouldn't he (partial) ; shouldn't he? (partial) | — | — | — | — | true |
| g4u06.gi.question-tags.tf.005 | transformation | Häng die passende kurze Frage an: We could help the community. [de] | We could help the community, couldn't we? (full) ; couldn't we (partial) ; couldn't we? (partial) | — | — | — | — | true |
| g4u06.gi.question-tags.tr.001 | translation | Er ist nett, oder? [de] | He is nice, isn't he? (full) ; He's nice, isn't he? (full) | deToEn | — | — | — | true |
| g4u06.gi.question-tags.tr.002 | translation | Du magst Schokolade, oder? [de] | You like chocolate, don't you? (full) | deToEn | — | — | — | true |
| g4u06.gi.question-tags.tr.003 | translation | Niemand war dort, oder? [de] | Nobody was there, were they? (full) ; No one was there, were they? (full) | deToEn | — | — | — | true |
| g4u06.gi.question-tags.tr.005 | translation | Mia can drive, can't she? [en] | Mia kann Auto fahren, oder? (full) ; Mia kann fahren, oder? (full) ; Mia kann Auto fahren, nicht wahr? (full) | enToDe | — | — | — | false |

## Output contract

Write `content/corpus/units/g4-u06/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g4-u06",
  "lens": "answers",
  "itemsHash": "cc5e46d741cb",
  "promptHash": "70fa2d8cdf22",
  "round": 1,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 130, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
