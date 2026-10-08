# cgo-098 · Y1 Paket E · Tempo-Messung 2026-10

**CODEX DRAFT — NOT CANON · Messbericht zur GG-Prüfung · 08.10.2026.**

Berichtsdatei: `docs/feedback/cgo-098_TEMPO_MESSUNG_2026-10.md` · Nachzug 1: Dateiname berichtigt und Folge-PRs priorisiert; Messwerte und gemessener Bau unverändert.

Die größte regelmäßig eingebaute Unterbrechung ist die **erste Aufgabenkarte: rund 1,04 Sekunden** auf beiden Prüfgeräten. Davon entfallen etwa 0,31 Sekunden auf das Einsetzen des nachgeladenen Kartenbausteins und rund 0,70 Sekunden auf den anschließenden visuellen Einstieg. Beim **Raumwechsel** dominiert die Bildvorbereitung: Desktop rund 0,28 Sekunden, gedrosseltes Emulat rund 1,03–1,09 Sekunden. Die Steuerung reagiert nach Start und richtiger Antwort binnen weniger Spielbilder; die richtige Antwort wartet auf keine Feier- oder Speicheruhr.

Das belegt K-10 für die erste Kartenöffnung und für Raumwechsel auf der gedrosselten Prüffläche. K-11 bleibt differenziert: Das Prologbild erscheint nach 0,33–0,46 Sekunden; der erste Raum wird während des Auftakts weiter vorbereitet. Ein mehrsekündiger lokaler Stillstand **nach** „Los geht’s“ wurde in diesem Aufbau nicht beobachtet. Das ist keine Aussage über Schulnetz, echte Mobilgeräte oder produktive Anmeldung.

**Nur Dokumentation geändert:** diese Datei und ein Verweis in `docs/handover/grades/g1.md`. Kein Motor-, Karten-, Inhalts-, Asset- oder Konfigurationscode geändert.

## 1. Festgehaltener Bau und Gerät

Bau: ea0cdcd63d4f892bb3954f53288813bbcb401535 · Quelle: `/api/version` des eigenen lokalen Produktionsservers; Git-Basis beim Start identisch.

