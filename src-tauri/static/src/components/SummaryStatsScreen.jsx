import React, { useState, useEffect } from 'react';
import useWebSocketStore from '../stores/useWebSocketStore';
import { getNationality } from '../utils/nationalityUtil';
import { useAllCombatData, useCompetitorData, useAllRounds } from '../hooks/useCombatData';

const SummaryStatsScreen = ({ data }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Obtener datos del store
  const roundsHistory = useWebSocketStore(state => state.roundsHistory);
  const saveCurrentRoundToHistory = useWebSocketStore(state => state.saveCurrentRoundToHistory);
  const viewData = useWebSocketStore(state => state.viewData);
  
  // Usar los hooks personalizados para datos de combate
  const { competitor1: competitor1Combat, competitor2: competitor2Combat } = useAllCombatData();
  const competitor1Data = useCompetitorData(1);
  const competitor2Data = useCompetitorData(2);
  const completedRounds = useAllRounds();
  
  // Guardar datos del round actual cuando se muestra esta pantalla
  useEffect(() => {
    saveCurrentRoundToHistory();
  }, [saveCurrentRoundToHistory]);
  
  // Obtener todos los rounds completados desde roundsHistory
  const allRounds = Object.keys(roundsHistory)
    .map(key => ({
      ...roundsHistory[key],
      roundKey: key
    }))
    .sort((a, b) => a.roundNumber - b.roundNumber);
  
  const totalSlides = allRounds.length; // Solo slides por round
  
  // Obtener datos de competidores del store persistente con fallback a los datos del evento
  const competitor1 = competitor1Data || data?.data?.competitor1 || { name: 'JUGADOR 1' };
  const competitor2 = competitor2Data || data?.data?.competitor2 || { name: 'JUGADOR 2' };
  const battleConfig = data?.data?.battleConfig || { rounds: 3 };

  const nationality1 = getNationality(competitor1?.country);
  const nationality2 = getNationality(competitor2?.country);
  
  // Auto-avanzar slides cada 4 segundos
  useEffect(() => {
    if (totalSlides > 1) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % totalSlides);
      }, 4000);
      
      return () => clearInterval(interval);
    }
  }, [totalSlides]);

  // Limpiar el historial de rounds y establecer la pantalla de cover por default
  /* const clearRoundsHistory = useWebSocketStore(state => state.clearRoundsHistory);
  useEffect(() => {
    return () => clearRoundsHistory();
  }, [clearRoundsHistory]); */
  
  // Renderizar slide de round específico
  const renderRoundSlide = (roundIndex) => {
    const roundData = allRounds[roundIndex];
    const roundNumber = roundData?.roundNumber || roundIndex + 1;
    
    // Obtener estadísticas del round específico desde roundsHistory
    const player1RoundData = roundData?.fighter_1;
    const player2RoundData = roundData?.fighter_2;
    
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-red-900">
        {/* Logo BeatHard */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
          <img
            src="assets/logo-w.png"
            alt="BeatHard Logo"
            className="h-20 w-auto brightness-100 drop-shadow-2xl filter"
          />
        </div>

        {/* Título del evento */}
        <div className="absolute top-28 left-1/2 transform -translate-x-1/2 z-30 text-center">
          <div className="bg-black/80 px-12 py-4 rounded-xl">
            <h1 className="text-white text-6xl font-bold tracking-wider">ROUND {roundNumber}/{battleConfig.rounds}</h1>
          </div>
        </div>

        {/* Layout principal estilo UFC */}
        <div className="flex items-center justify-center h-full px-8 pt-32">
          
          {/* Peleador 1 */}
          <div className="flex-1 flex justify-end pr-8">
            <div className="relative">
              {/* Foto del peleador */}
              <div className="w-[30rem] h-[36rem] relative overflow-hidden rounded-lg">
                {competitor1?.photoUrl ? (
                  <img 
                    src={competitor1.photoUrl} 
                    alt={competitor1.name}
                    className="w-full h-full object-cover"
                  />
                ) : null}
                {/* Fallback siempre visible */}
                <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                  <span className="text-white text-6xl font-bold">
                    {competitor1?.name?.charAt(0) || 'P1'}
                  </span>
                </div>
                
                {/* Overlay con información */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                  <div className="flex items-center justify-start gap-3">
                    <h2 className="text-white text-6xl font-bold tracking-wider">
                      {competitor1?.name || "JUGADOR 1"}
                    </h2>
                    {competitor1?.country && (
                      <img
                        src={nationality1?.icon}
                        alt="Flag"
                        className="w-10 h-8 object-cover rounded-md opacity-90"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panel central de estadísticas */}
          <div className="w-[40rem] mx-4">
            <div className="bg-black/90 rounded-xl p-8 border border-yellow-500 h-[40rem] flex flex-col justify-center">
              
              {/* Estadísticas comparativas */}
              <div className="space-y-4">
                
                {/* Fuerza del Golpe en este Round */}
                <div className="grid grid-cols-3 items-center text-center gap-4">
                  <div className="text-white text-6xl font-bold whitespace-nowrap">
                    {player1RoundData?.lastHit?.force?.toFixed(1) ?? "0.0"} N
                  </div>
                  <div className="text-white text-2xl uppercase tracking-wider font-bold">FUERZA</div>
                  <div className="text-white text-6xl font-bold whitespace-nowrap">
                    {player2RoundData?.lastHit?.force?.toFixed(1) ?? "0.0"} N
                  </div>
                </div>

                <div className="border-t border-gray-700"></div>

                {/* Velocidad del Golpe en este Round */}
                <div className="grid grid-cols-3 items-center text-center gap-4">
                  <div className="text-white text-6xl font-bold whitespace-nowrap">
                    {player1RoundData?.lastHit?.velocity?.toFixed(1) ?? "0.0"} m/s
                  </div>
                  <div className="text-white text-2xl uppercase tracking-wider font-bold">VELOCIDAD</div>
                  <div className="text-white text-6xl font-bold whitespace-nowrap">
                    {player2RoundData?.lastHit?.velocity?.toFixed(1) ?? "0.0"} m/s
                  </div>
                </div>

                <div className="border-t border-gray-700"></div>

                {/* Total Golpes */}
                <div className="grid grid-cols-3 items-center text-center gap-4">
                  <div className="text-white text-7xl font-bold">
                    {competitor1Combat?.totalHits ?? "0"}
                  </div>
                  <div className="text-white text-2xl uppercase tracking-wider font-bold">GOLPES</div>
                  <div className="text-white text-7xl font-bold">
                    {competitor2Combat?.totalHits ?? "0"}
                  </div>
                </div>

                <div className="border-t border-gray-700"></div>

                {/* Fuerza Máxima - Al final en amarillo */}
                <div className="grid grid-cols-3 items-center text-center gap-4">
                  <div className="text-yellow-300 text-6xl font-bold whitespace-nowrap">
                    {competitor1Combat?.maxStats?.max_force?.toFixed(1) ?? "0.0"} N
                  </div>
                  <div className="text-yellow-300 text-2xl uppercase tracking-wider font-bold">FUERZA MÁX</div>
                  <div className="text-yellow-300 text-6xl font-bold whitespace-nowrap">
                    {competitor2Combat?.maxStats?.max_force?.toFixed(1) ?? "0.0"} N
                  </div>
                </div>

                <div className="border-t border-gray-700"></div>

                {/* Velocidad Máxima - Al final en amarillo */}
                <div className="grid grid-cols-3 items-center text-center gap-4">
                  <div className="text-yellow-300 text-6xl font-bold whitespace-nowrap">
                    {competitor1Combat?.maxStats?.max_velocity?.toFixed(1) ?? "0.0"} m/s
                  </div>
                  <div className="text-yellow-300 text-2xl uppercase tracking-wider font-bold">VELOCIDAD MÁX</div>
                  <div className="text-yellow-300 text-6xl font-bold whitespace-nowrap">
                    {competitor2Combat?.maxStats?.max_velocity?.toFixed(1) ?? "0.0"} m/s
                  </div>
                </div>
              </div>

              {/* Sponsor */}
              <div className="mt-6 text-center">
                <div className="text-gray-500 text-xs">Powered by</div>
                <div className="text-blue-400 font-bold">BeatHard</div>
              </div>
            </div>
          </div>

          {/* Peleador 2 */}
          <div className="flex-1 flex justify-start pl-8">
            <div className="relative">
              {/* Foto del peleador */}
              <div className="w-[30rem] h-[36rem] relative overflow-hidden rounded-lg">
                {competitor2?.photoUrl ? (
                  <img 
                    src={competitor2.photoUrl} 
                    alt={competitor2.name}
                    className="w-full h-full object-cover"
                  />
                ) : null}
                {/* Fallback siempre visible */}
                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                  <span className="text-white text-6xl font-bold">
                    {competitor2?.name?.charAt(0) || 'P2'}
                  </span>
                </div>
                
                {/* Overlay con información */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                  <div className="flex items-center justify-start gap-3">
                    {competitor2?.country && (
                      <img
                        src={nationality2?.icon}
                        alt="Flag"
                        className="w-10 h-8 object-cover rounded-md opacity-90"
                      />
                    )}
                    <h2 className="text-white text-6xl font-bold tracking-wider">
                      {competitor2?.name || "JUGADOR 2"}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Si no hay rounds, mostrar mensaje
  if (allRounds.length === 0) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-4xl">No hay datos de rounds disponibles</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Renderizar slide actual */}
      {renderRoundSlide(currentSlide)}
      
      {/* Indicadores de slide */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40 flex space-x-2">
        {Array.from({ length: totalSlides }, (_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-yellow-400' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
      
      {/* Controles de navegación manual */}
      <div className="absolute bottom-8 right-8 z-40 flex space-x-4">
        <button
          onClick={() => setCurrentSlide(prev => prev > 0 ? prev - 1 : totalSlides - 1)}
          className="bg-black/50 text-white px-4 py-2 rounded-lg hover:bg-black/70 transition-colors"
        >
          ←
        </button>
        <button
          onClick={() => setCurrentSlide(prev => (prev + 1) % totalSlides)}
          className="bg-black/50 text-white px-4 py-2 rounded-lg hover:bg-black/70 transition-colors"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default SummaryStatsScreen;
