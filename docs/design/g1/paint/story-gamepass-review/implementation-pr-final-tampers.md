# CODEX DRAFT — NOT CANON

## Gültiger Abschluss

Maßgeblich ausschließlich `pr-final-tampers-verified/results.json`, reproduzierbar mit `pr-final-tampers-verified.mjs`. Vier vollständige isolierte Quellenkopien, ein Worker, Node24/nice15. Vier beteiligte Produkt-/Testhashes vor/nach identisch; fremde Pakete und Kunst nur lesend verlinkt. Keine Testfriständerung.

| Fassung | Exit | Tatsächlich getroffene Aussage |
|---|---|---|
| Unveränderte Kontrolle | 0 | beide Dateien,17/17 grün |
| Laufstartwert im echten numberSwarmLayout ignoriert | 1 | verschiedene Starts liefern fälschlich dieselben Zahlen [1,8,2,3,4,22];1/17 rot |
| Erste Comicseite aus domArtStems ausgelassen | 1 | exakte Menge ohne story_school falsch;1/17 rot |
| Klecks-Porträt aus domArtStems ausgelassen | 1 | exakte Menge ohne klecks_mentor falsch;1/17 rot |

Die erste Serie `pr-final-tampers/` hatte eine echte rote Kontrolle: der neu genutzte Mentor fehlte im veralteten Test-Sollset. Sie ist KEIN gültiger Manipulationsnachweis und bleibt separat erhalten. Root autorisierte nur die konkrete Erwartungsänderung in artScope.test.ts: klecks_mentor samt zutreffender Bezeichnung ergänzt; klassenfoto_a stand bereits in der historischen Liste. Keine Mengentoleranz. Danach sämtliche Kopien neu erzeugt und die tatsächlichen Assertionausgaben gelesen. Diffcheck der einen Testdatei grün.

Finaler Testhash artScope.test.ts: 7c6bc5b3c51dff45df31ba805ebb4017e1a87a1a7f09b1b085db7b549d2bb7ea. Root zum Commit informiert; keine weiteren Produktänderungen.

## Dokumentation

PR_BODY.draft.md folgt AGENTS mit allen30 tatsächlichen check-/test-Dateien in jeweils eigenem Absatz. Ursprüngliche Stolperurteile und vollständige Nachlesungen bleiben wörtlich; vollständige übrige Leserdateien sind unter dem verifizierten docs/design/g1/paint/story-gamepass-review/ referenziert. Die beiden Bildkritiken werden nicht als grünes Gesamturteil ausgegeben. Neue abschließende Merle-/Fotomaterialbelege und echte D1030–1036-Zeilen sind enthalten. Vollbatterie, Endkopf-Prüfung und Nachher-Produktion bleiben Platzhalter.
