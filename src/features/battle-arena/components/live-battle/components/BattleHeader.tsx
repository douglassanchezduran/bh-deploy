import React from 'react';
import { Trophy } from 'lucide-react';

const BattleHeader: React.FC = () => {
  return (
    <div className="mb-8 text-center">
      <div className="mb-4 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/25">
          <Trophy size={32} className="text-white" />
        </div>
      </div>

      <h1 className="mb-2 text-3xl font-bold text-white">Combate en Vivo</h1>

      <p className="text-zinc-400">
        Monitoreo en tiempo real del enfrentamiento
      </p>
    </div>
  );
};

export default BattleHeader;
