import { addToast } from '@heroui/react';

interface ToastOptions {
  description?: string;
}

export function showSuccessToast(title: string, options?: ToastOptions) {
  addToast({
    title,
    color: 'success',
    description: options?.description ?? undefined,
  });
}

export function showErrorToast(title: string, options?: ToastOptions) {
  addToast({
    title,
    color: 'danger',
    description: options?.description ?? undefined,
  });
}
