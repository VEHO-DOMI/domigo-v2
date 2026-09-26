# FOURTEEN: Grammatik sichtbar machen und sinnvoll wiederholen

**CODEX DRAFT — NOT CANON · ENTSCHEIDUNGSVORLAGE · welle-070 / Y3-A.**
Stand der Quellprüfung: `1c07f521d1035db90f9f53b65e8e2252d9e623f5` (26.09.2026).
Auftrag: `ORDER_DOMIGO_Y3_FERTIGSTELLEN_2026-09-20.md`, MD5 `472859cfe6bafd5f8603783d88e87b69`.
Datei:Zeile bezeichnet diesen Stand; bei späteren Änderungen zusätzlich am genannten Symbol orientieren.
**Entscheidung und Merge beim Architekten. Dieser PR baut keine Lernspur um.**

## 1. Ziel und Entscheidungsbedarf

Ein Kind, das in der Geschichte eine englische Verbform bildet, soll damit die entsprechende Grammatik der Unit üben und später mit dem notwendigen Szenenwissen wiederholen können. Reines Verstehen der Handlung bleibt Lesen. Die Geschichte bleibt erhalten (K-01); eine Antwort bekommt genau eine Buchung und die bestehenden Lernpunkte.

Empfehlung: **Weg 1 als Ziel beschliessen, Weg 3 als mögliche erste Ausbaustufe desselben Vertrags**, falls der vollständige Wiederholungsweg noch nicht freigegeben wird. Weg 3 allein erfüllt das Wiederholungsziel nicht. Die zehn vorhandenen Buch-Aufgaben bleiben bis zur Entscheidung und vollständigen Abnahme erhalten. Das gilt auch für Episode 1: Ihre story-eigene Fehlerkorrektur ist schon heute `.ci.` und damit kein weiterer Buch-Platz.

Die Lücke betrifft Zuordnung und Abruf, nicht fehlende Belohnung: `.ci.` erhält bereits Lernpunkte in `grammarXp` (der vorhandene Pool für alle Nicht-Vokabel-Versuche), erscheint im Spiel-/Unit-Aggregat und in der Klassenübersicht. Der technische Name dieses Punkte-Pools beweist **keine** erfasste Grammatikstruktur. „Nie wiederholt“ bedeutet hier: nicht automatisch in der fälligen Wiederholung; manuelles erneutes Spielen bleibt möglich.

## 2. Heutiger Weg eines Versuchs

**Kennungen:** `.gi.` bezeichnet eine Grammatikaufgabe aus einer Unit, `.ci.` eine story-eigene Aufgabe. `recap` ist der Name eines Aufgabenplatzes am Folgenende, keine dritte Speicherart. `kind` bezeichnet je nach Schicht entweder die Anzeigeform oder die gespeicherte Lernart — diese beiden Bedeutungen sind heute verschieden.

