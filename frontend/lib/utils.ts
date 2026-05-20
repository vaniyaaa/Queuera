import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);

  if (Math.abs(diffMins) < 60) return `${Math.abs(diffMins)}m ${diffMs > 0 ? 'from now' : 'ago'}`;
  if (Math.abs(diffHours) < 24) return `${Math.abs(diffHours)}h ${diffMs > 0 ? 'from now' : 'ago'}`;
  return `${Math.abs(diffDays)}d ${diffMs > 0 ? 'from now' : 'ago'}`;
}
