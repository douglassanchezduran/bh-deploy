//! Comandos Tauri para el sistema BLE

use std::time::Duration;
use std::sync::Arc;
use tauri::{AppHandle};
use tracing::{info, debug, error, instrument};

use crate::ble::types::{BleDevice, LimbType, BleResult};
use crate::ble::detection::{determine_limb_type_by_pattern, SimpleEventDetector};
use crate::ble::connection::{
    connect_to_device_with_competitor as connect_device_internal, 
    setup_basic_detector, disconnect_device, disconnect_all_devices
};
use crate::ble::state::{
    get_ble_adapter, get_connected_devices_state, get_device_references_state,
    get_device_tasks_state, get_max_stats_store, register_device_without_competitor,
    cleanup_ble_system, get_system_status
};
use crate::broadcast_ws::ws_broadcast;

/// Función para escanear dispositivos BLE disponibles
/// Mantiene exactamente el mismo algoritmo que simple_ble.rs
#[tauri::command]
#[instrument]
pub async fn scan_available_devices() -> Result<Vec<BleDevice>, String> {
    info!("🔍 Iniciando escaneo de dispositivos BLE...");
    
    // Obtener adaptador singleton
    let adapter = get_ble_adapter().await?;
    
    // Esperar a que el adaptador esté disponible
    adapter.wait_available().await
        .map_err(|e| format!("Error esperando adaptador: {}", e))?;
    
    let mut scan = adapter.scan(&[]).await
        .map_err(|e| format!("Error iniciando escaneo: {}", e))?;
    
    let mut devices = Vec::with_capacity(8); // Pre-allocar para hasta 8 dispositivos (2 peleadores x 4 extremidades)
    let mut seen_devices = std::collections::HashSet::with_capacity(8);
    
    // Usar timeout con pin más eficiente
    let scan_timeout = tokio::time::sleep(Duration::from_secs(2));
    tokio::pin!(scan_timeout);
    
    loop {
        tokio::select! {
            _ = &mut scan_timeout => {
                info!(found_devices = devices.len(), "⏰ Escaneo BLE completado por timeout");
                break;
            }
            discovered = scan.next() => {
                match discovered {
                    Some(discovered_device) => {
                        let adv_data = &discovered_device.adv_data;
                        
                        // Verificar primero si es un dispositivo BH
                        let local_name = match &adv_data.local_name {
                            Some(name) if name.contains("BH-") => name,
                            _ => continue,
                        };
                        
                        let device = discovered_device.device;
                        let device_address = device.id().to_string();
                        let device_id = device_address.clone();
                        
                        // Evitar duplicados usando HashSet
                        if !seen_devices.insert(device_id.clone()) {
                            continue;
                        }
                        
                        // Determinar tipo de extremidad y nombre traducido
                        let limb_type = determine_limb_type_by_pattern(local_name);
                        let limb_name = limb_type.name().to_string();
                        
                        let ble_device = BleDevice {
                            id: device_id,
                            name: local_name.clone(),
                            address: device_address,
                            limb_type: Some(limb_type.ble_name_pattern().to_string()),
                            limb_name: Some(limb_name),
                            rssi: discovered_device.rssi,
                            is_connectable: true,
                        };
                        
                        devices.push(ble_device);
                        
                        // Limitar a 8 dispositivos para evitar overflow
                        if devices.len() >= 8 {
                            info!("🔍 Límite de 8 dispositivos alcanzado, terminando escaneo");
                            break;
                        }
                    }
                    None => break,
                }
            }
        }
    }
    
    info!(found_devices = devices.len(), "✅ Escaneo BLE completado");
    Ok(devices)
}

/// Función para obtener lista de dispositivos conectados
/// Mantiene exactamente el mismo algoritmo que simple_ble.rs
#[tauri::command]
pub async fn get_connected_devices() -> Result<Vec<String>, String> {
    let connected_devices = get_connected_devices_state();
    let devices = connected_devices.lock().unwrap();
    Ok(devices.keys().cloned().collect())
}

