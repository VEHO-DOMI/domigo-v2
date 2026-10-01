// CODEX DRAFT — NOT CANON. Trusted expectation, never loaded from a solver packet.
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { restoreMachine } from '../../packages/game-paint/src/cards/machines.ts';
import { CardShell } from '../../packages/game-paint/src/cards/CardShell.tsx';
import { RestoreCard } from '../../packages/game-paint/src/cards/skins.tsx';
import { PilotFrame, PilotView } from './PilotView.tsx';
import { digest } from './core.mjs';
import { pageShell, neutralizeAssets, publicId } from './solver-packet.mjs';

const noop = () => {};
export function restoreTransition(entry: any, art: any, action: any) {
  const before = restoreMachine.init(entry.item);
  if (digest(action) !== digest({pickName: before.name})) throw new Error('STATE:NAME_ACTION');
  const after = restoreMachine.act(before, action);
  if (before.step !== 'name' || after.step !== 'colour' || restoreMachine.grade(after) !== 'pending') {
    throw new Error('STATE:TRANSITION');
  }
  // Run the shipped reducer and render its resulting state using the shipped
  // skin and shell. CardHost's event wiring is checked later in the real browser.
  const html = renderToStaticMarkup(<PilotFrame entry={entry}>
    <div style={{position:'relative',height:700}}>
      <CardShell task={entry.item} attempts={0} clockMs={0} art={art}
        actStep={after.step} colourAskDe={after.colourAskDe} onDismiss={noop}>
        <RestoreCard state={after} dispatch={noop}/>
      </CardShell>
    </div>
  </PilotFrame>);
  return {before, after, html};
}

/** Call with freshly loaded entries/art, not private-data.json from an untrusted packet. */
export function renderContract(entries: any[], art: Record<string, any>, assets: any[], rendererSha256: string, basis: string) {
  const pages: Record<string, string> = {}, transitions: Record<string, any> = {};
  for (const [i, entry] of entries.entries()) {
    const id = publicId(i), paint = art[entry.chapter];
    const html = renderToStaticMarkup(<PilotView entry={entry} art={paint}/>);
    pages[id+'.html'] = pageShell(neutralizeAssets(html, assets));
    if (entry.kind === 'paint' && entry.item.kind === 'restore') {
      const action = {pickName: entry.item.name};
      const result = restoreTransition(entry, paint, action);
      // Browser captures main.outerHTML, without React's server preload hints.
      const main = result.html.slice(result.html.indexOf('<main'));
      pages[id+'-s01.html'] = pageShell(neutralizeAssets(main, assets));
      transitions[id] = {action, before: neutralizeAssets(html.slice(html.indexOf('<main')), assets),
        after: neutralizeAssets(main, assets), beforeState: digest(result.before), afterState: digest(result.after)};
    }
  }
  return {rendererSha256, basis, pages, transitions};
}
