import { cn } from '@/lib/utils';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <main className={cn('pt-6 px-6 pb-10', className)}>
      {children}
    </main>
  );
}
