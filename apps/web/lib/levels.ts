/**
 * K7a · LEVEL, TITEL UND ZONEN — die OG-Kurve, als reine Rechnung.
 *
 * Kinder sammeln seit Juli XP; `/home` las sie und warf sie weg. Diese Datei ist
 * die Rechenhälfte der Sichtbarmachung: sie sagt, welches Level, welcher Titel
 * und welche Zone zu einem Punktestand gehören — und sonst nichts. Kein
 * DB-Import, kein React, keine Ökonomie: `xpForTier` und die Combo-Logik
 * bleiben unangetastet, hier wird nur ANGEZEIGT, was dort längst gerechnet wird.
 *
 * BINDENDE QUELLE: `docs/handover/design-study-og-trainers.md` — Kurve :216-226,
 * sanfte Vokabel-Leiter :232-254, Gamer-Leiter :258-280, Grammatik-Leiter
 * :282-301, Gesamt-Leiter :303-316. Die Tabellen unten sind aus genau diesen
 * Zeilen GESCHNITTEN, nicht abgetippt (Skript im Sitzungs-Scratchpad); die
 * Titel- und Vibe-Tests in levels.test.ts halten sie byte-genau fest. Wer hier
 * einen Titel "verbessert", bricht das Design-Tor.
 *
 * DREI AUSLEGUNGEN, die die Quelle offen lässt — hier entschieden und benannt:
 *
 *   1. L20 UND P1 stehen beide auf 30.000 (:221-222). Prestige ist deshalb KEIN
 *      21.-25. Level, sondern eine zweite Achse über der Leiter: wer 30.000
 *      erreicht, ist Level 20 UND Prestige 1. Der Titel friert am Deckel ein
 *      ("name freezes at max title", :222), die Zone wird `prestige`, und je
 *      Rang kommt ein Stern dazu (:226). Folge, bewusst: Level 20 ohne Stern
 *      gibt es nicht — der Deckel IST der erste Prestige-Rang.
 *   2. Zeile 226 sagt "Sterne nur bei Prestige", die Render-Skizze :507 zeigt
 *      "⭐ Lv 12 · Word Wizard". Die Regel schlägt die Skizze: unter Prestige
 *      trägt die Pill keinen Stern.
 *   3. Für die PRESTIGE-Ränge der Grammatik-Leiter nennt die Studie keine Vibes
 *      (:293 listet nur die Namen). Übernommen werden die fünf Prestige-Vibes
 *      der Vokabel-Leitern, die in beiden Registern identisch sind. Das ist eine
 *      Ableitung, kein Zitat.
 *
 * Bewusst frei von `@/…`-Pfad-Aliassen und ohne jede Abhängigkeit: die Suite von
 * apps/web läuft unter blankem `node --test`, das Nexts tsconfig-Aliasse nicht
 * auflöst (dasselbe Muster wie lib/grade-scope.ts).
 */

/** Farbfamilie einer Stufe — die Pill-Klassen in globals.css heißen genauso. */
export type Zone = "bronze" | "silver" | "gold" | "diamond" | "prestige";

/**
 * Welche Titel-Leiter ein Kind sieht. Die 1. Klasse bekommt die sanfte Leiter
 * ("young learner"), die 2.-4. die Gamer-Leiter — Studie :230/:256.
 */
export type Register = "gentle" | "gamer";

/** Eine Sprosse: der Titel und seine Vibe-Zeile, beide Design-Bytes. */
export interface Rung {
  name: string;
  vibe: string;
}

/** Eine Sprosse der Gesamt-Leiter — die trägt ihre Schwelle und Zone selbst. */
export interface OverallRung {
  xp: number;
  name: string;
  zone: Exclude<Zone, "prestige">;
  vibe: string;
}

const LEVEL_XP_RAW = [0, 50, 120, 220, 350, 500, 700, 950, 1250, 1600, 2000, 2700, 3500, 5000, 6500, 8000, 11000, 15000, 20000, 30000] as const;

const PRESTIGE_XP_RAW = [30000, 45000, 65000, 90000, 120000] as const;

