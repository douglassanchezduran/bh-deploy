import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  itemName?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  itemName,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      size="md"
      classNames={{
        base: 'bg-zinc-900 border border-zinc-700',
        header: 'border-b border-zinc-700',
        body: 'py-6',
        footer: 'border-t border-zinc-700',
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-danger-500">
            <AlertTriangle size={18} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-sm font-normal text-zinc-400">
              Esta acción no se puede deshacer
            </p>
          </div>
        </ModalHeader>

        <ModalBody>
          <div className="space-y-4">
            <div className="rounded-lg border border-danger-500/30 bg-danger-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle
                  size={20}
                  className="mt-0.5 flex-shrink-0 text-danger-500"
                />
                <div>
                  <p className="mb-2 font-medium text-white">{message}</p>
                  {itemName && (
                    <p className="text-sm text-zinc-300">
                      Elemento a eliminar:{' '}
                      <span className="font-semibold text-white">
                        "{itemName}"
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm text-zinc-400">
              <p>• Se eliminarán todos los datos asociados</p>
              <p>• Esta acción es permanente e irreversible</p>
              <p>• No podrás recuperar la información posteriormente</p>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="bordered"
            onPress={onCancel}
            className="border-zinc-600 text-zinc-300 hover:border-white hover:text-white"
            startContent={<X size={16} />}
            isDisabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            color="danger"
            onPress={onConfirm}
            isLoading={isLoading}
            className="bg-danger-500 hover:bg-danger-600"
            startContent={!isLoading && <Trash2 size={16} />}
          >
            {isLoading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmationDialog;
