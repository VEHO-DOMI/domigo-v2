# p4 „Die Tafel-Bühne" — Zweck-Dossier (PB-W3, 2026-07-23)

**Status: DESIGN — Kokis Dossier-Gate.** Kanon: Sheet `../ch01.md` §6 (Wächter-Grammatik G11)
· VL 1.11 (Bühnen-Grammatik) · Cookbook A-16 (Arena-Reset, nie Level-Reset). Ziel-Grid ~36×20
(EIN Bildschirm, Kamera-Schloss).

## 1 · Auftrag der Phase

Das **Examen** (VL 1.11): nichts Neues wird gelehrt — die drei geprobten Fähigkeiten werden
geprüft: Deflect (geprobt am Farbkasten-Schützen), Rhythmus-Lesen (geprobt am Stampfer),
Aufgaben-Lösen unter sanftem Druck (geprobt überall). Die erwachte Schultafel ist kein Feind,
sondern das verzauberte Herz des Klassenzimmers: sie wird ERLÖST (Knoten lösen), nie besiegt —
und der Sieg wird als WIEDERHERSTELLUNG inszeniert (Candy-Lehre: Victory = Restoration).

## 2 · Karte (EIN Bildschirm, 36×20)

```
      ▛══════ Vorhang-Bögen (Proszenium, symmetrisch — VL 1.11) ══════▜
      ▌   Kreide-Bögen fliegen ~~~~~~ ⌒ ⌒ ⌒                          ▐
      ▌                        ╔══ TAFEL ══╗                          ▐
      ▌  S                     ║ (3 Knoten)║            Käfig#6★     ▐
      ▌ Podest-L   Boden-Bühne ╚═══════════╝  Podest-R   (hinter     ▐
      ▙▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄  Bühne)  ▄▄▟
                                                     [✕ Exit-Schild erscheint]
```

## 3 · Die Zweck-Tabelle

| # | Was | Wo | ZWECK | Mechanik-Kette | Beleg |
|---|-----|----|-------|----------------|-------|
| 1 | Kamera-Schloss beim Eintritt | — | Bühnen-Grammatik: das Examen hat einen RAUM; kein Weglaufen, aber auch kein Draußen-Risiko | — | G11, VL 1.11 |
| 2 | Symmetrische Bühne mit 2 Podesten | L/R | Podeste = Lese-Hilfen: von dort sind die Kreide-Bögen FLACHER zu deflecten (Wahl: sicherer unten, effizienter oben) | positionieren | VL 1.11 |
| 3 | Die Tafel wirft Kreide in LANGEN, lesbaren Bögen (Uhr-getaktet) | — | der Telegraph IST der Angriff (A-13: nichts tötet ohne Ansage); der Bogen lässt Zeit zum Positionieren | lesen → ausweichen/deflecten | A-13 |
| 4 | Deflect → Treffer → Stagger → KONTER-FENSTER öffnet Aufgaben-Karte | — | die Examens-Schleife: Bewegung öffnet das Fenster, WISSEN löst den Knoten (das Spiel bleibt eine Lern-Welt; G11: nie durch Streu-Treffer) | X-Timing → Karte lösen | G11 |
| 5 | 3 Knoten (Tier E) mit sichtbarem Rest-Zähler („Noch 2 Knoten!") | — | Fortschritt wird GESAGT (VL 1.10: Boss-Zustand kategorial anders angezeigt als Spieler-HP) | 3 Schleifen | VL 1.10 |
| 6 | Fehlschlag = Arena-Reset der Phase-Beats, NIE Kapitel-Verlust | — | A-16: der Wiederhol-Preis ist die Arena, nicht der Weg dorthin | — | A-16 |
| 7 | Kreide reißt → die KONSOLEN-Karte: das Kind schreibt „HELLO :)" an die Tafel | — | die Erlösungs-Wende: die Tafel wollte immer nur beschrieben werden; der Sieg ist ein GRUSS (Candy: powerless-nadir → Wiederherstellung; Register-Gesetz: nie Gewalt-Vokabular) | Konsole → Zeremonie | Candy-Report |
| 8 | Tafel lächelt, Vorhang-Licht wird warm, ✕-Exit-Schild ERSCHEINT | — | Sieg = Licht-Wechsel + neues Element, nicht Zerstörung; das Schild erst jetzt (Exit-Gating bleibt ehrlich) | zum Schild | VL 1.11 |
| 9 | ★ Käfig #6 hinter der Bühne, nach dem Sieg zugänglich | — | Cookbook-Käfig-Gesetz: der Arena-Käfig belohnt den Sieg räumlich dahinter | Trail | C-Käfig |

## 4 · Der Pfad

Eintritt, Schloss (Musik-Wechsel) → Bögen lesen, 1. Deflect → Fenster → Karte → „Noch 2!" →
Schleife ×3 (Podest-Wahl macht jede Runde leicht anders) → Kreide reißt → „HELLO :)" →
warmes Licht, Käfig #6, ✕-Schild → done (Kapitel-Abschluss-Karte).

## 5 · Bild-Behandlung

- Proszenium: Vorhang-Bögen + Bühnen-Brett-Rahmen, streng SYMMETRISCH (VL 1.11); Publikum =
  leere Stühle in der Fern-Silhouette (die Klasse FEHLT — sie ist ja in Käfigen: Story im Bild).
- Die Tafel: `tafel_hand/tafel_sad/tafel_chalk`-Stems (importiert!) JETZT verdrahten —
  Kreide-Hand als Werfer, trauriges Gesicht zwischen Angriffen (die Erlösbarkeit ist SICHTBAR),
  nach dem Sieg das Lächeln.
- Kreide-Projektile: `fx_chalk`-Stem statt Kreis (F13-Rest stirbt).

## 6 · Kunst-Bedarf (→ Batch AC, Auszug p4)

★ VL 1.2b erfüllt die Bühne von selbst: Boden = BÜHNEN-BRETTER, Podeste = umgedrehte
KREIDE-KISTEN (Thema!), Rahmen = Vorhang. Vorhang/Proszenium-Rahmen · Stuhl-Silhouetten-
Fern-Band · Bühnen-Brett-Boden-Streifen · **Kreide-Kisten-Podest-Zellen** ·
Tafel-Sieg-Lächeln-Zelle (falls `tafel_*` nicht reicht) · warmes Licht-Overlay.

## 7 · Task-Beats (→ tasks.md)

| Beat | Pool | Art | Skizze |
|---|---|---|---|
| Konter-Fenster 1 | boss | mistake | die Tafel-Vorschrift korrigieren (Exemplar) |
| Konter-Fenster 2 | boss | order | Satz für die Tafel bauen |
| Konter-Fenster 3 | boss | typed | „Say hello!" → `hello` (Exemplar) |
| Klecks-Zusatz (optional nach Sieg) | boss | memory | Zahl↔Wort-Paare |
