# Ein vollständiges Chapter als Wortdatensatz-Probe

**CODEX DRAFT — NOT CANON · 34 von 34 Einträgen · keine Freigabe für Schüler oder Runtime.**

Halloween in Jahr 2, Unit 3 prüft konkrete Dinge, Handlungen, abstrakte Begriffe, Wendungen und Episodenbezüge an einem überschaubaren Beispiel. Der [JSON-Entwurf](vocabulary-calibration-g2-u03.json) enthält jeden aktuellen Bankeintrag, alle vier Abrufrichtungen mit vollständigen Antwortmengen und die Belege. Kein Schülertext wurde geändert. Die folgenden Bewertungen sind Vorschläge für Koki; erst nach seiner Kalibrierentscheidung darf das Muster auf weitere Kapitel übertragen werden.

## Wie die Belege zu lesen sind

Ein Appendix-Fund ist ein Vorkommen im Buch, keine freigegebene Bedeutung und kein Beweis des ersten Unterrichts. Die Aufgaben bleiben in Unit 3, selbst wenn ein Appendix eine frühere Klasse, Unit 10 oder die Episode T1 nennt. T1 steht im Original für The Twins 1. Alle Bedeutungskennungen und Erstunterrichtsfelder bleiben leer. Die Layout-Zeile ist die einbasierte Zeile der PDF-Textextraktion, keine gedruckte Zeilennummer; Seite, Spalte und Stichwort erlauben den visuellen Gegencheck. Die Originalseiten wurden angesehen, nicht nur Textdateien durchsucht.

Gelesen: Student’s Book (Schulbuch) S.24–31 und Workbook (Arbeitsbuch) S.21–28 vollständig; dazu die 17 unten benötigten Appendix-Seiten. Die 34 aktuellen Einträge stimmen mit den wirksamen Aufgaben nach Anwendung vorhandener Korrekturen überein. Der gemeinsame ursprüngliche Gesamt-PDF der Auszüge ist weiter unbewiesen.

| Buchauszug | SHA-256 | PDF-Seiten |
|---|---|---|
| book-g2-source-0052 | `0b74e8b26ed076b1c287ab3aad878de6caca7f086e6704d4db1fe4abcbfadfd1` | 8 |
| book-g2-source-0161 | `2cc7768db2d90807a0a624a7326432e8e55f3fa8df6fe25a3ecf4a03ed3acc3d` | 8 |
| book-g2-source-0153 | `060ceec0ec4174ea6d3f73190999eda8bf9cb586446ec10dd48d84da3deca26b` | 37 |
| book-g2-source-0163 | `dcad466b4c4776b58e242f7a9f0e4037d68cb508a47b88c1b21f05b60592b62f` | 9 |

## Sprachvoraussetzungen und Grenzen

Der Wort-für-Wort-Abgleich im JSON erfasst Definition, Kontext, englischen Übersetzungsprompt, Auswahlwörter und englische Glosseneinträge. Er bewahrt die Originalreferenzen für jedes gefundene Wort und kennzeichnet Nichttreffer als unbekannt. Eine Fundstelle in MORE 1 ist die Behauptung des Anhangs, keine bestätigte Beherrschung; ein späterer Verweis beweist ebenso wenig, dass ein Wort vorher nie vorkam. Wortarten, zusammengesetzte Ausdrücke und Satzbau müssen zusätzlich gelesen werden. Beispielsweise deckt das Nomen fight nicht das Verb fights ab.

Präsens und einfache Vergangenheit werden vor diesem Chapter wiederholt; should/shouldn’t wird hier eingeführt (SB29, WB23–24). Relativsätze, the dead und makes you jump erhalten keine automatische Freigabe durch einzelne bekannte Wörter. Ein glossiertes Wort wird dadurch nicht stillschweigend zur passenden englischen Stützsprache. Jahr-1-Deutschführung wird an diesem Jahr-2-Beispiel nicht abgenommen.

Im Buch tragen Bilder, Wortlisten und Kreuzworträtsel-Längen wesentlich zur Lösbarkeit bei. Deshalb ist ein Quellenzitat nicht automatisch eine eindeutige isolierte Lückenaufgabe. Die unabhängige Kaltlösung wurde vor Einsicht in die Antworten festgehalten. Alle 34 Datensätze behalten den Status „Diagnose, keine Freigabe“.

## Sichtbare Kalibrierentscheidungen

Besonders wichtig: pumpkin bucket ist im Master ein Behälter, während WB28 pumpkin beschriftet; myself braucht im Satz „talk to myself“ die deutsche Lesart mir selbst; der Appendix gibt could not und Pluraletiketten an, die der enge automatische Kandidatenvergleich bewusst nicht alle auflöst. to be proud (of) steht auf WB28/SB25, obwohl der Appendix U10/3 sagt. to lose ist in der Wortseite unter T1, der Appendix nennt U3/1. Diese Unterschiede bleiben nebeneinander erhalten.

## 1. witch — Hexe

Aufgabe `g2u03.w.witch`, Revision 1; Übungsplatz `g2-u03`. Original: Appendix S.155, PDF 34, right, Layout-Zeile 54: **witch (pl witches) · U3/1 · Hexe**. Beziehung: `manual-plural-label-candidate`. Vollständige DOCX-Zeilen, Hashes und Fundstellen im JSON.

**Vorhandene Definition:** A woman in scary stories who can do magic.

**Vorhandener Kontext:** Do all ___ wear funny hats? — Yes, and they can do magic, too!

**Vier Abrufrichtungen und vorhandene Antwortpolitik:**

- definition-to-en: A woman in scary stories who can do magic. → witch [full]; a witch [full]; witches [partial]
- context-to-en: Do all ___ wear funny hats? — Yes, and they can do magic, too! → witches [full]
- de-to-en: Hexe → witch [full]; a witch [full]; witches [partial]
- en-to-de: witch → Hexe [full]; die Hexe [full]; eine Hexe [full]; Hexen [partial]

**Prüfbefund:** Kontext braucht witches im Plural; Definition Zielwort-frei, aber magic als Nomen/Verbindung prüfen. Appendix witch(pl witches) ist echter Beleg trotz Parser-Nichttreffer.

**Stützsprache:** Unbekannte Wörter im engen Nachschlagevergleich: a, magic, hats. Wörter mit mindestens einem späteren Appendix-Verweis: keine. Das sind Prüfhinweise, keine automatische Untauglichkeitsentscheidung. Satzbau: present-simple (bank-sequenced-before); relative (unverified); can-must (mixed-before-and-chunk).

**Deutsche Hilfe, unverändert:** Denk an Besen, spitzen Hut und Zauberei.

**Bildvorschlag (scene):** Hexenfigur mit Besen, spitzem Hut und Zauberhandlung. Noch kein Bild und keine Erkennungsprüfung.

**Activity:** derzeit draw. Vorschläge können sich überlappen:

- Zeichnen: ja: mehrere Merkmale statt nur Hut.
- Zeigen: bedingt: Besenflug/Zaubern, wizard als Konkurrenz.
- Erklären: ja: weibliche Zauberfigur in Geschichten erklären.

## 2. ghost — Geist

Aufgabe `g2u03.w.ghost`, Revision 2; Übungsplatz `g2-u03`. Original: Appendix S.144, PDF 23, left, Layout-Zeile 1: **ghost · U3/1 · Geist**. Beziehung: `candidate`. Vollständige DOCX-Zeilen, Hashes und Fundstellen im JSON.

**Vorhandene Definition:** A dead man or woman who can come back at night in scary stories.

**Vorhandener Kontext:** Edwina looked white. Then she disappeared. Was she a ___?

**Vier Abrufrichtungen und vorhandene Antwortpolitik:**

- definition-to-en: A dead man or woman who can come back at night in scary stories. → ghost [full]; a ghost [full]; ghosts [partial]
- context-to-en: Edwina looked white. Then she disappeared. Was she a ___? → ghost [full]
- de-to-en: Geist → ghost [full]; a ghost [full]; ghosts [partial]
- en-to-de: ghost → Geist [full]; der Geist [full]; ein Geist [full]; Gespenst [full]; das Gespenst [full]; ein Gespenst [full]; Geister [partial]

**Prüfbefund:** Verschwinden plus weiße Gestalt gibt brauchbare Hinweise. Definition ist als Geschichtenfigur zu verstehen, keine Tatsachenbehauptung.

**Stützsprache:** Unbekannte Wörter im engen Nachschlagevergleich: a, edwina, looked, she, captain. Wörter mit mindestens einem späteren Appendix-Verweis: back. Das sind Prüfhinweise, keine automatische Untauglichkeitsentscheidung. Satzbau: present-simple (bank-sequenced-before); past (bank-sequenced-before); relative (unverified); can-must (mixed-before-and-chunk).

**Deutsche Hilfe, unverändert:** Weiß und durchsichtig — buh!

**Bildvorschlag (scene):** Durchsichtige Gestalt in einer Geschichte; kein bloß weißes Kostüm. Noch kein Bild und keine Erkennungsprüfung.

**Activity:** derzeit draw. Vorschläge können sich überlappen:

- Zeichnen: ja: schwebende durchsichtige Gestalt.
- Zeigen: bedingt: Schweben/Spuken, leicht mit monster verwechselbar.
- Erklären: ja: Figur aus einer Gruselgeschichte erklären.

## 3. pumpkin bucket — Kürbiseimer

Aufgabe `g2u03.w.pumpkin-bucket`, Revision 1; Übungsplatz `g2-u03`. Original: Appendix S.150, PDF 29, left, Layout-Zeile 18: **pumpkin · MORE 1 · Kürbis**. Beziehung: `related-object-not-equivalent`. Vollständige DOCX-Zeilen, Hashes und Fundstellen im JSON.

**Vorhandene Definition:** Children carry it when they go trick-or-treating and put their sweets in it.

**Vorhandener Kontext:** The child is trick-or-treating with a ___ for the sweets.

**Vier Abrufrichtungen und vorhandene Antwortpolitik:**