/// Conecta a un dispositivo BLE con información del competidor
/// Mantiene exactamente el mismo algoritmo que simple_ble.rs
#[tauri::command]
pub async fn connect_to_device_with_competitor<R: tauri::Runtime>(
    device_id: String,
    competitor_id: u8,
    competitor_name: String,
    competitor_weight: f32,
    app_handle: AppHandle<R>,
) -> Result<String, String> {
    info!(
        device_id = %device_id,
        competitor_name = %competitor_name,
        competitor_weight = competitor_weight,
        "🔗 Comando: Conectar dispositivo con competidor"
    );
    
    let app_handle_arc = Arc::new(app_handle);
    
    connect_device_internal(
        app_handle_arc,
        device_id.clone(),
        competitor_id,
        competitor_name.clone(),
        competitor_weight,
    ).await?;
    
    Ok(format!("Dispositivo {} conectado exitosamente para {}", device_id, competitor_name))
}

/// Conecta a un dispositivo BLE sin información del competidor
#[tauri::command]
pub async fn connect_to_device_basic<R: tauri::Runtime>(
    device_id: String,
    app_handle: AppHandle<R>,
) -> Result<String, String> {
    info!(device_id = %device_id, "🔗 Comando: Conectar dispositivo básico");
    
    // Buscar dispositivo
    let (target_device, device_name) = find_ble_device_by_id(&device_id).await?;
    
    // Determinar tipo de extremidad
    let limb_type = determine_limb_type_by_pattern(&device_name);
    
    // Registrar dispositivo sin competidor
    register_device_without_competitor(&device_id, &device_name);
    
    // Configurar detector básico
    let detector = setup_basic_detector(limb_type);
    
    // Almacenar referencia del dispositivo
    let device_references = get_device_references_state();
    let mut references = device_references.lock().unwrap();
    references.insert(device_id.clone(), target_device.clone());
    drop(references);
    
    // Lanzar tarea de manejo
    let app_handle_arc = Arc::new(app_handle);
    let task = spawn_device_handler(target_device, limb_type, detector, app_handle_arc, device_id.clone());
    let device_tasks = get_device_tasks_state();
    let mut tasks = device_tasks.lock().unwrap();
    tasks.insert(device_id.clone(), task);
    
    Ok(format!("Dispositivo {} conectado exitosamente", device_id))
}

/// Desconecta un dispositivo BLE específico
/// Mantiene exactamente el mismo algoritmo que simple_ble.rs
#[tauri::command]
pub async fn disconnect_from_device(device_id: String) -> Result<String, String> {
    info!(device_id = %device_id, "🔌 Comando: Desconectar dispositivo");
    
    disconnect_device(&device_id).await?;
    
    Ok(format!("Dispositivo {} desconectado exitosamente", device_id))
}

/// Desconecta todos los dispositivos BLE
#[tauri::command]
pub async fn disconnect_all_ble_devices() -> Result<String, String> {
    info!("🔌 Comando: Desconectar todos los dispositivos");
    
    disconnect_all_devices().await?;
    
    Ok("Todos los dispositivos desconectados exitosamente".to_string())
}

/// Comando para obtener estadísticas máximas actuales
/// Mantiene exactamente el mismo algoritmo que simple_ble.rs
#[tauri::command]
pub fn get_current_max_stats(fighter_id: Option<String>) -> Result<serde_json::Value, String> {
    let store = get_max_stats_store();
    let stats_map = store.lock()
        .map_err(|e| format!("Error accediendo al store: {}", e))?;

    match fighter_id {
        Some(id) => {
            if let Some(stats) = stats_map.get(&id) {
                Ok(serde_json::to_value(stats).unwrap())
            } else {
                Err(format!("No se encontraron estadísticas para el peleador {}", id))
            }
        }
        None => {
            // Devolver todas las estadísticas
            let all_stats: Vec<_> = stats_map.values().collect();
            Ok(serde_json::to_value(all_stats).unwrap())
        }
    }
}

