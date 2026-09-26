import { formatCount, likesFor, type EpisodeStats } from "./novel-copy.ts";

/** A story snapshot, never a wallet or a score. Only past/revealed rows are supplied. */
export function Audience({ current, previous, quiet = false }: { current: EpisodeStats | null; previous?: EpisodeStats | null; quiet?: boolean }) {
  const metrics = [
    { label: "Views", de: "Aufrufe", value: current?.views, before: previous?.views },
    { label: "Likes", de: "Gefällt mir", value: current ? likesFor(current) : undefined, before: previous ? likesFor(previous) : undefined },
    { label: "Shares", de: "geteilt", value: current?.shares, before: previous?.shares },
    { label: "Comments", de: "Kommentare", value: current?.comments, before: previous?.comments },
    { label: "Subscribers", de: "Abos", value: current?.subscribers, before: previous?.subscribers },
  ];
  return <section className="fourteen-audience" aria-label="FOURTEEN channel" data-quiet={quiet || undefined}>
    <div className="fourteen-eyebrow">FOURTEEN · {current ? `after episode ${Number(current.chapterId.slice(-2))}` : "before our first video"}</div>
    <dl className="fourteen-metrics">
      {metrics.map((m) => <div key={m.label}>
        <dt>{m.label}<span className="fourteen-gloss">{m.de}</span></dt>
        <dd>{m.value === undefined ? "—" : formatCount(m.value, "en")}</dd>
        {m.value !== undefined && m.before !== undefined && <span className="fourteen-delta">
          {m.value === m.before ? "No change" : `${m.value > m.before ? "+" : "−"}${formatCount(Math.abs(m.value - m.before), "en")}`}
        </span>}
      </div>)}
    </dl>
    {previous && <p className="fourteen-caption">Change since the last episode (= Veränderung seit der letzten Folge).</p>}
  </section>;
}
