import { useState, useEffect, useRef, useCallback } from 'react';

export type VoiceRecognitionStatus = 'idle' | 'listening' | 'processing' | 'error' | 'unsupported';

interface VoiceRecognitionState {
  status: VoiceRecognitionStatus;
  transcript: string;
  interimTranscript: string;
  confidence: number;
  audioLevel: number;
  error: string | null;
  isSupported: boolean;
}

interface UseVoiceRecognitionOptions {
  language?: string;
  continuous?: boolean;
  silenceTimeout?: number;
  onResult?: (transcript: string, confidence: number) => void;
  onError?: (error: string) => void;
  enabled?: boolean;
}

export const useVoiceRecognition = ({
  language = 'pt-BR',
  continuous = true,
  silenceTimeout = 1200,
  onResult,
  onError,
  enabled = true
}: UseVoiceRecognitionOptions) => {
  const [state, setState] = useState<VoiceRecognitionState>({
    status: 'idle',
    transcript: '',
    interimTranscript: '',
    confidence: 0,
    audioLevel: 0,
    error: null,
    isSupported: typeof window !== 'undefined' && 
                 ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  });

  const recognitionRef = useRef<any>(null);
  const isActiveRef = useRef(false);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Simular nível de áudio (em produção, usar Web Audio API real)
  const startAudioLevelMonitoring = useCallback(() => {
    let level = 0;
    const updateLevel = () => {
      if (state.status === 'listening') {
        // Simulação de nível de áudio variável
        level = 30 + Math.random() * 60;
      } else {
        level = Math.max(0, level - 5);
      }
      
      setState(prev => ({ ...prev, audioLevel: level }));
      animationFrameRef.current = requestAnimationFrame(updateLevel);
    };
    updateLevel();
  }, [state.status]);

  // Limpar timer de silêncio
  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  // Processar resultado final
  const processFinalResult = useCallback((transcript: string, confidence: number) => {
    console.log('✅ Resultado final:', transcript, 'Confiança:', confidence);
    clearSilenceTimer();
    
    setState(prev => ({
      ...prev,
      transcript,
      interimTranscript: '',
      confidence,
      status: 'processing'
    }));

    onResult?.(transcript, confidence);
    
    // Voltar para listening após processar
    setTimeout(() => {
      setState(prev => prev.status === 'processing' ? { ...prev, status: 'listening' } : prev);
    }, 300);
  }, [clearSilenceTimer, onResult]);

  // Iniciar reconhecimento
  const start = useCallback(() => {
    if (!state.isSupported) {
      setState(prev => ({ 
        ...prev, 
        status: 'unsupported',
        error: 'Reconhecimento de voz não suportado neste navegador' 
      }));
      onError?.('Reconhecimento de voz não suportado');
      return;
    }

    if (isActiveRef.current) {
      console.log('⚠️ Reconhecimento já ativo');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = continuous;
      recognition.interimResults = true;
      recognition.lang = language;
      recognition.maxAlternatives = 3;

      recognition.onstart = () => {
        console.log('🎤 Reconhecimento iniciado');
        isActiveRef.current = true;
        retryCountRef.current = 0;
        setState(prev => ({ ...prev, status: 'listening', error: null }));
      };

      recognition.onend = () => {
        console.log('🔇 Reconhecimento encerrado');
        isActiveRef.current = false;
        
        // Auto-reconexão com backoff exponencial
        if (enabled && retryCountRef.current < 5) {
          const delay = Math.min(300 * Math.pow(2, retryCountRef.current), 5000);
          console.log(`🔄 Reconectando em ${delay}ms...`);
          setTimeout(() => {
            if (enabled && !isActiveRef.current) {
              retryCountRef.current++;
              start();
            }
          }, delay);
        } else {
          setState(prev => ({ ...prev, status: 'idle' }));
        }
      };

      recognition.onresult = (event: any) => {
        clearSilenceTimer();
        
        let finalTranscript = '';
        let interimTranscript = '';
        let maxConfidence = 0;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          const confidence = event.results[i][0].confidence || 0.5;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
            maxConfidence = Math.max(maxConfidence, confidence);
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript.trim()) {
          processFinalResult(finalTranscript.trim(), maxConfidence);
        } else if (interimTranscript.trim()) {
          setState(prev => ({ ...prev, interimTranscript: interimTranscript.trim() }));
          
          // Timer de silêncio adaptativo
          silenceTimerRef.current = setTimeout(() => {
            const currentInterim = interimTranscript.trim();
            if (currentInterim) {
              console.log('⏱️ Processando por silêncio:', currentInterim);
              processFinalResult(currentInterim, 0.7);
            }
          }, silenceTimeout);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('❌ Erro reconhecimento:', event.error);
        isActiveRef.current = false;
        
        let errorMessage = 'Erro desconhecido';
        switch (event.error) {
          case 'not-allowed':
            errorMessage = 'Permissão de microfone negada';
            break;
          case 'no-speech':
            errorMessage = 'Nenhuma fala detectada';
            break;
          case 'audio-capture':
            errorMessage = 'Erro ao capturar áudio';
            break;
          case 'network':
            errorMessage = 'Erro de rede';
            break;
        }
        
        setState(prev => ({ ...prev, status: 'error', error: errorMessage }));
        onError?.(errorMessage);
        
        // Retry automático para erros recuperáveis
        if (['no-speech', 'aborted'].includes(event.error) && enabled && retryCountRef.current < 3) {
          setTimeout(() => {
            if (enabled) {
              retryCountRef.current++;
              start();
            }
          }, 1000);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
      
    } catch (error) {
      console.error('❌ Erro ao iniciar reconhecimento:', error);
      setState(prev => ({ 
        ...prev, 
        status: 'error',
        error: 'Erro ao iniciar reconhecimento de voz'
      }));
      onError?.('Erro ao iniciar reconhecimento de voz');
    }
  }, [state.isSupported, enabled, continuous, language, silenceTimeout, clearSilenceTimer, processFinalResult, onError]);

  // Parar reconhecimento
  const stop = useCallback(() => {
    console.log('🛑 Parando reconhecimento');
    clearSilenceTimer();
    
    if (recognitionRef.current && isActiveRef.current) {
      try {
        recognitionRef.current.stop();
        isActiveRef.current = false;
      } catch (error) {
        console.error('Erro ao parar reconhecimento:', error);
      }
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    setState(prev => ({ ...prev, status: 'idle', interimTranscript: '', audioLevel: 0 }));
  }, [clearSilenceTimer]);

  // Reset de erro
  const resetError = useCallback(() => {
    setState(prev => ({ ...prev, status: 'idle', error: null }));
    retryCountRef.current = 0;
  }, []);

  // Iniciar/parar baseado em enabled
  useEffect(() => {
    if (enabled && state.isSupported) {
      const timer = setTimeout(() => {
        start();
        startAudioLevelMonitoring();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      stop();
    }
  }, [enabled, state.isSupported, start, stop, startAudioLevelMonitoring]);

  // Cleanup
  useEffect(() => {
    return () => {
      stop();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stop]);

  return {
    ...state,
    start,
    stop,
    resetError
  };
};
