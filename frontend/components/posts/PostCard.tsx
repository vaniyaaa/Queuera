'use client';

import { ScheduledPost } from '@/types/post';
import { ConnectedAccount } from '@/types/account';
import PlatformIcon from '@/components/accounts/PlatformIcon';
import PostStatusBadge from '@/components/posts/PostStatusBadge';
import Button from '@/components/ui/Button';
import { formatDate, formatRelativeTime } from '@/lib/utils';

interface PostCardProps {
  post: ScheduledPost;
  accounts: ConnectedAccount[];
  onDelete: (id: string) => void;
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}…`;
}

export default function PostCard({ post, accounts, onDelete }: PostCardProps) {
  const account = accounts.find((a) => a._id === post.connectedAccountId);

  function handleDelete() {
    if (!window.confirm('Cancel this scheduled post?')) return;
    onDelete(post._id);
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
            {account ? (
              <PlatformIcon platform={account.platform} size={22} />
            ) : (
              <span className="text-xs text-slate-400">?</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <p className="text-sm font-semibold text-slate-900">
                {account?.platformAccountName ?? 'Unknown account'}
              </p>
              <PostStatusBadge status={post.status} />
            </div>
            <p className="text-sm text-slate-600 whitespace-pre-wrap break-words">
              {truncate(post.content, 120)}
            </p>
            <p className="text-xs text-slate-500 mt-2">
              {formatRelativeTime(post.scheduledAt)}
              <span className="text-slate-300 mx-1">·</span>
              {formatDate(post.scheduledAt)}
            </p>
            {post.status === 'FAILED' && post.failureReason && (
              <p className="text-xs text-red-600 mt-1">{post.failureReason}</p>
            )}
          </div>
        </div>
        {post.status === 'QUEUED' && (
          <Button variant="danger" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}
