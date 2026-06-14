# Verify lens — answers — g3-u05 (round 1)

<!-- domigo:verify answers g3-u05 items=e1ddda3c1db0 prompt=70fa2d8cdf22 round=1 -->

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

## Vocab items (41)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g3u05.w.alarm-clock | alarm clock | a small machine next to your bed that makes a noise in the morning so you get up. | My ___ next to my bed helps me get up in the morning. | alarm clock (full) | alarm clock (full) ; an alarm clock (full) | toothbrush ; sleeping bag ; lucky charm |
| g3u05.w.any-luck | Any luck? | a short way to ask if somebody did well. | Did you find your keys under the sofa? ___ | Any luck? (full) ; Any luck (full) | Any luck? (full) ; Any luck (full) | Do you mind ...? ; I'm joking. ; I'm sure. |
| g3u05.w.beside | beside | very close to a thing or to somebody, next to them. | Mr Wallis, the teacher, arrives and sits down ___ them at the campfire. | beside (full) | beside (full) | obvious ; evil ; rich |
| g3u05.w.crack | crack | a break in the ground or a wall, like a thin opening. | Some people think you will have bad luck if you go over a ___ in the pavement. | crack (full) | crack (full) ; a crack (full) ; cracks (full) | pavement ; salt ; haircut |
| g3u05.w.cuckoo | cuckoo | a small grey forest animal of the woods that calls in spring. | We could hear a ___ calling over and over from the trees in the woods. | cuckoo (full) | cuckoo (full) ; a cuckoo (full) | spirit ; salt ; crack |
| g3u05.w.do-you-mind | Do you mind ...? | a nice way to ask if a thing is OK. | ___ if I open the window? It is very hot in here. | Do you mind (full) ; Do you mind ...? (full) | Do you mind ...? (full) ; Do you mind (full) | Any luck? ; I'm joking. ; I'm sure. |
| g3u05.w.evil | evil | very bad and wanting to hurt people. | Candyman is an ___ spirit who wants to scare and hurt you. | evil (full) | evil (full) | rich ; obvious ; satisfied |
| g3u05.w.haircut | haircut | when somebody makes your hair shorter for you. | Some people think that a new ___ before a big day at school brings bad luck. | haircut (full) | haircut (full) ; a haircut (full) | toothbrush ; sleeping bag ; alarm clock |
| g3u05.w.i-m-joking | I'm joking. | a way to tell somebody you are not serious. | Don't worry, ___ ! I didn't really eat your last chocolate. | I'm joking (full) ; I'm joking. (full) | I'm joking. (full) ; I'm joking (full) | I'm sure. ; Any luck? ; Do you mind ...? |
| g3u05.w.i-m-sure | I'm sure. | a way to tell somebody you are really certain about a thing. | Will the train come on time? — ___ It is always on time. | I'm sure. (full) ; I'm sure (full) | I'm sure. (full) ; I'm sure (full) | I'm joking. ; Any luck? ; Do you mind ...? |
| g3u05.w.lucky-charm | lucky charm | a small object you carry because you think it brings you good luck. | She always carries her ___ , a small horseshoe, in her pocket every day for good luck. | lucky charm (full) | lucky charm (full) ; a lucky charm (full) | alarm clock ; toothbrush ; sleeping bag |
| g3u05.w.obvious | obvious | so plain that everybody can understand it at once. | It was ___ that she was tired — she could not stop yawning in class. | obvious (full) | obvious (full) | spooky ; evil ; traditional |
| g3u05.w.pavement | pavement | the place beside a road where people go on foot. | Stay on the ___ next to the buildings, not on the road. | pavement (full) | pavement (full) ; the pavement (full) | crack ; salt ; haircut |
| g3u05.w.rich | rich | having a lot of money. | You will be ___ if you hear a cuckoo and shake the money in your pocket. | rich (full) | rich (full) | spooky ; evil ; obvious |
| g3u05.w.salt | salt | white, and you put it on food to give it more taste. | I dropped the ___ on the table — some people think that is bad luck. | salt (full) | salt (full) | toothbrush ; haircut ; lucky charm |
| g3u05.w.satisfied | satisfied | happy and pleased with a thing because it is good. | I am not really ___ with your work — please do it again. | satisfied (full) | satisfied (full) | spooky ; evil ; rich |
| g3u05.w.seriously | seriously | really, not for fun. | Do you ___ believe in all of these stories? They are just stories! | seriously (full) | seriously (full) | obvious ; rich ; spooky |
| g3u05.w.sleeping-bag | sleeping bag | a warm cover you lie inside when you go camping. | Nick is in his ___ , dreaming. | sleeping bag (full) | sleeping bag (full) ; a sleeping bag (full) | toothbrush ; alarm clock ; lucky charm |
| g3u05.w.spirit | spirit | a ghost or an evil thing — the dead man or woman who some people think still lives. | There is a ___ called Candyman who lives in this home. | spirit (full) | spirit (full) ; a spirit (full) | superstition ; crack ; salt |
| g3u05.w.spooky | spooky | scary and strange, like a place where ghosts live. | Wow, this home is really ___ . Who lives here? | spooky (full) | spooky (full) | obvious ; rich ; satisfied |
| g3u05.w.superstition | superstition | a story about luck that many people think is true. | When you break a mirror, some people think it brings bad luck — but it's just a silly ___ . | superstition (full) | superstition (full) ; a superstition (full) | spirit ; haircut ; pavement |
| g3u05.w.superstitious | superstitious | feeling that stories about luck and magic are true. | My grandmother is very ___ , so she will never break a mirror. | superstitious (full) | superstitious (full) | spooky ; rich ; satisfied |
| g3u05.w.to-arrange | to arrange | to agree on a time and place to do a thing. | Can we ___ a time to meet after school on Friday? | arrange (full) | to arrange (full) ; arrange (full) ; arranged (full) | to ignore ; to attract ; to trick |
| g3u05.w.to-attract | to attract | to make a thing or animal come near to you. | If you whistle in the woods, you will ___ a spirit, the people in China think. | attract (full) | to attract (full) ; attract (full) | to enter ; to trick ; to shake |
| g3u05.w.to-be-unlucky | to be unlucky | to have bad luck — bad luck keeps happening to you. | Dan is always so ___ . Bad luck happens to him all the time. | unlucky (full) | to be unlucky (full) ; be unlucky (full) ; unlucky (full) ; to have bad luck (partial) | to come true ; to make a wish ; spooky |
| g3u05.w.to-believe-in-superstitions | to believe in superstitions | to think that stories about luck and magic are true. | Do you really ___ , or do you think they are all just silly? | believe in superstitions (full) | to believe in superstitions (full) ; believe in superstitions (full) | to make a wish ; to come true ; to bring (good/bad) luck |
| g3u05.w.to-bring-luck | to bring (good/bad) luck | When people believe an object or action makes nice or unlucky things happen to you. | If you break a mirror, it ___ you seven years' bad luck, people think. | brings (full) ; brings bad luck (partial) | to bring luck (full) ; bring luck (full) ; to bring good luck (full) ; to bring bad luck (full) | to come true ; to make a wish ; to scream |
| g3u05.w.to-catch-a-cold | to catch a cold | to become ill, with a runny nose and a cough. | Wear a warm jacket in the snow, or you will ___ and be sick in bed. | catch a cold (full) | to catch a cold (full) ; catch a cold (full) | to make a wish ; to come true ; to shake |
| g3u05.w.to-come-true | to come true | when a dream or a hope really happens. | I really hope my dream of going to Japan will ___ one day. | come true (full) | to come true (full) ; come true (full) | to make a wish ; to wish for sth. ; to attract |
| g3u05.w.to-enter | to enter | to go into a place. | When you want to ___ your home in China, you have to go this way or that way. | enter (full) | to enter (full) ; enter (full) | to attract ; to whistle ; to trick |
| g3u05.w.to-have-luck | to have (good/bad) luck | When nice or unlucky things happen to you by chance, not by skill. | I ___ really good luck today, and I am very happy about it! | had (full) ; had good luck (partial) | to have luck (full) ; have luck (full) ; to have good luck (full) ; to have bad luck (full) | to come true ; to make a wish ; to scream |
| g3u05.w.to-ignore | to ignore | to take no notice of somebody, like they are not there. | ___ him — he just wants to scare you. | Ignore (full) | to ignore (full) ; ignore (full) | to attract ; to enter ; to scream |
| g3u05.w.to-make-a-wish | to make a wish | to close your eyes and hope for a thing you really want. | Close your eyes and ___ on your birthday, then hope it comes true. | make a wish (full) | to make a wish (full) ; make a wish (full) | to come true ; to be unlucky ; to ignore |
| g3u05.w.to-scream | to scream | to give a high cry because you are scared or hurt. | She wanted to ___ when the big black spider came near. | scream (full) | to scream (full) ; scream (full) | to whistle ; to shake ; to attract |
| g3u05.w.to-shake | to shake | to make a thing go up and down fast many times. | I always ___ the money in my pocket if I hear a cuckoo. | shake (full) | to shake (full) ; shake (full) | to whistle ; to scream ; to enter |
| g3u05.w.to-trick | to trick | to make somebody think a lie is true. | Some homes in China have spirit screens to ___ ghosts and stop them. | trick (full) | to trick (full) ; trick (full) | to enter ; to attract ; to whistle |
| g3u05.w.to-whistle | to whistle | to make a high sound with your mouth. | In Norway, people think that if you ___ when the sun shines, it will shine all afternoon. | whistle (full) | to whistle (full) ; whistle (full) | to scream ; to shake ; to enter |
| g3u05.w.to-wish-for-sth | to wish for sth. | to want a thing very much and to hope it happens. | A dream comes true if you ___ a bad thing, but no one does that. | wish for (full) | to wish for sth. (full) ; wish for sth. (full) ; to wish for (full) ; wish for (full) | to come true ; to make a wish ; to bring (good/bad) luck |
| g3u05.w.toothbrush | toothbrush | a small brush to clean your teeth. | If you drop your ___ on the ground, you have to wash it first. | toothbrush (full) | toothbrush (full) ; a toothbrush (full) | alarm clock ; sleeping bag ; lucky charm |
| g3u05.w.traditional | traditional | done in this way for a very long time. | ___ homes in China have big spirit screens to keep ghosts out. | Traditional (full) | traditional (full) | evil ; spooky ; obvious |
| g3u05.w.unlucky | unlucky | having or bringing bad luck. | In Italy, the ___ number is 17, and many people stay away from it. | unlucky (full) | unlucky (full) | rich ; spooky ; obvious |

