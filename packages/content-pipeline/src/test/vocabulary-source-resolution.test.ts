import { test } from "node:test";
import assert from "node:assert/strict";
import { paragraphTextRuns, type DocxTextRun } from "../docx.ts";
import { sourceRows, assertSourceAccounting, buildVocabularyIntake, type AppendixSource } from "../vocabulary-intake.ts";

const run = (text: string, bold: boolean): DocxTextRun => ({ text, bold });
const source = (runs: DocxTextRun[]): AppendixSource => ({ grade: 1, sha256: "a".repeat(64), blocks: [{ kind: "paragraph", text: runs.map(r => r.text).join("").trim(), runs }] });
const complete = (s: AppendixSource) => [s, ...([2,3,4] as const).map(grade => ({ grade, sha256: String(grade).repeat(64), blocks: [] }))];

test("direct bold styles supply boundaries; adjacent split runs and source text survive", () => {
  const runs = [run("to ",true),run("answer the door",true),run(" U1/19 ",false),run("[tə ɑːnsə ðə dɔː] die Tür öffnen ",false),run("hippo (=hippopotamus)",true),run(" [hɪpəʊ] U5/9 Nilpferd",false)];
  const s = source(runs); const rows = sourceRows(s); const segments = rows[0]!.segments!;
  assert.equal(rows[0]!.state,"segmented");assert.equal(segments.length,2);
  assert.deepEqual(segments.map(s => [s.entry.en,s.entry.de,s.entry.reference.code]),[["to answer the door","die Tür öffnen","U1/19"],["hippo (=hippopotamus)","Nilpferd","U5/9"]]);
  const original = runs.map(r => r.text).join("");
  assert.equal(segments.map(s => s.raw).join(""),original);
  for (const segment of segments) assert.equal(original.slice(segment.span.start,segment.span.end),segment.raw);
  assert.equal(segments[0]!.span.runStart,0);assert.equal(segments[0]!.span.runEnd,4);
  assertSourceAccounting([s],rows);
});

test("unsupported or incomplete boundaries quarantine the whole source paragraph", () => {
  const cases = [
    [run("door U1/4 [dɔː] Tür",false)],
    [run("door",true),run(" U1/4 [dɔː] Tür window U1/16 [wɪndəʊ] Fenster",false)],
    [run("door",true),run(" U1/4 [dɔː] Tür window [wɪndəʊ] U1/16 Fenster",false)],
    [run("prefix ",false),run("door",true),run(" U1/4 [dɔː] Tür",false)],
    [run("door",true),run(" U1/4 [dɔː] Tür ",false),run("orphan",true)],
    [run("door",true),run(" nonsense [dɔː] Tür",false)],
    [run("door",true),run(" U1/4 [dɔː] ",false)],
    [run("door U1/4 [dɔː] Tür",true)],
  ];
  for (const runs of cases) { const row=sourceRows(source(runs))[0]!; assert.equal(row.state,"quarantined");assert.equal(row.segments,undefined); }
  const tamper=source([run("door",true),run(" U1/4 [dɔː] Tür",false)]);
  (tamper.blocks[0] as {text:string}).text += " omitted text";
  assert.equal(sourceRows(tamper)[0]!.state,"quarantined");
});

test("segment removal, duplicate, offset shift and translation mutation fail accounting", () => {
  const s=source([run("door",true),run(" U1/4 [dɔː] Tür ",false),run("window",true),run(" U1/16 [wɪndəʊ] Fenster",false)]);
  const original=sourceRows(s);
  for (const alter of [
    (rows:typeof original) => { rows[0]!.segments!.pop(); },
    (rows:typeof original) => { rows[0]!.segments![1]=rows[0]!.segments![0]!; },
    (rows:typeof original) => { rows[0]!.segments![0]!.span.end++; },
    (rows:typeof original) => { rows[0]!.segments![0]!.entry.de="Fenster"; },
  ]) { const rows=structuredClone(original);alter(rows);assert.throws(()=>assertSourceAccounting([s],rows),/altered source/); }
});

