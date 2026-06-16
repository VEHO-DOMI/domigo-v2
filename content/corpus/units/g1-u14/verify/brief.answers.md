# Verify lens — answers — g1-u14 (round 2)

<!-- domigo:verify answers g1-u14 items=1e4d4c2a2d9c prompt=70fa2d8cdf22 round=2 -->

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

## Vocab items (59)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g1u14.w.adventure | adventure | an exciting thing that happens, often in a faraway place. | My favourite books are ___ stories about clever children. | adventure (full) | adventure (full) | friendship ; cover ; poem |
| g1u14.w.adventure-story | adventure story | A book or film about children who do exciting things in faraway places. | The ___ was about children who go to an island to find gold. | adventure story (full) | adventure story (full) | romantic story ; detective story ; horror story |
| g1u14.w.cartoon | cartoon | a show with drawn people and animals that move. | My ___ are my favourite programme, with funny drawn animals. | cartoons (full) ; cartoon (partial) | cartoon (full) | the news ; quiz show ; nature programme |
| g1u14.w.comedy | comedy | a funny show that makes you laugh. | We watched a funny ___ and we all had to laugh and laugh. | comedy (full) | comedy (full) | episode ; headline ; power |
| g1u14.w.cover | cover | the part on the outside of a book with a picture on it. | Look at the ___ of this book: it has a big dragon on it. | cover (full) | cover (full) | headline ; poem ; spot |
| g1u14.w.dead | dead | not alive any more. | The snake fell into the water and now it is ___. | dead (full) | dead (full) | weak ; huge ; tiny |
| g1u14.w.detective-story | detective story | A book or film where a clever man or woman finds out who did a crime. | In the ___, a clever inspector finds out who did the robbery. | detective story (full) | detective story (full) | romantic story ; fantasy story ; adventure story |
| g1u14.w.drama-series | drama series | a show with many parts about the lives of a family. | The new ___ has many parts about one big family. | drama series (full) | drama series (full) | music video ; cartoon ; the news |
| g1u14.w.episode | episode | one part of a show that has many parts. | I watched the first ___ and now I want to watch all the others. | episode (full) | episode (full) | headline ; comedy ; cover |
| g1u14.w.fantasy-film | fantasy film | a show with magic and things that are not real, like dragons. | We watched a ___ with a young magician and a big dragon. | fantasy film (full) | fantasy film (full) | sports programme ; the news ; reality show |
| g1u14.w.fantasy-story | fantasy story | A book or film with magic and things that are not real. | I am reading a ___ about a school for young magicians. | fantasy story (full) | fantasy story (full) | detective story ; horror story ; adventure story |
| g1u14.w.friendship | friendship | when two people are good friends and like each other very much. | Is this a story about ___ between two best friends? | friendship (full) | friendship (full) | adventure ; cover ; poem |
| g1u14.w.gamer | gamer | a child or grown-up who plays computer games very much. | My big sister is a ___ and plays computer games for many hours. | gamer (full) | gamer (full) | shopkeeper ; neighbour ; detective |
| g1u14.w.headline | headline | the big words over a news story that tell you what it is about. | What is the news ___ today over the big story? | headline (full) | headline (full) | episode ; cover ; voice |
| g1u14.w.horror-story | horror story | A book or film that is made to make you very scared. | The ___ about the dark castle was so scary that I was scared all night. | horror story (full) | horror story (full) | romantic story ; adventure story ; fantasy story |
| g1u14.w.huge | huge | very, very big. | An elephant is a ___ animal, much bigger than a dog. | huge (full) | huge (full) | tiny ; weak ; wide |
| g1u14.w.inside | inside | in something, not out in the open. | It was raining, so we stayed ___ all afternoon. | inside (full) | inside (full) | huge ; wide ; tiny |
| g1u14.w.kind-of | kind of | a type of, a sort of. | What ___ music do you like, pop or rock? | kind of (full) | kind of (full) | quite ; latest ; inside |
| g1u14.w.lake | lake | a very big place with a lot of water and land all around it. | One day a giraffe came to the ___ to drink some water. | lake (full) | lake (full) | river ; leaf ; skin |
| g1u14.w.latest | latest | the most new, the one that is from today and not from before. | Have you heard their ___ song? It is their most new one. | latest (full) | latest (full) | huge ; tiny ; wide |
| g1u14.w.leaf | leaf (pl leaves) | a flat green thing that grows on a tree. | The giraffe gives the leopard some magic ___ from the tree. | leaves (full) | leaf (full) ; leaves (full) | lake ; skin ; spot |
| g1u14.w.music-video | music video | a short show for a song, with the singer and the band. | Have you watched the new ___ with the singer and her band? | music video (full) | music video (full) | the news ; quiz show ; nature programme |
| g1u14.w.nature-programme | nature programme | a show about animals and the places where they live. | I love that ___ with real lions and elephants in Africa. | nature programme (full) | nature programme (full) | quiz show ; music video ; the news |
| g1u14.w.neighbour | neighbour | somebody who lives next to you or very near you. | Our ___ next door has a big dog that barks at night. | neighbour (full) | neighbour (full) | shopkeeper ; gamer ; detective |
| g1u14.w.once-upon-a-time | once upon a time | the first words of many fairy tales, before the story begins. | ___, in a land far away, there was a big lion. | Once upon a time (full) ; once upon a time (partial) | once upon a time (full) | one day ; weekend ; midnight |
| g1u14.w.one-day | one day | At some time long ago, in a book. | ___, a giraffe came to the lake near the big wood. | One day (full) ; one day (partial) | one day (full) | once upon a time ; weekend ; tonight |
| g1u14.w.poem | poem | a short text with lines that often sound nice. | I read a ___ about watching TV with my mum and dad. | poem (full) | poem (full) | cover ; headline ; adventure |
| g1u14.w.power | power | a special, magic thing that lets you do what others cannot do. | The remote control has a special ___ and can make people stop. | power (full) | power (full) | voice ; skin ; cover |
| g1u14.w.quite | quite | more than a little, but not very. | I ___ like detective stories, but I love nature programmes more. | quite (full) | quite (full) | latest ; inside ; huge |
| g1u14.w.quiz-show | quiz show | On TV, people answer questions here and can win money. | She is on a TV ___ and gives the answer to win a lot of money. | quiz show (full) | quiz show (full) | nature programme ; romantic film ; music video |
| g1u14.w.reality-show | reality show | On TV, real people, not famous ones, do things and you watch them. | My sister watches a ___ with real people in one big house. | reality show (full) | reality show (full) | nature programme ; the news ; cartoon |
| g1u14.w.remote-control | remote control | a small thing you use to change the programme on TV. | You use a ___ to change the programme on TV from the sofa. | remote control (full) | remote control (full) | headline ; screen ; cover |
| g1u14.w.romantic-film | romantic film | a show about a girl and a boy who are very much in love. | My mum likes a ___ about a girl and a boy who are very much in love. | romantic film (full) | romantic film (full) | horror story ; sports programme ; the news |
| g1u14.w.romantic-story | romantic story | A book or film about two people who are very much in love. | She likes a ___ about a prince and a girl who are in love. | romantic story (full) | romantic story (full) | horror story ; detective story ; adventure story |
| g1u14.w.science-fiction-film | science fiction film | a show about robots, about space, or about life a long time from now. | The ___ was about people who go to space and meet robots. | science fiction film (full) | science fiction film (full) | nature programme ; the news ; romantic film |
| g1u14.w.screen-time | screen time | the hours you spend looking at a phone, a tablet or a TV. | Every day we spend three hours of ___ on a tablet or a phone. | screen time (full) | screen time (full) | screen ; remote control ; headline |
| g1u14.w.shopkeeper | shopkeeper | somebody who has a small shop and sells things in it. | The ___ behind the desk helped me find a good book. | shopkeeper (full) | shopkeeper (full) | neighbour ; gamer ; detective |
| g1u14.w.skin | skin | the part on the outside of your body that the sun can make red. | The lion has yellow ___, and the giraffe has black spots. | skin (full) | skin (full) | voice ; spot ; power |
| g1u14.w.sports-programme | sports programme | a show about football, tennis and more games. | We watched the big football match on the ___ on TV. | sports programme (full) | sports programme (full) | the news ; cartoon ; romantic film |
| g1u14.w.spot | spot | a small round mark on a thing. | The giraffe has black ___ all over its yellow skin. | spots (full) ; spot (partial) | spot (full) ; spots (full) | skin ; voice ; cover |
| g1u14.w.the-news | the news | a programme that tells you about today in your country and all over the world. | My dad watches ___ at eight to hear about today in the world. | the news (full) | the news (full) | cartoon ; music video ; quiz show |
| g1u14.w.tiny | tiny | very, very small. | An ant is a ___ animal, much smaller than a dog. | tiny (full) | tiny (full) | huge ; wide ; weak |
| g1u14.w.to-bend-down | to bend down (bent down) | to move the top of your body down low. | I have to ___ low to look under my bed. | bend down (full) ; bend (partial) | bend down (full) ; to bend down (full) ; bent down (partial) | to hug ; to hold ; to lie |
| g1u14.w.to-disappear | to disappear | to go away so that nobody can find you. | Andrew turned the magic ring three times and started to ___. | disappear (full) ; to disappear (partial) | disappear (full) ; to disappear (full) | to fight ; to hug ; to sell |
| g1u14.w.to-fight | to fight (fought) | to use your hands hard, like two angry people who both want one thing. | The two boys want to ___ over the last cake on the plate. | fight (full) ; to fight (partial) | fight (full) ; to fight (full) ; fought (partial) | hold ; sell ; pay |
| g1u14.w.to-freeze | to freeze (froze) | to stop and stand very still, like a picture that does not move. | If you press the button, the people on the screen ___ and cannot move. | freeze (full) ; to freeze (partial) | freeze (full) ; to freeze (full) ; froze (partial) | sell ; pay ; hold |
| g1u14.w.to-hold | to hold (held) | to have a thing in your hand and not let it go. | Can you ___ this book in your hand for me, please? | hold (full) ; to hold (partial) | hold (full) ; to hold (full) ; held (partial) | sell ; pay ; fight |
| g1u14.w.to-hug | to hug | to put your arms around somebody to show you like them. | The weak leopard asked the giraffe to ___ him. | hug (full) ; to hug (partial) | hug (full) ; to hug (full) | to fight ; to hold ; to sell |
| g1u14.w.to-lie | to lie | to have your body flat and still, like on a bed. | After the long day, I want to ___ on the sofa and read a book. | lie (full) ; to lie (partial) | lie (full) ; to lie (full) | to hug ; to hold ; to bend down |
| g1u14.w.to-pay | to pay (paid) | to give money for a thing you want to have. | I want to ___ three pounds for this book at the shop. | pay (full) ; to pay (partial) | pay (full) ; to pay (full) ; paid (partial) | sell ; hold ; freeze |
| g1u14.w.to-point-to | to point to | to show where a thing is with your finger. | She used her finger to ___ the small button with a star on it. | point to (full) ; point (partial) | point to (full) ; to point to (full) ; point (partial) | to hold ; to hug ; to sell |
| g1u14.w.to-reply | to reply (replied) | to say a thing back to somebody who asked you. | I asked Tom, but he did not ___ all day. | reply (full) ; to reply (partial) | reply (full) ; to reply (full) ; replied (partial) | to sell ; to hold ; to pay |
| g1u14.w.to-sell | to sell (sold) | to give a thing to somebody for money. | He wants to ___ his car for a lot of money. | sell (full) ; to sell (partial) | sell (full) ; to sell (full) ; sold (partial) | pay ; hold ; freeze |
| g1u14.w.to-spend | to spend | to use your time doing a thing. | We ___ a lot of time watching shows on TV. | spend (full) ; to spend (partial) | spend (full) ; to spend (full) | to stream ; to reply ; to hold |
| g1u14.w.to-stream | to stream | to watch a show on the internet. | We sometimes ___ a new show on our tablet at the weekend. | stream (full) ; to stream (partial) | stream (full) ; to stream (full) | to sell ; to pay ; to reply |
| g1u14.w.voice | voice | the sound you make when you talk or sing. | She is a great singer with a beautiful ___. | voice (full) | voice (full) | skin ; power ; spot |
| g1u14.w.weak | weak | not strong. | After a week in bed, the leopard was very tired and ___. | weak (full) | weak (full) | huge ; tiny ; wide |
| g1u14.w.weekend | weekend | Saturday and Sunday, the days with no school. | Saturday and Sunday are the ___, so we have no school. | weekend (full) | weekend (full) | bedtime ; midnight ; midday |
| g1u14.w.wide | wide | big from one side to the other side. | There is a very ___ road near our school, with room for many cars. | wide (full) | wide (full) | huge ; tiny ; weak |

