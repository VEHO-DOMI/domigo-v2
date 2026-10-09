CREATE TABLE "domigo_v2"."duels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"class_id" uuid NOT NULL,
	"grade" smallint NOT NULL,
	"p1" uuid NOT NULL,
	"p2" uuid NOT NULL,
	"mode" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"rounds" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"p1_score" integer DEFAULT 0 NOT NULL,
	"p2_score" integer DEFAULT 0 NOT NULL,
	"winner" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "duels_mode_check" CHECK ("domigo_v2"."duels"."mode" in ('vocab', 'grammar')),
	CONSTRAINT "duels_status_check" CHECK ("domigo_v2"."duels"."status" in ('active', 'complete', 'expired')),
	CONSTRAINT "duels_grade_check" CHECK ("domigo_v2"."duels"."grade" between 1 and 4),
	CONSTRAINT "duels_pair_check" CHECK ("domigo_v2"."duels"."p1" <> "domigo_v2"."duels"."p2"),
	CONSTRAINT "duels_scores_check" CHECK ("domigo_v2"."duels"."p1_score" between 0 and 15 and "domigo_v2"."duels"."p2_score" between 0 and 15),
	CONSTRAINT "duels_winner_check" CHECK ("domigo_v2"."duels"."winner" is null or ("domigo_v2"."duels"."status" = 'complete' and "domigo_v2"."duels"."winner" in ("domigo_v2"."duels"."p1", "domigo_v2"."duels"."p2"))),
	CONSTRAINT "duels_rounds_check" CHECK (jsonb_typeof("domigo_v2"."duels"."rounds") = 'array' and jsonb_array_length("domigo_v2"."duels"."rounds") <= 5)
);
--> statement-breakpoint
CREATE INDEX "duels_class_status_idx" ON "domigo_v2"."duels" USING btree ("class_id","status");--> statement-breakpoint
CREATE INDEX "duels_p1_idx" ON "domigo_v2"."duels" USING btree ("p1");--> statement-breakpoint
CREATE INDEX "duels_p2_idx" ON "domigo_v2"."duels" USING btree ("p2");--> statement-breakpoint
CREATE UNIQUE INDEX "duels_active_pair_unique" ON "domigo_v2"."duels" USING btree (least("p1", "p2"),greatest("p1", "p2")) WHERE "domigo_v2"."duels"."status" = 'active';