import { Result } from 'ts-results';

import FirestoreRepository from '@repositories/FirestoreRepository';
import { Fighter } from '../models/Fighter';

class FighterService {
  private fighterRepository: FirestoreRepository<Fighter>;

  constructor(fighterRepository: FirestoreRepository<Fighter>) {
    this.fighterRepository = fighterRepository;
  }

  async registerFighter(fighter: Fighter): Promise<Result<Fighter, Error>> {
    return this.fighterRepository.create(fighter);
  }

  async listFighters(filters?: {
    [field: string]: unknown;
  }): Promise<Result<Fighter[], Error>> {
    return this.fighterRepository.index(filters);
  }

  async updateFighter(
    id: string,
    fighter: Fighter,
  ): Promise<Result<void, Error>> {
    return this.fighterRepository.update(id, fighter);
  }

  async deleteFighter(id: string): Promise<Result<void, Error>> {
    return this.fighterRepository.delete(id);
  }
}

export default FighterService;
