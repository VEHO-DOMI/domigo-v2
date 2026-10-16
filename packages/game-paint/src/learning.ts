// CODEX DRAFT — NOT CANON · serializable chapter state, shared across room mounts.
import type { EntityState } from "./entities.ts";
export interface TransferState {
  id: string; sourceId: string; targetId: string; actorId?: string; skin: string;
  points: {x:number;y:number}[]; tick: number; ticks: number; arrivalFlag: string; x: number; y: number;
}
export interface ChapterLearningState {
  solvedTaskIds: string[]; completedSequences: string[]; completedRides: string[]; flags: string[];
  entities: Record<string,EntityState>; transfers: TransferState[]; optionalCursors: Record<string,number>;
}
export const newChapterLearning = (): ChapterLearningState => ({ solvedTaskIds:[],completedSequences:[],completedRides:[],flags:[],entities:{},transfers:[],optionalCursors:{} });
