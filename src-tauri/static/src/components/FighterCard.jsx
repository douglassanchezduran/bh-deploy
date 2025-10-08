// const { useState, useEffect } = React;
import React, { useState, useEffect } from 'react';

const FighterCard = ({ 
  competitor, 
  teamColor, // 'rojo' o 'azul'
  animationPhase 
}) => {
  const isRed = teamColor === 'red';
  
  // Clases de animación basadas en color de equipo y fase
  const getAnimationClasses = () => {
    const baseClasses = 'relative transition-all duration-500 ease-out';
    
    switch (animationPhase) {
      case 'cards-enter':
        return `${baseClasses} transform translate-x-0 opacity-100`;
      case 'collision':
        return `${baseClasses} transform ${isRed ? 'translate-x-8' : '-translate-x-8'} opacity-100 scale-105`;
      case 'explosion':
        return `${baseClasses} transform ${isRed ? 'translate-x-8' : '-translate-x-8'} opacity-100 scale-105`;
      default:
        return `${baseClasses} transform translate-x-0 opacity-100`;
    }
  };

  // Esquema de colores basado en color de equipo
  const colorScheme = isRed ? {
    gradient: 'from-red-900/40 to-red-800/60',
    border: 'border-red-500',
    photoGradient: 'from-red-600 to-red-800',
    photoBorder: 'border-red-400/50',
    photoOverlay: 'from-red-500/20 to-red-700/40',
    textColor: 'text-red-200',
    shadow: 'hover:shadow-red-500/30',
    badgeBg: 'bg-red-600',
    badgeBorder: 'border-red-400',
    glow: 'bg-red-500/20'
  } : {
    gradient: 'from-blue-900/40 to-blue-800/60',
    border: 'border-blue-500',
    photoGradient: 'from-blue-600 to-blue-800',
    photoBorder: 'border-blue-400/50',
    photoOverlay: 'from-blue-500/20 to-blue-700/40',
    textColor: 'text-blue-200',
    shadow: 'hover:shadow-blue-500/30',
    badgeBg: 'bg-blue-600',
    badgeBorder: 'border-blue-400',
    glow: 'bg-blue-500/20'
  };

  return (
    <div className={getAnimationClasses()}>
      <div className={`bg-gradient-to-br ${colorScheme.gradient} backdrop-blur-sm rounded-3xl border-4 ${colorScheme.border} p-8 w-full min-w-[28rem] max-w-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl ${colorScheme.shadow}`}>
        {/* Foto del peleador */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className={`w-48 h-48 bg-gradient-to-br ${colorScheme.photoGradient} rounded-2xl flex items-center justify-center shadow-2xl border-4 ${colorScheme.photoBorder} overflow-hidden`}>
              {competitor?.photoUrl ? (
                <img 
                  src={competitor.photoUrl} 
                  alt={competitor.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${colorScheme.photoOverlay} flex items-center justify-center`}>
                  <div className={`w-24 h-24 ${colorScheme.textColor} text-6xl flex items-center justify-center`}>👤</div>
                </div>
              )}
            </div>
            <div className={`absolute inset-0 ${colorScheme.glow} rounded-2xl blur-xl -z-10`}></div>
          </div>
        </div>
        
        {/* Nombre del peleador */}
        <h2 className="text-6xl font-bold text-white mb-4 text-center tracking-wider">
          {competitor?.name || (isRed ? "PELEADOR 1" : "PELEADOR 2")}
        </h2>
        
        {/* Insignia de esquina */}
        {/* <div className="flex justify-center mb-6">
          <div className={`${colorScheme.badgeBg} px-6 py-2 rounded-full border-2 ${colorScheme.badgeBorder}`}>
            <span className="text-white font-bold text-2xl tracking-wider">
              {isRed ? "COMPETIDOR ROJO" : "COMPETIDOR AZUL"}
            </span>
          </div>
        </div> */}

        {/* País */}
        <div className="flex items-center justify-center space-x-3 mb-6">
          {competitor?.countryFlag ? (
            <img 
              src={competitor.countryFlag} 
              alt={competitor.country}
              className="w-12 h-8 rounded-md shadow-lg object-cover"
            />
          ) : (
            <div className="bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 w-12 h-8 rounded-md shadow-lg"></div>
          )}
          <span className="text-white font-bold text-3xl tracking-wider">
            {competitor?.country || "País"}
          </span>
        </div>
        
        {/* Estadísticas */}
        <div className="space-y-4">
          <div className="flex justify-between items-center whitespace-nowrap">
            <span className="text-white text-5xl uppercase tracking-wider font-bold">Peso:</span>
            <span className="text-white font-bold text-6xl">
              {competitor?.weight ? `${competitor.weight} kg` : "-- kg"}
            </span>
          </div>
          
          <div className="flex justify-between items-center whitespace-nowrap">
            <span className="text-white text-5xl uppercase tracking-wider font-bold">Altura:</span>
            <span className="text-white font-bold text-6xl">
              {competitor?.height ? `${competitor.height} cm` : "-- cm"}
            </span>
          </div>
          
          <div className="flex justify-between items-center whitespace-nowrap">
            <span className="text-white text-5xl uppercase tracking-wider font-bold">IMC:</span>
            <span className="text-yellow-300 font-bold text-6xl">
              {competitor?.weight && competitor?.height 
                ? calculateIMC(competitor.weight, competitor.height)
                : "--.-"
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Funciones utilitarias
const kgToLbs = (kg) => (kg * 2.20462).toFixed(1);
const cmToFeetInches = (cm) => {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}"`;
};
const calculateIMC = (weight, height) => {
  const heightInMeters = height / 100;
  return (weight / (heightInMeters * heightInMeters)).toFixed(1);
};

export default FighterCard;
