# Verify lens — answers — g2-u05 (round 2)

<!-- domigo:verify answers g2-u05 items=3621d84f92f0 prompt=70fa2d8cdf22 round=2 -->

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
| g2u05.w.airport | airport | A place where planes go up into the sky and land again. | We have to be at the ___ very early to catch our plane. | airport (full) ; airports (partial) | airport (full) ; airports (full) | railway station ; bus stop ; supermarket |
| g2u05.w.as-far-as | as far as | Right up to a place, and not past it. | Cross the street and go ___ the cinema. The bank is right beside it. | as far as (full) | as far as (full) | as soon as ; next to ; opposite |
| g2u05.w.bank | bank | A place where you can keep your money. | I don't have any money left. I need a ___. | bank (full) ; banks (partial) | bank (full) ; banks (full) | post office ; supermarket ; tourist office |
| g2u05.w.bus-stop | bus stop | A place on the road where people wait to travel into town. | I waited a long time at the ___. | bus stop (full) ; bus stops (partial) | bus stop (full) ; bus stops (full) | railway station ; airport ; market square |
| g2u05.w.chemist-s | chemist's | A place that sells medicine for when you have a cold. | I've got a cold. Can you go to the ___ for me? | chemist's (full) ; chemist (partial) ; pharmacy (partial) | chemist's (full) ; chemist (partial) ; pharmacy (partial) | hospital ; supermarket ; post office |
| g2u05.w.church | church | A building with a tall tower and a cross. | He's going to the ___ on the corner. It has a tall tower with a cross. | church (full) ; churches (partial) | church (full) ; churches (full) | bank ; restaurant ; supermarket |
| g2u05.w.cinema | cinema | A place where you watch a new film on a big screen. | I want to watch the latest film. Let's go to the ___. | cinema (full) ; cinemas (partial) | cinema (full) ; cinemas (full) | restaurant ; church ; supermarket |
| g2u05.w.comment | comment | What you write under a posting to show what you think. | I read a nice ___ on Mickey's Place. | comment (full) ; comments (partial) | comment (full) ; comments (full) | review ; feedback ; guest |
| g2u05.w.feedback | feedback | When people tell you what they think about your work. | Tell me what you think about my project. I want your ___. | feedback (full) | feedback (full) | comment ; review ; opening |
| g2u05.w.fountain | fountain | Water that jumps up high in an open place in a town. | There's a big ___ at market square. | fountain (full) ; fountains (partial) | fountain (full) ; fountains (full) | bus stop ; market square ; guest |
| g2u05.w.guest | guest | A friend or family that you ask to come to dinner. | She invited ten ___ to dinner. | guests (full) ; guest (partial) | guest (full) ; guests (full) | comment ; fountain ; review |
| g2u05.w.hospital | hospital | A place where doctors help you when you are sick or hurt. | When you are very sick, the ambulance drives you to the ___. | hospital (full) ; hospitals (partial) | hospital (full) ; hospitals (full) | chemist's ; supermarket ; police station |
| g2u05.w.map | map | A picture that shows you where places are in a town. | We used a ___ to find the hotel. | map (full) ; maps (partial) | map (full) ; maps (full) | comment ; review ; feedback |
| g2u05.w.market-square | market square | An open place in a town where people sell food. | There is a big market on ___ every Saturday. | market square (full) ; the market square (partial) ; market squares (partial) | market square (full) ; market squares (full) | bus stop ; airport ; music shop |
| g2u05.w.most-of-the-time | most of the time | On most days, but not every day. | In summer it is sunny ___. | most of the time (full) | most of the time (full) | next to ; as far as ; round the corner |
| g2u05.w.music-shop | music shop | A place where you can find a guitar or a keyboard to play. | I want a new guitar. Let's go to the ___. | music shop (full) ; music shops (partial) | music shop (full) ; music shops (full) | supermarket ; chemist's ; post office |
| g2u05.w.next-to | next to | Right beside it, very close to it. | Go past the bank. The post office is ___ it. | next to (full) | next to (full) | opposite ; behind ; in front of |
| g2u05.w.opening | opening | When a new place opens for the first time. | There is a big ___ of a new restaurant today! | opening (full) ; openings (partial) | opening (full) ; openings (full) | review ; comment ; feedback |
| g2u05.w.opposite | opposite | Right across the road from it, looking at it. | The restaurant is ___ the church, across the road. | opposite (full) | opposite (full) | next to ; behind ; in front of |
| g2u05.w.pocket | pocket | A small place in your clothes for your money or your pen. | He keeps his money in his jacket ___. | pocket (full) ; pockets (full) | pocket (full) ; pockets (full) | map ; fountain ; guest |
| g2u05.w.police-station | police station | A building where you go to tell about a crime. | Help! A robber! Where is the nearest ___? | police station (full) ; police stations (partial) | police station (full) ; police stations (full) | post office ; hospital ; supermarket |
| g2u05.w.politely | politely | When you ask with a please and a thank you. | She asks ___, with a please and a thank you. | politely (full) | politely (full) | simply ; somewhere ; slow |
| g2u05.w.positive | positive | Good and nice, the opposite of bad. | Write a ___ comment about the new book and tell people it is good. | positive (full) | positive (full) | slow ; simply ; the worst |
| g2u05.w.post-office | post office | A place where you go when you want to send a letter. | I need some stamps. Is there a ___ near here? | post office (full) ; post offices (partial) | post office (full) ; post offices (full) | police station ; bank ; tourist office |
| g2u05.w.railway-station | railway station | A place where you wait for your train. | I don't have a car. Let's go to the ___ and catch the train to York. | railway station (full) ; railway stations (partial) ; train station (partial) ; station (partial) | railway station (full) ; railway stations (full) ; train station (partial) | bus stop ; airport ; supermarket |
| g2u05.w.restaurant | restaurant | A place where you eat your dinner and a waiter brings it to you. | I don't want to cook today. Let's go to the ___. | restaurant (full) ; restaurants (partial) | restaurant (full) ; restaurants (full) | bank ; church ; hospital |
| g2u05.w.review | review | When you write what you think about a book or a place. | Read a ___ of the new book before you read it. | review (full) ; reviews (partial) | review (full) ; reviews (full) | comment ; feedback ; opening |
| g2u05.w.round-the-corner | round the corner | Very near, just past the place where two streets meet. | The bank is just ___, very near the post office. | round the corner (full) ; around the corner (partial) | round the corner (full) ; around the corner (partial) | next to ; opposite ; as far as |
| g2u05.w.second | second | Right after the first one. | Don't turn into the first street. Go to the ___ one, just after the bank. | second (full) | second (full) | first ; third ; next to |
| g2u05.w.simply | simply | When you can do it with no problem. | Don't worry. ___ go straight on and you are there. | Simply (full) ; simply (full) | simply (full) | politely ; somewhere ; slow |
| g2u05.w.slow | slow | Not fast; a long time to go from here to there. | A tortoise is very ___. | slow (full) ; slower (partial) ; slowest (partial) | slow (full) | fast ; positive ; cold |
| g2u05.w.somewhere | somewhere | In a place, but you cannot point to it. | I left my pencil case ___ in school, but I cannot find it. | somewhere (full) | somewhere (full) | simply ; politely ; slow |
| g2u05.w.supermarket | supermarket | A big place where you can buy your food. | We don't have any food. Please go to the ___. | supermarket (full) ; supermarkets (partial) | supermarket (full) ; supermarkets (full) | bank ; church ; police station |
| g2u05.w.the-worst | the worst | The most bad; the opposite of the best. | Of all the pizzas in town, that one was ___. I really hated it. | the worst (full) ; worst (partial) | the worst (full) ; worst (full) | the best ; positive ; slow |
| g2u05.w.to-bother | to bother | To talk to somebody when they have no time for you. | I'm sorry to ___ you, but can you help me find the railway station? | bother (full) ; bothers (partial) ; bothered (partial) | bother (full) ; to bother (full) ; bothers (full) ; bothered (full) | interrupt ; offer ; comment |
| g2u05.w.to-change-trains | to change trains | To get off one and get on a new one at the railway station. | We have to ___ at Waterloo Station. | change trains (full) ; changes trains (partial) ; changed trains (partial) | change trains (full) ; to change trains (full) | cross the street ; go past ; turn left |
| g2u05.w.to-comment | to comment | To write under a posting to show what you think about it. | You can ___ on the postings and write what you think. | comment (full) ; comments (partial) ; commented (partial) | comment (full) ; to comment (full) ; comments (full) ; commented (full) | offer ; interrupt ; bother |
| g2u05.w.to-cross | to cross | To go over a street or a river. | We have to ___ the street. The supermarket is over there. | cross (full) ; crosses (partial) ; crossed (partial) | cross (full) ; to cross (full) ; crosses (full) ; crossed (full) | turn ; offer ; interrupt |
| g2u05.w.to-cross-the-street | to cross the street | To go over the road on foot. | Look left and right before you ___. | cross the street (full) ; crosses the street (partial) ; crossed the street (partial) | cross the street (full) ; to cross the street (full) ; crosses the street (full) ; crossed the street (full) | go past ; turn left ; go straight on |
| g2u05.w.to-go-past | to go past | To come up to a place and keep going, not in. | Go straight ahead. ___ the supermarket and then turn left. | Go past (full) ; go past (full) ; Goes past (partial) ; Went past (partial) | go past (full) ; to go past (full) ; goes past (partial) ; went past (partial) | turn left ; cross the street ; go straight on |
| g2u05.w.to-go-straight-ahead | to go straight ahead | To go on and not turn left or right. | Don't turn here. ___ to the traffic lights. | Go straight ahead (full) ; go straight ahead (full) ; Go straight on (partial) | go straight ahead (full) ; to go straight ahead (full) ; go straight on (partial) | turn left ; go past ; cross the street |
| g2u05.w.to-go-straight-on | to go straight on | To keep going on and not turn left or right. | Don't turn here. ___, then turn left. | Go straight on (full) ; go straight on (full) ; Go straight ahead (partial) | go straight on (full) ; to go straight on (full) ; go straight ahead (partial) | turn left ; go past ; cross the street |
| g2u05.w.to-interrupt | to interrupt | To begin talking when somebody is still talking. | Please don't ___ me. I want to talk first. | interrupt (full) ; interrupts (partial) ; interrupted (partial) | interrupt (full) ; to interrupt (full) ; interrupts (full) ; interrupted (full) | bother ; offer ; comment |
| g2u05.w.to-offer | to offer | To tell somebody that you want to give them a thing. | We ___ you three nights for the price of two. | offer (full) ; offers (partial) ; offered (partial) | offer (full) ; to offer (full) ; offers (full) ; offered (full) | bother ; interrupt ; cross |
| g2u05.w.to-take-the-second-right | to take the second right | The road after the first one, not the one on your left. | Go past that bus stop and ___. Then go straight ahead. | take the second right (full) ; takes the second right (partial) ; took the second right (partial) | take the second right (full) ; to take the second right (full) | turn left ; go past ; cross the street |
| g2u05.w.to-turn-left | to turn left | At a corner, do not go straight on or to the right. | Go straight ahead and ___ at the traffic lights. The station is at the end of the road. | turn left (full) ; turns left (partial) ; turned left (partial) | turn left (full) ; to turn left (full) ; turns left (full) ; turned left (full) | go past ; cross the street ; take the second right |
| g2u05.w.tourist-office | tourist office | A place where you can ask for a map and find out about a town. | We want a map of this town. Let's ask at the ___. | tourist office (full) ; tourist offices (partial) ; tourist information (partial) | tourist office (full) ; tourist offices (full) | post office ; police station ; supermarket |
| g2u05.w.traffic-lights | traffic lights | The red and green thing at a corner: red for wait, green for go. | Turn left at the ___ and then go straight ahead. | traffic lights (full) ; traffic light (partial) | traffic lights (full) ; traffic light (partial) | bus stop ; fountain ; market square |
| g2u05.w.underground | underground | A fast train that runs under a big city. | In London the ___ runs under the city. | underground (full) | underground (full) | airport ; bus stop ; market square |

