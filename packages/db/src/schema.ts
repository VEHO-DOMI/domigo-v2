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
    // K1a (migration 0015): the teacher's class view groups this whole ledger by
    // class. Until now classId carried no index of its own, so every class-scoped
    // read was a full scan; createdAt rides along because the same view asks
    // "when was this class last active?".
    byClassTime: index("practice_attempts_class_time_idx").on(t.classId, t.createdAt.desc()),
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
    // K1a (migration 0015): the class view's study-path half groups by class —
    // same reason as the sibling index on practice_attempts.
    byClass: index("study_path_progress_class_idx").on(t.classId),
  }),
);

/**
 * B2 Mock-test writing submissions (teacher-graded). domigo_v2 only; no FK to public.
 *
 * K6a (migration 0018) is the "additive columns then" this comment promised in July:
 * the four grading columns below. Capture stays append-only — grading is an UPDATE on
 * the captured row, never a second row, because a submission has exactly one current
 * mark and its history belongs in `roster_events` (kind `writing_graded`), which is
 * where every other hand-made change in v2 already lives.
 *
 * ALL FOUR ARE NULLABLE, AND THAT IS THE DESIGN. An ungraded submission is the normal,
 * majority state — not a defect and not a zero. `score IS NULL` means "nobody has
 * looked at this yet"; `score = 0` would mean "a teacher read it and awarded nothing",
 * and a schema that cannot tell those apart forces every reader to guess.
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
    // K6a (migration 0018) · the teacher's mark. `gradedBy` is WHOSE HAND set it —
    // the same two-ids doctrine the teacher journal spells out (teacher-events.ts):
    // a mark without a hand is a number, not a record. `score` is 0-100 and is
    // validated in the app (a CHECK constraint would need a migration to change its
    // mind; Koki's scale question is still open, so the range lives where it is cheap
    // to move). `feedback` is the teacher's words to herself and to a colleague — it
    // is NOT shown to the child anywhere (the D-6 boundary, declared in writing-review.ts).
    gradedAt: timestamp("graded_at", { withTimezone: true }),
    gradedBy: uuid("graded_by"), // plain uuid, NO cross-schema FK (house rule)
    score: integer("score"),
    feedback: text("feedback"),
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
    // K2a: the teacher's own recovery address — nullable, v2-ONLY. The v1 mirror has no
    // such column and is never written, so a v1-mirror teacher reads back null here until
    // she is promoted into domigo_v2 by setting one (upsertTeacherIdentity). Students never
    // get one: a child's way back in is her teacher, not her inbox.
    email: text("email"),
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
    // P2 (migration 0013): at most one TEACHER per case-insensitive handle, platform-wide.
    // lookupTeacherForAuth (auth.ts) matches lower(display_name) with `limit 1`, so a second
    // teacher of the same name would SILENTLY SHADOW the first at sign-in. The teacher-claim
    // service checks this in app code against BOTH registers; this index is the DB-level
    // backstop for the race that check cannot close (Neon HTTP has no transactions). PARTIAL,
    // like its student sibling: students are scoped per class and guarded by that index.
    teacherNicknameUnique: uniqueIndex("users_teacher_nickname_unique")
      .on(sql`lower(${t.displayName})`)
      .where(sql`${t.role} = 'teacher'`),
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
    kind: text("kind").notNull(), // 'import'|'claim'|'rename'|'remove'|'reset_pin'|'teacher_claim'|'progress_adjust'|'writing_graded' (app-validated)
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

/**
 * Zustands-Schnappschuss der Bestandsschüler VOR dem Jahres-Rollover 2026/27
 * (Kokis Ruling P-R1.1, „Tabula rasa + Schnappschuss in der Hinterhand").
 *
 * WOZU: das Schuljahr beginnt mit frisch angelegten Klassen und frisch
 * angelegten Konten — niemand nimmt sein altes Konto mit. Damit der erarbeitete
 * Lernstand trotzdem nicht verloren ist, wird er hier EINMAL je Schüler und
 * Etikett eingefroren: die v1-Konto-Zähler, der v2-Fortschritt, der
 * Karteikasten (Leitner) und eine SUMMEN-Sicht auf das Versuchs-Ledger.
 *
 * WAS HIER BEWUSST FEHLT: der Import. Die Lehrkraft soll diesen Stand später
 * auf ihre neu angelegten Schüler übertragen können — das ist ein SPÄTERES,
 * eigenes Feature. Diese Tabelle ist reine Sicherung; es gibt (noch) keinen
 * Lese-Pfad in der App, und es soll hier auch keiner entstehen.
 *
 * Befüllt wird sie NICHT von Laufzeit-Code, sondern von genau einem
 * `INSERT … SELECT` aus dem Runbook `docs/runbooks/rollover-snapshot.md`
 * — datenbank-intern, ohne dass je eine Personendaten-Zeile angezeigt wird.
 *
 * `v1UserId` ist eine wiederverwendete v1-uuid aus `public.users` — schlichte
 * Spalte, KEIN schema-übergreifender Fremdschlüssel (Haus-Regel).
 * Der Unique-Index auf (label, v1_user_id) macht einen zweiten Lauf desselben
 * Etiketts KONSTRUKTIV unmöglich statt bloss verboten.
 */
