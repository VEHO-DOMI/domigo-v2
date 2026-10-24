CREATE TABLE "domigo_v2"."vocabulary_checks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"class_id" uuid NOT NULL,
	"client_event_id" uuid NOT NULL,
	"visit_id" uuid NOT NULL,
	"check_number" smallint NOT NULL,
	"max_checks" smallint NOT NULL,
	"item_id" text NOT NULL,
	"unit_slug" text NOT NULL,
	"grade" smallint NOT NULL,
	"source_mode" text NOT NULL,
	"pool" text NOT NULL,
	"request_sha256" text NOT NULL,
	"evidence" jsonb NOT NULL,
	"client_checked_at" timestamp with time zone,
	"received_at" timestamp with time zone NOT NULL,
	"recorded_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vocabulary_checks_number_check" CHECK ("domigo_v2"."vocabulary_checks"."max_checks" in (1, 3) and "domigo_v2"."vocabulary_checks"."check_number" between 1 and "domigo_v2"."vocabulary_checks"."max_checks"),
	CONSTRAINT "vocabulary_checks_grade_check" CHECK ("domigo_v2"."vocabulary_checks"."grade" between 1 and 4),
	CONSTRAINT "vocabulary_checks_pool_check" CHECK ("domigo_v2"."vocabulary_checks"."pool" in ('carrier', 'definition', 'deToEn', 'enToDe')),
	CONSTRAINT "vocabulary_checks_hash_check" CHECK ("domigo_v2"."vocabulary_checks"."request_sha256" ~ '^[a-f0-9]{64}$')
);
--> statement-breakpoint
CREATE TABLE "domigo_v2"."vocabulary_visits" (
	"user_id" uuid NOT NULL,
	"class_id" uuid NOT NULL,
	"visit_id" uuid NOT NULL,
	"item_id" text NOT NULL,
	"pool" text NOT NULL,
	"source_mode" text NOT NULL,
	"max_checks" smallint NOT NULL,
	"displayed_revision" integer NOT NULL,
	"displayed_sha256" text,
	CONSTRAINT "vocabulary_visits_max_check" CHECK ("domigo_v2"."vocabulary_visits"."max_checks" in (1, 3)),
	CONSTRAINT "vocabulary_visits_revision_check" CHECK ("domigo_v2"."vocabulary_visits"."displayed_revision" > 0),
	CONSTRAINT "vocabulary_visits_hash_check" CHECK ("domigo_v2"."vocabulary_visits"."displayed_sha256" is null or "domigo_v2"."vocabulary_visits"."displayed_sha256" ~ '^[a-f0-9]{64}$')
);
--> statement-breakpoint
CREATE UNIQUE INDEX "vocabulary_checks_event_unique" ON "domigo_v2"."vocabulary_checks" USING btree ("user_id","client_event_id");--> statement-breakpoint
CREATE UNIQUE INDEX "vocabulary_checks_visit_number_unique" ON "domigo_v2"."vocabulary_checks" USING btree ("user_id","visit_id","check_number");--> statement-breakpoint
CREATE INDEX "vocabulary_checks_user_item_idx" ON "domigo_v2"."vocabulary_checks" USING btree ("user_id","item_id","recorded_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "vocabulary_checks_class_idx" ON "domigo_v2"."vocabulary_checks" USING btree ("class_id");--> statement-breakpoint
CREATE UNIQUE INDEX "vocabulary_visits_owner_unique" ON "domigo_v2"."vocabulary_visits" USING btree ("user_id","visit_id");--> statement-breakpoint
CREATE INDEX "vocabulary_visits_class_idx" ON "domigo_v2"."vocabulary_visits" USING btree ("class_id");