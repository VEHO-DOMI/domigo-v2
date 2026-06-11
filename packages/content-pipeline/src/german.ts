/**
 * Shared German-orthography heuristics — used by the word-bank review flags
 * and the V-14 item validator.
 */

/** Legitimate ae/oe/ue spellings (loanwords etc.) — never umlaut suspects. */
export const UMLAUT_EXCEPTIONS = [
  "aktuell",
  "eventuell",
  "manuell",
  "individuell",
  "visuell",
  "virtuell",
  "punktuell",
  "statue",
  "fluent",
];

/**
 * Does the German string contain a suspected ASCII umlaut ("muede" for
 * "müde")? "q" is excluded before "ue" — German q is always followed by u
 * ("bequem", "überqueren"), never an ASCII umlaut.
 */
export function asciiUmlautSuspect(de: string): boolean {
  const lower = de.toLowerCase();
  if (UMLAUT_EXCEPTIONS.some((x) => lower.includes(x))) return false;
  return /[bcdfghjklmnprstvwxz](ae|oe|ue)/.test(lower) || /[bcdfghjklmnpqrstvwxz](ae|oe)/.test(lower);
}
