import { Button } from '@heroui/react';
import { X, ImageIcon } from 'lucide-react';

interface Props {
  shouldShowImage: boolean;
  onRemoveImage: () => void;
}

const ImageUploadHeader: React.FC<Props> = ({
  shouldShowImage,
  onRemoveImage,
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500/20">
        <ImageIcon size={16} className="text-primary-400" />
      </div>
      <div>
        <h4 className="font-semibold text-white">Imagen de Perfil</h4>
        <p className="text-sm text-zinc-400">
          Actualiza la foto del competidor
        </p>
      </div>
    </div>
    {shouldShowImage && (
      <Button
        size="sm"
        variant="light"
        color="danger"
        startContent={<X size={14} />}
        onPress={onRemoveImage}
        className="text-danger-400 hover:text-danger-300"
      >
        Quitar
      </Button>
    )}
  </div>
);

export default ImageUploadHeader;