| Station | Tatsächliches Verhalten | Quelle |
|---|---|---|
| Inhalt laden | Der Year-3-Zweig lädt Unit und Story-Aufgaben. `storyItemsFor` verpackt `.ci.` als `kind: "grammar"` für die gemeinsame Aufgabenanzeige; `.gi.` kommt aus `unit.grammar`. Die Umformung ergänzt keine Strukturkennung. | `apps/web/app/(game)/play/[grade]/[zone]/page.tsx:43`, `:153` |
| Antwort im Spiel | `TaskTake` verwendet `GrammarItemView`, erhält die rohe Antwort und erzeugt eine neue `clientAttemptId` (eindeutige Kennung dieses Antwortversuchs), `mode: "game:g3"`. Erneutes Speichern desselben Versuchs verwendet dieselbe Kennung; erneutes Lösen erzeugt eine neue. | `packages/game-novel/src/NovelGame.tsx:46`, `:72`, `:89` |
| Transport / offline | `NovelClient.onAttempt` reicht die Antwort an `sendAttempt`; dieses sendet an `/api/attempts`. Bei vorübergehendem Fehler speichert die Outbox — der lokale Ausgangskorb — denselben Körper und dieselbe Kennung zum späteren Senden. Eine als Duplikat bestätigte Antwort zeigt null neue Punkte. | `apps/web/app/(game)/play/[grade]/NovelClient.tsx:95`; `apps/web/lib/attempt-outbox.ts:101`, `:122`, `:145` |
| Erneut bewerten | Der Server prüft Identität und Eingabe, löst die Kennung auf und bewertet anhand des geladenen Originals mit `gradeGrammar`. Er übernimmt weder Punkte noch Lernart vom Browser. `.gi.` erhält `ref.kind = grammar`; **jede `.ci.` wird hart `reading`**. | `apps/web/app/api/attempts/route.ts:60`, `:91`, `:138` |
| Versuch speichern | `recordAttempt` schreibt `practice_attempts`: Item, Unit, Lernart, Modus, Bewertung und Punkte. Der eindeutige Index auf Benutzer + Versuch verhindert die zweite Einfügung desselben Versuchs. | `packages/db/src/persist.ts:41`; `packages/db/src/schema.ts:30`, `:65` |
| Wiederholung vormerken | Nur bei erster Einfügung und `kind` Vokabel/Grammatik: `updateReviewQueue`. Pro Benutzer + Item ein Eintrag. Korrekt steigt eine Lernbox, falsch setzt auf Box 1; die nächste Fälligkeit folgt daraus. Lesen überspringt diesen Schritt. | `packages/db/src/persist.ts:68`; `packages/db/src/review.ts:16`, `:25`, `:43`; `packages/db/src/schema.ts:69` |
| Punkte / Lernserie | Bei erster Einfügung gehen Vokabelpunkte in `xp`, **alle anderen** in `grammarXp`; auch `.ci.`. Die Lernserie hängt am Übungstag, nicht an richtiger Antwort. | `packages/db/src/persist.ts:78` |
| Fälliges anzeigen | `/review/session` lädt fällige Kennungen, anschliessend nur Unit-Dateien; findet Items ausschliesslich in `unit.vocab` / `unit.grammar`. Fehlende Items werden übersprungen. Eine `.ci.` bloss in die Warteschlange einzutragen würde deshalb keinen sichtbaren Wiederholungsweg schaffen. | `apps/web/app/review/session/page.tsx:15`, `:31` |
| Wiederholungsantwort | `ReviewSession.onResult` sendet wiederum dieselbe Antwortart an denselben Serverweg, jetzt mit `mode: "review"` und neuer Versuchkennung. | `apps/web/app/review/session/ReviewSession.tsx:23` |
| Sichtbarer Fortschritt | Gelöste Spiel-Items und Lehrer-Unit-Zahlen lesen `practice_attempts` mit `game:g3`, ohne Filter auf `kind`. Die Klassenübersicht zählt ebenfalls Versuche, hier über alle Modi. Keine der beiden Abfragen gruppiert nach Grammatikstruktur. | `packages/db/src/game-progress.ts:22`, `:55`; `packages/db/src/class-progress.ts:43` |

| Aufgabenart | Anzeige | `practice_attempts.kind` | Automatische Wiederholung | Fachliche Zuordnung |
|---|---|---|---|---|
| `.gi.` Buch-Aufgabe | gemeinsamer Grammatik-Renderer | `grammar` | ja, normale Unit-Aufgabe | `structureId` aus dem geladenen Item; nicht als eigene Spalte im Versuch gespeichert |
| `.ci.` story-eigene Grammatikarbeit | derselbe Renderer | `reading` | nein | Schema hat kein `structureId` |
| `recap` (in FOURTEEN `.ci.`) | derselbe Renderer | `reading` | nein | Szenenverständnis, keine automatisch ableitbare Grammatikkompetenz |

Das Schema `ComprehensionItem` hat gemeinsame Bewertungsfelder, aber weder `structureId` noch `presentation` (`packages/content-schema/src/index.ts:1665`). Die Strukturkennung eines echten Grammatik-Items ist dagegen verpflichtend und an dessen Kennung gebunden (`:796`, `:830`). Das blosse Ergänzen eines Feldes in der Inhaltsdatei schafft daher noch keinen durchgängigen Vertrag. Strukturabhängige Fehlerklassifikation liest `item.structureId` (`packages/engine/src/classify.ts:160`); auch hier ist „wird angezeigt wie Grammatik“ nicht gleich „wird als diese Struktur analysiert“.

**Grenze der heutigen Doppelbuchungssicherung:** Die erste Einfügung schützt vor erneutem Zählen derselben Kennung; `recordAttempt` umfasst aber mehrere getrennte Schreibaufrufe. Ein Abbruch nach dem Einfügen und vor Queue/Punkten ist damit nicht als vollständig wiederherstellbar bewiesen (`persist.ts:47–116`). Für einen späteren Umbau sind echte Datenbank-Fehlerproben nötig. Kein Nebenfix in Y3-A.

## 3. Drei mögliche Wege

Die Aufwände sind Planungsgrössen für Implementierung samt Tests, keine gemessenen Laufzeiten oder zugesagten Termine. Geschätzt für eine ausführende Person nach Architekturfreigabe; unabhängige Inhaltslesung und GG-Abnahme kommen hinzu. Alle drei Wege verwenden den vorhandenen Bewertungs- und Punkteweg.

