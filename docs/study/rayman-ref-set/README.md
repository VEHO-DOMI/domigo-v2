# Der Rayman-Referenzsatz v1 (2026-08-15) — was jedes Bild belegt

**NUR FÜR KRITIKER-AUGEN (CP-15).** Die Bilder selbst liegen **nicht** in diesem Repo und
kommen auch nie hinein. Sie liegen lokal unter

```
~/Code/domigo-v2/docs/Rayman X DomiGo Screenshots/Rayman-Referenzsatz 2026-08-15/
```

(gitignored, `.gitignore:50`). Diese Datei enthält ausschließlich **unsere eigenen Worte** über
sie: welches Bild welches Kriterium belegt, woher es stammt, wie es beschnitten wurde und mit
welcher Prüfsumme. Nichts daraus wird kopiert, abgemalt oder eingebaut — der Satz existiert nur,
damit ein blinder Kritiker unser Bild gegen ein Bild legen kann, von dem **geprüft ist**, dass es
die verglichene Eigenschaft überhaupt zeigt.

## Warum es diesen Satz gibt

Bis zum 14.08. wurde blind gegen Bilder verglichen, die niemand geprüft hatte. W1 hat gezeigt,
wohin das führt: das Rayman-Bild, gegen das eine Runde im August verloren hatte, **enthielt kein
einziges Sammelobjekt** — der Vergleich hat also nie getestet, was er zu testen behauptete. Mit
einem korrigierten Bild kippte das Urteil auf demselben eigenen Bild (D-66, R64).

## Was am Ausgangsmaterial nicht stimmte

Der Quellordner `July 22nd Rayman Game /` sagt in seiner eigenen README, die Bilder seien
„clean gameplay (no YouTube UI)". Das stimmt für die Bedienleiste — und verschweigt den
eigentlichen Fremdkörper: **jedes 1280×720-Bild trägt links und rechts einen 160 px breiten,
gespiegelt-verwaschenen Füllbalken**, mit dem ein Video-Uploader ein 4:3-Bild auf 16:9 streckt.
Ein Kritiker, der so ein Bild neben unser Bild legt, beurteilt zu **einem Viertel** etwas, das im
Spiel gar nicht existiert.

Die Geometrie ist nicht geschätzt, sondern über den ganzen Bestand ausgezählt: von 265 Bildern
mit messbarer Naht melden **254 exakt (160, 1120)**; kein anderer Wert kommt mehr als einmal vor.
Unten stehen in 279 von 318 Bildern vier bis fünf schwarze Kodier-Zeilen — der Balken **franst
aus**, deshalb endet der Kasten zwei Zeilen darüber (über 100 Bilder ausgezählt: erste nicht mehr
bildhafte Zeile bei y=714 in 53 Fällen, y=713 in 12). Daraus das erklärte
Spielfenster: **Kasten (160, 0, 1120, 713) → 960×713**.

Kokis Bildschirmfoto-Ordner (`Rayman screenshots gameplay taken by Koki/`, 178 Bilder, 2940×1912)
trägt zusätzlich die **echte** Player-Leiste (Titelzeile, Fortschrittsbalken, Zeitanzeige). Aus
ihm stammt kein Bild dieses Satzes.

## Der Satz

Alle sechs sind **960×713**, aus dem Kasten oben geschnitten, unverändert sonst. Das Spiel-HUD
(Rayman-Kopf links oben, Sammelobjekt-Zähler rechts oben, im Boss-Bild die Lebensleiste) bleibt
drin: es ist die eigene Bildkomposition des Spiels, und unsere Bilder tragen ihre eigene Anzeige
ebenfalls. Der md5 pinnt das Bild, damit ein Verifizierer weiß, **welches** Bild galt — lokale
Kopien driften.

