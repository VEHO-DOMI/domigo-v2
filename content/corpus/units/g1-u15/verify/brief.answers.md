# Verify lens — answers — g1-u15 (round 2)

<!-- domigo:verify answers g1-u15 items=5a2e302029f4 prompt=70fa2d8cdf22 round=2 -->

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

## Vocab items (23)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g1u15.w.aunt | aunt | the sister of your mum or dad. | My ___ Jane is my mum's sister and she lives in New York. | aunt (full) | aunt (full) ; aunty (partial) | cook ; parents ; hippo |
| g1u15.w.beach | beach | the place next to the sea where you can play and swim. | Let's go to the ___ and swim in the sea. | beach (full) | beach (full) | campsite ; national park ; plane |
| g1u15.w.board-game | board game | something like Monopoly that you sit and do at the table with small pieces. | In the evening, we're going to play a ___ like Monopoly. | board game (full) | board game (full) | plane ; beach ; campsite |
| g1u15.w.campsite | campsite | a place where people sleep in tents. | We're going to stay at a ___ and sleep in a tent. | campsite (full) | campsite (full) | beach ; national park ; plane |
| g1u15.w.cook | cook | somebody who can make good food in the kitchen. | My grandma is a very good ___ . I love her food. | cook (full) | cook (full) | aunt ; parents ; hippo |
| g1u15.w.hippo | hippo | a very big grey animal that lives in the river. | At the zoo there is a big grey ___ in the water. | hippo (full) ; hippos (partial) | hippo (full) | cook ; aunt ; parents |
| g1u15.w.holiday | holiday | a time when you do not go to school and you can have a lot of fun. | Where are you going for your summer ___ this year? | holiday (full) ; holidays (partial) | holiday (full) ; holidays (partial) | summer ; beach ; national park |
| g1u15.w.national-park | national park | a very big place in nature where wild animals can live free. | In the United States we are going to visit a ___ . | national park (full) | national park (full) | beach ; campsite ; plane |
| g1u15.w.parents | parents | your mum and your dad. | My ___ and I are going to fly to the United States. | parents (full) | parents (full) | aunt ; cook ; hippo |
| g1u15.w.plane | plane | you sit in it and it flies up in the sky to a far country. | I'm not scared of flying. I can sleep on the ___ . | plane (full) | plane (full) | beach ; campsite ; national park |
| g1u15.w.summer | summer | the hot time of the year with the long school holiday. | In the ___ , I'm going to swim every day. | summer (full) | summer (full) | holiday ; beach ; plane |
| g1u15.w.to-drive | to drive | to take people to a place in a car. | My dad is going to ___ us to the lake in our car. | drive (full) ; to drive (partial) | to drive (full) ; drive (full) | to fly to ; to join ; to invite |
| g1u15.w.to-fly-to | to fly to | to go to a far country, up in the sky. | This summer we are going to ___ Croatia and stay there for two weeks. | fly to (full) ; to fly to (partial) | to fly to (full) ; fly to (full) | to drive ; to swim in the sea ; to go fishing |
| g1u15.w.to-go-fishing | to go fishing | You sit near the water and try to catch your dinner. | On Saturday I'm going to ___ at the lake with my uncle. | go fishing (full) ; to go fishing (partial) | to go fishing (full) ; go fishing (full) | to swim in the sea ; to play badminton ; to fly to |
| g1u15.w.to-invite | to invite | to ask a friend to come and do something nice with you. | Who are you going to ___ to your birthday party? | invite (full) ; to invite (partial) | to invite (full) ; invite (full) | to join ; to drive ; to visit a castle |
| g1u15.w.to-join | to join | to go into a group and do something nice with them. | Let's ___ the music group at school. | join (full) ; to join (partial) | to join (full) ; join (full) | to invite ; to drive ; to fly to |
| g1u15.w.to-lie-in-the-sun | to lie in the sun | to be outside when it is hot and sunny, and do nothing. | What are you going to do? I'm going to ___ in the garden. | lie in the sun (full) ; to lie in the sun (partial) | to lie in the sun (full) ; lie in the sun (full) | to go fishing ; to play badminton ; to write a postcard |
| g1u15.w.to-play-badminton | to play badminton | a game over a tall net, with a small, light ball. | In Croatia my friends and I are going to ___ in the garden. | play badminton (full) ; to play badminton (partial) | to play badminton (full) ; play badminton (full) | to play board games ; to go fishing ; to swim in the sea |
| g1u15.w.to-play-board-games | to play board games | to sit at the table and have fun with something like Monopoly. | In the evening, we are going to ___ like Monopoly. | play board games (full) ; to play board games (partial) | to play board games (full) ; play board games (full) | to play badminton ; to swim in the sea ; to go fishing |
| g1u15.w.to-stay-at-a-campsite | to stay at a campsite | to sleep at a place where you put up a tent. | We are going to ___ near the lake and sleep in our tent. | stay at a campsite (full) ; to stay at a campsite (partial) | to stay at a campsite (full) ; stay at a campsite (full) | to fly to ; to visit a castle ; to go fishing |
| g1u15.w.to-swim-in-the-sea | to swim in the sea | to play in the big water at the beach when it is hot. | When we are hot, we are going to ___ at the beach. | swim in the sea (full) ; to swim in the sea (partial) | to swim in the sea (full) ; swim in the sea (full) | to go fishing ; to lie in the sun ; to play board games |
| g1u15.w.to-visit-a-castle | to visit a castle | to go and see a very big, old building with tall stone walls. | On holiday we are going to ___ in the mountains. | visit a castle (full) ; to visit a castle (partial) | to visit a castle (full) ; visit a castle (full) | to go fishing ; to play badminton ; to swim in the sea |
| g1u15.w.to-write-a-postcard | to write a postcard | a short holiday message on a card with a picture, for your friends. | On holiday I'm going to ___ to all my friends. | write a postcard (full) ; to write a postcard (partial) ; write postcards (partial) | to write a postcard (full) ; write a postcard (full) | to play board games ; to lie in the sun ; to go fishing |

