-- cgo-108: additive; identity mirror remains untouched. Apply after 0020/0021.
CREATE TABLE IF NOT EXISTS "domigo_v2"."student_profile" (
  "user_id" uuid PRIMARY KEY NOT NULL,
  "avatar" smallint NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "student_profile_avatar_check" CHECK ("avatar" between 1 and 50)
);
