"use client";

import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import api from '@/utils/apiClient';
import PostModal from '@/components/PostModal';
import PostCard from '@/components/PostCard';
import Image from 'next/image';
import { LogOut, Grid, Bookmark, UserSquare, Camera, Heart, MessageCircle, ArrowLeft } from 'lucide-react';

export default function UserDashboard() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('posts');
    const [selectedPost, setSelectedPost] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [scrollToPostId, setScrollToPostId] = useState(null);

    useEffect(() => {
        if (viewMode === 'list' && scrollToPostId) {
            setTimeout(() => {
                const element = document.getElementById(`post-${scrollToPostId}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'auto', block: 'start' });
                }
            }, 100);
        }
    }, [viewMode, scrollToPostId]);

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

    const { data: postsData, isLoading: loading } = useQuery({
        queryKey: ['userPosts', user?._id],
        queryFn: async () => {
            const { data } = await api.get(`/post/user/${user._id}`);
            return data;
        },
        enabled: !!user?._id,
    });

    const { data: savedPostsData, isLoading: loadingSaved } = useQuery({
        queryKey: ['savedPosts'],
        queryFn: async () => {
            const { data } = await api.get(`/user/saved`);
            return data;
        },
        enabled: !!user && activeTab === 'saved',
    });

    const { data: taggedPostsData, isLoading: loadingTagged } = useQuery({
        queryKey: ['taggedPosts', user?._id],
        queryFn: async () => {
            const { data } = await api.get(`/post/tagged/${user._id}`);
            return data;
        },
        enabled: !!user?._id && activeTab === 'tagged',
    });

    const posts = postsData?.posts || [];
    const savedPosts = savedPostsData?.posts || [];
    const taggedPosts = taggedPostsData?.posts || [];

    const handleLogout = async () => {
        try {
            await api.post('/user/logout');
            localStorage.removeItem('token');
            queryClient.clear();
            router.push('/login');
        } catch (e) {
            console.error(e);
        }
    };

    const handleUpdatePost = (updatedPost) => {
        queryClient.invalidateQueries({ queryKey: ['userPosts'] });
        queryClient.invalidateQueries({ queryKey: ['savedPosts'] });
        queryClient.invalidateQueries({ queryKey: ['taggedPosts'] });
        
        if (selectedPost && selectedPost._id === updatedPost._id) {
            if (updatedPost._deleted) {
                setSelectedPost(null);
            } else {
                setSelectedPost(updatedPost);
            }
        }
    };

    const likeMutation = useMutation({
        mutationFn: async (postId) => {
            const { data } = await api.put('/post/like', { postId });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userPosts'] });
            queryClient.invalidateQueries({ queryKey: ['savedPosts'] });
            queryClient.invalidateQueries({ queryKey: ['taggedPosts'] });
        }
    });

    const handleLike = (postId) => {
        likeMutation.mutate(postId);
    };

    if (!user) return null;

    return (
        <div className="w-100 px-0 px-md-3 pb-5 mx-auto" style={{ maxWidth: '975px' }}>
            {viewMode === 'grid' ? (
                <>
            <div className="profile-header-container mt-2 mt-md-5 mb-4">
                
                {/* Desktop Layout (Hidden on Mobile) */}
                <div className="d-none d-md-flex align-items-start px-4 mb-5">
                    <div className="me-5 pe-4">
                        <Image 
                            src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.name || user.username}&background=random&size=200`} 
                            alt="Profile" 
                            width={150}
                            height={150}
                            className="profile-avatar-large"
                        />
                    </div>
                    <div className="flex-grow-1">
                        <div className="d-flex align-items-center mb-4">
                            <h4 className="me-4 mb-0 fw-normal" style={{ fontSize: '1.25rem' }}>{user.username}</h4>
                            <button onClick={() => router.push('/edit-profile')} className="btn btn-profile fw-bold shadow-sm">Edit profile</button>
                        </div>
                        <div className="d-flex gap-5 mb-4 fs-6">
                            <span><span className="fw-bold">{posts.length}</span> posts</span>
                            <span><span className="fw-bold">{user.followers?.length || 0}</span> followers</span>
                            <span><span className="fw-bold">{user.following?.length || 0}</span> following</span>
                        </div>
                        <div className="fs-6">
                            <span className="fw-bold d-block mb-1">{user.name || user.username}</span>
                            {user.bio && <span className="d-block mb-1" style={{ whiteSpace: 'pre-wrap' }}>{user.bio}</span>}
                        </div>
                    </div>
                </div>

                {/* Mobile Layout (Hidden on Desktop) */}
                <div className="d-flex d-md-none flex-column px-3 mb-3 mt-2">
                    {/* Username and Settings at the top */}
                    <div className="d-flex align-items-center mb-4">
                        <h4 className="fw-bold mb-0 me-auto" style={{ fontSize: '1.3rem' }}>{user.username}</h4>
                        <button onClick={handleLogout} className="btn btn-light p-1 px-2 border-0 bg-transparent text-danger" style={{ fontSize: '1.3rem' }} title="Logout">
                            <LogOut size={24} />
                        </button>
                    </div>
                    
                    {/* Avatar & Stats Row */}
                    <div className="d-flex align-items-center mb-3">
                        <div className="me-4 flex-shrink-0">
                            <Image 
                                src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.name || user.username}&background=random&size=150`} 
                                alt="Profile" 
                                width={80}
                                height={80}
                                className="profile-avatar-small rounded-circle"
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <div className="flex-grow-1 d-flex justify-content-between text-center px-2">
                            <div className="stats-item d-flex flex-column">
                                <span className="fw-bold fs-5 lh-1">{posts.length}</span>
                                <span className="text-muted" style={{ fontSize: '0.8rem' }}>posts</span>
                            </div>
                            <div className="stats-item d-flex flex-column">
                                <span className="fw-bold fs-5 lh-1">{user.followers?.length || 0}</span>
                                <span className="text-muted" style={{ fontSize: '0.8rem' }}>followers</span>
                            </div>
                            <div className="stats-item d-flex flex-column">
                                <span className="fw-bold fs-5 lh-1">{user.following?.length || 0}</span>
                                <span className="text-muted" style={{ fontSize: '0.8rem' }}>following</span>
                            </div>
                        </div>
                    </div>

                    {/* Bio Row */}
                    <div className="mb-3 fs-6 lh-sm">
                        <span className="fw-bold d-block mb-1">{user.name || user.username}</span>
                        {user.bio && <span className="d-block mb-1" style={{ whiteSpace: 'pre-wrap' }}>{user.bio}</span>}
                    </div>

                    {/* Action Buttons Row */}
                    <div className="d-flex gap-2">
                        <button onClick={() => router.push('/edit-profile')} className="btn btn-profile flex-grow-1 fw-bold shadow-sm">Edit profile</button>
                    </div>
                </div>
            </div>

            <div className="profile-tabs">
                <div 
                    className={`profile-tab ${activeTab === 'posts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('posts')}
                >
                    <Grid size={20} className="me-md-2" />
                    <span className="d-none d-md-inline">Posts</span>
                </div>
                <div 
                    className={`profile-tab ${activeTab === 'saved' ? 'active' : ''}`}
                    onClick={() => setActiveTab('saved')}
                >
                    <Bookmark size={20} className="me-md-2" />
                    <span className="d-none d-md-inline">Saved</span>
                </div>
                <div 
                    className={`profile-tab ${activeTab === 'tagged' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tagged')}
                >
                    <UserSquare size={20} className="me-md-2" />
                    <span className="d-none d-md-inline">Tagged</span>
                </div>
            </div>

            {activeTab === 'posts' && (
                <div className="photo-grid">
                    {loading ? (
                        <>
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="skeleton skeleton-image"></div>
                            ))}
                        </>
                    ) : posts.length === 0 ? (
                        <div className="col-12 text-center mt-5 text-muted" style={{ gridColumn: '1 / -1' }}>
                            <Camera size={48} className="mb-3 mx-auto d-block opacity-50" strokeWidth={1} />
                            <h4>No Posts Yet</h4>
                            <p>When you share photos, they will appear on your profile.</p>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <div key={post._id} className="grid-item hover-shadow" onClick={() => { setViewMode('list'); setScrollToPostId(post._id); }}>
                                <Image 
                                    src={post.imageUrl} 
                                    alt={post.caption} 
                                    width={300}
                                    height={300}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/f1f3f5/6c757d?text=Image+Not+Found'; }}
                                />
                                <div className="grid-overlay">
                                    <span className="d-flex align-items-center"><Heart fill="white" size={18} className="me-2" /> {post.likes?.length || 0}</span>
                                    <span className="d-flex align-items-center"><MessageCircle fill="white" size={18} className="me-2" /> {post.comments?.length || 0}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
            
            {activeTab === 'saved' && (
                <div className="photo-grid">
                    {loadingSaved ? (
                        <>
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="skeleton skeleton-image"></div>
                            ))}
                        </>
                    ) : savedPosts.length === 0 ? (
                        <div className="col-12 text-center mt-5 text-muted" style={{ gridColumn: '1 / -1' }}>
                            <Bookmark size={48} className="mb-3 mx-auto d-block opacity-50" strokeWidth={1} />
                            <h4>No Saved Posts</h4>
                            <p>Save photos and videos that you want to see again.</p>
                        </div>
                    ) : (
                        savedPosts.map((post) => (
                            <div key={post._id} className="grid-item hover-shadow" onClick={() => { setViewMode('list'); setScrollToPostId(post._id); }}>
                                <Image 
                                    src={post.imageUrl} 
                                    alt={post.caption} 
                                    width={300}
                                    height={300}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/f1f3f5/6c757d?text=Image+Not+Found'; }}
                                />
                                <div className="grid-overlay">
                                    <span className="d-flex align-items-center"><Heart fill="white" size={18} className="me-2" /> {post.likes?.length || 0}</span>
                                    <span className="d-flex align-items-center"><MessageCircle fill="white" size={18} className="me-2" /> {post.comments?.length || 0}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'tagged' && (
                <div className="photo-grid">
                    {loadingTagged ? (
                        <>
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="skeleton skeleton-image"></div>
                            ))}
                        </>
                    ) : taggedPosts.length === 0 ? (
                        <div className="col-12 text-center mt-5 text-muted" style={{ gridColumn: '1 / -1' }}>
                            <UserSquare size={48} className="mb-3 mx-auto d-block opacity-50" strokeWidth={1} />
                            <h4>Photos of You</h4>
                            <p>When people tag you in photos, they&apos;ll appear here.</p>
                        </div>
                    ) : (
                        taggedPosts.map((post) => (
                            <div key={post._id} className="grid-item hover-shadow" onClick={() => { setViewMode('list'); setScrollToPostId(post._id); }}>
                                <Image 
                                    src={post.imageUrl} 
                                    alt={post.caption} 
                                    width={300}
                                    height={300}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/f1f3f5/6c757d?text=Image+Not+Found'; }}
                                />
                                <div className="grid-overlay">
                                    <span className="d-flex align-items-center"><Heart fill="white" size={18} className="me-2" /> {post.likes?.length || 0}</span>
                                    <span className="d-flex align-items-center"><MessageCircle fill="white" size={18} className="me-2" /> {post.comments?.length || 0}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
            </>
            ) : (
                <div className="profile-feed-view">
                    <div className="sticky-top bg-white p-3 d-flex align-items-center">
                        <button className="btn btn-link text-dark p-0 me-3" onClick={() => { setViewMode('grid'); setScrollToPostId(null); }}>
                            <ArrowLeft size={28} />
                        </button>
                        <h5 className="mb-0 fw-bold text-uppercase">{activeTab === 'posts' ? 'Posts' : activeTab === 'saved' ? 'Saved' : 'Photos of You'}</h5>
                    </div>
                    <div>
                        {(activeTab === 'posts' ? posts : activeTab === 'saved' ? savedPosts : taggedPosts).map(post => (
                            <div key={post._id} id={`post-${post._id}`} className="mb-4" style={{ scrollMarginTop: '70px' }}>
                                <PostCard 
                                    post={post} 
                                    currentUserId={user?._id} 
                                    onLike={handleLike} 
                                    onCommentClick={(p) => setSelectedPost(p)} 
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
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
