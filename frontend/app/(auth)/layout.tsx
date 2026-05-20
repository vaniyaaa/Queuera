export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <span className="text-3xl font-bold text-indigo-600 tracking-tight">Queuera</span>
        <p className="mt-1 text-sm text-slate-500">Social media scheduling, simplified.</p>
      </div>
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-slate-200 px-8 py-10">
        {children}
      </div>
    </div>
  );
}