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

  const voiceRecognition = useVoiceRecognition({
    onResult: (text) => {
      if (text && text.trim().length > 0) {
        handleUserMessage(text);
      }
    },
    onError: (error) => {
      toast.error('Erro no reconhecimento de voz: ' + error);
    }
  });

  const isListening = voiceRecognition.status === 'listening';
  const startListening = voiceRecognition.start;
  const stopListening = voiceRecognition.stop;

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

      if (messages.length === 0) {
        await startConversation();
      }

      setTimeout(() => {
        startListening();
      }, 1000);
    } else {
      handleSleep();
    }
  };

  const handleSleep = () => {
    setIsActive(false);
    setMood('neutral');
    if (isListening) {
      stopListening();
    }
  };

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <div className="relative">
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
