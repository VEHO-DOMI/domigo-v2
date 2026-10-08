-- cgo-070. Additive only; Koki applies in Neon before the PR is merged.
-- No seed rows: absent grades retain their release.json defaults.
CREATE TABLE "domigo_v2"."story_world_settings" (
	"grade" smallint PRIMARY KEY NOT NULL,
	"is_open" boolean NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "story_world_settings_grade_check" CHECK ("domigo_v2"."story_world_settings"."grade" between 1 and 4)
);
