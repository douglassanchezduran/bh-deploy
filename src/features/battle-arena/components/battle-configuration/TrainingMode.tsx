import { Select, SelectItem, SharedSelection } from '@heroui/react';
import { Target } from 'lucide-react';

import useBattleStore from '../../stores/useBattleStore';
import { BattleMode } from '../../types';

const battleModes = [
  {
    key: 'time',
    label: 'Por tiempo',
    description: 'Combate con duración específica por ronda',
  },
  {
    key: 'rounds',
    label: 'Por rondas',
    description: 'Combate hasta completar todas las rondas',
  },
];

const TrainingMode: React.FC = () => {
  const battleMode = useBattleStore(state => state.battleConfig.mode);
  const updateBattleConfig = useBattleStore(state => state.updateBattleConfig);

  const handleModeChange = (keys: SharedSelection) => {
    const newMode = (keys.currentKey as BattleMode) ?? 'time';
    updateBattleConfig({ mode: newMode });
  };

  return (
    <div className="min-w-[220px] flex-1">
      <h3 className="mb-2 flex items-center gap-2 text-xl font-bold text-white">
        <Target size={20} />
        Modo de entrenamiento
      </h3>

      <Select
        label="Selecciona el modo de combate"
        aria-label="Seleccionar modo de combate"
        selectedKeys={[battleMode]}
        onSelectionChange={handleModeChange}
        className="w-full"
        classNames={{
          label: '!text-white',
          trigger:
            'bg-zinc-700 border-zinc-600 !bg-zinc-700 !border-zinc-600 !focus:bg-zinc-700 !focus:border-zinc-600 !hover:bg-zinc-700 !hover:border-zinc-600',
          value: '!text-white',
          selectorIcon: '!text-white',
          listbox: 'bg-zinc-800',
          popoverContent: 'bg-zinc-800 border-zinc-700',
        }}
      >
        {battleModes.map(mode => (
          <SelectItem
            key={mode.key}
            className="text-white hover:bg-zinc-700"
            description={mode.description}
          >
            {mode.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};

export default TrainingMode;
