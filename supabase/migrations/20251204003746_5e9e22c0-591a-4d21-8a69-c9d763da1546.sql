-- Create hydration_logs table to track daily water intake
CREATE TABLE public.hydration_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount_ml INTEGER NOT NULL DEFAULT 250,
  logged_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.hydration_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own hydration logs" 
ON public.hydration_logs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own hydration logs" 
ON public.hydration_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own hydration logs" 
ON public.hydration_logs 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_hydration_logs_user_date ON public.hydration_logs (user_id, logged_at);