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
  CUE_STEMS, ENTITY_REACTIONS, MUSIC_BY_PHASE, PLAYER_REACTIONS, SIM_REACTIONS,
  STEMS, SURFACE_BY_PHASE, TOAST_MATCHES,
  allReactions, isPlay, isReserved, isSilent,
} from "./audioManifest.ts";
import { CARD_GRADE_STEMS } from "./director.ts";

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
    { file: "sim.ts", name: "SimEvent", table: SIM_REACTIONS as Readonly<Record<string, unknown>>, expected: 16 /* 15 + `cloth` (R5-W5 · G4, 18.08.) — Entscheidung: spielt letter-take */ },
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

  it("zusammen sind es 40 (39 + cloth) — und jede Reaktion ist genau eines von drei Dingen", () => {
    const total = ["sim.ts", "player.ts", "entities.ts"]
      .map((f, i) => unionMembers(f, ["SimEvent", "PlayerEvent", "EntityEvent"][i] as string).length)
      .reduce((a, b) => a + b, 0);
    expect(total).toBe(40);

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

    // ── R5-W6 · S2 · AUS EINER ABSICHT WIRD EIN NACHWEIS ────────────────────
    // In S1 galten `tap === "scene"` und `tap === "shell"` als erreichbar, weil
    // dort STAND, dass S2 sie anklemmen würde. Das war für S1 richtig und ist
    // jetzt zu wenig: eine Anschlussstelle im Manifest ist eine Absicht, und
    // eine Absicht kann man nicht hören. Erreichbar heisst ab hier: der Stem
    // steht in einer Ereignis-Tabelle, in einer Toast-Klasse, in `MUSIC_BY_PHASE`,
    // in der Cue-Union `CUE_STEMS` — oder er ist ein Schritt, den `footstep()`
    // aus dem Untergrund der Phase zusammensetzt.
    const viaCue = new Set<string>(CUE_STEMS);
    const viaSurface = new Set(Object.values(SURFACE_BY_PHASE).map((sf) => `step-${sf}`));

    /**
     * R5-W6b · D4 · D-371 — DIE AUSNAHME IST WEG, WEIL DER KLANG EINEN AUSLÖSER HAT.
     *
     * Hier stand eine einzige benannte Ausnahme: `solve-thud` hängt an der
     * BEWERTUNG, die seit R5-W3 in `cards/` liegt, und S2 durfte dort nicht hin.
     * D4 hat die Schnittstelle gebaut (`director.ts#CARD_GRADE_STEMS` +
     * `AudioDirector#card`), also fällt die Zeile — und das Gesetz unten hält
     * den Auslöser jetzt beim Wort: verschwindet die Verdrahtung, ist der Stem
     * wieder ein Waisenkind und dieser Test rot.
     *
     * Die Liste bleibt als LEERES Fach stehen, nicht als gelöschter Absatz: der
     * nächste Klang ohne Weg soll seine Ausnahme benennen müssen, statt sie zu
     * erfinden.
     */
    const DECLARED_SILENT: Readonly<Record<string, string>> = {};

    // R5-W6b · D4: die Karten-Wertung als eigener Weg — abgeleitet aus der
    // TABELLE, die der Direktor wirklich benutzt, nicht danebengeschrieben.
    // `correct: null` steht dort mit Grund (die Hülle spielt „richtig" selbst),
    // deshalb zählt nur, was einen Stem trägt.
    const viaCard = new Set<string>(Object.values(CARD_GRADE_STEMS).filter((v) => v !== null));

    const route = (s: (typeof STEMS)[number]): string | null => {
      if (viaEvent.has(s.stem)) return "Ereignis";
      if (viaCard.has(s.stem)) return "Karten-Wertung";
      if (viaToast.has(s.stem)) return "Toast-Klasse";
      if (s.bus === "music") return "Phasenwechsel";
      if (viaSurface.has(s.stem)) return "Schritt-Takt";
      if (viaCue.has(s.stem)) return "Cue aus Szene oder Hülle";
      return null;
    };

    const orphans = STEMS.filter((s) => route(s) === null && DECLARED_SILENT[s.stem] === undefined).map((s) => s.stem);
    expect(orphans, `Stems, die niemand auslöst: ${orphans.join(", ")}`).toEqual([]);

    // …und die Gegenrichtung: jeder Weg wird von mindestens einem Stem benutzt.
    // Ein Weg ohne Stem wäre eine Verdrahtung, die umsonst gebaut wurde.
    const used = new Set(STEMS.map(route));
    for (const r of ["Ereignis", "Karten-Wertung", "Toast-Klasse", "Phasenwechsel", "Schritt-Takt", "Cue aus Szene oder Hülle"]) {
      expect(used.has(r), `kein einziger Stem benutzt den Weg »${r}«`).toBe(true);
    }

    // Und die Ausnahmen altern nicht still: eine, die inzwischen doch klingt,
    // muss aus der Liste — sonst wächst sie zur Folklore.
    for (const [stem, why] of Object.entries(DECLARED_SILENT)) {
      expect(STEMS.some((s) => s.stem === stem), `${stem} gibt es gar nicht mehr`).toBe(true);
      expect(route(STEMS.find((s) => s.stem === stem)!), `${stem} ist verdrahtet — Ausnahme streichen (${why})`).toBeNull();
    }
  });
});

