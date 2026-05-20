'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { ConnectedAccount } from '@/types/account';
import ConnectedAccountCard from '@/components/accounts/ConnectedAccountCard';
import ConnectPlatformButton from '@/components/accounts/ConnectPlatformButton';
import PageWrapper from '@/components/layout/PageWrapper';
import Spinner from '@/components/ui/Spinner';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [connecting, setConnecting] = useState<'FACEBOOK' | 'LINKEDIN' | null>(null);

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

  async function handleConnect(platform: 'FACEBOOK' | 'LINKEDIN') {
    setConnecting(platform);
    try {
      const endpoint = platform === 'FACEBOOK' ? '/auth/facebook/connect' : '/auth/linkedin/connect';
      const res = await api.get(endpoint);
      window.location.href = res.data.data.url;
    } catch {
      setConnecting(null);
      setError('Failed to start OAuth flow. Please try again.');
    }
  }

  function handleDisconnect(id: string) {
    setAccounts((prev) => prev.filter((a) => a._id !== id));
  }

  return (
    <PageWrapper>
      <div className="max-w-2xl">
        <div className="mb-8">
          <h2 className="text-base font-semibold text-slate-900 mb-1">Connect Platforms</h2>
          <p className="text-sm text-slate-500 mb-4">Connect your social media accounts to start scheduling posts.</p>
          <div className="flex flex-wrap gap-3">
            <ConnectPlatformButton
              platform="FACEBOOK"
              loading={connecting === 'FACEBOOK'}
              onClick={() => handleConnect('FACEBOOK')}
            />
            <ConnectPlatformButton
              platform="LINKEDIN"
              loading={connecting === 'LINKEDIN'}
              onClick={() => handleConnect('LINKEDIN')}
            />
          </div>
          {error && (
            <div className="mt-3 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-base font-semibold text-slate-900 mb-3">Connected Accounts</h2>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Spinner size="lg" />
            </div>
          ) : accounts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
              <p className="text-sm text-slate-500">No accounts connected yet.</p>
              <p className="text-xs text-slate-400 mt-1">Connect a platform above to get started.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {accounts.map((account) => (
                <ConnectedAccountCard
                  key={account._id}
                  account={account}
                  onDisconnect={handleDisconnect}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
