# Klassenfoto im lokalen Spielprofil

**CODEX DRAFT — NOT CANON** · 2026-09-13

Der Klassenfoto-Fund wird jetzt zusammen mit gewähltem Spielernamen und befreiten Mitschülern im vorhandenen lokalen Profil gespeichert. Das Profil bleibt nach einem Neuladen sowie beim Wechsel in ein weiteres Kapitel erhalten. Der eigentliche Menüeintrag und das Fundereignis werden von Root in `PaintGame` verbunden; diese Änderung enthält ausschließlich Profil und App-Anbindung.

## Änderung am Profilvertrag

`apps/web/lib/paint-story-profile.ts` ergänzt `classPhotoFound: boolean`. Der vorhandene Speicherraum `domigo:paint-story:v1:<account>` und `version: 1` bleiben unverändert. Fehlt das Feld in einer älteren gültigen v1-Datei, wird es als `false` gelesen; Name, Prologversionen und bekannte befreite Mitschüler bleiben erhalten. Nur der tatsächliche boolesche Wert `true` wird als Fund akzeptiert, keine Zeichenkette oder Zahl. Das neue Feld wird beim Speichern gemeinsam mit dem übrigen bereinigten Profil geschrieben.

Der vorhandene Kontext mit `playerKey` trennt verschiedene Konten im selben Browser. Es gibt keinen Serveraufruf und keine Datenbankänderung. Blockierter Browserspeicher wirft keinen Spielabbruch aus: Der Rückgabewert enthält das neue Profil für den Arbeitsspeicher und `persisted: false` für den bestehenden Hinweis in der Oberfläche.

**Rotprobe:** Im isolierten Quellkopie-Verzeichnis `profile-photo-mutants/drop-photo` erzwingt die Manipulation beim Lesen immer `false`. Die neuen Wiederlade- und Legacy-Tests werden dadurch tatsächlich rot (Exit 1). Das unveränderte Original besteht dieselben Tests (Exit 0).

## Änderung an der App-Anbindung

`apps/web/app/(game)/play/[grade]/buch/[chapter]/BuchClient.tsx` reicht exakt die vereinbarten Schnittstellen weiter:

- `classPhotoUnlocked={profile.classPhotoFound}`
- `onClassPhotoFound={() => keepProfile({ ...profileRef.current, classPhotoFound: true })}`

Die Verwendung von `profileRef.current` erhält den zuletzt gewählten Namen und aktuelle Befreiungen auch dann, wenn mehrere Ereignisse kurz hintereinander eintreffen. Die App speichert, die Spielengine bleibt frei von direktem Browser- und Datenbankzugriff.

Zusätzlich umschließt der äußere `BuchClient` die zustandsbehaftete Komponente mit `key={props.playerKey}`. Dadurch wird deren Arbeitsspeicher bei einem tatsächlichen Kontowechsel verworfen und das neue Kontoprofil geladen. Ohne diesen Schlüssel würde ein bloß geänderter Kontoparameter den bestehenden `useState`-Initialisierer nicht erneut ausführen; das alte Profil könnte bis zum Seitenneuladen sichtbar bleiben. Diese Maßnahme betrifft auch den noch laufenden Spielzustand, der bei einem Kontowechsel bewusst neu beginnt.

Der Ladetext lautet jetzt **„Wir öffnen das Kapitel …“**.

**Rotprobe der Kontotrennung:** `profile-photo-mutants/share-account-key` ersetzt den kontoeigenen Speicherschlüssel durch einen gemeinsamen Schlüssel. Die tatsächlichen Kontotrennungstests scheitern. Die React-Neumontage wurde durch Codeprüfung und den Web-Typcheck bewertet; ein Browser-Kontowechsel wurde in dieser begrenzten Bahn nicht durchgeführt.

## Gezielte Tests

`apps/web/lib/paint-story-profile.test.ts` enthält weiterhin die sechs bestehenden Fälle und ergänzt drei Verhaltensprüfungen:

