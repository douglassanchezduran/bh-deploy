# 📝 Configuración de Logging en Beat Hard Combat

## 🎯 Configuración Automática por Entorno

El sistema detecta automáticamente el entorno y configura el logging apropiado:

- **🔧 DESARROLLO** (`cargo run` / `npm run tauri:dev`): Nivel `info`
- **🚀 PRODUCCIÓN** (`cargo build --release` / `npm run tauri:build`): Nivel `error`

## 🛠️ Opciones de Configuración

### 1. Variable de Entorno RUST_LOG

```bash
# Desarrollo con logs completos
RUST_LOG=debug npm run tauri:dev

# Desarrollo normal
RUST_LOG=info npm run tauri:dev

# Producción (solo errores)
RUST_LOG=error npm run tauri:dev
```

### 2. Scripts NPM Predefinidos

```bash
# Desarrollo normal
npm run tauri:dev

# Desarrollo con debug completo
npm run tauri:dev:debug

# Desarrollo con info
npm run tauri:dev:info

# Desarrollo solo errores
npm run tauri:dev:error

# Build de producción optimizado
npm run tauri:build:production
```

### 3. Archivo .env

Edita el archivo `.env` en la raíz del proyecto:

```bash
# Para desarrollo
RUST_LOG=info

# Para debugging
RUST_LOG=debug

# Para producción
RUST_LOG=error
```

## 📊 Niveles de Logging

| Nivel | Descripción | Uso Recomendado |
|-------|-------------|-----------------|
| `error` | Solo errores críticos | 🚀 Producción |
| `warn` | Advertencias + errores | ⚠️ Testing |
| `info` | Eventos importantes | 🔧 Desarrollo |
| `debug` | Información detallada | 🐛 Debugging |
| `trace` | Máximo detalle | 🔬 Análisis profundo |

## 🎛️ Configuración Específica por Módulo

```bash
# Solo logs del sistema BLE
RUST_LOG=beat_hard_combat::simple_ble=debug

# Solo logs de detección de eventos
RUST_LOG=beat_hard_combat::simple_ble::detect_event=info

# Múltiples módulos
RUST_LOG=beat_hard_combat::simple_ble=info,beat_hard_combat::combat_types=debug
```

## ⚡ Optimización de Rendimiento

### Producción (Máximo Rendimiento)
```bash
RUST_LOG=error npm run tauri:build:production
```
- Solo errores críticos
- Sin overhead de logging
- Procesamiento a 200Hz completo

### Desarrollo (Balance)
```bash
RUST_LOG=info npm run tauri:dev
```
- Eventos importantes visibles
- Rendimiento aceptable
- Debugging efectivo

### Debugging (Máxima Información)
```bash
RUST_LOG=debug npm run tauri:dev:debug
```
- Todos los logs visibles
- Rendimiento reducido
- Análisis completo

## 🔍 Ejemplos de Logs

### Nivel ERROR (Producción)
```
2025-07-23T21:13:47.579497Z ERROR 🥊 Beat Hard Combat - Sistema iniciado (PRODUCCIÓN)
```

### Nivel INFO (Desarrollo)
```
2025-07-23T21:13:47.579497Z  INFO 🥊 Beat Hard Combat - Sistema iniciado (DESARROLLO)
2025-07-23T21:13:47.579552Z  INFO 📡 Listo para detectar: Bofetadas y Patadas
2025-07-23T21:13:47.579556Z  INFO 🎯 Eventos disponibles: simple-combat-event
2025-07-23T21:13:47.579560Z  INFO 🔧 Nivel de logging: info (configurable con RUST_LOG)
```

### Nivel DEBUG (Debugging)
```
2025-07-23T21:13:47.579497Z  INFO 🥊 Beat Hard Combat - Sistema iniciado (DESARROLLO)
2025-07-23T21:13:47.579552Z  INFO 📡 Listo para detectar: Bofetadas y Patadas
2025-07-23T21:13:55.750798Z DEBUG scan_available_devices: 🔍 Escaneando dispositivos BLE disponibles
2025-07-23T21:13:55.762000Z DEBUG device_id="54c2e6cf...": 🔍 Buscando dispositivo BLE
```

## 🚨 Troubleshooting

### Problema: Demasiados logs
**Solución**: Usar `RUST_LOG=error` o `RUST_LOG=warn`

### Problema: No veo logs importantes
**Solución**: Usar `RUST_LOG=info` o `RUST_LOG=debug`

### Problema: Rendimiento lento
**Solución**: Usar `RUST_LOG=error` para máximo rendimiento

### Problema: No funciona RUST_LOG
**Solución**: Verificar que esté exportada la variable:
```bash
export RUST_LOG=debug
npm run tauri:dev
```
