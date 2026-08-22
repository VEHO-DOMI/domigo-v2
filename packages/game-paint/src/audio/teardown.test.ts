/**
 * R5-W8 · S4 — DER ABBAU DES KLANGS, UND DIE ANNAHME, AUF DER ER STEHT.
 *
 * WAS REPARIERT WURDE. Beim Seitenwechsel stand in der Konsole »Cannot suspend
 * a closed AudioContext« (von H5 gefunden und gemeldet). Die Ursache liegt in
 * Phasers eigener Quelle: weil wir dem Spiel UNSEREN Kontext reichen (R130),
 * nimmt `WebAudioSoundManager.destroy` den Zweig `context.suspend()` statt
 * `context.close()` — es legt den fremden Kontext höflich schlafen. PaintGame
 * hatte ihn eine Zeile vorher schon geschlossen, `suspend()` bricht darauf ab,
 * und die Zusage hängt in PHASERS Code, wo wir kein `catch` unterbringen. Die
 * Meldung war nicht abfangbar, nur vermeidbar.
 *
 * WARUM DIESE DATEI. Die Reparatur (erst abbauen, dann schliessen) steht und
 * fällt mit ZWEI Eigenschaften einer fremden Abhängigkeit — und eine
 * Aktualisierung von Phaser könnte sie still umdrehen, ohne dass ein einziger
 * Test rot wird. Deshalb werden sie hier an der QUELLE festgehalten, so wie
 * `audio/coverage.test.ts` die Ereignis-Typen an ihrer Quelle festhält:
 *
 *   1. `Game#destroy` baut NICHT ab — es setzt nur `pendingDestroy`.
 *   2. `Game#step` führt den Abbau aus, wenn `pendingDestroy` steht.
 *      Daraus folgt der eine selbst gefahrene Takt in PaintGames Aufräumer:
 *      ohne ihn bliebe der Abbau liegen, bis die Schleife wieder läuft — und in
 *      einem handgetakteten Werkzeug-Lauf schläft sie.
 *   3. Der Tonmanager legt einen FREMDEN Kontext schlafen, statt ihn zu
 *      schliessen — das ist der Grund, warum die Reihenfolge überhaupt zählt.
 *
 * Geht eine der drei verloren, wird dieser Test rot, und jemand liest die
 * Begründung, bevor er eine Zeile verschiebt.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

const require_ = createRequire(import.meta.url);
/** Phasers Quelle, über die Paketauflösung gefunden — kein geratener Pfad. */
const phaserSrc = path.join(path.dirname(require_.resolve("phaser/package.json")), "src");
const lies = (rel: string): string => fs.readFileSync(path.join(phaserSrc, rel), "utf8");

describe("der Abbau des Klangs steht auf drei Eigenschaften von Phaser", () => {
  it("1 · `Game#destroy` setzt nur `pendingDestroy` — es baut nichts ab", () => {
    const src = lies("core/Game.js");
    const start = src.indexOf("destroy: function (removeCanvas, noReturn)");
    expect(start, "`Game#destroy` heisst nicht mehr so").toBeGreaterThan(0);
    const body = src.slice(start, src.indexOf("runDestroy: function", start));
    expect(body).toContain("this.pendingDestroy = true;");
    expect(body, "`destroy` baut jetzt selbst ab — der Handtakt in PaintGame ist dann überflüssig").not.toContain("this.runDestroy()");
  });

  it("2 · `Game#step` führt den liegengebliebenen Abbau aus", () => {
    const src = lies("core/Game.js");
    const start = src.indexOf("step: function (time, delta)");
    expect(start, "`Game#step` heisst nicht mehr so").toBeGreaterThan(0);
    const kopf = src.slice(start, start + 260);
    expect(kopf.replace(/\s+/g, " ")).toContain("if (this.pendingDestroy) { return this.runDestroy(); }".replace(/\s+/g, " "));
  });

  it("3 · ein FREMDER Kontext wird schlafen gelegt, nicht geschlossen", () => {
    const src = lies("sound/webaudio/WebAudioSoundManager.js");
    const start = src.lastIndexOf("destroy: function ()");
    expect(start, "`WebAudioSoundManager#destroy` heisst nicht mehr so").toBeGreaterThan(0);
    const body = src.slice(start, start + 900).replace(/\s+/g, " ");
    expect(body, "der fremde Kontext wird nicht mehr suspendiert — dann ist die Reihenfolge in PaintGame neu zu bewerten")
      .toContain("if (this.game.config.audio.context) { this.context.suspend(); }".replace(/\s+/g, " "));
  });

  it("4 · `pendingDestroy` gibt es wirklich, und `runDestroy` setzt es zurück", () => {
    const src = lies("core/Game.js");
    expect(src, "die Fahne heisst nicht mehr `pendingDestroy` — dann wartet PaintGames Aufräumer auf ein Feld, das es nicht gibt, und schliesst nach Frist")
      .toContain("this.pendingDestroy = true;");
    const rd = src.indexOf("runDestroy: function");
    expect(rd).toBeGreaterThan(0);
    expect(src.slice(rd), "`runDestroy` setzt die Fahne nicht mehr zurück — dann sieht der Aufräumer den Abbau nie als fertig")
      .toContain("this.pendingDestroy = false;");
  });

  it("…und PaintGame schliesst den Kontext NACH dem Abbau, nicht davor", () => {
    const src = fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), "../PaintGame.tsx"), "utf8");
    // ⚠ AB `iDestroy` gesucht, nicht von vorn: über dem Aufruf steht ein langer
    //   Kommentar, der jedes dieser Wörter selbst enthält — ein `indexOf` von
    //   vorn findet die ERKLÄRUNG und nicht die Zeile (dieselbe Falle, die die
    //   Quellen-Wächter schon dreimal gebissen hat). Der erste Anlauf hier ist
    //   genau daran rot geworden.
    const iDestroy = src.indexOf("game.destroy(true);");
    const iWarten = src.indexOf("abbauLaeuft()", iDestroy);
    const iClose = src.indexOf("zu.close()", iDestroy);
    expect(iDestroy, "`game.destroy(true)` steht nicht mehr im Aufräumer").toBeGreaterThan(0);
    expect(iWarten, "die Wache auf den fertigen Abbau fehlt — das Rennen ist wieder offen").toBeGreaterThan(iDestroy);
    expect(iClose, "der Kontext wird wieder VOR dem Abbau geschlossen — genau das war der Defekt").toBeGreaterThan(iWarten);
    expect(src, "der erzwungene Handtakt ist zurück — er wirft am halb gestarteten Spiel »reading 'sys'«")
      .not.toContain("game.step(performance.now(), 0)");
  });
});
