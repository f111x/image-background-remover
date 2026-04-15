-- Fix get_total_credits: Add LIMIT 1 and UUID validation to prevent PGRST204 errors
DROP FUNCTION IF EXISTS public.get_total_credits(UUID);
CREATE OR REPLACE FUNCTION public.get_total_credits(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_profile RECORD;
  v_monthly_remaining INTEGER := 0;
  v_total INTEGER := 0;
BEGIN
  -- Validate UUID input
  IF p_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid user ID');
  END IF;

  -- Guard against multiple profile rows (use LIMIT 1)
  SELECT * INTO v_profile FROM public.profiles WHERE id = p_user_id LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'User not found');
  END IF;

  -- Guard against multiple active subscriptions (use LIMIT 1)
  IF v_profile.is_subscriber THEN
    SELECT monthly_credits INTO v_monthly_remaining
    FROM public.subscriptions
    WHERE user_id = p_user_id AND status = 'active'
    LIMIT 1;
  END IF;

  v_total := v_profile.credits + COALESCE(v_monthly_remaining, 0) + v_profile.rollover_credits;

  RETURN jsonb_build_object(
    'success', true,
    'total_credits', v_total,
    'one_time_credits', v_profile.credits,
    'monthly_credits', COALESCE(v_monthly_remaining, 0),
    'rollover_credits', v_profile.rollover_credits,
    'is_subscriber', v_profile.is_subscriber
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix deduct_credits: Add LIMIT 1 guards
DROP FUNCTION IF EXISTS public.deduct_credits(UUID, INTEGER, TEXT);
CREATE OR REPLACE FUNCTION public.deduct_credits(
  p_user_id UUID,
  p_credits INTEGER,
  p_source TEXT DEFAULT 'one-time'
)
RETURNS JSONB AS $$
DECLARE
  v_profile RECORD;
  v_subscription RECORD;
  v_monthly_remaining INTEGER := 0;
  v_rollover_credits INTEGER := 0;
  v_one_time_credits INTEGER := 0;
  v_total INTEGER := 0;
  v_deducted INTEGER := 0;
BEGIN
  -- Validate UUID input
  IF p_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid user ID');
  END IF;

  -- Use LIMIT 1 to prevent multiple rows
  SELECT * INTO v_profile FROM public.profiles WHERE id = p_user_id LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'User not found');
  END IF;

  v_one_time_credits := v_profile.credits;
  v_rollover_credits := v_profile.rollover_credits;

  IF v_profile.is_subscriber THEN
    SELECT * INTO v_subscription FROM public.subscriptions
    WHERE user_id = p_user_id AND status = 'active'
    LIMIT 1;

    IF FOUND THEN
      v_monthly_remaining := v_subscription.monthly_credits;
    END IF;
  END IF;

  IF (COALESCE(v_monthly_remaining, 0) + v_rollover_credits + v_one_time_credits) < p_credits THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Insufficient credits',
      'total_available', (COALESCE(v_monthly_remaining, 0) + v_rollover_credits + v_one_time_credits)
    );
  END IF;

  -- Deduct from rollover first, then monthly, then one-time
  IF p_credits > 0 AND v_rollover_credits > 0 THEN
    IF v_rollover_credits >= p_credits THEN
      v_rollover_credits := v_rollover_credits - p_credits;
      v_deducted := p_credits;
      p_credits := 0;
    ELSE
      v_deducted := v_rollover_credits;
      p_credits := p_credits - v_rollover_credits;
      v_rollover_credits := 0;
    END IF;
  END IF;

  IF p_credits > 0 AND v_monthly_remaining > 0 THEN
    IF v_monthly_remaining >= p_credits THEN
      v_monthly_remaining := v_monthly_remaining - p_credits;
      v_deducted := v_deducted + p_credits;
      p_credits := 0;
    ELSE
      v_deducted := v_deducted + v_monthly_remaining;
      p_credits := p_credits - v_monthly_remaining;
      v_monthly_remaining := 0;
    END IF;
  END IF;

  IF p_credits > 0 THEN
    v_one_time_credits := v_one_time_credits - p_credits;
    v_deducted := v_deducted + p_credits;
    p_credits := 0;
  END IF;

  v_total := v_one_time_credits + v_monthly_remaining + v_rollover_credits;

  UPDATE public.profiles SET
    credits = v_one_time_credits,
    rollover_credits = v_rollover_credits,
    updated_at = NOW()
  WHERE id = p_user_id;

  IF v_profile.is_subscriber AND FOUND THEN
    UPDATE public.subscriptions
    SET monthly_credits = v_monthly_remaining,
        updated_at = NOW()
    WHERE user_id = p_user_id AND status = 'active';
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'credits_deducted', v_deducted,
    'total_credits', v_total,
    'one_time_remaining', v_one_time_credits,
    'monthly_remaining', v_monthly_remaining,
    'rollover_remaining', v_rollover_credits
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check for duplicate rows (for debugging)
-- SELECT id, COUNT(*) FROM public.profiles GROUP BY id HAVING COUNT(*) > 1;
-- SELECT user_id, COUNT(*) FROM public.subscriptions WHERE status = 'active' GROUP BY user_id HAVING COUNT(*) > 1;
