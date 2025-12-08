import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useAdminStats, useDailyActivity } from '@/hooks/useAdminStats';
import { toast } from 'sonner';
import { 
  Shield, 
  Users, 
  Dumbbell, 
  UtensilsCrossed, 
  Database, 
  Activity,
  TrendingUp,
  Calendar,
  ChefHat,
  LayoutGrid,
  ShieldAlert,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useAdminStats();
  const { data: dailyActivity, isLoading: activityLoading } = useDailyActivity();

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      toast.error('Acesso negado - Área restrita a administradores');
      navigate('/workouts');
    }
  }, [adminLoading, isAdmin, navigate]);

  if (adminLoading) {
    return (
      <Layout>
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
              <Skeleton className="w-48 h-6 mx-auto mb-2" />
              <Skeleton className="w-32 h-4 mx-auto" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <Card className="p-12 text-center">
            <ShieldAlert className="w-16 h-16 mx-auto mb-4 text-destructive" />
            <h1 className="text-2xl font-bold mb-2">Acesso Negado</h1>
            <p className="text-muted-foreground">
              Esta área é restrita a administradores.
            </p>
          </Card>
        </div>
      </Layout>
    );
  }

  const statCards = [
    { 
      label: 'Usuários Totais', 
      value: stats?.totalUsers || 0, 
      icon: Users, 
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10'
    },
    { 
      label: 'Ativos (7 dias)', 
      value: stats?.activeUsersLast7Days || 0, 
      icon: Activity, 
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10'
    },
    { 
      label: 'Treinos Realizados', 
      value: stats?.totalWorkouts || 0, 
      icon: Dumbbell, 
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10'
    },
    { 
      label: 'Treinos (7 dias)', 
      value: stats?.workoutsLast7Days || 0, 
      icon: TrendingUp, 
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-500/10'
    },
    { 
      label: 'Refeições Registradas', 
      value: stats?.totalMeals || 0, 
      icon: UtensilsCrossed, 
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-500/10'
    },
    { 
      label: 'Refeições (7 dias)', 
      value: stats?.mealsLast7Days || 0, 
      icon: Calendar, 
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-500/10'
    },
  ];

  const contentCards = [
    { 
      label: 'Exercícios na Biblioteca', 
      value: stats?.totalExercises || 0, 
      icon: Database,
      link: '/exercise-management',
      linkLabel: 'Gerenciar'
    },
    { 
      label: 'Templates de Treino', 
      value: stats?.totalWorkoutTemplates || 0, 
      icon: LayoutGrid,
      link: '/workouts',
      linkLabel: 'Ver Treinos'
    },
    { 
      label: 'Treinos Customizados', 
      value: stats?.totalCustomWorkouts || 0, 
      icon: Dumbbell,
      link: '/custom-workouts',
      linkLabel: 'Ver Custom'
    },
    { 
      label: 'Receitas Salvas', 
      value: stats?.totalRecipes || 0, 
      icon: ChefHat,
      link: '/favorite-recipes',
      linkLabel: 'Ver Receitas'
    },
  ];

  // Format chart data for display
  const chartData = dailyActivity?.slice(-14).map(d => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  })) || [];

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">Painel Administrativo</h1>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-medium">
                    <Shield className="w-3 h-3" />
                    Admin
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Estatísticas de uso e gerenciamento de conteúdo
                </p>
              </div>
            </div>
            <Button 
              onClick={() => refetchStats()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Usage Statistics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Estatísticas de Uso
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {statsLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="p-4">
                  <Skeleton className="w-10 h-10 rounded-lg mb-3" />
                  <Skeleton className="w-16 h-8 mb-1" />
                  <Skeleton className="w-24 h-4" />
                </Card>
              ))
            ) : (
              statCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
                    <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center mb-3`}>
                      <Icon className={`w-5 h-5 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} style={{ color: stat.color.includes('blue') ? '#3b82f6' : stat.color.includes('green') ? '#22c55e' : stat.color.includes('purple') ? '#a855f7' : stat.color.includes('indigo') ? '#6366f1' : stat.color.includes('orange') ? '#f97316' : '#f59e0b' }} />
                    </div>
                    <div className="text-2xl font-bold">{stat.value.toLocaleString('pt-BR')}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* Activity Chart */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Atividade dos Últimos 14 Dias
          </h2>
          {activityLoading ? (
            <Skeleton className="w-full h-64" />
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorWorkouts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorMeals" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="workouts" 
                    name="Treinos"
                    stroke="#8b5cf6" 
                    fillOpacity={1} 
                    fill="url(#colorWorkouts)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="meals" 
                    name="Refeições"
                    stroke="#f97316" 
                    fillOpacity={1} 
                    fill="url(#colorMeals)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Content Management */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            Gerenciamento de Conteúdo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="w-12 h-12 rounded-lg mb-4" />
                  <Skeleton className="w-20 h-8 mb-2" />
                  <Skeleton className="w-32 h-4 mb-4" />
                  <Skeleton className="w-full h-10" />
                </Card>
              ))
            ) : (
              contentCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-3xl font-bold mb-1">{card.value.toLocaleString('pt-BR')}</div>
                    <div className="text-sm text-muted-foreground mb-4">{card.label}</div>
                    <Link to={card.link}>
                      <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                        {card.linkLabel}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-primary" />
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/exercise-management">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                <Database className="w-6 h-6" />
                <span>Gerenciar Exercícios</span>
              </Button>
            </Link>
            <Link to="/workouts">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                <Dumbbell className="w-6 h-6" />
                <span>Ver Treinos</span>
              </Button>
            </Link>
            <Link to="/nutrition">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                <UtensilsCrossed className="w-6 h-6" />
                <span>Nutrição</span>
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
