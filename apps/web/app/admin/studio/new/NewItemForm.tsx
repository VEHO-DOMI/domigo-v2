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
import { useCallback, useState, type CSSProperties } from "react";
import { buildVocabItem, idStem, type Difficulty } from "@/lib/studio-new-item";

const inputStyle: CSSProperties = { width: "100%", fontSize: 14, padding: "8px 10px", borderRadius: 10, border: "1.5px solid var(--card-border)", background: "var(--bg-raised)", color: "var(--text)", fontFamily: "var(--font-body)", boxSizing: "border-box" };
const labelStyle: CSSProperties = { fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--muted)", fontFamily: "var(--font-label)" };

type Phase = "edit" | "saving" | "checking" | "published" | "blocked" | "failed";
type ApiResult = { httpStatus: number; ok?: boolean; status?: string; runId?: string; kind?: string; note?: string; error?: string; errors?: string[] };

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 12 }}>
      <label style={labelStyle}>{label}</label>
      {children}
      {hint ? <p style={{ fontSize: 12, color: "var(--muted)", margin: "3px 0 0" }}>{hint}</p> : null}
    </div>
  );
}

export function NewItemForm({ units }: { units: string[] }) {
  const router = useRouter();
  const [unitSlug, setUnitSlug] = useState(units[0] ?? "");
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

  const itemId = slug.trim() ? `${idStem(unitSlug)}.w.${slug.trim()}` : "";
  const busy = phase === "saving" || phase === "checking";

  function build() {
    return buildVocabItem({ unitSlug, slug, w, g, d, s, sAnswer, distractors, hintDe, difficulty, gloss: [] });
  }

  async function callApi(body: Record<string, unknown>): Promise<ApiResult> {
    const res = await fetch("/api/admin/studio/drafts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const json = (await res.json().catch(() => ({}))) as Partial<ApiResult>;
    return { httpStatus: res.status, ...json };
  }

  const save = useCallback(async (): Promise<boolean> => {
    setErrors([]);
    const { id, item } = build();
    const r = await callApi({ action: "save", itemId: id, unitSlug, kind: "vocab", draftAction: "create", item });
    if (!r.ok) {
      setErrors((r.errors as string[]) ?? [String(r.error ?? "Fehler")]);
      return false;
    }
    return true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitSlug, slug, w, g, d, s, sAnswer, distractors, hintDe, difficulty]);

  async function poll(runId: string): Promise<void> {
    const r = await callApi({ action: "poll", runId });
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

  const onSaveOnly = async () => {
    setPhase("saving");
    const ok = await save();
    setPhase("edit");
    if (ok) setNote("Entwurf gespeichert. „Veröffentlichen“ startet die KI-Prüfung.");
  };

  const onPublish = async () => {
    setPhase("saving");
    setNote("");
    if (!(await save())) {
      setPhase("edit");
      return;
    }
    const r = await callApi({ action: "publish", itemId });
    if (!r.ok || r.status !== "checking") {
      setErrors((r.errors as string[]) ?? [String(r.error ?? "Start fehlgeschlagen")]);
      setPhase("edit");
      return;
    }
    setPhase("checking");
    void poll(r.runId as string);
  };

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
        <strong style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--correct)" }}>Veröffentlicht!</strong>
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
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Einheit">
          <select value={unitSlug} onChange={(e) => setUnitSlug(e.target.value)} style={inputStyle}>
            {units.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </Field>
        <Field label="Kürzel (ID)" hint={itemId ? itemId : "z. B. apple-bobbing"}>
          <input value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} placeholder="apple-bobbing" style={inputStyle} />
        </Field>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Wort (Englisch)"><input value={w} onChange={(e) => setW(e.target.value)} placeholder="lantern" style={inputStyle} /></Field>
        <Field label="Deutsch"><input value={g} onChange={(e) => setG(e.target.value)} placeholder="die Laterne" style={inputStyle} /></Field>
      </div>

      <Field label="Definition (Englisch)" hint="Erklärt das Wort — darf das Wort selbst NICHT enthalten.">
        <textarea rows={2} value={d} onChange={(e) => setD(e.target.value)} placeholder="A light you carry to see in the dark." style={{ ...inputStyle, resize: "vertical" }} />
      </Field>

      <Field label="Beispielsatz mit Lücke" hint="Genau eine Lücke als ___ (drei Unterstriche).">
        <textarea rows={2} value={s} onChange={(e) => setS(e.target.value)} placeholder="At Halloween we make a ___ out of a pumpkin." style={{ ...inputStyle, resize: "vertical" }} />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Richtige Antwort (Lücke)"><input value={sAnswer} onChange={(e) => setSAnswer(e.target.value)} placeholder="lantern" style={inputStyle} /></Field>
        <Field label="Schwierigkeit">
          <select value={difficulty} onChange={(e) => setDifficulty(Number(e.target.value) as Difficulty)} style={inputStyle}>
            <option value={1}>1 — leicht</option>
            <option value={2}>2 — mittel</option>
            <option value={3}>3 — schwer</option>
          </select>
        </Field>
      </div>

      <Field label="Falsche Optionen (4)" hint="Vier plausible falsche Antworten (für Multiple-Choice + das Spiel).">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {distractors.map((val, i) => (
            <input key={i} value={val} onChange={(e) => setDistractors((arr) => arr.map((x, j) => (j === i ? e.target.value : x)))} placeholder={`Option ${i + 1}`} style={inputStyle} />
          ))}
        </div>
      </Field>

      <Field label="Hinweis (Deutsch, du-Form)"><input value={hintDe} onChange={(e) => setHintDe(e.target.value)} placeholder="Du trägst es, um im Dunkeln zu sehen." style={inputStyle} /></Field>

      {errors.length > 0 && (
        <ul style={{ margin: "14px 0 0", paddingLeft: 18, color: "var(--incorrect)", fontSize: 13 }}>{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
      )}
      {note && errors.length === 0 ? <p style={{ fontSize: 13, color: "var(--correct)", marginTop: 12 }}>{note}</p> : null}

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button type="button" className="dg-btn-secondary" disabled={busy} onClick={onSaveOnly} style={{ opacity: busy ? 0.5 : 1 }}>{phase === "saving" ? "…" : "Speichern"}</button>
        <button type="button" className="dg-btn" disabled={busy} onClick={onPublish} style={{ opacity: busy ? 0.5 : 1 }}>Veröffentlichen (KI-Prüfung)</button>
      </div>
    </div>
  );
}
