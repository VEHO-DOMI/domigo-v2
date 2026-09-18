/**
 * gomarke-008 · WHAT THE PRIVACY PAGE MUST KEEP SAYING — every column, classified.
 *
 * The privacy page (app/datenschutz/page.tsx) lists the kinds of data DomiGo
 * stores. Until now a test held that list to the schema through a POSITIVE LIST
 * of ten column names: while `display_name` existed, the page had to say
 * "Spitzname", and so on. That coupling can only ever notice a column that
 * DISAPPEARS. A NEW personal-data column — the thing that actually happens when
 * a feature ships — was invisible to it, and the page would have gone on
 * claiming a complete list while being incomplete. PR #437 named this as one of
 * four claims no machine guarded ("Befunde, die NICHT in diesen PR gehören").
 *
 * So the coupling is turned around. This file classifies EVERY column of EVERY
 * table in `domigo_v2`, and lib/datenschutz-page.test.ts reads the schema at
 * RUNTIME (drizzle's own column metadata, not a regex over the source) and
 * compares both directions:
 *
 *   1. a column the schema has and this file does not ⇒ RED, by name. Adding a
 *      column now forces a decision about the page, in review, before it ships.
 *   2. a column this file has and the schema does not ⇒ RED as STALE, so the
 *      list cannot quietly rot into fiction (the ratchet check-journal-door.mjs
 *      and check-ci-gates.mjs already carry).
 *   3. every `person` and `kennung` column must have its `wendung` — the German
 *      wording that names it — present in the page's VISIBLE text.
 *
 * The three marks:
 *   · `person`   — the value itself is about a person and a reader would
 *                  recognise it: a nickname, a real name, own prose, a mark, a
 *                  timestamp of that person's own activity.
 *   · `kennung`  — a uuid or hash that POINTS at a person without naming one.
 *                  Still personal data (it singles somebody out), so it, too,
 *                  must be named on the page — as a kind of record, not as a
 *                  column.
 *   · `sachlich` — content, configuration, counters and row bookkeeping that
 *                  says nothing about a person: task ids, unit slugs, a row's
 *                  own `updated_at`, a server-side expiry.
 *
 * A `sachlich` mark carries its `warum` wherever the call is not obvious. That
 * sentence is the review surface: it is what a reader disagrees with, and
 * disagreeing is cheap here and expensive on a live page.
 *
 * Deliberately NOT in this file: the v1 mirror tables of `public` (v1.ts).
 * They are read-only, deliberately partial, and never a migration target, so
 * drizzle's metadata is not a truthful inventory of them — the page speaks
 * about them in prose ("Konten aus der früheren DomiGo-Version") instead.
 */

export type Marke = "person" | "kennung" | "sachlich";

export type Eintrag = {
  marke: Marke;
  /** the German wording on the page that names this data — required for person/kennung */
  wendung?: RegExp;
  /** why this call was made, where it is not self-evident */
  warum?: string;
};

const person = (wendung: RegExp, warum?: string): Eintrag => ({ marke: "person", wendung, warum });
const kennung = (wendung: RegExp, warum?: string): Eintrag => ({ marke: "kennung", wendung, warum });
const sachlich = (warum?: string): Eintrag => ({ marke: "sachlich", warum });

