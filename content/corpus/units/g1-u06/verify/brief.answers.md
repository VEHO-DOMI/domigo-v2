# Verify lens — answers — g1-u06 (round 1)

<!-- domigo:verify answers g1-u06 items=ca33d0b51fc1 prompt=70fa2d8cdf22 round=1 -->

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

## Vocab items (49)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g1u06.w.a-lot-of-lots-of | a lot of / lots of | This is many, a big number. | There are ___ trees in the park. | a lot of (full) ; lots of (full) | a lot of (full) ; lots of (full) | big ; long ; small |
| g1u06.w.away | away | Not here, at a far place. | Go ___! I do not want you here. | away (full) | away (full) | back ; here ; best |
| g1u06.w.best | (world's) best | The very good one, more good than all. | Sherlock is the world's ___ detective. | best (full) | best (full) | clever ; nice ; big |
| g1u06.w.but-it-s-true | But it's true! | You call this out when a thing is real, not a joke. | You do not believe me? ___ I saw it! | But it's true! (full) ; But it's true (full) | But it's true! (full) ; But it's true (full) | Well done. ; Go on. ; Come on! |
| g1u06.w.city | city | A very big place with lots of houses, cars, and shops. | London is a very big ___. | city (full) | city (full) | park ; street ; river |
| g1u06.w.clever | clever | Very good at school; you learn well and find the answer. | Sherlock is very ___; he always finds the answer. | clever (full) ; smart (partial) | clever (full) ; smart (partial) | nice ; best ; happy |
| g1u06.w.come-on | Come on! | You call this out so a friend is here now. | ___ Hurry up, we are late! | Come on! (full) ; Come on (full) | Come on! (full) ; Come on (full) | Go away! ; Well done. ; Help me! |
| g1u06.w.detective | detective | A man or woman who finds bad men and women. | Sherlock Groans is a very good ___. | detective (full) | detective (full) | office ; mirror ; market |
| g1u06.w.go-on | Go on. | You want a friend to go on with the story. | That is a good story. ___ What happens next? | Go on. (full) ; Go on (full) | Go on. (full) ; Go on (full) | Well done. ; Come on! ; Help me! |
| g1u06.w.help-me | Help me! | You call this out when you want a friend now. | ___ I can not carry this big box. | Help me! (full) ; Help me (full) | Help me! (full) ; Help me (full) | Go away! ; Come on! ; Well done. |
| g1u06.w.market | market | You go here in the city to buy food. | We buy fresh food at the ___ every Saturday. | market (full) | market (full) | supermarket ; park ; office |
| g1u06.w.mirror | mirror | A thing on the wall. You look at you in it. | There is a ___ on the wall. | mirror (full) | mirror (full) | office ; detective ; tree |
| g1u06.w.nice | nice | Good and happy; a friend to all. | The park is very ___ and beautiful. | nice (full) ; lovely (partial) ; pretty (partial) | nice (full) ; lovely (partial) | clever ; best ; big |
| g1u06.w.office | office | A room where a man or woman does their work. | Sherlock looks in the mirror in his ___. | office (full) | office (full) | mirror ; detective ; market |
| g1u06.w.park | park | A big and beautiful place in the city. You can play and run here, and it has trees. | There are lots of beautiful trees in the ___. | park (full) | park (full) | city ; street ; market |
| g1u06.w.river | river | This is long and cold and runs in the woods. You can swim in it. | We go swimming in the cold ___ in summer. | river (full) | river (full) | woods ; tree ; street |
| g1u06.w.street | street | Cars go on this in the city, and houses are next to it. | Cars and buses go down our busy ___. | street (full) | street (full) | river ; woods ; park |
| g1u06.w.street-2 | street | Cars go on this, and houses are next to it. | He lives in York ___. | Street (full) ; street (full) | street (full) | river ; park ; woods |
| g1u06.w.supermarket | supermarket | A very big shop in the city where you buy food. | Mum can buy a lot of food at the big ___. | supermarket (full) | supermarket (full) | market ; office ; park |
| g1u06.w.to-become | to become | To stop being one thing and be a new one. | She rubs the stone and ___ a tiger. | becomes (full) ; become (partial) ; to become (partial) | become (full) ; to become (full) ; becomes (full) | to find ; to call ; to watch |
| g1u06.w.to-bump-into-a-tree | to bump into a tree | To run into something big and hard because you do not look. | He is not looking, so he will ___. | bump into a tree (full) ; to bump into a tree (partial) | bump into a tree (full) ; to bump into a tree (full) | to climb up a tree ; to sit in a tree ; to go to the park |
| g1u06.w.to-call | to call | To talk to a friend who is not here, on the phone. | Sherlock ___ Doctor Grey on the phone. | calls (full) ; call (partial) ; to call (partial) | call (full) ; to call (full) ; calls (full) ; phone (partial) | to wait ; to watch ; to find |
| g1u06.w.to-catch | to catch | The dog runs and gets the ball in its mouth. | Detectives always ___ the bad people. | catch (full) ; to catch (partial) ; catches (partial) | catch (full) ; to catch (full) ; catches (full) | to leave ; to live ; to wait |
| g1u06.w.to-climb | to climb | To go up a tree or a wall. | Sherlock ___ up a tree to get his hat. | climbs (full) ; climb (partial) ; to climb (partial) | climb (full) ; to climb (full) ; climbs (full) | to jump ; to run ; to pull |
| g1u06.w.to-climb-up-a-tree | to climb up a tree | To go up high, with your hands and feet, into the woods. | My dog wants to ___ and look at the birds. | climb up a tree (full) ; to climb up a tree (partial) | climb up a tree (full) ; to climb up a tree (full) | to sit in a tree ; to fall out of the tree ; to go to the park |
| g1u06.w.to-come-to | to come to | To go up to a place and be there. | Go down the street and you ___ a big park. | come to (full) ; to come to (partial) | come to (full) ; to come to (full) | to leave ; to live ; to watch |
| g1u06.w.to-fall-out-of-the-tree | to fall out of the tree | You are up high, then you go down to the floor. | Be careful! You can ___ and hurt your head. | fall out of the tree (full) ; to fall out of the tree (partial) | fall out of the tree (full) ; to fall out of the tree (full) | to climb up a tree ; to sit in a tree ; to go to the park |
| g1u06.w.to-find | to find | To look for a thing and come to it. | The dog ___ Sherlock Groans in the woods. | finds (full) ; find (partial) ; to find (partial) | find (full) ; to find (full) ; finds (full) | to leave ; to wait ; to live |
| g1u06.w.to-get-up | to get up | To stand up out of bed in the morning. | Sherlock ___ at seven o'clock in the morning. | gets up (full) ; get up (partial) ; to get up (partial) | get up (full) ; to get up (full) ; gets up (full) | to leave ; to come to ; to watch |
| g1u06.w.to-go-to-the-park | to go to the park | To walk to the green place with trees and play there. | Let's ___ and play on the swings. | go to the park (full) ; to go to the park (partial) | go to the park (full) ; to go to the park (full) | to leave the office ; to climb up a tree ; to look in the mirror |
| g1u06.w.to-jump | to jump | To go up into the air with your feet. | A bird ___ on Sherlock's head. | jumps (full) ; jump (partial) ; to jump (partial) | jump (full) ; to jump (full) ; jumps (full) | to climb ; to run ; to pull |
| g1u06.w.to-jump-into-the-river | to jump into the river | You are hot, so you hop down into the cold water. | It is very hot. Let's ___ now! | jump into the river (full) ; to jump into the river (partial) | jump into the river (full) ; to jump into the river (full) | to climb up a tree ; to sit in a tree ; to go to the park |
| g1u06.w.to-leave | to leave | To go away from a place. | Doctor Grey ___ the office and closes the door. | leaves (full) ; leave (partial) ; to leave (partial) | leave (full) ; to leave (full) ; leaves (full) | to find ; to wait ; to live |
| g1u06.w.to-leave-the-office | to leave the office | To go out of your work room. | Doctor Grey will ___ at five o'clock. | leave the office (full) ; to leave the office (partial) | leave the office (full) ; to leave the office (full) | to come to ; to go to the park ; to look in the mirror |
| g1u06.w.to-live | to live | To have your room and bed in a city. | Peter's Grandma ___ in York. | lives (full) ; live (partial) ; to live (partial) | live (full) ; to live (full) ; lives (full) | to leave ; to find ; to come to |
| g1u06.w.to-look-in-the-mirror | to look in the mirror | To watch your own face in the glass on the wall. | She wants to ___ in the morning. | look in the mirror (full) ; to look in the mirror (partial) | look in the mirror (full) ; to look in the mirror (full) | to look out the window ; to pick something up ; to go to the park |
| g1u06.w.to-look-out-the-window | to look out the window | From your room, you watch what is outside. | I ___ and watch the rain. | look out the window (full) ; to look out the window (partial) | look out the window (full) ; to look out the window (full) | to look in the mirror ; to pick something up ; to go to the park |
| g1u06.w.to-pick-something-up | to pick something up | He bends down and takes his hat up from the floor. | There is a coin on the floor. Can you ___? | pick something up (full) ; to pick something up (partial) ; pick it up (partial) | pick something up (full) ; to pick something up (full) | to look out the window ; to climb up a tree ; to sit in a tree |
| g1u06.w.to-pull | to pull | To bring a thing to you, not away from you. | The dog can ___ Sherlock out of the river. | pull (full) ; to pull (partial) | pull (full) ; to pull (full) | to run ; to climb ; to wait |
| g1u06.w.to-pull-2 | to pull | To bring a thing to you. | The dog ___ Sherlock out of the river. | pulls (full) ; pull (partial) ; to pull (partial) | pull (full) ; to pull (full) ; pulls (full) | to run ; to catch ; to wait |
| g1u06.w.to-put-on | to put on | You do this with a hat or a coat to your body. | Sherlock ___ his hat on his head. | puts (full) ; puts on (partial) ; put on (partial) ; put (partial) | put on (full) ; to put on (full) ; puts on (full) | to find ; to pull ; to wait |
| g1u06.w.to-run | to run | To go very fast on your feet. | We ___ to school very fast. | run (full) ; to run (partial) | run (full) ; to run (full) ; runs (full) | to climb ; to wait ; to find |
| g1u06.w.to-sit-in-a-tree | to sit in a tree | To be up high in the woods, not on the floor. | The small bird wants to ___ and sing. | sit in a tree (full) ; to sit in a tree (partial) | sit in a tree (full) ; to sit in a tree (full) | to climb up a tree ; to fall out of the tree ; to bump into a tree |
| g1u06.w.to-solve | to solve | To find out the answer to a problem. | Sherlock can ___ this hard problem. | solve (full) ; to solve (partial) | solve (full) ; to solve (full) ; solves (full) | to watch ; to wait ; to call |
| g1u06.w.to-wait | to wait | You do this and you do not go now. | Please ___ here for me at the bus stop. | wait (full) ; to wait (partial) | wait (full) ; to wait (full) ; waits (full) | to run ; to leave ; to find |
| g1u06.w.to-watch | to watch | To look at a thing for a long time. | Sherlock ___ the people in the streets. | watches (full) ; watch (partial) ; to watch (partial) | watch (full) ; to watch (full) ; watches (full) | to call ; to wait ; to solve |
| g1u06.w.tree | tree | This is big and tall and has lots of leaves. You can climb it. | A small bird sits in the ___. | tree (full) | tree (full) | river ; park ; woods |
| g1u06.w.well-done | Well done. | This is what you call out when a friend does good work. | You did very good work. ___! | Well done. (full) ; Well done (full) | Well done. (full) ; Well done (full) | Go on. ; Come on! ; Help me! |
| g1u06.w.woods | woods | A big place with a lot of trees. | We go for a long walk in the ___. | woods (full) | woods (full) | river ; city ; market |

## Grammar items (54)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g1u06.gi.a-lot-of.ag.001 | anagram | Im Park gibt es viele davon — grün und hoch: ___ (5 Buchstaben). [de, 1 blank(s)] | trees (full) | — | — | — | — | false |
| g1u06.gi.a-lot-of.cp.001 | context-picker | Doctor Grey schaut in die Straße der Stadt. Welcher Satz ist richtig? [de] | There are lots of cars in the street. (full) | — | There are a lots of cars in the street. ; There are much of cars in the street. ; There are many of cars in the street. | — | — | false |
| g1u06.gi.a-lot-of.ec.001 | error-correction | There are a lots of stories about Sherlock Groans. [en] | There are a lot of stories about Sherlock Groans. (full) ; There are lots of stories about Sherlock Groans. (full) ; a lot of (partial) ; lots of (partial) | — | — | — | — | false |
| g1u06.gi.a-lot-of.ec.002 | error-correction | He has got a lots of pens on the desk. [en] | He has got a lot of pens on the desk. (full) ; He has got lots of pens on the desk. (full) ; a lot of (partial) ; lots of (partial) | — | — | — | — | false |
| g1u06.gi.a-lot-of.ec.003 | error-correction | She has got a lot friends in her class. [en] | She has got a lot of friends in her class. (full) ; She has got lots of friends in her class. (full) ; a lot of (partial) ; of (partial) | — | — | — | — | false |
| g1u06.gi.a-lot-of.gf.001 | gap-fill | Sherlock Groans has got ___ friends. [en, 1 blank(s)] | a lot of (full) ; lots of (full) | — | — | — | — | false |
| g1u06.gi.a-lot-of.gf.002 | gap-fill | There are ___ trees in the park. [en, 1 blank(s)] | a lot of (full) ; lots of (full) | — | — | — | — | false |
| g1u06.gi.a-lot-of.gf.003 | gap-fill | We have got ___ homework today. [en, 1 blank(s)] | a lot of (full) ; lots of (full) | — | — | — | — | false |
| g1u06.gi.a-lot-of.gf.004 | gap-fill | The detective has got ___ work, but he is happy. [en, 1 blank(s)] | a lot of (full) ; lots of (full) | — | — | — | — | false |
| g1u06.gi.a-lot-of.gf.005 | gap-fill | She has got ___ books and ___ pens in her school bag. [en, 2 blank(s)] | a lot of \| a lot of (full) ; lots of \| lots of (full) ; a lot of \| lots of (full) ; lots of \| a lot of (full) | — | — | — | — | false |
| g1u06.gi.a-lot-of.gs.001 | group-sort | Wo findest du das? Sortiere die Sätze. [de] | — | — | — | — | In the park: There are a lot of trees., There are a lot of dogs. \| At school: There are a lot of books., There is a lot of homework. | false |
| g1u06.gi.a-lot-of.gs.002 | group-sort | Sortiere: viele Dinge oder viel von etwas? [de] | — | — | — | — | a lot of books: friends, cars, trees, pens \| a lot of homework: money, time, work, fun | false |
| g1u06.gi.a-lot-of.mc.001 | multiple-choice | There are ___ cars in the city. [en, 1 blank(s)] | lots of (full) | — | a lots of ; many of ; much of | — | — | false |
| g1u06.gi.a-lot-of.mc.002 | multiple-choice | He has got ___ time for the detective story. [en, 1 blank(s)] | lots of (full) | — | a lots of ; many ; much | — | — | false |
| g1u06.gi.a-lot-of.mc.003 | multiple-choice | Welcher Satz ist richtig? [de] | There are lots of bottles on the table. (full) | — | There are a lots of bottles on the table. ; There are much of bottles on the table. ; There are many of bottles on the table. | — | — | false |
| g1u06.gi.a-lot-of.mt.001 | matching | Was passt zusammen? [de] | — | — | — | Sherlock comes to the park. ↔ There are a lot of trees. ; She opens her school bag. ↔ There are a lot of books. ; We look at the city street. ↔ There are a lot of cars. ; It is time for school. ↔ There is a lot of homework. | — | false |
| g1u06.gi.a-lot-of.sb.001 | sentence-building | a lot of / has got / She / friends [en] | She has got a lot of friends. (full) | — | — | — | — | false |
| g1u06.gi.a-lot-of.sb.002 | sentence-building | lots of / are / There / trees / in the park [en] | There are lots of trees in the park. (full) | — | — | — | — | false |
| g1u06.gi.a-lot-of.sb.003 | sentence-building | have got / a lot of / homework / We [en] | We have got a lot of homework. (full) | — | — | — | — | false |
| g1u06.gi.a-lot-of.tf.001 | transformation | She has got many books. → She has got ___ books. [en, 1 blank(s)] | a lot of (full) ; lots of (full) ; She has got a lot of books. (full) ; She has got lots of books. (full) | — | — | — | — | false |
| g1u06.gi.a-lot-of.tf.002 | transformation | We have got a lot of homework. (lots of) → We have got ___ homework. [en, 1 blank(s)] | lots of (full) ; We have got lots of homework. (full) | — | — | — | — | false |
| g1u06.gi.a-lot-of.tr.001 | translation | Es gibt viele Bäume im Park. [de] | There are a lot of trees in the park. (full) ; There are lots of trees in the park. (full) | deToEn | — | — | — | false |
| g1u06.gi.a-lot-of.tr.002 | translation | Der Detektiv hat viel Arbeit. [de] | The detective has got a lot of work. (full) ; The detective has got lots of work. (full) ; The detective has a lot of work. (partial) ; The detective has lots of work. (partial) | deToEn | — | — | — | false |
| g1u06.gi.a-lot-of.tr.003 | translation | She has got a lot of books. [en] | Sie hat viele Bücher. (full) ; Sie hat jede Menge Bücher. (partial) | enToDe | — | — | — | false |
| g1u06.gi.present-simple.ag.001 | anagram | he/she/it-Form von 'go' (gehen) [de] | goes (full) | — | — | — | — | false |
| g1u06.gi.present-simple.ag.002 | anagram | he/she/it-Form von 'watch' (beobachten) [de] | watches (full) | — | — | — | — | false |
| g1u06.gi.present-simple.cp.001 | context-picker | Deine Freundin macht das jeden Samstag. Welcher Satz stimmt? [de] | She plays the guitar on Saturdays. (full) | — | She is playing the guitar on Saturdays. ; She play the guitar on Saturdays. ; She playing the guitar on Saturdays. | — | — | false |
| g1u06.gi.present-simple.cp.002 | context-picker | Du erzählst von deinem Morgen. Welcher Satz stimmt? [de] | I run in the park in the morning. (full) | — | I runs in the park in the morning. ; I am run in the park in the morning. ; I running in the park in the morning. | — | — | false |
| g1u06.gi.present-simple.ec.001 | error-correction | She find her hat in the room. [en] | She finds her hat in the room. (full) ; finds (partial) | — | — | — | — | true |
| g1u06.gi.present-simple.ec.002 | error-correction | He go to school in the morning. [en] | He goes to school in the morning. (full) ; goes (partial) | — | — | — | — | true |
| g1u06.gi.present-simple.ec.003 | error-correction | My dog wash the car. [en] | My dog washes the car. (full) ; washes (partial) | — | — | — | — | true |
| g1u06.gi.present-simple.gf.001 | gap-fill | She ___ (play) the guitar. [en, 1 blank(s)] | plays (full) | — | — | — | — | false |
| g1u06.gi.present-simple.gf.002 | gap-fill | He ___ (watch) the dogs in the park. [en, 1 blank(s)] | watches (full) | — | — | — | — | false |
| g1u06.gi.present-simple.gf.003 | gap-fill | My uncle ___ (go) to the market. [en, 1 blank(s)] | goes (full) | — | — | — | — | false |
| g1u06.gi.present-simple.gf.004 | gap-fill | She ___ (carry) her books to school. [en, 1 blank(s)] | carries (full) | — | — | — | — | false |
| g1u06.gi.present-simple.gf.005 | gap-fill | We ___ (live) in the city and they ___ (live) in London. [en, 2 blank(s)] | live \| live (full) | — | — | — | — | false |
| g1u06.gi.present-simple.gf.006 | gap-fill | My uncle ___ (wash) the car. [en, 1 blank(s)] | washes (full) | — | — | — | — | false |
| g1u06.gi.present-simple.gf.007 | gap-fill | Sherlock ___ (catch) the bad man. [en, 1 blank(s)] | catches (full) | — | — | — | — | false |
| g1u06.gi.present-simple.gs.001 | group-sort | Sortiere: play oder plays? [de] | — | — | — | — | play: I, you, we, they \| plays: he, she, it | false |
| g1u06.gi.present-simple.gs.002 | group-sort | Sortiere nach der he/she/it-Form: plays, goes oder carries? [de] | — | — | — | — | plays: play, read, live, clean \| goes: go, watch, wash, catch \| carries: carry, study | false |
| g1u06.gi.present-simple.mc.001 | multiple-choice | My sister ___ to the park. [en, 1 blank(s)] | runs (full) | — | run ; is run ; running | — | — | false |
| g1u06.gi.present-simple.mc.002 | multiple-choice | My friend ___ the drums. [en, 1 blank(s)] | plays (full) | — | play ; is play ; playing | — | — | false |
| g1u06.gi.present-simple.mc.003 | multiple-choice | Welcher Satz stimmt? [de] | She reads a book in the morning. (full) | — | She read a book in the morning. ; She reading a book in the morning. ; She is read a book in the morning. | — | — | false |
| g1u06.gi.present-simple.mp.001 | matching-pairs | Finde die Paare: I … und he … . [de] | — | — | — | play ↔ plays ; wash ↔ washes ; catch ↔ catches ; carry ↔ carries ; do ↔ does | — | false |
| g1u06.gi.present-simple.mt.001 | matching | he/she/it: Was passt zusammen? [de] | — | — | — | go ↔ goes ; watch ↔ watches ; carry ↔ carries ; play ↔ plays | — | false |
| g1u06.gi.present-simple.qf.001 | question-formation | She reads a book. Ask what she does. [en] | What does she read? (full) ; What does she read (partial) | — | — | — | — | false |
| g1u06.gi.present-simple.sb.001 | sentence-building | the / She / drums / plays [en] | She plays the drums. (full) | — | — | — | — | false |
| g1u06.gi.present-simple.sb.002 | sentence-building | to / school / He / books / his / carries [en] | He carries his books to school. (full) | — | — | — | — | false |
| g1u06.gi.present-simple.tf.001 | transformation | I play the guitar. (he) → He ___ the guitar. [en, 1 blank(s)] | plays (full) ; He plays the guitar. (full) ; He plays the guitar (partial) | — | — | — | — | false |
| g1u06.gi.present-simple.tf.002 | transformation | I carry the bottle. (she) → She ___ the bottle. [en, 1 blank(s)] | carries (full) ; She carries the bottle. (full) ; She carries the bottle (partial) | — | — | — | — | false |
| g1u06.gi.present-simple.tf.003 | transformation | I clean my room. (he) → He ___ his room. [en, 1 blank(s)] | cleans (full) ; He cleans his room. (full) ; He cleans his room (partial) | — | — | — | — | false |
| g1u06.gi.present-simple.tr.001 | translation | Er wohnt in London. [de] | He lives in London. (full) | deToEn | — | — | — | false |
| g1u06.gi.present-simple.tr.002 | translation | Sie spielt die Gitarre. [de] | She plays the guitar. (full) | deToEn | — | — | — | false |
| g1u06.gi.present-simple.tr.003 | translation | Er geht in den Park. [de] | He goes to the park. (full) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g1-u06/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u06",
  "lens": "answers",
  "itemsHash": "ca33d0b51fc1",
  "promptHash": "70fa2d8cdf22",
  "round": 1,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 103, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
