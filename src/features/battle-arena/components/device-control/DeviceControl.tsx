import { Card, CardBody } from '@heroui/react';

import { Fighter } from '@features/fighters/models/Fighter';
import FighterSelectionPanel from './FighterSelectionPanel';

interface Props {
  fighters: Fighter[];
}

const DeviceControl: React.FC<Props> = ({ fighters }) => {
  return (
    <Card className="mb-8 border border-zinc-700/50 bg-zinc-800/50 backdrop-blur-sm">
      <CardBody className="p-6">
        <h2 className="mb-6 text-2xl font-bold text-white">
          Configurar combate
        </h2>

        {/* Sección de selección de luchadores */}
        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <FighterSelectionPanel team="red" fighters={fighters} />
          <FighterSelectionPanel team="blue" fighters={fighters} />
        </div>
      </CardBody>
    </Card>
  );
};

export default DeviceControl;
