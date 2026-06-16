# Verify lens — answers — g4-u07 (round 1)

<!-- domigo:verify answers g4-u07 items=fa13b94a59e9 prompt=70fa2d8cdf22 round=1 -->

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

## Vocab items (30)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g4u07.w.aborigine | Aborigine | a member of the people who lived in Australia first | The ___ were the first people to live in Australia. | Aborigines (full) ; Aborigine (partial) | Aborigine (full) ; Aborigines (full) | ancestor ; walkabout ; heritage |
| g4u07.w.aircraft | aircraft | a machine with wings that can fly, like a plane | The Flying Doctors travel long distances in their ___. | aircraft (full) | aircraft (full) ; an aircraft (full) | airline ; ambulance ; landing |
| g4u07.w.airline | airline | a big company that flies people to many cities | We are flying to Australia with a famous ___. | airline (full) | airline (full) ; an airline (full) | aircraft ; landing ; cheque |
| g4u07.w.ambulance | ambulance | a car that brings sick or hurt people to hospital fast | There was an accident, so we called an ___ right away. | ambulance (full) | ambulance (full) ; an ambulance (full) | aircraft ; landing ; ancestor |
| g4u07.w.ancestor | ancestor | a member of your family from a very long time before you | The ___ of the Aborigines came to Australia long ago. | ancestors (full) ; ancestor (partial) | ancestor (full) ; ancestors (full) | heritage ; Aborigine ; walkabout |
| g4u07.w.bush-trail | bush trail | a small path in the wild Australian land | Simon showed us a ___ in the wild. | bush trail (full) ; bush trails (partial) | bush trail (full) ; a bush trail (full) ; bush trails (partial) | walkabout ; (the) outback ; shade |
| g4u07.w.cheque | cheque | you write this to pay money from your bank | I have no money with me, so I will pay with a ___. | cheque (full) ; check (partial) | cheque (full) ; a cheque (full) ; check (partial) | envelope ; airline ; string |
| g4u07.w.crawl | crawl | to move along the ground on your knees | We were so scared that we ___ out of the camp on our knees. | crawled (full) ; crawl (partial) | crawl (full) ; to crawl (full) ; crawled (partial) | drag ; grab ; provide |
| g4u07.w.detailed | detailed | telling you very much about a thing and leaving nothing out | The police asked her for a ___ picture of the thief. | detailed (full) | detailed (full) | gorgeous ; heritage ; distance |
| g4u07.w.distance | distance | how much space there is between two places | The ___ from Vienna to Salzburg is about 300 kilometres. | distance (full) ; distances (partial) | distance (full) ; distances (full) | landing ; pressure ; heritage |
| g4u07.w.drag | drag | to pull a heavy thing along the ground | The big crocodile wanted to ___ the camp into the river. | drag (full) ; dragged (partial) | drag (full) ; to drag (full) ; dragged (partial) | grab ; crawl ; provide |
| g4u07.w.drugs | drugs | the medicines you take when you are sick | You have to take ___ if you have this illness. | drugs (full) ; drug (partial) | drugs (full) ; drug (partial) | first aid ; landing ; track |
| g4u07.w.envelope | envelope | a thin cover that you put a letter in | When you write a letter, you put it in an ___. | envelope (full) | envelope (full) ; an envelope (full) | cheque ; string ; airline |
| g4u07.w.excess-weight | excess weight | money you pay when what you bring on a plane is too heavy | I have to pay the ___ from my pocket money. | excess weight (full) | excess weight (full) ; excess baggage (partial) | distance ; landing ; airline |
| g4u07.w.first-aid | first aid | the help you give somebody who is hurt before the doctor arrives | If somebody is hurt, you give them ___ before the doctor arrives. | first aid (full) | first aid (full) | drugs ; ambulance ; landing |
| g4u07.w.gorgeous | gorgeous | very beautiful and nice to look at | Broome has the most ___ beach. | gorgeous (full) | gorgeous (full) | detailed ; heritage ; shade |
| g4u07.w.grab | grab | to take hold of a thing fast | ___ your school books, we have to go now! | Grab (full) ; grab (full) ; Grabbed (partial) ; grabbed (partial) | grab (full) ; to grab (full) ; grabbed (partial) | drag ; crawl ; provide |
| g4u07.w.headlight | headlight | a bright light on a car that lights up the road in the dark | It was dark, so I put the car's ___ on to light up the road. | headlights (full) ; headlight (partial) | headlight (full) ; headlights (full) | aircraft ; string ; track |
| g4u07.w.heritage | heritage | all the old traditions that people keep from long ago | Vienna is famous for its musical ___. | heritage (full) | heritage (full) | ancestor ; walkabout ; Aborigine |
| g4u07.w.jump-start | jump-start | to help a car go again using cables from a second car | Our car would not start, so we had to ___ it with cables from his car. | jump-start (full) ; jumpstart (partial) | jump-start (full) ; to jump-start (full) ; jumpstart (partial) | provide ; drag ; grab |
| g4u07.w.landing | landing | when a plane reaches the ground at the end of a flight | The aircraft had a good ___ on the dirt road. | landing (full) ; landings (partial) | landing (full) ; a landing (full) | aircraft ; distance ; airline |
| g4u07.w.outback | (the) outback | the dry wild Australian land, away from the cities | It is very hot and dry in the Australian ___. | outback (full) ; the outback (full) | outback (full) ; the outback (full) | walkabout ; bush trail ; shade |
| g4u07.w.pressure | pressure | the heavy feeling you have when you have too much to do | You take a holiday to leave the ___ of work behind. | pressure (full) ; pressures (partial) | pressure (full) | heritage ; shade ; distance |
| g4u07.w.provide | provide | to give somebody what they need | The school will ___ all you need for the art class. | provide (full) ; provides (partial) | provide (full) ; to provide (full) ; provides (partial) | grab ; drag ; crawl |
| g4u07.w.reed | reed | a tall thin green thing with long leaves near a lake | You can find ___ near a pond or a lake. | reeds (full) ; reed (partial) | reed (full) ; reeds (full) | string ; shade ; track |
| g4u07.w.shade | shade | a cooler darker place out of the sun, under a tree or wall | On a hot day, the big tree gives us cool ___. | shade (full) | shade (full) | pressure ; reed ; track |
| g4u07.w.string | string | a long thin piece you use to hold a thing or pull it | They put a piece of ___ on the rock and pulled it. | string (full) | string (full) | reed ; shade ; track |
| g4u07.w.survival-skills | survival skills | what you must know so you do not die in the wild | You need good ___ to stay alive in the wild. | survival skills (full) | survival skills (full) | walkabout ; (the) outback ; heritage |
| g4u07.w.track | track | the foot signs an animal leaves on the ground | The Aborigines can read animal ___ on the ground. | tracks (full) ; track (partial) | track (full) ; tracks (full) | reed ; string ; shade |
| g4u07.w.walkabout | walkabout | a long journey on foot across the Australian land | On their ___, the Aborigines cross Australia on foot. | walkabout (full) ; walkabouts (partial) | walkabout (full) ; a walkabout (full) | bush trail ; (the) outback ; heritage |

