# Verify lens — answers — g4-u09 (round 1)

<!-- domigo:verify answers g4-u09 items=aadd09d9825e prompt=70fa2d8cdf22 round=1 -->

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

## Vocab items (43)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g4u09.w.border | border | The place where one country ends and the next one begins. | Malaysia is near the ___ with Indonesia. | border (full) | border (full) ; borders (partial) | funeral ; ceremony ; gesture |
| g4u09.w.bride | bride | The woman who is married on her big day. | The ___ looks very beautiful in her white dress. | bride (full) | bride (full) ; brides (partial) | bridegroom ; bridesmaid ; goth |
| g4u09.w.bridegroom | bridegroom | The man who is married on his big day. | The ___ waits in the church for the bride. | bridegroom (full) | bridegroom (full) ; groom (partial) ; bridegrooms (partial) | bride ; bridesmaid ; goth |
| g4u09.w.bridesmaid | bridesmaid | A girl or woman who is with the bride on her big day. | She asked her best friend to be her ___. | bridesmaid (full) | bridesmaid (full) ; bridesmaids (partial) | bride ; bridegroom ; goth |
| g4u09.w.bury | bury | To put a dead body or a thing down under the ground. | People ___ their dead in the ground. | bury (full) | bury (full) ; buried (partial) | greet ; ignore ; communicate |
| g4u09.w.ceremony | ceremony | A long, beautiful thing people do on a very big day. | The church ___ for the two of them was long and beautiful. | ceremony (full) | ceremony (full) ; ceremonies (partial) | funeral ; border ; gesture |
| g4u09.w.communicate | communicate | To use language to tell people what you feel or think. | We ___ every day when we talk and write. | communicate (full) | communicate (full) | greet ; bury ; ignore |
| g4u09.w.confused | confused | When you cannot understand and do not know what to think. | I am a little ___, can you tell me again? | confused (full) | confused (full) | embarrassed ; religious ; rebellious |
| g4u09.w.decent-looking | decent-looking | Quite nice, but not the most beautiful. | He is not too cute, but he is a ___ boy. | decent-looking (full) | decent-looking (full) | confused ; religious ; rebellious |
| g4u09.w.devil | devil | An evil spirit in old stories that wants people to be bad. | In old stories the ___ is an evil spirit that tricks people. | devil (full) | devil (full) | needle ; gesture ; ceremony |
| g4u09.w.embarrassed | embarrassed | When you feel that people make you go red. | I ignored him because I was ___. | embarrassed (full) | embarrassed (full) | confused ; religious ; rebellious |
| g4u09.w.far-east | Far East | The countries of Asia, like Japan and China. | Japan and China are countries in the ___. | Far East (full) | Far East (full) | border ; ceremony ; funeral |
| g4u09.w.fashionable | fashionable | Liked when very many young people love it just now. | Black clothes were very ___ last year. | fashionable (full) | fashionable (full) | religious ; rebellious ; permanent |
| g4u09.w.firstly | firstly | You use it to begin your first reason before the next. | ___ I think it looks good, and I also like it. | firstly (full) ; Firstly (full) | firstly (full) | hastily ; permanent ; religious |
| g4u09.w.funeral | funeral | The day when people put a dead body under the ground. | Our neighbour died yesterday and the ___ is on Friday. | funeral (full) | funeral (full) ; funerals (partial) | ceremony ; border ; victory |
| g4u09.w.gesture | gesture | A move of your body that can show what you feel. | A wave is a ___ that many people understand. | gesture (full) | gesture (full) ; gestures (partial) | border ; ceremony ; needle |
| g4u09.w.giggle | giggle | To laugh in a funny way when you are nervous. | He looked so funny that the girls ___ when they looked at him. | giggled (full) | giggle (full) ; giggled (full) | sigh ; ignore ; greet |
| g4u09.w.goth | goth | A young man or woman who wears black and likes dark music. | Everything she wears is black, so she must be a ___. | goth (full) | goth (full) ; goths (partial) | devil ; bride ; needle |
| g4u09.w.greet | greet | To welcome people and wave when you meet them. | We ___ our friends when we meet them. | greet (full) | greet (full) | bury ; ignore ; insult |
| g4u09.w.hastily | hastily | Doing a thing far too fast and without care. | She did it too fast and ___. | hastily (full) | hastily (full) | firstly ; permanent ; religious |
| g4u09.w.health-risk | health risk | A thing that can be bad or dangerous for your body. | Body art can be a ___ because of dirty needles. | health risk (full) | health risk (full) ; health risks (partial) | funeral ; ceremony ; gesture |
| g4u09.w.ignore | ignore | To look away and give people no care at all. | She did not even look at me and just ___ me. | ignored (full) | ignore (full) ; ignored (full) | greet ; insult ; bury |
| g4u09.w.in-common | in common | You use it when two friends like or do much of what the one likes. | My friend and I both like this music, so we have much ___. | in common (full) | in common (full) | fashionable ; permanent ; religious |
| g4u09.w.index-finger | index finger | The one next to your thumb that you use to show the way. | She used her ___ to show us the way on the map. | index finger (full) | index finger (full) ; index fingers (partial) | thumb ; palm ; sleeve |
| g4u09.w.insult | insult | To do or call out a rude thing that makes people sad or angry. | A rude sign can ___ people in some countries. | insult (full) | insult (full) ; insulted (partial) | greet ; ignore ; bury |
| g4u09.w.needle | needle | A very thin, sharp piece of metal that can make a small hole. | The ___ makes a hole in your ear for the earring. | needle (full) | needle (full) ; needles (partial) | sleeve ; palm ; thumb |
| g4u09.w.nod-the-head | nod the head | To move it up and down to show that you agree. | If you agree with me, just ___. | nod the head (full) ; nod your head (full) | nod the head (full) ; nod your head (full) | greet ; ignore ; communicate |
| g4u09.w.palm | palm | The inside of your hand below your fingers. | Your fingers and your thumb are joined to your ___. | palm (full) | palm (full) ; palms (partial) | thumb ; sleeve ; needle |
| g4u09.w.pass-something-on | pass something on | To give a thing to the next one after you have had it. | After you read this note, please ___. | pass something on (full) ; pass it on (full) | pass something on (full) ; pass on (partial) | greet ; bury ; ignore |
| g4u09.w.permanent | permanent | It stays and does not go away. | A mark on your skin can be ___ and stay there forever. | permanent (full) | permanent (full) | fashionable ; religious ; rebellious |
| g4u09.w.pierced | pierced | When a small hole is now in your ear or skin. | When your ear is ___ you can wear an earring. | pierced (full) | pierced (full) | religious ; confused ; embarrassed |
| g4u09.w.possibility | possibility | A thing that may happen but is not for sure. | Is there a ___ that you may not come? | possibility (full) | possibility (full) ; possibilities (partial) | ceremony ; victory ; border |
| g4u09.w.rebellious | rebellious | Not wanting to do what the rules want. | She did not like school and she was ___. | rebellious (full) | rebellious (full) | religious ; fashionable ; confused |
| g4u09.w.religious | religious | You go to a church to pray and you love your god. | ___ people go to church and pray. | religious (full) ; Religious (full) | religious (full) | rebellious ; fashionable ; permanent |
| g4u09.w.scare-off | scare off | To make people or a dog so afraid that they go away. | The dogs ___ the small dog in the garden. | scared off (full) | scare off (full) ; scared off (full) | greet ; bury ; ignore |
| g4u09.w.sigh | sigh | To breathe out and show that you are sad or tired. | That is so boring, she ___. | sighed (full) | sigh (full) ; sighed (full) | giggle ; ignore ; greet |
| g4u09.w.sitting-room | sitting room | The space at home where people relax and watch TV. | We drink tea in the ___. | sitting room (full) | sitting room (full) ; sitting rooms (partial) ; living room (partial) | sleeve ; palm ; needle |
| g4u09.w.sleeve | sleeve | It covers your arm on a shirt or jumper. | Do you like shirts with long or short ___? | sleeves (full) | sleeve (full) ; sleeves (full) | palm ; thumb ; needle |
| g4u09.w.thumb | thumb | The short, thick finger that is not one of the four fingers. | You can hold your ___ up to show that everything is OK. | thumb (full) | thumb (full) ; thumbs (partial) | palm ; sleeve ; needle |
| g4u09.w.victory | victory | When you are best in a match, a fight or a war. | It was a great ___ and everyone was very happy. | victory (full) | victory (full) ; victories (partial) | border ; ceremony ; funeral |
| g4u09.w.wedding-dress | wedding dress | The long white clothes a bride wears to marry. | The bride wears a beautiful white ___. | wedding dress (full) | wedding dress (full) ; wedding dresses (partial) | wedding suit ; bridesmaid ; bridegroom |
| g4u09.w.wedding-suit | wedding suit | The dark jacket and trousers a bridegroom wears to marry. | The bridegroom wears a dark ___. | wedding suit (full) | wedding suit (full) ; wedding suits (partial) | wedding dress ; bride ; bridesmaid |
| g4u09.w.zero | zero | The number 0; not one, not any. | When the weather is very cold the temperature can drop to ___. | zero (full) | zero (full) | victory ; border ; gesture |

