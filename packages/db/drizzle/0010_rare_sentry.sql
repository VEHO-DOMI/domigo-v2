CREATE TABLE "domigo_v2"."content_checks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"draft_id" uuid NOT NULL,
	"check_kind" text NOT NULL,
	"verdict" text NOT NULL,
	"evidence" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "domigo_v2"."content_drafts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" text NOT NULL,
	"unit_slug" text NOT NULL,
	"kind" text NOT NULL,
	"item" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"action" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"updated_by" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "domigo_v2"."unit_meta" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"unit_slug" text NOT NULL,
	"title" text NOT NULL,
	"updated_by" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "content_checks_draft_idx" ON "domigo_v2"."content_checks" USING btree ("draft_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE UNIQUE INDEX "content_drafts_item_unique" ON "domigo_v2"."content_drafts" USING btree ("item_id");--> statement-breakpoint
CREATE INDEX "content_drafts_status_idx" ON "domigo_v2"."content_drafts" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "unit_meta_slug_unique" ON "domigo_v2"."unit_meta" USING btree ("unit_slug");