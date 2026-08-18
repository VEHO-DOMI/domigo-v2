/**
 * R5-W6 · S2 · DER BANDLAUF: EREIGNIS-LOG ↔ KLANG-LOG.
 *
 * Der Auftrag verlangt als Beweis, dass jedes Ereignis eines echten Durchlaufs
 * genau das tut, was das Manifest sagt — kein Klang zu viel, keiner zu wenig,
 * keine Doppel-Auslösung. Das liesse sich als Bildschirm-Protokoll aus dem
 * Browser abtippen. Hier steht es stattdessen als TEST, aus drei Gründen:
 *
 *  1. Ein Protokoll aus einem Browser-Lauf beweist EINEN Lauf, an EINEM Tag,
 *     auf EINEM Rechner. Dieser Test fährt bei jedem CI-Lauf mit.
 *  2. Die aufgezeichneten Bänder (`ch01.proof.json`) sind schon da und sind die
 *     Wahrheit über das Kapitel: derselbe Tastendruck-Strom, den die
 *     Spielbarkeits-Prüfung durch die echte Spiel-Logik schickt.
 *  3. Er ist deterministisch. Ein Klang, der nur in jedem dritten Lauf doppelt
 *     kommt, wird in einem abgetippten Protokoll nie auffallen.
 *
 * Was er NICHT kann: die Szenen-Takte (Schritt, Landung, Sprung, Rutsche)
 * hängen an `PaintScene#footwork` und brauchen Phaser. Sie werden am
 * sichtbaren Chrome geprüft und stehen im Report — hier nachzubauen hiesse,
 * den Test zu prüfen statt den Code.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { Sim, type SimEvent } from "../sim.ts";
import type { EntityEvent } from "../entities.ts";
import { allPhases, type PaintLevel } from "../level.ts";
import { decodePads, maskToPad, type ProofFile } from "../tape.ts";
import { mapEvent, type EventUnion } from "./director.ts";
import { filesOf, stemSpec } from "./audioManifest.ts";

const CONTENT = path.resolve(__dirname, "../../../../content/corpus/stories/g1.st.lost-pages/paint");
const level = JSON.parse(fs.readFileSync(path.join(CONTENT, "ch01.level.json"), "utf8")) as PaintLevel;
const proof = JSON.parse(fs.readFileSync(path.join(CONTENT, "ch01.proof.json"), "utf8")) as ProofFile;

interface Hit { tick: number; union: EventUnion; event: string; stem: string | null; why: string }

/**
 * Ein Band durch die ECHTE Spiel-Logik fahren und dabei mitschreiben, was der
 * Direktor gespielt hätte. Der Direktor selbst wird nicht gebaut — geprüft wird
 * seine Zuordnung (`mapEvent`), also genau die Entscheidung, die S2 verdrahtet
 * hat. Ein echter Direktor bräuchte eine Tonmaschine und würde nur beweisen,
 * dass eine Attrappe zurückgibt, was man ihr beibringt.
 */
const runTape = (phaseId: string): { hits: Hit[]; ticks: number } => {
  const tape = proof.phases[phaseId];
  if (tape === undefined) throw new Error(`kein Band für ${phaseId}`);
  const hits: Hit[] = [];
  let tick = 0;

  const note = (union: EventUnion, event: string, payload: Record<string, unknown>): void => {
    const { stem, why } = mapEvent(union, event, payload);
    hits.push({ tick, union, event, stem, why });
  };

  const sim = new Sim({
    level,
    phaseId,
    grantedAbilities: () => [...tape.abilities],
    freedCageIds: () => [],
    onEntityAudio: (ev: EntityEvent) => note("entity", ev.type, ev as unknown as Record<string, unknown>),
  });

  const masks = decodePads(tape.pads);
  for (; tick < masks.length; tick++) {
    const evs: SimEvent[] = sim.step(maskToPad(masks[tick] ?? 0));
    for (const ev of evs) note("sim", ev.type, ev as unknown as Record<string, unknown>);
  }
  return { hits, ticks: masks.length };
};

const PHASES = allPhases(level).map((p) => p.id);
const runs = new Map(PHASES.map((id) => [id, runTape(id)]));

