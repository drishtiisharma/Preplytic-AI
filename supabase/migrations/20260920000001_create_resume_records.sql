-- Create resumes bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', false) 
ON CONFLICT (id) DO NOTHING;

-- Set up Storage RLS policies for resumes bucket
CREATE POLICY "Users can upload their own resumes" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can read their own resumes" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own resumes" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own resumes" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create resume_records table
CREATE TABLE IF NOT EXISTS public.resume_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT DEFAULT 'application/pdf',
    status TEXT DEFAULT 'uploaded',
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS) for resume_records
ALTER TABLE public.resume_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own resume records" 
    ON public.resume_records FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resume records" 
    ON public.resume_records FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resume records" 
    ON public.resume_records FOR DELETE 
    USING (auth.uid() = user_id);