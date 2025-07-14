import { useState } from 'react';

import FighterService from '../services/FighterService';
import { Fighter } from '../models/Fighter';

export function useCreateFighter(fighterService: FighterService) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function createFighter(
    fighter: Omit<Fighter, 'id'>,
  ): Promise<Fighter | null> {
    setIsLoading(true);
    setError(null);

    const result = await fighterService.registerFighter(fighter as Fighter);
    if (result.ok) {
      setIsLoading(false);
      return result.val;
    } else {
      setError(result.val.message);
      setIsLoading(false);
      return null;
    }
  }

  return { createFighter, isLoading, error };
}
