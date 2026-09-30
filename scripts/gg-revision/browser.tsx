// CODEX DRAFT — NOT CANON. Private local harness; never included in solver packets.
import React from 'react';
import { createRoot } from 'react-dom/client';
import { PilotView } from './PilotView.tsx';
const data = await fetch('/private-data.json').then(r => r.json());
const id = new URLSearchParams(location.search).get('case');
const entry = data.entries.find((e: any) => e.itemId === id) ?? data.entries[0];
(window as any).revisionEvents = [];
createRoot(document.getElementById('root')!).render(<PilotView entry={entry} art={data.art[entry.chapter]} onEvent={(e: any) => (window as any).revisionEvents.push(e)}/>);
