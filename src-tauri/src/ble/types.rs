//! Tipos y estructuras para el sistema BLE

use serde::{Serialize};

// Estructura para representar un dispositivo BLE encontrado
#[derive(Clone, Serialize, Debug)]
pub struct BleDevice {
    pub id: String,
    pub name: String,
    pub address: String,
    pub limb_type: Option<String>,
    pub limb_name: Option<String>,  // Nombre traducido de la extremidad
    pub rssi: Option<i16>,
    pub is_connectable: bool,
}

// Estructura simple para eventos de combate
#[derive(Debug, Clone, Serialize)]
pub struct SimpleCombatEvent {
    pub event_type: String,        // "slap", "kick"
    pub limb_name: String,         // "Mano Izquierda", "Pie Derecho", etc.
    pub fighter_id: String,        // ID del peleador (ej: "fighter_1", "fighter_2")
    pub competitor_name: String,   // Nombre del competidor
    pub velocity: Option<f32>,     // Velocidad en m/s
    pub acceleration: Option<f32>, // Aceleración en m/s²
    pub force: Option<f32>,        // Fuerza en Newtons
    pub timestamp: u64,            // Timestamp del evento
    pub confidence: f32,           // Confianza del evento (0.0 - 1.0)
}

// Estructura para estadísticas máximas por competidor
#[derive(Debug, Clone, Serialize)]
pub struct CompetitorMaxStats {
    pub fighter_id: String,        // "fighter_1", "fighter_2", etc.
    pub competitor_name: String,   // Nombre del peleador
    pub max_force: f32,
    pub max_velocity: f32,
    pub max_acceleration: f32,
}

// Datos básicos del sensor IMU
#[derive(Debug, Clone)]
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

// Tipos de extremidades
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum LimbType {
    LeftHand,
    RightHand,
    LeftFoot,
    RightFoot,
}

impl LimbType {
    pub fn from_id(id: u8) -> Option<Self> {
        match id {
            1 => Some(LimbType::RightHand),
            2 => Some(LimbType::LeftHand),
            3 => Some(LimbType::RightFoot),
            4 => Some(LimbType::LeftFoot),
            _ => None,
        }
    }

    pub fn name(&self) -> &'static str {
        match self {
            LimbType::LeftHand => "Mano Izquierda",
            LimbType::RightHand => "Mano Derecha",
            LimbType::LeftFoot => "Pierna Izquierda",
            LimbType::RightFoot => "Pierna Derecha",
        }
    }

    pub fn ble_name_pattern(&self) -> &'static str {
        match self {
            LimbType::LeftHand => "ManoIzquierda",
            LimbType::RightHand => "ManoDerecha",
            LimbType::LeftFoot => "PiernaIzquierda",
            LimbType::RightFoot => "PiernaDerecha",
        }
    }
}

// Configuración eficiente basada en datos reales BLE
#[derive(Debug, Clone)]
pub struct SimpleDetectionConfig {
    // Factores de escala basados en datos reales
    pub acc_scale: f32,      // 1000.0
    pub gyro_scale: f32,     // 250.0
    
    // Umbrales de detección ajustados
    pub slap_min_acc: f32,       // 1.5g para bofetadas (manos)
    pub slap_min_gyro: f32,      // 30°/s para bofetadas
    pub kick_min_acc: f32,       // 1.0g para patadas (pies)
    pub kick_max_gyro: f32,      // 10°/s máximo para patadas (movimiento más estable)
    pub kick_max_acc_z: f32,     // 0.2g máximo en Z (optimizado para low kick - patadas bajas y horizontales)
    
    // Velocidades base realistas por extremidad
    pub hand_base_velocity: f32,  // 10.0 m/s para manos
    pub foot_base_velocity: f32,  // 15.0 m/s para pies
    
    // Factores antropométricos científicos
    pub hand_mass_percentage: f32, // 2.7% del peso corporal (Dempster 1955)
    pub foot_mass_percentage: f32, // 6.2% del peso corporal (Dempster 1955)
    pub joint_stiffness_factor: f32, // 1.8 factor de rigidez articular
    
    // Sistema de cooldown para evitar eventos duplicados
    pub cooldown_ms: u64, // Tiempo mínimo entre eventos en milisegundos
}

impl Default for SimpleDetectionConfig {
    fn default() -> Self {
        Self {
            // Factores de escala
            acc_scale: 1000.0,
            gyro_scale: 250.0,
            
            // Umbrales ajustados basados en datos reales del dispositivo
            slap_min_acc: 0.8,    // Era 1.5g - Reducido para detectar movimientos normales
            slap_min_gyro: 3.0,   // Era 30°/s - Reducido drasticamente
            kick_min_acc: 0.8,    // Optimizado para competición low kick - detecta patadas efectivas
            kick_max_gyro: 10.0,  // Era 20°/s - Reducido
            kick_max_acc_z: 0.2,  // Optimizado para low kick - detecta patadas bajas y horizontales, excluye patadas medias/altas
            
            // Velocidades base
            hand_base_velocity: 10.0,
            foot_base_velocity: 15.0,
            
            // Antropometría
            hand_mass_percentage: 0.027,
            foot_mass_percentage: 0.062,
            joint_stiffness_factor: 1.8,
            
            // Sistema de cooldown
            cooldown_ms: 500, // 500ms entre eventos para evitar duplicados
        }
    }
}

// Información del competidor
#[derive(Debug, Clone)]
pub struct CompetitorInfo {
    pub id: u8,
    pub name: String,
    pub weight: f32, // kg
}

// Tipo de resultado para operaciones BLE
pub type BleResult<T> = Result<T, String>;
