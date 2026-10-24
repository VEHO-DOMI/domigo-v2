/** Evidence-only continuation. No meaning decision, source rewrite or runtime release. */
import type { VocabItem } from "@domigo/content-schema";
import { fingerprint, type buildVocabularyIntake } from "./vocabulary-intake.ts";
import { buildVocabularyCases, type VocabularyCase } from "./vocabulary-cases.ts";
import type { buildActivityEvidence } from "./activity-evidence.ts";
import { prerequisiteLexicon, taskPrerequisites } from "./vocabulary-prerequisites.ts";

type Intake = ReturnType<typeof buildVocabularyIntake>;
type Activity = ReturnType<typeof buildActivityEvidence>;
type Evidence = { id: string; sourceSha256: string; task: VocabItem | null };
export type PriorSample = { id: string; sourceFingerprint: string };
export type PriorCalibration = { artifact: string; sha256: string; records: Array<{ recordId: string; task: { fingerprint: string } }> };
const order = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0;
const tally = (values: string[]) => Object.fromEntries([...new Set(values)].sort(order).map(k=>[k,values.filter(v=>v===k).length]));

/** A page marker remains a transcription claim. It is not a PDF/edition binding. */
function sourcePages(intake: Intake) {
  const pages = new Map<string, { markerText: string; locator: { block: number; row: number | null }; claimedPrintedPage: number } | null>();
  for (const grade of [1,2,3,4]) {
    let marker: NonNullable<ReturnType<typeof pages.get>> | null = null;
    for (const row of intake.rows.filter(r=>r.grade===grade)) {
      if (row.reason === "page-marker") {
        const raw = row.raw[0]!, match = /^(?:— p\. )?(\d+)(?: —)?$/u.exec(raw);
        if (match) marker = { markerText: raw, locator: row.locator, claimedPrintedPage: Number(match[1]) };
      }
      pages.set(row.id,marker);
    }
  }
  return pages;
}

function partition(c: VocabularyCase) {
  if (c.source.disposition === "excluded") return "outside-course";
  if (!c.candidates.length) return "no-citation-candidate";
  if (c.source.entry.reference.unit === null) return "unit-unresolved";
  if (!c.candidates.some(x=>x.placement==="same-unit")) return "reference-conflict";
  if (c.candidates.length > 1) return "multiple-candidates";
  if (!c.candidates[0]!.exactTranslation) return "translation-different";
  return "normalized-single-candidate";
}

