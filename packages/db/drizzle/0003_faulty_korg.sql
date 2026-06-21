CREATE TABLE "domigo_v2"."writing_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"class_id" uuid NOT NULL,
	"unit_slug" text NOT NULL,
	"test_id" text NOT NULL,
	"prompt_id" text NOT NULL,
	"text" text NOT NULL,
	"word_count" integer NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "writing_submissions_user_idx" ON "domigo_v2"."writing_submissions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "writing_submissions_class_unit_idx" ON "domigo_v2"."writing_submissions" USING btree ("class_id","unit_slug");