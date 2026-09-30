# Zwei Kalibriersätze und Löserablauf

**CODEX DRAFT — NOT CANON.** Dieser Text ist für GG und Koki; den unabhängigen
Lösern wird ausschließlich das eingefrorene `solver/`-Paket gegeben.

**Nachtrag 11:** Die Beispiele unten sind historische W0-Entwürfe, keine fertigen
oder angenommenen Unterrichtsmuster. Vor der folgenden Fassung gelten sämtliche
[Anforderungslücken](ANFORDERUNGSLUECKEN.md), einschließlich Originalbuch-Bildsichtung
und getrennter Quellen-/Didaktikprüfung. Bestehende Löser erhalten weder eine
Umformulierung noch neue Autorenhinweise.

Je Unit stehen neun bestehende Aufgaben plus eine neue Transferfrage bereit.
Die Auswahl ist in `scripts/gg-revision/pilots.json` ausführbar festgelegt.
Die Transferaufgaben entstehen nur als Muster im Arbeitsspeicher; keine
bestehende Korpusdatei, Lösung oder Freigabe wird überschrieben.

| Pilot | Auswahl bestehender Aufgaben | Abgedeckte Handlung |
|---|---|---|
| g1-u01 | book/Kontext, pencil/Definition, rubber/DE→EN, chair/EN→DE | passende Wörter selbst eingeben |
| g1-u01 | imperatives.cp.002, plurals.gf.001, plurals.mp.001 | Aussage wählen, Lücke schreiben, Paare zuordnen |
| g1-u01 | Paint eraser.r1 und pencil.k3 | benennen, danach Farbe wiedergeben; Verbot auswählen |
| g3-u01 | audition/Kontext, tune/Definition, lyrics/DE→EN, brave/EN→DE | passende Wörter selbst eingeben |
| g3-u01 | present-simple.gf.002, mt.001, gs.004, ag.001 | zwei Lücken, Zuordnung, Gruppierung, Wörter ordnen |
| g3-u01 | ci.bens-line.ec.001 mit den ursprünglichen Szenen s007/s008 | Aussage im wirklichen Storykontext berichtigen |

## Registerbeispiele zur Beurteilung durch Koki

**Jahrgang 1**

✗ Not open the window!

✓ Don't open the window!

Soll jemand etwas nicht tun, beginnst du mit **Don't**.

Neue Transferfrage: *Die Klasse hört gerade zu. Dein Freund redet dazwischen.
Sag ihm auf Englisch, dass er nicht sprechen soll.*

**Jahrgang 3**

✗ She doesn't likes this song.

✓ She doesn't like this song.

Das **-s** steckt schon in **doesn't**. Dahinter bleibt das Verb in der Grundform.

Neue Transferfrage: *Du möchtest mehr über den Sänger wissen:
___ he ___ his own lyrics? (write)*

**Voraussetzung Jahrgang 3:** Fragen mit do/does und Hilfsverb vor dem Subjekt
müssen bereits eingeführt sein (SB3 Unit 1, S.12–13). Der Merksatz zur Verneinung
allein erklärt diese Wortstellung nicht. Der konkrete Unterrichtsstand ist
UNVERIFIZIERT; die Frage ist ein Transfer nach Einführung.

Das Beispiel zeigt eine Regel; die anschließende Frage verlangt ihre Anwendung
auf eine neue Situation. Natürlichkeit, sprachliches Register und Lernwert sind
Entwurfsurteile, die Koki noch bestätigen muss.

## Ablauf der beiden getrennten Löserkarten

1. GG friert den vollständigen Ordner `solver/` einschließlich Farb-Folgezustand,
   Stil und Bildern ein. Die SHA-256 des kanonisch geordneten `manifest.json`
   bezeichnet das Paket. Öffentliche Aufgaben heißen `p001` bis `p020`, Folgeschritte
   beispielsweise `p008-s01.html`, Assets `assets/a001.png`. Die echte Item-Kennung
   und ihre Zuordnung stehen ausschließlich in `private-mapping.json` außerhalb
   des Löserordners. Beide Löser erhalten denselben Stand, keine Schlüssel,
   Rohregister, private Prüfumgebung oder Autorbefunde.
2. Jeder Löser beantwortet alle 20 Aufgaben eigenständig und nennt weitere
   plausible Lösungen, unklare Reize, fehlenden Kontext und hinderliche Bedienung.
   Statische Buttons sind keine interaktive Funktionsprüfung. Hilfe-/Fehlerzustände
   außerhalb des Pakets dürfen nicht als gesehen ausgegeben werden.
