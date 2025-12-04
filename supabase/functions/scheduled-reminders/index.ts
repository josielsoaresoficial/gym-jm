import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mensagens motivacionais
const motivationalMessages = [
  "Bom dia! Lembre-se: cada treino te aproxima do seu objetivo! 💪",
  "Hoje é um ótimo dia para superar seus limites! 🔥",
  "Sua dedicação de hoje constrói o corpo de amanhã! 🏋️",
  "Não desista! Você é mais forte do que pensa! 💥",
  "Pequenos progressos diários levam a grandes conquistas! ⭐",
  "Seu corpo pode mais do que sua mente imagina! 🚀",
  "Cada gota de suor vale a pena! Continue! 💧",
  "Você escolheu ser melhor hoje. Parabéns! 🎯",
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const now = new Date();
    const currentHour = now.getUTCHours();
    const currentMinute = now.getUTCMinutes();
    const currentDay = now.getUTCDay(); // 0 = domingo
    const currentTimeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}:00`;

    console.log(`⏰ Verificando lembretes para ${currentTimeStr} (dia ${currentDay})`);

    // Buscar todas as preferências de notificação
    const { data: preferences, error: prefError } = await supabase
      .from('notification_preferences')
      .select('*');

    if (prefError) {
      console.error('Erro ao buscar preferências:', prefError);
      throw prefError;
    }

    if (!preferences || preferences.length === 0) {
      console.log('Nenhuma preferência de notificação encontrada');
      return new Response(
        JSON.stringify({ message: 'Nenhuma preferência encontrada', sent: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const notifications: Array<{ userId: string; title: string; body: string; type: string }> = [];

    for (const pref of preferences) {
      // Verificar lembrete de treino
      if (pref.workout_reminder_enabled && 
          pref.workout_reminder_days?.includes(currentDay) &&
          pref.workout_reminder_time === currentTimeStr) {
        
        // Verificar se já treinou hoje
        const { data: todayWorkout } = await supabase
          .from('workout_history')
          .select('id')
          .eq('user_id', pref.user_id)
          .gte('completed_at', new Date().toISOString().split('T')[0])
          .limit(1);

        if (!todayWorkout || todayWorkout.length === 0) {
          notifications.push({
            userId: pref.user_id,
            title: '🏋️ Hora do Treino!',
            body: 'Não se esqueça do seu treino de hoje. Vamos lá!',
            type: 'workout',
          });
        }
      }

      // Verificar lembrete de refeição
      if (pref.meal_reminder_enabled && pref.meal_reminder_times) {
        const mealTimes = pref.meal_reminder_times as string[];
        const matchingMealIndex = mealTimes.findIndex(t => t === currentTimeStr);
        
        if (matchingMealIndex !== -1) {
          const mealNames = ['Café da Manhã', 'Almoço', 'Jantar'];
          const mealName = mealNames[matchingMealIndex] || 'Refeição';
          
          notifications.push({
            userId: pref.user_id,
            title: `🍽️ Hora do ${mealName}!`,
            body: 'Registre sua refeição para acompanhar seus macros.',
            type: 'meal',
          });
        }
      }

      // Verificar lembrete de motivação
      if (pref.motivation_reminder_enabled && 
          pref.motivation_reminder_time === currentTimeStr) {
        
        const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
        
        notifications.push({
          userId: pref.user_id,
          title: '✨ Motivação do Dia',
          body: randomMessage,
          type: 'motivation',
        });
      }
    }

    console.log(`📨 ${notifications.length} notificações para enviar`);

    // Enviar notificações
    let sent = 0;
    for (const notification of notifications) {
      try {
        // Buscar subscrição push do usuário
        const { data: subscription } = await supabase
          .from('push_subscriptions')
          .select('*')
          .eq('user_id', notification.userId)
          .limit(1)
          .single();

        if (subscription) {
          // Aqui você enviaria a notificação push real
          // Por enquanto, apenas logamos
          console.log(`✅ Notificação preparada para ${notification.userId}: ${notification.title}`);
          sent++;
        }
      } catch (error) {
        console.error(`Erro ao enviar para ${notification.userId}:`, error);
      }
    }

    // Atualizar timestamps de último lembrete
    for (const pref of preferences) {
      const updates: Record<string, Date> = {};
      
      if (notifications.some(n => n.userId === pref.user_id && n.type === 'workout')) {
        updates.last_workout_reminder = now;
      }
      if (notifications.some(n => n.userId === pref.user_id && n.type === 'meal')) {
        updates.last_meal_reminder = now;
      }

      if (Object.keys(updates).length > 0) {
        await supabase
          .from('notification_preferences')
          .update(updates)
          .eq('user_id', pref.user_id);
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Lembretes processados',
        checked: preferences.length,
        sent,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Erro ao processar lembretes:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