Die Merge-Commits der PRs [489](https://github.com/VEHO-DOMI/domigo-v2/pull/489), [491](https://github.com/VEHO-DOMI/domigo-v2/pull/491), [493](https://github.com/VEHO-DOMI/domigo-v2/pull/493) und [497](https://github.com/VEHO-DOMI/domigo-v2/pull/497) sind durch `git merge-base --is-ancestor` als Vorfahren dieser Basis geprüft. **Ein einziger** unveränderter `pnpm build`, danach `next start`; zwischen den Reihen kein Neubau. Der spätere Dokumentationscommit ist ausdrücklich nicht die Kennung eines neu gemessenen Baus.

| Eigenschaft | Desktop | Mobile Prüffläche — ausdrücklich Emulat |
|---|---|---|
| Rechner | Apple M5, 10 CPU-Kerne (Recheneinheiten), 16 GiB Arbeitsspeicher | derselbe Rechner |
| Betriebssystem | macOS 26.5.2 (25F84) | dasselbe Betriebssystem |
| Browser | eigener Chrome 155.0.8059.40, `--headless=new` | derselbe Chrome |
| Fläche | 1440 × 900, Pixelfaktor 1 | 390 × 844, Pixelfaktor 1, mobile Darstellung und Touch |
| Rechenleistung | ohne Drosselung | Chromes CPU-Drosselung ×4; keine Drosselung von Netz oder Grafikchip |
| Eingabeprüfung | Pfeiltasten über den echten Tastaturhandler | Pointer-Ereignisse über die echten Touchknöpfe |
| Netz | lokaler Server `127.0.0.1:4398`, keine künstliche Netzverzögerung | gleich |
| Laufzeit / Werkzeug | Node 24.20.0, pnpm 11.5.3, Next 16.2.7 | gleich |
| Leere Kontrollseite, Hauptreihe vorher / nachher | 60,27 / 60,00 Bilder pro Sekunde | 60,00 / 60,01 Bilder pro Sekunde |
| Kontrollseite, zusätzliche Seitenreihe vorher / nachher | 60,08 / 60,00 Bilder pro Sekunde | 60,00 / 60,00 Bilder pro Sekunde |

Ein *sichtbarer Tab* bedeutet hier gemessen `visibilityState=visible` und `hidden=false`; der Browser hat trotzdem kein sichtbares Betriebssystemfenster. Die leere Kontrollseite muss mindestens 58 Bilder pro Sekunde liefern. Alle 13 Kontrollen einschließlich der Kontrollen nach verworfenen Läufen bestanden. Das Emulat ist **kein gemessenes Telefon** und seine Werte sind keine Vorhersage für ein bestimmtes Modell.

## 2. Die fünf Wege — Ergebnisse

Alle Zeiten sind Millisekunden. **Median** ist die Mitte der zehn sortierten Werte (Mittel des fünften und sechsten); **p90** ist hier der neunte Wert, also eine grobe Kennzahl der langsamen Fälle; **Maximum** ist der langsamste tatsächlich behaltene Lauf. Bei n=10 sind p90 und Maximum keine Aussage über seltene Ausreißer im großen Einsatz.

**Kalter HTTP-Zwischenspeicher — lokal behaltene Dateien früherer Webanfragen:** Chromes Browsercache vor dem Seitenaufruf geleert; anschließend die vier Spielwege im selben Besuch. „Kalt“ meint keine kalte Festplatte, keinen neu gestarteten Server und keinen garantiert leeren internen JavaScript-/Bilddekodiercache.

| Weg | Desktop: Median · p90 · Maximum (ms) | 390-px-Emulat ×4: Median · p90 · Maximum (ms) | n je Gerät | Last vor/nach: Desktop / Emulat |
|---|---:|---:|---:|---|
| Seitenaufruf → sichtbares Prologbild | 332,0 · 344,0 · 360,0 | 458,0 · 464,0 · 464,0 | 10 / 10 | 4,56–4,70 / 4,40–4,79 |
| „Los geht’s“ → erste wirksame Eingabe | 14,1 · 15,1 · 16,2 | 21,6 · 34,0 · 34,9 | 10 / 10 | 4,19–4,66 / 3,89–4,81 |
| Tür-Auslöser → fertig eingeblendete, bedienbare Karte | 1043,5 · 1049,8 · 1064,3 | 1043,5 · 1060,3 · 1070,6 | 10 / 10 | 4,19–4,66 / 3,89–4,81 |
| Richtige Antwort → erste wirksame Eingabe | 6,3 · 14,0 · 15,8 | 14,4 · 17,1 · 17,3 | 10 / 10 | 4,19–4,66 / 3,89–4,81 |
| Raumwechsel p1 → p2 → erste wirksame Eingabe | 280,8 · 307,6 · 321,4 | 1091,8 · 1306,5 · 1365,8 | 10 / 10 | 4,19–4,66 / 3,88–4,81 |

**Warmer HTTP-Zwischenspeicher:** derselbe Browser nach dem vorangehenden kalten Besuch; vollständige neue Seitennavigation, gleicher leerer lokaler Spielstand, kein künstliches Abschalten des normalen Vorladens.

| Weg | Desktop: Median · p90 · Maximum (ms) | 390-px-Emulat ×4: Median · p90 · Maximum (ms) | n je Gerät | Last vor/nach: Desktop / Emulat |
|---|---:|---:|---:|---|
| Seitenaufruf → sichtbares Prologbild | 332,0 · 360,0 · 360,0 | 462,0 · 464,0 · 464,0 | 10 / 10 | 4,56–4,70 / 4,40–4,79 |
| „Los geht’s“ → erste wirksame Eingabe | 14,1 · 14,7 · 15,6 | 21,2 · 24,0 · 66,1 | 10 / 10 | 4,26–4,76 / 3,88–4,81 |
| Tür-Auslöser → fertig eingeblendete, bedienbare Karte | 1043,5 · 1051,0 · 1052,4 | 1045,8 · 1060,2 · 1127,4 | 10 / 10 | 4,19–4,76 / 3,88–4,81 |
| Richtige Antwort → erste wirksame Eingabe | 13,1 · 16,3 · 16,6 | 15,8 · 17,2 · 19,1 | 10 / 10 | 4,19–4,61 / 3,88–4,66 |
| Raumwechsel p1 → p2 → erste wirksame Eingabe | 278,0 · 292,8 · 313,6 | 1032,9 · 1103,0 · 1301,2 | 10 / 10 | 4,19–4,61 / 3,88–4,66 |

Die Lastspalten nennen jeweils Minimum–Maximum aller **vorher und nachher** erhobenen Ein-Minuten-Werte der behaltenen Einzelmessungen. Jeder Wert liegt strikt unter 5. Pro Weg sind das 40 gültige Beobachtungen, getrennt in vier Gruppen zu zehn; **200 veröffentlichte Einzelmessungen**, keine Vermischung von Desktop/Emulat oder kalt/warm.

Zusätzlich zum eigentlichen Prologbild wurden das erste beliebige Bild und die Spielleiste gemessen. **First Paint** ist Chromes erstes gezeichnetes Seitenbild; es kann bereits die äußere Seitenhülle sein. **LCP** ist der Zeitpunkt eines großen gezeichneten Inhaltselements; für diesen Bericht wird ausdrücklich der Eintrag des Prologbilds `story_school.png` gewählt, nicht ein früheres Logo und nicht eine spätere Aufgabenkarte. **HUD** meint die Spielleiste mit Ton und Sammelanzeigen.

| Seitenmarke, Median (ms) | Desktop kalt / warm | Emulat kalt / warm |
|---|---:|---:|
| First Paint — erste Seitenhülle | 28,0 / 42,0 | 58,0 / 80,0 |
| HUD aufgebaut | 313,4 / 313,9 | 340,5 / 343,6 |
| Prologbild tatsächlich dargestellt, LCP | 332,0 / 332,0 | 458,0 / 462,0 |
| Erste Serverantwort, TTFB — Zeit bis zum ersten Antwortbyte | 6,7 / 9,0 | 8,8 / 11,1 |

Die Spielleiste ist während des Vollbildprologs **verdeckt**. „HUD aufgebaut“ ist deshalb keine Behauptung, dass das Kind sie schon sehen kann. Ihr späteres Aufdecken verlangt das Weitergehen im Prolog und gehört nicht zur automatischen Ladezeit.

## 3. Größter Posten je Weg und fünf konkrete Folge-PR-Vorschläge

### Weg 1 — Seitenaufruf: nachgeladener Spielbaustein und clientseitige Freigabe

Desktop kalt: Die HTML-Antwort — das Grundgerüst der Seite — endet im Median nach 9,9 ms, die Spielleiste entsteht nach 313,4 ms, das Prologbild steht nach 332,0 ms. Im Emulat endet HTML nach 12,5 ms, das Prologbild steht nach 458,0 ms. Der große gemessene Block liegt damit **im Browser nach der HTML-Antwort**, nicht im lokalen Servertransport. `BuchClient` lädt das ganze `PaintGame` erst im Browser nach (`dynamic`, `ssr:false`). Die zusätzliche Ablaufaufzeichnung enthält auch beim Seitenstart einen geplanten Aufschub durch React, die Bibliothek für den Aufbau der Oberfläche; dessen Anteil ist hier nicht isoliert. Eine vollständige Aufteilung dieser Startstrecke auf JavaScript-Ausführung, React und Bildarbeit wird nicht behauptet.

**Folge-PR 1 — „Prolog vor dem Spielmotor anzeigen“.** Den vorhandenen Prolog und seine unveränderten Texte unabhängig vom nachgeladenen Spielbaustein anzeigen; erste Raumbilder weiterhin parallel vorbereiten. Abnahme: gleiche vier Messgruppen, Prolog-LCP und HUD getrennt; keine doppelte Szene, kein verlorener Fortschritt, korrekte Fehleranzeige. Erst nach diesem Vergleich einen Geschwindigkeitsgewinn behaupten.

### Weg 2 — Start: Bildtakt statt Ladepause; die optische Einblendung dauert länger

„Los geht’s“ löst die Welt im Median nach 0,2 ms am Desktop und 0,7–1,1 ms im Emulat aus. Die erste tatsächlich veränderte Figurenposition folgt nach 14,1 beziehungsweise 21,2–21,6 ms. Der wesentliche Rest bis zur Eingabewirkung ist der nächste Spiel-/Bildtakt. Die optische Einblendung des Weltbilds (`pb-world-in`, nominell 240 ms) endet erst nach **278,7 / 279,0 ms Desktop** und **280,5 / 276,5 ms Emulat**. Steuerbarkeit und vollständig sichtbares Bild sind unterschiedliche Endpunkte; beim ersten gemessenen Bewegungsschritt kann die Welt noch fast durchsichtig sein.

Die erste Szene ist beim Desktop in der Hauptreihe nach etwa 0,63 s vorbereitet; beim kalten Emulat nach etwa 1,60 s. Diese Zeit liegt überwiegend **unter dem Auftakt**, nicht hinter dem Startklick. Der Test überspringt die Geschichte und wartet auf den fertig eingeblendeten Startknopf; menschliche Lesezeit ist ausgeschlossen. Ein beliebig früher erzwungener Klick während des Ladens ist damit nicht umfassend abgedeckt.

**Folge-PR 2 — „Frühen Start an echte Weltbereitschaft binden“.** Startknopf, Ladezustand und erste wirksame Eingabe gemeinsam absichern; eine zusätzliche Uhr nach Bereitschaft vermeiden. Den bestehenden optischen 240-ms-Einstieg separat gegen eine kürzere Fassung vergleichen. Abnahme: frühestmöglicher echter Klick, langsames Lesen, Ladefehler, reduzierte Bewegung, erstes Tastatur- und Touchsignal. Keine neue Formulierung für Kinder in dieser Messkarte.

### Weg 3 — Kartenöffnung: 300-ms-Freigabe plus 700-ms-Einstieg

Die erste Türkarte setzt am Desktop kalt nach **315,8 ms**, im Emulat kalt nach **313,9 ms** ein. Der zusätzliche Karten-JavaScript-Baustein braucht lokal im Median nur **1,8 ms** Transport (warm 0,0 ms aus dem Zwischenspeicher); er erklärt die 0,31 s nicht als Netzwartezeit. `CardHost` wird über `React.lazy` und `Suspense` nachgeladen — React zeigt dabei zuerst einen Ersatzinhalt und gibt den fertigen Teil später frei.

Der ergänzende Browser-Trace — eine zeitlich geordnete Ablaufaufzeichnung — lokalisiert diesen Aufschub im **ausgelieferten** React-Baustein: Aufrufstelle `2gfvs4tz3ox1_.js:1:135219`, Ausdruck `uH+300-ev()`. Nach einer ersten geplanten Uhr von 299,9 ms wird eine Ersatz-Uhr von 292,0 ms bei Browserzeit 1527,8 ms gesetzt und bei 1822,1 ms ausgeführt. Das belegt den rund 300-ms-Freigabeabschnitt der ersten Karte; keine Produktdatei wurde dafür geändert.

Danach laufen die vorhandenen Animationen: Kartenstart 260 ms verzögert + 420 ms Eintritt = 680 ms; Tintenblende 700 ms, zweite Blende 60 + 640 = ebenfalls 700 ms. **Diese drei Strecken überlappen**, sie ergeben nicht 2080 ms. Gemessen werden insgesamt rund **1043,5 ms** bis zur fertig eingeblendeten, per Treffertest bedienbaren Antwort. Der größte Einzelposten ist der 700-ms-Einstieg. Ein Antwortknopf ist zwar schon früher im Seitengerüst vorhanden und zum Teil technisch anklickbar, aber noch nicht fertig sichtbar; das wird nicht als bedienbare fertige Karte verkauft.

**Folge-PR 3 — „Erste Aufgabenkarte vorbereiten, Einstieg verkürzen“.** `CardHost` während des Auftakts vorbereiten, sodass die erste Begegnung nicht erst die Nachladegrenze auslöst; vorhandene Tinten-/Kartenbewegung als einen gemeinsamen Einstieg verkürzen. Entwurfsziel: höchstens 500 ms bis zur vollständig bedienbaren Karte. Abnahme: erster und wiederholter Kontakt, kalter/warm gefüllter Cache, beide Geräte, Rückkehr aus Geschichte/Regelseite mit erhaltener Antwort und angehaltener Aufgabenuhr; volle spätere Perf-Tabelle.

### Weg 4 — Richtige Antwort: unmittelbare Weltfreigabe, kein Warte-Timer

Der Antwortklick schließt die Sperre synchron innerhalb **0,25 ms Desktop kalt** beziehungsweise **1,05 ms Emulat kalt** (Mediane). Danach bewegt eine echte Eingabe die Figur im nächsten beobachteten Spielbild: 6,3–13,1 ms Desktop, 14,4–15,8 ms Emulat. Größter Rest ist der Bild-/Simulationstakt, nicht eine Animation. R241 („≈ 0 Uhren“) ist für die gemessene richtige Türantwort bestätigt: **keine zusätzliche Warteuhr** bedeutet nicht physikalisch 0,000 ms bis zum nächsten gezeichneten Bild.

Der richtige Zweig in `CardHost` ruft Weltänderung und Rückkehr ohne `await` auf. Die synthetische Lehrkraft nutzt die echte Vorschau; sie sendet **keine** Lernversuche. Der Wert ist deshalb kein Test echter Speicherdauer oder Fehler-/Offline-Nachsendung. PR 493 enthält ergänzend den damaligen synthetischen Kind-Beleg: Welt nach 1 ms frei, bestätigte Serverantwort erst nach 1823,3 ms; anderer Bau und andere Definition, daher kein numerischer Vorher-Nachher-Vergleich.

**Folge-PR 4 — „Sofortige Rückkehr gegen spätere Speicherantworten schützen“.** Einen reproduzierbaren Browser-Schutztest für Antwort → wirksame Eingabe ergänzen, einschließlich künstlich verzögerter/fehlender Serverantwort und offener Nachlese. Bestehende synchrone Rückkehr erhalten; keine Tempo-Reparatur ohne neu nachgewiesenen Befund. Zielgrenze für den Browserbeleg: 100 ms, bei gemessener freier Maschine.

### Weg 5 — Raumwechsel: Bilddekodierung in der Ladephase

Für p1 → p2 dauert der Lader im Median **207,7 / 198,3 ms Desktop** und **868,2 / 815,5 ms Emulat** (kalt / warm). Der anschließende Szenenaufbau `create()` dauert **36,0 / 38,1 ms** beziehungsweise **146,1 / 145,3 ms**. Diese Größen sind Teile des Wegs; Mediane werden nicht zu einer angeblich exakt passenden Gesamtzeit addiert.

Die zusätzliche Ablaufaufzeichnung bestätigt die Bildarbeit: In einem 300,6-ms-Wechsel liegen **90 `Decode Image`-Ereignisse mit zusammen 148,8 ms auf dem Browser-Hauptthread**, also dem zentralen Ausführungsstrang. Verschachtelte `Decode LazyPixelRef`-Ereignisse werden **nicht nochmals addiert**. Die lokale längste Bild-Ressourcenanforderung pro Wechsel liegt in den Hauptreihen im Median nur bei **26,1 / 4,4 ms Desktop** und **20,0 / 1,6 ms Emulat**. Das sind keine addierbaren Transportkosten; zusammen mit dem Trace und der CPU-Drosselung belegen sie aber, dass im lokalen Aufbau die **Bildvorbereitung/Dekodierung** den großen Ladeblock trägt. Eine Übertragung auf ein langsames Schulnetz ist nicht zulässig.

**Folge-PR 5 — „Bilder des nächsten Raums vor dem Übergang dekodieren“.** Zunächst den tatsächlich für p2 benötigten Bildumfang und den vorhandenen Vorwärmer verwenden; benötigte Bilder vor dem Wechsel kontrolliert dekodieren, statt erst beim Eintritt den Hauptthread zu beanspruchen. Kein pauschales Vorladen des ganzen Buchs. Abnahme: identischer p1→p2-Weg vorher/nachher, Speicher- und Texturbudgets, Abbruch bei frühem Wechsel, kalte und warme Reihe, CPU ×4; erst bei belegtem Gewinn weitere Phasen übernehmen.

## Folge-PRs in Reihenfolge

Vorschlag für die GG-Beauftragung nach der geltenden Motor-Freigabe (HALT/B2): zuerst die beiden belegten Sekundenpausen, danach der Seitenstart, zuletzt Start- und Rückkehrabsicherung. Die Nummern unten sind die Priorität; die Wegnummern in Abschnitt 3 bleiben die Messwege. Zielwerte sind **vorgeschlagene Abnahmegrenzen, keine bereits erreichten Werte**: höchstens eine halbe Sekunde für Karte/Raum und 100 ms für direkte Eingabewirkung. Jeweils kalt/warm getrennt, beide Prüfflächen, mindestens zehn gültige Läufe bei gleicher Lastregel; p90 bezeichnet den neunten sortierten Wert von zehn Läufen. Dateiangaben bezeichnen den erwarteten Umfang des späteren PRs, keine Änderung dieser Karte.

**1. Erste Aufgabenkarte vorbereiten, Einstieg verkürzen (Weg 3).** **Ziel:** Kartenbaustein während des Auftakts vorbereiten und die überlappende Tinten-/Kartenbewegung verkürzen. **Messwert heute:** Median 1043,5–1045,8 ms, p90 bis 1060,3 ms; größter Einzelposten ist der 700-ms-Einstieg. **Zielwert:** p90 ≤500 ms bis vollständig sichtbar und bedienbar auf beiden Prüfflächen. **Berührte Dateien:** `packages/game-paint/src/PaintGame.tsx`, `packages/game-paint/src/cards/CardHost.tsx`, `packages/game-paint/src/cards/overlay-css.ts` samt vorhandenen Overlay-Tests. **Risiko:** größere anfängliche Ladearbeit, veränderte Bildwirkung und verlorener Antwort-/Uhrzustand beim Nachlesen; Erstöffnung und Wiederöffnung getrennt abnehmen.

**2. Bilder des nächsten Raums vor dem Übergang dekodieren (Weg 5).** **Ziel:** benötigte Bilder vor dem Eintritt in darstellbare Bildpunkte umwandeln, begrenzt auf den nächsten Raum. **Messwert heute:** Median Desktop 278,0–280,8 ms, Emulat 1032,9–1091,8 ms; p90 Emulat bis 1306,5 ms, davon Lader-Median 815,5–868,2 ms. **Zielwert:** p90 ≤500 ms im Emulat, Desktop ≤350 ms als Schutzgrenze. **Berührte Dateien:** `packages/game-paint/src/PaintScene.ts`, `packages/game-paint/src/artScope.ts`, `packages/game-paint/src/warm.ts`, `packages/game-paint/src/warmer.ts` und deren bestehende Tests. **Risiko:** zusätzlicher Arbeitsspeicher oder Ruckeln im aktuellen Raum; Vorladen begrenzen, abbrechbar halten und Speicher-/Texturbudgets nachmessen.

**3. Prolog vor dem Spielmotor anzeigen (Weg 1).** **Ziel:** den unveränderten Auftakt unabhängig vom nachgeladenen Spielbaustein sichtbar machen. **Messwert heute:** Prologbild-Median Desktop 332,0 ms, Emulat 458,0–462,0 ms; p90 bis 360,0 bzw. 464,0 ms, HTML-Antwort im Median schon nach 9,9–15,8 ms vollständig. **Zielwert:** Prologbild-p90 ≤300 ms Desktop und ≤400 ms Emulat; die getrennt gemessene Spielleisten-Bereitschaft darf sich nicht verschlechtern. **Berührte Dateien:** `apps/web/app/(game)/play/[grade]/buch/[chapter]/BuchClient.tsx`, `packages/game-paint/src/PaintGame.tsx`, `packages/game-paint/src/story/StoryComic.tsx`. **Risiko:** doppelte Szenen, verschobene Lesestände oder spätere Weltbereitschaft; den noch nicht isolierten Anteil des Oberflächenaufbaus zuerst genauer aufzeichnen.

**4. Frühen Start an echte Weltbereitschaft binden (Weg 2).** **Ziel:** den frühesten angebotenen Start sicher bedienen und die optische Einblendung separat verkürzen. **Messwert heute:** Bewegung im Median nach 14,1 ms Desktop bzw. 21,2–21,6 ms Emulat, p90 höchstens 34,0 ms; optische Einblendung im Median 276,5–280,5 ms. **Zielwert:** Bewegung weiterhin p90 ≤100 ms, vollständig eingeblendete Welt p90 ≤200 ms; keine zusätzliche Warteuhr nach Bereitschaft. **Berührte Dateien:** `packages/game-paint/src/PaintGame.tsx`, `packages/game-paint/src/cards/overlay-css.ts` und die Startzustandsprüfungen. **Risiko:** ein früher Klick trifft eine unfertige Szene oder die Figur bewegt sich im kaum sichtbaren Bild; frühesten echten Klick, Ladefehler, Tastatur, Touch und reduzierte Bewegung prüfen.

**5. Sofortige Rückkehr gegen spätere Speicherantworten schützen (Weg 4).** **Ziel:** die bereits schnelle Rückkehr mit einem Browserbeleg auch bei verzögerter oder fehlender Speicherantwort absichern. **Messwert heute:** Vorschau-Median 6,3–15,8 ms, p90 höchstens 17,2 ms, Maximum 19,1 ms; synchrone Freigabe kalt 0,25–1,05 ms. **Zielwert:** weiterhin p90 ≤100 ms bis wirksame Eingabe und keine zusätzliche Feier-/Speicheruhr. **Berührte Dateien:** `packages/game-paint/src/resume-latency.test.ts`, `packages/game-paint/src/cards/resolution-instant.test.ts` plus ein neu anzulegender Browser-Prüflauf; geprüfte Produktstellen sind `PaintGame.tsx`, `cards/CardHost.tsx` und `BuchClient.tsx`. **Risiko:** reine Vorschau verdeckt Speicherfehler; ausschließlich synthetische Antworten mit künstlicher Verzögerung verwenden und den bestehenden Rückkehrpfad nur bei neuem Fehlerbefund ändern.

## 4. Bezug zu bisherigen Aufträgen und zum Quellstand

- **welle-066:** Boardkarte direkt gelesen. Ihr Ergebnis ist ein abgenommener Messplan, **keine Zahlenreihe** und kein PR. Genannt sind fünf Wege, Aufwärmlauf plus zehn Wiederholungen, kalt/warm getrennt. Laufzeitmessung damals blockiert durch Last >100 und fehlenden Dev-Zugang. Dieser Bericht übernimmt die Trennung und liefert erstmals in dieser Karte gültige Wiederholungen; eine prozentuale Verbesserung gegenüber welle-066 ist nicht berechenbar. Der frühere Lab-Text wurde nicht aus einem fremden Klon geöffnet.
- **PR 489/491/493:** Die belasteten Executor-Reihen und die späteren GG-Nachmessungen sind unterschieden. Die ruhigen GG-Nachherwerte für p1 „laden / bau+aufbau“ liegen bei 223,5 / 65,0 ms (489), 188,8 / 57,8 ms (491) und 232,1 / 64,1 ms (493). Diese Messung findet für den ersten Raum Desktop kalt 216,3 ms Laden und 43,6 ms `create()`; der separate Konstruktor ist darin nicht enthalten. Das ist Größenordnungs-Kontext, **kein gleichartiger Vorher-Nachher-Vergleich**.
- `perf-visible.mjs` misst Phasen p1, p2, p3, p4, p9, einschließlich Konstruktor + Aufbau, erstem Grafikbild und eingeschwungener Bildrate. Ein Neuaufruf von p2 ist etwas anderes als ein echter p1→p2-Wechsel mit bereits vorhandenen Texturen. Seine Kontrollseite und sichtbarer Tab sind übernommen; seine Phasenwerte ersetzen die fünf Spielerwege nicht.
- `check-perf-budget.mjs` ist ein statischer Budgetwächter — er prüft definierte Grenzen und Datenbestände, nicht die Zeit einer Kartenöffnung. Seine Standard- und Selbstprüfung sind grün. Das bestehende 100-ms-Aufbaubudget wird nicht wegen des CPU-Emulats geändert.
- K-29/K-30 stehen im Register bereits auf **GEBAUT**. Die neue Befreiungsfolge und ihre Zustände werden hier nicht umgebaut. Der Kartenbeleg verwendet die erste Tür-Auswahlaufgabe, nicht die mehrteilige Gegenstandsfolge. Keine vollständige Abdeckung aller Kartenarten, aller neun Räume oder der Begegnungswege behauptet.
- `openReference` erhält eine offene Karte; `suspended` hält deren Uhr an. Die Messung löst eine neue Türkarte aus. Das bloße Wiederzeigen einer erhaltenen Karte wäre ein anderer Messweg und darf nicht als schnellere Erstöffnung gelten.

## 5. Messmethodik, Ausschlüsse und Belege

### Aufbau und Start-/Endpunkte

Die Quellen liegen unverändert im eigenen Klon `/Users/veho/Code/_codex/cgo-098`. Fehlende Pakete wurden mit `pnpm install --frozen-lockfile` bereitgestellt; die Lockdatei blieb unverändert. Der Produktionsbau läuft mit einer gezielt aufgebauten Prozessumgebung ohne übernommene Datenbank- oder Dienstzugänge. Der lokale Server bekommt einen zufälligen, nur für diesen Test erzeugten Sitzungsschlüssel. Damit wird eine synthetische Lehrkraft mit leerem Klassenbereich angemeldet; kein Produktionskonto, kein Neon, keine Datenbankabfrage nach Namen. Die echte `page.tsx`, `BuchClient`, `PaintGame`, Karten und Assets bleiben im Bau unverändert.

Die Produktions-Optimierung ist aktiv; der lokale Bereitstellungsmodus ist „preview“, einschließlich der vorhandenen unveränderlichen Bild-Cacheheader. Die synthetische Sitzung erfüllt die echte Lehrer-Tür. `?perf=1` schaltet das schon vorhandene Messinstrument frei; kein `?phase=` beim Seitenstart, da das den Auftakt überspringen würde. Normaler Vorwärmer aktiv. Jede Navigation setzt nur den **synthetischen Browser-Spielstand** zurück, damit der Prolog gleich beginnt.

| Weg | Start der Uhr | Ende der Uhr |
|---|---|---|
| Seite | Browser-Navigationsbeginn `/play/1/buch/ch01?perf=1` | von Chrome gelieferte tatsächliche Darstellungszeit des Prologbilds; zusätzlich First Paint und HUD-Aufbau |
| Start | Aufruf des echten „Los geht’s“-Klickhandlers nach fertig eingeblendetem Startknopf | erste Positionsänderung durch anschließend gesendete reale Spielsteuerung; optisches Einblendungsende extra |
| Karte | echte `sim.ask`-Türanfrage und Verarbeitung der entstehenden Ereignisse | Antwort vorhanden, aktiviert, Mittelpunkt trifft den Knopf, Kartendeckkraft >0,99, Karten-/Tintenanimationen beendet |
| Zurück | Klick auf die richtige echte Antwort „Open!“ | erste Positionsänderung durch Steuerung nach links; synchrone Entsperrung zusätzlich festgehalten |
| Raum | echtes Exit-Ereignis p1→p2 an der vorhandenen Szenen-Schnittstelle | neue Phase p2 aktiv und erste Positionsänderung durch Steuerung nach rechts |

Die Figur wird vor der Tür positioniert; Anlaufen, Rätsellösen und menschliche Reaktionszeit werden nicht mitgemessen. Der Phasenwechsel beginnt an der vorhandenen Exit-Schnittstelle; ein vollständiger manueller Spaziergang durchs Kapitel wurde nicht simuliert. Die Uhren laufen **im Browser**, nicht über die Laufzeit eines Fernsteuerungsbefehls. Eingaben und Klicks sind programmgesteuerte Browserereignisse. Die Bewegungs-Endpunkte werden an tatsächlicher Positionsänderung gemessen, nicht allein an einem Freigabeschalter; die Beobachtungsauflösung liegt bei ungefähr einem Bildtakt. Mechanische Eingabelatenz eines echten Geräts bleibt ungemessen.

### Wiederholungen, Last und bewusste Korrektur eines Messfehlers

- Hauptreihe: Desktop zuerst, dann Emulat; je Gerät ein kalter und ein warmer Aufwärmlauf, danach zehn kalte/warme Paare. Keine eigenen Builds oder Tests während der Messreihe.
- Ein-Minuten-Last strikt **<5**, vor und nach jedem Einzelweg per `uptime`; dieselbe Wahl des Zeitfensters wie im vorhandenen `chrome-hygiene.mjs` (`m1`), hier mit der strengeren Karten-Grenze 5 statt der allgemeinen Makelgrenze 8. Alle drei Werte 1/5/15 Minuten bleiben in den Rohdaten. In der Hauptreihe waren die längeren Fenster noch **6,52–10,86 / 9,09–11,38**; die Maschine war zuvor belastet. „Last <5“ gilt ausdrücklich für eine Minute, nicht rückwirkend für 15 Minuten.
- Ruhe-Warteschleife prüft alle 20 Sekunden und bricht nach spätestens zehn Minuten je Ruhe-Suche ab. Erste Ruhe-Suche ab 06:10:54; vor dem Desktop-Aufwärmen wurde <5 erreicht. Höchster protokollierter Wartewert 24,07. Fremde Prozesse und fremde Browser wurden nicht beendet.
- **Fünf Hauptreihen-Versuche verworfen:** Desktop Paar 1 kalt, vor Start 5,30; Desktop Paar 10 warm, vor Start 5,92; Emulat-Aufwärmlauf kalt nach Seite 5,13, nach Karte 5,01 und erneut nach Karte 5,22. Angefangene Zeilen dieser Versuche werden vollständig aus den berichteten Reihen ausgeschlossen; anschließend Wiederholung unter der Grenze. Die verworfenen Versuche bleiben im Rohdatensatz.
- **Seitenendpunkt korrigiert:** Die erste Reihe beobachtete Bildbereitschaft plus nächsten Browser-Bildtakt. Beim Emulat lag die echte Darstellung später. Deshalb wurden ihre 40 vorläufigen Seitenwerte verworfen/ersetzt, **nicht** die anderen vier korrekt gemessenen Wege. Eine zusätzliche gleichartige Seitenreihe wartet vor jeder Interaktion ausdrücklich auf den Prologbild-LCP. Sie enthält wieder vier Aufwärmläufe und 40 gültige Messungen, keine Last-Verwerfung. Alle Tabellen dieses Berichts verwenden ausschließlich diese abgesicherten Seitenwerte.
- Hauptreihe bis 06:23:47; zusätzliche Seitenreihe 06:29:28–06:30:42, jeweils lokale Zeit Wien am 08.10.2026. Separate Mechanismus-Aufzeichnung um 06:33 bei Last **4,66→4,45**, Kontrollseite 60 Bilder/s, Sichtbarkeit bestätigt. Ihr Fenster ist 1200×900; sie stützt die Ursachenanalyse und wird **nicht** in die Wiederholungstabellen aufgenommen. Auch die frühe belastete Kalibrierung bleibt ausgeschlossen.
- Diagnosegrenzen: Seite >1000 ms, Start/Rückkehr >100 ms, Karte/Raumwechsel >500 ms. Das sind gewählte Arbeitsgrenzen zur Sortierung des Befunds, keine Normwerte oder Produktfreigabe. Sie unterscheiden kurze Reaktion, sichtbare Unterbrechung und kompletten Seitenstart. Bei diesen Grenzen fallen Kartenöffnung und emulierter Raumwechsel auf; alle Maximalwerte bleiben in der Tabelle, auch unterhalb dieser Grenzen.

### Befehle und Dateien für die Wiederholung

Alle Messprogramme und Rohbelege liegen außerhalb des Repos unter **`/tmp/cgo-098/`**. Sie bleiben lokal für die GG-Prüfung; sie sind keine dauerhafte öffentliche Ablage. Der Bericht enthält die Zahlen dauerhaft, der GG muss die Rohbelege vor einer Bereinigung von `/tmp` sichern, wenn er sie weiter aufbewahren will. Sitzungscookie und Browserprofile gehören nicht in einen PR oder Belegexport.

```sh
cd /Users/veho/Code/_codex/cgo-098
git rev-parse HEAD origin/main
pnpm install --frozen-lockfile
node /tmp/cgo-098/build.mjs          # führt pnpm build ohne Dienstzugänge aus
node /tmp/cgo-098/start.mjs          # next start, eigener lokaler Port 4398
node /tmp/cgo-098/measure.mjs        # Hauptreihe; benötigt den eigenen Server
node /tmp/cgo-098/page-verify.mjs    # tatsächliche Prolog-Darstellung
node /tmp/cgo-098/trace.mjs          # separate Ablaufaufzeichnung
node /tmp/cgo-098/verify-evidence.mjs
```

Diese Aufrufe sind ein Wiederholungsrezept, **keine Aufforderung zum Neubau vor Auswertung der vorhandenen Daten**. Der Server wurde für diese Messung einmal gebaut. Die lokalen Hilfsprogramme enthalten den oben gepinnten Ausgangsstand; für einen künftigen Vergleich muss die neue Baukennung absichtlich angepasst und erneut am Server geprüft werden.

| Beleg | Inhalt |
|---|---|
| `proof/results.json` | sämtliche Hauptreihenversuche, Last davor/danach, Browserzeiten, tatsächliche Bewegungen, Ressourcenzeiten, Aufbauwerte und Ausschlüsse |
| `proof/page-verified.json` | tatsächliche Prologbild-LCPs, First Paint, HUD, Last und Kontrollen der Ersatz-Seitenreihe |
| `proof/final-summary.json` | veröffentlichte Kennzahlen mit eindeutiger Quelldatei je Zeile |
| `proof/trace.json`, `proof/trace-observations.json`, `proof/trace-phase-summary.json` | Browser-Trace, Timer-Aufrufstellen und Decoder-Auswertung; verschachtelte Zeiten nicht doppelt summiert |
| `proof/prologue-desktop.png`, `proof/prologue-mobile-emulat.png`, `proof/trace-card.png` | synthetische sichtbare Spieloberflächen |
| `proof/verification.json` | 200 Messungen geprüft, alle zehn Wiederholungen vorhanden, Last/Sichtbarkeit/Bewegung geprüft; fünf absichtliche Fehler erkannt |
| `source-pins.json`, `ancestry.json`, `build-result.json` | unveränderte SHA-256-Fingerabdrücke der relevanten Quellen, Basis-Vorfahren, Produktionsbau Exit 0 |
| `gate-inventory.json`, `gates.json`, `logs/gate-*.log` | maschinell aus der aktuellen `ci.yml` gewonnene Befehle, jeder Exit-Code und seine Ausgabe |
| `pr-489.md`, `pr-491.md`, `pr-493.md` | bei Sitzungsbeginn gelesene PR-Beschreibungen für den Vergleich |

Der externe Auswerter wurde mit fünf absichtlichen Fehlern geprüft: fehlender zehnter Lauf, Last genau 5, keine Figurenbewegung, Logo statt Prologbild und verborgene Kontrollseite. **5/5 erkannt**, unveränderte Rohdaten danach grün. Keine neue Prüfung ins Produktrepo eingebaut.

## 6. Tore, Grenzen und Rückweg

**Nachzug 1, 08.10.2026:** Alle 95 Einzeilentore nach Umbenennung und Ergänzung erneut mit Exit 0 ausgeführt, einschließlich eines frischen Produktionsbaus. Dieser Neubau ist ausschließlich ein Prüftor; die Laufzeitmessungen stammen weiterhin vom oben festgehaltenen ursprünglichen Bau. Aktuelle Einzelprotokolle und Exit-Inventar: `/tmp/cgo-098/nachzug-1/logs/` und `/tmp/cgo-098/nachzug-1/gates.json`. `pnpm lint`: 0 Fehler, 5 bestehende Warnungen; Kapiteltext-Prüfung: 53 Dateien, 0 Verstöße.

**95/95 einzeilige `- run:`-Kommandos der aktuellen `.github/workflows/ci.yml` außer `pnpm install` lokal Exit 0**, einschließlich `pnpm lint`, `pnpm typecheck`, `pnpm test`, Produktionsbau, Bundle-Prüfung, Kapiteltext-Prüfung und den normalen/Selbsttest-Läufen der benannten Wächter. Die vollständige Exit-Tabelle steht im PR; Einzelprotokolle außerhalb des Repos. Die vorgeschriebene zusätzliche Pfadprüfung `check-perf-table` bestätigt die reine Dokumentationsausnahme. Die Installationsvorbereitung wurde zusätzlich erfolgreich durchgeführt; sie zählt nicht zu den 95 Toren.

**Vollbatterie: UNVERIFIZIERT, läuft in der GG-Kette.** Hier sind alle verlangten einzeiligen lokalen Kommandos belegt; das ersetzt nicht die mehrzeiligen Workflow-Schritte, den unabhängigen GG-Leser und dessen Merge-Kette. Eine Perf-Wächter-Vorher-Nachher-Tabelle ist für diesen PR nicht erforderlich, weil kein beobachteter Produktpfad geändert wird. Spätere Tempo-PRs brauchen ihre eigene vollständige Tabelle.

**UNVERIFIZIERT:** produktive Anmeldung, echtes Schulnetz/Internet, echte Endgeräte, Neon-Speicherung, Verhalten aller Kartenarten/aller Raumwechsel, menschlicher vollständiger Spieldurchlauf sowie Kokis subjektive Abnahme. Vorschau überspringt Versuchsspeicherung und Offline-Nachsendung; lokale Geschichte/Befreiungsstände werden weiterhin im synthetischen Browser gespeichert. „Vorschau speichert nichts“ gilt hier für die Lernversuche, nicht pauschal für jeden lokalen Browserstand.

Quellen für Methodik und Abgrenzung: `welle-058_PLAN.md` K-10/K-11, `welle-058_REGISTER.md` K-10/K-11/K-29/K-30, `PaintGame.tsx`, `PaintScene.ts`, `cards/CardHost.tsx`, `cards/overlay-css.ts`, Buchroute und `BuchClient.tsx`; Messfallen aus `docs/handover/46_pitfall_register.md`, insbesondere sichtbarer eigener Chrome, Kontrollseite, gleicher Bau, Last und Vergleichsrauschen. Die neu beobachtete Bildbereitschaft/Darstellung-Falle ist in diesem Bericht dokumentiert und dem GG für das Fallenregister übergeben; der erlaubte Dateizaun wird nicht erweitert.

**PRODUKT:** „Wir wissen jetzt, wo das Kind im Buch wartet und warum — bevor jemand am Motor dreht.“ Geltungsbereich: die fünf oben beschriebenen lokalen Prüfwege.

**FREIGABE für GG-Review: ja** — fünf Wege mit je zehn gültigen Läufen pro Gerät und Cachezustand, Lastgrenze eingehalten, größte Zeitposten belegt, fünf Folge-PR-Beschreibungen, 95 lokale CI-Einzeilentore grün, kein Produktcode geändert. Kein Merge; keine nächste Karte begonnen.
