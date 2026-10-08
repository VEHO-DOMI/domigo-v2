"use client";
/**
 * S-2 · Studio create form (client). Authors a full vocab item from teacher-
 * facing fields (buildVocabItem defaults the structural bits), saves it as a
 * draft, then publishes — which starts the S-2b sandbox blind-solve gate and
 * polls until the AI has solved it (→ live) or couldn't (→ blocked, with the
 * AI's answer shown so the teacher can fix the key). The server re-validates
 * and re-gates everything; the client is just the authoring surface.
 */
import { useRouter } from "next/navigation";
import { useState, type CSSProperties } from "react";
import { GrammarItemView, VocabItemView } from "@domigo/task-ui";
import type { GrammarItem, TieredAnswer, VocabItem } from "@domigo/content-schema";
import { buildGrammarItem, buildVocabItem, submitStudioItem, STUDIO_GRAMMAR_FORMATS, type Difficulty, type StudioGrammarFormat, type StudioUnitOptions } from "@/lib/studio-new-item";

const inputStyle: CSSProperties = { width: "100%", fontSize: 14, padding: "8px 10px", borderRadius: 10, border: "1.5px solid var(--card-border)", background: "var(--bg-raised)", color: "var(--text)", fontFamily: "var(--font-body)", boxSizing: "border-box" };
const labelStyle: CSSProperties = { fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--muted)", fontFamily: "var(--font-label)" };

type Phase = "edit" | "saving" | "checking" | "published" | "blocked" | "failed";
type GateResult = { ok: boolean; stage?: string; errors?: string[]; keyChecks?: { answer: string; tier: string }[] };
type ApiResult = { draftId?: string; httpStatus: number; ok?: boolean; status?: string; runId?: string; kind?: string; note?: string; error?: string; errors?: string[] } & Partial<GateResult>;

const STAGE_DE: Record<string, string> = {
  schema: "Aufbau",
  "un-gateable": "nicht automatisch prüfbar",
  "key-defect": "Lösungsschlüssel",
};

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 12 }}>
      <div style={labelStyle}>{label}</div>
      {children}
      {hint ? <p style={{ fontSize: 12, color: "var(--muted)", margin: "3px 0 0", overflowWrap: "anywhere" }}>{hint}</p> : null}
    </div>
  );
}

