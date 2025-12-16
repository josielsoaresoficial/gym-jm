import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Dumbbell, Clock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/untyped";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { LiquidGlassWrapper } from "@/components/liquid-glass";

interface ExerciseRecommendation {
  exerciseName: string;
  muscleGroup: string;
  sets: number;
  reps: string;
  restTime?: number;
  reason: string;
  difficulty?: string;
}

interface WorkoutPlan {
  recommendations: ExerciseRecommendation[];
  overallAdvice: string;
}

export const WorkoutRecommendations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const { user, session } = useAuth();
  const navigate = useNavigate();

  const generateRecommendations = async () => {
    if (!user || !session) {
      toast.error("Você precisa estar logado para obter recomendações");
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('suggest-workout', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        if (error.message?.includes('Unauthorized')) {
          toast.error("Erro de autenticação. Por favor, faça login novamente.");
          navigate("/login");
          return;
        }
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setWorkoutPlan(data);
      toast.success("Recomendações de treino geradas!");
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast.error(error instanceof Error ? error.message : "Falha ao gerar recomendações");
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'iniciante':
      case 'beginner':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'intermediário':
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'avançado':
      case 'advanced':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  const handleStartExercise = (exercise: ExerciseRecommendation) => {
    const tempWorkout = {
      id: 'ai-recommendation',
      name: `Treino AI: ${exercise.exerciseName}`,
      focus: exercise.muscleGroup,
      duration: '10-15 min',
      exercises: [{
        id: Date.now(),
        name: exercise.exerciseName,
        type: 'principal' as const,
        sets: exercise.sets,
        reps: exercise.reps,
        restTime: exercise.restTime || 60,
        animation: exercise.exerciseName.toLowerCase().replace(/\s+/g, '_'),
        instructions: [
          'Execute o movimento de forma controlada',
          'Mantenha a postura correta durante todo o exercício',
          'Respire adequadamente durante a execução',
          'Ajuste o peso conforme necessário'
        ],
        muscleGroup: exercise.muscleGroup,
        equipment: ['Academia']
      }]
    };
    
    navigate('/workout-session/ai-recommendation/single', {
      state: { workout: tempWorkout }
    });
  };

  return (
    <LiquidGlassWrapper variant="highlight" className="mb-8">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary flex-shrink-0" />
            <h3 className="text-lg sm:text-xl font-semibold text-foreground">
              Recomendações de Treino AI
            </h3>
          </div>
          <Button 
            onClick={generateRecommendations} 
            disabled={isLoading}
            size="sm"
            className="gap-2 w-full sm:w-auto bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/30"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Obter Recomendações
              </>
            )}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Sugestões personalizadas de exercícios baseadas nos seus objetivos e histórico de treinos
        </p>

        {/* Content */}
        {!workoutPlan && !isLoading && (
          <div className="text-center py-8 text-muted-foreground">
            <Dumbbell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Clique em "Obter Recomendações" para receber seu plano de treino personalizado</p>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Analisando seu perfil fitness...</p>
          </div>
        )}

        {workoutPlan && (
          <div className="space-y-6">
            {workoutPlan.overallAdvice && (
              <div className="p-4 rounded-xl bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20">
                <p className="text-sm leading-relaxed">{workoutPlan.overallAdvice}</p>
              </div>
            )}

            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {workoutPlan.recommendations.map((exercise, index) => (
                  <LiquidGlassWrapper 
                    key={index}
                    variant="fitness"
                    hoverable
                    onClick={() => handleStartExercise(exercise)}
                  >
                    <div className="p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base sm:text-lg font-semibold break-words text-foreground">
                            {exercise.exerciseName}
                          </h4>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="outline" className="bg-white/10 border-white/20 text-xs">
                              {exercise.muscleGroup}
                            </Badge>
                            {exercise.difficulty && (
                              <Badge variant="outline" className={`${getDifficultyColor(exercise.difficulty)} text-xs`}>
                                {exercise.difficulty}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-1 text-xs sm:text-sm text-muted-foreground flex-shrink-0">
                          <div className="flex items-center gap-1 bg-white/10 rounded-full px-2 py-0.5">
                            <Dumbbell className="h-3 w-3" />
                            <span>{exercise.sets} sets × {exercise.reps}</span>
                          </div>
                          {exercise.restTime && (
                            <div className="flex items-center gap-1 bg-white/10 rounded-full px-2 py-0.5">
                              <Clock className="h-3 w-3" />
                              <span>{exercise.restTime}s</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground italic mt-3">
                        {exercise.reason}
                      </p>
                    </div>
                  </LiquidGlassWrapper>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </LiquidGlassWrapper>
  );
};