## Grammar items (101)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g3u05.gi.first-conditional.cp.001 | context-picker | Deine Mutter sagt: 'Wir gehen vielleicht in den Zoo.' Welche Antwort ist richtig? [de] | If we go to the zoo, I'll take my camera. (full) | — | If we will go to the zoo, I'll take my camera. ; If we went to the zoo, I'll take my camera. ; If we go to the zoo, I take my camera. | — | — | false |
| g3u05.gi.first-conditional.cp.002 | context-picker | Nick will dich am Lagerfeuer erschrecken. Welcher Satz ist richtig? [de] | If you say 'Candyman' three times, a spirit will appear. (full) | — | If you will say 'Candyman' three times, a spirit will appear. ; If you say 'Candyman' three times, a spirit appears. ; If you are saying 'Candyman' three times, a spirit will appear. | — | — | false |
| g3u05.gi.first-conditional.cp.004 | context-picker | Du redest mit Kate über den Freitag. Welcher Satz ist richtig? [de] | If the band plays in Brighton, we'll go to the concert. (full) | — | If the band will play in Brighton, we'll go to the concert. ; If the band plays in Brighton, we go to the concert. ; If the band is playing in Brighton, we'll go to the concert. | — | — | false |
| g3u05.gi.first-conditional.ec.001 | error-correction | Finde und verbessere den Fehler: If it will rain, we will stay inside. [de] | If it rains, we will stay inside. (full) ; If it rains, we'll stay inside. (full) ; rains (partial) | — | — | — | — | false |
| g3u05.gi.first-conditional.ec.002 | error-correction | Finde und verbessere den Fehler: If you eat too much, you feel sick. [de] | If you eat too much, you will feel sick. (full) ; If you eat too much, you'll feel sick. (full) ; will feel (partial) | — | — | — | — | false |
| g3u05.gi.first-conditional.ec.003 | error-correction | Finde und verbessere den Fehler: If it is raining tomorrow, we'll stay inside. [de] | If it rains tomorrow, we'll stay inside. (full) ; If it rains tomorrow, we will stay inside. (full) ; rains (partial) | — | — | — | — | false |
| g3u05.gi.first-conditional.ec.004 | error-correction | Finde und verbessere den Fehler: If she will study hard, she will pass the exam. [de] | If she studies hard, she will pass the exam. (full) ; If she studies hard, she'll pass the exam. (full) ; studies (partial) | — | — | — | — | false |
| g3u05.gi.first-conditional.ec.005 | error-correction | Finde und verbessere den Fehler: If you won't hurry, we'll be late for school. [de] | If you don't hurry, we'll be late for school. (full) ; If you don't hurry, we will be late for school. (full) ; don't hurry (partial) | — | — | — | — | true |
| g3u05.gi.first-conditional.ec.006 | error-correction | Finde und verbessere den Fehler: If you are walking under a ladder, you'll have bad luck. [de] | If you walk under a ladder, you'll have bad luck. (full) ; If you walk under a ladder, you will have bad luck. (full) ; walk (partial) | — | — | — | — | false |
| g3u05.gi.first-conditional.gf.001 | gap-fill | If you ___ (break) a mirror, you will have bad luck. [en, 1 blank(s)] | break (full) | — | — | — | — | false |
| g3u05.gi.first-conditional.gf.002 | gap-fill | If she ___ (work) hard, she will get good marks. [en, 1 blank(s)] | works (full) | — | — | — | — | false |
| g3u05.gi.first-conditional.gf.003 | gap-fill | If you study hard, you ___ pass the test. [en, 1 blank(s)] | will (full) ; 'll (full) | — | — | — | — | false |
| g3u05.gi.first-conditional.gf.004 | gap-fill | If you whistle when the sun is shining, it ___ shine for two more hours. [en, 1 blank(s)] | will (full) ; 'll (full) | — | — | — | — | false |
| g3u05.gi.first-conditional.gf.005 | gap-fill | If you ___ (hear) a cuckoo, you will get rich. [en, 1 blank(s)] | hear (full) | — | — | — | — | false |
| g3u05.gi.first-conditional.gf.006 | gap-fill | We ___ (go) to the beach if the weather is nice. [en, 1 blank(s)] | will go (full) ; 'll go (full) | — | — | — | — | false |
| g3u05.gi.first-conditional.gf.007 | gap-fill | If I ___ (have) enough money, I'll buy a new skateboard. [en, 1 blank(s)] | have (full) | — | — | — | — | false |
| g3u05.gi.first-conditional.gf.008 | gap-fill | If you ___ (put) your handbag on the floor, you will never have money. [en, 1 blank(s)] | put (full) | — | — | — | — | false |
| g3u05.gi.first-conditional.gf.009 | gap-fill | If the weather ___ (be) nice tomorrow, we ___ (go) to the beach. [en, 2 blank(s)] | is \| will go (full) ; is \| 'll go (full) | — | — | — | — | false |
| g3u05.gi.first-conditional.gf.010 | gap-fill | If you ___ (break) your phone, I ___ (buy) you a new one. [en, 2 blank(s)] | break \| will buy (full) ; break \| 'll buy (full) | — | — | — | — | false |
| g3u05.gi.first-conditional.gf.011 | gap-fill | If you ___ (get) a haircut before the exam, you ___ (forget) everything. [en, 2 blank(s)] | get \| will forget (full) ; get \| 'll forget (full) | — | — | — | — | false |
| g3u05.gi.first-conditional.gf.012 | gap-fill | If she ___ (not / hurry), she will miss the bus. [en, 1 blank(s)] | doesn't hurry (full) ; does not hurry (full) | — | — | — | — | true |
| g3u05.gi.first-conditional.gf.013 | gap-fill | If you ___ (not / eat) breakfast, you won't have energy for PE. [en, 1 blank(s)] | don't eat (full) ; do not eat (full) | — | — | — | — | true |
| g3u05.gi.first-conditional.gf.014 | gap-fill | I ___ (not / pass) the exam if I ___ (not / study) harder. [en, 2 blank(s)] | won't pass \| don't study (full) ; will not pass \| do not study (full) | — | — | — | — | true |
| g3u05.gi.first-conditional.gf.015 | gap-fill | We ___ be late if we don't hurry up. [en, 1 blank(s)] | will (full) ; 'll (full) | — | — | — | — | false |
| g3u05.gi.first-conditional.gf.016 | gap-fill | If you ___ (kill) a spider in the house, you will have bad luck. [en, 1 blank(s)] | kill (full) | — | — | — | — | false |
| g3u05.gi.first-conditional.gf.017 | gap-fill | If a black cat ___ (cross) the street, you ___ (have) bad luck. [en, 2 blank(s)] | crosses \| will have (full) ; crosses \| 'll have (full) | — | — | — | — | false |
| g3u05.gi.first-conditional.gs.004 | group-sort | Sortiere die if-Sätze: richtig (✓) oder falsch (✗)? [de] | — | — | — | — | ✓: If it rains, we will stay inside., If you study, you'll pass., If she hurries, she'll catch the bus. \| ✗: If it will rain, we will stay inside., If you will study, you'll pass., If she is hurrying, she'll catch the bus. | false |
| g3u05.gi.first-conditional.gs.005 | group-sort | Sortiere: Was gehört zum if-Teil, was zum will-Teil? [de] | — | — | — | — | if ...: If it rains, If you study hard, If she breaks a mirror, If we miss the bus \| ... will ...: we will stay inside, you'll pass the test, she'll have bad luck, we'll be late | false |
| g3u05.gi.first-conditional.mc.001 | multiple-choice | Welcher Satz ist richtig? [de] | If it snows tomorrow, we will build a snowman. (full) | — | If it will snow tomorrow, we will build a snowman. ; If it snowed tomorrow, we will build a snowman. ; If it is snowing tomorrow, we will build a snowman. | — | — | false |
| g3u05.gi.first-conditional.mc.002 | multiple-choice | Welcher Satz ist richtig? [de] | If you touch that, you'll burn your hand. (full) | — | If you will touch that, you'll burn your hand. ; If you touch that, you burn your hand. ; If you touched that, you'll burn your hand. | — | — | false |
| g3u05.gi.first-conditional.mc.003 | multiple-choice | Welcher Satz ist richtig? [de] | If you break a mirror, you'll have bad luck. (full) | — | If you will break a mirror, you'll have bad luck. ; If you break a mirror, you have bad luck. ; If you are breaking a mirror, you'll have bad luck. | — | — | false |
| g3u05.gi.first-conditional.mc.004 | multiple-choice | Welcher Satz ist richtig? [de] | If it rains tomorrow, we won't go on the trip. (full) | — | If it will rain tomorrow, we won't go on the trip. ; If it rains tomorrow, we don't go on the trip. ; If it is raining tomorrow, we won't go on the trip. | — | — | true |
| g3u05.gi.first-conditional.mc.005 | multiple-choice | Welcher Satz ist richtig? [de] | I won't go to the party if I don't feel better. (full) | — | I won't go to the party if I won't feel better. ; I don't go to the party if I don't feel better. ; I won't go to the party if I'm not feeling better. | — | — | true |
| g3u05.gi.first-conditional.mc.006 | multiple-choice | Welcher Satz ist richtig? [de] | If you walk on the cracks, you'll have bad luck. (full) | — | If you will walk on the cracks, you'll have bad luck. ; If you walk on the cracks, you have bad luck. ; If you are walking on the cracks, you'll have bad luck. | — | — | false |
| g3u05.gi.first-conditional.mp.001 | matching-pairs | Finde die Paare: if-Satz und passende Folge. [de] | — | — | — | If you walk under a ladder, ↔ you'll have bad luck. ; If you hear a cuckoo, ↔ you'll get rich. ; If you put your handbag on the floor, ↔ you'll never have money. ; If you whistle, ↔ the sun will shine longer. ; If you see a rainbow, ↔ you can make a wish. | — | false |
| g3u05.gi.first-conditional.mt.002 | matching | Welche Folge passt? Verbinde jeden if-Satz mit dem richtigen Ende. [de] | — | — | — | If you wear that T-shirt, ↔ you'll look really good. ; If you touch that dog, ↔ it'll bite you. ; If he drives that fast, ↔ he'll have an accident. ; If we leave now, ↔ we'll be home by ten. | — | false |
| g3u05.gi.first-conditional.mt.003 | matching | Welche Hälfte passt? Verbinde jeden if-Satz mit seiner Folge. [de] | — | — | — | If it rains, ↔ we'll get wet. ; If you don't study, ↔ you'll fail the test. ; If we hurry, ↔ we'll catch the train. ; If she calls me, ↔ I'll tell her the news. | — | false |
| g3u05.gi.first-conditional.qf.001 | question-formation | Bilde die Frage aus den Teilen: what / happen / if / you / break a mirror / ? [de] | What will happen if you break a mirror? (full) | — | — | — | — | false |
| g3u05.gi.first-conditional.qf.002 | question-formation | Bilde die Frage aus den Teilen: what / you / do / if / it / rain / at the weekend / ? [de] | What will you do if it rains at the weekend? (full) | — | — | — | — | false |
| g3u05.gi.first-conditional.sb.005 | sentence-building | Bring die Wörter in die richtige Reihenfolge. [de] | If you don't hurry, you will miss the bus. (full) ; If you don't hurry, you'll miss the bus. (full) ; You will miss the bus if you don't hurry. (full) | — | — | — | — | false |
| g3u05.gi.first-conditional.sb.006 | sentence-building | Bring die Wörter in die richtige Reihenfolge. [de] | If it rains, we won't go to the park. (full) ; We won't go to the park if it rains. (full) | — | — | — | — | true |
| g3u05.gi.first-conditional.sb.007 | sentence-building | Bring die Wörter in die richtige Reihenfolge. [de] | If you break a mirror, you'll have bad luck. (full) ; If you break a mirror, you will have bad luck. (full) ; You'll have bad luck if you break a mirror. (full) | — | — | — | — | false |
| g3u05.gi.first-conditional.sb.008 | sentence-building | Bring die Wörter in die richtige Reihenfolge. [de] | If you hear a cuckoo, you'll get rich. (full) ; If you hear a cuckoo, you will get rich. (full) ; You'll get rich if you hear a cuckoo. (full) | — | — | — | — | false |
| g3u05.gi.first-conditional.tf.007 | transformation | Schreib den Satz mit dem Wort in Klammern fertig: If you ___ (practise) every day, you will play really well. [de, 1 blank(s)] | practise (full) ; practice (partial) | — | — | — | — | false |
| g3u05.gi.first-conditional.tf.008 | transformation | Setz beide Wörter richtig ein: If she ___ (not / finish) her homework, Mum ___ (not / let) her play outside. [de, 2 blank(s)] | doesn't finish \| won't let (full) ; does not finish \| will not let (full) | — | — | — | — | true |
| g3u05.gi.first-conditional.tf.009 | transformation | Bilde einen if-Satz mit will aus diesen Teilen: you / drop your toothbrush -> catch a cold. [de] | If you drop your toothbrush, you'll catch a cold. (full) ; If you drop your toothbrush, you will catch a cold. (full) | — | — | — | — | false |
| g3u05.gi.first-conditional.tf.010 | transformation | Bilde einen if-Satz mit will: it / snow -> we / build a snowman. [de] | If it snows, we'll build a snowman. (full) ; If it snows, we will build a snowman. (full) | — | — | — | — | false |
| g3u05.gi.first-conditional.tr.001 | translation | Wenn es morgen regnet, werden wir zu Hause bleiben. [de] | If it rains tomorrow, we will stay at home. (full) ; If it rains tomorrow, we'll stay at home. (full) ; We will stay at home if it rains tomorrow. (full) | deToEn | — | — | — | false |
| g3u05.gi.first-conditional.tr.002 | translation | Wenn du nicht bald kommst, gehe ich ohne dich. [de] | If you don't come soon, I will go without you. (full) ; If you don't come soon, I'll go without you. (full) ; I will go without you if you don't come soon. (full) | deToEn | — | — | — | true |
| g3u05.gi.first-conditional.tr.005 | translation | Wenn wir den Bus verpassen, werden wir zu spät in die Schule kommen. [de] | If we miss the bus, we will be late for school. (full) ; If we miss the bus, we'll be late for school. (full) ; We will be late for school if we miss the bus. (full) | deToEn | — | — | — | false |
| g3u05.gi.first-conditional.tr.006 | translation | Wenn du einen Regenbogen siehst, kannst du dir etwas wünschen. [de] | If you see a rainbow, you can make a wish. (full) ; If you see a rainbow, you'll make a wish. (partial) | deToEn | — | — | — | false |
| g3u05.gi.unless.cp.001 | context-picker | Dein Freund sitzt noch auf dem Sofa und die Schule beginnt in zehn Minuten. Warne ihn. Welcher Satz ist richtig? [de] | Unless you leave now, you will be late. (full) | — | Unless you do not leave now, you will be late. ; Unless you will leave now, you will be late. ; If you leave now, you will be late. | — | — | true |
| g3u05.gi.unless.cp.002 | context-picker | Es sieht nach Regen aus und ihr wollt ein Picknick machen. Welcher Satz passt? [de] | Unless the rain stops, we will not have the picnic. (full) | — | Unless the rain does not stop, we will not have the picnic. ; Unless the rain will stop, we will not have the picnic. ; If the rain stops, we will not have the picnic. | — | — | false |
| g3u05.gi.unless.cp.003 | context-picker | Deine Mitspielerin kommt nie zum Training. Erkläre ihr die Folge. Welcher Satz ist richtig? [de] | Unless you practise, you will not improve. (full) | — | Unless you do not practise, you will not improve. ; Unless you will practise, you will not improve. ; If you practise, you will not improve. | — | — | false |
| g3u05.gi.unless.ec.001 | error-correction | Finde und verbessere den Fehler: "I will not go unless you do not come with me." [de] | I will not go unless you come with me. (full) ; unless you come (partial) ; unless you come with me (partial) | — | — | — | — | false |
| g3u05.gi.unless.ec.002 | error-correction | Finde und verbessere den Fehler: "Unless you do not hurry, we will miss the bus." [de] | Unless you hurry, we will miss the bus. (full) ; Unless you hurry (partial) | — | — | — | — | false |
| g3u05.gi.unless.ec.003 | error-correction | Finde und verbessere den Fehler: "We will be late unless we will hurry." [de] | We will be late unless we hurry. (full) ; unless we hurry (partial) | — | — | — | — | false |
| g3u05.gi.unless.ec.004 | error-correction | Finde und verbessere den Fehler: "Unless you will study, you will not pass the test." [de] | Unless you study, you will not pass the test. (full) ; Unless you study (partial) | — | — | — | — | false |
| g3u05.gi.unless.ec.005 | error-correction | Finde und verbessere den Fehler: "Unless you do not finish your homework, you can not play outside." [de] | Unless you finish your homework, you can not play outside. (full) ; Unless you finish your homework (partial) | — | — | — | — | false |
| g3u05.gi.unless.ec.006 | error-correction | Finde und verbessere den Fehler: "Unless you study, you will pass the exam." [de] | If you study, you will pass the exam. (full) ; Unless you study, you will not pass the exam. (full) | — | — | — | — | true |
| g3u05.gi.unless.ec.007 | error-correction | Finde und verbessere den Fehler: "I will come to the party if not you tell me it is cancelled." [de] | I will come to the party unless you tell me it is cancelled. (full) ; unless you tell me (partial) | — | — | — | — | false |
| g3u05.gi.unless.gf.001 | gap-fill | Ergänze: "I will not go to the party ___ you come with me." [de, 1 blank(s)] | unless (full) | — | — | — | — | false |
| g3u05.gi.unless.gf.002 | gap-fill | Ergänze: "You will be late ___ you leave now." [de, 1 blank(s)] | unless (full) | — | — | — | — | false |
| g3u05.gi.unless.gf.003 | gap-fill | Ergänze: "You will get sunburnt ___ you put on sunscreen." [de, 1 blank(s)] | unless (full) | — | — | — | — | false |
| g3u05.gi.unless.gf.004 | gap-fill | Ergänze: "They will not let you into the pool ___ you wear a swimming cap." [de, 1 blank(s)] | unless (full) | — | — | — | — | false |
| g3u05.gi.unless.gf.005 | gap-fill | Ergänze: "We can not have the picnic ___ it stops raining." [de, 1 blank(s)] | unless (full) | — | — | — | — | false |
| g3u05.gi.unless.gf.006 | gap-fill | Ergänze mit "if" oder "unless": "I will lend you my book ___ you promise to give it back." [de, 1 blank(s)] | if (full) | — | — | — | — | true |
| g3u05.gi.unless.gf.010 | gap-fill | Ergänze: "She will not pass the test ___ she studies harder." [de, 1 blank(s)] | unless (full) | — | — | — | — | false |
| g3u05.gi.unless.gf.011 | gap-fill | Ergänze: "The match will be cancelled ___ the rain stops." [de, 1 blank(s)] | unless (full) | — | — | — | — | false |
| g3u05.gi.unless.gf.012 | gap-fill | Ergänze: "I will go to the cinema tomorrow ___ I have too much homework." [de, 1 blank(s)] | unless (full) | — | — | — | — | false |
| g3u05.gi.unless.gf.013 | gap-fill | Ergänze beide Lücken: "Unless you ___ (hurry), you ___ (be) late." [de, 2 blank(s)] | hurry \| will be (full) ; hurry \| 'll be (full) | — | — | — | — | false |
| g3u05.gi.unless.gf.014 | gap-fill | Ergänze beide Lücken: "Unless we ___ (bring) an umbrella, we ___ (get) wet." [de, 2 blank(s)] | bring \| will get (full) ; bring \| 'll get (full) | — | — | — | — | false |
| g3u05.gi.unless.gf.015 | gap-fill | Ergänze beide Lücken: "Unless you ___ (practise), you ___ (not improve)." [de, 2 blank(s)] | practise \| will not improve (full) ; practise \| won't improve (full) ; practice \| will not improve (partial) | — | — | — | — | false |
| g3u05.gi.unless.gs.001 | group-sort | Sortiere: Ist der Satz richtig (✓) oder falsch (✗)? [de] | — | — | — | — | ✓: Unless you hurry, you will be late., I will not go unless you come with me., Unless she studies, she will fail. \| ✗: Unless you do not hurry, you will be late., Unless you will come, I will not go., Unless she will study, she will fail. | false |
| g3u05.gi.unless.gs.002 | group-sort | Sortiere: Braucht der Satz "unless" oder "if"? [de] | — | — | — | — | unless: You will be late ___ you leave now., I will not help you ___ you ask me., We will not go out ___ it stops raining. \| if: I will lend you my book ___ you promise to give it back., She will be happy ___ you invite her., I will give you a sweet ___ you help me. | false |
| g3u05.gi.unless.mc.001 | multiple-choice | Welcher Satz bedeutet dasselbe wie "I will not help you if you do not ask me"? [de] | I will not help you unless you ask me. (full) | — | I will not help you unless you do not ask me. ; I will help you unless you ask me. ; I will not help you if you ask me. | — | — | false |
| g3u05.gi.unless.mc.002 | multiple-choice | Welcher Satz bedeutet dasselbe wie "If you do not clean your room, you can not go out"? [de] | Unless you clean your room, you can not go out. (full) | — | If you clean your room, you can not go out. ; Unless you do not clean your room, you can not go out. ; While you clean your room, you can not go out. | — | — | false |
| g3u05.gi.unless.mc.003 | multiple-choice | Welcher Satz ist richtig? [de] | Unless you hurry, we will miss the train. (full) | — | Unless you do not hurry, we will miss the train. ; Unless you will hurry, we will miss the train. ; If you hurry, we will miss the train. | — | — | true |
| g3u05.gi.unless.mc.004 | multiple-choice | Welcher Satz ist richtig? [de] | We will not go on the trip unless the rain stops. (full) | — | We will not go on the trip unless the rain does not stop. ; We will not go on the trip unless the rain will stop. ; We will not go on the trip if the rain stops. | — | — | false |
| g3u05.gi.unless.mc.005 | multiple-choice | Welche zwei Sätze bedeuten GENAU dasselbe? [de] | "Unless you say sorry, she will be angry." = "If you do not say sorry, she will be angry." (full) | — | "Unless you say sorry, she will be angry." = "If you say sorry, she will be angry." ; "Unless you do not say sorry, she will be angry." = "If you do not say sorry, she will be angry." ; "Unless you say sorry, she will be happy." = "If you do not say sorry, she will be angry." | — | — | false |
| g3u05.gi.unless.mc.006 | multiple-choice | Welches Wort passt? "You will catch a cold ___ you wear a hat." [de, 1 blank(s)] | unless (full) | — | if ; because ; when | — | — | false |
| g3u05.gi.unless.mc.007 | multiple-choice | Welches Wort passt? "We will have the picnic ___ it rains." [de, 1 blank(s)] | unless (full) | — | if ; while ; after | — | — | true |
| g3u05.gi.unless.mp.001 | matching-pairs | Finde die Paare: "unless"-Satz und gleichbedeutender "if ... not"-Satz. [de] | — | — | — | Unless you wear a hat, you will catch a cold. ↔ If you do not wear a hat, you will catch a cold. ; Unless you ask, I will not help you. ↔ If you do not ask, I will not help you. ; Unless you leave now, you will miss the bus. ↔ If you do not leave now, you will miss the bus. ; Unless we hurry, we will be late. ↔ If we do not hurry, we will be late. | — | false |
| g3u05.gi.unless.mp.002 | matching-pairs | Finde die Paare: "unless"-Satz und gleichbedeutender "if ... not"-Satz. [de] | — | — | — | Unless you whistle, there will be no rain. ↔ If you do not whistle, there will be no rain. ; Unless you cover your ears, the noise will scare you. ↔ If you do not cover your ears, the noise will scare you. ; Unless she calls me, I will be worried. ↔ If she does not call me, I will be worried. ; Unless we leave early, we will miss the train. ↔ If we do not leave early, we will miss the train. ; Unless you find your ticket, you will not get in. ↔ If you do not find your ticket, you will not get in. | — | false |
| g3u05.gi.unless.mt.001 | matching | Verbinde jeden "unless"-Satz mit seiner Bedeutung mit "if ... not". [de] | — | — | — | Unless you hurry, you will be late. ↔ If you do not hurry, you will be late. ; Unless it stops raining, we will stay inside. ↔ If it does not stop raining, we will stay inside. ; She will be angry unless you say sorry. ↔ She will be angry if you do not say sorry. ; I will not come unless you ask me. ↔ I will not come if you do not ask me. | — | false |
| g3u05.gi.unless.mt.002 | matching | Verbinde jeden "unless"-Satz mit seiner Bedeutung mit "if ... not". [de] | — | — | — | Unless you study, you will fail. ↔ If you do not study, you will fail. ; I will not go unless you come. ↔ I will not go if you do not come. ; Unless it rains, we will have a picnic. ↔ If it does not rain, we will have a picnic. ; We will not win unless we try harder. ↔ We will not win if we do not try harder. | — | false |
| g3u05.gi.unless.qf.001 | question-formation | Bilde aus "We will not go unless the weather is nice" die passende Frage. Beginne mit "Will". [de] | Will we go if the weather is not nice? (full) ; Will we go if the weather isn't nice? (partial) | — | — | — | — | false |
| g3u05.gi.unless.qf.002 | question-formation | Bilde aus "You will not pass unless you study" eine Frage. Beginne mit "Will". [de] | Will you pass if you do not study? (full) ; Will you pass if you don't study? (partial) | — | — | — | — | false |
| g3u05.gi.unless.sb.001 | sentence-building | Bring die Wörter in die richtige Reihenfolge. [de] | I will not go unless you come with me. (full) ; Unless you come with me, I will not go. (full) | — | — | — | — | false |
| g3u05.gi.unless.sb.002 | sentence-building | Bring die Wörter in die richtige Reihenfolge. [de] | She will not invite you unless you apologise. (full) ; Unless you apologise, she will not invite you. (full) | — | — | — | — | false |
| g3u05.gi.unless.sb.003 | sentence-building | Bring die Wörter in die richtige Reihenfolge. [de] | Unless you hurry, you will miss the bus. (full) ; You will miss the bus unless you hurry. (full) | — | — | — | — | false |
| g3u05.gi.unless.tf.001 | transformation | Schreibe mit "unless", ohne die Bedeutung zu ändern: "I will not help him with his work if he does not ask me to." → "I will not help him with his work ___." [de, 1 blank(s)] | unless he asks me to (full) ; unless he asks me (partial) | — | — | — | — | false |
| g3u05.gi.unless.tf.002 | transformation | Schreibe mit "unless", ohne die Bedeutung zu ändern: "He will be sick if he does not stop eating." [de] | He will be sick unless he stops eating. (full) ; Unless he stops eating, he will be sick. (full) | — | — | — | — | false |
| g3u05.gi.unless.tf.003 | transformation | Schreibe mit "unless", ohne die Bedeutung zu ändern: "You will not be here in time if you do not run." [de] | You will not be here in time unless you run. (full) ; Unless you run, you will not be here in time. (full) | — | — | — | — | false |
| g3u05.gi.unless.tf.004 | transformation | Schreibe mit "unless", ohne die Bedeutung zu ändern: "If Tom does not apologise, I will not talk to him again." [de] | Unless Tom apologises, I will not talk to him again. (full) ; I will not talk to him again unless Tom apologises. (full) | — | — | — | — | false |
| g3u05.gi.unless.tf.005 | transformation | Schreibe mit "unless", ohne die Bedeutung zu ändern: "You will get wet if you do not bring an umbrella." [de] | You will get wet unless you bring an umbrella. (full) ; Unless you bring an umbrella, you will get wet. (full) | — | — | — | — | false |
| g3u05.gi.unless.tr.001 | translation | Übersetze ins Englische: "Ich gehe nicht schwimmen, es sei denn, du kommst mit." [de] | I will not go swimming unless you come with me. (full) ; Unless you come with me, I will not go swimming. (full) ; I won't go swimming unless you come with me. (partial) | deToEn | — | — | — | false |
| g3u05.gi.unless.tr.002 | translation | Übersetze ins Englische: "Du wirst den Test nicht bestehen, wenn du nicht mehr lernst." [de] | You will not pass the test unless you study more. (full) ; Unless you study more, you will not pass the test. (full) ; You won't pass the test unless you study more. (partial) | deToEn | — | — | — | false |
| g3u05.gi.unless.tr.003 | translation | Übersetze ins Englische: "Wir werden zu spät kommen, es sei denn, wir laufen schneller." [de] | We will be late unless we run faster. (full) ; Unless we run faster, we will be late. (full) ; We'll be late unless we run faster. (partial) | deToEn | — | — | — | false |
| g3u05.gi.unless.tr.004 | translation | Übersetze ins Englische: "Du darfst nicht mit deinen Freunden spielen, wenn du deine Hausaufgaben nicht machst." [de] | You can not play with your friends unless you do your homework. (full) ; Unless you do your homework, you can not play with your friends. (full) ; You can't play with your friends unless you do your homework. (partial) | deToEn | — | — | — | false |
| g3u05.gi.unless.tr.005 | translation | Übersetze ins Englische: "Du wirst dich erkälten, es sei denn, du trägst eine Mütze." [de] | You will catch a cold unless you wear a hat. (full) ; Unless you wear a hat, you will catch a cold. (full) ; You'll catch a cold unless you wear a hat. (partial) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g3-u05/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g3-u05",
  "lens": "answers",
  "itemsHash": "e1ddda3c1db0",
  "promptHash": "70fa2d8cdf22",
  "round": 1,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 142, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
