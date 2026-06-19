CREATE SCHEMA "domigo_v2";
--> statement-breakpoint
CREATE TABLE "domigo_v2"."practice_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"class_id" uuid NOT NULL,
	"item_id" text NOT NULL,
	"kind" text NOT NULL,
	"unit_slug" text NOT NULL,
	"grade" smallint NOT NULL,
	"mode" text NOT NULL,
	"tier" text NOT NULL,
	"correct" boolean NOT NULL,
	"xp_awarded" integer DEFAULT 0 NOT NULL,
	"latency_ms" integer,
	"hint_used" boolean DEFAULT false NOT NULL,
	"context" jsonb,
	"client_attempt_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "domigo_v2"."review_queue" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"item_id" text NOT NULL,
	"kind" text NOT NULL,
	"unit_slug" text NOT NULL,
	"grade" smallint NOT NULL,
	"box" smallint DEFAULT 1 NOT NULL,
	"due_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_tier" text,
	"reps" integer DEFAULT 0 NOT NULL,
	"lapses" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "domigo_v2"."user_progress" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"xp" integer DEFAULT 0 NOT NULL,
	"grammar_xp" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "practice_attempts_user_time_idx" ON "domigo_v2"."practice_attempts" USING btree ("user_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "practice_attempts_user_item_idx" ON "domigo_v2"."practice_attempts" USING btree ("user_id","item_id");--> statement-breakpoint
CREATE UNIQUE INDEX "practice_attempts_client_attempt_unique" ON "domigo_v2"."practice_attempts" USING btree ("user_id","client_attempt_id") WHERE client_attempt_id IS NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "review_queue_user_item_unique" ON "domigo_v2"."review_queue" USING btree ("user_id","item_id");--> statement-breakpoint
CREATE INDEX "review_queue_user_due_idx" ON "domigo_v2"."review_queue" USING btree ("user_id","due_at");--> statement-breakpoint
CREATE INDEX "review_queue_user_unit_idx" ON "domigo_v2"."review_queue" USING btree ("user_id","unit_slug");--> statement-breakpoint
CREATE INDEX "review_queue_user_grade_idx" ON "domigo_v2"."review_queue" USING btree ("user_id","grade");