- definition-to-en: Children carry it when they go trick-or-treating and put their sweets in it. → pumpkin bucket [full]; a pumpkin bucket [full]; pumpkin buckets [partial]
- context-to-en: The child is trick-or-treating with a ___ for the sweets. → pumpkin bucket [full]
- de-to-en: Kürbiseimer → pumpkin bucket [full]; a pumpkin bucket [full]; pumpkin buckets [partial]
- en-to-de: pumpkin bucket → Kürbiseimer [full]; der Kürbiseimer [full]; ein Kürbiseimer [full]; Eimer [partial]

**Prüfbefund:** Definition und Kontext nennen keine Kürbisform; bag/basket/bucket wären möglich. WB28 beschriftet pumpkin, Masterbank pumpkin bucket; Identität offen, nicht still reparieren.

**Stützsprache:** Unbekannte Wörter im engen Nachschlagevergleich: go, treating, a, bucket. Wörter mit mindestens einem späteren Appendix-Verweis: carry, cycle. Das sind Prüfhinweise, keine automatische Untauglichkeitsentscheidung. Satzbau: present-simple (bank-sequenced-before); relative (unverified); when-clause (book-exposed-chunk).

**Deutsche Hilfe, unverändert:** Da kommen deine Süßigkeiten rein.

**Bildvorschlag (scene):** Tragbarer Eimer in Kürbisform mit Griff und Süßigkeiten; Form muss sichtbar sein. Noch kein Bild und keine Erkennungsprüfung.

**Activity:** derzeit draw. Vorschläge können sich überlappen:

- Zeichnen: ja: nur wenn Eimer, Griff und Kürbisform unterschieden werden.
- Zeigen: nein: Tragen/Sammeln zeigt bag, nicht Kürbisform.
- Erklären: bedingt: Behälterform beschreiben, compound-Sprachvoraussetzungen prüfen.

## 4. vampire — Vampir

Aufgabe `g2u03.w.vampire`, Revision 2; Übungsplatz `g2-u03`. Original: Appendix S.155, PDF 34, left, Layout-Zeile 11: **vampire · U3/1 · Vampir/Vampirin**. Beziehung: `candidate`. Vollständige DOCX-Zeilen, Hashes und Fundstellen im JSON.

**Vorhandene Definition:** In scary stories, a man with long teeth and a black cape.

**Vorhandener Kontext:** I've got my ___ costume, but I can't find my teeth.

**Vier Abrufrichtungen und vorhandene Antwortpolitik:**

- definition-to-en: In scary stories, a man with long teeth and a black cape. → vampire [full]; a vampire [full]; vampires [partial]
- context-to-en: I've got my ___ costume, but I can't find my teeth. → vampire [full]
- de-to-en: Vampir → vampire [full]; a vampire [full]; vampires [partial]
- en-to-de: vampire → Vampir [full]; der Vampir [full]; ein Vampir [full]; Vampire [partial]

**Prüfbefund:** Definition schränkt unnötig auf Mann und schwarzen Umhang ein; Kontext teeth ist stärker, bleibt durch Antwort-/Wortlistenprüfung zu prüfen.

**Stützsprache:** Unbekannte Wörter im engen Nachschlagevergleich: a, i've, got, can't. Wörter mit mindestens einem späteren Appendix-Verweis: keine. Das sind Prüfhinweise, keine automatische Untauglichkeitsentscheidung. Satzbau: present-simple (bank-sequenced-before); can-must (mixed-before-and-chunk); have-got (bank-sequenced-before).

**Deutsche Hilfe, unverändert:** Er hat lange, spitze Zähne.

**Bildvorschlag (scene):** Vampirfigur mit spitzen Eckzähnen und weiteren Gruselmerkmalen. Noch kein Bild und keine Erkennungsprüfung.

**Activity:** derzeit draw. Vorschläge können sich überlappen:

- Zeichnen: ja: Eckzähne unterscheiden Figur vom allgemeinen Umhangträger.
- Zeigen: ja: Fangzähne und Vampirpose; keine bloße Fledermaus.
- Erklären: ja: fiktive Figur mit charakteristischen Zähnen erklären.

## 5. trick or treat — Süßes oder Saures

Aufgabe `g2u03.w.trick-or-treat`, Revision 1; Übungsplatz `g2-u03`. Original: Appendix S.154, PDF 33, right, Layout-Zeile 3: **Trick or treat! · U3/3 · Süßes oder Saures (Frage beim Halloween-Umzug)**. Beziehung: `related-speech-act-not-equivalent`. Vollständige DOCX-Zeilen, Hashes und Fundstellen im JSON.

**Vorhandene Definition:** At Halloween, children knock on doors and ask for sweets.

**Vorhandener Kontext:** When my friends meet for ___, we go from door to door.

**Vier Abrufrichtungen und vorhandene Antwortpolitik:**

- definition-to-en: At Halloween, children knock on doors and ask for sweets. → trick or treat [full]; trick-or-treat [full]; Trick or treat! [partial]
- context-to-en: When my friends meet for ___, we go from door to door. → trick or treat [full]; trick-or-treat [full]
- de-to-en: Süßes oder Saures → trick or treat [full]; trick-or-treat [full]
- en-to-de: trick or treat → Süßes oder Saures [full]; Süßes, sonst gibt's Saures [full]

**Prüfbefund:** Definition beschreibt die Aktivität; Kontext aus Gedicht ist belegbar. Nicht automatisch mit der Frageform in zweitem Eintrag gleichsetzen.

**Stützsprache:** Unbekannte Wörter im engen Nachschlagevergleich: halloween, on, go, to, treat, bobbing. Wörter mit mindestens einem späteren Appendix-Verweis: keine. Das sind Prüfhinweise, keine automatische Untauglichkeitsentscheidung. Satzbau: present-simple (bank-sequenced-before); when-clause (book-exposed-chunk).

**Deutsche Hilfe, unverändert:** Von Tür zu Tür ziehen und Süßigkeiten sammeln.

**Bildvorschlag (sequence):** Verkleidete Gruppe zieht von Tür zu Tür und sammelt Süßigkeiten. Noch kein Bild und keine Erkennungsprüfung.

**Activity:** derzeit show. Vorschläge können sich überlappen:

- Zeichnen: ja: mehrere Türen und Sammeln unterscheiden es vom einzelnen Ruf.
- Zeigen: ja: klingeln, Tasche hinhalten, weitergehen.
- Erklären: ja: Halloween-Aktivität beschreiben; Ruf separat halten.

## 6. apple bobbing — Äpfeltauchen

Aufgabe `g2u03.w.apple-bobbing`, Revision 1; Übungsplatz `g2-u03`. Original: Appendix S.137, PDF 16, right, Layout-Zeile 70: **apple bobbing · U3/3 · Apfeltauchen (traditionelles Halloween-Spiel)**. Beziehung: `candidate`. Vollständige DOCX-Zeilen, Hashes und Fundstellen im JSON.

**Vorhandene Definition:** You play this at Halloween: there is food in water, and you must catch it with your mouth — no fingers!

**Vorhandener Kontext:** We also play ___ at Halloween. It's difficult, but fun — you must catch an apple with your mouth!

**Vier Abrufrichtungen und vorhandene Antwortpolitik:**

- definition-to-en: You play this at Halloween: there is food in water, and you must catch it with your mouth — no fingers! → apple bobbing [full]
- context-to-en: We also play ___ at Halloween. It's difficult, but fun — you must catch an apple with your mouth! → apple bobbing [full]
- de-to-en: Äpfeltauchen → apple bobbing [full]
- en-to-de: apple bobbing → Äpfeltauchen [full]; Apfeltauchen [full]; das Äpfeltauchen [full]

**Prüfbefund:** Definition und Kontext tragen die entscheidende Mund-Regel; food ist ungenauer als apple, der Kontext präzisiert. Mehrere Sätze sind sinnvoll.

**Stützsprache:** Unbekannte Wörter im engen Nachschlagevergleich: you, halloween, it's, an, bobbing, treat. Wörter mit mindestens einem späteren Appendix-Verweis: keine. Das sind Prüfhinweise, keine automatische Untauglichkeitsentscheidung. Satzbau: present-simple (bank-sequenced-before); can-must (mixed-before-and-chunk).

**Deutsche Hilfe, unverändert:** Ein Partyspiel: Obst fangen — nur mit dem Mund!

**Bildvorschlag (scene):** Schüssel mit schwimmenden Äpfeln; Kind greift nur mit dem Mund, Hände hinter dem Rücken. Noch kein Bild und keine Erkennungsprüfung.

**Activity:** derzeit draw. Vorschläge können sich überlappen:

- Zeichnen: ja: Schüssel, Äpfel und Mund unterscheiden das Spiel vom Essen.
- Zeigen: ja: Hände zurück, Kopf zur Schüssel; Wasser muss erkennbar sein.
- Erklären: ja: Spielregeln ohne Zielwort erklären.

## 7. mask — Maske

Aufgabe `g2u03.w.mask`, Revision 1; Übungsplatz `g2-u03`. Original: Appendix S.147, PDF 26, left, Layout-Zeile 23: **mask · MORE 1 · Maske**. Beziehung: `candidate`. Vollständige DOCX-Zeilen, Hashes und Fundstellen im JSON.

**Vorhandene Definition:** You wear it over your eyes and nose, so you look like a ghost or a vampire.

**Vorhandener Kontext:** Everybody wears a ___ over their eyes. We're vampires, witches and ghosts!

**Vier Abrufrichtungen und vorhandene Antwortpolitik:**

- definition-to-en: You wear it over your eyes and nose, so you look like a ghost or a vampire. → mask [full]; a mask [full]; masks [partial]
- context-to-en: Everybody wears a ___ over their eyes. We're vampires, witches and ghosts! → mask [full]
- de-to-en: Maske → mask [full]; a mask [full]; masks [partial]
- en-to-de: mask → Maske [full]; die Maske [full]; eine Maske [full]; Masken [partial]

**Prüfbefund:** Kontext ist gut gestützt; Definition eyes and nose kann Halbmaske beschreiben, nicht nur ghost/vampire.

**Stützsprache:** Unbekannte Wörter im engen Nachschlagevergleich: you, nose, so, look, a, we're, cap. Wörter mit mindestens einem späteren Appendix-Verweis: keine. Das sind Prüfhinweise, keine automatische Untauglichkeitsentscheidung. Satzbau: present-simple (bank-sequenced-before).

