import React from 'react';
import { Button } from '@heroui/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Props {
  onBack?: () => void;
  onNext?: () => void;
  canProceed: boolean;
}

const DeviceControlNavigation: React.FC<Props> = ({
  canProceed,
  onBack,
  onNext,
}) => {
  const className =
    onBack && onNext ? 'flex justify-between my-6' : 'flex justify-end my-6';

  return (
    <div className={className}>
      {onBack && (
        <Button
          variant="bordered"
          size="lg"
          className="border-danger-500 text-danger-500 hover:bg-danger-500 hover:text-white"
          startContent={<ArrowLeft size={20} />}
          onPress={onBack}
        >
          Atrás
        </Button>
      )}

      <Button
        color="danger"
        size="lg"
        className="bg-danger-500 hover:bg-danger-600"
        endContent={<ArrowRight size={20} />}
        onPress={onNext}
        isDisabled={!canProceed}
      >
        Siguiente
      </Button>
    </div>
  );
};

export default DeviceControlNavigation;
