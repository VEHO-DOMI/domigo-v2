// CODEX DRAFT — NOT CANON · optional evidence preserves legacy proof files.
import { z } from "zod";
const count=z.number().int().nonnegative();
const ids=z.array(z.string().min(1));
export const TapeExpectSchema=z.object({
  solvedTaskIds:ids.optional(),sceneBeatsSeen:ids.optional(),homeArrivals:ids.optional(),hangEdges:ids.optional(),
  rideCompletions:ids.optional(),guardianRounds:ids.optional(),deflects:z.array(count).optional(),
  lettersGot:count.optional(),lettersTotal:count.optional(),exitTo:z.string().optional(),cagesFreed:count.optional(),
  guardianDown:z.boolean().optional(),tasksSolved:count.optional(),redeemedPresent:z.boolean().optional(),
  classmatesAwake:count.optional(),tipsGot:count.optional(),booksGot:count.optional(),clothGot:count.optional(),scorePageShown:z.boolean().optional(),
  guardianPathsFlown:count.optional(),guardianTelegraphs:count.optional(),guardianWindows:count.optional(),
  guardianWroteLow:z.boolean().optional(),guardianConsoled:z.boolean().optional(),guardianLanded:z.boolean().optional(),
}).strict();
export const PaintProof=z.object({
  schema:z.literal("paintProof@1"),level:z.string().min(1),
  phases:z.record(z.string(),z.object({abilities:z.array(z.enum(["jump","run","hang","punch","swing","hover"])),
    pads:z.array(z.tuple([z.number().int().positive(),z.number().int().min(0).max(63)])),expect:TapeExpectSchema.optional()})),
});
