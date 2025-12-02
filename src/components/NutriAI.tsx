import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Mic, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CharacterBase from './characters/CharacterBase';
import CharacterSelector from './CharacterSelector';
import CharacterDialogue from './CharacterDialogue';
import { useCharacter, CharacterMood } from '@/hooks/useCharacter';
import { useChat } from '@/hooks/useChat';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { useVoice } from '@/hooks/useVoice';
import { toast } from 'sonner';

const NutriAI = () => {
  const { selectedCharacter, mood, setMood, state, setState } = useCharacter();
  const { messages, sendMessage, startConversation, isProcessing, currentMood } = useChat();
  const { speak, isPlaying } = useVoice();
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [dialogueText, setDialogueText] = useState('');
  const [showDialogue, setShowDialogue] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
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
  }, [currentMood, setMood]);

  // Update state based on activity
  useEffect(() => {
    if (isProcessing) {
      setState('speaking');
    } else if (isListening) {
      setState('listening');
    } else if (isActive) {
      setState('awake');
    } else {
      setState('sleeping');
    }
  }, [isProcessing, isListening, isActive, setState]);

  // Show dialogue when there's a new AI message
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant') {
      setDialogueText(lastMessage.content.substring(0, 150) + (lastMessage.content.length > 150 ? '...' : ''));
      setShowDialogue(true);
      
      // Speak the message if voice is enabled
      if (voiceEnabled && lastMessage.content) {
        speak(lastMessage.content, 'elevenlabs-female');
      }

      // Hide dialogue after 8 seconds
      const timer = setTimeout(() => {
        setShowDialogue(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [messages, voiceEnabled, speak]);

  const handleUserMessage = useCallback(async (text: string) => {
    setMood('thinking');
    await sendMessage(text);
  }, [sendMessage, setMood]);

  const handleCharacterClick = async () => {
    if (!isActive) {
      // Wake up
      setIsActive(true);
      setState('awake');
      setMood('happy');
      
      // Show welcome dialogue
      const welcomeMessages = [
        "Olá! Como posso ajudar você hoje?",
        "Pronto para falarmos sobre nutrição?",
        "Estou aqui para ajudar com sua alimentação!"
      ];
      const randomWelcome = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
      setDialogueText(randomWelcome);
      setShowDialogue(true);

      // Start conversation if not started
      if (messages.length === 0) {
        await startConversation();
      }

      // Auto-hide welcome after 5 seconds
      setTimeout(() => {
        setShowDialogue(false);
      }, 5000);
    } else {
      // Toggle listening when already active
      if (isListening) {
        stopListening();
      } else {
        startListening();
        setMood('neutral');
        setDialogueText('Estou ouvindo... 🎤');
        setShowDialogue(true);
      }
    }
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    toast.info(voiceEnabled ? 'Voz desativada' : 'Voz ativada');
  };

  const handleSleep = () => {
    setIsActive(false);
    setState('sleeping');
    setShowDialogue(false);
    if (isListening) {
      stopListening();
    }
  };

  return (
    <>
      <div className="fixed bottom-20 right-4 z-50">
        <div className="relative">
          {/* Dialogue bubble */}
          <CharacterDialogue
            text={dialogueText}
            mood={mood}
            isVisible={showDialogue}
          />

          {/* Character container */}
          <motion.div
            className="relative cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCharacterClick}
          >
            {/* Background glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full blur-xl"
              style={{ 
                background: `radial-gradient(circle, ${selectedCharacter.primaryColor}40 0%, transparent 70%)` 
              }}
              animate={{
                scale: isActive ? [1, 1.1, 1] : 1,
                opacity: isActive ? [0.5, 0.8, 0.5] : 0.3
              }}
              transition={{ repeat: Infinity, duration: 2 }}
            />

            {/* Character */}
            <CharacterBase
              character={selectedCharacter}
              mood={mood}
              state={state}
              isSpeaking={isPlaying || isProcessing}
              size={140}
            />

            {/* Listening indicator */}
            <AnimatePresence>
              {isListening && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-2"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                  >
                    <Mic className="w-4 h-4 text-white" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Control buttons */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-2"
              >
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleVoice();
                  }}
                >
                  {voiceEnabled ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </Button>
                
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectorOpen(true);
                  }}
                >
                  <Settings className="h-4 w-4" />
                </Button>

                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSleep();
                  }}
                >
                  <span className="text-xs">💤</span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Character selector modal */}
      <CharacterSelector
        open={selectorOpen}
        onOpenChange={setSelectorOpen}
      />
    </>
  );
};

export default NutriAI;
