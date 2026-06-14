# Verify lens — translation — g3-u10 (round 1)

<!-- domigo:verify translation g3-u10 items=6fab9ef3ff7b prompt=c6328b13b073 round=1 -->

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

## Vocab items (53)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g3u10.w.ability | ability | Fähigkeit | ability (full) | Fähigkeit (full) ; Können (partial) |
| g3u10.w.argument | argument | Argument | argument (full) | Argument (full) ; Streit (full) |
| g3u10.w.businessman | businessman (pl businessmen) | Geschäftsmann | businessman (full) | Geschäftsmann (full) |
| g3u10.w.city-council | city council | Stadtrat | city council (full) | Stadtrat (full) ; Gemeinderat (partial) |
| g3u10.w.cloth-bag | cloth bag | Stofftasche | cloth bag (full) | Stofftasche (full) ; Stoffbeutel (full) |
| g3u10.w.compromise | compromise | Kompromiss | compromise (full) | Kompromiss (full) |
| g3u10.w.concern | concern | Anliegen | concern (full) | Anliegen (full) ; Sorge (full) |
| g3u10.w.cottage | cottage | kleines Landhaus | cottage (full) | kleines Landhaus (full) ; Ferienhaus (full) |
| g3u10.w.debate | debate | Debatte | debate (full) | Debatte (full) ; Diskussion (full) |
| g3u10.w.don-t-buy-a-new-bag-bring-your-own | Don't buy a new bag. Bring your own. | Kauf keine neue Tasche. Bring deine eigene mit. | Don't buy a new bag. Bring your own (full) ; Don't buy a new bag. Bring your own. (full) | Kauf keine neue Tasche. Bring deine eigene mit. (full) ; Kauf keine neue Tüte. Bring deine eigene. (partial) |
| g3u10.w.don-t-drive-short-distances | Don't drive short distances. | Fahr keine kurzen Strecken. | Don't drive short distances (full) ; Don't drive short distances. (full) | Fahr keine kurzen Strecken. (full) ; Fahr kurze Strecken nicht mit dem Auto. (partial) |
| g3u10.w.don-t-drop-litter | Don't drop litter. | Wirf keinen Müll weg. | Don't drop litter (full) ; Don't drop litter. (full) | Wirf keinen Müll weg. (full) ; Lass keinen Abfall fallen. (partial) |
| g3u10.w.don-t-leave-bottles-or-cans-on-the-beach | Don't leave bottles or cans on the beach. | Lass keine Flaschen oder Dosen am Strand liegen. | Don't leave bottles or cans on the beach (full) ; Don't leave bottles or cans on the beach. (full) | Lass keine Flaschen oder Dosen am Strand liegen. (full) ; Lass keine Flaschen oder Dosen am Strand zurück. (partial) |
| g3u10.w.education | education | (Aus-)Bildung | education (full) | Bildung (full) ; Ausbildung (full) |
| g3u10.w.good-point | Good point. | Da ist was dran. | Good point (full) ; Good point. (full) | Da ist was dran. (full) ; Gutes Argument. (full) |
| g3u10.w.hardly-ever | hardly ever | fast nie | hardly ever (full) | fast nie (full) ; kaum jemals (full) |
| g3u10.w.headteacher | headteacher | Schulleiter/Schulleiterin | headteacher (full) ; head teacher (full) | Schulleiter (full) ; Schulleiterin (full) |
| g3u10.w.in-general | in general | im Allgemeinen | in general (full) ; generally (partial) | im Allgemeinen (full) ; im Großen und Ganzen (partial) |
| g3u10.w.law | law | Gesetz | law (full) | Gesetz (full) |
| g3u10.w.lazy | lazy | faul | lazy (full) | faul (full) ; träge (partial) |
| g3u10.w.majority | majority | Mehrheit | majority (full) | Mehrheit (full) |
| g3u10.w.non-violent | non-violent | gewaltlos | non-violent (full) | gewaltlos (full) ; friedlich (partial) |
| g3u10.w.nowadays | nowadays | heutzutage | nowadays (full) ; these days (partial) | heutzutage (full) |
| g3u10.w.organisation | organisation | Organisation | organisation (full) | Organisation (full) |
| g3u10.w.quality | quality | Qualität | quality (full) | Qualität (full) ; Güte (partial) |
| g3u10.w.right | right(s) | Recht(e) | right (full) ; rights (full) | Recht (full) ; Rechte (full) |
| g3u10.w.suffrage | suffrage | Wahlrecht | suffrage (full) ; right to vote (partial) | Wahlrecht (full) ; Stimmrecht (full) |
| g3u10.w.suffragette | suffragette | Frauenrechtlerin | suffragette (full) | Frauenrechtlerin (full) ; Suffragette (full) |
| g3u10.w.to-arrest | to arrest | Festnahme | to arrest (full) ; arrest (full) | verhaften (full) ; festnehmen (full) |
| g3u10.w.to-attend | to attend | besuchen (Universität, Veranstaltung) | to attend (full) ; attend (full) | besuchen (full) ; teilnehmen an (partial) |
| g3u10.w.to-be-able-to-do | to be able to do | fähig sein | to be able to do (full) ; be able to do (full) | fähig sein, etwas zu tun (full) ; in der Lage sein, etwas zu tun (full) |
| g3u10.w.to-be-equal | to be equal | gleichberechtigt sein | to be equal (full) ; be equal (full) | gleichberechtigt sein (full) ; gleich sein (partial) |
| g3u10.w.to-buy-locally-produced-food | to buy locally produced food | lokal produzierte Lebensmittel kaufen | to buy locally produced food (full) ; buy locally produced food (full) | lokal produzierte Lebensmittel kaufen (full) ; regionale Lebensmittel kaufen (partial) |
| g3u10.w.to-close-down | to close down | schließen | to close down (full) ; close down (full) | schließen (full) ; dichtmachen (partial) |
| g3u10.w.to-exist | to exist | existieren | to exist (full) ; exist (full) | existieren (full) ; vorhanden sein (partial) |
| g3u10.w.to-go-on-a-protest-march | to go on a protest march | auf einen Protestmarsch gehen | to go on a protest march (full) ; go on a protest march (full) | auf einen Protestmarsch gehen (full) ; an einem Protestmarsch teilnehmen (partial) |
| g3u10.w.to-hand-out-leaflets | to hand out leaflets | Flugblätter verteilen | to hand out leaflets (full) ; hand out leaflets (full) | Flugblätter verteilen (full) ; Flyer verteilen (partial) |
| g3u10.w.to-involve | to involve | einbeziehen | to involve (full) ; involve (full) | einbeziehen (full) ; beteiligen (full) |
| g3u10.w.to-organise-a-meeting | to organise a meeting | ein Treffen organisieren | to organise a meeting (full) ; organise a meeting (full) | ein Treffen organisieren (full) ; eine Versammlung organisieren (partial) |
| g3u10.w.to-protest | to protest | protestieren | to protest (full) ; protest (full) | protestieren (full) ; sich wehren (partial) |
| g3u10.w.to-recycle-paper-glass-plastic-and-cans | to recycle paper, glass, plastic and cans | Papier | to recycle paper, glass, plastic and cans (full) ; recycle paper, glass, plastic and cans (full) | Papier, Glas, Plastik und Dosen recyceln (full) ; Papier, Glas, Plastik und Dosen wiederverwerten (full) |
| g3u10.w.to-refuse | to refuse | (ver-)weigern | to refuse (full) ; refuse (full) | sich weigern (full) ; verweigern (full) |
| g3u10.w.to-save-water-and-energy | to save water and energy | Wasser und Energie sparen | to save water and energy (full) ; save water and energy (full) | Wasser und Energie sparen (full) ; Wasser und Strom sparen (partial) |
| g3u10.w.to-send-out-emails | to send out emails | E-Mails versenden | to send out emails (full) ; send out emails (full) | E-Mails versenden (full) ; E-Mails verschicken (full) |
| g3u10.w.to-sign-a-petition | to sign a petition | eine Petition unterschreiben | to sign a petition (full) ; sign a petition (full) | eine Petition unterschreiben (full) ; eine Unterschriftenliste unterschreiben (partial) |
| g3u10.w.to-speak-out | to speak out | seine Meinung sagen | to speak out (full) ; speak out (full) | seine Meinung sagen (full) ; sich aussprechen (full) |
| g3u10.w.to-stand-up-for | to stand up for | für etw. eintreten | to stand up for (full) ; stand up for (full) | für etwas eintreten (full) ; sich für etwas einsetzen (full) |
| g3u10.w.to-take-action | to take action | etw. unternehmen | to take action (full) ; take action (full) | etwas unternehmen (full) ; aktiv werden (full) |
| g3u10.w.to-treat | to treat | behandeln | to treat (full) ; treat (full) | behandeln (full) ; umgehen mit (partial) |
| g3u10.w.to-vote | to vote | wählen | to vote (full) ; vote (full) | wählen (full) ; abstimmen (full) |
| g3u10.w.town-hall | town hall | Rathaus | town hall (full) | Rathaus (full) ; Gemeindeamt (full) |
| g3u10.w.way-out | way out | Ausweg | way out (full) ; escape (partial) | Ausweg (full) ; Lösung (partial) |
| g3u10.w.wrapping | wrapping | Verpackung | wrapping (full) | Verpackung (full) |

