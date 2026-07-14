export const dynamic = "force-dynamic";

/**
 * S-1 · Studio DETAIL — the per-unit editor. Server component: loads canon
 * (loadUnit) + this unit's override rows, flattens each item into a prose-only
 * field DTO, and hands plain data to the client editor (which never imports
 * @domigo/db — P-29b). The field list is exactly the allowlist; locked fields
 * are shown for context but are not emitted as editable inputs.
 */
import Link from "next/link";
import { redirect } from "next/navigation";
import { loadUnit, normalizePatchColumn } from "@domigo/content-loader";
import { getDb, loadOverridesForUnit } from "@domigo/db";
import type { GrammarItem, VocabItem } from "@domigo/content-schema";
import { getTeacherForPage } from "@/lib/identity";
import { StudioEditor, type StudioField, type StudioItem } from "./StudioEditor";

function vocabFields(v: VocabItem): StudioField[] {
  return [
    { key: "s", labelDe: "Beispielsatz (mit einer ___ Lücke)", canon: v.s, nullable: false, multiline: true },
    { key: "d", labelDe: "Definition (Englisch)", canon: v.d, nullable: false, multiline: true },
    { key: "hintDe", labelDe: "Hinweis (Deutsch)", canon: v.hintDe, nullable: false, multiline: true },
  ];
}
function grammarFields(g: GrammarItem): StudioField[] {
  return [
    { key: "prompt.text", labelDe: "Aufgabentext", canon: g.prompt.text, nullable: false, multiline: true },
    { key: "hintDe", labelDe: "Hinweis (Deutsch)", canon: g.hintDe, nullable: false, multiline: true },
    { key: "hintEn", labelDe: "Hinweis (Englisch)", canon: g.hintEn ?? "", nullable: true, multiline: false },
    { key: "explainDe", labelDe: "Erklärung (Deutsch)", canon: g.explainDe, nullable: false, multiline: true },
    { key: "explainEn", labelDe: "Erklärung (Englisch)", canon: g.explainEn ?? "", nullable: true, multiline: true },
  ];
}

export default async function StudioUnitPage({ params }: { params: Promise<{ slug: string }> }) {
  const teacher = await getTeacherForPage();
  if (!teacher) redirect("/admin/signin");
  const { slug } = await params;

  let unit;
  try {
    unit = loadUnit(slug);
  } catch {
    redirect("/admin/studio");
  }
  const rows = await loadOverridesForUnit(getDb(), slug).catch(() => []);
  const byItem = new Map(rows.map((r) => [r.itemId, { patch: normalizePatchColumn(r.patch), status: r.status }]));

  const items: StudioItem[] = [
    ...unit.vocab.map((v): StudioItem => ({
      id: v.id,
      kind: "vocab",
      label: v.w,
      fields: vocabFields(v),
      locked: [
        { labelDe: "Wort", value: v.w },
        { labelDe: "Übersetzung", value: v.g },
      ],
      override: byItem.get(v.id) ?? null,
    })),
    ...unit.grammar.map((g): StudioItem => ({
      id: g.id,
      kind: "grammar",
      label: g.prompt.text.slice(0, 60),
      fields: grammarFields(g),
      locked: [
        { labelDe: "Typ", value: g.format },
        { labelDe: "Lösung", value: g.answers.map((a) => a.text).join(" / ") || "—" },
      ],
      override: byItem.get(g.id) ?? null,
    })),
  ];

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px 48px", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <h1 style={{ fontSize: 23, margin: 0, fontFamily: "var(--font-display)", color: "var(--ink)" }}>Studio · {slug}</h1>
        <Link href="/admin/studio" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>← Alle Einheiten</Link>
      </div>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
        {unit.vocab.length} Vokabeln · {unit.grammar.length} Grammatik. Ändere den Text, <strong>Speichern</strong> legt einen Entwurf an, <strong>Veröffentlichen</strong> macht ihn live.
      </p>
      <StudioEditor slug={slug} items={items} />
    </main>
  );
}
