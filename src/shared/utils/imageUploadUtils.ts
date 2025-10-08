const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Solo se permiten archivos JPG y PNG';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'El archivo debe ser menor a 2MB';
  }
  return null;
}
