// Preloaded only in the temporary local Next process. No remote connection.
const net = require('node:net');
const allowed = host => !host || ['localhost','127.0.0.1','::1','[::1]'].includes(host);
const connect = net.Socket.prototype.connect;
net.Socket.prototype.connect = function (...args) {
  const list=Array.isArray(args[0])?args[0]:args; const a=list[0];
  const host = typeof a === 'object' ? a.host : typeof list[1] === 'string' ? list[1] : undefined;
  if (!allowed(host)) { console.error('VISUAL_FORBIDDEN_NETWORK'); throw Error('VISUAL_FORBIDDEN_NETWORK'); }
  return connect.apply(this,args);
};

const originalFetch=globalThis.fetch;
globalThis.fetch=async (input, init)=>{const url=new URL(typeof input==='string'||input instanceof URL?input:input.url);if(url.href==='https://registry.npmjs.org/-/package/next/dist-tags'){console.log('VISUAL_SKIPPED_VERSION_PROBE');return new Response(null,{status:503});}if(!allowed(url.hostname)){console.error('VISUAL_FORBIDDEN_NETWORK');throw Error('VISUAL_FORBIDDEN_NETWORK');}return originalFetch(input,init);};
const RealDate=Date;globalThis.Date=class extends RealDate{constructor(...a){super(...(a.length?a:['2026-10-24T10:00:00.000Z']));}static now(){return 1792836000000;}static parse(s){return RealDate.parse(s);}static UTC(...a){return RealDate.UTC(...a);}};
