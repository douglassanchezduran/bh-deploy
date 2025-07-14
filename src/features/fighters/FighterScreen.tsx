import React, { useState } from 'react';
import { Alert, Button } from '@heroui/react';
import { UserPlus } from 'lucide-react';

import Header from '@components/Header';
import ImageModal from '@features/fighters/components/ImageModal';

import { useFilteredFighters } from './hooks/useFilteredFighters';
import { useFighters } from './hooks/useFighters';
import { Fighter } from './models/Fighter';
import { useFighterOperations } from './hooks/useFighterOperations';

import { FiltersState, initialFilters } from './components/filters/types';
import FighterFormModal from './components/form/FighterFormModal';
import FighterItem from './components/FigtherItem';
import Filters from './components/Filters';
import Empty from './components/filters/Empty';
import DeleteConfirmationDialog from './components/DeleteConfirmationDialog';

const DEFAULT_FIGHTER: Partial<Fighter> = {
  name: '',
  height: 150,
  weight: 50,
  photoUrl: '',
  country: '',
};

const FighterScreen: React.FC = () => {
  const [filters, setFilters] = useState<FiltersState>(initialFilters);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    useState<boolean>(false);
  const [editingFighter, setEditingFighter] = useState<Partial<Fighter> | null>(
    null,
  );

  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [selectedImageData, setSelectedImageData] = useState<{
    url: string;
    name: string;
    alias: string;
  } | null>(null);

  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);

  const handleOpenEditModal = (fighter: Partial<Fighter>) => {
    setEditingFighter(fighter);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingFighter(null);
  };

  const handleFiltersChange = (filters: FiltersState) => {
    setFilters(filters);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setEditingFighter(null);
  };

  const handleClearFilters = () => setFilters(initialFilters);

  const { fighters, error, refetch } = useFighters();
  const filteredFighters = useFilteredFighters(fighters, filters);

  const {
    isUploading,
    isLoading,
    handleCreateFighter,
    handleEditFighter,
    handleDeleteFighter: deleteFighter,
  } = useFighterOperations(refetch);

  const onCreateFighter = async (
    fighter: Partial<Fighter>,
    photoFile: File | null,
  ) => {
    const success = await handleCreateFighter(fighter, photoFile);
    if (success) handleCloseCreateModal();
  };

  const onEditFighter = async (
    fighter: Partial<Fighter>,
    photoFile: File | null,
  ) => {
    const success = await handleEditFighter(fighter, photoFile);
    if (success) handleCloseEditModal();
  };

  const onDeleteFighter = async () => {
    const success = await deleteFighter(editingFighter?.id ?? '');
    if (success) handleCancelDelete();
  };

  const handleImageClick = (fighter: Partial<Fighter>) => {
    setSelectedImageData({
      url: fighter.photoUrl ?? '',
      name: fighter.name ?? '',
      alias: fighter.name ?? '',
    });
    setShowImageModal(true);
  };

  const handleDeleteFighter = (fighter: Fighter) => {
    setEditingFighter(fighter);
    setShowDeleteConfirmation(true);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-950 pt-20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Header
          title="Competidores"
          description="Los guerreros más temidos del arena."
        />

        <div className="mb-8 text-center">
          <Button
            color="primary"
            size="lg"
            className="transform bg-primary-500 px-8 py-6 text-lg font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-primary-600 hover:shadow-primary-500/40"
            startContent={<UserPlus size={24} />}
            onPress={handleOpenCreateModal}
          >
            Crear nuevo competidor
          </Button>
        </div>

        {/* Modal de creación */}
        <FighterFormModal
          isOpen={isCreateModalOpen}
          isLoading={isLoading}
          isUploadingImage={isUploading}
          initialValues={DEFAULT_FIGHTER}
          onSubmit={onCreateFighter}
          onClose={handleCloseCreateModal}
        />

        {/* Modal de edición */}
        <FighterFormModal
          isOpen={isEditModalOpen}
          initialValues={editingFighter ?? DEFAULT_FIGHTER}
          isLoading={isLoading}
          isUploadingImage={isUploading}
          onSubmit={onEditFighter}
          onClose={handleCloseEditModal}
          isEdit={true}
        />

        {/* Modal de Confirmación de Eliminación */}
        <DeleteConfirmationDialog
          isOpen={showDeleteConfirmation}
          title="Eliminar Competidor"
          message="¿Estás seguro de que deseas eliminar este competidor? Esta acción eliminará permanentemente todos sus datos y estadísticas."
          itemName={editingFighter?.name}
          onConfirm={onDeleteFighter}
          onCancel={handleCancelDelete}
          isLoading={isLoading}
        />

        {/* Modal de Imagen */}
        {selectedImageData && (
          <ImageModal
            isOpen={showImageModal}
            onClose={() => {
              setShowImageModal(false);
              setSelectedImageData(null);
            }}
            imageUrl={selectedImageData.url}
            fighterName={selectedImageData.name}
            fighterAlias={selectedImageData.alias}
          />
        )}

        <Filters filters={filters} onChange={handleFiltersChange} />

        {filteredFighters.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredFighters.map(fighter => (
              <FighterItem
                key={fighter.id}
                fighter={fighter}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteFighter}
                onImageClick={handleImageClick}
              />
            ))}
          </div>
        ) : (
          <Empty clearFilters={handleClearFilters} />
        )}

        {error && (
          <Alert
            color="danger"
            description={error}
            isVisible={true}
            title="Error"
            variant="faded"
          />
        )}
      </div>
    </section>
  );
};

export default FighterScreen;
