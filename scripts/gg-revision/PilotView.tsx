// CODEX DRAFT — NOT CANON. Real shipped renderers; isolated local fixtures.
import React from 'react';
import { GrammarItemView, VocabItemView } from '../../packages/task-ui/src/index.tsx';
import { CardHost } from '../../packages/game-paint/src/cards/CardHost.tsx';

export function PilotView({ entry, art, onEvent = () => {} }: any) {
  return <main data-grade={entry.unit[1]} style={{maxWidth:760, margin:'0 auto', padding:16}}>
    <p style={{fontSize:12}}>CODEX DRAFT — NOT CANON · {entry.unit} · {entry.kind === 'transfer' ? 'Transferentwurf' : 'isolierte Originalansicht'}</p>
    {entry.context?.map((scene: any) => <p key={scene.id} style={{fontSize:18,lineHeight:1.6}}>{scene.textEn}</p>)}
    {entry.pair && <aside style={{background:'var(--bg-raised)',padding:16,borderRadius:12,marginBottom:20}}>
      <p>✗ {entry.pair.wrong}</p><p>✓ {entry.pair.right}</p><p>{entry.pair.explanation}</p>
    </aside>}
    {entry.kind === 'paint' ? <div style={{position:'relative',height:700}}><CardHost task={entry.item} art={art} clockMs={0} onResolve={() => onEvent('resolved')} onDismiss={() => onEvent('dismissed')} onGrade={(value: any) => onEvent({grade:value})}/></div>
      : entry.kind === 'vocab' ? <VocabItemView item={entry.item} pool={entry.pool} onResult={(tier: any,detail: any) => onEvent({tier,detail})}/>
      : <GrammarItemView item={entry.item} tactile onResult={(tier: any,detail: any) => onEvent({tier,detail})}/>}
  </main>;
}
