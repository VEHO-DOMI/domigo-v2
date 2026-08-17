/**
 * R5 · S1 · DIE ABDECKUNG WIRD ABGELEITET, NIE ABGETIPPT.
 *
 * Ein blinder Prüfer fand in der ersten Fassung des Klang-Kanons SIEBEN
 * Ereignisse, die niemand klassifiziert hatte — darunter `task`, aus dem jede
 * einzelne Karte kommt. Die Lücken waren nicht zufällig: es fehlten fast
 * ausschliesslich die Ereignisse, die in andere gefaltet werden oder die nur
 * eine Karte heben. Beim Schreiben denkt man in Beats, und ein gefaltetes
 * Ereignis ist kein Beat — es ist Buchhaltung.
 *
 * Deshalb zwei Netze übereinander:
 *   · der COMPILER (`satisfies Record<SimEvent["type"], …>` im Manifest) — er
 *     macht `pnpm typecheck` rot, sobald im Spiel eine Ereignis-Art dazukommt;
 *   · dieser TEST — er liest die drei Union-Typen aus den QUELLDATEIEN und
 *     prüft die Zahlen gegen das Manifest. Er fängt den Fall, den der Compiler
 *     nicht sieht: jemand ändert den Typ so, dass TypeScript zufrieden ist,
 *     aber das Kapitel klingt an einer Stelle weniger.
 */

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  ENTITY_REACTIONS, PLAYER_REACTIONS, SIM_REACTIONS, STEMS, TOAST_MATCHES,
  allReactions, isPlay, isReserved, isSilent,
} from "./audioManifest.ts";

const SRC = path.dirname(new URL(import.meta.url).pathname);
const PKG = path.join(SRC, "..");

/** Die Mitglieder eines exportierten Union-Typs, direkt aus dem Quelltext. */
const unionMembers = (file: string, name: string): readonly string[] => {
  const src = fs.readFileSync(path.join(PKG, file), "utf8");
  const head = `export type ${name} =`;
  const start = src.indexOf(head);
  expect(start, `${name} nicht in ${file} gefunden`).toBeGreaterThanOrEqual(0);
  const rest = src.slice(start + head.length);
  // bis zur nächsten Top-Level-Deklaration
  const end = rest.search(/\nexport (interface|type|const|function|class)/);
  const body = end > 0 ? rest.slice(0, end) : rest;
  const found = [...body.matchAll(/type:\s*"([a-zA-Z]+)"/g)].map((m) => m[1] as string);
  return [...new Set(found)];
};

describe("Abdeckung: jede Ereignis-Art des Spiels hat genau einen Zustand", () => {
  const cases = [
    { file: "sim.ts", name: "SimEvent", table: SIM_REACTIONS as Readonly<Record<string, unknown>>, expected: 15 },
    { file: "player.ts", name: "PlayerEvent", table: PLAYER_REACTIONS as Readonly<Record<string, unknown>>, expected: 8 },
    { file: "entities.ts", name: "EntityEvent", table: ENTITY_REACTIONS as Readonly<Record<string, unknown>>, expected: 16 },
  ];

  for (const c of cases) {
    it(`${c.name}: alle Arten aus ${c.file} stehen im Manifest`, () => {
      const members = unionMembers(c.file, c.name);
      // Die Zahl selbst ist Teil des Vertrags: wächst der Typ, will jemand
      // eine Entscheidung treffen, und dieser Test ist die Stelle dafür.
      expect(members.length, `${c.name} hat jetzt ${members.length} Arten statt ${c.expected}`).toBe(c.expected);
      const missing = members.filter((m) => c.table[m] === undefined);
      expect(missing, `ohne Klang-Entscheidung: ${missing.join(", ")}`).toEqual([]);
      const extra = Object.keys(c.table).filter((k) => !members.includes(k));
      expect(extra, `im Manifest, aber nicht im Typ: ${extra.join(", ")}`).toEqual([]);
    });
  }

  it("zusammen sind es 39 — und jede Reaktion ist genau eines von drei Dingen", () => {
    const total = ["sim.ts", "player.ts", "entities.ts"]
      .map((f, i) => unionMembers(f, ["SimEvent", "PlayerEvent", "EntityEvent"][i] as string).length)
      .reduce((a, b) => a + b, 0);
    expect(total).toBe(39);

    for (const { union, event, reaction } of allReactions()) {
      const kinds = [isPlay(reaction), isSilent(reaction), isReserved(reaction)].filter(Boolean).length;
      expect(kinds, `${union}/${event} ist nicht genau ein Zustand`).toBe(1);
    }
  });

  it("jedes `silent` und jedes `reserved` nennt einen Grund, den ein Mensch lesen kann", () => {
    for (const { union, event, reaction } of allReactions()) {
      if (isPlay(reaction)) continue;
      const why = isSilent(reaction) ? reaction.silent : isReserved(reaction) ? reaction.reserved : "";
      expect(why.length, `${union}/${event}: der Grund ist zu dünn (»${why}«)`).toBeGreaterThan(20);
    }
  });

  it("jeder gespielte Stem existiert im Manifest — kein Klang zeigt ins Leere", () => {
    const known = new Set(STEMS.map((s) => s.stem));
    for (const { union, event, reaction } of allReactions()) {
      if (!isPlay(reaction)) continue;
      expect(known.has(reaction.play), `${union}/${event} spielt „${reaction.play}", den es nicht gibt`).toBe(true);
    }
  });

  /**
   * Ein Stem ist erreichbar, wenn ihn EINER von fünf Wegen auslöst. Die Wege
   * werden hier einzeln aufgezählt statt pauschal entschuldigt — die erste
   * Fassung dieses Tests kannte nur den ersten und meldete fünf gesunde Stems
   * als tot. Ein Test, der die Wirklichkeit nicht kennt, erzeugt genau die
   * Ausnahme, unter der später ein echter toter Klang durchrutscht.
   */
  it("jeder Stem ist über einen der fünf Wege erreichbar — keine toten Klänge", () => {
    const viaEvent = new Set(allReactions().filter((r) => isPlay(r.reaction)).map((r) => (r.reaction as { play: string }).play));
    const viaToast = new Set(TOAST_MATCHES.map((m) => m.stem));

    const route = (s: (typeof STEMS)[number]): string | null => {
      if (viaEvent.has(s.stem)) return "Ereignis";
      if (viaToast.has(s.stem)) return "Toast-Klasse";
      if (s.bus === "music") return "Phasenwechsel";
      // `scene` = eine Flanke im Spieler-Zustand pro Takt (Schritt, Rutschen) —
      // das sind Zustände, keine Ereignisse, und stehen deshalb in keiner Union.
      if (s.tap === "scene") return "Szenen-Takt";
      if (s.tap === "shell") return "React-Hülle";
      return null;
    };

    const orphans = STEMS.filter((s) => route(s) === null).map((s) => s.stem);
    expect(orphans, `Stems, die niemand auslöst: ${orphans.join(", ")}`).toEqual([]);

    // …und die Gegenrichtung: jeder Weg wird von mindestens einem Stem benutzt.
    // Ein Weg ohne Stem wäre eine Verdrahtung, die S2 umsonst baut.
    const used = new Set(STEMS.map(route));
    for (const r of ["Ereignis", "Toast-Klasse", "Phasenwechsel", "Szenen-Takt", "React-Hülle"]) {
      expect(used.has(r), `kein einziger Stem benutzt den Weg »${r}«`).toBe(true);
    }
  });
});
