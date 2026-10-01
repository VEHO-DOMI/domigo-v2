// CODEX DRAFT — NOT CANON. No browser or corpus loader.
import test from 'node:test';
import assert from 'node:assert/strict';
import { matchesRender } from './html-contract.mjs';

test('closed HTML contract preserves visible choices and complete accessible descriptions',()=>{
  const want='<main aria-label="Choose a colour"><button style="color:#fff;margin:0px 2px">pink</button><input value=""/></main>';
  const actual='<main aria-label="Choose a colour"><button style="color: rgb(255, 255, 255); margin: 0 2px;">pink</button><input value=""></main>';
  assert.equal(matchesRender(actual,want),true);
  for(const attack of [
    actual.replace('aria-label=', 'aria-description="pink" aria-label='),
    actual.replace('Choose a colour','Choose pink'),
    actual.replace('margin:', '--answer:pink; margin:'),
    actual.replace('<input','<input value="pink"'),
    actual.replace('pink</button>','blue</button>'),
    actual.replace('</main>','<!--pink--></main>'),
    actual.replace('<main ', '<main data-x="&#112;ink" '),
    actual.replace('<main ', '<main data-x=pink '),
  ]) assert.equal(matchesRender(attack,want),false,attack);
});
test('text separators/quoting and void spelling are harmless; missing nodes are not',()=>{
  assert.equal(matchesRender('<p title="a&amp;b">a<!-- -->b<br></p>',"<p title='a&#38;b'>ab<br/></p>"),true);
  assert.equal(matchesRender('<p>ab</p>','<p>ab<br/></p>'),false);
  assert.equal(matchesRender('<main><p></main>','<main><p></p></main>'),false);
});
