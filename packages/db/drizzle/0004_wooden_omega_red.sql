CREATE TABLE "domigo_v2"."game_saves" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"class_id" uuid NOT NULL,
	"game_mode" text NOT NULL,
	"schema_version" smallint DEFAULT 1 NOT NULL,
	"client_rev" integer DEFAULT 0 NOT NULL,
	"state" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "game_saves_user_game_unique" ON "domigo_v2"."game_saves" USING btree ("user_id","game_mode");--> statement-breakpoint
CREATE INDEX "game_saves_user_idx" ON "domigo_v2"."game_saves" USING btree ("user_id");