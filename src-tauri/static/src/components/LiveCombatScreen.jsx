import React, { useMemo, useState, useEffect, memo } from 'react';

import useWebSocketStore from '../stores/useWebSocketStore';
import HitHistorySidebar from './HitHistorySidebar';
import { getNationality } from '../utils/nationalityUtil';
import { useAllCombatData, useCompetitorData, useAllRounds } from '../hooks/useCombatData';

const LiveCombatScreen = ({ data }) => {
  // Usar los hooks personalizados para datos de combate
  const { competitor1: competitor1Combat, competitor2: competitor2Combat } = useAllCombatData();
  const competitor1Data = useCompetitorData(1);
  const competitor2Data = useCompetitorData(2);
  const completedRounds = useAllRounds();
  
  
  const currentRound = useWebSocketStore(state => state.currentRound);
  
  // Obtener datos de competidores del store persistente con fallback a los datos del evento
  const competitor1 = competitor1Data || data?.data?.competitor1;
  const competitor2 = competitor2Data || data?.data?.competitor2;
  const nationality1 = getNationality(competitor1?.country);
  const nationality2 = getNationality(competitor2?.country);
  const setCompetitorData = useWebSocketStore(state => state.setCompetitorData);
  const battleConfig = data?.data?.battleConfig;
  
  // Estado para el timer
  const [timeLeft, setTimeLeft] = useState(battleConfig?.roundDuration || 0);
  
  // Calcular rounds completados para mostrar indicadores
  const totalRounds = battleConfig?.rounds || 3;
  const isTimeMode = battleConfig?.mode === 'time';
  
  // Formatear tiempo para mostrar
  const timeFormatted = useMemo(() => {
    if (!isTimeMode || !timeLeft) return null;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = String(timeLeft % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [timeLeft, isTimeMode]);
  
  // Efecto para manejar el timer (solo si es modo tiempo)
  useEffect(() => {
    if (!isTimeMode || timeLeft <= 0) return;
    
    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimeMode, timeLeft]);
  
  // Efecto para guardar los datos de competidores en el store cuando se reciben
  useEffect(() => {
    if (data?.data?.competitor1 || data?.data?.competitor2) {
      setCompetitorData(data.data.competitor1, data.data.competitor2);
    }
  }, [data?.data?.competitor1, data?.data?.competitor2, setCompetitorData]);
  
  // Resetear timer cuando cambia el round
  useEffect(() => {
    if (isTimeMode && battleConfig?.roundDuration) {
      setTimeLeft(battleConfig.roundDuration);
    }
  }, [currentRound, isTimeMode, battleConfig?.roundDuration]);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Video de fondo simulando transmisión en vivo */}
      {/* <video 
        className="absolute inset-0 w-full h-full object-cover"
        src="https://videos.pexels.com/video-files/4761711/4761711-uhd_2732_1440_25fps.mp4"
        autoPlay
        loop
        muted
        playsInline
      /> */}
      {/* <div className="absolute inset-0 w-full h-full object-cover">
        <img src="assets/bg-video-test.jpeg" alt="" className="w-full h-full object-cover" />
      </div> */}
      
      {/* Logo más discreto pero visible */}
      {/* <div className="absolute top-6 left-6 z-20">
        <img
          src="/assets/logo-w.png"
          alt="BeatHard Logo"
          className="w-32 filter brightness-90 drop-shadow-xl opacity-90"
        />
      </div> */}

      {/* Header superior con información de round - más discreto */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <div className="bg-gradient-to-b from-black/60 via-black/20 to-transparent">
          <div className="flex justify-center pt-4 pb-3">
            {/* Indicadores de rounds más pequeños */}
            <div className="flex items-center space-x-3">
              <div className="text-white/70 text-lg font-light tracking-wider">ROUND</div>
              <div className="flex space-x-1">
                {Array.from({ length: totalRounds }, (_, i) => (
                  <div
                    key={i + 1}
                    className={`w-8 h-1 rounded-full transition-all duration-500 ${
                      i + 1 < currentRound
                        ? "bg-green-400/80 shadow-md shadow-green-400/30" // Rounds completados
                        : i + 1 === currentRound
                        ? "bg-white/90 shadow-md shadow-white/30" // Round actual
                        : "bg-white/20" // Rounds futuros
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
 
      {/* Competidor 1 - Esquina inferior izquierda */}
      <div className="absolute bottom-8 left-8 z-10">
        <div className="bg-black/60 backdrop-blur-sm rounded-xl p-3 border-l-4 border-red-400">
          <div className="space-y-3">
            <div className="grid gap-3">
              {/* Fila 1: Nombre + Bandera */}
              <div className="bg-red-400/25 rounded-lg p-2 border border-red-400/40">
                <div className="flex items-center space-x-3">
                  <div className="text-6xl text-red-400 uppercase font-bold tracking-wider drop-shadow-lg">
                    {competitor1?.name || "PELEADOR 1"}
                  </div>
                  {competitor1?.country && (
                    <img
                      src={nationality1?.icon}
                      alt="Flag"
                      className="w-10 h-8 object-cover rounded-md opacity-90"
                    />
                  )}
                </div>
              </div>
              
              {/* Fila 2: Fuerza | Velocidad | Total Golpes */}
              <div className="grid grid-cols-[2fr_2fr_1fr] gap-3">
                {/* Fila 2 Col 1: Fuerza */}
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-white text-3xl uppercase tracking-wider mb-2">Fuerza</div>
                  <div className="text-white text-6xl font-bold whitespace-nowrap">
                    {competitor1Combat?.lastHit?.force?.toFixed(1) ?? "00.0"} N
                  </div>
                  <div className="text-yellow-300 text-3xl uppercase tracking-wider mt-2">
                    Max.
                  </div>
                  <div className="text-yellow-300 text-6xl font-bold whitespace-nowrap">
                    {competitor1Combat?.maxStats?.max_force?.toFixed(1) ?? "00.0"} N
                  </div>
                </div>

                {/* Fila 2 Col 2: Velocidad */}
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-white text-3xl uppercase tracking-wider mb-2">Velocidad</div>
                  <div className="text-white text-6xl font-bold whitespace-nowrap">
                    {competitor1Combat?.lastHit?.velocity?.toFixed(1) ?? "00.0"} m/s
                  </div>
                  <div className="text-yellow-300 text-3xl uppercase tracking-wider mt-2">
                    Max.
                  </div>
                  <div className="text-yellow-300 text-6xl font-bold whitespace-nowrap">
                    {competitor1Combat?.maxStats?.max_velocity?.toFixed(1) ?? "00.0"} m/s
                  </div>
                </div>

                {/* Fila 2 Col 3: Total de Golpes */}
                <div className="bg-red-400/15 rounded-lg p-3 border border-red-400/20">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-white text-7xl font-bold">{competitor1Combat?.totalHits ?? 0}</div>
                    <div className="text-red-300 text-2xl uppercase tracking-wider">Golpes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panel central con timer/round - parte inferior centro */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center justify-center border border-white/40">
          <div className="text-white text-2xl uppercase tracking-wider mb-2">ROUND</div>
          <div className="text-white text-8xl font-bold leading-none">{currentRound}</div>
          <div className="text-white text-2xl font-mono leading-none mt-2">{timeFormatted}</div>
        </div>
      </div>

      {/* Competidor 2 - Esquina inferior derecha */}
      <div className="absolute bottom-8 right-8 z-10">
        <div className="bg-black/60 backdrop-blur-sm rounded-xl p-3 border-r-4 border-blue-400">
          <div className="space-y-3">
            <div className="grid gap-3">
              {/* Fila 1: Nombre + Bandera */}
              <div className="bg-blue-400/25 rounded-lg p-2 border border-blue-400/40">
                <div className="flex items-center space-x-3">
                  {competitor2?.country && (
                    <img 
                      src={nationality2?.icon}
                      alt="Flag"
                      className="w-10 h-8 object-cover rounded-md opacity-90"
                    />
                  )}
                  <div className="text-6xl text-blue-400 uppercase font-bold tracking-wider drop-shadow-lg">
                    {competitor2?.name || "PELEADOR 2"}
                  </div>
                </div>
              </div>
              
              {/* Fila 2: Fuerza | Velocidad | Total Golpes */}
              <div className="grid grid-cols-[2fr_2fr_1fr] gap-3">
                {/* Fila 2 Col 1: Fuerza */}
                <div className="bg-white/15 rounded-lg p-3">
                  <div className="text-white text-3xl uppercase tracking-wider mb-2">Fuerza</div>
                  <div className="space-y-1">
                    <div className="text-white text-6xl font-bold whitespace-nowrap">
                      {competitor2Combat?.lastHit?.force?.toFixed(1) || "00.0"} N
                    </div>
                    <div className="text-yellow-300 text-3xl uppercase tracking-wider mt-2">
                      Max.
                    </div>
                    <div className="text-yellow-300 text-6xl font-bold whitespace-nowrap">
                      {competitor2Combat?.maxStats?.max_force?.toFixed(1) || "00.0"} N
                    </div>
                  </div>
                </div>

                {/* Fila 2 Col 2: Velocidad */}
                <div className="bg-white/15 rounded-lg p-3">
                  <div className="text-white text-3xl uppercase tracking-wider mb-2">Velocidad</div>
                  <div className="space-y-1">
                    <div className="text-white text-6xl font-bold whitespace-nowrap">
                      {competitor2Combat?.lastHit?.velocity?.toFixed(1) || "00.0"} m/s
                    </div>
                    <div className="text-yellow-300 text-3xl uppercase tracking-wider mt-2">
                      Max.
                    </div>
                    <div className="text-yellow-300 text-6xl font-bold whitespace-nowrap">
                      {competitor2Combat?.maxStats?.max_velocity?.toFixed(1) || "00.0"} m/s
                    </div>
                  </div>
                </div>

                {/* Fila 2 Col 3: Total de Golpes */}
                <div className="bg-blue-400/15 rounded-lg p-3 border border-blue-400/20">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-white text-7xl font-bold">{competitor2Combat?.totalHits || 0}</div>
                    <div className="text-blue-300 text-2xl uppercase tracking-wider">Golpes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historial lateral más prominente */}
      <HitHistorySidebar playerId={1} side="left" />
      <HitHistorySidebar playerId={2} side="right" />
    </div>
  );
};

export default memo(LiveCombatScreen);
