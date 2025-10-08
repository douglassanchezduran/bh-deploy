import { Settings } from 'lucide-react';

import Header from '@components/Header';
import { BattleConfiguration } from './components/battle-configuration';
import { DeviceControl } from './components/device-control';

import { devErrorLog, devInfoLog, devSuccessLog } from '@utils/devLog';
import { useFighters } from '@features/fighters/hooks/useFighters';
import { useBLEStore } from '@stores/useBLEStore';

import DeviceSelectionManager from './components/device-control/DeviceSelectionManager';
import LiveBattleScreen from './components/LiveBattleScreen';
import DeviceControlNavigation from './components/device-control/DeviceControlNavigation';
import BattleConfirmation from './components/BattleConfirmation';
import useBattleStore from './stores/useBattleStore';
import { useWebSocketBroadcast } from '../../shared/hooks/useWebSocketBroadcast';

const BattleArenaScreen: React.FC = () => {
  const { fighters } = useFighters();
  const { broadcastViewChange } = useWebSocketBroadcast();
  const {
    currentStep,
    nextStep,
    prevStep,
    resetBattle,
    competitor1,
    competitor2,
    battleConfig,
    competitor1Devices,
    competitor2Devices,
  } = useBattleStore();

  // Estado BLE para verificar conexiones
  const connectedDevices = useBLEStore(state => state.connectedDevices);

  // Validaciones individuales
  const hasCompetitorsSelected = () => {
    return competitor1 !== null && competitor2 !== null;
  };

  const hasDevicesAssigned = () => {
    return competitor1Devices.length > 0 && competitor2Devices.length > 0;
  };

  const hasDevicesConnected = () => {
    const competitor1Connected = competitor1Devices.filter(device =>
      connectedDevices.includes(device.id),
    );
    const competitor2Connected = competitor2Devices.filter(device =>
      connectedDevices.includes(device.id),
    );
    return competitor1Connected.length > 0 && competitor2Connected.length > 0;
  };

  const hasBattleConfigComplete = () => {
    if (!battleConfig.mode || !battleConfig.rounds) return false;
    if (battleConfig.mode === 'time' && !battleConfig.roundDuration)
      return false;
    return true;
  };

  // Validación completa con logging
  const canProceedToNext = () => {
    devInfoLog('🔍 [Setup] Validando configuración para proceder...');

    if (!hasCompetitorsSelected()) {
      devErrorLog('❌ [Setup] Faltan competidores:', {
        competitor1: !!competitor1,
        competitor2: !!competitor2,
      });
      return false;
    }

    if (!hasDevicesAssigned()) {
      devErrorLog('❌ [Setup] Faltan dispositivos asignados:', {
        competitor1Devices: competitor1Devices.length,
        competitor2Devices: competitor2Devices.length,
      });
      return false;
    }

    if (!hasDevicesConnected()) {
      const competitor1Connected = competitor1Devices.filter(device =>
        connectedDevices.includes(device.id),
      );
      const competitor2Connected = competitor2Devices.filter(device =>
        connectedDevices.includes(device.id),
      );
      devErrorLog('❌ [Setup] Dispositivos no conectados:', {
        competitor1Connected: competitor1Connected.length,
        competitor2Connected: competitor2Connected.length,
        totalConnected: connectedDevices.length,
      });
      return false;
    }

    if (!hasBattleConfigComplete()) {
      devErrorLog(
        '❌ [Setup] Configuración de batalla incompleta:',
        battleConfig,
      );
      return false;
    }

    devSuccessLog('✅ [Setup] Configuración completa, puede proceder');
    return true;
  };

  const handleResetBattle = async () => {
    try {
      // Enviar mensaje WebSocket de finalización de combate
      await broadcastViewChange('combat_finished', {
        message: 'Combate finalizado con éxito',
        timestamp: new Date().toISOString(),
      });

      await resetBattle();
    } catch (error) {
      devErrorLog('❌ Error al finalizar combate:', error);
    }
  };

  const handleCancelBattle = async () => {
    // Enviar mensaje WebSocket de cancelación de combate
    try {
      await broadcastViewChange('combat_cancelled', {
        message: 'Combate cancelado por el usuario',
        timestamp: new Date().toISOString(),
      });

      // Volver al paso de confirmación
      prevStep();
    } catch (error) {
      devErrorLog('❌ Error al enviar mensaje de cancelación:', error);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-950 pt-8">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Header
          title="Arena de Combate"
          description="Selecciona los parámetros del combate."
          icon={<Settings size={32} className="text-white" />}
        />

        <div className="mb-8 text-center">
          {currentStep === 'setup' && (
            <>
              <BattleConfiguration />
              <DeviceControl fighters={fighters} />
              <DeviceSelectionManager />
              <DeviceControlNavigation
                onBack={undefined}
                onNext={nextStep}
                canProceed={canProceedToNext()}
              />
            </>
          )}

          {currentStep === 'confirmation' && (
            <>
              <BattleConfirmation onConfirm={nextStep} onCancel={prevStep} />
            </>
          )}

          {currentStep === 'live' && (
            <LiveBattleScreen
              onFinish={handleResetBattle}
              onCancel={handleCancelBattle}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default BattleArenaScreen;
