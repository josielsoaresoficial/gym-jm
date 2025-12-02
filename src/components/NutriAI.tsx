import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Mic, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChat } from '@/hooks/useChat';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { useVoice } from '@/hooks/useVoice';
import { toast } from 'sonner';

const NutriAI = () => {
  const { messages, sendMessage, startConversation, isProcessing } = useChat();
  const { speak, isPlaying } = useVoice();
  const [isOpen, setIsOpen] = useState(false);
  const [dialogueText, setDialogueText] = useState('');

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

  const handleUserMessage = useCallback(async (text: string) => {
    await sendMessage(text);
  }, [sendMessage]);

  // Show dialogue when there's a new AI message
  const lastMessage = messages[messages.length - 1];
  if (lastMessage && lastMessage.role === 'assistant' && lastMessage.content !== dialogueText) {
    setDialogueText(lastMessage.content);
    if (lastMessage.content) {
      speak(lastMessage.content, 'elevenlabs-female');
    }
  }

  const handleClick = async () => {
    if (!isOpen) {
      setIsOpen(true);
      if (messages.length === 0) {
        await startConversation();
      }
    } else {
      if (isListening) {
        stopListening();
      } else {
        startListening();
      }
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (isListening) {
      stopListening();
    }
  };

  return (
    <div className="fixed bottom-20 right-4 z-50">
      {/* Dialogue bubble */}
      <AnimatePresence>
        {isOpen && dialogueText && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-16 right-0 w-64 mb-2"
          >
            <div className="bg-card border border-border rounded-2xl p-3 shadow-lg">
              <p className="text-sm text-foreground leading-relaxed line-clamp-4">
                {dialogueText.substring(0, 150)}{dialogueText.length > 150 ? '...' : ''}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main button */}
      <div className="relative">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="icon"
            className={`h-14 w-14 rounded-full shadow-lg transition-colors ${
              isListening 
                ? 'bg-destructive hover:bg-destructive/90' 
                : isOpen 
                  ? 'bg-primary hover:bg-primary/90' 
                  : 'bg-primary hover:bg-primary/90'
            }`}
            onClick={handleClick}
            disabled={isProcessing || isPlaying}
          >
            {isListening ? (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              >
                <Mic className="h-6 w-6 text-primary-foreground" />
              </motion.div>
            ) : (
              <MessageCircle className="h-6 w-6 text-primary-foreground" />
            )}
          </Button>
        </motion.div>

        {/* Close button when open */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute -top-2 -right-2"
            >
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6 rounded-full bg-background"
                onClick={handleClose}
              >
                <X className="h-3 w-3" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Processing indicator */}
        {(isProcessing || isPlaying) && (
          <motion.div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 bg-primary rounded-full"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NutriAI;