3. GG sammelt die Antworten außerhalb des Produktrepos. Erst danach bewertet
   `grade-candidates.mjs` die tatsächlich vorgeschlagenen Antworten mit den echten
   Bewertungsfunktionen. Der Autor kann den Ablauf testen, aber kein fremdes Urteil
   ersetzen. Ein mechanisches `correct` ist noch kein fachliches Ja.
4. Abweichungen und gültige zusätzliche Antworten gehen ins Quellengegenlesen.
   Keine neue Serienarbeit vor beiden unabhängigen Urteilen und Kokis Registerurteil.

Antwortdatei (Platzhalter ersetzen; alle 20 **öffentlichen** Kennungen aus dem Manifest aufführen):

```json
{
  "readerSession": "VON-GG-BEAUFTRAGTE-LOESERSITZUNG",
  "packetSha256": "SHA256-DES-KANONISCHEN-MANIFESTS",
  "items": [
    {"publicId": "p001", "candidates": ["eigene Antwort"], "note": "Begründung oder Unsicherheit"}
  ]
}
```

Mehrere Lücken werden in ihrer sichtbaren Reihenfolge mit ` | ` getrennt.
Zuordnungen verwenden ein Objekt mit sichtbarem linken Text als Feldname und
gewähltem rechten Text als Wert. Gruppierung verwendet Mitglied→Gruppenname.
Restore verwendet `{"name":"eigene Wahl","colour":"eigene Wahl"}`.
Jeder Eintrag darf mehrere Antwortkandidaten enthalten. Keine Antwortbeispiele
mit realen Schlüsseln an Löser weitergeben.

```sh
node --import ./scripts/gg-revision/register.mjs scripts/gg-revision/grade-candidates.mjs /EXTERN/solver/manifest.json /EXTERN/private-mapping.json /EXTERN/antworten.json /EXTERN/auswertung.json
```

Die Auswertung prüft zunächst das gesamte Paket, seinen Darstellungscode und die
private Zuordnung gegen die aktuellen ausgewählten Aufgaben. Erst danach übersetzt
sie öffentliche Kennungen in echte Item-Kennungen. Vertauschte oder fehlende
Zuordnungen scheitern auch dann, wenn die Datei weiterhin die aktuelle Paketkennung
nennt. Die Prüfsumme der privaten Zuordnung steht im internen Bewertungsbericht.
Die Auswertung prüft außerdem Paketkennung und vollständige Antwortenmenge. Vor Verwendung
als Siegelbeleg muss außerdem `verify.mjs` bestätigen, dass aktuelle Quellen und
Darstellung noch zum Paket passen. Weder Antwortdatei noch Sitzungskürzel sind
eine Beglaubigung: GG gleicht die echte getrennte Board-Sitzung und deren Urteil ab.
Das erste, durch sprechende Kennungen verräterische W0-Paket ist ausdrücklich
ungültig; alte Paketkennungen und Urteile sind für den neuen Stand nicht verwendbar.

## Nachtrag 6 · tatsächliche Leserurteile

Beide getrennten Inhaltsleser (cgo-027/cgo-028) haben den alten Paketstand
`6941a9bb…` mit Nein zurückgegeben. [BEFUNDE.md](BEFUNDE.md) bewahrt alle 20
Lösungsräume samt tatsächlicher Annahme und Herkunft; [BEFUNDWEG.md](BEFUNDWEG.md)
begründet die Entscheidungen. Nur im eigenen neuen Jg.-1-Transfer werden
speak/talk samt Do not-/please-Varianten ergänzt. Der neue Antwortvertrag erhält
neue Pins; kein altes Urteil wird zu einem neuen Ja. Inhaltsfreigabe bleibt
gesperrt, auch wenn mechanische Prüfungen erfolgreich sind.

## Nachtrag 12 · zweiter abgeschlossener Lesedurchgang

Die neuen Leser cgo-030/031 haben das unveränderte Paket `85316592…` unabhängig
zurückgegeben. [BEFUNDE-N12.md](BEFUNDE-N12.md) enthält alle 77 Kandidaten,
ihre frische technische Annahme und getrennte fachliche Konsequenzen. 030-Nein
und begrenztes 031-Ja bleiben getrennt. GG bestätigt p017 als Sperre, obwohl
die sichtbare Subjektgruppierung technisch korrekt lösbar ist. Antworten dienen
der Diagnose; keine Aufgaben-/Schlüsseländerung in diesem Nachtrag. Der schwere
Restversuch N9 ist ausgesetzt bis zu einer neuen ausdrücklichen GG-Zuteilung.
