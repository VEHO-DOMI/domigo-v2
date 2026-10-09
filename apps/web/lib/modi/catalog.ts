export const TRAINER_MODES = ["flashcards", "memory", "spelling", "wordhunt", "speed"] as const;
export type TrainerMode = typeof TRAINER_MODES[number];
export function memoryPairCount(grade: number): number { return grade === 1 ? 8 : grade === 3 ? 10 : 12; }
export function modeDetails(grade: number) {
  const de = grade === 1;
  return {
    flashcards: { icon: "📇", title: "Flashcards", sub: de ? "Lernmodus, kein Druck" : "Study mode, no pressure", reward: "0 XP" },
    memory: { icon: "🧠", title: "Memory Match", sub: de ? "8 Paare — verbinde Englisch und Deutsch" : `${memoryPairCount(grade)} pairs — match EN ↔ DE`, reward: de ? "10–30 XP / Paar" : "10–30 XP / pair" },
    spelling: { icon: "🐝", title: "Spelling Bee", sub: de ? "Wörter aus Buchstaben legen — bis zu 18 Runden" : grade === 4 ? "Spell B1 words & phrases — up to 18 rounds" : grade === 3 ? "Unscramble letters — also handles phrases" : "Unscramble letters to spell the word", reward: de ? "10–30 XP / Wort" : "10–30 XP / word" },
    wordhunt: { icon: "🔍", title: "Word Hunt", sub: de ? "Finde alle Wörter zum Chapter — 8 Runden" : "Pick every word that fits the Chapter — 8 rounds", reward: de ? "10–30 XP / richtige Zuordnung" : "10–30 XP / correct match" },
    speed: { icon: "⚡", title: "Speed Round", sub: de ? "60 Sekunden — antworte schnell!" : "60 seconds, answer fast!", reward: de ? "10–30 XP / Wort" : "10–30 XP / word" },
  };
}
