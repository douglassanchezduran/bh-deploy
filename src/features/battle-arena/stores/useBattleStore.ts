import { create } from 'zustand';

import { devErrorLog, devInfoLog } from '@utils/devLog';
import { BattleConfig, Competitor, BleDevice } from '../types';
import { useBLEStore } from '../../../shared/stores/useBLEStore';

export type BattleStep = 'setup' | 'confirmation' | 'live';

interface State {
  currentStep: BattleStep;
  battleConfig: BattleConfig;
  competitor1: Competitor | null;
  competitor2: Competitor | null;
  competitor1Devices: BleDevice[];
  competitor2Devices: BleDevice[];
}

interface Actions {
  isConfigurationValid: () => boolean;
  setCurrentStep: (step: BattleStep) => void;
  updateBattleConfig: (config: Partial<BattleConfig>) => void;
  setCompetitor1: (competitor: Competitor | null) => void;
  setCompetitor2: (competitor: Competitor | null) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Gestión de dispositivos por competidor
  addDeviceToCompetitor1: (device: BleDevice) => void;
  removeDeviceFromCompetitor1: (deviceId: string) => void;
  addDeviceToCompetitor2: (device: BleDevice) => void;
  removeDeviceFromCompetitor2: (deviceId: string) => void;
  toggleDeviceForCompetitor1: (device: BleDevice) => void;
  toggleDeviceForCompetitor2: (device: BleDevice) => void;
  setCompetitor1Devices: (devices: BleDevice[]) => void;
  setCompetitor2Devices: (devices: BleDevice[]) => void;
  clearAllDevices: () => void;

  // Selectores útiles
  getCompetitor1Devices: () => BleDevice[];
  getCompetitor2Devices: () => BleDevice[];
  isDeviceAssignedToCompetitor1: (deviceId: string) => boolean;
  isDeviceAssignedToCompetitor2: (deviceId: string) => boolean;
  getDeviceOwner: (deviceId: string) => 'competitor1' | 'competitor2' | null;

  // Reset completo
  resetBattle: () => Promise<void>;
}

const useBattleStore = create<State & Actions>((set, get) => ({
  // --- ESTADO INICIAL ---
  currentStep: 'setup',
  battleConfig: {
    mode: 'time',
    rounds: 1,
    roundDuration: 30,
  },
  competitor1: null,
  competitor2: null,
  competitor1Devices: [],
  competitor2Devices: [],

  // --- PROPIEDADES COMPUTADAS ---
  isConfigurationValid: () => {
    const battleConfig = get().battleConfig;

    if (battleConfig.mode === 'rounds') {
      return battleConfig.rounds >= 1 && battleConfig.rounds <= 20;
    }

    if (battleConfig.roundDuration === undefined) {
      return false;
    }

    return (
      battleConfig.rounds >= 1 &&
      battleConfig.rounds <= 20 &&
      battleConfig.roundDuration >= 30 &&
      battleConfig.roundDuration <= 600
    );
  },

  // --- ACCIONES ---
  setCurrentStep: (step: BattleStep) => set({ currentStep: step }),

  updateBattleConfig: (config: Partial<BattleConfig>) =>
    set(state => ({ battleConfig: { ...state.battleConfig, ...config } })),

  nextStep: () =>
    set(state => {
      if (state.currentStep === 'setup') return { currentStep: 'confirmation' };
      if (state.currentStep === 'confirmation') return { currentStep: 'live' };
      return state;
    }),

  prevStep: () =>
    set(state => {
      if (state.currentStep === 'confirmation') return { currentStep: 'setup' };
      if (state.currentStep === 'live') return { currentStep: 'confirmation' };
      return state;
    }),

  setCompetitor1: (competitor: Competitor | null) =>
    set({ competitor1: competitor }),

  setCompetitor2: (competitor: Competitor | null) =>
    set({ competitor2: competitor }),

  addDeviceToCompetitor1: (device: BleDevice) =>
    set(state => ({
      competitor1Devices: [...state.competitor1Devices, device],
    })),

  removeDeviceFromCompetitor1: (deviceId: string) =>
    set(state => ({
      competitor1Devices: state.competitor1Devices.filter(
        device => device.id !== deviceId,
      ),
    })),

  addDeviceToCompetitor2: (device: BleDevice) =>
    set(state => ({
      competitor2Devices: [...state.competitor2Devices, device],
    })),

  removeDeviceFromCompetitor2: (deviceId: string) =>
    set(state => ({
      competitor2Devices: state.competitor2Devices.filter(
        device => device.id !== deviceId,
      ),
    })),

  toggleDeviceForCompetitor1: (device: BleDevice) =>
    set(state => {
      if (state.competitor1Devices.find(d => d.id === device.id)) {
        return {
          competitor1Devices: state.competitor1Devices.filter(
            d => d.id !== device.id,
          ),
        };
      } else {
        return { competitor1Devices: [...state.competitor1Devices, device] };
      }
    }),

  toggleDeviceForCompetitor2: (device: BleDevice) =>
    set(state => {
      if (state.competitor2Devices.find(d => d.id === device.id)) {
        return {
          competitor2Devices: state.competitor2Devices.filter(
            d => d.id !== device.id,
          ),
        };
      } else {
        return { competitor2Devices: [...state.competitor2Devices, device] };
      }
    }),

  setCompetitor1Devices: (devices: BleDevice[]) =>
    set({ competitor1Devices: devices }),

  setCompetitor2Devices: (devices: BleDevice[]) =>
    set({ competitor2Devices: devices }),

  clearAllDevices: () =>
    set({
      competitor1Devices: [],
      competitor2Devices: [],
    }),

  getCompetitor1Devices: () => get().competitor1Devices,

  getCompetitor2Devices: () => get().competitor2Devices,

  isDeviceAssignedToCompetitor1: (deviceId: string) =>
    get().competitor1Devices.find(device => device.id === deviceId) !==
    undefined,

  isDeviceAssignedToCompetitor2: (deviceId: string) =>
    get().competitor2Devices.find(device => device.id === deviceId) !==
    undefined,

  getDeviceOwner: (deviceId: string) => {
    if (get().competitor1Devices.find(device => device.id === deviceId)) {
      return 'competitor1';
    } else if (
      get().competitor2Devices.find(device => device.id === deviceId)
    ) {
      return 'competitor2';
    } else {
      return null;
    }
  },

  // Reset completo del estado de batalla
  resetBattle: async () => {
    devInfoLog('🔄 [useBattleStore] Reiniciando batalla completa...');

    try {
      // Reset del estado de batalla
      set({
        currentStep: 'setup',
        battleConfig: {
          mode: 'time',
          rounds: 1,
          roundDuration: 30,
        },
        competitor1: null,
        competitor2: null,
        competitor1Devices: [],
        competitor2Devices: [],
      });

      // Reset completo del sistema BLE
      await useBLEStore.getState().resetBLESystem();

      devInfoLog(
        '✅ [useBattleStore] Batalla y sistema BLE reiniciados exitosamente',
      );
    } catch (error) {
      devErrorLog(
        '❌ [useBattleStore] Error durante el reset completo:',
        error,
      );
      throw error;
    }
  },
}));

export default useBattleStore;
