# CODEX DRAFT — NOT CANON

Die angefragten Interaktionen bestehen im tatsächlichen React-Spiel auf localhost:3350. Geprüft am 13.09.2026 gegen die laufende Entwicklungsfassung; kein PaintGame-/CardHost-/Scene-Code für diese Prüfung geändert.

## Verfahren und Grenzen

Eigener kopfloser Chrome mit ausschließlich eigenem temporären Browserprofil, 1280 × 900. Keine Benutzertabs oder vorhandenen Anmeldungen übernommen. Steuerung durch Chrome DevTools Protocol über `ui-story-browser-session.mjs`; dieser wiederverwendbare Harness nimmt zeilenweise JSON mit `expression`, `shot` oder `close` entgegen. Die folgenden Prüfungen betätigten die tatsächlich gerenderten React-Knöpfe und Eingabefelder. Zum schnellen Erreichen entfernter Räume wurde die bereits vorhandene Entwicklungsfunktion `warp` benutzt; fachlich nicht geprüfte Tür-/Kampfkarten wurden über den bestehenden Entwicklungs-Solver beantwortet. Der Finale-Gruß und der Name wurden dagegen in die tatsächlichen Eingabefelder eingetragen und durch deren sichtbare Knöpfe abgeschickt. Die drei Schichten wurden mit dem vorhandenen Kampf-Treiber und dem aktuellen echten p4-Band abgetragen; keine Lebenspunkte oder Weltflags direkt verändert.

Dies ist ein Interaktionsbeweis, kein vollständiger menschlicher Durchspiel- oder Kunstabnahmebericht. Für die räumliche Erreichbarkeit gelten die gesonderten fünf Tastenbänder. Die prüfbare Ergebnisdatei ist `ui-story-interaction-results.json`. Die endgültigen erfolgreichen Messungen erfolgten, nachdem Root seine UI-Änderungen für das Zeitfenster angehalten hatte.

## Erhaltener Farbschritt

In p1 das echte Buch angesprochen; erste Antwort „book“ gedrückt. Darauf zeigte die Karte „2 · die Farbe“ und die Auswahl brown/blue/red. Geschichte geöffnet, geschlossen; Merkseite geöffnet, geschlossen. Der Farbschritt blieb beide Male erhalten. Der vorher referenzierte blue-Knopf blieb im Dokument verbunden, war während der Referenz tatsächlich verborgen und nachher wieder derselbe DOM-Knoten. Das prüft mehr als bloß erneut gleiche Worte auf einer frisch aufgebauten Karte. Anschließend blue tatsächlich gedrückt und die Farbrückgabe abgeschlossen. Beleg `ui-restore-after-both-references.png`.

## Erhaltene Texteingabe

In der erneut geöffneten wirklichen Finale-Karte „Hel“ eingetragen. Geschichte geöffnet/geschlossen und Merkseite geöffnet/geschlossen. Beide Male identisches Eingabefeld und exakter Wert „Hel“. Ergebnisse `input.afterStory` und `input.afterRules`, Screenshot `ui-finale-input-after-references.png`. Die native Input-Wertfunktion plus echtes input-Ereignis löste Reacts Änderung aus; ein bloßes DOM-Attribut ohne React-Zustand wurde nicht als Nachweis benutzt. Nachfolgendes Abschicken von Hello war erfolgreich.

## Angehaltene Uhr und Welt

Die tatsächliche Zahlenrad-Karte `g1.paint.ch01.qf.moths.w2` hatte eine 6000-ms-Uhr. Ein pointerdown-Ereignis auf dem Rad aktivierte ausdrücklich die echte Eingabe-Uhr; deren Style zeigte `--pb-ring-s: 6000ms` ohne den vorherigen ausgeschalteten Animationsnamen. Danach Merkseite 8110 ms geöffnet, also länger als das volle Zeitbudget. Die verborgene Radinstanz blieb verbunden, die Welt blieb exakt auf Takt 12. Nach „Weiterspielen“ war dieselbe Radinstanz mit derselben Aufgabe noch vorhanden. Ergebnis `clock` in JSON.

Die vorhandene Uhr ist eine Inaktivitätsfrist: nach weiterem Bedienen beginnt das Budget neu. Bei Rückkehr aus einer Referenz erhält sie ebenfalls wieder das volle Budget. Der Test behauptet keinen Restmillisekunden-Zähler. Ein vorausgehender langer Versuch wurde durch die automatische Entwicklungs-Neuladung unterbrochen (p2 sprang zurück zum Prolog); daraus wurde ausdrücklich kein Produktfehler oder Erfolg abgeleitet. Erst der ununterbrochene 8110-ms-Lauf zählt.

## Finale ohne falschen Erfolg

Der echte Kampf-Treiber beobachtete 3 → 2 → 1 → 0 Schichten, dann erschien die echte typed-Karte `g1.paint.ch01.fin.t1`. „Später“ gedrückt: zurück in die Welt, `beat.overlay=null`, `state.overlay=false`, keine Namensfrage und kein Erfolgsdialog. Sichtbar war „Den Gruß schreiben“. Diesen Knopf gedrückt: dieselbe Finale-Karte wurde wieder geöffnet. Nach obiger Referenz-/Eingabeprüfung Hello vollständig eingetragen und OK gedrückt.

Danach erschien die Namenskarte mit Hello sowohl auf der gemalten Tafel im Spielfeld als auch auf ihrer Karte. Die beiden dafür geladenen Tafelbilder waren vollständig vorhanden (naturalWidth 384). Screenshot `ui-finale-name-with-hello.png` zusätzlich visuell geöffnet: Gruß sitzt auf der grünen Tafelfläche; Namensfeld und Knopf sind vollständig sichtbar. „Probe Merle“ als eindeutigen Prüfnamen eingetragen und „Das ist mein Name“ gedrückt. Die Folgekarte sagte „Danke, Probe Merle!“; der lokale, kontogebundene Spielprofil-Save enthielt tatsächlich `displayName: "Probe Merle"`. Kein Accountname wurde verändert. Screenshot `ui-finale-console-personal-name.png`.

Der Fotofund war in diesem abgekürzten Zugriff bewusst noch false; der Test beansprucht keine bereits erfolgte Fotobefreiung. Namensspeicherung auf diesem Gerät wurde hier im Browser beobachtet. Neuer Instanz-/Kontowechsel und Fotopersistenz sind separat durch `paint-story-profile.test.ts` geprüft, nicht durch diesen Browserlauf.

## Anschluss an die neue Tafelgeometrie

Nach Roots Bild-/Wischreichweitenkorrektur p4 erneut mit unverändertem Pilotprogramm aufgenommen: 3535 Takte, fünf Aufgaben, Wächter sauber und Klassenfoto befreit, Exit done. Aktueller `ch01.proof.json` enthält diese Aufnahme. `restore-p4-new-slate-reach.log` Exit 0. Anschließend alle sechs Restore- und sieben Story-/Begleitertests gegen die aktuelle Fassung erneut grün, `restore-tests-new-slate.log` 13/13, Exit 0.

Der eigene Browser wurde über Browser.close beendet und sein Prozess war danach weg. Der interaktive Node-Eingabeleser blieb danach noch offen und wurde separat per Ctrl-C beendet; der Harness wurde um explizites Schließen/Freigeben dieses Eingabelesers ergänzt. Der einzige anschließend sichtbare andere Prüf-Chrome gehörte einem anderen Elternprozess und blieb unberührt. Keine Produktionsänderung, keine Commits und keine fremden Tests/Gates für diese UI-Bahn verändert.
