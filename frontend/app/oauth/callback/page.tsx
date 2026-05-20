'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Spinner from '@/components/ui/Spinner';

function OAuthCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [platform, setPlatform] = useState('');
  const [pages, setPages] = useState<string | null>(null);

  useEffect(() => {
    const s = searchParams.get('status');
    const p = searchParams.get('platform');
    const pg = searchParams.get('pages');
    const msg = searchParams.get('message');

    setPlatform(p ?? '');
    setPages(pg);

    if (s === 'success') {
      setStatus('success');
      setTimeout(() => router.push('/accounts'), 2000);
    } else {
      setStatus('error');
      setMessage(msg ?? 'OAuth authorization failed. Please try again.');
    }
  }, [searchParams, router]);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-sm text-slate-500">Completing authorization...</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-slate-900">
            {platform ? `${platform.charAt(0).toUpperCase() + platform.slice(1).toLowerCase()} connected!` : 'Account connected!'}
          </p>
          {pages && (
            <p className="text-sm text-slate-500 mt-1">{pages} page{pages !== '1' ? 's' : ''} linked to your account.</p>
          )}
          <p className="text-sm text-slate-400 mt-2">Redirecting to accounts...</p>
        </div>
        <Spinner size="sm" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-base font-semibold text-slate-900">Connection failed</p>
        <p className="text-sm text-slate-500 mt-1">{message}</p>
      </div>
      <a
        href="/accounts"
        className="text-sm text-indigo-600 font-medium hover:underline"
      >
        ← Back to Accounts
      </a>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-10 w-full max-w-md text-center">
        <p className="text-xl font-bold text-indigo-600 mb-8">Queuera</p>
        <Suspense fallback={<Spinner size="lg" />}>
          <OAuthCallbackContent />
        </Suspense>
      </div>
    </div>
  );
}