### Weg 1 — Story-Grammatik mit Strukturkennung, Wiederholung in ihrer Original-Szene

**Vertrag:** Ein ausdrücklich markierter Teil der Story-Items erhält eine geprüfte `structureId`, Lernart Grammatik sowie Story-/Kapitel-/Szenenbezug. Die fachliche Kennung und der Anzeige-Kontext sind zwei getrennte Eigenschaften. Plotfragen bleiben Lesen. Der Server leitet beides aus dem Inhalt ab; Angaben des Browsers reichen nicht. Auch eine grammatische Oberfläche ist kein ausreichender Nachweis: z.B. `was reading`, `would stop` und die akzeptierten Formen `have reached` / `have been reaching` müssen anhand des tatsächlich geforderten Lernziels einzeln zugeordnet werden. Eine zugelassene Alternativantwort darf nicht unsichtbar eine andere Struktur als „beherrscht“ verbuchen.

Die Wiederholung zeigt den notwendigen Originalausschnitt vor derselben Aufgabe, ohne künftige Handlung zu verraten oder die ganze Episode erneut zu verlangen. Einmalige Wiederholungsantwort → ein `recordAttempt` → dieselben Punkte und derselbe Zeitplan. Der Wiederholungsmodus darf keine neuen Story-Abschlüsse oder Kanalereignisse auslösen. Fällige Story-Aufgaben müssen in der zentralen Wiederholung erreichbar sein, auch wenn das Kind keine weitere Episode öffnet.

**Betroffene Dateien / Bereiche:** `packages/content-schema/src/index.ts` (unterscheidbarer Story-Grammatik-Vertrag und Versionsregel); `content/overlays/g3-fourteen-feedback.json`, `content/corpus/stories/g3.st.fourteen/{story,comprehension}.json` (einzeln geprüfte Zuordnung); `packages/content-pipeline/src/` (Validierung von Struktur, Szene, Niveau und Referenzen); `apps/web/app/api/attempts/route.ts` (vertrauenswürdige Klassifikation); `packages/db/src/{persist,review,schema}.ts` und gegebenenfalls Migration (dauerhafter Review-Kontext); `packages/content-loader/src/` und `apps/web/app/review/session/{page,ReviewSession}.tsx` (Story-Auflösung mit Szenenausschnitt); `NovelClient.tsx`, `packages/game-novel/src/NovelGame.tsx` (optionaler Einstieg); Lehrer-Auswertung in `packages/db/src/{game-progress,class-progress}.ts` und den zugehörigen Admin-Ansichten. Konkrete neue Felder/Dateien erst nach Freigabe festlegen.

**Verhältnis zu PR #452:** Auf dessen geprüftem Kopf `e95d0aaf9182309647d67bd08f36e8dc8ca214f4` ergänzt `persist.ts` `reviewContext?: "unit" | "story"` und sperrt `story` aus der Unit-Queue aus. Das löst bereits die notwendige Trennung, aber **noch keine Story-Wiederholung**: Der Schalter ist dort nur Eingabe, kein gespeicherter Queue-Kontext. Darauf aufbauen, ihn nicht für Y3 umgehen. Vor Freigabe einer Story-Queue deren Speicherung, Filter und Auflösung gemeinsam liefern; die alte Unit-Sitzung darf keine unauflösbaren `.ci.`-Referenzen erhalten.

**Aufwand:** gross, etwa 5–8 Arbeitstage. **Risiken:** falsche Kompetenzzuordnung, fehlender Originalkontext, alte Offline-Antworten, fehlende Wiederholungsauflösung, doppelte Zählung bei parallelen Lesern; vollständiger Durchstich nötig. Bestehende `.ci.`-Kennungen möglichst stabil halten; historische Leseversuche nicht als neue Versuche kopieren und keine rückwirkenden Punkte vergeben. Historische Auswertung braucht eine explizite Versionierungsentscheidung.

**Kind:** lernt an der gleichen Geschichte und sieht später eine kurze verständliche Wiederaufnahme. **Lehrkraft:** kann nach Unit und Struktur sehen, was tatsächlich geübt wurde, getrennt von reinem Handlungsverständnis; bestehende Gesamtsummen bleiben erhalten. Diese differenzierte Ansicht muss mitgebaut werden — Metadaten allein machen sie nicht sichtbar.

### Weg 2 — Szenen-Varianten echter `.gi.`-Items

