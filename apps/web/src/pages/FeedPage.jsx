import React, { useState, useEffect } from 'react';
import PostComposer from '../components/feed/PostComposer';
import PostCard from '../components/feed/PostCard';
import { api } from '../lib/api';
import './FeedPage.css';

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/posts');
      if (res.success && res.data) {
        setPosts(res.data);
      }
    } catch (err) {
      console.error('Error al cargar posts:', err);
      setError('No se pudieron cargar las publicaciones del feed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (newPostData) => {
    try {
      let response;
      
      // Si tiene archivo adjunto (media), enviamos como multipart/form-data
      if (newPostData.media) {
        const formData = new FormData();
        formData.append('content', newPostData.content);
        formData.append('media', newPostData.media);
        if (newPostData.achievementId) {
          formData.append('achievementId', newPostData.achievementId);
        }

        const token = localStorage.getItem('session_token');
        const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        
        const res = await fetch(`${BASE}/api/posts`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        response = await res.json();
        if (!res.ok) throw new Error(response.error || 'Error al crear post');
      } else {
        // Enviar como JSON simple
        response = await api.post('/api/posts', {
          content: newPostData.content,
          achievementId: newPostData.achievementId
        });
      }

      if (response.success && response.data) {
        // Recargar o prepender el nuevo post
        // Para asegurar que tiene la data completa del autor mapeada por el backend, recargamos
        fetchPosts();
      }
    } catch (err) {
      console.error('Error al crear post:', err);
      alert('Error al publicar: ' + err.message);
    }
  };

  return (
    <div className="feed-page-container">
      <div className="feed-layout container">
        <aside className="feed-sidebar left">
          <div className="card-glass profile-summary">
            <div className="avatar-placeholder-lg"></div>
            <h3>Tu Perfil</h3>
            <p>Profesional de Aldebarán</p>
            <div className="stats">
              <div>
                <span>Conexiones</span>
                <strong>42</strong>
              </div>
            </div>
          </div>
        </aside>
        
        <main className="feed-main">
          <PostComposer onPostCreate={handleCreatePost} />
          
          {error && <div className="error-message-feed">{error}</div>}
          
          {loading ? (
            <div className="loading-feed">Cargando publicaciones...</div>
          ) : (
            <div className="posts-container">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
              {posts.length === 0 && (
                <div className="empty-feed">Aún no hay publicaciones. ¡Sé el primero en compartir!</div>
              )}
            </div>
          )}
        </main>
        
        <aside className="feed-sidebar right">
          <div className="card-glass recommendations">
            <h3>Tendencias Tech</h3>
            <ul>
              <li>#ReactJS</li>
              <li>#Web3</li>
              <li>#AI</li>
              <li>#TypeScript</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default FeedPage;

