"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import { CH01_COMIC } from "./ch01-story.ts";
import { LETTER_STYLE } from "../letters.ts";

/** A reading surface: motion never advances text or determines completion. */
export function StoryComic({ art, onDone, onSkip }: {
  art: Record<string, string>;
  onDone: () => void;
  onSkip: () => void;
}): React.ReactElement {
  const [page, setPage] = useState(0);
  const goldId = useId();
  const host = useRef<HTMLDivElement>(null);
  const panel = CH01_COMIC[page]!;
  const last = page === CH01_COMIC.length - 1;
  useEffect(() => { host.current?.focus(); }, []);
  const forward = (): void => { if (last) onDone(); else setPage(page + 1); };
  return (
    <div className="pb-comic-veil" role="dialog" aria-modal="true" aria-label="Die Geschichte beginnt"
      ref={host} tabIndex={-1} onKeyDown={(event) => {
        if (event.key === "ArrowRight") { event.preventDefault(); forward(); }
        if (event.key === "ArrowLeft") { event.preventDefault(); setPage(Math.max(0, page - 1)); }
        if (event.key === "Tab") {
          const buttons = host.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)");
          const first = buttons?.[0]; const end = buttons?.[buttons.length - 1];
          if (event.shiftKey && (document.activeElement === first || document.activeElement === host.current)) { event.preventDefault(); end?.focus(); }
          else if (!event.shiftKey && document.activeElement === end) { event.preventDefault(); first?.focus(); }
        }
      }}>
      <style>{COMIC_CSS}</style>
      <section className="pb-comic-book">
        <header className="pb-comic-heading">
          <span>Wie alles angefangen hat</span>
          <button type="button" onClick={onSkip}>Geschichte überspringen</button>
        </header>
        <div className="pb-comic-shot" key={panel.id} data-motion={panel.motion}>
          <div className="pb-comic-picture">
            <div className="pb-comic-art">
              <img src={art[panel.stem]} alt={panel.sceneDe} className="pb-comic-paint" />
              {panel.id === "first-step" && <svg className="pb-comic-letters" viewBox="0 0 1536 1024" aria-label="Goldene Sammelbuchstaben A, B und C" role="img">
                <defs><linearGradient id={goldId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor={LETTER_STYLE.fill} /><stop offset="1" stopColor={LETTER_STYLE.fillDeep} />
                </linearGradient></defs>
                {COMIC_LETTERS.map(glyph => <g key={glyph.char} transform={`translate(${glyph.x} ${glyph.y}) rotate(${glyph.rotation})`}>
                  <text textAnchor="middle" style={{ font: LETTER_STYLE.font }} stroke="#243048" strokeWidth="15" strokeLinejoin="round" fill="none">{glyph.char}</text>
                  <text textAnchor="middle" style={{ font: LETTER_STYLE.font }} stroke={LETTER_STYLE.stroke} strokeWidth={LETTER_STYLE.strokeWidth * 2}
                    strokeLinejoin="round" paintOrder="stroke" fill={`url(#${goldId})`}>{glyph.char}</text>
                </g>)}
              </svg>}
            </div>
          </div>
          <div className="pb-comic-caption" aria-live="polite">
            <h2>{panel.titleDe}</h2>
            {panel.speakerDe && <span className="pb-comic-speaker">{panel.speakerDe}</span>}
            {panel.linesDe.map((line) => <p key={line}>{line}</p>)}
          </div>
        </div>
        <footer className="pb-comic-foot">
          <button type="button" disabled={page === 0} onClick={() => setPage(page - 1)}>Zurück</button>
          <span aria-label={`Bild ${page + 1} von ${CH01_COMIC.length}`}>{page + 1} von {CH01_COMIC.length}</span>
          <button type="button" className="pb-comic-next" onClick={forward}>{last ? "Zum ersten Kapitel" : "Weiter"}</button>
        </footer>
      </section>
    </div>
  );
}

/** Image-native coordinates: the letters float toward the grey book without
 * covering either character. SVG and PNG share the same contain rectangle. */
export const COMIC_LETTERS = [
  { char: "A", x: 700, y: 520, rotation: -9 },
  { char: "B", x: 805, y: 440, rotation: 5 },
  { char: "C", x: 910, y: 365, rotation: -6 },
] as const;

const COMIC_CSS = `
.pb-comic-veil{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;background:rgba(13,22,33,.96);padding:clamp(8px,2vw,22px);box-sizing:border-box;color:#302b24;outline:none}
.pb-comic-book{display:flex;flex-direction:column;width:min(100%,1020px);height:100%;max-height:940px;min-height:0;background:#f7ebcf;border:3px solid #57412c;box-shadow:0 12px 38px #0009;overflow:hidden;box-sizing:border-box}
.pb-comic-heading,.pb-comic-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 16px;flex-shrink:0;font-size:14px}
.pb-comic-heading{font-weight:700}.pb-comic-heading button{font-size:12px;background:none;border:0;text-decoration:underline;color:#493d2d}
.pb-comic-shot{position:relative;display:flex;flex-direction:column;min-height:0;flex:1;background:#142738}
.pb-comic-picture{flex:1;min-height:0;overflow:hidden;display:flex;align-items:center;justify-content:center}
.pb-comic-art{position:relative;width:100%;height:100%;min-height:0;animation:pb-comic-drift 16s ease-out both;transform-origin:55% 45%}
.pb-comic-paint{width:100%;height:100%;min-height:0;object-fit:contain;display:block}
.pb-comic-letters{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible}
.pb-comic-shot[data-motion=fall] .pb-comic-art{transform-origin:50% 65%}
.pb-comic-shot[data-motion=ink] .pb-comic-art{transform-origin:60% 60%}
.pb-comic-caption{position:relative;flex-shrink:0;max-height:55%;overflow:auto;padding:14px clamp(16px,4vw,36px);background:#fff5dc;border-top:3px solid #715437;box-shadow:0 -4px 12px #0002}
.pb-comic-caption h2{margin:0 0 8px;font-family:var(--font-display,inherit);font-size:clamp(18px,2.4vw,28px);line-height:1.2}
.pb-comic-caption p{margin:6px 0;font-size:clamp(15px,2vw,21px);line-height:1.4;max-width:52ch}
.pb-comic-speaker{display:inline-block;color:#174c58;font-size:14px}
.pb-comic-foot button{border:2px solid #6b4e2b;background:#fff9e9;border-radius:8px;padding:8px 18px;color:#302b24;font-size:15px;font-weight:700;cursor:pointer;min-height:42px}
.pb-comic-foot .pb-comic-next{background:#e9bd65}.pb-comic-foot button:disabled{opacity:.4;cursor:default}
.pb-comic-book button:focus-visible{outline:3px solid #217485;outline-offset:2px}
@keyframes pb-comic-drift{from{transform:scale(1.025)}to{transform:scale(1)}}
@media(max-height:600px){.pb-comic-heading,.pb-comic-foot{padding:5px 12px}.pb-comic-caption{padding:8px 14px;max-height:60%}.pb-comic-caption h2{font-size:18px}.pb-comic-caption p{font-size:15px;margin:3px 0}}
@media(max-width:500px){.pb-comic-heading{gap:6px;padding:8px;font-size:12px}.pb-comic-heading button{max-width:105px}.pb-comic-caption{padding:10px 14px}.pb-comic-caption p{font-size:16px}.pb-comic-foot{padding:8px;gap:6px}.pb-comic-foot button{padding:8px;font-size:13px}}
@media(prefers-reduced-motion:reduce){.pb-comic-art{animation:none!important;transform:none!important}}
`;
