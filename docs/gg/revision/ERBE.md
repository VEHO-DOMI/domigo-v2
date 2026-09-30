# Vorhandene Arbeit wiederverwenden · Nachtrag 3

**CODEX DRAFT — NOT CANON.** Dieser Abgleich ergänzt W0 um die vom GG am
30.09.2026 nachgereichten Vorgänger. Er setzt weder deren Korrekturen noch ihre
Urteile zurück. Ein älterer Beleg gilt für seinen damaligen Prüfgegenstand und
seine konkrete Fassung; er ist kein automatisches neues Ansichts- oder
Integrationssiegel.

## Prüfregister und Reichweite

Basis aller DomiGo-Dateien: `df258ae8952cf5e5747e7507759d4d7b61e094b5`.
Die zehn GG-gepinnten DomiGo-Eingänge und vier historischen Plan-Dateien wurden
im eigenen Leseabgleich gegen ihre md5 bestätigt. Auch die vier eingefrorenen
Originaltrainer-Kopien stimmen mit den GG-Prüfsummen überein.

| Vorhandener Beleg | Prüfgegenstand und Versionsbezug | W0-Behandlung und Gültigkeitsgrenze |
|---|---|---|
| `content/corpus/units/*/review/wordbank.reviewed.json` und `wordbank.flags.json` | 57 Dateien, 2.446 Wortbankzeilen; alte Tabellenfingerabdrücke mit `rowsForEntries` frisch berechnet | **erhalten**: 2.446/2.446 stimmen überein. Bestätigt die damals erfassten Tabellenfelder; kein neues Urteil zu allen Aufgabenansichten. |
| `content/corpus/units/*/review/items.reviewed.json` und `items.flags.json` | 57 Dateien, 5.898 Aufgabenzeilen; aktuelle `vocabRow`/`grammarRow` gegen die gespeicherten Zeilenwerte | **erhalten**: 4.964/5.898 stimmen überein. Für 934 ist die genaue Feld-/Korrekturgeschichte **UNVERIFIZIERT**; weder blind übernehmen noch zurücksetzen. |
| `docs/runbooks/content-review-loop.md` | dokumentiert Wortbankkampagne PR 5/6/7, Quelltreue, Deutsch/Formen, Quellenkonflikte und Volltabellenlesen | **erhalten**: bestehender Delta-Prüfweg, keine Neuprüfung unveränderter Zeilen bloß wegen W0. |
| `docs/handover/17_curation_standard.md` | vollständige Varianten, Artikel-/Kontraktionsregeln, echtes Bewerten, Register- und Kalibriertore | **erhalten**: bestätigte Schlüssel-/Variantenkorrekturen und vollständige Antwortlisten bleiben unangetastet. |
| `content/overlays/item-fixes.json` und aktuelle Lader | bestehende gezielte Feldersetzungen im aktuellen Bestand | **erhalten**: W0 liest den effektiven Bestand und schreibt keine Reparatur zurück. Gründe einzelner historischer Änderungen nicht aus einer Gesamtsumme erfinden. |
| Vier Vokabelpools, zentraler Bewerter | PR 128, Kopf `7a2b05444f13f74927fa1a410b0a549feb9dbbd6`, Merge `0cf7b072344980232d393b22ae2ddd5c67f2f3f7` laut GG-Herkunftsbeleg | **erhalten**: tatsächlich im W0-Muster verwendet; keine zweite Bewertungslogik. PR-Herkunft hier GG-Beleg, aktuelle Funktion zusätzlich selbst geprüft. |
| `packages/db/src/persist.ts`, `review.ts`, `studypath.ts` | Versuchsprotokoll, Wiederholungsplanung und Lernpfad sind vorhandene Bausteine | **erhalten** als Architektur; aktuelle Speicherung und vollständige historische Zusagen **UNVERIFIZIERT**, keine Live-Datenbank gelesen. |
| `content/build/audit/blind-solve/g*.dry.json` | alter Schlüssel-Selbsttest mit Gesamt-Korpusfingerabdruck | **erhalten** als Altbeleg; kein unabhängiges Löserurteil und kein frischer Vollständigkeitsnachweis. |

Der Vergleich verwendet die bestehenden **reinen Zeilenfunktionen** der
Reviewwerkzeuge. Die schreibenden Befehle `review-doc` und `ingest-review` wurden
nicht ausgeführt. Sowohl gespeicherte Rohitems als auch durch `loadUnit` geladene
Items ergeben 4.964 gleiche Zeilen. Das beweist Feldgleichheit innerhalb der
historischen Zeilenform, nicht die Vollständigkeit dieser Form für neue
Qualitätsfragen. Eine veränderte Definition wurde als Gegenprobe im Speicher
eingesetzt; ihr Fingerabdruck passt erwartungsgemäß nicht mehr.