const VOCAB_GENTLE: readonly Rung[] = [
  { name: "Wordling", vibe: "just spawned in" },
  { name: "Word Scout", vibe: "exploring the map" },
  { name: "Spelling Bee", vibe: "letter by letter" },
  { name: "Vocab Hunter", vibe: "on the hunt" },
  { name: "Word Collector", vibe: "collecting words" },
  { name: "Dictionary Diver", vibe: "diving deep" },
  { name: "Phrase Finder", vibe: "finding the right words" },
  { name: "Word Warrior", vibe: "battle-tested" },
  { name: "Vocab Viking", vibe: "conquering word by word" },
  { name: "Language Explorer", vibe: "exploring new worlds" },
  { name: "Word Wizard", vibe: "casting word spells" },
  { name: "Vocab Champion", vibe: "unbeatable" },
  { name: "Word Master", vibe: "mastering words" },
  { name: "Lexicon Legend", vibe: "a living legend" },
  { name: "Vocab Virtuoso", vibe: "top-tier performance" },
  { name: "Word Titan", vibe: "a titan of words" },
  { name: "Language Lord", vibe: "ruling the language" },
  { name: "Vocab Sovereign", vibe: "sovereign in all situations" },
  { name: "Word Emperor", vibe: "nothing left to prove" },
  { name: "Grandmaster", vibe: "GG" },
];

const VOCAB_GAMER: readonly Rung[] = [
  { name: "Wordling", vibe: "just spawned in" },
  { name: "Word Scout", vibe: "exploring the map" },
  { name: "Spell Rookie", vibe: "learning the controls" },
  { name: "Letter Looter", vibe: "grabbing the first loot" },
  { name: "Vocab Raider", vibe: "raiding the word vault" },
  { name: "Word Crafter", vibe: "crafting with words now" },
  { name: "Phrase Builder", vibe: "building something real" },
  { name: "Syntax Striker", vibe: "landing clean hits" },
  { name: "Word Warrior", vibe: "battle-tested" },
  { name: "Vocab Veteran", vibe: "seen some things" },
  { name: "Language Ninja", vibe: "silent but deadly accurate" },
  { name: "Word Wizard", vibe: "spells are getting real" },
  { name: "Grammar Ghost", vibe: "moves through units unseen" },
  { name: "Vocab Viking", vibe: "conquering word by word" },
  { name: "Lexicon Legend", vibe: "people know your name" },
  { name: "Word Warden", vibe: "guarding the language" },
  { name: "Sentence Sovereign", vibe: "ruling the syntax realm" },
  { name: "Vocab Titan", vibe: "final boss energy" },
  { name: "Language Overlord", vibe: "nothing left to prove" },
  { name: "Grandmaster", vibe: "GG" },
];

const GRAMMAR: readonly Rung[] = [
  { name: "Rule Noob", vibe: "just spawned in" },
  { name: "Comma Kid", vibe: "finding the basics" },
  { name: "Tense Cadet", vibe: "past, present, future..." },
  { name: "Sentence Slicer", vibe: "chopping up sentences" },
  { name: "Grammar Gremlin", vibe: "causing chaos with rules" },
  { name: "Clause Cruncher", vibe: "eating clauses for breakfast" },
  { name: "Syntax Sniper", vibe: "every shot hits" },
  { name: "Rule Breaker", vibe: "knows rules to break them" },
  { name: "Grammar Gladiator", vibe: "arena-tested" },
  { name: "Tense Titan", vibe: "master of time" },
  { name: "Error Assassin", vibe: "hunts mistakes for fun" },
  { name: "Grammar Goat", vibe: "greatest of all time" },
  { name: "Sentence Sorcerer", vibe: "casting grammar spells" },
  { name: "Punctuation Pirate", vibe: "stealing commas everywhere" },
  { name: "Rule Overlord", vibe: "all rules bow to you" },
  { name: "Grammar Dragon", vibe: "breathing grammar fire" },
  { name: "Clause Commander", vibe: "commanding the syntax fleet" },
  { name: "Grammar Galaxy", vibe: "a universe of rules" },
  { name: "Language Lich", vibe: "undying grammar power" },
  { name: "Grammar God", vibe: "GG" },
];

