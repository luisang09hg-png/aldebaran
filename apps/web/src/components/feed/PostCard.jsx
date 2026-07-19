import React, { useState } from 'react';
import { api } from '../../lib/api';
import './PostCard.css';

const PostCard = ({ post }) => {
  const reactionCount = post.reactions?.length || 0;
  const [likes, setLikes] = useState(post.likesCount || reactionCount);
  const [isLiked, setIsLiked] = useState(
    post.reactions?.some(r => r.userId === parseInt(localStorage.getItem('userId'), 10)) || false
  );
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [commentsList, setCommentsList] = useState(post.comments || []);

  const handleLike = async () => {
    try {
      const res = await api.post(`/api/posts/${post.id}/react`, { type: 'like' });
      if (res.data && res.data.status === 'added') {
        setLikes(likes + 1);
        setIsLiked(true);
      } else {
        setLikes(Math.max(0, likes - 1));
        setIsLiked(false);
      }
    } catch (err) {
      console.error('Error al reaccionar al post:', err);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    setCommentsList([...commentsList, { id: Date.now(), text: comment, author: 'Tú' }]);
    setComment('');
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const authorName = post.author?.fullName || post.author?.profile?.name || 'Profesional de Aldebarán';
  const avatarUrl = post.author?.profile?.avatarUrl;

  return (
    <div className="post-card card-glass animate-slide-up">
      <div className="post-header">
        {avatarUrl ? (
          <img src={avatarUrl} alt={authorName} className="avatar-img-sm" />
        ) : (
          <div className="avatar-placeholder-sm"></div>
        )}
        <div className="post-meta">
          <h4 className="post-author">{authorName}</h4>
          <span className="post-time">{formatTime(post.createdAt || post.timestamp)}</span>
        </div>
      </div>
      
      <div className="post-content">
        <p>{post.content}</p>
      </div>

      {/* Renderizado de Logro Vinculado */}
      {post.achievement && (
        <div className="post-achievement-card">
          <div className="achievement-badge-container">
            <span className="achievement-icon">🏆</span>
            <span className={`achievement-status-badge ${post.achievement.status}`}>
              {post.achievement.status === 'verified' ? '✓ Verificado' : 'Logro'}
            </span>
          </div>
          <div className="achievement-details">
            <h5 className="achievement-title">{post.achievement.title}</h5>
            {post.achievement.description && (
              <p className="achievement-desc">{post.achievement.description}</p>
            )}
            {post.achievement.fileUrl && (
              <a 
                href={post.achievement.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="achievement-doc-link"
              >
                📄 Ver Documento Adjunto
              </a>
            )}
          </div>
        </div>
      )}
      
      {post.mediaUrl && (
        <div className="post-media">
          {post.mediaUrl.endsWith('.zip') ? (
            <div className="zip-attachment">
              <span className="zip-icon">📁</span>
              <a href={`http://localhost:3000${post.mediaUrl}`} download className="zip-link">
                Descargar Adjunto (ZIP)
              </a>
            </div>
          ) : (
            <img src={`http://localhost:3000${post.mediaUrl}`} alt="Post media" />
          )}
        </div>
      )}

      <div className="post-stats">
        <span>{likes} {likes === 1 ? 'Me gusta' : 'Me gustas'}</span>
        <span>{commentsList.length} Comentarios</span>
      </div>

      <div className="post-actions">
        <button className={`action-btn ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
          {isLiked ? '♥ Te gusta' : '♡ Me gusta'}
        </button>
        <button className="action-btn" onClick={() => setShowComments(!showComments)}>
          💬 Comentar
        </button>
        <button className="action-btn">
          ↗ Compartir
        </button>
      </div>

      {showComments && (
        <div className="post-comments">
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <input 
              type="text" 
              placeholder="Escribe un comentario..." 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="comment-input"
            />
            <button type="submit" className="comment-submit" disabled={!comment.trim()}>Publicar</button>
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

