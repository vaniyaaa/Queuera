'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { ScheduledPost } from '@/types/post';
import { ConnectedAccount } from '@/types/account';
import Card from '@/components/ui/Card';
import PageWrapper from '@/components/layout/PageWrapper';
import Spinner from '@/components/ui/Spinner';
import { formatRelativeTime } from '@/lib/utils';

export default function DashboardPage() {
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [postsRes, accountsRes] = await Promise.all([
          api.get('/posts'),
          api.get('/auth/accounts'),
        ]);
        setPosts(postsRes.data.data);
        setAccounts(accountsRes.data.data);
      } catch {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <div className="text-red-600 text-sm">{error}</div>
      </PageWrapper>
    );
  }

  const queued = posts.filter((p) => p.status === 'QUEUED');
  const recent = posts.slice(0, 5);

  const stats = [
    { label: 'Total Posts', value: posts.length, color: 'border-indigo-500' },
    { label: 'Scheduled', value: queued.length, color: 'border-amber-500' },
    { label: 'Connected Accounts', value: accounts.length, color: 'border-emerald-500' },
  ];

  return (
    <PageWrapper>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className={cn('border-l-4', stat.color)}>
            <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="text-base font-semibold text-slate-900 mb-4">Recent Posts</h2>
        {recent.length === 0 ? (
          <p className="text-sm text-slate-500">No posts yet. <a href="/compose" className="text-indigo-600 hover:underline">Create your first post →</a></p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recent.map((post) => (
              <li key={post._id} className="py-3 flex items-center justify-between gap-4">
                <p className="text-sm text-slate-700 truncate flex-1">
                  {post.content.slice(0, 80)}{post.content.length > 80 ? '…' : ''}
                </p>
                <span className={cn(
                  'text-xs px-2 py-1 rounded-full font-medium shrink-0',
                  post.status === 'QUEUED' && 'bg-blue-100 text-blue-700',
                  post.status === 'PUBLISHED' && 'bg-green-100 text-green-700',
                  post.status === 'FAILED' && 'bg-red-100 text-red-700',
                )}>
                  {post.status === 'QUEUED' ? 'Scheduled' : post.status === 'PUBLISHED' ? 'Published' : 'Failed'}
                </span>
                <span className="text-xs text-slate-400 shrink-0">{formatRelativeTime(post.scheduledAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </PageWrapper>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
