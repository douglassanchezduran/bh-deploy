import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWebSocketStore = create(
  persist(
    (set, get) => ({
      // Estado
      currentView: 'cover',
      viewData: {},
      combatData: {}, // Estructura: { fighter_1: {...}, fighter_2: {...} }
      maxStatsData: {}, // Estructura: { fighter_1: {...}, fighter_2: {...} }
      roundsHistory: {}, // Estructura: { round_1: { fighter_1: {...}, fighter_2: {...} }, round_2: {...} }
      currentRound: 1,
      ws: null,
      isConnected: false,
      competitorData: {}, // Almacena datos persistentes de los competidores

      // Acciones
      setCurrentView: (view) => set({ currentView: view }),
      setViewData: (data) => set({ viewData: data }),

      updateCombatData: (eventData) => set((state) => {
        const fighterData = eventData.data;
        
        // Validar que fighter_id no sea undefined o null
        if (!fighterData.fighter_id) {
          console.warn('fighter_id is undefined or null, skipping update');
          return state; // No actualizar si no hay fighter_id válido
        }
        
        const currentFighter = state.combatData[fighterData.fighter_id] || { 
          name: fighterData.competitor_name, 
          hitHistory: [],
          totalHits: 0 // Contador manejado en frontend
        };
        
        const newHit = {
          force: fighterData.force,
          velocity: fighterData.velocity,
          acceleration: fighterData.acceleration,
          timestamp: fighterData.timestamp,
          id: Date.now() + Math.random(), // ID único para el golpe
          expiresAt: Date.now() + 10000 // Expira en 10 segundos
        };
        
        // Filtrar golpes expirados y mantener solo los últimos 3
        const now = Date.now();
        const validHits = currentFighter.hitHistory.filter(hit => hit.expiresAt > now);
        const updatedHistory = [newHit, ...validHits].slice(0, 3);
        
        return {
          combatData: {
            ...state.combatData,
            [fighterData.fighter_id]: {
              name: fighterData.competitor_name,
              lastHit: newHit,
              hitHistory: updatedHistory,
              totalHits: (currentFighter.totalHits || 0) + 1 // Incrementar contador frontend
            }
          }
        };
      }),
      
      // Limpiar golpes expirados
      cleanExpiredHits: () => set((state) => {
        const now = Date.now();
        let hasChanges = false;
        const cleanedCombatData = {};

        for (const [fighterId, fighter] of Object.entries(state.combatData)) {
          const validHits = fighter.hitHistory?.filter(hit => hit.expiresAt > now) || [];
          
          // Solo crear nuevo objeto si realmente cambió el número de hits
          if (validHits.length !== fighter.hitHistory?.length) {
            hasChanges = true;
            cleanedCombatData[fighterId] = {
              ...fighter,
              hitHistory: validHits
            };
          } else {
            // Mantener la misma referencia si no hay cambios
            cleanedCombatData[fighterId] = fighter;
          }
        }
        
        // Solo actualizar el store si realmente hubo cambios
        if (hasChanges) {
          return { combatData: cleanedCombatData };
        }
        return {}; // No cambiar nada
      }),

      // Función para avanzar al siguiente round
      advanceToNextRound: () => set((state) => {
        const currentRoundKey = `round_${state.currentRound}`;
        
        // Guardar datos del round actual en el historial
        const updatedRoundsHistory = {
          ...state.roundsHistory,
          [currentRoundKey]: {
            ...state.combatData,
            roundNumber: state.currentRound,
            timestamp: Date.now()
          }
        };
        
        // Resetear datos de combate para el nuevo round
        const resetCombatData = {};
        Object.keys(state.combatData).forEach(fighterId => {
          resetCombatData[fighterId] = {
            name: state.combatData[fighterId]?.name || '',
            totalHits: 0,
            hitHistory: []
          };
        });
        
        return {
          roundsHistory: updatedRoundsHistory,
          currentRound: state.currentRound + 1,
          combatData: resetCombatData
        };
      }),
      
      // Función para resetear contadores (útil para nuevos rounds)
      resetPlayerCounters: () => set((state) => {
        const resetCombatData = {};
        Object.keys(state.combatData).forEach(fighterId => {
          resetCombatData[fighterId] = {
            ...state.combatData[fighterId],
            totalHits: 0,
            hitHistory: []
          };
        });
        return { combatData: resetCombatData };
      }),
      
      // Función para guardar el round actual en roundsHistory (sin avanzar round)
      saveCurrentRoundToHistory: () => set((state) => {
        // Filtrar keys inválidas del combatData
        const validCombatData = {};
        Object.keys(state.combatData).forEach(key => {
          if (key && key !== 'undefined' && key !== 'null') {
            validCombatData[key] = state.combatData[key];
          }
        });
        
        // Solo guardar si hay datos de combate válidos
        if (Object.keys(validCombatData).length === 0) {
          return state; // No cambiar nada si no hay datos válidos
        }
        
        const currentRoundKey = `round_${state.currentRound}`;
        
        // Verificar si ya existe este round en el historial
        if (state.roundsHistory[currentRoundKey]) {
          return state; // Ya existe, no duplicar
        }
        
        // Guardar datos del round actual en el historial (solo datos válidos)
        const updatedRoundsHistory = {
          ...state.roundsHistory,
          [currentRoundKey]: {
            ...validCombatData,
            roundNumber: state.currentRound,
            timestamp: Date.now()
          }
        };
        
        return {
          roundsHistory: updatedRoundsHistory
        };
      }),
      
      
      // Función para resetear toda la batalla
      resetBattle: () => set({
        combatData: {},
        roundsHistory: {},
        currentRound: 1,
        maxStatsData: {},
        // No reseteamos competitorData para mantener persistencia entre batallas
      }),
      
      // Mantener función legacy para compatibilidad
      setCombatData: (data) => set({ combatData: data }),
      
      // Funciones para manejar datos persistentes de competidores
      setCompetitorData: (competitor1, competitor2) => set((state) => {
        const updatedCompetitorData = { ...state.competitorData };
        
        if (competitor1) {
          updatedCompetitorData[1] = competitor1;
        }
        
        if (competitor2) {
          updatedCompetitorData[2] = competitor2;
        }
        
        return { competitorData: updatedCompetitorData };
      }),
      
      // Optimizada: Actualizar solo el peleador específico
      updateMaxStats: (fighterData) => set((state) => ({
        maxStatsData: {
          ...state.maxStatsData,
          [fighterData.fighter_id]: fighterData
        }
      })),
      
      setConnectionStatus: (status) => set({ isConnected: status }),

      // Inicializar WebSocket
      initWebSocket: () => {
        const ws = new WebSocket('ws://127.0.0.1:8080/ws');
        
        ws.onopen = () => {
          console.info('WebSocket connected');
          set({ ws, isConnected: true });
        };

        ws.onclose = () => {
          console.info('WebSocket disconnected');
          set({ isConnected: false });
        };

        ws.onerror = (error) => {
          console.info('WebSocket error:', error);
          set({ isConnected: false });
        };

        ws.onmessage = (event) => {
          const receivedData = JSON.parse(event.data);

          // Si es finalización o cancelación de combate, limpiar datos persistentes
          if (receivedData.viewType === 'combat_finished' || 
              receivedData.viewType === 'combat_cancelled') {
            get().clearPersistedData();
            return;
          }

          // Si es cambio a cover, solo cambiar vista sin limpiar datos
          if (receivedData.viewType === 'cover') {
            set({
              currentView: 'cover',
              viewData: receivedData
            });
            return;
          }

          // Si es round_advance, solo actualizar el round sin cambiar vista
          if (receivedData.viewType === 'round_advance') {
            get().advanceToNextRound();
            return;
          }

          // Si es live-combat, actualizar datos y cambiar vista si es necesario
          if (receivedData.viewType === 'live-combat') {
            const currentState = get();
            const fighterData = receivedData.data;
            
            // Si no hay fighter_id, es solo un cambio de vista (no un evento de combate)
            if (!fighterData || !fighterData.fighter_id) {
              // Solo cambiar vista si no estamos ya en live-combat
              if (currentState.currentView !== 'live-combat') {
                set({
                  currentView: 'live-combat',
                  viewData: receivedData
                });
              }
              return;
            }
            
            // Preparar actualización de combatData
            const currentFighter = currentState.combatData[fighterData.fighter_id] || { 
              name: fighterData.competitor_name, 
              hitHistory: [],
              totalHits: 0
            };
            
            const newHit = {
              force: fighterData.force,
              velocity: fighterData.velocity,
              acceleration: fighterData.acceleration,
              timestamp: fighterData.timestamp,
              id: Date.now() + Math.random(),
              expiresAt: Date.now() + 5000
            };
            
            const now = Date.now();
            const validHits = currentFighter.hitHistory.filter(hit => hit.expiresAt > now);
            const updatedHistory = [newHit, ...validHits].slice(0, 3);
            
            const updatedCombatData = {
              ...currentState.combatData,
              [fighterData.fighter_id]: {
                name: fighterData.competitor_name,
                lastHit: newHit,
                hitHistory: updatedHistory,
                totalHits: (currentFighter.totalHits || 0) + 1
              }
            };
            
            // Actualización atómica única
            if (currentState.currentView !== 'live-combat') {
              set({
                combatData: updatedCombatData,
                currentView: 'live-combat',
                viewData: receivedData
              });
            } else {
              // Solo actualizar combatData si ya estamos en live-combat
              set({
                combatData: updatedCombatData
              });
            }
            
            return;
          }

          // Si es resumen, solo cambiar vista sin limpiar datos
          if (receivedData.viewType === 'summary-stats') {
            set({
              viewData: receivedData,
              currentView: 'summary-stats',
            });
            return;
          }

          // Para otros tipos de mensaje, manejar cambios de vista normalmente
          set({
            viewData: receivedData,
            currentView: receivedData.viewType,
          })

          // Si es max_stats_update, actualizar solo ese peleador
          if (receivedData.type === 'max_stats_update') {
            get().updateMaxStats(receivedData.data);
          }
        };

        set({ ws });
      },

      // Cerrar WebSocket
      closeWebSocket: () => {
        const { ws } = get();
        if (ws) {
          ws.close();
          set({ ws: null, isConnected: false });
        }
      },

      // Limpiar todos los datos persistentes
      clearPersistedData: () => {
        // Limpiar localStorage
        localStorage.removeItem('websocket-storage');
        
        // Resetear estado a valores iniciales
        set({
          currentView: 'cover',
          viewData: {},
          combatData: {},
          maxStatsData: {},
          roundsHistory: {},
          currentRound: 1,
          competitorData: {},
          // ws: null,
          // isConnected: false
        });
      },

      // Limpiar el historial de rounds
      clearRoundsHistory: () => set({ roundsHistory: {} }),
      resetCurrentView: () => set({ currentView: 'cover' }),
    }),
    {
      name: 'websocket-storage',
      partialize: (state) => ({
        currentView: state.currentView,
        viewData: state.viewData,
        competitorData: state.competitorData,
        combatData: state.combatData,
        maxStatsData: state.maxStatsData,
        roundsHistory: state.roundsHistory,
        currentRound: state.currentRound
      })
    }
  )
);

export default useWebSocketStore;
