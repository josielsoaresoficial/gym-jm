import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AdminStats {
  totalUsers: number;
  totalWorkouts: number;
  totalMeals: number;
  totalExercises: number;
  totalWorkoutTemplates: number;
  totalCustomWorkouts: number;
  totalRecipes: number;
  activeUsersLast7Days: number;
  workoutsLast7Days: number;
  mealsLast7Days: number;
}

interface DailyActivity {
  date: string;
  workouts: number;
  meals: number;
}

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async (): Promise<AdminStats> => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const sevenDaysAgoISO = sevenDaysAgo.toISOString();

      // Fetch all stats in parallel
      const [
        usersResult,
        workoutsResult,
        mealsResult,
        exercisesResult,
        workoutTemplatesResult,
        customWorkoutsResult,
        recipesResult,
        recentWorkoutsResult,
        recentMealsResult,
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('workout_history').select('id', { count: 'exact', head: true }),
        supabase.from('meals').select('id', { count: 'exact', head: true }),
        supabase.from('exercise_library').select('id', { count: 'exact', head: true }),
        supabase.from('workouts').select('id', { count: 'exact', head: true }),
        supabase.from('custom_workouts').select('id', { count: 'exact', head: true }),
        supabase.from('favorite_recipes').select('id', { count: 'exact', head: true }),
        supabase.from('workout_history').select('user_id', { count: 'exact' }).gte('completed_at', sevenDaysAgoISO),
        supabase.from('meals').select('user_id', { count: 'exact' }).gte('created_at', sevenDaysAgoISO),
      ]);

      // Get unique active users in last 7 days
      const { data: activeWorkoutUsers } = await supabase
        .from('workout_history')
        .select('user_id')
        .gte('completed_at', sevenDaysAgoISO);

      const { data: activeMealUsers } = await supabase
        .from('meals')
        .select('user_id')
        .gte('created_at', sevenDaysAgoISO);

      const uniqueActiveUsers = new Set([
        ...(activeWorkoutUsers?.map(u => u.user_id) || []),
        ...(activeMealUsers?.map(u => u.user_id) || [])
      ]);

      return {
        totalUsers: usersResult.count || 0,
        totalWorkouts: workoutsResult.count || 0,
        totalMeals: mealsResult.count || 0,
        totalExercises: exercisesResult.count || 0,
        totalWorkoutTemplates: workoutTemplatesResult.count || 0,
        totalCustomWorkouts: customWorkoutsResult.count || 0,
        totalRecipes: recipesResult.count || 0,
        activeUsersLast7Days: uniqueActiveUsers.size,
        workoutsLast7Days: recentWorkoutsResult.count || 0,
        mealsLast7Days: recentMealsResult.count || 0,
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useDailyActivity() {
  return useQuery({
    queryKey: ['admin-daily-activity'],
    queryFn: async (): Promise<DailyActivity[]> => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const thirtyDaysAgoISO = thirtyDaysAgo.toISOString();

      const [workoutsResult, mealsResult] = await Promise.all([
        supabase
          .from('workout_history')
          .select('completed_at')
          .gte('completed_at', thirtyDaysAgoISO)
          .order('completed_at', { ascending: true }),
        supabase
          .from('meals')
          .select('created_at')
          .gte('created_at', thirtyDaysAgoISO)
          .order('created_at', { ascending: true }),
      ]);

      // Group by date
      const activityByDate: Record<string, { workouts: number; meals: number }> = {};

      // Initialize last 30 days
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        activityByDate[dateStr] = { workouts: 0, meals: 0 };
      }

      // Count workouts per day
      workoutsResult.data?.forEach(w => {
        if (w.completed_at) {
          const dateStr = new Date(w.completed_at).toISOString().split('T')[0];
          if (activityByDate[dateStr]) {
            activityByDate[dateStr].workouts++;
          }
        }
      });

      // Count meals per day
      mealsResult.data?.forEach(m => {
        if (m.created_at) {
          const dateStr = new Date(m.created_at).toISOString().split('T')[0];
          if (activityByDate[dateStr]) {
            activityByDate[dateStr].meals++;
          }
        }
      });

      return Object.entries(activityByDate)
        .map(([date, data]) => ({ date, ...data }))
        .sort((a, b) => a.date.localeCompare(b.date));
    },
    staleTime: 1000 * 60 * 5,
  });
}
