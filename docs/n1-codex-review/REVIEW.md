# CODEX DRAFT — NOT CANON

## R233 · N1-Regelseiten · Didaktik + Sprache

**State: DOCUMENT (this path)**

Prüfgegenstand: `git diff origin/main..HEAD` für `RulePage.tsx`,
`overlay-css.ts` und die fünf `role: "tip"`-Entities in
`content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json`.
Geprüft wurden der Nachher-Kontaktbogen sowie alle fünf Nachher-Einzelbilder
unter `n1-regelseiten-evidence-2026-08-31/nachher/`; die Vorherbilder dienten
als Vergleich. Maßstab: Erstlesen durch ein zehnjähriges Kind mit Deutsch als
Erstsprache, selbsterklärendes Beispiel-Layout, natürliches österreichisches
Deutsch, Kokis sechs Punkte. **Coverage vor Filterung:** Auch mittlere und
niedrige Konfidenzen sind aufgenommen; es wurden keine Befunde wegen geringer
Priorität weggelassen.

## Fix-Liste

1. **F1 · Seite 1 „Kurzformen“ · `ch01.level.json:111–112` · Erklärung legt die Regel auf das Sprechen fest.**
   „Beim Sprechen“ kann beim Erstlesen bedeuten, dass die Kurzformen nur
   gesprochen, nicht geschrieben werden. Die Karte zeigt aber eine
   Schreibregel mit Apostroph. Außerdem erklärt „rutschen ... zusammen“ den
   Vorgang bildhaft, aber nicht ausdrücklich die Kurzform als Ergebnis.
   **Konfidenz: hoch.** Vorschlag: `Im Englischen werden zwei Wörter oft zu
   einer Kurzform. Aus „I am“ wird „I'm“.` Danach können die vier
   Wandel-Beispiele bleiben.

2. **F2 · Seite 1 „Kurzformen“ · `ch01.level.json:111` und Bild `nachher/tip-regel.png` · Schlüssel-Englisch im Titel ist nicht einzeln markiert.**
   In den Beispielen sind `I'm`, `It's`, `isn't` und `don't` sichtbar markiert;
   dieselben vier versprochenen Formen stehen im Titel jedoch alle in derselben
   dunklen Tinte. Falls „Schlüssel-Englisch einzeln markiert“ für jede sichtbare
   Nennung gilt, bleibt der Titel eine Ausnahme und die Hierarchie ist nicht
   ganz konsistent. **Konfidenz: mittel.** Vorschlag: entweder den Titel auf
   `Kurzformen` kürzen und die Formen nur in den Beispielen markieren, oder die
   vier Formen auch im Titel als vier getrennte `EnMark`-Spans rendern — nicht
   als einen gemeinsamen markierten Titelblock.

3. **F3 · Seite 1 „Kurzformen“ · `ch01.level.json:113–114` · „verschwunden“ ist verständlich, aber als Regelanker weniger präzise als „fehlt“.**
   Ein Buchstabe „verschwindet“ klingt nach einer Geschichte, nicht nach einer
   verlässlichen Schreibanweisung; bei einem Kind kann offenbleiben, ob der
   Buchstabe immer an derselben Stelle fehlt. **Konfidenz: mittel.** Vorschlag:
   `Der Apostroph zeigt: Hier fehlt ein Buchstabe.` Falls die bildhafte Sprache
   gewünscht ist: `Der Apostroph steht dort, wo in der Kurzform ein Buchstabe
   fehlt.`

4. **F4 · Seite 2 „Befehle“ · `ch01.level.json:139–140` · Titel und Erklärung behaupten „das Verb allein“, obwohl das Beispiel „Close the door!“ mehrere Wörter enthält.**
   Ein zehnjähriges Kind kann „Verb allein“ wörtlich als „nur ein Wort“ lesen;
   `Close the door!` widerspricht dann dem Titel. Gemeint ist: kein `you` vor
   dem Verb. **Konfidenz: hoch.** Vorschlag für Titel und Erklärung:
   `Befehle — ohne you vor dem Verb` und `Bei einem englischen Befehl steht
   vor dem Verb kein you: Sit down!` Für die deutsche Erklärung kann ergänzt
   werden: `Du bist mitgemeint, auch wenn du nicht dastehst.`

5. **F5 · Seite 2 „Befehle“ · `ch01.level.json:140` · „die Aufgabe des Du“ ist kein natürliches, kindnahes Deutsch.**
   Die Formulierung klingt wie eine Übersetzung aus Grammatik-Metatext und
   verlangt zusätzlich, dass das Kind „Aufgabe“ abstrakt auf ein Fürwort
   überträgt. Sie ist damit genau das Muster, das der Auftrag vermeiden will.
   **Konfidenz: hoch.** Vorschlag: `Bei einem englischen Befehl musst du „du“
   nicht dazusagen. Das Verb zeigt schon, dass du gemeint bist.` Diese Fassung
   hält die gewünschte Einsicht, ohne „Aufgabe des Du“.

