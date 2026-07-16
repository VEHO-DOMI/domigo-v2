/**
 * v2-owned tables — ALL inside the `domigo_v2` Postgres schema. v1 lives in
 * `public`; we NEVER issue DDL/writes on `public`. The schema namespace is the
 * strongest additive-safety wall: `drizzle-kit` (scoped by `schemaFilter`) is
 * structurally incapable of dropping/altering a v1 table.
 */
import { sql } from "drizzle-orm";
import {
  pgSchema,
  uuid,
  text,
  integer,
  smallint,
  numeric,
  boolean,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/** Every v2-owned table lives here. */
export const v2 = pgSchema("domigo_v2");

/**
 * One unified attempt ledger (vocab + grammar), `kind`-discriminated. Game tasks
 * reuse it verbatim (`mode:'game:g1'` + `context` jsonb). `userId`/`classId` are
 * reused v1 uuids — plain columns, NO cross-schema FK (integrity at the endpoint).
 */
export const practiceAttempts = v2.table(
  "practice_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    classId: uuid("class_id").notNull(),

    itemId: text("item_id").notNull(),
    kind: text("kind").notNull(), // 'vocab' | 'grammar' (app-validated)
    unitSlug: text("unit_slug").notNull(),
    grade: smallint("grade").notNull(),

    mode: text("mode").notNull(), // 'practice' | 'review' | 'game:g1' | … (open string)

    tier: text("tier").notNull(), // engine Tier
    correct: boolean("correct").notNull(),
    xpAwarded: integer("xp_awarded").notNull().default(0),
    latencyMs: integer("latency_ms"),
    hintUsed: boolean("hint_used").notNull().default(false),
    context: jsonb("context"),

    clientAttemptId: uuid("client_attempt_id"), // idempotency key
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    byUserTime: index("practice_attempts_user_time_idx").on(t.userId, t.createdAt.desc()),
    byUserItem: index("practice_attempts_user_item_idx").on(t.userId, t.itemId),
    // Idempotency: one logical attempt = one row per (user, clientAttemptId).
    // Full (non-partial) unique index so ON CONFLICT can infer it cleanly; Postgres
    // treats NULLs as distinct, so a future keyless insert path stays allowed.
    clientAttemptUnique: uniqueIndex("practice_attempts_client_attempt_unique").on(t.userId, t.clientAttemptId),
  }),
);

/** Leitner 5-box spaced-retrieval queue: one entry per (user, item). */
export const reviewQueue = v2.table(
  "review_queue",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),

    itemId: text("item_id").notNull(),
    kind: text("kind").notNull(),
    unitSlug: text("unit_slug").notNull(),
    grade: smallint("grade").notNull(),

    box: smallint("box").notNull().default(1), // 1..5
    dueAt: timestamp("due_at", { withTimezone: true }).notNull().defaultNow(),

    lastTier: text("last_tier"),
    reps: integer("reps").notNull().default(0),
    lapses: integer("lapses").notNull().default(0),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userItemUnique: uniqueIndex("review_queue_user_item_unique").on(t.userId, t.itemId),
    dueScan: index("review_queue_user_due_idx").on(t.userId, t.dueAt),
    byUserUnit: index("review_queue_user_unit_idx").on(t.userId, t.unitSlug),
    byUserGrade: index("review_queue_user_grade_idx").on(t.userId, t.grade),
  }),
);

/**
 * The v2 XP pool. Not a "third pool" — it IS the v2 pool; v1's `users.xp` stays
 * frozen (still owned by the live v1 app). Keyed by the reused v1 userId.
 */
