# CODEX DRAFT — NOT CANON

# Merles sichere Folgebewegung

13.09.2026. Grundlagen in `packages/game-paint/src/companion.ts` (neu), `companion.test.ts` (neu), optionaler Anschluss in `entities.ts`. Keine Commits. Root integriert Phase, Darstellung und Rettungszeitpunkt.

## Tatsächliche neue Bewegung

Merle läuft zur ersten sicheren Stelle der Heldspur und spielt danach dessen wirklichen Pfad mit24Takten Verzögerung ab. Das ist kein größerer alter Roam-Kreis. Sprünge werden mit derselben Höhe wiedergegeben, sobald der Held sicher gelandet ist. Bis dahin bleibt der Sprung in einem nicht abgespielten Puffer. Eine Figur, die sich in die Tinte stürzt, zieht Merle nicht mit. Jeder vollständige Abschnitt wird nochmals gegen den aktuellen Raum geprüft. Pfad und Spielfigur benutzen denselben Körper (12×30Pixel) und dieselbe `moveBody`-Kollisionsfunktion. Die sichtbare Größe passt Root getrennt an.

Der Helper macht keine Ereignisse, Aufgaben, Treffer, Sammlungen, Teleportationen oder Veränderungen am Helden. Die Entity-Verzweigung läuft nur für eine bereits erlöste `classmate` mit ausdrücklichem `companion`-Zustand, vor jedem bisherigen Gegnerkontaktpfad. Nicht angeschlossene Figuren behalten unverändert das bisherige Roaming. Bei Karten-/Haltepausen bleibt auch die Begleiterin still.

## API / genaue Root-Anschlüsse

`createCompanionTrail(phaseId, {x,y,grounded:true,dir}, liveGrid)` gibt Zustand oder `null` für einen unsicheren Spawn zurück. Koordinaten sind **Integer-Subpixel**,256 pro Pixel. Erst nach Merles abgeschlossener Rettung/Zeremonie anhängen, damit ihr eigener Befreiungs-/Freudebeat erhalten bleibt:

```ts
mate.companion = createCompanionTrail(this.phase.id, {
  x: mate.x, y: mate.y, grounded: true, dir: mate.dir,
}, this.liveGrid) ?? undefined;
```

Sim liefert bei genau einem echten Welttakt in `stepEntities` zusätzlich:

```ts
companionLeader: {
  phaseId: this.phase.id,
  tick: this.tickCount,
  epoch: this.companionEpoch,
  x: this.player.x, y: this.player.y,
  grounded: this.player.grounded,
  dir: this.player.facing,
}
```

Diese Probe muss nach der tatsächlichen Spielerbewegung entstehen. `companionEpoch` bei Checkpoint-Respawn/Lehrerwarp erhöhen. Ein unplausibler Sprung von mehr als12Pixeln oder fehlende Takte wird zusätzlich selbst abgewiesen. Eine Pause lässt den Simtick ohnehin stehen; alternativ `paused:true`. Duplikate, alte Takte und fremde Phasen bewegen nichts.

`EntityState.companion` ist optional. `stepRedeemed` liest die Probe, setzt die echte Entityposition/-Geschwindigkeit, `state="follow"`, zählt die animierbaren Takte. `stepRedeemedOnly` bekommt absichtlich keine Probe, deshalb bleibt ein angehängter Begleiter in einer gehaltenen Karte still. Root muss `anim.ts`/Darstellung den follow-Zustand über `e.companion.pose` (`stand | walk | jump`) zeigen lassen. Nicht die alte `roam`-Hüpfuhr verwenden: diese würde zusätzliche6Pixel-Hüpfer erfinden, die im Pfad nicht vorkommen.

Phasenwechsel p2→p3→p4: Root speichert die befreite Person kapitelweit, erzeugt im nächsten Raum eine eigene bereits befreite Klassenkind-Entity und **neuen** Trail an einem sicheren Eingang. Niemals die alte Koordinatenliste in die neue Phase kopieren. Aktuelle p3/p4-Startglyphen können oberhalb des Bodens liegen; der Test lässt den echten Player deshalb zunächst landen. Wenn der Eingang noch nicht sicher gegründet ist, Begleiter-Spawnen bis zum ersten tatsächlichen sicheren Bodenplatz warten. Der Helper lehnt einen Flug-/Gefahrspawn ab. Spawn möglichst direkt hinter dem Held auf geprüftem Boden, sonst am gleichen Eingang; keine frei erfundene Bodenlinie.

## Gefundene und behobene echte Ursache

