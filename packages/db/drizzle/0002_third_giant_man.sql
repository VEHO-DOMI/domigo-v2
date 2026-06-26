CREATE TABLE "domigo_v2"."study_path_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"class_id" uuid NOT NULL,
	"unit_slug" text NOT NULL,
	"grade" smallint NOT NULL,
	"node_id" text NOT NULL,
	"kind" text NOT NULL,
	"stars" smallint DEFAULT 0 NOT NULL,
	"completed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "study_path_progress_user_node_unique" ON "domigo_v2"."study_path_progress" USING btree ("user_id","unit_slug","node_id");--> statement-breakpoint
CREATE INDEX "study_path_progress_user_unit_idx" ON "domigo_v2"."study_path_progress" USING btree ("user_id","unit_slug");--> statement-breakpoint
CREATE INDEX "study_path_progress_user_idx" ON "domigo_v2"."study_path_progress" USING btree ("user_id");