-- Tabela para preferências de notificação do usuário
CREATE TABLE public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  
  -- Lembretes de treino
  workout_reminder_enabled BOOLEAN DEFAULT true,
  workout_reminder_time TIME DEFAULT '08:00:00',
  workout_reminder_days INTEGER[] DEFAULT ARRAY[1,2,3,4,5], -- 0=domingo, 1=segunda...
  
  -- Lembretes de refeição
  meal_reminder_enabled BOOLEAN DEFAULT true,
  meal_reminder_times TIME[] DEFAULT ARRAY['07:00:00'::TIME, '12:00:00'::TIME, '19:00:00'::TIME],
  
  -- Lembretes de hidratação
  hydration_reminder_enabled BOOLEAN DEFAULT false,
  hydration_reminder_interval INTEGER DEFAULT 60, -- minutos
  
  -- Lembretes de pesagem
  weight_reminder_enabled BOOLEAN DEFAULT false,
  weight_reminder_day INTEGER DEFAULT 1, -- dia da semana
  weight_reminder_time TIME DEFAULT '07:00:00',
  
  -- Motivação diária
  motivation_reminder_enabled BOOLEAN DEFAULT true,
  motivation_reminder_time TIME DEFAULT '06:00:00',
  
  -- Controle
  last_workout_reminder TIMESTAMP WITH TIME ZONE,
  last_meal_reminder TIMESTAMP WITH TIME ZONE,
  last_hydration_reminder TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT unique_user_notification_preferences UNIQUE (user_id)
);

-- Habilitar RLS
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view own notification preferences"
  ON public.notification_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notification preferences"
  ON public.notification_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notification preferences"
  ON public.notification_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notification preferences"
  ON public.notification_preferences FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger para updated_at
CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Criar preferências padrão automaticamente quando usuário é criado
CREATE OR REPLACE FUNCTION public.handle_new_user_notifications()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_notifications
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_notifications();