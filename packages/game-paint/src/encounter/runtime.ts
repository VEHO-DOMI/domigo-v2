import { gradeGrammar } from "@domigo/engine";
import type { GrammarItem, PaintEncounter } from "@domigo/content-schema";

export type EncounterInput = { kind: "choice" | "text"; value: string };
export interface EncounterAttempt {
  clientAttemptId: string;
  itemId: string;
  mode: string;
  input: EncounterInput;
  latencyMs: number | null;
  hintUsed: boolean;
}
export interface EncounterReply {
  ok: boolean;
  queued: boolean;
  tier?: "correct" | "close" | "partial" | "wrong";
  xpAwarded?: number;
}
export interface EncounterConfirmation {
  localTier: "correct" | "close" | "partial" | "wrong";
  reply: EncounterReply;
}
export interface EncounterProgress {
  version: 1;
  revision: string;
  /** -4: introduction, -3..-1: models, 0..tasks.length: tasks/completion. */
  cursor: number;
  confirmed: EncounterConfirmation | null;
  pendingAttemptId: string | null;
  pendingAttempt: EncounterAttempt | null;
  worldEffects: string[];
  lastInput: string;
  hintUsed: boolean;
}
export const freshEncounterProgress = (revision: string): EncounterProgress => ({
  version: 1, revision, cursor: -4, confirmed: null, pendingAttemptId: null,
  pendingAttempt: null, worldEffects: [], lastInput: "", hintUsed: false,
});

export function canContinue(progress: EncounterProgress, preview: boolean): boolean {
  const confirmation = progress.confirmed;
  if (!confirmation || confirmation.localTier !== "correct") return false;
  const reply = confirmation.reply;
  // A queue receipt allows local story play, never a claim of awarded points.
  return preview || reply.queued || (reply.ok && reply.tier === "correct");
}

export function encounterFeedback(progress: EncounterProgress, preview: boolean): string {
  const c = progress.confirmed;
  if (!c) return "";
  if (!preview && !c.reply.ok && !c.reply.queued) return "Die Antwort ist noch nicht gespeichert. Versuche es noch einmal.";
  const tier = !preview && c.reply.ok && !c.reply.queued ? c.reply.tier : c.localTier;
  const message = tier === "correct"
    ? preview || c.reply.queued ? "Du kannst weitergehen." : "Richtig."
    : tier === "close" ? "Prüfe das Ortswort und seine Schreibweise."
    : tier === "partial" ? "Ergänze nur das fehlende Ortswort."
    : "Schau noch einmal auf das Buch und seinen Platz.";
  if (preview) return message;
  if (c.reply.queued) return `${message} Punkte folgen.`;
  // Only the acknowledged server reply can publish a score.
  if (c.reply.ok && typeof c.reply.xpAwarded === "number" && c.reply.xpAwarded > 0) {
    return `${message} +${c.reply.xpAwarded} Lernpunkte.`;
  }
  return message;
}

interface SessionOptions {
  encounter: PaintEncounter;
  grammarItems: GrammarItem[];
  initial: EncounterProgress;
  preview: boolean;
  /** Must persist synchronously, before onAttempt is invoked. */
  onProgress: (next: EncounterProgress) => boolean;
  onAttempt: (attempt: EncounterAttempt) => Promise<EncounterReply>;
  onChange: (next: EncounterProgress, busy: boolean, persisted: boolean) => void;
  uuid?: () => string;
  now?: () => number;
}

/** Network/storage-free controller. The app supplies persistence and transport. */
export class EncounterSession {
  progress: EncounterProgress;
  busy = false;
  persisted = true;
  private live = true;
  private options: SessionOptions;
  private startedAt: number;
  constructor(options: SessionOptions) {
    this.options = options;
    this.progress = options.initial;
    this.startedAt = this.now();
  }
  private now(): number { return (this.options.now ?? Date.now)(); }
  private publish(): void { if (this.live) this.options.onChange(this.progress, this.busy, this.persisted); }
  private commit(next: EncounterProgress): boolean {
    if (!this.live) return false;
    this.progress = next;
    try { this.persisted = this.options.onProgress(next); } catch { this.persisted = false; }
    this.publish();
    return this.persisted;
  }
  activate(): void { this.live = true; }
  dispose(): void { this.live = false; }
  setInput(value: string): void {
    if (this.busy || this.progress.confirmed || this.progress.pendingAttempt) return;
    this.commit({ ...this.progress, lastInput: value.slice(0, 32) });
  }
  useHint(): void { this.commit({ ...this.progress, hintUsed: true }); }
  beginNext(): void {
    if (this.progress.cursor >= 0) return;
    this.commit({ ...this.progress, cursor: this.progress.cursor + 1 });
    this.startedAt = this.now();
  }
  async submit(): Promise<void> {
    const task = this.options.encounter.tasks[this.progress.cursor];
    if (!this.live || this.busy || !task || !this.progress.lastInput.trim()) return;
    if (this.progress.confirmed && !this.progress.pendingAttempt) return;
    const grammar = this.options.grammarItems.find(item => item.id === task.corpusItem);
    if (!grammar) throw new Error(`Missing encounter corpus item: ${task.corpusItem}`);
    this.busy = true; // synchronous: a second click cannot create another UUID
    const attempt = this.progress.pendingAttempt ?? {
      clientAttemptId: (this.options.uuid ?? (() => crypto.randomUUID()))(),
      itemId: task.corpusItem,
      mode: "game:g1",
      input: { kind: task.kind === "choice" ? "choice" as const : "text" as const, value: this.progress.lastInput.trim() },
      latencyMs: Math.max(0, this.now() - this.startedAt),
      hintUsed: this.progress.hintUsed,
    };
    const stored = this.commit({ ...this.progress, pendingAttemptId: attempt.clientAttemptId, pendingAttempt: attempt });
    // Without a recoverable identity, a lost acknowledgement could book twice.
    if (!stored && !this.options.preview) { this.busy = false; this.publish(); return; }
    const localTier = gradeGrammar(grammar, attempt.input).tier;
    let reply: EncounterReply;
    try { reply = await this.options.onAttempt(attempt); }
    catch { reply = { ok: false, queued: false }; }
    if (!this.live) return;
    this.busy = false;
    this.commit({
      ...this.progress,
      confirmed: { localTier, reply },
      pendingAttemptId: reply.ok ? null : attempt.clientAttemptId,
      pendingAttempt: reply.ok ? null : attempt,
    });
  }
  retry(): void {
    if (this.busy || !this.progress.confirmed) return;
    const reply = this.progress.confirmed.reply;
    // Unknown delivery must reconcile the original payload, never mint a retry.
    if (!reply.ok && !reply.queued) return;
    this.commit({ ...this.progress, confirmed: null, pendingAttemptId: null, pendingAttempt: null, lastInput: "" });
    this.startedAt = this.now();
  }
  advance(taskId: string): void {
    const task = this.options.encounter.tasks[this.progress.cursor];
    if (this.busy || task?.id !== taskId || !canContinue(this.progress, this.options.preview)) return;
    this.commit({
      ...this.progress,
      cursor: this.progress.cursor + 1,
      // Transition and effects are ONE persisted snapshot; a repeated click is inert.
      worldEffects: [...new Set([...this.progress.worldEffects, ...task.worldEffects])],
      confirmed: null, pendingAttemptId: null, pendingAttempt: null,
      lastInput: "", hintUsed: false,
    });
    this.startedAt = this.now();
  }
}
