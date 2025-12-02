import { CharacterProvider as CharacterContextProvider } from '@/hooks/useCharacter';

interface Props {
  children: React.ReactNode;
}

const CharacterProvider = ({ children }: Props) => {
  return (
    <CharacterContextProvider>
      {children}
    </CharacterContextProvider>
  );
};

export default CharacterProvider;