// ── the wordings the page carries, named once ────────────────────────────────
// Each is a phrase from app/datenschutz/page.tsx. Naming them here means a
// reworded page fails ONE named coupling with a readable message, instead of
// seven anonymous regex assertions.
const W = {
  konto: /deinem Konto zugeordnet/,
  klasse: /deine Klasse/,
  spitzname: /Spitzname/,
  echterName: /Echter Name/,
  pin: /6-stellige PIN/,
  lehrerMail: /freiwillig eine E-Mail-Adresse/,
  zeitpunkt: /jede beantwortete Aufgabe mit Zeitpunkt/,
  richtigFalsch: /richtig oder falsch/,
  wieNah: /wie nah du dran warst/,
  dauer: /wie lange du gebraucht hast/,
  hinweisGenommen: /ob du einen Hinweis genommen hast/,
  fehlerart: /die Art des Fehlers/,
  durchgang: /zu welchem Durchgang die Antwort gehört/,
  xp: /Punkte \(XP\)/,
  serie: /Serie/,
  funken: /Hinweis-Funken/,
  wiederholung: /Wiederholungskarten/,
  lernpfad: /erledigte Schritte im Lernpfad mit Sternen/,
  schreiben: /Texte, die du schreibst und abgibst/,
  wortzahl: /Wortzahl/,
  bewertung: /Punkten und Rückmeldung deiner Lehrkraft/,
  testZeiten: /wann du begonnen und abgegeben hast/,
  abschnittszeit: /die Zeit je Abschnitt/,
  prozent: /Ergebnis in Prozent/,
  note: /Note von 1 bis 5/,
  spielstand: /Spielstand/,
  protokoll: /Klassen-Protokoll/,
  drosselung: /gezählt je Klassencode und Spitzname/,
  fehlversuche: /Zahl der Fehlversuche/,
  jahresStand: /Jahres-Stand/,
  lehrerKennung: /Kennung der Lehrkraft/,
  lehrerProtokoll: /Protokoll der Änderungen am eigenen Konto/,
  vergesseneP: /vergessene PIN/,
  verwaltungsLink: /Verwaltungs-Link/,
} as const;