Vorhandene Unit-Aufgaben mit passender Struktur bleiben das bewertete Original. Eine Variante verändert ihren Szenenrahmen. Normale Wiederholung zeigt die weiterhin eigenständig lösbare Buchfassung; die Antwort wird weiterhin auf dieselbe `.gi.`-Kennung gebucht. Keine zweite Antwort für die Variante anlegen.

**Betroffene Dateien / Bereiche:** `content/corpus/units/g3-u*/grammar.json` (`presentation.variants`), `content/corpus/stories/g3.st.fourteen/{variants,story}.json`, Varianten-Werkzeug in `packages/content-pipeline/src/`, `storyItemsFor` in der Kapitelroute; zugehörige Inhaltsprüfungen und Dokumentation. Der bestehende Renderer ersetzt nur `prompt.text` und Glossar, nicht Antworten, Ablenker, Paare oder Satzteile (`page.tsx:64–68`). Die frühere welle-048-Fassung ist dokumentiert in `docs/handover/grades/g3.md:215`; heutige Live-Bindungen daraus sind entfernt.

**Bekannte Schwäche:** „Tauscht nur den Satz“ darf nicht als beliebiger neuer Satz mit neuem Schlüssel missverstanden werden. Eine echte Umformung der Lösung wäre ein neues Item, keine Präsentationsvariante. Ein Rahmensatz kann zudem bei Fehlerkorrektur mit in die Antwort geraten. Strukturpassung allein stellt keine Szenenpassung her. Neu erzeugte `.gi.`-Träger können in normale Übung/Tests gelangen; Pools und Reservierungen sind daher mitzudenken.

**Verhältnis zu #452:** Für reguläre, eigenständig lösbare Unit-Items `reviewContext: "unit"` beibehalten; so bleibt die vorhandene Queue nutzbar. Sobald eine Aufgabe die Szene benötigt, muss sie nach #452 `story` werden und wäre ohne Weg 1 wieder von Wiederholung ausgeschlossen. Nicht pauschal sämtliche Spiel-Grammatik als `story` markieren.

**Aufwand:** mittel, etwa 2–4 Arbeitstage für eine begrenzte Auswahl mit Inhaltstoren; kein Angebot, alle 44 Story-Plätze umzubauen. **Risiko:** fachlich passende, aber erzählerisch fremde Aufgaben und unbemerkter Einfluss auf Buchübungen. **Kind:** Szene im Spiel, später Buchfassung. **Lehrkraft:** bestehende Grammatik-Zuordnung, aber ohne zusätzliche Auswertung kein Nachweis, in welcher Variante das Kind gearbeitet hat. **Urteil:** gezieltes Werkzeug, kein allgemeiner Ersatz für die story-eigene Aufgabenarbeit.

### Weg 3 — Analyse-Kennung ohne Warteschlange

Story-Grammatik erhält eine geprüfte Lernart/Struktur und wird serverseitig einmal als Grammatik erfasst, bleibt mit `reviewContext: "story"` aber aus der normalen Wiederholung ausgeschlossen. Reine Recaps bleiben Lesen. Den Analysebezug entweder versioniert im vorhandenen `context` speichern oder über eine versionierte Inhaltszuordnung auflösen; der Architekt entscheidet den dauerhaften Vertrag. Ein vom Browser frei behauptetes Analysefeld ist unzureichend.

**Betroffene Dateien / Bereiche:** Schema, Overlay/Story-Inhalt und Inhaltsvalidierung wie in Weg 1; `apps/web/app/api/attempts/route.ts`; `packages/db/src/persist.ts` zur Übernahme des #452-Schalters; Lehrer-Abfragen und Admin-Anzeigen für Struktur-Aggregate. Keine Änderungen an Review-Lader oder Wiederholungsoberfläche nötig; neue Speicherfelder würden dennoch eine Migration verlangen. Bestehendes `context` kann eine Migration vermeiden, ersetzt aber nicht die Vertrauensprüfung.

**Verhältnis zu #452:** unmittelbar kompatibel mit dessen Absicht: Grammatik zählt fachlich, szenengebundene Items werden nicht im falschen Kontext gezeigt. **Aufwand:** klein bis mittel, etwa 2–3 Arbeitstage. **Risiko:** ein schönerer Bericht wird als geschlossener Lernkreislauf missverstanden. Die Lehreransicht muss ausdrücklich „im Spiel geübt, keine automatische Wiederholung“ unterscheiden. **Kind:** zunächst unverändertes Spiel und unveränderte Lernpunkte. **Lehrkraft:** präzisere Zuordnung, aber keine Aussage über späteren Abruf. **Urteil:** ehrliche Zwischenstufe, keine Fertigmeldung der Lernspur.

