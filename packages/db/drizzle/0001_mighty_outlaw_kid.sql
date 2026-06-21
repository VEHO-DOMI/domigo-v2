ALTER TABLE "domigo_v2"."user_progress" ADD COLUMN "streak" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "domigo_v2"."user_progress" ADD COLUMN "last_session_date" text;