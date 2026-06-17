# Verify lens — translation — g3-u13 (round 1)

<!-- domigo:verify translation g3-u13 items=aba8b8f9dad4 prompt=c6328b13b073 round=1 -->

<!-- domigo:prompt verify-translation v=1 -->
# Lens 3 — translation, both directions (adversarial)

You are an independent, adversarial verifier and a bilingual DE/EN speaker (Austrian
German). You did NOT write these items. For every translation surface (vocab items'
`translation.deToEn` AND `translation.enToDe`; grammar items with format
`translation`):

1. **Meaning:** does each full-tier answer actually translate the prompt — register,
   number, tense, particles included? ("(sich) fürchten (vor)" ↔ "to fear", not
   "to frighten".)
2. **Direction:** is the language of prompt and answers consistent with the declared
   direction? (kind `translation-direction`)
3. **Completeness in BOTH directions:** German has synonyms too — would a student's
   natural "Ich habe Angst vor…" be accepted where defensible (partial), or wrongly
   marked wrong? English side likewise.
4. **Naturalness:** stilted or word-by-word renderings that no Austrian teenager would
   say = `translation-unnatural` (usually warn; fix when actively misteaching).
5. **du-form:** German prompts/answers address the student informally.

Flag kind menu: `translation-meaning`, `translation-direction`,
`translation-unnatural`. Severity `fix` when a correct student answer would be
rejected or a wrong meaning taught; `warn` otherwise. Cite the exact text in every
note.

