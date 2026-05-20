'use client';

import { ConnectedAccount } from '@/types/account';
import PlatformIcon from '@/components/accounts/PlatformIcon';
import { cn } from '@/lib/utils';

interface PlatformSelectorProps {
  accounts: ConnectedAccount[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export default function PlatformSelector({
  accounts,
  selectedIds,
  onChange,
}: PlatformSelectorProps) {
  function toggleAccount(id: string) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((sid) => sid !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {accounts.map((account) => {
        const selected = selectedIds.includes(account._id);
        return (
          <button
            key={account._id}
            type="button"
            onClick={() => toggleAccount(account._id)}
            className={cn(
              'flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-colors',
              selected
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-slate-200 bg-white hover:border-slate-300',
            )}
          >
            <PlatformIcon platform={account.platform} size={24} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900 truncate">
                {account.platformAccountName}
              </p>
              <p className="text-xs text-slate-500">{account.platform}</p>
            </div>
            <div
              className={cn(
                'h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center',
                selected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300',
              )}
            >
              {selected && (
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
