/** cgo-114: presentation preferences never alter year, curriculum or scoring. */
export type TrainerLanguage = "de" | "en";
export type TrainerTheme = "light" | "dark";
export function defaultTrainerLanguage(grade: number): TrainerLanguage { return grade === 1 ? "de" : "en"; }
export function defaultTrainerTheme(grade: number): TrainerTheme { return grade >= 3 ? "dark" : "light"; }
export function trainerLanguage(grade: number, chosen: TrainerLanguage): TrainerLanguage { return grade === 1 ? chosen : "en"; }
