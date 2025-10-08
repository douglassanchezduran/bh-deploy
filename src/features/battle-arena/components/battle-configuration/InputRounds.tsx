import { Input } from '@heroui/react';
import { Clock } from 'lucide-react';

import useBattleStore from '@features/battle-arena/stores/useBattleStore';

const InputRounds: React.FC = () => {
  const battleRounds = useBattleStore(state => state.battleConfig.rounds);
  const updateBattleConfig = useBattleStore(state => state.updateBattleConfig);

  const handleRoundsChange = (value: string) => {
    const newRounds = parseInt(value) || 1;
    if (newRounds >= 1 && newRounds <= 20) {
      updateBattleConfig({ rounds: newRounds });
    }
  };

  return (
    <div className="min-w-[180px] flex-1">
      <h4 className="mb-2 flex items-center gap-2 text-lg font-semibold text-white">
        <Clock size={18} />
        Rondas
      </h4>

      <Input
        type="number"
        label="Número de Rondas (1-20)"
        value={battleRounds.toString()}
        onValueChange={handleRoundsChange}
        min={1}
        max={20}
        className="w-full"
        classNames={{
          input: '!text-white text-lg',
          label: '!text-white',
          inputWrapper:
            'bg-zinc-700 border-zinc-600 !bg-zinc-700 !border-zinc-600 !focus:bg-zinc-700 !focus:border-zinc-600 !hover:bg-zinc-700 !hover:border-zinc-600',
        }}
        endContent={<div className="text-sm text-zinc-400">rondas</div>}
      />
    </div>
  );
};

export default InputRounds;
