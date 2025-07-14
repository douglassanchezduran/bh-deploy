import { db, storage } from './firebase.config.js';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  QueryConstraint,
  where,
  query,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Err, Ok, Result } from 'ts-results';

import { Crud } from '@app-types/crud.js';

class FirestoreRepository<T> implements Crud<T> {
  private _collection: string;

  constructor(collectionName: string) {
    this._collection = collectionName;
  }

  async create(payload: T): Promise<Result<T, Error>> {
    try {
      const docRef = await addDoc(
        collection(db, this._collection),
        payload as unknown,
      );

      const docSnap = await getDoc(docRef);
      return Ok({ id: docRef.id, ...(docSnap.data() as T) });
    } catch (error) {
      return Err(error instanceof Error ? error : new Error('Error al crear'));
    }
  }

  async index(filters?: {
    [field: string]: unknown;
  }): Promise<Result<T[], Error>> {
    try {
      const constraints: QueryConstraint[] = [];
      if (filters) {
        for (const [field, value] of Object.entries(filters)) {
          constraints.push(where(field, '==', value));
        }
      }
      const q = constraints.length
        ? query(collection(db, this._collection), ...constraints)
        : collection(db, this._collection);

      const querySnapshot = await getDocs(q);
      return Ok(
        querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as T),
        })),
      );
    } catch (error) {
      return Err(
        error instanceof Error
          ? error
          : new Error('Error al obtener documentos'),
      );
    }
  }

  async show(id: string): Promise<Result<T | null, Error>> {
    try {
      const docRef = doc(db, this._collection, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return Ok({ id, ...(docSnap.data() as T) });
      }
      return Ok(null);
    } catch (error) {
      return Err(
        error instanceof Error ? error : new Error('Error al buscar documento'),
      );
    }
  }

  async update(id: string, payload: Partial<T>): Promise<Result<void, Error>> {
    try {
      const docRef = doc(db, this._collection, id);
      await updateDoc(docRef, payload);
      return Ok(undefined);
    } catch (error) {
      return Err(
        error instanceof Error ? error : new Error('Error al actualizar'),
      );
    }
  }

  async delete(id: string): Promise<Result<void, Error>> {
    try {
      const docRef = doc(db, this._collection, id);
      await deleteDoc(docRef);
      return Ok(undefined);
    } catch (error) {
      return Err(
        error instanceof Error ? error : new Error('Error al eliminar'),
      );
    }
  }

  uploadImage = async (
    file: File,
    name: string,
  ): Promise<Result<string, Error>> => {
    try {
      const safeName = name.replace(/\s+/g, '_') || 'image';
      const storageRef = ref(
        storage,
        `${this._collection}/${safeName}_${Date.now()}/photo.jpg`,
      );

      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return Ok(url);
    } catch (error) {
      return Err(
        error instanceof Error
          ? error
          : new Error('Error al intentar subir la imagen'),
      );
    }
  };
}

export default FirestoreRepository;
