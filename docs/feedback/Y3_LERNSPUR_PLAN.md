# FOURTEEN: Grammatik und Wiederholung in der Originalszene

**CODEX DRAFT — NOT CANON · cgo-095 · Weg 1 implementiert, Abnahme offen.**
Basis: `4f0975f856c54496cfbae2a979ea5b219a3c1531` (08.10.2026). Auftrag: Board-Karte cgo-095, GG-Entscheid vom 07.10.2026. Kein Merge durch Codex.

15 von 44 Story-Aufgaben erhalten eine Struktur-Kennung aus ihrer Unit. Die übrigen 29 bleiben Lesen. Der Wortlaut, die Antworten und akzeptierten Varianten bleiben unverändert; der Antwortschlüssel-Pin bleibt unverändert gültig. Die zehn Buch-Aufgaben in den Folgen 2–11 bleiben `.gi.`.

## Gebauter Weg

1. `ComprehensionItem.structureId` ist optional. Schema und Szenenauflösung prüfen gleiche Unit, wirkliche Unit-Struktur und Originalszene. Die Story-Kennung enthält einen Szenenschlüssel, nicht den Struktur-Namen; ihre Schlüssel müssen deshalb nicht gleich heißen.
2. Die bestehende Versuchsroute bewertet alle Antworten mit `gradeGrammar`. Mit Struktur-Kennung speichert sie `grammar` und `reviewContext: "story"`, ohne Kennung weiterhin `reading`. Punkte werden unverändert aus Schwierigkeit und Bewertung auf dem Server berechnet. Alle Nicht-Vokabelpunkte liefen bereits vorher in `grammarXp`; neu sind die fachliche Lernart und Wiederholbarkeit, kein zweiter Punktepool.
3. Story-Grammatik kommt in dieselbe Leitner-Warteschlange wie Unit-Grammatik. Der Kontext ergibt sich aus `.ci.`; keine Spalte, keine Migration. Eine falsche Antwort wird nach den bestehenden zehn Minuten fällig; eine richtige Wiederholung aus Box 1 nach einem Tag. „Nicht mehr fällig“ bedeutet nicht, dass die Aufgabe gelöscht wird.
4. Unit-Leser und Unit-Zähler filtern `.ci.` vor ihrer Mengenbegrenzung aus. Story-Leser erhalten `{storyId, itemIds}` aus freigegebenen, strukturgeprüften Originalszenen (die Item-Kennung allein nennt keine Geschichte). Zähler sind unbegrenzt, der Folgenstart lädt höchstens drei fällige Aufgaben.
5. Vor der neu geöffneten oder fortgesetzten Folge erscheint „Noch einmal aus Folge n“. Die Zeilen bis einschließlich der ursprünglichen Aufgabenszene stehen davor; keine Szene bedeutet keine Aufgabe. „Aufgabe öffnen“ beginnt bewusst, „Später“ überspringt die gesamte angebotene Wiederholung. Keine Uhr und kein automatischer Weiterlauf.
6. Die vorhandene Aufgabenanzeige und `onAttempt` werden wiederverwendet. Jede Anzeige erhält eine neue Versuchskennung; erneutes Speichern desselben Versuchs behält sie. Wiederholte Rückmeldungen derselben Anzeige werden ignoriert. Kein Wiederholungs-Callback verändert Folgenplatz, bearbeitete Plätze, Kommentarwerte oder Kanalzahlen.
7. `/review` zeigt für Year 3 den Story-Zähler und eine Tür in die Originalfolge der zuerst fälligen Aufgabe. Aufgaben selbst werden dort nicht angezeigt. Vorschau zeigt eine beschriftete Tür ohne persönlichen Zähler und liest keine Fälligkeit; sie sendet keine Antworten.

## Warum Weg 1

Weg 2 — Story-Sätze an zusätzliche Unit-Aufgaben oder eine zweite Buchung koppeln — würde die sichtbare Aufgabe von der gespeicherten Leistung trennen und doppelte Buchungen begünstigen. Weg 3 — nur Grammatik markieren, ohne Szenenwiederholung — würde falsche Antworten weiterhin ohne passenden Wiederholungsort lassen. Weg 1 erhält eine Aufgabe, eine Bewertung, einen Punktepool und ihren notwendigen Dialog.

## Fachliche Grenze

Beide unabhängigen Löser beurteilen alle 15 zugeordneten Produktionsaufgaben als Grammatikarbeit; alle 30 Hauptlösungen werden von der echten Bewertungsfunktion anerkannt. Vier zusätzliche Kandidaten bleiben nach übereinstimmendem Urteil Lesen: `travel-video-timing`, `channel-time-notes`, `permission-timeline`, `recording-all-along`. Sie lassen sich über Wortbedeutung oder Handlung lösen, ohne die abgebildete Grammatik unterscheiden zu müssen.

Offene Altbefunde bei unverändertem Schlüssel: `saras-channel` (has got / does have), `reading-for-camera` (read unter abgeschlossener Lesart), `listen-if-he-asks` (could/might/should stop mit anderer Modalität). Die Löser unterscheiden zwischen grammatisch möglicher Alternative und naheliegender Ziellösung. Dazu ein Einzelbefund für `bens-line`: weiter gehende Korrektur mit present continuous. Keine dieser Schlüsseländerungen ist durch diese Karte freigegeben.

## Offene Abnahmegrenzen

- Der bestehende `apply-g3-feedback --check` ist bereits in CI. Er ersetzt Aufgabenobjekte vollständig aus `content/overlays/g3-fourteen-feedback.json` und verwirft damit die neuen Kennungen. Er ist rot; Overlay und Anwenderskript liegen außerhalb des Änderungszauns. Erforderlicher Folgeschritt: die 13 neu markierten Overlay-Aufgaben in der handverfassten Quelle ebenfalls additiv kennzeichnen (die beiden Aufgaben aus Folge 1 liegen nicht im Overlay).
- Der Herkunftswächter `check-claim-filter` verlangt für den zusätzlichen Aufruf der reservierten Klassenaufgaben eine Eintragung in `scripts/claim-filter-aufrufer.json`. Die Kennung kommt in beiden Aufrufern aus der angemeldeten Kindersitzung. Das Register liegt außerhalb des Zauns; keine Umgehung oder Lockerung der Prüfung.
- Der lokale gespielte Nachweis ersetzt Identität und SQL-Transport durch künstliche Testdaten. Der echte PostgreSQL-Betrieb sowie die vollständige Performance-Messung aller Phasen bleiben für die GG-Kette offen.

Vollbatterie: UNVERIFIZIERT, läuft in der GG-Kette. Der PR enthält die tatsächlichen lokalen Exit-Codes, Manipulationsnachweise und Bildpfade.
