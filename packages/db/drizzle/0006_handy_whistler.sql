CREATE TABLE "domigo_v2"."classes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"invite_code" text NOT NULL,
	"grade" smallint NOT NULL,
	"teacher_id" uuid NOT NULL,
	"smart_review_enabled" boolean DEFAULT true NOT NULL,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "domigo_v2"."users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role" text NOT NULL,
	"display_name" text NOT NULL,
	"given_name" text,
	"class_id" uuid,
	"pin_hash" text NOT NULL,
	"claimed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "domigo_v2"."roster_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"class_id" uuid NOT NULL,
	"kind" text NOT NULL,
	"payload" jsonb NOT NULL,
	"actor_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "classes_invite_code_unique" ON "domigo_v2"."classes" USING btree ("invite_code");--> statement-breakpoint
CREATE INDEX "classes_teacher_idx" ON "domigo_v2"."classes" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "users_class_idx" ON "domigo_v2"."users" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX "roster_events_class_idx" ON "domigo_v2"."roster_events" USING btree ("class_id");