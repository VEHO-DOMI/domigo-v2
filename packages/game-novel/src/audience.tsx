import { audienceMetrics, channelNote, formatCount, type EpisodeStats } from "./novel-copy.ts";

/** A story snapshot, never a wallet or a score. Only past/revealed rows are supplied. */
export function Audience({ current, previous, quiet = false }: { current: EpisodeStats | null; previous?: EpisodeStats | null; quiet?: boolean }) {
  const metrics = audienceMetrics(current, previous);
  return <section className="fourteen-audience" aria-label="FOURTEEN channel" data-quiet={quiet || undefined}>
    <div className="fourteen-eyebrow">FOURTEEN · {current ? `Stand nach Folge ${Number(current.chapterId.slice(-2))}` : "Vor unserem ersten Video"}</div>
    <p className="fourteen-caption">Zahlen aus der Geschichte. Sie zeigen den Kanal, nicht deine Lernpunkte.</p>
    {current && <p className="fourteen-channel-note">{channelNote(Number(current.chapterId.slice(-2)))}</p>}
    {previous && current && <p className="fourteen-comparison">Folge {Number(previous.chapterId.slice(-2))} → Folge {Number(current.chapterId.slice(-2))}</p>}
    <dl className="fourteen-metrics">
      {metrics.map((m) => <div key={m.label}>
        <dt>{m.label}<span className="fourteen-gloss">(= {m.de})</span></dt>
        <dd>{m.value === undefined ? "—" : formatCount(m.value, "en")}</dd>
        {m.value !== undefined && m.before !== undefined && <>
          <span className="fourteen-before">vorher {formatCount(m.before, "en")}</span>
          <span className="fourteen-delta">{m.value === m.before ? "unverändert" : `${formatCount(Math.abs(m.value - m.before), "en")} ${m.value > m.before ? "mehr" : "weniger"}`}</span>
          <span className="fourteen-metric-bar" aria-hidden="true"><i style={{ width: `${100 * m.before / Math.max(1, m.before, m.value)}%` }} /><i style={{ width: `${100 * m.value / Math.max(1, m.before, m.value)}%` }} /></span>
        </>}
      </div>)}
    </dl>
    {current && !previous && <p className="fourteen-caption">Unser erster Kanalstand. Es gibt noch keine vorige Folge zum Vergleichen.</p>}
  </section>;
}
