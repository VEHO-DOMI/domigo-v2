# Textregister · Lehrerbereich

CODEX DRAFT — NOT CANON · cgo-041. Quellenprüfung der neuen Start-/Klassenflächen; **gerenderte Prüfung ausstehend**. Platzhalter in geschweiften Klammern sind Daten, keine zusätzlichen feststehenden Texte. Die unten genannten Dateien liegen unter `apps/web/app/admin/`. Bestehende Zielseiten und die zentrale Kopfzeile bleiben unverändert; ihr Wortlaut wird nicht als neu geprüfte Oberfläche ausgegeben.

## Rahmen und Navigation

| Quelle | Vollständiger Wortlaut | Funktion / Prüfung |
|---|---|---|
| `_components/TeacherShell.tsx` | Zum Inhalt | Tastatur-Sprung zum Hauptinhalt |
| ebenso | Lehrerbereich | Vorgelesener Navigationsname |
| ebenso | DomiGo · Lehrerbereich | Kleine Bereichsangabe |
| ebenso | Klassen werden geladen … | Angesagter Ladezustand |
| `_lib/navigation.ts` | Meine Klassen; Aufgaben; Schreiben; Verwaltung; Hilfe | Alle Einträge der ersten Navigation |
| ebenso | Klassen verwalten | Klassenverwaltung öffnen |
| ebenso | Klassenlisten, Beitrittscodes und Archiv öffnen. | Erklärung dieses Wegs |
| ebenso | Aufgaben zusammenstellen | Aufgabenbaukasten öffnen |
| ebenso | Übungen, Checkups und Schularbeitsproben vorbereiten. | Erklärung dieses Wegs |
| ebenso | Aufgaben im Studio bearbeiten | Bestehendes Studio öffnen |
| ebenso | Vorhandene Aufgaben bearbeiten oder eine neue Aufgabe anlegen. | Erklärung dieses Wegs |
| ebenso | Kontoeinstellungen | Kontoseite öffnen |
| ebenso | Die Angaben zu deinem Konto nachsehen. | Keine neue Passwortverwaltung versprochen |
| ebenso | Spielstand nach Chapter; Spiele erproben | Getrennte weitere Werkzeuge |
| ebenso | Großmeister: alle Klassen | Nur für bestehende Großmeisterrolle |

## Seiten und Klassen

| Quelle | Vollständiger Wortlaut | Zustand / Prüfung |
|---|---|---|
| `page.tsx` | Meine Klassen | Startüberschrift |
| ebenso | Öffne eine Klasse, um Fortschritt und Abgaben anzusehen. | Einstieg erklärt konkrete Handlung |
| ebenso | Schreibabgaben | Überschrift im Schreibbereich |
| ebenso | Wähle eine Klasse, um ihre Schreibabgaben zu lesen und zu bearbeiten. | Direkter Weg zu vorhandener Funktion |
| ebenso | Spielstände werden geladen … | Ladezustand der getrennten Statistik |
| `classes/page.tsx` | Klassen verwalten | Verwaltungsüberschrift |
| ebenso | Öffne eine Klassenliste oder kopiere den Beitrittscode deiner Klasse. | Vorhandene Aktionen |
| `classes/ClassesManager.tsx` | Klassen anlegen, umbenennen und archivieren kannst du im Lehrerzimmer von Lauter Einser. | Tatsächlicher zentraler Vertrag |
| ebenso | Zum Lehrerzimmer | Echter bestehender Konto-Link |
| `_lib/teacher-classes.ts` | Jahrgang {1–4}; Jahrgang nicht verfügbar | Jahrgang, niemals Schuljahr genannt |
| `_components/ClassDirectory.tsx` | · Schuljahr {belegter Wert} | Nur bei bestätigtem Wert; am realen Ausgang weggelassen |
| ebenso | {Klassenname} | Unverändert aus autorisiertem Leser, HTML wird vom Framework maskiert |
| ebenso | Testklasse; Testklassen | Nur bestätigter Marker; am realen Ausgang unbekannt |
| ebenso | Klasse öffnen; Schreibabgaben | Primärer Klassenweg, abhängig vom Bereich |
| ebenso | Klasse öffnen: {Klassenname}; Schreibabgaben: {Klassenname} | Vorgelesener Name des Primärlinks |
| ebenso | Weitere Wege für {Klassenname} | Vorgelesener Name der klassenbezogenen Navigation |
| ebenso | Fortschritt; Schreiben; Hören; Klassenliste | Tatsächlich vorhandene Detailwege |
| ebenso | Archiviert am {Datum in de-AT} | Nur tatsächliches Archivdatum; Europe/Vienna |
| ebenso | Aktive Klassen; Archivierte Klassen | Abschnittsnamen, Archiv auch aufklappbar |
| ebenso | Keine aktive Klasse | Nur erfolgreiche Liste ohne aktive normale/unbekannte oder bestätigte Testklasse |
| ebenso | Deine Lehrgruppen verwaltest du im Lehrerzimmer von Lauter Einser. | Erklärung des echten Leerzustands |
| ebenso | Zum Lehrerzimmer | Bestehende Klassenanlage bleibt erreichbar |
| ebenso | Keine archivierte Klasse vorhanden. | Nur erfolgreicher leerer Archivleser |
| `_components/ReadError.tsx` | {Aktive Klassen / Archivierte Klassen / Spielstände für Jahrgang N} konnten nicht geladen werden. | Angesagter Fehler, keine Ersatz-Null |
| ebenso | Die Anzeige ist unvollständig. Bitte lade die Seite erneut. | Handlungsfähige Fehlermeldung ohne technische Details |
| ebenso | Erneut laden; Hilfe öffnen | Echte Navigation, Neuaufruf erzwingt erneute Serverlesung |
| `_components/TeacherAccessError.tsx` | Lehrerbereich; Deine Klassen und Aufgaben. | Überschrift bei nicht lesbarer Lehreridentität |
| ebenso | Dein Lehrerzugang konnte nicht geladen werden. | Tatsächlich geworfener Zugangsfehler gemäß GG-N5 |
| ebenso | Bitte lade die Seite erneut. Deine Klassen sind derzeit nicht verfügbar. | Keine falsche Aussage über eine leere Liste |
| ebenso | Erneut laden; Hilfe öffnen | Echte Neuaufruf-/Hilfetüren |
| `_components/CopyClassCode.tsx` | Beitrittscode; Kopieren | Nur in Klassenverwaltung |
| ebenso | Beitrittscode für {Klassenname} kopieren | Eindeutiger vorgelesener Knopfname |
| ebenso | Code kopiert. | Erst nach erfolgreichem Kopieren |
| ebenso | Kopieren nicht möglich. Markiere den Code und kopiere ihn selbst. | Auch fehlende Zwischenablage-Funktion ist ein Fehler |
| ebenso | {Beitrittscode} | Autorisierte reale Klasse; keine Codes in Berichten/Bildern außer synthetischen Werten |

