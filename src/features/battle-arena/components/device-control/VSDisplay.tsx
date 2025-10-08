import React from 'react';

interface Props {
  show: boolean;
}

const VSDisplay: React.FC<Props> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="mb-12 flex items-center justify-center">
      <div className="relative">
        {/* Texto principal VS */}
        <div className="animate-pulse bg-gradient-to-r from-red-500 via-white to-blue-500 bg-clip-text text-8xl font-black text-transparent">
          VS
        </div>

        {/* Efectos de resplandor */}
        <div className="absolute inset-0 text-8xl font-black text-white opacity-20 blur-sm">
          VS
        </div>
        <div className="absolute inset-0 animate-pulse text-8xl font-black text-primary-500 opacity-30 blur-md">
          VS
        </div>

        {/* Elementos decorativos */}
        <div className="absolute -left-4 -top-4 h-4 w-4 animate-ping rounded-full bg-red-500"></div>
        <div className="absolute -right-4 -top-4 h-4 w-4 animate-ping rounded-full bg-blue-500 delay-300"></div>
        <div className="absolute -bottom-4 -left-4 h-4 w-4 animate-ping rounded-full bg-white delay-150"></div>
        <div className="delay-450 absolute -bottom-4 -right-4 h-4 w-4 animate-ping rounded-full bg-primary-500"></div>
      </div>
    </div>
  );
};

export default VSDisplay;