**Deutsche Hilfe, unverändert:** Du trägst sie im Gesicht.

**Bildvorschlag (scene):** Abnehmbare Halloweenmaske vor einem Gesicht, Band sichtbar. Noch kein Bild und keine Erkennungsprüfung.

**Activity:** derzeit draw. Vorschläge können sich überlappen:

- Zeichnen: ja: abnehmbares Teil statt Gesichtsfarbe.
- Zeigen: ja: Maske aufsetzen; Figur ohne Maske nicht ausreichend.
- Erklären: ja: Gesichtsbedeckung für Verkleidung erklären.

## 8. tradition — Tradition

Aufgabe `g2u03.w.tradition`, Revision 1; Übungsplatz `g2-u03`. Original: Appendix S.154, PDF 33, left, Layout-Zeile 67: **tradition · U3 · Tradition**. Beziehung: `candidate`. Vollständige DOCX-Zeilen, Hashes und Fundstellen im JSON.

**Vorhandene Definition:** What a family always does, year after year — at Halloween or on a birthday.

**Vorhandener Kontext:** What's your favourite Halloween ___ — apple bobbing or trick or treat?

**Vier Abrufrichtungen und vorhandene Antwortpolitik:**

- definition-to-en: What a family always does, year after year — at Halloween or on a birthday. → tradition [full]; a tradition [full]; traditions [partial]
- context-to-en: What's your favourite Halloween ___ — apple bobbing or trick or treat? → tradition [full]
- de-to-en: Tradition → tradition [full]; a tradition [full]; traditions [partial]
- en-to-de: tradition → Tradition [full]; die Tradition [full]; eine Tradition [full]; Brauch [full]; der Brauch [full]; ein Brauch [full]

**Prüfbefund:** Definition year after year unterstützt Wiederholung; always zu absolut. Kontext erlaubt activity; Tradition nicht jede beliebige Wiederholung.

**Stützsprache:** Unbekannte Wörter im engen Nachschlagevergleich: a, halloween, on, what's, bobbing, treat. Wörter mit mindestens einem späteren Appendix-Verweis: keine. Das sind Prüfhinweise, keine automatische Untauglichkeitsentscheidung. Satzbau: present-simple (bank-sequenced-before); relative (unverified).

**Deutsche Hilfe, unverändert:** Etwas, das ihr jedes Jahr wieder macht.

**Bildvorschlag (sequence):** Dieselbe Familienhandlung in mehreren Jahren, gleiche markante Beteiligte. Noch kein Bild und keine Erkennungsprüfung.

**Activity:** derzeit explain. Vorschläge können sich überlappen:

- Zeichnen: bedingt: wiederholtes Ereignis kann habit heißen; Jahresfolge braucht Konvention.
- Zeigen: nein: Wiederholung allein zeigt keine kulturelle/familiäre Tradition.
- Erklären: ja: wiederkehrende überlieferte Handlung mit Beispiel erklären.

## 9. to fear — (sich) fürchten (vor)

Aufgabe `g2u03.w.to-fear`, Revision 2; Übungsplatz `g2-u03`. Original: Appendix S.143, PDF 22, left, Layout-Zeile 11: **to fear · U3/2 · fürchten**. Beziehung: `candidate-verb-only`. Vollständige DOCX-Zeilen, Hashes und Fundstellen im JSON.

**Vorhandene Definition:** To be scared of a ghost, a big dog or a scary story.

**Vorhandener Kontext:** We do not ___ the zombies, because we aren't scared of them!

**Vier Abrufrichtungen und vorhandene Antwortpolitik:**

- definition-to-en: To be scared of a ghost, a big dog or a scary story. → to fear [full]; fear [full]
- context-to-en: We do not ___ the zombies, because we aren't scared of them! → fear [full]
- de-to-en: (sich) fürchten (vor) → to fear [full]; fear [full]; to be scared of [full]; be scared of [full]; to be scared [full]; be scared [full]; to be afraid of [partial]; be afraid of [partial]; to be afraid [partial]; be afraid [partial]
- en-to-de: to fear → fürchten [full]; sich fürchten [full]; sich fürchten vor [full]; Angst haben vor [full]; Angst haben [full]; sich erschrecken [partial]; Angst [partial]

**Prüfbefund:** Verneinter Kontext nennt not scared und stützt fear. Nomen fear und Verb to fear getrennt; aktuelle Aufgabe Verb.

**Stützsprache:** Unbekannte Wörter im engen Nachschlagevergleich: to, scared, a, not, zombies, aren't, hate. Wörter mit mindestens einem späteren Appendix-Verweis: fear. Das sind Prüfhinweise, keine automatische Untauglichkeitsentscheidung. Satzbau: present-simple (bank-sequenced-before); because (bank-sequenced-before).

**Deutsche Hilfe, unverändert:** Du hast große Angst vor etwas.

**Bildvorschlag (scene):** Person weicht vor einer erkennbaren Bedrohung zurück; Blickrichtung zeigt wer Angst hat. Noch kein Bild und keine Erkennungsprüfung.

**Activity:** derzeit show. Vorschläge können sich überlappen:

- Zeichnen: bedingt: Opfer- statt Verursacherperspektive sichtbar halten.
- Zeigen: ja: Angst zeigen; scary/scare nicht verwechseln.
- Erklären: ja: Angst vor etwas haben erklären.

## 10. to cut off — abschneiden

Aufgabe `g2u03.w.to-cut-off`, Revision 1; Übungsplatz `g2-u03`. Original: Appendix S.141, PDF 20, left, Layout-Zeile 30: **to cut off · U3/3 · abschneiden**. Beziehung: `candidate`. Vollständige DOCX-Zeilen, Hashes und Fundstellen im JSON.

**Vorhandene Definition:** To make a piece go away with a knife

**Vorhandener Kontext:** Please give me the knife. I want to ___ the top of the pumpkin.

**Vier Abrufrichtungen und vorhandene Antwortpolitik:**

- definition-to-en: To make a piece go away with a knife → to cut off [full]; cut off [full]
- context-to-en: Please give me the knife. I want to ___ the top of the pumpkin. → cut off [full]
- de-to-en: abschneiden → to cut off [full]; cut off [full]
- en-to-de: to cut off → abschneiden [full]; wegschneiden [partial]; schneiden [partial]

**Prüfbefund:** Zwei Sätze liefern Werkzeug und Ziel. Definition make a piece go away umständlich; cut/off als Verbverbindung prüfen.

**Stützsprache:** Unbekannte Wörter im engen Nachschlagevergleich: to, a, go. Wörter mit mindestens einem späteren Appendix-Verweis: fear. Das sind Prüfhinweise, keine automatische Untauglichkeitsentscheidung. Satzbau: present-simple (bank-sequenced-before); imperative (bank-sequenced-before); purpose (unverified).

**Deutsche Hilfe, unverändert:** Das machst du mit einem Messer – zum Beispiel beim Kürbis.

**Bildvorschlag (sequence):** Vorher ganzer Kürbis, danach abgetrennter Deckel; Schnitt und Trennung sichtbar. Noch kein Bild und keine Erkennungsprüfung.

**Activity:** derzeit show. Vorschläge können sich überlappen:

- Zeichnen: ja: abgetrenntes Stück unterscheidet cut von cut off.
- Zeigen: ja: Schneiden und Teil weglegen.
- Erklären: ja: mit Messer einen Teil abtrennen erklären.

## 11. front window — Vorderfenster

Aufgabe `g2u03.w.front-window`, Revision 2; Übungsplatz `g2-u03`. Original: Appendix S.143, PDF 22, right, Layout-Zeile 32: **front window · U3/3 · Vorderfenster, Frontscheibe**. Beziehung: `candidate-broader-source`. Vollständige DOCX-Zeilen, Hashes und Fundstellen im JSON.

**Vorhandene Definition:** The glass in a building that you look out of, into the street

**Vorhandener Kontext:** We put some vampire stickers on his ___.

**Vier Abrufrichtungen und vorhandene Antwortpolitik:**

- definition-to-en: The glass in a building that you look out of, into the street → front window [full]; a front window [full]
- context-to-en: We put some vampire stickers on his ___. → front window [full]; front windows [full]; window [partial]; windows [partial]
- de-to-en: Vorderfenster → front window [full]; window [partial]
- en-to-de: front window → Vorderfenster [full]; vorderes Fenster [full]; Fenster [partial]; das Vorderfenster [full]

**Prüfbefund:** Glas allein ist kein Fenster; Kontext erlaubt door/window ohne Frontunterscheidung. Appendix zusätzlich Frontscheibe, Aufgabe nur Hausfenster.

**Stützsprache:** Unbekannte Wörter im engen Nachschlagevergleich: a, you, look, out, on, front. Wörter mit mindestens einem späteren Appendix-Verweis: keine. Das sind Prüfhinweise, keine automatische Untauglichkeitsentscheidung. Satzbau: present-simple (bank-sequenced-before); relative (unverified); past (bank-sequenced-before).

**Deutsche Hilfe, unverändert:** Das Glas vorne am Haus – da siehst du auf die Straße.

**Bildvorschlag (scene):** Haus von vorne mit hervorgehobenem Fenster; Seitensicht als Kontrast. Noch kein Bild und keine Erkennungsprüfung.

**Activity:** derzeit draw. Vorschläge können sich überlappen:

- Zeichnen: bedingt: Frontlage muss sichtbar werden, sonst nur window.
- Zeigen: nein: Körperbewegung unterscheidet Front- und Seitenfenster nicht.
- Erklären: ja: Fenster an der Vorderseite eines Hauses beschreiben.

## 12. to keep — (be-)halten

Aufgabe `g2u03.w.to-keep`, Revision 1; Übungsplatz `g2-u03`. Original: Appendix S.146, PDF 25, left, Layout-Zeile 15: **to keep · U3/3 · (be-)halten**. Beziehung: `candidate`. Vollständige DOCX-Zeilen, Hashes und Fundstellen im JSON.

**Vorhandene Definition:** To have a thing and not give it away

