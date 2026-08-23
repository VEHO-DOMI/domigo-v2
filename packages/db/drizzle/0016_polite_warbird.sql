CREATE TABLE "domigo_v2"."auth_throttle" (
	"key" text PRIMARY KEY NOT NULL,
	"window_start" timestamp with time zone NOT NULL,
	"count" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "domigo_v2"."teacher_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"teacher_id" uuid NOT NULL,
	"kind" text NOT NULL,
	"actor_id" uuid,
	"payload" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "domigo_v2"."teacher_reset_tokens" (
	"token_hash" text PRIMARY KEY NOT NULL,
	"teacher_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"consumed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "domigo_v2"."users" ADD COLUMN "email" text;--> statement-breakpoint
CREATE INDEX "teacher_events_teacher_idx" ON "domigo_v2"."teacher_events" USING btree ("teacher_id");