import { Card, CardBody } from '@heroui/react';
import { Target } from 'lucide-react';
import useBattleStore from '@features/battle-arena/stores/useBattleStore';

const AlertValidateConfiguration: React.FC = () => {
  const battleConfig = useBattleStore(state => state.battleConfig);
  const isConfigurationValid = useBattleStore(
    state => state.isConfigurationValid,
  );

  if (isConfigurationValid()) return null;

  return (
    <Card className="mb-6 border border-warning-500/30 bg-warning-500/10">
      <CardBody className="p-4">
        <div className="flex items-center space-x-3">
          <Target size={20} className="text-warning-500" />
          <div>
            <p className="font-medium text-warning-400">
              Configuración incompleta
            </p>
            <p className="text-sm text-zinc-400">
              {battleConfig.mode === 'time'
                ? 'Asegúrate de que las rondas estén entre 1-20 y la duración entre 1-10 minutos'
                : 'Asegúrate de que las rondas estén entre 1-20'}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default AlertValidateConfiguration;
