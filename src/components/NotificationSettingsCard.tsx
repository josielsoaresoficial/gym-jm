import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell, Dumbbell, Utensils, Droplets, Brain, ChevronDown, ChevronUp, Clock, Plus, X } from 'lucide-react';
import { useNotificationPreferences, NotificationPreferences } from '@/hooks/useNotificationPreferences';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const NotificationSettingsCard: React.FC = () => {
  const {
    preferences,
    isLoading,
    isSaving,
    updatePreferences,
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

  const [openSection, setOpenSection] = useState<string | null>(null);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const formatTime = (time: string) => time?.substring(0, 5) || '00:00';
  const formatTimeForInput = (time: string) => time?.substring(0, 5) || '08:00';

  const toggleDay = (day: number) => {
    if (!preferences) return;
    const currentDays = preferences.workout_reminder_days || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day].sort();
    updatePreferences({ workout_reminder_days: newDays });
  };

  const updateWorkoutTime = (time: string) => {
    updatePreferences({ workout_reminder_time: time + ':00' });
  };

  const updateMealTime = (index: number, time: string) => {
    if (!preferences?.meal_reminder_times) return;
    const newTimes = [...preferences.meal_reminder_times];
    newTimes[index] = time + ':00';
    updatePreferences({ meal_reminder_times: newTimes });
  };

  const addMealTime = () => {
    if (!preferences?.meal_reminder_times) return;
    const newTimes = [...preferences.meal_reminder_times, '15:00:00'];
    updatePreferences({ meal_reminder_times: newTimes });
  };

  const removeMealTime = (index: number) => {
    if (!preferences?.meal_reminder_times || preferences.meal_reminder_times.length <= 1) return;
    const newTimes = preferences.meal_reminder_times.filter((_, i) => i !== index);
    updatePreferences({ meal_reminder_times: newTimes });
  };

  const updateHydrationInterval = (interval: number) => {
    updatePreferences({ hydration_reminder_interval: interval });
  };

  const updateMotivationTime = (time: string) => {
    updatePreferences({ motivation_reminder_time: time + ':00' });
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Lembretes e Notificações
        </CardTitle>
        <CardDescription>
          Configure lembretes personalizados para manter sua rotina fitness
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
        <Collapsible open={openSection === 'workout'} onOpenChange={() => toggleSection('workout')}>
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Dumbbell className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <Label className="font-medium">Lembrete de Treino</Label>
                  <p className="text-sm text-muted-foreground">
                    {preferences?.workout_reminder_time 
                      ? `Às ${formatTime(preferences.workout_reminder_time)}`
                      : 'Configure o horário'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={preferences?.workout_reminder_enabled || false}
                  onCheckedChange={toggleWorkoutReminder}
                  disabled={isSaving || !isSubscribed}
                />
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" disabled={!preferences?.workout_reminder_enabled}>
                    {openSection === 'workout' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>
            
            <CollapsibleContent className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Horário do lembrete
                </Label>
                <Input
                  type="time"
                  value={formatTimeForInput(preferences?.workout_reminder_time || '08:00')}
                  onChange={(e) => updateWorkoutTime(e.target.value)}
                  className="w-32"
                  disabled={isSaving}
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm">Dias da semana</Label>
                <div className="flex gap-1 flex-wrap">
                  {dayNames.map((day, index) => (
                    <Button
                      key={day}
                      variant={preferences?.workout_reminder_days?.includes(index) ? 'default' : 'outline'}
                      size="sm"
                      className="w-10 h-10 p-0"
                      onClick={() => toggleDay(index)}
                      disabled={isSaving}
                    >
                      {day}
                    </Button>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Lembretes de Refeição */}
        <Collapsible open={openSection === 'meal'} onOpenChange={() => toggleSection('meal')}>
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <Utensils className="h-5 w-5 text-secondary" />
                </div>
                <div className="flex-1">
                  <Label className="font-medium">Lembretes de Refeição</Label>
                  <p className="text-sm text-muted-foreground">
                    {preferences?.meal_reminder_times?.length 
                      ? `${preferences.meal_reminder_times.length} horários configurados`
                      : 'Configure os horários'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={preferences?.meal_reminder_enabled || false}
                  onCheckedChange={toggleMealReminder}
                  disabled={isSaving || !isSubscribed}
                />
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" disabled={!preferences?.meal_reminder_enabled}>
                    {openSection === 'meal' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>
            
            <CollapsibleContent className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Horários das refeições
                </Label>
                <div className="space-y-2">
                  {preferences?.meal_reminder_times?.map((time, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground w-20">
                        {index === 0 ? 'Café' : index === 1 ? 'Almoço' : index === 2 ? 'Jantar' : `Refeição ${index + 1}`}
                      </span>
                      <Input
                        type="time"
                        value={formatTimeForInput(time)}
                        onChange={(e) => updateMealTime(index, e.target.value)}
                        className="w-32"
                        disabled={isSaving}
                      />
                      {(preferences?.meal_reminder_times?.length || 0) > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMealTime(index)}
                          disabled={isSaving}
                        >
                          <X className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addMealTime}
                  disabled={isSaving || (preferences?.meal_reminder_times?.length || 0) >= 6}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar horário
                </Button>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Lembretes de Hidratação */}
        <Collapsible open={openSection === 'hydration'} onOpenChange={() => toggleSection('hydration')}>
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Droplets className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <Label className="font-medium">Lembrete de Hidratação</Label>
                  <p className="text-sm text-muted-foreground">
                    {preferences?.hydration_reminder_interval 
                      ? `A cada ${preferences.hydration_reminder_interval} minutos`
                      : 'Configure o intervalo'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={preferences?.hydration_reminder_enabled || false}
                  onCheckedChange={toggleHydrationReminder}
                  disabled={isSaving || !isSubscribed}
                />
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" disabled={!preferences?.hydration_reminder_enabled}>
                    {openSection === 'hydration' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>
            
            <CollapsibleContent className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">Intervalo entre lembretes</Label>
                <div className="flex gap-2 flex-wrap">
                  {[30, 45, 60, 90, 120].map((interval) => (
                    <Button
                      key={interval}
                      variant={preferences?.hydration_reminder_interval === interval ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateHydrationInterval(interval)}
                      disabled={isSaving}
                    >
                      {interval} min
                    </Button>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Motivação Diária */}
        <Collapsible open={openSection === 'motivation'} onOpenChange={() => toggleSection('motivation')}>
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Brain className="h-5 w-5 text-purple-500" />
                </div>
                <div className="flex-1">
                  <Label className="font-medium">Motivação Diária</Label>
                  <p className="text-sm text-muted-foreground">
                    {preferences?.motivation_reminder_time 
                      ? `Às ${formatTime(preferences.motivation_reminder_time)}`
                      : 'Configure o horário'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={preferences?.motivation_reminder_enabled || false}
                  onCheckedChange={toggleMotivationReminder}
                  disabled={isSaving || !isSubscribed}
                />
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" disabled={!preferences?.motivation_reminder_enabled}>
                    {openSection === 'motivation' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>
            
            <CollapsibleContent className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Horário da motivação
                </Label>
                <Input
                  type="time"
                  value={formatTimeForInput(preferences?.motivation_reminder_time || '06:00')}
                  onChange={(e) => updateMotivationTime(e.target.value)}
                  className="w-32"
                  disabled={isSaving}
                />
                <p className="text-xs text-muted-foreground">
                  Receba uma mensagem motivacional para começar o dia com energia!
                </p>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {!isSubscribed && isSupported && (
          <p className="text-xs text-center text-muted-foreground mt-4 p-3 bg-muted/30 rounded-lg">
            ⚠️ Ative as notificações push para receber os lembretes
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationSettingsCard;
