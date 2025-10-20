//! Funciones de conexión y manejo de dispositivos BLE

use std::sync::{Arc, Mutex};
use std::time::Duration;
use bluest::{Adapter, Device, Characteristic};
use futures::{StreamExt, Stream};
use tauri::{AppHandle, Emitter};
use tracing::{info, debug, warn, error, instrument};
use tokio::task::JoinHandle;

use crate::ble::types::{LimbType, CompetitorInfo, BleResult};
use crate::ble::detection::SimpleEventDetector;
use crate::ble::detection::{
    parse_imu_data, check_and_update_max_stats, determine_limb_type_by_pattern
};
use crate::ble::state::{
    get_ble_adapter, get_connected_devices_state, get_device_references_state,
    get_device_tasks_state, register_connected_device,
    unregister_connected_device, cleanup_device_task
};
use crate::broadcast_ws::ws_broadcast;

/// Función coordinadora para conectar dispositivo con información del competidor
pub async fn connect_to_device_with_competitor<R: tauri::Runtime>(
    app_handle: Arc<AppHandle<R>>,
    device_id: String,
    competitor_id: u8,
    competitor_name: String,
    competitor_weight: f32,
) -> BleResult<()> {
    info!(device_id = %device_id, competitor_name = %competitor_name, "🔗 Conectando dispositivo para competidor");
    
    // 1. Crear información del competidor
    let competitor_info = create_competitor_info(competitor_id, competitor_name.clone(), competitor_weight);
    
    // 2. Buscar y encontrar el dispositivo BLE
    let (target_device, device_name) = find_ble_device_by_id(&device_id).await?;
    
    // 3. Determinar tipo de extremidad
    let limb_type = determine_limb_type_by_pattern(&device_name);
    
    // 4. Registrar dispositivo como conectado
    register_connected_device(&device_id, &device_name, &competitor_name);
    
    // 5. Configurar detector con información del competidor
    let detector = setup_competitor_detector(competitor_info, &competitor_name, limb_type);
    
    // 6. Almacenar referencia del dispositivo BLE
    let device_references = get_device_references_state();
    let mut references = device_references.lock().unwrap();
    references.insert(device_id.clone(), target_device.clone());
    drop(references);
    
    // 7. Lanzar tarea de manejo del dispositivo
    let task = spawn_device_handler(target_device, limb_type, detector, app_handle, device_id.clone());
    let device_tasks = get_device_tasks_state();
    let mut tasks = device_tasks.lock().unwrap();
    tasks.insert(device_id, task);
    
    Ok(())
}

/// Crea la información del competidor
fn create_competitor_info(id: u8, name: String, weight: f32) -> CompetitorInfo {
    CompetitorInfo {
        id,
        name,
        weight,
    }
}