describe("Bandlauf: jedes Ereignis tut, was das Manifest sagt", () => {
  it("die Bänder laufen überhaupt und lösen etwas aus", () => {
    const total = [...runs.values()].reduce((a, r) => a + r.hits.length, 0);
    expect(PHASES.length).toBeGreaterThanOrEqual(4);
    expect(total, "kein einziges Ereignis in keinem Band — das Band oder die Verdrahtung ist kaputt").toBeGreaterThan(50);
  });

  for (const id of PHASES) {
    it(`${id}: jedes Ereignis hat eine Antwort — Klang oder ein Grund zu schweigen`, () => {
      const { hits } = runs.get(id)!;
      // „100 % Deckung" heisst NICHT „alles klingt": es heisst, dass kein
      // Ereignis durchrutscht, für das niemand entschieden hat. Ein leerer
      // Grund wäre genau so ein Durchrutscher.
      const unanswered = hits.filter((h) => h.stem === null && h.why.trim() === "");
      expect(unanswered.map((h) => `${h.union}/${h.event}`), "Ereignisse ohne Klang UND ohne Grund").toEqual([]);
      const unknown = hits.filter((h) => h.why.startsWith("unbekanntes Ereignis"));
      expect(unknown.map((h) => `${h.union}/${h.event}`), "Ereignisse, die das Manifest nicht kennt").toEqual([]);
    });

    it(`${id}: jeder ausgelöste Klang liegt als Datei auf der Platte`, () => {
      const { hits } = runs.get(id)!;
      const played = [...new Set(hits.filter((h) => h.stem !== null).map((h) => h.stem as string))];
      const ghosts = played.filter((s) => stemSpec(s) === undefined);
      expect(ghosts, "ausgelöste Stems, die es im Manifest nicht gibt").toEqual([]);
    });

    it(`${id}: kein Klang wird im selben Takt zweimal ausgelöst`, () => {
      const { hits } = runs.get(id)!;
      const seen = new Set<string>();
      const doubles: string[] = [];
      for (const h of hits) {
        if (h.stem === null) continue;
        const key = `${h.tick}:${h.stem}`;
        if (seen.has(key)) doubles.push(`${h.stem} @ Takt ${h.tick} (${h.union}/${h.event})`);
        seen.add(key);
      }
      // Doppelte auf EINEM Takt sind die Klasse, gegen die das Manifest seine
      // `silent`-Einträge hat: `guardianDown` und `guardianWipe(0)` feuern im
      // selben Augenblick, und zwei Klänge auf einem Beat sind einer zu viel.
      expect(doubles, "zwei Klänge auf einem Takt").toEqual([]);
    });
  }

  it("die gefalteten EntityEvents kommen wirklich an (sonst wäre die sim.ts-Zeile umsonst)", () => {
    const entity = [...runs.values()].flatMap((r) => r.hits).filter((h) => h.union === "entity");
    expect(entity.length, "kein einziges EntityEvent im ganzen Kapitel — der Durchreicher in sim.ts greift nicht").toBeGreaterThan(0);
    const played = new Set(entity.filter((h) => h.stem !== null).map((h) => h.stem as string));
    // Mindestens ein Klang, den es OHNE diese Zeile nicht gäbe: die vier
    // Entity-Klänge stehen in keiner SimEvent-Tabelle.
    const onlyViaEntity = ["cage-open", "cage-locked", "bump", "shoo"];
    expect(
      onlyViaEntity.some((s) => played.has(s)),
      `keiner der Klänge ${onlyViaEntity.join(", ")} wurde in den Bändern ausgelöst — der Beweis für die sim.ts-Zeile fehlt`,
    ).toBe(true);
  });

  it("PROTOKOLL: welcher Klang in welchem Raum, und was bewusst schweigt", () => {
    const lines: string[] = [];
    for (const id of PHASES) {
      const { hits, ticks } = runs.get(id)!;
      const played = new Map<string, number>();
      const silent = new Map<string, number>();
      for (const h of hits) {
        const m = h.stem === null ? silent : played;
        const k = h.stem ?? `${h.union}/${h.event}`;
        m.set(k, (m.get(k) ?? 0) + 1);
      }
      lines.push(`${id} (${ticks} Takte, ${hits.length} Ereignisse)`);
      lines.push(`  klingt:    ${[...played].map(([k, n]) => `${k}×${n}`).join(" · ") || "—"}`);
      lines.push(`  schweigt:  ${[...silent].map(([k, n]) => `${k}×${n}`).join(" · ") || "—"}`);
    }
    // Kein `expect` auf den Text: das Protokoll ist der Beleg für den Report,
    // kein Gesetz. Gesetze sind die Tests darüber. Es geht in den Temp-Ordner
    // und auf die Konsole — eine Datei, die ein Test in den Arbeitsbaum
    // schreibt, taucht als ungewollte Änderung im nächsten Diff auf.
    const out = path.join(os.tmpdir(), "domigo-tape-audio.log");
    fs.writeFileSync(out, lines.join("\n") + "\n");
    console.log(`\n── Klang-Protokoll der Bänder (${out}) ──\n${lines.join("\n")}`);
    expect(lines.length).toBeGreaterThan(0);
  });
});

describe("was die aufgezeichneten Piloten wirklich auslösen", () => {
  /**
   * Die Piloten laufen den KÜRZESTEN Weg zum Ausgang — sie rutschen nicht, sie
   * verlieren nicht, sie öffnen nicht jeden Käfig. Dass ein Klang hier fehlt,
   * heisst also nicht, dass er tot ist (dafür gibt es `coverage.test.ts`), und
   * eine erfundene Mindestzahl wäre eine Wunschzahl gewesen.
   *
   * Gemessen am 18.08.2026 lösen die fünf Bänder GENAU diese sieben aus. Die
   * Menge steht hier als Wächter: schrumpft sie, ist eine Verdrahtung
   * herausgefallen; wächst sie, hat jemand die Welt geändert und muss die Zeile
   * mit der neuen Messung nachziehen. Beides soll auffallen.
   */
  const GEMESSEN_18_08 = ["bump", "card-open", "door-open", "letter-take", "letters-all", "page-take", "puff-chalk"];

  const fired = [...new Set(
    [...runs.values()].flatMap((r) => r.hits).map((h) => h.stem).filter((s): s is string => s !== null),
  )].sort();

  it("die Bänder lösen genau die gemessenen sieben Klänge aus", () => {
    expect(fired, "die Bänder klingen anders als am 18.08. gemessen — Verdrahtung raus, oder die Welt hat sich geändert").toEqual(GEMESSEN_18_08);
  });

  it("darunter `bump` — der Beweis, dass die eine Zeile in sim.ts trägt", () => {
    // `bump` hängt am EntityEvent `encounter` und steht in keiner
    // SimEvent-Tabelle. Ohne den Durchreicher wäre er hier nicht.
    expect(fired).toContain("bump");
  });

  it("jeder ausgelöste Klang hat Dateien auf der Platte", () => {
    for (const stem of fired) {
      const spec = stemSpec(stem);
      expect(spec, `${stem} steht in keinem Manifest`).toBeDefined();
      expect(filesOf(spec!).length, `${stem} hat keine Datei`).toBeGreaterThan(0);
    }
  });
});
