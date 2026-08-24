ALTER TABLE "domigo_v2"."writing_submissions" ADD COLUMN "graded_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "domigo_v2"."writing_submissions" ADD COLUMN "graded_by" uuid;--> statement-breakpoint
ALTER TABLE "domigo_v2"."writing_submissions" ADD COLUMN "score" integer;--> statement-breakpoint
ALTER TABLE "domigo_v2"."writing_submissions" ADD COLUMN "feedback" text;