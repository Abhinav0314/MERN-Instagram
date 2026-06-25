"use client";

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/apiClient';
import { useRouter } from 'next/navigation';
import PostCard from '@/components/PostCard';
import PostModal from '@/components/PostModal';

export default function Feed() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedPost, setSelectedPost] = useState(null);

  const { data: user, isLoading: userLoading, isError: userError } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data } = await api.get('/user/me');
      return data.user;
    },
    retry: false
  });

  useEffect(() => {
    if (!userLoading && (userError || !user)) {
      router.push('/login');
    }
  }, [user, userLoading, userError, router]);

  const { data: postsData, isLoading: loading, isError } = useQuery({
    queryKey: ['feed'],
    queryFn: async () => {
      const { data } = await api.get('/post/');
      if (!data.success) throw new Error("Failed to fetch posts");
      return data;
    }
  });

  const posts = postsData?.posts || [];

  const likeMutation = useMutation({
    mutationFn: async (postId) => {
      const { data } = await api.post(`/post/${postId}/like`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    }
  });

  const handleLike = (postId) => {
    likeMutation.mutate(postId);
  };

  const handleUpdatePost = (updatedPost) => {
    queryClient.invalidateQueries({ queryKey: ['feed'] });
    if (updatedPost._deleted) {
      if (selectedPost && selectedPost._id === updatedPost._id) {
          setSelectedPost(null);
      }
      return;
    }
    if (selectedPost && selectedPost._id === updatedPost._id) {
        setSelectedPost(updatedPost);
    }
  };

  if (loading) {
    return (
      <div className="container py-0 py-md-4 px-0 px-md-3">
        <div className="row justify-content-center m-0">
          <div className="col-12 col-md-8 col-lg-6 px-0 px-md-3">
            <h2 className="mb-4 d-none d-md-block skeleton skeleton-text" style={{ width: '150px', height: '28px' }}></h2>
            {[1, 2, 3].map(i => (
              <div key={i} className="post-card border-0 border-md" style={{ background: 'var(--card-bg)' }}>
                <div className="post-header">
                  <div className="skeleton skeleton-avatar me-3"></div>
                  <div className="skeleton skeleton-text medium mb-0"></div>
                </div>
                <div className="skeleton skeleton-image"></div>
                <div className="p-3">
                  <div className="d-flex mb-3 gap-3">
                    <div className="skeleton skeleton-avatar" style={{ width: '28px', height: '28px' }}></div>
                    <div className="skeleton skeleton-avatar" style={{ width: '28px', height: '28px' }}></div>
                    <div className="skeleton skeleton-avatar" style={{ width: '28px', height: '28px' }}></div>
                  </div>
                  <div className="skeleton skeleton-text short"></div>
                  <div className="skeleton skeleton-text" style={{ width: '100%' }}></div>
                  <div className="skeleton skeleton-text medium"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return <div className="container mt-5 text-center text-danger">Error loading feed.</div>;
  }

  return (
    <div className="container py-0 py-md-4 px-0 px-md-3">
      <div className="row justify-content-center m-0">
        <div className="col-12 col-md-8 col-lg-6 px-0 px-md-3">
          <h2 className="mb-4 d-none d-md-block">Your Feed</h2>
          
          {posts.length === 0 ? (
            <div className="glass-card p-5 text-center border-0">
              <i className="bi bi-camera text-muted fs-1 mb-3 d-block"></i>
              <h4>No Posts Yet</h4>
              <p className="text-muted">Follow some users to see their posts here!</p>
            </div>
          ) : (
            posts.map(post => (
                <PostCard 
                  key={post._id} 
                  post={post} 
                  currentUserId={user?._id}
                  onLike={handleLike}
                  onCommentClick={(p) => setSelectedPost(p)}
                />
            ))
          )}
        </div>
      </div>
      
      {selectedPost && (
        <PostModal 
            post={selectedPost} 
            onClose={() => setSelectedPost(null)} 
            onUpdatePost={handleUpdatePost} 
            hideImageOnMobile={true}
        />
      )}
    </div>
  );
}