export function buildSourceWave(intake: Intake, evidence: Evidence[], activity: Activity, priorSample: PriorSample[], calibration?: PriorCalibration) {
  const { fingerprint: activityPin, ...activityBody } = activity;
  if (fingerprint(activityBody) !== activityPin) throw Error("activity evidence fingerprint differs");
  const cases = buildVocabularyCases(intake,evidence), byCase = new Map(cases.cases.map(c=>[c.id,c]));
  const previous = new Set<string>();
  for (const prior of priorSample) {
    const found = byCase.get(prior.id);
    if (previous.has(prior.id) || !found || fingerprint(found.source)!==prior.sourceFingerprint) throw Error("prior sample is missing, duplicate or source-stale");
    previous.add(prior.id);
  }
  const taskIds = evidence.filter(e=>e.task).map(e=>e.id);
  if (activity.tasks.length !== taskIds.length || new Set(activity.tasks.map(t=>t.id)).size !== taskIds.length || activity.tasks.some(t=>!taskIds.includes(t.id))) throw Error("activity/task evidence coverage differs");
  for (const pin of activity.corpusPins) {
    const shared = intake.corpusPins.find(p=>p.path===pin.path);
    if (shared && shared.sha256!==pin.sha256) throw Error("mixed corpus snapshots");
  }
  const pages = sourcePages(intake);
  const sourceRecords = cases.cases.map(c => ({ ...c.source, sourceFingerprint: fingerprint(c.source), originalClass: c.originalIntakeState,
    priorSample: previous.has(c.id), partition: partition(c),
    page: { transcriptionMarker: pages.get(c.source.parentRowId) ?? null, originalPdfVerified: false, convention: "nearest preceding explicit transcription marker; unknown before first marker, never an inferred PDF page" },
    candidateIds: c.candidates.map(x=>x.bank.id), meaningId: null, firstTaught: null, verifiedMeaning: false }));
  const links = cases.cases.flatMap(c => {
    if (previous.has(c.id) || c.source.disposition === "excluded" || c.candidates.length !== 1) return [];
    const x = c.candidates[0]!, entry = c.source.entry;
    if (x.placement !== "same-unit" || entry.en !== x.bank.en || entry.de !== x.bank.de || !x.task || x.task.w !== x.bank.en || x.task.g !== x.bank.de) return [];
    return [{ id: `link:${c.id}:${x.bank.id}`, status: "evidence-only", sourceOccurrenceId: c.id,
      sourceFingerprint: fingerprint(c.source), sourceSha256: c.source.sourceSha256, locator: c.source.locator, span: c.source.span,
      pageMarker: pages.get(c.source.parentRowId) ?? null, quotation: c.source.raw, word: entry.en, german: entry.de,
      taskId: x.task.id, taskFingerprint: x.taskFingerprint, masterSourceSha256: x.bank.masterSourceSha256, chapter: x.bank.slug,
      match: "literal-word-and-gloss; singleton-candidate; same-reference-unit; current-task-word-and-gloss", verifiedMeaning: false, firstTaught: null }];
  });
  const linkSources = new Set(links.map(l=>l.sourceOccurrenceId));
  const decisionKinds = ["meaning-review","ambiguous","reference-conflict","section-reference-review"];
  const decisions = cases.cases.filter(c=>c.source.grade>1 && decisionKinds.includes(c.originalIntakeState)).map(c => {
    const ref = c.source.entry.reference;
    return { id: `decision:${c.id}`, caseId: c.id, caseFingerprint: c.fingerprint, kind: c.originalIntakeState, priorSample: previous.has(c.id),
      question: `Welche Beziehung ist für „${c.source.entry.en}“ (${c.source.entry.de}) zwischen der Quellstelle ${ref.code} und den zitierten Aufgaben belegt?`,
      source: c.source, pageMarker: pages.get(c.source.parentRowId) ?? null,
      candidates: c.candidates.map(x=>({ bank: x.bank, placement: x.placement, matches: x.matches, exactTranslation: x.exactTranslation,
        task: x.task ? { id:x.task.id, word:x.task.w, german:x.task.g, definition:x.task.d, context:x.task.s } : null, taskFingerprint:x.taskFingerprint })),
      options: [
        { id:"A", text:"Nach Originalprüfung: denselben Bedeutungsgebrauch gesondert bestätigen; Kapitelvorkommen bleiben getrennt." },
        { id:"B", text:"Nach Originalprüfung: unterschiedliche Bedeutungen oder eine separat belegte Quellenkorrektur festhalten." },
        { id:"C", text:"Bis zur Originalprüfung unentschieden lassen; keine Kategorie, Antwortmenge oder Erstunterrichtsangabe ableiten." },
      ],
      recommendation: { option:"C", reason:`Die Quelle nennt ${ref.code}; ${c.candidates.length} Zitierform-Kandidat(en) stehen gegenüber. Die Klasse ${c.originalIntakeState} verlangt einen Bedeutungs-/Referenznachweis über Schreibweise hinaus.`, kind:"verification-order-only" },
      decision: null, verifiedMeaning: false, firstTaught: null };
  });
  const unmatchedTables = sourceRecords.filter(s=>s.grade>1 && s.originalClass==="unmatched").map(s=>({ sourceOccurrenceId:s.id, grade:s.grade,
    classification:s.page.transcriptionMarker ? "page-located-original-review-pending" : "transcription-present-page-unlocated", pageMarker:s.page.transcriptionMarker,
    interpretation:"No original exact bank-text match; source headword is present. Not a missing exercise." }));
  const yearOneSegments = sourceRecords.filter(s=>s.grade===1 && s.span!==null).map(s=>({sourceOccurrenceId:s.id,classification:"lossless-year-one-paragraph-entry",pageMarker:s.page.transcriptionMarker}));
  const lexicon = prerequisiteLexicon(cases.cases.map(c=>c.source));
  if(calibration && (new Set(calibration.records.map(r=>r.recordId)).size!==calibration.records.length || calibration.records.some(r=>!evidence.some(e=>e.id===r.recordId)))) throw Error("prior calibration record coverage differs");
  const draftRecords = [...evidence].sort((a,b)=>order(a.id,b.id)).map(e => {
    const bank = intake.bankCoverage.find(b=>b.id===e.id)!;
    const act = activity.tasks.find(t=>t.id===e.id) ?? null;
    if (e.task && act && act.taskFingerprint!==fingerprint(e.task)) throw Error("activity task fingerprint differs from captured task");
    const sourceOccurrences = cases.cases.filter(c=>c.candidates.some(x=>x.bank.id===e.id)).map(c=>c.id);
    const literalLinks = links.filter(l=>l.taskId===e.id).map(l=>l.id);
    const task = e.task;
    const priorCalibration = calibration?.records.find(r=>r.recordId===e.id);
    return { recordId:e.id, chapter:bank.slug, grade:bank.grade, unit:bank.unit,
      status:literalLinks.length ? "literal-source-linked-draft" : "source-relationship-unresolved-draft", meaningId:null, firstTaught:null, verifiedMeaning:false,
      bank:{word:bank.en,german:bank.deRaw,masterSourceSha256:e.sourceSha256}, sourceOccurrenceIds:sourceOccurrences, evidenceLinkIds:literalLinks,
      task:task ? { id:task.id, rev:task.rev, fingerprint:fingerprint(task), currentDefinition:task.d, currentContext:task.s,
        retrievalDirections:[{kind:"definition-to-en",prompt:task.d,answers:task.dAnswers},{kind:"context-to-en",prompt:task.s,answers:task.sAnswers},{kind:"de-to-en",prompt:task.g,answers:task.translation.deToEn},{kind:"en-to-de",prompt:task.w,answers:task.translation.enToDe}],
        provenance:task.provenance, sourceTextChanged:false } : null,
      prerequisites:task ? taskPrerequisites(task,bank.grade,bank.unit,lexicon) : null,
      priorCalibration:priorCalibration ? {artifact:calibration!.artifact,sha256:calibration!.sha256,recordId:e.id,taskFingerprint:priorCalibration.task.fingerprint,
        taskBinding:task&&fingerprint(task)===priorCalibration.task.fingerprint ? "current" : "stale",
        scope:"Historical diagnostic/source/image proposals remain at the referenced record. Only the task fingerprint is rechecked here; this is not semantic approval or a current Activity ruling."} : null,
      contextReview:{status:"unreviewed",principle:"One or two connected sentences must distinguish the intended meaning; existing length alone is not quality approval."},
      imageDisposition:{status:"not-assessed",reason:"Requires meaning and visual calibration; Activity mode alone does not establish illustration eligibility.",allowedReviewChoices:["single-scene","sequence-or-motion","non-visual-with-reason"],image:null},
      activity:{originalClassification:act?.classification??null,sourceCandidates:act?.candidates??[],teacherDecision:act?.teacherDecision??null,teacherDecisionStatus:act?.teacherDecisionStatus??"absent",overlappingModes:"unreviewed",illustrationApproval:false},
      runtime:false,approved:false };
  });
  const remaining = sourceRecords.filter(s=>!s.priorSample);
  const counts = { sourceOccurrences:sourceRecords.length,previousSample:previous.size,remainingOccurrences:remaining.length,
    remainingPartition:tally(remaining.map(s=>s.partition)),literalEvidenceLinks:links.length,literalLinkedOccurrences:linkSources.size,
    remainingWithoutLiteralLink:remaining.filter(s=>!linkSources.has(s.id)).length,linkCountsByGrade:tally(links.map(l=>String(byCase.get(l.sourceOccurrenceId)!.source.grade))),
    historicalTableClasses:tally(sourceRecords.filter(s=>s.grade>1).map(s=>s.originalClass)),decisionSheets:decisions.length,decisionSheetsByClass:tally(decisions.map(d=>d.kind)),
    decisionsInPreviousSample:decisions.filter(d=>d.priorSample).length,unmatchedTableOccurrences:unmatchedTables.length,unmatchedByGrade:tally(unmatchedTables.map(r=>String(r.grade))),
    unmatchedPageClasses:tally(unmatchedTables.map(r=>r.classification)),yearOneParagraphEntries:yearOneSegments.length,
    draftRecords:draftRecords.length,chapters:new Set(draftRecords.map(r=>r.chapter)).size,verifiedMeanings:0,approvedPrerequisites:0,approvedImages:0 };
  const report = { schema:"vocabulary-source-wave@1",label:"CODEX DRAFT — NOT CANON",runtime:false,approved:false,
    policy:"Literal links are evidence only. Normalized/citation candidates, source meanings, first teaching, grammar prerequisites and visual suitability are never automatically approved. Prior sample membership is provenance, not a current approval.",
    intakeFingerprint:fingerprint(intake),activityFingerprint:activity.fingerprint,priorSample:[...priorSample].sort((a,b)=>order(a.id,b.id)),
    sourcePins:intake.sources,corpusPins:[...new Map([...intake.corpusPins,...activity.corpusPins].map(p=>[p.path,p])).values()].sort((a,b)=>order(a.path,b.path)),
    sourceRecords,links,decisions,unmatchedTables,yearOneSegments,draftIndex:{schema:"vocabulary-index@draft",runtime:false,approved:false,
      prerequisiteLexicon:Object.fromEntries([...lexicon.entries()].sort(([a],[b])=>order(a,b))),records:draftRecords},
    activitySources:activity.sources,counts };
  return { ...report, fingerprint:fingerprint(report) };
}

/** Rebuild rather than trusting either reported counts or a caller's approval. */
export function assertSourceWave(intake: Intake, evidence: Evidence[], activity: Activity, prior: PriorSample[], artifact: unknown) {
  if (JSON.stringify(buildSourceWave(intake,evidence,activity,prior)) !== JSON.stringify(artifact)) throw Error("source wave differs from original inputs");
}
