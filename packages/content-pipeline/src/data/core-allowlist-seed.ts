/**
 * Seed for content/overlays/core-allowlist.json — closed-class tokens assumed
 * known at EVERY level (A1 day one), so the V5 level gate never demands a
 * gloss for them. Anything debatable belongs in a unit word bank, NOT here.
 * The review round cross-checks each token against transcripts + banks before
 * the list is approved.
 */
export interface SeedToken {
  token: string;
  category: string;
}

const c = (category: string, tokens: string): SeedToken[] =>
  tokens.split(/\s+/).filter((t) => t.length > 0).map((token) => ({ token, category }));

export const CORE_ALLOWLIST_SEED: SeedToken[] = [
  ...c("article", "a an the"),
  ...c("pronoun-subject", "i you he she it we they"),
  ...c("pronoun-object", "me him her us them"),
  ...c("possessive", "my your his its our their mine yours hers ours theirs"),
  ...c("reflexive", "myself yourself himself herself itself ourselves yourselves themselves"),
  ...c("demonstrative", "this that these those"),
  ...c("question", "who what which whose whom when where why how"),
  ...c("be", "be am is are was were been being isn't aren't wasn't weren't i'm you're he's she's it's we're they're"),
  ...c("do", "do does did done doing don't doesn't didn't"),
  ...c("have", "have has had having haven't hasn't hadn't i've you've we've they've"),
  ...c("modal", "can can't cannot could couldn't will won't would wouldn't i'll you'll we'll let's"),
  ...c("conjunction", "and or but because so if than then"),
  ...c("preposition", "in on at to of for with from up down about into out over under after before"),
  ...c("polarity", "not no yes n't"),
  ...c("quantifier", "some any all both many much more most one two three four five six seven eight nine ten"),
  ...c("adverb-core", "here there now today very too also there's"),
  ...c("courtesy", "please sorry ok okay hello hi bye goodbye thanks thank"),
];