Reproduzierbarer lesender Kurzabgleich vom Repo-Wurzelordner (Ausgabe bei Bedarf
in eine Datei **außerhalb** des Repos umleiten):

```sh
node --import ./scripts/gg-revision/register.mjs --input-type=module - <<'JS'
import fs from 'node:fs';
import {loadUnit,loadWordbank} from './packages/content-loader/src/index.ts';
import {vocabRow,grammarRow} from './packages/content-pipeline/src/review-items.ts';
import {rowsForEntries} from './packages/content-pipeline/src/review-wordbank.ts';
const base='content/corpus/units', result=[];
for(const unit of fs.readdirSync(base).filter(x=>/^g[1-4]-u\d{2}$/.test(x)).sort()) {
  const itemFile=`${base}/${unit}/review/items.reviewed.json`;
  const wordFile=`${base}/${unit}/review/wordbank.reviewed.json`;
  const old=JSON.parse(fs.readFileSync(itemFile)), words=JSON.parse(fs.readFileSync(wordFile));
  const current=loadUnit(unit);
  for(const [kind,makeRow] of [['vocab',vocabRow],['grammar',grammarRow]])
    for(const item of current[kind]) {
      const row=makeRow(item);
      result.push({unit,itemId:item.id,source:itemFile,round:old.round,
        previous:old.rows[row.ref]??null,current:row.hash,matches:old.rows[row.ref]===row.hash});
    }
  for(const row of rowsForEntries(loadWordbank(unit).entries))
    result.push({unit,wordRef:row.ref,source:wordFile,round:words.round,
      previous:words.rows[row.ref]??null,current:row.hash,matches:words.rows[row.ref]===row.hash});
}
console.log(JSON.stringify(result,null,2));
JS
```

## Konkrete Herkunft der Piloten

Die folgenden Item-Zeilen beziehen sich auf `items.reviewed.json` der jeweiligen
Unit: g1-u01 Runde 2, g3-u01 Runde 1. Alle acht ausgewählten Wörter haben darüber
hinaus **passende Wortbank-Zeilenfingerabdrücke**. Die kurzen Kennungen in der
Tabelle sind jeweils um `g1u01.` beziehungsweise `g3u01.` zu ergänzen.

| Pilot / Aufgabenkennung | damaliger Fingerabdruck | heutiger Fingerabdruck | Schluss |
|---|---|---|---|
| g1 / w.book | a93918ae224f | 6edaf3ccaf22 | Feld-/Historienabgleich offen |
| g1 / w.pencil | 8a16fa73f452 | d1599b0676e3 | Feld-/Historienabgleich offen |
| g1 / w.rubber | f41f6d0faeeb | cb9a321cd7b8 | Feld-/Historienabgleich offen |
| g1 / w.chair | 32aa53c95213 | 0e3d6e1a9005 | Feld-/Historienabgleich offen |
| g1 / gi.imperatives.cp.002 | 35828f0dde61 | 35828f0dde61 | Tabellenbeleg erhalten |
| g1 / gi.plurals.gf.001 | 41e2df32db38 | 41e2df32db38 | Tabellenbeleg erhalten |
| g1 / gi.plurals.mp.001 | d34084a535ae | d34084a535ae | Tabellenbeleg erhalten; neue Frage zum Lernzeitpunkt separat |
| g3 / w.audition | c6393ca53a60 | 8f5fe7e394bc | Feld-/Historienabgleich offen |
| g3 / w.tune | 34fdfadd00b5 | 78b1ae5cf200 | Feld-/Historienabgleich offen |
| g3 / w.lyrics | 93b95cffa436 | c94b802bfbfc | Feld-/Historienabgleich offen |
| g3 / w.brave | 78c3394d64ce | 78c3394d64ce | Tabellenbeleg erhalten |
| g3 / gi.present-simple.gf.002 | 4e2e3100aae7 | 4e2e3100aae7 | Tabellenbeleg erhalten |
| g3 / gi.present-simple.mt.001 | 5fb4bd9e4d61 | 5fb4bd9e4d61 | Tabellenbeleg erhalten |
| g3 / gi.present-simple.gs.004 | d18206a5ac82 | d18206a5ac82 | Tabellenbeleg erhalten |
| g3 / gi.present-simple.ag.001 | 9e828fb84667 | 9e828fb84667 | Tabellenbeleg erhalten |

