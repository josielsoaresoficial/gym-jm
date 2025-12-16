import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/untyped";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface MuscleLabel {
  name: string;
  muscle: string;
  side: "left" | "right";
  top: string;
  left?: string;
  right?: string;
  fontSize?: number;
  lineWidth?: number;
  pointSide?: "left" | "right";
  lineType?: "straight" | "angled";
  hideLabel?: boolean;
  hideLine?: boolean;
}

interface GlobalSettings {
  labelSize: number;
  lineWidth: number;
}

interface UseMuscleMapSyncProps {
  view: "front" | "back";
  deviceType: "mobile" | "desktop";
  defaultLabels: MuscleLabel[];
}

export function useMuscleMapSync({ view, deviceType, defaultLabels }: UseMuscleMapSyncProps) {
  const { user } = useAuth();
  const [labels, setLabels] = useState<MuscleLabel[]>(defaultLabels);
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>({ labelSize: 14, lineWidth: 40 });
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const localStorageKey = `muscle-labels-${view}-${deviceType}`;
  const globalSettingsKey = `muscle-map-global-settings-${view}-${deviceType}`;

  // Load from Supabase or localStorage
  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Try to load from Supabase first if user is authenticated
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
          .from('muscle_map_settings')
          .select('labels, global_settings')
          .eq('user_id', user.id)
          .eq('view', view)
          .eq('device_type', deviceType)
          .maybeSingle();

        if (!error && data) {
          const loadedLabels = data.labels as MuscleLabel[];
          const loadedGlobal = data.global_settings as GlobalSettings;
          setLabels(loadedLabels);
          setGlobalSettings(loadedGlobal);
          // Also save to localStorage as cache
          localStorage.setItem(localStorageKey, JSON.stringify(loadedLabels));
          localStorage.setItem(globalSettingsKey, JSON.stringify(loadedGlobal));
          setIsLoading(false);
          return;
        }
      }

      // Fallback to localStorage
      const savedLabels = localStorage.getItem(localStorageKey);
      const savedGlobal = localStorage.getItem(globalSettingsKey);

      if (savedLabels) {
        try {
          setLabels(JSON.parse(savedLabels));
        } catch {
          setLabels(defaultLabels);
        }
      } else {
        setLabels(defaultLabels);
      }

      if (savedGlobal) {
        try {
          const parsed = JSON.parse(savedGlobal);
          setGlobalSettings({
            labelSize: parsed.labelSize || 14,
            lineWidth: parsed.lineWidth || 40
          });
        } catch {
          setGlobalSettings({ labelSize: 14, lineWidth: 40 });
        }
      }
    } catch (error) {
      console.error('Error loading muscle map settings:', error);
      setLabels(defaultLabels);
    } finally {
      setIsLoading(false);
    }
  }, [user, view, deviceType, localStorageKey, globalSettingsKey, defaultLabels]);

  // Save to both Supabase and localStorage
  const saveSettings = useCallback(async (newLabels: MuscleLabel[], newGlobalSettings: GlobalSettings) => {
    // Always save to localStorage immediately
    localStorage.setItem(localStorageKey, JSON.stringify(newLabels));
    localStorage.setItem(globalSettingsKey, JSON.stringify(newGlobalSettings));

    // Sync to Supabase if user is authenticated
    if (user) {
      setIsSyncing(true);
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
          .from('muscle_map_settings')
          .upsert(
            {
              user_id: user.id,
              view,
              device_type: deviceType,
              labels: newLabels,
              global_settings: newGlobalSettings
            },
            { onConflict: 'user_id,view,device_type' }
          );

        if (error) {
          console.error('Error syncing to Supabase:', error);
        }
      } catch (error) {
        console.error('Error syncing muscle map settings:', error);
      } finally {
        setIsSyncing(false);
      }
    }
  }, [user, view, deviceType, localStorageKey, globalSettingsKey]);

  // Update labels and trigger save - supports functional updates
  const updateLabels = useCallback((newLabelsOrUpdater: MuscleLabel[] | ((prev: MuscleLabel[]) => MuscleLabel[])) => {
    if (typeof newLabelsOrUpdater === 'function') {
      setLabels(prev => newLabelsOrUpdater(prev));
    } else {
      setLabels(newLabelsOrUpdater);
    }
  }, []);

  // Update global settings and trigger save
  const updateGlobalSettings = useCallback((newSettings: Partial<GlobalSettings>) => {
    setGlobalSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Manual sync to cloud
  const syncToCloud = useCallback(async () => {
    if (!user) {
      toast.error("Faça login para sincronizar com a nuvem");
      return;
    }
    
    await saveSettings(labels, globalSettings);
    toast.success("Configurações sincronizadas com a nuvem!");
  }, [user, labels, globalSettings, saveSettings]);

  // Reset to defaults
  const resetSettings = useCallback(async () => {
    setLabels(defaultLabels);
    setGlobalSettings({ labelSize: 14, lineWidth: 40 });
    
    localStorage.removeItem(localStorageKey);
    localStorage.removeItem(globalSettingsKey);

    if (user) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
          .from('muscle_map_settings')
          .delete()
          .eq('user_id', user.id)
          .eq('view', view)
          .eq('device_type', deviceType);
      } catch (error) {
        console.error('Error deleting from Supabase:', error);
      }
    }
  }, [user, view, deviceType, localStorageKey, globalSettingsKey, defaultLabels]);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Auto-save with debounce when labels or global settings change
  useEffect(() => {
    if (isLoading) return;
    
    const timeoutId = setTimeout(() => {
      saveSettings(labels, globalSettings);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [labels, globalSettings, isLoading, saveSettings]);

  return {
    labels,
    setLabels: updateLabels,
    globalSettings,
    setGlobalSettings: updateGlobalSettings,
    isLoading,
    isSyncing,
    syncToCloud,
    resetSettings,
    isAuthenticated: !!user
  };
}
