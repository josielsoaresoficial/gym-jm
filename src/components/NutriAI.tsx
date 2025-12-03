import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import NutriCharacter, { CharacterMood } from './NutriCharacter';
import { useChat } from '@/hooks/useChat';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { toast } from 'sonner';

const NutriAI = () => {
  const { messages, sendMessage, startConversation, isProcessing, currentMood, isAISpeaking } = useChat();
  const [mood, setMood] = useState<CharacterMood>('neutral');
  const [isActive, setIsActive] = useState(false);

  // Controle via prop enabled - NÃO manual
  const voiceRecognition = useVoiceRecognition({
    enabled: isActive && !isAISpeaking, // Automaticamente controla start/stop
    onResult: (text) => {
      console.log('🎤 NutriAI recebeu texto:', text);
      if (text && text.trim().length > 0) {
        handleUserMessage(text);
      }
    },
    onError: (error) => {
      console.error('❌ Erro voz:', error);
      toast.error('Erro no reconhecimento de voz: ' + error);
    }
  });

  // Debug state
  useEffect(() => {
    console.log('🤖 NutriAI State:', { 
      isActive, 
      isAISpeaking, 
      voiceStatus: voiceRecognition.status,
      shouldListen: isActive && !isAISpeaking
    });
  }, [isActive, isAISpeaking, voiceRecognition.status]);

  // Escutar evento de fala finalizada para garantir reinício do reconhecimento
  useEffect(() => {
    const handleSpeechEnded = () => {
      console.log('🔊 AI terminou de falar, verificando reconhecimento...');
    };
    
    window.addEventListener('speechSynthesisEnded', handleSpeechEnded);
    return () => window.removeEventListener('speechSynthesisEnded', handleSpeechEnded);
  }, []);

  // Reiniciar reconhecimento quando AI termina de falar
  useEffect(() => {
    if (isActive && !isAISpeaking && !isProcessing) {
      console.log('🔄 AI parou de falar, verificando reconhecimento...');
      // Se reconhecimento não está escutando, forçar reinício
      if (voiceRecognition.status !== 'listening') {
        const timer = setTimeout(() => {
          console.log('🔄 Forçando reinício do reconhecimento...');
          voiceRecognition.forceRestart?.();
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [isActive, isAISpeaking, isProcessing, voiceRecognition.status, voiceRecognition.forceRestart]);

  // Map chat mood to character mood
  useEffect(() => {
    if (currentMood) {
      const moodMap: Record<string, CharacterMood> = {
        happy: 'happy',
        excited: 'excited',
        thinking: 'thinking',
        serious: 'serious',
        sad: 'sad',
        grateful: 'happy',
        neutral: 'neutral'
      };
      setMood(moodMap[currentMood] || 'neutral');
    }
  }, [currentMood]);

  const handleUserMessage = useCallback(async (text: string) => {
    setMood('thinking');
    await sendMessage(text);
  }, [sendMessage]);

  const handleCharacterClick = async () => {
    if (!isActive) {
      setIsActive(true);
      setMood('happy');

      // Delay antes da fala inicial para dar tempo ao reconhecimento iniciar
      if (messages.length === 0) {
        setTimeout(async () => {
          await startConversation();
        }, 1500);
      }
    } else {
      handleSleep();
    }
  };

  const handleSleep = () => {
    setIsActive(false);
    setMood('neutral');
  };

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <div className="relative">
        {/* Debug indicator - apenas em desenvolvimento */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute -top-24 left-0 text-xs bg-black/80 text-white p-2 rounded z-50 whitespace-nowrap">
            <div>Active: {isActive ? '✅' : '❌'}</div>
            <div>AISpeaking: {isAISpeaking ? '🔊' : '🔇'}</div>
            <div>Voice: {voiceRecognition.status}</div>
            <div>Enabled: {(isActive && !isAISpeaking) ? '✅' : '❌'}</div>
          </div>
        )}
        
        <motion.div
          className="relative cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCharacterClick}
        >
          <NutriCharacter
            isActive={isActive}
            isSpeaking={isAISpeaking || isProcessing}
            mood={mood}
            size={140}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default NutriAI;
