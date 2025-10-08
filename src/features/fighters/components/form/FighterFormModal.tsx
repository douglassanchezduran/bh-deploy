import React, { useEffect, useState } from 'react';

import {
  Form,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  SelectedItems,
} from '@heroui/react';
import { UserPlus, Upload, Target, Ruler, Weight, X, Save } from 'lucide-react';

import ImageUpload from '@components/image-upload/ImageUpload';

import { nationalities } from '../filters/filterData';
import { Fighter } from '../../models/Fighter';

const renderNationalityValue = (selected: SelectedItems<object>) => {
  const selectedKey = selected[0]?.key;
  if (!selectedKey) return null;

  const nationality = nationalities.find(n => n.key === selectedKey);
  if (!nationality) return null;

  return (
    <span className="flex items-center">
      <img
        src={nationality.icon}
        alt={`${nationality.label} flag`}
        className="mr-2 inline-block h-5 w-7 rounded-sm object-contain"
        aria-hidden="true"
      />
      <span>{nationality.label}</span>
    </span>
  );
};

interface Props {
  initialValues: Partial<Fighter>;
  isOpen: boolean;
  isEdit?: boolean;
  isLoading?: boolean;
  isUploadingImage?: boolean;
  onSubmit: (fighter: Partial<Fighter>, photoFile: File | null) => void;
  onClose: () => void;
}

const FighterFormModal: React.FC<Props> = ({
  isOpen,
  initialValues,
  isLoading = false,
  isUploadingImage = false,
  isEdit,
  onSubmit,
  onClose,
}) => {
  const [form, setForm] = useState<Partial<Fighter>>(initialValues);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // Actualizar el estado del formulario cuando cambien los initialValues
  useEffect(() => {
    if (initialValues) {
      setForm(initialValues);
    }
  }, [initialValues]);

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (file: File | null) => {
    setPhotoFile(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    Object.fromEntries(new FormData(e.currentTarget));
    onSubmit(form, photoFile);
  };

  const handleClose = () => {
    if (isLoading || isUploadingImage) return;

    setForm({
      name: '',
      height: 150,
      weight: 50,
      photoUrl: '',
      country: '',
    });
    setPhotoFile(null);

    if (onClose) onClose();
  };

  const getLoadingMessage = () => {
    if (isUploadingImage) return 'Subiendo imagen...';
    if (isLoading) return isEdit ? 'Editando...' : 'Guardando...';
    return isEdit ? 'Editar competidor' : 'Crear nuevo competidor';
  };
  const loadingMessage = getLoadingMessage();

  const titleForm = isEdit ? 'Editar competidor' : 'Crear competidor';
  const subtitleForm = isEdit
    ? 'Edita un competidor'
    : 'Agrega un nuevo competidor';

  const isCreating = isLoading || isUploadingImage;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="3xl"
      isDismissable={!isLoading || !isUploadingImage}
      isKeyboardDismissDisabled={isLoading || isUploadingImage}
      scrollBehavior="inside"
      classNames={{
        base: 'bg-zinc-900 border border-zinc-700',
        header: 'border-b border-zinc-700',
        body: 'py-6',
        footer: 'border-t border-zinc-700',
      }}
    >
      <Form onSubmit={handleSubmit}>
        <ModalContent>
          <ModalHeader className="flex items-center gap-3 text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500">
              <UserPlus size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{titleForm}</h3>
              <p className="text-sm font-normal text-zinc-400">
                {subtitleForm}
              </p>
            </div>
          </ModalHeader>

          <ModalBody>
            <div className="space-y-6">
              {/* Imagen del Competidor */}
              <div>
                <h4 className="mb-4 flex items-center gap-2 font-semibold text-white">
                  <Upload size={16} />
                  Imagen del Competidor
                </h4>
                <ImageUpload
                  currentImage={form.photoUrl ?? ''}
                  onImageChange={handleImageChange}
                />
              </div>

              {/* Información Personal */}
              <div>
                <h4 className="mb-4 flex items-center gap-2 font-semibold text-white">
                  <UserPlus size={16} />
                  Información Personal
                </h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input
                    label="Nombre"
                    labelPlacement="outside"
                    placeholder="Nombre del competidor"
                    errorMessage="El nombre del competidor es obligatorio"
                    name="name"
                    type="text"
                    value={form.name}
                    onValueChange={value => handleInputChange('name', value)}
                    isRequired
                    classNames={{ label: '!text-white' }}
                  />
                  <Select
                    label="Nacionalidad"
                    labelPlacement="outside"
                    aria-label="Seleccionar nacionalidad"
                    placeholder="Seleccionar país"
                    errorMessage="La nacionalidad es obligatoria"
                    name="country"
                    selectedKeys={
                      form.country?.toLowerCase()
                        ? [form.country?.toLocaleLowerCase()]
                        : []
                    }
                    onSelectionChange={keys => {
                      const selected = Array.from(keys)[0] as string;
                      handleInputChange('country', selected);
                    }}
                    isRequired
                    renderValue={renderNationalityValue}
                    classNames={{ label: '!text-white' }}
                  >
                    {nationalities.map(nationality => (
                      <SelectItem
                        key={nationality.key}
                        textValue={nationality.label}
                        aria-label={nationality.label}
                      >
                        <img
                          src={nationality.icon}
                          alt={`${nationality.label} flag`}
                          className="mr-2 inline-block h-5 w-7 rounded-sm object-contain"
                          aria-hidden="true"
                        />
                        {nationality.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </div>

              {/* Datos Físicos */}
              <div>
                <h4 className="mb-4 flex items-center gap-2 font-semibold text-white">
                  <Target size={16} />
                  Datos Físicos
                </h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Input
                    label="Altura (cm)"
                    labelPlacement="outside"
                    placeholder="175"
                    type="number"
                    name="height"
                    errorMessage="La altura es obligatoria"
                    min={150}
                    value={form.height?.toString()}
                    onValueChange={value => handleInputChange('height', value)}
                    isRequired
                    startContent={<Ruler size={16} className="text-zinc-400" />}
                    classNames={{ label: '!text-white' }}
                  />
                  <Input
                    label="Peso (kg)"
                    labelPlacement="outside"
                    placeholder="70"
                    type="number"
                    name="weight"
                    errorMessage="El peso es obligatorio"
                    min={50}
                    value={form.weight?.toString()}
                    onValueChange={value => handleInputChange('weight', value)}
                    isRequired
                    startContent={
                      <Weight size={16} className="text-zinc-400" />
                    }
                    classNames={{ label: '!text-white' }}
                  />
                </div>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="bordered"
              onPress={handleClose}
              className="border-zinc-600 text-zinc-300 hover:border-white hover:text-white"
              startContent={<X size={16} />}
              isDisabled={isCreating}
            >
              Cancelar
            </Button>

            <Button
              color="primary"
              // isLoading={isCreating}
              className="bg-primary-500 hover:bg-primary-600"
              type="submit"
              startContent={!isLoading && <Save size={16} />}
            >
              {loadingMessage}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Form>
    </Modal>
  );
};

export default FighterFormModal;
