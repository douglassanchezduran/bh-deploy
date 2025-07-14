import { Result } from 'ts-results';

export interface Crud<T> {
  create: (payload: T) => Promise<Result<T, Error>>;
  index: () => Promise<Result<T[], Error>>;
  show: (id: string) => Promise<Result<T | null, Error>>;
  update: (id: string, payload: Partial<T>) => Promise<Result<void, Error>>;
  delete: (id: string) => Promise<Result<void, Error>>;
}
