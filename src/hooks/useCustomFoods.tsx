import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface CustomFood {
  id: string;
  user_id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion: string;
  category: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function useCustomFoods() {
  const [foods, setFoods] = useState<CustomFood[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadFoods = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setFoods([]);
        return;
      }

      const { data, error } = await supabase
        .from("custom_foods")
        .select("*")
        .eq("user_id", user.id)
        .order("name");

      if (error) throw error;

      setFoods(data || []);
    } catch (error) {
      console.error("Erro ao carregar alimentos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os alimentos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateFood = async (id: string, updates: Partial<CustomFood>) => {
    try {
      const { error } = await supabase
        .from("custom_foods")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Alimento atualizado com sucesso",
      });

      await loadFoods();
      return true;
    } catch (error) {
      console.error("Erro ao atualizar alimento:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o alimento",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteFood = async (id: string) => {
    try {
      const { error } = await supabase
        .from("custom_foods")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Alimento excluído com sucesso",
      });

      await loadFoods();
      return true;
    } catch (error) {
      console.error("Erro ao excluir alimento:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o alimento",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    loadFoods();
  }, []);

  return {
    foods,
    isLoading,
    loadFoods,
    updateFood,
    deleteFood,
  };
}