export const userProgress = v2.table("user_progress", {
  userId: uuid("user_id").primaryKey(),
  xp: integer("xp").notNull().default(0),
  grammarXp: integer("grammar_xp").notNull().default(0),
  // Daily-streak state (A4). Advanced on the first attempt of each Vienna day in
  // recordAttempt; lastSessionDate is "YYYY-MM-DD" plain text for a cheap day
  // compare (see streak.ts). Both additive — see drizzle/0001.
  streak: integer("streak").notNull().default(0),
  lastSessionDate: text("last_session_date"),
  // Hinweis-Funken — the Keen game's hint currency (Glühwörter collected →
  // sparks; sparks buy hints). Server-authoritative so a wiped cosmetic save
  // never loses it; clamped ≥0 in sparks.ts. Additive — see drizzle/0012.
  hintSparks: integer("hint_sparks").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * B1 Study Path node progress. SPARSE: a row exists IFF a node is completed
 * (locked/available are DERIVED in studypath.ts from which rows exist), so the
 * table stays tiny (≤ ~10 rows/unit/student). Keyed by the reused v1 userId;
 * classId denormalized (like practice_attempts) for a future teacher view.
 */
export const studyPathProgress = v2.table(
  "study_path_progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    classId: uuid("class_id").notNull(),
    unitSlug: text("unit_slug").notNull(),
    grade: smallint("grade").notNull(),
    nodeId: text("node_id").notNull(), // "vocab-intro" | "vocab-practice-2" | "checkpoint" | …
    kind: text("kind").notNull(), // NodeKind string (app-validated)
    stars: smallint("stars").notNull().default(0), // 0 (teaching) .. 3
    completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userNodeUnique: uniqueIndex("study_path_progress_user_node_unique").on(t.userId, t.unitSlug, t.nodeId),
    byUserUnit: index("study_path_progress_user_unit_idx").on(t.userId, t.unitSlug),
    byUser: index("study_path_progress_user_idx").on(t.userId),
  }),
);

/**
 * B2 Mock-test writing submissions (teacher-graded). Append-only capture now; the
 * teacher review + rubric scoring (gradedAt/score/feedback/gradedBy) is a deferred
 * follow-up (B2b) — additive columns then. domigo_v2 only; no FK to public.
 */
export const writingSubmissions = v2.table(
  "writing_submissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    classId: uuid("class_id").notNull(),
    unitSlug: text("unit_slug").notNull(),
    testId: text("test_id").notNull(),
    promptId: text("prompt_id").notNull(),
    text: text("text").notNull(),
    wordCount: integer("word_count").notNull(),
    submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
    // M-1: when a submission belongs to a teacher assignment's writing section, it
    // carries the assignment + session it was written in (both nullable — the
    // legacy auto-assembled /tests writing path leaves them null). Additive.
    assignmentId: uuid("assignment_id"),
    sessionId: uuid("session_id"),
  },
  (t) => ({
    byUser: index("writing_submissions_user_idx").on(t.userId),
    byClassUnit: index("writing_submissions_class_unit_idx").on(t.classId, t.unitSlug),
    byAssignment: index("writing_submissions_assignment_idx").on(t.assignmentId),
  }),
);

/**
 * Track C game saves — COSMETIC state only (cursor position, visited zones,
 * palette, perf preset). One row per (user, game). Authoritative progression
 * (XP/streak/unlocks/zone-clear) derives server-side from practice_attempts/
 * review_queue/user_progress — a wiped save loses only position, never progress
 * (Law 2). `clientRev` drives last-write-wins; `schemaVersion` pins the jsonb
 * shape so it can evolve per grade without a DDL migration. Size is capped at
 * the endpoint (≤64 KB). domigo_v2 only; no FK to public.
 */
export const gameSaves = v2.table(
  "game_saves",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    classId: uuid("class_id").notNull(), // denormalized, like practice_attempts
    gameMode: text("game_mode").notNull(), // "game:g1".."game:g4" — same string space as attempts.mode
    schemaVersion: smallint("schema_version").notNull().default(1),
    clientRev: integer("client_rev").notNull().default(0), // last-write-wins
    state: jsonb("state").notNull().default({}), // COSMETIC ONLY (≤64 KB, endpoint-enforced)
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userGameUnique: uniqueIndex("game_saves_user_game_unique").on(t.userId, t.gameMode),
    byUser: index("game_saves_user_idx").on(t.userId),
  }),
);

