import { PNG } from 'pngjs';
function luminance(rgb) {
  return rgb.map(n => { n /= 255; return n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4; }).reduce((sum, n, i) => sum + n * [.2126, .7152, .0722][i], 0);
}
async function measure(page, extraControls = "") {
  const geometry = await page.evaluate((extraControls) => {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d');
    const text = [], excluded = [];
    const modal = document.querySelector('dialog[open]');
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let node; (node = walker.nextNode());) {
      const e = node.parentElement, cs = getComputedStyle(e), label = node.textContent.trim();
      if ((modal && !modal.contains(e)) || !label || !e.getClientRects().length || !e.checkVisibility({visibilityProperty:true}) || cs.visibility === 'hidden' || parseFloat(cs.fontSize) === 0 || e.closest('[aria-hidden="true"],.activity-sr,.og-sr-only')) continue;
      if (e.closest('.og-wordmark,button:disabled') || !/[\p{L}\p{N}✓×]/u.test(label)) { excluded.push(label); continue; }
      ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = cs.color; ctx.fillRect(0, 0, 1, 1);
      const colour = Array.from(ctx.getImageData(0, 0, 1, 1).data);
      let opacity = colour[3] / 255;
      for (let p = e; p; p = p.parentElement) opacity *= Number(getComputedStyle(p).opacity);
      const range = document.createRange(); range.selectNodeContents(node);
      const rects = [...range.getClientRects()].map(r => {
        let left=r.left,top=r.top,right=r.right,bottom=r.bottom;
        for(let parent=e;parent;parent=parent.parentElement){
          const style=getComputedStyle(parent), box=parent.getBoundingClientRect();
          if(/hidden|clip|auto|scroll/.test(style.overflowX)){left=Math.max(left,box.left+parent.clientLeft);right=Math.min(right,box.left+parent.clientLeft+parent.clientWidth);}
          if(/hidden|clip|auto|scroll/.test(style.overflowY)){top=Math.max(top,box.top+parent.clientTop);bottom=Math.min(bottom,box.top+parent.clientTop+parent.clientHeight);}
        }
        return {x:left+scrollX,y:top+scrollY,width:Math.max(0,right-left),height:Math.max(0,bottom-top)};
      }).filter(r=>r.width>0&&r.height>0);
      if(!rects.length) continue;
      const size = parseFloat(cs.fontSize), weight = parseInt(cs.fontWeight) || 400;
      text.push({ label, selector: e.className, colour: colour.slice(0, 3), opacity, rects, minimum: size >= 24 || size >= 18.667 && weight >= 700 ? 3 : 4.5 });
    }
    const controls = [...document.querySelectorAll('.og-language button' + (extraControls ? ',' + extraControls : ''))].filter(e => !modal || modal.contains(e)).map(e => { const r = e.getBoundingClientRect(); const style = getComputedStyle(e); ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = style.borderTopColor; ctx.fillRect(0, 0, 1, 1); const stroke = Array.from(ctx.getImageData(0, 0, 1, 1).data); if (!parseFloat(style.borderTopWidth)) stroke[3] = 0; return { kind: e.matches('.arena-block') ? 'graphic' : 'control', label: e.textContent.trim() || e.getAttribute('aria-label'), x: r.x + r.width / 2 + scrollX, y: r.y + scrollY, stroke }; });
    return { controls, overflow: document.documentElement.scrollWidth > innerWidth, targets: [...document.querySelectorAll('button,a,input,select,textarea,summary,[role=button]')].filter(e => e.getClientRects().length && e.checkVisibility({visibilityProperty:true}) && (!modal || modal.contains(e))).map(e => { const target = e.matches('input[type=checkbox],input[type=radio]') ? e.closest('label') ?? e : e; const r = target.getBoundingClientRect(); return { label: target.textContent.trim(), width: r.width, height: r.height }; }), text, excluded };
  }, extraControls);
  const hide = await page.addStyleTag({ content: '* { color:transparent!important; -webkit-text-fill-color:transparent!important; text-shadow:none!important; } .og-wordmark { visibility:hidden!important; }' });
  const png = PNG.sync.read(await page.screenshot({ fullPage: true, animations: 'disabled' }));
  await hide.evaluate(e => e.remove());
  const contrast = geometry.text.map(t => {
    let ratio = Infinity, pixels = 0;
    for (const r of t.rects) for (let y = Math.max(0, Math.ceil(r.y)); y < Math.min(png.height, Math.floor(r.y + r.height)); y++) for (let x = Math.max(0, Math.ceil(r.x)); x < Math.min(png.width, Math.floor(r.x + r.width)); x++) {
      const at = (y * png.width + x) * 4, bg = [...png.data.subarray(at, at + 3)];
      const fg = t.colour.map((n, i) => n * t.opacity + bg[i] * (1 - t.opacity));
      const a = luminance(fg), b = luminance(bg);
      ratio = Math.min(ratio, (Math.max(a, b) + .05) / (Math.min(a, b) + .05)); pixels++;
    }
    return { label: t.label, selector: t.selector, ratio: Math.round(ratio * 1000) / 1000, minimum: t.minimum, pass: pixels > 0 && ratio >= t.minimum };
  });
  const { text: _text, ...rest } = geometry;
  const pixel = (x, y) => { const at = (Math.floor(y) * png.width + Math.floor(x)) * 4; return [...png.data.subarray(at, at + 3)]; };
  const controls = geometry.controls.map(c => {
    const outside = pixel(c.x, c.y - 2), inside = pixel(c.x, c.y + 3);
    // Use the resolved border colour, not an anti-aliased fractional pixel.
    // WCAG contrast concerns colour pairs; raster smoothing must not distort it.
    const edge = c.stroke.slice(0, 3).map((n, i) => n * c.stroke[3] / 255 + inside[i] * (1 - c.stroke[3] / 255));
    const pair = (a, b) => (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05);
    const ratio = Math.max(Math.min(pair(edge, outside), pair(edge, inside)), pair(inside, outside));
    return { kind: c.kind, label: c.label, ratio: Math.round(ratio * 1000) / 1000, pass: ratio >= 3 };
  });
  return { ...rest, contrast, controls: controls.filter(c => c.kind === 'control'), graphics: controls.filter(c => c.kind === 'graphic') };
}
function violations(record) {
  return [...(record.overflow ? ['horizontal overflow'] : []), ...record.graphics.filter(c => !c.pass).map(c => `graphic ${c.label}: ${c.ratio}/3`), ...record.controls.filter(c => !c.pass).map(c => `control ${c.label}: ${c.ratio}/3`), ...record.targets.filter(t => t.width < 43.99 || t.height < 43.99).map(t => `target ${t.label}: ${t.width}×${t.height}`), ...record.contrast.filter(c => !c.pass).map(c => `contrast ${c.label}: ${c.ratio}/${c.minimum}`)];
}

export { measure, violations };
