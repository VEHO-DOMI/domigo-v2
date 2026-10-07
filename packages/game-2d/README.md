# @domigo/game-2d — Schulhaus (aktiv) + Overworld (Erbe, Entscheid offen)

**Keen entfernt 07.10.2026 (cgo-086, Aufräum-Welle 1).** Koki 03.10. (cgo-058):
»ja sofort sunset – keen und anything overworld is nicht mehr relevant«; Koki
07.10.: die Überbleibsel verworfener Ideen kommen aus dem Build. Gelöscht wurden
die 14 Keen-Dateien (Arcade/Boss/Map-Szenen, Levels, Cutscene, Vollbild,
Schrift-Schärfe), die Routen `/play/[grade]/run` und `/play/[grade]/world`, ihre
Lader in `apps/web/lib/` und die Kunst unter `apps/web/public/art/g1/keen/`.
Der Keen-Inhalt unter `content/corpus/stories/*/keen/` bleibt (er trägt
Lernabdeckung und bleibt validate-grün, Ledger-Regel 15); über ihn entscheidet
Welle 2 mit Koki.

Was dieses Paket heute trägt:

- **Schulhaus (aktiv, Y2, PR 452):** `SchoolGame.tsx`, `SchoolScene.ts`,
  `school*.ts`, `path.ts` — gemountet von `/play/2/school`.
- **Overworld (Erbe, Entscheid offen):** `PhaserGame.tsx`, `OverworldScene.ts`,
  `BattleStage.tsx`, `battle.ts`, `world.ts`, `dialogue.tsx`, `anim.ts`,
  `rasterize.ts`, `zone-board.tsx` — der Zonen-Motor hinter `/play/[grade]/[zone]`
  und das Zonen-Brett des Hubs. Ob er bleibt, entscheidet Welle 2 (Y2-Kanon).

Das aktive Spiel für Klasse 1 ist das gemalte Buch (`packages/game-paint`,
doc 31/44). Es erbt nichts aus diesem Paket (FRESH-EYES LAW, doc 31 §1.6); der
Tipp-Schutz, der hier entstand, liegt geteilt in `@domigo/game-feel/typing-guard`.
Keen-Doku und -Aufträge liegen in `docs/_archive/keen/`.