// ── M-wave: teacher-designable assignments / mock tests (BLUEPRINT III.7) ──────
// No-FK style (integrity at the endpoints), like every table above; all ids are
// reused v1 uuids where they cross to `public`. `mode` splits an untimed practice
// set from a timed, weighted, Notenschlüssel-graded mock test (Schularbeit rehearsal).

/**
 * One teacher-authored assignment. `notenSchluessel` is null ⇒ the AHS default
 * ({1:90,2:80,3:65,4:50}); when present, a `{ "1":n, "2":n, "3":n, "4":n }` jsonb
 * of the *minimum* percent for each Note (Note 5 is the implicit floor). Score
 * math lives in assignments.ts (pure) — never in SQL.
 */
export const assignments = v2.table(
  "assignments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    classId: uuid("class_id").notNull(), // → v1 class
    createdBy: uuid("created_by").notNull(), // → v1 teacher userId
    title: text("title").notNull(),
    descriptionDe: text("description_de"),
    mode: text("mode").notNull(), // 'practice' | 'mock_test'
    startsAt: timestamp("starts_at", { withTimezone: true }),
    dueAt: timestamp("due_at", { withTimezone: true }),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    sessionDurationMinutes: integer("session_duration_minutes"), // whole-test timer (null = untimed)
    attemptsPerTest: smallint("attempts_per_test").notNull().default(1), // 1..3, endpoint-capped
    notenSchluessel: jsonb("noten_schluessel"), // null ⇒ AHS default
    // C-1: when the student sees verdicts/points ({feedback, showScore} — checkup.ts
    // DisplayConfig). Null ⇒ mode default (checkup: on-submit; practice/mock: immediate).
    displayConfig: jsonb("display_config"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    byClass: index("assignments_class_idx").on(t.classId),
    byCreator: index("assignments_creator_idx").on(t.createdBy),
  }),
);

/**
 * A section of an assignment. `itemIds` is the authored order; the server
 * RE-RESOLVES items via the content loaders at grade time and never trusts this
 * jsonb for grading. `weightPct` sums to 100 across a mock test's sections
 * (endpoint-enforced); a practice assignment ignores weights.
 */
export const assignmentSections = v2.table(
  "assignment_sections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    assignmentId: uuid("assignment_id").notNull(),
    position: smallint("position").notNull(),
    kind: text("kind").notNull(), // 'vocab'|'grammar'|'listening'|'reading'|'writing'
    itemIds: jsonb("item_ids"), // string[] — authored order (server re-resolves)
    listeningTaskId: text("listening_task_id"),
    writingPromptId: text("writing_prompt_id"),
    timerMinutes: integer("timer_minutes"),
    weightPct: smallint("weight_pct").notNull().default(0),
    // C-1: checkup section config ({checkupKind, points, mask, direction} — checkup.ts
    // CheckupSectionConfig). Null on non-checkup sections; Σ points = 20 (endpoint-gated).
    sectionConfig: jsonb("section_config"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    byAssignment: index("assignment_sections_assignment_idx").on(t.assignmentId, t.position),
  }),
);

/**
 * One student's attempt at an assignment. `expiresAt` is the SERVER timing gate
 * (null = untimed); `scorePct` (numeric, exact-ish for display) and `note`
 * (1..5, the authoritative computed Note) are written on submit from the pure
 * score math — the Note is computed from the exact percent, never re-derived
 * from a rounded stored value.
 */
