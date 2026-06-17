# Verify lens — answers — g3-u09 (round 1)

<!-- domigo:verify answers g3-u09 items=154d2fd32a41 prompt=70fa2d8cdf22 round=1 -->

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

## Vocab items (39)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g3u09.w.community | community | the people who live in one place | All the people in our ___ work to keep the park clean. | community (full) ; communities (partial) | community (full) | journalist ; modern technology ; litter-picking |
| g3u09.w.conservative | conservative | wanting to keep the old way of life and not wanting anything new | The most ___ groups keep all the old traditions and use no machines. | conservative (full) | conservative (full) | strict ; rude ; modern technology |
| g3u09.w.for-a-change | for a change | when you do one thing not like you always do | Let's go to school on foot today ___. | for a change (full) | for a change (full) | It depends. ; Never mind! ; plenty |
| g3u09.w.it-depends | It depends. | a way to tell a friend it is not always yes or no | Are you allowed to stay up at the weekend? — ___ I can, but not on school nights. | It depends. (full) ; It depends (full) | It depends. (full) ; It depends (full) | It's a pity. ; Never mind! ; for a change |
| g3u09.w.it-s-a-pity | It's a pity. | a way to show you feel bad that a good thing did not happen | You can't come to the match on Saturday? ___ We wanted you with us. | It's a pity. (full) ; It's a pity (full) | It's a pity. (full) ; It's a pity (full) | It depends. ; Never mind! ; for a change |
| g3u09.w.journalist | journalist | a man or woman who writes stories for a newspaper | My dad's friend is a ___ at the local paper. | journalist (full) ; journalists (partial) | journalist (full) | community ; modern technology ; litter-picking |
| g3u09.w.litter-picking | litter-picking | cleaning rubbish from the ground outside | How about we organise a ___ day at the park? | litter-picking (full) ; litter picking (partial) | litter-picking (full) ; litter picking (full) | journalist ; community ; modern technology |
| g3u09.w.modern-technology | modern technology | new tools and machines like tablets that we use today | The most conservative Amish groups do not use ___, like machines. | modern technology (full) | modern technology (full) | community ; journalist ; litter-picking |
| g3u09.w.never-mind | Never mind! | a way to tell a friend it is OK and not bad | Sorry about that! — ___ It is no problem. | Never mind! (full) ; Never mind (full) | Never mind! (full) ; Never mind (full) | It depends. ; It's a pity. ; for a change |
| g3u09.w.plenty | plenty | more than you need of a thing | There is ___ of pizza for all the guests. | plenty (full) | plenty (full) | strict ; rude ; conservative |
| g3u09.w.rude | rude | not nice when you speak to people | When some people asked them to stop, they were ___. | rude (full) | rude (full) | strict ; conservative ; unbelievable |
| g3u09.w.strict | strict | having many rules and wanting people to follow them | Our maths teacher is very ___ and we must do everything on time. | strict (full) | strict (full) | rude ; conservative ; unbelievable |
| g3u09.w.to-adopt | to adopt | to begin using a new way | Our school will ___ a new rule about mobile phones from September. | adopt (full) | to adopt (full) ; adopt (full) | to pray ; to punish ; to sort out |
| g3u09.w.to-be-allowed-to-do-sth | to be allowed to do sth. | to have permission to do a thing | We are ___ use our tablets at break, but not in class. | allowed to (full) ; be allowed to (partial) | to be allowed to do sth. (full) ; be allowed to do sth. (full) ; to be allowed to (full) ; allowed to (full) | to stay up ; to invite sb. over ; to sort out |
| g3u09.w.to-buy-your-own-clothes | to buy your own clothes | to pay for what you wear yourself, with your pocket money. | You are allowed to ___ now with your own pocket money. | buy your own clothes (full) | to buy your own clothes (full) ; buy your own clothes (full) | to have a party at home ; to wear earrings ; to go to the disco |
| g3u09.w.to-come-home-after-ten | to come home after ten | to be back at your place late in the evening. | My strict parents do not let me ___ on school nights. | come home after ten (full) | to come home after ten (full) ; come home after ten (full) | to stay up ; to go to the disco ; to have a party at home |
| g3u09.w.to-dye-your-hair | to dye your hair | to change the colour of what grows on your head. | Mum lets you ___ a bright green for the summer. | dye your hair (full) | to dye your hair (full) ; dye your hair (full) | to wear earrings ; to get a tattoo ; to get a nose stud |
| g3u09.w.to-eat-too-many-sweets | to eat too many sweets | to have more sugar and chocolate than is good for your teeth | It is not good for your teeth to ___ every day. | eat too many sweets (full) | to eat too many sweets (full) ; eat too many sweets (full) | to play video games all day ; to ride your bike without a helmet ; to go to the disco |
| g3u09.w.to-freeze | to freeze | to become very cold | She is from a hot country, so she will ___ over here in the snow. | freeze (full) | to freeze (full) ; freeze (full) | to pray ; to lend ; to punish |
| g3u09.w.to-get-a-nose-stud | to get a nose stud | to have a small piece of metal put through the skin on your face. | My little sister wants to ___ but Mum hates them. | get a nose stud (full) | to get a nose stud (full) ; get a nose stud (full) | to get a tattoo ; to wear earrings ; to dye your hair |
| g3u09.w.to-get-a-tattoo | to get a tattoo | to have a picture put on your skin that stays forever | My big sister wants to ___ of a small rose on her arm. | get a tattoo (full) | to get a tattoo (full) ; get a tattoo (full) | to get a nose stud ; to dye your hair ; to wear earrings |
| g3u09.w.to-go-roller-skating-without-pads | to go roller-skating without pads | to move fast on wheels with nothing on your knees to protect you. | It is dangerous to ___ because you can hurt your knees when you fall down. | go roller-skating without pads (full) | to go roller-skating without pads (full) ; go roller-skating without pads (full) | to ride your bike without a helmet ; to go to the disco ; to play video games all day |
| g3u09.w.to-go-to-the-disco | to go to the disco | to spend an evening out dancing to music | Are you allowed to ___ on Saturday and dance? | go to the disco (full) | to go to the disco (full) ; go to the disco (full) | to have a party at home ; to hang out in shopping centres ; to stay up |
| g3u09.w.to-hang-out-in-shopping-centres | to hang out in shopping centres | to spend time with friends in the shops and do nothing much | After school we like to ___ and look at the shops. | hang out in shopping centres (full) | to hang out in shopping centres (full) ; hang out in shopping centres (full) | to go to the disco ; to play video games all day ; to have a party at home |
| g3u09.w.to-have-a-party-at-home | to have a party at home | to invite friends over to your place to eat and dance | Can I ___ for my birthday and ask ten friends over? | have a party at home (full) | to have a party at home (full) ; have a party at home (full) | to go to the disco ; to hang out in shopping centres ; to play video games all day |
| g3u09.w.to-invite-sb-over | to invite sb. over | to ask a friend to come to your place | Are you allowed to ___ for dinner tonight? | invite friends over (full) ; invite a friend over (full) ; invite sb. over (partial) | to invite sb. over (full) ; invite sb. over (full) ; invite over (full) | to stay up ; to sort out ; to remind sb. |
| g3u09.w.to-lend | to lend | to give a thing to a friend for a short time | I could ___ her some of my clothes if you like. | lend (full) | to lend (full) ; lend (full) | to freeze ; to remind sb. ; to sort out |
| g3u09.w.to-play-video-games-all-day | to play video games all day | to spend many hours at a screen, from morning to night. | On rainy days he likes to ___ from morning to night. | play video games all day (full) | to play video games all day (full) ; play video games all day (full) | to watch TV after 10 o'clock ; to scroll through your phone ; to go to the disco |
| g3u09.w.to-pray | to pray | to talk to God | The families in her church group often meet to ___. | pray (full) | to pray (full) ; pray (full) | to punish ; to adopt ; to freeze |
| g3u09.w.to-punish | to punish | to give a child a bad time because they were bad | My parents ___ me when I am bad and take away my tablet. | punish (full) ; punished (full) | to punish (full) ; punish (full) | to pray ; to remind sb. ; to adopt |
| g3u09.w.to-remind-sb | to remind sb. | to make a friend think of a thing again | Please ___ me to bring my book tomorrow. | remind (full) | to remind sb. (full) ; remind sb. (full) ; remind (full) | to lend ; to invite sb. over ; to sort out |
| g3u09.w.to-ride-your-bike-without-a-helmet | to ride your bike without a helmet | to cycle with nothing on your head to protect you | You should not ___ on a busy road because it is not safe. | ride your bike without a helmet (full) | to ride your bike without a helmet (full) ; ride your bike without a helmet (full) | to go roller-skating without pads ; to come home after ten ; to play video games all day |
| g3u09.w.to-scroll-through-your-phone | to scroll through your phone | to move your finger up and down on a small screen to look at pictures and chats | You can be on the sofa for hours and ___, looking at pictures. | scroll through your phone (full) | to scroll through your phone (full) ; scroll through your phone (full) | to play video games all day ; to watch TV after 10 o'clock ; to turn your music up loud |
| g3u09.w.to-sort-out | to sort out | to look at all your clothes and keep some and give some away | I'm going to ___ my clothes and give the old ones to Bianca. | sort out (full) | to sort out (full) ; sort out (full) | to invite sb. over ; to remind sb. ; to lend |
| g3u09.w.to-stay-up | to stay up | to be awake at night and not go to bed | On Saturdays I can ___ and watch a film with my friends. | stay up (full) ; stayed up (partial) | to stay up (full) ; stay up (full) | to invite sb. over ; to sort out ; to remind sb. |
| g3u09.w.to-turn-your-music-up-loud | to turn your music up loud | to make a sound so strong that everyone around can hear it. | Please do not ___ now because I want to study. | turn your music up loud (full) | to turn your music up loud (full) ; turn your music up loud (full) | to have a party at home ; to go to the disco ; to play video games all day |
| g3u09.w.to-watch-tv-after-10-o-clock | to watch TV after 10 o'clock | to be in front of a screen very late at night. | I am not allowed to ___ on school nights, so I go to bed early. | watch TV after 10 o'clock (full) ; watch TV after ten (partial) | to watch TV after 10 o'clock (full) ; watch TV after 10 o'clock (full) | to stay up ; to play video games all day ; to come home after ten |
| g3u09.w.to-wear-earrings | to wear earrings | to have small rings on your ears | She got her ears pierced and now likes to ___ to school every day. | wear earrings (full) | to wear earrings (full) ; wear earrings (full) | to get a nose stud ; to get a tattoo ; to dye your hair |
| g3u09.w.unbelievable | unbelievable | so amazing or strange that it is very surprising | There was rubbish all over the park. It's ___! | unbelievable (full) | unbelievable (full) | rude ; strict ; conservative |

