# R7-p2 · Review Runde 1 — Malerei stark, GEOMETRIE bricht den Vertrag

**Die Möbel (Posten D): ALLE SECHS ANGENOMMEN auf Anhieb** — Aufstands-Tor 90–100 %
Reichweite, Kipp ≤0,3°. So sieht Gesetz 13 aus. Nicht mehr anfassen.

**Die sechs Körper: alle sechs zurück.** Die Malerei selbst ist Exemplar-Klasse
(die Ostwand-Szene ist wunderschön) — aber sie wurde FREI KOMPONIERT statt in den
Zell-Vertrag gemalt. Das Tor misst es hart:

1. **Die Maske IST die Kollision — Voll-Zellen heißen VOLL.** Decke-mitte: alle 31
   Zellen exakt 53,8 % gefüllt (Brett ~35 px in der 64-px-Zelle — darunter läuft
   das Kind gegen unsichtbare Wand). Ostwand-Spalte (71,*): 27 % (dünne Wand in
   voller Zelle). Hänger des Tafelgerüsts: Seile ~6 px in 64-px-Zellen. Regel:
   jede #-Zelle wird als MATERIE gefüllt (hängende Bücherlagen, volle Buch-Wand,
   Bücher-Kette statt Seil) — Verjüngung/Detail nur per Silhouette INNERHALB der
   Zelle, nie durch Leere.
2. **Ein-Zellen-Versatz nach oben** bei Ostwand + Tafelgerüst (Lauf-Linien konstant
   ~56 px zu hoch, Treppen-Zellen (55–56, r12–18) leer, 26–38 % Farbe außerhalb der
   Maske). Beide Körper beginnen bei Grid-Zeile r1 — Blatt-Oberkante = r1 MINUS
   12 px Overpaint, nicht r0.
3. **Pultreihe:** Brett hängt 35–40 px zu tief in seiner Zeile — die Brett-OBERKANTE
   gehört ins Fenster [Zellkante−8, Zellkante+2] (grünes Band der Schablone).
4. **Pfeiler-Spalten** (west 22–23, ost 55): volle Breite × volle deklarierte Länge;
   dein Auslauf ins Nichts ab Zelle 2 ist eine Kollisionslüge.

## Das neue Werkzeug: MASKEN-SCHABLONEN

`docs/n6-auftrag/lieferung/masken/<stem>.MASKE.png` — exakt blattgroß. **MAGENTA =
Pflicht-Materie (≥98 % opak), GRÜNES Band = Steh-Kante (erste opake Zeile in den
obersten 10 px), TRANSPARENT = verboten (≤0,5 %).** Lege die Schablone beim Malen
unter/über dein Bild; jedes Pixel Magenta, das durchscheint, ist ein Fehler.

## Runde 2

Male die sechs Körper NEU (ein Wurf je Blatt, Palette/Klasse von Runde 1 halten —
die Ostwand-Szene darf ihre Schönheit behalten, nur an die richtigen Zellen):
dieselben Dateinamen überschreiben + SELBSTAUSKUNFT um „Runde 2" ergänzen. Prüfe
VOR der Abgabe selbst gegen die Schablone.

## NACHTRAG (nach Möbel-Import gemessen)

Fünf der sechs Möbel sind montiert (Leinwände auf Inhalt getrimmt — beim nächsten
Mal: Blatthöhe = Objekthöhe + ~8 px, kein leerer Alt-Kanvas). **Ein siebtes Blatt
für Runde 2:** `terrain_night_lectern_p2` NEU mit richtiger Proportion — 2 Zellen
breit, Objekt gesamt ≈ 1,6–1,8 Zellen hoch (128×110±8 px): Stehpult mit Lesefläche
oben (Steh-Kante!), EIN gedrechselter Fuß, gerade Basis. Das gelieferte war 2,8
Zellen tief und hinge als Stalaktit unter der Schwebe-Linie.
