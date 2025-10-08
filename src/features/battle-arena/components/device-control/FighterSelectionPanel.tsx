import { Key } from 'react';
import { Autocomplete, AutocompleteItem, Avatar } from '@heroui/react';
import { Users } from 'lucide-react';

import { Fighter } from '@features/fighters/models/Fighter';
import useBattleStore from '@features/battle-arena/stores/useBattleStore';

import { Competitor, TeamColor } from '../../types';
import FighterCard from '../FighterCard';
import AlertSelectionFighter from './AlertSelectionFighter';

interface Props {
  team: TeamColor;
  fighters: Fighter[];
}

const FighterSelectionPanel: React.FC<Props> = ({ team, fighters }) => {
  const competitor1 = useBattleStore(state => state.competitor1);
  const competitor2 = useBattleStore(state => state.competitor2);
  const selectedCompetitor = team === 'red' ? competitor1 : competitor2;

  const teamName = team === 'red' ? 'Rojo' : 'Azul';
  const teamColor = team === 'red' ? 'red' : 'blue';
  const teamTextColor = `text-${teamColor}-400`;
  const teamBorderColor = `hover:border-${teamColor}-500 focus-within:border-${teamColor}-500`;

  const setCompetitor1 = useBattleStore(state => state.setCompetitor1);
  const setCompetitor2 = useBattleStore(state => state.setCompetitor2);
  const setCompetitor = team === 'red' ? setCompetitor1 : setCompetitor2;

  const handleSelectionChange = (key: Key | null) => {
    if (!key) return;

    const fighterData = fighters.find(f => f.id === key);
    if (!fighterData) {
      setCompetitor(null);
      return;
    }

    const newCompetitor: Competitor = {
      ...fighterData,
      team,
      devices: [],
    };
    setCompetitor(newCompetitor);
  };

  const handleClearSelection = () => {
    setCompetitor(null);
  };

  const opponentCompetitor = team === 'red' ? competitor2 : competitor1;
  const disabledKeys = opponentCompetitor ? [opponentCompetitor.id] : [];

  const cardColors = {
    red: {
      borderColor: 'border-red-500',
      bgColor: 'bg-red-500/10',
      shadowColor: 'shadow-red-500/50',
    },
    blue: {
      borderColor: 'border-blue-500',
      bgColor: 'bg-blue-500/10',
      shadowColor: 'shadow-blue-500/50',
    },
  };

  return (
    <div className="w-full">
      <h3
        className={`mb-4 flex items-center gap-2 text-lg font-bold ${teamTextColor}`}
      >
        <Users size={20} />
        Competidor {teamName}
      </h3>

      <Autocomplete
        label="Selecciona Competidor"
        placeholder="Buscar competidor..."
        selectedKey={selectedCompetitor?.id ?? null}
        onSelectionChange={handleSelectionChange}
        isDisabled={team === 'blue' && !competitor1}
        disabledKeys={disabledKeys}
        onClear={handleClearSelection}
        className="max-w-full"
        classNames={{
          base: 'max-w-full',
          listbox: 'bg-zinc-800',
          popoverContent: 'bg-zinc-800 border-zinc-700',
          endContentWrapper: 'text-zinc-400',
          clearButton: 'text-zinc-400',
          selectorButton: 'text-white',
        }}
        inputProps={{
          classNames: {
            label: '!text-white',
            input: '!text-white placeholder:!text-white',
            inputWrapper: `bg-zinc-700 border-zinc-600 ${teamBorderColor} hover:!bg-zinc-700 hover:!border-zinc-600 focus-within:!bg-zinc-700 focus-within:!border-zinc-600`,
          },
        }}
      >
        {fighters.map(fighter => (
          <AutocompleteItem
            key={fighter.id}
            className="text-white hover:bg-zinc-700 hover:text-white"
            startContent={
              <Avatar
                size="sm"
                src={fighter.photoUrl}
                className="flex-shrink-0"
              />
            }
          >
            {fighter.name}
          </AutocompleteItem>
        ))}
      </Autocomplete>

      {selectedCompetitor ? (
        <>
          <div className="my-8 flex justify-center">
            <FighterCard
              competitor={selectedCompetitor}
              teamColor={teamColor}
              {...cardColors[teamColor]}
            />
          </div>
        </>
      ) : (
        <div className="mt-8">
          <AlertSelectionFighter />
        </div>
      )}
    </div>
  );
};

export default FighterSelectionPanel;
