// CODEX DRAFT — NOT CANON · a required place is an ID, never a pool index.
import type { TaskSequenceV2Spec } from "../../content-schema/src/paint-zoo.ts";
export const nextRequiredTask = (sequence: TaskSequenceV2Spec, solved: ReadonlySet<string>): string | undefined => sequence.requiredIds.find(id=>!solved.has(id));
export const optionalSequenceSlots = (sequence: TaskSequenceV2Spec): { taskId:string; slotId:string }[] => [
  ...sequence.variantIds.map(taskId=>({taskId,slotId:`variant:${taskId}`})),
  ...(sequence.reserveSlots??[]).map(s=>({taskId:s.taskId,slotId:s.slotId})),
];
export const sequenceRequest = (sequence: TaskSequenceV2Spec, solved: ReadonlySet<string>, optionalCursor=0): {taskId:string;optionalSlotId?:string}|undefined => {
  const required=nextRequiredTask(sequence,solved);
  if(required)return {taskId:required};
  const slots=optionalSequenceSlots(sequence), slot=slots[optionalCursor%slots.length];
  return slot?{taskId:slot.taskId,optionalSlotId:slot.slotId}:undefined;
};
