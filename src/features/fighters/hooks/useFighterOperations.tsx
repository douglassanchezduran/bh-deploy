import { useUploadImage } from '@hooks/useUploadImage';
import { showSuccessToast, showErrorToast } from '@utils/toastUtils';
import FirestoreRepository from '@repositories/FirestoreRepository';

import { Fighter } from '../models/Fighter';
import FighterService from '../services/FighterService';

import { useCreateFighter } from './useCreateFigther';
import { useEditFighter } from './useEditFighter';
import { useDeleteFighter } from './useDeleteFigther';

export function useFighterOperations(onSuccess?: () => Promise<void>) {
  // Repositorios y servicios
  const fighterRepository = new FirestoreRepository<Fighter>('players');
  const fighterService = new FighterService(fighterRepository);

  // Hooks para operaciones específicas
  const { uploadImage, isUploading } = useUploadImage(fighterRepository);

  const {
    createFighter,
    isLoading: isCreating,
    error: createError,
  } = useCreateFighter(fighterService);

  const {
    editFighter,
    isLoading: isEditing,
    error: editError,
  } = useEditFighter(fighterService);

  const {
    deleteFighter,
    isLoading: isDeleting,
    error: deleteError,
  } = useDeleteFighter(fighterService);

  // Estado de procesamiento
  const isLoading = isUploading || isCreating || isEditing || isDeleting;

  // Subir foto
  const uploadFighterPhoto = async (
    fighter: Partial<Fighter>,
    photoFile: File,
  ) => {
    const result = await uploadImage(photoFile, fighter.name || 'player');
    if (result.ok) {
      fighter.photoUrl = result.val;
      showSuccessToast('Imagen subida correctamente');
      return true;
    } else {
      showErrorToast('Error al subir la imagen', {
        description: result.val.message,
      });
      return false;
    }
  };

  // Crear peleador
  const handleCreateFighter = async (
    fighter: Partial<Fighter>,
    photoFile: File | null,
  ) => {
    if (photoFile) {
      const photoUploaded = await uploadFighterPhoto(fighter, photoFile);
      if (!photoUploaded) return false;
    }

    const created = await createFighter(fighter as Omit<Fighter, 'id'>);
    if (created) {
      showSuccessToast('Competidor creado correctamente');
      if (onSuccess) await onSuccess();
      return true;
    } else {
      showErrorToast('Error al crear competidor', {
        description: createError ?? undefined,
      });
      return false;
    }
  };

  // Editar peleador
  const handleEditFighter = async (
    fighter: Partial<Fighter>,
    photoFile: File | null,
  ) => {
    if (photoFile) {
      const photoUploaded = await uploadFighterPhoto(fighter, photoFile);
      if (!photoUploaded) return false;
    }

    const edited = await editFighter(fighter as Fighter);
    if (edited) {
      showSuccessToast('Competidor editado correctamente');
      if (onSuccess) await onSuccess();
      return true;
    } else {
      showErrorToast('Error al editar competidor', {
        description: editError ?? undefined,
      });
      return false;
    }
  };

  // Eliminar peleador
  const handleDeleteFighter = async (id: string) => {
    const deleted = await deleteFighter(id);

    if (deleted) {
      showSuccessToast('Competidor eliminado correctamente');
      if (onSuccess) await onSuccess();
      return true;
    } else {
      showErrorToast('Error al eliminar competidor', {
        description: deleteError ?? undefined,
      });
      return false;
    }
  };

  return {
    isUploading,
    isLoading,
    handleCreateFighter,
    handleEditFighter,
    handleDeleteFighter,
  };
}
