import React from 'react';
import { Card, CardBody } from '@heroui/react';
import { AlertCircle } from 'lucide-react';

interface Props {
  show: boolean;
  title?: string;
  description?: string;
}

const IncompleteConfigWarning: React.FC<Props> = ({
  show,
  title,
  description,
}) => {
  if (!show) return null;

  return (
    <Card className="mb-6 border border-warning-500/30 bg-warning-500/10">
      <CardBody className="p-4">
        <div className="flex items-center space-x-3">
          <AlertCircle size={20} className="text-warning-500" />
          <div>
            <p className="font-medium text-warning-400">
              {title ?? 'Configuración incompleta'}
            </p>
            <p className="text-sm text-zinc-400">
              {description ?? 'Faltan elementos por configurar'}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default IncompleteConfigWarning;
