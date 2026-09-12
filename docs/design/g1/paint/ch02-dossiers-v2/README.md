# CODEX DRAFT — NOT CANON
# ch02 · Kapitel-Bilanz im Trial

**Stand 12.09.2026: fünf Räume und 72 Karten im Inhaltsbranch übernommen. Der zugehörige Motor ist mit PR #422 gemergt. Seine vollständige Batterie bestand 74/74 Tore auf Prüfkopf `676f0159`; Merge `161dda05` hat denselben Dateibaum. Die erneute Batterie dieses Inhaltsimports und die Bildabnahme stehen aus.**

Grundlage sind R0/R1a und die späteren R1b-/R2b-Korrekturen im Werkstatt-Labor. Der Inhalt bleibt `draft`. Die folgenden Bandzahlen stammen aus den importierten Erwartungen in `ch02.proof.json`. Die aktuelle reine Wiedergabe bestätigt die Pflichtabdeckung; der Browserstatus wird gesondert ausgewiesen. Bildaufträge und strukturierte Szenenbelege sind keine Abnahme gezeichneter Schülerbilder.

## §Käfig-Zensus

| Phase | Wesen / Anker | Inhalt | Bauzustand |
|---|---|---|---|
| p1 | Ticket-Käfig `p1-cage2` (11,10) | Ticket | A15/A16 in der Pflichtfolge und im Quellband |
| p2 | Zug-Käfig `p2-cage-zug` (32,10) | Gemalte Zugvignette | B18/B19 und Übergabe zum Fahrkörper gebunden |
| p3 | Stein-Käfig `p3-cage-stein` (39,17) | Stein | C13/C14 in der Pflichtfolge und im Quellband |
| p2 | Fenn-Käfig `p2-cage-fenn` (50,17), Fenn (51,17) | Einziges Klassenkind | Quellband erwartet sechs Runden und Fenn im Gehzustand |
| p1 | Versiegelte Nische c29–32/r6–8 | Nur eine spätere Bildandeutung | Kein Wesen, kein Käfigzähler, kein Pflichtweg |
| p3 | Versiegelte Nische c35–37/r4–6 | Baum-Setzling als spätere Bildandeutung | Kein Wesen, kein Käfigzähler, kein Pflichtweg |

**3 Sachkäfige + 1 Personenkäfig = 4 echte Käfige.** Arena-Tiergruppen sind Bühnenakteure, keine zusätzlichen Käfige. PR #422 zählt auch Fenns gültigen Gehzustand `roam` als wach (D-827). Das importierte p2-Band erwartet `classmatesAwake:1`. Der Auftakt nennt entfärbte Tiere; die Schlussbilanz nennt die drei zurückgeholten Sachen. Fenn bleibt ein eigener Klassenkind-Zähler.

## §Abdeckung

| Raum | Karten | Pflicht | Varianten | Erwartung im Quellband |
|---|---:|---:|---:|---:|
| p1 · Die Spur über den Gehegen | 20 | 14 | 6 | 21/21 Federn |
| p2 · Die Tiere rund um den Bus | 25 | 18 | 7 | 23/24 Federn |
| p3 · Hoch oben in den Bäumen | 18 | 15 | 3 | 18/22 Federn |
| p4 · Der Löwe will alle bei sich behalten | 9 | 9 | 0 | 0/0 |
| p9 · Die Blasen im Aquarium | 0 | 0 | 0 | 12/12 Blasenplätze |
| Gesamt | **72** | **56** | **16** | **79 Sammelstellen im Kapitelentwurf** |

`claims.json` klassifiziert ausschließlich die 14 Word-File-Einträge: acht Parkwörter (davon fünf Tierwörter) und sechs Ortswörter. Das vollständige Zielregister steht in [coverage.md](coverage.md): **52 Masterlisten-IDs plus elf Zusatzlernziele, je zwei verschiedene Pflichtkarten und ein benannter Reserveabruf**. 21 Reserveabrufe verwenden bewusst eine der zwei Karten erneut; keine dritte verschiedene Anwendung behauptet. Die 72 Karten tragen echte Texte, Schlüssel, Hilfen und Quellenbezug; keine ungelösten Karten-Platzhalter.

Die zugelassene Feldpalette ist choice/restore/spell/match/order. mistake und typed bleiben Boss/Finale. Neun erklärte Familien ersetzen die alte großzügige Ausnahmenliste; jede fordert eigene Aufträge/Antworten oder eigene Farbzeilen. `vocabLedger` ist leer: alle 52 IDs stehen auf beantwortbaren Feldkarten. Das Kartentor prüft die deklarierte Antwortabdeckung. Der Motor aus PR #422 kann zusätzlich tatsächlich gelöste Karten-IDs und Szenenereignisse aus der Wiedergabe prüfen. 79 isolierte Motorfälle sind grün: alle 63 Reserveplätze einschließlich 21 bewusster Wiederholungen sowie 16 Varianten. Geprüft wurden tatsächlicher Abruf, Kontext/Szenenbindung, Schlüsselannahme, einmaliger Abschluss und Cursorfortschritt ohne zusätzliche Pflicht-ID. Diese Fälle sind keine vollständig gelaufenen freiwilligen Raumwege. Vollständige freiwillige Spielwege bleiben gesondert auszuweisen (D-1001).

## §Regel-Seiten-Budget