## Grammar items (26)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g2u05.gi.prepositions-directions.cp.001 | context-picker | The bank is across the street from the supermarket. [en] | The bank is opposite the supermarket. (full) | — | The bank is opposite of the supermarket. ; The bank is opposite to the supermarket. ; The bank is behind of the supermarket. | — | — | false |
| g2u05.gi.prepositions-directions.cp.002 | context-picker | You are at the bus stop. The railway station is straight on, after the second corner on the right. [en] | Go straight ahead and take the second right. (full) | — | Go straight ahead and turn on the second right. ; Go straight ahead and turn to the second right. ; Go straight ahead and turn in the second right. | — | — | false |
| g2u05.gi.prepositions-directions.ec.001 | error-correction | The hospital is opposite of the church. [en] | The hospital is opposite the church. (full) ; opposite the church (partial) ; opposite (partial) | — | — | — | — | false |
| g2u05.gi.prepositions-directions.ec.002 | error-correction | Turn to the left at the church. [en] | Turn left at the church. (full) ; Turn left (partial) | — | — | — | — | false |
| g2u05.gi.prepositions-directions.ec.003 | error-correction | The post office is behind of the bank. [en] | The post office is behind the bank. (full) ; behind the bank (partial) | — | — | — | — | false |
| g2u05.gi.prepositions-directions.ec.004 | error-correction | Go past the church and turn on the right. [en] | Go past the church and turn right. (full) ; turn right (partial) | — | — | — | — | false |
| g2u05.gi.prepositions-directions.gf.001 | gap-fill | The post office is ___ the bank. They are very close. [en, 1 blank(s)] | beside (full) ; next to (full) | — | round the corner ; opposite ; over | — | — | false |
| g2u05.gi.prepositions-directions.gf.002 | gap-fill | The restaurant is ___ the church. It is across the street. [en, 1 blank(s)] | opposite (full) | — | behind ; beside ; round the corner | — | — | false |
| g2u05.gi.prepositions-directions.gf.003 | gap-fill | The cinema is ___ the music shop. Go past the music shop to find it. [en, 1 blank(s)] | behind (full) | — | opposite ; beside ; in front of | — | — | false |
| g2u05.gi.prepositions-directions.gf.004 | gap-fill | Don't turn here. Go ___ ahead and then turn right at the traffic lights. [en, 1 blank(s)] | straight (full) | — | left ; right ; past | — | — | false |
| g2u05.gi.prepositions-directions.gf.005 | gap-fill | Turn ___ at the church and the hospital is on your right. [en, 1 blank(s)] | left (full) | — | to left ; in the left ; on left | — | — | false |
| g2u05.gi.prepositions-directions.gf.006 | gap-fill | Go ___ the post office and the bank is on your right. [en, 1 blank(s)] | past (full) | — | over ; to ; behind | — | — | false |
| g2u05.gi.prepositions-directions.gf.007 | gap-fill | You can't find the bank from here. It is just ___, beside the supermarket. [en, 1 blank(s)] | round the corner (full) | — | in front of ; next to ; on the corner of | — | — | false |
| g2u05.gi.prepositions-directions.gf.008 | gap-fill | There's a park ___ you. Go straight ahead and the cinema is on the right. [en, 1 blank(s)] | in front of (full) | — | behind ; opposite ; beside | — | — | false |
| g2u05.gi.prepositions-directions.gf.009 | gap-fill | Go to the end of the road. There's a big bank ___ George Street. [en, 1 blank(s)] | on the corner of (full) | — | in the corner of ; to the corner of ; round the corner | — | — | false |
| g2u05.gi.prepositions-directions.gs.002 | group-sort | go straight ahead / turn left / opposite / behind [en] | — | — | — | — | How to go there: go straight ahead, turn left, go past, cross the street, take the second right \| Saying where it is: opposite, behind, next to, round the corner, in front of | false |
| g2u05.gi.prepositions-directions.mc.001 | multiple-choice | The cinema is across the street from the restaurant. [en] | The cinema is opposite the restaurant. (full) | — | The cinema is opposite of the restaurant. ; The cinema is opposite to the restaurant. ; The cinema is opposite from the restaurant. | — | — | false |
| g2u05.gi.prepositions-directions.mc.002 | multiple-choice | You want to go to the church. The traffic lights are in front of you. [en] | Turn left at the traffic lights. (full) | — | Turn to the left at the traffic lights. ; Turn in the left at the traffic lights. ; Turn on the left at the traffic lights. | — | — | false |
| g2u05.gi.prepositions-directions.mc.003 | multiple-choice | directions to the railway station [en] | Go straight ahead and turn right at the traffic lights. (full) | — | Go straight ahead and turn to the right at the traffic lights. ; Go straight ahead and turn in the right at the traffic lights. ; Go straight ahead and turn on the right at the traffic lights. | — | — | false |
| g2u05.gi.prepositions-directions.mt.001 | matching | places and where they are [en] | — | — | — | Where's the post office? ↔ It's next to the bank. ; Where's the cinema? ↔ It's opposite the restaurant. ; Where's the hospital? ↔ It's behind the church. ; Where's the bank? ↔ It's round the corner. ; Where's the tourist office? ↔ It's on the corner of the street. | — | false |
| g2u05.gi.prepositions-directions.qf.001 | question-formation | You are in town. You want to go to the railway station. Ask politely. [en] | Excuse me, where's the railway station? (full) ; Excuse me, where is the railway station? (full) ; Excuse me, can you tell me where the railway station is? (full) ; Where's the railway station? (partial) | — | — | — | — | false |
| g2u05.gi.prepositions-directions.sb.001 | sentence-building | traffic lights / the / turn / at / left [en] | Turn left at the traffic lights. (full) ; Turn left at the traffic lights (full) | — | to ; on | — | — | false |
| g2u05.gi.prepositions-directions.sb.002 | sentence-building | opposite / the / cinema / is / the / restaurant [en] | The cinema is opposite the restaurant. (full) ; The cinema is opposite the restaurant (full) | — | of ; to | — | — | false |
| g2u05.gi.prepositions-directions.sb.003 | sentence-building | the / past / go / and / turn / left / supermarket [en] | Go past the supermarket and turn left. (full) ; Go past the supermarket and turn left (full) | — | to ; on | — | — | false |
| g2u05.gi.prepositions-directions.tr.001 | translation | Das Restaurant ist gegenüber der Kirche. [de] | The restaurant is opposite the church. (full) ; The restaurant is opposite the church (full) ; The restaurant is across from the church. (partial) | deToEn | — | — | — | false |
| g2u05.gi.prepositions-directions.tr.002 | translation | Geh geradeaus und biege dann rechts ab. [de] | Go straight ahead and then turn right. (full) ; Go straight ahead and then turn right (full) ; Go straight on and then turn right. (full) ; Go straight and then turn right. (partial) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g2-u05/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u05",
  "lens": "answers",
  "itemsHash": "3621d84f92f0",
  "promptHash": "70fa2d8cdf22",
  "round": 2,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 75, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