| Kriterium | Datei | md5 | Quelle (Ordner/Datei) | Was es zeigt | Wofür es taugt |
|---|---|---|---|---|---|
| **(a)** Sammelobjekt-Präsenz/Kontrast | `a_sammelobjekt_kontrast.png` | `f694594c3387b0a453b071266c27c5c4` | `July 22nd Rayman Game /08-picture-city/11_no-written-in-gems.png` | Eine Traube gesättigt blauer, funkelnder Sammelkugeln vor einer bewusst abgedunkelten braunen Wand; der Held daneben als Maßstab. | **R37** — die Regel-Seite braucht Sättigung **vor abgedunkelter Fläche**, nicht mehr Helligkeit. Das ist das Bild, an dem sich Farbfamilie und Platzierung messen lassen. |
| **(b)** Plattform-Kanten/Massiv | `b_plattform_kanten.png` | `62b156420ef5d9b6bb029b54ca7754ff` | `July 22nd Rayman Game /01-first-level/07_flower-as-platform-swamp.png` | Schwebende Inseln mit Grasoberkante, gemalter Fels-/Wurzel-Unterseite und sichtbaren Flanken; dazu ein Kopfstein-Boden mit eigener Kante. | Massiv-Aufbau und Kanten-Behandlung (A6). Zeigt außerdem als einziges Bild des Satzes ein **einzelnes frei schwebendes** Sammelobjekt neben dem Helden. |
| **(c)** Held in Bewegung | `c_held_in_bewegung.png` | `214c22be4db08f83960ed88bfa9f1f8b` | `Rayman Movement Physics/03-jump-tap/f_0085.png` | Der Held frei in der Luft über der Lücke, Gliedmaßen gelöst und nachziehend, Körper im Bogen. | Sprung-Silhouette und Pose-je-Takt (F5). 1 Bild = 1 Spieltakt, die Reihe ist also auch zeitlich belastbar. |
| **(d)** Held steht am Rand | `d_held_am_rand.png` | `2a1bfe522cae5d655d794d61cb95ec12` | `Rayman Movement Physics/03-jump-tap/f_0069.png` | Der Held steht an der vorderen Kante einer winzigen Insel; der Fallraum bis zum Wasser ist im Vollbild ohne Vergrößern zu sehen. | **R46** — Kokis Tor, ob AAA-Balance-Zellen neu bestellt werden. ⚠ Einschränkung siehe unten. |
| **(e)** Gegner-Begegnung/Boss-Arena | `e_boss_arena.png` | `26bfb703b262ecf37a1107ff93f680d2` | `July 22nd Rayman Game /06-mr-sax/03_mr-sax-boss-arena-flute-masks.png` | Boss groß rechts, Held klein links, gemalte Arena-Architektur ringsum, eigene Boss-Lebensleiste unten links. | Arena-Aufbau, Größenverhältnis Held:Boss, Lebensleiste (H2). |
| **(f)** Wasser/Flüssigkeit als Gefahr | `f_wasser_als_gefahr.png` | `6e31594cde41bb2d9c9ecba19807cf92` | `July 22nd Rayman Game /03-swamp-level/02_flower-platform-rising-water.png` | Eine gezackte, schäumende Wasserlinie über die volle Bildbreite, darüber Blüten-Plattformen; der Held in der Luft. | Unsere Tinte als Gefahr: wie eine Flüssigkeit „gefährlich" aussieht, ohne rot zu sein. |

## Wie der Satz geprüft wurde

**1 · Maschinell, drei benannte Tore** (`_refset.py gate`, liegt neben den Bildern):
* **G1 Format** — ein fertiges Referenzbild **ist** das erklärte Spielfenster (960×713). Ein
  Rohbild (1280×720) und jedes Bildschirmfoto fallen hier durch, ohne Schwellenwert.
* **G2 Fremdrahmen** — eine starke senkrechte Naht, hinter der die Feinstruktur einbricht
  (gemessen: Füllung 0,14–0,68 der Innen-Feinstruktur · echte Bildkante 1,00–1,40).
