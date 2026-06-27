import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import api from '@/utils/apiClient';
import { toast } from 'react-toastify';
import { Heart, MessageCircle, Send, Bookmark, Smile, X, MoreHorizontal, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

const PostModal = ({ posts, initialIndex = 0, onClose, onUpdatePost, hideImageOnMobile = false }) => {
    const [commentText, setCommentText] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const commentInputRef = useRef(null);
    const commentsRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const post = posts?.[currentIndex];

    // Swipe-to-close state
    const [translateY, setTranslateY] = useState(0);
    const touchStartY = useRef(null);
    const isDragging = useRef(false);

    const handleNext = (e) => {
        if (e) e.stopPropagation();
        if (currentIndex < posts.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setCommentText('');
            setReplyingTo(null);
            setTranslateY(0);
        }
    };

    const handlePrev = (e) => {
        if (e) e.stopPropagation();
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setCommentText('');
            setReplyingTo(null);
            setTranslateY(0);
        }
    };

    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') {
                handleNext();
            } else if (e.key === 'ArrowLeft') {
                handlePrev();
            } else if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, posts?.length]);

    React.useEffect(() => {
        if (!post) return;
        const fetchMe = async () => {
            try {
                const { data } = await api.get('/user/me');
                if (data.success && data.user.savedPosts) {
                    setIsSaved(data.user.savedPosts.includes(post._id));
                }
            } catch (err) {
                console.error("Error fetching user data for save status", err);
            }
        };
        fetchMe();
    }, [post]);

    React.useEffect(() => {
        if (post) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [post]);

    const { data: user } = useQuery({ 
        queryKey: ['currentUser'],
        queryFn: async () => {
            const { data } = await api.get('/user/me');
            return data.user;
        }
    });

    if (!post) return null;
    const currentUserId = user?._id || null;
    const hasLiked = currentUserId && post.likes.includes(currentUserId);
    const postOwnerId = post.user?._id || post.user;
    const isOwner = currentUserId && currentUserId === postOwnerId;

    const handleLike = async () => {
        try {
            const { data } = await api.post(`/post/${post._id}/like`);
            if (data.success) {
                // Determine new likes array based on current user
                let newLikes = [...post.likes];
                if (newLikes.includes(currentUserId)) {
                    newLikes = newLikes.filter(id => id !== currentUserId);
                } else {
                    newLikes.push(currentUserId);
                }
                onUpdatePost({ ...post, likes: newLikes });
            }
        } catch (error) {
            console.error("Error liking post", error);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        setLoading(true);
        try {
            if (replyingTo) {
                const { data } = await api.post(`/post/${post._id}/comment/${replyingTo.commentId}/reply`, {
                    text: commentText
                });
                if (data.success) {
                    onUpdatePost(data.post);
                    setCommentText('');
                    setReplyingTo(null);
                }
            } else {
                const { data } = await api.post(`/post/${post._id}/comment`, {
                    text: commentText
                });

                if (data.success) {
                    onUpdatePost(data.post);
                    setCommentText('');
                }
            }
        } catch (error) {
            console.error("Error adding comment", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLikeComment = async (commentId) => {
        try {
            const { data } = await api.post(`/post/${post._id}/comment/${commentId}/like`);
            if (data.success) onUpdatePost(data.post);
        } catch (e) { console.error(e); }
    };

    const [confirmAction, setConfirmAction] = useState(null);

    const handleDeleteComment = (commentId) => {
        setConfirmAction({
            title: "Delete comment?",
            subtitle: "Are you sure you want to delete this comment?",
            onConfirm: async () => {
                try {
                    const { data } = await api.delete(`/post/${post._id}/comment/${commentId}`);
                    if (data.success) onUpdatePost(data.post);
                } catch (e) { console.error(e); }
                finally { setConfirmAction(null); }
            }
        });
    };

    const handleLikeReply = async (commentId, replyId) => {
        try {
            const { data } = await api.post(`/post/${post._id}/comment/${commentId}/reply/${replyId}/like`);
            if (data.success) onUpdatePost(data.post);
        } catch (e) { console.error(e); }
    };

    const handleDeleteReply = (commentId, replyId) => {
        setConfirmAction({
            title: "Delete reply?",
            subtitle: "Are you sure you want to delete this reply?",
            onConfirm: async () => {
                try {
                    const { data } = await api.delete(`/post/${post._id}/comment/${commentId}/reply/${replyId}`);
                    if (data.success) onUpdatePost(data.post);
                } catch (e) { console.error(e); }
                finally { setConfirmAction(null); }
            }
        });
    };

    const handleDeletePost = () => {
        setConfirmAction({
            title: "Delete post?",
            subtitle: "Are you sure you want to delete this post?",
            onConfirm: async () => {
                try {
                    const { data } = await api.delete(`/post/${post._id}`);
                    if (data.success) {
                        onUpdatePost({ _id: post._id, _deleted: true });
                        onClose();
                    }
                } catch (error) {
                    console.error("Error deleting post", error);
                } finally {
                    setConfirmAction(null);
                }
            }
        });
    };

    const handleSavePost = async () => {
        try {
            const { data } = await api.post(`/user/save/${post._id}`);
            if (data.success) {
                setIsSaved(data.savedPosts.includes(post._id));
            }
        } catch (error) {
            console.error("Error saving post", error);
        }
    };

    // Touch handlers for mobile swipe-to-close
    const handleTouchStart = (e) => {
        // Only track single touches
        if (e.touches.length !== 1) return;
        
        // Don't drag if we are inside the scrollable comments and not at the top
        if (commentsRef.current && commentsRef.current.contains(e.target) && commentsRef.current.scrollTop > 0) {
            return;
        }
        
        touchStartY.current = e.touches[0].clientY;
        isDragging.current = true;
    };

    const handleTouchMove = (e) => {
        if (!isDragging.current || touchStartY.current === null) return;

        // If they scroll down inside comments, abort dragging the modal
        if (commentsRef.current && commentsRef.current.contains(e.target) && commentsRef.current.scrollTop > 0) {
            isDragging.current = false;
            setTranslateY(0);
            return;
        }

        const currentY = e.touches[0].clientY;
        const diff = currentY - touchStartY.current;

        // Only allow dragging downwards
        if (diff > 0) {
            setTranslateY(diff);
        }
    };

    const handleTouchEnd = () => {
        if (!isDragging.current) return;
        
        if (translateY > 150) {
            onClose();
        } else {
            setTranslateY(0); // Snap back
        }
        
        isDragging.current = false;
        touchStartY.current = null;
    };

    return (
        <div className="post-modal-overlay" onClick={onClose}>
            <button className="post-modal-close" onClick={onClose}>
                <X size={28} color="white" />
            </button>
            
            {currentIndex > 0 && (
                <button className="post-modal-nav-btn prev d-none d-md-flex" onClick={handlePrev}>
                    <ChevronLeft size={36} color="white" />
                </button>
            )}
            
            {currentIndex < posts.length - 1 && (
                <button className="post-modal-nav-btn next d-none d-md-flex" onClick={handleNext}>
                    <ChevronRight size={36} color="white" />
                </button>
            )}

            <div 
                className="post-modal-content" 
                onClick={e => e.stopPropagation()}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ 
                    transform: translateY !== 0 ? `translateY(${translateY}px)` : undefined, 
                    transition: translateY !== 0 ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)' 
                }}
            >
                {/* Mobile Drag Handle */}
                <div className="d-flex d-md-none justify-content-center py-2 bg-white" style={{ borderRadius: '16px 16px 0 0' }}>
                    <div style={{ width: '40px', height: '4px', backgroundColor: 'var(--border-color)', borderRadius: '4px' }}></div>
                </div>

                <div className="d-flex flex-column flex-md-row h-100 w-100 flex-grow-1 overflow-hidden bg-black">
                    {/* Top/Left: Image (Visible on all screens, unless hidden on mobile) */}
                    <div className={`post-modal-image-container bg-black align-items-center justify-content-center p-0 ${hideImageOnMobile ? 'd-none d-md-flex' : 'd-flex'}`} style={{ position: 'relative' }}>
                        <div className="position-relative w-100 h-100 d-flex align-items-center justify-content-center">
                            <Image 
                                src={post.imageUrl} 
                                alt={post.caption} 
                                fill
                                sizes="(max-width: 768px) 100vw, 60vw"
                                style={{ objectFit: 'contain' }}
                                onDoubleClick={handleLike}
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/000000/FFFFFF?text=Image+Not+Found'; }}
                                priority
                            />
                        </div>
                    </div>

                    {/* Bottom/Right: Details & Comments */}
                    <div className="post-modal-details d-flex flex-column bg-white border-start-md">
                        {/* Header & Caption */}
                        <div className="post-modal-header p-3 border-bottom d-flex align-items-center justify-content-between bg-white z-1 shadow-sm">
                            <div className="d-flex align-items-center">
                                <Image 
                                    src={post.user?.profilePicture || `https://ui-avatars.com/api/?name=${post.user?.username || 'User'}&background=random&color=fff&rounded=true&bold=true`} 
                                    alt="avatar" 
                                    width={32}
                                    height={32}
                                    className="post-avatar me-2" 
                                    style={{ flexShrink: 0 }}
                                />
                                <div>
                                    <span className="fw-bold me-2">{post.user?.username || 'Unknown User'}</span>
                                    {post.caption && <span>{post.caption}</span>}
                                </div>
                            </div>
                            <div className="position-relative">
                                <button onClick={() => setShowMenu(!showMenu)} className="btn btn-link text-dark p-0 shadow-none border-0" style={{ background: 'transparent' }}>
                                    <MoreHorizontal size={24} />
                                </button>
                                {showMenu && (
                                    <div className="position-absolute bg-white shadow rounded border p-2" style={{ right: 0, top: '30px', zIndex: 10, minWidth: '120px' }}>
                                        {isOwner ? (
                                            <button onClick={handleDeletePost} className="btn btn-sm btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2">
                                                <Trash2 size={16}/> Delete
                                            </button>
                                        ) : (
                                            <div className="text-muted small text-center px-2 py-1">No actions</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Comments Section (Scrollable) */}
                        <div 
                            className="post-modal-comments p-3 flex-grow-1 overflow-auto" 
                            style={{ minHeight: '200px' }}
                            ref={commentsRef}
                        >
                            {/* Actual Comments */}
                            {post.comments && post.comments.length > 0 ? (
                                post.comments.map((comment, idx) => (
                                    <div key={idx} className="comment-thread mb-3">
                                        <div className="comment mb-1 d-flex justify-content-between w-100">
                                            <div className="d-flex w-100">
                                                <Image 
                                                    src={comment.user?.profilePicture || `https://ui-avatars.com/api/?name=${comment.user?.username || 'User'}&background=random&color=fff&rounded=true&bold=true`} 
                                                    alt="avatar" 
                                                    width={32}
                                                    height={32}
                                                    className="post-avatar me-2" 
                                                    style={{ flexShrink: 0 }}
                                                />
                                                <div className="flex-grow-1">
                                                    <span className="fw-bold me-2">{comment.user?.username || 'Unknown User'}</span>
                                                    <span>{comment.text}</span>
                                                    <div className="d-flex mt-1 text-muted gap-3" style={{ fontSize: '12px', fontWeight: '500' }}>
                                                        <span style={{ cursor: 'pointer' }} onClick={() => { setReplyingTo({ commentId: comment._id, username: comment.user?.username }); commentInputRef.current?.focus(); }}>Reply</span>
                                                        {(currentUserId === (comment.user?._id || comment.user) || isOwner) && (
                                                            <span style={{ cursor: 'pointer' }} onClick={() => handleDeleteComment(comment._id)}>Delete</span>
                                                        )}
                                                        {comment.likes?.length > 0 && <span>{comment.likes.length} {comment.likes.length === 1 ? 'like' : 'likes'}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleLikeComment(comment._id)} 
                                                className="btn btn-link p-0 text-dark ms-2 align-self-start mt-1" 
                                                style={{ border: 'none', background: 'transparent' }}
                                            >
                                                <Heart size={14} fill={comment.likes?.includes(currentUserId) ? '#ed4956' : 'none'} color={comment.likes?.includes(currentUserId) ? '#ed4956' : '#8e8e8e'} />
                                            </button>
                                        </div>

                                        {/* Render Replies */}
                                        {comment.replies && comment.replies.length > 0 && (
                                            <div className="ms-5 mt-2">
                                                {comment.replies.map((reply, rIdx) => (
                                                    <div key={rIdx} className="reply mb-2 d-flex justify-content-between w-100">
                                                        <div className="d-flex w-100">
                                                            <Image 
                                                                src={reply.user?.profilePicture || `https://ui-avatars.com/api/?name=${reply.user?.username || 'User'}&background=random&color=fff&rounded=true&bold=true`} 
                                                                alt="avatar" 
                                                                width={24}
                                                                height={24}
                                                                className="post-avatar me-2" 
                                                                style={{ flexShrink: 0 }}
                                                            />
                                                            <div className="flex-grow-1">
                                                                <span className="fw-bold me-2" style={{ fontSize: '13px' }}>{reply.user?.username || 'Unknown User'}</span>
                                                                <span style={{ fontSize: '13px' }}>{reply.text}</span>
                                                                <div className="d-flex mt-1 text-muted gap-3" style={{ fontSize: '12px', fontWeight: '500' }}>
                                                                    {(currentUserId === (reply.user?._id || reply.user) || isOwner) && (
                                                                        <span style={{ cursor: 'pointer' }} onClick={() => handleDeleteReply(comment._id, reply._id)}>Delete</span>
                                                                    )}
                                                                    {reply.likes?.length > 0 && <span>{reply.likes.length} {reply.likes.length === 1 ? 'like' : 'likes'}</span>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            onClick={() => handleLikeReply(comment._id, reply._id)} 
                                                            className="btn btn-link p-0 text-dark ms-2 align-self-start mt-1" 
                                                            style={{ border: 'none', background: 'transparent' }}
                                                        >
                                                            <Heart size={14} fill={reply.likes?.includes(currentUserId) ? '#ed4956' : 'none'} color={reply.likes?.includes(currentUserId) ? '#ed4956' : '#8e8e8e'} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-muted mt-4">
                                    <small>No comments yet. Be the first to comment!</small>
                                </div>
                            )}
                        </div>

                        {/* Actions (Like, Share, etc.) */}
                        <div className="post-modal-actions p-3 border-top">
                            <div className="d-flex justify-content-between mb-2">
                                <div className="d-flex align-items-center">
                                    <button 
                                        className={`action-btn ${hasLiked ? 'liked' : ''}`}
                                        onClick={handleLike}
                                        style={{ padding: 0, marginRight: '15px', border: 'none', background: 'transparent' }}
                                    >
                                        <Heart size={26} fill={hasLiked ? '#ed4956' : 'none'} color={hasLiked ? '#ed4956' : 'currentColor'} />
                                    </button>
                                    <button 
                                        className="action-btn" 
                                        onClick={() => commentInputRef.current?.focus()}
                                        style={{ padding: 0, marginRight: '15px', border: 'none', background: 'transparent' }}
                                    >
                                        <MessageCircle size={26} />
                                    </button>
                                    <button className="action-btn" style={{ padding: 0, border: 'none', background: 'transparent' }}>
                                        <Send size={26} />
                                    </button>
                                </div>
                                <button className="action-btn" onClick={handleSavePost} style={{ padding: 0, border: 'none', background: 'transparent' }}>
                                    <Bookmark size={26} fill={isSaved ? 'currentColor' : 'none'} color="currentColor" />
                                </button>
                            </div>
                            <div className="fw-bold mb-1">
                                {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
                            </div>
                            <small className="text-muted text-uppercase" style={{ fontSize: '10px' }}>
                                {new Date(post.createdAt).toLocaleDateString()}
                            </small>
                        </div>

                        {/* Add Comment Input */}
                        <div className="post-modal-add-comment border-top p-3 flex-column align-items-stretch">
                            {replyingTo && (
                                <div className="d-flex justify-content-between text-muted mb-2 px-2" style={{ fontSize: '13px' }}>
                                    <span>Replying to <span className="fw-bold">@{replyingTo.username}</span></span>
                                    <button className="btn btn-link p-0 text-muted" onClick={() => setReplyingTo(null)} style={{ fontSize: '13px', textDecoration: 'none' }}><X size={14}/></button>
                                </div>
                            )}
                            <div className="d-flex align-items-center w-100">
                                <Smile size={26} className="me-3 text-muted flex-shrink-0" />
                                <form onSubmit={handleCommentSubmit} className="flex-grow-1 d-flex">
                                    <input 
                                        ref={commentInputRef}
                                        type="text" 
                                        className="form-control border-0 shadow-none" 
                                        placeholder={replyingTo ? `Add a reply...` : "Add a comment..."} 
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        disabled={loading}
                                        style={{ paddingLeft: '0' }}
                                    />
                                    <button 
                                        type="submit" 
                                        className="btn btn-link fw-bold text-primary text-decoration-none p-0 ms-2"
                                        disabled={!commentText.trim() || loading}
                                    >
                                        {loading ? '...' : 'Post'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmModal 
                isOpen={!!confirmAction} 
                title={confirmAction?.title} 
                subtitle={confirmAction?.subtitle}
                onConfirm={confirmAction?.onConfirm} 
                onCancel={() => setConfirmAction(null)} 
            />
        </div>
    );
};

export default PostModal;
