# Verify lens — answers — g3-u08 (round 1)

<!-- domigo:verify answers g3-u08 items=58382b23fcb2 prompt=70fa2d8cdf22 round=1 -->

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

## Vocab items (47)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g3u08.w.automatically | automatically | happening by itself, without a person doing anything | When the cat wants to go inside, the flap opens ___. | automatically (full) | automatically (full) | perhaps ; remarkable ; confident |
| g3u08.w.bacon | bacon | thin slices of salted meat from a pig that you fry | Lots of people love ___ and egg for breakfast. | bacon (full) | bacon (full) | soap ; dish ; fat |
| g3u08.w.collar | collar | a band that goes around the neck of a shirt or around an animal's neck | I've created a ___ for our cat. | collar (full) | collar (full) ; collars (full) | glove ; wrist ; device |
| g3u08.w.computer-science | computer science | the school subject where you learn how to write programs and make machines think | His best subject at school is ___. | computer science (full) | computer science (full) | engineer ; inspiration ; inventor |
| g3u08.w.confident | confident | feeling sure that you can do something well | I'm quite ___ it will work, and I really hope that it does. | confident (full) | confident (full) | remarkable ; perhaps ; automatically |
| g3u08.w.crowd | crowd | a very large group of people standing together in one place | He used Tesla coils to shoot large lightning bolts into the ___. | crowd (full) | crowd (full) ; crowds (full) | energy ; influence ; inspiration |
| g3u08.w.crutches | crutches | long sticks you put under your arms to help you walk when a leg is hurt | She uses a walker or ___ to move about. | crutches (full) | crutches (full) | glove ; wheelchair ; collar |
| g3u08.w.current | current | electricity that flows along through something | He passed a huge ___ through his body to power eight light bulbs. | current (full) | current (full) ; currents (full) | energy ; soap ; fat |
| g3u08.w.device | device | a small machine made for one special job | This ___ allows people to talk under water. | device (full) | device (full) ; devices (full) | product ; dish ; soap |
| g3u08.w.dish | dish | food that has been cooked in a special way | I invented a new ___ with the cook of the restaurant. | dish (full) | dish (full) ; dishes (full) | product ; device ; soap |
| g3u08.w.electric | electric (motor) | working with electricity | Tesla invented the ___ motor. | electric (full) | electric (full) | remarkable ; confident ; automatically |
| g3u08.w.energy | energy | the power that makes machines work or keeps things moving | He said he could send ___ waves through water. | energy (full) | energy (full) | current ; influence ; soap |
| g3u08.w.engineer | engineer | a person who designs or makes machines, roads or bridges | What subjects do you need to study to be an ___? | engineer (full) | engineer (full) ; engineers (full) | inventor ; inspiration ; crowd |
| g3u08.w.fat | fat | the oily part of food or the soft part under the skin | I like bacon with less ___. | fat (full) | fat (full) | soap ; current ; dish |
| g3u08.w.glove | glove | a piece of clothing you wear on your hand to keep it warm | Wear some ___ to keep your hands warm in winter. | gloves (full) ; glove (partial) | glove (full) ; gloves (full) | collar ; wrist ; soap |
| g3u08.w.housework | housework | the jobs you do to keep a home clean, like washing and cleaning | Busy parents don't have enough time for ___. | housework (full) | housework (full) | illness ; inspiration ; energy |
| g3u08.w.illness | illness | a problem with your health that makes you feel unwell | Her ___ had stopped Sadie from entering the competition. | illness (full) | illness (full) ; illnesses (full) | inspiration ; housework ; energy |
| g3u08.w.influence | influence | the power to change what other people think or do | Edison used his ___ to tell people that AC was too dangerous. | influence (full) | influence (full) ; influences (full) | energy ; inspiration ; crowd |
| g3u08.w.inspiration | inspiration | a feeling or idea that makes you want to make or do something | This is not the kind of ___ I'm looking for right now. | inspiration (full) | inspiration (full) | influence ; illness ; energy |
| g3u08.w.invention | invention | something completely new that a person has made for the first time | He worked on his ___ for a number of years. | invention (full) | invention (full) ; inventions (full) | inventor ; device ; product |
| g3u08.w.inventor | inventor | a person who makes new things that did not exist before | Thomas Edison was perhaps the most famous ___ of his time. | inventor (full) | inventor (full) ; inventors (full) | engineer ; device ; crowd |
| g3u08.w.perhaps | perhaps | used to say that something is possible but you are not sure | ___ it was his mother who gave him the first idea. | perhaps (full) | perhaps (full) | automatically ; remarkable ; confident |
| g3u08.w.product | product | something that is made so that it can be sold | He started a company to produce his ___. | product (full) | product (full) ; products (full) | device ; invention ; dish |
| g3u08.w.ramp | ramp | a path that goes up at an angle instead of having steps | She needs to look for ___ to get up and down steps. | ramps (full) ; ramp (partial) | ramp (full) ; ramps (full) | wheelchair ; collar ; glove |
| g3u08.w.remarkable | remarkable | so special that people notice it | Kids can sometimes produce something quite ___. | remarkable (full) | remarkable (full) | confident ; automatically ; perhaps |
| g3u08.w.soap | soap | something you use with water to wash your body and hands | Use ___ to wash your hands. | soap (full) | soap (full) | fat ; dish ; current |
| g3u08.w.to-adapt | to adapt | to change yourself or something to fit a new situation | She is able to ___ easily to different situations. | adapt (full) ; to adapt (full) | adapt (full) ; to adapt (full) | to attach ; to support ; to repair |
| g3u08.w.to-attach | to attach | to fix or join one thing to another thing | I'll ___ a picture to my email. | attach (full) ; to attach (full) | attach (full) ; to attach (full) | to adapt ; to repair ; to support |
| g3u08.w.to-be-responsible-for | to be responsible for | to be the one who caused something or who must take care of it | Perhaps his most important invention was also ___ his bad luck. | responsible for (full) ; be responsible for (partial) | be responsible for (full) ; to be responsible for (full) ; responsible for (full) | confident ; remarkable ; automatically |
| g3u08.w.to-decorate | to decorate | to make something look nicer by adding pretty things to it | Then someone invented electric lights to ___ houses. | decorate (full) ; decorated (partial) | decorate (full) ; to decorate (full) | to repair ; to produce ; to research |
| g3u08.w.to-design | to design | to draw the plans for how something will look | I sat down with some pens and ___ my machine on paper. | designed (full) ; design (partial) | design (full) ; to design (full) | to produce ; to discover ; to repair |
| g3u08.w.to-develop | to develop | to slowly make something new over a long time | In the late 1880s, Tesla ___ a new kind of electricity. | developed (full) ; develop (partial) | develop (full) ; to develop (full) | to discover ; to support ; to decorate |
| g3u08.w.to-discover | to discover | to find out something that no one knew before | First, I had to ___ a way of making time travel possible. | discover (full) ; discovered (partial) | discover (full) ; to discover (full) | to invent ; to design ; to decorate |
| g3u08.w.to-experiment | to experiment | to try different ways of doing something to find out what happens | I ___ with different shapes and colours until I found one that worked well. | experimented (full) ; experiment (partial) | experiment (full) ; to experiment (full) | to discover ; to design ; to support |
| g3u08.w.to-impress | to impress | to make someone think you are very good at something | I've invented something that I think might ___ my teacher. | impress (full) | impress (full) ; to impress (full) | to support ; to research ; to repair |
| g3u08.w.to-improve | to improve | to make something better than it was before | I ___ my machine by putting an armchair in it so it was more comfortable. | improved (full) ; improve (partial) | improve (full) ; to improve (full) | to produce ; to discover ; to attach |
| g3u08.w.to-invent | to invent | to make something completely new that did not exist before | Who first ___ the telephone back in 1876? It was Alexander Graham Bell. | invented (full) ; invent (partial) | invent (full) ; to invent (full) | to discover ; to produce ; to repair |
| g3u08.w.to-invest | to invest | to put your money into something to get more money back later | Edison ___ all his money in DC. | invested (full) ; invest (partial) | invest (full) ; to invest (full) | to produce ; to support ; to research |
| g3u08.w.to-produce | to produce | to make a lot of things, usually so they can be sold | If my machine works, I'll have to start ___ them so that all families can have one. | producing (full) ; produce (partial) | produce (full) ; to produce (full) | to invent ; to discover ; to repair |
| g3u08.w.to-repair | to repair | to fix something that is broken so it works again | I love ___ things and playing around with new ideas. | repairing (full) ; repair (partial) | repair (full) ; to repair (full) | to attach ; to invent ; to design |
| g3u08.w.to-research | to research | to study a subject carefully to learn more about it | He decided to ___ underwater sounds and how they travel. | research (full) ; to research (full) | research (full) ; to research (full) | to invest ; to impress ; to decorate |
| g3u08.w.to-shoot | to shoot | to send something out very fast through the air | He used the Tesla coil to ___ large electric lightning bolts into the room. | shoot (full) | shoot (full) ; to shoot (full) ; shot (full) | to develop ; to repair ; to support |
| g3u08.w.to-support | to support | to help someone or give them what they need | I want to do things that will ___ my dream for the future. | support (full) ; to support (full) | support (full) ; to support (full) | to impress ; to repair ; to research |
| g3u08.w.to-try-out | to try out | to test something to see how it works or if you like it | I've built a prototype, but I haven't ___ it yet. | tried out (full) ; try out (partial) | try out (full) ; to try out (full) ; try it out (full) | to invent ; to support ; to decorate |
| g3u08.w.to-work-sth-out | to work sth. out | to find the answer to a problem by thinking about it | It took me a few weeks, but once I had ___ it wasn't too difficult. | worked out (full) ; worked it out (full) ; work out (partial) | work out (full) ; work sth. out (full) ; to work sth. out (full) ; work it out (full) | to give up ; to design ; to support |
| g3u08.w.wheelchair | wheelchair | a chair with wheels for someone who cannot walk | A ___ helps her get around. | wheelchair (full) | wheelchair (full) ; wheelchairs (full) | crutches ; ramp ; device |
| g3u08.w.wrist | wrist | the thin part of your body between your hand and your arm | Her ___ was hurting from the cold. | wrist (full) | wrist (full) ; wrists (full) | collar ; glove ; ramp |

