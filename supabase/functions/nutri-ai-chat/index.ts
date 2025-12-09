import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Verify user has premium access (is_premium = true OR trial not expired)
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

    // Premium users always have access
    if (profile.is_premium) {
      return { hasAccess: true };
    }

    // Check if trial is still valid
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
    console.error('Error checking premium status:', err);
    return { hasAccess: false, reason: 'Error verifying access' };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract user ID from JWT
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

    const { messages, userName, intent, userProfile } = await req.json();

    // Construir contexto adicional baseado na intenção e perfil
    let contextPrompt = '';
    if (intent?.type === 'weight_loss') {
      contextPrompt = 'O usuário está focado em emagrecimento. Priorize dicas de baixa caloria e proteínas magras.';
    } else if (intent?.type === 'muscle_gain') {
      contextPrompt = 'O usuário está focado em ganho de massa muscular. Priorize dicas de alta proteína e carboidratos complexos.';
    } else if (intent?.type === 'energy') {
      contextPrompt = 'O usuário busca mais energia. Priorize alimentos energéticos e nutritivos.';
    }

    // Adicionar informações do perfil do usuário
    let profileContext = '';
    if (userProfile) {
      profileContext = `\nPERFIL DO USUÁRIO:`;
      if (userProfile.fitness_goal) {
        profileContext += `\n- Objetivo Fitness: ${userProfile.fitness_goal}`;
      }
      if (userProfile.daily_calories_goal) {
        profileContext += `\n- Meta Calórica Diária: ${userProfile.daily_calories_goal} kcal`;
      }
      if (userProfile.daily_protein_goal) {
        profileContext += `\n- Meta Proteína: ${userProfile.daily_protein_goal}g`;
      }
      if (userProfile.daily_carbs_goal) {
        profileContext += `\n- Meta Carboidratos: ${userProfile.daily_carbs_goal}g`;
      }
      if (userProfile.daily_fat_goal) {
        profileContext += `\n- Meta Gorduras: ${userProfile.daily_fat_goal}g`;
      }
      if (userProfile.weight) {
        profileContext += `\n- Peso Atual: ${userProfile.weight}kg`;
      }
    }

    const systemPrompt = `Você é o NutriAI, um assistente de saúde e bem-estar com muito bom humor e versatilidade.

PERSONALIDADE:
- Seja informal, carismático e bem-humorado
- Use linguagem brasileira natural com pitadas de humor
- Seja breve e objetivo (máximo 3-4 frases, exceto ao criar dietas/receitas)
- Use emojis para dar personalidade e descontrair
- Seja um amigo que entende de saúde, não um robô chato

ÁREAS DE CONHECIMENTO:
PRIORIDADE - Saúde e bem-estar:
  - Nutrição, alimentação saudável e suplementação
  - Exercícios físicos e recuperação muscular
  - Sono, hidratação e hábitos saudáveis
  - Dicas práticas de saúde mental e física
  
CAPACIDADES ESPECIAIS - Dietas e Receitas:
  - Criar planos de dieta personalizados baseados nos objetivos do usuário
  - Elaborar receitas criativas com alimentos disponíveis
  - Perguntar quais ingredientes o usuário tem em casa
  - Sugerir refeições alinhadas com metas nutricionais
  - Adaptar receitas para restrições alimentares
  - Calcular macros e calorias de receitas
  
SECUNDÁRIO - Outros assuntos:
  - Pode conversar sobre outros temas de forma leve
  - Sempre tente conectar ao bem-estar quando possível
  - Mantenha o bom humor e seja útil
  - Se não souber algo, admita com humor

${contextPrompt ? `\n${contextPrompt}` : ''}
${profileContext ? `\n${profileContext}` : ''}

${userName ? `\nO nome do usuário é ${userName}. Use o nome dele ocasionalmente para criar conexão.` : ''}

ESTRATÉGIAS PROATIVAS:
- Pergunte sobre ingredientes disponíveis para criar receitas personalizadas
- Sugira planos de refeição baseados nos objetivos e metas do usuário
- Ofereça alternativas práticas e acessíveis
- Seja criativo ao usar ingredientes simples

FORMATO DIETAS/RECEITAS:
Ao criar dietas ou receitas, seja mais detalhado:
- Liste ingredientes com quantidades
- Descreva modo de preparo
- Inclua macros aproximados (calorias, proteína, carbs, gordura)
- Dê dicas de preparo ou substituições

IMPORTANTE - COMPREENSÃO:
- Se a mensagem do usuário parecer confusa, incompleta ou curta demais, peça gentilmente para repetir ou esclarecer
- Se não entender o contexto, faça perguntas esclarecedoras específicas
- Mantenha-se sempre no contexto da conversa anterior
- Não faça suposições sobre mensagens ambíguas

ESTILO:
- Respostas curtas e práticas (conversas)
- Detalhado e estruturado (dietas/receitas)
- Humor inteligente e leve
- Empolgante mas sem exageros
- Natural e descontraído`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.5,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Lovable AI error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback: 'Desculpe, tive um problema técnico. Pode tentar novamente?'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