test("DOCX run reader honors explicit false and refuses inherited or hidden structure", () => {
  for (const tag of ['<w:b/>','<w:b w:val="1"/>','<w:b w:val="true"/>','<w:b w:val="on"/>']) {
    assert.deepEqual(paragraphTextRuns(`<w:p><w:r><w:rPr>${tag}</w:rPr><w:t>door</w:t></w:r></w:p>`),[run("door",true)]);
  }
  for (const tag of ['<w:bCs/>','<w:b w:val="0"/>','<w:b w:val="false"/>','<w:b w:val="off"/>','<w:b w:val = "false"/>','<w:b w:val= "0"/>']) {
    assert.deepEqual(paragraphTextRuns(`<w:p><w:r><w:rPr>${tag}</w:rPr><w:t>door</w:t></w:r></w:p>`),[run("door",false)]);
  }
  for (const xml of [
    '<w:p><w:r><w:rPr><w:rStyle w:val="Headword"/></w:rPr><w:t>door</w:t></w:r></w:p>',
    '<w:p><w:pPr><w:pStyle w:val="Bold"/></w:pPr><w:r><w:t>door</w:t></w:r></w:p>',
    '<w:p><w:ins><w:r><w:t>door</w:t></w:r></w:ins></w:p>',
    '<w:p><w:moveFrom><w:r><w:rPr><w:b/></w:rPr><w:t>door</w:t></w:r></w:moveFrom></w:p>',
    '<w:p><w:moveTo><w:r><w:rPr><w:b/></w:rPr><w:t>door</w:t></w:r></w:moveTo></w:p>',
    '<w:p><w:r><w:rPr><w:rPrChange><w:rPr><w:b/></w:rPr></w:rPrChange></w:rPr><w:t>door</w:t></w:r></w:p>',
    '<w:p><w:r><w:rPr><w:b w:val="maybe"/></w:rPr><w:t>door</w:t></w:r></w:p>',
    '<w:p><w:r><w:t>door</w:t></w:r><w:t>unaccounted</w:t></w:p>',
  ]) assert.equal(paragraphTextRuns(xml),undefined);
  assert.deepEqual(paragraphTextRuns('<w:p><w:r><w:t>A &amp; B</w:t><w:tab/><w:t>C</w:t><w:br/></w:r></w:p>'),[run("A & B\tC\n",false)]);
});

test("segmented words participate in reconciliation without merging senses or inventing units", () => {
  const s=source([run("about",true),run(" U1 [əbaʊt] über ",false),run("about",true),run(" U9/4 [əbaʊt] ungefähr ",false),run("guess what",true),run(" T6 [ges wɒt] rate mal",false)]);
  const bank=[{id:"g1u01.w.about",slug:"g1-u01",grade:1 as const,unit:1,en:"about",deRaw:"über"}];
  const report=buildVocabularyIntake(complete(s),bank,[{id:bank[0]!.id,slug:bank[0]!.slug,w:"about"}],[]);
  assert.equal(report.counts.accountedRows,1);assert.equal(report.counts.segmentedParagraphs,1);assert.equal(report.counts.parsedEntries,3);
  assert.deepEqual(report.rows[0]!.segments!.map(s=>s.reconciliation!.state),["exact-text-reference-match","reference-conflict","unmatched"]);
  assert.equal(report.rows[0]!.segments![2]!.entry.reference.unit,null);
  assert.equal(report.rows[0]!.segments![0]!.reconciliation!.verifiedMeaning,false);
  assert.equal(report.bankCoverage[0]!.appendixRows.length,2);
});

test("valid source unit outside course is explicitly excluded without renumbering or deletion", () => {
  const input=complete(source([]));
  input[3]={grade:4,sha256:"4".repeat(64),blocks:[{kind:"table",rows:[["Headword","Reference","German"],["brain","U14/3","Gehirn"],["brain","U13/3","Gehirn"],["brain","U0/3","Gehirn"]]}]};
  const report=buildVocabularyIntake(input,[],[],[]);
  const rows=report.rows.filter(r=>r.grade===4);
  assert.equal(rows[1]!.state,"excluded");assert.equal(rows[1]!.entry!.reference.unit,14);
  assert.equal(rows[1]!.reconciliation!.state,"outside-current-course");
  assert.equal(rows[2]!.state,"parsed");assert.equal(rows[3]!.state,"quarantined");
  assert.equal(report.counts.excludedEntries,1);
});


test("partial following prior-book and invalid-unit entries are never absorbed as German", () => {
  for (const grade of [1,2,3,4] as const) {
    for (const reference of ["MORE 1","MORE 2","MORE 3","MORE 4","U0/3","U99/3","OYW2","TGND1","DSC"]) {
      for (const detail of [`${reference} [muːn] Mond`,`[muːn] ${reference} Mond`]) {
        const s=source([run("sun",true),run(` U1 [sʌn] Sonne moon ${detail}`,false)]);s.grade=grade;
        assert.equal(sourceRows(s)[0]!.state,"quarantined",`grade ${grade}: ${detail}`);
      }
    }
  }
  assert.equal(sourceRows(source([run("sun",true),run(" U1 [sʌn] Sonne [selten]",false)]))[0]!.state,"segmented");
});