/** table (SQL name) → column (SQL name) → mark */
export const SPALTEN: Record<string, Record<string, Eintrag>> = {
  users: {
    id: kennung(W.konto, "the id every other table stores instead of a name"),
    role: sachlich("whether an account belongs to a child or to a teacher — the page is built on exactly that split, one section each"),
    display_name: person(W.spitzname),
    given_name: person(W.echterName),
    class_id: kennung(W.klasse),
    pin_hash: person(W.pin, "a bcrypt hash of something the child chose and types"),
    email: person(W.lehrerMail, "teachers only — teacher-identity.ts is the single writer (check-datenschutz-claims.mjs law 2)"),
    claimed_at: sachlich("null = a roster placeholder nobody has signed in as yet"),
    created_at: sachlich("when the row was made, not an activity of the person"),
  },

  classes: {
    id: sachlich(),
    name: sachlich("the class's name, e.g. 1A — no person"),
    invite_code: sachlich("the code a class shares to join"),
    grade: sachlich(),
    teacher_id: kennung(W.lehrerKennung),
    smart_review_enabled: sachlich("a class setting"),
    archived_at: sachlich(),
    created_at: sachlich(),
  },

  practice_attempts: {
    id: sachlich(),
    user_id: kennung(W.konto),
    class_id: kennung(W.klasse),
    item_id: sachlich("which exercise — content, not a person"),
    kind: sachlich("vocab or grammar"),
    unit_slug: sachlich(),
    grade: sachlich(),
    mode: sachlich("practice, review or a game — which surface the task was answered on"),
    // The engine Tier is "correct" | "partial" | "close" | "wrong" (packages/engine/src/index.ts:14):
    // four grades of how close THIS child's answer was, not a property of the engine. The DS-0
    // check of 2026-09-17 found it classified sachlich here while its sibling review_queue.last_tier
    // was person — the same value, two verdicts, and the page said only "richtig oder falsch".
    tier: person(W.wieNah),
    correct: person(W.richtigFalsch),
    xp_awarded: person(W.xp),
    latency_ms: person(W.dauer),
    hint_used: person(W.hinweisGenommen),
    context: person(W.fehlerart, "server-set: the kind of mistake, or the test session — never anything the browser dictates"),
    client_attempt_id: sachlich("an idempotency key so one answer counts once"),
    created_at: person(W.zeitpunkt),
  },

  review_queue: {
    id: sachlich(),
    user_id: kennung(W.konto),
    item_id: sachlich(),
    kind: sachlich(),
    unit_slug: sachlich(),
    grade: sachlich(),
    box: person(W.wiederholung),
    due_at: person(W.wiederholung),
    last_tier: person(W.wieNah, "the same four grades as practice_attempts.tier"),
    reps: person(W.wiederholung),
    lapses: person(W.wiederholung),
    created_at: sachlich("when the card entered the queue"),
    updated_at: sachlich("row bookkeeping"),
  },

  user_progress: {
    user_id: kennung(W.konto),
    xp: person(W.xp),
    grammar_xp: person(W.xp),
    streak: person(W.serie),
    last_session_date: person(W.serie, "the day the streak is counted from"),
    hint_sparks: person(W.funken),
    updated_at: sachlich("row bookkeeping"),
  },

  study_path_progress: {
    id: sachlich(),
    user_id: kennung(W.konto),
    class_id: kennung(W.klasse),
    unit_slug: sachlich(),
    grade: sachlich(),
    node_id: sachlich("which step of the path — content"),
    kind: sachlich("what kind of step it is"),
    stars: person(W.lernpfad),
    completed_at: person(W.lernpfad),
    updated_at: sachlich("row bookkeeping"),
  },

  writing_submissions: {
    id: sachlich(),
    user_id: kennung(W.konto),
    class_id: kennung(W.klasse),
    unit_slug: sachlich(),
    test_id: sachlich(),
    prompt_id: sachlich("which writing prompt — content"),
    text: person(W.schreiben, "the child's own prose, up to 8 000 characters"),
    word_count: person(W.wortzahl),
    submitted_at: person(W.schreiben),
    assignment_id: sachlich("which assignment the text belongs to"),
    session_id: sachlich("which test session the text belongs to"),
    graded_at: person(W.bewertung),
    graded_by: kennung(W.lehrerKennung),
    score: person(W.bewertung),
    feedback: person(W.bewertung, "the teacher's words about this child"),
  },

  game_saves: {
    id: sachlich(),
    user_id: kennung(W.konto),
    class_id: kennung(W.klasse),
    game_mode: person(W.spielstand),
    schema_version: sachlich("the save format's version"),
    client_rev: sachlich("last-write-wins counter"),
    state: person(W.spielstand, "cosmetic game state, endpoint-capped"),
    created_at: sachlich(),
    updated_at: sachlich("row bookkeeping"),
  },

  assignment_sessions: {
    id: sachlich(),
    assignment_id: sachlich(),
    user_id: kennung(W.konto),
    attempt_number: person(W.durchgang),
    expires_at: sachlich("the server's timing wall for the session"),
    current_section: sachlich("where the session stands"),
    section_times: person(W.abschnittszeit),
    submitted_at: person(W.testZeiten),
    score_pct: person(W.prozent),
    note: person(W.note),
    started_at: person(W.testZeiten),
    updated_at: sachlich("row bookkeeping"),
  },

  assignments: {
    id: sachlich(),
    class_id: sachlich("which class the assignment is for"),
    created_by: kennung(W.lehrerKennung),
    title: sachlich("what the teacher called the assignment"),
    description_de: sachlich("the teacher's instructions to the class"),
    mode: sachlich("practice or mock test"),
    starts_at: sachlich(),
    due_at: sachlich(),
    archived_at: sachlich(),
    session_duration_minutes: sachlich(),
    attempts_per_test: sachlich(),
    noten_schluessel: sachlich("the mark scale for this test"),
    display_config: sachlich(),
    created_at: sachlich(),
    updated_at: sachlich(),
  },

  assignment_sections: {
    id: sachlich(),
    assignment_id: sachlich(),
    position: sachlich(),
    kind: sachlich(),
    item_ids: sachlich("which exercises the section holds"),
    listening_task_id: sachlich(),
    writing_prompt_id: sachlich(),
    timer_minutes: sachlich(),
    weight_pct: sachlich(),
    section_config: sachlich(),
    created_at: sachlich(),
  },

  reserved_items: {
    id: sachlich(),
    class_id: sachlich("which class an exercise is held back from"),
    item_id: sachlich(),
    active: sachlich(),
    released_at: sachlich(),
    created_at: sachlich(),
  },

  rollover_snapshots: {
    id: sachlich(),
    label: sachlich("which school year the snapshot belongs to"),
    v1_user_id: kennung(W.jahresStand),
    real_name: person(W.jahresStand),
    display_name: person(W.jahresStand),
    class_name: person(W.jahresStand),
    grade: sachlich(),
    v1_stats: person(W.jahresStand),
    v2_progress: person(W.jahresStand),
    leitner: person(W.jahresStand),
    attempts_summary: person(W.jahresStand),
    study_path_done: person(W.jahresStand),
    created_at: sachlich(),
  },

  roster_events: {
    id: sachlich(),
    class_id: kennung(W.protokoll),
    kind: person(W.protokoll, "joined, renamed, removed — an event about a child, without the name"),
    payload: kennung(W.protokoll, "ids, numbers and lengths only: roster-events.ts is the single door and scrubs against a 17-key vocabulary (check-journal-door.mjs), migration 0019 rewrote the older rows"),
    actor_id: kennung(W.lehrerKennung),
    created_at: person(W.protokoll),
  },

  auth_throttle: {
    key: person(W.drosselung, "the key IS the typed handle: student:<class code>:<nickname>, teacher:<name>, reset:<name>"),
    window_start: sachlich("when the counting window opened"),
    count: person(W.fehlversuche),
  },

  teacher_events: {
    id: sachlich(),
    teacher_id: kennung(W.lehrerProtokoll),
    kind: person(W.lehrerProtokoll, "PIN changed, address set, reset requested — about that teacher"),
    actor_id: kennung(W.lehrerKennung, "whose hand did it, which differs from whose account it was"),
    payload: kennung(W.lehrerProtokoll, "ids, numbers and flags only — `emailSet: true`, never the address"),
    created_at: person(W.lehrerProtokoll),
  },

  teacher_reset_tokens: {
    token_hash: sachlich("a sha256 of the link's secret — never the secret"),
    teacher_id: kennung(W.vergesseneP),
    expires_at: sachlich(),
    consumed_at: sachlich(),
    created_at: sachlich(),
  },

  ops_link_uses: {
    nonce_hash: sachlich("a sha256 of the one-time link's nonce — never the nonce"),
    user_id: kennung(W.verwaltungsLink),
    used_at: person(W.verwaltungsLink, "when the link signed that account in"),
    expires_at: sachlich("the token's own expiry, which is what makes pruning safe"),
  },

  content_overrides: {
    id: sachlich(),
    item_id: sachlich(),
    unit_slug: sachlich(),
    kind: sachlich(),
    patch: sachlich("the changed wording of an exercise"),
    status: sachlich(),
    folded_at: sachlich(),
    updated_by: kennung(W.lehrerKennung),
    updated_at: sachlich(),
  },

  content_revisions: {
    id: sachlich(),
    item_id: sachlich(),
    unit_slug: sachlich(),
    patch: sachlich("the changed wording of an exercise"),
    action: sachlich(),
    actor_id: kennung(W.lehrerKennung),
    created_at: sachlich(),
  },

  content_drafts: {
    id: sachlich(),
    item_id: sachlich(),
    unit_slug: sachlich(),
    kind: sachlich(),
    item: sachlich("the drafted exercise"),
    action: sachlich(),
    status: sachlich(),
    updated_by: kennung(W.lehrerKennung),
    updated_at: sachlich(),
  },

  content_checks: {
    id: sachlich(),
    draft_id: sachlich(),
    check_kind: sachlich(),
    verdict: sachlich(),
    evidence: sachlich("what the AI answered when it test-solved an exercise — no child's data reaches it"),
    created_at: sachlich(),
  },

  content_solve_runs: {
    id: sachlich(),
    item_id: sachlich(),
    unit_slug: sachlich(),
    kind: sachlich(),
    model: sachlich("which AI model test-solved the exercise"),
    status: sachlich(),
    sandbox_id: sachlich(),
    answer: sachlich("the AI's answer to the exercise"),
    graded_tier: sachlich(),
    error_message: sachlich(),
    cost_usd: sachlich(),
    input_tokens: sachlich(),
    output_tokens: sachlich(),
    num_turns: sachlich(),
    triggered_by: kennung(W.lehrerKennung),
    created_at: sachlich(),
    completed_at: sachlich(),
  },

  unit_meta: {
    id: sachlich(),
    unit_slug: sachlich(),
    title: sachlich("what a unit is called"),
    updated_by: kennung(W.lehrerKennung),
    updated_at: sachlich(),
  },

  site_copy: {
    id: sachlich(),
    key: sachlich("which piece of wording on the site"),
    value: sachlich("the wording itself"),
    updated_by: kennung(W.lehrerKennung),
    updated_at: sachlich(),
  },
};
