# Öffentliche Übergabe: geschlossener Prüfvertrag

CODEX DRAFT — NOT CANON · cgo-006, Nachtrag 21. Diese Korrektur betrifft die
Prüfgrundlage. Sie verändert keine Produktbewertung, Aufgaben, Antwortschlüssel,
Originalquellen oder fachlichen Freigaben.

## Warum diese Korrektur erforderlich ist

Die unabhängige technische Prüfung 037 hat am Kopf
`38f950008d4a6e2be3b56a32c6ea0df6d2b920ce` vier beschädigte Übergaben nachgewiesen,
die `packetErrors` fälschlich annahm. Ihr vollständiger Neinbericht bleibt unter
`GG_DOMIGO/BERICHTE/PRUEFER_472.md` erhalten: MD5
`e21095bb41cdd31906250c8e91fab2c6`, SHA-256
`e6100baec18a58b12d3b094b28b5328d1758b4482dc6f1bf9e97dfa59ce2ac58`.
Ein beschädigtes öffentlich verteiltes Original oder Live-Vorfall wurde damit
nicht behauptet. Die frühere technische Selbstprüfung schloss diese Lücken nicht.

| Sperre | Korrektur | Gezielte Gegenprobe |
|---|---|---|
| S1: `label.notes.p002.answer` im Manifest | Feste Beschriftung, Basisbindung, Typen und Format aller öffentlichen Felder, Zeilen und Prüfsummen | Verschachteltes Originalbeispiel; Objekte statt aller skalaren Hauptfelder; falsche Listentypen |
| S2: `aria-description` trägt eine Antwort | Ganze Anzeige gegen frisch aus dem gebundenen Darstellungscode abgeleitete Erwartung vergleichen: jedes Element, Text, Attributname und Wert | Originalattribut, andere ARIA-/Datenattribute, unbekannte Attribute, Zusatztext, CSS-Zusatz und doppelte Attribute |
| S3: leerer sprechender Ordner | Vollständiger Dateibaum einschließlich Verzeichnissen; nur benötigter neutraler Assetordner; keine symbolischen Verknüpfungen oder Sonderdateien | Leerer Originalordner bei gleichem Paketpin; neutrale/nestende Zusatzordner; ZIP-Verzeichnis separat |
| S4: Anfangsseite als Farbschritt | Tatsächliche `restoreMachine.init/act/grade` ausführen, resultierenden Zustand mit echtem `RestoreCard` und `CardShell` darstellen; gespeicherte Seite vollständig damit vergleichen | Exakte Erstansicht; Erstansicht mit anderer Prüfsumme und gefälschter Schrittüberschrift; geänderte Farbfrage |

## Was als Erwartung gilt

`render-contract.tsx` erzeugt private Erwartungen aus den aktuellen Aufgaben,
Bilderzuordnungen und echten Komponenten. `verify.mjs` und
`grade-candidates.mjs` laden dafür die gegenwärtigen Aufgaben über den bestehenden
Ladeweg. Das öffentliche Paket liefert **keine** eigene Sollansicht. Die bisherige
Vorgabe des Darstellungsfingerabdrucks ist jetzt zwingend; ein bloßes Auslesen
dieser Angabe aus dem zu prüfenden Manifest genügt nicht.

`PilotFrame` enthält die bisherige gemeinsame Hülle unverändert; `PilotView`
benutzt weiter die echten interaktiven Aufgaben. Für Restore berechnet der
Erwartungsweg eine gültige Namensaktion und verlangt danach `colour` sowie
`pending`. Damit ist weder eine bereits gelöste Karte noch eine beliebig anders
aussehende Seite ein gültiger Farbschritt. Dieser separate Weg prüft den Zustand
und seine Darstellung; die Ereignisverdrahtung von `CardHost` benötigt zusätzlich
den echten Browsernachweis.

`html-contract.mjs` ist kein allgemeiner HTML-Bereiniger. Er vergleicht die
vollständige begrenzte Darstellung und weist unbekannte Struktur zurück. Er
vereinheitlicht nur Attributreihenfolge/Anführungszeichen, HTML-Zeichenkodierung,
leere React-Texttrenner, leere HTML-Elemente und eng begrenzte CSS-Schreibweisen
(Abstände, abschließendes Semikolon, Null-Pixel und Hex-/RGB-Farben). Inhalte,
Deklarationen und Attribute bleiben im Vergleich erhalten. Unbekannte Syntax,
doppelte Attribute und nichtleere Kommentare scheitern. Legitimer sichtbarer
Aufgabentext, Auswahlwerte und vorhandene zugängliche Beschreibungen werden
beibehalten. Die erlaubten Werte stammen aus der jeweiligen echten Anzeige,
nicht aus einer beliebig verlängerbaren Liste verbotener Attributnamen.

`saveColourState` verlangt eine Namensaktion sowie beobachtete Vorher- und
Nachheransichten; beide müssen zum unabhängigen Erwartungsweg passen, bevor
Dateien geschrieben werden. Ein alter Farbschritt kann nicht mehr über
`prepare-views --reuse-unchanged-state` übernommen werden. Historische Aufnahmen
bleiben historische Belege. Kein HTML-Vergleich beweist dauerhaften Lernspeicher.

