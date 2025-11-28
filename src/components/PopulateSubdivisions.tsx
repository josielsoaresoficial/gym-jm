import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const PopulateSubdivisions = () => {
  const [loading, setLoading] = useState(false);

  const handlePopulate = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('populate-subdivisions', {
        body: {}
      });

      if (error) throw error;

      console.log('Subdivision population result:', data);
      toast.success('Subdivisões populadas com sucesso!');
      
      // Reload the page to show updated exercises
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error populating subdivisions:', error);
      toast.error('Erro ao popular subdivisões');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button 
        onClick={handlePopulate} 
        disabled={loading}
        size="lg"
        className="shadow-lg"
      >
        {loading ? 'Populando...' : 'Popular Subdivisões'}
      </Button>
    </div>
  );
};