**Vorhandener Kontext:** Let's ___ the pumpkin for Halloween.

**Vier Abrufrichtungen und vorhandene Antwortpolitik:**

- definition-to-en: To have a thing and not give it away → to keep [full]; keep [full]
- context-to-en: Let's ___ the pumpkin for Halloween. → keep [full]
- de-to-en: (be-)halten → to keep [full]; keep [full]; to hold [partial]; hold [partial]
- en-to-de: to keep → behalten [full]; halten [full]; aufheben [partial]

**Prüfbefund:** Kontext Let's…pumpkin for Halloween erlaubt buy/save/decorate; keine eindeutige Behauptung. Definition stützt Besitzbehalt.

**Stützsprache:** Unbekannte Wörter im engen Nachschlagevergleich: to, have, a, not, let's, halloween. Wörter mit mindestens einem späteren Appendix-Verweis: fear. Das sind Prüfhinweise, keine automatische Untauglichkeitsentscheidung. Satzbau: present-simple (bank-sequenced-before); lets (book-exposed-chunk).

**Deutsche Hilfe, unverändert:** Du gibst es nicht mehr her – es bleibt bei dir.

**Bildvorschlag (sequence):** Person behält denselben Gegenstand, während ein Weitergeben als Alternative abgelehnt wird. Noch kein Bild und keine Erkennungsprüfung.

**Activity:** derzeit show. Vorschläge können sich überlappen:

- Zeichnen: bedingt: zwei Zustände und Gegenstandskontinuität nötig.
- Zeigen: ja: Gegenstand an sich halten und nicht hergeben.
- Erklären: ja: behalten statt weggeben erklären.

## 13. to be proud (of) — stolz sein (auf)

Aufgabe `g2u03.w.to-be-proud`, Revision 1; Übungsplatz `g2-u03`. Original: Appendix S.150, PDF 29, left, Layout-Zeile 11: **to be proud (of) · U10/3 · stolz sein (auf)**. Beziehung: `candidate-reference-conflict`. Vollständige DOCX-Zeilen, Hashes und Fundstellen im JSON.

**Vorhandene Definition:** When you are very happy about a good thing that you did

**Vorhandener Kontext:** This year my pumpkin was the best. I was very ___ of it.

**Vier Abrufrichtungen und vorhandene Antwortpolitik:**

- definition-to-en: When you are very happy about a good thing that you did → to be proud of [full]; to be proud [full]; be proud of [full]; be proud [full]; proud [full]
- context-to-en: This year my pumpkin was the best. I was very ___ of it. → proud [full]
- de-to-en: stolz sein (auf) → to be proud of [full]; to be proud [full]; be proud of [full]; be proud [full]; proud [partial]
- en-to-de: to be proud (of) → stolz sein (auf) [full]; stolz sein auf [full]; stolz sein [full]; auf etwas stolz sein [full]; stolz [partial]

**Prüfbefund:** Kontext hat Leistung als Ursache und proud of als Wendung. Lücke verlangt proud, nicht to be proud (of). WB28/SB25 vs AppendixU10/3 getrennt.

**Stützsprache:** Unbekannte Wörter im engen Nachschlagevergleich: you, a, best, to, scared. Wörter mit mindestens einem späteren Appendix-Verweis: fear. Das sind Prüfhinweise, keine automatische Untauglichkeitsentscheidung. Satzbau: present-simple (bank-sequenced-before); past (bank-sequenced-before); relative (unverified).

**Deutsche Hilfe, unverändert:** Dein Kürbis ist der beste in der Klasse – wie fühlst du dich?

**Bildvorschlag (sequence):** Eigene gelungene Arbeit und danach stolze Haltung; Ursache sichtbar. Noch kein Bild und keine Erkennungsprüfung.

**Activity:** derzeit keine gespeicherte Kategorie. Vorschläge können sich überlappen:

- Zeichnen: bedingt: Leistung plus Reaktion trennt proud von happy.
- Zeigen: ja: auf eigene Leistung weisen, stolze Haltung; happy bleibt Gegenprobe.
- Erklären: ja: Freude über eigene Leistung erklären.

## 14. stairs — Treppe

Aufgabe `g2u03.w.stairs`, Revision 1; Übungsplatz `g2-u03`. Original: Appendix S.152, PDF 31, right, Layout-Zeile 31: **stairs · U3/3 · Treppe**. Beziehung: `candidate`. Vollständige DOCX-Zeilen, Hashes und Fundstellen im JSON.

**Vorhandene Definition:** In a building, you go up these to the rooms over you

**Vorhandener Kontext:** We go up the ___ in the dark.

**Vier Abrufrichtungen und vorhandene Antwortpolitik:**

- definition-to-en: In a building, you go up these to the rooms over you → stairs [full]; the stairs [full]
- context-to-en: We go up the ___ in the dark. → stairs [full]
- de-to-en: Treppe → stairs [full]; the stairs [full]
- en-to-de: stairs → Treppe [full]; die Treppe [full]; Stiege [full]; Treppen [partial]; Stiegen [partial]

**Prüfbefund:** Kontext allein erlaubt ladder; Definition over you ist unnatürlich für darüberliegende Räume. Pluralform bewahren.

**Stützsprache:** Unbekannte Wörter im engen Nachschlagevergleich: a, you, go, up, to, front. Wörter mit mindestens einem späteren Appendix-Verweis: keine. Das sind Prüfhinweise, keine automatische Untauglichkeitsentscheidung. Satzbau: present-simple (bank-sequenced-before).

**Deutsche Hilfe, unverändert:** Da gehst du Stufe für Stufe nach oben.

**Bildvorschlag (scene):** Mehrere feste Stufen zwischen zwei Etagen. Noch kein Bild und keine Erkennungsprüfung.

**Activity:** derzeit draw. Vorschläge können sich überlappen:

- Zeichnen: ja: feste Treppe statt Leiter.
- Zeigen: bedingt: imaginäre Stufen gehen, climb als Konkurrenz.
- Erklären: ja: Weg aus Stufen zwischen Etagen erklären.

## 15. sticker — Aufkleber, Sticker

Aufgabe `g2u03.w.sticker`, Revision 2; Übungsplatz `g2-u03`. Original: Appendix S.152, PDF 31, right, Layout-Zeile 51: **sticker · U3/3 · Aufkleber, Etikett**. Beziehung: `candidate`. Vollständige DOCX-Zeilen, Hashes und Fundstellen im JSON.

**Vorhandene Definition:** A small picture that you can put on a window, a book or a door

**Vorhandener Kontext:** I put a vampire ___ on his window.

**Vier Abrufrichtungen und vorhandene Antwortpolitik:**

- definition-to-en: A small picture that you can put on a window, a book or a door → sticker [full]; a sticker [full]; stickers [partial]
- context-to-en: I put a vampire ___ on his window. → sticker [full]
- de-to-en: Aufkleber → sticker [full]; stickers [partial]
- en-to-de: sticker → Aufkleber [full]; Sticker [full]; Pickerl [partial]; der Aufkleber [full]; der Sticker [full]

**Prüfbefund:** Definition/Context unterscheiden sticker nicht zuverlässig von picture/poster; Klebeeigenschaft fehlt.

**Stützsprache:** Unbekannte Wörter im engen Nachschlagevergleich: a, you, on, ring, tin. Wörter mit mindestens einem späteren Appendix-Verweis: key. Das sind Prüfhinweise, keine automatische Untauglichkeitsentscheidung. Satzbau: present-simple (bank-sequenced-before); relative (unverified); can-must (mixed-before-and-chunk); past (bank-sequenced-before).

**Deutsche Hilfe, unverändert:** Kleine bunte Bilder für dein Heft oder dein Fenster.

**Bildvorschlag (sequence):** Kleines Bild wird vom Träger abgezogen und auf ein Heft geklebt. Noch kein Bild und keine Erkennungsprüfung.

**Activity:** derzeit draw. Vorschläge können sich überlappen:

- Zeichnen: ja: ablösbare Rückseite oder Klebevorgang unterscheidet picture.
- Zeigen: ja: abziehen und aufkleben.
- Erklären: ja: kleines selbstklebendes Bild erklären.

## 16. sweets — Süßigkeiten

Aufgabe `g2u03.w.sweets`, Revision 2; Übungsplatz `g2-u03`. Original: Appendix S.153, PDF 32, left, Layout-Zeile 56: **sweets (pl) · U3/3 · Süßigkeiten**. Beziehung: `manual-plural-label-candidate`. Vollständige DOCX-Zeilen, Hashes und Fundstellen im JSON.

**Vorhandene Definition:** Food with a lot of sugar in it, like chocolate

**Vorhandener Kontext:** People sometimes give us ___ at Halloween.

**Vier Abrufrichtungen und vorhandene Antwortpolitik:**

- definition-to-en: Food with a lot of sugar in it, like chocolate → sweets [full]; candy [partial]
- context-to-en: People sometimes give us ___ at Halloween. → sweets [full]; candy [partial]
- de-to-en: Süßigkeiten → sweets [full]; candy [partial]
- en-to-de: sweets → Süßigkeiten [full]; die Süßigkeiten [full]; Süßes [full]; Zuckerl [partial]; Zuckerln [partial]

**Prüfbefund:** Definition breit, Kontext könnte chocolate/money heißen. Plural und britische Sammelbezeichnung getrennt von einer einzelnen Süßigkeit prüfen.

**Stützsprache:** Unbekannte Wörter im engen Nachschlagevergleich: a, lot, sugar, halloween, sausages, bread. Wörter mit mindestens einem späteren Appendix-Verweis: keine. Das sind Prüfhinweise, keine automatische Untauglichkeitsentscheidung. Satzbau: present-simple (bank-sequenced-before).

**Deutsche Hilfe, unverändert:** Die sammelst du an Halloween im Kürbiseimer – lecker, aber schlecht für die Zähne!

**Bildvorschlag (scene):** Mehrere Bonbons und andere Süßigkeiten als Gruppe. Noch kein Bild und keine Erkennungsprüfung.

**Activity:** derzeit draw. Vorschläge können sich überlappen:

