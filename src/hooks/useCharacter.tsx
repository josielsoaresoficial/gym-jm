import { useState, useEffect, createContext, useContext } from 'react';

export type CharacterMood = 'neutral' | 'happy' | 'sad' | 'serious' | 'thinking' | 'excited' | 'angry' | 'crying';
export type CharacterState = 'sleeping' | 'awake' | 'speaking' | 'listening';

export interface Character {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  hairColor: string;
  skinColor: string;
  accessory: 'headphones' | 'chef-hat' | 'glasses' | 'bandana' | 'scarf' | 'antenna';
  outfit: 'lab-coat' | 'chef-uniform' | 'sports' | 'casual' | 'apron' | 'tech';
}

export const characters: Character[] = [
  {
    id: 'dr-nutri',
    name: 'Dr. Nutri',
    description: 'Nutricionista moderno e tecnológico',
    primaryColor: '#0066FF',
    secondaryColor: '#00D4FF',
    accentColor: '#00FF88',
    hairColor: '#1a1a2e',
    skinColor: '#FFE0BD',
    accessory: 'headphones',
    outfit: 'lab-coat'
  },
  {
    id: 'dra-vita',
    name: 'Dra. Vita',
    description: 'Nutricionista carinhosa e acolhedora',
    primaryColor: '#FF69B4',
    secondaryColor: '#FFB6C1',
    accentColor: '#FF1493',
    hairColor: '#8B4513',
    skinColor: '#FFDAB9',
    accessory: 'glasses',
    outfit: 'lab-coat'
  },
  {
    id: 'chef-saudavel',
    name: 'Chef Saudável',
    description: 'Especialista em receitas nutritivas',
    primaryColor: '#228B22',
    secondaryColor: '#90EE90',
    accentColor: '#32CD32',
    hairColor: '#2F4F4F',
    skinColor: '#DEB887',
    accessory: 'chef-hat',
    outfit: 'chef-uniform'
  },
  {
    id: 'atleta-fit',
    name: 'Atleta Fit',
    description: 'Personal trainer e nutricionista esportivo',
    primaryColor: '#FF6B00',
    secondaryColor: '#FFD700',
    accentColor: '#FF4500',
    hairColor: '#2C1810',
    skinColor: '#C68642',
    accessory: 'bandana',
    outfit: 'sports'
  },
  {
    id: 'vovo-receitas',
    name: 'Vovó Receitas',
    description: 'Sabedoria tradicional e caseira',
    primaryColor: '#8B008B',
    secondaryColor: '#DDA0DD',
    accentColor: '#BA55D3',
    hairColor: '#C0C0C0',
    skinColor: '#FAEBD7',
    accessory: 'scarf',
    outfit: 'apron'
  },
  {
    id: 'robo-nutri',
    name: 'Robô Nutri',
    description: 'IA avançada de nutrição',
    primaryColor: '#00CED1',
    secondaryColor: '#40E0D0',
    accentColor: '#00FFFF',
    hairColor: '#4A4A4A',
    skinColor: '#B8D4E3',
    accessory: 'antenna',
    outfit: 'tech'
  }
];

interface CharacterContextType {
  selectedCharacter: Character;
  setSelectedCharacter: (character: Character) => void;
  mood: CharacterMood;
  setMood: (mood: CharacterMood) => void;
  state: CharacterState;
  setState: (state: CharacterState) => void;
}

const CharacterContext = createContext<CharacterContextType | null>(null);

export const CharacterProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedCharacter, setSelectedCharacterState] = useState<Character>(() => {
    const saved = localStorage.getItem('selectedCharacter');
    if (saved) {
      const found = characters.find(c => c.id === saved);
      if (found) return found;
    }
    return characters[0];
  });
  const [mood, setMood] = useState<CharacterMood>('neutral');
  const [state, setState] = useState<CharacterState>('sleeping');

  const setSelectedCharacter = (character: Character) => {
    setSelectedCharacterState(character);
    localStorage.setItem('selectedCharacter', character.id);
  };

  return (
    <CharacterContext.Provider value={{
      selectedCharacter,
      setSelectedCharacter,
      mood,
      setMood,
      state,
      setState
    }}>
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = () => {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacter must be used within CharacterProvider');
  }
  return context;
};
