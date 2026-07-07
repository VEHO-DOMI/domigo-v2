CREATE TABLE "domigo_v2"."assignment_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assignment_id" uuid NOT NULL,
	"position" smallint NOT NULL,
	"kind" text NOT NULL,
	"item_ids" jsonb,
	"listening_task_id" text,
	"writing_prompt_id" text,
	"timer_minutes" integer,
	"weight_pct" smallint DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "domigo_v2"."assignment_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assignment_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"attempt_number" smallint DEFAULT 1 NOT NULL,
	"expires_at" timestamp with time zone,
	"current_section" smallint DEFAULT 0 NOT NULL,
	"section_times" jsonb,
	"submitted_at" timestamp with time zone,
	"score_pct" numeric(5, 2),
	"note" smallint,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "domigo_v2"."assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"class_id" uuid NOT NULL,
	"created_by" uuid NOT NULL,
	"title" text NOT NULL,
	"description_de" text,
	"mode" text NOT NULL,
	"starts_at" timestamp with time zone,
	"due_at" timestamp with time zone,
	"archived_at" timestamp with time zone,
	"session_duration_minutes" integer,
	"attempts_per_test" smallint DEFAULT 1 NOT NULL,
	"noten_schluessel" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "domigo_v2"."reserved_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"class_id" uuid NOT NULL,
	"item_id" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"released_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "domigo_v2"."writing_submissions" ADD COLUMN "assignment_id" uuid;--> statement-breakpoint
ALTER TABLE "domigo_v2"."writing_submissions" ADD COLUMN "session_id" uuid;--> statement-breakpoint
CREATE INDEX "assignment_sections_assignment_idx" ON "domigo_v2"."assignment_sections" USING btree ("assignment_id","position");--> statement-breakpoint
CREATE UNIQUE INDEX "assignment_sessions_attempt_unique" ON "domigo_v2"."assignment_sessions" USING btree ("assignment_id","user_id","attempt_number");--> statement-breakpoint
CREATE INDEX "assignment_sessions_user_idx" ON "domigo_v2"."assignment_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "assignment_sessions_assignment_idx" ON "domigo_v2"."assignment_sessions" USING btree ("assignment_id");--> statement-breakpoint
CREATE INDEX "assignments_class_idx" ON "domigo_v2"."assignments" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX "assignments_creator_idx" ON "domigo_v2"."assignments" USING btree ("created_by");--> statement-breakpoint
CREATE UNIQUE INDEX "reserved_items_class_item_unique" ON "domigo_v2"."reserved_items" USING btree ("class_id","item_id");--> statement-breakpoint
CREATE INDEX "reserved_items_class_idx" ON "domigo_v2"."reserved_items" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX "writing_submissions_assignment_idx" ON "domigo_v2"."writing_submissions" USING btree ("assignment_id");