import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Dumbbell } from "lucide-react";
import { Layout } from "@/components/Layout";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
  difficulty: string | null;
  gif_url: string | null;
  sets: number | null;
  reps: string | null;
  rest_time: number | null;
  description: string | null;
  equipment: any;
}

// Mapeamento de nomes de músculos para títulos e descrições
const muscleTitles: Record<string, { title: string; description: string }> = {
  ombros: {
    title: "Treino de Ombros",
    description: "Exercícios para desenvolvimento completo dos deltoides anterior, medial e posterior."
  },
  gluteos: {
    title: "Treino de Glúteos",
    description: "Exercícios especializados para desenvolvimento e tonificação dos glúteos."
  },
  peito: {
    title: "Treino de Peitoral",
    description: "Exercícios para desenvolvimento do peitoral superior, medial e inferior."
  },
  biceps: {
    title: "Treino de Bíceps",
    description: "Exercícios para desenvolvimento das cabeças curta, longa e braquial."
  },
  triceps: {
    title: "Treino de Tríceps",
    description: "Exercícios para desenvolvimento das três cabeças do tríceps."
  },
  abdomen: {
    title: "Treino de Abdômen",
    description: "Exercícios para fortalecimento do core, reto abdominal e oblíquos."
  },
  pernas: {
    title: "Treino de Pernas",
    description: "Exercícios completos para quadríceps, posterior de coxa e panturrilhas."
  },
  costas: {
    title: "Treino de Costas",
    description: "Exercícios para desenvolvimento de largura e espessura das dorsais."
  },
  adutores: {
    title: "Treino de Adutores",
    description: "Exercícios focados no fortalecimento da parte interna das coxas."
  },
  antebraco: {
    title: "Treino de Antebraço",
    description: "Exercícios para desenvolvimento de força de pegada e antebraços."
  },
  cardio: {
    title: "Cardio Training",
    description: "Exercícios cardiovasculares para condicionamento e queima de gordura."
  }
};

export default function MuscleWorkoutPage() {
  const { muscleName } = useParams<{ muscleName: string }>();
  const navigate = useNavigate();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExercises, setSelectedExercises] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchExercises = async () => {
      if (!muscleName) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('exercise_library')
          .select('*')
          .eq('muscle_group', muscleName)
          .order('name');

        if (error) throw error;

        setExercises(data || []);
      } catch (error) {
        console.error('Error fetching exercises:', error);
        toast.error('Erro ao carregar exercícios');
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [muscleName]);

  const muscleInfo = muscleName ? muscleTitles[muscleName] : null;
  const title = muscleInfo?.title || `Treino de ${muscleName}`;
  const description = muscleInfo?.description || "Exercícios especializados para este grupo muscular.";

  const handleBack = () => {
    navigate('/workouts');
  };

  const toggleExerciseSelection = (exerciseId: string) => {
    setSelectedExercises(prev => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });
  };

  const handleStartWorkout = () => {
    if (selectedExercises.size === 0) {
      toast.error('Selecione pelo menos um exercício para começar');
      return;
    }

    const selectedExerciseData = exercises.filter(ex => selectedExercises.has(ex.id));
    
    const workout = {
      id: `custom-${Date.now()}`,
      name: title,
      description: description,
      category: muscleName || 'custom',
      difficulty: 'intermediate',
      duration_minutes: selectedExercises.size * 5,
      estimated_calories: selectedExercises.size * 50,
      exercises_data: selectedExerciseData.map((ex, index) => ({
        id: ex.id,
        name: ex.name,
        sets: ex.sets || 3,
        reps: ex.reps || '10-12',
        rest_time: ex.rest_time || 60,
        order: index + 1,
        animation: ex.name.toLowerCase().replace(/\s+/g, '_')
      }))
    };

    navigate('/workout-session', { state: { workout } });
  };

  const handleStartSingleExercise = (exercise: Exercise) => {
    const singleExerciseWorkout = {
      id: `single-${exercise.id}`,
      name: exercise.name,
      description: exercise.description || `Treino focado em ${exercise.name}`,
      category: exercise.muscle_group,
      difficulty: exercise.difficulty || 'intermediate',
      duration_minutes: 5,
      estimated_calories: 50,
      exercises_data: [{
        id: exercise.id,
        name: exercise.name,
        sets: exercise.sets || 3,
        reps: exercise.reps || '10-12',
        rest_time: exercise.rest_time || 60,
        order: 1,
        animation: exercise.name.toLowerCase().replace(/\s+/g, '_')
      }]
    };

    navigate('/workout-session', { state: { workout: singleExerciseWorkout } });
  };

  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
      case 'iniciante':
        return 'bg-green-500/20 text-green-700 dark:text-green-300';
      case 'intermediate':
      case 'intermediário':
        return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300';
      case 'advanced':
      case 'avançado':
        return 'bg-red-500/20 text-red-700 dark:text-red-300';
      default:
        return 'bg-gray-500/20 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border/40">
          <div className="container mx-auto px-4 py-6">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="mb-4 hover:bg-primary/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar aos Treinos
            </Button>

            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground">{title}</h1>
              <p className="text-lg text-muted-foreground max-w-3xl">
                {description}
              </p>
              {!loading && (
                <div className="flex items-center gap-2 mt-4">
                  <Badge variant="outline" className="text-base">
                    <Dumbbell className="mr-2 h-4 w-4" />
                    {exercises.length} exercícios disponíveis
                  </Badge>
                  {selectedExercises.size > 0 && (
                    <Badge className="text-base bg-primary">
                      {selectedExercises.size} selecionados
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-4 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : exercises.length === 0 ? (
            <Card className="p-12 text-center">
              <Dumbbell className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Nenhum exercício encontrado</h3>
              <p className="text-muted-foreground">
                Não há exercícios cadastrados para este grupo muscular ainda.
              </p>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exercises.map((exercise) => (
                  <Card
                    key={exercise.id}
                    className={`overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                      selectedExercises.has(exercise.id)
                        ? 'ring-2 ring-primary shadow-lg'
                        : 'hover:ring-1 hover:ring-primary/50'
                    }`}
                    onClick={() => toggleExerciseSelection(exercise.id)}
                  >
                    {/* GIF Preview */}
                    <div className="relative h-48 bg-secondary/30">
                      {exercise.gif_url ? (
                        <img
                          src={exercise.gif_url}
                          alt={exercise.name}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Dumbbell className="h-16 w-16 text-muted-foreground opacity-30" />
                        </div>
                      )}
                      {selectedExercises.has(exercise.id) && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="bg-primary text-primary-foreground rounded-full p-3">
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Exercise Info */}
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{exercise.name}</h3>
                        {exercise.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {exercise.description}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {exercise.difficulty && (
                          <Badge className={getDifficultyColor(exercise.difficulty)}>
                            {exercise.difficulty}
                          </Badge>
                        )}
                        {exercise.sets && exercise.reps && (
                          <Badge variant="outline">
                            {exercise.sets}x{exercise.reps}
                          </Badge>
                        )}
                        {exercise.rest_time && (
                          <Badge variant="outline">
                            {exercise.rest_time}s descanso
                          </Badge>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartSingleExercise(exercise);
                        }}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Treinar Apenas Este
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Floating Action Button */}
              {selectedExercises.size > 0 && (
                <div className="fixed bottom-6 right-6 z-50">
                  <Button
                    size="lg"
                    onClick={handleStartWorkout}
                    className="shadow-2xl hover:shadow-primary/50 transition-all hover:scale-105"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Iniciar Treino ({selectedExercises.size})
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
