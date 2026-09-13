# CODEX DRAFT — NOT CANON

## Diagnose, noch keine Produkt- oder Teständerung

Die eingefrorene Batterie scheitert in `apps/web/lib/paint-content.test.ts:333`: Der Test verlangt für das ausgelieferte Kapitel 1 weiterhin `restorationDe === undefined`. Das passt nicht mehr zum ausdrücklich eingeführten Wortlaut. Der tatsächliche Lader erhält alle vier Werte korrekt; die Fehlermeldung zeigt genau das verfasste Objekt. Im Web-Teil stehen 214 bestandene und eine fehlgeschlagene Prüfung. Quelle: `/private/tmp/codex-ch01-story-final-1fd980c5/003-pnpm-test.log`, Fehler ab Zeile 1005.

`ch01.level.json:893` enthält:

```json
{
  "freedLabel": "Schulsachen wiedergefunden",
  "oneDative": "einem grauen Gegenstand",
  "manyDative": "grauen Gegenständen",
  "oneSubject": "es"
}
```

`paint-content.ts:275–280` erhält das vollständige optionale Objekt im Ladeschema; alle drei Textfelder müssen befüllt sein, das Pronomen muss er/sie/es sein. Es gibt hier keinen neu beobachteten Laufzeitfehler. Die nachfolgende Prüfung für unvollständige Grammatik und ungültiges Pronomen bleibt unverändert notwendig.

## Enger Korrekturvorschlag nach Freigabe

Nur den überholten Test ersetzen: erst die vier tatsächlichen Kapitel-eins-Werte exakt gegen obiges verfasstes Objekt prüfen. Den bereits vorhandenen Test mit einem anderen verfassten Tier-Wortlaut weiterhin durch denselben echten Parser führen und alle vier zurückgegebenen Werte vergleichen.

Den bisherigen allgemeinen Standardfall ausdrücklich erhalten: von einer Kopie des geladenen Kapitels das optionale Feld entfernen, die Kopie durch `parsePaintLevelFile` führen und dort `undefined` erwarten. Damit hängt dieser Rückwärtskompatibilitätsbeweis nicht länger daran, dass ausgerechnet das weiterentwickelte Kapitel 1 dauerhaft auf den neuen Inhalt verzichten muss. Unvollständige Objektformen und `oneSubject: "they"` müssen weiter scheitern. Keine Schwellen, Kapiteldateien oder Ladeschemata ändern.

## Vorgeschlagene echte negative Probe

Isolierte Kopie des Laders mit denselben aufgelösten Importen, keine Mutation der eingefrorenen Produktquelle. Baseline mit aktualisiertem Test muss grün sein. Dann das optionale `restorationDe`-Schemafeld vollständig aus der Laderkopie entfernen: der Parser streift den Inhalt ab, und der neue exakte Kapitel-eins-Vergleich muss rot werden. Separate Gegenprobe: der optionalen Form künstlich einen Defaultwert geben; die Prüfung für eine Eingabe ohne Feld muss rot werden. Eine weitere gezielte Probe kann den Pronomenvalidator lockern; der bestehende malformed-Test muss diese Regression weiterhin erkennen.

Die Proben sind in dieser Diagnose noch nicht ausgeführt. Root hat Quelländerungen während der laufenden Batterie ausdrücklich eingefroren. Es wurden ausschließlich Quelltext und bestehendes Fehlerprotokoll gelesen; dieser Bericht ist die einzige neue Datei.


## Autorisierte Korrektur nach Ende der Batterie

Nach ausdrücklicher Freigabe wurde ausschließlich `paint-content.test.ts` angepasst: der alte eine Test wird jetzt durch den exakten Kapitelvergleich plus unveränderten Tierwortlaut-Roundtrip und eine eigene Weglassprüfung ersetzt. Der bestehende malformed-Test bleibt unverändert. Ergebnis: drei fokussierte Tests bestanden (`final-web-restoration-focused.log`); Web-Typprüfung Exit 0 (`final-web-lazy-typecheck.log`). Kein Ladeschema und keine Inhaltsdatei wurde für diese Korrektur geändert.

Die echte negative Prüfung läuft gegen isolierte Kopien des tatsächlichen Laders und des aktualisierten Tests. Gleiche Repoimporte und derselbe Server-only-Testshim, keine Ersetzung durch eine nachgebaute Testfunktion. `final-web-restoration-tampers.py` dokumentiert das Verfahren. Baseline Exit 0; entferntes Schemafeld, künstlicher Default und gelockertes Pronomenfeld jeweils Exit 1. Vollständige Ausgaben und Prüfsummen liegen unter `final-web-restoration-tampers/`. Damit wird der veraltete Inhaltsbezug aktualisiert, ohne den optionalen Standardfall oder den Grammatikschutz aufzugeben.