- Zeichnen: ja: mehrere Süßigkeiten statt nur chocolate.
- Zeigen: bedingt: Auswickeln und Essen, food/chocolate als Konkurrenz.
- Erklären: ja: süße Lebensmittel mit Beispielen erklären.

## 17. Trick or treat! — Süßes oder Saures (Frage beim Halloween-Umzug)

Aufgabe `g2u03.w.trick-or-treat-2`, Revision 2; Übungsplatz `g2-u03`. Original: Appendix S.154, PDF 33, right, Layout-Zeile 3: **Trick or treat! · U3/3 · Süßes oder Saures (Frage beim Halloween-Umzug)**. Beziehung: `candidate`. Vollständige DOCX-Zeilen, Hashes und Fundstellen im JSON.

**Vorhandene Definition:** Children ask this at the door at Halloween when they want sweets

**Vorhandener Kontext:** We knocked on the door. A woman opened it. "___?" Darren asked.

**Vier Abrufrichtungen und vorhandene Antwortpolitik:**

- definition-to-en: Children ask this at the door at Halloween when they want sweets → Trick or treat! [full]; Trick or treat [full]; trick or treat [full]; Trick-or-treat! [full]; Trick-or-treat [full]; trick-or-treat [full]
- context-to-en: We knocked on the door. A woman opened it. "___?" Darren asked. → Trick or treat [full]; trick or treat [full]; Trick or treat! [full]; Trick-or-treat [full]; trick-or-treat [full]; Trick-or-treat! [full]
- de-to-en: Süßes oder Saures (Frage beim Halloween-Umzug) → Trick or treat! [full]; Trick or treat [full]; trick or treat [full]; trick or treating [partial]
- en-to-de: Trick or treat! → Süßes oder Saures [full]; Süßes oder Saures! [full]; Süßes, sonst gibt's Saures [partial]; Streich oder Süßes [partial]

**Prüfbefund:** Mehrere Sätze sind passend; WB25 enthält Frageform. Quelle exclamation vs Kontextfrage bewahren; nicht automatisch alle Interpunktionsformen ablehnen.

**Stützsprache:** Unbekannte Wörter im engen Nachschlagevergleich: halloween, on, a, darren, treat, go, what's, matter, have. Wörter mit mindestens einem späteren Appendix-Verweis: keine. Das sind Prüfhinweise, keine automatische Untauglichkeitsentscheidung. Satzbau: present-simple (bank-sequenced-before); past (bank-sequenced-before); when-clause (book-exposed-chunk).

**Deutsche Hilfe, unverändert:** Diesen Ruf hörst du an Halloween an jeder Haustür.

**Bildvorschlag (nonvisual):** Türszene gibt Kontext, kann die genaue gesprochene Formel aber nicht wortlos festlegen. Noch kein Bild und keine Erkennungsprüfung.

**Activity:** derzeit keine gespeicherte Kategorie. Vorschläge können sich überlappen:

- Zeichnen: nein: dieselbe Szene könnte die ganze Aktivität meinen.
- Zeigen: bedingt: Anklopfen und fragende Geste; nur nach geklärter Ruf-Konvention.
- Erklären: ja: Halloween-Ruf an der Haustür umschreiben.

## 18. knife (pl knives) — Messer

Aufgabe `g2u03.w.knife`, Revision 1; Übungsplatz `g2-u03`. Original: Appendix S.146, PDF 25, left, Layout-Zeile 33: **knife (pl knives) · U3/4 · Messer**. Beziehung: `candidate`. Vollständige DOCX-Zeilen, Hashes und Fundstellen im JSON.

**Vorhandene Definition:** With this, you can cut off a piece of bread or cheese

**Vorhandener Kontext:** I need a ___ to cut vegetables.

**Vier Abrufrichtungen und vorhandene Antwortpolitik:**

- definition-to-en: With this, you can cut off a piece of bread or cheese → knife [full]; a knife [full]
- context-to-en: I need a ___ to cut vegetables. → knife [full]
- de-to-en: Messer → knife [full]; a knife [full]; knives [full]
- en-to-de: knife (pl knives) → Messer [full]; das Messer [full]

**Prüfbefund:** Kontext nützlich, aber Gemüse schneiden allein schließt anderes Werkzeug nicht aus. Lexem knife, gesetzte Form knife, Plural knives getrennt bewahren.

**Stützsprache:** Unbekannte Wörter im engen Nachschlagevergleich: you, a, bread, to, pl, tin, ruler. Wörter mit mindestens einem späteren Appendix-Verweis: keine. Das sind Prüfhinweise, keine automatische Untauglichkeitsentscheidung. Satzbau: present-simple (bank-sequenced-before); can-must (mixed-before-and-chunk); purpose (unverified).

**Deutsche Hilfe, unverändert:** Vorsicht, scharf! Damit schneidest du dein Brot.

**Bildvorschlag (scene):** Küchenmesser mit Klinge und Griff neben geschnittenem Gemüse. Noch kein Bild und keine Erkennungsprüfung.

**Activity:** derzeit draw. Vorschläge können sich überlappen:

- Zeichnen: ja: klare Klinge, kein unspezifisches Werkzeug.
- Zeigen: bedingt: Schneiden allein könnte scissors heißen.
- Erklären: ja: Schneidewerkzeug mit einer Klinge erklären.

## 19. century — Jahrhundert

Aufgabe `g2u03.w.century`, Revision 1; Übungsplatz `g2-u03`. Original: Appendix S.139, PDF 18, right, Layout-Zeile 37: **century · U3/5 · Jahrhundert**. Beziehung: `candidate`. Vollständige DOCX-Zeilen, Hashes und Fundstellen im JSON.

**Vorhandene Definition:** One hundred years - a very long time.

**Vorhandener Kontext:** She was dressed like a girl from the 19th ___.

**Vier Abrufrichtungen und vorhandene Antwortpolitik:**

- definition-to-en: One hundred years - a very long time. → century [full]; a century [full]
- context-to-en: She was dressed like a girl from the 19th ___. → century [full]
- de-to-en: Jahrhundert → century [full]; a century [full]; one hundred years [partial]; hundred years [partial]; 100 years [partial]
- en-to-de: century → Jahrhundert [full]; das Jahrhundert [full]; hundert Jahre [partial]; 100 Jahre [partial]

**Prüfbefund:** Definition präzise; Kontext mit 19th lässt auch andere Nomen zu und setzt die Geschichte voraus. Ordinalzahl und was dressed prüfen.

**Stützsprache:** Unbekannte Wörter im engen Nachschlagevergleich: one, a, she, 19th. Wörter mit mindestens einem späteren Appendix-Verweis: keine. Das sind Prüfhinweise, keine automatische Untauglichkeitsentscheidung. Satzbau: past (bank-sequenced-before); ordinal (bank-sequenced-before); dressed (book-exposed-chunk).

**Deutsche Hilfe, unverändert:** Denk an eine sehr lange Zeit: hundert Jahre.

**Bildvorschlag (sequence):** Hundert Jahre auf einer Zeitfolge; mehrere Generationen, Zahlen nur als Lernhilfe. Noch kein Bild und keine Erkennungsprüfung.

**Activity:** derzeit explain. Vorschläge können sich überlappen:

- Zeichnen: bedingt: Zeitfolge kann auch Geschichte bedeuten; Zahlkonvention vorab klären.
- Zeigen: nein: hundert Jahre pantomimisch nicht eindeutig.
- Erklären: ja: hundert Jahre erklären, ohne century zu nennen.

## 20. costume — Kostüm

Aufgabe `g2u03.w.costume`, Revision 1; Übungsplatz `g2-u03`. Original: Appendix S.140, PDF 19, right, Layout-Zeile 59: **costume · MORE 1 · Kostüm, Verkleidung**. Beziehung: `candidate`. Vollständige DOCX-Zeilen, Hashes und Fundstellen im JSON.

**Vorhandene Definition:** You wear it at Halloween to look like a vampire, a witch or a ghost.

**Vorhandener Kontext:** Her ___ is scary! She looks like a vampire.

**Vier Abrufrichtungen und vorhandene Antwortpolitik:**

- definition-to-en: You wear it at Halloween to look like a vampire, a witch or a ghost. → costume [full]; a costume [full]; mask [partial]
- context-to-en: Her ___ is scary! She looks like a vampire. → costume [full]; mask [partial]; dress [partial]
- de-to-en: Kostüm → costume [full]; a costume [full]
- en-to-de: costume → Kostüm [full]; das Kostüm [full]; Verkleidung [full]

**Prüfbefund:** Kontext kann auch mask heißen; Definition nennt mehrere Figuren und trägt den Verkleidungszweck.

**Stützsprache:** Unbekannte Wörter im engen Nachschlagevergleich: you, halloween, to, look, a, she, looks, sweater, cap. Wörter mit mindestens einem späteren Appendix-Verweis: keine. Das sind Prüfhinweise, keine automatische Untauglichkeitsentscheidung. Satzbau: present-simple (bank-sequenced-before); purpose (unverified).

**Deutsche Hilfe, unverändert:** Das ziehst du zu Halloween an.

**Bildvorschlag (scene):** Alltagskleidung neben derselben Person als Halloweenfigur; Verkleidung hervorheben. Noch kein Bild und keine Erkennungsprüfung.

**Activity:** derzeit draw. Vorschläge können sich überlappen:

- Zeichnen: ja: Verkleidung mit mehreren Erkennungsmerkmalen; nicht nur Kleid zeichnen.
- Zeigen: ja: imaginäre Verkleidung anziehen; Verwechslung mit dress bleibt möglich.
- Erklären: ja: Zweck der Verkleidung beschreiben.

## 21. couldn't — konnte/n nicht

Aufgabe `g2u03.w.couldn-t`, Revision 1; Übungsplatz `g2-u03`. Original: Appendix S.140, PDF 19, right, Layout-Zeile 65: **couldn’t (could not) · U3/5 · könnte/n nicht; konnte/n nicht**. Beziehung: `manual-citation-candidate`. Vollständige DOCX-Zeilen, Hashes und Fundstellen im JSON.

**Vorhandene Definition:** You wanted to do it yesterday, but it was not possible.

**Vorhandener Kontext:** Lara wanted to eat more sweets, but she ___ - she was too sick.

