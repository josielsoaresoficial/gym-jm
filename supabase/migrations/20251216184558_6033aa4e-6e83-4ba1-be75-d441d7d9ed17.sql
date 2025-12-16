-- Adicionar colunas faltantes em notification_preferences
ALTER TABLE public.notification_preferences 
ADD COLUMN IF NOT EXISTS motivation_reminder_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS motivation_reminder_time text DEFAULT '09:00';