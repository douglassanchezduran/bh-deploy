import React, { useState } from 'react';
import type { Competitor } from '../../../types';

interface CompetitorAvatarProps {
  competitor: Competitor | null;
  teamColor: 'red' | 'blue';
  size?: 'sm' | 'md' | 'lg';
}

const CompetitorAvatar: React.FC<CompetitorAvatarProps> = ({
  competitor,
  teamColor,
  size = 'md',
}) => {
  const [imageError, setImageError] = useState(false);

  // Tamaños del avatar
  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-12 w-12 text-lg',
    lg: 'h-16 w-16 text-xl',
  };

  // Colores del borde y fondo
  const colorClasses = {
    red: {
      border: 'border-red-500',
      bg: 'bg-red-500',
    },
    blue: {
      border: 'border-blue-500',
      bg: 'bg-blue-500',
    },
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const showImage = competitor?.photoUrl && !imageError;
  const fallbackText = competitor?.name?.charAt(0).toUpperCase() || 'C';

  return (
    <div
      className={`relative overflow-hidden rounded-full border-2 ${sizeClasses[size]} ${colorClasses[teamColor].border}`}
    >
      {showImage ? (
        <img
          src={competitor.photoUrl}
          alt={competitor.name || 'Competidor'}
          className="h-full w-full object-cover"
          onError={handleImageError}
        />
      ) : (
        <div
          className={`flex h-full w-full items-center justify-center font-bold text-white ${colorClasses[teamColor].bg}`}
        >
          {fallbackText}
        </div>
      )}
    </div>
  );
};

export default CompetitorAvatar;
