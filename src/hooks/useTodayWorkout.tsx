import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface TodayWorkoutExercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weight?: number;
  completed: boolean;
}

export interface TodayWorkout {
  id: string;
  workoutName: string;
  workoutCategory: string;
  exercises: TodayWorkoutExercise[];
  completedCount: number;
  totalCount: number;
  progressPercentage: number;
  isCompleted: boolean;
}

export function useTodayWorkout() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['today-workout', user?.id],
    queryFn: async (): Promise<TodayWorkout | null> => {
      if (!user?.id) return null;

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      // Buscar o treino mais recente de hoje
      const { data: workoutHistory, error } = await supabase
        .from('workout_history')
        .select(`
          id,
          exercises_completed,
          completed_at,
          workout_id,
          workouts (
            name,
            category,
            exercises_data
          )
        `)
        .eq('user_id', user.id)
        .gte('created_at', todayStart.toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !workoutHistory) return null;

      const workout = workoutHistory.workouts as any;
      const exercisesData = (workout?.exercises_data || []) as any[];
      const exercisesCompleted = (workoutHistory.exercises_completed || []) as any[];

      // Mapear exercícios com status de conclusão
      const exercises: TodayWorkoutExercise[] = exercisesData.map((ex: any, index: number) => {
        const completedEx = exercisesCompleted.find((c: any) => 
          c.exercise_id === ex.id || c.name === ex.name || c.index === index
        );
        
        return {
          id: ex.id || `ex-${index}`,
          name: ex.name || 'Exercício',
          sets: ex.sets || 3,
          reps: ex.reps || '10-12',
          weight: completedEx?.weight,
          completed: !!completedEx?.completed,
        };
      });

      const completedCount = exercises.filter(e => e.completed).length;
      const totalCount = exercises.length;

      return {
        id: workoutHistory.id,
        workoutName: workout?.name || 'Treino Personalizado',
        workoutCategory: workout?.category || 'Geral',
        exercises,
        completedCount,
        totalCount,
        progressPercentage: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
        isCompleted: !!workoutHistory.completed_at,
      };
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 2,
  });
}
