import { Fighter } from '@features/fighters/models/Fighter';

export type BattleMode = 'time' | 'rounds';
export type TeamColor = 'red' | 'blue';

// Definición de la interfaz para un dispositivo BLE
export interface BleDevice {
  id: string;
  name: string;
  address: string;
  limb_type?: string;
  limb_name?: string;
  rssi?: number;
  battery_level?: number; // Nivel de batería (0-100)
  is_connectable: boolean;
}

// Definición de la interfaz para un competidor
export interface Competitor extends Fighter {
  team: TeamColor;
  devices: BleDevice[];
}

// Definición de la interfaz para eventos de combate
export interface CombatEvent {
  event_type: string; // "slap", "low_kick"
  limb_name: string; // "Mano Izquierda", "Pie Derecho", etc.
  fighter_id: string; // ID del peleador
  competitor_name: string; // Nombre del competidor
  velocity: number; // Velocidad en m/s
  acceleration: number; // Aceleración en m/s²
  force: number; // Fuerza en Newtons
  timestamp: number; // Timestamp del evento
  confidence: number; // Confianza del evento (0.0-1.0)
}

// Definición de la interfaz para conexión de dispositivos
export interface DeviceConnection {
  deviceId: string;
  competitorId: number;
  competitorName: string;
  competitorWeight: number;
}

// Definición de la interfaz para la configuración de la batalla
export interface BattleConfig {
  mode: BattleMode;
  rounds: number;
  roundDuration?: number;
}
