/** Source observations and separately supplied, reviewed teacher decisions.
 * No approval is inferred from source matches, audit prose or override inputs. */
import { createHash } from "node:crypto";
import { z } from "zod";
import ts from "typescript";
import { ActivityTeacherDecisions } from "@domigo/content-schema";

export class ActivityEvidenceError extends Error {}

const grade=z.union([z.literal(1),z.literal(2),z.literal(3),z.literal(4)]);
const mode=z.enum(["draw","show","explain"]);
const nonblank=z.string().refine(s=>s.trim().length>0);
const sha=z.string().regex(/^[a-f0-9]{64}$/u);
export const SourceAlias=z.string().regex(/^[a-z][a-z0-9-]{0,47}$/u);
const Blob=z.object({alias:SourceAlias,bytes:z.instanceof(Uint8Array)}).strict();
const Source=z.object({grade,data:Blob,audit:Blob.nullable(),overrides:Blob.nullable(),notes:z.array(Blob)}).strict();
const Task=z.object({id:nonblank,grade,unit:z.number().int().positive(),w:nonblank,g:nonblank,taskFingerprint:sha}).strict();
const Classification=z.object({id:nonblank,word:nonblank,mode}).strict();
const ExpectedSource=z.object({grade,sha256:sha,originalEntries:z.number().int().nonnegative(),matched:z.number().int().nonnegative(),canonicalEntries:z.number().int().nonnegative()}).strict();
const Pin=z.object({path:z.string().regex(/^(?:content\/corpus\/units\/g[1-4]-u\d{2}\/vocab\.json|content\/overlays\/item-fixes\.json|apps\/web\/lib\/activity\/(?:categories|teacher-decisions)\.json)$/u),sha256:sha}).strict();
const Input=z.object({sources:z.array(Source).length(4),tasks:z.array(Task),classifications:z.array(Classification),teacherDecisions:ActivityTeacherDecisions.default([]),expectedSources:z.array(ExpectedSource).length(4),corpusPins:z.array(Pin)}).strict();
export type ActivityEvidenceInput=z.infer<typeof Input>;
type BlobInput=z.infer<typeof Blob>;
export const activityHash=(bytes:Uint8Array)=>createHash("sha256").update(bytes).digest("hex");
const fingerprint=(value:unknown)=>activityHash(Buffer.from(JSON.stringify(value)));
const order=(a:string,b:string)=>a<b?-1:a>b?1:0;
const wordRow=z.object({unit:z.number().int().positive(),w:nonblank,g:nonblank,cat:mode}).strict();

