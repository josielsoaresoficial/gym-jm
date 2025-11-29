import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles, Zap, Target, TrendingUp, Clock, Heart, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface WelcomePremiumDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WelcomePremiumDialog({ open, onOpenChange }: WelcomePremiumDialogProps) {
  const benefits = [
    {
      icon: Zap,
      title: "Acesso ilimitado",
      description: "Use todos os recursos sem restrições de tempo"
    },
    {
      icon: Target,
      title: "Treinos personalizados",
      description: "IA cria treinos adaptados aos seus objetivos"
    },
    {
      icon: TrendingUp,
      title: "Análise avançada",
      description: "Relatórios detalhados do seu progresso"
    },
    {
      icon: Clock,
      title: "Histórico completo",
      description: "Acesse todo seu histórico de treinos e refeições"
    },
    {
      icon: Heart,
      title: "Suporte prioritário",
      description: "Atendimento preferencial da equipe"
    },
    {
      icon: Sparkles,
      title: "Novos recursos",
      description: "Acesso antecipado a funcionalidades exclusivas"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="p-6"
        >
          <DialogHeader className="text-center space-y-4 mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-20 h-20 rounded-full bg-gradient-fitness flex items-center justify-center"
            >
              <Crown className="w-10 h-10 text-white" />
            </motion.div>
            
            <DialogTitle className="text-3xl font-bold bg-gradient-fitness bg-clip-text text-transparent">
              Bem-vindo ao Premium! 🎉
            </DialogTitle>
            
            <p className="text-muted-foreground text-sm">
              Você desbloqueou todos os benefícios exclusivos para transformar sua jornada fitness
            </p>
          </DialogHeader>

          <div className="space-y-3 mb-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <benefit.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm">{benefit.title}</h4>
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button 
              variant="fitness" 
              className="w-full font-semibold"
              onClick={() => onOpenChange(false)}
            >
              Começar minha jornada Premium
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-xs text-muted-foreground mt-4"
          >
            Aproveite todos os recursos e alcance seus objetivos mais rápido! 💪
          </motion.p>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
