//! Detector de eventos de combate

use std::time::{SystemTime, UNIX_EPOCH};
use tracing::{info, debug, error};
use tauri::{AppHandle, Emitter};

use crate::ble::types::{
    ImuData, LimbType, SimpleCombatEvent, SimpleDetectionConfig, 
    CompetitorInfo, CompetitorMaxStats, BleResult
};
use crate::ble::state::get_max_stats_store;
use crate::broadcast_ws::ws_broadcast;

// Detector ultra-simple para sistema por turnos
pub struct SimpleEventDetector {
    config: SimpleDetectionConfig,
    competitor_info: Option<CompetitorInfo>,
    limb_type: LimbType,
    last_event_time: u64, // Timestamp del último evento detectado
}

impl SimpleEventDetector {
    pub fn new(limb_type: LimbType) -> Self {
        Self {
            config: SimpleDetectionConfig::default(),
            competitor_info: None,
            limb_type,
            last_event_time: 0,
        }
    }

    // Asignar información del competidor
    pub fn set_competitor_info(&mut self, info: CompetitorInfo) {
        self.competitor_info = Some(info);
    }

    pub fn detect_event(&mut self, data: &ImuData) -> Option<SimpleCombatEvent> {
        let competitor = self.competitor_info.as_ref()?;
        // let limb_type = LimbType::from_id(data.limb_id)?;
        let limb_type = self.limb_type;

        // Sistema de cooldown para evitar eventos duplicados
        let current_time = data.timestamp;
        if current_time - self.last_event_time < self.config.cooldown_ms {
            return None; // Evento muy reciente, ignorar
        }

        // Convertir datos IMU a valores físicos
        let acc_x = data.acc_x as f32 / self.config.acc_scale;
        let acc_y = data.acc_y as f32 / self.config.acc_scale;
        let acc_z = data.acc_z as f32 / self.config.acc_scale;
        
        let gyro_x = data.gyro_x as f32 / self.config.gyro_scale;
        let gyro_y = data.gyro_y as f32 / self.config.gyro_scale;
        let gyro_z = data.gyro_z as f32 / self.config.gyro_scale;

        // Calcular magnitudes
        let acc_magnitude = (acc_x * acc_x + acc_y * acc_y + acc_z * acc_z).sqrt();
        let gyro_magnitude = (gyro_x * gyro_x + gyro_y * gyro_y + gyro_z * gyro_z).sqrt();

        debug!(
            limb_type = ?limb_type,
            acc_mag = acc_magnitude,
            gyro_mag = gyro_magnitude,
            acc_z = acc_z,
            "📊 Datos IMU procesados"
        );

        // Detección específica por tipo de extremidad
        let (event_type, confidence) = match limb_type {
            LimbType::LeftHand | LimbType::RightHand => {
                // Detección de bofetadas (manos)
                if acc_magnitude >= self.config.slap_min_acc && gyro_magnitude >= self.config.slap_min_gyro {
                    let confidence = ((acc_magnitude - self.config.slap_min_acc) / 2.0 + 
                                    (gyro_magnitude - self.config.slap_min_gyro) / 50.0).min(1.0);
                    ("slap", confidence)
                } else {
                    return None;
                }
            },
            LimbType::LeftFoot | LimbType::RightFoot => {
                // Detección de low kicks (patadas bajas - optimizado para competición low kick)
                // Detecta patadas horizontales y descendentes, excluye patadas medias/altas
                if acc_magnitude >= self.config.kick_min_acc && 
                   acc_z <= self.config.kick_max_acc_z && 
                   gyro_magnitude <= self.config.kick_max_gyro {
                    let confidence = ((acc_magnitude - self.config.kick_min_acc) / 3.0).min(1.0);
                    ("low_kick", confidence)
                } else {
                    return None;
                }
            }
        };

        // Calcular métricas físicas
        let (velocity, acceleration, force) = self.calculate_physics_metrics(
            acc_magnitude, gyro_magnitude, limb_type, competitor.weight
        );

        // Actualizar timestamp del último evento
        self.last_event_time = current_time;

        // Generar fighter_id basado en competitor_id
        let fighter_id = format!("fighter_{}", competitor.id);

        let event = SimpleCombatEvent {
            event_type: event_type.to_string(),
            limb_name: limb_type.name().to_string(),
            fighter_id,
            competitor_name: competitor.name.clone(),
            velocity: Some(velocity),
            acceleration: Some(acceleration),
            force: Some(force),
            timestamp: current_time,
            confidence,
        };

        info!(
            event_type = %event.event_type,
            limb = %event.limb_name,
            competitor = %event.competitor_name,
            velocity = velocity,
            acceleration = acceleration,
            force = force,
            confidence = confidence,
            "🥊 Evento de combate detectado"
        );

        Some(event)
    }

