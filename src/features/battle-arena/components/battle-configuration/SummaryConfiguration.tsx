import { Card, CardBody } from '@heroui/react';
import useBattleStore from '@features/battle-arena/stores/useBattleStore';

const SummaryConfiguration: React.FC = () => {
  const battleConfig = useBattleStore(state => state.battleConfig);

  return (
    <Card className="mb-8 border border-dashed border-zinc-600/30 bg-zinc-700/30">
      <CardBody className="p-6">
        <h4 className="mb-4 text-lg font-bold text-white">
          Resumen de configuración
        </h4>

        <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
          <div>
            <span className="text-zinc-400">Modo: </span>
            <span className="font-medium text-white">
              {battleConfig.mode === 'time' ? 'Por tiempo' : 'Por rondas'}
            </span>
          </div>

          <div>
            <span className="text-zinc-400">Rondas: </span>
            <span className="font-medium text-white">
              {battleConfig.rounds}
            </span>
          </div>

          {battleConfig.mode === 'time' && (
            <div>
              <span className="text-zinc-400">Duración por ronda: </span>
              <span className="font-medium text-white">
                {battleConfig.roundDuration} segundos
              </span>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default SummaryConfiguration;
