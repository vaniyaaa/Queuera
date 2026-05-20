'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { ConnectedAccount } from '@/types/account';
import { PostStatus } from '@/types/post';
import { usePosts } from '@/hooks/usePosts';
import PostCard from '@/components/posts/PostCard';
import PageWrapper from '@/components/layout/PageWrapper';
import Spinner from '@/components/ui/Spinner';
import { cn } from '@/lib/utils';

type TabStatus = PostStatus;

const TABS: { status: TabStatus; label: string }[] = [
  { status: 'QUEUED', label: 'Scheduled' },
  { status: 'PUBLISHED', label: 'Published' },
  { status: 'FAILED', label: 'Failed' },
];

const EMPTY_MESSAGES: Record<TabStatus, { message: string; link?: { href: string; label: string } }> = {
  QUEUED: {
    message: 'No scheduled posts. Go to Compose to create one.',
    link: { href: '/compose', label: 'Go to Compose' },
  },
  PUBLISHED: {
    message: 'No published posts yet. Scheduled posts appear here after they go live.',
  },
  FAILED: {
    message: 'No failed posts. Posts that fail to publish will show up here.',
  },
};

export default function ScheduledPage() {
  const { posts, loading: postsLoading, error: postsError, deletePost, refetch } = usePosts({
    fetchOnMount: false,
  });
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [accountsError, setAccountsError] = useState('');
  const [activeTab, setActiveTab] = useState<TabStatus>('QUEUED');
  const fetchAccounts = useCallback(async () => {
    setAccountsLoading(true);
    setAccountsError('');
    try {
      const res = await api.get('/auth/accounts');
      setAccounts(res.data.data);
    } catch {
      setAccountsError('Failed to load accounts. Please try again.');
    } finally {
      setAccountsLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.all([refetch(), fetchAccounts()]).catch(() => {});
  }, [refetch, fetchAccounts]);

  const loading = postsLoading || accountsLoading;
  const error = postsError || accountsError;

  const counts = useMemo(
    () => ({
      QUEUED: posts.filter((p) => p.status === 'QUEUED').length,
      PUBLISHED: posts.filter((p) => p.status === 'PUBLISHED').length,
      FAILED: posts.filter((p) => p.status === 'FAILED').length,
    }),
    [posts],
  );

  const filteredPosts = useMemo(
    () => posts.filter((p) => p.status === activeTab),
    [posts, activeTab],
  );

  async function handleRetry() {
    await Promise.all([refetch(), fetchAccounts()]);
  }

  async function handleDelete(id: string) {
    try {
      await deletePost(id);
    } catch {
      window.alert('Failed to delete post. It may already be published.');
    }
  }

  const emptyState = EMPTY_MESSAGES[activeTab];

  return (
    <PageWrapper>
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Scheduled Posts</h1>
          <p className="text-sm text-slate-500 mt-1">
            View and manage your scheduled, published, and failed posts.
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
              onClick={handleRetry}
              className="ml-2 font-medium underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-1 border-b border-slate-200 mb-6">
              {TABS.map((tab) => (
                <button
                  key={tab.status}
                  type="button"
                  onClick={() => setActiveTab(tab.status)}
                  className={cn(
                    'px-4 py-2.5 text-sm font-medium transition-colors -mb-px border-b-2',
                    activeTab === tab.status
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700',
                  )}
                >
                  {tab.label}
                  <span
                    className={cn(
                      'ml-1.5 rounded-full px-1.5 py-0.5 text-xs',
                      activeTab === tab.status
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-slate-100 text-slate-600',
                    )}
                  >
                    {counts[tab.status]}
                  </span>
                </button>
              ))}
            </div>

            {filteredPosts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center">
                <p className="text-sm text-slate-600">{emptyState.message}</p>
                {emptyState.link && (
                  <Link
                    href={emptyState.link.href}
                    className="inline-block mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    {emptyState.link.label} →
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredPosts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    accounts={accounts}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </PageWrapper>
  );
}
