# CODEX DRAFT — NOT CANON

## Erster Durchlauf: echte Rettung und Begleitung, damaliger Größenbefund rot

Am 13. September 2026 im tatsächlichen Spiel auf localhost:3350 geprüft. Der eigene Chrome lief mit separatem temporärem Profil und wurde nach der Aufnahme geschlossen. Zugang über vorhandenen Entwicklungszugang `phase=p2`, `warp`, die sechs tatsächlichen Rettungsaufgaben über vorhandenes `solveTask`; keine HP-, Rettungs- oder Simulationsflags gesetzt. Merles tatsächliche Begrüßung wurde mit dem sichtbaren Weiter-Knopf geschlossen. Danach erfolgten wirkliche Bewegungs- und Sprungeingaben. Der Raumwechsel erfolgte über die vorhandene Ausgangstür und ihre Aufgabe.

| Forderung | Befund | Beleg |
|---|---|---|
| Sechs Aufgaben befreien Merle | Bestanden; tatsächliche Aufgabenfolge, danach tatsächliche Begrüßung | `merle-final-rescue-repeated.json`, `merle-final-greeting.png` |
| Identität in Begrüßung und Welt | Gleiche braune Zöpfe, grünes Kleid, weißer Kragen und braune Schuhe; visuell angesehen | `merle-final-greeting.png`, `merle-final-standing-beside.png` |
| Freie Merle bewegt sich im Raum | Bestanden; eigener tatsächlicher Sprung nach Spielereingabe, nicht mehr im Federpenal | `merle-final-follow-p2.json`, `merle-final-follow-p2-rendered.png` |
| Merle bleibt im folgenden Raum | Bestanden; echte Tür p2→p3, dort `redeemed:true`, `state:follow`; neben dem Helden sichtbar | `merle-final-carry-p3-ready.json`, `merle-final-carry-p3.png` |
| Gleiche sichtbare Körperhöhe | **Nicht bestanden:** Merle sichtbar 29,509, Held im Stand 35,579 Weltpixel. Merle ist 17,1% kürzer | `merle-final-alpha-size.json`, `merle-final-carry-p3.png` |

Die Höhen wurden am tatsächlich verwendeten Texturframe und dessen tatsächlicher Render-Skalierung gemessen, anschließend an der PNG-Alpha-Belegung (Deckkraft größer als 16 von 255) abgeglichen. Merles Frame ist 428 Pixel hoch, sichtbar sind 421 Pixel. Die auf 30 Weltpixel festgelegte Framehöhe ergibt deshalb 29,509 sichtbare Weltpixel. Der Held im Stand hat 430 sichtbare Quellpixel und 35,579 sichtbare Weltpixel. Für exakt dieselbe sichtbare Ruhehöhe müsste Merles Frame bei diesem Bild etwa 36,17 Weltpixel hoch sein. Dieser Bericht verändert keine Laufzeitwerte. Die schmalere Körperform ist im Bild ebenfalls sichtbar; eine größere Skalierung allein beweist keine identischen Körperproportionen.

## Verwertbare Bildschirmbelege

- `merle-final-greeting.png`: vollständige, tatsächlich erschienene Begrüßung mit Merle.
- `merle-final-follow-p2-rendered.png`: tatsächlich gerenderter Sprung über dem Boden, leerer offener Federpenal im Hintergrund.
- `merle-final-standing-beside.png`: beide Figuren auf derselben Bodenlinie, Größenunterschied sichtbar.
- `merle-final-carry-p3.png`: beide Figuren im folgenden Raum auf derselben Bodenlinie; aktive Begleitung erhalten.

Vor jeder freigegebenen Weltaufnahme wurden echte Browser-Zeichenframes ausgelöst. Frühere Dateien `merle-final-beside-hero.png`, `merle-final-beside-hero-clear.png`, `merle-final-follow-p2.png` und `merle-final-follow-p2-landed.png` werden nicht als erfolgreiche Weltbelege gewertet: Sie zeigen eine zwischenzeitliche Kontaktaufgabe oder einen zuvor noch nicht aktualisierten Zeichenpuffer. `merle-final-carry-p3.json` protokolliert nur den Ladebeginn; die fertige Aufnahme ist die Datei mit `ready`. Der erste Begrüßungsdurchlauf wurde durch Entwicklungs-Neuladen unterbrochen, daher wurde die komplette Rettung unter vereinbartem Schreibstopp wiederholt.

## Historischer PR-Befund vor Korrektur

