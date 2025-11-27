import { Bell, BellOff, TestTube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePushNotifications } from '@/hooks/usePushNotifications';

export function PushNotificationSettings() {
  const {
    isSupported,
    isSubscribed,
    permission,
    loading,
    subscribe,
    unsubscribe,
    sendTestNotification,
  } = usePushNotifications();

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Notificações Push
          </CardTitle>
          <CardDescription>
            Notificações push não são suportadas neste navegador
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getPermissionBadge = () => {
    switch (permission) {
      case 'granted':
        return <Badge variant="default">Permitidas</Badge>;
      case 'denied':
        return <Badge variant="destructive">Negadas</Badge>;
      default:
        return <Badge variant="secondary">Não solicitadas</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notificações Push
        </CardTitle>
        <CardDescription>
          Receba notificações importantes diretamente no seu dispositivo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Status</p>
            <div className="flex items-center gap-2">
              {getPermissionBadge()}
              {isSubscribed && (
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  Ativas
                </Badge>
              )}
            </div>
          </div>
          
          <Button
            onClick={isSubscribed ? unsubscribe : subscribe}
            disabled={loading}
            variant={isSubscribed ? 'outline' : 'default'}
          >
            {loading ? (
              'Processando...'
            ) : isSubscribed ? (
              <>
                <BellOff className="h-4 w-4 mr-2" />
                Desativar
              </>
            ) : (
              <>
                <Bell className="h-4 w-4 mr-2" />
                Ativar
              </>
            )}
          </Button>
        </div>

        {permission === 'denied' && (
          <div className="pt-4 border-t">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-destructive">
                Permissão negada pelo navegador
              </p>
              <p className="text-xs text-muted-foreground">
                Para ativar as notificações, você precisa permitir nas configurações do seu navegador:
              </p>
              <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Clique no ícone de cadeado (🔒) ou informações (ℹ️) na barra de endereço</li>
                <li>Procure por "Notificações" nas permissões do site</li>
                <li>Altere de "Bloquear" para "Permitir"</li>
                <li>Recarregue a página e clique em "Ativar" novamente</li>
              </ol>
            </div>
          </div>
        )}

        {isSubscribed && (
          <div className="pt-4 border-t">
            <Button
              onClick={sendTestNotification}
              variant="outline"
              className="w-full"
            >
              <TestTube className="h-4 w-4 mr-2" />
              Enviar Notificação de Teste
            </Button>
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-2 pt-2">
          <p>
            💡 <strong>Dica:</strong> As notificações push funcionam mesmo quando o app está fechado
          </p>
          <p>
            🔒 Suas preferências são salvas de forma segura e você pode desativar a qualquer momento
          </p>
        </div>
      </CardContent>
    </Card>
  );
}