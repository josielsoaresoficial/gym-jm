import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell, Dumbbell, Utensils, Droplets, Brain } from 'lucide-react';
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Button } from '@/components/ui/button';

const NotificationSettingsCard: React.FC = () => {
  const {
    preferences,
    isLoading,
    isSaving,
    toggleWorkoutReminder,
    toggleMealReminder,
    toggleHydrationReminder,
    toggleMotivationReminder,
  } = useNotificationPreferences();

  const {
    isSupported,
    isSubscribed,
    permission,
    loading: pushLoading,
    subscribe,
    unsubscribe,
  } = usePushNotifications();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const formatTime = (time: string) => time?.substring(0, 5) || '00:00';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Lembretes e Notificações
        </CardTitle>
        <CardDescription>
          Configure lembretes para manter sua rotina fitness
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status das notificações push */}
        {isSupported && (
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div>
              <p className="font-medium">Notificações Push</p>
              <p className="text-sm text-muted-foreground">
                {isSubscribed 
                  ? 'Ativadas - você receberá lembretes'
                  : permission === 'denied'
                  ? 'Bloqueadas nas configurações do navegador'
                  : 'Desativadas - ative para receber lembretes'}
              </p>
            </div>
            <Button
              variant={isSubscribed ? 'outline' : 'default'}
              size="sm"
              onClick={isSubscribed ? unsubscribe : subscribe}
              disabled={pushLoading || permission === 'denied'}
            >
              {pushLoading ? 'Aguarde...' : isSubscribed ? 'Desativar' : 'Ativar'}
            </Button>
          </div>
        )}

        {/* Lembretes de Treino */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Dumbbell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <Label htmlFor="workout-reminder" className="font-medium">
                  Lembrete de Treino
                </Label>
                <p className="text-sm text-muted-foreground">
                  {preferences?.workout_reminder_time 
                    ? `Diariamente às ${formatTime(preferences.workout_reminder_time)}`
                    : 'Configure o horário'}
                </p>
              </div>
            </div>
            <Switch
              id="workout-reminder"
              checked={preferences?.workout_reminder_enabled || false}
              onCheckedChange={toggleWorkoutReminder}
              disabled={isSaving || !isSubscribed}
            />
          </div>
          
          {preferences?.workout_reminder_enabled && preferences.workout_reminder_days && (
            <div className="ml-12 flex gap-1 flex-wrap">
              {dayNames.map((day, index) => (
                <span
                  key={day}
                  className={`px-2 py-1 rounded text-xs ${
                    preferences.workout_reminder_days.includes(index)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {day}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Lembretes de Refeição */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Utensils className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <Label htmlFor="meal-reminder" className="font-medium">
                  Lembretes de Refeição
                </Label>
                <p className="text-sm text-muted-foreground">
                  Café, almoço e jantar
                </p>
              </div>
            </div>
            <Switch
              id="meal-reminder"
              checked={preferences?.meal_reminder_enabled || false}
              onCheckedChange={toggleMealReminder}
              disabled={isSaving || !isSubscribed}
            />
          </div>
          
          {preferences?.meal_reminder_enabled && preferences.meal_reminder_times && (
            <div className="ml-12 flex gap-2 flex-wrap">
              {preferences.meal_reminder_times.map((time, index) => (
                <span
                  key={index}
                  className="px-2 py-1 rounded text-xs bg-secondary/20 text-secondary"
                >
                  {formatTime(time)}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Lembretes de Hidratação */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Droplets className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <Label htmlFor="hydration-reminder" className="font-medium">
                Lembrete de Hidratação
              </Label>
              <p className="text-sm text-muted-foreground">
                {preferences?.hydration_reminder_interval 
                  ? `A cada ${preferences.hydration_reminder_interval} minutos`
                  : 'Configure o intervalo'}
              </p>
            </div>
          </div>
          <Switch
            id="hydration-reminder"
            checked={preferences?.hydration_reminder_enabled || false}
            onCheckedChange={toggleHydrationReminder}
            disabled={isSaving || !isSubscribed}
          />
        </div>

        {/* Motivação Diária */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Brain className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <Label htmlFor="motivation-reminder" className="font-medium">
                Motivação Diária
              </Label>
              <p className="text-sm text-muted-foreground">
                {preferences?.motivation_reminder_time 
                  ? `Diariamente às ${formatTime(preferences.motivation_reminder_time)}`
                  : 'Configure o horário'}
              </p>
            </div>
          </div>
          <Switch
            id="motivation-reminder"
            checked={preferences?.motivation_reminder_enabled || false}
            onCheckedChange={toggleMotivationReminder}
            disabled={isSaving || !isSubscribed}
          />
        </div>

        {!isSubscribed && isSupported && (
          <p className="text-xs text-center text-muted-foreground mt-4">
            Ative as notificações push para receber os lembretes
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationSettingsCard;