Ordnerprüfung und `check-archive.py` bleiben getrennt. Der Archivaufruf verlangt
ausdrücklich `--layout solver` (Standard, Einträge unter `solver/`) oder
`--layout flat` (Dateien an der Archivwurzel). Bei beiden ist die Mitgliedschaft
exakt; zusätzliche Archiveinträge und zusätzliche leere Ordner scheitern.

Das Bestandsregister `domigo-revision-census@2` trennt nun `sourceBasis`
(`df258ae8952cf5e5747e7507759d4d7b61e094b5`) von `runHead` und nennt ungesicherte
Arbeitsbaumänderungen. Die Änderung allein ist kein neuer Bestandslauf.

## Kleine Regressionen und ihre Grenze

```sh
node --import ./scripts/gg-revision/register.mjs --test scripts/gg-revision/core.test.mjs scripts/gg-revision/solver-packet.test.mjs scripts/gg-revision/html-contract.test.mjs scripts/gg-revision/restore-contract.test.mjs scripts/gg-revision/archive.test.mjs
node --import ./scripts/gg-revision/register.mjs scripts/gg-revision/review-counterprobes.mjs "$REV_FROZEN_INPUT" "$REV_NEW_EXTERNAL_PROBES"
```

Der zweite Aufruf verlangt einen neuen eigenen Ausgabeordner. Er verwendet den
alten Export ausschließlich als eingefrorenen Prüfeingang, übernimmt die vier
Manipulationen aus 037 und ergänzt Varianten. Die tatsächlichen alten Seiten
werden gegen den aktuellen Darstellungsweg verglichen; die erwarteten Seiten
werden nicht zuvor als Ist-Dateien geschrieben. Insbesondere stammt der positive
Farbschritt aus der historischen Browseraufnahme. Der separate Speicherversuch
mit dieser Aufnahme ist eine kleine Funktionsprobe, **kein neuer öffentlicher
Export oder neuer Bediennachweis**. Beschädigte neue Kopien und Prozessausgaben
bleiben außerhalb des Repos; ursprüngliche 037-Kopien bleiben unangetastet.

Der Aufruf hält die alten Aufgaben/Bilder/Fingerabdrücke ausdrücklich fest. Er
ersetzt weder frisches Quellenlesen noch den echten Gesamtladelauf. Jeder neue
Darstellungscode ändert den aktuellen Fingerabdruck. Das alte Paket
`853165922030fb01941fd97e5d56f420bd3851ce417b2fae0097afb0972ea28e` erhält dadurch
keine neue Bindung oder Freigabe.

## Verbleibender vollständiger Auftrag

Nachtrag 21 erlaubt nur diese leichte Korrektur. Installation, neuer Export,
Gesamtladelauf, Pflichtbatterie und Browsermatrix sind jetzt **nicht freigegeben**.
Der Autor meldet den konkreten neuen Kopf, Basis, Diff, tatsächliche reine Tests
und einen vollständigen Befehlsplan zuerst auf der Karte und danach einmal dem
GG. Jeder spätere Lauf benötigt eine neue ausdrückliche Zuteilung; alte Runner
und verbrauchte Versuche sind keine Freigabe.

Nach Zuteilung bleiben am korrigierten, fest gebundenen Stand erforderlich:

1. Frischer Quellenbyte-/Lader-/Registerlauf und neuer Export; Quellenbasis,
   tatsächlicher Laufkopf und Darstellungsfingerabdruck getrennt dokumentieren.
2. Alle 20 tatsächlichen Ansichten bei 390 und 1440 Pixeln; interaktive Restore-
   Namenswahl, noch nicht gelöster Farbschritt, Farbe, Abschluss und Abbruch;
   vorhandene Eingabe-/Fehler-/Transferproben. Screenshots und Beobachtungen neu
   binden. Der historische `capture.mjs`-Runner wird durch diesen Text nicht
   gestartet oder genehmigt; die Sitzung verwendet ihre zugelassenen
   Browserwerkzeuge. Historische Bilder sind keine frischen Ansichten.
3. Frischer Paket-/Zuordnungs-/Archivabgleich, gezielte Sabotagen mit nachgezogenen
   Prüfsummen und positive Originalkontrolle; neue Pins erst nach diesen Toren.
4. Vollständiger Autor-, GG- und unabhängiger technischer Restauftrag einschließlich
   Installation nach Bedarf, allen 28 Pflichttoren und ergänzenden Revisionstests.
   Umfang und Reihenfolge werden am konkreten Kopf ausdrücklich zugeteilt.
5. Weiterhin getrennt: Klärung sämtlicher Quellen-/Antwortvarianten, Originalbild-
   und Unterrichtsvoraussetzungen, Kokis Register-/Musterurteil, eigene Architekturen
   für alle vier Jahrgänge. Keine Serien- oder Mergefreigabe aus technischen Tests.

Die 74 alten und 77 neueren Kandidaten, vier ursprünglichen Leserurteile,
insbesondere 030-Nein/031-begrenztes Ja und die fachliche p017-Sperre bleiben
unverändert. Der rote Autorenlauf, der falsche GG-Zusatzaufruf und sämtliche
historischen Grenzen bleiben erhalten. Technische Korrektur, unabhängige
technische Abnahme und sprachlich-didaktische Musterannahme sind getrennte Tore.
