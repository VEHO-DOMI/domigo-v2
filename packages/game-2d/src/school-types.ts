export type SchoolLine = { speaker: string | null; de?: string; en?: string };
export type SchoolCard = {
  id: string; station: string; required: boolean; placeDe: string;
  situationDe: string; before: SchoolLine[]; prompt: string | null;
  input: { kind: "choice"; options: string[] } | { kind: "chips"; chips: string[] } | { kind: "text"; blanks: number };
  glosses: string[];
};
export type SchoolFeedback = { tier: "correct" | "wrong" | "close" | "partial"; explainDe: string; after: SchoolLine[]; revealEn: string | null };
export type SchoolView = {
  titleDe: string; cards: SchoolCard[]; intro: SchoolLine[]; ending: SchoolLine[];
  solved: string[]; recovered: Record<string, { after: SchoolLine[]; revealEn: string | null }>;
  preview: boolean;
};