Die erste Hilfsprüfung verband zwei Sprungpositionen diagonal. Das reale `moveBody` bewegt dagegen erst vertikal, dann horizontal. Dadurch erklärte die Hilfsprüfung einen gültigen Sprung über eine Buchkante zur Kollision und hielt Merle im p3 bei x426 an, obwohl der Held x1001 erreichte. Erst der verschärfte Test auf **exakt denselben Endpunkt** deckte das auf; „bewegt sich über15Zellen“ allein war zu schwach. Der Helper prüft jetzt dieselbe Bewegungsreihenfolge und den durchlaufenen Gefahrenbereich. Endpunkt und gesamte Sprunghöhe stimmen danach. Debugbelege bleiben `companion-debug.log`/`companion-debug2.log`; sie sind historische Fehlversuche, keine Endabnahme.

## Prüfungen

`pnpm --filter @domigo/game-paint exec vitest run src/companion.test.ts src/entities.test.ts` →57/57Tests, Exit0 (`companion-tests.log`). Darunter9neue:

- echtes Laufen über den alten4Zellen-Bereich hinaus, Andocken und späteres Stillstehen;
- deterministisch, Pause/kein Frame/gleicher Tick/fremde Phase bleiben still;
- echte `stepPlayer`-Sprungkurve erst nach sicherer Landung, identische maximale Höhe;
- Fall in Tinte und weit entfernter Checkpoint ziehen die Figur nicht hinüber;
- Wand und Lücke verhindern Andocken, unsicherer Spawn wird abgelehnt;
- expliziter neuer Phaseneingang, Puffer maximal600Samples;
- tatsächlich gespeicherte p3/p4-Eingänge und Merles aktueller Rettungsboden sind gültig;
- tatsächliche p3-Raumgeometrie mit vorhandenen Beweisband-Bewegungstasten, Sprünge, Rampen, Plattformen und **identischer finaler Held-/Begleiterposition** nach Nachlauf;
- echte `stepEntities`-Anbindung erzeugt keine Ereignisse; gehaltene Karten frieren Position und Zähler ein.

Der p3-Test ist ein Terrain-/Bewegungstest mit `stepPlayer`, kein neuer vollständiger Sim-/Aufgaben-/Befreiungsbeweis. Root muss die komplette Kapitelreise mit der Integration filmen und prüfen.

Reale Manipulationen in isolierten Quellkopien (`companion-tamper.json`): Gefahrenprüfung am Spawn entfernen →rot; Pausenschutz entfernen →rot; unbestätigte Luftsegmente sofort freigeben →rot. Jeweils unveränderte Kontrolle Exit0, manipulierte Kopie Exit1. Keine Repo-Datei dafür manipuliert.

Typprüfung im Parallelbau: erste Prüfung meldete ausschließlich die beim Root noch fehlende neue `story/ClassPhoto.tsx`, keine Fehler in diesen Begleiterdateien. Vollständige Typprüfung nach Integration ist daher noch nötig; kein globales Grün behauptet.

## Verbleibende Grenzen / bewusste Regeln

- Bei einem weit entfernten Respawn wartet Merle am zuletzt sicher erreichten Ort. Sie läuft erst wieder mit, wenn eine sichere neue Verbindung entsteht. Kein versteckter Teleport als Reparatur. Bereits freigegebene sichere Sprünge werden zu Ende gespielt, statt sie nach einem fremden Respawn mitten in der Luft abzubrechen.
- Andocken reicht höchstens drei Kacheln auf zusammenhängendem Boden. Der vergrößerte Rettungsbereich muss deshalb Merle und Spieler nach ihrer Zeremonie physisch verbinden; ein getrenntes hohes Mini-Podest würde erwartbar nicht genügen.
- Ein Raum, dessen Geometrie nachträglich den aktuell von Merle benutzten Luftpfad schließt, stoppt die Wiedergabe. Ch01 hat statische Buchkörper; für spätere bewegliche Türen/Fluten braucht es einen zusätzlichen sicheren Ausweich-/Rückkehrvertrag. Diese Grundlage ist keine universelle Wegsuche für jedes zukünftige Kapitel.
- Sie ahmt den echten sicheren Weg zeitversetzt nach, plant keine eigene Abkürzung. Nach Sprüngen ist die Verzögerung länger als24Takte, weil erst die sichere Landung zählt. Lange fehlgeschlagene Wege werden nicht unbegrenzt gespeichert.
- Freie Merle in p3/p4, passende Größe, richtige Lauf-/Sprungbilder und Kapitelpersistenz sind Aufgaben der Root-Integration, nicht durch die reine Hilfsfunktion bereits sichtbar ausgeliefert.