export const rolloverSnapshots = v2.table(
  "rollover_snapshots",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Jahrgangs-Etikett des Schnappschusses, z. B. '2025-26'. */
    label: text("label").notNull(),
    /** `public.users.id` des Schülers — kein FK (siehe oben). */
    v1UserId: uuid("v1_user_id").notNull(),
    realName: text("real_name"),
    displayName: text("display_name").notNull(),
    className: text("class_name"),
    grade: smallint("grade"),
    /** v1-Konto-Zähler: xp, grammar_xp, level, grammar_level, streak,
     *  last_session_date, total_sprints, total_flashcards, avatar_key,
     *  created_at, last_seen_at. */
    v1Stats: jsonb("v1_stats").notNull(),
    /** Zeile aus `domigo_v2.user_progress`; NULL, wenn es dort keine gibt. */
    v2Progress: jsonb("v2_progress"),
    /** Karteikasten: Array der `review_queue`-Zeilen (ref, box/Fach, due).
     *  Leerer Kasten = `[]`, nie NULL (`jsonb_agg` liefert sonst NULL). */
    leitner: jsonb("leitner"),
    /** SUMMEN über `practice_attempts` (Anzahl, correct, distinct Items,
     *  erster/letzter Zeitstempel) — nie die Einzelversuche: die bleiben
     *  im Ledger stehen. */
    attemptsSummary: jsonb("attempts_summary"),
    /** Anzahl abgeschlossener Lernpfad-Knoten (`study_path_progress`). */
    studyPathDone: integer("study_path_done"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    labelUserUnique: uniqueIndex("rollover_snapshots_label_user_unique").on(t.label, t.v1UserId),
    byLabel: index("rollover_snapshots_label_idx").on(t.label),
  }),
);

// ---------------------------------------------------------------------------
// K2a · THE TEACHER'S OWN ACCOUNT — journal, recovery, and a brake on guessing
// ---------------------------------------------------------------------------
// Three tables that close the "Phase C" gap the identity work has carried since
// P3. All additive, all inside domigo_v2, none reachable by a student path.

/**
 * The TEACHER journal — the sibling `roster_events` could never be.
 *
 * `roster_events.class_id` is NOT NULL and a teacher belongs to no class, so every
 * action on a teacher's own account (her PIN change, the grandmaster's transitional
 * PIN, her recovery mail) has until now happened unrecorded. The K1b reset route
 * says so in its own header and defers here. Widening the class-scoped table would
 * have meant a nullable class_id on the roster's audit trail — a permanent hole in
 * a guarantee that is currently airtight. A second, teacher-scoped journal keeps
 * both promises intact.
 *
 * `teacherId` is WHOSE ACCOUNT changed; `actorId` is WHOSE HAND did it. They differ
 * exactly when the grandmaster acts for a locked-out colleague, and that difference
 * is the only reason the second column exists — a journal that cannot tell "she
 * changed her PIN" from "the operator changed her PIN" is not an audit trail.
 *
 * `payload` carries ids, numbers and flags ONLY: never a name, never a PIN or hash,
 * never the address itself (`emailSet: true` says everything the journal needs to
 * say). Same frugality law as progress-adjust.ts.
 */
