# Karten-UI auf Blick-Erfassung — Vorher/Nachher (R5-W1 · D1, 2026-08-11)

**Jedes Bild: links VORHER, rechts NACHHER.** Dieselbe Fläche, dieselbe
Aufnahme-Vorrichtung, dieselbe Bildgröße — nur das Layout unterscheidet sich.

## Woher die Bilder kommen

Aus der **Karten-Bank** (`packages/game-paint/src/dev/CardGallery.tsx`), einer
reinen Entwickler-Fläche hinter zwei Schlössern (Lehrer-Tür **und**
Nicht-Produktions-Build): sie hängt jede der 9 Kartenarten und jeder der 11
Zeremonie-Tafeln mit festen Beispieldaten in die echte Spiel-Bühne, ohne dass
man das Kapitel dafür spielen muss. Aufgenommen mit
`node scripts/shoot-card-bench.mjs <ordner>`, zusammengelegt mit
`node scripts/make-bench-diptychs.mjs <vorher> <nachher> <ziel> --thumb`.

Zwei Dinge, die die Bank NICHT zeigt und die man beim Ansehen wissen muss:

1. **Der Hintergrund ist ein Standbild.** Im Spiel lebt die Welt hinter der
   Karte, das Wesen steht da, und die Karte dockt seitlich an, damit man es
   sieht (Gesetz PB-F1/F2-20). Zwei Blind-Kritiker haben die Leblosigkeit des
   Stand-Hintergrunds den Karten angelastet — sie gehört der Bank.
2. **Es sind Einzelbilder.** Der Auftritt der Karte (Tinten-Blende, Feder-Sprung)
   und der Auflösungs-Takt (die Antwort fliegt heim) sind Bewegung und stehen
   auf keinem Standbild.

## Was sich geändert hat

Fünf Zonen, auf jeder Karte und jeder Tafel in derselben Reihenfolge:
**Bild → EIN markierter Schlüssel-Satz → der Rest leise → große Handlungs-Ziele
→ Hilfe, eingeklappt bis verdient.** Die Sätze selbst sind unverändert (Copy
gehört C1) — geändert hat sich, welcher von ihnen führt.

Die Entscheidungen dahinter stehen in `packages/game-paint/src/cards/glance.ts`
(rein, getestet), das eine Hervorhebungs-Mittel in `cards/Glance.tsx`
(`Key`/`KeyBit`), gehalten von `cards/emphasis.test.ts`.

Die vollständige Serie aller 22 Flächen in voller Auflösung liegt im
Sitzungs-Report unter
`PLATFORM MASTER/SESSION-PROMPTS/REPORTS/REPORT_D1_2026-08-11/`.