/** Parse only literal data assignments. Comments are syntax, never candidate word rows. */
export function parseActivityRows(text:string) {
  const diagnostics=ts.transpileModule(text,{fileName:"activity-input.js",reportDiagnostics:true,compilerOptions:{allowJs:true,target:ts.ScriptTarget.ES2023,module:ts.ModuleKind.ESNext}}).diagnostics??[];
  if(diagnostics.some(d=>d.category===ts.DiagnosticCategory.Error))throw new ActivityEvidenceError("invalid activity JavaScript syntax");
  const file=ts.createSourceFile("activity-input.js",text,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);
  let words:ts.ArrayLiteralExpression|undefined;let titles=false;
  for(const statement of file.statements) {
    if(!ts.isExpressionStatement(statement)||!ts.isBinaryExpression(statement.expression))throw new ActivityEvidenceError("activity source must contain literal data assignments only");
    const expression=statement.expression;
    if(expression.operatorToken.kind!==ts.SyntaxKind.EqualsToken||!ts.isPropertyAccessExpression(expression.left)||!ts.isIdentifier(expression.left.expression)||expression.left.expression.text!=="window")throw new ActivityEvidenceError("unsupported activity assignment");
    if(expression.left.name.text==="ACTIVITY_WORDS") {
      if(words||!ts.isArrayLiteralExpression(expression.right))throw new ActivityEvidenceError("activity data requires one literal word array");
      words=expression.right;
    } else if(expression.left.name.text==="ACTIVITY_UNIT_TITLES") {
      if(titles||!ts.isObjectLiteralExpression(expression.right)||expression.right.properties.some(p=>!ts.isPropertyAssignment(p)||!(ts.isStringLiteral(p.name)||ts.isNumericLiteral(p.name))||!ts.isStringLiteral(p.initializer)))throw new ActivityEvidenceError("unsupported activity unit-title data");
      titles=true;
    } else throw new ActivityEvidenceError("unsupported activity assignment");
  }
  if(!words)throw new ActivityEvidenceError("activity data requires one literal word array");
  return words.elements.map((element,i)=>{
    const line1=file.getLineAndCharacterOfPosition(element.getStart(file)).line+1;
    if(!ts.isObjectLiteralExpression(element))throw new ActivityEvidenceError(`unsupported activity data row at line ${line1}`);
    const values:Record<string,unknown>={};
    for(const property of element.properties) {
      if(!ts.isPropertyAssignment(property)||!(ts.isIdentifier(property.name)||ts.isStringLiteral(property.name)))throw new ActivityEvidenceError(`unsupported activity data property at line ${line1}`);
      const key=property.name.text;
      if(!["unit","w","g","cat"].includes(key)||Object.hasOwn(values,key))throw new ActivityEvidenceError(`unexpected or duplicate activity field at line ${line1}`);
      if(key==="unit") {
        if(!ts.isNumericLiteral(property.initializer)||! /^[1-9]\d*$/u.test(property.initializer.getText(file)))throw new ActivityEvidenceError(`invalid activity unit at line ${line1}`);
        values[key]=Number(property.initializer.text);
      } else {
        if(!ts.isStringLiteral(property.initializer))throw new ActivityEvidenceError(`activity field is not a string literal at line ${line1}`);
        values[key]=property.initializer.text;
      }
    }
    try {return {...wordRow.parse(values),record:i+1,line1};}
    catch {throw new ActivityEvidenceError(`invalid activity data fields at line ${line1}`);}
  });
}

/** Logical CSV cells preserve embedded line endings; locators address physical source lines. */
export function parseEvidenceCsv(text:string) {
  if(text.startsWith("\uFEFF"))text=text.slice(1);
  const rows:Array<{record:number;line1:number;lineEnd:number;fields:string[]}>=[];
  let fields:string[]=[],field="",quoted=false,afterQuote=false,line=1,startLine=1,started=false;
  const finishField=()=>{fields.push(field);field="";afterQuote=false;};
  const finishRow=()=>{finishField();rows.push({record:rows.length+1,line1:startLine,lineEnd:line,fields});fields=[];started=false;};
  for(let i=0;i<text.length;i++) {
    const c=text[i]!;
    if(quoted) {
      if(c==='"') {if(text[i+1]==='"'){field+='"';i++;}else {quoted=false;afterQuote=true;}}
      else {field+=c;if(c==='\n')line++;else if(c==='\r'&&text[i+1]!=='\n')line++;}
      continue;
    }
    if(c===','){finishField();started=true;continue;}
    if(c==='\r'||c==='\n') {
      finishRow();if(c==='\r'&&text[i+1]==='\n')i++;line++;startLine=line;continue;
    }
    if(afterQuote)throw new ActivityEvidenceError(`unexpected CSV character after closing quote at line ${line}`);
    if(c==='"') {if(field.length)throw new ActivityEvidenceError(`unexpected CSV quote at line ${line}`);quoted=true;started=true;}
    else {field+=c;started=true;}
  }
  if(quoted)throw new ActivityEvidenceError("unterminated CSV quoted field");
  if(started||fields.length||field.length||afterQuote)finishRow();
  return rows;
}

