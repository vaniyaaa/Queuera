'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { ConnectedAccount } from '@/types/account';
import ComposeForm from '@/components/compose/ComposeForm';
import PageWrapper from '@/components/layout/PageWrapper';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';

export default function ComposePage() {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAccounts();
  }, []);

  async function fetchAccounts() {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/auth/accounts');
      setAccounts(res.data.data);
    } catch {
      setError('Failed to load accounts. Please refresh.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageWrapper>
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Compose</h1>
          <p className="text-sm text-slate-500 mt-1">
            Create and schedule posts across your connected accounts.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
            <button
              type="button"
              onClick={fetchAccounts}
              className="ml-2 font-medium underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        ) : accounts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center">
            <p className="text-sm text-slate-600">No connected accounts yet.</p>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Connect a social account before composing a post.
            </p>
            <Link href="/accounts">
              <Button>Go to Accounts</Button>
            </Link>
          </div>
        ) : (
          <ComposeForm accounts={accounts} />
        )}
      </div>
    </PageWrapper>
  );
}
