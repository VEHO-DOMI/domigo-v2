import assert from 'node:assert/strict';
import { it } from 'node:test';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
it('visual network guard keeps the compiler clock live; frozen-clock tamper is rejected',()=>{
  const source=readFileSync(new URL('../../../../scripts/lib/visual/network-guard.cjs',import.meta.url),'utf8');
  function check(code:string){
    const sandbox={Date,fetch:async()=>null,console:{log(){},error(){}},Response,require:(id:string)=>{assert.equal(id,'node:net');return {Socket:{prototype:{connect(){}}}};}};
    const before=Date.now();runInNewContext(code,sandbox);const after=runInNewContext('Date.now()',sandbox);
    assert(after>=before&&after<=Date.now(),'VISUAL_COMPILER_CLOCK_LIVE');
  }
  check(source);assert.throws(()=>check(source+'\nglobalThis.Date=class extends Date{static now(){return 1792836000000;}};'),/VISUAL_COMPILER_CLOCK_LIVE/);
});
