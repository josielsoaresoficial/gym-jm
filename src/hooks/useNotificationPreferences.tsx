import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface NotificationPreferences {
  id: string;
  user_id: string;
  workout_reminder_enabled: boolean;
  workout_reminder_time: string;
  workout_reminder_days: number[];
  meal_reminder_enabled: boolean;
  meal_reminder_times: string[];
  hydration_reminder_enabled: boolean;
  hydration_reminder_interval: number;
  weight_reminder_enabled: boolean;
  weight_reminder_day: number;
  weight_reminder_time: string;
  motivation_reminder_enabled: boolean;
  motivation_reminder_time: string;
}

const defaultPreferences: Partial<NotificationPreferences> = {
  workout_reminder_enabled: true,
  workout_reminder_time: '08:00:00',
  workout_reminder_days: [1, 2, 3, 4, 5],
  meal_reminder_enabled: true,
  meal_reminder_times: ['07:00:00', '12:00:00', '19:00:00'],
  hydration_reminder_enabled: false,
  hydration_reminder_interval: 60,
  weight_reminder_enabled: false,
  weight_reminder_day: 1,
  weight_reminder_time: '07:00:00',
  motivation_reminder_enabled: true,
  motivation_reminder_time: '06:00:00',
};

export function useNotificationPreferences() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPreferences();
    }
  }, [user]);

  const fetchPreferences = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setPreferences(data as NotificationPreferences);
      } else {
        // Criar preferências padrão se não existirem
        await createDefaultPreferences();
      }
    } catch (error) {
      console.error('Erro ao buscar preferências:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createDefaultPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .insert({
          user_id: user.id,
          ...defaultPreferences,
        })
        .select()
        .single();

      if (error) throw error;
      setPreferences(data as NotificationPreferences);
    } catch (error) {
      console.error('Erro ao criar preferências padrão:', error);
    }
  };

  const updatePreferences = async (updates: Partial<NotificationPreferences>) => {
    if (!user || !preferences) return false;

    try {
      setIsSaving(true);
      const { data, error } = await supabase
        .from('notification_preferences')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setPreferences(data as NotificationPreferences);
      toast.success('Preferências salvas!');
      return true;
    } catch (error) {
      console.error('Erro ao atualizar preferências:', error);
      toast.error('Erro ao salvar preferências');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const toggleWorkoutReminder = () => {
    if (preferences) {
      updatePreferences({ workout_reminder_enabled: !preferences.workout_reminder_enabled });
    }
  };

  const toggleMealReminder = () => {
    if (preferences) {
      updatePreferences({ meal_reminder_enabled: !preferences.meal_reminder_enabled });
    }
  };

  const toggleHydrationReminder = () => {
    if (preferences) {
      updatePreferences({ hydration_reminder_enabled: !preferences.hydration_reminder_enabled });
    }
  };

  const toggleMotivationReminder = () => {
    if (preferences) {
      updatePreferences({ motivation_reminder_enabled: !preferences.motivation_reminder_enabled });
    }
  };

  return {
    preferences,
    isLoading,
    isSaving,
    updatePreferences,
    toggleWorkoutReminder,
    toggleMealReminder,
    toggleHydrationReminder,
    toggleMotivationReminder,
    refetch: fetchPreferences,
  };
}
