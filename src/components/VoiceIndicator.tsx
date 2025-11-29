import { VoiceRecognitionStatus } from '@/hooks/useVoiceRecognition';
import { cn } from '@/lib/utils';

interface VoiceIndicatorProps {
  status: VoiceRecognitionStatus;
  audioLevel: number;
  interimTranscript?: string;
  confidence?: number;
}

const VoiceIndicator = ({ status, audioLevel, interimTranscript, confidence }: VoiceIndicatorProps) => {
  // Calcular altura das barras baseado no nível de áudio
  const bar1Height = status === 'listening' ? Math.min(40, 20 + (audioLevel * 0.3)) : 8;
  const bar2Height = status === 'listening' ? Math.min(50, 25 + (audioLevel * 0.4)) : 10;
  const bar3Height = status === 'listening' ? Math.min(40, 20 + (audioLevel * 0.3)) : 8;

  const getStatusConfig = () => {
    switch (status) {
      case 'listening':
        return {
          color: 'bg-green-500',
          text: '🎤 Ouvindo...',
          textColor: 'text-green-600 dark:text-green-400'
        };
      case 'processing':
        return {
          color: 'bg-blue-500',
          text: '💭 Processando...',
          textColor: 'text-blue-600 dark:text-blue-400'
        };
      case 'error':
        return {
          color: 'bg-red-500',
          text: '⚠️ Erro',
          textColor: 'text-red-600 dark:text-red-400'
        };
      case 'unsupported':
        return {
          color: 'bg-gray-400',
          text: '❌ Não suportado',
          textColor: 'text-gray-600 dark:text-gray-400'
        };
      default:
        return {
          color: 'bg-gray-300',
          text: '⏸️ Pausado',
          textColor: 'text-gray-600 dark:text-gray-400'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="flex flex-col items-center gap-2 py-2">
      {/* Barras de áudio animadas */}
      <div className="flex items-end gap-1 h-12">
        <div
          className={cn(
            'w-1.5 rounded-full transition-all duration-150',
            config.color
          )}
          style={{ height: `${bar1Height}px` }}
        />
        <div
          className={cn(
            'w-1.5 rounded-full transition-all duration-100',
            config.color
          )}
          style={{ height: `${bar2Height}px` }}
        />
        <div
          className={cn(
            'w-1.5 rounded-full transition-all duration-150',
            config.color
          )}
          style={{ height: `${bar3Height}px` }}
        />
      </div>

      {/* Status text */}
      <p className={cn('text-xs font-medium', config.textColor)}>
        {config.text}
      </p>

      {/* Transcrição interim (opcional) */}
      {interimTranscript && status === 'listening' && (
        <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg max-w-xs">
          <p className="text-xs text-gray-600 dark:text-gray-400 italic">
            "{interimTranscript}"
          </p>
        </div>
      )}

      {/* Indicador de confiança */}
      {confidence !== undefined && confidence > 0 && confidence < 0.7 && status === 'processing' && (
        <div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
          <span>⚠️</span>
          <span>Baixa confiança ({Math.round(confidence * 100)}%)</span>
        </div>
      )}
    </div>
  );
};

export default VoiceIndicator;
