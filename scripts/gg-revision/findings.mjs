// CODEX DRAFT — NOT CANON. Historical reader evidence is not current approval.
import fs from 'node:fs';
import path from 'node:path';
import { canonical, compareIds, sha256 } from './core.mjs';
export const pins = JSON.parse(fs.readFileSync(new URL('./findings-pins.json', import.meta.url)));
export function readFindingsEvidence(root) {
  return Object.fromEntries(Object.entries(pins.readers).map(([reader, files]) => [reader,
    Object.fromEntries(Object.entries(files).map(([kind, pin]) => {
      const bytes = fs.readFileSync(path.join(root, pin.path));
      if (sha256(bytes) !== pin.sha256) throw new Error(`INPUT_DRIFT:${reader}:${kind}`);
      return [kind, kind === 'report' ? bytes.toString() : JSON.parse(bytes)];
    }))]));
}
export function findingsErrors(register, evidence, requireRelease = false) {
  const errors = [];
  if (register.schema !== 'revision-findings@1') errors.push('SCHEMA');
  if (register.reviewedHead !== pins.reviewedHead || register.reviewedPacketSha256 !== pins.reviewedPacketSha256) errors.push('FOREIGN_PACKET_OR_HEAD');
  if (canonical(register.readerVerdicts) !== canonical({ A: 'no', B: 'no' })) errors.push('HISTORICAL_NO_MUST_REMAIN');
  const ids = Array.from({ length: 20 }, (_, i) => `p${String(i + 1).padStart(3, '0')}`);
  errors.push(...compareIds(ids, register.rows.map(r => r.publicId)));
  for (const row of register.rows) {
    for (const field of ['title', 'originalPath', 'sourceAssessment', 'reviewHistory', 'nextRepair']) {
      if (typeof row[field] !== 'string' || !row[field].trim()) errors.push(`MISSING_DISPOSITION:${row.publicId}:${field}`);
    }
    if (!['erhalten', 'offen', 'gezielt-neu-pruefen', 'Voraussetzung-offen'].includes(row.status)) errors.push(`STATUS:${row.publicId}`);
    if (row.contentRelease !== false) errors.push(`UNRESOLVED_RELEASE:${row.publicId}`);
    for (const reader of ['A', 'B']) {
      const { answers, comparison } = evidence[reader];
      if (answers.packetSha256 !== pins.reviewedPacketSha256 || comparison.packetSha256 !== pins.reviewedPacketSha256 || answers.readerSession !== comparison.readerSession) errors.push(`INPUT_IDENTITY:${reader}`);
      const source = answers.items.find(r => r.publicId === row.publicId);
      const graded = comparison.results.find(r => r.publicId === row.publicId);
      if (!source || !graded) { errors.push(`MISSING_INPUT:${row.publicId}:${reader}`); continue; }
      const complete = graded.candidates.map(({ answer, tier }) => ({ answer, tier }));
      if (row.itemId !== graded.itemId || canonical(source.candidates) !== canonical(complete.map(c => c.answer)) || canonical(row.readers?.[reader]) !== canonical(complete)) errors.push(`CANDIDATE_OMITTED_OR_CHANGED:${row.publicId}:${reader}`);
    }
  }
  // This frozen register records two No verdicts. No Boolean or renamed status can
  // promote these historical findings to approval of a revised packet.
  if (register.contentRelease !== false || requireRelease) errors.push('CONTENT_RELEASE_BLOCKED:TWO_NO_VERDICTS_AND_PENDING_REVIEW');
  return errors;
}
export function renderFindings(register) {
  const lines = ['# Befund- und Dispositionregister · alle 20 W0-Ansichten', '',
    '**CODEX DRAFT — NOT CANON · Inhaltsfreigabe: NEIN.**', '',
    `Unabhängig gelesen: Kopf \`${register.reviewedHead}\`, Paket \`${register.reviewedPacketSha256}\`.`,
    'A = CODEX cgo-027; B = CODEX cgo-028. Beide Urteile: Nein. Reihenfolge der Kandidaten bleibt erhalten; erster Kandidat ist jeweils bevorzugt.',
    '`correct` = technisch voll angenommen, `close` = technisch teilweise angenommen, `wrong` = abgewiesen. Das sind keine fachlichen Urteile.',
    'A hat bei 7, B bei 8 Aufgaben mindestens einen nicht voll angenommenen Kandidaten. Das bedeutet nicht 7/8 unlösbare Aufgaben. Alle Kandidaten stehen unten, auch abgewiesene.', '',
    'Dieses Register ist für GG/Koki, niemals Lösermaterial. Es dokumentiert den alten Stand; die gezielte p010-Korrektur bekommt eine neue Antwort-/Paketbindung und kein übernommenes blindes Ja. Herkunft, Vorschläge, Quellenpins und Prüfbefehle: [BEFUNDWEG.md](BEFUNDWEG.md).', ''];
  for (const row of register.rows) {
    lines.push(`## ${row.publicId} · ${row.title}`, '', `Aufgabe: \`${row.itemId}\`; Original: \`${row.originalPath}\`.`, '');
    for (const reader of ['A', 'B']) lines.push(`- **${reader}:** ${row.readers[reader].map(c => `\`${typeof c.answer === 'string' ? c.answer : JSON.stringify(c.answer)}\` → ${c.tier}`).join('; ')}.`);
    lines.push('', `**Quellengegenlesen:** ${row.sourceAssessment}`, '', `**Reviewgeschichte:** ${row.reviewHistory}`, '', `**Status:** ${row.status}; kein Einzel- oder Gesamtfreigabesiegel. **Nächste Zuständigkeit:** ${row.nextRepair}`, '');
  }
  return lines.join('\n');
}
