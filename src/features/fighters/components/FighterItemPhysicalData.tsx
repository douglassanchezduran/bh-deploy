import { cmToFeetInches, kgToLbs } from '@utils/measurementUtils';
import { Ruler, Target, Weight } from 'lucide-react';
import React from 'react';
import { Fighter } from '../models/Fighter';

interface Props {
  fighter: Fighter;
}

const FighterItemPhysicalData: React.FC<Props> = ({ fighter }) => {
  return (
    <div className="mb-6 rounded-lg border border-zinc-600/20 bg-zinc-700/20 p-4">
      <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
        <Target size={14} />
        Datos Físicos
      </h4>
      <div className="grid grid-cols-2 gap-4">
        {/* Altura */}
        <div className="text-center">
          <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
            <Ruler size={14} className="text-blue-400" />
          </div>
          <div className="text-lg font-bold text-white">{fighter.height}</div>
          <div className="text-xs text-zinc-500">cm</div>
          <div className="text-xs text-zinc-400">
            {cmToFeetInches(fighter.height)}
          </div>
        </div>

        {/* Peso */}
        <div className="text-center">
          <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/20">
            <Weight size={14} className="text-green-400" />
          </div>
          <div className="text-lg font-bold text-white">{fighter.weight}</div>
          <div className="text-xs text-zinc-500">kg</div>
          <div className="text-xs text-zinc-400">
            {kgToLbs(fighter.weight)} lbs
          </div>
        </div>
      </div>

      {/* IMC */}
      <div className="mt-4 border-t border-zinc-600/30 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-purple-400"></div>
            <span className="text-xs text-zinc-400">IMC</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-white">
              {(fighter.weight / Math.pow(fighter.height / 100, 2)).toFixed(1)}
            </div>
            {/* <div className="text-xs text-zinc-500">
                  {(() => {
                    const imc =
                      fighter.weight / Math.pow(fighter.height / 100, 2);
                    if (imc < 18.5) return 'Bajo peso';
                    if (imc < 25) return 'Normal';
                    if (imc < 30) return 'Sobrepeso';
                    return 'Obesidad';
                  })()}
                </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FighterItemPhysicalData;
