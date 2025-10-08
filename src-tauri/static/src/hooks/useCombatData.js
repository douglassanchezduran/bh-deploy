import { useMemo } from 'react';
import useWebSocketStore from '../stores/useWebSocketStore';

// Constantes para evitar crear nuevos objetos/arrays en cada render
const EMPTY_ARRAY = [];

/**
 * Hook personalizado para obtener datos de combate de un competidor
 * Se re-renderiza automáticamente cuando cambian los datos
 */
export const useCombatData = (competitorId) => {
  const combatData = useWebSocketStore(state => state.combatData[`fighter_${competitorId}`]);
  const maxStats = useWebSocketStore(state => state.maxStatsData[`fighter_${competitorId}`]);

  return {
    combatData: combatData ?? null,
    maxStats: maxStats ?? null,
    lastHit: combatData?.lastHit ?? null,
    totalHits: combatData?.totalHits ?? 0,
    hitHistory: combatData?.hitHistory ?? EMPTY_ARRAY,
  };
};

/**
 * Hook para obtener datos de ambos competidores
 */
export const useAllCombatData = () => {
  const competitor1 = useCombatData(1);
  const competitor2 = useCombatData(2);
  
  return { competitor1, competitor2 };
};

/**
 * Hook para obtener datos de un round específico
 */
export const useRoundData = (roundNumber) => {
  const roundData = useWebSocketStore(state => state.roundsHistory[`round_${roundNumber}`]);
  return roundData || null;
};

/**
 * Hook para obtener todos los rounds completados
 */
export const useAllRounds = () => {
  const roundsHistory = useWebSocketStore(state => state.roundsHistory);
  
  return useMemo(() => {
    return Object.keys(roundsHistory)
      .map(key => roundsHistory[key])
      .sort((a, b) => a.roundNumber - b.roundNumber);
  }, [roundsHistory]);
};

/**
 * Hook para obtener datos de un competidor en un round específico
 */
export const useCompetitorRoundData = (competitorId, roundNumber) => {
  const roundData = useRoundData(roundNumber);
  
  return useMemo(() => {
    if (!roundData) return null;
    return roundData[`fighter_${competitorId}`] || null;
  }, [roundData, competitorId]);
};

/**
 * Hook para obtener estadísticas totales de un competidor (todos los rounds)
 */
export const useCompetitorTotalStats = (competitorId) => {
  const roundsHistory = useWebSocketStore(state => state.roundsHistory);
  const combatData = useWebSocketStore(state => state.combatData[`fighter_${competitorId}`]);
  
  return useMemo(() => {
    let totalHits = 0;
    let totalForce = 0;
    let maxVelocity = 0;
    let maxAcceleration = 0;
    
    // Sumar estadísticas de rounds completados
    Object.values(roundsHistory).forEach(round => {
      const competitorData = round[`fighter_${competitorId}`];
      
      if (competitorData) {
        totalHits += competitorData.totalHits || 0;
        if (competitorData.lastHit) {
          totalForce += competitorData.lastHit.force || 0;
          maxVelocity = Math.max(maxVelocity, competitorData.lastHit.velocity || 0);
          maxAcceleration = Math.max(maxAcceleration, competitorData.lastHit.acceleration || 0);
        }
      }
    });
    
    // Agregar estadísticas del round actual
    if (combatData) {
      totalHits += combatData.totalHits || 0;
      if (combatData.lastHit) {
        totalForce += combatData.lastHit.force || 0;
        maxVelocity = Math.max(maxVelocity, combatData.lastHit.velocity || 0);
        maxAcceleration = Math.max(maxAcceleration, combatData.lastHit.acceleration || 0);
      }
    }
    
    return {
      totalHits,
      averageForce: totalHits > 0 ? totalForce / totalHits : 0,
      maxVelocity,
      maxAcceleration,
      roundsPlayed: Object.keys(roundsHistory).length + 1
    };
  }, [roundsHistory, combatData, competitorId]);
};

/**
 * Hook para obtener datos de un competidor
 */
export const useCompetitorData = (competitorId) => {
  const competitorData = useWebSocketStore(state => state.competitorData[competitorId]);
  return competitorData || null;
};
