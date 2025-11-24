-- Create exercise_library table
CREATE TABLE public.exercise_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  muscle_group text NOT NULL,
  difficulty text,
  description text,
  gif_url text,
  equipment jsonb DEFAULT '[]'::jsonb,
  sets integer,
  reps text,
  rest_time integer,
  duration text,
  instructions jsonb DEFAULT '[]'::jsonb,
  tips jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.exercise_library ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can view exercises"
  ON public.exercise_library
  FOR SELECT
  USING (true);

-- Create index for faster searches
CREATE INDEX idx_exercise_library_muscle_group ON public.exercise_library(muscle_group);
CREATE INDEX idx_exercise_library_difficulty ON public.exercise_library(difficulty);
CREATE INDEX idx_exercise_library_name ON public.exercise_library(name);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_exercise_library_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_exercise_library_updated_at
  BEFORE UPDATE ON public.exercise_library
  FOR EACH ROW
  EXECUTE FUNCTION public.update_exercise_library_updated_at();