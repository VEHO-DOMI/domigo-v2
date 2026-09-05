# ch02 · PENDING — Kapitel-Neuheiten als DATEN + Pflichten späterer Bahnen (L2-P1v2, 2026-09-05; ersetzt den Stand vom 03.09.)

_Was hier steht, ist im Level NOCH NICHT verdrahtet oder noch nicht gebaut. Die M-Bahn L2-M-a (#411) hat
die Signatur-Mechanik geliefert (Bühne `scene.stage`, hang-Kante im Reach-Modell, `match`); p1 v2 benutzt
sie. Was bleibt, gehört L2-G2 (Räume), L2-T2 (Karten), L2-S (Copy) oder L2-M-b (Motor-Rest). Rahmen:
`RAHMEN_LEVELWELLE_2026-09-02.md` §5; Signatur: `LEVELWELLE/KAPITEL_SIGNATUR_L2_2026-09-03.md`._

## 1 · Die Tier-Bühne — GEBAUT in p1 v2, und was G2 daraus lernt

Zwei Bühnen stehen in p1 (`p1-buehne-papagei` Papagei × Auto auf dem Affenhaus-Dach, `p1-buehne-buddy`
Buddy × Baum am Boulevard). **Drei Regeln, am Motor gemessen (05.09.):**

1. **Eine Bühne läuft ab dem Spawn los** (`entities.ts#stepEntities`, `e.timer` ab Takt 0). Sie muss
   deshalb `hidden:true` spawnen und per **Link** enthüllt werden, wenn das Kind daneben steht — sonst sieht
   es nur die Endpose. Nur `on:"redeemed"` (gelöstes Wesen) und `on:"opened"` (befreiter Käfig, gelöste Tür)
   feuern (`sim.ts#applyLinks`); `collected`/`pressed` stehen im Typ, feuern aber nie (D-823).
2. **Props sind Bilder, keine Geometrie** (`propSkin`, Zeichen-Tiefe 7; Darsteller davor/dahinter). Die
   Stationen dürfen in der Luft liegen (Buddy „on the tree" = (0,−4) ohne Krone); nur die ENDSTATION muss
   stehbar und erreichbar sein (Gesetz `stage-script` + `entity-reachable`, Fund 13 von #411).
3. **Ein Darsteller-Skin hat EINE Stimme** (Gesetz 14a): der Bühnen-Hund heisst `buddy`, damit der graue
   `hund` (restore, name-it) in p2 weiter binden kann.

| Bühne | Raum | Darsteller | Prop | Stationen (dc,dr,z) | Endstation | Link | Karte (T2 / Walk-Minimum) |
|---|---|---|---|---|---|---|---|
| Papagei × Auto | p1 (18,10) | `papagei` | `auto` | next to (−2,0,f) → in (0,−1,b) → on (0,−2,f) → behind (+1,0,b) → **in front of (0,0,f)** | (18,10) | `p1-cage2` opened | `qf.papagei.b1` ✓ |
| Buddy × Baum | p1 (52,17) | `buddy` | `baum` | next to (−2,0,f) → in front of (0,0,f) → on (0,−4,f) → **behind (0,0,b)** | (52,17) | `p1-pinguin` redeemed | `qf.buddy.b1` ✓ |
| Frosch × Bus | p2 (G2) | `frosch` | `bus` | under (0,+0?) → in front of → on → **next to** — G2 schneidet die Zellen | — | Ortswörter-Seite? nein: `redeemed` des grauen Hundes `p2-hund` | T2 |
| Giraffe × Baum | p3 (G2) | `giraffe` | `baum` | on → behind → **next to** (WB 18) | — | `opened` des Stein-Käfigs | T2 |

**Heimlauf (die Weltreaktion NACH der Antwort — „das Tier geht heim") ist NICHT in M-a:** die Bühne
läuft VOR der Frage. Die falschen Gehege von p2 sind deshalb Tableau + Schild-Richten-Karten; der
Heimlauf (zweite Stationenliste, läuft nach `redeemed`) ist ein Antrag an L2-M-b.

## 2 · Hangeln — GEBAUT: drei Griffe à 7 Zeilen

Das Reach-Modell segnet Mauern auf dem Boden mit `hang` bis **7 Zeilen** (8 = rot); die Engine trägt
ohne Griff 6, mit Griff 8 (Sonde #411). **7 ist die einzige Höhe, die legal ist UND den Griff erzwingt**
— bei 5–6 springt das Kind hinauf, ohne je zu greifen. p1 v2: Kassenmauer c8 (Boulevard → Dach),
Voliere c28 (Dach → Krone), Faust-Turm c55 (`essential`). G2 baut p2-Traversen und den Giraffen-Turm
in p3 nach derselben Zahl. Abstand Modell↔Engine beim Hangeln: EINE Zeile (D-822).

## 3 · Faust (`punch`) — vergeben in p1, verlangt erst in der Arena

`p1-faust` (56,10) auf dem Faust-Turm: `powerup` `grants punch` `essential true` `gabeDe "die Faust"`.
Der Gabe-Beat liest `gabeDe` seit #411. Freiwilliger Erst-Einsatz: Käfig-Zweischlag; Pflicht-Einsatz:
Deflect in der Arena (M-b, Löwe).

## 4 · Neck-Käfig #5 (Voliere p1) — Geometrie, kein Entity; Insasse OFFEN

Nische c29–32 r6–8 im Volieren-Block c28–33 r4–17, unerreichbar sichtbar. **Das rote Auto ist seit p1 v2
der Prop der Papagei-Bühne (SB 19)** — der Insasse des Neck-Käfigs ist damit neu zu vergeben (Kokis
Entscheid; Vorschlag des Architekten: die Katze, SB 19/WB 20). ch03 (Ring-Schwung) macht die Nische
erreichbar und setzt das `cage`-Entity. Neck-Käfig #4 (Baum-Setzling, p3) analog — L2-G2.

## 5 · Sammel-Skin `feather` (R246) — im Level

`collectSkin: "feather"`; Platzhalter-Glyph bis Kunst-Zeit. Tierspuren sind Boden-Dekor (Kunst-Zeit).
**Die Federn sind die Spur des Papageis** (Kokis Entscheid 2): sie führen vom Tor über das Dach zur
Voliere und enden am Boulevard AUF Buddy (52,16) — die Endstation der Buddy-Bühne.

## 6 · Pflichten für L2-G2 (Räume p2/p3/p4/p9)

- `p2-regel-ortswoerter` (10,21) und `p2-hund` (20,21) stehen schon im p2-Gerüst (aus p1 v2 gezogen) —
  VERSETZEN, nicht neu anlegen (T1-Karte `enc.hund.r1` bindet an `hund`/p2).
- `tipsTotal` 2 → 4 (Regelseiten p2 „to be: Kurzformen", p3 „he / she / it / they"), je VOR ihrer Aufgabe (D-785).
- p2: Klecks-Tür `price 10` ⇒ ≥10 erreichbare `*` VOR der Tür (`door-price`); `bonus.budgetSec 30` steht.
- p9: 12 erreichbare `*`.
- Je Feldraum genau EINE Tinten-Querung an Kokis Anker-Stelle, `C` auf der `near`-Bank: p2 Flamingo-Teich
  (statisches `w`-Band; Wasserlinie = M-b) · p3 Tinten-Tal (vor dem Giraffen-Turm).
- Fenn: Käfig + `classmate` stehen im Gerüst — nur versetzen.
- Löwe: Gerüst-Wächter `waechter` Tier M bleibt (Bestands-Rig fliegt); `loewe`, `prowl`, `projectileSkin`,
  `GUARDIAN_BOARDS.loewe` = L2-M-b. Die fünf Arena-Karten bleiben im Sidecar `pending-tasks.md`, bis M-b die
  Kreide-Fläche baut (eine mistake-Karte ohne Beweis wäre unlösbar).
- Zoo-Zug als Ausfahrt p2 (`platform.move` + `door.trigger` Skin `schaffner`, Türserie Ticket-Fragen).
- Dossiers p2/p3/p9/arena: Stubs durch volle Dossiers ersetzen; `claims.json` mit Seitenzahlen im `note` (R256).

## 7 · Beobachtet, nicht meins (Programm-Befunde, R253: niedrigste Nummer führt)

D-867 `links.action` ungelesen · D-823 `links.on` collected/pressed feuern nie (Schwester) · D-891 Glyph `U`
tot · D-892 kein Wächter-„redeemed" · D-893 Blasen ankern am Kind.
