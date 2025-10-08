import { Card, CardBody } from '@heroui/react';

import AlertValidateConfiguration from './AlertValidateConfiguration';
import InputRounds from './InputRounds';
import InputTimeByRounds from './InputTimeByRounds';
import SummaryConfiguration from './SummaryConfiguration';
import TrainingMode from './TrainingMode';

const BattleConfiguration: React.FC = () => {
  return (
    <Card className="mb-8 border border-zinc-700/50 bg-zinc-800/50 backdrop-blur-sm">
      <CardBody className="p-8">
        <div className="mb-8">
          <div className="flex w-full flex-col items-end gap-6 md:flex-row md:gap-8">
            <TrainingMode />
            <InputRounds />
            <InputTimeByRounds />
          </div>
        </div>

        <SummaryConfiguration />

        <AlertValidateConfiguration />
      </CardBody>
    </Card>
  );
};

export default BattleConfiguration;