6. **F6 · Seite 2 „Befehle“ · `RulePage.tsx:164–179`, `rule-text.ts:83–95`, sichtbar in `nachher/tip-regel-2.png` · die Schlüsselmarken verschmelzen zu ganzen Befehlsblöcken.**
   Weil `lehrtEn` sowohl `Don't` als auch `Sit down`/`Close` enthält und die
   Funktion benachbarte Treffer über Leerraum zusammenzieht, wird `Don't sit
   down!` als ein durchgehender Wisch markiert; bei `Don't close the door!`
   wird `Don't close` zu einem Wisch. Dadurch ist gerade die Regel „Don't vor
   das Verb“ nicht mehr einzeln ablesbar. **Konfidenz: hoch.** Vorschlag:
   `Don't` als eigene Marke mit kleinem sichtbarem Abstand vor dem Verb setzen
   und die positiven Befehle separat markieren; alternativ die Beispiele mit
   expliziten Markenbereichen modellieren, die niemals zu einem Wisch
   verschmelzen. Die neutrale Zweispalten-Anordnung `TUN`/`NICHT TUN` soll dabei
   erhalten bleiben; sie wertet keine Seite als richtig oder falsch.

7. **F7 · Seite 3 „Fragen und antworten“ · `ch01.level.json:367` · Großschreibung des Titels ist falsch.**
   `Antworten` ist ein Substantiv und muss im deutschen Titel großgeschrieben
   werden. **Konfidenz: hoch.** Vorschlag: `Fragen und Antworten`.

8. **F8 · Seite 3 „Fragen und Antworten“ · `ch01.level.json:367–381`, Bild `nachher/tip-regel-3.png` · die Seite kündigt eine Regel über Frage-Antwort-Paare an, merkt aber anschließend eine andere Regel vor.**
   Titel und Erklärung handeln von der Beziehung zwischen Frage und Antwort;
   der Merksatz handelt von `I'm` gegenüber `It's`. Zusätzlich werden `What's`
   und `How are you` markiert. Beim Erstlesen ist damit nicht klar, ob das Kind
   Frage-Antwort-Paare, `What's`, oder die Auswahl `I'm`/`It's` lernen soll.
   **Konfidenz: hoch.** Vorschlag für eine eindeutige gemeinsame Linie:
   Titel `Fragen und passende Antworten`; Erklärung `Auf eine Frage folgt eine
   Antwort. Über dich beginnst du mit I'm, über eine Sache mit It's.`; Merksatz
   `Über dich: I'm + Name oder Gefühl. Über eine Sache: It's + Antwort.` Die
   Dialogform und die Einrückung können bleiben.

9. **F9 · Seite 3 „Fragen und Antworten“ · `ch01.level.json:368` · „wer oder was da ist“ passt nicht zu allen drei Beispielen.**
   `How are you?` fragt nach dem Befinden, nicht danach, wer oder was „da ist“;
   `What's your email address?` fragt nach einer Angabe. „Die andere sagt es“
   hat zudem kein klares Bezugswort. **Konfidenz: hoch.** Vorschlag:
   `Die Frage möchte etwas wissen. Die Antwort gibt diese Information.` Oder,
   wenn der Seitenfokus auf den gezeigten Mustern liegt: `What's fragt nach
   einer Information; die Antwort beginnt je nach Inhalt mit I'm oder It's.`

10. **F10 · Seite 3 „Fragen und Antworten“ · `ch01.level.json:369–370` · „sagst du I'm“/„It's“ lässt den Satz unvollständig.**
    Ein Kind kann daraus ableiten, dass `I'm` oder `It's` allein die ganze
    Antwort bilden. Die Beispiele zeigen zwar `I'm Merle`, `I'm great` und
    `It's merle@school.com`, aber die Regel benennt den nötigen Rest nicht.
    **Konfidenz: mittel-hoch.** Vorschlag: `Über dich selbst beginnt deine
    Antwort mit I'm: I'm Merle. Über eine Sache beginnt sie mit It's: It's my
    school bag.` Wenn die bestehenden Beispiele bleiben, mindestens `I'm ...`
    und `It's ...` im Merksatz verwenden.

11. **F11 · Seite 4 „Zahlen bis twenty-five“ · `ch01.level.json:394` und Bild `nachher/tip-regel-4.png` · gemischte Überschrift und unmarkierte Schlüssel-Nennung.**
    `Zahlen bis twenty-five` ist als Titel verständlich, klingt aber nicht wie
    natürliches österreichisches Deutsch und lässt das Lernziel „englische
    Zahlen“ nur indirekt erkennen. Außerdem steht `twenty-five` im Titel
    unmarkiert, während es unten als Schlüssel-Englisch markiert wird.
    **Konfidenz: mittel.** Vorschlag: `Englische Zahlen bis 25` und die
    englischen Zahlwörter nur in der Beispielzone einzeln markieren; oder ein
    klar als Englisch markiertes Titelmuster verwenden, nicht den Mischsatz.