## Grammar items (62)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g1u14.gi.past-simple-irregular.ag.008 | anagram | Wie heißt 'go' gestern? [de] | went (full) | — | — | — | — | true |
| g1u14.gi.past-simple-irregular.ag.009 | anagram | Wie heißt 'see' gestern? [de] | saw (full) | — | — | — | — | true |
| g1u14.gi.past-simple-irregular.ag.010 | anagram | Wie heißt 'take' gestern? [de] | took (full) | — | — | — | — | true |
| g1u14.gi.past-simple-irregular.ag.011 | anagram | Wie heißt 'think' gestern? [de] | thought (full) | — | — | — | — | true |
| g1u14.gi.past-simple-irregular.ag.012 | anagram | Wie heißt 'bring' gestern? [de] | brought (full) | — | — | — | — | true |
| g1u14.gi.past-simple-irregular.ag.013 | anagram | Wie heißt 'catch' gestern? [de] | caught (full) | — | — | — | — | true |
| g1u14.gi.past-simple-irregular.ag.014 | anagram | Wie heißt 'freeze' gestern? [de] | froze (full) | — | — | — | — | true |
| g1u14.gi.past-simple-irregular.cp.001 | context-picker | Du erzählst deiner Lehrerin von gestern. Welcher Satz ist richtig? [de] | I ate lunch at school yesterday. (full) | — | I eated lunch at school yesterday. ; I eat lunch at school yesterday. ; I ated lunch at school yesterday. | — | — | false |
| g1u14.gi.past-simple-irregular.cp.002 | context-picker | Du erzählst von der Geschichte mit der Fernbedienung. Welcher Satz ist richtig? [de] | Tom froze and then Annie ran away. (full) | — | Tom freezed and then Annie ran away. ; Tom froze and then Annie runned away. ; Tom freezed and then Annie runned away. | — | — | false |
| g1u14.gi.past-simple-irregular.ec.001 | error-correction | Annie catched the ball in the game. [en] | Annie caught the ball in the game. (full) ; caught (partial) | — | — | — | — | false |
| g1u14.gi.past-simple-irregular.ec.002 | error-correction | Tom thinked about it all day. [en] | Tom thought about it all day. (full) ; thought (partial) | — | — | — | — | false |
| g1u14.gi.past-simple-irregular.ec.003 | error-correction | Jill writed a story about her dog. [en] | Jill wrote a story about her dog. (full) ; wrote (partial) | — | — | — | — | false |
| g1u14.gi.past-simple-irregular.ec.004 | error-correction | The police catched the robber and holded him. [en] | The police caught the robber and held him. (full) ; caught \| held (partial) | — | — | — | — | false |
| g1u14.gi.past-simple-irregular.gf.001 | gap-fill | Yesterday Annie ___ (go) into the shop. [en, 1 blank(s)] | went (full) | — | — | — | — | false |
| g1u14.gi.past-simple-irregular.gf.002 | gap-fill | Annie ___ (see) a remote control in the window. [en, 1 blank(s)] | saw (full) | — | — | — | — | false |
| g1u14.gi.past-simple-irregular.gf.003 | gap-fill | We ___ (have) milk and bread for breakfast. [en, 1 blank(s)] | had (full) | — | — | — | — | false |
| g1u14.gi.past-simple-irregular.gf.004 | gap-fill | The robber ___ (hold) a gun in his hand. [en, 1 blank(s)] | held (full) | — | — | — | — | false |
| g1u14.gi.past-simple-irregular.gf.005 | gap-fill | Jill ___ (find) a ring on the park bench. [en, 1 blank(s)] | found (full) | — | — | — | — | false |
| g1u14.gi.past-simple-irregular.gf.006 | gap-fill | The shop ___ (sell) lots of things. [en, 1 blank(s)] | sold (full) | — | — | — | — | false |
| g1u14.gi.past-simple-irregular.gf.007 | gap-fill | Yesterday I ___ (take) the bus and ___ (come) to school early. [en, 2 blank(s)] | took \| came (full) | — | — | — | — | false |
| g1u14.gi.past-simple-irregular.gf.008 | gap-fill | Annie ___ (read) the book and then ___ (put) it on the desk. [en, 2 blank(s)] | read \| put (full) | — | — | — | — | false |
| g1u14.gi.past-simple-irregular.gs.003 | group-sort | Sortiere die Verben: mit -ed oder mit eigener Form? [de] | — | — | — | — | like walked: walk, play, want, open, watch \| like went: go, see, take, have, come, make | false |
| g1u14.gi.past-simple-irregular.gs.004 | group-sort | Sortiere nach dem Klang am Ende. [de] | — | — | — | — | like thought: thought, brought, caught, fought \| like told: told, sold, held | false |
| g1u14.gi.past-simple-irregular.mc.003 | multiple-choice | Welche Form ist FALSCH geschrieben? [de] | goed (full) | — | went ; saw ; took | — | — | false |
| g1u14.gi.past-simple-irregular.mc.006 | multiple-choice | Welcher Satz ist richtig? [de] | She made a beautiful cake. (full) | — | She maked a beautiful cake. ; She maded a beautiful cake. ; She makes a beautiful cake yesterday. | — | — | false |
| g1u14.gi.past-simple-irregular.mc.007 | multiple-choice | Wie heißt 'eat' gestern? [de] | ate (full) | — | eated ; eat ; eats | — | — | false |
| g1u14.gi.past-simple-irregular.mc.008 | multiple-choice | Wie heißt 'run' gestern? [de] | ran (full) | — | runned ; runs ; running | — | — | false |
| g1u14.gi.past-simple-irregular.mc.009 | multiple-choice | Wie heißt 'give' gestern? [de] | gave (full) | — | gived ; gives ; given | — | — | false |
| g1u14.gi.past-simple-irregular.mc.010 | multiple-choice | Wie heißt 'pay' gestern? [de] | paid (full) | — | payed ; pays ; paying | — | — | false |
| g1u14.gi.past-simple-irregular.mp.003 | matching-pairs | Was passt zusammen? [de] | — | — | — | eat ↔ ate ; drink ↔ drank ; write ↔ wrote ; give ↔ gave ; think ↔ thought ; find ↔ found | — | false |
| g1u14.gi.past-simple-irregular.mp.004 | matching-pairs | Was passt zusammen? [de] | — | — | — | pay ↔ paid ; sell ↔ sold ; hold ↔ held ; catch ↔ caught ; bring ↔ brought ; tell ↔ told | — | false |
| g1u14.gi.past-simple-irregular.mt.002 | matching | Was passt zusammen? [de] | — | — | — | go ↔ went ; see ↔ saw ; take ↔ took ; have ↔ had ; come ↔ came | — | false |
| g1u14.gi.past-simple-irregular.tf.004 | transformation | Erzähl es von gestern: I drink tea. → I ___ tea. [de, 1 blank(s)] | drank (full) ; I drank tea. (full) | — | — | — | — | false |
| g1u14.gi.past-simple-irregular.tf.005 | transformation | Erzähl es von gestern: Andrew gets a present. → Andrew ___ a present. [de, 1 blank(s)] | got (full) ; Andrew got a present. (full) | — | — | — | — | false |
| g1u14.gi.past-simple-irregular.tf.006 | transformation | Erzähl es von gestern: Jill tells Andrew a story. → Jill ___ Andrew a story. [de, 1 blank(s)] | told (full) ; Jill told Andrew a story. (full) | — | — | — | — | false |
| g1u14.gi.past-simple-irregular.tr.001 | translation | Ich bin gestern in die Schule gegangen. [de] | I went to school yesterday. (full) ; Yesterday I went to school. (full) | deToEn | — | — | — | false |
| g1u14.gi.past-simple-irregular.tr.002 | translation | Sie sah eine Katze und nahm ein Foto. [de] | She saw a cat and took a photo. (full) ; She saw a cat and she took a photo. (full) | deToEn | — | — | — | false |
| g1u14.gi.past-simple-negative.cp.001 | context-picker | Du erzählst, dass du den Krimi nicht gelesen hast. Welcher Satz ist richtig? [de] | I didn't read the detective story. (full) | — | I didn't liked the detective story. ; I didn't watched the detective story. ; I wasn't read the detective story. | — | — | true |
| g1u14.gi.past-simple-negative.cp.002 | context-picker | Deine Freundin hat gestern nicht ferngesehen. Welcher Satz ist richtig? [de] | She didn't watch the cartoon yesterday. (full) | — | She didn't watched the cartoon yesterday. ; She wasn't watch the cartoon yesterday. ; She don't watch the cartoon yesterday. | — | — | true |
| g1u14.gi.past-simple-negative.ec.001 | error-correction | Finde und verbessere den Fehler: He didn't went to the cinema. [de] | He didn't go to the cinema. (full) ; He did not go to the cinema. (full) ; go (partial) | — | — | — | — | true |
| g1u14.gi.past-simple-negative.ec.002 | error-correction | Finde und verbessere den Fehler: She didn't liked the romantic film. [de] | She didn't like the romantic film. (full) ; She did not like the romantic film. (full) ; like (partial) | — | — | — | — | true |
| g1u14.gi.past-simple-negative.ec.003 | error-correction | Finde und verbessere den Fehler: She wasn't watch the sports programme. [de] | She didn't watch the sports programme. (full) ; She did not watch the sports programme. (full) ; didn't watch (partial) | — | — | — | — | true |
| g1u14.gi.past-simple-negative.gf.001 | gap-fill | I ___ (not/read) the detective story. [en, 1 blank(s)] | didn't read (full) ; did not read (full) | — | — | — | — | true |
| g1u14.gi.past-simple-negative.gf.002 | gap-fill | She ___ (not/like) the horror film. [en, 1 blank(s)] | didn't like (full) ; did not like (full) | — | — | — | — | true |
| g1u14.gi.past-simple-negative.gf.003 | gap-fill | They ___ (not/watch) the news. [en, 1 blank(s)] | didn't watch (full) ; did not watch (full) | — | — | — | — | true |
| g1u14.gi.past-simple-negative.gf.004 | gap-fill | He ___ (not/go) to the cinema, so he ___ (not/see) the fantasy film. [en, 2 blank(s)] | didn't go \| didn't see (full) ; did not go \| did not see (full) | — | — | — | — | true |
| g1u14.gi.past-simple-negative.gf.005 | gap-fill | We ___ (not/have) screen time, so we ___ (not/watch) a film. [en, 2 blank(s)] | didn't have \| didn't watch (full) ; did not have \| did not watch (full) | — | — | — | — | true |
| g1u14.gi.past-simple-negative.gf.006 | gap-fill | Tom ___ (not/tell) me about the cartoon, and I ___ (not/find) the remote control. [en, 2 blank(s)] | didn't tell \| didn't find (full) ; did not tell \| did not find (full) | — | — | — | — | true |
| g1u14.gi.past-simple-negative.gs.002 | group-sort | Welche Sätze mit didn't sind richtig, welche falsch? [de] | — | — | — | — | ✓: I didn't go to the cinema., She didn't see the film., We didn't watch the news., He didn't like the cartoon. \| ✗: I didn't went to the cinema., She didn't saw the film., We didn't watched the news., He didn't liked the cartoon. | false |
| g1u14.gi.past-simple-negative.mc.001 | multiple-choice | Welcher Satz ist richtig? [de] | She didn't watch the horror film. (full) | — | She didn't watched the horror film. ; She didn't saw the horror film. ; She wasn't watch the horror film. | — | — | true |
| g1u14.gi.past-simple-negative.mc.002 | multiple-choice | Welcher Satz ist richtig? [de] | They didn't read the detective story. (full) | — | They didn't told the detective story. ; They didn't liked the detective story. ; They wasn't read the detective story. | — | — | true |
| g1u14.gi.past-simple-negative.mc.004 | multiple-choice | Welcher Satz mit didn't ist richtig? He ___ to the lake. [de, 1 blank(s)] | didn't go (full) | — | didn't went ; didn't goed ; wasn't go | — | — | true |
| g1u14.gi.past-simple-negative.mp.001 | matching-pairs | Was passt zusammen? Falsche Form und richtige Form. [de] | — | — | — | didn't went ↔ didn't go ; didn't saw ↔ didn't see ; didn't ate ↔ didn't eat ; didn't liked ↔ didn't like ; didn't watched ↔ didn't watch | — | false |
| g1u14.gi.past-simple-negative.mt.001 | matching | Welcher Satzanfang passt zu welchem Ende? [de] | — | — | — | She didn't read ↔ the Sherlock Holmes stories. ; We didn't like ↔ the fantasy film. ; They didn't listen ↔ to Mum. ; He didn't catch ↔ the giraffe. | — | false |
| g1u14.gi.past-simple-negative.qf.001 | question-formation | Aussage: He watched the news. Frag verneint nach: Stimmt das nicht? Bilde: He ___ the news. [de, 1 blank(s)] | He didn't watch the news. (full) ; He did not watch the news. (full) | — | — | — | — | true |
| g1u14.gi.past-simple-negative.sb.001 | sentence-building | She / didn't / the / film / like / romantic [en] | She didn't like the romantic film. (full) | — | — | — | — | true |
| g1u14.gi.past-simple-negative.sb.002 | sentence-building | They / to / didn't / Mum / listen [en] | They didn't listen to Mum. (full) | — | — | — | — | true |
| g1u14.gi.past-simple-negative.tf.001 | transformation | Mach den Satz verneint: She watched the horror film. (not) [de] | She didn't watch the horror film. (full) ; She did not watch the horror film. (full) | — | — | — | — | true |
| g1u14.gi.past-simple-negative.tf.002 | transformation | Mach den Satz verneint: They ran away. (not) [de] | They didn't run away. (full) ; They did not run away. (full) | — | — | — | — | true |
| g1u14.gi.past-simple-negative.tf.003 | transformation | Mach den Satz verneint: He ate all the chocolate. (not) [de] | He didn't eat all the chocolate. (full) ; He did not eat all the chocolate. (full) | — | — | — | — | true |
| g1u14.gi.past-simple-negative.tr.001 | translation | Ich habe den Film nicht gesehen. [de] | I didn't see the film. (full) ; I did not see the film. (full) | deToEn | — | — | — | true |
| g1u14.gi.past-simple-negative.tr.002 | translation | Sie hat das Buch nicht gelesen. [de] | She didn't read the book. (full) ; She did not read the book. (full) | deToEn | — | — | — | true |

## Output contract

Write `content/corpus/units/g1-u14/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u14",
  "lens": "answers",
  "itemsHash": "1e4d4c2a2d9c",
  "promptHash": "70fa2d8cdf22",
  "round": 2,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 121, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
