import { invoke } from '@tauri-apps/api/core';
import { openUrl } from '@tauri-apps/plugin-opener';
import { devErrorLog, devInfoLog } from '@utils/devLog';
import { Err, Ok, Result } from 'ts-results';

const WS_PORT = 8080;
const DEFAULT_HOST = '127.0.0.1';

/**
 * Hook para manejar la funcionalidad de WebSocket broadcast
 * Proporciona funciones para iniciar el servidor WS y abrir páginas de transmisión
 */
export const useWebSocketBroadcast = () => {
  /**
   * Abre una URL en el navegador del sistema
   * Intenta usar el plugin de Tauri, fallback a window.open
   */
  const openBroadcastUrl = async (
    path: string,
  ): Promise<Result<void, Error>> => {
    try {
      const url = `http://${DEFAULT_HOST}:${WS_PORT}${path}`;

      try {
        await openUrl(url);
        return Ok.EMPTY;
      } catch (pluginError) {
        devErrorLog('Plugin opener failed:', pluginError);

        // Fallback a window.open
        window.open(url, '_blank');
        return Ok.EMPTY;
      }
    } catch (error: unknown) {
      devErrorLog('Failed to open broadcast URL:', error);
      return Err(error instanceof Error ? error : new Error(String(error)));
    }
  };

  /**
   * Abre la página de transmisión especificada
   * El servidor WebSocket ya se inicia automáticamente desde el backend
   */
  const openBroadcastPage = async (
    path: string,
  ): Promise<Result<void, Error>> => {
    return await openBroadcastUrl(path);
  };

  /**
   * Envía la configuración de batalla con información del round actual via WebSocket
   */
  const broadcastBattleConfig = async (
    mode: 'time' | 'rounds',
    rounds: number,
    currentRound: number,
    roundDuration?: number,
  ): Promise<Result<void, Error>> => {
    try {
      await invoke('broadcast_battle_config', {
        mode,
        rounds,
        roundDuration: mode === 'time' ? roundDuration : null,
        currentRound,
      });
      devInfoLog('⚙️ Battle config with round info broadcasted:', {
        mode,
        rounds,
        currentRound,
        roundDuration,
      });
      return Ok.EMPTY;
    } catch (error: unknown) {
      devErrorLog('Error broadcasting battle config:', error);
      return Err(error instanceof Error ? error : new Error(String(error)));
    }
  };

  /**
   * Cambia la vista de transmisión via WebSocket
   */
  const broadcastViewChange = async (
    viewType: string,
    data?: Record<string, unknown>,
  ): Promise<Result<void, Error>> => {
    try {
      await invoke('broadcast_view_change', {
        viewType,
        data: data || null,
      });
      devInfoLog('📺 View change broadcasted:', { viewType, data });
      return Ok.EMPTY;
    } catch (error: unknown) {
      console.error('Error broadcasting view change:', error);
      return Err(error instanceof Error ? error : new Error(String(error)));
    }
  };

  /**
   * Rutas predefinidas para las páginas de transmisión
   */
  const broadcastRoutes = {
    home: '/home/',
    /* hits: '/golpes/',
    timer: '/tiempo/',
    summary: '/resumen/', */
  } as const;

  return {
    openBroadcastUrl,
    openBroadcastPage,
    broadcastBattleConfig,
    broadcastViewChange,
    broadcastRoutes,
    wsPort: WS_PORT,
    wsHost: DEFAULT_HOST,
  };
};

export type WebSocketBroadcastHook = ReturnType<typeof useWebSocketBroadcast>;