**Vier Abrufrichtungen und vorhandene Antwortpolitik:**

- definition-to-en: You wanted to do it yesterday, but it was not possible. → couldn't [full]; could not [full]
- context-to-en: Lara wanted to eat more sweets, but she ___ - she was too sick. → couldn't [full]; could not [full]; didn't [partial]
- de-to-en: konnte/n nicht → couldn't [full]; could not [full]; was not able to [partial]; wasn't able to [partial]
- en-to-de: couldn't → konnte nicht [full]; konnten nicht [full]; konntest nicht [full]

**Prüfbefund:** Definition signalisiert Vergangenheit; Kontext Lara wanted…but… bleibt auch mit anderen Modalformen sinnvoll. couldn't = Vergangenheit hier, nicht alle Lesarten des Appendix.

**Stützsprache:** Unbekannte Wörter im engen Nachschlagevergleich: you, to, not, lara, she, couldn't, can't, doesn't, don't. Wörter mit mindestens einem späteren Appendix-Verweis: keine. Das sind Prüfhinweise, keine automatische Untauglichkeitsentscheidung. Satzbau: past (bank-sequenced-before); modal-past (current-chapter-chunk).

**Deutsche Hilfe, unverändert:** Du wolltest es tun, aber es ging einfach nicht.

**Bildvorschlag (sequence):** Versuch und Scheitern in einer vergangenen Szene; Zeitbezug braucht zusätzliche Führung. Noch kein Bild und keine Erkennungsprüfung.

**Activity:** derzeit show. Vorschläge können sich überlappen:

- Zeichnen: nein: Zeichnung zeigt Schwierigkeit, nicht zuverlässig vergangene Unfähigkeit.
- Zeigen: bedingt: erfolgloser Versuch zeigt cannot, aber keine Vergangenheit.
- Erklären: ja: vergangene Unfähigkeit anhand eines Beispiels.

## 22. cute — niedlich, süß

Aufgabe `g2u03.w.cute`, Revision 1; Übungsplatz `g2-u03`. Original: Appendix S.141, PDF 20, left, Layout-Zeile 27: **cute · U3/5 · niedlich, süß**. Beziehung: `candidate`. Vollständige DOCX-Zeilen, Hashes und Fundstellen im JSON.

**Vorhandene Definition:** Small, pretty and nice to look at - like a young rabbit.

**Vorhandener Kontext:** Look at my rabbit. Isn't it ___? I love its small nose and big eyes.

**Vier Abrufrichtungen und vorhandene Antwortpolitik:**

- definition-to-en: Small, pretty and nice to look at - like a young rabbit. → cute [full]; sweet [partial]
- context-to-en: Look at my rabbit. Isn't it ___? I love its small nose and big eyes. → cute [full]; sweet [partial]; pretty [partial]; beautiful [partial]
- de-to-en: niedlich → cute [full]; sweet [partial]; pretty [partial]
- en-to-de: cute → niedlich [full]; süß [full]; herzig [full]; putzig [partial]; hübsch [partial]

**Prüfbefund:** Kontext erlaubt lovely/beautiful/sweet; subjektive Eigenschaft nicht als eindeutig lösbar erklären.

**Stützsprache:** Unbekannte Wörter im engen Nachschlagevergleich: to, look, a, isn't, its, nose. Wörter mit mindestens einem späteren Appendix-Verweis: keine. Das sind Prüfhinweise, keine automatische Untauglichkeitsentscheidung. Satzbau: present-simple (bank-sequenced-before); negative-question (current-chapter-chunk).

**Deutsche Hilfe, unverändert:** Denk an ein junges Häschen - einfach zum Liebhaben.

**Bildvorschlag (scene):** Junges Kaninchen mit kleinen Proportionen; neutraler Vergleich mit erwachsenem Tier. Noch kein Bild und keine Erkennungsprüfung.

**Activity:** derzeit show. Vorschläge können sich überlappen:

- Zeichnen: bedingt: Bild kann rabbit/small heißen; Eigenschaft bleibt Urteil.
- Zeigen: bedingt: Zuneigung zeigen, Verwechslung mit happy/love möglich.
- Erklären: ja: Wirkung eines kleinen jungen Tieres beschreiben.

## 23. dress — Kleid

Aufgabe `g2u03.w.dress`, Revision 2; Übungsplatz `g2-u03`. Original: Appendix S.142, PDF 21, left, Layout-Zeile 5: **dress · MORE 1 · Kleid**. Beziehung: `candidate`. Vollständige DOCX-Zeilen, Hashes und Fundstellen im JSON.

**Vorhandene Definition:** Girls often wear it to a surprise party - it is long, like a skirt and a shirt in one.

**Vorhandener Kontext:** Edwina wears a long ___, like a girl from the 19th century.

**Vier Abrufrichtungen und vorhandene Antwortpolitik:**

- definition-to-en: Girls often wear it to a surprise party - it is long, like a skirt and a shirt in one. → dress [full]; a dress [full]; dresses [partial]
- context-to-en: Edwina wears a long ___, like a girl from the 19th century. → dress [full]; skirt [partial]; costume [partial]
- de-to-en: Kleid → dress [full]; a dress [full]
- en-to-de: dress → Kleid [full]; das Kleid [full]

**Prüfbefund:** Definition und deutscher Hinweis machen Mädchen/Party unnötig zum Merkmal; Kontext erlaubt auch coat. Wortbedeutung von Tragesituation trennen.

**Stützsprache:** Unbekannte Wörter im engen Nachschlagevergleich: to, a, one, edwina, 19th, cap, hoodie, sweater. Wörter mit mindestens einem späteren Appendix-Verweis: keine. Das sind Prüfhinweise, keine automatische Untauglichkeitsentscheidung. Satzbau: present-simple (bank-sequenced-before).

**Deutsche Hilfe, unverändert:** Mädchen tragen es auf Partys - wie Rock und Oberteil in einem.

**Bildvorschlag (scene):** Ein Kleid als zusammenhängendes Kleidungsstück; keine Party als notwendiges Merkmal. Noch kein Bild und keine Erkennungsprüfung.

**Activity:** derzeit draw. Vorschläge können sich überlappen:

- Zeichnen: ja: Rock und Oberteil als ein Stück erkennbar.
- Zeigen: bedingt: Anziehen allein unterscheidet Kleid nicht von Kostüm.
- Erklären: ja: Kleidungsstück ohne Geschlechterpflicht beschreiben.

## 24. graveyard — Friedhof

Aufgabe `g2u03.w.graveyard`, Revision 2; Übungsplatz `g2-u03`. Original: Appendix S.144, PDF 23, left, Layout-Zeile 60: **graveyard · U3/5 · Friedhof**. Beziehung: `candidate`. Vollständige DOCX-Zeilen, Hashes und Fundstellen im JSON.

**Vorhandene Definition:** A dark place with stones where the dead lie.

**Vorhandener Kontext:** There were some trees next to the ___, a dark place with stones for the dead.

**Vier Abrufrichtungen und vorhandene Antwortpolitik:**

- definition-to-en: A dark place with stones where the dead lie. → graveyard [full]; a graveyard [full]; cemetery [partial]
- context-to-en: There were some trees next to the ___, a dark place with stones for the dead. → graveyard [full]
- de-to-en: Friedhof → graveyard [full]; a graveyard [full]; cemetery [partial]
- en-to-de: graveyard → Friedhof [full]; der Friedhof [full]

**Prüfbefund:** Dunkelheit ist kein Wesensmerkmal. Definition the dead/lie und Kontext stones brauchen Wortarten- und Bedeutungsprüfung.

**Stützsprache:** Unbekannte Wörter im engen Nachschlagevergleich: a, to, campsite. Wörter mit mindestens einem späteren Appendix-Verweis: keine. Das sind Prüfhinweise, keine automatische Untauglichkeitsentscheidung. Satzbau: present-simple (bank-sequenced-before); past (bank-sequenced-before); relative (unverified); nominal-dead (unverified).

**Deutsche Hilfe, unverändert:** Ein dunkler Ort mit alten Grabsteinen.

**Bildvorschlag (scene):** Mehrere Grabsteine auf einem Friedhof, auch bei Tageslicht erkennbar. Noch kein Bild und keine Erkennungsprüfung.

**Activity:** derzeit draw. Vorschläge können sich überlappen:

- Zeichnen: ja: Grabsteine und Wege unterscheiden den Ort.
- Zeigen: nein: Liegen/Trauer benennt Ort nicht eindeutig.
- Erklären: ja: Ort mit Gräbern erklären.

## 25. myself — mich selbst, mir selbst

Aufgabe `g2u03.w.myself`, Revision 1; Übungsplatz `g2-u03`. Original: Appendix S.148, PDF 27, left, Layout-Zeile 5: **myself · U3/5 · mich selbst, mir selbst**. Beziehung: `candidate-broader-source`. Vollständige DOCX-Zeilen, Hashes und Fundstellen im JSON.

**Vorhandene Definition:** Me, and no one else - like in: "I looked at ... in the mirror."

**Vorhandener Kontext:** When I am alone, I often talk to ___.

**Vier Abrufrichtungen und vorhandene Antwortpolitik:**

- definition-to-en: Me, and no one else - like in: "I looked at ... in the mirror." → myself [full]; me [partial]
- context-to-en: When I am alone, I often talk to ___. → myself [full]
- de-to-en: mich selbst → myself [full]; me [partial]
- en-to-de: myself → mich selbst [full]; mir selbst [full]; mich [partial]; mir [partial]; ich selbst [partial]; selbst [partial]

**Prüfbefund:** Deutscher Prompt mich selbst passt nicht zur Kontextform mir selbst; Appendix/WB geben beide. Me and no one else erfasst auch emphatische Lesart, nicht nur Reflexiv.

**Stützsprache:** Unbekannte Wörter im engen Nachschlagevergleich: one, looked, mirror, to, you. Wörter mit mindestens einem späteren Appendix-Verweis: keine. Das sind Prüfhinweise, keine automatische Untauglichkeitsentscheidung. Satzbau: present-simple (bank-sequenced-before); reflexive (current-chapter-chunk); when-clause (book-exposed-chunk).

