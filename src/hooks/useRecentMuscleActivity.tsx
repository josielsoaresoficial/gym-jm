import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/untyped";
import { useAuth } from "@/hooks/useAuth";

interface MuscleActivity {
  muscleGroup: string;
  lastTrainedAt: Date;
  workoutCount: number;
  daysSinceTraining: number;
}

export const useRecentMuscleActivity = (daysBack: number = 7) => {
  const { user } = useAuth();
  const [muscleActivity, setMuscleActivity] = useState<Map<string, MuscleActivity>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadMuscleActivity();
    }
  }, [user, daysBack]);

  const loadMuscleActivity = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysBack);

      // Get exercise history with exercise details
      const { data: exerciseHistory } = await supabase
        .from('exercise_history')
        .select(`
          completed_at,
          exercise_id,
          exercise_library!inner(muscle_group)
        `)
        .eq('user_id', user.id)
        .gte('completed_at', cutoffDate.toISOString());

      if (exerciseHistory) {
        const activityMap = new Map<string, MuscleActivity>();
        const now = new Date();

        exerciseHistory.forEach((record: any) => {
          const muscleGroup = record.exercise_library?.muscle_group;
          if (!muscleGroup) return;

          const normalizedMuscle = normalizeMuscleGroup(muscleGroup);
          const completedAt = new Date(record.completed_at);
          const daysSince = Math.floor((now.getTime() - completedAt.getTime()) / (1000 * 60 * 60 * 24));

          const existing = activityMap.get(normalizedMuscle);
          if (!existing || completedAt > existing.lastTrainedAt) {
            activityMap.set(normalizedMuscle, {
              muscleGroup: normalizedMuscle,
              lastTrainedAt: completedAt,
              workoutCount: (existing?.workoutCount || 0) + 1,
              daysSinceTraining: daysSince
            });
          } else {
            activityMap.set(normalizedMuscle, {
              ...existing,
              workoutCount: existing.workoutCount + 1
            });
          }
        });

        setMuscleActivity(activityMap);
      }
    } catch (error) {
      console.error('Error loading muscle activity:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get activity level for a specific muscle (0-3: none, light, medium, intense)
  const getActivityLevel = (muscle: string): number => {
    const normalizedMuscle = normalizeMuscleGroup(muscle);
    const activity = muscleActivity.get(normalizedMuscle);
    
    if (!activity) return 0;
    
    const { daysSinceTraining, workoutCount } = activity;
    
    // Recent training (0-2 days) = intense
    if (daysSinceTraining <= 2) return 3;
    // Recent training (3-4 days) = medium
    if (daysSinceTraining <= 4) return 2;
    // Older training (5-7 days) = light
    if (daysSinceTraining <= 7) return 1;
    
    return 0;
  };

  // Check if muscle was trained recently
  const wasTrainedRecently = (muscle: string): boolean => {
    return getActivityLevel(muscle) > 0;
  };

  // Get days since last training for a muscle
  const getDaysSinceTraining = (muscle: string): number | null => {
    const normalizedMuscle = normalizeMuscleGroup(muscle);
    const activity = muscleActivity.get(normalizedMuscle);
    return activity?.daysSinceTraining ?? null;
  };

  return {
    muscleActivity,
    loading,
    getActivityLevel,
    wasTrainedRecently,
    getDaysSinceTraining,
    refresh: loadMuscleActivity
  };
};

// Normalize muscle group names to match the map labels
function normalizeMuscleGroup(muscleGroup: string): string {
  const mappings: Record<string, string> = {
    // Portuguese names to map muscle identifiers
    'peito': 'chest',
    'peitoral': 'chest',
    'chest': 'chest',
    'costas': 'back',
    'back': 'back',
    'dorsais': 'back',
    'ombros': 'shoulders',
    'shoulders': 'shoulders',
    'deltoids': 'shoulders',
    'biceps': 'biceps',
    'bíceps': 'biceps',
    'triceps': 'triceps',
    'tríceps': 'triceps',
    'pernas': 'legs',
    'legs': 'legs',
    'quadriceps': 'legs',
    'quadríceps': 'legs',
    'abdomen': 'abs',
    'abdômen': 'abs',
    'abs': 'abs',
    'core': 'abs',
    'glúteos': 'glutes',
    'gluteos': 'glutes',
    'glutes': 'glutes',
    'antebraço': 'forearms',
    'antebraco': 'forearms',
    'forearms': 'forearms',
    'cardio': 'cardio',
    'adutores': 'adductors',
    'adductors': 'adductors',
    'panturrilhas': 'calves',
    'calves': 'calves',
    'trapézio': 'traps',
    'trapezio': 'traps',
    'traps': 'traps',
    'lombar': 'lower_back',
    'lower_back': 'lower_back',
    'isquiotibiais': 'hamstrings',
    'hamstrings': 'hamstrings',
    'oblíquos': 'obliques',
    'obliquos': 'obliques',
    'obliques': 'obliques'
  };

  const normalized = muscleGroup.toLowerCase().trim();
  return mappings[normalized] || normalized;
}
