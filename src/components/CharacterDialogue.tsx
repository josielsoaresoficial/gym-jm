import { motion, AnimatePresence } from 'framer-motion';
import { CharacterMood } from '@/hooks/useCharacter';

interface CharacterDialogueProps {
  text: string;
  mood: CharacterMood;
  isVisible: boolean;
}

const moodEmojis: Record<CharacterMood, string> = {
  neutral: '💬',
  happy: '😊',
  sad: '😢',
  serious: '😐',
  thinking: '🤔',
  excited: '🎉',
  angry: '😤',
  crying: '😭'
};

const CharacterDialogue = ({ text, mood, isVisible }: CharacterDialogueProps) => {
  if (!text) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64"
        >
          <div className="relative bg-card border border-border rounded-2xl p-3 shadow-lg">
            {/* Speech bubble tail */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-card border-r border-b border-border rotate-45" />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-start gap-2">
                <span className="text-lg flex-shrink-0">{moodEmojis[mood]}</span>
                <p className="text-sm text-foreground leading-relaxed">
                  {text}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CharacterDialogue;
