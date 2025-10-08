import { Clock } from 'lucide-react';
import useBattleStore from '@features/battle-arena/stores/useBattleStore';
import { Input } from '@heroui/react';

const InputTimeByRounds: React.FC = () => {
  const battleConfig = useBattleStore(state => state.battleConfig);
  const updateBattleConfig = useBattleStore(state => state.updateBattleConfig);

  if (battleConfig.mode !== 'time') return null;

  const duration = battleConfig.roundDuration ?? 0;

  const handleMinutesChange = (value: string) => {
    const minutes = parseInt(value) || 0;
    const currentSeconds = duration % 60;
    const newTotalDuration = minutes * 60 + currentSeconds;
    updateBattleConfig({ roundDuration: newTotalDuration });
  };

  const handleSecondsChange = (value: string) => {
    const seconds = parseInt(value) || 0;
    const currentMinutes = Math.floor(duration / 60);
    const newTotalDuration = currentMinutes * 60 + seconds;
    updateBattleConfig({ roundDuration: newTotalDuration });
  };

  const displayMinutes = Math.floor(duration / 60);
  const displaySeconds = duration % 60;

  return (
    <div className="min-w-[240px] flex-1">
      <h4 className="mb-2 flex items-center gap-2 text-lg font-semibold text-white">
        <Clock size={18} />
        Tiempo por ronda
      </h4>

      <div className="flex items-end gap-2">
        <div className="flex flex-col">
          <label className="mb-1 text-xs text-white">Minutos</label>
          <Input
            type="number"
            min={0}
            value={displayMinutes.toString()}
            onValueChange={handleMinutesChange}
            className="w-16"
            classNames={{
              input: '!text-white text-lg',
              label: '!text-white',
              inputWrapper:
                'bg-zinc-700 border-zinc-600 !bg-zinc-700 !border-zinc-600 !focus:bg-zinc-700 !focus:border-zinc-600 !hover:bg-zinc-700 !hover:border-zinc-600',
            }}
          />
        </div>

        <span className="mb-2 text-white">:</span>

        <div className="flex flex-col">
          <label className="mb-1 text-xs text-white">Segundos</label>
          <Input
            type="number"
            min={0}
            max={60}
            value={displaySeconds.toString()}
            onValueChange={handleSecondsChange}
            className="w-16"
            classNames={{
              input: '!text-white text-lg',
              label: '!text-white',
              inputWrapper:
                'bg-zinc-700 border-zinc-600 !bg-zinc-700 !border-zinc-600 !focus:bg-zinc-700 !focus:border-zinc-600 !hover:bg-zinc-700 !hover:border-zinc-600',
            }}
          />
        </div>
        <span className="mb-2 text-zinc-400">(mm:ss)</span>
      </div>
    </div>
  );
};

export default InputTimeByRounds;