## 4. Der tote Faden `reviewItems`

Die G3-Route setzt `reviewItems={[]}` (`page.tsx:172`); `NovelClient` reicht es durch (`NovelClient.tsx:30`, `:105`); `NovelGameProps` deklariert es (`NovelGame.tsx:31`), die Komponente liest es nicht (`:99` ff.). Es fehlt also sowohl ein Datenlieferant als auch eine sichtbare Nutzung. Der G2-Zweig der gemeinsamen Route lädt eigene fällige Items; das ist kein funktionierender G3-Weg.

**Empfehlung zusammen mit Weg 1:** kurze, freiwillig aufrufbare Wiederholungs-Szene am Folgenanfang mit eigener Zustandsführung, notwendigem Originalausschnitt und fortsetzbarem Speicherstand. Fällige Items zentral laden, nur bereits erlebte Szenen zeigen, reservierte Testitems ausschliessen (bestehende Regel in `review.ts:124`), erfolgreiche Wiederholung genau einmal buchen. Die normale Episode muss ohne künstlichen Zeitdruck weiter erreichbar bleiben. Ein blosses Anzeigen der aktuellen leeren Prop-Liste erfüllt nichts. Zentrale Wiederholung bleibt zweiter Einstieg in denselben Mechanismus, kein zweiter Buchungsweg.

**Wenn der Architekt vorerst nur Weg 3 freigibt:** den toten Prop-Vertrag sauber entfernen (G3-Aufruf, `NovelClient`-Typ/Durchgabe, `NovelGameProps`); kein vorgetäuschtes Wiederholungsversprechen. Umfang klein, unter einem Arbeitstag inklusive Typprüfung. G2/G4 und die gemeinsame Queue nicht nebenbei ändern. Später ein ausdrückliches, kontextfähiges Interface statt eines unbenutzten Arrays einführen. **In diesem PR wird weder verdrahtet noch entfernt.**

## 5. Umsetzung und Abnahme der Entscheidung

1. Architekt entscheidet Lernart-/Kontext-Vertrag und historische Auswertung; mit dem offenen #452 und der Year-3-Motorbahn abstimmen. Keine parallelen Änderungen an `persist.ts` ohne gemeinsame Basis.
2. Eine story-eigene Grammatikaufgabe durchgängig kalibrieren: Inhalt → Serverbewertung → eine Buchung → fachliche Lehreransicht → fällige Wiederholung mit Originalausschnitt. Handlungs-Recap als negative Kontrollprobe behalten.
3. Erst nach bestandenem Durchstich die weiteren fachlich geeigneten Story-Aufgaben einzeln zuordnen. Zwei blinde Löser je neuer/geänderter Aufgabe, einschliesslich alternativer Antworten gegen die echte Bewertung.
4. Echte Datenbankproben: Erstlösung, falsche Antwort, Wiederholung, doppelte Übermittlung, offline/nachträgliches Senden, Abbruch zwischen Teilbuchungen, alte Kennungen; fremder Klassenumfang bleibt ausgeschlossen. Wiederholung darf weder Story-Fortschritt noch Punkte doppelt erzeugen.
5. Geänderte Oberfläche auf 390/1440 px und hell/dunkel spielen, mit Originalkontext und Wiedereinstieg; erst dann die Lernspur als geschlossen melden.

**In Y3-A umgesetzt:** der bestehende dateibasierte Abgleich `node scripts/story/apply-g3-feedback.mjs --check` wird im Job `content-validate` automatisch ausgeführt. Keine Aufgaben, Antworten, Story-Szenen, Lernbuchungen oder Produktoberflächen geändert. Die zehn Buch-Plätze bleiben erhalten. Formatmessung und Einzelprüfung der Buch-Plätze sowie lokale Tore, Sabotageprobe und Konfliktprüfung stehen im PR-/Board-Bericht; Rohlogs bleiben ausserhalb des Repos.

**Wie geprüft / Grenze:** statische Verfolgung der tatsächlichen Quellpfade, Inhaltsinventur und Tests des dateibasierten Abgleichs. Diese Vorlage behauptet keine Messung echter Schülerdaten und keine neue Datenbank-/Browserabnahme. Dauerhafte Speicherung, Produktionsverhalten und die vorgeschlagenen Lernwege sind **UNVERIFIZIERT bzw. GEPLANT**, nicht gebaut. Veraltete Beschreibungen in `grades/g3.md` (u.a. alter Variantenstand und Review-Status von #460) nur festgestellt; dessen vollständige Aktualisierung gehört laut Order zu Y3-C.
