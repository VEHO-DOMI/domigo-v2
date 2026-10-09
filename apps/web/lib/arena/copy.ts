export function arenaCopy(grade: number) {
  return grade === 1 ? {
    back: "Zurück", title: "Battle Arena", duel: "Word Duel", newDuel: "Neues Duell", choosePeer: "Wähle einen Mitschüler", peerHint: "Ihr spielt, wenn ihr Zeit habt.",
    close: "Schließen", played: "Gespielt", won: "Gewonnen", rate: "Siegquote", xp: "Battle XP", active: "Offene Duelle", history: "Verlauf",
    waitingCount: "Duelle, die auf deinen Zug warten", yourTurn: "Du bist dran", waiting: "Warten", noDuels: "Noch kein Duell offen.", noHistory: "Noch keine abgeschlossenen Duelle.",
    noPeers: "Es ist noch kein anderer Mitschüler angemeldet.", off: "Die Battle Arena ist für deine Klasse nicht eingeschaltet.",
    unavailable: "Die Battle Arena ist gerade nicht erreichbar.", round: "Runde", question: "Frage", questions: "Fragen", of: "von", chooseChapter: "Wähle ein Chapter", noChapters: "Es ist gerade kein weiteres Chapter verfügbar.",
    translate: "Übersetze ins Englische", continue: "Weiter", correct: "Richtig!", wrong: "Noch nicht richtig.", saved: "Antwort gespeichert", victory: "Gewonnen!", defeat: "Verloren", draw: "Unentschieden", expired: "Abgelaufen", expiredHint: "Dieses Duell hat keinen Sieger.",
    refresh: "Aktualisieren", waitHint: "Dein Mitschüler ist dran.", preview: "Beispiel — in der Vorschau wird kein Duell gespielt.",
    conflict: "Der Duellstand hat sich geändert. Lade die Seite neu.", duplicate: "Mit diesem Mitschüler hast du schon ein offenes Duell.",
    reserve: "Diese Frage ist gerade gesperrt. Kehre später zum Duell zurück.", subtitle: "Word Duel und Verlauf", me: "Du", points: "richtig", score: "Spielstand",
  } : {
    back: "Back", title: "Battle Arena", duel: "Word Duel", newDuel: "New Duel", choosePeer: "Pick a classmate", peerHint: "Play when you are ready.",
    close: "Close", played: "Played", won: "Won", rate: "Win rate", xp: "Battle XP", active: "Active duels", history: "Battle history",
    waitingCount: "Duels waiting for your turn", yourTurn: "Your turn", waiting: "Waiting", noDuels: "No active duels yet.", noHistory: "No completed duels yet.",
    noPeers: "No other classmates have signed in yet.", off: "Battle Arena is not switched on for your class.", unavailable: "Battle Arena is currently unavailable.",
    round: "Round", question: "Question", questions: "questions", of: "of", chooseChapter: "Pick a Chapter", noChapters: "No further Chapter is currently available.", translate: "Translate to English",
    continue: "Continue", correct: "Correct!", wrong: "Not quite.", saved: "Answer saved", victory: "Victory!", defeat: "Defeat", draw: "Draw", expired: "Expired", expiredHint: "This duel has no winner.",
    refresh: "Refresh", waitHint: "Your classmate's turn.", preview: "Example — no duel is played in preview.",
    conflict: "The duel has changed. Reload the page.", duplicate: "You already have an active duel with this classmate.",
    reserve: "This question is currently held back. Come back to the duel later.", subtitle: "Word Duel & battle history", me: "You", points: "correct", score: "Score",
  };
}
export function arenaMessage(code: string, grade: number): string {
  const c = arenaCopy(grade);
  return code === "duel_already_active" ? c.duplicate : code === "duel_expired" ? c.expiredHint
    : code === "duel_question_reserved" ? c.reserve : ["duel_question_closed", "duel_round_closed", "roster_changed", "duel_chapter_empty", "wrong_owner"].includes(code) ? c.conflict
    : code === "arena_disabled" ? c.off : c.unavailable;
}
