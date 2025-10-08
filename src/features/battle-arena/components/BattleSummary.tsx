import React from 'react';
import { Card, CardBody } from '@heroui/react';
import useBattleStore from '../stores/useBattleStore';

const BattleSummary: React.FC = () => {
  const battleConfig = useBattleStore(state => state.battleConfig);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} min ${secs} seg`;
  };

  return (
    <Card className="mb-8 border border-dashed border-zinc-600/30 bg-zinc-700/30">
      <CardBody className="p-6">
        <h3 className="mb-4 text-lg font-bold text-white">
          Resumen del combate
        </h3>
        <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-4">
          <div>
            <span className="text-zinc-400">Tipo: </span>
            <span className="text-white">
              {battleConfig.mode === 'time' ? 'Por tiempo' : 'Por rondas'}
            </span>
          </div>
          <div>
            <span className="text-zinc-400">Rondas: </span>
            <span className="text-white">{battleConfig.rounds}</span>
          </div>
          {battleConfig.mode === 'time' && (
            <div>
              <span className="text-zinc-400">Duración por ronda: </span>
              <span className="text-white">
                {formatDuration(battleConfig.roundDuration || 60)}
              </span>
            </div>
          )}
          <div>
            <span className="text-zinc-400">Arena: </span>
            <span className="text-white">Principal</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default BattleSummary;
