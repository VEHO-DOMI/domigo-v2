// CODEX DRAFT — NOT CANON · GEPLANT. Complete authored text catalogue for this model.
// Rows: key, state(s), learning/operating function, text. Source items remain unchanged.
const rows = [
 ['title','all','Orientierung','Was soll der Bleistift tun?'],
 ['chapter','all','Buchzuordnung','Chapter 1 · Kapitel 1: Aufforderungen'],
 ['draft','all','Autorenkennzeichnung','CODEX DRAFT — NOT CANON · GEPLANT'],
 ['scope','all','Erwartung klären','Ihr übt zwei Aufgaben. Eure Antworten bleiben nur in diesem geöffneten Fenster. Wenn ihr die Seite neu ladet, beginnt ihr von vorn.'],
 ['teacherNote','all','Mustergrenze für Erwachsene','Textmodell zur Prüfung durch Erwachsene. Spielbilder, Konten und dauerhafte Speicherung sind hier nicht enthalten. Noch nicht für den Unterricht freigegeben.'],
 ['footer','all','Freiwilligkeit','Ihr könnt zusammen oder allein üben. Es gibt keine Zeitmessung.'],
 ['spec','all','Autorennavigation','Spezifikation für Erwachsene'],
 ['loading','loading','Wartezustand','Die Aufgaben werden geladen.'],
 ['loadError','error','Fehler und nächster Schritt','Die Aufgaben konnten nicht geladen werden. Bitte eine erwachsene Person um Hilfe beim Öffnen dieser Übungsansicht.'],
 ['welcomeTitle','welcome','Rollen erklären','Gemeinsam auswählen und erklären'],
 ['welcomeBody','welcome','Handlung erklären','Eine Person klickt die Antwort an. Die andere erklärt, was sie bedeutet. Ihr besprecht die Auswahl gemeinsam. Bei der zweiten Aufgabe tauscht ihr.'],
 ['preparePair','welcome','Wahl des Sozialmodus','Zusammen üben'],
 ['prepareSolo','welcome,ready','Freiwillige Alternative','Allein üben'],
 ['prepareTitle','prepare','Lernschritt','Die Aufforderungen vorbereiten'],
 ['prepareBody','prepare','Gezielte Einführung','Lest die fünf Aufforderungen mit ihren Bedeutungen. Erklärt euch den Unterschied. In den Aufgaben könnt ihr diese Hilfe wieder öffnen.'],
 ['preparePractice','prepare','Bedeutung anwenden','Eine Person sagt eine Aufforderung. Die andere erklärt auf Deutsch, was zu tun ist. Wechselt euch ab. Wer allein übt, sagt die Bedeutung für sich.'],
 ['toReady','prepare','Nächster Schritt','Vorbereitung beenden'],
 ['readyTitle','ready','Eigene Entscheidung','Möchtet ihr anfangen?'],
 ['readyBody','ready','Freiwilligkeit','Jede Person entscheidet selbst. Wenn noch eine Bedeutung unklar ist, öffnet die Vorbereitung erneut.'],
 ['consentA','ready','Zustimmung Person A','A: Ich möchte mitmachen.'],
 ['knownA','ready','Selbstauskunft Person A','A: Ich kann die fünf Aufforderungen auf Deutsch erklären.'],
 ['consentB','ready','Zustimmung Person B','B: Ich möchte mitmachen.'],
 ['knownB','ready','Selbstauskunft Person B','B: Ich kann die fünf Aufforderungen auf Deutsch erklären.'],
 ['consentSolo','ready','Zustimmung allein','Ich möchte anfangen.'],
 ['knownSolo','ready','Selbstauskunft allein','Ich kann die fünf Aufforderungen auf Deutsch erklären.'],
 ['readyYes','ready','Startzustand','Ihr könnt mit der ersten Aufgabe beginnen.'],
 ['start','ready','Start','Erste Aufgabe öffnen'],
 ['practice','ready','Hilfe erneut nutzen','Zurück zu den Bedeutungen'],
 ['noConsent','ready','Fehlende Zustimmung','Zum gemeinsamen Start müssen beide mitmachen wollen. Alleinüben bleibt möglich.'],
 ['notKnown','ready','Fehlendes Vorwissen','Klärt zuerst die Bedeutungen in der Vorbereitung.'],
 ['timeForbidden','ready','Modusgrenze','Diese Übung darf keine Zeitwertung enthalten.'],
 ['penaltyForbidden','ready','Modusgrenze','Beim Beenden darf es keinen Punktabzug geben.'],
 ['mismatch','ready','Ungleiche Bedingungen','Die Aufgaben oder Hilfen passen nicht zusammen. Bitte eine erwachsene Person um Hilfe.'],
 ['soloRound','question','Position im Ablauf','Aufgabe {number} von 2'],
 ['roleA','question','Rollen','A klickt an · B erklärt'],
 ['roleB','question','Rollen','B klickt an · A erklärt'],
 ['choosePair','question','Aufgabenhandlung','Wählt die passende Aufforderung aus. Erklärt einander, was sie bedeutet. Ihr könnt die Auswahl noch ändern.'],
 ['chooseSolo','question','Aufgabenhandlung','Wähle die passende Aufforderung aus. Erkläre für dich, was sie bedeutet. Du kannst die Auswahl noch ändern.'],
 ['empty','question','Leere Auswahl','Wähle zuerst eine Aufforderung aus. Danach kannst du sie mit der Lösung vergleichen.'],
 ['help','question','Gezielte Wortschatzhilfe','Was bedeuten die Aufforderungen?'],
 ['compare','question','Rückmeldung öffnen','Antwort vergleichen'],
 ['pause','question,feedback,handover','Unterbrechen','Pause'],
 ['feedbackTitle','feedback','Bedeutungsvergleich','Passt die Aufforderung zum Auftrag?'],
 ['selected','feedback,summary','Tatsächliche Antwort','Ausgewählt:'],
 ['sourceAnswer','feedback,summary','Lösung einordnen','Zum Auftrag passt:'],
 ['compareBody','feedback','Selbstvergleich','Vergleiche die Bedeutung deiner Auswahl mit dem Auftrag. Was soll der Bleistift tun?'],
 ['feedbackPair','feedback','Erklärung statt nur Schlüssel','Erklärt euch, warum die passende Aufforderung zu diesem Auftrag gehört.'],
 ['feedbackSolo','feedback','Eigene Erklärung','Erkläre für dich, warum die passende Aufforderung zu diesem Auftrag gehört.'],
 ['retry','feedback','Erneuter Versuch','Noch einmal auswählen'],
 ['next','feedback','Abschluss der Besprechung','Besprochen – weiter'],
 ['handoverPair','handover','Rollenwechsel','Jetzt tauscht ihr'],
 ['handoverSolo','handover','Nächster Schritt','Die zweite Aufgabe'],
 ['handoverBodyPair','handover','Rollen konkret','B klickt jetzt an. A erklärt. Besprecht die Auswahl wieder gemeinsam.'],
 ['handoverBodySolo','handover','Nächster Schritt','Öffne die nächste Situation und wähle die passende Aufforderung.'],
 ['handover','handover','Start zweiter Aufgabe','Zweite Aufgabe öffnen'],
 ['summaryTitle','summary','Rückschau','Die beiden Aufforderungen'],
 ['summaryPair','summary','Bedeutung anwenden','Sagt euch eine der Aufforderungen und erklärt auf Deutsch, was zu tun ist.'],
 ['summarySolo','summary','Bedeutung anwenden','Sage eine der Aufforderungen und erkläre auf Deutsch, was zu tun ist.'],
 ['restart','summary,ended','Freiwillige Wiederholung','Von vorn üben'],
 ['pauseTitle','paused','Unterbrechung','Pause'],
 ['pauseBody','paused','Erhaltungsgrenze','Die Auswahl bleibt in diesem Fenster erhalten. Wenn du die Seite neu lädst, beginnt die Übung von vorn.'],
 ['resume','paused','Fortsetzung','An derselben Stelle weiter'],
 ['endTitle','end-confirm','Bestätigung','Diesen Durchgang beenden?'],
 ['endBody','end-confirm','Echte Speichergrenze','Die Antworten dieses Durchgangs werden gelöscht. Du kannst später wieder von vorn üben.'],
 ['keep','end-confirm','Abbruch widerrufen','Weiterüben'],
 ['end','end-confirm','Bestätigter Abbruch','Durchgang beenden'],
 ['endedTitle','ended','Abbruch bestätigt','Durchgang beendet'],
 ['endedBody','ended','Ergebnis des Abbruchs','Die Antworten sind gelöscht. Wenn du möchtest, kannst du einen neuen Durchgang beginnen.'],
 ['askEnd','prepare,ready,question,feedback,handover,summary,paused','Freiwilliges Ende','Beenden']
];

