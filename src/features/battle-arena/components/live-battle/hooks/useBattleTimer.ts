import { useState, useEffect, useMemo } from 'react';

import { useBLEStore } from '@stores/useBLEStore';
import { devInfoLog, devWarningLog } from '@utils/devLog';
import { useWebSocketBroadcast } from '@hooks/useWebSocketBroadcast';

import useBattleStore from '../../../stores/useBattleStore';

export const useBattleTimer = () => {
  const battleConfig = useBattleStore(state => state.battleConfig);

  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(battleConfig.roundDuration || 60);
  const [isBattleFinished, setIsBattleFinished] = useState(false);

  // Acceso a las funciones del almacenamiento BLE
  const removeLastEventFromEachCompetitor = useBLEStore(
    state => state.removeLastEventFromEachCompetitor,
  );
  const combatEvents = useBLEStore(state => state.combatEvents);

  // Hook para comunicación con el backend WebSocket
  const { broadcastViewChange } = useWebSocketBroadcast();

  // Acceso al store de batalla para resetear
  const resetBattle = useBattleStore(state => state.resetBattle);

  // Lógica del temporizador - solo para batallas temporizadas
  useEffect(() => {
    let interval: NodeJS.Timeout;

    // Solo ejecutar temporizador si la batalla está en modo tiempo
    if (battleConfig.mode === 'time' && isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Ronda finalizada - pausar temporizador y avanzar a la siguiente ronda
            setIsActive(false);
            setIsPaused(false);

            if (currentRound < battleConfig.rounds) {
              // Avanzar a la siguiente ronda pero no iniciar el temporizador automáticamente
              setCurrentRound(prev => prev + 1);
              return battleConfig.roundDuration || 60;
            } else {
              // Batalla finalizada - marcar como terminada
              setIsBattleFinished(true);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused, timeLeft, currentRound, battleConfig]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleFinishBattle = async () => {
    try {
      // Enviar mensaje WebSocket de finalización de combate
      await broadcastViewChange('combat_finished', {
        message: 'Combate finalizado con éxito',
        timestamp: new Date().toISOString(),
      });

      await resetBattle();
    } catch (error) {
      console.error('❌ Error al finalizar combate:', error);
    }
  };

  const handleStop = async () => {
    // Finalizar batalla (broadcast + reset global)
    await handleFinishBattle();

    // Limpiar estado local del timer
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(battleConfig.roundDuration || 60);
    setCurrentRound(1);
    setIsBattleFinished(false);
  };

  // Verificar si ambos competidores tienen al menos un evento
  // Usando useMemo para recalcular automáticamente cuando cambian los eventos
  const canAdvanceToNextRound = useMemo(() => {
    devInfoLog('🔍 [useBattleTimer] Recalculando canAdvanceToNextRound...', {
      battleMode: battleConfig.mode,
      totalEvents: combatEvents.length,
      currentRound,
    });

    // Para batallas temporizadas, siempre permitir avanzar (el temporizador controla el flujo)
    if (battleConfig.mode === 'time') {
      devInfoLog('🔍 [useBattleTimer] Modo tiempo - siempre permitir avanzar');
      return true;
    }

    // Para batallas por rondas, ambos competidores deben tener al menos un evento
    const competitor1Events = combatEvents.filter(
      e => e.fighter_id === 'fighter_1',
    );
    const competitor2Events = combatEvents.filter(
      e => e.fighter_id === 'fighter_2',
    );

    const canAdvance =
      competitor1Events.length > 0 && competitor2Events.length > 0;

    devInfoLog('🔍 [useBattleTimer] Validación de eventos:', {
      competitor1Events: competitor1Events.length,
      competitor2Events: competitor2Events.length,
      canAdvance,
      battleMode: battleConfig.mode,
      allEvents: combatEvents.map(e => ({
        fighter_id: e.fighter_id,
        event_type: e.event_type,
        timestamp: e.timestamp,
      })),
    });

    return canAdvance;
  }, [battleConfig.mode, combatEvents, currentRound]);

  const handleNextRound = async () => {
    // Validar si se puede avanzar a la siguiente ronda (solo para batallas por rondas)
    if (battleConfig.mode === 'rounds' && !canAdvanceToNextRound) {
      devWarningLog(
        'No se puede avanzar a la siguiente ronda: ambos competidores deben tener al menos un evento registrado',
      );
      return;
    }

    if (currentRound < battleConfig.rounds) {
      const newRound = currentRound + 1;
      setCurrentRound(newRound);

      // Comunicar cambio de round al backend WebSocket
      try {
        await broadcastViewChange('round_advance', {
          currentRound: newRound,
          totalRounds: battleConfig.rounds,
          battleMode: battleConfig.mode,
          roundDuration: battleConfig.roundDuration,
        });

        devInfoLog('🔄 Round advance broadcasted to backend:', {
          newRound,
          totalRounds: battleConfig.rounds,
        });
      } catch (error) {
        devWarningLog('Failed to broadcast round advance:', error);
      }

      // Reiniciar temporizador para la siguiente ronda si es una batalla temporizada
      if (battleConfig.mode === 'time' && battleConfig.roundDuration) {
        setTimeLeft(battleConfig.roundDuration);
      }
    } else {
      // Todas las rondas finalizadas - marcar como terminada
      setIsBattleFinished(true);
    }
  };

  const handleResetRound = () => {
    // Eliminar el último evento de cada competidor
    removeLastEventFromEachCompetitor();

    // Reiniciar temporizador actual si es una batalla temporizada
    if (battleConfig.mode === 'time' && battleConfig.roundDuration) {
      setTimeLeft(battleConfig.roundDuration);
      setIsPaused(false);
    }
  };

  return {
    isActive,
    isPaused,
    currentRound,
    timeLeft,
    isBattleFinished,
    handleStart,
    handlePause,
    handleStop,
    handleNextRound,
    handleResetRound,
    handleFinishBattle,
    canAdvanceToNextRound,
  };
};