const decode=(bytes:Uint8Array)=>{
  try{return new TextDecoder("utf-8",{fatal:true}).decode(bytes);}
  catch{throw new ActivityEvidenceError("activity evidence must be valid UTF-8");}
};
const metadata=(blob:BlobInput)=>({alias:blob.alias,sha256:activityHash(blob.bytes),bytes:blob.bytes.byteLength});
function csvRows(blob:BlobInput,header:string[]) {
  const rows=parseEvidenceCsv(decode(blob.bytes));
  if(!rows.length||JSON.stringify(rows[0]!.fields)!==JSON.stringify(header))throw new ActivityEvidenceError("unexpected activity CSV header");
  for(const row of rows.slice(1))if(row.fields.length!==header.length)throw new ActivityEvidenceError(`activity CSV column count at line ${row.line1}`);
  return rows.slice(1);
}
const unitCell=(cell:string,line:number)=>{
  if(!/^[1-9]\d*$/u.test(cell)||!Number.isSafeInteger(Number(cell)))throw new ActivityEvidenceError(`invalid CSV unit at line ${line}`);
  return Number(cell);
};
const checkUnique=(values:string[],kind:string)=>{if(new Set(values).size!==values.length)throw new ActivityEvidenceError(`duplicate activity ${kind}`);};

