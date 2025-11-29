import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceTextInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const VoiceTextInput = ({ 
  onSend, 
  disabled = false,
  placeholder = "Digite sua mensagem..."
}: VoiceTextInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim() && !disabled) {
      onSend(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-2 items-center p-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 text-sm"
      />
      <Button
        onClick={handleSend}
        disabled={!inputValue.trim() || disabled}
        size="sm"
        className={cn(
          "bg-green-500 hover:bg-green-600",
          (!inputValue.trim() || disabled) && "opacity-50 cursor-not-allowed"
        )}
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default VoiceTextInput;
