import React, { useEffect } from 'react';
import useWebSocketStore from '../stores/useWebSocketStore';
import { getNationality } from '../utils/nationalityUtil';
import { useCombatData, useCompetitorData, useAllRounds, useAllCombatData } from '../hooks/useCombatData';

const RoundStatsScreen = () => {
  // Obtener todos los datos necesarios del WebSocket store
  const currentRound = useWebSocketStore(state => state.currentRound);
  const viewData = useWebSocketStore(state => state.viewData);
  const saveCurrentRoundToHistory = useWebSocketStore(state => state.saveCurrentRoundToHistory);
  
  // Usar los hooks personalizados para datos de combate
  const { competitor1: competitor1Combat, competitor2: competitor2Combat } = useAllCombatData();
  const competitor1Data = useCompetitorData(1);
  const competitor2Data = useCompetitorData(2);
  const completedRounds = useAllRounds();
  
  // Guardar datos del round actual cuando se muestra esta pantalla
  useEffect(() => {
    saveCurrentRoundToHistory();
  }, [saveCurrentRoundToHistory]);
  
  // Obtener datos de los competidores del store persistente con fallback a los datos del evento
  const competitor1 = competitor1Data || viewData?.data?.competitor1 || { name: 'JUGADOR 1' };
  const competitor2 = competitor2Data || viewData?.data?.competitor2 || { name: 'JUGADOR 2' };
  const battleConfig = viewData?.data?.battleConfig || { rounds: 3 };
  
  const totalRounds = battleConfig?.rounds || 3;

  const nationality1 = getNationality(competitor1?.country);
  const nationality2 = getNationality(competitor2?.country);

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
          <h1 className="text-white text-6xl font-bold tracking-wider">ROUND {currentRound}</h1>
        </div>
      </div>

      {/* Layout principal estilo UFC */}
      <div className="flex items-center justify-center h-full px-8 pt-32">
        
        {/* Peleador 1 */}
        <div className="flex-1 flex justify-end pr-6">
          <div className="relative">
            {/* Foto del peleador */}
            <div className="w-[28rem] h-[40rem] relative overflow-hidden rounded-lg">
              {competitor1?.photoUrl ? (
                <img 
                  src={competitor1.photoUrl} 
                  alt={competitor1.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                  <span className="text-white text-6xl font-bold">
                    {competitor1?.name?.charAt(0) || 'P1'}
                  </span>
                </div>
              )}
              
              {/* Overlay con información */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                <h2 className="text-white text-6xl font-bold tracking-wider mb-1">
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

        {/* Panel central de estadísticas */}
        <div className="w-[40rem] mx-4">
          <div className="bg-black/90 rounded-xl p-8 border border-yellow-500 h-[40rem] flex flex-col justify-center">
            
            {/* Estadísticas comparativas */}
            <div className="space-y-4">
              
              {/* Fuerza del Golpe en este Round */}
              <div className="grid grid-cols-3 items-center text-center gap-4">
                <div className="text-white text-6xl font-bold whitespace-nowrap">
                  {competitor1Combat?.lastHit?.force?.toFixed(1) ?? "0.0"} N
                </div>
                <div className="text-white text-2xl uppercase tracking-wider font-bold">FUERZA</div>
                <div className="text-white text-6xl font-bold whitespace-nowrap">
                  {competitor2Combat?.lastHit?.force?.toFixed(1) ?? "0.0"} N
                </div>
              </div>

              <div className="border-t border-gray-700"></div>

              {/* Velocidad del Golpe en este Round */}
              <div className="grid grid-cols-3 items-center text-center gap-4">
                <div className="text-white text-6xl font-bold whitespace-nowrap">
                  {competitor1Combat?.lastHit?.velocity?.toFixed(1) ?? "0.0"} m/s
                </div>
                <div className="text-white text-2xl uppercase tracking-wider font-bold">VELOCIDAD</div>
                <div className="text-white text-6xl font-bold whitespace-nowrap">
                  {competitor2Combat?.lastHit?.velocity?.toFixed(1) ?? "0.0"} m/s
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
        <div className="flex-1 flex justify-start pl-6">
          <div className="relative">
            {/* Foto del peleador */}
            <div className="w-[28rem] h-[40rem] relative overflow-hidden rounded-lg">
              {competitor2?.photoUrl ? (
                <img 
                  src={competitor2.photoUrl} 
                  alt={competitor2.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                  <span className="text-white text-6xl font-bold">
                    {competitor2?.name?.charAt(0) || 'P2'}
                  </span>
                </div>
              )}
              
              {/* Overlay con información */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                <h2 className="text-white text-6xl font-bold tracking-wider mb-1">
                  {competitor2?.name || "JUGADOR 2"}
                </h2>
                {competitor2?.country && (
                  <img
                    src={nationality2?.icon}
                    alt="Flag"
                    className="w-10 h-8 object-cover rounded-md opacity-90"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoundStatsScreen;
