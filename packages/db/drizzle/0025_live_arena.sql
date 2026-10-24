-- cgo-123. Additive and repeatable; execute only after GG review, never by Codex on Neon.
CREATE TABLE IF NOT EXISTS domigo_v2.live_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  class_id uuid NOT NULL CONSTRAINT live_rooms_class_id_classes_id_fk REFERENCES domigo_v2.classes(id) ON DELETE CASCADE,
  grade smallint NOT NULL,
  kind text NOT NULL,
  host_id uuid NOT NULL CONSTRAINT live_rooms_host_id_users_id_fk REFERENCES domigo_v2.users(id) ON DELETE CASCADE,
  guest_id uuid CONSTRAINT live_rooms_guest_id_users_id_fk REFERENCES domigo_v2.users(id) ON DELETE CASCADE,
  code text NOT NULL,
  mode text NOT NULL,
  phase text NOT NULL,
  round smallint NOT NULL DEFAULT 0,
  questions jsonb NOT NULL,
  phase_at timestamptz NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT live_rooms_kind_check CHECK (kind IN ('battle','quiz')),
  CONSTRAINT live_rooms_grade_check CHECK (grade BETWEEN 1 AND 4),
  CONSTRAINT live_rooms_mode_check CHECK (mode IN ('translation','definition','context')),
  CONSTRAINT live_rooms_phase_check CHECK (phase IN ('pending','lobby','countdown','active','result','complete','cancelled')),
  CONSTRAINT live_rooms_round_check CHECK (round >= 0 AND round < jsonb_array_length(questions)),
  CONSTRAINT live_rooms_questions_check CHECK (jsonb_typeof(questions) = 'array' AND ((kind = 'battle' AND jsonb_array_length(questions) = 5) OR (kind = 'quiz' AND jsonb_array_length(questions) IN (5,10,15)))),
  CONSTRAINT live_rooms_pair_check CHECK ((kind = 'battle' AND guest_id IS NOT NULL AND host_id <> guest_id) OR (kind = 'quiz' AND guest_id IS NULL)),
  CONSTRAINT live_rooms_code_check CHECK (code ~ '^[A-Z2-9]{6}$')
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS live_rooms_code_unique ON domigo_v2.live_rooms(code);
CREATE INDEX IF NOT EXISTS live_rooms_class_phase_idx ON domigo_v2.live_rooms(class_id,phase);
CREATE INDEX IF NOT EXISTS live_rooms_host_idx ON domigo_v2.live_rooms(host_id);
CREATE INDEX IF NOT EXISTS live_rooms_guest_idx ON domigo_v2.live_rooms(guest_id);
CREATE UNIQUE INDEX IF NOT EXISTS live_rooms_battle_pair_unique ON domigo_v2.live_rooms(least(host_id,guest_id),greatest(host_id,guest_id)) WHERE kind = 'battle' AND phase NOT IN ('complete','cancelled');
CREATE UNIQUE INDEX IF NOT EXISTS live_rooms_quiz_class_unique ON domigo_v2.live_rooms(class_id) WHERE kind = 'quiz' AND phase NOT IN ('complete','cancelled');
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS domigo_v2.live_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  room_id uuid NOT NULL CONSTRAINT live_members_room_id_live_rooms_id_fk REFERENCES domigo_v2.live_rooms(id) ON DELETE CASCADE,
  class_id uuid NOT NULL CONSTRAINT live_members_class_id_classes_id_fk REFERENCES domigo_v2.classes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL CONSTRAINT live_members_user_id_users_id_fk REFERENCES domigo_v2.users(id) ON DELETE CASCADE,
  seat smallint NOT NULL,
  answers jsonb NOT NULL DEFAULT '[]'::jsonb,
  CONSTRAINT live_members_seat_check CHECK (seat BETWEEN 0 AND 39),
  CONSTRAINT live_members_answers_check CHECK (jsonb_typeof(answers) = 'array' AND jsonb_array_length(answers) <= 15)
);
CREATE UNIQUE INDEX IF NOT EXISTS live_members_room_user_unique ON domigo_v2.live_members(room_id,user_id);
CREATE UNIQUE INDEX IF NOT EXISTS live_members_room_seat_unique ON domigo_v2.live_members(room_id,seat);
CREATE INDEX IF NOT EXISTS live_members_user_idx ON domigo_v2.live_members(user_id);
CREATE INDEX IF NOT EXISTS live_members_class_idx ON domigo_v2.live_members(class_id);
