import { cn } from '@/lib/utils';

interface BadgeProps {
  variant: 'success' | 'warning' | 'error' | 'info' | 'facebook' | 'instagram' | 'linkedin';
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant, children, className }: BadgeProps) {
  const variants = {
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    facebook: 'bg-blue-100 text-blue-700',
    instagram: 'bg-pink-100 text-pink-700',
    linkedin: 'bg-sky-100 text-sky-700',
  };
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
}
