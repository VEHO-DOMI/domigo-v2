ALTER TABLE "domigo_v2"."practice_attempts" ADD COLUMN "booked_at" timestamp with time zone;--> statement-breakpoint
-- cgo-154 / Weg B: one HTTP statement is one PostgreSQL transaction. The marker
-- is written LAST; any exception (including the final update) rolls back every
-- write. SECURITY INVOKER does not grant privileges beyond the application role.
CREATE FUNCTION "domigo_v2"."book_http_attempt"(
  p_scope uuid[], p_attempt jsonb, p_review boolean, p_now timestamptz,
  p_today text, p_yesterday text, p_intervals jsonb, p_max_box integer
) RETURNS TABLE (duplicate boolean, box integer, due_at timestamptz, streak integer, tier text, xp_awarded integer)
LANGUAGE plpgsql SECURITY INVOKER SET search_path = pg_catalog, domigo_v2 AS $$
DECLARE
  v_input domigo_v2.practice_attempts%ROWTYPE;
  v_row domigo_v2.practice_attempts%ROWTYPE;
  v_duplicate boolean := false;
  v_box integer;
  v_due timestamptz;
  v_streak integer;
  v_review_id uuid;
BEGIN
  v_input := jsonb_populate_record(NULL::domigo_v2.practice_attempts, p_attempt);
  IF p_scope IS NULL OR v_input.class_id IS NULL OR NOT (v_input.class_id = ANY(p_scope))
    OR v_input.user_id IS NULL OR v_input.client_attempt_id IS NULL THEN
    RAISE EXCEPTION 'attempt_scope_denied';
  END IF;
  IF v_input.mode LIKE 'duel:%' OR v_input.mode LIKE 'live:%' OR v_input.mode = 'vocabulary-check'
    OR v_input.kind NOT IN ('vocab', 'grammar', 'listening', 'reading')
    OR v_input.tier NOT IN ('correct', 'partial', 'close', 'wrong') OR v_input.xp_awarded < 0 THEN
    RAISE EXCEPTION 'attempt_booking_invalid';
  END IF;

  -- The unique key serializes competing retries. A conflict waits for the
  -- original transaction, then the following statement sees its committed row.
  INSERT INTO domigo_v2.practice_attempts AS a
    (user_id, class_id, item_id, kind, unit_slug, grade, mode, tier, correct,
     xp_awarded, latency_ms, hint_used, context, client_attempt_id, created_at, booked_at)
  VALUES (v_input.user_id, v_input.class_id, v_input.item_id, v_input.kind,
    v_input.unit_slug, v_input.grade, v_input.mode, v_input.tier, v_input.tier = 'correct',
    v_input.xp_awarded, v_input.latency_ms, COALESCE(v_input.hint_used, false),
    v_input.context, v_input.client_attempt_id, p_now, NULL)
  ON CONFLICT (user_id, client_attempt_id) DO NOTHING
  RETURNING a.* INTO v_row;

  IF NOT FOUND THEN
    v_duplicate := true;
    SELECT a.* INTO STRICT v_row FROM domigo_v2.practice_attempts a
      WHERE a.user_id = v_input.user_id AND a.client_attempt_id = v_input.client_attempt_id
      FOR UPDATE;
    IF v_row.class_id IS DISTINCT FROM v_input.class_id
      OR v_row.item_id IS DISTINCT FROM v_input.item_id OR v_row.mode IS DISTINCT FROM v_input.mode
      OR v_row.kind IS DISTINCT FROM v_input.kind OR v_row.unit_slug IS DISTINCT FROM v_input.unit_slug
      OR v_row.grade IS DISTINCT FROM v_input.grade THEN
      RAISE EXCEPTION 'attempt_identity_conflict';
    END IF;
    -- Legacy rows can be wholly or partly booked. Their totals cannot prove
    -- which case occurred. Preserve them and refuse to acknowledge/re-award.
    IF v_row.booked_at IS NULL THEN RAISE EXCEPTION 'attempt_unconfirmed'; END IF;
  ELSE
    IF p_review AND v_input.kind IN ('vocab', 'grammar') THEN
      v_box := CASE WHEN v_input.tier = 'correct' THEN LEAST(2, p_max_box) ELSE 1 END;
      INSERT INTO domigo_v2.review_queue AS q
        (user_id, item_id, kind, unit_slug, grade, box, due_at, last_tier, reps, lapses, created_at, updated_at)
      VALUES (v_input.user_id, v_input.item_id, v_input.kind, v_input.unit_slug, v_input.grade,
        v_box, p_now, v_input.tier, 1, CASE WHEN v_input.tier = 'wrong' THEN 1 ELSE 0 END, p_now, p_now)
      ON CONFLICT (user_id, item_id) DO UPDATE SET
        box = CASE WHEN v_input.tier = 'correct' THEN LEAST(q.box + 1, p_max_box)
          WHEN v_input.tier = 'wrong' THEN 1 ELSE GREATEST(q.box, 1) END,
        last_tier = v_input.tier, reps = q.reps + 1,
        lapses = q.lapses + CASE WHEN v_input.tier = 'wrong' THEN 1 ELSE 0 END, updated_at = p_now
      RETURNING q.id, q.box INTO v_review_id, v_box;
      v_due := p_now + COALESCE((p_intervals ->> v_box::text)::bigint, (p_intervals ->> '1')::bigint) * INTERVAL '1 millisecond';
      UPDATE domigo_v2.review_queue q SET due_at = v_due WHERE q.id = v_review_id;
    END IF;

    INSERT INTO domigo_v2.user_progress AS p (user_id, xp, grammar_xp, streak, last_session_date, updated_at)
    VALUES (v_input.user_id, CASE WHEN v_input.kind = 'vocab' THEN v_input.xp_awarded ELSE 0 END,
      CASE WHEN v_input.kind = 'vocab' THEN 0 ELSE v_input.xp_awarded END, 1, p_today, p_now)
    ON CONFLICT (user_id) DO UPDATE SET
      xp = p.xp + EXCLUDED.xp, grammar_xp = p.grammar_xp + EXCLUDED.grammar_xp,
      streak = CASE WHEN p.last_session_date = p_today THEN GREATEST(p.streak, 1)
        WHEN p.last_session_date = p_yesterday THEN COALESCE(p.streak, 0) + 1 ELSE 1 END,
      last_session_date = p_today, updated_at = p_now;

    -- A receipt can never precede all review/progress writes. This statement
    -- is inside the same transaction as them, not a later network request.
    UPDATE domigo_v2.practice_attempts a SET booked_at = p_now WHERE a.id = v_row.id;
  END IF;
  SELECT q.box, q.due_at INTO v_box, v_due FROM domigo_v2.review_queue q
    WHERE q.user_id = v_input.user_id AND q.item_id = v_input.item_id;
  SELECT p.streak INTO v_streak FROM domigo_v2.user_progress p WHERE p.user_id = v_input.user_id;
  RETURN QUERY SELECT v_duplicate, COALESCE(v_box, 1), COALESCE(v_due, p_now),
    COALESCE(v_streak, 0), v_row.tier, v_row.xp_awarded;
END;
$$;
