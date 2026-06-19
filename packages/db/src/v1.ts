/**
 * READ-ONLY mirror table objects for v1's existing `public` tables, declared
 * only so the runtime can `select(...)` identity once auth lands. They are
 * INTENTIONALLY partial (only the columns we read) and are NEVER handed to
 * drizzle-kit (the config's `schema` points at schema.ts only), so they can
 * never be a migration/`push` target. Unused at runtime in the foundation PR
 * (dev identity is env/header).
 */
import { pgTable, uuid, text, smallint, boolean } from "drizzle-orm/pg-core";

/** Subset of `public.users` read for identity (auth PR). */
export const v1Users = pgTable("users", {
  id: uuid("id").primaryKey(),
  role: text("role").notNull(),
  displayName: text("display_name").notNull(),
  classId: uuid("class_id"),
});

/** Subset of `public.classes` read for grade + the smart-review feature flag. */
export const v1Classes = pgTable("classes", {
  id: uuid("id").primaryKey(),
  grade: smallint("grade").notNull(),
  smartReviewEnabled: boolean("smart_review_enabled").notNull(),
});
