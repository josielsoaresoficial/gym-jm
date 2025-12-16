-- Adicionar colunas faltantes em diet_daily_plans
ALTER TABLE public.diet_daily_plans 
ADD COLUMN IF NOT EXISTS is_weekend boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS fasting_hours integer DEFAULT 0;

-- Adicionar colunas faltantes em notification_preferences
ALTER TABLE public.notification_preferences 
ADD COLUMN IF NOT EXISTS hydration_reminder_interval integer DEFAULT 60,
ADD COLUMN IF NOT EXISTS weight_reminder_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS weight_reminder_day text DEFAULT 'monday',
ADD COLUMN IF NOT EXISTS weight_reminder_time text DEFAULT '08:00',
ADD COLUMN IF NOT EXISTS photo_reminder_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS photo_reminder_day text DEFAULT 'monday';

-- Adicionar colunas faltantes em exercise_library
ALTER TABLE public.exercise_library 
ADD COLUMN IF NOT EXISTS duration integer,
ADD COLUMN IF NOT EXISTS sets integer,
ADD COLUMN IF NOT EXISTS reps integer,
ADD COLUMN IF NOT EXISTS rest_time integer,
ADD COLUMN IF NOT EXISTS tips text[],
ADD COLUMN IF NOT EXISTS secondary_muscles text[],
ADD COLUMN IF NOT EXISTS calories_per_minute numeric;

-- Adicionar colunas faltantes em profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS fitness_goal text,
ADD COLUMN IF NOT EXISTS weight numeric,
ADD COLUMN IF NOT EXISTS height numeric,
ADD COLUMN IF NOT EXISTS age integer,
ADD COLUMN IF NOT EXISTS gender text,
ADD COLUMN IF NOT EXISTS activity_level text,
ADD COLUMN IF NOT EXISTS daily_calories_goal integer,
ADD COLUMN IF NOT EXISTS daily_protein_goal integer,
ADD COLUMN IF NOT EXISTS daily_carbs_goal integer,
ADD COLUMN IF NOT EXISTS daily_fat_goal integer,
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Criar tabela de exercícios favoritos
CREATE TABLE public.favorite_exercises (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  exercise_id uuid REFERENCES public.exercise_library(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, exercise_id)
);

-- Criar tabela de refeições
CREATE TABLE public.meals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  meal_type text,
  calories numeric,
  protein numeric,
  carbs numeric,
  fat numeric,
  ingredients jsonb,
  logged_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Criar tabela de push subscriptions
CREATE TABLE public.push_subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  endpoint text NOT NULL,
  keys jsonb,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, endpoint)
);

-- Criar tabela de métricas avançadas
CREATE TABLE public.advanced_metrics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  body_fat_percentage numeric,
  muscle_mass numeric,
  bone_mass numeric,
  water_percentage numeric,
  visceral_fat integer,
  metabolic_age integer,
  bmr integer,
  measured_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.favorite_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advanced_metrics ENABLE ROW LEVEL SECURITY;

-- Políticas para favorite_exercises
CREATE POLICY "Users can read own favorites" ON public.favorite_exercises FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create favorites" ON public.favorite_exercises FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON public.favorite_exercises FOR DELETE USING (auth.uid() = user_id);

-- Políticas para meals
CREATE POLICY "Users can read own meals" ON public.meals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create meals" ON public.meals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own meals" ON public.meals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own meals" ON public.meals FOR DELETE USING (auth.uid() = user_id);

-- Políticas para push_subscriptions
CREATE POLICY "Users can read own subscriptions" ON public.push_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create subscriptions" ON public.push_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subscriptions" ON public.push_subscriptions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own subscriptions" ON public.push_subscriptions FOR DELETE USING (auth.uid() = user_id);

-- Políticas para advanced_metrics
CREATE POLICY "Users can read own metrics" ON public.advanced_metrics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create metrics" ON public.advanced_metrics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own metrics" ON public.advanced_metrics FOR UPDATE USING (auth.uid() = user_id);