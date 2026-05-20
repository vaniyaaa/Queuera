'use client';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="ml-60 pt-[60px]">
        <TopBar />
        <div className="mt-0">
          {children}
        </div>
      </div>
    </div>
  );
}
