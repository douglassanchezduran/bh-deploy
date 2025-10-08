import { Card, CardBody, Avatar, Chip } from '@heroui/react';
import { AlertCircle } from 'lucide-react';

import { Fighter } from '@features/fighters/models/Fighter';
import { cmToFeetInches, kgToLbs } from '@utils/measurementUtils';

interface Props {
  fighter: Fighter | null;
  team: 'red' | 'blue';
}

const FighterCard: React.FC<Props> = ({ fighter, team }) => {
  if (!fighter) {
    return (
      <Card className="border border-dashed border-zinc-600/50 bg-zinc-700/30">
        <CardBody className="p-4 text-center">
          <AlertCircle size={24} className="mx-auto mb-2 text-zinc-500" />
          <p className="text-sm text-zinc-500">
            Selecciona un competidor para continuar
          </p>
        </CardBody>
      </Card>
    );
  }

  const teamColor = team === 'red' ? 'red' : 'blue';
  const teamChipColor = team === 'red' ? 'danger' : 'primary';

  return (
    <Card
      className={`border border-${teamColor}-500/30 bg-${teamColor}-500/10`}
    >
      <CardBody className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar
            size="lg"
            src={fighter.photoUrl}
            className={`h-24 w-24 flex-shrink-0 border-3 border-${teamColor}-500`}
          />
          <div className="min-w-0 flex-1">
            <h4 className="mb-2 truncate text-xl font-bold text-white">
              {fighter.name}
            </h4>
            <Chip
              color={teamChipColor}
              size="sm"
              variant="flat"
              className="mb-3"
            >
              Equipo {team === 'red' ? 'Rojo' : 'Azul'}
            </Chip>

            {/* Estadísticas del luchador */}
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Peso:</span>
                <span className="font-medium text-white">
                  {fighter.weight}kg ({kgToLbs(fighter.weight!)}lbs)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Altura:</span>
                <span className="font-medium text-white">
                  {fighter.height}cm ({cmToFeetInches(fighter.height!)})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">País:</span>
                <span className="font-medium text-white">
                  {fighter.country}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default FighterCard;
