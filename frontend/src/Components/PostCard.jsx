import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, MessageCircle, Send, MoreHorizontal, Trash2 } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

const PostCard = ({ post, currentUserId, onLike, onCommentClick }) => {
    const hasLiked = currentUserId && post.likes.includes(currentUserId);
    const [showMenu, setShowMenu] = useState(false);
    const [showHeart, setShowHeart] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const isOwner = currentUserId && (currentUserId === (post.user?._id || post.user));

    const handleDoubleClick = () => {
        if (onLike) onLike(post._id);
        setShowHeart(true);
        setTimeout(() => {
            setShowHeart(false);
        }, 1000);
    };

    const handleDelete = async () => {
        try {
            const api = (await import('@/utils/apiClient')).default;
            const { data } = await api.delete(`/post/${post._id}`);
            if (data.success && onLike) {
                window.location.reload();
            }
        } catch (error) {
            console.error("Error deleting post", error);
        } finally {
            setShowConfirm(false);
        }
    };

    return (
        <div className="post-card">
          <div className="post-header d-flex justify-content-between align-items-center p-3">
            <div className="d-flex align-items-center">
                <Image 
                  src={post.user?.profilePicture || `https://ui-avatars.com/api/?name=${post.user?.username || 'User'}&background=random&color=fff&rounded=true&bold=true`} 
                  alt="avatar" 
                  width={44}
                  height={44}
                  className="post-avatar me-2" 
                />
                <span className="post-username fw-bold">{post.user?.username || 'Unknown User'}</span>
            </div>
            <div className="position-relative">
                <button onClick={() => setShowMenu(!showMenu)} className="btn btn-link text-dark p-0 shadow-none border-0" style={{ background: 'transparent' }}>
                    <MoreHorizontal size={24} />
                </button>
                {showMenu && (
                    <div className="position-absolute bg-white shadow rounded border p-2" style={{ right: 0, top: '30px', zIndex: 10, minWidth: '120px' }}>
                        {isOwner ? (
                            <button onClick={() => { setShowConfirm(true); setShowMenu(false); }} className="btn btn-sm btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2">
                                <Trash2 size={16}/> Delete
                            </button>
                        ) : (
                            <div className="text-muted small text-center px-2 py-1">No actions</div>
                        )}
                    </div>
                )}
            </div>
          </div>
          <ConfirmModal 
              isOpen={showConfirm} 
              title="Delete post?" 
              subtitle="Are you sure you want to delete this post?"
              onConfirm={handleDelete} 
              onCancel={() => setShowConfirm(false)} 
          />
          
          <div className="position-relative d-flex justify-content-center align-items-center px-3 mb-2">
            <Image 
              src={post.imageUrl} 
              alt="Post content" 
              width={0}
              height={0}
              sizes="100vw"
              className="post-image shadow-sm" 
              style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'cover', borderRadius: '12px' }}
              onDoubleClick={handleDoubleClick}
            />
            {showHeart && (
                <div className="position-absolute top-50 start-50 translate-middle pointer-events-none">
                    <Heart size={80} fill="white" color="white" className="heart-burst-animation" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }} />
                </div>
            )}
          </div>
          
          <div className="post-actions">
            <button 
              className={`action-btn ${hasLiked ? 'liked' : ''}`}
              onClick={() => onLike && onLike(post._id)}
            >
              <Heart size={26} fill={hasLiked ? '#ed4956' : 'none'} color={hasLiked ? '#ed4956' : 'currentColor'} />
            </button>
            <button className="action-btn" onClick={() => onCommentClick && onCommentClick(post)}>
              <MessageCircle size={26} />
            </button>
            <button className="action-btn">
              <Send size={26} />
            </button>
          </div>
          
          <div className="post-likes">
            {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
          </div>
          
          <div className="post-caption">
            <strong>{post.user?.username || 'Unknown User'}</strong> {post.caption}
          </div>
        </div>
    );
};

export default PostCard;
