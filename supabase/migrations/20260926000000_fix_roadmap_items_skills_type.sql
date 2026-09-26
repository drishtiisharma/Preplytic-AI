-- Safe migration to convert skills and resources from text to text[]
-- It handles both standard strings and JSON-stringified arrays.

ALTER TABLE roadmap_items 
  ALTER COLUMN skills TYPE text[] 
  USING (
    CASE 
      WHEN skills IS NULL THEN NULL
      WHEN skills LIKE '[%]' THEN ARRAY(SELECT jsonb_array_elements_text(skills::jsonb))
      WHEN skills = '' THEN '{}'::text[]
      ELSE string_to_array(skills, ',')
    END
  );

ALTER TABLE roadmap_items 
  ALTER COLUMN resources TYPE text[] 
  USING (
    CASE 
      WHEN resources IS NULL THEN NULL
      WHEN resources LIKE '[%]' THEN ARRAY(SELECT jsonb_array_elements_text(resources::jsonb))
      WHEN resources = '' THEN '{}'::text[]
      ELSE string_to_array(resources, ',')
    END
  );