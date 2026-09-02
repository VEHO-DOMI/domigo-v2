# REVIEW · N7A2 p3-Welle · RUNDE 1 → Auftrag für RUNDE 2

**Stand: 2026-09-02 · N7A2 · Runde 2** — diese Zeile zitierst du in Zeile 1 deiner
neuen Selbstauskunft (`SELBSTAUSKUNFT_N7P3.md`, überschreiben).

**Was gut ist, und was du behältst.** Die Maße stimmen auf den Pixel (6/6), die
Silhouetten sitzen, der Wert-Vertrag ist punktgenau getroffen (33,0–33,7 % bei Ziel
34), die Sättigung liegt bei 58–86 %. Die drei Deckenbahnen sind **angenommen** —
fass sie nicht mehr an. Und die Bücher, die du gemalt hast, sind richtig: Buchrücken
im Verband, Ereignisse lokal, keine Kachel-Periode. **Die Rutschen-Schulter der
Westterrasse ist genau das, was bestellt war.**

Es gibt **zwei** Befunde. Beide sind gemessen, beide betreffen nur die drei
Boden-Blätter.

---

## Befund 1 · ★ 136 von 493 Pflicht-Zellen sind FÜLLUNG, keine Malerei

Das ist der Befund, der die Runde auslöst. In den drei Boden-Blättern ist ein
großer Bereich mit **einem einzigen Farbwert flächig zugedeckt**:

| Blatt | flache Zellen | Anteil des Blattes in EINER Farbe | die Farbe |
|---|---|---|---|
| `body_p3_westterrasse_rutsche` | **56 von 194** | 32,4 % der opaken Pixel | rgb 83,60,36 |
| `body_p3_ostmauer_sims` | **74 von 187** | 42,5 % | rgb 96,69,41 |
| `body_p3_mittelpfeiler` | **6 von 48** | 23,9 % | rgb 97,70,42 |

Gemessen wird die Wert-Standardabweichung der mittleren 80 % jeder Pflicht-Zelle
(Luminanz 0,299 R + 0,587 G + 0,114 B, Alpha ≥ 128). Diese Zellen messen **SD 0,00**.
Zum Vergleich: von den **1039 Pflicht-Zellen der bereits abgenommenen p1/p2-Wellen
liegt keine einzige unter SD 2**, die schwächste bei 3,72.

Das Tor hat das in Runde 1 NICHT gemeldet, weil sein viertes Gesetz „flach UND
dunkel" verlangte und deine Füllung mit 24,8 % Luminanz hell genug war. **Das Gesetz
ist inzwischen verschärft** (reine Struktur-Schwelle): dieselben Blätter sind jetzt
rot, mit genau 56 / 74 / 6 benannten Zellen. Ein neuer Lauf von
`check-body-silhouette` zeigt dir jede einzelne.

**Wo die Füllung liegt** — `F` = gefüllt, `#` = gemalt, `.` = nicht dein Gebiet:

```
p3_westterrasse_rutsche (c0,r15)      p3_ostmauer_sims (c40,r14)
  r15  #####FFFFF............            r14  ....................F...
  r16  ######FFFFFFF.........            r15  ................FFFFFFFF
  r17  ########FFFFFF........            r16  ................FFFFFFFF
  r18  #########FFFFFFF......            r17  ................FFFFFFFF
  r19  ##########FFFFFFFFF...            r18  ..........#FFFFFFFFFFFFF
  r20  ############FFFFFFFFFF            r19  ..........##FFFFFFFFFFFF
  r21  #############FFFFFFF..            r20  ..........####FFFFFFFFFF
  r22  ###############FFFFF..            r21  ################FFFFFFFF
  r23  ####################..            r22  ##################FFFFFF
  r24  ####################..            r23  ########################
  r25  ####################..            r24  ########################
                                         r25  ########################
p3_mittelpfeiler (c22,r17)
  r21  FFF#.###      r22  FF######      r23  F#######
```

Das Muster ist in allen drei Blättern dasselbe: **die Malerei sitzt links unten, und
der Rest bis zur Maskenkante ist zugedeckt.** Das Bild ist also kleiner als das
Blatt, und die Fläche dazwischen wurde gefüllt, damit die Deckung stimmt.

**Was Runde 2 tut:** male jedes der drei Blätter als EINEN Wurf über die GANZE Maske.
Jede Magenta-Zelle trägt Material mit eigener Struktur — Buchrücken, Lagen,
Schnitte, Abrieb —, so wie es die linken unteren Bereiche deiner eigenen Runde 1
schon tun. Es geht **nicht** um mehr Kontrast oder mehr Deko: eine ruhige, dunkle
Fläche ist erlaubt, solange sie GEMALT ist. Sie darf nur nicht aus einem Farbwert
bestehen. Richtwert aus abgenommener Kunst: **SD ≥ 4 je Zelle.**

## Befund 2 · Die Laufkante ist dunkler als der Körper, auf dem sie sitzt

Checkliste Punkt 3 verlangt „hell, ruhig, durchgehend". Gemessen als Verhältnis der
mittleren Luminanz der obersten 10 px jeder Steh-Zelle zur mittleren Luminanz des
ganzen Blattes:

| Blatt | Band/Körper | abgenommenes Feld echter Laufflächen |
|---|---|---|
| `body_p3_westterrasse_rutsche` | 0,86 | Exemplar 1,62 · p1-Hallenboden 1,49 · p1-Ostpodest 2,00 · p2-Ostwand 1,53 |
| `body_p3_ostmauer_sims` | 0,83 | (untere Grenze des Feldes: 1,08) |
| `body_p3_mittelpfeiler` | 1,02 | |

Ein Wert unter 1,0 heißt: die Kante, auf der das Kind landet, ist **dunkler** als das
Material darunter. In deiner Westterrasse gibt es diese helle Kante schon — an der
**Rutschen-Diagonale**, und sie ist dort genau richtig. Sie fehlt auf den waagrechten
Steh-Kanten.

**Was Runde 2 tut:** zieh die oberste Zone jeder Steh-Zelle heller — dieselbe
Kreide-/Sandstein-Kante, die deine Diagonale schon trägt, auch über die waagrechten
Oberkanten. **Ziel: Band/Körper ≥ 1,3.** Der Blatt-Mittelwert bleibt dabei im
Wert-Vertrag (30–38 %); die Kante ist ein schmaler Streifen, sie hebt den Mittelwert
kaum.

---

## Nicht ändern

- Die drei Deckenbahnen (`body_p3_deckenbahn_west/mitte/ost`) sind angenommen.
- Blattmaße, Zell-Vertrag, Overpaint, Wert-Vertrag, Palette: alles unverändert.
- Die Rutschen-Diagonale und ihre helle Schulter: genau so behalten.

## Lieferung Runde 2

1. **Drei** PNGs neu nach `docs/n6-auftrag/lieferung/` (gleiche Namen, überschreiben):
   `body_p3_westterrasse_rutsche.png`, `body_p3_ostmauer_sims.png`,
   `body_p3_mittelpfeiler.png`.
2. `SELBSTAUSKUNFT_N7P3.md` überschreiben, Zeile 1 = die Stand-Zeile oben. Je Blatt:
   md5, Blattmaß, mittlere Luminanz/Sättigung, **die kleinste Wert-SD über alle
   Pflicht-Zellen** und **Band/Körper**. Rechne beides selbst nach — genau diese zwei
   Zahlen sind der Grund dieser Runde.
3. Kein Commit, keine Datei außerhalb `docs/n6-auftrag/lieferung/`.
