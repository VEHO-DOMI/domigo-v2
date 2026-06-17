# Verify lens — translation — g3-u01 (round 1)

<!-- domigo:verify translation g3-u01 items=6b79cc62d530 prompt=c6328b13b073 round=1 -->

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

## Vocab items (40)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g3u01.w.afterwards | afterwards | danach | afterwards (full) | danach (full) ; anschließend (full) |
| g3u01.w.apart-from | apart from | abgesehen von | apart from (full) | abgesehen von (full) |
| g3u01.w.audition | audition | Vorsingen | audition (full) | Vorsingen (full) ; Vorsprechen (full) |
| g3u01.w.brave | brave | mutig | brave (full) | mutig (full) |
| g3u01.w.critic | critic | Kritiker/Kritikerin | critic (full) | Kritiker (full) ; Kritikerin (full) ; Kritiker/Kritikerin (full) |
| g3u01.w.extremely | extremely | extrem | extremely (full) | extrem (full) ; äußerst (full) ; sehr (partial) |
| g3u01.w.flute | flute | Flöte | flute (full) | Flöte (full) ; Querflöte (full) |
| g3u01.w.i-can-t-stand-it | I can't stand it. | Ich kann es nicht ausstehen. | I can't stand it (full) ; I can't stand it. (full) | Ich kann es nicht ausstehen. (full) ; Ich kann es nicht ausstehen (full) |
| g3u01.w.i-don-t-mind | I don't mind (it). | Ich habe nichts dagegen. | I don't mind (full) ; I don't mind it (full) ; I don't mind it. (full) | Ich habe nichts dagegen. (full) ; Ich habe nichts dagegen (full) ; Mir ist es egal. (partial) |
| g3u01.w.in-my-opinion | in my opinion | meiner Meinung nach | in my opinion (full) | meiner Meinung nach (full) |
| g3u01.w.lyrics | lyrics | Liedtext | lyrics (full) | Liedtext (full) ; Songtext (full) |
| g3u01.w.me-neither | Me neither. | Ich auch nicht. | Me neither (full) ; Me neither. (full) | Ich auch nicht. (full) ; Ich auch nicht (full) |
| g3u01.w.not-even | not even | noch nicht einmal | not even (full) | noch nicht einmal (full) ; nicht einmal (full) |
| g3u01.w.record | record | (Schall-)Platte | record (full) | Schallplatte (full) ; Platte (full) |
| g3u01.w.singer | singer | Sänger/Sängerin | singer (full) | Sänger (full) ; Sängerin (full) ; Sänger/Sängerin (full) |
| g3u01.w.successful | successful | erfolgreich | successful (full) | erfolgreich (full) |
| g3u01.w.suit | suit | Anzug | suit (full) | Anzug (full) |
| g3u01.w.talented | talented | talentiert | talented (full) | talentiert (full) ; begabt (full) |
| g3u01.w.to-agree | to agree | zustimmen | agree (full) ; to agree (full) | zustimmen (full) ; der gleichen Meinung sein (full) ; Recht geben (partial) |
| g3u01.w.to-be-interested-in | to be interested in | an etw. interessiert sein | be interested in (full) ; interested in (full) ; to be interested in (full) | an etw. interessiert sein (full) ; sich für etwas interessieren (full) |
| g3u01.w.to-be-on-the-way-up | to be on the way up | auf dem Weg nach oben sein | be on the way up (full) ; on the way up (full) ; to be on the way up (full) | auf dem Weg nach oben sein (full) |
| g3u01.w.to-belong-to | to belong to | gehören | belong to (full) ; to belong to (full) | gehören (full) |
| g3u01.w.to-celebrate | to celebrate | feiern | celebrate (full) ; to celebrate (full) | feiern (full) |
| g3u01.w.to-come-along | to come along | mitkommen | come along (full) ; to come along (full) | mitkommen (full) |
| g3u01.w.to-feel | to feel | sich fühlen | feel (full) ; to feel (full) | sich fühlen (full) ; fühlen (full) |
| g3u01.w.to-get-back-to-sb | to get back to sb. | sich bei jdm. melden | get back to sb. (full) ; get back to somebody (full) ; to get back to sb. (full) | sich bei jdm. melden (full) ; sich bei jemandem melden (full) |
| g3u01.w.to-get-tired-of-sth | to get tired of sth. | etw. satt haben | get tired of sth. (full) ; to get tired of sth. (full) | etw. satt haben (full) ; etwas satt haben (full) ; genug von etwas haben (partial) |
| g3u01.w.to-give-sth-a-try | to give sth. a try | etw. versuchen | give sth. a try (full) ; give it a try (full) ; to give sth. a try (full) | etw. versuchen (full) ; etwas ausprobieren (full) ; es versuchen (partial) |
| g3u01.w.to-give-up | to give up | aufgeben | give up (full) ; to give up (full) | aufgeben (full) ; aufhören (partial) |
| g3u01.w.to-have-got-what-it-takes | to have got what it takes | das Zeug dazu haben | have got what it takes (full) ; have what it takes (full) ; to have got what it takes (full) | das Zeug dazu haben (full) |
| g3u01.w.to-make-it | to make it | es schaffen | make it (full) ; to make it (full) | es schaffen (full) |
| g3u01.w.to-make-up | to make up | erfinden | make up (full) ; to make up (full) | erfinden (full) ; sich ausdenken (full) |
| g3u01.w.to-seem | to seem | scheinen | seem (full) ; to seem (full) | scheinen (full) ; wirken (full) |
| g3u01.w.to-sing-along | to sing along | mitsingen | sing along (full) ; to sing along (full) | mitsingen (full) |
| g3u01.w.to-spill | to spill | verschütten | spill (full) ; to spill (full) | verschütten (full) ; ausschütten (partial) |
| g3u01.w.to-take-place | to take place | stattfinden | take place (full) ; to take place (full) | stattfinden (full) |
| g3u01.w.to-waste | to waste | verschwenden | waste (full) ; to waste (full) | verschwenden (full) ; vergeuden (full) |
| g3u01.w.tune | tune | Melodie | tune (full) | Melodie (full) |
| g3u01.w.unhappy | unhappy | unglücklich | unhappy (full) | unglücklich (full) ; traurig (partial) |
| g3u01.w.whole | whole | ganze/r/s | whole (full) | ganze (full) ; ganzer (full) ; ganzes (full) |

## Grammar items (2 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g3u01.gi.present-simple.tr.001 | translation | Sie schreibt ihre eigenen Liedtexte. [de] | She writes her own lyrics. (full) | deToEn |
| g3u01.gi.present-simple.tr.002 | translation | Er mag keine Rockmusik. [de] | He doesn't like rock music. (full) ; He does not like rock music. (full) | deToEn |

## Output contract

Write `content/corpus/units/g3-u01/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g3-u01",
  "lens": "translation",
  "itemsHash": "6b79cc62d530",
  "promptHash": "c6328b13b073",
  "round": 1,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 42, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
