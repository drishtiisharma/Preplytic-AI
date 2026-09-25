ALTER TABLE public.candidate_profiles
ADD COLUMN IF NOT EXISTS github_url TEXT;