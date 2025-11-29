import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/untyped';
import { useChat } from '@/hooks/useChat';
import { VoiceProvider } from '@/hooks/useVoice';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import VoiceSettings from './VoiceSettings';
import ConversationHistory from './ConversationHistory';
import { SaveRecipeDialog } from './SaveRecipeDialog';
import VoiceIndicator from './VoiceIndicator';
import VoiceTextInput from './VoiceTextInput';
import { History, BookmarkPlus, Mic, MicOff } from 'lucide-react';

const NutriAI = () => {
  const { user } = useAuth();
  const { 
    messages, 
    sendMessage, 
    startConversation,
    loadConversation,
    isProcessing,
    voiceProvider,
    setVoiceProvider 
  } = useChat('google-male'); // ✅ Iniciar com Google como padrão
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [saveRecipeDialog, setSaveRecipeDialog] = useState(false);
  const [selectedRecipeContent, setSelectedRecipeContent] = useState('');
  const [profileName, setProfileName] = useState<string>('');
  const [useTextInput, setUseTextInput] = useState(false);

  // Hook de reconhecimento de voz melhorado
  const voiceRecognition = useVoiceRecognition({
    language: 'pt-BR',
    continuous: true,
    silenceTimeout: 1200,
    enabled: isActive && !isPaused && !isAISpeaking && !useTextInput,
    onResult: (transcript, confidence) => {
      console.log('🎤 Voz capturada:', transcript, 'Confiança:', confidence);
      sendMessage(transcript, true);
    },
    onError: (error) => {
      console.error('❌ Erro de voz:', error);
      if (error.includes('não suportado') || error.includes('Permissão negada')) {
        setUseTextInput(true);
      }
    }
  });

  // Detectar se uma mensagem contém uma receita
  const isRecipeMessage = (content: string) => {
    const recipeKeywords = [
      'ingredientes',
      'modo de preparo',
      'receita',
      'calorias',
      'proteína',
      'porção',
      'preparo:'
    ];
    const lowerContent = content.toLowerCase();
    const matchCount = recipeKeywords.filter(keyword => lowerContent.includes(keyword)).length;
    return matchCount >= 2; // Se tiver pelo menos 2 keywords, provavelmente é uma receita
  };

  const handleSaveRecipe = (content: string) => {
    setSelectedRecipeContent(content);
    setSaveRecipeDialog(true);
  };

  // ✅ BUSCAR NOME DO PERFIL
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from('profiles' as any)
        .select('name')
        .eq('user_id', user.id)
        .maybeSingle();
      
      const profile = data as any;
      if (profile && profile.name) {
        setProfileName(profile.name);
      }
    };
    
    fetchProfileData();
  }, [user]);

  // Trocar voz manualmente (temporário, não persiste)
  const handleVoiceChange = (newVoice: VoiceProvider) => {
    setVoiceProvider(newVoice);
  };

  // ✅ EXTRAIR PRIMEIRO NOME DO PERFIL
  const getFirstName = (fullName: string) => {
    if (!fullName) return 'Amigo';
    return fullName.split(' ')[0];
  };

  const firstName = getFirstName(profileName);


  // Monitorar quando AI termina de falar
  useEffect(() => {
    const checkSpeaking = () => {
      const isSpeaking = window.speechSynthesis.speaking;
      if (isAISpeaking && !isSpeaking) {
        console.log('✅ AI terminou de falar');
        setIsAISpeaking(false);
      } else if (!isAISpeaking && isSpeaking) {
        console.log('🔊 AI começou a falar');
        setIsAISpeaking(true);
      }
    };
    
    const interval = setInterval(checkSpeaking, 300);
    return () => clearInterval(interval);
  }, [isAISpeaking]);



  // ✅ ATIVAÇÃO DO NUTRIAI
  const activateNutriAI = async () => {
    console.log('🚀 ATIVANDO NutriAI...');
    setIsActive(true);
    
    // Inicia a conversa
    await startConversation();
    console.log('💬 Conversa iniciada, preparando reconhecimento de voz...');
  };

  // Pausar/Retomar conversa
  const togglePause = () => {
    const newPausedState = !isPaused;
    console.log(`${newPausedState ? '⏸️ PAUSANDO' : '▶️ RETOMANDO'} NutriAI`);
    setIsPaused(newPausedState);
  };

  // Desativar NutriAI
  const deactivateNutriAI = () => {
    console.log('❌ Desativando NutriAI');
    setIsActive(false);
    setIsPaused(false);
    setUseTextInput(false);
  };

  // Alternar entre voz e texto
  const toggleInputMode = () => {
    setUseTextInput(!useTextInput);
    if (!useTextInput) {
      voiceRecognition.stop();
    }
  };

  // Enviar mensagem de texto
  const handleTextMessage = (text: string) => {
    sendMessage(text, false);
  };


  return (
    <div className="nutri-ai-container">
      {!isActive && (
        <button 
          onClick={activateNutriAI}
          className="fixed bottom-20 right-4 md:bottom-6 md:right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 rounded-full shadow-lg hover:scale-105 transition-transform z-50"
        >
          <span className="flex items-center gap-1.5 text-sm md:text-base font-semibold">
            🧠 NutriAI
          </span>
        </button>
      )}

      {isActive && (
        <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 w-[90vw] max-w-sm md:w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-green-200 dark:border-green-800 z-50">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 rounded-t-2xl">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base">NutriAI - {firstName}</h3>
                <p className="text-xs opacity-90">
                  {voiceProvider === 'google-male' && '👨 Voz Masculina (Google)'}
                  {voiceProvider === 'google-female' && '👩 Voz Feminina (Google)'}
                  {voiceProvider === 'elevenlabs-male' && '😊 Voz Masculina (ElevenLabs)'}
                  {voiceProvider === 'elevenlabs-female' && '😊 Voz Feminina (ElevenLabs)'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-white hover:text-green-200 text-base bg-green-600 hover:bg-green-700 w-7 h-7 rounded-full flex items-center justify-center"
                  title="Histórico de conversas"
                >
                  <History className="h-4 w-4" />
                </button>
                <VoiceSettings 
                  currentVoice={voiceProvider}
                  onVoiceChange={handleVoiceChange}
                />
                {voiceRecognition.isSupported && (
                  <button 
                    onClick={toggleInputMode}
                    className="text-white hover:text-green-200 text-base bg-green-600 hover:bg-green-700 w-7 h-7 rounded-full flex items-center justify-center"
                    title={useTextInput ? 'Usar voz' : 'Usar texto'}
                  >
                    {useTextInput ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </button>
                )}
                <button 
                  onClick={togglePause}
                  className="text-white hover:text-green-200 text-base bg-green-600 hover:bg-green-700 w-7 h-7 rounded-full flex items-center justify-center"
                  title={isPaused ? 'Retomar conversa' : 'Pausar conversa'}
                >
                  {isPaused ? '▶️' : '⏸️'}
                </button>
                <button 
                  onClick={deactivateNutriAI}
                  className="text-white hover:text-green-200 text-base bg-green-600 hover:bg-green-700 w-7 h-7 rounded-full flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
          
          {showHistory ? (
            <ConversationHistory 
              onSelectConversation={(convId) => {
                loadConversation(convId);
                setShowHistory(false);
              }}
              onClose={() => setShowHistory(false)}
            />
          ) : (
            <div className="h-60 md:h-72 p-3 overflow-y-auto bg-gray-50 dark:bg-gray-950">
              {messages.map((msg, index) => (
                <div key={index} className={`mb-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block max-w-[85%] p-2 rounded-xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-500 text-white rounded-br-none' 
                      : 'bg-green-100 dark:bg-green-900 text-gray-800 dark:text-gray-100 rounded-bl-none border border-green-200 dark:border-green-700'
                  }`}>
                    {msg.content}
                  </div>
                  {msg.role === 'assistant' && isRecipeMessage(msg.content) && (
                    <button
                      onClick={() => handleSaveRecipe(msg.content)}
                      className="ml-2 text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-md flex items-center gap-1 mt-1 inline-flex"
                      title="Salvar esta receita"
                    >
                      <BookmarkPlus className="h-3 w-3" />
                      Salvar
                    </button>
                  )}
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            
              {/* Indicador visual melhorado */}
              {!useTextInput && !isPaused && (
                <VoiceIndicator
                  status={
                    isAISpeaking ? 'idle' :
                    isProcessing ? 'processing' :
                    voiceRecognition.status === 'error' ? 'error' :
                    voiceRecognition.status
                  }
                  audioLevel={voiceRecognition.audioLevel}
                  interimTranscript={voiceRecognition.interimTranscript}
                  confidence={voiceRecognition.confidence}
                />
              )}

              {isPaused && (
                <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                  ⏸️ Conversa pausada
                </div>
              )}

              {isAISpeaking && (
                <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                  🔊 NutriAI falando...
                </div>
              )}
            </div>
          )}

          {/* Input de texto como fallback ou alternativa */}
          {(useTextInput || !voiceRecognition.isSupported) && (
            <VoiceTextInput 
              onSend={handleTextMessage}
              disabled={isProcessing || isPaused}
              placeholder={
                isPaused ? 'Conversa pausada...' :
                !voiceRecognition.isSupported ? 'Voz não suportada - Use texto' :
                'Digite sua mensagem...'
              }
            />
          )}

          {!useTextInput && voiceRecognition.isSupported && (
            <div className="p-3 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl">
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                {isPaused ? '⏸️ Use o botão ▶️ para retomar' : '💡 Fale naturalmente - Sistema otimizado'}
              </p>
            </div>
          )}
        </div>
      )}

      <SaveRecipeDialog 
        open={saveRecipeDialog}
        onOpenChange={setSaveRecipeDialog}
        recipeContent={selectedRecipeContent}
      />
    </div>
  );
};

export default NutriAI;
