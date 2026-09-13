import React, { useEffect, useRef } from "react";
import { KlecksSpeaker } from "./KlecksSpeaker.tsx";
import { PAINT_CLASSMATES } from "./ch01-story.ts";

/** A finite authored class, not a generated crowd or an invented progress count. */
export function ClassPhoto({ art, rescuedIds, displayName, onClose }: {
  art: Record<string, string>;
  rescuedIds: readonly string[];
  displayName: string;
  onClose: () => void;
}): React.ReactElement {
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => { closeButton.current?.focus(); }, []);
  const found = new Set(rescuedIds);
  const remaining = PAINT_CLASSMATES.filter(p => !found.has(p.id)).length;
  return <div role="dialog" aria-modal="true" aria-label="Unser Klassenfoto" className="pb-class-photo" onKeyDown={event => {
    if (event.key === "Tab") { event.preventDefault(); closeButton.current?.focus(); }
    if (event.key === "Escape") { event.preventDefault(); onClose(); }
  }}>
    <style>{`
      .pb-class-photo{position:fixed;inset:0;z-index:1000;background:#172c35ee;padding:14px;display:flex;align-items:center;justify-content:center;color:#30281e}
      .pb-class-photo section{background:#f8ecd0;border:8px solid #89613e;padding:16px;max-height:100%;overflow:auto;box-sizing:border-box;width:min(940px,100%);box-shadow:0 10px 30px #0008}
      .pb-class-photo h2{margin:0 0 8px}.pb-class-photo p{margin:7px 0;line-height:1.4}
      .pb-photo-group{display:block;width:100%;max-height:52vh;object-fit:contain}.pb-photo-children{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;margin:8px 0;background:#cfd6bf;padding:12px;border:3px solid #725639}
      .pb-photo-children figure{margin:0;text-align:center;min-width:0}.pb-photo-children img{width:100%;height:clamp(70px,13vh,140px);object-fit:contain;display:block}
      .pb-photo-children figcaption{font-size:14px;font-weight:700}.pb-photo-children small{display:block;font-size:12px;min-height:1.3em;color:#335946}
      @media(max-width:500px){.pb-photo-children{gap:4px;padding:6px}.pb-photo-children figcaption{font-size:11px}.pb-class-photo section{padding:10px}.pb-photo-children small{font-size:10px}}
    `}</style>
    <section>
      <h2>Unser Klassenfoto</h2>
      <KlecksSpeaker art={art} />
      <p>{displayName ? `${displayName}, auf` : "Auf"} diesem Foto sind deine fünfzehn Mitschüler.</p>
      <img className="pb-photo-group" src={art.klassenfoto_a} alt="Unsere Klasse mit fünfzehn Mitschülern in drei Reihen." />
      <p>Die Namen stehen in derselben Reihenfolge wie auf dem Foto.</p>
      <div className="pb-photo-children">
        {["lenz", "edda", "falk", "fritzi", "cleo", "tammo", "enna", "juno", "quirin", "smilla", "merle", "fenn", "ilvy", "piet", "veit"].map(id => {
          const person = PAINT_CLASSMATES.find(p => p.id === id)!;
          return <figure key={person.id}>
            <figcaption>{person.name}</figcaption>
            <small>{found.has(person.id) ? "Wieder da" : "Noch im Buch"}</small>
          </figure>;
        })}
      </div>
      <p>{remaining === 0 ? "Alle sind wieder da!" : remaining === 1 ? "Wir müssen noch ein Kind finden. Suchen wir im nächsten Kapitel weiter!" : `Wir müssen noch ${remaining} finden. Suchen wir im nächsten Kapitel weiter!`}</p>
      <button ref={closeButton} type="button" className="pb-btn-primary" onClick={onClose} style={{ fontSize: 18, padding: "10px 18px" }}>Weiter</button>
    </section>
  </div>;
}