## Grammar items (35)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g1u15.gi.going-to.cp.001 | context-picker | Du erzählst von deinen Ferien. Welcher Satz ist richtig? [de] | I am going to lie in the sun. (full) | — | I going to lie in the sun. ; I am going to lying in the sun. ; I am go to lie in the sun. | — | — | false |
| g1u15.gi.going-to.cp.002 | context-picker | Deine Familie plant den Sommer. Welcher Satz ist richtig? [de] | We are going to stay at a campsite. (full) | — | We going to stay at a campsite. ; We are going to staying at a campsite. ; We are going stay at a campsite. | — | — | false |
| g1u15.gi.going-to.cp.003 | context-picker | Dein Freund fragt nach deinem Sommer. Welcher Satz ist richtig? [de] | I am going to play badminton. (full) | — | I am going to playing badminton. ; I going to play badminton. ; I am going to played badminton. | — | — | false |
| g1u15.gi.going-to.ec.003 | error-correction | Do you going to fly to the United States? [en] | Are you going to fly to the United States? (full) ; are (partial) | — | — | — | — | false |
| g1u15.gi.going-to.ec.006 | error-correction | I going to play football on the beach. [en] | I am going to play football on the beach. (full) ; I'm going to play football on the beach. (partial) ; am (partial) | — | — | — | — | false |
| g1u15.gi.going-to.ec.007 | error-correction | She is going to swimming in the sea. [en] | She is going to swim in the sea. (full) ; She's going to swim in the sea. (partial) ; swim (partial) | — | — | — | — | false |
| g1u15.gi.going-to.ec.008 | error-correction | They are going to visited a national park. [en] | They are going to visit a national park. (full) ; They're going to visit a national park. (partial) ; visit (partial) | — | — | — | — | false |
| g1u15.gi.going-to.ec.009 | error-correction | She are going to drive to the campsite. [en] | She is going to drive to the campsite. (full) ; She's going to drive to the campsite. (partial) ; is (partial) | — | — | — | — | false |
| g1u15.gi.going-to.gf.008 | gap-fill | ___ you ___ (be going to / lie) in the sun? [de, 2 blank(s)] | Are \| going to lie (full) | — | — | — | — | false |
| g1u15.gi.going-to.gf.009 | gap-fill | What ___ you ___ (be going to / do) in your holidays? [de, 2 blank(s)] | are \| going to do (full) | — | — | — | — | false |
| g1u15.gi.going-to.gf.010 | gap-fill | ___ they going to visit a castle? [de, 1 blank(s)] | Are (full) | — | — | — | — | false |
| g1u15.gi.going-to.gf.011 | gap-fill | Bilal ___ (be going to / fly) to Tunisia. [de, 1 blank(s)] | is going to fly (full) ; 's going to fly (partial) | — | — | — | — | false |
| g1u15.gi.going-to.gf.012 | gap-fill | We ___ (be going to / play) football on the beach. [de, 1 blank(s)] | are going to play (full) ; 're going to play (partial) | — | — | — | — | false |
| g1u15.gi.going-to.gf.013 | gap-fill | I ___ (be going to / write) postcards to my friends. [de, 1 blank(s)] | am going to write (full) ; 'm going to write (partial) | — | — | — | — | false |
| g1u15.gi.going-to.gf.014 | gap-fill | She ___ (be going to / show) us the city. [de, 1 blank(s)] | is going to show (full) ; 's going to show (partial) | — | — | — | — | false |
| g1u15.gi.going-to.gf.015 | gap-fill | They ___ (be going to / work) all summer. [de, 1 blank(s)] | are going to work (full) ; 're going to work (partial) | — | — | — | — | false |
| g1u15.gi.going-to.gf.016 | gap-fill | We ___ (not / be going to / stay) at home. [de, 1 blank(s)] | aren't going to stay (full) ; are not going to stay (full) ; 're not going to stay (partial) | — | — | — | — | true |
| g1u15.gi.going-to.gf.017 | gap-fill | He ___ (not / be going to / join) the band. [de, 1 blank(s)] | isn't going to join (full) ; is not going to join (full) ; 's not going to join (partial) | — | — | — | — | true |
| g1u15.gi.going-to.gs.001 | group-sort | Sortiere: richtig oder falsch geschrieben? [de] | — | — | — | — | ✓: I am going to swim., She is going to fly., We are going to play. \| ✗: I going to swim., She is going to flying., We are going to played. | false |
| g1u15.gi.going-to.mc.001 | multiple-choice | Welcher Satz ist richtig? [de] | They are going to visit a castle. (full) | — | They going to visit a castle. ; They are going to visiting a castle. ; They are going to visited a castle. | — | — | false |
| g1u15.gi.going-to.mc.002 | multiple-choice | Welche Frage ist richtig? [de] | Is she going to visit a national park? (full) | — | Does she going to visit a national park? ; She is going to visit a national park? ; Is she going to visiting a national park? | — | — | false |
| g1u15.gi.going-to.mc.004 | multiple-choice | Welcher Satz ist richtig? [de] | He is going to go fishing. (full) | — | He going to go fishing. ; He are going to go fishing. ; He is going to going fishing. | — | — | false |
| g1u15.gi.going-to.mc.005 | multiple-choice | Welcher Satz ist richtig? [de] | We are going to swim in the sea. (full) | — | We are going to swimming in the sea. ; We going to swim in the sea. ; We are going to swam in the sea. | — | — | false |
| g1u15.gi.going-to.mc.006 | multiple-choice | Welcher Satz ist richtig? [de] | I am not going to stay at home. (full) | — | I not going to stay at home. ; I am not going to staying at home. ; I am not going to stayed at home. | — | — | true |
| g1u15.gi.going-to.mp.001 | matching-pairs | Welche Kurzantwort passt zur Frage? [de] | — | — | — | Are you going to swim? ↔ Yes, I am. ; Is she going to drive? ↔ No, she isn't. ; Are they going to fish? ↔ Yes, they are. ; Is he going to cook? ↔ No, he isn't. | — | false |
| g1u15.gi.going-to.mt.001 | matching | Welche be-Form passt zu welchem Subjekt? [de] | — | — | — | I ↔ am going to ; she ↔ is going to ; they ↔ are going to | — | false |
| g1u15.gi.going-to.qf.001 | question-formation | She is going to visit a castle. → Stell eine Ja/Nein-Frage. [de] | Is she going to visit a castle? (full) | — | — | — | — | false |
| g1u15.gi.going-to.qf.002 | question-formation | They are going to play badminton. → Frag nach WAS (what). [de] | What are they going to play? (full) | — | — | — | — | false |
| g1u15.gi.going-to.sb.002 | sentence-building | you / going / to / are / a / visit / castle / ? [en] | Are you going to visit a castle? (full) | — | — | — | — | false |
| g1u15.gi.going-to.sb.003 | sentence-building | she / going / to / is / a / postcard / write [en] | She is going to write a postcard. (full) ; She's going to write a postcard. (partial) | — | — | — | — | false |
| g1u15.gi.going-to.tf.002 | transformation | Mach eine Frage daraus: He is going to fly to California. → ___ he ___ to California? [de, 2 blank(s)] | Is \| going to fly (full) | — | — | — | — | false |
| g1u15.gi.going-to.tf.006 | transformation | Mach den Satz mit not: They are going to stay at home. → They ___ at home. [de, 1 blank(s)] | aren't going to stay (full) ; are not going to stay (full) ; 're not going to stay (partial) ; They aren't going to stay at home. (full) ; They are not going to stay at home. (full) | — | — | — | — | true |
| g1u15.gi.going-to.tf.007 | transformation | Mach den Satz mit not: I am going to cook dinner. → I ___ dinner. [de, 1 blank(s)] | am not going to cook (full) ; 'm not going to cook (partial) ; I am not going to cook dinner. (full) ; I'm not going to cook dinner. (partial) | — | — | — | — | true |
| g1u15.gi.going-to.tr.002 | translation | Wirst du in der Sonne liegen? – Ja. [de] | Are you going to lie in the sun? Yes, I am. (full) ; Are you going to lie in the sun? - Yes, I am. (full) ; Are you going to lie in the sun? Yes, I am (full) | deToEn | — | — | — | false |
| g1u15.gi.going-to.tr.003 | translation | Wir werden im Meer schwimmen. [de] | We are going to swim in the sea. (full) ; We're going to swim in the sea. (partial) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g1-u15/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u15",
  "lens": "answers",
  "itemsHash": "5a2e302029f4",
  "promptHash": "70fa2d8cdf22",
  "round": 2,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 58, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