Merles Rettung, sichtbare Sprungbegleitung und Mitnahme in den folgenden Raum wurden im tatsächlichen Browser über vorhandene Entwicklungszugänge und echte Spielaufgaben nachvollzogen. Die Identität bleibt zwischen Dialog und Welt erkennbar. Die Nutzerforderung nach gleicher sichtbarer Körperhöhe ist bei dieser Prüfung noch offen: Merle misst 29,51 gegenüber 35,58 Weltpixeln beim Helden. Dafür ist eine begründete Korrektur mit erneuter Vergleichsaufnahme erforderlich; dieser Befund ist keine finale Bildfreigabe.

## Nachkorrektur — sichtbare Höhe angeglichen

Der anschließend ausdrücklich beauftragte enge Eingriff in `anim.ts` setzt nur Merles Bildhöhe auf `(430 × 35 / 423) × 428 / 421 = 36,1707743` Weltpixel. Der bereits bestehende gemeinsame Maßstab für alle ihre Posen bleibt erhalten; keine Kollisionsbox, Bewegung oder PNG verändert. Alle anderen Klassenkameraden bleiben bei 30. Merle ist die einzige entsprechende Figur im Kapitel-1-Quellvertrag. Der Personenkäfigtest prüft jetzt das tatsächlich vorhandene 54px-Federpenal statt eines sachfremden gewöhnlichen 34px-Gegenstandskäfigs.

`merle-visible-size.test.ts` liest die echten PNGs: Merles sichtbare Ruhehöhe beträgt nach der Korrektur exakt dieselben 35,5791962 Weltpixel wie beim Helden. Der Test hält zudem die vorhandenen Ränder aller 28 Merle-Bilder und den gemeinsamen Posenmaßstab; kein neues Bild wird an einem Rand abgeschnitten. Die Bewegungsposen dürfen durch gebeugte Beine niedriger sein. Individuelle Körperformen werden nicht mit verschiedenen X/Y-Faktoren verzerrt.

**Prüfungen:** `merle-visible-size-tests.log`: 41/41 grün in zwei Dateien, ein Worker. Der isolierte echte Rückfall auf 30px lässt `merle-size-tamper/merle-visible-size-regression.log` bei Verhältnis 0,8294 statt 1 rot werden; dieselbe isolierte Fassung vor dem Fehler bestand. Die Produktquelle wurde dabei nicht verändert. Der Tamper-Harness verwendete versehentlich zunächst den früheren Testprotokollordner; seine eigenen Protokolle wurden anschließend nach `merle-size-tamper/` getrennt. Die zuvor bereits verifizierte echte 84-Test-Baseline der vorherigen Bahn wurde mit ausdrücklichem Herkunftshinweis aus `final-size-cutover-icons-tests.log` wiederhergestellt; die drei ursprünglichen Negativprotokolle blieben unverändert.

**Frischer Browser nach Korrektur:** erneut alle sechs echten Rettungsaufgaben (`merle-corrected-rescue.json`), echte Begrüßung/Weiter, tatsächlicher Raumwechsel p2→p3. `merle-corrected-p3-final-standing.png` zeigt den stehenden Helden und die jetzt passend große Merle im Gehschritt nebeneinander; `merle-corrected-p3-final-standing.json` enthält tatsächliche Textur und Skalierung. Im Gehschritt beugt Merle die Beine leicht; dies ist kein Vergleich zweier Ruheposen und wird nicht so bezeichnet. Die exakte Ruhehöhenübereinstimmung stammt aus den tatsächlichen Alpha-Messungen, der Bildbeleg bestätigt dieselbe Größenklasse im Spiel. Frühere Korrekturaufnahmen mit `_beside` zeigen entweder die Landepose des Helden oder sich überlappende Figuren und dienen nicht als finaler Bildvergleich. Eigener Browser und Node-Harness danach geschlossen.

**Aktueller PR-Absatz:** Merles sichtbare Bildhöhe ist jetzt an die tatsächliche Ruhehöhe des Helden angeglichen. Die Berechnung berücksichtigt transparente Bildränder, erhält einen einzigen Maßstab für sämtliche Merle-Posen und verändert keine Kollisionen. Ein Test misst die echten PNG-Pixel; der vorherige 17%-Größenrückfall wird durch einen isolierten Fehlernachweis erkannt. Der frische Browser zeigt Merle nach tatsächlicher Rettung neben dem Helden im folgenden Raum.
