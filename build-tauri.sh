#!/bin/bash

# Script para build completo de Tauri con frontend npm

echo "🚀 Iniciando build completo de Tauri..."

# 1. Build del frontend en src-tauri/static
echo "📦 Building frontend (webpack)..."
cd src-tauri/static
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error en build del frontend"
    exit 1
fi

echo "✅ Frontend build completado"

# 2. Volver al directorio raíz y build de Tauri
echo "🔨 Building aplicación Tauri..."
cd ../..
npm run tauri build

if [ $? -ne 0 ]; then
    echo "❌ Error en build de Tauri"
    exit 1
fi

echo "🎉 Build completo exitoso!"
echo "📁 Archivos generados en src-tauri/target/release/"
