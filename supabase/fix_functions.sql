-- Drop existing functions
DROP FUNCTION IF EXISTS public.get_total_credits(UUID);
DROP FUNCTION IF EXISTS public.deduct_credits(UUID, INTEGER, TEXT);
DROP FUNCTION IF EXISTS public.refresh_monthly_credits();

-- New get_total_credits
CREATE OR REPLACE FUNCTION public.get_total_credits(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_profile RECORD;
  v_monthly_remaining INTEGER := 0;
  v_total INTEGER := 0;
BEGIN
  SELECT * INTO v_profile FROM public.profiles WHERE id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'User not found');
  END IF;

  IF v_profile.is_subscriber THEN
    SELECT monthly_credits INTO v_monthly_remaining
    FROM public.subscriptions
    WHERE user_id = p_user_id AND status = 'active';
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

-- New deduct_credits
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
  SELECT * INTO v_profile FROM public.profiles WHERE id = p_user_id FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'User not found');
  END IF;

  v_one_time_credits := v_profile.credits;
  v_rollover_credits := v_profile.rollover_credits;

  IF v_profile.is_subscriber THEN
    SELECT * INTO v_subscription FROM public.subscriptions 
    WHERE user_id = p_user_id AND status = 'active' FOR UPDATE;
    
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

-- New refresh_monthly_credits
CREATE OR REPLACE FUNCTION public.refresh_monthly_credits()
RETURNS JSONB AS $$
DECLARE
  v_subscription RECORD;
  v_plan_monthly INTEGER;
BEGIN
  FOR v_subscription IN
    SELECT s.user_id, s.plan, s.monthly_credits as remaining, s.rollover_cap
    FROM public.subscriptions s
    WHERE s.status = 'active'
  LOOP
    CASE v_subscription.plan
      WHEN 'basic' THEN v_plan_monthly := 50;
      WHEN 'pro' THEN v_plan_monthly := 200;
      WHEN 'team' THEN v_plan_monthly := 600;
      ELSE v_plan_monthly := 50;
    END CASE;

    UPDATE public.profiles p SET
      rollover_credits = LEAST(v_subscription.remaining + p.rollover_credits, v_subscription.rollover_cap),
      updated_at = NOW()
    WHERE p.id = v_subscription.user_id;

    UPDATE public.subscriptions s SET
      monthly_credits = v_plan_monthly,
      next_billing = next_billing + INTERVAL '1 month',
      updated_at = NOW()
    WHERE s.user_id = v_subscription.user_id AND s.status = 'active';
  END LOOP;

  RETURN jsonb_build_object('success', true, 'refreshed_at', NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
