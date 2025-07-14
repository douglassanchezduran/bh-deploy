import { useCallback, useEffect, useState, useMemo } from 'react';

import { devErrorLog } from '@utils/devLog';
import { Fighter } from '../models/Fighter';
import FighterService from '../services/FighterService';
import FirestoreRepository from '@repositories/FirestoreRepository';

export function useFighters(fighterService?: FighterService) {
  // Si no se proporciona un servicio, crear uno por defecto usando useMemo
  const service = useMemo(() => {
    if (fighterService) return fighterService;
    const defaultRepository = new FirestoreRepository<Fighter>('players');
    return new FighterService(defaultRepository);
  }, [fighterService]);
  const [fighters, setFighters] = useState<Fighter[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFighters = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const result = await service.listFighters();
    if (result.ok) {
      setFighters(result.val);
      setIsLoading(false);
    } else {
      devErrorLog('Error al cargar peleadores: ', result.val.message);
      setError(result.val.message);
      setIsLoading(false);
    }
  }, [service]);

  useEffect(() => {
    fetchFighters();
  }, [fetchFighters]);

  return {
    fighters,
    isLoading,
    error,
    refetch: fetchFighters,
  };
}