const GRAMMAR_L1_GENTLE: Rung = { name: "Rule Rookie", vibe: "first rule learned" };

const PRESTIGE_VIBES: readonly string[] = [
  "prestige unlocked",
  "rising legend",
  "elite status",
  "mythic tier",
  "ultimate master",
];

const OVERALL: readonly OverallRung[] = [
  { xp: 0, name: "First Steps", zone: "bronze", vibe: "every journey starts here" },
  { xp: 300, name: "Listener", zone: "bronze", vibe: "tuning in to English" },
  { xp: 1000, name: "Communicator", zone: "silver", vibe: "starting to get your point across" },
  { xp: 3000, name: "Storyteller", zone: "silver", vibe: "finding your voice in English" },
  { xp: 6000, name: "Translator", zone: "gold", vibe: "bridging two languages" },
  { xp: 12000, name: "Globetrotter", zone: "gold", vibe: "English takes you places" },
  { xp: 20000, name: "Polyglot", zone: "gold", vibe: "fluency is within reach" },
  { xp: 35000, name: "Native Speaker", zone: "diamond", vibe: "sounds like you grew up with it" },
  { xp: 55000, name: "Language Architect", zone: "diamond", vibe: "building English like a pro" },
  { xp: 80000, name: "English GOAT", zone: "diamond", vibe: "greatest English learner of all time" },
];

/** Die 20 kumulativen Level-Schwellen (Index 0 = Level 1). Studie :219-221. */
export const LEVEL_XP: readonly number[] = LEVEL_XP_RAW;

/** Die fünf Prestige-Schwellen, P1 bis P5. Studie :222. */
export const PRESTIGE_XP: readonly number[] = PRESTIGE_XP_RAW;

/** Der höchste Punktestand, über den hinaus es nichts mehr zu erreichen gibt. */
export const MAX_XP: number = PRESTIGE_XP_RAW[4];

/** Wie viele Stufen die Leiter hat, bevor Prestige beginnt. */
export const MAX_LEVEL: number = LEVEL_XP_RAW.length;

/**
 * Die Zone einer Stufe OHNE Prestige — L1-5 bronze, L6-10 silver, L11-15 gold,
 * L16-20 diamond (Studie :225). Prestige überschreibt das in `levelFor`.
 */
export function zoneOfLevel(level: number): Exclude<Zone, "prestige"> {
  if (level <= 5) return "bronze";
  if (level <= 10) return "silver";
  if (level <= 15) return "gold";
  return "diamond";
}

/** Der Stand eines einzelnen XP-Topfes (Vokabel oder Grammatik). */
export interface LevelState {
  /** 1 bis 20. Am Deckel bleibt sie 20, auch durch alle Prestige-Ränge. */
  level: number;
  /** 0 = noch kein Prestige, sonst 1 bis 5. */
  prestige: number;
  zone: Zone;
  /** Punkte oberhalb der aktuellen Schwelle — die Füllung des Balkens. */
  xpIntoLevel: number;
  /** Punkte bis zur nächsten Schwelle; `null` NUR am absoluten Deckel. */
  xpToNext: number | null;
}

/**
 * DIE Rechnung. Negative oder krumme Eingaben werden auf einen ganzzahligen
 * Punktestand ab 0 gezogen: ein kaputter Datensatz darf die Karte verstellen,
 * aber nicht zum Absturz bringen.
 */
export function levelFor(xp: number): LevelState {
  const points = Number.isFinite(xp) ? Math.max(0, Math.floor(xp)) : 0;

  let level = 1;
  for (let i = 0; i < LEVEL_XP_RAW.length; i += 1) {
    if (points >= LEVEL_XP_RAW[i]) level = i + 1;
  }

  let prestige = 0;
  for (let i = 0; i < PRESTIGE_XP_RAW.length; i += 1) {
    if (points >= PRESTIGE_XP_RAW[i]) prestige = i + 1;
  }

  // Ab dem ersten Prestige-Rang zählt die Prestige-Achse, darunter die Leiter.
  const floor = prestige > 0 ? PRESTIGE_XP_RAW[prestige - 1] : LEVEL_XP_RAW[level - 1];
  let ceiling: number | null;
  if (prestige > 0) {
    ceiling = prestige < PRESTIGE_XP_RAW.length ? PRESTIGE_XP_RAW[prestige] : null;
  } else {
    ceiling = level < LEVEL_XP_RAW.length ? LEVEL_XP_RAW[level] : PRESTIGE_XP_RAW[0];
  }

  return {
    level,
    prestige,
    zone: prestige > 0 ? "prestige" : zoneOfLevel(level),
    xpIntoLevel: points - floor,
    xpToNext: ceiling === null ? null : ceiling - points,
  };
}

