export type PostStatus = 'QUEUED' | 'PUBLISHED' | 'FAILED';

export interface ScheduledPost {
  _id: string;
  userId: string;
  connectedAccountId: string;
  platform: string;
  content: string;
  mediaUrls: string[];
  scheduledAt: string;
  status: PostStatus;
  publishedAt?: string;
  failureReason?: string;
  createdAt: string;
}

export interface CreatePostPayload {
  connectedAccountId: string;
  content: string;
  mediaUrls?: string[];
  scheduledAt: string;
}
