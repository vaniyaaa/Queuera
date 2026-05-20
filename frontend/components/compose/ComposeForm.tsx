'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { ConnectedAccount } from '@/types/account';
import { CreatePostPayload } from '@/types/post';
import { useToast } from '@/hooks/useToast';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import PlatformSelector from '@/components/compose/PlatformSelector';
import SchedulePicker from '@/components/compose/SchedulePicker';
import { cn } from '@/lib/utils';

interface ComposeFormProps {
  accounts: ConnectedAccount[];
}

interface AccountPostResult {
  accountId: string;
  accountName: string;
  platform: string;
  success: boolean;
  error?: string;
}

function postNowIso(): string {
  return new Date(Date.now() + 10000).toISOString();
}

export default function ComposeForm({ accounts }: ComposeFormProps) {
  const { addToast } = useToast();
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [isPostNow, setIsPostNow] = useState(true);
  const [scheduledAt, setScheduledAt] = useState(postNowIso);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<AccountPostResult[] | null>(null);

  const activeAccounts = accounts.filter((a) => a.isActive);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResults(null);

    if (selectedAccountIds.length === 0) {
      addToast({ message: 'Select at least one account', type: 'error' });
      return;
    }

    if (!content.trim()) {
      addToast({ message: 'Post content cannot be empty', type: 'error' });
      return;
    }

    const finalScheduledAt = isPostNow ? postNowIso() : scheduledAt;

    setSubmitting(true);
    try {
      const accountMap = new Map(activeAccounts.map((a) => [a._id, a]));
      const settled = await Promise.allSettled(
        selectedAccountIds.map((accountId) => {
          const payload: CreatePostPayload = {
            connectedAccountId: accountId,
            content: content.trim(),
            scheduledAt: finalScheduledAt,
          };
          return api.post('/posts', payload);
        }),
      );

      const postResults: AccountPostResult[] = selectedAccountIds.map((accountId, index) => {
        const account = accountMap.get(accountId);
        const outcome = settled[index];
        if (outcome.status === 'fulfilled') {
          return {
            accountId,
            accountName: account?.platformAccountName ?? 'Unknown',
            platform: account?.platform ?? '',
            success: true,
          };
        }
        const err = outcome.reason as { response?: { data?: { message?: string } } };
        return {
          accountId,
          accountName: account?.platformAccountName ?? 'Unknown',
          platform: account?.platform ?? '',
          success: false,
          error: err?.response?.data?.message ?? 'Failed to schedule post',
        };
      });

      setResults(postResults);

      const successCount = postResults.filter((r) => r.success).length;
      const failCount = postResults.length - successCount;

      if (failCount === 0) {
        addToast({
          message: isPostNow
            ? `Post queued for ${successCount} account${successCount > 1 ? 's' : ''}`
            : `Scheduled for ${successCount} account${successCount > 1 ? 's' : ''}`,
          type: 'success',
        });
        setContent('');
        setSelectedAccountIds([]);
      } else if (successCount === 0) {
        addToast({ message: 'Failed to schedule posts for all accounts', type: 'error' });
      } else {
        addToast({
          message: `Scheduled ${successCount} of ${postResults.length} accounts`,
          type: 'info',
        });
      }
    } catch {
      addToast({ message: 'Something went wrong. Please try again.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Platforms</h3>
          <p className="text-xs text-slate-500 mb-4">Select one or more accounts to post to</p>
          {activeAccounts.length === 0 ? (
            <p className="text-sm text-slate-500">No active accounts available.</p>
          ) : (
            <PlatformSelector
              accounts={activeAccounts}
              selectedIds={selectedAccountIds}
              onChange={setSelectedAccountIds}
            />
          )}
        </Card>

        <Card>
          <label htmlFor="post-content" className="block text-sm font-semibold text-slate-900 mb-1">
            Content
          </label>
          <textarea
            id="post-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            placeholder="What would you like to share?"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
          />
          <p className="mt-2 text-xs text-slate-500 text-right">{content.length} characters</p>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Schedule</h3>
          <SchedulePicker
            value={scheduledAt}
            onChange={setScheduledAt}
            isPostNow={isPostNow}
            onPostNowChange={setIsPostNow}
          />
        </Card>

        <Button
          type="submit"
          loading={submitting}
          disabled={activeAccounts.length === 0}
          className="w-full sm:w-auto"
        >
          {isPostNow ? 'Post Now' : 'Schedule Post'}
        </Button>

        {results && results.length > 0 && (
          <Card className="mt-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Results</h3>
            <ul className="space-y-2">
              {results.map((result) => (
                <li
                  key={result.accountId}
                  className={cn(
                    'flex items-center justify-between rounded-lg px-3 py-2 text-sm',
                    result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800',
                  )}
                >
                  <span>
                    {result.accountName}
                    <span className="text-xs opacity-70 ml-1">({result.platform})</span>
                  </span>
                  <span className="font-medium">
                    {result.success ? 'Scheduled' : result.error}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        )}
    </form>
  );
}