* **G3 Herkunft** — jedes Bild muss sich aus seiner **benannten Quelle** mit dem erklärten Kasten
  **bytegleich neu schneiden** lassen. Nachbearbeitung und falsche Quellenangabe fallen durch.

Der Selbsttest beweist alle drei am bekannten Fall: Rohbild ⇒ rot · Bildschirmfoto mit
Player-Leiste ⇒ rot · **ein einziges geändertes Pixel** ⇒ rot (G3) · fertiges Bild ⇒ grün.
G3 hat sich außerdem im Betrieb bewährt: es fing einen **echten** Fehler dieser Runde, als beim
Austausch von (d) das Bild gewechselt, die Quellenangabe aber nicht nachgezogen wurde.

**Bewusst NICHT als Tor gebaut:** eine Farb-Prüfung auf den YouTube-Fortschrittsbalken. Gemessen
trennt sie nicht — Kokis Bildschirmfoto mit echter Player-Leiste kommt auf 0,279 Anteil
gesättigt-roter Pixel in einer Zeile, Raymans **eigener** Boss-Lebensbalken auf 0,221. Jede
Schwelle würde entweder das Bildschirmfoto durchlassen oder die Boss-Arena verwerfen.

**2 · Blind, mit frischem Kontext.** Vier Prüfer haben in drei Runden je nur die Bilder (unter
neutralen Namen, wechselnde Reihenfolge) und die sechs Kriteriennamen gesehen — nie die
Zuordnung, nie einander. Alle vier fanden unabhängig **keine** Player-Reste und keinen
gespiegelten Rand.

Ergebnis: (a), (b), (c), (e), (f) haben **je drei unabhängige Ja** aus verschiedenen Runden.
(d) wurde zweimal ausgetauscht, weil die Prüfer den ersten und den zweiten Kandidaten übereinstimmend
nur als „schwach" lasen (der Fallraum war nicht zu sehen); der jetzige stammt aus der Runde, die
als einzige **beide** Kandidaten nebeneinander hatte. In der Schlussrunde bekam ein vierter Prüfer
die sechs fertigen Bilder unter neutralen Namen und sollte jedem Kriterium **genau ein** Bild
zuordnen: seine Zuordnung ist **sechs von sechs deckungsgleich** mit dieser Tabelle.

Derselbe Prüfer fand außerdem den letzten echten Fehler des Satzes: eine dunkle Restzeile am
unteren Rand aller sechs Bilder — der schwarze Kodier-Balken franst aus, und der Kasten endete
zwei Zeilen zu tief. Behoben, alle Prüfsummen oben sind die der korrigierten Bilder.

## Die Einschränkung, die im Satz bleibt

**Es gibt in diesem Bestand keine Rayman-Balance-Pose.** Kriterium (d) meint eigentlich das
Wackeln an der Kante. Durchsucht wurden dafür die Modalitäten `01-walk`, `02-run`, `03-jump-tap`,
`06-fall`, `10-ledge-hang-pullup`, `15-slippy-slope-momentum` sowie die 138 kuratierten
Level-Bilder — in keinem ist ein isoliertes Taumel-/Balance-Bild enthalten. `(d)` belegt deshalb
„Held steht am äußersten Rand, Fallraum sichtbar", **nicht** „Balance-Animation". Wer R46 an einer
echten Balance-Pose messen will, braucht eine neue Aufnahme.

## Regeln für die Benutzung

* Vor jedem Blindvergleich **das Referenzbild selbst ansehen** und prüfen, dass es die geprüfte
  Eigenschaft zeigt. Diese Tabelle ersetzt den Blick nicht, sie verkürzt ihn.
* Reihenfolgen tauschen, Kritiker frisch, Frame-Zitat-Pflicht (AAA-Mandat).
* Kein Bild dieses Satzes wird kopiert, abgemalt, nachgebaut oder in Produktinhalte übernommen
  (CP-15). Es ist Studienmaterial für Augen, nicht für Hände.
