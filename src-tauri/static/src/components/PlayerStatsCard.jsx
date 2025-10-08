import React from 'react';
import { useCombatData } from '../hooks/useCombatData';

/**
 * Ejemplo de componente reutilizable que usa el hook
 */
const PlayerStatsCard = ({ playerId, playerName }) => {
  // Reutilizar el hook en cualquier componente
  const { combatData, maxStats, lastHit, totalHits } = useCombatData(playerId);
  
  return (
    <div className="stats-card">
      <h3>{playerName}</h3>
      
      {/* Último golpe */}
      <div>
        <p>Último golpe:</p>
        <p>Fuerza: {lastHit?.force?.toFixed(1) || '0.0'} N</p>
        <p>Velocidad: {lastHit?.velocity?.toFixed(1) || '0.0'} m/s</p>
      </div>
      
      {/* Máximos */}
      <div>
        <p>Récords:</p>
        <p>Max Fuerza: {maxStats?.max_force?.toFixed(1) || '0.0'} N</p>
        <p>Max Velocidad: {maxStats?.max_velocity?.toFixed(1) || '0.0'} m/s</p>
      </div>
      
      {/* Total */}
      <p>Total de golpes: {totalHits}</p>
    </div>
  );
};

export default PlayerStatsCard;
