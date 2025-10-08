import React from 'react';
import { Modal, ModalContent, ModalBody, Button } from '@heroui/react';
import { X, ExternalLink } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  fighterName: string;
  fighterAlias?: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  fighterName,
  fighterAlias,
}) => {
  const handleOpenInNewTab = () => {
    window.open(imageUrl, '_blank');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      classNames={{
        base: 'bg-zinc-900/95 backdrop-blur-lg border border-zinc-700/50',
        body: 'p-0',
        wrapper: 'items-center justify-center',
      }}
      hideCloseButton
    >
      <ModalContent>
        <ModalBody>
          <div className="relative">
            {/* Header con información del luchador */}
            <div className="absolute left-0 right-0 top-0 z-10 bg-gradient-to-b from-zinc-900/90 to-transparent p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {fighterName}
                  </h3>
                  {fighterAlias && (
                    <p className="font-medium text-primary-400">
                      "{fighterAlias}"
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    aria-label="Abrir en nueva pestaña"
                    className="bg-zinc-800/60 text-white backdrop-blur-sm hover:bg-zinc-700/80"
                    onPress={handleOpenInNewTab}
                    title="Abrir en nueva pestaña"
                  >
                    <ExternalLink size={16} />
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    aria-label="Cerrar modal"
                    className="bg-zinc-800/60 text-white backdrop-blur-sm hover:bg-zinc-700/80"
                    onPress={onClose}
                    title="Cerrar"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Imagen principal */}
            <div className="relative">
              <img
                src={imageUrl}
                alt={`${fighterName} - Imagen completa`}
                className="h-auto max-h-[80vh] w-full rounded-lg object-contain"
                style={{ minHeight: '400px' }}
              />

              {/* Overlay para cerrar al hacer clic */}
              <div
                className="absolute inset-0 cursor-pointer"
                onClick={onClose}
                title="Hacer clic para cerrar"
              />
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ImageModal;
