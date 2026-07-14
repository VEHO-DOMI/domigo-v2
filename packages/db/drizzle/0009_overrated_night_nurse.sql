CREATE TABLE "domigo_v2"."game_world_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"world_id" text NOT NULL,
	"event_id" text NOT NULL,
	"event_type" text NOT NULL,
	"source_id" text NOT NULL,
	"area_id" text,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "domigo_v2"."student_world_states" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"class_id" uuid NOT NULL,
	"world_id" text NOT NULL,
	"current_area_id" text NOT NULL,
	"current_spawn_id" text NOT NULL,
	"pos_x" integer NOT NULL,
	"pos_y" integer NOT NULL,
	"visited_area_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"state_payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "domigo_v2"."xp_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"world_id" text NOT NULL,
	"source_type" text NOT NULL,
	"source_id" text NOT NULL,
	"amount" integer NOT NULL,
	"reason" text NOT NULL,
	"idempotency_key" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "domigo_v2"."practice_attempts" ADD COLUMN "world_id" text;--> statement-breakpoint
ALTER TABLE "domigo_v2"."practice_attempts" ADD COLUMN "world_encounter_id" text;--> statement-breakpoint
ALTER TABLE "domigo_v2"."users" ADD COLUMN "is_test_profile" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "game_world_events_user_world_event_unique" ON "domigo_v2"."game_world_events" USING btree ("user_id","world_id","event_id");--> statement-breakpoint
CREATE INDEX "game_world_events_user_world_idx" ON "domigo_v2"."game_world_events" USING btree ("user_id","world_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "student_world_states_user_world_unique" ON "domigo_v2"."student_world_states" USING btree ("user_id","world_id");--> statement-breakpoint
CREATE INDEX "student_world_states_world_idx" ON "domigo_v2"."student_world_states" USING btree ("world_id");--> statement-breakpoint
CREATE UNIQUE INDEX "xp_entries_user_key_unique" ON "domigo_v2"."xp_entries" USING btree ("user_id","idempotency_key");--> statement-breakpoint
CREATE INDEX "xp_entries_user_world_idx" ON "domigo_v2"."xp_entries" USING btree ("user_id","world_id","created_at");--> statement-breakpoint
CREATE INDEX "practice_attempts_world_encounter_idx" ON "domigo_v2"."practice_attempts" USING btree ("user_id","world_id","world_encounter_id");