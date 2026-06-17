# Verify lens — answers — g3-u12 (round 2)

<!-- domigo:verify answers g3-u12 items=ecaadbc4ea55 prompt=70fa2d8cdf22 round=2 -->

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

## Vocab items (50)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g3u12.w.ash | ash | the grey powder on the ground after a fire. | He used ___ from the fire to draw a face on the ball. | ash (full) ; ashes (partial) | ash (full) | flame ; shelter ; raft |
| g3u12.w.avalanche | avalanche | a big mass of snow moving fast down a mountain. | Three people on the mountain had to wait for help after a big ___ of snow came down. | avalanche (full) ; avalanches (partial) | avalanche (full) ; an avalanche (full) | flood ; drought ; hurricane |
| g3u12.w.border | border | the place where two countries meet. | There were fights at the Mexican ___ with North America. | border (full) ; borders (partial) | border (full) ; the border (full) | surface ; region ; shelter |
| g3u12.w.castaway | castaway | a person who lives alone on an island after their ship sinks. | How would you spend your time if you were a ___? | castaway (full) ; castaways (partial) | castaway (full) ; a castaway (full) | shelter ; flame ; raft |
| g3u12.w.damage | damage | when a thing breaks and does not work. | The ___ caused by the earthquake was bad. | damage (full) | damage (full) | research ; pressure ; joy |
| g3u12.w.delivery-company | delivery company | a business that brings parcels and letters to people's houses. | Chuck had a job at a big worldwide ___. | delivery company (full) ; delivery companies (partial) | delivery company (full) ; a delivery company (full) | delivery ; shelter ; border |
| g3u12.w.desert-island | desert island | a lonely piece of land in the sea where nobody lives. | What would you take on a ___? | desert island (full) ; desert islands (partial) | desert island (full) ; a desert island (full) | shelter ; raft ; region |
| g3u12.w.drought | drought | a long time with no rain, when the land becomes very dry. | Last year there was a long ___ and many plants died because there was no rain for months. | drought (full) ; droughts (partial) | drought (full) ; a drought (full) | flood ; earthquake ; tsunami |
| g3u12.w.earthquake | earthquake | a strong shaking of the ground. | There was a strong ___ in Japan last night and the ground shook for a minute. | earthquake (full) ; earthquakes (partial) | earthquake (full) ; an earthquake (full) | flood ; drought ; hurricane |
| g3u12.w.escape-route | escape route | the way out of a building when there is danger. | When you go into a new building, always look for the nearest ___ and the way out. | escape route (full) ; escape routes (partial) | escape route (full) ; an escape route (full) | smoke detector ; meeting place ; fire drill |
| g3u12.w.fire-drill | fire drill | when you all go outside fast to know what to do if there is danger. | We have a ___ at school every month so we all know how to leave the building fast. | fire drill (full) ; fire drills (partial) | fire drill (full) ; a fire drill (full) | escape route ; meeting place ; smoke detector |
| g3u12.w.flame | flame | the bright, hot light of a fire. | He was trying to make fire and finally he saw a ___. | flame (full) ; flames (partial) | flame (full) ; a flame (full) | ash ; shelter ; raft |
| g3u12.w.flood | flood | when water covers land that is usually dry. | After the heavy rain there was a ___ and many homes were flooded for days. | flood (full) ; floods (partial) | flood (full) ; a flood (full) | drought ; earthquake ; avalanche |
| g3u12.w.forest-fire | forest fire | when the woods are burning and many trees are destroyed. | It was difficult to put out the ___ because the strong wind pushed the flames through the trees. | forest fire (full) ; forest fires (partial) | forest fire (full) ; a forest fire (full) | flood ; drought ; hurricane |
| g3u12.w.hometown | hometown | the town or city where you grew up. | Chuck lived on the island so long that it was like his old ___. | hometown (full) ; hometowns (partial) | hometown (full) ; your hometown (full) | shelter ; border ; region |
| g3u12.w.hurricane | hurricane | a very strong storm with fast winds and heavy rain. | The ___ brought very strong winds and a lot of rain to the islands near the sea. | hurricane (full) ; hurricanes (partial) | hurricane (full) ; a hurricane (full) | drought ; earthquake ; avalanche |
| g3u12.w.in-case-of | in case of | if there is a certain emergency. | ___ fire go outside! | In case of (full) ; in case of (full) | in case of (full) | because of ; instead of ; out of |
| g3u12.w.joy | joy | a feeling of great happiness. | He laughed with ___. | joy (full) | joy (full) | damage ; pressure ; research |
| g3u12.w.lighter | lighter | a small thing that you use to make a flame. | Don't play with ___. | lighters (full) ; lighter (partial) | lighter (full) ; a lighter (full) | flame ; ash ; raft |
| g3u12.w.meeting-place | meeting place | where everybody meets after they leave a building in danger. | After we all leave the building, our ___ is behind the school. | meeting place (full) ; meeting places (partial) | meeting place (full) ; a meeting place (full) | escape route ; smoke detector ; fire drill |
| g3u12.w.miracle | miracle | an amazing thing that you cannot understand. | It's a ___ that we survived the earthquake. | miracle (full) ; miracles (partial) | miracle (full) ; a miracle (full) | damage ; pressure ; survival |
| g3u12.w.mudslide | mudslide | wet earth that moves quickly down a hill or mountain. | After three days of rain, a brown ___ of wet earth came down the hill and covered the road. | mudslide (full) ; mudslides (partial) | mudslide (full) ; a mudslide (full) | avalanche ; drought ; earthquake |
| g3u12.w.parcel | parcel | a box you bring to a friend. | He put the unopened ___ next to him. | parcel (full) ; parcels (partial) | parcel (full) ; a parcel (full) | flame ; shelter ; raft |
| g3u12.w.pleasure | pleasure (no pl) | a happy feeling when you like a thing. | It's a ___ to be here. | pleasure (full) | pleasure (full) ; a pleasure (full) | damage ; pressure ; survival |
| g3u12.w.pressure | pressure | the strong push of a thing. | The gas inside a volcano creates a lot of ___. | pressure (full) | pressure (full) | damage ; research ; joy |
| g3u12.w.raft | raft | a flat thing made from wood for going on the sea. | Chuck built a ___ to escape the island. | raft (full) ; rafts (partial) | raft (full) ; a raft (full) | shelter ; flame ; parcel |
| g3u12.w.region | region | a big piece of land. | This ___ of Austria is famous for its high mountains and beautiful lakes. | region (full) ; regions (partial) | region (full) ; a region (full) | border ; surface ; shelter |
| g3u12.w.research | research | the study of a thing to find out the truth. | A lot of money is spent on the ___ of avalanches. | research (full) | research (full) | damage ; pressure ; survival |
| g3u12.w.shelter | shelter | a safe place to stay, away from bad weather. | He built himself a ___ from the rain. | shelter (full) ; shelters (partial) | shelter (full) ; a shelter (full) | flame ; raft ; border |
| g3u12.w.smoke-detector | smoke detector | a small thing on the wall that makes a noise when there is a fire. | Every bedroom needs a ___ that makes a noise when there is smoke in the room. | smoke detector (full) ; smoke detectors (partial) | smoke detector (full) ; a smoke detector (full) | escape route ; meeting place ; fire drill |
| g3u12.w.surface | surface | the outside of a thing. | There's a pool of hot rock under the ___ of the Earth. | surface (full) ; surfaces (partial) | surface (full) ; the surface (full) | bottom ; border ; shelter |
| g3u12.w.survival | survival | staying alive in a dangerous situation. | We are looking for people with amazing ___ stories. | survival (full) | survival (full) | research ; damage ; pleasure |
| g3u12.w.to-be-trapped | to be trapped | when you cannot leave a place and cannot move away. | If you are ___ in an avalanche, nobody can find you. | trapped (full) ; be trapped (partial) | be trapped (full) ; to be trapped (full) ; trapped (full) | free ; alone ; strong |
| g3u12.w.to-check-doors | to check doors | to feel if they are hot before you open them in a fire. | In a fire you must ___ first because they could be very hot to open. | check doors (full) ; check the doors (full) | check doors (full) ; to check doors (full) ; check the doors (full) | crawl low ; fall down ; turn into |
| g3u12.w.to-collapse | to collapse | to break and drop down all at once. | The house could ___ during an earthquake. | collapse (full) ; to collapse (partial) | collapse (full) ; to collapse (full) | evacuate ; deliver ; measure |
| g3u12.w.to-crawl-low | to crawl low | to move along on your knees near the ground. | If there is thick smoke in a room, you must ___ to stay under it. | crawl low (full) | crawl low (full) ; to crawl low (full) | check doors ; fall down ; turn into |
| g3u12.w.to-deliver | to deliver | to bring a thing to a house or a place. | He still hoped to ___ the parcels unopened one day. | deliver (full) ; to deliver (partial) | deliver (full) ; to deliver (full) | measure ; evacuate ; realise |
| g3u12.w.to-evacuate | to evacuate | to move people away from a place that is in danger. | The police had to ___ all the people from the burning building very fast. | evacuate (full) ; to evacuate (partial) | evacuate (full) ; to evacuate (full) | measure ; deliver ; realise |
| g3u12.w.to-fall-down | to fall down | to drop down to the ground. | A few trees ___ because of the earthquake. | fell down (full) ; fall down (partial) | fall down (full) ; to fall down (full) | keep away from ; turn into ; get used to |
| g3u12.w.to-get-used-to | to get used to | to begin to like a new thing after some time. | After many years went by, Chuck ___ the island. | got used to (full) ; get used to (partial) | get used to (full) ; to get used to (full) | turn into ; fall down ; keep away from |
| g3u12.w.to-keep-away-from | to keep away from | to not go near a thing that is dangerous. | ___ heavy furniture that might fall over. | Keep away from (full) ; keep away from (full) | keep away from (full) ; to keep away from (full) | fall down ; turn into ; get used to |
| g3u12.w.to-measure | to measure | to find how big or heavy a thing is. | The earthquake ___ 7.0 on the Richter scale. | measured (full) ; measure (partial) | measure (full) ; to measure (full) | evacuate ; deliver ; realise |
| g3u12.w.to-realise | to realise | to suddenly understand a thing. | I ___ it was serious when I saw people running away. | realised (full) ; realized (partial) ; realise (partial) | realise (full) ; to realise (full) ; realize (partial) | measure ; evacuate ; deliver |
| g3u12.w.to-stop-drop-roll | to stop, drop & roll | what to do if your clothes catch fire so the flames go out. | If your clothes catch fire, you must ___ on the ground to put out the flames. | stop, drop and roll (full) ; stop, drop & roll (full) ; stop drop and roll (full) | stop, drop and roll (full) ; stop, drop & roll (full) | check doors ; crawl low ; fall down |
| g3u12.w.to-turn-into | to turn into | to become a completely new thing. | The rainfall quickly ___ heavy snowfall. | turned into (full) ; turn into (partial) | turn into (full) ; to turn into (full) | fall down ; get used to ; keep away from |
| g3u12.w.tsunami | tsunami | a very big sea wave after an earthquake under the sea. | A big ___ came in from the sea and flooded the towns near the coast. | tsunami (full) ; tsunamis (partial) | tsunami (full) ; a tsunami (full) | drought ; earthquake ; hurricane |
| g3u12.w.underneath | underneath | below a thing, in a place that is not high. | I just got ___ the kitchen table. | underneath (full) | underneath (full) | undersea ; violent ; behind |
| g3u12.w.undersea | undersea | below the outside of the sea. | There are also ___ volcanoes that can erupt. | undersea (full) | undersea (full) | violent ; underneath ; border |
| g3u12.w.violent | violent | wild and very dangerous to people. | Droughts have led to ___ conflicts in the regions. | violent (full) | violent (full) | undersea ; underneath ; famous |
| g3u12.w.volcanic-eruption | volcanic eruption | when hot rock and ash come out of a mountain. | The huge ___ covered the whole town in a thick grey layer of hot ash. | volcanic eruption (full) ; volcanic eruptions (partial) | volcanic eruption (full) ; a volcanic eruption (full) | flood ; earthquake ; drought |

