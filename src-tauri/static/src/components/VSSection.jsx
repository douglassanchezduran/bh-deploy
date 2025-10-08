import React from 'react';

const VSSection = ({ animationPhase, battleConfig }) => {
  return (
    <div className="flex flex-col items-center justify-center relative min-h-[400px]">
      {/* Explosion Effect */}
      {(animationPhase === 'explosion' || animationPhase === 'vs-appear') && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          {/* Central explosion */}
          <div className={`w-32 h-32 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500 rounded-full ${animationPhase === 'explosion' ? 'animate-ping opacity-90' : 'opacity-0'}`}></div>
          <div className={`absolute w-24 h-24 bg-white rounded-full ${animationPhase === 'explosion' ? 'animate-ping opacity-70' : 'opacity-0'}`}></div>
          <div className={`absolute w-16 h-16 bg-yellow-300 rounded-full ${animationPhase === 'explosion' ? 'animate-ping opacity-80' : 'opacity-0'}`}></div>
          
          {/* Explosion particles */}
          <div className={`absolute w-3 h-3 bg-red-400 rounded-full -top-12 -left-6 ${animationPhase === 'explosion' ? 'animate-ping' : 'opacity-0'}`}></div>
          <div className={`absolute w-2 h-2 bg-blue-400 rounded-full -top-8 right-8 ${animationPhase === 'explosion' ? 'animate-ping' : 'opacity-0'}`}></div>
          <div className={`absolute w-2 h-2 bg-yellow-400 rounded-full top-12 -left-8 ${animationPhase === 'explosion' ? 'animate-ping' : 'opacity-0'}`}></div>
          <div className={`absolute w-3 h-3 bg-orange-400 rounded-full top-8 right-6 ${animationPhase === 'explosion' ? 'animate-ping' : 'opacity-0'}`}></div>
          <div className={`absolute w-2 h-2 bg-red-300 rounded-full -bottom-6 left-10 ${animationPhase === 'explosion' ? 'animate-ping' : 'opacity-0'}`}></div>
          <div className={`absolute w-3 h-3 bg-blue-300 rounded-full -bottom-8 -right-2 ${animationPhase === 'explosion' ? 'animate-ping' : 'opacity-0'}`}></div>
        </div>
      )}

      {/* VS Circle - aparece después de la explosión */}
      {animationPhase === 'vs-appear' && (
        <div className="relative z-20" style={{
          animation: 'fade-in-scale 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards'
        }}>
          <div className="relative mb-8 flex items-center justify-center">
            {/* Main VS Circle */}
            <div className="relative">
              <div className="bg-gradient-to-r from-red-600 via-white to-blue-600 rounded-full w-40 h-40 flex items-center justify-center shadow-2xl animate-pulse">
                <div className="bg-black rounded-full w-32 h-32 flex items-center justify-center">
                  <span className="text-white text-6xl font-black tracking-wider">VS</span>
                </div>
              </div>
              
              {/* Glow effects */}
              <div className="absolute inset-0 bg-red-500/30 rounded-full blur-2xl -z-10 animate-pulse"></div>
              <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-2xl -z-10 animate-pulse" style={{animationDelay: '500ms'}}></div>
            </div>
            
            {/* Decorative sparks */}
            <div className="absolute -top-6 -left-6 w-4 h-4 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '100ms'}}></div>
            <div className="absolute -bottom-6 -right-6 w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '200ms'}}></div>
            <div className="absolute top-1/2 -left-10 w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
            <div className="absolute top-1/2 -right-10 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '400ms'}}></div>
          </div>
          
          {/* Match Info */}
          <div className="bg-black/60 backdrop-blur-sm rounded-2xl px-8 py-4 border border-white/20 mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                {/* <span className="text-yellow-400 text-lg">👑</span> */}
                <span className="text-white font-bold text-3xl">CONFIGURACIÓN DEL COMBATE</span>
                {/* <span className="text-yellow-400 text-lg">👑</span> */}
              </div>
              <div className="text-gray-300 font-bold text-6xl">
                {battleConfig ? (
                  battleConfig.mode === 'time' 
                    ? `${battleConfig.rounds} Rounds x ${battleConfig.roundDuration}`
                    : `${battleConfig.rounds} Rounds`
                ) : (
                  "---"
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VSSection;
