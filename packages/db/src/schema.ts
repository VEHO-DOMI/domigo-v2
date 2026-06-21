/**
 * v2-owned tables — ALL inside the `domigo_v2` Postgres schema. v1 lives in
 * `public`; we NEVER issue DDL/writes on `public`. The schema namespace is the
 * strongest additive-safety wall: `drizzle-kit` (scoped by `schemaFilter`) is
 * structurally incapable of dropping/altering a v1 table.
 */
import {
  pgSchema,
  uuid,
  text,
  integer,
  smallint,
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
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
