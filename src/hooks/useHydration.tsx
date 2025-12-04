import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export function useHydration() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { data: todayHydration = 0, isLoading } = useQuery({
    queryKey: ['hydration', 'today', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      
      const { data, error } = await supabase
        .from('hydration_logs')
        .select('amount_ml')
        .eq('user_id', user.id)
        .gte('logged_at', todayStart.toISOString());

      if (error) throw error;
      
      return data?.reduce((sum, log) => sum + log.amount_ml, 0) || 0;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  });

  const addWater = useMutation({
    mutationFn: async (amountMl: number = 250) => {
      if (!user?.id) throw new Error('Usuário não autenticado');
      
      const { error } = await supabase
        .from('hydration_logs')
        .insert({ user_id: user.id, amount_ml: amountMl });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hydration', 'today', user?.id] });
      toast.success('Água registrada!');
    },
    onError: () => {
      toast.error('Erro ao registrar água');
    },
  });

  // Convert ml to liters for display
  const todayHydrationLiters = (todayHydration / 1000).toFixed(1);

  return {
    todayHydration,
    todayHydrationLiters,
    isLoading,
    addWater: addWater.mutate,
    isAddingWater: addWater.isPending,
  };
}
