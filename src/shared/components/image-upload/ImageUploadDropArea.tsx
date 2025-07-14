import { AlertCircle, Upload } from 'lucide-react';
import { Button } from '@heroui/react';

interface Props {
  isDragging: boolean;
  error: string;
  onClick: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

const ImageUploadDropArea: React.FC<Props> = ({
  isDragging,
  error,
  onClick,
  onDragOver,
  onDragLeave,
  onDrop,
}) => (
  <div className="flex justify-center py-4">
    <div
      className={`h-90 w-80 cursor-pointer rounded-lg border-2 border-dashed transition-all duration-200 ${
        isDragging
          ? 'border-primary-500 bg-primary-500/10'
          : error
            ? 'border-danger-500 bg-danger-500/5'
            : 'border-zinc-600 bg-zinc-800/30 hover:border-primary-500 hover:bg-primary-500/5'
      }`}
      onClick={onClick}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="flex h-full items-center justify-center p-8 text-center">
        <div className="space-y-4">
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full transition-colors ${
              error ? 'bg-danger-500/20' : 'bg-primary-500/20'
            }`}
          >
            {error ? (
              <AlertCircle size={28} className="text-danger-500" />
            ) : (
              <Upload size={28} className="text-primary-500" />
            )}
          </div>

          <div>
            <h5 className="mb-2 text-lg font-semibold text-white">
              {isDragging ? 'Suelta la imagen aquí' : 'Seleccionar imagen'}
            </h5>
            <p className="mb-4 text-zinc-400">
              Arrastra y suelta una imagen o haz clic para seleccionar
            </p>
          </div>

          <Button
            color="primary"
            variant="bordered"
            size="lg"
            startContent={<Upload size={18} />}
            className="border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white"
          >
            Examinar Archivos
          </Button>

          <div className="border-t border-zinc-700/50 pt-4">
            <div className="grid grid-cols-1 gap-2 text-xs text-zinc-500">
              <div className="flex items-center justify-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary-500"></div>
                <span>JPG, PNG • Máx. 2MB</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary-500"></div>
                <span>Recomendado: 400x400px</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ImageUploadDropArea;
