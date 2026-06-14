# Verify lens — answers — g3-u01 (round 1)

<!-- domigo:verify answers g3-u01 items=6b79cc62d530 prompt=70fa2d8cdf22 round=1 -->

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

## Vocab items (40)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g3u01.w.afterwards | afterwards | after that, when the first thing is done | We are going to the concert first, and ___ we can all go for a pizza. | afterwards (full) | afterwards (full) | apart from ; not even ; in my opinion |
| g3u01.w.apart-from | apart from | not counting one thing, the rest is all true | ___ his bad taste in music, my dad is really cool and fun to be with. | Apart from (full) | apart from (full) | afterwards ; not even ; in my opinion |
| g3u01.w.audition | audition | a short show where people watch you and tell you if you are good at music | She played a pop tune on the flute at her ___ for the school show, and the critics liked it. | audition (full) | audition (full) ; auditions (full) | singer ; critic ; tune |
| g3u01.w.brave | brave | not scared, ready for anything scary | You're a ___ man to get up and play music in front of the whole school — well done! | brave (full) | brave (full) | unhappy ; talented ; successful |
| g3u01.w.critic | critic | somebody whose job is to tell people if music or shows are good or bad | The ___ on the music show did not like the young singer's voice at all, and everybody could tell. | critic (full) | critic (full) ; critics (full) | singer ; record ; audition |
| g3u01.w.extremely | extremely | very, very much | This famous singer was ___ talented — he played all the music on his record alone. | extremely (full) | extremely (full) | whole ; brave ; successful |
| g3u01.w.flute | flute | a long, thin musical thing that you play with your mouth and your fingers | She plays the ___ in the school music club, and her favourite tune is beautiful on it. | flute (full) | flute (full) ; flutes (full) | record ; suit ; tune |
| g3u01.w.i-can-t-stand-it | I can't stand it. | a way to tell people you really do not like a thing at all | The noise from the room next to mine is so bad — ___ stand it! | I can't (full) | I can't stand it (full) ; I can't stand it. (full) ; can't stand (partial) | I don't mind (it). ; Me neither. ; in my opinion |
| g3u01.w.i-don-t-mind | I don't mind (it). | a way to tell people a thing is OK for you, you are happy with it | We can listen to your music if you want — ___ mind, it's all good with me. | I don't (full) | I don't mind (full) ; I don't mind it (full) ; I don't mind it. (full) ; don't mind (partial) | I can't stand it. ; Me neither. ; in my opinion |
| g3u01.w.in-my-opinion | in my opinion | words you use to show what you think | ___, this is the best record they have ever made — I love every tune on it. | In my opinion (full) | in my opinion (full) | apart from ; afterwards ; not even |
| g3u01.w.lyrics | lyrics | the words that a singer sings in a piece of music | I love this tune, but I can never remember the ___ when I want to sing along. | lyrics (full) | lyrics (full) | tune ; record ; singer |
| g3u01.w.me-neither | Me neither. | a way to agree when a friend does not like a thing and you do not like it too | 'I can't listen to their new music any more.' — '___ It's not so good now.' | Me neither. (full) | Me neither (full) ; Me neither. (full) | I can't stand it. ; I don't mind (it). ; in my opinion |
| g3u01.w.not-even | not even | used to show a thing is surprising because it is less than you would think | You're not going to be our new singer — you're ___ going to be at the back of the show. | not even (full) | not even (full) | afterwards ; apart from ; extremely |
| g3u01.w.record | record | a big, black, round music thing that you put on a player to play music | My mum has a box of old black ___ that she still plays on a player on calm days. | records (full) | record (full) ; records (full) | flute ; suit ; singer |
| g3u01.w.singer | singer | somebody who makes music with their voice, and this is their job | My favourite ___ has a new record out this week, and her voice is amazing on every tune. | singer (full) | singer (full) ; singers (full) | critic ; record ; tune |
| g3u01.w.successful | successful | having done very well and got what you wanted | The tune was so ___ that you could listen to it on the radio every day for a whole year. | successful (full) | successful (full) | talented ; brave ; unhappy |
| g3u01.w.suit | suit | a matching jacket and trousers that you wear for special days | Play your music at home when you're not wearing that smart grey ___ with the matching jacket and trousers. | suit (full) | suit (full) ; suits (full) | record ; flute ; tune |
| g3u01.w.talented | talented | very good at a thing, with no help and no work | My young sister is so ___ at music — nobody taught her, but she plays the flute beautifully. | talented (full) | talented (full) | successful ; brave ; unhappy |
| g3u01.w.to-agree | to agree | to think like a friend, with the very opinion they have | I ___ with you — this singer makes the best music in the whole town! | agree (full) | agree (full) ; agreed (partial) | to seem ; to feel ; to celebrate |
| g3u01.w.to-be-interested-in | to be interested in | to want to find out more about a thing because you like it | He is really ___ in music — he reads every book about famous singers he can find. | interested (full) | be interested in (full) ; interested in (full) ; to be interested in (full) | to get tired of sth. ; to give up ; to seem |
| g3u01.w.to-be-on-the-way-up | to be on the way up | to become more and more famous, doing very well | That young drummer is really on the ___ up — every month she plays bigger and bigger concerts. | way (full) | be on the way up (full) ; on the way up (full) | to give up ; to take place ; to belong to |
| g3u01.w.to-belong-to | to belong to | when a thing is yours and not a friend's | This old record isn't mine — it ___ to my mum, so I have to give it back to her. | belongs (full) | belong to (full) ; belongs to (full) ; belonged to (partial) | to seem ; to feel ; to agree |
| g3u01.w.to-celebrate | to celebrate | to do a happy thing because of a good day, like a birthday | To ___ music, the radio played all our favourite tunes the whole day long. | celebrate (full) | celebrate (full) ; celebrated (partial) | to agree ; to waste ; to seem |
| g3u01.w.to-come-along | to come along | to go somewhere with a friend | We're all going to the concert tonight. Do you want to ___ along with us? | come (full) | come along (full) ; came along (partial) | to give up ; to take place ; to make up |
| g3u01.w.to-feel | to feel | to be happy, sad, or scared inside you | Whenever I ___ sad, I listen to my favourite tune and it makes me happy again. | feel (full) | feel (full) ; felt (partial) | to seem ; to agree ; to belong to |
| g3u01.w.to-get-back-to-sb | to get back to sb. | to talk to a friend again after, not now | I have no time at the music club now, but I get ___ to you with a yes or no after lunch. | back (full) | get back to (full) ; get back to sb. (full) ; got back to (partial) | to give up ; to come along ; to seem |
| g3u01.w.to-get-tired-of-sth | to get tired of sth. | to not like a thing any more because you have done it too much | I love this music so much that I never ___ tired of listening to it. | get (full) | get tired of (full) ; get tired of sth. (full) ; got tired of (partial) | to make up ; to seem ; to come along |
| g3u01.w.to-give-sth-a-try | to give sth. a try | to do a thing once to find out if you like it or can do it | I have never played the flute, but I want to ___ it a try at the music club this week. | give (full) | give sth. a try (full) ; give it a try (full) ; give something a try (partial) | to give up ; to waste ; to make up |
| g3u01.w.to-give-up | to give up | to not keep doing a thing, because you do not want to do it any more | Playing the guitar is not always fun at first, but please don't ___. Keep playing every day and you are going to play well. | give up (full) | give up (full) ; gave up (partial) ; given up (partial) | to make it ; to come along ; to celebrate |
| g3u01.w.to-have-got-what-it-takes | to have got what it takes | to be good, with all you need to do very well | You are a great dancer and so musical — you've got ___ it takes to be a famous singer! | what (full) | have got what it takes (full) ; have what it takes (full) | to give up ; to waste ; to seem |
| g3u01.w.to-make-it | to make it | to do very well and become famous, or to be there at a place | Sorry, I can't ___ it to your concert tonight — I have to look after my young sister. | make (full) | make it (full) ; made it (partial) | to give up ; to celebrate ; to come along |
| g3u01.w.to-make-up | to make up | to think of a new thing that is not real, just in your mind | My young sister likes to ___ up funny dances for her favourite tunes before bedtime. | make (full) | make up (full) ; made up (partial) | to give up ; to take place ; to seem |
| g3u01.w.to-seem | to seem | to look like a thing is true, from how it looks to you | That singer ___ to play worse every time she becomes more famous, in my opinion. | seems (full) | seem (full) ; seems (full) ; seemed (partial) | to feel ; to agree ; to belong to |
| g3u01.w.to-sing-along | to sing along | to join in with your voice when music is playing | Everybody in the car began to ___ along to their favourite tune on the radio. | sing (full) | sing along (full) ; sang along (partial) ; sung along (partial) | to make up ; to take place ; to seem |
| g3u01.w.to-spill | to spill | to let a drink fall out of its glass without wanting to | Be careful with that glass of milk near the record player, or you are going to ___ it all over the table! | spill (full) | spill (full) ; spilled (full) ; spilt (partial) | to waste ; to feel ; to celebrate |
| g3u01.w.to-take-place | to take place | to happen at a certain time, like a concert or a show. | Where did the concert ___ place — at the school or in the city park? | take (full) | take place (full) ; takes place (full) ; took place (partial) | to come along ; to give up ; to make it |
| g3u01.w.to-waste | to waste | to use too much of a thing, or use it in a bad way for no good reason | Don't ___ our time — you are never going to be a famous singer, so please leave now. | waste (full) | waste (full) ; wasted (partial) | to spill ; to feel ; to celebrate |
| g3u01.w.tune | tune | a piece of music that you can sing along to | I like music with a good ___ that you can sing along to in the car. | tune (full) | tune (full) ; tunes (full) | lyrics ; record ; singer |
| g3u01.w.unhappy | unhappy | not happy, feeling sad inside | Don't be too ___ that the critics did not like it — you did your best, and that is all good. | unhappy (full) | unhappy (full) | brave ; talented ; successful |
| g3u01.w.whole | whole | all of a thing, with nothing missing | For 600 euros, your driver is going to drive you behind your favourite singer for the ___ day. | whole (full) | whole (full) | successful ; brave ; extremely |

