// CODEX DRAFT — NOT CANON · ordered observations, never expected totals.
import type {SimEvent,TaskRequest} from "./sim.ts";
import type {GameTaskV2} from "@domigo/content-schema";
import {renderTaskText} from "../../content-schema/src/game-tasks.ts";
import {requestedTask} from "./cards/routing.ts";
import {autoSolve} from "./cards/machines.ts";
export const evidenceKeys=["solvedTaskIds","sceneBeatsSeen","homeArrivals","hangEdges","rideCompletions","guardianRounds","deflects"] as const;
export type TapeEvidence={solvedTaskIds:string[];sceneBeatsSeen:string[];homeArrivals:string[];hangEdges:string[];rideCompletions:string[];guardianRounds:string[];deflects:number[]};
export const newTapeEvidence=():TapeEvidence=>({solvedTaskIds:[],sceneBeatsSeen:[],homeArrivals:[],hangEdges:[],rideCompletions:[],guardianRounds:[],deflects:[]});
export function observeEvidence(trace:TapeEvidence,ev:SimEvent):void {
  if(ev.type==="taskSolved")trace.solvedTaskIds.push(ev.taskId);
  if(ev.type==="sceneBeatSeen")trace.sceneBeatsSeen.push(`${ev.entityId}:${ev.beatId}:${ev.viewId}`);
  if(ev.type==="homeArrival")trace.homeArrivals.push(`${ev.entityId}:${ev.actorId}`);
  if(ev.type==="rideCompletion")trace.rideCompletions.push(ev.entityId);
  if(ev.type==="guardianRound")trace.guardianRounds.push(`${ev.entityId}:${ev.round}:${ev.actorId}`);
  if(ev.type==="deflect")trace.deflects.push(ev.projectileId);
}
/** The harness answers through the same card machine before crediting the world. */
export function solveTapeCard(tasks:readonly GameTaskV2[],req:TaskRequest,phase:string):void {
  const task=requestedTask(tasks,req,phase);
  if(!task)return; // unchanged legacy pool requests carry no bound identity
  renderTaskText(task,req.sceneSnapshot);
  if(autoSolve(task)!=="correct")throw new Error(`Tape task ${task.id} rejects its canonical answer`);
}