/// Comando para resetear estadísticas máximas
/// Mantiene exactamente el mismo algoritmo que simple_ble.rs
#[tauri::command]
pub fn reset_max_stats() -> Result<String, String> {
    let store = get_max_stats_store();
    let mut stats_map = store.lock()
        .map_err(|e| format!("Error accediendo al store: {}", e))?;

    stats_map.clear();

    // Notificar reset por WebSocket
    let reset_message = serde_json::json!({
        "type": "max_stats_reset",
        "timestamp": std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_millis() as u64
    });
    ws_broadcast(&reset_message);

    info!("🔄 Estadísticas máximas reseteadas");
    Ok("Estadísticas máximas reseteadas exitosamente".to_string())
}

/// Comando para obtener información del sistema BLE
#[tauri::command]
pub async fn get_system_info() -> Result<serde_json::Value, String> {
    debug!("ℹ️ Obteniendo información del sistema BLE");
    Ok(get_system_status())
}

/// Comando para limpiar completamente el sistema BLE
#[tauri::command]
pub async fn cleanup_ble_system_command() -> Result<String, String> {
    info!("🧹 Comando: Limpiar sistema BLE");
    
    cleanup_ble_system().await;
    
    Ok("Sistema BLE limpiado exitosamente".to_string())
}

/// Comando para obtener estadísticas de combate
#[tauri::command]
pub async fn get_combat_stats() -> Result<serde_json::Value, String> {
    let system_status = get_system_status();
    let max_stats = get_current_max_stats(None)?;
    
    Ok(serde_json::json!({
        "system": system_status,
        "max_stats": max_stats
    }))
}

// ============================================================================
// FUNCIONES AUXILIARES INTERNAS
// ============================================================================

use futures::StreamExt;
use tokio::task::JoinHandle;
use std::sync::Mutex;

/// Busca un dispositivo BLE por su ID (función auxiliar interna)
async fn find_ble_device_by_id(device_id: &str) -> BleResult<(bluest::Device, String)> {
    debug!(device_id = %device_id, "🔍 Buscando dispositivo BLE");
    
    let adapter = get_ble_adapter().await?;
    adapter.wait_available().await
        .map_err(|e| format!("Error esperando adaptador: {}", e))?;
    
    let mut scan = adapter.scan(&[]).await
        .map_err(|e| format!("Error iniciando escaneo: {}", e))?;
    
    let scan_timeout = tokio::time::sleep(Duration::from_secs(10));
    tokio::pin!(scan_timeout);
    
    loop {
        tokio::select! {
            _ = &mut scan_timeout => {
                return Err(format!("Dispositivo {} no encontrado en 10 segundos", device_id));
            }
            discovered = scan.next() => {
                match discovered {
                    Some(discovered_device) => {
                        let device = discovered_device.device;
                        let adv_data = &discovered_device.adv_data;
                        
                        if let Some(local_name) = &adv_data.local_name {
                            if local_name.contains("BH-") && device.id().to_string() == device_id {
                                info!(device_id = %device_id, device_name = %local_name, "✅ Dispositivo encontrado");
                                return Ok((device, local_name.clone()));
                            }
                        }
                    }
                    None => break,
                }
            }
        }
    }
    
    Err(format!("Dispositivo {} no encontrado", device_id))
}

/// Lanza una tarea para manejar un dispositivo BLE (función auxiliar interna)
fn spawn_device_handler<R: tauri::Runtime>(
    device: bluest::Device,
    limb_type: LimbType,
    detector: Arc<Mutex<SimpleEventDetector>>,
    app_handle: Arc<AppHandle<R>>,
    device_id: String,
) -> JoinHandle<()> {
    tokio::spawn(async move {
        info!(device_id = %device_id, limb_type = ?limb_type, "🚀 Iniciando manejo de dispositivo");
        
        // Usar la función pública de connection
        if let Err(e) = crate::ble::connection::handle_simple_peripheral(device, limb_type, detector, app_handle).await {
            error!(device_id = %device_id, error = %e, "❌ Error en manejo de dispositivo");
        }
        
        // Limpiar al terminar
        crate::ble::state::unregister_connected_device(&device_id);
        info!(device_id = %device_id, "🔌 Manejo de dispositivo terminado");
    })
}
