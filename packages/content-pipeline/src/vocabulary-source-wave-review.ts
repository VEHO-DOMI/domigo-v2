/** Review documents derived from one captured wave; never student-facing content. */
import type { buildSourceWave } from "./vocabulary-source-wave.ts";
type Wave = ReturnType<typeof buildSourceWave>;
const pretty=(value:unknown)=>JSON.stringify(value,null,2)+"\n";
// One record per line keeps generated source and task evidence diffable without
// repeating indentation millions of times. No evidence is abbreviated.
const records=(header:Record<string,unknown>,key:string,rows:unknown[])=>JSON.stringify(header,null,2).slice(0,-2)+`,\n  ${JSON.stringify(key)}: [\n`+rows.map(r=>"    "+JSON.stringify(r)).join(",\n")+"\n  ]\n}\n";
const quote=(value:unknown)=>"    "+JSON.stringify(value)+"\n";
export function sourceWaveReviewFiles(wave:Wave):Record<string,string> {
  const meta={label:wave.label,runtime:false,approved:false,waveFingerprint:wave.fingerprint};
  const chapters=[...new Set(wave.draftIndex.records.map(r=>r.chapter))].sort();
  const files:Record<string,string>={
    "source-decisions-wave-2.json":records({schema:"vocabulary-source-decisions@draft",...meta,counts:wave.counts.decisionSheetsByClass},"decisions",wave.decisions),
    "source-links-wave-2.json":records({schema:"vocabulary-source-links@draft",...meta,count:wave.links.length},"links",wave.links),
    "source-occurrences-wave-2.json":records({schema:"vocabulary-source-occurrences@draft",...meta,sourcePins:wave.sourcePins,corpusPins:wave.corpusPins,counts:wave.counts,priorSample:wave.priorSample,unmatchedTables:wave.unmatchedTables,yearOneSegments:wave.yearOneSegments},"sources",wave.sourceRecords),
    "activity-sources-wave-2.json":pretty({schema:"activity-source-observations@draft",...meta,activityFingerprint:wave.activityFingerprint,sources:wave.activitySources}),
    "vocabulary-index-wave-2.json":pretty({schema:wave.draftIndex.schema,...meta,sourceRegistry:"source-occurrences-wave-2.json",sourceLinks:"source-links-wave-2.json",activitySources:"activity-sources-wave-2.json",count:wave.draftIndex.records.length,
      chapters:chapters.map(chapter=>({chapter,path:`vocabulary-index-wave-2/${chapter}.json`,count:wave.draftIndex.records.filter(r=>r.chapter===chapter).length})),
      prerequisiteLexicon:wave.draftIndex.prerequisiteLexicon}),
  };
  for(const chapter of chapters)files[`vocabulary-index-wave-2/${chapter}.json`]=records({schema:wave.draftIndex.schema,...meta,chapter,sharedLexicon:"../vocabulary-index-wave-2.json",sourceRegistry:"../source-occurrences-wave-2.json"},"records",wave.draftIndex.records.filter(r=>r.chapter===chapter));
  let markdown="# Quellen-Entscheidungsblätter · Welle 2\n\nCODEX DRAFT — NOT CANON. Kein Blatt trifft einen Bedeutungsentscheid.\n\n";
  markdown+=`${wave.decisions.length} Blätter: ${Object.entries(wave.counts.decisionSheetsByClass).map(([name,n])=>`${name}: ${n}`).join(", ")}. Davon gehören ${wave.counts.decisionsInPreviousSample} zur früheren ${wave.counts.previousSample}er-Stichprobe; sie sind hier gekennzeichnet, nicht nochmals freigegeben.\n\n`;
  markdown+="Die Empfehlung C beschreibt den nächsten Prüfschritt, keinen inhaltlichen Entscheid. A/B dürfen erst nach Prüfung der Originalseiten gewählt werden. Die Quellkennung bleibt stabil, solange die Quelldatei unverändert bleibt; der Fall-Prüfwert bindet zusätzlich die aktuellen Kandidaten. Seitenmarker sind Angaben des Transkripts; gedruckte Seite und Ausgabe sind dadurch nicht bestätigt.\n\n";
  markdown+=`Maschinenlesbare Entsprechung: source-decisions-wave-2.json. Gesamtprüfwert: ${wave.fingerprint}.\n\n`;
  for(const d of wave.decisions) {
    markdown+=`## ${d.id}\n\n${d.question.replaceAll("<","&lt;").replaceAll(">","&gt;")}\n\nKlasse: ${d.kind}; frühere Stichprobe: ${d.priorSample?"ja":"nein"}. Fall-Prüfwert: ${d.caseFingerprint}.\n\nQuellzeile wörtlich (JSON-Zeichenkodierung):\n\n${quote(d.source.raw)}\nQuellenort:\n\n${quote({sha256:d.source.sourceSha256,locator:d.source.locator,span:d.source.span,pageMarker:d.pageMarker})}\nKandidaten:\n\n`;
    markdown+=d.candidates.length?d.candidates.map(c=>quote(c)).join("\n"):"Keine Zitierform-Kandidaten.\n";
    markdown+="\n"+d.options.map(o=>`- ${o.id}: ${o.text}`).join("\n")+`\n\nEmpfehlung ${d.recommendation.option}: ${d.recommendation.reason}\n\nEntscheid: offen. Bedeutung und erster Unterricht: nicht bestätigt.\n\n`;
  }
  files["source-decisions-wave-2.md"]=markdown;
  return files;
}
