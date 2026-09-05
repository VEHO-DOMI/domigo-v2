# ch05 · pending — Daten-Entwürfe der Kapitel-Neuheiten

_Geschrieben von der Bahn **L5-G1** (2026-09-03). **Nichts auf diesem Blatt steht im Level.**_

Der Grund ist eine Motor-Eigenschaft, die man einmal teuer lernt: das Schema wirft unbekannte Felder **still**
weg. Ein `bpm` im Level wäre nicht rot — es wäre einfach weg, und niemand merkte es. Deshalb liegen die
Neuheiten hier als Daten, bis die Motor-Bahnen **L5-M1** und **L5-M2** sie verdrahtet haben; die Bahn L5-G2
trägt sie danach ins Level.

## Was inzwischen NICHT mehr hierher gehört (L0 ist gemergt)

Zwei Posten der ursprünglichen Planung sind erledigt, weil das Fundament **L0** sie als echte Level-Felder
gebaut hat — sie stehen jetzt **im Level**, nicht auf diesem Blatt:

- `collectSkin: "note"` — der Sammel-Skin des Kapitels. Bis ein Blatt gemalt ist, malt der Motor
  eine graue Scheibe mit den ersten drei Buchstaben (im Walk also **NOT**). Weil das Kapitel keine Buchstaben
  mehr sammelt, darf **keine** Phase `words` deklarieren — das Gesetz `trail-words` sagt das jetzt auch.
- `budgetSec: 25` auf der Bonus-Phase — die Uhr der Bassdrum. Die zwei Sekunden Gnade bleiben im Motor.

## a · Die Takt-Uhr (`beat`)

Der Motor kennt **keinen** Beat; die einzige Uhr ist der Tick-Zähler der Simulation. **L5-M1** baut ein
`PhaseSpec.bpm` samt einem reinen Rechenmodul und rastert Läufer-Hüpfer und Trompeten-Schüsse darauf.

⚠ Der Name ist **`beat`**, nicht »Metronom«: das Wort ist im Repo schon vergeben — und zwar mit der
gegenteiligen Bedeutung (ein sich wiederholendes Kachelmuster, das »wie ein Metronom unter den Füßen liest«,
gilt dort als Kunst-Anti-Muster).

| Raum | bpm (Fühlwert des Architekten) | `beatTicks` = 3600/bpm |
|---|---|---|
| p1 Die Trommel-Hügel | 80 | 45 |
| p2 Die Notenlinien-Rutschen | 100 | 36 |
| p3 Die Orgel-Empore | 100 | 36 |
| p4 Die große Bühne | 110 | 33 |
| p9 Die Bassdrum | 120 | 30 |

Koki **fühlt** diese Zahlen erst beim Walk nach L5-M1 — vorher gibt es keinen Takt zu hören.

## b · Die Parade (Autoscroll in p2)

```
autoscroll: { fromC, toC, pxPerTick, startOn: "enter", fallBehind: "encounter" }
```
Marsch-Tempo als Vorschlag **≈ 1,5 px/Tick** über **30–40 Spalten**. Zurückfallen ist **nie** ein Tod: weicher
Thud, die Kamera wartet zwei Schläge, **einmal** eine freundliche Begegnungskarte („Can you keep up? —
Don't worry!" — `Don't worry.` steht in der Wortbank der Unit).

⚠ Die Kamera ist **Physik**, nicht Darstellung: sie lebt in der Simulation und speist die Bildschirm-Box, die
das Kind einklemmt. Autoscroll ändert damit Bänder **und** Erreichbarkeit — es ist nie »nur Render«.

## c · Projektil-Klassen des Ton-Schluckers

Heute kennt der Motor drei Projektil-**Sorten**, aber keine Klasse `returnable`/`dodge`; der Rückschlag-Zweig
ist ungegated, und die Gunner-Kugel ist abwehrbar **ohne Leine und ohne Wirkung**. Wer Projektil-Klassen
bestellt, bestellt zuerst die Reparatur dieses Lochs (**L5-M1**).

| Knoten | Noten-Mix (Entwurf) | Platzhalter-Form |
|---|---|---|
| 1 | `["returnable","returnable","dodge"]` | rund grün / spitz violett |
| 2 | `["returnable","dodge","returnable"]` | dieselbe Paarung |
| 3 | `["dodge","returnable","dodge"]` | dieselbe Paarung |
| 4 | abwechselnd ab `returnable` | dieselbe Paarung |

## d · Der Taktsprung (Gunst I)

`beatjump` als neue Fähigkeit (**L5-M2**): auf einer Feder **und** mit Absprung im Takt-Fenster (±6 Ticks,
Kokis Fühlwert am Walk) hebt es −10 px/Tick statt −8 — der Scheitel wächst von den heute **gemessenen 5,94
Zeilen** auf rund zwölf. Vergabe als `powerup { grants: "beatjump", gabeDe: "der Taktsprung" }` am Ende des
Ost-Trakts, nachdem das Schlagzeug getröstet ist. Kapitel 6 deklariert die Fähigkeit dann selbst.

## e · Das davongelaufene Schlagzeug

`chaser` mit `locomotion: "flee"` im Ost-Trakt der Arena (**L5-M2**) — es trommelt voraus und stolpert am
Trakt-Ende. Trost-Beat: es kann einen Takt **halten**, aber allein keinen **Song** spielen.

## f · Layered Music

Heute hat jede Phase **einen** Track. **L5-M2** legt je Raum eine Spuren-Liste an (Basis + `keyboard` +
`saxophone` + `guitar` + `singer`), die beim Befreien eines Käfigs dazukommt. Alle Spuren stehen auf
`reserved` — die Dateien selbst sind Kunst-Zeit.

## g · Die Melodie-Währung

Der Stufen-Klang beim Sammeln existiert bereits. Die Melodie ist deshalb **keine** Reihenfolge-Logik, sondern
eine Manifest-Zeile mit acht Stufen: **der Zählstand ist die Melodie-Position** (jede Note spielt den nächsten
Ton, gleich welche Note zuerst gesammelt wurde).

## h · Die Notenlinien-Bänder in p2

`platform.move` mit `periodTicks` als **Vielfache des Beats**. Bei 100 bpm (`beatTicks` 36):
144 · 216 · 288. Alle Plattform-Uhren starten bei 0 und frieren gemeinsam ein — der Gleichschritt entsteht
dadurch von selbst, ohne ein Phasen-Offset.
