// Tipos simplificados para el sistema de combate BLE
// Solo incluye lo esencial para detectar bofetadas y patadas

use serde::{Deserialize, Serialize};

// Evento simple de combate con velocidad, aceleración y fuerza
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct SimpleCombatEvent {
    pub event_type: String,        // "punch", "slap", "kick"
    pub limb_name: String,         // "Mano Izquierda", "Pie Derecho", etc.
    pub fighter_id: String,        // ID del peleador
    pub velocity: f32,             // Velocidad en m/s
    pub acceleration: f32,         // Aceleración en m/s²
    pub force: f32,                // Fuerza en Newtons
    pub timestamp: u64,            // Timestamp del evento
    pub confidence: f32,           // Confianza del evento (0.0-1.0)
}

// Tipos de extremidades simplificado
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum LimbType {
    LeftHand = 0,
    RightHand = 1,
    LeftFoot = 2,
    RightFoot = 3,
}

impl LimbType {
    pub fn from_id(id: u8) -> Option<Self> {
        match id {
            0 => Some(LimbType::LeftHand),
            1 => Some(LimbType::RightHand),
            2 => Some(LimbType::LeftFoot),
            3 => Some(LimbType::RightFoot),
            _ => None,
        }
    }

    pub fn name(&self) -> &'static str {
        match self {
            LimbType::LeftHand => "Mano Izquierda",
            LimbType::RightHand => "Mano Derecha",
            LimbType::LeftFoot => "Pie Izquierdo",
            LimbType::RightFoot => "Pie Derecho",
        }
    }
    
    pub fn ble_name_pattern(&self) -> &'static str {
        match self {
            LimbType::LeftHand => "BH-ManoIzquierda",
            LimbType::RightHand => "BH-ManoDerecha",
            LimbType::LeftFoot => "BH-PieIzquierdo",
            LimbType::RightFoot => "BH-PieDerecho",
        }
    }
}

// Datos básicos del sensor IMU
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ImuData {
    pub limb_id: u8,
    pub battery_level: u8,
    pub acc_x: i16,
    pub acc_y: i16,
    pub acc_z: i16,
    pub gyro_x: i16,
    pub gyro_y: i16,
    pub gyro_z: i16,
    pub timestamp: u64,
}

// Estadísticas simples por extremidad
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct SimpleStats {
    pub limb_type: LimbType,
    pub total_events: u32,
    pub slaps: u32,
    pub kicks: u32,
    pub max_force: f32,
    pub max_velocity: f32,
    pub max_acceleration: f32,
    pub last_event_time: u64,
}

impl SimpleStats {
    pub fn new(limb_type: LimbType) -> Self {
        Self {
            limb_type,
            total_events: 0,
            slaps: 0,
            kicks: 0,
            max_force: 0.0,
            max_velocity: 0.0,
            max_acceleration: 0.0,
            last_event_time: 0,
        }
    }
    
    pub fn register_event(&mut self, event: &SimpleCombatEvent) {
        self.total_events += 1;
        self.last_event_time = event.timestamp;
        
        // Actualizar contadores por tipo
        match event.event_type.as_str() {
            "slap" => self.slaps += 1,
            "kick" => self.kicks += 1,
            _ => {}
        }
        
        // Actualizar máximos
        if event.force > self.max_force {
            self.max_force = event.force;
        }
        if event.velocity > self.max_velocity {
            self.max_velocity = event.velocity;
        }
        if event.acceleration > self.max_acceleration {
            self.max_acceleration = event.acceleration;
        }
    }
}