**Deutsche Hilfe, unverändert:** Denk dran: Ich rede mit mir - nicht mit ihm oder ihr.

**Bildvorschlag (sequence):** Eine Person spricht und die Sprechrichtung führt zu ihr selbst; Zusatzführung notwendig. Noch kein Bild und keine Erkennungsprüfung.

**Activity:** derzeit explain. Vorschläge können sich überlappen:

- Zeichnen: nein: self-Bezug und genaue Pronomenform bleiben unsicher.
- Zeigen: bedingt: Auf sich selbst zeigen ist auch me/I.
- Erklären: ja: I…to… als Reflexivbezug erklären, keine fremde Grammatik voraussetzen.

## 26. shall — sollen; wollen

Aufgabe `g2u03.w.shall`, Revision 3; Übungsplatz `g2-u03`. Original: Appendix S.151, PDF 30, right, Layout-Zeile 27: **shall · U3/5 · sollen; wollen**. Beziehung: `candidate`. Vollständige DOCX-Zeilen, Hashes und Fundstellen im JSON.

**Vorhandene Definition:** You ask a friend about what to do: "Where ... we go? What ... we do?"

**Vorhandener Kontext:** "Where ___ we go?" asked Edwina. "Well, down the road!"

**Vier Abrufrichtungen und vorhandene Antwortpolitik:**

- definition-to-en: You ask a friend about what to do: "Where ... we go? What ... we do?" → shall [full]; should [partial]
- context-to-en: "Where ___ we go?" asked Edwina. "Well, down the road!" → shall [full]; should [partial]; can [partial]
- de-to-en: sollen → shall [full]; should [full]
- en-to-de: shall → sollen [full]; wollen [full]

**Prüfbefund:** Where…we go erlaubt should/can/could; keine eindeutige Einzelantwort ohne explizites Lernziel. Einführung als Wendung in SB26 belegt, nicht als vollständige Modalgrammatik.

**Stützsprache:** Unbekannte Wörter im engen Nachschlagevergleich: you, a, to, go, edwina, couldn't, can't, don't. Wörter mit mindestens einem späteren Appendix-Verweis: keine. Das sind Prüfhinweise, keine automatische Untauglichkeitsentscheidung. Satzbau: modal-suggestion (current-chapter-chunk); past (bank-sequenced-before).

**Deutsche Hilfe, unverändert:** Du machst einen Vorschlag: Wohin ... wir gehen?

**Bildvorschlag (nonvisual):** Ein Vorschlag lässt sich illustrieren, die genaue Modalform nicht wortlos erkennen. Noch kein Bild und keine Erkennungsprüfung.

**Activity:** derzeit explain. Vorschläge können sich überlappen:

- Zeichnen: nein: Bild zeigt eine Wahl oder Frage, nicht shall.
- Zeigen: nein: fragende Geste bestimmt Modalform nicht.
- Erklären: ja: Vorschlag mit we und passendem Beispielsatz erklären.

## 27. sick — übel; krank

Aufgabe `g2u03.w.sick`, Revision 3; Übungsplatz `g2-u03`. Original: Appendix S.151, PDF 30, right, Layout-Zeile 58: **sick · U3/5 · übel; krank**. Beziehung: `candidate-broader-source`. Vollständige DOCX-Zeilen, Hashes und Fundstellen im JSON.

**Vorhandene Definition:** Ill and not well. You can be like this after too many sweets.

**Vorhandener Kontext:** I feel a bit ___. Too many sweets!

**Vier Abrufrichtungen und vorhandene Antwortpolitik:**

- definition-to-en: Ill and not well. You can be like this after too many sweets. → sick [full]
- context-to-en: I feel a bit ___. Too many sweets! → sick [full]; ill [partial]
- de-to-en: übel → sick [full]; ill [partial]
- en-to-de: sick → krank [full]; übel [full]; schlecht [partial]

**Prüfbefund:** Definition ill/not well ist breiter als gewähltes übel; Kontext trägt Übelkeit besser. Englische Varianten ill/unwell und deutsche krank sind nicht automatisch gleichwertig.

**Stützsprache:** Unbekannte Wörter im engen Nachschlagevergleich: not, you, a, bit. Wörter mit mindestens einem späteren Appendix-Verweis: keine. Das sind Prüfhinweise, keine automatische Untauglichkeitsentscheidung. Satzbau: present-simple (bank-sequenced-before).

**Deutsche Hilfe, unverändert:** Zu viele Süßigkeiten – und dir geht es nicht gut.

**Bildvorschlag (scene):** Person mit Übelkeit nach zu vielen Süßigkeiten; Hand am Bauch, kein Erbrechen nötig. Noch kein Bild und keine Erkennungsprüfung.

**Activity:** derzeit show. Vorschläge können sich überlappen:

- Zeichnen: bedingt: Übelkeit statt allgemeinem Bauchweh erkennbar machen.
- Zeigen: ja: Übelkeit spielen; Abgrenzung hungry/stomach ache nötig.
- Erklären: ja: Zustand nach zu vielen Süßigkeiten erklären.

## 28. superheroine — Superheldin

Aufgabe `g2u03.w.superheroine`, Revision 3; Übungsplatz `g2-u03`. Original: Appendix S.153, PDF 32, left, Layout-Zeile 41: **superheroine · U3/5 · Superheldin**. Beziehung: `candidate`. Vollständige DOCX-Zeilen, Hashes und Fundstellen im JSON.

**Vorhandene Definition:** A very strong woman from a story or a fantasy film. She fights bad people.

**Vorhandener Kontext:** She was dressed up as her favourite ___.

**Vier Abrufrichtungen und vorhandene Antwortpolitik:**

- definition-to-en: A very strong woman from a story or a fantasy film. She fights bad people. → superheroine [full]; superhero [partial]
- context-to-en: She was dressed up as her favourite ___. → superheroine [full]; superhero [partial]
- de-to-en: Superheldin → superheroine [full]; superhero [partial]
- en-to-de: superheroine → Superheldin [full]; Superheld [partial]; Heldin [partial]; die Superheldin [full]

**Prüfbefund:** Kontext kann jede weibliche Figur sein. to fight als Verb ist nicht durch das bekannte Nomen fight gedeckt; fantasy und dressed up gesondert prüfen.

**Stützsprache:** Unbekannte Wörter im engen Nachschlagevergleich: a, fantasy, film, she, up. Wörter mit mindestens einem späteren Appendix-Verweis: keine. Das sind Prüfhinweise, keine automatische Untauglichkeitsentscheidung. Satzbau: present-simple (bank-sequenced-before); past (bank-sequenced-before); dressed (book-exposed-chunk).

**Deutsche Hilfe, unverändert:** Denk an starke Frauen aus Comics, die fliegen können.

**Bildvorschlag (scene):** Erkennbare weibliche Comic-Heldin rettet jemanden; Kräfte sichtbar, kein Markencharakter nötig. Noch kein Bild und keine Erkennungsprüfung.

**Activity:** derzeit draw. Vorschläge können sich überlappen:

- Zeichnen: bedingt: Rettung/Kräfte statt nur Frau im Umhang.
- Zeigen: bedingt: Heldentat spielen, genaue weibliche Bezeichnung bleibt unklar.
- Erklären: ja: weibliche Heldin mit besonderen Kräften erklären.

## 29. wild — wild

Aufgabe `g2u03.w.wild`, Revision 2; Übungsplatz `g2-u03`. Original: Appendix S.155, PDF 34, right, Layout-Zeile 42: **wild · U3/14 · wild**. Beziehung: `candidate-selected-play-sense`. Vollständige DOCX-Zeilen, Hashes und Fundstellen im JSON.

**Vorhandene Definition:** Very noisy, with a lot of running and jumping.

**Vorhandener Kontext:** You shouldn't play many ___ games.

**Vier Abrufrichtungen und vorhandene Antwortpolitik:**

- definition-to-en: Very noisy, with a lot of running and jumping. → wild [full]
- context-to-en: You shouldn't play many ___ games. → wild [full]; dangerous [partial]
- de-to-en: wild → wild [full]; crazy [partial]; mad [partial]
- en-to-de: wild → wild [full]; verrückt [partial]

**Prüfbefund:** Kontext shouldn't play many…games erlaubt dangerous/noisy; Verbot allein bestimmt wild nicht. Definition markiert die hier gewählte Spiel-Lesart.

**Stützsprache:** Unbekannte Wörter im engen Nachschlagevergleich: a, lot, you, shouldn't. Wörter mit mindestens einem späteren Appendix-Verweis: keine. Das sind Prüfhinweise, keine automatische Untauglichkeitsentscheidung. Satzbau: present-simple (bank-sequenced-before); should (current-chapter-target).

**Deutsche Hilfe, unverändert:** Denk an laute Spiele, bei denen alle herumrennen.

**Bildvorschlag (scene):** Tobende Spielsituation im Kontrast zu ruhigem Brettspiel. Noch kein Bild und keine Erkennungsprüfung.

**Activity:** derzeit show. Vorschläge können sich überlappen:

- Zeichnen: bedingt: Gegensatz zeigt ungestüm statt nur noisy.
- Zeigen: ja: ungestümes Spiel sicher darstellen.
- Erklären: ja: hier lebhaft/ungestüm, nicht wildlebendes Tier erklären.

## 30. to scare — Angst machen, erschrecken

Aufgabe `g2u03.w.to-scare`, Revision 2; Übungsplatz `g2-u03`. Original: Appendix S.151, PDF 30, left, Layout-Zeile 54: **to scare · U3/15 · Angst machen, erschrecken**. Beziehung: `candidate`. Vollständige DOCX-Zeilen, Hashes und Fundstellen im JSON.

**Vorhandene Definition:** When a ghost or a scary story makes you jump.

**Vorhandener Kontext:** At Halloween, some costumes ___ me.

**Vier Abrufrichtungen und vorhandene Antwortpolitik:**

- definition-to-en: When a ghost or a scary story makes you jump. → scare [full]; to scare [full]; frighten [partial]; to frighten [partial]
- context-to-en: At Halloween, some costumes ___ me. → scare [full]; scared [full]; frighten [partial]
- de-to-en: Angst machen → scare [full]; to scare [full]; frighten [partial]; to frighten [partial]
- en-to-de: to scare → erschrecken [full]; jemanden erschrecken [full]; Angst machen [full]; jemandem Angst machen [full]

