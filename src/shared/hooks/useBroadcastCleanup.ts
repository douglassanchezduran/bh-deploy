import { useEffect } from 'react';

import { devErrorLog, devInfoLog, devSuccessLog } from '@utils/devLog';
import { useWebSocketBroadcast } from './useWebSocketBroadcast';

/**
 * Hook personalizado para limpiar datos persistentes antiguos en la pantalla de transmisión
 * al MONTAR el componente.
 *
 * Verifica si existen datos persistentes con timestamp antiguo (más de 1 hora) y los limpia
 * automáticamente enviando un broadcast 'combat_finished'.
 *
 * Este hook se encarga de limpiar datos de combates que no fueron finalizados
 * correctamente cuando el usuario cerró la app sin presionar "Finalizar Combate".
 *
 * @example
 * ```tsx
 * const BattleArenaScreen = () => {
 *   useBroadcastCleanup();  // Limpia datos antiguos al entrar
 *   return <div>...</div>;
 * };
 * ```
 */
export const useBroadcastCleanup = () => {
  const { broadcastViewChange } = useWebSocketBroadcast();

  useEffect(() => {
    const checkAndCleanupOldData = async () => {
      try {
        // Verificar si existen datos persistentes en localStorage
        const persistedData = localStorage.getItem('websocket-storage');
        
        if (!persistedData) {
          devInfoLog('ℹ️ [BroadcastCleanup] No hay datos persistentes');
          return;
        }

        // Parsear datos
        const parsedData = JSON.parse(persistedData);
        const lastUpdated = parsedData?.state?.lastUpdated;

        if (!lastUpdated) {
          devInfoLog('🧹 [BroadcastCleanup] Datos sin timestamp, limpiando...');
          await broadcastViewChange('combat_finished', {
            message: 'Limpieza de datos sin timestamp',
            timestamp: new Date().toISOString(),
          });
          devSuccessLog('✅ [BroadcastCleanup] Datos limpiados');
          return;
        }

        // Verificar si los datos tienen más de 1 hora (3600000 ms)
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;
        const dataAge = now - lastUpdated;

        if (dataAge > oneHour) {
          devInfoLog(
            `🧹 [BroadcastCleanup] Datos antiguos detectados (${Math.floor(dataAge / 1000 / 60)} minutos), limpiando...`
          );
          
          await broadcastViewChange('combat_finished', {
            message: 'Limpieza de datos antiguos',
            timestamp: new Date().toISOString(),
          });
          
          devSuccessLog('✅ [BroadcastCleanup] Datos antiguos limpiados');
        } else {
          devInfoLog(
            `ℹ️ [BroadcastCleanup] Datos recientes (${Math.floor(dataAge / 1000 / 60)} minutos), no requiere limpieza`
          );
        }
      } catch (error) {
        devErrorLog('⚠️ [BroadcastCleanup] Error al verificar datos:', error);
      }
    };

    checkAndCleanupOldData();
  }, [broadcastViewChange]);
};
