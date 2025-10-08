import { Card, CardBody } from '@heroui/react';
import { AlertCircle } from 'lucide-react';

const AlertSelectionFighter: React.FC = () => {
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
};

export default AlertSelectionFighter;
