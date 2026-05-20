import { PostStatus } from '@/types/post';
import Badge from '@/components/ui/Badge';

interface PostStatusBadgeProps {
  status: PostStatus;
}

export default function PostStatusBadge({ status }: PostStatusBadgeProps) {
  if (status === 'QUEUED') {
    return <Badge variant="info">Scheduled</Badge>;
  }
  if (status === 'PUBLISHED') {
    return <Badge variant="success">Published</Badge>;
  }
  return <Badge variant="error">Failed</Badge>;
}