| Seite | Phase / Anker | Sichtbarer Inhalt | Reihenfolge |
|---|---|---|---|
| Park-Plakat | p1 (5,17) | there is / there are; vier Parkbeispiele | Vor A01 und den Zählbildern |
| Ortswörter | p2 (5,17) | Alle sechs Ortswörter in drei Bildgegenüberstellungen | Vor B06/B07; p1 bestellt eigene Lehransichten je Auto-Halt |
| Kurzformen | p2 (41,17) | I'm / you're / he's / she's / it's / we're / they're in vier Vergleichszeilen | A08/B08 vorher Vollformen; Pflicht-Kurzformen erst B12/B16/C07/C09/C11/C12/D09 |
| Pronomen | p3 (6,10) | he / she / it / they / we, vier Beispielzeilen | Vor C09/C11/C12; Fenns Ich-/Wir-Sprecher schon über Pass und Gruppenbild gebunden |

**4 echte Seiten, `tipsTotal:4`.** `lehrtEn` nennt je höchstens vier exemplarische Formen, wie das bestehende Datenformat verlangt. Alle sechs Ortswörter und sieben Kurzformen stehen trotzdem vollständig in den sichtbaren Beispielen. Die kleinen Lehransichten vor den Autoaufgaben sind Teil der Bühne, keine fünfte Regelseite. Der Leser dieser Lehransichten ist in PR #422 enthalten; die Lesbarkeit der tatsächlichen Bilder bleibt Teil der Kunstabnahme.

## §Anker und Bewegung

| Phase | Schwelle | Sicherer Anker | Erwartung im importierten Beweisband |
|---|---|---|---|
| p1 | Tinte c59–60 | C (58,17) | Drei Griffe, abgeschlossene Fahrt `p1-zug`, 15 gelöste Karten-IDs einschließlich der freiwilligen A04 |
| p2 | Tinte c45–46 | C (44,17) | Griff, beide Rampen, abgeschlossene Fahrt `p2-zug`, 18 verschiedene IDs und 19 Lösungsereignisse |
| p3 | Tinte c48–49 | C (47,17) | Zwei Schlussgriffe, 15 IDs, Giraffen-Heimweg |
| p4 | Keine Tinte | Kein C | Vier Rückwurfrunden, acht Kartenfenster, vier Heimwege, D09 und Ausgang `done` |
| p9 | Keine Tinte | Kein C | 12/12 Blasenplätze und Rückkehr nach p2 |

Der Rampenprüfer liest seit PR #422 lokale Bodenanschlüsse statt der Pflichtdecke. Der rote Gegenversuch mit einer tatsächlich sinnlosen Rampe bleibt erhalten (D-825). Frühere R1a-Laufzeiten und abstrakte Ereigniszähler werden hier nicht als Messung des heutigen Inhalts geführt.

## §Status und Übergabe

Die reine Inhaltswiedergabe ist grün: alle 63 Ziele wurden auf je zwei verschiedenen Pflichtkarten beantwortet. Der Offline-Schlüsseltest meldet 208 Paint-Karten und 34 beobachtete Szenenkarten; im getrennten Unit-Durchlauf 1638 Aufgaben und null Befunde. Er verwendet die hinterlegten Lösungen und ist keine unabhängige Schülerlösung.

Im Browser sind die Übergänge p1→p2 und p2→p3 belegt. Der gesonderte Aufnahmeablauf startet p3 bei Takt null, beantwortet alle 15 Pflichtkarten genau einmal, protokolliert sieben passende Szenenanforderungen und erreicht p4. Der isolierte Löwenlauf beantwortet D01–D09 und erreicht nach 2742 Originaltakten die tatsächliche Bilanzseite; frühere Raumstände sind in diesem Direkteinstieg nicht enthalten. Im Aquarium sind zwölf Sammelobjekte und der Ausgang belegt. Der direkte Lehrereinstieg besitzt keinen Rückschein aus p2 und kehrt nach p1 zurück; der reguläre Weg p2→p9→p2 samt Fortschrittserhaltung bleibt offen. Diese automatischen Antworten verwenden vorhandene Schlüssel. Die vollständige 74-Tor-Batterie dieses Inhaltsstands steht aus. Kunst und unabhängige Abnahme tatsächlicher Schülerbilder folgen in PR-C. Die Aufnahmegrenzen stehen in D-1005; die abschließenden Prüfkopf-Belege werden im PR-Bericht festgehalten.

Alle 352 aktuellen deutschen Textstellen sind durch die vollständige A2-Lesung und die gezielte Schlusslesung abgedeckt. Der geänderte Familienauftrag wurde erneut gelesen und als schriftsprachlich, ohne Stolperbefund, eingestuft. Drei widersprüchliche Affenbefunde wurden durch eine frische Lesung der unveränderten Sätze geklärt. Die gemeinsame Pfeilsteuerung bleibt gemäß AGENTS.md §5 unverändert; ihr negatives Vorleseurteil wird als bestehende Ausnahme ausgewiesen. Einzelne Schriftstilurteile bleiben bestehen.

Die Dossiers [p1](p1.md), [p2](p2.md), [p3](p3.md), [Arena](arena.md), [Aquarium](p9.md) enthalten die Anker und Bauverträge. [pending.md](pending.md) trennt die gebauten Motorfunktionen von den verbleibenden Inhalts-, Reserve- und Bildprüfungen. Die Trial-Aufteilung nach R295 bleibt Motor (#422), Inhalt (PR-B), danach Kunst (PR-C).

**Wie geprüft:** Dokumentation mit den importierten Daten und dem gemergten Motorstand abgeglichen. Die vollständige Batterie des Motor-PRs ist im Bericht `~/Code/codex-lab/trial-berichte/422_BERICHT.md` belegt. Frische Ergebnisse dieses Inhaltsbranches werden im zugehörigen PR-Bericht festgehalten; Kunst- und Schülerbildabnahme sind offen.
