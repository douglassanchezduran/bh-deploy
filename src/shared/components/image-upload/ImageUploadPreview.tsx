import { Check, Camera } from 'lucide-react';

interface Props {
  previewUrl: string;
  onChangeImage: () => void;
}

const ImageUploadPreview: React.FC<Props> = ({ previewUrl, onChangeImage }) => (
  <div className="flex justify-center">
    <div className="relative">
      <div className="relative h-80 w-80 overflow-hidden rounded-lg border-2 border-zinc-600/50 bg-zinc-700/30">
        <img
          src={previewUrl}
          alt="Imagen del competidor"
          className="h-full w-full object-cover"
        />
        <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-zinc-800 bg-success-500 shadow-lg">
          <Check size={14} className="text-white" />
        </div>
        <div
          className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 hover:opacity-100"
          onClick={onChangeImage}
        >
          <div className="rounded-full bg-white/90 p-3">
            <Camera size={20} className="text-zinc-900" />
          </div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <Check size={14} className="text-success-400" />
          <span className="text-sm font-medium text-success-400">
            Nueva imagen seleccionada
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default ImageUploadPreview;