## Grammar items (117)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g4u07.gi.present-simple-future.ag.002 | anagram | Ordne die Buchstaben. So heißt es, wenn ein Geschäft nach festen Zeiten aufmacht: The shop ___ at 9. (snepo) [de, 1 blank(s)] | opens (full) | — | — | — | — | false |
| g4u07.gi.present-simple-future.ag.003 | anagram | Ordne die Buchstaben. So heißt es, wenn ein Zug nach Fahrplan abfährt: The train ___ at six. (leevas) [de, 1 blank(s)] | leaves (full) | — | — | — | — | false |
| g4u07.gi.present-simple-future.cp.001 | context-picker | Du schaust auf den Programmplan vom Kino. Die Vorstellung um 8:30 ist fix eingetragen. Welcher Satz passt? [de] | The show begins at 8:30. (full) | — | The show is beginning at 8:30. ; The show will begin at 8:30. ; The show is going to begin at 8:30. | — | — | false |
| g4u07.gi.present-simple-future.cp.002 | context-picker | Du stehst am Bahnhof und schaust auf die Anzeigetafel. Der nächste Zug ist für 15:45 eingetragen. Welcher Satz passt? [de] | The train arrives at 15:45. (full) | — | The train will arrive at 15:45. ; The train is arriving at 15:45. ; The train is going to arrive at 15:45. | — | — | false |
| g4u07.gi.present-simple-future.cp.003 | context-picker | Du erzählst von deinen eigenen Plänen fürs Wochenende — das ist KEIN Fahrplan, sondern deine eigene Absicht. Welcher Satz passt? [de] | I am going to visit my aunt this weekend. (full) | — | I visit my aunt this weekend. ; My aunt visits me this weekend at 8. ; I visits my aunt this weekend. | — | — | false |
| g4u07.gi.present-simple-future.cp.004 | context-picker | Du liest die Abflugtafel am Flughafen. Der Flug nach London ist fix für 6:30 eingetragen. Welcher Satz passt? [de] | The flight to London takes off at 6:30. (full) | — | The flight to London will take off at 6:30. ; The flight to London is taking off at 6:30. ; The flight to London is going to take off at 6:30. | — | — | false |
| g4u07.gi.present-simple-future.ec.001 | error-correction | Finde und verbessere den Fehler (es ist ein Fahrplan). The train will arrive at platform 3 at 10:15. [de] | The train arrives at platform 3 at 10:15. (full) ; arrives (partial) | — | — | — | — | true |
| g4u07.gi.present-simple-future.ec.002 | error-correction | Finde und verbessere den Fehler (Kinoprogramm). The concert is beginning at 8 p.m. tonight. [de] | The concert begins at 8 p.m. tonight. (full) ; begins (partial) | — | — | — | — | true |
| g4u07.gi.present-simple-future.ec.003 | error-correction | Finde und verbessere den Fehler (Stundenplan). The lesson begin at 8 o'clock every morning. [de] | The lesson begins at 8 o'clock every morning. (full) ; begins (partial) | — | — | — | — | true |
| g4u07.gi.present-simple-future.ec.004 | error-correction | Finde und verbessere den Fehler (eigener Plan, kein Fahrplan). I play football with my friends tomorrow afternoon. [de] | I am going to play football with my friends tomorrow afternoon. (full) ; I'm going to play football with my friends tomorrow afternoon. (full) ; I am playing football with my friends tomorrow afternoon. (partial) | — | — | — | — | false |
| g4u07.gi.present-simple-future.ec.005 | error-correction | Finde und verbessere den Fehler (Stundenplan). School is going to begin at 8 o'clock every day. [de] | School begins at 8 o'clock every day. (full) ; begins (partial) | — | — | — | — | true |
| g4u07.gi.present-simple-future.ec.006 | error-correction | Finde und verbessere den Fehler (Flugplan). The plane will land in Perth at 2:30 p.m. [de] | The plane lands in Perth at 2:30 p.m. (full) ; lands (partial) | — | — | — | — | true |
| g4u07.gi.present-simple-future.ec.007 | error-correction | Finde und verbessere den Fehler (Öffnungszeiten). The market is opening at 8 o'clock every morning. [de] | The market opens at 8 o'clock every morning. (full) ; opens (partial) | — | — | — | — | true |
| g4u07.gi.present-simple-future.gf.001 | gap-fill | Setz die richtige Form ein (fester Fahrplan). The train ___ (leave) at 6:30 tomorrow. [de, 1 blank(s)] | leaves (full) | — | — | — | — | false |
| g4u07.gi.present-simple-future.gf.002 | gap-fill | Setz die richtige Form ein (fester Zeitplan). The concert ___ (begin) at 8 p.m. tonight. [de, 1 blank(s)] | begins (full) | — | — | — | — | false |
| g4u07.gi.present-simple-future.gf.003 | gap-fill | Setz die richtige Form ein (Öffnungszeiten). The shop ___ (open) at 9 a.m. tomorrow. [de, 1 blank(s)] | opens (full) | — | — | — | — | false |
| g4u07.gi.present-simple-future.gf.004 | gap-fill | Setz die richtige Form ein (Flugplan). Our plane to Alice Springs ___ (leave) at 8.30 tomorrow morning. [de, 1 blank(s)] | leaves (full) | — | — | — | — | false |
| g4u07.gi.present-simple-future.gf.005 | gap-fill | Setz die richtige Form ein (Fahrplan). The last train ___ (leave) at 11:45 p.m. Don't miss it! [de, 1 blank(s)] | leaves (full) | — | — | — | — | false |
| g4u07.gi.present-simple-future.gf.006 | gap-fill | Setz die richtige Form ein (Öffnungszeiten). The library ___ (close) at 5 p.m. on Saturdays. [de, 1 blank(s)] | closes (full) | — | — | — | — | false |
| g4u07.gi.present-simple-future.gf.007 | gap-fill | Setz beide Formen ein (Prüfungsplan). Our exams ___ (begin) on the 15th of June and ___ (end) on the 22nd. [de, 2 blank(s)] | begin \| end (full) | — | — | — | — | false |
| g4u07.gi.present-simple-future.gf.008 | gap-fill | Setz die richtige Form ein (Fahrplan, Frage). What time ___ the concert ___ (begin) tonight? [de, 2 blank(s)] | does \| begin (full) | — | — | — | — | false |
| g4u07.gi.present-simple-future.gf.009 | gap-fill | Setz die richtige Form ein (eigene Absicht, kein Fahrplan). I ___ (visit) my grandma tomorrow. It's my own plan. [de, 1 blank(s)] | am going to visit (full) ; am visiting (partial) | — | — | — | — | false |
| g4u07.gi.present-simple-future.gf.010 | gap-fill | Setz die verneinte Form ein (Öffnungszeiten). The museum ___ (not / open) on Mondays. [de, 1 blank(s)] | doesn't open (full) ; does not open (full) | — | — | — | — | true |
| g4u07.gi.present-simple-future.gf.011 | gap-fill | Setz die richtige Form ein (Flugplan). The flight to London ___ (take off) at 6:30 a.m. [de, 1 blank(s)] | takes off (full) | — | — | — | — | false |
| g4u07.gi.present-simple-future.gf.012 | gap-fill | Setz die richtige Form ein (Reiseplan). In the early afternoon we ___ (fly) to Sydney. [de, 1 blank(s)] | fly (full) | — | — | — | — | false |
| g4u07.gi.present-simple-future.gf.013 | gap-fill | Setz die richtige Form ein (Fahrplan). The ferry ___ (arrive) at midday. [de, 1 blank(s)] | arrives (full) | — | — | — | — | false |
| g4u07.gi.present-simple-future.gf.014 | gap-fill | Setz die richtige Form ein (Programm). The exhibition ___ (open) on Friday. [de, 1 blank(s)] | opens (full) | — | — | — | — | false |
| g4u07.gi.present-simple-future.gf.015 | gap-fill | Setz die richtige Form ein (Frage, Fahrplan). What time ___ the ferry ___ (leave) for the island? [de, 2 blank(s)] | does \| leave (full) | — | — | — | — | false |
| g4u07.gi.present-simple-future.gs.007 | group-sort | Sortiere: Welche Sätze passen zu einem festen Fahrplan (richtig) und welche nicht (falsch)? [de] | — | — | — | — | leaves / opens: The train leaves at 6:30 tomorrow., The museum opens at 9 a.m. on Sunday., The plane lands at 2:30 p.m. \| will / going to: The train will leave at 6:30 tomorrow., The museum is opening at 9 a.m. on Sunday., The plane is going to land at 2:30 p.m. | false |
| g4u07.gi.present-simple-future.gs.008 | group-sort | Sortiere: fester Fahrplan/Programm oder eigener Plan/Vorhersage? [de] | — | — | — | — | leaves / opens: The train leaves at 6:30., The shop opens at 9 a.m., The exhibition opens on Friday. \| will / going to: I am going to study medicine., I think it will rain tomorrow., She is visiting her aunt tomorrow. | false |
| g4u07.gi.present-simple-future.mc.001 | multiple-choice | Wähl die richtige Form (fester Fahrplan). The train to Salzburg ___ at 7:15. [de, 1 blank(s)] | leaves (full) | — | will leave ; is leaving ; is going to leave | — | — | false |
| g4u07.gi.present-simple-future.mc.002 | multiple-choice | Welcher Satz beschreibt richtig einen festen Fahrplan? [de] | The shop closes at 9 p.m. today. (full) | — | I close the door when I leave. ; The shop will close at 9 p.m. today. ; I go to the cinema tomorrow with my friends. | — | — | false |
| g4u07.gi.present-simple-future.mc.003 | multiple-choice | Wähl die richtige Form (Öffnungszeiten). The library ___ at 5 p.m. on Saturdays. [de, 1 blank(s)] | closes (full) | — | will close ; is closing ; close | — | — | false |
| g4u07.gi.present-simple-future.mc.004 | multiple-choice | Dein Freund sagt: 'The concert is going to begin at 7 p.m.' Du schaust auf das gedruckte Programm. Was sagst du ihm? [de] | The concert begins at 7 p.m. — it's on the programme. (full) | — | The concert will begin at 7 p.m. — I want to. ; The concert is beginning at 7 p.m. — I think so. ; The concert is going to begin at 7 p.m. — it's what I hope. | — | — | false |
| g4u07.gi.present-simple-future.mc.005 | multiple-choice | In welchem Satz ist die Form FALSCH (es ist ein fester Fahrplan)? [de] | The plane will leave at 14:30 tomorrow. (full) | — | I am going to study medicine. ; The exhibition opens on Friday. ; It will probably rain tomorrow. | — | — | false |
| g4u07.gi.present-simple-future.mc.006 | multiple-choice | In welchem Satz steht ein fester Flugplan richtig (etwas ist fix geplant)? [de] | The flight to London takes off at 6:30 a.m. (full) | — | I am visiting my grandma tomorrow. ; I think it will rain tomorrow. ; She is going to study medicine. | — | — | false |
| g4u07.gi.present-simple-future.mc.007 | multiple-choice | Wähl die richtige Form (Fahrplan). The plane ___ in Perth at 2:30 p.m. [de, 1 blank(s)] | lands (full) | — | will land ; is landing ; land | — | — | false |
| g4u07.gi.present-simple-future.mt.001 | matching | Verbinde jeden Satzanfang mit dem passenden Ende. [de] | — | — | — | The train ↔ leaves at 6:30 tomorrow. ; The museum ↔ opens at 9 a.m. on Sunday. ; The concert ↔ begins at 8 p.m. tonight. ; The plane ↔ lands in Perth at 2:30 p.m. | — | false |
| g4u07.gi.present-simple-future.mt.002 | matching | Verbinde die Frage mit der passenden Antwort. [de] | — | — | — | What time does the train leave? ↔ It leaves at 6:30. ; When does the museum open? ↔ It opens on Sunday. ; What time does the shop close? ↔ It closes at 5 p.m. ; When does the concert begin? ↔ It begins tonight. | — | false |
| g4u07.gi.present-simple-future.qf.001 | question-formation | Bilde die Frage. Du willst die feste Öffnungszeit am Sonntag wissen. Chips: the / museum / open / on Sunday [de] | When does the museum open on Sunday? (full) ; What time does the museum open on Sunday? (full) ; Does the museum open on Sunday? (partial) | — | — | — | — | false |
| g4u07.gi.present-simple-future.qf.002 | question-formation | Bilde die Frage nach der festen Abfahrtszeit. Chips: what time / the train / leave / tomorrow [de] | What time does the train leave tomorrow? (full) | — | — | — | — | false |
| g4u07.gi.present-simple-future.sb.001 | sentence-building | Bring die Wörter in die richtige Reihenfolge. at / the / 7:30 / train / leaves [de] | The train leaves at 7:30. (full) | — | — | — | — | false |
| g4u07.gi.present-simple-future.sb.002 | sentence-building | Bring die Wörter in die richtige Reihenfolge. at / begins / the / concert / 3 p.m. [de] | The concert begins at 3 p.m. (full) | — | — | — | — | false |
| g4u07.gi.present-simple-future.sb.003 | sentence-building | Bring die Wörter in die richtige Reihenfolge. does / time / the / what / museum / open / ? [de] | What time does the museum open? (full) | — | — | — | — | false |
| g4u07.gi.present-simple-future.sb.004 | sentence-building | Bring die Wörter in die richtige Reihenfolge. tomorrow / leaves / our / plane / 8.30 / at [de] | Our plane leaves at 8.30 tomorrow. (full) | — | — | — | — | false |
| g4u07.gi.present-simple-future.tf.001 | transformation | Schreib so um, dass es ein fester Fahrplan ist. The ferry will leave at 3:30 p.m. → The ferry ___. [de, 1 blank(s)] | The ferry leaves at 3:30 p.m. (full) | — | — | — | — | false |
| g4u07.gi.present-simple-future.tf.002 | transformation | Schreib so um, dass es feste Öffnungszeiten sind. The market will open at 8 o'clock tomorrow. → The market ___. [de, 1 blank(s)] | The market opens at 8 o'clock tomorrow. (full) | — | — | — | — | false |
| g4u07.gi.present-simple-future.tf.003 | transformation | Bilde die Frage nach der festen Schließzeit. Du willst wissen, wann das Museum schließt. → What time ___? [de, 1 blank(s)] | What time does the museum close? (full) | — | — | — | — | false |
| g4u07.gi.present-simple-future.tf.004 | transformation | Schreib mit der passenden Form um (eigener Plan, kein Fahrplan!). The concert begins at 7. → I / go / to the concert [de] | I am going to go to the concert. (full) ; I'm going to go to the concert. (full) | — | — | — | — | false |
| g4u07.gi.present-simple-future.tf.005 | transformation | Du bist am Flughafen und liest die Anzeige. Sag deinem Freund Bescheid: 'Our plane ___ (leave) at 6:15 tomorrow morning.' [de, 1 blank(s)] | leaves (full) | — | — | — | — | false |
| g4u07.gi.present-simple-future.tf.006 | transformation | Bilde die Frage nach der festen Ankunftszeit. Du willst wissen, wann der Zug morgen ankommt. → What time ___? [de, 1 blank(s)] | What time does the train arrive tomorrow? (full) | — | — | — | — | false |
| g4u07.gi.present-simple-future.tr.001 | translation | Der Zug fährt um 9 Uhr ab. [de] | The train leaves at 9 o'clock. (full) ; The train leaves at 9. (full) ; The train leaves at 9 a.m. (partial) | deToEn | — | — | — | false |
| g4u07.gi.present-simple-future.tr.002 | translation | Wann beginnt die Vorstellung? [de] | When does the show begin? (full) ; What time does the show begin? (full) ; When does the concert begin? (partial) | deToEn | — | — | — | false |
| g4u07.gi.present-simple-future.tr.003 | translation | Das Flugzeug landet um 14:30 Uhr. [de] | The plane lands at 2:30 p.m. (full) ; The plane lands at 14:30. (full) ; The plane arrives at 2:30 p.m. (partial) | deToEn | — | — | — | false |
| g4u07.gi.present-simple-future.tr.004 | translation | Wann macht das Museum morgen auf? [de] | When does the museum open tomorrow? (full) ; What time does the museum open tomorrow? (full) | deToEn | — | — | — | false |
| g4u07.gi.present-simple-future.tr.005 | translation | Diesen Sonntag gibt es ein Konzert. [de] | There's a concert this Sunday. (full) ; There is a concert this Sunday. (full) | deToEn | — | — | — | false |
| g4u07.gi.present-simple-future.tr.006 | translation | Wir haben morgen einen Flug. [de] | We have got a flight tomorrow. (full) ; We have a flight tomorrow. (partial) | deToEn | — | — | — | false |
| g4u07.gi.present-simple-future.tr.007 | translation | Das Geschäft schließt heute um 9 Uhr abends. [de] | The shop closes at 9 p.m. today. (full) ; The shop closes at 9 o'clock today. (partial) | deToEn | — | — | — | false |
| g4u07.gi.want-someone-to.ag.002 | anagram | Welche Person passt nach 'want'?  My parents want ___ to come home. Sortiere die Buchstaben: h e t m [de, 1 blank(s)] | them (full) | — | — | — | — | false |
| g4u07.gi.want-someone-to.cp.001 | context-picker | Dein kleiner Cousin macht zu viel Lärm. Du sagst deiner Mutter, was du möchtest. Welcher Satz ist richtig? [de] | I want him to stop the noise. (full) | — | I want that he stop the noise. ; I want him stop the noise. ; I want he to stop the noise. | — | — | false |
| g4u07.gi.want-someone-to.cp.002 | context-picker | Dein Freund will nicht, dass du heute zu spät kommst. Welcher Satz gibt das richtig wieder? [de] | He doesn't want me to be late. (full) | — | He doesn't want that I am late. ; He doesn't want me be late. ; He doesn't want I to be late. | — | — | false |
| g4u07.gi.want-someone-to.cp.003 | context-picker | Du möchtest deinem Freund beim Tragen helfen und fragst ihn. Welcher Satz ist richtig? [de] | Do you want me to help you? (full) | — | Do you want that I help you? ; Do you want me help you? ; Do you want I to help you? | — | — | false |
| g4u07.gi.want-someone-to.cp.004 | context-picker | Du möchtest, dass deine Schwester dir hilft. Welcher Satz ist richtig? [de] | I want my sister to help me. (full) | — | I want that my sister helps me. ; I want my sister help me. ; I want my sister helping me. | — | — | false |
| g4u07.gi.want-someone-to.ec.001 | error-correction | I want that you help me with this homework. [en] | I want you to help me with this homework. (full) ; I want you to help me with this homework (partial) | — | — | — | — | true |
| g4u07.gi.want-someone-to.ec.002 | error-correction | My mum wants that I come home before nine. [en] | My mum wants me to come home before nine. (full) ; My mum wants me to come home before nine (partial) | — | — | — | — | true |
| g4u07.gi.want-someone-to.ec.003 | error-correction | I want you help me carry the bags. [en] | I want you to help me carry the bags. (full) ; I want you to help me carry the bags (partial) | — | — | — | — | true |
| g4u07.gi.want-someone-to.ec.004 | error-correction | The doctor wants he to take the medicine every day. [en] | The doctor wants him to take the medicine every day. (full) ; The doctor wants him to take the medicine every day (partial) | — | — | — | — | true |
| g4u07.gi.want-someone-to.ec.005 | error-correction | My mum wants to tidy my room every Saturday. [en] | My mum wants me to tidy my room every Saturday. (full) ; My mum wants me to tidy my room every Saturday (partial) | — | — | — | — | true |
| g4u07.gi.want-someone-to.ec.006 | error-correction | The teacher asked us to not talk during the lesson. [en] | The teacher asked us not to talk during the lesson. (full) ; The teacher asked us not to talk during the lesson (partial) | — | — | — | — | true |
| g4u07.gi.want-someone-to.ec.007 | error-correction | She asked we to wait for her after school. [en] | She asked us to wait for her after school. (full) ; She asked us to wait for her after school (partial) | — | — | — | — | true |
| g4u07.gi.want-someone-to.ec.008 | error-correction | We want that you come with us. [en] | We want you to come with us. (full) ; We want you to come with us (partial) | — | — | — | — | true |
| g4u07.gi.want-someone-to.gf.001 | gap-fill | I want you ___ help me with my homework. [en, 1 blank(s)] | to (full) | — | — | — | — | false |
| g4u07.gi.want-someone-to.gf.002 | gap-fill | She asked ___ to sit down and wait. (he) [en, 1 blank(s)] | him (full) | — | — | — | — | false |
| g4u07.gi.want-someone-to.gf.003 | gap-fill | My parents ___ me to come home before nine. (want) [en, 1 blank(s)] | want (full) | — | — | — | — | false |
| g4u07.gi.want-someone-to.gf.004 | gap-fill | My parents want me ___ (come) home before nine. [en, 1 blank(s)] | to come (full) | — | — | — | — | false |
| g4u07.gi.want-someone-to.gf.005 | gap-fill | The teacher wants us ___ (work) quietly. [en, 1 blank(s)] | to work (full) | — | — | — | — | false |
| g4u07.gi.want-someone-to.gf.006 | gap-fill | She doesn't want ___ to go without her. (they) [en, 1 blank(s)] | them (full) | — | — | — | — | false |
| g4u07.gi.want-someone-to.gf.007 | gap-fill | Do you want ___ (I / carry) your homework for you? [en, 1 blank(s)] | me to carry (full) | — | — | — | — | false |
| g4u07.gi.want-someone-to.gf.008 | gap-fill | The teacher asked us ___ (not / talk) during the lesson. [en, 1 blank(s)] | not to talk (full) | — | — | — | — | false |
| g4u07.gi.want-someone-to.gf.009 | gap-fill | I wanted my sister ___ me with my homework, but she was busy. [en, 1 blank(s)] | to help (full) | — | — | — | — | false |
| g4u07.gi.want-someone-to.gf.010 | gap-fill | Our coach doesn't want ___ to eat junk food before the match. (we) [en, 1 blank(s)] | us (full) | — | — | — | — | false |
| g4u07.gi.want-someone-to.gf.011 | gap-fill | Do you want ___ (I / pick) you up from the station, or do you take the train? [en, 1 blank(s)] | me to pick (full) | — | — | — | — | false |
| g4u07.gi.want-someone-to.gf.012 | gap-fill | My mum wants ___ (we / stay) in tonight, and she asks ___ (we / do) our homework first. [en, 2 blank(s)] | us to stay\|us to do (full) | — | — | — | — | false |
| g4u07.gi.want-someone-to.gf.013 | gap-fill | We want you ___ come with us to the outback. [en, 1 blank(s)] | to (full) | — | — | — | — | false |
| g4u07.gi.want-someone-to.gf.014 | gap-fill | I expect you ___ (be) on time tomorrow morning. [en, 1 blank(s)] | to be (full) | — | — | — | — | false |
| g4u07.gi.want-someone-to.gf.015 | gap-fill | He asked me ___ (wait) for him at the station. [en, 1 blank(s)] | to wait (full) | — | — | — | — | false |
| g4u07.gi.want-someone-to.gf.016 | gap-fill | Does your dad ___ you to study medicine? (want) [en, 1 blank(s)] | want (full) | — | — | — | — | false |
| g4u07.gi.want-someone-to.gf.017 | gap-fill | My dad asked me ___ (not / use) my phone at dinner. [en, 1 blank(s)] | not to use (full) | — | — | — | — | false |
| g4u07.gi.want-someone-to.gf.018 | gap-fill | She wants you ___ (call) her back after school. [en, 1 blank(s)] | to call (full) | — | — | — | — | false |
| g4u07.gi.want-someone-to.gs.003 | group-sort | Welche Sätze sind richtig (✓) und welche falsch (✗)? [de] | — | — | — | — | ✓: I want you to help me., She asked him to wait., My mum wants me to come home. \| ✗: I want that you help me., She asked him wait., My mum wants me come home. | false |
| g4u07.gi.want-someone-to.gs.004 | group-sort | Sortiere: Wer soll etwas TUN (✓) und wer soll etwas NICHT tun (✗)? [de] | — | — | — | — | to do: I want you to wait here., She asked me to come early., We want them to help us. \| not to do: I want you not to wait., She asked me not to come., We want them not to go. | false |
| g4u07.gi.want-someone-to.mc.001 | multiple-choice | Welcher Satz ist richtig? [de] | Mum wants me to tidy up my room. (full) | — | Mum wants that I tidy up my room. ; Mum wants I to tidy up my room. ; Mum wants me tidy up my room. | — | — | false |
| g4u07.gi.want-someone-to.mc.002 | multiple-choice | Welcher Satz ist richtig? [de] | The coach asked them to run faster. (full) | — | The coach asked that they run faster. ; The coach asked them run faster. ; The coach asked to them to run faster. | — | — | false |
| g4u07.gi.want-someone-to.mc.003 | multiple-choice | Welcher Satz drückt richtig aus, dass jemand etwas NICHT tun soll? [de] | She asked him not to be late. (full) | — | She asked him to not be late. ; She asked him don't be late. ; She asked that he not be late. | — | — | false |
| g4u07.gi.want-someone-to.mc.004 | multiple-choice | Welcher Satz ist NICHT richtig? [de] | I want that she comes to dinner. (full) | — | I want her to come to dinner. ; I asked her to come to dinner. ; I expect her to come to dinner. | — | — | false |
| g4u07.gi.want-someone-to.mc.005 | multiple-choice | Welche Frage ist richtig gebildet? [de] | Does your dad want you to study medicine? (full) | — | Does your dad want that you study medicine? ; Does your dad wants you to study medicine? ; Does your dad want you study medicine? | — | — | false |
| g4u07.gi.want-someone-to.mc.006 | multiple-choice | Was passt in die Lücke?  She wants me ___ wash the dishes. [de, 1 blank(s)] | to (full) | — | that ; for ; — | — | — | false |
| g4u07.gi.want-someone-to.mc.007 | multiple-choice | Was passt in die Lücke?  My parents want ___ to come home early. [de, 1 blank(s)] | me (full) | — | I ; my ; that I | — | — | false |
| g4u07.gi.want-someone-to.mt.001 | matching | Welcher Anfang passt zu welchem Ende? (wer soll was tun) [de] | — | — | — | I want you ↔ to help me move the desk. ; She asked him ↔ to wait outside. ; They asked us ↔ to come with them. ; He wants her ↔ to call him back. ; We want them ↔ to win the match. | — | false |
| g4u07.gi.want-someone-to.mt.002 | matching | Welcher Anfang passt zu welchem Ende? [de] | — | — | — | My mum wants me ↔ to tidy my room. ; The doctor asked her ↔ to drink more. ; Do you want her ↔ to call you back? ; Dad wanted them ↔ to come home early. ; I expect you ↔ to be on time. | — | false |
| g4u07.gi.want-someone-to.qf.001 | question-formation | Dein Freund braucht vielleicht Hilfe. Bilde die Frage, die mit 'Do you want …' beginnt. [de] | Do you want me to help you? (full) ; Do you want me to help you (full) ; Do you want me to help? (partial) | — | — | — | — | false |
| g4u07.gi.want-someone-to.qf.002 | question-formation | Die Eltern deiner Freundin wollen, dass sie etwas Bestimmtes wird. Frag danach. Wörter: What / parents / want / do? [de] | What do her parents want her to do? (full) ; What do her parents want her to do (full) ; What do your parents want you to do? (partial) | — | — | — | — | false |
| g4u07.gi.want-someone-to.sb.001 | sentence-building | wants / me / to / mum / clean / my / room / my [en] | My mum wants me to clean my room. (full) ; My mum wants me to clean my room (full) | — | — | — | — | false |
| g4u07.gi.want-someone-to.sb.002 | sentence-building | wants / the coach / to / run / us / faster [en] | The coach wants us to run faster. (full) ; The coach wants us to run faster (full) | — | — | — | — | false |
| g4u07.gi.want-someone-to.sb.003 | sentence-building | doesn't / her / to / want / go / she / alone / him [en] | She doesn't want him to go alone. (full) ; She doesn't want him to go alone (full) | — | — | — | — | false |
| g4u07.gi.want-someone-to.tf.001 | transformation | Dein kleiner Cousin ist laut. Sag deiner Mutter, was du möchtest: 'I want him ___ (stop) the noise!' [de, 1 blank(s)] | to stop (full) | — | — | — | — | false |
| g4u07.gi.want-someone-to.tf.002 | transformation | Die Lehrerin gab eine Anweisung. Erzähle deinem Freund: 'She asked us ___ (not / use) our phones in class.' [de, 1 blank(s)] | not to use (full) | — | — | — | — | false |
| g4u07.gi.want-someone-to.tf.003 | transformation | Schreib den Satz mit 'want' um. Mein Vater sagt zu meiner Schwester: 'Please wash the dishes.' → My dad wants ___. [de, 1 blank(s)] | my sister to wash the dishes (full) ; her to wash the dishes (full) ; My dad wants my sister to wash the dishes. (full) ; My dad wants her to wash the dishes. (full) | — | — | — | — | false |
| g4u07.gi.want-someone-to.tf.004 | transformation | Schreib den Satz mit 'not want' um. Das Schild sagt: 'Don't use your phones in class.' → The school doesn't want ___. [de, 1 blank(s)] | you to use your phones in class (full) ; us to use our phones in class (full) ; The school doesn't want you to use your phones in class. (full) ; The school doesn't want us to use our phones in class. (full) | — | — | — | — | false |
| g4u07.gi.want-someone-to.tf.005 | transformation | Schreib um mit 'ask'. Meine Mutter sagt zu mir: 'Please post this letter.' → My mum asked ___. [de, 1 blank(s)] | me to post this letter (full) ; me to post the letter (full) ; My mum asked me to post this letter. (full) ; My mum asked me to post the letter. (full) | — | — | — | — | false |
| g4u07.gi.want-someone-to.tf.006 | transformation | Mach aus der Bitte einen Satz mit 'ask'. Die Lehrerin sagt zu uns: 'Please open your books.' → The teacher asks us ___. [de, 1 blank(s)] | to open our books (full) ; The teacher asks us to open our books. (full) | — | — | — | — | false |
| g4u07.gi.want-someone-to.tr.001 | translation | Ich will, dass du mir zuhörst. [de] | I want you to listen to me. (full) ; I want you to listen to me (full) ; I'd like you to listen to me. (partial) | deToEn | — | — | — | false |
| g4u07.gi.want-someone-to.tr.002 | translation | Meine Eltern wollen, dass ich mehr lese. [de] | My parents want me to read more. (full) ; My parents want me to read more (full) | deToEn | — | — | — | false |
| g4u07.gi.want-someone-to.tr.003 | translation | Er bat mich, ihm bei den Hausaufgaben zu helfen. [de] | He asked me to help him with his homework. (full) ; He asked me to help him with his homework (full) ; He asked me to help him with the homework. (partial) | deToEn | — | — | — | false |
| g4u07.gi.want-someone-to.tr.004 | translation | Willst du, dass ich dir bei den Hausaufgaben helfe? [de] | Do you want me to help you with your homework? (full) ; Do you want me to help you with your homework (full) ; Do you want me to help you with the homework? (partial) | deToEn | — | — | — | false |
| g4u07.gi.want-someone-to.tr.005 | translation | Die Lehrerin will, dass wir ruhig arbeiten. [de] | The teacher wants us to work quietly. (full) ; The teacher wants us to work quietly (full) | deToEn | — | — | — | false |
| g4u07.gi.want-someone-to.tr.006 | translation | Unser Trainer will, dass wir härter trainieren. [de] | Our coach wants us to train harder. (full) ; Our coach wants us to train harder (full) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g4-u07/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g4-u07",
  "lens": "answers",
  "itemsHash": "fa13b94a59e9",
  "promptHash": "70fa2d8cdf22",
  "round": 1,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 147, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
