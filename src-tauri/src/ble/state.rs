//! Gestión de estado global del sistema BLE

use std::collections::HashMap;
use std::sync::{Arc, Mutex, OnceLock};
use tokio::task::JoinHandle;
use bluest::{Adapter, Device};
use once_cell::sync::Lazy;
use tracing::{info, debug};

use crate::ble::types::{CompetitorMaxStats, BleResult};

// ============================================================================
// Type Aliases - Simplifica tipos complejos para evitar warnings de Clippy
// ============================================================================

/// Store thread-safe de estadísticas máximas por competidor
type MaxStatsStore = Arc<Mutex<HashMap<String, CompetitorMaxStats>>>;

/// Mapa thread-safe de dispositivos conectados (device_id -> device_name)
type ConnectedDevicesMap = Arc<Mutex<HashMap<String, String>>>;

/// Mapa thread-safe de referencias a dispositivos BLE
type DeviceReferencesMap = Arc<Mutex<HashMap<String, Device>>>;

/// Mapa thread-safe de tareas de manejo de dispositivos
type DeviceTasksMap = Arc<Mutex<HashMap<String, JoinHandle<()>>>>;

/// Adaptador BLE singleton thread-safe
type BleAdapterSingleton = Arc<Mutex<Option<Adapter>>>;

// ============================================================================
// Estado Global
// ============================================================================

// Store global para estadísticas máximas (usando fighter_id como clave)
static MAX_STATS_STORE: Lazy<MaxStatsStore> = 
    Lazy::new(|| Arc::new(Mutex::new(HashMap::new())));

// Estado global de dispositivos conectados (device_id -> device_name)
static CONNECTED_DEVICES: OnceLock<ConnectedDevicesMap> = OnceLock::new();

// Referencias a dispositivos BLE (device_id -> Device)
static DEVICE_REFERENCES: OnceLock<DeviceReferencesMap> = OnceLock::new();

// Tareas de manejo de dispositivos (device_id -> JoinHandle)
static DEVICE_TASKS: OnceLock<DeviceTasksMap> = OnceLock::new();

// Adaptador BLE singleton
static BLE_ADAPTER: OnceLock<BleAdapterSingleton> = OnceLock::new();

/// Función para obtener el store de estadísticas máximas
pub fn get_max_stats_store() -> MaxStatsStore {
    MAX_STATS_STORE.clone()
}

/// Función para obtener el estado de dispositivos conectados
pub fn get_connected_devices_state() -> ConnectedDevicesMap {
    CONNECTED_DEVICES.get_or_init(|| Arc::new(Mutex::new(HashMap::new()))).clone()
}

/// Función para obtener las referencias de dispositivos BLE
pub fn get_device_references_state() -> DeviceReferencesMap {
    DEVICE_REFERENCES.get_or_init(|| Arc::new(Mutex::new(HashMap::new()))).clone()
}

/// Función para obtener las tareas de dispositivos
pub fn get_device_tasks_state() -> DeviceTasksMap {
    DEVICE_TASKS.get_or_init(|| Arc::new(Mutex::new(HashMap::new()))).clone()
}

/// Función para obtener el adaptador BLE singleton
pub async fn get_ble_adapter() -> BleResult<Adapter> {
    let adapter_lock = BLE_ADAPTER.get_or_init(|| Arc::new(Mutex::new(None)));
    
    // Verificar si ya tenemos un adaptador válido
    {
        let adapter_guard = adapter_lock.lock().unwrap();
        if let Some(ref adapter) = *adapter_guard {
            debug!("♻️ Reutilizando adaptador BLE existente");
            return Ok(adapter.clone());
        }
    }
    
    // Crear nuevo adaptador si no existe
    debug!("🔧 Creando nuevo adaptador BLE");
    let adapter = Adapter::default().await
        .ok_or_else(|| "Error obteniendo adaptador BLE".to_string())?;
    
    // Almacenar en el singleton
    {
        let mut adapter_guard = adapter_lock.lock().unwrap();
        *adapter_guard = Some(adapter.clone());
    }
    
    info!("✅ Adaptador BLE inicializado correctamente");
    Ok(adapter)
}

