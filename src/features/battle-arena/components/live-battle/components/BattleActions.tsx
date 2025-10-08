import React from 'react';
import { Button } from '@heroui/react';

interface BattleActionsProps {
  onFinish: () => void;
  onCancel: () => void;
}

const BattleActions: React.FC<BattleActionsProps> = ({ onFinish, onCancel }) => {
  return (
    <div className="flex justify-center gap-4">
      <Button color="primary" size="lg" onPress={onFinish}>
        Finalizar Combate
      </Button>

      <Button
        color="danger"
        variant="bordered"
        size="lg"
        onPress={onCancel}
      >
        Cancelar Combate
      </Button>
    </div>
  );
};

export default BattleActions;
