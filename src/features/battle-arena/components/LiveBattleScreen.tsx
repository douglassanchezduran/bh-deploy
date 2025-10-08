import React, { useRef } from 'react';

import { useBLEStore } from '@stores/useBLEStore';
import useBattleStore from '../stores/useBattleStore';

import {
  BattleHeader,
  BattleTimer,
  BattleActions,
  CompetitorPanel,
  BroadcastControls,
} from './live-battle/components';
import { useBattleTimer, useBattleStats } from './live-battle/hooks';

interface Props {
  onFinish: () => void;
  onCancel: () => void;
}

const LiveBattleScreen: React.FC<Props> = ({ onFinish, onCancel }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Battle Store
  const competitor1 = useBattleStore(state => state.competitor1);
  const competitor2 = useBattleStore(state => state.competitor2);
  const battleConfig = useBattleStore(state => state.battleConfig);

  // BLE Store
  const combatEvents = useBLEStore(state => state.combatEvents);
  const getCompetitor1Events = useBLEStore(state => state.getCompetitor1Events);
  const getCompetitor2Events = useBLEStore(state => state.getCompetitor2Events);

  // Custom hooks
  const {
    isActive,
    isPaused,
    currentRound,
    timeLeft,
    isBattleFinished,
    handleStart,
    handlePause,
    handleStop,
    handleNextRound,
    handleResetRound,
    handleFinishBattle,
    canAdvanceToNextRound,
  } = useBattleTimer();

  const { competitor1Stats, competitor2Stats } = useBattleStats({
    combatEvents,
    getCompetitor1Events,
    getCompetitor2Events,
  });

  // Scroll al montar el componente
  React.useEffect(() => {
    if (cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-6">
      <div className="mx-auto max-w-7xl">
        <BattleHeader />

        <BattleTimer
          timeLeft={timeLeft}
          currentRound={currentRound}
          totalRounds={battleConfig.rounds}
          roundDuration={battleConfig.roundDuration}
          battleMode={battleConfig.mode}
          isActive={isActive}
          isPaused={isPaused}
          isBattleFinished={isBattleFinished}
          onStart={handleStart}
          onPause={handlePause}
          onStop={handleStop}
          onFinishBattle={handleFinishBattle}
          onNextRound={handleNextRound}
          onResetRound={handleResetRound}
          canAdvanceToNextRound={canAdvanceToNextRound}
        />

        {/* Broadcast Section */}
        <div className="mb-8 w-full">
          <BroadcastControls
            currentRound={currentRound}
            totalRounds={battleConfig.rounds}
          />
        </div>

        {/* Competitors Grid */}
        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <CompetitorPanel
            competitor={competitor1}
            stats={competitor1Stats}
            events={getCompetitor1Events()}
            isCompetitor1={true}
            teamColor="red"
          />

          <CompetitorPanel
            competitor={competitor2}
            stats={competitor2Stats}
            events={getCompetitor2Events()}
            isCompetitor1={false}
            teamColor="blue"
          />
        </div>

        <BattleActions onFinish={onFinish} onCancel={onCancel} />
      </div>
    </div>
  );
};

export default LiveBattleScreen;