/// Registra un dispositivo como conectado con información del competidor
pub fn register_connected_device(device_id: &str, device_name: &str, competitor_name: &str) {
    let connected_devices = get_connected_devices_state();
    let mut devices = connected_devices.lock().unwrap();
    devices.insert(device_id.to_string(), device_name.to_string());
    
    info!(
        device_id = %device_id,
        device_name = %device_name,
        competitor = %competitor_name,
        "📱 Dispositivo registrado como conectado"
    );
}

/// Registra un dispositivo sin información de competidor
pub fn register_device_without_competitor(device_id: &str, device_name: &str) {
    let connected_devices = get_connected_devices_state();
    let mut devices = connected_devices.lock().unwrap();
    devices.insert(device_id.to_string(), device_name.to_string());
    
    info!(
        device_id = %device_id,
        device_name = %device_name,
        "📱 Dispositivo registrado sin competidor"
    );
}

/// Desregistra un dispositivo conectado
pub fn unregister_connected_device(device_id: &str) {
    let connected_devices = get_connected_devices_state();
    let mut devices = connected_devices.lock().unwrap();
    
    if let Some(device_name) = devices.remove(device_id) {
        info!(
            device_id = %device_id,
            device_name = %device_name,
            "📱 Dispositivo desregistrado"
        );
    }
}

/// Cancela y limpia la tarea de un dispositivo específico
pub async fn cleanup_device_task(device_id: &str) {
    let device_tasks = get_device_tasks_state();
    let mut tasks = device_tasks.lock().unwrap();
    
    if let Some(task) = tasks.remove(device_id) {
        task.abort();
        info!(device_id = %device_id, "🧹 Tarea de dispositivo cancelada");
    }
}

/// Cancela todas las tareas de dispositivos
pub async fn cleanup_all_device_tasks() {
    let device_tasks = get_device_tasks_state();
    let mut tasks = device_tasks.lock().unwrap();
    
    let task_count = tasks.len();
    for (device_id, task) in tasks.drain() {
        task.abort();
        debug!(device_id = %device_id, "🧹 Tarea cancelada");
    }
    
    if task_count > 0 {
        info!(task_count = task_count, "🧹 Todas las tareas de dispositivos canceladas");
    }
}

/// Limpia completamente el estado del sistema BLE
pub async fn cleanup_ble_system() {
    // Cancelar todas las tareas
    cleanup_all_device_tasks().await;
    
    // Limpiar dispositivos conectados
    {
        let connected_devices = get_connected_devices_state();
        let mut devices = connected_devices.lock().unwrap();
        devices.clear();
    }
    
    // Limpiar referencias de dispositivos
    {
        let device_references = get_device_references_state();
        let mut references = device_references.lock().unwrap();
        references.clear();
    }
    
    // Limpiar estadísticas máximas
    {
        let max_stats = get_max_stats_store();
        let mut stats = max_stats.lock().unwrap();
        stats.clear();
    }
    
    // Reiniciar el adaptador BLE para asegurar que esté en estado limpio
    {
        let adapter_lock = BLE_ADAPTER.get_or_init(|| Arc::new(Mutex::new(None)));
        let mut adapter_guard = adapter_lock.lock().unwrap();
        *adapter_guard = None; // Forzar reinicialización del adaptador
    }
    
    info!("🧹 Sistema BLE completamente limpiado");
}

/// Obtiene información del estado actual del sistema BLE
pub fn get_system_status() -> serde_json::Value {
    let connected_count = {
        let connected_devices = get_connected_devices_state();
        let devices = connected_devices.lock().unwrap();
        devices.len()
    };
    
    let tasks_count = {
        let device_tasks = get_device_tasks_state();
        let tasks = device_tasks.lock().unwrap();
        tasks.len()
    };
    
    let stats_count = {
        let max_stats = get_max_stats_store();
        let stats = max_stats.lock().unwrap();
        stats.len()
    };
    
    serde_json::json!({
        "connected_devices": connected_count,
        "active_tasks": tasks_count,
        "tracked_competitors": stats_count,
        "system_initialized": true
    })
}
