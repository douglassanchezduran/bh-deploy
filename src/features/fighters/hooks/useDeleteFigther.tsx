import { useState } from 'react';
import FighterService from '../services/FighterService';

export function useDeleteFighter(fighterService: FighterService) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function deleteFighter(id: string): Promise<boolean> {
    setIsLoading(true);
    setError(null);

    const result = await fighterService.deleteFighter(id);
    if (result.ok) {
      setIsLoading(false);
      return true;
    } else {
      setError(result.val.message);
      setIsLoading(false);
      return false;
    }
  }

  return { deleteFighter, isLoading, error };
}
