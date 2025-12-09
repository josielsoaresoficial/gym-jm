import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Verify user has premium access
async function checkPremiumAccess(userId: string): Promise<{ hasAccess: boolean; reason?: string }> {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('is_premium, trial_expired, trial_started_at')
      .eq('user_id', userId)
      .single();

    if (error || !profile) {
      return { hasAccess: false, reason: 'Profile not found' };
    }

    if (profile.is_premium) {
      return { hasAccess: true };
    }

    if (profile.trial_started_at && !profile.trial_expired) {
      const trialStart = new Date(profile.trial_started_at);
      const now = new Date();
      const hoursSinceStart = (now.getTime() - trialStart.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceStart <= 24) {
        return { hasAccess: true };
      }
    }

    return { hasAccess: false, reason: 'Premium subscription required' };
  } catch (err) {
    return { hasAccess: false, reason: 'Error verifying access' };
  }
}

// Função para dividir texto em chunks menores para Google TTS
function splitTextIntoChunks(text: string, maxLength: number = 180): string[] {
  const chunks: string[] = [];
  let currentText = text.trim();
  
  while (currentText.length > 0) {
    if (currentText.length <= maxLength) {
      chunks.push(currentText);
      break;
    }
    
    // Encontrar o melhor ponto de quebra (pontuação ou espaço)
    let breakPoint = maxLength;
    
    // Procurar por pontuação primeiro
    for (let i = maxLength; i > maxLength / 2; i--) {
      if (['.', '!', '?', ',', ';', ':'].includes(currentText[i])) {
        breakPoint = i + 1;
        break;
      }
    }
    
    // Se não encontrou pontuação, procurar espaço
    if (breakPoint === maxLength) {
      for (let i = maxLength; i > maxLength / 2; i--) {
        if (currentText[i] === ' ') {
          breakPoint = i;
          break;
        }
      }
    }
    
    chunks.push(currentText.substring(0, breakPoint).trim());
    currentText = currentText.substring(breakPoint).trim();
  }
  
  return chunks;
}

// Função para gerar áudio com Google TTS
async function generateGoogleTTS(text: string): Promise<ArrayBuffer> {
  const chunks = splitTextIntoChunks(text, 180);
  const audioBuffers: ArrayBuffer[] = [];
  
  console.log(`Google TTS: Processando ${chunks.length} chunk(s) de texto`);
  
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    console.log(`Google TTS: Gerando chunk ${i + 1}/${chunks.length}: "${chunk.substring(0, 30)}..."`);
    
    const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=pt-BR&q=${encodeURIComponent(chunk)}`;
    
    const response = await fetch(googleUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'audio/mpeg, audio/*',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
      }
    });

    if (!response.ok) {
      console.error(`Google TTS chunk ${i + 1} falhou:`, response.status);
      throw new Error(`Google TTS falhou com status ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    
    if (audioBuffer.byteLength === 0) {
      throw new Error('Google TTS retornou áudio vazio');
    }
    
    audioBuffers.push(audioBuffer);
    
    // Pequeno delay entre requisições para evitar rate limiting
    if (i < chunks.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  // Se tiver apenas um chunk, retornar diretamente
  if (audioBuffers.length === 1) {
    console.log(`✅ Google TTS: Áudio gerado com sucesso (${audioBuffers[0].byteLength} bytes)`);
    return audioBuffers[0];
  }
  
  // Concatenar todos os buffers de áudio
  const totalLength = audioBuffers.reduce((acc, buf) => acc + buf.byteLength, 0);
  const combined = new Uint8Array(totalLength);
  let offset = 0;
  
  for (const buffer of audioBuffers) {
    combined.set(new Uint8Array(buffer), offset);
    offset += buffer.byteLength;
  }
  
  console.log(`✅ Google TTS: Áudio concatenado com sucesso (${totalLength} bytes, ${chunks.length} chunks)`);
  return combined.buffer;
}

// Converter ArrayBuffer para base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const uint8Array = new Uint8Array(buffer);
  let binaryString = '';
  const chunkSize = 8192;
  
  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    const chunk = uint8Array.subarray(i, i + chunkSize);
    binaryString += String.fromCharCode(...chunk);
  }
  
  return btoa(binaryString);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Auth verification for premium check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check premium access
    const { hasAccess, reason } = await checkPremiumAccess(user.id);
    if (!hasAccess) {
      return new Response(JSON.stringify({ 
        error: 'Premium access required',
        message: reason 
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { text, voiceProvider = 'google' } = await req.json();

    if (!text?.trim()) {
      return new Response(
        JSON.stringify({ error: 'Texto é obrigatório' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Usar Google TTS como padrão
    try {
      const audioData = await generateGoogleTTS(text);
      const base64Audio = arrayBufferToBase64(audioData);

      return new Response(
        JSON.stringify({ audioContent: base64Audio }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } catch (googleError) {
      return new Response(
        JSON.stringify({ 
          error: 'Falha ao gerar voz. Tente novamente.',
          details: googleError instanceof Error ? googleError.message : 'Erro desconhecido'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erro desconhecido' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