## Grammar items (50)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g3u08.gi.past-simple-vs-present-perfect.cp.001 | context-picker | Deine Freundin fragt nach deinem Wochenende. Du warst gestern im Kino. [de] | I went to the cinema yesterday. (full) | — | I have gone to the cinema yesterday. ; Have you ever gone to the cinema yesterday? ; I have went to the cinema yesterday. | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.cp.002 | context-picker | Du willst wissen, ob deine Freundin jemals in ihrem Leben ein Pferd geritten ist. [de] | Have you ever ridden a horse? (full) | — | Did you ever ride a horse? ; Have you ridden a horse yesterday? ; Have you ever rode a horse? | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.cp.003 | context-picker | Du hast deinen Schlüssel verloren und kannst ihn jetzt nicht finden. Du erzählst es deiner Mutter. [de] | I have lost my keys. I can't find them. (full) | — | I lost my keys yesterday. I can't find them. ; I have lost my keys two days ago. ; I have lose my keys. I can't find them. | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.cp.004 | context-picker | Du erzählst von Tesla. Er hat 1884 mit nur 4 Cent in der Tasche New York erreicht. [de] | Tesla arrived in New York in 1884. (full) | — | Tesla has arrived in New York in 1884. ; Tesla has ever arrived in New York. ; Tesla has arrive in New York in 1884. | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.cp.005 | context-picker | Deine Lehrerin fragt nach deinen Erfahrungen. Du willst sagen, dass du noch nie in einem Flugzeug warst. [de] | I have never been on a plane. (full) | — | I never was on a plane last year. ; I have never been on a plane yesterday. ; I have never be on a plane. | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.ec.001 | error-correction | Finde den Fehler und schreib den Satz richtig: I have been to the zoo yesterday. [de] | I was at the zoo yesterday. (full) ; I went to the zoo yesterday. (full) | — | — | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.ec.002 | error-correction | Finde den Fehler und schreib den Satz richtig: I have seen that film last week. [de] | I saw that film last week. (full) ; saw (partial) | — | — | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.ec.003 | error-correction | Finde den Fehler und schreib den Satz richtig: Did you ever visit Rome? [de] | Have you ever been to Rome? (full) ; Have you ever visited Rome? (full) | — | — | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.ec.004 | error-correction | Finde den Fehler und schreib den Satz richtig: Sadie has won first place in 2019. [de] | Sadie won first place in 2019. (full) ; won (partial) | — | — | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.ec.005 | error-correction | Finde den Fehler und schreib den Satz richtig: She already finished the book two days ago. [de] | She finished the book two days ago. (full) | — | — | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.ec.006 | error-correction | Finde den Fehler und schreib den Satz richtig: I have never tried Indian food last year. [de] | I have never tried Indian food. (full) | — | — | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.gf.001 | gap-fill | Setz die richtige Form ein: I ___ (go) to the museum yesterday. [de, 1 blank(s)] | went (full) | — | — | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.gf.002 | gap-fill | Setz die richtige Form ein: Tesla ___ (invent) the electric motor. [de, 1 blank(s)] | invented (full) | — | — | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.gf.003 | gap-fill | Setz die richtige Form ein: Have you ever ___ (be) to Italy? [de, 1 blank(s)] | been (full) | — | — | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.gf.004 | gap-fill | Setz die richtige Form ein: My family ___ (move) to Vienna in 2015. [de, 1 blank(s)] | moved (full) | — | — | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.gf.005 | gap-fill | Setz die richtige Form ein: Sadie ___ (just / win) another prize. Everyone is happy! [de, 1 blank(s)] | has just won (full) ; 's just won (partial) | — | — | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.gf.006 | gap-fill | Setz die richtige Form ein: I ___ (not / try) sushi yet. Is it good? [de, 1 blank(s)] | haven't tried (full) ; have not tried (full) | — | — | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.gf.007 | gap-fill | Setz die richtige Form ein: He ___ (break) his wrist two weeks ago. [de, 1 blank(s)] | broke (full) | — | — | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.gf.008 | gap-fill | Setz die richtige Form ein: We ___ (visit) Rome and Naples last year. [de, 1 blank(s)] | visited (full) | — | — | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.gf.009 | gap-fill | Setz die richtige Form ein: I ___ (never / eat) Kaiserschmarren. Is it nice? [de, 1 blank(s)] | have never eaten (full) ; 've never eaten (partial) | — | — | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.gf.010 | gap-fill | Setz die zwei richtigen Formen ein: ___ you ___ (be) to London? — Yes, I went there in June. [de, 2 blank(s)] | Have \| been (full) | — | — | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.gf.011 | gap-fill | Setz die zwei richtigen Formen ein: My sister ___ (get) married last Sunday. She ___ (meet) her husband three years ago. [de, 2 blank(s)] | got \| met (full) | — | — | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.gf.012 | gap-fill | Setz die richtige Form ein: We ___ (not / see) that film yet. [de, 1 blank(s)] | haven't seen (full) ; have not seen (full) | — | — | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.gf.013 | gap-fill | Setz die richtige Form ein: She ___ (win) first place last year. [de, 1 blank(s)] | won (full) | — | — | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.gf.014 | gap-fill | Setz die richtige Form ein: She ___ (already / write) three books. [de, 1 blank(s)] | has already written (full) ; 's already written (partial) | — | — | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.gs.001 | group-sort | Sortiere die Signalwörter danach, zu welcher Zeit sie gehören. [de] | — | — | — | — | When? (one moment in the past): yesterday, last week, two days ago, in 2010 \| Experience (no exact time): ever, never, just, already | false |
| g3u08.gi.past-simple-vs-present-perfect.gs.003 | group-sort | Sortiere die Sätze: gestern (mit Zeitangabe) oder schon mal (Erfahrung)? [de] | — | — | — | — | When? (one moment in the past): I went to the cinema yesterday., Tesla invented the electric motor., We visited Rome last year. \| Experience (no exact time): I have never been to Spain., She has just finished her homework., Have you ever ridden a horse? | false |
| g3u08.gi.past-simple-vs-present-perfect.mc.001 | multiple-choice | Welcher Satz ist richtig? [de] | I saw that film last week. (full) | — | I have seen that film last week. ; Did you ever saw that film? ; I have saw that film last week. | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.mc.002 | multiple-choice | Welcher Satz ist richtig? [de] | She has already finished her homework. (full) | — | She already finished her homework yesterday. ; She has already finish her homework. ; She has already finished her homework two days ago. | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.mc.003 | multiple-choice | Welche Frage ist richtig? [de] | Have you ever ridden a horse? (full) | — | Did you ever ride a horse? ; Have you ever rode a horse? ; Have you ridden a horse yesterday? | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.mc.004 | multiple-choice | Welcher Satz ist richtig? [de] | I have never been to Spain. (full) | — | I never went to Spain last year. ; I have never been to Spain in 2020. ; I have never gone to Spain yesterday. | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.mc.005 | multiple-choice | Welche Form passt? Edison ___ all his money in DC. [de, 1 blank(s)] | invested (full) | — | has invested ; have invested ; has invest | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.mc.006 | multiple-choice | Welcher Satz ist richtig? [de] | I have just made a new invention! (full) | — | I just made a new invention two days ago. ; I have just make a new invention! ; Did you just made a new invention? | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.mp.003 | matching-pairs | Was passt zusammen? [de] | — | — | — | be ↔ been ; go ↔ gone ; see ↔ seen ; do ↔ done ; eat ↔ eaten ; win ↔ won | — | false |
| g3u08.gi.past-simple-vs-present-perfect.mp.004 | matching-pairs | Was passt zusammen? [de] | — | — | — | go ↔ went ; see ↔ saw ; break ↔ broke ; win ↔ won ; make ↔ made ; have ↔ had | — | false |
| g3u08.gi.past-simple-vs-present-perfect.mt.001 | matching | Welche Antwort passt zu welcher Frage? [de] | — | — | — | Have you ever been to Spain? ↔ Yes, we went to Madrid last year. ; Has June finished her homework? ↔ Yes, she finished ten minutes ago. ; Has the film started yet? ↔ Yes, it started about fifteen minutes ago. ; Has he written you an email? ↔ No, but he phoned me. | — | false |
| g3u08.gi.past-simple-vs-present-perfect.mt.003 | matching | Welcher Satzanfang passt zu welchem Ende? [de] | — | — | — | I have never ↔ eaten sushi. ; Tesla invented ↔ the electric motor in 1888. ; Sadie has just ↔ won her first prize. ; We watched a film ↔ last night. | — | false |
| g3u08.gi.past-simple-vs-present-perfect.qf.001 | question-formation | Bilde eine Erfahrungsfrage aus den Bausteinen: you / ever / enter / a competition [de] | Have you ever entered a competition? (full) | — | — | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.qf.002 | question-formation | Bilde die Frage nach dem Zeitpunkt aus den Bausteinen: when / you / win / the prize [de] | When did you win the prize? (full) | — | — | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.sb.001 | sentence-building | Bring die Bausteine in die richtige Reihenfolge: never / I / been / have / to / Spain [de] | I have never been to Spain. (full) | — | — | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.sb.002 | sentence-building | Bring die Bausteine in die richtige Reihenfolge: already / the / I / finished / have / project [de] | I have already finished the project. (full) | — | — | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.sb.003 | sentence-building | Bring die Bausteine in die richtige Reihenfolge: ago / Edison / two / lights / made / years [de] | Edison made lights two years ago. (full) | — | — | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.tf.001 | transformation | Schreib den Satz neu und tausche „just" gegen „yesterday": She has just finished her project. (yesterday) [de] | She finished her project yesterday. (full) | — | — | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.tf.002 | transformation | Schreib den Satz neu mit „never": I tried snowboarding last winter. (never) [de] | I have never tried snowboarding. (full) ; I've never tried snowboarding. (partial) | — | — | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.tf.003 | transformation | Schreib den Satz neu mit „in 2010": Tesla has designed many machines. (in 2010) [de] | Tesla designed many machines in 2010. (full) | — | — | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.tf.004 | transformation | Mach aus der Aussage eine Erfahrungsfrage mit „ever": You have visited London. (ever / question) [de] | Have you ever been to London? (full) ; Have you ever visited London? (full) | — | — | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.tr.001 | translation | Ich habe diesen Film schon gesehen. [de] | I have already seen this film. (full) ; I've already seen this film. (partial) | deToEn | — | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.tr.002 | translation | Warst du schon einmal in England? [de] | Have you ever been to England? (full) | deToEn | — | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.tr.003 | translation | Wir sind letzten Sommer nach Italien gefahren. [de] | We went to Italy last summer. (full) | deToEn | — | — | — | false |
| g3u08.gi.past-simple-vs-present-perfect.tr.004 | translation | Ich habe gerade mein Zimmer aufgeräumt. [de] | I have just tidied my room. (full) ; I've just tidied my room. (partial) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g3-u08/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g3-u08",
  "lens": "answers",
  "itemsHash": "58382b23fcb2",
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
