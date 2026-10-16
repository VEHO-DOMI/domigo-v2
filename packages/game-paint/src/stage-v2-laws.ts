// CODEX DRAFT — NOT CANON · executable scene contracts also apply to drafts.
import { StageV2, SequenceTransfer, ZooGuardian, ZooRide, TaskSequenceV2 } from "../../content-schema/src/paint-zoo.ts";
import type { PaintLevel, LawFailure } from "./level.ts";
import { glyphAt, isSolid } from "./collide.ts";

export const stageV2LawErrors = (level: PaintLevel): LawFailure[] => {
  const failures: LawFailure[]=[];
  for(const ph of [...level.phases,...level.arena?[level.arena]:[],...level.bonus?[level.bonus]:[]]) {
    const fail=(id:string,detail:string)=>failures.push({phase:ph.id,law:"stage-v2-script",detail:`${id}: ${detail}`});
    const ids=new Set(ph.entities.map(e=>e.id));
    const flags=new Set(ids);
    for(const e of ph.entities) {
      for(const g of e.params?.stageV2?.groups??[]) flags.add(g.id);
      if(e.params?.onSequenceComplete) flags.add(e.params.onSequenceComplete.arrivalFlag);
      for(const b of e.params?.stageV2?.beats??[]) for(const p of b.afterSolve) if(p.arrivalFlag) flags.add(p.arrivalFlag);
    }
    const inside=(p:{c:number;r:number})=>p.c>=0&&p.c<(ph.rows[0]?.length??0)&&p.r>=0&&p.r<ph.rows.length;
    for(const e of ph.entities) {
      for(const [key,schema] of Object.entries({stageV2:StageV2,onSequenceComplete:SequenceTransfer,guardian:ZooGuardian,ride:ZooRide,taskSequenceV2:TaskSequenceV2})) {
        if(e.params?.[key]!==undefined) {
          const parsed=schema.safeParse(e.params[key]);
          if(!parsed.success) fail(e.id,`${key}: ${parsed.error.issues.map(i=>i.path.join('.')+' '+i.message).join('; ')}`);
        }
      }
      const s=e.params?.stageV2;
      if(s && StageV2.safeParse(s).success) {
        for(const [label,list] of [["actor",s.actors],["prop",s.props],["group",s.groups],["beat",s.beats]] as const) {
          if(new Set(list.map(a=>a.id)).size!==list.length) fail(e.id,`duplicate ${label} identity`);
        }
        const actors=new Set(s.actors.map(a=>a.id)), props=new Set(s.props.map(a=>a.id));
        const groups=new Set(s.groups.map(g=>g.id));
        for(const id of actors) if(props.has(id)) fail(e.id,`actor/prop identity collision ${id}`);
        for(const g of s.groups) {
          if(!inside(g.activate)||!inside(g.observer)) fail(e.id,`observer ${g.id} outside the room`);
          const below=glyphAt(ph.rows,g.observer.c,g.observer.r+1), body=glyphAt(ph.rows,g.observer.c,g.observer.r);
          if((!isSolid(below)&&below!=="="&&below!=="~")||isSolid(body)||body==="w") fail(e.id,`observer ${g.id} has no safe floor`);
          for(const f of g.requires) if(!flags.has(f)||f===g.id) fail(e.id,`group ${g.id} requires unknown/self flag ${f}`);
        }
        for(const a of s.actors) if(a.attachTo && (!actors.has(a.attachTo.actorId)||a.id===a.attachTo.actorId||a.attachTo.socket!=="back")) fail(e.id,`invalid attachment ${a.id}`);
        for(const b of s.beats) {
          if(!groups.has(b.groupId)) fail(e.id,`beat ${b.id} has no group`);
          for(const p of [...b.targetPositions,...b.afterSolve]) if(!actors.has(p.actorId)) fail(e.id,`beat ${b.id} uses missing actor ${p.actorId}`);
          for(const r of b.relations) if(!actors.has(r.actorId)||(!props.has(r.propId)&&!actors.has(r.propId))) fail(e.id,`beat ${b.id} has an unknown relation endpoint`);
          for(const p of b.afterSolve) for(const point of p.worldWaypoints??[]) if(!inside(point)) fail(e.id,`beat ${b.id} leaves the room`);
          for(const a of [...Object.keys(b.countByActor??{}),...Object.keys(b.emotionByActor??{})]) if(!actors.has(a)) fail(e.id,`beat ${b.id} describes missing actor ${a}`);
          if(b.taskIds.some(id=>![...(e.params?.taskSequenceV2?.requiredIds??[]),...(e.params?.taskSequenceV2?.variantIds??[])].includes(id))) fail(e.id,`beat ${b.id} contains a card outside its sequence`);
        }
        for(const id of [...e.params?.taskSequenceV2?.requiredIds??[],...e.params?.taskSequenceV2?.variantIds??[]]) {
          if(s.beats.filter(b=>b.taskIds.includes(id)).length!==1) fail(e.id,`card ${id} must belong to exactly one beat`);
        }
        const boss=e.params?.guardian;
        if(boss) {
          for(const round of boss.rounds) if(!actors.has(round.homeActorId)||!groups.has(round.sceneId)||round.taskIds.some(id=>!s.beats.some(b=>b.groupId===round.sceneId&&b.taskIds.includes(id)))) fail(e.id,"round has the wrong home actor/group/cards");
          const sign=s.props.find(p=>p.id===boss.evidencePropId);
          if(!sign?.canvas||!sign.innerRect||!sign.worldAnchor||sign.innerRect.x+sign.innerRect.width>sign.canvas.widthPx||sign.innerRect.y+sign.innerRect.height>sign.canvas.heightPx) fail(e.id,"evidence sign has no valid registered surface");
        }
      }
      const transfer=e.params?.onSequenceComplete;
      if(transfer && SequenceTransfer.safeParse(transfer).success) {
        const target=ph.entities.find(t=>t.id===transfer.target.entityId);
        if(!target||target.id===e.id) fail(e.id,"transfer has no distinct target owner");
        if(transfer.target.actorId&&!target?.params?.stageV2?.actors.some(a=>a.id===transfer.target.actorId)) fail(e.id,"transfer target actor does not exist");
        if(transfer.waypoints.some(p=>!inside(p))) fail(e.id,"transfer path leaves the room");
      }
      for(const required of e.params?.ride?.requires??[]) if(!flags.has(required)) fail(e.id,`ride requires unknown flag ${required}`);
    }
    for(const id of ph.exitRequires?.sequences??[]) if(!ph.entities.find(e=>e.id===id)?.params?.taskSequenceV2) fail(id,"exit requires a missing sequence");
    for(const id of ph.exitRequires?.rides??[]) if(!ph.entities.find(e=>e.id===id)?.params?.ride) fail(id,"exit requires a missing ride");
  }
  return failures;
};