1. Name „Änne“, Foto-Fund, Merle-Befreiung und gelesene Prologversion werden gespeichert und mit einem neu erstellten Kontext für den nächsten Kapitel-/Seitenstart gemeinsam wieder gelesen. Ein zweites Konto beginnt leer und kann seinen eigenen Namen speichern, ohne die Daten des ersten Kontos zu verändern.
2. Ein tatsächlich im alten Speicherformat hinterlegtes v1-Profil ohne Fotofeld behält Name, Merle und Prologversion; der erste Fotofund lässt sich ergänzen und erneut laden.
3. Fremde Datentypen schalten das Foto nicht frei. Bei blockiertem Schreiben bleiben Name, Merle und Foto im zurückgegebenen Profil vollständig erhalten, während `persisted` korrekt `false` ist.

Das bestehende Test-Erwartungsobjekt für bereinigte Altdaten enthält nun zusätzlich `classPhotoFound: false`. Keine frühere Aussage wurde entfernt.

**Rotprobe der Rückwärtskompatibilität:** `profile-photo-mutants/reject-legacy-v1` verwirft alte Profile ohne Fotofeld. Der neue tatsächliche Legacy-Speichertest scheitert. Alle Manipulationen wurden ausschließlich an selbstständigen Quellkopien im Labor ausgeführt; keine Repository-Datei wurde dafür zwischenzeitlich manipuliert.

Belege: `profile-photo-tests.log` (9/9 grün), `profile-photo-tampers.mjs`, `.json` und die einzelnen Protokolle in `profile-photo-mutants/`. Alle drei Quellmanipulationen liefern Exit 1; die unveränderte Kopie Exit 0. `git diff --check` im eigenen Dateiumfang ist grün.

## Gerätebindung und Grenzen

Das ist ein **lokales Browserprofil**, kein synchronisiertes Kontoprofil auf dem Server. Der Fund bleibt für denselben Kontoschlüssel auf derselben Website, im selben Browserprofil und bei erhaltenem Browserspeicher zugänglich. Ein anderes Gerät oder Browserprofil übernimmt ihn nicht automatisch. Löschen der Websitedaten löscht auch dieses lokale Spielprofil. Wenn Speichern blockiert ist, gilt der neue Fund nur für den laufenden Arbeitsspeicher; das bestehende `profilePersisted`-Signal kennzeichnet das.

Bereits früher gefundene Fotos aus einer alten Version ohne gespeichertes Fotofeld können nicht nachträglich sicher erschlossen werden und beginnen deshalb mit `false`. Es wurde kein Fund aus abgeschlossenen Levels oder Merles Zustand erfunden.

## Typprüfung und Übernahme

Der erste Web-Typcheck (`profile-photo-typecheck.log`) traf den noch laufenden parallelen Einbau: `PaintGameProps.classPhotoUnlocked` fehlte noch; zusätzlich meldete Roots `PaintGame.tsx:1278` einen `string` statt `Ability`. Beide Stellen liegen außerhalb dieser Bahn und wurden Root gemeldet. Der endgültige Typcheck wird nach Roots Integration getrennt protokolliert.

Keine Engine-/PaintGame-Datei geändert, keine Commits und keine Server- oder Produktionsschreibzugriffe.

**Abschließende Integration:** Nach der neuen PaintGame-Props-Schnittstelle war die Profilanbindung bereits typfehlerfrei; der zweite Lauf scheiterte nur noch am parallelen Ability-Typfehler in PaintGame. Root hat diese Stelle anschließend behoben. Der ausdrücklich angeforderte erneute Lauf `pnpm --filter web typecheck` besteht nun vollständig mit **Exit 0**, protokolliert in `profile-photo-typecheck-integrated.log`. Damit sind Profiltests, Gegenproben, eigener Diff-Check und integrierte Web-Typprüfung grün.
