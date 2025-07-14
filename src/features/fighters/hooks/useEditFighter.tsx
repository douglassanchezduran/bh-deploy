import { useState } from 'react';

import FighterService from '../services/FighterService';
import { Fighter } from '../models/Fighter';

export function useEditFighter(fighterService: FighterService) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function editFighter(fighter: Fighter): Promise<boolean> {
    setIsLoading(true);
    setError(null);

    const result = await fighterService.updateFighter(fighter.id, fighter);
    if (result.ok) {
      setIsLoading(false);
      return true;
    } else {
      setError(result.val.message);
      setIsLoading(false);
      return false;
    }
  }

  return { editFighter, isLoading, error };
}
