// CODEX DRAFT — NOT CANON. Closed render contract, not an HTML sanitizer.
// Every element, text node, attribute name AND value must equal the trusted
// render. Unsupported syntax fails closed; no arbitrary data/ARIA attributes.
import { digest } from './core.mjs';

const decode = value => value.replace(/&#(x[\da-f]+|\d+);|&(amp|quot|apos|lt|gt|nbsp);/gi,
  (_, number, named) => number ? String.fromCodePoint(number[0].toLowerCase() === 'x' ? parseInt(number.slice(1),16) : Number(number))
    : ({amp:'&',quot:'"',apos:"'",lt:'<',gt:'>',nbsp:'\u00a0'})[named.toLowerCase()]);
const voids = new Set(['meta','link','input','img','br','hr','wbr','area','base','col','embed','param','source','track']);

function style(value) {
  // Only CSSOM's harmless spelling changes are normalized. Declarations and
  // strings remain present and ordered; comments/escapes are never discarded.
  if (/\/\*|\\/.test(value)) throw new Error('STYLE:UNSUPPORTED');
  return value.trim().replace(/;\s*$/, '').split(/("[^"]*"|'[^']*')/).map((part,i) => i%2 ? part : part
    .replace(/#[\da-f]{6}\b/gi, x => x.toLowerCase())
    .replace(/#([\da-f])([\da-f])([\da-f])\b/gi, (_,a,b,c) => `#${a+a}${b+b}${c+c}`.toLowerCase())
    .replace(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/gi, (_,r,g,b) => '#'+[r,g,b].map(x=>Number(x).toString(16).padStart(2,'0')).join(''))
    .replace(/(?<![\w.-])0px\b/g,'0')
    .replace(/\s+/g,' ').replace(/\s*([:;,()])\s*/g,'$1').trim()).join('');
}

export function htmlShape(html) {
  const result = [], stack = [];
  let pos = 0;
  const appendText = value => {
    if (!value) return;
    const text = decode(value), last = result.at(-1);
    if (last?.[0] === 'text') last[1] += text;
    else result.push(['text',text]);
  };
  while (pos < html.length) {
    if (html[pos] !== '<') {
      const end = html.indexOf('<',pos); appendText(html.slice(pos,end<0?html.length:end)); pos=end<0?html.length:end; continue;
    }
    if (html.startsWith('<!-- -->',pos) || html.startsWith('<!---->',pos)) { pos += html.startsWith('<!-- -->',pos)?8:7; continue; }
    const doctype = /^<!doctype html>/i.exec(html.slice(pos));
    if (doctype) { result.push(['doctype']); pos+=doctype[0].length; continue; }
    const close = /^<\/([a-z][\w-]*)\s*>/i.exec(html.slice(pos));
    if (close) {
      const name=close[1].toLowerCase();
      if (stack.pop() !== name) throw new Error('HTML:NESTING');
      result.push(['close',name]); pos+=close[0].length; continue;
    }
    const open = /^<([a-z][\w-]*)/i.exec(html.slice(pos));
    if (!open) throw new Error('HTML:SYNTAX');
    const name=open[1].toLowerCase(), attrs=[]; pos+=open[0].length;
    while (!/^\s*\/?>/.test(html.slice(pos))) {
      const attr=/^\s+([a-z_:][\w:.-]*)(?:\s*=\s*("[^"]*"|'[^']*'))?/i.exec(html.slice(pos));
      if (!attr) throw new Error('HTML:ATTRIBUTE_SYNTAX');
      const key=attr[1].toLowerCase();
      if (attrs.some(([k])=>k===key)) throw new Error('HTML:DUPLICATE_ATTRIBUTE');
      const value=decode(attr[2]?.slice(1,-1)??'');
      attrs.push([key,key==='style'?style(value):value]); pos+=attr[0].length;
    }
    const end=/^\s*(\/?)>/.exec(html.slice(pos)); pos+=end[0].length;
    result.push(['open',name,attrs.sort(([a],[b])=>a.localeCompare(b))]);
    if (!voids.has(name)) {
      if (end[1]) {
        if (name !== 'svg' && !stack.includes('svg')) throw new Error('HTML:NONVOID_SELF_CLOSE');
        result.push(['close',name]);
      } else stack.push(name);
    }
  }
  if (stack.length) throw new Error('HTML:UNCLOSED');
  return result;
}

export function matchesRender(actual, expected) {
  if (typeof actual !== 'string' || typeof expected !== 'string') return false;
  try { return digest(htmlShape(actual)) === digest(htmlShape(expected)); }
  catch { return false; }
}
