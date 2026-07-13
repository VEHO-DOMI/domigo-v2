ALTER TABLE "domigo_v2"."assignment_sections" ADD COLUMN "section_config" jsonb;--> statement-breakpoint
ALTER TABLE "domigo_v2"."assignments" ADD COLUMN "display_config" jsonb;