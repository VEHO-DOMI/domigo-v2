import type { VocabItem } from "@domigo/content-schema";
import type { Tier, VocabPool } from "@domigo/engine";
import type { AttemptResult } from "../attempt-outbox.ts";
export type ModeInput = { kind: "choice"; value: string } | { kind: "vocab"; value: string; pool: VocabPool };
export type ModeReply = AttemptResult & { tier?: Tier };
export type SubmitWord = (item: VocabItem, input: ModeInput, hintUsed?: boolean) => Promise<ModeReply>;
export interface ModeSummary { label: string; value: string }
export interface GameProps { words: VocabItem[]; grade: number; submit: SubmitWord; finish: (summary?: ModeSummary[]) => void }
