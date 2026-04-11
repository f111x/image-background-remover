-- =====================================================
-- ImageTools User System Schema v2.1
-- Fixed: deduct_credits returns total, refresh is complete
-- =====================================================

-- =====================================================
-- TABLE: usage_history (if not exists)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.usage_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  credits_used INTEGER NOT NULL DEFAULT 0,
  image_size BIGINT,
  source TEXT DEFAULT 'one-time',
  status TEXT NOT NULL DEFAULT 'success',
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.usage_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Allow all for authenticated" ON public.usage_history FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- TABLE: purchases (if not exists)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  package_name TEXT NOT NULL,
  credits INTEGER NOT NULL,
  amount_paid TEXT DEFAULT '0',
  status TEXT NOT NULL DEFAULT 'pending',
  paypal_order_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Allow all for authenticated" ON public.purchases FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- TABLE: subscriptions (if not exists)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  plan TEXT NOT NULL DEFAULT 'basic',
  status TEXT NOT NULL DEFAULT 'active',
  subscription_id TEXT UNIQUE,
  subscription_plan TEXT,
  subscription_status TEXT DEFAULT 'active',
  monthly_credits INTEGER NOT NULL DEFAULT 50,
  rollover_cap INTEGER NOT NULL DEFAULT 100,
  next_billing TIMESTAMPTZ,
  last_subscription_credit INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Allow all for authenticated" ON public.subscriptions FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- PROFILES TABLE: Add missing subscription columns (if not exist)
-- Run these as ALTER TABLE (idempotent)
-- =====================================================
DO $$ BEGIN
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_id TEXT;
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_plan TEXT;
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive';
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_subscription_credit INTEGER DEFAULT 0;
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS rollover_credits INTEGER DEFAULT 0;
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
EXCEPTION WHEN others THEN NULL;
END $$;

-- =====================================================
-- FUNCTION: Get total available credits
-- =====================================================
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

  -- If subscriber, get remaining monthly allocation
  IF v_profile.is_subscriber THEN
    SELECT monthly_credits INTO v_monthly_remaining
    FROM public.subscriptions
    WHERE user_id = p_user_id AND status = 'active';
  END IF;

  -- Total = one-time + monthly remaining + rollover
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

-- =====================================================
-- FUNCTION: Deduct credits
-- Priority: rollover -> monthly -> one-time
-- Returns total remaining credits
-- =====================================================
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

  -- Initialize
  v_one_time_credits := v_profile.credits;
  v_rollover_credits := v_profile.rollover_credits;

  -- Get subscription info if subscriber
  IF v_profile.is_subscriber THEN
    SELECT * INTO v_subscription FROM public.subscriptions 
    WHERE user_id = p_user_id AND status = 'active' FOR UPDATE;
    
    IF FOUND THEN
      v_monthly_remaining := v_subscription.monthly_credits;
    END IF;
  END IF;

  -- Check if enough credits
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

  -- Calculate new total
  v_total := v_one_time_credits + v_monthly_remaining + v_rollover_credits;

  -- Update profile
  UPDATE public.profiles SET
    credits = v_one_time_credits,
    rollover_credits = v_rollover_credits,
    updated_at = NOW()
  WHERE id = p_user_id;

  -- Update subscription monthly credits
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

-- =====================================================
-- FUNCTION: Refresh monthly credits (call monthly via cron)
-- Resets monthly credits to plan allocation + carries over unused
-- =====================================================
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
    -- Determine plan's full monthly allocation
    CASE v_subscription.plan
      WHEN 'basic' THEN v_plan_monthly := 50;
      WHEN 'pro' THEN v_plan_monthly := 200;
      WHEN 'team' THEN v_plan_monthly := 600;
      ELSE v_plan_monthly := 50;
    END CASE;

    -- Carry over unused monthly credits (up to rollover cap)
    -- remaining is what wasn't used from last month
    -- new rollover = remaining + old rollover (capped)
    UPDATE public.profiles p SET
      rollover_credits = LEAST(v_subscription.remaining + p.rollover_credits, v_subscription.rollover_cap),
      updated_at = NOW()
    WHERE p.id = v_subscription.user_id;

    -- Reset subscription to full monthly allocation
    UPDATE public.subscriptions s SET
      monthly_credits = v_plan_monthly,
      next_billing = next_billing + INTERVAL '1 month',
      updated_at = NOW()
    WHERE s.user_id = v_subscription.user_id AND s.status = 'active';
    
  END LOOP;

  RETURN jsonb_build_object('success', true, 'refreshed_at', NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
