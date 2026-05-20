'use client';

import { useCallback, useEffect, useState } from 'react';
import api from '@/lib/api';
import { ScheduledPost } from '@/types/post';

interface UsePostsOptions {
  fetchOnMount?: boolean;
}

export function usePosts(options: UsePostsOptions = {}) {
  const { fetchOnMount = true } = options;
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    setError('');
    try {
      const res = await api.get('/posts');
      setPosts(res.data.data);
    } catch {
      setError('Failed to load posts. Please try again.');
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (fetchOnMount) {
      fetchPosts(true);
    }
    const interval = setInterval(() => fetchPosts(false), 30000);
    return () => clearInterval(interval);
  }, [fetchPosts, fetchOnMount]);

  const refetch = useCallback(() => fetchPosts(true), [fetchPosts]);

  const deletePost = useCallback(async (id: string) => {
    await api.delete(`/posts/${id}`);
    setPosts((prev) => prev.filter((p) => p._id !== id));
  }, []);

  return { posts, loading, error, deletePost, refetch };
}