## Grammar items (12 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g3u10.gi.be-allowed-to-tenses.tr.001 | translation | Übersetze ins Englische: 'Wir durften im Park Fußball spielen.' [de] | We were allowed to play football in the park. (full) | deToEn |
| g3u10.gi.be-allowed-to-tenses.tr.002 | translation | Übersetze ins Englische: 'Er wird nächstes Jahr allein reisen dürfen.' [de] | He will be allowed to travel alone next year. (full) ; Next year, he will be allowed to travel alone. (full) ; He will be allowed to travel on his own next year. (partial) | deToEn |
| g3u10.gi.be-allowed-to-tenses.tr.003 | translation | Übersetze ins Englische: 'Ab 1897 durften Frauen die Universität besuchen.' [de] | From 1897, women were allowed to attend university. (full) ; From 1897 onward, women were allowed to attend university. (full) | deToEn |
| g3u10.gi.could-was-able-to.tr.001 | translation | Übersetze ins Englische: 'Ich konnte schwimmen, als ich fünf war.' [de] | I could swim when I was five. (full) ; I could swim when I was five years old. (full) | deToEn |
| g3u10.gi.could-was-able-to.tr.002 | translation | Übersetze ins Englische: 'Als Kind konnte ich gut zeichnen.' [de] | When I was a child, I could draw well. (full) ; I could draw well when I was a child. (full) | deToEn |
| g3u10.gi.could-was-able-to.tr.003 | translation | Übersetze ins Englische: 'Nach vielen Versuchen konnte er die Prüfung bestehen.' [de] | After trying many times, he was able to pass the test. (full) ; After trying many times, he managed to pass the test. (partial) | deToEn |
| g3u10.gi.could-was-able-to.tr.004 | translation | Übersetze ins Englische: 'Im Regen konnten wir das Spiel gewinnen.' [de] | We were able to win the match in the rain. (full) ; We managed to win the match in the rain. (partial) | deToEn |
| g3u10.gi.could-was-able-to.tr.005 | translation | Übersetze ins Englische: 'Meine Großmutter konnte Französisch sprechen.' [de] | My grandmother could speak French. (full) | deToEn |
| g3u10.gi.could-was-able-to.tr.006 | translation | Übersetze ins Englische: 'Die Tür war abgeschlossen, aber ich konnte sie öffnen.' [de] | The door was locked, but I was able to open it. (full) ; The door was locked, but I managed to open it. (partial) | deToEn |
| g3u10.gi.could-was-able-to.tr.007 | translation | Übersetze ins Englische: 'Sie konnte mit vier lesen.' [de] | She could read when she was four. (full) ; She could read at four years old. (full) | deToEn |
| g3u10.gi.could-was-able-to.tr.008 | translation | Übersetze ins Englische: 'Das Spiel war schwer, aber wir konnten es gewinnen.' [de] | The match was difficult, but we were able to win it. (full) ; The match was difficult, but we managed to win it. (partial) | deToEn |
| g3u10.gi.could-was-able-to.tr.009 | translation | Übersetze ins Englische: 'Er konnte als Kind nicht Rad fahren.' [de] | He couldn't ride a bike when he was a child. (full) ; He could not ride a bike when he was little. (full) | deToEn |

## Output contract

Write `content/corpus/units/g3-u10/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g3-u10",
  "lens": "translation",
  "itemsHash": "6fab9ef3ff7b",
  "promptHash": "c6328b13b073",
  "round": 1,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 65, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