**Prüfbefund:** Definition makes you jump ist körperliche Wirkung, nicht vollständige Bedeutung. Kontext stützt Verb, aber frighten ebenso natürlich.

**Stützsprache:** Unbekannte Wörter im engen Nachschlagevergleich: a, makes, you, halloween, to. Wörter mit mindestens einem späteren Appendix-Verweis: carry, fear. Das sind Prüfhinweise, keine automatische Untauglichkeitsentscheidung. Satzbau: present-simple (bank-sequenced-before); causative (unverified).

**Deutsche Hilfe, unverändert:** Das machen gruselige Kostüme zu Halloween mit dir.

**Bildvorschlag (sequence):** Eine Figur erschreckt eine andere; Auslöser und Reaktion als Paar. Noch kein Bild und keine Erkennungsprüfung.

**Activity:** derzeit show. Vorschläge können sich überlappen:

- Zeichnen: ja: Verursacher zeigen, nicht nur ängstliche Person.
- Zeigen: ja: plötzlicher Schreck mit sicherer Distanz, keine Berührung nötig.
- Erklären: ja: jemand anderem Angst machen erklären.

## 31. cycle helmet — Fahrradhelm

Aufgabe `g2u03.w.cycle-helmet`, Revision 3; Übungsplatz `g2-u03`. Original: Appendix S.141, PDF 20, left, Layout-Zeile 32: **cycle helmet · T1 · Fahrradhelm**. Beziehung: `candidate`. Vollständige DOCX-Zeilen, Hashes und Fundstellen im JSON.

**Vorhandene Definition:** A strong hat that you wear when you ride a bike.

**Vorhandener Kontext:** Always wear a ___ when you ride a bike.

**Vier Abrufrichtungen und vorhandene Antwortpolitik:**

- definition-to-en: A strong hat that you wear when you ride a bike. → cycle helmet [full]; bike helmet [partial]; helmet [partial]
- context-to-en: Always wear a ___ when you ride a bike. → cycle helmet [full]; helmet [partial]; bike helmet [partial]
- de-to-en: Fahrradhelm → cycle helmet [full]; bike helmet [partial]; helmet [partial]
- en-to-de: cycle helmet → Fahrradhelm [full]; Radhelm [full]; Helm [partial]; der Fahrradhelm [full]; der Radhelm [full]

**Prüfbefund:** Kontext grenzt Gegenstand ein, aber helmet ist natürliche Kurzantwort; Antwortmenge prüfen. Definition strong hat braucht präzisere Schutzfunktion.

**Stützsprache:** Unbekannte Wörter im engen Nachschlagevergleich: a, you, school, tie. Wörter mit mindestens einem späteren Appendix-Verweis: cycle. Das sind Prüfhinweise, keine automatische Untauglichkeitsentscheidung. Satzbau: present-simple (bank-sequenced-before); relative (unverified); imperative (bank-sequenced-before).

**Deutsche Hilfe, unverändert:** Der schützt deinen Kopf beim Radfahren.

**Bildvorschlag (scene):** Fahrradhelm mit Riemen am Kopf einer radfahrenden Person. Noch kein Bild und keine Erkennungsprüfung.

**Activity:** derzeit draw. Vorschläge können sich überlappen:

- Zeichnen: ja: Fahrrad und Helm zusammen sichern den Zweck.
- Zeigen: bedingt: Helm aufsetzen und Radfahren; hat als Konkurrenz.
- Erklären: ja: Kopfschutz beim Radfahren beschreiben.

## 32. guys — Leute

Aufgabe `g2u03.w.guys`, Revision 3; Übungsplatz `g2-u03`. Original: Appendix S.144, PDF 23, left, Layout-Zeile 75: **guys (informal) · T1 · Leute**. Beziehung: `manual-register-candidate`. Vollständige DOCX-Zeilen, Hashes und Fundstellen im JSON.

**Vorhandene Definition:** You can call a group of friends or children this.

**Vorhandener Kontext:** Come on, ___. Don't look. OK?

**Vier Abrufrichtungen und vorhandene Antwortpolitik:**

- definition-to-en: You can call a group of friends or children this. → guys [full]; kids [partial]
- context-to-en: Come on, ___. Don't look. OK? → guys [full]; everybody [partial]
- de-to-en: Leute → guys [full]; people [full]; folks [partial]
- en-to-de: guys → Leute [full]; Jungs [partial]; Freunde [partial]; die Leute [full]

**Prüfbefund:** Kontext akzeptiert friends/everyone/children. Definition beschreibt Funktion, aber nicht informelles Register; Antwortvarianten prüfen.

**Stützsprache:** Unbekannte Wörter im engen Nachschlagevergleich: you, a, on, don't, look, ok, guys, teachers, customers, neighbours. Wörter mit mindestens einem späteren Appendix-Verweis: call. Das sind Prüfhinweise, keine automatische Untauglichkeitsentscheidung. Satzbau: present-simple (bank-sequenced-before); can-must (mixed-before-and-chunk); imperative (bank-sequenced-before).

**Deutsche Hilfe, unverändert:** So nennst du eine ganze Gruppe von Freunden.

**Bildvorschlag (nonvisual):** Die informelle Anrede ist aus einer Personengruppe allein nicht ablesbar. Noch kein Bild und keine Erkennungsprüfung.

**Activity:** derzeit explain. Vorschläge können sich überlappen:

- Zeichnen: nein: Gruppe illustriert people/friends, nicht das Register der Anrede.
- Zeigen: nein: Heranwinken zeigt eine Handlung, nicht dieses Wort.
- Erklären: ja: informelle Anrede einer Gruppe mit Registergrenze.

## 33. to lose — verlieren

Aufgabe `g2u03.w.to-lose`, Revision 2; Übungsplatz `g2-u03`. Original: Appendix S.146, PDF 25, right, Layout-Zeile 50: **to lose · U3/1 · verlieren**. Beziehung: `candidate-reference-conflict`. Vollständige DOCX-Zeilen, Hashes und Fundstellen im JSON.

**Vorhandene Definition:** To not have it any more because you cannot find it.

**Vorhandener Kontext:** I don't want to ___ my mobile phone.

**Vier Abrufrichtungen und vorhandene Antwortpolitik:**

- definition-to-en: To not have it any more because you cannot find it. → lose [full]; to lose [full]; lost [partial]
- context-to-en: I don't want to ___ my mobile phone. → lose [full]; break [partial]; forget [partial]
- de-to-en: verlieren → lose [full]; to lose [full]; lost [partial]
- en-to-de: to lose → verlieren [full]; verlegen [partial]

**Prüfbefund:** Kontext I don't want to…phone erlaubt break/drop/sell; Ursache fehlt. Definition ist auf Verlieren eines Gegenstands begrenzt, nicht Spiel verlieren.

**Stützsprache:** Unbekannte Wörter im engen Nachschlagevergleich: to, not, have, you, cannot, don't, mobile, paint. Wörter mit mindestens einem späteren Appendix-Verweis: keine. Das sind Prüfhinweise, keine automatische Untauglichkeitsentscheidung. Satzbau: present-simple (bank-sequenced-before); because (bank-sequenced-before); can-must (mixed-before-and-chunk).

**Deutsche Hilfe, unverändert:** Das Gegenteil von finden – denk an dein Handy.

**Bildvorschlag (sequence):** Handy zunächst in Tasche, später leer und suchender Blick; nicht absichtlich weggeben. Noch kein Bild und keine Erkennungsprüfung.

**Activity:** derzeit show. Vorschläge können sich überlappen:

- Zeichnen: ja: unbeabsichtigter Verlust muss erkennbar sein.
- Zeigen: ja: Tasche prüfen und suchen.
- Erklären: ja: nicht mehr finden können erklären.

## 34. picnic — Picknick

Aufgabe `g2u03.w.picnic`, Revision 3; Übungsplatz `g2-u03`. Original: Appendix S.149, PDF 28, left, Layout-Zeile 54: **picnic · T1 · Picknick**. Beziehung: `candidate`. Vollständige DOCX-Zeilen, Hashes und Fundstellen im JSON.

**Vorhandene Definition:** Lunch outside. You sit down in the park and eat sandwiches from a basket.

**Vorhandener Kontext:** Let's have a ___ in the park. I can bring sandwiches and orange juice.

**Vier Abrufrichtungen und vorhandene Antwortpolitik:**

- definition-to-en: Lunch outside. You sit down in the park and eat sandwiches from a basket. → picnic [full]; a picnic [full]
- context-to-en: Let's have a ___ in the park. I can bring sandwiches and orange juice. → picnic [full]; party [partial]
- de-to-en: Picknick → picnic [full]; a picnic [full]
- en-to-de: picnic → Picknick [full]; das Picknick [full]

**Prüfbefund:** Zwei Sätze liefern mit Park und Essen brauchbaren Kontext; lunch als Definition unnötig auf Tageszeit verengt. Episode T1 nicht automatisch Erstunterricht U3.

**Stützsprache:** Unbekannte Wörter im engen Nachschlagevergleich: you, a, let's, have. Wörter mit mindestens einem späteren Appendix-Verweis: keine. Das sind Prüfhinweise, keine automatische Untauglichkeitsentscheidung. Satzbau: present-simple (bank-sequenced-before); can-must (mixed-before-and-chunk); lets (book-exposed-chunk).

**Deutsche Hilfe, unverändert:** Du isst draußen im Park – mit Korb und Decke.

**Bildvorschlag (scene):** Decke, Korb und gemeinsames Essen im Freien; kein Restauranttisch. Noch kein Bild und keine Erkennungsprüfung.

**Activity:** derzeit keine gespeicherte Kategorie. Vorschläge können sich überlappen:

- Zeichnen: ja: Essen, Decke und Park machen die Situation deutlich.
- Zeigen: bedingt: imaginär Decke ausbreiten und essen, lunch bleibt möglich.
- Erklären: ja: Essen draußen mit mitgebrachten Speisen erklären.

