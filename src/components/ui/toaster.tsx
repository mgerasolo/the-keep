'use client';

/**
 * Toast Notification System
 * Uses Sonner for toast notifications
 */

import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner';

/**
 * Toast types with consistent styling
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

/**
 * Show a toast notification
 */
export function showToast(type: ToastType, message: string, options?: ToastOptions) {
  const { description, action, duration } = options ?? {};

  const toastOptions = {
    description,
    duration: duration ?? (type === 'error' ? undefined : 3000), // Errors persist
    action: action
      ? {
          label: action.label,
          onClick: action.onClick,
        }
      : undefined,
  };

  switch (type) {
    case 'success':
      return sonnerToast.success(message, toastOptions);
    case 'error':
      return sonnerToast.error(message, toastOptions);
    case 'warning':
      return sonnerToast.warning(message, toastOptions);
    case 'info':
      return sonnerToast.info(message, toastOptions);
  }
}

/**
 * Convenience functions
 */
export const toast = {
  success: (message: string, options?: ToastOptions) => showToast('success', message, options),
  error: (message: string, options?: ToastOptions) => showToast('error', message, options),
  warning: (message: string, options?: ToastOptions) => showToast('warning', message, options),
  info: (message: string, options?: ToastOptions) => showToast('info', message, options),
  dismiss: sonnerToast.dismiss,
};

/**
 * Toaster component - add to layout
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: 'bg-surface border-border',
          title: 'text-foreground',
          description: 'text-foreground-secondary',
          actionButton: 'bg-accent text-white',
          cancelButton: 'bg-surface-hover text-foreground',
          error: 'bg-red-950 border-red-900',
          success: 'bg-green-950 border-green-900',
          warning: 'bg-yellow-950 border-yellow-900',
          info: 'bg-blue-950 border-blue-900',
        },
      }}
      expand={true}
      richColors
    />
  );
}