export const assignmentSessions = v2.table(
  "assignment_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    assignmentId: uuid("assignment_id").notNull(),
    userId: uuid("user_id").notNull(),
    attemptNumber: smallint("attempt_number").notNull().default(1),
    expiresAt: timestamp("expires_at", { withTimezone: true }), // server wall (null = untimed)
    currentSection: smallint("current_section").notNull().default(0),
    sectionTimes: jsonb("section_times"), // { [position]: secondsSpent }
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    scorePct: numeric("score_pct", { precision: 5, scale: 2 }),
    note: smallint("note"), // 1..5
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    attemptUnique: uniqueIndex("assignment_sessions_attempt_unique").on(t.assignmentId, t.userId, t.attemptNumber),
    byUser: index("assignment_sessions_user_idx").on(t.userId),
    byAssignment: index("assignment_sessions_assignment_idx").on(t.assignmentId),
  }),
);

/**
 * Items a teacher has RESERVED for a class (held out of practice/review so a
 * mock test can use them unseen). One row per (class, item); `active=false` +
 * `releasedAt` records a release back into the practice pool.
 */
export const reservedItems = v2.table(
  "reserved_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    classId: uuid("class_id").notNull(),
    itemId: text("item_id").notNull(),
    active: boolean("active").notNull().default(true),
    releasedAt: timestamp("released_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    classItemUnique: uniqueIndex("reserved_items_class_item_unique").on(t.classId, t.itemId),
    byClass: index("reserved_items_class_idx").on(t.classId),
  }),
);

// ── P-1a: v2-native identity (writable) — the dual-read auth foundation ────────
// Today auth reads identity ONLY from v1's public.users/public.classes (the
// read-only mirrors in v1.ts). These three tables let teachers later OWN classes
// + rosters natively inside domigo_v2. Auth becomes an ordered dual-read (v2
// first → v1 mirror fallback, see auth.ts + pickIdentity in identity.ts), so
// every existing v1 login keeps working unchanged. Same no-FK, plain-uuid style
// as every table above; ids that cross to `public` are reused v1 uuids.

/**
 * A v2-native person (student or teacher). `displayName` is the auth handle (the
 * chosen nickname); `givenName` is the real first name captured for the teacher's
 * roster view (nullable). `classId` is the student's class (plain uuid, nullable —
 * teachers have none). `claimedAt` null ⇒ a provisional row (roster-imported but
 * not yet claimed by the student setting a PIN); non-null ⇒ claimed. `role` is
 * app-validated ('student'|'teacher'). Exported as `v2IdentityUsers` so it never
 * shadows the v1 `users` mirror (v1.ts) at the TypeScript level.
 */
export const v2IdentityUsers = v2.table(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    role: text("role").notNull(), // 'student' | 'teacher' (app-validated)
    displayName: text("display_name").notNull(), // chosen nickname (auth handle)
    givenName: text("given_name"), // real given name for the roster (nullable)
    classId: uuid("class_id"), // student's class — plain, nullable; teachers null. NO cross-schema FK
    pinHash: text("pin_hash").notNull(),
    claimedAt: timestamp("claimed_at", { withTimezone: true }), // null = provisional/unclaimed
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    byClass: index("users_class_idx").on(t.classId),
    // At most one CLAIMED student per (class, case-insensitive nickname) — the DB-level
    // guard behind roster-service's app-code check. PARTIAL so it ignores provisional
    // placeholders (many share a givenName-derived displayName pre-claim) and null-class
    // teachers; a claimed duplicate is what would make lower(display_name) login ambiguous.
    claimedNicknameUnique: uniqueIndex("users_class_claimed_nickname_unique")
      .on(t.classId, sql`lower(${t.displayName})`)
      .where(sql`${t.role} = 'student' and ${t.claimedAt} is not null`),
  }),
);

/**
 * A v2-native class OWNED by a teacher. `inviteCode` is globally unique (a v2 code
 * is minted to avoid colliding with any v1 code too — see allocateClassCode in
 * auth.ts). `teacherId` is the owning teacher's uuid (plain). `smartReviewEnabled`
 * mirrors the v1 flag (default on). `archivedAt` null ⇒ active.
 */
