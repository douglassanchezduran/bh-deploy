import React, { useEffect, useMemo, useState } from 'react';
import useWebSocketStore from '../stores/useWebSocketStore';
import CoverScreen from './CoverScreen';
import LiveCombatScreen from './LiveCombatScreen';
import RoundStatsScreen from './RoundStatsScreen';
import SummaryStatsScreen from './SummaryStatsScreen';

const BeatHardApp = () => {
  // Estado local para prevenir parpadeos
  const [stableView, setStableView] = useState('cover');

  const currentView = useWebSocketStore(state => state.currentView);
  const viewData = useWebSocketStore(state => state.viewData);
  const initWebSocket = useWebSocketStore(state => state.initWebSocket);
  const closeWebSocket = useWebSocketStore(state => state.closeWebSocket);

  useEffect(() => {
    // Inicializar WebSocket
    initWebSocket();
    
    // Cleanup al desmontar
    return () => closeWebSocket();
  }, [initWebSocket, closeWebSocket]);

  // Actualizar vista estable solo cuando currentView es válido
  useEffect(() => {
    if (currentView && currentView !== stableView) {
      setStableView(currentView);
    }
  }, [currentView, stableView]);

  // Memoizar el componente renderizado para evitar re-creación innecesaria
  const renderedView = useMemo(() => {
    const screens = {
      'cover': <CoverScreen data={viewData} />,
      'live-combat': <LiveCombatScreen data={viewData} />,
      'round-stats': <RoundStatsScreen data={viewData} />,
      'summary-stats': <SummaryStatsScreen data={viewData} />,
    };

    // Usar vista estable para evitar parpadeos
    const selectedScreen = screens[stableView] || screens['cover'];
    return selectedScreen;
  }, [stableView, viewData]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {renderedView}
    </div>
  );
};

export default BeatHardApp;