## Grammar items (58)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g4u09.gi.modals-possibility.cp.001 | context-picker | Du weißt nicht, wo Katia ist. Welcher Satz ist richtiges Englisch und zeigt, dass du unsicher bist? [de] | She might be at the library. (full) | — | She might to be at the library. ; She might are at the library. ; She might is at the library. | — | — | false |
| g4u09.gi.modals-possibility.cp.002 | context-picker | Du warnst, dass eine "OK"-Geste im Ausland nur vielleicht unhöflich ist. Welcher Satz ist am besten? [de] | In some countries it could be very rude. (full) | — | In some countries it could to be very rude. ; In some countries it can be very rude for sure. ; In some countries it could is very rude. | — | — | false |
| g4u09.gi.modals-possibility.ec.001 | error-correction | She might to come home later. [en] | She might come home later. (full) ; might come (partial) | — | — | — | — | true |
| g4u09.gi.modals-possibility.ec.002 | error-correction | It may to rain this afternoon. [en] | It may rain this afternoon. (full) ; may rain (partial) | — | — | — | — | true |
| g4u09.gi.modals-possibility.ec.003 | error-correction | She may needs help. [en] | She may need help. (full) ; may need (partial) | — | — | — | — | true |
| g4u09.gi.modals-possibility.ec.004 | error-correction | He could bes confused here. [en] | He could be confused here. (full) ; could be (partial) | — | — | — | — | true |
| g4u09.gi.modals-possibility.ec.005 | error-correction | It can rain tomorrow, so take an umbrella. [en] | It might rain tomorrow, so take an umbrella. (full) ; It may rain tomorrow, so take an umbrella. (full) ; It could rain tomorrow, so take an umbrella. (full) | — | — | — | — | false |
| g4u09.gi.modals-possibility.ec.006 | error-correction | She can be at school — I'm not sure. [en] | She might be at school — I'm not sure. (full) ; She may be at school — I'm not sure. (full) ; She could be at school — I'm not sure. (full) | — | — | — | — | false |
| g4u09.gi.modals-possibility.ec.007 | error-correction | In Brazil, the "OK" sign may insults people. [en] | In Brazil, the "OK" sign may insult people. (full) ; may insult (partial) | — | — | — | — | true |
| g4u09.gi.modals-possibility.ec.008 | error-correction | He may comes to the wedding. [en] | He may come to the wedding. (full) ; may come (partial) | — | — | — | — | true |
| g4u09.gi.modals-possibility.ec.009 | error-correction | It can get cold tonight, so bring a jacket. [en] | It might get cold tonight, so bring a jacket. (full) ; It may get cold tonight, so bring a jacket. (full) ; It could get cold tonight, so bring a jacket. (full) | — | — | — | — | false |
| g4u09.gi.modals-possibility.ec.010 | error-correction | It can snow tonight, so be careful on the roads. [en] | It might snow tonight, so be careful on the roads. (full) ; It may snow tonight, so be careful on the roads. (full) ; It could snow tonight, so be careful on the roads. (full) | — | — | — | — | false |
| g4u09.gi.modals-possibility.gf.001 | gap-fill | It's very cloudy. It ___ rain today. [en, 1 blank(s)] | might (full) ; may (full) ; could (full) | — | — | — | — | false |
| g4u09.gi.modals-possibility.gf.002 | gap-fill | Katia is not here. She ___ be busy. [en, 1 blank(s)] | might (full) ; may (full) ; could (full) | — | — | — | — | false |
| g4u09.gi.modals-possibility.gf.003 | gap-fill | In Greece, nodding your head ___ mean "no". [en, 1 blank(s)] | may (full) ; might (full) ; could (full) | — | — | — | — | false |
| g4u09.gi.modals-possibility.gf.004 | gap-fill | I'm not sure where Katia is. She ___ be at school. [en, 1 blank(s)] | might (full) ; may (full) ; could (full) | — | — | — | — | false |
| g4u09.gi.modals-possibility.gf.005 | gap-fill | Don't worry about the dog. It ___ not be dangerous. [en, 1 blank(s)] | might (full) ; may (full) | — | — | — | — | false |
| g4u09.gi.modals-possibility.gf.006 | gap-fill | Number 1 ___ be Chinese, or it ___ be Japanese. I'm not sure. [en, 2 blank(s)] | might \| may (full) ; may \| might (full) ; could \| might (full) ; might \| might (full) ; may \| could (full) ; could \| could (full) | — | — | — | — | false |
| g4u09.gi.modals-possibility.gf.007 | gap-fill | Don't touch the red button! It ___ explode. [en, 1 blank(s)] | could (full) ; might (full) ; may (full) | — | — | — | — | false |
| g4u09.gi.modals-possibility.gf.008 | gap-fill | Take the umbrella with you. We ___ need it later. [en, 1 blank(s)] | may (full) ; might (full) ; could (full) | — | — | — | — | false |
| g4u09.gi.modals-possibility.gf.009 | gap-fill | Be careful with that gesture. It ___ insult people in some countries. [en, 1 blank(s)] | might (full) ; may (full) ; could (full) | — | — | — | — | false |
| g4u09.gi.modals-possibility.gf.010 | gap-fill | Where's Lucy? She ___ be at home, or she ___ be at the library. I really don't know. [en, 2 blank(s)] | could \| could (full) ; might \| might (full) ; may \| may (full) ; could \| might (full) ; might \| could (full) ; may \| might (full) | — | — | — | — | false |
| g4u09.gi.modals-possibility.gf.011 | gap-fill | Don't stroke the snake! It ___ bite. [en, 1 blank(s)] | could (full) ; might (full) ; may (full) | — | — | — | — | false |
| g4u09.gi.modals-possibility.gf.012 | gap-fill | People in the Far East ___ feel strange if you keep too far away. [en, 1 blank(s)] | may (full) ; might (full) ; could (full) | — | — | — | — | false |
| g4u09.gi.modals-possibility.gf.013 | gap-fill | Jessica isn't here now. She ___ come later, but she ___ not come at all. [en, 2 blank(s)] | might \| might (full) ; may \| may (full) ; could \| might (full) ; might \| may (full) ; may \| might (full) | — | — | — | — | false |
| g4u09.gi.modals-possibility.gf.014 | gap-fill | He's from Hungary, but his English is perfect. He ___ be a teacher. [en, 1 blank(s)] | could (full) ; might (full) ; may (full) | — | — | — | — | false |
| g4u09.gi.modals-possibility.gf.015 | gap-fill | Katia is new here. She ___ be a little confused. [en, 1 blank(s)] | might (full) ; may (full) ; could (full) | — | — | — | — | false |
| g4u09.gi.modals-possibility.gf.016 | gap-fill | Felicity ___ wear the dress for the wedding, but I'm not sure. [en, 1 blank(s)] | might (full) ; may (full) ; could (full) | — | — | — | — | false |
| g4u09.gi.modals-possibility.gs.001 | group-sort | Richtig nach may/could (einfache Form) oder falsch? [de] | — | — | — | — | may + be: may be, could come, may rain \| may + to be: may to be, could to rain, mays be | false |
| g4u09.gi.modals-possibility.gs.002 | group-sort | Gutes Englisch oder nicht? [de] | — | — | — | — | may + rain: It may rain., She could be busy. \| may + to rain: It may to rain., She could bes busy. | false |
| g4u09.gi.modals-possibility.mc.001 | multiple-choice | Du weißt nicht, wo sie ist. Welcher Satz ist richtig? [de] | She might be at home. (full) | — | She might to be at home. ; She might are at home. ; She might is at home. | — | — | false |
| g4u09.gi.modals-possibility.mc.002 | multiple-choice | Es ist grau und bewölkt. Welcher Satz zeigt nur eine Möglichkeit? [de] | It might rain today. (full) | — | It will rain for sure today. ; It might to rain today. ; It can rain for sure today. | — | — | false |
| g4u09.gi.modals-possibility.mc.003 | multiple-choice | Es ist nur möglich, nicht sicher. Welcher Satz nutzt may für eine Möglichkeit? [de] | People may be confused in Japan. (full) | — | People may to be confused in Japan. ; People may is confused in Japan. ; People may confused in Japan. | — | — | false |
| g4u09.gi.modals-possibility.mc.004 | multiple-choice | Es ist etwas bewölkt. Welcher Satz zeigt die Möglichkeit richtig? [de] | It could rain this weekend. (full) | — | It can rain this weekend. ; It could to rain this weekend. ; It could be rain this weekend. | — | — | false |
| g4u09.gi.modals-possibility.mc.005 | multiple-choice | She ___ be confused, but I'm really not sure. [en, 1 blank(s)] | might (full) ; may (full) ; could (full) | — | will ; must ; can | — | — | false |
| g4u09.gi.modals-possibility.mc.006 | multiple-choice | Du warnst vor einer Geste, die im Ausland nur vielleicht unhöflich ist. Welcher Satz ist am besten? [de] | Be careful — it could be rude! (full) | — | Be careful — it is rude for sure! ; Be careful — it could to be rude! ; Be careful — it could is rude! | — | — | false |
| g4u09.gi.modals-possibility.mc.007 | multiple-choice | Tante Nancy hofft, dass Felicity am Hochzeitstag das Kleid trägt. Mum ist nicht sicher. Welche Antwort ist richtig? [de] | She might wear the dress. (full) | — | She might to wear the dress. ; She might is wear the dress. ; She might are wear the dress. | — | — | false |
| g4u09.gi.modals-possibility.mt.001 | matching | Welche Antwort passt zu welcher Zeile? [de] | — | — | — | It's grey and cloudy. ↔ It might rain soon. ; She is not at home. ↔ She could be at work. ; The dog looks angry. ↔ It may bite, so be careful. ; He is from Hungary but his English is perfect. ↔ He might be a teacher. | — | false |
| g4u09.gi.modals-possibility.mt.002 | matching | Welches Ende passt zu welchem Anfang? [de] | — | — | — | In Greece, a nod of the head ↔ may mean "no". ; A sign with two fingers ↔ could insult people in some places. ; People in Japan ↔ might smile when they are confused. ; The "OK" sign ↔ may be very rude in Brazil. | — | false |
| g4u09.gi.modals-possibility.qf.001 | question-formation | Bei den Nachbarn brennt Licht. Frag deinen Freund, ob sie vielleicht zu Hause sind. Beginne mit: Do you think ... [de] | Do you think they might be home? (full) ; Do you think they may be home? (full) ; Do you think they could be home? (full) | — | — | — | — | false |
| g4u09.gi.modals-possibility.qf.002 | question-formation | Deine Freundin ist heute nicht in der Schule. Du weißt nicht warum. Frag: Do you think ... [de] | Do you think she might be ill? (full) ; Do you think she may be ill? (full) ; Do you think she could be ill? (full) | — | — | — | — | false |
| g4u09.gi.modals-possibility.sb.001 | sentence-building | be / she / at / might / home [en] | She might be at home. (full) | — | — | — | — | false |
| g4u09.gi.modals-possibility.sb.002 | sentence-building | rain / it / may / tomorrow [en] | It may rain tomorrow. (full) | — | — | — | — | false |
| g4u09.gi.modals-possibility.sb.003 | sentence-building | be / they / not / could / right [en] | They could not be right. (full) | — | — | — | — | false |
| g4u09.gi.modals-possibility.sb.004 | sentence-building | you / surprised / might / be / in / Greece [en] | You might be surprised in Greece. (full) | — | — | — | — | false |
| g4u09.gi.modals-possibility.sb.005 | sentence-building | people / insult / it / could / some / in / countries [en] | It could insult people in some countries. (full) | — | — | — | — | false |
| g4u09.gi.modals-possibility.sb.006 | sentence-building | help / these / may / questions / you [en] | These questions may help you. (full) | — | — | — | — | false |
| g4u09.gi.modals-possibility.tf.001 | transformation | Maybe it will snow tonight. → It ___ tonight. [en, 1 blank(s)] | might snow (full) ; may snow (full) ; could snow (full) | — | — | — | — | false |
| g4u09.gi.modals-possibility.tf.002 | transformation | It's possible he knows the answer. (may) → He ___ the answer. [en, 1 blank(s)] | may know (full) | — | — | — | — | false |
| g4u09.gi.modals-possibility.tf.003 | transformation | It's possible the dog bites. (could) → It ___. [en, 1 blank(s)] | could bite (full) | — | — | — | — | false |
| g4u09.gi.modals-possibility.tf.004 | transformation | Perhaps she is busy. (might) → She ___ busy. [en, 1 blank(s)] | might be (full) | — | — | — | — | false |
| g4u09.gi.modals-possibility.tf.005 | transformation | Perhaps they will not come to the wedding. (may) → They ___ to the wedding. [en, 1 blank(s)] | may not come (full) | — | — | — | — | false |
| g4u09.gi.modals-possibility.tf.006 | transformation | It's possible the gesture insults people. (might) → The gesture ___ people. [en, 1 blank(s)] | might insult (full) | — | — | — | — | false |
| g4u09.gi.modals-possibility.tf.007 | transformation | Maybe she will visit Japan next year. (could) → She ___ Japan next year. [en, 1 blank(s)] | could visit (full) | — | — | — | — | false |
| g4u09.gi.modals-possibility.tr.001 | translation | Es könnte heute regnen. [de] | It might rain today. (full) ; It may rain today. (full) ; It could rain today. (full) | deToEn | — | — | — | false |
| g4u09.gi.modals-possibility.tr.003 | translation | Er kommt vielleicht morgen. [de] | He might come tomorrow. (full) ; He may come tomorrow. (full) ; He could come tomorrow. (full) | deToEn | — | — | — | false |
| g4u09.gi.modals-possibility.tr.005 | translation | Mia ist vielleicht zu Hause. [de] | Mia might be at home. (full) ; Mia may be at home. (full) ; Mia could be at home. (full) | deToEn | — | — | — | false |
| g4u09.gi.modals-possibility.tr.007 | translation | Die Gäste kommen vielleicht nicht. [de] | They might not come. (full) ; They may not come. (full) ; The guests might not come. (full) ; The guests may not come. (full) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g4-u09/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g4-u09",
  "lens": "answers",
  "itemsHash": "aadd09d9825e",
  "promptHash": "70fa2d8cdf22",
  "round": 1,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 101, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
