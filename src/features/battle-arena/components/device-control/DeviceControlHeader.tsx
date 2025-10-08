import React from 'react';
import { Card, CardBody, Button } from '@heroui/react';
import { WifiOff } from 'lucide-react';

const DeviceControlHeader: React.FC = () => {
  return (
    <Card className="mb-8 border border-zinc-700/50 bg-zinc-800/50 backdrop-blur-sm">
      <CardBody className="p-6">
        <h2 className="mb-6 text-2xl font-bold text-white">
          Control de Dispositivos
        </h2>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            variant="bordered"
            size="lg"
            className="border-warning-500 text-warning-500 hover:bg-warning-500 hover:text-white"
            startContent={<WifiOff size={20} />}
          >
            Desconectar dispositivos
          </Button>
          <Button
            color="danger"
            size="lg"
            className="bg-danger-500 hover:bg-danger-600"
          >
            Restaurar combate
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default DeviceControlHeader;