## Grammar items (24)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g3u01.gi.present-simple.ag.001 | anagram | Die he/she/it-Form von 'play': [de] | plays (full) | — | — | — | — | false |
| g3u01.gi.present-simple.cp.001 | context-picker | Your friend asks about Madonna. She writes her own lyrics. [en] | She writes her own lyrics. (full) | — | She write her own lyrics. ; She don't write her own lyrics. ; She writing her own lyrics. | — | — | false |
| g3u01.gi.present-simple.cp.002 | context-picker | Paul is a critic. He really doesn't enjoy this singer at all. [en] | He doesn't like the singer. (full) | — | He don't like the singer. ; He doesn't likes the singer. ; He not like the singer. | — | — | true |
| g3u01.gi.present-simple.ec.001 | error-correction | She write some great lyrics. [en] | She writes some great lyrics. (full) ; She writes some great lyrics (full) ; writes (partial) | — | — | — | — | false |
| g3u01.gi.present-simple.ec.002 | error-correction | He don't like pop music. [en] | He doesn't like pop music. (full) ; He doesn't like pop music (full) ; He does not like pop music. (full) ; doesn't like (partial) | — | — | — | — | true |
| g3u01.gi.present-simple.ec.003 | error-correction | Does she writes her own lyrics? [en] | Does she write her own lyrics? (full) ; Does she write her own lyrics (full) ; write (partial) | — | — | — | — | true |
| g3u01.gi.present-simple.gf.001 | gap-fill | I really ___ music with a good tune. (like) [en, 1 blank(s)] | like (full) | — | — | — | — | false |
| g3u01.gi.present-simple.gf.002 | gap-fill | My sister ___ the guitar and ___ in a concert every week. (play / sing) [en, 2 blank(s)] | plays \| sings (full) | — | — | — | — | false |
| g3u01.gi.present-simple.gf.003 | gap-fill | Paul is a critic, but he ___ play the guitar. (not / play) [en, 1 blank(s)] | doesn't (full) | — | — | — | — | true |
| g3u01.gi.present-simple.gs.003 | group-sort | Richtig oder falsch? Sortiere die Sätze. [de] | — | — | — | — | ✓: She writes great lyrics., He doesn't like pop music., My sister plays the drums. \| ✗: She write great lyrics., He don't like pop music., My sister play the drums. | false |
| g3u01.gi.present-simple.gs.004 | group-sort | Welche Form passt? Sortiere die Sätze nach der richtigen Form. [de] | — | — | — | — | She / He / It: She ___ great lyrics., He ___ in a concert tonight., Tom ___ the guitar. \| I / You / We / They: I ___ great lyrics., You ___ in a concert tonight., My friends ___ the guitar. | false |
| g3u01.gi.present-simple.mc.001 | multiple-choice | She ___ some great lyrics. [en, 1 blank(s)] | writes (full) | — | write ; don't write ; is write | — | — | false |
| g3u01.gi.present-simple.mc.002 | multiple-choice | He ___ like rock music. [en, 1 blank(s)] | doesn't (full) | — | don't ; isn't ; not | — | — | true |
| g3u01.gi.present-simple.mc.003 | multiple-choice | ___ she write her own lyrics? [en, 1 blank(s)] | Does (full) | — | Do ; Is ; Did | — | — | false |
| g3u01.gi.present-simple.mp.001 | matching-pairs | Welche Form des Verbs passt zur Person? [de] | — | — | — | She ↔ writes ; They ↔ write ; He ↔ plays ; We ↔ play ; It ↔ sounds ; You ↔ sound | — | false |
| g3u01.gi.present-simple.mt.001 | matching | Frage und passende Antwort [de] | — | — | — | Do you like pop music? ↔ Yes, I do. ; Does she write her own lyrics? ↔ Yes, she does. ; Do your friends play the guitar? ↔ No, they don't. ; Does he sing along? ↔ No, he doesn't. | — | false |
| g3u01.gi.present-simple.qf.001 | question-formation | She writes her own lyrics. → Stell eine Ja/Nein-Frage. [de] | Does she write her own lyrics? (full) ; Does she write her own lyrics (partial) | — | — | — | — | true |
| g3u01.gi.present-simple.qf.002 | question-formation | Frag deine Freundin, ob sie Popmusik mag. (you / like / pop music) [de] | Do you like pop music? (full) ; Do you like pop music (partial) | — | — | — | — | false |
| g3u01.gi.present-simple.sb.001 | sentence-building | she / writes / her / own / lyrics [en] | She writes her own lyrics. (full) | — | — | — | — | false |
| g3u01.gi.present-simple.sb.002 | sentence-building | he / doesn't / like / rock / music [en] | He doesn't like rock music. (full) ; He does not like rock music. (partial) | — | — | — | — | true |
| g3u01.gi.present-simple.tf.001 | transformation | I write my own lyrics. → Beginne mit 'She': She ___ her own lyrics. [de, 1 blank(s)] | writes (full) | — | — | — | — | false |
| g3u01.gi.present-simple.tf.002 | transformation | He likes pop music. → Mach den Satz verneint: He ___ pop music. [de, 1 blank(s)] | doesn't like (full) ; does not like (full) | — | — | — | — | true |
| g3u01.gi.present-simple.tr.001 | translation | Sie schreibt ihre eigenen Liedtexte. [de] | She writes her own lyrics. (full) | deToEn | — | — | — | false |
| g3u01.gi.present-simple.tr.002 | translation | Er mag keine Rockmusik. [de] | He doesn't like rock music. (full) ; He does not like rock music. (full) | deToEn | — | — | — | true |

## Output contract

Write `content/corpus/units/g3-u01/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g3-u01",
  "lens": "answers",
  "itemsHash": "6b79cc62d530",
  "promptHash": "70fa2d8cdf22",
  "round": 1,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 64, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
