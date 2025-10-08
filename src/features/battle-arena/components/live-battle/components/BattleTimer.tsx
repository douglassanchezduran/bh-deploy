import React from 'react';
import { Card, CardBody, Button, Progress, Chip, Tooltip } from '@heroui/react';
import {
  Play,
  Pause,
  Square,
  Timer,
  SkipForward,
  RotateCcw,
} from 'lucide-react';

interface Props {
  timeLeft: number;
  currentRound: number;
  totalRounds: number;
  roundDuration?: number;
  battleMode: 'time' | 'rounds';
  isActive: boolean;
  isPaused: boolean;
  isBattleFinished?: boolean;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onFinishBattle?: () => void;
  onNextRound?: () => void;
  onResetRound?: () => void;
  canAdvanceToNextRound?: boolean;
}

const BattleTimer: React.FC<Props> = ({
  timeLeft,
  currentRound,
  totalRounds,
  roundDuration,
  battleMode,
  isActive,
  isPaused,
  isBattleFinished = false,
  onStart,
  onPause,
  onStop,
  onFinishBattle,
  onNextRound,
  onResetRound,
  canAdvanceToNextRound = true,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Determinar el modo de batalla basado en la configuración
  const isTimedBattle = battleMode === 'time';
  const canAdvanceRound = currentRound < totalRounds;

  // Siempre mostrar el botón si podemos avanzar rondas, pero deshabilitarlo según condiciones
  const shouldShowNextRoundButton = canAdvanceRound;
  const shouldEnableNextRoundButton = isTimedBattle || canAdvanceToNextRound;

  return (
    <Card className="mb-8 border border-zinc-600/50 bg-zinc-900/50">
      <CardBody className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="text-center">
            {isTimedBattle ? (
              <div className="mb-2 text-4xl font-bold text-white">
                {formatTime(timeLeft)}
              </div>
            ) : (
              <div className="mb-2 text-4xl font-bold text-white">
                Ronda {currentRound}
              </div>
            )}
            <div className="text-sm text-zinc-400">
              {isTimedBattle
                ? `Ronda ${currentRound} de ${totalRounds}`
                : `${currentRound} de ${totalRounds} rondas`}
            </div>
          </div>

          <div className="flex gap-4">
            {isTimedBattle ? (
              // Controles de batalla cronometrada
              <>
                {!isActive ? (
                  <Button
                    color="success"
                    size="lg"
                    startContent={<Play size={20} />}
                    onPress={onStart}
                  >
                    Iniciar
                  </Button>
                ) : (
                  <Button
                    color="warning"
                    size="lg"
                    startContent={
                      isPaused ? <Play size={20} /> : <Pause size={20} />
                    }
                    onPress={onPause}
                  >
                    {isPaused ? 'Reanudar' : 'Pausar'}
                  </Button>
                )}

                <Button
                  color="danger"
                  variant="bordered"
                  size="lg"
                  startContent={<Square size={20} />}
                  onPress={onStop}
                >
                  Detener
                </Button>
              </>
            ) : (
              // Controles de ronda manual
              <>
                {onResetRound && (
                  <Button
                    color="secondary"
                    variant="bordered"
                    size="lg"
                    startContent={<RotateCcw size={20} />}
                    onPress={onResetRound}
                  >
                    Reiniciar Ronda
                  </Button>
                )}

                {onNextRound && shouldShowNextRoundButton && (
                  <Tooltip
                    content={
                      !shouldEnableNextRoundButton && !isTimedBattle
                        ? 'Ambos competidores deben tener al menos un evento registrado para avanzar'
                        : 'Avanzar a la siguiente ronda'
                    }
                    isDisabled={shouldEnableNextRoundButton}
                  >
                    <Button
                      color="primary"
                      size="lg"
                      startContent={<SkipForward size={20} />}
                      onPress={onNextRound}
                      isDisabled={!shouldEnableNextRoundButton}
                    >
                      Siguiente Ronda
                    </Button>
                  </Tooltip>
                )}

                {isBattleFinished ? (
                  <Button
                    color="primary"
                    size="lg"
                    startContent={<Square size={20} />}
                    onPress={onFinishBattle}
                  >
                    Salir
                  </Button>
                ) : (
                  <Button
                    color="danger"
                    variant="bordered"
                    size="lg"
                    startContent={<Square size={20} />}
                    onPress={onStop}
                  >
                    Finalizar
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Barra de Progreso - Solo para batallas cronometradas */}
        {isTimedBattle && roundDuration && (
          <Progress
            value={((roundDuration - timeLeft) / roundDuration) * 100}
            color="primary"
            className="mb-4"
          />
        )}

        {/* Barra de Progreso de Ronda - Para rondas manuales */}
        {!isTimedBattle && (
          <Progress
            value={(currentRound / totalRounds) * 100}
            color="secondary"
            className="mb-4"
            label={`Progreso del combate`}
          />
        )}

        {/* Estado de la Batalla */}
        <div className="flex justify-center">
          <Chip
            color={
              isBattleFinished
                ? 'secondary'
                : isTimedBattle
                  ? isActive
                    ? isPaused
                      ? 'warning'
                      : 'success'
                    : 'default'
                  : currentRound <= totalRounds
                    ? 'success'
                    : 'default'
            }
            variant="flat"
            startContent={<Timer size={16} />}
          >
            {isBattleFinished
              ? 'Combate Finalizado'
              : isTimedBattle
                ? isActive
                  ? isPaused
                    ? 'Pausado'
                    : 'En Progreso'
                  : 'Detenido'
                : currentRound <= totalRounds
                  ? `Ronda ${currentRound} Activa`
                  : 'Combate Finalizado'}
          </Chip>
        </div>
      </CardBody>
    </Card>
  );
};

export default BattleTimer;
