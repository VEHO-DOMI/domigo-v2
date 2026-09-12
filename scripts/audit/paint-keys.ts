// CODEX DRAFT — NOT CANON · offline key audit uses live scene requests.
import fs from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import {GameTasksFileV2,GameTaskV2,PaintProof,renderTaskText} from "../../packages/content-schema/src/index.ts";
import type {SceneSnapshot} from "../../packages/game-paint/src/scene-v2.ts";
import {autoSolve} from "../../packages/game-paint/src/cards/machines.ts";
import {replayPhaseTape} from "../../packages/game-paint/src/tape.ts";
import type {PaintLevel} from "../../packages/game-paint/src/level.ts";
export interface PaintAuditInput { file: string; bytes: number | null; sha256: string | null }
export interface PaintKeyAudit { cards: number; observedScenes: number; sceneStimulusVisited: boolean; inputHash: string; inputs: PaintAuditInput[] }

export function auditPaintKeys(root:string):PaintKeyAudit {
  const inputs = new Map<string, PaintAuditInput>();
  const readInput = (file: string) => {
    const bytes = fs.readFileSync(file);
    inputs.set(path.relative(root, file).split(path.sep).join("/"), { file: path.relative(root, file).split(path.sep).join("/"), bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex") });
    return JSON.parse(bytes.toString("utf8"));
  };
  const dir=path.join(root,"content/corpus/stories/g1.st.lost-pages/paint");
  let cards=0,observedScenes=0,sceneStimulusVisited=false;
  for(const file of fs.readdirSync(dir).filter(f=>f.endsWith(".tasks.v2.json")).sort()){
    const items=GameTasksFileV2.parse(readInput(path.join(dir,file))).items;
    const views=new Map<string,SceneSnapshot>();
    const levelPath=path.join(dir,file.replace(".tasks.v2.json",".level.json")),proofPath=levelPath.replace(".level.json",".proof.json");
    if(!fs.existsSync(proofPath)){
      const file = path.relative(root, proofPath).split(path.sep).join("/");
      inputs.set(file, {file, bytes: null, sha256: null});
    }
    if(fs.existsSync(proofPath)){
      const level=readInput(levelPath) as PaintLevel;
      const proof=PaintProof.parse(readInput(proofPath));
      for(const [phase,tape] of Object.entries(proof.phases))replayPhaseTape(level,phase,tape,[],{tasks:items,cageHintShown:false,arenaBriefShown:false,pickedUp:[],onTask:req=>{
        if(req.sceneSnapshot&&"taskId"in req.ctx&&req.ctx.taskId)views.set(req.ctx.taskId,req.sceneSnapshot);
      }});
    }
    for(const task of items){
      const view=views.get(task.id);renderTaskText(task,view);
      if(autoSolve(task)!=="correct")throw new Error(`Paint key-defect: ${task.id}`);
      if(view){
        observedScenes++;
        // The alternative is exercised even while authored cards keep their
        // existing German text and entity stimulus during the art handoff.
        const probe=GameTaskV2.parse({...task,stimulus:{type:"scene",viewId:view.viewId,altDe:"Die beobachtete Szene."}});
        renderTaskText(probe,view);sceneStimulusVisited=true;
      }
      cards++;
    }
  }
  const manifest = [...inputs.values()].sort((a, b) => a.file < b.file ? -1 : a.file > b.file ? 1 : 0);
  const inputHash = createHash("sha256").update(JSON.stringify({schema: "paint-audit-inputs@1", inputs: manifest})).digest("hex");
  return {cards,observedScenes,sceneStimulusVisited,inputHash,inputs:manifest};
}