export const v2TeacherEvents = v2.table(
  "teacher_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    teacherId: uuid("teacher_id").notNull(), // whose ACCOUNT — plain uuid, NO cross-schema FK
    // 'pin_change'|'pin_reset_by_grandmaster'|'email_set'|'reset_requested'|'reset_consumed'
    // (app-validated, like every other `kind` in this schema)
    kind: text("kind").notNull(),
    actorId: uuid("actor_id"), // whose HAND — nullable; equals teacherId on self-service
    payload: jsonb("payload").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    byTeacher: index("teacher_events_teacher_idx").on(t.teacherId),
  }),
);

/**
 * One-shot recovery tokens for "PIN vergessen".
 *
 * THE PRIMARY KEY IS THE HASH, NOT THE TOKEN. A stolen copy of this table must not
 * read as a list of live tokens, so only sha256("domigo-reset:" + token) is stored
 * (the prefix is domain separation: the same random string hashed for another
 * purpose elsewhere can never collide with an entry here). It follows that the
 * plaintext link exists exactly once, in the mail — it cannot be recovered from the
 * database by anyone, us included.
 *
 * Lookup happens BY that hash, so no code path ever compares two token strings, and
 * the comparison is constant-time by construction rather than by discipline.
 *
 * Consumption is ONE guarded UPDATE (see reset-tokens.ts): the number of returned
 * rows decides the race between two clicks on the same link. Neon HTTP has no
 * multi-statement transactions, so a read-then-write would be exactly the race the
 * table exists to prevent.
 */
export const v2TeacherResetTokens = v2.table("teacher_reset_tokens", {
  tokenHash: text("token_hash").primaryKey(), // sha256 of "domigo-reset:<token>" — never the token
  teacherId: uuid("teacher_id").notNull(), // plain uuid, NO cross-schema FK
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  consumedAt: timestamp("consumed_at", { withTimezone: true }), // null = still usable
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * The sign-in brake — a counter per key, per rolling window.
 *
 * Until now nothing in this product slowed a PIN guesser down: not the teacher
 * sign-in, not the children's, not the `currentPin` check under Einstellungen. One
 * shared table serves all of them because the shape is identical everywhere, and
 * because a second table per surface would be three chances to forget one.
 *
 * `key` names the surface AND the identity it protects (`teacher:<name>`,
 * `student:<code>:<nick>`, `reset:<name>`), always lower-cased by its builder — a
 * brake that a different capitalisation walks around is not a brake. It carries no
 * personal data beyond the handle the visitor typed, and no row outlives its window
 * in any meaningful sense (the next attempt after the window resets it to 1).
 *
 * Window and counter turn in ONE statement (auth-throttle.ts). Reading the window,
 * deciding, then writing would let two parallel attempts each see a stale count.
 */
export const v2AuthThrottle = v2.table("auth_throttle", {
  key: text("key").primaryKey(),
  windowStart: timestamp("window_start", { withTimezone: true }).notNull(),
  count: integer("count").notNull(),
});

/**
 * K2b · THE ONE-TIME REGISTER for ops sign-in links (migration 0017).
 *
 * A table of SPENT tokens, and the primary key is the whole mechanism: redeeming
 * a link INSERTs the hash of its nonce with ON CONFLICT DO NOTHING, so two
 * presentations of one link race against the INDEX rather than against a
 * read-then-write in application code. The loser of that race gets zero returned
 * rows and is refused. Neon HTTP has no multi-statement transactions, which is
 * why this shape and not a check-then-write.
 *
 * THE NONCE IS HASHED, NEVER STORED (same law as teacher_reset_tokens): a
 * spent-token table that read back as a list of live token material would be a
 * downgrade dressed as a hardening. `expires_at` is the token's own `exp`, which
 * is what makes pruning safe — a row is useless once the clock refuses the token.
 */
export const v2OpsLinkUses = v2.table("ops_link_uses", {
  nonceHash: text("nonce_hash").primaryKey(), // sha256 of "domigo-ops-link-nonce:<nonce>"
  userId: uuid("user_id").notNull(), // plain uuid, NO cross-schema FK
  usedAt: timestamp("used_at", { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});
