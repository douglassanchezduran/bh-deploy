import { useState } from 'react';

import FirestoreRepository from '@repositories/FirestoreRepository';
import { Err, Ok } from 'ts-results';

export function useUploadImage<T>(repository: FirestoreRepository<T>) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File, name: string) => {
    setIsUploading(true);
    setError(null);

    const result = await repository.uploadImage(file, name);
    setIsUploading(false);

    if (result.ok) {
      return Ok(result.val);
    } else {
      setError(result.val.message);
      return Err(result.val);
    }
  };

  return { uploadImage, isUploading, error };
}
