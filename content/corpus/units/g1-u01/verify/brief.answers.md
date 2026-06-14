# Verify lens — answers — g1-u01 (round 1)

<!-- domigo:verify answers g1-u01 items=f420e20d1860 prompt=70fa2d8cdf22 round=1 -->

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

## Vocab items (68)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g1u01.w.address | (email) address | You write to a child at this, for example noah11@zpin.com. | What is your email ___? Can you spell it, please? | address (full) ; email address (full) | address (full) ; email address (full) | picture ; class ; time |
| g1u01.w.board | board | A flat thing on the wall. The teacher writes on it, and then you clean it. | Don't write on your desk! Write on the ___. | board (full) | board (full) ; whiteboard (partial) ; blackboard (partial) | desk ; chair ; school bag |
| g1u01.w.book | book | You read it. It has many pages and pictures. | I am reading a funny story ___ with many pictures. | book (full) | book (full) | pen ; ruler ; chair |
| g1u01.w.chair | chair | You sit down on it at your desk. | Sit down on your ___, please. | chair (full) | chair (full) | desk ; door ; board |
| g1u01.w.child | child | A young boy or girl. There are 20 of them in our class. | This ___ in our class is Mike. He is ten. | child (full) | child (full) | class ; book ; picture |
| g1u01.w.class | class | All the children who learn together with one teacher. | There are 20 children in our ___. We learn English here. | class (full) | class (full) | school ; book ; picture |
| g1u01.w.desk | desk | You sit down at it in class to read and write. Your books are on it. | My books and pens are on my ___. | desk (full) | desk (full) | chair ; door ; window |
| g1u01.w.door | door | You open it to go into a room. You close it after you. | Please close the ___ and sit down. | door (full) | door (full) | window ; board ; chair |
| g1u01.w.exercise-book | exercise book | A thin thing with empty pages. You write your homework in it. | Write the numbers in your ___ with a pen. | exercise book (full) | exercise book (full) ; notebook (partial) | book ; school bag ; tablet |
| g1u01.w.favourite | favourite | The one thing you love the best of all. | Green is my ___ colour. I love it the best. | favourite (full) ; favorite (partial) | favourite (full) ; favorite (partial) | light ; more ; here |
| g1u01.w.hairband | hairband | A girl can wear it in her hair, over her head. | Leah has a pink ___ in her hair. | hairband (full) | hairband (full) ; hair band (partial) | hat ; school tie ; sunglasses |
| g1u01.w.hat | hat | You wear it on your head. | He has a warm ___ on his head in winter. | hat (full) | hat (full) | shoe ; school tie ; skirt |
| g1u01.w.here | here | In this place, not over there. | ___ is your pencil case. It was on my desk. | here (full) | here (full) | then ; or ; more |
| g1u01.w.how-are-you | How are you? | You say it to a child. You ask the child if all is good. | Hi, Dave! ___ — I'm fine, thanks. | How are you? (full) ; How are you (full) | How are you? (full) ; How are you (full) | I am fine. ; how many ; here |
| g1u01.w.how-many | how many | You ask it about a number of books, pens or animals. | ___ frogs can you see in the picture? | how many (full) | how many (full) | here ; or ; then |
| g1u01.w.i-am-fine | I am (= I'm) fine. | You say it when a child asks how you are and all is good. | How are you? — ___, thanks. And you? | I'm fine (full) ; I am fine (full) ; I'm fine. (full) | I am fine. (full) ; I'm fine. (full) ; I'm fine (full) | How are you? ; how many ; here |
| g1u01.w.it | it | A word for a thing or an animal, not for a child. | I have a pet frog. ___ is green. | it (full) | it (full) | here ; their ; your |
| g1u01.w.let-s | Let's … | You say it when you want to do a thing with a child. | ___ sing a song! It is so much fun. | Let's (full) | Let's (full) ; Lets (partial) | here ; then ; more |
| g1u01.w.light | light | Not dark. A pale colour, for example the sky on a sunny morning. | My favourite colour is ___ blue, like the sky. | light (full) | light (full) | favourite ; more ; here |
| g1u01.w.midnight | midnight | 12 o'clock at night, when all the class is in bed. | It's 12 o'clock now — it's ___ in the classroom. | midnight (full) | midnight (full) | time ; class ; picture |
| g1u01.w.more | more | A bigger number of a thing than now. | Can I have ___ water, please? My glass is empty. | more (full) | more (full) | here ; then ; or |
| g1u01.w.must | must | When you have to do a thing. You can not say no to it. | It's late. I ___ go home now. | must (full) | must (full) | here ; more ; then |
| g1u01.w.or | or | A word for one thing and not the other. You take one of two. | Do you want a pen ___ a pencil? Take one. | or (full) | or (full) | then ; here ; more |
| g1u01.w.our | our | Of you and me. It is not theirs. | This is ___ classroom. All of us in this class learn here. | our (full) | our (full) | their ; your ; it |
| g1u01.w.pen | pen | You write with it. It is blue, red or black, and you can not clean it with a rubber. | Can I write my name with your blue ___? | pen (full) | pen (full) | pencil ; rubber ; ruler |
| g1u01.w.pencil | pencil | You write or draw with it, and then you can clean it with a rubber. | I write with my grey ___, and I can clean it with a rubber. | pencil (full) | pencil (full) | pen ; ruler ; scissors |
| g1u01.w.pencil-case | pencil case | A little bag. Your pen and ruler are in it. | Take your pencil and rubber out of your ___. | pencil case (full) | pencil case (full) | school bag ; desk ; book |
| g1u01.w.picture | picture | You draw or paint it. You can also look at it in a book. | Look at the ___ on the wall. Can you see the colours? | picture (full) | picture (full) | book ; board ; class |
| g1u01.w.projector | projector | A machine that shows a picture or a film on the wall. | Our teacher turns on the ___ and we look at the film on the wall. | projector (full) | projector (full) ; beamer (partial) | sound system ; chair ; ruler |
| g1u01.w.rubber | rubber | You use it to clean a pencil mark from the page. | I write a wrong word, so I use my ___ to clean the page. | rubber (full) | rubber (full) ; eraser (partial) | pencil ; ruler ; pen |
| g1u01.w.ruler | ruler | It is flat. You use it to draw a line that is not bent. | Use a ___ to draw a straight line. | ruler (full) | ruler (full) | pencil ; scissors ; pen |
| g1u01.w.school-bag | school bag | You put all your books and pens in it. You take it to class. | Take your exercise book out of your ___. | school bag (full) | school bag (full) ; schoolbag (partial) | pencil case ; book ; desk |
| g1u01.w.school-tie | school tie | You wear it around your neck with a shirt. | Can you find Leah's ___? It is on her white shirt. | school tie (full) | school tie (full) ; tie (partial) | shirt ; hat ; sweater |
| g1u01.w.scissors | scissors | You find it in your pencil case. You cut paper with it. | I need my ___ to cut out this picture. | scissors (full) | scissors (full) | ruler ; pen ; rubber |
| g1u01.w.shirt | shirt | You wear it on the top of your body. It has buttons. | He has a clean white ___ on for school. | shirt (full) | shirt (full) | socks ; shoe ; hat |
| g1u01.w.shoe | shoe | You wear it on one foot, over your sock. | I can find one ___, but where is the other one? | shoe (full) | shoe (full) | socks ; hat ; skirt |
| g1u01.w.skirt | skirt | A girl can wear it. It is not trousers. | She has a red ___ on today. | skirt (full) | skirt (full) | shirt ; hat ; shoe |
| g1u01.w.socks | socks | You wear them on your feet, in your shoes. | I put on my clean ___ and then my shoes. | socks (full) | socks (full) | shoe ; hat ; shirt |
| g1u01.w.sound-system | sound system | A machine in the classroom. It plays music for all the class. | Our teacher plays a song on the ___ and we all listen. | sound system (full) | sound system (full) ; sound-system (full) | projector ; board ; tablet |
| g1u01.w.sunglasses | sunglasses | Dark glasses. You wear them on your eyes when the sun is bright. | It is very sunny, so I wear my dark ___. | sunglasses (full) | sunglasses (full) | hat ; hairband ; school tie |
| g1u01.w.sweater | sweater | A warm top with sleeves. You wear it over your shirt when it is cold. | It is cold today, so wear a warm ___ over your shirt. | sweater (full) | sweater (full) ; pullover (partial) ; jumper (partial) | skirt ; socks ; hat |
| g1u01.w.tablet | tablet | A flat thing with a glass screen. A child can read or play games on it. | Switch on your ___ and look at the picture on the screen. | tablet (full) | tablet (full) | book ; board ; exercise book |
| g1u01.w.their | their | Of them. The book is of the children, so it is the book of them. | The children put ___ school bags on the floor. | their (full) | their (full) | your ; our ; it |
| g1u01.w.then | then | After the first thing. | Listen to the dialogue. ___ read it. | then (full) | then (full) | here ; or ; more |
| g1u01.w.time | time | What a clock shows you. It can be one o'clock or two o'clock. | What ___ is it now? It's midnight. | time (full) | time (full) | picture ; book ; class |
| g1u01.w.to-ask | to ask | To put a question to a child or to your teacher. | Can I ___ you a question? | ask (full) ; to ask (partial) | to ask (full) ; ask (full) | to find ; to give ; to read |
| g1u01.w.to-clean | to clean | To take the dirt from a thing so it is not dirty. | Please ___ the board after the class. | clean (full) ; to clean (partial) | to clean (full) ; clean (full) | to open ; to close ; to find |
| g1u01.w.to-close | to close | To shut a door or a window so it is not open. | It is cold in here. Please ___ the window. | close (full) ; to close (partial) ; shut (partial) | to close (full) ; close (full) | to open ; to clean ; to find |
| g1u01.w.to-eat | to eat | To put food into your mouth. | I'm a frog and I ___ insects. | eat (full) ; to eat (partial) | to eat (full) ; eat (full) | to read ; to look ; to ask |
| g1u01.w.to-enjoy | to enjoy | To like a thing very, very much when you do it. | ___ the music! It is a very cool song. | enjoy (full) ; to enjoy (partial) | to enjoy (full) ; enjoy (full) | to hate ; to ask ; to find |
| g1u01.w.to-find | to find | To see a thing you were looking for. | Can you ___ my school tie? It is on my chair. | find (full) ; to find (partial) | to find (full) ; find (full) | to look ; to give ; to ask |
| g1u01.w.to-give | to give | To put a thing into the hand of a child or your teacher. | ___ me your school bag, please. | give (full) ; to give (partial) | to give (full) ; give (full) | to find ; to ask ; to read |
| g1u01.w.to-go | to go | To walk from one place to the next place. | It is late. I must ___ home now. Bye! | go (full) ; to go (partial) | to go (full) ; go (full) | to find ; to look ; to ask |
| g1u01.w.to-hate | to hate | To not like a thing at all. It is the other way from love. | I ___ pink. It is not for me at all! | hate (full) ; to hate (partial) | to hate (full) ; hate (full) | to love ; to enjoy ; to find |
| g1u01.w.to-listen | to listen | To use your ears for a song or for music. | ___ to the song, then read the text. | listen (full) ; to listen (partial) | to listen (full) ; listen (full) | to look ; to read ; to write |
| g1u01.w.to-look | to look | To use your eyes to see a thing. | ___ at the picture on the board! | look (full) ; to look (partial) | to look (full) ; look (full) | to listen ; to read ; to speak |
| g1u01.w.to-love | to love | To like a child, an animal or a thing very, very much. | I ___ blue. It's my favourite colour. | love (full) ; to love (partial) | to love (full) ; love (full) | to hate ; to find ; to ask |
| g1u01.w.to-meet | to meet | To see a child for the first time and say hello. | Nice to ___ you! My name is Sue. | meet (full) ; to meet (partial) | to meet (full) ; meet (full) | to find ; to look ; to give |
| g1u01.w.to-open | to open | To make a door, a window or a book not closed. | ___ your books and read page ten. | open (full) ; to open (partial) | to open (full) ; open (full) | to close ; to clean ; to find |
| g1u01.w.to-read | to read | To look at words on a page and understand them. | I like to ___ a story book before I go to bed. | read (full) ; to read (partial) | to read (full) ; read (full) | to write ; to look ; to speak |
| g1u01.w.to-sit-down | to sit down | To put your body down on a chair. | Please ___ on your chair, children. | sit down (full) ; to sit down (partial) | to sit down (full) ; sit down (full) | to stand up ; to open ; to close |
| g1u01.w.to-speak | to speak | To use your mouth to say words to a child. | Don't ___ during the test. Listen and write. | speak (full) ; to speak (partial) ; talk (partial) | to speak (full) ; speak (full) | to listen ; to read ; to look |
| g1u01.w.to-stand-up | to stand up | To get up from your chair and be on your feet. | Don't ___. Sit down, please. | stand up (full) ; to stand up (partial) | to stand up (full) ; stand up (full) | to sit down ; to open ; to close |
| g1u01.w.to-take-out | to take out | To get a thing from inside your school bag. | ___ your books and put them on your desks. | take out (full) ; to take out (partial) | to take out (full) ; take out (full) | to sit down ; to stand up ; to clean |
| g1u01.w.to-understand | to understand | To look at a word and find out what it means. | I don't ___ this word. What is it in German? | understand (full) ; to understand (partial) | to understand (full) ; understand (full) | to read ; to look ; to find |
| g1u01.w.to-write | to write | To make words and numbers on a page with a pen. | ___ the numbers in your exercise book. | write (full) ; to write (partial) | to write (full) ; write (full) | to read ; to look ; to listen |
| g1u01.w.window | window | You open it in the wall. You can look out and see the school garden. | It is hot in here. Please open the ___. | window (full) | window (full) | door ; board ; desk |
| g1u01.w.your | your | Of you. It is not mine. | Is this ___ pen? It was on your desk. | your (full) | your (full) | their ; our ; it |

## Grammar items (171)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g1u01.gi.contractions.ag.001 | anagram | Kurzform von I am: [de] | I'm (full) | — | — | — | — | false |
| g1u01.gi.contractions.ag.002 | anagram | Kurzform von is not: [de] | isn't (full) | — | — | — | — | false |
| g1u01.gi.contractions.ag.003 | anagram | Kurzform von What is: [de] | What's (full) | — | — | — | — | false |
| g1u01.gi.contractions.cp.001 | context-picker | Du zeigst auf einen Stuhl und sagst, was es ist. Welcher Satz ist richtig? [de] | It's a chair. (full) | — | Its a chair. ; Is a chair. ; It a chair. | — | — | false |
| g1u01.gi.contractions.ec.002 | error-correction | Finde den Fehler und verbessere ihn: She isnt here. [de] | She isn't here. (full) ; She is not here. (full) ; isn't (partial) | — | — | — | — | false |
| g1u01.gi.contractions.ec.004 | error-correction | The child loves it's book. [en] | The child loves its book. (full) ; its (partial) | — | — | — | — | true |
| g1u01.gi.contractions.ec.005 | error-correction | Finde den Fehler und verbessere ihn: Lets open the door. [de] | Let's open the door. (full) ; Let's (partial) | — | — | — | — | false |
| g1u01.gi.contractions.ec.006 | error-correction | Their here today. (= They are here) [en] | They're here today. (full) ; They're (partial) | — | — | — | — | true |
| g1u01.gi.contractions.ec.007 | error-correction | Its a pen. [en] | It's a pen. (full) ; It's (partial) | — | — | — | — | true |
| g1u01.gi.contractions.ec.008 | error-correction | Finde den Fehler und verbessere ihn: Im here. [de] | I'm here. (full) ; I am here. (full) ; I'm (partial) | — | — | — | — | false |
| g1u01.gi.contractions.ec.009 | error-correction | Finde den Fehler und verbessere ihn: Whats your address? [de] | What's your address? (full) ; What is your address? (full) ; What's (partial) | — | — | — | — | false |
| g1u01.gi.contractions.gf.001 | gap-fill | Kurzform von I am: ___ Mike. [de, 1 blank(s)] | I'm (full) | — | — | — | — | false |
| g1u01.gi.contractions.gf.002 | gap-fill | Kurzform von What is: ___ your address? [de, 1 blank(s)] | What's (full) | — | — | — | — | false |
| g1u01.gi.contractions.gf.003 | gap-fill | Kurzform von It is: ___ a tablet. [de, 1 blank(s)] | It's (full) | — | — | — | — | false |
| g1u01.gi.contractions.gf.004 | gap-fill | Kurzform von is not: That ___ a pen. [de, 1 blank(s)] | isn't (full) ; is not (partial) | — | — | — | — | false |
| g1u01.gi.contractions.gf.005 | gap-fill | Kurzform von Let us: ___ open the window! [de, 1 blank(s)] | Let's (full) | — | — | — | — | false |
| g1u01.gi.contractions.gf.006 | gap-fill | Besitz (sein Buch), KEIN Apostroph: The child loves ___ book. [de, 1 blank(s)] | its (full) | — | — | — | — | true |
| g1u01.gi.contractions.gf.007 | gap-fill | Kurzform von He is: ___ here. [de, 1 blank(s)] | He's (full) | — | — | — | — | false |
| g1u01.gi.contractions.gf.008 | gap-fill | Kurzform von They are: ___ in class one. [de, 1 blank(s)] | They're (full) | — | — | — | — | false |
| g1u01.gi.contractions.gf.009 | gap-fill | Kurzform von are not: We ___ here today. [de, 1 blank(s)] | aren't (full) ; are not (partial) | — | — | — | — | false |
| g1u01.gi.contractions.gf.010 | gap-fill | Kurzform von That is: ___ a nice picture! [de, 1 blank(s)] | That's (full) | — | — | — | — | false |
| g1u01.gi.contractions.gf.011 | gap-fill | Zweimal It is als Kurzform: ___ your school bag and ___ light. [de, 2 blank(s)] | It's \| it's (full) | — | — | — | — | false |
| g1u01.gi.contractions.gf.012 | gap-fill | Kurzform von do not: ___ open your books. [de, 1 blank(s)] | Don't (full) ; Do not (partial) | — | — | — | — | false |
| g1u01.gi.contractions.gs.001 | group-sort | Langform oder Kurzform? [de] | — | — | — | — | I am: it is, do not, are not, cannot \| I'm: it's, don't, aren't, can't | false |
| g1u01.gi.contractions.gs.002 | group-sort | Welche Kurzform passt zu welchem Wort? [de] | — | — | — | — | isn't (he / she / it): he, she, it \| aren't (we / you / they): we, you, they | false |
| g1u01.gi.contractions.mc.001 | multiple-choice | Welche Kurzform gehört zu I am? [de] | I'm (full) | — | It's ; He's ; She's | — | — | false |
| g1u01.gi.contractions.mc.002 | multiple-choice | Welche Kurzform passt? He ___ here. [de, 1 blank(s)] | isn't (full) | — | aren't ; don't ; doesn't | — | — | true |
| g1u01.gi.contractions.mc.003 | multiple-choice | Welche Kurzform passt? We ___ here today. [de, 1 blank(s)] | aren't (full) | — | isn't ; doesn't ; don't | — | — | true |
| g1u01.gi.contractions.mc.004 | multiple-choice | Die Tür ist offen. Welcher Satz ist richtig? [de] | It's open. (full) | — | Its open. ; The door loves it's picture. ; It's door is open. | — | — | true |
| g1u01.gi.contractions.mc.005 | multiple-choice | Welche Kurzform gehört zu you are? [de] | You're (full) | — | We're ; They're ; He's | — | — | false |
| g1u01.gi.contractions.mc.006 | multiple-choice | Welche Kurzform gehört zu it is? [de] | It's (full) | — | Its ; He's ; That's | — | — | true |
| g1u01.gi.contractions.mp.001 | matching-pairs | Finde die Paare: Langform und Kurzform (Reihe A). [de] | — | — | — | I am ↔ I'm ; she is ↔ she's ; we are ↔ we're ; is not ↔ isn't ; do not ↔ don't ; that is ↔ that's | — | false |
| g1u01.gi.contractions.mp.002 | matching-pairs | Finde die Paare: Langform und Kurzform (Reihe B). [de] | — | — | — | he is ↔ he's ; you are ↔ you're ; they are ↔ they're ; are not ↔ aren't ; what is ↔ what's ; do not ↔ don't | — | false |
| g1u01.gi.contractions.mt.001 | matching | Verbinde Langform und Kurzform (Reihe 1). [de] | — | — | — | I am ↔ I'm ; it is ↔ it's ; is not ↔ isn't ; cannot ↔ can't | — | false |
| g1u01.gi.contractions.mt.002 | matching | Verbinde Langform und Kurzform (Reihe 2). [de] | — | — | — | he is ↔ he's ; we are ↔ we're ; they are ↔ they're ; what is ↔ what's ; are not ↔ aren't | — | false |
| g1u01.gi.contractions.sb.001 | sentence-building | I'm / class / in / one [en] | I'm in class one. (full) | — | — | — | — | false |
| g1u01.gi.contractions.sb.002 | sentence-building | What's / on / the / desk [en] | What's on the desk? (full) | — | — | — | — | false |
| g1u01.gi.contractions.sb.003 | sentence-building | isn't / on / it / desk / the / my [en] | It isn't on my desk. (full) | — | — | — | — | false |
| g1u01.gi.contractions.tf.001 | transformation | Schreib als Kurzform: She is my child. → ___ [de, 1 blank(s)] | She's my child. (full) | — | — | — | — | false |
| g1u01.gi.contractions.tf.002 | transformation | Schreib als Kurzform: I am here. → ___ [de, 1 blank(s)] | I'm here. (full) | — | — | — | — | false |
| g1u01.gi.contractions.tf.003 | transformation | Schreib als Langform: It isn't here. → ___ [de, 1 blank(s)] | It is not here. (full) | — | — | — | — | false |
| g1u01.gi.contractions.tf.004 | transformation | Schreib als Langform: We aren't here. → ___ [de, 1 blank(s)] | We are not here. (full) | — | — | — | — | false |
| g1u01.gi.contractions.tf.005 | transformation | Schreib als Kurzform: That is a desk. → ___ [de, 1 blank(s)] | That's a desk. (full) | — | — | — | — | false |
| g1u01.gi.contractions.tf.006 | transformation | Schreib als Langform: They're in our class. → ___ [de, 1 blank(s)] | They are in our class. (full) | — | — | — | — | false |
| g1u01.gi.contractions.tf.007 | transformation | Schreib als Kurzform: It is not here. → ___ [de, 1 blank(s)] | It isn't here. (full) ; It's not here. (full) | — | — | — | — | false |
| g1u01.gi.contractions.tr.001 | translation | Schreib die Kurzform: Ich bin in Klasse eins. [de] | I'm in class one. (full) ; I am in class one. (partial) | deToEn | — | — | — | false |
| g1u01.gi.contractions.tr.002 | translation | Schreib die Kurzform: Es ist ein Tablet. [de] | It's a tablet. (full) ; It is a tablet. (partial) | deToEn | — | — | — | false |
| g1u01.gi.contractions.tr.003 | translation | Schreib die Kurzform: Das ist nicht mein Stift. [de] | That isn't my pen. (full) ; That's not my pen. (full) ; That is not my pen. (partial) | deToEn | — | — | — | false |
| g1u01.gi.contractions.tr.004 | translation | Schreib die Kurzform: Lass uns lesen! [de] | Let's read! (full) | deToEn | — | — | — | false |
| g1u01.gi.imperatives.ag.001 | anagram | 🇩🇪 So sagst du, dass jemand etwas nicht tun soll. Das erste Wort heißt: [de] | Don't (full) | — | — | — | — | false |
| g1u01.gi.imperatives.ag.002 | anagram | 🇩🇪 Befehl: ___ the window! (= Mach das Fenster zu) [de, 1 blank(s)] | Close (full) | — | — | — | — | false |
| g1u01.gi.imperatives.cp.001 | context-picker | Die Klasse soll zuhören. Was sagt die Lehrerin? [de] | Listen, please! (full) | — | Listens, please! ; To listen, please! ; You listen, please! | — | — | false |
| g1u01.gi.imperatives.cp.002 | context-picker | Das Fenster ist offen und es ist kalt. Was sagst du? [de] | Close the window! (full) | — | Open the window! ; Don't close the window! ; You close the window. | — | — | true |
| g1u01.gi.imperatives.cp.003 | context-picker | Jemand will im Klassenzimmer laufen. Was sagst du? [de] | Don't run! (full) | — | Not run! ; No run! ; Doesn't run! | — | — | true |
| g1u01.gi.imperatives.ec.001 | error-correction | Not speak now! [en] | Don't speak now! (full) ; Do not speak now! (full) ; Don't (partial) | — | — | — | — | false |
| g1u01.gi.imperatives.ec.002 | error-correction | To sit down, please. [en] | Sit down, please. (full) ; Sit down, please! (full) | — | — | — | — | false |
| g1u01.gi.imperatives.ec.003 | error-correction | You stand up now! [en] | Stand up now! (full) ; Stand up! (partial) | — | — | — | — | false |
| g1u01.gi.imperatives.ec.004 | error-correction | Closes the door, please. [en] | Close the door, please. (full) ; Close (partial) | — | — | — | — | false |
| g1u01.gi.imperatives.ec.005 | error-correction | To listen to the picture! [en] | Listen to the picture! (full) ; Listen (partial) | — | — | — | — | false |
| g1u01.gi.imperatives.ec.006 | error-correction | Don't opens the window! [en] | Don't open the window! (full) ; Do not open the window! (full) ; open (partial) | — | — | — | — | true |
| g1u01.gi.imperatives.ff.001 | free-form | Jemand will im Klassenzimmer essen. Sag, dass er das nicht tun soll (Verbot). [de] | Don't eat here! (full) ; Don't eat in class! (full) ; Do not eat here! (full) ; Don't eat! (partial) | — | — | — | — | false |
| g1u01.gi.imperatives.ff.002 | free-form | Die Stunde beginnt. Sag der Klasse, dass sie sich hinsetzen soll (Befehl). [de] | Sit down! (full) ; Sit down, please! (full) ; Sit down. (partial) | — | — | — | — | false |
| g1u01.gi.imperatives.gf.001 | gap-fill | ___ your books, please. [en, 1 blank(s)] | Open (full) | — | To open ; Opens ; You open | — | — | false |
| g1u01.gi.imperatives.gf.002 | gap-fill | Sag, dass sich jemand hinsetzen soll: ___, please. [de, 1 blank(s)] | Sit down (full) | — | — | — | — | false |
| g1u01.gi.imperatives.gf.003 | gap-fill | ___ at the board, please. [en, 1 blank(s)] | Look (full) | — | To look ; Looks ; You look | — | — | false |
| g1u01.gi.imperatives.gf.004 | gap-fill | Es ist heiß. Sag: ___ the door. [de, 1 blank(s)] | Open (full) | — | Opens ; To open ; You open | — | — | false |
| g1u01.gi.imperatives.gf.005 | gap-fill | ___ to me, please. [en, 1 blank(s)] | Listen (full) | — | To listen ; Listens ; You listen | — | — | false |
| g1u01.gi.imperatives.gf.006 | gap-fill | Sag, dass jemand nicht laufen soll: ___ run! [de, 1 blank(s)] | Don't (full) ; Do not (full) | — | Not ; No ; Doesn't | — | — | true |
| g1u01.gi.imperatives.gf.007 | gap-fill | Sag, dass jemand die Bücher nicht öffnen soll: ___ open your books! [de, 1 blank(s)] | Don't (full) ; Do not (full) | — | Not ; No ; Doesn't | — | — | true |
| g1u01.gi.imperatives.gf.008 | gap-fill | ___ the door, please. [en, 1 blank(s)] | Close (full) | — | Closes ; To close ; You close | — | — | false |
| g1u01.gi.imperatives.gf.009 | gap-fill | Erst ein Befehl, dann ein Verbot: ___ at the picture. ___ look at your book! [de, 2 blank(s)] | Look \| Don't (full) ; Look \| Do not (full) | — | — | — | — | false |
| g1u01.gi.imperatives.gf.010 | gap-fill | Erst ein Verbot, dann ein Befehl: ___ speak now! ___ to the picture. [de, 2 blank(s)] | Don't \| Listen (full) ; Do not \| Listen (full) | — | — | — | — | false |
| g1u01.gi.imperatives.gf.011 | gap-fill | Die Tafel ist schmutzig. Sag: ___ the board, please. [de, 1 blank(s)] | Clean (full) | — | Cleans ; To clean ; You clean | — | — | false |
| g1u01.gi.imperatives.gs.001 | group-sort | Sortiere die Befehle: tun oder nicht tun? [de] | — | — | — | — | Do it!: Sit down., Open your books., Look at the board., Clean the desk. \| Don't do it!: Don't run!, Don't speak!, Don't open the window., Don't write on the desk. | false |
| g1u01.gi.imperatives.gs.002 | group-sort | Sortiere: Befehl (kein Subjekt) oder Satz mit Subjekt? [de] | — | — | — | — | No you: Close the door., Don't eat here., Take out your books., Listen to me. \| With he, she, they: She opens the door., He is reading., They eat here., She takes out her books. | false |
| g1u01.gi.imperatives.mc.001 | multiple-choice | Die Lehrerin sagt: '___ your books.' [de, 1 blank(s)] | Open (full) | — | Opens ; To open ; You open | — | — | false |
| g1u01.gi.imperatives.mc.002 | multiple-choice | Welches Verbot ist richtig? [de] | Don't open your books! (full) | — | Not open your books! ; No open your books! ; Doesn't open your books! | — | — | false |
| g1u01.gi.imperatives.mc.003 | multiple-choice | Welcher Satz ist ein Befehl? [de] | Close the window. (full) | — | She closes the window. ; He is opening the window. ; They closed the window. | — | — | false |
| g1u01.gi.imperatives.mc.004 | multiple-choice | Die Klasse soll aufstehen. Welcher Satz ist richtig? [de] | Stand up, please! (full) | — | Stands up, please! ; You stand up! ; To stand up, please! | — | — | false |
| g1u01.gi.imperatives.mc.005 | multiple-choice | Sag jemandem, dass er laufen soll: [de] | Run! (full) | — | Runs! ; You run! ; To run! | — | — | false |
| g1u01.gi.imperatives.mt.001 | matching | Welcher Befehl passt zu welcher Situation? [de] | — | — | — | Open the window. ↔ The window is not open. ; Clean the board. ↔ The board is not clean. ; Close the door. ↔ The door is open. ; Look at the picture. ↔ The picture is here. | — | false |
| g1u01.gi.imperatives.sb.001 | sentence-building | don't / open / the / window [en] | Don't open the window. (full) ; Don't open the window! (full) ; Do not open the window. (full) | — | — | — | — | false |
| g1u01.gi.imperatives.sb.002 | sentence-building | the / close / door / please [en] | Close the door, please. (full) ; Please close the door. (full) ; Close the door please. (partial) | — | — | — | — | false |
| g1u01.gi.imperatives.sb.003 | sentence-building | at / look / board / the [en] | Look at the board. (full) ; Look at the board! (full) | — | — | — | — | false |
| g1u01.gi.imperatives.sb.004 | sentence-building | don't / on / the / write / board [en] | Don't write on the board. (full) ; Don't write on the board! (full) ; Do not write on the board. (full) | — | — | — | — | false |
| g1u01.gi.imperatives.tf.001 | transformation | Mach daraus ein Verbot: Open your books. → ___ [de, 1 blank(s)] | Don't open your books. (full) ; Don't open your books! (full) ; Do not open your books. (full) | — | — | — | — | false |
| g1u01.gi.imperatives.tf.002 | transformation | Mach daraus ein Verbot: Run! → ___ [de, 1 blank(s)] | Don't run! (full) ; Do not run! (full) | — | — | — | — | false |
| g1u01.gi.imperatives.tf.003 | transformation | Mach daraus einen Befehl (kein Verbot): Don't close the door. → ___ [de, 1 blank(s)] | Close the door. (full) ; Close the door! (full) | — | — | — | — | false |
| g1u01.gi.imperatives.tf.004 | transformation | Mach daraus einen Befehl (ohne Subjekt): You don't open the window. → ___ [de, 1 blank(s)] | Don't open the window! (full) ; Don't open the window. (full) ; Do not open the window! (full) | — | — | — | — | false |
| g1u01.gi.imperatives.tf.005 | transformation | Mach daraus einen Befehl: She opens the door. → ___ [de, 1 blank(s)] | Open the door! (full) ; Open the door. (full) | — | — | — | — | false |
| g1u01.gi.imperatives.tr.001 | translation | 🇩🇪 Mach das Fenster auf! [de] | Open the window! (full) ; Open the window. (full) | deToEn | — | — | — | false |
| g1u01.gi.imperatives.tr.002 | translation | 🇩🇪 Mach die Tür zu! [de] | Close the door! (full) ; Close the door. (full) | deToEn | — | — | — | false |
| g1u01.gi.imperatives.tr.003 | translation | 🇩🇪 Lauf nicht! [de] | Don't run! (full) ; Do not run! (full) | deToEn | — | — | — | false |
| g1u01.gi.imperatives.tr.004 | translation | 🇩🇪 Öffne deine Bücher nicht! [de] | Don't open your books! (full) ; Do not open your books! (full) ; Don't open your books. (full) | deToEn | — | — | — | false |
| g1u01.gi.imperatives.tr.005 | translation | Sit down! [en] | Setz dich! (full) ; Setzt euch! (full) ; Setz dich. (partial) | enToDe | — | — | — | false |
| g1u01.gi.plurals.ag.001 | anagram | Mehrzahl von child: [de] | children (full) | — | — | — | — | true |
| g1u01.gi.plurals.ag.002 | anagram | Mehrzahl von box: [de] | boxes (full) | — | — | — | — | true |
| g1u01.gi.plurals.ag.003 | anagram | Mehrzahl von baby: [de] | babies (full) | — | — | — | — | true |
| g1u01.gi.plurals.ag.004 | anagram | Mehrzahl von class: [de] | classes (full) | — | — | — | — | true |
| g1u01.gi.plurals.cp.001 | context-picker | Du sprichst über deine zwei Haustiere. Welcher Satz ist richtig? [de] | I have two fish. (full) | — | I have two fishs. ; I have two fishes. ; I have two fishys. | — | — | true |
| g1u01.gi.plurals.cp.002 | context-picker | Du zählst die Kleinen im Klassenzimmer. Welcher Satz ist richtig? [de] | There are five children here. (full) | — | There are five childs here. ; There are five childrens here. ; There are five childes here. | — | — | true |
| g1u01.gi.plurals.cp.003 | context-picker | Du zählst die Schachteln für die Bücher. Welcher Satz ist richtig? [de] | There are three boxes here. (full) | — | There are three box here. ; There are three boxs here. ; There are three boxies here. | — | — | true |
| g1u01.gi.plurals.ec.001 | error-correction | I have three childs. [en] | I have three children. (full) ; children (partial) | — | — | — | — | true |
| g1u01.gi.plurals.ec.002 | error-correction | I have two Desks here. [en] | I have two desks here. (full) ; desks (partial) | — | — | — | — | false |
| g1u01.gi.plurals.ec.003 | error-correction | There are two boxs on the desk. [de] | There are two boxes on the desk. (full) ; boxes (partial) | — | — | — | — | true |
| g1u01.gi.plurals.ec.004 | error-correction | She has four classs today. [de] | She has four classes today. (full) ; classes (partial) | — | — | — | — | true |
| g1u01.gi.plurals.ec.005 | error-correction | There are three fishes in the picture. [de] | There are three fish in the picture. (full) ; fish (partial) | — | — | — | — | true |
| g1u01.gi.plurals.ec.006 | error-correction | Two childrens are in the classroom. [de] | Two children are in the classroom. (full) ; children (partial) | — | — | — | — | true |
| g1u01.gi.plurals.ec.007 | error-correction | I have two pencil here. [en] | I have two pencils here. (full) ; pencils (partial) | — | — | — | — | false |
| g1u01.gi.plurals.gf.001 | gap-fill | I have two ___ (pen). [en, 1 blank(s)] | pens (full) | — | — | — | — | false |
| g1u01.gi.plurals.gf.002 | gap-fill | There are four ___ (desk) in the classroom. [en, 1 blank(s)] | desks (full) | — | — | — | — | false |
| g1u01.gi.plurals.gf.003 | gap-fill | There are six ___ (book) on the desk. [en, 1 blank(s)] | books (full) | — | — | — | — | false |
| g1u01.gi.plurals.gf.004 | gap-fill | I have three ___ (ruler). [en, 1 blank(s)] | rulers (full) | — | — | — | — | false |
| g1u01.gi.plurals.gf.005 | gap-fill | My ___ (shoe) are here. [en, 1 blank(s)] | shoes (full) | — | — | — | — | false |
| g1u01.gi.plurals.gf.006 | gap-fill | We have two ___ (box) for the books. [en, 1 blank(s)] | boxes (full) | — | — | — | — | false |
| g1u01.gi.plurals.gf.007 | gap-fill | She has four ___ (class) today. [en, 1 blank(s)] | classes (full) | — | — | — | — | false |
| g1u01.gi.plurals.gf.008 | gap-fill | There are five ___ (child) in our class. [en, 1 blank(s)] | children (full) | — | — | — | — | true |
| g1u01.gi.plurals.gf.009 | gap-fill | There are three ___ (fish) in the picture. [en, 1 blank(s)] | fish (full) | — | — | — | — | true |
| g1u01.gi.plurals.gf.010 | gap-fill | There are eight ___ (window) in the classroom. [en, 1 blank(s)] | windows (full) | — | — | — | — | false |
| g1u01.gi.plurals.gf.011 | gap-fill | There are nine ___ (pencil) in the pencil case. [en, 1 blank(s)] | pencils (full) | — | — | — | — | false |
| g1u01.gi.plurals.gf.012 | gap-fill | There are five ___ (hat) and two ___ (skirt) here. [en, 2 blank(s)] | hats \| skirts (full) | — | — | — | — | false |
| g1u01.gi.plurals.gf.013 | gap-fill | There are two ___ (child) and three ___ (chair). [en, 2 blank(s)] | children \| chairs (full) | — | — | — | — | true |
| g1u01.gi.plurals.gf.014 | gap-fill | Take out your ___ (tablet), please. [en, 1 blank(s)] | tablets (full) | — | — | — | — | false |
| g1u01.gi.plurals.gs.001 | group-sort | Sortiere jedes Wort: Mehrzahl wie book (nur +s) oder wie baby (y wird zu -ies)? [de] | — | — | — | — | book: desk, pen, chair, ruler \| baby: city, story | false |
| g1u01.gi.plurals.gs.002 | group-sort | Sortiere jedes Wort nach seiner Pluralregel: wie ruler (+s) oder wie baby (y zu -ies)? [de] | — | — | — | — | ruler: tablet, shoe, hat \| baby: city, story | false |
| g1u01.gi.plurals.gs.003 | group-sort | Welche bilden die Mehrzahl wie hat (+s), welche wie baby (y zu -ies)? [de] | — | — | — | — | hat: skirt, shoe, window, door \| baby: city, story | false |
| g1u01.gi.plurals.mc.001 | multiple-choice | Welches Wort ist die Mehrzahl (mehr als eins)? [de] | books (full) | — | book ; desk ; pencil | — | — | false |
| g1u01.gi.plurals.mc.002 | multiple-choice | Welches Wort bedeutet mehr als einen Stuhl? [de] | chairs (full) | — | chair ; desk ; door | — | — | false |
| g1u01.gi.plurals.mc.003 | multiple-choice | Welches Wort ist die Mehrzahl (mehr als eins)? [de] | rulers (full) | — | ruler ; pen ; book | — | — | false |
| g1u01.gi.plurals.mc.004 | multiple-choice | Welches Wort ist die Mehrzahl (mehr als eins)? [de] | windows (full) | — | window ; door ; board | — | — | false |
| g1u01.gi.plurals.mc.005 | multiple-choice | Welches Wort ist die Mehrzahl (mehr als eins)? [de] | pencils (full) | — | pencil ; pen ; hat | — | — | false |
| g1u01.gi.plurals.mc.006 | multiple-choice | Welches Wort bedeutet mehr als einen Schuh? [de] | shoes (full) | — | shoe ; shirt ; skirt | — | — | false |
| g1u01.gi.plurals.mp.001 | matching-pairs | Finde die Paare: Einzahl und Mehrzahl (gemischte Regeln). [de] | — | — | — | child ↔ children ; fish ↔ fish ; box ↔ boxes ; desk ↔ desks ; pen ↔ pens ; class ↔ classes | — | false |
| g1u01.gi.plurals.mp.002 | matching-pairs | Finde die Paare: Einzahl und Mehrzahl (alle mit -s). [de] | — | — | — | window ↔ windows ; door ↔ doors ; board ↔ boards ; picture ↔ pictures ; ruler ↔ rulers | — | false |
| g1u01.gi.plurals.mp.003 | matching-pairs | Finde die Paare: Einzahl und Mehrzahl (manche y → ies). [de] | — | — | — | baby ↔ babies ; boy ↔ boys ; child ↔ children ; box ↔ boxes ; fish ↔ fish | — | false |
| g1u01.gi.plurals.mt.001 | matching | Ordne jede Einzahl ihrer Mehrzahl zu (alle mit -s). [de] | — | — | — | desk ↔ desks ; pen ↔ pens ; book ↔ books ; chair ↔ chairs | — | false |
| g1u01.gi.plurals.mt.002 | matching | Ordne jede Einzahl ihrer Mehrzahl zu (Achtung, Ausnahmen!). [de] | — | — | — | child ↔ children ; fish ↔ fish ; box ↔ boxes ; class ↔ classes | — | false |
| g1u01.gi.plurals.mt.003 | matching | Ordne jedes Schul- oder Kleidungswort seiner Mehrzahl zu. [de] | — | — | — | ruler ↔ rulers ; tablet ↔ tablets ; hat ↔ hats ; skirt ↔ skirts ; shoe ↔ shoes | — | false |
| g1u01.gi.plurals.sb.001 | sentence-building | are / three / there / pens / on / the / desk [en] | There are three pens on the desk. (full) | — | — | — | — | false |
| g1u01.gi.plurals.sb.002 | sentence-building | are / there / five / chairs / in / the / classroom [en] | There are five chairs in the classroom. (full) | — | — | — | — | false |
| g1u01.gi.plurals.sb.003 | sentence-building | children / two / there / are / in / the / classroom [en] | There are two children in the classroom. (full) | — | — | — | — | false |
| g1u01.gi.plurals.sb.004 | sentence-building | your / take / out / books [en] | Take out your books. (full) | — | — | — | — | false |
| g1u01.gi.plurals.sb.005 | sentence-building | are / two / there / boxes / on / the / chair [en] | There are two boxes on the chair. (full) | — | — | — | — | false |
| g1u01.gi.plurals.tf.001 | transformation | one desk → two ___ [en, 1 blank(s)] | desks (full) ; two desks (full) | — | — | — | — | false |
| g1u01.gi.plurals.tf.002 | transformation | one book → four ___ [en, 1 blank(s)] | books (full) ; four books (full) | — | — | — | — | false |
| g1u01.gi.plurals.tf.003 | transformation | one box → five ___ [en, 1 blank(s)] | boxes (full) ; five boxes (full) | — | — | — | — | true |
| g1u01.gi.plurals.tf.004 | transformation | one child → three ___ [en, 1 blank(s)] | children (full) ; three children (full) | — | — | — | — | true |
| g1u01.gi.plurals.tf.005 | transformation | one fish → three ___ [en, 1 blank(s)] | fish (full) ; three fish (full) | — | — | — | — | true |
| g1u01.gi.plurals.tf.006 | transformation | one shoe → two ___ [en, 1 blank(s)] | shoes (full) ; two shoes (full) | — | — | — | — | false |
| g1u01.gi.plurals.tr.001 | translation | Ich habe drei Stifte. [de] | I have three pens. (full) ; I have got three pens. (partial) | deToEn | — | — | — | false |
| g1u01.gi.plurals.tr.002 | translation | Es gibt fünf Kinder in der Klasse. [de] | There are five children in the class. (full) ; There are five children in the classroom. (full) | deToEn | — | — | — | false |
| g1u01.gi.plurals.tr.003 | translation | two desks [en] | zwei Tische (full) ; zwei Schreibtische (full) ; zwei Pulte (partial) | enToDe | — | — | — | false |
| g1u01.gi.plurals.tr.004 | translation | drei Fische [de] | three fish (full) | deToEn | — | — | — | true |
| g1u01.gi.questions-personal-info.cp.001 | context-picker | Du triffst Sue zum ersten Mal und möchtest wissen, wie es ihr geht. Was sagst du? [de] | How are you? (full) | — | What's your name? ; Who are you? ; What's your email address? | — | — | false |
| g1u01.gi.questions-personal-info.ec.001 | error-correction | Where is your name? [en] | What's your name? (full) ; What is your name? (full) ; What's (partial) | — | — | — | — | false |
| g1u01.gi.questions-personal-info.ec.002 | error-correction | How are you? – I'm Sue. [en] | How are you? – I'm fine, thanks. (full) ; I'm fine, thanks. (partial) ; I'm fine. (partial) | — | — | — | — | true |
| g1u01.gi.questions-personal-info.ff.001 | free-form | Eine neue Schülerin sagt: "Hi, I'm Sue. What's your name?" Antworte und frag dann, wie es ihr geht. [de] | I'm Don. How are you? (full) ; I'm Mike. How are you? (full) ; I'm Don. (partial) ; How are you? (partial) | — | — | — | — | false |
| g1u01.gi.questions-personal-info.gf.001 | gap-fill | ___ your name? – I'm Sue. [en, 1 blank(s)] | What's (full) ; What is (partial) | — | — | — | — | false |
| g1u01.gi.questions-personal-info.gf.002 | gap-fill | How ___ you? – I'm fine, thanks. [en, 1 blank(s)] | are (full) | — | — | — | — | false |
| g1u01.gi.questions-personal-info.gf.003 | gap-fill | ___ your email address? – Can you spell it, please? [en, 1 blank(s)] | What's (full) ; What is (partial) | — | — | — | — | false |
| g1u01.gi.questions-personal-info.gf.004 | gap-fill | Can you ___ it, please? – Yes, please. [en, 1 blank(s)] | spell (full) | — | — | — | — | false |
| g1u01.gi.questions-personal-info.mc.001 | multiple-choice | Ahmed meets Sue. He asks: ___ [en, 1 blank(s)] | What's your name? (full) | — | Where is your name? ; Who is your name? ; How is your name? | — | — | false |
| g1u01.gi.questions-personal-info.mc.002 | multiple-choice | How are you? – ___ [en, 1 blank(s)] | I'm fine, thanks. (full) | — | I'm Sue. ; I'm ten. ; What's your name? | — | — | true |
| g1u01.gi.questions-personal-info.mt.001 | matching | Frage und Antwort zusammenbringen. [de] | — | — | — | What's your name? ↔ I'm Sue. ; How are you? ↔ I'm fine, thanks. ; Can you spell it, please? ↔ Yes, please. ; Nice to meet you! ↔ Nice to meet you too. | — | false |
| g1u01.gi.questions-personal-info.qf.001 | question-formation | your / name / What's [en] | What's your name? (full) | — | — | — | — | false |
| g1u01.gi.questions-personal-info.qf.002 | question-formation | you / spell / Can / it, / please [en] | Can you spell it, please? (full) | — | — | — | — | false |
| g1u01.gi.questions-personal-info.sb.001 | sentence-building | your / What's / email / address [en] | What's your email address? (full) | — | — | — | — | false |
| g1u01.gi.questions-personal-info.sb.002 | sentence-building | are / How / you [en] | How are you? (full) | — | — | — | — | false |
| g1u01.gi.questions-personal-info.tf.001 | transformation | I'm Sue. (Frag nach dem Namen) → ___ [de, 1 blank(s)] | What's your name? (full) ; What is your name? (full) | — | — | — | — | false |
| g1u01.gi.questions-personal-info.tr.001 | translation | Wie geht es dir? – Mir geht es gut, danke. Und dir? [de] | How are you? – I'm fine, thanks. And you? (full) ; How are you? – I'm fine, thanks. (partial) | deToEn | — | — | — | false |
| g1u01.gi.questions-personal-info.tr.002 | translation | Wie heißt du? [de] | What's your name? (full) ; What is your name? (full) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g1-u01/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u01",
  "lens": "answers",
  "itemsHash": "f420e20d1860",
  "promptHash": "70fa2d8cdf22",
  "round": 1,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 239, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
