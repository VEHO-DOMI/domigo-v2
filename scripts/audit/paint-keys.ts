// CODEX DRAFT — NOT CANON · offline key audit uses live scene requests.
import fs from "node:fs";
import path from "node:path";
import {GameTasksFileV2,GameTaskV2,PaintProof,renderTaskText} from "../../packages/content-schema/src/index.ts";
import type {SceneSnapshot} from "../../packages/game-paint/src/scene-v2.ts";
import {autoSolve} from "../../packages/game-paint/src/cards/machines.ts";
import {replayPhaseTape} from "../../packages/game-paint/src/tape.ts";
import type {PaintLevel} from "../../packages/game-paint/src/level.ts";
export function auditPaintKeys(root:string):{cards:number;observedScenes:number;sceneStimulusVisited:boolean} {
  const dir=path.join(root,"content/corpus/stories/g1.st.lost-pages/paint");
  let cards=0,observedScenes=0,sceneStimulusVisited=false;
  for(const file of fs.readdirSync(dir).filter(f=>f.endsWith(".tasks.v2.json"))){
    const items=GameTasksFileV2.parse(JSON.parse(fs.readFileSync(path.join(dir,file),"utf8"))).items;
    const views=new Map<string,SceneSnapshot>();
    const levelPath=path.join(dir,file.replace(".tasks.v2.json",".level.json")),proofPath=levelPath.replace(".level.json",".proof.json");
    if(fs.existsSync(proofPath)){
      const level=JSON.parse(fs.readFileSync(levelPath,"utf8")) as PaintLevel;
      const proof=PaintProof.parse(JSON.parse(fs.readFileSync(proofPath,"utf8")));
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
  return {cards,observedScenes,sceneStimulusVisited};
}
