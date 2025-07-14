import { Edit, Trash2 } from 'lucide-react';
import { Button, Card, CardBody } from '@heroui/react';

import { Fighter } from '../models/Fighter';
import FighterItemHeader from './FighterItemHeader';
import FighterItemMainData from './FighterItemMainData';
import FighterItemPhysicalData from './FighterItemPhysicalData';

interface Props {
  fighter: Fighter;
  isEditing?: boolean;
  onEdit: (fighter: Fighter) => void;
  onDelete: (fighter: Fighter) => void;
  onImageClick: (fighter: Fighter) => void;
}

const FighterItem: React.FC<Props> = ({
  fighter,
  isEditing,
  onEdit,
  onDelete,
  onImageClick,
}) => {
  const handleEdit = () => onEdit(fighter);
  const handleDelete = () => onDelete(fighter);
  const handleImageClick = () => onImageClick(fighter);

  return (
    <Card
      key={fighter.id}
      className="group transform border border-zinc-700/50 bg-zinc-800/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-primary-500/50 hover:bg-zinc-800/70 hover:shadow-xl hover:shadow-primary-500/10"
    >
      <CardBody className="p-8">
        {/* Header Section - Imagen */}
        <div className="mb-6 flex items-start gap-6">
          <FighterItemHeader
            fighter={fighter}
            onClickImage={handleImageClick}
          />

          {/* Información Principal */}
          <FighterItemMainData fighter={fighter} />
        </div>

        {/* Datos Físicos */}
        <FighterItemPhysicalData fighter={fighter} />

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            color="primary"
            variant="solid"
            size="sm"
            className="flex-1 font-medium"
            startContent={<Edit size={16} />}
            isDisabled={isEditing}
            onPress={handleEdit}
          >
            Editar
          </Button>
          <Button
            color="danger"
            variant="bordered"
            size="sm"
            className="flex-1 border-danger-500 text-danger-500 hover:bg-danger-500 hover:text-white"
            startContent={<Trash2 size={16} />}
            isDisabled={isEditing}
            onPress={handleDelete}
          >
            Borrar
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default FighterItem;
