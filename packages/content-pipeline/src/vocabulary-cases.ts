/** Review cases only: citation aliases propose candidates, never merge word meanings. */
import { z } from "zod";
import type { VocabItem } from "@domigo/content-schema";
import { exactTextKey, fingerprint, type buildVocabularyIntake } from "./vocabulary-intake.ts";

type Intake = ReturnType<typeof buildVocabularyIntake>;
export type CaseTask = Pick<VocabItem, "id" | "w" | "g" | "d" | "s" | "sAnswers" | "dAnswers" | "translation">;
export interface BankEvidence { id: string; sourceSha256: string; task: CaseTask | null }

/** Documented orthographic/citation possibilities, NOT synonym or sense equivalence. */
export function citationCandidates(text: string): Array<{ form: string; operations: string[] }> {
  const exact = exactTextKey(text);
  const variants = [{ form: exact, operations: [] as string[] }];
  const add = (form: string, operations: string[]) => {
    form = exactTextKey(form);
    if (form && !variants.some(v => v.form === form)) variants.push({ form, operations });
  };
  // Each suggestion retains the original form and describes its own transformation.
  if (exact.startsWith("to ")) add(exact.slice(3), ["citation-to"]);
  if (/^(?:a|an|the) /u.test(exact)) add(exact.replace(/^(?:a|an|the) /u,""), ["leading-article"]);
  if (/\s+\((?:in)?formal\)$/u.test(exact)) add(exact.replace(/\s+\((?:in)?formal\)$/u,""), ["register-label"]);
  const alias = /^(.*?)\s*\(=\s*([^()]+)\)$/u.exec(exact);
  if (alias) { add(alias[1]!, ["explicit-parenthetical-alias-base"]);add(alias[2]!, ["explicit-parenthetical-alias"]); }
  const plural = /^(.*)\((s|es)\)$/u.exec(exact);
  if (plural) { add(plural[1]!, ["optional-plural-base"]);add(plural[1]!+plural[2]!, ["optional-plural-expanded"]); }
  return variants;
}

const order = (a: string,b: string) => a < b ? -1 : a > b ? 1 : 0;
export function buildVocabularyCases(intake: Intake, evidence: BankEvidence[]) {
  const evidenceById = new Map(evidence.map(e=>[e.id,e]));
  if (evidenceById.size !== evidence.length || evidence.length !== intake.bankCoverage.length) throw Error("case evidence must cover each bank occurrence exactly once");
  for (const e of evidence) if (!/^[a-f0-9]{64}$/u.test(e.sourceSha256) || !intake.bankCoverage.some(b=>b.id===e.id) || e.task && e.task.id!==e.id) throw Error("invalid bank/task evidence identity");
  const banks = intake.bankCoverage.map(b => ({ ...b, evidence: evidenceById.get(b.id)!, forms: citationCandidates(b.en) }));
  const parentCases = intake.rows.flatMap(parent => (parent.segments ?? [parent]).filter(row=>row.entry).map(row => ({ parent, row })));
  const cases = parentCases.map(({parent,row}) => {
    const entry=row.entry!; const forms=citationCandidates(entry.en);
    const candidates=banks.flatMap(bank=>{
      const matches=forms.flatMap(sourceForm=>bank.forms.filter(bankForm=>bankForm.form===sourceForm.form).map(bankForm=>({form:sourceForm.form,sourceOperations:sourceForm.operations,bankOperations:bankForm.operations})));
      if (!matches.length) return [];
      const sameGrade=bank.grade===entry.reference.grade;
      const placement=entry.reference.kind==="out-of-course-unit" ? "source-outside-course" : !sameGrade ? "different-grade" : entry.reference.unit===null ? "source-unit-unknown" : bank.unit===entry.reference.unit ? "same-unit" : "different-unit";
      return [{bank:{id:bank.id,slug:bank.slug,grade:bank.grade,unit:bank.unit,en:bank.en,de:bank.deRaw,masterSourceSha256:bank.evidence.sourceSha256}, task:bank.evidence.task,
        taskFingerprint:bank.evidence.task ? fingerprint(bank.evidence.task) : null, matches, placement,
        exactTranslation:exactTextKey(entry.de)===exactTextKey(bank.deRaw)}];
    }).sort((a,b)=>order(a.bank.id,b.bank.id));
    const source={id:row.id,parentRowId:parent.id,grade:parent.grade,sourceSha256:parent.sourceSha256,locator:parent.locator,
      raw:row.raw,span:"span" in row ? row.span : null,entry,disposition:row.state};
    const packet={source,candidates};
    return {id:row.id,fingerprint:fingerprint(packet),...packet, originalIntakeState:row.reconciliation!.state,
      meaningStatus:"unreviewed" as const,firstTaught:null,editionMapping:"unverified" as const};
  }).sort((a,b)=>order(a.id,b.id));
  const candidateBankIds=new Set(cases.flatMap(c=>c.candidates.map(b=>b.bank.id)));
  const counts={sourceOccurrences:cases.length,withExactCandidate:cases.filter(c=>c.candidates.some(b=>b.matches.some(m=>!m.sourceOperations.length&&!m.bankOperations.length))).length,
    withCitationCandidate:cases.filter(c=>c.candidates.length).length,withoutCandidate:cases.filter(c=>!c.candidates.length).length,
    excludedOccurrences:cases.filter(c=>c.source.disposition==="excluded").length,bankOccurrences:intake.bankCoverage.length,banksWithoutCandidate:intake.bankCoverage.filter(b=>!candidateBankIds.has(b.id)).length};
  return {schema:"vocabulary-source-cases@1",status:"CODEX DRAFT — NOT CANON",intakeFingerprint:fingerprint(intake),
    policy:"Candidate transformations are suggestions, not meaning identity. Source reference and exercise placement are separate observations. No first-teaching, edition mapping or runtime identity is inferred.",
    sources:intake.sources,corpusPins:intake.corpusPins,counts,cases};
}
export type VocabularyCases = ReturnType<typeof buildVocabularyCases>;
export type VocabularyCase = VocabularyCases["cases"][number];

