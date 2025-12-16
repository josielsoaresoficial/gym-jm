-- Adicionar colunas faltantes em custom_foods
ALTER TABLE public.custom_foods 
ADD COLUMN IF NOT EXISTS portion text,
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS notes text,
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Adicionar coluna shared_count em user_achievements
ALTER TABLE public.user_achievements 
ADD COLUMN IF NOT EXISTS shared_count integer DEFAULT 0;

-- Adicionar colunas faltantes em notification_preferences
ALTER TABLE public.notification_preferences 
ADD COLUMN IF NOT EXISTS workout_reminder_enabled boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS workout_reminder_time text DEFAULT '08:00',
ADD COLUMN IF NOT EXISTS workout_reminder_days text[] DEFAULT ARRAY['monday', 'wednesday', 'friday'],
ADD COLUMN IF NOT EXISTS meal_reminder_enabled boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS meal_reminder_times text[] DEFAULT ARRAY['08:00', '12:00', '19:00'],
ADD COLUMN IF NOT EXISTS hydration_reminder_enabled boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS hydration_interval_minutes integer DEFAULT 60,
ADD COLUMN IF NOT EXISTS weigh_in_reminder_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS weigh_in_reminder_day text DEFAULT 'monday',
ADD COLUMN IF NOT EXISTS weigh_in_reminder_time text DEFAULT '08:00',
ADD COLUMN IF NOT EXISTS progress_photo_reminder_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Criar tabela de programas de dieta
CREATE TABLE public.diet_programs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  duration_days integer DEFAULT 21,
  difficulty text,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Criar tabela de inscrições em dietas
CREATE TABLE public.user_diet_enrollments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  diet_program_id uuid REFERENCES public.diet_programs(id) ON DELETE CASCADE NOT NULL,
  current_day integer DEFAULT 1,
  started_at timestamp with time zone DEFAULT now(),
  status text DEFAULT 'active',
  updated_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Criar tabela de planos diários de dieta
CREATE TABLE public.diet_daily_plans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  diet_program_id uuid REFERENCES public.diet_programs(id) ON DELETE CASCADE NOT NULL,
  day_number integer NOT NULL,
  week_number integer NOT NULL,
  is_training_day boolean DEFAULT false,
  total_calories integer,
  total_protein integer,
  total_carbs integer,
  total_fat integer,
  meals jsonb,
  tips text[],
  created_at timestamp with time zone DEFAULT now()
);

-- Criar tabela de logs de hidratação
CREATE TABLE public.hydration_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount_ml integer NOT NULL,
  logged_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Criar tabela de histórico de exercícios
CREATE TABLE public.exercise_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  exercise_id uuid REFERENCES public.exercise_library(id) ON DELETE SET NULL,
  exercise_name text,
  sets integer,
  reps integer,
  weight numeric,
  notes text,
  completed_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Criar tabela de chat de IA
CREATE TABLE public.ai_chat_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  response text,
  message_type text DEFAULT 'user',
  created_at timestamp with time zone DEFAULT now()
);

-- Criar tabela de treinos customizados
CREATE TABLE public.custom_workouts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  exercises jsonb,
  duration_minutes integer,
  difficulty text,
  target_muscles text[],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Criar tabela de receitas de dieta
CREATE TABLE public.diet_recipes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  ingredients jsonb,
  instructions text[],
  prep_time_minutes integer,
  cook_time_minutes integer,
  servings integer,
  calories_per_serving integer,
  protein_per_serving numeric,
  carbs_per_serving numeric,
  fat_per_serving numeric,
  meal_type text,
  diet_tags text[],
  image_url text,
  created_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.diet_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_diet_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_daily_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hydration_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_recipes ENABLE ROW LEVEL SECURITY;

-- Políticas para diet_programs (público para leitura)
CREATE POLICY "Anyone can read diet programs" ON public.diet_programs FOR SELECT USING (true);

-- Políticas para user_diet_enrollments
CREATE POLICY "Users can read own enrollments" ON public.user_diet_enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create enrollments" ON public.user_diet_enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own enrollments" ON public.user_diet_enrollments FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para diet_daily_plans (público para leitura)
CREATE POLICY "Anyone can read daily plans" ON public.diet_daily_plans FOR SELECT USING (true);

-- Políticas para hydration_logs
CREATE POLICY "Users can read own logs" ON public.hydration_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create logs" ON public.hydration_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own logs" ON public.hydration_logs FOR DELETE USING (auth.uid() = user_id);

-- Políticas para exercise_history
CREATE POLICY "Users can read own exercise history" ON public.exercise_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create exercise history" ON public.exercise_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own exercise history" ON public.exercise_history FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own exercise history" ON public.exercise_history FOR DELETE USING (auth.uid() = user_id);

-- Políticas para ai_chat_history
CREATE POLICY "Users can read own chat" ON public.ai_chat_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create chat" ON public.ai_chat_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para custom_workouts
CREATE POLICY "Users can read own custom workouts" ON public.custom_workouts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create custom workouts" ON public.custom_workouts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own custom workouts" ON public.custom_workouts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own custom workouts" ON public.custom_workouts FOR DELETE USING (auth.uid() = user_id);

-- Políticas para diet_recipes (público para leitura)
CREATE POLICY "Anyone can read diet recipes" ON public.diet_recipes FOR SELECT USING (true);