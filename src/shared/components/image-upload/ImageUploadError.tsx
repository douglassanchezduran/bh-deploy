import { AlertCircle } from 'lucide-react';
import { Card, CardBody } from '@heroui/react';

interface Props {
  error: string;
}

const ImageUploadError: React.FC<Props> = ({ error }) =>
  error ? (
    <Card className="border border-danger-500/30 bg-danger-500/10">
      <CardBody className="p-4">
        <div className="flex items-center gap-3">
          <AlertCircle size={20} className="text-danger-500" />
          <div>
            <p className="font-medium text-danger-400">{error}</p>
            <p className="mt-1 text-sm text-zinc-400">
              Por favor, selecciona un archivo que cumpla con los requisitos
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  ) : null;

export default ImageUploadError;