## Grammar items (93)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g3u09.gi.be-allowed-to.cp.001 | context-picker | Im Park gilt eine neue Regel: Kinder dürfen nach 20 Uhr nicht mehr dort sein. Welcher Satz sagt das richtig? [de] | Kids aren't allowed to be in the park after 8 p.m. (full) | — | Kids don't allowed to be in the park after 8 p.m. ; Kids aren't allowed be in the park after 8 p.m. ; Kids aren't allowed to being in the park after 8 p.m. | — | — | true |
| g3u09.gi.be-allowed-to.cp.002 | context-picker | Du erzählst von einer Hausregel: Du darfst dein Handy im Bett nicht benutzen. Welcher Satz ist richtig? [de] | I'm not allowed to use my phone in bed. (full) | — | I not allowed to use my phone in bed. ; I'm not allowed use my phone in bed. ; I'm not allowed to using my phone in bed. | — | — | true |
| g3u09.gi.be-allowed-to.cp.003 | context-picker | Deine Freundin darf zu Hause Partys feiern. Welcher Satz sagt das richtig? [de] | She's allowed to have parties at home. (full) | — | She allowed to have parties at home. ; She are allowed to have parties at home. ; She's allowed to having parties at home. | — | — | false |
| g3u09.gi.be-allowed-to.ec.001 | error-correction | Finde und verbessere den Fehler: I not allowed to eat too many sweets. [de] | I'm not allowed to eat too many sweets. (full) ; I am not allowed to eat too many sweets. (full) ; I'm not allowed to eat too many sweets (full) | — | — | — | — | true |
| g3u09.gi.be-allowed-to.ec.002 | error-correction | Finde und verbessere den Fehler: She are allowed to go to the disco on Saturday. [de] | She is allowed to go to the disco on Saturday. (full) ; She's allowed to go to the disco on Saturday. (full) ; She is allowed to go to the disco on Saturday (full) | — | — | — | — | false |
| g3u09.gi.be-allowed-to.ec.003 | error-correction | Finde und verbessere den Fehler: We aren't allowed go roller-skating without pads. [de] | We aren't allowed to go roller-skating without pads. (full) ; We are not allowed to go roller-skating without pads. (full) ; We aren't allowed to go roller-skating without pads (full) | — | — | — | — | true |
| g3u09.gi.be-allowed-to.ec.004 | error-correction | Finde und verbessere den Fehler: He is allowed to rides his bike to school. [de] | He is allowed to ride his bike to school. (full) ; He's allowed to ride his bike to school. (full) ; He is allowed to ride his bike to school (full) | — | — | — | — | false |
| g3u09.gi.be-allowed-to.ec.005 | error-correction | Finde und verbessere den Fehler: We don't allowed to eat in the classroom. [de] | We aren't allowed to eat in the classroom. (full) ; We are not allowed to eat in the classroom. (full) ; We aren't allowed to eat in the classroom (full) | — | — | — | — | true |
| g3u09.gi.be-allowed-to.ec.006 | error-correction | Finde und verbessere den Fehler: Is they allowed to have a party at home? [de] | Are they allowed to have a party at home? (full) ; Are they allowed to have a party at home (full) | — | — | — | — | false |
| g3u09.gi.be-allowed-to.ff.001 | free-form | Schreib einen wahren Satz über eine Regel bei dir zu Hause mit be (not) allowed to. Beispiel: I'm not allowed to watch TV after 10 o'clock. [de] | I'm not allowed to watch TV after 10 o'clock. (full) ; I'm allowed to buy my own clothes. (full) ; I'm not allowed to get a tattoo. (full) ; I'm allowed to go to the disco on Saturdays. (partial) ; I'm not allowed to dye my hair. (partial) | — | — | — | — | false |
| g3u09.gi.be-allowed-to.gf.001 | gap-fill | We ___ allowed to use our phones in class. [en, 1 blank(s)] | aren't (full) ; are not (full) | — | — | — | — | true |
| g3u09.gi.be-allowed-to.gf.002 | gap-fill | ___ you allowed to stay up late on Fridays? [en, 1 blank(s)] | Are (full) | — | — | — | — | false |
| g3u09.gi.be-allowed-to.gf.003 | gap-fill | She ___ allowed to stay up until 10 o'clock. [en, 1 blank(s)] | is (full) ; 's (partial) | — | — | — | — | false |
| g3u09.gi.be-allowed-to.gf.004 | gap-fill | I ___ allowed to go to the disco on my own. [en, 1 blank(s)] | am (full) ; 'm (partial) | — | — | — | — | false |
| g3u09.gi.be-allowed-to.gf.005 | gap-fill | My little brother ___ allowed to play video games all day. [en, 1 blank(s)] | isn't (full) ; is not (full) | — | — | — | — | true |
| g3u09.gi.be-allowed-to.gf.006 | gap-fill | At our school, students ___ allowed to turn their music up loud. [en, 1 blank(s)] | aren't (full) ; are not (full) | — | — | — | — | true |
| g3u09.gi.be-allowed-to.gf.007 | gap-fill | On the farm, kids ___ allowed to feed the animals, but only with help. [en, 1 blank(s)] | are (full) ; 're (partial) | — | — | — | — | false |
| g3u09.gi.be-allowed-to.gf.008 | gap-fill | Sean ___ allowed to charge money for the village tours. [en, 1 blank(s)] | isn't (full) ; is not (full) | — | — | — | — | true |
| g3u09.gi.be-allowed-to.gf.009 | gap-fill | ___ they allowed to hang out in shopping centres after school? [en, 1 blank(s)] | Are (full) | — | — | — | — | false |
| g3u09.gi.be-allowed-to.gf.010 | gap-fill | He ___ allowed to wear earrings at his new school. [en, 1 blank(s)] | isn't (full) ; is not (full) | — | — | — | — | true |
| g3u09.gi.be-allowed-to.gf.011 | gap-fill | ___ you allowed to ___ a nose stud, or do your parents say no? [en, 2 blank(s)] | Are \| get (full) | — | — | — | — | false |
| g3u09.gi.be-allowed-to.gf.012 | gap-fill | My friend ___ allowed to come home after ten, but I ___ . [en, 2 blank(s)] | is \| am not (full) ; is \| 'm not (partial) | — | — | — | — | true |
| g3u09.gi.be-allowed-to.gf.013 | gap-fill | They ___ allowed to hold and feed the animals on the farm. [en, 1 blank(s)] | are (full) ; 're (partial) | — | — | — | — | false |
| g3u09.gi.be-allowed-to.gf.014 | gap-fill | None of us ___ allowed to go to the park any more. [en, 1 blank(s)] | are (full) ; is (partial) | — | — | — | — | false |
| g3u09.gi.be-allowed-to.gs.003 | group-sort | Sortiere: Ist das eine Erlaubnis oder ein Verbot? [de] | — | — | — | — | ✓: I'm allowed to go out., She's allowed to stay up late., We're allowed to wear earrings., They're allowed to have a party. \| ✗: I'm not allowed to go out., She isn't allowed to stay up late., We aren't allowed to wear earrings., They aren't allowed to have a party. | false |
| g3u09.gi.be-allowed-to.gs.004 | group-sort | Sortiere: Ist der Satz richtig oder falsch gebaut? [de] | — | — | — | — | ✓: She is allowed to go out., We aren't allowed to run., Are you allowed to stay up?, I'm not allowed to eat sweets. \| ✗: She are allowed to go out., We don't allowed to run., You allowed to stay up?, I'm not allowed to eating sweets. | false |
| g3u09.gi.be-allowed-to.mc.001 | multiple-choice | Welcher Satz ist richtig? [de] | We aren't allowed to run in the corridor. (full) | — | We don't allowed to run in the corridor. ; We not allowed to run in the corridor. ; We aren't allowed run in the corridor. | — | — | false |
| g3u09.gi.be-allowed-to.mc.002 | multiple-choice | Wähle den richtigen Satz über eine Regel zu Hause. [de] | I'm not allowed to play video games on school nights. (full) | — | I don't allowed to play video games on school nights. ; I'm not allowed to playing video games on school nights. ; I'm not allowed playing video games on school nights. | — | — | true |
| g3u09.gi.be-allowed-to.mc.003 | multiple-choice | Welche Frage nach Erlaubnis ist richtig? [de] | Are we allowed to use a dictionary in the test? (full) | — | Do we allowed to use a dictionary in the test? ; Are we allowed use a dictionary in the test? ; Is we allowed to use a dictionary in the test? | — | — | false |
| g3u09.gi.be-allowed-to.mc.004 | multiple-choice | Im Museum darf man keine Fotos machen. Welcher Satz sagt das richtig? [de] | You're not allowed to take photos in the museum. (full) | — | You're not allowed taking photos in the museum. ; You don't allowed to take photos in the museum. ; You not allowed to take photos in the museum. | — | — | true |
| g3u09.gi.be-allowed-to.mc.006 | multiple-choice | Welche Form von be passt: She ___ allowed to come home after ten. [de, 1 blank(s)] | is (full) | — | are ; am ; do | — | — | false |
| g3u09.gi.be-allowed-to.mp.001 | matching-pairs | Welcher Satz gehört zu welchem Zeichen? [de] | — | — | — | ✓ go to the disco ↔ I'm allowed to go to the disco. ; ✗ get a tattoo ↔ I'm not allowed to get a tattoo. ; ✓ buy my own clothes ↔ I'm allowed to buy my own clothes. ; ✗ stay out after ten ↔ I'm not allowed to stay out after ten. | — | false |
| g3u09.gi.be-allowed-to.mt.002 | matching | Welche Frage passt zu welcher Antwort? [de] | — | — | — | Are you allowed to get a tattoo? ↔ No, I'm not. My parents hate them. ; Is she allowed to stay up late? ↔ Yes, but only on Saturdays. ; Are they allowed to play in the park? ↔ No, not after 8 p.m. any more. ; Am I allowed to use your phone? ↔ Yes, of course you are. | — | false |
| g3u09.gi.be-allowed-to.mt.003 | matching | Welche Form von be passt zu welchem Anfang? [de] | — | — | — | I ↔ am allowed to go out. ; She ↔ is allowed to go out. ; We ↔ are allowed to go out. ; He isn't ↔ allowed to go out. | — | false |
| g3u09.gi.be-allowed-to.qf.001 | question-formation | Bilde die Frage: are / you / allowed / to / dye / your / hair [de] | Are you allowed to dye your hair? (full) ; Are you allowed to dye your hair (full) | — | — | — | — | false |
| g3u09.gi.be-allowed-to.qf.002 | question-formation | Lisa darf bis 21 Uhr draußen bleiben. Frag, bis wann sie draußen bleiben darf. Beginne mit 'What time'. [de] | What time is Lisa allowed to stay out until? (full) ; What time is Lisa allowed to stay out until (full) | — | — | — | — | false |
| g3u09.gi.be-allowed-to.sb.001 | sentence-building | not / you / are / to / allowed / run / here [en] | You are not allowed to run here. (full) ; You are not allowed to run here (full) | — | — | — | — | true |
| g3u09.gi.be-allowed-to.sb.002 | sentence-building | to / allowed / aren't / talk / we / in / the / library [en] | We aren't allowed to talk in the library. (full) ; We aren't allowed to talk in the library (full) | — | — | — | — | true |
| g3u09.gi.be-allowed-to.sb.003 | sentence-building | allowed / is / to / she / ride / her / bike / to / school [en] | She is allowed to ride her bike to school. (full) ; She is allowed to ride her bike to school (full) | — | — | — | — | false |
| g3u09.gi.be-allowed-to.tf.001 | transformation | Wandle in ein Verbot um: 'You can eat in class.' (jetzt mit be allowed to, verneint) [de] | You aren't allowed to eat in class. (full) ; You are not allowed to eat in class. (full) | — | — | — | — | true |
| g3u09.gi.be-allowed-to.tf.002 | transformation | Wandle um mit be allowed to: 'My parents say I can go to the park after school.' -> 'I ___ go to the park after school.' [de, 1 blank(s)] | am allowed to (full) ; 'm allowed to (partial) | — | — | — | — | false |
| g3u09.gi.be-allowed-to.tr.001 | translation | Wir dürfen im Unterricht keine Handys benutzen. [de] | We aren't allowed to use phones in class. (full) ; We are not allowed to use phones in class. (full) ; We aren't allowed to use our phones in class. (full) ; We aren't allowed to use phones in class (full) | deToEn | — | — | — | true |
| g3u09.gi.be-allowed-to.tr.002 | translation | Darf ich hier Fotos machen? [de] | Am I allowed to take photos here? (full) ; Am I allowed to take pictures here? (full) ; Am I allowed to take photos here (full) | deToEn | — | — | — | false |
| g3u09.gi.be-allowed-to.tr.003 | translation | Darf er nach zehn Uhr noch fernsehen? [de] | Is he allowed to watch TV after 10 o'clock? (full) ; Is he allowed to watch TV after ten o'clock? (full) ; Is he allowed to watch TV after 10 o'clock (full) | deToEn | — | — | — | false |
| g3u09.gi.be-allowed-to.tr.004 | translation | Darfst du zu Hause Partys feiern? [de] | Are you allowed to have parties at home? (full) ; Are you allowed to have parties at home (full) | deToEn | — | — | — | false |
| g3u09.gi.let.ag.001 | anagram | Buchstabensalat: Mehrere Personen erlauben etwas -> meine Eltern ___ mich gehen. -> T E L [de, 1 blank(s)] | let (full) | — | — | — | — | false |
| g3u09.gi.let.ag.002 | anagram | Buchstabensalat: Eine Person erlaubt etwas -> meine Mutter ___ mich fernsehen. -> S T E L [de, 1 blank(s)] | lets (full) | — | — | — | — | false |
| g3u09.gi.let.cp.001 | context-picker | Deine Eltern erlauben dir, am Samstag in die Disco zu gehen. Welcher Satz ist richtig? [de] | My parents let me go to the disco on Saturdays. (full) | — | My parents let me to go to the disco on Saturdays. ; My parents lets me go to the disco on Saturdays. ; My parents let me going to the disco on Saturdays. | — | — | false |
| g3u09.gi.let.cp.002 | context-picker | Deine Mutter ist streng. Sie erlaubt dir nicht, deine Haare zu färben. Welcher Satz ist richtig? [de] | My mum doesn't let me dye my hair. (full) | — | My mum doesn't let me to dye my hair. ; My mum don't let me dye my hair. ; My mum doesn't lets me dye my hair. | — | — | true |
| g3u09.gi.let.cp.003 | context-picker | Eure Lehrerin erlaubt euch, im Unterricht euer Tablet zu benutzen. Welcher Satz ist richtig? [de] | Our teacher lets us use our tablets in class. (full) | — | Our teacher lets us to use our tablets in class. ; Our teacher let us use our tablets in class. ; Our teacher lets us using our tablets in class. | — | — | false |
| g3u09.gi.let.ec.001 | error-correction | Finde und verbessere den Fehler: My parents let me to go to the park. [de] | My parents let me go to the park. (full) ; My parents let me go to the park (full) ; let me go (full) | — | — | — | — | false |
| g3u09.gi.let.ec.002 | error-correction | Finde und verbessere den Fehler: She lets me to use her computer. [de] | She lets me use her computer. (full) ; She lets me use her computer (full) ; lets me use (full) | — | — | — | — | false |
| g3u09.gi.let.ec.003 | error-correction | Finde und verbessere den Fehler: My dad doesn't lets me ride his bike. [de] | My dad doesn't let me ride his bike. (full) ; My dad doesn't let me ride his bike (full) ; doesn't let (full) | — | — | — | — | true |
| g3u09.gi.let.ec.004 | error-correction | Finde und verbessere den Fehler: The coach didn't letted us go home early. [de] | The coach didn't let us go home early. (full) ; The coach didn't let us go home early (full) ; didn't let (full) | — | — | — | — | true |
| g3u09.gi.let.ec.005 | error-correction | Finde und verbessere den Fehler: My dad let me to drive his car yesterday. [de] | My dad let me drive his car yesterday. (full) ; My dad let me drive his car yesterday (full) ; let me drive (full) | — | — | — | — | false |
| g3u09.gi.let.ec.006 | error-correction | Finde und verbessere den Fehler: My mum lets not me stay up late. [de] | My mum doesn't let me stay up late. (full) ; My mum doesn't let me stay up late (full) ; doesn't let (full) | — | — | — | — | true |
| g3u09.gi.let.ff.001 | free-form | Schreib einen wahren Satz über deine Eltern mit let oder don't let. Beispiel: My parents let me stay up late at the weekend. [de] | My parents let me play video games at the weekend. (full) ; My mum lets me watch TV after dinner. (full) ; My parents don't let me come home after ten. (full) ; My dad doesn't let me ride my bike without a helmet. (partial) ; They let me go to the disco on Saturdays. (partial) | — | — | — | — | false |
| g3u09.gi.let.gf.001 | gap-fill | My parents ___ me go to the disco on Saturdays. [en, 1 blank(s)] | let (full) | — | — | — | — | false |
| g3u09.gi.let.gf.002 | gap-fill | My mum ___ me watch TV after dinner. [en, 1 blank(s)] | lets (full) | — | — | — | — | false |
| g3u09.gi.let.gf.003 | gap-fill | Our teacher ___ us work in groups. [en, 1 blank(s)] | lets (full) | — | — | — | — | false |
| g3u09.gi.let.gf.004 | gap-fill | My dad doesn't let me ___ his phone without asking. [en, 1 blank(s)] | use (full) | — | — | — | — | true |
| g3u09.gi.let.gf.005 | gap-fill | My parents don't let me ___ my hair. [en, 1 blank(s)] | dye (full) | — | — | — | — | true |
| g3u09.gi.let.gf.006 | gap-fill | My mum doesn't ___ me eat sweets before dinner. [en, 1 blank(s)] | let (full) | — | — | — | — | true |
| g3u09.gi.let.gf.007 | gap-fill | My parents don't ___ me stay out after ten. [en, 1 blank(s)] | let (full) | — | — | — | — | true |
| g3u09.gi.let.gf.008 | gap-fill | My big sister lets me ___ her clothes. [en, 1 blank(s)] | borrow (full) ; wear (full) | — | — | — | — | false |
| g3u09.gi.let.gf.009 | gap-fill | Last weekend my parents ___ me stay at a friend's house. [en, 1 blank(s)] | let (full) | — | — | — | — | false |
| g3u09.gi.let.gf.010 | gap-fill | Dad ___ my sister ___ his bike. She's ten! [en, 2 blank(s)] | doesn't let \| ride (full) ; does not let \| ride (full) | — | — | — | — | true |
| g3u09.gi.let.gf.011 | gap-fill | My parents ___ me ___ video games at the weekend. [en, 2 blank(s)] | let \| play (full) | — | — | — | — | false |
| g3u09.gi.let.gf.012 | gap-fill | My older sister never ___ me ___ her earrings. [en, 2 blank(s)] | lets \| wear (full) | — | — | — | — | false |
| g3u09.gi.let.gs.001 | group-sort | Sortiere: Erlaubt es jemand (✓) oder erlaubt es jemand nicht (✗)? [de] | — | — | — | — | let / lets (✓): My parents let me stay up late., My mum lets me watch TV., Our teacher lets us work in groups. \| don't / doesn't let (✗): My parents don't let me get a tattoo., My mum doesn't let me dye my hair., Dad doesn't let me ride his bike. | false |
| g3u09.gi.let.gs.003 | group-sort | Sortiere: Ist die let-Form richtig (✓) oder falsch (✗)? [de] | — | — | — | — | ✓: My parents let me go., She lets us play., They don't let me stay. \| ✗: My parents let me to go., She let us play., They lets not me stay. | false |
| g3u09.gi.let.mc.001 | multiple-choice | Welcher Satz ist richtig? [de] | My sister lets me borrow her clothes. (full) | — | My sister lets me to borrow her clothes. ; My sister let me to borrow her clothes. ; My sister lets me borrowing her clothes. | — | — | false |
| g3u09.gi.let.mc.002 | multiple-choice | Welcher Satz ist richtig? [de] | My teacher lets us work in groups. (full) | — | My teacher lets us to work in groups. ; My teacher let us to work in groups. ; My teacher lets us working in groups. | — | — | false |
| g3u09.gi.let.mc.003 | multiple-choice | Welcher Satz ist richtig? [de] | My mum lets me stay up late on Fridays. (full) | — | My mum let me stay up late on Fridays. ; My mum lets me to stay up late on Fridays. ; My mum lets me staying up late on Fridays. | — | — | false |
| g3u09.gi.let.mc.004 | multiple-choice | Welcher Satz ist richtig? [de] | My parents don't let me play video games on school nights. (full) | — | My parents don't let me to play video games on school nights. ; My parents don't let me playing video games on school nights. ; My parents doesn't let me play video games on school nights. | — | — | true |
| g3u09.gi.let.mc.005 | multiple-choice | Welcher Satz ist richtig? [de] | The coach doesn't let us leave early. (full) | — | The coach doesn't let us to leave early. ; The coach doesn't lets us leave early. ; The coach don't let us leave early. | — | — | true |
| g3u09.gi.let.mc.006 | multiple-choice | Welcher Satz ist richtig? [de] | They let us ride our bikes to school. (full) | — | They let us to ride our bikes to school. ; They lets us ride our bikes to school. ; They let us riding our bikes to school. | — | — | false |
| g3u09.gi.let.mp.001 | matching-pairs | Welcher Satz passt zu welcher Regel? [de] | — | — | — | TV after dinner: yes. ↔ My mum lets me watch TV. ; TV after dinner: no. ↔ My mum doesn't let me watch TV. ; The disco: yes. ↔ My parents let me go to the disco. ; The disco: no. ↔ My parents don't let me go to the disco. | — | false |
| g3u09.gi.let.mt.001 | matching | Welches Ende passt zu welchem Anfang? [de] | — | — | — | My dad lets me ↔ ride my bike to school. ; The teacher doesn't let us ↔ talk in class. ; My parents let me ↔ stay up late on Fridays. ; She doesn't let her sister ↔ use her phone. | — | false |
| g3u09.gi.let.qf.001 | question-formation | Bilde die Frage: do / your parents / let / you / go out / on Saturdays [de] | Do your parents let you go out on Saturdays? (full) | — | — | — | — | false |
| g3u09.gi.let.qf.002 | question-formation | Bilde die Frage: does / your mum / let / you / use / her phone [de] | Does your mum let you use her phone? (full) | — | — | — | — | false |
| g3u09.gi.let.sb.001 | sentence-building | doesn't / the teacher / us / let / in class / talk [en] | The teacher doesn't let us talk in class. (full) ; The teacher doesn't let us talk in class (full) | — | — | — | — | true |
| g3u09.gi.let.sb.002 | sentence-building | let / my mum / me / doesn't / eat / sweets / before dinner [en] | My mum doesn't let me eat sweets before dinner. (full) ; My mum doesn't let me eat sweets before dinner (full) | — | to ; lets ; eating | — | — | true |
| g3u09.gi.let.sb.003 | sentence-building | play / the teacher / us / lets / outside [en] | The teacher lets us play outside. (full) ; The teacher lets us play outside (full) | — | to ; let ; playing | — | — | false |
| g3u09.gi.let.sb.004 | sentence-building | let / my parents / me / ride / my bike / to school [en] | My parents let me ride my bike to school. (full) ; My parents let me ride my bike to school (full) | — | to ; lets ; riding | — | — | false |
| g3u09.gi.let.tf.001 | transformation | My parents let me come home late. (jetzt verneinen) [de] | My parents don't let me come home late. (full) ; My parents do not let me come home late. (full) | — | — | — | — | true |
| g3u09.gi.let.tf.002 | transformation | My mum lets me eat sweets before dinner. (jetzt verneinen) [de] | My mum doesn't let me eat sweets before dinner. (full) ; My mum does not let me eat sweets before dinner. (full) | — | — | — | — | true |
| g3u09.gi.let.tf.003 | transformation | I'm allowed to use my phone after school. (Beginne mit: My parents ...) [de] | My parents let me use my phone after school. (full) | — | — | — | — | false |
| g3u09.gi.let.tf.004 | transformation | I'm not allowed to get a tattoo. (Beginne mit: My parents ...) [de] | My parents don't let me get a tattoo. (full) ; My parents do not let me get a tattoo. (full) | — | — | — | — | true |
| g3u09.gi.let.tr.001 | translation | Meine Eltern lassen mich am Wochenende länger aufbleiben. [de] | My parents let me stay up longer at the weekend. (full) ; My parents let me stay up later at the weekend. (full) ; My parents let me stay up longer at weekends. (full) ; My parents let me stay up later at weekends. (full) | deToEn | — | — | — | false |
| g3u09.gi.let.tr.002 | translation | Der Lehrer lässt uns im Unterricht nicht essen. [de] | The teacher doesn't let us eat in class. (full) ; The teacher does not let us eat in class. (full) ; The teacher doesn't let us eat during class. (full) | deToEn | — | — | — | true |
| g3u09.gi.let.tr.003 | translation | Meine Eltern lassen mich meine Haare nicht färben. [de] | My parents don't let me dye my hair. (full) ; My parents do not let me dye my hair. (full) | deToEn | — | — | — | true |
| g3u09.gi.let.tr.004 | translation | Meine Schwester lässt mich ihre Ohrringe tragen. [de] | My sister lets me wear her earrings. (full) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g3-u09/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g3-u09",
  "lens": "answers",
  "itemsHash": "154d2fd32a41",
  "promptHash": "70fa2d8cdf22",
  "round": 1,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 132, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