## Vocab items (34)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g3u13.w.accidentally | accidentally | versehentlich | accidentally (full) ; by accident (partial) | versehentlich (full) ; aus Versehen (full) |
| g3u13.w.alibi | alibi | Alibi | alibi (full) ; an alibi (full) | Alibi (full) ; das Alibi (full) |
| g3u13.w.detention | detention | Nachsitzen | detention (full) | Nachsitzen (full) ; das Nachsitzen (full) ; Nachsitzstunde (partial) |
| g3u13.w.dilemma | dilemma | Dilemma | dilemma (full) ; a dilemma (full) | Dilemma (full) ; das Dilemma (full) ; Zwangslage (full) ; die Zwangslage (full) ; Zwickmühle (partial) |
| g3u13.w.disappointment | disappointment | Enttäuschung | disappointment (full) ; a disappointment (full) | Enttäuschung (full) ; die Enttäuschung (full) |
| g3u13.w.except | except | außer | except (full) ; except for (full) ; apart from (partial) | außer (full) ; bis auf (full) |
| g3u13.w.granddad | granddad | Opa | granddad (full) ; grandad (full) ; grandpa (partial) | Opa (full) ; der Opa (full) ; Großvater (partial) |
| g3u13.w.homemade | homemade | hausgemacht | homemade (full) ; home-made (full) | hausgemacht (full) ; selbst gemacht (full) ; selbstgemacht (full) |
| g3u13.w.id | ID (=identification) | Personalausweis | ID (full) ; ID card (full) ; identification (full) | Personalausweis (full) ; der Personalausweis (full) ; Ausweis (full) |
| g3u13.w.it-s-a-shame | It's a shame. | Das ist schade. | It's a shame. (full) ; It's a shame (full) ; What a shame. (partial) | Das ist schade. (full) ; Schade. (full) ; Wie schade. (partial) |
| g3u13.w.lift | lift | Mitfahrgelegenheit | lift (full) ; a lift (full) ; ride (partial) | Mitfahrgelegenheit (full) ; die Mitfahrgelegenheit (full) |
| g3u13.w.neither-of | neither of | keiner von | neither of (full) | keiner von (full) ; keine von (full) ; keines von (full) |
| g3u13.w.to-argue | to argue | streiten | argue (full) ; to argue (full) | streiten (full) ; sich streiten (full) ; diskutieren (full) |
| g3u13.w.to-ask-sb-out | to ask sb. out | jdn. nach einem Date fragen | ask sb. out (full) ; to ask sb. out (full) ; ask out (full) | jemanden nach einem Date fragen (full) ; jemanden um ein Date bitten (full) ; jemanden einladen (partial) |
| g3u13.w.to-be-at-a-loss | to be at a loss | ratlos sein | be at a loss (full) ; to be at a loss (full) ; at a loss (full) | ratlos sein (full) ; nicht weiterwissen (full) ; keine Ahnung haben, was man tun soll (partial) |
| g3u13.w.to-be-in-two-minds-about-sth | to be in two minds about sth. | bei etw. unentschlossen sein | be in two minds (full) ; to be in two minds about sth. (full) ; in two minds (full) | bei etwas unentschlossen sein (full) ; unentschlossen sein (full) ; sich nicht sicher sein (partial) |
| g3u13.w.to-cancel | to cancel | absagen | cancel (full) ; to cancel (full) ; call off (partial) | absagen (full) ; abblasen (partial) ; streichen (partial) |
| g3u13.w.to-deserve | to deserve | verdienen | deserve (full) ; to deserve (full) | verdienen (full) ; verdient haben (full) |
| g3u13.w.to-find-a-way-out-of-a-dilemma | to find a way out of a dilemma | einen Ausweg aus einem Dilemma finden | find a way out of a dilemma (full) ; to find a way out of a dilemma (full) ; find a way out (full) | einen Ausweg aus einem Dilemma finden (full) ; einen Ausweg finden (full) ; eine Lösung finden (partial) |
| g3u13.w.to-have-second-thoughts-about-sth | to have second thoughts about sth. | etw. noch einmal überdenken | have second thoughts (full) ; to have second thoughts about sth. (full) ; having second thoughts (full) | etwas noch einmal überdenken (full) ; es sich anders überlegen (full) ; Zweifel bekommen (partial) |
| g3u13.w.to-keep-quiet | to keep quiet | schweigen | keep quiet (full) ; to keep quiet (full) ; say nothing (partial) | schweigen (full) ; still sein (full) ; nichts sagen (full) |
| g3u13.w.to-kick-sb-off | to kick sb. off | rausschmeißen | kick sb. off (full) ; to kick sb. off (full) ; kick off (full) | rausschmeißen (full) ; rauswerfen (full) ; von der Mannschaft werfen (partial) |
| g3u13.w.to-look-the-other-way | to look the other way | wegsehen | look the other way (full) ; to look the other way (full) | wegsehen (full) ; wegschauen (full) |
| g3u13.w.to-make-up-your-mind | to make up your mind | sich entscheiden | make up your mind (full) ; to make up your mind (full) ; make up my mind (full) ; decide (partial) | sich entscheiden (full) ; sich entschließen (partial) ; eine Entscheidung treffen (partial) |
| g3u13.w.to-move | to move | verschieben | move (full) ; to move (full) ; change (partial) ; put off (partial) | verschieben (full) ; umlegen (partial) ; verlegen (partial) |
| g3u13.w.to-pretend | to pretend | vortäuschen | pretend (full) ; to pretend (full) | vortäuschen (full) ; so tun, als ob (full) ; so tun als ob (full) |
| g3u13.w.to-put-up | to put up | aufhängen | put up (full) ; to put up (full) | aufhängen (full) ; anbringen (partial) ; aushängen (partial) |
| g3u13.w.to-reach-a-decision | to reach a decision | eine Entscheidung treffen | reach a decision (full) ; to reach a decision (full) ; make a decision (partial) | eine Entscheidung treffen (full) ; zu einer Entscheidung kommen (full) ; sich entscheiden (partial) |
| g3u13.w.to-reject | to reject | ablehnen | reject (full) ; to reject (full) ; turn down (partial) | ablehnen (full) ; zurückweisen (full) |
| g3u13.w.to-rethink | to rethink | überdenken | rethink (full) ; to rethink (full) ; think again about (partial) | überdenken (full) ; noch einmal überdenken (full) ; neu überlegen (partial) |
| g3u13.w.to-sleep-on-it | to sleep on it | eine Nacht darüber schlafen | sleep on it (full) ; to sleep on it (full) | eine Nacht darüber schlafen (full) ; darüber schlafen (full) ; noch eine Nacht darüber schlafen (partial) |
| g3u13.w.to-tell-on-sb | to tell on sb. | jdn. verpetzen | tell on sb. (full) ; to tell on sb. (full) ; tell on (full) | jemanden verpetzen (full) ; verpetzen (full) ; verraten (partial) |
| g3u13.w.to-wrap | to wrap | verpacken | wrap (full) ; to wrap (full) ; wrap up (partial) | verpacken (full) ; einpacken (full) ; einwickeln (partial) |
| g3u13.w.voucher | voucher | Gutschein | voucher (full) ; a voucher (full) | Gutschein (full) ; der Gutschein (full) |

## Grammar items (3 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g3u13.gi.second-conditional.tr.001 | translation | Wenn ich ein Tier wäre, wäre ich ein Delfin. [de] | If I were an animal, I would be a dolphin. (full) ; If I was an animal, I would be a dolphin. (partial) ; If I were an animal, I'd be a dolphin. (full) | deToEn |
| g3u13.gi.second-conditional.tr.002 | translation | An deiner Stelle würde ich mir keine Sorgen machen. [de] | If I were you, I would not worry. (full) ; If I were you, I wouldn't worry. (full) ; If I were you, I'd not worry. (partial) | deToEn |
| g3u13.gi.second-conditional.tr.003 | translation | Wenn ich mehr Zeit hätte, würde ich dir helfen. [de] | If I had more time, I would help you. (full) ; If I had more time, I'd help you. (full) | deToEn |

## Output contract

Write `content/corpus/units/g3-u13/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g3-u13",
  "lens": "translation",
  "itemsHash": "aba8b8f9dad4",
  "promptHash": "c6328b13b073",
  "round": 1,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 37, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
