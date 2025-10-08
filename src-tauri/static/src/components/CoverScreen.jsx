import React, { useState, useEffect } from 'react';
import FighterCard from './FighterCard';
import VSSection from './VSSection';
import useWebSocketStore from '../stores/useWebSocketStore';

const CoverScreen = ({ data }) => {
  const [animationPhase, setAnimationPhase] = useState('cards-enter');
  const competitor1Data = useWebSocketStore(state => state.competitorData[1]);
  const competitor2Data = useWebSocketStore(state => state.competitorData[2]);
  const setCompetitorData = useWebSocketStore(state => state.setCompetitorData);
  
  // Obtener datos de competidores del store persistente con fallback a los datos del evento
  const competitor1 = competitor1Data || data?.data?.competitor1;
  const competitor2 = competitor2Data || data?.data?.competitor2;
  const battleConfig = data?.data?.battleConfig;

  useEffect(() => {
    // Fase 1: Tarjetas aparecen desde los laterales
    const timer1 = setTimeout(() => {
      setAnimationPhase('collision');
    }, 800);

    // Fase 2: Colisión
    const timer2 = setTimeout(() => {
      setAnimationPhase('explosion');
    }, 1200);

    // Fase 3: Aparece el VS
    const timer3 = setTimeout(() => {
      setAnimationPhase('vs-appear');
    }, 1600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);
  
  // Efecto para guardar los datos de competidores en el store cuando se reciben
  useEffect(() => {
    if (data?.data?.competitor1 || data?.data?.competitor2) {
      setCompetitorData(data.data.competitor1, data.data.competitor2);
    }
  }, [data?.data?.competitor1, data?.data?.competitor2, setCompetitorData]);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* Background Pattern - Full Screen */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,_theme(colors.red.600)_0%,_transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,_theme(colors.blue.600)_0%,_transparent_70%)]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-center pt-8 pb-4">
        <img
          src="assets/logo-w.png"
          alt="BeatHard"
          className="h-32 w-auto brightness-100 drop-shadow-2xl filter transition-all duration-500 group-hover:brightness-125 group-hover:drop-shadow-[0_0_40px_rgba(218,41,44,1)]"
        />
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl">
          {/* Fighters Container */}
          <div className="flex items-center justify-center gap-8">
            {/* Fighter 1 - Team Red */}
            <FighterCard 
              competitor={competitor1}
              teamColor="red"
              animationPhase={animationPhase}
            />

            {/* VS Section */}
            <VSSection 
              animationPhase={animationPhase} 
              battleConfig={battleConfig} 
            />

            {/* Fighter 2 - Team Blue */}
            <FighterCard 
              competitor={competitor2}
              teamColor="blue"
              animationPhase={animationPhase}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverScreen;
