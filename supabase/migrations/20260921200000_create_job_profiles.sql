-- Create job_profiles table
CREATE TABLE IF NOT EXISTS public.job_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    type TEXT,
    experience TEXT,
    job_description TEXT,
    required_skills TEXT,
    preferred_skills TEXT,
    education TEXT,
    responsibilities TEXT,
    qualifications TEXT,
    salary TEXT,
    job_url TEXT,
    match_score INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.job_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own job profiles"
    ON public.job_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own job profiles"
    ON public.job_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own job profiles"
    ON public.job_profiles FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own job profiles"
    ON public.job_profiles FOR DELETE
    USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_job_profiles_updated_at()
RETURNS TRIGGER AS $function
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function language 'plpgsql';

CREATE TRIGGER update_job_profiles_updated_at_trigger
    BEFORE UPDATE ON public.job_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_job_profiles_updated_at();