12. **F12 · Seite 4 „Englische Zahlen bis 25“ · `ch01.level.json:395–396` · „der Zehner“ ist abstrakter als nötig und der Geltungsbereich bleibt offen.**
    „Der Zehner“ ist zwar ein korrekter Schulbegriff, aber die Karte erklärt
    nicht ausdrücklich, dass sie Zahlen wie 23–25 meint. „Im Englischen kommt
    der Zehner zuerst“ kann beim Erstlesen wie eine Regel für alle Zahlen
    wirken. **Konfidenz: mittel.** Vorschlag: `Bei Zahlen wie 23, 24 und 25
    kommt im Englischen zuerst twenty und danach three, four oder five.` Den
    Merksatz dann als konkrete Kurzform lassen: `Erst twenty, dann three:
    twenty-three.`

13. **F13 · Seite 5 „Plural“ · `ch01.level.json:558–559` und Bild `nachher/tip-regel-5.png` · „nach Mitlaut + y ein -ies“ ist keine intuitive Handlungsanweisung.**
    Der Plusoperator und die verkürzte Wortgruppe sagen nicht, was mit dem `y`
    passiert; außerdem fehlt ein Verb. **Konfidenz: hoch.** Vorschlag:
    `Steht vor dem y ein Mitlaut, wird y zu -ies.` Wenn der Begriff „Mitlaut“
    für diese Altersstufe beibehalten werden muss, ein direktes Beispiel
    unmittelbar daran anschließen: `baby wird zu babies`.

14. **F14 · Seite 5 „Plural“ · `ch01.level.json:558–564` · „manche gehen eigene Wege“ ist vage und benennt die sichtbare Ausnahme nicht.**
    Das Kind sieht `child → children`, bekommt aber keine Aussage dazu, warum
    hier nicht `-s` oder `-ies` steht. „Eigene Wege“ wirkt wie ein KI-typischer
    Platzhalter für „Ausnahme“ und verhindert, dass die vierte Zeile als
    bewusstes Lernbeispiel gelesen wird. **Konfidenz: hoch.** Vorschlag:
    `Einige Wörter sind Ausnahmen: child wird zu children.` Alternativ, wenn
    die Regel bewusst klein bleiben soll: `Manche Wörter ändern sich ganz:
    child → children.`

15. **F15 · Seite 5 „Plural“ · `ch01.level.json:557` · „fast immer ... man hört die Mehrzahl also am Ende“ übergeneralisiert die Regel.**
    Der Satz behauptet gleichzeitig eine fast-allgemeine Endung und eine
    Hörregel, obwohl die Seite auch eine unregelmäßige Form zeigt. Für das
    Erstlesen bleibt unklar, ob das Kind eine Schreibregel (`-s`) oder eine
    Hörregel lernen soll. **Konfidenz: mittel.** Vorschlag: `Bei vielen
    englischen Wörtern hörst du die Mehrzahl am Ende: book wird zu books.`
    Danach die `-ies`-Regel und die benannte Ausnahme getrennt halten.

## Abgleich mit Kokis sechs Punkten

- **Titel führt:** im Nachher-Bild klar verbessert; F4, F7, F8, F11 betreffen
  verbleibende Titel- bzw. Titel-Regel-Probleme.
- **Schlüssel-Englisch einzeln markiert:** in den Beispielzonen grundsätzlich
  sichtbar; F2 und F11 melden die unmarkierten Titel-Nennungen, F6 die
  Verschmelzung auf der Befehlsseite.
- **Kontrast-Paare getrennt ohne richtig/falsch:** Seite 2 erfüllt die
  neutrale Zweispalten-Idee; kein Befund gegen Rot/Grün, Kreuz oder
  Durchstreichen.
- **Kein KI-Zitat-Balken:** im Bild erfüllt; der Merksatz steht auf dem
  Merkzettel-Papier.
- **Erklärungen intuitiv:** F1, F4–F5, F8–F10 und F12–F15.
- **Fünf Seiten einzeln kuratiert:** die vier Darstellungsformen sind sichtbar
  verschieden; die Befunde oben betreffen die sprachliche Kuratierung einzelner
  Seiten, nicht die Forderung nach fünf unterschiedlichen Layout-Grammatiken.

## How I verified

Ich habe den Git-Diff und die fünf Inhaltsobjekte aus dem Worktree gelesen, den
Nachher-Kontaktbogen sowie alle fünf Nachher-Einzelbilder visuell angesehen und
die Vorherbilder zum Vergleich angesehen. Zusätzlich liefen
`pnpm --filter @domigo/game-paint test` (**1.483/1.483**, Exit 0) und
`pnpm check:paint-copy` (Exit 0). Nicht verifiziert wurde ein echtes
Durchspielen durch ein Kind; die vorliegenden Bilder sind Standbild-Belege.

Keine Produktionsdatei und kein Code wurde im Rahmen dieses Reviews geändert;
diese Datei ist ein unabhängiger **CODEX DRAFT — NOT CANON**.
