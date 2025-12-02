import { motion } from 'framer-motion';
import { useSnoringSound } from '@/hooks/useSnoringSound';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { AvatarChibi, AvatarMood } from './AvatarChibi';

interface RobotButtonProps {
  onClick: () => void;
  isActive: boolean;
  isListening?: boolean;
  isSpeaking?: boolean;
  isProcessing?: boolean;
  mood?: 'neutral' | 'happy' | 'thinking' | 'excited' | 'grateful';
}

const RobotButton = ({ onClick, isActive, isListening, isSpeaking, isProcessing, mood = 'neutral' }: RobotButtonProps) => {
  // Som de ronco quando inativo
  useSnoringSound(!isActive);

  // Map mood to AvatarMood type
  const getAvatarMood = (): AvatarMood => {
    if (!isActive) return 'sleeping';
    if (isProcessing) return 'thinking';
    if (isSpeaking) return 'happy';
    if (isListening) return 'neutral';
    
    switch (mood) {
      case 'happy':
        return 'happy';
      case 'thinking':
        return 'thinking';
      case 'excited':
        return 'excited';
      case 'grateful':
        return 'happy';
      default:
        return 'neutral';
    }
  };

  // Get status text
  const getStatusText = () => {
    if (!isActive) return 'Dormindo... (Clique para acordar)';
    if (isProcessing) return 'Pensando...';
    if (isSpeaking) return 'Falando...';
    if (isListening) return 'Ouvindo você...';
    return 'Pronto para ajudar!';
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          onClick={onClick}
          className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 focus:outline-none group"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
          aria-label={isActive ? "NutriAI Ativo" : "Ativar NutriAI"}
        >
          {/* Container do Avatar */}
          <div className="relative w-28 h-36 md:w-32 md:h-40">
            {/* Dynamic Avatar Chibi Component */}
            <div className="w-full h-full drop-shadow-2xl rounded-2xl overflow-hidden">
              <AvatarChibi 
                isActive={isActive} 
                isSpeaking={isSpeaking}
                isListening={isListening}
                isProcessing={isProcessing}
                mood={getAvatarMood()} 
              />
            </div>
          </div>
        </motion.button>
      </TooltipTrigger>
      <TooltipContent side="left" className="bg-background/95 backdrop-blur-sm">
        <p className="text-sm font-medium">{getStatusText()}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default RobotButton;
