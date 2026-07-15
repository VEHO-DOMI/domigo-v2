CREATE TABLE "domigo_v2"."content_solve_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" text NOT NULL,
	"unit_slug" text NOT NULL,
	"kind" text NOT NULL,
	"model" text NOT NULL,
	"status" text DEFAULT 'running' NOT NULL,
	"sandbox_id" text,
	"answer" jsonb,
	"graded_tier" text,
	"error_message" text,
	"cost_usd" numeric(10, 6),
	"input_tokens" integer,
	"output_tokens" integer,
	"num_turns" integer,
	"triggered_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX "content_solve_runs_item_idx" ON "domigo_v2"."content_solve_runs" USING btree ("item_id","created_at" DESC NULLS LAST);