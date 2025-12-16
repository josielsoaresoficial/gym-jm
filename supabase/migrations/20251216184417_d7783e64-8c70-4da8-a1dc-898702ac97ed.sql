-- Criar tabela de exercícios
CREATE TABLE public.exercise_library (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  muscle_group text NOT NULL,
  description text,
  gif_url text,
  video_url text,
  equipment text,
  difficulty text,
  instructions text[],
  created_at timestamp with time zone DEFAULT now()
);

-- Criar tabela de workouts
CREATE TABLE public.workouts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text,
  description text,
  exercises_data jsonb,
  duration_minutes integer,
  difficulty text,
  image_url text,
  is_public boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Criar tabela de alimentos customizados
CREATE TABLE public.custom_foods (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  calories numeric,
  protein numeric,
  carbs numeric,
  fat numeric,
  serving_size text,
  created_at timestamp with time zone DEFAULT now()
);

-- Criar tabela de conquistas do usuário
CREATE TABLE public.user_achievements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_type text NOT NULL,
  unlocked_at timestamp with time zone DEFAULT now(),
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Criar tabela de histórico de treinos
CREATE TABLE public.workout_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  workout_id uuid REFERENCES public.workouts(id) ON DELETE SET NULL,
  workout_name text,
  duration_minutes integer,
  calories_burned integer,
  exercises_completed jsonb,
  completed_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Criar tabela de metas de peso
CREATE TABLE public.weight_goals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  current_weight numeric,
  target_weight numeric,
  target_date date,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Criar tabela de tracking de macros
CREATE TABLE public.macro_tracking (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  calories_consumed numeric DEFAULT 0,
  protein_consumed numeric DEFAULT 0,
  carbs_consumed numeric DEFAULT 0,
  fat_consumed numeric DEFAULT 0,
  meals jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Criar tabela de hidratação
CREATE TABLE public.hydration_tracking (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  water_ml integer DEFAULT 0,
  goal_ml integer DEFAULT 2000,
  created_at timestamp with time zone DEFAULT now()
);

-- Criar tabela de medidas corporais
CREATE TABLE public.body_measurements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  weight numeric,
  height numeric,
  chest numeric,
  waist numeric,
  hips numeric,
  biceps numeric,
  thighs numeric,
  measured_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Criar tabela de fotos corporais
CREATE TABLE public.body_photos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  photo_url text NOT NULL,
  photo_type text,
  notes text,
  taken_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Criar tabela de receitas favoritas
CREATE TABLE public.favorite_recipes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipe_name text NOT NULL,
  recipe_data jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Criar tabela de preferências de notificação
CREATE TABLE public.notification_preferences (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  workout_reminders boolean DEFAULT true,
  meal_reminders boolean DEFAULT true,
  hydration_reminders boolean DEFAULT true,
  achievement_notifications boolean DEFAULT true,
  push_subscription jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.exercise_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.macro_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hydration_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorite_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Políticas para exercise_library (público para leitura)
CREATE POLICY "Anyone can read exercises" ON public.exercise_library FOR SELECT USING (true);

-- Políticas para workouts
CREATE POLICY "Users can read own workouts" ON public.workouts FOR SELECT USING (auth.uid() = user_id OR is_public = true OR user_id IS NULL);
CREATE POLICY "Users can create workouts" ON public.workouts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own workouts" ON public.workouts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own workouts" ON public.workouts FOR DELETE USING (auth.uid() = user_id);

-- Políticas para custom_foods
CREATE POLICY "Users can read own foods" ON public.custom_foods FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create foods" ON public.custom_foods FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own foods" ON public.custom_foods FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own foods" ON public.custom_foods FOR DELETE USING (auth.uid() = user_id);

-- Políticas para user_achievements
CREATE POLICY "Users can read own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para workout_history
CREATE POLICY "Users can read own history" ON public.workout_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create history" ON public.workout_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own history" ON public.workout_history FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own history" ON public.workout_history FOR DELETE USING (auth.uid() = user_id);

-- Políticas para weight_goals
CREATE POLICY "Users can read own goals" ON public.weight_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create goals" ON public.weight_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON public.weight_goals FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para macro_tracking
CREATE POLICY "Users can read own macros" ON public.macro_tracking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create macros" ON public.macro_tracking FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own macros" ON public.macro_tracking FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para hydration_tracking
CREATE POLICY "Users can read own hydration" ON public.hydration_tracking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create hydration" ON public.hydration_tracking FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own hydration" ON public.hydration_tracking FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para body_measurements
CREATE POLICY "Users can read own measurements" ON public.body_measurements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create measurements" ON public.body_measurements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own measurements" ON public.body_measurements FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own measurements" ON public.body_measurements FOR DELETE USING (auth.uid() = user_id);

-- Políticas para body_photos
CREATE POLICY "Users can read own photos" ON public.body_photos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create photos" ON public.body_photos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own photos" ON public.body_photos FOR DELETE USING (auth.uid() = user_id);

-- Políticas para favorite_recipes
CREATE POLICY "Users can read own recipes" ON public.favorite_recipes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create recipes" ON public.favorite_recipes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own recipes" ON public.favorite_recipes FOR DELETE USING (auth.uid() = user_id);

-- Políticas para notification_preferences
CREATE POLICY "Users can read own prefs" ON public.notification_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create prefs" ON public.notification_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own prefs" ON public.notification_preferences FOR UPDATE USING (auth.uid() = user_id);