export const texts = Object.fromEntries(rows.map(([key, stages, purpose, value]) => [key, {
 value, stages: stages.split(','), purpose, language: key === 'chapter' ? 'en/de' : key === 'draft' ? 'en' : 'de',
 audience: ['draft','teacherNote','spec'].includes(key) ? 'adults' : 'learners',
 status: key === 'chapter' ? 'bewusst gestützt: Kapitel direkt erklärt' : key === 'draft' ? 'Autorenkennzeichnung, kein Lernziel' : 'deutsche Orientierung oder gezielte Hilfe'
}]));

export function text(key, parameters = {}) {
 if (!texts[key]) throw new Error(`Unknown text key: ${key}`);
 return texts[key].value.replace(/\{(\w+)\}/g, (_, name) => {
  if (!(name in parameters)) throw new Error(`Missing parameter: ${key}.${name}`);
  return String(parameters[name]);
 });
}

// Every English option is interpreted in THIS classroom-command context.
export const phrases = {
 'Listen!': { meaning: 'Hör zu!', status: 'bewusst gestützt', learning: 'Bedeutung erkennen und passend auswählen', source: 'SB S. 8 Lied und Höranweisungen; WB S. 13 to listen / to speak', prerequisite: 'Buchkontakt vorhanden; individuelles Können nicht vorausgesetzt' },
 'Look!': { meaning: 'Schau hin!', status: 'bewusst gestützt', learning: 'Schauen von Zuhören unterscheiden', source: 'SB S. 10/11 Arbeitsaufträge; WB S. 13 to look', prerequisite: 'Buchkontakt vorhanden; individuelles Können nicht vorausgesetzt' },
 'Come on!': { meaning: 'Komm! / Los!', status: 'neues Lernziel, bewusst gestützt', learning: 'Zum Mitkommen oder Beginnen auffordern', source: 'SB S. 8 Lied; im gesichteten Wortverzeichnis WB S. 13 kein eigener Eintrag', prerequisite: 'Nicht als bereits beherrscht voraussetzbar; Mehrdeutigkeit kontextabhängig' },
 'Sit down!': { meaning: 'Setz dich!', status: 'bewusst gestützt', learning: 'Hinsetzen von Aufstehen unterscheiden', source: 'SB S. 14 Aufgaben 15/16, Bildhandlung; WB S. 7/8 Aufgaben 9–13 und S. 13', prerequisite: 'Für Wiederholung nach Einführung vorgesehen; individuelles Können nicht vorausgesetzt' },
 'Stand up!': { meaning: 'Steh auf!', status: 'bewusst gestützt', learning: 'Aufstehen von Hinsetzen unterscheiden', source: 'SB S. 15 deutsche Grammatikerklärung; WB S. 7/8 Aufgaben 9–13 und S. 13', prerequisite: 'Positive und negative Formen im Buch unterscheiden; hier nur positive Form' }
};
