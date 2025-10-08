import React, { useState, useEffect, useRef } from 'react';
import useWebSocketStore from '../stores/useWebSocketStore';

const EMPTY_ARRAY = [];

const HitHistorySidebar = ({ playerId, side = 'left' }) => {
  const currentHistory = useWebSocketStore(state => {
    const fighter = state.combatData[`fighter_${playerId}`];
    return fighter?.hitHistory ?? EMPTY_ARRAY;
  });
  const cleanExpiredHits = useWebSocketStore(state => state.cleanExpiredHits);
  const [hitHistory, setHitHistory] = useState(EMPTY_ARRAY);

  const colors = {
    1: { bg: 'bg-red-500/20', border: 'border-red-400/40', text: 'text-blue-100' },
    2: { bg: 'bg-blue-500/20', border: 'border-blue-400/40', text: 'text-red-100' }
  };

  const playerColors = colors[playerId] || colors[1];

  // Actualizar hitHistory cuando currentHistory cambia
  useEffect(() => {
    setHitHistory(currentHistory);
  }, [currentHistory]);
  
  // Limpiar golpes expirados cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      cleanExpiredHits();
    }, 1000);

    return () => clearInterval(interval);
  }, [cleanExpiredHits]);

  // Forzar re-render cada 100ms solo para animaciones
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    if (hitHistory.length === 0) return;

    const interval = setInterval(() => {
      forceUpdate(prev => prev + 1);
    }, 100);
    return () => clearInterval(interval);
  }, [hitHistory.length]);

  // Calcular tiempo restante para cada golpe
  const getTimeRemaining = (hit) => {
    const remaining = hit.expiresAt - Date.now();
    return Math.max(0, remaining / 1000); // Segundos restantes
  };

  // Calcular opacidad basada en tiempo restante
  const getOpacity = (hit) => {
    const timeRemaining = getTimeRemaining(hit);
    if (timeRemaining > 3.5) return 1; // Visible primeros 3.5 segundos
    if (timeRemaining > 2) return 0.8; // Ligero fade a los 2s
    return Math.max(0.3, timeRemaining / 2); // Fade out últimos 2s
  };

  if (hitHistory.length === 0) return null;

  return (
    <div 
      className={`fixed top-1/2 transform -translate-y-1/2 z-40 ${
        side === 'left' ? 'left-4' : 'right-4'
      }`}
    >
      <div className="space-y-2">
        {hitHistory.map((hit, index) => (
          <div
            key={hit.id}
            className={`
              ${playerColors.bg} ${playerColors.border} ${playerColors.text}
              backdrop-blur-sm border rounded-lg p-3 min-w-[280px]
              transform transition-all duration-300 ease-out
              ${index === 0 ? 'scale-105 shadow-lg' : 'scale-100'}
            `}
            style={{ 
              opacity: getOpacity(hit),
              animationDelay: `${index * 100}ms`
            }}
          >
            {/* Header del golpe */}
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  index === 0 ? 'bg-yellow-400 animate-pulse' : 'bg-white/60'
                }`} />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Golpe {index + 1}
                </span>
              </div>
              <div className="text-xs opacity-70">
                {getTimeRemaining(hit).toFixed(1)}s
              </div>
            </div>

            {/* Estadísticas del golpe - Layout horizontal compacto */}
            <div className="flex items-center justify-center space-x-6">
              <div className="text-center">
                <div className="font-bold text-6xl">
                  {hit.force?.toFixed(1) || '0.0'}
                </div>
                <div className="font-bold text-4xl">N</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-6xl">
                  {hit.velocity?.toFixed(1) || '0.0'}
                </div>
                <div className="font-bold text-4xl">m/s</div>
              </div>
            </div>

            {/* Barra de progreso de tiempo restante */}
            <div className="mt-2 h-1 bg-black/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white/60 transition-all duration-100 ease-linear"
                style={{ 
                  width: `${(getTimeRemaining(hit) / 5) * 100}%` 
                }}
              />
            </div>

            {/* Efecto de "NUEVO" para el golpe más reciente */}
            {index === 0 && getTimeRemaining(hit) > 4.5 && (
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                NUEVO
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Indicador de combo si hay múltiples golpes recientes */}
      {hitHistory.length > 1 && (
        <div className={`
          mt-3 text-center ${playerColors.text}
          text-sm font-bold uppercase tracking-wider
          animate-pulse
        `}>
          {hitHistory.length}x COMBO!
        </div>
      )}
    </div>
  );
};

export default HitHistorySidebar;