const quote = z.object({side:z.enum(["appendix","bank","task"]),field:z.enum(["en","de","w","g","d","s"]),text:z.string().min(1)}).strict();
export const CaseDecision = z.object({
  caseId:z.string().min(1),caseFingerprint:z.string().regex(/^[a-f0-9]{64}$/u),bankId:z.string().nullable(),
  relation:z.enum(["same-meaning","different-meaning","unresolved","no-candidate","outside-course"]),
  rationale:z.string().trim().min(12),evidence:z.array(quote).min(1),
  taskAlignment:z.enum(["consistent-with-bank-meaning","conflicting","unreviewed","not-available"]),
  // An attributed offline proposal, never an authenticated semantic approval.
  author:z.string().trim().min(1),limitations:z.array(z.string().trim().min(1)).min(1),
}).strict();
export const CaseDecisions = z.object({schema:z.literal("vocabulary-case-decisions@1"),decisions:z.array(CaseDecision)}).strict();
export type CaseDecision = z.infer<typeof CaseDecision>;

export function applyCaseDecisions(book: VocabularyCases, input: unknown) {
  const parsed=CaseDecisions.parse(input);const byId=new Map(book.cases.map(c=>[c.id,c]));const seen=new Set<string>();
  const proposals=parsed.decisions.map(decision=>{
    const c=byId.get(decision.caseId);
    if (!c || c.fingerprint!==decision.caseFingerprint) throw Error("missing or stale vocabulary case decision");
    const key=JSON.stringify([decision.caseId,decision.bankId]);
    if (seen.has(key)) throw Error("duplicate vocabulary case decision");seen.add(key);
    const candidate=decision.bankId===null ? null : c.candidates.find(b=>b.bank.id===decision.bankId);
    if (decision.bankId!==null&&!candidate) throw Error("decision bank is not an evidenced candidate");
    if (["same-meaning","different-meaning"].includes(decision.relation)&&!candidate) throw Error("meaning decisions require a bank candidate");
    if (decision.relation==="no-candidate"&&(candidate||c.candidates.length)) throw Error("no-candidate decision has candidates");
    if (decision.relation==="outside-course"&&(candidate||c.source.disposition!=="excluded")) throw Error("outside-course decision does not match its source disposition");
    if (c.source.disposition==="excluded"&&decision.relation!=="outside-course"&&decision.relation!=="unresolved") throw Error("excluded source cannot acquire a course meaning decision");
    if (!candidate?.task && decision.taskAlignment!=="not-available") throw Error("task judgment requires an available candidate task");
    if (candidate?.task && decision.taskAlignment==="not-available") throw Error("available task must remain explicitly reviewed or unreviewed");
    if (["consistent-with-bank-meaning","conflicting"].includes(decision.taskAlignment) && !decision.evidence.some(e=>e.side==="task" && ["d","s"].includes(e.field))) throw Error("task judgments must cite a definition or context");
    for (const citation of decision.evidence) {
      let field: unknown;
      if (citation.side==="appendix"&&["en","de"].includes(citation.field)) field=c.source.entry[citation.field as "en"|"de"];
      else if (citation.side==="bank"&&candidate&&["en","de"].includes(citation.field)) field=candidate.bank[citation.field as "en"|"de"];
      else if (citation.side==="task"&&candidate?.task&&["w","g","d","s"].includes(citation.field)) field=candidate.task[citation.field as "w"|"g"|"d"|"s"];
      if (typeof field!=="string"||!field.includes(citation.text)) throw Error("case citation is not present in the pinned evidence field");
    }
    if (["same-meaning","different-meaning"].includes(decision.relation) && (!decision.evidence.some(e=>e.side==="appendix"&&e.field==="de") || !decision.evidence.some(e=>e.side==="bank"&&e.field==="de"))) throw Error("meaning proposals must cite both translation fields");
    return {...decision,state:"proposal-needs-independent-review" as const,verifiedMeaning:false as const,firstTaught:null};
  });
  return {...book,proposals,decisionCounts:{proposals:proposals.length,independentlyVerified:0,sourceCasesWithoutProposal:book.cases.filter(c=>!proposals.some(p=>p.caseId===c.id)).length}};
}
