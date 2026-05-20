'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';
import Toast from '@/components/ui/Toast';
import type { ToastItem, ToastType } from '@/hooks/useToast';

interface ToastContextValue {
  toasts: ToastItem[];
  addToast: (options: { message: string; type: ToastType }) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

type ToastAction =
  | { type: 'ADD'; payload: ToastItem }
  | { type: 'REMOVE'; payload: string };

function toastReducer(state: ToastItem[], action: ToastAction): ToastItem[] {
  switch (action.type) {
    case 'ADD':
      return [...state, action.payload];
    case 'REMOVE':
      return state.filter((t) => t.id !== action.payload);
    default:
      return state;
  }
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, dispatch] = useReducer(toastReducer, []);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const removeToast = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    dispatch({ type: 'REMOVE', payload: id });
  }, []);

  const addToast = useCallback(
    ({ message, type }: { message: string; type: ToastType }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const item: ToastItem = { id, message, type };
      dispatch({ type: 'ADD', payload: item });

      const timer = setTimeout(() => {
        removeToast(id);
      }, 4000);
      timersRef.current.set(id, timer);
    },
    [removeToast],
  );

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <Toast toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}
