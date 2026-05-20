'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { ToastItem } from '@/hooks/useToast';

interface ToastProps {
  toasts: ToastItem[];
  removeToast: (id: string) => void;
}

const typeStyles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

function ToastEntry({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start justify-between gap-3 w-80 rounded-lg border px-4 py-3 shadow-lg transition-all duration-300 ease-out',
        typeStyles[toast.type],
        visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
      )}
    >
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="text-current opacity-60 hover:opacity-100 shrink-0"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}

export default function Toast({ toasts, removeToast }: ToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <ToastEntry key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}