export function buildActivityEvidence(input:unknown) {
  const parsed=Input.parse(input);
  checkUnique(parsed.sources.map(s=>String(s.grade)),"source grade");
  checkUnique(parsed.expectedSources.map(s=>String(s.grade)),"expected source grade");
  checkUnique(parsed.sources.flatMap(s=>[s.data,s.audit,s.overrides,...s.notes].filter((x):x is BlobInput=>x!==null).map(x=>x.alias)),"source alias");
  checkUnique(parsed.tasks.map(t=>t.id),"task identity");
  checkUnique(parsed.classifications.map(c=>c.id),"classification identity");
  checkUnique(parsed.corpusPins.map(p=>p.path),"corpus pin");
  for(const task of parsed.tasks)if(!task.id.startsWith(`g${task.grade}u${String(task.unit).padStart(2,"0")}.w.`))throw new ActivityEvidenceError("activity task placement disagrees with identity");
  const taskIds=new Set(parsed.tasks.map(t=>t.id));
  if(parsed.classifications.some(c=>!taskIds.has(c.id)))throw new ActivityEvidenceError("unaccounted activity classification outside current tasks");
  if(parsed.teacherDecisions.some(c=>!taskIds.has(c.taskId)))throw new ActivityEvidenceError("unaccounted teacher decision outside current tasks");
  const sources=[...parsed.sources].sort((a,b)=>a.grade-b.grade).map(source=>{
    const pin=metadata(source.data);
    const rows=parseActivityRows(decode(source.data.bytes)).map(row=>({id:`activity:g${source.grade}:${pin.sha256}:${row.record}`, ...row}));
    const expected=parsed.expectedSources.find(s=>s.grade===source.grade)!;
    const audit=source.audit===null?null:(()=>{
      const raw=csvRows(source.audit,["unit","w","g","cat","confidence","justification"]);
      const auditRows=raw.map(row=>{
        const [unit,w,g,cat,confidence,justification]=row.fields;
        const fields=wordRow.parse({unit:unitCell(unit!,row.line1),w,g,cat});
        if(!["high","medium","low",""].includes(confidence!))throw new ActivityEvidenceError(`invalid audit confidence at line ${row.line1}`);
        return {...fields,confidence:confidence!,justification:justification!,record:row.record,line1:row.line1,lineEnd:row.lineEnd};
      });
      const aligned=rows.length===auditRows.length&&rows.every((r,i)=>r.unit===auditRows[i]!.unit&&r.w===auditRows[i]!.w&&r.cat===auditRows[i]!.cat);
      return {...metadata(source.audit),alignment:{status:aligned?"ordered-unit-word-mode-match" as const:"different-pool" as const,germanDifferences:aligned?rows.filter((r,i)=>r.g!==auditRows[i]!.g).length:null},
        rows:auditRows.map((r,i)=>({...r,sourceRowId:aligned?rows[i]!.id:null}))};
    })();
    const overrides=source.overrides===null?null:(()=>{
      const raw=csvRows(source.overrides,["unit","w","cat"]);
      const decisionRows=raw.map(row=>{
        const [unit,w,cat]=row.fields;
        const fields=z.object({unit:z.number().int().positive(),w:nonblank,cat:mode}).strict().parse({unit:unitCell(unit!,row.line1),w,cat});
        return {...fields,record:row.record,line1:row.line1,lineEnd:row.lineEnd,sourceRowIds:rows.filter(r=>r.unit===fields.unit&&r.w===fields.w).map(r=>r.id),approval:"unverified-source-input" as const};
      });
      return {...metadata(source.overrides),state:decisionRows.length?"present-rows" as const:"present-empty" as const,rows:decisionRows};
    })();
    return {grade:source.grade,data:{...pin,rows},expected,provenance:{hashMatches:pin.sha256===expected.sha256,rowCountMatches:rows.length===expected.originalEntries},audit,overrides,
      notes:source.notes.map(note=>({...metadata(note),interpretation:"metadata-only-not-a-decision" as const})).sort((a,b)=>order(a.alias,b.alias))};
  });
  const classifications=new Map(parsed.classifications.map(c=>[c.id,c]));
  const decisions=new Map(parsed.teacherDecisions.map(c=>[c.taskId,c]));
  const tasks=[...parsed.tasks].sort((a,b)=>order(a.id,b.id)).map(task=>{
    const saved=classifications.get(task.id)??null;
    const teacherDecision=decisions.get(task.id)??null;
    const teacherDecisionStatus=teacherDecision===null?"absent" as const:teacherDecision.word===task.w&&teacherDecision.german===task.g?"current" as const:"task-word-or-gloss-differs" as const;
    const classificationStatus=saved===null?"missing" as const:saved.word===task.w?"present" as const:"saved-word-differs" as const;
    const candidates=sources.find(s=>s.grade===task.grade)!.data.rows.filter(r=>r.w===task.w).map(row=>({sourceRowId:row.id,sameUnit:row.unit===task.unit,exactGloss:row.g===task.g,modeAgrees:classificationStatus!=="present"?null:saved!.mode===row.cat}));
    return {...task,classification:saved,classificationStatus,teacherDecision,teacherDecisionStatus,candidates,meaningId:null,verifiedMeaning:false as const,firstTaught:null};
  });
  const counts={sourceRows:sources.reduce((n,s)=>n+s.data.rows.length,0),auditRows:sources.reduce((n,s)=>n+(s.audit?.rows.length??0),0),overrideRows:sources.reduce((n,s)=>n+(s.overrides?.rows.length??0),0),
    sourceHashMismatches:sources.filter(s=>!s.provenance.hashMatches).length,tasks:tasks.length,classifications:parsed.classifications.length,missingClassifications:tasks.filter(t=>t.classificationStatus==="missing").length,
    savedWordDifferences:tasks.filter(t=>t.classificationStatus==="saved-word-differs").length,tasksWithoutExactWordCandidate:tasks.filter(t=>!t.candidates.length).length,approvedMappings:0,
    teacherDecisionRecords:parsed.teacherDecisions.length,approvedTeacherDecisions:tasks.filter(t=>t.teacherDecisionStatus==="current").length,staleTeacherDecisions:tasks.filter(t=>t.teacherDecisionStatus==="task-word-or-gloss-differs").length};
  const report={schema:"activity-source-evidence@1",status:"CODEX DRAFT — NOT CANON",policy:"Exact source words suggest candidates within the same year, including other units. No normalization, meaning identity, first teaching, teacher approval, illustration eligibility or runtime category is inferred. Original rows, audit rationale, override inputs and explicit reviewed teacher decisions remain separate. Teacher decisions bind to exact task ID, word and German gloss; stale decisions are retained without active approval. Notes are fingerprinted only, not interpreted as decisions.",
    corpusPins:[...parsed.corpusPins].sort((a,b)=>order(a.path,b.path)),sources,tasks,counts};
  return {...report,fingerprint:fingerprint(report)};
}

/** Re-derive from inputs: changing, omitting or duplicating any evidence fails equality. */
export function assertActivityEvidence(input:unknown,artifact:unknown):void {
  if(JSON.stringify(buildActivityEvidence(input))!==JSON.stringify(artifact))throw new ActivityEvidenceError("activity evidence differs from its source/corpus inputs");
}