Die zwei Paint-Karten gehören nicht zu dieser Unit-Reviewtabelle. Ihr vorhandenes
Kapitel-Prüfband ist `content/corpus/stories/g1.st.lost-pages/paint/ch01.proof.json`;
es wird als eigener Beleg erhalten, ohne es zum Buchquellenurteil umzudeuten.
Die ausgewählte Storyaufgabe kommt aus `g3.st.fourteen/comprehension.json` mit den
Originalszenen s007/s008; ein gesondertes unabhängiges **heutiges** Itemurteil wurde
hier nicht nachgewiesen. Die zwei neuen Transferentwürfe besitzen naturgemäß
keinen historischen Revieweintrag. Sie müssen neu kalibriert werden.

## Juli-Plan und S3: Zusagen einzeln weiterführen

| Historischer Eingang | md5 |
|---|---|
| `DomiGo v2 Art Prompts/DOMIGO_VOCAB_INTELLIGENCE_PROGRAM_2026-07-15.md` | c5795818b11270b058dd60c1ec0ad9f0 |
| `DomiGo v2 Art Prompts/DOMIGO_VOCAB_PASSOVER_2026-07-16.md` | 9ec68b354d9958e5c5d36936ee0d9568 |
| `PLATFORM MASTER/SESSION-PROMPTS/S3_VOCAB_PROTOTYPE.md` | b8359df98ba6cadcab57eb7d7d868e71 |
| Vorgänger `docs/plans/2026-07-15_practice-and-vocab-intelligence-roadmap.md` im Codex-RPG-Archiv | 57cc32f622e3d9f0c7edda6a1d111fbf |

| Zusage / Vorläufer | Status im begrenzten W0-Abgleich |
|---|---|
| Vorhandene vier Pools und ein gemeinsamer Bewerter | **erhalten** und für die Muster wiederverwendet |
| Ursprünglicher OCR-Weg zur Wortliste | **ausdrücklich ersetzt** durch den Juli-Plan: vorhandene Transkripte/DOCX verwenden; keinen unnötigen Scanweg neu bauen |
| Erster Ausführungsauftrag an Opus im Passover v2 | **ausdrücklich ersetzt** durch S3 „prototype-first“; historische Rollen sind keine heutige Ausführungserlaubnis |
| Gestufte Hilfe: deutsche Bedeutung → Anfangsbuchstabe → Buchstabenanzahl → Lösung | **geplant offen / heutige Vollerfüllung UNVERIFIZIERT**; aktueller statischer Tipp und RetryNudge sind laut GG kein Nachweis der ganzen Leiter |
| Ohne Wortliste lösbare Erstansicht und gesonderter Durchgang durch alle Hilfestufen | **erhalten als Qualitätszusagen**; W0 liefert zwei kleine Pakete, keine vollständige Cold-/Ladder-Abnahme |
| Wiederholungsbudget je Wort und Formatmix | **geplant offen**, nicht aus vorhandener Wiederholungswarteschlange als fertig ableiten |
| Wortindex mit erster Buchstelle (`U#/#`) | **geplant offen / Implementierung UNVERIFIZIERT**; Gesamtwortliste allein erfüllt diesen Index nicht |
| Wortkarte, „Später üben“, persönliche Sammlung, Wiederholung in anderem Pool | **geplant offen / Live-Funktion UNVERIFIZIERT**; GG fand `student_word_vault` und `vocabulary-index@1` im geprüften Produkt-Suchraum nicht |
| Lernstandsabhängige Hilfe, visuelle Einführung | **geplant offen / vollständige Umsetzung UNVERIFIZIERT** |
| Grammatikindex und private Fremdwortbahn | **geplant später**, keine stille Streichung durch W0 |

Die historische S3-Forderung nach drei getrennten Lösern und zwei verschiedenen
Prüfdurchgängen wird nicht umgeschrieben. Die aktuelle **W0-Karte** verlangt zwei
unabhängige Löserkarten für ihre zwei Muster. Das erfüllt nur diesen engeren
Auftrag; es ersetzt nicht automatisch die späteren Programmzusagen. Die exakte
von Koki erinnerte Plan-PR-Nummer bleibt **UNVERIFIZIERT**; PR 458 wird dafür nicht
ausgegeben. Die vollständige historische Plan-Zuordnung bleibt beim GG.
