// CODEX DRAFT — NOT CANON. One small shipped reducer/renderer; no corpus load.
import test from 'node:test';
import assert from 'node:assert/strict';
import { restoreTransition, renderContract } from './render-contract.tsx';
import { matchesRender } from './html-contract.mjs';

const entry={unit:'g1-u01',kind:'paint',chapter:'ch01',context:null,itemId:'restore-fixture',item:{
  id:'restore-fixture',kind:'restore',use:'encounter',stimulus:{type:'entity',showsDe:'Ein Gegenstand.'},
  storyDe:'Sag den Namen auf Englisch.',hints:{deDesc:'Eine Beschreibung.',deWord:'Ein Buch.'},
  form:'name-it',nameOptions:['book','pen','hat'],name:'book',
  colourAskDe:'Das Buch war blau.',colourOptions:['red','blue','green'],colour:'blue',
}};

test('S4: real reducer reaches pending colour; real skin renders its choices and question',()=>{
  const {before,after,html}=restoreTransition(entry,{}, {pickName:'book'});
  assert.equal(before.step,'name');assert.equal(after.step,'colour');assert.equal(after.result,'pending');
  assert.ok(html.includes('2 · die Farbe')); assert.ok(html.includes('Das Buch war blau.'));
  assert.ok(!html.includes('1 · der Name'));
  for(const colour of ['red','blue','green'])assert.ok(html.includes(colour));
  assert.throws(()=>restoreTransition(entry,{}, {pickName:'pen'}),/STATE:NAME_ACTION/);
  assert.throws(()=>restoreTransition(entry,{}, {pickColour:'blue'}),/STATE:NAME_ACTION/);
});
test('S4: initial, altered initial, forged step caption and altered colour question cannot stand for follow-state',()=>{
  const contract=renderContract([entry],{ch01:{}},[],'2'.repeat(64),'1'.repeat(40));
  const initial=contract.pages['p001.html'],colour=contract.pages['p001-s01.html'];
  for(const bad of [initial,initial.replace('1 · der Name','2 · die Farbe'),initial.replace('</main>','<p>extra</p></main>'),colour.replace('Das Buch war blau.','Das Buch war rot.')]) {
    assert.equal(matchesRender(bad,colour),false);
  }
  assert.equal(matchesRender(colour,colour),true); // identity only, not independent browser evidence
});
