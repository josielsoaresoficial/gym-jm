import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { characters, Character, useCharacter } from '@/hooks/useCharacter';
import CharacterBase from './characters/CharacterBase';
import { Check } from 'lucide-react';

interface CharacterSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CharacterSelector = ({ open, onOpenChange }: CharacterSelectorProps) => {
  const { selectedCharacter, setSelectedCharacter } = useCharacter();

  const handleSelect = (character: Character) => {
    setSelectedCharacter(character);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Escolha seu Nutricionista
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 p-2">
          {characters.map((character) => {
            const isSelected = selectedCharacter.id === character.id;
            
            return (
              <motion.div
                key={character.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(character)}
                className={`
                  relative p-3 rounded-xl cursor-pointer transition-all
                  border-2 ${isSelected ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}
                `}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
                
                <div className="flex justify-center mb-2">
                  <CharacterBase
                    character={character}
                    mood="happy"
                    state="awake"
                    isSpeaking={false}
                    size={80}
                  />
                </div>
                
                <div className="text-center">
                  <p className="font-semibold text-sm">{character.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {character.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CharacterSelector;