## Grammar items (29)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g3u12.gi.passive-voice.cp.001 | context-picker | Du liest einen Faktentext über deine Stadt. Welcher Satz passt zum Stil eines Faktentexts? [de] | The bridge was built in 1820. (full) | — | The bridge is build in 1820. ; The bridge were built in 1820. ; The bridge built in 1820. | — | — | false |
| g3u12.gi.passive-voice.ec.001 | error-correction | Finde und verbessere den Fehler: The city destroyed by an earthquake. [de] | The city was destroyed by an earthquake. (full) ; was destroyed (partial) | — | — | — | — | true |
| g3u12.gi.passive-voice.ec.002 | error-correction | Finde und verbessere den Fehler: The shelter was build in one day. [de] | The shelter was built in one day. (full) ; was built (partial) | — | — | — | — | true |
| g3u12.gi.passive-voice.ec.003 | error-correction | Finde und verbessere den Fehler: The buildings was damaged by the flood. [de] | The buildings were damaged by the flood. (full) ; were damaged (partial) | — | — | — | — | true |
| g3u12.gi.passive-voice.ec.004 | error-correction | Finde und verbessere den Fehler: Haiti was hit from a terrible earthquake. [de] | Haiti was hit by a terrible earthquake. (full) ; by (partial) | — | — | — | — | true |
| g3u12.gi.passive-voice.ec.005 | error-correction | Finde und verbessere den Fehler: These songs is listened to by millions of people. [de] | These songs are listened to by millions of people. (full) ; are listened (partial) | — | — | — | — | true |
| g3u12.gi.passive-voice.gf.001 | gap-fill | Many homes ___ (destroy) in the flood. [en, 1 blank(s)] | were destroyed (full) | — | — | — | — | false |
| g3u12.gi.passive-voice.gf.002 | gap-fill | Eight people ___ (injure) in the avalanche. [en, 1 blank(s)] | were injured (full) | — | — | — | — | false |
| g3u12.gi.passive-voice.gf.003 | gap-fill | The ski lift ___ (damage) by the avalanche. [en, 1 blank(s)] | was damaged (full) | — | — | — | — | false |
| g3u12.gi.passive-voice.gf.004 | gap-fill | Hundreds of people ___ (rescue) and ___ (evacuate) by air. [en, 2 blank(s)] | were rescued \| were evacuated (full) | — | — | — | — | false |
| g3u12.gi.passive-voice.gf.005 | gap-fill | The smoke detector ___ (check) every week, and the batteries ___ (change) every year. [en, 2 blank(s)] | is checked \| are changed (full) | — | — | — | — | false |
| g3u12.gi.passive-voice.gf.006 | gap-fill | Today the village ___ (hit) by a mudslide, and the road ___ (block). [en, 2 blank(s)] | is hit \| is blocked (full) | — | — | — | — | false |
| g3u12.gi.passive-voice.gf.007 | gap-fill | In the forest fire last summer, 40 homes ___ (destroy). Now new houses ___ (build) there every year. [en, 2 blank(s)] | were destroyed \| are built (full) | — | — | — | — | false |
| g3u12.gi.passive-voice.gf.008 | gap-fill | Coffee ___ (grow) in Brazil, but these cars ___ (make) in Germany. [en, 2 blank(s)] | is grown \| are made (full) | — | — | — | — | false |
| g3u12.gi.passive-voice.gs.002 | group-sort | Sortiere die Sätze: richtig (✓) oder falsch (✗) gebaut? [de] | — | — | — | — | ✓: The homes were destroyed by the flood., English is spoken in many countries., The town was hit by a hurricane. \| ✗: The homes was destroyed by the flood., English is speak in many countries., The town hit by a hurricane. | false |
| g3u12.gi.passive-voice.mc.003 | multiple-choice | Welche Form passt? 'Smoke from the fires ___ in many countries.' [de, 1 blank(s)] | was seen (full) | — | were seen ; was see ; is seen | — | — | false |
| g3u12.gi.passive-voice.mc.005 | multiple-choice | In welchem Satz steht be + die 3. Form? [de] | The town was hit by a flood. (full) | — | A flood hit the town. ; The flood was very dangerous. ; People left the town quickly. | — | — | false |
| g3u12.gi.passive-voice.mc.006 | multiple-choice | Welcher Satz mit be + der 3. Form ist richtig für einen Faktentext über Vulkane? [de] | Huge rocks are thrown into the sky. (full) | — | Huge rocks is thrown into the sky. ; Huge rocks are throw into the sky. ; Huge rocks thrown into the sky. | — | — | false |
| g3u12.gi.passive-voice.mc.007 | multiple-choice | Welcher Satz ist richtig — was/were + die 3. Form? [de] | The houses were destroyed by the earthquake. (full) | — | The houses was destroyed by the earthquake. ; The houses were destroy by the earthquake. ; The houses destroyed by the earthquake. | — | — | false |
| g3u12.gi.passive-voice.mt.002 | matching | Verbinde jeden Satz mit dem passenden Satz mit be + der 3. Form. [de] | — | — | — | An earthquake destroyed the city. ↔ The city was destroyed by an earthquake. ; A flood hit the town. ↔ The town was hit by a flood. ; People speak English here. ↔ English is spoken here. ; They evacuate the village every year. ↔ The village is evacuated every year. | — | false |
| g3u12.gi.passive-voice.qf.003 | question-formation | Bilde eine Ja/Nein-Frage zu diesem Satz: 'The town was evacuated.' [de] | Was the town evacuated? (full) | — | — | — | — | false |
| g3u12.gi.passive-voice.qf.004 | question-formation | Bilde eine Wann-Frage zu diesem Satz: 'The school was built in 1965.' (frage nach dem Jahr) [de] | When was the school built? (full) | — | — | — | — | false |
| g3u12.gi.passive-voice.sb.001 | sentence-building | the / village / was / by / a / mudslide / hit [en] | The village was hit by a mudslide. (full) | — | — | — | — | false |
| g3u12.gi.passive-voice.sb.002 | sentence-building | were / all / the / shops / closed / day / for / the [en] | All the shops were closed for the day. (full) | — | — | — | — | false |
| g3u12.gi.passive-voice.tf.007 | transformation | Schreib den Satz mit be + der 3. Form um: 'They clean the escape route every morning.' → The escape route ___. [de, 1 blank(s)] | is cleaned every morning (full) | — | — | — | — | false |
| g3u12.gi.passive-voice.tf.008 | transformation | Schreib den Satz mit be + der 3. Form um: 'A hurricane destroyed the village.' → The village ___. [de, 1 blank(s)] | was destroyed by a hurricane (full) | — | — | — | — | false |
| g3u12.gi.passive-voice.tf.009 | transformation | Schreib beide Sätze mit be + der 3. Form um: 'People speak English in many countries. They built the school in 1965.' → English ___. The school ___. [de, 2 blank(s)] | is spoken in many countries \| was built in 1965 (full) | — | — | — | — | false |
| g3u12.gi.passive-voice.tr.001 | translation | Übersetze ins Englische: 'Hunderte Menschen wurden gerettet.' [de] | Hundreds of people were rescued. (full) ; Hundreds of people were saved. (partial) | deToEn | — | — | — | false |
| g3u12.gi.passive-voice.tr.002 | translation | Übersetze ins Englische: 'Die Stadt wurde durch ein Erdbeben zerstört.' [de] | The city was destroyed by an earthquake. (full) ; The town was destroyed by an earthquake. (partial) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g3-u12/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g3-u12",
  "lens": "answers",
  "itemsHash": "ecaadbc4ea55",
  "promptHash": "70fa2d8cdf22",
  "round": 2,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 79, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