export const v2Classes = v2.table(
  "classes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    inviteCode: text("invite_code").notNull(),
    grade: smallint("grade").notNull(),
    teacherId: uuid("teacher_id").notNull(), // owning teacher — plain uuid, NO cross-schema FK
    smartReviewEnabled: boolean("smart_review_enabled").notNull().default(true),
    archivedAt: timestamp("archived_at", { withTimezone: true }), // null = active
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    inviteCodeUnique: uniqueIndex("classes_invite_code_unique").on(t.inviteCode),
    byTeacher: index("classes_teacher_idx").on(t.teacherId),
  }),
);

/**
 * The roster journal. Neon HTTP has no multi-statement transactions, so roster
 * mutations use journal-then-flip: append the intent HERE first, then flip the
 * live `users`/`classes` state. `kind` is app-validated; `payload` is the
 * operation's data (imported names, the claimed id, the new name, …); `actorId`
 * is the teacher/actor uuid (nullable — e.g. a self-serve student claim).
 */
export const v2RosterEvents = v2.table(
  "roster_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    classId: uuid("class_id").notNull(),
    kind: text("kind").notNull(), // 'import'|'claim'|'rename'|'remove'|'reset_pin' (app-validated)
    payload: jsonb("payload").notNull(),
    actorId: uuid("actor_id"), // teacher/actor uuid — nullable, NO cross-schema FK
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    byClass: index("roster_events_class_idx").on(t.classId),
  }),
);

// ---------------------------------------------------------------------------
// S-1 · Studio content overlay (migration 0009). A teacher edits PROSE on a
// task item; the patch is allowlist-gated in the app (@domigo/content-loader
// `validatePatch`) so grading keys can never enter it. Publish is journal-
// then-flip: append a `content_revisions` row FIRST, then flip the override's
// status — a crash between the two leaves a harmless orphan history row.
// `site_copy` is the flat chrome-copy overlay (save = live).
// ---------------------------------------------------------------------------

/** One row per patched item (the editor upserts on `item_id`). `patch` is the
 *  prose-only field→value map; `status` gates whether it is served. */
export const v2ContentOverrides = v2.table(
  "content_overrides",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    itemId: text("item_id").notNull(), // g2u03.w.… (vocab) | g2u03.gi.….001 (grammar)
    unitSlug: text("unit_slug").notNull(), // g<N>-u<NN> — the unit the item lives in
    kind: text("kind").notNull(), // 'vocab'|'grammar' — picks the prose allowlist
    patch: jsonb("patch").notNull().default({}), // prose-only field→value map
    status: text("status").notNull().default("draft"), // 'draft'|'published' (app-validated)
    foldedAt: timestamp("folded_at", { withTimezone: true }), // set once exported back to git
    updatedBy: uuid("updated_by"), // teacher uuid — nullable, NO cross-schema FK
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    itemUnique: uniqueIndex("content_overrides_item_unique").on(t.itemId),
    byStatus: index("content_overrides_status_idx").on(t.status),
  }),
);

/** Append-only publish/revert/fold history (journal-then-flip's journal). */
export const v2ContentRevisions = v2.table(
  "content_revisions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    itemId: text("item_id").notNull(),
    unitSlug: text("unit_slug").notNull(),
    patch: jsonb("patch").notNull().default({}),
    action: text("action").notNull(), // 'publish'|'revert'|'fold' (app-validated)
    actorId: uuid("actor_id"), // teacher uuid — nullable
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    byItem: index("content_revisions_item_idx").on(t.itemId, t.createdAt.desc()),
  }),
);

/** Flat site/UI copy overlay (chrome strings), keyed by a dotted copy key. */
export const v2SiteCopy = v2.table(
  "site_copy",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    key: text("key").notNull(), // e.g. 'home.hero.title' (app-registered keyspace)
    value: text("value").notNull(),
    updatedBy: uuid("updated_by"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    keyUnique: uniqueIndex("site_copy_key_unique").on(t.key),
  }),
);