/** Die Stufe eines Kindes entscheidet, welche Leiter es liest. */
export function registerFor(grade: number | null | undefined): Register {
  return grade === 1 ? "gentle" : "gamer";
}

/** Am Deckel friert der Titel ein; die Vibe-Zeile zieht mit dem Prestige-Rang. */
function titleOf(ladder: readonly Rung[], level: number, prestige: number): Rung {
  if (prestige > 0) return { name: ladder[ladder.length - 1].name, vibe: PRESTIGE_VIBES[prestige - 1] };
  return ladder[level - 1];
}

/** Titel und Vibe des Vokabel-Topfes. */
export function vocabTitle(level: number, prestige: number, register: Register): Rung {
  return titleOf(register === "gentle" ? VOCAB_GENTLE : VOCAB_GAMER, level, prestige);
}

/**
 * Titel und Vibe des Grammatik-Topfes. Die beiden Register unterscheiden sich
 * NUR auf Stufe 1 (Studie :284-285) — überall sonst lesen alle dasselbe.
 */
export function grammarTitle(level: number, prestige: number, register: Register): Rung {
  if (prestige === 0 && level === 1 && register === "gentle") return GRAMMAR_L1_GENTLE;
  return titleOf(GRAMMAR, level, prestige);
}

/** Der Stand auf der Gesamt-Leiter (Vokabel-XP plus Grammatik-XP). */
export interface OverallState {
  /** 1 bis 10. */
  level: number;
  name: string;
  zone: Exclude<Zone, "prestige">;
  vibe: string;
  xpIntoLevel: number;
  /** `null` auf der letzten Sprosse — English GOAT hat kein Danach. */
  xpToNext: number | null;
}

/** Die zehnstufige Gesamt-Leiter, First Steps bis English GOAT (Studie :305-316). */
export function overallLevelFor(totalXp: number): OverallState {
  const points = Number.isFinite(totalXp) ? Math.max(0, Math.floor(totalXp)) : 0;

  let index = 0;
  for (let i = 0; i < OVERALL.length; i += 1) {
    if (points >= OVERALL[i].xp) index = i;
  }
  const rung = OVERALL[index];
  const next = index < OVERALL.length - 1 ? OVERALL[index + 1] : null;

  return {
    level: index + 1,
    name: rung.name,
    zone: rung.zone,
    vibe: rung.vibe,
    xpIntoLevel: points - rung.xp,
    xpToNext: next === null ? null : next.xp - points,
  };
}

/** Die Anzahl der Sterne vor dem Pill-Text: einer je Prestige-Rang (:226). */
export function prestigeStars(prestige: number): string {
  return "⭐".repeat(Math.max(0, Math.min(PRESTIGE_XP_RAW.length, prestige)));
}

/**
 * Punktestände stehen mit englischem Tausender-Trenner da ("1,234 XP to next",
 * Studie :511) — die Karte ist auf Englisch, wie die ganze Lernoberfläche.
 */
export function formatXp(n: number): string {
  return Math.max(0, Math.floor(n)).toLocaleString("en-US");
}

/**
 * Wie voll der Balken steht, als Anteil 0…1. Am Deckel (kein Danach) ist er
 * voll — "✨ Max level!" statt einer Restzahl.
 */
export function barFraction(xpIntoLevel: number, xpToNext: number | null): number {
  if (xpToNext === null) return 1;
  const span = xpIntoLevel + xpToNext;
  if (span <= 0) return 1;
  return Math.max(0, Math.min(1, xpIntoLevel / span));
}
