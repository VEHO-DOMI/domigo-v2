"use client";
/**
 * S-1 · Studio editor (client). Per item: editable PROSE fields (pre-filled
 * with the current override or canon, canon ghosted when changed, per-field
 * reset), locked fields shown greyed for context, and Save/Publish/Revert.
 * The client is never trusted — it simply never renders a locked field as an
 * input; the API re-validates every save + publish against a fresh base.
 */
import { useRouter } from "next/navigation";
import { useState, type CSSProperties } from "react";

export interface StudioField {
  key: string; // "s" | "d" | "hintDe" | "prompt.text" | …
  labelDe: string;
  canon: string;
  nullable: boolean;
  multiline: boolean;
}
export interface StudioItem {
  id: string;
  kind: "vocab" | "grammar";
  label: string;
  fields: StudioField[];
  locked: Array<{ labelDe: string; value: string }>;
  override: { patch: Record<string, unknown>; status: string } | null;
}

function getPatchValue(patch: Record<string, unknown>, key: string): unknown {
  if (!key.includes(".")) return patch[key];
  const [head, tail] = key.split(".");
  const sub = patch[head!];
  return sub && typeof sub === "object" ? (sub as Record<string, unknown>)[tail!] : undefined;
}
function setPatchValue(patch: Record<string, unknown>, key: string, value: unknown): void {
  if (!key.includes(".")) {
    patch[key] = value;
    return;
  }
  const [head, tail] = key.split(".");
  const sub = (patch[head!] as Record<string, unknown> | undefined) ?? {};
  sub[tail!] = value;
  patch[head!] = sub;
}
function initialValue(item: StudioItem, field: StudioField): string {
  if (item.override) {
    const pv = getPatchValue(item.override.patch, field.key);
    if (pv !== undefined) return String(pv ?? "");
  }
  return field.canon;
}

const inputStyle: CSSProperties = { width: "100%", fontSize: 14, padding: "8px 10px", borderRadius: 10, border: "1.5px solid var(--card-border)", background: "var(--bg-raised)", color: "var(--text)", fontFamily: "var(--font-body)", boxSizing: "border-box" };

function ItemCard({ slug, item }: { slug: string; item: StudioItem }) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(item.fields.map((f) => [f.key, initialValue(item, f)])));
  const [busy, setBusy] = useState<null | string>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const changed = item.fields.filter((f) => values[f.key] !== f.canon);
  const dirty = changed.length > 0;
  const status = item.override?.status ?? null;

  function buildPatch(): Record<string, unknown> {
    const patch: Record<string, unknown> = {};
    for (const f of changed) {
      const v = values[f.key] ?? "";
      if (f.nullable && v.trim() === "") setPatchValue(patch, f.key, null);
      else setPatchValue(patch, f.key, v);
    }
    return patch;
  }

  async function post(body: Record<string, unknown>, label: string): Promise<void> {
    setBusy(label);
    setErrors([]);
    try {
      const res = await fetch("/api/admin/studio", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const d = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; errors?: string[] };
      if (!res.ok || !d.ok) {
        setErrors(d.errors ?? [d.error ?? "Fehler"]);
        return;
      }
      router.refresh();
    } catch {
      setErrors(["Netzwerkfehler"]);
    } finally {
      setBusy(null);
    }
  }

  const save = () => post({ action: "save", itemId: item.id, unitSlug: slug, kind: item.kind, patch: buildPatch() }, "save");
  const publish = async () => {
    if (dirty) await post({ action: "save", itemId: item.id, unitSlug: slug, kind: item.kind, patch: buildPatch() }, "publish");
    await post({ action: "publish", itemId: item.id }, "publish");
  };
  const revert = () => {
    if (window.confirm("Diese Änderungen verwerfen und zum Original zurück?")) void post({ action: "revert", itemId: item.id }, "revert");
  };

  return (
    <div className="dg-card" data-grade={Number(slug[1])} style={{ marginTop: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
        <strong style={{ fontFamily: "var(--font-display)" }}>{item.kind === "vocab" ? "🔤" : "🧩"} {item.label}</strong>
        <span style={{ fontSize: 12, color: status === "published" ? "var(--correct)" : status === "draft" ? "var(--partial)" : "var(--muted)", fontWeight: 700 }}>
          {status === "published" ? "● live" : status === "draft" ? "○ Entwurf" : "kein Override"}
        </span>
      </div>

      {item.fields.map((f) => {
        const isChanged = values[f.key] !== f.canon;
        return (
          <div key={f.key} style={{ marginTop: 10 }}>
            <label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--muted)", fontFamily: "var(--font-label)" }}>{f.labelDe}</label>
            {f.multiline ? (
              <textarea rows={2} value={values[f.key] ?? ""} onChange={(e) => setValues((s) => ({ ...s, [f.key]: e.target.value }))} style={{ ...inputStyle, resize: "vertical", ...(isChanged ? { borderColor: "var(--accent)" } : {}) }} />
            ) : (
              <input value={values[f.key] ?? ""} onChange={(e) => setValues((s) => ({ ...s, [f.key]: e.target.value }))} style={{ ...inputStyle, ...(isChanged ? { borderColor: "var(--accent)" } : {}) }} />
            )}
            {isChanged && (
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginTop: 2 }}>
                <span style={{ fontSize: 12, color: "var(--muted)", fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Original: {f.canon.slice(0, 90) || "(leer)"}</span>
                <button type="button" onClick={() => setValues((s) => ({ ...s, [f.key]: f.canon }))} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>↺ zurück</button>
              </div>
            )}
          </div>
        );
      })}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
        {item.locked.map((l) => (
          <span key={l.labelDe} className="dg-tile--locked" style={{ fontSize: 12, padding: "4px 10px", borderRadius: 999, display: "inline-flex", gap: 4 }}>
            🔒 {l.labelDe}: <strong>{l.value.slice(0, 40)}</strong>
          </span>
        ))}
      </div>
      <p style={{ fontSize: 11, color: "var(--muted)", margin: "6px 0 0" }}>Gesperrt (Lösungsschlüssel — nur über Git änderbar).</p>

      {errors.length > 0 && (
        <ul style={{ margin: "10px 0 0", paddingLeft: 18, color: "var(--incorrect)", fontSize: 13 }}>{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button type="button" className="dg-btn-secondary" disabled={!dirty || busy !== null} onClick={save} style={{ opacity: !dirty || busy ? 0.5 : 1 }}>{busy === "save" ? "…" : "Speichern"}</button>
        <button type="button" className="dg-btn" disabled={busy !== null || (!dirty && status !== "draft")} onClick={publish} style={{ opacity: busy || (!dirty && status !== "draft") ? 0.5 : 1 }}>{busy === "publish" ? "…" : "Veröffentlichen"}</button>
        {status && (
          <button type="button" onClick={revert} disabled={busy !== null} style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--incorrect)", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>Zurücksetzen</button>
        )}
      </div>
    </div>
  );
}

export function StudioEditor({ slug, items }: { slug: string; items: StudioItem[] }) {
  return (
    <div>
      {items.map((item) => (
        <ItemCard key={item.id} slug={slug} item={item} />
      ))}
    </div>
  );
}