## Verwaltung und erhaltene Nebenwege

| Quelle | Vollständiger Wortlaut | Funktion / Prüfung |
|---|---|---|
| `_components/TeacherManagement.tsx` | Verwaltung | Seitenüberschrift |
| ebenso | Klassen organisieren, Aufgaben vorbereiten und deine Kontodaten ansehen. | Konkrete Zwecke |
| ebenso | Zum Lehrerzimmer | Bestehender zentraler Weg |
| ebenso | Lehrgruppen und Klassenlisten zentral bei Lauter Einser pflegen. | Erklärung dieses Wegs |
| ebenso | Weitere Werkzeuge | Trennt seltenere Aufgaben |
| ebenso | Großmeisterzugang | Vorgelesener Name der geschützten Gruppe |
| ebenso | Die Klassen der gesamten Plattform mit ihren bestehenden Verwaltungswegen. | Keine neue Statistik-/Filtergarantie |
| `_components/StoryMastery.tsx` | ← Verwaltung | Rückweg |
| ebenso | Spielstand nach Chapter | Überschrift |
| ebenso | Die bisherige Spielübersicht über die Klassen, für die du Zugriff hast. | Vorhandenen Umfang klar benannt |
| ebenso | Jahrgang {N} · {Originaltitel der Story} | Namen aus bestehendem Korpus; englischer Eigenname bleibt Eigenname |
| ebenso | Noch keine Spielversuche vorhanden. | Nur erfolgreicher leerer Leser |
| ebenso | Spielstand Jahrgang {N} | Vorgelesener Tabellenbereich |
| ebenso | Chapter; Versuche; Gelöste Aufgaben; Richtig | Vollständige Tabellenköpfe |
| ebenso | Chapter {Nummer}; Chapter nicht zugeordnet | Bestehende Einheitenangabe verständlich dargestellt |
| ebenso | {Versuche}; {gelöste Aufgaben}; {gerundeter Anteil} %; — | Bestehende Messwerte; bei null Versuchen kein behaupteter Anteil |
| `_components/GameExploration.tsx` | ← Verwaltung | Rückweg |
| ebenso | Spiele erproben | Getrennte Erprobungsseite |
| ebenso | Vorhandene Entwicklungsstände für Lehrkräfte öffnen. | Keine neue Schülerfreigabe |
| ebenso | Du spielst hier mit deinem Lehrerzugang. Diese Spiele können deinen eigenen Spielstand speichern. Das ist keine Schüleransicht ohne Speicherung. | Sichtbare Erklärung der bestehenden Speicherwirkung |
| ebenso | Story-Spiel · Jahrgang 1; Weltkarte öffnen | Bestehende Weltkarte |
| ebenso | Wächter-Duelle; Das gemalte Buch | Bestehende Spieltüren |
| ebenso | Chapter {Nummer} | Nur tatsächlich ladbare/verfügbare Kapitel, kein pauschaler Platzhalter |

Die rein dekorativen Pfeile `↗` sowie die umrandete Jahrgangszahl sind für Vorlesesoftware ausgeblendet; Rückpfeile bleiben Teil der Rücklinks. Es gibt keine neuen bildgebundenen Texte oder Alternativtexte. Interne Fehlermeldungen wie `Unknown teacher class action` und `Clipboard unavailable` werden nie als Oberflächentext ausgegeben.

## Offene Prüfung

Beim echten Durchlauf jedes dieser Elemente im jeweiligen Zustand mit sichtbarem Text und vorgelesenem Namen abgleichen. Insbesondere langes Klassenlabel, alle Jahrgänge, ausschließlich Testklasse, fehlendes Schuljahr, Archivdatum, sämtliche Fehler und Kopierstatus prüfen. Keine Auflösung dieser Liste durch bloße Suche nach englischen Wörtern: Zustandsrichtigkeit, echte Ziele und sichtbare Verständlichkeit sind Teil der Prüfung. Hilfe und Kontoeinstellungen enthalten im unveränderten Bestand weiterhin englische/alte Texte; als Grenze an GG melden, nicht außerhalb des Dateizauns korrigieren.
