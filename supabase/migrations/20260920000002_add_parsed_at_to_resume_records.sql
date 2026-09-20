-- Add parsed_at column to resume_records
ALTER TABLE public.resume_records ADD COLUMN IF NOT EXISTS parsed_at TIMESTAMP WITH TIME ZONE;

-- Add UPDATE policy to resume_records
CREATE POLICY "Users can update their own resume records" 
    ON public.resume_records FOR UPDATE 
    USING (auth.uid() = user_id);