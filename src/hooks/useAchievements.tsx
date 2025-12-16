import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/untyped";
import { useAuth } from "./useAuth";
import { useProfileStats } from "./useProfileStats";
import { toast } from "sonner";

export interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, 'id' | 'unlocked' | 'unlockedAt'>[] = [
  // Workout achievements
  { type: 'workouts_1', title: 'Primeira Jornada', description: 'Complete seu primeiro treino', icon: '🎯', requirement: 1 },
  { type: 'workouts_5', title: 'Dedicado', description: 'Complete 5 treinos', icon: '💪', requirement: 5 },
  { type: 'workouts_10', title: 'Comprometido', description: 'Complete 10 treinos', icon: '🔥', requirement: 10 },
  { type: 'workouts_25', title: 'Atleta', description: 'Complete 25 treinos', icon: '⭐', requirement: 25 },
  { type: 'workouts_50', title: 'Guerreiro', description: 'Complete 50 treinos', icon: '🏆', requirement: 50 },
  { type: 'workouts_100', title: 'Lenda', description: 'Complete 100 treinos', icon: '👑', requirement: 100 },
  
  // Meal tracking achievements
  { type: 'meals_1', title: 'Nutrição Consciente', description: 'Registre sua primeira refeição', icon: '🍽️', requirement: 1 },
  { type: 'meals_10', title: 'Alimentação Saudável', description: 'Registre 10 refeições', icon: '🥗', requirement: 10 },
  { type: 'meals_30', title: 'Nutricionista', description: 'Registre 30 refeições', icon: '🥇', requirement: 30 },
  { type: 'meals_50', title: 'Mestre da Nutrição', description: 'Registre 50 refeições', icon: '🏅', requirement: 50 },
  { type: 'meals_100', title: 'Expert Nutricional', description: 'Registre 100 refeições', icon: '💎', requirement: 100 },
  
  // Active days achievements
  { type: 'active_7', title: 'Semana Completa', description: 'Mantenha 7 dias ativos', icon: '📅', requirement: 7 },
  { type: 'active_14', title: 'Duas Semanas', description: 'Mantenha 14 dias ativos', icon: '🔄', requirement: 14 },
  { type: 'active_30', title: 'Mês Consistente', description: 'Mantenha 30 dias ativos', icon: '📆', requirement: 30 },
  { type: 'active_60', title: 'Hábito Consolidado', description: 'Mantenha 60 dias ativos', icon: '🎖️', requirement: 60 },
  { type: 'active_90', title: 'Rotina de Ferro', description: 'Mantenha 90 dias ativos', icon: '🛡️', requirement: 90 },
];

export const useAchievements = () => {
  const { user } = useAuth();
  const { data: stats } = useProfileStats();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAchievements = async () => {
    if (!user?.id) return;

    try {
      const { data: unlockedData } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);

      const unlockedTypes = new Set(unlockedData?.map(a => a.achievement_type) || []);
      
      const achievementsWithStatus: Achievement[] = ACHIEVEMENT_DEFINITIONS.map(def => {
        const unlocked = unlockedData?.find(u => u.achievement_type === def.type);
        return {
          id: def.type,
          ...def,
          unlocked: unlockedTypes.has(def.type),
          unlockedAt: unlocked?.unlocked_at
        };
      });

      setAchievements(achievementsWithStatus);
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAndUnlockAchievements = async () => {
    if (!user?.id || !stats) return;

    const toUnlock: string[] = [];

    // Check workout achievements
    ACHIEVEMENT_DEFINITIONS
      .filter(a => a.type.startsWith('workouts_'))
      .forEach(achievement => {
        const isUnlocked = achievements.find(a => a.id === achievement.type)?.unlocked;
        if (!isUnlocked && stats.totalWorkouts >= achievement.requirement) {
          toUnlock.push(achievement.type);
        }
      });

    // Check meal achievements
    ACHIEVEMENT_DEFINITIONS
      .filter(a => a.type.startsWith('meals_'))
      .forEach(achievement => {
        const isUnlocked = achievements.find(a => a.id === achievement.type)?.unlocked;
        if (!isUnlocked && stats.totalMeals >= achievement.requirement) {
          toUnlock.push(achievement.type);
        }
      });

    // Check active days achievements
    ACHIEVEMENT_DEFINITIONS
      .filter(a => a.type.startsWith('active_'))
      .forEach(achievement => {
        const isUnlocked = achievements.find(a => a.id === achievement.type)?.unlocked;
        if (!isUnlocked && stats.activeDays >= achievement.requirement) {
          toUnlock.push(achievement.type);
        }
      });

    // Unlock achievements
    for (const type of toUnlock) {
      try {
        await supabase.from('user_achievements').insert({
          user_id: user.id,
          achievement_type: type
        });

        const achievement = ACHIEVEMENT_DEFINITIONS.find(a => a.type === type);
        if (achievement) {
          toast.success('🎉 Nova Conquista!', {
            description: `${achievement.icon} ${achievement.title}`
          });
        }
      } catch (error) {
        console.error('Error unlocking achievement:', error);
      }
    }

    if (toUnlock.length > 0) {
      loadAchievements();
    }
  };

  const shareAchievement = async (achievement: Achievement) => {
    const text = `🏆 Acabei de desbloquear a conquista "${achievement.title}" no meu app de fitness! ${achievement.icon}\n\n${achievement.description}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Nova Conquista!',
          text: text
        });

        // Increment share count
        const { data: currentData } = await supabase
          .from('user_achievements')
          .select('shared_count')
          .eq('user_id', user?.id)
          .eq('achievement_type', achievement.type)
          .single();

        if (currentData) {
          await supabase
            .from('user_achievements')
            .update({ shared_count: (currentData.shared_count || 0) + 1 })
            .eq('user_id', user?.id)
            .eq('achievement_type', achievement.type);
        }

      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(text);
      toast.success('Texto copiado!', {
        description: 'Cole em suas redes sociais'
      });
    }
  };

  useEffect(() => {
    loadAchievements();
  }, [user]);

  useEffect(() => {
    if (achievements.length > 0 && stats) {
      checkAndUnlockAchievements();
    }
  }, [stats, achievements.length]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const progress = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  return {
    achievements,
    loading,
    unlockedCount,
    totalCount,
    progress,
    shareAchievement,
    refreshAchievements: loadAchievements
  };
};
