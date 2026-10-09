/** Original design study §3e. Collective XP, separate from the individual ladder. */
const CLASS_LEVELS = [
  [0, "Study Group"], [2000, "Book Club"], [8000, "Think Tank"], [20000, "Dream Team"], [40000, "Brain Squad"],
  [70000, "Power Crew"], [110000, "Super Class"], [160000, "Legend League"], [220000, "Hall of Famers"], [300000, "World Class"],
] as const;
export function classLevelFor(xp: number): { level: number; name: string } {
  let i = 0;
  for (let n = 0; n < CLASS_LEVELS.length; n++) if (xp >= CLASS_LEVELS[n][0]) i = n;
  return { level: i + 1, name: CLASS_LEVELS[i][1] };
}