/// Busca un dispositivo BLE por su ID
async fn find_ble_device_by_id(device_id: &str) -> BleResult<(Device, String)> {
    debug!(device_id = %device_id, "🔍 Buscando dispositivo BLE");
    
    // Primero intentar obtener el dispositivo de la caché de referencias
    {
        let device_references = get_device_references_state();
        let references = device_references.lock().unwrap();
        if let Some(cached_device) = references.get(device_id) {
            // Extraer el nombre del device_id (formato: "ManoDerecha_54c2e6cf")
            let device_name = device_id.split('_').next().unwrap_or("Unknown");
            info!(device_id = %device_id, "♻️ Usando dispositivo en caché (reconexión rápida)");
            return Ok((cached_device.clone(), format!("BH-{}", device_name)));
        }
    }
    
    // Si no está en caché, hacer escaneo completo
    debug!(device_id = %device_id, "📡 Dispositivo no en caché, iniciando escaneo...");
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
                            if local_name.contains("BH-")                                
                                && device.id().to_string() == device_id {
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

/// Configura un detector con información del competidor
fn setup_competitor_detector(competitor_info: CompetitorInfo, competitor_name: &str, limb_type: LimbType) -> Arc<Mutex<SimpleEventDetector>> {
    info!(
        competitor_name = %competitor_name,
        limb_type = ?limb_type,
        weight = competitor_info.weight,
        "🔧 Configurando detector para competidor"
    );
    
    let mut detector = SimpleEventDetector::new(limb_type);
    detector.set_competitor_info(competitor_info);
    Arc::new(Mutex::new(detector))
}

/// Configura un detector básico sin información de competidor
pub fn setup_basic_detector(limb_type: LimbType) -> Arc<Mutex<SimpleEventDetector>> {
    debug!(limb_type = ?limb_type, "🔧 Configurando detector básico");
    Arc::new(Mutex::new(SimpleEventDetector::new(limb_type)))
}

/// Lanza una tarea para manejar un dispositivo BLE
fn spawn_device_handler<R: tauri::Runtime>(
    device: Device,
    limb_type: LimbType,
    detector: Arc<Mutex<SimpleEventDetector>>,
    app_handle: Arc<AppHandle<R>>,
    device_id: String,
) -> JoinHandle<()> {
    tokio::spawn(async move {
        info!(device_id = %device_id, limb_type = ?limb_type, "🚀 Iniciando manejo de dispositivo");
        
        if let Err(e) = handle_simple_peripheral(device, limb_type, detector, app_handle).await {
            error!(device_id = %device_id, error = %e, "❌ Error en manejo de dispositivo");
        }
        
        // Limpiar al terminar
        unregister_connected_device(&device_id);
        info!(device_id = %device_id, "🔌 Manejo de dispositivo terminado");
    })
}

/// Manejo simplificado de periférico - Función coordinadora principal
pub async fn handle_simple_peripheral<R: tauri::Runtime>(
    device: Device,
    limb_type: LimbType,
    detector: Arc<Mutex<SimpleEventDetector>>,
    app_handle: Arc<AppHandle<R>>,
) -> BleResult<()> {
    // 1. Establecer conexión BLE
    let _adapter = establish_ble_connection(&device).await?;
    // 2. Descubrir servicios y características
    let notification_char = discover_notification_characteristic(&device).await?;
    
    // 3. Suscribirse a notificaciones
    info!(limb_type = ?limb_type, "📡 Suscribiéndose a notificaciones BLE");
    
    let notification_stream = notification_char.notify().await
        .map_err(|e| {
            let error_msg = format!("Error suscribiendo a notificaciones para {:?}: {}", limb_type, e);
            error!(limb_type = ?limb_type, error = %e, "❌ Error en suscripción BLE");
            error_msg
        })?;
    
    info!(limb_type = ?limb_type, "🔔 Notificaciones BLE configuradas");
    
    // 4. Procesar notificaciones en loop
    process_notification_stream(notification_stream, limb_type, detector, app_handle).await;
    
    info!(limb_type = ?limb_type, "🔌 Conexión terminada");
    Ok(())
}

/// Establece la conexión BLE con el dispositivo
#[instrument(skip(device))]
async fn establish_ble_connection(device: &Device) -> BleResult<Adapter> {
    debug!("Iniciando conexión BLE");
    
    // Obtener adaptador singleton
    let adapter = get_ble_adapter().await?;
    
    // Conectar al dispositivo usando el adaptador
    adapter.connect_device(device).await
        .map_err(|e| format!("Error conectando: {}", e))?;
    
    info!("Conexión BLE establecida exitosamente");
    
    // Esperar un momento para que se establezca la conexión GATT
    tokio::time::sleep(Duration::from_secs(1)).await;
    
    Ok(adapter)
}

/// Descubre y retorna la característica de notificación
#[instrument(skip(device))]
async fn discover_notification_characteristic(device: &Device) -> BleResult<Characteristic> {
    // Obtener servicios directamente del dispositivo
    let services = device.services().await
        .map_err(|e| format!("Error obteniendo servicios: {}", e))?;
    
    debug!(services_count = services.len(), "Servicios BLE descubiertos");
    
    // Buscar característica con notificaciones
    for service in &services {
        let characteristics = service.characteristics().await
            .map_err(|e| format!("Error obteniendo características: {}", e))?;
        
        for characteristic in characteristics {
            let properties = characteristic.properties().await;
            
            if let Ok(props) = properties {
                if props.notify {
                    info!(uuid = %characteristic.uuid(), "Característica de notificación encontrada");
                    return Ok(characteristic);
                }
            }
        }
    }
    
    let error_msg = "No se encontró característica con notificaciones".to_string();
    error!("{}", error_msg);
    Err(error_msg)
}

/// Procesa el stream de notificaciones en un loop
#[instrument(skip(notification_stream, detector, app_handle))]
async fn process_notification_stream<R: tauri::Runtime>(
    mut notification_stream: impl Stream<Item = Result<Vec<u8>, bluest::Error>> + Unpin,
    limb_type: LimbType,
    detector: Arc<Mutex<SimpleEventDetector>>,
    app_handle: Arc<AppHandle<R>>,
) {
    info!(limb_type = ?limb_type, "🔄 Iniciando procesamiento de notificaciones");
    
    while let Some(notification_result) = notification_stream.next().await {
        match notification_result {
            Ok(data_bytes) => {
                if let Err(e) = process_notification_data(&data_bytes, limb_type, &detector, &app_handle).await {
                    warn!(error = %e, "⚠️ Error procesando notificación");
                }
            }
            Err(e) => {
                error!(error = %e, "❌ Error en stream de notificaciones");
                break;
            }
        }
    }
    
    info!(limb_type = ?limb_type, "📡 Stream de notificaciones terminado");
}

/// Procesa los datos de una notificación BLE
async fn process_notification_data<R: tauri::Runtime>(
    data_bytes: &[u8],
    limb_type: LimbType,
    detector: &Arc<Mutex<SimpleEventDetector>>,
    app_handle: &AppHandle<R>,
) -> BleResult<()> {
    // Parsear datos IMU
    let imu_data = parse_imu_data(data_bytes)?;
    
    // Detectar eventos
    let mut detector_guard = detector.lock().unwrap();
    if let Some(event) = detector_guard.detect_event(&imu_data) {
        drop(detector_guard); // Liberar el lock antes de las operaciones async
        
        // Emitir evento al frontend
        if let Err(e) = app_handle.emit("simple-combat-event", &event) {
            error!(
                error = %e, 
                event_type = %event.event_type,
                limb_name = %event.limb_name, 
                "Error emitiendo evento al frontend"
            );
        }
        
        // Verificar y actualizar estadísticas máximas
        check_and_update_max_stats(&event, app_handle);
        
        // Broadcast via WebSocket con formato completo
        let message = serde_json::json!({
            "viewType": "live-combat",
            "data": event,
            "timestamp": std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_millis() as u64,
        });
        ws_broadcast(&message);
        
        info!(
            event_type = %event.event_type,
            limb = %event.limb_name,
            fighter = %event.fighter_id,
            confidence = %event.confidence,
            "📡 Evento emitido al frontend y WebSocket"
        );
    }
    
    Ok(())
}

/// Desconecta un dispositivo específico
pub async fn disconnect_device(device_id: &str) -> BleResult<()> {
    info!(device_id = %device_id, "🔌 Desconectando dispositivo");
    
    // Cancelar tarea del dispositivo
    cleanup_device_task(device_id).await;
    
    // Remover de dispositivos conectados
    unregister_connected_device(device_id);
    
    // NOTA: NO eliminamos la referencia del dispositivo para permitir reconexión rápida
    // La referencia se mantiene en memoria para evitar tener que escanear nuevamente
    // Si se necesita liberar memoria, se puede hacer con cleanup_ble_system()
    
    info!(device_id = %device_id, "✅ Dispositivo desconectado exitosamente");
    Ok(())
}

/// Desconecta todos los dispositivos
pub async fn disconnect_all_devices() -> BleResult<()> {
    info!("🔌 Desconectando todos los dispositivos");
    
    // Obtener lista de dispositivos conectados
    let device_ids: Vec<String> = {
        let connected_devices = get_connected_devices_state();
        let devices = connected_devices.lock().unwrap();
        devices.keys().cloned().collect()
    };
    
    // Desconectar cada dispositivo
    for device_id in device_ids {
        if let Err(e) = disconnect_device(&device_id).await {
            warn!(device_id = %device_id, error = %e, "Error desconectando dispositivo");
        }
    }
    
    info!("✅ Todos los dispositivos desconectados");
    Ok(())
}
