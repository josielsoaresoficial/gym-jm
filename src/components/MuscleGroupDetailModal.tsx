import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Target, Info, ChevronDown } from "lucide-react";

interface MuscleGroup {
  id: string;
  name: string;
  icon: string;
  color: string;
  subGroups: string[];
  description: string;
}

interface MuscleGroupDetailModalProps {
  group: MuscleGroup | null;
  onClose: () => void;
  exercises: any[];
}

export function MuscleGroupDetailModal({ group, onClose, exercises }: MuscleGroupDetailModalProps) {
  const navigate = useNavigate();
  const [showAllExercises, setShowAllExercises] = useState(false);
  const [selectedSubdivision, setSelectedSubdivision] = useState<string | null>(null);
  
  if (!group) return null;

  const handleExerciseClick = (exerciseId: string) => {
    navigate(`/exercise/${exerciseId}`);
  };

  // Filtrar exercícios por subdivisão selecionada
  const filteredBySubdivision = selectedSubdivision
    ? exercises.filter(exercise => 
        exercise.muscle_group?.toLowerCase().includes(selectedSubdivision.toLowerCase()) ||
        exercise.description?.toLowerCase().includes(selectedSubdivision.toLowerCase()) ||
        exercise.name?.toLowerCase().includes(selectedSubdivision.toLowerCase())
      )
    : exercises;

  const displayedExercises = showAllExercises ? filteredBySubdivision : filteredBySubdivision.slice(0, 8);
  const hasMoreExercises = filteredBySubdivision.length > 8;

  return (
    <Dialog open={!!group} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${group.color}30` }}
            >
              <img src={group.icon} alt={group.name} className="w-12 h-12 object-contain" />
            </div>
            <div>
              <DialogTitle className="text-2xl">{group.name}</DialogTitle>
              <DialogDescription>{group.description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Subdivisões */}
          {group.subGroups && group.subGroups.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5" />
                  Subdivisões do Músculo
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Clique em uma subdivisão para filtrar exercícios específicos
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant={selectedSubdivision === null ? "default" : "outline"}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => {
                      setSelectedSubdivision(null);
                      setShowAllExercises(false);
                    }}
                  >
                    Todos
                  </Badge>
                  {group.subGroups.map((subGroup, index) => (
                    <Badge 
                      key={index} 
                      variant={selectedSubdivision === subGroup ? "default" : "secondary"}
                      style={selectedSubdivision === subGroup ? { 
                        backgroundColor: group.color,
                        color: 'white'
                      } : { 
                        backgroundColor: `${group.color}20`,
                        color: group.color,
                        borderColor: group.color
                      }}
                      className="border cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => {
                        setSelectedSubdivision(subGroup === selectedSubdivision ? null : subGroup);
                        setShowAllExercises(false);
                      }}
                    >
                      {subGroup}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Exercícios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Dumbbell className="w-5 h-5" />
                Exercícios ({filteredBySubdivision.length})
                {selectedSubdivision && (
                  <span className="text-sm font-normal text-muted-foreground">
                    - {selectedSubdivision}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredBySubdivision.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {displayedExercises.map((exercise, index) => (
                      <div 
                        key={index}
                        onClick={() => handleExerciseClick(exercise.id)}
                        className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                      >
                        {exercise.gif_url && (
                          <img 
                            src={exercise.gif_url} 
                            alt={exercise.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{exercise.name}</p>
                          {exercise.difficulty && (
                            <Badge variant="outline" className="text-xs mt-1">
                              {exercise.difficulty}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {hasMoreExercises && (
                    <Button
                      variant="ghost"
                      className="w-full mt-4 text-sm text-muted-foreground hover:text-foreground"
                      onClick={() => setShowAllExercises(!showAllExercises)}
                    >
                      {showAllExercises ? (
                        <>Mostrar menos</>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-1" />
                          + {filteredBySubdivision.length - 8} exercícios adicionais
                        </>
                      )}
                    </Button>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Info className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum exercício encontrado para esta subdivisão</p>
                  <p className="text-sm mt-1">
                    {selectedSubdivision 
                      ? `Clique em "Todos" para ver todos os exercícios`
                      : 'Use o upload em lote para adicionar exercícios'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dicas */}
          <Card style={{ borderColor: `${group.color}40` }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Info className="w-5 h-5" />
                Dicas de Treino
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Varie os exercícios para trabalhar todos os ângulos do músculo</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Mantenha a forma correta para evitar lesões e maximizar resultados</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Respeite o tempo de descanso entre as séries (60-90 segundos)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Aumente a carga progressivamente para garantir o desenvolvimento muscular</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
