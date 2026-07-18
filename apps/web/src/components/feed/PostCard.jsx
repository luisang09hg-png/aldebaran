import React, { useState } from 'react';
import './PostCard.css';

const PostCard = ({ post }) => {
  const [likes, setLikes] = useState(post.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [commentsList, setCommentsList] = useState(post.comments || []);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    setCommentsList([...commentsList, { id: Date.now(), text: comment, author: 'You' }]);
    setComment('');
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  return (
    <div className="post-card card-glass animate-slide-up">
      <div className="post-header">
        <div className="avatar-placeholder-sm"></div>
        <div className="post-meta">
          <h4 className="post-author">{post.author || 'Anonymous'}</h4>
          <span className="post-time">{formatTime(post.timestamp)}</span>
        </div>
      </div>
      
      <div className="post-content">
        <p>{post.content}</p>
      </div>
      
      {post.mediaUrl && (
        <div className="post-media">
          {post.mediaType === 'image' ? (
            <img src={post.mediaUrl} alt="Post media" />
          ) : (
            <div className="zip-attachment">
              <span className="zip-icon">📁</span>
              <a href={post.mediaUrl} download className="zip-link">Download Attachment (ZIP)</a>
            </div>
          )}
        </div>
      )}

      <div className="post-stats">
        <span>{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
        <span>{commentsList.length} Comments</span>
      </div>

      <div className="post-actions">
        <button className={`action-btn ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
          {isLiked ? '♥ Liked' : '♡ Like'}
        </button>
        <button className="action-btn" onClick={() => setShowComments(!showComments)}>
          💬 Comment
        </button>
        <button className="action-btn">
          ↗ Share
        </button>
      </div>

      {showComments && (
        <div className="post-comments">
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <input 
              type="text" 
              placeholder="Add a comment..." 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="comment-input"
            />
            <button type="submit" className="comment-submit" disabled={!comment.trim()}>Post</button>
          </form>
          
          <div className="comments-list">
            {commentsList.map(c => (
              <div key={c.id} className="comment-item">
                <span className="comment-author">{c.author}: </span>
                <span className="comment-text">{c.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
