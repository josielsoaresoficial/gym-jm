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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth verification
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

    const { fitnessGoal, dailyCalories, dailyProtein, dailyCarbs, dailyFat } = await req.json();

    const GOOGLE_AI_API_KEY = Deno.env.get('GOOGLE_AI_API_KEY');
    if (!GOOGLE_AI_API_KEY) {
      throw new Error('GOOGLE_AI_API_KEY não configurada');
    }

    // Mapear objetivos para contexto nutricional
    const goalMap: Record<string, string> = {
      'weight_loss': 'perda de peso com déficit calórico, rica em proteínas e baixa em carboidratos',
      'muscle_gain': 'ganho de massa muscular com superávit calórico, muito rica em proteínas',
      'maintenance': 'manutenção do peso com macros balanceados',
      'endurance': 'resistência com ênfase em carboidratos complexos',
      'strength': 'força e potência com alta proteína e carboidratos moderados',
    };
    const goalContext = goalMap[fitnessGoal] || 'saudável e balanceada';

    const prompt = `Você é um chef especializado em nutrição esportiva e fitness. Gere EXATAMENTE 3 receitas aleatórias e variadas para um objetivo de ${goalContext}.

IMPORTANTE:
- As receitas devem ser COMPLETAMENTE DIFERENTES entre si (café da manhã, almoço, jantar)
- Varie os tipos de proteína (frango, peixe, carne vermelha, ovos, leguminosas)
- Inclua diferentes estilos culinários (brasileiro, mediterrâneo, asiático, etc)
- Seja criativo e evite receitas genéricas
- Cada receita deve ter valores nutricionais compatíveis com as metas diárias

Metas nutricionais diárias:
- Calorias: ${dailyCalories} kcal
- Proteína: ${dailyProtein}g
- Carboidratos: ${dailyCarbs}g
- Gorduras: ${dailyFat}g

Para cada receita, considere que ela representa uma refeição (cerca de 25-35% das metas diárias).

RETORNE UM JSON VÁLIDO com este formato EXATO:
{
  "recipes": [
    {
      "title": "Nome da receita",
      "description": "Descrição breve",
      "prepTime": "30 min",
      "servings": 2,
      "calories": 500,
      "protein": 30,
      "carbs": 60,
      "fat": 15,
      "ingredients": ["ingrediente 1 com quantidade", "ingrediente 2"],
      "instructions": ["passo 1", "passo 2"],
      "category": "Almoço"
    }
  ]
}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_AI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 16384,
          responseMimeType: "application/json"
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na API Google Gemini:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: 'Limite de requisições da API excedido. Por favor, aguarde 30 segundos e tente novamente.',
            retryAfter: 30
          }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error('Erro ao gerar receitas');
    }

    const data = await response.json();

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('API não retornou candidatos. Possível bloqueio de segurança ou erro na API.');
    }

    const candidate = data.candidates[0];

    if (candidate.finishReason && candidate.finishReason !== 'STOP') {
      throw new Error(`Geração bloqueada: ${candidate.finishReason}`);
    }

    const content = candidate.content?.parts?.[0]?.text;
    if (!content) {
      throw new Error('Nenhuma receita gerada.');
    }

    const recipes = JSON.parse(content).recipes;

    return new Response(
      JSON.stringify({ recipes }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Erro ao gerar receitas' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
