import Link from 'next/link';

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-slate-200">
        <div className="mx-auto max-w-3xl px-6 py-6">
          <Link href="/" className="text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
            Queuera
          </Link>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-3xl px-6 py-10">
        {children}
      </main>

      <footer className="border-t border-slate-200 mt-auto">
        <div className="mx-auto max-w-3xl px-6 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-slate-500">
          <p>© {year} Queuera. All rights reserved.</p>
          <nav className="flex gap-4">
            <Link href="/legal/privacy" className="hover:text-indigo-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/legal/terms" className="hover:text-indigo-600 transition-colors">
              Terms of Service
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
