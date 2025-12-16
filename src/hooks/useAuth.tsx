import { useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/untyped";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Update profile with OAuth data after sign in
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(() => {
            updateProfileFromOAuth(session.user);
          }, 0);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const updateProfileFromOAuth = async (user: User) => {
    try {
      // Extrair nome do metadata ou email
      let userName = user.user_metadata?.full_name || user.user_metadata?.name || '';
      
      // Se não houver nome no metadata, usar parte do email
      if (!userName && user.email) {
        userName = user.email.split('@')[0];
      }

      // Usar upsert para evitar race condition e duplicate key errors
      const { error } = await supabase
        .from('profiles' as any)
        .upsert({
          user_id: user.id,
          name: userName || 'Usuário',
          avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
          onboarding_completed: false,
        } as any, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        });

      if (error && import.meta.env.DEV) {
        console.error('Erro ao atualizar perfil:', error);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Erro ao atualizar perfil:', error);
      }
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, session, loading, signOut };
}
