-- cgo-094 · Additive, independent of 0020_story_world_settings (PR 490).
-- Koki applies this file via the Neon SQL editor. No seed rows, no class changes.
CREATE TABLE IF NOT EXISTS "domigo_v2"."class_settings" (
  "class_id" uuid PRIMARY KEY NOT NULL,
  "purpose" text DEFAULT 'regular' NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "class_settings_purpose_check" CHECK ("purpose" IN ('regular', 'test'))
);