/**
 * R5-W6 · S2 · JEDER RAUM DES KAPITELS HAT EINEN BODEN UND EIN STÜCK MUSIK.
 *
 * Die zwei Tabellen im Manifest sind nach Phasen-Kennung geschlüsselt, und eine
 * Phase, die dort fehlt, fällt still auf `paper` zurück bzw. bekommt gar keine
 * Musik. Beides sieht in keinem Diff anders aus — man hört es erst im Raum, und
 * zwar nur, wenn man in genau diesen Raum geht. Also fragt der Test das LEVEL,
 * nicht die Tabelle: die Wahrheit über die Räume steht in `ch01.level.json`.
 */
describe("die Räume des Kapitels ↔ die Tabellen des Manifests", () => {
  const LEVEL = path.resolve(PKG, "../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json");
  const level = JSON.parse(fs.readFileSync(LEVEL, "utf8")) as {
    phases: { id: string }[]; arena?: { id: string }; bonus?: { id: string };
  };
  const rooms = [
    ...level.phases.map((p) => p.id),
    ...(level.arena ? [level.arena.id] : []),
    ...(level.bonus ? [level.bonus.id] : []),
  ];

  it("es gibt überhaupt Räume (sonst prüft der Rest nichts)", () => {
    expect(rooms.length).toBeGreaterThanOrEqual(5);
  });

  it("jeder Raum nennt seinen Untergrund", () => {
    const missing = rooms.filter((id) => SURFACE_BY_PHASE[id] === undefined);
    expect(missing, `Räume ohne Untergrund (die Schritte klängen dort nach Papier): ${missing.join(", ")}`).toEqual([]);
  });

  it("jeder Raum nennt sein Musikstück, und das Stück gibt es", () => {
    const missing = rooms.filter((id) => MUSIC_BY_PHASE[id] === undefined);
    expect(missing, `Räume ohne Musik: ${missing.join(", ")}`).toEqual([]);
    for (const id of rooms) {
      const key = MUSIC_BY_PHASE[id] as string;
      expect(STEMS.some((s) => s.stem === key && s.bus === "music"), `${id} verweist auf ${key}, das es nicht als Musik gibt`).toBe(true);
    }
  });

  it("keine Tabelle nennt einen Raum, den es nicht gibt", () => {
    const ghosts = [...Object.keys(SURFACE_BY_PHASE), ...Object.keys(MUSIC_BY_PHASE)].filter((id) => !rooms.includes(id));
    expect([...new Set(ghosts)], "Einträge für Räume, die das Level nicht kennt").toEqual([]);
  });
});
