'use client';
import { useState } from 'react';
import { ConnectedAccount } from '@/types/account';
import api from '@/lib/api';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import PlatformIcon from './PlatformIcon';
import { formatDate } from '@/lib/utils';

interface ConnectedAccountCardProps {
  account: ConnectedAccount;
  onDisconnect: (id: string) => void;
}

export default function ConnectedAccountCard({ account, onDisconnect }: ConnectedAccountCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const platformVariant = account.platform === 'FACEBOOK'
    ? 'facebook'
    : account.platform === 'INSTAGRAM'
    ? 'instagram'
    : 'linkedin';

  async function handleDisconnect() {
    if (!window.confirm(`Disconnect ${account.platformAccountName}? Any scheduled posts for this account will be cancelled.`)) return;
    setLoading(true);
    setError('');
    try {
      await api.delete(`/auth/accounts/${account._id}`);
      onDisconnect(account._id);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'Failed to disconnect account.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
          <PlatformIcon platform={account.platform} size={22} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{account.platformAccountName}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={platformVariant}>
              {account.platform === 'FACEBOOK' ? 'Facebook' : account.platform === 'INSTAGRAM' ? 'Instagram' : 'LinkedIn'}
            </Badge>
            <span className="text-xs text-slate-400">Connected {formatDate(account.createdAt)}</span>
          </div>
          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
      </div>
      <Button variant="danger" size="sm" loading={loading} onClick={handleDisconnect}>
        Disconnect
      </Button>
    </div>
  );
}