export function NewItemForm({ units }: { units: StudioUnitOptions[] }) {
  const router = useRouter();
  const [unitSlug, setUnitSlug] = useState(units[0]?.slug ?? "");
  const [kind, setKind] = useState<"vocab" | "grammar">("vocab");
  const [structureId, setStructureId] = useState(units[0]?.structures[0]?.id ?? "");
  const [format, setFormat] = useState<StudioGrammarFormat>("multiple-choice");
  const [prompt, setPrompt] = useState("");
  const [lang, setLang] = useState<"de" | "en">("en");
  const [answers, setAnswers] = useState<TieredAnswer[]>([{ text: "", tier: "full" }]);
  const [explainDe, setExplainDe] = useState("");
  const [slug, setSlug] = useState("");
  const [w, setW] = useState("");
  const [g, setG] = useState("");
  const [d, setD] = useState("");
  const [s, setS] = useState("");
  const [sAnswer, setSAnswer] = useState("");
  const [distractors, setDistractors] = useState(["", "", "", ""]);
  const [hintDe, setHintDe] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>(2);

  const [phase, setPhase] = useState<Phase>("edit");
  const [errors, setErrors] = useState<string[]>([]);
  const [note, setNote] = useState<string>("");
  const [savedDraft, setSavedDraft] = useState<{ id: string; draftId: string } | null>(null);

  // WS-AUTH B · see-it-before-you-publish: a student-view snapshot + a free gate check.
  const [preview, setPreview] = useState<{ kind: "vocab"; item: VocabItem } | { kind: "grammar"; item: GrammarItem } | null>(null);
  const [previewKey, setPreviewKey] = useState(0);
  const [gate, setGate] = useState<GateResult | null>(null);
  const [gateBusy, setGateBusy] = useState(false);

  const unit = units.find((entry) => entry.slug === unitSlug);
  let built: { id: string; item: unknown } | null = null;
  let buildError = "";
  try {
    built = kind === "grammar"
      ? buildGrammarItem({ unitSlug, structureId, format, occupiedIds: unit?.occupiedIds ?? [], prompt, lang, answers, distractors, hintDe, explainDe, difficulty })
      : buildVocabItem({ unitSlug, slug, w, g, d, s, sAnswer, distractors, hintDe, difficulty, gloss: [] });
  } catch (error) {
    buildError = error instanceof Error ? error.message : "Wähle eine Grammatik-Struktur.";
  }
  const itemId = built?.id ?? "";
  const busy = phase === "saving" || phase === "checking";
  const canPreview = !!built && (kind === "grammar"
    ? prompt.trim() !== "" && answers.some((answer) => answer.tier === "full" && answer.text.trim() !== "")
    : w.trim() !== "" && s.trim() !== "" && sAnswer.trim() !== "");

  function changeUnit(value: string) {
    setUnitSlug(value);
    setStructureId(units.find((entry) => entry.slug === value)?.structures[0]?.id ?? "");
    setPreview(null);
    setGate(null);
  }

  async function callApi(body: Record<string, unknown>): Promise<ApiResult> {
    const res = await fetch("/api/admin/studio/drafts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const json = (await res.json().catch(() => ({}))) as Partial<ApiResult>;
    return { httpStatus: res.status, ...json };
  }

  // Preview uses exactly the same item that save submits.
  function showPreview() {
    if (!built) return;
    setPreview(kind === "grammar"
      ? { kind: "grammar", item: built.item as GrammarItem }
      : { kind: "vocab", item: built.item as VocabItem });
    setPreviewKey((key) => key + 1);
  }

  // Run the FREE pre-gate (structure + is-the-key-solvable) without publishing.
  const runGate = async () => {
    if (!built) return;
    setGateBusy(true);
    setGate(null);
    try {
      const r = await callApi({ action: "pregate", kind, item: built.item });
      setGate({ ok: !!r.ok, stage: r.stage, errors: r.errors, keyChecks: r.keyChecks });
    } catch {
      setGate({ ok: false, errors: ["Netzwerkfehler — bitte nochmal versuchen."] });
    } finally {
      setGateBusy(false);
    }
  };

  async function poll(runId: string): Promise<void> {
    let r: ApiResult;
    try {
      r = await callApi({ action: "poll", runId });
    } catch {
      setPhase("failed");
      setNote("Prüfstatus nicht erreichbar. Die Aufgabe bleibt unveröffentlicht, bis die Prüfung bestätigt ist.");
      return;
    }
    if (r.kind === "running") {
      window.setTimeout(() => void poll(runId), 3000);
      return;
    }
    if (r.kind === "passed") {
      setPhase("published");
      router.refresh();
    } else if (r.kind === "blocked") {
      setPhase("blocked");
      setNote(typeof r.note === "string" ? r.note : "Die KI hat die Aufgabe nicht wie erwartet gelöst.");
    } else {
      setPhase("failed");
      setNote(typeof r.note === "string" ? r.note : "Der Prüf-Lauf ist fehlgeschlagen.");
    }
  }

  async function submit(publish: boolean) {
    if (!built) { setErrors([buildError]); return; }
    setPhase("saving");
    setErrors([]);
    setNote("");
    try {
      const result = await submitStudioItem({ ...built, kind, unitSlug, ...(savedDraft?.id === built.id ? { draftId: savedDraft.draftId } : {}) }, publish, callApi);
      if (result.draftId) setSavedDraft({ id: built.id, draftId: result.draftId });
      if (!result.ok) {
        setErrors(result.errors ?? [result.error ?? "Die Aufgabe konnte nicht gespeichert werden."]);
        setPhase("edit");
      } else if (publish && result.status === "checking" && result.runId) {
        setPhase("checking");
        void poll(result.runId);
      } else if (publish && result.status === "published") {
        setPhase("published");
        router.refresh();
      } else if (publish) {
        setPhase("edit");
        setErrors(["Die Prüfung konnte nicht gestartet werden."]);
      } else {
        setPhase("edit");
        setNote("○ Entwurf gespeichert. „Veröffentlichen“ startet die KI-Prüfung.");
      }
    } catch {
      setPhase("edit");
      setErrors(["Netzwerkfehler — bitte nochmal versuchen."]);
    }
  }

  // ── terminal screens ──
  if (phase === "checking") {
    return (
      <div className="dg-card" style={{ marginTop: 20, textAlign: "center", padding: "32px 20px" }}>
        <div style={{ fontSize: 34, marginBottom: 10 }}>🤖</div>
        <strong style={{ fontFamily: "var(--font-display)", fontSize: 18 }}>Die KI löst deine Aufgabe…</strong>
        <p style={{ color: "var(--text-secondary)", marginTop: 8 }}>
          Sie sieht die Aufgabe wie ein Kind — <em>ohne</em> Lösungsschlüssel — und muss sie durch die echte
          Engine richtig lösen. Das dauert meist 1–3 Minuten. Lass dieses Fenster offen.
        </p>
        <div style={{ marginTop: 14, fontSize: 13, color: "var(--muted)" }}>Aufgabe: <code>{itemId}</code></div>
      </div>
    );
  }
  if (phase === "published") {
    return (
      <div className="dg-card" style={{ marginTop: 20, textAlign: "center", padding: "32px 20px" }}>
        <div style={{ fontSize: 34, marginBottom: 10 }}>✅</div>
        <strong style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--correct)" }}>● live — veröffentlicht!</strong>
        <p style={{ color: "var(--text-secondary)", marginTop: 8 }}>Die KI hat deine Aufgabe korrekt gelöst — sie ist jetzt live für die Kinder.</p>
        <button type="button" className="dg-btn" style={{ marginTop: 14 }} onClick={() => window.location.reload()}>Noch eine Aufgabe</button>
      </div>
    );
  }
  if (phase === "blocked" || phase === "failed") {
    const blocked = phase === "blocked";
    return (
      <div className="dg-card" style={{ marginTop: 20, textAlign: "center", padding: "32px 20px" }}>
        <div style={{ fontSize: 34, marginBottom: 10 }}>{blocked ? "🚫" : "⚠️"}</div>
        <strong style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--incorrect)" }}>{blocked ? "Blockiert — nicht veröffentlicht" : "Prüfung fehlgeschlagen"}</strong>
        <p style={{ color: "var(--text-secondary)", marginTop: 8 }}>
          {blocked
            ? "Die KI kam nicht auf deinen Lösungsschlüssel. Wahrscheinlich ist die Antwort zu eng oder die Aufgabe mehrdeutig — prüfe den Satz und die richtige Antwort."
            : "Der Prüf-Lauf konnte nicht abgeschlossen werden."}
        </p>
        {note ? <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 8, fontStyle: "italic" }}>{note}</p> : null}
        <button type="button" className="dg-btn-secondary" style={{ marginTop: 14 }} onClick={() => { setPhase("edit"); setNote(""); }}>Zurück zum Bearbeiten</button>
      </div>
    );
  }

  // ── the form ──
  return (
    <div className="dg-card" style={{ marginTop: 20 }}>
      <fieldset disabled={busy} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
      <Field label="Art der Aufgabe">
        <select aria-label="Art der Aufgabe" value={kind} onChange={(event) => { setKind(event.target.value as "vocab" | "grammar"); setPreview(null); setGate(null); setErrors([]); setNote(""); }} style={inputStyle}>
          <option value="vocab">Wortschatz</option>
          <option value="grammar">Grammatik</option>
        </select>
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: 12 }}>
        <Field label="Einheit">
          <select aria-label="Einheit" value={unitSlug} onChange={(e) => changeUnit(e.target.value)} style={inputStyle}>
            {units.map((u) => <option key={u.slug} value={u.slug}>{u.slug}</option>)}
          </select>
        </Field>
        {kind === "vocab" && <Field label="Kürzel (ID)" hint={itemId ? itemId : "z. B. apple-bobbing"}>
          <input aria-label="Kürzel (ID)" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} placeholder="apple-bobbing" style={inputStyle} />
        </Field>}
      </div>

      {kind === "vocab" ? <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: 12 }}>
        <Field label="Wort (Englisch)"><input aria-label="Wort (Englisch)" value={w} onChange={(e) => setW(e.target.value)} placeholder="lantern" style={inputStyle} /></Field>
        <Field label="Deutsch"><input aria-label="Deutsch" value={g} onChange={(e) => setG(e.target.value)} placeholder="die Laterne" style={inputStyle} /></Field>
      </div>

      <Field label="Definition (Englisch)" hint="Erklärt das Wort — darf das Wort selbst NICHT enthalten.">
        <textarea aria-label="Definition (Englisch)" rows={2} value={d} onChange={(e) => setD(e.target.value)} placeholder="A light you carry to see in the dark." style={{ ...inputStyle, resize: "vertical" }} />
      </Field>

      <Field label="Beispielsatz mit Lücke" hint="Genau eine Lücke als ___ (drei Unterstriche).">
        <textarea aria-label="Beispielsatz mit Lücke" rows={2} value={s} onChange={(e) => setS(e.target.value)} placeholder="At Halloween we make a ___ out of a pumpkin." style={{ ...inputStyle, resize: "vertical" }} />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: 12 }}>
        <Field label="Richtige Antwort (Lücke)"><input aria-label="Richtige Antwort (Lücke)" value={sAnswer} onChange={(e) => setSAnswer(e.target.value)} placeholder="lantern" style={inputStyle} /></Field>
      </div>
      </> : <>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: 12 }}>
          <Field label="Grammatik-Struktur" hint={itemId ? `Aufgaben-ID: ${itemId}` : "Für diese Einheit ist noch keine Struktur verfügbar."}>
            <select aria-label="Grammatik-Struktur" value={structureId} onChange={(event) => { setStructureId(event.target.value); setGate(null); }} style={inputStyle}>
              {(unit?.structures ?? []).map((structure) => <option key={structure.id} value={structure.id}>{structure.nameDe}</option>)}
            </select>
          </Field>
          <Field label="Format">
            <select aria-label="Format" value={format} onChange={(event) => { setFormat(event.target.value as StudioGrammarFormat); setGate(null); }} style={inputStyle}>
              {STUDIO_GRAMMAR_FORMATS.map((value) => <option key={value} value={value}>{{ "multiple-choice": "Multiple Choice", "gap-fill": "Lückentext", "context-picker": "Passende Antwort im Kontext" }[value]}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Sprache des Aufgabentexts">
          <select aria-label="Sprache des Aufgabentexts" value={lang} onChange={(event) => setLang(event.target.value as "en" | "de")} style={inputStyle}><option value="en">Englisch</option><option value="de">Deutsch</option></select>
        </Field>
        <Field label="Aufgabentext" hint={format === "gap-fill" ? "Lücken als ___ markieren; bei mehreren Lücken die Antworten mit | trennen." : "Schreibe den Satz oder den Kontext für die Auswahl."}>
          <textarea aria-label="Aufgabentext" rows={3} value={prompt} onChange={(event) => setPrompt(event.target.value)} style={{ ...inputStyle, resize: "vertical" }} />
        </Field>
        <Field label="Antworten und Bewertung" hint="Mindestens eine vollständig richtige Antwort. Weitere Varianten sind möglich.">
          {answers.map((answer, index) => <div key={index} style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
            <input aria-label={`Antwort ${index + 1}`} value={answer.text} onChange={(event) => setAnswers((old) => old.map((entry, i) => i === index ? { ...entry, text: event.target.value } : entry))} style={{ ...inputStyle, flex: "1 1 180px" }} />
            <select aria-label={`Bewertung Antwort ${index + 1}`} value={answer.tier} onChange={(event) => setAnswers((old) => old.map((entry, i) => i === index ? { ...entry, tier: event.target.value as TieredAnswer["tier"] } : entry))} style={{ ...inputStyle, flex: "1 1 150px" }}><option value="full">Vollständig richtig</option><option value="partial">Teilweise richtig</option></select>
            {answers.length > 1 && <button type="button" aria-label={`Antwort ${index + 1} entfernen`} onClick={() => setAnswers((old) => old.filter((_, i) => i !== index))}>×</button>}
          </div>)}
          <button type="button" className="dg-btn-secondary" style={{ marginTop: 8 }} onClick={() => setAnswers((old) => [...old, { text: "", tier: "full" }])}>+ Antwortvariante</button>
        </Field>
        <Field label="Erklärung (Deutsch)"><textarea aria-label="Erklärung (Deutsch)" rows={2} value={explainDe} onChange={(event) => setExplainDe(event.target.value)} style={{ ...inputStyle, resize: "vertical" }} /></Field>
      </>}
      <Field label="Schwierigkeit">
        <select aria-label="Schwierigkeit" value={difficulty} onChange={(event) => setDifficulty(Number(event.target.value) as Difficulty)} style={inputStyle}>
          <option value={1}>1 — leicht</option><option value={2}>2 — mittel</option><option value={3}>3 — schwer</option>
        </select>
      </Field>

      {(kind === "vocab" || format !== "gap-fill") && <Field label={kind === "vocab" ? "Falsche Optionen (4)" : "Falsche Optionen (mindestens 3)"} hint="Plausible falsche Antworten; keine richtige Antwort wiederholen.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: 8 }}>
          {distractors.map((val, i) => (
            <input key={i} aria-label={`Falsche Option ${i + 1}`} value={val} onChange={(e) => setDistractors((arr) => arr.map((x, j) => (j === i ? e.target.value : x)))} placeholder={`Option ${i + 1}`} style={inputStyle} />
          ))}
        </div>
      </Field>}

      <Field label="Hinweis (Deutsch, du-Form)"><input aria-label="Hinweis (Deutsch)" value={hintDe} onChange={(e) => setHintDe(e.target.value)} placeholder="Du trägst es, um im Dunkeln zu sehen." style={inputStyle} /></Field>

      {buildError && kind === "grammar" ? <p role="alert" style={{ color: "var(--incorrect)" }}>{buildError}</p> : null}
      {savedDraft && <p><a href={`/admin/studio/${unitSlug}`}>Gespeicherten Entwurf im Studio öffnen</a></p>}
      {errors.length > 0 && (
        <ul style={{ margin: "14px 0 0", paddingLeft: 18, color: "var(--incorrect)", fontSize: 13 }}>{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
      )}
      {note && errors.length === 0 ? <p style={{ fontSize: 13, color: "var(--correct)", marginTop: 12 }}>{note}</p> : null}

      {/* WS-AUTH B · see it + check it before it goes live to real students */}
      <div style={{ marginTop: 18, borderTop: "1px solid var(--card-border)", paddingTop: 14 }}>
        <div style={{ ...labelStyle, marginBottom: 8 }}>Vor dem Veröffentlichen</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" className="dg-btn-secondary" disabled={busy || !canPreview} onClick={showPreview} style={{ opacity: busy || !canPreview ? 0.5 : 1 }} title={canPreview ? "" : "Fülle Aufgabentext und richtige Antwort aus"}>👀 Vorschau (wie ein Kind)</button>
          <button type="button" className="dg-btn-secondary" disabled={busy || gateBusy} onClick={runGate} style={{ opacity: busy || gateBusy ? 0.5 : 1 }}>{gateBusy ? "Prüfe…" : "✓ Aufgabe prüfen"}</button>
        </div>

        {gate && (
          <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 10, border: `1px solid ${gate.ok ? "var(--correct)" : "var(--incorrect)"}`, background: "var(--bg-sunken)" }}>
            {gate.ok ? (
              <div style={{ color: "var(--correct)", fontWeight: 700 }}>✓ Sieht gut aus — sauber aufgebaut und dein Lösungsschlüssel ist lösbar.</div>
            ) : (
              <div>
                <div style={{ color: "var(--incorrect)", fontWeight: 700 }}>✗ Noch nicht bereit{gate.stage ? ` (${STAGE_DE[gate.stage] ?? gate.stage})` : ""}:</div>
                <ul style={{ margin: "6px 0 0", paddingLeft: 18, fontSize: 13, color: "var(--text-secondary)" }}>{(gate.errors ?? []).map((e, i) => <li key={i}>{e}</li>)}</ul>
              </div>
            )}
            {gate.keyChecks && gate.keyChecks.length > 0 && (
              <div style={{ marginTop: 6, fontSize: 12, color: "var(--muted)" }}>
                Lösungsschlüssel: {gate.keyChecks.map((k, i) => <span key={i}>„{k.answer}“ → {k.tier === "correct" ? "richtig ✓" : `${k.tier} ✗`}{i < gate.keyChecks!.length - 1 ? " · " : ""}</span>)}
              </div>
            )}
            <p style={{ margin: "8px 0 0", fontSize: 12, color: "var(--muted)", fontStyle: "italic" }}>Das ist die schnelle, kostenlose Prüfung. Beim „Veröffentlichen“ löst zusätzlich eine KI die Aufgabe blind.</p>
          </div>
        )}

        {preview && (
          <div style={{ marginTop: 12 }}>
            <div style={{ ...labelStyle, marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>So sieht es ein Kind</span>
              <button type="button" onClick={showPreview} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "var(--font-label)" }}>↻ Aktualisieren</button>
            </div>
            <div style={{ border: "1px solid var(--card-border)", borderRadius: 12, padding: 14, background: "var(--bg-sunken)" }}>
              {preview.kind === "grammar" ? <GrammarItemView key={previewKey} item={preview.item} hideXp /> : <VocabItemView key={previewKey} item={preview.item} pool="carrier" hideXp />}
            </div>
            <p style={{ margin: "6px 0 0", fontSize: 12, color: "var(--muted)", fontStyle: "italic" }}>Antworten hier werden nicht gespeichert — nur zum Ausprobieren.</p>
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
        <button type="button" className="dg-btn-secondary" disabled={busy || !built} onClick={() => void submit(false)} style={{ opacity: busy ? 0.5 : 1 }}>{phase === "saving" ? "…" : "Speichern"}</button>
        <button type="button" className="dg-btn" disabled={busy || !built} onClick={() => void submit(true)} style={{ opacity: busy ? 0.5 : 1 }}>Veröffentlichen (KI-Prüfung)</button>
      </div>
      </fieldset>
    </div>
  );
}
