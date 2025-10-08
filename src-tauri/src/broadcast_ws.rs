use std::{net::SocketAddr};

use axum::{
    extract::ws::{Message, WebSocket, WebSocketUpgrade},
    http::StatusCode,
    response::IntoResponse,
    routing::get,
    Router,
};
use axum::routing::get_service;
use once_cell::sync::OnceCell;
use tokio::{net::TcpListener, sync::broadcast, task::JoinHandle};
use tower_http::services::ServeDir;
use tracing::{error, info, warn};

static BROADCAST_TX: OnceCell<broadcast::Sender<String>> = OnceCell::new();
static SERVER_HANDLE: OnceCell<JoinHandle<()>> = OnceCell::new();

 pub async fn start_ws_server(port: u16, bind_all: bool, static_dir: Option<String>) -> Result<String, String> {
    if SERVER_HANDLE.get().is_some() {
        return Ok("WS server already running".to_string());
    }

    let (tx, _rx) = broadcast::channel::<String>(1024);
    let _ = BROADCAST_TX.set(tx);

    let bind_ip = if bind_all { "0.0.0.0" } else { "127.0.0.1" };
    let addr: SocketAddr = format!("{}:{}", bind_ip, port)
        .parse()
        .map_err(|e| format!("Invalid addr: {}", e))?;

    let static_dir = static_dir.unwrap_or_else(|| "static".to_string());

    let app = Router::new()
        .route("/ws", get(ws_upgrade))
        .fallback_service(
            get_service(ServeDir::new(static_dir.clone())).handle_error(|e| async move {
                error!(error = %e, "Static file service error");
                (StatusCode::INTERNAL_SERVER_ERROR, "static service error")
            }),
        );

    let listener = TcpListener::bind(addr)
        .await
        .map_err(|e| format!("Failed binding {}: {}", addr, e))?;

    info!(%addr, static_dir = %static_dir, "🚀 WS/HTTP server starting");

    let handle = tokio::spawn(async move {
        if let Err(e) = axum::serve(listener, app).await {
            error!(error = %e, "Server error");
        }
    });

    let _ = SERVER_HANDLE.set(handle);

    Ok(format!("WS server running at http://{}", addr))
}

pub fn ws_broadcast<T: serde::Serialize>(event: &T) {
    if let Some(tx) = BROADCAST_TX.get() {
        match serde_json::to_string(event) {
            Ok(payload) => {
                let _ = tx.send(payload);
            }
            Err(e) => warn!(error = %e, "Failed to serialize event for WS broadcast"),
        }
    }
}

// Estructura para configuración de batalla
#[derive(serde::Serialize, Clone)]
pub struct BattleConfig {
    pub mode: String, // "time" o "rounds"
    pub rounds: u32,
    pub round_duration: Option<u32>, // Solo para modo "time"
    pub current_round: u32,
    pub timestamp: u64,
}

// Comando para enviar configuración de batalla
#[tauri::command]
#[allow(dead_code)]
pub fn broadcast_battle_config(
    mode: String,
    rounds: u32,
    round_duration: Option<u32>,
    current_round: u32,
) -> Result<String, String> {
    let config = BattleConfig {
        mode,
        rounds,
        round_duration,
        current_round,
        timestamp: std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_millis() as u64,
    };

    ws_broadcast(&serde_json::json!({
        "type": "battle_config",
        "data": config
    }));

    info!(mode = %config.mode, rounds = config.rounds, current_round = config.current_round, "⚙️ Battle config with round info broadcasted");
    Ok(format!("Battle config sent: {} mode, round {}/{}", config.mode, config.current_round, config.rounds))
}

// Comando para cambiar vista de transmisión
#[tauri::command]
#[allow(dead_code)]
pub fn broadcast_view_change(
    view_type: String,
    data: Option<serde_json::Value>,
) -> Result<String, String> {
    let message = serde_json::json!({
        "viewType": view_type,
        "data": data.unwrap_or(serde_json::json!({})),
        "timestamp": std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_millis() as u64,
    });

    ws_broadcast(&message);

    info!(view_type = %view_type, "📺 View change broadcasted");
    Ok(format!("View changed to: {}", view_type))
}

async fn ws_upgrade(ws: WebSocketUpgrade) -> impl IntoResponse {
    info!("🔌 New WebSocket connection attempt");
    ws.on_upgrade(handle_socket)
}

async fn handle_socket(mut socket: WebSocket) {
    info!("✅ WebSocket connection established");
    
    let Some(tx) = BROADCAST_TX.get() else {
        error!("❌ Broadcast channel not ready");
        let _ = socket.send(Message::Text("{\"error\":\"broadcast not ready\"}".into())).await;
        return;
    };

    let mut rx = tx.subscribe();
    info!("📡 WebSocket client subscribed to broadcast channel");

    loop {
        tokio::select! {
            msg = rx.recv() => {
                match msg {
                    Ok(text) => {
                        if socket.send(Message::Text(text)).await.is_err() {
                            break;
                        }
                    }
                    Err(_e) => {
                        // lagged or closed; continue
                    }
                }
            }
            incoming = socket.recv() => {
                match incoming {
                    Some(Ok(Message::Close(_))) | None => break,
                    Some(Ok(_)) => { /* ignore client messages */ }
                    Some(Err(_)) => break,
                }
            }
        }
    }
}
