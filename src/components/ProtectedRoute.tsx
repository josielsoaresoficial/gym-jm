import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { PremiumBlocker } from "./PremiumBlocker";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const { isTrialExpired, isPremium, hasTrialStarted, startTrial, loading: trialLoading } = useTrialStatus();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Iniciar trial automaticamente se usuário está logado mas não tem trial
  useEffect(() => {
    const initTrial = async () => {
      if (user && !trialLoading && !hasTrialStarted && !isPremium) {
        await startTrial();
      }
    };
    initTrial();
  }, [user, trialLoading, hasTrialStarted, isPremium, startTrial]);

  // Show loading while checking auth and trial status
  if (authLoading || trialLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return null;
  }

  // Show premium blocker if trial expired and not premium
  if (isTrialExpired && !isPremium) {
    return <PremiumBlocker />;
  }

  // Render protected content
  return <>{children}</>;
}
