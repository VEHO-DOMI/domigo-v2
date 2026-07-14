CREATE TABLE "domigo_v2"."content_overrides" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" text NOT NULL,
	"unit_slug" text NOT NULL,
	"kind" text NOT NULL,
	"patch" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"folded_at" timestamp with time zone,
	"updated_by" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "domigo_v2"."content_revisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" text NOT NULL,
	"unit_slug" text NOT NULL,
	"patch" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"action" text NOT NULL,
	"actor_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "domigo_v2"."site_copy" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"value" text NOT NULL,
	"updated_by" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "content_overrides_item_unique" ON "domigo_v2"."content_overrides" USING btree ("item_id");--> statement-breakpoint
CREATE INDEX "content_overrides_status_idx" ON "domigo_v2"."content_overrides" USING btree ("status");--> statement-breakpoint
CREATE INDEX "content_revisions_item_idx" ON "domigo_v2"."content_revisions" USING btree ("item_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE UNIQUE INDEX "site_copy_key_unique" ON "domigo_v2"."site_copy" USING btree ("key");