    /// Calcula métricas físicas realistas basadas en antropometría
    fn calculate_physics_metrics(&self, acc_magnitude: f32, _gyro_magnitude: f32, limb_type: LimbType, body_weight: f32) -> (f32, f32, f32) {
        // Seleccionar parámetros según extremidad
        let (base_velocity, mass_percentage) = match limb_type {
            LimbType::LeftHand | LimbType::RightHand => 
                (self.config.hand_base_velocity, self.config.hand_mass_percentage),
            LimbType::LeftFoot | LimbType::RightFoot => 
                (self.config.foot_base_velocity, self.config.foot_mass_percentage),
        };

        // Calcular masa de la extremidad
        let limb_mass = body_weight * mass_percentage;

        // Calcular velocidad realista basada en la extremidad y intensidad
        let intensity_factor = (acc_magnitude / 2.0).min(2.0); // Factor de intensidad entre 1.0 y 2.0
        let velocity = base_velocity * intensity_factor;

        // Calcular aceleración en m/s² (conversión de g a m/s²)
        let acceleration = acc_magnitude * 9.81;

        // Calcular fuerza usando masa antropométrica
        let force = limb_mass * acceleration * self.config.joint_stiffness_factor;

        (velocity, acceleration, force)
    }
}

/// Función para parsear datos IMU desde bytes BLE
pub fn parse_imu_data(data: &[u8]) -> BleResult<ImuData> {
    if data.len() < 14 {
        return Err(format!("Datos IMU incompletos: {} bytes (esperados 14)", data.len()));
    }

    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_millis() as u64;

    Ok(ImuData {
        limb_id: data[0],
        battery_level: data[1],
        acc_x: i16::from_le_bytes([data[2], data[3]]),
        acc_y: i16::from_le_bytes([data[4], data[5]]),
        acc_z: i16::from_le_bytes([data[6], data[7]]),
        gyro_x: i16::from_le_bytes([data[8], data[9]]),
        gyro_y: i16::from_le_bytes([data[10], data[11]]),
        gyro_z: i16::from_le_bytes([data[12], data[13]]),
        timestamp,
    })
}

/// Función para detectar y actualizar nuevos máximos
pub fn check_and_update_max_stats<R: tauri::Runtime>(
    event: &SimpleCombatEvent,
    app_handle: &AppHandle<R>,
) {
    let store = get_max_stats_store();
    let mut stats_map = match store.lock() {
        Ok(map) => map,
        Err(e) => {
            error!(error = %e, "Error accediendo al store de estadísticas");
            return;
        }
    };

    // Obtener o crear estadísticas del peleador
    let stats = stats_map.entry(event.fighter_id.clone()).or_insert(CompetitorMaxStats {
        fighter_id: event.fighter_id.clone(),
        competitor_name: event.competitor_name.clone(),
        max_force: 0.0,
        max_velocity: 0.0,
        max_acceleration: 0.0,
    });

    let mut new_records = Vec::new();

    // Verificar nuevo máximo de fuerza
    if let Some(force) = event.force {
        if force > stats.max_force {
            stats.max_force = force;
            new_records.push("force");
            info!(fighter_id = %event.fighter_id, new_max_force = force, 
                  "🏆 NUEVO RÉCORD DE FUERZA");
        }
    }

    // Verificar nuevo máximo de velocidad
    if let Some(velocity) = event.velocity {
        if velocity > stats.max_velocity {
            stats.max_velocity = velocity;
            new_records.push("velocity");
            info!(fighter_id = %event.fighter_id, new_max_velocity = velocity, 
                  "🏆 NUEVO RÉCORD DE VELOCIDAD");
        }
    }

    // Verificar nuevo máximo de aceleración
    if let Some(acceleration) = event.acceleration {
        if acceleration > stats.max_acceleration {
            stats.max_acceleration = acceleration;
            new_records.push("acceleration");
            info!(fighter_id = %event.fighter_id, new_max_acceleration = acceleration, 
                  "🏆 NUEVO RÉCORD DE ACELERACIÓN");
        }
    }

    // Si hay nuevos récords, enviar notificaciones
    if !new_records.is_empty() {
        let stats_clone = stats.clone();
        
        // 1. Enviar evento al frontend
        let record_event = serde_json::json!({
            "type": "new_max_record",
            "fighter_id": event.fighter_id,
            "records": new_records,
            "stats": stats_clone,
            "triggering_event": event
        });

        if let Err(e) = app_handle.emit("new-max-record", &record_event) {
            error!(error = %e, "Error emitiendo evento de nuevo récord");
        }

        // 2. Enviar por WebSocket
        let ws_message = serde_json::json!({
            "type": "max_stats_update",
            "fighter_id": event.fighter_id,
            "data": stats_clone,
            "new_records": new_records,
            "timestamp": event.timestamp,
            "view_type": "stats"
        });
        ws_broadcast(&ws_message);

        info!(fighter_id = %event.fighter_id, records = ?new_records, 
              "📡 Nuevos récords enviados por WebSocket y evento");
    }
}

/// Determina el tipo de extremidad
pub fn determine_limb_type_by_pattern(device_name: &str) -> LimbType {
    [LimbType::LeftHand, LimbType::RightHand, LimbType::LeftFoot, LimbType::RightFoot]
        .iter()
        .find(|limb| device_name.contains(limb.ble_name_pattern()))
        .copied()
        .unwrap_or(LimbType::LeftHand) // Default
}
