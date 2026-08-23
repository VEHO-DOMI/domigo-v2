CREATE TABLE "domigo_v2"."rollover_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" text NOT NULL,
	"v1_user_id" uuid NOT NULL,
	"real_name" text,
	"display_name" text NOT NULL,
	"class_name" text,
	"grade" smallint,
	"v1_stats" jsonb NOT NULL,
	"v2_progress" jsonb,
	"leitner" jsonb,
	"attempts_summary" jsonb,
	"study_path_done" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "rollover_snapshots_label_user_unique" ON "domigo_v2"."rollover_snapshots" USING btree ("label","v1_user_id");--> statement-breakpoint
CREATE INDEX "rollover_snapshots_label_idx" ON "domigo_v2"."rollover_snapshots" USING btree ("label");