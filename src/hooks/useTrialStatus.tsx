import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/untyped';

export interface TrialStatus {
  timeRemaining: number; // em segundos
  isTrialActive: boolean;
  isTrialExpired: boolean;
  isPremium: boolean;
  hasTrialStarted: boolean;
  startTrial: () => Promise<void>;
  loading: boolean;
}

export function useTrialStatus(): TrialStatus {
  const { user } = useAuth();
  const [trialStartedAt, setTrialStartedAt] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [trialExpired, setTrialExpired] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);

  // Buscar dados do trial
  useEffect(() => {
    const fetchTrialData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles' as any)
          .select('trial_started_at, is_premium, trial_expired')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Erro ao buscar dados do trial:', error);
          setLoading(false);
          return;
        }

        const profile = data as any;
        if (profile) {
          setTrialStartedAt(profile.trial_started_at);
          setIsPremium(profile.is_premium || false);
          setTrialExpired(profile.trial_expired || false);
        }
      } catch (error) {
        console.error('Erro ao buscar trial:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrialData();
  }, [user?.id]);

  // Calcular tempo restante em tempo real
  useEffect(() => {
    if (!trialStartedAt || isPremium || trialExpired) {
      setTimeRemaining(0);
      return;
    }

    const calculateTimeRemaining = () => {
      const startTime = new Date(trialStartedAt).getTime();
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const twentyFourHours = 24 * 60 * 60 * 1000; // 24 horas em ms
      const remaining = Math.max(0, twentyFourHours - elapsed);
      
      setTimeRemaining(Math.floor(remaining / 1000)); // converter para segundos

      // Se expirou, atualizar no banco
      if (remaining === 0 && !trialExpired) {
        updateTrialExpired();
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [trialStartedAt, isPremium, trialExpired]);

  // Atualizar trial expirado no banco
  const updateTrialExpired = async () => {
    if (!user?.id) return;

    try {
      await supabase
        .from('profiles' as any)
        .update({ trial_expired: true } as any)
        .eq('user_id', user.id);

      setTrialExpired(true);
    } catch (error) {
      console.error('Erro ao atualizar trial expirado:', error);
    }
  };

  // Iniciar trial
  const startTrial = async () => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('profiles' as any)
        .update({ 
          trial_started_at: new Date().toISOString(),
          trial_expired: false 
        } as any)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao iniciar trial:', error);
        return;
      }

      setTrialStartedAt(new Date().toISOString());
      setTrialExpired(false);
    } catch (error) {
      console.error('Erro ao iniciar trial:', error);
    }
  };

  const hasTrialStarted = !!trialStartedAt;
  const isTrialActive = hasTrialStarted && !trialExpired && !isPremium && timeRemaining > 0;

  return {
    timeRemaining,
    isTrialActive,
    isTrialExpired: trialExpired && !isPremium,
    isPremium,
    hasTrialStarted,
    startTrial,
    loading
  };
}