// ---------------------------------------------------------------------------
// S-2 · Studio full CRUD + automated blind-solve gate (migration 0010). A
// teacher creates/replaces/removes a whole graded task; it is publishable ONLY
// after `content_checks` records a blind-solve `verdict: correct` (the engine
// grading an AI's key-less answer). Non-published drafts are structurally
// unservable. `unit_meta` relabels a unit's title.
// ---------------------------------------------------------------------------

/** One draft per item. `item` is the full VocabItem/GrammarItem jsonb; `status`
 *  gates serving — a draft only serves when 'published' (after the gate). */
export const v2ContentDrafts = v2.table(
  "content_drafts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    itemId: text("item_id").notNull(), // new id for create; existing for replace/remove
    unitSlug: text("unit_slug").notNull(),
    kind: text("kind").notNull(), // 'vocab'|'grammar'
    item: jsonb("item").notNull().default({}), // the full item (empty for a 'remove')
    action: text("action").notNull(), // 'create'|'replace'|'remove'
    status: text("status").notNull().default("draft"), // 'draft'|'checking'|'check_failed'|'published'
    updatedBy: uuid("updated_by"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    itemUnique: uniqueIndex("content_drafts_item_unique").on(t.itemId),
    byStatus: index("content_drafts_status_idx").on(t.status),
  }),
);

/** Append-only check journal — `evidence` holds the AI answer + engine tier +
 *  model + costUsd for a blind_solve, or the zod result. */
export const v2ContentChecks = v2.table(
  "content_checks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    draftId: uuid("draft_id").notNull(),
    checkKind: text("check_kind").notNull(), // 'zod'|'blind_solve'
    verdict: text("verdict").notNull(), // 'pass'|'fail' (zod) | engine tier (blind_solve)
    evidence: jsonb("evidence").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    byDraft: index("content_checks_draft_idx").on(t.draftId, t.createdAt.desc()),
  }),
);

/** Unit relabeling (teacher-facing title override), keyed by unit slug. */
export const v2UnitMeta = v2.table(
  "unit_meta",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    unitSlug: text("unit_slug").notNull(),
    title: text("title").notNull(),
    updatedBy: uuid("updated_by"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugUnique: uniqueIndex("unit_meta_slug_unique").on(t.unitSlug),
  }),
);

/** S-2b · async blind-solve runs (Vercel Sandbox + Claude Agent SDK, authed by
 *  the operator's subscription OAuth token). One row per publish attempt: the
 *  sandbox solves the item BLIND, then the platform grades the returned answer
 *  through @domigo/engine (the sandbox never sees the key). status:
 *  'running' (sandbox in flight) → 'passed' (top candidate graded correct →
 *  draft published) | 'blocked' (graded not-correct → draft check_failed) |
 *  'failed' (sandbox error/timeout). `answer` = the AI's candidates. */
export const v2ContentSolveRuns = v2.table(
  "content_solve_runs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    itemId: text("item_id").notNull(),
    unitSlug: text("unit_slug").notNull(),
    kind: text("kind").notNull(),
    model: text("model").notNull(),
    status: text("status").notNull().default("running"),
    sandboxId: text("sandbox_id"),
    answer: jsonb("answer"),
    gradedTier: text("graded_tier"),
    errorMessage: text("error_message"),
    costUsd: numeric("cost_usd", { precision: 10, scale: 6 }),
    inputTokens: integer("input_tokens"),
    outputTokens: integer("output_tokens"),
    numTurns: integer("num_turns"),
    triggeredBy: uuid("triggered_by"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (t) => ({
    byItem: index("content_solve_runs_item_idx").on(t.itemId, t.createdAt.desc()),
  }),
);
