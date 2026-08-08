-- Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  selected_theme TEXT DEFAULT 'emerald',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Create Sponsorship Deals Table
CREATE TABLE IF NOT EXISTS public.sponsorship_deals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  brand_name TEXT NOT NULL,
  deal_amount NUMERIC NOT NULL DEFAULT 0,
  status TEXT CHECK (status IN ('INBOX', 'IN_PROGRESS', 'CLOSED_WIN', 'DECLINED')) DEFAULT 'INBOX',
  badge_type TEXT CHECK (badge_type IN ('HIGH BUDGET', 'NEEDS INFO', 'GIFTING')) DEFAULT 'NEEDS INFO',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Sponsorship Deals
ALTER TABLE public.sponsorship_deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own deals" 
ON public.sponsorship_deals FOR ALL USING (auth.uid() = user_id);
