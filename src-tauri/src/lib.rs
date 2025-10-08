use tauri::Manager;
use tracing::{error};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

// Módulos del proyecto
mod ble;
mod broadcast_ws;

// Re-exports de comandos BLE
use ble::commands::*;

// Re-exports de comandos WebSocket
use broadcast_ws::broadcast_view_change;
use broadcast_ws::broadcast_battle_config;

/// Inicializa el sistema de logging con tracing
fn init_tracing() {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "beat_hard_combat=info,warn,error".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();
}

/// Resuelve la ruta de los archivos estáticos según el entorno
fn resolve_static_path(app: &tauri::App) -> String {
    if cfg!(debug_assertions) {
        // En desarrollo, usar static/dist dentro del directorio src-tauri
        std::env::current_dir()
            .expect("failed to get current directory")
            .join("static")
            .join("dist")
            .to_string_lossy()
            .to_string()
    } else {
        // En producción, usar la ruta de recursos de Tauri
        app.path()
            .resolve("static/dist", tauri::path::BaseDirectory::Resource)
            .expect("failed to resolve resource path")
            .to_string_lossy()
            .to_string()
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Inicializar logging
    init_tracing();

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            // Comandos BLE
            scan_available_devices,
            get_connected_devices,
            connect_to_device_with_competitor,
            connect_to_device_basic,
            disconnect_from_device,
            disconnect_all_ble_devices,
            get_current_max_stats,
            reset_max_stats,
            get_system_info,
            cleanup_ble_system_command,
            get_combat_stats,
            
            // Comandos WebSocket
            broadcast_battle_config,
            broadcast_view_change,
        ])
        .setup(|app| {
            // Resolver ruta de archivos estáticos
            let resource_path = resolve_static_path(app);
        
            // Iniciar servidor WebSocket
            tauri::async_runtime::spawn(async move {
                if let Err(e) = broadcast_ws::start_ws_server(8080, true, Some(resource_path)).await {
                    error!("Failed to start WebSocket server: {}", e);
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
