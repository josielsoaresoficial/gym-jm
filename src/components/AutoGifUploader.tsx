import { useState } from 'react';
import { supabase } from '@/integrations/supabase/untyped';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Upload, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { detectMuscleGroup, extractExerciseName } from '@/lib/muscleGroupDetection';

interface UploadResult {
  filename: string;
  exerciseName: string;
  muscleGroup: string;
  success: boolean;
  error?: string;
}

export default function AutoGifUploader() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<UploadResult[]>([]);
  const [currentFile, setCurrentFile] = useState<string>('');

  const handleFiles = async (files: FileList) => {
    const gifFiles = Array.from(files).filter(file => 
      file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif')
    );

    if (gifFiles.length === 0) {
      toast.error('Nenhum arquivo GIF encontrado');
      return;
    }

    setIsUploading(true);
    setResults([]);
    setProgress(0);

    const uploadResults: UploadResult[] = [];
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < gifFiles.length; i++) {
      const file = gifFiles[i];
      setCurrentFile(file.name);
      setProgress(((i + 1) / gifFiles.length) * 100);

      try {
        // 1. Extrair nome e detectar grupo muscular
        const exerciseName = extractExerciseName(file.name);
        const muscleGroup = detectMuscleGroup(file.name);

        // 2. Upload GIF para storage
        const timestamp = Date.now();
        const filename = `${exerciseName.replace(/\s+/g, '_')}_${timestamp}.gif`;
        
        const { error: uploadError } = await supabase.storage
          .from('exercise-gifs')
          .upload(filename, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // 3. Obter URL pública
        const { data: { publicUrl } } = supabase.storage
          .from('exercise-gifs')
          .getPublicUrl(filename);

        // 4. Criar exercício no banco
        const { error: insertError } = await supabase
          .from('exercise_library')
          .insert({
            name: exerciseName,
            muscle_group: muscleGroup,
            gif_url: publicUrl,
            difficulty: 'intermediate',
            sets: 3,
            reps: '10-12',
            rest_time: 60,
            equipment: [],
            instructions: [],
            tips: []
          });

        if (insertError) throw insertError;

        uploadResults.push({
          filename: file.name,
          exerciseName,
          muscleGroup,
          success: true
        });
        successCount++;

      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        uploadResults.push({
          filename: file.name,
          exerciseName: extractExerciseName(file.name),
          muscleGroup: detectMuscleGroup(file.name),
          success: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
        failCount++;
      }
    }

    setResults(uploadResults);
    setIsUploading(false);
    setCurrentFile('');

    if (successCount > 0) {
      toast.success(`${successCount} exercício${successCount > 1 ? 's' : ''} criado${successCount > 1 ? 's' : ''} com sucesso!`, {
        duration: 5000
      });
    }

    if (failCount > 0) {
      toast.error(`${failCount} arquivo${failCount > 1 ? 's' : ''} falharam`, {
        duration: 5000
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-border'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">
          Upload Automático de GIFs
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Arraste GIFs aqui ou clique para selecionar
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          Cada GIF criará automaticamente um exercício no banco de dados
        </p>
        <input
          type="file"
          multiple
          accept=".gif,image/gif"
          onChange={handleFileInput}
          className="hidden"
          id="gif-upload"
          disabled={isUploading}
        />
        <Button asChild disabled={isUploading}>
          <label htmlFor="gif-upload" className="cursor-pointer">
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Selecionar GIFs
              </>
            )}
          </label>
        </Button>
      </div>

      {isUploading && (
        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Processando GIFs...</span>
              <span className="text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
            {currentFile && (
              <p className="text-xs text-muted-foreground truncate">
                Arquivo atual: {currentFile}
              </p>
            )}
          </div>
        </Card>
      )}

      {results.length > 0 && !isUploading && (
        <Card className="p-4">
          <h4 className="font-semibold mb-3">
            Resultados ({results.filter(r => r.success).length}/{results.length} sucesso)
          </h4>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <div
                key={index}
                className="flex items-start gap-2 text-sm p-2 rounded hover:bg-muted/50"
              >
                {result.success ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{result.exerciseName}</div>
                  <div className="text-xs text-muted-foreground">
                    {result.muscleGroup} • {result.filename}
                  </div>
                  {result.error && (
                    <div className="text-xs text-destructive">{result.error}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
