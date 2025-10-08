import React, { useState, useCallback } from 'react';
import { Card, CardBody, Select, SelectItem, Input } from '@heroui/react';
import { Clock, Target } from 'lucide-react';

interface Props {
  onConfigurationChange: (config: BattleConfig) => void;
}

export interface BattleConfig {
  mode: 'time' | 'rounds';
  rounds: number;
  roundDuration?: number; // Solo para modo "time"
}

const BattleConfiguration: React.FC<Props> = ({ onConfigurationChange }) => {
  const [battleMode, setBattleMode] = useState<'time' | 'rounds'>('time');
  const [rounds, setRounds] = useState<number>(3);
  const [roundDuration, setRoundDuration] = useState<number>(60);

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

  const handleModeChange = (keys: any) => {
    // Convertir la selección al formato esperado
    const selectedMode =
      keys === 'time' || keys === 'rounds'
        ? keys
        : ((keys.currentKey || keys.anchorKey || Array.from(keys)[0]) as
            | 'time'
            | 'rounds');
    setBattleMode(selectedMode);
    updateConfiguration(selectedMode, rounds, roundDuration);
  };

  const handleRoundsChange = (value: string) => {
    const newRounds = parseInt(value) || 1;
    if (newRounds >= 1 && newRounds <= 20) {
      setRounds(newRounds);
      updateConfiguration(battleMode, newRounds, roundDuration);
    }
  };

  const updateConfiguration = useCallback(
    (mode: 'time' | 'rounds', roundsValue: number, durationValue: number) => {
      const config: BattleConfig = {
        mode,
        rounds: roundsValue,
        ...(mode === 'time' && { roundDuration: durationValue }),
      };
      onConfigurationChange(config);
    },
    [onConfigurationChange],
  );

  const isConfigurationValid = () => {
    if (battleMode === 'time') {
      return (
        rounds >= 1 &&
        rounds <= 20 &&
        roundDuration >= 30 &&
        roundDuration <= 600
      );
    } else {
      return rounds >= 1 && rounds <= 20;
    }
  };

  // Initialize configuration on mount
  React.useEffect(() => {
    updateConfiguration(battleMode, rounds, roundDuration);
  }, [battleMode, rounds, roundDuration, updateConfiguration]);

  return (
    <Card className="mb-8 border border-zinc-700/50 bg-zinc-800/50 backdrop-blur-sm">
      <CardBody className="p-8">
        {/* Configuración principal en una sola fila */}
        <div className="mb-8">
          <div className="flex w-full flex-col items-end gap-6 md:flex-row md:gap-8">
            {/* Modo de entrenamiento */}
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
            {/* Rondas */}
            <div className="min-w-[180px] flex-1">
              <h4 className="mb-2 flex items-center gap-2 text-lg font-semibold text-white">
                <Clock size={18} />
                Rondas
              </h4>
              <Input
                type="number"
                label="Número de Rondas (1-20)"
                value={rounds.toString()}
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
            {/* Tiempo por ronda */}
            {battleMode === 'time' && (
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
                      value={Math.floor(roundDuration / 60).toString()}
                      onValueChange={minStr => {
                        const min = parseInt(minStr) || 0;
                        let sec = roundDuration % 60;
                        let total = min * 60 + sec;
                        if (total < 30) {
                          sec = 30 - min * 60;
                          if (sec < 0) sec = 0;
                          total = min * 60 + sec;
                        }
                        setRoundDuration(total);
                        updateConfiguration(battleMode, rounds, total);
                      }}
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
                      max={59}
                      value={(roundDuration % 60).toString()}
                      onValueChange={secStr => {
                        let sec = parseInt(secStr) || 0;
                        let min = Math.floor(roundDuration / 60);
                        if (sec >= 60) {
                          min = min + Math.floor(sec / 60);
                          sec = sec % 60;
                        }
                        let total = min * 60 + sec;
                        if (total < 30) {
                          if (min === 0) {
                            sec = 30;
                          } else {
                            sec = 30 - min * 60;
                            if (sec < 0) sec = 0;
                          }
                          total = min * 60 + sec;
                        }
                        setRoundDuration(total);
                        updateConfiguration(battleMode, rounds, total);
                      }}
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
            )}
          </div>
        </div>

        {/* Resumen de configuración */}
        <Card className="mb-8 border border-dashed border-zinc-600/30 bg-zinc-700/30">
          <CardBody className="p-6">
            <h4 className="mb-4 text-lg font-bold text-white">
              Resumen de configuración
            </h4>
            <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
              <div>
                <span className="text-zinc-400">Modo: </span>
                <span className="font-medium text-white">
                  {battleMode === 'time' ? 'Por tiempo' : 'Por rondas'}
                </span>
              </div>
              <div>
                <span className="text-zinc-400">Rondas: </span>
                <span className="font-medium text-white">{rounds}</span>
              </div>
              {battleMode === 'time' && (
                <div>
                  <span className="text-zinc-400">Duración por ronda: </span>
                  <span className="font-medium text-white">
                    {roundDuration} segundos
                  </span>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Mensaje de validación */}
        {!isConfigurationValid() && (
          <Card className="mb-6 border border-warning-500/30 bg-warning-500/10">
            <CardBody className="p-4">
              <div className="flex items-center space-x-3">
                <Target size={20} className="text-warning-500" />
                <div>
                  <p className="font-medium text-warning-400">
                    Configuración incompleta
                  </p>
                  <p className="text-sm text-zinc-400">
                    {battleMode === 'time'
                      ? 'Asegúrate de que las rondas estén entre 1-20 y la duración entre 1-10 minutos'
                      : 'Asegúrate de que las rondas estén entre 1-20'}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
      </CardBody>
    </Card>
  );
};

export default BattleConfiguration;
